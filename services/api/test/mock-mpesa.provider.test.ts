import { describe, expect, it } from 'vitest';
import { MockMpesaProvider } from '../src/modules/payments/mock-mpesa.provider.js';

describe('Mock M-Pesa provider', () => {
  it.each([
    ['confirmed', 'confirmed', 1],
    ['failed', 'failed', 1],
    ['duplicate-callback', 'confirmed', 2],
    ['delayed', 'confirmed', 1],
    ['missing-callback', undefined, 0],
  ] as const)('provides deterministic %s callbacks', async (scenario, outcome, count) => {
    const provider = new MockMpesaProvider();
    const accepted = await provider.initiate({ paymentAttemptId: `attempt-${scenario}`, scenario });
    const callbacks = await provider.callbacks({
      providerRequestId: accepted.providerRequestId,
      scenario,
    });

    expect(callbacks).toHaveLength(count);
    expect(callbacks[0]?.outcome).toBe(outcome);
    expect(callbacks.every((event) => event.trusted)).toBe(true);
  });

  it('returns trusted status evidence when a callback is missing', async () => {
    const provider = new MockMpesaProvider();
    const accepted = await provider.initiate({
      paymentAttemptId: 'attempt-missing',
      scenario: 'missing-callback',
    });

    await expect(
      provider.reconcile({
        providerRequestId: accepted.providerRequestId,
        scenario: 'missing-callback',
      }),
    ).resolves.toMatchObject({
      outcome: 'confirmed',
      trusted: true,
    });
  });
});
