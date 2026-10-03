# GEI HOCKEY MANAGEMENT SYSTEM
## SYSTEM / PRODUCT TRUTH FREEZE v1.0.1

**Estado:** FROZEN  
**Propósito:** autoridad única del proyecto antes de Figma e implementación final.  
**Regla:** si una pantalla, flujo, endpoint, tabla o decisión contradice este documento, este documento manda hasta que exista una revisión explícita del freeze.

**Revisión:** v1.0.1 clarification — no behavior change. Supersedes v1.0 as the vigente authority. v1.0 remains intact as a historical document and is not modified by this revision. This document is self-sufficient: it contains the full vigente Freeze with the clarifications absorbed; reading v1.0 plus patches is not required.

---

# 0. Cómo usar este documento

Este archivo consolida el trabajo de definición realizado desde Product Truth hasta arquitectura técnica.

No es una lista de ideas. Es el contrato del sistema.

A partir de este freeze:

- Figma **no define producto**: representa visualmente lo ya definido.
- Frontend **no inventa reglas de negocio**.
- Backend **no introduce nuevos flujos** sin actualizar este freeze.
- Base de datos **no agrega entidades** porque resulten cómodas.
- Un endpoint nuevo debe corresponder a una intención real del producto.
- Un estado nuevo debe estar justificado por un lifecycle.
- Una pantalla nueva debe tener workflow, authority y data owner.
- Cualquier cambio que modifique estos contratos requiere reabrir explícitamente el freeze.

Estados usados:

- **FROZEN**: definición cerrada.
- **EVIDENCE PENDING**: diseño cerrado; sólo la implementación puede demostrar el requisito.
- **EXTERNAL**: depende además de operación, organización o cumplimiento legal fuera del código.
- **OUT**: fuera de V1.

---

# 1. Source Truth

## 1.1 Problema observado

La operación actual del hockey de GEI se apoya en grupos de WhatsApp, anotaciones manuales y planillas separadas. Esto provoca desorden, pérdida de información y dificultad para coordinar entrenamientos, partidos, asistencia, estadísticas y comunicaciones.

La intención del sistema es centralizar la gestión deportiva y operativa del club en una aplicación web.

## 1.2 Actores originales

- Jugadora
- Capitana
- Entrenador/a
- Subcomisión de hockey
- Administrador/a

Se incorpora además:

- Guardian / responsable, **como relación/delegación**, no como rol deportivo genérico.

## 1.3 Cobertura original

El sistema final cubre:

- personas/jugadoras;
- usuarios y roles;
- estructura deportiva;
- entrenamientos;
- partidos;
- asistencia;
- estadísticas;
- calendario;
- disponibilidad;
- comunicados;
- cancelaciones/reprogramaciones;
- notificaciones;
- mensajería;
- logística;
- reportes;
- búsqueda;
- historial;
- seguridad;
- auditoría;
- privacidad;
- backups;
- HTTPS;
- responsive;
- 100 usuarios concurrentes;
- tiempos comunes <=3 s;
- notificaciones <=1 minuto.

---

# 2. Source Deviation Register

Las siguientes correcciones son deliberadas y forman parte del análisis de requisitos.

| Fuente original | Product Truth final |
|---|---|
| “Categoría” como entidad central | La estructura técnica usa **Division + Line + Team** |
| Username asociado a categoría | Username único, estable e independiente del Team |
| “Eliminar jugadora” | Finalizar relaciones y preservar historia; privacidad se gestiona por proceso específico |
| Eliminar categoría | Archivar estructura; no destruir historia |
| Player requiere nombre, apellido, DNI, fecha nacimiento, teléfono y email | Esos datos son obligatorios al ingresar al roster; `Person` base puede tener datos opcionales |
| Coaches asociados a categoría | `RoleAssignment(COACH, TEAM/EVENT)` |
| Estadísticas “otros indicadores” dinámicos | V1 usa set fijo de estadísticas |
| Búsqueda por categoría | Búsqueda por Team / Division / Line |
| Notificar cualquier cambio | Sólo eventos de alto valor: cambios materiales, cancel/reprogram/restore, Selection publish, Announcement publish |
| Administrador como autoridad universal | ADMIN administra identidad/estructura/acceso; no obtiene poderes deportivos automáticamente |

---

# 3. Scope V1

## IN

### People / Access
- Person
- Membership
- Account
- Username
- Password
- RoleAssignment
- TeamAssignment
- GuardianRelationship
- activation/reset administrativo
- disable/reactivate account

### Club Structure
- Season
- Division
- Line
- Team
- Venue

### Competition
- Competition
- CompetitionEntry
- EligibilityConstraint
- ExternalReference manual

### Events
- Training
- Match
- ClubEvent
- EventSeries
- Jornada
- Event targets
- Logistics
- material changes
- cancel/postpone/reschedule/restore

### Participation
- Availability
- Selection
- Attendance
- corrections
- current conflicts

### Communication
- Announcements
- Direct conversation
- Group conversation
- Team conversation
- Event conversation
- Messages
- Notifications

### Match Record
- result
- observations
- fixed player stats
- corrections

### Insight / Integrity
- Home projections
- Calendar
- Search
- Attendance Reports
- Performance Reports
- History
- Audit

## BOUNDARY

- AHBA: referencia oficial/manual; GEI no reemplaza la verdad federativa.
- Eligibility médica: sólo status de aptitud/bloqueo, no historia clínica.
- Disciplina/federación: constraint/status, no expediente completo.
- Guardians: relación y delegación; no rol deportivo automático.
- Transport/logistics: información operativa, no reserva de vehículos.
- External documents: sólo status/referencia si alguna vez se necesita; no gestor documental V1.
- Contextual staff: por RoleAssignment, no modelo paralelo.

## OUT

- cuotas y contabilidad;
- gestión financiera;
- full federation/passes;
- árbitros/jueces;
- historia clínica;
- safeguarding/casos sensibles;
- voluntariado;
- reserva de flota;
- booking de canchas/venues;
- inventario;
- tácticas/drills;
- motor de estadísticas custom;
- scouting;
- integración automática AHBA;
- offline-first/sync;
- recruitment;
- OAuth/Google/Microsoft;
- MFA;
- passkeys;
- self-service “olvidé mi contraseña”;
- browser push;
- SMS/email notifications;
- Redis;
- WebSocket;
- microservicios.

---

# 4. Terminología canónica

## Division
Ejemplos: Primera, Quinta, Sexta.

## Line
Tira/línea deportiva, por ejemplo A/B/C/Proyección.

## Team
Entidad concreta de temporada:

`Season + Division + Line`

Ejemplo: `Sexta A 2026`.

## Competition
Competencia en la que GEI participa.

## CompetitionEntry
Inscripción de una Line o Team en una Competition.

Scopes permitidos:
- LINE
- TEAM

## Event
Raíz común para:
- TRAINING
- MATCH
- CLUB_EVENT

## Jornada
Agrupa Matches de una misma jornada operativa. No duplica el lifecycle de los Matches.

## Availability
Respuesta previa:
- YES
- MAYBE
- NO

Derivados:
- NO_RESPONSE
- NEEDS_RECONFIRMATION

## Selection
Convocatoria de un Match.

## Attendance
Presencia real:
- PRESENT
- ABSENT
- JUSTIFIED
- UNRECORDED derivado por ausencia de row

