# GEI HOCKEY MANAGEMENT SYSTEM
## CLASS DIAGRAM MANIFEST V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-10
**Etapa:** 8 — Modelo de clases completo (E8-06)
**Rama:** `gei/e8-complete-class-model-freeze-v1`
**Baseline:** `GEI_CLASS_CATALOG_V1.md` + `GEI_CLASS_ATTRIBUTES_V1.md` + `GEI_CLASS_OPERATION_MATRIX_V1.md` + `GEI_CLASS_RELATIONSHIP_MATRIX_V1.md` + `GEI_CLASS_TRACEABILITY_MATRIX_V1.md`

---

# 1. TOPOLOGÍA DE DIAGRAMAS

| ID | Archivo | Tipo | Descripción | Clases incluidas (propietarias) |
|---|---|---|---|---|
| CL-00 | `CL-00__GEI_Domain_Overview.drawio` | **Overview** | Vista global de dominios y relaciones principales | Todas (resumen, solo nombres + relaciones clave) |
| CL-IAM-01 | `CL-IAM-01__Identity_Access.drawio` | **Dominio IAM** | Identidad y acceso: Person, Account, Membership, Session, ActivationCode | Person, Account, Membership, SessionToken(VO), ActivationCode(VO), Username(VO), PasswordHash(VO) |
| CL-PPL-01 | `CL-PPL-01__People_Relationships.drawio` | **Dominio PPL** | Personas y relaciones: TeamAssignment, RoleAssignment, GuardianRelationship | TeamAssignment, RoleAssignment, GuardianRelationship, Person (ref), Team (ref) |
| CL-STR-01 | `CL-STR-01__Club_Structure.drawio` | **Dominio STR** | Estructura club: Season, Division, Line, Team, Venue | Season, Division, Line, Team, Venue |
| CL-EVT-01 | `CL-EVT-01__Events_Calendar.drawio` | **Dominio EVT** | Eventos y calendario: Event, Match, EventSeries, Jornada, EventLogistics, Targets | Event, Match, EventSeries, EventOccurrenceOverride, Jornada, JornadaMatch, EventLogistics, EventTargetTeam, EventTargetPerson, EventSeriesTargetTeam, EventSeriesTargetPerson |
| CL-PRT-01 | `CL-PRT-01__Participation.drawio` | **Dominio PRT** | Participación: Availability, Selection, Attendance, MatchRecord, Eligibility | Availability, Selection, SelectionRevision, SelectionEntry, AttendanceSheet, AttendanceEntry, MatchRecord, PlayerMatchStats, EligibilityConstraint, EligibilityPolicy(service) |
| CL-COM-01 | `CL-COM-01__Communication.drawio` | **Dominio COM** | Comunicación: Announcement, Conversation, Message, Notification | Announcement, AnnouncementTargetTeam, Conversation, ConversationParticipant, Message, Notification, DirectPairKey(VO) |
| CL-CMP-01 | `CL-CMP-01__Competition.drawio` | **Dominio CMP** | Competencia: Competition, CompetitionEntry, ExternalReference | Competition, CompetitionEntry, ExternalReference |
| CL-INS-01 | `CL-INS-01__Insight_Integrity.drawio` | **Dominio INS** | Insight e integridad: AuditEntry, History/Report/Search (proyecciones) | AuditEntry, History(service), Report(service), Search(service) |

**Total diagramas: 9** (1 Overview + 8 vistas por dominio)

---

# 2. REGLAS DE REPRESENTACIÓN

## 2.1 Clases Propietarias vs Referencias
- **Clase propietaria**: Aparece con sus 3 compartimentos completos (Nombre, Atributos, Operaciones) en **exactamente un** diagrama (su vista de dominio).
- **Clase referencia**: Aparece en otros diagramas solo con **Nombre + Atributos clave (PK/FK)** + estereotipo `<<ref>>`; operaciones omitidas.
- **Nunca** duplicar definición completa de una clase en dos diagramas.

## 2.2 Notación de Compartimentos

```
+-------------------------------+
| <<canonical>> ClassName       |
+-------------------------------+
| + id: UUID {id}               |
| + name: String                |
| / derivedAttr: Type           |
| - privateAttr: Type           |
+-------------------------------+
| + constructor(params): Class  |
| + domainMethod(params): Ret   |
| / derivedProperty(): Type     |
| - validateInvariant(): Bool   |
+-------------------------------+
```

