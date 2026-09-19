# Master Phase 0 traceability matrix

This evidence matrix maps the implemented local Mock M-Pesa vertical slice to controlled
requirement and ADR identifiers. It does not approve the draft specifications, expand MVP
scope, or represent production readiness. **Accepted** means formally approved by the
responsible authority; no row is marked accepted because that evidence is absent.

| Outcome | BR / PR | FR | US / UC | SEC / PRIV / NFR | ADR register | Implementation evidence | Test evidence | State |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Synthetic journey and versioned fixed fare | BR-PAX-003–004; BR-FAR-002–004; PR-PAX-002–004; PR-FAR-004–005 | FR-PAX-003–006; FR-FAR-006–009 | US-PAX-002–004; UC-PAX-001 | PRIV-PRN-001; NFR-TST-001 | ADR-009 (Recommended for approval); ADR-012 (Recommended for approval) | `services/api/src/modules/journeys/journeys.controller.ts`; `packages/contracts/src/index.ts` | `packages/contracts/tests/contracts.test.ts`; `services/api/test/http.integration.test.ts` | Implemented and tested locally; not accepted |
| Idempotent payment-attempt creation | BR-PAY-003–004; PR-PAY-001–002 | FR-PAY-001–004 | US-PAY-001; US-PAX-006; UC-PAY-001 | SEC-API-001; NFR-REL-001 | ADR-015 (Accepted implementation baseline); ADR-016 (Accepted with strict scope) | `payments.service.ts`; `payment.store.ts`; versioned contracts | `payments.service.test.ts`; `postgres.durability.test.ts` replay and collision tests | Implemented and tested in memory and live PostgreSQL; production validation not started |
| Trusted evidence is the sole confirmation authority | BR-PAY-005–006, BR-PAY-010; PR-PAY-004–006 | FR-PAY-007–010, FR-PAY-013 | US-PAX-007–009; US-PAY-002–004; UC-PAY-001 | SEC-PAY-001–009; NFR-REL-001 | ADR-004 (Accepted architecture baseline); ADR-005 (Accepted and implemented in Phase 0); ADR-016 (Accepted with strict scope) | `payment-state.ts`; `mock-mpesa.provider.ts` | `payment-state.test.ts`; `http.integration.test.ts`; `e2e/payment-flow.spec.ts` | Implemented and tested locally; not production validated |
| Duplicate, late and conflicting evidence | BR-PAY-007, BR-PAY-009; PR-PAY-005–006 | FR-PAY-012–014; FR-REC-003–006, FR-REC-011 | US-PRV-001–002; UC-PRV-001; UC-REC-002 | SEC-PAY-004–009; NFR-REL-001 | ADR-005; ADR-015; ADR-016 | `payments.service.ts`; `payment.store.ts` | Unit/HTTP/E2E duplicate and conflict cases; live PostgreSQL duplicate/restart test | Implemented and tested locally; production restore validation not started |
| Missing-callback reconciliation and expiry | BR-PAY-008–010; PR-PAY-007–008 | FR-PAY-011–013; FR-REC-007–009 | US-REC-001–003; UC-REC-001 | SEC-PAY-006–009; NFR-AVAIL-001 | ADR-005; ADR-011 (Recommended for approval); ADR-016 | Manual development reconciliation/expiry endpoints | `payments.service.test.ts` missing callback, expiry and late evidence | Manual reconciliation tested; scheduled retries not started |
| Redacted audit and administrative visibility | BR-GOV-002–004; BR-ADM-003–005; PR-SEC-003–004 | FR-RPT-001–008; FR-REC-002, FR-REC-012 | US-SEC-001–004; US-RPT-001–003; UC-RPT-001 | SEC-DATA-001–006; SEC-LOG-001–006; PRIV-MIN-001–004 | ADR-005; ADR-012 (Recommended for approval) | `audit.service.ts`; admin controllers/views | Service and HTTP redaction checks; Playwright full-phone absence | Implemented and tested with synthetic data; privacy approval pending |
| Accountless responsive passenger flow | BR-PAX-001–006; PR-PAX-001–010 | FR-PAX-001–016 | US-PAX-001–010; UC-PAX-001; UC-PAY-001 | NFR-ACC-001–008; PRIV-MIN-001–004 | ADR-003 (Recommended for approval); ADR-014 (Accepted implementation baseline) | `apps/passenger-pwa`; shared design tokens | Passenger unit tests and Playwright viewport, focus-target and reduced-motion checks | Implemented and tested locally; device matrix deferred |
| Admin Phase 0 view | BR-OPS-001; BR-ADM-003; PR-PAY-009; PR-SEC-003–004 | FR-FIN-001–004; FR-RPT-001–008 | US-FIN-001–004; US-RPT-001–003 | SEC-AUTHZ-001–008; SEC-LOG-001–006 | ADR-006 (Accepted implementation baseline); ADR-014 | `apps/admin-web`; development-only API routes | Admin unit test and Playwright audit/payment view | Implemented for local demo; authentication/authorization not started |
| PostgreSQL authoritative persistence | BR-PAY-003–009; PR-PAY-001–008 | FR-PAY-001–016; FR-REC-001–012 | UC-PAY-001; UC-PRV-001; UC-REC-001–002 | NFR-REL-001–008; NFR-BCK-001–003; NFR-DR-001–003 | ADR-007 (Accepted implementation baseline) | PostgreSQL store path and development Compose definition | `services/api/test/postgres.durability.test.ts`: live application-store restart, persistence, idempotency, duplicate-event stability and redaction | Implemented and tested locally; backup/restore and production validation not started |
| Redis-backed asynchronous work | BR-PAY-008; PR-OPS-001 | FR-REC-007–009 | US-REC-001–003 | NFR-AVAIL-001–006; NFR-OPS-001–008 | ADR-011 (Recommended for approval) | Redis development service definition only | Development Redis reached healthy state and returned `PONG`; no job behavior test exists | Runtime service health tested; asynchronous work not started; ADR approval pending |
| Android host/hotspot/session | BR-JRN-001–002; BR-OPS-001–005; PR-JRN-001–008 | FR-JRN-001–012 | US-JRN-001–010; UC-JRN-001–002; UC-OFF-001 | SEC-DEV-001–008; NFR-MOB-001–008 | ADR-001 (Recommended); ADR-002 (Decision required); ADR-008 (Recommended) | Placeholder README only | No target-device or hotspot tests | Not started; decision and physical-device evidence required |
| Workforce identity and tenant authorization | BR-GOV-003; PR-SEC-001–002 | FR-AUTH-001–012; FR-ADM-001–009 | US-ADM-001–006; UC-ADM-001 | SEC-IAM-001–012; PRIV-MIN-001–004 | ADR-010 (Recommended); ADR-017 (Decision required) | No production-like identity integration | No identity/tenant-isolation acceptance evidence | Not started; decision required |
| Production provider and hosting | BR-PIL-001–006; PR-OPS-003 | Provider-specific details remain gated | Applicable production use cases deferred | SEC-PAY-001–009; NFR-DR-001–003; PRIV-XFER-001–004 | ADR-017 and ADR-018 (Decision required) | None; Mock adapter only | No Daraja/live/provider/region evidence | Deferred and blocked by external decisions |

