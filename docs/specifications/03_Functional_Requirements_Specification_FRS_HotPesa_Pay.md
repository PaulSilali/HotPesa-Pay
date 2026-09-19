---
document_id: "03"
title: "Functional Requirements Specification"
project: "HotPesa Pay"
source_docx: "docs/controlled-documents/03_Functional Requirements Specification (FRS)_HotPesa Pay.docx"
source_version: "1.0"
source_status: "Draft for stakeholder review and approval"
synchronization_date: "2026-09-19"
source_sha256: "a0a1b01b921867ef243028bef9872b46cbae6470741b869fa4207de5e058e56b"
---

> Controlled source: [03_Functional Requirements Specification (FRS)_HotPesa Pay.docx](../controlled-documents/03_Functional%20Requirements%20Specification%20(FRS)_HotPesa%20Pay.docx)

> The DOCX source is authoritative. This Markdown copy preserves its controlled status and does not confer approval.

DOCUMENT 03

Functional Requirements Specification

HotPesa Pay

<br>

Atomic system behavior, business rules, permissions, exceptions and acceptance evidence

<br><br>

| Control | Value |
| --- | --- |
| Project | HotPesa Pay |
| Document | Functional Requirements Specification |
| Version | 1.0 |
| Status | Draft for stakeholder review and approval |
| Lifecycle stage | Functional baseline following BRD and PRD |
| Primary market | Kenya |
| Classification | Confidential - project planning |

<br>

### Governing question

Exactly how shall HotPesa behave in normal, alternate, failure and permission paths, and what evidence will prove that behavior?

<br>

# Document Control

| Field | Controlled value |
| --- | --- |
| Document owner | Product Owner, supported by Business Analysis, Engineering and Quality Assurance. |
| Business authority | HotPesa Business Requirements Document Version 1.0, subject to its approval conditions. |
| Product authority | HotPesa Product Requirements Document Version 1.0, subject to its approval conditions. |
| Reviewers | Founder; pilot operator/SACCO; product; engineering; UX; quality assurance; security; finance; operations; legal/compliance. |
| Approval authority | Project Steering Committee or designated sponsor - decision required. |
| Reference use | Mpanga FRS informed structural completeness only; its product requirements do not apply to HotPesa. |
| Downstream authority | The approved FRS governs user stories, architecture, data/API contracts, flows, UI/UX, security/NFRs, implementation and acceptance tests. |
| Change control | A changed requirement must retain history, update upstream/downstream links, assess security and test impact, and obtain the required approval. |
| Next review | Before MVP implementation authorization and after pilot, live-provider and commercial decisions are resolved. |

## Document Status and Interpretation

This specification defines mandatory functional behavior using “shall”. Approved Baseline identifies behavior already established by the controlled HotPesa requirements and Phase 0 proof. Proposed, Assumption, Validation Required and Decision Required items remain non-binding until the responsible authority records a decision. Phase 0 mock behavior is evidence of implementation feasibility, not authority to process live funds or release a production service.

## Version History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 0.1 | 18 September 2026 | Initial draft | Concise register of core authentication, journey, portal, fare, payment, reporting and audit behavior. |
| 1.0 | 19 September 2026 | Draft for approval | Expanded functional baseline aligned to the regenerated BRD, PRD and implemented Phase 0 payment-state semantics. |

## Table of Contents

| Section | Purpose |
| --- | --- |
| 1 Purpose Scope and Requirement Method | Document authority and testability rules |
| 2 System Context and Functional Boundaries | System components and excluded behavior |
| 3 Actors Roles and Channels | Who performs each function and where |
| 4 Cross Cutting Functional Requirements | Session, identity, authorization and common behavior |
| 5 Passenger Journey Requirements | Accountless passenger experience |
| 6 Journey and Conductor Host Requirements | Active journey and field operations |
| 7 Fare Management Requirements | Versioned fare governance |
| 8 Payment Lifecycle Requirements | Attempt creation and trusted state transition |
| 9 Provider Evidence and Reconciliation Requirements | Callback, status query and exception handling |
| 10 Driver and Crew Requirements | Safe driver and workforce interactions |
| 11 Owner SACCO and Tenant Administration Requirements | Operator configuration and tenant control |
| 12 Finance Support and Platform Administration Requirements | Financial, support and platform controls |
| 13 Reporting Notification and Audit Requirements | Evidence, export and communication behavior |
| 14 Offline Synchronization and Recovery Requirements | Weak-network and restart behavior |
| 15 Validation Rules and Data Handling | Authoritative field and data rules |
| 16 Functional State Models | Permitted lifecycle transitions |
| 17 Error Exception and Alternate Flow Handling | Expected behavior when normal flow fails |
| 18 Business Rules and Permission Matrix | Policy and role enforcement |
| 19 External Interface Behavior | Provider, browser and operational interfaces |
| 20 Acceptance Scenarios | End-to-end acceptance examples |
| 21 Requirement Traceability Matrix | BRD and PRD coverage |
| 22 Open Decisions Assumptions and Dependencies | Items requiring validation or authority |
| 23 Approval and Sign Off | Approval conditions and signatures |
| 24 Final FRS Readiness Checklist | Completion gate before downstream baseline |

<br>

# 1 Purpose Scope and Requirement Method

## 1.1 Purpose

The FRS converts the approved product intent into atomic, testable behavior for the passenger PWA, conductor host, backend services, administration interfaces, payment-provider adapter, reporting, audit and operational controls. It states what the system must do without prescribing implementation details that belong in the Technical Requirements and System Architecture document.

## 1.2 Functional Scope

Accountless passenger access to a valid active journey.

Journey, route, direction, stage and fare context.

Server-controlled M-Pesa payment initiation and evidence processing.

Seven-state payment lifecycle with idempotency, reconciliation and exception review.

Conductor, owner/SACCO, finance, support, tenant and platform administration functions.

Tenant isolation, role/context authorization, redaction and audit.

Weak-network presentation, restart recovery and controlled synchronization.

Reports and exports that keep confirmed, pending and exception values distinct.

## 1.3 Requirement Convention

| Element | Rule |
| --- | --- |
| Identifier | Stable prefix and sequence; an identifier is never reassigned to a different obligation. |
| Mandatory wording | “Shall” states one binding behavior. “Should” and “may” are avoided in mandatory requirements. |
| Priority | Must for MVP; Should for an approved follow-on release; Could for roadmap; Won’t for an explicit exclusion. |
| Status | Approved Baseline, Proposed, Assumption, Validation Required or Decision Required. |
| Source | Each requirement links to one or more PRD requirements and, through them, to the BRD. |
| Verification | Test, inspection, analysis or demonstration; production readiness may require more than one. |
| Change | Changes require versioning, impact analysis and traceability maintenance. |

## 1.4 Requirement Quality Rules

One principal obligation per requirement.

Observable outcome and deterministic pass/fail evidence.

Normal, alternate, exception and unauthorized paths are covered.

Financial success is never inferred from UI state, local connectivity, SMS or client assertions.

Quantitative service targets remain in the Security Privacy and NFR Specification unless needed to make a function unambiguous.

# 2 System Context and Functional Boundaries

