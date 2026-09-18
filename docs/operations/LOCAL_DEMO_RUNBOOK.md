# HotPesa Pay local Phase 0 demo

This runbook starts the browser-testable vertical slice with synthetic data and the
internal Mock M-Pesa adapter. It does not connect to Daraja, move money, deploy
infrastructure, or provide production authentication.

## Prerequisites

- Node.js 22 or a compatible version declared by the root `package.json`
- pnpm 9.15.0
- Chromium installed for Playwright (`pnpm exec playwright install chromium`)
- Docker Compose only when exercising durable PostgreSQL mode

Install the exact dependency graph:

```powershell
npx --yes pnpm@9.15.0 install --frozen-lockfile
```

## Automated browser demonstration

Build the workspace, then run the browser suite. Playwright starts and stops the API,
passenger PWA, and admin web servers automatically.

```powershell
npx --yes pnpm@9.15.0 verify
npx --yes pnpm@9.15.0 test:e2e
```

The suite must discover at least one Playwright file and pass three journeys:

1. trusted server-side confirmation;
2. provider-declared failure;
3. duplicate callback with one state change and a duplicate audit event.

## Manual browser demonstration

Use three PowerShell terminals from the repository root.

Terminal 1 — API with an isolated in-memory test store:

```powershell
npx --yes pnpm@9.15.0 --filter @hotpesa/api build
node services/api/dist/src/main.js
```

Terminal 2 — passenger PWA:

```powershell
npx --yes pnpm@9.15.0 --filter @hotpesa/passenger-pwa exec vite --host 127.0.0.1 --port 4173
```

Terminal 3 — administration web:

```powershell
npx --yes pnpm@9.15.0 --filter @hotpesa/admin-web exec vite --host 127.0.0.1 --port 4174
```

Open:

- Passenger: `http://127.0.0.1:4173/journey/demo-nairobi-cbd-westlands`
- Administration: `http://127.0.0.1:4174`
- API health: `http://127.0.0.1:3000/health`

Use a synthetic phone such as `+254700000001`. Choose a deterministic scenario in the
passenger form. A missing-callback attempt remains pending until **Run provider status
check** is selected. The admin page refreshes automatically and exposes development-only
reconcile, expire, and conflict controls.

The in-memory mode is intentionally isolated and loses state on restart. It is used by
automated tests; it is not evidence of callback durability.

## Durable local PostgreSQL mode

Start the development-only containers:

```powershell
docker compose -f infra/docker/compose.yml up -d
```

Then start the API terminal with the development connection values already documented in
`.env.example`:

```powershell
$env:HOTPESA_STORE="postgres"
$env:DATABASE_URL="postgresql://hotpesa:hotpesa_dev_only@127.0.0.1:5432/hotpesa_dev"
npx --yes pnpm@9.15.0 --filter @hotpesa/api build
node services/api/dist/src/main.js
```

Payment attempts, provider-event receipts, and redacted audit events are written before
mutating requests return and are reloaded after an API restart. Stop containers without
deleting the data volume:

```powershell
docker compose -f infra/docker/compose.yml down
```

## Expected state semantics

| State | Meaning |
| --- | --- |
| `created` | Server-side attempt exists. |
| `initiating` | Mock provider request is being made; not paid. |
| `pending` | Waiting for trusted provider evidence; not paid. |
| `confirmed` | Trusted Mock M-Pesa callback or status evidence confirms payment. |
| `failed` | Trusted provider evidence reports failure. |
| `expired` | No confirmation arrived before the attempt expired. |
| `review-required` | Late or conflicting trusted evidence needs operations review. |

## Safety boundaries

- Do not enter a real passenger phone number; use synthetic data only.
- Do not add Daraja or production credentials to this repository.
- A hotspot, HTTP response, initiated prompt, timeout, or client message is never proof of payment.
- The local admin route has no workforce login and is strictly a development demonstration.
- HotPesa is not a wallet or custodian; settlement remains outside this mock slice.
