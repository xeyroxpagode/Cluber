# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS ATTRIBUTES AND TYPES V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-10
**Etapa:** 8 — Modelo de clases completo (E8-03)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline:** `GEI_CLASS_CATALOG_V1.md` + E1–E7 freezes

---

# 1. CONVENCIONES DE NOTACIÓN

| Convención | Descripción |
|---|---|
| `+` | Público (visible fuera del objeto) |
| `-` | Privado (interno) |
| `#` | Protegido (subclases — no aplica, no hay herencia) |
| `/` | Derivado (calculado, no persistido) |
| `{id}` | Identificador único (PK) |
| `{pk}` | Parte de clave primaria compuesta |
| `{fk}` | Clave foránea |
| `{unique}` | Unicidad (simple o compuesta) |
| `{temporal}` | Vigencia `[valid_from, valid_until)` |
| `*` | Multiplicidad (ver matriz de relaciones) |
| **Tipos UML**: `String`, `Boolean`, `Integer`, `Decimal`, `Date`, `DateTime`, `UUID`, `Enum<...>` |

**Regla:** No inventar precisión SQL (`varchar(255)`, `numeric(12,2)`). Usar tipos de dominio.
**Regla:** Distinguir claramente atributos **almacenados** (persistidos) de **derivados** (calculados).
**Regla:** No inventar `createdBy`, `updatedAt`, `deletedAt`, `status` en todas las clases por costumbre. Solo los respaldados funcionalmente.

---

# 2. ATRIBUTOS POR CLASE CANÓNICA

## 2.1 PERSON (CL-01)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §17, §25 |
| + | firstName | String | ✓ | | Not empty | REQ-PPL-001 |
| + | lastName | String | ✓ | | Not empty | REQ-PPL-001 |
| + | dni | String | | | Partial unique cuando no NULL; formato libre | REQ-PPL-001, PT §17 |
| + | birthDate | Date | | | Nullable | REQ-PPL-001, PT §17 |
| + | phone | String | | | Nullable; E.164 recomendado | REQ-PPL-001, PT §17 |
| + | email | String | | | Nullable; email válido | REQ-PPL-001, PT §17 |
| / | fullName | String | | ✓ | `firstName + " " + lastName` | Derivado |
| / | isPlayerProfileComplete | Boolean | | ✓ | `dni ∧ birthDate ∧ phone ∧ email` all non-null | REQ-PPL-002 |
| / | activeMembership | Membership[0..1] | | ✓ | Membership vigente donde `now ∈ [valid_from, valid_until)` | Temporal model |
| / | activeTeamAssignments | TeamAssignment[0..*] | | ✓ | Assignments vigentes donde `now ∈ [valid_from, valid_until)` | Temporal model |
| / | activeRoleAssignments | RoleAssignment[0..*] | | ✓ | Assignments vigentes donde `now ∈ [valid_from, valid_until)` | Temporal model |
| / | guardianRelationships | GuardianRelationship[0..*] | | ✓ | Como guardian O child (reflexiva) | Temporal model |

**Responsabilidad:** Entidad base humana con identidad estable. No se elimina (historia conservada). Datos opcionales hasta requerir perfil de jugadora completo.

---

## 2.2 ACCOUNT (CL-02)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §25 |
| + | personId | UUID | ✓ | | FK → Person `{unique}` (1:1) | REQ-PPL-003 |
| + | username | Username (VO) | ✓ | | Case-insensitive unique; inmutable | REQ-IAM-014 |
| - | passwordHash | PasswordHash (VO) | | | Argon2id; NULL si SETUP_REQUIRED | PT §48, §25 |
| + | status | Enum<AccountStatus> | ✓ | | PENDING / ACTIVE / DISABLED | SM-ACCOUNT-01 |
| + | activatedAt | DateTime | | | Non-null solo si ACTIVE | REQ-IAM-002 |
| + | disabledAt | DateTime | | | Non-null solo si DISABLED | REQ-IAM-002 |
| + | credentialVersion | Integer | ✓ | | Incrementa en reset admin; ≥1 | PT §51, §25 |
| + | setupToken | ActivationCode (VO) | | | Max 1 activo; NULL si consumido/expirado | REQ-IAM-003, PT §51 |
| / | activeSessions | SessionToken[0..*] | | ✓ | Sessions no expiradas ni revocadas | PT §49 |
| / | isActive | Boolean | | ✓ | `status = ACTIVE` | Derivado |
| / | person | Person | | ✓ | Navegación a Person | FK |

**Responsabilidad:** Identidad digital separada de Person. Username inmutable. Credencial versionada. Sesión opaca (digest HMAC en BD).

---

## 2.3 MEMBERSHIP (CL-03)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §17, §25 |
| + | personId | UUID | ✓ | | FK → Person | REQ-PPL-004 |
| + | validFrom | Date | ✓ | | Inicio vigencia | PT §25 |
| + | validUntil | Date | | | Fin vigencia (NULL = indefinido) | PT §25 |
| / | isActive | Boolean | | ✓ | `now ∈ [validFrom, validUntil)` | Temporal model |
| / | person | Person | | ✓ | Navegación | FK |
| / | activeTeamAssignments | TeamAssignment[0..*] | | ✓ | Assignments vigentes dentro de esta membership | Temporal model |
| / | activeRoleAssignments | RoleAssignment[0..*] | | ✓ | Assignments vigentes dentro de esta membership | Temporal model |

**Responsabilidad:** Período de pertenencia al club. TeamAssignment/RoleAssignment internos exigen membership vigente. Finalizar con dependencias activas → rechazado; período conservado.

---

## 2.4 TEAM ASSIGNMENT (CL-04)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §17, §25 |
| + | personId | UUID | ✓ | | FK → Person | REQ-PPL-005 |
| + | teamId | UUID | ✓ | | FK → Team | REQ-PPL-005 |
| + | validFrom | Date | ✓ | | Inicio afiliación | PT §25 |
| + | validUntil | Date | | | Fin afiliación (NULL = indefinido) | PT §25 |
| / | isActive | Boolean | | ✓ | `now ∈ [validFrom, validUntil)` | Temporal model |
| / | person | Person | | ✓ | Navegación | FK |
| / | team | Team | | ✓ | Navegación | FK |

