---
document_id: "01"
title: "Business Requirements Document"
project: "HotPesa Pay"
source_docx: "docs/controlled-documents/01_Business Requirements Document (BRD)_HotPesa Pay.docx"
source_version: "1.0"
source_status: "Draft for stakeholder review and approval"
synchronization_date: "2026-09-19"
source_sha256: "bd933c4d4b303f0f16ffcfba5dbfde688e96b9f118eb9a66b068875e621bcd0d"
---

> Controlled source: [01_Business Requirements Document (BRD)_HotPesa Pay.docx](../controlled-documents/01_Business%20Requirements%20Document%20(BRD)_HotPesa%20Pay.docx)

> The DOCX source is authoritative. This Markdown copy preserves its controlled status and does not confer approval.

DOCUMENT 01

Business Requirements Document

HotPesa Pay

<br>

Business justification, target operating model, scope, requirements and approval basis

<br><br>

| Control | Value |
| --- | --- |
| Project | HotPesa Pay |
| Document | Business Requirements Document |
| Version | 1.0 |
| Status | Draft for stakeholder review and approval |
| Lifecycle stage | Pre-code baseline with Phase 0 proof-of-concept evidence |
| Primary market | Kenya |
| Classification | Confidential - project planning |

<br>

### Governing question

Why should HotPesa Pay exist, what business outcomes must it deliver, and what boundaries must govern the initiative?

<br>

# Document Control

| Field | Controlled value |
| --- | --- |
| Document owner | Founder and Product Owner |
| Business owner | To be confirmed by the sponsoring legal entity |
| Contributors | Business analysis, product, engineering, security, finance, operations and legal/compliance |
| Intended reviewers | Founder; selected PSV/SACCO representatives; engineering; security; finance; legal/compliance |
| Approval authority | Project Steering Committee or designated sponsor - decision required |
| Authoritative inputs | HotPesa discovery record; existing HotPesa BRD; approved Phase 0 scope and architecture controls; Mpanga BRD used only as a structural and presentation reference |
| Related documents | PRD; FRS; User Stories and Use Cases; TRD; Data Model and API Contract; Application Flow and Information Architecture; UI/UX Specification; Security, Privacy and NFR Specification; Implementation Plan; ADR Log; Master Requirements Traceability Report |
| Review cycle | At approval, before material MVP scope change, and at each release gate |
| Change control | Changes to scope, payment model, data use, settlement, pilot boundaries or success criteria require documented impact assessment and approval. |

## Document Status and Interpretation

This BRD establishes the business case and governance baseline for HotPesa Pay. Statements labelled Approved Baseline reflect the current controlled direction. Items labelled Proposed, Assumption, Validation Required or Decision Required must not be treated as approved production commitments until the named evidence and authority are recorded.

The document distinguishes business need from implementation detail. Technology references appear only where they define a business boundary already established for the Phase 0 proof, such as the passenger web experience, Android conductor host, direct M-Pesa settlement and trusted server-side payment confirmation.

## Version History

| Version | Date | Status | Summary |
| --- | --- | --- | --- |
| 0.1 | 18 September 2026 | Draft | Initial concise HotPesa business baseline. |
| 1.0 | 19 September 2026 | Draft for approval | Expanded professional BRD aligned to the reference structure; incorporates controlled Phase 0 decisions and explicit approval gates. |

<br>

## Table of Contents

| Section | Purpose |
| --- | --- |
| 1 Executive Summary | Business case and recommended direction |
| 2 Background and Business Context | Kenyan transport and operating context |
| 3 Problem Statement | Problems requiring intervention |
| 4 Business Opportunity | Commercial and strategic opportunity |
| 5 Business Objectives | Measurable business outcomes |
| 6 Stakeholders | Affected and accountable parties |
| 7 Current State Process | Existing fare collection journey |
| 8 Current State Challenges | Business impact of existing weaknesses |
| 9 Proposed Future State | Target operating model |
| 10 Business Requirements | Numbered business requirements |
| 11 Business Rules | Business policies and governing rules |
| 12 Business Benefits | Expected stakeholder value |
| 13 Success Measures and KPIs | Measures and validation approach |
| 14 Project Scope | MVP and phased scope |
| 15 Out of Scope | Explicit exclusions |
| 16 Assumptions | Planning assumptions |
| 17 Dependencies | External and internal dependencies |
| 18 Constraints | Binding limitations |
| 19 Risks | Risk register and responses |
| 20 Regulatory and Business Considerations | Kenyan regulatory and governance considerations |
| 21 Approval and Sign Off | Approval conditions and signatures |
| Appendix A Glossary | Reference material |
| Appendix B Decision Register | Reference material |
| Appendix C Business Traceability Summary | Reference material |

# 1 Executive Summary

HotPesa Pay is a proposed contactless public-transport fare orchestration and verification platform for Kenya. It is intended to reduce unsafe phone handover, repetitive merchant-detail entry, cash and change friction, fake-payment evidence, fare disputes and weak operator visibility. In the approved MVP direction, an Android conductor device creates a vehicle-local passenger access point; a passenger opens a lightweight web experience using a QR code or short address, confirms the journey and fare, and initiates payment using M-Pesa from the passenger’s own phone.

HotPesa does not operate as a wallet, hold passenger funds, replace M-Pesa or guarantee settlement while connectivity is unavailable. Funds are intended to settle directly to the approved PSV owner, fleet, bus company or SACCO merchant account. The HotPesa server records the payment attempt and changes it to confirmed only after trusted provider-side evidence. Local hotspot access, an initiated payment prompt, an SMS screenshot, a client message or an offline event is never treated as proof of settlement.

The recommended initial business approach is a controlled Kenyan pilot with one approved operator or SACCO, a narrow set of routes and fares, synthetic and sandbox payment testing before live onboarding, and explicit operational oversight. This creates evidence for payment reliability, passenger usability, conductor throughput, reconciliation, privacy, fraud controls and commercial viability before wider investment.

Business approval is recommended subject to the decision gates in this document: sponsor and legal entity confirmation, pilot operator approval, Safaricom onboarding and commercial terms, merchant settlement arrangements, legal and data-protection review, measurable pilot targets, incident ownership, and acceptance of the MVP scope and risk responses.

<br>

## 1.1 Recommended Business Decision

| Decision | Recommendation | Condition |
| --- | --- | --- |
| Continue the initiative | Proceed through controlled MVP and pilot preparation | Do not infer production approval from the Phase 0 mock or sandbox proof. |
| Commercial model | Prioritize operator/SACCO subscription and transparent enterprise service pricing | Validate who pays, invoicing, taxes, refund handling and any transaction-linked fee with legal and commercial review. |
| Payment role | Remain a non-custodial orchestration and verification layer | Direct settlement to the approved merchant; no wallet or stored value in MVP. |
| Pilot scope | One controlled Kenyan operator/SACCO and bounded routes | Named sponsor, operating procedures, training, support and exit criteria required. |
| Scale decision | Evidence-led after pilot | Require verified safety, payment, operational, adoption and reconciliation results. |

