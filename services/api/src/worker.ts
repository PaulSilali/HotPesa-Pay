import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { PaymentsService } from './modules/payments/payments.service.js';
import { ReconciliationQueue } from './modules/payments/reconciliation.queue.js';
import { startReconciliationWorker } from './modules/payments/reconciliation.worker.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const worker = startReconciliationWorker(app.get(PaymentsService), app.get(ReconciliationQueue));
  worker.on('error', (error) => console.error('reconciliation worker error', error.message));
  const stop = async () => { await worker.close(); await app.close(); };
  process.once('SIGINT', () => void stop());
  process.once('SIGTERM', () => void stop());
}
void bootstrap();
