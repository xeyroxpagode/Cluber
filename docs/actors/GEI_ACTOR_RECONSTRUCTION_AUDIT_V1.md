# GEI HOCKEY MANAGEMENT SYSTEM
## ACTOR RECONSTRUCTION AUDIT V1

**Etapa:** 2 — Modelo de Actores
**Estado:** COMPLETE · **Fecha:** 2026-10-05
**Rama:** `gei/e2-actor-model-freeze-v1`
**Baseline:** `29b923f3cb01cf4b425fd6928d210799b9a4bbec` (`gei/e1-requirements-freeze-v1`)
**Documento de proceso.** La verdad de E2 vive en `GEI_ACTOR_MODEL_FREEZE_V1.md`.

---

# 1. EXECUTIVE SUMMARY

E2 deriva **8 actores canónicos** de los **157 requerimientos IN** del Requirements Freeze V1.
No hay actores derivados del frontend. No hay actores combinatorios. No hay sistemas externos.

| Resultado | Valor |
|---|---:|
| Candidatos de actor evaluados | 24 |
| Candidatos canónicos | 8 |
| Candidatos alias / absorbidos | 6 |
| Candidatos `NOT_ACTOR` | 10 |
| Actores abstractos | 1 |
| Actores de rol humano | 6 |
| Actores humanos delegados | 1 |
| Actores de sistema externo | **0** |
| Requerimientos funcionales IN | 122 |
| Funcionales con actor primario | 104 |
| Funcionales `SYSTEM_INTERNAL` | 18 |
| Funcionales `AMBIGUOUS` | **0** |
| Actores sin requerimiento que los justifique | **0** |
| Feedback de calidad de requerimiento | 9 |
| Decisiones de actor abiertas | 2 (**0 bloqueantes**) |
| Escenarios de estrés A–N | 14/14 PASS |

**Las cuatro decisiones que E2 tenía que tomar:**

1. **`CAPTAIN` → actor canónico independiente** (`ACT-CAPTAIN`), sin generalizar. Es la única
   acción con autoridad propia que no deriva de `COACH` (logística, `TEAM` scope,
   `REQ-EVT-019`). Se rechaza `CAPTAIN extends PLAYER` y se rechaza `CAPTAIN extends COACH`.
2. **`GUARDIAN` → actor canónico `DELEGATED_HUMAN`** (`ACT-GUARDIAN`), fuente de autoridad
   `GuardianRelationship`, scope por menor, **no** es `RoleAssignment` y no otorga rol deportivo.
3. **Multi-rol → `COEXISTENCE`, nunca `GENERALIZATION`.** La autoridad efectiva se evalúa por
   conjunción de fuentes vigentes; no existe el actor "combinado".
4. **`ADMIN` ≠ superusuario.** Sin autoridad deportiva. Explícitamente sin `COACH`, `CAPTAIN`,
   `PLAYER` ni poder de convocatoria, asistencia, resultado ni comunicados.

---

# 2. INPUTS Y AUTORIDAD

## 2.1 Jerarquía aplicada

| Orden | Fuente | Rol en E2 |
|---:|---|---|
| 1 | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` | **Autoridad funcional.** 157 REQ IN,Formula de autoridad §7.1, alcances §7.2, PII §7.3. |
| 2 | `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | **Autoridad de semántica de actor.** §1.2 actores originales, §5 Roles + Authority Matrix, §6 PII Field Authority, §9 lifecycles, §17 People semantics, §20 Guardian experience. El Freeze §1 declara que PT manda ante contradicción. |
| 3 | `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` | 157 bloques con `STATEMENT`, `TYPE`, `PRELIMINARY ACTOR`, `SOURCE(S)`, `ACCEPTANCE CRITERIA`. |
| 4 | `docs/requirements/GEI_REQUIREMENTS_RECONSTRUCTION_AUDIT_V1.md` | Evidencia, 23 contradicciones resueltas, reglas R1–R4 de desempate. |
| 5 | `docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md` | `REQ-DECISION-NEEDED-01/02`. No bloquean E2. |
| 6 | `src/**` | **Evidencia secundaria.** Sólo para detectar conflación de actores (§15). No decide. |

## 2.2 Decisiones vigentes verificadas (no asumidas)

Cada decisión del brief §6 fue verificada contra una cita concreta antes de usarse.

| Decisión del brief | Verificación documental | Estado |
|---|---|---|
| Guardian es relación/delegación | PT §20 `Guardian remains GuardianRelationship + delegation`; PT §5 `Guardian no es Role`; `REQ-PPL-008`, `REQ-PPL-012` | **CONFIRMADA** |
| Guardian NO es RoleAssignment | PT §5; Freeze §7.2 `Guardián \| No es rol`; `REQ-PPL-012` AC `no tiene roles deportivos` | **CONFIRMADA** |
| Guardian SÍ puede ser actor UML | `REQ-PPL-008` PRELIM `Admin (gestiona) · Guardian (usa)`; `REQ-PPL-009`; `REQ-PRT-002` | **CONFIRMADA** |
| Guardian puede tener múltiples menores | PT §20 `more than one associated minor is possible`; `REQ-PPL-008` PRECOND; Freeze §4.2 | **CONFIRMADA** |
| Permisos delegados incluyen `can_view_child_info` y `can_respond_availability` | PT §20; PT §26 `guardian_relationships`; `REQ-PPL-008`, `REQ-PRT-002` PRECOND | **CONFIRMADA** |
| Scope de Guardian es por relación/menor | PT §20 `the relationship is individual per minor`; `REQ-PPL-008` PRECOND | **CONFIRMADA** |
| Guardian no obtiene PII completo por defecto | PT §6 `Guardian PII`; `REQ-PPL-009`; `CON-08` resuelta por PT v1.0.1 | **CONFIRMADA** |
| Person ≠ Account | `REQ-PPL-003` `una persona, una cuenta como máximo`; PT §25 `people - 6` vs `accounts` | **CONFIRMADA** |
| Account ≠ Membership | PT §17 `Guardian puede existir sin Membership deportivo`; `REQ-IAM-003` | **CONFIRMADA** |
| Membership ≠ TeamAssignment | `REQ-PPL-005` `período propio, distinto de la membresía y de los roles`; PT §17 | **CONFIRMADA** |
| TeamAssignment ≠ RoleAssignment | PT §17 `Coach usa RoleAssignment`; `REQ-PPL-005` | **CONFIRMADA** |
| Pueden coexistir múltiples roles | PT §5 `Multi-role = unión de assignments vigentes`; `REQ-PPL-006` `varios roles vigentes ⇒ unión` | **CONFIRMADA** |
| ADMIN no es god mode | PT §5 `ADMIN no es superusuario deportivo`; Freeze §2.3.1; `REQ-INS-004` AC deniega Admin | **CONFIRMADA** |
| ADMIN no obtiene autoridad deportiva por ser ADMIN | PT §5 matriz (todas las filas deportivas `—` para ADMIN) | **CONFIRMADA** |
| CAPTAIN tiene authority propia en Logística | PT §5 fila `Logistics \| — \| Team scope \| …`; `REQ-EVT-019` NOTES | **CONFIRMADA** |
| CAPTAIN no se hereda de COACH | PT §5 regla `CAPTAIN no hereda poder de Coach` | **CONFIRMADA** |
| SUBCOMMITTEE tiene authority específica | PT §5 matriz (estructura `—`, comunicación oficial `✓`, elegibilidad `✓`, competencias `✓`) | **CONFIRMADA** |
| PII funciona con authority por campo | PT §6; `REQ-PPL-011`; Freeze §7.3 | **CONFIRMADA** |
| Eligibility details con visibilidad limitada | PT §6; `REQ-PRT-017` AC `entrenador ve estado, no motivo ni origen`; `REQ-CMP-008` | **CONFIRMADA** |
| Username immutable | `REQ-IAM-014`; `REQ-DECISION` n/a | **CONFIRMADA** |
| Disabled account afecta capacidad de interacción | `REQ-IAM-001` AC rechaza `PENDING`/`DISABLED`; `REQ-IAM-002` `desactivar revoca sesiones` | **CONFIRMADA** |
| Scope y vigencia importan | PT §9 `[valid_from, valid_until)`; `REQ-PPL-006` `asignación expirada no computa` | **CONFIRMADA** |

**0 contradicciones nuevas.** Ninguna decisión vigente del brief §6 fue refutada por la evidencia.

## 2.3 Las dos decisiones abiertas de E1

| ID | ¿Bloquea E2? | Verificación del impacto real |
|---|---|---|
| `REQ-DECISION-NEEDED-01` restore de estructura archivada | **NO** | La decisión afecta **ciclos de vida de estructura** (`Division`, `Line`, `Team`, `Venue`), no la identidad de los actores. `ACT-ADMIN` ya es el actor de `REQ-STR-002/003/004/005/006` con alcance `CLUB`, tanto si el archivo es terminal como si es reversible. El actor que ejecutaría un `Restore` sería el mismo. **Se mantiene registrada y NO se resuelve.** |
| `REQ-DECISION-NEEDED-02` nivel de conformidad accessibility | **NO** | Afecta criterios de aceptación de `REQ-SYS-002/003/004/005`, no la identidad de los actores. `ACTOR-OPEN-DECISION-01` la referencia como factor común (`todos los actores con superficie`). **Se mantiene registrada y NO se resuelve.** |

---

# 3. MÉTODO

## 3.1 Procedimiento aplicado

```
1. Extraer los 157 bloques REQ del catálogo (verificado mecánicamente: 157 IDs únicos).
2. Para cada REQ, leer STATEMENT + PRELIMINARY ACTOR + SOURCE(S) + ACCEPTANCE CRITERIA.
3. Identificar INITIATOR · PARTICIPANT · BENEFICIARY · TARGET/SUBJECT.
4. Clasificar el initiator: humano externo / sistema interno / estado de entidad / beneficiario.
5. Derivar el actor canónico desde la capacidad, no desde el nombre de la fila.
6. Reconciliar candidatos equivalentes y absorber alias.
7. Someter cada generalización propuesta al test de substitutabilidad (§12).
8. Construir matrices de autoridad, scope y PII con default deny.
9. Mapear los 157 REQ a actor, con SYSTEM_INTERNAL donde no hay actor humano.
10. Verificar cobertura en ambas direcciones (REQ→actor y actor→REQ).
11. Reproducir el CURRENT (frontend + authority layer) sólo para detectar conflación.
12. Estresar con 14 escenarios composed de personas reales.
```

## 3.2 Criterio de admisión de un actor

Un actor entra al catálogo sólo si cumple **las cuatro** condiciones:

| # | Condición | Verificación |
|---:|---|---|
| 1 | Existe fuera del sistema | Persona o sistema externo; nunca una entidad interna ni un proceso del backend |
| 2 | Interactúa con GEI | Al menos un REQ IN lo nombra como iniciador, participante o receptor de un resultado |
| 3 | Persigue un objetivo o participa en una capacidad | La capacidad es nombrable sin referencia a una pantalla |
| 4 | Está respaldado por requirements | Existe al menos un `REQ-*` que lo exige; 0 actores sin REQ |

**Rechazados por construcción:** `INTERNAL_SYSTEM`, backend, frontend, worker, cron, base de
datos, outbox, `GEI` como actor de sí mismo, entidad de dominio (`Team`, `Event`, `Season`,
`Line`, `Venue`, `Conversation`, `Announcement`, `Competition`, `CompetitionEntry`,
`GuardianRelationship`, `RoleAssignment`), y superficie de UI.

## 3.3 Verificación mecánica del insumo

| Verificación | Resultado |
|---|---|
| Bloques `### REQ-*` en el catálogo | 157 |
| IDs duplicados | 0 |
| `TYPE` ausente | 0 |
| `PRELIMINARY ACTOR` ausente | 0 |
| `FUNCTIONAL` | 122 |
| `NON-FUNCTIONAL` | 35 |

> **Hallazgo de conteo registrado, no corregido.** El Freeze §3.1 y §11 y el catálogo §1.2 declaran
> `SYS = 29`, pero el dominio `SYS` contiene **27** IDs canónicos (`REQ-SYS-001 … REQ-SYS-027`).
> La suma por dominios del propio Freeze da `20+16+13+24+19+18+8+12+29 = 159`, no 157. El total
> real de 157 y los tipos (122/35) **sí** son correctos. Registrado como `ACTOR-FEEDBACK-09`.
> **No se editó el Freeze.** No bloquea E2 porque el conjunto canónico es inequívoco.

---

# 4. EXTRACCIÓN DE CANDIDATOS (E2-01)

## 4.1 Cobertura de la extracción

| Métrica | Valor |
|---|---:|
| REQ IN analizados para initiator/participant/beneficiary/target | **157 / 157 (100 %)** |
| REQ funcionales IN analizados | **122 / 122 (100 %)** |
| REQ no funcionales IN registrados como affected-actors | 35 / 35 |

**Gate E2-01: PASS.**

## 4.2 Candidatos brutos, con su evidencia

Los candidatos se enumeraron **desde las 157 filas**, no desde el frontend. La columna
"REQs que lo sugieren" cuenta ocurrencias de la fila como initiator o participant.

