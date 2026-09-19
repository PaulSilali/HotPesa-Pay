import { Body, Controller, Get, Headers, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import type { FareQuoteV1, JourneySessionV1, RouteV1, TripV1 } from '@hotpesa/contracts';
import { JourneyService, type TripCloseCommand, type TripStartCommand } from './journey.service.js';
import { PaymentStore } from '../payments/payment.store.js';
import { FareService } from '../fares/fare.service.js';

@Controller('api/v1/journey-sessions')
export class JourneysController {
  constructor(
    @Inject(PaymentStore) private readonly store: PaymentStore,
    @Inject(JourneyService) private readonly journeys: JourneyService,
    @Inject(FareService) private readonly fares: FareService,
  ) {}

  @Get('routes/catalog')
  routes(@Headers('x-tenant-id') tenantId = 'tenant-demo-sacco'): readonly RouteV1[] {
    return this.journeys.listRoutes(tenantId);
  }

  @Get('trips')
  trips(@Headers('x-tenant-id') tenantId = 'tenant-demo-sacco'): readonly TripV1[] {
    return this.journeys.listTrips(tenantId);
  }

  @Post('trips')
  startTrip(
    @Body() command: Omit<TripStartCommand, 'tenantId'>,
    @Headers('x-tenant-id') tenantId = 'tenant-demo-sacco',
  ): Promise<TripV1> {
    return this.journeys.startTrip({ ...command, tenantId });
  }

  @Get('trips/:id')
  trip(@Param('id') id: string, @Headers('x-tenant-id') tenantId = 'tenant-demo-sacco'): TripV1 {
    return this.journeys.getTrip(id, tenantId);
  }

  @Post('trips/:id/close')
  closeTrip(
    @Param('id') tripId: string,
    @Body() body: { readonly reason?: string },
    @Headers('x-tenant-id') tenantId = 'tenant-demo-sacco',
    @Headers('x-workforce-id') actorId = 'conductor-demo',
    @Headers('x-role') role: TripCloseCommand['role'] = 'conductor',
  ): Promise<TripV1> {
    return this.journeys.closeTrip({ tripId, tenantId, actorId, role, reason: body.reason });
  }

  @Post(':publicCode/fare-quote')
  quote(@Param('publicCode') publicCode: string, @Body() body: { readonly destinationStageId?: string }): FareQuoteV1 {
    const session = this.journeys.journeySessionForPublicCode(publicCode);
    const trip = session ? this.journeys.tripForActiveSession(session.id) : undefined;
    if (!trip) throw new NotFoundException('Journey session is unavailable');
    return this.fares.quote(trip.id, body.destinationStageId ?? '');
  }

  @Get(':publicCode')
  get(@Param('publicCode') publicCode: string): JourneySessionV1 {
    const journey = this.journeys.journeySessionForPublicCode(publicCode) ?? this.store.journeyByPublicCode(publicCode);
    if (!journey) throw new NotFoundException('Journey session not found');
    return { ...journey, route: this.journeys.routeForPublicCode(publicCode) };
  }
}
