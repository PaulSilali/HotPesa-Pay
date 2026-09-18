import { describe, expect, it } from 'vitest';
import { transitionPayment } from '../src/modules/payments/payment-state.js';

describe('payment state transitions', () => {
  it('requires provider evidence before confirmation', () => {
    expect(transitionPayment('created', 'initiation-requested').current).toBe('initiating');
    expect(transitionPayment('initiating', 'provider-accepted').current).toBe('pending');
    expect(transitionPayment('pending', 'provider-confirmed').current).toBe('confirmed');
  });

  it('is stable for duplicate evidence', () => {
    expect(transitionPayment('confirmed', 'provider-confirmed')).toMatchObject({
      current: 'confirmed',
      changed: false,
    });
  });

  it('routes conflicting or late terminal evidence to review', () => {
    expect(transitionPayment('failed', 'provider-confirmed').current).toBe('review-required');
    expect(transitionPayment('confirmed', 'provider-failed').current).toBe('review-required');
    expect(transitionPayment('expired', 'provider-confirmed').current).toBe('review-required');
  });

  it('can expire only a non-terminal attempt', () => {
    expect(transitionPayment('pending', 'expired').current).toBe('expired');
    expect(transitionPayment('confirmed', 'expired').current).toBe('confirmed');
  });
});
