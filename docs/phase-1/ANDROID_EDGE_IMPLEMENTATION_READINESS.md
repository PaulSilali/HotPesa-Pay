# Android edge implementation readiness

> Project-owner architecture decisions: ADR-002 hybrid edge/cloud and ADR-008 Passenger
> PWA baseline. Controlled ADR-register statuses are preserved until formal publication.
> This checklist does not authorize implementation where a required decision is open.

## Approved architecture boundary

The Android companion edge may serve local passenger journey/session functions and
synchronized non-financial route/fare data. React + TypeScript + Vite remains the
Passenger PWA baseline; the edge does not replace it. The central backend is authoritative
for payments, provider credentials/evidence, reconciliation, audit, confirmed revenue,
tenant policy and durable financial state. The current full NestJS/PostgreSQL/Redis/BullMQ/
worker stack must not run on the conductor phone.

## Implementation prerequisites

| Prerequisite | Classification | Current boundary / next required decision |
| --- | --- | --- |
| Android device matrix | RECOMMENDED FOR APPROVAL | Capability-based matrix with API 29 minimum and API 31+ preferred; qualified devices and field evidence remain required. |
| Minimum Android OS/API level | RECOMMENDED FOR APPROVAL | API 29 minimum runtime; API 31+ preferred deployment generation, subject to lifecycle/security validation. |
| Embedded persistence choice | RECOMMENDED FOR APPROVAL | Room over SQLite; encryption, schema/versioning and retention remain controlled design decisions. |
| Local edge API contract | RECOMMENDED FOR APPROVAL | Narrow versioned `/edge/v1` Passenger-PWA API; exact DMAC/contracts remain required. |
| Edge/cloud synchronization contract | RECOMMENDED FOR APPROVAL | Server-issued versioned datasets plus authenticated idempotent inbox/outbox; exact schema remains required. |
| Authentication/device identity | RECOMMENDED FOR APPROVAL | Opaque app-issued device ID bound to Keystore keypair; enrollment workflow approval remains open. |
| Local encryption | RECOMMENDED FOR APPROVAL | Keystore-wrapped key plus Room-compatible full-database encryption; implementation detail remains open. |
| Secret storage | READY | Provider credentials, callback secrets and production payment authority are not allowed on edge; implementation storage mechanics remain a security detail. |
| Android lifecycle/restart handling | IMPLEMENTATION DETAIL | Design once persistence/outbox and OS floor are selected; prove restart and background behavior. |
| Hotspot/network behavior | DECISION REQUIRED | Approve topology, local address/discovery and production TLS/HTTP model. |
| Offline behavior | READY | Local non-financial journey discovery/display/selection and valid synchronized fare lookup are allowed; payment confirmation, settlement, provider reconciliation and confirmed revenue are not. |
| Conflict/version handling | RECOMMENDED FOR APPROVAL | Immutable/versioned IDs, central revocation/closure wins, idempotent replay and unavailable-on-stale behavior. |
| Software update strategy | DECISION REQUIRED | Define signed release, rollout, rollback, support window and minimum-version policy. |
| Telemetry/observability | DECISION REQUIRED | Define health, storage, sync and security telemetry with privacy/redaction limits. |
| Field concurrency target | DECISION REQUIRED | Product/Operations must set measured passenger concurrency acceptance criteria. |
| Endurance/battery acceptance criteria | DECISION REQUIRED | Product/Operations must set trip-duration, battery, thermal and restart acceptance criteria. |

## Edge/cloud data classification

| Data / function | Local edge | Central authoritative | Synced copy | Not allowed on edge |
| --- | --- | --- | --- | --- |
| Route | Display/use only when valid | Yes | Yes | No |
| Stages | Display/use only when valid | Yes | Yes | No |
| Fare version | Lookup only when valid | Yes | Yes | No |
| Active trip | Minimal scoped session candidate | Yes | Permitted when contract approved | No |
| Public journey code | Minimal scoped session candidate | Yes | Permitted when contract approved | No |
| Passenger destination choice | Non-financial local selection candidate | Yes for durable record | Permitted when contract approved | No |
| Payment attempt | No | Yes | No | Yes |
| Provider credentials | No | Yes | No | Yes |
| Provider evidence | No | Yes | No | Yes |
| Reconciliation job | No | Yes | No | Yes |
| Audit events | Local operational event only if approved for later sync | Yes | Contract pending | Financial/provider audit authority |
| Confirmed revenue | No | Yes | No | Yes |
| Tenant policy | No | Yes | Minimum scoped configuration only if approved | Full policy authority |
| Operator identity | No identity authority | Yes | Scoped assignment context only if approved | Credentials/secrets beyond approved device identity |

## Offline contract

Allowed without Internet, only while synchronized data is valid: local journey discovery,
route/stage display, local destination selection and approved fare lookup. A local hotspot
may transport this Passenger PWA traffic.

Never claim without central/provider connectivity: payment confirmation, settlement,
provider reconciliation or confirmed revenue. Offline financial settlement is not
implemented or authorized. Trusted central provider evidence remains the sole payment truth.

## Security gates that still block implementation

- Production local TLS/HTTP and passenger isolation model.
- Encrypted local persistence and Android Keystore/key-management design.
- Device identity, enrolment, revocation and lost/stolen-device response.
- Edge API authorization and local-network attack-surface controls.
- Edge/cloud synchronization authentication, replay protection and audit/redaction rules.
- Controlled retention and wipe behavior for any local operational data.

## Required evidence before Android implementation begins

1. Approved capability matrix and minimum OS/API level, then qualified devices.
2. Approved DMAC/contracts for local edge API and edge/cloud synchronization.
3. Security approval of local transport, encryption, Keystore, identity and secret boundaries.
4. Product/Operations acceptance targets for concurrency and endurance.
5. Target-device proof of hotspot stability, restart/lifecycle, recovery, battery/thermal,
   multi-passenger and offline/online transition behavior.

See `ANDROID_EDGE_PREREQUISITE_BATCH_1.md` for the recommendation rationale, data boundary,
proposed `/edge/v1` API, synchronization and offline contract.
See `ANDROID_EDGE_PREREQUISITE_BATCH_2.md` for Batch 2 identity, encryption, transport,
update, telemetry and device-loss recommendations.
