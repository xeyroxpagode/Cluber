# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE DIAGRAM FREEZE V1

**Etapa:** 4 — Diagramas de casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e4-use-case-diagrams-freeze-v1`
**Baseline de E3:** `730bf8ffee428666d24a588e23f23b457dc35123`
**Resultado del gate:** **PARTIAL** — ver §10

> Este documento contiene **verdad**, no proceso. El proceso, los errores propios y las
> desviaciones están en `GEI_USE_CASE_DIAGRAM_RECONSTRUCTION_AUDIT_V1.md`.

---

# 1. AUTORIDAD DE ENTRADA

| Documento | Rol en E4 |
|---|---|
| `docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` | **Autoridad del CU.** Define qué 102 CU existen |
| `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` | ID, nombre y actores primarios de cada CU. Fuente de los labels |
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` | **Autoridad de actores.** Los 8 actores y las 6 generalizaciones |
| `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` | Actores por CU y trazabilidad inversa |
| `docs/use-cases/GEI_USE_CASE_RELATION_CANDIDATES_V1.md` | Las 8 candidatas y los 9 rechazos. **E3 no congeló ninguna relación** |
| `docs/use-cases/GEI_USE_CASE_OPEN_DECISIONS_V1.md` | 2 decisiones abiertas, 0 bloqueantes. Ninguna dibujada |
| `docs/requirements/GEI_REQUIREMENTS_CATALOG_V1.md` | **Evidencia de semántica** para decidir las relaciones |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | Autoridad de producto. Sólo si resuelve semántica existente |
| `src/**` | **EVIDENCIA SECUNDARIA. NO es autoridad UML.** No se usó para derivar nada |

## 1.1 Lo que E4 cambió de las autoridades de entrada

| Cambio | Verificación |
|---|---|
| **0** CU creados | `UNKNOWN_UC = 0` |
| **0** CU eliminados | `MISSING = 0` |
| **0** CU renumerados | `RENAMED_ID = 0` |
| **0** CU renombrados | `RENAMED_ID = 0` |
| **0** actores creados | `UNKNOWN_ACTOR = 0` |
| **0** actores eliminados | Los 8 de E2 siguen siendo los 8 dibujados |
| **0** relaciones nuevas | `UNAUTHORIZED_NEW_RELATION = 0` |
| **0** generalizaciones nuevas | `NO_NEW_GENERALIZATION = 0` |

E4 **decidió** 50 relaciones que E3 dejó explícitamente sin congelar. No modificó ninguna de
las autoridades de entrada.

## 1.2 Una autoridad de E3 citada que no existe

`GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` es citado por el freeze de E3 pero no existe. No
afecta ninguna decisión de E4: el propio freeze lo clasifica *«No es autoridad»*. Registrado
como desviación D-2 en el audit.

---

# 2. FORMATO AUTORITATIVO

| Nivel | Formato | Rol |
|---|---|---|
| **1 — Fuente** | `.drawio` XML **no comprimido** de diagrams.net | **AUTORITATIVO. Editable.** |
| 2 — Entrega | PDF | Derivado. **No existe** (`EXPORT_BLOCKED_NO_DRAWIO_CLI`) |
| 3 — Preview | PNG | Derivado. **No existe** |

**Regla aplicada:** si un `.drawio` y un PDF contradicen algo, **manda el `.drawio`**. No se
trató ningún raster como fuente y no se metió ninguna imagen dentro de un `.drawio`.

## 2.1 Propiedades de los `.drawio` entregados

| Propiedad | Estado |
|---|---|
| XML bien formado | **17 / 17** |
| `<mxfile>` presente | 17 / 17 |
| `<diagram>` presente | 17 / 17 |
| `<mxGraphModel>` presente | 17 / 17 |
| IDs de `mxCell` únicos | **0 duplicados** |
| `parent` válidos | **0 rotas** |
| `source` / `target` válidos | **0 rotas** |
| Sin `NaN` / `Infinity` | **0 casos** |
| XML comprimido (base64) | **No** — XML legible y revisable en diff |
| Texto editable | Sí — `UC-ID` + nombre en cada elipse, sin rasterizar |
| Conectores editables | Sí — `mxCell edge="1"` con `<Array as="points">` |
| Diálogo de reparación de draw.io | **No debería aparecer** — el XML es válido y no comprimido |

## 2.2 Notación UML aplicada

| Elemento | Representación |
|---|---|
| Actor | `shape=umlActor` — figura stick UML, **fuera** del *system boundary* |
| Caso de uso | `ellipse` — elipse **dentro** del *system boundary* |
| System boundary | rectángulo rotulado `GEI Hockey Management System — <dominio>` |
| Asociación | línea **sólida**, **sin flecha** |
| Generalización | línea sólida + **triángulo hueco** (`endArrow=block;endFill=0`) |
| `<<include>>` | línea **discontinua** + flecha abierta, apuntando **al CU incluido** |
| `<<extend>>` | línea **discontinua** + flecha abierta, desde el CU que extiende **al CU base** |
| Condición de `<<extend>>` | `[CONDICION]` junto a la relación |
| Actor abstracto | `«abstract»` bajo el nombre |

**0 flechas decorativas.** **0 `database`, `API`, `frontend`, `server`, `worker`, tabla o
servicio interno** dibujados.

---