| TEMP ID | Nombre candidato | Tipo tentativo | REQs que lo sugieren | Objetivo | Authority source aparente | Scope aparente | Observación |
|---|---|---|---|---|---|---|---|
| `CAND-01` | `Authenticated user` | ABSTRACT_ACTOR | 24 REQ | Ver y editar lo propio; gestionar seguridad y sesión | Sesión válida | `SELF` | Aparece como initiator de proyecciones; hay que separar lo propio de lo proyectado |
| `CAND-02` | `Admin` | HUMAN_ROLE | 33 REQ | Identidad, cuentas, estructura, competencias, habilitación, auditoría | `RoleAssignment ADMIN` | `CLUB` | Es el actor con más REQ; ninguna authority deportiva |
| `CAND-03` | `Subcommittee` | HUMAN_ROLE | 24 REQ | Comunicación oficial, competencias, habilitación, eventos de club | `RoleAssignment SUBCOMMITTEE` | `CLUB` | No administra estructura ni cuentas |
| `CAND-04` | `Coach` | HUMAN_ROLE | 34 REQ | Eventos, convocatoria, asistencia, resultado, estadísticas | `RoleAssignment COACH` | `TEAM` / `EVENT` | Alcance dual; nunca `CLUB` |
| `CAND-05` | `Player` | HUMAN_ROLE | 8 REQ | Responder disponibilidad propia; informes propios | `RoleAssignment PLAYER` | `TEAM` | No es "cualquier miembro" |
| `CAND-06` | `Captain` | HUMAN_ROLE | 2 REQ | Logística del equipo; informes de equipo "si corresponde" | `RoleAssignment CAPTAIN` | `TEAM` | Authority propia; sujeto de decisión crítica |
| `CAND-07` | `Guardian / delegated adult` | DELEGATED_HUMAN | 9 REQ | Ver permitted del menor; responder su disponibilidad | `GuardianRelationship` | `CHILD` | No es rol |
| `CAND-08` | `Player (menor)` | HUMAN_ROLE | 1 REQ | Ver quiénthird-party accede sobre su cuenta | Cuenta propia + relación activa | `SELF` | specializing de `CAND-05`, no actor nuevo |
| `CAND-09` | `Club member` | HUMAN_ROLE? | 2 REQ | Emitir/consumir; organización de privacidad | n/d | n/d | Vocabulariomixto; ver reconciliación |
| `CAND-10` | `System` | (proceso interno) | 38 REQ | Derivar, aplicar reglas, notificar, auditar | — | — | **No actor** |
| `CAND-11` | Persona que consume el código de activación | ABSTRACT_ACTOR | 1 REQ | Activar su cuenta sin sesión | Código de un solo uso | `SELF` | Pre-sesión; se fusiona con `CAND-12` |
| `CAND-12` | Persona que intenta autenticarse | ABSTRACT_ACTOR | 1 REQ | Obtener sesión | Credencial establecida | `SELF` | Pre-sesión |
| `CAND-13` | `Team` | (entidad) | 0 como initiator | — | — | — | Sujeto |
| `CAND-14` | `Event` | (entidad) | 0 | — | — | — | Sujeto |
| `CAND-15` | `Announcement` | (entidad) | 0 | — | — | — | Sujeto |
| `CAND-16` | `Conversation` | (entidad) | 0 | — | — | — | Sujeto |
| `CAND-17` | `Season / Division / Line / Venue` | (entidades) | 0 | — | — | — | Sujetos |
| `CAND-18` | `Competition / CompetitionEntry` | (entidades) | 0 | — | — | — | Sujetos |
| `CAND-19` | `GuardianRelationship` | (entidad) | 0 | — | — | — | **Fuente** de autoridad, no actor |
| `CAND-20` | `RoleAssignment` | (entidad) | 0 | — | — | — | **Fuente** de autoridad, no actor |
| `CAND-21` | Backend / worker / cron / outbox | (proceso interno) | 0 | — | — | — | **No actor** |
| `CAND-22` | Proveedor de email / push / calendario | EXTERNAL_SYSTEM | 0 | — | — | — | **No actor**: `OUT-SYS-005`, `OUT-IAM-001` |
| `CAND-23` | Federación (integración automática) | EXTERNAL_SYSTEM | 0 | — | — | — | **No actor**: `OUT-CMP-003`; sólo referencia manual `REQ-CMP-006` |
| `CAND-24` | Responsable del tratamiento de datos | EXTERNAL_ORGANISATION | 1 REQ (`REQ-SYS-027`, `EXTERNAL`) | Cumplir la puerta externa de privacidad | n/d | n/d | **No actor**: opera fuera del sistema |

## 4.3 Lectura de los candidatos que más exigen criterio

### `CAND-05` Player — no es "cualquier miembro"

`REQ-PPL-005` separa la afiliación deportiva del rol. `REQ-PPL-007` crea afiliación **y** rol
`PLAYER` en una sola operación. `REQ-PRT-001` AC es explícito: *"un rol sin `PLAYER` vigente …
no puede hacerlo por ese rol"*. `PT §5` lo refuerza: `COACH`/`SUBCOMMITTEE`/`ADMIN` responden su
propia disponibilidad **"sólo si además PLAYER"**.

Por tanto `PLAYER` es un `RoleAssignment` con autoridad propia, no una etiqueta de pertenencia.
`TeamAssignment` por sí solo **no** crea actor.

### `CAND-10` System — no es actor

38 REQ lo nombran. Todas son reglas internas: derivación de estados, invariantes, integridad
referencial, política aplicada automáticamente. El propio Freeze §2.2 lo lista como
*"Proceso"*. El brief §8 prohíbe `INTERNAL_SYSTEM` como actor. GEI no es actor de sí mismo.

Cada una de esas 38 se clasifica `SYSTEM_INTERNAL` **sólo si** la regla no tiene un initiator
humano identificable; si lo tiene, el initiator humano es el actor primario y la regla interna
queda como condición. El detalle está en `GEI_ACTOR_REQUIREMENT_MATRIX_V1.md` §2–§10.

### `CAND-09` `Club member` — dos acepciones distintos

`REQ-IAM-003` lo usa para **consumir** el código de activación: es la persona con `Account PENDING`
y un código vigente, sin sesión. `REQ-SYS-027` lo usa para **la organización** que aplica la
privacidad fuera del sistema.

La primera es una capacidad real de una persona externa → se funde en `ACT-UNAUTHENTICATED`.
La segunda no interactúa con GEI: `REQ-SYS-027` es `EXTERNAL` por definición de estado
(catálogo §0.6) → `NOT_ACTOR`, y el REQ se marca `NOT_APPLICABLE`.

Separar el consumo del código como actor propio habría producido un actor definido por un
**estado de `Account`** (`PENDING`), que el brief §15 prohíbe. Se registra en §6.

---

# 5. LOG DE RECONCILIACIÓN

## 5.1 Clasificación de los 24 candidatos

| TEMP ID | Clasificación | Destino | Razón |
|---|---|---|---|
| `CAND-01` `Authenticated user` | **CANONICAL** | `ACT-AUTHENTICATED` | 24 REQ lo nombran; concentra capacidades actor-independientes |
| `CAND-02` `Admin` | **CANONICAL** | `ACT-ADMIN` | 33 REQ; fuente `RoleAssignment ADMIN` |
| `CAND-03` `Subcommittee` | **CANONICAL** | `ACT-SUBCOMMITTEE` | 24 REQ; `RoleAssignment SUBCOMMITTEE` |
| `CAND-04` `Coach` | **CANONICAL** | `ACT-COACH` | 34 REQ; `RoleAssignment COACH`, alcance dual |
| `CAND-05` `Player` | **CANONICAL** | `ACT-PLAYER` | `RoleAssignment PLAYER`; initiator de `REQ-PRT-001` |
| `CAND-06` `Captain` | **CANONICAL** | `ACT-CAPTAIN` | Authority propia en logística; §8 |
| `CAND-07` `Guardian` | **CANONICAL** | `ACT-GUARDIAN` | `GuardianRelationship`; 9 REQ |
| `CAND-12` autenticarse | **CANONICAL** | `ACT-UNAUTHENTICATED` | Initiator de `REQ-IAM-001`; sin él el REQ no tiene sujeto |
| `CAND-08` `Player (menor)` | **ALIAS** | `ACT-PLAYER` + nota | Especialización de condición, no capacidad nueva; el menor sigue siendo `PLAYER` |
| `CAND-11` consumir código | **ALIAS** | `ACT-UNAUTHENTICATED` | Unirlo evita crear un actor por estado de `Account` |
| `CAND-09a` `Club member` (consumo) | **ALIAS** | `ACT-UNAUTHENTICATED` | Misma capacidad pre-sesión que `CAND-12` |
| `CAND-09b` `Club member` (organización) | **ALIAS → NOT_ACTOR** | `REQ-SYS-027 NOT_APPLICABLE` | `EXTERNAL`; no interactúa con GEI |
| `CAND-10` `System` | **NOT_ACTOR** | `SYSTEM_INTERNAL` | 38 REQ son reglas internas |
| `CAND-13`–`CAND-18` entidades | **NOT_ACTOR** | — | Sujetos/targets |
| `CAND-19` `GuardianRelationship` | **NOT_ACTOR** | — | **Fuente** de autoridad |
| `CAND-20` `RoleAssignment` | **NOT_ACTOR** | — | **Fuente** de autoridad |
| `CAND-21` backend/worker/cron | **NOT_ACTOR** | — | Proceso interno; brief §8 |
| `CAND-22` email/push/calendario | **NOT_ACTOR** | — | `OUT-SYS-005`, `OUT-IAM-001` |
| `CAND-23` federación automática | **NOT_ACTOR** | — | `OUT-CMP-003`; sólo referencia manual |
| `CAND-24` responsable de tratamiento | **NOT_ACTOR** | — | `REQ-SYS-027 EXTERNAL` |

## 5.2 Detección de Confusion / Fusión

| Tipo de confusión | Casos detectados | Resolución |
|---|---|---|
| `same actor / different wording` | `Player` / `Player (menor)` / "jugadora" / "menor"; `Guardian` / "Guardián" / "responsable" / `Club member` (consumo) | Un actor canónico cada uno; variantes registradas como alias |
| `role vs capability confusion` | `Admin` (rol) usado como si significara "puede administrar todo"; `Coach` (rol) como si fuera synonymous de "gestiona el club" | `ACT-ADMIN` y `ACT-COACH` con listas explícitas de concede y deniega |
| `domain role vs interaction actor` | `PLAYER` (rol de dominio) vs `ACT-PLAYER` (actor de interacción) | Un rol puede existir sin actor (`RoleAssignment` expirada). Un actor exige rol vigente |
| `subject mistaken as actor` | `Team`, `Event`, `Announcement`, `Conversation`, `Season`, `Venue`, `Competition` | `NOT_ACTOR`; aparecen como `Subject/Target` en la matriz |
| `beneficiary mistaken as actor` | "las personas alcanzadas", "la audiencia", "convocadas", "notificados", "el menor" | Beneficiarios, no actores; se registran en la columna `Beneficiary` |
| `technical system mistaken as actor` | `System`, backend, worker, cron, outbox, projections | `NOT_ACTOR`; las proyecciones son vistas, no actores |
| `authority source mistaken as actor` | `RoleAssignment`, `GuardianRelationship`, `Membership`, `TeamAssignment` | `NOT_ACTOR`; son fuentes de autoridad |
| `surface mistaken as actor` | "Calendar User", "Report User", "Profile User", "Team Manager", "Admin page" | Ninguno se creó; §14 |
| `actor derived only from frontend` | 0 | §14 |

## 5.3 Ausencia de actor externo

**0 actores de sistema externo.** Verificación por excluyentes:

| Integración externa mencionada | Veredicto |
|---|---|
| Ingreso con proveedor externo | `OUT-IAM-001` — excluido |
| MFA / passkeys | `OUT-IAM-002` — excluido |
| Notificaciones SMS/email/push | `OUT-SYS-005` — excluido |
| Integración automática con federación | `OUT-CMP-003` — excluido; sólo referencia manual `REQ-CMP-006` |
| Redis / WebSocket / microservicios | `OUT-SYS-003` — excluido |
| Recuperación self-service de contraseña | `OUT-IAM-003` — excluido |

Toda mención a un tercero es un dato o una referencia manual, no una interacción de sistema
externo. Por eso `EXTERNAL_SYSTEM` = 0.

---

# 6. HALLAZGOS `NOT_ACTOR`

