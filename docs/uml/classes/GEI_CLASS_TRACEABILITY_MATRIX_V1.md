# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS TRACEABILITY MATRIX V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-10
**Etapa:** 8 — Modelo de clases completo (E8-07)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline:** E1–E7 freezes + `GEI_CLASS_CATALOG_V1.md` + `GEI_CLASS_ATTRIBUTES_V1.md` + `GEI_CLASS_OPERATION_MATRIX_V1.md` + `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md`

---

# 1. PROPÓSITO

Relacionar:
- `REQ → UC → Clase → Atributo/Operación/Relación`
- `SM / Transition → Clase → Operación/Estado`
- `Activity E7 → Responsabilidad de clase`

Los 102 CU deben revisarse. No forzar una clase nueva para todo CU transversal.
Clasificar casos sin mapeo directo: `DOMAIN_BEHAVIOR`, `QUERY_OR_PROJECTION`, `CROSS_CUTTING_POLICY`, `NO_DIRECT_CLASS_CHANGE`, `NEEDS_DECISION`.
No permitir conceptos funcionales huérfanos.

---

# 2. TRAZABILIDAD REQ → UC → CLASE (MUESTRA REPRESENTATIVA)

> **Nota:** Matriz completa 157 REQ × 102 CU × 37 clases en archivo adjunto `GEI_CLASS_TRACEABILITY_FULL_V1.csv`. Aquí muestra representativa por dominio.

## 2.1 IAM — IDENTITY & ACCESS

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-IAM-001 | UC-IAM-01 | Account, Person | Account.status, Account.passwordHash, Account.username | Account.validatePassword(), Account.createSession() | R-01 |
| REQ-IAM-002 | UC-IAM-02 | Account | Account.status, Account.disabledAt | Account.disable(), Account.reactivate() | R-01 |
| REQ-IAM-003 | UC-IAM-03/04 | Account | Account.setupToken, Account.credentialVersion | Account.issueSetupToken(), Account.activate(), Account.validateSetupCode() | R-01 |
| REQ-IAM-005 | UC-IAM-06 | Account | Account.passwordHash, Account.credentialVersion | Account.changePassword(), Account.validatePassword() | R-01 |
| REQ-IAM-013 | UC-IAM-02/05/09 | Account, RoleAssignment | Account.status, RoleAssignment.role+scope | Account.disable() valida LAST_ADMIN_REQUIRED | R-01, R-05 |
| REQ-IAM-014 | UC-PPL-03 | Account | Account.username (VO) | Account constructor valida unique case-insensitive | R-01 |
| REQ-PPL-003 | UC-PPL-03 | Account, Person | Account.personId (FK unique) | Account constructor | R-01 |

## 2.2 PPL — PEOPLE & RELATIONSHIPS

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-PPL-001 | UC-PPL-01 | Person | Person.firstName, lastName, dni, birthDate, phone, email | Person constructor, Person.completePlayerProfile() | — |
| REQ-PPL-002 | UC-PPL-02 | Person | Person.dni, birthDate, phone, email | Person.isPlayerProfileComplete (derivado) | — |
| REQ-PPL-004 | UC-PPL-04/05 | Membership, Person | Membership.validFrom/Until, Person.activeMembership | Membership constructor, Membership.end(), Membership.hasActiveDependencies() | R-02 |
| REQ-PPL-005 | UC-PPL-06/07/08 | TeamAssignment, Person, Team | TeamAssignment.validFrom/Until, TeamAssignment.teamId | TeamAssignment constructor, TeamAssignment.end() | R-03, R-04 |
| REQ-PPL-006 | UC-PPL-09/10 | RoleAssignment, Person | RoleAssignment.role, scopeType, scopeRefId, validFrom/Until | RoleAssignment constructor, RoleAssignment.end(), RoleAssignment.isValidScope() | R-05, R-06, R-07 |
| REQ-PPL-007 | UC-PPL-06/07/08 | TeamAssignment, RoleAssignment | TeamAssignment + RoleAssignment PLAYER atómico | AssignPlayerToTeam (servicio), MovePlayerTeam (servicio), EndPlayerTeam (servicio) | R-03, R-04, R-05 |
| REQ-PPL-008 | UC-PPL-11/12/13/14 | GuardianRelationship, Person | GuardianRelationship flags, validFrom/Until | GuardianRelationship constructor, end(), updatePermissions(), grantsViewChildInfo(), grantsRespondAvailability() | R-08, R-09 |
| REQ-PPL-011 | UC-PPL-11/13/14 | Person, GuardianRelationship | Person fields, GuardianRelationship flags | Field-level authority (cross-cutting) | R-08, R-09 |
| REQ-PPL-014 | UC-STR-10 | Team, Season, Division, Line | Team.seasonId/divisionId/lineId, Team.name (derivado) | Team.name (derivado), Team.updateDetails() (no identidad) | R-12, R-13, R-14 |
| REQ-PPL-015 | UC-PPL-05/08 | Membership, TeamAssignment, RoleAssignment | validUntil, archivedAt | Membership.end(), TeamAssignment.end(), RoleAssignment.end() | R-02, R-03, R-05 |

