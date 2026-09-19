import { Worker } from 'bullmq';
import { PaymentsService } from './payments.service.js';
import { reconciliationPolicy } from './reconciliation-policy.js';
import { ReconciliationQueue, reconciliationQueueName, type ReconciliationJob } from './reconciliation.queue.js';

export function startReconciliationWorker(payments: PaymentsService, queue: ReconciliationQueue): Worker<ReconciliationJob> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error('REDIS_URL is required for the reconciliation worker');
  return new Worker<ReconciliationJob>(reconciliationQueueName, async (job) => {
    const payment = payments.get(job.data.paymentAttemptId);
    if (payment.status !== 'pending') return;
    const reconciled = await payments.reconcile(payment.id);
    if (reconciled.status !== 'pending') return;
    const policy = reconciliationPolicy();
    if (job.data.attempt >= policy.maxAttempts) await payments.exhaustReconciliation(payment.id);
    else await queue.schedule(payment.id, job.data.attempt + 1);
  }, { connection: { url: redisUrl } });
}