**Responsabilidad:** Afiliación deportiva PLAYER a Team (solo PLAYER). Vigencia temporal. Distinta de Membership y RoleAssignment. Atómica con RoleAssignment PLAYER en `AssignPlayerToTeam`.

---

## 2.5 ROLE ASSIGNMENT (CL-05)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §5, §17, §25 |
| + | personId | UUID | ✓ | | FK → Person | REQ-PPL-006 |
| + | role | Enum<RoleType> | ✓ | | PLAYER / CAPTAIN / COACH / SUBCOMMITTEE / ADMIN | PT §5 |
| + | scopeType | Enum<ScopeType> | ✓ | | CLUB / TEAM / EVENT / LINE | PT §5, REQ-CMP-004 |
| + | scopeRefId | UUID | | | FK según scopeType: Team (TEAM/EVENT), Competition (LINE), NULL (CLUB) | PT §5 |
| + | validFrom | DateTime | ✓ | | Inicio vigencia | PT §25 |
| + | validUntil | DateTime | | | Fin vigencia (NULL = indefinido) | PT §25 |
| + | temporalExclusions | DateTime[0..*] | | | Períodos excluidos dentro de vigencia | PT §25 (role_assignments) |
| / | isActive | Boolean | | ✓ | `now ∈ [validFrom, validUntil)` ∧ `now ∉ temporalExclusions` | Temporal model |
| / | person | Person | | ✓ | Navegación | FK |
| / | team | Team[0..1] | | ✓ | Si scopeType ∈ {TEAM, EVENT} | FK |
| / | competition | Competition[0..1] | | ✓ | Si scopeType = LINE | FK |

**Responsabilidad:** Rol con alcance y vigencia. 5 roles. Combinación inválida (ej. PLAYER scope CLUB) → `INVALID_ROLE_SCOPE`. Multi-rol = unión de assignments vigentes. Coach usa RoleAssignment (no TeamAssignment).

---

## 2.6 GUARDIAN RELATIONSHIP (CL-06)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §17, §20, §25 |
| + | guardianPersonId | UUID | ✓ | | FK → Person (adulto) | REQ-PPL-008 |
| + | childPersonId | UUID | ✓ | | FK → Person (menor) | REQ-PPL-008 |
| + | relationshipType | Enum<RelationshipType> | ✓ | | MOTHER / FATHER / GUARDIAN / OTHER | PT §17 |
| + | validFrom | Date | ✓ | | Inicio delegación | PT §25 |
| + | validUntil | Date | | | Fin delegación (NULL = indefinido) | PT §25 |
| + | canViewChildInfo | Boolean | ✓ | | Permiso ver info del menor | REQ-PPL-008 AC1 |
| + | canRespondAvailability | Boolean | ✓ | | Permiso responder disponibilidad | REQ-PRT-002 |
| / | isActive | Boolean | | ✓ | `now ∈ [validFrom, validUntil)` | Temporal model |
| / | guardianPerson | Person | | ✓ | Navegación al adulto | FK |
| / | childPerson | Person | | ✓ | Navegación al menor | FK |

**Responsabilidad:** Relación delegada (no rol). Individual por menor. Dos permisos independientes. No requiere Membership. Finalizar deja de conceder acceso y conserva período.

---

## 2.7 SEASON (CL-07)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §19, §25 |
| + | name | String | ✓ | | Not empty; único | REQ-STR-001 |
| + | startDate | Date | ✓ | | | REQ-STR-001 |
| + | endDate | Date | ✓ | | `endDate ≥ startDate` | REQ-STR-001 |
| / | teams | Team[0..*] | | ✓ | Teams de esta temporada | FK inverso |
| / | competitions | Competition[0..*] | | ✓ | Competencias de esta temporada | FK inverso |
| / | jornadas | Jornada[0..*] | | ✓ | Jornadas de esta temporada | FK inverso |

**Responsabilidad:** Entidad histórica con nombre y fechas. Sin estado (no lifecycle). No hard-delete. Identidad estable.

---

## 2.8 DIVISION (CL-08)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §19, §25 |
| + | name | String | ✓ | | Not empty | REQ-STR-002 |
| + | archivedAt | DateTime | | | NULL = ACTIVE; non-null = ARCHIVED | SM-DIVISION-01 |
| / | isActive | Boolean | | ✓ | `archivedAt = NULL` | Derivado |
| / | lines | Line[0..*] | | ✓ | Líneas de esta división (activas) | FK inverso |
| / | teams | Team[0..*] | | ✓ | Equipos de esta división (activos) | FK inverso |

**Responsabilidad:** Nivel competitivo. Lifecycle ACTIVE→ARCHIVED. Renombrar con equipos activos rechazado. Valla dependencias al archivar.

---

## 2.9 LINE (CL-09)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §19, §25 |
| + | divisionId | UUID | ✓ | | FK → Division | REQ-STR-003 |
| + | name | String | ✓ | | Not empty | REQ-STR-003 |
| + | archivedAt | DateTime | | | NULL = ACTIVE; non-null = ARCHIVED | SM-LINE-01 |
| / | isActive | Boolean | | ✓ | `archivedAt = NULL` | Derivado |
| / | fullLabel | String | | ✓ | `Division.name + " " + name + " " + Season.name` (via Team) | REQ-STR-010 |
| / | teams | Team[0..*] | | ✓ | Equipos de esta línea (activos) | FK inverso |

**Responsabilidad:** Tira/línea deportiva dentro de División. Lifecycle ACTIVE→ARCHIVED. Etiqueta completa incluye división+temporada.

---

