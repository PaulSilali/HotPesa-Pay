import { describe, expect, it } from 'vitest';
import { AppService } from '../src/app.service.js';

describe('AppService', () => {
  it('reports only foundation health', () => {
    expect(new AppService().health()).toEqual({
      status: 'ok',
      scope: 'phase-0-foundation',
    });
  });
});
