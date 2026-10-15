# GEI V1.1 Integral Documentary QA

- Requirements active: 138; duplicate IDs: 0; missing source: 0; missing acceptance criteria: 0.
- Actors: 7. Active use cases/specifications: 88/88.
- State machines: 14. Activity diagrams: 13. Canonical classes: 33.
- Active Guardian, Eligibility and CompetitionEntry: 0.
- IAM-016: authorization plus default DENY. SYS-016: technical idempotency.
- Person.email: single canonical email and login identifier. Account.email: absent. username: profile-only.
- TP8: 21/21 RF and 15/15 RNF.
- Implementation was not changed. Existing src/** references to removed V1.0.1 concepts are implementation gaps for a later implementation stage.

## Gate 11

FAIL overall. Documentary authorities and V1.1 source diagrams passed their mechanical checks, but the final publication gate cannot pass because no Draw.io export executable is available to regenerate and verify the affected PNG/PDF exports. The legacy use-case-spec validator also reports a pre-existing 452/454 acceptance-accounting mismatch, and the workbook validator cannot parse the current XLSX with its repository helper. These failures are recorded rather than concealed.
