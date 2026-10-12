# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS CATALOG V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-10
**Etapa:** 8 — Modelo de clases completo (E8-02)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline E7:** `fa7687f1b9622524fbbefa608c3d90967624e1e9`
**Autoridad:** `GEI_CLASS_MODEL_RECONSTRUCTION_AUDIT_V1.md` + E1–E7 freezes

---

# 1. DECISIONES DE MODELADO RESUELTAS

| ID | Decisión | Resolución | Justificación |
|---|---|---|---|
| CLASS-DECISION-01 | Training/Match/ClubEvent: herencia vs discriminación | **Discriminación por tipo** (`Event.type`: TRAINING/MATCH/CLUB_EVENT) | PT §10: Event es raíz con invariantes comunes; subtipos solo añaden restricciones; E6 SM-EVENT-01 documenta "Subtipo Match — Variantes Adicionales" sin herencia UML; no hay substitutabilidad completa |
| CLASS-DECISION-02 | EventLogistics: VO embebido vs clase canónica | **Clase canónica** (`EventLogistics`) | PT §11, tabla 24: tiene identidad propia; se referencia, actualiza (UC-EVT-16), audita; CAPTAIN/COACH/SUBCOMMITTEE la editan; opcional por Event (0..1) |
| CLASS-DECISION-03 | Selection / SelectionRevision: una vs dos clases | **Dos clases**: `Selection` (contenedor) + `SelectionRevision` (unidad publicación) | E6: Selection = borrador actual mutable + historial revisiones PUBLISHED; SelectionRevision = DRAFT→PUBLISHED inmutable; republicar = nueva revisión |
| CLASS-DECISION-04 | AttendanceSheet / AttendanceEntry: una vs dos clases | **Dos clases**: `AttendanceSheet` (contenedor OPEN/CLOSED) + `AttendanceEntry` (valores) | E6: AttendanceSheet deriva OPEN/CLOSED de `closed_at`; AttendanceEntry = PRESENT/ABSENT/JUSTIFIED persistidos + UNRECORDED derivado; corrección auditada no reabre planilla |
| CLASS-DECISION-05 | CompetitionEntry TEAM/LINE: subclases vs scope | **Una clase** `CompetitionEntry` con `scope: CompetitionEntryScope` (TEAM/LINE) | PT §4, REQ-CMP-004: "TEAM y LINE son alcances de dato, no etapas de lifecycle"; SM-COMPETITIONENTRY-01 lo confirma; incompatibilidad = COMPETITION_SCOPE_MISMATCH |
| CLASS-DECISION-06 | Conversation DIRECT/GROUP/TEAM/EVENT: subclases vs tipo | **Una clase** `Conversation` con `type: ConversationType` (DIRECT/GROUP/TEAM/EVENT) | PT §20: 4 tipos con reglas de membresía/unicidad distintas; solo GROUP tiene state machine (ACTIVE→ARCHIVED); DIRECT/TEAM/EVENT sin lifecycle propio |

---

# 2. CATÁLOGO CANÓNICO DE CLASES DE DOMINIO (33)

> **Convención:** Cada clase incluye: ID, Nombre, Responsabilidad, Dominio, Fuente principal, Estado (Persistido/Derivado/VO), Lifecycle/State Machine referencia.

## 2.1 IDENTIDAD Y PERSONAS (PPL/IAM) — 6 clases

| ID | Clase | Responsabilidad | Dominio | Estado | Lifecycle / SM |
|---|---|---|---|---|---|
| CL-01 | **Person** | Entidad base humana: identidad estable (nombre, apellido), datos opcionales (DNI único parcial, birthDate, phone, email); no se elimina, historia conservada | PPL | Persistido | — (sin SM propia; vigencia vía Membership/Assignments) |
| CL-02 | **Account** | Identidad digital: username inmutable unique, credencial Argon2id versionada, estado de cuenta, sesión opaca | IAM | Persistido | **SM-ACCOUNT-01**: PENDING → ACTIVE ↔ DISABLED |
| CL-03 | **Membership** | Período de pertenencia al club `[valid_from, valid_until)`; prerrequisito para TeamAssignment/RoleAssignment internos | PPL | Persistido | Temporal `[from, until)` (E6 §3) |
| CL-04 | **TeamAssignment** | Afiliación deportiva PLAYER a Team (vigencia temporal); atómica con RoleAssignment PLAYER en `AssignPlayerToTeam` | PPL | Persistido | Temporal `[from, until)` (E6 §3) |
| CL-05 | **RoleAssignment** | Rol + scope (CLUB/TEAM/EVENT) + vigencia temporal; 5 roles: PLAYER, CAPTAIN, COACH, SUBCOMMITTEE, ADMIN; combinación inválida → INVALID_ROLE_SCOPE | PPL | Persistido | Temporal `[from, until)` (E6 §3) |
| CL-06 | **GuardianRelationship** | Relación delegada (no rol): guardian_person + child_person + relationship_type + vigencia + flags independientes `can_view_child_info`, `can_respond_availability`; individual por menor; no requiere Membership | PPL | Persistido | Temporal `[from, until)` + flags (E6 §3) |

