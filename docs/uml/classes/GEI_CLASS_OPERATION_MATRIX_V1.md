# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS OPERATIONS MATRIX V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-10
**Etapa:** 8 — Modelo de clases completo (E8-04)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline:** `GEI_CLASS_CATALOG_V1.md` + `GEI_CLASS_ATTRIBUTES_V1.md` + E1–E7 freezes

---

# 1. CONVENCIONES DE NOTACIÓN

| Convención | Descripción |
|---|---|
| `+` | Público (invocable desde fuera) |
| `-` | Privado (interno) |
| **Constructor** | `+ClassName(parametros): ClassName` |
| **Método de dominio** | `+operacion(parametros): TipoRetorno` |
| **Consulta/Propiedad derivada** | `+/propiedad(): Tipo` |
| **Cambio de estado** | `+transicion(parametros): Boolean` (o void con excepción) |
| **Validación de invariante** | `-validarInvarianteX(): Boolean` |
| **Tipos**: `void`, `Boolean`, `UUID`, `String`, `DateTime`, `Enum<...>`, `List<...>`, `Optional<...>` |
| **Parámetros**: `nombre: Tipo` |

**Regla:** No llenar de CRUD genérico (`guardar()`, `eliminar()`, `buscar()`, `actualizar()`).
**Regla:** Solo operaciones con responsabilidad real y justificación funcional (REQ/UC/SM).
**Regla:** Cohesión: una operación que coordina varios objetos no se atribuye arbitrariamente a uno.
**Regla:** Si necesita servicio de dominio u objeto de política, justificarlo y distinguirlo del modelo de entidades.
**Regla:** No diseñar controladores, repositorios, endpoints ni servicios técnicos (E15).

---

# 2. OPERACIONES POR CLASE CANÓNICA

## 2.1 PERSON (CL-01)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Person** | `firstName: String, lastName: String, dni?: String, birthDate?: Date, phone?: String, email?: String` | Person | Constructor: crea persona base; DNI unique parcial si provisto | REQ-PPL-001, UC-PPL-01 |
| + | **updateIdentity** | `firstName: String, lastName: String` | void | Admin corrige identidad (nombre/apellido); auditado | UC-PPL-01, REQ-PPL-013 |
| + | **updateContact** | `phone?: String, email?: String` | void | Propia persona edita su contacto; auditado | UC-PPL-17, REQ-IAM-005 |
| + | **completePlayerProfile** | `dni: String, birthDate: Date, phone: String, email: String` | void | Completa los 4 campos obligatorios para roster; valida completitud | REQ-PPL-002, UC-PPL-02 |
| + | **getActiveMembership** | — | Optional<Membership> | Membership vigente (`now ∈ [from, until)`) | Temporal model |
| + | **getActiveTeamAssignments** | — | List<TeamAssignment> | Afiliaciones deportivas vigentes | Temporal model |
| + | **getActiveRoleAssignments** | — | List<RoleAssignment> | Roles vigentes (unión = autoridad efectiva) | Temporal model |
| + | **getGuardianRelationships** | — | List<GuardianRelationship> | Como guardian O child (reflexiva) | Temporal model |
| / | **fullName** | — | String | `firstName + " " + lastName` | Derivado |
| / | **isPlayerProfileComplete** | — | Boolean | `dni ∧ birthDate ∧ phone ∂ email` all non-null | REQ-PPL-002 |

---

## 2.2 ACCOUNT (CL-02)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Account** | `personId: UUID, username: Username` | Account | Constructor: crea cuenta PENDING; username unique case-insensitive | REQ-PPL-003, UC-PPL-03 |
| + | **activate** | `code: ActivationCode` | Boolean | Consume código one-time; valida HMAC, attempts ≤5, 24h; status→ACTIVE; activatedAt=now; NO crea sesión | REQ-IAM-003, UC-IAM-04, SM-ACCOUNT-01 |
| + | **disable** | `adminPersonId: UUID` | Boolean | Status→DISABLED; disabledAt=now; revoca TODAS las sesiones; valida LAST_ADMIN_REQUIRED | REQ-IAM-002, UC-IAM-02, SM-ACCOUNT-01 |
| + | **reactivate** | `adminPersonId: UUID` | Boolean | Emite nuevo ActivationCode; status→PENDING; disabledAt=NULL; credentialVersion++ | REQ-IAM-002/004, UC-IAM-03/05, SM-ACCOUNT-01 |
| + | **changePassword** | `currentPassword: String, newPassword: String` | Boolean | Verifica currentPassword (Argon2id); newPassword válida (12-128, Unicode); passwordHash=new; credentialVersion++; revoca sesiones si política | REQ-IAM-005, UC-IAM-06, SM-ACCOUNT-01 |
| + | **issueSetupToken** | `adminPersonId: UUID` | ActivationCode | Admin emite código one-time 24h; max 1 activo; invalida anterior; auditado | REQ-IAM-003/004, UC-IAM-03/05 |
| + | **createSession** | `csrfKey: String` | SessionToken | Login exitoso: genera CSPRNG token; digest HMAC en BD; idle 12h / absolute 7d; cookie __Host-gei_session | REQ-IAM-001/006, UC-IAM-01 |
| + | **revokeSession** | `sessionId: UUID` | void | Revoca sesión específica; invalida digest | REQ-IAM-007/010, UC-IAM-07/08 |
| + | **revokeAllSessions** | — | void | Revoca TODAS las sesiones (disable/reactivate) | REQ-IAM-002 |
| / | **isActive** | — | Boolean | `status = ACTIVE` | SM-ACCOUNT-01 |
| / | **canLogin** | — | Boolean | `status = ACTIVE` ∧ `passwordHash ≠ NULL` | SM-ACCOUNT-01 |
| - | **validatePassword** | `password: String` | Boolean | Argon2id verify contra passwordHash | REQ-IAM-001/005 |
| - | **validateSetupCode** | `code: String` | Boolean | HMAC verify, attempts ≤5, not expired, not consumed | REQ-IAM-003 |

