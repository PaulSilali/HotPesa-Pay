import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

export type WorkforceRole = 'conductor' | 'sacco-operations' | 'fare-creator' | 'fare-approver' | 'finance';
export interface WorkforceUser { id: string; issuer: string; subject: string; status: 'active' | 'inactive'; }
export interface TenantMembership { tenantId: string; workforceUserId: string; roles: readonly WorkforceRole[]; status: 'active' | 'inactive'; }
export interface ConductorAssignment { tenantId: string; conductorId: string; vehicleId: string; routeId: string; directionId: string; validFrom: string; validTo?: string; status: 'active' | 'revoked'; }

const users: readonly WorkforceUser[] = [{ id: 'conductor-demo', issuer: 'dev-fixture', subject: 'conductor-demo', status: 'active' }];
const memberships: readonly TenantMembership[] = [{ tenantId: 'tenant-demo-sacco', workforceUserId: 'conductor-demo', roles: ['conductor'], status: 'active' }];
const assignments: readonly ConductorAssignment[] = [{ tenantId: 'tenant-demo-sacco', conductorId: 'conductor-demo', vehicleId: 'vehicle-demo-kaa-000d', routeId: 'route-cbd-westlands', directionId: 'direction-cbd-westlands', validFrom: '2026-01-01T00:00:00.000Z', status: 'active' }];

@Injectable()
export class WorkforceAuthorizationService {
  authorizeTripStart(command: { tenantId: string; conductorId: string; vehicleId: string; routeId: string; directionId: string }, now: Date): void {
    const user = users.find((item) => item.id === command.conductorId);
    const membership = memberships.find((item) => item.tenantId === command.tenantId && item.workforceUserId === command.conductorId);
    const assignment = assignments.find((item) => item.tenantId === command.tenantId && item.conductorId === command.conductorId && item.vehicleId === command.vehicleId && item.routeId === command.routeId && item.directionId === command.directionId);
    if (!user || user.status !== 'active' || !membership || membership.status !== 'active' || !membership.roles.includes('conductor') || !assignment || assignment.status !== 'active') throw new UnauthorizedException('Active conductor assignment and membership are required');
    const timestamp = now.toISOString();
    if (timestamp < assignment.validFrom || (assignment.validTo !== undefined && timestamp >= assignment.validTo)) throw new ForbiddenException('Conductor assignment is outside its validity window');
  }
}
