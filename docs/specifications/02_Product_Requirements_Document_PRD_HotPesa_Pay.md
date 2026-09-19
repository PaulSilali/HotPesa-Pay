---
document_id: "02"
title: "Product Requirements Document"
project: "HotPesa Pay"
source_docx: "docs/controlled-documents/02_Product Requirements Document (PRD)_HotPesa Pay.docx"
source_version: "1.0"
source_status: "Draft for stakeholder review and approval"
synchronization_date: "2026-09-19"
source_sha256: "0475d53d16ec9518b26d138374471d39d2a169c90a17cdd3de4298ef38908329"
---

> Controlled source: [02_Product Requirements Document (PRD)_HotPesa Pay.docx](../controlled-documents/02_Product%20Requirements%20Document%20(PRD)_HotPesa%20Pay.docx)

> The DOCX source is authoritative. This Markdown copy preserves its controlled status and does not confer approval.

DOCUMENT 02

Product Requirements Document

HotPesa Pay

<br>

Product outcomes, users, capabilities, release boundaries and acceptance conditions

<br><br>

| Control | Value |
| --- | --- |
| Project | HotPesa Pay |
| Document | Product Requirements Document |
| Version | 1.0 |
| Status | Draft for stakeholder review and approval |
| Lifecycle stage | Product baseline following BRD |
| Primary market | Kenya |
| Classification | Confidential - project planning |

<br>

### Governing question

What product must HotPesa deliver, for whom, in which release, and how will stakeholders know it is acceptable?

<br>

# Document Control

| Field | Controlled value |
| --- | --- |
| Document owner | Product Owner, supported by Business Analysis, UX and Engineering |
| Business authority | Approved HotPesa BRD Version 1.0, subject to its approval conditions |
| Reviewers | Founder; pilot operator/SACCO; product; engineering; UX; security; finance; operations; legal/compliance |
| Approval authority | Project Steering Committee or designated sponsor - decision required |
| Authoritative inputs | HotPesa BRD Version 1.0; existing HotPesa PRD; Phase 0 proof evidence; controlled product decisions and payment boundaries |
| Reference use | Mpanga PRD used for structural completeness only; Mpanga product content is not applicable to HotPesa. |
| Downstream authority | The approved PRD governs FRS, stories/use cases, architecture, data/API, application flow, UI/UX, security/NFR, implementation and tests. |
| Change control | Material product-scope, payment, user, data or acceptance changes require impact analysis, traceability update and approval. |
| Next review | Before MVP implementation authorization and after pilot-scope decisions are resolved. |

## Document Status and Interpretation

This PRD translates the HotPesa business requirements into a controlled product definition. Approved Baseline identifies the intended MVP direction. Proposed, Assumption, Validation Required and Decision Required items remain non-binding until evidence and authority are recorded. Phase 0 mock and sandbox results demonstrate product behavior but do not authorize live payment processing or production release.

## Version History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 0.1 | 18 September 2026 | Draft | Initial concise product capability baseline. |
| 1.0 | 19 September 2026 | Draft for approval | Expanded 24-section PRD synchronized to the regenerated BRD and Phase 0 product evidence. |

## Table of Contents

| Section | Purpose |
| --- | --- |
| 1 Product Overview | Product identity and model |
| 2 Product Vision | Product direction and positioning |
| 3 Product Problem Statement | Problems the product must solve |
| 4 Target Users and Personas | Users, context and access |
| 5 User Needs and Pain Points | Needs and barriers |
| 6 Product Objectives | Measurable product outcomes |
| 7 Product Principles | Experience and decision principles |
| 8 Product Scope | Release boundaries |
| 9 Core Features | User-visible product features |
| 10 Core Capabilities | Grouped product abilities |
| 11 Detailed Feature Catalogue | Numbered product requirements |
| 12 Minimum Viable Product | Required launch product |
| 13 Future Enhancements | Post-MVP direction |
| 14 In Scope Features | Included features |
| 15 Out of Scope Features | Explicit exclusions |
| 16 Product Assumptions | Planning assumptions |
| 17 Product Dependencies | Required external/internal support |
| 18 Product Constraints | Binding limitations |
| 19 Success Metrics | Product measures |
| 20 Product Acceptance Criteria | Testable acceptance boundary |
| 21 Approval and Sign Off | Approval conditions |
| 22 Requirement Traceability Summary | BRD and downstream linkage |
| 23 Open Decisions and Clarification Register | Unresolved product decisions |
| 24 Final PRD Readiness Checklist | Completion gate |

# 1 Product Overview

## 1.1 Product Name and Type

HotPesa Pay is a Kenyan public-transport fare orchestration and verification product comprising an Android conductor host, an accountless passenger progressive web application, an authoritative backend service, an operator administration interface, payment-provider integration and audit/reconciliation capabilities.

## 1.2 Product Summary

During an active journey, the conductor host provides a vehicle-local access experience. A passenger scans a QR code or opens a short address, confirms the intended operator, vehicle or journey context, reviews the approved fare and initiates an M-Pesa payment on the passenger’s own phone. The product displays created, initiating, pending, confirmed, failed, expired or review-required status based on server-held state. Only accepted provider evidence may confirm payment.

HotPesa does not hold passenger funds, provide stored value, replace M-Pesa or treat local connectivity as settlement. The intended merchant receives settlement directly under the approved provider arrangement. Owners, SACCOs and authorized operations/finance users receive controlled journey, fare, payment, exception and audit information.