## 2.1 Logical Components

| Component | Functional responsibility | Authority boundary |
| --- | --- | --- |
| Passenger PWA | Discover journey, show fare, collect approved input, initiate and display status/reference. | Cannot set price, submit provider evidence or confirm payment. |
| Android conductor host | Select assigned context, expose local discovery, monitor safe status and close journey. | Cannot create trusted payment success or alter provider evidence. |
| HotPesa API | Authorize requests, create journeys/quotes/attempts, apply state rules and expose controlled reads. | System authority for application state, subject to accepted provider evidence. |
| Payment adapter | Translate HotPesa requests and provider callbacks/status responses. | Provider-specific boundary; no client-held credentials. |
| Administration web | Configure tenant operations, fares, users, reconciliation, reports and audit. | Role, tenant, purpose and separation-of-duty controls. |
| PostgreSQL store | Persist controlled business, event and audit records. | Durable application record; not a provider settlement ledger. |
| Redis/worker services | Support bounded jobs, retries, cache and asynchronous processing. | Cannot override durable financial state or bypass transition rules. |
| M-Pesa/provider | Accept initiation and provide authoritative transaction evidence. | External financial authority under the approved integration agreement. |

## 2.2 Explicit Functional Exclusions

HotPesa shall not act as a wallet, deposit taker, custodian or settlement intermediary.

The MVP shall not provide seat reservations, loyalty, credit, insurance, advertising or passenger-data monetization.

Cash collection, if operationally recorded later, shall not be represented as M-Pesa confirmation.

The passenger shall not be required to create an account for the core MVP fare flow.

Local Wi-Fi or hotspot access shall not be interpreted as internet access or payment completion.

The system shall not collect an M-Pesa PIN or expose production credentials to browsers or mobile clients.

# 3 Actors Roles and Channels

| ID | Actor | Access basis | Channel | Permitted objective |
| --- | --- | --- | --- | --- |
| ACT-PAX | Passenger | Anonymous/scoped journey session | Passenger PWA | Discover, quote, initiate, view status/reference. |
| ACT-CON | Conductor | Authenticated assigned workforce | Android host | Start/operate/close journey; monitor safe status. |
| ACT-DRV | Driver | Authenticated assigned workforce | Android host | Acknowledge assignment and safety/incident tasks; no payment interaction while driving. |
| ACT-OPS | SACCO operations | Authenticated tenant role | Admin web | Manage fleet, routes, assignments and journey oversight. |
| ACT-OWN | Owner/manager | Authenticated tenant role | Admin web | Review authorized fleet and business reports. |
| ACT-FIN | Finance officer | Authenticated privileged tenant role | Admin web | Reconcile, investigate and export financial evidence. |
| ACT-SUP | Support agent | Authenticated purpose-limited role | Admin web | Search redacted case context and record resolution. |
| ACT-TAD | Tenant administrator | Authenticated privileged tenant role | Admin web | Manage tenant users, roles and configuration. |
| ACT-PAD | Platform administrator | Authenticated high-privilege role | Platform admin | Operate tenants/integrations under dual control. |
| ACT-AUD | Auditor | Read-only scoped role | Reports/audit | Inspect approved evidence without mutation. |
| ACT-PRV | Payment provider | Mutually authenticated external system | Server interface | Receive requests and provide evidence. |

## 3.1 Access Principles

Every workforce action shall be evaluated server-side against tenant, role, resource, assignment and relevant transaction context.

A passenger session shall grant only journey-scoped functions and shall expire according to controlled policy.

Privileged roles shall use stronger authentication and audited elevation appropriate to the approved security design.

Read access to personal and payment-linked data shall be purpose-limited, masked by default and logged where required.

# 4 Cross Cutting Functional Requirements

These requirements apply across passenger, workforce and administrative channels unless a narrower requirement states otherwise.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-COM-001 | The system shall assign a globally unique identifier to each tenant, journey, fare version, payment attempt, provider event and audit event. | Uniqueness and immutability tests. | PR-SEC-005 |
| FR-COM-002 | The system shall use server time as the authoritative timestamp for material state changes and shall retain the original provider timestamp separately. | Clock-source inspection and event test. | PR-PAY-008 |
| FR-COM-003 | The system shall return a correlation reference for every accepted mutating request and include it in the audit timeline. | API and audit integration test. | PR-OPS-003 |
| FR-COM-004 | The system shall reject a request that lacks required tenant, journey or actor context without revealing whether an unauthorized resource exists. | Negative authorization test. | PR-SEC-002 |
| FR-COM-005 | The system shall apply idempotency to every operation that could create or repeat a financial or journey effect. | Replay tests with same and changed payloads. | PR-PAY-002 |
| FR-COM-006 | The system shall present dates, times, currency and phone references using the approved Kenyan locale while retaining canonical server values. | Locale and storage inspection. | PR-PAX-004 |
| FR-COM-007 | The system shall provide text labels and programmatic status announcements for every material state; color or motion shall not be the sole signal. | Accessibility inspection and automated test. | PR-PAX-007 |
| FR-COM-008 | The system shall mask personal identifiers by default and shall never display an M-Pesa PIN, access token, callback secret or raw credential. | UI, log and export scans. | PR-SEC-004 |
| FR-COM-009 | The system shall record actor, action, resource, outcome, timestamp and correlation reference for material changes. | Audit schema and action tests. | PR-SEC-005 |
| FR-COM-010 | The system shall preserve the last durable state when a retry, timeout or downstream failure leaves the outcome unknown. | Failure injection test. | PR-PAY-008 |

# 5 Passenger Journey Requirements

The passenger flow is accountless, journey-scoped and controlled by server-issued context. Passenger input may request an action but cannot assert fare, provider evidence or settlement.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-PAX-001 | The passenger shall open a journey using an approved QR code or short address that resolves to one active scoped journey. | Valid, unknown, expired and closed-link tests. | PR-PAX-001 |
| FR-PAX-002 | The system shall reject a malformed, unknown, expired, suspended or closed journey token and provide a safe recovery message. | Negative route tests. | PR-PAX-001 |
| FR-PAX-003 | The passenger view shall display operator, route/direction and sufficient vehicle or journey identity before destination or payment action. | Content inspection against API data. | PR-PAX-002 |
| FR-PAX-004 | The system shall obtain journey and fare context from the server and shall not trust price, operator or vehicle values supplied by the browser. | Tampered-client request test. | PR-PAX-004 |
| FR-PAX-005 | The passenger shall select only a destination or stage valid for the active route direction and boarding context. | Allowed-list and tamper tests. | PR-PAX-003 |
| FR-PAX-006 | The passenger view shall display the quoted amount, currency and journey context before enabling payment initiation. | UI and API contract test. | PR-PAX-004 |
| FR-PAX-007 | The system shall accept only an approved Kenyan MSISDN format, normalize it server-side and avoid displaying the full value after submission. | Boundary, normalization and masking tests. | PR-PAX-005 |
| FR-PAX-008 | The passenger interface shall never request, capture, store or transmit an M-Pesa PIN. | UI inspection and traffic scan. | PR-SEC-004 |
| FR-PAX-009 | The passenger shall be able to initiate one attempt after reviewing the amount and shall receive immediate created or initiating feedback. | End-to-end initiation test. | PR-PAX-006 |
| FR-PAX-010 | The interface shall disable accidental repeat submission while an attempt is active and shall provide a separate safe status refresh. | Double-click and replay tests. | PR-PAX-006 |
| FR-PAX-011 | The passenger shall be able to recover current attempt status using the scoped journey session and safe attempt reference after reconnecting. | Disconnect and reconnect test. | PR-PAX-010 |
| FR-PAX-012 | The passenger view shall present created, initiating, pending, confirmed, failed, expired and review-required using distinct text and next actions. | Seven-state UI test. | PR-PAX-007 |
| FR-PAX-013 | Only confirmed shall use success wording, check iconography or completed-payment language. | Visual and semantic inspection. | PR-PAX-008 |
| FR-PAX-014 | Pending shall state that payment is not yet confirmed and shall not instruct the passenger to pay again until an approved retry condition is met. | Timeout and delayed callback test. | PR-PAX-009 |
| FR-PAX-015 | Confirmed shall display a minimal receipt/reference containing amount, currency, journey reference, confirmation time and safe transaction reference. | Receipt content and redaction test. | PR-PAX-010 |
| FR-PAX-016 | Failed, expired and review-required shall show reason categories and approved next steps without exposing internal/provider-sensitive details. | Error-message inspection. | PR-PAX-009 |

