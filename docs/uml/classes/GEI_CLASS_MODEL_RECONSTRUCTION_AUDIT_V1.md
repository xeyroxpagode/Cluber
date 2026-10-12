# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS MODEL RECONSTRUCTION AUDIT V1

**Estado:** EN PROGRESO · **Versión:** V1 · **Fecha:** 2026-10-10
**Etapa:** 8 — Modelo de clases completo (E8-01)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline E7:** `fa7687f1b9622524fbbefa608c3d90967624e1e9` (`gei/e7-activity-diagrams-freeze-v1`, FROZEN · PASS)

---

# 1. AUTORIDADES FUNCIONALES UTILIZADAS

| Documento | Versión | Estado | Rol en esta auditoría |
|---|---|---|---|
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | v1.0.1 | FROZEN | Contrato de producto y dominio; manda sobre todo |
| `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` | V1 | FROZEN | 157 REQ IN con criterios de aceptación |
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` | V1 | FROZEN | 8 actores canónicos, scopes, authority sources |
| `docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` | V1 | FROZEN | 102 CU canónicos con goals, actores, REQ de soporte |
| `docs/uml/states/GEI_STATE_MODEL_CATALOG_V1.md` | V1 | COMPLETO | 17 máquinas de estado + modelos temporales/derivados |
| `docs/uml/activities/GEI_ACTIVITY_DIAGRAM_FREEZE_V1.md` | V1 | PASS | 14 procesos de actividad con contratos de flujo |

**Regla:** Ninguna decisión nueva de arquitectura, persistencia o UI puede imponerse sobre estas autoridades.
**Regla:** `src/**` sólo sirve como evidencia secundaria.

---

# 2. METODOLOGÍA DE EXTRACCIÓN

Se han extraído **conceptos sustantivos** de las autoridades funcionales (E1–E7), clasificándolos según:

| Clasificación | Significado |
|---|---|
| `CANONICAL_CLASS` | Entidad de dominio con identidad, ciclo de vida, atributos y operaciones propias; responsabilidad cohesiva |
| `VALUE_OBJECT` | Objeto inmutable definido por sus valores; sin identidad propia; se comparte por valor |
| `ENUMERATION` | Conjunto cerrado de valores con semántica de dominio; no es entidad |
| `ASSOCIATION_CLASS` | Relación con identidad, atributos, vigencia o autoridad propia; justificada funcionalmente |
| `DERIVED_CONCEPT` | Calculado a partir de otros; no se persiste como entidad independiente |
| `NOT_A_CLASS` | Concepto que no justifica clase UML (actor, estado, pantalla, operación, proyección) |
| `NEEDS_DECISION` | Ambigüedad bloqueante que requiere decisión de producto antes de modelar |

**Principio:** No convertir todos los sustantivos en clases. Cada candidato debe tener fuente y justificación.

---

# 3. CANDIDATOS EXTRAÍDOS POR DOMINIO

## 3.1 IDENTIDAD Y PERSONAS (IAM / PPL)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **Person** | PT §17, §25; REQ-PPL-001/002; UC-PPL-01/02/16 | `CANONICAL_CLASS` | Entidad base con identidad estable; nombre/apellido obligatorios; DNI único parcial; datos opcionales; no se elimina (historia) |
| **Account** | PT §9, §25; REQ-IAM-001–015; UC-IAM-01–10; SM-ACCOUNT-01 | `CANONICAL_CLASS` | Identidad digital separada de Person; lifecycle PENDING→ACTIVE↔DISABLED; username único inmutable; credencial Argon2id; sesión opaca |
| **Membership** | PT §17, §25; REQ-PPL-004; UC-PPL-04/05 | `CANONICAL_CLASS` | Período de pertenencia al club `[valid_from, valid_until)`; vigencia temporal; afiliaciones/roles internos requieren membership vigente; se finaliza con dependencias → rechazado; historia conservada |
| **TeamAssignment** | PT §17, §25; REQ-PPL-005/007; UC-PPL-06/07/08 | `CANONICAL_CLASS` | Afiliación deportiva a Team (solo PLAYER); vigencia temporal; distinta de Membership y RoleAssignment; Coach usa RoleAssignment |
| **RoleAssignment** | PT §5, §17, §25; REQ-PPL-006/009/010; UC-PPL-09/10 | `CANONICAL_CLASS` | Rol + scope (CLUB/TEAM/EVENT) + vigencia temporal; 5 roles: PLAYER, CAPTAIN, COACH, SUBCOMMITTEE, ADMIN; combinación inválida → INVALID_ROLE_SCOPE; multi-rol = unión |
| **GuardianRelationship** | PT §5, §17, §20, §25; REQ-PPL-008/009/011/012; UC-PPL-11/12/13/14 | `CANONICAL_CLASS` | Relación delegada (no rol); guardian_person + child_person + relationship_type + vigencia + flags independientes `can_view_child_info`, `can_respond_availability`; individual por menor; no requiere Membership |
| **Username** | PT §9, §25; REQ-IAM-014 | `VALUE_OBJECT` | Valor inmutable, case-insensitive unique; parte de Account; no entidad independiente |
| **Password/Credential** | PT §48; REQ-IAM-015 | `VALUE_OBJECT` | Argon2id hash; versionado; parte de Account; no entidad independiente |
| **Session** | PT §49, §53; REQ-IAM-008/011 | `VALUE_OBJECT` | Token opaco + digest HMAC; idle 12h / absolute 7d; multi-tab propagation; no entidad de dominio |
| **ActivationCode** | PT §51; REQ-IAM-003 | `VALUE_OBJECT` | Código HMAC de un solo uso, 24h, 5 intentos; max 1 activo; consumido en activación; no entidad |

## 3.2 ESTRUCTURA DEL CLUB (STR)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **Season** | PT §19, §25; REQ-STR-001; UC-STR-01/02; SM (NO_STATE_MACHINE) | `CANONICAL_CLASS` | Entidad histórica con nombre y fechas; sin estado (no lifecycle); no hard-delete; identidad estable |
| **Division** | PT §19, §25; REQ-STR-002; UC-STR-03/04/05; SM-DIVISION-01 | `CANONICAL_CLASS` | Lifecycle ACTIVE→ARCHIVED (archived_at); renombrar con equipos activos rechazado; historia conservada; valla dependencias |
| **Line** | PT §19, §25; REQ-STR-003; UC-STR-06/07/08; SM-LINE-01 | `CANONICAL_CLASS` | Igual que Division; dentro de Division; etiqueta completa incluye división+temporada |
| **Team** | PT §19, §25; REQ-STR-004; UC-STR-09–12; SM-TEAM-01 | `CANONICAL_CLASS` | **Identidad = Season + Division + Line** (única inmutable); lifecycle DRAFT→ACTIVE→ARCHIVED; valla dependencias al archivar; nombre derivado |
| **Venue** | PT §19, §25; REQ-STR-005/011/012/013; UC-STR-13/14/15; SM-VENUE-01 | `CANONICAL_CLASS` | Identidad estable por ID; nombre/dirección/field_label corregibles (Regla A: no reprograma); lifecycle ACTIVE→ARCHIVED; valla dependencias |

## 3.3 EVENTOS (EVT)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **Event** | PT §9, §10, §11, §12, §14, §15, §16, §25; REQ-EVT-001–024; UC-EVT-01–19; SM-EVENT-01 | `CANONICAL_CLASS` | Raíz común; 7 estados (DRAFT→SCHEDULED→{POSTPONED,CANCELLED,IN_PROGRESS}→{COMPLETED,ABANDONED}); subtipos TRAINING/MATCH/CLUB_EVENT; invariantes de fecha, destinatarios, coordination_revision |
| **EventSeries** | PT §9; REQ-EVT-014/015/016; UC-EVT-13/14; SM-EVENTSERIES-01 | `CANONICAL_CLASS` | Contenedor de ocurrencias; lifecycle ACTIVE→ENDED; máx 366 ocurrencias; 3 alcances de edición (esta/siguientes/toda); coordination_revision por ocurrencia |
| **EventOccurrenceOverride** | PT §25 (tabla 23); REQ-EVT-015 | `CANONICAL_CLASS` | Anulación específica de una ocurrencia en serie; identidad propia; parte de EventSeries |
| **Training** | PT §9, §10, §25; REQ-EVT-002; UC-EVT-01 | `DERIVED_CONCEPT` | Subtipo de Event (type=TRAINING); ≥1 Team o Person target; no Match subtype row; no herencia real — discriminación por tipo |
| **Match** | PT §9, §10, §25; REQ-EVT-003/006; UC-EVT-02; SM-EVENT-01 (subtipo) | `DERIVED_CONCEPT` | Subtipo de Event (type=MATCH); exactamente 1 team target, 0 person targets, club_wide=false; subtipo row obligatorio; team inmutable una vez SCHEDULED; transición extra IN_PROGRESS→ABANDONED |
| **ClubEvent** | PT §9, §10, §25; REQ-EVT-004; UC-EVT-03 | `DERIVED_CONCEPT` | Subtipo de Event (type=CLUB_EVENT); club_wide=true (0 team/person targets) O dirigido (≥1 target); no Match row |
| **Jornada** | PT §16, §25; REQ-EVT-018/024; UC-EVT-15; SM (NO_STATE_MACHINE) | `CANONICAL_CLASS` | Agrupa Matches de una jornada operativa; bulk atómico ≤100; season del match = season de jornada; competition_id opcional → usa CompetitionEntry de esa competition; no duplica lifecycle de Matches |
| **EventTargetTeam** | PT §10, §25 (tabla 21) | `ASSOCIATION_CLASS` | Event ↔ Team (N:M); plurales independientes; club_wide_target=false para MATCH/TRAINING; identity propia en tabla |
| **EventTargetPerson** | PT §10, §25 (tabla 22) | `ASSOCIATION_CLASS` | Event ↔ Person (N:M); destinatarios personales; identity propia en tabla |
| **EventLogistics** | PT §11, §25 (tabla 24); REQ-EVT-019; UC-EVT-16 | `VALUE_OBJECT` / `CANONICAL_CLASS` | meetingAt, departureAt, meetingPoint, transportNote, arrivalInstructions; opcional por Event; se actualiza por CAPTAIN/COACH/SUBCOMMITTEE; ¿entidad o VO? → **CANONICAL_CLASS** (tiene identidad, se referencia, se audita) |
| **EventSeriesTargetTeam** | PT §25 (tabla 17) | `ASSOCIATION_CLASS` | EventSeries ↔ Team (N:M) para destinatarios de serie |
| **EventSeriesTargetPerson** | PT §25 (tabla 18) | `ASSOCIATION_CLASS` | EventSeries ↔ Person (N:M) para destinatarios de serie |

## 3.4 PARTICIPACIÓN (PRT)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **Availability** | PT §9, §12, §25; REQ-PRT-001–004/018/019; UC-PRT-01; SM-AVAILABILITY-01 | `CANONICAL_CLASS` | Respuesta persistida YES/MAYBE/NO + derivados NO_RESPONSE/NEEDS_RECONFIRMATION; solo con Event SCHEDULED; POSTPONED conserva, no acepta nuevas; distinta de Selection/Attendance |
| **Selection** | PT §9, §12, §25; REQ-PRT-005/006/008; UC-PRT-02/03/04 | `CANONICAL_CLASS` | Contenedor: borrador actual (mutable) + historial de revisiones PUBLISHED inmutables; SelectionRevision es la unidad de publicación |
| **SelectionRevision** | PT §9, §25 (tabla 28, 29); REQ-PRT-005/006/008; UC-PRT-02/03/04; SM-SELECTIONREV-01 | `CANONICAL_CLASS` | DRAFT (editable, autosave) → PUBLISHED (inmutable); republicar = nueva revisión; no se reescribe; conflictos derivados no bloquean |
| **SelectionEntry** | PT §25 (tabla 30) | `CANONICAL_CLASS` | Entrada individual en SelectionRevision; persona + estado (selected/alternate/etc.) + metadata; parte de revisión |
| **AttendanceSheet** | PT §9, §12, §25 (tabla 31); REQ-PRT-009/011; UC-PRT-05/06; SM-ATTENDANCEENTRY-01 (temporal model) | `CANONICAL_CLASS` | Contenedor por Event; OPEN (closed_at NULL) / CLOSED (closed_at timestamp); deriva de closed_at; no reapertura inventada |
| **AttendanceEntry** | PT §9, §12, §25 (tabla 32); REQ-PRT-009/010/011/012/019; UC-PRT-05/06/07; SM-ATTENDANCEENTRY-01 | `CANONICAL_CLASS` | PRESENT/ABSENT/JUSTIFIED persistidos + UNRECORDED derivado (sin fila); corrección auditada con motivo obligatorio; closed_at bloquea marcaje directo |
| **MatchRecord** | PT §9, §15, §25; REQ-PRT-013/014/015/016; UC-PRT-08/09/10/11; SM-MATCHRECORD-01 | `CANONICAL_CLASS` | DRAFT → FINAL (terminal); corrección explícita separada (no transición inversa); compatibilidad con Event state (PLAYED/FORFEIT→COMPLETED, ABANDONED→ABANDONED); stats solo PLAYED |
| **PlayerMatchStats** | PT §15, §25 (tabla 40); REQ-PRT-016 | `CANONICAL_CLASS` | Estadísticas fijas por jugador en MatchRecord PLAYED; participación real; matches_played derivado del resultado, no de asistencia |
| **EligibilityConstraint** | PT §13, §25; REQ-PRT-017; REQ-CMP-007/008; UC-PRT-12/13; SM-ELIGIBILITY-01 | `CANONICAL_CLASS` | Estados PENDING/BLOCKED + vigencia `[validFrom, validUntil)` + scope (CLUB/COMPETITION/ENTRY/EVENT) + source (INTERNAL/AHBA/OTHER) + reason (ADMIN/DISCIPLINE/FEDERATION/MEDICAL_CLEARANCE/OTHER); ELIGIBLE derivado = sin restricción activa aplicable; no datos clínicos |

## 3.5 COMUNICACIÓN (COM)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **Announcement** | PT §9, §21, §25; REQ-COM-001–005; UC-COM-01–05; SM-ANNOUNCEMENT-01 | `CANONICAL_CLASS` | Lifecycle DRAFT→PUBLISHED→ARCHIVED; audiencia = TEAM_SET (conjunto real de equipos) o club-wide; snapshot inmutable al publicar; corrección solo title/body; solo Subcomisión |
| **AnnouncementTargetTeam** | PT §25 (tabla 34) | `ASSOCIATION_CLASS` | Announcement ↔ Team (N:M) para audiencia snapshot |
| **Conversation** | PT §9, §20, §25; REQ-COM-006/007/008/011/012; UC-COM-06/07/08; SM-CONVERSATION-GROUP-01 | `CANONICAL_CLASS` | 4 tipos: DIRECT (par canónico único), GROUP (≥2, título, archivable, múltiples), TEAM (0..1 canónica por Team, membresía sync), EVENT (0..1 canónica por Event, membresía sync); DIRECT/TEAM/EVENT sin state machine |
| **ConversationParticipant** | PT §25 (tabla 36); REQ-COM-011 | `ASSOCIATION_CLASS` | Person ↔ Conversation con joined_at/left_at; acceso temporal autoritativo; ex-participante conserva período; Admin sin participación no lee |
| **Message** | PT §9, §25; REQ-COM-009/010/011/017; UC-COM-09/10/11; SM-MESSAGE-01 | `CANONICAL_CLASS` | SENT → EDITED → DELETED (tombstone); solo mensajes propios; historia expuesta; enviar no notifica; reintento idempotente |
| **Notification** | PT §22, §25; REQ-COM-014/015/016/018; UC-COM-13/14; SM (DERIVED_STATE_MODEL) | `CANONICAL_CLASS` | 7 tipos: EVENT_CHANGED, EVENT_POSTPONED, EVENT_RESCHEDULED, EVENT_CANCELLED, EVENT_RESTORED, SELECTION_PUBLISHED, ANNOUNCEMENT_PUBLISHED; clave lógica única origin_event_id+recipient+type; audienceResolvedAt inmutable; deduplicación |
| **DirectPairKey** | PT §20, §25 (tabla 35); REQ-COM-006 | `VALUE_OBJECT` | Clave canónica unordered pair para DIRECT conversation; partial unique; no entidad |

## 3.6 COMPETENCIA (CMP)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **Competition** | PT §25; REQ-CMP-001/002/003/006; UC-CMP-01/02/03/08; SM-COMPETITION-01 | `CANONICAL_CLASS` | Lifecycle DRAFT→ACTIVE→CLOSED; guard 0 inscripciones activas al cerrar; referencia externa whitelist; solo Subcomisión/Admin |
| **CompetitionEntry** | PT §4, §16, §25; REQ-CMP-003/004/005; UC-CMP-04/05/06/07/09; SM-COMPETITIONENTRY-01 | `CANONICAL_CLASS` | Lifecycle PENDING→ACTIVE→ENDED; **scopes de dato TEAM/LINE** (no estados); TEAM: team_id; LINE: division+line+season; incompatibles → COMPETITION_SCOPE_MISMATCH; uso en Match: scope compatible con jornada |
| **ExternalReference** | PT §25 (tabla 15); REQ-CMP-006/007; UC-CMP-08/09 | `CANONICAL_CLASS` | Referencia manual a COMPETITION/COMPETITION_ENTRY/MATCH_EVENT; target whitelist; no afirma sincronización; límite federativo |

## 3.7 INSIGHT / INTEGRIDAD (INS)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **AuditEntry** | PT §25 (tabla 41); REQ-INS-008/009/010; UC-INS-05 | `CANONICAL_CLASS` | Append-only; qué cambió, quién, cuándo, motivo (cuando acción lo exige), enlace al objeto; datos sensibles redactados; sin contraseñas/hashes/tokens/cookies/cuerpos |
| **History** | PT §25; REQ-INS-011/012 | `DERIVED_CONCEPT` | No entidad persistida; se deriva de entidades que la originan + auditoría; correcciones asistencia/resultado, revisiones convocatoria, historial evento, correcciones comunicado, estado mensaje; no tabla genérica ni timeline personal |
| **Report (Attendance/Performance)** | PT §25; REQ-INS-004/005/006/007; UC-INS-02/03 | `DERIVED_CONCEPT` | Proyecciones read-only; alcance por autoridad (propio/equipo/club); cada fila enlaza al origen; Admin no tiene acceso a informes de asistencia/rendimiento (PT §5) |
| **Search** | PT §25; REQ-INS-001/002/003; UC-INS-01 | `DERIVED_CONCEPT` | Proyección read-only; cubre personas, equipos, eventos, divisiones/líneas; vacío ≠ cero; PII por field authority; consulta sobrevive a back navigation |

## 3.8 TÉCNICOS / INFRAESTRUCTURA (NO DOMINIO DEPORTIVO)

| Candidato | Fuente | Clasificación | Justificación |
|---|---|---|---|
| **CommandReceipt** | PT §31, §36; REQ-SYS-016/018; PT §25 (tabla 42) | `CANONICAL_CLASS` (infra) | Idempotency key + fingerprint + command + result_data + completed_at; replay de resultado confirmado; TTL 24h journal |
| **OutboxEvent** | PT §35, §58; PT §25 (tabla 43) | `CANONICAL_CLASS` (infra) | Fanout atómico duradero; FOR UPDATE SKIP LOCKED; idempotent handler; processed/failed states; pg_notify hints |
| **PasswordCredential** | PT §25 (tabla 44); PT §48 | `CANONICAL_CLASS` (auth) | Argon2id hash + version + credentialVersion; SETUP_REQUIRED state |
| **SessionToken** | PT §25 (tabla 45); PT §49 | `CANONICAL_CLASS` (auth) | CSPRNG raw en cookie; DB guarda HMAC digest con SESSION_TOKEN_KEY |
| **AccountSetupToken** | PT §25 (tabla 46); PT §51 | `CANONICAL_CLASS` (auth) | HMAC con SETUP_TOKEN_KEY; one-time 24h; max 1 activo; consume → set password + activate |
| **CSRFToken** | PT §50 | `VALUE_OBJECT` (auth) | HMAC-SHA256(CSRF_TOKEN_KEY, session.id); en memoria navegador; regenera en GET /auth/session |

---

# 4. CLASIFICACIÓN CONSOLIDADA

## 4.1 CLASES CANÓNICAS DE DOMINIO (33)

| ID | Clase | Dominio | Fuente principal |
|---|---|---|---|
| CL-01 | Person | PPL | PT §17, §25 |
| CL-02 | Account | IAM | PT §9, §25 |
| CL-03 | Membership | PPL | PT §17, §25 |
| CL-04 | TeamAssignment | PPL | PT §17, §25 |
| CL-05 | RoleAssignment | PPL | PT §5, §17, §25 |
| CL-06 | GuardianRelationship | PPL | PT §5, §17, §20, §25 |
| CL-07 | Season | STR | PT §19, §25 |
| CL-08 | Division | STR | PT §19, §25 |
| CL-09 | Line | STR | PT §19, §25 |
| CL-10 | Team | STR | PT §19, §25 |
| CL-11 | Venue | STR | PT §19, §25 |
| CL-12 | Event | EVT | PT §9, §10, §25 |
| CL-13 | EventSeries | EVT | PT §9, §25 |
| CL-14 | EventOccurrenceOverride | EVT | PT §25 (tabla 23) |
| CL-15 | Jornada | EVT | PT §16, §25 |
| CL-16 | EventLogistics | EVT | PT §11, §25 (tabla 24) |
| CL-17 | Availability | PRT | PT §9, §12, §25 |
| CL-18 | Selection | PRT | PT §9, §12, §25 |
| CL-19 | SelectionRevision | PRT | PT §9, §25 (tabla 28, 29) |
| CL-20 | SelectionEntry | PRT | PT §25 (tabla 30) |
| CL-21 | AttendanceSheet | PRT | PT §9, §12, §25 (tabla 31) |
| CL-22 | AttendanceEntry | PRT | PT §9, §12, §25 (tabla 32) |
| CL-23 | MatchRecord | PRT | PT §9, §15, §25 |
| CL-24 | PlayerMatchStats | PRT | PT §15, §25 (tabla 40) |
| CL-25 | EligibilityConstraint | PRT | PT §13, §25 |
| CL-26 | Announcement | COM | PT §9, §21, §25 |
| CL-27 | Conversation | COM | PT §9, §20, §25 |
| CL-28 | Message | COM | PT §9, §25 |
| CL-29 | Notification | COM | PT §22, §25 |
| CL-30 | Competition | CMP | PT §25 |
| CL-31 | CompetitionEntry | CMP | PT §4, §16, §25 |
| CL-32 | ExternalReference | CMP | PT §25 (tabla 15) |
| CL-33 | AuditEntry | INS | PT §25 (tabla 41) |

## 4.2 VALUE OBJECTS (9)

| ID | Value Object | Clase propietaria | Justificación |
|---|---|---|---|
| VO-01 | Username | Account | Inmutable, unique, case-insensitive |
| VO-02 | PasswordHash | Account | Argon2id, versionado |
| VO-03 | SessionToken | Account | Opaco, digest HMAC, TTL |
| VO-04 | ActivationCode | Account | One-time HMAC, 24h, 5 intentos |
| VO-05 | DirectPairKey | Conversation (DIRECT) | Unordered pair, partial unique |
| VO-06 | CoordinationRevision | Event / EventSeries | Entero incremental; derivado de cambios materiales |
| VO-07 | EventType | Event | Enum cerrado: TRAINING / MATCH / CLUB_EVENT |
| VO-08 | RoleType | RoleAssignment | Enum cerrado: PLAYER / CAPTAIN / COACH / SUBCOMMITTEE / ADMIN |
| VO-09 | ScopeType | RoleAssignment / CompetitionEntry | Enum: CLUB / TEAM / EVENT / LINE |

## 4.3 ENUMERACIONES DE DOMINIO (14)

| ID | Enumeración | Valores | Fuente |
|---|---|---|---|
| EN-01 | AccountStatus | PENDING, ACTIVE, DISABLED | SM-ACCOUNT-01 |
| EN-02 | TeamStatus | DRAFT, ACTIVE, ARCHIVED | SM-TEAM-01 |
| EN-03 | DivisionLineVenueStatus | ACTIVE, ARCHIVED | SM-DIVISION-01, SM-LINE-01, SM-VENUE-01 |
| EN-04 | EventState | DRAFT, SCHEDULED, POSTPONED, CANCELLED, IN_PROGRESS, COMPLETED, ABANDONED | SM-EVENT-01 |
| EN-05 | EventSeriesState | ACTIVE, ENDED | SM-EVENTSERIES-01 |
| EN-06 | AvailabilityValue | YES, MAYBE, NO | SM-AVAILABILITY-01 (persistido) |
| EN-07 | AvailabilityDerived | NO_RESPONSE, NEEDS_RECONFIRMATION | SM-AVAILABILITY-01 (derivado) |
| EN-08 | SelectionRevisionState | DRAFT, PUBLISHED | SM-SELECTIONREV-01 |
| EN-09 | AttendanceValue | PRESENT, ABSENT, JUSTIFIED | SM-ATTENDANCEENTRY-01 (persistido) |
| EN-10 | AttendanceDerived | UNRECORDED | SM-ATTENDANCEENTRY-01 (derivado) |
| EN-11 | AttendanceSheetState | OPEN, CLOSED | SM-ATTENDANCEENTRY-01 (temporal) |
| EN-12 | MatchRecordState | DRAFT, FINAL | SM-MATCHRECORD-01 |
| EN-13 | EligibilityState | PENDING, BLOCKED | SM-ELIGIBILITY-01 (persistido) |
| EN-14 | EligibilityDerived | ELIGIBLE | SM-ELIGIBILITY-01 (derivado) |
| EN-15 | AnnouncementState | DRAFT, PUBLISHED, ARCHIVED | SM-ANNOUNCEMENT-01 |
| EN-16 | ConversationType | DIRECT, GROUP, TEAM, EVENT | PT §20, REQ-COM-006/007/008 |
| EN-17 | ConversationState | ACTIVE, ARCHIVED | SM-CONVERSATION-GROUP-01 (solo GROUP) |
| EN-18 | MessageState | SENT, EDITED, DELETED | SM-MESSAGE-01 |
| EN-19 | NotificationType | EVENT_CHANGED, EVENT_POSTPONED, EVENT_RESCHEDULED, EVENT_CANCELLED, EVENT_RESTORED, SELECTION_PUBLISHED, ANNOUNCEMENT_PUBLISHED | PT §22, REQ-COM-014 |
| EN-20 | CompetitionState | DRAFT, ACTIVE, CLOSED | SM-COMPETITION-01 |
| EN-21 | CompetitionEntryState | PENDING, ACTIVE, ENDED | SM-COMPETITIONENTRY-01 |
| EN-22 | CompetitionEntryScope | TEAM, LINE | PT §4, REQ-CMP-004 |
| EN-23 | EligibilityScope | CLUB, COMPETITION, ENTRY, EVENT | PT §13 |
| EN-24 | EligibilitySource | INTERNAL, AHBA, OTHER | PT §13 |
| EN-25 | EligibilityReason | ADMIN, DISCIPLINE, FEDERATION, MEDICAL_CLEARANCE, OTHER | PT §13 |
| EN-26 | RelationshipType | (definir por club) | PT §17 GuardianRelationship |
| EN-27 | MatchResultType | PLAYED, FORFEIT, ABANDONED | PT §15, SM-MATCHRECORD-01 |

## 4.4 CLASES DE ASOCIACIÓN (10)

| ID | Clase de asociación | Relación | Justificación func. |
|---|---|---|---|
| AC-01 | EventTargetTeam | Event ↔ Team (N:M) | Destinatarios plurales por tipo; club_wide=false |
| AC-02 | EventTargetPerson | Event ↔ Person (N:M) | Destinatarios personales; identity propia |
| AC-03 | EventSeriesTargetTeam | EventSeries ↔ Team (N:M) | Destinatarios de serie |
| AC-04 | EventSeriesTargetPerson | EventSeries ↔ Person (N:M) | Destinatarios personales de serie |
| AC-05 | EventOccurrenceOverride | EventSeries → Event (1:N) | Anulación específica con identidad |
| AC-06 | AnnouncementTargetTeam | Announcement ↔ Team (N:M) | Audiencia snapshot inmutable al publicar |
| AC-07 | ConversationParticipant | Person ↔ Conversation (N:M) | joined_at/left_at; acceso temporal; ex-participante conserva período |
| AC-08 | TeamAssignment | Person ↔ Team (N:M) | **YA COMO CANONICAL_CLASS** (vigencia, PLAYER role atómico) |
| AC-09 | RoleAssignment | Person ↔ (Team/Event/Club) (N:M) | **YA COMO CANONICAL_CLASS** (rol+scope+vigencia) |
| AC-10 | GuardianRelationship | Person ↔ Person (N:M, reflexiva) | **YA COMO CANONICAL_CLASS** (delegación, flags, vigencia) |

> **Nota:** TeamAssignment, RoleAssignment y GuardianRelationship son clases canónicas que **también** funcionan como clases de asociación con identidad y atributos propios. No se duplican.

## 4.5 CONCEPTOS DERIVADOS / NO CLASES (15)

| Concepto | Tipo | Por qué NO es clase |
|---|---|---|
| Training | `DERIVED_CONCEPT` | Subtipo discriminado por Event.type; no herencia real |
| Match | `DERIVED_CONCEPT` | Subtipo discriminado por Event.type + Match row; no herencia real |
| ClubEvent | `DERIVED_CONCEPT` | Subtipo discriminado por Event.type + club_wide_target; no herencia real |
| History | `DERIVED_CONCEPT` | Proyección read-only de entidades + audit; no tabla genérica |
| Report (Attendance/Performance) | `DERIVED_CONCEPT` | Proyección read-only; alcance por autoridad |
| Search | `DERIVED_CONCEPT` | Proyección read-only; PII por field authority |
| ELIGIBLE (eligibility) | `DERIVED_CONCEPT` | Derivado = sin EligibilityConstraint activa BLOCKED aplicable |
| NO_RESPONSE (availability) | `DERIVED_CONCEPT` | Derivado = ausencia de fila Availability |
| NEEDS_RECONFIRMATION (availability) | `DERIVED_CONCEPT` | Derivado = respuesta previa + coordination_revision mayor |
| UNRECORDED (attendance) | `DERIVED_CONCEPT` | Derivado = ausencia de fila AttendanceEntry |
| AttendanceSheet OPEN/CLOSED | `DERIVED_CONCEPT` | Derivado de closed_at timestamp |
| Notification UNREAD/READ | `DERIVED_CONCEPT` | Derivado de read_at timestamp |
| Membership/TeamAssignment/RoleAssignment/GuardianRelationship validity | `TEMPORAL_VALIDITY_MODEL` | Modelo temporal `[valid_from, valid_until)` documentado en E6 §3; no state machine propia |
| Season | `NO_STATE_MACHINE` | Histórica sin estado; solo timestamps |
| Jornada | `NO_STATE_MACHINE` | Contenedor atómico sin lifecycle propio |

## 4.6 CONCEPTOS TÉCNICOS / INFRA (6 — fuera del modelo de dominio deportivo)

| Clase | Tipo | Nota |
|---|---|---|
| CommandReceipt | `CANONICAL_CLASS` (infra) | Idempotencia, replay |
| OutboxEvent | `CANONICAL_CLASS` (infra) | Fanout duradero |
| PasswordCredential | `CANONICAL_CLASS` (auth) | Argon2id, versionado |
| SessionToken | `CANONICAL_CLASS` (auth) | Cookie + HMAC digest |
| AccountSetupToken | `CANONICAL_CLASS` (auth) | Activación, reset admin |
| CSRFToken | `VALUE_OBJECT` (auth) | HMAC-SHA256, en memoria |

## 4.7 DECISIONES BLOQUEANTES IDENTIFICADAS

| ID | Decisión | Opciones | Recomendación | Estado |
|---|---|---|---|---|
| CLASS-DECISION-01 | ¿Training/Match/ClubEvent son subclases UML (generalización) de Event o discriminación por tipo? | A) Generalización real (herencia) B) Discriminación por tipo (Event.type) C) Clases separadas sin herencia | **B** — PT §10 trata Event como raíz con invariantes comunes; subtipos solo añaden restricciones; E6 SM-EVENT-01 documenta "Subtipo Match — Variantes Adicionales" no herencia UML | **PENDIENTE** |
| CLASS-DECISION-02 | ¿EventLogistics es Value Object embebido en Event o clase canónica propia? | A) VO embebido (sin identidad) B) Clase canónica (identidad, referenciable, auditable) | **B** — PT §11 y tabla 24 le dan identidad; se actualiza por UC-EVT-16; se audita; CAPTAIN/COACH/SUBCOMMITTEE la editan | **PENDIENTE** |
| CLASS-DECISION-03 | ¿Selection y SelectionRevision son una sola clase con estado o dos clases? | A) Una clase Selection con estado DRAFT/PUBLISHED B) Selection (contenedor) + SelectionRevision (unidad de publicación) | **B** — E6 SM-SELECTIONREV-01 y SM (Selection contenedor) los separan; SelectionRevision es inmutable publicada; Selection es borrador actual mutable + historial | **PENDIENTE** |
| CLASS-DECISION-04 | ¿AttendanceSheet y AttendanceEntry son una sola clase o dos? | A) Una clase Attendance con estado B) AttendanceSheet (contenedor OPEN/CLOSED) + AttendanceEntry (valores) | **B** — E6 los separa: AttendanceSheet es contenedor temporal (OPEN/CLOSED por closed_at); AttendanceEntry son valores PRESENT/ABSENT/JUSTIFIED + UNRECORDED derivado | **PENDIENTE** |
| CLASS-DECISION-05 | ¿CompetitionEntry TEAM y LINE son subclases o scope de dato en una clase? | A) Generalización CompetitionEntryTeam / CompetitionEntryLine B) Una clase CompetitionEntry con scope ENUM (TEAM/LINE) | **B** — PT §4 y REQ-CMP-004: "TEAM y LINE son alcances de dato, no etapas de lifecycle"; SM-COMPETITIONENTRY-01 lo confirma | **PENDIENTE** |
| CLASS-DECISION-06 | ¿Conversation DIRECT/GROUP/TEAM/EVENT son subclases o tipo en una clase? | A) 4 subclases B) Una clase Conversation con type ENUM | **B** — PT §20 define 4 tipos con reglas distintas; solo GROUP tiene state machine; DIRECT/TEAM/EVENT son variaciones de reglas de membresía y unicidad | **PENDIENTE** |

---

# 5. RESUMEN DE AUDITORÍA

| Métrica | Valor |
|---|---|
| Candidatos totales evaluados | **77** |
| `CANONICAL_CLASS` (dominio) | **33** |
| `CANONICAL_CLASS` (infra/auth) | **6** |
| `VALUE_OBJECT` | **9** |
| `ENUMERATION` (valores distintos) | **27** |
| `ASSOCIATION_CLASS` (propias) | **10** (3 ya son CANONICAL_CLASS) |
| `DERIVED_CONCEPT` | **15** |
| `NOT_A_CLASS` | **0** (todos clasificados) |
| `NEEDS_DECISION` | **6** |

---

# 6. PRÓXIMOS PASOS

1. **E8-02**: Resolver las 6 decisiones bloqueantes (CLASS-DECISION-01 a 06) y consolidar catálogo canónico
2. **E8-03**: Documentar atributos y tipos para cada clase canónica
3. **E8-04**: Documentar operaciones completas (constructores, métodos de dominio, consultas, cambios de estado, validaciones)
4. **E8-05**: Documentar relaciones UML con multiplicidades, navegabilidad, ownership, invariantes
5. **E8-06**: Generar diagramas Draw.io (Overview + vistas por dominio)
6. **E8-07**: Validación mecánica, semántica, visual y trazabilidad
7. **E8-08**: Freeze y commit

---

**Fin de la Auditoría de Reconstrucción del Modelo de Clases V1.**

*Este documento es la entrada para E8-02. No congela decisiones; las decisiones pendientes se resolverán en E8-02 antes de generar el catálogo canónico.*