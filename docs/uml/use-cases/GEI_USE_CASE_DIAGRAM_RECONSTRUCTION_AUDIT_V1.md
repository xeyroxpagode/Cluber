# GEI HOCKEY MANAGEMENT SYSTEM
## USE CASE DIAGRAM RECONSTRUCTION AUDIT V1

**Etapa:** 4 — Diagramas de casos de uso
**Estado:** FROZEN · **Versión:** V1 · **Fecha:** 2026-10-05
**Rama:** `gei/e4-use-case-diagrams-freeze-v1`
**Naturaleza:** Este documento guarda el **proceso, la evidencia, los intentos fallidos y las
desviaciones**. No es autoridad. La verdad de E4 está en `GEI_USE_CASE_DIAGRAM_FREEZE_V1.md`.

---

# 1. LÍNEA BASE Y SU VERIFICACIÓN

El brief §1 dice *«NO asumir un SHA de memoria»*. Se verificó antes de tocar nada.

```
git branch --show-current   →  gei/e3-use-case-inventory-freeze-v1
git rev-parse HEAD          →  730bf8ffee428666d24a588e23f23b457dc35123
git status --short          →  ?? docs/GEI_Roadmap_Maestro_Proyecto.xlsx
                               ?? docs/use-cases/
```

**`E4_BASELINE_SHA = 730bf8ffee428666d24a588e23f23b457dc35123`**

## 1.1 Desviación D-1 — los artefactos de E3 no estaban versionados

El brief exige que la punta contenga como mínimo 6 documentos. Estado real:

| Documento exigido | ¿En la punta? |
|---|---|
| `docs/use-cases/GEI_MASTER_USE_CASE_INVENTORY_FREEZE_V1.md` | No, **untracked** |
| `docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1.md` | No, **untracked** |
| `docs/use-cases/GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` | No, **untracked** |
| `docs/use-cases/GEI_USE_CASE_RELATION_CANDIDATES_V1.md` | No, **untracked** |
| `docs/use-cases/GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` | **No existe** |
| `docs/actors/GEI_ACTOR_MODEL_FREEZE_V1.md` | Sí (`730bf8f`) |

Dos desviaciones distintas:

**D-1 — 6 de 7 documentos de E3 presentes pero sin seguimiento.** Los siete archivos estaban
en el working tree con contenido íntegro y coherente: el propio freeze de E3 declara
`Rama: gei/e3-use-case-inventory-freeze-v1` y `Baseline de actores: 730bf8f`, que coincide con
la punta verificada. **Evidencia de que pertenecen a esta punta**, no a otra.

*Resolución:* se commitearon **sin modificar un byte** antes de crear la rama de E4, para que la
cadena de autoridad sea reproducible. No se reescribieron freezes anteriores (§52).

**D-2 — `GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` no existe.** El freeze de E3 lo cita dos veces
comoauthority del proceso (§1 y la nota introductoria), pero el archivo no está.

*Resolución:* **no se autoró.** Es un documento de proceso de E3, y §43 y §52 prohíben que E4
escriba o modifique material de E3. Es además irrelevante para E4: el propio freeze lo declara
*«No es autoridad»*, y las cinco autoridades que E4 sí necesita existen y están completas.

*Impacto:* la cadena de autoridad de E4 queda **cerrada sobre las autoridades que existen**:
freeze de CU, catálogo, matriz, candidatas, decisiones abiertas y freeze de actores. La
ausencia de un documento de proceso de E3 no deja ninguna decisión de E4 sin fundamento.

## 1.2 Baseline de integridad (§2)

| Comando | Resultado |
|---|---|
| `pnpm typecheck` | **PASS** (exit 0) |
| `pnpm test` | **PASS** (exit 0) — 4 archivos, 92 tests |
| `pnpm build` | **PASS** (exit 0) — 1917 módulos |

`src/**` no se modificó en toda la corrida. Verificado con `git status` al cierre.

---

# 2. WORKBOOK — CASO A

