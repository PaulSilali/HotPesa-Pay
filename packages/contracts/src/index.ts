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
  readonly routeId?: string;
  readonly directionId?: string;
  readonly destinationStageId?: string;
}

export interface RouteStageV1 {
  readonly id: string;
  readonly name: string;
  readonly sequence: number;
}

export interface RouteDirectionV1 {
  readonly id: string;
  readonly label: string;
  readonly stages: readonly RouteStageV1[];
}

export interface RouteV1 {
  readonly id: string;
  readonly tenantId: string;
  readonly code: string;
  readonly label: string;
  readonly directions: readonly RouteDirectionV1[];
}

export type TripStateV1 = 'active' | 'closed' | 'suspended';

export interface TripV1 {
  readonly id: string;
  readonly publicCode: string;
  readonly tenantId: string;
  readonly conductorId: string;
  readonly vehicleId: string;
  readonly routeId: string;
  readonly directionId: string;
  readonly fareVersionId: string;
  readonly state: TripStateV1;
  readonly startedAt: string;
  readonly closedAt?: string;
  readonly summary?: TripSummaryV1;
}

export interface TripSummaryV1 {
  readonly paymentAttemptCount: number;
  readonly confirmedPaymentCount: number;
  readonly failedPaymentCount: number;
  readonly pendingPaymentCount: number;
  readonly expiredPaymentCount: number;
  readonly reviewRequiredPaymentCount: number;
  readonly confirmedRevenueMinor: number;
  readonly exceptionCount: number;
}

export interface JourneySessionV1 {
  readonly id: string;
  readonly publicCode: string;
  readonly routeLabel: string;
  readonly vehicleLabel: string;
  readonly saccoLabel: string;
  readonly fare: FareQuoteV1;
  readonly route?: RouteV1;
}

export interface InitiatePaymentV1 {
  readonly journeySessionId?: string;
  readonly tripId?: string;
  readonly destinationStageId?: string;
  readonly phoneNumber: string;
  readonly scenario: MockPaymentScenario;
}

export interface PaymentAttemptV1 {
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
  | 'payment.reconciliation-exhausted'
  | 'payment.late-provider-evidence-applied'
  | 'payment.expired'
  | 'payment.review-required';

export interface AuditEventV1 {
  readonly id: string;
  readonly type: AuditEventType;
  readonly paymentAttemptId: string;
  readonly occurredAt: string;
  readonly details: Readonly<Record<string, string | number | boolean | null>>;
}