## 1.3 Core Product Model

| Product element | Role | Source of truth |
| --- | --- | --- |
| Operator tenant | Owns configured vehicles, routes, fares, users and reports. | Approved operator configuration. |
| Vehicle and journey | Defines the active transport context and session. | HotPesa API under authorized workforce action. |
| Fare version | Defines the approved amount for route/direction/stage and effective period. | Controlled fare catalogue. |
| Passenger session | Provides scoped accountless access to one active journey. | Short-lived server-issued session. |
| Payment attempt | Represents one immutable initiation request and lifecycle. | HotPesa payment service. |
| Provider evidence | Records callback or status-query information. | Validated payment-provider integration. |
| Audit event | Explains material state, configuration and exception actions. | Append-only controlled audit record. |

## 1.4 Phase 1 Product Direction

The product shall begin with one controlled Kenyan operator/SACCO pilot, supported routes and approved fares. Phase 1 prioritizes trustworthy fare presentation and payment verification over broad fleet, ticketing, loyalty, lending, advertising or multi-country functionality.

<br>

# 2 Product Vision

## 2.1 Vision Statement

Enable passengers to pay public-transport fares safely from their own phones while giving conductors and operators trustworthy, journey-linked payment evidence and controlled operational records.

## 2.2 Product Positioning

HotPesa is positioned between a general-purpose payment rail and transport operations. M-Pesa moves and settles funds; HotPesa supplies the journey context, fare governance, initiation workflow, evidence processing, operational status, reconciliation and audit trail required for public-transport use.

## 2.3 Product Experience Promise

The passenger sees the journey and fare before initiating payment.

The passenger is never required to surrender the phone for the supported flow.

Pending is presented honestly and never styled as success.

The conductor receives concise operational status without handling passenger credentials.

The operator can trace fares, attempts, provider evidence and exceptions.

The product remains usable on common low-cost phones and under constrained networks.

<br>

# 3 Product Problem Statement

The product must replace fragmented fare interactions that rely on verbal pricing, manual merchant entry, phone handover, cash, SMS inspection and informal reconciliation. It must create a coherent journey-linked workflow without introducing custody, false payment certainty, inaccessible passenger requirements or unacceptable operating delay.

| Product problem | User impact | Required product response |
| --- | --- | --- |
| Unsafe phone handover | Passenger privacy and device safety are compromised. | Accountless self-service flow on the passenger device. |
| Manual payment entry | Wrong account, amount and slow completion. | Journey-bound quote and controlled payment initiation. |
| Untrusted confirmation | Crew may accept screenshots or delayed messages. | Server-authoritative status from provider evidence. |
| Fare ambiguity | Passenger cannot verify the applicable fare. | Versioned fare shown before payment. |
| Connectivity uncertainty | Local access may be confused with financial success. | Separate local session, provider connectivity and payment states. |
| Duplicate/retry risk | Repeated action may create duplicate effects. | Idempotent requests and provider-event deduplication. |
| Weak operational records | Owners cannot link collections to journeys and exceptions. | Trip, payment, audit and reconciliation views. |
| Excessive personal data | Support and reporting may expose phone information. | Minimization, masking and role-controlled access. |

## 3.1 Product Problems Not Solved in MVP

General cash-management and cash custody.

Public-transport regulation enforcement.

Mobile-network or M-Pesa availability.

Inter-operator settlement and clearing.

Full reservations, ticketing, loyalty or lending.

National transport identity or passenger biometrics.

<br>

# 4 Target Users and Personas

| Persona | Class | Primary goal | Key constraint | Channel |
| --- | --- | --- | --- | --- |
| P-01 Passenger | Primary | Pay the correct fare independently and receive honest status. | Low-cost phone; limited time; variable connectivity; may not want an account. | Mobile PWA |
| P-02 Conductor | Primary workforce | Start/operate a journey and verify fares quickly. | Hands-busy, moving vehicle, bright light, weak network. | Android host |
| P-03 PSV Owner | Business customer | Understand trips, confirmed revenue and exceptions. | Needs evidence across assigned vehicles. | Admin web |
| P-04 SACCO Operations | Business administrator | Govern routes, vehicles, journeys, fares and workforce. | Multiple operational roles and approval boundaries. | Admin web |
| P-05 Finance Officer | Control user | Reconcile platform/provider evidence and investigate variances. | Must distinguish pending from confirmed and preserve audit. | Admin web/reporting |
| P-06 Support Agent | Service user | Resolve cases with limited, redacted evidence. | Needs context without unnecessary PII. | Admin web |
| P-07 Tenant Administrator | Privileged tenant user | Manage tenant users and configuration safely. | Delegation and least privilege. | Admin web |
| P-08 Platform Administrator | Privileged internal user | Operate tenants/integrations under strict controls. | High-impact access; segregation and audit. | Platform admin |
| P-09 Auditor | Assurance user | Review approved evidence without operational modification. | Read-only, time-bound and scoped access. | Reports/audit view |

## 4.1 Accessibility and Inclusion Profiles

Product design shall account for passengers using small screens, low-cost devices, one hand, bright outdoor conditions, assistive technologies, reduced-motion settings, limited digital literacy and English or Kiswahili content. No single visual cue, color or animation shall be the sole carrier of payment state.

<br>

# 5 User Needs and Pain Points

