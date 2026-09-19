---
document_id: "04"
title: "User Stories and Use Cases"
project: "HotPesa Pay"
source_docx: "docs/controlled-documents/04_User Stories and Use Cases (USUC)_HotPesa Pay.docx"
source_version: "1.0"
source_status: "Draft for stakeholder review and approval"
synchronization_date: "2026-09-19"
source_sha256: "1bf8add37e543049c7c81241381241e387bb57b4f029fcf37699daeb6ebb9d76"
---

> Controlled source: [04_User Stories and Use Cases (USUC)_HotPesa Pay.docx](../controlled-documents/04_User%20Stories%20and%20Use%20Cases%20(USUC)_HotPesa%20Pay.docx)

> The DOCX source is authoritative. This Markdown copy preserves its controlled status and does not confer approval.

DOCUMENT 04

User Stories and Use Cases

HotPesa Pay

<br>

User value, acceptance behavior and complete interaction flows for the controlled HotPesa MVP

<br><br>

| Control | Value |
| --- | --- |
| Project | HotPesa Pay |
| Document | User Stories and Use Cases |
| Version | 1.0 |
| Status | Draft for stakeholder review and approval |
| Lifecycle stage | Delivery baseline following BRD, PRD and FRS |
| Primary market | Kenya |
| Classification | Confidential - project planning |

<br>

### Governing question

What must each HotPesa actor accomplish, under which conditions, and how shall delivery teams prove the complete journey works safely?

<br>

# Document Control

| Field | Controlled value |
| --- | --- |
| Document owner | Product Owner, supported by Business Analysis, UX, Engineering and Quality Assurance. |
| Business authority | HotPesa Business Requirements Document Version 1.0, subject to approval conditions. |
| Product authority | HotPesa Product Requirements Document Version 1.0, subject to approval conditions. |
| Functional authority | HotPesa Functional Requirements Specification Version 1.0, subject to approval conditions. |
| Reviewers | Founder; pilot operator/SACCO; passenger and crew representatives; product; engineering; UX; quality assurance; security; finance; operations; legal/compliance. |
| Approval authority | Project Steering Committee or designated sponsor - decision required. |
| Reference use | Mpanga USUC informed structure and completeness only; its product content does not apply to HotPesa. |
| Downstream authority | Approved stories and use cases govern backlog decomposition, UI flows, API scenarios, implementation tasks and acceptance tests. |
| Change control | Changed behavior must update the story/use case, linked FRS identifiers, tests and affected downstream specifications. |
| Next review | Before MVP sprint authorization and after pilot, provider and operational decisions are resolved. |

## Document Status and Interpretation

This document expresses approved product intent from the actor perspective and defines observable interaction behavior. Must stories form the controlled MVP backlog. Should and Could stories do not enter the MVP without approval. Proposed, Assumption, Validation Required and Decision Required items remain non-binding until the named authority records a decision. The Phase 0 mock proof validates selected flows but does not authorize live M-Pesa processing or production release.

<br>

## Version History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 0.1 | 18 September 2026 | Initial draft | Twelve summary stories and five critical use cases. |
| 1.0 | 19 September 2026 | Draft for approval | Expanded actor stories, detailed acceptance criteria, fully dressed use cases, exception coverage and BRD-PRD-FRS traceability. |

## Table of Contents

| Section | Purpose |
| --- | --- |
| 1 Purpose Scope and Story Method | Authority, format and quality rules |
| 2 Actors Personas and Access Context | Who acts, where and under what access |
| 3 Product Story Map and Release View | MVP sequence and later-release boundaries |
| 4 Passenger Stories | Accountless passenger value and acceptance |
| 5 Conductor Journey and Crew Stories | Field journey and safety behavior |
| 6 Fare and Tenant Administration Stories | Route, fare, fleet and role governance |
| 7 Payment Reconciliation and Finance Stories | Provider truth and financial exception work |
| 8 Reporting Support Security and Operations Stories | Reports, assistance, protection and service operation |
| 9 Use Case UC PAX 001 Access Active Journey | Open and validate an active journey |
| 10 Use Case UC PAY 001 Pay Passenger Fare | Initiate and confirm one fare safely |
| 11 Use Case UC JRN 001 Start Vehicle Journey | Create the active operational context |
| 12 Use Case UC JRN 002 Close Vehicle Journey | Stop new activity and preserve unresolved evidence |
| 13 Use Case UC FAR 001 Publish Fare Version | Create approve and activate controlled fare |
| 14 Use Case UC PRV 001 Process Provider Evidence | Validate deduplicate and apply trusted evidence |
| 15 Use Case UC REC 001 Reconcile Missing Callback | Repair a pending attempt through status evidence |
| 16 Use Case UC REC 002 Resolve Conflicting Evidence | Handle late mismatch or conflicting evidence |
| 17 Use Case UC ADM 001 Manage Workforce Access | Provision suspend and control privileges |
| 18 Use Case UC RPT 001 Generate Controlled Report | Filter aggregate export and audit results |
| 19 Use Case UC OFF 001 Recover After Connectivity Loss | Preserve safe behavior through disconnection/restart |
| 20 Journey State and Experience Coverage | Loading empty error permission offline states |
| 21 Acceptance Test Portfolio | Automated manual and pilot evidence |
| 22 Requirements Traceability | Story-to-FRS and upstream coverage |
| 23 Open Decisions Assumptions and Dependencies | Items requiring authority or validation |
| 24 Approval and Sign Off | Conditions and stakeholder signatures |
| 25 Final USUC Readiness Checklist | Completion gate for delivery baseline |

# 1 Purpose Scope and Story Method

## 1.1 Purpose

The USUC converts functional requirements into actor-centered backlog items and complete interaction contracts. User stories describe the value and acceptance boundary of a deliverable slice. Fully dressed use cases specify actors, triggers, preconditions, normal flow, alternate paths, failures, business rules and postconditions for high-risk or cross-system journeys.

## 1.2 Scope

Passenger discovery, fare review, payment initiation, status and reference recovery.

Conductor journey setup, local discovery, status monitoring, degraded operation and closure.

Fare, vehicle, route, user and tenant governance.

M-Pesa/provider initiation, callback evidence, idempotency, reconciliation and exception review.

Finance, support, reporting, audit, notification, security and operational workflows.

Normal, alternate, failure, unauthorized, offline and restart behavior.

## 1.3 Story Format and Definition

| Element | Controlled rule |
| --- | --- |
| Story | As a named actor, I want one capability, so that a specific value is achieved. |
| Acceptance criteria | Observable Given/When/Then outcomes or equivalent testable checks; includes negative and permission paths where material. |
| Priority | Must, Should, Could or Won’t in the controlled release. |
| Status | Approved Baseline, Proposed, Assumption, Validation Required or Decision Required. |
| Source | Every story links to one or more FRS identifiers; FRS links carry the PRD and BRD chain. |
| Use case | Used for high-risk, multi-actor, stateful or exception-heavy interactions. |
| Done | Code alone is insufficient; linked positive, negative, authorization, accessibility and durability evidence must pass. |

## 1.4 Story Quality Rules

Independent enough for planning, negotiable within controlled requirements, valuable to a named actor, estimable, small enough for delivery and testable.

A story shall not grant the client authority that belongs to the server or payment provider.

A story shall not combine confirmed and unresolved payment states as one success outcome.

Acceptance criteria shall cover security or financial failure where the risk is material.

Deferred scope shall not be hidden inside MVP acceptance criteria.

# 2 Actors Personas and Access Context

| ID | Actor | Access context | Channel | Primary value |
| --- | --- | --- | --- | --- |
| P-01 | Passenger | Anonymous journey-scoped session | Mobile PWA | Pay safely without app installation or account creation. |
| P-02 | Conductor | Authenticated assigned workforce | Android host | Start/operate/close journey and view safe status. |
| P-03 | Driver | Authenticated assigned workforce | Android host | Acknowledge work and report incidents without payment distraction. |
| P-04 | SACCO operations | Authenticated tenant role | Admin web | Govern routes, vehicles, assignments and active journeys. |
| P-05 | Owner/manager | Authenticated scoped business role | Admin web | Review authorized fleet activity and performance. |
| P-06 | Finance officer | Authenticated privileged tenant role | Admin web | Reconcile evidence, exceptions and reports. |
| P-07 | Support agent | Authenticated purpose-limited role | Admin web | Assist users using redacted evidence. |
| P-08 | Tenant administrator | Authenticated privileged tenant role | Admin web | Manage tenant workforce and configuration. |
| P-09 | Platform administrator | Strongly authenticated internal role | Platform admin | Manage tenants and integrations under strict control. |
| P-10 | Auditor | Read-only time/tenant scoped role | Audit/reporting | Inspect evidence without mutation. |
| EXT-01 | M-Pesa/provider | Mutually authenticated external service | Server interface | Receive initiation and return authoritative evidence. |

