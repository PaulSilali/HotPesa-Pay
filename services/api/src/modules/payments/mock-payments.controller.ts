import { Controller, Inject, Param, Post } from '@nestjs/common';
import type { PaymentAttemptV1 } from '@hotpesa/contracts';
import { PaymentsService } from './payments.service.js';

@Controller('api/v1/mock/payments')
export class MockPaymentsController {
  constructor(@Inject(PaymentsService) private readonly payments: PaymentsService) {}

  @Post(':id/deliver-callbacks')
  deliverCallbacks(@Param('id') id: string): Promise<PaymentAttemptV1> {
    return this.payments.deliverCallbacks(id);
  }

  @Post(':id/expire')
  expire(@Param('id') id: string): Promise<PaymentAttemptV1> {
    return this.payments.expire(id);
  }

  @Post(':id/conflict')
  conflict(@Param('id') id: string): Promise<PaymentAttemptV1> {
    return this.payments.createConflict(id);
  }
}
