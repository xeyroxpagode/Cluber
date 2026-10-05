# GEI HOCKEY MANAGEMENT SYSTEM
## ACTOR AUTHORITY BOUNDARY MATRIX V1

**Etapa:** 2 — Modelo de Actores
**Estado:** FROZEN · **Fecha:** 2026-10-05
**Rama:** `gei/e2-actor-model-freeze-v1`
**Baseline de requerimientos:** `29b923f3cb01cf4b425fd6928d210799b9a4bbec`

> **Esto es un modelo conceptual de límites, no una especificación de implementación de
> permisos.** No define endpoints, tablas, flags ni código. Su función es hacer explícito qué
> actor tiene qué límite sobre qué, para que E3 y las etapas siguientes no inventen autoridad.

---

# 1. MATRIZ ACTOR × AUTHORITY SOURCE

## 1.1 Fuente de autoridad por actor

| Actor | `RoleAssignment` | `GuardianRelationship` | `Account` + sesión | `Membership` | `TeamAssignment` | Clasificación |
|---|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | — | — | sólo como condición | — | — | **NONE** |
| `ACT-AUTHENTICATED` | — (abstracto) | — | **Sí** | condición de los hijos | — | **ABSTRACT** |
| `ACT-PLAYER` | **`PLAYER`** `TEAM` | — | condición | **requerida** | **requerida** | **DIRECT** |
| `ACT-CAPTAIN` | **`CAPTAIN`** `TEAM` | — | condición | **requerida** | invariante §8.4 | **DIRECT** |
| `ACT-COACH` | **`COACH`** `TEAM`/`EVENT` | — | condición | **requerida** | **no** | **DIRECT** |
| `ACT-SUBCOMMITTEE` | **`SUBCOMMITTEE`** `CLUB` | — | condición | **requerida** | no | **DIRECT** |
| `ACT-ADMIN` | **`ADMIN`** `CLUB` | — | condición | **requerida** | no | **DIRECT** |
| `ACT-GUARDIAN` | **ninguno** | **Sí** (2 flags) | **requerida** | **no requerida** | no | **DELEGATED** |

## 1.2 Los dos flags de `GuardianRelationship`

| Flag | Concede | Lo niegan |
|---|---|---|
| `can_view_child_info` | `REQ-PPL-008` AC 1; `REQ-PPL-009` | — |
| `can_respond_availability` | `REQ-PRT-002`; `REQ-PRT-004` | `REQ-PPL-008` AC 1; `REQ-PRT-002` AC 2 |

Son **independientes** por relación. Una relación con el primero y sin el segundo concede
consulta y **deniega** la respuesta **con el motivo visible**.

## 1.3 Vínculo actor ↔ entidad de dominio

| Actor | `Person` | `Account` | `Membership` | `TeamAssignment` | `RoleAssignment` | `GuardianRelationship` |
|---|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | destinataria | `PENDING`/`ACTIVE` | — | — | — | — |
| `ACT-AUTHENTICATED` | sí | **`ACTIVE` obligatoria** | no exigida aquí | — | — | — |
| `ACT-PLAYER` | sí | `ACTIVE` | **exigida** | **exigida** | `PLAYER` | opcional |
| `ACT-CAPTAIN` | sí | `ACTIVE` | **exigida** | invariante | `CAPTAIN` | opcional |
| `ACT-COACH` | sí | `ACTIVE` | **exigida** | no | `COACH` | opcional |
| `ACT-SUBCOMMITTEE` | sí | `ACTIVE` | **exigida** | no | `SUBCOMMITTEE` | no |
| `ACT-ADMIN` | sí | `ACTIVE` | **exigida** | no | `ADMIN` | no (la gestiona) |
| `ACT-GUARDIAN` | sí | `ACTIVE` | **no exigida** | no | **ninguno** | **exigido** |

## 1.4 Reglas de la matriz

