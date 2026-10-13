# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS RELATIONSHIP MATRIX V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-10
**Etapa:** 8 — Modelo de clases completo (E8-05)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline:** `GEI_CLASS_CATALOG_V1.md` + `GEI_CLASS_ATTRIBUTES_V1.md` + `GEI_CLASS_OPERATION_MATRIX_V1.md` + E1–E7 freezes

---

# 1. CONVENCIONES DE NOTACIÓN UML

| Símbolo | Tipo de relación | Descripción |
|---|---|---|
| `──` | **Association** | Relación estructural bidireccional/unidireccional |
| `◆──` | **Composition** | Ownership fuerte; lifecycle del parte ligado al todo; cascada de vida |
| `◇──` | **Aggregation** | Ownership débil; partes pueden existir independientemente; sin cascada |
| `▷──` | **Generalization** | Herencia; substitutabilidad (no usada en dominio deportivo) |
| `··>` | **Dependency** | Uso temporal; no estructural |
| `*--` | **Association Class** | Clase que representa la asociación N:M con identidad propia |

**Multiplicidades:**
- `1` : Exactamente uno
- `0..1` : Cero o uno (opcional)
- `1..*` : Uno o más
- `0..*` : Cero o más
- `n..m` : Rango específico

**Navegabilidad:** `→` indica dirección navegable; `↔` bidireccional; sin flecha = no navegable (o implícita bidireccional en asociación simple).

**Ownership:** `owner` indica quién gestiona el lifecycle de la relación.

---

# 2. RELACIONES DEL MODELO (ÍNDICE)

| ID | Origen | Destino | Tipo UML | Nombre/Rol | Mult. Origen | Mult. Destino | Ownership |
|---|---|---|---|---|---|---|---|
| R-01 | Account | Person | Association | `account` / `person` | 1 | 0..1 | Account |
| R-02 | Membership | Person | Association | `memberships` / `person` | 0..* | 1 | Membership |
| R-03 | TeamAssignment | Person | Association | `teamAssignments` / `person` | 0..* | 1 | TeamAssignment |
| R-04 | TeamAssignment | Team | Association | `teamAssignments` / `team` | 0..* | 1 | TeamAssignment |
| R-05 | RoleAssignment | Person | Association | `roleAssignments` / `person` | 0..* | 1 | RoleAssignment |
| R-06 | RoleAssignment | Team | Association | `roleAssignments` / `team` (scope TEAM/EVENT) | 0..* | 0..1 | RoleAssignment |

| R-08 | GuardianRelationship | Person (guardian) | Association | `guardianRelationships` / `guardianPerson` | 0..* | 1 | GuardianRelationship |
| R-09 | GuardianRelationship | Person (child) | Association | `guardianRelationships` / `childPerson` | 0..* | 1 | GuardianRelationship |

