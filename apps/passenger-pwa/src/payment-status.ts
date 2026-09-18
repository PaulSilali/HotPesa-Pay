import type { PaymentState } from '@hotpesa/contracts';

export interface PaymentStatusView {
  readonly heading: string;
  readonly detail: string;
  readonly icon: string;
  readonly tone: 'neutral' | 'success' | 'danger' | 'warning';
}

const statusViews: Record<PaymentState, PaymentStatusView> = {
  created: {
    heading: 'Payment created',
    detail: 'The payment is ready to be sent to Mock M-Pesa.',
    icon: '·',
    tone: 'neutral',
  },
  initiating: {
    heading: 'Requesting payment',
    detail: 'HotPesa is sending the sandbox request. This is not confirmation.',
    icon: '…',
    tone: 'neutral',
  },
  pending: {
    heading: 'Waiting for provider confirmation',
    detail: 'A prompt or network response does not mean the fare is paid.',
    icon: '…',
    tone: 'neutral',
  },
  confirmed: {
    heading: 'Payment confirmed',
    detail: 'Trusted server-side Mock M-Pesa evidence confirmed this fare.',
    icon: '✓',
    tone: 'success',
  },
  failed: {
    heading: 'Payment failed',
    detail: 'Mock M-Pesa reported that this payment did not complete.',
    icon: '×',
    tone: 'danger',
  },
  expired: {
    heading: 'Payment expired',
    detail: 'No confirmation arrived before this attempt expired.',
    icon: '!',
    tone: 'warning',
  },
  'review-required': {
    heading: 'Payment needs review',
    detail: 'Conflicting or late provider evidence requires an operations review.',
    icon: '!',
    tone: 'warning',
  },
};

export function paymentStatusView(status: PaymentState): PaymentStatusView {
  return statusViews[status];
}
