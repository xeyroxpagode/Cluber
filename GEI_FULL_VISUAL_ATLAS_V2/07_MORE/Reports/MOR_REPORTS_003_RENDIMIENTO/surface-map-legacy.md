# SURFACE MAP — MOR_REPORTS_003_RENDIMIENTO

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_REPORTS_003_RENDIMIENTO

**SCREEN ID:** MOR_REPORTS_003_RENDIMIENTO

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — rendimiento

**PURPOSE AS IMPLEMENTED:** Informe de rendimiento: tabla de resultados finalizados y desglose por persona con Presencias, goles y asistencias.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /reports/performance

**ORIGIN:** MOR_REPORTS_001_LIST → «Rendimiento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic (FINAL 3–1), match-lomas

**RESOURCE STATE:** 1 evento finalizado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/performance?demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA

**RESPONSIVE COUNTERPART:** 390: la tabla de resultados tiene contenedor con overflow-x-auto y min-w-[34rem]; el desglose por persona va debajo en una columna.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ReportDetail (performance), table, RowStatic

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_003_RENDIMIENTO_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Tabla de resultados finalizados
- **FOCAL 2:** Lista de datos por persona
- **SUPPORTING:** Filtros
- **SECONDARY:** Lead del encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ResultsTable | table con contenedor scrollable | Resultados de los eventos finalizados |

### C01 — ResultsTable

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** table con contenedor scrollable
- **INSTANCE / ROLE:** Resultados de los eventos finalizados
- **SOURCE COMPONENT:** table (HTML nativo, no el primitive DataTable)
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportDetail > table (performance)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=357.75 w=358 h=78.39
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: table · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×78.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Evento Fecha Resultado GEI vs. SIC jue, 15 oct 3–1"

#### STATE

- 1 fila

#### INTERACTION

- trigger: click en el nombre del evento → /events/:id/match-record

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: min-width 544 px dentro de un contenedor con overflow-x-auto
- 1440: ancho completo del contenedor

#### IMPLEMENTATION NOTES

- El enlace del nombre del evento es un Link con text-body font-semibold text-interactive.
- La tabla no usa el primitive DataTable del catálogo: está escrita directamente en la pantalla.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 966 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la tabla es la única superficie con scroll horizontal propio: el div contenedor tiene overflow-x-auto y la tabla min-w-[34rem] (544 px).
- A 1440 la tabla entra completa en el ancho del contenedor de 896 px.

# MOR_REPORTS_003_RENDIMIENTO

**SCREEN ID:** MOR_REPORTS_003_RENDIMIENTO

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — rendimiento

**PURPOSE AS IMPLEMENTED:** Informe de rendimiento: tabla de resultados finalizados y desglose por persona con Presencias, goles y asistencias.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /reports/performance

**ORIGIN:** MOR_REPORTS_001_LIST → «Rendimiento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic (FINAL 3–1), match-lomas

**RESOURCE STATE:** 1 evento finalizado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/performance?demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA

**RESPONSIVE COUNTERPART:** 390: la tabla de resultados tiene contenedor con overflow-x-auto y min-w-[34rem]; el desglose por persona va debajo en una columna.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ReportDetail (performance), table, RowStatic

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_003_RENDIMIENTO_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Tabla de resultados finalizados
- **FOCAL 2:** Lista de datos por persona
- **SUPPORTING:** Filtros
- **SECONDARY:** Lead del encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ResultsTable | table con contenedor scrollable | Resultados de los eventos finalizados |

### C01 — ResultsTable

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** table con contenedor scrollable
- **INSTANCE / ROLE:** Resultados de los eventos finalizados
- **SOURCE COMPONENT:** table (HTML nativo, no el primitive DataTable)
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportDetail > table (performance)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=357.75 w=896 h=78.39
- CSS: width: 896px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width 0px, max-width none

#### LAYOUT

- display: table · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×78.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Evento Fecha Resultado GEI vs. SIC jue, 15 oct 3–1"

#### STATE

- 1 fila

#### INTERACTION

- trigger: click en el nombre del evento → /events/:id/match-record

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: min-width 544 px dentro de un contenedor con overflow-x-auto
- 1440: ancho completo del contenedor

#### IMPLEMENTATION NOTES

- El enlace del nombre del evento es un Link con text-body font-semibold text-interactive.
- La tabla no usa el primitive DataTable del catálogo: está escrita directamente en la pantalla.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 918 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la tabla es la única superficie con scroll horizontal propio: el div contenedor tiene overflow-x-auto y la tabla min-w-[34rem] (544 px).
- A 1440 la tabla entra completa en el ancho del contenedor de 896 px.