| R-11 | Line | Division | Association | `lines` / `division` | 0..* | 1 | Line |
| R-12 | Team | Season | Association | `teams` / `season` | 0..* | 1 | Team |
| R-13 | Team | Division | Association | `teams` / `division` | 0..* | 1 | Team |
| R-14 | Team | Line | Association | `teams` / `line` | 0..* | 1 | Team |
| R-15 | Event | Venue | Association | `events` / `venue` | 0..* | 0..1 | Event |
| R-16 | Event | EventSeries | Association | `occurrences` / `series` | 0..* | 0..1 | Event |
| R-17 | Event | Team (target) | *Association Class* | `EventTargetTeam` | 0..* | 0..* | EventTargetTeam |
| R-18 | Event | Person (target) | *Association Class* | `EventTargetPerson` | 0..* | 0..* | EventTargetPerson |
| R-19 | Event | EventLogistics | Composition | `logistics` / `event` | 1 | 0..1 | Event |
| R-20 | Event (MATCH) | Match | Composition | `match` / `event` | 1 | 0..1 | Event |
| R-21 | EventSeries | Team (target) | *Association Class* | `EventSeriesTargetTeam` | 0..* | 0..* | EventSeriesTargetTeam |
| R-22 | EventSeries | Person (target) | *Association Class* | `EventSeriesTargetPerson` | 0..* | 0..* | EventSeriesTargetPerson |
| R-23 | EventSeries | EventOccurrenceOverride | Composition | `overrides` / `series` | 1 | 0..* | EventSeries |
| R-24 | Jornada | Match | *Association Class* | `JornadaMatch` | 1 | 0..* | JornadaMatch |
| R-25 | Availability | Event | Association | `availabilities` / `event` | 0..* | 1 | Availability |
| R-26 | Availability | Person (subject) | Association | `availabilities` / `person` | 0..* | 1 | Availability |
| R-27 | Availability | Person (respondedBy) | Association | `respondedAvailabilities` / `respondedBy` | 0..* | 1 | Availability |
| R-28 | Selection | Event (MATCH) | Association | `selection` / `match` | 1 | 0..1 | Selection |
| R-29 | Selection | SelectionRevision | Composition | `revisions` / `selection` | 1 | 0..* | Selection |
| R-30 | SelectionRevision | SelectionEntry | Composition | `entries` / `revision` | 1 | 0..* | SelectionRevision |
| R-31 | AttendanceSheet | Event | Association | `attendanceSheet` / `event` | 1 | 0..1 | AttendanceSheet |
| R-32 | AttendanceEntry | AttendanceSheet | Composition | `entries` / `sheet` | 1 | 0..* | AttendanceSheet |
| R-33 | AttendanceEntry | Person | Association | `attendanceEntries` / `person` | 0..* | 1 | AttendanceEntry |
| R-34 | MatchRecord | Event (MATCH) | Association | `matchRecord` / `match` | 1 | 0..1 | MatchRecord |
| R-35 | MatchRecord | PlayerMatchStats | Composition | `playerStats` / `matchRecord` | 1 | 0..* | MatchRecord |
| R-36 | PlayerMatchStats | Person | Association | `playerMatchStats` / `person` | 0..* | 1 | PlayerMatchStats |
| R-37 | EligibilityConstraint | Person | Association | `eligibilityConstraints` / `person` | 0..* | 1 | EligibilityConstraint |
| R-38 | EligibilityConstraint | Competition | Association | `eligibilityConstraints` / `competition` (scope COMPETITION) | 0..* | 0..1 | EligibilityConstraint |
| R-39 | EligibilityConstraint | CompetitionEntry | Association | `eligibilityConstraints` / `competitionEntry` (scope ENTRY) | 0..* | 0..1 | EligibilityConstraint |
| R-40 | EligibilityConstraint | Event | Association | `eligibilityConstraints` / `event` (scope EVENT) | 0..* | 0..1 | EligibilityConstraint |
| R-41 | Announcement | Team (audience) | *Association Class* | `AnnouncementTargetTeam` | 0..* | 0..* | AnnouncementTargetTeam |
| R-42 | Announcement | Team (snapshot) | Dependency | `audienceSnapshot` (inmutable al publicar) | 1 | 0..* | Announcement |
| R-43 | Conversation | Person (participant) | *Association Class* | `ConversationParticipant` | 0..* | 0..* | ConversationParticipant |
| R-44 | Conversation (TEAM) | Team | Association | `canonicalConversation` / `team` | 0..1 | 1 | Conversation |
| R-45 | Conversation (EVENT) | Event | Association | `canonicalConversation` / `event` | 0..1 | 1 | Conversation |
| R-46 | Message | Conversation | Association | `messages` / `conversation` | 0..* | 1 | Message |
| R-47 | Message | Person (author) | Association | `authoredMessages` / `author` | 0..* | 1 | Message |
| R-48 | Notification | Person (recipient) | Association | `notifications` / `recipient` | 0..* | 1 | Notification |
| R-49 | Notification | Event (origin) | Association | `notifications` / `originEvent` | 0..* | 0..1 | Notification |
| R-50 | Competition | Season | Association | `competitions` / `season` | 0..* | 1 | Competition |
| R-51 | CompetitionEntry | Competition | Association | `entries` / `competition` | 0..* | 1 | CompetitionEntry |
| R-52 | CompetitionEntry (TEAM) | Team | Association | `entries` / `team` (scope TEAM) | 0..* | 0..1 | CompetitionEntry |
| R-53 | CompetitionEntry (LINE) | Line | Association | `entries` / `line` (scope LINE) | 0..* | 0..1 | CompetitionEntry |
| R-54 | CompetitionEntry (LINE) | Season | Association | `entries` / `season` (scope LINE) | 0..* | 1 | CompetitionEntry |
| R-55 | ExternalReference | Competition | Dependency | `references` / `competition` | 0..* | 0..1 | ExternalReference |
| R-56 | ExternalReference | CompetitionEntry | Dependency | `references` / `competitionEntry` | 0..* | 0..1 | ExternalReference |
| R-57 | ExternalReference | Event (MATCH) | Dependency | `references` / `matchEvent` | 0..* | 0..1 | ExternalReference |
| R-58 | AuditEntry | Person (actor) | Association | `auditEntries` / `actor` | 0..* | 1 | AuditEntry |
| R-59 | Person | Person (reflexiva) | *Association Class* | `GuardianRelationship` | 0..* | 0..* | GuardianRelationship |

---

# 3. DETALLE DE RELACIONES CRÍTICAS

## 3.1 IDENTIDAD Y PERSONAS

### R-01: Account ↔ Person (1:1, Composition-like)
| Campo | Valor |
|---|---|
| **Tipo** | Association (semánticamente Composition: Account no existe sin Person) |
| **Navegabilidad** | `Account → Person` (sí); `Person → Account` (0..1, sí) |
| **Mult. Account** | `1` (una cuenta por persona) |
| **Mult. Person** | `0..1` (persona puede no tener cuenta) |
| **Ownership** | Account (creada por Admin para Person) |
| **Invariantes** | `Account.personId` unique (1:1); `Account.username` unique global; Account status PENDING/ACTIVE/DISABLED independiente de Person |
| **Fuente** | REQ-PPL-003, PT §25, SM-ACCOUNT-01 |