<br>

# 2 Background and Business Context

## 2.1 Kenyan Public Transport Context

Kenyan public transport is delivered through a diverse ecosystem of matatus, buses, SACCOs, companies, owners, crews, stages and route associations. Fare collection is operationally intense: many transactions occur quickly, fares may vary by route segment and approved operating conditions, passengers board with different levels of digital literacy, and vehicles frequently operate under weak or intermittent connectivity. Any digital fare solution must therefore work in crowded, time-sensitive and mobile environments rather than assume a quiet retail checkout.

M-Pesa is widely used for payments, but common fare practices may still depend on direct paybill or till entry, phone handover, visual inspection of messages, verbal confirmation and later manual reconciliation. These practices do not consistently provide a trusted link between the passenger, journey, applicable fare, payment attempt and operator record.

## 2.2 Business Concept

HotPesa introduces a vehicle-scoped digital journey session. The passenger discovers the session through a QR code or short local address, reviews the vehicle or operator reference, selects or confirms the applicable journey segment, sees the controlled fare, and initiates payment. The conductor sees operational status appropriate to the trip, while owners and SACCOs receive structured journey, fare, payment-evidence and exception records.

## 2.3 Strategic Context

| Context | Observed condition | Business implication |
| --- | --- | --- |
| Passenger safety and autonomy | Passengers may surrender phones or expose merchant-entry activity | Keep the passenger in control of the device and minimize data requested. |
| Revenue assurance | SMS and screenshots can be delayed, misread or falsified | Use provider-derived evidence and auditable reconciliation. |
| Fare governance | Verbal or manually altered fares are difficult to audit | Use approved, versioned and effective-dated fares. |
| Operational tempo | Boarding and fare collection must remain fast | Design for one-handed use, low-end devices and clear status. |
| Connectivity | Internet and provider connectivity may be intermittent | Separate local session access from authoritative financial settlement. |
| Market structure | Operators vary in governance, scale and technology maturity | Pilot with controlled onboarding, training and configuration. |
| Trust and compliance | Payments and personal data carry regulatory and reputational exposure | Apply privacy, security, audit and legal gates before production. |

<br>

# 3 Problem Statement

Passengers, conductors, vehicle owners and SACCOs lack a consistent, low-friction and independently verifiable fare-payment workflow that links the correct journey and fare to trusted payment evidence. Existing combinations of cash, manual M-Pesa entry, phone handover, message inspection and informal reconciliation create safety, privacy, fraud, delay, dispute and accountability problems.

| Problem area | Current manifestation | Business effect |
| --- | --- | --- |
| Unsafe phone handling | A passenger may hand a phone to a conductor or expose personal activity | Loss, damage, unauthorized access, hygiene concerns and reduced trust. |
| Manual payment entry | Passengers repeatedly enter business numbers, accounts or amounts | Errors, delays, wrong-recipient risk and poor accessibility. |
| Weak confirmation | Crew may rely on SMS, screenshots or verbal assertions | Fake confirmations, delayed boarding decisions and revenue leakage. |
| Cash and change | Cash remains operationally burdensome | Change disputes, theft exposure, counting effort and reconciliation gaps. |
| Fare ambiguity | Fares may be communicated verbally and changed without an auditable record | Passenger disputes, inconsistency and governance weakness. |
| Fragmented trip records | Payments are not always linked to vehicle, route, stage and trip | Owners cannot reliably compare service activity with collected revenue. |
| Poor exception handling | Timeouts, missed callbacks and wrong statuses are managed informally | Double charging, unresolved complaints and inaccurate settlement assumptions. |
| Limited management insight | Operators receive delayed or incomplete transaction-level information | Slow intervention, weak planning and difficult accountability. |
| Privacy exposure | Full phone numbers and raw messages may be visible or retained unnecessarily | Data-protection and reputational risk. |
| Connectivity uncertainty | Local access and provider connectivity are easily confused | A pending or offline event may be incorrectly treated as paid. |

## 3.1 Root Cause Summary

Fare collection is not consistently represented as a controlled journey-linked transaction.

Payment initiation, provider evidence and operator reconciliation are not treated as separate events.

Fare ownership, approval and effective dates are not consistently digitized.

Field workflows prioritize speed but often lack safe exception and audit procedures.

Available digital tools are not always optimized for local, low-bandwidth and accountless passenger access.

# 4 Business Opportunity

## 4.1 Market Gap

The opportunity is not simply to add another payment screen. HotPesa can provide a transport-specific control layer that connects vehicle identity, journey context, approved fare, passenger initiation, provider evidence, conductor verification, operator reporting and reconciliation. This addresses an operational gap between general-purpose mobile payment rails and daily fare-collection needs.

## 4.2 Strategic Opportunity

| Opportunity | Potential value | Validation required |
| --- | --- | --- |
| Contactless fare experience | Safer and faster passenger interaction | Observe passenger completion, accessibility and trust during pilot. |
| Revenue visibility | Trip-level records and exception monitoring | Compare platform evidence with provider and operator totals. |
| Fare governance | Approved fare catalogue with change history | Agree fare ownership and authorization with pilot operator. |
| Operational analytics | Journey, throughput and exception measures | Confirm lawful, necessary and useful reporting fields. |
| Operator digitization | Foundation for broader fleet workflows | Keep non-MVP functions deferred until fare proof succeeds. |
| Enterprise licensing | Configurable solution for SACCOs and bus companies | Validate procurement, support and pricing expectations. |
| Regional expansion | Reusable provider-adapter model for later markets | Treat every country and payment rail as a separate legal and commercial decision. |

## 4.3 Differentiation

Vehicle-local journey access rather than requiring passengers to install an application.

Accountless passenger path for the core MVP transaction.

Payment truth derived from server-side provider evidence rather than screenshots.

Direct settlement to the approved merchant rather than HotPesa custody.

Operational design for Kenyan public-transport conditions, low-cost devices and intermittent connectivity.

Versioned fare governance, transaction audit and reconciliation integrated into the fare journey.

## 4.4 Business Model Direction

The recommended base case is organization-funded: operators and SACCOs pay for the operational value of managed fares, verification, reporting, support and governance. Candidate pricing includes monthly fleet or SACCO subscriptions, enterprise licensing, setup and integration fees, and carefully reviewed service fees. Passenger charges, advertising, M-Pesa commissions, lending, insurance and monetization of passenger data are not assumed in the base case.

<br>

# 5 Business Objectives

