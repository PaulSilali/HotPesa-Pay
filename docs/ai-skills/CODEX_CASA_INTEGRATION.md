# Codex + Casa integration guide

## Operating model

Casa is the project workspace and Codex is the implementation agent. The application
does not execute these skills at runtime. Skills guide Codex while it designs, writes,
reviews and tests code; production binaries contain only the resulting reviewed code and
assets.

Three layers keep the workflow controlled:

1. `AGENTS.md` supplies always-on project invariants and definition of done.
2. `.agents/skills/<name>/SKILL.md` supplies task-specific guidance loaded only when useful.
3. requirements, ADRs and contracts remain the authoritative engineering record.

## Load in Casa

1. Generate or open the `hotpesa-pay` folder as the workspace root.
2. Confirm Casa/Codex reads the root `AGENTS.md`.
3. Keep the approved project skills under `.agents/skills`, with `SKILL.md` directly in
   each named skill directory. Do not keep a second project-local skill tree.
4. Start a task by naming the relevant skill and exact requirement/ADR, for example:
   `Use $hotpesa-kenya-payments to implement the sandbox callback endpoint for PAY-...`.
5. Require Codex to show tests and traceability updates in each pull request.

## Recommended task sequence

1. `hotpesa-requirements-guardian`: identify scope, affected contracts and acceptance.
2. Domain skill (`hotpesa-kenya-payments` or `hotpesa-motion-design`): implement safely.
3. `hotpesa-quality-gates`: verify evidence before merge or release.

## UI/UX workflow

For each screen, define the user, environment, primary task, critical state model,
accessibility behavior and motion intent before generating code. Use shared tokens from
`packages/design-tokens`. Motion may clarify hierarchy and feedback, but it must never be
the only carrier of payment status. Every motion token needs a reduced-motion mapping.

## Prompt examples

- `Use $hotpesa-motion-design. Specify and implement the passenger pending-payment card.
  Corporate motion, low-end Android budget, reduced-motion alternative, no success cue.`
- `Use $hotpesa-kenya-payments. Implement an idempotent Daraja sandbox callback handler
  with duplicate and out-of-order tests; do not log full MSISDN or credentials.`
- `Use $hotpesa-requirements-guardian. Review this proposed story against the approved MVP
  and identify its requirement, ADR, privacy and test impacts before coding.`
- `Use $hotpesa-quality-gates. Assess Phase 0 evidence and report pass, conditional pass or
  fail without treating sandbox results as production authorization.`

## Security boundary

Do not paste live consumer secrets, passkeys, production callback data or passenger PII
into prompts. Use environment-variable names and sanitized fixtures. Human approval is
required for live payment enablement, production credentials, regulatory conclusions,
infrastructure deployment and external communications.
