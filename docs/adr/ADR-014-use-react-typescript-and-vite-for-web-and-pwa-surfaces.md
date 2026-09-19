# ADR-014 Use React TypeScript and Vite for web and PWA surfaces

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Accepted implementation baseline |
| Scope | Frontend technology |
| Accountable owner | Frontend and Architecture Leads |
| Required gate | Accepted for MVP |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Passenger and administration surfaces require responsive, accessible interfaces and shared contracts with the TypeScript ecosystem. The MVP does not currently require server-side rendering for public SEO.

## Decision

Use React with TypeScript and Vite for passenger and administration web/PWA surfaces. Keep routing, state and dependencies minimal, use shared design tokens and preserve progressive enhancement where feasible.

## Alternatives considered

Next.js/SSR; Angular; Vue; server-rendered templates; native-only passenger app.

## Rationale

This choice matches existing Phase 0 code, team capability and rapid testable delivery while avoiding unnecessary SSR complexity.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Fast builds, strong typing, component reuse and broad testing ecosystem. |
| Client bundle/performance and state complexity must be controlled; SEO-heavy public content may later need reassessment. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | CSP, dependency controls, no secrets, secure API/session patterns and XSS/CSRF review. |
| Operations | Static artifact deployment, browser support and accessibility regression required. |
| Implementation and migration | Use shared contracts/tokens and avoid speculative framework layers. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, UIUX, SPNFR, IPBS; passenger and admin web. |
| Unit/component, Playwright, accessibility, responsive and performance tests. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