| ID | Objective | Business outcome | Evidence |
| --- | --- | --- | --- |
| BO-001 | Passenger safety | Remove the need for supported passengers to hand a phone to crew during fare payment. | Pilot observation and incident reporting. |
| BO-002 | Payment trust | Provide payment status based on trusted provider evidence. | Percentage of confirmed records with valid evidence and no duplicate value recognition. |
| BO-003 | Operational speed | Reduce avoidable fare-entry and verification delay. | Baseline and pilot median completion time; target approved before pilot. |
| BO-004 | Revenue assurance | Reduce fake-confirmation and unlinked-payment exposure. | Exception, dispute and reconciliation variance rates. |
| BO-005 | Fare transparency | Show the applicable controlled fare before initiation. | Fare-display compliance and fare-dispute rate. |
| BO-006 | Operator visibility | Provide timely journey, payment and exception records. | Availability and completeness of trip-level reporting. |
| BO-007 | Inclusive access | Support accountless access on common low-cost smartphones. | Supported-browser completion and accessibility test results. |
| BO-008 | Privacy | Minimize passenger personal data and prevent unnecessary disclosure. | Data inventory, redaction test results and privacy incidents. |
| BO-009 | Resilience | Operate safely under intermittent connectivity without false settlement claims. | Offline/reconnect test outcomes and incorrect-confirmation count. |
| BO-010 | Commercial validation | Establish willingness to adopt and pay within a controlled pilot. | Signed pilot terms, usage, retention and pricing evidence. |
| BO-011 | Scalable governance | Create repeatable operator onboarding, fare approval and support controls. | Completion of onboarding and operational readiness gates. |
| BO-012 | Compliance readiness | Resolve payment, consumer and data-protection obligations before production. | Documented legal, ODPC/privacy, Safaricom and sponsor approvals. |

<br>

# 6 Stakeholders

| Stakeholder | Category | Role and decisions | Primary need |
| --- | --- | --- | --- |
| Passenger | Primary user | Review journey and fare, initiate payment, receive honest status and receipt. | Safe, simple, private, transparent and accessible experience. |
| Conductor | Primary operational user | Open or close journey sessions, assist discovery, monitor status and record exceptions. | Fast verification without handling passenger phones or declaring unconfirmed payments paid. |
| Driver | Operational stakeholder | Support safe service operation and incident response. | Minimal distraction; role remains limited in MVP unless pilot approves more. |
| PSV owner or fleet manager | Business customer | Monitor vehicles, trips, revenue evidence, crew and exceptions. | Revenue visibility, accountability and service continuity. |
| SACCO or bus company | Sponsor/customer candidate | Approve fares, operations, merchant arrangement and governance. | Controlled rollout, reporting, member oversight and commercial value. |
| Finance and reconciliation team | Control function | Compare provider, platform and operator records; resolve exceptions. | Complete evidence, segregation of duties and auditable resolution. |
| Operations/support | Service function | Onboard users, support devices and manage incidents. | Clear procedures, observability and escalation. |
| HotPesa product owner | Accountable owner | Own scope, value, prioritization and stakeholder decisions. | Evidence-led delivery and controlled change. |
| Engineering/security | Delivery and assurance | Build and operate the system within approved controls. | Traceable requirements, test evidence and secure architecture. |
| Safaricom/payment provider | External dependency | Provide payment APIs, onboarding, status evidence and settlement rail. | Contractual, technical and operational compliance. |
| Regulators and oversight bodies | External authority | Apply relevant payment, data, consumer and transport obligations. | Accurate classification, lawful processing and accountable operations. |
| Auditors/assurance reviewers | Independent assurance | Review financial, security, privacy and operational evidence. | Reliable records and controlled access. |

## 6.1 Governance and Accountability

| Decision domain | Accountable role | Required consultation |
| --- | --- | --- |
| MVP scope and pilot exit | Product sponsor / steering authority | Product, operator, engineering, finance, security and legal. |
| Fare approval | Authorized SACCO/operator role | Operations, finance and affected route owners. |
| Payment model and settlement | Sponsor and authorized merchant owner | Finance, legal, Safaricom and engineering. |
| Personal-data processing | Data controller and privacy authority | Security, product, legal and operations. |
| Production release | Designated release authority | Quality, security, operations, finance, product and legal. |
| Incident severity and notification | Incident owner under approved plan | Security, privacy, operator, provider and legal as applicable. |

<br>

# 7 Current State Process

## 7.1 Typical Passenger Fare Journey

| Step | Current activity | Control weakness |
| --- | --- | --- |
| 1 | Passenger boards and asks or is told the fare. | Fare may be verbal, variable or not independently visible. |
| 2 | Passenger chooses cash or manual M-Pesa payment. | No consistent link to vehicle, trip, route segment and approved fare. |
| 3 | Passenger enters merchant details or may hand over the phone. | Input errors, privacy exposure and unsafe custody. |
| 4 | Passenger submits payment or presents cash. | Provider delay or change shortage can slow service. |
| 5 | Conductor inspects SMS, screenshot, phone or verbal evidence. | Evidence may be incomplete, delayed, duplicated or falsified. |
| 6 | Passenger is accepted as paid or dispute continues. | Decision may lack an auditable provider-backed record. |
| 7 | Crew and owner reconcile later using cash, messages or summaries. | Transaction-to-journey traceability and exception ownership are weak. |

## 7.2 Current Operator Process

Owners and SACCOs may receive totals through manual handover, till or paybill statements, crew reports and informal explanations of exceptions. Where digital records exist, they may not contain the journey session, fare version, vehicle, conductor and provider-event chain required for reliable operational analysis.

## 7.3 Current Exception Process

Payment prompt not received or provider unavailable.

Passenger debited but crew cannot see confirmation.

Message received late after the vehicle journey has moved on.

Duplicate or repeated payment attempt.

Wrong amount, wrong account or wrong journey.

Cash accepted as an informal fallback.

Dispute escalated without a complete evidence trail.

<br>

# 8 Current State Challenges

| ID | Challenge | Business impact | Severity |
| --- | --- | --- | --- |
| CH-001 | Passenger safety and privacy | Phone handover and visible personal activity create avoidable exposure. | High |
| CH-002 | Fraud and fake evidence | Manual visual verification is not a reliable settlement control. | High |
| CH-003 | Fare dispute | A passenger may not see a controlled fare before payment. | High |
| CH-004 | Reconciliation | Provider, trip and crew records may not align at transaction level. | High |
| CH-005 | Connectivity | Weak networks delay provider evidence and create ambiguous status. | High |
| CH-006 | Operational throughput | Manual entry and checking slow fare collection. | Medium/High |
| CH-007 | Data quality | Journey, stage, vehicle and payment references may be incomplete. | Medium/High |
| CH-008 | Support burden | Disputes are difficult to investigate without an event timeline. | Medium |
| CH-009 | Accessibility | Existing flows may be difficult on low-cost devices or for users with impairments. | Medium |
| CH-010 | Management insight | Delayed summaries limit timely intervention and planning. | Medium |

## 8.1 Consequence if No Action Is Taken