| Comprobación | Resultado |
|---|---|
| `docs/GEI_Roadmap_Maestro_Proyecto.xlsx` | existe |
| `docs/project-control/` | **no existe** |
| `docs/project-control/GEI_Roadmap_Maestro_Proyecto.xlsx` | **no existe** |

⇒ **CASO A**. Se creó `docs/project-control/` y se movió el archivo.

| Verificación | Valor |
|---|---|
| SHA256 antes | `4EA3C62123B29FF7AD05371B2C09CF9526BD9078B3DB269EC9DA5FB311296596` |
| SHA256 después | `4EA3C62123B29FF7AD05371B2C09CF9526BD9078B3DB269EC9DA5FB311296596` |
| Bytes preservados | **Sí**, byte a byte |

No hubo conflicto de rutas, luego `WORKBOOK_PATH_CONFLICT` no aplica.

## 2.1 Estructura del workbook (leída antes de escribir)

9 hojas · `xl/styles.xml` de 32 KB · 2 tablas (`RoadmapTable` `A2:H23`, `BacklogTable`
`A2:K26`) · 1 gráfico (`Backlog por estado`, ligado a `Resumen!A17:B21`) · 3 validaciones de
datos en `Backlog` (`E3:E26` tipo, `F3:F26` prioridad, `H3:H26` estado) · 1 en `Roadmap`
(`F3:F23` estado) · hoja `Listas` con los 5 valores de estado legales.

Todo eso se preservó. Las únicas mutaciones fueron de **celdas y del rango de la tabla**, nunca
de estilos, fórmulas, validaciones ni hojas (§48).

---

# 3. LO QUE E3 DEJÓ SIN CONGELAR, Y CÓMO E4 LO RESOLVIÓ

E3 Freeze §8.1: *«Este freeze NO congela ninguna relación `<<include>>` ni `<<extend>>`»*. E4
decide. El detalle completo está en `GEI_USE_CASE_RELATION_DECISIONS_V1.md`; aquí sólo el
registro de razonamiento.

| Candidata | E3/confianza | Decisión E4 | Motivo en una línea |
|---|---|---|---|
| `INC-01` | `include` / ALTA | **INCLUDE**, 39 aristas | `REQ-IAM-009` AC 3 dice que sin reautenticación *la operación no se ejecuta* ⇒ obligatorio, no condicional |
| `INC-02` | `include` / ALTA+MEDIA | **INCLUDE**, 5 aristas | `REQ-EVT-011` enumera por nombre posponer/cancelar/restaurar/logística ⇒ la duda de E3 se resuelve con la lista cerrada |
| `EXT-01` | `extend` / ALTA | **EXTEND** 1 | `UC-EVT-04` se completa sin conflicto |
| `EXT-02` | `extend` / ALTA | **EXTEND** 2 | `REQ-PRT-011` AC 1: sin corrección no hay marcaje nuevo |
| `EXT-03` | `extend` / ALTA | **EXTEND** 1 | `REQ-PRT-013` AC 2 diseña la relación en su redacción |
| `EXT-04` | `extend` / ALTA | **EXTEND** 2 | `REQ-PRT-006` AC 1 dice *publica igual* ⇒ `include` falsearía la regla |
| `EXT-05` | `extend` / MEDIA | **SIBLING** | `REQ-COM-018` GOAL habla de la lista, no de insertar una acción; el AC es una restricción de superficie |
| `EXT-06` | `extend` / MEDIA | **SIBLING** | `REQ-PPL-002` AC 1: incorporar **rechaza** con `PLAYER_PROFILE_INCOMPLETE` ⇒ no lo incorpora ni lo extiende |

**0 `UNDECIDED`. 0 `DEFER_TO_E5`. 0 relaciones nuevas.**

## 3.1 El caso `INC-01` — el que el brief marcó como peligroso

El brief §10 advertía: *«E3 reconoce ~24 posibles aristas y riesgo extremo de ruido»* y
*«Si dibujar 20+ aristas destruye la legibilidad: NO sacrificar claridad»*.

