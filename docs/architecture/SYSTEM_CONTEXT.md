# System context

```mermaid
flowchart TD
  Passenger[Passenger PWA] -->|fare request| API[HotPesa API]
  Conductor[Android Host] -->|journey and verification| API
  Admin[Operator Admin] -->|fares and operations| API
  API -->|payment request/status| MPesa[M-Pesa]
  API --> DB[(PostgreSQL)]
  API --> Redis[(Redis / Jobs)]
```

The local hotspot supports discovery and local session exchange; it is not a trusted
payment settlement channel. The API owns authoritative fare, journey, payment, and audit
state. M-Pesa callback processing must be authenticated where supported, idempotent,
durable, and reconciled.
