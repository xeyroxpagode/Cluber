# SURFACE MAP — MOR_REPORTS_001_LIST

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_REPORTS_001_LIST

**SCREEN ID:** MOR_REPORTS_001_LIST

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — entrada

**PURPOSE AS IMPLEMENTED:** Página de informes con filtros de equipo y período en la URL y dos informes disponibles.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /reports

**ORIGIN:** Más → «Informes»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, match-sic, match-cuba

**RESOURCE STATE:** Sin filtros · 6 eventos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports?demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA, MOR_REPORTS_003_RENDIMIENTO, MOR_REPORTS_004_FILTERED_EMPTY

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl (896 px); los filtros se reparten en una fila.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ReportsPage, useFilteredEvents, Select, RowLink, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_001_LIST_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de los dos informes
- **FOCAL 2:** Filtros de equipo y período
- **SUPPORTING:** Título «Informes»
- **SECONDARY:** Lead sobre los filtros en la URL
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ReportRow (Asistencia) | RowLink | Acceso al informe de asistencia |
| C02 | ReportRow (Rendimiento) | RowLink | Acceso al informe de rendimiento |

### C01 — ReportRow (Asistencia)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al informe de asistencia
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=358.59 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×139.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Asistencia Presentes, ausentes y justificadas por evento"

#### STATE

- idle

#### INTERACTION

- trigger: click → /reports/attendance (con los filtros en la URL)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El enlace propaga los filtros activos: /reports/attendance?team=…&period=…

### C02 — ReportRow (Rendimiento)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al informe de rendimiento
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=434.23 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=75.64 · padre 358×139.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Rendimiento Resultados y datos por persona"

#### STATE

- idle

#### INTERACTION

- trigger: click → /reports/performance

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los dos Select de filtro tienen min-w-48 / min-w-44 (192 / 176 px) y caben en una fila en 390 porque el contenedor flex es wrap.

# MOR_REPORTS_001_LIST

**SCREEN ID:** MOR_REPORTS_001_LIST

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — entrada

**PURPOSE AS IMPLEMENTED:** Página de informes con filtros de equipo y período en la URL y dos informes disponibles.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /reports

**ORIGIN:** Más → «Informes»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, match-sic, match-cuba

**RESOURCE STATE:** Sin filtros · 6 eventos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports?demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA, MOR_REPORTS_003_RENDIMIENTO, MOR_REPORTS_004_FILTERED_EMPTY

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl (896 px); los filtros se reparten en una fila.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ReportsPage, useFilteredEvents, Select, RowLink, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_001_LIST_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de los dos informes
- **FOCAL 2:** Filtros de equipo y período
- **SUPPORTING:** Título «Informes»
- **SECONDARY:** Lead sobre los filtros en la URL
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ReportRow (Asistencia) | RowLink | Acceso al informe de asistencia |
| C02 | ReportRow (Rendimiento) | RowLink | Acceso al informe de rendimiento |

### C01 — ReportRow (Asistencia)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al informe de asistencia
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=336.09 w=896 h=63.64
- CSS: width: 896px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×139.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Asistencia Presentes, ausentes y justificadas por evento"

#### STATE

- idle

#### INTERACTION

- trigger: click → /reports/attendance (con los filtros en la URL)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El enlace propaga los filtros activos: /reports/attendance?team=…&period=…

### C02 — ReportRow (Rendimiento)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al informe de rendimiento
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=411.73 w=896 h=63.64
- CSS: width: 896px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=75.64 · padre 896×139.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Rendimiento Resultados y datos por persona"

#### STATE

- idle

#### INTERACTION

- trigger: click → /reports/performance

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los dos Select de filtro tienen min-w-48 / min-w-44 (192 / 176 px) y caben en una fila en 390 porque el contenedor flex es wrap.