# 6 Journey and Conductor Host Requirements

The conductor host establishes the active operational context but has no authority to create financial confirmation.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-JRN-001 | An authenticated conductor shall select only a vehicle, route, direction and assignment available to that actor and tenant. | Assignment authorization tests. | PR-JRN-001 |
| FR-JRN-002 | The system shall prevent the same vehicle from having conflicting active journeys unless an authorized exception workflow resolves the conflict. | Concurrent start test. | PR-JRN-001 |
| FR-JRN-003 | Starting a journey shall create one tenant-scoped identifier, start time, crew/vehicle assignment and selected fare context. | Journey creation inspection. | PR-JRN-002 |
| FR-JRN-004 | The host shall generate a QR code and short address tied to the active journey and shall replace or invalidate them when policy requires. | Token lifecycle test. | PR-JRN-003 |
| FR-JRN-005 | The host shall display the active operator, vehicle, route, direction, journey reference, fare source and connectivity status. | Host UI inspection. | PR-JRN-004 |
| FR-JRN-006 | The status board shall group attempts by state and display only masked payer and safe transaction references. | Board and redaction tests. | PR-JRN-005 |
| FR-JRN-007 | The status board shall update from server state and shall not accept manual conductor confirmation of payment. | Client-tamper and update test. | PR-JRN-005 |
| FR-JRN-008 | After a host restart or reconnect, the application shall restore the active journey and obtain current attempt states from durable server records. | Restart recovery test. | PR-JRN-006 |
| FR-JRN-009 | Journey closure shall stop new payment attempts, retain status access for existing attempts and produce a state-separated summary. | Closure integration test. | PR-JRN-007 |
| FR-JRN-010 | The system shall require an exception reason when authorized operations close a journey with unresolved attempts. | Validation and audit test. | PR-JRN-007 |
| FR-JRN-011 | Operational notes shall be recorded separately from provider evidence and shall never alter confirmed, failed or review-required state directly. | Mutation and audit test. | PR-JRN-008 |
| FR-JRN-012 | The host shall provide an approved safety-first degraded mode when internet access is unavailable and shall not show offline settlement. | Network-loss demonstration. | PR-JRN-006 |

# 7 Fare Management Requirements

Fare behavior is versioned and attributable. A quote used by an attempt remains immutable even when a later fare is published.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-FAR-001 | An authorized role shall create a fare definition for one tenant, route, direction and supported stage/destination combination. | Role and field validation test. | PR-FAR-001 |
| FR-FAR-002 | A fare definition shall include currency, amount, effective start, optional end, status, creator and reason. | Required-field test. | PR-FAR-002 |
| FR-FAR-003 | The system shall reject a zero, negative, unsupported-currency or improperly scaled fare amount. | Boundary-value test. | PR-FAR-001 |
| FR-FAR-004 | The system shall detect overlapping active fare rules for the same context and require the approved conflict resolution. | Overlap test. | PR-FAR-003 |
| FR-FAR-005 | Fare publication shall require the configured approval role and shall record approver, decision time and reason. | Approval workflow test. | PR-FAR-002 |
| FR-FAR-006 | The system shall select the fare version effective at quote creation using server time and the active journey context. | Effective-date test. | PR-FAR-004 |
| FR-FAR-007 | The payment attempt shall retain fare version, amount and currency and shall not change when a later fare becomes active. | Mid-attempt fare-change test. | PR-FAR-004 |
| FR-FAR-008 | A withdrawn or superseded fare shall remain available to authorized audit and historical report functions. | Historical retrieval test. | PR-FAR-002 |
| FR-FAR-009 | The passenger and conductor channels shall receive the same authoritative quote for the same journey/stage context. | Cross-channel contract test. | PR-FAR-006 |
| FR-FAR-010 | Every fare create, approve, activate, supersede or withdraw action shall produce an audit event. | Audit completeness test. | PR-FAR-005 |

# 8 Payment Lifecycle Requirements

A payment attempt is an immutable, idempotent request linked to one journey and quote. Only accepted server-side provider evidence can establish confirmed.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-PAY-001 | The server shall create an attempt with a unique identifier linked to tenant, journey, fare version, amount, currency and normalized payer reference. | Persistence and linkage test. | PR-PAY-001 |
| FR-PAY-002 | The initiation endpoint shall require an idempotency key scoped to the actor/session and operation. | Missing-key and replay test. | PR-PAY-002 |
| FR-PAY-003 | Reuse of an idempotency key with the same canonical request shall return the original outcome without creating another attempt. | Identical replay test. | PR-PAY-002 |
| FR-PAY-004 | Reuse of an idempotency key with a materially different request shall be rejected and audited. | Changed-payload replay test. | PR-PAY-002 |
| FR-PAY-005 | Provider initiation shall occur only from a server-side adapter using protected credentials and controlled merchant configuration. | Architecture inspection and traffic test. | PR-PAY-003 |
| FR-PAY-006 | The system shall persist the attempt before or atomically with dispatch so that a provider response can always be correlated. | Failure injection and persistence test. | PR-PAY-003 |
| FR-PAY-007 | A newly persisted attempt shall enter created and may move to initiating only when provider dispatch begins. | Transition unit test. | PR-PAY-004 |
| FR-PAY-008 | An accepted asynchronous initiation shall move to pending and shall not be represented as paid or confirmed. | Provider-acceptance test. | PR-PAY-004 |
| FR-PAY-009 | The system shall move to confirmed only when trusted evidence matches attempt, merchant context, amount, currency and approved success result. | Positive and mismatch tests. | PR-PAY-005 |
| FR-PAY-010 | Trusted provider-declared failure shall move an eligible attempt to failed and retain safe reason classification. | Failure callback test. | PR-PAY-005 |
| FR-PAY-011 | A nonterminal attempt that exceeds the approved evidence window may move to expired without erasing later trusted evidence. | Expiry and late-evidence test. | PR-PAY-006 |
| FR-PAY-012 | Late or conflicting trusted terminal evidence shall move the attempt to review-required when deterministic safe resolution is not allowed. | Conflict transition test. | PR-PAY-007 |
| FR-PAY-013 | A terminal confirmed attempt shall not be overwritten by a later failure, expiry or client request. | Terminal stability test. | PR-PAY-005 |
| FR-PAY-014 | The system shall not create a second financial effect from duplicate initiation response, callback, status result or worker retry. | Duplicate-event integration test. | PR-PAY-002 |
| FR-PAY-015 | Cancellation or reversal, if later approved, shall use a separate auditable operation and shall not rewrite original provider evidence. | Design inspection; future test. | PR-PAY-010 |
| FR-PAY-016 | The system shall retain a chronological payment timeline comprising request, dispatch, provider evidence, transition, reconciliation and review events. | Timeline inspection. | PR-PAY-008 |

