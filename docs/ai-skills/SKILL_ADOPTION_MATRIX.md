# Skill adoption matrix

| Skill | Origin | Priority | Applies to | Integration | Guardrail |
|---|---|---:|---|---|---|
| `hotpesa-motion-design` | Adapted from attached MIT skill | P1 | Compose, PWA, admin UI | Invoke for motion specs, implementation and review | Payment truth and reduced motion override decoration |
| `hotpesa-requirements-guardian` | HotPesa-specific | P0 | All changes | Map request → requirement → ADR → tests | Stop on unresolved scope/regulatory assumptions |
| `hotpesa-kenya-payments` | HotPesa-specific | P0 | API/payment UI/ops | Drive sandbox adapters, callbacks, idempotency and reconciliation | No custody; no success before trusted confirmation |
| `hotpesa-quality-gates` | HotPesa-specific | P0 | CI/release | Produce evidence-based readiness review | Sandbox proof is not production approval |
| `ui-ux-pro-max` | NextLevelBuilder, MIT | P1 | UI/UX research and review | Use the retained local data and scripts | Project requirements and HotPesa motion rules take precedence |
| `ponytail-review` | Dietrich Gebert, MIT | P2 | Diff complexity review | Report simplification opportunities only | Does not replace correctness or security review |
| `ponytail-audit` | Dietrich Gebert, MIT | P2 | Repository complexity audit | Report simplification opportunities only | Does not apply changes |

Only these seven skill directories are active. Ruflo, Taste, Graphify, GSAP, the full
Impeccable repository and other downloaded skill repositories are not part of the
approved Phase 0 toolset.

## Deferred skill candidates

- Accessibility audit: add after components and test tooling exist.
- Threat modeling: add when initial data-flow diagrams and trust boundaries stabilize.
- API contract governance: add when the first OpenAPI/event schemas are committed.
- Kenyan localization/content: add after approved English/Swahili terminology research.
- Infrastructure deployment: add after the AWS account model and environments are approved.

The deferred items should be built from real project evidence, not generic prompt packs.
