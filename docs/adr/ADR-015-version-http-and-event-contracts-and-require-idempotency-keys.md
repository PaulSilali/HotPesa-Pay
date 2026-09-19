# ADR-015 Version HTTP and event contracts and require idempotency keys

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted implementation baseline |
| Scope | Integration contracts |
| Accountable owner | API and Data Leads |
| Required gate | Accepted for MVP |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Passenger, admin, host, worker and provider integrations evolve independently and payment requests can be retried due to network uncertainty.

## Decision

Version public/internal HTTP and event contracts; validate requests/responses; publish schemas; reject incompatible changes. Require client idempotency for payment initiation and stable evidence identity for provider events.

## Alternatives considered

Unversioned endpoints; best-effort documentation; client-generated payment status; duplicate suppression by timing only.

## Rationale

Explicit contracts and idempotency make retries safe, support independent testing and preserve financial invariants.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Predictable integration, automated compatibility and safer rollout. |
| Schema governance and deprecation effort; poorly chosen keys can create conflicts. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Schema validation, rate limits, authenticated access, replay protection and safe error responses. |
| Operations | Contract registry/doc ownership, deprecation windows and consumer inventory required. |
| Implementation and migration | OpenAPI/event schemas are build artifacts and tests; changed request under reused key is rejected. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| DMAC, SPNFR, IPBS; all clients, API and provider adapter. |
| Contract tests, backward compatibility and idempotency/replay tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
