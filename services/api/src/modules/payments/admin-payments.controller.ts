import { Controller, Get, Inject } from '@nestjs/common';
import type { AuditEventV1, PaymentAttemptV1 } from '@hotpesa/contracts';
import { AuditService } from '../audit/audit.service.js';
import { PaymentsService } from './payments.service.js';

@Controller('api/v1/admin')
export class AdminPaymentsController {
  constructor(
    @Inject(PaymentsService) private readonly payments: PaymentsService,
    @Inject(AuditService) private readonly audit: AuditService,
  ) {}

  @Get('payments')
  listPayments(): readonly PaymentAttemptV1[] {
    return this.payments.list();
  }

  @Get('audit-events')
  listAuditEvents(): readonly AuditEventV1[] {
    return this.audit.list();
  }
}
