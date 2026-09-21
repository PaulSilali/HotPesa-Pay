# Android edge Phase 0 implementation evidence

> Scope: owner-approved Android Edge Phase 0 skeleton only. This record is implementation
> evidence, not controlled-document publication, Phase 1 authority or production approval.

## Implemented boundary

| Area | Evidence | Status |
| --- | --- | --- |
| Project root | `apps/android-host` is the single Android project root. | Implemented |
| Toolchain | Gradle Wrapper 8.9; Android Gradle Plugin 8.7.3; Kotlin 2.0.21; JDK 17. | Tested locally |
| Android API policy | `minSdk` 29; `compileSdk` 35; `targetSdk` 35. | Implemented and built locally |
| Application identity | Application ID and namespace: `com.hotpesa.edge`. | Implemented |
| Room | Schema version 1; `EdgeMetadataEntity` and DAO only; schema exported under `app/schemas`. | Implemented; instrumentation coverage present |
| Encryption boundary | `LocalDatabaseKeyProvider` exposes only a Keystore key reference. No raw key is persisted or hard-coded. | Implemented as abstraction |
| Database encryption | No concrete encrypted Room database has been selected or claimed. | Security finalization blocked |
| Device identity | `AndroidKeystoreDeviceIdentityProvider` creates/loads an ECDSA signing identity, publishes public-key metadata/fingerprint and signs challenges without an application private-key export API. | Implemented; instrumentation coverage present |
| Runtime | `EdgeRuntimeService` owns a start/stop/restart-safe `EdgeRuntime`. It is not a foreground service in Phase 0. | Implemented and JVM-tested |
| Local server | Development HTTP server supports only `GET /edge/v1/health`; default bind is `0.0.0.0:8787`. | Implemented and JVM-tested |

The health response contains only `status`, `service`, `apiVersion`, `appVersion` and
`runtimeState`. It contains no tenant data, device secret, private key, provider credential
or payment information.

## Automated evidence

Executed locally on 2026-09-20:

| Check | Result |
| --- | --- |
| `gradlew.bat --version` | PASS — Gradle 8.9 on Temurin JDK 17 |
| `gradlew.bat assembleDebug` | PASS — `app-debug.apk` produced |
| `gradlew.bat test` | PASS — debug and release JVM test variants |
| JVM lifecycle/health tests | PASS — start, stop, endpoint unavailability after stop and restart |
| JVM encryption-boundary test | PASS — only stable Keystore key reference is exposed |
| `gradlew.bat lint` | PASS with warnings only; no lint errors |
| `adb devices` | No emulator or physical device attached |

The instrumentation suite contains Room creation/read/write/schema-version coverage and
Android Keystore create/reload/sign/verify coverage. It is **not executed** until an emulator
or authorised device is available; JVM tests are not represented as device-Keystore proof.

## Emulator / physical-device validation attempt (2026-09-20)

This validation pass found a usable host toolchain but no Android runtime: `adb devices -l`
reported no attached devices and `emulator -list-avds` reported no configured AVD. The
following host-side evidence was obtained without altering the application boundary:

| Check | Result | Evidence boundary |
| --- | --- | --- |
| Toolchain | PASS | Temurin JDK 17.0.20.1, Gradle 8.9, Android SDK platforms 29 and 35, Build Tools 34.0.0–37.0.0 and ADB 37.0.1 are available. |
| Debug and release APKs | PASS | `gradlew.bat assembleDebug assembleRelease` completed successfully. |
| JVM tests | PASS | `gradlew.bat test` completed successfully for debug and release variants. |
| Lint | PASS | `gradlew.bat lint` completed successfully; no lint errors. |
| Instrumentation APK | PASS (compiled only) | `gradlew.bat assembleDebugAndroidTest` completed successfully; no instrumentation test was executed. |
| Backup/device-transfer exclusion | STATIC VALIDATION PASS | Manifest disables backup and references rules excluding database, shared preferences, file and external storage from cloud backup and device transfer. |

`DEVICE_RUNTIME_VALIDATION=BLOCKED`: no ADB-visible physical device, running emulator or
available AVD exists in this environment. Consequently APK install/launch, Room runtime,
Android Keystore runtime, HTTP `200` evidence and start/stop/restart lifecycle on Android
remain unverified. This is not represented as a passing device validation.

## Security and scope review

- No provider credentials, M-Pesa logic, payment confirmation, reconciliation, settlement,
  confirmed-revenue logic or financial database entities were added.
- The full NestJS/PostgreSQL/Redis/BullMQ/worker stack is not included on Android.
- Android backup and device-transfer rules exclude app database and local app storage.
- Development HTTP is not production TLS. AE-08 remains an open Security decision.
- No tenant enrolment, central credential issuance, device approval/revocation workflow,
  sync/outbox delivery, route/fare/trip endpoint, passenger PII persistence or native
  Passenger UI was added.

## Remaining gates

| Gate | Status | Owner / evidence required |
| --- | --- | --- |
| Production local transport/TLS and passenger isolation | Blocked | Security decision AE-08 |
| Concrete encrypted-database implementation | Blocked | Security design/approval |
| Device enrolment, revocation and loss response | Deferred | Security, Operations and controlled publication |
| Local API authorization and edge/cloud sync | Blocked | Controlled DMAC and Security approval |
| Foreground/background endurance, hotspot stability and concurrency | Field evidence required | Mobile/Operations on qualified devices |
| Emulator/physical Keystore and Room proof | Field/emulator evidence required | Mobile/QA |

Android Edge Phase 1 local journey remains blocked by the recorded gates. This Phase 0
skeleton does not authorize it.
