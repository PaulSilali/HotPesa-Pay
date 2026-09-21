# ADR-002 conductor device / edge deployment analysis

> Supporting analysis for [ADR-002](ADR-002-use-an-android-first-conductor-host.md). The project-owner decision below authorizes bounded implementation preparation; it does not alter the controlled ADR register, whose status remains **Decision required** until controlled publication.

| Field | Value |
| --- | --- |
| Controlled ADR status | **Decision required** |
| Project-owner decision status | **Approved for bounded implementation; controlled synchronization pending** |
| Decision owner | Project owner, with Mobile, Architecture, Security and Operations review |
| Approved decision | Use a hybrid edge/cloud MVP model. A lightweight Android-native companion edge may host local passenger journey/session functions and synchronized non-financial route/fare data. The cloud/backend remains authoritative for payments, provider credentials, payment evidence, reconciliation, audit, confirmed revenue, tenant policy and durable financial state. |
| Explicit exclusion | Do not deploy the full NestJS + PostgreSQL + Redis + BullMQ + worker stack on a conductor Android phone. |
| Fallback | Use a dedicated onboard edge device only if Android fails approved reliability, security, lifecycle, concurrency or endurance criteria. |
| Scope | Target edge deployment/runtime decision only; no runtime implementation is included in this record. |

## Context and problem

The approved MVP calls for an Android conductor host for hotspot/session operation, while ADR-001 recommends a hybrid vehicle-edge/cloud architecture. ADR-004 keeps provider credentials, callbacks and trusted payment evidence in cloud services; ADR-007 makes PostgreSQL the authoritative operational database; and ADR-011 uses a Redis-backed worker for asynchronous reconciliation.

The current implementation is a Node/NestJS API with a separate Node/BullMQ worker, PostgreSQL and Redis. Docker Compose assumes a Linux container engine, persistent PostgreSQL volume, loopback database/Redis ports and independently supervised API and worker processes. The Passenger PWA is a Vite-served browser application. This is a server/workstation architecture, not an Android runtime.

The decision is therefore not whether a PC-hosted field proof works: it does. The decision is which supported vehicle-edge runtime can provide local passenger access without weakening cloud payment authority or assuming Android can reliably run the existing full stack.

## Current verified evidence

The Sprint 5 PC-hosted physical local-network proof passed API and Passenger PWA reachability, active journey resolution, Westlands destination selection and server fare quote of KES 80.00, payment initiation, trusted Mock M-Pesa confirmation, reconnect and trip-close invalidation. It did **not** prove Android hosting, multi-passenger behavior, no-internet local journey, production hosting or live M-Pesa. See [Sprint 5 field record](../phase-1/SPRINT_5_FIELD_CONNECTIVITY_RECORD.md).

## Architecture options

| Option | Fit with approved boundaries | Main consequence |
| --- | --- | --- |
| A. Android hosts the full existing stack | Poor | Requires Node/NestJS, PostgreSQL, Redis, BullMQ and a worker to survive Android lifecycle, battery and hotspot constraints. |
| B. Android-native lightweight edge service | Strong | Requires a deliberately bounded Kotlin/Android edge implementation and controlled sync contracts. |
| C. Dedicated onboard edge device | Strong technically; operationally heavier | Can host a Linux-compatible local stack, but adds vehicle hardware, power, inventory and replacement obligations. |
| D. Cloud only | Weak for local-resilience intent | Simplest operations, but passenger flow requires upstream connectivity and loses the intended local journey capability. |
| E. Hybrid edge/cloud | Strong; governing pattern in ADR-001 | The vehicle edge provides local journey access while cloud remains the payment and durable-record authority. |

### Option A — full Android hosting

Running the existing stack directly on a conductor phone is not operationally appropriate. It depends on a PostgreSQL runtime and durable storage semantics, a Redis/BullMQ runtime, separate API and worker processes, port binding, process supervision and predictable restart behavior. Android background restrictions, battery optimisation, manufacturer variation, hotspot interaction and application termination make those assumptions unsuitable for an MVP payment-adjacent field host. It also expands package/update, local attack-surface and recovery complexity. Technical experimentation does not establish supportability.

### Option B — Android-native lightweight edge service

An Android application could expose a bounded local HTTP experience, manage hotspot/session state and encrypted minimal persistence. It must not contain production provider secrets or become the payment, reconciliation, revenue or cross-tenant authority. It is compatible with ADR-008's proposed encrypted local persistence/outbox pattern, subject to its own approval and DMAC-defined synchronization semantics.

### Option C — dedicated onboard edge device

A managed router/computer could run Linux-compatible local components with fewer Android lifecycle constraints and greater multi-passenger headroom. It increases vehicle cost, installation, power, tamper resistance, fleet inventory, support and replacement burden. It is an alternative if the Android target-device spike disproves option B, not an automatic first-pilot choice.

### Option D — cloud only

The conductor phone would provide connectivity only and every passenger journey interaction would depend on upstream Internet. This keeps operations simple but conflicts with the local-resilience motivation of ADR-001 and does not use the successful local-network proof beyond browser reachability.

### Option E — hybrid edge/cloud

This is the architecture pattern already recommended by ADR-001. Option B is the proposed first implementation of its vehicle edge. Option C remains the fallback platform if field evidence shows Android cannot meet the approved device, endurance, security or concurrency criteria.

## Comparison matrix

