# ADR-009 Version fare schedules with controlled approval

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Recommended for approval |
| Scope | Fare integrity |
| Accountable owner | Product, Finance and Data Leads |
| Required gate | Approve before Phase 2 exit |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Passengers need price certainty and finance/operations need proof of the applicable fare at the time of quote/payment. A mutable current-fare row cannot reconstruct history reliably.

## Decision

Store immutable/versioned fare schedules with scope, effective period, status, approver and audit. Bind every quote/payment attempt to a fare version and quoted amount. Reject stale or incompatible quotes under explicit rules.

## Alternatives considered

Overwrite current fare; conductor enters arbitrary price; calculate from an external source without snapshot.

## Rationale

Versioning supports audit, disputes, reporting and controlled change while preventing silent repricing.

<br>

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Historical reproducibility, clear approval and deterministic reconciliation. |
| Additional authoring, effective-date and overlap validation workflows. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Authorized fare management, four-eyes approval where adopted, audit and tenant scope. |
| Operations | Requires publication/rollback procedure and monitoring for overlaps or missing coverage. |
| Implementation and migration | Add constraints for effective ranges and quote binding before passenger workflow. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| BRD, PRD, FRS, DMAC, UIUX, SPNFR, IPBS; fare admin, quote and reports. |
| Boundary/effective-time, overlap, stale-quote, approval and reconciliation tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