# 9 Provider Evidence and Reconciliation Requirements

Provider evidence is processed independently from browser or conductor claims, deduplicated before business effects, and retained in a redacted evidence record.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-REC-001 | The callback endpoint shall validate the approved provider-authenticity control before accepting evidence. | Invalid and valid authenticity tests. | PR-PAY-006 |
| FR-REC-002 | The system shall store a provider-event receipt with event identifier, received time, correlation fields, validation outcome and redacted payload reference. | Persistence inspection. | PR-PAY-006 |
| FR-REC-003 | The system shall deduplicate provider events using a stable provider identifier and canonical fallback rule approved for the adapter. | Duplicate callback test. | PR-PAY-002 |
| FR-REC-004 | A duplicate event shall return a safe acknowledgement, produce a duplicate audit event and create no additional state or receipt effect. | Duplicate callback end-to-end test. | PR-PAY-002 |
| FR-REC-005 | Evidence that cannot be matched to a known attempt shall be quarantined for controlled investigation and shall not create a payment attempt. | Unmatched callback test. | PR-PAY-007 |
| FR-REC-006 | An amount, currency, merchant or transaction correlation mismatch shall result in review-required or rejected evidence according to the approved rule. | Mismatch matrix tests. | PR-PAY-007 |
| FR-REC-007 | An authorized reconciliation action shall request provider status server-side and record the request and response evidence. | Status-query integration test. | PR-PAY-008 |
| FR-REC-008 | A status query may transition an attempt only through the same central transition rules used for callbacks. | Unit and integration test. | PR-PAY-008 |
| FR-REC-009 | Automatic reconciliation retries shall be bounded, observable and moved to a review queue after the approved limit. | Retry exhaustion test. | PR-PAY-008 |
| FR-REC-010 | A reviewer shall record disposition, rationale and supporting reference without modifying raw provider evidence. | Review workflow test. | PR-PAY-009 |
| FR-REC-011 | The system shall maintain one effective state change for duplicate equivalent evidence and a complete record of every received event. | Ledger consistency test. | PR-PAY-006 |
| FR-REC-012 | The system shall expose safe provider/evidence health to operations without exposing credentials or unrestricted raw payloads. | Operations-view inspection. | PR-OPS-001 |

# 10 Driver and Crew Requirements

Driver functions remain safety-limited. Driver interaction shall not be required for routine passenger payment while the vehicle is moving.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-CRW-001 | The driver shall view and acknowledge only assigned vehicle and journey duties. | Assignment authorization test. | PR-JRN-001 |
| FR-CRW-002 | The system shall not require the driver to confirm passenger payment, inspect passenger phones or operate payment controls while driving. | Workflow inspection and acceptance demonstration. | PR-JRN-008 |
| FR-CRW-003 | An authorized crew member shall record a safety or operational incident linked to journey, vehicle, time and category. | Incident creation test. | PR-JRN-008 |
| FR-CRW-004 | Incident notes shall not change provider evidence or payment state. | Tamper and audit test. | PR-JRN-008 |
| FR-CRW-005 | Crew reassignment during an active journey shall require authorized operations action and retain before/after assignment history. | Reassignment test. | PR-ADM-002 |
| FR-CRW-006 | The system shall end or revoke crew access promptly when the assignment or workforce account is disabled. | Revocation test. | PR-SEC-002 |

# 11 Owner SACCO and Tenant Administration Requirements

Tenant administration controls the operational catalogue and workforce within a single operator/SACCO boundary.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-ADM-001 | An authorized tenant administrator shall create, update, suspend and view vehicles within that tenant. | Tenant-scoped CRUD tests. | PR-ADM-001 |
| FR-ADM-002 | An authorized operations role shall maintain routes, directions and ordered supported stages without changing historical journey facts. | Version/history test. | PR-ADM-001 |
| FR-ADM-003 | The system shall validate that every journey vehicle, route, fare and crew assignment belongs to the same tenant. | Cross-tenant negative test. | PR-ADM-002 |
| FR-ADM-004 | A tenant administrator shall invite or provision workforce users through the approved identity workflow and assign only permitted tenant roles. | Provisioning and escalation tests. | PR-ADM-002 |
| FR-ADM-005 | High-impact role changes shall require reason, audit and any configured second approval. | Privileged-change test. | PR-SEC-003 |
| FR-ADM-006 | Suspending a user shall prevent new sessions and revoke active access according to the approved security policy. | Suspension/revocation test. | PR-SEC-002 |
| FR-ADM-007 | Owners and managers shall view only vehicles, journeys and reports within their granted ownership or tenant scope. | Resource-scope tests. | PR-ADM-003 |
| FR-ADM-008 | Tenant configuration changes shall be versioned where they affect journey, fare, payment or reporting interpretation. | Configuration history inspection. | PR-ADM-004 |
| FR-ADM-009 | The system shall prohibit a tenant user from discovering or exporting another tenant’s records through UI, API, search or identifier guessing. | Isolation penetration tests. | PR-SEC-001 |
| FR-ADM-010 | Tenant deactivation shall stop new journeys and payment initiations while preserving authorized historical and regulatory access. | Deactivation scenario test. | PR-ADM-004 |

# 12 Finance Support and Platform Administration Requirements

