# HotPesa local hotspot physical test plan

This plan records evidence for the conductor-hotspot concept. It does not establish physical proof until executed on two real devices.

## Setup record

| Field | Evidence |
| --- | --- |
| Device A (conductor) model / Android version |  |
| Device B (passenger) model / Android version |  |
| Hotspot SSID / security mode |  |
| Conductor LAN address (observed, not assumed) |  |
| Passenger assigned address |  |
| API port |  |
| Passenger browser/PWA |  |
| Internet state |  |

## Scenarios

For each scenario record PASS, FAIL, BLOCKED or NOT TESTED and attach logs/screenshots where available.

1. Passenger connects to Device A hotspot — Result: ____ Evidence: ____
2. Passenger opens the locally advertised entry point — Result: ____ Evidence: ____
3. Active trip, route and ordered stages load — Result: ____ Evidence: ____
4. Valid destination returns a server-calculated fare — Result: ____ Evidence: ____
5. Payment initiation boundary behaves as designed — Result: ____ Evidence: ____
6. Trusted provider connectivity produces conductor confirmation — Result: ____ Evidence: ____
7. Passenger local experience works with Internet disabled — Result: ____ Evidence: ____
8. Passenger reconnects after temporary Wi-Fi loss — Result: ____ Evidence: ____
9. Closed or expired trip rejects stale access — Result: ____ Evidence: ____

The API's `HOST=0.0.0.0` setting is an explicit development-only binding option. No gateway address, mDNS, QR bootstrap, captive portal or discovery protocol is assumed or selected by this plan. Payment-provider Internet connectivity remains a separate dependency.