## 2.3 Estereotipos UML

| Estereotipo | Uso |
|---|---|
| `<<canonical>>` | Clase canónica de dominio (33) |
| `<<associationClass>>` | Clase de asociación N:M con identidad (10) |
| `<<valueObject>>` | Value Object (9) |
| `<<enumeration>>` | Enumeración (27 valores distintos) |
| `<<service>>` | Servicio de dominio/política (no entidad) |
| `<<ref>>` | Clase referencia en diagrama no propietario |
| `<<derived>>` | Atributo/operación derivado |

## 2.4 Relaciones - Notación Visual

| Tipo | Línea | Extremos | Decoración |
|---|---|---|---|
| Association | Sólida | Multiplicidades en ambos extremos | Rol/nombre asociación opcional |
| Composition | Sólida + **rombo relleno** en lado todo | `1` / `0..*` o `1..*` | `owner` en lado todo |
| Aggregation | Sólida + **rombo hueco** en lado todo | `1` / `0..*` | (No usado en dominio) |
| Generalization | Sólida + **triángulo hueco** hacia padre | | (No usado en dominio deportivo) |
| Dependency | Discontinua + flecha abierta | | `<<dependency>>` |
| Association Class | Clase con línea discontinua a cada extremo | | Clase con `<<associationClass>>` |

---

# 3. DETALLE DE CLASES POR DIAGRAMA

## 3.1 CL-00: GEI Domain Overview
**Propósito:** Vista ejecutiva de dominios y relaciones transversales.
**Contenido:** 9 paquetes/dominios (IAM, PPL, STR, EVT, PRT, COM, CMP, INS, INFRA) con clases representativas y relaciones clave entre dominios.
**Clases propietarias:** Ninguna (todas son referencias).
**Estilo:** Paquetes UML con bordes de color por dominio; solo nombres de clases principales; relaciones clave entre paquetes.

## 3.2 CL-IAM-01: Identity & Access
**Clases propietarias (3 + 5 VO):**
- `Person` (ref, solo PK + nombre)
- `Account` **<<canonical>>** — 3 compartimentos completos
- `Membership` **<<canonical>>** — 3 compartimentos completos
- `Username` **<<valueObject>>**
- `PasswordHash` **<<valueObject>>**
- `SessionToken` **<<valueObject>>**
- `ActivationCode` **<<valueObject>>**
- `AccountStatus` **<<enumeration>>**

**Relaciones clave:**
- Account `1` — `1` Person (R-01, composition-like)
- Membership `0..*` — `1` Person (R-02)
- Account `1` — `0..*` SessionToken (VO, interno)
- Account `1` — `0..1` ActivationCode (VO, interno)

## 3.3 CL-PPL-01: People & Relationships
**Clases propietarias (3):**
- `TeamAssignment` **<<canonical>>** (también `<<associationClass>>`)
- `RoleAssignment` **<<canonical>>** (también `<<associationClass>>`)
- `GuardianRelationship` **<<canonical>>** (también `<<associationClass>>`, **reflexiva**)

**Clases referencia:**
- `Person` (ref, PK + nombre)
- `Team` (ref, PK + nombre derivado)
- `Competition` (ref, PK + nombre) — solo para RoleAssignment scope LINE
- `RoleType` **<<enumeration>>**
- `ScopeType` **<<enumeration>>**
- `RelationshipType` **<<enumeration>>**

**Relaciones clave:**
- TeamAssignment `0..*` — `1` Person (R-03)
- TeamAssignment `0..*` — `1` Team (R-04)
- RoleAssignment `0..*` — `1` Person (R-05)
- RoleAssignment `0..*` — `0..1` Team (scope TEAM/EVENT) (R-06)
- RoleAssignment `0..*` — `0..1` Competition (scope LINE) (R-07)
- GuardianRelationship `0..*` — `1` Person (guardian) (R-08)
- GuardianRelationship `0..*` — `1` Person (child) (R-09) **reflexiva**

## 3.4 CL-STR-01: Club Structure
**Clases propietarias (5):**
- `Season` **<<canonical>>**
- `Division` **<<canonical>>**
- `Line` **<<canonical>>**
- `Team` **<<canonical>>**
- `Venue` **<<canonical>>**

