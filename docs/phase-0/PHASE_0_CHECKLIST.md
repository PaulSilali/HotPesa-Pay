# Phase 0 checklist

## Repository and controls

- [ ] Branch protection and required reviews configured.
- [ ] CODEOWNERS replaced with real identities/teams.
- [ ] CI lint, types, unit tests, contract tests, build and secret scan pass.
- [ ] Dependency, SAST, container and IaC scanning selected and enabled.
- [ ] Environment separation and least-privilege access documented.
- [ ] No production credentials or real passenger data used.

## Android hotspot proof

- [ ] Supported Android/API/device matrix recorded.
- [ ] Hotspot/local-only behavior tested on at least two representative devices.
- [ ] QR and short URL lead to the same scoped journey session.
- [ ] Session tokens are short-lived, unguessable, scoped and replay-resistant.
- [ ] Reconnect, host restart, journey close and stale-session behavior tested.
- [ ] Local channel never asserts financial settlement.

## M-Pesa sandbox proof

- [ ] Secrets stored outside source control.
- [ ] Initiation uses a client idempotency key and server-side payment attempt ID.
- [ ] Callback accepts duplicates and out-of-order events safely.
- [ ] Raw inbound evidence is integrity-protected and sensitive fields are redacted.
- [ ] Pending, confirmed, failed, expired and manual-review states are explicit.
- [ ] Scheduled status query/reconciliation repairs missed callbacks.
- [ ] Timeout and provider-unavailable behavior is tested.

## Exit evidence

- [ ] Threat model and data-flow review approved.
- [ ] Demonstration runbook and results saved.
- [ ] Phase 0 acceptance gates traced to automated/manual evidence.
- [ ] External blockers are recorded; no sandbox result is described as production approval.