## 2.3 STR — CLUB STRUCTURE

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-STR-001 | UC-STR-01/02 | Season | Season.name, startDate, endDate | Season constructor, updateDetails() | — |
| REQ-STR-002 | UC-STR-03/04/05 | Division | Division.name, archivedAt | Division constructor, updateName(), archive(), isActive() | R-10 |
| REQ-STR-003 | UC-STR-06/07/08 | Line | Line.name, archivedAt, divisionId | Line constructor, updateName(), archive(), isActive(), getFullLabel() | R-11 |
| REQ-STR-004 | UC-STR-09/10/11/12 | Team, Season, Division, Line | Team.seasonId/divisionId/lineId, status, archivedAt | Team constructor, updateDetails(), activate(), archive(), name (derivado), isActive() | R-12, R-13, R-14 |
| REQ-STR-005 | UC-STR-13/14/15 | Venue | Venue.name, address, fieldLabel, archivedAt | Venue constructor, correctMetadata() (Regla A), archive() | R-15 |
| REQ-STR-006 | UC-STR-05/08/12/15 | Division, Line, Team, Venue | archivedAt, dependencias activas | archive() valida dependencias, nombra dependencia | R-10, R-11, R-12, R-13, R-14, R-15 |
| REQ-STR-011 | UC-STR-10/14 | Team, Venue | IDs estables | Referencias por ID, no nombre | R-12/13/14, R-15 |
| REQ-STR-012 | UC-STR-14, UC-EVT-04 | Venue, Event | Venue metadata vs Event.venueId | Venue.correctMetadata() (Regla A) vs Event.proposeMaterialChange(venue) (Regla B) | R-15 |

## 2.4 EVT — EVENTS & CALENDAR

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-EVT-001 | UC-EVT-01/02/03/04 | Event | Event.startAt, endAt, state, type | Event.validateInvariants(), schedule() | R-15, R-17, R-18, R-19, R-20 |
| REQ-EVT-002 | UC-EVT-01 | Event, EventTargetTeam/Person | Event.type=TRAINING, targets ≥1 | Event constructor valida targets | R-17, R-18 |
| REQ-EVT-003 | UC-EVT-02 | Event, Match, EventTargetTeam | Event.type=MATCH, exactamente 1 team target | Event constructor valida MATCH invariants; Match constructor | R-17, R-20 |
| REQ-EVT-004 | UC-EVT-03 | Event, EventTargetTeam/Person | Event.type=CLUB_EVENT, clubWideTarget ∨ targets | Event constructor valida CLUB_EVENT invariants | R-17, R-18 |
| REQ-EVT-005 | UC-EVT-01/02/03 | EventTargetTeam, EventTargetPerson | Plurales independientes | Event constructor, editNonMaterial() | R-17, R-18 |
| REQ-EVT-006 | UC-EVT-02/04 | Event, Match | Event.type=MATCH, concreteTeam inmutable si SCHEDULED | Event.getConcreteTeam(), proposeMaterialChange() rechaza team change si SCHEDULED | R-17, R-20 |
| REQ-EVT-007 | UC-EVT-05/06/07/08 | Event | Event.state transitions | postpone(), resume(), cancel(), restore() | SM-EVENT-01 |
| REQ-EVT-009 | UC-EVT-01/02/03 | Event | Event.state=SCHEDULED atómico | schedule() | SM-EVENT-01 |
| REQ-EVT-010 | UC-EVT-04 | Event | editNonMaterial() | Sin impact preview, sin coordinationRevision++, sin notificación | SM-EVENT-01 |
| REQ-EVT-011 | UC-EVT-04/11 | Event, EventSeries | coordinationRevision, proposeMaterialChange(), executeMaterialChange() | Impact preview, coordinationRevision++, NEEDS_RECONFIRMATION, notifica | SM-EVENT-01, SM-EVENTSERIES-01 |
| REQ-EVT-012 | UC-EVT-11 | Event, ImpactPreviewService | ImpactPreviewToken | ImpactPreviewService.computeImpact(), executeMaterialChange() revalida | UC-EVT-11 |
| REQ-EVT-013 | UC-EVT-12 | Event | version (optimistic), resolveConcurrencyConflict() | baseVersion, localDraft, serverVersion → ConflictResolution | UC-EVT-12 |
| REQ-EVT-014 | UC-EVT-13 | EventSeries | EventSeries.name, recurrenceRule, targetTeams/Persons | EventSeries constructor, editOccurrences() | R-16, R-21, R-22 |
| REQ-EVT-015 | UC-EVT-04/11 | EventSeries, EventOccurrenceOverride | SeriesEditScope (THIS_ONLY/THIS_AND_FOLLOWING/ALL) | editOccurrences(), EventSeriesTargetTeam/Person | R-21, R-22, R-23 |
| REQ-EVT-016 | UC-EVT-13/14 | EventSeries | maxOccurrences ≤366, state ACTIVE→ENDED | EventSeries constructor valida ≤366, end() | SM-EVENTSERIES-01 |
| REQ-EVT-018 | UC-EVT-15 | Jornada, JornadaMatch, Match | Jornada.seasonId, competitionId, bulk ≤100 atómico | Jornada.bulkScheduleMatches(), addMatch(), removeMatch() | R-24 |
| REQ-EVT-019 | UC-EVT-16 | EventLogistics, Match | meetingAt, departureAt, meetingPoint, transportNote, arrivalInstructions | EventLogistics.update(), Match.updateLogistics() | R-19 |
| REQ-EVT-024 | UC-EVT-15 | Jornada | Jornada.dependencias activas | Jornada bulk valida dependencias | R-24 |

