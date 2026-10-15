# GEI State Model Catalog V1.1

| ID | Entity | States | Status |
| --- | --- | --- | --- |
| SM-ACCOUNT-01 | Account | PENDING, ACTIVE, DISABLED | ACTIVE |
| SM-TEAM-01 | Team | DRAFT, ACTIVE, ARCHIVED | ACTIVE |
| SM-DIVISION-01 | Division | ACTIVE, ARCHIVED | ACTIVE |
| SM-LINE-01 | Line | ACTIVE, ARCHIVED | ACTIVE |
| SM-VENUE-01 | Venue | ACTIVE, ARCHIVED | ACTIVE |
| SM-EVENT-01 | Event | DRAFT, SCHEDULED, POSTPONED, CANCELLED, IN_PROGRESS, COMPLETED, ABANDONED | ACTIVE |
| SM-EVENTSERIES-01 | EventSeries | ACTIVE, ENDED | ACTIVE |
| SM-AVAILABILITY-01 | Availability | YES (persistido), MAYBE (persistido), NO (persistido), NO_RESPONSE (derivado), NEEDS_RECONFIRMATION (derivado) | ACTIVE |
| SM-SELECTIONREV-01 | SelectionRevision | DRAFT, PUBLISHED | ACTIVE |
| SM-ATTENDANCEENTRY-01 | AttendanceEntry | PRESENT (persistido), ABSENT (persistido), JUSTIFIED (persistido), UNRECORDED (derivado) | ACTIVE |
| SM-MATCHRECORD-01 | MatchRecord | DRAFT, FINAL | ACTIVE |
| SM-ANNOUNCEMENT-01 | Announcement | DRAFT, PUBLISHED, ARCHIVED | ACTIVE |
| SM-CONVERSATION-GROUP-01 | Conversation (tipo GROUP) | ACTIVE, ARCHIVED | ACTIVE |
| SM-MESSAGE-01 | Message | SENT, EDITED, DELETED | ACTIVE |

Archived from active V1.1: SM-ELIGIBILITY-01, SM-COMPETITIONENTRY-01 and SM-COMPETITION-01. Competition create/edit/archive are rules, not a DRAFT-ACTIVE-CLOSED lifecycle. Active total: 14.
