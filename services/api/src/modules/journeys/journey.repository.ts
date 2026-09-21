import { Pool } from 'pg';
import type { TripV1 } from '@hotpesa/contracts';
import { runMigrations } from '../../persistence/migrations.js';

export interface PersistedSession { id: string; publicCode: string; tripId: string; tenantId: string; state: 'active' | 'closed'; createdAt: string; closedAt?: string; }

export class JourneyRepository {
  private readonly pool: Pool;
  constructor(connectionString: string) { this.pool = new Pool({ connectionString, max: 3 }); }
  async initialize(): Promise<void> { await runMigrations(this.pool); }
  async load(): Promise<{ trips: TripV1[]; sessions: PersistedSession[] }> {
    const [tripRows, sessionRows] = await Promise.all([this.pool.query('SELECT * FROM trips'), this.pool.query('SELECT * FROM journey_sessions')]);
    return { trips: tripRows.rows.map((row) => ({ id: row.id, publicCode: row.public_code, tenantId: row.tenant_id, conductorId: row.conductor_id, vehicleId: row.vehicle_id, routeId: row.route_id, directionId: row.direction_id, fareVersionId: row.fare_version_id, state: row.state, startedAt: row.started_at.toISOString(), ...(row.closed_at ? { closedAt: row.closed_at.toISOString() } : {}), ...(row.summary ? { summary: row.summary } : {}) })), sessions: sessionRows.rows.map((row) => ({ id: row.id, publicCode: row.public_code, tripId: row.trip_id, tenantId: row.tenant_id, state: row.state, createdAt: row.created_at.toISOString(), ...(row.closed_at ? { closedAt: row.closed_at.toISOString() } : {}) })) };
  }
  async create(trip: TripV1, session: PersistedSession): Promise<void> { await this.pool.query('BEGIN'); try { await this.pool.query('INSERT INTO trips (id,public_code,tenant_id,conductor_id,vehicle_id,route_id,direction_id,fare_version_id,state,started_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [trip.id,trip.publicCode,trip.tenantId,trip.conductorId,trip.vehicleId,trip.routeId,trip.directionId,trip.fareVersionId,trip.state,trip.startedAt]); await this.pool.query('INSERT INTO journey_sessions (id,public_code,trip_id,tenant_id,state,created_at) VALUES ($1,$2,$3,$4,$5,$6)', [session.id,session.publicCode,session.tripId,session.tenantId,session.state,session.createdAt]); await this.pool.query('COMMIT'); } catch(error) { await this.pool.query('ROLLBACK'); throw error; } }
  async close(trip: TripV1): Promise<void> { await this.pool.query('BEGIN'); try { await this.pool.query('UPDATE trips SET state=$2, closed_at=$3, summary=$4 WHERE id=$1', [trip.id,trip.state,trip.closedAt,trip.summary ?? null]); await this.pool.query("UPDATE journey_sessions SET state='closed', closed_at=$2 WHERE trip_id=$1 AND state='active'", [trip.id,trip.closedAt]); await this.pool.query('COMMIT'); } catch(error) { await this.pool.query('ROLLBACK'); throw error; } }
  async shutdown(): Promise<void> { await this.pool.end(); }
}