## 2.2 ESTRUCTURA DEL CLUB (STR) — 5 clases

| ID | Clase | Responsabilidad | Dominio | Estado | Lifecycle / SM |
|---|---|---|---|---|---|
| CL-07 | **Season** | Entidad histórica: nombre, fechas; sin estado (no lifecycle); no hard-delete; identidad estable; referencia para Team/Competition/Jornada | STR | Persistido | NO_STATE_MACHINE (E6 §3) |
| CL-08 | **Division** | Nivel competitivo (ej. Primera, Quinta); lifecycle ACTIVE→ARCHIVED (`archived_at`); renombrar con equipos activos rechazado; valla dependencias | STR | Persistido | **SM-DIVISION-01**: ACTIVE → ARCHIVED (terminal V1) |
| CL-09 | **Line** | Tira/línea deportiva (ej. A/B/C/Proyección) dentro de Division; lifecycle ACTIVE→ARCHIVED; etiqueta completa incluye división+temporada | STR | Persistido | **SM-LINE-01**: ACTIVE → ARCHIVED (terminal V1) |
| CL-10 | **Team** | **Entidad concreta de temporada: identidad = Season + Division + Line (única inmutable)**; nombre derivado; lifecycle DRAFT→ACTIVE→ARCHIVED; valla dependencias al archivar | STR | Persistido | **SM-TEAM-01**: DRAFT → ACTIVE → ARCHIVED (terminal V1) |
| CL-11 | **Venue** | Sede: nombre, dirección, field_label opcional; identidad estable por ID; Regla A/B: corregir metadatos ≠ cambiar sede de evento; lifecycle ACTIVE→ARCHIVED | STR | Persistido | **SM-VENUE-01**: ACTIVE → ARCHIVED (terminal V1) |

## 2.3 EVENTOS (EVT) — 6 clases

| ID | Clase | Responsabilidad | Dominio | Estado | Lifecycle / SM |
|---|---|---|---|---|---|
| CL-12 | **Event** | Raíz común para TRAINING/MATCH/CLUB_EVENT; 7 estados; invariantes fecha, destinatarios plurales, coordination_revision; subtipo discriminado por `type` + row Match opcional + `club_wide_target` | EVT | Persistido | **SM-EVENT-01**: DRAFT→SCHEDULED→{POSTPONED,CANCELLED,IN_PROGRESS}→{COMPLETED,ABANDONED} |
| CL-13 | **EventSeries** | Contenedor de ocurrencias recurrentes; máx 366 por comando; 3 alcances de edición (esta/siguientes/toda); coordination_revision por ocurrencia; lifecycle ACTIVE→ENDED | EVT | Persistido | **SM-EVENTSERIES-01**: ACTIVE → ENDED (terminal) |
| CL-14 | **EventOccurrenceOverride** | Anulación específica de una ocurrencia en serie; identidad propia; permite "solo esta" en ediciones de serie | EVT | Persistido | — (parte de EventSeries) |
| CL-15 | **Jornada** | Agrupa Matches de una jornada operativa; bulk atómico ≤100; season match = season jornada; competition_id opcional → usa CompetitionEntry de esa competition; no duplica lifecycle Matches | EVT | Persistido | NO_STATE_MACHINE (E6 §3) |
| CL-16 | **EventLogistics** | Logística de evento: meetingAt, departureAt, meetingPoint, transportNote, arrivalInstructions; opcional 0..1 por Event; actualizable por CAPTAIN/COACH/SUBCOMMITTEE; identidad propia, auditable | EVT | Persistido | — (vinculada a Event state) |
| CL-17 | **EventTargetTeam** | Asociación Event ↔ Team (N:M) para destinatarios plurales; club_wide_target=false; identity propia | EVT | Persistido | — (clase de asociación) |
| CL-18 | **EventTargetPerson** | Asociación Event ↔ Person (N:M) para destinatarios personales; identity propia | EVT | Persistido | — (clase de asociación) |