| # | Candidato | Por qué NO es actor | Dónde queda registrado |
|---:|---|---|---|
| 1 | `System` | Deriva, aplica reglas, notifica y audita: es el motor de reglas, no una capacidad externa | `SYSTEM_INTERNAL` en 38 REQ |
| 2 | Backend / worker / cron / outbox | Ejecuta en el interior del sistema; el brief §8 lo prohíbe | No se registra como actor |
| 3 | Frontend / rutas / pantallas | Evidencia secundaria; el brief §10 prohíbe derivar actores de ahí | `ACTOR_UI_FINDING-*` en §15 |
| 4 | `Team` | Sujeto de `REQ-PPL-014`, `REQ-EVT-003`; nunca initiator | Columna `Subject/Target` |
| 5 | `Event` | Sujeto de 22 REQ de `EVT` | Columna `Subject/Target` |
| 6 | `Season`, `Division`, `Line`, `Venue` | Sujetos de `STR`; `Season` sin lifecycle (`CON-09`) | Columna `Subject/Target` |
| 7 | `Announcement` | Sujeto de `REQ-COM-001..005` | Columna `Subject/Target` |
| 8 | `Conversation` / `Message` | Sujetos de `REQ-COM-006..013`; el initiator es un participante humano | Columna `Subject/Target` |
| 9 | `Competition` / `CompetitionEntry` | Sujetos de `CMP` | Columna `Subject/Target` |
| 10 | `RoleAssignment` | Fuente de autoridad, no capacidad externa | §24 matriz de fuentes |
| 11 | `GuardianRelationship` | Fuente de autoridad, no capacidad externa | §24 matriz de fuentes |
| 12 | `Membership` / `TeamAssignment` | Sources de legitimidad, no actores | §30 |
| 13 | `Account` / `Person` | Entidades; sus **estados** no son actores (brief §15) | §30 |
| 14 | Responsable del tratamiento | `REQ-SYS-027` es `EXTERNAL`: opera fuera del sistema | `NOT_APPLICABLE` |
| 15 | championed "Calendar/Report/Profile User" | No existe REQ que exija una capacidaddistinctiva de esa superficie | No creado |

---

# 7. ROL DE DOMINIO vs ACTOR

## 7.1 La distinción, enunciada

| Nivel | Qué es | Ejemplo |
|---|---|---|
| `Person` | La persona real del club | Documents de una jugadora |
| `Account` | Credencial de acceso | `username`, `status` |
| `Membership` | Período de pertenencia interna | `[valid_from, valid_until)` |
| `TeamAssignment` | Afiliación deportiva a un equipo | Período propio |
| `RoleAssignment` | Atribución de rol con alcance y vigencia | `PLAYER/TEAM/t1` |
| `GuardianRelationship` | Delegación sobre un menor, con dos flags | `can_view_child_info`, `can_respond_availability` |
| **Actor** | Capacidad externa con la que alguien interactúa | `ACT-CAPTAIN` |

## 7.2 Reglas de derivación

1. Un `RoleAssignment` **vigente** produce un actor. Un `RoleAssignment` expirada no.
2. Un actor de rol **exige** `Membership` vigente (`REQ-PPL-004`).
3. `TeamAssignment` **no** produce actor por sí solo (`REQ-PPL-005`).
4. `ACT-GUARDIAN` **no** requiere `RoleAssignment` ni `Membership` (PT §17, PT §20).
5. `Person` puede existir sin `Account` (`REQ-PPL-003` "como máximo").
6. Una `Person` puede satisfacer **varios** actores a la vez; no hay actor combinado.

## 7.3 `RoleAssignment` y `Actor` no son lo mismo

`ACT-PLAYER` requiere `RoleAssignment PLAYER` + `Membership` vigente. Pero `ACT-PLAYER` **no es**
el `RoleAssignment`: es la capacidad de interactuar que ese `RoleAssignment` habilita dentro de
un alcance y con un estado de objeto concreto. La fórmula del Freeze §7.1 tiene seis conjunctos;
el `RoleAssignment` es sólo uno.

---

# 8. ANÁLISIS DE `CAPTAIN`

Esta es la decisión crítica de E2. El Freeze §13 la marca como ambigüedad explícita:
*"`CAPTAIN` tiene autoridad propia en logística que no deriva de `COACH`; E2 debe decidir si eso
es una relación de actor o una capacidad aislada."*

## 8.1 Inventario completo de REQ donde aparece `CAPTAIN`

| REQ | Rol de `CAPTAIN` | Autoridad | Scope | Evidencia |
|---|---|---|---|---|
| `REQ-EVT-019` Logística del evento | **INITIATOR** — actualiza la logística de un evento de su equipo |.Update | `TEAM` | PT §5 fila `Logistics`; AC *"una capitana de un equipo … la operación prospera según su alcance"*; NOTES *"PT §5 concede al CAPTAIN alcance de equipo en Logística; es una de las pocas acciones donde CAPTAIN tiene autoridad propia y no derivada de COACH"* |
| `REQ-COM-012` Derecho comunicacional | **PARTICIPANT** — accesorio comunicacional automático | Entitlement | n/a | PT §5 `Direct/Group messages \| ✓ \| ✓`; PT §20 `Automatic Communication entitlement: PLAYER, CAPTAIN, COACH` |
| `REQ-PPL-011` Autoridad por campo | **VIEWER** — ve teléfono/email de jugadoras de su equipo; **no** ve DNI | `VIEW` contacto | `TEAM` | PT §6 `teléfono/email: … COACH/CAPTAIN del Team actual`; AC *"ve su teléfono y email pero no su DNI"*; regla `Nunca`: *"CAPTAIN ve DNI por pertenecer al Team"* |
| `REQ-INS-004` Informe de asistencia | **VIEWER** — `Team si corresponde` | `VIEW` | `TEAM` | PT §5 fila `Attendance report` (`PLAYER: propio/autorizado; CAPTAIN: Team si corresponde`) |
| `REQ-INS-005` Informe de rendimiento | **VIEWER** — `Team si corresponde` | `VIEW` | `TEAM` | PT §5 fila `Performance report` (idéntica matriz) |
| `REQ-PPL-007` Transiciones de afiliación y rol | **AFECTADO** — no se transfiere al cambiar de equipo | — | `TEAM` | AC *"sin transferir `CAPTAIN`"*; `REQ-PPL-007` retirar *cierra afiliación, `PLAYER` y `CAPTAIN`* |
| `REQ-IAM-001` Iniciar sesión | **PARTICIPANT** — entra por su cuenta | — | — | Freeze §4.1 *"cualquiera con cuenta activa"* |

## 8.2 Las siete preguntas del brief §17

| Pregunta | Respuesta con evidencia |
|---|---|
| ¿Qué puede hacer `CAPTAIN` que `PLAYER` no puede? | **Actualizar la logística de un evento de su equipo** (`REQ-EVT-019`, PT §5 `Logistics: Team scope`). Eso es todo: es la única fila de la matriz donde `CAPTAIN` tiene `✓` y `PLAYER` tiene `—`. |
| ¿Qué comparte con `PLAYER`? | Contacto y contraseña propios; disponibilidad propia; accesorio comunicacional; informe de asistencia y de rendimiento **propios**; derecho a responder por menor **sólo si además es `Guardian`** (PT §5 fila `responder por menor` = `delegación` para los cinco roles). |
| ¿Qué comparte con `COACH`? | Sólo la logística. `COACH` tiene además creación de eventos, ciclo de vida, convocatoria, asistencia, resultado y estadísticas, y alcance `EVENT`. `CAPTAIN` no tiene ninguno de esos. |
| ¿Qué authority propia existe? | **Logística, `TEAM` scope.** Confirmado por PT §5, `REQ-EVT-019` NOTES y la AC de `REQ-PPL-011`. |
| ¿Logística? | **Sí**, y es la única. |
| ¿Scope `TEAM`? | **Sí.** Freeze §7.2 `CAPTAIN \| TEAM`; PT §5 `Role scopes válidos`. |
| ¿Puede actuar sin `COACH` role? | **Sí**, y es el punto: `REQ-EVT-019` AC lo dice sin mencionar `COACH`. PT §5: *"CAPTAIN no hereda poder de Coach"*. |
| ¿Requiere `TeamAssignment`? | **No como condición de autoridad.** La authority source es `RoleAssignment CAPTAIN`. En la práctica el dominio garantiza que exista también `PLAYER` (ver §8.4), pero la autoridad de logística no depende de `PLAYER`. |
| ¿`CAPTAIN` es especialización válida de otro actor? | **No.** Ver §8.3. |

## 8.3 Test de substitutabilidad para cada opción

### Opción B — `ACT-CAPTAIN` hijo de `ACT-PLAYER`

Obligaciones conceptuales del padre `ACT-PLAYER`:

| # | Obligación de `ACT-PLAYER` | ¿`ACT-CAPTAIN` puede cumplirla en los mismos términos? |
|---:|---|---|
| 1 | Responder la propia disponibilidad (`REQ-PRT-001`) | Sí, si conserva `PLAYER` vigente |
| 2 | Ver y editar su contacto y contraseña (PT §5 fila 1) | Sí |
| 3 | Ser participante de conversaciones (`REQ-COM-012`) | Sí |
| 4 | Ver su informe de asistencia propio (`REQ-INS-004`) | Sí |
| 5 | Ver su informe de rendimiento propio (`REQ-INS-005`) | Sí |
| 6 | Consultar calendario, inicio y evento en su scope `TEAM` (`REQ-EVT-020/021/023`) | Sí |
| 7 | Ser notificado de altas y bajas en convocatoria (`REQ-COM-015`) | Sí |
| 8 | Ver quiénthird-party accede sobre su cuenta (`REQ-PPL-010`) | Sí |

**El test de substitutabilidad se cumple 8/8.** Y sin embargo **E2 rechaza la opción B**. Razón:

La generalización en UML es una afirmación de que el hijo **hereda** las obligaciones del padre.
En GEI la autoridad no se hereda: se evalúa por conjunción (Freeze §7.1:
`ROL + ACCIÓN + ALCANCE + ESTADO DEL OBJETO + AUTORIDAD POR CAMPO + ORIGEN`, default deny). Si
`ACT-CAPTAIN` generaliza `ACT-PLAYER`, el modelo pasa a afirmar que "capitana ⊇ jugadora" como
hecho estructural, y entonces:

1. **Importaría el aplanamiento que el Freeze prohíbe.** Un rol con scope `TEAM` sería un
   subtipo de otro rol con scope `TEAM`. La matriz de PT §5 es una tabla de bundles de
   autoridad, no un árbol.
2. **Sería inconsistente con cómo PT trata `COACH`.** PT §5 dice que `COACH` responde su
   disponibilidad *"sólo si además `PLAYER`"*. Eso prueba que, en el modelo de GEI, `PLAYER` es
   un **conjuncto independiente y aditivo**, no un supertipo. Si `PLAYER` fuese padre de
   `CAPTAIN`, la misma fila de la matriz debería estar redactada al revés.
3. **Ocultaría el invariante real.** El dato estructural verdadeiro es que `CAPTAIN` se emite
   **siempre junto a** `PLAYER` (§8.4). Eso es un invariante de comando, no una relación de
   tipos. Modelarlo como herencia lo convierte en una suposición invisible en lugar de una regla
   explícita y auditable.
4. **Haría imposible modelar la co-ocurrencia asimétrica.** Un mismo `TEAM` y la misma persona:
   `PLAYER` y `CAPTAIN` son roles hermanos con bundles distintos sobre el mismo scope. La
   herencia dice "capitana **es** jugadora"; el dominio dice "capitana **actúa además** como
   jugadora".

**Veredicto:** `CAPTAIN extends PLAYER` → **REJECTED**.

### Opción C — `ACT-CAPTAIN` hijo de `ACT-COACH`

PT §5 lo prohíbe por texto: *"CAPTAIN no hereda poder de Coach"*. `REQ-EVT-019` existe
precisamente para marcar la excepción. Además `COACH` tiene alcance `EVENT`, `CAPTAIN` no. Y
`CAPTAIN` no puede crear eventos (`PT §5`: `crear Match` → `—` para `CAPTAIN`).

**Veredicto:** `CAPTAIN extends COACH` → **REJECTED** (prohibido por la autoridad).

### Opción D — capacidad contextual dentro de otro actor

Esto significaría que la logística no es un actor sino un modo de actuar "como `COACH` pero con
menos". Falla porque:

1. La **authority source es distinta**: `RoleAssignment CAPTAIN`, no `RoleAssignment COACH`.
2. La **acción es iniciable de forma independiente**: `REQ-EVT-019` la nombra como initiator de
   `CAPTAIN` sin la palabra `COACH`.
3. El **scope está declarado por separado** en Freeze §7.2 y en PT §5, y es `TEAM` en ambos
   casos — pero el bundle de autoridad dentro de ese scope es distinto.
4. Si fuera una capacidad contextual, no tendría fila propia en la matriz de PT §5. Tiene fila
   propia.

**Veredicto:** `CAPTAIN` como modo contextual → **REJECTED**.

### Opción A — actor canónico independiente

Declarado canónico, con `RoleAssignment CAPTAIN` como authority source, `TEAM` como único scope
válido, y `COEXISTENCE` declarada con `ACT-PLAYER`.

**Veredicto:** **ADOPTADA.**

## 8.4 Invariante de co-ocurrencia `PLAYER` + `CAPTAIN`

El modelo **no** asume que `CAPTAIN` sin `PLAYER` sea imposible. Lo registra:

| Fuente | Evidencia |
|---|---|
| PT §17 `AssignPlayerToTeam` | *"Atómico: TeamAssignment + PLAYER RoleAssignment"* |
| PT §17 `MovePlayerTeam` | *"end old PLAYER role; end CAPTAIN role si existía; create new PLAYER role"*, *"CAPTAIN no se transfiere automáticamente"* |
| PT §17 `EndPlayerTeam` | *"Termina: TeamAssignment; PLAYER role; CAPTAIN role si existía"* |
| `REQ-PPL-007` | *"Incorporar crea afiliación + rol `PLAYER` en una sola operación"*; *"sin transferir `CAPTAIN`"* |
| `src/mock/seed.ts:366-388` | El seed emite `PLAYER` y, si el rol es `CAPTAIN`, **además** `CAPTAIN` sobre el mismo `team` |
| `src/__tests__/domain-truth.test.tsx:261` | El test de verdad de dominio espera exactamente `["CAPTAIN","PLAYER"]` |

