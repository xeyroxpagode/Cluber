# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE SPECIFICATION STANDARD V1

**Etapa:** 5 — Especificaciones de TODOS los casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-07
**Rama:** `gei/e5-use-case-specifications-freeze-v1`
**Baseline E4:** `d4baa1cb109dec3fafb915006585bf80318ae868` (`gei/e4-use-case-diagrams-freeze-v1`)

Este documento define la **plantilla obligatoria** de las 102 especificaciones de casos de uso de
GEI. Es autoridad de **forma**: el contenido funcional de cada ficha proviene de las autoridades
listadas en §1.

---

# 1. AUTORIDADES DE CONTENIDO

| Documento | Rol |
|---|---|
| `docs/requirements/GEI_REQUIREMENTS_FREEZE_V1.md` + errata `GEI_PRE_E3_INPUT_CLOSURE_V1.md` §3 | **Autoridad de requerimientos** (statement, AC, prioridad) |
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` | **Autoridad de actores** (actor, authority source, scope, PII) |
| `docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` | **Autoridad del inventario** (qué 102 CU existen) |
| `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` | Ficha E3 de cada CU (goal, trigger, outcome, precondiciones) |
| `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` | Trazabilidad REQ ↔ Actor ↔ UC |
| `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` | **Autoridad UML final** (relaciones congeladas) |
| `docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md` | Decisión final de las 8 candidatas |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | Autoridad de producto y dominio |
| `src/**` | Evidencia secundaria. **NO es autoridad funcional** |

## 1.1 Fuente académica

El modelo académico es el de la consigna del profesor: **datos mínimos** (nombre, descripción,
actores, camino básico, camino alternativo) y **plantilla completa** (nombre, fecha de creación,
fechas de actualización, versión, autores, descripción, actores, precondiciones, postcondiciones,
puntos de extensión, prioridad, camino básico, camino alternativo), con numeración ligada al paso
del camino básico (`1.` `2.` `3.` … y alternativas `3.1`, `3.2`, subflujo `7.1.1`).

> **SPEC-FEEDBACK-01 (finding global, PENDIENTE_DATOS_ACADÉMICOS).** El material de curso del
> profesor no está en el repositorio (hereda el hallazgo **D-8** de E4). La plantilla de este
> Standard reproduce la transcripción de la consigna académica incorporada al brief de E5.
> El campo **Autores** se completa con `PENDIENTE_DATOS_ACADÉMICOS` en las 102 fichas porque ningún
> documento del proyecto registra autores nominales; no se inventan nombres. Un único hallazgo
> global, no 102.

---

# 2. PLANILLA OBLIGATORIA

Cada caso de uso se especifica con **exactamente** esta estructura visible, en este orden. El orden
**no** se modifica. Ningún campo se suprime.

```
## CASO DE USO: <UC-ID> · <Nombre canónico E3>

Fecha de creación: <fecha ISO de creación de la spec E5>
Fechas de actualización: —
Versión: V1
Autores: PENDIENTE_DATOS_ACADÉMICOS
Descripción: <1–3 frases: qué funcionalidad representa y qué objetivo permite cumplir>
Actores:
- Actor principal: <actor canónico E2>
- Actores secundarios: <actores E2 con otra autoridad sobre el mismo hecho>
Precondiciones:
- <condiciones funcionales que deben cumplerse ANTES de iniciar>
Postcondiciones:
- Éxito: <estado final observable>
- Rechazo: <qué NO cambia>, cuando el CU muta
Puntos de Extensión:
- <punto + condición + CU que extiende>  ·  o  ·  No posee.
Prioridad: P0 / P1 / P2

Camino básico:
1. <acción del actor o respuesta funcional de GEI>
2. …
3. …

Camino alternativo:
<N.1. alternativa ligada al paso básico N>
<N.2. …>
<subflujo N.M.K cuando hace falta>

TRAZABILIDAD INTERNA GEI
- Requirements: <REQ que sustentan el CU, con (P)/(S)>
- Authority source: <fuente de autoridad del Actor Freeze>
- Scope: <SELF · CHILD · TEAM · TEAM_SET · CLUB · EVENT>
- Business rules: <reglas que condicionan el CU>
- Estado / objeto afectado: <transiciones de estado que registra la spec>
- Includes: <CU incluidos con <<include>> según E4>  ·  o  ·  Ninguno.
- Extends: <CU que extienden este CU según E4>  ·  o  ·  Ninguno.
- Notas de trazabilidad: <aclaraciones de fuente, no contenido nuevo>
```

## 2.1 Reglas por campo

| Campo | Regla |
|---|---|
| **UC-ID · Nombre** | ID y nombre **exactos** de E3. No se crean, eliminan, renombran ni renumeran CU |
| **Fecha de creación** | Fecha real de creación de la spec E5 (`2026-10-07`) |
| **Fechas de actualización** | `—` hasta que una spec reciba revisión posterior; si se corrige durante E5, la fecha real de la corrección |
| **Versión** | `V1` |
| **Autores** | `PENDIENTE_DATOS_ACADÉMICOS` (SPEC-FEEDBACK-01) |
| **Descripción** | 1–3 frases sobre qué funcionalidad representa y qué objetivo permite cumplir. No repite el camino básico. No describe UI |
| **Actores** | Actores canónicos E2. Se distingue principal de secundarios conservando el heading `Actores:`. Prohibido `Sistema`, `Base de datos`, `API`, `Frontend` como actores |
| **Precondiciones** | Sólo condiciones funcionales previas (Account ACTIVE, sesión válida, RoleAssignment vigente, objeto en estado requerido, Team dentro del scope, GuardianRelationship vigente). Sin pasos. Sin "el servidor funciona" |
| **Postcondiciones** | Estado final observable. `- Éxito:` y, cuando el CU muta y el rechazo es material, `- Rechazo:` con qué **no** cambia. Ambos bajo el mismo heading |
| **Puntos de Extensión** | Según el modelo UML final E4 V1.0.1. `No posee.` cuando el CU no es base de ningún `<<extend>>`. No se inventan puntos de extensión para alternativas normales |
| **Prioridad** | Derivada de los REQ PRIMARY del CU (regla §4). Nunca arbitraria |
| **Camino básico** | Camino feliz **principal**: termina exitosamente. Sin errores, rechazos, variantes ni conflictos. Numeración `1.` `2.` `3.` sin huecos, sin `Step A` ni `BF-01` |
| **Camino alternativo** | Todo lo que diverge del happy path. Numeración `X.Y` apuntando a un paso básico `X` válido; subflujo `X.Y.Z` con padre `X.Y`. Máximo 3 niveles de anidamiento |
| **TRAZABILIDAD INTERNA GEI** | Bloque separado **después** de la ficha académica. Nunca intercalado entre `Camino básico` y `Camino alternativo` |

## 2.2 Estilo de pasos

- Cada paso es una **acción del actor** o una **respuesta/acción funcional de GEI**.
- Se nombran actores reales: «El entrenador solicita…», «GEI valida…», «El guardián informa…».
  `El usuario` sólo cuando el actor concreto es `ACT-AUTHENTICATED` en general.
- **Nivel funcional, no UI.** Prohibido: «toca el botón +», «se abre el modal», «se muestra la
  pantalla», «toca Guardar». El diseño de pantallas es E9.
- Los pasos de GEI pueden nombrar el efecto funcional: «GEI registra…», «GEI notifica a las
  personas alcanzadas…».

## 2.3 Errores y códigos

- Los errores y rechazos viven **dentro** de `Camino alternativo`. No existe un heading
  `Error Flows` en la ficha.
- Si Product Truth §38 define un código estable para el rechazo, se menciona entre paréntesis,
  p. ej. «GEI rechaza la operación (`LAST_ADMIN_REQUIRED`)». El código **no** sustituye al lenguaje
  funcional ni se inventan códigos nuevos.

## 2.4 `<<include>>` y `<<extend>>` dentro de los caminos

- **Include obligatorio** (E4 V1.0.1: `UC-EVT-05`, `UC-EVT-07`, `UC-EVT-08` → `UC-EVT-11`): el
  camino básico escribe el paso, p. ej. `4. GEI ejecuta UC-EVT-11 · Revisar el impacto de un cambio material <<include>>.`
  y **no** copia el camino del CU incluido.
- **Extend** (E4 V1.0.1: `UC-EVT-11` → `UC-EVT-04` `[MATERIAL_CHANGE]`; `UC-EVT-12` → `UC-EVT-04`
  `[STALE_VERSION]`; `UC-EVT-11` → `UC-EVT-16` `[MATERIAL_CHANGE]`): se representa como
  **camino alternativo** del CU base, en el paso donde diverga, p. ej.
  `5.1. Si el cambio es material ([MATERIAL_CHANGE]), se activa UC-EVT-11 · Revisar el impacto de un cambio material <<extend>>.`
  El comportamiento extendido **no** entra en el camino feliz del base.
- **Reautenticación** (INC-01 final E4): regla transversal condicional, **0 aristas UML**. En cada
  CU de gestión sensible, el paso de autorización lleva la alternativa
  `N.1. Si se cumple REAUTHENTICATION_REQUIRED, GEI deriva a UC-IAM-09 · Reautenticar para una gestión sensible (regla transversal INC-01) antes de continuar.`
  El camino de `UC-IAM-09` no se repite.
- **SIBLING** (EXT-02…EXT-06): sin arista ni derivación interna. Los CU hermanos se referencian
  sólo en el bloque de trazabilidad. No se inventan relaciones entre hermanos.

## 2.5 Reglas de contenido

- La ficha es **autosuficiente funcionalmente**: prohibido `Ver Product Truth`,
  `Ver UC Catalog` o `N/A.` como contenido de un campo académico. Las referencias del bloque de
  trazabilidad **complementan**, no reemplazan.
- Vocabulario canónico E3 preservado: `Eliminar ≠ Archivar`, `Cerrar ≠ Finalizar`,
  `Membership ≠ TeamAssignment`, `RoleAssignment ≠ TeamAssignment`,
  `Availability ≠ Selection ≠ Attendance`, `Team ≠ Line ≠ Division`.
- Mutaciones: el camino básico dice **qué cambia**; la alternativa de rechazo dice **qué no cambia**.
- Atomicidad: sólo cuando REQ/PT la exige (p. ej. `UC-EVT-15`, `REQ-SYS-018`).
- Estado: la spec registra las transiciones necesarias (p. ej. `SCHEDULED → POSTPONED`) sin diseñar
  la máquina completa (E6).
- PII: sin matrices PII en la ficha. Los límites de field authority van en `TRAZABILIDAD INTERNA GEI`
  (default deny).

---

# 3. NUMERACIÓN — REGLAS VERIFICABLES

| Regla | Definición |
|---|---|
| Básico | `1.` `2.` … `N.` consecutivos, sin saltos, sin duplicados |
| Alternativa | `X.Y` donde `X` ∈ `1..N` del camino básico del mismo CU |
| Subflujo | `X.Y.Z` sólo si existe `X.Y` en el mismo CU |
| Anidamiento | Máximo 3 niveles (`X.Y.Z`); si se necesita más, revisar si existe otro CU real |
| Referencia textual | Toda referencia `UC-<DOM>-<NN>` dentro de la spec debe existir en el inventario E3 |

---

# 4. PRIORIDAD — REGLA DE DERIVACIÓN

La prioridad del CU se deriva de los requerimientos que lo justifican (catálogo E1, campo
`PRIORITY`), nunca se asigna arbitrariamente:

1. Se toman los REQ **PRIMARY** del CU según la matriz E3 §12 (columna `(P)`).
2. La prioridad del CU es la **más crítica** entre sus REQ PRIMARY (`P0 < P1 < P2 < P3` en
   criticidad): un CU justificado por un REQ P0 es esencial para el producto.
3. Caso especial documentado: `UC-STR-10` tiene como PRIMARY a `REQ-STR-008` (la matriz E3 anotó el
   bloque `STR` con notación de rango `(S)`; la ficha del catálogo marca `REQ-STR-008` **(P)** sólo
   para `UC-STR-10`). Se usa la ficha granular del catálogo.
4. Los REQ SUPPORTING, BUSINESS_RULE, SYSTEM_INTERNAL y CROSS_CUTTING no elevan ni bajan la
   prioridad del CU.

Distribución resultante: **P0 55 · P1 40 · P2 7 · P3 0** = 102. La regla completa y su evidencia
quedan en `GEI_USE_CASE_SPECIFICATION_RECONSTRUCTION_AUDIT_V1.md`.

---

# 5. ARCHIVOS DE ENTREGA

| Archivo | CU | Dominio |
|---|---:|---|
| `GEI_UC_SPEC_IAM_V1.md` | 10 | `UC-IAM-01` … `UC-IAM-10` |
| `GEI_UC_SPEC_PPL_V1.md` | 17 | `UC-PPL-01` … `UC-PPL-17` |
| `GEI_UC_SPEC_STR_V1.md` | 15 | `UC-STR-01` … `UC-STR-15` |
| `GEI_UC_SPEC_EVT_V1.md` | 19 | `UC-EVT-01` … `UC-EVT-19` |
| `GEI_UC_SPEC_PRT_V1.md` | 13 | `UC-PRT-01` … `UC-PRT-13` |
| `GEI_UC_SPEC_COM_V1.md` | 14 | `UC-COM-01` … `UC-COM-14` |
| `GEI_UC_SPEC_CMP_V1.md` | 9 | `UC-CMP-01` … `UC-CMP-09` |
| `GEI_UC_SPEC_INS_V1.md` | 5 | `UC-INS-01` … `UC-INS-05` |
| **TOTAL** | **102** | |

Orden interno de cada archivo: numérico por `UC-ID`. El orden de generación (IAM, PPL, STR, EVT,
PRT, COM, CMP, INS) es **sólo de control**, no de navegación.

---

# 6. PILOTOS

Antes de generar las 102, se auditaron **3 pilotos** contra el modelo del profesor:

| Piloto | Cubre |
|---|---|
| `UC-IAM-01` · Iniciar sesión | CU simple, actor `ACT-UNAUTHENTICATED` |
| `UC-EVT-04` · Editar un evento | CU complejo con `<<extend>>` `[MATERIAL_CHANGE]` y `[STALE_VERSION]`, series, ramas material/no material |
| `UC-PRT-01` · Responder mi disponibilidad | CU multi-actor con delegación Guardian (mismo CU, distinto subject) |

Los tres se incluyen como fichas definitivas en `GEI_UC_SPEC_IAM_V1.md`, `GEI_UC_SPEC_EVT_V1.md` y
`GEI_UC_SPEC_PRT_V1.md`. La auditoría de los pilotos está en
`GEI_USE_CASE_SPECIFICATION_RECONSTRUCTION_AUDIT_V1.md` §4.

---

# 7. VALIDACIÓN MECÁNICA

`scripts/validate-use-case-specs.mjs` valida sobre los archivos de especificación:

| Check | Esperado |
|---|---:|
| `SPEC_COUNT` | 102 |
| `DUPLICATE_UC_ID` | 0 |
| `MISSING_SPEC` / `UNKNOWN_SPEC` | 0 / 0 |
| `ACADEMIC_HEADING_MISSING` (los 12 headings por ficha) | 0 |
| `MISSING_DESCRIPTION` / `MISSING_ACTORS` / `MISSING_PRECONDITIONS` / `MISSING_POSTCONDITIONS` / `MISSING_PRIORITY` | 0 |
| `MISSING_BASIC_FLOW` / `MISSING_ALTERNATIVE_SECTION` | 0 |
| `BASIC_FLOW_NOT_SEQUENTIAL` | 0 |
| `ALTERNATIVE_DANGLING` (X no existe en el básico) | 0 |
| `SUBFLOW_WITHOUT_PARENT` | 0 |
| `MISSING_REQ_TRACE` / `UNKNOWN_REQ` / `UNKNOWN_ACTOR` | 0 / 0 / 0 |
| `UNACCOUNTED_AC` | 0 |
| `E3_NAME_DRIFT` (nombre distinto del inventario) | 0 |
| `E4_RELATION_DRIFT` (include/extend distinto del modelo final) | 0 |
| `UI_LANGUAGE` (botón/modal/pantalla en pasos) | 0 |

El resultado del validador es evidencia del gate; el QA académico por muestra y la QA de legibilidad
están en el Audit.

---

**Fin del Use Case Specification Standard V1.**

**SOURCE MODIFIED: NO.** Este Standard no modifica ninguna autoridad de E1–E4.
