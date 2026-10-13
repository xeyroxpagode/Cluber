# GEI HOCKEY MANAGEMENT SYSTEM
## REQ ↔ ACTOR ↔ USE CASE MATRIX V1

**Etapa:** 3 — Uso de casos
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e3-use-case-inventory-freeze-v1`
**Baseline:** `730bf8ffee428666d24a588e23f23b457dc35123`

| Autoridad | Archivo · Versión |
|---|---|
| Requerimientos | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — **V1** + errata de `GEI_PRE_E3_INPUT_CLOSURE_V1.md` §3 |
| Actores | `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` — **V1** + `GEI_ACTOR_REQUIREMENT_MATRIX_V1.md` |
| Casos de uso | `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` — **V1** |

Esta matriz cubre **los 157 REQ IN**, no sólo los funcionales: los 122 funcionales son el objeto
del gate §27 del brief, y los 35 no funcionales se incluyen para que no quede ningún REQ sin
destino explícito.

---

# 1. CONVENCIONES

| Columna | Valores |
|---|---|
| **Tipo** | `F` = `FUNCTIONAL` (122) · `NF` = no funcional (35) |
| **Coverage Type** | `PRIMARY` · `SUPPORTING` · `BUSINESS_RULE` · `SYSTEM_INTERNAL` · `CROSS_CUTTING` · `EXTERNAL` |
| **Actor primario** | Actor de E2 que **inicia**. `SYSTEM_INTERNAL` cuando la regla no tiene initiator humano. |
| **Actor secundario** | Actores que participan con otra autoridad. `—` cuando no hay. |
| **UC ID(s)** | `UC-*-NN` canónicos. `P` = el REQ es primario del CU; `S` = supporting. `—` cuando el REQ no produce CU. |
| **Authority source** | `RoleAssignment X` · `GuardianRelationship[.flag]` · `Account` + sesión · `SYSTEM_INTERNAL` |
| **Scope** | `SELF` · `CHILD` · `TEAM` · `TEAM_SET` · `CLUB` · `EVENT` · `N/A` |

`SYSTEM_INTERNAL` en la columna **Actor primario** es el `Actor Status` heredado de E2 §2–§10. El
`Coverage Type` de E3 refina **cómo** el REQ participa en un CU; no reemplaza ni contradice el
actor de E2.

---

# 2. IAM — IDENTITY & ACCESS (20 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-IAM-001` | F | Iniciar sesión | IAM | `ACT-UNAUTHENTICATED` | `ACT-AUTHENTICATED` | `UC-IAM-01` (P) | `PRIMARY` | credencial establecida | `SELF` | Sin sesión si la credencial falla; no revela si la cuenta existe |
| `REQ-IAM-002` | F | Ciclo de vida de la cuenta | IAM | `ACT-ADMIN` | — | `UC-IAM-02` (P), `UC-IAM-03` (S), `UC-IAM-04` (S) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | `PENDING → ACTIVE ↔ DISABLED`; desactivar revoca sesiones; reactivar exige código nuevo |
| `REQ-IAM-003` | F | Activación con código de un solo uso | IAM | `ACT-UNAUTHENTICATED` (consume) | `ACT-ADMIN` (emite) | `UC-IAM-04` (P), `UC-IAM-03` (P) | `PRIMARY` | código de un solo uso / `RoleAssignment ADMIN` | `SELF` / `CLUB` | **Un REQ → 2 CU**: emitir y consumir son dos actores y dos resultados. `ACTOR-FEEDBACK-05` resuelto |
| `REQ-IAM-004` | F | Restablecimiento administrativo | IAM | `ACT-ADMIN` | — | `UC-IAM-05` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | No puede dejar 0 admins; `OUT-IAM-003` no es de V1 |
| `REQ-IAM-005` | F | Cambio de contraseña | IAM | `ACT-AUTHENTICATED` | los 6 concretos | `UC-IAM-06` (P) | `PRIMARY` | `Account` + sesión | `SELF` | Rechaza **sin mutar** si la nueva no es válida; nunca éxito falso |
| `REQ-IAM-006` | NF | Sesión opaca y cookie segura | IAM | `SYSTEM_INTERNAL` | todos los autenticados | `UC-IAM-01` (S) | `CROSS_CUTTING` | — | `N/A` | Sin portador de permisos en el navegador |
| `REQ-IAM-007` | NF | Protección CSRF | IAM | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU de mutación (S) | `SYSTEM_INTERNAL` | — | `N/A` | `CSRF_FAILED` sin mutación |
| `REQ-IAM-008` | NF | Vigencia de sesión | IAM | `SYSTEM_INTERNAL` | `ACT-AUTHENTICATED` | `UC-IAM-01` (S), `UC-IAM-07` (S), `UC-IAM-08` (S) | `CROSS_CUTTING` | — | `N/A` | 12 h inactiva / 7 d absoluta |
| `REQ-IAM-009` | F | Reautenticación (step-up) | IAM | `ACT-ADMIN` | `ACT-SUBCOMMITTEE` | `UC-IAM-09` (P) | `PRIMARY` | `RoleAssignment ADMIN` / `SUBCOMMITTEE` | `CLUB` | `RWS-04`: sin superficie. Ventana 10 min |
| `REQ-IAM-010` | F | Visibilidad y cierre de sesiones | IAM | `ACT-AUTHENTICATED` | — | `UC-IAM-07` (P), `UC-IAM-08` (P) | `PRIMARY` | `Account` + sesión | `SELF` | Cierre **sólo** de sesión remota; `OUT-SYS-001` no es un timeline |
| `REQ-IAM-011` | NF | Propagación multi-pestaña | IAM | `SYSTEM_INTERNAL` | todos los autenticados | `UC-IAM-08` (S) | `CROSS_CUTTING` | — | `N/A` | La otra pestaña pierde acceso sin recarga |
| `REQ-IAM-012` | F | Control de acceso a la aplicación | IAM | `SYSTEM_INTERNAL` (los 8 actores) | todos los concretos | `UC-IAM-01` (S) | `CROSS_CUTTING` | `Account` + `RoleAssignment` vigente **o** `GuardianRelationship` con permiso | `N/A` | **NO es un CU** y **NO es `<<include>>`**. Sin rol ni delegación ⇒ `/no-access` sin datos ni destinos. `ACTOR-FEEDBACK-06` |
| `REQ-IAM-013` | F | Protección del último administrador | IAM | `ACT-ADMIN` | — | `UC-IAM-02` (S), `UC-IAM-05` (S), `UC-IAM-09` (S), `UC-PPL-10` (S) | `BUSINESS_RULE` | `RoleAssignment ADMIN` | `CLUB` | `LAST_ADMIN_REQUIRED`; nada cambia |
| `REQ-IAM-014` | F | Username inmutable y único | IAM | `ACT-ADMIN` | — | `UC-PPL-03` (S), `UC-IAM-03` (S) | `BUSINESS_RULE` | `RoleAssignment ADMIN` | `CLUB` | **No existe operación de modificar username**; independiente del equipo |
| `REQ-IAM-015` | NF | Política de contraseñas | IAM | `SYSTEM_INTERNAL` | todos los autenticados | `UC-IAM-05` (S), `UC-IAM-06` (S) | `SYSTEM_INTERNAL` | — | `N/A` | 12–128, Unicode, sin expiración forzada |
| `REQ-IAM-016` | F | Fórmula de autorización y default deny | IAM | `SYSTEM_INTERNAL` | los 8 actores | los 102 CU | `CROSS_CUTTING` | — | `N/A` | Los 6 conjunctos; **default: denegar** |
| `REQ-IAM-017` | F | Fuente única de navegación y de acciones | IAM | `SYSTEM_INTERNAL` | los 8 actores | los 102 CU | `CROSS_CUTTING` | — | `N/A` | Destinos no utilizables no aparecen; bloqueadas se ven con su razón |
| `REQ-IAM-018` | NF | La autoridad no se reimplementa en el cliente | IAM | `SYSTEM_INTERNAL` | todos | todos los CU | `CROSS_CUTTING` | — | `N/A` | `OUT-SYS-002` |
| `REQ-IAM-019` | NF | Limitación de intentos y frecuencia | IAM | `SYSTEM_INTERNAL` | `ACT-UNAUTHENTICATED` | `UC-IAM-01` (S) | `CROSS_CUTTING` | — | `N/A` | Contadores sobreviven a reinicios |
| `REQ-IAM-020` | F | Interrupción de sesión | IAM | `ACT-AUTHENTICATED` | — | `UC-IAM-10` (P) | `PRIMARY` | `Account` + sesión | `SELF` | `RWS-08`: sin superficie |

**Subtotal IAM:** 13 `F` · 7 `NF` = **20**. Funcionales: `PRIMARY` 8 · `BUSINESS_RULE` 2 ·
`CROSS_CUTTING` 3 = 13.

---