Privileged operational functions use least privilege, purpose limitation and separation of duties.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-FIN-001 | Finance shall filter attempts by date, tenant, route, vehicle, journey, state and safe transaction reference. | Search/filter tests. | PR-RPT-001 |
| FR-FIN-002 | Finance views shall show confirmed, pending, failed, expired and review-required values separately and shall not combine them as collected revenue. | Aggregation test. | PR-RPT-001 |
| FR-FIN-003 | An authorized finance user shall open a reconciliation case with owner, status, reason, actions and evidence references. | Case workflow test. | PR-PAY-009 |
| FR-FIN-004 | A reconciliation disposition shall require a reason and shall produce an immutable audit event. | Required-field and audit test. | PR-PAY-009 |
| FR-SUP-001 | Support shall search by approved safe references and shall receive masked passenger/payment data by default. | Search and masking test. | PR-SEC-004 |
| FR-SUP-002 | Support shall view the user-facing state, system timeline and approved troubleshooting guidance without access to secrets or unrestricted raw provider payloads. | Role-view inspection. | PR-OPS-002 |
| FR-SUP-003 | Support shall record case notes, disposition and escalation linked to the immutable payment timeline. | Case-note test. | PR-OPS-002 |
| FR-PAD-001 | Platform administrators shall manage tenant and integration configuration only through authenticated, authorized and audited operations. | Privileged-operation test. | PR-SEC-003 |
| FR-PAD-002 | Secret values shall be write-only or vault-referenced in administrative interfaces and shall not be retrievable in clear text. | Secret-management inspection. | PR-SEC-004 |
| FR-PAD-003 | A platform administrator shall not impersonate a passenger or tenant user without an explicit approved support mechanism and complete audit. | Impersonation negative test. | PR-SEC-003 |
| FR-PAD-004 | Production-impacting provider or merchant changes shall require dual control and effective-time management. | Approval and activation test. | PR-SEC-003 |
| FR-PAD-005 | Emergency access, if enabled, shall be time-bound, reasoned, strongly authenticated and independently reviewed. | Break-glass demonstration. | PR-SEC-003 |

# 13 Reporting Notification and Audit Requirements

Reports and messages communicate operational truth without collapsing unlike states or exposing unnecessary personal information.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-RPT-001 | The system shall provide journey summaries by tenant, route, vehicle, crew, date and payment state. | Report reconciliation test. | PR-RPT-001 |
| FR-RPT-002 | Revenue reports shall count only confirmed attempts as confirmed digital fare value. | Known-dataset aggregation test. | PR-RPT-001 |
| FR-RPT-003 | Reports shall present pending, failed, expired and review-required counts and values separately. | Known-dataset aggregation test. | PR-RPT-001 |
| FR-RPT-004 | Authorized users shall export approved report columns with tenant scope, filter context, generation time and export audit. | Export content and audit test. | PR-RPT-002 |
| FR-RPT-005 | Exports shall mask or omit passenger identifiers unless an approved role and purpose requires the field. | Role-based export test. | PR-SEC-004 |
| FR-NTF-001 | User-facing notifications shall describe the current state and next action without claiming success before confirmed. | Message catalogue inspection. | PR-PAX-007 |
| FR-NTF-002 | Operational alerts shall distinguish service health, pending backlog, provider failure and review-required exceptions. | Alert routing demonstration. | PR-OPS-001 |
| FR-AUD-001 | Audit events shall be append-only to ordinary application roles and shall record actor/service, action, resource, outcome, timestamp and correlation. | Mutation denial and schema test. | PR-SEC-005 |
| FR-AUD-002 | The audit view shall support controlled search by time, action, actor, resource and correlation reference. | Audit search test. | PR-SEC-005 |
| FR-AUD-003 | Audit presentation shall redact secrets, full phone numbers and prohibited raw provider data. | Content scan. | PR-SEC-004 |
| FR-AUD-004 | Authorized auditors shall have read-only access scoped by tenant, purpose and approved period. | Read-only and expiry test. | PR-SEC-002 |

# 14 Offline Synchronization and Recovery Requirements

Offline support preserves safe informational and operational continuity; it never creates offline payment settlement.

| ID | Mandatory behavior | Acceptance evidence | Upstream |
| --- | --- | --- | --- |
| FR-OFF-001 | The host may display the last validated active journey and fare context while disconnected, with a visible stale/offline indicator. | Network-loss UI test. | PR-JRN-006 |
| FR-OFF-002 | The passenger flow shall state when payment initiation or status confirmation is unavailable because provider/server connectivity is absent. | Offline browser demonstration. | PR-PAX-009 |
| FR-OFF-003 | The system shall not create a locally confirmed payment or permit a client to submit provider success evidence. | Tamper and offline tests. | PR-PAY-005 |
| FR-OFF-004 | Locally captured nonfinancial operational events shall carry unique identifiers, local occurrence time and synchronization status. | Queued-event inspection. | PR-OPS-003 |
| FR-OFF-005 | Synchronization shall be idempotent and shall not duplicate journey, incident or audit effects after retry. | Repeated sync test. | PR-PAY-002 |
| FR-OFF-006 | A conflict with financial or assignment meaning shall be preserved and routed for review instead of silently overwritten. | Conflict simulation. | PR-PAY-007 |
| FR-OFF-007 | Retry shall use bounded backoff and a dead-letter/review outcome after the approved limit. | Retry-exhaustion test. | PR-OPS-001 |
| FR-OFF-008 | After API or host restart, durable payment attempts, provider event receipts and audit events shall reload without state regression. | Restart durability test. | PR-PAY-008 |
| FR-OFF-009 | A journey may resume after reconnect only when server authorization and current journey status permit it. | Reconnect authorization test. | PR-JRN-006 |
| FR-OFF-010 | Cached passenger data shall follow the approved minimum fields, expiry and deletion behavior. | Cache inspection and expiry test. | PR-SEC-004 |

# 15 Validation Rules and Data Handling

Validation occurs server-side even when the client provides early feedback. Rejected input shall produce safe field or operation errors and no partial financial effect.

| Object or field | Mandatory validation | Failure behavior |
| --- | --- | --- |
| Journey token | Well formed; issued by HotPesa; active; correct tenant; within expiry; journey not closed/suspended. | Deny and show safe journey-unavailable guidance. |
| MSISDN | Approved Kenyan format; canonical normalization; no PIN or free-form secret. | Reject field; do not initiate. |
| Destination/stage | Member of active route direction and supported fare context. | Reject tampered value; refresh allowed options. |
| Fare quote | Server generated; active at quote time; amount/currency present; linked version retained. | Reject stale/unknown quote and obtain a new quote. |
| Idempotency key | Present, valid length/format, scoped to operation; canonical request hash consistent. | Reject changed reuse; return original for identical reuse. |
| Payment attempt | Known tenant/journey/quote; eligible state; no prohibited duplicate effect. | Return current safe state or controlled conflict. |
| Provider event | Authentic; parseable; unique event reference; correlates to attempt and merchant; result interpretable. | Reject/quarantine/audit; never invent success. |
| Amount/currency | Exact match to immutable attempt and provider evidence. | Move to review-required or reject evidence per approved rule. |
| User/role | Active identity; tenant membership; permitted role and resource context. | Deny, audit where material, reveal minimal detail. |
| Export | Authorized role; tenant scope; approved fields; bounded filter/date range. | Deny or require narrowed request; audit outcome. |
| Fare effective period | Valid times; no prohibited overlap; approval complete. | Do not activate; return conflict details to authorized user only. |
| Audit content | Required event fields; secrets and prohibited sensitive payload removed. | Fail controlled action or place event in protected recovery path. |

## 15.1 Data Minimization Rules

The passenger account is not required for MVP.

Phone values are normalized for initiation but masked in operational views and logs.

Provider raw payload retention requires an approved legal, security and operational rule; default application views use normalized evidence.

Receipt and export fields are limited to purpose.

