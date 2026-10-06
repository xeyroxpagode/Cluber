# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE RELATION DECISIONS V1 — REVISIÓN E4-0.1

**Etapa:** 4 — Diagramas de casos de uso
**Estado:** FROZEN · **Versión:** V1 (revisada in-place por E4-0.1) · **Fecha:** 2026-10-05
**Rama:** `gei/e4-use-case-diagrams-freeze-v1`
**Baseline de E3:** `730bf8ffee428666d24a588e23f23b457dc35123`

> Esta revisión **no oculta** las diferencias respecto de la primera pasada de E4. Cada candidata
> registra `PREVIOUS E4 DECISION` → `AUDIT FINDING` → `FINAL E4 DECISION`. El freeze que manda usa
> **sólo** la columna FINAL.

| Autoridad de entrada | Archivo · Versión |
|---|---|
| Candidatas y rechazos | `docs/use-cases/GEI_USE_CASE_RELATION_CANDIDATES_V1.md` — **V1** |
| Casos de uso | `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` — **V1** |
| Requerimientos | `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` — **V1** |
| Vocabulario de error | `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` §38 — **V1.0.1** |
| Actores | `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` — **V1** |

---

# 1. RESUMEN DE LA DECISIÓN

| ID | PREVIOUS E4 | FINAL E4-0.1 | Decisión | Aristas PREVIOUS | Aristas FINAL |
|---|---|---|---|---:|---:|
| `INC-01` | `<<include>>` | **`<<extend>>` + regla transversal** | `RECLASSIFIED_AND_NOT_DRAWN` | 39 | **0** |
| `INC-02` | `include` ×5 | **`include` ×3 + `extend` ×2** | `SPLIT_BY_MATERIALITY` | 5 | **5** |
| `EXT-01` | `<<extend>>` | **`<<extend>>`** | `ACCEPT_EXTEND` | 1 | **1** |
| `EXT-02` | `<<extend>>` | **`SIBLING`** | `REJECT_EXTEND` | 2 | **0** |
| `EXT-03` | `<<extend>>` | **`SIBLING`** | `REJECT_EXTEND` | 1 | **0** |
| `EXT-04` | `<<extend>>` | **`SIBLING`** | `REJECT_EXTEND` | 2 | **0** |
| `EXT-05` | `SIBLING` | **`SIBLING`** | `REJECT_EXTEND` | 0 | **0** |
| `EXT-06` | `SIBLING` | **`SIBLING`** | `REJECT_EXTEND` | 0 | **0** |
| | | | **TOTAL** | **50** | **6** |

| Métrica | PREVIOUS | FINAL |
|---|---:|---:|
| Candidatas evaluadas | 8 / 8 | **8 / 8** |
| `UNDECIDED` | 0 | **0** |
| `DEFER_TO_E5` | 0 | **0** |
| Candidatas cuyo tipo cambió | — | **4** (`INC-01`, `INC-02`, `EXT-02`, `EXT-03`, `EXT-04`) |
| Relaciones nuevas no autorizadas | 0 | **0** |
| Rechazadas por E3 dibujadas | 0 | **0** |

---

# 2. SEMÁNTICA UML APLICADA

| Semántica | Regla aplicada en esta revisión |
|---|---|
| `<<include>>` | El comportamiento incluido es **obligatorio** en **toda** instancia del base. |
| `<<extend>>` | El comportamiento se inserta **condicionalmente** **durante** la ejecución del base. |
| `SIBLING` | El segundo CU ocurre **antes o después** del base, no dentro de su ejecución. |
| `PRECONDITION` / `BUSINESS_RULE` | Restringen el flujo sin ser comportamiento embebido ⇒ **sin arista**. |

**Dirección de la flecha.** En `<<extend>>` la flecha va **del CU que extiende al CU base**.
Verificado en los 3 `<<extend>>` dibujados: `UC-EVT-11 → UC-EVT-04`, `UC-EVT-11 → UC-EVT-16`,
`UC-EVT-12 → UC-EVT-04`.

---

# 3. `INC-01` · Reautenticar para una gestión sensible

