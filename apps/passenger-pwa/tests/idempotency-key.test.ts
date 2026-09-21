import { describe, expect, it, vi } from 'vitest';
import { createIdempotencyKey } from '../src/idempotency-key.js';

describe('createIdempotencyKey', () => {
  it('uses randomUUID when supported', () => {
    const randomUUID = vi.fn(() => 'uuid-from-browser');
    expect(createIdempotencyKey({ randomUUID, getRandomValues: vi.fn() } as unknown as Crypto)).toBe('uuid-from-browser');
    expect(randomUUID).toHaveBeenCalledOnce();
  });

  it('creates an RFC 4122 v4 key with getRandomValues when randomUUID is unavailable', () => {
    const getRandomValues = (values: Uint8Array) => { values.fill(0); return values; };
    expect(createIdempotencyKey({ getRandomValues } as Crypto)).toBe('00000000-0000-4000-8000-000000000000');
  });
});
