# ADR-005 Treat trusted provider evidence as the sole payment truth

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted and implemented in Phase 0 |
| Scope | Payment state authority |
| Accountable owner | Finance, Security and Backend Leads |
| Required gate | Accepted; revalidate with PostgreSQL and Daraja sandbox |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

An STK prompt, client response, SMS, screenshot, hotspot session or locally initiated request does not prove that a payment settled. Duplicate, delayed, missing and conflicting evidence are expected.

## Decision

Only authenticated server-side provider callback or trusted status evidence may transition an attempt to confirmed or failed. Persist evidence before mutation, deduplicate by stable evidence identity and route late/conflicting terminal evidence to review-required.

## Alternatives considered

Accept handset SMS or screenshot; conductor manual confirmation; trust initiation response; client-supplied success.

## Rationale

This preserves financial correctness, fraud resistance, auditability and deterministic reconciliation.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Prevents false confirmation and double effect; supports restart/replay and clear audit. |
| Passengers may remain pending; operations need status checks, expiry and review workflows. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Authenticated evidence, idempotency, immutable audit, least-privilege manual review and full redaction. |
| Operations | Requires monitoring of pending age, duplicates, invalid callbacks, reconciliation and incident escalation. |
| Implementation and migration | Central transition function and contract tests are mandatory for every payment state change. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| FRS, USUC, DMAC, AFIA, UIUX, SPNFR, IPBS; payment state machine and admin review. |
| Happy, failure, delayed, duplicate, missing, conflicting, replay and restart-durability tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
