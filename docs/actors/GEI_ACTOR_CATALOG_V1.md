# GEI HOCKEY MANAGEMENT SYSTEM
## ACTOR CATALOG V1

**Etapa:** 2 — Modelo de Actores
**Estado:** FROZEN · **Fecha:** 2026-10-05
**Rama:** `gei/e2-actor-model-freeze-v1`
**Baseline de requerimientos:** `29b923f3cb01cf4b425fd6928d210799b9a4bbec`
**Documento de autoridad de la Etapa 2:** `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md`
**Proceso y evidencia:** `docs/actors/GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md`

---

# 0. CONVENCIONES

| Término | Significado |
|---|---|
| **Actor** | Capacidad externa con la que una persona o un sistema interactúa con GEI |
| `AUTHORITY SOURCE` | Entidad que otorga la autoridad: `RoleAssignment`, `GuardianRelationship` o `Account` |
| `ABSTRACT` | `YES` = no instanciable; `NO` = instanciable por una persona real |
| `KIND` | `HUMAN_ROLE` · `DELEGATED_HUMAN` · `ABSTRACT_ACTOR` · `EXTERNAL_SYSTEM` |
| `SELF` / `CHILD` / `TEAM` / `TEAM_SET` / `CLUB` / `EVENT` | Scopes que existen realmente (§8) |
| Default | **DENY** (Freeze §7.1) |

**Vocabulario canónico:** `Person`, `Account`, `Membership`, `TeamAssignment`, `RoleAssignment`,
`GuardianRelationship`, `Actor`. Ninguno es sinónimo de otro.

---

# 1. RESUMEN DEL CATÁLOGO

| ID | Nombre | KIND | Abstract | Authority source | Scopes |
|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | Persona no autenticada | `HUMAN_ROLE` | NO | Ninguna (credencial o código propio) | `SELF` |
| `ACT-AUTHENTICATED` | Persona autenticada | `ABSTRACT_ACTOR` | **YES** | `Account ACTIVE` + sesión vigente | `SELF` |
| `ACT-PLAYER` | Jugadora | `HUMAN_ROLE` | NO | `RoleAssignment PLAYER` | `SELF`, `TEAM` |
| `ACT-CAPTAIN` | Capitana | `HUMAN_ROLE` | NO | `RoleAssignment CAPTAIN` | `SELF`, `TEAM` |
| `ACT-COACH` | Entrenador/a | `HUMAN_ROLE` | NO | `RoleAssignment COACH` | `SELF`, `TEAM`, `EVENT` |
| `ACT-SUBCOMMITTEE` | Subcomisión de hockey | `HUMAN_ROLE` | NO | `RoleAssignment SUBCOMMITTEE` | `SELF`, `TEAM_SET`, `CLUB` |
| `ACT-ADMIN` | Administración del club | `HUMAN_ROLE` | NO | `RoleAssignment ADMIN` | `SELF`, `CLUB` |
| `ACT-GUARDIAN` | Responsable / guardian | `DELEGATED_HUMAN` | NO | `GuardianRelationship` | `SELF`, `CHILD` |

## 1.1 Conteos

| Métrica | Valor |
|---|---:|
| **Total de actores canónicos** | **8** |
| Actores abstractos | 1 |
| Actores de rol humano (`HUMAN_ROLE`) | 6 |
| Actores humanos delegados (`DELEGATED_HUMAN`) | 1 |
| Actores de sistema externo (`EXTERNAL_SYSTEM`) | **0** |
| Actores no instanciables | 1 |
| Generalizaciones adoptadas | 6 |
| Generalizaciones rechazadas | 16 |
| Relaciones de delegación | 1 |
| Relaciones de coexistencia | 4 |

## 1.2 Orden de lectura

1. `ACT-UNAUTHENTICATED` → la única capacidad fuera de la sesión
2. `ACT-AUTHENTICATED` → el actor abstracto que **no concede nada**
3. `ACT-PLAYER` → el rol deportivo base
4. `ACT-CAPTAIN` → el rol con autoridad propia
5. `ACT-COACH` → autoridad deportiva por scope
6. `ACT-SUBCOMMITTEE` → autoridad oficial de club
7. `ACT-ADMIN` → autoridad administrativa, sin autoridad deportiva
8. `ACT-GUARDIAN` → autoridad delegada, no rol

---

# 2. ACT-UNAUTHENTICATED

| Campo | Valor |
|---|---|
| **ID** | `ACT-UNAUTHENTICATED` |
| **Name** | Persona no autenticada |
| **Kind** | `HUMAN_ROLE` |
| **Abstract** | **NO** |
| **Business definition** | Persona externa que interactúa con GEI **sin sesión establecida**. Puede intentar autenticarse o consumir un código de un solo uso. |
| **Why this actor exists** | `REQ-IAM-001` exige que alguien **inicie** la autenticación. Sin nombrar a esa persona, el requerimiento no tiene sujeto. `REQ-IAM-003` exige que alguien **consuma** un código de activación sin que se cree sesión. Ambas capacidades ocurren fuera de la frontera de sesión. |
| **Entry conditions** | No requiere `Account ACTIVE`. Requiere **o bien** credencial establecida **o bien** un código de un solo uso vigente para una `Account PENDING`. |
| **Authority source** | **Ninguna.** La posesión de una credencial o de un código propio no es una fuente de autoridad de dominio. |
| **Typical scopes** | `SELF` — su propia cuenta, exclusivamente |
| **Can initiate** | Autenticarse (`REQ-IAM-001`); consumir un código de activación de un solo uso (`REQ-IAM-003`) |
| **Can participate** | Ninguna otra. No ve datos del club. |
| **Can receive** | Un resultado: sesión creada, o fallo con limitación de intentos y **sin revelar si el usuario existe** (`REQ-IAM-001` AC 2) |
| **PII boundary** | **CERO.** No recibe ningún dato del club ni de terceros. Sólo su propia credencial. |
| **Object-state limits** | `Account PENDING` o `DISABLED` ⇒ acceso rechazado con explicación, **sin crear sesión** (`REQ-IAM-001` AC 3). Cinco intentos fallidos invalidan el código; máximo 1 código activo por cuenta (`REQ-IAM-003`) |
| **Field-authority notes** | El campo no autorizado **no existe en la respuesta** (`REQ-PPL-011` AC 4). Aquí no hay ningún campo autorizado |
| **RoleAssignment relation** | **NONE** |
| **Account relation** | Requiere una `Account` en estado `PENDING` (para el consumo de código) o `ACTIVE` (para la autenticación) |
| **Membership relation** | **NONE** |
| **Delegation relation** | **NONE** |
| **Requirements covered** | `REQ-IAM-001`, `REQ-IAM-003` (como consumidor), `REQ-IAM-019` (como sujeto del límite de intentos) |
| **Explicitly does NOT imply** | Cualquier lectura del club · cualquier rol · cualquier `Membership` · cualquier dato de PII · acceso a la aplicación tras el fallo de autenticación · existencia de una `Account` válida |
| **Notes** | `ACT-UNAUTHENTICATED` **agrupa deliberadamente** dos contextos (con credencial no autenticado, y con código pendiente) para **no** crear un actor definido por un estado de `Account`. `Account PENDING` / `ACTIVE` / `DISABLED` son estados, no actores. |