### R-02: Membership ↔ Person (1:N, Temporal)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | Bidireccional |
| **Mult. Membership** | `0..*` (historial de períodos) |
| **Mult. Person** | `1` |
| **Ownership** | Membership |
| **Invariantes** | Vigencia `[validFrom, validUntil)`; TeamAssignment/RoleAssignment internos requieren Membership vigente; finalizar con dependencias → rechazado |
| **Fuente** | REQ-PPL-004, PT §17, Temporal model |

### R-03/R-04: TeamAssignment ↔ Person + Team (N:M con clase propia)
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (`TeamAssignment` es clase canónica) |
| **Navegabilidad** | `TeamAssignment → Person` (sí); `TeamAssignment → Team` (sí); `Person → TeamAssignment[*]` (sí); `Team → TeamAssignment[*]` (sí) |
| **Mult. Person** | `0..*` (historial de afiliaciones) |
| **Mult. Team** | `0..*` (plantilla histórica) |
| **Ownership** | TeamAssignment |
| **Invariantes** | Solo para PLAYER (RoleAssignment PLAYER atómico con AssignPlayerToTeam); vigencia temporal; distinta de Membership y RoleAssignment; Coach usa RoleAssignment |
| **Fuente** | REQ-PPL-005/007, PT §17, UC-PPL-06/07/08 |

### R-05/R-06: RoleAssignment ↔ Person + Team (N:M con clase propia)
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (`RoleAssignment` es clase canónica) |
| **Navegabilidad** | `RoleAssignment → Person` (sí); `RoleAssignment → Team` (scope TEAM/EVENT); `Person → RoleAssignment[*]` (sí) |
| **Mult. Person** | `0..*` (multi-rol = unión de assignments vigentes) |
| **Mult. Team** | `0..*` (roles asignados) |
| **Ownership** | RoleAssignment |
| **Invariantes** | 5 roles × scopes válidos (tabla PT §5: CLUB, TEAM, EVENT); combinación inválida → `INVALID_ROLE_SCOPE`; `temporalExclusions` dentro de vigencia; expirada no computa |
| **Fuente** | REQ-PPL-006/009/010, PT §5, UC-PPL-09/10 |

### R-08/R-09: GuardianRelationship ↔ Person (reflexiva N:M con clase propia)
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (`GuardianRelationship` es clase canónica) — **Reflexiva** |
| **Navegabilidad** | `GuardianRelationship → guardianPerson` (sí); `→ childPerson` (sí); `Person → guardianRelationships[*]` (sí, ambas direcciones) |
| **Mult. Guardian** | `0..*` (puede ser guardian de varios menores) |
| **Mult. Child** | `0..*` (puede tener varios guardianes) |
| **Ownership** | GuardianRelationship (creada/finalizada por ADMIN) |
| **Invariantes** | Individual por menor; dos flags independientes `canViewChildInfo`, `canRespondAvailability`; no requiere Membership; no otorga rol deportivo; finalizada deja de conceder acceso |
| **Fuente** | REQ-PPL-008/009/011/012, PT §5/§17/§20, UC-PPL-11/12/13/14 |

---

## 3.2 ESTRUCTURA DEL CLUB

### R-11/R-12/R-13/R-14: Division/Line/Team (Jerarquía de identidad)
| Campo | Valor |
|---|---|
| **Tipo** | Association (Composition semántica: Team no existe sin Season+Division+Line) |
| **Navegabilidad** | `Team → Season/Division/Line` (sí); inversa navegable |
| **Mult. Division→Line** | `1 — 0..*` |
| **Mult. Season→Team** | `1 — 0..*` |
| **Mult. Division→Team** | `1 — 0..*` |
| **Mult. Line→Team** | `1 — 0..*` |
| **Ownership** | Team (identidad = combinación única) |
| **Invariantes** | **Team = Season + Division + Line (única inmutable)**; Division/Line: renombrar con Teams activos → rechazado; archivar con dependencias → rechazado nombrando dependencia; Subcomisión denegada |
| **Fuente** | REQ-STR-001/002/003/004/006/011, PT §19/§25, SM-TEAM-01/DIVISION-01/LINE-01 |

### R-15: Event ↔ Venue (N:1, opcional)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Event → Venue` (sí); `Venue → Event[*]` (sí) |
| **Mult. Event** | `0..1` (venue opcional) |
| **Mult. Venue** | `0..*` |
| **Ownership** | Event (referencia) |
| **Invariantes** | **Regla A/B**: corregir Venue metadata (Regla A) NO reprograma Event; cambiar venue de Event (Regla B) SÍ es cambio material completo; archivar Venue con Events activos → rechazado |
| **Fuente** | REQ-STR-011/012, REQ-EVT-011, PT §11, UC-STR-14, UC-EVT-04 |

---

## 3.3 EVENTOS

### R-16: Event ↔ EventSeries (N:1, opcional)
| Campo | Valor |
|---|---|
| **Tipo** | Association (Composition semántica: ocurrencia no existe sin serie) |
| **Navegabilidad** | `Event → EventSeries` (sí); `EventSeries → Event[*]` (sí, occurrences) |
| **Mult. Event** | `0..1` (si es parte de serie) |
| **Mult. EventSeries** | `0..*` (hasta 366 por comando) |
| **Ownership** | EventSeries (genera ocurrencias) |
| **Invariantes** | `occurrenceIndex` identifica posición; `EventOccurrenceOverride` para anulaciones; coordinationRevision por ocurrencia; serie ACTIVE→ENDED terminal |
| **Fuente** | REQ-EVT-014/015/016, UC-EVT-13/14, SM-EVENTSERIES-01 |

