import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuditService } from './modules/audit/audit.service.js';
import { JourneysController } from './modules/journeys/journeys.controller.js';
import { AdminPaymentsController } from './modules/payments/admin-payments.controller.js';
import { MockMpesaProvider } from './modules/payments/mock-mpesa.provider.js';
import { MockPaymentsController } from './modules/payments/mock-payments.controller.js';
import { PaymentStore } from './modules/payments/payment.store.js';
import { PaymentsController } from './modules/payments/payments.controller.js';
import { PaymentsService } from './modules/payments/payments.service.js';

@Module({
  controllers: [
    AppController,
    JourneysController,
    PaymentsController,
    MockPaymentsController,
    AdminPaymentsController,
  ],
  providers: [AppService, PaymentStore, MockMpesaProvider, AuditService, PaymentsService],
})
export class AppModule {}