**Consecuencia modelada:** en V1 no existe comando que cree un `RoleAssignment CAPTAIN` sin un
`RoleAssignment PLAYER` vigente sobre el mismo equipo. `ACT-CAPTAIN` satisface por tanto también
las obligaciones de `ACT-PLAYER`. Eso se registra como **coexistencia con invariante**, no como
herencia, y se deja explícito para que E3 no la use como atajo.

## 8.5 Representación final de `CAPTAIN`

```
ACT-CAPTAIN
  KIND:            HUMAN_ROLE
  ABSTRACT:        NO
  AUTHORITY SOURCE: RoleAssignment CAPTAIN  (scope TEAM, vigencia [valid_from, valid_until))
  OWN AUTHORITY:   Logistics — TEAM scope (REQ-EVT-019)
  ALSO:            Team-scope VIEW de contacto de jugadoras del equipo (REQ-PPL-011)
                   Team-scope VIEW de informes de asistencia y rendimiento, "si corresponde"
                     (PT §5; REQ-INS-004, REQ-INS-005)
                   Entitlement comunicacional automático (REQ-COM-012)
                   Contacto y contraseña propios (PT §5 fila 1)
  COEXISTENCE:     ACT-PLAYER (con invariante: siempre junto a PLAYER sobre el mismo equipo)
  GENERALIZATIONS: ninguna
  RELATION TO ACT-COACH: NONE — PT §5 "CAPTAIN no hereda poder de Coach"
```

## 8.6 Impacto en los diagramas de casos de uso futuros

| Elemento | Impacto |
|---|---|
| `ACT-CAPTAIN` aparece como actor de primera clase | Sí, con `ACT-COACH` y `ACT-SUBCOMMITTEE` en el mismo caso de uso de logística |
| El caso de uso de logística tiene 3 actores, no 2 | `REQ-EVT-019` |

Un solo CU de logística con `COACH`, `CAPTAIN` y `SUBCOMMITTEE` como actores, cada uno con su
propio scope. No un CU "de logística del entrenador" del que la capitana sea caso especial.

## 8.7 Nota sobre `REQ-PRT-001` y la disponibilidad propia de `CAPTAIN`

PT §5 concede a `CAPTAIN` `✓` en *"responder propia Availability"*. `REQ-PRT-001` AC dice que un
rol sin `PLAYER` vigente no puede responder por sí mismo. Los dos textos no chocan de hecho
(por §8.4 `CAPTAIN` siempre viene con `PLAYER`), pero formalizan la misma capacidad por dos
caminos. Registrado como `ACTOR-FEEDBACK-02`, no bloqueante. **E2 no modifica el Freeze.**

---

# 9. ANÁLISIS DE `GUARDIAN`

## 9.1 Por qué merece análisis propio

`Guardian` es el único actor cuya autoridad **no** proviene de un `RoleAssignment`. Es el único
que puede tener múltiples instancias simultáneas con permisos distintos. Y es el único cuyo
scope es una relación, no un tipo de alcance.

## 9.2 Definición formal

```
ACT-GUARDIAN
  KIND:              DELEGATED_HUMAN
  ABSTRACT:          NO
  BUSINESS DEFINITION:
    Adulto con al menos una GuardianRelationship vigente sobre uno o más menores.
  WHY THIS ACTOR EXISTS:
    Que la disponibilidad y el contexto de una menor no dependan de que la menor
    tenga cuenta propia (REQ-PRT-002 GOAL), sin convertir al adulto en un rol
    deportivo (REQ-PPL-012 GOAL).
  AUTHORITY SOURCE:  GuardianRelationship  — NO RoleAssignment
  TYPICAL SCOPE:     CHILD — un childId por relación vigente
  ACCOUNT REQUIREMENT:  sí (REQ-IAM-012)
  MEMBERSHIP REQUIREMENT: NO — PT §17, PT §20, REQ-PPL-008 PRECONDITION
  ROLEASSIGNMENT REQUIREMENT: NO
```

## 9.3 Los dos permisos, independientes

| Permiso | granting REQ | Efecto |
|---|---|---|
| `can_view_child_info` | `REQ-PPL-008` AC 1; `REQ-PPL-009` | Ve nombre, apellido, equipo, eventos relevantes, disponibilidad relevante e información operativa necesaria |
| `can_respond_availability` | `REQ-PRT-002` | Registra la respuesta **a nombre del menor**; el equipo la ve como del menor |

Son **independientes**: `REQ-PPL-008` AC 1 exige que con permiso de ver y sin el de responder,
el guardián *ve el contexto y no puede responder, con el motivo visible*.

## 9.4 Boundary de PII del menor

| Dato del menor | `ACT-GUARDIAN` | Evidencia |
|---|---|---|
| Nombre y apellido | **VIEW** | PT §6; `REQ-PPL-009` AC 1 |
| Equipo | **VIEW** | Ídem |
| Eventos relevantes | **VIEW** | Ídem |
| Disponibilidad relevante | **VIEW** | Ídem |
| Información operativa necesaria | **VIEW** | PT §6 `necessary operational information` |
| DNI | **NONE** | PT §6 `Delegation does NOT grant: DNI`; `REQ-PPL-009` AC 1; regla `Nunca` |
| Fecha de nacimiento completa | **NONE** | Ídem |
| Información administrativa | **NONE** | Ídem |
| Motivo de habilitación | **NONE** | `REQ-PPL-009` AC 2 (`el acceso es denegado`) |
| Origen de habilitación | **NONE** | Ídem |
| Conversaciones privadas | **NONE** | `REQ-COM-012`; `REQ-PPL-012` AC 2 |
| Auditoría | **NONE** | PT §6 |
| Roles administrativos | **NONE** | PT §6 |
| Teléfono / email del menor | **NONE** por defecto | PT §6 v1.0.1; `CON-08` resuelta |
| **Datos de otro menor** | **NONE — nunca** | PT §6 regla `Nunca`: *"Guardian ve información de otros menores"* |

## 9.5 Lo que `ACT-GUARDIAN` no es

| No implica | Evidencia |
|---|---|
| `RoleAssignment` | PT §5 `Guardian no es Role`; Freeze §7.2 |
| Rol deportivo | `REQ-PPL-012` AC 1: *"no tiene roles deportivos ni acceso de gestión"* |
| Membership | PT §17 `Guardian puede existir sin Membership deportivo`; PT §20 |
| `TeamAssignment` | No la otorga; el equipo del menor es dato, no alcance propio |
| Accesor comunicacional | `REQ-COM-012`; `REQ-PPL-012` AC 2; PT §20 `Guardian no entra` |
| Autoridad de gestión | `REQ-PPL-012` AC 1 |
| PII completa del menor | §9.4 |
| Un destino `/guardian` | PT §20 `No "/guardian" main destination`; `REQ-PPL-008` NOTES |
| Un módulo propio | PT §20 `No "Guardian" module` |
| Exclusividad | §10 |

## 9.6 Proyecciones y selector de menor

| Comportamiento | Evidencia |
|---|---|
| Un solo menor → **sin selector innecesario** | `REQ-PPL-016` AC 4; PT §20 |
| Varios menores → conmutador contextual simple | `REQ-PPL-016` AC 5; PT §20 |
| El conmutador afecta Inicio, Calendario, Equipo y Disponibilidad | `REQ-PPL-016` AC 5; PT §20 |
| La gestión/consulta de la relación vive en el perfil, sección "Personas a cargo" | `REQ-PPL-016`; PT §20; `REQ-PPL-008` NOTES |
| Entra al mismo producto, no a una aplicación paralela | PT §20 |

`ACT-GUARDIAN` **no es** una capacidad proyectada sobre un menor: es una capacidad sobre
`SELF`-del-guardián con `CHILD` scope. La proyección es lo que cambia, no el actor.

## 9.7 Diferencia entre `GuardianRelationship` y la identidad del adulto

| | `GuardianRelationship` | La identidad del adulto |
|---|---|---|
| Qué es | Registro de delegación con dos flags y vigencia | `Person` + `Account` |
| Quién la crea | `ACT-ADMIN` (`REQ-PPL-008` AC 3) | `ACT-ADMIN` (`REQ-PPL-001`, `REQ-PPL-003`) |
| Cuántas por persona | N — una por menor | 1 |
| Qué controla | `can_view_child_info`, `can_respond_availability` | Nada sobre menores |
| Al finalizar | Deja de conceder acceso; conserva el período (`REQ-PPL-008` AC 3) | — |
| Relación con `ACT-GUARDIAN` | **Es** su authority source | Es su portador |

Un mismo adulto puede tener `GuardianRelationship` sobre dos menores con **permisos distintos**:
`CAND-06`→ ninguno. La relación es la unidad de scope y de permiso, no la persona.

## 9.8 Coexistencia con roles deportivos

Una misma `Person` + `Account` puede ser simultáneamente `ACT-GUARDIAN` y `ACT-COACH`,
`ACT-ADMIN`, etc. **No son excluyentes ni jerárquicos.** Ver §10.

Cuando una persona actúa como `ACT-GUARDIAN`, la autoridad usada es `GuardianRelationship`.
Cuando actúa como `ACT-COACH`, la autoridad usada es `RoleAssignment COACH`. Se evalúan por
separado y se suman. `REQ-PPL-012` AC 1 exige exactamente esto para el caso de la relación
**aislada**: *"GIVEN una persona cuya única relación es de representación WHEN se determina su
autoridad THEN no tiene roles deportivos ni acceso de gestión"*. La AC no dice "no tiene roles";
dice que **la relación por sí sola** no los otorga.

---

# 10. ANÁLISIS MULTI-ROL

## 10.1 Modelo

**No existe el actor combinado.** La autoridad efectiva de una persona es la **conjunción
evaluada por acción** de todas sus fuentes de autoridad vigentes.

```
Person P
  ├─ RoleAssignment PLAYER      [vigente, TEAM t1]      → ACT-PLAYER    activo para acciones de scope TEAM en t1
  ├─ RoleAssignment COACH       [vigente, TEAM t2]      → ACT-COACH     activo para acciones de scope TEAM/EVENT en t2
  ├─ RoleAssignment CAPTAIN     [vigente, TEAM t1]      → ACT-CAPTAIN   activo para logística de t1
  └─ GuardianRelationship gr-1  [vigente, child c1, view+respond]  → ACT-GUARDIAN activo sobre c1

Para la acción A sobre el objeto O en el scope S:
  autoridad(P, A, O, S) = OR sobre cada fuente f vigente:
      f aplica si  f.action ∈ A  AND  f.scope ⊇ S  AND  f.objectState permite A
                     AND  f.fieldAuthority permite el campo  AND  f.source es válido
  default: DENY
```

## 10.2 Por qué no hay actores combinatorios

| Actor combinado que NO se crea | Motivo |
|---|---|
| `CoachAdmin` | `ADMIN` y `COACH` son `RoleAssignment` con alcances distintos (`CLUB` vs `TEAM`/`EVENT`) que no se combinan en un scope único |
| `PlayerCaptain` | Son roles hermanos con bundles distintos sobre el mismo scope. La unión ya está expresada por la disyunción de fuentes |
| `CoachGuardian` | `GuardianRelationship` no es un rol; su scope es `CHILD`, no `TEAM` |
| `AdminCoach` | PT §5: `ADMIN` no es superusuario deportivo; la unión no crea autoridad deportiva nueva |
| `SubcommitteeCoach` | `REQ-STR-009` separa explícitamente las dosDistribuciones de autoridad |
| `CaptainPlayer` | Ya resuelto como `COEXISTENCE` (§8.4) |

Un actor combinatorio por cada par produciría `n²` actores para una autoridad que ya es
`n` disjunciones. PT §5 lo dice: *"Multi-role = unión de assignments vigentes"*.

## 10.3 `COEXISTENCE` no es `GENERALIZATION`

| | `COEXISTENCE` | `GENERALIZATION` |
|---|---|---|
| Significado | "Una misma persona puede satisfacer ambos actores" | "B es un tipo de A y hereda sus obligaciones" |
| Aplicación en GEI | Persona que tiene ambos `RoleAssignment` vigentes | **Ninguna** salvo `ACT-AUTHENTICATED` |
| Efecto sobre autoridad | Ninguno: cada fuente se evalúa sola | El hijo hereda el bundle del padre |
| Expresado como | Matriz de coexistencia | `EXTENDS` en UML |

El brief §23 lo exige: no usar generalización para expresar "puede tener ambos roles".

---

# 11. LÍMITES `ADMIN` / `COACH` / `SUBCOMMITTEE`

## 11.1 `ACT-ADMIN` — concede

