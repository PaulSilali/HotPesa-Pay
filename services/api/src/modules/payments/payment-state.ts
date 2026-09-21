import type { PaymentState, ProviderEvidenceOutcome } from '@hotpesa/contracts';

export type PaymentSignal =
  | 'initiation-requested'
  | 'provider-accepted'
  | 'expired'
  | `provider-${ProviderEvidenceOutcome}`;

export interface StateTransition {
  readonly previous: PaymentState;
  readonly current: PaymentState;
  readonly changed: boolean;
  readonly requiresReview: boolean;
}

export function transitionPayment(
  previous: PaymentState,
  signal: PaymentSignal,
): StateTransition {
  let current = previous;

  if (previous === 'review-required') {
    if (signal === 'provider-confirmed') current = 'confirmed';
    else if (signal === 'provider-failed') current = 'failed';
    return { previous, current, changed: current !== previous, requiresReview: current === 'review-required' };
  }

  if (signal === 'initiation-requested' && previous === 'created') {
    current = 'initiating';
  } else if (signal === 'provider-accepted' && previous === 'initiating') {
    current = 'pending';
  } else if (signal === 'expired' && ['created', 'initiating', 'pending'].includes(previous)) {
    current = 'expired';
  } else if (signal === 'provider-pending') {
    if (previous === 'created' || previous === 'initiating') current = 'pending';
  } else if (signal === 'provider-confirmed') {
    if (previous === 'failed' || previous === 'expired') current = 'review-required';
    else if (previous !== 'confirmed') current = 'confirmed';
  } else if (signal === 'provider-failed') {
    if (previous === 'confirmed' || previous === 'expired') current = 'review-required';
    else if (previous !== 'failed') current = 'failed';
  }

  return {
    previous,
    current,
    changed: current !== previous,
    requiresReview: current === 'review-required',
  };
}
