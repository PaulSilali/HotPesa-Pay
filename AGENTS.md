# HotPesa Pay engineering instructions

## Authority and source order

`docs/requirements/MASTER_BASELINE.md` identifies the approved release baseline and
scope. Within that baseline, use the following authority order when requirements or
implementation guidance conflict:

1. Approved BRD and PRD under `docs/specifications/`
2. FRS and USUC under `docs/specifications/`
3. Accepted ADRs under `docs/adr/` and the approved TRD
4. DMAC and the versioned contracts under `packages/contracts/`
5. SPNFR
6. AFIA and UIUX
7. IPBS
8. Application-local documentation

If two sources at the same authority level conflict, do not choose silently. Stop the
affected work, record the conflict, and request or create the appropriate controlled
decision. A proposed ADR does not override an approved requirement, and an
application-local README does not override a controlled specification.

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
- AWS Africa (Cape Town) is a proposed hosting option, not an approved baseline.
- Production payment-provider selection and production hosting/region selection remain
  controlled decision gates until the responsible authorities accept the relevant ADRs.

## Required working method

Before implementing or changing behavior:

1. Read `docs/requirements/MASTER_BASELINE.md`.
2. Locate the applicable requirement IDs in `docs/specifications/`.
3. Read all accepted ADRs affecting the component.
4. Check `packages/contracts/` for the current data and API contract.
5. Read `docs/requirements/MASTER_TRACEABILITY_MATRIX.md`.
6. Implement only approved scope.
7. Add or update tests and traceability before marking work complete.

Identify the requirement ID and affected contract before changing behavior. Keep each
change small, add tests, run the relevant quality gates, and update traceability. If an
expected specification, requirement ID, accepted ADR, contract, or traceability entry is
missing, stop and record the gap instead of inventing behavior.

For payment code, cover duplicates, out-of-order callbacks, retries, timeouts, and audit
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
