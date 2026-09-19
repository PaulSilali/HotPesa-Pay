import { Body, Controller, Get, Headers, Inject, NotFoundException, Param, Post } from '@nestjs/common';
import type { JourneySessionV1, RouteV1, TripV1 } from '@hotpesa/contracts';
import { JourneyService, type TripCloseCommand, type TripStartCommand } from './journey.service.js';
import { PaymentStore } from '../payments/payment.store.js';

@Controller('api/v1/journey-sessions')
export class JourneysController {
  constructor(
    @Inject(PaymentStore) private readonly store: PaymentStore,
    @Inject(JourneyService) private readonly journeys: JourneyService,
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
  ): TripV1 {
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
  ): TripV1 {
    return this.journeys.closeTrip({ tripId, tenantId, actorId, role, reason: body.reason });
  }

  @Get(':publicCode')
  get(@Param('publicCode') publicCode: string): JourneySessionV1 {
    const journey = this.store.journeyByPublicCode(publicCode);
    if (!journey) throw new NotFoundException('Journey session not found');
    return { ...journey, route: this.journeys.routeForPublicCode(publicCode) };
  }
}