| Campo | Valor |
|---|---|
| **PREVIOUS E4 DECISION** | `<<include>>`, 39 aristas, cada CU base → `UC-IAM-09` |
| **AUDIT FINDING** | `C-1` · semánticamente falso, refutado por la propia autoridad |
| **FINAL E4 DECISION** | `<<extend>>` `[REAUTHENTICATION_REQUIRED]`, como **regla transversal**, **0 aristas dibujadas** |
| **Condición dibujada** | `[REAUTHENTICATION_REQUIRED]` (vocabulario canónico de PT §38) |
| **Diagramas** | Ninguno lleva la arista. 7 láminas declaran la regla en su nota de una línea. |

## 3.1 Por qué `<<include>>` era falso

La primera pasada de E4 (§3.1 de la V1) citaba `REQ-IAM-009` AC 1 y AC 3 y **no citaba AC 2**:

> `REQ-IAM-009` AC 2 — *«GIVEN una reautenticación correcta WHEN han pasado menos de 10 minutos
> THEN **las operaciones sensibles se autorizan sin volver a pedir la contraseña**.»*

AC 2 documenta un **bypass**. El comportamiento reautenticación **no se ejecuta** en toda
instancia del CU base. Por la regla de `<<include>>` de §2, eso lo descarta.

## 3.2 Por qué `<<extend>>` y no precondición

AC 1 dice *«el sistema **pide la contraseña antes de ejecutar**»*: es comportamiento condicional
y **observable** insertado durante la ejecución del base. AC 3 *«la operación no se ejecuta»*
describe el resultado del base bajo esa condición, no un goal propio de `UC-IAM-09`. No es una
precondición silenciosa porque produce una interacción visible con el actor.

## 3.3 Por qué no se dibujan las 39 aristas

| Razón | Evidencia |
|---|---|
| **Ruido severo** | 39 de 50 aristas del modelo. E3 §2 ya advertía: *«si el ruido gana, la alternativa correcta no es borrar la relación sino dejar `UC-IAM-09` como CU independiente con precondición explícita»*. |
| **Ninguna autoridad enumera el perímetro** | `REQ-IAM-009` no nombra ninguna operación sensible. E3 enunció 39 CU por bloque, no por evidencia CU por CU. Dibujarlas **afirmaba un perímetro sin respaldo**. |
| **La regla es transversal, no local** | `REQ-IAM-012` (sesión) está clasificado `CROSS_CUTTING` en la matriz. La reautenticación se comporta igual: no pertenece a una lámina. |

`UC-IAM-09` **sigue dibujándose** como CU canónico en `UCD-IAM-01`, con su nombre y su actor. Lo
que desaparece es la afirmación de 39 aristas no evidenciadas.

**Vocabulario.** La condición usa `REAUTHENTICATION_REQUIRED`, que existe en PT §38
(*Stable error catalog*). No se inventó `[NO_REAUTHENTICATION]`.

**Vigilancia de E5.** Si E5 descubre que el perímetro debe dibujarse CU por CU, la corrección son
aristas, no CU, actores ni nombres. Entra por Change Control.

---

# 4. `INC-02` · Revisar el impacto de un cambio material

| Campo | Valor |
|---|---|
| **PREVIOUS E4 DECISION** | `<<include>>` ×5 (`UC-EVT-04`, `05`, `07`, `08`, `16` → `UC-EVT-11`) |
| **AUDIT FINDING** | `M-1` · la primera pasada borró las cualificaciones que E3 mismo puso |
| **FINAL E4 DECISION** | `<<include>>` ×3 (`05`, `07`, `08`) + `<<extend>>` ×2 (`11→04`, `11→16`) |
| **Condición** | `[MATERIAL_CHANGE]` en las 5 |
| **Diagramas** | `UCD-EVT-02a` (3 include + 1 extend), `UCD-EVT-03` (1 extend) |

## 4.1 Evidencia que separa los dos grupos

`REQ-EVT-011` AC 1:

> *«GIVEN un evento programado WHEN se modifica **cualquiera de los campos materiales listados**
> THEN la operación se trata como cambio material.»*

La condición es **por campo**, no por caso de uso. De ahí la separación:

| CU | ¿Toda ejecución es material? | Tipo FINAL |
|---|---|---|
| `UC-EVT-05` Posponer | **Sí** — `REQ-EVT-011` nombra *«las acciones de posponer, reprogramar, cancelar y restaurar»* como acciones, sin condición de campo | `<<include>>` |
| `UC-EVT-07` Cancelar | **Sí** — ídem | `<<include>>` |
| `UC-EVT-08` Restaurar | **Sí** — ídem | `<<include>>` |
| `UC-EVT-04` Editar un evento | **No** — se completa sin cambios materiales | `<<extend>>` |
| `UC-EVT-16` Actualizar logística | **No** — `REQ-EVT-019`: *«los cambios de logística son materiales»* (la logística **es** material, pero **no toda** ejecución de actualizar logística lo es) | `<<extend>>` |

