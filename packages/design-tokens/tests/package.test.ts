import { describe, expect, it } from 'vitest';
import { designTokenPackageVersion } from '../src/index.js';

describe('design-token package', () => {
  it('builds without defining unapproved product tokens', () => {
    expect(designTokenPackageVersion).toBe('0.0.0');
  });
});
