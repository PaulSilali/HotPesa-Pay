# Architecture decision records

The controlled register is Document 11:
[Architecture Decision Record and Decision Log](../specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md).
The individual records in this directory are synchronized extracts for repository use;
they do not change the controlled register's status or confer production authorization.

## Register

| ADR | Decision | Register status |
| --- | --- | --- |
| [ADR-001](ADR-001-use-a-hybrid-vehicle-edge-and-cloud-architecture.md) | Use a hybrid vehicle edge and cloud architecture | Recommended for approval |
| [ADR-002](ADR-002-use-an-android-first-conductor-host.md) | Use an Android first conductor host | Decision required |
| [ADR-003](ADR-003-provide-a-no-install-passenger-web-experience.md) | Provide a no install passenger web experience | Recommended for approval |
| [ADR-004](ADR-004-keep-m-pesa-credentials-and-callbacks-in-cloud-services.md) | Keep M-Pesa credentials and callbacks in cloud services | Accepted architecture baseline |
| [ADR-005](ADR-005-treat-trusted-provider-evidence-as-the-sole-payment-truth.md) | Treat trusted provider evidence as the sole payment truth | Accepted and implemented in Phase 0 |
| [ADR-006](ADR-006-use-a-modular-monolith-for-the-initial-backend.md) | Use a modular monolith for the initial backend | Accepted implementation baseline |
| [ADR-007](ADR-007-use-postgresql-as-the-authoritative-operational-database.md) | Use PostgreSQL as the authoritative operational database | Accepted implementation baseline |
| [ADR-008](ADR-008-use-encrypted-local-persistence-and-an-outbox-on-the-android-host.md) | Use encrypted local persistence and an outbox on the Android host | Recommended for approval |
| [ADR-009](ADR-009-version-fare-schedules-with-controlled-approval.md) | Version fare schedules with controlled approval | Recommended for approval |
| [ADR-010](ADR-010-use-a-shared-multi-tenant-platform-with-strict-tenant-isolation.md) | Use a shared multi-tenant platform with strict tenant isolation | Recommended for approval |
| [ADR-011](ADR-011-use-queue-backed-asynchronous-workers-for-callbacks-reconciliation-and-reports.md) | Use queue-backed asynchronous workers | Recommended for approval |
| [ADR-012](ADR-012-minimize-passenger-identity-in-the-mvp.md) | Minimize passenger identity in the MVP | Recommended for approval |
| [ADR-013](ADR-013-use-a-pnpm-typescript-monorepo-with-bounded-applications-and-packages.md) | Use a pnpm TypeScript monorepo | Accepted and implemented in Phase 0 |
| [ADR-014](ADR-014-use-react-typescript-and-vite-for-web-and-pwa-surfaces.md) | Use React, TypeScript and Vite for web/PWA surfaces | Accepted implementation baseline |
| [ADR-015](ADR-015-version-http-and-event-contracts-and-require-idempotency-keys.md) | Version contracts and require idempotency keys | Accepted implementation baseline |
| [ADR-016](ADR-016-use-an-internal-mock-m-pesa-adapter-for-phase-0-only.md) | Use an internal Mock M-Pesa adapter for Phase 0 only | Accepted with strict scope |
| [ADR-017](ADR-017-use-managed-workforce-authentication-with-application-owned-authorization.md) | Use managed workforce authentication | Decision required |
| [ADR-018](ADR-018-deploy-containerized-services-to-a-managed-cloud-platform.md) | Deploy containerized services to a managed cloud platform | Decision required |

## Lifecycle rules

Use only the controlled lifecycle states: Proposed, Recommended for approval, Decision
required, Accepted, Implemented, Validated, Rejected, Deprecated and Superseded. Proposed
or recommended records permit analysis or reversible preparation only. A decision-required
record stops its affected gate. Implemented is not Validated, and none of these states is
by itself a production approval.

Create an ADR before changing a trust boundary, provider integration, payment authority,
datastore, queue, runtime, framework, hosting model, deployment unit, versioned contract,
personal-data category, processor, region, retention model, tenancy, identity,
authorization, encryption, recovery or availability architecture. Accepted decisions are
immutable except for lifecycle/link/review metadata; supersede them with a new ADR.

## Known controlled-document conflict

Document 05 TRD section 26 reuses ADR-001 through ADR-012 for different decisions than
Document 11. The individual records follow Document 11 because it is the dedicated ADR
register. The Architecture Review Board owns resolution of the duplicate numbering before
either draft is approved; no status or identifier has been guessed here.