# 3. PPL — PEOPLE & RELATIONSHIPS (16 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-PPL-001` | F | Persona base | PPL | `ACT-ADMIN` | — | `UC-PPL-01` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | Nombre y apellido obligatorios; DNI único cuando existe |
| `REQ-PPL-002` | F | Completitud del perfil de jugadora | PPL | `ACT-ADMIN` | `ACT-PLAYER` (recibe el aviso) | `UC-PPL-02` (P), `UC-PPL-15` (S) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | `PLAYER_PROFILE_INCOMPLETE` indica qué falta |
| `REQ-PPL-003` | F | Vinculación persona–cuenta | PPL | `ACT-ADMIN` | — | `UC-PPL-03` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | Una persona, una cuenta, como máximo |
| `REQ-PPL-004` | F | Membresía al club | PPL | `ACT-ADMIN` | — | `UC-PPL-04` (P), `UC-PPL-05` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Dos CU**: alta y finalización. Finalizar con dependencia activa ⇒ rechazado; el período se conserva |
| `REQ-PPL-005` | F | Afiliación deportiva a equipo | PPL | `ACT-ADMIN` | — | `UC-PPL-06` (P), `UC-PPL-07` (S) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | Período propio, distinto de membresía y de roles |
| `REQ-PPL-006` | F | Asignación de roles y alcances | PPL | `ACT-ADMIN` | — | `UC-PPL-09` (P), `UC-PPL-10` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Dos CU**: asignar y finalizar. `INVALID_ROLE_SCOPE`; rol expirado no computa |
| `REQ-PPL-007` | F | Transiciones de afiliación y de rol | PPL | `ACT-ADMIN` | `ACT-CAPTAIN` (afectada) | `UC-PPL-06` (P), `UC-PPL-07` (P), `UC-PPL-08` (P), `UC-PPL-10` (S) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Un REQ → 3 CU**: incorporar, cambiar de equipo, retirar. Incorporar es atómica; cambiar no transfiere `CAPTAIN` y lo explica |
| `REQ-PPL-008` | F | Relación de representación con menores | PPL | `ACT-ADMIN` (gestiona) | `ACT-GUARDIAN` (usa) | `UC-PPL-11` (P), `UC-PPL-12` (P) | `PRIMARY` | `RoleAssignment ADMIN` / `GuardianRelationship` | `CLUB` / `CHILD` | **Dos CU**: registrar y finalizar. Dos flags independientes |
| `REQ-PPL-009` | F | PII mínima del guardián sobre el menor | PPL | `ACT-GUARDIAN` | — | `UC-PPL-13` (P) | `PRIMARY` | `GuardianRelationship.can_view_child_info` | `CHILD` | Dos listas cerradas: concede y **nunca** concede |
| `REQ-PPL-010` | F | Acceso de terceros sobre mi cuenta | PPL | `ACT-PLAYER` (menor) | `ACT-GUARDIAN` | `UC-PPL-14` (P) | `PRIMARY` | `Account` propia + relación activa | `SELF` | Sólo lectura; **sin operación de edición**. `ACTOR-FEEDBACK-08` resuelto |
| `REQ-PPL-011` | F | Autoridad por campo de datos personales | PPL | `SYSTEM_INTERNAL` | los 8 actores | los 102 CU | `CROSS_CUTTING` | — | `N/A` | El campo no autorizado **no existe en la respuesta**. Las tres reglas `Nunca` de PT §6 |
| `REQ-PPL-012` | F | Representación ≠ rol deportivo | PPL | `ACT-GUARDIAN` | — | `UC-PPL-11` (S), `UC-PPL-12` (S), `UC-PRT-01` (S), `UC-COM-06` (S) | `BUSINESS_RULE` | `GuardianRelationship` (y ausencia de `RoleAssignment`) | `CHILD` | No otorga rol, accesorio comunicacional ni autoridad de gestión |
| `REQ-PPL-013` | F | Aviso de perfil incompleto | PPL | `ACT-PLAYER` | `ACT-ADMIN` (corrige) | `UC-PPL-15` (P) | `PRIMARY` | `Account` + sesión / `RoleAssignment ADMIN` | `SELF` / `CLUB` | La jugadora ve qué falta y el siguiente paso; no edita lo que administra el club |
| `REQ-PPL-014` | F | Identidad estable del equipo | PPL | `ACT-ADMIN` | — | `UC-STR-04` (S), `UC-STR-07` (S), `UC-STR-09` (S), `UC-STR-10` (S) | `BUSINESS_RULE` | `RoleAssignment ADMIN` | `CLUB` | Renombrar división o línea con equipos activos ⇒ rechazado |
| `REQ-PPL-015` | F | Archivo sin destruir historia | PPL | `ACT-ADMIN` | — | `UC-PPL-05` (S), `UC-PPL-08` (S), `UC-PPL-10` (S), `UC-PPL-12` (S), `UC-STR-05` (S) | `BUSINESS_RULE` | `RoleAssignment ADMIN` | `CLUB` | `OUT-PPL-002`: no hay eliminación permanente |
| `REQ-PPL-016` | F | Perfil propio | PPL | `ACT-AUTHENTICATED` | `ACT-GUARDIAN` (selector) | `UC-PPL-16` (P), `UC-PPL-17` (P) | `PRIMARY` | `Account` + sesión | `SELF` | **Dos CU**: consultar y editar contacto. Con un menor, sin selector |

**Subtotal PPL:** 16 `F` = **16**. Funcionales: `PRIMARY` 12 · `BUSINESS_RULE` 3 ·
`CROSS_CUTTING` 1 = 16.

---

# 4. STR — CLUB STRUCTURE (13 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-STR-001` | F | Temporada | STR | `ACT-ADMIN` | — | `UC-STR-01` (P), `UC-STR-02` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Dos CU**: registrar y actualizar. Histórica, **sin ciclo de estado**, sin eliminación. `RWS-01` |
| `REQ-STR-002` | F | División | STR | `ACT-ADMIN` | — | `UC-STR-03` (P), `UC-STR-04` (P), `UC-STR-05` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Tres CU**: crear, actualizar, archivar. `DEF-STR-001` (restore) fuera de V1 |
| `REQ-STR-003` | F | Línea | STR | `ACT-ADMIN` | — | `UC-STR-06` (P), `UC-STR-07` (P), `UC-STR-08` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Tres CU**, igual que división. `DEF-STR-002` fuera de V1 |
| `REQ-STR-004` | F | Equipo | STR | `ACT-ADMIN` | — | `UC-STR-09` (P), `UC-STR-10` (S), `UC-STR-11` (P), `UC-STR-12` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Cuatro CU**: crear, activar, archivar (+ actualizar por `REQ-STR-008`). Combinación única. `RWS-02`: sin create/edit |
| `REQ-STR-005` | F | Sede | STR | `ACT-ADMIN` | — | `UC-STR-13` (P), `UC-STR-14` (P), `UC-STR-15` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | **Tres CU**. Identidad estable por identificador |
| `REQ-STR-006` | F | Valla de dependencias al archivar | STR | `ACT-ADMIN` | — | `UC-STR-05` (S), `UC-STR-08` (S), `UC-STR-12` (S), `UC-STR-15` (S) | `BUSINESS_RULE` | `RoleAssignment ADMIN` | `CLUB` | Con dependencia activa ⇒ rechazado **nombrando la dependencia** |
| `REQ-STR-007` | F | Zona horaria | STR | `SYSTEM_INTERNAL` | `ACT-AUTHENTICATED` (afectado) | `UC-EVT-19` (S), `UC-EVT-17` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Horario en la zona del evento. `UC-FEEDBACK-03`: el `STATEMENT` es el texto autoritativo |
| `REQ-STR-008` | F | Operaciones de estructura desde el producto | STR | `ACT-ADMIN` | — | `UC-STR-01` … `UC-STR-15` (S) | `SUPPORTING` | `RoleAssignment ADMIN` | `CLUB` | Exige que alta, edición y archivo existan **desde el producto** para cada tipo. No crea CU: crea los que ya expression los REQ anteriores |
| `REQ-STR-009` | F | Estructura no disponible para Subcomisión | STR | `ACT-SUBCOMMITTEE` (recibe la denegación) | `ACT-ADMIN` (contrastado) | los 15 CU de `STR` (S) | `BUSINESS_RULE` | `RoleAssignment SUBCOMMITTEE` | `CLUB` | Acceso denegado con explicación del motivo. **No es un CU**: nadie busca "recibir una denegación" |
| `REQ-STR-010` | F | Etiqueta completa de línea y equipo | STR | `ACT-AUTHENTICATED` | todos los concretos | `UC-INS-01` (S), `UC-EVT-19` (S), `UC-PPL-16` (S) | `CROSS_CUTTING` | `Account` + sesión | `N/A` (lectura) | La línea se identifica con división y temporada; el equipo con temporada, división y línea |
| `REQ-STR-011` | F | Referencias por identidad, no por nombre | STR | `SYSTEM_INTERNAL` | — | los 102 CU | `SYSTEM_INTERNAL` | — | `N/A` | Renombrar no reatribuye historia |
| `REQ-STR-012` | F | Identidad de sede y cambios de sede | STR | `ACT-ADMIN` (regla A) | `ACT-COACH`, `ACT-SUBCOMMITTEE` (regla B) | `UC-STR-14` (P), `UC-EVT-04` (S), `UC-EVT-16` (S) | `BUSINESS_RULE` | `RoleAssignment ADMIN` / `COACH` / `SUBCOMMITTEE` | `CLUB` / `TEAM` / `EVENT` | **Regla A/B**: (A) corregir identidad de sede no reprograma ni notifica; (B) cambiar la sede **de un evento** es cambio material completo |
| `REQ-STR-013` | F | Estructura como referencia seleccionable | STR | `ACT-ADMIN` | — | `UC-COM-01` (S), `UC-EVT-01` (S), `UC-EVT-02` (S) | `CROSS_CUTTING` | `RoleAssignment ADMIN` | `CLUB` | Las divisiones, líneas y sedes se eligen de una lista. Regla de entrada, no objetivo |

**Subtotal STR:** 13 `F` = **13**. Funcionales: `PRIMARY` 5 · `SUPPORTING` 1 · `BUSINESS_RULE` 3 ·
`CROSS_CUTTING` 2 · `SYSTEM_INTERNAL` 2 = 13.

---

