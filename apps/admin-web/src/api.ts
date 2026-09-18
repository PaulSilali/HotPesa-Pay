import type { AuditEventV1, PaymentAttemptV1 } from '@hotpesa/contracts';

export class AdminApi {
  constructor(private readonly baseUrl: string) {}

  payments(): Promise<readonly PaymentAttemptV1[]> {
    return this.request('/api/v1/admin/payments');
  }

  auditEvents(): Promise<readonly AuditEventV1[]> {
    return this.request('/api/v1/admin/audit-events');
  }

  mockAction(id: string, action: 'reconcile' | 'expire' | 'conflict'): Promise<PaymentAttemptV1> {
    const path = action === 'reconcile'
      ? `/api/v1/payments/${encodeURIComponent(id)}/reconcile`
      : `/api/v1/mock/payments/${encodeURIComponent(id)}/${action}`;
    return this.request(path, { method: 'POST' });
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, options);
    if (!response.ok) throw new Error(`HotPesa API request failed (${response.status})`);
    return (await response.json()) as T;
  }
}
