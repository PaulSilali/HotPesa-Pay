# ADR-008 Use encrypted local persistence and an outbox on the Android host

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Recommended for approval |
| Scope | Edge durability |
| Accountable owner | Mobile, Data and Security Leads |
| Required gate | Approve before Phase 4 build |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

The vehicle host must survive application restart and temporary loss of cloud connectivity without losing assigned trip state or creating uncontrolled repeated mutations.

## Decision

Use Room/SQLite or equivalent approved Android persistence for minimal trip/session/cache data and an ordered idempotent outbox. Encrypt sensitive local data, version schemas, bound retention and reconcile with server authority.

## Alternatives considered

Memory-only state; custom flat files; full cloud database replica; local store as global authority.

## Rationale

Structured local storage and an outbox provide predictable restart/offline behavior without making the vehicle authoritative for payment settlement.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Improved resilience, deterministic replay and diagnosable synchronization. |
| Local schema migration, conflict, storage growth and device compromise must be managed. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Minimal fields, encryption, key protection, logout/revocation cleanup and no M-Pesa PIN/provider credential. |
| Operations | Needs queue visibility, retry limits, poison-item handling, storage monitoring and recovery procedure. |
| Implementation and migration | Define event identities and server conflict rules in DMAC before implementation. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, DMAC, SPNFR, IPBS; Android storage and sync. |
| Restart, offline/online, duplicate replay, schema upgrade, revocation and storage-pressure tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