---

# 3. ACT-AUTHENTICATED

| Campo | Valor |
|---|---|
| **ID** | `ACT-AUTHENTICATED` |
| **Name** | Persona autenticada |
| **Kind** | `ABSTRACT_ACTOR` |
| **Abstract** | **YES** — no instanciable |
| **Business definition** | Capacidad común de toda persona con `Account ACTIVE` y sesión vigente, sin considerar su rol ni sus delegaciones. |
| **Why this actor exists** | PT §5 fila 1 concede `editar propio contacto/password` a **los cinco** roles por igual. `REQ-IAM-005`, `REQ-IAM-010` y `REQ-PPL-016` nombran a `Authenticated user` como initiator. Sin actor abstracto, esa capacidad se repetiría 7 veces con riesgo de divergencia. |
| **Entry conditions** | `Account.status = ACTIVE` **y** credencial válida **y** sesión vigente |
| **Authority source** | `Account` + sesión. **No es** una fuente de autoridad de dominio. |
| **Typical scopes** | `SELF` |
| **Can initiate** | Editar contacto y contraseña propios (`REQ-IAM-005`); ver y cerrar sesiones propias (`REQ-IAM-010`); ver el perfil propio y cambiar el contexto de menor consultado (`REQ-PPL-016`); sobrevivir a la interrupción de sesión preservando el trabajo (`REQ-IAM-020`) |
| **Can participate** | En las capacidades de cualquier actor concreto, evaluadas por su propia fuente |
| **Can receive** | Sus propios datos de identidad, pertenencia con vigencia, roles con alcance resuelto y estado de cuenta (`REQ-PPL-016` AC 1) |
| **PII boundary** | `SELF DATA` completo · `SECURITY` completo · `ACCOUNT STATE` propio · `CONTACT` propio. **Nada** de terceros. |
| **Object-state limits** | `DISABLED` revoca las sesiones y bloquea la entrada (`REQ-IAM-002`). Sesión: inactividad 12 h, absoluta 7 d (`REQ-IAM-008`). |
| **Field-authority notes** | Este actor **no concede acceso a la aplicación**: `REQ-IAM-012` exige `rol interno vigente` **o** `delegación con permiso`; sin ninguno ⇒ `/no-access` sin datos ni destinos. |
| **RoleAssignment relation** | **ABSTRACT** — es el padre de los 6 actores autenticados concretos |
| **Account relation** | Requiere `Account ACTIVE` |
| **Membership relation** | No la requiere para sus propias capacidades; sí la exigen sus hijos de rol |
| **Delegation relation** | **NONE** — no delega ni recibe delegación |
| **Requirements covered** | `REQ-IAM-005`, `REQ-IAM-010`, `REQ-IAM-020`, `REQ-PPL-016`, `REQ-IAM-008`, `REQ-IAM-012` (como condición de entrada) |
| **Explicitly does NOT imply** | Acceso a la aplicación por sí solo · disponibilidad propia · convocatoria · asistencia · resultado · comunicados oficiales · estructura del club · cuentas · auditoría · ninguna capacidad de proyección |
| **Notes** | **Regla dura:** `ACT-AUTHENTICATED` **no** es una forma de conceder permisos por defecto. No contiene ninguna proyección (calendario, inicio, búsqueda, informes) porque su contenido depende del scope de cada actor concreto. |

## 3.1 Límite explícito del actor abstracto

| Incluido (actor-independiente) | Excluido deliberadamente |
|---|---|
| Editar contacto y contraseña propios | Calendario, Inicio, búsqueda, informes |
| Ver y cerrar sesiones propias | Disponibilidad propia (requiere `PLAYER`) |
| Ver el perfil propio; cambiar el contexto de menor | Convocatoria, asistencia, resultado (requieren `COACH`) |
| Sobrevivir a la interrupción de sesión | Comunicado oficial (requiere `SUBCOMMITTEE`) |
| — | Gestión de identidad (requiere `ADMIN`) |

---

# 4. ACT-PLAYER

| Campo | Valor |
|---|---|
| **ID** | `ACT-PLAYER` |
| **Name** | Jugadora |
| **Kind** | `HUMAN_ROLE` |
| **Abstract** | NO |
| **Business definition** | Persona con `RoleAssignment PLAYER` vigente sobre un equipo, dentro de una `Membership` vigente, cuya afiliación deportiva está activa. |
| **Why this actor exists** | `REQ-PRT-001` exige que alguien responda **su propia** disponibilidad. PT §5 lo exige para `PLAYER` y lo condiciona a `PLAYER` para `COACH`, `SUBCOMMITTEE` y `ADMIN`. Es el actor que sostiene el conteo de "Who's Quién" de un evento. |
| **Entry conditions** | `Account ACTIVE` + `Membership` vigente (`REQ-PPL-004`) + `RoleAssignment PLAYER` vigente (`REQ-PPL-006`) + `TeamAssignment` vigente (`REQ-PPL-007`) |
| **Authority source** | `RoleAssignment PLAYER` (scope `TEAM`) |
| **Typical scopes** | `SELF` (perfil, contacto, sesiones) · `TEAM` (disponibilidad, informes propios, eventos del equipo) |
| **Can initiate** | Responder su propia disponibilidad con `sí` / `quizás` / `no` (`REQ-PRT-001`) · ver el aviso de perfil incompleto con el siguiente paso (`REQ-PPL-013`) · ver quiénthird-party accede sobre su cuenta, sólo lectura (`REQ-PPL-010`) · consultar calendario, inicio, evento y búsqueda en su scope (`REQ-EVT-020/021/023`, `REQ-INS-001/002/003`) · ver su informe de asistencia y de rendimiento propios (`REQ-INS-004`, `REQ-INS-005`) · responder por un menor **sólo si además** es `ACT-GUARDIAN` (PT §5 fila 3) · crear y participar en conversaciones (`REQ-COM-006/007/008/009`) · leer sus notificaciones (`REQ-COM-014/018`) · participar en una conversación canónica de su equipo o de un evento que la alcance |
| **Can participate** | En la convocatoria de su equipo (`REQ-PRT-005`), como convocada; en el registro de asistencia de su equipo (`REQ-PRT-009`), como asistida; en la serie de eventos de su equipo, como alcanzada |
| **Can receive** | Notificaciones de siete tipos (`REQ-COM-014`); notificación de alta o baja en convocatoria (`REQ-COM-015`); notificación por cambio de destinatarios (`REQ-COM-016`); conflictos de habilitación visibles en la convocatoria (`REQ-PRT-006`) |
| **PII boundary** | `SELF DATA` V/E · `OTHER PERSON BASIC` V (equipo) · `CONTACT` V con necesidad operativa (equipo) · `ELIGIBILITY STATUS` **NONE** por default deny · `ELIGIBILITY REASON` **NONE** · `MESSAGE BODY` C (participante + período) · `AUDIT` **NONE** |
| **Object-state limits** | Disponibilidad sólo con evento `SCHEDULED`; `POSTPONED` conserva respuestas y no acepta nuevas; `DRAFT` no acepta (`REQ-PRT-004`) · `COMPLETED` no se reabre (`REQ-EVT-007`) · `CANCELLED`, `COMPLETED`, `ABANDONED` son terminales (`REQ-EVT-008`) |
| **Field-authority notes** | `REQ-PPL-011` AC 4: el campo no autorizado **no existe en la respuesta**, no se oculta en pantalla. Regla `Nunca`: la capitana no ve DNI; el guardián no ve otros menores |
| **RoleAssignment relation** | **DIRECT** — `RoleAssignment PLAYER`. Obligatorio. `REQ-PPL-007` lo crea atómicamente con la afiliación |
| **Account relation** | **REQUIRED** — `Account ACTIVE` |
| **Membership relation** | **REQUIRED** — `REQ-PPL-004`: los roles internos exigen membresía vigente |
| **Delegation relation** | Sólo si además tiene `GuardianRelationship` con `can_respond_availability`. La relación no se hereda ni se pierde por ser `PLAYER` |
| **Requirements covered** | `REQ-PRT-001`, `REQ-PRT-004`, `REQ-PRT-013` (indirecta), `REQ-PRT-015`, `REQ-PRT-016`, `REQ-PRT-017`, `REQ-PRT-019`, `REQ-PPL-010`, `REQ-PPL-013`, `REQ-COM-006`, `REQ-COM-009`, `REQ-COM-013`, `REQ-COM-015`, `REQ-COM-016`, `REQ-INS-004`, `REQ-INS-005`, `REQ-EVT-017`, `REQ-EVT-020`, `REQ-EVT-021`, `REQ-EVT-022`, `REQ-EVT-023`, `REQ-EVT-008`, `REQ-INS-001`, `REQ-INS-002`, `REQ-INS-003`, `REQ-INS-006`, `REQ-INS-011`, `REQ-COM-005`, `REQ-COM-014`, `REQ-COM-018`, `REQ-STR-010`, `REQ-SYS-012` |
| **Explicitly does NOT imply** | Convocatoria · asistencia (registro) · resultado · estadísticas de partido · logística · comunicación oficial · estructura del club · cuentas ni roles · auditoría · `DNI` ni `DOB` de terceros · `ELIGIBILITY REASON` ni `ORIGIN` · capacidad de `COACH` · ser `CAPTAIN` por ser `PLAYER` |
| **Notes** | `PLAYER` **no** es "cualquier miembro". `TeamAssignment` por sí solo no produce este actor (`REQ-PPL-005`). Un `RoleAssignment PLAYER` expirado no produce este actor (`REQ-PPL-006`). |