### R-17: Event ↔ Team (Target) — Association Class `EventTargetTeam`
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (N:M con identidad) |
| **Clase** | `EventTargetTeam` (CL-17) |
| **Navegabilidad** | `EventTargetTeam → Event` (sí); `→ Team` (sí); `Event → targetTeams[*]` (sí); `Team → targetEvents[*]` (sí) |
| **Mult. Event** | `0..*` (plurales independientes por tipo) |
| **Mult. Team** | `0..*` |
| **Ownership** | EventTargetTeam |
| **Invariantes** | `clubWideTarget=false` para MATCH/TRAINING; MATCH: exactamente 1 team target; TRAINING: ≥1 team O person target; CLUB_EVENT: clubWide ∨ directed |
| **Fuente** | REQ-EVT-002/003/004/005, PT §10, UC-EVT-01/02/03 |

### R-18: Event ↔ Person (Target) — Association Class `EventTargetPerson`
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (N:M con identidad) |
| **Clase** | `EventTargetPerson` (CL-18) |
| **Navegabilidad** | Similar a R-17 |
| **Mult. Event** | `0..*` |
| **Mult. Person** | `0..*` |
| **Ownership** | EventTargetPerson |
| **Invariantes** | Destinatarios personales; MATCH: 0 person targets; TRAINING: ≥1 team O person; CLUB_EVENT: clubWide ∨ directed |
| **Fuente** | REQ-EVT-002/003/004/005, PT §10 |

### R-19: Event ◆── EventLogistics (Composition 1:0..1)
| Campo | Valor |
|---|---|
| **Tipo** | **Composition** (EventLogistics no existe sin Event; lifecycle ligado) |
| **Navegabilidad** | `Event → logistics` (sí); `EventLogistics → event` (sí) |
| **Mult. Event** | `1` |
| **Mult. EventLogistics** | `0..1` |
| **Ownership** | **Event** (todo) |
| **Invariantes** | Opcional por Event; actualizable por CAPTAIN/COACH/SUBCOMMITTEE según scope; identidad propia, auditable |
| **Fuente** | REQ-EVT-019, UC-EVT-16, PT §11 |

### R-20: Event (MATCH) ◆── Match (Composition 1:0..1)
| Campo | Valor |
|---|---|
| **Tipo** | **Composition** (Match row no existe sin Event type=MATCH) |
| **Navegabilidad** | `Event → match` (sí, si type=MATCH); `Match → event` (sí, 1:1) |
| **Mult. Event** | `1` (si MATCH) |
| **Mult. Match** | `0..1` |
| **Ownership** | **Event** (todo) |
| **Invariantes** | Event.type=MATCH ⇔ Match row existe; opponent obligatorio; concreteTeam inmutable si Event.SCHEDULED |
| **Fuente** | PT §10, REQ-EVT-003/006, UC-EVT-02 |

### R-21/R-22: EventSeries ↔ Team/Person (Target) — Association Classes
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (igual que R-17/R-18 pero para serie) |
| **Clases** | `EventSeriesTargetTeam`, `EventSeriesTargetPerson` |
| **Invariantes** | Destinatarios de la serie; se heredan por ocurrencias salvo override |
| **Fuente** | REQ-EVT-014/015, PT §25 (tablas 17,18) |

### R-23: EventSeries ◆── EventOccurrenceOverride (Composition 1:N)
| Campo | Valor |
|---|---|
| **Tipo** | **Composition** (Override no existe sin Series) |
| **Navegabilidad** | `EventSeries → overrides[*]` (sí); `Override → series` (sí) |
| **Mult. Series** | `1` |
| **Mult. Override** | `0..*` |
| **Ownership** | **EventSeries** |
| **Invariantes** | Permite alcance "solo esta" en ediciones; `occurrenceIndex` identifica cuál |
| **Fuente** | REQ-EVT-015, UC-EVT-04, PT §25 (tabla 23) |

### R-24: Jornada ↔ Match — Association Class `JornadaMatch`
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (N:M con identidad; Jornada agrupa, no duplica lifecycle) |
| **Clase** | `JornadaMatch` (implícita en tabla `jornada_matches`) |
| **Navegabilidad** | `Jornada → matches[*]` (sí); `Match → jornada[0..1]` (sí) |
| **Mult. Jornada** | `1` |
| **Mult. Match** | `0..1` (un match ≤1 jornada) |
| **Ownership** | JornadaMatch |
| **Invariantes** | Bulk atómico ≤100; season match = season jornada; competition_id opcional → usa CompetitionEntry de esa competition; no duplica lifecycle de Matches |
| **Fuente** | REQ-EVT-018/024, PT §16, UC-EVT-15 |

---

## 3.4 PARTICIPACIÓN

