# HotPesa controlled-document register

This register maps each controlled DOCX source to its synchronized Markdown copy. The
DOCX files remain authoritative. An approval state of **Not approved** preserves the
source document's review status and must not be interpreted as production authorization.

| Document number | DOCX filename | Markdown filename | Version | Status | Owner | Approval state | Source checksum (SHA-256) | Last synchronization date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | `01_Business Requirements Document (BRD)_HotPesa Pay.docx` | `01_Business_Requirements_Document_BRD_HotPesa_Pay.md` | 1.0 | Draft for stakeholder review and approval | Founder and Product Owner | Not approved | `bd933c4d4b303f0f16ffcfba5dbfde688e96b9f118eb9a66b068875e621bcd0d` | 2026-09-19 |
| 02 | `02_Product Requirements Document (PRD)_HotPesa Pay.docx` | `02_Product_Requirements_Document_PRD_HotPesa_Pay.md` | 1.0 | Draft for stakeholder review and approval | Product Owner, supported by Business Analysis, UX and Engineering | Not approved | `0475d53d16ec9518b26d138374471d39d2a169c90a17cdd3de4298ef38908329` | 2026-09-19 |
| 03 | `03_Functional Requirements Specification (FRS)_HotPesa Pay.docx` | `03_Functional_Requirements_Specification_FRS_HotPesa_Pay.md` | 1.0 | Draft for stakeholder review and approval | Product Owner, supported by Business Analysis, Engineering and Quality Assurance. | Not approved | `a0a1b01b921867ef243028bef9872b46cbae6470741b869fa4207de5e058e56b` | 2026-09-19 |
| 04 | `04_User Stories and Use Cases (USUC)_HotPesa Pay.docx` | `04_User_Stories_and_Use_Cases_USUC_HotPesa_Pay.md` | 1.0 | Draft for stakeholder review and approval | Product Owner, supported by Business Analysis, UX, Engineering and Quality Assurance. | Not approved | `1bf8add37e543049c7c81241381241e387bb57b4f029fcf37699daeb6ebb9d76` | 2026-09-19 |
| 05 | `05_Technical Requirements and System Architecture (TRD)_HotPesa Pay.docx` | `05_Technical_Requirements_and_System_Architecture_TRD_HotPesa_Pay.md` | 1.0 | Draft for architecture review and approval | Engineering Authority, supported by Product, Security, Data, DevOps and Quality Assurance. | Not approved | `d232cf4c35b148513ecfd1fdb2b2e37fc0996903b817024dbee92c82eeb1d533` | 2026-09-19 |
| 06 | `06_Data Model and API Contract (DMAC)_HotPesa Pay.docx` | `06_Data_Model_and_API_Contract_DMAC_HotPesa_Pay.md` | 1.0 | Detailed final draft for review and approval | Data and API Authority, supported by Engineering, Security, Product and Quality Assurance. | Not approved | `2a4c855a93041844d51f1a8924f7168916b630912e92b51eccab0438ee635e84` | 2026-09-19 |
| 07 | `07_Application Flow and Information Architecture (AFIA)_HotPesa Pay.docx` | `07_Application_Flow_and_Information_Architecture_AFIA_HotPesa_Pay.md` | 1.0 | Detailed final draft for review and approval | Product and Experience Architecture, supported by Engineering, Operations, Finance, Security and Privacy | Not approved | `79ab2ae13c386c1febf083d1a54a1d5d2fe0a35b57737f07dda5b2f7fb25b031` | 2026-09-19 |
| 08 | `08_UI-UX Design Specification (UIUX)_HotPesa Pay.docx` | `08_UI_UX_Design_Specification_UIUX_HotPesa_Pay.md` | 1.0 | Detailed final draft for review and approval | Product Design and Experience, supported by Product, Engineering, Operations, Security, Privacy and Quality Assurance | Not approved | `3f38dc63f53ed0844b6c4e1bc6c74061d5d686837e60bc3c64154baa09c2cb7b` | 2026-09-19 |
| 09 | `09_Security Privacy and NFR Specification (SPNFR)_HotPesa Pay.docx` | `09_Security_Privacy_and_NFR_Specification_SPNFR_HotPesa_Pay.md` | 1.0 | Detailed final draft for review and approval | Security and Privacy Authority, supported by Engineering, Product, Operations, Finance, Legal and QA | Not approved | `68f165819e8fe61cc868cb00ba68ab592404607cadffbb947c63ea90e7f97d5b` | 2026-09-19 |
| 10 | `10_Implementation Plan and Build Sequence (IPBS)_HotPesa Pay Detailed Final.docx` | `10_Implementation_Plan_and_Build_Sequence_IPBS_HotPesa_Pay_Detailed_Final.md` | 1.0 | Detailed final draft for review and approval | Product Owner, supported by Business Analysis and Engineering | Not approved | `cce33e42ea22263e9cec6d650d7c2b17d3e353049f8224cf6256b5f5843878c9` | 2026-09-19 |
| 11 | `11_Architecture Decision Record and Decision Log (ADR)_HotPesa Pay Detailed Final.docx` | `11_Architecture_Decision_Record_and_Decision_Log_ADR_HotPesa_Pay_Detailed_Final.md` | 1.0 | Detailed final draft for architecture review and approval | Product Owner, supported by Architecture and Engineering | Not approved | `d725c10b2f7d31f26b21a2cd91f6696aecbff69b35e120973bfc4c2e58229793` | 2026-09-19 |

Run `npm run verify:docs` (or `pnpm verify:docs` in the supported CI environment) to
recalculate source checksums and verify counterpart coverage and synchronization state.

## Reported content/status conflict

Document 05 TRD section 26 and Document 11 use ADR-001 through ADR-012 for different
decisions. Both controlled documents remain drafts for review/approval. Repository ADR
files follow Document 11 because it is the dedicated decision register, but the conflict
requires controlled resolution by the Architecture Review Board before approval. No
identifier or approval status has been silently selected.
