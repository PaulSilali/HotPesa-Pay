# ADR-002 Use an Android first conductor host

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Decision required |
| Scope | Target edge platform |
| Accountable owner | Mobile and Architecture Leads |
| Required gate | Decide before Phase 4 |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

The host must expose the approved local experience, maintain trip state and operate on affordable devices common in the Kenyan PSV context. Platform restrictions and manufacturer variation can affect hotspot and background behavior.

## Decision

Adopt Android as the first supported conductor host, subject to a published device and OS matrix. Do not promise equivalent iOS hosting. Use controlled enrollment, health checks, revocation and application updates.

## Alternatives considered

Cross-platform host; passenger-facing native app; dedicated router/embedded appliance; cloud-only flow.

## Rationale

Android provides the most practical access to local networking, storage and device management for the proposed pilot, but this must be proven on actual devices.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Focused engineering and support scope; better access to required host capabilities. |
| Vendor/OS fragmentation, thermal/battery limits and background restrictions may invalidate assumptions. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | Managed secrets, device-bound identity, encrypted local data, least privilege, secure update and remote revocation. |
| Operations | Device procurement, charging, replacement, enrollment, inventory and OS-support policy are required. |
| Implementation and migration | Run a platform spike before building payment-dependent field workflows. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, UIUX, SPNFR, IPBS; Android host and device registry. |
| Approved device matrix tests and representative trip endurance test. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