### R-25/R-26/R-27: Availability ↔ Event + Person (sujeto) + Person (respondedBy)
| Campo | Valor |
|---|---|
| **Tipo** | Association (Availability es clase canónica, no association class simple) |
| **Navegabilidad** | `Availability → Event` (sí); `→ person` (sujeto, sí); `→ respondedBy` (sí); inversas navegables |
| **Mult. Event** | `1` (availability pertenece a un Event SCHEDULED) |
| **Mult. Person (sujeto)** | `1` |
| **Mult. Person (respondedBy)** | `1` (jugadora o guardián) |
| **Ownership** | Availability |
| **Invariantes** | Solo Event SCHEDULED; POSTPONED conserva, no acepta nuevas; valores persistidos YES/MAYBE/NO; derivados NO_RESPONSE (sin fila), NEEDS_RECONFIRMATION (resp. previa + coordinationRevision mayor); distinta de Selection/Attendance |
| **Fuente** | REQ-PRT-001/002/003/004, UC-PRT-01, SM-AVAILABILITY-01 |

### R-28: Selection ↔ Event (MATCH) (1:0..1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Selection → match` (sí); `Event → selection[0..1]` (sí, solo MATCH) |
| **Mult. Selection** | `1` |
| **Mult. Event** | `0..1` |
| **Ownership** | Selection |
| **Invariantes** | Solo para Event type=MATCH; publication exige SCHEDULED; Selection = contenedor (borrador + historial revisiones) |
| **Fuente** | REQ-PRT-005, UC-PRT-02/03, PT §12 |

### R-29: Selection ◆── SelectionRevision (Composition 1:N)
| Campo | Valor |
|---|---|
| **Tipo** | **Composition** (Revision no existe sin Selection contenedor) |
| **Navegabilidad** | `Selection → revisions[*]` (sí); `Revision → selection` (sí) |
| **Mult. Selection** | `1` |
| **Mult. Revision** | `0..*` (borrador actual + historial PUBLISHED) |
| **Ownership** | **Selection** |
| **Invariantes** | Borrador actual mutable (DRAFT, autosave) + historial PUBLISHED inmutables; republicar = nueva revisión; no se reescribe |
| **Fuente** | REQ-PRT-005/006/008, UC-PRT-02/03, SM-SELECTIONREV-01 |

### R-30: SelectionRevision ◆── SelectionEntry (Composition 1:N)
| Campo | Valor |
|---|---|
| **Tipo** | **Composition** (Entry no existe sin Revision) |
| **Navegabilidad** | `Revision → entries[*]` (sí); `Entry → revision` (sí) |
| **Mult. Revision** | `1` |
| **Mult. Entry** | `0..*` |
| **Ownership** | **SelectionRevision** |
| **Invariantes** | Entrada individual: persona + role (selected/alternate) + order; inmutable si revision PUBLISHED |
| **Fuente** | REQ-PRT-005, UC-PRT-02/03, PT §25 (tabla 30) |

### R-31: AttendanceSheet ↔ Event (1:0..1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `AttendanceSheet → event` (sí); `Event → attendanceSheet[0..1]` (sí, si TRAINING/MATCH) |
| **Mult. Sheet** | `1` |
| **Mult. Event** | `0..1` |
| **Ownership** | AttendanceSheet |
| **Invariantes** | Solo Event type ∈ {TRAINING, MATCH}; state OPEN/CLOSED derivado de `closedAt`; no reapertura inventada |
| **Fuente** | REQ-PRT-009/011, UC-PRT-05/06, SM-ATTENDANCEENTRY-01 |

### R-32: AttendanceSheet ◆── AttendanceEntry (Composition 1:N)
| Campo | Valor |
|---|---|
| **Tipo** | **Composition** (Entry no existe sin Sheet) |
| **Navegabilidad** | `Sheet → entries[*]` (sí); `Entry → sheet` (sí) |
| **Mult. Sheet** | `1` |
| **Mult. Entry** | `0..*` |
| **Ownership** | **AttendanceSheet** |
| **Invariantes** | Valores PRESENT/ABSENT/JUSTIFIED + UNRECORRED derivado (sin fila); corrección auditada con motivo; closedAt bloquea marcaje directo |
| **Fuente** | REQ-PRT-009/010/011/012, UC-PRT-05/06/07, SM-ATTENDANCEENTRY-01 |

### R-33: AttendanceEntry ↔ Person (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `AttendanceEntry → person` (sí); `Person → attendanceEntries[*]` (sí) |
| **Mult. Entry** | `1` |
| **Mult. Person** | `0..*` |
| **Ownership** | AttendanceEntry |
| **Invariantes** | Asistencia ≠ participación en partido (matches_played derivado de resultado) |
| **Fuente** | REQ-PRT-016, PT §15 |

### R-34: MatchRecord ↔ Event (MATCH) (1:0..1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `MatchRecord → match` (sí); `Event → matchRecord[0..1]` (sí, si MATCH) |
| **Mult. MatchRecord** | `1` |
| **Mult. Event** | `0..1` |
| **Ownership** | MatchRecord |
| **Invariantes** | DRAFT → FINAL; compatibilidad: PLAYED/FORFEIT → Event.COMPLETED; ABANDONED → Event.ABANDONED; corrección explícita separada (no transición inversa) |
| **Fuente** | REQ-PRT-013/014/015, UC-PRT-08/09/10, SM-MATCHRECORD-01 |

