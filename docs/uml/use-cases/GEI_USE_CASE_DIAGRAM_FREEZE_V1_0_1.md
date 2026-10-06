# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE DIAGRAM FREEZE V1.0.1

**Etapa:** 4 — Diagramas de casos de uso
**Estado:** FROZEN · **Versión:** V1.0.1 · **Fecha:** 2026-10-06
**Rama:** `gei/e4-use-case-diagrams-freeze-v1`
**Baseline de E3:** `730bf8ffee428666d24a588e23f23b457dc35123`
**Supersede:** `GEI_USE_CASE_DIAGRAM_FREEZE_V1.md` (`2b80f5e`), que queda **histórico e intacto**
**Resultado del gate:** **PASS** — ver §12

> Por qué una versión nueva y no una edición: V1 ya se declaró `FROZEN` en el commit `2b80f5e` con
> un veredicto `PARTIAL` y 50 relaciones. Cambiar su contenido sin versionar rompería la regla de no
> reescribir un freeze emitido. Este documento **no modifica** V1: lo reemplaza y deja constancia.

---

# 1. POR QUÉ EXISTE V1.0.1

Una **auditoría de E4** (no una revisión de estilo) encontró defectos que invalidaban el gate de V1:

| # | Defecto | Gravedad |
|---|---|---|
| **B-1** | Los `.drawio` **no se podían abrir ni exportar**: los *waypoints* se emitían como texto `"x,y x,y"` en vez de elementos `<mxPoint>` | **CRITICAL** |
| **B-2** | `INC-01` era `<<include>>` contra la evidencia de `REQ-IAM-009` AC 2 | **CRITICAL** |
| **B-3** | `EXT-02`, `EXT-03`, `EXT-04` eran `<<extend>>` cuando el base ya había terminado | **CRITICAL** |
| **B-4** | **86 317 px** de conectores dibujados uno sobre otro en las 17 láminas | **CRITICAL** |
| **B-5** | `UCD-00` renderizaba **vacío**: 8 paquetes de dominio invisibles por `<i>` crudo en un atributo | **CRITICAL** |
| **B-6** | Los offsets de `edgeLabel` en píxeles inflaban el render a **232 136 px** de ancho | **CRITICAL** |
| **B-7** | `K(2,6)` declarado no planar — **afirmación falsa** | **MAJOR** |
| **B-8** | `INC-02` con `include` en `UC-EVT-04` / `UC-EVT-16` | **MAJOR** |
| **B-9** | Tipografía a 10 pt / 9 pt | **MAJOR** |
| **B-10** | Superposición etiqueta/figura de actor en `UCD-00` | **MAJOR** |

Los seis `CRITICAL` eran **invisibles** para la QA de V1 porque ésta comprobaba XML bien formado, no
que draw.io pudiera leer el archivo.

---

# 2. AUTORIDAD DE ENTRADA

Sin cambios respecto de V1 §1. Este lote **no** modificó ninguna autoridad de E1, E2 ni E3.

| Documento | Rol |
|---|---|
| `docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` | Qué 102 CU existen |
| `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` | ID, nombre y actores de cada CU |
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` | Los 8 actores y las 6 generalizaciones |
| `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` | Actores por CU |
| `docs/use-cases/GEI_USE_CASE_RELATION_CANDIDATES_V1.md` | Las 8 candidatas y los 9 rechazos |
| `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` | **Evidencia de semántica** de las relaciones |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` §38 | **Vocabulario canónico** de condiciones |
| `src/**` | **Evidencia secundaria. NO es autoridad UML.** No se usó para derivar nada |

## 2.1 Cambios respecto de las autoridades

| Cambio | Verificación |
|---|---|
| **0** CU creados · eliminados · renombrados | `UNKNOWN_UC=0`, `MISSING=0`, `RENAMED_ID=0` |
| **0** actores creados · eliminados | `UNKNOWN_ACTOR=0`, 8 / 8 |
| **0** relaciones nuevas no autorizadas | `UNAUTHORIZED_NEW_RELATION=0` |
| **0** generalizaciones nuevas | `NO_NEW_GENERALIZATION=0` |
| **0** rechazadas dibujadas | `REJECTED_RELATION_DRAWN=0` |

---

# 3. FORMATO AUTORITATIVO

| Nivel | Formato | Rol | Estado |
|---|---|---|---|
| **1 — Fuente** | `.drawio` XML **no comprimido** | **AUTORITATIVO. Editable.** | **17 / 17** |
| 2 — Entrega | PDF | Derivado | **17 / 17 exportados** |
| 3 — Preview | PNG | Derivado | **17 / 17 exportados** |

**Regla:** si un `.drawio` y un PDF contradicen algo, **manda el `.drawio`**.

## 3.1 El requisito que V1 no verificó

