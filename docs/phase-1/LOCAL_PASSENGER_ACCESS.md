# Local passenger access boundary

The existing passenger PWA accesses an opaque public journey code through `/journey/<code>` and retrieves the server-owned journey session. It does not authenticate as workforce and does not enumerate tenants, vehicles or trips. Route and fare data are returned by the API; the client submits a journey-session reference and never supplies an authoritative fare amount.

For trusted development LAN testing, run the API with `HOST=0.0.0.0` and an explicit `CORS_ORIGINS` list. The default remains loopback (`127.0.0.1`). This is local transport configuration only; it is not physical Android hotspot proof and does not provide offline payment processing.
