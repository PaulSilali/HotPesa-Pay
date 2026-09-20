# Sprint 5 field connectivity record

## Evidence status

This record separates workstation verification from required physical-device evidence. No row below is proof until its evidence field is completed.

| Item | Result | Evidence / limitation |
| --- | --- | --- |
| PC-hosted local HTTP configuration | READY | `HOST`, `VITE_HOST`, `VITE_API_URL` and explicit `CORS_ORIGINS` are configuration inputs. |
| Android hotspot as access point | NOT TESTED | Requires conductor Android device and passenger device. |
| Android hosting HotPesa services | NOT IMPLEMENTED | Current NestJS/PostgreSQL/Redis/BullMQ server stack is not an Android app runtime. ADR-002 is Decision Required and ADR-001/008 are Recommended for approval. |
| QR display from conductor host | NOT IMPLEMENTED | FR-JRN-004 requires it, but no conductor-host UI exists in this repository. |
| Local DNS/mDNS/captive portal | OPEN | No approved discovery mechanism is selected. |
| Production HTTPS/TLS topology | OPEN | HTTP is development-only; production transport remains an architecture/security decision. |

## Required physical record

| Field | Value |
| --- | --- |
| Test date / operator |  |
| Host device and OS |  |
| Passenger device(s) and browser |  |
| Topology A/B/C |  |
| Observed host IP (not a permanent configuration) |  |
| Passenger PWA URL / API URL |  |
| Trip ID / public code |  |
| Destination / approved fare |  |
| Internet state |  |
| Payment scenario |  |

## Acceptance evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Hotspot/local network created | NOT TESTED |  |
| Passenger joins | NOT TESTED |  |
| Passenger PWA reachable | NOT TESTED |  |
| API reachable | NOT TESTED |  |
| Active journey / destination / fare quote | NOT TESTED |  |
| Payment initiation boundary | NOT TESTED |  |
| No-internet local journey | NOT TESTED |  |
| Reconnect | NOT TESTED |  |
| Trip-close invalidation | NOT TESTED |  |
| Two-client behaviour | NOT TESTED |  |

## Narrow threat review

- A passenger journey URL is public and may be observed on a local HTTP network; it carries an opaque active code only and grants no workforce/admin privilege.
- HTTP hotspot transport is not production-secure. Do not expose database, Redis, admin, debug, provider credentials or privileged API routes to passengers.
- CORS must use explicit field-development origins; wildcard credential use is prohibited by `SEC-CORS-001`.
- Public journey links must be invalid after trip closure; this remains a mandatory physical-device check.
- Local connectivity, an STK prompt or a browser claim never proves payment settlement.

## Android-hosting feasibility

**REQUIRES EDGE/COMPANION ARCHITECTURE.** The current server runtime depends on NestJS, PostgreSQL, Redis and BullMQ; the repository contains no Android-compatible embedding, database, queue, lifecycle or managed-device implementation. Selecting an Android-native server, edge runtime, router/hardware or cloud-only alternative would be a material architecture decision and is not made here.
