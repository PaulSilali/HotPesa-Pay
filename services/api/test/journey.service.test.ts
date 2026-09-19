import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { JourneyService } from '../src/modules/journeys/journey.service.js';

describe('JourneyService', () => {
  it('starts a trip only for the assigned conductor and vehicle', () => {
    const service = new JourneyService();

    const trip = service.startTrip({
      tenantId: 'tenant-demo-sacco',
      conductorId: 'conductor-demo',
      vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
    }, new Date('2026-09-19T12:00:00.000Z'));

    expect(trip).toMatchObject({
      tenantId: 'tenant-demo-sacco',
      conductorId: 'conductor-demo',
      vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
      fareVersionId: 'fare-demo-v1',
      state: 'active',
    });
  });

  it('rejects a start without the active assignment', () => {
    const service = new JourneyService();

    expect(() => service.startTrip({
      tenantId: 'tenant-demo-sacco',
      conductorId: 'other-conductor',
      vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
    }, new Date('2026-09-19T12:00:00.000Z'))).toThrow(UnauthorizedException);
  });

  it('prevents concurrent active trips for the assigned conductor and vehicle', () => {
    const service = new JourneyService();
    const command = {
      tenantId: 'tenant-demo-sacco',
      conductorId: 'conductor-demo',
      vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
    };

    service.startTrip(command, new Date('2026-09-19T12:00:00.000Z'));
    expect(() => service.startTrip(command, new Date('2026-09-19T12:01:00.000Z'))).toThrow(ConflictException);
  });
});
