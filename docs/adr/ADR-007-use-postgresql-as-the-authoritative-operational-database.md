# ADR-007 Use PostgreSQL as the authoritative operational database

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted implementation baseline |
| Scope | Data persistence |
| Accountable owner | Data and Architecture Leads |
| Required gate | Accepted; production service/region pending |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

HotPesa needs transactional integrity, unique/idempotency constraints, auditable history, tenant scoping, reconciliation queries and reliable backup/restore.

## Decision

Use PostgreSQL as the system of record for operational/domain data. Enforce money, identifiers, transitions and idempotency through reviewed application logic plus database constraints. Use migrations and tested backups/restores.

## Alternatives considered

Document database; distributed ledger; edge database as global authority; provider reports as only datastore.

## Rationale

PostgreSQL offers mature ACID transactions, constraints, indexing, reporting and operational tooling with appropriate team familiarity.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Strong consistency and constraints; broad ecosystem; clear persistence and recovery model. |
| Schema evolution, query tuning and scaling require discipline; single-region design needs recovery planning. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Private network, encryption, least privilege, audit, masked test data and controlled exports. |
| Operations | Managed service preferred for production; backups, PITR, capacity and connection management required. |
| Implementation and migration | Repository boundaries and forward/backward compatible migrations are mandatory. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| DMAC, SPNFR, IPBS; API repositories, migrations, reporting and backups. |
| Migration rollback, concurrency/idempotency, tenant-isolation and restore tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