> **Nota:** EventSeriesTargetTeam y EventSeriesTargetPerson se modelan igual que EventTargetTeam/Person pero referenciando EventSeries. Se incluyen en relaciones.

## 2.4 PARTICIPACIÓN (PRT) — 9 clases

| ID | Clase | Responsabilidad | Dominio | Estado | Lifecycle / SM |
|---|---|---|---|---|---|
| CL-19 | **Availability** | Respuesta previa a Event SCHEDULED: valores persistidos YES/MAYBE/NO + derivados NO_RESPONSE (sin fila), NEEDS_RECONFIRMATION (resp. previa + coordination_revision mayor); POSTPONED conserva, no acepta nuevas; distinta de Selection/Attendance | PRT | Persistido + Derivado | **SM-AVAILABILITY-01**: Mixto (persistido + derivado) |
| CL-20 | **Selection** | Contenedor de convocatoria de un Match: borrador actual (mutable, autosave) + historial de SelectionRevision PUBLISHED inmutables | PRT | Persistido | Temporal (borrador actual + historial) |
| CL-21 | **SelectionRevision** | Unidad de publicación: DRAFT (editable, autosave 600ms) → PUBLISHED (inmutable); republicar = nueva revisión; no se reescribe; conflictos derivados no bloquean | PRT | Persistido | **SM-SELECTIONREV-01**: DRAFT → PUBLISHED (terminal) |
| CL-22 | **SelectionEntry** | Entrada individual en SelectionRevision: persona + estado (selected/alternate/etc.) + metadata | PRT | Persistido | — (parte de SelectionRevision) |
| CL-23 | **AttendanceSheet** | Contenedor por Event (TRAINING/MATCH): OPEN (closed_at NULL) / CLOSED (closed_at timestamp); deriva de closed_at; no reapertura inventada | PRT | Persistido | Temporal (derivado de closed_at) |
| CL-24 | **AttendanceEntry** | Valor de asistencia: PRESENT/ABSENT/JUSTIFIED persistidos + UNRECORDED derivado (sin fila); corrección auditada con motivo obligatorio; closed_at bloquea marcaje directo | PRT | Persistido + Derivado | **SM-ATTENDANCEENTRY-01**: Mixto (persistido + derivado) |
| CL-25 | **MatchRecord** | Resultado de partido: DRAFT → FINAL (terminal); corrección explícita separada (no transición inversa); compatibilidad con Event state (PLAYED/FORFEIT→COMPLETED, ABANDONED→ABANDONED); stats solo PLAYED | PRT | Persistido | **SM-MATCHRECORD-01**: DRAFT → FINAL (terminal) |
| CL-26 | **PlayerMatchStats** | Estadísticas fijas por jugador en MatchRecord PLAYED; participación real; matches_played derivado del resultado, no de asistencia | PRT | Persistido | — (solo en MatchRecord PLAYED) |
| CL-27 | **EligibilityConstraint** | Restricción de habilitación: estados PENDING/BLOCKED + vigencia `[validFrom, validUntil)` + scope (CLUB/COMPETITION/ENTRY/EVENT) + source (INTERNAL/AHBA/OTHER) + reason (ADMIN/DISCIPLINE/FEDERATION/MEDICAL_CLEARANCE/OTHER); ELIGIBLE derivado = sin restricción activa BLOCKED aplicable; no datos clínicos | PRT | Persistido + Derivado | **SM-ELIGIBILITY-01**: Mixto (persistido + vigencia + derivado) |

## 2.5 COMUNICACIÓN (COM) — 5 clases