# 3. LISTA DE DIAMMAS

**17 archivos** en `docs/uml/use-cases/source/`. Detalle por lámina en
`GEI_USE_CASE_DIAGRAM_MANIFEST_V1.md` §2.

| # | Diagram ID | Archivo | CU | Actores |
|---:|---|---|---:|---:|
| 0 | `UCD-00` | `UCD-00__GEI_Use_Case_Map.drawio` | 0 | 8 |
| 1 | `UCD-IAM-01` | `UCD-IAM-01__GEI_Identity_Access.drawio` | 10 | 4 |
| 2 | `UCD-PPL-01` | `UCD-PPL-01__GEI_Person_Profile_Membership.drawio` | 8 | 3 |
| 3 | `UCD-PPL-02` | `UCD-PPL-02__GEI_Team_Roles_Representation.drawio` | 9 | 3 |
| 4 | `UCD-STR-01` | `UCD-STR-01__GEI_Season_Division_Line.drawio` | 8 | 1 |
| 5 | `UCD-STR-02` | `UCD-STR-02__GEI_Team_Venue.drawio` | 7 | 1 |
| 6 | `UCD-EVT-01` | `UCD-EVT-01__GEI_Event_Creation.drawio` | 6 | 2 |
| 7 | `UCD-EVT-02a` | `UCD-EVT-02a__GEI_Event_Material_Change.drawio` | 6 | 2 |
| 8 | `UCD-EVT-02b` | `UCD-EVT-02b__GEI_Event_State_Transitions.drawio` | 3 | 2 |
| 9 | `UCD-EVT-03` | `UCD-EVT-03__GEI_Event_Logistics_Queries.drawio` | 4 | 4 |
| 10 | `UCD-PRT-01` | `UCD-PRT-01__GEI_Availability_Selection_Attendance.drawio` | 7 | 3 |
| 11 | `UCD-PRT-02` | `UCD-PRT-02__GEI_Match_Result_Eligibility.drawio` | 6 | 4 |
| 12 | `UCD-COM-01` | `UCD-COM-01__GEI_Announcements.drawio` | 5 | 2 |
| 13 | `UCD-COM-02` | `UCD-COM-02__GEI_Conversations_Notifications.drawio` | 9 | 1 |
| 14 | `UCD-CMP-01` | `UCD-CMP-01__GEI_Competition_Lifecycle.drawio` | 5 | 3 |
| 15 | `UCD-CMP-02` | `UCD-CMP-02__GEI_Competition_Entries.drawio` | 4 | 2 |
| 16 | `UCD-INS-01` | `UCD-INS-01__GEI_Search_Reports_Audit.drawio` | 5 | 6 |

Las cifras de la columna «CU» son las **propias** de cada lámina. Las 10 copias de referencia
cross-dominio no se cuentan: son el mismo elemento del modelo.

## 3.1 `UCD-00` — qué es y qué no es

**Es** un mapa de cobertura: los 8 actores con sus generalizaciones, los 8 dominios como
packages con su cantidad de CU, y los `Diagram ID` que cubren cada dominio.

**NO es** un diagrama de casos de uso, y no contiene **ninguna** elipse de CU.

**0 *umbrella use cases*.** No existe «Gestionar club», «Gestionar eventos» ni «Administrar
sistema». La lámina lo declara: *«Mapa maestro de cobertura — no reemplaza los diagramas UML
detallados»*.

**Por qué no hay `UCD-X-01__Cross_Domain_Relations.drawio`.** El brief §24 lo permite *«sólo si
aporta claridad»*. Las 39 relaciones de `INC-01` se dibujaron **distribuidas** en las láminas de
sus propios dominios, con la copia de referencia de `UC-IAM-09`. Una lámina cross-domain
obligaría a repetir 39 CU y sería más ruido, no menos.

---

# 4. COBERTURA 102 / 102

| Métrica | Valor | Origen de la verdad |
|---|---:|---|
| CU canónicos en el catálogo de E3 | **102** | `GEI_MASTER_USE_CASE_CATALOG_V1.md` |
| CU únicos representados en los `.drawio` | **102** | parser de los `.drawio` |
| `MISSING` | **0** | id canónico sin ninguna elipse |
| `UNKNOWN_UC` | **0** | elipse cuyo ID no existe en el catálogo |
| `RENAMED_ID` | **0** | elipse cuyo nombre difiere del canónico |
| CU en la lámina de su propio dominio | **102 / 102** | prefijo del `Diagram ID` |
| Repeticiones como referencia cross-dominio | 10 | mismo ID + mismo nombre |

## 4.1 Cobertura por dominio

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
| `SYS` | **0 / 0** | — E3 §12.1: `SYS = 0` |
| **TOTAL** | **102 / 102** | **16 láminas de detalle** |

## 4.2 Las 10 repeticiones y por qué no son CU nuevos

| CU | Láminas donde se repite | Razón |
|---|---|---|
| `UC-IAM-09` | `UCD-PPL-01`, `UCD-PPL-02`, `UCD-STR-01`, `UCD-STR-02`, `UCD-CMP-01`, `UCD-CMP-02`, `UCD-PRT-02` | 39 CU lo incluyen vía `INC-01` |
| `UC-EVT-11` | `UCD-EVT-03` | `UC-EVT-16` lo incluye vía `INC-02` |

