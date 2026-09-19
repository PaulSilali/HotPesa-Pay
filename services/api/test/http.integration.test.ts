import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module.js';

describe('Phase 0 HTTP integration', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { logger: false });
    await app.listen(0, '127.0.0.1');
    const address = app.getHttpServer().address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  }, 30_000);

  afterAll(async () => {
    await app.close();
  }, 30_000);

  it('serves the synthetic journey session by public URL code', async () => {
    const response = await fetch(`${baseUrl}/api/v1/journey-sessions/demo-nairobi-cbd-westlands`);
    const body = (await response.json()) as {
      fare: { amountMinor: number; fareVersionId: string };
      route: { directions: readonly { stages: readonly unknown[] }[] };
    };

    expect(response.status).toBe(200);
    expect(body.fare).toEqual(expect.objectContaining({ amountMinor: 8_000, fareVersionId: 'fare-demo-v1' }));
    expect(body.route.directions[0]?.stages).toHaveLength(3);
  });

  it('starts an assigned trip and calculates a server-side destination fare', async () => {
    const tripResponse = await fetch(`${baseUrl}/api/v1/journey-sessions/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Tenant-Id': 'tenant-demo-sacco' },
      body: JSON.stringify({
        conductorId: 'conductor-demo',
        vehicleId: 'vehicle-demo-kaa-000d',
        routeId: 'route-cbd-westlands',
        directionId: 'direction-cbd-westlands',
      }),
    });
    const trip = (await tripResponse.json()) as { id: string; state: string };

    expect(tripResponse.status).toBe(201);
    expect(trip.state).toBe('active');

    const quoteResponse = await fetch(`${baseUrl}/api/v1/trips/${trip.id}/fare-quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationStageId: 'stage-westlands', amountMinor: 1 }),
    });
    await expect(quoteResponse.json()).resolves.toMatchObject({
      amountMinor: 8_000,
      destinationStageId: 'stage-westlands',
      fareVersionId: 'fare-demo-v1',
    });
  });

  it('initiates, confirms from an internal mock callback, and returns a redacted view', async () => {
    const fullPhone = '+254700000009';
    const response = await fetch(`${baseUrl}/api/v1/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'http-happy-001' },
      body: JSON.stringify({
        journeySessionId: 'journey-session-demo',
        phoneNumber: fullPhone,
        scenario: 'confirmed',
      }),
    });
    const pending = (await response.json()) as { id: string; status: string };
    expect(pending.status).toBe('pending');

    const callback = await fetch(`${baseUrl}/api/v1/mock/payments/${pending.id}/deliver-callbacks`, {
      method: 'POST',
    });
    const confirmedText = await callback.text();
    expect(callback.status).toBe(201);
    expect(JSON.parse(confirmedText)).toMatchObject({ status: 'confirmed' });
    expect(confirmedText).not.toContain(fullPhone);
  });

  it('associates a payment with the active trip and server fare quote', async () => {
    const existingTrips = await fetch(`${baseUrl}/api/v1/journey-sessions/trips`, {
      headers: { 'X-Tenant-Id': 'tenant-demo-sacco' },
    });
    const trips = (await existingTrips.json()) as { id: string }[];
    const trip = trips[0] ?? (await (async () => {
      const response = await fetch(`${baseUrl}/api/v1/journey-sessions/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Tenant-Id': 'tenant-demo-sacco' },
        body: JSON.stringify({
          conductorId: 'conductor-demo', vehicleId: 'vehicle-demo-kaa-000d',
          routeId: 'route-cbd-westlands', directionId: 'direction-cbd-westlands',
        }),
      });
      return (await response.json()) as { id: string };
    })());

    const paymentResponse = await fetch(`${baseUrl}/api/v1/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'http-trip-payment-001' },
      body: JSON.stringify({
        tripId: trip.id,
        destinationStageId: 'stage-parklands',
        phoneNumber: '+254700000008',
        scenario: 'confirmed',
      }),
    });
    await expect(paymentResponse.json()).resolves.toMatchObject({
      tripId: trip.id,
      destinationStageId: 'stage-parklands',
      amountMinor: 5_000,
      status: 'pending',
    });
  });

  it('fails deterministically and records duplicate callback delivery once', async () => {
    const create = async (scenario: 'failed' | 'duplicate-callback', key: string) => {
      const response = await fetch(`${baseUrl}/api/v1/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
        body: JSON.stringify({
          journeySessionId: 'journey-session-demo',
          phoneNumber: '+254711111119',
          scenario,
        }),
      });
      return (await response.json()) as { id: string };
    };

    const failed = await create('failed', 'http-failed-001');
    const failedResult = await fetch(`${baseUrl}/api/v1/mock/payments/${failed.id}/deliver-callbacks`, {
      method: 'POST',
    });
    await expect(failedResult.json()).resolves.toMatchObject({ status: 'failed' });

    const duplicate = await create('duplicate-callback', 'http-duplicate-001');
    await fetch(`${baseUrl}/api/v1/mock/payments/${duplicate.id}/deliver-callbacks`, { method: 'POST' });
    const events = await fetch(`${baseUrl}/api/v1/admin/audit-events`);
    const eventBody = (await events.json()) as { type: string; paymentAttemptId: string }[];
    expect(
      eventBody.filter(
        (event) =>
          event.paymentAttemptId === duplicate.id &&
          event.type === 'payment.provider-evidence-duplicate',
      ),
    ).toHaveLength(1);
  });
});
