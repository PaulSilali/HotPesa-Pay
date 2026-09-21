# Sprint 5 field connectivity record

## Evidence status

This record separates workstation verification from required physical-device evidence. No row below is proof until its evidence field is completed.

| Item | Result | Evidence / limitation |
| --- | --- | --- |
| PC-hosted local HTTP configuration | READY | `HOST`, `VITE_HOST`, `VITE_API_URL` and explicit `CORS_ORIGINS` are configuration inputs. |
| Physical hotspot/local-network transport | PASS | PC-hosted HotPesa API and Passenger PWA were reached over the physical local network. This is not evidence that Android hosts HotPesa services. |
| Android hosting HotPesa services | NOT IMPLEMENTED | Current NestJS/PostgreSQL/Redis/BullMQ server stack is not an Android app runtime. ADR-002 is Decision Required and ADR-001/008 are Recommended for approval. |
| QR display from conductor host | NOT IMPLEMENTED | FR-JRN-004 requires it, but no conductor-host UI exists in this repository. |
| Local DNS/mDNS/captive portal | OPEN | No approved discovery mechanism is selected. |
| Production HTTPS/TLS topology | OPEN | HTTP is development-only; production transport remains an architecture/security decision. |

## Required physical record

| Field | Value |
| --- | --- |
| Test date / operator | Physical field proof reported to the repository; operator details were not recorded. |
| Host device and OS | PC-hosted development stack; device/OS details were not recorded. |
| Passenger device(s) and browser | Physical passenger client; device/browser details were not recorded. |
| Topology A/B/C | PC-hosted API and Passenger PWA over a physical local network/hotspot. |
| Observed host IP (not a permanent configuration) | Not retained as evidence; local host address remains environment configuration. |
| Passenger PWA URL / API URL | Physical local-network URLs reached successfully. |
| Trip ID / public code | Opaque active journey resolved; identifier deliberately not recorded. |
| Destination / approved fare | Westlands; approved server quote KES 80.00. |
| Internet state | Provider confirmation was exercised with trusted Mock M-Pesa evidence. No no-internet journey result is claimed. |
| Payment scenario | Passenger initiation followed by trusted Mock M-Pesa confirmation. |

## Acceptance evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Hotspot/local network created | PASS | Physical PC-hosted local-network transport was used for the verified flow. |
| Passenger joins | PASS | Passenger client reached the local Passenger PWA. |
| Passenger PWA reachable | PASS | Passenger PWA loaded over the physical local network. |
| API reachable | PASS | Passenger flow reached the HotPesa API over the physical local network. |
| Active journey | PASS | Opaque active journey resolved successfully. |
| Destination selection | PASS | Passenger selected Westlands. |
| Fare quote | PASS — KES 80.00 | Server returned the approved Westlands fare quote of KES 80.00. |
| Payment initiation boundary | PASS | Passenger action created the payment initiation request; no client-authoritative fare is claimed. |
| Trusted Mock M-Pesa confirmation | PASS | Trusted server-side Mock M-Pesa evidence confirmed the payment. |
| No-internet local journey | NOT TESTED |  |
| Reconnect | PASS | Passenger flow reconnected successfully during the physical local-network proof. |
| Trip-close invalidation | PASS | Closing the trip invalidated the active passenger journey. |
| Two-client behaviour | NOT TESTED |  |

## Narrow threat review

- A passenger journey URL is public and may be observed on a local HTTP network; it carries an opaque active code only and grants no workforce/admin privilege.
- HTTP hotspot transport is not production-secure. Do not expose database, Redis, admin, debug, provider credentials or privileged API routes to passengers.
- CORS must use explicit field-development origins; wildcard credential use is prohibited by `SEC-CORS-001`.
- Public journey links must be invalid after trip closure; this remains a mandatory physical-device check.
- Local connectivity, an STK prompt or a browser claim never proves payment settlement.

## Android-hosting feasibility

**REQUIRES EDGE/COMPANION ARCHITECTURE.** The current server runtime depends on NestJS, PostgreSQL, Redis and BullMQ; the repository contains no Android-compatible embedding, database, queue, lifecycle or managed-device implementation. Selecting an Android-native server, edge runtime, router/hardware or cloud-only alternative would be a material architecture decision and is not made here.