## 2.10 TEAM (CL-10)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §19, §25 |
| + | seasonId | UUID | ✓ | | FK → Season `{unique: seasonId+divisionId+lineId}` | REQ-STR-004 |
| + | divisionId | UUID | ✓ | | FK → Division | REQ-STR-004 |
| + | lineId | UUID | ✓ | | FK → Line | REQ-STR-004 |
| + | status | Enum<TeamStatus> | ✓ | | DRAFT / ACTIVE / ARCHIVED | SM-TEAM-01 |
| + | archivedAt | DateTime | | | Non-null solo si ARCHIVED | SM-TEAM-01 |
| / | name | String | | ✓ | `Season.name + " " + Division.name + " " + Line.name` | REQ-PPL-014 |
| / | isActive | Boolean | | ✓ | `status = ACTIVE` | Derivado |
| / | season | Season | | ✓ | Navegación | FK |
| / | division | Division | | ✓ | Navegación | FK |
| / | line | Line | | ✓ | Navegación | FK |
| / | teamAssignments | TeamAssignment[0..*] | | ✓ | Afiliaciones vigentes | FK inverso |
| / | roleAssignments | RoleAssignment[0..*] | | ✓ | Roles TEAM/EVENT vigentes | FK inverso |
| / | events | Event[0..*] | | ✓ | Eventos con este team como target | FK inverso (EventTargetTeam) |
| / | competitionEntries | CompetitionEntry[0..*] | | ✓ | Inscripciones TEAM scope | FK inverso |
| / | canonicalConversation | Conversation[0..1] | | ✓ | Conversación canónica TEAM (type=TEAM) | FK inverso |

**Responsabilidad:** **Entidad concreta de temporada: identidad = Season + Division + Line (única inmutable).** Nombre derivado. Lifecycle DRAFT→ACTIVE→ARCHIVED. Valla dependencias al archivar. Subcomisión denegada.

---

## 2.11 VENUE (CL-11)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §19, §25 |
| + | name | String | ✓ | | Not empty | REQ-STR-005 |
| + | address | String | ✓ | | Not empty | REQ-STR-005 |
| + | fieldLabel | String | | | Etiqueta de cancha opcional | REQ-STR-005 |
| + | archivedAt | DateTime | | | NULL = ACTIVE; non-null = ARCHIVED | SM-VENUE-01 |
| / | isActive | Boolean | | ✓ | `archivedAt = NULL` | Derivado |
| / | events | Event[0..*] | | ✓ | Eventos en esta sede | FK inverso |

**Responsabilidad:** Sede con identidad estable por ID. Regla A/B: corregir metadatos (nombre/dirección/field_label) no reprograma eventos; cambiar sede de evento SÍ es cambio material. Valla dependencias.

---

## 2.12 EVENT (CL-12)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §10, §25 |
| + | type | Enum<EventType> | ✓ | | TRAINING / MATCH / CLUB_EVENT | PT §10 |
| + | title | String | ✓ | | Not empty | REQ-EVT-002/003/004 |
| + | startAt | DateTime | | | Requerido si state ∈ {SCHEDULED, IN_PROGRESS, COMPLETED} | REQ-EVT-001 |
| + | endAt | DateTime | | | Requerido si state ∈ {SCHEDULED, IN_PROGRESS, COMPLETED}; `endAt > startAt` | REQ-EVT-001 |
| + | timeZone | String | ✓ | | IANA timezone; default club | REQ-STR-007 |
| + | venueId | UUID | | | FK → Venue (nullable) | REQ-EVT-002/003/004 |
| + | state | Enum<EventState> | ✓ | | Ver SM-EVENT-01 | SM-EVENT-01 |
| + | clubWideTarget | Boolean | ✓ | | true = club-wide; false = targeted | PT §10 |
| + | seriesId | UUID | | | FK → EventSeries (si es ocurrencia) | PT §25 |
| + | occurrenceIndex | Integer | | | Índice en serie (si seriesId ≠ NULL) | PT §25 |
| + | coordinationRevision | Integer | ✓ | | Inicia en 0; incrementa en cambios materiales | PT §11, REQ-EVT-011 |
| + | creatorPersonId | UUID | ✓ | | FK → Person (quien creó) | PT §25 |
| + | createdAt | DateTime | ✓ | | Timestamp creación | PT §25 |
| + | updatedAt | DateTime | ✓ | | Timestamp última modificación | PT §25 |
| + | version | Integer | ✓ | | Optimistic locking; ≥1 | PT §27 |
| / | targetTeams | Team[0..*] | | ✓ | Via EventTargetTeam (si !clubWideTarget) | Asociación |
| / | targetPersons | Person[0..*] | | ✓ | Via EventTargetPerson (si !clubWideTarget) | Asociación |
| / | logistics | EventLogistics[0..1] | | ✓ | Logística opcional | Asociación 0..1 |
| / | match | Match[0..1] | | ✓ | Subtipo Match (si type=MATCH) | Subtipo |
| / | attendanceSheet | AttendanceSheet[0..1] | | ✓ | Planilla si type ∈ {TRAINING, MATCH} | FK inverso |
| / | availabilityResponses | Availability[0..*] | | ✓ | Respuestas si state=SCHEDULED | FK inverso |
| / | selection | Selection[0..1] | | ✓ | Convocatoria si type=MATCH | FK inverso |
| / | matchRecord | MatchRecord[0..1] | | ✓ | Resultado si type=MATCH | FK inverso |
| / | jornada | Jornada[0..1] | | ✓ | Jornada si Match | FK inverso |

**Responsabilidad:** Raíz común para TRAINING/MATCH/CLUB_EVENT. 7 estados. Invariantes: `endAt > startAt` si ambos; SCHEDULED/IN_PROGRESS/COMPLETED exigen `startAt`; POSTPONED puede no tener schedule. Match: exactamente 1 team target, 0 person targets, clubWideTarget=false, subtipo row obligatorio, team inmutable una vez SCHEDULED. Cambio material: `coordinationRevision++`, deriva NEEDS_RECONFIRMATION, notifica.

---

## 2.13 MATCH (Subtipo de Event — discriminado por type=MATCH)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | eventId | UUID | ✓ | | PK `{id}` = FK → Event (1:1) | PT §10, §25 |
| + | opponent | String | ✓ | | Not empty | PT §10, §25 |
| + | competitionEntryId | UUID | | | FK → CompetitionEntry (si aplica) | PT §16, §25 |
| + | meetingAt | DateTime | | | Hora de encuentro | REQ-EVT-019 |
| + | departureAt | DateTime | | | Hora de salida | REQ-EVT-019 |
| + | meetingPoint | String | | | Punto de encuentro | REQ-EVT-019 |
| + | transportNote | String | | | Nota de transporte | REQ-EVT-019 |
| + | arrivalInstructions | String | | | Instrucciones de llegada | REQ-EVT-019 |
| / | event | Event | | ✓ | Navegación a Event raíz | FK 1:1 |
| / | concreteTeam | Team | | ✓ | El único team target (inmutable si SCHEDULED) | Derivado + invariante |