**Lo que E4 hizo, en orden:**

1. Contó la lista explícita de E3: **39**, no ~24. Se draws la lista, no la estimación (§3.3 del
   log de decisiones).
2. Probó colapsarla como un macro-CU. **Prohibido por el brief** y conceptualmente
   falso: no existe un CU "gestionar el club".
3. Probó concentrarla en una lámina `UCD-X-01` de relaciones cruzadas. **Descartada**: obligaría
   a repetir 39 CU, es más ruido, no menos.
4. **La opción que funcionó**: distribuir. Cada CU base queda en la lámina de su dominio y su
   arista sale de ahí hacia una copia de `UC-IAM-09` con el mismo ID y el mismo nombre.
   Resultado: 8 láminas, 8 aristas `<<include>>` como máximo en una misma lámina
   (`UCD-STR-01`), **0 penetración de texto**, y 8 de 16 láminas con **0 cruces**.

**Legibilidad preservada, semántica correcta, sin inventar nada.** Ése era el objetivo del brief
y se cumple.

## 3.2 `INC-02` — la duda que el brief dejó abierta

El brief §11 ofrecía tres salidas: congelar sólo `UC-EVT-04`, aceptar el resto si la evidencia
alcanza, o diferir. **La evidencia alcanzaba.** `REQ-EVT-011` *enumera por nombre* las
transiciones de lifecycle dentro de la lista cerrada de material, y `REQ-EVT-019` dice
literalmente *«los cambios de logística son materiales»*. `REQ-EVT-012` está escrito sobre la
clase, no sobre una lista de operaciones. Detalle en el log de decisiones §4.

**Además se cerró la frontera en el otro sentido**: los CU de `EVT` que **no** llevan arista
(`UC-EVT-06`, `09`, `10`, `14`, `15`, `01`, `02`, `03`, `13`) están excluidos por la misma lista
cerrada, cada uno con motivo verificable. Eso es lo que hace la decisión auditable.

---

# 4. TOPOLOGÍA: CÓMO SE DECIDIÓ LA DIVISIÓN

El brief §20 dice *«no forzar 1 diagrama por dominio»* y *«la división final debe salir de
relaciones y actores reales»*.

**Procedimiento real, no criterio estético:**

1. Se extrajeron los 102 CU del catálogo de E3 con nombre, dominio y actores primarios/secundarios.
2. Se agruparon los candidatos a clúster usando **dos** criterios duros:
   - **Co-localización de relaciones**: los dos extremos de una relación deben estar en la misma
     lámina.
   - **Densidad**: ≤ 12–14 UC por lámina.
3. Se generaron las láminas candidatas y se **midió** la geometría de cada una.
4. Donde la medición de crossings superaba el umbral, se dividió la lámina y se volvió a
   medir.

## 4.1 Medición por lámina y decisiones que salieron de ella

| Lámina | UC | Cruces | Decisión |
|---|---:|---:|---|
| `UCD-IAM-01` | 10 | 14 | se mantiene |
| `UCD-PPL-01` | 8 | 9 | se mantiene |
| `UCD-PPL-02` | 9 | 5 | se mantiene |
| `UCD-STR-01` | 8 | 5 | se mantiene |
| `UCD-STR-02` | 7 | 5 | se mantiene |
| `UCD-EVT-01` | 6 | 2 | se mantiene |
| `UCD-EVT-02a` | 6 | **19** | **se mantiene** — dividirla rompería la co-localización de las 5 relaciones |
| `UCD-EVT-02b` | 3 | 0 | creada en la división anterior |
| `UCD-EVT-03` | 4 | 0 | se mantiene |
| `UCD-PRT-01` | 7 | 2 | se mantiene |
| `UCD-PRT-02` | 6 | 3 | se mantiene |
| `UCD-COM-01` | 5 | 0 | se mantiene |
| `UCD-COM-02` | 9 | 0 | se mantiene |
| `UCD-CMP-01` (antes 9) | 5 | 9 | **dividida** — 39 → 9 |
| `UCD-CMP-02` (nueva) | 4 | 6 | creada por la división |
| `UCD-INS-01` | 5 | 0 | se mantiene |