| Regla | Actor afectado | Evidencia |
|---|---|---|
| Un `RoleAssignment` expirada no produce actor | los 5 de rol | `REQ-PPL-006` |
| `TeamAssignment` por sí sola no produce actor | `ACT-PLAYER` | `REQ-PPL-005` |
| `ACT-GUARDIAN` no requiere `Membership` | `ACT-GUARDIAN` | PT §17; PT §20; `REQ-PPL-008` |
| `ACT-UNAUTHENTICATED` no tiene fuente de autoridad | `ACT-UNAUTHENTICATED` | `REQ-IAM-001`, `REQ-IAM-003` |
| `ACT-AUTHENTICATED` no otorga acceso a la aplicación por sí mismo | `ACT-AUTHENTICATED` | `REQ-IAM-012` |
| Finalizar una relación deja de conceder acceso y conserva el período | `ACT-GUARDIAN` | `REQ-PPL-008` AC 3 |
| `Account DISABLED` revoca sesiones y bloquea la entrada | todos | `REQ-IAM-001` AC 3; `REQ-IAM-002` |

---

# 2. MATRIZ ACTOR × SCOPE

## 2.1 Scopes que existen realmente

| Scope | Existe como scope de actor | Quién lo tiene |
|---|---|---|
| `SELF` | **Sí** | Los 8 actores |
| `CHILD` | **Sí** | `ACT-GUARDIAN` |
| `TEAM` | **Sí** | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` |
| `TEAM_SET` | **Sí** | `ACT-SUBCOMMITTEE` |
| `CLUB` | **Sí** | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| `EVENT` | **Sí** | `ACT-COACH` |
| `DIVISION` | **No** | — |
| `LINE` | **No como scope de actor** | Es alcance de dato de `CompetitionEntry` |
| `SEASON` | **No** | `Season` es histórico, sin estado (`CON-09`) |
| `COMPETITION` | **No como scope de actor** | Es alcance de `EligibilityConstraint` (PT §13) |
| `OTHER` | **No** | — |

## 2.2 Matriz actor × scope

Leyenda: `✓` concedido · `C` condicional · `—` negado · `N/A` no aplica

| Actor | `SELF` | `CHILD` | `TEAM` | `TEAM_SET` | `DIVISION` | `LINE` | `SEASON` | `COMPETITION` | `CLUB` | `EVENT` | `OTHER` |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | `C` sólo su credencial | — | — | — | — | — | — | — | — | — | — |
| `ACT-AUTHENTICATED` | `✓` | — | — | — | — | — | — | — | — | — | — |
| `ACT-PLAYER` | `✓` | — | `✓` | — | — | — | — | — | — | — | — |
| `ACT-CAPTAIN` | `✓` | — | `✓` | — | — | — | — | — | — | — | — |
| `ACT-COACH` | `✓` | — | `✓` | — | — | — | — | — | — | `✓` | — |
| `ACT-SUBCOMMITTEE` | `✓` | — | — | `✓` | — | — | — | — | `✓` | — | — |
| `ACT-ADMIN` | `✓` | — | — | — | — | — | — | — | `✓` | — | — |
| `ACT-GUARDIAN` | `✓` | `✓` | — | — | — | — | — | — | — | — | — |

## 2.3 `DIVISION`, `LINE`, `SEASON` y `COMPETITION` no son scopes de actor

| Scope | Qué es realmente | Quién lo administra |
|---|---|---|
| `DIVISION` | Atributo de un `Team` y de un `EligibilityConstraint` | `ACT-ADMIN` (estructura), `ACT-SUBCOMMITTEE` (habilitación) |
| `LINE` | Alcance de dato de `CompetitionEntry` (`REQ-CMP-004`) | `ACT-ADMIN`, `ACT-SUBCOMMITTEE` |
| `SEASON` | Entidad histórica sin estado (`CON-09`) | `ACT-ADMIN` |
| `COMPETITION` | Alcance de `EligibilityConstraint` (PT §13) | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |

Concederlos como scope de actor sería inventar authority. Acotan **qué filas** puede ver un actor
que ya tiene `TEAM`, `TEAM_SET` o `CLUB`; no amplían su alcance.

## 2.4 Un actor, varios scopes según la acción

| Actor | Acción | Scope |
|---|---|---|
| `ACT-COACH` | Crear partido | `TEAM` |
| `ACT-COACH` | Editar un evento dirigido | `EVENT` |
| `ACT-COACH` | Modificar logística de un evento de su equipo | `TEAM` |
| `ACT-COACH` | Ver asistencia de su equipo | `TEAM` |
| `ACT-COACH` | Ver estado de habilitación de una jugadora de su equipo | `TEAM` |
| `ACT-COACH` | Editar su contacto | `SELF` |
| `ACT-COACH` | Publicar un comunicado | **denegado** |
| `ACT-SUBCOMMITTEE` | Publicar un comunicado de club | `CLUB` |
| `ACT-SUBCOMMITTEE` | Publicar un comunicado a un conjunto de equipos | `TEAM_SET` |
| `ACT-SUBCOMMITTEE` | Editar su contacto | `SELF` |
| `ACT-CAPTAIN` | Actualizar logística de un evento | `TEAM` |
| `ACT-CAPTAIN` | Actualizar logística de un evento de **otro** equipo | **denegado** |
| `ACT-GUARDIAN` | Ver contexto de un menor | `CHILD` |
| `ACT-GUARDIAN` | Ver contexto de otro menor | **denegado** |

---

# 3. MATRIZ ACTOR × CATEGORÍA DE PII

Leyenda: `V` = VIEW · `E` = EDIT · `V/E` · `C` = CONDITIONAL · `—` = NONE (default deny) ·
`ND` = NOT_DEFINED (ningún REQ lo concede; se comporta como `—`)

## 3.1 Matriz completa

| Categoría de PII | `ACT-UNAUTH` | `ACT-AUTH` | `ACT-PLAYER` | `ACT-CAPTAIN` | `ACT-COACH` | `ACT-SUBCOMM` | `ACT-ADMIN` | `ACT-GUARDIAN` |
|---|---|---|---|---|---|---|---|---|
| **SELF DATA** (identidad, pertenencia, roles, estado de cuenta) | — | `V/E` | `V/E` | `V/E` | `V/E` | `V/E` | `V` | `V/E` |
| **OTHER PERSON BASIC** (nombre, apellido) | — | `ND` | `V` | `V` | `V` | `V` | `V/E` | `V` del menor |
| **CONTACT** (teléfono, email) | — | `V/E` propio | `V` equipo `C` | `V` equipo `C` | `V` equipo `C` | **—** | `V/E` | `V/E` propio · **—** del menor |
| **DNI** | — | `ND` | — | **— (Nunca)** | — | — | `V/E` | **—** |
| **DOB** (fecha completa) | — | `ND` | — | — | — | — | `V/E` | **—** |
| **ACCOUNT STATE** | — | `V` propio | `V` propio | `V` propio | `V` propio | `V` propio | `V/E` | `V` propio |
| **SECURITY** (contraseña, credencial, sesiones) | `C` la propia | `V/E` | `V/E` | `V/E` | `V/E` | `V/E` | `C` reset administrativo | `V/E` |
| **ELIGIBILITY STATUS** | — | `ND` | **—** `ACTOR-DECISION-01` | **—** `ACTOR-DECISION-01` | `V` con alcance | `V` | `V` | **—** |
| **ELIGIBILITY REASON** | — | `ND` | — | — | **—** | `V` | `V` | **—** |
| **ELIGIBILITY SOURCE** | — | `ND` | — | — | **—** | `V` | `V` | **—** |
| **GUARDIAN RELATIONSHIP** | — | `ND` | `V` propia, sólo lectura | `V` sólo lectura | `C` info operativa mínima | `ND` | `V/E` | `V` propia |
| **CHILD INFO** (contexto permitido) | — | `ND` | — | — | — | — | `C` la que gestiona | **`V` por flag** |
| **MESSAGE BODY** | — | `ND` | `C` participante + período | `C` | `C` | **—** sin entitlement | **—** sin entitlement | **—** |
| **AUDIT DETAILS** | — | `ND` | — | — | — | — | `V` con redacción | **—** |
| **AUDIT EDIT / DELETE** | — | — | — | — | — | — | **—** | — |
| **OTRO MENOR** | — | — | — | — | — | — | `C` si tiene relación | **— (Nunca)** |

## 3.2 Las tres reglas `Nunca` de PT §6

| Regla | Actor | Verificación |
|---|---|---|
| `ADMIN` lee chats privados sólo por ser `ADMIN` | `ACT-ADMIN` | `MESSAGE BODY` = `—` sin entitlement + participación. `REQ-COM-012` AC 1 |
| `CAPTAIN` ve `DNI` por pertenecer al `Team` | `ACT-CAPTAIN` | `DNI` = `—`. `REQ-PPL-011` AC 1. **La capitana ve contacto pero no `DNI`** |
| `Guardian` ve información de otros menores | `ACT-GUARDIAN` | `OTRO MENOR` = `—`. `REQ-PPL-008` AC 4 |

## 3.3 `ND` no significa permitido

`NOT_DEFINED` significa que **ningún REQ concede** esa combinación actor × categoría. Se
comporta como `NONE`. No se registró ningún `ND` como concesión.

## 3.4 Reglas de aplicación

| Regla | Evidencia |
|---|---|
| El campo no autorizado **no existe en la respuesta**, no se oculta en pantalla | `REQ-PPL-011` AC 4 |
| `CONTACT` requiere necesidad operativa cuando el actor es `COACH`/`CAPTAIN` del equipo | PT §6 |
| El `CONTACT` del menor no se concede por la relación de guardián | PT §6 v1.0.1; `CON-08` |
| El guardián puede ver y modificar sus **propios** datos de contacto | `REQ-PPL-009` AC 3; PT §5 |
| `ELIGIBILITY REASON` y `SOURCE` sólo para `SUBCOMMITTEE` y `ADMIN` | `REQ-CMP-008`; `REQ-PRT-017` AC |
| La auditoría se muestra redactada | `REQ-INS-009` |
| Sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos en registros | `REQ-SYS-020`; `REQ-INS-010` |
| La auditoría no se modifica ni se borra | `REQ-INS-010` |

---

# 4. MATRIZ ACTOR × FAMILIA DE CAPACIDAD DE DOMINIO

## 4.1 Familias

`I` = Identidad y acceso · `P` = Personas y roles · `S` = Estructura del club ·
`E` = Eventos y calendario · `L` = Logística · `PA` = Participación: disponibilidad ·
`SE` = Participación: convocatoria · `AT` = Participación: asistencia · `MR` = Resultado y estadísticas ·
`EL` = Habilitación · `AN` = Comunicación: anuncios oficiales · `CH` = Comunicación: mensajería ·
`NT` = Notificaciones · `CO` = Competencia · `IN` = Inspección: búsqueda e informes ·
`AU` = Auditoría

| Actor | `I` | `P` | `S` | `E` | `L` | `PA` | `SE` | `AT` | `MR` | `EL` | `AN` | `CH` | `NT` | `CO` | `IN` | `AU` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | `C` | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| `ACT-AUTHENTICATED` | `V/E` | — | — | — | — | — | — | — | — | — | — | — | `V` | — | — | — |
| `ACT-PLAYER` | `V/E` | — | — | `C` reach | `V` | `V/E` propia | `V` alcance | `V` alcanzada | `V` alcanzada | `—` | `V` | `✓` | `V` | — | `V` propios | — |
| `ACT-CAPTAIN` | `V/E` | — | — | `C` reach | **`V/E`** | `V/E` propia | `V` alcance | `V` alcanzada | `V` alcanzada | `—` | `V` | `✓` | `V` | — | `V` equipo | — |
| `ACT-COACH` | `V/E` | — | — | `V/E` | `V/E` | `V` equipo | **`V/E`** | **`V/E`** | **`V/E`** | `V` estado | `V` alcanzada | `✓` | `V` | `V` uso | `V` equipo | — |
| `ACT-SUBCOMMITTEE` | `C` step-up | — | **—** | `V/E` club | `V/E` club | `V` club | `V` alcanzada | `V` alcanzada | `V` alcanzada | **`V/E`** | **`V/E`** | `C` entitlement | `V` | **`V/E`** | `V` club | — |
| `ACT-ADMIN` | **`V/E`** | **`V/E`** | **`V/E`** | `C` vallas | — | — | — | — | — | `V/E` | **—** | `C` entitlement | `V` | `V/E` | **—** informes | **`V`** |
| `ACT-GUARDIAN` | `V/E` | — | — | `C` reach menor | `V` del menor | **`V/E` del menor** | `V` del menor | `V` del menor | `V` del menor | **—** | `V` del menor | **—** | `V` del menor | — | — | **—** |

## 4.2 Lecturas de la matriz

| Lectura | Actor | Evidencia |
|---|---|---|
| **Único actor con `V/E` en `L`** además de `COACH` y `SUBCOMMITTEE` | `ACT-CAPTAIN` | `REQ-EVT-019`; PT §5 `Logistics: Team scope` |
| **Único actor con `V/E` en `AN`** | `ACT-SUBCOMMITTEE` | `REQ-COM-001` *"Sólo la Subcomisión"* |
| **Único actor con `V/E` en `S`** | `ACT-ADMIN` | `REQ-STR-009` |
| **Único actor con `V/E` en `AU`** | `ACT-ADMIN` | `REQ-INS-008`, `REQ-INS-009` |
| **Único actor con `V/E` en `SE`, `AT`, `MR`** | `ACT-COACH` | `REQ-PRT-005`…`REQ-PRT-016` |
| **`ACT-ADMIN` sin `V/E` en ninguna familia deportiva** | `ACT-ADMIN` | PT §5; `REQ-INS-004` AC |
| **`ACT-GUARDIAN` sin `CH` y sin `AU`** | `ACT-GUARDIAN` | `REQ-COM-012`; `REQ-PPL-012` |
| **`ACT-SUBCOMMITTEE` sin `S`** | `ACT-SUBCOMMITTEE` | `REQ-STR-009` |

## 4.3 La fila de `ACT-ADMIN`, leída constraint por constraint

| `ACT-ADMIN` **no puede** | Evidencia |
|---|---|
| Crear o editar un entrenamiento | `REQ-EVT-002` AC: *"Admin sin autoridad ⇒ denegado"* |
| Crear un partido | `REQ-EVT-003` |
| Crear un evento del club | `REQ-EVT-004` |
| Posponer, reprogramar o cancelar un partido | PT §5 fila `postpone/reschedule/cancel Match` → `—` |
| Publicar un comunicado oficial | `REQ-COM-001`; PT §5 fila `Announcement oficial` → `—` |
| Corregir un comunicado | `REQ-COM-004` |
| Preparar o publicar una convocatoria | `REQ-PRT-005`…`REQ-PRT-008` |
| Abrir, registrar, cerrar o corregir asistencia | `REQ-PRT-009`, `REQ-PRT-011`, `REQ-PRT-012` |
| Registrar o corregir el resultado de un partido | `REQ-PRT-013`, `REQ-PRT-014` |
| Ver estadísticas de partido | `REQ-PRT-016` |
| Ver el informe de asistencia | `REQ-INS-004` AC: *"el acceso es denegado"*; NOTES: *"No es un defecto"* |
| Ver el informe de rendimiento | `REQ-INS-005` (misma matriz) |
| Mantener la selección | PT §5 fila `Selection` → `—` |
| Leer conversaciones privadas | `REQ-COM-012` AC 1; PT §6 regla `Nunca` |
| Responder su propia disponibilidad sin `PLAYER` | PT §5 *"sólo si además `PLAYER`*; `REQ-PRT-001` AC 3 |

---

# 5. MATRIZ DE COEXISTENCIA

## 5.1 Relaciones de `COEXISTENCE`

`COEXISTENCE` significa: **una misma persona puede satisfacer ambos actores a la vez**. No implica
herencia, no implica exclusión, no crea un actor combinado.

| Actor A | Actor B | Relación | Evidencia | Semántica | Impacto |
|---|---|---|---|---|---|
| `ACT-PLAYER` | `ACT-CAPTAIN` | `COEXISTENCE` **con invariante** | PT §17 `AssignPlayerToTeam` / `MovePlayerTeam` / `EndPlayerTeam`; `REQ-PPL-007`; `src/mock/seed.ts:366-388`; `src/__tests__/domain-truth.test.tsx:261` | En V1 siempre existe un `RoleAssignment PLAYER` vigente junto al `CAPTAIN`, sobre el mismo equipo. Es una regla de comando, no una relación de tipos | E3 no debe usar `CAPTAIN` como subtipo de `PLAYER` |
| `ACT-COACH` | `ACT-PLAYER` | `COEXISTENCE` | PT §5: `responder propia Availability \| COACH: sólo si además PLAYER` | Un entrenador puede ser también jugadora de su propio equipo | Un `COACH` sin `PLAYER` vigente **no** responde su propia disponibilidad |
| `ACT-SUBCOMMITTEE` | `ACT-PLAYER` | `COEXISTENCE` | PT §5 (misma fila) | Ídem | Ídem |
| `ACT-ADMIN` | `ACT-PLAYER` | `COEXISTENCE` | PT §5 (misma fila) | Ídem | Ídem |
| `ACT-GUARDIAN` | cualquiera de los 5 de rol | `COEXISTENCE` | `REQ-PPL-012` AC 1; `REQ-PPL-008` PRECONDITION | La relación es una fuente **separada**; no otorga ni quita roles deportivos | Al actuar como guardián usa la relación; al actuar como `COACH` usa el rol |
| `ACT-ADMIN` | `ACT-COACH` | `COEXISTENCE` | PT §5 `ADMIN no es superusuario deportivo` | Dos bundles de autoridad con alcances distintos (`CLUB` vs `TEAM`/`EVENT`) | `ADMIN` + `COACH` = unión, no `SUPERUSER` |
| `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | `COEXISTENCE` | PT §5: `Club structure` → `SUBCOMMITTEE: —`, `ADMIN: ✓` | Autoridades administrativas y oficiales en la misma persona | La separación de `REQ-STR-009` sigue vigente para ambos |

