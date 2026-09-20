# HotPesa Pay build state

## Repository baseline inspected for this correction

- Recorded: 2026-09-19 (Africa/Nairobi)
- Baseline HEAD inspected before this correction: `c5e8a0ce791057691a0f48c2159e9021da061b20`
- Branch: `main`, tracking `origin/main`
- Remote: `https://github.com/PaulSilali/HotPesa-Pay.git`
- Recent history: `cf3d53d feat: complete Phase 0 Mock M-Pesa vertical slice`;
  `2b4e2cc first commit`
- Scope: local Phase 0 browser-testable vertical slice using Mock M-Pesa only

The correction commit is the repository HEAD containing this file. The parent hash above
is deliberately labelled historical so it does not become a stale claim after commit.

## Phase 1 Sprint 1 checkpoint

- Current branch: `feature/phase-1-payment-vertical-slice`
- Current implementation checkpoint: `81f7c3c3d9ac850da7d5bd190b3e97f044873b67`
- Scope: bounded synthetic trip/route/stage/fare/payment/closure vertical slice using
  provider-neutral development identity context and Mock M-Pesa only.
- Implemented evidence: assignment-validated trip start, ordered route stages, server-side
  destination fare quote, trip-linked payment attempts, trusted callback visibility and
  confirmed-only trip summary.
- Current tests: 29 API tests pass locally (PostgreSQL durability test passes separately
  with live PostgreSQL); 3 Playwright journeys pass; all builds pass.
- This is implementation evidence only. It is not Phase 1 acceptance, production
  authentication, Android device proof or live M-Pesa evidence.

## Historical evidence inherited from the parent commit

GitHub Actions run `35406346040` passed for parent commit
`cf3d53dd2e48490f8a25de727b70696d29271a3e`. Earlier milestone and test statements in
that commit are historical evidence only; they are not treated as results from this
correction. Hosted CI for the correction remains pending until the commit is pushed and
the workflow completes.

## Verification executed during this correction

| Check | Current result |
| --- | --- |
| Frozen dependency installation | PASS — cached pnpm 9.15.0 ran `install --frozen-lockfile`; lockfile current, all 7 workspace projects in scope. An earlier `npx` bootstrap attempt timed out without output and is not counted as a pass. |
| Controlled documentation | PASS — 11/11 controlled DOCX/Markdown pairs matched their recorded SHA-256 checksums. |
| Test discovery | PASS — 6 runnable workspace projects and 11 unit/integration test files discovered; 1 Playwright file discovered. |
| Lint | PASS — all 6 runnable workspace projects plus root Playwright/E2E files passed. An earlier root invocation lacked pnpm on `PATH`; it is not counted as lint evidence. |
| Type checking | PASS — all 6 runnable workspace projects passed. |
| Unit, package and integration tests | PASS — 31/31 tests passed: 3 contracts, 23 API, 3 passenger, 1 admin, 1 design-token and 1 config test. The API total includes one live PostgreSQL durability test. |
| PostgreSQL durability | PASS — live development PostgreSQL verified application-store restart, persisted payment state, idempotent replay and collision rejection, duplicate-event stability and phone/audit redaction. The first run hit Vitest's 5-second default timeout; the unchanged assertions passed after an explicit 30-second integration timeout. |
| Redis runtime health | PASS — development Redis container reached healthy state and `redis-cli ping` returned `PONG`; no Redis-backed job implementation is claimed. |
| Build | PASS — all 6 runnable workspace builds passed. |
| Browser tests | PASS on rerun — confirmed, failed and duplicate-callback journeys passed 3/3. The first run had two global timeout failures and one pass; after increasing only the Playwright harness timeout to 60 seconds, all assertions passed. |
| Production dependency audit | PASS — `pnpm audit --prod --audit-level=high` reported no known vulnerabilities. |
| Secret scan | PASS — tracked and untracked text scans found no private-key or populated M-Pesa secret pattern. |
| Compose validation | PASS — `docker compose -f infra/docker/compose.yml config --quiet` exited 0. |
| Container shutdown | PASS — development PostgreSQL and Redis containers were stopped without deleting `hotpesa-development_hotpesa_postgres_data`. |
| Diff hygiene | PASS — final pre-commit `git diff --check` exited 0; line-ending conversion notices were informational. |
| Hosted CI for this correction | Pending until push; local results do not establish hosted CI success. |

The workstation already had an unrelated Windows PostgreSQL service bound to port 5432.
The controlled development PostgreSQL Compose service was therefore run on localhost
port 15432 for the durability test. The unrelated service was not accessed or changed.

## Current Phase 0 assessment

**CONDITIONAL PASS for the corrected local Mock M-Pesa vertical slice. This is not formal
Phase 0 acceptance, production readiness, provider approval or release approval.**

Implemented and locally evidenced:

- versioned Phase 0 contracts and seven explicit payment states;
- server-controlled Mock M-Pesa initiation and trusted-evidence transitions;
- idempotency, duplicate evidence, missing-callback reconciliation, expiry and review;
- PostgreSQL persistence/restart behavior and redacted audit evidence;
- passenger/admin browser flows and local accessibility checks;
- controlled-document synchronization, ADR status preservation and traceability.