Without a controlled intervention, operators are likely to continue combining cash, informal M-Pesa procedures and manual reconciliation. The business will remain exposed to avoidable payment disputes, passenger safety concerns, weak fare governance, limited evidence for revenue assurance and difficulty scaling consistent digital operations.

<br>

# 9 Proposed Future State

## 9.1 Target Operating Model

Each active vehicle journey is represented by a scoped session linked to an approved operator, vehicle, route, direction, fare version and authorized workforce user. The passenger enters through a QR code or short address, receives sufficient context to recognize the intended journey, reviews the fare, and initiates a provider payment. HotPesa records the attempt and provider evidence, while the API remains authoritative for payment state.

| Stage | Future-state behavior | Business control |
| --- | --- | --- |
| Journey preparation | Authorized user selects the vehicle, route and approved fare context. | Role authorization and versioned configuration. |
| Passenger discovery | Passenger scans a journey QR code or uses a short address. | Scoped, expiring and recognizable journey session. |
| Fare review | Passenger sees route/vehicle context and applicable fare. | No hidden or client-computed fare. |
| Payment initiation | Passenger submits a synthetic or approved phone reference and confirms initiation. | Idempotency key and server-side payment-attempt record. |
| Pending | The interface clearly states that payment is not yet confirmed. | Neutral visual treatment; no success language. |
| Provider evidence | Server validates and records callback or status-query evidence. | Duplicate, delayed and conflicting evidence controls. |
| Decision | Payment becomes confirmed, failed, expired or review-required. | Only trusted server-side evidence may confirm. |
| Operations | Conductor and admin views show the appropriate status and exception actions. | Least privilege, redaction and audit. |
| Reconciliation | Missed callbacks are checked and provider/platform records compared. | Controlled repair without inventing success. |
| Reporting | Authorized management views summarize trips, payments and exceptions. | Data minimization and defined reporting ownership. |

## 9.2 Payment State Semantics

| State | Business meaning | Prohibited interpretation |
| --- | --- | --- |
| created | A HotPesa payment-attempt record exists. | The passenger has paid. |
| initiating | A provider request is being attempted. | An M-Pesa prompt or debit is confirmed. |
| pending | Trusted final evidence has not arrived. | Treating timeout, hotspot access or client text as success. |
| confirmed | Trusted provider evidence confirms the approved payment. | Confirmation based only on a screenshot or local event. |
| failed | Trusted evidence reports failure. | Automatically retrying in a way that risks duplicate charging. |
| expired | The allowed waiting period ended without confirmation. | Assuming the provider can never send late evidence. |
| review-required | Evidence is conflicting, late or operationally exceptional. | Silent automatic resolution without authorized review. |

## 9.3 Future State Principles

Passenger account is not mandatory for the core fare-payment path.

HotPesa does not hold funds or maintain passenger stored value in MVP.

Local/offline operation supports discovery and non-financial continuity, not settlement.

Fares are versioned, effective-dated, approved and auditable.

Payment initiation, provider evidence, state transition and reconciliation remain separate records.

Sensitive information is minimized, redacted and access-controlled.

Every material exception has an owner, timeline and resolution evidence.

<br>

# 10 Business Requirements

The following business requirements define the outcomes the product must enable. Product, functional, data, interface, security and test specifications shall trace to these identifiers.

## 10.1 Passenger Safety and Access

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-PAX-001 | The service shall allow a passenger to access the supported fare journey without handing a phone to crew. | Must |
| BR-PAX-002 | The core passenger journey shall not require account registration. | Must |
| BR-PAX-003 | The passenger shall see recognizable operator, vehicle or journey context before payment. | Must |
| BR-PAX-004 | The passenger shall see the applicable controlled fare before initiation. | Must |
| BR-PAX-005 | The passenger experience shall support common mobile browsers, small screens and accessible interaction. | Must |
| BR-PAX-006 | Passenger-facing status shall state what is known, unknown and safe to do next. | Must |

## 10.2 Journey and Fare Governance

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-JRN-001 | Authorized operators shall create, activate and close scoped journey sessions. | Must |
| BR-JRN-002 | Every journey session shall be linked to the responsible operator and vehicle context. | Must |
| BR-FAR-001 | Authorized operator roles shall define fares through a controlled catalogue. | Must |
| BR-FAR-002 | Fare changes shall be versioned, effective-dated and attributable to an approver. | Must |
| BR-FAR-003 | Historical transactions shall retain the fare version applied at initiation. | Must |
| BR-FAR-004 | The system shall prevent unauthorized or client-side fare alteration. | Must |

## 10.3 Payment Orchestration and Verification

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-PAY-001 | HotPesa shall orchestrate payment without holding passenger funds. | Must |
| BR-PAY-002 | Funds shall settle directly to the approved merchant arrangement. | Must |
| BR-PAY-003 | Every initiation shall create a unique server-side payment attempt. | Must |
| BR-PAY-004 | Repeated requests shall be idempotent and shall not create unintended duplicate obligations. | Must |
| BR-PAY-005 | Only trusted server-side provider evidence shall establish confirmed status. | Must |
| BR-PAY-006 | The payment lifecycle shall distinguish created, initiating, pending, confirmed, failed, expired and review-required. | Must |
| BR-PAY-007 | Duplicate and out-of-order provider events shall be handled without duplicate value recognition. | Must |
| BR-PAY-008 | Missed callbacks shall be eligible for controlled provider-status reconciliation. | Must |
| BR-PAY-009 | Conflicting or late evidence shall be placed under controlled review. | Must |
| BR-PAY-010 | Passenger and workforce views shall never present pending or offline activity as paid. | Must |

## 10.4 Conductor and Workforce Operations

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-OPS-001 | Authorized workforce users shall view active journeys and relevant payment status. | Must |
| BR-OPS-002 | The workflow shall minimize interaction steps during boarding and fare collection. | Must |
| BR-OPS-003 | Workforce users shall record permitted operational exceptions without modifying provider evidence. | Must |
| BR-OPS-004 | Journey closure shall prevent new passenger attempts while retaining outstanding evidence handling. | Must |
| BR-OPS-005 | Device loss, restart and reconnect procedures shall preserve or safely terminate session authority. | Must |
| BR-OPS-006 | The operator shall have documented fallback and passenger-support procedures. | Must |

## 10.5 Administration and Reconciliation

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-ADM-001 | Authorized administrators shall manage operators, vehicles, routes, fares and workforce permissions. | Must |
| BR-ADM-002 | Administrative changes shall be attributable and auditable. | Must |
| BR-ADM-003 | Finance users shall compare journey, HotPesa and provider payment evidence. | Must |
| BR-ADM-004 | Authorized users shall manage exceptions through defined statuses and reasons. | Must |
| BR-ADM-005 | High-risk actions shall require appropriate segregation, review or dual control. | Should |
| BR-ADM-006 | Configuration shall support a bounded pilot without enabling unapproved multi-operator clearing. | Must |