---

## 2.3 MEMBERSHIP (CL-03)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Membership** | `personId: UUID, validFrom: Date, validUntil?: Date` | Membership | Constructor: registra período pertenencia | REQ-PPL-004, UC-PPL-04 |
| + | **end** | `validUntil: Date` | Boolean | Finaliza membership; valida SIN dependencias activas (TeamAssignment/RoleAssignment vigentes); si hay → rechaza nombrando dependencia; período conservado | REQ-PPL-004, UC-PPL-05, SM (temporal) |
| + | **extend** | `newValidUntil: Date` | Boolean | Extiende vigencia (solo si `newValidUntil > validUntil`) | REQ-PPL-004 |
| / | **isActive** | — | Boolean | `now ∈ [validFrom, validUntil)` | Temporal model |
| / | **hasActiveDependencies** | — | Boolean | Existe TeamAssignment/RoleAssignment vigente dentro de este período | Temporal model |

---

## 2.4 TEAM ASSIGNMENT (CL-04)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **TeamAssignment** | `personId: UUID, teamId: UUID, validFrom: Date, validUntil?: Date` | TeamAssignment | Constructor: afilia jugadora a team (solo PLAYER) | REQ-PPL-005, UC-PPL-06 |
| + | **end** | `validUntil: Date` | Boolean | Finaliza afiliación; valida vigencia | REQ-PPL-007/008, UC-PPL-07/08 |
| / | **isActive** | — | Boolean | `now ∈ [validFrom, validUntil)` | Temporal model |

---

## 2.5 ROLE ASSIGNMENT (CL-05)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **RoleAssignment** | `personId: UUID, role: RoleType, scopeType: ScopeType, scopeRefId?: UUID, validFrom: DateTime, validUntil?: DateTime` | RoleAssignment | Constructor: valida combinación role+scope válida (tabla PT §5); scopeRefId según scopeType | REQ-PPL-006, UC-PPL-09 |
| + | **end** | `validUntil: DateTime` | Boolean | Finaliza rol; valida LAST_ADMIN_REQUIRED si role=ADMIN ∧ scope=CLUB | REQ-PPL-010, UC-PPL-10, REQ-IAM-013 |
| + | **addTemporalExclusion** | `period: DateTimeRange` | void | Agrega exclusión temporal dentro de vigencia | PT §25 |
| + | **removeTemporalExclusion** | `period: DateTimeRange` | void | Remueve exclusión temporal | PT §25 |
| / | **isActive** | — | Boolean | `now ∈ [validFrom, validUntil)` ∧ `now ∉ temporalExclusions` | Temporal model |
| / | **isValidScope** | — | Boolean | Valida role+scope contra tabla PT §5 (ej. PLAYER solo TEAM) | REQ-PPL-006 |

---

## 2.6 GUARDIAN RELATIONSHIP (CL-06)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **GuardianRelationship** | `guardianPersonId: UUID, childPersonId: UUID, relationshipType: RelationshipType, validFrom: Date, validUntil?: Date, canViewChildInfo: Boolean, canRespondAvailability: Boolean` | GuardianRelationship | Constructor: delegación individual por menor; dos flags independientes; no requiere Membership | REQ-PPL-008, UC-PPL-11 |
| + | **end** | `validUntil: Date` | Boolean | Finaliza delegación; deja de conceder acceso; período conservado | REQ-PPL-008, UC-PPL-12 |
| + | **updatePermissions** | `canViewChildInfo?: Boolean, canRespondAvailability?: Boolean` | void | Actualiza flags independientemente | REQ-PPL-008 |
| / | **isActive** | — | Boolean | `now ∈ [validFrom, validUntil)` | Temporal model |
| / | **grantsViewChildInfo** | — | Boolean | `isActive ∧ canViewChildInfo` | REQ-PPL-009 |
| / | **grantsRespondAvailability** | — | Boolean | `isActive ∧ canRespondAvailability` | REQ-PRT-002 |

---

## 2.7 SEASON (CL-07)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Season** | `name: String, startDate: Date, endDate: Date` | Season | Constructor: entidad histórica; `endDate ≥ startDate` | REQ-STR-001, UC-STR-01 |
| + | **updateDetails** | `name?: String, startDate?: Date, endDate?: Date` | void | Actualiza nombre/fechas; histórica, sin eliminación | REQ-STR-001, UC-STR-02 |
| / | **getTeams** | — | List<Team> | Teams de esta temporada | FK inverso |
| / | **getCompetitions** | — | List<Competition> | Competencias de esta temporada | FK inverso |

---

