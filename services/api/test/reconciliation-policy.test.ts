import { describe, expect, it } from 'vitest';
import { reconciliationPolicy } from '../src/modules/payments/reconciliation-policy.js';

describe('reconciliation policy', () => {
  it('uses the approved five bounded delays by default', () => {
    expect(reconciliationPolicy({})).toEqual({ maxAttempts: 5, delaysMs: [30_000, 60_000, 120_000, 300_000, 600_000] });
  });
  it('rejects invalid configuration', () => expect(() => reconciliationPolicy({ RECONCILIATION_MAX_ATTEMPTS: '6' })).toThrow('Invalid reconciliation retry configuration'));
});
