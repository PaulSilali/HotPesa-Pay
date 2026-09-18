# HotPesa Pay engineering instructions

## Authority and source order

Use this order when requirements conflict:

1. `docs/requirements/MASTER_BASELINE.md`
2. accepted ADRs under `docs/adr/`
3. API and data contracts under `packages/contracts/`
4. application-local documentation

Do not silently invent business, fare, settlement, privacy, or security rules. Record a
decision proposal in `docs/adr/` when a material decision is missing.

## Non-negotiable product invariants

- HotPesa orchestrates and verifies fares; it is not a wallet or custodian.
- M-Pesa funds settle directly to the PSV/SACCO merchant account.
- Never label a payment successful until trusted server-side confirmation exists.
- Offline capability may cache non-financial data and queue non-financial work only.
- Passenger registration, names, photos, biometrics, dynamic pricing, cash handling,
  stored value, and cross-SACCO clearing are outside the MVP.
- Minimize personal data. Use opaque identifiers and synthetic data in development.
- Fare rules are versioned, SACCO-approved, auditable, and effective-dated.

## Architecture boundaries

- Android host: Kotlin and Jetpack Compose.
- Passenger PWA and admin web: TypeScript; React for admin.
- API: NestJS modular monolith with bounded modules.
- Persistence: PostgreSQL; Redis/BullMQ for ephemeral state and jobs.
- Contracts are versioned and live in `packages/contracts`.
- Workforce authentication uses managed OIDC; authorization remains in HotPesa.
- Baseline deployment region is AWS Africa (Cape Town), subject to verification.

## Required working method

Before changing behavior, identify the requirement ID and affected contract. Keep each
change small, add tests, run the relevant quality gates, and update traceability. For
payment code, cover duplicates, out-of-order callbacks, retries, timeouts, and audit
events. Never print credentials, full phone numbers, access tokens, callback secrets, or
raw production payloads.

For UI motion work, use `$hotpesa-motion-design`. For payment integration work, use
`$hotpesa-kenya-payments`. For requirement-impact review, use
`$hotpesa-requirements-guardian`. For release readiness, use `$hotpesa-quality-gates`.

## Definition of done

- Acceptance criteria and threat cases are addressed.
- Unit/contract/integration tests appropriate to the change pass.
- Lint, type checking, secret scanning, dependency checks, and build pass.
- Logs are structured and redact sensitive data.
- Accessibility includes keyboard/focus, readable status text, and reduced motion.
- Requirement and ADR references are updated when behavior changes.