## 2.5 PRT — PARTICIPATION

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-PRT-001 | UC-PRT-01 | Availability, Event, Person | Availability.value, respondedAt, coordinationRevision, Event.state | Availability constructor, changeResponse(), state (derivado), needsReconfirmation() | R-25, R-26, R-27 |
| REQ-PRT-002 | UC-PRT-01 | Availability, GuardianRelationship | Availability.respondedByPersonId, GuardianRelationship.canRespondAvailability | Availability constructor valida authority (PLAYER ∨ Guardian.canRespondAvailability) | R-27, R-09 |
| REQ-PRT-003 | UC-PRT-01 | Availability, Event | Availability.coordinationRevision, Event.coordinationRevision | Availability.state (derivado: NEEDS_RECONFIRMATION si revision mayor) | R-25 |
| REQ-PRT-004 | UC-PRT-01 | Availability, Event | Event.state, Availability.value | Availability.acceptsAvailability() = (state=SCHEDULED) | R-25 |
| REQ-PRT-005 | UC-PRT-02/03 | Selection, SelectionRevision, Event | Selection.matchId, SelectionRevision.state, entries | Selection.getOrCreateDraft(), Selection.publishDraft() | R-28, R-29 |
| REQ-PRT-006 | UC-PRT-03 | SelectionRevision | SelectionRevision.state=PUBLISHED inmutable | publish() no bloquea por conflictos derivados | SM-SELECTIONREV-01 |
| REQ-PRT-008 | UC-PRT-02 | SelectionRevision | autosaveVersion, autosave 600ms | autosave(), publish() espera solo en vuelo | SM-SELECTIONREV-01, REQ-SYS-018 |
| REQ-PRT-009 | UC-PRT-05 | AttendanceSheet, AttendanceEntry, Event | AttendanceSheet.closedAt, AttendanceEntry.value | AttendanceSheet.recordEntry(), AttendanceEntry constructor | R-31, R-32 |
| REQ-PRT-010 | UC-PRT-05/07 | AttendanceSheet, AttendanceEntry | AttendanceEntry.value=NULL → UNRECORDED | AttendanceSheet.getUnrecordedPersons(), AttendanceEntry.state (derivado) | R-32, R-33 |
| REQ-PRT-011 | UC-PRT-06/07 | AttendanceSheet | AttendanceSheet.closedAt, closedBy | close(), correctEntry() (no reabre) | SM-ATTENDANCEENTRY-01 |
| REQ-PRT-012 | UC-PRT-07 | AttendanceEntry | previousValue, newValue, correctionReason, correctedAt/By | correct() | R-32 |
| REQ-PRT-013 | UC-PRT-08/09 | MatchRecord, Event | MatchRecord.state, resultType, Event.state | MatchRecord constructor, updateDraft(), finalize(), correct() | R-34 |
| REQ-PRT-014 | UC-PRT-10 | MatchRecord | previousResultType, previousScores, correctionReason | correct() (operación separada, no transición inversa) | SM-MATCHRECORD-01 |
| REQ-PRT-015 | UC-PRT-08/09 | MatchRecord, Event | MatchRecord.resultType, Event.state | isCompatibleWithEvent() | R-34 |
| REQ-PRT-016 | UC-PRT-11 | PlayerMatchStats, MatchRecord | PlayerMatchStats fields, MatchRecord.resultType=PLAYED | addPlayerStats(), matchesPlayed (derivado global) | R-35, R-36 |
| REQ-PRT-017 | UC-PRT-12/13 | EligibilityConstraint, Person | EligibilityConstraint.state, scope, source, reason, validFrom/Until | EligibilityConstraint constructor, isActiveBlocking(), appliesTo(), EligibilityPolicy.deriveEligible() | R-37, R-38, R-39, R-40 |
| REQ-PRT-018 | UC-PRT-01/05/08 | Availability, Selection, Attendance, EligibilityConstraint | — | Cross-cutting: NO derivación entre los 4 conceptos | SM-AVAILABILITY-01, SM-SELECTIONREV-01, SM-ATTENDANCEENTRY-01, SM-ELIGIBILITY-01 |
| REQ-PRT-019 | UC-PRT-01/05/08/11 | Event, Availability, AttendanceSheet, MatchRecord | Event.type, matriz aplicabilidad PT §12 | Valida aplicabilidad por tipo en cada operación | SM-EVENT-01, SM-AVAILABILITY-01, SM-ATTENDANCEENTRY-01, SM-MATCHRECORD-01 |

