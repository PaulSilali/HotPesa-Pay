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

1. Conductor starts an authorized trip and records the dynamically generated journey URL/code — Result: ____ Evidence: ____
2. Passenger connects to Device A hotspot and opens that generated local entry point — Result: ____ Evidence: ____
3. Active trip, route and ordered stages load — Result: ____ Evidence: ____
4. Valid destination returns a server-calculated fare — Result: ____ Evidence: ____
5. Payment initiation boundary behaves as designed — Result: ____ Evidence: ____
6. Trusted provider connectivity produces conductor confirmation — Result: ____ Evidence: ____
7. Passenger local experience works with Internet disabled — Result: ____ Evidence: ____
8. Passenger reconnects after temporary Wi-Fi loss — Result: ____ Evidence: ____
9. Conductor closes the trip; the passenger retries the generated URL and receives safe closed-session rejection — Result: ____ Evidence: ____

The API's `HOST=0.0.0.0` setting is an explicit development-only binding option. No gateway address, mDNS, QR bootstrap, captive portal or discovery protocol is assumed or selected by this plan. Payment-provider Internet connectivity remains a separate dependency.