**Enumeraciones:**
- `TeamStatus` **<<enumeration>>**
- `StructureArchivedStatus` **<<enumeration>>**

**Relaciones clave:**
- Division `0..*` — `1` Season (R-10)
- Line `0..*` — `1` Division (R-11)
- Team `0..*` — `1` Season (R-12) **identidad**
- Team `0..*` — `1` Division (R-13) **identidad**
- Team `0..*` — `1` Line (R-14) **identidad** → `Team = Season + Division + Line` (unique)
- Event `0..*` — `0..1` Venue (R-15)

## 3.5 CL-EVT-01: Events & Calendar
**Clases propietarias (10):**
- `Event` **<<canonical>>**
- `Match` **<<canonical>>** (subtipo discriminado, no herencia)
- `EventSeries` **<<canonical>>**
- `EventOccurrenceOverride` **<<canonical>>**
- `Jornada` **<<canonical>>**
- `JornadaMatch` **<<associationClass>>**
- `EventLogistics` **<<canonical>>**
- `EventTargetTeam` **<<associationClass>>**
- `EventTargetPerson` **<<associationClass>>**
- `EventSeriesTargetTeam` **<<associationClass>>**
- `EventSeriesTargetPerson` **<<associationClass>>**

**Enumeraciones:**
- `EventType` **<<enumeration>>** (TRAINING, MATCH, CLUB_EVENT)
- `EventState` **<<enumeration>>** (7 estados)
- `EventSeriesState` **<<enumeration>>**
- `MatchResultType` **<<enumeration>>**

**Clases referencia:**
- `Venue` (ref)
- `Team` (ref)
- `Person` (ref)
- `CompetitionEntry` (ref)

**Relaciones clave:**
- Event `1` ◆── `0..1` EventLogistics (R-19, **Composition**)
- Event (MATCH) `1` ◆── `0..1` Match (R-20, **Composition**)
- Event `0..*` ◇── `0..*` Team via EventTargetTeam (R-17)
- Event `0..*` ◇── `0..*` Person via EventTargetPerson (R-18)
- Event `0..*` — `0..1` EventSeries (R-16)
- EventSeries `1` ◆── `0..*` EventOccurrenceOverride (R-23)
- EventSeries `0..*` ◇── `0..*` Team via EventSeriesTargetTeam (R-21)
- EventSeries `0..*` ◇── `0..*` Person via EventSeriesTargetPerson (R-22)
- Jornada `1` ◇── `0..*` Match via JornadaMatch (R-24)

## 3.6 CL-PRT-01: Participation
**Clases propietarias (9 + 4 services):**
- `Availability` **<<canonical>>**
- `Selection` **<<canonical>>**
- `SelectionRevision` **<<canonical>>**
- `SelectionEntry` **<<canonical>>**
- `AttendanceSheet` **<<canonical>>**
- `AttendanceEntry` **<<canonical>>**
- `MatchRecord` **<<canonical>>**
- `PlayerMatchStats` **<<canonical>>**
- `EligibilityConstraint` **<<canonical>>**
- `EligibilityPolicy` **<<service>>**
- `AvailabilityPolicy` **<<service>>**
- `SelectionConflictPolicy` **<<service>>**
- `AttendancePolicy` **<<service>>**

**Enumeraciones (13):**
- `AvailabilityValue` **<<enumeration>>** (YES, MAYBE, NO)
- `AvailabilityDerived` **<<enumeration>>** (NO_RESPONSE, NEEDS_RECONFIRMATION)
- `SelectionRevisionState` **<<enumeration>>** (DRAFT, PUBLISHED)
- `AttendanceValue` **<<enumeration>>** (PRESENT, ABSENT, JUSTIFIED)
- `AttendanceDerived` **<<enumeration>>** (UNRECORDED)
- `AttendanceSheetState` **<<enumeration>>** (OPEN, CLOSED)
- `MatchRecordState` **<<enumeration>>** (DRAFT, FINAL)
- `MatchResultType` **<<enumeration>>** (PLAYED, FORFEIT, ABANDONED)
- `EligibilityState` **<<enumeration>>** (PENDING, BLOCKED)
- `EligibilityDerived` **<<enumeration>>** (ELIGIBLE)
- `EligibilityScope` **<<enumeration>>** (CLUB, COMPETITION, ENTRY, EVENT)
- `EligibilitySource` **<<enumeration>>** (INTERNAL, AHBA, OTHER)
- `EligibilityReason` **<<enumeration>>** (ADMIN, DISCIPLINE, FEDERATION, MEDICAL_CLEARANCE, OTHER)

