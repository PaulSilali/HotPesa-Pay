# Passenger PWA

Accountless TypeScript passenger flow optimized for weak networks and mobile browsers.
Phase 0 covers session entry, fare display, payment initiation and honest state feedback.

## Trusted LAN development

Both services bind to loopback by default. To test from another device on a trusted local
network, explicitly set `HOST=0.0.0.0` for the API and `VITE_HOST=0.0.0.0` for the PWA;
set `CORS_ORIGINS` to the exact PWA origin(s). Do not expose database, Redis, admin or
debug ports. This transport setup does not prove Android hotspot compatibility and does
not make external Mock M-Pesa connectivity locally available.