| Capacidad | REQ |
|---|---|
| Ciclo de vida de cuenta (`PENDING → ACTIVE ↔ DISABLED`) | `REQ-IAM-002` |
| Emisión de código de activación y de restablecimiento | `REQ-IAM-003`, `REQ-IAM-004` |
| Protección del último administrador | `REQ-IAM-013` |
| Username inmutable y único | `REQ-IAM-014` |
| Reautenticación (step-up) para gestión sensible | `REQ-IAM-009` |
| Persona base, identidad, DNI, fecha de nacimiento | `REQ-PPL-001`, `REQ-PPL-013` |
| Vinculación persona–cuenta | `REQ-PPL-003` |
| Membresía al club | `REQ-PPL-004` |
| Afiliación deportiva | `REQ-PPL-005` |
| Asignación de roles y alcances | `REQ-PPL-006` |
| Transiciones de afiliación y rol | `REQ-PPL-007` |
| Gestión de la relación de representación | `REQ-PPL-008` AC 3 |
| Corrección de identidad de un perfil incompleto | `REQ-PPL-013` AC 3 |
| Toda la estructura del club | `REQ-STR-001`…`REQ-STR-008`, `REQ-STR-013` |
| Identidad y metadatos de sede | `REQ-STR-012` regla A |
| Mutación de habilitación | `REQ-PRT-017`, `REQ-CMP-008` |
| Competencias e inscripciones | `REQ-CMP-001`…`REQ-CMP-004`, `REQ-CMP-006` |
| Referencias externas | `REQ-CMP-006` |
| Auditoría: consulta y contenido mínimo | `REQ-INS-008`, `REQ-INS-009` |

## 11.2 `ACT-ADMIN` — deniega explícitamente

PT §5, fila por fila, con `ADMIN = —`:

| Capacidad denegada | Evidencia |
|---|---|
| Crear o editar entrenamiento | `REQ-EVT-002` AC: *"Admin sin autoridad ⇒ denegado"* |
| Crear partido | `REQ-EVT-003` |
| Crear evento del club | `REQ-EVT-004` |
| Posponer / reprogramar / cancelar partido | `REQ-EVT-003`, PT §5 |
| **Convocatoria** (borrador, publicación, historial) | `REQ-PRT-005`…`REQ-PRT-008` — initiator único `Coach` |
| **Asistencia** (apertura, registro, cierre, corrección) | `REQ-PRT-009`, `REQ-PRT-011`, `REQ-PRT-012` |
| **Resultado** de partido y correcciones | `REQ-PRT-013`, `REQ-PRT-014` |
| Estadísticas de partido | `REQ-PRT-016` |
| **Comunicado oficial** | `REQ-COM-001` — *"Sólo la Subcomisión"* |
| **Informe de asistencia** | `REQ-INS-004` AC: *"el acceso es denegado, conforme a la matriz de autoridad"*; NOTES: *"No es un defecto"* |
| **Informe de rendimiento** | `REQ-INS-005` (misma matriz) |
| Acceso a conversaciones privadas | `REQ-COM-012` AC 1; PT §5 regla; PT §6 regla `Nunca` |
| Selección | `REQ-PRT-005`, PT §5 `Selection` → `—` |
| Responder su propia disponibilidad sin `PLAYER` | PT §5 *"sólo si además PLAYER"*; `REQ-PRT-001` AC 3 |

## 11.3 `ADMIN DOES NOT IMPLY`

Declaración normativa de E2, exigida por el brief §20:

> **`ACT-ADMIN` NO implica `ACT-COACH`.**
> **`ACT-ADMIN` NO implica `ACT-CAPTAIN`.**
> **`ACT-ADMIN` NO implica `ACT-PLAYER`.**
> **`ACT-ADMIN` NO implica autoridad deportiva de ningún tipo.**

Si una acción deportiva requiere `COACH`, un `ADMIN` necesita **además** un `RoleAssignment COACH`
vigente con su alcance propio. No hay atajo, no hay god mode, no hay `SUPERUSER`.

**Única excepción de navegación, no de autoridad:** `REQ-INS-006` deriva el alcance del informe de
la autoridad; como `ADMIN` no tiene acceso a los informes, la excepción no le aplica.

## 11.4 `ACT-COACH` — separa lo deportivo de lo administrativo

| Es autoridad deportiva de `COACH` | Es autoridad administrativa y **NO** es de `COACH` |
|---|---|
| Crear/editar entrenamiento (`TEAM`/`EVENT`) — `REQ-EVT-002` | Personas, cuentas, accesos — `REQ-PPL-001`…`REQ-PPL-008` |
| Crear partido (`TEAM`) — `REQ-EVT-003` | Membresía — `REQ-PPL-004` |
| Ciclo de vida y transiciones de evento — `REQ-EVT-007`…`REQ-EVT-009` | Asignación de roles — `REQ-PPL-006` |
| Cambios no materiales y materiales — `REQ-EVT-010`, `REQ-EVT-011` | Estructura del club — `REQ-STR-001`…`REQ-STR-008` |
| Vista previa de impacto — `REQ-EVT-012` | Username — `REQ-IAM-014` |
| Series y jornadas — `REQ-EVT-014`…`REQ-EVT-018` | Auditoría — `REQ-INS-008`, `REQ-INS-009` |
| Logística — `REQ-EVT-019` | |
| Convocatoria — `REQ-PRT-005`…`REQ-PRT-008` | |
| Asistencia — `REQ-PRT-009`, `REQ-PRT-011`, `REQ-PRT-012` | |
| Resultado y estadísticas — `REQ-PRT-013`, `REQ-PRT-014`, `REQ-PRT-016` | |
| Conflictos de convocatoria — `REQ-PRT-007` | |
| Informes de equipo — `REQ-INS-004`, `REQ-INS-005`, `REQ-INS-007` | |
| Lectura del estado de habilitación — `REQ-CMP-008`, `REQ-PRT-017` | |

| Atributo | `ACT-COACH` |
|---|---|
| Authority source | `RoleAssignment COACH` |
| Scope válido | `TEAM` **o** `EVENT` (los dos; cualquier otro ⇒ `422 INVALID_ROLE_SCOPE`) |
| Vigencia | `[valid_from, valid_until)`; expirada no computa (`REQ-PPL-006`) |
| Requiere `Membership` | Sí (`REQ-PPL-004`) |
| affiliation | Por `RoleAssignment`, **no** por `TeamAssignment` (PT §17) |
| Hereda privilegios administrativos | **No** |

## 11.5 `ACT-SUBCOMMITTEE` — no es "semi `ADMIN`"

| Concede | Niega |
|---|---|
| Comunicado oficial: ciclo de vida, audiencia, corrección — `REQ-COM-001`…`REQ-COM-004` (scope `TEAM_SET` o `CLUB`) | **Estructura del club** — `REQ-STR-009` AC: *"el acceso es denegado con una explicación del motivo"* |
| Crear/editar evento de club y partidos — `REQ-EVT-002`…`REQ-EVT-004` | **Personas y cuentas** — PT §5 `Personas/cuentas/accesos` → `—` |
| Mutación de habilitación — `REQ-PRT-017`, `REQ-CMP-008` | **Convocatoria, asistencia, resultado, estadísticas** — PT §5 → `—` |
| Competencias e inscripciones — `REQ-CMP-001`…`REQ-CMP-004`, `REQ-CMP-006` | **Selección** — PT §5 → `—` |
| Referencias externas — `REQ-CMP-006` | **Auditoría** — PT §5 → `—` |
| Informes a nivel club — `REQ-INS-004`, `REQ-INS-005`, `REQ-INS-007` | **Conversaciones privadas** sin entitlement — `REQ-COM-012` |
| Reautenticación para gestión sensible — `REQ-IAM-009` | **Estructura** — `REQ-STR-009` |
| Motivo y origen de habilitación (`VIEW`) — PT §6 | Respuesta de comunicados ajenos — `REQ-COM-005` |

| Atributo | `ACT-SUBCOMMITTEE` |
|---|---|
| Authority source | `RoleAssignment SUBCOMMITTEE` |
| Scope válido | `CLUB` (único) |
| `Coach structure` | `—` |
| `Coach es Coach` | `SUBCOMMITTEE no equivale a Coach` (PT §5) |
| `Coach structure` vs `Club structure` | Divididos: `SUBCOMMITTEE` no administra estructura; `ADMIN` sí |

**`REQ-EVT-024`** nombra a `Admin · Subcomisión` para la valla de dependencias de jornada.
`PT §5` no concede a `ADMIN` ninguna fila de cierre de jornada, y `REQ-EVT-003/004` niegan a
`ADMIN` la creación de partidos. Se clasifica `ACT-SUBCOMMITTEE` como actor primario con
`ACT-ADMIN` secundario, y se registra la ambigüedad como `ACTOR-DECISION-02`, **no bloqueante**.
E2 congela el valor conservador: `ADMIN` sin authority deportiva.

---

# 12. ANÁLISIS DE GENERALIZACIÓN

## 12.1 Candidatos a generalización y resultado del test

| Candidato | Parent | ¿El child puede participar en TODOS los casos de uso del parent? | Resultado |
|---|---|---|---|
| `ACT-PLAYER` | `ACT-AUTHENTICATED` | Sí — contacto, contraseña, sesiones, perfil propio | **ADOPTADA** |
| `ACT-CAPTAIN` | `ACT-AUTHENTICATED` | Sí | **ADOPTADA** |
| `ACT-COACH` | `ACT-AUTHENTICATED` | Sí | **ADOPTADA** |
| `ACT-SUBCOMMITTEE` | `ACT-AUTHENTICATED` | Sí | **ADOPTADA** |
| `ACT-ADMIN` | `ACT-AUTHENTICATED` | Sí | **ADOPTADA** |
| `ACT-GUARDIAN` | `ACT-AUTHENTICATED` | Sí | **ADOPTADA** |
| `ACT-CAPTAIN` | `ACT-PLAYER` | 8/8 sí, pero importa aplanamiento (§8.3) | **RECHAZADA** |
| `ACT-CAPTAIN` | `ACT-COACH` | No — PT §5 lo prohíbe | **RECHAZADA** |
| `ACT-GUARDIAN` | `ACT-PLAYER` | No — sin `PLAYER` no responde disponibilidad propia; sin scope `TEAM` propio; sin entitlement comunicacional | **RECHAZADA** |
| `ACT-GUARDIAN` | `ACT-COACH` | No — ninguna autoridad deportiva | **RECHAZADA** |
| `ACT-GUARDIAN` | `ACT-ADMIN` | No — `Guardian` no gestiona; `REQ-PPL-008` AC 3: la gestiona `Admin` | **RECHAZADA** |
| `ACT-GUARDIAN` | `ACT-SUBCOMMITTEE` | No — sin anuncio oficial, sin elegibilidad, sin competencias | **RECHAZADA** |
| `ACT-ADMIN` | `ACT-SUBCOMMITTEE` | No — `ADMIN` no publica comunicados, no muta elegitación, no administra competencias | **RECHAZADA** |
| `ACT-ADMIN` | `ACT-COACH` | No — `ADMIN` no crea eventos ni gestiona convocatoria | **RECHAZADA** |
| `ACT-SUBCOMMITTEE` | `ACT-COACH` | No — `SUBCOMMITTEE no equivale a Coach` (PT §5) | **RECHAZADA** |
| `ACT-COACH` | `ACT-PLAYER` | No — `COACH` sin `PLAYER` no responde su propia disponibilidad (PT §5) | **RECHAZADA** |
| `ACT-SUBCOMMITTEE` | `ACT-PLAYER` | No — ídem | **RECHAZADA** |
| `ACT-ADMIN` | `ACT-PLAYER` | No — ídem | **RECHAZADA** |
| `ACT-AUTHENTICATED` | `ACT-UNAUTHENTICATED` | No — `UNAUTHENTICATED` no tiene sesión para cerrar ni perfil | **RECHAZADA** |
| `ACT-PLAYER` | `ACT-UNAUTHENTICATED` | No — no hay sesión | **RECHAZADA** |
| cualquier actor | `System` | — | **RECHAZADA** (`System` no es actor) |

**Generalizaciones adoptadas: 6** (todas hacia `ACT-AUTHENTICATED`).
**Generalizaciones rechazadas: 16.**

## 12.2 Por qué `ACT-AUTHENTICATED` sí es válida y no decorativa

El brief §14 advierte: *"no usar abstract actors decorativos"* y *"`ACT-AUTHENTICATED` no puede
convertirse en una forma de conceder permisos por defecto"*.

| Test | Resultado |
|---|---|
| ¿Reduce repetición real? | **Sí.** PT §5 fila 1 concede `editar propio contacto/password` a los **cinco** roles por igual. Sin actor abstracto, esa fila se repetiría 5 veces con riesgo de divergencia |
| ¿Las capacidades son realmente compartidas, no decorativas? | **Sí.** `REQ-IAM-005` (cambio de contraseña), `REQ-IAM-010` (visibilidad y cierre de sesiones), `REQ-PPL-016` (perfil propio) nombran `Authenticated user` como initiator |
| ¿El guardián también las cumple? | **Sí.** `REQ-PPL-009` AC 3: el guardián *"puede verlos y modificarlos"* (los suyos). `REQ-PPL-016` AC 4/5 lo incluye |
| ¿Convierte al abstracto en concesor de permisos? | **No.** Se declara explícitamente que `ACT-AUTHENTICATED` **no otorga acceso a la aplicación**: `REQ-IAM-012` exige `rol interno vigente` **o** `delegación con permiso`; sin ninguno ⇒ `/no-access` sin datos ni destinos. Se registra como `ABSTRACCIÓN_SIN_CONCESIÓN` |
| ¿Cuántos abstractos hay? | **1.** El máximo necesario |

## 12.3 Límite explícito del actor abstracto

`ACT-AUTHENTICATED` contiene **sólo** las capacidades que no dependen de la autoridad del actor:

