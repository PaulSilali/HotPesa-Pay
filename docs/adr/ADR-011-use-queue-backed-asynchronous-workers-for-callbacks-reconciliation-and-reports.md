# ADR-011 Use queue backed asynchronous workers for callbacks reconciliation and reports

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Recommended for approval |
| Scope | Asynchronous processing |
| Accountable owner | Backend and Platform Leads |
| Required gate | Approve before Phase 6 |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Provider callbacks can burst or be retried; status checks and reports may be slow. Synchronous request handling alone can amplify failure and timeouts.

## Decision

Persist inbound evidence before acknowledgment, then process idempotently through durable queue-backed workers. Use bounded retries, dead-letter/review handling, backpressure and observable lag. Keep simple critical state changes transactional where appropriate.

## Alternatives considered

All synchronous processing; database polling only; unmanaged in-memory queue; immediate microservices split.

## Rationale

Durable asynchronous work absorbs bursts and provider lag while keeping web/API latency bounded.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Resilience, controlled retry, workload isolation and operational visibility. |
| Eventual consistency and duplicate delivery require careful idempotency; introduces Redis/queue operations. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Authenticated producers, minimal payloads, encrypted transport, no secrets/raw sensitive provider payloads in queue. |
| Operations | Queue health, lag, retry, poison events, worker restart and capacity must be monitored. |
| Implementation and migration | Adopt Redis-backed queue only after persistence semantics and operational ownership are verified. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, DMAC, SPNFR, IPBS; callbacks, reconciliation, notifications and reports. |
| Redelivery, worker/API restart, backlog recovery, poison event and load tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
