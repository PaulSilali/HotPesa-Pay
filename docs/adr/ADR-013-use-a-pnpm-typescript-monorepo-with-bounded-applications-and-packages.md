# ADR-013 Use a pnpm TypeScript monorepo with bounded applications and packages

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted and implemented in Phase 0 |
| Scope | Repository architecture |
| Accountable owner | Architecture and Platform Leads |
| Required gate | Accepted for current phase |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

HotPesa has several web/service packages that share contracts, configuration and design tokens. Independent repositories would increase drift at the pilot stage.

## Decision

Use one pnpm workspace for deployable applications/services and reusable packages. Each project has source, lint, typecheck, test and build commands; empty discovery fails; dependency direction is controlled.

## Alternatives considered

Multiple repositories; npm/yarn workspaces; unstructured single package.

## Rationale

The monorepo supports atomic contract changes, consistent tooling and efficient CI for the current team and product maturity.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Shared standards, simpler refactoring and one traceable build. |
| CI duration and accidental coupling can grow; permissions are repository-wide. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Secret scans, dependency/licence audit, protected branches and least-privilege CI tokens. |
| Operations | Requires ownership rules, affected-project optimization and artifact naming. |
| Implementation and migration | Preserve six-project quality gates and explicit package public APIs. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, SPNFR, IPBS; repository and CI. |
| Frozen install, discovery, lint, typecheck, tests, builds, audit and negative discovery test. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