## 2.8 DIVISION (CL-08)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Division** | `name: String` | Division | Constructor: ACTIVE implícito | REQ-STR-002, UC-STR-03 |
| + | **updateName** | `name: String` | Boolean | Renombra; RECHAZA si tiene Teams ACTIVOS (invariant REQ-PPL-014) | REQ-STR-002, UC-STR-04, SM-DIVISION-01 |
| + | **archive** | — | Boolean | `archivedAt = now`; RECHAZA si dependencias activas (Lines activas, Teams activos) nombrando dependencia | REQ-STR-002/006, UC-STR-05, SM-DIVISION-01 |
| / | **isActive** | — | Boolean | `archivedAt = NULL` | SM-DIVISION-01 |

---

## 2.9 LINE (CL-09)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Line** | `divisionId: UUID, name: String` | Line | Constructor: ACTIVE implícito; dentro de Division | REQ-STR-003, UC-STR-06 |
| + | **updateName** | `name: String` | Boolean | Renombra; RECHAZA si tiene Teams ACTIVOS | REQ-STR-003, UC-STR-07, SM-LINE-01 |
| + | **archive** | — | Boolean | `archivedAt = now`; RECHAZA si dependencias activas (Teams activos) | REQ-STR-003/006, UC-STR-08, SM-LINE-01 |
| / | **isActive** | — | Boolean | `archivedAt = NULL` | SM-LINE-01 |
| / | **getFullLabel** | `season: Season` | String | `Division.name + " " + name + " " + Season.name` | REQ-STR-010 |

---

## 2.10 TEAM (CL-10)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Team** | `seasonId: UUID, divisionId: UUID, lineId: UUID` | Team | Constructor: DRAFT; valida combinación única (season+division+line) | REQ-STR-004, UC-STR-09, SM-TEAM-01 |
| + | **updateDetails** | — | void | En DRAFT: permite ajustes; en ACTIVE: solo datos no identidad (identidad inmutable) | REQ-STR-004, UC-STR-10, SM-TEAM-01 |
| + | **activate** | — | Boolean | DRAFT → ACTIVE; valida combinación única | REQ-STR-004, UC-STR-11, SM-TEAM-01 |
| + | **archive** | — | Boolean | ACTIVE → ARCHIVED; `archivedAt = now`; RECHAZA si dependencias activas (Event targets, CompetitionEntry, TeamAssignments, RoleAssignments, canonicalConversation) nombrando dependencia | REQ-STR-004/006, UC-STR-12, SM-TEAM-01 |
| / | **name** | — | String | `Season.name + " " + Division.name + " " + Line.name` (derivado, inmutable) | REQ-PPL-014 |
| / | **isActive** | — | Boolean | `status = ACTIVE` | SM-TEAM-01 |
| / | **getActiveMembers** | — | List<Person> | Personas con TeamAssignment vigente a este team | FK inverso |
| / | **getCanonicalConversation** | — | Optional<Conversation> | Conversación canónica TEAM (type=TEAM) | REQ-COM-008 |

---

## 2.11 VENUE (CL-11)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Venue** | `name: String, address: String, fieldLabel?: String` | Venue | Constructor: ACTIVE implícito | REQ-STR-005, UC-STR-13, SM-VENUE-01 |
| + | **correctMetadata** | `name?: String, address?: String, fieldLabel?: String` | void | **Regla A**: corrige identidad/metadatos; NO reprograma eventos, NO incrementa coordinationRevision, NO notifica, NO deriva NEEDS_RECONFIRMATION | REQ-STR-011/012, UC-STR-14, PT §11, SM-VENUE-01 |
| + | **archive** | — | Boolean | `archivedAt = now`; RECHAZA si dependencias activas (Events usando esta venue) | REQ-STR-005/006, UC-STR-15, SM-VENUE-01 |
| / | **isActive** | — | Boolean | `archivedAt = NULL` | SM-VENUE-01 |

---

