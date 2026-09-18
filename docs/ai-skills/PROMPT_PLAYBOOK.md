# Codex task prompt playbook

## Feature implementation

```text
Use $hotpesa-requirements-guardian and the relevant domain skill.
Requirement/ADR: <IDs>
Outcome: <observable behavior>
Constraints: <platform, security, privacy, performance>
Acceptance: <tests and evidence>
Do not: expand MVP scope, use real data, or enable live M-Pesa.
```

## UI review

```text
Use $hotpesa-motion-design to review this screen against payment-state truth,
outdoor/one-handed use, low-end device performance, reduced motion, and consistent
Corporate motion tokens. Return findings by severity and then make approved changes.
```

## Payment proof

```text
Use $hotpesa-kenya-payments. Implement only the sandbox adapter and tests. Model pending,
confirmed, failed, expired and review-required states. Demonstrate idempotency for repeat
requests/callbacks and reconciliation for a missing callback. Redact sensitive logs.
```

## Pull-request review

```text
Use $hotpesa-quality-gates. Review changed files, requirement and ADR references, tests,
secret/privacy exposure, contract compatibility, failure behavior and rollback. Report
blocking findings first; do not modify code unless explicitly requested.
```