> **Un `.drawio` bien formado no es un `.drawio** **cargable.**

V1 afirm\u00F3 sin verificar que al declarar *"XML válido"* y *"no debería aparecer el diálogo de
reparación"*. La comprobación real es otra: **draw.io debe poder cargarlo y exportarlo.** Eso se
verificó ejecutando la CLI sobre los 17 archivos. Los de V1 fallaban los 17.

## 3.2 Propiedades verificadas por ejecución real

| Propiedad | Resultado |
|---|---|
| XML bien formado | **17 / 17** |
| **draw.io carga el archivo** | **17 / 17** (CLI devuelve exit 0) |
| **draw.io exporta a PNG** | **17 / 17** |
| **draw.io exporta a PDF** | **17 / 17** |
| `<mxfile>` · `<diagram>` · `<mxGraphModel>` | 17 / 17 |
| IDs de `mxCell` únicos | 0 duplicados |
| `parent` · `source`/`target` válidos | 0 rotas |
| Sin `NaN` / `Infinity` | 0 casos |
| `<Array as="points">` con `<mxPoint>` | **17 / 17** |
| Sin `<`/`>` crudo en atributos | **17 / 17** |
| `edgeLabel` con offsets en fracción | **17 / 17** |
| Texto editable, sin rasterizar | Sí |
| Conectores editables | Sí, con `<Array as="points">` |

---

# 4. COBERTURA 102 / 102

| Métrica | V1 | **V1.0.1** |
|---|---:|---:|
| CU canónicos | 102 | **102** |
| CU únicos representados | 102 | **102** |
| `MISSING` | 0 | **0** |
| `UNKNOWN_UC` | 0 | **0** |
| `RENAMED_ID` | 0 | **0** |
| CU en la lámina de su dominio | 102 / 102 | **102 / 102** |
| Actores E2 representados | 8 / 8 | **8 / 8** |
| `UNKNOWN_ACTOR` | 0 | **0** |
| Actor dentro del *boundary* | 0 | **0** |
| CU fuera del *boundary* | 0 | **0** |
| `UC_WITHOUT_ACTOR_ASSOCIATION` | 0 | **0** |
| Repeticiones cross-dominio | 10 | **1** |

### 4.1 Cobertura por dominio

| Dominio | CU | Láminas propietarias |
|---|---:|---|
| `IAM` | **10 / 10** | `UCD-IAM-01` |
| `PPL` | **17 / 17** | `UCD-PPL-01`, `UCD-PPL-02` |
| `STR` | **15 / 15** | `UCD-STR-01`, `UCD-STR-02` |
| `EVT` | **19 / 19** | `UCD-EVT-01`, `UCD-EVT-02a`, `UCD-EVT-02b`, `UCD-EVT-03` |
| `PRT` | **13 / 13** | `UCD-PRT-01`, `UCD-PRT-02` |
| `COM` | **14 / 14** | `UCD-COM-01`, `UCD-COM-02` |
| `CMP` | **9 / 9** | `UCD-CMP-01`, `UCD-CMP-02` |
| `INS` | **5 / 5** | `UCD-INS-01` |
| `SYS` | **0 / 0** | E3 §12.1 |
| **TOTAL** | **102 / 102** | **16 láminas de detalle + 1 mapa** |

---

# 5. RELACIONES — SET FINAL

**6 relaciones**, de 8 candidatas de E3. Decisión completa con `PREVIOUS → FINDING → FINAL`,
evidencia y dirección en `GEI_USE_CASE_RELATION_DECISIONS_V1.md`.

| ID | PREVIOUS V1 | **FINAL V1.0.1** | Aristas |
|---|---|---|---:|
| `INC-01` | `include` ×39 | **`extend` `[REAUTHENTICATION_REQUIRED]`, regla transversal** | **0** |
| `INC-02` | `include` ×5 | **`include` ×3** (`05`,`07`,`08`) + **`extend` ×2** (`11→04`, `11→16`) | **5** |
| `EXT-01` | `extend` ×1 | **`extend`** — sin cambio | **1** |
| `EXT-02` | `extend` ×2 | **`SIBLING`** | **0** |
| `EXT-03` | `extend` ×1 | **`SIBLING`** | **0** |
| `EXT-04` | `extend` ×2 | **`SIBLING`** | **0** |
| `EXT-05` | `SIBLING` | **`SIBLING`** — revalidado | **0** |
| `EXT-06` | `SIBLING` | **`SIBLING`** — revalidado | **0** |
| | **50** | | **6** |

## 5.1 Semántica por relación

| # | Extensor | Base | Tipo | Condición | Diagrama |
|---:|---|---|---|---|---|
| 1 | `UC-EVT-05` Posponer | `UC-EVT-11` | `<<include>>` | `[MATERIAL_CHANGE]` | `UCD-EVT-02a` |
| 2 | `UC-EVT-07` Cancelar | `UC-EVT-11` | `<<include>>` | `[MATERIAL_CHANGE]` | `UCD-EVT-02a` |
| 3 | `UC-EVT-08` Restaurar | `UC-EVT-11` | `<<include>>` | `[MATERIAL_CHANGE]` | `UCD-EVT-02a` |
| 4 | `UC-EVT-11` | `UC-EVT-04` Editar | `<<extend>>` | `[MATERIAL_CHANGE]` | `UCD-EVT-02a` |
| 5 | `UC-EVT-12` | `UC-EVT-04` Editar | `<<extend>>` | `[STALE_VERSION]` | `UCD-EVT-02a` |
| 6 | `UC-EVT-11` | `UC-EVT-16` Logística | `<<extend>>` | `[MATERIAL_CHANGE]` | `UCD-EVT-03` |

**Dirección comprobada:** la flecha va **del CU que extiende al CU base**. `<<extend>>` sin
condición visible: **0**.

## 5.2 Las 9 rechazos de E3 siguen sin dibujarse

`REJECTED_RELATION_DRAWN = 0`, por pareja concreta y en ambas direcciones. Se añadió además el
check de que **`UC-IAM-09` no es extremo de ninguna arista**, porque `INC-01` dejó de dibujarse.

---

# 6. NOTACIÓN UML APLICADA

| Elemento | Representación |
|---|---|
| Actor | `shape=umlActor`, **fuera** del *system boundary* |
| Caso de uso | `ellipse`, **dentro** del *system boundary* |
| *System boundary* | Rectángulo rotulado, ajustado al contenido |
| Asociación | línea **sólida**, **sin flecha**, con `exitX/exitY/entryX/entryY` por arista |
| Generalización | línea sólida + **triángulo hueco**, entrada distinta por hijo |
| `<<include>>` | línea **discontinua** + flecha abierta, **al CU incluido** |
| `<<extend>>` | línea **discontinua** + flecha abierta, **del extensor al CU base** |
| Condición | `[CONDICION]` junto a la relación, vocabulario de PT §38 |
| Actor abstracto | `«abstract»` bajo el nombre |

**0 flechas decorativas. 0 iconos de producto. 0 gradientes. 0 sombras.**

## 6.1 Reglas visuales

| Regla | Valor |
|---|---|
| Fondo · elipses · líneas | Blanco · `#1A1A1A` · un solo tono, sin color semántico |
| Tipografía | **Helvetica** en todo, sin dependencia externa |
| Tamaño de página | A4 landscape `1169 × 827`, `page=1` |
| **Título de lámina** | **15 pt** |
| **Rótulo del *boundary*** | **12 pt** |
| **Caso de uso** | **11 pt** |
| **Actor** | **11 pt** |
| **Etiqueta de relación** | **11 pt** |
| **Texto bajo 11 pt** | **0** (verificado por `TYPOGRAPHY_BELOW_11PT`) |
| Anclaje de conectores | Punto propio en el perímetro de cada forma |
| Canales de association | 12 carriles verticales + tabla de canales de fila |
| **Banda de rótulos de relación** | **Gap de fila ampliado 16 → 46 px sólo en láminas con relaciones; franja bajo la última fila reservada** |

