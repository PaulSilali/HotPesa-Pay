# HotPesa Pay build state

## Baseline

- Recorded: 2026-09-19 (Africa/Nairobi)
- Git commit: `2b4e2cc256486ee2903299fd0860feb7b26b692c`
- Branch: `main`
- Remote: `origin/main`
- Scope: Phase 0 browser-testable vertical slice using Mock M-Pesa only

## Pre-feature foundation gate

| Check | Exact result |
| --- | --- |
| Generated artifacts | Removed the approved `node_modules`, `dist`, `build`, and `__pycache__` directories; all targets were absent after cleanup. |
| Python ignores | `.gitignore` contains `__pycache__/` and `*.py[cod]`. |
| Frozen install | `npx --yes pnpm@9.15.0 install --frozen-lockfile` exited 0; lockfile was current and all 7 workspace projects were in scope. |
| Existing verification | `npx --yes pnpm@9.15.0 verify` exited 0: lint, typecheck, 6 discovered project tests, and build passed. |
| Project skills | Exactly 7 direct `.agents/skills/*/SKILL.md` files were discovered. |

## Milestones

| Milestone | State | Evidence |
| --- | --- | --- |
| 0. Foundation and scope guard | Complete | Controlled documents and all seven project skills read; no unresolved requirement or scope blocker. |
| 1. Contracts, payment model, and Mock M-Pesa | Complete | Clean-output `pnpm verify` exited 0: lint and typecheck passed; discovery found 8 test files; contract tests 3/3 and API tests 11/11 passed; all 6 workspace builds passed. |
| 2. API orchestration, callbacks, reconciliation, and audit | Complete | API lint, typecheck, 21/21 unit/integration tests, and build exited 0. HTTP integration covers journey lookup, pending initiation, trusted confirmation/failure, duplicate callback, redaction, and admin audit reads. |
| 3. Passenger and administration interfaces | Complete | Full `pnpm verify` exited 0: lint/typecheck passed, discovery found 12 test files, all tests passed (including 4 passenger and 2 admin), and all 6 builds passed. |
| 4. Browser demonstration and operations runbook | Complete | `pnpm verify` exited 0 with 6 projects, 10 test files and all tests/builds passing; Playwright discovered 1 file and happy, failure and duplicate-callback journeys passed 3/3 against live local servers. |
| 5. Final audit and quality gates | Complete | PASS for the local Mock M-Pesa vertical slice; not a production/release approval. Frozen install, dependency audit, diff/secret checks, 30 unit/integration/package tests, 6 builds, and 3 browser journeys passed. |

## Guardrails

- The mock provider is the only payment provider enabled in this phase.
- A local request or initiated STK Push never establishes payment confirmation.
- Only trusted server-side Mock M-Pesa evidence may transition an attempt to `confirmed`.
- Development data must be synthetic and logs must not contain a full phone number, credentials, access tokens, callback secrets, or raw provider payloads.
- No live credentials, real-money access, infrastructure deployment, or MVP expansion is authorized.

## Milestone 1 review

- Added the `1.0.0-phase.0` journey, fare, payment, provider-evidence, and audit contracts.
- Added all seven required payment states and all five deterministic Mock M-Pesa scenarios.
- Confirmed state is reachable only through the provider-evidence transition signal.
- Duplicate terminal evidence is stable; conflicting or late terminal evidence becomes `review-required`.
- Ponytail review: no removable speculative abstraction found. The single provider interface is an explicit requirement for a later Daraja sandbox adapter.

## Milestone 2 review

- Added versioned journey, payment, mock-operation, reconciliation, administration, and audit HTTP routes.
- Initiation uses a client idempotency key and a server-generated attempt ID; reuse with a changed request is rejected.
- Callback evidence IDs are deduplicated before state changes, and the duplicate is itself audited.
- Missing callbacks are repaired only by trusted provider status evidence. Expiry cannot overwrite a terminal success.
- PostgreSQL mode creates and reloads payment attempts, provider event receipts, and audit events; writes are flushed before mutating operations return. In-memory mode remains available for isolated automated tests.
- Local PostgreSQL execution was not available at this milestone because this workstation has neither Docker nor `psql`; the HTTP integration suite used isolated in-memory mode.
- Ponytail review removed hidden adapter state and reused the central transition function for expiry. No further removable abstraction was found.

## Milestone 3 review

- Passenger URL entry loads the synthetic journey, fixed fare, operator and vehicle context before accepting a sandbox phone number.
- Passenger feedback includes readable text for all seven states; initiating and pending remain neutral, and only `confirmed` uses success color/check language.
- Missing-callback attempts expose an explicit trusted-provider status check; the client cannot submit confirmation evidence.
- Administration shows payment attempts, all state labels, summary counts, redacted structured audit events, and development-only reconciliation/expiry/conflict controls.
- Shared CSS tokens provide visible focus, high contrast, 44px controls, responsive layouts, and a `prefers-reduced-motion` override.
- UI/UX skill guidance shaped the minimal high-contrast system and responsive table-to-card behavior. Motion guidance shaped status timing and semantics.
- Ponytail review: no removable UI library, animation dependency, or speculative component layer was introduced.

## Milestone 4 review

- Added a Playwright gate that fails when no browser suite is discovered.
- CI installs Chromium and runs the happy, failure, and duplicate-callback browser journeys after the unit/build gate.
- The happy path opens both passenger and admin applications, verifies full-phone redaction, reduced-motion rendering, 390px no-overflow behavior, and a 44px payment control.
- Added `docs/operations/LOCAL_DEMO_RUNBOOK.md` with automated, in-memory manual, and durable PostgreSQL modes plus explicit safety boundaries.
- Ponytail review removed obsolete foundation constants/tests and redundant `.gitkeep` files after real application code replaced them.

## Final Phase 0 review

### Ponytail audit

- No unnecessary runtime dependency, provider abstraction, state layer, or UI framework was found.
- Low-priority cleanup only: zero-byte `.gitkeep` files remain in five directories that now contain real files (`scripts`, `docs/operations`, `infra/docker`, `packages/config`, and `packages/design-tokens/src`). The report-only audit made no changes.

### HotPesa quality-gate decision

**PASS for the local browser-testable Mock M-Pesa vertical slice. This is not a
production or release approval.**

| Gate | Exact result |
| --- | --- |
| Frozen dependency graph | `pnpm install --frozen-lockfile` exited 0; lockfile current. |
| Lint and typecheck | `pnpm verify` exited 0; all 6 projects passed. |
| Test discovery | 6 projects and 10 unit/integration test files discovered; empty discovery fails. |
| Unit/integration/package tests | 30 tests passed: 3 contracts, 21 API, 3 passenger, 1 admin, 1 design-token, and 1 config test. |
| Build | All 6 workspace builds passed. |
| Browser discovery and demonstration | 1 Playwright file discovered; confirmed, failed, and duplicate-callback journeys passed 3/3 against live local servers. |
| Dependency audit | `pnpm audit --prod --audit-level=high` exited 0: no known vulnerabilities. |
| Secret scan | No obvious committed private-key or M-Pesa secret match. |
| Diff hygiene | `git diff --check` exited 0. Line-ending conversion warnings were informational. |
| Skill allowlist | Exactly 7 direct project skills discovered. |
| PostgreSQL/Compose runtime | Not executed locally: neither Docker nor `psql` is installed on this workstation. The persistence path is implemented and Compose syntax remains a CI gate. |

Live M-Pesa, workforce OIDC, production infrastructure, external regulatory/commercial
decisions, and release approval remain intentionally outside this implementation.