| User | Product need | Pain point to remove |
| --- | --- | --- |
| Passenger | Recognize the right journey; see the fare; initiate safely; understand status; know what to do if delayed or failed. | Wrong journey, phone handover, hidden fare, repeated payment and uncertain confirmation. |
| Conductor | Create the correct session; admit passengers efficiently; see safe payment references; close the journey. | Distracting screens, slow refresh, screenshots and unresolved pending items. |
| Owner/SACCO | Configure controlled operations and review activity by vehicle, route and trip. | Fragmented records and unauthorized fare changes. |
| Finance | Reconcile provider and platform records and resolve exceptions once. | Duplicate evidence, missing callbacks and ambiguous totals. |
| Support | Find the event timeline without seeing unnecessary secrets or full phone numbers. | Insufficient context or excessive data exposure. |
| Administrator | Delegate permissions, review changes and reverse unsafe access quickly. | Over-privilege and weak accountability. |
| Auditor | Verify what happened and who acted without altering records. | Mutable evidence or overly broad access. |

<br>

# 6 Product Objectives

| ID | Product objective | BRD linkage | Outcome evidence |
| --- | --- | --- | --- |
| PO-001 | Deliver an accountless passenger fare flow on common mobile browsers. | BR-PAX-001 to BR-PAX-005 | Independent completion on supported devices. |
| PO-002 | Make the applicable journey and fare visible before initiation. | BR-PAX-003, BR-PAX-004; BR-FAR-001 to 004 | Correct context and immutable quoted amount. |
| PO-003 | Make provider-backed payment truth the only success authority. | BR-PAY-003 to 010 | No false confirmation across tested failure paths. |
| PO-004 | Provide fast conductor journey and payment operations. | BR-OPS-001 to 006 | Field-usable controls and status. |
| PO-005 | Enable operator configuration and accountable fare governance. | BR-ADM-001, 002; BR-FAR-001 to 004 | Authorized, versioned, attributable changes. |
| PO-006 | Provide reconciliation and exception resolution. | BR-PAY-007 to 009; BR-ADM-003 to 005 | Duplicate-safe evidence and owned review queue. |
| PO-007 | Protect passenger data and privileged operations. | BR-GOV-001 to 006 | Redaction, authorization and audit evidence. |
| PO-008 | Produce pilot evidence for product and commercial decisions. | BR-PIL-001 to 005 | Approved KPI results and scale decision. |

<br>

# 7 Product Principles

| ID | Principle | Product decision rule |
| --- | --- | --- |
| PP-001 | Payment truth before visual success | Only server-accepted provider evidence can produce confirmed status. |
| PP-002 | Passenger control | The passenger keeps control of the phone and sees the amount before action. |
| PP-003 | Accountless core | Registration is not a prerequisite for the MVP fare journey. |
| PP-004 | Non-custodial design | HotPesa orchestrates and verifies; it does not store value or hold funds. |
| PP-005 | Honest degraded states | Offline, timeout, delayed and unknown states are explicit. |
| PP-006 | Minimal data | Collect, display and retain only what the approved journey requires. |
| PP-007 | Field-first simplicity | Optimize for moving vehicles, bright light, one hand and weak networks. |
| PP-008 | Accessible by default | Text, icon, focus and assistive technology accompany color and motion. |
| PP-009 | Controlled configuration | Fares, roles and high-impact actions are approved and audited. |
| PP-010 | Evidence-led expansion | Do not add broad features before the payment journey and pilot are proven. |

<br>

# 8 Product Scope

## 8.1 Phase 0 Product Proof

Synthetic journey and fare data.

Mock M-Pesa deterministic scenarios.

Passenger and admin browser applications.

Seven payment states, idempotency, duplicate evidence, reconciliation, conflict review and redaction.

PostgreSQL durability and automated browser proof.

## 8.2 MVP Core Scope

| Scope area | Included product boundary |
| --- | --- |
| Passenger PWA | Journey entry, context, fare, phone input, initiation, safe refresh, state and receipt/reference. |
| Android conductor host | Hotspot/session setup, journey selection, QR/short address, status board, reconnect and close. |
| Journey/fare service | Operators, vehicles, routes, directions, stages, fare versions and active journeys. |
| Payment service | M-Pesa adapter, attempts, idempotency, provider events, state transitions and reconciliation. |
| Admin web | Tenant configuration, operational monitoring, finance exceptions, audit and basic reports. |
| Identity/access | Managed workforce identity direction and HotPesa role/context authorization. |
| Reporting | Trip/payment-state summaries, exceptions, reconciliation and controlled export. |
| Operations | Monitoring, support, incident response, pilot onboarding and runbooks. |

## 8.3 Phase 2 and Roadmap

| Horizon | Candidate product direction |
| --- | --- |
| Phase 2 | Expanded fleet/shift workflows, approved refund/reversal operations, QR ticket validation, richer support and configurable notifications. |
| Later roadmap | Reservations, loyalty, advanced analytics, additional operators and provider adapters, each subject to approval. |
| Separate initiative | Wallet, credit, insurance, advertising, cross-border/cross-operator clearing or passenger-data monetization. |

<br>

# 9 Core Features

