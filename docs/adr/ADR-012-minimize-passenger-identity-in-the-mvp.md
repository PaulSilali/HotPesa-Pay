# ADR-012 Minimize passenger identity in the MVP

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Recommended for approval |
| Scope | Privacy and onboarding |
| Accountable owner | Product and Privacy Leads |
| Required gate | Approve before Phase 5 |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

The payment flow needs a phone number for the provider interaction but does not require a full HotPesa passenger profile, photograph or identity document for the current MVP.

## Decision

Provide an account-light passenger flow. Collect only data required for quote/payment/support, display a concise notice, mask/tokenize phone identifiers where possible and apply approved retention. Do not store an M-Pesa PIN.

## Alternatives considered

Mandatory account/profile; anonymous cash-only flow; collect identity for future loyalty/analytics.

## Rationale

Data minimization reduces onboarding friction, exclusion, breach impact and privacy obligations unrelated to MVP value.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Faster experience and smaller personal-data footprint. |
| Reduced personalization, self-service history and loyalty capability; rights workflows still required. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Purpose limitation, minimization, masking, access, retention, rights and processor controls. |
| Operations | Support and reconciliation must work with limited identity and protected lookup mechanisms. |
| Implementation and migration | Avoid future-use fields until a change updates PRD, privacy analysis and consent/lawful-basis decision. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| BRD, PRD, FRS, DMAC, AFIA, UIUX, SPNFR, IPBS. |
| Privacy/DPIA review, log scan, field inventory and usability test. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