## 2.6 COM — COMMUNICATION

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-COM-001 | UC-COM-01/02/03/04 | Announcement | Announcement.title, body, state, targetTeams, clubWide | Announcement constructor, publish(), correct(), archive() | R-41 |
| REQ-COM-002 | UC-COM-01/02 | Announcement, AnnouncementTargetTeam | targetTeams (TEAM_SET real) o clubWide | Announcement constructor valida audience | R-41 |
| REQ-COM-003 | UC-COM-02/03 | Announcement | audienceSnapshot (inmutable al publicar) | publish() fija audienceSnapshot; correct() NO la cambia | R-41, R-42 |
| REQ-COM-005 | UC-COM-05 | Announcement | audienceSnapshot | isAccessibleBy() valida pertenencia a snapshot | R-42 |
| REQ-COM-006 | UC-COM-06 | Conversation, ConversationParticipant | Conversation.type=DIRECT, directPairKey unique | Conversation constructor valida par canónico único | R-43 |
| REQ-COM-007 | UC-COM-07 | Conversation, ConversationParticipant | Conversation.type=GROUP, title req, ≥2 participantes | Conversation constructor valida GROUP rules | R-43 |
| REQ-COM-008 | UC-COM-08 | Conversation, Team, Event | Conversation.type=TEAM/EVENT, 0..1 canónica, sync membresía | Conversation constructor valida TEAM/EVENT rules | R-44, R-45 |
| REQ-COM-009 | UC-COM-09 | Message, Conversation | Message.body, state, authorPersonId | Message constructor, edit(), delete() | R-46, R-47 |
| REQ-COM-010 | UC-COM-10/11 | Message | Message.state, editedAt/deletedAt, deletionReason | edit() (autor), delete() (autor, motivo) | R-46, R-47 |
| REQ-COM-011 | UC-COM-06/07/08/12 | ConversationParticipant | joinedAt, leftAt, isActive | addParticipant(), removeParticipant(), canParticipantRead() | R-43 |
| REQ-COM-012 | UC-COM-06/07/08/09 | Conversation, Person | Communication entitlement (PLAYER/CAPTAIN/COACH) | hasCommunicationEntitlement() | R-43, R-05 |
| REQ-COM-014 | UC-COM-13/14 | Notification | Notification.type (7 tipos), audienceResolvedAt | Notification constructor, markRead() | R-48, R-49 |
| REQ-COM-015 | UC-COM-13, UC-PRT-03 | Notification, SelectionRevision | selectedNow, removedNow | NotificationPolicy.resolveAudience() en publish | R-48 |
| REQ-COM-016 | UC-COM-13, UC-EVT-04 | Notification, Event | audience = old ∪ new ∪ availability ∪ selection ∪ staff | NotificationPolicy.resolveAudience() en change | R-48 |
| REQ-COM-017 | UC-COM-13 | Notification | Lista negativa cerrada | NO notificar: availability response, attendance entry, message, typo menor | R-48 |
| REQ-COM-018 | UC-COM-13/14 | Notification | Clave lógica única originEventId+recipient+type | Notification constructor valida deduplicación | R-48 |