| ID | Feature | Definition | Release |
| --- | --- | --- | --- |
| F-001 | Journey discovery | Passenger opens current journey using QR or short address. | MVP |
| F-002 | Journey recognition | Passenger sees operator, vehicle/route and journey context. | MVP |
| F-003 | Fare presentation | Passenger sees approved fare before payment. | MVP |
| F-004 | Payment initiation | Validated request creates an idempotent server attempt. | MVP |
| F-005 | Payment status | Seven honest states with accessible text and safe next action. | MVP |
| F-006 | Digital reference | Confirmed passenger view provides transaction/journey reference. | MVP |
| F-007 | Journey setup | Conductor selects authorized vehicle, route and fare context. | MVP |
| F-008 | Local host/discovery | Android host supports vehicle-local passenger discovery. | MVP |
| F-009 | Conductor status board | Displays safe references and counts by payment state. | MVP |
| F-010 | Journey closure | Stops new attempts and summarizes unresolved activity. | MVP |
| F-011 | Fare administration | Authorized creation, approval, versioning and effective dates. | MVP |
| F-012 | Payment evidence ledger | Callbacks/status evidence retained and deduplicated. | MVP |
| F-013 | Reconciliation | Status query repairs missed callbacks without inventing success. | MVP |
| F-014 | Review queue | Conflicting or late evidence becomes review-required. | MVP |
| F-015 | Tenant/workforce access | Role and context permissions for operations and administration. | MVP |
| F-016 | Audit timeline | Material state/configuration/action history. | MVP |
| F-017 | Trip and revenue report | Confirmed/pending/failed values remain separate. | MVP |
| F-018 | Support view | Redacted case context and event timeline. | MVP |
| F-019 | Fleet and shift operations | Assignments, status and incident expansion. | Phase 2 |
| F-020 | Ticketing/reservation | Seat inventory, QR ticket and validation. | Phase 2 |
| F-021 | Passenger account services | History, loyalty and preferences. | Deferred |
| F-022 | Advanced analytics | Forecasting and anomaly insights. | Roadmap |

<br>

# 10 Core Capabilities

| ID | Capability | Definition | Primary personas |
| --- | --- | --- | --- |
| CAP-PAX | Passenger journey | Discover, recognize, review fare, initiate, monitor and retain a reference. | P-01 |
| CAP-JRN | Journey operations | Start, publish, reconnect, close and inspect a scoped active journey. | P-02, P-04 |
| CAP-FAR | Fare governance | Create, approve, activate and preserve fare versions. | P-04, P-07 |
| CAP-PAY | Payment lifecycle | Initiate, validate evidence, transition state and prevent duplicates. | P-01, P-02, P-05 |
| CAP-REC | Reconciliation | Status-check missing evidence and resolve controlled exceptions. | P-05 |
| CAP-ADM | Tenant administration | Manage vehicles, routes, users, roles and approved configuration. | P-04, P-07 |
| CAP-RPT | Reporting | Present trip, payment-state, exception and audit information. | P-03 to P-06, P-09 |
| CAP-SEC | Security/privacy | Authorize, minimize, mask, audit and respond. | All users |
| CAP-OPS | Service operations | Observe service health, support pilots and manage incidents. | P-06, P-08 |

<br>

# 11 Detailed Feature Catalogue

The following product requirements use stable PR identifiers and shall be decomposed in the FRS without weakening their acceptance boundaries.

## 11.1 Passenger Experience

| Requirement ID | Product requirement | Priority | BRD source |
| --- | --- | --- | --- |
| PR-PAX-001 | Open a valid journey from QR or short address and reject unknown, stale or closed sessions. | Must | BR-PAX-001, BR-JRN-001 |
| PR-PAX-002 | Show operator and sufficient vehicle/route context before fare action. | Must | BR-PAX-003 |
| PR-PAX-003 | Allow destination/stage selection only from valid journey options. | Must | BR-PAX-004 |
| PR-PAX-004 | Display the server-quoted fare and currency before initiation. | Must | BR-PAX-004, BR-FAR-004 |
| PR-PAX-005 | Accept and normalize only an approved sandbox/live phone-input format without collecting M-Pesa PIN. | Must | BR-GOV-001 |
| PR-PAX-006 | Prevent accidental duplicate submission while permitting safe status refresh. | Must | BR-PAY-004 |
| PR-PAX-007 | Present all seven states using text and accessible status announcements. | Must | BR-PAX-006, BR-PAY-006 |
| PR-PAX-008 | Use success color/check language only for confirmed. | Must | BR-PAY-005, BR-PAY-010 |
| PR-PAX-009 | Provide safe guidance for failed, expired, offline and review-required outcomes. | Must | BR-PAX-006 |
| PR-PAX-010 | Provide a transaction/journey reference without exposing unnecessary sensitive data. | Must | BR-RPT-003, BR-GOV-002 |

## 11.2 Journey and Conductor Host

| Requirement ID | Product requirement | Priority | BRD source |
| --- | --- | --- | --- |
| PR-JRN-001 | Allow authorized crew to select assigned vehicle, route, direction and fare schedule. | Must | BR-JRN-001, BR-OPS-001 |
| PR-JRN-002 | Create one scoped active journey session with expiry and operator ownership. | Must | BR-JRN-002 |
| PR-JRN-003 | Generate a QR code and short address for the active session. | Must | BR-PAX-001 |
| PR-JRN-004 | Show active journey identity and connectivity state to the conductor. | Must | BR-OPS-001 |
| PR-JRN-005 | Display safe payment counts and references by state. | Must | BR-OPS-001, BR-GOV-002 |
| PR-JRN-006 | Recover safely after host restart/reconnect without creating false payment state. | Must | BR-OPS-005 |
| PR-JRN-007 | Close a journey, reject new attempts and preserve outstanding evidence handling. | Must | BR-OPS-004 |
| PR-JRN-008 | Record permitted operational exceptions without changing provider evidence. | Must | BR-OPS-003 |

