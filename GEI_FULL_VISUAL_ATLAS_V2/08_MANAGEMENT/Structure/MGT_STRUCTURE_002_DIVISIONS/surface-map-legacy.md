# SURFACE MAP — MGT_STRUCTURE_002_DIVISIONS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_STRUCTURE_002_DIVISIONS

**SCREEN ID:** MGT_STRUCTURE_002_DIVISIONS

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Divisiones

**PURPOSE AS IMPLEMENTED:** Listado de divisiones con su temporada y la acción de archivar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/structure?tab=DIVISION

**ORIGIN:** MGT_STRUCTURE_001_SEASONS → pestaña «Divisiones»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** d1 Primera, d2 Quinta, d3 Sexta, d4 Séptima

**RESOURCE STATE:** 4 DIVISIONES ACTIVAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=DIVISION&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_001_SEASONS

**RESPONSIVE COUNTERPART:** Misma composición que la pestaña de temporadas.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** StructurePage (tab DIVISION)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_002_DIVISIONS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de divisiones
- **FOCAL 2:** Pestaña «Divisiones» activa con su contador
- **SUPPORTING:** Temporada de cada división en el detalle
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StructureRow (Primera) | RowStatic con botón «Archivar» | División con su temporada |

### C01 — StructureRow (Primera)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con botón «Archivar»
- **INSTANCE / ROLE:** División con su temporada
- **SOURCE COMPONENT:** RowStatic + Button
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** StructurePage > RowStatic (active)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=293.22 w=457.16 h=282
- CSS: width: 457.156px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 457.156px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=204.22 · padre 358×486.22
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Primera Temporada 2026 Archivar Quinta Temporada 2026 Archivar Sexta Temporada 2"

#### STATE

- activo

#### INTERACTION

- trigger: click en «Archivar» → ConfirmDialog

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 447,16×68 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle de una división es su temporada: «Temporada 2026».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_STRUCTURE_002_DIVISIONS

**SCREEN ID:** MGT_STRUCTURE_002_DIVISIONS

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Divisiones

**PURPOSE AS IMPLEMENTED:** Listado de divisiones con su temporada y la acción de archivar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/structure?tab=DIVISION

**ORIGIN:** MGT_STRUCTURE_001_SEASONS → pestaña «Divisiones»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** d1 Primera, d2 Quinta, d3 Sexta, d4 Séptima

**RESOURCE STATE:** 4 DIVISIONES ACTIVAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=DIVISION&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_001_SEASONS

**RESPONSIVE COUNTERPART:** Misma composición que la pestaña de temporadas.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** StructurePage (tab DIVISION)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_002_DIVISIONS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de divisiones
- **FOCAL 2:** Pestaña «Divisiones» activa con su contador
- **SUPPORTING:** Temporada de cada división en el detalle
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StructureRow (Primera) | RowStatic con botón «Archivar» | División con su temporada |

### C01 — StructureRow (Primera)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con botón «Archivar»
- **INSTANCE / ROLE:** División con su temporada
- **SOURCE COMPONENT:** RowStatic + Button
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** StructurePage > RowStatic (active)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=270.72 w=896 h=282
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=181.72 · padre 896×463.72
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Primera Temporada 2026 Archivar Quinta Temporada 2026 Archivar Sexta Temporada 2"

#### STATE

- activo

#### INTERACTION

- trigger: click en «Archivar» → ConfirmDialog

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 447,16×68 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle de una división es su temporada: «Temporada 2026».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
