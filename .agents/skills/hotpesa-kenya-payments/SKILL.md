---
name: hotpesa-kenya-payments
description: Design, implement, test, or review HotPesa M-Pesa sandbox payment initiation, callbacks, state machines, idempotency, reconciliation, redaction, and payment operations in the approved Kenyan MVP architecture.
---

# HotPesa Kenya payments

Work sandbox-first behind a provider adapter. Keep HotPesa non-custodial and settle funds
directly to the approved merchant account. Model initiation requests, provider references,
callbacks, state transitions and reconciliation as separate evidence-bearing events.

Require an idempotency key at the HotPesa boundary and enforce uniqueness server-side.
Callback processing must tolerate duplicates, retries, missing callbacks and out-of-order
delivery. Unknown or conflicting evidence moves to manual review; it never becomes success
by inference. Persist a redacted audit trail before acknowledging accepted callbacks.

Use explicit states: created, initiating, pending, confirmed, failed, expired,
review-required. Only the server may establish confirmed. Never log credentials, full
MSISDNs, tokens, passkeys or unnecessary raw personal data. Use sanitized fixtures.

Phase 0 may create sandbox code and local infrastructure only. Stop before live credentials,
production short codes, real-money tests, public callback deployment or claims of CBK,
ODPC, Safaricom or SACCO approval unless separately authorized and evidenced.
