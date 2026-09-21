import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Queue } from 'bullmq';
import type { ProviderEvidenceV1 } from '@hotpesa/contracts';
import { AuditService } from '../src/modules/audit/audit.service.js';
import { MockMpesaProvider } from '../src/modules/payments/mock-mpesa.provider.js';
import { PaymentStore } from '../src/modules/payments/payment.store.js';
import { PaymentsService } from '../src/modules/payments/payments.service.js';
import { ReconciliationQueue, reconciliationQueueName } from '../src/modules/payments/reconciliation.queue.js';
import { startReconciliationWorker } from '../src/modules/payments/reconciliation.worker.js';

const databaseUrl = process.env.HOTPESA_POSTGRES_TEST_URL;
const redisUrl = process.env.HOTPESA_REDIS_TEST_URL;
const describeWithServices = databaseUrl && redisUrl ? describe : describe.skip;

class ControlledProvider extends MockMpesaProvider {
  mode: 'confirmed' | 'failed' | 'unresolved' | 'unavailable' = 'confirmed';

  override async reconcile(request: Parameters<MockMpesaProvider['reconcile']>[0]): Promise<ProviderEvidenceV1 | null> {
    if (this.mode === 'unavailable') throw new Error('provider unavailable');
    if (this.mode === 'unresolved') return null;
    if (this.mode === 'failed') return { eventId: `live-failed-${request.providerRequestId}`, providerRequestId: request.providerRequestId, outcome: 'failed', occurredAt: new Date().toISOString(), trusted: true };
    return super.reconcile(request);
  }
}