# 5. EVT — EVENTS & CALENDAR (24 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-EVT-001` | F | Invariantes de evento | EVT | `SYSTEM_INTERNAL` | `ACT-COACH`, `ACT-SUBCOMMITTEE` (condición) | `UC-EVT-01` (S), `UC-EVT-02` (S), `UC-EVT-03` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Fin posterior al inicio; `POSTPONED` puede no tenerlo. Invariante |
| `REQ-EVT-002` | F | Crear un entrenamiento | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-01` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | Sin destino ⇒ `EVENT_TARGET_INVALID`. `ACT-ADMIN` sin autoridad ⇒ denegado |
| `REQ-EVT-003` | F | Crear un partido | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-02` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `CLUB` | Exactamente 1 equipo; más ⇒ `EVENT_TARGET_INVALID` |
| `REQ-EVT-004` | F | Crear un evento del club | EVT | `ACT-SUBCOMMITTEE` | `ACT-COACH` (alcance `EVENT`) | `UC-EVT-03` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` / `COACH` | `CLUB` / `EVENT` | `club_wide` ⇒ 0 destinos; dirigido ⇒ ≥ 1 |
| `REQ-EVT-005` | F | Destinatarios plurales | EVT | `SYSTEM_INTERNAL` | `ACT-COACH`, `ACT-SUBCOMMITTEE` (condición) | `UC-EVT-01` (S), `UC-EVT-02` (S), `UC-EVT-03` (S), `UC-EVT-13` (S) | `BUSINESS_RULE` | — | `N/A` | Lista de equipos y lista de personas, ambas plurales e independientes |
| `REQ-EVT-006` | F | Equipo concreto e inmutable del partido | EVT | `SYSTEM_INTERNAL` | `ACT-COACH`, `ACT-SUBCOMMITTEE` (condición) | `UC-EVT-02` (S), `UC-EVT-04` (S) | `BUSINESS_RULE` | — | `N/A` | Cambiarlo con el partido programado ⇒ rechazado |
| `REQ-EVT-007` | F | Ciclo de vida del evento | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-05` (P), `UC-EVT-06` (P), `UC-EVT-07` (P), `UC-EVT-08` (P), `UC-EVT-09` (P), `UC-EVT-10` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | **Un REQ → 6 CU**: posponer, reanudar, cancelar, restaurar, completar, abandonar. `SCHEDULED → IN_PROGRESS` **no** es CU: no aporta resultado propio |
| `REQ-EVT-008` | F | Estados terminales y su comunicación | EVT | `ACT-AUTHENTICATED` | todos los concretos | `UC-EVT-07` (S), `UC-EVT-09` (S), `UC-EVT-10` (S), `UC-EVT-19` (S) | `BUSINESS_RULE` | `Account` + sesión + alcance | `N/A` | Composición propia, consecuencia explicada, sin respuesta de disponibilidad como acción principal |
| `REQ-EVT-009` | F | Programar un evento | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-01` (S), `UC-EVT-02` (S), `UC-EVT-03` (S) | `BUSINESS_RULE` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | **No es un CU**: el estado final se persiste en la **misma** operación, sin borrador observable |
| `REQ-EVT-010` | F | Cambio no material | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-04` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | Sin impacto, sin revisión, sin reconfirmación, sin notificación; la corrección queda registrada |
| `REQ-EVT-011` | F | Cambio material | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-CAPTAIN` (logística) | `UC-EVT-04` (P), `UC-EVT-05` (S), `UC-EVT-07` (S), `UC-EVT-08` (S), `UC-EVT-16` (S) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` / `CAPTAIN` | `TEAM` / `EVENT` / `CLUB` | Lista cerrada. Sube la revisión de coordinación, **puede** derivar reconfirmación y notifica |
| `REQ-EVT-012` | F | Vista previa de impacto y reconfirmación | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-11` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `IMPACT_CHANGED`, `IMPACT_TOKEN_EXPIRED`. `IWR-09` (cifras fijas) es defecto del CURRENT |
| `REQ-EVT-013` | F | Reconciliación ante conflicto de concurrencia | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` (**valla técnica**) | `UC-EVT-12` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `CLUB` | `STALE_VERSION`; base + borrador + versión del servidor. `ACTOR-FEEDBACK-07`, `ACTOR-DECISION-02` |
| `REQ-EVT-014` | F | Serie: existencia y creación | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-13` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `DEF-EVT-001` / `OUT-EVT-003`: sin generación automática de fechas |
| `REQ-EVT-015` | F | Serie: alcances de cambio | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-04` (S) | `BUSINESS_RULE` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | Las **tres** opciones son alternativas de `UC-EVT-04`, no una operación aparte. Impacto sobre el conjunto real |
| `REQ-EVT-016` | F | Serie: fin y límites | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-14` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | `ACTIVE → ENDED` conservando ocurrencias; 366 máx. `RECURRENCE_TOO_LARGE` |
| `REQ-EVT-017` | F | Superficie de participación del evento | EVT | `ACT-PLAYER` | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-GUARDIAN` | `UC-PRT-01` (S), `UC-PRT-02` (S), `UC-PRT-05` (S), `UC-PRT-08` (S), `UC-EVT-19` (S) | `BUSINESS_RULE` | `Account` + sesión + tipo + autoridad | `TEAM` / `CHILD` | Matriz PT §12. Partido ⇒ 4 superficies; entrenamiento ⇒ disponibilidad y asistencia; evento de club ⇒ sin convocatoria ni resultado |
| `REQ-EVT-018` | F | Jornada: creación y agrupación | EVT | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-15` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `CLUB` | Bulk ≤ 100 **atómico**; un partido ≤ una jornada. **Mismatch documentado con el CURRENT** (Audit §14) |
| `REQ-EVT-019` | F | Logística del evento | EVT | `ACT-COACH` | **`ACT-CAPTAIN`** (autoridad propia), `ACT-SUBCOMMITTEE` | `UC-EVT-16` (P) | `PRIMARY` | `RoleAssignment COACH` / **`CAPTAIN`** / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | **Único CU donde `ACT-CAPTAIN` puede iniciar.** `ACTOR-FEEDBACK-01` resuelto |
| `REQ-EVT-020` | F | Calendario como proyección | EVT | `ACT-AUTHENTICATED` | todos los concretos | `UC-EVT-17` (P) | `PRIMARY` | `Account` + sesión + alcance derivado | `N/A` | Mes, filtros y vista en la dirección de navegación; vacío resuelto |
| `REQ-EVT-021` | F | Inicio como proyección de acción | EVT | `ACT-AUTHENTICATED` | todos los concretos | `UC-EVT-18` (P) | `PRIMARY` | `Account` + sesión + alcance derivado | `N/A` | Hasta 3 elementos con motivo, consecuencia y acción; los irresolubles no aparecen |
| `REQ-EVT-022` | F | Coherencia entre proyecciones | EVT | `ACT-AUTHENTICATED` | todos los concretos | `UC-EVT-17` (S), `UC-EVT-18` (S), `UC-EVT-19` (S) | `CROSS_CUTTING` | `Account` + sesión | `N/A` | Inicio, calendario, equipo y evento muestran el mismo valor vigente |
| `REQ-EVT-023` | F | Consulta del evento y su contexto | EVT | `ACT-AUTHENTICATED` | todos los concretos | `UC-EVT-19` (P) | `PRIMARY` | `Account` + sesión + alcance | `N/A` | Sin alcance por dirección directa ⇒ **sin contenido** |
| `REQ-EVT-024` | F | Valla de dependencias de jornada | EVT | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` (**valla técnica**) | `UC-EVT-15` (S), `UC-CMP-07` (S) | `BUSINESS_RULE` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | `ACTOR-DECISION-02` (a): `ACT-ADMIN` **no** inicia el cierre |

**Subtotal EVT:** 24 `F` = **24**. Funcionales: `PRIMARY` 15 · `BUSINESS_RULE` 7 ·
`SYSTEM_INTERNAL` 1 · `CROSS_CUTTING` 1 = 24.

---