**Responsabilidad:** Subtipo de Event para partidos. Exactamente 1 team target inmutable una vez SCHEDULED. Transición extra IN_PROGRESS→ABANDONED. Resultado compatible: PLAYED/FORFEIT→Event COMPLETED; ABANDONED→Event ABANDONED.

---

## 2.14 EVENT SERIES (CL-13)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §25 |
| + | name | String | ✓ | | Not empty | REQ-EVT-014 |
| + | state | Enum<EventSeriesState> | ✓ | | ACTIVE / ENDED | SM-EVENTSERIES-01 |
| + | recurrenceRule | String | ✓ | | RRULE (RFC 5545) o similar | REQ-EVT-014 |
| + | maxOccurrences | Integer | | | ≤ 366 por comando | REQ-EVT-016 |
| + | targetTeams | Team[0..*] | | ✓ | Via EventSeriesTargetTeam | Asociación |
| / | targetPersons | Person[0..*] | | ✓ | Via EventSeriesTargetPerson | Asociación |
| / | occurrences | Event[0..*] | | ✓ | Eventos generados (occurrenceIndex) | FK inverso |
| / | overrides | EventOccurrenceOverride[0..*] | | ✓ | Anulaciones específicas | FK inverso |

**Responsabilidad:** Contenedor de ocurrencias recurrentes. Máx 366 por comando. 3 alcances de edición. Lifecycle ACTIVE→ENDED (terminal).

---

## 2.15 EVENT OCCURRENCE OVERRIDE (CL-14)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 23) |
| + | seriesId | UUID | ✓ | | FK → EventSeries | PT §25 |
| + | occurrenceIndex | Integer | ✓ | | Índice de la ocurrencia anulada | PT §25 |
| + | overriddenEventId | UUID | | | FK → Event (la ocurrencia concreta si ya generada) | PT §25 |
| + | customTitle | String | | | Título personalizado | PT §25 |
| + | customStartAt | DateTime | | | Horario personalizado | PT §25 |
| + | customEndAt | DateTime | | | Fin personalizado | PT §25 |
| + | customVenueId | UUID | | | Sede personalizada | PT §25 |
| + | isCancelled | Boolean | | | Occurrencia cancelada individualmente | PT §25 |

**Responsabilidad:** Anulación específica de una ocurrencia en serie. Identidad propia. Permite alcance "solo esta" en ediciones.

---

## 2.16 JORNADA (CL-15)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §16, §25 |
| + | seasonId | UUID | ✓ | | FK → Season | PT §16 |
| + | competitionId | UUID | | | FK → Competition (opcional) | PT §16 |
| + | name | String | ✓ | | Not empty | REQ-EVT-018 |
| + | date | Date | ✓ | | Fecha de la jornada | REQ-EVT-018 |
| / | matches | Match[0..*] | | ✓ | Via JornadaMatch (≤100, atómico) | Asociación |
| / | season | Season | | ✓ | Navegación | FK |
| / | competition | Competition[0..1] | | ✓ | Navegación | FK |

**Responsabilidad:** Agrupa Matches de una jornada operativa. Bulk atómico ≤100. Season del match = season de la jornada. Competition_id opcional → usa CompetitionEntry de esa competition. Un match, a lo sumo una jornada.

---

## 2.17 EVENT LOGISTICS (CL-16)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §11, §25 |
| + | eventId | UUID | ✓ | | FK → Event `{unique}` (0..1) | PT §25 |
| + | meetingAt | DateTime | | | Hora de encuentro | REQ-EVT-019 |
| + | departureAt | DateTime | | | Hora de salida | REQ-EVT-019 |
| + | meetingPoint | String | | | Punto de encuentro | REQ-EVT-019 |
| + | transportNote | String | | | Nota de transporte | REQ-EVT-019 |
| + | arrivalInstructions | String | | | Instrucciones de llegada | REQ-EVT-019 |
| / | event | Event | | ✓ | Navegación | FK 1:1 |

**Responsabilidad:** Logística de evento opcional (0..1 por Event). Actualizable por CAPTAIN (scope TEAM), COACH (TEAM/EVENT), SUBCOMMITTEE (CLUB). Identidad propia, auditable.

---

## 2.18 EVENT TARGET TEAM (CL-17, Asociación)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 21) |
| + | eventId | UUID | ✓ | | FK → Event | PT §25 |
| + | teamId | UUID | ✓ | | FK → Team | PT §25 |
| + | addedAt | DateTime | ✓ | | Cuándo se agregó | PT §25 |
| + | addedByPersonId | UUID | ✓ | | FK → Person | PT §25 |

**Responsabilidad:** Asociación Event ↔ Team (N:M) para destinatarios plurales. Club_wide_target=false. Identidad propia.

---

## 2.19 EVENT TARGET PERSON (CL-18, Asociación)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 22) |
| + | eventId | UUID | ✓ | | FK → Event | PT §25 |
| + | personId | UUID | ✓ | | FK → Person | PT §25 |
| + | addedAt | DateTime | ✓ | | Cuándo se agregó | PT §25 |
| + | addedByPersonId | UUID | ✓ | | FK → Person | PT §25 |

**Responsabilidad:** Asociación Event ↔ Person (N:M) para destinatarios personales. Identidad propia.

---

## 2.20 AVAILABILITY (CL-19)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §12, §25 |
| + | eventId | UUID | ✓ | | FK → Event | REQ-PRT-001 |
| + | personId | UUID | ✓ | | FK → Person (jugadora o menor) | REQ-PRT-001/002 |
| + | respondedByPersonId | UUID | ✓ | | FK → Person (quien respondió: jugadora o guardián) | REQ-PRT-002 |
| + | value | Enum<AvailabilityValue> | ✓ | | YES / MAYBE / NO | SM-AVAILABILITY-01 |
| + | respondedAt | DateTime | ✓ | | Timestamp respuesta | REQ-PRT-001 |
| + | coordinationRevision | Integer | ✓ | | `Event.coordinationRevision` al momento de responder | REQ-PRT-003 |
| / | state | Enum<AvailabilityValue | AvailabilityDerived> | | ✓ | Si fila existe: value; si no: NO_RESPONSE; si value≠NULL ∧ coordinationRevision < Event.coordinationRevision: NEEDS_RECONFIRMATION | SM-AVAILABILITY-01, REQ-PRT-003 |
| / | event | Event | | ✓ | Navegación | FK |
| / | person | Person | | ✓ | Navegación (sujeto de la disponibilidad) | FK |
| / | respondedBy | Person | | ✓ | Navegación (quien respondió) | FK |

