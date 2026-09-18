import type { ProviderEvidenceOutcome, ProviderEvidenceV1 } from '@hotpesa/contracts';
import type {
  PaymentProvider,
  ProviderAcceptance,
  ProviderInitiation,
  ProviderLookup,
} from './payment-provider.js';

export class MockMpesaProvider implements PaymentProvider {
  async initiate(command: ProviderInitiation): Promise<ProviderAcceptance> {
    const requestId = `mock-request-${command.paymentAttemptId}`;
    return { providerRequestId: requestId };
  }

  async callbacks(request: ProviderLookup): Promise<readonly ProviderEvidenceV1[]> {
    if (request.scenario === 'missing-callback') return [];

    const outcome: ProviderEvidenceOutcome =
      request.scenario === 'failed' ? 'failed' : 'confirmed';
    const evidence = this.evidence(request, outcome, 'callback');
    return request.scenario === 'duplicate-callback' ? [evidence, evidence] : [evidence];
  }

  async reconcile(request: ProviderLookup): Promise<ProviderEvidenceV1 | null> {
    const outcome: ProviderEvidenceOutcome = request.scenario === 'failed' ? 'failed' : 'confirmed';
    return this.evidence(request, outcome, 'reconciliation');
  }

  private evidence(
    request: ProviderLookup,
    outcome: ProviderEvidenceOutcome,
    channel: 'callback' | 'reconciliation',
  ): ProviderEvidenceV1 {
    return {
      eventId: `mock-${channel}-${request.providerRequestId}-${outcome}`,
      providerRequestId: request.providerRequestId,
      outcome,
      occurredAt: '2026-09-19T12:00:00.000Z',
      trusted: true,
    };
  }
}
