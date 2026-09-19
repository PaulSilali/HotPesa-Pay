# ADR-004 Keep M Pesa credentials and callbacks in cloud services

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted architecture baseline |
| Scope | Payment trust boundary |
| Accountable owner | Security and Integration Leads |
| Required gate | Accepted pattern; provider details before Phase 6 exit |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Provider credentials, callback authentication and reconciliation are high-value controls. Vehicle devices may be lost, compromised or intermittently connected and cannot safely expose public callback endpoints.

## Decision

Store provider credentials only in managed cloud secret storage. Initiate provider requests through a dedicated server-side adapter. Receive, authenticate, validate, persist and deduplicate callbacks/status evidence in cloud services.

## Alternatives considered

Credentials and callback logic on the conductor device; client-to-provider integration; manual SMS confirmation.

## Rationale

Cloud custody reduces secret exposure, provides reachable endpoints and centralizes audit, rate limiting, idempotency and reconciliation.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Stronger security and operability; consistent provider controls; easier rotation and incident response. |
| Payment initiation needs internet; provider or cloud outage produces pending states requiring reconciliation. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Least-privilege secret access, rotation, callback authenticity, replay protection, redaction and audit. |
| Operations | Requires provider monitoring, status repair, incident runbook and credential ownership. |
| Implementation and migration | Phase 0 uses an internal Mock adapter only; Daraja implementation remains gated. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, DMAC, SPNFR, IPBS; API, provider adapter, secret store and callback endpoint. |
| Daraja sandbox contract/fault suite and independent security review. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