Deletion or retention actions must not destroy evidence subject to approved financial, dispute, audit or legal holds.

# 16 Functional State Models

## 16.1 Payment Attempt State Model

| Current state | Permitted next state | Required trigger | Prohibited inference |
| --- | --- | --- | --- |
| created | initiating; failed; expired | Durable attempt exists; dispatch begins or controlled pre-dispatch failure/expiry occurs. | Creation is not provider acceptance. |
| initiating | pending; confirmed; failed; expired; review-required | Provider response or trusted evidence processed through central transition rules. | An initiated prompt is not payment. |
| pending | confirmed; failed; expired; review-required | Trusted callback/status evidence, controlled expiry or conflict. | Elapsed time or client claim is not confirmation. |
| confirmed | review-required only for approved conflict handling; separate reversal/refund record if later supported | Trusted matched success evidence; any later conflict retained. | A failure/expiry cannot silently overwrite confirmation. |
| failed | review-required when later trusted success/conflict arrives | Trusted failure evidence; later conflicting evidence. | A manual note cannot turn failure into success. |
| expired | review-required or confirmed only according to approved late-evidence rule | Expiry policy; later trusted evidence. | Expiry does not erase provider evidence. |
| review-required | Resolved disposition recorded; effective financial state remains evidence-led | Authorized review with rationale and evidence. | Reviewer cannot edit raw evidence or invent provider success. |

## 16.2 Journey State Model

| State | Entry condition | Allowed action | Exit condition |
| --- | --- | --- | --- |
| draft | Authorized setup exists but is not active. | Edit approved journey context; cancel. | Authorized start or cancellation. |
| active | Valid vehicle, route, crew and fare context. | Discover, quote, initiate, monitor. | Authorized close/suspend/cancel. |
| closing | New initiation stopped; unresolved items being summarized. | Status checks and approved reconciliation. | Closure conditions met or exception recorded. |
| closed | Closure summary retained. | Read/report/reconcile existing attempts only. | Terminal for new passenger activity. |
| suspended | Safety, configuration or service control invoked. | Authorized investigation/recovery. | Resume or close by authorized action. |
| cancelled | Journey invalidated before/after start with reason. | Historical read only; existing payment evidence preserved. | Terminal. |

## 16.3 Fare and Reconciliation States

| Entity | States | Functional rule |
| --- | --- | --- |
| Fare version | draft, pending-approval, active, superseded, withdrawn | Only active and effective can create new quotes; historical attempts retain original version. |
| Provider event | received, validated, rejected, duplicate, quarantined, processed | Validation and deduplication precede state effect; every receipt remains traceable. |
| Reconciliation case | open, assigned, investigating, resolved, escalated | Resolution requires authority, rationale and immutable evidence references. |
| Sync event | queued, sending, synchronized, conflict, dead-letter | Retries are bounded; conflict does not overwrite financial truth. |

# 17 Error Exception and Alternate Flow Handling

| Condition | Required behavior | User/operations outcome | Audit/evidence |
| --- | --- | --- | --- |
| Invalid journey link | Reject access without resource disclosure. | Passenger receives rescan/ask-conductor guidance. | Security/usage event as approved. |
| Journey closes during form completion | Reject new attempt; preserve any already-created server attempt. | Passenger receives closed status and attempt lookup if applicable. | Closure and request correlation. |
| No host internet | Show honest offline state; permit only approved cached information. | No claim of payment availability or success. | Connectivity telemetry without sensitive content. |
| Provider timeout | Keep last durable state; schedule/offer controlled status check. | Pending/unknown guidance; no immediate duplicate payment prompt. | Request, timeout and reconciliation evidence. |
| Duplicate callback | Acknowledge safely and perform no second business effect. | No duplicate receipt or state change. | Duplicate event receipt and audit event. |
| Unmatched callback | Quarantine and alert authorized operations. | No passenger state created from unmatched evidence. | Protected evidence and investigation case. |
| Amount/merchant mismatch | Do not confirm; route to review-required/quarantine. | Neutral review guidance. | Mismatch fields, redacted evidence and alert. |
| Late success after expiry/failure | Apply approved late/conflict transition rule. | Confirmed only if deterministic trusted rule permits; otherwise review-required. | Both original and late evidence retained. |
| Database write failure | Do not report successful mutation; use controlled retry only where idempotent. | Retry-safe error and correlation reference. | Operational error without secret leakage. |
| Unauthorized action | Deny server-side and reveal minimal information. | Generic denied response. | Security event for material attempts. |
| Host restart | Reload active journey and durable server truth. | No invented payment state. | Restart/recovery telemetry. |
| Export too broad | Reject or require bounded filters. | Authorized user narrows request. | Denied/limited export event. |

# 18 Business Rules and Permission Matrix

## 18.1 Business Rules

| ID | Binding rule |
| --- | --- |
| BRULE-001 | Only accepted provider evidence may create confirmed. |
| BRULE-002 | A journey and fare quote precede every payment attempt. |
| BRULE-003 | One attempt retains one immutable amount, currency and fare version. |
| BRULE-004 | Pending and review-required are not collected revenue. |
| BRULE-005 | HotPesa does not hold passenger funds or stored value. |
| BRULE-006 | A duplicate request/event produces at most one business effect. |
| BRULE-007 | A tenant cannot access another tenant’s data or actions. |
| BRULE-008 | Fare publication and high-risk configuration require authorized approval. |
| BRULE-009 | Operational notes cannot modify provider evidence. |
| BRULE-010 | Closed journeys reject new attempts but preserve existing evidence handling. |
| BRULE-011 | Personal identifiers are masked by default and exposed only for approved purpose. |
| BRULE-012 | Offline connectivity never proves settlement. |

## 18.2 Permission Matrix

| Action | Passenger | Conductor | Ops/Owner | Finance/Support | Tenant/Platform Admin | Auditor |
| --- | --- | --- | --- | --- | --- | --- |
| Open journey and obtain quote | Own scoped session | View active context | Monitor | Support view | Configure/monitor | Read evidence |
| Initiate payment | Own scoped session | Not on passenger behalf | No | No | No | No |
| Confirm payment | No | No | No | No; reconcile evidence only | No | No |
| Start/close journey | No | Assigned conductor | Authorized override | No | Configure policy | Read |
| Create fare | No | No | Authorized creator | Read | Configure roles | Read |
| Approve/publish fare | No | No | Authorized approver | Read | Policy only | Read |
| Reconcile attempt | Status refresh only | Status view | Monitor | Authorized finance | Platform support under control | Read |
| View full phone | No | No/masked | Masked | Purpose-based masked/reveal | Restricted | Masked |
| Manage tenant users | No | No | No unless assigned | No | Tenant admin; platform boundary | Read |
| Configure provider | No | No | No | No | Platform admin with dual control | Read |
| Export report | Own reference only | Journey summary if approved | Scoped | Scoped/purpose based | Controlled | Read-only scoped |

# 19 External Interface Behavior

