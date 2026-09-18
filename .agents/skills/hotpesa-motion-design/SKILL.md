---
name: hotpesa-motion-design
description: Design, implement, or review motion and state feedback in HotPesa Android, passenger PWA, and admin interfaces. Use for transitions, loading, pending, success, error, offline, reconnect, reduced-motion, or animation performance work; not for general layout or visual branding alone.
license: MIT-derived; see THIRD_PARTY_NOTICES.md
---

# HotPesa motion design

Treat motion as functional feedback in a trust-critical fare application. First identify
the authoritative application/payment state, the user task and the operating environment.
Never let animation imply a financial fact that the backend has not confirmed.

## Default identity

Use a restrained **Corporate** personality: quick 120 ms, standard 200 ms, slow 300 ms;
signature easing `cubic-bezier(0.2, 0, 0, 1)`. Entrances decelerate and exits accelerate.
Prefer transform and opacity. Avoid bounce in payment, fare, warning and error states.

## State rules

- Tap acknowledgement begins within 100 ms, independently of the network result.
- Pending uses neutral progress plus explicit text; it never turns green automatically.
- Confirmed success requires trusted server-side confirmation and durable event evidence.
- Failure uses text, icon and color; motion is subtle and never repeats indefinitely.
- Offline/reconnecting states state what is known, unknown and safe to do next.
- Local hotspot connectivity is not proof of M-Pesa or internet connectivity.

## Platform adaptation

- Android host: minimal motion, one-handed field use, sunlight legibility, no decorative
  sequences during boarding, and graceful behavior on entry-level devices.
- Passenger PWA: CSS transform/opacity first; no mandatory animation library for Phase 0.
- Admin: modest list and state transitions; never animate dense operational data in a way
  that delays scanning or hides audit changes.

Always provide `prefers-reduced-motion`/platform reduced-motion behavior. Critical status
must also be available as text and accessible semantics. Test rapid repeat use, background
and resume, network transitions, stale state, and reduced motion.

For detailed tokens and patterns, read `references/HOTPESA_MOTION_TOKENS.md`. For payment
truth and forbidden cues, read `references/PAYMENT_STATE_MOTION.md`.
