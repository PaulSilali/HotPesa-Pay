# ADR-001 Use a hybrid vehicle edge and cloud architecture

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Recommended for approval |
| Scope | Target MVP architecture |
| Accountable owner | Architecture Lead |
| Required gate | Approve before Phase 4 |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

HotPesa must support passengers connected to a vehicle-hosted experience while protecting payment secrets, preserving authoritative evidence and operating through intermittent mobile connectivity.

## Decision

Use a vehicle-edge host for trip context, local passenger access and resilient field behavior. Keep payment credentials, callbacks, authoritative payment state, cross-tenant controls, central reporting and reconciliation in cloud services. Synchronize through versioned, idempotent contracts.

## Alternatives considered

Edge-only architecture; cloud-only passenger flow; dedicated networking appliance with no application edge.

## Rationale

The hybrid pattern best balances in-vehicle reachability and resilience with secure provider integration, central control and auditable payment truth.

<br>

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Local trip experience can continue during weak coverage; cloud retains sensitive trust functions; supports incremental pilot. |
| Adds synchronization, conflict, deployment and device-support complexity; requires explicit stale-state behavior. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Treat vehicle, local passenger, public internet and cloud as separate trust zones; no provider secret at the edge; signed/encrypted communication and revocable device identity. |
| Operations | Requires device health, update, replacement, clock, storage, support and reconciliation procedures. |
| Implementation and migration | Prove contract boundaries, local persistence and recovery before Daraja integration. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, DMAC, AFIA, UIUX, SPNFR, IPBS; edge app, API, worker, audit and monitoring. |
| Target-device spike, connectivity tests, security review, restart/offline tests and pilot measurement. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
