import type {
  MockPaymentScenario,
  ProviderEvidenceV1,
} from '@hotpesa/contracts';

export interface ProviderInitiation {
  readonly paymentAttemptId: string;
  readonly scenario: MockPaymentScenario;
}

export interface ProviderAcceptance {
  readonly providerRequestId: string;
}

export interface ProviderLookup {
  readonly providerRequestId: string;
  readonly scenario: MockPaymentScenario;
}

export interface PaymentProvider {
  initiate(command: ProviderInitiation): Promise<ProviderAcceptance>;
  callbacks(request: ProviderLookup): Promise<readonly ProviderEvidenceV1[]>;
  reconcile(request: ProviderLookup): Promise<ProviderEvidenceV1 | null>;
}
