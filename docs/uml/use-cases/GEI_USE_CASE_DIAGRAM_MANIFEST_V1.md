# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE DIAGRAM MANIFEST V1

**Etapa:** 4 — Diagramas de casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e4-use-case-diagrams-freeze-v1`
**Formato autoritativo:** `.drawio` (XML editable de diagrams.net) bajo `docs/uml/use-cases/source/`

> Este manifiesto se genera desde los `.drawio` reales. No es una descripción de intenciones:
> cada fila refleja lo que está dibujado y lo que el validador comprobó.

---

# 1. CONVENCIÓN DE IDENTIFICADORES (decisión E4)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Diagrama de detalle | `UCD-<DOMINIO>-<NN>` | `UCD-EVT-02a` |
| Diagrama maestro | `UCD-00` | `UCD-00__GEI_Use_Case_Map.drawio` |
| Caso de uso | `UC-<DOMINIO>-<NN>` | `UC-EVT-11` |
| Actor | `ACT-<ROL>` | `ACT-CAPTAIN` |

**Decisión registrada.** El ID de diagrama **nunca** coincide con un ID de caso de uso. `UCD-EVT-02a`
es una lámina; `UC-EVT-02` es un caso de uso. La comparación cruzada de los dos espacios de
nombres la hace el validador, que comprueba que todo `UC-…` dibujado existe en el catálogo y que
todo `UCD-…` no se confunde con un CU.

**Variante `a`/`b`.** Se usa cuando un dominio necesita más de dos láminas y la división no es
un simple par. `UCD-EVT-02a` y `UCD-EVT-02b` existen por una razón verificable: las 5 relaciones
de `EVT` (`INC-02` ×4 y `EXT-01`) obligan a que `UC-EVT-04`, `UC-EVT-05`, `UC-EVT-07`,
`UC-EVT-08`, `UC-EVT-11` y `UC-EVT-12` estén **en la misma lámina**; una relación cuyo extremo
no aparece en la lámina no se puede dibujar. `UC-EVT-06`, `UC-EVT-09` y `UC-EVT-10` no participan
en ninguna relación, por lo que se van a `UCD-EVT-02b` y las 4 aristas `<<include>>` quedan
juntas y legibles.

---

# 2. INVENTARIO DE DIAGRAMAS

## 2.1 Mapa maestro

| Campo | Valor |
|---|---|
| **Diagram ID** | `UCD-00` |
| **Filename** | `UCD-00__GEI_Use_Case_Map.drawio` |
| **Dominio / cluster** | Mapa transversal — los 8 dominios |
| **Propósito** | Mapa de cobertura: actores, dominios, cantidad de CU por dominio y láminas que los cubren |
| **Actores dibujados** | Los 8 del catálogo E2 |
| **Casos de uso** | **0** — no contiene ninguna elipse de CU |
| **`<<include>>` / `<<extend>>`** | 0 / 0 |
| **Referencias cruzadas** | Las 16 láminas de detalle |
| **Estado de export** | `EXPORT_BLOCKED_NO_DRAWIO_CLI` |
| **Estado de QA** | Geométrica PASS — 0 penetración, 0 texto desbordado, 0 elemento fuera de página |

**UCD-00 no inventa *umbrella use cases*.** No existe «Gestionar club», «Gestionar eventos» ni
«Administrar sistema». Los 8 rectángulos son **packages de dominio**, no casos de uso: llevan el
dominio, su nombre, su cantidad de CU y los `Diagram ID` que lo cubren. La lámina lo declara
explícitamente: *«Mapa maestro de cobertura — no reemplaza los diagramas UML detallados»*.

## 2.2 Láminas de detalle

| # | Diagram ID | Filename | Dominio / cluster | Actores | UC en la lámina | `inc` | `ext` | Gen | Cruces | QA |
|---:|---|---|---|---|---|---:|---:|---:|---:|---|
| 1 | `UCD-IAM-01` | `UCD-IAM-01__GEI_Identity_Access.drawio` | IAM · identidad y acceso | `UNAUTHENTICATED`, `AUTHENTICATED`, `ADMIN`, `SUBCOMMITTEE` | **10** +ref | 3 | 0 | 2 | 14 | geom PASS |
| 2 | `UCD-PPL-01` | `UCD-PPL-01__GEI_Person_Profile_Membership.drawio` | PPL · persona, perfil y membresía | `ADMIN`, `PLAYER`, `AUTHENTICATED` | **8** +ref | 5 | 0 | 2 | 9 | geom PASS |
| 3 | `UCD-PPL-02` | `UCD-PPL-02__GEI_Team_Roles_Representation.drawio` | PPL · equipo, roles y representación | `ADMIN`, `GUARDIAN`, `PLAYER` | **9** +ref | 7 | 0 | 0 | 5 | geom PASS |
| 4 | `UCD-STR-01` | `UCD-STR-01__GEI_Season_Division_Line.drawio` | STR · temporada, división y línea | `ADMIN` | **8** +ref | 8 | 0 | 0 | 5 | geom PASS |
| 5 | `UCD-STR-02` | `UCD-STR-02__GEI_Team_Venue.drawio` | STR · equipo y sede | `ADMIN` | **7** +ref | 7 | 0 | 0 | 5 | geom PASS |
| 6 | `UCD-EVT-01` | `UCD-EVT-01__GEI_Event_Creation.drawio` | EVT · creación de eventos y jornadas | `COACH`, `SUBCOMMITTEE` | **6** | 0 | 0 | 0 | 2 | geom PASS |
| 7 | `UCD-EVT-02a` | `UCD-EVT-02a__GEI_Event_Material_Change.drawio` | EVT · edición, impacto y conflicto | `COACH`, `SUBCOMMITTEE` | **6** | 4 | 1 | 0 | 19 | geom PASS |
| 8 | `UCD-EVT-02b` | `UCD-EVT-02b__GEI_Event_State_Transitions.drawio` | EVT · reanudar, completar y abandonar | `COACH`, `SUBCOMMITTEE` | **3** | 0 | 0 | 0 | 0 | geom PASS |
| 9 | `UCD-EVT-03` | `UCD-EVT-03__GEI_Event_Logistics_Queries.drawio` | EVT · logística y consulta | `COACH`, `SUBCOMMITTEE`, `CAPTAIN`, `AUTHENTICATED` | **4** +ref | 1 | 0 | 3 | 0 | geom PASS |
| 10 | `UCD-PRT-01` | `UCD-PRT-01__GEI_Availability_Selection_Attendance.drawio` | PRT · disponibilidad, convocatoria y asistencia | `PLAYER`, `GUARDIAN`, `COACH` | **7** | 0 | 4 | 0 | 2 | geom PASS |
| 11 | `UCD-PRT-02` | `UCD-PRT-02__GEI_Match_Result_Eligibility.drawio` | PRT · resultado y habilitación | `COACH`, `CAPTAIN`, `SUBCOMMITTEE`, `ADMIN` | **6** +ref | 1 | 1 | 0 | 3 | geom PASS |
| 12 | `UCD-COM-01` | `UCD-COM-01__GEI_Announcements.drawio` | COM · comunicados | `SUBCOMMITTEE`, `AUTHENTICATED` | **5** | 0 | 0 | 1 | 0 | geom PASS |
| 13 | `UCD-COM-02` | `UCD-COM-02__GEI_Conversations_Notifications.drawio` | COM · conversaciones y notificaciones | `AUTHENTICATED` | **9** | 0 | 0 | 0 | 0 | geom PASS |
| 14 | `UCD-CMP-01` | `UCD-CMP-01__GEI_Competition_Lifecycle.drawio` | CMP · competencia y referencia externa | `SUBCOMMITTEE`, `ADMIN`, `COACH` | **5** +ref | 4 | 0 | 0 | 9 | geom PASS |
| 15 | `UCD-CMP-02` | `UCD-CMP-02__GEI_Competition_Entries.drawio` | CMP · inscripciones | `SUBCOMMITTEE`, `ADMIN` | **4** +ref | 4 | 0 | 0 | 6 | geom PASS |
| 16 | `UCD-INS-01` | `UCD-INS-01__GEI_Search_Reports_Audit.drawio` | INS · búsqueda, informes y auditoría | los 6 del catálogo | **5** | 0 | 0 | 5 | 0 | geom PASS |

`+ref` = la lámina contiene, además de sus CU propios, una copia de un CU canónico de otro
dominio para poder dibujar una arista `<<include>>` que lo cruza. Es **el mismo elemento del
modelo**: mismo ID, mismo nombre (brief §23).

## 2.3 Totales

| Métrica | Valor |
|---|---:|
| Archivos `.drawio` | **17** |
| Diagramas de detalle | **16** |
| Mapa maestro | **1** |
| CU únicos representados | **102 / 102** |
| CU con dominio coincidente con su lámina propietaria | **102 / 102** |
| Copias de referencia cross-dominio | 10 (`UC-IAM-09` ×8, `UC-EVT-11` ×2) |
| `UNKNOWN_UC` | **0** |
| `MISSING` | **0** |
| `RENAMED_ID` | **0** |
| Actores representados | **8 / 8** |
| `UNKNOWN_ACTOR` | **0** |
| Generalizaciones dibujadas | **19** ocurrencias · **6** pares únicos |
| `NO_NEW_GENERALIZATION` | **0** |
| Relaciones `<<include>>` | **44** |
| Relaciones `<<extend>>` | **6** |
| `UNAUTHORIZED_NEW_RELATION` | **0** |
| `REJECTED_RELATION_DRAWN` | **0** |

---

# 3. LAS 10 COPIAS DE REFERENCIA CROSS-DOMINIO

Una relación `<<include>>` necesita que **ambos** extremos estén en la lámina. Cuando el extremo
es un CU de otro dominio, se dibuja en su lámina con **idéntico ID e idéntico nombre**.

| CU canónico | Lámina propietaria | Láminas donde se repite como referencia | Razón |
|---|---|---|---|
| `UC-IAM-09` | `UCD-IAM-01` | `UCD-PPL-01`, `UCD-PPL-02`, `UCD-STR-01`, `UCD-STR-02`, `UCD-CMP-01`, `UCD-CMP-02`, `UCD-PRT-02` | `INC-01`: 39 CU base de gestión sensible lo incluyen |
| `UC-EVT-11` | `UCD-EVT-02a` | `UCD-EVT-03` | `INC-02`: `UC-EVT-16` lo incluye |

**Como se marca.** La copia se dibuja con **trazo discontinuo** en la elipse, y cada lámina
lleva una nota de una línea que lo declara, por ejemplo:
*«UC-IAM-09 se dibuja también en UCD-IAM-01: mismo elemento del modelo»*.

**Verificación de que no son CU nuevos.** El validador comprueba, para cada elipse, que el ID
exista en el catálogo de E3 y que el nombre sea **exactamente** el canónico. Si un nombre
difiera, salta `RENAMED_ID`. Resultado: `RENAMED_ID = 0`, luego las 10 copias son el mismo
elemento, no uno nuevo.

**No hay `UCD-X-01__Cross_Domain_Relations.drawio`.** El brief §24 lo permite *«sólo si aporta
claridad»*. Aquí no la aporta: obligaría a repetir hasta 39 CU en una lámina adicional. Decisión
registrada en `GEI_USE_CASE_RELATION_DECISIONS_V1.md` §3.2.

---

# 4. TOPOLOGÍA Y DECISIONES DE DIVISIÓN

El brief §20 y §21 no imponen una cantidad de láminas. La división final salió de **dos
restricciones medibles**, no de un criterio estético:

1. **Co-localización de relaciones.** Los dos extremos de una relación deben estar en la misma
   lámina para poder dibujarla.
2. **Densidad.** Preferir ≤ 12–14 CU por lámina; dividir si la legibilidad se degrada.

| Dominio | CU | Láminas | División elegida | Motivo de la división |
|---|---:|---:|---|---|
| `IAM` | 10 | 1 | dominio entero | 10 CU, 4 actores, 3 relaciones. Cabe holgada |
| `PPL` | 17 | 2 | `01`–`05`+`15`–`17` / `06`–`12`+`13`+`14` | 17 excede la guía. El corte es semántico: *persona y perfil* vs *equipo, roles y representación* |
| `STR` | 15 | 2 | temporada+división+línea / equipo+sede | 15 excede la guía. Coincide con el ejemplo del brief §20. Un solo actor ⇒ lectura muy limpia |
| `EVT` | 19 | 3 | crear / editar+impacto+conflicto / resto del lifecycle / logística+consulta | 19 es el dominio más denso. La primera división la **impone** la co-localización de las 5 relaciones de `EVT` |
| `PRT` | 13 | 2 | disponibilidad+convocatoria+asistencia / resultado+habilidad | 13 cabe en una, pero con 4 aristas `<<extend>>` y 3 actores la lámina única queda cargada. El corte sigue las fronteras del modelo |
| `COM` | 14 | 2 | comunicados / conversaciones+notificaciones | 14 en una sola con 14 aristas de un actor abstracto es una malla. El corte es el del modelo: *comunicados oficiales* vs *mensajería y avisos* |
| `CMP` | 9 | 2 | competencia+referencia / inscripciones | 9 con 8 aristas `<<include>>` y 3 actores. El corte sigue la frontera `Competition` vs `CompetitionEntry` de `REQ-CMP-004` |
| `INS` | 5 | 1 | dominio entero | 5 CU. Cabe holgada |
| **TOTAL** | **102** | **16** | | +1 mapa maestro = **17 archivos** |

## 4.1 Las divisiones que la relaciones impusieron

| Relación | Restricción | Resultado |
|---|---|---|
| `INC-02` (4 aristas) + `EXT-01` (1) | `UC-EVT-04`, `05`, `07`, `08`, `11`, `12` deben estar juntas | `UCD-EVT-02a` existe **por** esta razón |
| `EXT-02`, `EXT-04` | `UC-PRT-07` con `05`/`06`; `UC-PRT-04` con `02`/`03` |Los 7 UC de `UCD-PRT-01` caen en una sola lámina |
| `EXT-03` | `UC-PRT-10` con `UC-PRT-09` | Ambos en `UCD-PRT-02` |
| `INC-01` (39 aristas) | El destino `UC-IAM-09` debe estar presente | 7 láminas repiten la referencia (ver §3) |

## 4.2 Láminas deliberadamente pequeñas

`UCD-EVT-02b` tiene 3 CU y `UCD-CMP-02` tiene 4. No es un error de conteo: son los clusters
que quedan fuera de las relaciones. Dividir para descartar cruces es exactamente lo que pide
el brief §21; una lámina de 3 CU con 2 actores se lee en eltest de 5 segundos sin esfuerzo.

---

# 5. ESTADO DE EXPORT

| Campo | Valor |
|---|---|
| **draw.io CLI encontrado** | **NO** |
| **Rutas comprobadas** | `%LOCALAPPDATA%\Programs\draw.io\Draw.io.exe` · `%LOCALAPPDATA%\draw.io\Draw.io.exe` · `%ProgramFiles%\draw.io\Draw.io.exe` · `%ProgramFiles(x86)%\draw.io\Draw.io.exe` · `%LOCALAPPDATA%\Programs\diagrams.net\Draw.io.exe` · `%ProgramFiles%\diagrams.net\Draw.io.exe` |
| **Comandos en `PATH`** | `draw.io`, `drawio`, `diagrams.net`, `diagramsnet` — ninguno encontrado |
| **PNG exportados** | **0** |
| **PDF exportados** | **0** |
| **Estado** | **`EXPORT_BLOCKED_NO_DRAWIO_CLI`** |

No se instaló software. El brief §39 lo prohíbe cuando no es necesario, y §39 también prohíbe
falsificar exports. `docs/uml/use-cases/export/` queda vacío a propósito, con un `README.md`
que declara el bloqueo.

**Consecuencia:** los `.drawio` **no comprimidos** son el entregable autoritativo y la única
fuente. No hay PNG ni PDF. Cualquier lámina puede abrirse en
<https://app.diagrams.net> o en la app de escritorio sin instalación.

---

# 6. ESTADO DE QA

| Campo | Valor |
|---|---|
| **Método** | **Análisis geométrico automático**, no render |
| **Herramienta** | `scripts/validate-drawio-use-cases.mjs` + `docs/uml/use-cases/evidence/_layout-report.json` |
| **Informe** | `docs/uml/use-cases/evidence/GEI_DRAWIO_VALIDATION_REPORT.txt` |
| **Resultado** | **PASS — 0 findings** |
| **QA visual renderizada** | **NO EJECUTADA** — sin renderizador disponible |

Lo que el análisis geométrico **sí** comprueba, por lámina:

| Comprobación | Resultado |
|---|---|
| XML bien formado | 17 / 17 |
| `<mxfile>` + `<diagram>` + `<mxGraphModel>` presentes | 17 / 17 |
| IDs de `mxCell` únicos | 0 duplicados |
| Referencias `parent` y `source`/`target` válidas | 0 rotas |
| Geometría finita (sin `NaN`/`Infinity`) | 0 casos |
| Elementos dentro de la página A4 (1169 × 827) | 0 fuera |
| Actor dentro del *system boundary* | 0 |
| CU fuera del *system boundary* | 0 |
| Texto que desborda la elipse (cálculo de rectángulo inscrito) | 0 |
| Conector que atraviesa una forma o un texto | **0 en las 16 láminas** |
| Stereotipo `«include»`/`«extend»` presente y correcto | 50 / 50 |
| `<<extend>>` con condición visible | 6 / 6 |

Lo que **no** puede comprobar sin render: cómo se ve realmente la lámina. Ver
`GEI_USE_CASE_DIAGRAM_FREEZE_V1.md` §8 y `GEI_USE_CASE_DIAGRAM_RECONSTRUCTION_AUDIT_V1.md` §7.

---

# 7. CÓMO REGENERAR Y REVALIDAR

```bash
# Regenera los 17 .drawio desde el catálogo de E3 y las decisiones de relación
node scripts/generate-use-case-diagrams.mjs
node scripts/generate-use-case-map.mjs

# Valida cobertura, actores, relaciones, generalizaciones, XML y geometría
node scripts/validate-drawio-use-cases.mjs
```

El generador es una **ayuda de reproducibilidad**, no la autoridad. Si un `.drawio` editado a
mano difiere del generador, **manda el `.drawio`**: el `.drawio` es la fuente editable
autoritativa (brief §17) y el generador no debe sobrescribir una edición manual sin decisión
explícita. Todo el contenido del generador deriva de dos archivos versionados:
`docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` y `scripts/lib/relations.mjs`.

---

**Fin del Use Case Diagram Manifest V1.**

**SOURCE MODIFIED: NO.**