## Eligibility
Condición actual que puede permitir o bloquear participación. Nunca se infiere desde Availability.

---

# 5. Roles y authority

Roles:
- PLAYER
- CAPTAIN
- COACH
- SUBCOMMITTEE
- ADMIN

Guardian no es Role.

Fórmula de autorización:

`ROLE + ACTION + SCOPE + OBJECT STATE + FIELD AUTHORITY + SOURCE`

Default: **DENY**.

Frontend puede ocultar/deshabilitar acciones, pero no autoriza.

## Role scopes válidos

| Role | Scope válido |
|---|---|
| PLAYER | TEAM |
| CAPTAIN | TEAM |
| COACH | TEAM / EVENT |
| SUBCOMMITTEE | CLUB |
| ADMIN | CLUB |

Cualquier combinación distinta: `422 INVALID_ROLE_SCOPE`.

## Authority Matrix

| Acción | PLAYER | CAPTAIN | COACH | SUBCOMMITTEE | ADMIN |
|---|---:|---:|---:|---:|---:|
| editar propio contacto/password | ✓ | ✓ | ✓ | ✓ | ✓ |
| responder propia Availability | ✓ | ✓ | sólo si además PLAYER | sólo si además PLAYER | sólo si además PLAYER |
| responder por menor | delegación | delegación | delegación | delegación | delegación |
| crear/editar Training | — | — | Team/Event scope | oficial autorizado | — |
| crear Match | — | — | Team scope | Club scope | — |
| postpone/reschedule/cancel Match | — | — | Team scope | Club scope | — |
| Logistics | — | Team scope | Team/Event | Club scope | — |
| Selection | — | — | Team/Event | — | — |
| Attendance | — | — | Team/Event | — | — |
| MatchRecord/stats | — | — | Team/Event | — | — |
| Announcement oficial | — | — | — | Club | — |
| Direct/Group messages | ✓ | ✓ | ✓ | sólo con entitlement comunicacional | sólo con entitlement comunicacional |
| Attendance report | propio/autorizado | Team si corresponde | Team | Club | — |
| Performance report | propio/autorizado | Team si corresponde | Team | Club | — |
| Personas/cuentas/accesos | — | — | — | — | ✓ |
| Club structure | — | — | — | — | ✓ |
| Competitions/Entries | — | — | lectura | ✓ | ✓ |
| Eligibility mutation | — | — | lectura status | ✓ | ✓ |
| External refs | — | — | lectura | ✓ | ✓ |
| Audit | — | — | — | — | ✓ |

Reglas:
- ADMIN no es superusuario deportivo.
- SUBCOMMITTEE no equivale a Coach.
- CAPTAIN no hereda poder de Coach.
- Multi-role = unión de assignments vigentes.
- ADMIN no obtiene acceso automático a private conversations.

---

# 6. PII Field Authority

| Dato | Visibility |
|---|---|
| nombre/apellido | scopes operacionales autorizados |
| username | self + ADMIN |
| DNI | ADMIN |
| fecha nacimiento completa | ADMIN |
| teléfono/email | self, ADMIN, COACH/CAPTAIN del Team actual cuando exista necesidad operativa |
| Guardian relationship | guardian self + ADMIN; Coach sólo información operativa mínima |
| Eligibility status | COACH scope + SUBCOMMITTEE + ADMIN |
| Eligibility reason/source | SUBCOMMITTEE + ADMIN |
| Message body | Conversation participants dentro de su período autorizado |
| Audit sensitive data | ADMIN con redacción |

Nunca:
- ADMIN lee chats privados sólo por ser ADMIN.
- CAPTAIN ve DNI por pertenecer al Team.
- Guardian ve información de otros menores.

## Guardian PII (v1.0.1 clarification)

A Guardian sees, per associated minor and only as needed to fulfil the delegation:

- first/last name;
- Team;
- relevant Events;
- relevant Availability;
- necessary operational information.

Delegation does NOT grant:

- DNI;
- full birth date;
- administrative information;
- Eligibility reason/source;
- private conversations;
- Audit;
- administrative roles.

The minor's phone/email is NOT granted automatically by GuardianRelationship. A Guardian may view/modify their OWN contact data. Sharing a minor's contact with a Guardian, if the club ever needs it, requires a separate explicit authority (not part of V1).

---

# 7. Capabilities

C01 Identity & Access  
C02 Club Structure  
C03 People & Assignments  
C04 Authority & Scope  
C05 Competition Context  
C06 Eligibility  
C07 Event Operations  
C08 Match Day / Jornada  
C09 Participation Lifecycle  
C10 Change Management  
C11 Logistics  
C12 Communication & Notification  
C13 Match Record & Performance  
C14 History / Audit / Provenance  
C15 Search & Reporting  
C16 Operational Awareness

Home, Calendar, Team View, Search y Reports son proyecciones, no owners.

---

# 8. Ownership domains

## PEOPLE
Person, Account identity, Membership, TeamAssignment, RoleAssignment, GuardianRelationship.

## CLUB STRUCTURE
Season, Division, Line, Team, Venue.

## COMPETITION
Competition, CompetitionEntry, EligibilityConstraint, ExternalReference.

## EVENTS
Event, Match, EventSeries, Jornada, Logistics, Event targets.

## PARTICIPATION
Availability, Selection, Attendance.

## COMMUNICATION & COORDINATION
Announcement, Conversation, Message, Notification.

## MATCH RECORD
MatchRecord, PlayerMatchStats.

## INTEGRITY & INSIGHT
Audit, Search/read projections, Reports, History projections.

Auth infrastructure es transversal, no dominio deportivo.

---

# 9. Lifecycles

## Account
`PENDING -> ACTIVE <-> DISABLED`

## Membership / TeamAssignment / RoleAssignment / GuardianRelationship
Temporal: `[valid_from, valid_until)`

## Team
`DRAFT -> ACTIVE -> ARCHIVED`

## Competition
`DRAFT -> ACTIVE -> CLOSED`

## CompetitionEntry
`PENDING -> ACTIVE -> ENDED`

## Event

`DRAFT -> SCHEDULED`

Desde SCHEDULED:
- `SCHEDULED -> POSTPONED`
- `POSTPONED -> SCHEDULED`
- `SCHEDULED -> CANCELLED`
- `POSTPONED -> CANCELLED`
- `CANCELLED -> SCHEDULED` mediante Restore

Operational:
`SCHEDULED -> IN_PROGRESS -> COMPLETED`

Match:
`IN_PROGRESS -> ABANDONED`

COMPLETED no reabre. Correcciones no retroceden lifecycle.

## EventSeries
`ACTIVE -> ENDED`

Máximo por command: **366 occurrences**.

## Availability
Persistido: YES / MAYBE / NO.  
Derivado: NO_RESPONSE / NEEDS_RECONFIRMATION.

## Selection
Working draft revision + published immutable revisions.

## Attendance
Sheet OPEN/CLOSED derivado de `closed_at`.  
Entries PRESENT/ABSENT/JUSTIFIED.  
Sin row = UNRECORDED.

## Announcement
`DRAFT -> PUBLISHED -> ARCHIVED`

Published audience immutable.

## Conversation
`ACTIVE -> ARCHIVED`

## Message
`SENT -> EDITED -> DELETED`

Delete = tombstone.

## MatchRecord
`DRAFT -> FINAL`

FINAL sólo se corrige explícitamente.