---

# 5. ACT-CAPTAIN

| Campo | Valor |
|---|---|
| **ID** | `ACT-CAPTAIN` |
| **Name** | Capitana |
| **Kind** | `HUMAN_ROLE` |
| **Abstract** | NO |
| **Business definition** | Persona con `RoleAssignment CAPTAIN` vigente sobre un equipo, dentro de una `Membership` vigente, con autoridad propia sobre la logística de ese equipo. |
| **Why this actor exists** | `REQ-EVT-019` exige que la logística de un evento viva en el sistema y no en mensajes sueltos, y nombra a la capitana como iniciadora de esa actualización con su propio alcance. PT §5 registra `Logistics: Team scope` como la **única** fila donde `CAPTAIN` tiene `✓` y `PLAYER` tiene `—`. Sin actor propio, esa autoridad quedaría sin dueño. |
| **Entry conditions** | `Account ACTIVE` + `Membership` vigente + `RoleAssignment CAPTAIN` vigente |
| **Authority source** | `RoleAssignment CAPTAIN` (scope `TEAM`) |
| **Typical scopes** | `SELF` · `TEAM` (el `target` de su `RoleAssignment`) |
| **Can initiate** | **Actualizar la logística de un evento de su equipo** — hora de encuentro, hora de salida, punto de encuentro, nota de transporte, instrucciones de llegada (`REQ-EVT-019`) · consultar el informe de asistencia y el de rendimiento de su equipo, "si corresponde" (PT §5; `REQ-INS-004`, `REQ-INS-005`) · consultar el contacto de las jugadoras de su equipo con necesidad operativa (`REQ-PPL-011`) · todo lo de `ACT-AUTHENTICATED` |
| **Can participate** | En conversaciones (`REQ-COM-012`: accesorio comunicacional automático) · en la convocatoria y la asistencia de su equipo, como persona alcanzada |
| **Can receive** | Notificaciones de su equipo; logística del evento |
| **PII boundary** | `SELF DATA` V/E · `OTHER PERSON BASIC` V (equipo) · `CONTACT` **V (equipo, con necesidad operativa)** · `DNI` **NONE — regla `Nunca`** · `DOB` **NONE** · `ELIGIBILITY STATUS` **NONE por default deny** · `MESSAGE BODY` C · `AUDIT` **NONE** |
| **Object-state limits** | La logística sólo es editable mientras el evento no esté en estado terminal (`REQ-EVT-008`). Un cambio de logística es **material** (`REQ-EVT-011`; `REQ-EVT-019` RELATED): incrementa la revisión de coordinación, puede derivar reconfirmación y notifica |
| **Field-authority notes** | `REQ-PPL-011` AC 1: *"ve su teléfono y email pero no su DNI"*. PT §6 regla `Nunca`: *"CAPTAIN ve DNI por pertenecer al Team"* queda explícitamente **prohibido**. El filtrado es de campo en la respuesta |
| **RoleAssignment relation** | **DIRECT** — `RoleAssignment CAPTAIN`. Authority source único e independiente |
| **Account relation** | **REQUIRED** — `Account ACTIVE` |
| **Membership relation** | **REQUIRED** — `REQ-PPL-004` |
| **Delegation relation** | Sólo si además tiene `GuardianRelationship`. `ACT-CAPTAIN` **no** delega por su cuenta |
| **Requirements covered** | `REQ-EVT-019` (authority propia), `REQ-PPL-011` (PII de contacto de equipo), `REQ-INS-004`, `REQ-INS-005` (informes de equipo), `REQ-COM-012` (accesorio comunicacional), `REQ-PPL-007` (transiciones: no se transfiere al cambiar de equipo), `REQ-IAM-005`, `REQ-IAM-010`, `REQ-IAM-001` |
| **Explicitly does NOT imply** | Crear o editar eventos · crear partidos · posponer, reprogramar o cancelar · **convocatoria** · **asistencia** (registro) · **resultado** · **estadísticas de partido** · **selección** · logística **fuera de su equipo** · `DNI` de ningún miembro del equipo · `ELIGIBILITY REASON` ni `ORIGIN` · autoridad administrativa · **ninguna autoridad de `COACH`** · ser `COACH` por ser `CAPTAIN` |
| **Notes** | **Representación formal: actor canónico independiente (opción A).** No generaliza a ningún actor. `COEXISTENCE` con `ACT-PLAYER`, con el invariante de que en V1 siempre existe un `RoleAssignment PLAYER` vigente sobre el mismo equipo (PT §17; `REQ-PPL-007`; `src/mock/seed.ts:366-388`; `src/__tests__/domain-truth.test.tsx:261`). Ese invariante es una regla de comando, **no** una relación de tipos. Ver `GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md` §8. |