Mismo ID, mismo nombre, **mismo elemento del modelo**. El validador lo garantiza: si un nombre
difiere del canónico, salta `RENAMED_ID`, y el resultado es 0.

---

# 5. ACTORES UTILIZADOS

**8 de 8** del catálogo E2. **0 actores fuera del catálogo.**

| Actor | Tipo E2 | Aparece en |
|---|---|---|
| `ACT-AUTHENTICATED` | `ABSTRACT_ACTOR` | `UCD-IAM-01`, `UCD-PPL-01`, `UCD-EVT-03`, `UCD-COM-01`, `UCD-COM-02`, `UCD-INS-01`, `UCD-00` |
| `ACT-UNAUTHENTICATED` | `HUMAN_ROLE` | `UCD-IAM-01`, `UCD-00` |
| `ACT-ADMIN` | `HUMAN_ROLE` | `UCD-IAM-01`, `UCD-PPL-01`, `UCD-PPL-02`, `UCD-STR-01`, `UCD-STR-02`, `UCD-PRT-02`, `UCD-CMP-01`, `UCD-CMP-02`, `UCD-INS-01`, `UCD-00` |
| `ACT-SUBCOMMITTEE` | `HUMAN_ROLE` | `UCD-IAM-01`, `UCD-EVT-01`, `UCD-EVT-02a`, `UCD-EVT-02b`, `UCD-EVT-03`, `UCD-COM-01`, `UCD-PRT-02`, `UCD-CMP-01`, `UCD-CMP-02`, `UCD-INS-01`, `UCD-00` |
| `ACT-COACH` | `HUMAN_ROLE` | `UCD-EVT-01`, `UCD-EVT-02a`, `UCD-EVT-02b`, `UCD-EVT-03`, `UCD-PRT-01`, `UCD-PRT-02`, `UCD-CMP-01`, `UCD-INS-01`, `UCD-00` |
| `ACT-CAPTAIN` | `HUMAN_ROLE` | `UCD-EVT-03`, `UCD-PRT-02`, `UCD-INS-01`, `UCD-00` |
| `ACT-PLAYER` | `HUMAN_ROLE` | `UCD-PPL-01`, `UCD-PPL-02`, `UCD-PRT-01`, `UCD-INS-01`, `UCD-00` |
| `ACT-GUARDIAN` | `DELEGATED_HUMAN` | `UCD-PPL-02`, `UCD-PRT-01`, `UCD-00` |

**`ACT-CAPTAIN` tiene 0 CU como iniciador único** y aparece como *alterno autorizado* en
`UC-EVT-16`, `UC-PRT-11`, `UC-INS-02` y `UC-INS-03`. Es exactamente lo que E3 §5.2 Chávez y
E2 §11.3 concluyeron.

## 5.1 `ACT-UNAUTHENTICATED` no hereda de nada

Se dibuja en `UCD-IAM-01` y `UCD-00` **sin ninguna generalización** entrando ni saliendo.
E2 §12.1 rechaza explícitamente `ACT-UNAUTHENTICATED` como child de cualquier actor.

## 5.2 `ACT-AUTHENTICATED` es abstracto y no concede autoridad

Se dibuja con la marca `«abstract»` y con sus 6 generalizaciones de E2 §11.1 cuando hay un rol
concreto en la misma lámina. Asociado a sus **6 capacidades propias**
(`UC-IAM-06/07/08/10`, `UC-PPL-16/17` — exactamente E2 §4.1) y a las **5 proyecciones**
(`UC-EVT-17/18/19`, `UC-INS-01/04`), respaldado por la matriz de E3, que las declara *«todos los
concretos»*. **No** asociado a ninguna gestión de dominio.

> **Decisión discutible, declarada.** E2 §4.3 excluye del abstracto las proyecciones. E3 §5.1 y
> la matriz las asocian a `ACT-AUTHENTICATED` con participantes *«todos los concretos»*. E4
> siguió a E3 por ser la autoridad más reciente y más específica, y se apoyó en que las 6
> generalizaciones hacen que cada rol concreto sea participante por herencia. Razonamiento y
> Reversión alternativa en el audit §11.1.

## 5.3 Generalizaciones dibujadas

Sólo las **6** de E2 §11.1. **0 nuevas.**

| Child | Parent | Ocurencias en el conjunto de láminas |
|---|---|---:|
| `ACT-PLAYER` | `ACT-AUTHENTICATED` | 3 |
| `ACT-CAPTAIN` | `ACT-AUTHENTICATED` | 4 |
| `ACT-COACH` | `ACT-AUTHENTICATED` | 5 |
| `ACT-SUBCOMMITTEE` | `ACT-AUTHENTICATED` | 5 |
| `ACT-ADMIN` | `ACT-AUTHENTICATED` | 6 |
| `ACT-GUARDIAN` | `ACT-AUTHENTICATED` | 3 |
| | **Total** | **19 aristas · 6 pares únicos** |

**Regla de dibujado (decisión E4).** La generalización se dibuja en una lámina **sólo si al
menos un actor concreto aparece en ella con sus propias asociaciones**. Si el único actor de la
lámina es el abstracto (`UCD-COM-02`), se dibuja el abstracto solo, sin ramificaciones: seis
generalizaciones sin purpose serían decoración. La jerarquía completa está en `UCD-00`.

## 5.4 Prohibiciones verificadas

