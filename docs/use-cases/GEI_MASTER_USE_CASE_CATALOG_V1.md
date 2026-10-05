# GEI HOCKEY MANAGEMENT SYSTEM
## MASTER USE CASE CATALOG V1

**Etapa:** 3 — Uso de casos
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e3-use-case-inventory-freeze-v1`
**Baseline:** `730bf8ffee428666d24a588e23f23b457dc35123`

| Autoridad | Archivo · Versión |
|---|---|
| `E3_REQUIREMENTS_AUTHORITY` | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — **V1** + errata de `docs/use-cases/GEI_PRE_E3_INPUT_CLOSURE_V1.md` §3 |
| `E3_ACTOR_AUTHORITY` | `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` — **V1** |
| Insumo cerrado | `docs/use-cases/GEI_PRE_E3_INPUT_CLOSURE_V1.md` — **V1** |

---

# 1. SUMMARY

## 1.1 Entradas

| Métrica | Valor |
|---|---:|
| Fuentes relevantes revisadas | 9 documentos E1/E2 + PT v1.0.1 + `src/**` como evidencia secundaria |
| Decisiones de entrada resueltas para E3 | 4 de 4 |
| Decisiones de entrada bloqueantes | **0** |
| REQ IN totales | **157** |
| REQ IN funcionales | **122** |
| REQ IN no funcionales | **35** |
| Funcionales `MAPPED` en E2 (actor primario) | **104** |
| Funcionales `SYSTEM_INTERNAL` en E2 | **18** |
| `DEFER` / `OUT` | 14 / 26 — **fuera de V1, sin CU** |

## 1.2 Candidatos

| Métrica | Valor |
|---|---:|
| Candidatos de objetivo funcional extraídos (`UCCAND-*`) | **147** |
| Candidatos fusionados por duplicidad | **38** |
| Candidatos agglomerados por granularidad excesiva | **5** |
| Candidatos rechazados por microacción | **12** |
| Candidatos rechazados por ser ruta, pantalla o componente | **27** |
| Candidatos rechazados por feature creep sin REQ | **6** |
| Candidatos clasificados `BUSINESS_RULE` / `SYSTEM_INTERNAL` / `CROSS_CUTTING` | **59** |
| **Casos de uso canónicos** | **102** |

## 1.3 Canónicos por dominio

| Dominio | CU canónicos | REQ funcionales del dominio |
|---|---:|---:|
| `IAM` — Identity & Access | **10** | 13 |
| `PPL` — People & Relationships | **17** | 16 |
| `STR` — Club Structure | **15** | 13 |
| `EVT` — Events & Calendar | **19** | 24 |
| `PRT` — Participation | **13** | 19 |
| `COM` — Communication | **14** | 18 |
| `CMP` — Competition | **9** | 8 |
| `INS` — Search / Reports / Audit | **5** | 10 |
| `SYS` — Cross-cutting | **0** | 1 |
| **TOTAL** | **102** | **122** |

`SYS = 0` porque su único REQ funcional (`REQ-SYS-012`) es una regla transversal de presentación de
autoridad, no un objetivo que un actor intente conseguir.

## 1.4 Canónicos por actor

`ACT-AUTHENTICATED` es el actor abstracto de E2 y **no se cuenta como un actor más**: sus
capacidades propias —contacto, contraseña, sesiones, perfil— están todas en `IAM` y `PPL`, y las
ejerce cada `ACT-*` concreto según su rol. Los 24 CU que listan `ACT-AUTHENTICATED` como primario lo
listan **como etiqueta del conjunto de roles concretos** que puede iniciarlos, no como una concesión
de autoridad (E2 §4.2 y §4.3).

**Regla de conteo.** La columna "primario" cuenta un CU una vez por cada actor que puede **iniciarlo**
con autoridad propia. Un CU con tres iniciadores cuenta en tres filas y por eso la suma de la columna
(134) supera el total de CU (102).

| Actor | CU donde puede **iniciar** | CU donde es **secundario / alternativo autorizado** |
|---|---:|---:|
| `ACT-ADMIN` | **42** | 6 |
| `ACT-SUBCOMMITTEE` | **32** | 11 |
| `ACT-COACH` | **28** | 8 |
| `ACT-AUTHENTICATED` (abstracto → sus 6 roles) | **24** | 12 |
| `ACT-PLAYER` | **3** | 5 |
| `ACT-GUARDIAN` | **3** | 5 |
| `ACT-UNAUTHENTICATED` | **2** | 1 |
| `ACT-CAPTAIN` | **0** | 4 |
| **Suma de membresías** | **134** | — |

**`ACT-CAPTAIN` con 0 CU primarios** es correcto y deliberado, y es la misma conclusión de E2 §11.3
con una diferencia: en E3 existe un CU donde `ACT-CAPTAIN` **sí** puede ser el actor que inicia —
`UC-EVT-16 · Actualizar la logística de un evento`, donde `REQ-EVT-019` AC 2 dice literalmente *"una
capitana de un equipo … la operación prospera según su alcance"*, y donde ninguna otra autoridad
sustituye a `CAPTAIN` (PT §5 fila `Logistics`: `CAPTAIN: Team scope`, `ADMIN: —`). E3 lo registra
como **`ALTERNATE AUTHORIZED ACTOR`** porque comparte objetivo, flujo y resultado con `ACT-COACH` y
`ACT-SUBCOMMITTEE`, cumpliendo el criterio de §17 del brief: no se duplica un CU porque dos actores
lo puedan ejecutar. No se le concede ninguna capacidad nueva, y no aparece ningún CU "logística como
capitana" ni "disponibilidad como capitana".

## 1.5 Multi-actor

| Categoría | CU | Detalle |
|---|---:|---|
| **Exactamente 1** actor primario | **72** | — |
| **Exactamente 2** actores primarios | **28** | 16 de `EVT` (`COACH` + `SUBCOMMITTEE`), 8 de `CMP` (`SUBCOMMITTEE` + `ACT-ADMIN`), `UC-IAM-09`, `UC-PPL-14`, `UC-PRT-01`, `UC-PRT-12` |
| **Exactamente 3** actores primarios | **2** | `UC-PRT-13`, `UC-CMP-09` |
| Actor primario + secundario con **otra** authority source | 17 | p. ej. `UC-IAM-04` (`ACT-ADMIN` emite el código que otro consume), `UC-EVT-12` y `UC-EVT-15` (`ACT-ADMIN` sólo como valla técnica, `ACTOR-DECISION-02`) |
| Actor **destinatario** explícitamente nombrado, no iniciador | 6 | p. ej. `UC-PPL-02` (`ACT-PLAYER` recibe el aviso), `UC-PPL-07` y `UC-PPL-08` (`ACT-CAPTAIN` afectada, no participa) |

**0** CU con dos actores combinatorios. E2 §6.3 lo prohíbe y E3 no crea ninguno.
**0** CU donde `ACT-ADMIN` obtenga autoridad deportiva, `ACT-CAPTAIN` obtenga autoridad de `COACH`, o
`ACT-GUARDIAN` obtenga autoridad fuera del menor. Verificado CU por CU en §2.6 del Audit.

## 1.6 Supporting / internal

| Tipo | REQ funcionales | Qué significa |
|---|---:|---|
| `PRIMARY` | **70** | El REQ expresa el objetivo del CU |
| `SUPPORTING` | **9** | El REQ gobierna un CU sin definirlo |
| `BUSINESS_RULE` | **23** | Restringe o condiciona otros CU |
| `SYSTEM_INTERNAL` | **9** | Regla interna sin objetivo de usuario propio |
| `CROSS_CUTTING` | **11** | Regla transversal de autoridad o de presentación |
| **`UNMAPPED`** | **0** | **Gate §27 PASS** |
| **TOTAL** | **122** | Coincide con el total funcional verificado |

**Verificación de la suma por columnas:** `70 + 9 + 23 + 9 + 11 = 122`.
**Verificación por dominio:** IAM `13` · PPL `16` · STR `13` · EVT `24` · PRT `19` · COM `18` ·
CMP `8` · INS `10` · SYS `1` = `122`.

**Los 35 REQ no funcionales** también tienen destino explícito en
`GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md`: `CROSS_CUTTING` (22), `SYSTEM_INTERNAL` (12),
`EXTERNAL` (1). Ninguno genera CU y ninguno queda `UNMAPPED`.
Verificación: `22 + 12 + 1 = 35`; `122 + 35 = 157`.

## 1.7 Relaciones

| Tipo | Candidatas |
|---|---:|
| `INCLUDE` candidatas | **2** |
| `EXTEND` candidatas | **6** |
| Relaciones **rechazadas** con motivo | **9** |

Detalle en `docs/use-cases/GEI_USE_CASE_RELATION_CANDIDATES_V1.md`.

## 1.8 Decisiones abiertas

| ID | Pregunta | Bloqueante |
|---|---|---|
| `UC-DECISION-01` | ¿Existe un objetivo de consulta de la ficha de un equipo o de una persona? Ningún REQ IN lo expresa | **NO** |
| `UC-DECISION-02` | ¿Existe un objetivo de cierre de la sesión propia? Ningún REQ IN lo expresa | **NO** |
| `REQ-DECISION-NEEDED-01` | Restauración de estructura archivada | **NO** — cerrada para V1 por `DEF-STR-001/002` |
| `REQ-DECISION-NEEDED-02` | Nivel de conformidad de accesibilidad | **NO** — destino Etapa 9 |
| `ACTOR-DECISION-01` | El jugador ve su propio estado de habilitación | **NO** — rige el valor congelado (a) |
| `ACTOR-DECISION-02` | `ACT-ADMIN` cierra jornada | **NO** — rige el valor congelado (a) |

**Bloqueantes: 0.**

---

# 2. CONVENCIONES

## 2.1 IDs

| Convención | Forma | Ejemplo |
|---|---|---|
| Caso de uso | `UC-<DOMINIO>-<NN>` | `UC-EVT-04` |
| Candidato | `UCCAND-<NNNN>` | `UCCAND-0118` |
| Decisión de E3 | `UC-DECISION-<NN>` | `UC-DECISION-01` |
| Feedback de E3 | `UC-FEEDBACK-<NN>` | `UC-FEEDBACK-01` |

Los IDs son **estables**. No se renumeran por preferencia estética. El orden es conceptual: primero
lo que crea, después lo que cambia, después lo que consulta, por dominio.

## 2.2 Campos

| Campo | Regla |
|---|---|
| `GOAL` | Un objetivo que el actor intenta conseguir. Nunca "qué componente toca". |
| `TRIGGER` | Situación, no gesto. Nunca "hace clic en". |
| `SUCCESS OUTCOME` | Hecho verificable y observable por actor o negocio. Nunca "se cierra el modal". |
| `PRECONDITIONS SUMMARY` | Sólo condiciones funcionales que deciden si el CU puede iniciarse. Sin detalle técnico. |
| `AUTHORITY SOURCE` | `RoleAssignment X` · `GuardianRelationship` · `Account` + sesión · `SYSTEM_INTERNAL`. Nunca reconstruido desde `src/**`. |
| `SCOPE` | `SELF` · `CHILD` · `TEAM` · `TEAM_SET` · `CLUB` · `EVENT`. |
| `SUPPORTING REQUIREMENTS` | ≥1 siempre. **Gate: 0 CU sin REQ.** |
| `POTENTIAL CONTEXT` | Nota informativa de dónde suele aparecer. **No es entry point** (§45). Etapa 10. |

## 2.3 Etiquetas de participación

| Etiqueta | Significado |
|---|---|
| `PRIMARY` | El actor inicia el CU |
| `SECONDARY` | El actor interviene en el CU con otra autoridad sobre el mismo hecho |
| `ALTERNATE AUTHORIZED ACTOR` | El actor puede iniciar el CU con idéntico objetivo, flujo y resultado |

## 2.4 Lo que este documento NO es

No es especificación completa. No tiene caminos felices. No tiene diagramas. No tiene entry points
decididos. No diseña superficies. Las decisiones de relación van a
`GEI_USE_CASE_RELATION_CANDIDATES_V1.md`; las de `<<include>>` / `<<extend>>` definitivas, a E4.

---

# 3. CASOS DE USO CANÓNICOS — IAM (10)

## UC-IAM-01 · Iniciar sesión

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Entrar a GEI con una credencial propia yvigor para poder trabajar. |
| **PRIMARY ACTOR(S)** | `ACT-UNAUTHENTICATED` |
| **SECONDARY ACTOR(S)** | `ACT-AUTHENTICATED` (queda establecido como sujeto de la sesión creada) |
| **BENEFICIARY** | La persona que intenta entrar |
| **TRIGGER** | La persona necesita usar GEI y no tiene sesión abierta. |
| **PRECONDITIONS SUMMARY** | La credencial existe; la cuenta no está `DISABLED`; no se superó el límite de intentos. |
| **SUCCESS OUTCOME** | La cuenta queda en sesión válida; el acceso posterior depende de `REQ-IAM-012` (rol vigente **o** delegación con permiso). Credencial inválida ⇒ **sin sesión**, sin revelar si la cuenta existe. |
| **AUTHORITY SOURCE** | credencial establecida; `Account` + sesión una vez creada |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Account`, sesión |
| **OBJECT STATE CONSTRAINTS** | `PENDING` o `DISABLED` ⇒ acceso rechazado, sin sesión |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-001` (P), `REQ-IAM-019`, `REQ-IAM-008`, `REQ-IAM-006`, `REQ-IAM-015` |
| **RELATED BUSINESS RULES** | `REQ-IAM-012` (la sesión por sí sola no da acceso) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Inicio de la aplicación |
| **NOTES** | La decisión de acceso posterior **no** es un CU: `REQ-IAM-012` es `CROSS_CUTTING`. Una cuenta `ACTIVE` sin rol ni delegación satisface ningún actor y queda en `/no-access` sin datos ni destinos. |
| **STATUS** | `FROZEN` |

## UC-IAM-02 · Deshabilitar una cuenta

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Quitarle a una persona el acceso a GEI porque su vínculo con el club cambió o dejó de ser legítimo. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club necesita cortar el acceso de una cuenta. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; el comando no dejaría cero administradores `ACTIVE`/`CLUB`. |
| **SUCCESS OUTCOME** | La cuenta queda `DISABLED` y sus sesiones quedan revocadas de inmediato; queda auditado. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Account` |
| **OBJECT STATE CONSTRAINTS** | `DISABLED` ⇒ revoca sesiones · dejaría 0 admins ⇒ `LAST_ADMIN_REQUIRED`, nada cambia |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-002` (P), `REQ-IAM-013` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` (el período se conserva) · `REQ-INS-009` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | `ACT-ADMIN` no obtiene autoridad deportiva por deshabilitar una cuenta. |
| **STATUS** | `FROZEN` |

## UC-IAM-03 · Emitir un código de activación

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Dar a una cuenta pendiente o deshabilitada una vía de entrada verificable de un solo uso. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona titular de la cuenta |
| **TRIGGER** | Una persona necesita activar su cuenta y hay que habilitarle el acceso. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la cuenta está `PENDING` o `DISABLED`. |
| **SUCCESS OUTCOME** | Existe un código vigente de un solo uso para esa cuenta; máximo **1** código activo por cuenta; 5 intentos fallidos lo invalidan. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Account`, código de activación |
| **OBJECT STATE CONSTRAINTS** | Un código anterior queda invalidado |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-003` (P), `REQ-IAM-002` |
| **RELATED BUSINESS RULES** | `REQ-IAM-014` (username único e inmutable, independiente del código) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | Es la mitad **emisora** de `REQ-IAM-003`. La mitad consumidora es `UC-IAM-04`. E2 nombró `ACT-ADMIN` como primario de este REQ y esa es la razón de la separación. |
| **STATUS** | `FROZEN` |

## UC-IAM-04 · Activar una cuenta con un código de un solo uso

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Activar mi cuenta con el código que me entregaron, sin que eso me deje conectada. |
| **PRIMARY ACTOR(S)** | `ACT-UNAUTHENTICATED` |
| **SECONDARY ACTOR(S)** | `ACT-ADMIN` (emitió el código) |
| **BENEFICIARY** | La persona titular de la cuenta |
| **TRIGGER** | La persona recibió un código de activación válido. |
| **PRECONDITIONS SUMMARY** | La cuenta existe; hay un código vigente y de un solo uso; quedan intentos disponibles. |
| **SUCCESS OUTCOME** | La cuenta queda `ACTIVE` y auditada. **No se crea sesión.** |
| **AUTHORITY SOURCE** | código de un solo uso emitido por `ACT-ADMIN` |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Account` `PENDING` o `DISABLED` → `ACTIVE` |
| **OBJECT STATE CONSTRAINTS** | 5 intentos fallidos ⇒ el código se invalida |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-003` (P), `REQ-PPL-003`, `REQ-IAM-002` |
| **RELATED BUSINESS RULES** | `REQ-IAM-001` AC 3 (sin sesión, hay que entrar aparte) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Activación de cuenta |
| **NOTES** | Cubre `PENDING → ACTIVE` (activación) y `DISABLED → ACTIVE` (reactivación) como **un** CU con dos precondiciones: el resultado observable es idéntico. §18 del brief. |
| **STATUS** | `FROZEN` |

## UC-IAM-05 · Restablecer el acceso de una cuenta

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Restablecer el acceso de una persona que perdió su credencial, sin que el club tenga que conocer su contraseña. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona que recuperó el acceso; el club |
| **TRIGGER** | Una persona no puede entrar y pide restablecimiento; la administración lo atiende. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` con alcance `CLUB`; el comando no dejaría cero administradores. |
| **SUCCESS OUTCOME** | Versión de credencial incrementada; sesiones revocadas; código anterior invalidado; código nuevo emitido; todo auditado. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Account`, credencial |
| **OBJECT STATE CONSTRAINTS** | Dejaría 0 admins `ACTIVE`/`CLUB` ⇒ `LAST_ADMIN_REQUIRED` |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-004` (P), `REQ-IAM-013`, `REQ-IAM-003` |
| **RELATED BUSINESS RULES** | `REQ-IAM-015` (política de contraseñas) · `OUT-IAM-003` (la recuperación self-service **no** es de V1) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | No se crea un CU "recuperar mi contraseña": `OUT-IAM-003` lo excluye explícitamente. |
| **STATUS** | `FROZEN` |

## UC-IAM-06 · Cambiar mi contraseña

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Cambiar mi propia contraseña para que nadie más pueda entrar con ella. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` y sus 6 especializaciones concretas |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona sospecha que su credencial está comprometida o quiere rotarla. |
| **PRECONDITIONS SUMMARY** | Sesión vigente; la contraseña actual se verifica; la nueva cumple la política. |
| **SUCCESS OUTCOME** | La nueva contraseña queda aplicada y versionada. Si es inválida, la operación se rechaza **sin mutar nada**; nunca se informa éxito sin aplicar. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | credencial propia |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-005` (P) |
| **RELATED BUSINESS RULES** | `REQ-IAM-015` · `REQ-IAM-019` · `REQ-SYS-009` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Seguridad del perfil |
| **NOTES** | Es la capacidad propia que `ACT-AUTHENTICATED` generaliza legítimamente (E2 §11.1). |
| **STATUS** | `FROZEN` |

## UC-IAM-07 · Consultar mis sesiones activas

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Saber si hay un acceso abierto a mi cuenta que no reconozco. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` y sus 6 especializaciones concretas |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona revisa su seguridad. |
| **PRECONDITIONS SUMMARY** | Sesión vigente; la cuenta tiene al menos una sesión. |
| **SUCCESS OUTCOME** | La persona ve su sesión actual y las demás, **con la actual distinguida**. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | sesiones propias |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-010` (P), `REQ-IAM-008` |
| **RELATED BUSINESS RULES** | `OUT-SYS-001` (**no** es un historial personal de actividad) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Seguridad del perfil |
| **NOTES** | La "última actividad" es estado de seguridad de la cuenta, no una línea de tiempo personal. |
| **STATUS** | `FROZEN` |

## UC-IAM-08 · Cerrar una sesión remota

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Cortar un acceso abierto a mi cuenta que no reconozco. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` y sus 6 especializaciones concretas |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona detecta una sesión remota que no reconoce. |
| **PRECONDITIONS SUMMARY** | Sesión vigente; la sesión a cerrar pertenece a la misma cuenta y **no** es la actual. |
| **SUCCESS OUTCOME** | Esa sesión queda invalidada en el servidor de inmediato y el cierre queda auditado. Desde ese equipo, cualquier operación recibe `SESSION_EXPIRED` y no ejecuta nada. |
| **AUTHORITY SOURCE** | `Account` + sesión · autorización de autoría de la sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | sesión propia remota |
| **OBJECT STATE CONSTRAINTS** | No aplica a la sesión actual |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-010` (P), `REQ-IAM-011` |
| **RELATED BUSINESS RULES** | `REQ-IAM-008` · `REQ-INS-009` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Seguridad del perfil |
| **NOTES** | `REQ-IAM-010` dice explícitamente "sesión **remota**". El cierre de la sesión propia no está expresado por ningún REQ: es `UC-DECISION-02` y queda como **exclusión explícita**. |
| **STATUS** | `FROZEN` |

## UC-IAM-09 · Reautenticar para una gestión sensible

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | Volver a demostrar mi identidad ante una operación sensible que la autoridad ya me permite pero que no debe apoyarse sólo en una sesión vieja. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN`, `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club y la persona cuya cuenta se protege |
| **TRIGGER** | El actor va a ejecutar una gestión sensible y su sesión no tiene reautenticación vigente. |
| **PRECONDITIONS SUMMARY** | La persona tiene cuenta `ACTIVE`; existe una ventana de reautenticación vigente o se puede abrir. |
| **SUCCESS OUTCOME** | La identidad queda verificada con una ventana de 10 minutos; la operación sensible queda habilitada. Vencida la ventana, la operación no se ejecuta. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | sesión, identidad del actor |
| **OBJECT STATE CONSTRAINTS** | Ventana vencida ⇒ la operación no se ejecuta |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-009` (P) |
| **RELATED BUSINESS RULES** | `REQ-IAM-001` · `REQ-IAM-015` |
| **INCLUDE CANDIDATES** | destino preferente |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Cualquier gestión sensible de administración o de Subcomisión |
| **NOTES** | **`RWS-04`: sin superficie actual.** Comportamiento observable, respaldado por REQ propio y reusable en muchas operaciones: cumple los tres criterios del §25 del brief. Se propone como `<<include>>`, no como precondición silenciosa. |
| **STATUS** | `FROZEN` |

## UC-IAM-10 · Retomar el trabajo tras una interrupción de sesión

| Campo | Valor |
|---|---|
| **DOMAIN** | IAM |
| **GOAL** | No perder lo que estaba haciendo cuando la sesión se cortó, y poder repetir la misma intención sin duplicar efectos. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` y sus 6 especializaciones concretas |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La sesión se interrumpe mientras la persona tenía trabajo en curso. |
| **PRECONDITIONS SUMMARY** | Había una orden en curso; la interrupción no fue deliberada del actor. |
| **SUCCESS OUTCOME** | El trabajo ingressado se preserva; al reintentar con la misma intención el resultado se confirma sin duplicar y sin éxito falso. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | trabajo en curso, orden pendiente |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-IAM-020` (P), `REQ-SYS-016`, `REQ-SYS-010` |
| **RELATED BUSINESS RULES** | `REQ-IAM-008` · `REQ-SYS-009` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Cualquier superficie con formulario u orden |
| **NOTES** | **`RWS-08`: sin superficie actual.** Sí es un objetivo: el resultado observable —no perder el trabajo y no duplicar— es distinto del objetivo del comando que se interrumpió. |
| **STATUS** | `FROZEN` |

---

# 4. CASOS DE USO CANÓNICOS — PPL (17)

## UC-PPL-01 · Registrar una persona

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Dar de alta en el club a una persona con su identidad real. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona registrada; el club |
| **TRIGGER** | El club incorpora a una persona. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; si se informa DNI, no colisiona con otra persona. |
| **SUCCESS OUTCOME** | Existe una `Person` con nombre y apellido; el DNI, si existe, es único. El resto de los datos es opcional y la inexistencia se declara, no se disimula. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Person` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-001` (P), `REQ-PPL-011` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` (no hay eliminación permanente) · `REQ-IAM-014` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de personas |
| **NOTES** | Registrar la persona **no** la convierte en jugadora: eso es `UC-PPL-06`. |
| **STATUS** | `FROZEN` |

## UC-PPL-02 · Completar el perfil de una jugadora

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Dejar el perfil de una jugadora con los seis datos que el club necesita, para que no quede bloqueada. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | `ACT-PLAYER` (recibe el aviso y ve qué falta) |
| **BENEFICIARY** | La jugadora |
| **TRIGGER** | La jugadora fue asignada a un roster y su perfil está incompleto. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la persona tiene `TeamAssignment` vigente. |
| **SUCCESS OUTCOME** | Los seis datos están; ya no se emite `PLAYER_PROFILE_INCOMPLETE`. Mientras falte alguno, el sistema lo dice **indicando qué falta**. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Person` (datos de perfil de jugadora) |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-002` (P), `REQ-PPL-013` |
| **RELATED BUSINESS RULES** | `REQ-PPL-011` (autoridad por campo) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | de `UC-PPL-06` (condición: roster asignado) |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | La jugadora **no** edita lo que administra el club. Su camino es enterarse y avisar: `UC-PPL-15`. |
| **STATUS** | `FROZEN` |

## UC-PPL-03 · Vincular una cuenta a una persona

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Hacer que la cuenta de acceso de una persona resuelva exactamente a ella y que ella resuelva a una sola cuenta. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | El club habilita el acceso de una persona ya registrada. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la `Person` existe; la `Account` no está vinculada a otra persona. |
| **SUCCESS OUTCOME** | La cuenta resuelve a exactamente una persona y la persona tiene como máximo una cuenta. Un conflicto se rechaza. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Person` + `Account` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-003` (P) |
| **RELATED BUSINESS RULES** | `REQ-IAM-014` (username único e inmutable) · `REQ-IAM-003` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | Objetivo distinto de `UC-PPL-01` con resultado distinto: la identidad ya existe; lo que se resuelve es **quién** entra. |
| **STATUS** | `FROZEN` |

## UC-PPL-04 · Registrar una membresía al club

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Dejar constancia de que una persona pertenece al club desde una fecha y hasta otra. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona; el club |
| **TRIGGER** | El club incorpora a una persona como miembro. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la `Person` existe. |
| **SUCCESS OUTCOME** | El período de membresía queda registrado. Toda afiliación o rol interno posterior exige membresía vigente. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Membership` |
| **OBJECT STATE CONSTRAINTS** | Período `[valid_from, valid_until)` |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-004` (P), `REQ-PPL-016` |
| **RELATED BUSINESS RULES** | `REQ-PPL-007` · `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | La membresía **no** habilita por sí sola el acceso a la aplicación: `REQ-IAM-012` exige rol o delegación. |
| **STATUS** | `FROZEN` |

## UC-PPL-05 · Finalizar una membresía al club

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Cerrar la pertenencia de una persona al club sin borrar su historia. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | La persona deja de pertenecer al club. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; no hay afiliaciones ni roles internos con dependencia activa. |
| **SUCCESS OUTCOME** | El período queda cerrado con fecha. Con dependencia activa, la operación se rechaza **nombrando la dependencia**; el período anterior se conserva siempre. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Membership` |
| **OBJECT STATE CONSTRAINTS** | Con dependencia activa ⇒ rechazada |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-004` (P), `REQ-PPL-015` |
| **RELATED BUSINESS RULES** | `REQ-PPL-006` · `REQ-INS-009` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | `OUT-PPL-002`: no existe eliminar permanentemente a una jugadora. |
| **STATUS** | `FROZEN` |

## UC-PPL-06 · Incorporar una jugadora a un equipo

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Poner a una jugadora en un equipo con su afiliación y su rol de jugadora, en una sola operación. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La jugadora; el equipo |
| **TRIGGER** | El club incorpora a una jugadora a un equipo. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la persona tiene membresía vigente; la combinación temporada + división + línea del equipo está disponible. |
| **SUCCESS OUTCOME** | En una sola operación atómica quedan la `TeamAssignment` y el `RoleAssignment PLAYER` sobre ese equipo. Si el equipo es `CAPTAIN`, además queda `CAPTAIN`. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `TeamAssignment`, `RoleAssignment` |
| **OBJECT STATE CONSTRAINTS** | Membresía vigente exigida · combinación de equipo única |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-005` (P), `REQ-PPL-007` (P), `REQ-PPL-004` |
| **RELATED BUSINESS RULES** | `REQ-PPL-006` · `REQ-PPL-002` · `REQ-STR-004` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona · Administración de un equipo |
| **NOTES** | El entrenador se asigna **por rol**, no por afiliación (`REQ-PPL-005`). |
| **STATUS** | `FROZEN` |

## UC-PPL-07 · Cambiar de equipo a una jugadora

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Trasladar a una jugadora a otro equipo del club, cerrando lo anterior y abriendo lo nuevo. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | `ACT-CAPTAIN` (afectada: **no** se le transfiere la capitanía) |
| **BENEFICIARY** | La jugadora; los dos equipos |
| **TRIGGER** | El club decide que la jugadora cambia de equipo. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; membresía vigente; destino con combinación única disponible. |
| **SUCCESS OUTCOME** | La afiliación y el rol `PLAYER` anteriores quedan cerrados con fecha y se crea la afiliación y el rol nuevos. El sistema **explica que `CAPTAIN` no se transfiere automáticamente**. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `TeamAssignment`, `RoleAssignment` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-007` (P), `REQ-PPL-005` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` · `REQ-INS-009` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | `ACT-CAPTAIN` es actor **secundario afectado**, no participante. Perder la capitanía es una consecuencia que el sistema debe hacer explícita. |
| **STATUS** | `FROZEN` |

## UC-PPL-08 · Retirar a una jugadora del equipo

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Sacar a una jugadora del equipo cerrando todo lo que le daba de ese vínculo, sin borrar historia. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | `ACT-CAPTAIN` (si existía, se cierra) |
| **BENEFICIARY** | El club; el equipo |
| **TRIGGER** | La jugadora deja el equipo. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la `TeamAssignment` está vigente. |
| **SUCCESS OUTCOME** | Quedan cerrados con fecha la `TeamAssignment`, el rol `PLAYER` y el rol `CAPTAIN` si existía. El pasado se conserva. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `TeamAssignment`, `RoleAssignment` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-007` (P), `REQ-PPL-015` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-004` (la membresía **no** se cierra aquí) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | Retirar del equipo **no** es finalizar la membresía. Son dos CU porque tienen resultados y dependencias distintas. |
| **STATUS** | `FROZEN` |

## UC-PPL-09 · Asignar un rol con alcance

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Dar a una persona una capacidad concreta —capitana, entrenador, Subcomisión, administración— sobre un alcance concreto. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona que recibe el rol; el club |
| **TRIGGER** | El club necesita que una persona pueda hacer algo que hoy no puede. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la combinación rol + alcance pertenece a la tabla de alcances válidos; la membresía está vigente. |
| **SUCCESS OUTCOME** | El `RoleAssignment` queda vigente con su alcance. Combinación inválida ⇒ `INVALID_ROLE_SCOPE`. Varios roles vigentes ⇒ la autoridad es la **unión** evaluada por acción. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `RoleAssignment` |
| **OBJECT STATE CONSTRAINTS** | Rol expirado **no computa** |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-006` (P) |
| **RELATED BUSINESS RULES** | `REQ-IAM-016` · `REQ-PPL-012` (un rol no es una relación de guardián) · `REQ-IAM-013` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | Asignar `CAPTAIN` crea además el contexto de la invariante E2 §7.5, pero **no** crea `PLAYER` si no existe: eso es `UC-PPL-06`. |
| **STATUS** | `FROZEN` |

## UC-PPL-10 · Finalizar un rol asignado

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Quitarle a una persona una capacidad que ya no corresponde. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | La persona deja de ejercer la función. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; el rol está vigente. |
| **SUCCESS OUTCOME** | El `RoleAssignment` queda cerrado con fecha y deja de computar. La historia se conserva. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `RoleAssignment` |
| **OBJECT STATE CONSTRAINTS** | Con dependencia activa ⇒ se nombra la dependencia |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-006` (P), `REQ-PPL-007` (P), `REQ-PPL-015` |
| **RELATED BUSINESS RULES** | `REQ-IAM-013` (el último administrador no se puede dejar en 0) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | Finalizar `CAPTAIN` **no** cierra `PLAYER`: son roles independientes (E2 §12.1). |
| **STATUS** | `FROZEN` |

## UC-PPL-11 · Registrar una relación de representación

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Declarar qué adulto puede actuar por un menor y con qué permisos. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | `ACT-GUARDIAN` (queda establecido como sujeto de la relación) |
| **BENEFICIARY** | El menor; el guardián |
| **TRIGGER** | El club necesita que un adulto pueda ver o responder por un menor. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; el sujeto es un menor; el adulto tiene identidad. |
| **SUCCESS OUTCOME** | Existe una `GuardianRelationship` individual para ese menor con sus flags: `can_view_child_info` y `can_respond_availability`, **independientes entre sí**. Quedar con uno solo significa que el permiso faltante se explica. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `GuardianRelationship` |
| **OBJECT STATE CONSTRAINTS** | Relación individual por menor |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-008` (P), `REQ-PPL-012` |
| **RELATED BUSINESS RULES** | `REQ-PPL-009` · `REQ-IAM-012` · `REQ-COM-012` (sin accesorio comunicacional) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | La relación **no** otorga rol deportivo, ni accesorio de comunicación, ni autoridad de gestión. E2 §5.5. |
| **STATUS** | `FROZEN` |

## UC-PPL-12 · Finalizar una relación de representación

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Quitarle a un adulto la capacidad de actuar por un menor, conservando el período. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | `ACT-GUARDIAN` (deja de tener acceso) |
| **BENEFICIARY** | El menor |
| **TRIGGER** | El club deja de necesitar esa delegación. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la relación está vigente. |
| **SUCCESS OUTCOME** | La relación queda cerrada con fecha; deja de conceder acceso y conserva el período. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `GuardianRelationship` |
| **OBJECT STATE CONSTRAINTS** | Finalizada ⇒ no concede acceso |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-008` (P), `REQ-PPL-015` |
| **RELATED BUSINESS RULES** | `REQ-PPL-012` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-PPL-13 · Consultar la información del menor delegado

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Saber cómo va mi hijo o hija en el club sin ver nada que no me corresponda. |
| **PRIMARY ACTOR(S)** | `ACT-GUARDIAN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El menor y su guardián |
| **TRIGGER** | El guardián quiere ver la información de su menor. |
| **PRECONDITIONS SUMMARY** | Relación vigente con `can_view_child_info`; el menor es el sujeto. |
| **SUCCESS OUTCOME** | El guardián ve nombre y apellido, equipo, eventos relevantes y disponibilidad relevante del **su** menor. |
| **AUTHORITY SOURCE** | `GuardianRelationship.can_view_child_info` |
| **SCOPE** | `CHILD` |
| **OBJECT / SUBJECT** | `Person` (menor), campos filtrados |
| **OBJECT STATE CONSTRAINTS** | Relación finalizada ⇒ sin acceso |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-009` (P), `REQ-PPL-008` |
| **RELATED BUSINESS RULES** | `REQ-PPL-011` (el campo no autorizado **no existe en la respuesta**) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Proyecciones del menor seleccionado |
| **NOTES** | **Nunca** concede: `DNI`, fecha de nacimiento completa, información administrativa, motivo ni origen de habilitación, conversaciones privadas, auditoría, roles administrativos, `CONTACT` del menor, ni datos de **otro** menor. E2 §5.4. |
| **STATUS** | `FROZEN` |

## UC-PPL-14 · Consultar quién actúa por mi cuenta

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Saber qué adultos pueden_ver o responder por mí y con qué permisos. |
| **PRIMARY ACTOR(S)** | `ACT-PLAYER` (menor) · `ACT-GUARDIAN` (sobre su propia relación) |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El menor |
| **TRIGGER** | El menor quiere saber quién actúa en su nombre. |
| **PRECONDITIONS SUMMARY** | El sujeto es un menor; existen relaciones vigentes. |
| **SUCCESS OUTCOME** | El menor ve la lista de adultos y sus permisos. **No hay operación de edición.** |
| **AUTHORITY SOURCE** | `Account` propia + relación activa (lectura) |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `GuardianRelationship` (sólo lectura) |
| **OBJECT STATE CONSTRAINTS** | Sólo relaciones vigentes |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-010` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-008` (el sujeto delegado es siempre un menor) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Perfil propio |
| **NOTES** | `ACTOR-FEEDBACK-08` resuelto: el sujeto es siempre un menor, por PT §20 y `REQ-PPL-008`. |
| **STATUS** | `FROZEN` |

## UC-PPL-15 · Conocer qué falta en mi perfil y cómo completarlo

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | No quedarme bloqueada sin salida y sin saber qué hacer. |
| **PRIMARY ACTOR(S)** | `ACT-PLAYER` |
| **SECONDARY ACTOR(S)** | `ACT-ADMIN` (destinatario del aviso) |
| **BENEFICIARY** | La jugadora |
| **TRIGGER** | El club ve que el perfil de una jugadora está incompleto. |
| **PRECONDITIONS SUMMARY** | La jugadora tiene rol `PLAYER` vigente y perfil incompleto. |
| **SUCCESS OUTCOME** | La jugadora ve **qué** falta y cuál es el siguiente paso —avisar a administración—. No puede editar lo que administra el club. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Person` propia |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-013` (P), `REQ-PPL-002` |
| **RELATED BUSINESS RULES** | `REQ-PPL-011` · `REQ-SYS-010` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Inicio |
| **NOTES** | Es el precedente de producto que E2 §ACTOR-DECISION-01 usa como argumento: la jugadora **sí** debe poder entender su propio bloqueo. |
| **STATUS** | `FROZEN` |

## UC-PPL-16 · Consultar mi perfil

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Ver quién soy en el club, desde cuándo pertenezco y qué roles tengo con qué alcance. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` y sus 6 especializaciones concretas |
| **SECONDARY ACTOR(S)** | `ACT-GUARDIAN` (conmutador de menor) |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona quiere ver su propia ficha. |
| **PRECONDITIONS SUMMARY** | Sesión vigente. |
| **SUCCESS OUTCOME** | Ve identidad, pertenencia con vigencia, roles con alcance resuelto, estado de cuenta y acceso a seguridad. Con **varios** menores, el selector cambia las proyecciones relevantes; con **uno**, no hay selector. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Person` propia |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-016` (P) |
| **RELATED BUSINESS RULES** | `REQ-IAM-012` · `REQ-PPL-006` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Perfil propio |
| **NOTES** | Cambiar de menor cambia la **proyección**, no el actor. E2 §5.6. |
| **STATUS** | `FROZEN` |

## UC-PPL-17 · Editar mi contacto

| Campo | Valor |
|---|---|
| **DOMAIN** | PPL |
| **GOAL** | Mantener mi teléfono y mi correo al día. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` y sus 6 especializaciones concretas |
| **SECONDARY ACTOR(S)** | `ACT-GUARDIAN` (también los suyos propios) |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona cambia de teléfono o de correo. |
| **PRECONDITIONS SUMMARY** | Sesión vigente. |
| **SUCCESS OUTCOME** | El contacto propio queda actualizado. El guardián **sí** puede ver y modificar los suyos; el del menor **no** se concede automáticamente. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | datos de contacto propios |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PPL-016` (P), `REQ-PPL-009` |
| **RELATED BUSINESS RULES** | `REQ-PPL-011` · `REQ-SYS-010` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Perfil propio |
| **NOTES** | `UC-IAM-06` (cambiar la contraseña) es un CU hermano: cambia credencial, no contacto. |
| **STATUS** | `FROZEN` |

---

# 5. CASOS DE USO CANÓNICOS — STR (15)

## UC-STR-01 · Registrar una temporada

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Poder asociar actividades y equipos a un período del club. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club abre la planificación de un nuevo período. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente. |
| **SUCCESS OUTCOME** | Existe una `Season` con nombre y fechas. **Sin ciclo de estado** y sin eliminación. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Season` |
| **OBJECT STATE CONSTRAINTS** | Histórica; sin hard-delete |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-001` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-STR-011` (referencias por identidad) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | **`RWS-01`: sin superficie actual.** |
| **STATUS** | `FROZEN` |

## UC-STR-02 · Actualizar los datos de una temporada

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Corregir el nombre o las fechas de una temporada. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club corrige o ajusta el período. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la temporada existe. |
| **SUCCESS OUTCOME** | Nombre y/o fechas quedan actualizados. La historia no se reescribe ni se borra. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Season` |
| **OBJECT STATE CONSTRAINTS** | Sin ciclo de estado |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-001` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-STR-011` · `REQ-PPL-014` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | `RWS-01`. Cambiar las fechas puede cambiar la etiqueta de los equipos derivados: no los reatribuye. |
| **STATUS** | `FROZEN` |

## UC-STR-03 · Registrar una división

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Crear un nivel de organización del club del que dependan las líneas. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club organiza su estructura deportiva. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente. |
| **SUCCESS OUTCOME** | Existe una `Division`. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Division` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-002` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-PPL-014` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | `ACT-SUBCOMMITTEE` **no** administra estructura (`REQ-STR-009`). |
| **STATUS** | `FROZEN` |

## UC-STR-04 · Actualizar una división

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Renombrar una división. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club corrige el nombre de una división. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la división existe. |
| **SUCCESS OUTCOME** | El nombre queda actualizado y las referencias se resuelven por identidad. Con **equipos activos**, el renombrado se rechaza. La historia se conserva. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Division` |
| **OBJECT STATE CONSTRAINTS** | Con equipos activos ⇒ renombrar rechazado |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-002` (P), `REQ-PPL-014` (P) |
| **RELATED BUSINESS RULES** | `REQ-STR-011` · `REQ-STR-010` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | `DEF-STR-001`: la restauración de una división archivada **no** es de V1. |
| **STATUS** | `FROZEN` |

## UC-STR-05 · Archivar una división

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Retirar una división que ya no se usa sin perder lo que dependió de ella. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club deja de usar una división. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; no hay dependencia activa. |
| **SUCCESS OUTCOME** | La división queda archivada. Con dependencia activa, la operación se rechaza **nombrando la dependencia**. Sin ella, prospera y la historia se conserva. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Division` |
| **OBJECT STATE CONSTRAINTS** | Con dependencia activa ⇒ rechazada |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-002` (P), `REQ-STR-006` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | **Terminal en V1.** El CURRENT ofrece "Restaurar": es `IMPLEMENTATION_WITHOUT_REQUIREMENT` bajo `REQ-DECISION-NEEDED-01`. |
| **STATUS** | `FROZEN` |

## UC-STR-06 · Registrar una línea

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Crear una línea dentro de una división. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club organiza su estructura deportiva. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la división padre existe. |
| **SUCCESS OUTCOME** | Existe una `Line`; su etiqueta completa incluye división y temporada. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Line` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-003` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-STR-010` · `REQ-STR-011` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-STR-07 · Actualizar una línea

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Renombrar una línea. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club corrige el nombre de una línea. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la línea existe. |
| **SUCCESS OUTCOME** | El nombre queda actualizado. Con **equipos activos**, se rechaza. La historia se conserva. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Line` |
| **OBJECT STATE CONSTRAINTS** | Con equipos activos ⇒ renombrar rechazado |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-003` (P), `REQ-PPL-014` (P) |
| **RELATED BUSINESS RULES** | `REQ-STR-011` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | `DEF-STR-002`: restaurar una línea archivada **no** es de V1. |
| **STATUS** | `FROZEN` |

## UC-STR-08 · Archivar una línea

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Retirar una línea que ya no se usa sin perder lo que dependió de ella. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club deja de usar una línea. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; no hay dependencia activa. |
| **SUCCESS OUTCOME** | La línea queda archivada. Con dependencia activa, se rechaza nombrando la dependencia. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Line` |
| **OBJECT STATE CONSTRAINTS** | Con dependencia activa ⇒ rechazada |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-003` (P), `REQ-STR-006` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | **Terminal en V1.** |
| **STATUS** | `FROZEN` |

## UC-STR-09 · Registrar un equipo

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Crear el equipo que representa la combinación única de temporada, división y línea. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; el equipo |
| **TRIGGER** | El club necesita un equipo nuevo. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; temporada, división y línea existen. |
| **SUCCESS OUTCOME** | Existe un `Team` en `DRAFT` con la combinación única. Combinación repetida ⇒ rechazada. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Team` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT` al crearse · combinación única |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-004` (P), `REQ-STR-008` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-014` · `REQ-STR-010` · `REQ-STR-013` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club · Administración de un equipo |
| **NOTES** | **`RWS-02`: sin superficie actual** (`sin create/edit`). El nombre se deriva de temporada, división y línea. |
| **STATUS** | `FROZEN` |

## UC-STR-10 · Actualizar un equipo

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Corregir los datos de un equipo sin cambiar su identidad. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; el equipo |
| **TRIGGER** | El club corrige un dato del equipo. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; el equipo existe. |
| **SUCCESS OUTCOME** | El dato queda actualizado; las referencias por identidad no se reatribuyen. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Team` |
| **OBJECT STATE CONSTRAINTS** | `ARCHIVED` ⇒ no editable |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-008` (P), `REQ-STR-004` |
| **RELATED BUSINESS RULES** | `REQ-PPL-014` (identidad estable) · `REQ-STR-011` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de un equipo |
| **NOTES** | La edición no incluye cambiar la combinación temporada/división/línea: eso sería otro equipo. |
| **STATUS** | `FROZEN` |

## UC-STR-11 · Activar un equipo

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Dejar un equipo disponible para afiliaciones, eventos y competencias. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; el equipo |
| **TRIGGER** | El equipo está completo y el club quiere usarlo. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; el equipo está en `DRAFT`. |
| **SUCCESS OUTCOME** | El equipo queda `ACTIVE` y disponible para eventos, afiliaciones e inscripciones. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Team` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT → ACTIVE` |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-004` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | PT §9 |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de un equipo |
| **NOTES** | `ARCHIVED → ACTIVE` **no** existe en V1: es la transición de restore, DEFER por `DEF-STR-001/002` y `REQ-DECISION-NEEDED-01`. |
| **STATUS** | `FROZEN` |

## UC-STR-12 · Archivar un equipo

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Retirar un equipo que el club ya no usa sin perder su historia deportiva. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club deja de usar un equipo. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; no hay dependencia activa. |
| **SUCCESS OUTCOME** | El equipo queda `ARCHIVED`. Con dependencia activa, se rechaza nombrando la dependencia. Sus eventos e inscripciones quedan históricos y consultables. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Team` |
| **OBJECT STATE CONSTRAINTS** | `ACTIVE → ARCHIVED` · con dependencia activa ⇒ rechazada |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-004` (P), `REQ-STR-006` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de un equipo |
| **NOTES** | **Terminal en V1.** |
| **STATUS** | `FROZEN` |

## UC-STR-13 · Registrar una sede

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Dar de alta un lugar donde el club juega o se reúne. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club suma un lugar. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente. |
| **SUCCESS OUTCOME** | Existe una `Venue` con nombre, dirección y etiqueta de cancha opcional; su identidad es estable por identificador. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Venue` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-005` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-STR-013` (se elige de una lista) · `REQ-STR-011` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-STR-14 · Corregir los datos de una sede

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Corregir el nombre, la dirección o la etiqueta de cancha de una sede sin alterar la agenda de nadie. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; las personas alcanzadas por los eventos de esa sede |
| **TRIGGER** | El club corrige un dato de la sede. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; la sede existe. |
| **SUCCESS OUTCOME** | El dato queda corregido. **No** reprograma eventos, **no** pide reconfirmación, **no** incrementa la revisión de coordinación y **no** notifica. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Venue` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-012` (P, regla A), `REQ-STR-005` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-EVT-011` (regla B: cambiar la sede **de un evento** sí es cambio material) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | La asimetría de reglas A/B es explícita en el Freeze §4.3 y en PT §11. Es la prueba de que la identidad de la sede y su uso en un evento son hechos distintos. |
| **STATUS** | `FROZEN` |

## UC-STR-15 · Archivar una sede

| Campo | Valor |
|---|---|
| **DOMAIN** | STR |
| **GOAL** | Retirar una sede que el club ya no usa sin perder los eventos que la usaron. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club deja de usar una sede. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente; no hay dependencia activa. |
| **SUCCESS OUTCOME** | La sede queda archivada. Con dependencia activa, se rechaza nombrando la dependencia. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Venue` |
| **OBJECT STATE CONSTRAINTS** | Con dependencia activa ⇒ rechazada |
| **SUPPORTING REQUIREMENTS** | `REQ-STR-005` (P), `REQ-STR-006` (P), `REQ-STR-008` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` · `REQ-EVT-024` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Estructura del club |
| **NOTES** | **Terminal en V1.** `OUT-STR-001`: no hay reserva de canchas ni de sedes. |
| **STATUS** | `FROZEN` |

---

# 6. CASOS DE USO CANÓNICOS — EVT (19)

## UC-EVT-01 · Crear un entrenamiento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Programar un entrenamiento para las personas que quiero convocar, y que quede visible para ellas. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM` o `EVENT`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) |
| **SECONDARY ACTOR(S)** | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-GUARDIAN` (quedan alcanzados por el evento) |
| **BENEFICIARY** | Las personas alcanzadas |
| **TRIGGER** | El entrenador o la Subcomisión necesita coordinar un entrenamiento. |
| **PRECONDITIONS SUMMARY** | Rol vigente con alcance; el destino es válido; las invariantes de fecha y horario se cumplen. |
| **SUCCESS OUTCOME** | Existe un evento de tipo `TRAINING` con horario vigente y destinatarios válidos, disponible para las personas alcanzadas. Sin ningún destino ⇒ `EVENT_TARGET_INVALID`. `ACT-ADMIN` sin autoridad ⇒ denegado. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | Nace `SCHEDULED` en la misma operación; no queda borrador observable |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-002` (P), `REQ-EVT-009`, `REQ-EVT-005`, `REQ-EVT-001`, `REQ-EVT-007` |
| **RELATED BUSINESS RULES** | `REQ-STR-012` · `REQ-COM-016` (notificación por cambio de destinatarios) · `REQ-SYS-018` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-EVT-12` (condición: `STALE_VERSION`) |
| **POTENTIAL CONTEXT** | Calendario · Ficha de evento |
| **NOTES** | Objetivo distinto de `UC-EVT-02`: las reglas de destino son distintas y el resultado esperado por el club es distinto. Un solo CU "crear evento" habría ocultado ambos. |
| **STATUS** | `FROZEN` |

## UC-EVT-02 · Crear un partido

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Programar un partido para un equipo concreto. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) |
| **SECONDARY ACTOR(S)** | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-GUARDIAN` (alcanzados) |
| **BENEFICIARY** | El equipo; las personas alcanzadas |
| **TRIGGER** | Hay que jugar un partido y hay que dejarlo asentado para todos. |
| **PRECONDITIONS SUMMARY** | Rol vigente con alcance; exactamente **un** equipo destino; si hay competencia de jornada, la inscripción de esa competencia es compatible; invariantes de fecha y horario. |
| **SUCCESS OUTCOME** | Existe un evento `MATCH` con **exactamente un** equipo, inmutable una vez programado, y el equipo queda alcanzable por sus eventos. Más de un equipo, personas destino o alcance de club ⇒ `EVENT_TARGET_INVALID`. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` `MATCH` |
| **OBJECT STATE CONSTRAINTS** | El equipo del partido es inmutable una vez programado |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-003` (P), `REQ-EVT-006`, `REQ-EVT-009`, `REQ-EVT-001`, `REQ-EVT-007` |
| **RELATED BUSINESS RULES** | `REQ-CMP-005` (uso de la inscripción) · `REQ-EVT-005` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-EVT-12` (condición: `STALE_VERSION`) |
| **POTENTIAL CONTEXT** | Calendario · Ficha de evento |
| **NOTES** | El equipo del partido **no** se cambia después de programado: rechazada. Antes de programar, el cambio es un cambio material (§`UC-EVT-04`). |
| **STATUS** | `FROZEN` |

## UC-EVT-03 · Crear un evento del club

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Convocar a una actividad que no es entrenar ni jugar: reunión, tarea, evento de organización. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-COACH` (alcance `EVENT`) |
| **SECONDARY ACTOR(S)** | `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-GUARDIAN` (alcanzados) |
| **BENEFICIARY** | El club; las personas alcanzadas |
| **TRIGGER** | El club convoca a una actividad que no es deportiva. |
| **PRECONDITIONS SUMMARY** | Rol vigente con alcance; los marcadores de alcance son coherentes. |
| **SUCCESS OUTCOME** | Existe un evento de club: para todo el club ⇒ **cero** destinos de equipo y de persona; dirigido ⇒ al menos un destino. Marcadores contradictorios ⇒ rechazado. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment COACH` |
| **SCOPE** | `CLUB` / `EVENT` |
| **OBJECT / SUBJECT** | `Event` `CLUB_EVENT` |
| **OBJECT STATE CONSTRAINTS** | Nace `SCHEDULED` |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-004` (P), `REQ-EVT-005`, `REQ-EVT-009`, `REQ-EVT-001` |
| **RELATED BUSINESS RULES** | `REQ-EVT-017` (un evento de club **no** tiene convocatoria ni resultado) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-EVT-12` (condición: `STALE_VERSION`) |
| **POTENTIAL CONTEXT** | Calendario |
| **NOTES** | Un evento de club **sí** admite disponibilidad (PT §12). Lo que no admite es convocatoria ni resultado. |
| **STATUS** | `FROZEN` |

## UC-EVT-04 · Editar un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Corregir o cambiar los datos de un evento que ya programé. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM` o `EVENT`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) |
| **SECONDARY ACTOR(S)** | `ACT-CAPTAIN` (sólo logística, `REQ-EVT-019`) · `ACT-ADMIN` (**sólo** valla técnica de concurrencia) |
| **BENEFICIARY** | Las personas alcanzadas |
| **TRIGGER** | El horario, la sede, los destinatarios o el texto de un evento ya no sirven. |
| **PRECONDITIONS SUMMARY** | Rol vigente con alcance sobre el evento; el evento no está `COMPLETED`. Si pertenece a una serie, el actor elige el alcance: **sólo esta** · **esta y las siguientes** · **toda la serie**. |
| **SUCCESS OUTCOME** | El evento queda con los datos nuevos. Cambio **no material** (título, redacción, metadatos no coordinativos): sin vista previa de impacto, sin incremento de revisión, sin reconfirmación, sin notificación — la corrección queda registrada. Cambio **material**: la revisión de coordinación de **cada ocurrencia afectada** sube, pueden derivarse reconfirmaciones y se genera la notificación correspondiente. El impacto se calcula sobre el conjunto **real** afectado, nunca sobre un total de serie. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event`, `EventSeries` (alcance) |
| **OBJECT STATE CONSTRAINTS** | `COMPLETED` no se reabre · cambiar el equipo de un partido programado se rechaza · `ARCHIVED → ACTIVE` en estructura no existe en V1 |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-010` (P), `REQ-EVT-011` (P), `REQ-EVT-012`, `REQ-EVT-015`, `REQ-EVT-006`, `REQ-STR-012`, `REQ-PRT-003`, `REQ-EVT-013` |
| **RELATED BUSINESS RULES** | `REQ-EVT-001` · `REQ-COM-016` · `REQ-STR-011` · `REQ-SYS-017` |
| **INCLUDE CANDIDATES** | `UC-EVT-11` (obligatorio en la rama material) |
| **EXTEND CANDIDATES** | `UC-EVT-12` (condición: `STALE_VERSION`) |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | **Un** solo CU con dos ramas (material / no material), no dos. El objetivo del actor es el mismo —actualizar la información del evento— y las dos ramas difieren en efectos, no en propósito. `REQ-EVT-015` define las tres opciones de alcance **de esta misma operación**, no una operación aparte: por eso no hay un CU "editar serie". La surjective `POSTPONED → SCHEDULED` sí es un objetivo distinto: `UC-EVT-06`. |
| **STATUS** | `FROZEN` |

## UC-EVT-05 · Posponer un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Mover un evento a otra fecha porque no se puede jugar cuando estaba. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | `ACT-ADMIN` (**sólo** valla técnica) |
| **BENEFICIARY** | Las personas alcanzadas |
| **TRIGGER** | El evento no puede realizarse en la fecha programada. |
| **PRECONDITIONS SUMMARY** | El evento está `SCHEDULED`; rol vigente con alcance. |
| **SUCCESS OUTCOME** | El evento queda `POSTPONED` **sin horario vigente**. Las respuestas de disponibilidad previas **se conservan** y no se aceptan nuevas. Es un cambio material: sube la revisión de coordinación y notifica. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | `SCHEDULED → POSTPONED` · `POSTPONED` no admite disponibilidad nueva |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-007` (P), `REQ-EVT-011`, `REQ-PRT-004`, `REQ-PRT-003` |
| **RELATED BUSINESS RULES** | `REQ-COM-014` (posponer es un tipo de notificación distinguible) · `REQ-EVT-008` |
| **INCLUDE CANDIDATES** | `UC-EVT-11` |
| **EXTEND CANDIDATES** | `UC-EVT-12` |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | Objetivo distinto de `UC-EVT-04`: cambia el ciclo de vida y el resultado observable. |
| **STATUS** | `FROZEN` |

## UC-EVT-06 · Reanudar un evento pospuesto

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Volver a poner en agenda un evento que se pospuso, con horario vigente. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | `ACT-PLAYER`, `ACT-GUARDIAN` (pueden volver a responder) |
| **BENEFICIARY** | Las personas alcanzadas |
| **TRIGGER** | Ya hay una fecha nueva para el evento. |
| **PRECONDITIONS SUMMARY** | El evento está `POSTPONED`; rol vigente con alcance. |
| **SUCCESS OUTCOME** | El evento queda `SCHEDULED` con horario vigente y **la respuesta de disponibilidad vuelve a estar abierta**. Las respuestas conservadas siguen visibles. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | `POSTPONED → SCHEDULED` |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-007` (P), `REQ-PRT-004` (P) |
| **RELATED BUSINESS RULES** | `REQ-PRT-003` · `REQ-COM-014` (reprogramar es tipo distinguible) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-EVT-12` |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | No fusionado con `UC-EVT-04` porque el resultado observable es distinto: reabre la disponibilidad, cosa que `UC-EVT-04` no hace por sí sola. |
| **STATUS** | `FROZEN` |

## UC-EVT-07 · Cancelar un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Dar por cancelado un evento y que todos lo entiendan sin seguir esperando. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | `ACT-ADMIN` (**sólo** valla técnica) |
| **BENEFICIARY** | Las personas alcanzadas |
| **TRIGGER** | El evento no va a realizarse. |
| **PRECONDITIONS SUMMARY** | El evento está `SCHEDULED` o `POSTPONED`; rol vigente con alcance. |
| **SUCCESS OUTCOME** | El evento queda `CANCELLED` con su composición propia, explicando la consecuencia. La disponibilidad deja de ser la acción principal. Notificado como tipo `CANCELLED`, distinguible. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | `SCHEDULED → CANCELLED` · `POSTPONED → CANCELLED` · terminal para la participación |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-007` (P), `REQ-EVT-008` (P), `REQ-EVT-011`, `REQ-COM-014` |
| **RELATED BUSINESS RULES** | `REQ-PRT-004` · `REQ-EVT-024` |
| **INCLUDE CANDIDATES** | `UC-EVT-11` |
| **EXTEND CANDIDATES** | `UC-EVT-12` |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | Cancelado **no** es lo mismo que pateado: `UC-EVT-07` es terminal para la participación; `UC-EVT-05` conserva respuestas y puede revertirse con `UC-EVT-06`. |
| **STATUS** | `FROZEN` |

## UC-EVT-08 · Restaurar un evento cancelado

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Volver a agenda un evento que se había cancelado. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | `ACT-PLAYER`, `ACT-GUARDIAN` (pueden volver a responder) |
| **BENEFICIARY** | Las personas alcanzadas |
| **TRIGGER** | La cancelación fue un error o el evento se va a hacer igual. |
| **PRECONDITIONS SUMMARY** | El evento está `CANCELLED`; rol vigente con alcance. |
| **SUCCESS OUTCOME** | El evento vuelve a `SCHEDULED` con horario vigente. Es un cambio material: sube la revisión de coordinación y notifica como tipo `RESTORED`, distinguible. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | `CANCELLED → SCHEDULED` |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-007` (P), `REQ-EVT-011`, `REQ-COM-014` |
| **RELATED BUSINESS RULES** | `REQ-PRT-004` |
| **INCLUDE CANDIDATES** | `UC-EVT-11` |
| **EXTEND CANDIDATES** | `UC-EVT-12` |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | **Autorizado por PT §9** (`CANCELLED -> SCHEDULED` mediante Restore) y por `REQ-EVT-007`. Contrasta deliberadamente con la estructura: restaurar **evento** es de V1; restaurar **estructura** es DEFER. No es una contradicción: son objetos con contratos distintos. |
| **STATUS** | `FROZEN` |

## UC-EVT-09 · Completar un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Dejar constancia de que el evento se realizó. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; las personas alcanzadas |
| **TRIGGER** | El evento ya se realizó. |
| **PRECONDITIONS SUMMARY** | El evento está `SCHEDULED` o `IN_PROGRESS`; el ciclo de vida del evento permite `COMPLETED`; rol vigente con alcance. |
| **SUCCESS OUTCOME** | El evento queda `COMPLETED` con su composición propia. Se habilita el resultado del partido para `PLAYED` o `FORFEIT`. **`COMPLETED` no se reabre.** |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | `SCHEDULED/IN_PROGRESS → COMPLETED` · terminal |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-007` (P), `REQ-EVT-008` (P), `REQ-PRT-015` |
| **RELATED BUSINESS RULES** | `REQ-PRT-013` · `REQ-PRT-011` (la asistencia puede cerrarse después de `COMPLETED`) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | El paso `SCHEDULED → IN_PROGRESS` **no** es un CU: no aporta un resultado funcional propio que `SCHEDULED` no permita ya (la asistencia abre en ambos estados). Es una regla de ciclo de vida que gobierna `UC-EVT-09` y `UC-EVT-10`. |
| **STATUS** | `FROZEN` |

## UC-EVT-10 · Abandonar un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Dejar constancia de que el evento se suspendió y no se juega. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; las personas alcanzadas |
| **TRIGGER** | El evento no se puede completar. |
| **PRECONDITIONS SUMMARY** | El evento está `IN_PROGRESS`; el transporte permite `ABANDONED`; rol vigente con alcance. |
| **SUCCESS OUTCOME** | El evento queda `ABANDONED` con su composición propia. El resultado del partido, si se registra, debe ser `ABANDONED` — **no** `PLAYED`. No hay estadísticas de partido real. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | `IN_PROGRESS → ABANDONED` · terminal |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-007` (P), `REQ-EVT-008` (P), `REQ-PRT-015` (P) |
| **RELATED BUSINESS RULES** | `REQ-PRT-016` (estadísticas sólo de `PLAYED`) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | Separate de `UC-EVT-09` porque el resultado funcional difiere: `COMPLETED` habilita resultado real y estadísticas; `ABANDONED` impide ambas. |
| **STATUS** | `FROZEN` |

## UC-EVT-11 · Revisar el impacto de un cambio material

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Saber a quién alcanza el cambio que estoy por aplicar antes de aplicarlo. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club y las personas alcanzadas |
| **TRIGGER** | El actor propone un cambio material y tiene que confirmarlo. |
| **PRECONDITIONS SUMMARY** | Existe un cambio material propuesto; la operación que lo origina está autorizada. |
| **SUCCESS OUTCOME** | El sistema devuelve **las personas y roles alcanzados y las consecuencias**, con conteos derivados de los conjuntos reales y no de cifras fijas. Al confirmar, el impacto se recalcula y revalida en el momento de ejecutar. Impacto distinto al previsualizado ⇒ `IMPACT_CHANGED` y nueva confirmación. Vista previa vencida ⇒ `IMPACT_TOKEN_EXPIRED`. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | impacto sobre el conjunto alcanzable del evento o de la serie |
| **OBJECT STATE CONSTRAINTS** | Token de impacto vigente |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-012` (P) |
| **RELATED BUSINESS RULES** | `REQ-EVT-011` · `REQ-SYS-009` · `REQ-IAM-016` · `REQ-SYS-015` |
| **INCLUDE CANDIDATES** | destino preferente |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Antes de confirmar un cambio material |
| **NOTES** | Cumple los tres criterios del §25: comportamiento observable, REQ propio que lo justifica, y merece especificación propia. `IWR-09` (conteos con cifras fijas) es un defecto del CURRENT, no una autoridad. |
| **STATUS** | `FROZEN` |

## UC-EVT-12 · Resolver un conflicto de edición concurrente

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | No perder mi trabajo ni pisar el de otro cuando dos personas editan lo mismo. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | `ACT-ADMIN` (**sólo** reconciliación y valla técnica) |
| **BENEFICIARY** | El club; el actor que editaba |
| **TRIGGER** | Al guardar, el recurso cambió en el servidor. |
| **PRECONDITIONS SUMMARY** | El actor tiene cambios locales; el servidor tiene una versión más reciente. |
| **SUCCESS OUTCOME** | El actor ve **su base, sus cambios locales y la versión actual del servidor**. Al reconciliar, cada campo queda declarado seguro de conservar o en conflicto. **No** hay fusión automática que haga perder cambios ni sobrescritura genérica. Descartar el borrador sin decidir no se hace silenciosamente. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `Event` en conflicto |
| **OBJECT STATE CONSTRAINTS** | `STALE_VERSION` |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-013` (P), `REQ-SYS-017`, `REQ-SYS-010` |
| **RELATED BUSINESS RULES** | `ACTOR-FEEDBACK-07` · `ACTOR-DECISION-02` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Espacio de conflicto al guardar |
| **NOTES** | `ACTOR-DECISION-02` opción (a) congelada por E2: `ACT-ADMIN` participa de la valla, **no** inicia ninguna autoridad deportiva. |
| **STATUS** | `FROZEN` |

## UC-EVT-13 · Crear una serie de eventos

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Programar de una vez un conjunto de eventos que se repiten, sin crear uno por vez. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; las personas alcanzadas |
| **TRIGGER** | El club tiene un calendario que se repite. |
| **PRECONDITIONS SUMMARY** | Rol vigente con alcance; destinatarios válidos; máximo 366 ocurrencias por comando. |
| **SUCCESS OUTCOME** | La `EventSeries` queda `ACTIVE` con sus destinatarios y sus ocurrencias persistidos; nombre y estado consultables. Más de 366 ⇒ `RECURRENCE_TOO_LARGE`. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `EventSeries` |
| **OBJECT STATE CONSTRAINTS** | Máximo 366 ocurrencias |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-014` (P), `REQ-EVT-005`, `REQ-EVT-001` |
| **RELATED BUSINESS RULES** | `REQ-EVT-016` · `REQ-COM-016` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Calendario |
| **NOTES** | `DEF-EVT-001` / `OUT-EVT-003`: la generación automática de fechas **no** es de V1. La serie se define, no se adivina. |
| **STATUS** | `FROZEN` |

## UC-EVT-14 · Finalizar una serie de eventos

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Cerrar un calendario que ya no se va a repetir, sin perder lo que ya pasó. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` · `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | La temporada de esa serie terminó. |
| **PRECONDITIONS SUMMARY** | La serie está `ACTIVE`. |
| **SUCCESS OUTCOME** | La serie queda `ENDED` y **conserva sus ocurrencias**. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `EventSeries` |
| **OBJECT STATE CONSTRAINTS** | `ACTIVE → ENDED` · sin transición inversa |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-016` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de serie |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-EVT-15 · Programar una jornada

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Programar de una sola vez los partidos de una jornada operativa. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) |
| **SECONDARY ACTOR(S)** | `ACT-ADMIN` (**sólo** valla técnica de dependencias, `ACTOR-DECISION-02`) |
| **BENEFICIARY** | El club; los equipos que juegan |
| **TRIGGER** | Hay una fecha operativa con varios partidos que hay que dejar asentados. |
| **PRECONDITIONS SUMMARY** | Temporada y división válidas; los partidos son válidos y de esa temporada; cada partido, a lo sumo, una jornada; si la jornada tiene competencia, cada partido usa inscripción de esa competencia con alcance compatible. |
| **SUCCESS OUTCOME** | La jornada queda creada y los partidos quedan agrupados, **en bloque atómico**: hasta 100, nunca una creación parcial. Más de 100 ⇒ rechazado o atómico según el límite. Un partido de otra temporada ⇒ rechazado. Un partido ya agrupado en otra jornada ⇒ rechazado por pertenencia única. La jornada **no** duplica el ciclo de vida de los partidos. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `CLUB` |
| **OBJECT / SUBJECT** | `Jornada`, `Event` `MATCH` |
| **OBJECT STATE CONSTRAINTS** | Bulk ≤ 100 · bulk atómico · un partido ≤ una jornada |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-018` (P), `REQ-EVT-024`, `REQ-CMP-005`, `REQ-EVT-003` |
| **RELATED BUSINESS RULES** | `REQ-EVT-001` · `REQ-SYS-018` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Calendario |
| **NOTES** | **MISMATCH DOCUMENTADO con el CURRENT**: el `ALTA` de jornada del prototipo sólo **agrupa partidos preexistentes**; `REQ-EVT-018` y PT §16 hablan de una operación masiva **atómica** que nunca queda parcial. Si el camino feliz de E5 exige que los partidos se creen en el mismo bloque, ése es el gap. **No afecta el inventario.** Ver Audit §14. |
| **STATUS** | `FROZEN` |

## UC-EVT-16 · Actualizar la logística de un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Dejar la información operativa de la salida —encuentro, salida, punto de encuentro, transporte, llegada— en el evento y no en mensajes sueltos. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM` o `EVENT`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) |
| **SECONDARY ACTOR(S)** | **`ACT-CAPTAIN` — `ALTERNATE AUTHORIZED ACTOR`, autoridad propia, scope `TEAM`** |
| **BENEFICIARY** | Las personas alcanzadas |
| **TRIGGER** | Hay que coordinatedar la salida de un equipo. |
| **PRECONDITIONS SUMMARY** | El evento no está en estado terminal; el actor tiene alcance sobre el equipo o el evento. |
| **SUCCESS OUTCOME** | La logística queda registrada y es **consultable por las personas alcanzadas**. Sin logística, el sistema lo comunica con honestidad, sin afirmar un valor por defecto. Los cambios de logística **no** invalidan la disponibilidad ni piden impact review; sí quedan auditados. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / **`RoleAssignment CAPTAIN`** / `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `EventLogistics` |
| **OBJECT STATE CONSTRAINTS** | Evento terminal ⇒ logística no editable |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-019` (P), `REQ-EVT-011`, `REQ-INS-009` |
| **RELATED BUSINESS RULES** | `ACTOR-FEEDBACK-01` · `ACTOR-FEEDBACK-02` |
| **INCLUDE CANDIDATES** | `UC-EVT-11` (sólo si además cambia un campo coordinativo) |
| **EXTEND CANDIDATES** | `UC-EVT-12` |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | **Único CU donde `ACT-CAPTAIN` puede iniciar.** PT §5 fila `Logistics` es la **única** fila con `✓` para `CAPTAIN` y `—` para `PLAYER`. No se crea un CU paralelo para la capitana: mismo objetivo, mismo flujo, mismo resultado. `ACT-CAPTAIN` **no** ve `DNI` ni administra nada más. |
| **STATUS** | `FROZEN` |

## UC-EVT-17 · Consultar el calendario

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Ver qué está agendado y para mí. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → los 6 roles concretos, cada uno con su alcance |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona quiere ver la agenda. |
| **PRECONDITIONS SUMMARY** | La persona tiene actor válido (rol vigente **o** delegación con permiso). |
| **SUCCESS OUTCOME** | Ve los eventos dentro de su alcance, con mes, filtros y vista coherentes con la dirección de navegación. El botón atrás devuelve el mismo contexto. Vacío resuelto, no roto: sin eventos se dice explícitamente. |
| **AUTHORITY SOURCE** | `Account` + sesión + alcance derivado |
| **SCOPE** | derivado del actor: `SELF`, `CHILD`, `TEAM`, `CLUB` |
| **OBJECT / SUBJECT** | proyección de calendario |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-020` (P), `REQ-EVT-022`, `REQ-SYS-013` |
| **RELATED BUSINESS RULES** | `REQ-SYS-019` (la proyección **no** es dueña de datos) · `REQ-EVT-008` · `REQ-SYS-012` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Calendario |
| **NOTES** | El CURRENT ofrece "Nueva jornada" desde acá: es un **entry point**, no parte del objetivo. El caso de uso existe sin importar desde dónde se llegue (§45). |
| **STATUS** | `FROZEN` |

## UC-EVT-18 · Revisar lo que requiere mi atención

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Saber qué tengo que hacer ahora, en orden de urgencia. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → los 6 roles concretos, cada uno con su alcance |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona abre su Inicio. |
| **PRECONDITIONS SUMMARY** | La persona tiene actor válido. |
| **SUCCESS OUTCOME** | Aparece **hasta 3 elementos**, cada uno con motivo, consecuencia y acción, ordenados por urgencia. Los irresolubles no aparecen. Sin pendientes, se dice explícitamente en vez de mostrar una lista vacía sin explicación. |
| **AUTHORITY SOURCE** | `Account` + sesión + alcance derivado |
| **SCOPE** | derivado del actor |
| **OBJECT / SUBJECT** | proyección de inicio |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-021` (P), `REQ-PRT-003`, `REQ-PRT-007`, `REQ-SYS-007`, `REQ-SYS-011` |
| **RELATED BUSINESS RULES** | `REQ-EVT-022` · `REQ-SYS-019` · `ACTOR-DECISION-01` (bajo el valor congelado (a), un conflicto de habilitación de la jugadora **no** llega a su Inicio) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Inicio |
| **NOTES** | `IWR-06` (bloque "En el equipo" de capitanía) es `ACCIDENTAL UI`: no hay REQ que lo pida y no produce CU. |
| **STATUS** | `FROZEN` |

## UC-EVT-19 · Consultar un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | EVT |
| **GOAL** | Ver de un evento todo lo que necesito para cumplirlo. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → los 6 roles concretos, cada uno con su alcance |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona alcanzada |
| **TRIGGER** | La persona quiere ver un evento. |
| **PRECONDITIONS SUMMARY** | El evento está dentro del alcance de la persona. |
| **SUCCESS OUTCOME** | Ve horario, sede, destinatarios, estado e historia. Sin alcance por dirección directa ⇒ **sin contenido**, no contenido recortado. La logística ausente se comunica con honestidad. |
| **AUTHORITY SOURCE** | `Account` + sesión + alcance |
| **SCOPE** | derivado del actor |
| **OBJECT / SUBJECT** | `Event` |
| **OBJECT STATE CONSTRAINTS** | Estados terminales con composición propia y consecuencia explicada |
| **SUPPORTING REQUIREMENTS** | `REQ-EVT-023` (P), `REQ-EVT-008`, `REQ-EVT-019`, `REQ-INS-011`, `REQ-STR-012` |
| **RELATED BUSINESS RULES** | `REQ-EVT-022` · `REQ-PPL-011` · `REQ-EVT-017` (qué superficies existen según tipo y autoridad) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | Es el ancla de la superficie de participación: el tipo de evento decide qué hay disponible. |
| **STATUS** | `FROZEN` |

---

# 7. CASOS DE USO CANÓNICOS — PRT (13)

## UC-PRT-01 · Responder mi disponibilidad

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Decir si voy o no voy a un evento, y que el equipo lo sepa. |
| **PRIMARY ACTOR(S)** | `ACT-PLAYER` (propia) · `ACT-GUARDIAN` (**por un menor**, no es un CU distinto) |
| **SECONDARY ACTOR(S)** | `ACT-CAPTAIN` (sólo con `RoleAssignment PLAYER` vigente, invariante E2 §7.5) · `ACT-COACH` (observa el conteo) |
| **BENEFICIARY** | La jugadora o el menor; el equipo |
| **TRIGGER** | Hay un evento con horario vigente para el que todavía no respondió. |
| **PRECONDITIONS SUMMARY** | Rol `PLAYER` vigente + `TeamAssignment` + `Membership` vigente — **o** relación con `can_respond_availability` vigente y el evento alcanza al menor; el evento está `SCHEDULED`. |
| **SUCCESS OUTCOME** | La respuesta `sí` / `quizás` / `no` queda registrada con fecha y visible en el conteo. Cambiar la respuesta **sustituye** la anterior. Respondiendo de nuevo después de un cambio de coordinación, la respuesta deja de estar "necesita confirmación". |
| **AUTHORITY SOURCE** | `RoleAssignment PLAYER` + `TeamAssignment` + `Membership` · o `GuardianRelationship.can_respond_availability` |
| **SCOPE** | `TEAM` (propia) · `CHILD` (delegada) |
| **OBJECT / SUBJECT** | `Availability` propia o del menor |
| **OBJECT STATE CONSTRAINTS** | `DRAFT` y `POSTPONED` no aceptan respuesta nueva · `POSTPONED` conserva las previas · evento que no alcanza al menor ⇒ rechazado · sin el flag ⇒ denegado |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-001` (P), `REQ-PRT-002` (P), `REQ-PRT-004` (P), `REQ-PRT-003` |
| **RELATED BUSINESS RULES** | `REQ-PRT-018` (disponibilidad ≠ convocatoria ≠ asistencia ≠ habilitación) · `REQ-PRT-019` · `REQ-COM-017` (responder **no** notifica) · `REQ-DECISION-02` (E1) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento · Calendario |
| **NOTES** | **Un solo CU para persona y guardián** (§21 del brief). Cambia el **subject** y la **authority source**, no el objetivo funcional. No se crea "Responder disponibilidad como Guardian". Un rol sin `PLAYER` **no** responde por sí mismo. `ACTOR-FEEDBACK-02` resuelto: `ACT-CAPTAIN` por sí solo no basta. |
| **STATUS** | `FROZEN` |

## UC-PRT-02 · Preparar la convocatoria de un partido

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Armar la lista de quién está convocado sin que eso todavía obligue a nadie. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM` o `EVENT`) |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | Las convocadas |
| **TRIGGER** | El entrenador tiene que decidir a quién llama para un partido. |
| **PRECONDITIONS SUMMARY** | El evento está `SCHEDULED` y es de tipo `MATCH`. |
| **SUCCESS OUTCOME** | Existe un borrador de convocatoria **editable**, con guardado automático: cinco estados de guardado; el refresco de fondo no pisa lo escrito; con error, reintento y **nunca** éxito falso. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `Selection` (borrador) |
| **OBJECT STATE CONSTRAINTS** | Evento `≠ SCHEDULED` o tipo `≠ MATCH` ⇒ no aplica |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-005` (P), `REQ-PRT-008` (P) |
| **RELATED BUSINESS RULES** | `REQ-EVT-017` · `REQ-SYS-018` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-PRT-04` (condición: hay conflictos derivados) |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | `RWS-07`: el CURRENT implementa 3 de los 5 estados de guardado. `DEF-SYS-003`: los tiempos de red reales están pendientes de evidencia. |
| **STATUS** | `FROZEN` |

## UC-PRT-03 · Publicar la convocatoria de un partido

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Hacer oficial quién está convocado, de forma que no se pueda reescribir después. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` |
| **SECONDARY ACTOR(S)** | `ACT-PLAYER`, `ACT-GUARDIAN` (reciben la notificación correspondiente) |
| **BENEFICIARY** | Las convocadas; el club |
| **TRIGGER** | El borrador de convocatoria está listo. |
| **PRECONDITIONS SUMMARY** | El evento está `SCHEDULED` y es `MATCH`; el borrador está completo; lo que esté en vuelo al publicar se espera, sin coreografía. |
| **SUCCESS OUTCOME** | Existe una **revisión inmutable** publicada. Republicar crea una revisión nueva **sin reescribir** la anterior. Las agregadas y las quitadas quedan notificadas; las que permanecen, no. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `Selection` (revisión publicada) |
| **OBJECT STATE CONSTRAINTS** | Publicar sin `SCHEDULED` ⇒ rechazado |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-005` (P), `REQ-PRT-006` (P), `REQ-COM-015`, `REQ-PRT-008` |
| **RELATED BUSINESS RULES** | `REQ-INS-011` (las revisiones son historia) · `REQ-SYS-018` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-PRT-04` (condición: hay conflictos derivados) |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | **La publicación no se bloquea por un conflicto** (`REQ-PRT-006`): con conflicto de habilitación publica igual, el conflicto queda derivado, visible, explicado en lenguaje de usuario y con superficie de revisión. Por eso "revisar conflictos" **no** es `<<include>>` de publicar: es `<<extend>>`. |
| **STATUS** | `FROZEN` |

## UC-PRT-04 · Revisar los conflictos de una convocatoria

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Saber a quién de mi lista no le corresponde estar-linux, y qué hacer al respecto. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El entrenador; las convocadas |
| **TRIGGER** | Hay una convocatoria publicada con restricciones activas que la afectan. |
| **PRECONDITIONS SUMMARY** | Existe una convocatoria publicada; existen restricciones de habilitación o de afiliación aplicables. |
| **SUCCESS OUTCOME** | Se derivan los cuatro tipos de conflicto —`ELIGIBILITY_BLOCKED`, `ELIGIBILITY_PENDING`, `NO_LONGER_EVENT_TARGET`, `NO_LONGER_TEAM_AFFILIATED`— explicados en lenguaje de usuario. La publicación **no** se reescribe. Puede alimentar Inicio como "necesita tu atención". |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `Selection` + `EligibilityConstraint` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-007` (P), `REQ-PRT-006` |
| **RELATED BUSINESS RULES** | `REQ-PRT-017` (el entrenador ve **estado**, no motivo ni origen) · `REQ-PRT-018` (los conflictos no se derivan de la disponibilidad) · `REQ-EVT-021` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento · Inicio |
| **NOTES** | Objetivo distinto de `UC-PRT-02` y de `UC-PRT-03`: aquí el actor no quiere cambiar la lista, quiere entender un bloqueo. |
| **STATUS** | `FROZEN` |

## UC-PRT-05 · Registrar la asistencia de un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Dejar asentado quién estuvo presente. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM` o `EVENT`) |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; las jugadoras |
| **TRIGGER** | El evento se está haciendo o ya se hizo y hay que cargar la planilla. |
| **PRECONDITIONS SUMMARY** | El evento está `SCHEDULED` o `IN_PROGRESS`; el tipo es `TRAINING` o `MATCH`; la planilla está `OPEN`. |
| **SUCCESS OUTCOME** | El valor queda persistido **de inmediato**. Lo que no se registró queda como **"sin registrar"**, que es un estado propio y distinguible de "ausente". Sin autoridad ⇒ denegado. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `Attendance` |
| **OBJECT STATE CONSTRAINTS** | Planilla `CLOSED` ⇒ no admite marcaje nuevo |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-009` (P), `REQ-PRT-010` (P) |
| **RELATED BUSINESS RULES** | `REQ-PRT-019` (matriz de aplicabilidad por tipo) · `REQ-EVT-017` · `REQ-COM-017` (registrar asistencia **no** notifica) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-PRT-07` (condición: planilla `CLOSED`) |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | La asistencia se puede abrir y cargar **antes** de que el evento esté `COMPLETED`: PT §12. |
| **STATUS** | `FROZEN` |

## UC-PRT-06 · Cerrar la asistencia de un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Dejar constancia de cuándo los datos de presencia quedaron cerrados. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; las jugadoras |
| **TRIGGER** | La planilla de asistencia ya no va a cambiar por carga directa. |
| **PRECONDITIONS SUMMARY** | El evento está `SCHEDULED`, `IN_PROGRESS` o `COMPLETED`; la planilla está `OPEN`. |
| **SUCCESS OUTCOME** | Queda registrada la marca de cierre. La planilla **no** admite marcaje nuevo sin corrección. Su estado es "cerrada", distinguible de "abierta". |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `Attendance` (planilla) |
| **OBJECT STATE CONSTRAINTS** | `OPEN → CLOSED` derivado de `closed_at` |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-011` (P), `REQ-PRT-009` |
| **RELATED BUSINESS RULES** | `REQ-PRT-012` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-PRT-07` (condición: cambio posterior) |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | **La reapertura de una planilla cerrada NO es requisito** (`REQ-PRT-011` NOTES, `CON-13`): PT §12 ya admite correcciones después de `COMPLETED`. No se crea CU de reapertura. Exclusión explícita. |
| **STATUS** | `FROZEN` |

## UC-PRT-07 · Corregir la asistencia de un evento

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Arreglar un error de registro sin perder la traza del error. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La jugadora afectada; el club |
| **TRIGGER** | Se detectó un valor de asistencia mal cargado. |
| **PRECONDITIONS SUMMARY** | Hay un valor registrado; la corrección **incluye motivo escrito**. |
| **SUCCESS OUTCOME** | Quedan persistidos el valor **anterior**, el **nuevo**, el **motivo**, el **autor** y la **fecha**. Sin motivo, la operación **no** completa. Al consultar la asistencia, el antes y el después son visibles. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `Attendance` (corrección) |
| **OBJECT STATE CONSTRAINTS** | Único camino para cambiar un valor con planilla `CLOSED` |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-012` (P), `REQ-INS-011`, `REQ-INS-009` |
| **RELATED BUSINESS RULES** | `REQ-SYS-006` (el motivo se dice en lenguaje de usuario) · `REQ-COM-017` (corrección menor **no** notifica) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento · Informe de asistencia |
| **NOTES** | **No** retrocede el ciclo de vida de nada: corrige un dato, no reabre el evento. |
| **STATUS** | `FROZEN` |

## UC-PRT-08 · Registrar el resultado de un partido

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Cargar el resultado del partido como borrador, todavía no oficial. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El partido terminó y hay que cargar cómo terminó. |
| **PRECONDITIONS SUMMARY** | El evento es `MATCH` y su ciclo lo permite: `PLAYED` / `FORFEIT` exigen `COMPLETED`; `ABANDONED` exige `ABANDONED`. |
| **SUCCESS OUTCOME** | Existe un `MatchRecord` en `DRAFT`. Fuera de ciclo ⇒ `MATCH_STATE_INCOMPATIBLE`. El resultado **no** fija un estado que el evento no tiene. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `MatchRecord` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT` |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-013` (P), `REQ-PRT-015` (P) |
| **RELATED BUSINESS RULES** | `REQ-PRT-019` · `REQ-PRT-016` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-PRT-10` (condición: `FINAL`) |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | `ACT-ADMIN` **no** registra resultados. E2 §14.1. |
| **STATUS** | `FROZEN` |

## UC-PRT-09 · Finalizar el resultado de un partido

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Dejar el resultado del partido como estado final oficial. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El borrador del resultado está completo y es correcto. |
| **PRECONDITIONS SUMMARY** | El `MatchRecord` está `DRAFT`; el ciclo del evento lo permite. |
| **SUCCESS OUTCOME** | El resultado queda `FINAL`. La finalización es **terminal**: por la vía normal no se edita. A partir de ahí, los partidos jugados son derivados del resultado —**no** de la asistencia— y las estadísticas de partido se hacen reales. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `MatchRecord` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT → FINAL` · terminal por la vía normal |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-013` (P), `REQ-PRT-015` (P), `REQ-PRT-016` |
| **RELATED BUSINESS RULES** | `REQ-PRT-014` (el único camino posterior es la corrección) · `REQ-INS-005` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | `UC-PRT-10` (condición: corrección posterior) |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | Separate de `UC-PRT-08` porque el resultado observable cambia: borrador ≠ oficial. |
| **STATUS** | `FROZEN` |

## UC-PRT-10 · Corregir el resultado de un partido

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Corregir un resultado ya finalizado sin perder la evidencia del error. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; los equipos afectados |
| **TRIGGER** | Se detectó un error en el resultado oficial. |
| **PRECONDITIONS SUMMARY** | El `MatchRecord` está `FINAL`; la corrección **incluye motivo escrito**. |
| **SUCCESS OUTCOME** | Quedan persistidos el marcador **anterior**, el **nuevo**, el **motivo**, el **autor** y la **fecha**. El marcador final queda visible junto con la evidencia. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `MatchRecord` (corrección) |
| **OBJECT STATE CONSTRAINTS** | Único camino para cambiar un `FINAL` |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-014` (P), `REQ-INS-011`, `REQ-INS-009` |
| **RELATED BUSINESS RULES** | `REQ-PRT-013` · `REQ-SYS-006` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento · Informe de rendimiento |
| **NOTES** | Una corrección **no** retrocede el ciclo de vida del evento ni del resultado. |
| **STATUS** | `FROZEN` |

## UC-PRT-11 · Consultar las estadísticas de un partido

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Ver cómo rindieron las jugadoras de un partido. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM` o `EVENT`) |
| **SECONDARY ACTOR(S)** | `ACT-CAPTAIN` (`TEAM` si corresponde) |
| **BENEFICIARY** | El club; las jugadoras |
| **TRIGGER** | El entrenador quiere evaluar el rendimiento de un partido. |
| **PRECONDITIONS SUMMARY** | El `MatchRecord` está en `PLAYED`; el actor tiene alcance. |
| **SUCCESS OUTCOME** | Las estadísticas se reconocen **sólo** a participación real registrada en `PLAYED`. Los partidos jugados se derivan del resultado, **nunca** de la asistencia. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `RoleAssignment CAPTAIN` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | estadísticas de partido |
| **OBJECT STATE CONSTRAINTS** | Sólo `PLAYED` |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-016` (P) |
| **RELATED BUSINESS RULES** | `REQ-PRT-015` · `DEF-CMP-001` (ampliar el set de estadísticas es decisión pendiente, no de V1) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento |
| **NOTES** | **No fusionado** con `UC-INS-03` (informe de rendimiento): aquél es agregado y transversal; éste es por partido y con autoridad deportiva distinta. §42. |
| **STATUS** | `FROZEN` |

## UC-PRT-12 · Registrar una restricción de habilitación

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Dejar constancia de una condición que impide o condiciona la participación de una jugadora. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-ADMIN` (alcance `CLUB`) |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La jugadora afectada; el club |
| **TRIGGER** | El club conoce una condición de aptitud o una restricción. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment SUBCOMMITTEE` o `RoleAssignment ADMIN` vigente; la jugadora existe. |
| **SUCCESS OUTCOME** | La `EligibilityConstraint` queda registrada con **estado, alcance, origen, motivo y vigencia**. Sin restricción activa aplicable ⇒ `ELIGIBLE` **derivado**. Nunca se infiere de la disponibilidad. **Sin historia clínica**: sólo estado, motivo y vigencia. Toda mutación queda auditada. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` (la restricción acota dónde aplica: `CLUB`, `COMPETITION`, `ENTRY`, `EVENT`) |
| **OBJECT / SUBJECT** | `EligibilityConstraint` |
| **OBJECT STATE CONSTRAINTS** | Estados persistidos `PENDING` / `BLOCKED`; `ELIGIBLE` es derivado |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-017` (P), `REQ-CMP-008` (P) |
| **RELATED BUSINESS RULES** | `REQ-CMP-007` (límite federativo) · `REQ-INS-009` · `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de una persona · Administración de competencias |
| **NOTES** | La vigencia se registra **dentro** de este CU; no hay un CU "finalizar una restricción" porque ningún REQ lo expresa como objetivo separado. |
| **STATUS** | `FROZEN` |

## UC-PRT-13 · Consultar el estado de habilitación de una jugadora

| Campo | Valor |
|---|---|
| **DOMAIN** | PRT |
| **GOAL** | Saber si una jugadora puede participar y, si no puede, por qué y desde cuándo. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` · `ACT-COACH` (**sólo el estado**) |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; la jugadora afectada |
| **TRIGGER** | Hay que decidir si alguien puede jugar, o el club revisa el estado de una jugadora. |
| **PRECONDITIONS SUMMARY** | El actor tiene alcance; la jugadora existe. |
| **SUCCESS OUTCOME** | `ACT-COACH` ve el **estado** derivado y el alcance, **nunca** el motivo ni el origen. `ACT-SUBCOMMITTEE` y `ACT-ADMIN` ven además motivo y origen, con vigencia. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` / `RoleAssignment COACH` (con alcance) |
| **SCOPE** | `CLUB` (`SUBCOMMITTEE`, `ADMIN`) · `TEAM` / `EVENT` (`COACH` con alcance) |
| **OBJECT / SUBJECT** | estado derivado de habilitación de una `Person` |
| **OBJECT STATE CONSTRAINTS** | El alcance de la restricción acota dónde aplica |
| **SUPPORTING REQUIREMENTS** | `REQ-PRT-017` (P), `REQ-CMP-008` (P), `REQ-PPL-011` |
| **RELATED BUSINESS RULES** | `REQ-PRT-018` · `REQ-CMP-007` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de persona · Ficha de evento |
| **NOTES** | **`ACTOR-DECISION-01` con valor congelado (a): `ACT-PLAYER` y `ACT-CAPTAIN` están EXCLUIDOS.** No existe CU "consultar mi estado de habilitación". Si el club adopta la opción (b), se añade **exactamente 1** CU y se amplía `REQ-PPL-011` en la fila `ELIGIBILITY STATUS`. `ACTOR-UI-09` queda `CURRENT CONTRADICTORY`. |
| **STATUS** | `FROZEN` |

---

# 8. CASOS DE USO CANÓNICOS — COM (14)

## UC-COM-01 · Redactar un comunicado

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Escribir un comunicado oficial del club y definir a quién va dirigido. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La audiencia del comunicado |
| **TRIGGER** | El club necesita comunicar algo oficial. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment SUBCOMMITTEE` vigente. |
| **SUCCESS OUTCOME** | Existe un comunicado en `DRAFT` con título, cuerpo y **audiencia** —conjunto real de equipos o el club, nunca texto libre—, con identificación completa de cada equipo. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `CLUB` / `TEAM_SET` |
| **OBJECT / SUBJECT** | `Announcement` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT` |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-001` (P), `REQ-COM-002` (P) |
| **RELATED BUSINESS RULES** | `REQ-STR-013` (las estructuras se eligen de una lista) · `REQ-SYS-007` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Comunicación · Nuevo comunicado |
| **NOTES** | **Sólo `ACT-SUBCOMMITTEE`.** `ACT-ADMIN` no publica comunicados oficiales: PT §5 fila `Announcement oficial` = `—` para `ADMIN`. |
| **STATUS** | `FROZEN` |

## UC-COM-02 · Publicar un comunicado

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Hacer que el comunicado llegue a su audiencia de forma oficial e inalterable. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | La audiencia alcanzada |
| **BENEFICIARY** | La audiencia |
| **TRIGGER** | El borrador del comunicado está listo. |
| **PRECONDITIONS SUMMARY** | El comunicado está `DRAFT`; la audiencia es válida. |
| **SUCCESS OUTCOME** | El comunicado queda `PUBLISHED` y la **audiencia queda fijada como snapshot inmutable**: cambiar afiliaciones después no altera el snapshot, y cambiar la audiencia **no está disponible**. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `CLUB` / `TEAM_SET` |
| **OBJECT / SUBJECT** | `Announcement` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT → PUBLISHED` · audiencia inmutable desde aquí |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-001` (P), `REQ-COM-003` (P), `REQ-COM-002` |
| **RELATED BUSINESS RULES** | `REQ-COM-014` (publicar comunicado es tipo de notificación distinguible) · `REQ-COM-005` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de comunicado |
| **NOTES** | Si la audiencia quedó mal, la corrección **no** existe: corresponde un comunicado nuevo (`REQ-COM-004` AC 3). |
| **STATUS** | `FROZEN` |

## UC-COM-03 · Corregir un comunicado publicado

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Corregir un error de título o cuerpo sin tocar a quién le llegó. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | La audiencia |
| **BENEFICIARY** | La audiencia |
| **TRIGGER** | Se publicó un comunicado con un error de texto. |
| **PRECONDITIONS SUMMARY** | El comunicado está `PUBLISHED`; la corrección **incluye motivo**. |
| **SUCCESS OUTCOME** | Título o cuerpo corregidos. **La audiencia no cambia.** El texto anterior queda en historia. Si el error era de audiencia, corresponde un comunicado nuevo. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Announcement` (corrección) |
| **OBJECT STATE CONSTRAINTS** | `PUBLISHED` con audiencia snapshot |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-004` (P), `REQ-COM-003`, `REQ-INS-011` |
| **RELATED BUSINESS RULES** | `REQ-INS-009` · `REQ-SYS-006` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de comunicado |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-COM-04 · Archivar un comunicado

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Retirar un comunicado que ya no debe estar vigente, sin borrarlo. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El comunicado dejó de estar en vigor. |
| **PRECONDITIONS SUMMARY** | El comunicado está `PUBLISHED`. |
| **SUCCESS OUTCOME** | El comunicado queda `ARCHIVED` y deja de estar vigente; su contenido y su historia se conservan. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Announcement` |
| **OBJECT STATE CONSTRAINTS** | `PUBLISHED → ARCHIVED` |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-001` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de comunicado |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-COM-05 · Consultar un comunicado

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Leer un comunicado que me toca. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → cualquier rol concreto **alcanzado por la audiencia** |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona alcanzada |
| **TRIGGER** | Hay un comunicado vigente que me corresponde. |
| **PRECONDITIONS SUMMARY** | El comunicado está `PUBLISHED`; la persona está en la audiencia **fijada al publicar**. |
| **SUCCESS OUTCOME** | La persona lee el contenido del comunicado. **No alcanzada por dirección directa ⇒ no obtiene contenido y la respuesta es de recurso no disponible**, no un contenido recortado. |
| **AUTHORITY SOURCE** | snapshot de audiencia |
| **SCOPE** | derivado de la audiencia: `TEAM_SET` o `CLUB` |
| **OBJECT / SUBJECT** | `Announcement` |
| **OBJECT STATE CONSTRAINTS** | `PUBLISHED` |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-005` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-011` · `REQ-SYS-012` (lo no autorizado se oculta; lo bloqueado se deshabilita con razón) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de comunicado · Comunicación |
| **NOTES** | `ACT-ADMIN` **no** tiene acceso garantizado: lo tiene si está en la audiencia, no por su rol. |
| **STATUS** | `FROZEN` |

## UC-COM-06 · Abrir una conversación directa

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Hablar con otra persona en un hilo propio de los dos. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` con derecho comunicacional: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` |
| **SECONDARY ACTOR(S)** | La otra persona, si también tiene derecho comunicacional |
| **BENEFICIARY** | Los participantes |
| **TRIGGER** | Necesito hablar con alguien concreto. |
| **PRECONDITIONS SUMMARY** | Ambos tienen derecho comunicacional; la otra persona es un **candidato legítimo** (`REQ-COM-013`). |
| **SUCCESS OUTCOME** | Existe **una única** conversación directa con ese par canónico. Si ya existe, se abre la existente; el orden inverso encuentra la misma. |
| **AUTHORITY SOURCE** | `Account` + sesión + `REQ-COM-012` |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Conversation` `DIRECT` |
| **OBJECT STATE CONSTRAINTS** | Máximo una por par |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-006` (P), `REQ-COM-013` |
| **RELATED BUSINESS RULES** | `REQ-COM-012` (derecho comunicacional automático para `PLAYER`, `CAPTAIN`, `COACH`) · `REQ-PPL-004` (membresía) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Comunicación · Buscar |
| **NOTES** | `ACT-ADMIN` y `ACT-SUBCOMMITTEE` **sólo** con entitlement comunicacional. `ACT-GUARDIAN` **no** tiene accesorio comunicacional. |
| **STATUS** | `FROZEN` |

## UC-COM-07 · Crear una conversación de grupo

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Hablar con varias personas en un hilo que no depende de un equipo ni de un evento. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` con derecho comunicacional: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` |
| **SECONDARY ACTOR(S)** | Los participantes elegidos |
| **BENEFICIARY** | Los participantes |
| **TRIGGER** | Necesito hablar con un conjunto de personas. |
| **PRECONDITIONS SUMMARY** | **≥ 2 participantes** y **título obligatorio**. Los candidatos son personas con las que puede hablar legítimamente. |
| **SUCCESS OUTCOME** | Existe un grupo con título y participantes. **Varios grupos entre las mismas personas están permitidos.** Con menos de dos participantes o sin título ⇒ rechazado. |
| **AUTHORITY SOURCE** | `Account` + sesión + `REQ-COM-012` |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Conversation` `GROUP` |
| **OBJECT STATE CONSTRAINTS** | `ACTIVE` |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-007` (P), `REQ-COM-013` |
| **RELATED BUSINESS RULES** | `REQ-COM-012` · `OUT-COM-002` (la gestión de participantes y salir del grupo **no** es de V1) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Comunicación · Nueva conversación |
| **NOTES** | No hay CU para "gestionar participantes de grupo": `OUT-COM-002` lo excluye expresamente. |
| **STATUS** | `FROZEN` |

## UC-COM-08 · Abrir la conversación canónica del equipo o del evento

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Hablar con quienes participan en un equipo o en un evento, sin crear un hilo nuevo cada vez. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` con derecho comunicacional: `ACT-PLAYER`, `ACT-CAPTAIN`, `ACT-COACH` |
| **SECONDARY ACTOR(S)** | Los participantes con acceso vigente |
| **BENEFICIARY** | Los participantes |
| **TRIGGER** | Necesito coordinar algo sobre un equipo o un evento. |
| **PRECONDITIONS SUMMARY** | El equipo o el evento está en alcance del actor; el actor tiene derecho comunicacional. |
| **SUCCESS OUTCOME** | Existe **una** conversación canónica por equipo y **una** por evento (`0..1` cada una), con **título derivado del objeto real**: si el evento cambia, el título refleja el dato vigente. Si no existía, se abre. |
| **AUTHORITY SOURCE** | `Account` + sesión + `REQ-COM-012` |
| **SCOPE** | `TEAM` / `EVENT` |
| **OBJECT / SUBJECT** | `Conversation` `TEAM` / `EVENT` |
| **OBJECT STATE CONSTRAINTS** | Acceso temporal por `joined_at` / `left_at` |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-008` (P), `REQ-COM-013` |
| **RELATED BUSINESS RULES** | `REQ-COM-006` (mismo patrón de unicidad) · `REQ-COM-011` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de equipo · Ficha de evento · Comunicación |
| **NOTES** | Fusionado con la "creación" de la conversación canónica porque el objetivo es **uno**: poder hablar sobre ese objeto. La primera vez se crea; las siguientes se abre la existente. Es el mismo criterio de §16. |
| **STATUS** | `FROZEN` |

## UC-COM-09 · Enviar un mensaje

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Decir algo en una conversación. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` con derecho comunicacional, **participante** de la conversación |
| **SECONDARY ACTOR(S)** | Los demás participantes dentro de su período autorizado |
| **BENEFICIARY** | Los participantes |
| **TRIGGER** | El actor quiere informar algo en un hilo en el que participa. |
| **PRECONDITIONS SUMMARY** | El actor participa de la conversación; su acceso es vigente. |
| **SUCCESS OUTCOME** | El mensaje queda persistido y visible para los participantes autorizados. **Sin estado de envío no se afirma éxito**; con fallo, reintento **sin duplicar**. |
| **AUTHORITY SOURCE** | participación + período autorizado |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Message` |
| **OBJECT STATE CONSTRAINTS** | Sin acceso a la historia anterior a `joined_at` |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-009` (P), `REQ-COM-011` |
| **RELATED BUSINESS RULES** | `REQ-COM-012` · `REQ-COM-017` (enviar un mensaje **no** genera notificación) · `REQ-SYS-016` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Conversación |
| **NOTES** | `OUT-COM-001`: sin confirmaciones de lectura ni acuse genérico. `DEF-COM-002/003/004`: sin silenciar, sin menciones, sin respuestas anidadas. Ninguna de esas se reintroduce. |
| **STATUS** | `FROZEN` |

## UC-COM-10 · Editar un mensaje propio

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Corregir un mensaje que escribí. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED`, **sólo** sobre mensajes propios |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El autor; los participantes |
| **TRIGGER** | Escribí algo mal. |
| **PRECONDITIONS SUMMARY** | El mensaje es del actor; el actor tiene acceso vigente a la conversación. |
| **SUCCESS OUTCOME** | El mensaje refleja la corrección. Un mensaje ajeno **no** tiene operación de edición. |
| **AUTHORITY SOURCE** | autoría propia |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Message` propia |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-010` (P) |
| **RELATED BUSINESS RULES** | `REQ-INS-011` (el mensaje editado expone su historia con fecha real y actor) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Conversación |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-COM-11 · Eliminar un mensaje propio

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Retirar un mensaje propio que no debe seguir visible. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED`, **sólo** sobre mensajes propios |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El autor; los participantes |
| **TRIGGER** | Escribí algo que no debía quedar. |
| **PRECONDITIONS SUMMARY** | El mensaje es del actor; la operación es **irreversible** y por eso **exige confirmación con motivo**. |
| **SUCCESS OUTCOME** | El mensaje queda como *tombstone*: el hecho de que existió y que se borró permanece, el contenido desaparece. Un mensaje ajeno **no** tiene operación. |
| **AUTHORITY SOURCE** | autoría propia |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Message` propia |
| **OBJECT STATE CONSTRAINTS** | Irreversible |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-010` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` (nada con significado se elimina) · `REQ-SYS-007` (lo peligroso separado y con confirmación) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Conversación |
| **NOTES** | Borrar ≠ eliminar el registro: el *tombstone* es lo que hace el objetivo observable distinto de "nunca se escribió". |
| **STATUS** | `FROZEN` |

## UC-COM-12 · Archivar una conversación de grupo

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Retirar un grupo que ya no se usa sin borrar lo que se dijo en él. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED`, participante del grupo |
| **SECONDARY ACTOR(S)** | Los demás participantes |
| **BENEFICIARY** | Los participantes |
| **TRIGGER** | El grupo dejó de servir. |
| **PRECONDITIONS SUMMARY** | La conversación es de tipo `GROUP` y está `ACTIVE`; el actor participa. |
| **SUCCESS OUTCOME** | La conversación queda archivada. El contenido y el período de cada participante se conservan. |
| **AUTHORITY SOURCE** | participación + `Account` + sesión |
| **SCOPE** | `SELF` |
| **OBJECT / SUBJECT** | `Conversation` `GROUP` |
| **OBJECT STATE CONSTRAINTS** | `ACTIVE → ARCHIVED` |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-007` (P, AC 4) |
| **RELATED BUSINESS RULES** | `REQ-COM-011` (el ex-participante conserva su período) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Conversación de grupo |
| **NOTES** | Existe porque `REQ-COM-007` AC 4 lo dice literalmente: *"GIVEN una conversación de grupo WHEN se archiva THEN queda archivada"*. **No** existe CU de archivar una conversación directa ni una canónica: ningún REQ lo expresa. |
| **STATUS** | `FROZEN` |

## UC-COM-13 · Consultar mis notificaciones

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Saber qué novedades me afectan y que no me enteré. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → los 6 roles concretos |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona notificada |
| **TRIGGER** | La persona quiere revisar sus avisos. |
| **PRECONDITIONS SUMMARY** | Sesión vigente. |
| **SUCCESS OUTCOME** | Ve sus notificaciones con **destinatario, tipo, recurso, origen y fecha**; los no leídos primero; el tipo en lenguaje de usuario. La combinación origen + destinatario + tipo **no** se repite. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | derivado del actor |
| **OBJECT / SUBJECT** | `Notification` |
| **OBJECT STATE CONSTRAINTS** | Sólo **7 tipos**: posponer, reprogramar, cancelar, restaurar, alta/baja en convocatoria, comunicado publicado, y los derivados de cambio de destinatarios |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-018` (P), `REQ-COM-014` (P), `REQ-COM-015`, `REQ-COM-016` |
| **RELATED BUSINESS RULES** | `REQ-COM-017` (lista negativa cerrada) · `REQ-SYS-015` · `DEF-COM-001` / `DEF-COM-002` (recordatorios y silenciar no son de V1) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Notificaciones |
| **NOTES** | **No** se crea CU de "preferencias de notificación" (`DEF-IAM-001`) ni de "silenciar" (`DEF-COM-002`). `IWR-07` (marcar todas como leídas) y `IWR-08` (filtro Todas/Sin leer) son `ACCIDENTAL UI`: la presentación de `REQ-COM-018` los cubre y no producen CU. |
| **STATUS** | `FROZEN` |

## UC-COM-14 · Marcar una notificación como leída

| Campo | Valor |
|---|---|
| **DOMAIN** | COM |
| **GOAL** | Sacarme de encima una notificación que ya vi, sin salir de donde estoy. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → los 6 roles concretos |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona leyó la notificación. |
| **PRECONDITIONS SUMMARY** | La notificación pertenece a la persona y no estaba leída. |
| **SUCCESS OUTCOME** | Queda registrada como leída **sin salir de la lista**. La combinación origen + destinatario + tipo no se rompe ni se duplica. |
| **AUTHORITY SOURCE** | `Account` + sesión |
| **SCOPE** | derivado del actor |
| **OBJECT / SUBJECT** | `Notification` propia |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-COM-018` (P) |
| **RELATED BUSINESS RULES** | `REQ-SYS-013` (el botón atrás devuelve el contexto) |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Notificaciones |
| **NOTES** | Separate de `UC-COM-13` porque el resultado observable es distinto: consultar no muta, marcar sí. |
| **STATUS** | `FROZEN` |

---

# 9. CASOS DE USO CANÓNICOS — CMP (9)

## UC-CMP-01 · Registrar una competencia

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Crear una competencia del club. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-ADMIN` (alcance `CLUB`) |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El club se inscribe en una competencia o defines una interna. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment SUBCOMMITTEE` o `RoleAssignment ADMIN` vigente. |
| **SUCCESS OUTCOME** | Existe una `Competition` en `DRAFT`. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Competition` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT` |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-001` (P) |
| **RELATED BUSINESS RULES** | `REQ-CMP-006` (sólo se puede asociar referencia externa a `COMPETITION`, `COMPETITION_ENTRY` o `MATCH_EVENT`) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias |
| **NOTES** | `ACT-ADMIN` y `ACT-SUBCOMMITTEE` gestionan competencias: PT §5 fila `Competitions/Entries` = `✓` para ambos. La separación de `REQ-STR-009` es **sólo** de estructura, no de competencia. |
| **STATUS** | `FROZEN` |

## UC-CMP-02 · Activar una competencia

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Dejar una competencia abierta para que los equipos se inscriban. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | La competencia está definida y hay que abrirla. |
| **PRECONDITIONS SUMMARY** | La competencia está `DRAFT`. |
| **SUCCESS OUTCOME** | La competencia queda `ACTIVE` y admite inscripciones. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Competition` |
| **OBJECT STATE CONSTRAINTS** | `DRAFT → ACTIVE` |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-001` (P) |
| **RELATED BUSINESS RULES** | `REQ-CMP-003` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-CMP-03 · Cerrar una competencia

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Cerrar una competencia que ya terminó, conservando su historial. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | La competencia terminó. |
| **PRECONDITIONS SUMMARY** | La competencia está `ACTIVE` y tiene **0 inscripciones activas**. |
| **SUCCESS OUTCOME** | La competencia queda `CLOSED` y su histórico se conserva. Con inscripciones activas ⇒ **rechazada explicándolas**. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `Competition` |
| **OBJECT STATE CONSTRAINTS** | `ACTIVE → CLOSED` · 0 inscripciones activas exigidas |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-002` (P) |
| **RELATED BUSINESS RULES** | `REQ-EVT-024` (valla de dependencias) · `REQ-PPL-015` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias |
| **NOTES** | — |
| **STATUS** | `FROZEN` |

## UC-CMP-04 · Inscribir un equipo en una competencia

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Registrar que un equipo participa en una competencia. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; el equipo |
| **TRIGGER** | El club decide inscribir a un equipo. |
| **PRECONDITIONS SUMMARY** | La competencia está `ACTIVE`; el equipo existe. |
| **SUCCESS OUTCOME** | Existe una inscripción de alcance `TEAM` en `PENDING`, identificada por el equipo. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `CompetitionEntry` con `scope = TEAM` |
| **OBJECT STATE CONSTRAINTS** | `PENDING` al crearse |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-003` (P), `REQ-CMP-004` (P) |
| **RELATED BUSINESS RULES** | `REQ-CMP-005` (uso en un partido) · `REQ-STR-010` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias |
| **NOTES** | **No fusionado** con `UC-CMP-05`: PT §4 y `REQ-CMP-004` los tratan como alcances distintos con reglas de validación distintas y errores distintos. |
| **STATUS** | `FROZEN` |

## UC-CMP-05 · Inscribir una línea en una competencia

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Registrar que una línea participa en una competencia. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; la línea |
| **TRIGGER** | El club decide inscribir a una línea. |
| **PRECONDITIONS SUMMARY** | La competencia está `ACTIVE`; la línea existe y su temporada es válida. |
| **SUCCESS OUTCOME** | Existe una inscripción de alcance `LINE` en `PENDING`, identificada por división, línea y temporada. Incompatibilidad con el uso en un partido ⇒ `COMPETITION_SCOPE_MISMATCH` con causa en lenguaje de usuario. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `CompetitionEntry` con `scope = LINE` |
| **OBJECT STATE CONSTRAINTS** | `PENDING` al crearse |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-003` (P), `REQ-CMP-004` (P) |
| **RELATED BUSINESS RULES** | `REQ-CMP-005` · `REQ-STR-010` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias |
| **NOTES** | `LINE` y `TEAM` son alcances **de dato**, no scopes de actor. E2 §9.2. |
| **STATUS** | `FROZEN` |

## UC-CMP-06 · Activar una inscripción en una competencia

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Dejar activa una inscripción para que se pueda usar en un partido. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | La inscripción está completa y hay que habilitarla. |
| **PRECONDITIONS SUMMARY** | La inscripción está `PENDING`; su alcance es compatible con el uso previsto. |
| **SUCCESS OUTCOME** | La inscripción queda `ACTIVE` y puede ser la inscripción usada por un partido de esa competencia. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `CompetitionEntry` |
| **OBJECT STATE CONSTRAINTS** | `PENDING → ACTIVE` |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-003` (P), `REQ-CMP-004` |
| **RELATED BUSINESS RULES** | `REQ-CMP-005` · `REQ-EVT-024` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias |
| **NOTES** | Un CU para cualquier alcance: la diferencia entre `TEAM` y `LINE` está en `UC-CMP-04` / `UC-CMP-05` y en la regla de compatibilidad, no en el objetivo. |
| **STATUS** | `FROZEN` |

## UC-CMP-07 · Finalizar una inscripción en una competencia

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Cerrar la participación de un equipo o una línea en una competencia, conservando el histórico. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El equipo o la línea ya no participa. |
| **PRECONDITIONS SUMMARY** | La inscripción está `ACTIVE`. Si está **en uso por partidos**, la operación se serializa contra la creación de nuevas dependencias. |
| **SUCCESS OUTCOME** | La inscripción queda `ENDED`, se explica su consecuencia y su histórico se conserva. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `CompetitionEntry` |
| **OBJECT STATE CONSTRAINTS** | `ACTIVE → ENDED` · en uso ⇒ serialización |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-003` (P), `REQ-EVT-024` |
| **RELATED BUSINESS RULES** | `REQ-PPL-015` · `REQ-SYS-018` |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias |
| **NOTES** | Finalizar la inscripción es lo que habilita `UC-CMP-03` (cerrar la competencia con 0 inscripciones activas). |
| **STATUS** | `FROZEN` |

## UC-CMP-08 · Registrar una referencia externa

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Dejar asentado el dato federativo oficial sin construir una integración. |
| **PRIMARY ACTOR(S)** | `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | Hay un identificador o estado oficial que hay que registrar. |
| **PRECONDITIONS SUMMARY** | El objetivo asociado es uno de la **lista blanca**: `COMPETITION`, `COMPETITION_ENTRY`, `MATCH_EVENT`. |
| **SUCCESS OUTCOME** | La referencia queda asociada a un objetivo permitido y **no** a otro. El sistema **no** afirma que provenga de una fuente sincronizada. Toda restricción registra estado, motivo y vigencia, **sin historia clínica**. |
| **AUTHORITY SOURCE** | `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `ExternalReference` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-006` (P), `REQ-CMP-007` (P) |
| **RELATED BUSINESS RULES** | `OUT-CMP-003` (integración automática federativa **no** es de V1) · `OUT-CMP-004` (pases y habilitaciones federativas completas **no** son de V1) |
| **INCLUDE CANDIDATES** | `UC-IAM-09` |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Administración de competencias · Ficha de partido |
| **NOTES** | **`RWS-03`: sin superficie actual.** `OUT-CMP-003` no se reintroduce como integración: la referencia es **manual y puntual**. |
| **STATUS** | `FROZEN` |

## UC-CMP-09 · Consultar una referencia externa

| Campo | Valor |
|---|---|
| **DOMAIN** | CMP |
| **GOAL** | Ver el identificador o estado oficial registrado, sabiendo que no es verdad federativa. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (lectura) · `ACT-SUBCOMMITTEE` · `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | El usuario necesita ver el dato federativo de un objeto. |
| **PRECONDITIONS SUMMARY** | El objeto tiene una referencia externa registrada; el actor tiene alcance. |
| **SUCCESS OUTCOME** | El actor ve la referencia **identificada como referencia**, y el sistema **no** afirma sincronización ni resuelve por sí mismo una consulta sobre pases u habilitación oficial. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` (lectura) / `RoleAssignment SUBCOMMITTEE` / `RoleAssignment ADMIN` |
| **SCOPE** | `TEAM` / `EVENT` / `CLUB` |
| **OBJECT / SUBJECT** | `ExternalReference` |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-CMP-006` (P), `REQ-CMP-007` (P) |
| **RELATED BUSINESS RULES** | `REQ-CMP-008` · `REQ-SYS-015` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de partido · Administración de competencias |
| **NOTES** | **No fusionado** con `UC-CMP-08`: PT §5 da `lectura` a `COACH` y `✓` a `SUBCOMMITTEE`/`ADMIN`. `ACT-COACH` puede consultar y **no** puede registrar. Son dos autoridades distintas sobre el mismo hecho. |
| **STATUS** | `FROZEN` |

---

# 10. CASOS DE USO CANÓNICOS — INS (5)

## UC-INS-01 · Buscar en el club

| Campo | Valor |
|---|---|
| **DOMAIN** | INS |
| **GOAL** | Encontrar una persona, un equipo, un evento o una división o línea sin recorrer todo. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → los 6 roles concretos |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona que busca |
| **TRIGGER** | La persona busca algo del club. |
| **PRECONDITIONS SUMMARY** | La persona tiene actor válido. |
| **SUCCESS OUTCOME** | Ve resultados de personas, equipos, eventos y divisiones o líneas. "Sin consulta" **≠** "cero resultados": si no se buscó, no se dice que no hay nada; si se buscó y no hay, se dice y se ofrece el siguiente paso. La estructura se busca por división y línea. |
| **AUTHORITY SOURCE** | `Account` + sesión + `REQ-PPL-011` |
| **SCOPE** | derivado del actor |
| **OBJECT / SUBJECT** | personas, equipos, eventos, divisiones o líneas |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-INS-001` (P), `REQ-INS-002` (P), `REQ-INS-003` (P) |
| **RELATED BUSINESS RULES** | `REQ-PPL-011` (los resultados respetan la autoridad por campo; el campo no autorizado **no existe** en la respuesta) · `REQ-SYS-013` (la consulta sobrevive al botón atrás y se reproduce por dirección directa) · `REQ-SYS-011` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Buscar |
| **NOTES** | **Un** CU para los tres REQ: el alcance, el PII y la persistencia de la consulta son reglas del mismo objetivo, no objetivos separados. |
| **STATUS** | `FROZEN` |

## UC-INS-02 · Consultar el informe de asistencia

| Campo | Valor |
|---|---|
| **DOMAIN** | INS |
| **GOAL** | Ver cómo se dio la asistencia en un período. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-PLAYER` (sólo lo propio) · **`ACT-CAPTAIN` (`TEAM` si corresponde)** |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; la jugadora |
| **TRIGGER** | Alguien quiere ver la asistencia de un período. |
| **PRECONDITIONS SUMMARY** | El actor tiene alcance; el período aplicado es visible. |
| **SUCCESS OUTCOME** | El informe **distingue presente, ausente, justificada y sin registrado**: lo no registrado nunca se cuenta como ausente. La jugadora ve sólo lo suyo. **Cada fila enlaza al hecho que la originó**, respetando la autoridad. `ACT-ADMIN` **no** tiene acceso: es una denegación explícita, no una omisión. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `SUBCOMMITTEE` / `PLAYER` / `CAPTAIN` |
| **SCOPE** | `TEAM` / `CLUB` / `SELF` |
| **OBJECT / SUBJECT** | `Attendance` agregada |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-INS-004` (P), `REQ-INS-006` (P), `REQ-INS-007` (P), `REQ-PRT-010` |
| **RELATED BUSINESS RULES** | `REQ-PRT-012` (el antes y el después de una corrección son visibles) · `OUT-INS-001` / `OUT-INS-002` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Informes |
| **NOTES** | `ACTOR-FEEDBACK-03` resuelto: `ACT-CAPTAIN` con `TEAM` "si corresponde", por PT §5. El período aplicado es **visible y modificable** (`REQ-INS-006`). |
| **STATUS** | `FROZEN` |

## UC-INS-03 · Consultar el informe de rendimiento

| Campo | Valor |
|---|---|
| **DOMAIN** | INS |
| **GOAL** | Ver cómo rindieron las jugadoras en un período. |
| **PRIMARY ACTOR(S)** | `ACT-COACH` (alcance `TEAM`) · `ACT-SUBCOMMITTEE` (alcance `CLUB`) · `ACT-PLAYER` (sólo lo propio) · **`ACT-CAPTAIN` (`TEAM` si corresponde)** |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club; la jugadora |
| **TRIGGER** | Alguien quiere ver el rendimiento de un período. |
| **PRECONDITIONS SUMMARY** | El actor tiene alcance; el período aplicado es visible. |
| **SUCCESS OUTCOME** | Los partidos jugados se derivan del **resultado**, no de la asistencia. La jugadora ve sólo lo suyo. Cada fila enlaza al partido que la originó. `ACT-ADMIN` **no** tiene acceso. |
| **AUTHORITY SOURCE** | `RoleAssignment COACH` / `SUBCOMMITTEE` / `PLAYER` / `CAPTAIN` |
| **SCOPE** | `TEAM` / `CLUB` / `SELF` |
| **OBJECT / SUBJECT** | `MatchRecord` agregado |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-INS-005` (P), `REQ-INS-006` (P), `REQ-INS-007` (P), `REQ-PRT-016` |
| **RELATED BUSINESS RULES** | `REQ-PRT-013` · `REQ-PRT-014` · `DEF-CMP-001` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Informes |
| **NOTES** | **No fusionado** con `UC-PRT-11` (§42): agregado y transversal vs. por partido y con alcance deportivo. |
| **STATUS** | `FROZEN` |

## UC-INS-04 · Consultar el historial de un objeto

| Campo | Valor |
|---|---|
| **DOMAIN** | INS |
| **GOAL** | Entender qué pasó con una cosa y cuándo, en el lugar donde la estoy mirando. |
| **PRIMARY ACTOR(S)** | `ACT-AUTHENTICATED` → los 6 roles concretos, cada uno con su alcance |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | La persona |
| **TRIGGER** | La persona quiere entender por qué un valor cambió. |
| **PRECONDITIONS SUMMARY** | El objeto está en alcance; la persona tiene actor válido. |
| **SUCCESS OUTCOME** | En la superficie que corresponde, ve: correcciones de asistencia (antes, nuevo, motivo, autor, fecha); correcciones de resultado (marcador anterior); revisiones publicadas de convocatoria; líneas de historia del evento; correcciones de comunicado; estado de un mensaje editado o borrado. **Con fecha real y actor.** La historia se deriva de las entidades y de la auditoría. |
| **AUTHORITY SOURCE** | `Account` + sesión + alcance |
| **SCOPE** | derivado del actor |
| **OBJECT / SUBJECT** | historia por superficie |
| **OBJECT STATE CONSTRAINTS** | — |
| **SUPPORTING REQUIREMENTS** | `REQ-INS-011` (P) |
| **RELATED BUSINESS RULES** | `REQ-INS-012` (**no** hay tabla genérica ni línea de tiempo personal) · `REQ-INS-009` · `OUT-SYS-001` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Ficha de evento · Ficha de persona · Conversación · Informes |
| **NOTES** | **No fusionado** con `UC-INS-05`: el historial funcional de un objeto y la auditoría administrativa tienen **actores,authority y goals distintos**. §42. Un solo CU con 6 alternativas de superficie, no 6 CU: el objetivo —comprender qué pasó— es el mismo. |
| **STATUS** | `FROZEN` |

## UC-INS-05 · Consultar la auditoría administrativa

| Campo | Valor |
|---|---|
| **DOMAIN** | INS |
| **GOAL** | Revisar qué cambió en el club, quién lo cambió y por qué. |
| **PRIMARY ACTOR(S)** | `ACT-ADMIN` |
| **SECONDARY ACTOR(S)** | — |
| **BENEFICIARY** | El club |
| **TRIGGER** | La administración necesita revisar la trazabilidad de cambios. |
| **PRECONDITIONS SUMMARY** | `RoleAssignment ADMIN` vigente. |
| **SUCCESS OUTCOME** | Ve **qué** cambió, **quién**, **cuándo**, el **motivo** cuando la acción lo exige, y el **enlace al objeto**. Los datos sensibles aparecen **redactados**. Puede filtrar por rango de fechas y por actor. |
| **AUTHORITY SOURCE** | `RoleAssignment ADMIN` |
| **SCOPE** | `CLUB` |
| **OBJECT / SUBJECT** | `AuditEntry` |
| **OBJECT STATE CONSTRAINTS** | Sólo lectura agregada: **no** existe modificación ni eliminación de entradas |
| **SUPPORTING REQUIREMENTS** | `REQ-INS-008` (P), `REQ-INS-009` (P), `REQ-INS-010` (P) |
| **RELATED BUSINESS RULES** | `REQ-SYS-020` (sin contraseñas, hashes, tokens, cookies, cuerpos de mensaje ni documentos) · `REQ-PPL-011` |
| **INCLUDE CANDIDATES** | — |
| **EXTEND CANDIDATES** | — |
| **POTENTIAL CONTEXT** | Auditoría |
| **NOTES** | Único actor: `ACT-ADMIN`. `ACT-SUBCOMMITTEE` y `ACT-GUARDIAN` **no** ven auditoría. `OUT-INS-001`: no hay exportación. `OUT-SYS-001`: no hay línea de tiempo personal de actividad. |
| **STATUS** | `FROZEN` |

---

# 11. ÍNDICE DE CASOS DE USO

| # | ID | Nombre | Dominio | Actores primarios |
|---:|---|---|---|---|
| 1 | `UC-IAM-01` | Iniciar sesión | IAM | `ACT-UNAUTHENTICATED` |
| 2 | `UC-IAM-02` | Deshabilitar una cuenta | IAM | `ACT-ADMIN` |
| 3 | `UC-IAM-03` | Emitir un código de activación | IAM | `ACT-ADMIN` |
| 4 | `UC-IAM-04` | Activar una cuenta con un código de un solo uso | IAM | `ACT-UNAUTHENTICATED` |
| 5 | `UC-IAM-05` | Restablecer el acceso de una cuenta | IAM | `ACT-ADMIN` |
| 6 | `UC-IAM-06` | Cambiar mi contraseña | IAM | `ACT-AUTHENTICATED` |
| 7 | `UC-IAM-07` | Consultar mis sesiones activas | IAM | `ACT-AUTHENTICATED` |
| 8 | `UC-IAM-08` | Cerrar una sesión remota | IAM | `ACT-AUTHENTICATED` |
| 9 | `UC-IAM-09` | Reautenticar para una gestión sensible | IAM | `ACT-ADMIN`, `ACT-SUBCOMMITTEE` |
| 10 | `UC-IAM-10` | Retomar el trabajo tras una interrupción de sesión | IAM | `ACT-AUTHENTICATED` |
| 11 | `UC-PPL-01` | Registrar una persona | PPL | `ACT-ADMIN` |
| 12 | `UC-PPL-02` | Completar el perfil de una jugadora | PPL | `ACT-ADMIN` |
| 13 | `UC-PPL-03` | Vincular una cuenta a una persona | PPL | `ACT-ADMIN` |
| 14 | `UC-PPL-04` | Registrar una membresía al club | PPL | `ACT-ADMIN` |
| 15 | `UC-PPL-05` | Finalizar una membresía al club | PPL | `ACT-ADMIN` |
| 16 | `UC-PPL-06` | Incorporar una jugadora a un equipo | PPL | `ACT-ADMIN` |
| 17 | `UC-PPL-07` | Cambiar de equipo a una jugadora | PPL | `ACT-ADMIN` |
| 18 | `UC-PPL-08` | Retirar a una jugadora del equipo | PPL | `ACT-ADMIN` |
| 19 | `UC-PPL-09` | Asignar un rol con alcance | PPL | `ACT-ADMIN` |
| 20 | `UC-PPL-10` | Finalizar un rol asignado | PPL | `ACT-ADMIN` |
| 21 | `UC-PPL-11` | Registrar una relación de representación | PPL | `ACT-ADMIN` |
| 22 | `UC-PPL-12` | Finalizar una relación de representación | PPL | `ACT-ADMIN` |
| 23 | `UC-PPL-13` | Consultar la información del menor delegado | PPL | `ACT-GUARDIAN` |
| 24 | `UC-PPL-14` | Consultar quién actúa por mi cuenta | PPL | `ACT-PLAYER`, `ACT-GUARDIAN` |
| 25 | `UC-PPL-15` | Conocer qué falta en mi perfil y cómo completarlo | PPL | `ACT-PLAYER` |
| 26 | `UC-PPL-16` | Consultar mi perfil | PPL | `ACT-AUTHENTICATED` |
| 27 | `UC-PPL-17` | Editar mi contacto | PPL | `ACT-AUTHENTICATED` |
| 28 | `UC-STR-01` | Registrar una temporada | STR | `ACT-ADMIN` |
| 29 | `UC-STR-02` | Actualizar los datos de una temporada | STR | `ACT-ADMIN` |
| 30 | `UC-STR-03` | Registrar una división | STR | `ACT-ADMIN` |
| 31 | `UC-STR-04` | Actualizar una división | STR | `ACT-ADMIN` |
| 32 | `UC-STR-05` | Archivar una división | STR | `ACT-ADMIN` |
| 33 | `UC-STR-06` | Registrar una línea | STR | `ACT-ADMIN` |
| 34 | `UC-STR-07` | Actualizar una línea | STR | `ACT-ADMIN` |
| 35 | `UC-STR-08` | Archivar una línea | STR | `ACT-ADMIN` |
| 36 | `UC-STR-09` | Registrar un equipo | STR | `ACT-ADMIN` |
| 37 | `UC-STR-10` | Actualizar un equipo | STR | `ACT-ADMIN` |
| 38 | `UC-STR-11` | Activar un equipo | STR | `ACT-ADMIN` |
| 39 | `UC-STR-12` | Archivar un equipo | STR | `ACT-ADMIN` |
| 40 | `UC-STR-13` | Registrar una sede | STR | `ACT-ADMIN` |
| 41 | `UC-STR-14` | Corregir los datos de una sede | STR | `ACT-ADMIN` |
| 42 | `UC-STR-15` | Archivar una sede | STR | `ACT-ADMIN` |
| 43 | `UC-EVT-01` | Crear un entrenamiento | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 44 | `UC-EVT-02` | Crear un partido | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 45 | `UC-EVT-03` | Crear un evento del club | EVT | `ACT-SUBCOMMITTEE`, `ACT-COACH` |
| 46 | `UC-EVT-04` | Editar un evento | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 47 | `UC-EVT-05` | Posponer un evento | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 48 | `UC-EVT-06` | Reanudar un evento pospuesto | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 49 | `UC-EVT-07` | Cancelar un evento | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 50 | `UC-EVT-08` | Restaurar un evento cancelado | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 51 | `UC-EVT-09` | Completar un evento | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 52 | `UC-EVT-10` | Abandonar un evento | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 53 | `UC-EVT-11` | Revisar el impacto de un cambio material | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 54 | `UC-EVT-12` | Resolver un conflicto de edición concurrente | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 55 | `UC-EVT-13` | Crear una serie de eventos | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 56 | `UC-EVT-14` | Finalizar una serie de eventos | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 57 | `UC-EVT-15` | Programar una jornada | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` |
| 58 | `UC-EVT-16` | Actualizar la logística de un evento | EVT | `ACT-COACH`, `ACT-SUBCOMMITTEE` · `ACT-CAPTAIN` alterno |
| 59 | `UC-EVT-17` | Consultar el calendario | EVT | `ACT-AUTHENTICATED` |
| 60 | `UC-EVT-18` | Revisar lo que requiere mi atención | EVT | `ACT-AUTHENTICATED` |
| 61 | `UC-EVT-19` | Consultar un evento | EVT | `ACT-AUTHENTICATED` |
| 62 | `UC-PRT-01` | Responder mi disponibilidad | PRT | `ACT-PLAYER`, `ACT-GUARDIAN` |
| 63 | `UC-PRT-02` | Preparar la convocatoria de un partido | PRT | `ACT-COACH` |
| 64 | `UC-PRT-03` | Publicar la convocatoria de un partido | PRT | `ACT-COACH` |
| 65 | `UC-PRT-04` | Revisar los conflictos de una convocatoria | PRT | `ACT-COACH` |
| 66 | `UC-PRT-05` | Registrar la asistencia de un evento | PRT | `ACT-COACH` |
| 67 | `UC-PRT-06` | Cerrar la asistencia de un evento | PRT | `ACT-COACH` |
| 68 | `UC-PRT-07` | Corregir la asistencia de un evento | PRT | `ACT-COACH` |
| 69 | `UC-PRT-08` | Registrar el resultado de un partido | PRT | `ACT-COACH` |
| 70 | `UC-PRT-09` | Finalizar el resultado de un partido | PRT | `ACT-COACH` |
| 71 | `UC-PRT-10` | Corregir el resultado de un partido | PRT | `ACT-COACH` |
| 72 | `UC-PRT-11` | Consultar las estadísticas de un partido | PRT | `ACT-COACH` · `ACT-CAPTAIN` alterno |
| 73 | `UC-PRT-12` | Registrar una restricción de habilitación | PRT | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 74 | `UC-PRT-13` | Consultar el estado de habilitación de una jugadora | PRT | `ACT-SUBCOMMITTEE`, `ACT-ADMIN`, `ACT-COACH` |
| 75 | `UC-COM-01` | Redactar un comunicado | COM | `ACT-SUBCOMMITTEE` |
| 76 | `UC-COM-02` | Publicar un comunicado | COM | `ACT-SUBCOMMITTEE` |
| 77 | `UC-COM-03` | Corregir un comunicado publicado | COM | `ACT-SUBCOMMITTEE` |
| 78 | `UC-COM-04` | Archivar un comunicado | COM | `ACT-SUBCOMMITTEE` |
| 79 | `UC-COM-05` | Consultar un comunicado | COM | `ACT-AUTHENTICATED` |
| 80 | `UC-COM-06` | Abrir una conversación directa | COM | `ACT-AUTHENTICATED` con derecho comunicacional |
| 81 | `UC-COM-07` | Crear una conversación de grupo | COM | `ACT-AUTHENTICATED` con derecho comunicacional |
| 82 | `UC-COM-08` | Abrir la conversación canónica del equipo o del evento | COM | `ACT-AUTHENTICATED` con derecho comunicacional |
| 83 | `UC-COM-09` | Enviar un mensaje | COM | `ACT-AUTHENTICATED` participante |
| 84 | `UC-COM-10` | Editar un mensaje propio | COM | `ACT-AUTHENTICATED` |
| 85 | `UC-COM-11` | Eliminar un mensaje propio | COM | `ACT-AUTHENTICATED` |
| 86 | `UC-COM-12` | Archivar una conversación de grupo | COM | `ACT-AUTHENTICATED` participante |
| 87 | `UC-COM-13` | Consultar mis notificaciones | COM | `ACT-AUTHENTICATED` |
| 88 | `UC-COM-14` | Marcar una notificación como leída | COM | `ACT-AUTHENTICATED` |
| 89 | `UC-CMP-01` | Registrar una competencia | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 90 | `UC-CMP-02` | Activar una competencia | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 91 | `UC-CMP-03` | Cerrar una competencia | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 92 | `UC-CMP-04` | Inscribir un equipo en una competencia | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 93 | `UC-CMP-05` | Inscribir una línea en una competencia | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 94 | `UC-CMP-06` | Activar una inscripción en una competencia | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 95 | `UC-CMP-07` | Finalizar una inscripción en una competencia | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 96 | `UC-CMP-08` | Registrar una referencia externa | CMP | `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 97 | `UC-CMP-09` | Consultar una referencia externa | CMP | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-ADMIN` |
| 98 | `UC-INS-01` | Buscar en el club | INS | `ACT-AUTHENTICATED` |
| 99 | `UC-INS-02` | Consultar el informe de asistencia | INS | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-PLAYER`, `ACT-CAPTAIN` |
| 100 | `UC-INS-03` | Consultar el informe de rendimiento | INS | `ACT-COACH`, `ACT-SUBCOMMITTEE`, `ACT-PLAYER`, `ACT-CAPTAIN` |
| 101 | `UC-INS-04` | Consultar el historial de un objeto | INS | `ACT-AUTHENTICATED` |
| 102 | `UC-INS-05` | Consultar la auditoría administrativa | INS | `ACT-ADMIN` |

---

**Fin del Master Use Case Catalog V1.**

**SOURCE MODIFIED: NO.** Este lote creó únicamente archivos bajo `docs/use-cases/`.