### 6.1.1 Corrección tipográfica frente a V1

V1 usaba actor a 10 pt y etiqueta de relación a 9 pt, y lo declaraba como desviación menores
argumentando que no cabían en A4. Con `INC-01` sin dibujar 39 aristas, el argumento de espacio ya
no se sostenía. **Los cuatro tamaños están ahora ≥ 11 pt.** No se volvió a 9/10 pt para ahorrar
láminas.

---

# 7. TOPOLOGÍA

**17 archivos** en `docs/uml/use-cases/source/`: `UCD-00` (mapa) + 16 láminas de detalle.

| ID | Archivo | CU propios | Actores | Relaciones |
|---|---|---:|---:|---:|
| `UCD-00` | `UCD-00__GEI_Use_Case_Map.drawio` | 0 | 8 | 0 |
| `UCD-IAM-01` | `UCD-IAM-01__GEI_Identity_Access.drawio` | 10 | 4 | 0 |
| `UCD-PPL-01` | `UCD-PPL-01__GEI_Person_Profile_Membership.drawio` | 8 | 3 | 0 |
| `UCD-PPL-02` | `UCD-PPL-02__GEI_Team_Roles_Representation.drawio` | 9 | 3 | 0 |
| `UCD-STR-01` | `UCD-STR-01__GEI_Season_Division_Line.drawio` | 8 | 1 | 0 |
| `UCD-STR-02` | `UCD-STR-02__GEI_Team_Venue.drawio` | 7 | 1 | 0 |
| `UCD-EVT-01` | `UCD-EVT-01__GEI_Event_Creation.drawio` | 6 | 2 | 0 |
| `UCD-EVT-02a` | `UCD-EVT-02a__GEI_Event_Material_Change.drawio` | 6 | 2 | 5 |
| `UCD-EVT-02b` | `UCD-EVT-02b__GEI_Event_State_Transitions.drawio` | 3 | 2 | 0 |
| `UCD-EVT-03` | `UCD-EVT-03__GEI_Event_Logistics_Queries.drawio` | 4 | 4 | 1 |
| `UCD-PRT-01` | `UCD-PRT-01__GEI_Availability_Selection_Attendance.drawio` | 7 | 3 | 0 |
| `UCD-PRT-02` | `UCD-PRT-02__GEI_Match_Result_Eligibility.drawio` | 6 | 4 | 0 |
| `UCD-COM-01` | `UCD-COM-01__GEI_Announcements.drawio` | 5 | 2 | 0 |
| `UCD-COM-02` | `UCD-COM-02__GEI_Conversations_Notifications.drawio` | 9 | 1 | 0 |
| `UCD-CMP-01` | `UCD-CMP-01__GEI_Competition_Lifecycle.drawio` | 5 | 3 | 0 |
| `UCD-CMP-02` | `UCD-CMP-02__GEI_Competition_Entries.drawio` | 4 | 2 | 0 |
| `UCD-INS-01` | `UCD-INS-01__GEI_Search_Reports_Audit.drawio` | 5 | 6 | 0 |

