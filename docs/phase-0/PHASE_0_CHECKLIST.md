# Phase 0 checklist

Checked items have repository or current local evidence. Unchecked items remain pending;
historical or design-only claims are not treated as current runtime proof.

## Repository and controls

- [ ] Branch protection and required reviews configured. **Pending:** GitHub reports that
  `main` is not protected (repository owner).
- [ ] CODEOWNERS replaced with real identities/teams. **Pending:** current entries are
  placeholder team handles with no verified repository-team evidence (repository owner).
- [ ] Hosted CI for this correction passes. **Pending:** historical CI passed for
  `cf3d53dd2e48490f8a25de727b70696d29271a3e`; this correction is not yet pushed.
- [x] Current local documentation, discovery, lint, typecheck, unit/integration, build and
  Playwright gates pass. Evidence: `docs/progress/BUILD_STATE.md` correction results;
  31/31 tests, 6/6 builds and 3/3 browser journeys passed.
- [ ] Hosted dependency, SAST, container and IaC security gates pass. **Configured:** pnpm
  audit, repository secret scan, CodeQL SAST and Trivy vulnerability/misconfiguration
  scanning in `.github/workflows/ci.yml`. **Pending:** hosted execution for this correction;
  no project Dockerfile exists for an image scan in this baseline.
- [x] Development Compose configuration is localhost-bound and uses development-only
  values. Evidence: `infra/docker/compose.yml`, `.env.example`, and current
  `docker compose ... config --quiet` exit 0.
- [x] No production credentials or real passenger data are used in the Phase 0 fixtures.
  Evidence: `.env.example`, synthetic test data, and current repository secret scan.

## Android hotspot proof

- [ ] Supported Android/API/device matrix recorded. **Pending:** Android host contains only
  a placeholder README (Mobile/Operations).
- [ ] Hotspot/local-only behavior tested on two representative devices. **Pending:** no
  device evidence (Mobile/QA).
- [ ] QR and short URL lead to the same scoped journey session. **Pending:** no Android/QR
  runtime evidence (Mobile/QA).
- [ ] Session tokens are short-lived, unguessable, scoped and replay-resistant. **Pending:**
  Phase 0 uses a fixed synthetic public code (Security/Backend).
- [ ] Reconnect, host restart, journey close and stale-session behavior tested. **Pending:**
  no Android-host evidence (Mobile/QA).
- [x] Local browser behavior never asserts financial settlement. Evidence:
  `e2e/payment-flow.spec.ts` and `services/api/test/payment-state.test.ts`.

## Mock M-Pesa vertical slice

- [x] Secrets remain outside source control. Evidence: `.env.example` contains replacement
  values and the current secret scan found no committed private key or populated M-Pesa
  secret assignment.
- [x] Initiation uses a client idempotency key and server-side payment attempt ID. Evidence:
  `services/api/test/payments.service.test.ts`.
- [x] Duplicate and conflicting/late evidence is handled safely in the in-memory test mode.
  Evidence: `payment-state.test.ts`, `payments.service.test.ts`, and
  `http.integration.test.ts`.
- [x] Stored views and audit events redact full phone numbers in the in-memory test mode.
  Evidence: `payments.service.test.ts` and `http.integration.test.ts`.
- [x] Created, initiating, pending, confirmed, failed, expired and review-required states
  are explicit. Evidence: `packages/contracts/tests/contracts.test.ts`.
- [x] Manual reconciliation repairs a missing Mock callback using trusted status evidence.
  Evidence: `payments.service.test.ts`.
- [ ] Scheduled status-query retries are tested. **Pending:** no scheduler exists in the
  Phase 0 slice (Backend/QA).
- [x] Provider-unavailable initiation does not report a confirmed payment. Evidence:
  `services/api/test/payments.service.test.ts`; this is a local failure-path assertion,
  not provider integration evidence.
- [x] PostgreSQL application-store restart, persistence, idempotency, duplicate-event and
  redaction behavior pass against the live development database. Evidence:
  `services/api/test/postgres.durability.test.ts` passed against PostgreSQL 16 on
  2026-09-19. The container was stopped without deleting its persistent volume.
- [x] Redis health is demonstrated at runtime. Evidence: development Redis reached healthy
  state and `redis-cli ping` returned `PONG` on 2026-09-19. This does not claim that
  Redis-backed asynchronous work is implemented.

## Exit evidence

- [ ] Threat model and data-flow review approved. **Pending:** specifications remain drafts
  for review and approval (Security/Privacy).
- [x] Local demonstration runbook exists. Evidence:
  `docs/operations/LOCAL_DEMO_RUNBOOK.md`.
- [x] Phase 0 code/test coverage is traced to controlled identifiers. Evidence:
  `docs/requirements/MASTER_TRACEABILITY_MATRIX.md`.
- [x] External blockers are recorded and no sandbox result is described as production
  approval. Evidence: `MASTER_BASELINE.md`, this checklist and `BUILD_STATE.md`.
- [ ] Phase 0 formally accepted. **Pending:** local Mock M-Pesa vertical-slice evidence does
  not constitute sponsor, Architecture Review Board, Security/Privacy, provider or pilot
  acceptance.