## 10.6 Reporting and Support

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-RPT-001 | Operators shall receive trip-level summaries of payment states and exceptions. | Must |
| BR-RPT-002 | Reports shall preserve the distinction between initiated, pending and confirmed value. | Must |
| BR-RPT-003 | Authorized support users shall access a redacted event timeline sufficient for investigation. | Must |
| BR-RPT-004 | Operational measures shall support pilot evaluation without collecting unnecessary passenger data. | Must |
| BR-RPT-005 | Exports and reports shall be access-controlled and logged. | Should |

## 10.7 Security Privacy and Governance

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-GOV-001 | The business shall minimize collection and retention of passenger personal data. | Must |
| BR-GOV-002 | Full phone numbers, secrets and raw provider payloads shall not appear in ordinary logs or dashboards. | Must |
| BR-GOV-003 | Workforce and administrative access shall follow least privilege. | Must |
| BR-GOV-004 | The service shall maintain evidence for material state transitions and privileged actions. | Must |
| BR-GOV-005 | Production use shall be blocked until legal, privacy, payment-provider and sponsor gates are satisfied. | Must |
| BR-GOV-006 | Security, privacy, operational and financial incidents shall follow approved response procedures. | Must |

## 10.8 Pilot and Commercial Readiness

| Requirement ID | Business requirement | Priority |
| --- | --- | --- |
| BR-PIL-001 | The initial launch shall be a bounded pilot with a named operator/SACCO, routes, devices and support owners. | Must |
| BR-PIL-002 | Pilot entry and exit criteria shall be approved before live passenger operation. | Must |
| BR-PIL-003 | Commercial terms shall state payer, fees, taxes, settlement, refunds, disputes and support responsibility. | Must |
| BR-PIL-004 | Pilot results shall be evaluated against approved safety, adoption, payment, reconciliation and service measures. | Must |
| BR-PIL-005 | Scale beyond the pilot shall require an evidence-based approval decision. | Must |

<br>

# 11 Business Rules

| Rule ID | Rule | Domain |
| --- | --- | --- |
| BRULE-001 | HotPesa shall not hold passenger funds or represent itself as a deposit-taking service. | Payment model |
| BRULE-002 | The approved merchant account shall receive settlement directly under the provider arrangement. | Payment model |
| BRULE-003 | A passenger account shall not be mandatory for the MVP fare path. | Passenger access |
| BRULE-004 | The server is the authority for journey, fare and payment state. | State authority |
| BRULE-005 | A payment is confirmed only after accepted trusted provider evidence. | Payment truth |
| BRULE-006 | Hotspot connectivity, client messages, screenshots and initiated prompts are not settlement evidence. | Payment truth |
| BRULE-007 | Each payment attempt shall have a unique identifier and idempotency protection. | Payment integrity |
| BRULE-008 | Duplicate provider evidence shall not create a second state transition or duplicate value. | Payment integrity |
| BRULE-009 | Conflicting terminal evidence shall result in review-required unless an approved rule determines otherwise. | Exception |
| BRULE-010 | Late evidence shall be retained and assessed; expiry shall not erase evidence. | Exception |
| BRULE-011 | Fare values shall come from an approved, active and effective fare version. | Fare governance |
| BRULE-012 | A fare update shall not rewrite historical transactions. | Fare governance |
| BRULE-013 | Journey access tokens shall be scoped, time-limited and invalid after closure according to policy. | Session governance |
| BRULE-014 | A closed journey shall not accept new payment initiations. | Journey governance |
| BRULE-015 | Offline/local operation shall not create confirmed financial state. | Resilience |
| BRULE-016 | Only permitted non-financial activities may be queued offline. | Resilience |
| BRULE-017 | Passenger data shall be limited to what is necessary for payment and support. | Privacy |
| BRULE-018 | Phone references displayed outside restricted payment operations shall be masked. | Privacy |
| BRULE-019 | Raw credentials, tokens, passkeys and production callback payloads shall never be logged. | Security |
| BRULE-020 | Privileged configuration and exception resolution shall be attributable to an authorized user. | Audit |
| BRULE-021 | Reports shall not combine pending and confirmed value. | Reporting |
| BRULE-022 | Production credentials shall be separated from development and sandbox environments. | Environment |
| BRULE-023 | Real passenger data shall not be used in development or automated tests. | Data governance |
| BRULE-024 | Refunds, reversals and disputed settlement shall follow approved provider and operator procedures. | Operations |
| BRULE-025 | Any expansion to wallet, credit, insurance, advertising or cross-operator clearing requires separate approval. | Scope control |

<br>

# 12 Business Benefits

| Beneficiary | Capability benefit | Expected business value |
| --- | --- | --- |
| Passengers | Reduced phone handover, clearer fares, simpler entry, honest status and digital reference. | Safety, convenience, transparency and trust. |
| Conductors | Less manual merchant entry and message inspection; clearer exception handling. | Faster operation and fewer disputes. |
| Owners/fleet managers | Journey-linked payment and exception visibility. | Accountability, earlier intervention and better reconciliation. |
| SACCOs/bus companies | Controlled fares, operator reporting and governed rollout. | Institutional oversight and digital-service capability. |
| Finance teams | Provider evidence, idempotent records and reconciliation workflows. | Reduced ambiguity and stronger audit evidence. |
| Support teams | Redacted event timelines and defined states. | Faster, safer dispute investigation. |
| HotPesa business | Validated transport-payment proposition and repeatable operator model. | Commercial learning and scalable intellectual property. |
| Public interest | Potential reduction in cash handling and informal verification practices. | Improved passenger protection and operational transparency, subject to evidence. |

## 12.1 Benefit Realization Conditions

Passengers can discover and complete the journey without excessive assistance.

Provider evidence is reliable, timely and reconciled.

Operators adopt controlled fare and device procedures.

Support and incident ownership are funded and practiced.

Commercial pricing does not introduce hidden passenger harm or undermine adoption.

Privacy and regulatory decisions are completed before production.

<br>

# 13 Success Measures and Key Performance Indicators

Baseline values and numerical targets shall be approved during pilot planning. The BRD defines measures now but does not invent targets where field evidence is unavailable.

