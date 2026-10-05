# GEI HOCKEY MANAGEMENT SYSTEM
## ACTOR ↔ REQUIREMENT MATRIX V1

**Etapa:** 2 — Modelo de Actores
**Estado:** FROZEN · **Fecha:** 2026-10-05
**Rama:** `gei/e2-actor-model-freeze-v1`
**Baseline de requerimientos:** `29b923f3cb01cf4b425fd6928d210799b9a4bbec`

Fuente de los 157 REQ: `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` y
`docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md`. **E1 no fue modificado.**

---

# 1. CONVENCIONES

| Columna | Valores |
|---|---|
| **Actor Status** | `MAPPED` (actor primario identificado) · `SYSTEM_INTERNAL` (regla interna sin initiator humano) · `NOT_APPLICABLE` (no aplica a ningún actor) · `AMBIGUOUS` (**debe ser 0**) |
| **Authority Source** | `RoleAssignment X` · `GuardianRelationship` · `Account` + sesión · `SYSTEM_INTERNAL` |
| **Scope** | `SELF` · `CHILD` · `TEAM` · `TEAM_SET` · `CLUB` · `EVENT` · `N/A` |

`SYSTEM_INTERNAL` se usa **sólo** cuando el REQ describe una regla interna sin initiator humano
identificable. Si la regla es observable por un actor, ese actor es el primario y la regla
interna queda como condición.

---