<br>

## 2.1 Persona Constraints

| Actor | Environment and constraint | Design/acceptance implication |
| --- | --- | --- |
| Passenger | Low-cost phone, small screen, bright light, time pressure, variable network, may avoid registration. | Fast accountless flow, clear context, accessible states, safe reconnect and no phone handover. |
| Conductor | Moving vehicle, one-hand use, interruptions, weak network and operational pressure. | Large controls, concise board, assignment safety, restart recovery and minimal passenger data. |
| Driver | Safety-critical attention and limited permissible interaction while moving. | No routine payment confirmation task; interactions limited to safe moments. |
| Operations/owner | Multiple vehicles, routes, crews and exception ownership. | Scoped filtering, controlled configuration and accountable changes. |
| Finance/support | Needs evidence without unrestricted sensitive data. | Masked search, event timeline, purpose-based actions and audit. |
| Administrators/auditors | High-impact or assurance access. | Least privilege, MFA/dual control where required, read-only audit and expiry. |

<br>

# 3 Product Story Map and Release View

## 3.1 MVP Story Map

| Journey stage | Passenger | Conductor and operations | Platform and evidence |
| --- | --- | --- | --- |
| Prepare | Open QR/short address; recognize journey. | Assign vehicle/crew; start active journey. | Validate tenant, assignment, fare and session. |
| Review | Select destination; see exact quote. | See active route/fare/connectivity. | Resolve effective fare version and create quote. |
| Initiate | Enter approved phone; confirm action. | Observe attempt without handling phone. | Create idempotent attempt and dispatch provider request. |
| Await | See created/initiating/pending honestly. | See state counts and masked reference. | Process callback/status evidence and apply central transitions. |
| Complete | See confirmed reference or safe failure guidance. | See confirmed once; no screenshot reliance. | Deduplicate, audit and expose durable state. |
| Close | Retain safe reference. | Stop new attempts; record exceptions; close journey. | Preserve unresolved evidence and publish state-separated summary. |
| Operate | Request assistance using safe reference. | Resume after reconnect/restart. | Reconcile, support, report, audit and monitor. |

<br>

## 3.2 Release Boundary

| Release | Included story themes | Excluded/deferred themes |
| --- | --- | --- |
| Phase 0 proof | Synthetic journey; mock provider; seven states; duplicate evidence; reconciliation; redaction; browser proof. | Live money, production identity, deployment and commercial launch. |
| MVP pilot | Accountless passenger flow; Android host; journey/fare; provider adapter; status board; tenant admin; reconciliation; basic reporting/audit. | Wallet, reservations, loyalty, credit, insurance, advertising and broad multi-operator clearing. |
| Phase 2 candidate | Richer fleet/shift work, approved refund/reversal, expanded support and notifications, optional QR ticket validation. | Any item without approved business, legal, security and operational scope. |
| Roadmap | Advanced analytics, additional operators/providers and approved passenger services. | Passenger-data monetization or custodial financial services without a separate initiative. |

# 4 Passenger Stories

Passenger stories preserve user control, make price and journey context explicit, and treat provider evidence as the only payment-success authority.

| ID | Actor need and value | Acceptance summary | Priority | FRS source |
| --- | --- | --- | --- | --- |
| US-PAX-001 | As a passenger, I want to open the official active journey from a QR code or short address so that I can use HotPesa without installing an app. | Valid link opens; unknown, expired, suspended or closed link gives safe recovery; no account required. | Must | FR-PAX-001/002 |
| US-PAX-002 | As a passenger, I want to recognize the operator and journey before acting so that I avoid paying the wrong vehicle. | Operator, route/direction and sufficient vehicle/journey identity display before fare action. | Must | FR-PAX-003/004 |
| US-PAX-003 | As a passenger, I want to choose only valid destinations so that the fare applies to my journey. | Only active route-direction options appear; tampered values are rejected server-side. | Must | FR-PAX-005 |
| US-PAX-004 | As a passenger, I want to see the exact fare and currency before payment so that I can make an informed decision. | Server quote and fare context display before Pay is enabled; stale quote is refreshed. | Must | FR-PAX-006; FR-FAR-006/007 |
| US-PAX-005 | As a passenger, I want to enter my Kenyan phone number safely so that M-Pesa can prompt my own phone. | Approved formats normalize; malformed values fail; full value is masked after submission; PIN is never requested. | Must | FR-PAX-007/008 |
| US-PAX-006 | As a passenger, I want one deliberate payment submission so that accidental taps do not create duplicate attempts. | Active submission disables repeat; identical replay returns original; changed reuse is rejected. | Must | FR-PAX-009/010; FR-PAY-002/004 |
| US-PAX-007 | As a passenger, I want honest payment progress so that I do not confuse initiation or delay with success. | Created, initiating and pending use neutral wording; only confirmed uses success language. | Must | FR-PAX-012/014 |
| US-PAX-008 | As a passenger, I want a trustworthy confirmed result so that I know provider evidence accepted my fare. | Confirmed requires matched provider evidence; screenshots, SMS or client claims cannot confirm. | Must | FR-PAX-013; FR-PAY-009 |
| US-PAX-009 | As a passenger, I want clear failed, expired and review guidance so that I know what to do without paying twice. | Each state has a reason category and safe next action; retry is offered only under an approved condition. | Must | FR-PAX-016 |
| US-PAX-010 | As a passenger, I want to recover status after disconnecting so that I do not restart an uncertain payment. | Scoped session/reference returns current durable state after reconnect. | Must | FR-PAX-011 |
| US-PAX-011 | As a passenger, I want a minimal confirmation reference so that I can prove and support my fare without exposing private data. | Reference shows amount, time and journey/transaction identifiers; phone and secrets remain masked. | Must | FR-PAX-015 |
| US-PAX-012 | As a passenger using assistive technology, I want every status and action to be perceivable and operable so that I can complete the flow independently. | Keyboard, focus, text/icon status, reduced motion and programmatic announcements work; color is not sole signal. | Must | FR-COM-007 |
| US-PAX-013 | As a passenger on weak connectivity, I want clear offline limitations so that local access is not mistaken for M-Pesa access. | Approved cached context may display with stale indicator; initiation/confirmation unavailability is explicit. | Must | FR-OFF-001/003 |
| US-PAX-014 | As a passenger, I want support to locate my case using a safe reference so that I receive help without sharing unnecessary personal data. | Approved reference finds redacted timeline; support access and notes are audited. | Must | FR-SUP-001/003 |

# 5 Conductor Journey and Crew Stories

Field stories prioritize assignment integrity, one-hand operation, safe payment evidence and recovery under weak network conditions.

