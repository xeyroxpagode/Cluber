# GEI HOCKEY MANAGEMENT SYSTEM
## PRE-E3 INPUT CLOSURE V1

**Etapa:** 3 — Uso de casos · **Sub-etapa:** PRE-E3
**Estado:** CERRADO · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e3-use-case-inventory-freeze-v1`
**Baseline:** `730bf8ffee428666d24a588e23f23b457dc35123` (`gei/e2-actor-model-freeze-v1`)

**Propósito.** Resolver o clasificar **todo** input de E1 y E2 que pueda alterar el inventario de
casos de uso **antes** de derivar un solo caso. Ningún `UC-*` existe todavía en este documento.

---

# 1. RESULTADO EN UNA TABLA

| Métrica | Valor |
|---|---:|
| Decisiones de E1 revisadas | 2 |
| Decisiones de E1 resueltas para E3 | **2** |
| Decisiones de E1 que permanecen abiertas | 2 (**0 bloqueantes**) |
| Decisiones de E2 revisadas | 2 |
| Decisiones de E2 resueltas para E3 (valor congelado por E2) | **2** |
| Decisiones de E2 que permanecen abiertas como *change candidate* | 2 (**0 bloqueantes**) |
| Feedbacks de E2 (`ACTOR-FEEDBACK-01…09`) clasificados | 9 |
| Feedbacks de E3 (`UC-FEEDBACK-01…03`) detectados | 3 |
| Feedbacks `SEMANTIC_CHANGE` | **0** |
| Feedbacks `NEW_PRODUCT_DECISION` | **0** |
| Versiones nuevas de `docs/requirements/**` | **0** |
| Versiones nuevas de `docs/actors/**` | **0** |
| Decisiones bloqueantes para E3 | **0** |
| `E3_REQUIREMENTS_AUTHORITY` | `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` — **V1** |
| `E3_ACTOR_AUTHORITY` | `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` — **V1** |

**Veredicto: el insumo de E3 está cerrado. E3 puede comenzar.**

---

# 2. CLASIFICACIÓN DE FEEDBACK

## 2.1 Feedbacks de E2 (`ACTOR-FEEDBACK-01…09`)

Origen: `docs/actors/GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md` §17 y §17.1–§17.2.
**E2 no editó E1.** E3 tampoco.

| ID | REQ afectado | Clasificación E3 | Resolución E3 | Impacto en el inventario de CU | ¿Requiere versión nueva? |
|---|---|---|---|---|---|
| `ACTOR-FEEDBACK-01` | `REQ-EVT-019` | `CLARIFICATION_NO_SEMANTIC_CHANGE` | **Resuelto.** PT §5 fila `Logistics` declara `CAPTAIN: Team scope`; E2 §7.2–§7.3 ya lo congeló como autoridad propia de `ACT-CAPTAIN` sobre el `target` de su `RoleAssignment`. `REQ-EVT-019` AC 2 ("prospera según su alcance") se lee con ese alcance. | **0**. `UC-EVT-16 · Actualizar la logística de un evento` registra a `ACT-CAPTAIN` como `ALTERNATE AUTHORIZED ACTOR` con scope `TEAM` explícito. No aparece ningún CU "logística como capitana". | **NO** |
| `ACTOR-FEEDBACK-02` | `REQ-PRT-001` vs PT §5 | `CLARIFICATION_NO_SEMANTIC_CHANGE` | **Resuelto.** PT §5 concede `CAPTAIN ✓` en "responder propia Availability"; `REQ-PRT-001` AC 3 exige `RoleAssignment PLAYER` vigente. No es contradicción: PT §17 (`AssignPlayerToTeam`, `MovePlayerTeam`, `EndPlayerTeam`), `REQ-PPL-007` AC y E2 §7.5 congelan la invariante de co-ocurrencia `PLAYER` + `CAPTAIN` sobre el mismo equipo. El `✓` de PT §5 es **satisfacible**, no contradictorio. Rige `REQ-PRT-001` AC 3 para el test de autoridad. | **0**. `UC-PRT-01` exige rol `PLAYER` vigente. `ACT-CAPTAIN` participa como `ALTERNATE AUTHORIZED ACTOR` **por la invariante de co-ocurrencia**, nunca por analogía con `ACT-COACH`. | **NO** |
| `ACTOR-FEEDBACK-03` | `REQ-INS-004`, `REQ-INS-005` | `CLARIFICATION_NO_SEMANTIC_CHANGE` | **Resuelto.** PT §5 filas `Attendance report` y `Performance report` conceden `CAPTAIN: Team si corresponde`. La matriz de E2 §8 ya lo registra como secundario. La condición "si corresponde" se conserva literalmente. | **0**. `UC-INS-02` y `UC-INS-03` incluyen a `ACT-CAPTAIN` como `ALTERNATE AUTHORIZED ACTOR`, scope `TEAM`, condición "si corresponde". | **NO** |
| `ACTOR-FEEDBACK-04` | `REQ-COM-012` | `CLARIFICATION_NO_SEMANTIC_CHANGE` | **Resuelto** por E2 §12.2 (nota 3): la regla es interna y sus actores afectados se listan explícitamente. | **0**. `REQ-COM-012` se clasifica `CROSS_CUTTING` y gobierna la elegibilidad de `UC-COM-06`, `UC-COM-07`, `UC-COM-08`, `UC-COM-09`. No genera CU. | **NO** |
| `ACTOR-FEEDBACK-05` | `REQ-IAM-003` | `TYPO_OR_METRIC` (vocabulario) | **Resuelto.** El consumidor no es "Club member": es la persona con `Account PENDING` y un código vigente de un solo uso, sin sesión. E2 §11.4 ya lo modela como `ACT-UNAUTHENTICATED`. | **0**. `UC-IAM-04 · Activar una cuenta con un código de un solo uso` tiene como actor primario `ACT-UNAUTHENTICATED`. | **NO** |
| `ACTOR-FEEDBACK-06` | `REQ-IAM-012` | `CLARIFICATION_NO_SEMANTIC_CHANGE` | **Resuelto** por E2 §4.2 y §4.4: una `Account ACTIVE` sin `RoleAssignment` vigente y sin `GuardianRelationship` **no satisface ningún actor** y obtiene `/no-access` sin datos ni destinos. | **0**. `REQ-IAM-012` se clasifica `CROSS_CUTTING`. **No** se crea "Autenticar usuario" como CU ni como `<<include>>` (§24 del brief). | **NO** |
| `ACTOR-FEEDBACK-07` | `REQ-EVT-013`, `REQ-EVT-024` | `CLARIFICATION_NO_SEMANTIC_CHANGE` | **Resuelto** por `ACTOR-DECISION-02`, opción (a), ya congelada por E2. La participación de `ACT-ADMIN` es **valla técnica**, no autoridad deportiva. | **0**. `UC-EVT-12` y `UC-EVT-15` no tienen a `ACT-ADMIN` como actor primario. Se lo registra como participante técnico de la valla, nunca como iniciador. | **NO** |
| `ACTOR-FEEDBACK-08` | `REQ-PPL-010` | `TYPO_OR_METRIC` (alcance del sujeto) | **Resuelto.** El sujeto delegado es siempre un menor: PT §20 (`associated minor`), `REQ-PPL-008` PRECONDITION, E2 §5.1. | **0**. `UC-PPL-14 · Consultar quién actúa por mi cuenta` tiene sujeto = menor, autoridad = cuenta propia + relación activa. | **NO** |
| `ACTOR-FEEDBACK-09` | Contadores de E1 | `TYPO_OR_METRIC` | **Resuelto con errata.** `SYS = 29` es incorrecto: el dominio contiene **27** IDs (`REQ-SYS-001 … REQ-SYS-027`). El total **157** y los tipos **122** `FUNCTIONAL` / **35** no funcionales son correctos. La suma real por dominio es `20+16+13+24+19+18+8+12+27 = 157`. | **0**. E3 trabaja con **157** REQ IN, **122** funcionales. §3 de este documento registra la errata. | **NO** — ver §4 |

## 2.2 Feedbacks nuevos detectados por E3

E3 verificó mecánicamente los conteos y los identificadores del catálogo de E1 y encontró tres
defectos adicionales. **Ninguno cambia semántica.**

| ID | Ubicación | Defecto | Clasificación | Resolución E3 | Impacto en el inventario |
|---|---|---|---|---|---|
| `UC-FEEDBACK-01` | `GEI_REQUIREMENTS_FREEZE_V1.md` §3.1 y §11; `GEI_REQUIREMENTS_CATALOG_V1.md` §1.2 | El contador de `INS` declara **10**, pero el dominio contiene **12** IDs (`REQ-INS-001 … REQ-INS-012`) y §4.8 del Freeze enumera los 12. La fila de §3.1Even lista once títulos y omite `Historia: fuentes visibles`. La desviación neta es `INS +2`, `SYS −2`, y el total 157 sigue cuadrando. | `TYPO_OR_METRIC` | **Errata**: `INS = 12`. Verificado por conteo mecánico de IDs y por las 12 filas de `GEI_ACTOR_REQUIREMENT_MATRIX_V1.md` §9. | **0**. E3 cubre `REQ-INS-001 … 012`. |
| `UC-FEEDBACK-02` | `GEI_REQUIREMENTS_FREEZE_V1.md` §4.6, fila de `REQ-COM-017` | El identificador aparece como `` `REQ-COM-017**` ``: dos asteriscos de markdown dentro del código. | `TYPO_OR_METRIC` | **Errata**: el ID es `REQ-COM-017`. La fila, su tipo `FUNCTIONAL` y su `STATEMENT` ("lista negativa cerrada") no cambian. | **0**. |
| `UC-FEEDBACK-03` | `GEI_REQUIREMENTS_CATALOG_V1.md`, entrada `REQ-STR-007` | Título del catálogo ("Identidad de temporada por identificador") desalineado con su `STATEMENT` (zona horaria). Registrado ya por E2 §17.1. | `TYPO_OR_METRIC` | **Errata**: el `STATEMENT` es el texto autoritativo; el título efectivo es "Zona horaria", como ya dicen §3.1 y §4.3 del Freeze. | **0**. `REQ-STR-007` es `SYSTEM_INTERNAL` en ambas lecturas. |

**Defecto tipográfico adicional en Freeze §4.6, sin impacto:** la fila `REQ-COM-017` está
renderizada con negrita mal cerrada. No afecta ningún ID, actor ni conteo. No se abre feedback
propio por ello.

---

# 3. ERRATA CONSOLIDADA DE E1 (documental, no versionada)

Esta tabla es la **errata autorizada** sobre `GEI_REQUIREMENTS_FREEZE_V1.md` y
`GEI_REQUIREMENTS_CATALOG_V1.md`. No sustituye los documentos; los corrige en lo puramente
estadístico y de identificador.

| ID Freeze | Campo | Valor declarado | Valor correcto | Comprobación |
|---|---|---|---|---|
| `GEI_REQUIREMENTS_FREEZE_V1.md` §3.1, §11 · catálogo §1.2 | `SYS` | 29 | **27** | IDs `REQ-SYS-001 … REQ-SYS-027` |
| `GEI_REQUIREMENTS_FREEZE_V1.md` §3.1, §11 | `INS` | 10 | **12** | IDs `REQ-INS-001 … REQ-INS-012`; 12 filas en §4.8 y en la matriz de E2 §9 |
| `GEI_REQUIREMENTS_FREEZE_V1.md` §4.6 | ID de la fila "No notificar" | `` `REQ-COM-017**` `` | **`REQ-COM-017`** | Secuencia COM-001 … COM-018 sin huecos |
| catálogo, entrada `REQ-STR-007` | Título | "Identidad de temporada por identificador" | **"Zona horaria"** (texto del `STATEMENT`) | Coincide con Freeze §3.1 y §4.3 |

**Valores que NO se corrigen porque ya son correctos:** total `IN = 157`; funcionales `= 122`;
no funcionales `= 35`; `DEFER = 14`; `OUT = 26`; decisiones abiertas `= 2`.

---

# 4. DECISIÓN SOBRE CREAR VERSIONES NUEVAS DE E1 / E2

| Opción | Evaluación | Veredicto |
|---|---|---|
| Crear `GEI_REQUIREMENTS_FREEZE_V1_0_1.md` | Requeriría un cambio **real** de la autoridad de E1. Los 12 feedbacks clasificados son `TYPO_OR_METRIC` o `CLARIFICATION_NO_SEMANTIC_CHANGE`; ninguno altera un alcance, un actor, un criterio de aceptación ni un resultado. El §9 del brief prohíbe generar versiones por cambios puramente estadísticos cuando una errata documentada basta. | **NO** |
| Crear `GEI_ACTOR_MODEL_FREEZE_V1_0_1.md` | Ningún feedback altera la identidad, la autoridad, el scope ni los límites de ningún actor. E2 §7.6 ya declara **cero** ambigüedad en `CAPTAIN` y E2 §13 cierra `GUARDIAN` y multi-rol. | **NO** |
| Errata en este documento | Cubre los 4 defectos objetivos y verificables. E1 y E2 quedan **intactos**. | **ADOPTADA** |

**Jerarquía de autoridad para E3 (sin cambios respecto de E1/E2):**

```
GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md        (PT — mando si hay contradicción)
  └─ GEI_REQUIREMENTS_FREEZE_V1.md   + ERRATA §3  (autoridad de requerimientos)
  └─ GEI_ACTOR_MODEL_FREEZE_V1.md                (autoridad de actores)
       └─ catálogos y matrices de E1/E2           (trazabilidad y detalle)
            └─ GEI_USE_CASE_INVENTORY_FREEZE_V1.md (salida de E3)
```

---

# 5. RESOLUCIÓN DE CADA DECISIÓN ABIERTA

## 5.1 `REQ-DECISION-NEEDED-01` — Restauración de estructura archivada

**Estado para E3: RESUELTA por autoridad vigente. NO bloqueante.**

La pregunta es si `Division`, `Line`, `Team` y `Venue` archivados pueden deshacerse. La evidencia
autoritativa ya contiene la respuesta **para el alcance de V1**, y no requiere decisión nueva:

| Fuente | Contenido | Efecto |
|---|---|---|
| `GEI_REQUIREMENTS_FREEZE_V1.md` §3.1, `STR` | `REQ-STR-002` y `REQ-STR-003` enumeran **Crear, actualizar, archivar**. No enumeran `Restore`. | El restore **no es un objetivo funcional de V1**. |
| `GEI_REQUIREMENTS_FREEZE_V1.md` §3.2 | `DEF-STR-001` (restaurar división archivada) y `DEF-STR-002` (restaurar línea archivada) están **DEFER**, con condición de revisión `REQ-DECISION-NEEDED-01`. | El restore de estructura está **fuera de V1 por decisión de E1**, no por falta de análisis. |
| `GEI_REQUIREMENTS_FREEZE_V1.md` §3.2, `DEF-STR-001/002` y §10 | La "restauración de división y línea archivadas" aparece en la columna "Pospuesto con revisión prevista". | Idem. |
| `GEI_REQUIREMENTS_FREEZE_V1.md` §4.3, `REQ-STR-004` | `DRAFT → ACTIVE → ARCHIVED`. Sin transición inversa. | `Team` archivado es terminal en V1. |
| `GEI_REQUIREMENTS_FREEZE_V1.md` §4.3, `REQ-STR-005` | Sede "archivable"; identidad estable por identificador. Sin `Restore`. | `Venue` archivada es terminal en V1. |
| PT §9, §19 | `Team: DRAFT -> ACTIVE -> ARCHIVED`; `Division/Line/Venue: Create; Update; Archive`. PT §75 exige que toda transición tenga comando. | El restore **no está autorizado** por PT. |
| `src/features/management.tsx:1402,1507` | El CURRENT ofrece "Restaurar" en estructura archivada. | `IMPLEMENTATION_WITHOUT_REQUIREMENT`. No se convierte en CU. |

**Resolución E3.** No existe caso de uso de restauración de estructura sportive archivada. Se
registra como **exclusión explícita** (§9 del Freeze de inventario). Si el club adopta la opción
(a) de E1, el cambio requiere versionar `GEI_REQUIREMENTS_FREEZE` y **añadir** los CU
correspondientes; no se corrige este documento en el sitio.

**Distinción obligatoria que sí produce un CU:** PT §9 Event autoriza
`CANCELLED -> SCHEDULED` *mediante Restore*, y `REQ-EVT-007` lo refleja. Eso **sí** es un objetivo
funcional de V1 y produce `UC-EVT-08 · Restaurar un evento cancelado`. El restore de **evento**
está autorizado; el restore de **estructura** está DEFER. La asimetría es deliberada y no es una
contradicción: son objetos distintos con contratos distintos.

**¿Bloquea E3?** **NO.** La autoridad congelada ya da un valor determinado y no ambiguo.

## 5.2 `REQ-DECISION-NEEDED-02` — Nivel de conformidad de accesibilidad

**Estado para E3: PERMANECE ABIERTA. NO bloqueante.**

Verificado explícitamente contra los cuatro criterios de bloqueo del §8 del brief:

| Criterio de bloqueo | ¿Cambia por `REQ-DECISION-NEEDED-02`? | Evidencia |
|---|---|---|
| ¿Cambia la **existencia** de un CU? | **NO** | La decisión altera **criterios de aceptación** de los REQ `REQ-SYS-002/003/004/005`, todos no funcionales y transversales. Ninguno es `FUNCTIONAL`. |
| ¿Cambia el **actor primario**? | **NO** | No toca `PRELIMINARY ACTOR` de ningún REQ funcional. |
| ¿Cambia la **authority** necesaria? | **NO** | `REQ-SYS-002…005` no aparecen como `authority source` de ningún CU. |
| ¿Cambia el **resultado funcional**? | **NO** | `REQ-SYS-009` ("Sin éxito falso") es el REQ de resultado, y es independiente de la declaración de nivel de conformidad. |

**Efecto real:** la opción (b) recomendada por E1 cambia la redacción de criterios de aceptación de
los casos de uso que producen superficie. Eso es **Etapa 9** (contratos de pantalla), no Etapa 3.
Se mantiene en `docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md` y **no** se mueve a los
decisiones de E3.

## 5.3 `ACTOR-DECISION-01` — ¿`ACT-PLAYER` / `ACT-CAPTAIN` ven su propio estado de habilitación?

**Estado para E3: RESUELTA por valor congelado de E2. NO bloqueante. Change candidate registrado.**

E2 §18 y `GEI_ACTOR_OPEN_DECISIONS_V1.md` congelan explícitamente la opción **(a) `NONE`** para E3,
y registran (b) como *change candidate*. El valor congelado es el que rige.

| Elemento | Con (a) — valor congelado, rige en E3 |
|---|---|
| `UC-PRT-13 · Consultar el estado de habilitación de una jugadora` | Actores primarios: `ACT-COACH` (con alcance), `ACT-SUBCOMMITTEE`, `ACT-ADMIN`. `ACT-PLAYER` y `ACT-CAPTAIN` **excluidos** de la fila `ELIGIBILITY STATUS`. |
| `ACTOR-UI-09` (`src/mock/authority.ts:218-225`, que hoy concede el propio estado) | `CURRENT CONTRADICTORY`. **No se corrigió `src/**`.** |
| CU nuevos | **0** |

**Si el club adopta (b):** se añade **exactamente 1** CU —"Consultar mi estado de habilitación",
con `REQ-PPL-011` ampliado en la fila `ELIGIBILITY STATUS` (sólo el propio estado, nunca motivo ni
origen). Requiere decisión de producto escrita y versionado de E1 y E2. E3 no lo anticipa ni lo
incorpora.

## 5.4 `ACTOR-DECISION-02` — ¿`ACT-ADMIN` puede cerrar una jornada?

**Estado para E3: RESUELTA por valor congelado de E2. NO bloqueante.**

E2 congela la opción **(a)**: `ACT-ADMIN` participa en la valla técnica de `REQ-EVT-024` y
`REQ-EVT-013` pero **no** inicia el cierre. Consecuencias en E3:

| Elemento | Efecto |
|---|---|
| `UC-EVT-15 · Programar una jornada` | Actores primarios: `ACT-COACH` (alcance `TEAM`) y `ACT-SUBCOMMITTEE` (alcance `CLUB`). `ACT-ADMIN` **no** figura como actor primario. |
| `REQ-EVT-024` | Se clasifica `BUSINESS_RULE` de `UC-EVT-15`. La participación de `ACT-ADMIN` se documenta como **valla técnica**, conforme a `ACTOR-FEEDBACK-07`. |
| `REQ-EVT-013` | Idem para `UC-EVT-12 · Resolver un conflicto de edición concurrente`. |
| PT §5 | **Sin cambios.** La opción (b) habría roto la cadena de autoridad de E1. |

---

# 6. IMPACTO EN EL INVENTARIO DE E3

| Pregunta | Respuesta |
|---|---|
| ¿Algún feedback cambia la **existencia** de un CU? | **NO** |
| ¿Algún feedback cambia un **actor primario**? | **NO** |
| ¿Algún feedback cambia la **authority** necesaria? | **NO** |
| ¿Algún feedback cambia un **resultado funcional**? | **NO** |
| ¿Algún feedback es `SEMANTIC_CHANGE`? | **NO** — 0 de 12 |
| ¿Algún feedback es `NEW_PRODUCT_DECISION`? | **NO** — 0 de 12 |
| ¿Hace falta `GEI_REQUIREMENTS_FREEZE_V1_0_1.md`? | **NO** |
| ¿Hace falta `GEI_ACTOR_MODEL_FREEZE_V1_0_1.md`? | **NO** |
| Decisiones bloqueantes para E3 | **0** |

## 6.1 Entradas declaradas de E3

```
E3_REQUIREMENTS_AUTHORITY = docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md   (V1, 2026-10-04)
                             + ERRATA de este documento (§3)
E3_ACTOR_AUTHORITY        = docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md         (V1, 2026-10-05)

Insumos de trazabilidad y detalle (NO son autoridad):
  docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md
  docs/requirements/GEI_REQUIREMENTS_RECONSTRUCTION_AUDIT_V1.md
  docs/requirements/GEI_REQUIREMENTS_OPEN_DECISIONS_V1.md
  docs/actors/GEI_ACTOR_CATALOG_V1.md
  docs/actors/GEI_ACTOR_REQUIREMENT_MATRIX_V1.md
  docs/actors/GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1.md
  docs/actors/GEI_ACTOR_RECONSTRUCTION_AUDIT_V1.md
  docs/actors/GEI_ACTOR_OPEN_DECISIONS_V1.md

Interpretación semántica (sólo cuando sea necesario):
  docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md

Evidencia secundaria (NUNCA Product Truth):
  src/**
```

**Conteos de entrada que E3 adopta, verificados mecánicamente:**

| Métrica | Valor | Comprobación |
|---|---:|---|
| REQ IN totales | **157** | `20+16+13+24+19+18+8+12+27` |
| Funcionales IN | **122** | 13+16+13+24+19+18+8+10+1 |
| No funcionales IN | **35** | 7+0+0+0+0+0+0+2+26 |
| Funcionales `MAPPED` (E2) | **104** | Actor primario identificado |
| Funcionales `SYSTEM_INTERNAL` (E2) | **18** | Sin initiator humano |
| `DEFER` | 14 | Fuera de V1 |
| `OUT` | 26 | Fuera de V1 |

---

# 7. ARTEFACTOS AFECTADOS

| Artefacto | Acción en E3 | Motivo |
|---|---|---|
| `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` | **NO EDITADO** | Errata suficiente (§9 del brief) |
| `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` | **NO EDITADO** | Ídem |
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` | **NO EDITADO** | Sin cambio semántico |
| `docs/actors/**` (resto) | **NO EDITADO** | Ídem |
| `src/**` | **NO EDITADO** | §59 del brief |
| `docs/use-cases/**` | **CREADO** | Único directorio autorizado |
| `docs/GEI_Roadmap_Maestro_Proyecto.xlsx` | **CREADO/ACTUALIZADO** | §57 del brief — ver desviación D-1 |
| `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` | **NO CREADO** | Ver desviación D-1 |

## 7.1 Desviación D-1 — Ubicación real del workbook

`docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` **no existe**. E1 §12.3 y E2 §16.4 lo
declararon `WORKBOOK_UPDATE_BLOCKED`. El único workbook presente en el repositorio es
`docs/GEI_Roadmap_Maestro_Proyecto.xlsx`, **sin seguimiento en git** al momento de abrir E3.

E3 **no crea** `docs/project-control/` ni un sustituto, y **no mueve** el archivo existente (eso
borraría un estado preexistente del usuario). Actualiza el archivo real en su ruta real y declara la
desviación. La estructura de control de proyecto del brief queda pendiente de decisión del usuario.

---

# 8. LIMITACIONES DECLARADAS

1. **`WORKBOOK_UPDATE_BLOCKED` parcialmente resuelto.** El archivo existe pero en otra ruta y sin
   versionar. Ver D-1.
2. **0 decisiones resueltas por inferencia.** Las 4 decisiones se resuelven porque una autoridad
   congelada ya contiene un valor determinado, no porque E3 haya deducido uno.
3. **2 *change candidates* vivos** (`ACTOR-DECISION-01`, `ACTOR-DECISION-02`) y **2 decisiones de
   producto abiertas** (`REQ-DECISION-NEEDED-01`, `REQ-DECISION-NEEDED-02`). Las 4 son no
   bloqueantes y las 4 están anotadas con su impacto exacto sobre el inventario si se adoptan.
4. **La errata §3 no se propagó a los documentos de origen.** Es intencional: E1 y E2 son
   históricos y no se editan en lugar de versionar.
5. **Este documento no nombra ningún `UC-*` como canónico.** Los identificadores `UC-*` que aparecen
   en §5.1, §5.3 y §5.4 son **referencias de trabajo** que se confirman en
   `GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md`.

---

# 9. CIERRE

```
PRE-E3 INPUT CLOSURE                              PASS
  decisiones revisadas                            4  (2 de E1 + 2 de E2)
  decisiones resueltas para E3                    4
  decisiones que cambian el inventario               0
  feedbacks clasificados                           12  (9 de E2 + 3 de E3)
  feedbacks SEMANTIC_CHANGE                       0
  feedbacks NEW_PRODUCT_DECISION                  0
  versiones nuevas de E1/E2                       0
  decisiones bloqueantes                           0

E3_REQUIREMENTS_AUTHORITY   GEI_REQUIREMENTS_FREEZE_V1.md  (V1 + errata §3)
E3_ACTOR_AUTHORITY          GEI_ACTOR_MODEL_FREEZE_V1.md    (V1)

E3 PUEDE COMENZAR.
```

---

**Fin del Pre-E3 Input Closure V1.**

**SOURCE MODIFIED: NO**, salvo los artefactos nuevos autorizados bajo `docs/use-cases/**` y la
actualización del workbook de control. `docs/requirements/**`, `docs/actors/**` y `src/**` no se
tocaron.
