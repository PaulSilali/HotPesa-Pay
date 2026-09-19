import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { JourneySessionV1, PaymentState, RouteDirectionV1, RouteStageV1, RouteV1, TripSummaryV1, TripV1 } from '@hotpesa/contracts';
import { randomUUID } from 'node:crypto';
import { PaymentStore } from '../payments/payment.store.js';
import { WorkforceAuthorizationService } from '../authorization/workforce.service.js';

export interface TripStartCommand {
  readonly tenantId: string;
  readonly conductorId: string;
  readonly vehicleId: string;
  readonly routeId: string;
  readonly directionId: string;
}

export interface TripCloseCommand {
  readonly tripId: string;
  readonly tenantId: string;
  readonly actorId: string;
  readonly role: 'conductor' | 'sacco-operations';
  readonly reason?: string;
}


const stages: readonly RouteStageV1[] = [
  { id: 'stage-cbd', name: 'Nairobi CBD', sequence: 1 },
  { id: 'stage-parklands', name: 'Parklands', sequence: 2 },
  { id: 'stage-westlands', name: 'Westlands', sequence: 3 },
];

const direction: RouteDirectionV1 = {
  id: 'direction-cbd-westlands',
  label: 'Nairobi CBD to Westlands',
  stages,
};

const demoRoute: RouteV1 = {
  id: 'route-cbd-westlands',
  tenantId: 'tenant-demo-sacco',
  code: 'CBD-WESTLANDS',
  label: 'Nairobi CBD to Westlands',
  directions: [direction],
};

@Injectable()
export class JourneyService {
  private readonly trips = new Map<string, TripV1>();
  private readonly sessions = new Map<string, { readonly id: string; readonly publicCode: string; readonly tripId: string; readonly tenantId: string; state: 'active' | 'closed'; readonly createdAt: string; closedAt?: string }>();

  constructor(@Inject(PaymentStore) private readonly payments: PaymentStore = new PaymentStore(), @Inject(WorkforceAuthorizationService) private readonly authorization: WorkforceAuthorizationService = new WorkforceAuthorizationService()) {}

  listRoutes(tenantId: string): readonly RouteV1[] {
    return tenantId === demoRoute.tenantId ? [demoRoute] : [];
  }

  routeForPublicCode(publicCode: string): RouteV1 | undefined {
    return this.journeySessionForPublicCode(publicCode)?.route ?? (publicCode === 'demo-nairobi-cbd-westlands' ? demoRoute : undefined);
  }

  journeySessionForPublicCode(publicCode: string): JourneySessionV1 | undefined {
    if (!/^[a-z0-9_-]{16,128}$/i.test(publicCode)) return undefined;
    const session = [...this.sessions.values()].find((item) => item.publicCode === publicCode && item.state === 'active');
    return session ? this.publicSession(session) : undefined;
  }

  journeySessionById(id: string): JourneySessionV1 | undefined {
    const session = [...this.sessions.values()].find((item) => item.id === id && item.state === 'active');
    return session ? this.publicSession(session) : undefined;
  }

  private publicSession(session: { readonly id: string; readonly publicCode: string; readonly tripId: string; readonly tenantId: string; state: 'active' | 'closed'; readonly createdAt: string; closedAt?: string }): JourneySessionV1 | undefined {
    if (!session) return undefined;
    const trip = this.trips.get(session.tripId);
    if (!trip || trip.state !== 'active') return undefined;
    const route = this.getRoute(trip.routeId, trip.tenantId);
    return { id: session.id, publicCode: session.publicCode, routeLabel: route.label, vehicleLabel: trip.vehicleId, saccoLabel: trip.tenantId, fare: { amountMinor: 0, currency: 'KES', fareVersionId: trip.fareVersionId, effectiveFrom: trip.startedAt }, route };
  }

  tripForActiveSession(sessionId: string): TripV1 | undefined {
    const session = [...this.sessions.values()].find((item) => item.id === sessionId && item.state === 'active');
    return session ? this.trips.get(session.tripId) : undefined;
  }

