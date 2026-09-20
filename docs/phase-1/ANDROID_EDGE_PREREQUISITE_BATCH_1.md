# Android edge prerequisite decision batch 1

> Status: **Recommended for approval**. This design record does not authorize Android implementation or alter controlled DOCX sources.

## Recommendations

| Decision | Recommendation | Status |
| --- | --- | --- |
| Device qualification | Capability classes, not a model lock-in | Recommended for approval |
| Minimum Android runtime | Android 10 / API 29 | Recommended for approval |
| Preferred deployment generation | API 31+ device generation, validated in field | Recommended for approval |
| Embedded persistence | Room over SQLite | Recommended for approval |
| Local API | Narrow, versioned `/edge/v1` Passenger-PWA API | Recommended for approval |
| Edge/cloud sync | Server-issued versioned datasets plus idempotent inbox/outbox | Recommended for approval |

API 29 is the lowest recommended runtime because foreground-service types are explicit at that level. API 31+ is preferred for the deployed device generation but must be validated because background foreground-service starts are more constrained. Room is preferred to direct SQLite because it preserves SQLite transactions while providing query checking, migrations and Android-native testing support. [Android service guidance](https://developer.android.com/develop/background-work/services/fgs/changes) and [Room guidance](https://developer.android.com/training/data-storage/room).

## Device qualification matrix

| Capability | Minimum | Recommended | Field validation required |
| --- | --- | --- | --- |
| OS/runtime | API 29 | API 31+ | Security patch and lifecycle behavior |
| RAM/storage | Sufficient for bounded companion and retained data; no numeric threshold approved | Demonstrated headroom | Memory pressure, storage growth and cleanup |
| Hotspot/Wi-Fi | Native hotspot and client support | Stable under charging/load | Join/rejoin, sleep and OEM battery restrictions |
| Concurrent clients | No target approved | Meets approved target | Product/Operations sets and validates target |
| Battery/charging | Operable on assigned trip | Stable thermal/battery behavior | Endurance, charging and reboot recovery |
| Keystore | Android Keystore available | Hardware-backed support where reported | Key lifecycle and loss/revocation |
| Network | Wi-Fi/hotspot plus approved backhaul | Independent local/upstream behavior | Passenger access during upstream changes |

## Local data classification

| Data | Classification | Constraint |
| --- | --- | --- |
| Device identity reference; conductor session | LOCAL CACHE / LOCAL TEMPORARY | Opaque, scoped and revocable; no identity authority. |
| Active trip; public journey code; route/stages; fare version/rules | LOCAL CACHE | Server-issued, versioned and invalidatable. |
| Passenger selection/local session | LOCAL TEMPORARY | Non-financial; sync only through approved contract. |
| Sync metadata; last-sync timestamp; version tokens; non-financial outbox | LOCAL AUTHORITATIVE | Local delivery bookkeeping only; central resource state controls outcome. |
| Payment attempt reference | LOCAL CACHE | Opaque reference only; no status authority. |
| Provider evidence; reconciliation; confirmed revenue | CENTRAL ONLY | No local financial truth. |
| Provider credentials | NOT ALLOWED LOCALLY | Cloud secret boundary. |

## Proposed local API and payment boundary

| Endpoint | Purpose | Internet | Authority / offline behavior |
| --- | --- | --- | --- |
| `GET /edge/v1/health` | Edge liveness | No | Local only; never represents payment health. |
| `GET /edge/v1/connectivity` | Local/upstream state | No | Reports unavailable/unknown upstream explicitly. |
| `GET /edge/v1/journeys/active` | Active server-issued journey | No if valid cache | Opaque public-code scope; unavailable/stale/closed if validity fails. |
| `GET /edge/v1/journeys/active/route` | Route/stage view | No if valid cache | Uses synchronized version only. |
| `POST /edge/v1/journeys/active/destination-selections` | Non-financial selection | No | Bounded idempotent event for later sync. |
| `GET /edge/v1/journeys/active/fare-quote` | Valid approved local fare | No if valid cache | Returns unavailable/stale, never fabricated. |
| `POST /edge/v1/journeys/active/payment-handoffs` | Central-payment handoff request | Yes | Returns central-payment-unavailable offline; never confirms payment. |

Recommendation: payment is a central handoff/request, not a local provider proxy or confirmation path. Exact response schemas require DMAC/contracts.

## Sync, versioning and conflict rules

Central to edge: scoped active-trip/session, public code, route/stages, approved fare datasets and limited configuration. Edge to central: heartbeat, device health, approved operational status and bounded non-financial outbox events. No provider secrets or financial authority synchronize to edge.

Use immutable resource/version IDs and `eventId`, `eventType`, `createdAt`, `idempotencyKey`, `payloadVersion`, `retryCount`, `deliveryState` and `acknowledgedAt` for outbox items. Duplicate delivery is acknowledged idempotently. Central trip closure/revocation wins. Stale, unknown or rejected route/fare/session data becomes unavailable; it is never silently merged or quoted.

## Offline contract and field gates

Allowed while data is valid: local journey discovery, route/stage display, destination selection, approved fare lookup and bounded non-financial outbox events. Not allowed: payment confirmation, settlement, confirmed revenue, provider reconciliation or offline financial settlement.

Field targets remain **Decision required** for concurrent passengers, local latency, endurance, charging, thermal behavior and offline duration. Hotspot stability, reconnect, process/app restart, reboot, sync recovery and stale-data handling require target-device validation.

## Open decisions

Security: production local TLS/HTTP, local authorization/isolation, encryption/Keystore, device enrolment/revocation, sync authentication, retention/wipe and telemetry/redaction.

Architecture/DMAC: exact edge API and handoff schemas, sync resource formats, central acceptance and conflict responses.
