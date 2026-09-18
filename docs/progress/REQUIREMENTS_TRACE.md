# Phase 0 vertical-slice requirements trace

This trace supplements the master baseline. It does not create fare, settlement,
privacy, security, or commercial policy. The identifiers below are local delivery
identifiers for the Phase 0 browser-testable slice.

| ID | Requirement and protected outcome | Affected contract | Planned evidence | State |
| --- | --- | --- | --- | --- |
| PH0-VS-001 | Seed a synthetic, effective-dated journey and SACCO-approved fare version for development. No dynamic pricing. | Journey session, fare quote | Contract and HTTP integration verify synthetic KES 80.00 `fare-demo-v1` effective 2026-09-19 | Implemented |
| PH0-VS-002 | An accountless passenger can enter by journey-session URL and see route, vehicle context, fare amount, currency, and fare version. | Journey session read | Playwright opens the journey URL and verifies route and fare presentation without an account | Implemented |
| PH0-VS-003 | Accept a sandbox phone number and initiate Mock M-Pesa idempotently without retaining or logging the full number. | Payment initiation command/result | Service tests cover replay, collision, masking, and full-number absence; HTTP redaction test passes | Implemented |
| PH0-VS-004 | Model `created`, `initiating`, `pending`, `confirmed`, `failed`, `expired`, and `review-required`; only trusted server-side provider evidence may confirm. | Payment attempt and state transition | State-machine unit tests cover every state boundary and trusted evidence path | Implemented |
| PH0-VS-005 | Provide deterministic confirmed, failed, delayed, duplicate-callback, and missing-callback mock scenarios. | Mock provider scenario | Provider/service tests cover all five; Playwright passes confirmed, failed and duplicate-callback journeys | Implemented |
| PH0-VS-006 | Handle provider callbacks idempotently, tolerate duplicates and ordering issues, and route conflicting evidence to review. | Provider event/callback receipt | Unit and HTTP integration cover duplicate stability, conflicts, and late evidence; PostgreSQL path implemented | Implemented |
| PH0-VS-007 | Reconcile missing callbacks from trusted provider status evidence without treating timeout or connectivity as success. | Reconciliation result | Service test repairs missing callback; expiry plus late confirmation becomes review-required | Implemented |
| PH0-VS-008 | Emit structured, redacted audit events and expose payment/event visibility to administration users. | Audit event and admin read model | Audit redaction/API tests pass and admin renders structured event/payment views | Implemented |
| PH0-VS-009 | Passenger and admin interfaces are responsive, keyboard accessible, status-text explicit, and reduced-motion aware. | UI view models | State-label tests pass; Playwright verifies reduced-motion mode, 390px no-overflow in both apps, and a 44px payment control | Implemented |
| PH0-VS-010 | Automate happy, failure, and duplicate-callback journeys and document a reproducible local demonstration. | Browser-test fixture and runbook | Playwright 3/3 passed against live local servers; `LOCAL_DEMO_RUNBOOK.md` documents repeatable operation | Implemented |

## Baseline sources

- `docs/requirements/MASTER_BASELINE.md`
- `docs/architecture/SYSTEM_CONTEXT.md`
- `docs/phase-0/PHASE_0_CHECKLIST.md`
- `docs/phase-0/REPOSITORY_FOUNDATION_TRACEABILITY.md`

## Threat and failure cases carried into implementation

- Idempotency-key reuse with a different request body.
- Duplicate, delayed, missing, conflicting, or out-of-order provider evidence.
- Client attempts to select a result or self-assert confirmation.
- Disclosure of a full MSISDN, credential, secret, token, or raw provider payload.
- False success presentation before durable trusted evidence.
- Unusable focus order, status feedback, touch targets, or reduced-motion behavior.