### R-35: MatchRecord ◆── PlayerMatchStats (Composition 1:N)
| Campo | Valor |
|---|---|
| **Tipo** | **Composition** (Stats no existen sin MatchRecord) |
| **Navegabilidad** | `MatchRecord → playerStats[*]` (sí); `Stats → matchRecord` (sí) |
| **Mult. MatchRecord** | `1` |
| **Mult. Stats** | `0..*` |
| **Ownership** | **MatchRecord** |
| **Invariantes** | Solo si MatchRecord.resultType=PLAYED; participación real; matches_played derivado del resultado |
| **Fuente** | REQ-PRT-016, UC-PRT-11, PT §15 |

### R-36: PlayerMatchStats ↔ Person (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Stats → person` (sí); `Person → playerMatchStats[*]` (sí) |
| **Mult. Stats** | `1` |
| **Mult. Person** | `0..*` |
| **Ownership** | PlayerMatchStats |
| **Fuente** | REQ-PRT-016, PT §25 (tabla 40) |

### R-37/R-38/R-39/R-40: EligibilityConstraint ↔ Person + Competition/Entry/Event (N:1 c/u)
| Campo | Valor |
|---|---|
| **Tipo** | Association (Constraint es clase canónica con scope polymorphico) |
| **Navegabilidad** | `Constraint → person` (sí); `→ competition/entry/event` (según scope); inversas navegables |
| **Mult. Person** | `0..*` (historial de constraints) |
| **Mult. Scope ref** | `0..1` (cada constraint tiene un scopeRef) |
| **Ownership** | EligibilityConstraint |
| **Invariantes** | Scopes: CLUB (sin scopeRef), COMPETITION, ENTRY, EVENT; sources: INTERNAL/AHBA/OTHER; reasons: ADMIN/DISCIPLINE/FEDERATION/MEDICAL_CLEARANCE/OTHER; ELIGIBLE derivado = sin constraint BLOCKED activa aplicable; no datos clínicos; mutación auditada |
| **Fuente** | REQ-PRT-017, REQ-CMP-007/008, PT §13, UC-PRT-12/13, SM-ELIGIBILITY-01 |

---

## 3.5 COMUNICACIÓN

### R-41: Announcement ↔ Team (Audience) — Association Class `AnnouncementTargetTeam`
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (N:M con identidad para snapshot) |
| **Clase** | `AnnouncementTargetTeam` (CL-29) |
| **Navegabilidad** | `AnnouncementTargetTeam → Announcement` (sí); `→ Team` (sí); `Announcement → targetTeams[*]` (sí) |
| **Mult. Announcement** | `0..*` (TEAM_SET) |
| **Mult. Team** | `0..*` |
| **Ownership** | AnnouncementTargetTeam |
| **Invariantes** | **Audiencia snapshot inmutable al publicar** (copia inmutable); audiencia incorrecta → Announcement nuevo; solo Subcomisión |
| **Fuente** | REQ-COM-002/003/004, UC-COM-01/02/03, SM-ANNOUNCEMENT-01 |

### R-42: Announcement ..> Team (Dependency: audienceSnapshot)
| Campo | Valor |
|---|---|
| **Tipo** | Dependency (uso temporal: snapshot inmutable al publicar) |
| **Descripción** | `audienceSnapshot` es copia inmutable de targetTeams al momento de publish; no navegable estructuralmente |
| **Fuente** | REQ-COM-003, SM-ANNOUNCEMENT-01 |

### R-43: Conversation ↔ Person — Association Class `ConversationParticipant`
| Campo | Valor |
|---|---|
| **Tipo** | Association Class (N:M con joined_at/left_at) |
| **Clase** | `ConversationParticipant` (CL-31) |
| **Navegabilidad** | `ConversationParticipant → Conversation` (sí); `→ Person` (sí); `Conversation → participants[*]` (sí); `Person → conversations[*]` (sí) |
| **Mult. Conversation** | `0..*` (DIRECT: max 1 por par; GROUP: múltiples; TEAM: 0..1; EVENT: 0..1) |
| **Mult. Person** | `0..*` |
| **Ownership** | ConversationParticipant |
| **Invariantes** | Acceso temporal: `joinedAt ≤ atDateTime < (leftAt ∨ ∞)`; sin historia anterior a joinedAt; ex-participante conserva período; Admin sin participación no lee; DIRECT: par canónico único (directPairKey partial unique) |
| **Fuente** | REQ-COM-006/007/008/011, UC-COM-06/07/08/12, SM-CONVERSATION-GROUP-01 |

### R-44: Conversation (TEAM) ↔ Team (1:0..1, canónica)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Conversation → team` (sí, si type=TEAM); `Team → canonicalConversation[0..1]` (sí) |
| **Mult. Conversation** | `0..1` |
| **Mult. Team** | `1` |
| **Ownership** | Conversation (server-side sync membresía) |
| **Invariantes** | Título derivado del Team real; membresía sincronizada server-side |
| **Fuente** | REQ-COM-008, UC-COM-08 |