---

# 6. ACT-COACH

| Campo | Valor |
|---|---|
| **ID** | `ACT-COACH` |
| **Name** | Entrenador/a |
| **Kind** | `HUMAN_ROLE` |
| **Abstract** | NO |
| **Business definition** | Persona con `RoleAssignment COACH` vigente, con alcance `TEAM` o `EVENT`, dentro de una `Membership` vigente. |
| **Why this actor exists** | `REQ-EVT-002`…`REQ-EVT-018` y `REQ-PRT-005`…`REQ-PRT-016` exigen que alguien administre los eventos de sus equipos: convocatoria, asistencia, resultado y estadísticas. PT §5 define su bundle deportivo completo. |
| **Entry conditions** | `Account ACTIVE` + `Membership` vigente + `RoleAssignment COACH` vigente. **Se asigna por rol, no por afiliación** (PT §17; `REQ-PPL-005`) |
| **Authority source** | `RoleAssignment COACH` (scope `TEAM` **o** `EVENT`; cualquier otro ⇒ `422 INVALID_ROLE_SCOPE`) |
| **Typical scopes** | `SELF` · `TEAM` · `EVENT` |
| **Can initiate** | Crear y editar un entrenamiento (`REQ-EVT-002`) · crear un partido (`REQ-EVT-003`) · crear un evento dirigido (`REQ-EVT-004`) · ciclo de vida del evento: programar, posponer, reprogramar, cancelar, restaurar, iniciar, completar, abandonar (`REQ-EVT-007`, `REQ-EVT-009`) · cambio no material (`REQ-EVT-010`) · cambio material (`REQ-EVT-011`) · vista previa de impacto y reconfirmación (`REQ-EVT-012`) · reconciliación ante `STALE_VERSION` (`REQ-EVT-013`) · series: crear, cambiar alcances, finalizar (`REQ-EVT-014`…`REQ-EVT-016`) · jornada: creación y agrupación (`REQ-EVT-018`) · logística (`REQ-EVT-019`) · **convocatoria**: borrador, publicación, historial, conflictos, guardado automático (`REQ-PRT-005`…`REQ-PRT-008`) · **asistencia**: apertura, registro, cierre, corrección auditada (`REQ-PRT-009`, `REQ-PRT-011`, `REQ-PRT-012`) · **resultado**: borrador, finalización, corrección (`REQ-PRT-013`, `REQ-PRT-014`) · estadísticas de partido (`REQ-PRT-016`) · informes de asistencia, de rendimiento y enlace al origen (`REQ-INS-004`, `REQ-INS-005`, `REQ-INS-007`) · uso de la inscripción de competencia en un partido (`REQ-CMP-005`) |
| **Can participate** | En conversaciones (`REQ-COM-012`) · como destinatario de eventos de club (`REQ-EVT-004`) |
| **Can receive** | Notificaciones; conflictos de habilitación de su convocatoria (`REQ-PRT-006`, `REQ-PRT-007`) |
| **PII boundary** | `SELF DATA` V/E · `OTHER PERSON BASIC` V (su equipo) · `CONTACT` **V (equipo, con necesidad operativa)** · `DNI` **NONE** · `DOB` **NONE** · `ELIGIBILITY STATUS` **V con alcance** · `ELIGIBILITY REASON` **NONE** · `ELIGIBILITY SOURCE` **NONE** · `GUARDIAN RELATIONSHIP` **C — información operativa mínima** · `MESSAGE BODY` C · `AUDIT` **NONE** |
| **Object-state limits** | Convocatoria sólo con evento `SCHEDULED` y tipo `MATCH` (`REQ-PRT-005`) · asistencia con `SCHEDULED` o `IN_PROGRESS` y tipo `TRAINING` o `MATCH` (`REQ-PRT-009`) · resultado `DRAFT → FINAL` sólo si el ciclo del evento lo permite; fuera de ciclo ⇒ `MATCH_STATE_INCOMPATIBLE` (`REQ-PRT-013`, `REQ-PRT-015`) · estadísticas sólo con resultado `PLAYED` (`REQ-PRT-016`) · `COMPLETED` no se reabre (`REQ-EVT-007`) · cambiar el equipo de un partido programado se rechaza (`REQ-EVT-006`) |
| **Field-authority notes** | `REQ-PRT-017` AC: *"entrenador ve estado, no motivo ni origen"*. `REQ-PPL-011` AC 2: ve teléfono y email por necesidad operativa; no ve DNI ni fecha de nacimiento. `REQ-CMP-008`: motivo y origen sólo para `SUBCOMMITTEE` y `ADMIN` |
| **RoleAssignment relation** | **DIRECT** — `RoleAssignment COACH`. Es el rol; la afiliación deportiva es de la jugadora |
| **Account relation** | **REQUIRED** — `Account ACTIVE` |
| **Membership relation** | **REQUIRED** — `REQ-PPL-004` |
| **Delegation relation** | Sólo si además tiene `GuardianRelationship`. `ACT-COACH` **no** hereda ni delega autoridad de guardián |
| **Requirements covered** | `REQ-EVT-002`, `REQ-EVT-003`, `REQ-EVT-004`, `REQ-EVT-007`, `REQ-EVT-008`, `REQ-EVT-009`, `REQ-EVT-010`, `REQ-EVT-011`, `REQ-EVT-012`, `REQ-EVT-013`, `REQ-EVT-014`, `REQ-EVT-015`, `REQ-EVT-016`, `REQ-EVT-017`, `REQ-EVT-018`, `REQ-EVT-019`, `REQ-STR-012`, `REQ-PRT-005`, `REQ-PRT-006`, `REQ-PRT-007`, `REQ-PRT-008`, `REQ-PRT-009`, `REQ-PRT-011`, `REQ-PRT-012`, `REQ-PRT-013`, `REQ-PRT-014`, `REQ-PRT-016`, `REQ-PRT-017`, `REQ-CMP-005`, `REQ-CMP-008`, `REQ-COM-012`, `REQ-COM-016`, `REQ-INS-004`, `REQ-INS-005`, `REQ-INS-007` |
| **Explicitly does NOT imply** | **Ninguna autoridad administrativa**: no gestiona personas, cuentas, membresías, roles, estructura, competencias ni auditoría · no publica comunicados oficiales · **no responde su propia disponibilidad sin un `RoleAssignment PLAYER` vigente** (PT §5) · no ve `ELIGIBILITY REASON` ni `ORIGIN` · no ve `DNI` ni `DOB` · no administra ningún otro equipo fuera de su scope · no es `ADMIN` |
| **Notes** | Doble scope (`TEAM` / `EVENT`) es la única dualidad de scope entre los actores de rol. Es **authority deportiva**; la separación con la administración es explícita en `GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md` §11.4. |

---