Still pending or blocked:

- formal approval of the controlled specifications and Phase 0 acceptance;
- resolution of the Document 05 versus Document 11 ADR-number conflict;
- branch protection, verified CODEOWNERS identities and passing hosted CI for this commit;
- hosted execution of the configured CodeQL SAST and Trivy vulnerability/misconfiguration
  gates (the workflow is configured, but this correction has not yet run in hosted CI);
- Android hotspot/device/runtime proof;
- scheduled provider-status retries; provider-unavailable no-confirmation behavior is
  covered by a local unit test, but no external provider integration is claimed;
- workforce OIDC and tenant-authorization acceptance evidence;
- legal, privacy, SACCO, production-provider, merchant-settlement, hosting/region and
  production incident-owner decisions.

## Guardrails

- The internal Mock M-Pesa adapter is the only payment provider enabled in Phase 0.
- A local request or initiated prompt never establishes payment confirmation.
- Only trusted server-side evidence may transition an attempt to `confirmed`.
- Development data is synthetic; logs and evidence must remain redacted.
- No live credentials, real-money access, infrastructure deployment or MVP expansion is
  authorized by this baseline.

## Phase 1 Sprint 2 correction evidence (2026-09-19)

- Current branch: `feature/phase-1-payment-vertical-slice`
- Current HEAD: `796e18a` (`feat(auth): enforce workforce assignment context`)
- Formal PostgreSQL migrations are implemented in `services/api/src/persistence/migrations.ts` with repeat-safe versions `001_payment_store_baseline` and `002_trip_payment_context`.
- Workforce authorization validates active development identity, tenant membership, conductor role, exact vehicle/route/direction assignment and validity window before trip start. This is a local synthetic fixture, not production OIDC acceptance.
- Current API verification: typecheck PASS, lint PASS, 33 tests PASS including live migration repeatability and PostgreSQL restart durability; containers were stopped without removing the persistent volume.

## Phase 1 Sprint 3 local transport evidence (2026-09-19)

- The API and passenger PWA now default to loopback and require explicit `HOST=0.0.0.0` / `VITE_HOST=0.0.0.0` opt-in for trusted-LAN development; no device IP or hotspot gateway is hard-coded.
- Passenger entry remains the approved scoped QR/short-address route. Local access is separate from provider connectivity and never establishes payment confirmation.
- API and PWA typechecks, PWA build and local API regression tests passed. A physical Android two-device hotspot test has not been executed; the evidence procedure is in `docs/phase-1/HOTSPOT_PHYSICAL_TEST_PLAN.md`.

## Phase 1 Sprint 4C local resilience evidence (2026-09-20)

- Scope: local development proof only for the approved OD-FRS-004 bounded reconciliation policy; no live M-Pesa, production credentials or controlled DOCX changes.
- Live Compose evidence: PostgreSQL 16 was healthy on loopback `127.0.0.1:15432`; Redis 7 was healthy on loopback `127.0.0.1:6379` and returned `PONG`.
- `services/api/test/reconciliation.live.integration.test.ts` passed against those live services using isolated short test delays. It proved durable pending payment creation, minimal BullMQ job payload and delay, worker consumption, missing-callback reconciliation, provider-unavailable recovery, retry exhaustion after exactly five attempts, callback/worker race safety, duplicate-job suppression, API-store/worker restart recovery, manual late trusted failure, and Redis-unavailable enqueue handling.
- PostgreSQL remains the durable authority for payments and audit evidence. A Redis enqueue failure leaves the already-persisted payment pending and records `payment.reconciliation-scheduling-failed`; it does not claim scheduled work or falsely confirm the payment.
- The development Redis service is configured with `--save "" --appendonly no`. Worker process restart and API restart were proven while Redis remains running; Redis container recreation or data loss is not a queue-durability guarantee and remains a development-configuration limitation.
- This is engineering evidence, not Phase 1 acceptance or production readiness. External provider, finance, legal/privacy, hosting and formal approval gates remain unchanged.

## Phase 1 Sprint 5 topology preparation (2026-09-20)

- A configuration-driven PC-hosted local journey URL helper and field-test record are available for trusted development networking. The helper uses an observed runtime host address; no workstation or hotspot IP is embedded in source.
- Existing API/PWA bind and CORS controls remain explicit configuration: `HOST`, `VITE_HOST`, `VITE_API_URL` and `CORS_ORIGINS`. PostgreSQL and Redis remain loopback-only Compose services.
- Physical PC-hosted hotspot/local-network proof is recorded in `docs/phase-1/SPRINT_5_FIELD_CONNECTIVITY_RECORD.md`: API and Passenger PWA reachability, active journey resolution, Westlands destination selection and server quote (KES 80.00), payment initiation, trusted Mock M-Pesa confirmation, reconnect, and trip-close invalidation all passed.
- This does not establish Android hosting. Android-hosted services remain unimplemented, and the current NestJS/PostgreSQL/Redis/BullMQ stack is not an Android host implementation; selecting an edge/companion architecture remains a decision gate.
- Multi-passenger behavior and no-internet local journey were not tested. This evidence is not Phase 1 acceptance, production readiness, live M-Pesa proof or implementation authority for ADR-002.
