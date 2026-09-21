# HotPesa Android edge â€” Phase 0 skeleton

`apps/android-host` is the single Android root for the HotPesa conductor-edge runtime. It
uses Kotlin, Android Gradle Plugin 8.7.3, Gradle Wrapper, JDK 17, `minSdk` 29 and
`compileSdk`/`targetSdk` 35. Its application ID and namespace are `com.hotpesa.edge`.

## Scope

Phase 0 implements only a development runtime skeleton:

- Room schema version 1 for non-financial metadata;
- a Keystore-backed device-signing identity abstraction;
- a future encrypted-database key-reference boundary (not database encryption);
- a development-only HTTP server exposing `GET /edge/v1/health` on `0.0.0.0:8787`;
- service start, stop and restart-safe initialization.

The response is deterministic and contains only `status`, `service`, `apiVersion`,
`appVersion` and `runtimeState`. Development HTTP is not production transport; AE-08
remains a Security decision.

The project has no payments, provider credentials/evidence, fare or trip APIs, sync,
outbox delivery, financial entities, confirmed revenue, passenger identity persistence or
production enrollment. The central HotPesa backend remains authoritative.

## Local development

Set `JAVA_HOME` to a JDK 17 installation and ensure the Android SDK is available. On
Windows, run from this directory:

```powershell
.\gradlew.bat --version
.\gradlew.bat assembleDebug
.\gradlew.bat test
.\gradlew.bat lint
```

Instrumentation tests require an available emulator or connected device:

```powershell
.\gradlew.bat connectedAndroidTest
```

No physical-device, hotspot, production transport, endurance or background-reliability
claim is made by this skeleton. Those require separately recorded field evidence.