**La autoridad alcanza para los cinco.** No hay `DEFER_TO_E5`: `REQ-EVT-011` + `REQ-EVT-012` +
`REQ-EVT-019` resuelven el alcance sin inferencia.

## 4.2 La divergencia respecto de la primera pasada, declarada

E3 (§`INC-02`) **ya** calificaba las candidatas: `UC-EVT-04` *«(rama material)»* y `UC-EVT-16`
*«(si además cambia un campo coordinativo)»*. La primera pasada de E4 (§4.1) **aplanó** esas dos
cualificaciones al tratar las cinco como un bloque homogéneo. **E4-0.1 las restituye.**

## 4.3 La frontera que `INC-02` no cubre

Los 14 CU de `EVT` restantes siguen **sin** arista, cada uno excluido por la misma lista cerrada de
`REQ-EVT-011`. Sin cambio respecto de la primera pasada.

---

# 5. `EXT-01` · Resolver un conflicto de edición concurrente — **SE MANTIENE**

| Campo | Valor |
|---|---|
| **PREVIOUS E4 DECISION** | `<<extend>>` 1 arista, `UC-EVT-12 → UC-EVT-04` `[STALE_VERSION]` |
| **AUDIT FINDING** | Sin hallazgo. Confirmado por el test de *dentro/fuera* de la ejecución. |
| **FINAL E4 DECISION** | **`<<extend>>`** — sin cambio |
| **Diagrama** | `UCD-EVT-02a` |

`REQ-EVT-013` AC 1: *«GIVEN un formulario con cambios locales WHEN el recurso cambia en el servidor
y el actor guarda THEN **la operación es rechazada** y el usuario ve su base, sus cambios y la
versión actual.»*

El base **no** terminó exitosamente — fue rechazado — y el comportamiento aparece **dentro** de su
ejecución, en el paso de guardado. Cumple `<<extend>>` y no `SIBLING`.

---

# 6. `EXT-02` · Corregir la asistencia de un evento — **RECHAZADA**

| Campo | Valor |
|---|---|
| **PREVIOUS E4 DECISION** | `<<extend>>` 2 aristas, `UC-PRT-07 → UC-PRT-05/06` `[SHEET_CLOSED]` |
| **AUDIT FINDING** | `C-4` · el base ya terminó exitosamente |
| **FINAL E4 DECISION** | **`SIBLING`** — **0 aristas** |
| **Diagrama** | `UCD-PRT-01`: ambos CU presentes, **sin ninguna línea entre ellos** |

`REQ-PRT-011` AC 1: *«WHEN el entrenador la cierra THEN queda registrada la marca de cierre y la
planilla **ya no admite marcaje nuevo sin corrección**.*» NOTES: *«La reapertura de una planilla
cerrada **no** es requisito.»*

`UC-PRT-06` cerrar **prospera**; después aparece `UC-PRT-07`. `REQ-PRT-012` AC 3
(la corrección **exige motivo**, su propio outcome) describe una operación independiente con
resultado propio. Es un CU hermano con precondición de estado `CLOSED`, no una extensión.

---

# 7. `EXT-03` · Corregir el resultado de un partido — **RECHAZADA**

| Campo | Valor |
|---|---|
| **PREVIOUS E4 DECISION** | `<<extend>>` 1 arista, `UC-PRT-10 → UC-PRT-09` `[RESULT_FINAL]` |
| **AUDIT FINDING** | `C-4` · el AC describe un camino **separado**, no una inserción |
| **FINAL E4 DECISION** | **`SIBLING`** — **0 aristas** |
| **Diagrama** | `UCD-PRT-02`: ambos CU presentes, sin línea entre ellos |

`REQ-PRT-013` AC 2: *«GIVEN un resultado **finalizado** WHEN se intenta editarlo por la vía normal
THEN la operación **no está disponible** y **se ofrece la vía de corrección**.»*
STATEMENT: *«finalizado, el resultado queda en estado final y la finalización es **terminal**.*»

La primera pasada de E4 (§7) leer esto como *«el AC diseña la relación»*. Es lo contrario: el AC
declara la vía normal **cerrada** y ofrece **otra** vía, que es la definición de un objetivo
independiente. `UC-PRT-09` ya terminó.

