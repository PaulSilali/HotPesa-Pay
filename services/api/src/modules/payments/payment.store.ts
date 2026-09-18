import { Injectable, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import type {
  AuditEventV1,
  JourneySessionV1,
  MockPaymentScenario,
  PaymentState,
  ProviderEvidenceV1,
} from '@hotpesa/contracts';
import { Pool } from 'pg';

export interface StoredPayment {
  readonly id: string;
  readonly journeySessionId: string;
  readonly amountMinor: number;
  readonly currency: 'KES';
  readonly fareVersionId: string;
  readonly status: PaymentState;
  readonly scenario: MockPaymentScenario;
  readonly maskedPhoneNumber: string;
  readonly idempotencyKey: string;
  readonly requestFingerprint: string;
  readonly providerRequestId?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export const developmentJourney: JourneySessionV1 = {
  id: 'journey-session-demo',
  publicCode: 'demo-nairobi-cbd-westlands',
  routeLabel: 'Nairobi CBD → Westlands',
  vehicleLabel: 'Demo Matatu KAA 000D',
  saccoLabel: 'HotPesa Demo SACCO',
  fare: {
    amountMinor: 8_000,
    currency: 'KES',
    fareVersionId: 'fare-demo-v1',
    effectiveFrom: '2026-09-19T00:00:00.000Z',
  },
};

@Injectable()
export class PaymentStore implements OnModuleInit, OnApplicationShutdown {
  private readonly payments = new Map<string, StoredPayment>();
  private readonly paymentIdByIdempotencyKey = new Map<string, string>();
  private readonly providerEventIds = new Set<string>();
  private readonly auditEvents: AuditEventV1[] = [];
  private pool?: Pool;
  private pendingWrite: Promise<void> = Promise.resolve();

  async onModuleInit(): Promise<void> {
    if (process.env.HOTPESA_STORE !== 'postgres') return;
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is required when HOTPESA_STORE=postgres');
    this.pool = new Pool({ connectionString, max: 5 });
    await this.createSchema();
    await this.loadSnapshot();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.flush();
    await this.pool?.end();
  }

  journeyByPublicCode(publicCode: string): JourneySessionV1 | undefined {
    return publicCode === developmentJourney.publicCode ? developmentJourney : undefined;
  }

  paymentById(id: string): StoredPayment | undefined {
    return this.payments.get(id);
  }

  paymentByIdempotencyKey(key: string): StoredPayment | undefined {
    const id = this.paymentIdByIdempotencyKey.get(key);
    return id ? this.payments.get(id) : undefined;
  }

  savePayment(payment: StoredPayment): void {
    this.payments.set(payment.id, payment);
    this.paymentIdByIdempotencyKey.set(payment.idempotencyKey, payment.id);
    this.queue(
      `INSERT INTO payment_attempts (
        id, journey_session_id, amount_minor, currency, fare_version_id, status, scenario,
        masked_phone_number, idempotency_key, request_fingerprint, provider_request_id,
        created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status,
        provider_request_id = EXCLUDED.provider_request_id, updated_at = EXCLUDED.updated_at`,
      [
        payment.id,
        payment.journeySessionId,
        payment.amountMinor,
        payment.currency,
        payment.fareVersionId,
        payment.status,
        payment.scenario,
        payment.maskedPhoneNumber,
        payment.idempotencyKey,
        payment.requestFingerprint,
        payment.providerRequestId ?? null,
        payment.createdAt,
        payment.updatedAt,
      ],
    );
  }

  recordProviderEvent(event: ProviderEvidenceV1): boolean {
    if (this.providerEventIds.has(event.eventId)) return false;
    this.providerEventIds.add(event.eventId);
    this.queue(
      `INSERT INTO provider_events (event_id, provider_request_id, outcome, occurred_at)
       VALUES ($1,$2,$3,$4) ON CONFLICT (event_id) DO NOTHING`,
      [event.eventId, event.providerRequestId, event.outcome, event.occurredAt],
    );
    return true;
  }

  appendAudit(event: AuditEventV1): void {
    this.auditEvents.push(event);
    this.queue(
      `INSERT INTO audit_events (id, type, payment_attempt_id, occurred_at, details)
       VALUES ($1,$2,$3,$4,$5::jsonb)`,
      [event.id, event.type, event.paymentAttemptId, event.occurredAt, JSON.stringify(event.details)],
    );
  }

  listPayments(): readonly StoredPayment[] {
    return [...this.payments.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  listAuditEvents(): readonly AuditEventV1[] {
    return [...this.auditEvents].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }

  async flush(): Promise<void> {
    await this.pendingWrite;
  }

  private queue(sql: string, values: readonly unknown[]): void {
    if (!this.pool) return;
    this.pendingWrite = this.pendingWrite.then(async () => {
      await this.pool?.query(sql, [...values]);
    });
  }

  private async createSchema(): Promise<void> {
    await this.pool?.query(`
      CREATE TABLE IF NOT EXISTS payment_attempts (
        id text PRIMARY KEY,
        journey_session_id text NOT NULL,
        amount_minor integer NOT NULL CHECK (amount_minor > 0),
        currency text NOT NULL CHECK (currency = 'KES'),
        fare_version_id text NOT NULL,
        status text NOT NULL,
        scenario text NOT NULL,
        masked_phone_number text NOT NULL,
        idempotency_key text NOT NULL UNIQUE,
        request_fingerprint text NOT NULL,
        provider_request_id text,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS provider_events (
        event_id text PRIMARY KEY,
        provider_request_id text NOT NULL,
        outcome text NOT NULL,
        occurred_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS audit_events (
        id text PRIMARY KEY,
        type text NOT NULL,
        payment_attempt_id text NOT NULL,
        occurred_at timestamptz NOT NULL,
        details jsonb NOT NULL
      );
    `);
  }

  private async loadSnapshot(): Promise<void> {
    const paymentRows = await this.pool?.query<{
      id: string;
      journey_session_id: string;
      amount_minor: number;
      currency: 'KES';
      fare_version_id: string;
      status: PaymentState;
      scenario: MockPaymentScenario;
      masked_phone_number: string;
      idempotency_key: string;
      request_fingerprint: string;
      provider_request_id: string | null;
      created_at: Date;
      updated_at: Date;
    }>('SELECT * FROM payment_attempts');
    for (const row of paymentRows?.rows ?? []) {
      const payment: StoredPayment = {
        id: row.id,
        journeySessionId: row.journey_session_id,
        amountMinor: row.amount_minor,
        currency: row.currency,
        fareVersionId: row.fare_version_id,
        status: row.status,
        scenario: row.scenario,
        maskedPhoneNumber: row.masked_phone_number,
        idempotencyKey: row.idempotency_key,
        requestFingerprint: row.request_fingerprint,
        ...(row.provider_request_id ? { providerRequestId: row.provider_request_id } : {}),
        createdAt: row.created_at.toISOString(),
        updatedAt: row.updated_at.toISOString(),
      };
      this.payments.set(payment.id, payment);
      this.paymentIdByIdempotencyKey.set(payment.idempotencyKey, payment.id);
    }

    const providerRows = await this.pool?.query<{ event_id: string }>('SELECT event_id FROM provider_events');
    for (const row of providerRows?.rows ?? []) this.providerEventIds.add(row.event_id);

    const auditRows = await this.pool?.query<{
      id: string;
      type: AuditEventV1['type'];
      payment_attempt_id: string;
      occurred_at: Date;
      details: AuditEventV1['details'];
    }>('SELECT * FROM audit_events');
    for (const row of auditRows?.rows ?? []) {
      this.auditEvents.push({
        id: row.id,
        type: row.type,
        paymentAttemptId: row.payment_attempt_id,
        occurredAt: row.occurred_at.toISOString(),
        details: row.details,
      });
    }
  }
}