**Responsabilidad:** Respuesta previa a Event SCHEDULED. Valores persistidos YES/MAYBE/NO. Derivados: NO_RESPONSE (sin fila), NEEDS_RECONFIRMATION (resp. previa + coordination_revision mayor). POSTPONED conserva respuestas, no acepta nuevas. Distinta de Selection/Attendance.

---

## 2.21 SELECTION (CL-20)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §12, §25 |
| + | matchId | UUID | ✓ | | FK → Event (type=MATCH) `{unique}` | REQ-PRT-005 |
| + | currentDraftRevisionId | UUID | | | FK → SelectionRevision (borrador actual) | PT §25 |
| / | publishedRevisions | SelectionRevision[0..*] | | ✓ | Historial de revisiones PUBLISHED (orden cronológico) | FK inverso |
| / | match | Event | | ✓ | Navegación al Match | FK |
| / | currentDraft | SelectionRevision[0..1] | | ✓ | Borrador actual (editable, autosave) | Derivado |

**Responsabilidad:** Contenedor de convocatoria de un Match. Borrador actual mutable + historial de SelectionRevision PUBLISHED inmutables.

---

## 2.22 SELECTION REVISION (CL-21)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §25 (tabla 28, 29) |
| + | selectionId | UUID | ✓ | | FK → Selection | PT §25 |
| + | state | Enum<SelectionRevisionState> | ✓ | | DRAFT / PUBLISHED | SM-SELECTIONREV-01 |
| + | publishedAt | DateTime | | | Non-null solo si PUBLISHED | SM-SELECTIONREV-01 |
| + | publishedByPersonId | UUID | | | FK → Person (quien publicó) | PT §25 |
| + | autosaveVersion | Integer | | | Para control de concurrencia en DRAFT | REQ-PRT-008 |
| / | entries | SelectionEntry[0..*] | | ✓ | Entradas de esta revisión | FK inverso |
| / | selection | Selection | | ✓ | Navegación al contenedor | FK |
| / | hasCurrentConflicts | Boolean | | ✓ | Derivado: ELIGIBILITY_BLOCKED/PENDING, NO_LONGER_EVENT_TARGET, NO_LONGER_TEAM_AFFILIATED | PT §14 |

**Responsabilidad:** Unidad de publicación. DRAFT (editable, autosave 600ms) → PUBLISHED (inmutable). Republicar = nueva revisión. No se reescribe. Conflictos derivados no bloquean publicación.

---

## 2.23 SELECTION ENTRY (CL-22)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 30) |
| + | revisionId | UUID | ✓ | | FK → SelectionRevision | PT §25 |
| + | personId | UUID | ✓ | | FK → Person | PT §25 |
| + | role | String | ✓ | | selected / alternate / etc. (vocabulario club) | PT §25 |
| + | order | Integer | | | Orden en convocatoria | PT §25 |

**Responsabilidad:** Entrada individual en SelectionRevision. Parte de revisión inmutable si PUBLISHED.

---

## 2.24 ATTENDANCE SHEET (CL-23)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §12, §25 (tabla 31) |
| + | eventId | UUID | ✓ | | FK → Event (type ∈ {TRAINING, MATCH}) `{unique}` | REQ-PRT-009 |
| + | closedAt | DateTime | | | NULL = OPEN; non-null = CLOSED | SM-ATTENDANCEENTRY-01 |
| + | closedByPersonId | UUID | | | FK → Person (quien cerró) | PT §25 |
| / | state | Enum<AttendanceSheetState> | | ✓ | `OPEN` si closedAt=NULL, `CLOSED` si non-null | Derivado |
| / | entries | AttendanceEntry[0..*] | | ✓ | Entradas de esta planilla | FK inverso |
| / | event | Event | | ✓ | Navegación | FK |

**Responsabilidad:** Contenedor por Event. OPEN/CLOSED derivado de closed_at. No reapertura inventada (corrección auditada separada).

---

## 2.25 ATTENDANCE ENTRY (CL-24)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §12, §25 (tabla 32) |
| + | sheetId | UUID | ✓ | | FK → AttendanceSheet | REQ-PRT-009 |
| + | personId | UUID | ✓ | | FK → Person | REQ-PRT-009 |
| + | value | Enum<AttendanceValue> | | | PRESENT / ABSENT / JUSTIFIED (NULL = UNRECORDED derivado) | SM-ATTENDANCEENTRY-01 |
| + | recordedAt | DateTime | | | Timestamp registro (si value ≠ NULL) | REQ-PRT-009 |
| + | recordedByPersonId | UUID | | | FK → Person (quien registró) | PT §25 |
| + | correctedAt | DateTime | | | Timestamp última corrección | REQ-PRT-012 |
| + | correctedByPersonId | UUID | | | FK → Person (quien corrigió) | REQ-PRT-012 |
| + | correctionReason | String | | | Motivo obligatorio en corrección | REQ-PRT-012 |
| + | previousValue | Enum<AttendanceValue> | | | Valor anterior en corrección | REQ-PRT-012 |
| / | state | Enum<AttendanceValue | AttendanceDerived> | | ✓ | Si value≠NULL: value; si value=NULL: UNRECORDED | SM-ATTENDANCEENTRY-01 |
| / | sheet | AttendanceSheet | | ✓ | Navegación | FK |
| / | person | Person | | ✓ | Navegación | FK |

**Responsabilidad:** Valor de asistencia persistido + UNRECORRED derivado (sin fila). Corrección auditada con motivo obligatorio. closed_at bloquea marcaje directo (no reapertura). Asistencia ≠ participación en partido.

---