## 11.3 Fare Product

| Requirement ID | Product requirement | Priority | BRD source |
| --- | --- | --- | --- |
| PR-FAR-001 | Create route/direction/stage fare definitions under authorized roles. | Must | BR-FAR-001 |
| PR-FAR-002 | Require version, effective period, status and approver for active fares. | Must | BR-FAR-002 |
| PR-FAR-003 | Prevent overlapping active fare rules where the operator policy prohibits ambiguity. | Must | BR-FAR-001 |
| PR-FAR-004 | Retain the applied fare version on every payment attempt. | Must | BR-FAR-003 |
| PR-FAR-005 | Prevent passenger clients and conductor UI from overriding the quoted amount. | Must | BR-FAR-004 |
| PR-FAR-006 | Provide change history and controlled rollback/supersession. | Should | BR-ADM-002 |

## 11.4 Payment Product

| Requirement ID | Product requirement | Priority | BRD source |
| --- | --- | --- | --- |
| PR-PAY-001 | Create a unique payment attempt before provider initiation. | Must | BR-PAY-003 |
| PR-PAY-002 | Require a client idempotency key and reject changed reuse. | Must | BR-PAY-004 |
| PR-PAY-003 | Integrate through a provider adapter with mock, sandbox and later production configuration separated. | Must | BR-PAY-001 |
| PR-PAY-004 | Persist provider request/reference evidence using redaction controls. | Must | BR-PAY-005, BR-GOV-002 |
| PR-PAY-005 | Accept authenticated/validated callback evidence and deduplicate by evidence identity. | Must | BR-PAY-007 |
| PR-PAY-006 | Apply only permitted state transitions; terminal conflicts become review-required. | Must | BR-PAY-006, BR-PAY-009 |
| PR-PAY-007 | Support trusted provider-status queries for missing callbacks. | Must | BR-PAY-008 |
| PR-PAY-008 | Expire eligible attempts without overwriting confirmed or failed outcomes. | Must | BR-PAY-006 |
| PR-PAY-009 | Keep initiated, pending and confirmed values separate in all views and totals. | Must | BR-RPT-002 |
| PR-PAY-010 | Do not expose production secrets, full phone numbers or raw payloads in ordinary logs/UI. | Must | BR-GOV-002 |

## 11.5 Administration Reconciliation and Reporting

| Requirement ID | Product requirement | Priority | BRD source |
| --- | --- | --- | --- |
| PR-ADM-001 | Manage tenant users, roles and scoped permissions. | Must | BR-ADM-001, BR-GOV-003 |
| PR-ADM-002 | Manage approved vehicles, routes, stages and fare configuration. | Must | BR-ADM-001 |
| PR-ADM-003 | Display journeys, attempts, provider events and audit timelines. | Must | BR-ADM-003, BR-RPT-003 |
| PR-ADM-004 | Provide controlled reconcile, expire and conflict-review actions. | Must | BR-ADM-004 |
| PR-ADM-005 | Require reason, actor and timestamp for exception decisions. | Must | BR-ADM-002 |
| PR-RPT-001 | Report trip totals by state without collapsing pending into revenue. | Must | BR-RPT-001, BR-RPT-002 |
| PR-RPT-002 | Support controlled export with tenant and role boundaries. | Should | BR-RPT-005 |
| PR-RPT-003 | Expose pilot KPI events without unnecessary passenger identity. | Must | BR-RPT-004 |

## 11.6 Security Privacy and Operations

| Requirement ID | Product requirement | Priority | BRD source |
| --- | --- | --- | --- |
| PR-SEC-001 | Use managed identity primitives for workforce authentication before production. | Must | BR-GOV-003 |
| PR-SEC-002 | Enforce authorization server-side by role, tenant and resource context. | Must | BR-GOV-003 |
| PR-SEC-003 | Mask passenger phone references except in narrowly approved operational use. | Must | BR-GOV-002 |
| PR-SEC-004 | Audit privileged configuration, evidence and exception actions. | Must | BR-GOV-004 |
| PR-SEC-005 | Separate development, sandbox and production data and credentials. | Must | BR-GOV-005 |
| PR-OPS-001 | Provide health, structured logs, metrics and alerts appropriate to the pilot. | Must | BR-GOV-006 |
| PR-OPS-002 | Provide incident, support, reconciliation and rollback runbooks. | Must | BR-OPS-006, BR-GOV-006 |
| PR-OPS-003 | Block production activation until approval gates are recorded. | Must | BR-GOV-005, BR-PIL-002 |

<br>

# 12 Minimum Viable Product

## 12.1 MVP Definition

The HotPesa MVP is the smallest production-intended product that can safely support one controlled Kenyan operator/SACCO pilot across approved routes, vehicles, fares and workforce users while using live M-Pesa only after all external gates are satisfied. It must demonstrate the complete passenger-to-provider-to-operator evidence chain, not merely a user-interface prototype.

## 12.2 Must Be Included

Accountless passenger PWA and scoped journey URL.

Android conductor journey host and discovery flow.

Controlled journey, route, stage and fare configuration.

M-Pesa initiation through an approved adapter.

Seven payment states and trusted server-side confirmation.

Idempotent initiation, callback deduplication and reconciliation.

Operator/admin payment and audit visibility.

Workforce authentication/authorization, redaction and environment separation.

Pilot operations, monitoring, incident and support controls.

## 12.3 MVP Completion Boundary

