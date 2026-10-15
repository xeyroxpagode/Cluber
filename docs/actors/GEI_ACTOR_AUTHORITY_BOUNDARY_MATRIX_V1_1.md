# GEI Actor Authority Boundary Matrix V1.1

- Authority is the union of active RoleAssignment scopes and is evaluated server-side with default DENY.
- ADMIN has identity, account, structure and audit authority but is not a sports superuser.
- CAPTAIN and COACH remain distinct. SUBCOMMITTEE and COACH remain distinct.
- No Guardian source or CHILD scope exists. A Player answers only her own Availability.
- A Person may view and edit her own email under profile rules. Email remains field-level PII and is never globally visible.
- IAM-016 is the binding authorization formula and default DENY rule.
