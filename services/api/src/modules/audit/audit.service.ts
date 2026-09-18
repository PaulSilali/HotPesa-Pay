import { Inject, Injectable } from '@nestjs/common';
import type { AuditEventType, AuditEventV1 } from '@hotpesa/contracts';
import { randomUUID } from 'node:crypto';
import { PaymentStore } from '../payments/payment.store.js';

type SafeAuditDetails = Readonly<Record<string, string | number | boolean | null>>;

@Injectable()
export class AuditService {
  constructor(@Inject(PaymentStore) private readonly store: PaymentStore) {}

  record(type: AuditEventType, paymentAttemptId: string, details: SafeAuditDetails = {}): void {
    const event: AuditEventV1 = {
      id: randomUUID(),
      type,
      paymentAttemptId,
      occurredAt: new Date().toISOString(),
      details,
    };
    this.store.appendAudit(event);
  }

  list(): readonly AuditEventV1[] {
    return this.store.listAuditEvents();
  }
}