| Boundary | Completion evidence |
| --- | --- |
| Functional | All Must product requirements traced to passing tests or approved manual evidence. |
| Payment | Duplicate, delayed, missing, failed and conflicting evidence scenarios pass. |
| Durability | Attempts, provider evidence and audit survive restart in the approved persistent store. |
| User experience | Passenger and conductor tasks pass supported-device, accessibility and field tests. |
| Security/privacy | Threat, authorization, redaction, secret and privacy gates pass. |
| Operations | Monitoring, support, reconciliation, backup/restore and incident procedures are rehearsed. |
| External | Pilot, legal/privacy, provider and commercial approvals are recorded. |

## 12.4 Definition of Product Done

A feature is not complete because its happy path works. It is complete only when its requirement and acceptance criteria are traced, permitted states and errors are implemented, accessibility and privacy are addressed, automated/manual evidence passes, operational implications are documented and the change is approved under the applicable release gate.

<br>

# 13 Future Enhancements

| Horizon | Enhancement | Condition |
| --- | --- | --- |
| Phase 2 | Refund/reversal operations | Controlled provider/operator workflow after policy approval. |
| Phase 2 | Fleet and shift management | Assignments, attendance, incidents and vehicle availability. |
| Phase 2 | QR ticket validation | Receipt/ticket verification for appropriate service models. |
| Phase 2 | Passenger support/account | Optional history, preferences, feedback and support. |
| Roadmap | Reservations and seat inventory | Intercity/long-distance product line requiring separate flows. |
| Roadmap | Advanced analytics | Route performance, demand and anomaly insights after data governance maturity. |
| Roadmap | Additional payment providers | Adapter-based expansion after market/legal review. |
| Separate approval | Loyalty, insurance, financing or advertising | Not assumed; require dedicated business, privacy and regulatory case. |
| Separate approval | Multi-country and cross-operator settlement | Requires country-specific payment, tax, legal and operating design. |

<br>

# 14 In Scope Features

In-scope features are those allocated to Phase 0 evidence or the controlled MVP. Inclusion does not by itself authorize production activation; each feature remains subject to acceptance and release gates.

| Category | In-scope features |
| --- | --- |
| Passenger | Journey discovery, context, fare, phone input, initiation, status, receipt/reference and guidance. |
| Conductor | Journey setup, discovery QR/address, status board, reconnect and close. |
| Operator | Vehicles, routes, stages, fares, workforce and journey configuration. |
| Payments | Attempts, provider adapter, evidence, transitions, idempotency, expiry, reconciliation and review. |
| Administration | Tenant roles, operations, support and controlled exception actions. |
| Reporting | Trip and state totals, provider/audit timeline and controlled export. |
| Quality | Accessibility, reduced motion, field/device tests, security/privacy and operational evidence. |

<br>

# 15 Out of Scope Features

| Feature | Boundary |
| --- | --- |
| Wallet/stored value | No HotPesa-held balance or passenger deposit. |
| Credit/lending/pay-later | Separate regulated and commercial proposition. |
| Cash custody | No cash collection, holding or settlement by HotPesa. |
| Dynamic/AI pricing | Fares are approved and versioned; no automated surge pricing. |
| Mandatory passenger registration | Core fare path remains accountless. |
| Biometric passenger identity | No face, fingerprint or similar requirement. |
| Cross-SACCO clearing | No pooled settlement or inter-operator netting. |
| Full reservation/seat inventory | Deferred product line. |
| Advertising/data monetization | Not part of MVP or base case. |
| iOS conductor application | Android workforce host for MVP. |
| Unapproved live M-Pesa | Mock/sandbox evidence is not production authority. |
| National rollout | Requires successful controlled pilot and scale approval. |

<br>

# 16 Product Assumptions

| ID | Assumption | Validation | Status |
| --- | --- | --- | --- |
| PA-001 | Target passengers can use Wi-Fi and a compatible browser. | Device/field test | Open |
| PA-002 | A QR or short address is understandable in the pilot environment. | Usability test | Open |
| PA-003 | Pilot crews can operate an Android host safely. | Field observation | Open |
| PA-004 | The chosen hotspot approach is reliable on approved device models. | Device matrix | Partially proven |
| PA-005 | Direct merchant settlement can be configured. | Provider/legal confirmation | Open |
| PA-006 | Operators can maintain accurate route, stage and fare data. | Onboarding trial | Open |
| PA-007 | Accountless payment provides sufficient support evidence with minimized data. | Privacy/support test | Open |
| PA-008 | English/Kiswahili content meets initial needs. | Content/usability study | Open |
| PA-009 | The operator will assign support, reconciliation and incident owners. | Pilot agreement | Open |
| PA-010 | Product value supports a sustainable organization-funded price. | Commercial pilot | Open |

<br>

# 17 Product Dependencies

| ID | Dependency | Type | Affected product area |
| --- | --- | --- | --- |
| PD-001 | Safaricom/Daraja onboarding and supported APIs | External | Live payment |
| PD-002 | Approved merchant and settlement arrangement | Business/external | Live payment |
| PD-003 | Named pilot operator/SACCO and sponsor | Business | Pilot |
| PD-004 | Representative Android devices and SIM/network conditions | Operational | Host validation |
| PD-005 | Managed workforce identity provider | Technical/business | Production access |
| PD-006 | Secure cloud endpoint, TLS, secrets and monitoring | Technical | Provider callback/pilot |
| PD-007 | Approved fare ownership and catalogue | Operator | Journey/fare |
| PD-008 | Privacy/legal assessment and notices | Governance | Real data |
| PD-009 | Support, finance, incident and reconciliation staffing | Operational | Pilot operation |
| PD-010 | Approved retention and audit policies | Governance | Production records |