| Criterion | A Full Android stack | B Lightweight Android edge | C Dedicated edge device | D Cloud only | E Hybrid edge/cloud |
| --- | --- | --- | --- | --- | --- |
| Current-stack compatibility | Poor | Requires new bounded component | Strong for Linux stack | Strong | Strong overall |
| Android lifecycle/battery | Poor | Manageable with native design and proof | N/A | Phone only provides connectivity | Depends on chosen edge |
| Local passenger access | Possible but fragile | Strong | Strong | Upstream dependent | Strong |
| Payment correctness | High risk if local stack broadens authority | Cloud authority retained | Cloud authority retained | Cloud authority retained | Cloud authority retained |
| Restart/data durability | Operationally unsuitable | Requires encrypted local store/outbox proof | Requires device storage/recovery proof | Central only | Explicit local/central recovery design |
| Multi-passenger scale | Unproven and resource constrained | Must be field-tested | Better headroom, still needs test | Upstream constrained | Depends on selected edge |
| Cost/support burden | Hidden, high support risk | Lowest additional hardware burden | Higher vehicle hardware burden | Lowest edge burden | Moderate; justified by resilience |
| Recommended role | Reject | Preferred vehicle-edge platform | Fallback/scale option | Fallback when local resilience is not required | Governing architecture |

## Local versus central data boundary

| Data | Classification | Rule |
| --- | --- | --- |
| Route definitions, stages, approved fare tables and fare versions | Synced copy / local candidate | Versioned, signed or integrity-checked data; stale-data policy requires controlled specification. |
| Active trip/session and public journey code | Local candidate and synced copy | Minimal state only; expiration, revocation and server conflict rules must be defined. |
| Passenger destination selection | Local candidate / synced event | Non-financial selection; replay must be idempotent. |
| Payment attempts, provider evidence, reconciliation jobs, audit events and confirmed revenue | Central authoritative | PostgreSQL/cloud authority. No provider callback endpoint or production credential on edge. |
| Operator configuration and tenant/authorization policy | Central authoritative | Edge receives only the minimum scoped configuration necessary for an active assignment. |

## Offline and connectivity behavior

When the conductor has no Internet but the hotspot remains available, a bounded edge may continue only approved local journey/session and non-financial passenger interactions using already-synchronized data. It must not represent a payment as confirmed, perform provider reconciliation locally, or queue financial settlement as an offline claim. If the provider API is unavailable, a payment remains pending/review-required under the existing payment policy; trusted late evidence remains authoritative. When Internet returns, authenticated, idempotent synchronization may resume under a future approved contract. Passenger mobile data is not required for local PWA reachability, but provider payment connectivity remains a cloud/provider dependency.

## Security considerations

- Local HTTP proof is development evidence only. Production local transport, TLS/address-discovery and passenger isolation require security architecture approval.
- Public journey URLs remain opaque and unprivileged; privileged workforce/admin routes must not be exposed to passengers.
- The edge is a hostile/lost-device risk: minimize retained data, encrypt it, use device-bound identity and support revocation/wipe.
- Do not store provider credentials, callback secrets or production payment authority on the conductor device.
- Sync must authenticate the edge, scope tenant/vehicle/assignment access, protect replay and retain redacted audit evidence.

## Operational considerations and migration impact

Option B requires a new Android-native bounded edge component, device/OS support matrix, lifecycle policy, encrypted persistence, controlled update/revocation, health telemetry and recovery/replacement procedure. It does not authorize migration of NestJS, PostgreSQL, Redis, BullMQ or the current worker onto Android. Before implementation, DMAC/contracts must define edge identities, versions, sync/outbox event identities, conflicts, retention and server acceptance. The first target-device spike must test hotspot stability, background/restart behavior, battery/thermal profile, passenger concurrency, offline/online recovery, device replacement and lost-device handling.

## Risks and open questions

1. Which Android devices, OS versions, hotspot behavior and enrollment model are approved for the pilot?
2. Is production local TLS/address discovery feasible without weakening passenger usability or security?
3. What passenger concurrency and trip endurance acceptance thresholds are required?
4. Which route/fare/session data may remain locally available, for how long, and how is stale/revoked data handled?
5. What edge-to-cloud sync contract, conflict policy, retention and operational telemetry are approved?
6. Under what measured threshold would the pilot move to a dedicated edge device?

## Recommended decision for human approval

**Recommend Option E, hybrid edge/cloud, implemented first through Option B, an Android-native lightweight edge service.** Retain Option C, a dedicated managed onboard edge device, as the fallback if the approved Android device spike fails the required reliability, security, endurance or multi-passenger criteria. Reject Option A for the MVP: do not run the existing NestJS/PostgreSQL/Redis/BullMQ/worker stack on a conductor Android phone. Do not select cloud-only Option D unless Product and Architecture explicitly accept loss of local journey resilience.

## Rationale, consequences and rollback

This recommendation follows ADR-001's hybrid pattern, ADR-004's cloud payment trust boundary, ADR-007's PostgreSQL authority and ADR-008's proposed bounded Android persistence. It preserves local passenger reachability while centralizing payment truth, provider integration, reconciliation and durable reporting. The trade-off is a new edge/sync surface and device operations work. If the Android spike fails, retain cloud authority and move the bounded local edge responsibility to a managed dedicated device; do not fall back to a phone-hosted full server stack.

## Validation before implementation authorization

The project owner has approved the ADR-002/ADR-008 architecture boundary for bounded
implementation. Controlled DMAC synchronization, security review, approved device matrix,
minimum OS/API level, and target-device field evidence remain required before Android
implementation begins. This analysis does not authorize production hosting, production
provider selection, live M-Pesa use or alteration of controlled DOCX sources.