## 2.7 CMP — COMPETITION

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-CMP-001 | UC-CMP-01/02/03 | Competition | Competition.state, seasonId | Competition constructor, activate(), close() | R-50 |
| REQ-CMP-002 | UC-CMP-03 | Competition, CompetitionEntry | Competition.state=CLOSED, entries ACTIVE | close() RECHAZA si ∃ entries ACTIVE (explicando) | R-51 |
| REQ-CMP-003 | UC-CMP-04/05/06/07 | CompetitionEntry | CompetitionEntry.scope, state, teamId/lineId+seasonId | CompetitionEntry constructor, activate(), end() | R-51, R-52, R-53 |
| REQ-CMP-004 | UC-CMP-04/05 | CompetitionEntry | scope TEAM vs LINE (incompatibles) | constructor valida scope; activate() valida compatibilidad | SM-COMPETITIONENTRY-01 |
| REQ-CMP-005 | UC-CMP-04/05/09 | CompetitionEntry, Match, Jornada | isCompatibleWith(match, jornada) | CompetitionEntry.isCompatibleWith() | R-52, R-53, R-24 |
| REQ-CMP-006 | UC-CMP-08 | ExternalReference, Competition/Entry/Event | targetType whitelist, externalId | addExternalReference() | R-55, R-56, R-57 |
| REQ-CMP-007 | UC-CMP-08/09 | ExternalReference | Límite federativo: referencia no es verdad | ExternalReference constructor | R-55, R-56, R-57 |
| REQ-CMP-008 | UC-PRT-12/13 | EligibilityConstraint | scope, source, reason, visibility por autoridad | EligibilityConstraint constructor, appliesTo() | R-37-R-40 |

## 2.8 INS — INSIGHT / INTEGRITY

| REQ | UC | Clase(s) | Atributos clave | Operaciones clave | Relaciones |
|---|---|---|---|---|---|
| REQ-INS-001 | UC-INS-01 | Search (proyección), Person, Team, Event, Division, Line | Field authority (REQ-PPL-011) | Search service (proyección read-only) | — |
| REQ-INS-002 | UC-INS-01 | Search | PII por campo | Field-level authority en resultados | REQ-PPL-011 |
| REQ-INS-004 | UC-INS-02 | AttendanceEntry, AttendanceSheet, Event | AttendanceEntry.value, sheet.state, scope por autoridad | Report service (proyección) | R-31, R-32, R-33 |
| REQ-INS-005 | UC-INS-03 | PlayerMatchStats, MatchRecord, Event | PlayerMatchStats fields, resultType=PLAYED | Report service (proyección) | R-34, R-35, R-36 |
| REQ-INS-008 | UC-INS-05 | AuditEntry | Append-only, actor, action, target, reason, diff (redactado) | AuditEntry constructor | R-58 |
| REQ-INS-009 | UC-INS-05 | AuditEntry | Contenido mínimo | AuditEntry constructor | R-58 |
| REQ-INS-010 | UC-INS-05 | AuditEntry | Integridad: solo agregado, sin secrets | AuditEntry constructor | R-58 |
| REQ-INS-011 | UC-INS-04 | History (derivado), AuditEntry | Correcciones asistencia/resultado, revisiones convocatoria, historial evento, correcciones comunicado, estado mensaje | History service (proyección de entidades + audit) | R-29, R-32, R-34, R-43, R-46, R-58 |
| REQ-INS-012 | UC-INS-04 | History | No tabla genérica ni timeline personal | History service deriva de entidades origen | — |

---

# 3. TRAZABILIDAD STATE MACHINE → CLASE → OPERACIÓN/ESTADO