# 7. ACT-SUBCOMMITTEE

| Campo | Valor |
|---|---|
| **ID** | `ACT-SUBCOMMITTEE` |
| **Name** | Subcomisión de hockey |
| **Kind** | `HUMAN_ROLE` |
| **Abstract** | NO |
| **Business definition** | Persona con `RoleAssignment SUBCOMMITTEE` vigente, dentro de una `Membership` vigente, con autoridad oficial a nivel de club. |
| **Why this actor exists** | `REQ-COM-001`…`REQ-COM-004` exigen que **sólo** la Subcomisión publique comunicados oficiales. `REQ-PRT-017` y `REQ-CMP-008` le dan la mutación de la habilitación. `REQ-CMP-001`…`REQ-CMP-006` le dan competencias e inscripciones. Es la autoridad que el club delega para hablar oficialmente y para habilitar. |
| **Entry conditions** | `Account ACTIVE` + `Membership` vigente + `RoleAssignment SUBCOMMITTEE` vigente |
| **Authority source** | `RoleAssignment SUBCOMMITTEE` (scope `CLUB`) |
| **Typical scopes** | `SELF` · `TEAM_SET` (audiencia de comunicado) · `CLUB` |
| **Can initiate** | **Comunicado oficial**: ciclo de vida `DRAFT → PUBLISHED → ARCHIVED`, audiencia, corrección con motivo (`REQ-COM-001`…`REQ-COM-004`) · crear y editar un evento del club (`REQ-EVT-004`) · crear partidos con alcance de club (`REQ-EVT-003`) · posponer, reprogramar y cancelar con alcance de club (`REQ-EVT-003`) · ciclo de vida, series y jornadas con alcance de club (`REQ-EVT-007`…`REQ-EVT-018`) · logística con alcance de club (`REQ-EVT-019`) · **mutar habilitación**: estado, alcance, origen, motivo y vigencia (`REQ-PRT-017`, `REQ-CMP-008`) · competencias: ciclo de vida, cierre, inscripciones, alcances `TEAM` y `LINE`, referencias externas (`REQ-CMP-001`…`REQ-CMP-006`) · informes a nivel de club y enlace al origen (`REQ-INS-004`, `REQ-INS-005`, `REQ-INS-007`) · reautenticación para gestión sensible (`REQ-IAM-009`) |
| **Can participate** | En conversaciones **sólo con entitlement comunicacional** (`REQ-COM-012`; PT §5) |
| **Can receive** | Notificaciones de club; comunicados publicados |
| **PII boundary** | `SELF DATA` V/E · `OTHER PERSON BASIC` V (club) · `CONTACT` **NONE — no está en la lista de PT §6** · `DNI` **NONE** · `DOB` **NONE** · `ELIGIBILITY STATUS` V · `ELIGIBILITY REASON` **V** · `ELIGIBILITY SOURCE` **V** · `MESSAGE BODY` **NONE sin entitlement** · `AUDIT` **NONE** |
| **Object-state limits** | La audiencia de un comunicado se fija al publicar y es un snapshot inmutable (`REQ-COM-003`); corregir no la cambia (`REQ-COM-004`) · una comunicación incorrecta requiere un comunicado **nuevo** · `Competitión` `CLOSED` no admite nuevas inscripciones activas (`REQ-CMP-002`) · cerrar o finalizar con dependencia activa se rechaza nombrando la dependencia (`REQ-EVT-024`) |
| **Field-authority notes** | `REQ-CMP-008`: el alcance limita dónde aplica; el motivo y el origen **sólo** para `SUBCOMMITTEE` y `ADMIN`; toda mutación auditada. `REQ-COM-001`: otro rol ⇒ denegado |
| **RoleAssignment relation** | **DIRECT** — `RoleAssignment SUBCOMMITTEE` |
| **Account relation** | **REQUIRED** — `Account ACTIVE` |
| **Membership relation** | **REQUIRED** — `REQ-PPL-004` |
| **Delegation relation** | **NONE** |
| **Requirements covered** | `REQ-COM-001`, `REQ-COM-002`, `REQ-COM-003`, `REQ-COM-004`, `REQ-EVT-002`, `REQ-EVT-003`, `REQ-EVT-004`, `REQ-EVT-007`, `REQ-EVT-009`, `REQ-EVT-010`, `REQ-EVT-011`, `REQ-EVT-012`, `REQ-EVT-013`, `REQ-EVT-014`, `REQ-EVT-015`, `REQ-EVT-016`, `REQ-EVT-018`, `REQ-EVT-019`, `REQ-EVT-024`, `REQ-STR-009`, `REQ-STR-012`, `REQ-PRT-017`, `REQ-CMP-001`, `REQ-CMP-002`, `REQ-CMP-003`, `REQ-CMP-004`, `REQ-CMP-005`, `REQ-CMP-006`, `REQ-CMP-008`, `REQ-INS-004`, `REQ-INS-005`, `REQ-INS-007`, `REQ-IAM-009` |
| **Explicitly does NOT imply** | **Estructura del club** — `REQ-STR-009`: *"el acceso es denegado con una explicación del motivo"* · **personas, cuentas ni accesos** — PT §5 `Personas/cuentas/accesos` → `—` · **convocatoria** · **asistencia** · **resultado** · **estadísticas de partido** · **selección** · **auditoría** · conversaciones privadas sin entitlement · `DNI` ni `DOB` · `CONTACT` de terceros · **no es `Coach`** — PT §5: *"SUBCOMMITTEE no equivale a Coach"* · **no es `ADMIN`** |
| **Notes** | `ACT-SUBCOMMITTEE` **no** es un "semi `ADMIN`". Su bundle es el oficial y el deportivo de club; el administrativo es de `ACT-ADMIN`. `REQ-STR-009` es el requerimiento que hace explícita la frontera, y su NOTES exige lo inverso: que una Subcomisión **con** autoridad real pueda entrar por una ruta que su padre no le niega (`CON-14`). |

---

# 8. ACT-ADMIN

