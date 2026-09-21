import { describe, expect, it } from 'vitest';
import { WorkforceAuthorizationService } from '../src/modules/authorization/workforce.service.js';

describe('WorkforceAuthorizationService', () => {
  const service = new WorkforceAuthorizationService();
  const valid = { tenantId: 'tenant-demo-sacco', conductorId: 'conductor-demo', vehicleId: 'vehicle-demo-kaa-000d', routeId: 'route-cbd-westlands', directionId: 'direction-cbd-westlands' };
  it('allows an active member with an exact active assignment', () => expect(() => service.authorizeTripStart(valid, new Date('2026-09-19T12:00:00Z'))).not.toThrow());
  it('rejects cross-tenant and mismatched vehicle contexts', () => {
    expect(() => service.authorizeTripStart({ ...valid, tenantId: 'other' }, new Date())).toThrow();
    expect(() => service.authorizeTripStart({ ...valid, vehicleId: 'other' }, new Date())).toThrow();
  });
});
