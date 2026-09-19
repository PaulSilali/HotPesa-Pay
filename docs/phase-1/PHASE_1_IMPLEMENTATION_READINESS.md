# Phase 1 Implementation Readiness

Overall status: **BLOCKED pending human decisions**. This is a readiness assessment, not
approval to implement or a claim of Phase 1 completion.

| Area | Status | Exact blocker |
| --- | --- | --- |
| Authentication | BLOCKED | ADR-017 leaves the managed OIDC provider, provisioning/login mechanism, subject-to-tenant mapping, claims and device/session constraints open. |
| Conductor assignment | BLOCKED | Assignment cardinality, temporal/shift model, creator/modifier authority and revocation behavior are not specified. |
| Route/stage contract | BLOCKED | Route/direction/stage concepts are established, but canonical identifiers, publication/version lifecycle and stage mutation rules are not contractually defined. |
| Fare contract | BLOCKED | Fare version fields are established, but creator/approver identity, date boundaries/timezone and overlap mechanics remain open. |
| Fare governance | BLOCKED | FR-FAR-004/005 require approval and audit, while exact approver/publisher and creator/approver separation remain undecided. |
| Trip start | BLOCKED | Requires authenticated assigned conductor, same-tenant vehicle/route/direction and valid operating context; the authorization and assignment contract is not approved. |
| Payment association | READY for a bounded extension | Phase 0 already links payment attempts to journey, amount, currency and fare version and has trusted-evidence/idempotency behavior. Trip ID and destination/stage linkage still require the trip/fare contract. |
| Trip closure | BLOCKED | FR-JRN-009/010 require authorized closure, unresolved-attempt handling and audit, but closer, override, exception-reason and close-state rules are open. |
| Trip summary | BLOCKED | State separation and confirmed-only revenue are established, but exact summary fields and cash/refund/reversal treatment are not approved. |

## Exact questions requiring human answers

1. Which managed OIDC provider, login/provisioning workflow and device/session constraints are approved for the pilot?
2. What tenant identifier and workforce subject mapping does HotPesa own?
3. What roles may create, modify, revoke and override conductor assignments, and may assignments overlap?
4. Who creates, approves and activates fares? Must creator and approver be different people, and when?
5. What timezone and boundary rules govern effective dates and overlap prevention?
6. Does an active trip capture one approved fare version at start, or does each passenger quote use the effective fare for its context?
7. Who normally closes a trip, who may override closure, and what reason is mandatory?
8. May a trip close with pending or review-required attempts? If yes, which exception evidence is required?
9. Which summary fields are required: state counts, confirmed amount, passenger count, payment count and exception count? Confirm that cash, refund and reversal fields remain excluded or define their approved representation.

## Proposed synchronization changes after answers

Update the controlled decision/specification process for ADR-017, the TRD open-decision
register and the relevant FRS/USUC/DMAC sections. Then update versioned contracts,
`MASTER_TRACEABILITY_MATRIX.md` and this package. No controlled DOCX is modified here.
