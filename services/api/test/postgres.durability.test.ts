import { ConflictException } from '@nestjs/common';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AuditService } from '../src/modules/audit/audit.service.js';
import { MockMpesaProvider } from '../src/modules/payments/mock-mpesa.provider.js';
import { PaymentStore } from '../src/modules/payments/payment.store.js';
import { PaymentsService } from '../src/modules/payments/payments.service.js';
import { FareService } from '../src/modules/fares/fare.service.js';
import { JourneyService } from '../src/modules/journeys/journey.service.js';

const databaseUrl = process.env.HOTPESA_POSTGRES_TEST_URL;
const describeWithPostgres = databaseUrl ? describe : describe.skip;

describeWithPostgres('PostgreSQL payment durability', () => {
  const originalStore = process.env.HOTPESA_STORE;
  const originalDatabaseUrl = process.env.DATABASE_URL;
  const unique = `${Date.now()}-${process.pid}`;
  const idempotencyKey = `postgres-durability-${unique}`;
  const fullPhone = '+254755555555';
  let firstStore: PaymentStore | undefined;
  let paymentId: string;

  beforeAll(() => {
    process.env.HOTPESA_STORE = 'postgres';
    process.env.DATABASE_URL = databaseUrl;
  });

  afterAll(async () => {
    await firstStore?.onApplicationShutdown();
    if (originalStore === undefined) delete process.env.HOTPESA_STORE;
    else process.env.HOTPESA_STORE = originalStore;
    if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('survives restart while preserving idempotency, duplicate evidence and redaction', async () => {
    const initialStore = new PaymentStore();
    firstStore = initialStore;
    await initialStore.onModuleInit();
    const firstAudit = new AuditService(initialStore);
    const journeyService = new JourneyService(initialStore);
    await journeyService.onModuleInit();
    const trip = await journeyService.startTrip({
      tenantId: 'tenant-demo-sacco', conductorId: 'conductor-demo', vehicleId: 'vehicle-demo-kaa-000d',
      routeId: 'route-cbd-westlands', directionId: 'direction-cbd-westlands',
    }, new Date('2026-09-19T12:00:00.000Z'));
    const firstService = new PaymentsService(initialStore, new MockMpesaProvider(), firstAudit, new FareService(journeyService), journeyService);
    const command = {
      journeySessionId: journeyService.journeySessionForPublicCode(trip.publicCode)?.id,
      destinationStageId: 'stage-westlands',
      phoneNumber: fullPhone,
      scenario: 'duplicate-callback' as const,
    };

    const pending = await firstService.initiate(command, idempotencyKey);
    const confirmed = await firstService.deliverCallbacks(pending.id);
    paymentId = confirmed.id;
    expect(confirmed.tripId).toBe(trip.id);
    expect(confirmed.destinationStageId).toBe('stage-westlands');
    expect(confirmed).toMatchObject({ status: 'confirmed', maskedPhoneNumber: '+254•••••555' });
    expect(firstAudit.list().some((event) => event.type === 'payment.provider-evidence-duplicate')).toBe(true);
    expect(JSON.stringify(firstService.list())).not.toContain(fullPhone);
    expect(JSON.stringify(firstAudit.list())).not.toContain(fullPhone);

    await initialStore.onApplicationShutdown();
    await journeyService.onApplicationShutdown();
    firstStore = undefined;

    const restartedStore = new PaymentStore();
    await restartedStore.onModuleInit();
    const restartedJourneyService = new JourneyService(restartedStore);
    await restartedJourneyService.onModuleInit();
    try {
      const restartedAudit = new AuditService(restartedStore);
      const restartedService = new PaymentsService(
        restartedStore,
        new MockMpesaProvider(),
        restartedAudit,
        new FareService(restartedJourneyService),
        restartedJourneyService,
      );

      expect(restartedJourneyService.journeySessionForPublicCode(trip.publicCode)?.publicCode).toBe(trip.publicCode);

      expect(restartedService.get(paymentId)).toMatchObject({
        id: paymentId,
        status: 'confirmed',
        maskedPhoneNumber: '+254•••••555',
      });
      await expect(restartedService.initiate(command, idempotencyKey)).resolves.toMatchObject({
        id: paymentId,
        tripId: trip.id,
        destinationStageId: 'stage-westlands',
      });
      await expect(
        restartedService.initiate({ ...command, scenario: 'failed' }, idempotencyKey),
      ).rejects.toBeInstanceOf(ConflictException);

      await restartedService.deliverCallbacks(paymentId);
      expect(restartedService.get(paymentId).status).toBe('confirmed');
      expect(
        restartedAudit.list().filter((event) => event.type === 'payment.provider-evidence-duplicate')
          .length,
      ).toBeGreaterThanOrEqual(2);
      expect(JSON.stringify(restartedService.list())).not.toContain(fullPhone);
      expect(JSON.stringify(restartedAudit.list())).not.toContain(fullPhone);
      await restartedJourneyService.closeTrip({ tripId: trip.id, tenantId: trip.tenantId, actorId: trip.conductorId, role: 'conductor' });
      await restartedJourneyService.onApplicationShutdown();
      const closedJourneyService = new JourneyService(restartedStore);
      await closedJourneyService.onModuleInit();
      expect(closedJourneyService.journeySessionForPublicCode(trip.publicCode)).toBeUndefined();
      await closedJourneyService.onApplicationShutdown();
    } finally {
      await restartedStore.onApplicationShutdown();
    }
  }, 30_000);
});
