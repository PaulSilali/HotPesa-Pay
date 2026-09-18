import { describe, expect, it } from 'vitest';
import { adminFoundation } from '../src/foundation.js';

describe('admin foundation', () => {
  it('is a React Phase 0 scaffold', () => {
    expect(adminFoundation).toEqual({
      framework: 'react',
      scope: 'phase-0-foundation',
    });
  });
});
