# Phase 0 repository foundation traceability

These control identifiers trace the explicitly approved repository-correction task. They
do not add product, fare, settlement, privacy or regulatory requirements.

| Control ID | Acceptance criterion | Evidence |
|---|---|---|
| PH0-REP-001 | Exactly seven approved skills exist under `.agents/skills`, each with a direct `SKILL.md`; no duplicate `.codex/skills` tree or inactive vendor repository remains | `pnpm verify:discovery` plus repository structure inspection |
| PH0-REP-002 | Passenger PWA, admin web, API, contracts, design tokens and config are real pnpm workspace packages | Package manifests, TypeScript source and `pnpm-workspace.yaml` |
| PH0-REP-003 | Every workspace package has lint, typecheck, unit-test and build commands; CI fails if an expected project or test file is absent | `scripts/verify-discovery.mjs`, package scripts and `.github/workflows/ci.yml` |
| PH0-REP-004 | Local PostgreSQL and Redis are defined with development-only values and localhost bindings | `infra/docker/compose.yml` and `.env.example` |
| PH0-REP-005 | Retained third-party licence obligations and skill provenance are documented | `THIRD_PARTY_NOTICES.md` and licence files beside retained skills |
| PH0-REP-006 | The foundation adds no live M-Pesa implementation, production credential, infrastructure deployment or MVP expansion | Source review and secret scan |

## Verification mapping

- Automated: discovery guard, ESLint, TypeScript typecheck, six Vitest unit-test files,
  six package builds and production dependency audit.
- Structural/manual: exact skill directory allowlist, direct licence-file presence,
  `.codex/skills` absence and Docker Compose development-only review.
- External/unevidenced: GitHub branch protection, real CODEOWNERS identities, Docker
  runtime execution and all production/regulatory approvals remain outside this task.