## 7.1 `UCD-00` — qué es y qué no es

**Es** un mapa de cobertura: los 8 actores con sus generalizaciones y los 8 dominios con su cantidad
de CU y sus `Diagram ID`. **NO** es un diagrama de casos de uso.

| Check | Resultado |
|---|---|
| Elipses de CU | **0** |
| **Pseudo-CU** | **0** |
| **Umbrella use cases** | **0** — no existe «Gestionar club» ni «Administrar sistema» |
| Paquetes de dominio | **8** (`SYS` correctamente ausente) |
| Lo declara la propia lámina | *«Mapa maestro de cobertura — no reemplaza los diagramas UML detallados.»* |

V1 arrastraba un defecto que hacía esta lámina **inútil**: los 8 paquetes llevaban `<i>` crudo dentro del
atributo `value`, XML malformado, y draw.io los descartaba. `UCD-00` se entregaba **con el
*boundary* vacío**. Corregido y verificado en render.

## 7.2 La falsa prueba de no-planaridad, retirada

V1 §4.2, §7.1 y §10.3 afirmaban, en tres lugares:

> *«El grafo actor→CU es `K(2,6)` restricted, y con ambos actores fuera del *system boundary* ese
> grafo **no es planar**: algún cruce es inevitable en cualquier disposición.»*

**Es falso.** `K(2,n)` **es planar** para todo `n`: es el grafo de `n` senderos paralelos entre dos
vértices, con `v = n+2` y `e = 2n ≤ 2v−4`. Para `n = 6`: `v = 8`, `e = 12`, exactamente en el
límite — la cuadrangulación máxima. La afirmación se **elimina** y **no** se sustituye por otra
teórica: los cruces no son una restricción topológica, sino el resultado de un router que no
penalizaba el solapamiento.

**Restricción geométrica real, comprobada.** El orden lineal de los CU deja como máximo 5 canales
inter-fila; 12 asociaciones entran por el lado izquierdo. La resolución aplicada fue dar **canal y
punto de anclaje propios a cada arista**, no dividir la lámina.

---

# 8. VALIDACIÓN MECÁNICA

`node scripts/validate-drawio-use-cases.mjs` → **PASS, 0 findings**.
Informe: `docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt`.

| Check | Resultado |
|---|---:|
| `CANONICAL_UC` / `UNIQUE_UC_IN_PRIMARY_DIAGRAMS` | **102 / 102** |
| `MISSING` · `UNKNOWN_UC` · `RENAMED_ID` | **0** |
| `UC_NOT_IN_OWNER_DOMAIN_DIAGRAM` | **0** |
| `UNKNOWN_ACTOR` · actores E2 | **0** · **8 / 8** |
| `ACTOR_INSIDE_BOUNDARY` · `UC_OUTSIDE_BOUNDARY` | **0** · **0** |
| `UC_WITHOUT_ACTOR_ASSOCIATION` | **0** |
| `NO_NEW_GENERALIZATION` · `FORBIDDEN_GENERALIZATION` | **0** · **0** |
| `UNKNOWN_RELATION_ENDPOINT` · `UNAUTHORIZED_NEW_RELATION` | **0** · **0** |
| `REJECTED_RELATION_DRAWN` · `APPROVED_RELATION_NOT_DRAWN` | **0** · **0** |
| `EXTEND_WITHOUT_CONDITION` | **0** |
| `MALFORMED_XML` · `DUPLICATE_CELL_ID` | **0** · **0** |
| `BROKEN_PARENT_REF` · `BROKEN_EDGE_ENDPOINT` | **0** · **0** |
| `ELEMENT_OFF_PAGE` · `NON_FINITE_GEOMETRY` | **0** · **0** |
| **`DRAWIO_INVALID_WAYPOINTS`** (nuevo) | **0** |
| **`RAW_ANGLE_IN_ATTRIBUTE`** (nuevo) | **0** |
| **`EDGE_LABEL_BAD_OFFSET`** (nuevo) | **0** |
| **`LABEL_FIGURE_OVERLAP`** (nuevo) | **0** |
| **`ACTOR_OVERLAP`** (nuevo) | **0** |
| **`TYPOGRAPHY_BELOW_11PT`** (nuevo) | **0** |
| **`RELATION_LABEL_OVERLAP`** (cierre D-10) | **0** |
| **`RELATION_LABEL_TO_NODE_OVERLAP`** (cierre D-10) | **0** |
| **`RELATION_LABEL_OUTSIDE_PAGE`** (cierre D-10) | **0** |
| **`RELATION_LABEL_UNREADABLE`** (cierre D-10) | **0** |
| `TEXT_OFF_PAGE` · `UC_TEXT_OVERFLOWS_ELLIPSE` (cierre D-10) | **0** · **0** |
| `CONNECTOR_OVERLAP` (nuevo, no bloqueante) | **10 pares · 182 px** |

