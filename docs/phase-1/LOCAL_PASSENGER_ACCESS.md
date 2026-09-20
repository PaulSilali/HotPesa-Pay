# Local passenger access boundary

The existing passenger PWA accesses an opaque public journey code through `/journey/<code>` and retrieves the server-owned journey session. It does not authenticate as workforce and does not enumerate tenants, vehicles or trips. Route and fare data are returned by the API; the client submits a journey-session reference and never supplies an authoritative fare amount.

For trusted development LAN testing, run the API with `HOST=0.0.0.0` and an explicit `CORS_ORIGINS` list. The default remains loopback (`127.0.0.1`). This is local transport configuration only; it is not physical Android hotspot proof and does not provide offline payment processing.

## PC-hosted hotspot development topology

This intermediate proof uses a development PC as the HTTP service host. It must be recorded as **PC-hosted hotspot proof**, not Android-hosted HotPesa.

- API: `HOST=0.0.0.0`, `PORT=3000`.
- Passenger PWA: `VITE_HOST=0.0.0.0`, `VITE_API_URL=http://<observed-host>:3000`.
- CORS: `CORS_ORIGINS=http://<observed-host>:4173` (add only other explicit development origins needed for the test).
- PostgreSQL and Redis remain loopback-only Compose services and are never exposed to the hotspot.

After an authorized trip start returns its opaque `publicCode`, generate the passenger entry address without source edits:

```powershell
$env:HOTPESA_LOCAL_HOST = '192.0.2.10' # replace with the observed hotspot host address
pnpm local:journey-url journey_<opaque-public-code>
```

The helper is development-only and emits an HTTP URL. It does not create a QR image, select mDNS/DNS, create a captive portal, or establish production TLS. Those host and discovery choices remain decision and device-validation gates.

## Connectivity boundary

While the local PC network and API remain available, passenger journey resolution, destination selection and server-calculated fare quotes are local HotPesa operations. Provider communication remains external: no loss-of-internet test may label a payment confirmed, and payment initiation/status must show the existing safe failure or pending state when trusted provider connectivity is unavailable.