| ID | Measure | Definition | Target treatment |
| --- | --- | --- | --- |
| KPI-SAF-001 | Phone handover incidents | Count during supported journeys | Zero is the intended design outcome; pilot target to approve. |
| KPI-PAY-001 | Verified payment completion | Confirmed attempts / valid initiated attempts | Separate provider decline, timeout and abandonment. |
| KPI-PAY-002 | Confirmation time | Time from accepted initiation to trusted terminal evidence | Report median and high percentile. |
| KPI-PAY-003 | Duplicate-value prevention | Duplicate events causing duplicate recognition | Target zero. |
| KPI-REC-001 | Reconciliation variance | Difference between platform and provider confirmed totals | Threshold requires finance approval. |
| KPI-REC-002 | Unresolved exception age | Time review-required items remain open | Service target requires owner. |
| KPI-FAR-001 | Fare dispute rate | Fare disputes per 1,000 supported fares | Compare with pre-pilot baseline. |
| KPI-OPS-001 | Passenger completion time | Journey entry to terminal/exit outcome | Segment by device/network. |
| KPI-OPS-002 | Journey-session availability | Time valid sessions are accessible during operation | Exclude approved maintenance. |
| KPI-UX-001 | Independent completion | Passengers completing without staff handling the phone | Observe with consent and minimal data. |
| KPI-UX-002 | Accessibility defects | Blocking/high-severity accessibility findings | Resolve before production release. |
| KPI-PRIV-001 | Sensitive-data exposure | Confirmed unauthorized disclosure events | Target zero; follow incident process. |
| KPI-COM-001 | Pilot adoption | Eligible fares completed through the supported flow | Target agreed with operator. |
| KPI-COM-002 | Commercial willingness | Approved continuation or paid commitment after pilot | Evidence-based scale decision. |
| KPI-SUP-001 | Support resolution | Resolution time by incident/exception severity | Targets defined in operating model. |

## 13.1 Measurement Governance

KPI definitions, data sources, calculation owners, exclusions, collection frequency and decision thresholds shall be recorded before pilot commencement. Metrics shall not encourage premature payment confirmation, hidden retry behavior, unnecessary personal-data collection or unsafe pressure on conductors and passengers.

<br>

# 14 Project Scope

## 14.1 MVP Scope

| Capability | Included business scope |
| --- | --- |
| Passenger access | QR/short-address journey entry; accountless mobile web path; journey and fare display. |
| Android conductor host | Vehicle-local hotspot/session operation, journey controls and operational status. |
| Journey and fare | Operator, vehicle, route, direction, stage/segment and versioned approved fare context. |
| Payment | M-Pesa provider adapter, initiation, trusted evidence, seven-state lifecycle and digital reference. |
| Reconciliation | Duplicate handling, status query, missed-callback recovery and review-required workflow. |
| Administration | Development-to-pilot operator, vehicle, route, fare, journey, workforce and exception administration. |
| Reporting | Basic journey, payment-state, exception, reconciliation and audit reporting. |
| Security/privacy | Managed workforce identity direction, application authorization, redaction, audit and environment separation. |
| Operations | Pilot onboarding, device procedures, support, monitoring, incident response and demonstration/runbook evidence. |
| Pilot | One controlled Kenyan operator/SACCO with approved routes, users, merchant arrangement and exit criteria. |

## 14.2 Phase 0 Proof Scope

Repository, environments, CI/CD and control evidence.

Browser-testable passenger and admin vertical slice using synthetic data.

Deterministic Mock M-Pesa scenarios for confirmed, failed, delayed, duplicate and missing callback behavior.

PostgreSQL durability, idempotency, reconciliation, audit and redaction proof.

No real money, live credentials or production authentication.

## 14.3 Post-MVP Candidate Scope

| Candidate | Current treatment |
| --- | --- |
| Richer fleet and workforce management | Evaluate after fare-payment pilot. |
| Refund and reversal operations | Define with provider and operator policy; may be required before production depending on live model. |
| Ticketing and QR receipt validation | Potential Phase 2 capability. |
| Advanced analytics and forecasting | Only after data quality, privacy and operational value are proven. |
| Additional operators and regions | Separate onboarding and scale approval. |
| Other payment providers/countries | Separate legal, commercial and technical assessment. |

<br>

# 15 Out of Scope

| Excluded item | Boundary |
| --- | --- |
| Wallet or stored value | HotPesa will not hold balances, deposits or passenger funds in MVP. |
| Credit, lending or pay-later | Requires separate licensing, risk and commercial approval. |
| Cross-SACCO clearing | No centralized settlement or inter-operator netting in MVP. |
| Dynamic or AI-generated pricing | Fares must be approved and versioned; no automated surge pricing. |
| Mandatory passenger accounts | The core transaction remains accountless. |
| Passenger biometrics | No facial, fingerprint or similar identity requirement. |
| Cash custody and reconciliation | HotPesa does not collect or hold cash. |
| Full seat booking | Intercity reservation and seat inventory are deferred. |
| Advertising and passenger-data monetization | Not included in the base business model. |
| Insurance and financing marketplace | Deferred and separately governed. |
| iOS conductor host | Android is the MVP workforce platform. |
| Replacement of M-Pesa/mobile networks | HotPesa is an orchestration layer, not a payment rail or telecom network. |
| Uncontrolled national rollout | Scale requires pilot evidence and formal approval. |
| Production deployment from Phase 0 | Mock and sandbox evidence does not constitute production authorization. |

<br>

# 16 Assumptions

| ID | Assumption | Validation | Status |
| --- | --- | --- | --- |
| A-001 | A meaningful share of target passengers can use Wi-Fi and a mobile browser. | Pilot device and usability testing | Open |
| A-002 | Passengers using M-Pesa have access to an eligible phone/SIM and provider service. | Provider/pilot validation | Open |
| A-003 | The pilot operator can identify and govern vehicles, routes, fares and workforce users. | Operator due diligence | Open |
| A-004 | A direct merchant-settlement arrangement can be approved. | Commercial/legal/provider confirmation | Open |
| A-005 | Vehicle devices can support the required hotspot/session workflow consistently. | Representative-device test matrix | Partially proven in Phase 0 |
| A-006 | Crew can operate the workflow without unacceptable distraction or boarding delay. | Field observation and training trial | Open |
| A-007 | The necessary passenger data can be minimized to an acceptable lawful set. | Privacy assessment | Open |
| A-008 | Operators value transaction-level evidence enough to support a sustainable price. | Commercial pilot | Open |
| A-009 | Support and incident roles can be assigned for pilot operating hours. | Operating agreement | Open |
| A-010 | English and Kiswahili terminology can cover the initial audience, with additional needs assessed. | Content research and usability testing | Open |

<br>

# 17 Dependencies

| ID | Dependency | Owner type | Effect |
| --- | --- | --- | --- |
| D-001 | Safaricom/Daraja sandbox and production onboarding | External | Blocks live integration and production. |
| D-002 | Approved merchant shortcode/till/paybill and settlement ownership | External/business | Blocks real-money pilot. |
| D-003 | Named pilot SACCO/operator and sponsor | Business | Blocks field validation. |
| D-004 | Legal classification and contractual review | Governance | Blocks production commitment. |
| D-005 | Data-protection assessment and controller/processor responsibilities | Governance | Blocks personal-data processing at pilot scale. |
| D-006 | Representative Android devices and network/SIM conditions | Operational | Required for hotspot and field evidence. |
| D-007 | Cloud, domain, TLS, monitoring and secret-management environment | Technical | Required for secure internet callback and pilot operations. |
| D-008 | Managed workforce identity provider selection | Technical/business | Required before production workforce access. |
| D-009 | Fare catalogue ownership and approval process | Operator | Required before passenger fare display. |
| D-010 | Support, incident, reconciliation and finance owners | Operational | Required before pilot go-live. |
| D-011 | Training and passenger communication materials | Operational | Required for safe adoption. |
| D-012 | Approved retention, deletion and audit policies | Governance | Required before production data retention. |