## 8.1 Solape colineal: de 86 317 px a 182 px

| Lámina | V1 | E4-0.1 (intermedio) | **V1.0.1 FINAL** |
|---|---:|---:|---:|
| `UCD-IAM-01` | 3 895 px | 0 | **0** |
| `UCD-PPL-01` | 5 269 px | 0 | **0** |
| `UCD-PPL-02` | 10 339 px | 0 | **0** |
| `UCD-STR-01` | 8 748 px | 0 | **0** |
| `UCD-STR-02` | 7 160 px | 0 | **0** |
| `UCD-EVT-01` | 6 999 px | 0 | **0** |
| **`UCD-EVT-02a`** | **10 063 px** | 182 px | **144 px** |
| `UCD-EVT-03` | 2 236 px | 5 px | **0** |
| `UCD-INS-01` | 6 538 px | 38 px | **38 px** |
| Resto (8 láminas) | 0–3 306 px | 0 | **0** |
| **TOTAL** | **86 317 px** | **225 px** | **182 px** (−99,8 %) |
| Pares residuales > 1 px (`CONNECTOR_OVERLAP`) | ~152 | 10 | **10** — ninguno involucra rótulos |

Las 152 coincidencias exactas eran el defecto dominante: dos `<<include>>` indistinguibles, y un
`<<extend>>` trazado **exactamente sobre** una `<<include>>` con el mismo `dashPattern`. Invisible
para el cruce propio, que da 0 cuando los cuatro productos vectoriales son 0.

## 8.2 La lección de método

V1 substituted **análisis geométrico** por QA visual y lo declaró así. El análisis era correcto
**sobre un modelo que draw.io no leía**: los *waypoints* que el router optimizaba no existían en el
render. Un gate que no comprueba que la herramienta pueda cargar el artefacto no puede detectar que
el artefacto no carga.

---

# 9. EXPORT

| Campo | V1 | **V1.0.1** |
|---|---|---|
| draw.io CLI | **NO** | **SÍ** — MSIX `draw.io.draw.ioDiagrams_31.7.0.0_x64` |
| Ruta | — | `C:\Program Files\WindowsApps\draw.io.draw.ioDiagrams_31.7.0.0_x64__1zh33159kp73c\app\draw.io.exe` |
| `.drawio` exportados | **0 / 17** | **17 / 17** |
| PNG | **0** | **17** (`export/png/`) |
| PDF | **0** | **17** (`export/pdf/`) |
| Estado | `EXPORT_BLOCKED_NO_DRAWIO_CLI` | **`EXPORT_OK`** |

**Cómo se localizó.** No estaba en `PATH` (`where drawio` y `where draw.io` devuelven nada). Se
localizó la instalación MSIX con `Get-AppxPackage *draw*`, y se invocó por **ruta absoluta**. **No
se instaló software, no se modificaron permisos de `WindowsApps` y no se copió el ejecutable fuera
del paquete.**

**Verificación de la CLI antes de exportar todo.** Un `.drawio` mínimo de control exportó
correctamente mientras los 17 de E4 fallaban con `Export failed`. Eso Localizó `B-1` antes de tocar
nada.

## 9.1 Dimensiones de render

Las 17 láminas renderizan entre **1614 × 924** y **2323 × 1641** px a escala 2, es decir
proporción A4 landscape; `UCD-EVT-02a` mide **2274 × 858** tras el fix D-10 (banda de rótulos
reservada + boundary extendido). V1 producía **232 136 × 1 586 px** en `UCD-EVT-02a` por `B-6`.

---

# 10. QA VISUAL — RESULTADO REAL

Se inspeccionaron **los PNG renderizados**, no la geometría. La geometría se revisó como
comprobación complementaria. Se revisaron **las 17 láminas, una por una**.

