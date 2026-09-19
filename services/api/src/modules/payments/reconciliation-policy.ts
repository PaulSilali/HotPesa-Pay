export interface ReconciliationPolicy {
  readonly maxAttempts: number;
  readonly delaysMs: readonly number[];
}

const defaultDelaysMs = [30_000, 60_000, 120_000, 300_000, 600_000] as const;

export function reconciliationPolicy(environment: NodeJS.ProcessEnv = process.env): ReconciliationPolicy {
  const maxAttempts = Number(environment.RECONCILIATION_MAX_ATTEMPTS ?? 5);
  const delaysMs = String(environment.RECONCILIATION_DELAYS_MS ?? defaultDelaysMs.join(','))
    .split(',').map((value) => Number(value.trim()));
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 5 || delaysMs.length !== maxAttempts || delaysMs.some((delay) => !Number.isInteger(delay) || delay < 1)) {
    throw new Error('Invalid reconciliation retry configuration');
  }
  return { maxAttempts, delaysMs };
}