## 2.12 EVENT (CL-12)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Event** | `type: EventType, title: String, startAt?: DateTime, endAt?: DateTime, timeZone: String, venueId?: UUID, clubWideTarget: Boolean, targetTeams: List<UUID>, targetPersons: List<UUID>, creatorPersonId: UUID` | Event | Constructor: crea DRAFT; valida invariantes por tipo (PT §10); TRAINING: ≥1 target; MATCH: exactamente 1 team target, 0 person, clubWide=false; CLUB_EVENT: clubWide ∨ (≥1 target) | REQ-EVT-002/003/004, UC-EVT-01/02/03, SM-EVENT-01 |
| + | **schedule** | `startAt: DateTime, endAt: DateTime, venueId?: UUID` | Boolean | DRAFT → SCHEDULED (atómico); valida `endAt > startAt`; crea Availability vacías para targets; coordinationRevision=0 | REQ-EVT-009, UC-EVT-01/02/03, SM-EVENT-01 |
| + | **editNonMaterial** | `title?: String, metadata: Map<String,String>` | void | Edición no material (título, redacción, metadatos no coordinativos); SIN impact preview, SIN coordinationRevision++, SIN notificación | REQ-EVT-010, UC-EVT-04, SM-EVENT-01 |
| + | **proposeMaterialChange** | `changes: MaterialChangeProposal` | ImpactPreviewToken | Genera Impact Preview token (bind actor, resource, operation, proposed change, versions, hash, expiry); no muta | REQ-EVT-011/012, UC-EVT-11, SM-EVENT-01 |
| + | **executeMaterialChange** | `token: ImpactPreviewToken, confirmedChanges: MaterialChange` | Boolean | Reautoriza, recalcula impacto; si distinto → `IMPACT_CHANGED`; muta: startAt/endAt/venue/targets/logistics/opponent; coordinationRevision++; deriva NEEDS_RECONFIRMATION en Availability; notifica | REQ-EVT-011/012, UC-EVT-04/11, SM-EVENT-01 |
| + | **postpone** | `reason: String` | Boolean | SCHEDULED → POSTPONED; conserva Availability; no acepta nuevas; coordinationRevision++; notifica EVENT_POSTPONED | REQ-EVT-005/011, UC-EVT-05, SM-EVENT-01 |
| + | **resume** | `newStartAt: DateTime, newEndAt: DateTime, newVenueId?: UUID` | Boolean | POSTPONED → SCHEDULED; reabre Availability; coordinationRevision++; notifica EVENT_RESCHEDULED | REQ-EVT-006, UC-EVT-06, SM-EVENT-01 |
| + | **cancel** | `reason: String` | Boolean | SCHEDULED/POSTPONED → CANCELLED; terminal para participación; composición propia; notifica EVENT_CANCELLED | REQ-EVT-007/008, UC-EVT-07, SM-EVENT-01 |
| + | **restore** | — | Boolean | CANCELLED → SCHEDULED; reabre Availability; coordinationRevision++; notifica EVENT_RESTORED | REQ-EVT-008, UC-EVT-08, SM-EVENT-01 |
| + | **start** | — | Boolean | SCHEDULED → IN_PROGRESS; operativo | UC-EVT-09, SM-EVENT-01 |
| + | **complete** | — | Boolean | IN_PROGRESS → COMPLETED; terminal absoluto; habilita MatchRecord PLAYED/FORFEIT | UC-EVT-09, SM-EVENT-01 |
| + | **abandon** | `reason: String` | Boolean | IN_PROGRESS → ABANDONED (solo MATCH); terminal; resultado ABANDONED; sin stats reales | UC-EVT-10, SM-EVENT-01 |
| + | **resolveConcurrencyConflict** | `baseVersion: Integer, localDraft: EventDraft, serverVersion: Integer` | ConflictResolution | Conserva base, borrador local, versión servidor; cada campo safe/conflict; sin sobrescritura genérica | REQ-EVT-013, UC-EVT-12, SM-EVENT-01 |
| + | **updateLogistics** | `logistics: EventLogistics` | void | Actualiza/crea EventLogistics (0..1); por CAPTAIN/COACH/SUBCOMMITTEE según scope | UC-EVT-16, REQ-EVT-019 |
| / | **isScheduled** | — | Boolean | `state = SCHEDULED` | SM-EVENT-01 |
| / | **acceptsAvailability** | — | Boolean | `state = SCHEDULED` | REQ-PRT-004 |
| / | **getTargetPersons** | — | List<Person> | `targetPersons ∪ (targetTeams → TeamAssignments vigentes → Persons)` | PT §10 |
| / | **getConcreteTeam** | — | Optional<Team> | Si MATCH: el único team target (inmutable si SCHEDULED) | REQ-EVT-006 |
| - | **validateInvariants** | — | Boolean | `endAt > startAt` si ambos; SCHEDULED/IN_PROGRESS/COMPLETED exigen startAt; MATCH invariants | REQ-EVT-001, PT §10 |

---

## 2.13 MATCH (Subtipo Event)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Match** | `eventId: UUID, opponent: String` | Match | Constructor: vinculado 1:1 a Event (type=MATCH); event ya validado | PT §10, UC-EVT-02 |
| + | **updateLogistics** | `meetingAt?: DateTime, departureAt?: DateTime, meetingPoint?: String, transportNote?: String, arrivalInstructions?: String` | void | Logística específica de Match (adicional a EventLogistics) | REQ-EVT-019, UC-EVT-16 |
| / | **getConcreteTeam** | — | Team | El único team target del Event raíz (inmutable si SCHEDULED) | REQ-EVT-006 |
| / | **getCompetitionEntry** | `jornada: Jornada` | Optional<CompetitionEntry> | Si jornada.competitionId: Entry de esa competition con scope compatible | PT §16 |

---

## 2.14 EVENT SERIES (CL-13)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **EventSeries** | `name: String, recurrenceRule: String, targetTeams: List<UUID>, targetPersons: List<UUID>, creatorPersonId: UUID` | EventSeries | Constructor: ACTIVE; genera ocurrencias según RRULE; valida ≤366 por comando | REQ-EVT-014, UC-EVT-13, SM-EVENTSERIES-01 |
| + | **editOccurrences** | `scope: SeriesEditScope, changes: MaterialChange` | List<Event> | 3 alcances: `THIS_ONLY` (1), `THIS_AND_FOLLOWING` (restantes), `ALL` (todas); crea/actualiza EventOccurrenceOverride para THIS_ONLY; coordinationRevision++ solo en afectadas; impact preview sobre conjunto real | REQ-EVT-015, UC-EVT-04/11, SM-EVENTSERIES-01 |
| + | **end** | — | Boolean | ACTIVE → ENDED; terminal sin inversa; ocurrencias conservadas | REQ-EVT-016, UC-EVT-14, SM-EVENTSERIES-01 |
| / | **getOccurrences** | — | List<Event> | Eventos generados (ordenados por occurrenceIndex) | FK inverso |