<br>

# 18 Product Constraints

| ID | Constraint | Product response |
| --- | --- | --- |
| PC-001 | Provider and internet connectivity are not guaranteed. | Explicit pending/offline states and reconciliation. |
| PC-002 | Android hotspot behavior differs by OS/device. | Supported-device matrix and fallback discovery. |
| PC-003 | Low-cost phones and browsers have limited performance. | Small payloads, progressive enhancement and restrained motion. |
| PC-004 | Conductor interaction occurs in a moving, bright and time-critical environment. | Large clear controls and minimal steps. |
| PC-005 | HotPesa cannot confirm settlement offline. | Block financial confirmation without trusted evidence. |
| PC-006 | MVP is limited to one controlled pilot model. | No speculative multi-operator complexity. |
| PC-007 | Legal/provider approvals cannot be inferred from tests. | External release gates. |
| PC-008 | Personal-data retention must be proportionate. | Minimization and approved schedules. |
| PC-009 | Phase 0 uses synthetic data and Mock M-Pesa. | No production claim. |
| PC-010 | Production operating budget is not yet approved. | Bounded architecture and explicit resource gate. |

<br>

# 19 Success Metrics

Targets shall be approved before the pilot. Metrics are segmented by device, network, route and scenario where this improves interpretation without collecting unnecessary passenger identity.

| ID | Metric | Definition |
| --- | --- | --- |
| PM-001 | Journey-entry success | Valid opens reaching recognizable journey context. |
| PM-002 | Independent passenger completion | Supported attempts completed without staff handling the phone. |
| PM-003 | Payment completion | Confirmed / valid initiated, with declines and abandonment separated. |
| PM-004 | Time to terminal evidence | Median and high-percentile initiation-to-confirmed/failed time. |
| PM-005 | False-confirmation count | Any UI/operational success without accepted provider evidence; target zero. |
| PM-006 | Duplicate effect count | Duplicate financial/receipt effects from repeated requests/evidence; target zero. |
| PM-007 | Reconciliation variance | Platform vs provider confirmed value difference. |
| PM-008 | Review queue age | Time unresolved exceptional evidence remains open. |
| PM-009 | Fare dispute rate | Disputes per 1,000 supported fares. |
| PM-010 | Passenger usability | Task success, error and assistance measures. |
| PM-011 | Accessibility quality | Blocking/high findings and supported assistive-technology results. |
| PM-012 | Service reliability | Journey/API availability and error rate during operating window. |
| PM-013 | Sensitive-data incident | Unauthorized exposure of phone/payment/credential data; target zero. |
| PM-014 | Pilot adoption | Eligible fares processed through HotPesa. |
| PM-015 | Commercial continuation | Operator approval or paid continuation after evidence review. |

<br>

# 20 Product Acceptance Criteria

## 20.1 Overall Acceptance

| ID | Acceptance criterion | Primary evidence |
| --- | --- | --- |
| PAC-001 | A passenger can enter a valid journey, recognize context, see fare and initiate without an account. | E2E + supported-device test |
| PAC-002 | Unknown, stale and closed journey sessions are rejected safely. | API/E2E |
| PAC-003 | The amount cannot be changed after initiation or by the client. | Contract/integration |
| PAC-004 | Only trusted server evidence can establish confirmed. | Unit/integration/E2E |
| PAC-005 | Duplicate initiation/callbacks create no duplicate payment or receipt effect. | Integration/E2E |
| PAC-006 | Missing callback reconciliation uses provider status and preserves evidence. | Integration/E2E |
| PAC-007 | Late/conflicting evidence becomes review-required under approved transitions. | Unit/integration |
| PAC-008 | Restart preserves attempts, evidence, audit and idempotency in persistent mode. | Durability test |
| PAC-009 | Passenger and conductor interfaces label all seven states accessibly. | Component/E2E/a11y |
| PAC-010 | Full phone numbers, secrets and raw payloads are absent from ordinary logs/views. | Redaction/security |
| PAC-011 | Tenant/resource authorization is enforced server-side. | Authorization tests |
| PAC-012 | Reports keep pending, failed and confirmed values separate. | Report tests |
| PAC-013 | Journey close blocks new attempts but retains outstanding evidence handling. | Integration |
| PAC-014 | Pilot runbooks, monitoring, incident and support evidence are approved. | Operational review |
| PAC-015 | External pilot, merchant, legal/privacy and provider gates are recorded. | Release governance |

## 20.2 User Acceptance Readiness

Approved pilot users, devices, routes, fares and synthetic/controlled test data are available.

Known limitations and fallback procedures are communicated.

No unresolved Critical or High defect remains without explicit risk acceptance.

Support, finance and incident owners are available during UAT.

Entry and exit measures are documented before execution.

## 20.3 Release Acceptance

A release may proceed only when product acceptance, security/privacy, payment, operations and external approval gates are jointly satisfied. Passing unit or browser tests alone is insufficient for live M-Pesa or passenger operation.

<br>

# 21 Approval and Sign Off

PRD approval confirms the target users, product objectives, principles, numbered product requirements, MVP boundary, acceptance criteria and open-decision treatment. It authorizes downstream specification and implementation only within the approved scope.