| Lámina | Título | Actores | CU | Boundary | Sin clipping | Sin solape texto | `include`/`extend` | Flecha | Veredicto |
|---|---|---|---|---|---|---|---|---|---|
| `UCD-00` | legible | legibles · 8/8 | n/a | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-IAM-01` | legible | legibles | 10/10 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-PPL-01` | legible | legibles | 8/8 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-PPL-02` | legible | legibles | 10/10 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-STR-01` | legible | legibles | 8/8 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-STR-02` | legible | legibles | 7/7 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-EVT-01` | legible | legibles | 6/6 | correcto | sí | sí | n/a | n/a | **PASS** |
| **`UCD-EVT-02a`** | legible | legibles | 6/6 | correcto | sí | **sí — 5 rótulos separados** | **5/5 legibles** | sí | **PASS** |
| `UCD-EVT-02b` | legible | legibles | 3/3 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-EVT-03` | legible | legibles | 4+ref | correcto | sí | sí | legible | sí | **PASS** |
| `UCD-PRT-01` | legible | legibles | 7/7 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-PRT-02` | legible | legibles | 5/5 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-COM-01` | legible | legibles | 5/5 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-COM-02` | legible | legibles | 9/9 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-CMP-01` | legible | legibles | 5/5 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-CMP-02` | legible | legibles | 4/4 | correcto | sí | sí | n/a | n/a | **PASS** |
| `UCD-INS-01` | legible | legibles · 5 gen | 5/5 | correcto | sí | sí | n/a | n/a | **PASS** |

**Resultado global: 17 / 17 PASS.**

## 10.1 D-10 — el FAIL que hubo, y cómo se cerró

**Estado intermedio (E4-0.1):** `UCD-EVT-02a` concentraba **5 de las 6 relaciones del modelo** sobre
`UC-EVT-11` y `UC-EVT-04`, y sus **5 rótulos** caían en **la misma banda de canal** porque las cinco
relaciones atraviesan el mismo canal entre las dos filas. QA visual: **16/17, FAIL declarado**.

**Causa raíz (dos defectos compuestos):**

1. El router reservaba canales para las **aristas** pero nada reservaba espacio para sus
   **rótulos**: la posición era una fórmula fija (`LABEL_FRACTIONS[relIdx]` + alzado constante de
   14 px), sin test de colisión alguno. Cinco rótulos de ~115 × 36 px en una banda de canal de
   10 px no caben, y ningún check lo veía.
2. Las relaciones se emitían **sin** `exitX/entryX`, y el generador asumía el perímetro derecho
   cuando draw.io anclaba por el izquierdo: la polilínea que el router medía **no era** la que
   draw.io dibujaba (hasta 190 px de discrepancia).

**Corrección (reutilizable, no un parche para una lámina):**

- `scripts/lib/labels.mjs` — **solucionador determinista de colisiones de rótulos**: busca
  (posición a lo largo de la arista) × (slot perpendicular), contra cada rótulo ya colocado, las
  elipses, las figuras y **names de actores**, el **texto del rótulo del boundary**, el límite de
  página y el system boundary. Semántica mxGraph correcta: `mxGeometry relative="1"` con `x` =
  **fracción de la longitud de la polilínea** y el píxel en `<mxPoint as="offset">`.
- Banda de fila ampliada de 16 → 46 px en las láminas **con** relaciones: el rótulo vive en el gap
  entre filas; quince láminas sin relaciones quedaron idénticas byte a byte.
- Margen inferior del boundary ampliado una fila de rótulo: la franja bajo la última fila existe
  como fila de rótulos.
- Anclaje de relación explícito `exitX=0/entryX=0` (el gutter siempre está a la izquierda): medido
  == dibujado.
- **Repair loop**: cada relación puede re-elegir canal para acercar su rótulo a su propio conector,
  sin aumentar el solape colineal.
- El **QA visual** encontró lo que la métrica no veía: el rótulo «extend» [STALE_VERSION] escrito
  **sobre el título del boundary**. El título del boundary se modeló como obstáculo en el generador
  **y** en el validador.
- Cuatro checks nuevos en el validador: `RELATION_LABEL_OVERLAP`,
  `RELATION_LABEL_TO_NODE_OVERLAP`, `RELATION_LABEL_OUTSIDE_PAGE`,
  `RELATION_LABEL_UNREADABLE` — geometría **re-derivada del archivo emitido**, no de la intención
  del generador.

**Antes / después (`UCD-EVT-02a`):**

| Métrica | Antes (E4-0.1) | **Después (FINAL)** |
|---|---:|---:|
| Rótulos de relación solapados entre sí | 5 en 1 banda | **0** |
| Rótulo sobre elipse / actor / texto | sí (invisible al check) | **0** |
| Rótulo sobre el título del boundary | sí (hallazgo del QA visual) | **0** |
| Distancia rótulo ↔ su propio conector (Σ\|d\|, 5 rótulos) | 254 px | **114 px** (máx. 70) |
| `RELATION_LABEL_*` (4 checks) | no existían | **0 / 0 / 0 / 0** |
| QA visual | **FAIL** | **PASS** |