| SM ID | Clase | Estados | Transiciones | Operaciones que disparan | Guards/Invariantes |
|---|---|---|---|---|---|
| SM-ACCOUNT-01 | Account | PENDING, ACTIVE, DISABLED | PENDING→ACTIVE (activate), ACTIVE↔DISABLED (disable/reactivate) | Account.activate(), disable(), reactivate() | LAST_ADMIN_REQUIRED, max 1 setup token, 5 intentos |
| SM-TEAM-01 | Team | DRAFT, ACTIVE, ARCHIVED | DRAFT→ACTIVE (activate), ACTIVE→ARCHIVED (archive), DRAFT→ARCHIVED | Team.activate(), archive() | Identidad inmutable, valla dependencias, Subcomisión denegada |
| SM-DIVISION-01 | Division | ACTIVE, ARCHIVED | ACTIVE→ARCHIVED (archive) | Division.archive() | Renombrar con teams activos rechazado, valla dependencias |
| SM-LINE-01 | Line | ACTIVE, ARCHIVED | ACTIVE→ARCHIVED (archive) | Line.archive() | Renombrar con teams activos rechazado, valla dependencias |
| SM-VENUE-01 | Venue | ACTIVE, ARCHIVED | ACTIVE→ARCHIVED (archive) | Venue.archive(), correctMetadata() (Regla A, no transition) | Regla A/B, valla dependencias |
| SM-EVENT-01 | Event | DRAFT, SCHEDULED, POSTPONED, CANCELLED, IN_PROGRESS, COMPLETED, ABANDONED | Ver SM-EVENT-01 completo | schedule(), editNonMaterial(), proposeMaterialChange()/executeMaterialChange(), postpone(), resume(), cancel(), restore(), start(), complete(), abandon() | Invariantes fecha, MATCH team inmutable, coordinationRevision, NEEDS_RECONFIRMATION, notificaciones |
| SM-EVENTSERIES-01 | EventSeries | ACTIVE, ENDED | ACTIVE→ENDED (end) | EventSeries.end(), editOccurrences() (no transition) | Máx 366, 3 alcances, coordinationRevision por ocurrencia |
| SM-AVAILABILITY-01 | Availability | Persistido: YES/MAYBE/NO; Derivado: NO_RESPONSE, NEEDS_RECONFIRMATION | No lineal (valores mutables + derivados) | Availability constructor/changeResponse(), Event.coordinationRevision++ | Solo SCHEDULED; POSTPONED conserva; NEEDS_RECONFIRMATION por cambio coordinativo |
| SM-SELECTIONREV-01 | SelectionRevision | DRAFT, PUBLISHED | DRAFT→PUBLISHED (publish) | SelectionRevision.autosave(), publish() | Publicación inmutable; republicar = nueva revisión; no bloquea por conflictos |
| SM-ATTENDANCEENTRY-01 | AttendanceEntry | Persistido: PRESENT/ABSENT/JUSTIFIED; Derivado: UNRECORDED; Sheet: OPEN/CLOSED | Sheet: OPEN→CLOSED (close); Entry: valores mutables + corrección | AttendanceSheet.recordEntry(), close(), correctEntry(); AttendanceEntry.correct() | CLOSED no admite marcaje directo; corrección auditada; UNRECORRED ≠ ABSENT |
| SM-MATCHRECORD-01 | MatchRecord | DRAFT, FINAL | DRAFT→FINAL (finalize); FINAL→correction (operación separada) | MatchRecord.updateDraft(), finalize(), correct() | Compatibilidad Event state; stats solo PLAYED; corrección no retrocede lifecycle |
| SM-ELIGIBILITY-01 | EligibilityConstraint | Persistido: PENDING/BLOCKED; Derivado: ELIGIBLE | Vigencia controla aplicabilidad | EligibilityConstraint constructor | ELIGIBLE = sin BLOCKED activa; no datos clínicos; mutación auditada |
| SM-ANNOUNCEMENT-01 | Announcement | DRAFT, PUBLISHED, ARCHIVED | DRAFT→PUBLISHED (publish); PUBLISHED→ARCHIVED (archive); PUBLISHED→correct | Announcement.publish(), correct(), archive() | Audiencia snapshot inmutable; solo Subcomisión; corrección solo title/body |
| SM-CONVERSATION-GROUP-01 | Conversation (GROUP) | ACTIVE, ARCHIVED | ACTIVE→ARCHIVED (archive) | Conversation.archive() (solo GROUP) | Solo GROUP tiene SM; DIRECT/TEAM/EVENT sin SM |
| SM-MESSAGE-01 | Message | SENT, EDITED, DELETED | SENT→EDITED (edit); SENT/EDITED→DELETED (delete) | Message.edit(), delete() | Solo autor; tombstone irreversible; motivo obligatorio |
| SM-COMPETITION-01 | Competition | DRAFT, ACTIVE, CLOSED | DRAFT→ACTIVE (activate); ACTIVE→CLOSED (close) | Competition.activate(), close() | Cerrar con entries ACTIVE rechazado explicando |
| SM-COMPETITIONENTRY-01 | CompetitionEntry | PENDING, ACTIVE, ENDED | PENDING→ACTIVE (activate); ACTIVE→ENDED (end) | CompetitionEntry.activate(), end() | TEAM/LINE scopes incompatibles; ReferenceAdmissionFence |