async function waitFor(check: () => boolean, description: string): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    if (check()) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Timed out waiting for ${description}`);
}

describeWithServices('live PostgreSQL and Redis reconciliation', () => {
  const original = {
    store: process.env.HOTPESA_STORE,
    database: process.env.DATABASE_URL,
    redis: process.env.REDIS_URL,
    attempts: process.env.RECONCILIATION_MAX_ATTEMPTS,
    delays: process.env.RECONCILIATION_DELAYS_MS,
  };
  const suffix = `${Date.now()}-${process.pid}`;
  let inspector: Queue;

  beforeAll(() => {
    process.env.HOTPESA_STORE = 'postgres';
    process.env.DATABASE_URL = databaseUrl;
    process.env.REDIS_URL = redisUrl;
    process.env.RECONCILIATION_MAX_ATTEMPTS = '5';
    process.env.RECONCILIATION_DELAYS_MS = '25,25,25,25,25';
    inspector = new Queue(reconciliationQueueName, { connection: { url: redisUrl } });
  });

  afterAll(async () => {
    await inspector.close();
    for (const [key, value] of Object.entries(original)) {
      const environmentKey = key === 'store' ? 'HOTPESA_STORE' : key === 'database' ? 'DATABASE_URL' : key === 'redis' ? 'REDIS_URL' : key === 'attempts' ? 'RECONCILIATION_MAX_ATTEMPTS' : 'RECONCILIATION_DELAYS_MS';
      if (value === undefined) delete process.env[environmentKey];
      else process.env[environmentKey] = value;
    }
  });

  async function createContext(provider = new ControlledProvider()) {
    const store = new PaymentStore();
    await store.onModuleInit();
    const audit = new AuditService(store);
    const queue = new ReconciliationQueue();
    const payments = new PaymentsService(store, provider, audit, undefined, undefined, queue);
    return { store, audit, queue, payments, provider };
  }

  async function closeContext(context: Awaited<ReturnType<typeof createContext>>): Promise<void> {
    await context.queue.onApplicationShutdown();
    await context.store.onApplicationShutdown();
  }

  it('persists a pending payment and schedules a minimal first-attempt job', async () => {
    const context = await createContext();
    try {
      const payment = await context.payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000001', scenario: 'missing-callback' }, `live-schedule-${suffix}`);
      const job = await inspector.getJob(`reconcile:${payment.id}:1`);
      expect(payment.status).toBe('pending');
      expect(job?.data).toEqual({ paymentAttemptId: payment.id, attempt: 1 });
      expect(job?.opts.delay).toBe(25);
      await expect(context.queue.schedule(payment.id, 1)).resolves.toBe(false);
      expect(context.audit.list().some((event) => event.type === 'payment.reconciliation-scheduled')).toBe(true);
    } finally { await closeContext(context); }
  }, 30_000);

  it('consumes missing-callback work, persists confirmation, and counts revenue once', async () => {
    const context = await createContext();
    const worker = startReconciliationWorker(context.payments);
    try {
      const payment = await context.payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000002', scenario: 'missing-callback' }, `live-consume-${suffix}`);
      await waitFor(() => context.payments.get(payment.id).status === 'confirmed', 'worker confirmation');
      expect(context.payments.get(payment.id).amountMinor).toBe(8_000);
      expect(context.audit.list().some((event) => event.type === 'payment.reconciliation-processed')).toBe(true);
    } finally { await worker.close(); await closeContext(context); }
  }, 30_000);

  it('recovers after provider unavailability and then applies trusted confirmation', async () => {
    const provider = new ControlledProvider();
    provider.mode = 'unavailable';
    const context = await createContext(provider);
    const worker = startReconciliationWorker(context.payments);
    try {
      const payment = await context.payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000003', scenario: 'missing-callback' }, `live-recovery-${suffix}`);
      await waitFor(() => context.audit.list().some((event) => event.type === 'payment.reconciliation-provider-unavailable'), 'provider outage audit');
      provider.mode = 'confirmed';
      await waitFor(() => context.payments.get(payment.id).status === 'confirmed', 'provider recovery confirmation');
      expect(context.audit.list().some((event) => event.type === 'payment.reconciliation-scheduled' && event.details.attempt === 2)).toBe(true);
    } finally { await worker.close(); await closeContext(context); }
  }, 30_000);

  it('keeps one confirmed state when callback and worker evidence race', async () => {
    const context = await createContext();
    const worker = startReconciliationWorker(context.payments);
    try {
      const payment = await context.payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000008', scenario: 'confirmed' }, `live-race-${suffix}`);
      await waitFor(() => context.audit.list().filter((event) => event.type === 'payment.provider-evidence-applied' && event.paymentAttemptId === payment.id).length === 2, 'callback and worker evidence');
      expect(context.payments.get(payment.id).status).toBe('confirmed');
      expect(context.payments.get(payment.id).amountMinor).toBe(8_000);
    } finally { await worker.close(); await closeContext(context); }
  }, 30_000);

  it('exhausts exactly five unresolved attempts without confirming or expiring', async () => {
    const provider = new ControlledProvider();
    provider.mode = 'unresolved';
    const context = await createContext(provider);
    const worker = startReconciliationWorker(context.payments);
    try {
      const payment = await context.payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000004', scenario: 'missing-callback' }, `live-exhaust-${suffix}`);
      await waitFor(() => context.payments.get(payment.id).status === 'review-required', 'retry exhaustion');
      const processed = context.audit.list().filter((event) => event.type === 'payment.reconciliation-processed' && event.paymentAttemptId === payment.id);
      expect(processed).toHaveLength(5);
      expect(context.audit.list().some((event) => event.type === 'payment.reconciliation-exhausted')).toBe(true);
      expect(context.payments.get(payment.id).status).toBe('review-required');
    } finally { await worker.close(); await closeContext(context); }
  }, 30_000);

  it('keeps a queued payment across API-store restart and lets a restarted worker complete it', async () => {
    const context = await createContext();
    const payment = await context.payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000005', scenario: 'missing-callback' }, `live-restart-${suffix}`);
    await closeContext(context);

    const restartedStore = new PaymentStore();
    await restartedStore.onModuleInit();
    const restartedQueue = new ReconciliationQueue();
    const restartedPayments = new PaymentsService(restartedStore, new ControlledProvider(), new AuditService(restartedStore), undefined, undefined, restartedQueue);
    const worker = startReconciliationWorker(restartedPayments);
    try {
      expect(restartedPayments.get(payment.id).status).toBe('pending');
      await waitFor(() => restartedPayments.get(payment.id).status === 'confirmed', 'restarted worker confirmation');
    } finally {
      await worker.close();
      await restartedQueue.onApplicationShutdown();
      await restartedStore.onApplicationShutdown();
    }
  }, 30_000);

  it('allows manual trusted recovery from review-required and applies it once', async () => {
    const provider = new ControlledProvider();
    provider.mode = 'unresolved';
    const context = await createContext(provider);
    const worker = startReconciliationWorker(context.payments);
    try {
      const payment = await context.payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000006', scenario: 'missing-callback' }, `live-manual-${suffix}`);
      await waitFor(() => context.payments.get(payment.id).status === 'review-required', 'review-required state');
      provider.mode = 'failed';
      await expect(context.payments.reconcile(payment.id)).resolves.toMatchObject({ status: 'failed' });
      await expect(context.payments.reconcile(payment.id)).resolves.toMatchObject({ status: 'failed' });
      expect(context.audit.list().filter((event) => event.type === 'payment.late-provider-evidence-applied' && event.paymentAttemptId === payment.id)).toHaveLength(1);
    } finally { await worker.close(); await closeContext(context); }
  }, 30_000);

  it('keeps the PostgreSQL payment pending and audits a Redis enqueue failure', async () => {
    const savedRedis = process.env.REDIS_URL;
    process.env.REDIS_URL = 'redis://127.0.0.1:6399';
    const store = new PaymentStore();
    await store.onModuleInit();
    const queue = new ReconciliationQueue();
    const audit = new AuditService(store);
    const payments = new PaymentsService(store, new ControlledProvider(), audit, undefined, undefined, queue);
    try {
      const payment = await payments.initiate({ journeySessionId: 'journey-session-demo', phoneNumber: '+254700000007', scenario: 'missing-callback' }, `live-enqueue-failure-${suffix}`);
      expect(payment.status).toBe('pending');
      expect(audit.list().some((event) => event.type === 'payment.reconciliation-scheduling-failed' && event.paymentAttemptId === payment.id)).toBe(true);
    } finally {
      await queue.onApplicationShutdown();
      await store.onApplicationShutdown();
      process.env.REDIS_URL = savedRedis;
    }
  }, 30_000);
});