| Campo | Valor |
|---|---|
| **ID** | `ACT-ADMIN` |
| **Name** | Administración del club |
| **Kind** | `HUMAN_ROLE` |
| **Abstract** | NO |
| **Business definition** | Persona con `RoleAssignment ADMIN` vigente, dentro de una `Membership` vigente, con autoridad administrativa a nivel de club sobre identidad, cuentas, estructura, competencias, habilitación y auditoría. |
| **Why this actor exists** | `REQ-IAM-002/003/004/013/014` exigen administración de cuentas; `REQ-PPL-001`…`REQ-PPL-008` exigen gobierno de personas y roles; `REQ-STR-001`…`REQ-STR-008` exigen estructura del club; `REQ-CMP-001`…`REQ-CMP-004` exigen competencias; `REQ-INS-008/009` exigen auditoría. Ninguna otra autoridad puede hacer esto. |
| **Entry conditions** | `Account ACTIVE` + `Membership` vigente + `RoleAssignment ADMIN` vigente. Debe existir al menos un `ADMIN` con alcance `CLUB` y `Account ACTIVE` (`REQ-IAM-013`) |
| **Authority source** | `RoleAssignment ADMIN` (scope `CLUB`) |
| **Typical scopes** | `SELF` · `CLUB` |
| **Can initiate** | Ciclo de vida de la cuenta y desactivación/reactivación (`REQ-IAM-002`) · emitir código de activación (`REQ-IAM-003`) · restablecer acceso administrativamente (`REQ-IAM-004`) · proteger el último administrador (`REQ-IAM-013`) · username inmutable y único (`REQ-IAM-014`) · reautenticación para gestión sensible (`REQ-IAM-009`) · persona base, identidad, `DNI`, fecha de nacimiento (`REQ-PPL-001`) · vincular persona–cuenta (`REQ-PPL-003`) · membresía (`REQ-PPL-004`) · afiliación deportiva (`REQ-PPL-005`) · asignar roles y alcances (`REQ-PPL-006`) · transiciones de afiliación y rol (`REQ-PPL-007`) · gestionar la relación de representación (`REQ-PPL-008` AC 3) · corregir identidad de un perfil incompleto (`REQ-PPL-013` AC 3) · **toda** la estructura del club: temporada, división, línea, equipo, sede, archivo, operaciones desde el producto, referencias seleccionables (`REQ-STR-001`…`REQ-STR-006`, `REQ-STR-008`, `REQ-STR-013`) · identidad y metadatos de sede (`REQ-STR-012` regla A) · identidad estable del equipo (`REQ-PPL-014`) · archivar sin destruir historia (`REQ-PPL-015`) · vallas de dependencia de jornada (`REQ-EVT-024`) · reconciliación ante `STALE_VERSION` (`REQ-EVT-013`) · mutar habilitación (`REQ-PRT-017`, `REQ-CMP-008`) · competencias e inscripciones y referencias externas (`REQ-CMP-001`…`REQ-CMP-004`, `REQ-CMP-006`) · **auditoría**: consulta y contenido mínimo (`REQ-INS-008`, `REQ-INS-009`) |
| **Can participate** | En conversaciones **sólo con entitlement comunicacional** (`REQ-COM-012`) |
| **Can receive** | Notificaciones administrativas; resultado de sus propios comandos |
| **PII boundary** | `SELF DATA` V/E · `OTHER PERSON BASIC` **V/E** · `CONTACT` **V/E** · `DNI` **V/E — único actor** · `DOB` **V/E — único actor** · `ACCOUNT STATE` **V/E** · `SECURITY` **C — reset administrativo** (`REQ-IAM-004`) · `ELIGIBILITY STATUS` V · `ELIGIBILITY REASON` V · `ELIGIBILITY SOURCE` V · `GUARDIAN RELATIONSHIP` **V/E** · `CHILD INFO` **C — sólo la relación que gestiona** · `MESSAGE BODY` **NONE sin entitlement — regla `Nunca`** · `AUDIT DETAILS` **V con redacción** · `AUDIT EDIT/DELETE` **NONE** (`REQ-INS-010`) |
| **Object-state limits** | No puede dejar 0 `ADMIN` `ACTIVE` con alcance `CLUB`: `LAST_ADMIN_REQUIRED`, nada cambia (`REQ-IAM-013`, `CON-20`) · archivar con dependencia activa ⇒ rechazado nombrando la dependencia (`REQ-STR-006`) · renombrar división o línea con equipos activos ⇒ rechazado (`REQ-PPL-014`) · finalizar una membresía con dependencias activas ⇒ rechazado, el período se conserva (`REQ-PPL-004`) · `Competitión` con inscripciones activas no se cierra (`REQ-CMP-002`) · desactivar una cuenta revoca sus sesiones (`REQ-IAM-002`) |
| **Field-authority notes** | `REQ-INS-009`: qué cambió, quién, cuándo, motivo cuando la acción lo exige, y enlace al objeto; **los datos sensibles se muestran redactados**. `REQ-SYS-020` y `REQ-INS-010`: sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos. Regla `Nunca` de PT §6: `ADMIN` **no** lee chats privados por ser `ADMIN` |
| **RoleAssignment relation** | **DIRECT** — `RoleAssignment ADMIN` |
| **Account relation** | **REQUIRED** — `Account ACTIVE`. `REQ-IAM-013` protege que exista al menos uno |
| **Membership relation** | **REQUIRED** — `REQ-PPL-004` |
| **Delegation relation** | **NONE** — `ACT-ADMIN` no delega; **gestiona** las relaciones de `ACT-GUARDIAN` |
| **Requirements covered** | `REQ-IAM-002`, `REQ-IAM-003`, `REQ-IAM-004`, `REQ-IAM-009`, `REQ-IAM-013`, `REQ-IAM-014`, `REQ-PPL-001`, `REQ-PPL-002`, `REQ-PPL-003`, `REQ-PPL-004`, `REQ-PPL-005`, `REQ-PPL-006`, `REQ-PPL-007`, `REQ-PPL-008`, `REQ-PPL-011`, `REQ-PPL-013`, `REQ-PPL-014`, `REQ-PPL-015`, `REQ-STR-001`, `REQ-STR-002`, `REQ-STR-003`, `REQ-STR-004`, `REQ-STR-005`, `REQ-STR-006`, `REQ-STR-008`, `REQ-STR-012`, `REQ-STR-013`, `REQ-EVT-013`, `REQ-EVT-024`, `REQ-PRT-017`, `REQ-CMP-001`, `REQ-CMP-002`, `REQ-CMP-003`, `REQ-CMP-004`, `REQ-CMP-006`, `REQ-CMP-008`, `REQ-INS-008`, `REQ-INS-009` |
| **Explicitly does NOT imply** | **`ACT-COACH`** · **`ACT-CAPTAIN`** · **`ACT-PLAYER`** · **ninguna autoridad deportiva** · crear o editar entrenamientos, partidos o eventos de club (`REQ-EVT-002` AC: *"Admin sin autoridad ⇒ denegado"*) · **convocatoria** · **asistencia** · **resultado** · **estadísticas de partido** · **selección** · **logística** · **comunicado oficial** · **informes de asistencia y de rendimiento** (`REQ-INS-004` AC: *"el acceso es denegado"*; NOTES: *"No es un defecto"*) · conversaciones privadas · acceso a los chats privados por su rol |
| **Notes** | **`ADMIN DOES NOT IMPLY`** `COACH`, `CAPTAIN`, `PLAYER` ni autoridad deportiva de ningún tipo. Si una acción deportiva requiere `COACH`, un `ADMIN` necesita **además** un `RoleAssignment COACH` vigente con su alcance propio. No existe `SUPERUSER`. Freeze §2.3.1 y PT §5 lo declaran; `REQ-INS-004` lo hace verificable. |

---

# 9. ACT-GUARDIAN

