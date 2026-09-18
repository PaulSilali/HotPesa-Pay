import { describe, expect, it } from 'vitest';
import {
  contractPackageVersion,
  mockPaymentScenarios,
  paymentStates,
  type JourneySessionV1,
} from '../src/index.js';

describe('Phase 0 contracts', () => {
  it('versions the first browser-slice contract', () => {
    expect(contractPackageVersion).toBe('1.0.0-phase.0');
  });

  it('publishes every required payment state and deterministic mock scenario', () => {
    expect(paymentStates).toEqual([
      'created',
      'initiating',
      'pending',
      'confirmed',
      'failed',
      'expired',
      'review-required',
    ]);
    expect(mockPaymentScenarios).toEqual([
      'confirmed',
      'failed',
      'delayed',
      'duplicate-callback',
      'missing-callback',
    ]);
  });

  it('requires an effective-dated, versioned fare', () => {
    const session: JourneySessionV1 = {
      id: 'journey-session-demo',
      publicCode: 'demo-nairobi-cbd-westlands',
      routeLabel: 'Nairobi CBD → Westlands',
      vehicleLabel: 'Demo Matatu KAA 000D',
      saccoLabel: 'HotPesa Demo SACCO',
      fare: {
        amountMinor: 8_000,
        currency: 'KES',
        fareVersionId: 'fare-demo-v1',
        effectiveFrom: '2026-09-19T00:00:00.000Z',
      },
    };

    expect(session.fare).toMatchObject({ amountMinor: 8_000, currency: 'KES' });
  });
});