## Controlled conflict

Document 05 TRD section 26 assigns ADR-001 through ADR-012 to a different set of
decisions than Document 11. ADR references in this matrix use Document 11 and retain its
statuses. The Architecture Review Board must resolve the numbering conflict before the
controlled drafts can be approved.

## Phase 1 decision synchronization

The project owner approved the nine Phase 1 implementation decisions recorded in
`docs/phase-1/PHASE_1_APPROVED_DECISIONS.md`. These are implementation authority for the
bounded Phase 1 slice, but the checksum-bound controlled Markdown copies remain unchanged
until the formal DOCX publication process runs.

| Decision scope | Requirements | Governing ADRs | Decision evidence | State |
| --- | --- | --- | --- | --- |
| Workforce identity and tenant authorization | FR-JRN-001; FR-ADM-003; SEC-AUTHZ-001; SEC-IAM-*; SEC-DEV-001 | ADR-017; TRD AP-006 | `PHASE_1_APPROVED_DECISIONS.md` P1-DEC-001/002 | Approved for bounded implementation; controlled sync pending; named provider not selected |
| Assignment and trip start | FR-JRN-001/003; FR-ADM-003; US-CON-001; US-OPS-002 | ADR-001; ADR-002; ADR-006 | `PHASE_1_APPROVED_DECISIONS.md` P1-DEC-003 | Approved for bounded implementation; controlled sync pending |
| Fare creation, approval and effective versions | FR-FAR-001/002/004/005/006–008; US-FAR-001–004; PR-FAR-003 | ADR-009 | `PHASE_1_APPROVED_DECISIONS.md` P1-DEC-004/005/006 | Approved for bounded implementation; controlled sync pending |
| Trip closure and summary | FR-JRN-009/010; FR-RPT-001/002; US-CON-008/009; US-FIN-005; US-RPT-001 | ADR-005; ADR-009 | `PHASE_1_APPROVED_DECISIONS.md` P1-DEC-007/008/009 | Approved for bounded implementation; controlled sync pending |

## State vocabulary

- **Implemented:** code or configuration exists.
- **Tested:** current automated or runtime evidence exists in the stated environment.
- **Accepted:** responsible authority has formally approved the item; none claimed here.
- **Deferred:** intentionally outside the current Phase 0 proof or awaiting its approved gate.
- **Blocked:** evidence cannot be produced until a named runtime or external decision is available.
- **Not started:** no conforming implementation evidence exists.