### R-45: Conversation (EVENT) ↔ Event (1:0..1, canónica)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Conversation → event` (sí, si type=EVENT); `Event → canonicalConversation[0..1]` (sí) |
| **Mult. Conversation** | `0..1` |
| **Mult. Event** | `1` |
| **Ownership** | Conversation (server-side sync membresía) |
| **Invariantes** | Título derivado del Event real (refleja dato vigente); membresía sincronizada server-side |
| **Fuente** | REQ-COM-008, UC-COM-08 |

### R-46: Message ↔ Conversation (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association (Composition semántica: mensaje no existe sin conversación) |
| **Navegabilidad** | `Message → conversation` (sí); `Conversation → messages[*]` (sí) |
| **Mult. Message** | `1` |
| **Mult. Conversation** | `0..*` |
| **Ownership** | Conversation (todo) |
| **Invariantes** | Solo mensajes propios editable/borrable; tombstone irreversible; enviar no notifica |
| **Fuente** | REQ-COM-009/010/011, UC-COM-09/10/11, SM-MESSAGE-01 |

### R-47: Message ↔ Person (Author) (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Message → author` (sí); `Person → authoredMessages[*]` (sí) |
| **Mult. Message** | `1` |
| **Mult. Person** | `0..*` |
| **Ownership** | Message |
| **Fuente** | REQ-COM-009/010, PT §25 |

### R-48: Notification ↔ Person (Recipient) (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Notification → recipient` (sí); `Person → notifications[*]` (sí) |
| **Mult. Notification** | `1` |
| **Mult. Person** | `0..*` |
| **Ownership** | Notification |
| **Invariantes** | Clave lógica única `originEventId + recipient + type`; 7 tipos; audienceResolvedAt inmutable; deduplicación |
| **Fuente** | REQ-COM-014/015/016/018, UC-COM-13/14, PT §22/§58 |

### R-49: Notification ↔ Event (Origin) (N:0..1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Notification → originEvent` (sí, si EVENT_*); `Event → notifications[*]` (sí) |
| **Mult. Notification** | `0..1` |
| **Mult. Event** | `0..*` |
| **Ownership** | Notification |
| **Fuente** | PT §22, PT §58 |

---

## 3.6 COMPETENCIA

### R-50: Competition ↔ Season (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `Competition → season` (sí); `Season → competitions[*]` (sí) |
| **Mult. Competition** | `1` |
| **Mult. Season** | `0..*` |
| **Ownership** | Competition |
| **Fuente** | REQ-CMP-001, PT §25 |

### R-51: CompetitionEntry ↔ Competition (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `CompetitionEntry → competition` (sí); `Competition → entries[*]` (sí) |
| **Mult. Entry** | `1` |
| **Mult. Competition** | `0..*` |
| **Ownership** | CompetitionEntry |
| **Invariantes** | Lifecycle PENDING→ACTIVE→ENDED; cerrar competition requiere 0 entries ACTIVE |
| **Fuente** | REQ-CMP-001/002/003, UC-CMP-01/02/03, SM-COMPETITION-01/ENTRY-01 |

### R-52: CompetitionEntry (TEAM) ↔ Team (N:0..1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `CompetitionEntry → team` (sí, si scope=TEAM); `Team → competitionEntries[*]` (sí) |
| **Mult. Entry** | `0..1` |
| **Mult. Team** | `0..*` |
| **Ownership** | CompetitionEntry |
| **Invariantes** | Scope TEAM identifica el team; unique `competitionId+teamId` |
| **Fuente** | REQ-CMP-004/005, PT §4/§16 |

### R-53/R-54: CompetitionEntry (LINE) ↔ Line + Season (N:0..1 c/u)
| Campo | Valor |
|---|---|
| **Tipo** | Association (scope LINE identifica división+línea+temporada) |
| **Navegabilidad** | `Entry → line` (sí); `→ season` (sí); inversas navegables |
| **Mult. Entry** | `0..1` c/u |
| **Mult. Line/Season** | `0..*` |
| **Ownership** | CompetitionEntry |
| **Invariantes** | Scope LINE: `seasonId == match.team.seasonId ∧ lineId == match.team.lineId`; TEAM y LINE incompatibles → `COMPETITION_SCOPE_MISMATCH` |
| **Fuente** | REQ-CMP-004/005, PT §4/§16 |

### R-55/R-56/R-57: ExternalReference → Competition/Entry/Match (Dependency)
| Campo | Valor |
|---|---|
| **Tipo** | **Dependency** (referencia manual, no estructural) |
| **Navegabilidad** | `ExternalReference → target` (sí, según targetType); inversa NO navegable |
| **Target whitelist** | COMPETITION / COMPETITION_ENTRY / MATCH_EVENT |
| **Invariantes** | No afirma sincronización; límite federativo: referencia es referencia |
| **Fuente** | REQ-CMP-006/007, UC-CMP-08/09 |

---