| Relación prohibida | Por quién | Estado |
|---|---|---|
| `ACT-CAPTAIN` → `ACT-PLAYER` | E2 §12.1; PT §5 | **No dibujada** |
| `ACT-CAPTAIN` → `ACT-COACH` | E2 §12.1; PT §5 *«CAPTAIN no hereda poder de Coach»* | **No dibujada** |
| `ACT-ADMIN` → `ACT-COACH` | E2 §12.1 | **No dibujada** |
| `ACT-ADMIN` → `ACT-PLAYER` | E2 §12.1 | **No dibujada** |
| `ACT-GUARDIAN` → `ACT-PLAYER` | E2 §12.1 | **No dibujada** |
| `ACT-SUBCOMMITTEE` → `ACT-COACH` | E2 §12.1; PT §5 | **No dibujada** |
| `ACT-UNAUTHENTICATED` → cualquiera | E2 §12.1 | **No dibujada** |
| `CoachAdmin`, `PlayerCaptain`, `CoachGuardian` | §15 | **No existen** |

**`ACT-CAPTAIN` es independiente.** Sin flecha hacia `PLAYER` ni hacia `COACH`.

---

# 6. RELACIONES ACEPTADAS

**50 relaciones**, todas derivadas de las 8 candidatas de E3. Detalle completo con evidencia en
`GEI_USE_CASE_RELATION_DECISIONS_V1.md`.

## 6.1 `<<include>>` — 44 aristas

| Candidata | Tipo final | Aristas | Condición | Condición dibujada |
|---|---|---:|---|---|
| `INC-01` | **INCLUDE** | **39** | Sin reautenticación vigente | No etiquetada (es un `include`, la condición es del REQ, no del `extend`) |
| `INC-02` | **INCLUDE** | **5** | Cambio material (`REQ-EVT-011`) | `[MATERIAL_CHANGE]` |

| `INC-02` — arista | Base | Significado |
|---|---|---|
| 1 | `UC-EVT-04` → `UC-EVT-11` | Editar un evento exige revisar el impacto |
| 2 | `UC-EVT-05` → `UC-EVT-11` | Posponer es cambio material (`REQ-EVT-011` lo nombra) |
| 3 | `UC-EVT-07` → `UC-EVT-11` | Cancelar es cambio material (`REQ-EVT-011` lo nombra) |
| 4 | `UC-EVT-08` → `UC-EVT-11` | Restaurar es cambio material (`REQ-EVT-011` lo nombra) |
| 5 | `UC-EVT-16` → `UC-EVT-11` | `REQ-EVT-019`: *«los cambios de logística son materiales»* |

Los 14 CU de `EVT` restantes **no** llevan arista, cada uno excluido por la misma lista cerrada
de `REQ-EVT-011`.

## 6.2 `<<extend>>` — 6 aristas

| Candidata | Extensor → Base | Condición dibujada |
|---|---|---|
| `EXT-01` | `UC-EVT-12` → `UC-EVT-04` | `[STALE_VERSION]` |
| `EXT-02` | `UC-PRT-07` → `UC-PRT-05` | `[SHEET_CLOSED]` |
| `EXT-02` | `UC-PRT-07` → `UC-PRT-06` | `[SHEET_CLOSED]` |
| `EXT-03` | `UC-PRT-10` → `UC-PRT-09` | `[RESULT_FINAL]` |
| `EXT-04` | `UC-PRT-04` → `UC-PRT-02` | `[DERIVED_CONFLICTS]` |
| `EXT-04` | `UC-PRT-04` → `UC-PRT-03` | `[DERIVED_CONFLICTS]` |

**Dirección comprobada:** la flecha va **del CU que extiende al CU base**. `<<extend>>` sin
condición visible: **0**.

## 6.3 Candidatas reclasificadas a `SIBLING` — 0 aristas

| Candidata | Par | Veredicto | Razón |
|---|---|---|---|
| `EXT-05` | `UC-COM-13` / `UC-COM-14` | **SIBLING** | `REQ-COM-018` GOAL habla de la lista; el AC *«sin abandonar la lista»* es restricción de superficie. `UC-COM-14` tiene goal, trigger y outcome propios |
| `EXT-06` | `UC-PPL-06` / `UC-PPL-02` | **SIBLING** | `REQ-PPL-002` AC 1: incorporar **rechaza** con `PLAYER_PROFILE_INCOMPLETE`. No lo incorpora ni lo extiende. `UC-PPL-02` se inicia sin condición de incorporación |

Ambas se dibujan como **dos CU independientes con el mismo actor y ninguna línea entre ellos**.

---

# 7. RELACIONES RECHAZADAS

**9 de 9 rechazadas por E3 siguen sin dibujarse.** `REJECTED_RELATION_DRAWN = 0`.