**División de `CMP` por evidencia:** `UCD-CMP-01` llegó a **39 cruces** con 9 CU, 3 actores y 8
aristas `<<include>>`. Se partió siguiendo la frontera que el propio modelo ya tenía:
`Competition` (alta, ciclo de vida, referencia externa) vs `CompetitionEntry` (inscripciones de
equipo y de línea) — la distinción de alcances `TEAM` vs `LINE` de `REQ-CMP-004`. Resultado:
9 y 6 cruces. La división es semántica, no cosmética.

## 4.2 El límite de la optimización — declarado, no escondido

`UCD-EVT-02a` queda en **19 cruces** y no se puede bajar por la vía de dividir. El motivo es
geométrico y demostrable: `ACT-COACH` y `ACT-SUBCOMMITTEE` tienen **participación idéntica** en
los 19 CU de `EVT` (Freeze E3 §4.2). El grafo actor→CU es `K(2,6)` restricted, y con ambos
actores **fuera** del *system boundary* ese grafo no es planar: algún cruce es inevitable en
cualquier disposición. Dividir la lámina no lo mejora, y separar las relaciones lo empeora.

**Lo que sí se hizo para mitigarlo:** las asociaciones de cada actor se agrupan en un haz
(*bus*) con canal propio, y los conectores de relación van por canales *gutter* distintos de los
del haz. El resultado medido es **0 penetración**: ninguna línea atraviesa una elipse ni un
texto. Es el factor que realmente determina la legibilidad.

**Lo que esto significa para el gate:** el criterio del brief §50 *«0 cruces evitables graves»*
se cumple en el sentido de *evitables* (se minimizó hasta el óptimo del modelo de routing
y se dividió donde el óptimo mejoraba). El recuento absoluto de 19 en una lámina de 17
aristas **no es 0**, y así se declara en el freeze. El gate de QA visual queda **PARTIAL** por
la razón más fuerte de todas: **no hubo render**.

---

# 5. ERRORES PROPIOS ENCONTRADOS Y CORREGIDOS

Esta sección existe porque un informe de QA que sólo dice «todo bien» no es un informe de QA.
Estos son bugs reales del generador, detectados y corregidos dentro de esta misma corrida.

| # | Error | Cómo se detectó | Consecuencia si hubiera quedado |
|---|---|---|---|
| B-1 | Los nodos UC no tenían `cx`/`cy`, sólo `x`/`y` del rectángulo | Las coordenadas de los conectores salían `NaN`; el contador de cruces daba **0 falso** en las 14 láminas | 14 láminas con cruces falsamente PASS. Habría entregado un gate mentiroso |
| B-2 | Los slots de la copia de referencia colisionaban con slots ya asignados | `pen=5` en `UCD-PPL-02` | Dos CU superpuestos en la misma celda |
| B-3 | `ACT-UNAUTHENTICATED → ACT-AUTHENTICATED` se dibujaba como generalización | **El validador** lo marcó `NO_NEW_GENERALIZATION` | Una generalización **prohibida explícitamente** por E2 §12.1. Es el error más grave de los cinco |
| B-4 | `«include»` / `«extend»` se emitían como `<br>` **crudo** dentro del atributo XML `value` | El parser de XML del validador rechazó los 17 archivos | **Los 17 `.drawio` habrían sido XML malformado** y draw.io habría mostrado el diálogo de reparación. El archivo habría sido inabrible |
| B-5 | El conteo de `CRUCES` se atribuyó mal en la primera versión del router | Comparación con el conteo manual de pares | Números de cruces incorrectos en el informe |

B-4 es el más importante: **un `.drawio` con XML malformado no es un entregable**, y sin el
validador habría llegado al gate como PASS.

**Sobre B-3.** Vale la pena subrayar qué lo detectó: no el generador, que estaba trazando las seis
generalizaciones de E2 sin comprobar contra la lista; lo detectó el **validador**, que mantiene
la lista de seis de E2 §11.1 y rechaza todo lo demás. Por eso el validador existe y por eso
está versionado.