| Interface | Required request/interaction behavior | Required response/evidence behavior | Failure control |
| --- | --- | --- | --- |
| Passenger browser to API | TLS; scoped journey/session reference; validated fields; idempotency for initiation. | Canonical journey, quote, attempt and state DTOs with safe error codes. | No secrets; reject tampered context; rate controls. |
| Conductor host to API | Authenticated actor, tenant, assignment and journey context. | Active journey, connectivity, state counts and masked references. | Offline indicator; restore from durable state. |
| Admin web to API | Authenticated role/context; bounded search/export; reason for material actions. | Tenant-scoped results and audit correlation. | Deny over-broad or unauthorized operations. |
| API to M-Pesa/provider | Server-held credentials; approved merchant config; unique correlation and exact amount. | Normalized initiation/status result and protected raw evidence handling. | Timeout-safe state; bounded retry; no client fallback credentials. |
| Provider callback to API | Authenticity control; event identity; correlation; amount/result fields. | Safe acknowledgement after receipt/validation policy. | Deduplicate, reject or quarantine without leaking internals. |
| API to PostgreSQL | Transactional durable writes for attempt, evidence, transition and audit. | Committed records before mutation success response. | Rollback or controlled recovery; no partial success claim. |
| Worker/Redis to API/store | Reference durable entities; idempotent job identity; bounded retries. | Observable completion, retry, conflict or dead-letter outcome. | Queue loss shall not redefine durable financial truth. |

## 19.1 API Contract Governance

Document 06 shall define versioned request/response schemas, enumerations, errors and webhook contracts consistent with this FRS.

Breaking changes require a versioning and migration decision.

Clients shall not infer undocumented state from HTTP status alone; the controlled response contract is authoritative.

Provider-specific fields remain inside the adapter boundary unless a normalized field is explicitly approved.

# 20 Acceptance Scenarios

| ID and scenario | Given When Then acceptance outcome |
| --- | --- |
| AC-001 Successful confirmation | Given an active journey and valid quote, when provider success evidence exactly matches the attempt, then the state becomes confirmed once and one passenger reference is available. |
| AC-002 Provider failure | Given an initiated attempt, when trusted provider failure evidence arrives, then the state becomes failed and no confirmed-revenue effect occurs. |
| AC-003 Duplicate callback | Given a processed event, when the same provider event arrives again, then there is no second transition or receipt effect and a duplicate audit event is recorded. |
| AC-004 Missing callback | Given a pending attempt with no callback, when an authorized status check returns trusted success, then the central transition rules confirm it once. |
| AC-005 Conflicting evidence | Given a terminal result, when incompatible trusted evidence arrives and no deterministic safe rule resolves it, then the attempt becomes review-required. |
| AC-006 Fake SMS or screenshot | Given only passenger/conductor visual evidence, when no provider evidence exists, then HotPesa does not confirm payment. |
| AC-007 Changed fare | Given an existing attempt, when a new fare version activates, then the attempt retains its original amount and fare version. |
| AC-008 Offline host | Given lost internet connectivity, when the journey is displayed from approved cache, then the UI shows offline/stale status and never displays payment as confirmed. |
| AC-009 Tenant isolation | Given a Tenant A user, when a Tenant B identifier is requested, then the system denies access and returns no Tenant B data. |
| AC-010 Host restart | Given durable attempts and evidence, when the API/host restarts, then states and audit timelines reload without regression or duplication. |
| AC-011 Journey closure | Given unresolved attempts, when closure occurs, then new initiations stop and unresolved counts remain available for reconciliation. |
| AC-012 Accessibility | Given keyboard and screen-reader use or reduced-motion preference, when the passenger traverses the flow, then every state and action remains perceivable and operable. |
| AC-013 Redaction | Given support, conductor and export views, when payment data is displayed, then full phone and secret fields are absent unless explicitly authorized. |
| AC-014 Idempotent initiation | Given the same key and canonical request, when initiation is replayed, then the original attempt is returned; a changed request is rejected. |
| AC-015 Reporting truth | Given mixed payment states, when a revenue report is generated, then only confirmed value is labelled confirmed revenue and all other states remain separate. |

## 20.1 Acceptance Evidence Package

Automated unit tests for transition, validation and permission rules.

API contract and integration tests for journey, quote, initiation, callback, reconciliation and reporting.

Browser tests for passenger, conductor/admin and accessibility-critical journeys.

Durability tests using PostgreSQL across restart.

Security tests for tenant isolation, authorization, secret leakage and input manipulation.

Pilot demonstration evidence on approved Android devices, browsers and Kenyan network conditions.

# 21 Requirement Traceability Matrix

| FRS range | PRD source | BRD source | Primary downstream evidence |
| --- | --- | --- | --- |
| FR-COM-* | PR-SEC-002 to 005; PR-PAY-002, 008 | BR-GOV-001 to 006; BR-PAY-004 to 009 | Cross-cutting API, security, audit and resilience tests. |
| FR-PAX-* | PR-PAX-001 to 010 | BR-PAX-001 to 006; BR-FAR-004; BR-PAY-005 to 010 | Passenger UI, API and accessibility tests. |
| FR-JRN-* | PR-JRN-001 to 008 | BR-JRN-001 to 004; BR-OPS-001 to 005 | Host, assignment, journey and closure tests. |
| FR-FAR-* | PR-FAR-001 to 006 | BR-FAR-001 to 004; BR-ADM-001 | Fare validation, approval and historical tests. |
| FR-PAY-* | PR-PAY-001 to 010 | BR-PAY-001 to 010 | Lifecycle, idempotency and provider integration tests. |
| FR-REC-* | PR-PAY-002, 006 to 009; PR-OPS-001 | BR-PAY-004 to 009; BR-ADM-003 | Callback, status, mismatch and review tests. |
| FR-CRW-* | PR-JRN-001, 008; PR-ADM-002 | BR-OPS-001 to 004 | Crew assignment and safety tests. |
| FR-ADM-* | PR-ADM-001 to 004; PR-SEC-001 to 003 | BR-ADM-001 to 005; BR-GOV-003 | Tenant, user, fleet and isolation tests. |
| FR-FIN/SUP/PAD-* | PR-PAY-009; PR-OPS-001 to 003; PR-SEC-002 to 005 | BR-ADM-003 to 005; BR-GOV-002 to 006 | Role, reconciliation, support and privileged-control tests. |
| FR-RPT/NTF/AUD-* | PR-RPT-001 to 003; PR-SEC-004, 005 | BR-RPT-001 to 004; BR-GOV-001 to 006 | Report, export, message and audit tests. |
| FR-OFF-* | PR-JRN-006; PR-PAY-002, 005, 007, 008; PR-SEC-004 | BR-OPS-005; BR-PAY-005 to 009 | Offline, retry, conflict and restart tests. |

## 21.1 Traceability Control Rule

Every implementation task, user story, API operation and acceptance test shall cite at least one FRS identifier. A requirement may not be marked implemented solely because code exists; its defined positive, negative, permission and exception evidence must pass. Deleted or superseded requirements retain history and must not have identifiers reused.

## 21.2 Coverage Summary