| ID | Actor need and value | Acceptance summary | Priority | FRS source |
| --- | --- | --- | --- | --- |
| US-CON-001 | As an assigned conductor, I want to start the correct vehicle journey so that passengers enter an authoritative context. | Only assigned vehicle/route/direction is selectable; conflict is blocked; start creates one scoped journey. | Must | FR-JRN-001/003 |
| US-CON-002 | As a conductor, I want an official QR code and short address so that passengers can open the correct journey. | Tokens bind to active journey, can be invalidated and stop accepting new attempts after closure. | Must | FR-JRN-004 |
| US-CON-003 | As a conductor, I want to see active journey and connectivity context so that I can recognize incorrect setup quickly. | Operator, vehicle, route, fare source, journey reference and connectivity are visible. | Must | FR-JRN-005 |
| US-CON-004 | As a conductor, I want a live payment-state board so that I do not inspect passenger SMS messages or phones. | Board groups by state, masks payer data and updates from server truth only. | Must | FR-JRN-006/007 |
| US-CON-005 | As a conductor, I want duplicate events to appear once operationally so that totals remain accurate. | Duplicate callback creates no second state/receipt effect and is auditable. | Must | FR-REC-003/004 |
| US-CON-006 | As a conductor, I want the active journey restored after restart so that work resumes without inventing payment state. | Host reloads server journey and durable attempts; no local confirmation is created. | Must | FR-JRN-008; FR-OFF-008 |
| US-CON-007 | As a conductor, I want honest degraded behavior during network loss so that passengers are not told an offline payment succeeded. | Stale/offline status is visible; unsupported payment actions are blocked or safely deferred. | Must | FR-JRN-012; FR-OFF-002/003 |
| US-CON-008 | As a conductor, I want to close a journey safely so that new payments stop and unresolved attempts remain traceable. | Closure stops new attempts, preserves status/reconciliation and produces state-separated summary. | Must | FR-JRN-009/010 |
| US-CON-009 | As a conductor, I want to record permitted operational notes so that exceptions are explained without altering provider evidence. | Reason is required where configured; note is separate, attributable and cannot change payment state. | Must | FR-JRN-011 |
| US-DRV-001 | As a driver, I want to acknowledge my assigned vehicle and journey so that the crew context is accountable. | Only assigned duties display; reassignment is authorized and retains history. | Must | FR-CRW-001/005 |
| US-DRV-002 | As a driver, I want payment operations excluded while driving so that HotPesa does not create unsafe distraction. | No routine payment confirmation, phone inspection or payment control is assigned to driver. | Must | FR-CRW-002 |
| US-CRW-001 | As an authorized crew member, I want to record a safety or operational incident so that operations can follow up. | Incident links to journey/vehicle/time/category and never modifies provider evidence. | Should | FR-CRW-003/004 |

# 6 Fare and Tenant Administration Stories

Administration stories create controlled operational context and preserve tenant isolation and historical truth.

| ID | Actor need and value | Acceptance summary | Priority | FRS source |
| --- | --- | --- | --- | --- |
| US-FAR-001 | As a fare creator, I want to define route, direction, stage, amount and effective dates so that the system can quote the approved fare. | Required fields validate; invalid amount/currency/date is rejected. | Must | FR-FAR-001/003 |
| US-FAR-002 | As a fare approver, I want to review and publish a version so that one accountable fare becomes effective. | Approver, decision time and reason are recorded; prohibited overlap is blocked. | Must | FR-FAR-004/005 |
| US-FAR-003 | As an operator, I want historical attempts to retain their original fare so that later price changes do not rewrite transactions. | Attempt keeps amount/currency/version; superseded fares remain auditable. | Must | FR-FAR-006/008 |
| US-FAR-004 | As a conductor and passenger, I want the same authoritative quote so that disputes are minimized. | Same journey/stage returns same server quote across approved channels. | Must | FR-FAR-009 |
| US-OPS-001 | As SACCO operations, I want to manage vehicles, routes and ordered stages so that journeys use approved operational data. | Tenant-scoped changes validate and preserve historical journey facts. | Must | FR-ADM-001/002 |
| US-OPS-002 | As SACCO operations, I want to manage crew assignments so that only accountable workforce can start a journey. | Vehicle, route, fare and crew belong to same tenant; assignment conflicts are rejected. | Must | FR-ADM-003 |
| US-TAD-001 | As a tenant administrator, I want to provision and suspend workforce users so that access follows employment and duty. | Only permitted roles can be assigned; suspension prevents new access and revokes sessions per policy. | Must | FR-ADM-004/006 |
| US-TAD-002 | As a tenant administrator, I want high-risk role changes controlled so that users cannot self-escalate. | Reason, audit and configured second approval are required; unauthorized escalation fails. | Must | FR-ADM-005 |
| US-OWN-001 | As an owner or manager, I want to view only authorized fleet activity so that I can manage performance without accessing other fleets. | Resource scope is enforced in UI, API, search and export. | Must | FR-ADM-007/009 |
| US-TAD-003 | As a tenant administrator, I want material configuration versioned so that journey and payment interpretation remains explainable. | Before/after values, actor, reason and effective time are retained. | Must | FR-ADM-008 |
| US-PAD-001 | As a platform administrator, I want tenant and integration changes to use strong controls so that production impact is accountable. | Strong authentication, dual control where required, effective time and audit apply. | Must | FR-PAD-001/004 |
| US-AUD-001 | As an auditor, I want read-only scoped access so that I can inspect evidence without changing it. | Tenant/time/purpose scope and access expiry apply; mutations are denied. | Must | FR-AUD-004 |

# 7 Payment Reconciliation and Finance Stories

Payment and finance stories maintain one durable attempt, trusted evidence, explicit exceptions and state-separated financial reporting.

| ID | Actor need and value | Acceptance summary | Priority | FRS source |
| --- | --- | --- | --- | --- |
| US-PAY-001 | As HotPesa, I want one immutable payment attempt per deliberate request so that journey, fare and payer context stay traceable. | Attempt persists before/with dispatch and links tenant, journey, fare, amount, currency and masked payer reference. | Must | FR-PAY-001/006 |
| US-PAY-002 | As HotPesa, I want initiation to be idempotent so that retries cannot create duplicate effects. | Same key/request returns original; changed payload is rejected and audited. | Must | FR-PAY-002/004 |
| US-PAY-003 | As HotPesa, I want provider initiation to use protected server credentials so that browsers and devices never hold secrets. | Only server adapter dispatches; client traffic and UI expose no credentials. | Must | FR-PAY-005 |
| US-PAY-004 | As HotPesa, I want central transition rules so that callbacks, status checks, retries and expiry behave consistently. | Every transition is permitted by the state model; terminal stability and audit apply. | Must | FR-PAY-007/013 |
| US-PRV-001 | As the payment integration, I want to validate callback authenticity so that untrusted messages cannot change state. | Invalid authenticity is rejected; accepted evidence is recorded and correlated. | Must | FR-REC-001/002 |
| US-PRV-002 | As the payment integration, I want to deduplicate events so that one provider event creates at most one business effect. | Duplicate receives safe acknowledgement and audit but no second state/receipt effect. | Must | FR-REC-003/004 |
| US-FIN-001 | As a finance officer, I want to reconcile a pending attempt from provider status so that a missed callback can be repaired safely. | Authorized query is recorded and uses the same transition rules as callback evidence. | Must | FR-REC-007/009 |
| US-FIN-002 | As a finance officer, I want unmatched or mismatched evidence quarantined so that ambiguous money events are investigated rather than silently applied. | Unknown attempt, amount, merchant or currency mismatch does not confirm and creates controlled review evidence. | Must | FR-REC-005/006 |
| US-FIN-003 | As a finance officer, I want a reconciliation case so that ownership, actions, evidence and disposition are accountable. | Case records owner/status/reason; resolution requires rationale and immutable evidence references. | Must | FR-FIN-003/004 |
| US-FIN-004 | As a finance officer, I want late or conflicting evidence routed to review so that no unsafe automatic overwrite occurs. | Conflicting terminal evidence produces review-required unless an approved deterministic rule applies. | Must | FR-PAY-012; FR-REC-010 |
| US-FIN-005 | As a finance officer, I want confirmed and unresolved values separated so that reports do not overstate revenue. | Only confirmed is labelled confirmed fare value; all other states are distinct. | Must | FR-FIN-002; FR-RPT-002/003 |
| US-FIN-006 | As a finance officer, I want controlled exports so that evidence can be analyzed without leaking passenger data. | Bounded filters, approved fields, masking and export audit apply. | Must | FR-RPT-004/005 |

<br>

# 8 Reporting Support Security and Operations Stories

These stories ensure that product truth can be observed, supported and assured without weakening privacy or state authority.