**Clases referencia:**
- `Event` (ref)
- `Person` (ref)
- `Team` (ref)
- `Competition` (ref)
- `CompetitionEntry` (ref)

**Relaciones clave:**
- Availability `0..*` — `1` Event (R-25)
- Availability `0..*` — `1` Person (subject) (R-26)
- Availability `0..*` — `1` Person (respondedBy) (R-27)
- Selection `1` — `0..1` Event (MATCH) (R-28)
- Selection `1` ◆── `0..*` SelectionRevision (R-29, **Composition**)
- SelectionRevision `1` ◆── `0..*` SelectionEntry (R-30, **Composition**)
- AttendanceSheet `1` — `0..1` Event (R-31)
- AttendanceSheet `1` ◆── `0..*` AttendanceEntry (R-32, **Composition**)
- AttendanceEntry `0..*` — `1` Person (R-33)
- MatchRecord `1` — `0..1` Event (MATCH) (R-34)
- MatchRecord `1` ◆── `0..*` PlayerMatchStats (R-35, **Composition**)
- PlayerMatchStats `0..*` — `1` Person (R-36)
- EligibilityConstraint `0..*` — `1` Person (R-37)
- EligibilityConstraint `0..*` — `0..1` Competition/Entry/Event (R-38/R-39/R-40)

## 3.7 CL-COM-01: Communication
**Clases propietarias (5 + 1 VO):**
- `Announcement` **<<canonical>>**
- `AnnouncementTargetTeam` **<<associationClass>>**
- `Conversation` **<<canonical>>**
- `ConversationParticipant` **<<associationClass>>**
- `Message` **<<canonical>>**
- `Notification` **<<canonical>>**
- `DirectPairKey` **<<valueObject>>**

**Enumeraciones:**
- `AnnouncementState` **<<enumeration>>**
- `ConversationType` **<<enumeration>>** (DIRECT, GROUP, TEAM, EVENT)
- `ConversationState` **<<enumeration>>** (ACTIVE, ARCHIVED)
- `MessageState` **<<enumeration>>** (SENT, EDITED, DELETED)
- `NotificationType` **<<enumeration>>** (7 tipos)

**Clases referencia:**
- `Team` (ref)
- `Person` (ref)
- `Event` (ref)

**Relaciones clave:**
- Announcement `0..*` ◇── `0..*` Team via AnnouncementTargetTeam (R-41)
- Announcement `1` ..> `0..*` Team (audienceSnapshot, R-42, **Dependency**)
- Conversation `0..*` ◇── `0..*` Person via ConversationParticipant (R-43)
- Conversation (TEAM) `0..1` — `1` Team (R-44)
- Conversation (EVENT) `0..1` — `1` Event (R-45)
- Message `0..*` — `1` Conversation (R-46, composition-like)
- Message `0..*` — `1` Person (author) (R-47)
- Notification `0..*` — `1` Person (recipient) (R-48)
- Notification `0..*` — `0..1` Event (origin) (R-49)

## 3.8 CL-CMP-01: Competition
**Clases propietarias (3):**
- `Competition` **<<canonical>>**
- `CompetitionEntry` **<<canonical>>**
- `ExternalReference` **<<canonical>>**

**Enumeraciones:**
- `CompetitionState` **<<enumeration>>**
- `CompetitionEntryState` **<<enumeration>>**
- `CompetitionEntryScope` **<<enumeration>>** (TEAM, LINE)

**Clases referencia:**
- `Season` (ref)
- `Team` (ref)
- `Line` (ref)
- `Event` (ref, MATCH)

