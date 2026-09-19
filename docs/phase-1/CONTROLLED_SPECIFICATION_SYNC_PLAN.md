# Controlled Specification Synchronization Plan

The project owner approved the Phase 1 decisions in
`PHASE_1_APPROVED_DECISIONS.md`. The repository’s `verify:docs` check binds each
`docs/specifications/NN_*.md` file to the SHA-256 checksum of its controlled DOCX source.
Therefore this pass does not edit those synchronized copies or their DOCX sources.

## Required controlled publication set

| Controlled source | Markdown counterpart | Required synchronized content |
| --- | --- | --- |
| Document 02 PRD | `docs/specifications/02_Product_Requirements_Document_PRD_HotPesa_Pay.md` | Workforce/tenant boundary, SACCO-owned fare governance, trip-start fare context, closure and summary scope. |
| Document 03 FRS | `docs/specifications/03_Functional_Requirements_Specification_FRS_HotPesa_Pay.md` | P1-DEC-001–009 rules for authorization, assignments, effective dates, fare approval, trip closure and summaries. Preserve existing requirement IDs and wording; add controlled revision/version entry. |
| Document 04 USUC | `docs/specifications/04_User_Stories_and_Use_Cases_USUC_HotPesa_Pay.md` | Conductor assignment/start/close acceptance details, fare creator/approver separation and unresolved-close reason. Preserve existing story IDs. |
| Document 05 TRD | `docs/specifications/05_Technical_Requirements_and_System_Architecture_TRD_HotPesa_Pay.md` | Provider-neutral OIDC boundary, application-owned authorization mapping, assignment and fare context implementation constraints. Record as a controlled revision, not an ADR renumbering. |
| Document 06 DMAC | `docs/specifications/06_Data_Model_and_API_Contract_DMAC_HotPesa_Pay.md` | Tenant/workforce mapping, assignment, trip, route/stage, fare-version snapshot and summary contract fields. |
| Document 09 SPNFR | `docs/specifications/09_Security_Privacy_and_NFR_Specification_SPNFR_HotPesa_Pay.md` | Authorization enforcement, device enrollment/revocation, audit and least-privilege consequences of the approved decisions. |
| Document 11 ADR register | `docs/specifications/11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md` | Reference ADR-017 as governing architecture; add the approved application/domain decisions only through the controlled ADR publication process. Do not resolve Document 05/11 numbering collision here. |

## Publication rules

1. The document owner must revise the controlled DOCX sources through the approved
   document-control process.
2. Regenerate synchronized Markdown copies and update `DOCUMENT_REGISTER.md` checksums,
   versions, statuses and synchronization dates.
3. Preserve every existing requirement identifier and approved wording; add the P1 decision
   references as controlled revision material.
4. Re-run `pnpm verify:docs` and review the controlled-document validation report.
5. Only after publication should the Phase 1 decisions be treated as durable controlled
   specification authority rather than repository implementation guidance.

No controlled publication was performed in this pass because the required DOCX revision
authority and approval workflow were not supplied.