# 2. IAM — IDENTIDAD Y ACCESO (20)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-IAM-001` | IAM | Iniciar sesión | F | `ACT-UNAUTHENTICATED` | `ACT-AUTHENTICATED` | la persona | `Account` | credencial establecida | `SELF` | `MAPPED` |
| `REQ-IAM-002` | IAM | Ciclo de vida de la cuenta | F | `ACT-ADMIN` | — | la persona / el club | `Account` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-IAM-003` | IAM | Activación con código de un solo uso | F | `ACT-ADMIN` (emite) | `ACT-UNAUTHENTICATED` (consume) | la persona | `Account` `PENDING` → `ACTIVE` | `RoleAssignment ADMIN` / código de un solo uso | `CLUB` / `SELF` | `MAPPED` |
| `REQ-IAM-004` | IAM | Restablecimiento administrativo de acceso | F | `ACT-ADMIN` | — | la persona | `Account` + credencial | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-IAM-005` | IAM | Cambio de contraseña | F | `ACT-AUTHENTICATED` | los 6 actores concretos | la persona | credencial propia | `Account` + sesión | `SELF` | `MAPPED` |
| `REQ-IAM-006` | IAM | Sesión autenticada opaca y cookie segura | NF | `SYSTEM_INTERNAL` | — | todos los autenticados | sesión | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-007` | IAM | Protección CSRF ligada a la sesión | NF | `SYSTEM_INTERNAL` | — | todos los autenticados | petición que modifica estado | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-008` | IAM | Ciclo de vida y extensión de la sesión | NF | `SYSTEM_INTERNAL` | `ACT-AUTHENTICATED` (afectado) | todos los autenticados | sesión | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-009` | IAM | Reautenticación para gestión sensible | F | `ACT-ADMIN` | `ACT-SUBCOMMITTEE` | la persona | sesión | `RoleAssignment ADMIN` / `SUBCOMMITTEE` | `CLUB` | `MAPPED` |
| `REQ-IAM-010` | IAM | Visibilidad y cierre de sesiones | F | `ACT-AUTHENTICATED` | — | la persona | sesiones propias | `Account` + sesión | `SELF` | `MAPPED` |
| `REQ-IAM-011` | IAM | Propagación de cambios de sesión entre pestañas | NF | `SYSTEM_INTERNAL` | — | todos los autenticados | sesiones | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-012` | IAM | Control de acceso a la aplicación | F | `ACT-AUTHENTICATED` | todos los concretos; `ACT-GUARDIAN` por delegación | la persona | solicitud de acceso | `Account` + `RoleAssignment` vigente **o** `GuardianRelationship` con permiso | `N/A` | `MAPPED` |
| `REQ-IAM-013` | IAM | Protección del último administrador | F | `ACT-ADMIN` | — | el club | conjunto de administradores | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-IAM-014` | IAM | Username inmutable, único e independiente del equipo | F | `ACT-ADMIN` | — | la persona | `Account.username` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-IAM-015` | IAM | Política de contraseñas | NF | `SYSTEM_INTERNAL` | — | todos los autenticados | credencial | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-016` | IAM | Fórmula de autorización y denegación por defecto | F | `SYSTEM_INTERNAL` | los 8 actores | todos | toda acción | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-017` | IAM | Fuente única de autoridad de navegación y de acciones | F | `SYSTEM_INTERNAL` | los 8 actores | todos | navegación y acciones | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-018` | IAM | La autorización no se reimplementa en el cliente | NF | `SYSTEM_INTERNAL` | — | todos | decisión de autoridad | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-019` | IAM | Limitación de intentos y de frecuencia | NF | `SYSTEM_INTERNAL` | `ACT-UNAUTHENTICATED` (afectado) | el club | intento de autenticación | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-IAM-020` | IAM | Interrupción de sesión | F | `ACT-AUTHENTICATED` | — | la persona | trabajo en curso | `Account` + sesión | `SELF` | `MAPPED` |

---

# 3. PPL — PERSONAS Y RELACIONES (16)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-PPL-001` | PPL | Persona base | F | `ACT-ADMIN` | — | la persona | `Person` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-002` | PPL | Completitud del perfil de jugadora | F | `ACT-ADMIN` | `ACT-PLAYER` (recibe el aviso) | la jugadora | `Person` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-003` | PPL | Vinculación persona–cuenta | F | `ACT-ADMIN` | — | la persona | `Person` + `Account` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-004` | PPL | Membresía al club | F | `ACT-ADMIN` | — | la persona | `Membership` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-005` | PPL | Afiliación deportiva a equipo | F | `ACT-ADMIN` | — | la persona | `TeamAssignment` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-006` | PPL | Asignación de roles | F | `ACT-ADMIN` | — | la persona | `RoleAssignment` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-007` | PPL | Transiciones de afiliación y de rol de una jugadora | F | `ACT-ADMIN` | `ACT-CAPTAIN` (afectada: no se transfiere) | la jugadora | `TeamAssignment` + `RoleAssignment` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-008` | PPL | Relación de representación con menores | F | `ACT-ADMIN` (gestiona) | `ACT-GUARDIAN` (usa) | el menor | `GuardianRelationship` | `RoleAssignment ADMIN` / `GuardianRelationship` | `CLUB` / `CHILD` | `MAPPED` |
| `REQ-PPL-009` | PPL | PII mínima del guardián sobre el menor | F | `ACT-GUARDIAN` | — | el menor y el guardián | `Person` (menor), campos filtrados | `GuardianRelationship.can_view_child_info` | `CHILD` | `MAPPED` |
| `REQ-PPL-010` | PPL | Acceso de terceros sobre la propia cuenta | F | `ACT-PLAYER` (menor) | — | el menor | `GuardianRelationship` (lectura) | `Account` propia + relación activa | `SELF` | `MAPPED` |
| `REQ-PPL-011` | PPL | Autoridad por campo de datos personales | F | `SYSTEM_INTERNAL` | los 8 actores (afectados) | todos | cada campo de `Person` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-PPL-012` | PPL | Independencia entre representación y rol deportivo | F | `ACT-GUARDIAN` | — | el guardián | autoridad derivada | `GuardianRelationship` (y ausencia de `RoleAssignment`) | `CHILD` | `MAPPED` |
| `REQ-PPL-013` | PPL | Aviso de perfil incompleto y camino de recuperación | F | `ACT-PLAYER` | `ACT-ADMIN` (corrige identidad) | la jugadora | `Person` | `Account` + sesión / `RoleAssignment ADMIN` | `SELF` / `CLUB` | `MAPPED` |
| `REQ-PPL-014` | PPL | Identidad estable e inmutable del equipo | F | `ACT-ADMIN` | — | el club | `Team` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-015` | PPL | Archivo de estructura sin destruir historia | F | `ACT-ADMIN` | — | el club | relaciones de la persona | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PPL-016` | PPL | Perfil propio | F | `ACT-AUTHENTICATED` | `ACT-GUARDIAN` (selector de menor) | la persona | `Person` propia | `Account` + sesión | `SELF` | `MAPPED` |

---

