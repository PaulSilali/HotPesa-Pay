# GitHub repository governance actions

This is an owner-action checklist, not evidence that any setting is enabled. The current
repository owner must apply and verify these settings for `main`.

## Required `main` branch ruleset

Create an **active** ruleset targeting the `main` branch with:

- restrict deletion and force-pushes;
- require a pull request before merging;
- require at least one approving review;
- require approval from Code Owners for owned paths;
- dismiss stale approvals when new commits modify the pull request;
- require conversation resolution;
- require the `verify` CI job status check, with branches required to be up to date;
- require linear history if the team’s merge policy supports it;
- do not grant bypass to ordinary contributors.

The owner must use the actual repository users/teams in the rule configuration. Placeholder
handles currently present in `CODEOWNERS` are not proof of real teams.

## CODEOWNERS action

Replace every `@hotpesa/...` placeholder with verified GitHub usernames or teams, then
add a CODEOWNERS rule protecting `CODEOWNERS` itself. Confirm that each referenced team is
visible to the repository and has at least one responsible maintainer. Do not invent names
in the repository until the owner supplies them.

## Verification evidence to record

The owner should capture the active ruleset/branch-protection page and a successful hosted
CI run for the correction commit. Until those two artifacts exist, branch protection,
CODEOWNERS enforcement and hosted CI remain pending in Phase 0.
