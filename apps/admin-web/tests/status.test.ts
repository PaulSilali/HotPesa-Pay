import { describe, expect, it } from 'vitest';
import { paymentStates } from '../../../packages/contracts/src/index.js';
import { statusLabel } from '../src/status.js';

describe('admin payment state labels', () => {
  it('labels every contracted payment state', () => {
    expect(paymentStates.map(statusLabel)).toEqual([
      'Created',
      'Initiating',
      'Pending evidence',
      'Confirmed',
      'Failed',
      'Expired',
      'Review required',
    ]);
  });
});
