import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { migrations, runMigrations } from '../src/persistence/migrations.js';

const databaseUrl = process.env.HOTPESA_POSTGRES_TEST_URL;
const describeWithPostgres = databaseUrl ? describe : describe.skip;

describeWithPostgres('PostgreSQL migrations', () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = new Pool({ connectionString: databaseUrl });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('applies deterministically and is safe to repeat', async () => {
    const first = await runMigrations(pool);
    const second = await runMigrations(pool);
    const versions = await pool.query<{ version: string }>(
      'SELECT version FROM _hotpesa_migrations ORDER BY version',
    );
    const columns = await pool.query<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'payment_attempts' AND column_name IN ('trip_id', 'destination_stage_id')
       ORDER BY column_name`,
    );

    expect(migrations.map((migration) => migration.version)).toEqual([
      '001_payment_store_baseline',
      '002_trip_payment_context',
      '003_trip_and_journey_session_lifecycle',
    ]);
    expect(first.length).toBeGreaterThanOrEqual(0);
    expect(second).toEqual([]);
    expect(versions.rows.map((row) => row.version)).toEqual(migrations.map((migration) => migration.version));
    expect(columns.rows.map((row) => row.column_name)).toEqual(['destination_stage_id', 'trip_id']);
  });
});