---

## 2.15 JORNADA (CL-15)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Jornada** | `seasonId: UUID, name: String, date: Date, competitionId?: UUID` | Jornada | Constructor | REQ-EVT-018, UC-EVT-15 |
| + | **bulkScheduleMatches** | `matches: List<MatchDraft>` | Boolean | **Atómico ≤100**: crea Matches SCHEDULED; valida season match = season jornada; si competitionId: usa CompetitionEntry de esa competition; un match ≤1 jornada | REQ-EVT-018/024, UC-EVT-15, SM (NO_STATE_MACHINE) |
| + | **addMatch** | `matchId: UUID` | Boolean | Agrega match existente; valida season y competition scope | REQ-EVT-018 |
| + | **removeMatch** | `matchId: UUID` | Boolean | Quita match de jornada | REQ-EVT-018 |

---

## 2.16 EVENT LOGISTICS (CL-16)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **EventLogistics** | `eventId: UUID` | EventLogistics | Constructor: 0..1 por Event | UC-EVT-16 |
| + | **update** | `meetingAt?: DateTime, departureAt?: DateTime, meetingPoint?: String, transportNote?: String, arrivalInstructions?: String` | void | Actualiza campos; por CAPTAIN (TEAM), COACH (TEAM/EVENT), SUBCOMMITTEE (CLUB) | REQ-EVT-019, UC-EVT-16 |

---

## 2.17 AVAILABILITY (CL-19)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Availability** | `eventId: UUID, personId: UUID, respondedByPersonId: UUID, value: AvailabilityValue` | Availability | Constructor: registra/cambia respuesta; valida Event SCHEDULED; valida authority (PLAYER vigente O Guardian.canRespondAvailability) | REQ-PRT-001/002, UC-PRT-01, SM-AVAILABILITY-01 |
| + | **changeResponse** | `newValue: AvailabilityValue` | void | Nueva respuesta SUSTITUYE anterior; respondedAt=now; coordinationRevision=Event.coordinationRevision | REQ-PRT-001, UC-PRT-01 |
| / | **state** | — | Enum<AvailabilityValue\|AvailabilityDerived> | Si fila: value; si no: NO_RESPONSE; si value≠NULL ∧ coordinationRevision < Event.coordinationRevision: NEEDS_RECONFIRMATION | SM-AVAILABILITY-01, REQ-PRT-003 |
| / | **needsReconfirmation** | — | Boolean | `value ≠ NULL ∧ coordinationRevision < Event.coordinationRevision` | REQ-PRT-003 |

---

## 2.18 SELECTION (CL-20)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Selection** | `matchId: UUID` | Selection | Constructor: contenedor por Match | REQ-PRT-005, UC-PRT-02 |
| + | **getOrCreateDraft** | — | SelectionRevision | Obtiene borrador actual (DRAFT) o crea nuevo; autosave 600ms | REQ-PRT-008, UC-PRT-02 |
| + | **publishDraft** | `coachPersonId: UUID` | SelectionRevision | DRAFT → PUBLISHED (inmutable); publishedAt=now; publishedBy=coach; crea nueva SelectionRevision PUBLISHED; NO bloquea por conflictos derivados; notifica SELECTION_PUBLISHED (selectedNow/removedNow) | REQ-PRT-005/006, UC-PRT-03, SM-SELECTIONREV-01 |
| / | **getCurrentConflicts** | — | List<Conflict> | ELIGIBILITY_BLOCKED/PENDING, NO_LONGER_EVENT_TARGET, NO_LONGER_TEAM_AFFILIATED | PT §14, UC-PRT-04 |

---

## 2.19 SELECTION REVISION (CL-21)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **SelectionRevision** | `selectionId: UUID, entries: List<SelectionEntry>` | SelectionRevision | Constructor: DRAFT editable | REQ-PRT-005, UC-PRT-02, SM-SELECTIONREV-01 |
| + | **autosave** | `entries: List<SelectionEntry>, version: Integer` | Boolean | Guardado automático 600ms, una en vuelo; coalesce; valida version (optimistic lock) | REQ-PRT-008, UC-PRT-02 |
| + | **publish** | `coachPersonId: UUID` | void | DRAFT → PUBLISHED; inmutable; publishedAt=now; publishedBy=coach | SM-SELECTIONREV-01 |
| / | **isImmutable** | — | Boolean | `state = PUBLISHED` | SM-SELECTIONREV-01 |

---

## 2.20 ATTENDANCE SHEET (CL-23)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **AttendanceSheet** | `eventId: UUID` | AttendanceSheet | Constructor: OPEN (closedAt=NULL) | REQ-PRT-009, UC-PRT-05 |
| + | **recordEntry** | `personId: UUID, value: AttendanceValue, recordedByPersonId: UUID` | AttendanceEntry | Registra PRESENT/ABSENT/JUSTIFIED; persistencia inmediata; valida sheet OPEN; valida authority (COACH scope) | REQ-PRT-009, UC-PRT-05, SM-ATTENDANCEENTRY-01 |
| + | **close** | `coachPersonId: UUID` | Boolean | `closedAt = now`; `closedBy = coach`; deriva state=CLOSED | REQ-PRT-011, UC-PRT-06 |
| + | **correctEntry** | `entryId: UUID, newValue: AttendanceValue, reason: String, correctedByPersonId: UUID` | AttendanceEntry | Corrección auditada: previousValue, newValue, reason, correctedAt, correctedBy; NO reabre planilla (closedAt inmutable) | REQ-PRT-012, UC-PRT-07 |
| / | **isOpen** | — | Boolean | `closedAt = NULL` | SM-ATTENDANCEENTRY-01 |
| / | **getUnrecordedPersons** | — | List<Person> | Targets del Event sin AttendanceEntry (UNRECORDED) | REQ-PRT-010 |