| ID | Actor need and value | Acceptance summary | Priority | FRS source |
| --- | --- | --- | --- | --- |
| US-RPT-001 | As an authorized manager, I want journey summaries by route, vehicle, crew, date and state so that I can review operations. | Filters are tenant/resource scoped and totals reconcile to known data. | Must | FR-RPT-001 |
| US-SUP-001 | As a support agent, I want to search by safe reference so that I can help without requesting a full phone number. | Approved references locate masked timeline; failed searches reveal no unauthorized data. | Must | FR-SUP-001 |
| US-SUP-002 | As a support agent, I want user-facing state and approved guidance so that I give consistent assistance. | Timeline and guidance exclude secrets/raw unrestricted payloads; notes and escalation are audited. | Must | FR-SUP-002/003 |
| US-AUD-002 | As an auditor, I want material actions recorded so that journey, fare, payment and administration decisions are reconstructable. | Append-only event records actor/service, action, resource, outcome, time and correlation. | Must | FR-AUD-001/002 |
| US-SEC-001 | As a tenant, I want isolation across UI, API, search and export so that another operator cannot see or change my data. | Cross-tenant identifier guessing and requests are denied without data leakage. | Must | FR-ADM-009 |
| US-SEC-002 | As a privacy authority, I want personal identifiers and secrets minimized so that operational access does not create unnecessary exposure. | Masked by default; prohibited secrets absent from UI, logs, audit and exports. | Must | FR-COM-008; FR-AUD-003 |
| US-OPS-003 | As operations, I want alerts that distinguish service health, provider failure, pending backlog and review exceptions so that the correct team responds. | Alert category, context and owner are observable without exposing secrets. | Must | FR-NTF-002 |
| US-OPS-004 | As operations, I want bounded retries and dead-letter review so that background failures remain visible and safe. | Retries back off, stop at approved limit and route unresolved work to review. | Must | FR-OFF-007 |
| US-OPS-005 | As operations, I want payment attempts and evidence to survive restart so that service recovery does not lose or regress financial state. | PostgreSQL-backed restart reloads attempts, events and audit without duplication. | Must | FR-OFF-008 |
| US-PAD-002 | As a platform administrator, I want secrets to be write-only or vault-referenced so that privileged UI cannot reveal clear-text credentials. | Stored/retrieved interfaces never return the secret value; rotation/change is audited. | Must | FR-PAD-002 |
| US-PAD-003 | As a security authority, I want emergency access controlled so that exceptional privilege is time-bound and independently reviewable. | Strong authentication, reason, expiry and post-use review apply. | Should | FR-PAD-005 |

# 9 Use Case UC PAX 001 Access Active Journey

| Field | Specification |
| --- | --- |
| Goal | Open and recognize one valid active HotPesa journey before fare or payment action. |
| Primary actor | Passenger. |
| Supporting actors | Conductor host; HotPesa API. |
| Trigger | Passenger scans the vehicle QR code or enters the approved short address. |
| Preconditions | A tenant-owned journey is active and has a valid discovery token; passenger has a supported browser. |
| Success guarantee | Passenger sees authoritative journey context and valid destination choices without creating an account. |
| Minimal guarantee | Invalid access reveals no protected journey or tenant data. |
| Frequency | Many times per active journey. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Passenger | Scans QR or opens short address. |
| 2 | PWA | Submits the journey token without trusting embedded price or operator values. |
| 3 | API | Validates format, signature/reference, tenant, expiry and active journey state. |
| 4 | API | Returns operator, route/direction, sufficient vehicle/journey identity and allowed destinations. |
| 5 | PWA | Displays context and requires the passenger to recognize it before continuing. |
| 6 | Passenger | Selects a valid destination or exits if context is wrong. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Token malformed or unknown | Deny and show safe rescan/ask-conductor guidance. |
| A2 | Journey closed, suspended or expired | Deny new action and explain that the journey is unavailable. |
| A3 | Connectivity unavailable | Show only approved cached context with stale/offline indicator; no payment-success claim. |
| A4 | Destination tampered | Reject server-side and refresh the allowed list. |
| A5 | Unsupported browser | Provide controlled compatibility guidance without exposing internals. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Valid scoped passenger session and recognized journey context. |
| Failure | No payment attempt or sensitive data is created. |
| Audit | Record only approved usage/security evidence with minimized data. |
| Traceability | US-PAX-001 to 003; FR-PAX-001 to 005; PR-PAX-001 to 003. |

# 10 Use Case UC PAY 001 Pay Passenger Fare

| Field | Specification |
| --- | --- |
| Goal | Initiate one fare payment and present an evidence-led outcome without duplicate effect. |
| Primary actor | Passenger. |
| Supporting actors | HotPesa API; M-Pesa/provider; conductor status board. |
| Trigger | Passenger accepts the displayed journey quote and chooses Pay. |
| Preconditions | Active journey; valid destination and fare quote; approved phone input; provider initiation available. |
| Success guarantee | Matched trusted provider success transitions the attempt to confirmed once and produces one safe reference. |
| Minimal guarantee | Last durable state and evidence are preserved; no screenshot, local message or client assertion creates confirmation. |
| Frequency | Once per deliberate passenger fare attempt; retries follow controlled rules. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | PWA | Displays server quote, currency and journey context before enabling Pay. |
| 2 | Passenger | Enters approved Kenyan MSISDN and confirms the action; no M-Pesa PIN is requested. |
| 3 | PWA/API | Submit one request with scoped session, quote reference and idempotency key. |
| 4 | API | Validates context, persists immutable attempt in created and returns safe reference. |
| 5 | Payment service | Moves to initiating and dispatches provider request with server-held credentials. |
| 6 | Provider | Accepts the request and prompts the passenger; attempt becomes pending where appropriate. |
| 7 | Passenger | Authorizes within M-Pesa on the passenger phone. |
| 8 | Provider/API | Trusted event is validated, correlated, deduplicated and matched to amount/merchant/currency. |
| 9 | API | Central state rules transition the attempt to confirmed once and write audit/evidence. |
| 10 | PWA/host | Show confirmed and a minimal receipt/reference; conductor board updates from server truth. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Passenger cancels/provider fails | Trusted failure moves eligible attempt to failed; safe guidance shown. |
| A2 | No callback/timeout | Remain pending or expire under policy; allow controlled status check before retry. |
| A3 | Duplicate submission | Same key/request returns original attempt; changed payload is rejected. |
| A4 | Duplicate callback | Acknowledge; record duplicate audit; no second transition/reference. |
| A5 | Passenger disconnects | Attempt continues server-side; passenger recovers status using scoped reference. |
| A6 | Amount/merchant/currency mismatch | Do not confirm; quarantine or move to review-required. |
| A7 | Late/conflicting evidence | Apply approved deterministic rule or move to review-required. |
| A8 | Journey closes after attempt creation | Preserve attempt and evidence handling; block only new attempts. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | One confirmed attempt, one effective financial state and one passenger reference. |
| Failure | Failed/expired/review-required or last durable nonterminal state remains explicit. |
| Privacy | MSISDN is masked in views/logs; PIN and credentials are never collected. |
| Audit | Request, dispatch, evidence, transition and any duplicate/reconciliation events are chronological. |
| Traceability | US-PAX-004 to 011; US-PAY-001 to 004; FR-PAX-006 to 016; FR-PAY-001 to 016. |

# 11 Use Case UC JRN 001 Start Vehicle Journey

| Field | Specification |
| --- | --- |
| Goal | Create one authoritative active journey and passenger discovery context. |
| Primary actor | Assigned conductor. |
| Supporting actors | SACCO operations; HotPesa API; Android host. |
| Trigger | Conductor selects Start Journey. |
| Preconditions | Authenticated active workforce identity; valid assignment; available vehicle; route/direction and approved fare context. |
| Success guarantee | One tenant-scoped active journey, QR/short address and status board are created. |
| Minimal guarantee | Conflicting, unauthorized or stale setup does not create an active journey. |
| Frequency | At the beginning of each supported vehicle journey. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Conductor | Authenticates and opens assigned work. |
| 2 | API | Returns only permitted vehicle, route, direction and assignment options. |
| 3 | Conductor | Reviews operator, vehicle, route, direction and fare context. |
| 4 | Host/API | Performs required device, assignment, conflict and configuration checks. |
| 5 | Conductor | Confirms Start Journey. |
| 6 | API | Creates unique journey with actor, tenant, vehicle, route, fare source and start time. |
| 7 | API/host | Generates discovery QR/short address and activates the status board. |
| 8 | Host | Displays active context and connectivity state for field verification. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | No active assignment | Deny and direct conductor to operations. |
| A2 | Vehicle already active | Block conflicting journey and show safe existing/context resolution. |
| A3 | Fare missing/stale | Do not activate; require an approved effective fare context. |
| A4 | Weak/no internet | Apply approved degraded-start policy; never imply payment availability when absent. |
| A5 | Low battery/device issue | Warn and apply approved operational fallback; preserve any created durable journey. |
| A6 | Unauthorized tenant/resource | Deny, reveal minimal information and audit material attempt. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Unique active journey, discovery tokens and board exist. |
| Failure | No conflicting active journey is created. |
| Audit | Start actor, assignment, context, time and outcome are recorded. |
| Traceability | US-CON-001 to 003; FR-JRN-001 to 005; FR-ADM-003. |