| ID | Relación | Por qué no se dibuja |
|---|---|---|
| `REJ-01` | «Autenticar usuario» como `include` de todo | `REQ-IAM-012` lo hace **precondición**. E4 no dibujó ninguna arista global |
| `REJ-02` | `UC-IAM-01` como `include` de todo | Es un CU hermano. **0 aristas apuntan a `UC-IAM-01`** en todo el modelo |
| `REJ-03` | Disponibilidad `include` en asistencia | `REQ-PRT-018`: no se derivan entre sí |
| `REJ-04` | Habilitación `include` en publicar convocatoria | `REQ-PRT-006`: publica igual |
| `REJ-05` | «Solicitar reconfirmación» como `extend` | El comando no existe; el estado es derivado |
| `REJ-06` | Archivar estructura `include` en archivar equipo | `REQ-STR-006` es una valla |
| `REJ-07` | Historial `include` en las correcciones | La corrección produce historia |
| `REJ-08` | Consultar comunicado `include` en publicarlo | Actores y objetivos distintos |
| `REJ-09` | Archivar conversación `include` en enviar | Objetivo independiente |

Las nueve se verifican **por pareja concreta**, en ambas direcciones. Además se verificó que
`EXT-04` (`UC-PRT-04` → `UC-PRT-03`) y `REJ-04` (`UC-PRT-13` → `UC-PRT-03`) no se contradicen:
son parejas distintas.

---

# 7.1 RELACIONES DIFERIDAS A E5

**0.** Ninguna decisión de E4 depende de semántica que E5 deba fijar.

Dos asuntos que E5 debe **confirmar** — ninguno bloqueante, ninguno un `DEFER`:

| # | Asunto | Efecto si E5 ajusta |
|---|---|---|
| V-1 | El perímetro de `INC-01`: E3 enumeró 39 CU base; la matriz de trazabilidad sólo enlaza `REQ-IAM-009` con `UC-IAM-09` | Se ajustan aristas. **Ningún CU, actor ni nombre cambia** |
| V-2 | Si `REQ-EVT-012` se limita a la edición de campos o cubre toda la clase «cambio material» | Se ajustan 4 aristas de `INC-02`. **Ningún CU cambia** |

En ambos casos el **tipo** de la relación está congelado por E4 con evidencia de AC.

---

# 8. REGLAS VISUALES APLICADAS

| Regla | Valor | brief |
|---|---|---|
| Fondo | Blanco | §28 |
| Elipses | Blanco, borde `#1A1A1A`, 1,5 px | §28 |
| System boundary | Rectángulo, borde `#1A1A1A`, 2 px, rótulo arriba a la izquierda | §25 |
| Actores | `shape=umlActor`, relleno `#1A1A1A` | §7 |
| Líneas | `#1A1A1A`; asociación 1,1 px · relación 1,2 px | §28 |
| Rompe | `dashPattern=8 5` | §7 |
| Colores semánticos | **Ninguno.** Un solo tono de gris para las copias de referencia | §28 |
| Gradientes / sombras | **0** | §28 |
| Iconos de producto | **0** | §28 |
| Tipografía | **Helvetica** en todo. Sin dependencia de fuente externa | §28 |
| Tamaño de página | A4 landscape `1169 × 827`, `page=1` | §29 |
| Tamaño del texto del CU | **11 pt** | §29 |
| Título | **15 pt** | §29 (pide 14–18) |
| Actor | 10 pt | §29 — desviación menor declarada |
| Etiqueta de relación | 9 pt | §29 — desviación menor declarada |
|*Alineación* | Cuadrícula de columnas y filas con paso fijo; los actores se alinean al centro del bloque de sus CU | §30 |
| *Espaciado* | Gutter horizontal de 32 px entre columnas, 16 px entre filas | §30 |
| *Proximidad* | Las relaciones están agrupadas con el CU que las origina | §30 |
| Cajas decorativas | **0**. Alineación y espaciado en lugar de marcos | §30 |
| Ortogonalidad | Las asociaciones van por *bus* vertical por actor; las relaciones por canales *gutter* | §30 |
| Paredes de texto | **0 penetraciones** en las 16 láminas | §30 |

## 8.1 Etiquetas de los casos de uso (§27)

Cada elipse lleva **exactamente dos cosas**: el `UC-ID` y el nombre humano.

```
UC-EVT-11
Revisar el impacto de un cambio material
```

**No** se metió ningún REQ ID, ninguna fórmula de authority, ningún scope, ninguna
precondición, ningún criterio de aceptación. Eso pertenece al catálogo y a la especificación de
E5.

## 8.2 Los 6 textos auxiliares de las 16 láminas

| Texto | Dónde | Por qué existe |
|---|---|---|
| «UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo.» | 7 láminas con referencia | §23 exige que una repetición sea declarada |
| «UC-EVT-11 se dibuja también en UCD-EVT-02a: mismo elemento del modelo.» | `UCD-EVT-03` | Ídem |
| «UC-COM-13 y UC-COM-14 son CU hermanos: no media relación include ni extend entre ellos.» | `UCD-COM-02` | Hace visible la decisión `EXT-05` |
| «Mapa maestro de cobertura — no reemplaza los diagramas UML detallados.» | `UCD-00` | §22 |

**0 párrafos. 0 muros de texto.** Lo máximo son 2 líneas.

---

# 9. RESULTADO DE LA VALIDACIÓN

`node scripts/validate-drawio-use-cases.mjs` → **PASS, 0 findings.**
Informe: `docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt`