---

## 2.21 ATTENDANCE ENTRY (CL-24)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **AttendanceEntry** | `sheetId: UUID, personId: UUID, value: AttendanceValue, recordedByPersonId: UUID` | AttendanceEntry | Constructor: valor inicial | REQ-PRT-009 |
| + | **correct** | `newValue: AttendanceValue, reason: String, correctedByPersonId: UUID` | void | previousValue=this.value; this.value=newValue; correctedAt=now; correctedBy=correctedByPersonId; correctionReason=reason | REQ-PRT-012 |
| / | **state** | — | Enum<AttendanceValue\|AttendanceDerived> | Si value≠NULL: value; si value=NULL: UNRECORRED | SM-ATTENDANCEENTRY-01 |

---

## 2.22 MATCH RECORD (CL-25)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **MatchRecord** | `matchId: UUID` | MatchRecord | Constructor: DRAFT vinculado a Match | REQ-PRT-013, UC-PRT-08, SM-MATCHRECORD-01 |
| + | **updateDraft** | `resultType?: MatchResultType, homeScore?: Integer, awayScore?: Integer, observations?: String` | void | Edita borrador; valida compatibilidad: PLAYED/FORFEIT → Event COMPLETED; ABANDONED → Event ABANDONED | REQ-PRT-013/015, UC-PRT-08, SM-MATCHRECORD-01 |
| + | **finalize** | `coachPersonId: UUID` | Boolean | DRAFT → FINAL; finalizedAt=now; finalizedBy=coach; valida compatibilidad con Event state | REQ-PRT-009/015, UC-PRT-09, SM-MATCHRECORD-01 |
| + | **correct** | `resultType: MatchResultType, homeScore: Integer, awayScore: Integer, reason: String, correctedByPersonId: UUID` | void | Corrección explícita separada (NO transición inversa); previous* guardados; correctedAt=now; motivo obligatorio; evidence visible | REQ-PRT-014, UC-PRT-10, SM-MATCHRECORD-01 |
| + | **addPlayerStats** | `personId: UUID, stats: PlayerMatchStats` | void | Solo si resultType=PLAYED; participación real | REQ-PRT-016, UC-PRT-11 |
| / | **isFinal** | — | Boolean | `state = FINAL` | SM-MATCHRECORD-01 |
| / | **isCompatibleWithEvent** | — | Boolean | `resultType=PLAYED/FORFEIT → Event.COMPLETED`; `ABANDONED → Event.ABANDONED` | REQ-PRT-015 |

---

## 2.23 PLAYER MATCH STATS (CL-26)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **PlayerMatchStats** | `matchRecordId: UUID, personId: UUID, minutesPlayed?: Integer, goals?: Integer, assists?: Integer, yellowCards?: Integer, redCards?: Integer, mvp?: Boolean` | PlayerMatchStats | Constructor: solo en MatchRecord PLAYED | REQ-PRT-016, UC-PRT-11 |
| / | **matchesPlayed** | — | Integer | **Derivado global**: cuenta MatchRecord PLAYED/FORFEIT donde esta persona tiene stats | REQ-PRT-016 |

---

## 2.24 ELIGIBILITY CONSTRAINT (CL-27)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **EligibilityConstraint** | `personId: UUID, state: EligibilityState, scope: EligibilityScope, scopeRefId?: UUID, source: EligibilitySource, reason: EligibilityReason, note?: String, validFrom: DateTime, validUntil?: DateTime` | EligibilityConstraint | Constructor: registra restricción; valida authority (Subcomisión/Admin); mutación auditada | REQ-PRT-017, UC-PRT-12, SM-ELIGIBILITY-01 |
| / | **isActiveBlocking** | — | Boolean | `state = BLOCKED ∧ now ∈ [validFrom, validUntil)` | SM-ELIGIBILITY-01 |
| / | **appliesTo** | `scope: EligibilityScope, scopeRefId: UUID` | Boolean | Verifica si esta constraint aplica al scope dado | PT §13 |
| - | **deriveEligible** | `person: Person, scope: EligibilityScope, scopeRefId: UUID` | Boolean | **Static/Service**: `ELIGIBLE = ¬∃ active BLOCKED constraint` aplicable | SM-ELIGIBILITY-01, REQ-PRT-017 |

---