# 6. PRT — PARTICIPATION (19 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-PRT-001` | F | Responder la propia disponibilidad | PRT | `ACT-PLAYER` | `ACT-CAPTAIN` (requiere `PLAYER` vigente) | `UC-PRT-01` (P) | `PRIMARY` | `RoleAssignment PLAYER` + `TeamAssignment` + `Membership` | `TEAM` | Rol sin `PLAYER` **no** responde por sí mismo. `ACTOR-FEEDBACK-02` resuelto |
| `REQ-PRT-002` | F | Disponibilidad por menor delegado | PRT | `ACT-GUARDIAN` | — | `UC-PRT-01` (P) | `PRIMARY` | `GuardianRelationship.can_respond_availability` | `CHILD` | **Mismo CU** que `REQ-PRT-001`: cambia el sujeto y la authority source, no el objetivo (§21) |
| `REQ-PRT-003` | F | Estados derivados de la disponibilidad | PRT | `SYSTEM_INTERNAL` | `ACT-PLAYER`, `ACT-GUARDIAN` (observan), `ACT-COACH` | `UC-PRT-01` (S), `UC-PRT-04` (S), `UC-EVT-18` (S) | `BUSINESS_RULE` | — | `N/A` | `NO_RESPONSE` ≠ "no voy"; `NEEDS_RECONFIRMATION` tras cambio de coordinación. Un cambio no coordinativo **no** deriva reconfirmación |
| `REQ-PRT-004` | F | Condiciones de la disponibilidad | PRT | `ACT-PLAYER` | `ACT-GUARDIAN` | `UC-PRT-01` (S), `UC-EVT-06` (S), `UC-EVT-08` (S) | `BUSINESS_RULE` | `RoleAssignment PLAYER` / `GuardianRelationship` | `TEAM` / `CHILD` | Sólo con `SCHEDULED`; `POSTPONED` conserva y no acepta |
| `REQ-PRT-005` | F | Convocatoria: borrador, publicación e historial | PRT | `ACT-COACH` | — | `UC-PRT-02` (P), `UC-PRT-03` (P), `UC-INS-04` (S) | `PRIMARY` | `RoleAssignment COACH` | `TEAM` / `EVENT` | **Dos CU**: preparar y publicar. Republicar crea revisión nueva. El historial vive en `UC-INS-04` |
| `REQ-PRT-006` | F | La publicación no se bloquea | PRT | `ACT-COACH` | — | `UC-PRT-03` (S), `UC-PRT-04` (S) | `BUSINESS_RULE` | `RoleAssignment COACH` | `TEAM` / `EVENT` | Con conflicto publica igual; el conflicto queda derivado, visible y con superficie de revisión. **Por eso "revisar conflictos" es `<<extend>>`, no `<<include>>`** |
| `REQ-PRT-007` | F | Conflictos actuales de una convocatoria | PRT | `ACT-COACH` | — | `UC-PRT-04` (P) | `PRIMARY` | `RoleAssignment COACH` | `TEAM` / `EVENT` | Los 4 tipos de PT §14; la publicación no se reescribe; puede alimentar Inicio |
| `REQ-PRT-008` | F | Guardado automático de la convocatoria | PRT | `ACT-COACH` | — | `UC-PRT-02` (S), `UC-PRT-03` (S) | `CROSS_CUTTING` | `RoleAssignment COACH` | `TEAM` / `EVENT` | 5 estados, 600 ms, una en vuelo; el refresco de fondo no pisa lo escrito; **nunca** éxito falso. `RWS-07`, `DEF-SYS-003` |
| `REQ-PRT-009` | F | Asistencia: apertura y registro | PRT | `ACT-COACH` | — | `UC-PRT-05` (P) | `PRIMARY` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `SCHEDULED` o `IN_PROGRESS`; tipo `TRAINING` o `MATCH`; valor persistido de inmediato |
| `REQ-PRT-010` | F | "Sin registrar" ≠ "ausente" | PRT | `SYSTEM_INTERNAL` | `ACT-COACH` (registra), `ACT-PLAYER` (informe) | `UC-PRT-05` (S), `UC-INS-02` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Estado propio y distinguible; el informe **no** cuenta lo no registrado como ausente |
| `REQ-PRT-011` | F | Cierre de la asistencia | PRT | `ACT-COACH` | — | `UC-PRT-06` (P) | `PRIMARY` | `RoleAssignment COACH` | `TEAM` / `EVENT` | **La reapertura NO es requisito** (`CON-13`): la corrección la cubre. Exclusión explícita |
| `REQ-PRT-012` | F | Corrección de asistencia auditada | PRT | `ACT-COACH` | — | `UC-PRT-07` (P) | `PRIMARY` | `RoleAssignment COACH` | `TEAM` / `EVENT` | Anterior, nuevo, motivo, autor y fecha; sin motivo no completa |
| `REQ-PRT-013` | F | Resultado: borrador y finalización | PRT | `ACT-COACH` | — | `UC-PRT-08` (P), `UC-PRT-09` (P) | `PRIMARY` | `RoleAssignment COACH` | `TEAM` / `EVENT` | **Dos CU**: registrar y finalizar. `FINAL` es terminal por la vía normal |
| `REQ-PRT-014` | F | Corrección de resultado | PRT | `ACT-COACH` | — | `UC-PRT-10` (P) | `PRIMARY` | `RoleAssignment COACH` | `TEAM` / `EVENT` | Marcador anterior, nuevo, motivo, autor y fecha; el final queda visible junto con la evidencia |
| `REQ-PRT-015` | F | Compatibilidad resultado–ciclo del evento | PRT | `SYSTEM_INTERNAL` | `ACT-COACH` (opera dentro) | `UC-PRT-08` (S), `UC-PRT-09` (S), `UC-EVT-09` (S), `UC-EVT-10` (S) | `BUSINESS_RULE` | — | `N/A` | `PLAYED`/`FORFEIT` ⇒ `COMPLETED`; `ABANDONED` ⇒ `ABANDONED` |
| `REQ-PRT-016` | F | Estadísticas de partido | PRT | `ACT-COACH` | `ACT-CAPTAIN` (`TEAM` si corresponde) | `UC-PRT-11` (P), `UC-INS-03` (S) | `PRIMARY` | `RoleAssignment COACH` / `CAPTAIN` | `TEAM` / `EVENT` | Sólo `PLAYED`; partidos jugados **derivados del resultado**, no de la asistencia |
| `REQ-PRT-017` | F | Habilitación como condición de participación | PRT | `ACT-SUBCOMMITTEE` | `ACT-ADMIN`, `ACT-COACH` (lee estado) | `UC-PRT-12` (P), `UC-PRT-13` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` / `COACH` | `CLUB` / `TEAM` / `EVENT` | **Dos CU**: registrar y consultar. Sin restricción activa ⇒ `ELIGIBLE` derivado; nunca inferida de disponibilidad |
| `REQ-PRT-018` | F | Conceptos de participación independientes | PRT | `SYSTEM_INTERNAL` | — | los 13 CU de `PRT` | `SYSTEM_INTERNAL` | — | `N/A` | Disponibilidad, convocatoria, asistencia y habilitación **no** se derivan entre sí |
| `REQ-PRT-019` | F | Aplicabilidad por tipo de evento | PRT | `SYSTEM_INTERNAL` | — | `UC-PRT-01` (S), `UC-PRT-05` (S), `UC-PRT-08` (S) | `BUSINESS_RULE` | — | `N/A` | Matriz PT §12 respetada por tipo |

**Subtotal PRT:** 19 `F` = **19**. Funcionales: `PRIMARY` 11 · `BUSINESS_RULE` 5 ·
`CROSS_CUTTING` 1 · `SYSTEM_INTERNAL` 2 = 19.

---

# 7. COM — COMMUNICATION (18 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-COM-001` | F | Ciclo de vida del comunicado | COM | `ACT-SUBCOMMITTEE` | — | `UC-COM-01` (P), `UC-COM-02` (P), `UC-COM-04` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` | `CLUB` | **Tres CU**: redactar, publicar, archivar. Otro rol ⇒ denegado |
| `REQ-COM-002` | F | Audiencia del comunicado | COM | `ACT-SUBCOMMITTEE` | — | `UC-COM-01` (S), `UC-COM-02` (S) | `SUPPORTING` | `RoleAssignment SUBCOMMITTEE` | `TEAM_SET` / `CLUB` | Conjunto **real** de equipos, no texto libre. No es un CU propio: elegir audiencia es parte de redactar |
| `REQ-COM-003` | F | Fijación de la audiencia al publicar | COM | `SYSTEM_INTERNAL` | `ACT-SUBCOMMITTEE` (publica) | `UC-COM-02` (S), `UC-COM-03` (S), `UC-COM-05` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Snapshot inmutable; cambiar afiliaciones no lo altera |
| `REQ-COM-004` | F | Corrección de comunicado | COM | `ACT-SUBCOMMITTEE` | — | `UC-COM-03` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` | `CLUB` | Corrige título o cuerpo, **no** la audiencia; audiencia incorrecta ⇒ comunicado nuevo |
| `REQ-COM-005` | F | Lectura restringida a la audiencia | COM | `ACT-AUTHENTICATED` | todos los concretos | `UC-COM-05` (P) | `PRIMARY` | snapshot de audiencia | `N/A` | No alcanzado por dirección directa ⇒ no obtiene contenido |
| `REQ-COM-006` | F | Conversación directa | COM | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | `UC-COM-06` (P) | `PRIMARY` | `Account` + `REQ-COM-012` | `SELF` | Máximo una por par canónico; el orden inverso encuentra la misma |
| `REQ-COM-007` | F | Conversación de grupo | COM | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | `UC-COM-07` (P), `UC-COM-12` (P) | `PRIMARY` | `Account` + `REQ-COM-012` | `SELF` | **Dos CU**: crear y archivar (AC 4). `OUT-COM-002` excluye gestionar participantes y salir |
| `REQ-COM-008` | F | Conversaciones canónicas de equipo y de evento | COM | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | `UC-COM-08` (P) | `PRIMARY` | `Account` + `REQ-COM-012` | `TEAM` / `EVENT` | `0..1` por equipo y por evento; título derivado del objeto real |
| `REQ-COM-009` | F | Mensajes | COM | `ACT-AUTHENTICATED` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` | `UC-COM-09` (P) | `PRIMARY` | participación + período autorizado | `SELF` | Sin estado de envío **no** se afirma éxito; fallo ⇒ reintento sin duplicar |
| `REQ-COM-010` | F | Edición y borrado de mensajes | COM | `ACT-AUTHENTICATED` | — | `UC-COM-10` (P), `UC-COM-11` (P) | `PRIMARY` | autoría propia | `SELF` | **Dos CU**: editar y eliminar. Borrado = tombstone, irreversible, con motivo. Mensaje ajeno ⇒ sin operación |
| `REQ-COM-011` | F | Participantes y acceso temporal | COM | `SYSTEM_INTERNAL` | los participantes (observan) | `UC-COM-09` (S), `UC-COM-12` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Sin acceso a la historia anterior a `joined_at`; el ex-participante conserva su período; `ACT-ADMIN` sin participación **no** lee |
| `REQ-COM-012` | F | Derecho comunicacional | COM | `SYSTEM_INTERNAL` | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` (con accesorio); `ACT-ADMIN`, `ACT-SUBCOMMITTEE`, `ACT-GUARDIAN` (sin accesorio) | `UC-COM-06` (S), `UC-COM-07` (S), `UC-COM-08` (S), `UC-COM-09` (S) | `CROSS_CUTTING` | — | `N/A` | `ACTOR-FEEDBACK-04` resuelto: regla interna con actores afectados explícitos |
| `REQ-COM-013` | F | Alcance de los candidatos a participante | COM | `ACT-AUTHENTICATED` | — | `UC-COM-06` (S), `UC-COM-07` (S), `UC-COM-08` (S) | `SUPPORTING` | `Account` + `REQ-COM-012` + relación | `SELF` | Los candidatos son personas con las que puede hablar legítimamente. **No** es un CU propio |
| `REQ-COM-014` | F | Tipos de notificación | COM | `ACT-AUTHENTICATED` | todos los concretos | `UC-COM-13` (S) | `CROSS_CUTTING` | `Account` + sesión | `N/A` | **Sólo 7 tipos.** Posponer, reprogramar, cancelar y restaurar son distinguibles |
| `REQ-COM-015` | F | Notificación por alta y baja en convocatoria | COM | `ACT-PLAYER` | `ACT-GUARDIAN` | `UC-COM-13` (S), `UC-PRT-03` (S) | `SUPPORTING` | `RoleAssignment PLAYER` / `GuardianRelationship` | `TEAM` / `CHILD` | Agregados y quitados notificados; los que permanecen **no** |
| `REQ-COM-016` | F | Notificación por cambio de destinatarios | COM | `ACT-PLAYER` | `ACT-COACH`, `ACT-GUARDIAN` | `UC-COM-13` (S), `UC-EVT-04` (S) | `SUPPORTING` | `RoleAssignment PLAYER` / `COACH` / `GuardianRelationship` | `TEAM` / `CHILD` / `EVENT` | Notifica a la **unión** de audiencia anterior, nueva, disponibilidad, convocatoria y personal relacionado |
| `REQ-COM-017` | F | Hechos que no generan notificación | COM | `SYSTEM_INTERNAL` | — | `UC-COM-13` (S), `UC-PRT-01` (S), `UC-PRT-05` (S), `UC-PRT-07` (S), `UC-COM-09` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Lista negativa **cerrada**: disponibilidad, asistencia, mensaje y corrección menor |
| `REQ-COM-018` | F | Notificaciones: audiencia, deduplicación y lectura | COM | `ACT-AUTHENTICATED` | todos los concretos | `UC-COM-13` (P), `UC-COM-14` (P) | `PRIMARY` | `Account` + sesión | `N/A` | **Dos CU**: consultar y marcar leída. Clave lógica única. `IWR-07` / `IWR-08` son `ACCIDENTAL UI` |

