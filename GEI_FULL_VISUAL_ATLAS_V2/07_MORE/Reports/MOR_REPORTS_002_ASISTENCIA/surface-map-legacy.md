# SURFACE MAP — MOR_REPORTS_002_ASISTENCIA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_REPORTS_002_ASISTENCIA

**SCREEN ID:** MOR_REPORTS_002_ASISTENCIA

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — asistencia por evento

**PURPOSE AS IMPLEMENTED:** Informe de asistencia: una fila por evento con planilla, con los recuentos y el porcentaje de presencia.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /reports/attendance

**ORIGIN:** MOR_REPORTS_001_LIST → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, match-sic

**RESOURCE STATE:** 2 eventos con planilla

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/attendance?demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_003_RENDIMIENTO, XD_REPORT_001_TO_ATTENDANCE

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; las filas usan el mismo RowStatic que en el resto del producto.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ReportDetail (attendance), DetailSection, RowStatic, Link

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_002_ASISTENCIA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de eventos con sus porcentajes
- **FOCAL 2:** Enlace «Ver planilla»
- **SUPPORTING:** Filtros de equipo y período
- **SECONDARY:** Lead «{n} eventos en el período.»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttendanceReportRow | RowStatic con Link | Evento con recuentos de asistencia |

### C01 — AttendanceReportRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con Link
- **INSTANCE / ROLE:** Evento con recuentos de asistencia
- **SOURCE COMPONENT:** RowStatic + Link
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportDetail > RowStatic (attendance)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=369.75 w=0 h=20.25
- CSS: width: 0px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 0px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 0×57.03
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "GEI vs. Lomas"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Ver planilla» → /events/match-lomas/attendance

#### MOTION

- transition-colors duration-micro en el enlace

#### RESPONSIVE

- 390: 358 px; la meta con los recuentos puede ocupar 2 líneas
- 1440: 896 px

#### IMPLEMENTATION NOTES

- La meta concatena presentes, ausentes, justificadas y el porcentaje de presencia calculado sobre los registros existentes.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MOR_REPORTS_002_ASISTENCIA

**SCREEN ID:** MOR_REPORTS_002_ASISTENCIA

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — asistencia por evento

**PURPOSE AS IMPLEMENTED:** Informe de asistencia: una fila por evento con planilla, con los recuentos y el porcentaje de presencia.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /reports/attendance

**ORIGIN:** MOR_REPORTS_001_LIST → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, match-sic

**RESOURCE STATE:** 2 eventos con planilla

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/attendance?demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_003_RENDIMIENTO, XD_REPORT_001_TO_ATTENDANCE

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; las filas usan el mismo RowStatic que en el resto del producto.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ReportDetail (attendance), DetailSection, RowStatic, Link

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_002_ASISTENCIA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de eventos con sus porcentajes
- **FOCAL 2:** Enlace «Ver planilla»
- **SUPPORTING:** Filtros de equipo y período
- **SECONDARY:** Lead «{n} eventos en el período.»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttendanceReportRow | RowStatic con Link | Evento con recuentos de asistencia |

### C01 — AttendanceReportRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con Link
- **INSTANCE / ROLE:** Evento con recuentos de asistencia
- **SOURCE COMPONENT:** RowStatic + Link
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ReportDetail > RowStatic (attendance)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=396 y=369.75 w=429.69 h=20.25
- CSS: width: 429.688px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 429.688px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 429.69×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "GEI vs. Lomas"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Ver planilla» → /events/match-lomas/attendance

#### MOTION

- transition-colors duration-micro en el enlace

#### RESPONSIVE

- 390: 358 px; la meta con los recuentos puede ocupar 2 líneas
- 1440: 896 px

#### IMPLEMENTATION NOTES

- La meta concatena presentes, ausentes, justificadas y el porcentaje de presencia calculado sobre los registros existentes.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