---

# 10. Event invariants

Todos: si existen ambos, `end_at > start_at`.

SCHEDULED / IN_PROGRESS / COMPLETED requieren `start_at`.

POSTPONED puede no tener schedule actual.

MATCH:
- `club_wide_target=false`
- exactamente 1 `event_target_team`
- 0 `event_target_persons`
- exactamente 1 Match subtype row
- concrete Team inmutable una vez Scheduled

TRAINING antes de Scheduled:
- >=1 Team o Person target

CLUB_EVENT:
- club-wide o targeted

`club_wide_target=true`:
- 0 Team targets
- 0 Person targets

---

# 11. Material Event Change Policy

Material:
- start date/time
- end/duration
- Venue
- target Teams
- target Persons
- club-wide audience
- Match opponent
- CompetitionEntry
- meetingAt
- departureAt
- meetingPoint
- transportNote
- arrivalInstructions
- POSTPONE
- RESCHEDULE
- CANCEL
- RESTORE

Efectos:
- Impact Preview cuando corresponda
- `coordination_revision++`
- Availability puede derivar NEEDS_RECONFIRMATION
- Notification según política

Non-material:
- title/wording correction
- scheduleSource metadata
- ExternalReference metadata
- metadata administrativa no coordinativa

## Venue rename semantics (v1.0.1 clarification)

Two cases are distinct and must not be confused:

A) EDITING A VENUE'S IDENTITY/METADATA (e.g. "Cancha Auxiliar" -> "Cancha Auxiliar GEI").

This is an administrative correction of the Venue object. Venue identity is stable by ID.

It is NOT, by itself, a rescheduling of every Event referencing it. It does NOT generate:

- massive Impact Preview;
- NEEDS_RECONFIRMATION;
- Event coordination_revision++;
- rescheduling notification.

History/Audit may preserve the name used at the historical moment.

B) CHANGING THE VENUE ASSIGNED TO AN EVENT (Event: Venue A -> Venue B).

This IS a material change and keeps all effects already defined:

- Impact Preview;
- coordination revision;
- participation impact;
- corresponding Notification;
- reconfirmation when applicable.

Immutable una vez Scheduled:
- Event type
- Match concrete Team
- Season identity del contexto

---

# 12. Participation applicability

| Object | Event types |
|---|---|
| Availability | TRAINING / MATCH / CLUB_EVENT |
| Selection | MATCH |
| Attendance | TRAINING / MATCH |
| MatchRecord | MATCH |

Availability nueva sólo con Event SCHEDULED.

POSTPONED conserva respuestas previas, pero no recibe nueva confirmación hasta volver a schedule válido.

Selection publish exige SCHEDULED.

Attendance abre en SCHEDULED o IN_PROGRESS, puede cerrar después de COMPLETED y admite correcciones auditadas.

---

# 13. Eligibility

Canonical model (v1.0.1 clarification): `EligibilityConstraint[]`.

Each constraint carries at minimum:

- id
- personId
- state: PENDING | BLOCKED
- scope: CLUB | COMPETITION | ENTRY | EVENT
- scopeRefId when applicable
- source: INTERNAL | AHBA | OTHER
- reason: ADMIN | DISCIPLINE | FEDERATION | MEDICAL_CLEARANCE | OTHER
- optional note
- validFrom
- validUntil

A persisted simple enum on Person is NOT the model. Any per-person status shown is derived from applicable active constraints.

Persistido:
- PENDING
- BLOCKED

ELIGIBLE derivado: no applicable active constraint.

Scopes:
- CLUB
- COMPETITION
- ENTRY
- EVENT

Sources:
- INTERNAL
- AHBA
- OTHER

Reasons:
- ADMIN
- DISCIPLINE
- FEDERATION
- MEDICAL_CLEARANCE
- OTHER

No datos clínicos.

---

# 14. Selection current conflicts

Una Selection publicada no se reescribe retroactivamente.

Puede derivar `hasCurrentConflicts` con:
- ELIGIBILITY_BLOCKED
- ELIGIBILITY_PENDING
- NO_LONGER_EVENT_TARGET
- NO_LONGER_TEAM_AFFILIATED

Puede alimentar Home → Necesita tu atención.

---

# 15. MatchRecord compatibility

PLAYED/FORFEIT -> Event COMPLETED.  
ABANDONED -> Event ABANDONED.

PlayerMatchStats sólo representa participación real registrada en PLAYED.

`matches_played` es derivado.

Attendance != Match participation.

---

# 16. Jornada y Competition

## Jornada

- Match pertenece como máximo a una Jornada.
- Match Team.season = Jornada.season.
- Si Jornada.competition_id existe, Match usa CompetitionEntry de esa Competition.
- Bulk máximo 100 Events.
- Bulk atómico.

## CompetitionEntry

TEAM scope:
`Entry.team_id == Match concrete Team`

LINE scope:
- `Entry.season_id == Match Team.season_id`
- `Entry.line_id == Match Team.line_id`

Mismatch:
`422 COMPETITION_SCOPE_MISMATCH`

CloseCompetition requiere 0 active entries.

EndCompetitionEntry participa del ReferenceAdmissionFence.

---

# 17. People semantics

## Person base
Required:
- firstName
- lastName

Nullable:
- DNI
- birthDate
- phone
- email

DNI partial unique cuando no es NULL.

## Player roster completeness
Para ingresar como jugadora:
- firstName
- lastName
- DNI
- birthDate
- phone
- email

Si falta:
`422 PLAYER_PROFILE_INCOMPLETE`

## Membership
Período de pertenencia interna al club.

TeamAssignment/RoleAssignment internos deben ocurrir dentro de Membership vigente.

Guardian puede existir sin Membership deportivo.

## TeamAssignment
Afiliación deportiva de una PLAYER. Coach usa RoleAssignment.

## AssignPlayerToTeam
Atómico:
- TeamAssignment
- PLAYER RoleAssignment

## MovePlayerTeam
Atómico:
- end old TeamAssignment
- end old PLAYER role
- end CAPTAIN role si existía
- create new TeamAssignment
- create new PLAYER role

CAPTAIN no se transfiere automáticamente.

## EndPlayerTeam
Termina:
- TeamAssignment
- PLAYER role
- CAPTAIN role si existía

---

# 18. Last Admin protection

Todo command que produciría 0 ACTIVE Accounts con ADMIN/CLUB efectivo falla:

`422 LAST_ADMIN_REQUIRED`

Afecta:
- DisableAccount
- EndRoleAssignment ADMIN
- EndMembership del último Admin

Emergency recovery operacional:
`pnpm admin:issue-recovery <username>`

Sólo para Account ya ADMIN/CLUB. No es API/UI.

---

# 19. Structure semantics

Season:
- Create
- Update name/dates
- histórico
- no hard-delete

Division:
- Create
- Update
- Archive

Line:
- Create
- Update
- Archive

Team:
- DRAFT
- ACTIVE
- ARCHIVED

