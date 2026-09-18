export const contractPackageVersion = '1.0.0-phase.0' as const;

export const paymentStates = [
  'created',
  'initiating',
  'pending',
  'confirmed',
  'failed',
  'expired',
  'review-required',
] as const;

export type PaymentState = (typeof paymentStates)[number];

export const mockPaymentScenarios = [
  'confirmed',
  'failed',
  'delayed',
  'duplicate-callback',
  'missing-callback',
] as const;

export type MockPaymentScenario = (typeof mockPaymentScenarios)[number];

export interface FareQuoteV1 {
  readonly amountMinor: number;
  readonly currency: 'KES';
  readonly fareVersionId: string;
  readonly effectiveFrom: string;
}

export interface JourneySessionV1 {
  readonly id: string;
  readonly publicCode: string;
  readonly routeLabel: string;
  readonly vehicleLabel: string;
  readonly saccoLabel: string;
  readonly fare: FareQuoteV1;
}

export interface InitiatePaymentV1 {
  readonly journeySessionId: string;
  readonly phoneNumber: string;
  readonly scenario: MockPaymentScenario;
}

export interface PaymentAttemptV1 {
  readonly id: string;
  readonly journeySessionId: string;
  readonly amountMinor: number;
  readonly currency: 'KES';
  readonly fareVersionId: string;
  readonly status: PaymentState;
  readonly scenario: MockPaymentScenario;
  readonly maskedPhoneNumber: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type ProviderEvidenceOutcome = 'pending' | 'confirmed' | 'failed';

export interface ProviderEvidenceV1 {
  readonly eventId: string;
  readonly providerRequestId: string;
  readonly outcome: ProviderEvidenceOutcome;
  readonly occurredAt: string;
  readonly trusted: true;
}

export type AuditEventType =
  | 'payment.created'
  | 'payment.initiation-requested'
  | 'payment.provider-accepted'
  | 'payment.provider-evidence-applied'
  | 'payment.provider-evidence-duplicate'
  | 'payment.reconciliation-requested'
  | 'payment.expired'
  | 'payment.review-required';

export interface AuditEventV1 {
  readonly id: string;
  readonly type: AuditEventType;
  readonly paymentAttemptId: string;
  readonly occurredAt: string;
  readonly details: Readonly<Record<string, string | number | boolean | null>>;
}
