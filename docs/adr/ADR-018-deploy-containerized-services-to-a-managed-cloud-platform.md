# ADR-018 Deploy containerized services to a managed cloud platform

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Decision required |
| Scope | Production hosting and deployment |
| Accountable owner | Architecture, Platform, Security and Privacy |
| Required gate | Decide before Phase 9 |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

The system needs repeatable deployment, private managed data services, TLS, scaling, observability, backup and a Kenyan privacy/transfer assessment without a large infrastructure team.

## Decision

Package API/workers as OCI containers and deploy to a managed cloud/PaaS with private PostgreSQL/Redis, managed secrets, infrastructure as code, immutable promotion and automated rollback. Select provider/region through a scored decision.

## Alternatives considered

Virtual machines managed manually; Kubernetes from inception; serverless-only; on-premises hosting.

## Rationale

Managed container hosting provides portability and operational control with less complexity than early Kubernetes.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Consistent artifacts, simpler scaling and managed operational services. |
| Provider/region lock-in, egress/cost and platform limits; final privacy/availability properties depend on vendor. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Private networks, least-privilege IAM, encryption, WAF/rate limits, image scans, secret store and audited deployment. |
| Operations | Requires ownership, budgets, observability, backups, DR and support agreement. |
| Implementation and migration | Keep deployment descriptors portable; do not hard-code provider-specific business logic. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, SPNFR, IPBS; CI/CD, infrastructure, API, workers and data services. |
| Provider scorecard, threat/privacy review, load/restore/failover and cost tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