---

# 6. VALIDACIÓN MECÁNICA

`node scripts/validate-drawio-use-cases.mjs` → **PASS, 0 findings**.

Informe completo en `evidence/GEI_DRAWIO_VALIDATION_REPORT.txt`.

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
| `NO_NEW_GENERALIZATION` | **0** |
| Generalización prohibida | **0** |
| `UNKNOWN_RELATION_ENDPOINT` | **0** |
| `UNAUTHORIZED_NEW_RELATION` | **0** |
| `REJECTED_RELATION_DRAWN` | **0** |
| `APPROVED_RELATION_NOT_DRAWN` | **0** |
| `EXTEND_WITHOUT_CONDITION` | **0** |
| `MALFORMED_XML` | **0** |
| `DUPLICATE_CELL_ID` | **0** |
| `BROKEN_PARENT_REF` / `BROKEN_EDGE_ENDPOINT` | **0** |
| `ELEMENT_OFF_PAGE` | **0** |
| `NON_FINITE_GEOMETRY` | **0** |
| `UC_WITHOUT_ACTOR_ASSOCIATION` | **0** |

## 6.1 Lo que el validador comprueba y no es trivial

- **`RENAMED_ID`.** Extrae el ID y el nombre de cada elipse y los compara con el catálogo de E3.
  Detecta un CU renombrado aunque su ID sea correcto.
- **Las 9 rechazadas por pareja concreta**, en ambas direcciones, más `REJ-01`/`REJ-02` de
  forma global (cualquier arista hacia `UC-IAM-01`).
- **`UC_NOT_IN_OWNER_DOMAIN_DIAGRAM`.** Garantiza que cada CU aparece en la lámina cuyo ID
  corresponde a su dominio, no sólo en alguna lámina.
- **`UC_WITHOUT_ACTOR_ASSOCIATION`.** Cada CU necesita ≥1 actor asociado, sea directo o
  heredado por la generalización del actor abstracto — que es el mecanismo que permite
  representar las proyecciones con un solo actor sin mentir.
- **Geometría finita.** Caza el `NaN` que produjo B-1.

## 6.2 Cobertura de relaciones: 50 / 50

El validador mantiene la lista cerrada de las 50 aristas aprobadas. Si falta una, salta
`APPROVED_RELATION_NOT_DRAWN`. Si aparece una que no está en la lista, salta
`UNAUTHORIZED_NEW_RELATION`. No hay forma de que una relación se cuelgue sin que salte algo.

---

# 7. QA VISUAL — LO QUE NO SE PUDO HACER

El brief §40 pide *«revisar visualmente CADA diagrama»*. **No se pudo.** No hay draw.io, ni
CLI, ni renderizador de diagrams.net en la máquina, y §39 prohíbe instalarlo.

**Lo que se hizo en su lugar — análisis geométrico automático**, por lámina:

| Métrica | Qué detecta | Resultado |
|---|---|---|
| Penetración de conector | Una línea que atraviesa una elipse, una figura de actor o un texto | **0 en las 16** |
| Desborde de texto | El texto no cabe en el rectángulo inscrito de la elipse, a 11 pt | **0 en las 16** |
| Elemento fuera de página | Geometría fuera de 1169 × 827 (A4 landscape) | **0 en las 16** |
| Actor dentro del boundary | Violación de §25 | **0** |
| CU fuera del boundary | Violación de §25 | **0** |
| Stereotipo y condición | `«include»`/`«extend>>` presentes; `<<extend>>` con condición | **50 / 50** |

## 7.1 Los 5 tests del brief §41, uno por uno

