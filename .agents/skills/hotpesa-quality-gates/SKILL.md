---
name: hotpesa-quality-gates
description: Review HotPesa pull requests, Phase 0 proofs, releases, or environments against traceability, testing, security, privacy, accessibility, reliability, CI/CD, and operational evidence; use for readiness decisions, not ordinary coding.
---

# HotPesa quality gates

Report findings by severity with file/evidence references. Verify requirement and ADR
links, acceptance tests, contract compatibility, idempotency/failure cases, secrets and
PII handling, least privilege, structured redacted logs, accessibility, reduced motion,
performance and rollback. Distinguish automated evidence, manual evidence and unevidenced
claims. A sandbox proof can pass Phase 0 while production readiness remains blocked.

Use the verdicts pass, conditional pass, or fail. Conditions must name an owner, evidence
needed and gate. Never waive a payment-truth, secret-exposure, personal-data, authorization
or regulatory blocker merely to meet a schedule.
