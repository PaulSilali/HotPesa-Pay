import { Injectable, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import type {
  AuditEventV1,
  JourneySessionV1,
  MockPaymentScenario,
  PaymentState,
  ProviderEvidenceV1,
} from '@hotpesa/contracts';
import { Pool } from 'pg';
import { runMigrations } from '../../persistence/migrations.js';

export interface StoredPayment {
  readonly id: string;
  readonly journeySessionId: string;
  readonly tripId?: string;
  readonly destinationStageId?: string;
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
    await runMigrations(this.pool);
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
        id, journey_session_id, trip_id, destination_stage_id, amount_minor, currency, fare_version_id, status, scenario,
        masked_phone_number, idempotency_key, request_fingerprint, provider_request_id,
        created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status,
        provider_request_id = EXCLUDED.provider_request_id, updated_at = EXCLUDED.updated_at`,
      [
        payment.id,
        payment.journeySessionId,
        payment.tripId ?? null,
        payment.destinationStageId ?? null,
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

  async recordProviderEvent(event: ProviderEvidenceV1): Promise<boolean> {
    if (this.providerEventIds.has(event.eventId)) return false;
    if (!this.pool) {
      this.providerEventIds.add(event.eventId);
      return true;
    }
    const inserted = await this.enqueue<{ event_id: string }>(
      `INSERT INTO provider_events (event_id, provider_request_id, outcome, occurred_at)
       VALUES ($1,$2,$3,$4) ON CONFLICT (event_id) DO NOTHING RETURNING event_id`,
      [event.eventId, event.providerRequestId, event.outcome, event.occurredAt],
    );
    if (inserted.rowCount === 0) return false;
    this.providerEventIds.add(event.eventId);
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
    void this.enqueue(sql, values);
  }

  private async enqueue<Row extends Record<string, unknown> = Record<string, unknown>>(sql: string, values: readonly unknown[]): Promise<{ rowCount: number; rows: Row[] }> {
    if (!this.pool) return { rowCount: 0, rows: [] };
    let result: { rowCount: number | null; rows: Row[] } | undefined;
    this.pendingWrite = this.pendingWrite.then(async () => {
      result = await this.pool?.query<Row>(sql, [...values]);
    });
    await this.pendingWrite;
    return { rowCount: result?.rowCount ?? 0, rows: result?.rows ?? [] };
  }

  private async loadSnapshot(): Promise<void> {
    const paymentRows = await this.pool?.query<{
      id: string;
      journey_session_id: string;
      trip_id: string | null;
      destination_stage_id: string | null;
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
        ...(row.trip_id ? { tripId: row.trip_id } : {}),
        ...(row.destination_stage_id ? { destinationStageId: row.destination_stage_id } : {}),
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