**Subtotal COM:** 18 `F` = **18**. Funcionales: `PRIMARY` 9 · `SUPPORTING` 4 ·
`SYSTEM_INTERNAL` 3 · `CROSS_CUTTING` 2 = 18.

---

# 8. CMP — COMPETITION (8 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-CMP-001` | F | Competencia: ciclo de vida | CMP | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | `UC-CMP-01` (P), `UC-CMP-02` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | **Dos CU**: registrar y activar. `DRAFT → ACTIVE → CLOSED` |
| `REQ-CMP-002` | F | Cierre de competencia | CMP | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | `UC-CMP-03` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | 0 inscripciones activas; con inscripciones activas ⇒ rechazada **explicándolas** |
| `REQ-CMP-003` | F | Inscripción a competencia | CMP | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | `UC-CMP-04` (P), `UC-CMP-05` (P), `UC-CMP-06` (P), `UC-CMP-07` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | **Un REQ → 4 CU**: inscribir equipo, inscribir línea, activar inscripción, finalizar inscripción |
| `REQ-CMP-004` | F | Alcances `TEAM` y `LINE` | CMP | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | `UC-CMP-04` (S), `UC-CMP-05` (S), `UC-CMP-06` (S) | `BUSINESS_RULE` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | **Son distintos.** `COMPETITION_SCOPE_MISMATCH` con causa en lenguaje de usuario |
| `REQ-CMP-005` | F | Uso de la inscripción en un partido | CMP | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-EVT-02` (S), `UC-EVT-15` (S), `UC-CMP-04` (S), `UC-CMP-05` (S) | `BUSINESS_RULE` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `EVENT` / `CLUB` | Si la jornada tiene competencia, cada partido usa inscripción de esa competencia con alcance compatible |
| `REQ-CMP-006` | F | Referencia externa manual | CMP | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | `UC-CMP-08` (P), `UC-CMP-09` (P) | `PRIMARY` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` | `CLUB` | **Dos CU**: registrar y consultar. Lista blanca de 3 objetivos. `RWS-03` |
| `REQ-CMP-007` | F | Límite de responsabilidad federativa | CMP | `SYSTEM_INTERNAL` | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` (operan) | `UC-CMP-08` (S), `UC-CMP-09` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Referencia **es** referencia; sin historia clínica; el sistema no resuelve pases |
| `REQ-CMP-008` | F | Habilitación: alcance y visibilidad | CMP | `ACT-SUBCOMMITTEE` | `ACT-ADMIN` (muta), `ACT-COACH` (lee estado) | `UC-PRT-12` (S), `UC-PRT-13` (S) | `BUSINESS_RULE` | `RoleAssignment SUBCOMMITTEE` / `ADMIN` / `COACH` | `CLUB` / `TEAM` / `EVENT` | 4 alcances; el motivo y el origen **sólo** para Subcomisión y Admin; toda mutación auditada |

**Subtotal CMP:** 8 `F` = **8**. Funcionales: `PRIMARY` 4 · `BUSINESS_RULE` 3 ·
`SYSTEM_INTERNAL` 1 = 8.

---

# 9. INS — SEARCH / REPORTS / AUDIT (12 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-INS-001` | F | Búsqueda | INS | `ACT-AUTHENTICATED` | todos los concretos | `UC-INS-01` (P) | `PRIMARY` | `Account` + sesión + `REQ-PPL-011` | `N/A` | Cubre personas, equipos, eventos y divisiones o líneas |
| `REQ-INS-002` | F | Alcance y PII de la búsqueda | INS | `ACT-AUTHENTICATED` | todos los concretos | `UC-INS-01` (S) | `SUPPORTING` | `Account` + sesión + `REQ-PPL-011` | `N/A` | Los resultados respetan la autoridad por campo; la estructura se busca por división y línea |
| `REQ-INS-003` | F | Estado de la consulta en la navegación | INS | `ACT-AUTHENTICATED` | — | `UC-INS-01` (S) | `SUPPORTING` | `Account` + sesión | `N/A` | La consulta sobrevive al botón atrás y se reproduce por dirección directa |
| `REQ-INS-004` | F | Informe de asistencia | INS | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-PLAYER` (propio), **`ACT-CAPTAIN`** (`TEAM` si corresponde) · **`ACT-ADMIN` denegado** | `UC-INS-02` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` / `PLAYER` / `CAPTAIN` | `TEAM` / `CLUB` / `SELF` | Distingue presente, ausente, justificada y sin registrar. Cada fila enlaza al origen. `ACTOR-FEEDBACK-03` |
| `REQ-INS-005` | F | Informe de rendimiento | INS | `ACT-COACH` | `ACT-SUBCOMMITTEE`, `ACT-PLAYER` (propio), **`ACT-CAPTAIN`** · **`ACT-ADMIN` denegado** | `UC-INS-03` (P) | `PRIMARY` | `RoleAssignment COACH` / `SUBCOMMITTEE` / `PLAYER` / `CAPTAIN` | `TEAM` / `CLUB` / `SELF` | Partidos jugados derivados del **resultado**, no de la asistencia |
| `REQ-INS-006` | F | Alcance de los informes | INS | `ACT-AUTHENTICATED` | todos los concretos | `UC-INS-02` (S), `UC-INS-03` (S) | `SUPPORTING` | derivado de la autoridad del actor | `SELF` / `TEAM` / `CLUB` | Propio / equipo / club; el período aplicado es **visible y modificable** |
| `REQ-INS-007` | F | Enlace al origen desde los informes | INS | `ACT-COACH` | `ACT-SUBCOMMITTEE` | `UC-INS-02` (S), `UC-INS-03` (S) | `SUPPORTING` | `RoleAssignment COACH` / `SUBCOMMITTEE` | `TEAM` / `CLUB` | Cada dato enlaza al hecho que lo origina; el enlace respeta la autoridad |
| `REQ-INS-008` | F | Auditoría: consulta | INS | `ACT-ADMIN` | — | `UC-INS-05` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | Sólo lectura; filtros por rango de fechas y actor; **sin** edición ni borrado |
| `REQ-INS-009` | F | Auditoría: contenido mínimo | INS | `ACT-ADMIN` | — | `UC-INS-05` (P) | `PRIMARY` | `RoleAssignment ADMIN` | `CLUB` | Qué cambió, quién, cuándo, motivo cuando la acción lo exige, y enlace al objeto; datos sensibles redactados |
| `REQ-INS-010` | NF | Auditoría: integridad | INS | `SYSTEM_INTERNAL` | `ACT-ADMIN` (sólo lectura) | `UC-INS-05` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Sólo agregado; sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos |
| `REQ-INS-011` | F | Historia: fuentes visibles | INS | `ACT-AUTHENTICATED` | todos los concretos | `UC-INS-04` (P) | `PRIMARY` | `Account` + sesión + alcance | `N/A` | Un CU con 6 alternativas de superficie. **No** fusionado con la auditoría administrativa (§42) |
| `REQ-INS-012` | NF | Historia no genérica | INS | `SYSTEM_INTERNAL` | — | `UC-INS-04` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Se deriva de las entidades y de la auditoría; **no** hay tabla genérica ni línea de tiempo personal |

**Subtotal INS:** 10 `F` · 2 `NF` = **12**. Funcionales: `PRIMARY` 6 · `SUPPORTING` 4 = 10.

---

# 10. SYS — CROSS-CUTTING (27 REQ)