**Relaciones clave:**
- Competition `0..*` — `1` Season (R-50)
- CompetitionEntry `0..*` — `1` Competition (R-51)
- CompetitionEntry (TEAM) `0..*` — `0..1` Team (R-52)
- CompetitionEntry (LINE) `0..*` — `0..1` Line (R-53)
- CompetitionEntry (LINE) `0..*` — `1` Season (R-54)
- ExternalReference ..> Competition/Entry/Event (R-55/R-56/R-57, **Dependency**)

## 3.9 CL-INS-01: Insight & Integrity
**Clases propietarias (1 + 3 services):**
- `AuditEntry` **<<canonical>>**
- `History` **<<service>>**
- `Report` **<<service>>** (Attendance, Performance)
- `Search` **<<service>>**

**Clases referencia:**
- `Person` (ref)
- Todas las clases de dominio (referenciadas en diff/target)

**Relaciones clave:**
- AuditEntry `0..*` — `1` Person (actor) (R-58)

---

# 4. EXPORTACIÓN Y QA

## 4.1 Formatos Requeridos
| Formato | Ubicación | Validación |
|---|---|---|
| `.drawio` (fuente) | `docs/uml/classes/source/` | XML well-formed, mxGraphModel, IDs únicos, parents correctos, conectores editables |
| `.png` | `docs/uml/classes/export/png/` | Firma PNG (89 50 4E 47), tamaño > 0, legible |
| `.pdf` | `docs/uml/classes/export/pdf/` | Firma PDF (%PDF-), tamaño > 0, legible |

## 4.2 QA Visual (100% PASS Requerido)
Para cada diagrama verificar:
- [ ] Nombres de clases correctos
- [ ] Atributos con tipos y visibilidad
- [ ] Operaciones con firmas
- [ ] Multiplicidades en AMBOS extremos
- [ ] Tipos de relación correctos (Composition = rombo relleno, etc.)
- [ ] Dirección de herencia correcta (N/A en dominio)
- [ ] Sin texto cortado ni overlaps graves
- [ ] Sin clases invisibles
- [ ] Sin flechas atravesando texto
- [ ] Fuente ≥ 11pt atributos/métodos, ≥ 12pt nombre clase, ≥ 14pt títulos
- [ ] PNG y PDF exportados y verificados

## 4.3 Validación Mecánica (Script)
Checks automatizados (ver `GEI_CLASS_VALIDATION_CHECKLIST_V1.md`):
- DUPLICATE_CLASS_ID = 0
- CLASS_WITHOUT_SOURCE = 0
- ATTRIBUTE_WITHOUT_TYPE = 0
- RELATION_WITHOUT_SOURCE = 0
- MISSING_MULTIPLICITY = 0
- FALSE_COMPOSITION = 0
- CLASS_WITHOUT_OWNER_VIEW = 0
- XML_ERROR = 0
- DRAWIO_LOAD_FAILURE = 0

---

# 5. ARCHIVOS A GENERAR

```
docs/uml/classes/source/
CL-00__GEI_Domain_Overview.drawio
CL-IAM-01__Identity_Access.drawio
CL-PPL-01__People_Relationships.drawio
CL-STR-01__Club_Structure.drawio
CL-EVT-01__Events_Calendar.drawio
CL-PRT-01__Participation.drawio
CL-COM-01__Communication.drawio
CL-CMP-01__Competition.drawio
CL-INS-01__Insight_Integrity.drawio

docs/uml/classes/export/png/
CL-00__GEI_Domain_Overview.png
CL-IAM-01__Identity_Access.png
CL-PPL-01__People_Relationships.png
CL-STR-01__Club_Structure.png
CL-EVT-01__Events_Calendar.png
CL-PRT-01__Participation.png
CL-COM-01__Communication.png
CL-CMP-01__Competition.png
CL-INS-01__Insight_Integrity.png

docs/uml/classes/export/pdf/
CL-00__GEI_Domain_Overview.pdf
CL-IAM-01__Identity_Access.pdf
CL-PPL-01__People_Relationships.pdf
CL-STR-01__Club_Structure.pdf
CL-EVT-01__Events_Calendar.pdf
CL-PRT-01__Participation.pdf
CL-COM-01__Communication.pdf
CL-CMP-01__Competition.pdf
CL-INS-01__Insight_Integrity.pdf
```

---

**Fin del Manifiesto de Diagramas V1.**

*Este documento define la topología completa de diagramas Draw.io a generar. E8-06 procederá a crearlos.*