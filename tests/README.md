# Test strategy

Use unit tests for state logic, contract tests for boundaries, integration tests for data
and queues, end-to-end proofs for hotspot/payment journeys, and manual evidence only where
automation cannot cover the behavior. Payment fixtures must include duplicate, delayed,
out-of-order, malformed, failed, expired and missing-callback cases.
