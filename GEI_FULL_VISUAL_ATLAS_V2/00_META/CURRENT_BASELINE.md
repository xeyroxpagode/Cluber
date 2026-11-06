# CURRENT BASELINE

## Git State

- **Branch**: gei/v1.1-scope-reconciliation
- **HEAD SHA**: ebba0b8efde9c33da6f785b6b0411204b2fece42
- **Modified files** (PREEXISTING — DO NOT TOUCH):
  - docs/uml/classes/source-v1_1/CL-00__GEI_Domain_Overview.drawio
  - docs/uml/classes/source-v1_1/CL-CMP-01__Competition.drawio
  - docs/uml/classes/source-v1_1/CL-COM-01__Communication.drawio
  - docs/uml/classes/source-v1_1/CL-EVT-01__Events_Calendar.drawio
  - docs/uml/classes/source-v1_1/CL-IAM-01__Identity_Access.drawio
  - docs/uml/classes/source-v1_1/CL-INS-01__Insight_Integrity.drawio
  - docs/uml/classes/source-v1_1/CL-PPL-01__People_Relationships.drawio
  - docs/uml/classes/source-v1_1/CL-PRT-01__Participation.drawio
  - docs/uml/classes/source-v1_1/CL-STR-01__Club_Structure.drawio
  - docs/uml/use-cases/source-v1_1/UCD-00__GEI_Use_Case_Map.drawio
  - docs/uml/use-cases/source-v1_1/UCD-CMP-01__GEI_Competition_Lifecycle.drawio
  - docs/uml/use-cases/source-v1_1/UCD-COM-01__GEI_Announcements.drawio
  - docs/uml/use-cases/source-v1_1/UCD-COM-02__GEI_Conversations_Notifications.drawio
  - docs/uml/use-cases/source-v1_1/UCD-EVT-01__GEI_Event_Creation.drawio
  - docs/uml/use-cases/source-v1_1/UCD-EVT-02a__GEI_Event_Material_Change.drawio
  - docs/uml/use-cases/source-v1_1/UCD-EVT-02b__GEI_Event_State_Transitions.drawio
  - docs/uml/use-cases/source-v1_1/UCD-EVT-03__GEI_Event_Logistics_Queries.drawio
  - docs/uml/use-cases/source-v1_1/UCD-IAM-01__GEI_Identity_Access.drawio
  - docs/uml/use-cases/source-v1_1/UCD-INS-01__GEI_Search_Reports_Audit.drawio
  - docs/uml/use-cases/source-v1_1/UCD-PPL-01__GEI_Person_Profile_Membership.drawio
  - docs/uml/use-cases/source-v1_1/UCD-PPL-02__GEI_Team_Roles_Representation.drawio
  - docs/uml/use-cases/source-v1_1/UCD-PRT-01__GEI_Availability_Selection_Attendance.drawio
  - docs/uml/use-cases/source-v1_1/UCD-PRT-02__GEI_Match_Result_Selection.drawio
  - docs/uml/use-cases/source-v1_1/UCD-STR-01__GEI_Season_Division_Line.drawio
  - docs/uml/use-cases/source-v1_1/UCD-STR-02__GEI_Team_Venue.drawio

- **Untracked directories**:
  - GEI_CURRENT_UX_ATLAS.rar
  - GEI_CURRENT_UX_ATLAS/
  - docs/implementation-gap/
  - docs/target-ux/
  - entrega-academica-v1_1/
  - tools/

## Build Verification

- **Build**: ✓ PASS (2.73s)
- **Typecheck**: ✓ PASS
- **Tests**: ✓ PASS (92 tests across 4 test files)

## Product Overview

This is a React 19 + Vite + Tailwind CSS v4 application for GEI Hockey Management System. It uses a local mock store for all data and interactions (no backend). The application features:

### Roles (5)
- PLAYER
- CAPTAIN
- COACH
- SUBCOMMITTEE
- ADMIN

### Key Routes (38 destinations per router)
- `/login`, `/activate`, `/no-access` (public)
- `/home`, `/calendar`, `/teams`, `/communication`, `/more`, `/search`, `/notifications` (main nav)
- `/events/:id`, `/events/:id/edit`, `/events/new` (event detail, edit, create)
- `/events/:id/availability`, `/events/:id/selection`, `/events/:id/attendance`, `/events/:id/match-record`
- `/jornadas/:id`, `/jornadas/new`
- `/teams/:teamId`
- `/people/:personId`
- `/communication/conversations/:id`, `/communication/conversations/new`
- `/announcements/:id`, `/announcements/:id/edit`, `/communication/announcements/new`
- `/management`, `/management/people`, `/management/people/new`, `/management/people/:id`
- `/management/teams/:id`, `/management/structure`, `/management/competitions`, `/management/competitions/:id`
- `/reports`, `/reports/attendance`, `/reports/performance`
- `/more/profile`, `/audit`

### Event Lifecycle States
- DRAFT, SCHEDULED, POSTPONED, CANCELLED, IN_PROGRESS, COMPLETED, ABANDONED

### Event Types
- MATCH, TRAINING, CLUB_EVENT

### Availability Views
- YES, MAYBE, NO, NO_RESPONSE, NEEDS_RECONFIRMATION

### Attendance Values
- PRESENT, ABSENT, JUSTIFIED

### Selection States
- DRAFT, PUBLISHED (with revisions)

### Match Record States
- DRAFT, FINAL

### Announcement States
- DRAFT, PUBLISHED, ARCHIVED

### Account States
- PENDING, ACTIVE, DISABLED

### Structure Types
- SEASON, DIVISION, LINE, VENUE