## 5.2 Relaciones de delegación

| Delegante | Delegado | Relación | Evidencia | Semántica |
|---|---|---|---|---|
| `ACT-ADMIN` | `ACT-GUARDIAN` | `DELEGATION RELATION` | `REQ-PPL-008` AC 3 | `ACT-ADMIN` **crea y finaliza** la `GuardianRelationship`. `ACT-GUARDIAN` **la usa**. |

`ACT-ADMIN` no delega autoridad administrativa a `ACT-GUARDIAN`: le delega el acceso a un
menor, delimitado por dos flags.

## 5.3 Relaciones de generalización

| Child | Parent | Relación | Evidencia |
|---|---|---|---|
| `ACT-PLAYER` | `ACT-AUTHENTICATED` | `GENERALIZATION` | `REQ-IAM-005`, `REQ-IAM-010`, `REQ-PPL-016`; PT §5 fila 1 |
| `ACT-CAPTAIN` | `ACT-AUTHENTICATED` | `GENERALIZATION` | Ídem |
| `ACT-COACH` | `ACT-AUTHENTICATED` | `GENERALIZATION` | Ídem |
| `ACT-SUBCOMMITTEE` | `ACT-AUTHENTICATED` | `GENERALIZATION` | Ídem |
| `ACT-ADMIN` | `ACT-AUTHENTICATED` | `GENERALIZATION` | Ídem |
| `ACT-GUARDIAN` | `ACT-AUTHENTICATED` | `GENERALIZATION` | Ídem; `REQ-PPL-009` AC 3 (contacto propio), `REQ-PPL-016` AC 4–5 |