| REQ | Tipo | Resumen | Dom | Actor primario | Actor secundario | UC ID(s) | Coverage | Authority source | Scope | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `REQ-SYS-001` | NF | Responsive con significado preservado | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU de consulta (S) | `CROSS_CUTTING` | — | `N/A` | Mismos destinos; agenda antes que mes en móvil |
| `REQ-SYS-002` | NF | Objetivos táctiles 44 px | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU (S) | `CROSS_CUTTING` | — | `N/A` | `DEF-SYS-002` y `REQ-DECISION-NEEDED-02` abiertos |
| `REQ-SYS-003` | NF | Semántica de controles y foco | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU (S) | `CROSS_CUTTING` | — | `N/A` | `DEF-SYS-002`, `RWS-06` |
| `REQ-SYS-004` | NF | Movimiento causal y reducido | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU (S) | `CROSS_CUTTING` | — | `N/A` | — |
| `REQ-SYS-005` | NF | El estado se escribe, el color acompaña | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU (S) | `CROSS_CUTTING` | — | `N/A` | Estado desconocido **declarado** como estado a revisar |
| `REQ-SYS-006` | NF | Vocabulario de usuario | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU (S) | `CROSS_CUTTING` | — | `N/A` | Ninguna superficie expone nombres internos |
| `REQ-SYS-007` | NF | Una pregunta dominante y una acción primaria | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU (S) | `CROSS_CUTTING` | — | `N/A` | Lo peligroso separado y con confirmación |
| `REQ-SYS-008` | NF | Revelación progresiva | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU de consulta (S) | `CROSS_CUTTING` | — | `N/A` | Menos autoridad ⇒ menos niveles, **no** más restricciones |
| `REQ-SYS-009` | NF | Sin éxito falso | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU de mutación (S) | `CROSS_CUTTING` | — | `N/A` | Nunca afirmar completado antes de confirmar |
| `REQ-SYS-010` | NF | El error preserva lo ingressado | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU de mutación (S) | `CROSS_CUTTING` | — | `N/A` | El error va junto al campo; nada se vacía |
| `REQ-SYS-011` | NF | Vacío, cero y error son distintos | SYS | `SYSTEM_INTERNAL` | todos los autenticados | `UC-EVT-18` (S), `UC-INS-01` (S), `UC-INS-02` (S) | `CROSS_CUTTING` | — | `N/A` | Falta de dato **no** se muestra como 0 % |
| `REQ-SYS-012` | F | No autorizado se oculta; bloqueado se deshabilita con razón | SYS | `ACT-AUTHENTICATED` | todos los concretos | los 102 CU | `CROSS_CUTTING` | `Account` + sesión + autoridad del actor | `N/A` | **Único REQ funcional de `SYS` y no produce CU.** Tipado `FUNCTIONAL/AUTHORIZATION` pero describe comportamiento de presentación (`ACTOR-FEEDBACK` §17.2 de E2) |
| `REQ-SYS-013` | NF | Navegación del navegador y enlace directo | SYS | `SYSTEM_INTERNAL` | todos los autenticados | `UC-EVT-17` (S), `UC-INS-01` (S), `UC-COM-14` (S) | `CROSS_CUTTING` | — | `N/A` | Mes, filtro, pestaña y consulta conservados |
| `REQ-SYS-014` | NF | Coherencia entre superficies | SYS | `SYSTEM_INTERNAL` | todos los autenticados | `UC-EVT-17` (S), `UC-EVT-18` (S), `UC-EVT-19` (S) | `CROSS_CUTTING` | — | `N/A` | La pérdida de autoridad purga caché |
| `REQ-SYS-015` | NF | Verdad de la superficie | SYS | `SYSTEM_INTERNAL` | todos los autenticados | todos los CU de consulta (S) | `CROSS_CUTTING` | — | `N/A` | Conteos contados, fechas del reloj o del modelo; sin literales congelados. Contradice `IWR-09` |
| `REQ-SYS-016` | NF | Idempotencia de las órdenes | SYS | `SYSTEM_INTERNAL` | todos los concretos | todos los CU de mutación (S), `UC-IAM-10` (S) | `SYSTEM_INTERNAL` | — | `N/A` | `IDEMPOTENCY_KEY_REUSED`; sin reejecución ciega tras 24 h |
| `REQ-SYS-017` | NF | Concurrencia optimista con versión esperada | SYS | `SYSTEM_INTERNAL` | todos los concretos | `UC-EVT-12` (S) | `SYSTEM_INTERNAL` | — | `N/A` | `STALE_VERSION` |
| `REQ-SYS-018` | NF | Una orden, una transacción | SYS | `SYSTEM_INTERNAL` | todos los concretos | `UC-EVT-01` (S), `UC-EVT-02` (S), `UC-EVT-03` (S), `UC-EVT-15` (S), `UC-PPL-06` (S), `UC-CMP-07` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Sin coreografía de guardado y publicación |
| `REQ-SYS-019` | NF | Proyecciones con único dueño de escritura | SYS | `SYSTEM_INTERNAL` | todos los concretos | `UC-EVT-17` (S), `UC-EVT-18` (S), `UC-INS-01` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Inicio, calendario, equipos, búsqueda e informes no admiten escritura propia |
| `REQ-SYS-020` | NF | Protección de datos en registros | SYS | `SYSTEM_INTERNAL` | — | `UC-INS-05` (S) | `SYSTEM_INTERNAL` | — | `N/A` | Sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos |
| `REQ-SYS-021` | NF | Transporte cifrado y almacenamiento seguro | SYS | `SYSTEM_INTERNAL` | — | — | `SYSTEM_INTERNAL` | — | `N/A` | Verificado por inspección, no por objetivo de usuario |
| `REQ-SYS-022` | NF | Disponibilidad, respaldo y recuperación | SYS | `SYSTEM_INTERNAL` | todos los autenticados (afectados) | — | `CROSS_CUTTING` | — | `N/A` | `EVIDENCE_PENDING` |
| `REQ-SYS-023` | NF | Rendimiento de consultas comunes | SYS | `SYSTEM_INTERNAL` | todos los autenticados (afectados) | `UC-INS-01` (S), `UC-EVT-17` (S) | `CROSS_CUTTING` | — | `N/A` | `EVIDENCE_PENDING` |
| `REQ-SYS-024` | NF | Latencia de notificación | SYS | `SYSTEM_INTERNAL` | todos los notificados (afectados) | `UC-COM-13` (S) | `CROSS_CUTTING` | — | `N/A` | `EVIDENCE_PENDING` |
| `REQ-SYS-025` | NF | Efectos asíncronos durables | SYS | `SYSTEM_INTERNAL` | — | `UC-COM-13` (S) | `SYSTEM_INTERNAL` | — | `N/A` | El hecho permanece confirmado aunque el efecto falle |
| `REQ-SYS-026` | NF | Evolución compatible | SYS | `SYSTEM_INTERNAL` | — | — | `SYSTEM_INTERNAL` | — | `N/A` | Despliegues coexistentes |
| `REQ-SYS-027` | NF | Puerta externa de privacidad | SYS | `NOT_APPLICABLE` | — | — | `EXTERNAL` | responsable del tratamiento, **fuera de GEI** | `N/A` | **No es de V1 ni de GEI.** Procesos de organización |

**Subtotal SYS:** 1 `F` · 26 `NF` = **27**. Funcionales: `CROSS_CUTTING` 1 = 1.

---

# 11. MATRIZ DE COBERTURA

## 11.1 REQ funcionales por `Coverage Type` y dominio

| Dominio | `PRIMARY` | `SUPPORTING` | `BUSINESS_RULE` | `SYSTEM_INTERNAL` | `CROSS_CUTTING` | Total | `UNMAPPED` |
|---|---:|---:|---:|---:|---:|---:|---:|
| IAM | 8 | 0 | 2 | 0 | 3 | 13 | 0 |
| PPL | 12 | 0 | 3 | 0 | 1 | 16 | 0 |
| STR | 5 | 1 | 3 | 2 | 2 | 13 | 0 |
| EVT | 15 | 0 | 7 | 1 | 1 | 24 | 0 |
| PRT | 11 | 0 | 5 | 2 | 1 | 19 | 0 |
| COM | 9 | 4 | 0 | 3 | 2 | 18 | 0 |
| CMP | 4 | 0 | 3 | 1 | 0 | 8 | 0 |
| INS | 6 | 4 | 0 | 0 | 0 | 10 | 0 |
| SYS | 0 | 0 | 0 | 0 | 1 | 1 | 0 |
| **TOTAL** | **70** | **9** | **23** | **9** | **11** | **122** | **0** |

**Verificación de la suma por filas:** `13+16+13+24+19+18+8+10+1 = 122`.
**Verificación de la suma por columnas:** `70+9+23+9+11 = 122`. **Coinciden.**

## 11.2 REQ no funcionales

| Dominio | `CROSS_CUTTING` | `SYSTEM_INTERNAL` | `EXTERNAL` | Total |
|---|---:|---:|---:|---:|
| IAM | 5 | 2 | 0 | 7 |
| INS | 0 | 2 | 0 | 2 |
| SYS | 17 | 8 | 1 | 26 |
| **TOTAL** | **22** | **12** | **1** | **35** |

**Verificación:** `22+12+1 = 35`. **Ningún no funcional produce CU.**

## 11.3 Gate §27

| Criterio | Resultado |
|---|---|
| 100 % de REQ funcionales IN con destino explícito | **PASS** — 122/122 |
| `UNMAPPED = 0` | **PASS** — 0 |
| 100 % de REQ no funcionales IN con destino explícito | **PASS** — 35/35 |
| 100 % de REQ IN (157) con destino explícito | **PASS** — 157/157 |
| 0 REQ con actor desconocido | **PASS** — todos los actores provienen de E2 |

## 11.4 Correspondencia con el `Actor Status` de E2

| `Actor Status` de E2 | REQ | `Coverage Type` de E3 | Cambio |
|---|---:|---|---|
| `MAPPED` | 104 | `PRIMARY` 70 · `SUPPORTING` 9 · `BUSINESS_RULE` 12 · `CROSS_CUTTING` 13 | Refinamiento, **sin cambio de actor** |
| `SYSTEM_INTERNAL` (funcionales) | 18 | `SYSTEM_INTERNAL` 9 · `BUSINESS_RULE` 5 · `CROSS_CUTTING` 4 | Refinamiento, **sin cambio de actor** |
| `NOT_APPLICABLE` (no funcional) | 1 | `EXTERNAL` 1 | Sin cambio |

**Verificación:** `70+9+12+13 = 104`. `9+5+4 = 18`. `104+18 = 122`. **0 actores modificados.**

**Los 6 REQ funcionales que E2 marcó `SYSTEM_INTERNAL` y E3 reclasifica como `BUSINESS_RULE` o
`CROSS_CUTTING`** — `REQ-EVT-005`, `REQ-EVT-006`, `REQ-PRT-003`, `REQ-PRT-015`, `REQ-PRT-019`
(→ `BUSINESS_RULE`) y `REQ-COM-012` (→ `CROSS_CUTTING`) — siguen **sin actor ficticio**. Cambia
**cómo** participan en los CU, no **quién** los aplica.

---

# 12. TRAZABILIDAD INVERSA — UC → REQ

> **Nota (Errata E9.5 / F-08):** La dirección **forward (§2–10) es la autoridad** (completa y consistente con los gates E3). Esta inversa (§12) se regenera desde el ledger E9 para consistencia. La inversa original consolidada por separado en E3 omitía 8 pares forward y tenía presencia parcial/nula en referencias colectivas.