## 2.26 MATCH RECORD (CL-25)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §15, §25 |
| + | matchId | UUID | ✓ | | FK → Event (type=MATCH) `{unique}` | REQ-PRT-013 |
| + | state | Enum<MatchRecordState> | ✓ | | DRAFT / FINAL | SM-MATCHRECORD-01 |
| + | resultType | Enum<MatchResultType> | | | PLAYED / FORFEIT / ABANDONED (requerido si FINAL) | PT §15 |
| + | homeScore | Integer | | | Goles/cuentas local | PT §25 |
| + | awayScore | Integer | | | Goles/cuentas visitante | PT §25 |
| + | observations | String | | | Observaciones libres | REQ-PRT-013 |
| + | finalizedAt | DateTime | | | Non-null solo si FINAL | SM-MATCHRECORD-01 |
| + | finalizedByPersonId | UUID | | | FK → Person | PT §25 |
| + | correctedAt | DateTime | | | Timestamp última corrección | REQ-PRT-014 |
| + | correctedByPersonId | UUID | | | FK → Person | REQ-PRT-014 |
| + | correctionReason | String | | | Motivo obligatorio en corrección | REQ-PRT-014 |
| + | previousResultType | Enum<MatchResultType> | | | Tipo anterior en corrección | REQ-PRT-014 |
| + | previousHomeScore | Integer | | | Score anterior | REQ-PRT-014 |
| + | previousAwayScore | Integer | | | Score anterior | REQ-PRT-014 |
| / | match | Event | | ✓ | Navegación | FK |
| / | playerStats | PlayerMatchStats[0..*] | | ✓ | Stats por jugador (solo si resultType=PLAYED) | FK inverso |

**Responsabilidad:** Resultado de partido. DRAFT → FINAL (terminal). Corrección explícita separada (no transición inversa). Compatibilidad: PLAYED/FORFEIT→Event COMPLETED; ABANDONED→Event ABANDONED. Stats solo PLAYED. matches_played derivado del resultado, no de asistencia.

---

## 2.27 PLAYER MATCH STATS (CL-26)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §15, §25 (tabla 40) |
| + | matchRecordId | UUID | ✓ | | FK → MatchRecord | PT §25 |
| + | personId | UUID | ✓ | | FK → Person | PT §25 |
| + | minutesPlayed | Integer | | | Minutos jugados | PT §25 |
| + | goals | Integer | | | Goles | PT §25 |
| + | assists | Integer | | | Asistencias | PT §25 |
| + | yellowCards | Integer | | | Tarjetas amarillas | PT §25 |
| + | redCards | Integer | | | Tarjetas rojas | PT §25 |
| + | mvp | Boolean | | | Jugador del partido | PT §25 |
| / | matchRecord | MatchRecord | | ✓ | Navegación | FK |
| / | person | Person | | ✓ | Navegación | FK |

**Responsabilidad:** Estadísticas fijas por jugador en MatchRecord PLAYED. Participación real. matches_played derivado del resultado, no de asistencia.

---

## 2.28 ELIGIBILITY CONSTRAINT (CL-27)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §13, §25 |
| + | personId | UUID | ✓ | | FK → Person | PT §13 |
| + | state | Enum<EligibilityState> | ✓ | | PENDING / BLOCKED | SM-ELIGIBILITY-01 |
| + | scope | Enum<EligibilityScope> | ✓ | | CLUB / COMPETITION / ENTRY / EVENT | PT §13 |
| + | scopeRefId | UUID | | | FK según scope: Competition, CompetitionEntry, Event | PT §13 |
| + | source | Enum<EligibilitySource> | ✓ | | INTERNAL / AHBA / OTHER | PT §13 |
| + | reason | Enum<EligibilityReason> | ✓ | | ADMIN / DISCIPLINE / FEDERATION / MEDICAL_CLEARANCE / OTHER | PT §13 |
| + | note | String | | | Nota opcional | PT §13 |
| + | validFrom | DateTime | ✓ | | Inicio vigencia | PT §13 |
| + | validUntil | DateTime | | | Fin vigencia (NULL = indefinido) | PT §13 |
| / | isActive | Boolean | | ✓ | `now ∈ [validFrom, validUntil)` ∧ `state = BLOCKED` | Derivado |
| / | person | Person | | ✓ | Navegación | FK |
| / | competition | Competition[0..1] | | ✓ | Si scope=COMPETITION | FK |
| / | competitionEntry | CompetitionEntry[0..1] | | ✓ | Si scope=ENTRY | FK |
| / | event | Event[0..1] | | ✓ | Si scope=EVENT | FK |

**Responsabilidad:** Restricción de habilitación con estados PENDING/BLOCKED + vigencia + scope + source + reason. ELIGIBLE derivado = sin restricción activa BLOCKED aplicable. No datos clínicos. Mutación auditada.

---

## 2.29 ANNOUNCEMENT (CL-28)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §21, §25 |
| + | title | String | ✓ | | Not empty | REQ-COM-001 |
| + | body | String | ✓ | | Not empty | REQ-COM-001 |
| + | state | Enum<AnnouncementState> | ✓ | | DRAFT / PUBLISHED / ARCHIVED | SM-ANNOUNCEMENT-01 |
| + | publishedAt | DateTime | | | Non-null solo si PUBLISHED | SM-ANNOUNCEMENT-01 |
| + | publishedByPersonId | UUID | | | FK → Person (Subcomisión) | REQ-COM-001 |
| + | archivedAt | DateTime | | | Non-null solo si ARCHIVED | SM-ANNOUNCEMENT-01 |
| / | targetTeams | Team[0..*] | | ✓ | Via AnnouncementTargetTeam (si !clubWide) | Asociación |
| / | clubWide | Boolean | | ✓ | `targetTeams.empty` | Derivado |
| / | audienceSnapshot | Team[0..*] | | ✓ | Copia inmutable de targetTeams al publicar | REQ-COM-003 |

**Responsabilidad:** Comunicado oficial. DRAFT→PUBLISHED (audiencia snapshot inmutable: TEAM_SET o club-wide)→ARCHIVED. Corrección solo title/body. Solo Subcomisión.

---

## 2.30 ANNOUNCEMENT TARGET TEAM (CL-29, Asociación)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 34) |
| + | announcementId | UUID | ✓ | | FK → Announcement | PT §25 |
| + | teamId | UUID | ✓ | | FK → Team | PT §25 |

