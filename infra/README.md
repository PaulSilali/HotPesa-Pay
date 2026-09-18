# Infrastructure

Use Docker Compose for local PostgreSQL/Redis and Terraform for approved cloud resources.
Do not provision production infrastructure from Phase 0 scaffolding. Separate development,
test, staging and production identities, secrets and data.

Start the development-only backing services with
`docker compose -f infra/docker/compose.yml up -d`. They bind only to localhost and use
the non-production values documented in `.env.example`.
