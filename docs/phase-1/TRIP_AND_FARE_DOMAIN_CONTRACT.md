# Proposed Trip and Fare Domain Contract

This is an analysis artifact, not an approved API or database contract. It uses only
entities and relationships named by the controlled requirements. Fields marked **OPEN**
must be decided before implementation.

## Minimum entities

| Entity | Purpose | Authoritative owner | Core identifiers | Required relationships | Established lifecycle | Unresolved attributes |
| --- | --- | --- | --- | --- | --- | --- |
| Tenant/SACCO | Owns operator resources and policy scope. | HotPesa application authorization with operator governance. | tenantId, SACCO/operator identifier. | Owns vehicles, routes, fares, workforce membership and trips. | Active/suspended concept is implied. | Canonical identifier format; lifecycle and merger rules. |
| Workforce identity | Authenticated conductor, driver or operations actor. | Managed identity provider for credentials; HotPesa for authorization mapping. | External subject; application workforceId. | Belongs to tenant(s), has roles and assignments. | Provisioned, active, suspended/revoked. | Provider, provisioning, multi-tenant membership and claims. |
| Vehicle | Vehicle used by an assigned journey. | Tenant/operator. | vehicleId, vehicle label/registration reference. | Belongs to tenant; referenced by assignment and trip. | Available/assigned/unavailable is implied. | Exact state model and registration-data privacy. |
| Route | Approved path and operator context. | Tenant/operator administration. | routeId, route code/label. | Has directions and ordered stages. | Configured/versioned concept implied. | Direction identifier and route publication lifecycle. |
| RouteStage | Ordered boarding/destination point. | Tenant/operator administration. | stageId, routeId, directionId, sequence. | Belongs to one route direction. | Ordered; historical preservation required. | Whether stages can be renamed/reordered and identifier retention. |
| FareDefinition/FareVersion | Approved amount for route/direction/stage context and effective period. | Tenant/operator governance, with HotPesa audit. | fareDefinitionId, fareVersionId, routeId, directionId, stage/destination context. | References route/direction/stages; linked to quotes and attempts. | draft, pending-approval, active, superseded, withdrawn are established for fare versions. | Creator/approver roles, overlap policy, timezone and publication mechanics. |
| ConductorAssignment | Authorizes workforce member to operate a vehicle/route context. | Tenant/operator operations. | assignmentId, tenantId, workforceId, vehicleId, routeId, directionId. | Links workforce, vehicle, route and temporal operating context. | Active/expired/revoked is implied; exact lifecycle OPEN. | Shift/session identifier, cardinality and overlap rules. |
| Trip/Journey | Active or closed vehicle-route operation exposed to passengers. | HotPesa journey domain under tenant authority. | tripId/journeyId, public token/code. | References tenant, assignment, vehicle, route, direction and fare context. | active, closed, suspended are established; start/closing semantics require detail. | Exact state machine, start actor, fare snapshot rule and closure override. |
| Payment attempt | Immutable fare attempt linked to the trip context. | HotPesa payment domain/PostgreSQL. | paymentAttemptId, tripId, fareVersionId, provider/reference IDs. | References trip, quote, amount, currency and masked payer reference. | Phase 0 seven payment states. | Trip-close linkage and summary inclusion rules. |
| TripSummary | State-separated closure/report result. | HotPesa reporting/reconciliation domain. | summaryId, tripId, generatedAt. | References payment attempts and audit events. | Retained immutable closure result is implied. | Exact fields and treatment of unresolved/non-digital values. |

## Minimum TripStart authorization input

The requirements support the following shape, but do not authorize a concrete wire format:

`tenant/SACCO + authenticated conductor + active assignment + vehicle + route + direction + valid operating context`

Validation must be server-side and must ensure all referenced resources belong to the same
tenant. The assignment must be valid at the requested start time. The following remain OPEN:

- whether “operating context” is a shift entity, device session, or bounded assignment period;
- whether a conductor may have multiple concurrent assignments;
- who may create/revoke assignments;
- whether a trip captures one fare version at start or obtains effective quotes per passenger;
- how an expired or revoked assignment is presented and audited.

## Fare contract constraints already established

- Amount is server-generated, positive, currency-supported and attributable.
- Fare versions have status, effective period, creator/approver evidence and audit history.
- Active ambiguity/overlap must be prevented according to the approved operator policy.
- Payment attempts retain amount, currency and fare version even after later changes.
- Passenger and conductor clients cannot override the authoritative quote.

The contract does not choose creator, approver, overlap, timezone or trip-snapshot policy.
