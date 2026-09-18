import { describe, expect, it } from 'vitest';
import { passengerFoundation } from '../src/foundation.js';

describe('passenger foundation', () => {
  it('keeps the passenger path accountless and server-confirmed', () => {
    expect(passengerFoundation).toEqual({
      accountRequired: false,
      paymentConfirmationSource: 'server',
    });
  });
});
