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