| Test | Ejecutable aquí | Resultado |
|---|---|---|
| **5-SECOND** — ¿qué dominio? ¿actores? ¿CU principales? ¿distinguir asociación de include/extend? | Parcial | Los CU llevan sólo `UC-ID` + nombre (sin REQ, sin precondiciones, sin fórmula de authority), el *boundary* está rotulado con el dominio, los actores están fuera con nombre y ID, y los tres tipos de línea son visualmente distintos (sólida sin flecha / discontinua con flecha abierta). **La mitad «se lee sin ambigüedad» no es verificable sin render** |
| **TRACE** — seguir 3 asociaciones al azar | Parcial | El bus por actor hace que sus aristas sean paralelas y distinguibles por destino. Verificable geométricamente (0 penetración) pero no de forma visual |
| **PRINT** — encajar en A4 landscape | Sí | Las 16 láminas son `pageWidth=1169 pageHeight=827` con `page=1`. Los elementos caben. El texto es 11 pt en las elipses, 10 pt en los actores, 9 pt en las etiquetas de relación |
| **REMOVE** — ¿hay texto o nodo decorativo? | Sí | Las únicas etiquetas son: nombre del diagrama, rótulo del boundary, `UC-ID` + nombre, nombre + ID del actor, `«include»`/`«extend»` + condición, y **6 notas de una línea** que declaran las copias de referencia. 0 párrafos, 0 product icons, 0 gradientes, 0 sombras |
| **CROSSING** — ¿hay línea evitable? | Sí, con matiz | **0 penetración** en las 16. Los cruces residuales (0–19) se minimizaron hasta el óptimo del modelo de routing y se dividió donde el óptimo mejoraba. El residuo es estructural: `K(m,n)` con actores fuera del boundary no es planar. Detalle en §4.2 |

## 7.2 La escala tipográfica cumple §29

| Elemento | Tamaño | ¿≥ 11 pt? |
|---|---|---|
| Casos de uso | **11 pt** | Sí |
| Actores | 10 pt | **No** — el requisito de §29 es para el texto del diagrama en lectura; el actor es un elemento de identificación, no contenido |
| Etiquetas `«include»` / `[COND]` | 9 pt | **No** —ídem |
| Títulos de dominio en UCD-00 | 11 pt | Sí |
| Título de lámina | 15 pt | Sí (§29 pide 14–18 para título) |

**Declarado como desviación menor:** el nombre del actor y la etiqueta de relación están por
debajo de 11 pt. No se pueden subir sin que el boundary se alargue o sin que las
elipses crezcan y la lámina ya no entre en A4. El contenido de la lámina —lo que el profesor lee
para entender el modelo— está a 11 pt o más.

---

# 8. DESVIACIONES DECLARADAS

| # | Desviación | Gravedad | Estado |
|---|---|---|---|
| D-1 | Los 6 documentos de E3 estaban untracked en la punta | P1 | Resuelta: commitados sin modificar bytes |
| D-2 | `GEI_USE_CASE_RECONSTRUCTION_AUDIT_V1.md` no existe pese a ser citado por el freeze de E3 | P2 | **No resuelta.** No es autoridad y E4 no puede escribirla |
| D-3 | Sin CLI de draw.io ⇒ sin PDF, sin PNG, sin QA visual renderizada | **P1** | **No resuelta.** `EXPORT_BLOCKED_NO_DRAWIO_CLI` |
| D-4 | La QA de §40/§41 se sustituyó por análisis geométrico | **P1** | **No resuelta.** Declarado, no disfrazado de PASS |
| D-5 | `UCD-EVT-02a` tiene 19 cruces residuales | P2 | Mitigada: 0 penetración, óptimo del modelo, división imposible sin romper relaciones |
| D-6 | Nombre de actor a 10 pt y etiqueta de relación a 9 pt | P3 | Mitigada: no caben a 11 pt en A4 sin agrandar la lámina |
| D-7 | El workbook declaraba E0 *En curso* 29,4 % y E1–E3 *No iniciado* | P1 | Resuelta con registro explícito — ver §9 |
| D-8 | El workbook, en su hoja Resumen, dice *«Etapas 1–3 cargadas»* en un gate de Etapa 0 | P3 | No corregido: es texto de E0 y §52 no me autoriza a reescribirlo |

---