---

# 8. `EXT-04` · Revisar los conflictos de una convocatoria — **RECHAZADA**

| Campo | Valor |
|---|---|
| **PREVIOUS E4 DECISION** | `<<extend>>` 2 aristas, `UC-PRT-04 → UC-PRT-02/03` `[DERIVED_CONFLICTS]` |
| **AUDIT FINDING** | `C-4` · publicación prospera; la revisión se ofrece en la **consulta** |
| **FINAL E4 DECISION** | **`SIBLING`** — **0 aristas**. **Ningún `DEFER_TO_E5`.** |
| **Diagrama** | `UCD-PRT-01`: ambos CU presentes, sin línea entre ellos |

`REQ-PRT-006` AC 1: *«WHEN el entrenador publica THEN **la publicación prospera** y el conflicto
queda derivado y visible.*» AC 2: *«GIVEN ese conflicto WHEN **se consulta** la convocatoria THEN se
explica el motivo en lenguaje de usuario y se ofrece la superficie de revisión de conflictos.*»

- Para `UC-PRT-03` publicar: el base **prospera**. La revisión se ofrece en la **consulta**, que no
  es `UC-PRT-03`. ⇒ `SIBLING`.
- Para `UC-PRT-02` preparar: **ningún AC sitúa la revisión dentro de la preparación**. E3 lo escribió
  como *«mientras se prepara»*, pero ninguna autoridad lo sostiene. La ausencia de evidencia para
  una inserción significa que **no se dibuja relación**; no significa dejar una relación UML
  pendiente sin respaldo. Si E5 descubre que la revisión debe ocurrir dentro de preparar, entra por
  **Change Control**.

> **Nota de exactitud.** Un resumen de la auditoría afirmó `«UC-EVT-02 → DEFER_TO_E5»`. **Es un
> error de transcripción.** La candidata afectada es `EXT-04` (`UC-PRT-02` / `UC-PRT-03` →
> `UC-PRT-04`). El error no se propaga a ningún artefacto.

---

# 9. `EXT-05` · Marcar una notificación como leída — **`SIBLING` (revalidado)**

`REQ-COM-018` GOAL habla de la calidad de la lista; AC 2 *«sin abandonar la lista»* es restricción
de superficie. `UC-COM-14` tiene goal, trigger y success outcome propios y escribe `read_at`, que
`UC-COM-13` no escribe. Resultado distinto ⇒ objetivo independiente.

**Revalidado sin cambio.** `UCD-COM-02` los dibuja con el mismo actor y **sin ninguna línea** entre
ellos, con la nota que hace visible la decisión.

---

# 10. `EXT-06` · Completar el perfil de una jugadora — **`SIBLING` (revalidado)**

`REQ-PPL-002` AC 1: la incorporación de una jugadora sin los seis datos es **rechazada** con
`PLAYER_PROFILE_INCOMPLETE`. La incorporación **no incorpora** la corrección: la rechaza. Eso
descarta `include` en cualquier dirección. Y `REQ-PPL-002` PRELIMINARY ACTOR = `Admin`, `REQ-PPL-013`
AC 3 da a `Admin` una capacidad alcanzable de forma independiente ⇒ no es condicional respecto de
`UC-PPL-06`.

**Revalidado sin cambio.** 0 aristas.

---

# 11. LAS 9 RELACIONES RECHAZADAS POR E3 — VERIFICACIÓN DE NO DIBUJO

`REJECTED_RELATION_DRAWN = 0`, comprobado **por pareja concreta, en ambas direcciones**, por
`scripts/validate-drawio-use-cases.mjs`.

| ID | Relación rechazada por E3 | AC que lo prohíbe | Presente en E4-0.1 |
|---|---|---|---|
| `REJ-01` | «Autenticar usuario» como `include` de todo | `REQ-IAM-012`: precondición | **No** |
| `REJ-02` | `UC-IAM-01` como `include` de todo | Ya es CU hermano | **No** — 0 aristas hacia `UC-IAM-01` |
| `REJ-03` | Disponibilidad `include` en asistencia | `REQ-PRT-018` | **No** |
| `REJ-04` | Habilitación `include` en publicar convocatoria | `REQ-PRT-006`: publica igual | **No** |
| `REJ-05` | «Solicitar reconfirmación» como `extend` | El comando no existe | **No** |
| `REJ-06` | Archivar estructura `include` en archivar equipo | `REQ-STR-006` es valla | **No** |
| `REJ-07` | Historial `include` en las correcciones | La corrección produce historia | **No** |
| `REJ-08` | Consultar comunicado `include` en publicarlo | Actores y objetivos distintos | **No** |
| `REJ-09` | Archivar conversación `include` en enviar mensaje | Objetivo independiente | **No** |

