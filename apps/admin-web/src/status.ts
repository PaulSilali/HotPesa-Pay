import type { PaymentState } from '@hotpesa/contracts';

const labels: Record<PaymentState, string> = {
  created: 'Created', initiating: 'Initiating', pending: 'Pending evidence', confirmed: 'Confirmed', failed: 'Failed', expired: 'Expired', 'review-required': 'Review required',
};

export function statusLabel(status: PaymentState): string {
  return labels[status];
}