# 4. STR — ESTRUCTURA DEL CLUB (13)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-STR-001` | STR | Temporada | F | `ACT-ADMIN` | — | el club | `Season` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-STR-002` | STR | División | F | `ACT-ADMIN` | — | el club | `Division` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-STR-003` | STR | Línea | F | `ACT-ADMIN` | — | el club | `Line` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-STR-004` | STR | Equipo | F | `ACT-ADMIN` | — | el club | `Team` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-STR-005` | STR | Sede | F | `ACT-ADMIN` | — | el club | `Venue` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-STR-006` | STR | Valla de dependencias al archivar | F | `ACT-ADMIN` | — | el club | estructura | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-STR-007` | STR | Zona horaria (título del catálogo desalineado — ver feedback) | F | `SYSTEM_INTERNAL` | `ACT-AUTHENTICATED` (afectado) | todos | fechas mostradas | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-STR-008` | STR | Operaciones de estructura disponibles desde el producto | F | `ACT-ADMIN` | — | el club | estructura | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-STR-009` | STR | Estructura no disponible para Subcomisión | F | `ACT-SUBCOMMITTEE` (recibe la denegación) | `ACT-ADMIN` (contrastado) | la Subcomisión | estructura | `RoleAssignment SUBCOMMITTEE` | `CLUB` | `MAPPED` |
| `REQ-STR-010` | STR | Etiqueta completa de línea y equipo | F | `ACT-AUTHENTICATED` | todos los concretos | todos los autenticados | `Line` / `Team` | `Account` + sesión | `N/A` (lectura) | `MAPPED` |
| `REQ-STR-011` | STR | Las referencias de estructura no se resuelven por nombre | F | `SYSTEM_INTERNAL` | — | todos | referencias | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-STR-012` | STR | Identidad de la sede y cambios de sede | F | `ACT-ADMIN` (regla A: identidad de sede) | `ACT-COACH`, `ACT-SUBCOMMITTEE` (regla B: cambio en un evento) | club / alcanzados | `Venue` / `Event` | `RoleAssignment ADMIN` / `COACH` / `SUBCOMMITTEE` | `CLUB` / `TEAM` / `EVENT` | `MAPPED` |
| `REQ-STR-013` | STR | Estructura como referencia seleccionable | F | `ACT-ADMIN` | — | el club | estructura | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |

---

# 5. EVT — EVENTOS Y CALENDARIO (24)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-EVT-001` | EVT | Invariantes de un evento | F | `SYSTEM_INTERNAL` | — | todos | `Event` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-EVT-002` | EVT | Crear un entrenamiento | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `Event` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-003` | EVT | Crear un partido | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `Event` `MATCH` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `CLUB` | `MAPPED` |
| `REQ-EVT-004` | EVT | Crear un evento del club | F | `ACT-SUBCOMMITTEE` | `ACT-COACH` (alcance `EVENT`) | el club | `Event` | `RoleAssignment SUBCOMMITTEE` / `COACH` | `CLUB` / `EVENT` | `MAPPED` |
| `REQ-EVT-005` | EVT | Destinatarios plurales de un evento | F | `SYSTEM_INTERNAL` | `ACT-COACH`, `ACT-SUBCOMMITTEE` (condición) | todos | destinatarios | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-EVT-006` | EVT | Equipo concreto e inmutable del partido | F | `SYSTEM_INTERNAL` | `ACT-COACH`, `ACT-SUBCOMMITTEE` (condición) | todos | `Event.teamId` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-EVT-007` | EVT | Ciclo de vida del evento | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `Event` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-008` | EVT | Estados terminales y su comunicación | F | `ACT-AUTHENTICATED` | todos los concretos | las personas alcanzadas | `Event` | `Account` + sesión + alcance | `N/A` | `MAPPED` |
| `REQ-EVT-009` | EVT | Programar un evento | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `Event` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-010` | EVT | Cambio no material | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `Event` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-011` | EVT | Cambio material | F | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-CAPTAIN` (logística) | las personas alcanzadas | `Event` | `RoleAssignment COACH` / `SUBCOMMITTEE` / `CAPTAIN` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-012` | EVT | Vista previa de impacto y reconfirmación | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `Event` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-013` | EVT | Reconciliación ante conflicto de concurrencia | F | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` (valla técnica — ver `ACTOR-FEEDBACK-07`) | las personas alcanzadas | `Event` | `RoleAssignment COACH` / `SUBCOMMITTEE` / `ADMIN` | `TEAM` / `CLUB` | `MAPPED` |
| `REQ-EVT-014` | EVT | Serie de eventos: existencia y creación | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `EventSeries` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-015` | EVT | Serie de eventos: alcances de cambio | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `EventSeries` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-016` | EVT | Serie de eventos: fin y límites | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | las personas alcanzadas | `EventSeries` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-017` | EVT | Superficie de participación de un evento | F | `ACT-PLAYER` | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-GUARDIAN` | las personas alcanzadas | `Event` | `Account` + sesión + tipo + autoridad del actor | `TEAM` / `CHILD` | `MAPPED` |
| `REQ-EVT-018` | EVT | Jornada: creación y agrupación | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | el club | `Jornada` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `CLUB` | `MAPPED` |
| `REQ-EVT-019` | EVT | Logística del evento | F | `ACT-COACH` | **`ACT-CAPTAIN`** (autoridad propia), `ACT-SUBCOMMITTEE` | las personas alcanzadas | `EventLogistics` | `RoleAssignment COACH` / **`CAPTAIN`** / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-EVT-020` | EVT | Calendario como proyección | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | proyección de calendario | `Account` + sesión + alcance derivado | `N/A` | `MAPPED` |
| `REQ-EVT-021` | EVT | Inicio como proyección de acción | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | proyección de inicio | `Account` + sesión + alcance derivado | `N/A` | `MAPPED` |
| `REQ-EVT-022` | EVT | Coherencia entre proyecciones | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | inicio, calendario, equipo, evento | `Account` + sesión | `N/A` | `MAPPED` |
| `REQ-EVT-023` | EVT | Consulta del evento y su contexto | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | `Event` | `Account` + sesión + alcance | `N/A` | `MAPPED` |
| `REQ-EVT-024` | EVT | Valla de dependencias de jornada | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` (valla técnica — ver `ACTOR-DECISION-02`) | el club | `Jornada` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `MAPPED` |

---

# 6. PRT — PARTICIPACIÓN (19)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-PRT-001` | PRT | Responder la propia disponibilidad | F | `ACT-PLAYER` | `ACT-CAPTAIN` (requiere `PLAYER` vigente) | la jugadora | `Availability` | `RoleAssignment PLAYER` + `TeamAssignment` + `Membership` | `TEAM` | `MAPPED` |
| `REQ-PRT-002` | PRT | Responder la disponibilidad de un menor por delegación | F | `ACT-GUARDIAN` | — | el menor | `Availability` del menor | `GuardianRelationship.can_respond_availability` | `CHILD` | `MAPPED` |
| `REQ-PRT-003` | PRT | Estados derivados de la disponibilidad | F | `SYSTEM_INTERNAL` | `ACT-PLAYER`, `ACT-GUARDIAN` (observan) | las personas alcanzadas | `Availability` derivada | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-PRT-004` | PRT | Condiciones de la disponibilidad | F | `ACT-PLAYER` | `ACT-GUARDIAN` | la persona / el menor | `Availability` | `RoleAssignment PLAYER` / `GuardianRelationship` | `TEAM` / `CHILD` | `MAPPED` |
| `REQ-PRT-005` | PRT | Convocatoria: borrador, publicación e historial | F | `ACT-COACH` | — | las convocadas | `Selection` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-006` | PRT | La publicación no se bloquea por un conflicto derivado | F | `ACT-COACH` | — | las convocadas | `Selection` + conflicto | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-007` | PRT | Conflictos actuales de una convocatoria | F | `ACT-COACH` | — | las convocadas | `Selection` + `EligibilityConstraint` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-008` | PRT | Guardado automático de la convocatoria | F | `ACT-COACH` | — | las convocadas | `Selection` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-009` | PRT | Asistencia: apertura y registro | F | `ACT-COACH` | — | las convocadas | `Attendance` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-010` | PRT | "Sin registrar" es un estado distinto de "ausente" | F | `SYSTEM_INTERNAL` | `ACT-COACH` (registra) | el club | `Attendance` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-PRT-011` | PRT | Cierre de la asistencia | F | `ACT-COACH` | — | las convocadas | `Attendance` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-012` | PRT | Corrección de asistencia auditada | F | `ACT-COACH` | — | las convocadas | `Attendance` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-013` | PRT | Resultado de partido: borrador y finalización | F | `ACT-COACH` | — | el club | `MatchRecord` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-014` | PRT | Corrección de resultado | F | `ACT-COACH` | — | el club | `MatchRecord` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-015` | PRT | Compatibilidad entre resultado y ciclo del evento | F | `SYSTEM_INTERNAL` | `ACT-COACH` (opera dentro) | el club | `MatchRecord` / `Event` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-PRT-016` | PRT | Estadísticas de partido | F | `ACT-COACH` | — | el club | estadísticas | `RoleAssignment COACH` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-PRT-017` | PRT | Habilitación como condición de participación | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN`, `ACT-COACH` (lee estado) | la jugadora afectada | `EligibilityConstraint` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `MAPPED` |
| `REQ-PRT-018` | PRT | Conceptos de participación independientes | F | `SYSTEM_INTERNAL` | — | el club | disponibilidad, convocatoria, asistencia, habilitación | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-PRT-019` | PRT | Aplicabilidad por tipo de evento | F | `SYSTEM_INTERNAL` | — | el club | matriz de aplicabilidad | — | `N/A` | `SYSTEM_INTERNAL` |

---

# 7. COM — COMUNICACIÓN (18)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-COM-001` | COM | Ciclo de vida del comunicado | F | `ACT-SUBCOMMITTEE` | — | la audiencia | `Announcement` | `RoleAssignment SUBCOMMITTEE` | `CLUB` | `MAPPED` |
| `REQ-COM-002` | COM | Audiencia del comunicado | F | `ACT-SUBCOMMITTEE` | — | la audiencia | `Announcement.audience` | `RoleAssignment SUBCOMMITTEE` | `TEAM_SET` / `CLUB` | `MAPPED` |
| `REQ-COM-003` | COM | Fijación de la audiencia al publicar | F | `SYSTEM_INTERNAL` | `ACT-SUBCOMMITTEE` (publica) | la audiencia | snapshot de audiencia | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-COM-004` | COM | Corrección de comunicado | F | `ACT-SUBCOMMITTEE` | — | la audiencia | `Announcement` | `RoleAssignment SUBCOMMITTEE` | `CLUB` | `MAPPED` |
| `REQ-COM-005` | COM | Lectura del comunicado restringida a la audiencia | F | `ACT-AUTHENTICATED` | todos los concretos | la audiencia | `Announcement` | snapshot de audiencia | `N/A` | `MAPPED` |
| `REQ-COM-006` | COM | Conversación directa | F | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` (derecho comunicacional) | los participantes | `Conversation` `DIRECT` | `Account` + `REQ-COM-012` | `SELF` | `MAPPED` |
| `REQ-COM-007` | COM | Conversación de grupo | F | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | los participantes | `Conversation` `GROUP` | `Account` + `REQ-COM-012` | `SELF` | `MAPPED` |
| `REQ-COM-008` | COM | Conversaciones canónicas de equipo y de evento | F | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | los participantes | `Conversation` `TEAM` / `EVENT` | `Account` + `REQ-COM-012` | `TEAM` / `EVENT` | `MAPPED` |
| `REQ-COM-009` | COM | Mensajes | F | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | los participantes | `Message` | participación + período autorizado | `SELF` | `MAPPED` |
| `REQ-COM-010` | COM | Edición y borrado de mensajes | F | `ACT-AUTHENTICATED` | — | el autor | `Message` propia | autoría propia | `SELF` | `MAPPED` |
| `REQ-COM-011` | COM | Participantes y acceso temporal | F | `SYSTEM_INTERNAL` | los participantes (observan) | los participantes | `joined_at` / `left_at` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-COM-012` | COM | Derecho comunicacional | F | `SYSTEM_INTERNAL` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` (con accesorio); `ACT-ADMIN`, `ACT-SUBCOMMITTEE`, `ACT-GUARDIAN` (sin accesorio) | losright holders | entitlement comunicacional | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-COM-013` | COM | Alcance de los candidatos a participante | F | `ACT-AUTHENTICATED` | — | la persona | candidatos | `Account` + `REQ-COM-012` + relación | `SELF` | `MAPPED` |
| `REQ-COM-014` | COM | Tipos de notificación | F | `ACT-AUTHENTICATED` | todos los concretos | los notificados | `Notification` | `Account` + sesión | `N/A` | `MAPPED` |
| `REQ-COM-015` | COM | Notificación por alta y por baja en la convocatoria | F | `ACT-PLAYER` | `ACT-GUARDIAN` | notificados | `Notification` | `RoleAssignment PLAYER` / `GuardianRelationship` | `TEAM` / `CHILD` | `MAPPED` |
| `REQ-COM-016` | COM | Notificación por cambio de destinatarios de un evento | F | `ACT-PLAYER` | `ACT-COACH`, `ACT-GUARDIAN` | audiencia notificada | `Notification` | `RoleAssignment PLAYER` / `COACH` / `GuardianRelationship` | `TEAM` / `CHILD` / `EVENT` | `MAPPED` |
| `REQ-COM-017` | COM | Hechos que no generan notificación | F | `SYSTEM_INTERNAL` | — | el club | lista negativa cerrada | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-COM-018` | COM | Notificaciones: audiencia, deduplicación y estado de lectura | F | `ACT-AUTHENTICATED` | todos los concretos | el notificado | `Notification` | `Account` + sesión | `N/A` | `MAPPED` |