Venue:
- name
- address
- optional field_label
- archived_at
- stable identity by ID (v1.0.1 clarification: editing name/address/field_label is an administrative correction of the Venue object; see Venue rename semantics in #11; it does not by itself reschedule referencing Events)

Archive queda bloqueado por dependencias activas.

---

# 20. Communication semantics

DIRECT:
- exactamente 2 Persons
- canonical unordered pair
- máximo 1 por pair
- `direct_pair_key` nullable + partial unique

GROUP:
- >=2 participants
- title required
- múltiples groups entre mismas personas

TEAM:
- 0..1 canonical conversation por Team
- membership sincronizado server-side

EVENT:
- 0..1 canonical conversation por Event
- membership sincronizado server-side

Participants:
- joined_at
- left_at
- no acceso a historia anterior a joined_at
- ex-participant conserva período autorizado

Automatic Communication entitlement:
- PLAYER
- CAPTAIN
- COACH

Guardian no entra. ADMIN/SUBCOMMITTEE no acceden automáticamente a chats privados.

## Guardian experience (v1.0.1 clarification)

Simplest solution for the user. No "Guardian" module. No GUARDIAN role. No `/guardian` main destination. Guardian remains GuardianRelationship + delegation: an Account without sports Membership is possible; more than one associated minor is possible; the relationship is individual per minor. Each GuardianRelationship independently controls can_view_child_info and can_respond_availability.

A Guardian enters the same product, not a parallel application. If access exists only as Guardian, the application shows only destinations the person can actually use. Communication, Management and Coach sports functionality do not appear automatically.

Home shows the minor's context. With a single minor, no unnecessary selector is added. With several minors, a simple recognizable contextual switcher is shown, close to the "switch profile/account" pattern, without becoming a module (conceptual example: "Viendo a Lucía Fernández ▾"). Switching minor affects the relevant projections: Home, Calendar, Team, Availability.

Relationship management/consultation lives inside More → Mi perfil, in a "Personas a cargo" section.

---

# 21. Announcement rules

Audience:
- club-wide
- selected Teams

“Line A” de UI se resuelve a TEAM_SET.

Published audience snapshot immutable.

CorrectAnnouncement puede corregir title/body con reason + Audit.

Audience incorrecto -> Announcement nuevo.

---

# 22. Notifications

Tipos V1:
- EVENT_CHANGED
- EVENT_POSTPONED
- EVENT_RESCHEDULED
- EVENT_CANCELLED
- EVENT_RESTORED
- SELECTION_PUBLISHED
- ANNOUNCEMENT_PUBLISHED

No notification por:
- Availability response
- Attendance entry
- Message
- typo menor

Selection republish compara previous vs new:
- selectedNow
- removedNow

Target changes notifican:
`old audience ∪ new audience ∪ existing Availability ∪ published Selection ∪ relevant staff`

---

# 23. Navigation y canonical workflows

Main nav:
- Inicio
- Calendario
- Equipos
- Comunicación
- Más

Utilities:
- Buscar
- Notificaciones

Routes:

### Public/Auth
- `/login`
- `/activate`
- `/no-access`

### Global
- `/home`
- `/calendar`
- `/search`
- `/notifications`
- `/more/profile`

### Teams / People
- `/teams`
- `/teams/:teamId`
- `/people/:personId`

### Events
- `/events/new`
- `/events/:eventId`
- `/events/:eventId/edit`
- `/events/:eventId/availability`
- `/events/:eventId/selection`
- `/events/:eventId/attendance`
- `/events/:eventId/match-record`

### Jornadas
- `/jornadas/new`
- `/jornadas/:jornadaId`

### Communication
- `/communication`
- `/communication/conversations/new`
- `/communication/announcements/new`
- `/announcements/:id`
- `/announcements/:id/edit`
- `/conversations/:id`

### Management
- `/management`
- `/management/structure`
- `/management/teams/:id`
- `/management/people`
- `/management/people/new`
- `/management/people/:id`
- `/management/competitions`
- `/management/competitions/:id`

### Reports / Audit
- `/reports`
- `/reports/attendance`
- `/reports/performance`
- `/audit`

Canonical route paths: **38** (the explicit list above is authoritative).

Workflow/surface inventory: derived from this Product Truth and may include embedded surfaces such as Impact Preview, Conflict Workspace, session interruption, contextual sheets/modals and state-specific surfaces. The Freeze uses no numeric total until that list is explicitly enumerated. No seven routes are invented to match an older count.

---

# 24. UX rules

Hierarchy:
`PAGE -> CONTEXT -> WHAT MATTERS NOW -> CONTENT -> SECONDARY`

- una pregunta dominante;
- progressive disclosure;
- Draft/PUBLISHED inequívocos;
- impact preview antes de cambios relevantes;
- no fake success;
- error preserva input;
- empty != zero != error;
- responsive conserva significado;
- unauthorized oculto;
- authorized-but-blocked disabled + reason;
- browser Back preserva origen;
- direct deep link autosuficiente.

---

# 25. Physical Data Model

**Total físico final: 45 tablas.**

## people — 6
1. persons
2. accounts
3. memberships
4. team_assignments
5. role_assignments
6. guardian_relationships

## club — 5
7. seasons
8. divisions
9. lines
10. teams
11. venues

## competition — 4
12. competitions
13. competition_entries
14. eligibility_constraints
15. external_references

## events — 11
16. event_series
17. event_series_target_teams
18. event_series_target_persons
19. events
20. matches
21. event_target_teams
22. event_target_persons
23. event_occurrence_overrides
24. event_logistics
25. jornadas
26. jornada_matches

## participation — 6
27. availabilities
28. selection_sets
29. selection_revisions
30. selection_entries
31. attendance_sheets
32. attendance_entries

## communication — 6
33. announcements
34. announcement_target_teams
35. conversations
36. conversation_participants
37. messages
38. notifications

## match_record — 2
39. match_records
40. player_match_stats

## integrity — 1
41. audit_entries

## infra — 2
42. command_receipts
43. outbox_events

## auth — 3
44. password_credentials
45. sessions
46 nominally would be wrong: `account_setup_tokens` is the third auth table, but the canonical physical count remains **45 total** because the core count before auth is **42**, not 43.

Canonical set:
- 42 core/infrastructure tables
- 3 auth tables
- 45 total

The table names, not ordinal numbers, are authoritative.

### Auth table set
- `auth.password_credentials`
- `auth.sessions`
- `auth.account_setup_tokens`

---

# 26. Important table contracts

## persons
- first_name
- last_name
- dni nullable partial unique
- birth_date nullable
- phone nullable
- email nullable
- timestamps
- version

## accounts
- person_id unique
- username case-insensitive unique
- status PENDING/ACTIVE/DISABLED
- activated_at / disabled_at
- version

## role_assignments
- role
- scope_type CLUB/TEAM/EVENT
- exact target FK
- validity
- temporal exclusions

## guardian_relationships
- guardian_person
- child_person
- relationship_type
- validity
- can_view_child_info
- can_respond_availability

## teams
Unique:
`season_id + division_id + line_id`

Identity immutable.

## external_references
Target whitelist:
- COMPETITION
- COMPETITION_ENTRY
- MATCH_EVENT

## events
- type
- title
- start/end
- timezone
- venue
- state
- club_wide_target
- series links
- coordination_revision
- creator
- timestamps/version

## notifications
- recipient
- notification_type
- resource type/id
- origin_event_id
- title/body
- occurred_at
- created_at
- read_at

Unique logical key:
`origin_event_id + recipient + type`

## audit_entries
Append-only.

## command_receipts
- command_id
- actor
- command_name
- request_fingerprint
- compact non-sensitive result_data
- completed_at

## outbox_events
- id
- event_type
- event_version
- aggregate type/id
- minimal payload
- occurred_at
- available_at
- processed_at
- failed_at
- attempt_count
- last_error

---

# 27. Database conventions

- UUID PK
- snake_case
- timestamptz
- mutable aggregate root `version >=1`
- text + CHECK en lugar de PG enums
- no generic deleted_at
- temporal `[from, until)`
- FK RESTRICT default
- CASCADE sólo strict disposable Draft children
- JSONB sólo Audit / Outbox / CommandReceipt
- triggers sólo integrity / immutability / deferred structural constraints

---

# 28. Retention

Domain data sin auto-delete V1:
- Persons
- Memberships
- Assignments
- Events
- Participation
- Announcements
- Messages
- MatchRecords
- Audit
- Notifications

Technical cleanup:
- CommandReceipts >=30 días
- expired/revoked Sessions 30 días
- consumed/expired SetupTokens 30 días
- processed Outbox 30 días
- failed Outbox hasta resolución + >=30 días

Privacy retention/deletion: **EXTERNAL policy**.

---

# 29. Backend architecture

Pattern: **modular monolith**.

- one HTTP API
- one PostgreSQL
- Worker
- no service-to-service HTTP
- no event sourcing
- no Redis
- no microservices

Application services are use cases, not generic CRUD.

Repositories are aggregate-oriented.

Cross-domain Query Layer is read-only.

---

# 30. Public command pipeline

1. resolve actor
2. authenticate current Session
3. lookup CommandReceipt
4. if exact committed replay: return stored logical result
5. reserve command/idempotency
6. lock auth facts
7. authorize
8. check expectedVersion
9. acquire consistency fences
10. domain validate
11. impact revalidate if needed
12. mutate
13. Audit
14. Outbox if needed
15. CommandReceipt
16. COMMIT
17. response

Lock order:

`command receipt -> auth -> primary roots -> dependent roots -> fences -> children sorted IDs`

---

# 31. Idempotency

Mutation intention:
`Idempotency-Key: UUID`

Same key + same fingerprint:
- original result replay

Same key + different payload:
- `409 IDEMPOTENCY_KEY_REUSED`

Ambiguous transport:
- same key
- same payload

Corrected/new intention:
- new key

Receipt replay recovers a past committed result; it is not a new command.

---

# 32. Transition commands

When user confirms terminal/published state, command receives exact final intended draft.

Examples:
- ScheduleEvent
- PublishSelection
- PublishAnnouncement
- FinalizeMatchRecord

No frontend choreography `SaveDraft -> Publish` to fake atomicity.

Create-and-publish Announcement has a dedicated command.

---

# 33. Consistency fences

ReferenceAdmissionFence protects races between:
- archive/end/close
- creation of new dependencies

Examples:
- ArchiveTeam vs new Team dependency
- ArchiveVenue vs new Event
- CloseCompetition vs new Entry
- EndCompetitionEntry vs new Match

Event-dependent commands serialize where necessary.

---

# 34. API conventions

Base: `/api/v1`

Transport:
- HTTPS
- JSON except SSE endpoint
- REST-like
- no direct frontend DB

Response:
```json
{
  "data": {},
  "meta": {"requestId": "..."}
}
```

Error:
```json
{
  "error": {
    "code": "...",
    "message": "...",
    "details": {},
    "fieldErrors": {},
    "requestId": "..."
  }
}
```

Status:
- 200
- 201
- 400
- 401
- 403
- 404
- 409
- 413
- 422
- 429
- 500
- 503

Sensitive non-revealable resource -> 404.

Known forbidden action -> 403.

Unknown request fields -> 422.

---

# 35. Pagination / compatibility

Opaque keyset cursor:
- default 50
- max 100
- stable ordering

Cursor binds:
- query
- resource context
- Account
- integrity protection

Auth rechecked on every page.

API responses are additive-compatible.

Breaking changes require v2 or coordinated migration.

Rolling compatibility:
- Frontend N-1 ↔ API N-1
- Frontend N-1 ↔ API N
- Frontend N ↔ API N-1
- Frontend N ↔ API N

New API capabilities deploy backend-first.

---

# 36. Core API families

## Auth
- login
- session bootstrap
- logout
- setup
- change-password
- reauthenticate
- activity

## Global
- /me
- /home
- /calendar
- /search

## Notifications/realtime
- notification list/summary/read
- realtime stream

## People/access
- people
- membership
- account
- team assignment
- role assignment
- guardian

## Club
- Season
- Division
- Line
- Team
- Venue

## Competition
- Competition
- CompetitionEntry
- Eligibility
- ExternalReference

## Events
- typed create
- draft edit
- schedule
- impact preview/execute
- cancel/postpone/reschedule/restore
- start/complete/abandon
- EventSeries
- Jornada

## Participation
- Availability
- Selection
- Attendance

## MatchRecord
- get/draft/finalize/correct

## Communication
- Announcement
- Conversation
- Messages
- Participants

## Insight
- reports
- history
- audit

---

# 37. Impact Preview

Impact token binds:
- actor
- resource
- operation
- normalized proposed change
- relevant versions
- impact hash
- expiry

Execute reauthorizes and recomputes.

Errors:
- INVALID_IMPACT_TOKEN
- IMPACT_TOKEN_EXPIRED
- IMPACT_CHANGED

Changed impact requires explicit reconfirmation.

---

# 38. Stable error catalog

Includes:
- AUTHENTICATION_FAILED
- SESSION_EXPIRED
- CSRF_FAILED
- REAUTHENTICATION_REQUIRED
- PAYLOAD_TOO_LARGE
- INVALID_CURSOR
- STALE_VERSION
- IMPACT_CHANGED
- IDEMPOTENCY_KEY_REUSED
- PLAYER_PROFILE_INCOMPLETE
- INVALID_ROLE_SCOPE
- LAST_ADMIN_REQUIRED
- MEMBERSHIP_HAS_ACTIVE_DEPENDENCIES
- STRUCTURE_HAS_ACTIVE_DEPENDENCIES
- EVENT_TARGET_INVALID
- COMPETITION_SCOPE_MISMATCH
- MATCH_STATE_INCOMPATIBLE
- RECURRENCE_TOO_LARGE
- BULK_OPERATION_TOO_LARGE
- TEMPORARILY_UNAVAILABLE

---

# 39. Frontend

Stack:
- React 19
- TypeScript
- Vite
- React Router
- TanStack Query v5
- React Hook Form
- Zod 4
- Centralized semantic design tokens + CSS custom properties as the visual source; tokenized utility layer allowed (Tailwind v4 conserved as the composition/utility layer; CSS Modules allowed, NOT mandatory)

No Next.js, SSR/RSC, or generic Redux/Zustand store.

Styling obligation (v1.0.1 clarification, no product behavior change): styles must not depend on dispersed magic values. Semantic design tokens are centralized, CSS custom properties are the visual source, and any utility layer used is tokenized. The clause that prohibited Tailwind as an architectural dependency is removed: the CURRENT already owns a coherent token-based visual system on Tailwind, and a mass migration adds no product or user-comprehension value.

Architecture:

```text
src/
  app/
    router/
    providers/
    shell/
    session/
    bootstrap/
  routes/
  features/
  shared/
    api/
    generated/
    http/
    errors/
    ui/
    patterns/
    lib/
    hooks/
    styles/
```

Dependency:
`routes -> features -> shared`

shared never depends on feature.

---

# 40. Shells and permission UI

Shells:
- PublicShell
- AuthenticatedAppShell

No role-specific shell.

Mobile bottom nav and desktop sidebar expose same destinations.

Global nav derives from `/me.navigation`.

Object actions derive from `allowedActions`.

Never recreate server authorization with `if role===...`.

---

# 41. Client state ownership

| State | Owner |
|---|---|
| server state | TanStack Query |
| unsaved forms | React Hook Form |
| URL/filter | Router + Zod |
| auth/sessionEpoch | SessionContext |
| local UI | useState/useReducer |
| persisted Selection draft | backend + Query |
| realtime connection | RealtimeProvider |

No duplicated server truth.

---

# 42. Query/session isolation

Each `sessionEpoch` owns a separate in-memory QueryClient.

Identity change:
- cancel reads
- discard late old results
- destroy old QueryClient
- mount new app

Authenticated cache is never persisted.

---

# 43. Freshness

Baseline:
- Structural: 5 min
- Standard: 60 s
- Operational: 15 s
- Messages/Notifications: realtime + polling

Refetch on focus/reconnect when stale.

GET retry max 2 on network/5xx.

Mutation automatic retry: false.

---

# 44. Form/conflict model

Form baseline:
- baselineVersion
- baselineValues

Dirty forms:
- background refresh never overwrites local input

409 preserves:
- baseline
- localDraft
- latestServer

No generic force overwrite.

---

# 45. Selection autosave

Only mandatory domain autosave.

- 600 ms debounce
- one in-flight
- coalesce intermediate states
- snapshot + version + idempotencyKey + generation

States:
- SAVED
- CHANGES_PENDING
- SAVING
- SAVE_ERROR
- CONFLICT

Publish waits only for an already in-flight autosave. Unsaved local desired state goes directly in PublishSelection.

---

# 46. Mutation journal

`sessionStorage` only for consequential ambiguous commands.

Contains:
- idempotencyKey
- requestFingerprint
- commandKind
- createdAt

Never:
- payload
- PII
- form state
- result

TTL: **24h**.

After TTL no blind replay.

---

# 47. Success/failure semantics

No optimistic confirmed success.

Pending language allowed.

Confirmed command + failed projection refresh:
“Cambio guardado. No pudimos actualizar toda la información.”

Ambiguous command:
“No pudimos confirmar el resultado.”

---

# 48. Auth

Username/password + opaque server-side session.

No permission-bearing JWT in browser.

Passwords:
- Argon2id
- 12–128 chars
- Unicode/spaces allowed
- no arbitrary complexity rules
- no periodic forced expiry

---

# 49. Session cookie

`__Host-gei_session`

- Secure
- HttpOnly
- SameSite=Lax
- Path=/
- no Domain

Session token:
- random CSPRNG
- raw only in cookie
- DB stores HMAC digest with external `SESSION_TOKEN_KEY`

Idle: 12h.  
Absolute: 7d.

Background traffic does not extend idle.

`POST /auth/activity` extends idle only after real human interaction.

---

# 50. CSRF

`csrfToken = HMAC-SHA256(CSRF_TOKEN_KEY, session.id)`

`GET /auth/session` regenerates it.

Browser holds token in memory only.

Unsafe authenticated requests require:
- Session cookie
- X-CSRF-Token
- expected Origin
- Fetch Metadata when available

Login/setup pre-session POSTs validate Origin/Referer fallback.

---

# 51. Activation / reset

Create Account:
- Account PENDING
- Credential SETUP_REQUIRED

Setup code:
- one-time
- 24h
- 5 failed attempts
- HMAC digest with `SETUP_TOKEN_KEY`
- max 1 active/account

`POST /auth/setup`:
- consume code
- set password
- activate Account
- Audit
- COMMIT
- **does not create Session**

Then user logs in.

Admin reset:
- credentialVersion++
- SETUP_REQUIRED
- password_hash NULL
- revoke sessions
- invalidate old setup token
- issue new token
- Audit

---

# 52. Step-up

Sensitive access management requires recent password reauthentication.

Window: 10 minutes.

Change-password verifies current password directly.

---

# 53. Authorization freshness

`authorizationFingerprint` is derived from current:
- Account state
- Membership
- TeamAssignments
- RoleAssignments
- Guardian delegations

Never separately stored or used as permission token.

`hasApplicationAccess` true iff:
- effective internal RoleAssignment exists, or
- effective Guardian delegation has app permission.

False -> `/no-access`.

---

# 54. Multi-tab

BroadcastChannel signals:
- LOGIN
- LOGOUT
- SESSION_ROTATED
- SESSION_INVALIDATED

No secrets sent.

---

# 55. Realtime

REST is authoritative.

Realtime transport:
- PostgreSQL LISTEN/NOTIFY
- SSE
- polling fallback

One LISTEN connection per API process.

Signals:
- notification.created
- conversation.changed
- authorization.changed
- session.invalidated
- resync

SSE payload = identifiers/hints only.

---

# 56. SSE safety

Streams revalidate Session about every 30 s:
- Account
- expiry
- revocation
- credentialVersion

No user-activity touch.

Hidden tab:
- polling off immediately
- SSE may remain ~60 s then closes
- visibility restore triggers catch-up

---

# 57. Polling fallback

Visible:
- `/me`: 60 s
- Home: 30 s
- Calendar: 60 s
- Event: 30 s
- Availability: 10 s
- Selection: 10 s
- Attendance: 10 s
- Team: 60 s
- Communication list: 30 s
- Conversation head: 5 s
- Notifications summary: 30 s
- Reports/Audit: none

---

# 58. Durable Notifications / Worker

Source command atomically commits:
- domain truth
- Audit
- Outbox
- CommandReceipt

Worker:
- one OutboxEvent transaction
- `FOR UPDATE SKIP LOCKED`
- atomic fanout
- idempotent handler
- processed/failed states
- pg_notify hints

Outbox payload includes:
- type/version
- resourceRef
- occurredAt
- source-time recipients
- templateCode
- immutable variables
- audienceResolvedAt

Worker never reconstructs historic copy from mutable current state.

---

# 59. Conversation realtime

Live head:
- latest 50
- 5 s visible polling

Historical pages on demand.

Edited/deleted cached old message:
- signal includes messageId
- refetch exact message when loaded

Participant temporal access is authoritative.

---

# 60. Production stack

Frontend:
- React 19
- TypeScript
- Vite

Backend:
- Node.js 22 LTS
- TypeScript strict
- Fastify 5

DB access:
- Kysely
- node-postgres

DB:
- PostgreSQL

Host:
- Render

Repo:
- pnpm workspace monorepo

---

# 61. Production topology

Target:
- 2 Web/API instances
- 2 Worker instances
- PostgreSQL HA
- same region
- asset bucket/CDN
- backup S3 bucket
- external uptime monitor

Initial region:
Virginia, subject to actual Argentina latency measurements.

Same-origin application/API.

---

# 62. Immutable frontend assets / CSP

App HTML same-origin.

Hashed JS/CSS/static assets live on:
`https://assets.<gei-domain>`

Old assets retained across deploys.

CSP baseline:

```text
default-src 'self';
script-src 'self' https://assets.<gei-domain>;
style-src 'self' https://assets.<gei-domain>;
img-src 'self' data: https://assets.<gei-domain>;
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
```

Asset bucket holds no private GEI data.

---

# 63. DB connection strategy

No PgBouncer initially.

API:
- pool max 8
- 1 direct LISTEN connection

Worker:
- pool max 4

Possible future PgBouncer only if measured. LISTEN remains direct.

Guardrails:
- connection acquisition 2 s
- normal statement 3 s
- report statement 8 s
- lock wait 2 s
- idle transaction 5 s
- command hard deadline 15 s

---

# 64. Health / graceful shutdown

Endpoints:
- `/health/live`
- `/health/ready`
- `/health/render`

Startup requires:
- secrets
- DB
- compatible schema
- initialization

Transient DB outage after successful startup does not intentionally cause API restart loop.

SIGTERM:
- stop new work
- drain
- finish transaction where possible
- close SSE/DB cleanly

Worker stops claiming new Outbox and finishes current transaction.

---

# 65. Migrations

- Kysely migrator + raw SQL
- PostgreSQL advisory lock
- normal migrations transactional
- expand -> deploy -> backfill -> deploy -> contract
- forward-only production
- no automatic destructive down
- special nontransactional DB operation uses explicit runbook

Outbox payloads are versioned for Worker N/N+1 coexistence.

---

# 66. Backups / DR

Protection:
- managed PITR
- daily pg_dump
- S3
- 30-day logical retention
- encrypted
- archive validation
- remote verification
- checksum
- external freshness heartbeat

No successful backup for 26h -> critical alert.

Monthly restore drill.

Restore:
1. maintenance/read-only
2. stop workers
3. restore new DB
4. validate
5. forward migrations
6. rotate SESSION_TOKEN_KEY
7. rotate SETUP_TOKEN_KEY
8. switch DB
9. start API
10. readiness
11. start Workers
12. exit maintenance

Key rotation is maintenance, not rolling mixed-key deployment.

---

# 67. HA limitation

Application guarantees:
- no partial transaction
- no duplicate logical command
- idempotent ambiguous retry
- optimistic concurrency

Managed asynchronous HA does **not** guarantee RPO 0 for the most recent acknowledged seconds during catastrophic failover.

This is accepted/documented.

---

# 68. Performance / capacity

Requirement:
common queries <=3 s.

Internal:
- GET p95 <1 s
- GET p99 <2 s
- mutation p95 <1.5 s
- reports p95 <3 s
- report hard deadline 10 s

Stress dataset:
- 2,000 Persons
- 10 Seasons
- 250 historical Teams
- 50k Events
- 200k Availability
- 150k Attendance
- 500k Messages
- 250k Audit
- 100k Notifications

Load:
- k6
- 100 concurrent authenticated users
- 15 min representative mix

Evidence remains pending until implementation.

---

# 69. Operational monitoring

Observe:
- HTTP latency
- 5xx
- DB pool wait
- DB query duration
- Outbox pending
- oldest Outbox age
- failed Outbox
- Notification latency
- SSE connection count
- LISTEN health
- login failures
- CPU/RAM
- Worker heartbeat
- backup freshness

Candidate alerts:
- 5xx >2% /5 min
- common API p95 >2 s /5 min
- Outbox oldest >30 s warning
- >50 s critical
- failed Outbox >0 critical
- LISTEN disconnected >30 s warning

---

# 70. Rate limits

Credential throttling is persistent DB-backed security control.

Other candidate limits are operational guardrails:
- login 30 / 10 min / IP
- setup 20 / 10 min / IP
- normal API 300 / min / Account
- SendMessage 60 / min / Account
- SSE 5 / Account

They may be per-instance unless a shared limiter is later introduced.

They never replace authorization.

---

# 71. Logging / Audit / History

Technical log:
“¿funcionó técnicamente?”

Audit:
“¿quién modificó qué?”

History:
“¿qué necesita comprender el usuario?”

Never log:
- password
- hash
- session token
- CSRF
- setup code
- Cookie
- message body
- DNI

History sources:
- Events + Audit
- Attendance tables + Audit corrections
- MatchRecord/Stats
- SelectionRevision
- Announcement
- Message
- Audit for administrative changes

No generic History table.

---

# 72. Universal E2E contracts

## Write

`User intent -> canonical workflow -> local input -> API -> Session/CSRF/idempotency -> Public Command -> current authorization -> version/locks/fences -> validation -> one transaction -> domain + Audit + Outbox + Receipt -> COMMIT -> result -> Query reconciliation -> UI`

Frontend never coordinates an atomic business transaction.

## Read

`Route -> typed URL -> QueryKey -> GET projection -> current Session -> current authorization -> Query Layer -> consistent projection -> field filtering -> DTO -> Query cache -> screen`

## Realtime

`commit -> optional NOTIFY -> SSE hint -> invalidate -> REST refetch`

Realtime never becomes domain truth.

---

# 73. Error -> UX

| Error | UX |
|---|---|
| 400 | invalid technical request |
| 401 | Session Interruption |
| 403 | action unavailable; revalidate |
| 404 | unavailable/non-revealable |
| 409 STALE_VERSION | Conflict Workspace |
| 409 IMPACT_CHANGED | reconfirm new impact |
| 409 idempotency | client/new-intention handling |
| 422 | field/workflow/domain explanation |
| 429 | Retry-After |
| 500 | preserve input |
| 503 | preserve input; dependency temporary |
| ambiguous network mutation | preserve intention; same-key retry |

---

# 74. Representative E2E coverage

Covered:
- Login/Home
- Person + Account
- Activation
- Account reset
- Team assignment/move/end
- Role lifecycle
- Event create/schedule
- recurrence
- Availability
- Guardian Availability
- Selection draft/publish
- Eligibility race
- material Event change
- target change
- cancel/postpone/restore
- Attendance
- Attendance correction
- MatchRecord
- MatchRecord correction
- Jornada bulk
- Announcement
- Conversation creation
- Messages
- membership change
- authorization loss
- Account disable
- password change
- Search
- Notification navigation
- Reports
- Audit
- concurrency 409
- ambiguous outcome
- Worker failure
- DB failover
- rolling deploy

---

# 75. Core invariants

## Product
- technical Category entity does not exist.
- Team = Season + Division + Line.
- Match has exactly one concrete Team.
- Availability != Selection != Attendance != Eligibility.
- matchesPlayed derived.
- no dynamic stats engine.
- meaningful history is not hard-deleted.
- Completed Match never reopens.

## Authority
- current server facts win.
- ADMIN is not sports superuser.
- Guardian authority is explicit.
- authority loss purges no-longer-authorized cached data.

## Persistence
- one write owner per domain truth.
- root version protects mutable aggregates.
- no generic deleted_at.
- DB backs structural impossibilities.

## Commands
- one user business intention -> one Public Command.
- terminal transition persists final draft atomically.
- no frontend pseudo-transactions.
- ambiguous retry same key/payload.
- no last-write-wins.

## Frontend
- Query owns server state.
- form owns unsaved state.
- dirty form never overwritten by background refresh.
- no client-side authorization recreation.
- no persisted authenticated domain cache.

## Async
- realtime not required for correctness.
- durable async effect uses Outbox.
- Notification uses source-time snapshot.
- duplicate/reordered/lost hint is safe.

## Security
- opaque server sessions.
- Argon2id password.
- external token keys.
- CSRF bound to Session.
- immediate server-side session invalidation.
- private chats not exposed to ADMIN by role.

## Deployment
- stateless processes.
- rolling-compatible schema/API.
- versioned Outbox.
- bounded DB waits.
- verified backups.
- HA RPO limitation explicit.

---

# 76. Traceability

## Original RF
RF01–05 -> People/Auth/Club Structure  
RF06–08 -> Events/Participation/Match  
RF09–10 -> Match Record/Reports  
RF11–12 -> Calendar/Availability  
RF13–16 -> Communication/Events/Notifications  
RF17 -> EventLogistics  
RF18–19 -> Reports  
RF20 -> Search  
RF21 -> History/Audit

Coverage: **21/21**

## Original RNF

| RNF | Owner |
|---|---|
| Web Internet | Render Web |
| responsive | Frontend/S23 |
| <=3s | query/index/perf gates |
| username/password | Auth |
| roles | Authorization |
| secure DB | managed PostgreSQL/private access |
| daily backup | pg_dump + S3 |
| intuitive UI | UX/S23 |
| Chrome/Edge/Firefox | compatibility tests |
| HTTPS | TLS/HSTS |
| 100 concurrent | topology + k6 |
| notification <=1m | Outbox/Worker/SLA |
| 24/7 except maintenance | multi-instance + DB HA |
| admin audit | Audit |
| privacy | technical + external governance |

Coverage owner: **15/15**

---

# 77. Final 1:1 audit counters

After S22 closure:

- Original ERS RF mapped: 21/21
- Original RNF mapped: 15/15
- Final RF mapped: 40/40
- Final RNF acceptance owner: 22/22
- Killer scenarios covered: 75/75
- Capabilities owned: 16/16
- Product objects owned: 35/35
- Physical tables justified: 45/45
- Stateful objects with lifecycle: ALL
- transitions with command: ALL
- public commands with authority: ALL
- commands with API: ALL
- APIs with initiating workflow: ALL
- canonical route paths: 38/38 (explicit list in #23 is authoritative; embedded workflow/surface inventory is derived, not numerically closed)
- routes with projection: ALL
- mutations with concurrency rule: ALL
- mutations with Audit decision: ALL
- async effects with Outbox/no-Outbox decision: ALL
- notifications with audience rule: ALL
- PII fields with visibility rule: ALL
- UI actions with authority source: ALL
- stable errors with recovery behavior: ALL
- RNFs with acceptance mechanism: ALL

Reverse audit:
- unjustified table: 0
- unjustified role: 0
- unjustified state: 0
- unjustified API route: 0
- unjustified command: 0
- unjustified screen/workflow: 0
- unjustified infrastructure component: 0
- table without owner: 0
- transition without command: 0
- command without authority: 0
- command without API: 0
- API without frontend consumer: 0
- screen without data source: 0
- client authority duplication: 0
- async correctness dependency: 0
- realtime truth dependency: 0

---

# 78. Evidence Pending

The specification is closed, but implementation must prove:

- common queries <=3 s
- >=100 concurrent users
- Notification <=1 min
- Chrome compatibility
- Edge compatibility
- Firefox compatibility
- responsive behavior
- actual recurring backup success
- actual restore drill
- actual failover reconnect behavior
- actual no-false-success UI
- actual accessibility behavior

These are **not** specification gaps.

---

# 79. External Gate: Privacy

Technical controls are closed:
- field-level authority
- least privilege
- HTTPS
- protected DB
- log restrictions
- Audit
- limited medical scope
- explicit retention separation
- correction support

External/organizational:
- data controller/responsible party
- privacy notice
- purposes
- lawful basis/consent where needed
- retention policy
- access requests
- rectification
- suppression
- international transfer assessment

Status:
`TECHNICAL CLOSED / ORGANIZATIONAL EXTERNAL`

---

# 80. Academic deliverables still to materialize

Pending artifacts:
- corrected requirements document
- Use Case Diagram
- basic specification of all use cases
- Class Diagram
- tracking board
- implementation start

They are derivable from this freeze and do not require reopening product discovery.

---

# 81. Figma contract

Figma may define:
- layout
- hierarchy
- typography
- spacing
- components
- visual copy refinement
- responsive composition
- motion
- loading/empty/error presentation

Figma may **not** define:
- new domain state
- new authority
- new DB object
- new lifecycle
- new business command
- new Notification class
- new backend truth
- new product scope

If Figma discovers a real missing requirement:
1. stop;
2. register gap;
3. reopen relevant freeze section explicitly;
4. resolve;
5. issue new freeze revision.

---

# 82. Change Control

Current authority:

**GEI SYSTEM / PRODUCT TRUTH FREEZE v1.0.1**

v1.0 remains intact as a historical document.

## Changes from v1.0 (exactly these five, nothing else)

- Tailwind clarification (#39): Tailwind v4 conserved; centralized semantic tokens + CSS custom properties required; tokenized utility layer allowed; CSS Modules allowed, not mandatory. No product behavior change.
- Venue rename semantics (#11, #19): editing a Venue's identity/metadata is an administrative correction (no Impact Preview, no NEEDS_RECONFIRMATION, no coordination_revision++, no rescheduling notification); changing the Venue assigned to an Event stays material with all defined effects.
- Guardian experience + PII (#6, #20): no Guardian module, no GUARDIAN role, no `/guardian` destination; same product with only usable destinations; minor context on Home with a simple switcher only when several minors; relationship management inside More → Mi perfil ("Personas a cargo"); PII limited to what the delegation needs (minor phone/email not automatic).
- EligibilityConstraint canonical model (#13): EligibilityConstraint[] with id, personId, state, scope, scopeRefId, source, reason, optional note, validFrom, validUntil; ELIGIBLE derived; no clinical data.
- Canonical routes count clarification (#23, #77): canonical route paths 38 (explicit list authoritative); no "45 routes" claim; workflow/surface inventory derived without a numeric total until explicitly enumerated.

No features were changed by this revision.

Any future change must state:
- section changed
- reason
- source/evidence
- affected objects
- lifecycle impact
- authority impact
- DB impact
- API impact
- frontend impact
- E2E impact
- migration/backward compatibility impact

Versioning:
- v1.0.1 clarification/no behavior change
- v1.1 intentional V1 behavior change
- v2.0 breaking product/architecture revision

---

# 83. Final declaration

```text
GEI HOCKEY MANAGEMENT SYSTEM

SYSTEM / PRODUCT TRUTH FREEZE
VERSION 1.0.1 (clarification — no behavior change; v1.0 historical and intact)

S00–S11  PRODUCT                    FROZEN
S12      TECHNICAL ARCHITECTURE     FROZEN
S13      DATA MODEL                 FROZEN
S14      BACKEND CONTRACTS          FROZEN
S15      API CONTRACTS              FROZEN
S16      FRONTEND ARCHITECTURE      FROZEN
S17      CLIENT RUNTIME             FROZEN
S18      AUTH / SESSIONS            FROZEN
S19      NOTIFICATIONS / FRESHNESS  FROZEN
S20      RELIABILITY / DEPLOYMENT   FROZEN
S21      FULL E2E CONTRACTS         FROZEN
S22      FINAL 1:1 AUDIT            FROZEN

GEI SYSTEM FREEZE 1.0               ✓
```

**Regla final:** a partir de esta versión, el trabajo deja de ser “seguir pensando cómo funciona GEI” y pasa a ser **representar, implementar y verificar este sistema**.