**Responsabilidad:** Asociación Announcement ↔ Team (N:M) para audiencia snapshot inmutable al publicar.

---

## 2.31 CONVERSATION (CL-30)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §20, §25 |
| + | type | Enum<ConversationType> | ✓ | | DIRECT / GROUP / TEAM / EVENT | PT §20 |
| + | title | String | | | Requerido si GROUP; derivado si TEAM/EVENT | REQ-COM-007/008 |
| + | state | Enum<ConversationState> | | | ACTIVE / ARCHIVED (solo GROUP) | SM-CONVERSATION-GROUP-01 |
| + | directPairKey | DirectPairKey (VO) | | | Solo si DIRECT; `{unique}` partial | REQ-COM-006 |
| + | teamId | UUID | | | FK → Team (si TEAM) `{unique}` | REQ-COM-008 |
| + | eventId | UUID | | | FK → Event (si EVENT) `{unique}` | REQ-COM-008 |
| + | createdAt | DateTime | ✓ | | Timestamp creación | PT §25 |
| + | createdByPersonId | UUID | ✓ | | FK → Person | PT §25 |
| / | participants | Person[0..*] | | ✓ | Via ConversationParticipant | Asociación |
| / | messages | Message[0..*] | | ✓ | Mensajes de esta conversación | FK inverso |

**Responsabilidad:** 4 tipos con reglas distintas. DIRECT: par canónico único (max 1). GROUP: ≥2, título, archivable, múltiples. TEAM: 0..1 canónica por Team, membresía sync. EVENT: 0..1 canónica por Event, membresía sync. Solo GROUP tiene SM.

---

## 2.32 CONVERSATION PARTICIPANT (CL-31, Asociación)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 36) |
| + | conversationId | UUID | ✓ | | FK → Conversation | PT §25 |
| + | personId | UUID | ✓ | | FK → Person | PT §25 |
| + | joinedAt | DateTime | ✓ | | Cuándo se unió | REQ-COM-011 |
| + | leftAt | DateTime | | | Cuándo salió (NULL = activo) | REQ-COM-011 |
| / | isActive | Boolean | | ✓ | `leftAt = NULL` | Derivado |
| / | conversation | Conversation | | ✓ | Navegación | FK |
| / | person | Person | | ✓ | Navegación | FK |

**Responsabilidad:** Asociación Person ↔ Conversation (N:M) con joined_at/left_at. Acceso temporal autoritativo: sin historia anterior a joined_at; ex-participante conserva período; Admin sin participación no lee.

---

## 2.33 MESSAGE (CL-32)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §9, §25 |
| + | conversationId | UUID | ✓ | | FK → Conversation | PT §25 |
| + | authorPersonId | UUID | ✓ | | FK → Person | PT §25 |
| + | body | String | ✓ | | Not empty | REQ-COM-009 |
| + | state | Enum<MessageState> | ✓ | | SENT / EDITED / DELETED | SM-MESSAGE-01 |
| + | sentAt | DateTime | ✓ | | Timestamp envío | PT §25 |
| + | editedAt | DateTime | | | Non-null si EDITED | SM-MESSAGE-01 |
| + | deletedAt | DateTime | | | Non-null si DELETED | SM-MESSAGE-01 |
| + | deletionReason | String | | | Motivo obligatorio al borrar | REQ-COM-010 |
| / | conversation | Conversation | | ✓ | Navegación | FK |
| / | author | Person | | ✓ | Navegación | FK |

**Responsabilidad:** Mensaje en conversación. SENT → EDITED → DELETED (tombstone irreversible, confirmación+motivo). Solo mensajes propios. Historia expuesta. Enviar no notifica. Reintento idempotente.

---

## 2.34 NOTIFICATION (CL-33)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §22, §25 |
| + | recipientPersonId | UUID | ✓ | | FK → Person | REQ-COM-018 |
| + | type | Enum<NotificationType> | ✓ | | 7 tipos (PT §22) | PT §22 |
| + | resourceType | String | ✓ | | EVENT / SELECTION / ANNOUNCEMENT | PT §25 |
| + | resourceId | UUID | ✓ | | ID del recurso origen | PT §25 |
| + | originEventId | UUID | | | FK → Event (si type es EVENT_*) | PT §25 |
| + | title | String | ✓ | | Título notificación | PT §25 |
| + | body | String | ✓ | | Cuerpo notificación | PT §25 |
| + | occurredAt | DateTime | ✓ | | Cuándo ocurrió el hecho | PT §25 |
| + | readAt | DateTime | | | NULL = UNREAD; non-null = READ | Derivado |
| + | audienceResolvedAt | DateTime | ✓ | | Audiencia resuelta inmutable al crear | PT §58 |
| / | recipient | Person | | ✓ | Navegación | FK |
| / | isUnread | Boolean | | ✓ | `readAt = NULL` | Derivado |

**Responsabilidad:** Notificación de 7 tipos. Clave lógica única `origin_event_id + recipient + type`. AudienceResolvedAt inmutable. Deduplicación. UNREAD/READ derivado de read_at.

---

## 2.35 COMPETITION (CL-34)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 |
| + | name | String | ✓ | | Not empty | REQ-CMP-001 |
| + | seasonId | UUID | ✓ | | FK → Season | PT §25 |
| + | state | Enum<CompetitionState> | ✓ | | DRAFT / ACTIVE / CLOSED | SM-COMPETITION-01 |
| + | closedAt | DateTime | | | Non-null solo si CLOSED | SM-COMPETITION-01 |
| / | entries | CompetitionEntry[0..*] | | ✓ | Inscripciones | FK inverso |
| / | externalReferences | ExternalReference[0..*] | | ✓ | Referencias externas | FK inverso |
| / | season | Season | | ✓ | Navegación | FK |
| / | jornadas | Jornada[0..*] | | ✓ | Jornadas que usan esta competition | FK inverso |

**Responsabilidad:** Competencia en la que GEI participa. DRAFT→ACTIVE→CLOSED. Guard 0 inscripciones activas al cerrar. Referencia externa whitelist. Solo Subcomisión/Admin.

---

