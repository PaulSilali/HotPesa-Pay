# Payment-state motion

| State | Allowed cue | Forbidden cue |
|---|---|---|
| Initiating | immediate button acknowledgement, neutral progress | green/checkmark |
| Pending | calm spinner/progress, explicit pending copy | countdown promise, celebration |
| Confirmed | single restrained check transition after server confirmation | client-only success |
| Failed | brief non-looping emphasis plus recovery action | repeated shake or blame language |
| Expired | neutral transition and retry guidance | implying funds were taken |
| Review required | amber/static attention and reference ID | success/failure guess |
| Offline | static connectivity indicator and safe-next-step copy | payment-complete wording |

All terminal-state transitions must be driven by the canonical backend state. The UI may
optimistically acknowledge an interaction, but never a financial result.