| Coverage dimension | Result | Condition |
| --- | --- | --- |
| PRD MVP functional domains | Covered | Passenger, journey, fare, payment, reconciliation, administration, reporting, security and operations are represented. |
| Payment state semantics | Covered | Seven states aligned to the implemented Phase 0 proof. |
| Normal paths | Covered | Passenger, journey, quote, initiation, callback and report behavior specified. |
| Alternate and failure paths | Covered | Offline, timeout, duplicate, mismatch, late evidence, restart and unauthorized cases specified. |
| Production release authority | Not granted | Live-provider, legal/commercial, pilot and NFR approvals remain required. |

# 22 Open Decisions Assumptions and Dependencies

## 22.1 Open Decision Register

| ID | Decision required | Owner | Due gate | Status |
| --- | --- | --- | --- | --- |
| OD-FRS-001 | Pilot operator/SACCO, routes, vehicles and field operating model. | Founder/Product Sponsor | Before pilot build | Open |
| OD-FRS-002 | Live M-Pesa product, merchant/settlement model and provider contract. | Commercial/Finance/Provider | Before live integration | Open |
| OD-FRS-003 | Callback authenticity control and provider-specific deduplication keys. | Security/Engineering/Provider | Before adapter approval | Open |
| OD-FRS-004 | Payment expiry window, reconciliation retry limits and late-evidence disposition. | Product/Finance/Operations | Before MVP acceptance | Open |
| OD-FRS-005 | Fare creator/approver roles and whether dual approval is mandatory. | Pilot SACCO/Product | Before fare administration | Open |
| OD-FRS-006 | Approved workforce identity provider and MFA policy. | Security/Engineering | Before production identity build | Open |
| OD-FRS-007 | Data retention, deletion, dispute hold and raw provider-payload rules. | Legal/Privacy/Finance/Security | Before production data approval | Open |
| OD-FRS-008 | Passenger language scope: English, Kiswahili and any pilot-language needs. | Product/Pilot Operator | Before UX content freeze | Open |
| OD-FRS-009 | Offline operational fallback, device ownership and hotspot support boundaries. | Operations/Pilot Operator | Before field pilot | Open |
| OD-FRS-010 | Refund/reversal scope and separation-of-duty workflow. | Finance/Legal/Product | Phase 2 or before inclusion | Open |
| OD-FRS-011 | Production report/export fields and personal-data reveal policy. | Finance/Privacy/Security | Before report acceptance | Open |
| OD-FRS-012 | Quantitative NFR targets and support/service ownership. | Engineering/Operations/Product | Before production gate | Open |

## 22.2 Assumptions

| ID | Planning assumption | Validation | Status |
| --- | --- | --- | --- |
| A-FRS-001 | Passengers can access a standards-compliant mobile browser and an approved connection path. | Device/network pilot. | Open |
| A-FRS-002 | The approved provider supports server initiation plus callback and/or status evidence. | Provider technical validation. | Open |
| A-FRS-003 | Pilot fare rules can be represented by route/direction/stage versions without dynamic pricing. | Operator workshop. | Partly proven |
| A-FRS-004 | Operators can assign accountable workforce roles and maintain vehicle/route data. | Pilot readiness review. | Open |
| A-FRS-005 | HotPesa remains non-custodial and settlement occurs directly under the approved merchant arrangement. | Commercial/legal confirmation. | Baseline pending approval |
| A-FRS-006 | Phase 0 mock semantics remain the reference for state transition behavior. | Product/engineering review. | Proven locally |

## 22.3 Dependencies

| Dependency | Why required | Failure impact |
| --- | --- | --- |
| Approved BRD and PRD | Authorizes business and product scope. | FRS cannot become approved baseline. |
| Pilot operator/SACCO | Supplies routes, fares, assignments and field validation. | Operational behavior remains unvalidated. |
| M-Pesa/provider access | Supplies sandbox/live contracts and trusted evidence. | Only mock proof can operate. |
| Workforce identity service | Supplies credential/session primitives. | Production workforce access cannot be approved. |
| PostgreSQL and Redis runtime | Supports durable state and bounded background work. | Durability/retry evidence incomplete. |
| Security privacy and NFR specification | Defines quantitative controls and service qualities. | Production acceptance incomplete. |
| Data model and API contract | Defines exact schemas and external/internal messages. | Implementation may diverge from behavior. |
| Test and pilot evidence | Proves target-device, network and operational fit. | No pilot or release approval. |

# 23 Approval and Sign Off

Approval confirms that the functional behavior, boundaries, states, permissions, exception handling and traceability are suitable for controlled MVP implementation. Approval does not authorize live M-Pesa processing, production credentials, public release or deployment without the separate security, legal, commercial, operational and release gates.

| Role | Name | Decision | Signature | Date |
| --- | --- | --- | --- | --- |
| Project Sponsor |  | Approve / Conditional / Reject |  |  |
| Product Owner |  | Approve / Conditional / Reject |  |  |
| Pilot Operator/SACCO Representative |  | Approve / Conditional / Reject |  |  |
| Engineering Authority |  | Approve / Conditional / Reject |  |  |
| Quality Assurance Authority |  | Approve / Conditional / Reject |  |  |
| Security/Privacy Authority |  | Approve / Conditional / Reject |  |  |
| Finance/Operations Authority |  | Approve / Conditional / Reject |  |  |

## 23.1 Approval Conditions

| Condition | Status |
| --- | --- |
| BRD and PRD approved or approved with recorded conditions. | Pending |
| Open decisions assigned with due gates and accountable owners. | Pending |
| Requirement-to-test ownership accepted. | Pending |
| Payment state model and evidence authority accepted. | Pending |
| Permission and separation-of-duty model accepted. | Pending |
| Pilot operator and live-provider boundaries approved. | Pending |
| Security, privacy, legal and NFR review completed for implementation gate. | Pending |

# 24 Final FRS Readiness Checklist

| Readiness item | Status |
| --- | --- |
| Purpose, scope, authority and exclusions are explicit. | Complete |
| Requirement identifiers are stable and grouped by capability. | Complete |
| Requirements use mandatory, testable behavior. | Complete |
| Passenger, workforce, administration and provider actors are covered. | Complete |
| Normal, alternate, failure and unauthorized paths are specified. | Complete |
| Seven payment states and central evidence rules are aligned to Phase 0. | Complete |
| Fare, idempotency, duplicate, reconciliation and review rules are specified. | Complete |
| Tenant isolation, masking, audit and privileged controls are represented. | Complete |
| Acceptance scenarios and verification evidence are present. | Complete |
| BRD and PRD traceability is summarized. | Complete |
| Open business, provider, legal, privacy and operational decisions are recorded. | Complete |
| Stakeholder approval and final pilot parameters obtained. | Pending |
| Data/API, architecture, UI/UX, security/NFR and test specifications synchronized. | Pending |
| Live-provider and production release authorization granted. | Not authorized |

## 24.1 Completion Statement

This FRS is structurally complete as a professional functional baseline for stakeholder review and controlled implementation planning. It is consistent with the regenerated HotPesa BRD and PRD and with the locally proven Phase 0 payment semantics. It becomes an approved implementation authority only after the approval conditions and decision register are resolved or formally accepted with recorded conditions. Live M-Pesa, production credentials and public release remain outside this document’s authority.
