import type {
  InitiatePaymentV1,
  JourneySessionV1,
  PaymentAttemptV1,
} from '@hotpesa/contracts';

export class ApiError extends Error {}

export class HotPesaApi {
  constructor(private readonly baseUrl: string) {}

  journey(publicCode: string): Promise<JourneySessionV1> {
    return this.request(`/api/v1/journey-sessions/${encodeURIComponent(publicCode)}`);
  }

  initiate(command: InitiatePaymentV1, idempotencyKey: string): Promise<PaymentAttemptV1> {
    return this.request('/api/v1/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(command),
    });
  }

  payment(id: string): Promise<PaymentAttemptV1> {
    return this.request(`/api/v1/payments/${encodeURIComponent(id)}`);
  }

  reconcile(id: string): Promise<PaymentAttemptV1> {
    return this.request(`/api/v1/payments/${encodeURIComponent(id)}/reconcile`, { method: 'POST' });
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, options);
    if (!response.ok) {
      const body = (await response.json().catch(() => undefined)) as { message?: string } | undefined;
      throw new ApiError(body?.message ?? `Request failed (${response.status})`);
    }
    return (await response.json()) as T;
  }
}
