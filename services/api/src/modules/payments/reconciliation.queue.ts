import { Injectable, type OnApplicationShutdown } from '@nestjs/common';
import { Queue } from 'bullmq';
import { reconciliationPolicy } from './reconciliation-policy.js';

export const reconciliationQueueName = 'payment-reconciliation';
export interface ReconciliationJob { readonly paymentAttemptId: string; readonly attempt: number; }

@Injectable()
export class ReconciliationQueue implements OnApplicationShutdown {
  private readonly queue?: Queue<ReconciliationJob>;
  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) this.queue = new Queue(reconciliationQueueName, { connection: { url: redisUrl } });
  }
  async schedule(paymentAttemptId: string, attempt = 1): Promise<boolean> {
    if (!this.queue) return false;
    const policy = reconciliationPolicy();
    if (attempt > policy.maxAttempts) return false;
    await this.queue.add('reconcile', { paymentAttemptId, attempt }, { jobId: `reconcile:${paymentAttemptId}:${attempt}`, delay: policy.delaysMs[attempt - 1], removeOnComplete: true, removeOnFail: false });
    return true;
  }
  async onApplicationShutdown(): Promise<void> { await this.queue?.close(); }
}