## 5.4 Relaciones `NONE` explícitas

| Actor A | Actor B | Relación | Motivo |
|---|---|---|---|
| `ACT-CAPTAIN` | `ACT-COACH` | `NONE` | PT §5: *"CAPTAIN no hereda poder de Coach"* |
| `ACT-CAPTAIN` | `ACT-PLAYER` | `NONE` (sólo `COEXISTENCE`) | Roles hermanos con bundles distintos sobre el mismo scope |
| `ACT-GUARDIAN` | `ACT-PLAYER` | `NONE` | Sin `PLAYER` no responde disponibilidad propia; sin scope `TEAM`; sin entitlement comunicacional |
| `ACT-GUARDIAN` | `ACT-COACH` | `NONE` | Ninguna autoridad deportiva |
| `ACT-GUARDIAN` | `ACT-ADMIN` | `NONE` | `ACT-GUARDIAN` no gestiona; `REQ-PPL-008` AC 3 |
| `ACT-GUARDIAN` | `ACT-SUBCOMMITTEE` | `NONE` | Sin anuncio oficial, sin habilitación, sin competencias |
| `ACT-ADMIN` | `ACT-COACH` | `NONE` | `ADMIN` no crea eventos ni gestiona convocatoria |
| `ACT-ADMIN` | `ACT-SUBCOMMITTEE` | `NONE` | `ADMIN` no publica comunicados ni administra competencias |
| `ACT-SUBCOMMITTEE` | `ACT-COACH` | `NONE` | PT §5: *"SUBCOMMITTEE no equivale a Coach"* |
| `ACT-COACH` | `ACT-PLAYER` | `NONE` | `COACH` sin `PLAYER` no responde su propia disponibilidad |
| `ACT-AUTHENTICATED` | `ACT-UNAUTHENTICATED` | `NONE` | `ACT-UNAUTHENTICATED` no tiene sesión para cerrar ni perfil |
| cualquiera | `System` | `NONE` | `System` no es actor |