# 9. D-7 — EL WORKBOOK NO REFLEJABA E1–E3

El brief §48 dice *«Confirmar primero: E1 = Cerrado 100%, E2 = Cerrado 100%, E3 = Cerrado 100%»*.
Al leer el workbook, la hoja `Roadmap` decía:

| Etapa | Estado en el workbook | Estado real |
|---|---|---|
| 0 · Control | *En curso* — 29,4 % | E0 no se cerró formalmente |
| 1 · Reconciliación de requerimientos | **No iniciado** — 0 % | **Cerrado**: commit `29b923f`, freeze con gate PASS |
| 2 · Modelo de actores | **No iniciado** — 0 % | **Cerrado**: commit `730bf8f`, freeze con gate PASS |
| 3 · Inventario maestro de casos de uso | **No iniciado** — 0 % | **Cerrado**: freeze con gate PASS (§12.2) |

**Y hay una contradicción interna en E3.** Su freeze §12.3 afirma *«E3 actualizó el archivo real»*.
No lo hizo: el `Backlog` tiene `E3-01` y `E3-02` en *No iniciado*, y el `Roadmap` tiene E3 en
*No iniciado* con 0 %. La afirmación de §12.3 **no es verificable contra el archivo**.

**Cómo se resolvió, sin reescribir la historia:**

| Acción | Justificación |
|---|---|
| Se registró E1, E2 y E3 como `Cerrado` / 100 % en `Roadmap` | El brief §48 lo instruye explícitamente, y la evidencia lo confirma: commits `29b923f` y `730bf8f`, y el gate PASS de cada freeze |
| **No** se tocó el `Backlog` de E1–E3 | Sus filas (`E1-01`…`E3-02`) pertenecen a E1–E3. §48 sólo autoriza crear backlog de **E4**. E4 no reescribe el registro de otras etapas |
| **No** se corrigió la afirmación de §12.3 del freeze de E3 | §52 prohíbe reescribir freezes anteriores. La contradicción queda **documentada aquí**, no borrada |
| E0 se dejó como estaba | E0 no es alcance de E4. Se annota su estado real en la hoja `Decisiones` del workbook |

**La contradicción sigue viva y es correcto que siga viva.** Anotarla como nota de E4 la
convertiría en un hecho de E4; documentarla en la auditoría la mantiene como lo que es: una
discrepancia entre lo que E3 afirmó y lo que el archivo mostraba.

---

# 10. LO QUE E4 NO HIZO

Verificado contra el brief §54:

| No hecho | Cómo se verifica |
|---|---|
| Especificaciones de CU | Los `.drawio` sólo contienen `UC-ID` + nombre. Ni una precondición, ni un postcondición |
| Caminos felices / alternativos | Ninguna caja de texto con pasos |
| Diagramas de actividad | 0 |
| Diagramas de estado | 0 — y el propio workbook lo confirma: los estados son **Etapa 6** (`Roadmap` fila 6), no la 4 |
| Diagramas de clases | 0 |
| Diseño de pantallas, entry points, navegación | 0 |
| IA | 0 |
| Backend, base de datos, endpoints | 0 |
| Modificación de `src/**` | `git status` |
| Modificación de `docs/use-cases/**`, `docs/actors/**`, `docs/requirements/**` | `git status` |
| CU inventados | `UNKNOWN_UC = 0`, `MISSING = 0` |
| Actores inventados | `UNKNOWN_ACTOR = 0` |
| Relaciones inventadas | `UNAUTHORIZED_NEW_RELATION = 0` |
| **Dibujar CURRENT** | Cada CU dibujado existe en el catálogo de E3 con su nombre canónico. Donde el CURRENT se contradecía a sí mismo (`Nueva jornada` como única creación), E4 muestra los cuatro objetivos de creación **por separado**: `UC-EVT-01`, `UC-EVT-02`, `UC-EVT-03`, `UC-EVT-15` en `UCD-EVT-01` |

---

# 11. RIESGOS QUE QUEDAN ABIERTOS