---

# 8. CMP — COMPETENCIA (8)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-CMP-001` | CMP | Competencia: ciclo de vida | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | el club | `Competition` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `MAPPED` |
| `REQ-CMP-002` | CMP | Cierre de competencia | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | el club | `Competition` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `MAPPED` |
| `REQ-CMP-003` | CMP | Inscripción a competencia | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | el club | `CompetitionEntry` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `MAPPED` |
| `REQ-CMP-004` | CMP | Alcances `TEAM` y `LINE` de una inscripción | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | el club | `CompetitionEntry.scope` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `MAPPED` |
| `REQ-CMP-005` | CMP | Uso de la inscripción en un partido | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | el club | `CompetitionEntry` + `Event MATCH` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `MAPPED` |
| `REQ-CMP-006` | CMP | Referencia externa manual | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | el club | `ExternalReference` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `MAPPED` |
| `REQ-CMP-007` | CMP | Límite federativo | F | `SYSTEM_INTERNAL` | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` (operan) | el club | `ExternalReference` / restricciones | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-CMP-008` | CMP | Habilitación: alcance y visibilidad | F | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` (muta), `ACT-COACH` (lee estado) | la jugadora afectada | `EligibilityConstraint` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` / `COACH` | `CLUB` / `TEAM` / `EVENT` | `MAPPED` |