| Role | Name | Decision | Signature | Date |
| --- | --- | --- | --- | --- |
| Project Sponsor |  | Approve / Conditional / Reject |  |  |
| Product Owner |  | Approve / Conditional / Reject |  |  |
| Pilot Operator Representative |  | Approve / Endorse / Pending |  |  |
| Engineering/Architecture |  | Endorse / Conditions |  |  |
| Security/Privacy |  | Endorse / Conditions / Pending |  |  |
| Finance/Commercial |  | Endorse / Conditions / Pending |  |  |

## 21.1 Approval Conditions

| Condition | Status |
| --- | --- |
| BRD Version 1.0 approved or conditionally approved | Pending |
| Pilot operator, routes, vehicles and roles agreed | Pending |
| Merchant and commercial model agreed | Pending |
| Legal/privacy and provider release gates completed | Pending |
| MVP product requirements accepted | Approval required |
| Quantitative pilot targets accepted | Decision required |

<br>

# 22 Requirement Traceability Summary

| BRD family | PRD allocation | Downstream evidence |
| --- | --- | --- |
| BR-PAX | PR-PAX-001 to 010 | Passenger flows, UI states, accessibility and E2E tests. |
| BR-JRN | PR-JRN-001 to 008 | Journey/session API, conductor host and lifecycle tests. |
| BR-FAR | PR-FAR-001 to 006 | Fare data/contracts, admin flow and version tests. |
| BR-PAY | PR-PAY-001 to 010 | Payment domain, API, provider adapter and evidence tests. |
| BR-OPS | PR-JRN; PR-OPS-001 to 003 | Conductor, monitoring and runbook evidence. |
| BR-ADM | PR-ADM-001 to 005 | Admin UI/API, authorization and audit tests. |
| BR-RPT | PR-RPT-001 to 003 | Reporting, export and analytics-event tests. |
| BR-GOV | PR-SEC-001 to 005; PR-OPS-001 to 003 | Security/privacy/NFR and release evidence. |
| BR-PIL | MVP acceptance and release gates | Pilot plan, UAT and approval records. |

## 22.1 Traceability Control Rule

Every FRS requirement, user story, use case, API operation, data entity, screen, security/NFR control, implementation phase and test shall reference the applicable PR and BR identifiers. A change that breaks or extends a traced boundary requires impact analysis before implementation.

<br>

# 23 Open Decisions and Clarification Register

| ID | Decision required | Owner | Gate | Status |
| --- | --- | --- | --- | --- |
| OD-001 | Name the pilot operator/SACCO, routes, vehicles and launch location. | Sponsor/Product | Before pilot planning | Open |
| OD-002 | Confirm merchant shortcode/till/paybill and settlement owner. | Finance/Legal | Before Daraja production | Open |
| OD-003 | Approve operator/SACCO pricing and any transaction-linked fee. | Commercial/Legal | Before contract | Open |
| OD-004 | Select managed workforce identity provider. | Architecture/Security | Before production auth | Open |
| OD-005 | Approve fare-change workflow and dual-control threshold. | Operator/Product | Before fare configuration | Open |
| OD-006 | Approve refund, reversal and wrong-payment treatment. | Finance/Provider/Legal | Before live pilot | Open |
| OD-007 | Approve passenger phone retention and support-access policy. | Privacy/Support | Before real data | Open |
| OD-008 | Approve KPI targets and pilot exit thresholds. | Steering authority | Before pilot | Open |
| OD-009 | Confirm English/Kiswahili terminology and accessibility test cohort. | Product/UX | Before UAT | Open |
| OD-010 | Approve supported Android device/API matrix. | Engineering/Operations | Before pilot procurement | Open |

## 23.1 Resolved Product Decisions

| Decision | Resolution |
| --- | --- |
| Passenger access | Accountless PWA via scoped QR/short address. |
| Workforce channel | Android conductor host. |
| Payment truth | Server-side accepted provider evidence only. |
| Settlement role | Non-custodial; direct approved merchant settlement. |
| Offline treatment | No offline financial confirmation. |
| Pilot strategy | One controlled Kenyan operator/SACCO before scale. |
| Payment lifecycle | created, initiating, pending, confirmed, failed, expired, review-required. |

<br>

# 24 Final PRD Readiness Checklist

| Review item | Status |
| --- | --- |
| Product identity, model and users are defined | Complete |
| Product problems and needs align to BRD | Complete |
| Objectives and principles are explicit | Complete |
| MVP, future and out-of-scope boundaries are separated | Complete |
| Product requirements have stable IDs and BRD trace | Complete |
| Seven payment states and success authority are explicit | Complete |
| Acceptance criteria cover failure, duplicate and durability cases | Complete |
| Metrics are defined | Complete; numerical targets pending |
| Dependencies, assumptions and constraints are recorded | Complete |
| Open product decisions have owners and gates | Complete |
| External pilot/provider/legal/privacy approvals are recorded | Pending |
| Formal PRD approval is recorded | Pending |

## 24.1 PRD Completion Statement

This PRD is structurally complete for stakeholder review and downstream specification. Implementation shall remain limited to approved requirements. Live M-Pesa, production authentication, real passenger data and pilot operation remain blocked until their external and release conditions are satisfied.

Next controlled action: synchronize the Functional Requirements Specification and User Stories and Use Cases to this PRD, then update architecture, data/API, application-flow, UI/UX, security/NFR, implementation and master traceability artifacts before further MVP expansion.
