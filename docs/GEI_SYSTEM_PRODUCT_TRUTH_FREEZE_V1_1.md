# GEI System Product Truth Freeze V1.1

**Authority:** ACTIVE  
**Date:** 2026-10-14  
**Historical predecessor:** GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md

This Product Truth incorporates the complete binding target in [GEI_SCOPE_RECONCILIATION_V1_1.md](GEI_SCOPE_RECONCILIATION_V1_1.md). Where V1.0.1 conflicts, V1.1 controls. Unmentioned V1.0.1 semantics remain unchanged.

## Product boundary

The active capability set, actor set, role separation, authentication model and removals are exactly those frozen by the scope reconciliation. Guardian, Eligibility and CompetitionEntry have no active V1.1 semantics. ExternalReference is deferred.

## Core invariants

1. Person.email is the single email authority and login identifier for a Person with Account.
2. Account has no email copy and resolves 1:1 to Person.
3. username remains profile identity only and never authenticates or recovers an account.
4. Authorization is server-side, role-and-scope based, unioned across active assignments, and default DENY.
5. CAPTAIN is not COACH; SUBCOMMITTEE is not COACH; ADMIN is not a sports superuser.
6. Each Player answers only her own Availability.
7. Selection keeps editable draft, immutable publication, new-revision republication, history, player consultation, autosave behavior and surviving conflicts NO_LONGER_EVENT_TARGET and NO_LONGER_TEAM_AFFILIATED.
8. Competition is simple create/edit/archive/consult context. Match.competitionId and Jornada.competitionId are optional direct references.
9. Jornada preserves season coherence and conceptual atomicity for bulk match grouping.
10. EventSeries retains occurrences and edit scopes for recurring training.
11. Field-level PII remains enforced; email is not globally visible.
12. Chrome, Edge and Firefox compatibility is an explicit V1.1 requirement.

## Technical-policy boundary

Implementation details are governed by docs/architecture/GEI_TECHNICAL_SECURITY_RULES_V1_1.md and are not product features attributed to Victoria.