Cada CU con su lista completa de REQ. **Gate §28: 0 CU sin REQ.**

| UC | REQ que lo sustentan |
|---|---|
| `UC-IAM-01` | `REQ-IAM-001`, `REQ-IAM-006`, `REQ-IAM-008`, `REQ-IAM-012`, `REQ-IAM-019` |
| `UC-IAM-02` | `REQ-IAM-002`, `REQ-IAM-013` |
| `UC-IAM-03` | `REQ-IAM-003`, `REQ-IAM-002`, `REQ-IAM-014` |
| `UC-IAM-04` | `REQ-IAM-003`, `REQ-PPL-003`, `REQ-IAM-002` |
| `UC-IAM-05` | `REQ-IAM-004`, `REQ-IAM-013`, `REQ-IAM-003`, `REQ-IAM-015` |
| `UC-IAM-06` | `REQ-IAM-005`, `REQ-IAM-015`, `REQ-IAM-019`, `REQ-SYS-009` |
| `UC-IAM-07` | `REQ-IAM-010`, `REQ-IAM-008` |
| `UC-IAM-08` | `REQ-IAM-010`, `REQ-IAM-011`, `REQ-IAM-008`, `REQ-INS-009` |
| `UC-IAM-09` | `REQ-IAM-009`, `REQ-IAM-001`, `REQ-IAM-015` |
| `UC-IAM-10` | `REQ-IAM-020`, `REQ-SYS-016`, `REQ-SYS-010` |
| `UC-PPL-01` | `REQ-PPL-001`, `REQ-PPL-011`, `REQ-PPL-015`, `REQ-IAM-014` |
| `UC-PPL-02` | `REQ-PPL-002`, `REQ-PPL-013`, `REQ-PPL-011` |
| `UC-PPL-03` | `REQ-PPL-003`, `REQ-IAM-014`, `REQ-IAM-003` |
| `UC-PPL-04` | `REQ-PPL-004`, `REQ-PPL-016` |
| `UC-PPL-05` | `REQ-PPL-004`, `REQ-PPL-015`, `REQ-PPL-006` |
| `UC-PPL-06` | `REQ-PPL-005`, `REQ-PPL-007`, `REQ-PPL-004`, `REQ-PPL-006`, `REQ-PPL-002`, `REQ-STR-004` |
| `UC-PPL-07` | `REQ-PPL-007`, `REQ-PPL-005`, `REQ-PPL-015`, `REQ-INS-009` |
| `UC-PPL-08` | `REQ-PPL-007`, `REQ-PPL-015` |
| `UC-PPL-09` | `REQ-PPL-006`, `REQ-IAM-016`, `REQ-PPL-012`, `REQ-IAM-013` |
| `UC-PPL-10` | `REQ-PPL-006`, `REQ-PPL-007`, `REQ-PPL-015`, `REQ-IAM-013` |
| `UC-PPL-11` | `REQ-PPL-008`, `REQ-PPL-012`, `REQ-PPL-009`, `REQ-IAM-012`, `REQ-COM-012` |
| `UC-PPL-12` | `REQ-PPL-008`, `REQ-PPL-015`, `REQ-PPL-012` |
| `UC-PPL-13` | `REQ-PPL-009`, `REQ-PPL-008`, `REQ-PPL-011`, `REQ-COM-012` |
| `UC-PPL-14` | `REQ-PPL-010`, `REQ-PPL-008` |
| `UC-PPL-15` | `REQ-PPL-013`, `REQ-PPL-002`, `REQ-PPL-011`, `REQ-SYS-010` |
| `UC-PPL-16` | `REQ-PPL-016`, `REQ-IAM-012`, `REQ-PPL-006` |
| `UC-PPL-17` | `REQ-PPL-016`, `REQ-PPL-009`, `REQ-PPL-011`, `REQ-SYS-010` |
| `UC-STR-01` | `REQ-STR-001`, `REQ-STR-008`, `REQ-STR-011` |
| `UC-STR-02` | `REQ-STR-001`, `REQ-STR-008`, `REQ-STR-011`, `REQ-PPL-014` |
| `UC-STR-03` | `REQ-STR-002`, `REQ-STR-008`, `REQ-PPL-014` |
| `UC-STR-04` | `REQ-STR-002`, `REQ-PPL-014`, `REQ-STR-011`, `REQ-STR-010` |
| `UC-STR-05` | `REQ-STR-002`, `REQ-STR-006`, `REQ-STR-008`, `REQ-PPL-015` |
| `UC-STR-06` | `REQ-STR-003`, `REQ-STR-008`, `REQ-STR-010`, `REQ-STR-011` |
| `UC-STR-07` | `REQ-STR-003`, `REQ-PPL-014`, `REQ-STR-011` |
| `UC-STR-08` | `REQ-STR-003`, `REQ-STR-006`, `REQ-STR-008`, `REQ-PPL-015` |
| `UC-STR-09` | `REQ-STR-004`, `REQ-STR-008`, `REQ-PPL-014`, `REQ-STR-010`, `REQ-STR-013` |
| `UC-STR-10` | `REQ-STR-008`, `REQ-STR-004`, `REQ-PPL-014`, `REQ-STR-011` |
| `UC-STR-11` | `REQ-STR-004`, `REQ-STR-008` |
| `UC-STR-12` | `REQ-STR-004`, `REQ-STR-006`, `REQ-STR-008`, `REQ-PPL-015` |
| `UC-STR-13` | `REQ-STR-005`, `REQ-STR-008`, `REQ-STR-013`, `REQ-STR-011` |
| `UC-STR-14` | `REQ-STR-012`, `REQ-STR-005`, `REQ-STR-008`, `REQ-EVT-011` |
| `UC-STR-15` | `REQ-STR-005`, `REQ-STR-006`, `REQ-STR-008`, `REQ-PPL-015`, `REQ-EVT-024` |
| `UC-EVT-01` | `REQ-EVT-002`, `REQ-EVT-009`, `REQ-EVT-005`, `REQ-EVT-001`, `REQ-EVT-007`, `REQ-STR-012`, `REQ-COM-016`, `REQ-SYS-018`, `REQ-STR-013` |
| `UC-EVT-02` | `REQ-EVT-003`, `REQ-EVT-006`, `REQ-EVT-009`, `REQ-EVT-001`, `REQ-EVT-007`, `REQ-CMP-005`, `REQ-EVT-005` |
| `UC-EVT-03` | `REQ-EVT-004`, `REQ-EVT-005`, `REQ-EVT-009`, `REQ-EVT-001`, `REQ-EVT-017`, `REQ-STR-013` |
| `UC-EVT-04` | `REQ-EVT-010`, `REQ-EVT-011`, `REQ-EVT-012`, `REQ-EVT-015`, `REQ-EVT-006`, `REQ-STR-012`, `REQ-PRT-003`, `REQ-EVT-013`, `REQ-EVT-001`, `REQ-COM-016`, `REQ-STR-011`, `REQ-SYS-017` |
| `UC-EVT-05` | `REQ-EVT-007`, `REQ-EVT-011`, `REQ-PRT-004`, `REQ-PRT-003`, `REQ-COM-014`, `REQ-EVT-008` |
| `UC-EVT-06` | `REQ-EVT-007`, `REQ-PRT-004`, `REQ-PRT-003`, `REQ-COM-014` |
| `UC-EVT-07` | `REQ-EVT-007`, `REQ-EVT-008`, `REQ-EVT-011`, `REQ-COM-014`, `REQ-PRT-004`, `REQ-EVT-024` |
| `UC-EVT-08` | `REQ-EVT-007`, `REQ-EVT-011`, `REQ-COM-014`, `REQ-PRT-004` |
| `UC-EVT-09` | `REQ-EVT-007`, `REQ-EVT-008`, `REQ-PRT-015`, `REQ-PRT-013`, `REQ-PRT-011` |
| `UC-EVT-10` | `REQ-EVT-007`, `REQ-EVT-008`, `REQ-PRT-015`, `REQ-PRT-016` |
| `UC-EVT-11` | `REQ-EVT-012`, `REQ-EVT-011`, `REQ-SYS-009`, `REQ-IAM-016`, `REQ-SYS-015` |
| `UC-EVT-12` | `REQ-EVT-013`, `REQ-SYS-017`, `REQ-SYS-010` |
| `UC-EVT-13` | `REQ-EVT-014`, `REQ-EVT-005`, `REQ-EVT-001`, `REQ-EVT-016`, `REQ-COM-016` |
| `UC-EVT-14` | `REQ-EVT-016`, `REQ-PPL-015` |
| `UC-EVT-15` | `REQ-EVT-018`, `REQ-EVT-024`, `REQ-CMP-005`, `REQ-EVT-003`, `REQ-EVT-001`, `REQ-SYS-018` |
| `UC-EVT-16` | `REQ-EVT-019`, `REQ-EVT-011`, `REQ-INS-009`, `REQ-EVT-008`, `REQ-STR-012` |
| `UC-EVT-17` | `REQ-EVT-020`, `REQ-EVT-022`, `REQ-SYS-013`, `REQ-SYS-019`, `REQ-EVT-008`, `REQ-SYS-012`, `REQ-STR-007`, `REQ-SYS-014` |
| `UC-EVT-18` | `REQ-EVT-021`, `REQ-PRT-003`, `REQ-PRT-007`, `REQ-SYS-007`, `REQ-SYS-011`, `REQ-EVT-022`, `REQ-SYS-019` |
| `UC-EVT-19` | `REQ-EVT-023`, `REQ-EVT-008`, `REQ-EVT-019`, `REQ-INS-011`, `REQ-STR-012`, `REQ-EVT-022`, `REQ-PPL-011`, `REQ-EVT-017`, `REQ-STR-007`, `REQ-STR-010` |
| `UC-PRT-01` | `REQ-PRT-001`, `REQ-PRT-002`, `REQ-PRT-004`, `REQ-PRT-003`, `REQ-PRT-018`, `REQ-PRT-019`, `REQ-COM-017`, `REQ-EVT-017`, `REQ-PPL-012` |
| `UC-PRT-02` | `REQ-PRT-005`, `REQ-PRT-008`, `REQ-EVT-017`, `REQ-SYS-018` |
| `UC-PRT-03` | `REQ-PRT-005`, `REQ-PRT-006`, `REQ-COM-015`, `REQ-PRT-008`, `REQ-INS-011`, `REQ-SYS-018`, `REQ-COM-014` |
| `UC-PRT-04` | `REQ-PRT-007`, `REQ-PRT-006`, `REQ-PRT-017`, `REQ-PRT-018`, `REQ-EVT-021`, `REQ-PPL-011` |
| `UC-PRT-05` | `REQ-PRT-009`, `REQ-PRT-010`, `REQ-PRT-019`, `REQ-EVT-017`, `REQ-COM-017` |
| `UC-PRT-06` | `REQ-PRT-011`, `REQ-PRT-009`, `REQ-PRT-012` |
| `UC-PRT-07` | `REQ-PRT-012`, `REQ-INS-011`, `REQ-INS-009`, `REQ-SYS-006`, `REQ-COM-017` |
| `UC-PRT-08` | `REQ-PRT-013`, `REQ-PRT-015`, `REQ-PRT-019`, `REQ-PRT-016` |
| `UC-PRT-09` | `REQ-PRT-013`, `REQ-PRT-015`, `REQ-PRT-016`, `REQ-PRT-014`, `REQ-INS-005` |
| `UC-PRT-10` | `REQ-PRT-014`, `REQ-INS-011`, `REQ-INS-009`, `REQ-PRT-013`, `REQ-SYS-006` |
| `UC-PRT-11` | `REQ-PRT-016`, `REQ-PRT-015`, `DEF-CMP-001` |
| `UC-PRT-12` | `REQ-PRT-017`, `REQ-CMP-008`, `REQ-CMP-007`, `REQ-INS-009`, `REQ-PPL-015` |
| `UC-PRT-13` | `REQ-PRT-017`, `REQ-CMP-008`, `REQ-PPL-011`, `REQ-PRT-018`, `REQ-CMP-007` |
| `UC-COM-01` | `REQ-COM-001`, `REQ-COM-002`, `REQ-STR-013`, `REQ-SYS-007` |
| `UC-COM-02` | `REQ-COM-001`, `REQ-COM-003`, `REQ-COM-002`, `REQ-COM-014`, `REQ-COM-005` |
| `UC-COM-03` | `REQ-COM-004`, `REQ-COM-003`, `REQ-INS-011`, `REQ-INS-009`, `REQ-SYS-006` |
| `UC-COM-04` | `REQ-COM-001`, `REQ-PPL-015` |
| `UC-COM-05` | `REQ-COM-005`, `REQ-PPL-011`, `REQ-SYS-012` |
| `UC-COM-06` | `REQ-COM-006`, `REQ-COM-013`, `REQ-COM-012`, `REQ-PPL-004` |
| `UC-COM-07` | `REQ-COM-007`, `REQ-COM-013`, `REQ-COM-012` |
| `UC-COM-08` | `REQ-COM-008`, `REQ-COM-013`, `REQ-COM-006`, `REQ-COM-011`, `REQ-COM-012` |
| `UC-COM-09` | `REQ-COM-009`, `REQ-COM-011`, `REQ-COM-012`, `REQ-COM-017`, `REQ-SYS-016`, `REQ-PPL-004` |
| `UC-COM-10` | `REQ-COM-010`, `REQ-INS-011` |
| `UC-COM-11` | `REQ-COM-010`, `REQ-PPL-015`, `REQ-SYS-007` |
| `UC-COM-12` | `REQ-COM-007`, `REQ-COM-011` |
| `UC-COM-13` | `REQ-COM-018`, `REQ-COM-014`, `REQ-COM-015`, `REQ-COM-016`, `REQ-COM-017`, `REQ-SYS-015`, `REQ-SYS-013`, `REQ-SYS-024` |
| `UC-COM-14` | `REQ-COM-018`, `REQ-SYS-013` |
| `UC-CMP-01` | `REQ-CMP-001`, `REQ-CMP-006` |
| `UC-CMP-02` | `REQ-CMP-001`, `REQ-CMP-003` |
| `UC-CMP-03` | `REQ-CMP-002`, `REQ-EVT-024`, `REQ-PPL-015` |
| `UC-CMP-04` | `REQ-CMP-003`, `REQ-CMP-004`, `REQ-CMP-005`, `REQ-STR-010` |
| `UC-CMP-05` | `REQ-CMP-003`, `REQ-CMP-004`, `REQ-CMP-005`, `REQ-STR-010` |
| `UC-CMP-06` | `REQ-CMP-003`, `REQ-CMP-004`, `REQ-CMP-005`, `REQ-EVT-024` |
| `UC-CMP-07` | `REQ-CMP-003`, `REQ-EVT-024`, `REQ-PPL-015`, `REQ-SYS-018` |
| `UC-CMP-08` | `REQ-CMP-006`, `REQ-CMP-007` |
| `UC-CMP-09` | `REQ-CMP-006`, `REQ-CMP-007`, `REQ-CMP-008`, `REQ-SYS-015` |
| `UC-INS-01` | `REQ-INS-001`, `REQ-INS-002`, `REQ-INS-003`, `REQ-PPL-011`, `REQ-SYS-013`, `REQ-SYS-011`, `REQ-SYS-019`, `REQ-STR-010`, `REQ-SYS-023` |
| `UC-INS-02` | `REQ-INS-004`, `REQ-INS-006`, `REQ-INS-007`, `REQ-PRT-010`, `REQ-PRT-012`, `REQ-SYS-011` |
| `UC-INS-03` | `REQ-INS-005`, `REQ-INS-006`, `REQ-INS-007`, `REQ-PRT-016`, `REQ-PRT-013`, `REQ-PRT-014` |
| `UC-INS-04` | `REQ-INS-011`, `REQ-INS-012`, `REQ-INS-009`, `REQ-EVT-008`, `REQ-PPL-015` |
| `UC-INS-05` | `REQ-INS-008`, `REQ-INS-009`, `REQ-INS-010`, `REQ-SYS-020`, `REQ-PPL-011` |

