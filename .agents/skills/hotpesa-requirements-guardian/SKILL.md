---
name: hotpesa-requirements-guardian
description: Analyze proposed HotPesa features, changes, stories, or fixes against approved MVP scope, requirements, ADRs, privacy, security, contracts, and traceability before implementation.
---

# HotPesa requirements guardian

Read `docs/requirements/MASTER_BASELINE.md`, affected ADRs and contracts. Identify the
requirement IDs, user outcome, acceptance criteria, affected components, data, threats,
tests and operational evidence. Classify the request as in-scope, deferred, conflicting,
or requiring an external decision. Do not reinterpret regulatory, Safaricom, SACCO or
commercial unknowns as engineering assumptions. Propose an ADR for a material new choice.

Keep the MVP invariants: no custody/wallet, direct settlement to SACCO/operator merchant,
accountless passenger path, no biometrics, versioned approved fares, no dynamic pricing,
one controlled pilot and no offline settlement claim. Update traceability whenever code,
contracts or acceptance changes.