## 5.5 Actores combinatorios explícitamente prohibidos

| Actor combinado NO creado | Motivo |
|---|---|
| `CoachAdmin` | Alcances distintos (`CLUB` vs `TEAM`/`EVENT`) que no se combinan en un scope único |
| `PlayerCaptain` | Roles hermanos; la unión ya está expresada por la disyunción de fuentes |
| `CoachGuardian` | `GuardianRelationship` no es un rol; su scope es `CHILD`, no `TEAM` |
| `AdminCoach` | PT §5: `ADMIN` no es superusuario deportivo |
| `SubcommitteeCoach` | `REQ-STR-009` separa las dos distribuciones de autoridad |
| `CaptainPlayer` | Resuelto como `COEXISTENCE` |

Un actor combinatorio por cada par produciría `n²` actores para una autoridad que ya es `n`
disjunciones. PT §5: *"Multi-role = unión de assignments vigentes"*.

---

# 6. MATRIZ DE LÍMITES POR ESTADO DE OBJETO

No todos los límites son de actor: también los hay por **estado del objeto**. Es la razón por la
que la fórmula de autoridad tiene seis conjunctos y no dos.

| Actor | Objeto | Estado | Efecto sobre el actor | Evidencia |
|---|---|---|---|---|
| `ACT-PLAYER` | `Event` | `DRAFT` | No acepta disponibilidad | `REQ-PRT-004` AC 3 |
| `ACT-PLAYER` | `Event` | `SCHEDULED` | Disponibilidad abierta | `REQ-PRT-001`; `REQ-PRT-004` |
| `ACT-PLAYER` | `Event` | `POSTPONED` | Conserva respuestas previas; no acepta nuevas | `REQ-PRT-004` AC 1 |
| `ACT-PLAYER` | `Event` | `CANCELLED` / `COMPLETED` / `ABANDONED` | Terminal; sin respuesta de disponibilidad como acción principal | `REQ-EVT-008`; `REQ-EVT-007` |
| `ACT-GUARDIAN` | `Event` | no alcanza al menor | La operación se rechaza | `REQ-PRT-002` AC 3 |
| `ACT-COACH` | `Selection` | evento `≠ SCHEDULED` o tipo `≠ MATCH` | Publicar se rechaza | `REQ-PRT-005` |
| `ACT-COACH` | `Attendance` | `CLOSED` | No admite marcaje nuevo sin corrección auditada | `REQ-PRT-011`; `REQ-PRT-012` |
| `ACT-COACH` | `MatchRecord` | `FINAL` | No se edita por la vía normal | `REQ-PRT-013` |
| `ACT-COACH` | `MatchRecord` | evento `∉ {COMPLETED, ABANDONED}` | `MATCH_STATE_INCOMPATIBLE` | `REQ-PRT-015` |
| `ACT-CAPTAIN` | `EventLogistics` | evento terminal | Logística no editable | `REQ-EVT-008` |
| `ACT-ADMIN` | conjunto de `ADMIN` | quedaría en 0 `ACTIVE`/`CLUB` | `LAST_ADMIN_REQUIRED`; nada cambia | `REQ-IAM-013`; `CON-20` |
| `ACT-ADMIN` | `Division`/`Line` | con equipos activos | Renombrar se rechaza | `REQ-PPL-014` |
| `ACT-ADMIN` | estructura | con dependencia activa | Archivar se rechaza nombrando la dependencia | `REQ-STR-006` |
| `ACT-ADMIN` | `Membership` | con dependencias activas | Finalizar se rechaza; el período se conserva | `REQ-PPL-004` |
| `ACT-ADMIN` | `Account` | `DISABLED` | Revoca sesiones | `REQ-IAM-002` |
| `ACT-SUBCOMMITTEE` | `Competition` | inscripciones activas | Cerrar se rechaza explicándolas | `REQ-CMP-002` |
| `ACT-SUBCOMMITTEE` | `Announcement` | `PUBLISHED` | La audiencia es un snapshot inmutable | `REQ-COM-003` |
| `ACT-SUBCOMMITTEE` | `Announcement` | `PUBLISHED` | Corregir no cambia la audiencia | `REQ-COM-004` |
| `ACT-SUBCOMMITTEE` | estructura | — | Acceso denegado con explicación | `REQ-STR-009` |
| `ACT-COACH` | `Event MATCH` | `SCHEDULED` | Cambiar el equipo se rechaza | `REQ-EVT-006` |
| `ACT-COACH` | `Event` | `COMPLETED` | No se reabre | `REQ-EVT-007` |
| Todos | `Account` | `PENDING` / `DISABLED` | Acceso rechazado; sin sesión | `REQ-IAM-001` AC 3 |
| `ACT-GUARDIAN` | `GuardianRelationship` | finalizada | Deja de conceder acceso; el período se conserva | `REQ-PPL-008` AC 3 |
| Todos de rol | `RoleAssignment` | expirada | No computa | `REQ-PPL-006` |
| `ACT-PLAYER` / `ACT-CAPTAIN` | `TeamAssignment` | terminada | Cierra también `PLAYER` y `CAPTAIN` | `REQ-PPL-007`; PT §17 |

