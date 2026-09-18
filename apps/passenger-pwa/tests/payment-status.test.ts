import { describe, expect, it } from 'vitest';
import { paymentStates } from '../../../packages/contracts/src/index.js';
import { paymentStatusView } from '../src/payment-status.js';
import { sessionCodeFromLocation } from '../src/session-code.js';

describe('passenger payment feedback', () => {
  it('has explicit readable feedback for every payment state', () => {
    for (const state of paymentStates) {
      expect(paymentStatusView(state).heading.length).toBeGreaterThan(3);
      expect(paymentStatusView(state).detail.length).toBeGreaterThan(12);
    }
  });

  it('uses success styling only for trusted confirmation', () => {
    expect(paymentStatusView('confirmed').tone).toBe('success');
    expect(paymentStatusView('pending').tone).toBe('neutral');
    expect(paymentStatusView('initiating').tone).toBe('neutral');
  });

  it('reads both path-based and query-based journey entry URLs', () => {
    expect(sessionCodeFromLocation({ pathname: '/journey/demo-code', search: '' })).toBe('demo-code');
    expect(sessionCodeFromLocation({ pathname: '/', search: '?session=query-code' })).toBe('query-code');
  });
});
