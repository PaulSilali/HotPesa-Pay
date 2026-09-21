import { Worker } from 'bullmq';
import { PaymentsService } from './payments.service.js';
import { reconciliationPolicy } from './reconciliation-policy.js';
import { reconciliationQueueName, type ReconciliationJob } from './reconciliation.queue.js';

export function startReconciliationWorker(payments: PaymentsService): Worker<ReconciliationJob> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) throw new Error('REDIS_URL is required for the reconciliation worker');
  return new Worker<ReconciliationJob>(reconciliationQueueName, async (job) => {
    const payment = payments.get(job.data.paymentAttemptId);
    if (payment.status !== 'pending') return;
    await payments.reconciliationProcessed(payment.id, job.data.attempt);
    let reconciled;
    try {
      reconciled = await payments.reconcile(payment.id, job.data.attempt);
    } catch {
      reconciled = await payments.reconciliationProviderUnavailable(payment.id, job.data.attempt);
    }
    if (reconciled.status !== 'pending') return;
    const policy = reconciliationPolicy();
    if (job.data.attempt >= policy.maxAttempts) await payments.exhaustReconciliation(payment.id);
    else await payments.scheduleReconciliation(payment.id, job.data.attempt + 1);
  }, { connection: { url: redisUrl } });
}
