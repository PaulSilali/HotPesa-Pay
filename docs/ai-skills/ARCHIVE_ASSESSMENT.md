# Attached AI skill archive assessment

## Finding

The supplied RAR contains one skill package: **LottieFiles Motion Design Skill v1.0.0**,
licensed under MIT. It contains a main `SKILL.md`, eight motion-director references, four
interaction-pattern references, and four technical/quality references. No “UI/UX ProMax”
skill is present in the archive.

## What is strong

- Clear intent-first model: emotion, narrative and motion craft precede implementation.
- Useful timing/easing tables and patterns for entrances, state feedback and choreography.
- Explicit reduced-motion, vestibular-safety and performance advice.
- Framework independence: applicable to Compose, CSS, Web Animations, Framer Motion or
  Lottie without forcing one library.
- MIT terms permit adaptation and redistribution with the copyright notice retained.

## Gaps and risks for HotPesa

| Area | Archive guidance | HotPesa adjustment |
|---|---|---|
| Payment truth | Generic payment-success animation | Animate only after authoritative server confirmation; pending is never success |
| Trust | Playful/premium/corporate archetypes | Use restrained corporate motion; no confetti or bounce for money states |
| Offline | Not payment-domain specific | Offline/local state must show connectivity uncertainty and cannot imply settlement |
| Low-end devices | General mobile performance advice | Budget for entry-level Android, weak networks and battery constraints |
| Accessibility | Good reduced-motion baseline | Add text/icon redundancy, screen-reader announcements and WCAG checks |
| Cultural/field context | Generic | Optimize for bright outdoor use, crowded vehicles, one-handed operation and English/Swahili copy |
| Evidence | Visual checklist | Add deterministic UI tests and payment-state traceability |

## Adoption decision

Adopt the philosophy and selected reference values through the project-local
`hotpesa-motion-design` skill. Do not make the original package the sole UI/UX skill: it
does not cover research, information architecture, content design, forms, accessibility
testing or payment-domain correctness. Keep the original MIT notice in
`THIRD_PARTY_NOTICES.md`.

## Relevance ranking

1. **High:** context adaptation, state feedback, quality checklist, timing/easing and
   property selection.
2. **Medium:** entrance/exit and multi-element choreography, used mainly for admin/PWA.
3. **Low/conditional:** ambient motion, particles, dramatic reveals and Disney-style
   expressiveness; normally inappropriate in conductor and payment-critical flows.
4. **Reject for critical states:** decorative confetti, continuous ambience, large-scale
   parallax, or motion that delays acknowledgement or obscures payment status.
