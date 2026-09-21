import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { FareService } from '../src/modules/fares/fare.service.js';
import { JourneyService } from '../src/modules/journeys/journey.service.js';

describe('FareService', () => {
  it('calculates a deterministic server quote for a valid destination', async () => {
    const journeys = new JourneyService();
    const trip = await journeys.startTrip({
      tenantId: 'tenant-demo-sacco',
      conductorId: 'conductor-demo',
      vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
    }, new Date('2026-09-19T12:00:00.000Z'));

    expect(new FareService(journeys).quote(trip.id, 'stage-westlands')).toEqual({
      amountMinor: 8_000,
      currency: 'KES',
      fareVersionId: 'fare-demo-v1',
      effectiveFrom: '2026-09-19T00:00:00.000+03:00',
      routeId: 'route-cbd-westlands',
      directionId: 'direction-cbd-westlands',
      destinationStageId: 'stage-westlands',
    });
  });

  it('rejects a boarding stage or unknown destination', async () => {
    const journeys = new JourneyService();
    const trip = await journeys.startTrip({
      tenantId: 'tenant-demo-sacco', conductorId: 'conductor-demo', vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands', directionId: 'direction-cbd-westlands',
    }, new Date('2026-09-19T12:00:00.000Z'));
    const fares = new FareService(journeys);

    expect(() => fares.quote(trip.id, 'stage-cbd')).toThrow(BadRequestException);
    expect(() => fares.quote(trip.id, 'stage-unknown')).toThrow(BadRequestException);
  });
});
