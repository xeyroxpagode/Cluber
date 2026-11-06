# SURFACE MAP — MGT_STRUCTURE_003_LINES

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_STRUCTURE_003_LINES

**SCREEN ID:** MGT_STRUCTURE_003_LINES

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Líneas

**PURPOSE AS IMPLEMENTED:** Listado de líneas con la cantidad de equipos que las usan.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/structure?tab=LINE

**ORIGIN:** MGT_STRUCTURE_001_SEASONS → pestaña «Líneas»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** l1 A, l2 B, l3 Proyección

**RESOURCE STATE:** 3 LÍNEAS ACTIVAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=LINE&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_001_SEASONS

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** StructurePage (tab LINE)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_003_LINES_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de líneas con su conteo de equipos
- **FOCAL 2:** Pestaña «Líneas» activa
- **SUPPORTING:** —
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StructureRow (Proyección) | RowStatic con botón «Archivar» | Línea de la estructura |

### C01 — StructureRow (Proyección)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con botón «Archivar»
- **INSTANCE / ROLE:** Línea de la estructura
- **SOURCE COMPONENT:** RowStatic + Button
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** StructurePage > RowStatic (active)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=293.22 w=457.16 h=214
- CSS: width: 457.156px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 457.156px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=204.22 · padre 358×418.22
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "A 3 equipos lo usan Archivar B 1 equipo lo usa Archivar Proyección Archivar"

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

- La línea «Proyección» no la usa ningún equipo: su detalle queda vacío.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_STRUCTURE_003_LINES

**SCREEN ID:** MGT_STRUCTURE_003_LINES

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Líneas

**PURPOSE AS IMPLEMENTED:** Listado de líneas con la cantidad de equipos que las usan.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/structure?tab=LINE

**ORIGIN:** MGT_STRUCTURE_001_SEASONS → pestaña «Líneas»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** l1 A, l2 B, l3 Proyección

**RESOURCE STATE:** 3 LÍNEAS ACTIVAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=LINE&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_001_SEASONS

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** StructurePage (tab LINE)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_003_LINES_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de líneas con su conteo de equipos
- **FOCAL 2:** Pestaña «Líneas» activa
- **SUPPORTING:** —
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StructureRow (Proyección) | RowStatic con botón «Archivar» | Línea de la estructura |

### C01 — StructureRow (Proyección)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con botón «Archivar»
- **INSTANCE / ROLE:** Línea de la estructura
- **SOURCE COMPONENT:** RowStatic + Button
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** StructurePage > RowStatic (active)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=270.72 w=896 h=214
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=181.72 · padre 896×395.72
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "A 3 equipos lo usan Archivar B 1 equipo lo usa Archivar Proyección Archivar"

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

- La línea «Proyección» no la usa ningún equipo: su detalle queda vacío.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