| ID | Clase | Responsabilidad | Dominio | Estado | Lifecycle / SM |
|---|---|---|---|---|---|
| CL-28 | **Announcement** | Comunicado oficial: DRAFT → PUBLISHED (audiencia snapshot inmutable: TEAM_SET o club-wide) → ARCHIVED; corrección solo title/body; solo Subcomisión | COM | Persistido | **SM-ANNOUNCEMENT-01**: DRAFT → PUBLISHED → ARCHIVED |
| CL-29 | **AnnouncementTargetTeam** | Asociación Announcement ↔ Team (N:M) para audiencia snapshot inmutable al publicar | COM | Persistido | — (clase de asociación) |
| CL-30 | **Conversation** | 4 tipos: DIRECT (par canónico único, max 1), GROUP (≥2, título, archivable, múltiples), TEAM (0..1 canónica por Team, membresía sync), EVENT (0..1 canónica por Event, membresía sync); solo GROUP tiene SM | COM | Persistido | **SM-CONVERSATION-GROUP-01**: ACTIVE → ARCHIVED (solo GROUP) |
| CL-31 | **ConversationParticipant** | Asociación Person ↔ Conversation (N:M) con joined_at/left_at; acceso temporal autoritativo; ex-participante conserva período; Admin sin participación no lee | COM | Persistido | — (clase de asociación) |
| CL-32 | **Message** | Mensaje en conversación: SENT → EDITED → DELETED (tombstone irreversible, confirmación+motivo); solo mensajes propios; historia expuesta; enviar no notifica; reintento idempotente | COM | Persistido | **SM-MESSAGE-01**: SENT → EDITED → DELETED (terminal) |
| CL-33 | **Notification** | Notificación de 7 tipos; clave lógica única `origin_event_id + recipient + type`; audienceResolvedAt inmutable; deduplicación; UNREAD/READ derivado de read_at | COM | Persistido + Derivado | Derivado (UNREAD/READ por read_at) |

## 2.6 COMPETENCIA (CMP) — 3 clases

| ID | Clase | Responsabilidad | Dominio | Estado | Lifecycle / SM |
|---|---|---|---|---|---|
| CL-34 | **Competition** | Competencia en la que GEI participa: DRAFT→ACTIVE→CLOSED; guard 0 inscripciones activas al cerrar; referencia externa whitelist; solo Subcomisión/Admin | CMP | Persistido | **SM-COMPETITION-01**: DRAFT → ACTIVE → CLOSED (terminal) |
| CL-35 | **CompetitionEntry** | Inscripción de Team (scope TEAM) o Line (scope LINE) en Competition: PENDING→ACTIVE→ENDED; scopes incompatibles → COMPETITION_SCOPE_MISMATCH; uso en Match requiere scope compatible con jornada | CMP | Persistido | **SM-COMPETITIONENTRY-01**: PENDING → ACTIVE → ENDED (terminal) |
| CL-36 | **ExternalReference** | Referencia manual a COMPETITION/COMPETITION_ENTRY/MATCH_EVENT; target whitelist; no afirma sincronización; límite federativo | CMP | Persistido | — |

## 2.7 INSIGHT / INTEGRIDAD (INS) — 1 clase

| ID | Clase | Responsabilidad | Dominio | Estado | Lifecycle / SM |
|---|---|---|---|---|---|
| CL-37 | **AuditEntry** | Entrada append-only: qué cambió, quién, cuándo, motivo (cuando acción lo exige), enlace al objeto; datos sensibles redactados; sin contraseñas/hashes/tokens/cookies/cuerpos | INS | Persistido | Append-only (no SM) |

---

# 3. VALUE OBJECTS (9)

| ID | VO | Propietario | Atributos | Invariantes |
|---|---|---|---|---|
| VO-01 | **Username** | Account | `value: String` (case-insensitive unique, inmutable) | Longitud, unicidad global |
| VO-02 | **PasswordHash** | Account | `hash: String`, `version: Integer`, `credentialVersion: Integer` | Argon2id; versionado |
| VO-03 | **SessionToken** | Account | `token: String` (CSPRNG), `digest: String` (HMAC), `idleExpiry: DateTime`, `absoluteExpiry: DateTime` | Opaco en navegador; digest en BD |
| VO-04 | **ActivationCode** | Account | `codeHash: String` (HMAC), `expiresAt: DateTime`, `attempts: Integer`, `consumedAt: DateTime?` | One-time, 24h, max 5 intentos, max 1 activo |
| VO-05 | **DirectPairKey** | Conversation (DIRECT) | `personId1: UUID`, `personId2: UUID` (ordered canonically) | Partial unique; unordered pair |
| VO-06 | **CoordinationRevision** | Event, EventSeries | `value: Integer` (incremental) | Sube solo en cambios materiales; por ocurrencia en serie |
| VO-07 | **EventType** | Event | `TRAINING \| MATCH \| CLUB_EVENT` | Enum cerrado; discrimina subtipo |
| VO-08 | **RoleType** | RoleAssignment | `PLAYER \| CAPTAIN \| COACH \| SUBCOMMITTEE \| ADMIN` | Enum cerrado; 5 roles |
| VO-09 | **ScopeType** | RoleAssignment, CompetitionEntry | `CLUB \| TEAM \| EVENT \| LINE` | Enum; LINE solo para CompetitionEntry |

