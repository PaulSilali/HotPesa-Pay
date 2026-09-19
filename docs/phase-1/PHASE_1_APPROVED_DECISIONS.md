# HotPesa Phase 1 Approved Implementation Decisions

Approval record: **approved by the project owner in the Phase 1 Decision Closure Pass**.  
Scope: implementation gates for the first trip/fare/payment vertical slice.  
Authority boundary: this record authorizes Phase 1 engineering preparation; it does not
rewrite controlled DOCX sources or select a production payment provider, hosting region,
settlement model, legal policy or privacy policy.

## Approved decisions

| ID | Approved decision | Source basis |
| --- | --- | --- |
| P1-DEC-001 | Use a provider-agnostic managed OIDC integration boundary for workforce identity. The specific commercial provider is not selected by this approval and remains a separate external/vendor gate. The pilot login must support MFA, suspension/revocation, audit export and device enrollment. | ADR-017; SEC-IAM-*; SEC-DEV-001 |
| P1-DEC-002 | HotPesa owns an opaque tenant identifier and workforce mapping from external identity subject to tenant membership, application role and assignment. Authorization is enforced in the API, not delegated to provider groups. Tokens may carry identity claims, but resource authorization is resolved by HotPesa. | ADR-017; SEC-AUTHZ-001; TRD AP-006 |
| P1-DEC-003 | A conductor may start only an assignment valid for that conductor, tenant, vehicle, route and direction at the requested time. Phase 1 permits at most one active operating assignment per conductor and per vehicle; overlapping assignments are rejected. SACCO Operations creates, modifies and revokes assignments; revocation prevents new starts and preserves history. No separate shift entity is introduced until required by evidence. | FR-JRN-001/003; FR-ADM-003; US-CON-001; US-OPS-002 |
| P1-DEC-004 | SACCO Operations creates fare definitions. A separate authorized fare approver reviews and activates them; creator and approver must be different people for Phase 1. Activation records approver, decision time and reason. HotPesa enforces the workflow and audit but does not own the operator’s commercial fare decision. | FR-FAR-001/002/004/005; US-FAR-001/002; OD-005 |
| P1-DEC-005 | Effective dates use `Africa/Nairobi` business time and half-open intervals (`effectiveFrom` inclusive, `effectiveTo` exclusive). Active fare definitions for the same tenant, route, direction and destination/stage context may not overlap. A new approved version supersedes the prior active version at its effective boundary. | FR-FAR-002/004/006; PR-FAR-003 |
| P1-DEC-006 | An active trip captures the approved fare schedule/version context at trip start. Each passenger destination quote is calculated only from that captured context; later fare publication does not rewrite the active trip or existing attempts. | ADR-009; FR-FAR-006/007/008; US-FAR-003/004 |
| P1-DEC-007 | The assigned conductor normally closes the trip. SACCO Operations may override or close on the conductor’s behalf. Any override and any close with unresolved attempts requires an attributable reason and audit event. Drivers cannot close trips as part of their driving role. | FR-JRN-009/010; US-CON-008/009; US-DRV-002 |
| P1-DEC-008 | A trip may close with pending or review-required attempts only when the closer supplies the required exception reason. Existing attempts remain processable after closure; closure blocks new attempts but does not discard late trusted evidence. Failed and expired attempts remain separate non-revenue states. | FR-JRN-009/010; FR-REC-*; US-CON-008; US-FIN-005 |
| P1-DEC-009 | Phase 1 trip summaries include counts by payment state, confirmed digital revenue amount, total payment-attempt count and exception count. Only `confirmed` attempts contribute to confirmed revenue. Passenger count is not treated as an authoritative financial measure. Cash, refund and reversal fields are excluded from this slice because cash custody and production refund/reversal are outside approved MVP scope. | FR-RPT-001/002; US-FIN-005; US-RPT-001; PRD exclusions; OD-006 |
| OD-FRS-004 | Pending payments become eligible for automated reconciliation after approximately 30 seconds. Phase 1 permits five reconciliation attempts with progressive 30-second, 1-minute, 2-minute, 5-minute and 10-minute delays. Exhaustion moves an unresolved attempt to `review-required`, never `failed` or `expired`; authorized manual reconciliation remains available. Late trusted confirmation or failure remains authoritative and idempotent. Retry values are technically configurable; production changes require controlled Product/Finance/Operations approval. | FR-COM-005/010; FR-PAY-002/009–014; FR-OFF-005; OD-FRS-004 approval |

## Approval limits and synchronization gate

- This approval does not select a named OIDC vendor or production provider.
- The exact token/session wire shape, identifier formats and persistence schema remain implementation details constrained by the decisions above.
- The controlled ADR/FRS/USUC/DMAC synchronization process must record these decisions before they are treated as durable controlled-specification authority.
- No production credentials, live M-Pesa integration, physical-device proof, hosting choice or legal/privacy conclusion is implied.

## Implementation consequence

The Phase 1 trip/fare implementation gate is open for a bounded development slice using
synthetic data and Mock M-Pesa, subject to updating the controlled decision/specification
register and the traceability matrix before claiming acceptance.
