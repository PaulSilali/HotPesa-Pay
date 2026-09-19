import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuditService } from '../src/modules/audit/audit.service.js';
import { MockMpesaProvider } from '../src/modules/payments/mock-mpesa.provider.js';
import { PaymentStore } from '../src/modules/payments/payment.store.js';
import { PaymentsService } from '../src/modules/payments/payments.service.js';

describe('PaymentsService', () => {
  let store: PaymentStore;
  let audit: AuditService;
  let service: PaymentsService;

  beforeEach(() => {
    store = new PaymentStore();
    audit = new AuditService(store);
    service = new PaymentsService(store, new MockMpesaProvider(), audit);
  });

  it('returns the same payment for the same idempotent request', async () => {
    const command = {
      journeySessionId: 'journey-session-demo',
      phoneNumber: '+254700000001',
      scenario: 'confirmed' as const,
    };
    const first = await service.initiate(command, 'idem-confirmed-001');
    const second = await service.initiate(command, 'idem-confirmed-001');

    expect(second.id).toBe(first.id);
    expect(service.list()).toHaveLength(1);
  });

  it('rejects idempotency-key reuse with a different request', async () => {
    await service.initiate(
      {
        journeySessionId: 'journey-session-demo',
        phoneNumber: '+254700000001',
        scenario: 'confirmed',
      },
      'idem-collision-001',
    );

    await expect(
      service.initiate(
        {
          journeySessionId: 'journey-session-demo',
          phoneNumber: '+254700000001',
          scenario: 'failed',
        },
        'idem-collision-001',
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('applies duplicate callbacks once and audits the duplicate', async () => {
    const pending = await service.initiate(
      {
        journeySessionId: 'journey-session-demo',
        phoneNumber: '+254711111111',
        scenario: 'duplicate-callback',
      },
      'idem-duplicate-001',
    );
    const confirmed = await service.deliverCallbacks(pending.id);

    expect(confirmed.status).toBe('confirmed');
    expect(audit.list().filter((event) => event.type === 'payment.provider-evidence-duplicate')).toHaveLength(1);
  });

  it('reconciles trusted status evidence when the callback is missing', async () => {
    const pending = await service.initiate(
      {
        journeySessionId: 'journey-session-demo',
        phoneNumber: '+254722222222',
        scenario: 'missing-callback',
      },
      'idem-missing-001',
    );

    expect(pending.status).toBe('pending');
    await expect(service.reconcile(pending.id)).resolves.toMatchObject({ status: 'confirmed' });
  });

  it('supports expiry and routes later confirmed evidence to review', async () => {
    const pending = await service.initiate(
      {
        journeySessionId: 'journey-session-demo',
        phoneNumber: '+254733333333',
        scenario: 'missing-callback',
      },
      'idem-expired-001',
    );

    await expect(service.expire(pending.id)).resolves.toMatchObject({ status: 'expired' });
    expect(audit.list().some((event) => event.type === 'payment.expired')).toBe(true);
    await expect(service.reconcile(pending.id)).resolves.toMatchObject({ status: 'review-required' });
  });

  it('does not report confirmation when provider initiation is unavailable', async () => {
    class UnavailableProvider extends MockMpesaProvider {
      override async initiate(): Promise<never> {
        throw new Error('provider unavailable');
      }
    }

    const unavailable = new PaymentsService(store, new UnavailableProvider(), audit);

    await expect(
      unavailable.initiate(
        {
          journeySessionId: 'journey-session-demo',
          phoneNumber: '+254755555555',
          scenario: 'confirmed',
        },
        'idem-provider-unavailable-001',
      ),
    ).rejects.toThrow('provider unavailable');
    expect(JSON.stringify(unavailable.list())).not.toContain('"status":"confirmed"');
    expect(JSON.stringify(audit.list())).not.toContain('payment.provider-accepted');
  });

  it('does not expire a confirmed payment', async () => {
    const pending = await service.initiate(
      {
        journeySessionId: 'journey-session-demo',
        phoneNumber: '+254733333334',
        scenario: 'confirmed',
      },
      'idem-no-expire-001',
    );
    await service.deliverCallbacks(pending.id);

    await expect(service.expire(pending.id)).resolves.toMatchObject({ status: 'confirmed' });
  });

  it('never includes a full phone number in stored views or audit events', async () => {
    const fullPhone = '+254744444444';
    const payment = await service.initiate(
      {
        journeySessionId: 'journey-session-demo',
        phoneNumber: fullPhone,
        scenario: 'missing-callback',
      },
      'idem-redaction-001',
    );

    expect(payment.maskedPhoneNumber).toBe('+254•••••444');
    expect(JSON.stringify(service.list())).not.toContain(fullPhone);
    expect(JSON.stringify(audit.list())).not.toContain(fullPhone);
  });
});
