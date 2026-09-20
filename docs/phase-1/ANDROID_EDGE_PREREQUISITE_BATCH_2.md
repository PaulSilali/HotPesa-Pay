# Android edge prerequisite decision batch 2

> Status: **Recommended for approval**. No Android implementation is authorized.

| Area | Recommendation | Status |
| --- | --- | --- |
| Device identity | Opaque app-issued device ID bound to Android-Keystore signing keypair | Recommended for approval |
| Enrollment | Operator authentication plus tenant/assignment validation and administrator/SACCO approval | Decision required — workflow owner |
| Revocation | Central revocation denies privileged sync and requires re-enrollment | Recommended for approval |
| Keystore | Keystore private/wrapping keys; hardware-backed preferred; StrongBox opportunistic | Recommended for approval |
| Local database | Room-compatible full DB encryption with Keystore-wrapped key | Recommended for approval |
| Local transport | HTTP only for explicit development field proof; production TLS model unresolved | Decision required |
| Sync authentication | User-and-device binding with signed proof and HotPesa resource policy | Recommended for approval |
| Updates | Managed/private distribution, fleet visibility and minimum-version enforcement | Recommended for approval |

Do not use IMEI as the primary application identity. Enrollment creates a new Keystore keypair and opaque device ID after central validation. Replacement creates a new binding and revokes the old one. Lost, stolen, compromised, reassigned, tenant-changed or integrity-failed devices are centrally revoked; they cannot synchronize privileged data or create payment handoffs and must clear bounded local operational data on next authenticated contact/app launch.

## Authorization and privacy boundary

| Function | Classification |
| --- | --- |
| Edge health/connectivity | PUBLIC LOCAL — minimal status, rate limited, no secrets/diagnostics |
| Journey/route/fare quote and destination selection | PASSENGER SESSION — opaque session scope, validation, idempotency, isolation |
| Device configuration/diagnostics | CONDUCTOR AUTHENTICATED or DEVICE INTERNAL |
| Sync | DEVICE INTERNAL — credential proof, replay protection, central authorization |
| Provider/admin/financial functions | CENTRAL ONLY |

Hotspot secrecy is not a control. Use opaque journey codes, minimized data, validation, rate limiting, CORS/origin controls and session isolation. Provider secrets, full payment evidence, confirmed revenue and passenger PII are not stored locally. Required telemetry is device/app/DB version, heartbeat/sync, active-trip presence, outbox depth, restart/storage/security state; battery, charging, thermal and hotspot state are optional. Retention, export and wipe duration remain Security/Privacy decisions.

## Open security gates

- Production local TLS/HTTP and passenger-isolation model.
- Exact encryption library, migration/rotation/recovery behavior and Keystore fallback risk acceptance.
- Token lifetimes, offline credential duration, clock skew and rotation cadence.
- Enrollment approval owner, update operational owner, retention/wipe policy and rooted-device exception policy.

Rooted, bootloader-unlocked, tampered or integrity-failed devices should be restricted from privileged sync pending Security review; full block versus documented pilot exception remains open. Device credentials, local database and outbox must not be restored through consumer backup. Field validation must cover sniffing/MITM, endpoint access, invalid codes, revoked device, loss, restart/reboot, key persistence, reconnect and cross-passenger isolation.
