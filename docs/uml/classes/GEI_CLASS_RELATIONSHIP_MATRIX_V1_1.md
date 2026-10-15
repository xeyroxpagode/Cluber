# GEI Class Relationship Matrix V1.1

- Account 1:1 Person; authentication resolves Person.email to Account. Account.email is forbidden.
- Match 0..1 -> Competition through competitionId.
- Jornada 0..1 -> Competition through competitionId and groups JornadaMatch records under one Season.
- Selection conflicts are only NO_LONGER_EVENT_TARGET and NO_LONGER_TEAM_AFFILIATED.
- No active association references GuardianRelationship, EligibilityConstraint, CompetitionEntry or ExternalReference.