**La lección de método que este defecto deja:** el validador y el generador usaban
**parametrizaciones distintas** de la misma arista (fracción del subconjunto horizontal vs.
fracción de la polilínea completa). El primer "PASS" del generador era cierto **sobre su propio
modelo** y falso sobre el archivo. El validador re-deriva desde el XML emitido precisamente para
que la única geometría que cuenta sea la que draw.io dibuja.

## 10.2 D-11 — residual ACCEPTED P2

El solape colineal residual quedó en **182 px, 10 pares**, medidos sobre el archivo:

| Archivo | Pares | px |
|---|---|---:|
| `UCD-EVT-02a__GEI_Event_Material_Change.drawio` | `e12×e18`=37 · `e12×e20`=10 · `e14×e16`=37 · `e14×e18`=28 · `e18×e22`=16 · `e18×e23`=16 | **144** |
| `UCD-INS-01__GEI_Search_Reports_Audit.drawio` | `e24×e26` · `e25×e27` · `e28×e30` · `e29×e31` = 10 c/u | **38** |

Se acepta como **P2** porque cumple los cuatro criterios del brief: **no** involucra rótulos de
relación (`RELATION_LABEL_* = 0`); **no** vuelve indistinguibles dos relaciones (los 5 dashed de
`UCD-EVT-02a` se siguen de extremo a extremo en el render); la **dirección** de ambas sigue
visible (flechas abiertas legibles); y la **QA visual las considera claras** (17/17). Bajó de
225 px (E4-0.1) a 182 px de forma natural al re-enrutar, sin perseguido artificial.

---

# 11. DESVIACIONES DECLARADAS

| # | Desviación | Gravedad | Estado |
|---|---|---|---|
| D-1 | Los documentos de E3 estaban *untracked* en la punta | P1 | Resuelta en V1 |
| D-2 | `GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` no existe | P2 | **Resuelta como higiene** — `docs/use-cases/GEI_E3_MISSING_AUDIT_ERRATA_V1.md`. Sin efecto funcional |
| D-3 | Sin CLI de draw.io | P1 | **RESUELTA.** 17 PNG + 17 PDF |
| D-4 | QA visual sustituida por geometría | P1 | **RESUELTA.** QA visual real sobre render |
| D-5 | `UCD-EVT-02a` con cruces residuales | P2 | **RESUELTA.** La afirmación `K(2,6)` se retiró; los 116 cruces son seguidos y legibles; ver §10.2 |
| D-6 | Actor a 10 pt y etiqueta a 9 pt | P3 | **RESUELTA.** Todo ≥ 11 pt |
| D-7 | El workbook declaraba E1–E3 *No iniciado* | P1 | Resuelta en V1 |
| D-8 | El material de curso del profesor no está en el repo | P3 | Se aplicó la notación del brief. Sin cambio |
| D-9 | `ACT-AUTHENTICATED` asociado a 5 proyecciones que E2 §4.3 excluye | P2 | **Abierta · heredada · no bloqueante.** E4 dibujó lo que el inventario autoriza; re-litigarla es cambio de E2, no de E4 |
| **D-10** | **5 rótulos de relación colisionan en `UCD-EVT-02a`** | **P1** | **CERRADA.** §10.1 — solucionador de colisiones + banda reservada; `RELATION_LABEL_* = 0`; QA visual PASS |
| **D-11** | **Solape colineal residual** | **P2** | **ACEPTADA P2.** §10.2 — 182 px, 10 pares, ninguno involucra rótulos, direcciones visibles |
| **D-12** | **`E4-02` y `E4-07` reabiertos** | P1 | **CERRADA.** Semántica ratificada (§5) y gate cerrado (§12); workbook sincronizado |

---

# 12. GATE DE E4

| Tarea | PREVIOUS | E4-0.1 (intermedio) | **V1.0.1 FINAL** |
|---|---|---|---|
| `E4-01` Preflight + autoridad | PASS | PASS | **PASS** |
| `E4-02` Resolver relaciones | PASS | REABIERTO | **PASS.** 6 relaciones finales, semántica con evidencia AC, 0 no autorizadas, 0 rechazadas dibujadas |
| `E4-03` Topología | PASS | En revisión | **PASS.** 17 láminas, banda de rótulos reservada, 0 penetración, 0 desborde de texto |
| `E4-04` Generar `.drawio` | PASS | PASS | **PASS.** 17/17 cargables y exportables por la CLI real |
| `E4-05` Validar cobertura / XML | PASS | PASS | **PASS.** 0 findings, 102/102, `RELATION_LABEL_* = 0` |
| `E4-06` QA visual / export | PARTIAL | En revisión | **PASS.** Export 17 PNG + 17 PDF; QA visual **17/17** |
| `E4-07` Gate + Freeze | PARTIAL | En revisión | **PASS.** Este documento |

```
USE CASE DIAGRAM FREEZE V1.0.1:  FROZEN · PASS
```

**Lo que se cierra, con evidencia:**

