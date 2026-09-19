# ADR-010 Use a shared multi tenant platform with strict tenant isolation

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Recommended for approval |
| Scope | Commercial and authorization model |
| Accountable owner | Architecture, Security and Product Leads |
| Required gate | Approve before Phase 2 exit |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

HotPesa targets multiple PSV owners, SACCOs or bus companies. Separate deployments improve isolation but multiply operating cost and upgrade effort.

## Decision

Use a shared platform with explicit tenant identifiers, server-side resource policies, tenant-scoped queries, quotas and audit. Keep an architectural option for dedicated deployments if commercial/regulatory needs justify them.

## Alternatives considered

Deployment per tenant; globally shared records without tenant policy; tenant-selected database schema.

## Rationale

A shared platform supports centralized operations and commercial scale if isolation is treated as a first-class invariant.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Efficient upgrades and infrastructure use; cross-tenant analytics can be governed centrally. |
| Authorization defects create severe exposure; noisy-neighbor and data-residency expectations must be managed. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Deny by default, resource/context policy, negative cross-tenant tests, export controls and monitored privileged access. |
| Operations | Tenant onboarding/offboarding, quotas, support access and data export/deletion procedures required. |
| Implementation and migration | Tenant ID is mandatory in relevant entities/contracts; repository methods cannot omit scope. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| BRD, PRD, FRS, DMAC, SPNFR, IPBS; all APIs, reports and operations. |
| Cross-tenant negative suite, load isolation, audit and privacy review. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
