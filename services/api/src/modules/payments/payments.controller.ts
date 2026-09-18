import { Body, Controller, Get, Headers, Inject, Param, Post } from '@nestjs/common';
import type { InitiatePaymentV1, PaymentAttemptV1 } from '@hotpesa/contracts';
import { PaymentsService } from './payments.service.js';

@Controller('api/v1/payments')
export class PaymentsController {
  constructor(@Inject(PaymentsService) private readonly payments: PaymentsService) {}

  @Post()
  initiate(
    @Body() command: InitiatePaymentV1,
    @Headers('idempotency-key') idempotencyKey = '',
  ): Promise<PaymentAttemptV1> {
    return this.payments.initiate(command, idempotencyKey);
  }

  @Get(':id')
  get(@Param('id') id: string): PaymentAttemptV1 {
    return this.payments.get(id);
  }

  @Post(':id/reconcile')
  reconcile(@Param('id') id: string): Promise<PaymentAttemptV1> {
    return this.payments.reconcile(id);
  }
}