| Incluido | Excluido deliberadamente |
|---|---|
| Editar contacto y contraseña propios (`REQ-IAM-005`) | Calendario, Inicio, búsqueda, informes — el **contenido** depende del scope |
| Ver y cerrar sesiones propias (`REQ-IAM-010`) | Disponibilidad propia — requiere `PLAYER` |
| Ver el perfil propio y cambiar el contexto de menor (`REQ-PPL-016`) | Convocatoria, asistencia, resultado — requieren `COACH` |
| Sobrevivir a la interrupción de sesión (`REQ-IAM-020`) | Comunicado oficial — requiere `SUBCOMMITTEE` |
| | Gestión de identidad — requiere `ADMIN` |

Las proyecciones (calendario, inicio, búsqueda) se atribuyen a **cada actor concreto**, no al
abstracto. Razón: su contenido varía por `scope`, y colgar una proyección del actor abstracto
introduciría una concesión implícita por pertenencia.

## 12.4 `ACT-AUTHENTICATED` no es instanciable

`ACT-AUTHENTICATED` es abstracto: **toda** persona real que interactúa con GEI debe satisfacer al
menos un actor concreto. Un `Account ACTIVE` con `Membership` vigente pero **sin** `RoleAssignment`
y **sin** `GuardianRelationship` **no satisface ningún actor** y obtiene `/no-access`
(`REQ-IAM-012`). Se registra como finding de stress (§16, escenario L).

---

# 13. ANÁLISIS DE PII

## 13.1 Principio

El PII se resuelve **por campo**, en la respuesta, no ocultando en pantalla
(`REQ-PPL-011` AC 4). Default deny. `ACT-*` nunca tiene un bundle de PII plano: tiene
autoridad por categoría de dato.

## 13.2 Matriz de boundary de PII

Leyenda: `V` = VIEW · `E` = EDIT · `V/E` · `C` = CONDITIONAL (con condición explícita) ·
`—` = NONE por default deny · `ND` = NOT_DEFINED (ningún REQ lo concede).

| Categoría | `ACT-UNAUTH` | `ACT-AUTH` | `ACT-PLAYER` | `ACT-CAPTAIN` | `ACT-COACH` | `ACT-SUBCOMM` | `ACT-ADMIN` | `ACT-GUARDIAN` |
|---|---|---|---|---|---|---|---|---|
| **SELF DATA** (identidad, pertenencia, roles, estado de cuenta) | — | V/E | V/E | V/E | V/E | V/E | V | V/E |
| **OTHER PERSON BASIC** (nombre y apellido) | — | ND | V | V | V | V | V/E | V (del menor) |
| **CONTACT** (teléfono, email) | — | V/E (propio) | V (equipo, `C`) | **V (equipo, `C`)** | **V (equipo, `C`)** | **—** | V/E | **— del menor** · V/E propios |
| **DNI** | — | ND | — | **— (Nunca)** | — | — | V/E | **—** |
| **DOB** (fecha completa) | — | ND | — | — | — | — | V/E | **—** |
| **ACCOUNT STATE** | — | V (propio) | V (propio) | V (propio) | V (propio) | V (propio) | V/E | V (propio) |
| **SECURITY** (contraseña, credencial, sesiones) | C (credencial propia) | V/E | V/E | V/E | V/E | V/E | **C** (reset administrativo) | V/E |
| **ELIGIBILITY STATUS** | — | ND | **— (default deny)** | **— (default deny)** | **V (con alcance)** | V | V | **—** |
| **ELIGIBILITY REASON + SOURCE** | — | ND | — | — | **—** | V | V | **—** |
| **GUARDIAN RELATIONSHIP** | — | ND | V (propia, read-only) | V (read-only) | **C** (info operativa mínima) | ND | V/E | V (propia) |
| **CHILD INFO** | — | ND | — | — | — | — | **C** (sólo la gestionada) | **V `C` por flag** |
| **MESSAGE BODY** | — | ND | C (participante + período) | C | C | **— sin entitlement** | **— sin entitlement** | **—** |
| **AUDIT DETAILS** | — | ND | — | — | — | — | **V (con redacción)** | **—** |
| **AUDIT EDIT / DELETE** | — | — | — | — | — | — | **—** | — |
| **OTRO MENOR** | — | — | — | — | — | — | C (si tiene relación) | **— (Nunca)** |

## 13.3 Las tres reglas `Nunca` de PT §6

| Regla | Actor afectado | Verificación en el modelo |
|---|---|---|
| *"`ADMIN` lee chats privados sólo por ser `ADMIN`"* | `ACT-ADMIN` | `MESSAGE BODY` = `—` sin entitlement + participación. `REQ-COM-012` AC 1 |
| *"`CAPTAIN` ve DNI por pertenecer al `Team`"* | `ACT-CAPTAIN` | `DNI` = `—`. `REQ-PPL-011` AC 1. **La Capitana ve contacto pero no DNI** |
| *"Guardian ve información de otros menores"* | `ACT-GUARDIAN` | `OTRO MENOR` = `—`. `REQ-PPL-008` AC 4 |

## 13.4 Lecturas de PII que este modelo resuelve

| Pregunta | Respuesta |
|---|---|
| ¿El guardián ve el teléfono del menor? | **No.** `CON-08`, PT §6 v1.0.1, `REQ-PPL-009` |
| ¿La capitana ve el DNI de su equipo? | **No.** Regla `Nunca`. |
| ¿La capitana ve el teléfono de su equipo? | **Sí**, con necesidad operativa. `REQ-PPL-011` AC 1 |
| ¿El entrenador ve el motivo de la habilitación? | **No.** `REQ-PRT-017` AC: *"entrenador ve estado, no motivo ni origen"* |
| ¿El guardián ve el estado de habilitación? | **No.** No está en la lista de PT §6 ⇒ default deny |
| ¿El jugador ve su propio estado de habilitación? | **No** por default. Registrado como `ACTOR-DECISION-01`, no bloqueante |
| ¿Admin puede editar la auditoría? | **No.** `REQ-INS-010`: sólo agregado |
| ¿Alguien ve contraseñas, hashes, tokens o cookies? | **No.** `REQ-SYS-020`, `REQ-INS-010` |

---

# 14. ANÁLISIS DE SCOPE

## 14.1 Scopes que existen realmente

| Scope | ¿Existe como scope de actor? | Evidencia |
|---|---|---|
| `SELF` | **Sí** | `REQ-PPL-016`, `REQ-IAM-005`, `REQ-IAM-010`, `REQ-COM-010` |
| `CHILD` | **Sí** | `REQ-PPL-008` PRECOND, `REQ-PRT-002` |
| `TEAM` | **Sí** | Freeze §7.2, PT §5 `Role scopes válidos` |
| `TEAM_SET` | **Sí** | `REQ-COM-002` (audiencia de comunicado), sólo `SUBCOMMITTEE` |
| `DIVISION` | **No** | No hay fila de autoridad con scope `DIVISION` |
| `LINE` | **No como scope de actor** | `LINE` es un **alcance de dato** de `CompetitionEntry` (`REQ-CMP-004`), no de un actor |
| `SEASON` | **No** | `Season` es histórico, sin estado (`CON-09`), sin actor |
| `COMPETITION` | **No como scope de actor** | Es un alcance de `EligibilityConstraint` (`PT §13`). `REQ-CMP-005` deriva el uso del `COACH` de su `TEAM` scope |
| `CLUB` | **Sí** | `SUBCOMMITTEE`, `ADMIN` |
| `EVENT` | **Sí** | `COACH` |
| `OTHER` | **No** | Ningún actor tiene alcance sobre terceros sin relación o rol |

## 14.2 Hallazgo: tres scopes de datos que NO son scopes de actor

`DIVISION`, `LINE`, `SEASON` y `COMPETITION` aparecen en el dominio, pero **ninguna fila de PT §5
los declara scope de actor**. Concederlos sería inventar authority. Se registran como
**alcances de dato**: acotan *qué filas* puede ver un actor que ya tiene `TEAM`, `TEAM_SET` o
`CLUB`, pero no amplían su alcance.

El brief §26 lo exige: *"No conceder `CLUB` si sólo hay `TEAM`"*. Aplicado: no conceder
`DIVISION` si sólo hay `TEAM`.

## 14.3 Un actor, varios scopes según la acción

`ACT-COACH` es el caso canónico:

| Acción | Scope |
|---|---|
| Crear partido | `TEAM` |
| Editar un evento dirigido | `EVENT` |
| Modificar la logística de un evento de su equipo | `TEAM` |
| Ver la asistencia de su equipo | `TEAM` |
| Ver el estado de habilitación de una jugadora de su equipo | `TEAM` |
| Editar contacto propio | `SELF` |
| Publicar un comunicado | **denegado** |

`ACT-SUBCOMMITTEE` también: `CLUB` para comunicados y competencias, `TEAM_SET` para la audiencia
de un comunicado, `SELF` para su contacto.

---

# 15. HALLAZGOS DE FRONTEND Y DE LA CAPA DE AUTORIDAD ACTUAL

Reproducción **read-only**. No se modificó `src/**`. Estos hallazgos **no** cambian el modelo;
sirven para IA/UX y para la implementación futura.

## 15.1 `ACTOR_UI_FINDING` — conflación de actores

| ID | Ubicación | Hallazgo | Actor afectado |
|---|---|---|---|
| `ACTOR-UI-01` | `src/mock/authority.ts:130` | `officialOnEvent = (event) => clubWide`, con `clubWide = admin \|\| official` (`:106`). Fusiona `ADMIN` y `SUBCOMMITTEE` en una sola autoridad de evento | `ACT-ADMIN`, `ACT-SUBCOMMITTEE` |
| `ACTOR-UI-02` | `src/mock/authority.ts:149` | `isSelfPlayer = roleNames.includes("PLAYER") \|\| roleNames.includes("CAPTAIN")`. Fusiona `ACT-PLAYER` y `ACT-CAPTAIN` en un único flag de disponibilidad propia | `ACT-PLAYER`, `ACT-CAPTAIN` |
| `ACTOR-UI-03` | `src/features/events.tsx:301` | `const official = authority.isClubWide`. Replica la fusión de `ACTOR-UI-01` en la feature | `ACT-ADMIN`, `ACT-SUBCOMMITTEE` |

## 15.2 `ACTOR_UI_FINDING` — capacidad oculta al actor correcto

| ID | Ubicación | Hallazgo | Actor afectado |
|---|---|---|---|
| `ACTOR-UI-04` | `src/mock/authority.ts:167` | `canManageLogistics = coachOnEvent(event) \|\| officialOnEvent(event)`. **No incluye `isCaptainOfTeam`** pese a que `isCaptainOfTeam` se calcula en `:164` y nunca se usa. La autoridad propia de `ACT-CAPTAIN` no está implementada | `ACT-CAPTAIN` |
| `ACTOR-UI-05` | `src/mock/authority.ts:242` | `canOpen("reports")` usa `isSelfPlayer \|\| coachTeams.length > 0 \|\| official`. **No incluye `captainTeams`**, aunque PT §5 concede a `CAPTAIN` `Team si corresponde` en ambos informes | `ACT-CAPTAIN` |

## 15.3 `ACTOR_UI_FINDING` — capacidad mostrada al actor incorrecto

