import { Queue } from 'bullmq';
import { reconciliationPolicy } from './reconciliation-policy.js';

export const reconciliationQueueName = 'payment-reconciliation';

export interface ReconciliationJob { readonly paymentAttemptId: string; }

export class ReconciliationQueue {
  private readonly queue: Queue<ReconciliationJob>;
  constructor(redisUrl: string) { this.queue = new Queue(reconciliationQueueName, { connection: { url: redisUrl } }); }
  async schedule(paymentAttemptId: string): Promise<void> {
    const policy = reconciliationPolicy();
    await this.queue.add('reconcile', { paymentAttemptId }, { jobId: `reconcile:${paymentAttemptId}`, attempts: policy.maxAttempts, backoff: { type: 'custom' }, removeOnComplete: false, removeOnFail: false, delay: policy.delaysMs[0] });
  }
  async close(): Promise<void> { await this.queue.close(); }
}