# 12 Use Case UC JRN 002 Close Vehicle Journey

| Field | Specification |
| --- | --- |
| Goal | Stop new passenger activity and preserve a complete journey summary and unresolved evidence. |
| Primary actor | Assigned conductor or authorized operations role. |
| Supporting actors | HotPesa API; finance/reconciliation service. |
| Trigger | Authorized actor requests journey closure. |
| Preconditions | Journey is active or suspended; actor has closure permission. |
| Success guarantee | New attempts stop, existing attempt evidence remains processable, and a state-separated summary is retained. |
| Minimal guarantee | A failed/partial close does not fabricate totals or discard unresolved attempts. |
| Frequency | At the end of each supported journey or authorized exceptional closure. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Actor | Requests Close Journey. |
| 2 | API | Validates actor, assignment/override permission and current state. |
| 3 | API | Moves journey to closing and rejects new payment attempts. |
| 4 | API/worker | Obtains current durable states and runs only approved status checks. |
| 5 | Host | Displays totals by state and unresolved items. |
| 6 | Actor | Records required exception reason/operational notes without altering provider evidence. |
| 7 | Actor | Confirms closure. |
| 8 | API | Persists closed state, summary, actor, time and audit; unresolved items remain queued/reviewable. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Pending attempts remain | Allow closure only with approved exception rule and preserve reconciliation access. |
| A2 | Connectivity lost | Use approved pending-synchronization behavior; do not fabricate settled totals. |
| A3 | Unauthorized override | Deny and audit. |
| A4 | Late evidence after close | Process evidence against existing attempt using normal transition rules; journey remains closed. |
| A5 | Concurrent close | Return the same durable closed/closing outcome without duplicate effect. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Closed journey and immutable state-separated summary. |
| Financial | Only confirmed attempts count as confirmed digital fare value. |
| Audit | Closure, exceptions and subsequent evidence remain traceable. |
| Traceability | US-CON-008/009; FR-JRN-009 to 011; FR-RPT-001 to 003. |

# 13 Use Case UC FAR 001 Publish Fare Version

| Field | Specification |
| --- | --- |
| Goal | Create, approve and activate an attributable fare version. |
| Primary actor | Authorized fare creator and fare approver. |
| Supporting actors | SACCO operations; HotPesa API; audit service. |
| Trigger | Creator submits a draft fare version for approval. |
| Preconditions | Tenant, route, direction and stages exist; actors have permitted roles. |
| Success guarantee | One valid approved version becomes authoritative at its effective time and history remains available. |
| Minimal guarantee | Invalid or conflicting fare does not become active and existing attempts remain unchanged. |
| Frequency | Whenever the operator changes supported fares. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Creator | Defines route, direction, stage/destination, amount, currency, effective period and reason. |
| 2 | API | Validates tenant ownership, required fields, amount, currency, dates and prohibited overlap. |
| 3 | Creator | Submits the draft for approval. |
| 4 | Approver | Reviews the complete proposed version and conflict information. |
| 5 | Approver | Approves or rejects with a reason. |
| 6 | API | Records decision and schedules/activates the version at server-effective time. |
| 7 | API | Uses the active version for new quotes; historical attempts retain their original version. |
| 8 | Audit service | Records create, submit, approve/reject and activate actions. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Invalid amount/currency/date | Reject with authorized field errors; remain draft. |
| A2 | Overlapping rule | Block activation and show the authorized conflict context. |
| A3 | Creator lacks approval role | Prevent self-approval where separation is configured. |
| A4 | Emergency/temporary fare | Require approved reason, expiry and authority. |
| A5 | Fare changes during active attempt | Attempt retains original quote, amount, currency and version. |
| A6 | Withdrawal/supersession | Stop new quotes at effective time; preserve audit/history. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Approved active/scheduled fare version and complete history. |
| Failure | No unauthorized or ambiguous fare becomes active. |
| Audit | Actor, reason, decision and effective time are retained. |
| Traceability | US-FAR-001 to 004; FR-FAR-001 to 010. |

# 14 Use Case UC PRV 001 Process Provider Evidence

| Field | Specification |
| --- | --- |
| Goal | Accept, validate, deduplicate and apply trusted provider callback evidence safely. |
| Primary actor | M-Pesa/payment provider. |
| Supporting actors | Callback endpoint; payment service; audit/reconciliation services. |
| Trigger | Provider sends an asynchronous event. |
| Preconditions | Callback endpoint and provider configuration are active; authenticity rule is configured. |
| Success guarantee | A valid matched event is recorded once and may create one permitted state transition. |
| Minimal guarantee | Invalid, duplicate, unmatched or mismatched evidence cannot create an unsafe financial effect. |
| Frequency | Zero or more events per provider transaction, including duplicates. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Provider | Sends event with provider identity, correlation, result and transaction fields. |
| 2 | Callback endpoint | Validates transport/authenticity control and parses required fields. |
| 3 | Evidence service | Creates provider-event receipt with received time and validation outcome. |
| 4 | Evidence service | Checks stable event identity/deduplication rule before business effect. |
| 5 | Payment service | Correlates tenant/merchant/attempt and compares amount, currency and result. |
| 6 | Payment service | Applies the central state transition rule atomically with evidence/audit effect. |
| 7 | Callback endpoint | Returns a safe provider acknowledgement. |
| 8 | Views/workers | Expose the updated safe state and any review case. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Authenticity fails | Reject; record approved security evidence; do not transition. |
| A2 | Duplicate event | Acknowledge safely; record duplicate audit; no repeated state/reference effect. |
| A3 | Unknown attempt | Quarantine for investigation; do not create an attempt. |
| A4 | Amount/currency/merchant mismatch | Do not confirm; route to review-required/quarantine. |
| A5 | Malformed/uninterpretable result | Reject/quarantine with safe operational alert. |
| A6 | Late/conflicting terminal result | Preserve both events; apply approved conflict rule or review-required. |
| A7 | Persistence failure | Do not claim processing success unless durable receipt/effect policy is satisfied; provider retry remains safe. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Durable provider receipt, one permitted state effect and audit timeline. |
| Duplicate | Every received event remains traceable while business effect remains one. |
| Privacy | Normalized/redacted evidence appears in ordinary views; secrets/raw payloads remain controlled. |
| Traceability | US-PRV-001/002; FR-REC-001 to 006 and 011; FR-PAY-009 to 014. |

# 15 Use Case UC REC 001 Reconcile Missing Callback

| Field | Specification |
| --- | --- |
| Goal | Resolve a pending/unknown attempt using trusted provider status evidence. |
| Primary actor | Authorized finance user or automated reconciliation worker. |
| Supporting actors | Payment provider; payment service; audit/review services. |
| Trigger | Missing callback, pending age threshold, manual status request or scheduled job. |
| Preconditions | Known attempt in an eligible state; actor/job authorized; provider status service available. |
| Success guarantee | Trusted status evidence applies through the same central transition rules as a callback. |
| Minimal guarantee | Unknown/failed provider query preserves last durable state and schedules only bounded retry. |
| Frequency | As required for missing or delayed provider evidence. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Actor/worker | Selects eligible attempt and starts a status query with correlation reference. |
| 2 | API | Validates authorization, state eligibility and retry policy. |
| 3 | Adapter | Queries provider using protected credentials and immutable correlation fields. |
| 4 | Evidence service | Stores normalized status evidence and validation outcome. |
| 5 | Payment service | Matches provider result and applies the central transition rule. |
| 6 | API | Writes reconciliation event, attempt timeline and any review case. |
| 7 | Views | Display updated confirmed/failed/pending/review-required state. |
| 8 | Worker | Stops, retries with backoff or dead-letters according to approved limit. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Provider still pending/unknown | Keep pending or apply expiry policy; do not confirm. |
| A2 | Provider unavailable | Preserve state; bounded retry; alert after threshold. |
| A3 | Mismatched evidence | Move to controlled review/quarantine; no confirmation. |
| A4 | Duplicate status result | No additional state/reference effect; retain evidence event. |
| A5 | Unauthorized manual request | Deny and audit material attempt. |
| A6 | Retry limit reached | Create/retain review queue item and operational alert. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Attempt state is consistent with trusted status evidence and fully audited. |
| Unresolved | Explicit pending/expired/review-required outcome remains owned. |
| Idempotency | Repeated reconciliation cannot create duplicate financial effect. |
| Traceability | US-FIN-001/002; FR-REC-007 to 012; FR-OFF-007. |

