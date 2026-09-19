# HotPesa Phase 1 Implementation Decision Register

Status: **Approved by project owner for Phase 1 implementation; controlled synchronization pending**
Scope: Trip, route/stage, fare, workforce authorization and closure gates.  
Controlled DOCX sources are unchanged. Open items below are not implementation authority.

## Decisions already closed by existing requirements

| Topic | Existing position | Sources |
| --- | --- | --- |
| Workforce authentication pattern | Managed OIDC is the recommended workforce credential/session pattern; HotPesa owns tenant membership, roles, assignments and permissions. | ADR-017; TRD identity section |
| Authorization boundary | Protected APIs enforce server-side identity, tenant, role, resource, assignment, state and action policy; default deny. | SEC-AUTHZ-001; TRD AP-006; TRD security architecture |
| Passenger identity | Passenger fare flow remains account-light and journey-scoped. | BRD/PRD; ADR-003; ADR-012 |
| Route/stage model | Routes have direction and ordered supported stages; passenger destination must be valid for the active route direction and boarding context. | FR-PAX-005; FR-ADM-002; US-OPS-001 |
| Fare history | Fare versions are attributable, effective-dated and retained; attempts retain the original amount, currency and fare version. | ADR-009; FR-FAR-006–008; US-FAR-003 |
| Payment truth | Only trusted server-side provider evidence confirms payment; duplicate evidence has one effect. | ADR-005; FR-PAY-009–014 |
| Cash custody | HotPesa does not hold or settle cash. | PRD exclusions; BRD/PRD cash boundary |

## Decision items

| ID | Title | Source requirements | Existing approved position | Remaining decision | Options | Impact | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1-AUTH-001 | Workforce identity provider | ADR-017; SEC-IAM-*; SEC-DEV-001 | Managed OIDC pattern; vendor remains external gate. | Provider-agnostic boundary, MFA, suspension, audit export and device enrollment. | Provider-neutral adapter until vendor approval. | Session/token integration and later vendor review. | Architecture + Security + Product | APPROVED — CONTROLLED SYNC PENDING |
| P1-AUTH-002 | Conductor login and provisioning | FR-JRN-001; FR-CRW-*; SEC-DEV-001 | Authenticated workforce and device enrollment/revocation. | OIDC-hosted login with managed provisioning and device enrollment. | Provider-neutral implementation boundary. | Device safety, recovery and audit. | Operations + Security | APPROVED — CONTROLLED SYNC PENDING |
| P1-AUTH-003 | Workforce claims and tenant mapping | SEC-AUTHZ-001; FR-ADM-003; ADR-017 | Application owns authorization. | Opaque tenant ID and application lookup from external subject. | Claims may carry identity; API resolves resource policy. | Authorization correctness and revocation. | Architecture + Security | APPROVED — CONTROLLED SYNC PENDING |
| P1-ASSIGN-001 | Assignment cardinality and temporal validity | FR-JRN-001/003; FR-ADM-003; US-CON-001; US-DRV-001 | Start validates same-tenant context. | At most one active assignment per conductor and vehicle; reject overlaps; no separate shift entity yet. | Bounded assignment period. | Prevents wrong-vehicle starts. | Operations + Product | APPROVED — CONTROLLED SYNC PENDING |
| P1-ASSIGN-002 | Assignment creation and modification authority | FR-ADM-001–003; US-OPS-002 | Operations governs configuration. | SACCO Operations creates, modifies and revokes assignments. | Tenant operations authority. | Separation of duty and audit. | Product + Pilot SACCO | APPROVED — CONTROLLED SYNC PENDING |
| P1-FARE-001 | Fare creator | FR-FAR-001/002; US-FAR-001 | Authorized fare creation. | SACCO Operations creates fare definitions. | Tenant-owned fare data. | Least privilege and ownership. | Product + Pilot SACCO | APPROVED — CONTROLLED SYNC PENDING |
| P1-FARE-002 | Fare approver and publisher | FR-FAR-004/005; US-FAR-002; OD-005 | Approval, reason and audit required. | Separate authorized approver activates; creator and approver differ. | Four-eyes workflow. | Financial control. | Product + Finance + Pilot SACCO | APPROVED — CONTROLLED SYNC PENDING |
| P1-FARE-003 | Effective dates and overlap policy | FR-FAR-002/004/006; PR-FAR-003 | Effective period and ambiguity prevention. | Africa/Nairobi half-open intervals; no overlap in same context. | Strict no-overlap. | Deterministic quotes. | Product + Finance | APPROVED — CONTROLLED SYNC PENDING |
| P1-FARE-004 | Supersession and active-trip fare binding | FR-FAR-006/007/008; ADR-009; US-FAR-003 | Attempts retain quote/version. | Active trip captures fare context at start; later versions do not rewrite it. | Trip-start snapshot. | Historical integrity. | Product + Finance | APPROVED — CONTROLLED SYNC PENDING |
| P1-CLOSE-001 | Trip closure authority and override | FR-JRN-009/010; US-CON-008; US-OPS-* | Authorized closure and audit. | Conductor closes; SACCO Operations may override; reason required. | Conductor plus operations override. | Closure accountability. | Operations + Product | APPROVED — CONTROLLED SYNC PENDING |
| P1-CLOSE-002 | Unresolved payment treatment at close | FR-JRN-009/010; FR-RPT-001/002; US-FIN-005 | States remain separated. | Close allowed with pending/review-required only with exception reason; late evidence remains processable. | Explicit unresolved close. | No discarded evidence. | Finance + Operations | APPROVED — CONTROLLED SYNC PENDING |
| P1-CLOSE-003 | Summary scope | FR-RPT-001/002; US-FIN-005; US-RPT-001 | Confirmed-only revenue. | State counts, confirmed amount, payment-attempt count and exception count. | No authoritative passenger count. | Reconciliation clarity. | Finance + Product | APPROVED — CONTROLLED SYNC PENDING |
| P1-CLOSE-004 | Cash, refund and reversal treatment | PRD exclusions; OD-006; FR-RPT-* | Cash custody/refund-reversal outside MVP. | Exclude from this slice. | No cash/refund/reversal fields. | Avoids unsupported financial behavior. | Product + Finance + Legal | APPROVED — CONTROLLED SYNC PENDING |

## Proposed synchronization after approval

Human-approved answers should be reflected in the relevant controlled decision/specification process before implementation. Candidate synchronization targets are ADR-017, the TRD open-decision register, `MASTER_TRACEABILITY_MATRIX.md`, and the versioned contracts. No controlled DOCX is changed by this package.
