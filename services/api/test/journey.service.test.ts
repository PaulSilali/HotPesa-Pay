import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { JourneyService } from '../src/modules/journeys/journey.service.js';

describe('JourneyService', () => {
  it('starts a trip only for the assigned conductor and vehicle', async () => {
    const service = new JourneyService();

    const trip = await service.startTrip({
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

  it('rejects a start without the active assignment', async () => {
    const service = new JourneyService();

    await expect(service.startTrip({
      tenantId: 'tenant-demo-sacco',
      conductorId: 'other-conductor',
      vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
    }, new Date('2026-09-19T12:00:00.000Z'))).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('prevents concurrent active trips for the assigned conductor and vehicle', async () => {
    const service = new JourneyService();
    const command = {
      tenantId: 'tenant-demo-sacco',
      conductorId: 'conductor-demo',
      vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
    };

    await service.startTrip(command, new Date('2026-09-19T12:00:00.000Z'));
    await expect(service.startTrip(command, new Date('2026-09-19T12:01:00.000Z'))).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates an opaque active passenger session and invalidates it on closure', async () => {
    const service = new JourneyService();
    const trip = await service.startTrip({ tenantId: 'tenant-demo-sacco', conductorId: 'conductor-demo', vehicleId: 'vehicle-demo-kaa-000d', routeId: 'route-cbd-westlands', directionId: 'direction-cbd-westlands' }, new Date('2026-09-19T12:00:00.000Z'));
    const session = service.journeySessionForPublicCode(trip.publicCode);
    expect(session?.id).not.toBe(trip.id);
    expect(session?.route?.directions[0]?.stages).toHaveLength(3);
    await service.closeTrip({ tripId: trip.id, tenantId: trip.tenantId, actorId: trip.conductorId, role: 'conductor' });
    expect(service.journeySessionForPublicCode(trip.publicCode)).toBeUndefined();
    expect(service.journeySessionForPublicCode('malformed code!')).toBeUndefined();
  });
});
