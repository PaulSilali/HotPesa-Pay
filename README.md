# HotPesa Pay

HotPesa Pay is an Android-hosted, contactless public-transport fare orchestration and
verification platform for Kenya. In the approved MVP, an Android conductor device
provides a local hotspot and host experience, passengers use a PWA reached by QR or
short URL, and M-Pesa remains the payment rail. HotPesa does not hold passenger funds.

## Phase 0 objective

Prove the riskiest technical assumptions before feature-scale development:

1. Android hotspot discovery and local passenger-session exchange.
2. M-Pesa sandbox initiation, callback validation, idempotency, and reconciliation.
3. Repository, environment, CI/CD, security, and evidence controls.
4. Clear payment states that never present a pending or offline event as settled.

## Workspace map

- `apps/android-host` — Kotlin/Jetpack Compose conductor application.
- `apps/passenger-pwa` — TypeScript passenger web application.
- `apps/admin-web` — React/TypeScript operator administration.
- `services/api` — NestJS modular-monolith API.
- `packages/contracts` — versioned API/event contracts.
- `packages/design-tokens` — shared visual and motion tokens.
- `infra` — local containers and infrastructure definitions.
- `docs` — requirements, architecture, UX, security, test and operating guidance.
- `.agents/skills` — the seven explicitly approved project and review skills.

## Start safely

Read `AGENTS.md`, `docs/phase-0/PHASE_0_CHECKLIST.md`, and
`docs/ai-skills/CODEX_CASA_INTEGRATION.md`. Copy `.env.example` to a local `.env` only
when needed; never commit secrets. Phase 0 is restricted to synthetic data and the
Safaricom sandbox until external approvals and production controls are complete.

Install with `pnpm install --frozen-lockfile`, then run `pnpm verify`. The verification
command requires all six workspace projects and at least one unit-test file in each; an
empty or undiscovered workspace fails instead of producing a false-green result.