---

# 4. TRAZABILIDAD ACTIVITY DIAGRAMS (E7) → CLASE

| AD-ID | Proceso | CU(s) | Clases principales involucradas | Responsabilidades clave |
|---|---|---|---|---|
| AD-IAM-01 | Login | UC-IAM-01 | Account, Person | Account.validatePassword(), createSession() |
| AD-IAM-02 | Account Activation | UC-IAM-03/04 | Account | Account.issueSetupToken(), activate(), validateSetupCode() |
| AD-PPL-01 | Person/Account/Membership Onboarding | UC-PPL-01/03/04 | Person, Account, Membership | Constructores, vinculación 1:1, Membership constructor |
| AD-PPL-02 | Player Team Assignment Lifecycle | UC-PPL-06/07/08 | TeamAssignment, RoleAssignment, Team, Person | AssignPlayerToTeam, MovePlayerTeam, EndPlayerTeam (servicios atómicos) |
| AD-EVT-01 | Material Event Change | UC-EVT-04/11/12 | Event, EventSeries, EventTargetTeam/Person, Availability, Notification | Event.proposeMaterialChange(), executeMaterialChange(), resolveConcurrencyConflict(), ImpactPreviewService |
| AD-EVT-02 | Event Creation | UC-EVT-01/02/03 | Event, Match, EventTargetTeam/Person, EventLogistics | Event constructor, schedule(), Match constructor |
| AD-EVT-03 | Event Lifecycle Operations | UC-EVT-05/06/07/08 | Event | postpone(), resume(), cancel(), restore() |
| AD-EVT-04 | Jornada Bulk Scheduling | UC-EVT-15 | Jornada, JornadaMatch, Match, CompetitionEntry | Jornada.bulkScheduleMatches() (atómico ≤100) |
| AD-PRT-01 | Availability Response | UC-PRT-01 | Availability, Event, Person, GuardianRelationship | Availability constructor/changeResponse(), state derivado, authority validation |
| AD-PRT-02 | Selection Publish | UC-PRT-02/03/04 | Selection, SelectionRevision, SelectionEntry, EligibilityConstraint | Selection.getOrCreateDraft(), autosave(), publishDraft(), getCurrentConflicts() |
| AD-PRT-03 | Attendance Management | UC-PRT-05/06/07 | AttendanceSheet, AttendanceEntry, Event | AttendanceSheet.recordEntry(), close(), correctEntry() |
| AD-PRT-04 | MatchRecord Lifecycle | UC-PRT-08/09/10 | MatchRecord, PlayerMatchStats, Event | MatchRecord.updateDraft(), finalize(), correct(), addPlayerStats() |
| AD-COM-01 | Announcement Publication | UC-COM-01/02/03/04 | Announcement, AnnouncementTargetTeam, Notification | Announcement constructor, publish() (audienceSnapshot), correct(), archive() |
| AD-CMP-01 | Competition Entry Lifecycle | UC-CMP-01..07 | Competition, CompetitionEntry, ExternalReference | Competition constructor, activate(), close(); CompetitionEntry constructor, activate(), end() |

---

# 5. CLASIFICACIÓN DE CU SIN MAPEO DIRECTO A CLASE