## 2.36 COMPETITION ENTRY (CL-35)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §4, §16, §25 |
| + | competitionId | UUID | ✓ | | FK → Competition | REQ-CMP-003 |
| + | scope | Enum<CompetitionEntryScope> | ✓ | | TEAM / LINE | PT §4 |
| + | teamId | UUID | | | FK → Team (si scope=TEAM) `{unique: competitionId+teamId}` | PT §16 |
| + | lineId | UUID | | | FK → Line (si scope=LINE) | PT §16 |
| + | seasonId | UUID | | | FK → Season (si scope=LINE) | PT §16 |
| + | state | Enum<CompetitionEntryState> | ✓ | | PENDING / ACTIVE / ENDED | SM-COMPETITIONENTRY-01 |
| + | activatedAt | DateTime | | | Non-null si ACTIVE | SM-COMPETITIONENTRY-01 |
| + | endedAt | DateTime | | | Non-null si ENDED | SM-COMPETITIONENTRY-01 |
| / | competition | Competition | | ✓ | Navegación | FK |
| / | team | Team[0..1] | | ✓ | Si scope=TEAM | FK |
| / | line | Line[0..1] | | ✓ | Si scope=LINE | FK |
| / | season | Season[0..1] | | ✓ | Si scope=LINE | FK |
| / | matches | Event[0..*] | | ✓ | Matches que usan esta inscripción (via Jornada) | FK inverso |

**Responsabilidad:** Inscripción de Team (scope TEAM) o Line (scope LINE) en Competition. PENDING→ACTIVE→ENDED. Scopes incompatibles → COMPETITION_SCOPE_MISMATCH. Uso en Match requiere scope compatible con jornada.

---

## 2.37 EXTERNAL REFERENCE (CL-36)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 15) |
| + | targetType | String | ✓ | | COMPETITION / COMPETITION_ENTRY / MATCH_EVENT | REQ-CMP-006 |
| + | targetId | UUID | ✓ | | FK según targetType | REQ-CMP-006 |
| + | externalId | String | ✓ | | ID en sistema externo | REQ-CMP-006 |
| + | externalSystem | String | ✓ | | Nombre sistema externo | REQ-CMP-006 |
| + | createdAt | DateTime | ✓ | | Timestamp | PT §25 |
| + | createdByPersonId | UUID | ✓ | | FK → Person | PT §25 |

**Responsabilidad:** Referencia manual a entidad de competencia. Target whitelist. No afirma sincronización. Límite federativo.

---

## 2.38 AUDIT ENTRY (CL-37)

| Vis | Atributo | Tipo | Oblig. | Derivado | Invariantes | Fuente |
|---|---|---|---|---|---|---|
| + | id | UUID | ✓ | | PK `{id}` | PT §25 (tabla 41) |
| + | occurredAt | DateTime | ✓ | | Timestamp del hecho | REQ-INS-009 |
| + | actorPersonId | UUID | ✓ | | FK → Person (quien actuó) | REQ-INS-009 |
| + | action | String | ✓ | | Qué cambió (vocabulario canónico) | REQ-INS-009 |
| + | targetType | String | ✓ | | Tipo de objeto afectado | REQ-INS-009 |
| + | targetId | UUID | ✓ | | ID del objeto afectado | REQ-INS-009 |
| + | reason | String | | | Motivo (cuando acción lo exige) | REQ-INS-009 |
| + | diff | JSON | | | Cambios (redactado para sensibles) | REQ-INS-009/010 |
| / | actor | Person | | ✓ | Navegación | FK |

**Responsabilidad:** Entrada append-only de auditoría. Qué cambió, quién, cuándo, motivo, enlace al objeto. Datos sensibles redactados. Sin contraseñas/hashes/tokens/cookies/cuerpos. Solo Admin consulta.

---

# 3. RESUMEN DE ATRIBUTOS

| Clase | Atributos almacenados | Atributos derivados | Enums propios |
|---|---|---|---|
| Person | 7 | 6 | — |
| Account | 8 | 3 | AccountStatus |
| Membership | 4 | 3 | — |
| TeamAssignment | 4 | 1 | — |
| RoleAssignment | 7 | 3 | RoleType, ScopeType |
| GuardianRelationship | 8 | 1 | RelationshipType |
| Season | 4 | 3 | — |
| Division | 3 | 2 | StructureArchivedStatus |
| Line | 4 | 2 | StructureArchivedStatus |
| Team | 6 | 4 | TeamStatus |
| Venue | 5 | 1 | StructureArchivedStatus |
| Event | 14 | 8 | EventType, EventState |
| Match | 8 | 2 | MatchResultType |
| EventSeries | 5 | 3 | EventSeriesState |
| EventOccurrenceOverride | 8 | 0 | — |
| Jornada | 4 | 3 | — |
| EventLogistics | 7 | 0 | — |
| EventTargetTeam | 5 | 0 | — |
| EventTargetPerson | 5 | 0 | — |
| Availability | 7 | 1 | AvailabilityValue, AvailabilityDerived |
| Selection | 3 | 2 | — |
| SelectionRevision | 6 | 1 | SelectionRevisionState |
| SelectionEntry | 5 | 0 | — |
| AttendanceSheet | 4 | 1 | AttendanceSheetState |
| AttendanceEntry | 10 | 1 | AttendanceValue, AttendanceDerived |
| MatchRecord | 13 | 1 | MatchRecordState, MatchResultType |
| PlayerMatchStats | 8 | 0 | — |
| EligibilityConstraint | 11 | 1 | EligibilityState, EligibilityDerived, EligibilityScope, EligibilitySource, EligibilityReason |
| Announcement | 7 | 2 | AnnouncementState |
| AnnouncementTargetTeam | 3 | 0 | — |
| Conversation | 8 | 2 | ConversationType, ConversationState |
| ConversationParticipant | 5 | 1 | — |
| Message | 9 | 0 | MessageState |
| Notification | 11 | 1 | NotificationType |
| Competition | 5 | 3 | CompetitionState |
| CompetitionEntry | 9 | 3 | CompetitionEntryState, CompetitionEntryScope |
| ExternalReference | 7 | 0 | — |
| AuditEntry | 8 | 0 | — |

**Total atributos almacenados: ~312** | **Total atributos derivados: ~62** | **Enums distintos: 27**

---

**Fin de Atributos y Tipos V1.**

*Este documento congela los atributos y tipos de cada clase canónica. E8-04 documentará operaciones completas.*