  getRoute(routeId: string, tenantId: string): RouteV1 {
    if (tenantId !== demoRoute.tenantId || routeId !== demoRoute.id) {
      throw new NotFoundException('Route not found');
    }
    return demoRoute;
  }

  listTrips(tenantId: string): readonly TripV1[] {
    return [...this.trips.values()].filter((trip) => trip.tenantId === tenantId);
  }

  getTrip(id: string, tenantId: string): TripV1 {
    const trip = this.trips.get(id);
    if (!trip || trip.tenantId !== tenantId) throw new NotFoundException('Trip not found');
    return trip;
  }

  closeTrip(command: TripCloseCommand, now = new Date()): TripV1 {
    const current = this.getTrip(command.tripId, command.tenantId);
    if (current.state !== 'active') return current;
    if (command.role === 'conductor' && current.conductorId !== command.actorId) {
      throw new ForbiddenException('Only the assigned conductor may close this trip');
    }
    if (command.role !== 'conductor' && command.role !== 'sacco-operations') {
      throw new ForbiddenException('Trip closure role is not authorized');
    }
    const payments = this.payments.listPayments().filter((payment) => payment.tripId === current.id);
    const unresolved = payments.filter((payment) => payment.status === 'pending' || payment.status === 'review-required');
    if (unresolved.length > 0 && !command.reason?.trim()) {
      throw new BadRequestException('A reason is required to close with unresolved payments');
    }
    const summary = summarize(payments.map((payment) => payment.status), payments.map((payment) => payment.amountMinor));
    const closed: TripV1 = { ...current, state: 'closed', closedAt: now.toISOString(), summary };
    this.trips.set(closed.id, closed);
    for (const session of this.sessions.values()) if (session.tripId === closed.id && session.state === 'active') { session.state = 'closed'; session.closedAt = closed.closedAt; }
    return closed;
  }

  startTrip(command: TripStartCommand, now = new Date()): TripV1 {
    const route = this.getRoute(command.routeId, command.tenantId);
    const selectedDirection = route.directions.find((item) => item.id === command.directionId);
    if (!selectedDirection) throw new NotFoundException('Route direction not found');

    this.authorization.authorizeTripStart(command, now);

    const activeForConductor = [...this.trips.values()].find(
      (trip) => trip.conductorId === command.conductorId && trip.state === 'active',
    );
    if (activeForConductor) throw new ConflictException('Conductor already has an active trip');

    const activeForVehicle = [...this.trips.values()].find(
      (trip) => trip.vehicleId === command.vehicleId && trip.state === 'active',
    );
    if (activeForVehicle) throw new ConflictException('Vehicle already has an active trip');

    const startedAt = now.toISOString();
    const trip: TripV1 = {
      id: randomUUID(),
      publicCode: `trip-${randomUUID().slice(0, 8)}`,
      tenantId: command.tenantId,
      conductorId: command.conductorId,
      vehicleId: command.vehicleId,
      routeId: route.id,
      directionId: selectedDirection.id,
      fareVersionId: 'fare-demo-v1',
      state: 'active',
      startedAt,
    };
    this.trips.set(trip.id, trip);
    const publicCode = `journey_${randomUUID().replaceAll('-', '')}`;
    this.sessions.set(publicCode, { id: randomUUID(), publicCode, tripId: trip.id, tenantId: trip.tenantId, state: 'active', createdAt: startedAt });
    this.trips.set(trip.id, { ...trip, publicCode });
    return this.trips.get(trip.id)!;
  }

}

function summarize(states: readonly PaymentState[], amounts: readonly number[]): TripSummaryV1 {
  const count = (state: PaymentState) => states.filter((item) => item === state).length;
  const confirmedPaymentCount = count('confirmed');
  return {
    paymentAttemptCount: states.length,
    confirmedPaymentCount,
    failedPaymentCount: count('failed'),
    pendingPaymentCount: count('pending'),
    expiredPaymentCount: count('expired'),
    reviewRequiredPaymentCount: count('review-required'),
    confirmedRevenueMinor: amounts.filter((_, index) => states[index] === 'confirmed').reduce((total, value) => total + value, 0),
    exceptionCount: states.filter((state) => state === 'failed' || state === 'expired' || state === 'review-required').length,
  };
}