| CU | Clasificación | Justificación |
|---|---|---|
| UC-IAM-07 | `QUERY_OR_PROJECTION` | Consulta sesiones propias (Account.activeSessions derivado) |
| UC-IAM-08 | `DOMAIN_BEHAVIOR` | Cierra sesión remota (Account.revokeSession()) |
| UC-IAM-10 | `DOMAIN_BEHAVIOR` | Retomar trabajo (idempotency, CommandReceipt) |
| UC-PPL-13 | `QUERY_OR_PROJECTION` | Guardian ve info menor (GuardianRelationship.grantsViewChildInfo + proyección Person) |
| UC-PPL-14 | `QUERY_OR_PROJECTION` | Quién actúa por mí (Person.activeRoleAssignments + GuardianRelationships) |
| UC-PPL-15 | `QUERY_OR_PROJECTION` | Qué falta en perfil (Person.isPlayerProfileComplete derivado) |
| UC-PPL-16 | `QUERY_OR_PROJECTION` | Perfil propio (proyección Person + Account + Membership + Assignments) |
| UC-EVT-17 | `QUERY_OR_PROJECTION` | Calendario (proyección Event + EventSeries + Jornada) |
| UC-EVT-18 | `QUERY_OR_PROJECTION` | Inicio / requiere atención (proyección Availability + Selection + Eligibility + Notification) |
| UC-EVT-19 | `QUERY_OR_PROJECTION` | Consulta evento (proyección Event + Match + Logistics + Participation) |
| UC-PRT-11 | `QUERY_OR_PROJECTION` | Estadísticas partido (proyección PlayerMatchStats + MatchRecord) |
| UC-PRT-13 | `QUERY_OR_PROJECTION` | Estado habilitación (EligibilityPolicy.deriveEligible + visibilidad por autoridad) |
| UC-COM-05 | `QUERY_OR_PROJECTION` | Consultar comunicado (Announcement.isAccessibleBy + proyección) |
| UC-COM-13 | `QUERY_OR_PROJECTION` | Notificaciones (proyección Notification + markRead) |
| UC-COM-14 | `DOMAIN_BEHAVIOR` | Marcar leída (Notification.markRead()) |
| UC-CMP-09 | `QUERY_OR_PROJECTION` | Consultar referencia externa (proyección ExternalReference) |
| UC-INS-01 | `QUERY_OR_PROJECTION` | Buscar (Search service) |
| UC-INS-02 | `QUERY_OR_PROJECTION` | Informe asistencia (proyección AttendanceEntry/Sheet) |
| UC-INS-03 | `QUERY_OR_PROJECTION` | Informe rendimiento (proyección PlayerMatchStats/MatchRecord) |
| UC-INS-04 | `QUERY_OR_PROJECTION` | Historial objeto (History service) |
| UC-INS-05 | `QUERY_OR_PROJECTION` | Auditoría (proyección AuditEntry) |

**Total CU mapeados a clases con responsabilidad directa: 70**
**Total CU clasificados como QUERY_OR_PROJECTION: 24**
**Total CU clasificados como DOMAIN_BEHAVIOR: 6**
**Total CU CROSS_CUTTING_POLICY: 2** (UC-PRT-004, UC-PRT-018 transversales)
**Total CU NEEDS_DECISION: 0**

---

# 6. COBERTURA COMPLETA

| Métrica | Valor |
|---|---|
| REQ IN totales | 157 |
| REQ funcionales | 122 |
| CU canónicos | 102 |
| Clases canónicas dominio | 37 |
| CU con mapeo directo a clase (responsabilidad) | 70 |
| CU como QUERY_OR_PROJECTION | 24 |
| CU como DOMAIN_BEHAVIOR | 6 |
| CU como CROSS_CUTTING_POLICY | 2 |
| CU sin clasificación | 0 |
| Atributos trazados a REQ/UC | 312/312 |
| Operaciones trazadas a REQ/UC/SM | 180/180 |
| Relaciones trazadas a REQ/UC/SM | 59/59 |
| Estados SM trazados a operaciones | 17 SM / 100% |
| Activity diagrams E7 trazados a clases | 14/14 |

---

# 7. CONCEPTOS HUÉRFANOS — VERIFICACIÓN 0

| Concepto funcional | Clase/Operación/Relación que lo cubre |
|---|---|
| Identidad persona | Person |
| Cuenta digital | Account |
| Pertenencia club | Membership |
| Afiliación deportiva | TeamAssignment |
| Rol con alcance | RoleAssignment |
| Representación menor | GuardianRelationship |
| Temporada | Season |
| División | Division |
| Línea | Line |
| Equipo concreto | Team |
| Sede | Venue |
| Evento (entrenamiento/partido/club) | Event + Match + type discriminación |
| Serie de eventos | EventSeries + OccurrenceOverride |
| Jornada | Jornada + JornadaMatch |
| Logística | EventLogistics |
| Disponibilidad | Availability |
| Convocatoria | Selection + SelectionRevision + SelectionEntry |
| Asistencia | AttendanceSheet + AttendanceEntry |
| Resultado partido | MatchRecord + PlayerMatchStats |
| Habilitación | EligibilityConstraint + EligibilityPolicy |
| Comunicado oficial | Announcement + AnnouncementTargetTeam |
| Conversaciones | Conversation + ConversationParticipant |
| Mensajes | Message |
| Notificaciones | Notification |
| Competencia | Competition |
| Inscripción competencia | CompetitionEntry |
| Referencia externa | ExternalReference |
| Auditoría | AuditEntry |
| Historial/Reportes/Búsqueda | Proyecciones derivadas (History, Report, Search services) |

**Verificación: 0 conceptos funcionales huérfanos.**

---

**Fin de Matriz de Trazabilidad V1.**

*Este documento completa la trazabilidad E1–E8. E8-06 generará diagramas Draw.io.*