# 16 Use Case UC REC 002 Resolve Conflicting Evidence

| Field | Specification |
| --- | --- |
| Goal | Investigate and disposition late, mismatched or conflicting trusted evidence without rewriting the original record. |
| Primary actor | Authorized finance/reconciliation reviewer. |
| Supporting actors | Support; platform operations; payment provider where escalation is required. |
| Trigger | Attempt enters review-required or unmatched/mismatch queue. |
| Preconditions | Review case exists with immutable attempt and provider evidence references; reviewer has purpose-based access. |
| Success guarantee | Disposition, rationale, actor and evidence remain auditable; effective outcome follows approved policy. |
| Minimal guarantee | Reviewer cannot edit raw provider evidence or invent a provider success. |
| Frequency | Exception-driven. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Reviewer | Opens assigned case from the controlled queue. |
| 2 | System | Displays masked attempt timeline, relevant normalized evidence and mismatch category. |
| 3 | Reviewer | Compares immutable identifiers, amount, currency, merchant and provider result. |
| 4 | Reviewer | Requests additional approved evidence or escalation where needed. |
| 5 | Reviewer | Selects an allowed disposition and records rationale/supporting reference. |
| 6 | System | Validates role, separation-of-duty and allowed transition/disposition. |
| 7 | System | Writes case resolution and audit without changing raw evidence. |
| 8 | System | Updates authorized views and any follow-up owner. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Evidence insufficient | Keep/escalate case; do not resolve as confirmed. |
| A2 | Reviewer lacks authority/conflict of interest | Deny resolution and reassign/escalate. |
| A3 | Confirmed followed by failure/expiry | Preserve confirmed unless approved conflict policy dictates review; never silently overwrite. |
| A4 | Late success after expiry/failure | Confirm only if approved deterministic trusted rule permits; otherwise remain review-required. |
| A5 | Unmatched event later correlated | Apply normal evidence rules and retain the original quarantine history. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Controlled disposition with owner, rationale and evidence references. |
| Evidence | Original attempt and every provider event remain immutable and chronological. |
| Financial | Reports use only the approved effective state and keep review history visible. |
| Traceability | US-FIN-003/004; FR-PAY-012/016; FR-REC-005/006/010. |

# 17 Use Case UC ADM 001 Manage Workforce Access

| Field | Specification |
| --- | --- |
| Goal | Provision, change, suspend and review tenant workforce access under least privilege. |
| Primary actor | Tenant administrator. |
| Supporting actors | Managed identity service; HotPesa authorization and audit services. |
| Trigger | Approved workforce onboarding, role change, suspension or access review. |
| Preconditions | Administrator is strongly authenticated and tenant-scoped; target person and requested role are valid. |
| Success guarantee | User receives only permitted tenant roles and resource context with complete audit. |
| Minimal guarantee | Unauthorized/self-escalating/cross-tenant change is denied and no access is granted. |
| Frequency | Workforce lifecycle and periodic review. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Administrator | Finds or invites the target through the approved identity workflow. |
| 2 | System | Displays roles the administrator is permitted to assign. |
| 3 | Administrator | Selects role/resource scope and records required reason/effective period. |
| 4 | System | Validates tenant membership, assignment authority and prohibited combinations. |
| 5 | Second approver | Approves high-risk change where configured. |
| 6 | System | Applies role/context authorization and records before/after values. |
| 7 | System | Notifies approved parties and audits the action. |
| 8 | Administrator/auditor | Verifies current access in the scoped access review. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Self-escalation or protected role | Deny or require independent approval. |
| A2 | Cross-tenant target/resource | Deny without revealing protected data. |
| A3 | Suspension | Prevent new sessions and revoke active access per approved policy. |
| A4 | Identity provider unavailable | Do not grant provisional privileged access; use approved recovery process. |
| A5 | Emergency access | Require strong authentication, reason, expiry and independent review. |
| A6 | Conflicting roles | Block or route to approved separation-of-duty review. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Controlled role/resource scope and auditable workforce access. |
| Suspension | New access blocked and sessions handled by approved revocation policy. |
| Audit | Requester, approver, target, before/after, reason, time and outcome retained. |
| Traceability | US-TAD-001/002; US-PAD-001/003; FR-ADM-004 to 006; FR-PAD-001/005. |

# 18 Use Case UC RPT 001 Generate Controlled Report

| Field | Specification |
| --- | --- |
| Goal | Produce a tenant-scoped operational or financial report with truthful state separation and controlled export. |
| Primary actor | Owner/manager, finance officer, operations or auditor according to role. |
| Supporting actors | Reporting service; authorization and audit services. |
| Trigger | Authorized user selects report and filters. |
| Preconditions | Authenticated role; tenant/resource scope; bounded date/filter request. |
| Success guarantee | Report reconciles to durable records and labels confirmed versus unresolved values accurately. |
| Minimal guarantee | Unauthorized or over-broad request returns no protected data. |
| Frequency | Operational, daily, periodic and audit reporting. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | User | Chooses report type and permitted filters such as date, route, vehicle, crew and state. |
| 2 | System | Validates role, tenant/resource scope and bounded query policy. |
| 3 | Reporting service | Reads durable journey/payment records and applies controlled state definitions. |
| 4 | System | Displays confirmed amount and each unresolved/terminal category separately. |
| 5 | User | Reviews results and requests export if permitted. |
| 6 | System | Applies approved columns, masking and row limits. |
| 7 | System | Generates file with filter context and generation time. |
| 8 | Audit service | Records report/export actor, scope, time and outcome. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | No data | Show a clear empty state, not an error or zero-confirmation ambiguity. |
| A2 | Cross-tenant/resource request | Deny and return no unauthorized records. |
| A3 | Query too broad | Require narrower filters or approved asynchronous process. |
| A4 | Sensitive field not permitted | Omit/mask field; do not silently elevate access. |
| A5 | Generation fails | Show correlation reference and preserve no partial misleading report. |
| A6 | Data changes during generation | Use a consistent snapshot or disclose controlled as-of semantics. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Scoped, reproducible, state-separated view/export. |
| Privacy | Passenger identifiers minimized and masked by default. |
| Audit | Report and export context remains traceable. |
| Traceability | US-RPT-001; US-FIN-005/006; FR-RPT-001 to 005; FR-AUD-004. |

# 19 Use Case UC OFF 001 Recover After Connectivity Loss

| Field | Specification |
| --- | --- |
| Goal | Continue safe field operation and restore server truth after connection or process restart. |
| Primary actor | Conductor; passenger for status recovery. |
| Supporting actors | Host/PWA; API; synchronization worker; PostgreSQL/Redis services. |
| Trigger | Network loss, host restart, browser reconnect or API restart. |
| Preconditions | A journey or attempt existed before disruption; approved cache/durable records are available. |
| Success guarantee | Current server/durable state is restored without duplicate journey, event or financial effect. |
| Minimal guarantee | The UI never represents cached or queued information as confirmed payment. |
| Frequency | Expected under variable Kenyan mobile-network and field conditions. |

## Main Success Flow

| Step | Actor or system | Required interaction and result |
| --- | --- | --- |
| 1 | Client | Detects loss/restart and displays offline/reconnecting state. |
| 2 | Client | Shows only approved cached journey/fare data with stale indicator. |
| 3 | Client | Queues only permitted nonfinancial operational events with unique identity. |
| 4 | Connectivity | Returns and client authenticates/revalidates current journey/session. |
| 5 | API | Returns durable journey, attempts, provider evidence-derived states and audit references. |
| 6 | Sync worker | Submits queued events idempotently with bounded retry. |
| 7 | System | Detects conflicts; auto-resolves only approved safe cases and routes material conflicts to review. |
| 8 | Client | Displays restored truth and clears only safely synchronized cache/queue entries. |