**Checks adicionales de E4-0.1:**

| Check | Resultado |
|---|---:|
| `REJECTED_RELATION_DRAWN` (las 9 de E3) | **0** |
| `REJECTED_RELATION_DRAWN` (EXT-02/03/04/05/06 reclasificados) | **0** |
| `REJECTED_RELATION_DRAWN` (`INC-01` dibujada como arista) | **0** |
| `UNAUTHORIZED_NEW_RELATION` | **0** |
| `UNKNOWN_RELATION_ENDPOINT` | **0** |
| `APPROVED_RELATION_NOT_DRAWN` | **0** |

---

# 12. RELACIONES DIBUJADAS — SET FINAL

| Diagrama | `<<include>>` | `<<extend>>` | Detalle |
|---|---:|---:|---|
| `UCD-IAM-01` | 0 | 0 | `UC-IAM-09` como CU propio; la regla transversal va en la nota |
| `UCD-PPL-01` | 0 | 0 | — |
| `UCD-PPL-02` | 0 | 0 | — |
| `UCD-STR-01` | 0 | 0 | — |
| `UCD-STR-02` | 0 | 0 | — |
| `UCD-EVT-01` | 0 | 0 | — |
| `UCD-EVT-02a` | **3** | **2** | `05/07/08 →» 11` include · `11 →» 04` extend · `12 →» 04` extend |
| `UCD-EVT-02b` | 0 | 0 | — |
| `UCD-EVT-03` | 0 | **1** | `11 →» 16` extend (copia de referencia de `UC-EVT-11`, declarada) |
| `UCD-PRT-01` | 0 | 0 | `EXT-02` y `EXT-04` ahora `SIBLING` |
| `UCD-PRT-02` | 0 | 0 | `EXT-03` ahora `SIBLING` |
| `UCD-COM-01` | 0 | 0 | — |
| `UCD-COM-02` | 0 | 0 | `EXT-05` `SIBLING`, declarado en la nota |
| `UCD-CMP-01` | 0 | 0 | — |
| `UCD-CMP-02` | 0 | 0 | — |
| `UCD-INS-01` | 0 | 0 | — |
| **TOTAL** | **3** | **3** | **6 relaciones** |

`→»` = dirección de `<<extend>>`, del CU que extiende al CU base.

**Copias de referencia:** 1 (`UC-EVT-11` en `UCD-EVT-03`). Mismo ID, mismo nombre, mismo elemento
del modelo, declarada en la nota de la lámina. Bajó de 10 en la primera pasada.

---

# 13. LIMITACIONES DECLARADAS

1. **`INC-01` no se dibuja.** El tipo y la condición quedan congelados; el perímetro, no. Ninguna
   autoridad enumera las operaciones sensibles, así que dibujar 39 aristas afirmaba más de lo que
   las fuentes sostienen.
2. **`EXT-04` sobre `UC-PRT-02` no se dibuja por falta de evidencia**, no por decisión de alcance.
   Si E5 encuentra una necesidad de revisión dentro de la preparación, entra por Change Control.
3. **Las 5 aristas de `INC-02` comparten la condición `[MATERIAL_CHANGE]`**, pero dos de ellas son
   `<<extend>>`. El mismo texto de condición aparece en un `include` y en un `extend` de la misma
   familia; el tipo lo determina si **toda** ejecución es material, no el texto.
4. **`ACT-AUTHENTICATED` sigue asociado a 5 proyecciones** que E2 §4.3 excluye del abstracto.
   Decisión heredada de E4 V1, no re-litigada en E4-0.1. Reversión definida en el audit §11.1.
5. **Este documento no dibuja y no especifica.** Sin caminos felices, alternos, precondiciones
   detalladas ni reglas de negocio: eso es E5.

---

**Fin del Use Case Relation Decisions V1 (revisión E4-0.1).**

**SOURCE MODIFIED: NO.** Este lote no modificó `docs/use-cases/**`, `docs/actors/**`,
`docs/requirements/**` ni `src/**`.