| Campo | Valor |
|---|---|
| **ID** | `ACT-GUARDIAN` |
| **Name** | Responsable / guardian |
| **Kind** | `DELEGATED_HUMAN` |
| **Abstract** | NO |
| **Business definition** | Adulto con al menos una `GuardianRelationship` vigente sobre uno o más menores. |
| **Why this actor exists** | `REQ-PRT-002` GOAL: *"que la disponibilidad de las menores no dependa de que la menor tenga cuenta propia"*. `REQ-PPL-012` GOAL: *"que 'tutor' no se convierta de hecho en un séptimo rol"*. La delegación es la única vía para que un adulto ejerza la gestión de un menor sin convertirse en rol deportivo. |
| **Entry conditions** | `Account ACTIVE` + al menos una `GuardianRelationship` vigente. **NO** requiere `Membership` (PT §17, PT §20; `REQ-PPL-008` PRECONDITION). **NO** requiere `RoleAssignment` |
| **Authority source** | **`GuardianRelationship`** — con dos flags independientes: `can_view_child_info` y `can_respond_availability` (PT §20; PT §26; `REQ-PPL-008`; `REQ-PRT-002`) |
| **Typical scopes** | `SELF` (lo propio, como todo autenticado) · **`CHILD`** — un `childId` por relación vigente |
| **Can initiate** | **Ver el contexto del menor** si `can_view_child_info`: nombre, apellido, equipo, eventos relevantes, disponibilidad relevante e información operativa necesaria (`REQ-PPL-009`) · **Responder la disponibilidad del menor** si `can_respond_availability`, y la respuesta queda **a nombre del menor** (`REQ-PRT-002`) · consultar y modificar sus **propios** datos de contacto (`REQ-PPL-009` AC 3) · ver y cerrar sus sesiones · cambiar el contexto de menor consultado cuando tiene varios (`REQ-PPL-016` AC 5) · consultar sus notificaciones |
| **Can participate** | En las proyecciones del menor: Inicio, Calendario, Equipo y Disponibilidad muestran el contexto del menor seleccionado (`REQ-PPL-016` AC 5; PT §20) |
| **Can receive** | Notificaciones del menor cuando tiene `can_respond_availability`: alta o baja en convocatoria (`REQ-COM-015`), cambio de destinatarios (`REQ-COM-016`) |
| **PII boundary** | `SELF DATA` V/E · `CONTACT` **V/E propios** · **del menor**: nombre y apellido **VIEW**, equipo **VIEW**, eventos relevantes **VIEW**, disponibilidad relevante **VIEW**, información operativa necesaria **VIEW** · `DNI` **NONE** · `DOB` **NONE** · información administrativa **NONE** · `ELIGIBILITY STATUS` **NONE** · `ELIGIBILITY REASON` **NONE** · `ELIGIBILITY SOURCE` **NONE** · `CONTACT` del menor **NONE por defecto** (PT §6 v1.0.1; `CON-08`) · conversaciones privadas **NONE** · `AUDIT` **NONE** · roles administrativos **NONE** · **datos de otro menor: NONE — regla `Nunca`** |
| **Object-state limits** | Al finalizar la relación, deja de conceder acceso y el período queda conservado (`REQ-PPL-008` AC 3) · la respuesta de disponibilidad exige evento `SCHEDULED` (`REQ-PRT-004`) · un evento que no alcanza al menor ⇒ la operación se rechaza (`REQ-PRT-002` AC 3) · `Account` `DISABLED` bloquea la entrada (`REQ-IAM-001` AC 3) |
| **Field-authority notes** | El filtrado es **de campo en la respuesta**, no `display:none` (`REQ-PPL-011` AC 4). `REQ-PPL-008` AC 1: con permiso de ver y sin el de responder, el guardián *ve el contexto y no puede responder, **con el motivo visible***. `REQ-PPL-012` AC 1: la relación por sí sola no otorga roles deportivos ni acceso de gestión |
| **RoleAssignment relation** | **NONE — por definición.** PT §5 `Guardian no es Role`; Freeze §7.2 `Guardián \| No es rol`; `REQ-PPL-012` |
| **Account relation** | **REQUIRED** — `Account ACTIVE`. PT §20: *"an Account without sports Membership is possible"* |
| **Membership relation** | **NOT REQUIRED** — PT §17 `Guardian puede existir sin Membership deportivo` |
| **Delegation relation** | **DELEGATED** — es el único actor del catálogo cuya autoridad es una delegación. La relación es **individual por menor**; puede haber varias con distintos flags |
| **Requirements covered** | `REQ-PPL-008` (gestión por `ACT-ADMIN`, uso por `ACT-GUARDIAN`), `REQ-PPL-009`, `REQ-PPL-012`, `REQ-PRT-002`, `REQ-PRT-004`, `REQ-COM-012` (exclusión explícita), `REQ-COM-015`, `REQ-COM-016`, `REQ-IAM-012` (vía delegación con permiso), `REQ-PPL-016` (selector de menor) |
| **Explicitly does NOT imply** | `RoleAssignment` · rol deportivo · `Membership` · `TeamAssignment` · accesorio comunicacional automático (`REQ-COM-012`, `REQ-PPL-012` AC 2) · autoridad de gestión · PII completa del menor · `DNI` ni fecha de nacimiento del menor · `ELIGIBILITY REASON` ni `ORIGIN` · conversaciones privadas · auditoría · acceso a **otros** menores · un módulo propio · un destino `/guardian` (PT §20) · exclusividad respecto de los roles deportivos |
| **Notes** | `ACT-GUARDIAN` es una capacidad **sobre `SELF` con scope `CHILD`**, no una proyección sobre el menor. Lo que cambia al cambiar de menor es la proyección, no el actor. Un mismo adulto puede tener dos `GuardianRelationship` con permisos distintos: la unidad de scope y de permiso es la relación, no la persona. |

---

# 10. MATRIZ DE RELACIÓN CON `ROLEASSIGNMENT`

| Actor | `RoleAssignment` requerido | Authority source | Clasificación | Evidencia |
|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | — | Ninguna | **NONE** | Sin rol; credencial o código propio |
| `ACT-AUTHENTICATED` | — (abstracto) | `Account` + sesión | **ABSTRACT** | Padre de los 6 concretos; `REQ-IAM-012` |
| `ACT-PLAYER` | `PLAYER` (scope `TEAM`) | `RoleAssignment PLAYER` | **DIRECT** | `REQ-PPL-006`, `REQ-PPL-007`, `REQ-PRT-001` |
| `ACT-CAPTAIN` | `CAPTAIN` (scope `TEAM`) | `RoleAssignment CAPTAIN` | **DIRECT** | PT §5 `Logistics: Team scope`; `REQ-EVT-019` |
| `ACT-COACH` | `COACH` (scope `TEAM` o `EVENT`) | `RoleAssignment COACH` | **DIRECT** | PT §5; PT §17 `Coach usa RoleAssignment` |
| `ACT-SUBCOMMITTEE` | `SUBCOMMITTEE` (scope `CLUB`) | `RoleAssignment SUBCOMMITTEE` | **DIRECT** | PT §5 |
| `ACT-ADMIN` | `ADMIN` (scope `CLUB`) | `RoleAssignment ADMIN` | **DIRECT** | PT §5; `REQ-IAM-013` |
| `ACT-GUARDIAN` | **ninguno** | **`GuardianRelationship`** | **DELEGATED** | PT §5 `Guardian no es Role`; `REQ-PPL-012` |