| Check | Resultado |
|---|---|
| `CANONICAL_UC` | **102** |
| `UNIQUE_UC_IN_PRIMARY_DIAGRAMS` | **102** |
| `MISSING` | **0** |
| `UNKNOWN_UC` | **0** |
| `RENAMED_ID` | **0** |
| `UC_NOT_IN_OWNER_DOMAIN_DIAGRAM` | **0** |
| `UNKNOWN_ACTOR` | **0** |
| Actores E2 representados | **8 / 8** |
| `ACTOR_INSIDE_BOUNDARY` | **0** |
| `UC_OUTSIDE_BOUNDARY` | **0** |
| `UC_WITHOUT_ACTOR_ASSOCIATION` | **0** |
| `NO_NEW_GENERALIZATION` | **0** |
| `FORBIDDEN_GENERALIZATION` | **0** |
| `UNKNOWN_RELATION_ENDPOINT` | **0** |
| `UNAUTHORIZED_NEW_RELATION` | **0** |
| `REJECTED_RELATION_DRAWN` | **0** |
| `APPROVED_RELATION_NOT_DRAWN` | **0** |
| `EXTEND_WITHOUT_CONDITION` | **0** |
| `STEREOTYPE_LABEL_MISSING` | **0** |
| `ASSOCIATION_MUST_HAVE_NO_ARROW` | **0** |
| `MALFORMED_XML` | **0** |
| `DUPLICATE_CELL_ID` | **0** |
| `BROKEN_PARENT_REF` | **0** |
| `BROKEN_EDGE_ENDPOINT` | **0** |
| `ELEMENT_OFF_PAGE` | **0** |
| `NON_FINITE_GEOMETRY` | **0** |
| `SYSTEM_BOUNDARY_MISSING` | **0** |
| Penetración de conector | **0 en las 16** |
| Texto desbordado de la elipse | **0 en las 16** |

## 9.1 Baseline de integridad re-verificado al cierre

| Comando | Resultado |
|---|---|
| `pnpm typecheck` | **PASS** (exit 0) |
| `pnpm test` | **PASS** (exit 0) — 4 archivos, 92 tests |
| `pnpm build` | **PASS** (exit 0) |
| `git diff --check` | limpio |
| `src/**` modificado | **NO** |

---

# 10. RESULTADO DEL EXPORT Y DEL GATE

## 10.1 Export

| Campo | Valor |
|---|---|
| draw.io CLI encontrado | **NO** |
| PNG exportados | **0** |
| PDF exportados | **0** |
| Estado | **`EXPORT_BLOCKED_NO_DRAWIO_CLI`** |

No se instaló software y **no se falsificaron exports**. Los `.drawio` no comprimidos son el
entregable autoritativo y se abren sin instalación en <https://app.diagrams.net>.

## 10.2 Gate de E4

| Tarea | Resultado | Evidencia |
|---|---|---|
| `E4-01` Preflight + autoridad | **PASS** | Baseline `730bf8f` verificado · typecheck/test/build PASS · 0 cambios en `src/**` |
| `E4-02` Resolver relaciones | **PASS** | 8/8 decididas · 0 `UNDECIDED` · 0 `DEFER` · 0 nuevas · `REJECTED_RELATION_DRAWN=0` |
| `E4-03` Topología de diagramas | **PASS** | 16 + 1 láminas · división por co-localización de relaciones y densidad · 0 CU inventado |
| `E4-04` Generar Draw.io | **PASS** | 17 `.drawio` · XML válido · sin comprimir · editables |
| `E4-05` Validar cobertura / XML | **PASS** | 102/102 · 0 findings |
| `E4-06` QA visual / export | **PARTIAL** | Sin render: `EXPORT_BLOCKED_NO_DRAWIO_CLI`. QA **geométrica** PASS: 0 penetración, 0 desbordes, 0 fuera de página |
| `E4-07` Gate + Freeze | **PARTIAL** | Este freeze emitido con las desviaciones de §11 declaradas |

## 10.3 Veredicto

```
USE CASE DIAGRAM FREEZE V1:  PARTIAL
```

**Por qué no PASS.** Dos razones concretas, ninguna es un defecto del modelo.

1. **No hubo QA visual renderizada.** El brief §40 exige *«revisar visualmente CADA diagrama»* y
   §41 define cinco tests que sólo tienen sentido sobre un render. El brief §40 también dice
   *«No aceptar "XML válido" como sinónimo de "diagrama legible"»*. Sin render, no se puede
   afirmar que las láminas sean legibles. Se hizo análisis geométrico, que es un sustituto
   parcial y así se declara.
2. **`UCD-EVT-02a` conserva 19 cruces residuales.** No es evitable: `ACT-COACH` y
   `ACT-SUBCOMMITTEE` tienen participación idéntica en los 19 CU de `EVT`, y con ambos actores
   fuera del *system boundary* ese grafo no es planar. Mitigado con **0 penetración** y con el
   óptimo del modelo de routing, y **no** se puede dividir sin romper la co-localización de las
   5 relaciones.

**Por qué no FAIL.** Todo lo que es verificable en esta máquina pasó: 102/102 CU, 8/8 actores,
0 relaciones no autorizadas, 0 rechazadas dibujadas, 0 generalizaciones nuevas, 17/17 XML
válidos, 0 texto cortado, 0 elementos fuera de página, 0 actores dentro del boundary, 0 CU
fuera. El único ítem no ejecutable depende de una herramienta ausente, no de un defecto del
modelo.

## 10.4 Cómo se cierra el PARTIAL

