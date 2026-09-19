# Proposed Phase 1 Authorization Matrix

This matrix is deliberately conservative. `ALLOWED` appears only where the controlled
requirements explicitly assign the operation to the role. `DENIED` is explicit where the
requirements prohibit the role. `OPEN` means the source names the capability but does not
identify the exact role or approval boundary.

Roles are limited to controlled-source personas: Passenger, Conductor, Driver, SACCO
Operations, Fare Creator, Fare Approver, Finance Officer and Authorized Administrator.

| Operation | Passenger | Conductor | Driver | SACCO Operations | Fare Creator | Fare Approver | Finance Officer | Authorized Administrator |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Create route | DENIED | DENIED | DENIED | OPEN | DENIED | DENIED | DENIED | OPEN |
| Modify route | DENIED | DENIED | DENIED | OPEN | DENIED | DENIED | DENIED | OPEN |
| Publish route | DENIED | DENIED | DENIED | OPEN | DENIED | DENIED | DENIED | OPEN |
| Create fare | DENIED | DENIED | DENIED | OPEN | ALLOWED | DENIED | DENIED | OPEN |
| Approve fare | DENIED | DENIED | DENIED | OPEN | DENIED | ALLOWED | OPEN | OPEN |
| Publish/activate fare | DENIED | DENIED | DENIED | OPEN | DENIED | OPEN | DENIED | OPEN |
| Assign conductor | DENIED | DENIED | DENIED | OPEN | DENIED | DENIED | DENIED | OPEN |
| Start trip | DENIED | ALLOWED only when assigned and authorized | DENIED | OPEN override | DENIED | DENIED | DENIED | OPEN override |
| View active trip | OPEN for scoped public context | ALLOWED | OPEN for assigned duty | ALLOWED | OPEN | OPEN | ALLOWED for reporting scope | ALLOWED |
| Initiate passenger payment | ALLOWED for own journey action | DENIED as payer; view only | DENIED | DENIED | DENIED | DENIED | DENIED | DENIED |
| Confirm payment | DENIED | DENIED; observes trusted status | DENIED | DENIED | DENIED | DENIED | DENIED | DENIED; provider evidence only |
| Close trip | DENIED | ALLOWED as conductor use case, subject to authorization | DENIED | OPEN override | DENIED | DENIED | OPEN | OPEN override |
| Override trip closure | DENIED | OPEN only if separately authorized | DENIED | OPEN | DENIED | DENIED | OPEN | OPEN |
| View revenue summary | DENIED | OPEN for assigned trip safe view | DENIED | OPEN | DENIED | OPEN | ALLOWED for finance scope | OPEN |

The matrix does not select an identity provider, define claim names, or grant permissions
that the sources leave open. Every protected API must still enforce tenant, role, resource,
assignment, state and action policy server-side (`SEC-AUTHZ-001`).
