# ADR-003 Provide a no install passenger web experience

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Recommended for approval |
| Scope | Passenger interaction |
| Accountable owner | Product and Frontend Leads |
| Required gate | Approve before Phase 5 |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Passengers should pay without creating an account or installing an application. The experience may be opened through QR, local address or assisted discovery while connected to the vehicle network.

## Decision

Use a responsive PWA/web portal with minimal data entry and explicit seven-state payment language. Passenger identity remains account-light for MVP. Captive-portal behavior is convenience only and cannot be the sole entry method.

## Alternatives considered

Mandatory native passenger app; USSD-only flow; conductor-entered passenger payment; public cloud-only page.

## Rationale

A web experience minimizes onboarding friction, supports broad devices and aligns with privacy minimization.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Fast access, no installation, accessible/responsive delivery and independent web release cadence. |
| Browser, captive portal, local TLS and address discovery vary; offline installability does not replace server evidence. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | No secrets or confirmation authority in the browser; input validation, CSP, secure headers, minimized storage and privacy notice. |
| Operations | Requires tested QR/address fallback, language-ready content and passenger support guidance. |
| Implementation and migration | Reuse shared contracts and design tokens; do not add a passenger account system in MVP. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| PRD, FRS, USUC, AFIA, UIUX, SPNFR; passenger PWA and local host. |
| Browser/device matrix, WCAG 2.2 AA, 390px layout, field usability and reconnect tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
