# Master requirements baseline

This workspace operationalizes the approved HotPesa master traceability review. Import
the canonical report as a controlled reference before implementation and preserve its
requirement identifiers in tickets, pull requests, tests, and releases.

## Approved MVP

- One controlled Kenyan SACCO/operator pilot.
- Passenger PWA reached primarily by QR/short URL.
- Android conductor host for hotspot/session operation.
- M-Pesa sandbox proof in Phase 0; live integration only after formal approval.
- Operator administration, versioned fares, journeys, payment evidence, reconciliation,
  audit logging, and minimum operational reporting.

## Excluded from MVP

Wallet/stored value, custody, credit, cash handling, passenger biometrics, mandatory
passenger accounts, dynamic pricing, multi-operator clearing, iOS conductor app,
advertising, loyalty and broad analytics.

## External confirmations still required

CBK/legal classification, ODPC/privacy review, Safaricom production onboarding and API
terms, SACCO commercial approval, merchant settlement arrangements, retention periods,
and production incident contacts. These are release gates, not coding assumptions.
