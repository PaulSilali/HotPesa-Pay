import { describe, expect, it } from 'vitest';
import { workspaceConfigVersion } from '../src/index.js';

describe('config package', () => {
  it('exposes a foundation version', () => {
    expect(workspaceConfigVersion).toBe('0.0.0');
  });
});
