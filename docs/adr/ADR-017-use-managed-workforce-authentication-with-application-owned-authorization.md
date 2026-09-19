# ADR-017 Use managed workforce authentication with application owned authorization

> Controlled source: [Document 11 ADR register](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md)

> The register status below is preserved verbatim. This individual record does not confer approval or production authorization.

| Field | Controlled value |
| --- | --- |
| Status | Decision required |
| Scope | Identity architecture |
| Accountable owner | Security, Architecture and Operations |
| Required gate | Choose before production-like Phase 3 |
| Decision date | To be recorded on approval |
| Review trigger | Material requirement, provider, platform, risk, scale, incident or regulatory change |

## Context

Credential security, MFA, recovery and workforce lifecycle are specialized concerns, while HotPesa tenant/resource authorization depends on business context.

## Decision

Select a managed identity provider for workforce authentication/session primitives. Keep roles, tenant membership, resource/context policies and business authorization inside HotPesa. Passenger MVP remains account-light.

## Alternatives considered

Build credentials/session system; outsource all authorization to provider groups; shared admin password.

## Rationale

This separates commodity identity security from domain-specific access control and supports MFA/revocation without surrendering policy clarity.

## Consequences

| Positive consequences | Negative consequences and trade offs |
| --- | --- |
| Reduced credential risk and mature lifecycle features. |
| Vendor dependency, cost, configuration risk and identity-to-domain synchronization. |

## Security privacy and operational impact

| Area | Impact and control |
| --- | --- |
| Security and privacy | MFA for privileged roles, short sessions, secure federation, audited provisioning/deprovisioning and deny-by-default application policies. |
| Operations | Requires HR/operations ownership, access reviews, break-glass and vendor incident procedures. |
| Implementation and migration | Run vendor evaluation and integration spike; keep an identity adapter boundary. |

## Affected artifacts and validation

| Affected artifacts | Required validation |
| --- | --- |
| TRD, DMAC, SPNFR, IPBS; admin/conductor identity and authorization. |
| Vendor security/privacy review, MFA/session tests, provisioning/revocation and negative permission suite. |

Scope control: this ADR applies only within the stated scope; material weakening or expansion requires a new ADR, impact review and traceability update.

<br>

## Related requirements

See [MASTER_TRACEABILITY_MATRIX.md](../requirements/MASTER_TRACEABILITY_MATRIX.md). The mapping is evidence-oriented and does not change this ADR status.