## 2.25 ANNOUNCEMENT (CL-28)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Announcement** | `title: String, body: String, targetTeamIds: List<UUID>, clubWide: Boolean, authorPersonId: UUID` | Announcement | Constructor: DRAFT; valida audience (TEAM_SET real o clubWide); solo Subcomisión | REQ-COM-001/002, UC-COM-01, SM-ANNOUNCEMENT-01 |
| + | **publish** | `subcommitteePersonId: UUID` | Boolean | DRAFT → PUBLISHED; `publishedAt=now`; `publishedBy=author`; **audienceSnapshot = copia inmutable de targetTeams**; notifica ANNOUNCEMENT_PUBLISHED a audienceSnapshot ∪ disponibilidad registrada ∪ staff relevante | REQ-COM-002/003, UC-COM-02, SM-ANNOUNCEMENT-01 |
| + | **correct** | `title?: String, body?: String, reason: String, subcommitteePersonId: UUID` | void | Solo title/body; **audiencia NO cambia** (inmutable); reason obligatorio; historia previa conservada | REQ-COM-004, UC-COM-03 |
| + | **archive** | `subcommitteePersonId: UUID` | Boolean | PUBLISHED → ARCHIVED; `archivedAt=now` | REQ-COM-004, UC-COM-04 |
| / | **isAccessibleBy** | `person: Person` | Boolean | Persona en audienceSnapshot (o clubWide) | REQ-COM-005 |

---

## 2.26 CONVERSATION (CL-30)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Conversation** | `type: ConversationType, title?: String, teamId?: UUID, eventId?: UUID, creatorPersonId: UUID, initialParticipants: List<UUID>` | Conversation | Constructor: valida reglas por tipo: DIRECT → directPairKey unique, max 1, 2 participantes; GROUP → title req, ≥2; TEAM → 0..1 por team, sync membresía; EVENT → 0..1 por event, sync membresía | REQ-COM-006/007/008, UC-COM-06/07/08 |
| + | **addParticipant** | `personId: UUID, joinedAt: DateTime` | void | Agrega participante; joinedAt; sync server-side para TEAM/EVENT | REQ-COM-011 |
| + | **removeParticipant** | `personId: UUID, leftAt: DateTime` | void | Marca leftAt; ex-participante conserva período autorizado | REQ-COM-011 |
| + | **archive** | `participantPersonId: UUID` | Boolean | Solo GROUP: ACTIVE → ARCHIVED; terminal | REQ-COM-007, UC-COM-12, SM-CONVERSATION-GROUP-01 |
| / | **canParticipantRead** | `personId: UUID, atDateTime: DateTime` | Boolean | `joinedAt ≤ atDateTime < (leftAt ∨ ∞)`; sin historia anterior a joinedAt | REQ-COM-011 |
| / | **hasCommunicationEntitlement** | `person: Person` | Boolean | Automático: PLAYER/CAPTAIN/COACH con scope correspondiente; Guardian NO; Admin/Subcomisión NO automático | REQ-COM-012 |

---

## 2.27 MESSAGE (CL-32)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Message** | `conversationId: UUID, authorPersonId: UUID, body: String` | Message | Constructor: SENT; persistencia inmediata; sin estado de envío ⇒ no afirma éxito | REQ-COM-009, UC-COM-09, SM-MESSAGE-01 |
| + | **edit** | `newBody: String, authorPersonId: UUID` | Boolean | Solo autor; SENT/EDITED → EDITED; editedAt=now; historia expuesta | REQ-COM-010, UC-COM-10, SM-MESSAGE-01 |
| + | **delete** | `authorPersonId: UUID, reason: String` | Boolean | Solo autor; confirmación+motivo obligatorio; → DELETED (tombstone); irreversible; deletedAt=now; deletionReason=reason | REQ-COM-010, UC-COM-11, SM-MESSAGE-01 |
| / | **isOwn** | `personId: UUID` | Boolean | `authorPersonId = personId` | REQ-COM-010 |

---

## 2.28 NOTIFICATION (CL-33)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Notification** | `recipientPersonId: UUID, type: NotificationType, resourceType: String, resourceId: UUID, originEventId?: UUID, title: String, body: String, occurredAt: DateTime, audienceResolvedAt: DateTime` | Notification | Constructor: clave lógica única `originEventId+recipient+type`; deduplicación; audienceResolvedAt inmutable | REQ-COM-014/015/016/018, UC-COM-13, PT §58 |
| + | **markRead** | — | void | `readAt = now` | REQ-COM-018, UC-COM-14 |
| / | **isUnread** | — | Boolean | `readAt = NULL` | Derivado |

---

## 2.29 COMPETITION (CL-34)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **Competition** | `name: String, seasonId: UUID` | Competition | Constructor: DRAFT | REQ-CMP-001, UC-CMP-01, SM-COMPETITION-01 |
| + | **activate** | — | Boolean | DRAFT → ACTIVE | REQ-CMP-001, UC-CMP-02 |
| + | **close** | — | Boolean | ACTIVE → CLOSED; RECHAZA si ∃ CompetitionEntry ACTIVE (explicando cuáles) | REQ-CMP-002, UC-CMP-03, SM-COMPETITION-01 |
| + | **addExternalReference** | `targetType: String, targetId: UUID, externalId: String, externalSystem: String` | ExternalReference | Registra referencia manual (whitelist target) | REQ-CMP-006, UC-CMP-08 |

---