| ID | Ubicación | Hallazgo | Actor afectado |
|---|---|---|---|
| `ACTOR-UI-06` | `src/mock/authority.ts:207` | `canViewContact` retorna `true` para `official`. PT §6 limita teléfono/email a `self, ADMIN, COACH/CAPTAIN del Team actual`. `SUBCOMMITTEE` no está en la lista | `ACT-SUBCOMMITTEE` |
| `ACTOR-UI-07` | `src/mock/authority.ts:240` | `canOpen("communication")` retorna `authority.canChat \|\| guardians.length > 0`. `REQ-COM-012` AC 2 exige que el destino de comunicación **no aparezca** para una cuenta de guardián | `ACT-GUARDIAN` |
| `ACTOR-UI-08` | `src/mock/authority.ts:251` | `canOpen("people")` = `admin \|\| official`, con el comentario *"La Subcomisión entra a la ficha para la habilitación, no para cuentas"*. PT §5 concede `Personas/cuentas/accesos` sólo a `ADMIN` | `ACT-SUBCOMMITTEE` |
| `ACTOR-UI-09` | `src/mock/authority.ts:220` | `canViewEligibilityStatus` retorna `true` para `person.id === actor.id`. PT §6 no lista al propio jugador | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` |
| `ACTOR-UI-10` | `src/mock/authority.ts:238` | `canOpen("teams")` incluye `guardianChildren.length > 0`. Consistente con PT §20 (el guardián ve el contexto del menor), pero el alcance debe ser el del **menor**, no el del adulto | `ACT-GUARDIAN` |

## 15.4 `ACTOR_UI_FINDING` — riesgo de actor derivado de superficie

| ID | Ubicación | Hallazgo |
|---|---|---|
| `ACTOR-UI-11` | `src/mock/store.tsx:234-241` | `DEMO_ACTORS` incluye `captain: "p0"`, `guardian: "guardian"`, `subcommittee`, `admin`, `coach`, `player`. Existe una "superficie de demo de capitanía" sin ninguna capacidad propia distinguishable. Riesgo: que IA interprete un conmutador de demo como evidencia de un actor distinto. **No se derivó actor de esto.** `IWR-03` ya lo clasifica como arnés de desarrollo |
| `ACTOR-UI-12` | `IWR-06` (catálogo) | Bloque "En el equipo (capitanía)" en Inicio. Superficie sin requisito de capacidad de capitanía. **No genera actor** |

## 15.5 `ACTOR_UI_FINDING` — estado de cuenta no condiciona la entrada

| ID | Ubicación | Hallazgo |
|---|---|---|
| `ACTOR-UI-13` | `src/mock/store.tsx:245`, `src/app/Shell.tsx:99` | `authenticated` se inicializa en `true` y nunca se deriva de `account.status`. `REQ-IAM-001` AC 3 exige rechazar `PENDING` y `DISABLED`. Un `Account DISABLED` mantiene capacidad de interacción en el CURRENT |

---

## 15.6 alineación del modelo conceptual vs CURRENT

Replay de la capa de autoridad actual (`src/mock/authority.ts`, `src/mock/derive.ts`,
`src/mock/store.tsx`, `src/mock/seed.ts`). **No se corrigió nada.**

| Actor | Estado CURRENT | Evidencia | Desviación |
|---|---|---|---|
| `ACT-UNAUTHENTICATED` | **NOT IMPLEMENTED** | `store.tsx:245`; `Shell.tsx:99` | No hay verificación de `account.status` en la entrada. `REQ-IAM-001` AC 3 |
| `ACT-AUTHENTICATED` | **CURRENT PARTIAL** | `Shell.tsx:99-106` | El redirect a `/login` y a `/no-access` existe; el estado de `Account` no se evalúa |
| `ACT-PLAYER` | **CURRENT PARTIAL** | `authority.ts:201` `canRespondOwn = isSelfPlayer && hasMembership` | Correcto en `Membership`; `ACTOR-UI-09` sobre elegibilidad propia |
| `ACT-CAPTAIN` | **CURRENT CONTRADICTORY + NOT IMPLEMENTED** | `authority.ts:167` sin `isCaptainOfTeam`; `:242` sin `captainTeams`; `:149` fusionado con `PLAYER` | Toda la autoridad propia de `CAPTAIN` ausente o fusionada |
| `ACT-COACH` | **CURRENT PARTIAL** | `authority.ts:126-128`, `:168-170` | Correcto en alcance; `ACTOR-UI-01` filtra `ADMIN` como si fuera `COACH` de club |
| `ACT-SUBCOMMITTEE` | **CURRENT CONTRADICTORY** | `authority.ts:207`, `:251`; correcto en `:190-192`, `:195-198` | `ACTOR-UI-06`, `ACTOR-UI-08` |
| `ACT-ADMIN` | **CURRENT CONTRADICTORY** | `authority.ts:130` `officialOnEvent = clubWide` ⇒ `canEditEvent`/`canManageLogistics`/`canTransitionEvent` de club | Contradice PT §5 `ADMIN no es superusuario deportivo` y `REQ-EVT-002` AC |
| `ACT-GUARDIAN` | **CURRENT PARTIAL** | `authority.ts:132-147`, `:144` `canRespondForChild` correcto; `:227` `guardianChildren` correcto | `ACTOR-UI-07` muestra comunicación; `ACTOR-UI-10` scope de equipo |

**Conteo de alineación:** `CURRENT ALIGNED` = 0 · `CURRENT PARTIAL` = 4 · `CURRENT CONTRADICTORY` = 3 · `NOT IMPLEMENTED` = 1.

**Interpretación honesta:** el CURRENT **no** implementa el modelo de actores de E2. Eso es lo
esperable: el CURRENT es un prototipo anterior al Requirements Freeze y el brief §10/§31/§32
prohíben convertirlo en verdad. Se registra como evidencia de brecha, no como defecto de E2.

---

# 16. ESCENARIOS DE ESTRÉS

Los 14 escenarios del brief §33. Cada uno debe ser respondible por el modelo sin ambigüedad.

## 16.1 Resultados

| # | Escenario | Actores que satisface | Authority source activa | Scope | Qué puede iniciar | Qué NO puede | Resultado |
|---:|---|---|---|---|---|---|---|
| **A** | Jugadora normal | `ACT-AUTHENTICATED`, `ACT-PLAYER` | `RoleAssignment PLAYER` + `Membership` + `TeamAssignment` | `SELF`, `TEAM` | Disponibilidad propia; consulta de calendario, inicio, evento, búsqueda; notificationes | Convocatoria, asistencia, resultado, comunicados, estructura, cuentas, auditoría | **PASS** |
| **B** | Jugadora + capitana, mismo equipo | `ACT-AUTHENTICATED`, `ACT-PLAYER`, `ACT-CAPTAIN` | Ambas: `RoleAssignment PLAYER` + `RoleAssignment CAPTAIN` | `SELF`, `TEAM` | Todo lo de A **más** logística del evento de su equipo, informes de equipo | Convocatoria, asistencia, resultado, comunicados, estructura, cuentas | **PASS** |
| **C** | Entrenador de Team A, sin autoridad en Team B | `ACT-AUTHENTICATED`, `ACT-COACH` | `RoleAssignment COACH` con `target = tA` | `TEAM tA`, `EVENT` de tA | Todo lo de `COACH` **sólo** sobre tA y eventos de tA | Cualquier acción de `COACH` sobre tB; todo lo de `ADMIN`; todo lo de `SUBCOMMITTEE` | **PASS** |
| **D** | Admin sin rol `COACH` | `ACT-AUTHENTICATED`, `ACT-ADMIN` | `RoleAssignment ADMIN` | `CLUB` (administrativo), `SELF` | Cuentas, personas, estructura, competencias, habilitación, auditoría, username | **Crear/editar eventos, convocatoria, asistencia, resultado, comunicados, informes de asistencia y rendimiento** | **PASS** |
| **E** | Admin + Coach | `ACT-AUTHENTICATED`, `ACT-ADMIN`, `ACT-COACH` | Ambas, evaluadas por separado | `CLUB` + `TEAM`/`EVENT` | La unión de D y C, cada una con su scope | Ninguna capacidad deportiva con alcance `CLUB`: `COACH` no administra club | **PASS** |
| **F** | Subcomisión sin `ADMIN` | `ACT-AUTHENTICATED`, `ACT-SUBCOMMITTEE` | `RoleAssignment SUBCOMMITTEE` | `CLUB`, `TEAM_SET`, `SELF` | Comunicados, eventos de club, habilitación, competencias, referencias externas, informes de club | **Estructura** (`REQ-STR-009`), cuentas, convocatoria, asistencia, resultado, auditoría, conversaciones sin entitlement | **PASS** |
| **G** | Guardián de Child A, sin relación con Child B | `ACT-AUTHENTICATED`, `ACT-GUARDIAN` (sólo sobre cA) | `GuardianRelationship gr-A` | `CHILD cA` | Ver contexto de cA; responder disponibilidad de cA si el flag está | **Cualquier cosa sobre cB**; edita el DNI o fecha de nacimiento de cA; conversaciones privadas; auditoría | **PASS** |
| **H** | Guardián + Coach | `ACT-AUTHENTICATED`, `ACT-GUARDIAN`, `ACT-COACH` | `GuardianRelationship` + `RoleAssignment COACH`, por separado | `CHILD cA` + `TEAM tA` + `SELF` Acciones de `COACH` sobre tA; acciones de `GUARDIAN` sobre cA | La relación de guardián **no** otorga nada sobre tA; el rol de coach **no** otorga PII de cA | **PASS** |
| **I** | Guardián con permiso de ver, sin permiso de responder | `ACT-AUTHENTICATED`, `ACT-GUARDIAN` (parcial) | `gr` con `can_view_child_info = true`, `can_respond_availability = false` | `CHILD c` | Ver el contexto del menor | Responder disponibilidad — *"la operación no se le ofrece y, si la intenta, es denegada"*, **con el motivo visible** (`REQ-PPL-008` AC 1; `REQ-PRT-002` AC 2) | **PASS** |
| **J** | Guardián con permiso de responder | `ACT-AUTHENTICATED`, `ACT-GUARDIAN` | `gr` con `can_respond_availability = true` | `CHILD c` | Responder disponibilidad **a nombre del menor**; el equipo la ve como del menor | Responder si el evento no alcanza al menor — *"la operación es rechazada"* (`REQ-PRT-002` AC 3) | **PASS** |
| **K** | Cuenta deshabilitada | **Ninguno** | `Account.status = DISABLED` bloquea la entrada | — | Nada | **Todo.** `REQ-IAM-001` AC 3 rechaza; `REQ-IAM-002` revoca sesiones | **PASS** |
| **L** | Persona con `Membership` finalizada | **Ninguno** | `Membership` expirada; `RoleAssignment` puede seguir existiendo pero `REQ-PPL-004` exige `Membership` vigente | — | Nada | Todo lo que requiera rol interno. `REQ-IAM-012`: sin rol vigente **ni** delegación ⇒ `/no-access` | **PASS** |
| **M** | `RoleAssignment` vencida | **Ninguno** para ese rol | `valid_until` vencido ⇒ *"asignación expirada no computa"* (`REQ-PPL-006`) | — | Nada de ese rol | Todo lo de ese rol. Los demás roles vigentes siguen operando | **PASS** |
| **N** | `TeamAssignment` terminado | `ACT-PLAYER` **degradado** | `TeamAssignment` cerrada + `RoleAssignment PLAYER` cerrada + `RoleAssignment CAPTAIN` cerrada (`REQ-PPL-007`; PT §17 `EndPlayerTeam`) | `SELF` | Perfil, contacto, sesiones, avisos | Disponibilidad propia, informes de equipo, cualquier acción de scope `TEAM` | **PASS** |

## 16.2 Lecturas cruzadas del estrés

| Pregunta del brief §45 | Respuesta del modelo |
|---|---|
| ¿Una persona puede ser múltiples actors? | **Sí.** `COEXISTENCE`. Verificado en B, E, H |
| ¿Sabemos por qué? | **Sí.** PT §5 `Multi-role = unión de assignments vigentes`; `REQ-PPL-006` |
| ¿La autoridad cambia según el scope? | **Sí.** `ACT-COACH` en C; `ACT-SUBCOMMITTEE` en F |
| ¿Admin sólo obtiene authority administrativa? | **Sí.** D, verificado contra las 15 denegaciones de §11.2 |
| ¿`Captain` existe independientemente de `Coach`? | **Sí.** B: logística sin `COACH`. `REQ-EVT-019` |
| ¿`Guardian` existe sin `Membership` propia? | **Sí.** G, H, I, J. PT §17, PT §20 |
| ¿`Guardian` puede representar dos menores con permisos distintos? | **Sí.** I y J son dos variantes; cada `GuardianRelationship` controla sus dos flags independientemente (PT §20) |
| ¿Una relación vencida elimina la authority? | **Sí.** El período se conserva pero deja de conceder acceso (`REQ-PPL-008` AC 3) |
| ¿Un `RoleAssignment` vencido elimina la capacidad del actor? | **Sí.** M. `REQ-PPL-006` |
| ¿Un `TeamAssignment` terminado afecta el scope? | **Sí.** N. Cierra también `PLAYER` y `CAPTAIN` |
| ¿`Account` disabled bloquea la interacción? | **Sí.** K. `REQ-IAM-001`, `REQ-IAM-002` |
| ¿`Player` conoce eligibility details prohibidos? | **No.** §13.2: `ELIGIBILITY STATUS` y `REASON` = `—` para `ACT-PLAYER`. Registrado `ACTOR-DECISION-01` |
| ¿Alguna herencia concede algo que no debería? | **No.** La única herencia adoptada es hacia `ACT-AUTHENTICATED`, que no concede (`REQ-IAM-012`) |
| ¿Hay requirements sin iniciador claro? | **No.** 122/122 con actor primario o `SYSTEM_INTERNAL`. Las 2 ambigüedadesDll residual se registran como decisiones no bloqueantes, no como `AMBIGUOUS` |
| ¿Se creó algún actor sólo porque había una página? | **No.** 0 actores con fuente en `src/**` |
| ¿Hay un beneficiary confundido con actor? | **No.** `CAND-13..18` y los participantes y beneficiarios son `NOT_ACTOR` |
| ¿Hay un object confundido con actor? | **No.** Ídem |

---

# 17. FEEDBACK DE CALIDAD DE REQUERIMIENTO

E2 **no editó** `docs/requirements/**`. Cada problema se registra como feedback. Los que
requieren cambiar el Freeze se convierten en *change candidates* con decisión de producto.

| ID | REQ | Problema | Evidencia | Clarificación recomendada | ¿Bloquea E2? |
|---|---|---|---|---|---|
| `ACTOR-FEEDBACK-01` | `REQ-EVT-019` | La columna de condición está vacía y la AC dice *"prospera según su alcance"* sin declarar el scope de `CAPTAIN` | PT §5 fila `Logistics` (`CAPTAIN: Team scope`); `REQ-EVT-019` NOTES | Declarar explícitamente `CAPTAIN` = `TEAM` scope sobre el `target` de su `RoleAssignment`, y que coexiste con `PLAYER` sobre el mismo equipo | **NO** |
| `ACTOR-FEEDBACK-02` | `REQ-PRT-001` vs PT §5 | PT §5 concede `CAPTAIN` `✓` en *"responder propia Availability"* sin exigir `PLAYER`; la AC de `REQ-PRT-001` exige rol `PLAYER` vigente. Los dos textos formalizan la misma capacidad por caminos distintos | PT §5 fila 2; `REQ-PRT-001` AC 3; PT §17 | Aclarar que `CAPTAIN` por sí solo no basta y que hace falta un `RoleAssignment PLAYER` vigente sobre el mismo equipo | **NO** |
| `ACTOR-FEEDBACK-03` | `REQ-INS-004`, `REQ-INS-005` | Los actores preliminares omiten `CAPTAIN`, pero PT §5 concede `CAPTAIN: Team si corresponde` en ambos informes | PT §5 filas `Attendance report` y `Performance report`; catálogo `PRELIMINARY ACTOR` de ambos REQ | Agregar `Captain` como actor secundario con alcance `TEAM` y la condición *"si corresponde"* | **NO** |
| `ACTOR-FEEDBACK-04` | `REQ-COM-012` | Atribuido a `System`, pero sus AC son observaciones sobre la navegación de `PLAYER`, `CAPTAIN`, `COACH`, `ADMIN` y `Guardian` | Catálogo `REQ-COM-012` `PRELIMINARY ACTOR: System`; AC 1–3 | Mantener la regla como interna y listar explícitamente los actores afectados en la columna de actores | **NO** |
| `ACTOR-FEEDBACK-05` | `REQ-IAM-003` | El consumidor se nombra `Club member`, vocabulario que no aparece como initiator en ningún otro REQ y que no distingue a la persona con `Account PENDING` de cualquier socio | Catálogo `REQ-IAM-003` `PRELIMINARY ACTOR`; `REQ-IAM-001` AC 3 | Nombrar al consumidor como la persona con `Account PENDING` y un código vigente de un solo uso, sin sesión | **NO** |
| `ACTOR-FEEDBACK-06` | `REQ-IAM-012` | Exige rol interno vigente **o** delegación con permiso, pero no dice qué ve una persona autenticada sin ninguno de los dos | `REQ-IAM-012` AC | Declarar que esa persona no satisface ningún actor y recibe `/no-access` sin datos ni destinos | **NO** |
| `ACTOR-FEEDBACK-07` | `REQ-EVT-013`, `REQ-EVT-024` | Nombran a `Admin` sin declarar qué autoridad ejerce, lo que invita a leer `ADMIN` como autoridad deportiva | `REQ-EVT-013` AC; `REQ-EVT-024` AC; PT §5 (todas las filas deportivas `—` para `ADMIN`) | Declarar que la participación de `ADMIN` es la valla técnica y la reconciliación de concurrencia, no autoridad de convocatoria, asistencia o resultado | **NO** |
| `ACTOR-FEEDBACK-08` | `REQ-PPL-010` | Atribuye a `Player (menor)` la visibilidad del acceso de terceros, pero no declara que la contraparte de una `GuardianRelationship` sea un menor | `REQ-PPL-010` AC; `REQ-PPL-008` PRECONDITION; PT §20 `associated minor` | Declarar que el sujeto delegado es siempre un menor, para que la edad no quede implícita | **NO** |
| `ACTOR-FEEDBACK-09` | Contadores del catálogo | §3.1 y §11 del Freeze y §1.2 del catálogo declaran `SYS = 29`, pero el dominio contiene **27** IDs (`REQ-SYS-001 … REQ-SYS-027`). La suma por dominios da 159 | Freeze §3.1, §11; catálogo §1.2; conteo mecánico de IDs | Corregir el contador de `SYS` a 27. El total 157 y los tipos 122/35 son correctos | **NO** |

## 17.1 Hallazgo adicional: `REQ-STR-007` título y `STATEMENT` no coinciden

| Campo | Contenido |
|---|---|
| Título del catálogo | `REQ-STR-007` — Identidad de temporada por identificador |
| `STATEMENT` del catálogo | *"Cada entidad de estructura y cada evento deben llevar su propia zona horaria, y las fechas mostradas deben ser interpretadas en esa zona."* |
| Título del Freeze §3.1 y §4.3 | `Zona horaria` |

El `STATEMENT` corresponde a **zona horaria**; el título del catálogo quedó desalineado. No hay
impacto de actor (ambas versiones son `SYSTEM_INTERNAL`), pero es un defecto documental de E1.
Registrado aquí. **No se editó el Freeze ni el catálogo.**

## 17.2 Hallazgo adicional: `REQ-SYS-012` tipado como `FUNCTIONAL / AUTHORIZATION`

Su `STATEMENT` describe comportamiento de interfaz (ocultar, deshabilitar con razón, explicar
sección vacía) pero está tipado `FUNCTIONAL` con categoría `AUTHORIZATION`. La columna
`PRELIMINARY ACTOR` (`Authenticated user`) es coherente, por lo que **no bloquea E2**. Se registra
como observación de tipificación.

---

# 18. DECISIONES DE ACTOR ABIERTAS

Ninguna bloqueante. Ninguna se resolvió por inferencia.

| ID | Pregunta | Opciones | Recomendación | ¿Bloqueante? |
|---|---|---|---|---|
| `ACTOR-DECISION-01` | ¿`ACT-PLAYER` y `ACT-CAPTAIN` ven su propio estado de habilitación? | (a) `NONE` · (b) `VIEW` del propio estado, sin motivo ni origen · (c) sólo un booleano derivado | **(b)**, limitada al propio estado | **NO** |
| `ACTOR-DECISION-02` | ¿`ACT-ADMIN` puede cerrar una jornada? | (a) No, sin authority deportiva · (b) Sí, con fila propia en la matriz | **(a)** | **NO** |

Detalle completo en `docs/actors/GEI_ACTOR_OPEN_DECISIONS_V1.md`.

### `ACTOR-DECISION-01` en detalle

| Elemento | Contenido |
|---|---|
| **Pregunta** | `PT §6` y Freeze §7.3 listan el estado de habilitación para `COACH` con alcance, `SUBCOMMITTEE` y `ADMIN`. **No** listan a `PLAYER`. ¿Debe el jugador ver el propio estado? |
| **Evidencia a favor de `NONE`** | PT §6 no lo lista; default deny; Freeze §7.3 idem |
| **Evidencia a favor de `CONDITIONAL`** | `REQ-PRT-017` exige que exista un estado observable ("habilitada"); `REQ-PRT-007` dice que los conflictos de habilitación *"puede alimentar Inicio"*, e Inicio es una proyección de `Authenticated user` (`REQ-EVT-021`). Si un conflicto derivado llega a su Inicio sin que ella pueda ver el estado, la proyección es incoherente con `REQ-SYS-014` |
| **Opciones** | (a) `NONE`: el jugador no ve su estado de habilitación. (b) `VIEW` del **propio estado**, nunca motivo ni origen, nunca el de otro. (c) Sólo un booleano derivado ("puede jugar" / "no puede jugar") sin los estados `PENDING`/`BLOCKED` |
| **Recomendación** | **(b)**, limitada al propio estado |
| **Impacto** | Matriz PII: filas `ELIGIBILITY STATUS` de `ACT-PLAYER` y `ACT-CAPTAIN`. Un caso de uso futuro de consulta propia. `ACTOR-UI-09` (el CURRENT ya lo concede) pasa de `CURRENT CONTRADICTORY` a `CURRENT ALIGNED` |
| **Bloqueante** | **NO.** E2 congela el valor conservador `(a)` y registra el change candidate |
| **REQ afectados** | `REQ-PRT-017`, `REQ-PRT-007`, `REQ-CMP-008`, `REQ-PPL-011` |
| **CU futuros afectados** | Uno nuevo de consulta propia de habilitación, si se adopta (b) |

### `ACTOR-DECISION-02` en detalle

| Elemento | Contenido |
|---|---|
| **Pregunta** | `REQ-EVT-024` (valla de dependencias de jornada) nombra a `Admin · Subcomisión`. PT §5 no concede a `ADMIN` ninguna fila de cierre de jornada y `REQ-EVT-003/004` le niegan la creación de partidos. ¿`ACT-ADMIN` puede cerrar una jornada? |
| **Evidencia** | PT §5 (matriz completa: `ADMIN = —` en todas las filas deportivas); `REQ-EVT-024` AC; `REQ-EVT-003`; Freeze §2.3.1 |
| **Opciones** | (a) `ADMIN` sin authority deportiva: participa en la valla técnica pero no inicia el cierre. (b) `ADMIN` con fila propia en la matriz para cierre de jornada |
| **Recomendación** | **(a)**, por default deny y por coherencia con `ADMIN no es superusuario deportivo` |
| **Impacto** | `ACT-ADMIN` mantiene su lista de denegaciones. Un caso de uso de cierre de jornada con `ACT-SUBCOMMITTEE` como actor primario |
| **Bloqueante** | **NO** |
| **REQ afectados** | `REQ-EVT-024`, `REQ-EVT-013`, `REQ-EVT-003` |
| **CU futuros afectados** | Cierre de jornada |

---

# 19. VEREDICTO FINAL

## 19.1 Criterios de gate de la Etapa 2

| # | Criterio | Resultado |
|---:|---|---|
| 1 | 100 % de REQ funcionales IN revisados | **PASS** — 122/122 |
| 2 | 100 % de REQ IN con actor primario o `SYSTEM_INTERNAL`/`NOT_APPLICABLE` | **PASS** — 157/157 |
| 3 | 0 `AMBIGUOUS` | **PASS** — 0 |
| 4 | 0 actores sin REQ que los justifique | **PASS** — 8/8 con REQ |
| 5 | 0 actores derivados sólo del frontend | **PASS** |
| 6 | 0 confusión `Person = Actor` | **PASS** — §7 |
| 7 | 0 confusión `Account = Actor` | **PASS** — §30 |
| 8 | 0 confusión `RoleAssignment = Actor` | **PASS** — §7.3 |
| 9 | 0 confusión `Guardian = RoleAssignment` | **PASS** — §9 |
| 10 | 0 generalizaciones sin substitutabilidad | **PASS** — 6 adoptadas, 16 rechazadas, todas con test documentado |
| 11 | 0 actores combinatorios | **PASS** |
| 12 | `CAPTAIN` resuelto | **PASS** — actor independiente, §8 |
| 13 | `Guardian` resuelto | **PASS** — `DELEGATED_HUMAN`, §9 |
| 14 | Multi-rol resuelto | **PASS** — `COEXISTENCE`, §10 |
| 15 | `ADMIN ≠ god mode` explícito | **PASS** — §11.3 |
| 16 | PII boundaries identificadas | **PASS** — §13.2 |
| 17 | Scope principles definidos | **PASS** — §14 |
| 18 | Authority source por actor definida | **PASS** — `GEI_ACTOR_CATALOG_V1.md` §10 |
| 19 | 0 decisiones de actor bloqueantes | **PASS** — 2 abiertas, 0 bloqueantes |
| 20 | Cobertura de requerimientos calculada | **PASS** — `GEI_ACTOR_REQUIREMENT_MATRIX_V1.md` §11 |
| 21 | Escenarios de estrés PASS | **PASS** — 14/14 |

## 19.2 Resultado por tarea

```
E2-01  DERIVAR CANDIDATOS DE ACTOR           PASS
E2-02  DEFINICIÓN DE ACTORES                 PASS
E2-03  RELACIONES ENTRE ACTORES              PASS
E2-04  MATRIZ ACTOR ↔ REQUERIMIENTO          PASS
E2-05  REVISIÓN FINAL DE GATE                PASS

ACTOR MODEL RECONSTRUCTION AUDIT V1          PASS
```

## 19.3 Limitaciones declaradas

1. **`WORKBOOK_UPDATE_BLOCKED`.** El workbook `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx`
   no existe en el repo, ni en `Downloads`, ni en `Desktop`, ni en `Documents`, ni en `OneDrive`.
   No se creó un sustituto. No se inventó otro XLSX.
2. **El CURRENT no implementa el modelo de actores.** 0 actores `CURRENT ALIGNED`, 4 `PARTIAL`,
   3 `CONTRADICTORY`, 1 `NOT IMPLEMENTED`. Es evidencia de brecha, no un defecto de E2.
3. **Dos decisiones de E1 siguen abiertas y no se resolvieron:**
   `REQ-DECISION-NEEDED-01` y `REQ-DECISION-NEEDED-02`. Verificadas sin impacto real sobre los
   actores.
4. **Dos decisiones de actor nuevas, no bloqueantes:** `ACTOR-DECISION-01`, `ACTOR-DECISION-02`.
   E2 congela valores conservadores y registra los change candidates.
5. **Nueve feedbacks de calidad de requerimiento**, uno de ellos (`ACTOR-FEEDBACK-09`) un
   defecto de conteo en el propio Freeze. **No se editó E1.**
6. **Un defecto adicional en el catálogo:** `REQ-STR-007` tiene título y `STATEMENT`
   desalineados (§17.1). No editado.
7. **Este documento no diseña superficies, casos de uso, base de datos ni arquitectura.** No se
   nombró ningún `UC-*`, no se dibujó ningún diagrama.

## 19.4 Qué sigue

La verdad de E2 está en `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md`. La Etapa 3 puede arrancar
con: 8 actores canónicos, 6 generalizaciones adoptadas, 16 rechazadas, 18 REQ
`SYSTEM_INTERNAL`, 2 decisiones no bloqueantes y 9 feedbacks de calidad de requerimiento.

---

**Fin del Actor Reconstruction Audit V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/actors/`.