---

# 7. MATRIZ DE RESUMEN POR ACTOR

| Actor | Authority source | Scope principal | Familia dominante | PII distintiva | Límite más restrictive |
|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | ninguna | `SELF` | `I` (autenticación) | cero | no tiene sesión |
| `ACT-AUTHENTICATED` | `Account` + sesión | `SELF` | `I` (lo propio) | sólo `SELF DATA` | no accede a la aplicación sin rol o delegación |
| `ACT-PLAYER` | `RoleAssignment PLAYER` | `TEAM` | `PA`, `IN` propios | `ELIGIBILITY` = `—` | `ACT-DECISION-01` |
| `ACT-CAPTAIN` | `RoleAssignment CAPTAIN` | `TEAM` | **`L`** | `DNI` = `—` (Nunca) | sólo logística propia |
| `ACT-COACH` | `RoleAssignment COACH` | `TEAM` / `EVENT` | `E`, `SE`, `AT`, `MR` | `ELIGIBILITY REASON` = `—` | sin autoridad administrativa |
| `ACT-SUBCOMMITTEE` | `RoleAssignment SUBCOMMITTEE` | `CLUB` / `TEAM_SET` | `AN`, `CO`, `EL` | `CONTACT` = `—` | sin estructura, sin cuentas |
| `ACT-ADMIN` | `RoleAssignment ADMIN` | `CLUB` | `P`, `S`, `AU` | `DNI`/`DOB` `V/E` (único) | **cero autoridad deportiva** |
| `ACT-GUARDIAN` | `GuardianRelationship` | `CHILD` | `PA` del menor | `DNI`/`DOB` del menor = `—` | sin roles, sin comunicación, sin otros menores |

---

# 8. LÍMITES DE ESTA MATRIZ

1. **No es una especificación de permisos.** No define endpoints, tablas, flags ni código.
2. **No lista campos de base de datos.** Las categorías de PII son agrupamientos funcionales
   derivados de PT §6 y Freeze §7.3. El detalle por campo es de E6/PT.
3. **No reemplaza la PII field authority de Product Truth.** La resume desde la perspectiva del
   actor.
4. **`ND` se comporta como `NONE`.** No se registró ninguna concesión por ausencia de definición.
5. **No asigna actores a `DEFER` ni a `OUT`.** 14 + 26 elementos fuera de V1.
6. **`ACTOR-DECISION-01` mantiene `ACT-PLAYER` y `ACT-CAPTAIN` en `NONE` para
   `ELIGIBILITY STATUS`** hasta que exista decisión escrita. Es el valor conservador.
7. **La implementación actual no cumple esta matriz.** 13 `ACTOR_UI_FINDING` y 8 actores con
   estado de alineación `PARTIAL`, `CONTRADICTORY` o `NOT IMPLEMENTED`. Ver
   `GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md` §15. **No se corrigió `src/**`.**

---

**Fin del Actor Authority Boundary Matrix V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/actors/`.