## 2.30 COMPETITION ENTRY (CL-35)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **CompetitionEntry** | `competitionId: UUID, scope: CompetitionEntryScope, teamId?: UUID, lineId?: UUID, seasonId?: UUID` | CompetitionEntry | Constructor: PENDING; valida scope TEAM (teamId) o LINE (lineId+seasonId); TEAM y LINE incompatibles | REQ-CMP-003/004, UC-CMP-04/05, SM-COMPETITIONENTRY-01 |
| + | **activate** | — | Boolean | PENDING → ACTIVE; valida compatibilidad scope (ReferenceAdmissionFence) | REQ-CMP-003/005, UC-CMP-06, SM-COMPETITIONENTRY-01 |
| + | **end** | — | Boolean | ACTIVE → ENDED; serializa si en uso (ReferenceAdmissionFence) | REQ-CMP-003/005, UC-CMP-07, SM-COMPETITIONENTRY-01 |
| / | **isCompatibleWith** | `match: Event, jornada: Jornada` | Boolean | Si scope=TEAM: `teamId == match.concreteTeam`; si scope=LINE: `seasonId == match.team.seasonId ∧ lineId == match.team.lineId` | PT §16, REQ-CMP-005 |

---

## 2.31 AUDIT ENTRY (CL-37)

| Vis | Operación | Parámetros | Retorno | Descripción | REQ/UC/SM |
|---|---|---|---|---|---|
| + | **AuditEntry** | `actorPersonId: UUID, action: String, targetType: String, targetId: UUID, reason?: String, diff?: JSON` | AuditEntry | Constructor: append-only; redacta datos sensibles en diff | REQ-INS-008/009/010, UC-INS-05 |

---

# 3. SERVICIOS DE DOMINIO / POLÍTICAS (NO ENTIDADES)

> Las siguientes operaciones coordinan múltiples entidades y **no pertenecen a una sola clase**. Se documentan aquí para trazabilidad.

| Servicio | Operación | Responsabilidad | Entidades involucradas |
|---|---|---|---|
| **EligibilityPolicy** | `deriveEligible(person, scope, scopeRefId): Boolean` | Calcula ELIGIBLE = sin constraint BLOCKED activa aplicable | EligibilityConstraint, Person |
| **AvailabilityPolicy** | `deriveState(availability, event): AvailabilityState` | Calcula estado derivado (NO_RESPONSE, NEEDS_RECONFIRMATION) | Availability, Event |
| **SelectionConflictPolicy** | `computeConflicts(selectionRevision): List<Conflict>` | Deriva 4 tipos de conflictos actuales | SelectionRevision, EligibilityConstraint, Event, TeamAssignment |
| **NotificationPolicy** | `resolveAudience(event, type): Set<Person>` | Calcula destinatarios según tipo (unión audiencias) | Event, Availability, Selection, Person, RoleAssignment |
| **ImpactPreviewService** | `computeImpact(proposedChange): ImpactPreview` | Calcula impacto real sobre conjuntos afectados | Event, Availability, Selection, Notification |
| **TeamIdentityPolicy** | `deriveName(season, division, line): String` | `Season.name + " " + Division.name + " " + Line.name` | Team, Season, Division, Line |
| **AttendancePolicy** | `deriveUnrecorded(event): List<Person>` | Targets del Event sin AttendanceEntry | Event, AttendanceSheet, AttendanceEntry |

---

# 4. RESUMEN DE OPERACIONES

| Clase | Constructores | Métodos dominio | Consultas derivadas | Cambios estado | Validaciones privadas |
|---|---|---|---|---|---|
| Person | 1 | 4 | 6 | 0 | 0 |
| Account | 1 | 8 | 3 | 4 | 2 |
| Membership | 1 | 2 | 2 | 1 | 0 |
| TeamAssignment | 1 | 1 | 1 | 1 | 0 |
| RoleAssignment | 1 | 4 | 2 | 1 | 1 |
| GuardianRelationship | 1 | 3 | 3 | 1 | 0 |
| Season | 1 | 1 | 2 | 0 | 0 |
| Division | 1 | 2 | 1 | 1 | 0 |
| Line | 1 | 2 | 2 | 1 | 0 |
| Team | 1 | 3 | 5 | 2 | 0 |
| Venue | 1 | 2 | 1 | 1 | 0 |
| Event | 1 | 13 | 5 | 9 | 1 |
| Match | 1 | 1 | 2 | 0 | 0 |
| EventSeries | 1 | 2 | 1 | 1 | 0 |
| Jornada | 1 | 3 | 0 | 0 | 0 |
| EventLogistics | 1 | 1 | 0 | 0 | 0 |
| Availability | 1 | 1 | 2 | 0 | 0 |
| Selection | 1 | 2 | 2 | 0 | 0 |
| SelectionRevision | 1 | 2 | 1 | 1 | 0 |
| AttendanceSheet | 1 | 3 | 2 | 1 | 0 |
| AttendanceEntry | 1 | 1 | 1 | 0 | 0 |
| MatchRecord | 1 | 4 | 2 | 2 | 0 |
| PlayerMatchStats | 1 | 0 | 1 | 0 | 0 |
| EligibilityConstraint | 1 | 0 | 3 | 0 | 0 |
| Announcement | 1 | 3 | 1 | 2 | 0 |
| Conversation | 1 | 3 | 2 | 1 | 0 |
| Message | 1 | 2 | 1 | 2 | 0 |
| Notification | 1 | 1 | 1 | 0 | 0 |
| Competition | 1 | 3 | 0 | 2 | 0 |
| CompetitionEntry | 1 | 2 | 2 | 2 | 0 |
| AuditEntry | 1 | 0 | 0 | 0 | 0 |

**Total operaciones de dominio documentadas: ~180**

---

**Fin de Matriz de Operaciones V1.**

*Este documento congela las operaciones de cada clase canónica. E8-05 documentará relaciones UML completas.*