import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { RouteDirectionV1, RouteStageV1, RouteV1, TripV1 } from '@hotpesa/contracts';
import { randomUUID } from 'node:crypto';

export interface TripStartCommand {
  readonly tenantId: string;
  readonly conductorId: string;
  readonly vehicleId: string;
  readonly routeId: string;
  readonly directionId: string;
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

  listRoutes(tenantId: string): readonly RouteV1[] {
    return tenantId === demoRoute.tenantId ? [demoRoute] : [];
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