| # | Acción | Responsable |
|---|---|---|
| 1 | Abrir los 17 `.drawio` en <https://app.diagrams.net> | Revisor |
| 2 | Ejecutar §40 (revisión visual) y §41 (5 tests) sobre el render | Revisor |
| 3 | Exportar a PDF y PNG con la CLI de draw.io | Revisor |
| 4 | Si algo falla: corregir el `.drawio` **a mano** — el `.drawio` es la fuente autoritativa | Revisor |
| 5 | Cambiar `E4-06` y `E4-07` a `Cerrado` en el `Backlog` | Revisor |

Nada de esto cambia el modelo: son verificificaciones de una entrega ya válida.

---

# 11. DESVIACIONES DECLARADAS

| # | Desviación | Gravedad | Estado |
|---|---|---|---|
| D-1 | Los 6 documentos de E3 estaban untracked en la punta verificada | P1 | Resuelta: commitados sin modificar bytes |
| D-2 | `GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` no existe pese a ser citado por E3 | P2 | **No resuelta.** No es autoridad; E4 no puede escribirla |
| D-3 | Sin CLI de draw.io ⇒ sin PDF, sin PNG | **P1** | **No resuelta.** `EXPORT_BLOCKED_NO_DRAWIO_CLI` |
| D-4 | La QA de §40/§41 se sustituyó por análisis geométrico | **P1** | **No resuelta.** Declarado, no disfrazado de PASS |
| D-5 | `UCD-EVT-02a` tiene 19 cruces residuales | P2 | Mitigada: 0 penetración, óptimo del modelo, división imposible |
| D-6 | Actor a 10 pt y etiqueta de relación a 9 pt | P3 | Mitigada: no caben a 11 pt en A4 |
| D-7 | El workbook declaraba E1–E3 como *No iniciado* | P1 | Resuelta y registrada en `DEC-005` |
| D-8 | El material de curso del profesor no existe en el repo | P3 | Se aplicó la notación UML del brief §7 |
| D-9 | `ACT-AUTHENTICATED` asociado a 5 proyecciones que E2 §4.3 excluye del abstracto | P2 | Decisión argumentada y con reversión definida (audit §11.1) |

## 11.1 D-8 — el material académico del profesor no está

El `Backlog` de referencia `ART-006` apunta a `Diagrama de Casos de Uso (1).pdf` y el registro
de artefactos lo lista como material de las Etapas 3–5. **Ese PDF no existe en el repositorio**
(`ART-007`, `ART-008` y `ART-009` tampoco).

Se aplicó la notación académica que el brief §7 enuncia explícitamente: actor fuera del
sistema, elipse dentro, *system boundary* rotulado, asociación como línea sólida sin flecha,
generalización con triángulo hueco, `<<include>>` y `<<extend>>` como línea discontinua con
flecha abierta en la dirección correcta, sin flechas decorativas.

**Consecuencia:** si el material del profesor impose una convención concreta (por ejemplo, el
actor como rectángulo con nombre, o la condición del `extend` dentro de la elipse del extensor),
E4 puede no coincidir al 100 %. Se deja constancia para que la revisión lo detecte.

---

# 12. QUÉ ALIMENTA E5

| E5 recibe de E4 | E5 **NO** debe tomar de E4 |
|---|---|
| Los **102 CU** con el `Diagram ID` de su lámina, para poder referenciarlos | Que la **topología de láminas** sea una decisión de E5. E5 no redibuja |
| Las **50 relaciones** con tipo, dirección y condición visible | **Regenerar** los `.drawio` al formalizar las especificaciones |
| Las **2 candidatas reclasificadas a `SIBLING`** (`EXT-05`, `EXT-06`) con su evidencia, para no re-litigarlas | Que `UC-COM-14` o `UC-PPL-02` sean sub-pasos de nada |
| Los **0 `DEFER`** y las **2 validaciones** V-1 / V-2, que son lo único pendiente | Que haya semántica sin decidir |
| Los **8 actores** con sus 6 generalizaciones, como UML cerrado | **Nuevos** actores ni nuevas generalizaciones |
| La regla de que cada CU tiene ≥1 actor, directo o heredado por el abstracto | Que esa regla se relaje al redactar la especificación |
| El **perímetro de 39** aristas de `INC-01` tal como E3 lo enumeró | Que el perímetro esté cerrado por evidencia CU por CU — **no lo está** (§7.1) |
| Las **2 decisiones abiertas de E3** (`UC-DECISION-01`, `UC-DECISION-02`), que E4 **no** dibujó | Que E4 las haya creado o resuelto |

## 12.1 Qué E4 deja deliberadamente sin hacer

| No hecho | Razón |
|---|---|
| Especificaciones de CU | Etapa 5 |
| Caminos felices / alternativos | Etapa 5 |
| Diagramas de actividad | Etapa 7 (no 5, no 4) |
| Diagramas de estado | **Etapa 6** — confirmado por el propio workbook, fila 6 |
| Diagramas de clases | Etapa 8 |
| IA y entry points | Etapa 10 |
| Pantallas y contratos | Etapas 11–12 |
| Backend, base de datos, endpoints | Etapas 15–16 |
| `UC-DECISION-01`, `UC-DECISION-02` | No existen como CU canónicos. **No dibujados** (brief §43) |

