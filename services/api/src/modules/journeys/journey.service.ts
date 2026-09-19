import { BadRequestException, ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { PaymentState, RouteDirectionV1, RouteStageV1, RouteV1, TripSummaryV1, TripV1 } from '@hotpesa/contracts';
import { randomUUID } from 'node:crypto';
import { PaymentStore } from '../payments/payment.store.js';

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

interface Assignment {
  readonly tenantId: string;
  readonly conductorId: string;
  readonly vehicleId: string;
  readonly routeId: string;
  readonly directionId: string;
  readonly validFrom: string;
  readonly validTo?: string;
  readonly revokedAt?: string;
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

const demoAssignment: Assignment = {
  tenantId: 'tenant-demo-sacco',
  conductorId: 'conductor-demo',
  vehicleId: 'vehicle-demo-kaa-000d',
  routeId: demoRoute.id,
  directionId: direction.id,
  validFrom: '2026-01-01T00:00:00.000Z',
};

@Injectable()
export class JourneyService {
  private readonly trips = new Map<string, TripV1>();

  constructor(@Inject(PaymentStore) private readonly payments: PaymentStore = new PaymentStore()) {}

  listRoutes(tenantId: string): readonly RouteV1[] {
    return tenantId === demoRoute.tenantId ? [demoRoute] : [];
  }

  routeForPublicCode(publicCode: string): RouteV1 | undefined {
    return publicCode === 'demo-nairobi-cbd-westlands' ? demoRoute : undefined;
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
    return closed;
  }

  startTrip(command: TripStartCommand, now = new Date()): TripV1 {
    const route = this.getRoute(command.routeId, command.tenantId);
    const selectedDirection = route.directions.find((item) => item.id === command.directionId);
    if (!selectedDirection) throw new NotFoundException('Route direction not found');

    const activeAssignment = this.isAssignmentValid(command, now);
    if (!activeAssignment) throw new UnauthorizedException('Active conductor assignment is required');

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
    return trip;
  }

  private isAssignmentValid(command: TripStartCommand, now: Date): boolean {
    if (
      command.tenantId !== demoAssignment.tenantId ||
      command.conductorId !== demoAssignment.conductorId ||
      command.vehicleId !== demoAssignment.vehicleId ||
      command.routeId !== demoAssignment.routeId ||
      command.directionId !== demoAssignment.directionId ||
      demoAssignment.revokedAt
    ) return false;
    const timestamp = now.toISOString();
    return timestamp >= demoAssignment.validFrom && (!demoAssignment.validTo || timestamp < demoAssignment.validTo);
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
