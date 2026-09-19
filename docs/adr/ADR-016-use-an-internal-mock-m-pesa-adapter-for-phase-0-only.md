# ADR-016 Use an internal Mock M Pesa adapter for Phase 0 only

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted with strict scope |
| Scope | Development and test provider |
| Accountable owner | Integration and QA Leads |
| Required gate | Accepted for Phase 0; prohibited in production |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Early vertical-slice testing requires deterministic confirmed, failed, delayed, duplicate and missing-callback behavior without credentials, money movement or provider dependency.

## Decision

Use an internal deterministic Mock M-Pesa adapter only in local/test Phase 0 environments. Make production selection fail closed. Daraja requires a separate adapter, security/provider review and sandbox gate.

## Alternatives considered

Call live Daraja during early development; stub payment success in the client; no provider abstraction.

## Rationale

A contract-faithful mock enables repeatable fault testing and protects credentials while the provider arrangement is unresolved.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Fast deterministic tests and safe browser demonstration. |
| Mock success is not provider evidence; divergence from Daraja is a risk. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | No live secrets or real numbers; clear environment labeling; fail-closed provider selection. |
| Operations | Runbooks and UI must label synthetic behavior; CI prevents production configuration with mock. |
| Implementation and migration | Keep a narrow provider interface justified by the planned Daraja adapter; no speculative provider framework. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, DMAC, UIUX, SPNFR, IPBS; provider adapter and test fixtures. |
| Contract comparison with official Daraja documentation and sandbox suite. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
