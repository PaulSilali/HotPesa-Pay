# Phase 1 Authorization Matrix

This matrix incorporates the project owner’s nine approved Phase 1 decisions. The
authorization contract is approved for implementation, with controlled-specification
synchronization still required. `ALLOWED` is limited to the approved role boundary;
`DENIED` is explicit; `OPEN` remains only where the source and approval package do not
name a sufficiently precise role.

Roles are limited to controlled-source personas: Passenger, Conductor, Driver, SACCO
Operations, Fare Creator, Fare Approver, Finance Officer and Authorized Administrator.

| Operation | Passenger | Conductor | Driver | SACCO Operations | Fare Creator | Fare Approver | Finance Officer | Authorized Administrator |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Create route | DENIED | DENIED | DENIED | ALLOWED | DENIED | DENIED | DENIED | OPEN |
| Modify route | DENIED | DENIED | DENIED | ALLOWED | DENIED | DENIED | DENIED | OPEN |
| Publish route | DENIED | DENIED | DENIED | ALLOWED | DENIED | DENIED | DENIED | OPEN |
| Create fare | DENIED | DENIED | DENIED | ALLOWED | DENIED | DENIED | DENIED | OPEN |
| Approve fare | DENIED | DENIED | DENIED | DENIED | DENIED | ALLOWED | OPEN | OPEN |
| Publish/activate fare | DENIED | DENIED | DENIED | DENIED | DENIED | ALLOWED | DENIED | OPEN |
| Assign conductor | DENIED | DENIED | DENIED | ALLOWED | DENIED | DENIED | DENIED | OPEN |
| Start trip | DENIED | ALLOWED only when assigned and authorized | DENIED | OPEN override | DENIED | DENIED | DENIED | OPEN override |
| View active trip | OPEN for scoped public context | ALLOWED | OPEN for assigned duty | ALLOWED | OPEN | OPEN | ALLOWED for reporting scope | ALLOWED |
| Initiate passenger payment | ALLOWED for own journey action | DENIED as payer; view only | DENIED | DENIED | DENIED | DENIED | DENIED | DENIED |
| Confirm payment | DENIED | DENIED; observes trusted status | DENIED | DENIED | DENIED | DENIED | DENIED | DENIED; provider evidence only |
| Close trip | DENIED | ALLOWED as assigned conductor | DENIED | ALLOWED as override | DENIED | DENIED | OPEN | OPEN |
| Override trip closure | DENIED | DENIED unless separately assigned operations authority | DENIED | ALLOWED with reason/audit | DENIED | DENIED | OPEN | OPEN |
| View revenue summary | DENIED | ALLOWED for assigned trip safe view | DENIED | ALLOWED for tenant scope | DENIED | OPEN | ALLOWED for finance scope | OPEN |

The matrix does not select an identity provider, define claim names, or grant permissions
that the sources leave open. Every protected API must still enforce tenant, role, resource,
assignment, state and action policy server-side (`SEC-AUTHZ-001`).
