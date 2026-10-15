# GEI Scope Reconciliation V1.1

**Status:** FROZEN  
**Date:** 2026-10-14  
**Supersedes as active authority:** V1.0.1, while preserving it as history.

## Binding target

- REMOVE Guardian: ACT-GUARDIAN, GuardianRelationship, delegated adult, CHILD scope and delegated Availability are OUT.
- REMOVE Eligibility: EligibilityConstraint and all derived eligibility states, sources, reasons and authority are OUT.
- SIMPLIFY Competition: create, edit, archive and consult only; no lifecycle state machine or CompetitionEntry.
- DEFER ExternalReference and REQ-CMP-006/007.
- KEEP Selection, EventSeries, Jornada, Season, Availability, Attendance, Match, MatchRecord, statistics, communication, search, reports, history and audit.
- Match and Jornada may reference Competition directly through optional competitionId.
- Player answers her own Availability through her own Account.
- Login uses Person.email plus password. Person.email is the only canonical email and is unique case-insensitively among authenticable accounts.
- username remains unique, case-insensitive and stable profile identity data; it is not a credential, login key or recovery identifier.
- Account remains 1:1 with Person. Account.email is forbidden.
- Email verification activates an account; email password recovery is self-service. Logout manages the current session.
- IAM-016 remains authorization plus default DENY. SYS-016 remains idempotency/integrity and moves to technical rules where appropriate.
- Exact cryptographic, cookie, CSRF, rate-limit, session lifetime, concurrency, bulk and debounce values are technical policy.
- Browser compatibility explicitly covers Chrome, Edge and Firefox.

## Authorized capability set

Person, Membership, Account, RoleAssignment, TeamAssignment; Season, Division, Line, Team, Venue; Training, Match, ClubEvent, Calendar, EventSeries and Jornada; Availability, Selection, Attendance, MatchRecord and PlayerMatchStats; Announcement, Conversation, Message and Notification; Search, Reports, History and Audit.

## Final actors and roles

Actors: ACT-UNAUTHENTICATED, ACT-AUTHENTICATED, ACT-PLAYER, ACT-CAPTAIN, ACT-COACH, ACT-SUBCOMMITTEE and ACT-ADMIN. Effective roles: PLAYER, CAPTAIN, COACH, SUBCOMMITTEE and ADMIN. ACT-AUTHENTICATED stays abstract.

## Gate 0

PASS. The delta contains only the decisions above; Guardian, Eligibility and CompetitionEntry are OUT; Competition is simple; Selection, EventSeries, Jornada and Season remain IN; email is login; username is profile-only; technical authentication rules are separate; RNF09 is preserved.