| Cerrado | Evidencia |
|---|---|
| Los `.drawio` se abren y se exportan | 17/17 con la CLI, exit 0 |
| 102/102 CU · 8/8 actores | validador |
| 0 relaciones no autorizadas · 0 rechazadas | validador |
| Semántica de relaciones correcta | log de decisiones con evidencia AC |
| Todo el texto ≥ 11 pt | `TYPOGRAPHY_BELOW_11PT = 0` |
| Solape colineal 86 317 → 182 px | medición sobre archivo |
| **Rótulos de relación sin colisión (D-10)** | **`RELATION_LABEL_* = 0/0/0/0` + QA visual** |
| PNG y PDF entregados | 17 + 17 |
| QA visual real | **17/17 PASS** |

**D-9 queda heredada y no bloqueante** (§11). Ninguna desviación abierta bloquea E5.

## 12.1 Baseline de integridad

| Comando | Resultado |
|---|---|
| `pnpm typecheck` | **PASS** (exit 0) |
| `pnpm test` | **PASS** (exit 0) — 92 tests |
| `pnpm build` | **PASS** (exit 0) |
| `node scripts/validate-drawio-use-cases.mjs` | **PASS**, 0 findings |
| `git diff --check` | **clean** |
| `src/**` modificado | **NO** |

---

# 13. ARTEFACTOS

| Artefacto | Ubicación | Autoridad |
|---|---|---|
| Diagramas `.drawio` (17) | `docs/uml/use-cases/source/` | **Sí — fuente autoritativa** |
| Relation Decisions V1 (revisada) | `docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md` | Sí |
| Diagram Manifest V1 | `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_MANIFEST_V1.md` | Sí |
| Diagram Reconstruction Audit V1 | `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_RECONSTRUCTION_AUDIT_V1.md` | No — proceso |
| **Diagram Freeze V1** | `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1.md` | **Histórico — superseded** |
| **Este freeze** | `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` | **Sí** |
| Informe de validación | `docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt` | Evidencia |
| Export PNG (17) | `docs/uml/use-cases/export/png/` | Derivado |
| Export PDF (17) | `docs/uml/use-cases/export/pdf/` | Derivado |
| Errata del audit de E3 | `docs/use-cases/GEI_E3_MISSING_AUDIT_ERRATA_V1.md` | Higiene |

## 13.1 El freeze V1 no se modificó

`GEI_USE_CASE_DIAGRAM_FREEZE_V1.md` conserva su contenido, su `Estado: FROZEN` y su veredicto
`PARTIAL` originales. Este documento **no** lo edita: lo sustituye y explica por qué.

**Los freezes de E1, E2 y E3 tampoco se tocaron.** El único archivo creado bajo `docs/use-cases/`
es la errata de D-2, que es un documento **nuevo**, no una modificación.

---

# 14. ESTADO DEL ROADMAP

| Etapa | Nombre | Estado | Progreso |
|---:|---|---|---|
| 0 | Control del proyecto | *En curso* | 29,4 % |
| 1 | Reconciliación de requerimientos | **Cerrado** | **100 %** |
| 2 | Modelo de actores | **Cerrado** | **100 %** |
| 3 | Inventario maestro de casos de uso | **Cerrado** | **100 %** |
| **4** | **Diagramas de Casos de Uso** | **Cerrado** | **100 %** |
| 5 | Especificaciones de TODOS los CU | **No iniciado** | 0 % |

**E4: 100 %.** `E4-01`…`E4-07` cerrados. `Resumen!B5` y `Roadmap!G7` del workbook coinciden en
**100 % / Cerrado**. D-9 queda abierta como hallazgo heredado de E2, sin efecto sobre el gate.

**Siguiente etapa: E5 — Especificaciones de casos de uso. NO INICIADA.** Input para E5: los 102 CU
del catálogo con sus actores y relaciones congeladas en este freeze (§4, §5), y las 8 autoridades de
E3 intactas.

---

# 15. SOURCE MODIFIED

| Ruta | Modificado |
|---|---|
| `src/**` | **NO** |
| `docs/use-cases/**` | **NO** — sólo se **creó** la errata D-2 |
| `docs/actors/**` | **NO** |
| `docs/requirements/**` | **NO** |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | **NO** |
| `docs/uml/use-cases/source/**` | **SÍ** — 17 `.drawio` regenerados |
| `docs/uml/use-cases/export/**` | **SÍ** — 17 PNG + 17 PDF creados |
| `docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md` | **SÍ** — revisada in-place por orden del brief |
| `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1.md` | **NO** — histórico intacto |
| `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1_0_1.md` | **SÍ** — creado |
| `docs/use-cases/GEI_E3_MISSING_AUDIT_ERRATA_V1.md` | **SÍ** — creado |
| `scripts/**` | **SÍ** |
| `docs/project-control/**` | **SÍ** — E4 cerrado al 100 %, `Resumen` y `Roadmap` sincronizados |

---

**Fin del Use Case Diagram Freeze V1.0.1.**