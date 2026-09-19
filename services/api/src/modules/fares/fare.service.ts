import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { FareQuoteV1 } from '@hotpesa/contracts';
import { JourneyService } from '../journeys/journey.service.js';

@Injectable()
export class FareService {
  constructor(@Inject(JourneyService) private readonly journeys: JourneyService) {}

  quote(tripId: string, destinationStageId: string): FareQuoteV1 {
    const trip = this.journeys.getTrip(tripId, 'tenant-demo-sacco');
    if (trip.state !== 'active') throw new BadRequestException('Trip is not active');

    const route = this.journeys.getRoute(trip.routeId, trip.tenantId);
    const direction = route.directions.find((item) => item.id === trip.directionId);
    const destination = direction?.stages.find((stage) => stage.id === destinationStageId);
    if (!direction || !destination || destination.sequence <= 1) {
      throw new BadRequestException('Destination stage is not valid for this trip');
    }

    const amountMinor = destination.id === 'stage-parklands' ? 5_000 : 8_000;
    return {
      amountMinor,
      currency: 'KES',
      fareVersionId: trip.fareVersionId,
      effectiveFrom: '2026-09-19T00:00:00.000+03:00',
      routeId: trip.routeId,
      directionId: trip.directionId,
      destinationStageId: destination.id,
    };
  }
}