## Alternate Exception and Failure Flows

| Ref | Condition | Required behavior |
| --- | --- | --- |
| A1 | Journey closed while offline | Do not resume new attempts; show closed state and preserve existing attempt lookup. |
| A2 | Queued duplicate | Return original outcome; no repeated effect. |
| A3 | Financial conflict | Preserve both facts and route to review; never last-write-wins silently. |
| A4 | Retry exhausted | Move to dead-letter/review and alert operations. |
| A5 | Cache expired/invalid | Discard and require fresh server context. |
| A6 | Database/API restart | Reload durable attempt/event/audit records without regression. |

## Postconditions and Traceability

| Item | Controlled outcome |
| --- | --- |
| Success | Restored authoritative state and synchronized permitted events. |
| Failure | Explicit offline/dead-letter/review outcome with no false settlement. |
| Data | Cache and queue obey approved field, expiry and deletion rules. |
| Traceability | US-CON-006/007; US-PAX-010/013; US-OPS-004/005; FR-OFF-001 to 010. |

<br>

# 20 Journey State and Experience Coverage

| Surface | Loading | Empty | Error | Permission | Offline or recovery |
| --- | --- | --- | --- | --- | --- |
| Passenger journey | Journey context skeleton/text. | No active journey or no valid destinations. | Invalid/expired/closed link with recovery. | Scoped public flow; no workforce functions. | Approved cached context with stale indicator; no settlement claim. |
| Passenger payment | Creating/checking status. | No attempt yet. | Failed/expired/review-required with safe action. | Cannot submit provider evidence or alter fare/state. | Current durable state recovered; initiation/status limitation explicit. |
| Conductor host | Restoring assignment/journey/board. | No assignment or no attempts yet. | Conflict, stale fare or provider alert. | Assignment/tenant action denied. | Active context cached; nonfinancial events queued; server truth restored. |
| Finance/reconciliation | Loading attempt/evidence timeline. | No cases for filters. | Provider query, mismatch or resolution failure. | Purpose/role/separation denial. | Read-only last synchronized data or unavailable; no local resolution. |
| Reports | Generating scoped dataset/export. | No records in selected period. | Generation/export failure with correlation. | Tenant/resource/export denied. | Last synchronized indicator where approved. |
| Administration | Loading users/fleet/fares/config. | No configured items. | Validation, conflict or approval failure. | Role/tenant/dual-control denial. | Read-only/unavailable unless an approved safe queue exists. |

## 20.1 Payment Status Experience Rules

| State | Passenger wording intent | Conductor/operations meaning | Allowed next action |
| --- | --- | --- | --- |
| created | Request recorded; preparation underway. | Durable attempt exists; provider dispatch not yet complete. | Wait/refresh; controlled cancellation only if later approved. |
| initiating | M-Pesa request is being sent; not paid. | Dispatch in progress. | Wait; no duplicate submission. |
| pending | Waiting for trusted confirmation; not paid. | No accepted terminal evidence. | Safe status refresh/reconciliation; retry only by policy. |
| confirmed | Payment confirmed from trusted provider evidence. | Count as confirmed digital fare value once. | Show minimal reference; no ordinary overwrite. |
| failed | Provider or controlled initiation failure. | Not confirmed revenue. | Show safe reason and approved retry path. |
| expired | Confirmation window ended without accepted success. | Not confirmed; late evidence remains processable. | Status/review or approved new attempt. |
| review-required | Trusted evidence is late, mismatched or conflicting. | Owned exception; not ordinary confirmed revenue. | Controlled finance review; no manual invention of success. |

# 21 Acceptance Test Portfolio

| Test ID | Journey | Required evidence | Primary stories/use cases |
| --- | --- | --- | --- |
| AT-001 | Valid passenger journey access | Browser/API test for valid, invalid, expired and closed tokens. | US-PAX-001/002; UC-PAX-001 |
| AT-002 | Fare quote integrity | Tampered destination/price test and mid-attempt fare-change retention. | US-PAX-003/004; US-FAR-003 |
| AT-003 | Successful provider confirmation | Live local servers with matched trusted evidence and one receipt/reference. | US-PAX-008/011; UC-PAY-001 |
| AT-004 | Provider-declared failure | Failure evidence produces failed and no confirmed-revenue effect. | US-PAX-009; UC-PAY-001 |
| AT-005 | Duplicate callback | Two identical events, one business effect, duplicate audit. | US-CON-005; UC-PRV-001 |
| AT-006 | Missing callback reconciliation | Pending attempt repaired only by trusted status evidence. | US-FIN-001; UC-REC-001 |
| AT-007 | Conflicting/late evidence | Review-required and immutable evidence timeline. | US-FIN-004; UC-REC-002 |
| AT-008 | Idempotent initiation | Same key/request returns original; changed payload rejected. | US-PAX-006; US-PAY-002 |
| AT-009 | Tenant isolation | Cross-tenant API, search and export requests denied. | US-SEC-001; UC-ADM-001/RPT-001 |
| AT-010 | Restart durability | PostgreSQL-backed attempt, evidence and audit reload unchanged. | US-OPS-005; UC-OFF-001 |
| AT-011 | Offline honesty | Cached journey may display; payment is never confirmed offline. | US-CON-007; US-PAX-013 |
| AT-012 | Journey closure | New attempts stop; unresolved states remain reconcilable. | US-CON-008; UC-JRN-002 |
| AT-013 | Fare approval/history | Invalid/overlap blocked; approved version effective; history preserved. | US-FAR-001 to 003; UC-FAR-001 |
| AT-014 | Accessibility | Keyboard, focus, 390px layout, reduced motion and status announcements pass. | US-PAX-012 |
| AT-015 | Redaction and secret absence | UI/log/export scan finds no full phone, PIN, token or provider secret. | US-SEC-002; US-SUP-001 |
| AT-016 | Report truth | Mixed states aggregate separately; only confirmed labelled confirmed revenue. | US-FIN-005; UC-RPT-001 |

## 21.1 Definition of Done

Linked FRS requirements and acceptance criteria pass in automated or approved manual evidence.

Positive, negative, unauthorized and material exception paths are tested.

Accessibility and responsive behavior are verified for affected user interfaces.

No prohibited secret, full phone value or raw unrestricted provider payload appears in UI, logs or exports.

Traceability is updated from story/use case to implementation task, test and result.

Product Owner accepts the story and unresolved decisions are not silently assumed.

# 22 Requirements Traceability

| Story range | FRS source | PRD source | BRD source |
| --- | --- | --- | --- |
| US-PAX-* | FR-PAX-001 to 016; FR-COM-007/008; FR-OFF-001 to 003 | PR-PAX-001 to 010; PR-SEC-004 | BR-PAX-001 to 006; BR-GOV-001/002 |
| US-CON/DRV/CRW-* | FR-JRN-001 to 012; FR-CRW-001 to 006 | PR-JRN-001 to 008 | BR-JRN-001 to 004; BR-OPS-001 to 005 |
| US-FAR-* | FR-FAR-001 to 010 | PR-FAR-001 to 006 | BR-FAR-001 to 004 |
| US-OPS/TAD/OWN/PAD/AUD-* | FR-ADM-001 to 010; FR-PAD-001 to 005; FR-AUD-001 to 004 | PR-ADM-001 to 005; PR-SEC-001 to 005 | BR-ADM-001 to 005; BR-GOV-001 to 006 |
| US-PAY/PRV-* | FR-PAY-001 to 016; FR-REC-001 to 006 and 011 | PR-PAY-001 to 010 | BR-PAY-001 to 010 |
| US-FIN-* | FR-REC-005 to 012; FR-FIN-001 to 004; FR-RPT-002 to 005 | PR-PAY-007 to 009; PR-RPT-001/002 | BR-PAY-007 to 009; BR-RPT-001 to 004 |
| US-RPT/SUP/SEC-* | FR-RPT-001 to 005; FR-SUP-001 to 003; FR-COM-004/008 | PR-RPT-001 to 003; PR-SEC-001 to 005 | BR-RPT-001 to 004; BR-GOV-001 to 006 |
| US-OPS-004/005 and offline stories | FR-OFF-001 to 010 | PR-JRN-006; PR-PAY-002/005/007/008 | BR-OPS-005; BR-PAY-005 to 009 |

