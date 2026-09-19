import type { Pool } from 'pg';

interface Migration {
  readonly version: string;
  readonly sql: string;
}

export const migrations: readonly Migration[] = [
  {
    version: '001_payment_store_baseline',
    sql: `
      CREATE TABLE IF NOT EXISTS payment_attempts (
        id text PRIMARY KEY,
        journey_session_id text NOT NULL,
        amount_minor integer NOT NULL CHECK (amount_minor > 0),
        currency text NOT NULL CHECK (currency = 'KES'),
        fare_version_id text NOT NULL,
        status text NOT NULL,
        scenario text NOT NULL,
        masked_phone_number text NOT NULL,
        idempotency_key text NOT NULL UNIQUE,
        request_fingerprint text NOT NULL,
        provider_request_id text,
        created_at timestamptz NOT NULL,
        updated_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS provider_events (
        event_id text PRIMARY KEY,
        provider_request_id text NOT NULL,
        outcome text NOT NULL,
        occurred_at timestamptz NOT NULL
      );
      CREATE TABLE IF NOT EXISTS audit_events (
        id text PRIMARY KEY,
        type text NOT NULL,
        payment_attempt_id text NOT NULL,
        occurred_at timestamptz NOT NULL,
        details jsonb NOT NULL
      );
    `,
  },
  {
    version: '002_trip_payment_context',
    sql: `
      ALTER TABLE payment_attempts ADD COLUMN IF NOT EXISTS trip_id text;
      ALTER TABLE payment_attempts ADD COLUMN IF NOT EXISTS destination_stage_id text;
    `,
  },
  {
    version: '003_trip_and_journey_session_lifecycle',
    sql: `
      CREATE TABLE IF NOT EXISTS trips (
        id text PRIMARY KEY, public_code text NOT NULL UNIQUE, tenant_id text NOT NULL,
        conductor_id text NOT NULL, vehicle_id text NOT NULL, route_id text NOT NULL,
        direction_id text NOT NULL, fare_version_id text NOT NULL, state text NOT NULL,
        started_at timestamptz NOT NULL, closed_at timestamptz, summary jsonb
      );
      CREATE TABLE IF NOT EXISTS journey_sessions (
        id text PRIMARY KEY, public_code text NOT NULL UNIQUE, trip_id text NOT NULL REFERENCES trips(id),
        tenant_id text NOT NULL, state text NOT NULL, created_at timestamptz NOT NULL, closed_at timestamptz
      );
      CREATE UNIQUE INDEX IF NOT EXISTS journey_sessions_one_active_per_trip ON journey_sessions (trip_id) WHERE state = 'active';
    `,
  },
];

export async function runMigrations(pool: Pick<Pool, 'query'>): Promise<readonly string[]> {
  await pool.query('SELECT pg_advisory_lock(8152026)');
  try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _hotpesa_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const applied = await pool.query<{ version: string }>('SELECT version FROM _hotpesa_migrations');
  const appliedVersions = new Set(applied.rows.map((row) => row.version));
  const newlyApplied: string[] = [];

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;
    await pool.query('BEGIN');
    try {
      await pool.query(migration.sql);
      await pool.query('INSERT INTO _hotpesa_migrations (version) VALUES ($1)', [migration.version]);
      await pool.query('COMMIT');
      newlyApplied.push(migration.version);
    } catch (error) {
      await pool.query('ROLLBACK');
      throw error;
    }
  }

    return newlyApplied;
  } finally {
    await pool.query('SELECT pg_advisory_unlock(8152026)');
  }
}
