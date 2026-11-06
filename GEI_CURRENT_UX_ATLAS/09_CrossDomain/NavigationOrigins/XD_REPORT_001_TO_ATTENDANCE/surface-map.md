# SURFACE MAP — XD_REPORT_001_TO_ATTENDANCE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_REPORT_001_TO_ATTENDANCE

**SCREEN ID:** XD_REPORT_001_TO_ATTENDANCE

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Informe → Planilla de asistencia

**PURPOSE AS IMPLEMENTED:** Trayecto desde el informe de asistencia hasta la planilla del evento.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /reports/attendance

**ORIGIN:** Más → «Informes» → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** INFORME → PLANILLA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/attendance?demo=coach.
2. Pulsar el enlace «Ver planilla».

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA, PRT_ATTENDANCE_001_OPEN

**RESPONSIVE COUNTERPART:** El destino usa max-w-4xl (896 px) con la retícula de contadores de 4 columnas en 1440.

**SOURCE FILES:** src/features/account-insight.tsx, src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ReportDetail > Link «Ver planilla», AttendancePage

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_REPORT_001_TO_ATTENDANCE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Contadores de asistencia
- **FOCAL 2:** Filas de personas con sus botones de valor
- **SUPPORTING:** Badge «Abierta»
- **SECONDARY:** Bloque «Correcciones»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttendanceCounters | Surface con 4 celdas | Punto de llegada del informe |

### C01 — AttendanceCounters

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface con 4 celdas
- **INSTANCE / ROLE:** Punto de llegada del informe
- **SOURCE COMPONENT:** Surface
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > Surface (contadores)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=46 y=304.13 w=130 h=17.39
- CSS: width: 130px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 130px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=13 dy=11 · padre 156×60.64

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400 · letter-spacing: 0.3px · text-transform: uppercase

#### CONTENT

- visible: "Presente"

#### STATE

- 3 presentes / 1 ausente / 1 justificada / 3 sin registrar

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: grid-cols-2 → 2×2 celdas de 156×60,64 px
- 1440: sm:grid-cols-4 → una fila de 4 celdas

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1704 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva su propia retícula de contadores.

# XD_REPORT_001_TO_ATTENDANCE

**SCREEN ID:** XD_REPORT_001_TO_ATTENDANCE

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Informe → Planilla de asistencia

**PURPOSE AS IMPLEMENTED:** Trayecto desde el informe de asistencia hasta la planilla del evento.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /reports/attendance

**ORIGIN:** Más → «Informes» → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** INFORME → PLANILLA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/attendance?demo=coach.
2. Pulsar el enlace «Ver planilla».

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA, PRT_ATTENDANCE_001_OPEN

**RESPONSIVE COUNTERPART:** El destino usa max-w-4xl (896 px) con la retícula de contadores de 4 columnas en 1440.

**SOURCE FILES:** src/features/account-insight.tsx, src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ReportDetail > Link «Ver planilla», AttendancePage

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_REPORT_001_TO_ATTENDANCE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Contadores de asistencia
- **FOCAL 2:** Filas de personas con sus botones de valor
- **SUPPORTING:** Badge «Abierta»
- **SECONDARY:** Bloque «Correcciones»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttendanceCounters | Surface con 4 celdas | Punto de llegada del informe |

### C01 — AttendanceCounters

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface con 4 celdas
- **INSTANCE / ROLE:** Punto de llegada del informe
- **SOURCE COMPONENT:** Surface
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > Surface (contadores)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=418 y=273.13 w=178.5 h=17.39
- CSS: width: 178.5px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 178.5px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=13 dy=11 · padre 204.5×60.64

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400 · letter-spacing: 0.3px · text-transform: uppercase

#### CONTENT

- visible: "Presente"

#### STATE

- 3 presentes / 1 ausente / 1 justificada / 3 sin registrar

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: grid-cols-2 → 2×2 celdas de 156×60,64 px
- 1440: sm:grid-cols-4 → una fila de 4 celdas

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1182 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva su propia retícula de contadores.
