# Android edge prerequisite batch 4 — approval package

> Status: **Project-owner approvals recorded**. Controlled publication remains separate.

## Project-owner selections

| Decision | Project-owner status | Controlled-register status | Implementation impact |
| --- | --- | --- | --- |
| AE-01–AE-07 | APPROVED | Not published | Authorizes only Android Edge Phase 0 skeleton. |
| AE-08 | KEEP OPEN — SECURITY DECISION REQUIRED | Not published | Blocks production local transport and Phase 1 local journey. |
| AE-09–AE-11 | APPROVED as Phase 0/MVP field-validation baselines | Not published | Not production SLAs or commercial commitments. |

The approvals preserve central financial authority and the prohibition on the full
NestJS/PostgreSQL/Redis/BullMQ/worker stack on Android. They do not authorize production
sync, provider credentials, live M-Pesa, offline payment, reconciliation authority,
confirmed-revenue authority or production rollout.

## Consolidated decision register

| ID | Topic | Recommended value | Owner | Blocks implementation |
| --- | --- | --- | --- | --- |
| AE-01 | Architecture | Hybrid edge/cloud, lightweight Android companion, central financial authority | Project owner | Yes |
| AE-02 | Runtime/device | API 29 minimum; API 31+ preferred generation; capability qualification | Project owner + Operations | Yes |
| AE-03 | Persistence | Room over SQLite; encrypted DB; Keystore-wrapped key | Project owner + Security | Yes |
| AE-04 | Device identity | App-issued opaque ID bound to Keystore keypair | Project owner + Security | Yes |
| AE-05 | Enrollment/revocation | Operator sign-in → tenant binding → SACCO admin approval → activation; central revocation | Product/Operations/Security | Yes |
| AE-06 | Local API/sync | `/edge/v1`; server-issued versions; idempotent non-financial inbox/outbox | Project owner + Architecture | Yes |
| AE-07 | Financial boundary | Central fare verification/payment handoff; no offline confirmation or provider secrets | Project owner | Yes |
| AE-08 | Local transport | Development HTTP only; production model requires security prototype/approval | Security | Yes |
| AE-09 | Update/telemetry | Managed/private updates; minimum version; minimized operational telemetry | Operations + Security | Yes |
| AE-10 | Retention/compromise | Bounded local data, central revocation, restricted integrity failures, no credential backup | Security | Yes |
| AE-11 | Field targets | Proposed bands below | Product/Operations | Yes |

## Proposed MVP defaults for approval

- **Enrollment:** SACCO administrator approves a device after authenticated conductor/operator requests tenant binding. HotPesa platform support handles exceptional recovery, not routine approvals.
- **Credential lifecycle:** short-lived user access token; longer-lived revocable device credential; rotatable Keystore signing keys. Exact durations, clock skew and renewal policy require Security approval.
- **Retention/wipe:** destination selection is session-only; fare quote cache until trip close; route/fare/config cache until superseded/invalidated; non-financial outbox until acknowledged; diagnostics/crash logs bounded short retention; passenger PII/provider credentials never stored. Wipe on logout, revocation, reassignment, compromise or explicit admin action.
- **Integrity:** development builds may warn; production integrity failure restricts privileged sync/payment handoff pending review. Do not depend on one vendor integrity service as the sole control.
- **Backup:** no automatic backup/restore of device keys, encryption keys, encrypted DB, identity or outbox. Re-synchronize route/fare cache only after authenticated enrollment.
- **Offline validity:** shortest of active-trip binding, fare/config effective validity and central invalidation state; if it cannot be proven, fail unavailable.

## Production local transport

**Security decision required.** Development HTTP remains permitted only for explicit field proof. Production must not rely on hotspot secrecy. Before approval, prototype and measure Passenger-PWA usability, certificate/bootstrap trust, hostname/address discovery, rotation, eavesdropping/MITM resistance and cross-client isolation for either a usable local HTTPS model or another approved secure transport design.

## Proposed operations acceptance band

These are **proposed for approval**, not current requirements: 10 concurrent passengers minimum, 20 recommended, 30+ controlled stress; local journey/destination/fare interactions under 500 ms at the accepted band; four-hour continuous field runtime minimum and eight-hour soak recommended; continuous charging operation, a documented unplugged fallback, no uncontrolled thermal shutdown, explicit low-storage warning and non-silent outbox preservation. Exact free-storage/cache/outbox and offline-duration limits require Product/Operations and Security approval.

## First permitted implementation increment after approvals

**Android Edge Phase 0 — skeleton only:** Android project scaffold, API-level configuration, Room boundary, Keystore identity abstraction, `/edge/v1/health`, encrypted-storage boundary and test harness. No production sync, payment handoff, provider credentials, provider integration or offline financial behavior.

| Phase | Gate |
| --- | --- |
| Phase 0 skeleton | AE-01–AE-07 approved; controlled publication tracked; no transport decision needed beyond development proof |
| Phase 1 local journey | device qualification, local transport/security and field target approvals |
| Phase 2 sync | DMAC schema/security approval and replay/conflict tests |
| Phase 3 payment handoff | central contract, identity/revocation and provider-boundary validation |
| Phase 4 field validation | target-device concurrency/endurance/security evidence |

## Explicit approval block

| Decision | Approve? |
| --- | --- |
| AE-01 through AE-07 proposed architecture/security/contract defaults | APPROVED |
| AE-09 managed update and minimal telemetry model | APPROVED |
| AE-10 retention, wipe, integrity and backup model | APPROVED |
| AE-11 proposed operations acceptance band | APPROVED as Phase 0/MVP field-validation baselines |
| AE-08 production local transport | KEEP OPEN — SECURITY DECISION REQUIRED |

## Status boundary

Project-owner approval authorizes only the stated bounded increment. Controlled ADR/DMAC publication, security approval and field evidence are not implied. No production Android edge implementation is authorized by this package.
