# ADR reconciliation plan

Status: **Proposed repository governance plan — no renumbering applied**

Owner: Architecture Review Board with Product and Engineering

## Problem

Document 11 is the dedicated architecture decision register and defines ADR-001 through
ADR-018. TRD Document 05 section 26 independently uses ADR-001 through ADR-012 for a
different set of technical decisions. The numeric identifiers therefore collide across
controlled sources. Neither controlled DOCX is changed by this plan.

## Proposed canonical namespace

Use a repository-wide `HP-ADR-NNN` identifier for the canonical decision record and keep
the source identity as immutable metadata. Use `HP-TRD-ADR-NNN` for a distinct TRD source
record where Document 05 contains a decision that is not the same underlying decision as
a Document 11 record. A source record may declare `canonical_equivalent` when the two
documents describe the same underlying choice; that link does not merge or rewrite the
source wording or status.

| Canonical identifier range | Source | Original identifiers | Treatment |
| --- | --- | --- | --- |
| `HP-ADR-001`–`HP-ADR-018` | Document 11 ADR register | ADR-001–ADR-018 | Canonical repository records; preserve Document 11 status verbatim. |
| `HP-TRD-ADR-001`–`HP-TRD-ADR-012` | Document 05 TRD section 26 | ADR-001–ADR-012 | Unique TRD source records; preserve TRD status verbatim and link an equivalent Document 11 record only where Architecture Review Board confirms equivalence. |

### Provisional equivalence candidates for review

These are mapping hypotheses, not decisions. They must be confirmed by the Architecture
Review Board before any alias or canonical-equivalence metadata is applied:

| Document 05 source | Candidate Document 11 record | Reason for review |
| --- | --- | --- |
| TRD ADR-001, pnpm TypeScript monorepo | Document 11 ADR-013 | Same apparent repository-architecture subject. |
| TRD ADR-002, modular monolith API plus worker | Document 11 ADR-006 | Same apparent backend-structure subject, with worker scope to confirm. |
| TRD ADR-003, PostgreSQL source of truth | Document 11 ADR-007 | Same apparent persistence subject. |
| TRD ADR-005, React/TypeScript/Vite | Document 11 ADR-014 | Same apparent frontend-technology subject. |
| TRD ADR-007, provider port with Mock and Daraja adapters | Document 11 ADR-016 and/or ADR-004 | Provider-boundary scope must be separated from credential/callback custody. |
| TRD ADR-008, managed OIDC and application authorization | Document 11 ADR-017 | Same apparent workforce-identity subject. |
| TRD ADR-009, OCI containers and managed runtime/data services | Document 11 ADR-018 | Same apparent deployment subject. |

The remaining TRD records—ADR-004, ADR-006, ADR-010, ADR-011 and ADR-012—must remain
distinct `HP-TRD-ADR-*` records unless the Architecture Review Board identifies an exact
equivalent. No status is inferred from a candidate match.

## Required synchronization after approval

Once the controlled decision is approved, synchronize the following in one controlled
change set:

- `docs/adr/ADR-*.md` filenames, headings, front matter and cross-links;
- `docs/adr/README.md` register and lifecycle rules;
- this plan, replacing provisional mappings with approved canonical/equivalence metadata;
- `docs/requirements/MASTER_TRACEABILITY_MATRIX.md` ADR columns;
- `docs/phase-0/PHASE_0_CHECKLIST.md`, `docs/progress/BUILD_STATE.md` and
  `docs/progress/REQUIREMENTS_TRACE.md` references;
- all `ADR-*` references found by `rg -n "ADR-[0-9]{3}"` in source, tests, scripts,
  runbooks and CI documentation;
- synchronized Markdown copies of Documents 05 and 11 only after their controlled DOCX
  sources receive the approved reconciliation update;
- `DOCUMENT_REGISTER.md` checksums and synchronization dates if a controlled DOCX changes;
- any CI/documentation verification expectations and ADR-specific tests.

## Stop rule

Do not rename repository ADRs, add aliases, change statuses, or edit controlled
specifications until the Architecture Review Board records the mapping and authority for
each collision. The current repository remains consistent by treating Document 11 as the
dedicated register and recording the conflict explicitly.
