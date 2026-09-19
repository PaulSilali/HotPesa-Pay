# HotPesa Phase 1 Implementation Decision Register

Status: **Decision package for human approval**  
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
| P1-AUTH-001 | Workforce identity provider | ADR-017; SEC-IAM-*; SEC-DEV-001 | Managed OIDC is the pattern; vendor is not selected. | Select provider compatible with MFA, suspension, audit export and pilot operations. | Managed provider A; managed provider B; another reviewed provider. | Session/token integration, provisioning, cost, privacy review. | Architecture + Security + Product | OPEN — MULTI-DISCIPLINARY |
| P1-AUTH-002 | Conductor login and provisioning | FR-JRN-001; FR-CRW-*; SEC-DEV-001 | Workforce identity is authenticated and device enrollment/revocation is required. | Define invitation/provisioning, login UX, recovery and device binding. | OIDC-hosted login; managed device-assisted login; approved hybrid. | Device safety, account recovery, support and audit. | Operations + Security | OPEN — OPERATIONS |
| P1-AUTH-003 | Workforce claims and tenant mapping | SEC-AUTHZ-001; FR-ADM-003; ADR-017 | Application owns tenant membership, roles, assignments and resource policy. | Define tenant identifier, role claims, membership lifecycle and subject mapping. | Claims-only; application lookup by external subject; hybrid. | Authorization correctness and revocation latency. | Architecture + Security | OPEN — SECURITY |
| P1-ASSIGN-001 | Assignment cardinality and temporal validity | FR-JRN-001/003; FR-ADM-003; US-CON-001; US-DRV-001 | Start validates tenant, vehicle, route, direction, fare and accountable crew context. | Define whether one assignment may cover one or many trips, overlap rules, and shift/session representation. | One active assignment per conductor/vehicle; bounded concurrent assignments; explicit shift entity. | Prevents wrong-vehicle starts and affects history/authorization. | Operations + Product | OPEN — OPERATIONS |
| P1-ASSIGN-002 | Assignment creation and modification authority | FR-ADM-001–003; US-OPS-002 | Operations governs vehicles, routes and workforce configuration under authorization. | Name the role allowed to create, modify, revoke and override assignments. | SACCO operations only; delegated tenant admin; centrally governed workflow. | Separation of duty, audit and field support. | Product + Pilot SACCO | OPEN — MULTI-DISCIPLINARY |
| P1-FARE-001 | Fare creator | FR-FAR-001/002; US-FAR-001 | Authorized role creates route/direction/stage fare definitions. | Identify exact role and tenant scope. | SACCO fare creator; HotPesa operations; delegated tenant role. | Data ownership and least privilege. | Product + Pilot SACCO | OPEN — PRODUCT |
| P1-FARE-002 | Fare approver and publisher | FR-FAR-004/005; US-FAR-002; OD-005 | Approval, decision time, reason and audit are required; active fare must be approved. | Decide approver role, publisher role and whether creator/approver separation is mandatory. | Four-eyes separate roles; one authorized role; threshold-based separation. | Product + Finance + Pilot SACCO | OPEN — FINANCE |
| P1-FARE-003 | Effective dates and overlap policy | FR-FAR-002/004/006; PR-FAR-003 | Effective period and ambiguity prevention are required; overlap prohibition is policy-dependent. | Define timezone, boundary inclusivity, and whether all overlapping active definitions are prohibited. | Strict no-overlap; overlap only across non-overlapping stages/directions; policy-configured. | Product + Finance | OPEN — PRODUCT |
| P1-FARE-004 | Supersession and active-trip fare binding | FR-FAR-006/007/008; ADR-009; US-FAR-003 | Attempts retain their captured quote/version; historical versions remain auditable. | Confirm whether an active trip captures one fare version at start or quotes per valid passenger context. | Trip-start snapshot; per-quote effective fare; explicit trip fare schedule. | Product + Finance | OPEN — FINANCE |
| P1-CLOSE-001 | Trip closure authority and override | FR-JRN-009/010; US-CON-008; US-OPS-* | Closure is authorized, audited and stops new attempts; exact override role is not named. | Identify normal closer, admin/SACCO override and required reason. | Assigned conductor; SACCO operations; conductor with operations override. | Operations + Product | OPEN — OPERATIONS |
| P1-CLOSE-002 | Unresolved payment treatment at close | FR-JRN-009/010; FR-RPT-001/002; US-FIN-005 | Existing evidence remains processable; summary separates states and only confirmed counts as confirmed value. | Define whether close is allowed with pending/review-required attempts and any exception reason. | Allow with explicit unresolved count; block until resolved; authorized override. | Finance + Operations | OPEN — FINANCE |
| P1-CLOSE-003 | Summary scope | FR-RPT-001/002; US-FIN-005; US-RPT-001 | Reports distinguish payment states and confirmed digital fare value. | Confirm exact fields for the Phase 1 summary. | Minimum state counts + confirmed amount; add passenger/payment/exception counts; defer cash/refund fields. | Finance + Product | OPEN — FINANCE |
| P1-CLOSE-004 | Cash, refund and reversal treatment | PRD exclusions; OD-006; FR-RPT-* | Cash custody and production refund/reversal are not MVP-approved. | Confirm these remain excluded from this slice and how any external/non-M-Pesa facts are represented. | Exclude and report none; read-only external adjustment record; defer entirely. | Product + Finance + Legal | OPEN — MULTI-DISCIPLINARY |

## Proposed synchronization after approval

Human-approved answers should be reflected in the relevant controlled decision/specification process before implementation. Candidate synchronization targets are ADR-017, the TRD open-decision register, `MASTER_TRACEABILITY_MATRIX.md`, and the versioned contracts. No controlled DOCX is changed by this package.