<br>

# 18 Constraints

| ID | Constraint | Required response |
| --- | --- | --- |
| C-001 | M-Pesa and internet connectivity cannot be guaranteed on every journey. | Use explicit pending states and reconciliation; never claim offline settlement. |
| C-002 | Android hotspot and captive-portal behavior varies by manufacturer and operating-system version. | Maintain a supported-device matrix and test fallback discovery. |
| C-003 | Passengers use diverse low-cost devices, browsers and accessibility settings. | Use a lightweight responsive PWA and progressive enhancement. |
| C-004 | Public transport operations are time-sensitive, crowded and mobile. | Minimize steps and avoid distracting crew interactions. |
| C-005 | The business cannot infer regulatory permission from technical feasibility. | Maintain formal external approval gates. |
| C-006 | Phase 0 uses mock/sandbox payment evidence and synthetic data. | Treat results as technical proof only. |
| C-007 | Pilot budget, staff and support capacity are not yet approved. | Bound the pilot and make resource approval an entry gate. |
| C-008 | HotPesa does not control provider outages or settlement timing. | Provide clear status, retry policy and support escalation. |
| C-009 | One operator’s fare and governance model may not generalize nationally. | Validate repeatability before scaling. |
| C-010 | Retention and reporting must remain proportionate to legitimate business need. | Minimize stored data and approve retention schedules. |

<br>

# 19 Risks

| ID | Risk | Impact | Likelihood | Primary response | Owner |
| --- | --- | --- | --- | --- | --- |
| R-001 | Provider outage or delayed evidence | High | High | Pending state, status query, reconciliation and passenger guidance. | Payment/Operations |
| R-002 | False confirmation shown to crew | Critical | Medium | Server authority, strict state machine, UI tests and audit. | Engineering/Security |
| R-003 | Duplicate charging or value recognition | Critical | Medium | Idempotency, evidence deduplication and controlled retry. | Payments |
| R-004 | Fake hotspot or phishing | High | Medium | Recognizable vehicle context, rotating sessions, TLS/internet boundary and passenger education. | Security/Operations |
| R-005 | Fare manipulation | High | Medium | Versioned fares, authorization, approval and immutable history. | Operator/Product |
| R-006 | Exposure of phone or payment data | High | Medium | Minimization, masking, redacted logs, access control and incident response. | Privacy/Security |
| R-007 | Lost or compromised conductor device | High | Medium | Managed identity, revocation, short-lived session authority and device procedure. | Operations/Security |
| R-008 | Weak-network abandonment | Medium/High | High | Lightweight PWA, transparent retry guidance and measured timeout behavior. | Product/Engineering |
| R-009 | Operator resistance or workflow bypass | High | Medium | Co-design, training, incentives, monitoring and manageable fallback. | Product/Operator |
| R-010 | Reconciliation mismatch | High | Medium | Provider evidence ledger, daily controls and owned exception queue. | Finance |
| R-011 | Regulatory or contractual non-compliance | Critical | Medium | Legal, privacy, provider and sponsor release gates. | Sponsor/Legal |
| R-012 | Inadequate incident support | High | Medium | Named coverage, runbooks, severity model and escalation contacts. | Operations |
| R-013 | Accessibility exclusion | Medium/High | Medium | Accessible content, keyboard/screen-reader/reduced-motion tests and field validation. | Product/UX |
| R-014 | Pilot data misinterpreted | Medium | Medium | Predefined KPI formulas, exclusions and independent review. | Product/Analytics |
| R-015 | Premature scale or scope expansion | High | Medium | Traceability, change control and evidence-based phase gates. | Steering authority |
| R-016 | Commercial model harms adoption | High | Medium | Transparent pricing research and operator/passenger impact review. | Commercial |

## 19.1 Risk Acceptance

Critical and high residual risks require an accountable owner, treatment evidence and explicit acceptance before the applicable pilot or production gate. Technical implementation alone cannot accept legal, payment-provider, operational or commercial risk on behalf of the sponsor.

<br>

# 20 Regulatory and Business Considerations

## 20.1 Data Protection and Privacy

Before pilot processing of real passenger or workforce information, the responsible legal entity shall determine controller and processor roles, lawful bases, notices, data-subject handling, retention, deletion, cross-border processing, vendor obligations and incident procedures under applicable Kenyan data-protection requirements. This BRD does not provide a legal conclusion or substitute for qualified review.

## 20.2 Payment and Financial Classification

HotPesa is designed as a non-custodial orchestration and verification service with direct merchant settlement. The sponsor shall obtain appropriate legal and provider confirmation that the operating model, commercial fees, reconciliation, refunds, disputes and records are permissible. No statement in this BRD authorizes payment-service activity requiring an unconfirmed licence or approval.

## 20.3 Consumer Transparency

Display the fare and responsible operator before initiation.

Do not obscure fees, payment state, retry consequences or support route.

Provide a clear reference for disputes and avoid misleading success language.

Define treatment of wrong payments, reversals, refunds and delayed confirmations.

## 20.4 Operator and Transport Governance

The pilot agreement shall identify the approved operator, vehicles, routes, fare authority, merchant, workforce roles, training obligations, device responsibility, support coverage, incident escalation, data access and termination arrangements. Transport-sector permissions and operator governance remain external validation items.

## 20.5 Records and Auditability

The system shall preserve proportionate evidence of approved fare versions, payment attempts, provider events, state transitions, reconciliation actions and privileged configuration changes. Retention duration and access shall be approved rather than assumed.

## 20.6 Accessibility and Inclusion

The service should provide clear language, sufficient contrast, keyboard and assistive-technology support, reduced-motion behavior and usable touch targets. English and Kiswahili content requirements shall be validated with the pilot audience. An inaccessible digital-only process shall not be treated as an acceptable universal replacement without an approved alternative.

<br>

# 21 Approval and Sign Off

## 21.1 Approval Statement

Approval of this BRD confirms agreement with the business problem, intended value, objectives, numbered business requirements, MVP boundaries, governing rules and validation gates. It authorizes detailed requirements and controlled implementation within those boundaries. It does not authorize live M-Pesa operation, production deployment, regulatory claims, paid cloud commitments or national rollout.

## 21.2 Conditions of Approval

