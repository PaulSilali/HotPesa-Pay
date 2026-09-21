# Android edge prerequisite decision batch 3

> Status: **Recommended for approval**. Proposed DMAC/edge schemas only; no Android or central API implementation is authorized.

## `/edge/v1` local API schemas

All responses use existing opaque IDs, `TripV1`, `RouteV1`, `RouteStageV1` and `FareQuoteV1` concepts. Passenger endpoints require opaque public-code/session scope; device/sync functions are not passenger endpoints.

| Endpoint | Request | Response | Status / authority / offline |
| --- | --- | --- | --- |
| `GET /edge/v1/health` | none | `{ status, edgeVersion, deviceState }` | 200; local observation; no Internet. |
| `GET /edge/v1/connectivity` | none | `{ localNetwork, centralReachability, lastSuccessfulSyncAt? }` | 200; local observation; never payment health. |
| `GET /edge/v1/journey/current` | session scope | `{ journey, routeVersion, fareVersion, validity }` | 200/404; local valid cache only. |
| `GET /edge/v1/journey/:publicCode` | opaque public code | same journey shape | 200/404/409; local valid cache only. |
| `GET /edge/v1/journey/:publicCode/stages` | opaque public code | `{ routeId, routeVersion, directionId, stages }` | 200/404/409; local valid cache only. |
| `POST /edge/v1/journey/:publicCode/destination` | `{ destinationStageId, passengerSessionId, idempotencyKey }` | `{ selectionId, fareVersionId, state }` | 201/409/422; non-financial local/outbox event. |
| `POST /edge/v1/journey/:publicCode/fare-quote` | `{ destinationStageId, passengerSessionId }` | `FareQuoteV1` plus validity metadata | 201/409/422; valid synchronized data only. |
| `POST /edge/v1/journey/:publicCode/payment-handoff` | `{ destinationStageId, fareVersionId, passengerSessionId, idempotencyKey }` | `{ handoffId, centralState }` | 201/503; central derives/verifies amount; Internet required. |

No endpoint accepts a passenger-authoritative amount. Payment handoff is not payment confirmation.

## Stable error model

`{ error: { code, message, retryable, correlationId? } }`, with machine codes: `JOURNEY_NOT_FOUND`, `JOURNEY_CLOSED`, `ROUTE_VERSION_STALE`, `FARE_VERSION_STALE`, `FARE_UNAVAILABLE_OFFLINE`, `EDGE_NOT_SYNCHRONIZED`, `CENTRAL_UNAVAILABLE`, `PAYMENT_HANDOFF_UNAVAILABLE`, `DEVICE_REVOKED`, `DEVICE_NOT_ENROLLED`, `LOCAL_STORAGE_UNAVAILABLE`, `INTEGRITY_FAILURE`, `RATE_LIMITED`, `INVALID_PASSENGER_REQUEST`.

## Versioning, sync and replay

Route, stage dataset, fare, trip assignment, edge config and API/sync payload use immutable resource IDs plus explicit revision/version IDs. Each central-to-edge message carries `messageId`, `resourceId`, `resourceVersion`, `issuedAt`, `effectiveFrom`, optional `effectiveUntil`, `validity`, payload and integrity metadata. Edge records processed `messageId` and latest accepted version per resource. Duplicates are acknowledged; stale/out-of-order updates cannot overwrite newer accepted data.

Central-to-edge resources are scoped assigned-trip/session, route/stages, approved fare version/rules, bounded tenant/operator configuration, revocation state and minimum app version. Provider credentials never synchronize.

Edge-to-central outbox envelope: `{ eventId, deviceId, tenantId, eventType, schemaVersion, createdAt, idempotencyKey, tripId?, publicCode?, payload, attemptCount, deliveryState, acknowledgedAt? }`. Approved proposed event types: `edge.started`, `edge.heartbeat`, `trip.local-opened`, `passenger.destination-selected`, `fare.local-quoted`, `sync.failed`, `storage.warning`, `integrity.warning`. Payloads exclude passenger PII, provider secrets and financial evidence.

## Conflict, fare and payment semantics

| Situation | Edge action | Central action / passenger result |
| --- | --- | --- |
| Trip closed centrally while offline | Mark unavailable at next valid update; stop local actions when closure known | Central wins; passenger receives `JOURNEY_CLOSED`; audit/telemetry. |
| Route/fare changed | Keep captured active-trip context only where existing rules permit; otherwise invalidate stale cache | Issue newer version; passenger receives stale/unavailable if no valid version. |
| Duplicate outbox replay | Preserve event ID/idempotency key | Idempotent acknowledge; no duplicate business effect. |
| Stale public code | Reject local action | `JOURNEY_NOT_FOUND`/`JOURNEY_CLOSED`; no payment handoff. |
| Device revoked/minimum version failure | Block privileged functions on next known state | Central denies sync/handoff; re-enrol/update required. |
| Material clock uncertainty | Do not make time-sensitive validity decision | Server time controls financial/authorization decisions; fail safe unavailable. |

A local fare is valid only when its approved `fareVersionId`, effective window, assigned route/direction, active-trip binding, dataset version and central invalidation status can be proven. Otherwise return `FARE_UNAVAILABLE_OFFLINE` or `FARE_VERSION_STALE`.

## Proposed qualification bands

All are proposed test bands pending Product/Operations approval: minimum acceptance is one passenger and a 30-minute local session; recommended target is multi-passenger proof over a representative trip duration; stress target is a higher controlled client/load band established by field evidence. Validate hotspot uptime, reconnect, request latency, memory, process/app restart, device reboot, upstream loss/recovery, stale fare, revoked device, low storage, charging interruption and thermal observation. Do not silently delete undelivered outbox entries; low-storage cleanup excludes them until an approved bounded backlog policy exists.

## Remaining gates

Product/Operations must approve concurrency, latency, endurance, charging, thermal, offline-duration and retention limits. Security must approve production transport/TLS, crypto library/key rotation, device identity lifecycle and telemetry retention. DMAC must approve exact response, integrity and synchronization schemas.