**Gate §28: 102/102 CU con ≥1 REQ. 0 CU sin REQ. 0 feature creep.**

---

# 13. CHECKS AUTOMATIZADOS DEL GATE (§49)

| Check | Esperado | Resultado | Verificación |
|---|---:|---|---|
| Duplicate UC IDs | 0 | **0** | 102 encabezados `## UC-…`; índice §11 del catálogo con 102 filas y 102 IDs distintos |
| Missing UC name | 0 | **0** | Todos los 102 tienen `## UC-ID · Nombre` |
| Missing CU goal | 0 | **0** | Campo `GOAL` en los 102 |
| Missing CU actor | 0 | **0** | Campo `PRIMARY ACTOR(S)` en los 102 |
| Missing CU outcome | 0 | **0** | Campo `SUCCESS OUTCOME` en los 102 |
| Missing CU authority | 0 | **0** | Campo `AUTHORITY SOURCE` en los 102 |
| Missing CU scope | 0 | **0** | Campo `SCOPE` en los 102 |
| Missing CU REQ | 0 | **0** | §12 de este documento: 102 filas, todas con ≥1 REQ |
| Missing UC trigger | 0 | **0** | Campo `TRIGGER` en los 102 |
| Missing UC preconditions | 0 | **0** | Campo `PRECONDITIONS SUMMARY` en los 102 |
| Functional REQ unmapped | 0 | **0** | §11.1: 122 filas, 122 destinos |
| Unknown Actor ID | 0 | **0** | Los 8 IDs de actor usados coinciden con E2 §15 |
| Unknown REQ ID | 0 | **0** | Los 157 IDs coinciden con E1 §11 + errata `UC-FEEDBACK-01/02` |
| Dangling include/extend candidate | 0 | **0** | Los 8 candidatos apuntan a CU existentes (§11 del catálogo, y fichero de relaciones) |
| CU sin nombre de dominio válido | 0 | **0** | Todos los IDs usan `UC-<DOMINIO>-<NN>` con dominio del §1.3 del brief |
| UC fuera de los 8 dominios | 0 | **0** | 0 CU en `SYS` |

**Comprobación de dominios válidos contra §22 del brief:** `IAM` ✓ · `PPL` ✓ · `STR` ✓ · `EVT` ✓ ·
`PRT` ✓ · `COM` ✓ · `CMP` ✓ · `INS` ✓ · `SYS` = 0 CU ✓.

---

# 14. LIMITACIONES DECLARADAS

1. **La columna `Actor primario` de los 35 REQ no funcionales es `SYSTEM_INTERNAL` o
   `NOT_APPLICABLE` por herencia de E2.** E3 no la re-deriva: un REQ no funcional no fuerza actor.
2. **`Coverage Type` es un refinamiento de E3, no una corrección de E2.** Los 6 REQ funcionales que
   E2 marcó `SYSTEM_INTERNAL` y E3 tipa `BUSINESS_RULE` o `CROSS_CUTTING` conservan su
   `Actor Status`. Verificado en §11.4.
3. **Ningún actor fue añadido, modificado ni eliminado.** E3 consume el modelo de E2 como
   autoridad y no reconstruye permisos.
4. **Dos decisiones abiertas siguen vivas** (`ACTOR-DECISION-01`, `ACTOR-DECISION-02`) y esta matriz
   refleja los valores **congelados** por E2, no las recomendaciones. Si se adoptan las
   recomendaciones, la matriz cambia: `ACTOR-DECISION-01` añade 1 CU y amplía `REQ-PPL-011`;
   `ACTOR-DECISION-02` no añade CU pero cambia `UC-EVT-15`.
5. **`REQ-DECISION-NEEDED-01` sigue abierta** y esta matriz **no** incluye ningún CU de restauración
   de estructura. Si se adopta la opción (a), hay que versionar E1 y añadir los CU correspondientes.

---

**Fin del REQ ↔ Actor ↔ Use Case Matrix V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/use-cases/`.