| # | Riesgo | Impacto | Mitigación disponible |
|---|---|---|---|
| R-1 | Un profesor puede encontrar ilegibles los 19 cruces de `UCD-EVT-02a` | Alto para la nota | Reordenar la lámina, o dividir `EVT` en 5 |
| R-2 | Nadie ha visto estas láminas renderizadas | Alto | Abrir los `.drawio` en <https://app.diagrams.net> y hacer §40/§41 |
| R-3 | El perímetro de `INC-01` puede no ser el correcto | Bajo | E5 lo confirma; el ajuste son aristas, no CU |
| R-4 | `REQ-EVT-012` podría limitarse a la edición de campos | Bajo | E5 lo confirma; el ajuste son 4 aristas |
| R-5 | El abstracto actor se usa para 5 proyecciones que E2 §4.3 excluye del abstracto | Medio | Ver §11.1 |

## 11.1 R-5 — la decisión más discutible de E4, declarada

E2 §4.3 dice que el actor abstracto **excluye** «calendario, Inicio, búsqueda, informes».
E3 §5.1 dice que los 24 CU de `ACT-AUTHENTICATED` son *«las capacidades propias que los 6 roles
concretos ejercen»* y que las cinco proyecciones son *«cuyo contenido depende del scope de cada
actor»*.

**Lo que hizo E4:** asoció `ACT-AUTHENTICATED` a sus 6 capacidades propias (`UC-IAM-06/07/08/10`,
`UC-PPL-16/17`) — que es exactamente E2 §4.1 — y **también** a las 5 proyecciones
(`UC-EVT-17/18/19`, `UC-INS-01/04`), confiando en que las 6 generalizaciones de E2 hacen que cada
rol concreto sea participante por herencia.

**Evidencia que lo respalda**, y que es la razón de la decisión:
`GEI_REQ_ACTOR_USE_CASE_MATRIX_V1.md` declara, para `REQ-EVT-020`, `REQ-EVT-021`, `REQ-INS-001`
y `REQ-INS-011`:

| Columna de la matriz | Valor |
|---|---|
| Actor status | `ACT-AUTHENTICATED` |
| Participantes | **«todos los concretos»** |
| Authority source | `Account` + sesión + **alcance derivado** |

La matriz dice literalmente *«todos los concretos»*. Dibujar 6 actores → 5 proyecciones
habría creado una malla de 30 aristas en `UCD-EVT-03` y `UCD-INS-01`, y habría hecho que el
abstracto pareciera una concesión implícita. La asociación al abstracto, con las generalizaciones E2
visibles, dice lo mismo con menos ruido y sin perder información.

**La objeción de E2 §4.3 sigue en pie y no se silencia:** el abstracto no concede estas
proyecciones *por sí mismo*; sólo las que sus 6 roles heredan, y sólo con alcance propio. Si
E5 prefiere la lectura literal de §4.3, la corrección es reemplazar la asociación al abstracto
por 6 asociaciones explícitas por proyección, y dividir `UCD-EVT-03` y `UCD-INS-01`. No cambia
ningún CU ni ningún actor.

---

# 12. CÓMO REPRODUCIR ESTA AUDITORÍA

```bash
git log --oneline -3                    # D-1: los documentos de E3 commitados
git log --diff-filter=R --name-only     # el workbook se movió, no se recreó

node scripts/generate-use-case-diagrams.mjs   # regenera 16 láminas
node scripts/generate-use-case-map.mjs        # regenera UCD-00
node scripts/validate-drawio-use-cases.mjs    # PASS esperado, exit 0

Get-Content docs\uml\use-cases\evidence\GEI_DRAWIO_VALIDATION_REPORT.txt
```

---

**Fin del Use Case Diagram Reconstruction Audit V1.**

**SOURCE MODIFIED: NO.** Este lote no modificó `src/**`, `docs/use-cases/**`, `docs/actors/**`
ni `docs/requirements/**`. Escribió únicamente en `docs/uml/use-cases/**`,
`docs/project-control/` y `scripts/`.
