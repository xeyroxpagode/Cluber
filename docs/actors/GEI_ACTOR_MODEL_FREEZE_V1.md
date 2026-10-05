# GEI HOCKEY MANAGEMENT SYSTEM
## ACTOR MODEL FREEZE V1

**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Etapa:** 2 — Modelo de Actores
**Rama:** `gei/e2-actor-model-freeze-v1`
**Baseline de requerimientos:** `29b923f3cb01cf4b425fd6928d210799b9a4bbec` (`gei/e1-requirements-freeze-v1`)

---

# 1. STATUS Y AUTORIDAD

Este documento es la **autoridad del modelo de actores** de GEI a partir de esta fecha. Responde
**quién** interactúa con GEI, **en qué capacidad**, **con qué autoridad**, **sobre qué scope** y
**cuáles son sus límites**.

| Documento | Rol |
|---|---|
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` (este) | **Autoridad del modelo de actores.** |
| `docs/actors/GEI_ACTOR_CATALOG_V1.md` | Catálogo formal: definición completa de cada actor. |
| `docs/actors/GEI_ACTOR_REQUIREMENT_MATRIX_V1.md` | Los 157 REQ IN con actor, beneficiario, sujeto, authority source y scope. |
| `docs/actors/GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1.md` | Límites: authority source, scope, PII, capacidad, coexistencia, generalización. |
| `docs/actors/GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md` | Proceso, evidencia, reconciliación, estrés. |
| `docs/actors/GEI_ACTOR_OPEN_DECISIONS_V1.md` | 2 decisiones abiertas, **0 bloqueantes**. |
| `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` | **Autoridad de requerimientos.** Este documento **no la sustituye**: la traduce a actores. |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | Autoridad de producto y de dominio. Si un actor de este freeze contradice PT, **manda PT**. |
| `src/**` | Prototipo. **No es autoridad de actores.** |

**Contadores del freeze:** 8 actores canónicos · 1 abstracto · 6 roles humanos · 1 delegado ·
0 sistemas externos · 6 generalizaciones adoptadas · 16 rechazadas · 18 REQ funcionales
`SYSTEM_INTERNAL` · 0 `AMBIGUOUS` · 2 decisiones abiertas (0 bloqueantes) · 9 feedbacks de calidad.

**Cambio de este documento:** sólo con decisión de producto escrita, cambio del catálogo de
actores correspondiente y verificación de los gates de §16.

---

# 2. REGLAS DE MODELADO DE ACTORES

Estas reglas gobiernan cualquier actor que se agregue en el futuro.

| # | Regla | Origen |
|---:|---|---|
| 1 | **ACTOR ≠ ROLE ≠ PERSON ≠ ACCOUNT ≠ PERMISSION ≠ SCREEN.** Ninguno es sinónimo de otro | Freeze §13 |
| 2 | Un actor existe **fuera** del sistema, interactúa con GEI, participa en una capacidad y está respaldado por al menos un REQ | Brief §8 |
| 3 | La autoridad **no** es `ROLE → YES/NO`. Es `ROL + ACCIÓN + ALCANCE + ESTADO DEL OBJETO + AUTORIDAD POR CAMPO + ORIGEN`, con **default deny** | Freeze §7.1; PT §5 |
| 4 | Un actor no aplana la autoridad. Su descripción nombra la fuente, el scope y el límite | Freeze §7.1 |
| 5 | La **generalización** sólo es válida si el child puede participar en **TODOS** los casos de uso del parent en los mismos términos conceptuales | Brief §4 |
| 6 | `COEXISTENCE` es "puede tener ambos roles". **Nunca** es herencia | Brief §23 |
| 7 | No se crean actores combinatorios. La autoridad de una persona es la disyunción de sus fuentes vigentes | PT §5 `Multi-role = unión de assignments vigentes` |
| 8 | `System`, backend, frontend, workers, cron y base de datos **no son actores** | Brief §8 |
| 9 | Los estados de `Account` (`PENDING`, `ACTIVE`, `DISABLED`) **no son actores**. Pueden condicionar la entrada | Brief §15 |
| 10 | Los estados de una entidad de dominio **no son actores** | Brief §8 |
| 11 | No se deriva ningún actor del frontend. El frontend es evidencia secundaria | Brief §10; `CON-21` |
| 12 | Un sistema externo sólo es actor si existe **realmente** en los requerimientos | Brief §8 |
| 13 | Un actor abstracto no puede convertirse en una forma de conceder permisos por defecto | Brief §14 |
| 14 | Los actores abstractos se mantienen en el **mínimo** necesario | Brief §14 |
| 15 | El actor no sustituye al requerimiento. Un REQ sin actor es `SYSTEM_INTERNAL` o `NOT_APPLICABLE`, nunca un actor nuevo | Brief §27 |

---

# 3. ACTORES CANÓNICOS

| # | ID | Nombre | KIND | Authority source | Scopes |
|---:|---|---|---|---|---|
| 1 | `ACT-UNAUTHENTICATED` | Persona no autenticada | `HUMAN_ROLE` | ninguna (credencial o código propio) | `SELF` |
| 2 | `ACT-PLAYER` | Jugadora | `HUMAN_ROLE` | `RoleAssignment PLAYER` | `SELF`, `TEAM` |
| 3 | `ACT-CAPTAIN` | Capitana | `HUMAN_ROLE` | `RoleAssignment CAPTAIN` | `SELF`, `TEAM` |
| 4 | `ACT-COACH` | Entrenador/a | `HUMAN_ROLE` | `RoleAssignment COACH` | `SELF`, `TEAM`, `EVENT` |
| 5 | `ACT-SUBCOMMITTEE` | Subcomisión de hockey | `HUMAN_ROLE` | `RoleAssignment SUBCOMMITTEE` | `SELF`, `TEAM_SET`, `CLUB` |
| 6 | `ACT-ADMIN` | Administración del club | `HUMAN_ROLE` | `RoleAssignment ADMIN` | `SELF`, `CLUB` |
| 7 | `ACT-GUARDIAN` | Responsable / guardian | `DELEGATED_HUMAN` | `GuardianRelationship` | `SELF`, `CHILD` |

Definición completa de cada actor en `docs/actors/GEI_ACTOR_CATALOG_V1.md` §2–§9.

## 3.1 Conteos

| Categoría | Valor |
|---|---:|
| Actores canónicos totales | **8** |
| Actores abstractos | 1 |
| Actores de rol humano | 6 |
| Actores humanos delegados | 1 |
| Actores de sistema externo | **0** |
| Actores no instanciables | 1 |

## 3.2 Por qué `ACT-UNAUTHENTICATED` existe

`REQ-IAM-001` exige que alguien **inicie** la autenticación. Sin nombrar a esa persona, el
requerimiento no tiene sujeto. `REQ-IAM-003` exige que alguien **consuma** un código de un solo
uso sin que se cree sesión.

Es **una** sola capacidad agrupada, no dos actores: unir ambos contextos evita crear un actor
definido por un estado de `Account`, que la regla 9 prohíbe. No tiene ninguna fuente de
autoridad y no recibe ningún dato del club.

## 3.3 Por qué no hay sistemas externos

| Integración externa | Veredicto |
|---|---|
| Proveedor de ingreso externo | `OUT-IAM-001` |
| MFA / passkeys | `OUT-IAM-002` |
| Notificaciones SMS / email / push | `OUT-SYS-005` |
| Integración automática con federación | `OUT-CMP-003` — sólo referencia manual `REQ-CMP-006` |
| Redis / WebSocket / microservicios | `OUT-SYS-003` |

Toda mención a un tercero es un dato o una referencia manual, no una interacción de sistema
externo. **`EXTERNAL_SYSTEM` = 0.**

---

# 4. ACTOR ABSTRACTO

## 4.1 `ACT-AUTHENTICATED`

| Campo | Valor |
|---|---|
| **ID** | `ACT-AUTHENTICATED` |
| **Kind** | `ABSTRACT_ACTOR` |
| **Abstract** | **YES** |
| **Definition** | Capacidad común de toda persona con `Account ACTIVE` y sesión vigente, sin considerar rol ni delegaciones |
| **Authority source** | `Account` + sesión. **No es** fuente de autoridad de dominio |
| **Scope** | `SELF` |
| **Can initiate** | Editar contacto y contraseña propios; ver y cerrar sesiones propias; ver el perfil propio y cambiar el contexto de menor; sobrevivir a la interrupción de sesión |
| **Can receive** | Identidad, pertenencia con vigencia, roles con alcance resuelto, estado de cuenta |
| **Does NOT imply** | **Acceso a la aplicación por sí solo**; ninguna capacidad de rol; ninguna proyección |

## 4.2 Regla dura: abstracción sin concesión

`REQ-IAM-012` exige `rol interno vigente` **o** `delegación con permiso` para entrar. Sin ninguno
de los dos ⇒ `/no-access` **sin datos ni destinos**.

Por tanto `ACT-AUTHENTICATED` **no es** una forma de conceder permisos por defecto.

## 4.3 Límite del actor abstracto

| Incluido (actor-independiente) | Excluido deliberadamente |
|---|---|
| Contacto y contraseña propios | Calendario, Inicio, búsqueda, informes |
| Sesiones propias | Disponibilidad propia (requiere `PLAYER`) |
| Perfil propio; contexto de menor | Convocatoria, asistencia, resultado (requieren `COACH`) |
| Interrupción de sesión | Comunicado oficial (requiere `SUBCOMMITTEE`) |
| — | Gestión de identidad (requiere `ADMIN`) |

Las proyecciones quedan fuera del abstracto porque su **contenido** depende del scope de cada
actor concreto. Colgar una proyección del abstracto introduciría una concesión implícita por
pertenencia.

## 4.4 El abstracto no es instanciable

Una `Account ACTIVE` con `Membership` vigente pero **sin** `RoleAssignment` y **sin**
`GuardianRelationship` **no satisface ningún actor** y obtiene `/no-access`.

## 4.5 Máximo de abstractos: 1

No hay segundo actor abstracto. `ACT-UNAUTHENTICATED` **no** es abstracto: es una persona real
en un momento concreto de su interacción.

---

# 5. MODELO DE GUARDIAN

## 5.1 Representación

`ACT-GUARDIAN` es un actor canónico de kind `DELEGATED_HUMAN`, instanciable, jerarquizado bajo
`ACT-AUTHENTICATED`, y **no** es un `RoleAssignment`.

| Atributo | Valor | Evidencia |
|---|---|---|
| Definición | Adulto con al menos una `GuardianRelationship` vigente sobre uno o más menores | `REQ-PPL-008`; PT §20 |
| **Authority source** | **`GuardianRelationship`** | PT §5 `Guardian no es Role`; Freeze §7.2 |
| `RoleAssignment` | **ninguno**, por definición | `REQ-PPL-012` AC 1 |
| `Membership` | **no requerida** | PT §17; PT §20; `REQ-PPL-008` PRECONDITION |
| `Account` | **requerida**, `ACTIVE` | `REQ-IAM-012` |
| **Scope** | `CHILD` — un `childId` por relación vigente | PT §20 `individual per minor` |

## 5.2 Los dos permisos, independientes por relación

| Flag | Concede | Deniega |
|---|---|---|
| `can_view_child_info` | `REQ-PPL-008` AC 1; `REQ-PPL-009` | — |
| `can_respond_availability` | `REQ-PRT-002`; `REQ-PRT-004` | `REQ-PPL-008` AC 1; `REQ-PRT-002` AC 2 |

Con el primero y sin el segundo: **ve el contexto y no puede responder, con el motivo visible**.

## 5.3 Varios menores, permisos distintos

La unidad de scope y de permiso es **la relación**, no la persona. Un mismo adulto puede tener
dos `GuardianRelationship` con flags distintos. `REQ-PPL-008` AC 4: cada uno ve únicamente a su
propio menor.

## 5.4 PII del menor: dos listas cerradas

| **Concede** | **No concede** |
|---|---|
| Nombre y apellido | `DNI` |
| Equipo | Fecha de nacimiento completa |
| Eventos relevantes | Información administrativa |
| Disponibilidad relevante | Motivo de habilitación |
| Información operativa necesaria | Origen de habilitación |
| — | Conversaciones privadas |
| — | Auditoría |
| — | Roles administrativos |
| — | `CONTACT` del menor (PT §6 v1.0.1) |
| — | **Datos de otro menor** (regla `Nunca`) |

## 5.5 Lo que `ACT-GUARDIAN` no es

No es `RoleAssignment` · no es rol deportivo · no requiere `Membership` · no otorga `TeamAssignment`
· no obtiene accesorio comunicacional (`REQ-COM-012`) · no otorga autoridad de gestión
(`REQ-PPL-012`) · no tiene módulo propio · no tiene destino `/guardian` (PT §20) · no es excluyente
con los roles deportivos.

## 5.6 Proyecciones y conmutador de menor

Un menor ⇒ sin selector. Varios menores ⇒ conmutador contextual simple que cambia Inicio,
Calendario, Equipo y Disponibilidad (`REQ-PPL-016` AC 4–5; PT §20). Lo que cambia es la
**proyección**, no el actor.

## 5.7 Diferencia entre la relación y la identidad del adulto

`GuardianRelationship` es la **fuente de autoridad** (creada y finalizada por `ACT-ADMIN`,
`REQ-PPL-008` AC 3). La identidad del adulto es su `Person` + `Account`. Son cosas distintas y
pueden existir por separado.

---

# 6. MODELO MULTI-ROL

## 6.1 No existe el actor combinado

La autoridad efectiva de una persona es la **conjunción evaluada por acción** de todas sus
fuentes vigentes:

```
Person P
  ├─ RoleAssignment PLAYER      [vigente, TEAM t1]                    → ACT-PLAYER
  ├─ RoleAssignment COACH       [vigente, TEAM t2]                    → ACT-COACH
  ├─ RoleAssignment CAPTAIN     [vigente, TEAM t1]                    → ACT-CAPTAIN
  └─ GuardianRelationship gr-1  [vigente, child c1, view+respond]     → ACT-GUARDIAN

autoridad(P, acción, objeto, scope) =
    OR sobre cada fuente f vigente:
        f.action ∈ acción  AND  f.scope ⊇ scope  AND  f.estado permite la acción
        AND  f.fieldAuthority permite el campo  AND  f.source es válido
    default: DENY
```

## 6.2 `COEXISTENCE`, nunca `GENERALIZATION`

`COEXISTENCE` significa "una misma persona puede satisfacer ambos actores". No implica herencia,
no implica exclusión, no crea un actor combinado.

| Actor A | Actor B | Invariante |
|---|---|---|
| `ACT-PLAYER` | `ACT-CAPTAIN` | En V1 siempre existe `PLAYER` vigente junto al `CAPTAIN`, sobre el mismo equipo |
| `ACT-COACH` | `ACT-PLAYER` | `COACH` sin `PLAYER` vigente **no** responde su propia disponibilidad |
| `ACT-SUBCOMMITTEE` | `ACT-PLAYER` | Ídem |
| `ACT-ADMIN` | `ACT-PLAYER` | Ídem |
| `ACT-GUARDIAN` | cualquiera de rol | La relación es una fuente separada; no otorga ni quita roles |
| `ACT-ADMIN` | `ACT-COACH` | Dos bundles con alcances distintos; la unión no crea autoridad deportiva nueva |
| `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | La separación de `REQ-STR-009` sigue vigente para ambos |

## 6.3 Actores combinatorios prohibidos

`CoachAdmin` · `PlayerCaptain` · `CoachGuardian` · `AdminCoach` · `SubcommitteeCoach` ·
`CaptainPlayer`. Producirían `n²` actores para una autoridad que ya es `n` disjunciones.

---

# 7. RESOLUCIÓN DE `CAPTAIN`

## 7.1 Decisión

> **`ACT-CAPTAIN` es un actor canónico independiente. No generaliza a ningún actor. Su autoridad
> propia es la logística con alcance `TEAM`.**

## 7.2 Autoridad propia, con evidencia

| Fuente | Evidencia |
|---|---|
| PT §5 | Fila `Logistics`: `PLAYER: —` · **`CAPTAIN: Team scope`** · `COACH: Team/Event` · `SUBCOMMITTEE: Club scope` · `ADMIN: —` |
| PT §5 | Regla: *"CAPTAIN no hereda poder de Coach"* |
| `REQ-EVT-019` | AC: *"una capitana de un equipo … la operación prospera según su alcance"* |
| `REQ-EVT-019` NOTES | *"PT §5 concede al CAPTAIN alcance de equipo en Logística; es una de las pocas acciones donde CAPTAIN tiene autoridad propia y no derivada de COACH"* |

Es la **única** fila de la matriz donde `CAPTAIN` tiene `✓` y `PLAYER` tiene `—`.

## 7.3 Autoridad adicional de `ACT-CAPTAIN`

| Capacidad | Evidencia |
|---|---|
| Ver `CONTACT` de las jugadoras de su equipo, con necesidad operativa | PT §6; `REQ-PPL-011` AC 1 |
| **No** ver `DNI` | PT §6 regla `Nunca`; `REQ-PPL-011` AC 1 |
| Informe de asistencia y de rendimiento de su equipo, *"si corresponde"* | PT §5 filas `Attendance report` y `Performance report` |
| Accesorio comunicacional automático | `REQ-COM-012`; PT §20 |
| Contacto y contraseña propios | PT §5 fila 1 |

## 7.4 Opciones evaluadas

| Opción | Veredicto | Motivo |
|---|---|---|
| **A — Actor independiente** | **ADOPTADA** | La autoridad tiene `RoleAssignment CAPTAIN` propio, scope declarado, acción iniciable de forma independiente y fila propia en la matriz de PT §5 |
| B — `CAPTAIN extends PLAYER` | **RECHAZADA** | El test de substitutabilidad da 8/8, pero la herencia importaría el aplanamiento `ROL → capacidades` que el Freeze §7.1 prohíbe. PT §5 trata `PLAYER` como conjuncto **independiente y aditivo** para `COACH` (*"sólo si además `PLAYER`"*), lo que prueba que no es un supertipo. Y ocultaría el invariante real de §7.5, que es una regla de comando, no una relación de tipos |
| C — `CAPTAIN extends COACH` | **RECHAZADA** | Prohibido por texto en PT §5: *"CAPTAIN no hereda poder de Coach"*. `REQ-EVT-019` existe precisamente para marcar la excepción |
| D — Capacidad contextual dentro de otro actor | **RECHAZADA** | La authority source es distinta (`RoleAssignment CAPTAIN`), la acción es iniciable sin `COACH`, el scope está declarado por separado y hay fila propia en PT §5. Ninguna de las cuatro condiciones de una capacidad contextual se cumple |

## 7.5 Invariante de co-ocurrencia

En V1 no existe comando que cree un `RoleAssignment CAPTAIN` sin un `RoleAssignment PLAYER`
vigente sobre el mismo equipo:

| Fuente | Evidencia |
|---|---|
| PT §17 `AssignPlayerToTeam` | *"Atómico: TeamAssignment + PLAYER RoleAssignment"* |
| PT §17 `MovePlayerTeam` | *"end old PLAYER role; end CAPTAIN role si existía; create new PLAYER role"*; *"CAPTAIN no se transfiere automáticamente"* |
| PT §17 `EndPlayerTeam` | *"Termina: TeamAssignment; PLAYER role; CAPTAIN role si existía"* |
| `REQ-PPL-007` | *"Incorporar crea afiliación + rol `PLAYER` en una sola operación"* |
| `src/mock/seed.ts:366-388` | El seed emite `PLAYER` y, si el rol es `CAPTAIN`, **además** `CAPTAIN` sobre el mismo `team` |
| `src/__tests__/domain-truth.test.tsx:261` | El test de verdad de dominio espera exactamente `["CAPTAIN","PLAYER"]` |

**Este invariante es una regla de comando, no una relación de tipos.** E3 no debe usarlo como
atajo para tratar `ACT-CAPTAIN` como subtipo de `ACT-PLAYER`.

## 7.6 Ambigüedad de `CAPTAIN` al cerrar E2

**Cero.** La representación, la autoridad, el scope, el límite y las relaciones están
determinados y documentados. El único feedback abierto (`ACTOR-FEEDBACK-01`) pide **aclarar**
el texto de `REQ-EVT-019`, no decidir el modelo.

---

# 8. RELACIÓN CON `ROLEASSIGNMENT`

| Actor | `RoleAssignment` | Authority source | Clasificación |
|---|---|---|---|
| `ACT-UNAUTHENTICATED` | — | ninguna | **NONE** |
| `ACT-AUTHENTICATED` | — (abstracto) | `Account` + sesión | **ABSTRACT** |
| `ACT-PLAYER` | `PLAYER` (`TEAM`) | `RoleAssignment PLAYER` | **DIRECT** |
| `ACT-CAPTAIN` | `CAPTAIN` (`TEAM`) | `RoleAssignment CAPTAIN` | **DIRECT** |
| `ACT-COACH` | `COACH` (`TEAM` o `EVENT`) | `RoleAssignment COACH` | **DIRECT** |
| `ACT-SUBCOMMITTEE` | `SUBCOMMITTEE` (`CLUB`) | `RoleAssignment SUBCOMMITTEE` | **DIRECT** |
| `ACT-ADMIN` | `ADMIN` (`CLUB`) | `RoleAssignment ADMIN` | **DIRECT** |
| `ACT-GUARDIAN` | **ninguno** | **`GuardianRelationship`** | **DELEGATED** |

## 8.1 Relación actor ↔ entidad

| Actor | `Person` | `Account` | `Membership` | `TeamAssignment` | `GuardianRelationship` |
|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | destinataria | `PENDING`/`ACTIVE` | — | — | — |
| `ACT-AUTHENTICATED` | sí | **`ACTIVE`** | no exigida aquí | — | — |
| `ACT-PLAYER` | sí | `ACTIVE` | **exigida** | **exigida** | opcional |
| `ACT-CAPTAIN` | sí | `ACTIVE` | **exigida** | invariante §7.5 | opcional |
| `ACT-COACH` | sí | `ACTIVE` | **exigida** | **no** — se asigna por rol | opcional |
| `ACT-SUBCOMMITTEE` | sí | `ACTIVE` | **exigida** | no | no |
| `ACT-ADMIN` | sí | `ACTIVE` | **exigida** | no | no (la gestiona) |
| `ACT-GUARDIAN` | sí | `ACTIVE` | **no exigida** | no | **exigido** |

## 8.2 Reglas de la relación

| Regla | Evidencia |
|---|---|
| Un `RoleAssignment` expirada no produce actor | `REQ-PPL-006` |
| `TeamAssignment` por sí sola no produce actor | `REQ-PPL-005` |
| `ACT-COACH` se asigna por `RoleAssignment`, no por `TeamAssignment` | PT §17 |
| `ACT-GUARDIAN` no requiere `Membership` | PT §17; PT §20 |
| Finalizar una `GuardianRelationship` deja de conceder acceso y conserva el período | `REQ-PPL-008` AC 3 |
| `Account DISABLED` revoca sesiones y bloquea la entrada | `REQ-IAM-001` AC 3; `REQ-IAM-002` |

---

# 9. PRINCIPIOS DE SCOPE

## 9.1 Scopes que existen

`SELF` · `CHILD` · `TEAM` · `TEAM_SET` · `CLUB` · `EVENT`

## 9.2 Scopes que NO existen como scope de actor

| Scope | Qué es realmente |
|---|---|
| `DIVISION` | Atributo de un `Team` y de un `EligibilityConstraint` |
| `LINE` | Alcance de dato de `CompetitionEntry` (`REQ-CMP-004`) |
| `SEASON` | Entidad histórica sin estado (`CON-09`) |
| `COMPETITION` | Alcance de `EligibilityConstraint` (PT §13) |
| `OTHER` | No existe: nadie tiene alcance sobre terceros sin relación o rol |

Acotan **qué filas** puede ver un actor que ya tiene `TEAM`, `TEAM_SET` o `CLUB`. **No amplían
su alcance.** No se concede `CLUB` si sólo hay `TEAM`.

## 9.3 Scope por actor

| Actor | Scopes |
|---|---|
| `ACT-UNAUTHENTICATED` | `SELF` (su credencial) |
| `ACT-AUTHENTICATED` | `SELF` |
| `ACT-PLAYER` | `SELF`, `TEAM` |
| `ACT-CAPTAIN` | `SELF`, `TEAM` |
| `ACT-COACH` | `SELF`, `TEAM`, `EVENT` |
| `ACT-SUBCOMMITTEE` | `SELF`, `TEAM_SET`, `CLUB` |
| `ACT-ADMIN` | `SELF`, `CLUB` |
| `ACT-GUARDIAN` | `SELF`, `CHILD` |

## 9.4 Un actor, varios scopes según la acción

`ACT-COACH` es el caso canónico: `TEAM` para crear un partido, `EVENT` para editar un evento
dirigido, `TEAM` para la logística de su equipo, `SELF` para su contacto, **denegado** para
publicar un comunicado.

## 9.5 `TEAM_SET`

Existe sólo para la audiencia de un comunicado (`REQ-COM-002`) y sólo para `ACT-SUBCOMMITTEE`.
Un conjunto real de equipos, nunca texto libre.

---

# 10. PRINCIPIOS DE PII Y AUTORIDAD POR CAMPO

## 10.1 Principio

El PII se resuelve **por campo**, en la respuesta. El campo no autorizado **no existe en la
respuesta**, no se oculta en pantalla (`REQ-PPL-011` AC 4). Default deny.

## 10.2 Categorías de PII y quién las ve

| Categoría | `UNAUTH` | `AUTH` | `PLAYER` | `CAPTAIN` | `COACH` | `SUBCOMM` | `ADMIN` | `GUARDIAN` |
|---|---|---|---|---|---|---|---|---|
| `SELF DATA` | — | `V/E` | `V/E` | `V/E` | `V/E` | `V/E` | `V` | `V/E` |
| `OTHER PERSON BASIC` | — | `ND` | `V` | `V` | `V` | `V` | `V/E` | `V` del menor |
| `CONTACT` | — | `V/E` propio | `V` equipo | `V` equipo | `V` equipo | **—** | `V/E` | propio `V/E` · del menor **—** |
| `DNI` | — | `ND` | — | **— (Nunca)** | — | — | `V/E` | **—** |
| `DOB` | — | `ND` | — | — | — | — | `V/E` | **—** |
| `ACCOUNT STATE` | — | `V` propio | `V` propio | `V` propio | `V` propio | `V` propio | `V/E` | `V` propio |
| `SECURITY` | `C` propia | `V/E` | `V/E` | `V/E` | `V/E` | `V/E` | `C` reset | `V/E` |
| `ELIGIBILITY STATUS` | — | `ND` | **—** | **—** | `V` con alcance | `V` | `V` | **—** |
| `ELIGIBILITY REASON` + `SOURCE` | — | `ND` | — | — | **—** | `V` | `V` | **—** |
| `GUARDIAN RELATIONSHIP` | — | `ND` | `V` lectura | `V` lectura | `C` info mínima | `ND` | `V/E` | `V` propia |
| `CHILD INFO` | — | `ND` | — | — | — | — | `C` | **`V` por flag** |
| `MESSAGE BODY` | — | `ND` | `C` participante | `C` | `C` | **—** | **—** | **—** |
| `AUDIT DETAILS` | — | `ND` | — | — | — | — | `V` redactado | **—** |
| `AUDIT EDIT/DELETE` | — | — | — | — | — | — | **—** | — |
| **OTRO MENOR** | — | — | — | — | — | — | `C` | **— (Nunca)** |

`ND` = ningún REQ lo concede; se comporta como `NONE`. **No se registró ninguna concesión por
ausencia de definición.**

## 10.3 Las tres reglas `Nunca` de PT §6

1. `ADMIN` **no** lee chats privados por ser `ADMIN` — `REQ-COM-012` AC 1
2. `CAPTAIN` **no** ve `DNI` por pertenecer al `Team` — `REQ-PPL-011` AC 1
3. `Guardian` **no** ve información de otros menores — `REQ-PPL-008` AC 4

## 10.4 Lecturas clave

| Pregunta | Respuesta |
|---|---|
| ¿El guardián ve el teléfono del menor? | **No.** PT §6 v1.0.1; `CON-08` |
| ¿La capitana ve el `DNI` de su equipo? | **No.** Regla `Nunca` |
| ¿La capitana ve el teléfono de su equipo? | **Sí**, con necesidad operativa |
| ¿El entrenador ve el motivo de la habilitación? | **No.** `REQ-PRT-017` AC |
| ¿El guardián ve el estado de habilitación? | **No.** No está en la lista de PT §6 |
| ¿`ACT-ADMIN` puede editar la auditoría? | **No.** `REQ-INS-010`: sólo agregado |
| ¿Alguien ve contraseñas, hashes, tokens o cookies? | **No.** `REQ-SYS-020`; `REQ-INS-010` |

---

# 11. GENERALIZACIONES

## 11.1 Adoptadas (6)

| Child | Parent | Evidencia |
|---|---|---|
| `ACT-PLAYER` | `ACT-AUTHENTICATED` | `REQ-IAM-005`, `REQ-IAM-010`, `REQ-PPL-016`; PT §5 fila 1 |
| `ACT-CAPTAIN` | `ACT-AUTHENTICATED` | Ídem |
| `ACT-COACH` | `ACT-AUTHENTICATED` | Ídem |
| `ACT-SUBCOMMITTEE` | `ACT-AUTHENTICATED` | Ídem |
| `ACT-ADMIN` | `ACT-AUTHENTICATED` | Ídem |
| `ACT-GUARDIAN` | `ACT-AUTHENTICATED` | `REQ-PPL-009` AC 3 (contacto propio); `REQ-PPL-016` AC 4–5 |

Todas cumplen el test de substitutabilidad: el child puede participar en **todos** los casos de
uso del parent — editar contacto y contraseña propios, gestionar sesiones, ver el perfil propio
— en los mismos términos conceptuales. PT §5 fila 1 concede esa capacidad a los cinco roles por
igual.

---

# 12. NO GENERALIZACIONES

## 12.1 Rechazadas (16)

| Child | Parent | Motivo del rechazo |
|---|---|---|
| `ACT-CAPTAIN` | `ACT-PLAYER` | Aplanaría `ROL → capacidades`. PT §5 trata `PLAYER` como conjuncto aditivo, no supertipo (§7.4) |
| `ACT-CAPTAIN` | `ACT-COACH` | Prohibido por PT §5: *"CAPTAIN no hereda poder de Coach"* |
| `ACT-GUARDIAN` | `ACT-PLAYER` | Sin `PLAYER` no responde disponibilidad propia; sin scope `TEAM`; sin entitlement comunicacional |
| `ACT-GUARDIAN` | `ACT-COACH` | Ninguna autoridad deportiva |
| `ACT-GUARDIAN` | `ACT-ADMIN` | `ACT-GUARDIAN` no gestiona; `REQ-PPL-008` AC 3 |
| `ACT-GUARDIAN` | `ACT-SUBCOMMITTEE` | Sin anuncio oficial, sin habilitación, sin competencias |
| `ACT-ADMIN` | `ACT-SUBCOMMITTEE` | `ADMIN` no publica comunicados ni administra competencias |
| `ACT-ADMIN` | `ACT-COACH` | `ADMIN` no crea eventos ni gestiona convocatoria |
| `ACT-SUBCOMMITTEE` | `ACT-COACH` | PT §5: *"SUBCOMMITTEE no equivale a Coach"* |
| `ACT-COACH` | `ACT-PLAYER` | `COACH` sin `PLAYER` no responde su propia disponibilidad |
| `ACT-SUBCOMMITTEE` | `ACT-PLAYER` | Ídem |
| `ACT-ADMIN` | `ACT-PLAYER` | Ídem |
| `ACT-AUTHENTICATED` | `ACT-UNAUTHENTICATED` | `ACT-UNAUTHENTICATED` no tiene sesión para cerrar ni perfil |
| `ACT-PLAYER` | `ACT-UNAUTHENTICATED` | No hay sesión |
| `ACT-GUARDIAN` | `ACT-AUTHENTICATED` como relación de *poder* | La jerarquía es de capacidades propias, no de concesiones de autoridad |
| cualquiera | `System` | `System` no es actor |

## 12.2 Nota sobre la jerarquía de `ACT-AUTHENTICATED`

La generalización hacia `ACT-AUTHENTICATED` es de **capacidades propias** (contacto, contraseña,
sesiones, perfil), **no** de autoridad de dominio. Por eso el abstracto no concede acceso a la
aplicación (§4.2).

---

# 13. COEXISTENCIA DE ACTORES

| Actor A | Actor B | Relación | Semántica |
|---|---|---|---|
| `ACT-PLAYER` | `ACT-CAPTAIN` | `COEXISTENCE` con invariante | Siempre juntos sobre el mismo equipo (§7.5) |
| `ACT-COACH` | `ACT-PLAYER` | `COEXISTENCE` | Un entrenador puede ser jugadora de su propio equipo |
| `ACT-SUBCOMMITTEE` | `ACT-PLAYER` | `COEXISTENCE` | Ídem |
| `ACT-ADMIN` | `ACT-PLAYER` | `COEXISTENCE` | Ídem |
| `ACT-GUARDIAN` | cualquiera de rol | `COEXISTENCE` | Fuente separada; no otorga ni quita roles |
| `ACT-ADMIN` | `ACT-COACH` | `COEXISTENCE` | Dos bundles con alcances distintos |
| `ACT-SUBCOMMITTEE` | `ACT-ADMIN` | `COEXISTENCE` | La separación de `REQ-STR-009` sigue vigente |
| `ACT-ADMIN` | `ACT-GUARDIAN` | `DELEGATION RELATION` | `ACT-ADMIN` crea y finaliza la `GuardianRelationship`; `ACT-GUARDIAN` la usa |

`COEXISTENCE` **no** es herencia. No crea un actor combinado. No implica exclusión.

---

# 14. LÍMITES POR ACTOR

## 14.1 `ACT-ADMIN` NO implica

> **`ACT-ADMIN` NO implica `ACT-COACH`.**
> **`ACT-ADMIN` NO implica `ACT-CAPTAIN`.**
> **`ACT-ADMIN` NO implica `ACT-PLAYER`.**
> **`ACT-ADMIN` NO implica autoridad deportiva de ningún tipo.**

Si una acción deportiva requiere `COACH`, un `ADMIN` necesita **además** un `RoleAssignment
COACH` vigente con su alcance propio. No existe `SUPERUSER`.

| `ACT-ADMIN` no puede | Evidencia |
|---|---|
| Crear o editar entrenamientos, partidos o eventos de club | `REQ-EVT-002` AC: *"Admin sin autoridad ⇒ denegado"*; `REQ-EVT-003`; `REQ-EVT-004` |
| Posponer, reprogramar o cancelar partidos | PT §5 |
| Publicar o corregir comunicados oficiales | `REQ-COM-001`; `REQ-COM-004` |
| Preparar o publicar convocatoria | `REQ-PRT-005`…`REQ-PRT-008` |
| Abrir, registrar, cerrar o corregir asistencia | `REQ-PRT-009`; `REQ-PRT-011`; `REQ-PRT-012` |
| Registrar o corregir el resultado | `REQ-PRT-013`; `REQ-PRT-014` |
| Ver estadísticas de partido | `REQ-PRT-016` |
| Ver informes de asistencia o rendimiento | `REQ-INS-004` AC: *"el acceso es denegado"*; NOTES: *"No es un defecto"* |
| Mantener la selección | PT §5 |
| Leer conversaciones privadas | `REQ-COM-012` AC 1 |
| Responder su propia disponibilidad sin `PLAYER` | PT §5; `REQ-PRT-001` AC 3 |

## 14.2 `ACT-COACH` — autoridad deportiva, no administrativa

No gestiona personas, cuentas, membresías, roles, estructura, competencias ni auditoría. No
publica comunicados oficiales. No ve `ELIGIBILITY REASON` ni `ORIGIN`. No ve `DNI` ni `DOB`. No
administra ningún otro equipo fuera de su scope.

## 14.3 `ACT-SUBCOMMITTEE` — no es "semi `ADMIN`"

No administra estructura (`REQ-STR-009`), ni personas, cuentas o accesos, ni convocatoria,
asistencia, resultado, estadísticas ni auditoría. No ve `DNI`, `DOB` ni `CONTACT` de terceros.

## 14.4 `ACT-PLAYER` — no es "cualquier miembro"

`TeamAssignment` por sí sola no lo produce. Un `RoleAssignment PLAYER` expirada no lo produce. No
ve `DNI`, `DOB` ni `ELIGIBILITY REASON` de terceros.

## 14.5 `ACT-CAPTAIN` — sólo logística propia

No crea eventos ni partidos. No gestiona convocatoria, asistencia, resultado ni estadísticas. No
actualiza logística fuera de su equipo. No ve `DNI`. No tiene ninguna autoridad de `COACH`.

## 14.6 `ACT-GUARDIAN` — sólo lo delegado

Sin roles, sin `Membership`, sin comunicación, sin auditoría, sin `DNI` ni `DOB` del menor, sin
`ELIGIBILITY` del menor, sin acceso a otros menores.

## 14.7 Límites por estado de objeto

La autoridad tiene seis conjunctos; cinco son del actor y uno es el **estado del objeto**. Una
tabla completa de límites por estado está en
`docs/actors/GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1.md` §6. Casos canónicos:

| Actor | Objeto | Estado | Efecto | Evidencia |
|---|---|---|---|---|
| `ACT-PLAYER` | `Event` | `POSTPONED` | Conserva respuestas; no acepta nuevas | `REQ-PRT-004` |
| `ACT-COACH` | `Attendance` | `CLOSED` | No admite marcaje nuevo sin corrección auditada | `REQ-PRT-011` |
| `ACT-COACH` | `MatchRecord` | `FINAL` | No se edita por la vía normal | `REQ-PRT-013` |
| `ACT-ADMIN` | conjunto de `ADMIN` | quedaría en 0 | `LAST_ADMIN_REQUIRED` | `REQ-IAM-013`; `CON-20` |
| `ACT-SUBCOMMITTEE` | `Announcement` | `PUBLISHED` | La audiencia es snapshot inmutable | `REQ-COM-003` |
| `ACT-SUBCOMMITTEE` | estructura | — | Denegado con explicación | `REQ-STR-009` |
| `ACT-GUARDIAN` | `GuardianRelationship` | finalizada | Deja de conceder acceso | `REQ-PPL-008` AC 3 |
| todos | `Account` | `PENDING`/`DISABLED` | Acceso rechazado | `REQ-IAM-001` AC 3 |
| todos de rol | `RoleAssignment` | expirada | No computa | `REQ-PPL-006` |

---

# 15. ÍNDICE DE ACTORES

| ID | Nombre | KIND | Abstract | Authority source | Scope | Generalización | Coexistencia |
|---|---|---|---|---|---|---|---|
| `ACT-UNAUTHENTICATED` | Persona no autenticada | `HUMAN_ROLE` | NO | ninguna | `SELF` | ninguna | — |
| `ACT-AUTHENTICATED` | Persona autenticada | `ABSTRACT_ACTOR` | **YES** | `Account` + sesión | `SELF` | ninguna (es el padre) | — |
| `ACT-PLAYER` | Jugadora | `HUMAN_ROLE` | NO | `RoleAssignment PLAYER` | `SELF`, `TEAM` | `ACT-AUTHENTICATED` | `CAPTAIN`, `COACH`, `SUBCOMMITTEE`, `ADMIN`, `GUARDIAN` |
| `ACT-CAPTAIN` | Capitana | `HUMAN_ROLE` | NO | `RoleAssignment CAPTAIN` | `SELF`, `TEAM` | `ACT-AUTHENTICATED` | `PLAYER` |
| `ACT-COACH` | Entrenador/a | `HUMAN_ROLE` | NO | `RoleAssignment COACH` | `SELF`, `TEAM`, `EVENT` | `ACT-AUTHENTICATED` | `PLAYER`, `ADMIN`, `GUARDIAN` |
| `ACT-SUBCOMMITTEE` | Subcomisión de hockey | `HUMAN_ROLE` | NO | `RoleAssignment SUBCOMMITTEE` | `SELF`, `TEAM_SET`, `CLUB` | `ACT-AUTHENTICATED` | `PLAYER`, `ADMIN`, `GUARDIAN` |
| `ACT-ADMIN` | Administración del club | `HUMAN_ROLE` | NO | `RoleAssignment ADMIN` | `SELF`, `CLUB` | `ACT-AUTHENTICATED` | `PLAYER`, `COACH`, `SUBCOMMITTEE`, `GUARDIAN` |
| `ACT-GUARDIAN` | Responsable / guardian | `DELEGATED_HUMAN` | NO | `GuardianRelationship` | `SELF`, `CHILD` | `ACT-AUTHENTICATED` | los 5 de rol |

---

# 16. RESUMEN DE COBERTURA Y RESULTADO DEL GATE

## 16.1 Cobertura de requerimientos

| Métrica | Valor |
|---|---:|
| REQ IN totales | **157** |
| Funcionales IN | **122** |
| No funcionales IN | 35 |
| Funcionales con actor primario (`MAPPED`) | **104** |
| Funcionales `SYSTEM_INTERNAL` | **18** |
| Funcionales `NOT_APPLICABLE` | 0 |
| Funcionales `AMBIGUOUS` | **0** |
| Actores sin REQ que los justifique | **0** |
| REQ sin actor | **0** |
| `MAPPED` con actor secundario | 98 |
| Feedbacks de calidad de requerimiento | 9 |
| Decisiones de actor abiertas | 2 (**0 bloqueantes**) |

## 16.2 Resultado del gate

| # | Criterio | Resultado |
|---:|---|---|
| 1 | 100 % de REQ funcionales IN revisados | **PASS** — 122/122 |
| 2 | 100 % de REQ IN con actor o clasificación explícita | **PASS** — 157/157 |
| 3 | 0 `AMBIGUOUS` | **PASS** |
| 4 | 0 actores sin REQ | **PASS** — 8/8 |
| 5 | 0 actores derivados sólo del frontend | **PASS** |
| 6 | 0 confusión `Person = Actor` | **PASS** |
| 7 | 0 confusión `Account = Actor` | **PASS** |
| 8 | 0 confusión `RoleAssignment = Actor` | **PASS** |
| 9 | 0 confusión `Guardian = RoleAssignment` | **PASS** |
| 10 | 0 generalizaciones sin substitutabilidad | **PASS** — 6 adoptadas, 16 rechazadas |
| 11 | 0 actores combinatorios | **PASS** |
| 12 | `CAPTAIN` resuelto | **PASS** — actor independiente |
| 13 | `Guardian` resuelto | **PASS** — `DELEGATED_HUMAN` |
| 14 | Multi-rol resuelto | **PASS** — `COEXISTENCE` |
| 15 | `ADMIN ≠ god mode` explícito | **PASS** |
| 16 | PII boundaries identificadas | **PASS** |
| 17 | Scope principles definidos | **PASS** |
| 18 | Authority source por actor definida | **PASS** |
| 19 | 0 decisiones de actor bloqueantes | **PASS** — 2 abiertas, 0 bloqueantes |
| 20 | Cobertura calculada | **PASS** |
| 21 | Escenarios de estrés PASS | **PASS** — 14/14 |

## 16.3 Resultado por tarea

```
E2-01  DERIVAR CANDIDATOS DE ACTOR           PASS
E2-02  DEFINICIÓN DE ACTORES                 PASS
E2-03  RELACIONES ENTRE ACTORES              PASS
E2-04  MATRIZ ACTOR ↔ REQUERIMIENTO          PASS
E2-05  REVISIÓN FINAL DE GATE                PASS

ACTOR MODEL FREEZE V1                         PASS
```

## 16.4 Limitaciones declaradas

1. **`WORKBOOK_UPDATE_BLOCKED`.** El workbook
   `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` no existe en el repo, ni en
   `Downloads`, ni en `Desktop`, ni en `Documents`, ni en `OneDrive`. No se creó un sustituto ni
   se inventó otro XLSX.
2. **La implementación actual no cumple este modelo.** 0 actores `CURRENT ALIGNED`, 4 `PARTIAL`,
   3 `CONTRADICTORY`, 1 `NOT IMPLEMENTED`; 13 `ACTOR_UI_FINDING`. Es evidencia de brecha. **No se
   corrigió `src/**`.**
3. **Dos decisiones de E1 siguen abiertas y no se resolvieron:**
   `REQ-DECISION-NEEDED-01` y `REQ-DECISION-NEEDED-02`. Verificadas: la primera afecta ciclos de
   vida de estructura, no la identidad de los actores; la segunda afecta criterios de aceptación,
   no actores.
4. **Dos decisiones de actor abiertas, 0 bloqueantes:** `ACTOR-DECISION-01`,
   `ACTOR-DECISION-02`. E2 congela valores conservadores.
5. **Nueve feedbacks de calidad de requerimiento**, incluido `ACTOR-FEEDBACK-09`: el Freeze §3.1 y
   §11 declaran `SYS = 29` pero el dominio contiene **27** IDs canónicos; la suma por dominios da
   159. El total 157 y los tipos 122/35 son correctos. **No se editó E1.**
6. **Un defecto adicional del catálogo:** `REQ-STR-007` tiene título y `STATEMENT` desalineados
   (título "Identidad de temporada por identificador", `STATEMENT` sobre zona horaria). No editado.
7. **Este freeze no diseña superficies, casos de uso, base de datos ni arquitectura.**

---

# 17. QUÉ ALIMENTA ESTE FREEZE

Este documento es la entrada de las etapas siguientes. No las reemplaza.

| Etapa | Qué recibe de este freeze | Qué NO debe tomar de aquí |
|---|---|---|
| **Etapa 3 — Casos de uso** | 8 actores canónicos con su authority source y scope; 104 REQ `MAPPED` con actor primario y secundario; 18 REQ `SYSTEM_INTERNAL` que **no** requieren actor; los límites por estado de objeto (§14.7); 2 decisiones abiertas que affectan CU de habilitación y de jornada. | No debe tratar `COEXISTENCE` como herencia. No debe crear un CU por actor combinatorio. No debe usar el invariante `PLAYER`+`CAPTAIN` como atajo de subtipo. No debe nombrar `UC-*` desde este documento: los nombres son de E3 |
| **Etapa 4 — Diagramas de estado** | Los límites por estado de objeto que involucran actores (§14.7). `REQ-DECISION-NEEDED-01` sigue abierta. | No debe inventar transiciones. El restore no está autorizado por PT §9/§19 |
| **Etapa 5 — Diagramas de actividad** | Los criterios de aceptación de los 157 REQ, con el actor primario ya identificado. | No debe dibujar los flujos del prototipo |
| **Etapa 6 — Modelo de clases** | La distinción `Person` / `Account` / `Membership` / `TeamAssignment` / `RoleAssignment` / `GuardianRelationship` / `Actor` (§8.1). | No debe derivar clases de los actores ni del código |
| **Etapa 7 — Trazabilidad** | La columna que faltaba en E1: `REQ → Actor formal`. Está completa en `GEI_ACTOR_REQUIREMENT_MATRIX_V1.md`. | — |
| **Etapa 8 — Arquitectura de información** | Que `ACT-GUARDIAN` **no** tiene módulo ni destino propios (PT §20); que las proyecciones cambian con el menor seleccionado, no el actor. | No debe derivar destinos de actores. `IWR-03` es arnés de desarrollo |
| **Etapa 9 — Contratos de pantalla** | Los 13 `ACTOR_UI_FINDING` y las 8 filas de alineación CURRENT. `REQ-DECISION-NEEDED-02` sigue abierta. | No debe diseñar pantallas. No debe corregir `src/**` desde aquí |
| **Etapa 10 — Arquitectura y backend** | La fórmula de seis conjunctos, la regla default deny y la matriz de boundaries como modelo conceptual. | No debe elegir pila, base de datos, endpoints ni topología. **No debe tratar la boundary matrix como spec de permisos** |
| **Etapa 11 — Implementación** | Los 104 REQ `MAPPED` con actor, y los límites que cada comando debe respetar. | No debe implementar lo que está en `DEFER` u `OUT`. No debe reproducir la fusión `ADMIN`/`SUBCOMMITTEE` del CURRENT |

---

**Fin del Actor Model Freeze V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/actors/`.