## 3.7 INSIGHT / INTEGRIDAD

### R-58: AuditEntry ↔ Person (Actor) (N:1)
| Campo | Valor |
|---|---|
| **Tipo** | Association |
| **Navegabilidad** | `AuditEntry → actor` (sí); `Person → auditEntries[*]` (sí, solo Admin) |
| **Mult. AuditEntry** | `1` |
| **Mult. Person** | `0..*` |
| **Ownership** | AuditEntry |
| **Invariantes** | Append-only; qué cambió, quién, cuándo, motivo, enlace al objeto; datos sensibles redactados; sin contraseñas/hashes/tokens/cookies/cuerpos; solo Admin consulta |
| **Fuente** | REQ-INS-008/009/010, UC-INS-05, PT §25 (tabla 41) |

---

# 4. RESUMEN DE RELACIONES

| Tipo UML | Cantidad | Notas |
|---|---|---|
| **Association** | 26 | Estructurales bidireccionales/unidireccionales |
| **Composition** | 8 | Ownership fuerte: Event◆Logistics, Event◆Match, Selection◆Revision, Revision◆Entry, Sheet◆Entry, MatchRecord◆Stats, Series◆Override, Conversation◆Message |
| **Aggregation** | 0 | No hay agregaciones puras en dominio deportivo (todo es Composition o Association) |
| **Generalization** | 0 | **No hay herencia UML en dominio deportivo** (Training/Match/ClubEvent = discriminación por tipo; Conversation types = enum) |
| **Dependency** | 4 | ExternalReference, Announcement.audienceSnapshot, Notification.originEvent |
| **Association Class** | 10 | EventTargetTeam/Person, EventSeriesTargetTeam/Person, AnnouncementTargetTeam, ConversationParticipant, JornadaMatch, GuardianRelationship (reflexiva), TeamAssignment, RoleAssignment, CompetitionEntry (scope) |
| **Reflexive Association** | 1 | GuardianRelationship (Person ↔ Person) |

**Total relaciones documentadas: 57**

---

# 5. INVARIANTES CRÍTICAS TRANSVERSALES (VALIDACIÓN E8)

| Invariante | Relaciones afectadas | Verificación |
|---|---|---|
| **Person ≠ Account** | R-01 | 1:1 separadas; Account status independiente |
| **Membership ≠ TeamAssignment ≠ RoleAssignment** | R-02, R-03, R-05 | Vigencias temporales independientes; propósitos distintos |
| **GuardianRelationship ≠ RoleAssignment** | R-08/R-09 vs R-05 | Delegación (no rol); flags independientes; no requiere Membership |
| **Roles coexistentes = unión** | R-05 | Multi-rol = unión de RoleAssignment vigentes; no herencia |
| **ADMIN ≠ autoridad deportiva** | R-05 (ADMIN scope CLUB) | RoleAssignment ADMIN scope CLUB no concede TEAM/EVENT |
| **CAPTAIN authority propia** | R-05 (CAPTAIN scope TEAM) | Solo logística TEAM; no hereda COACH |
| **Team identity = Season+Division+Line** | R-12/R-13/R-14 | Combinación única inmutable; nombre derivado |
| **Event root + subtipos por discriminación** | R-19/R-20 | Event.type discrimina; Match row composition solo si MATCH |
| **EventSeries ≠ ocurrencias** | R-16 | Serie contenedor; ocurrencias Events independientes con coordinationRevision propio |
| **Match ↔ Team concreto** | R-17, R-20 | MATCH: exactamente 1 team target inmutable si SCHEDULED |
| **Jornada agrupa, no duplica** | R-24 | Match ≤1 Jornada; bulk atómico ≤100 |
| **Availability ≠ Selection ≠ Attendance** | R-25, R-28, R-31 | Cuatro conceptos independientes (REQ-PRT-018) |
| **SelectionRevision PUBLISHED inmutable** | R-29 | No se reescribe; republicar = nueva revisión |
| **AttendanceSheet CLOSED sin reapertura** | R-31/R-32 | closedAt inmutable; corrección auditada separada |
| **MatchRecord FINAL + corrección histórica** | R-34/R-35 | FINAL terminal; corrección ≠ transición inversa |
| **EligibilityConstraint = fuente de elegibilidad** | R-37-R-40 | ELIGIBLE derivado; no se infiere de Availability |
| **Announcement audience snapshot inmutable** | R-41/R-42 | Publicar fija audiencia; corrección no la cambia |
| **CompetitionEntry TEAM vs LINE = scope de dato** | R-52/R-53 | No estados; incompatibles → COMPETITION_SCOPE_MISMATCH |
| **History/Audit ≠ event sourcing** | R-58 | Append-only AuditEntry; History = proyección derivada |
| **PII field authority** | R-01, R-08, R-43, R-58 | Campo no autorizado no existe en respuesta |
| **States E6 compatibles con E8** | Todas | Cada estado en SM tiene atributos/operaciones correspondientes |

---

**Fin de Matriz de Relaciones V1.**

*Este documento congela todas las relaciones UML con multiplicidades, navegabilidad, ownership e invariantes. E8-06 generará diagramas Draw.io.*