**Nota sobre la numeración.** El freeze de E3 §3.2 lista *«Diagramas de estado y máquinas de
estado | Etapa 4»*. El workbook canónico dice **Etapa 6** (`Roadmap` fila 6: *«Diagramas de
estados»*) y la hoja `Dependencias` lo confirma (`DEP-006`: E5 → E6 *«Diagramas de estados»*).
Es una discrepancia de numeración de E3. **E4 trata la autoridad del roadmap como correcta y no
creó diagramas de estado.**

---

# 13. ARTEFACTOS REGISTRADOS

| Artefacto | Ubicación | Autoridad | Gate |
|---|---|---|---|
| `ART-010` Diagramas `.drawio` (17) | `docs/uml/use-cases/source/` | **Sí — fuente autoritativa** | Etapa 4 |
| `ART-011` Relation Decisions V1 | `docs/uml/use-cases/GEI_USE_CASE_RELATION_DECISIONS_V1.md` | Sí | Etapa 4 |
| `ART-012` Diagram Manifest V1 | `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_MANIFEST_V1.md` | Sí | Etapa 4 |
| `ART-013` Diagram Reconstruction Audit V1 | `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_RECONSTRUCTION_AUDIT_V1.md` | No — proceso | Etapa 4 |
| `ART-014` Diagram Freeze V1 | `docs/uml/use-cases/GEI_USE_CASE_DIAGRAM_FREEZE_V1.md` | Sí | Etapa 4 |
| `ART-015` Informe de validación | `docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt` | Evidencia | Etapa 4 |
| `ART-016` Exports PDF/PNG | `docs/uml/use-cases/export/` | Derivado de `ART-010` | **Bloqueado** |

Registrados en la hoja `Artefactos` del workbook como `ART-010` … `ART-016`.

## 13.1 Artefactos técnicos de la validación

| Archivo | Rol |
|---|---|
| `scripts/validate-drawio-use-cases.mjs` | Validador re-ejecutable. Sin dependencias externas |
| `scripts/generate-use-case-diagrams.mjs` | Genera las 16 láminas |
| `scripts/generate-use-case-map.mjs` | Genera `UCD-00` |
| `scripts/update-project-workbook.mjs` | Actualización del workbook, con guarda de idempotencia |
| `scripts/validate-project-workbook.mjs` | Verifica que el workbook conserva estilos, fórmulas, validaciones y gráfico |
| `scripts/lib/` | Lectura del catálogo de E3, geometría, router y decisiones de relación |

**El generador no es autoridad.** Si un `.drawio` editado a mano difiere del generador, **manda
el `.drawio`**.

---

# 14. ESTADO DEL ROADMAP

| Etapa | Nombre | Estado | Progreso |
|---:|---|---|---:|
| 0 | Control del proyecto | *En curso* | 29,4 % |
| 1 | Reconciliación de requerimientos | **Cerrado** | **100 %** |
| 2 | Modelo de actores | **Cerrado** | **100 %** |
| 3 | Inventario maestro de casos de uso | **Cerrado** | **100 %** |
| **4** | **Diagramas de Casos de Uso** | **Cerrado** | **85,7 %** (6 de 7 tareas; `E4-06` en revisión) |
| **5** | **Especificaciones de TODOS los CU** | **No iniciado** | 0 % |

**Siguiente etapa: E5 — Especificaciones de TODOS los casos de uso.**

`E4-06` queda *En revisión* y no *Cerrado* porque su criterio de cierre exige render y export.
`E4-07` queda *Cerrado* porque el freeze se emitió; su nota de cierre registra explícitamente
que el gate es PARTIAL y por qué.

## 14.1 Workbook

| Campo | Valor |
|---|---|
| Ruta canónica | `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` |
| Ruta anterior | `docs/GEI_Roadmap_Maestro_Proyecto.xlsx` |
| Caso aplicado | **A** |
| SHA256 antes | `4EA3C62123B29FF7AD05371B2C09CF9526BD9078B3DB269EC9DA5FB311296596` |
| SHA256 en el momento del movido | idéntico — **bytes preservados** |
| Actualizado | **Sí** — 44 mutaciones de celda y 2 de rango |
| Preservado | 9 hojas · `styles.xml` 32 081 bytes · 2 tablas · 1 gráfico · 1 dibujo · **19 de 24 partes del paquete byte-idénticas** |
| Validaciones | `E3:E33`, `F3:F33`, `H3:H33` (Backlog) · `F3:F23`, `G3:G23` (Roadmap) — **extendidas, no rotas** |
| Formato condicional | 5 `cfRule` — extendidas de fila 26 a fila 33 |
| Fórmulas | 10 (Resumen) · 21 (Roadmap) · 3 (Control) — **todas intactas** |
| Valores en caché | Recalculados para que el libro muestre la verdad antes de recalcular |

---

# 15. SOURCE MODIFIED

| Ruta | Modificado |
|---|---|
| `src/**` | **NO** |
| `docs/use-cases/**` | **NO** |
| `docs/actors/**` | **NO** |
| `docs/requirements/**` | **NO** |
| `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` | **NO** |
| `docs/uml/use-cases/**` | **SÍ** — creado |
| `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` | **SÍ** — movido y actualizado |
| `scripts/**` | **SÍ** — creado |

```
SOURCE MODIFIED: NO
```

Este lote no tocó `src/**` ni ninguna autoridad de E1, E2 o E3.

---

**Fin del Use Case Diagram Freeze V1.**