## 10.1 Matriz de relación con las demás entidades

| Actor | ¿Requiere `Person`? | ¿Requiere `Account`? | ¿Requiere `Membership`? | ¿Requiere `TeamAssignment`? |
|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | Sí (destinataria del código) | Sí (`PENDING` o `ACTIVE`) | No | No |
| `ACT-AUTHENTICATED` | Sí | **Sí** (`ACTIVE`) | No para lo propio | No |
| `ACT-PLAYER` | Sí | Sí | **Sí** | **Sí** |
| `ACT-CAPTAIN` | Sí | Sí | **Sí** | En la práctica sí (invariante §8.4 del audit) |
| `ACT-COACH` | Sí | Sí | **Sí** | **No** — se asigna por `RoleAssignment` |
| `ACT-SUBCOMMITTEE` | Sí | Sí | **Sí** | No |
| `ACT-ADMIN` | Sí | Sí | **Sí** | No |
| `ACT-GUARDIAN` | Sí | Sí | **No** | No |

---

# 11. RESUMEN DE CONCESIONES Y DENEGACIONES

## 11.1 Por actor

| Actor | Concede | Niega explícitamente |
|---|---|---|
| `ACT-UNAUTHENTICATED` | Autenticarse; consumir un código | Todo lo demás |
| `ACT-AUTHENTICATED` | Contacto, contraseña, sesiones, perfil propios | Acceso a la aplicación; toda capacidad de rol |
| `ACT-PLAYER` | Disponibilidad propia; informes propios; conversaciones; proyecciones en su scope | Convocatoria; asistencia; resultado; logística; comunicados; estructura; cuentas; auditoría; `ELIGIBILITY REASON` |
| `ACT-CAPTAIN` | **Logística de `TEAM`**; informes de equipo; contacto de equipo; conversaciones | Convocatoria; asistencia; resultado; estadísticas; `DNI`; eventos fuera de su equipo; autoridad de `COACH` |
| `ACT-COACH` | Eventos de `TEAM`/`EVENT`; convocatoria; asistencia; resultado; estadísticas; informes de equipo; logística; estado de habilitación | Administración; comunicados oficiales; `DNI`; `DOB`; `ELIGIBILITY REASON`; otros equipos; propia disponibilidad sin `PLAYER` |
| `ACT-SUBCOMMITTEE` | Comunicados oficiales; eventos de club; habilitación; competencias; referencias externas; informes de club | **Estructura**; cuentas; convocatoria; asistencia; resultado; estadísticas; auditoría; `DNI`; `DOB`; `CONTACT` de terceros |
| `ACT-ADMIN` | Cuentas; personas; roles; membresía; estructura; competencias; habilitación; auditoría; `DNI`; `DOB` | **Toda autoridad deportiva**; comunicados; informes de asistencia y rendimiento; conversaciones privadas |
| `ACT-GUARDIAN` | Contexto del menor; disponibilidad del menor; lo propio | Rol deportivo; `Membership`; comunicación; PII sensible del menor; otros menores; auditoría |

## 11.2 Matriz de denegaciones explícitas de PT §5

| Acción | `PLAYER` | `CAPTAIN` | `COACH` | `SUBCOMM` | `ADMIN` |
|---|---|---|---|---|---|
| editar propio contacto/password | ✓ | ✓ | ✓ | ✓ | ✓ |
| responder propia disponibilidad | ✓ | ✓ | sólo si además `PLAYER` | sólo si además `PLAYER` | sólo si además `PLAYER` |
| responder por menor | delegación | delegación | delegación | delegación | delegación |
| crear/editar entrenamiento | — | — | `TEAM`/`EVENT` | oficial autorizado | — |
| crear partido | — | — | `TEAM` | `CLUB` | — |
| posponer/reprogramar/cancelar partido | — | — | `TEAM` | `CLUB` | — |
| **Logistics** | — | **`TEAM`** | `TEAM`/`EVENT` | `CLUB` | — |
| Selection | — | — | `TEAM`/`EVENT` | — | — |
| Attendance | — | — | `TEAM`/`EVENT` | — | — |
| MatchRecord/stats | — | — | `TEAM`/`EVENT` | — | — |
| Comunicado oficial | — | — | — | `CLUB` | — |
| Mensajes directos/grupo | ✓ | ✓ | ✓ | sólo con entitlement | sólo con entitlement |
| Informe de asistencia | propio/autorizado | `TEAM` si corresponde | `TEAM` | `CLUB` | **—** |
| Informe de rendimiento | propio/autorizado | `TEAM` si corresponde | `TEAM` | `CLUB` | **—** |
| Personas/cuentas/accesos | — | — | — | — | ✓ |
| Estructura del club | — | — | — | — | ✓ |
| Competencias/inscripciones | — | — | lectura | ✓ | ✓ |
| Mutación de habilitación | — | — | lectura de estado | ✓ | ✓ |
| Referencias externas | — | — | lectura | ✓ | ✓ |
| Auditoría | — | — | — | — | ✓ |

**Cinco reglas de PT §5, incorporadas al catálogo:**
1. `ADMIN` no es superusuario deportivo.
2. `SUBCOMMITTEE` no equivale a `Coach`.
3. `CAPTAIN` no hereda poder de `Coach`.
4. Multi-rol = unión de assignments vigentes.
5. `ADMIN` no obtiene acceso automático a conversaciones privadas.

---

# 12. ÍNDICE DE ACTORES

| # | ID | Nombre | Tipo | Abstract | Authority source | Scope principal | Nº REQ |
|---:|---|---|---|---|---|---|---:|
| 1 | `ACT-UNAUTHENTICATED` | Persona no autenticada | `HUMAN_ROLE` | NO | Ninguna | `SELF` | 2 |
| 2 | `ACT-AUTHENTICATED` | Persona autenticada | `ABSTRACT_ACTOR` | **YES** | `Account` + sesión | `SELF` | 6 |
| 3 | `ACT-PLAYER` | Jugadora | `HUMAN_ROLE` | NO | `RoleAssignment PLAYER` | `TEAM` | 33 |
| 4 | `ACT-CAPTAIN` | Capitana | `HUMAN_ROLE` | NO | `RoleAssignment CAPTAIN` | `TEAM` | 7 |
| 5 | `ACT-COACH` | Entrenador/a | `HUMAN_ROLE` | NO | `RoleAssignment COACH` | `TEAM` / `EVENT` | 36 |
| 6 | `ACT-SUBCOMMITTEE` | Subcomisión de hockey | `HUMAN_ROLE` | NO | `RoleAssignment SUBCOMMITTEE` | `CLUB` | 32 |
| 7 | `ACT-ADMIN` | Administración del club | `HUMAN_ROLE` | NO | `RoleAssignment ADMIN` | `CLUB` | 38 |
| 8 | `ACT-GUARDIAN` | Responsable / guardian | `DELEGATED_HUMAN` | NO | `GuardianRelationship` | `CHILD` | 9 |

---

**Fin del Actor Catalog V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/actors/`.