---

# 9. INS — BÚSQUEDA, INFORMES Y AUDITORÍA (12)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-INS-001` | INS | Búsqueda | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | personas, equipos, eventos, divisiones/líneas | `Account` + sesión + `REQ-PPL-011` | `N/A` | `MAPPED` |
| `REQ-INS-002` | INS | Alcance y PII de la búsqueda | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | resultados de búsqueda | `Account` + sesión + `REQ-PPL-011` | `N/A` | `MAPPED` |
| `REQ-INS-003` | INS | Estado de la consulta en la navegación | F | `ACT-AUTHENTICATED` | — | la persona | consulta | `Account` + sesión | `N/A` | `MAPPED` |
| `REQ-INS-004` | INS | Informe de asistencia | F | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-PLAYER` (propio), **`ACT-CAPTAIN`** (`TEAM` si corresponde — ver `ACTOR-FEEDBACK-03`). **`ACT-ADMIN` denegado** | club / la jugadora | `Attendance` agregada | `RoleAssignment COACH` / `SUBCOMMITTEE` / `PLAYER` / `CAPTAIN` | `TEAM` / `CLUB` / `SELF` | `MAPPED` |
| `REQ-INS-005` | INS | Informe de rendimiento | F | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-PLAYER` (propio), **`ACT-CAPTAIN`** (ver `ACTOR-FEEDBACK-03`). **`ACT-ADMIN` denegado** | club / la jugadora | `MatchRecord` agregado | ídem | `TEAM` / `CLUB` / `SELF` | `MAPPED` |
| `REQ-INS-006` | INS | Alcance de los informes | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | alcance derivado | derivado de la autoridad del actor | `SELF` / `TEAM` / `CLUB` | `MAPPED` |
| `REQ-INS-007` | INS | Enlace al origen desde los informes | F | `ACT-COACH` | `ACT-SUBCOMMITTEE` | club | enlace al hecho de origen | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `CLUB` | `MAPPED` |
| `REQ-INS-008` | INS | Auditoría: consulta | F | `ACT-ADMIN` | — | el club | `AuditEntry` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-INS-009` | INS | Auditoría: contenido mínimo | F | `ACT-ADMIN` | — | el club | `AuditEntry` | `RoleAssignment ADMIN` | `CLUB` | `MAPPED` |
| `REQ-INS-010` | INS | Auditoría: integridad | NF | `SYSTEM_INTERNAL` | `ACT-ADMIN` (sólo lectura) | el club | `AuditEntry` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-INS-011` | INS | Historia: fuentes visibles | F | `ACT-AUTHENTICATED` | todos los concretos | la persona | historia por superficie | `Account` + sesión + alcance | `N/A` | `MAPPED` |
| `REQ-INS-012` | INS | Historia no genérica | NF | `SYSTEM_INTERNAL` | — | el club | historia | — | `N/A` | `SYSTEM_INTERNAL` |