## 22.1 Use Case Coverage

| Use case | Critical behavior covered | Primary acceptance tests |
| --- | --- | --- |
| UC-PAX-001 | Journey discovery, validation and recognition. | AT-001, AT-002 |
| UC-PAY-001 | Quote, idempotent initiation, provider truth, seven states and reference. | AT-002 to AT-008, AT-014/015 |
| UC-JRN-001/002 | Assignment, active journey, discovery, status board and safe closure. | AT-011/012 |
| UC-FAR-001 | Versioned fare create/approve/activate/history. | AT-002, AT-013 |
| UC-PRV-001 | Callback authenticity, evidence receipt, deduplication and transition. | AT-003 to AT-007 |
| UC-REC-001/002 | Status repair, bounded retry, mismatch/conflict review. | AT-006/007 |
| UC-ADM-001 | Provisioning, suspension, least privilege and tenant boundaries. | AT-009, AT-015 |
| UC-RPT-001 | Scoped reporting, truthful aggregation, masking and export audit. | AT-009, AT-015/016 |
| UC-OFF-001 | Offline honesty, idempotent sync, restart durability and conflict review. | AT-010/011 |

## 22.2 Traceability Control Rule

Every backlog task, API operation, UI flow and test shall cite its user story or use case and at least one FRS identifier. A story is not complete when only its happy path passes. Superseded stories retain history, and their identifiers must not be reassigned.

# 23 Open Decisions Assumptions and Dependencies

## 23.1 Open Decision Register

| ID | Decision required | Owner | Due gate | Status |
| --- | --- | --- | --- | --- |
| OD-USUC-001 | Pilot operator/SACCO, routes, vehicles, crew model and field workflow. | Founder/Pilot Sponsor | Before sprint/pilot | Open |
| OD-USUC-002 | Live M-Pesa product, merchant/settlement arrangement and provider contract. | Commercial/Finance/Provider | Before live adapter | Open |
| OD-USUC-003 | Callback authenticity, stable event keys and status-query contract. | Security/Engineering/Provider | Before adapter approval | Open |
| OD-USUC-004 | Expiry window, retry limits and late/conflicting evidence disposition. | Product/Finance/Operations | Before acceptance freeze | Open |
| OD-USUC-005 | Fare creator/approver roles and dual-control rule. | Pilot SACCO/Product | Before fare workflow | Open |
| OD-USUC-006 | Workforce identity provider, MFA and session-revocation policy. | Security/Engineering | Before identity build | Open |
| OD-USUC-007 | English/Kiswahili content and pilot accessibility/device matrix. | Product/UX/Pilot | Before UX freeze | Open |
| OD-USUC-008 | Offline start/close fallback, device ownership and hotspot support. | Operations/Pilot | Before field test | Open |
| OD-USUC-009 | Retention, deletion, dispute hold, raw evidence and export-field policy. | Legal/Privacy/Finance/Security | Before production data approval | Open |
| OD-USUC-010 | Refund/reversal inclusion and separation-of-duty flow. | Finance/Legal/Product | Phase 2 or before inclusion | Open |

## 23.2 Assumptions

| ID | Planning assumption | Validation | Status |
| --- | --- | --- | --- |
| A-USUC-001 | Passenger has a supported browser and approved connection path but does not need a HotPesa account. | Device/network pilot. | Open |
| A-USUC-002 | Provider supports server initiation and callback and/or status evidence. | Provider technical validation. | Open |
| A-USUC-003 | Pilot fares fit versioned route/direction/stage rules without dynamic pricing. | Operator workshop. | Partly proven |
| A-USUC-004 | Operator can assign accountable workforce roles and maintain core fleet/route data. | Pilot readiness review. | Open |
| A-USUC-005 | HotPesa remains non-custodial; direct merchant settlement follows the approved arrangement. | Commercial/legal confirmation. | Baseline pending approval |
| A-USUC-006 | Phase 0 mock behavior is the reference for seven-state semantics and duplicate/reconciliation scenarios. | Product/engineering review. | Proven locally |

## 23.3 Dependencies

| Dependency | Why required | Failure impact |
| --- | --- | --- |
| Approved BRD PRD and FRS | Authorizes business, product and functional behavior. | Stories cannot become approved implementation baseline. |
| Pilot operator/SACCO | Supplies field workflow, routes, fares, devices and user representatives. | Usability and operational acceptance remain unvalidated. |
| M-Pesa/provider access | Supplies sandbox/live contracts and evidence semantics. | Only mock use cases can be proven. |
| Identity and authorization design | Supplies workforce session and privilege controls. | Administrative use cases cannot reach production acceptance. |
| Data/API and architecture specifications | Define exact persistence, schemas and integration contracts. | Implementation may diverge from acceptance behavior. |
| UI/UX specification and field testing | Defines interface, content, accessibility and target-device evidence. | Passenger/conductor stories cannot be fully accepted. |
| Security privacy and NFR specification | Defines quantitative, retention and protection controls. | Production release evidence remains incomplete. |
| Automated test and CI/CD evidence | Continuously proves story and use-case behavior. | Regression and release confidence are insufficient. |

<br>

# 24 Approval and Sign Off

Approval confirms that the story catalogue, MVP priorities, acceptance criteria, use-case flows, exception behavior and traceability are suitable for controlled backlog implementation. It does not authorize live M-Pesa processing, production credentials, public deployment or commercial release without the separate legal, security, privacy, provider, operational and release gates.

| Role | Name | Decision | Signature | Date |
| --- | --- | --- | --- | --- |
| Project Sponsor |  | Approve / Conditional / Reject |  |  |
| Product Owner |  | Approve / Conditional / Reject |  |  |
| Pilot Operator/SACCO Representative |  | Approve / Conditional / Reject |  |  |
| Passenger/Field User Representative |  | Approve / Conditional / Reject |  |  |
| Engineering Authority |  | Approve / Conditional / Reject |  |  |
| Quality Assurance Authority |  | Approve / Conditional / Reject |  |  |
| Security/Privacy Authority |  | Approve / Conditional / Reject |  |  |
| Finance/Operations Authority |  | Approve / Conditional / Reject |  |  |

## 24.1 Approval Conditions

| Condition | Status |
| --- | --- |
| BRD, PRD and FRS approved or conditionally approved with recorded impacts. | Pending |
| Must-story MVP scope and priorities accepted. | Pending |
| Open decisions assigned with accountable owners and due gates. | Pending |
| Payment state wording, evidence authority and exception ownership accepted. | Pending |
| Passenger, conductor, finance and administration workflows reviewed by representatives. | Pending |
| Acceptance test portfolio and traceability ownership accepted. | Pending |
| Security, privacy, legal, provider and operational controls approved for implementation gate. | Pending |

# 25 Final USUC Readiness Checklist

| Readiness item | Status |
| --- | --- |
| Purpose, scope, story method and release boundary are explicit. | Complete |
| All primary actors have prioritized stories. | Complete |
| Stories link to functional requirements. | Complete |
| Passenger, journey, fare, payment, reconciliation, administration and reporting value are covered. | Complete |
| Critical cross-system journeys have fully dressed use cases. | Complete |
| Normal, alternate, error, offline, unauthorized and restart paths are covered. | Complete |
| Seven payment states and success authority align to the FRS and Phase 0 proof. | Complete |
| Acceptance test portfolio includes positive, negative, privacy, accessibility and durability evidence. | Complete |
| BRD-PRD-FRS-USUC traceability is summarized. | Complete |
| Open product, provider, pilot, legal and operational decisions are recorded. | Complete |
| Stakeholder review and signatures obtained. | Pending |
| Data/API, architecture, flow, UI/UX, security/NFR and implementation documents synchronized. | Pending |
| Live-provider and production release authorization granted. | Not authorized |

## 25.1 Completion Statement

This USUC is structurally complete as a professional delivery baseline for stakeholder review, backlog decomposition and controlled MVP planning. It aligns with the regenerated HotPesa BRD, PRD and FRS and with the locally proven Phase 0 payment semantics. It becomes an approved backlog authority only after the approval conditions and decision register are resolved or formally accepted with recorded conditions. Live M-Pesa, production credentials and public release remain outside this document’s authority.
