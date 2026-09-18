import { describe, expect, it } from 'vitest';
import { contractPackageVersion } from '../src/index.js';

describe('contracts package', () => {
  it('exposes its pre-contract foundation version', () => {
    expect(contractPackageVersion).toBe('0.0.0');
  });
});
