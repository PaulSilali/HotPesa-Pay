# ADR-006 Use a modular monolith for the initial backend

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted implementation baseline |
| Scope | Backend structure |
| Accountable owner | Architecture and Backend Leads |
| Required gate | Accepted for MVP |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

The pilot requires clear business boundaries but does not yet justify distributed-service deployment, cross-service transactions or a large platform team.

## Decision

Build one deployable TypeScript API and associated worker processes organized into enforceable modules for identity/tenancy, fleet/route/fare, trip, payment, reconciliation, audit and reporting. Communicate internally through explicit interfaces/events.

## Alternatives considered

Independent microservices from inception; serverless-only functions; unstructured single application.

## Rationale

A modular monolith reduces operational cost and delivery risk while keeping later extraction possible where evidence supports it.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Simpler deployment, transactions, testing, observability and local development. |
| Boundary erosion can create a â€œbig ball of mudâ€; scaling remains mostly shared until modules are extracted. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Module-owned authorization and data access; no bypass of central controls; dependency and secret scans. |
| Operations | One core deployment increases blast radius; health, graceful shutdown, worker isolation and recovery are required. |
| Implementation and migration | Use dependency direction rules, module owners, repository interfaces and ADR-backed exceptions. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, SPNFR, IPBS; API, workers and packages. |
| Architecture tests, module dependency checks, load tests and operational review. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
