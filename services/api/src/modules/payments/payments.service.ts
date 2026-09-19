import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  InitiatePaymentV1,
  PaymentAttemptV1,
  PaymentState,
  ProviderEvidenceV1,
} from '@hotpesa/contracts';
import { createHash, randomUUID } from 'node:crypto';
import { AuditService } from '../audit/audit.service.js';
import { FareService } from '../fares/fare.service.js';
import { JourneyService } from '../journeys/journey.service.js';
import { MockMpesaProvider } from './mock-mpesa.provider.js';
import { transitionPayment } from './payment-state.js';
import { PaymentStore, type StoredPayment } from './payment.store.js';

const KENYAN_SANDBOX_PHONE = /^\+254(?:7|1)\d{8}$/;

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PaymentStore) private readonly store: PaymentStore,
    @Inject(MockMpesaProvider) private readonly provider: MockMpesaProvider,
    @Inject(AuditService) private readonly audit: AuditService,
    @Inject(FareService) private readonly fares: FareService = new FareService(new JourneyService()),
    @Inject(JourneyService) private readonly journeys: JourneyService = new JourneyService(),
  ) {}

  async initiate(command: InitiatePaymentV1, idempotencyKey: string): Promise<PaymentAttemptV1> {
    this.validateInitiation(command, idempotencyKey);
    const sessionTrip = command.journeySessionId ? this.journeys.tripForActiveSession(command.journeySessionId) : undefined;
    const effectiveTripId = command.tripId ?? sessionTrip?.id;
    const tripQuote = effectiveTripId && command.destinationStageId
      ? this.fares.quote(effectiveTripId, command.destinationStageId)
      : undefined;
    const journeySessionId = command.journeySessionId ?? 'journey-session-demo';
    const journey = (command.journeySessionId ? this.journeys.journeySessionById(command.journeySessionId) : undefined) ?? this.store.journeyByPublicCode(
      journeySessionId === 'journey-session-demo'
        ? 'demo-nairobi-cbd-westlands'
        : journeySessionId,
    );
    if (!journey || (journey.id !== journeySessionId && journey.publicCode !== journeySessionId)) {
      throw new NotFoundException('Journey session not found');
    }

    const requestFingerprint = this.fingerprint(command);
    const existing = this.store.paymentByIdempotencyKey(idempotencyKey);
    if (existing) {
      if (existing.requestFingerprint !== requestFingerprint) {
        throw new ConflictException('Idempotency key was already used for a different request');
      }
      return this.publicPayment(existing);
    }

    const now = new Date().toISOString();
    let payment: StoredPayment = {
      id: randomUUID(),
      journeySessionId: journey.id,
      ...(effectiveTripId ? { tripId: effectiveTripId } : {}),
      ...(command.destinationStageId ? { destinationStageId: command.destinationStageId } : {}),
      amountMinor: tripQuote?.amountMinor ?? journey.fare.amountMinor,
      currency: journey.fare.currency,
      fareVersionId: journey.fare.fareVersionId,
      status: 'created',
      scenario: command.scenario,
      maskedPhoneNumber: this.maskPhone(command.phoneNumber),
      idempotencyKey,
      requestFingerprint,
      createdAt: now,
      updatedAt: now,
    };
    this.store.savePayment(payment);
    this.audit.record('payment.created', payment.id, {
      scenario: payment.scenario,
      maskedPhoneNumber: payment.maskedPhoneNumber,
    });

    payment = this.move(payment, 'initiating');
    this.audit.record('payment.initiation-requested', payment.id, {
      provider: 'mock-mpesa',
    });
    const acceptance = await this.provider.initiate({
      paymentAttemptId: payment.id,
      scenario: payment.scenario,
    });
    payment = this.move({ ...payment, providerRequestId: acceptance.providerRequestId }, 'pending');
    this.audit.record('payment.provider-accepted', payment.id, {
      providerRequestId: acceptance.providerRequestId,
    });
    await this.store.flush();
    this.scheduleCallbacks(payment);
    return this.publicPayment(payment);
  }

  get(id: string): PaymentAttemptV1 {
    return this.publicPayment(this.requiredPayment(id));
  }

  list(): readonly PaymentAttemptV1[] {
    return this.store.listPayments().map((payment) => this.publicPayment(payment));
  }

  listForTrip(tripId: string): readonly PaymentAttemptV1[] {
    return this.store.listPayments()
      .filter((payment) => payment.tripId === tripId)
      .map((payment) => this.publicPayment(payment));
  }

  async deliverCallbacks(id: string): Promise<PaymentAttemptV1> {
    let payment = this.requiredPayment(id);
    if (!payment.providerRequestId) throw new ConflictException('Provider request is unavailable');
    const evidenceItems = await this.provider.callbacks({
      providerRequestId: payment.providerRequestId,
      scenario: payment.scenario,
    });
    for (const evidence of evidenceItems) payment = this.applyEvidence(payment, evidence);
    await this.store.flush();
    return this.publicPayment(payment);
  }

  async reconcile(id: string): Promise<PaymentAttemptV1> {
    let payment = this.requiredPayment(id);
    if (!payment.providerRequestId) throw new ConflictException('Provider request is unavailable');
    this.audit.record('payment.reconciliation-requested', payment.id, {
      providerRequestId: payment.providerRequestId,
    });
    const evidence = await this.provider.reconcile({
      providerRequestId: payment.providerRequestId,
      scenario: payment.scenario,
    });
    if (evidence) payment = this.applyEvidence(payment, evidence);
    await this.store.flush();
    return this.publicPayment(payment);
  }

  async expire(id: string): Promise<PaymentAttemptV1> {
    const current = this.requiredPayment(id);
    const transition = transitionPayment(current.status, 'expired');
    const payment = this.move(current, transition.current);
    if (transition.changed) {
      this.audit.record('payment.expired', payment.id, { previousStatus: transition.previous });
    }
    await this.store.flush();
    return this.publicPayment(payment);
  }

  async createConflict(id: string): Promise<PaymentAttemptV1> {
    let payment = this.requiredPayment(id);
    if (!payment.providerRequestId) throw new ConflictException('Provider request is unavailable');
    const outcome = payment.status === 'confirmed' ? 'failed' : 'confirmed';
    payment = this.applyEvidence(payment, {
      eventId: `mock-conflict-${payment.providerRequestId}-${outcome}`,
      providerRequestId: payment.providerRequestId,
      outcome,
      occurredAt: new Date().toISOString(),
      trusted: true,
    });
    await this.store.flush();
    return this.publicPayment(payment);
  }

  private applyEvidence(payment: StoredPayment, evidence: ProviderEvidenceV1): StoredPayment {
    if (!this.store.recordProviderEvent(evidence)) {
      this.audit.record('payment.provider-evidence-duplicate', payment.id, {
        providerEventId: evidence.eventId,
      });
      return this.requiredPayment(payment.id);
    }
    const transition = transitionPayment(payment.status, `provider-${evidence.outcome}`);
    const updated = this.move(payment, transition.current);
    this.audit.record('payment.provider-evidence-applied', payment.id, {
      providerEventId: evidence.eventId,
      outcome: evidence.outcome,
      previousStatus: transition.previous,
      currentStatus: transition.current,
    });
    if (transition.previous === 'review-required' && transition.changed) {
      this.audit.record('payment.late-provider-evidence-applied', payment.id, {
        providerEventId: evidence.eventId,
        outcome: evidence.outcome,
        currentStatus: transition.current,
      });
    }
    if (transition.requiresReview) {
      this.audit.record('payment.review-required', payment.id, {
        providerEventId: evidence.eventId,
      });
    }
    return updated;
  }

  private move(payment: StoredPayment, status: PaymentState): StoredPayment {
    const updated = { ...payment, status, updatedAt: new Date().toISOString() };
    this.store.savePayment(updated);
    return updated;
  }

  private requiredPayment(id: string): StoredPayment {
    const payment = this.store.paymentById(id);
    if (!payment) throw new NotFoundException('Payment attempt not found');
    return payment;
  }

  private publicPayment(payment: StoredPayment): PaymentAttemptV1 {
    return {
      id: payment.id,
      journeySessionId: payment.journeySessionId,
      ...(payment.tripId ? { tripId: payment.tripId } : {}),
      ...(payment.destinationStageId ? { destinationStageId: payment.destinationStageId } : {}),
      amountMinor: payment.amountMinor,
      currency: payment.currency,
      fareVersionId: payment.fareVersionId,
      status: payment.status,
      scenario: payment.scenario,
      maskedPhoneNumber: payment.maskedPhoneNumber,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private validateInitiation(command: InitiatePaymentV1, idempotencyKey: string): void {
    if (!idempotencyKey || idempotencyKey.length < 8 || idempotencyKey.length > 128) {
      throw new BadRequestException('A valid Idempotency-Key header is required');
    }
    if (!KENYAN_SANDBOX_PHONE.test(command.phoneNumber)) {
      throw new BadRequestException('Use a Kenyan sandbox number in +2547XXXXXXXX format');
    }
    if (!command.journeySessionId && !command.tripId) {
      throw new BadRequestException('Journey session or trip is required');
    }
    if (command.tripId && !command.destinationStageId) {
      throw new BadRequestException('Destination stage is required for a trip payment');
    }
    const scenarios = new Set(['confirmed', 'failed', 'delayed', 'duplicate-callback', 'missing-callback']);
    if (!scenarios.has(command.scenario)) throw new BadRequestException('Unknown mock scenario');
  }

  private fingerprint(command: InitiatePaymentV1): string {
    return createHash('sha256')
      .update(`${command.journeySessionId ?? ''}|${command.tripId ?? ''}|${command.destinationStageId ?? ''}|${command.phoneNumber}|${command.scenario}`)
      .digest('hex');
  }

  private maskPhone(phoneNumber: string): string {
    return `${phoneNumber.slice(0, 4)}•••••${phoneNumber.slice(-3)}`;
  }

  private scheduleCallbacks(payment: StoredPayment): void {
    if (payment.scenario === 'missing-callback') return;
    const delay = payment.scenario === 'delayed' ? 1_500 : 250;
    const timer = setTimeout(() => {
      void this.deliverCallbacks(payment.id).catch(() => undefined);
    }, delay);
    timer.unref();
  }
}