---

# 4. ENUMERACIONES DE DOMINIO (27 valores distintos)

| Enum | Valores | Clase(s) asociada(s) |
|---|---|---|
| AccountStatus | PENDING, ACTIVE, DISABLED | Account |
| TeamStatus | DRAFT, ACTIVE, ARCHIVED | Team |
| StructureArchivedStatus | ACTIVE, ARCHIVED | Division, Line, Venue |
| EventState | DRAFT, SCHEDULED, POSTPONED, CANCELLED, IN_PROGRESS, COMPLETED, ABANDONED | Event |
| EventSeriesState | ACTIVE, ENDED | EventSeries |
| AvailabilityValue | YES, MAYBE, NO | Availability (persistido) |
| AvailabilityDerived | NO_RESPONSE, NEEDS_RECONFIRMATION | Availability (derivado) |
| SelectionRevisionState | DRAFT, PUBLISHED | SelectionRevision |
| AttendanceValue | PRESENT, ABSENT, JUSTIFIED | AttendanceEntry (persistido) |
| AttendanceDerived | UNRECORDED | AttendanceEntry (derivado) |
| AttendanceSheetState | OPEN, CLOSED | AttendanceSheet (derivado) |
| MatchRecordState | DRAFT, FINAL | MatchRecord |
| EligibilityState | PENDING, BLOCKED | EligibilityConstraint (persistido) |
| EligibilityDerived | ELIGIBLE | EligibilityConstraint (derivado) |
| AnnouncementState | DRAFT, PUBLISHED, ARCHIVED | Announcement |
| ConversationType | DIRECT, GROUP, TEAM, EVENT | Conversation |
| ConversationState | ACTIVE, ARCHIVED | Conversation (solo GROUP) |
| MessageState | SENT, EDITED, DELETED | Message |
| NotificationType | EVENT_CHANGED, EVENT_POSTPONED, EVENT_RESCHEDULED, EVENT_CANCELLED, EVENT_RESTORED, SELECTION_PUBLISHED, ANNOUNCEMENT_PUBLISHED | Notification |
| CompetitionState | DRAFT, ACTIVE, CLOSED | Competition |
| CompetitionEntryState | PENDING, ACTIVE, ENDED | CompetitionEntry |
| CompetitionEntryScope | TEAM, LINE | CompetitionEntry |
| EligibilityScope | CLUB, COMPETITION, ENTRY, EVENT | EligibilityConstraint |
| EligibilitySource | INTERNAL, AHBA, OTHER | EligibilityConstraint |
| EligibilityReason | ADMIN, DISCIPLINE, FEDERATION, MEDICAL_CLEARANCE, OTHER | EligibilityConstraint |
| RelationshipType | (definir por club: MOTHER, FATHER, GUARDIAN, OTHER) | GuardianRelationship |
| MatchResultType | PLAYED, FORFEIT, ABANDONED | MatchRecord, Event (Match) |

---

# 5. RESUMEN DEL CATÁLOGO

| Categoría | Cantidad |
|---|---|
| Clases canónicas de dominio | **37** (33 deporte + 4 asociación explícita) |
| Value Objects | **9** |
| Enumeraciones (valores distintos) | **27** |
| Conceptos derivados (no clases) | **15** |
| Clases técnicas/infra (fuera de dominio) | **6** |
| Decisiones resueltas | **6/6** |

**Total clases en modelo UML (dominio + asociación): 37**

> Las 4 clases de asociación explícitas (EventTargetTeam, EventTargetPerson, AnnouncementTargetTeam, ConversationParticipant) se cuentan aparte de las 33 canónicas porque son N:M con identidad propia. TeamAssignment, RoleAssignment, GuardianRelationship son canónicas que *también* funcionan como clases de asociación.

---

**Fin del Catálogo Canónico de Clases V1.**

*Este documento congela el conjunto de clases canónicas. E8-03 documentará atributos y tipos para cada una.*