---

# 10. SYS — TRANSVERSAL (27)

| REQ | Dominio | Resumen | Tipo | Actor primario | Actor(es) secundario(s) | Beneficiario | Sujeto/Target | Authority source | Scope | Actor Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-SYS-001` | SYS | Responsive con significado preservado | NF | `SYSTEM_INTERNAL` | todos los autenticados (afectados) | todos los autenticados | superficies | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-002` | SYS | Objetivos táctiles | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | controles | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-003` | SYS | Semántica de controles y gestión de foco | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | controles | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-004` | SYS | Movimiento sólo causal y reducción de movimiento | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | movimiento | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-005` | SYS | El estado se escribe, el color acompaña | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | estados | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-006` | SYS | Vocabulario de usuario, sin jerga interna | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | vocabulario | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-007` | SYS | Una pregunta dominante y una acción primaria | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | superficies | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-008` | SYS | Revelación progresiva | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | niveles de detalle | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-009` | SYS | Sin éxito falso | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | resultado de orden | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-010` | SYS | El error preserva lo ingressado | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | errores | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-011` | SYS | Vacío, cero y error son estados distintos | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | estados de dato | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-012` | SYS | No autorizado se oculta; bloqueado se deshabilita con razón | **F** | `ACT-AUTHENTICATED` | todos los concretos | todos los autenticados | acciones y secciones | `Account` + sesión + autoridad del actor | `N/A` | `MAPPED` |
| `REQ-SYS-013` | SYS | Navegación del navegador y enlace directo autosuficiente | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | navegación | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-014` | SYS | Coherencia entre superficies | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | proyecciones | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-015` | SYS | Verdad de la superficie | NF | `SYSTEM_INTERNAL` | todos los autenticados | todos los autenticados | valores visibles | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-016` | SYS | Idempotencia de las órdenes | NF | `SYSTEM_INTERNAL` | todos los concretos (emiten órdenes) | el club | órdenes | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-017` | SYS | Concurrencia optimista | NF | `SYSTEM_INTERNAL` | todos los concretos | el club | versión esperada | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-018` | SYS | Una orden, una transacción | NF | `SYSTEM_INTERNAL` | todos los concretos | el club | órdenes | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-019` | SYS | Proyecciones con un único dueño de escritura | NF | `SYSTEM_INTERNAL` | todos los concretos | el club | proyecciones | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-020` | SYS | Protección de datos en registros | NF | `SYSTEM_INTERNAL` | — | el club | registros | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-021` | SYS | Transporte y almacenamiento seguro | NF | `SYSTEM_INTERNAL` | — | el club | transporte y almacenamiento | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-022` | SYS | Disponibilidad, respaldo y recuperación | NF | `SYSTEM_INTERNAL` | todos los autenticados (afectados) | el club | plataforma | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-023` | SYS | Rendimiento de consultas comunes | NF | `SYSTEM_INTERNAL` | todos los autenticados (afectados) | todos los autenticados | consultas | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-024` | SYS | Latencia de notificación | NF | `SYSTEM_INTERNAL` | todos los notificados (afectados) | los notificados | `Notification` | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-025` | SYS | Efectos asíncronos durables | NF | `SYSTEM_INTERNAL` | — | el club | efectos asíncronos | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-026` | SYS | Evolución compatible | NF | `SYSTEM_INTERNAL` | — | el club | despliegues | — | `N/A` | `SYSTEM_INTERNAL` |
| `REQ-SYS-027` | SYS | Puerta externa de privacidad | NF | `NOT_APPLICABLE` | — | la organización del club (fuera del sistema) | procesos de privacidad | `EXTERNAL` — responsable del tratamiento, **fuera de GEI** | `N/A` | `NOT_APPLICABLE` |

---

# 11. MATRIZ DE COBERTURA

## 11.1 Contadores por estado

| Actor Status | Funcionales | No funcionales | **Total** |
|---|---:|---:|---:|
| `MAPPED` | **104** | **0** | **104** |
| `SYSTEM_INTERNAL` | **18** | 34 | **52** |
| `NOT_APPLICABLE` | 0 | 1 | **1** |
| `AMBIGUOUS` | **0** | **0** | **0** |
| **TOTAL** | **122** | **35** | **157** |

## 11.2 Contadores del catálogo

| Métrica | Valor |
|---|---:|
| Total de REQ IN | 157 |
| Funcionales IN | 122 |
| No funcionales IN | 35 |
| Funcionales con actor primario | 104 |
| Funcionales `SYSTEM_INTERNAL` | 18 |
| Funcionales `NOT_APPLICABLE` | 0 |
| Funcionales `AMBIGUOUS` | **0** |
| Actores canónicos | 8 |
| Actores abstractos | 1 |
| Actores de rol humano | 6 |
| Actores delegados | 1 |
| Actores de sistema externo | 0 |
| Actores sin REQ que los justifique | **0** |
| REQ sin actor | **0** |
| REQ `MAPPED` con actor secundario | 98 |
| REQ `DEFER` con actor asignado | 0 (fuera de V1) |
| REQ `OUT` con actor asignado | 0 (fuera de V1) |

## 11.3 Distribución por actor

Contadas sobre los 104 REQ `MAPPED`.

| Actor | REQ como primario | REQ donde aparece (primario o secundario) |
|---|---:|---:|
| `ACT-UNAUTHENTICATED` | 1 | 2 |
| `ACT-AUTHENTICATED` | 26 | 27 |
| `ACT-PLAYER` | 7 | 14 |
| `ACT-CAPTAIN` | **0** | 10 |
| `ACT-COACH` | 27 | 37 |
| `ACT-SUBCOMMITTEE` | 13 | 33 |
| `ACT-ADMIN` | 27 | 40 |
| `ACT-GUARDIAN` | 3 | 10 |
| **TOTAL** | **104** | — |

**Verificación de la suma:** `1 + 26 + 7 + 0 + 27 + 13 + 27 + 3 = 104`. Coincide exactamente con
los 104 REQ `MAPPED`.

**Sobre `ACT-CAPTAIN` con 0 REQ como primario.** Es correcto y es deliberado. En `REQ-EVT-019` la
logística la pueden iniciar `ACT-COACH`, `ACT-CAPTAIN` y `ACT-SUBCOMMITTEE`; E2 nombra como
primario al actor con el alcance más amplio (`ACT-COACH`) y registra a `ACT-CAPTAIN` como
secundario **con su autoridad propia marcada**. `ACT-CAPTAIN` sí tiene REQ que lo justifican
(10), por lo que el gate "0 actores sin requerimiento" se cumple.

## 11.4 Cobertura inversa: actor → REQ

| Actor | ¿Tiene al menos un REQ como primario? | ¿Tiene al menos un REQ que lo justifique? |
|---|---|---|
| `ACT-UNAUTHENTICATED` | Sí — `REQ-IAM-001` | **Sí** — 2 REQ |
| `ACT-AUTHENTICATED` | Sí — `REQ-IAM-005`, `REQ-IAM-010`, `REQ-IAM-020`, `REQ-PPL-016` | **Sí** — 27 REQ |
| `ACT-PLAYER` | Sí — `REQ-PRT-001` | **Sí** — 14 REQ |
| `ACT-CAPTAIN` | No como primario | **Sí** — 10 REQ |
| `ACT-COACH` | Sí — `REQ-EVT-002`, `REQ-PRT-005` | **Sí** — 37 REQ |
| `ACT-SUBCOMMITTEE` | Sí — `REQ-COM-001`, `REQ-EVT-004` | **Sí** — 33 REQ |
| `ACT-ADMIN` | Sí — `REQ-IAM-002`, `REQ-STR-001` | **Sí** — 40 REQ |
| `ACT-GUARDIAN` | Sí — `REQ-PPL-009`, `REQ-PPL-012`, `REQ-PRT-002` | **Sí** — 10 REQ |

**Gate: 0 actores sin REQ. 0 REQ sin actor. 0 `AMBIGUOUS`.**

---

# 12. NOTAS DE LA MATRIZ

1. **Sólo un REQ funcional es `NOT_APPLICABLE`**, y no lo es: `REQ-SYS-027` es no funcional y
   `EXTERNAL`. Ningún funcional quedó sin actor.
2. **Los 18 funcionales `SYSTEM_INTERNAL`** son reglas sin initiator humano: invariantes
   (`REQ-EVT-001`, `REQ-EVT-006`), integridad referencial (`REQ-STR-011`), derivación
   (`REQ-PRT-003`, `REQ-PRT-010`, `REQ-COM-003`), fórmula de autoridad (`REQ-IAM-016`),
   elegibilidad de superficie (`REQ-COM-012`), y Boundaries de aplicabilidad
   (`REQ-PRT-018`, `REQ-PRT-019`).
3. **`REQ-COM-012` es `SYSTEM_INTERNAL` pero con actores afectados explícitos.** El derecho
   comunicacional se aplica automáticamente, pero sus AC son observaciones sobre la navegación de
   cinco actores. Registrado como `ACTOR-FEEDBACK-04`.
4. **`REQ-EVT-013` y `REQ-EVT-024` incluyen `ACT-ADMIN` como secundario.** La participación de
   `ACT-ADMIN` es la valla técnica y la reconciliación de concurrencia, **no** autoridad
   deportiva. `ACTOR-FEEDBACK-07` y `ACTOR-DECISION-02`.
5. **`REQ-INS-004` y `REQ-INS-005` excluyen explícitamente a `ACT-ADMIN`.** No es una omisión de
   la matriz: es `REQ-INS-004` AC *"el acceso es denegado"* y su NOTES: *"No es un defecto"*.
6. **`ACT-CAPTAIN` aparece como secundario en `REQ-INS-004` y `REQ-INS-005` por PT §5**, aunque el
   catálogo de E1 no lo nombre. `ACTOR-FEEDBACK-03`.
7. **Ningún REQ `DEFER` (14) ni `OUT` (26) recibió actor.** Estan fuera de V1; modelarlos sería
   ampliar alcance.
8. **Los REQ no funcionales no fuerzan actor.** Registran actores afectados donde aporta valor
   (accesibilidad, rendimiento, latencia). `REQ-DECISION-NEEDED-02` sigue abierta y no afecta la
   identidad de ningún actor.

---

**Fin del Actor ↔ Requirement Matrix V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/actors/`.