| Condition | Required evidence | Status |
| --- | --- | --- |
| Sponsoring entity and accountable executive | Named entity, sponsor and governance authority | Decision required |
| Pilot operator/SACCO | Signed scope, routes, vehicles, fares, roles and support model | Decision required |
| Commercial model | Approved payer, pricing, taxes, settlement and dispute responsibilities | Decision required |
| Payment-provider readiness | Sandbox completion followed by production onboarding evidence | Validation required |
| Privacy and legal review | Recorded assessment and release conditions | Validation required |
| Security and operations readiness | Threat model, incident plan, monitoring and access controls | Validation required |
| Pilot KPI targets | Approved baselines, thresholds and exit criteria | Decision required |
| MVP scope | Formal acceptance of inclusions and exclusions | Approval required |

## 21.3 Formal Sign Off

| Role | Name | Decision | Signature | Date |
| --- | --- | --- | --- | --- |
| Project Sponsor |  | Approve / Conditionally approve / Reject |  |  |
| Product Owner |  | Approve / Conditionally approve / Reject |  |  |
| Pilot Operator Representative |  | Approve / Endorse / Not applicable |  |  |
| Finance/Commercial |  | Approve / Endorse / Conditions |  |  |
| Legal/Compliance |  | Endorse / Conditions / Pending |  |  |
| Security/Privacy |  | Endorse / Conditions / Pending |  |  |

<br>

# Appendix A Glossary

| Term | Meaning |
| --- | --- |
| Authoritative confirmation | A server-side status supported by accepted provider evidence. |
| Conductor host | The Android workforce device that supports the journey session and local passenger access. |
| Daraja | Safaricom API platform considered for M-Pesa integration, subject to onboarding and approved terms. |
| Evidence event | A durable record of provider callback, status query or other trusted input used to evaluate state. |
| Fare version | An approved fare definition with effective dates and audit history. |
| Hotspot | Vehicle-local Wi-Fi connectivity used for discovery or session exchange; not payment confirmation. |
| Idempotency | The property that safely repeating the same request does not create unintended duplicate effects. |
| Journey session | A scoped representation of an active vehicle journey and fare context. |
| M-Pesa | External mobile-money payment rail; HotPesa does not replace it. |
| Mock M-Pesa | Internal deterministic test adapter that moves no real money. |
| Non-custodial | HotPesa does not hold passenger funds or stored value. |
| Passenger PWA | Lightweight web experience opened in a compatible mobile browser. |
| Reconciliation | Comparison and controlled repair of platform and provider payment evidence. |
| Review-required | A state for conflicting, late or exceptional evidence requiring authorized assessment. |
| SACCO | Savings and Credit Cooperative Organization; in this context, a public-transport operating/governance organization. |
| Trusted evidence | Provider-derived evidence accepted under the approved integration and security controls. |

<br>

# Appendix B Decision Register

| ID | Decision | Status | Owner | Next action |
| --- | --- | --- | --- | --- |
| DEC-001 | HotPesa is non-custodial; funds settle directly to the approved merchant. | Approved baseline | Product owner | Reconfirm in legal/provider review. |
| DEC-002 | Core passenger journey is accountless. | Approved baseline | Product owner | Retain through MVP. |
| DEC-003 | Android conductor host plus passenger PWA is the MVP channel model. | Approved baseline | Product/Architecture | Validate supported devices. |
| DEC-004 | Only trusted server-side provider evidence may confirm payment. | Approved baseline | Product/Payments | Non-negotiable payment truth. |
| DEC-005 | Offline/local operation cannot confirm settlement. | Approved baseline | Product/Payments | Non-negotiable payment truth. |
| DEC-006 | Initial deployment is one controlled Kenyan pilot. | Approved baseline | Product owner | Pilot partner still to approve. |
| DEC-007 | Named pilot operator and routes. | Open | Sponsor/Product | Required before field pilot. |
| DEC-008 | Production merchant account and settlement ownership. | Open | Finance/Legal | Required before live M-Pesa. |
| DEC-009 | Commercial pricing model. | Open | Commercial/Sponsor | Research and pilot negotiation. |
| DEC-010 | Managed workforce identity vendor. | Open | Architecture/Security | Select before production. |
| DEC-011 | Retention schedule and data roles. | Open | Privacy/Legal | Complete privacy assessment. |
| DEC-012 | Quantitative KPI targets and pilot exit thresholds. | Open | Steering authority | Approve during pilot planning. |

<br>

# Appendix C Business Traceability Summary

| Business objective | Primary requirements | Downstream evidence |
| --- | --- | --- |
| BO-001 | BR-PAX-001, BR-PAX-006 | Passenger flow, safety procedure and usability evidence. |
| BO-002 | BR-PAY-003 to BR-PAY-010 | Payment state machine, provider evidence, idempotency and reconciliation tests. |
| BO-003 | BR-PAX-003 to BR-PAX-006; BR-OPS-002 | Timing and field usability evidence. |
| BO-004 | BR-PAY-004 to BR-PAY-009; BR-ADM-003 | Duplicate, conflict and reconciliation evidence. |
| BO-005 | BR-FAR-001 to BR-FAR-004 | Fare approval and historical trace tests. |
| BO-006 | BR-RPT-001 to BR-RPT-005 | Journey, exception and audit reporting. |
| BO-007 | BR-PAX-002, BR-PAX-005 | Supported device and accessibility evidence. |
| BO-008 | BR-GOV-001, BR-GOV-002 | Data inventory, redaction and privacy review. |
| BO-009 | BR-OPS-005; BR-PAY-008, BR-PAY-010 | Reconnect, delayed callback and no-false-confirmation tests. |
| BO-010 | BR-PIL-003 to BR-PIL-005 | Pilot commercial evidence and scale decision. |
| BO-011 | BR-ADM-001 to BR-ADM-006; BR-PIL-001 | Operator onboarding and governance evidence. |
| BO-012 | BR-GOV-005, BR-PIL-002 | Recorded release-gate approvals. |

<br>

# BRD Completion and Review Checklist

| Review item | Status |
| --- | --- |
| Business problem and Kenyan context are clearly stated | Complete |
| Stakeholders and decision ownership are identified | Complete; named individuals pending |
| Objectives and business requirements have stable identifiers | Complete |
| MVP inclusions and exclusions are explicit | Complete |
| Payment truth and non-custodial boundaries are explicit | Complete |
| Assumptions, dependencies, constraints and risks are recorded | Complete |
| Success measures are defined | Complete; numerical targets pending |
| Regulatory and privacy matters are not presented as legal conclusions | Complete |
| Pilot partner, commercial terms and settlement arrangement are approved | Pending |
| Formal sign-off is recorded | Pending |

Next controlled action: stakeholder review shall resolve the open decision register, approve or conditionally approve the MVP scope, and authorize synchronization of the PRD, FRS, user stories, architecture, data/API, application-flow, UI/UX, security/NFR, implementation and traceability documents.
