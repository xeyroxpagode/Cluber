# SURFACE MAP — PRT_ATTENDANCE_003_CLOSED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_ATTENDANCE_003_CLOSED

**SCREEN ID:** PRT_ATTENDANCE_003_CLOSED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — cerrada

**PURPOSE AS IMPLEMENTED:** Planilla cerrada: el badge pasa a «Cerrada», se avisa de las personas que quedaron sin registrar y se puede seguir anotando con motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-sic/attendance

**ORIGIN:** Detalle de evento → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, attendanceHistory con 1 corrección

**RESOURCE STATE:** CERRADA · 7 de 8 registradas · 1 corrección

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/attendance?demo=coach.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**RESPONSIVE COUNTERPART:** Misma retícula de contadores; el banner de personas sin registrar ocupa arriba.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AttendancePage (closed) > Banner, StateBadge value=CLOSED

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_003_CLOSED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «1 quedaron sin registrar»
- **FOCAL 2:** Banner verde «La planilla está cerrada» al final de la pantalla
- **SUPPORTING:** Contadores
- **SECONDARY:** Historial de correcciones
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | UnrecordedBanner | Banner tone=attention | Avisa de las personas sin registro tras el cierre |
| C02 | ClosedSuccessBanner | Banner tone=success | Confirma que la planilla está cerrada |

### C01 — UnrecordedBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Avisa de las personas sin registro tras el cierre
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention (closed && unrecorded.length > 0)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=276.13 w=358 h=124.75
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=187.13 · padre 358×1729.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "1 quedaron sin registrar Cerrar la planilla no significa que estuvieran ausentes"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Copy: «Cerrar la planilla no significa que estuvieran ausentes. Esas personas siguen sin registro y podés anotarlas con un motivo.»

### C02 — ClosedSuccessBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Confirma que la planilla está cerrada
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success (closed)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1715.06 w=358 h=103.06
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×103.06
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "La planilla está cerrada Podés seguir anotando correcciones con motivo. No se pi"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Sustituye al botón de cerrar: en una planilla cerrada no queda acción de lifecycle.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1930 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_ATTENDANCE_003_CLOSED

**SCREEN ID:** PRT_ATTENDANCE_003_CLOSED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — cerrada

**PURPOSE AS IMPLEMENTED:** Planilla cerrada: el badge pasa a «Cerrada», se avisa de las personas que quedaron sin registrar y se puede seguir anotando con motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-sic/attendance

**ORIGIN:** Detalle de evento → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, attendanceHistory con 1 corrección

**RESOURCE STATE:** CERRADA · 7 de 8 registradas · 1 corrección

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/attendance?demo=coach.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**RESPONSIVE COUNTERPART:** Misma retícula de contadores; el banner de personas sin registrar ocupa arriba.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AttendancePage (closed) > Banner, StateBadge value=CLOSED

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_003_CLOSED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «1 quedaron sin registrar»
- **FOCAL 2:** Banner verde «La planilla está cerrada» al final de la pantalla
- **SUPPORTING:** Contadores
- **SECONDARY:** Historial de correcciones
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | UnrecordedBanner | Banner tone=attention | Avisa de las personas sin registro tras el cierre |
| C02 | ClosedSuccessBanner | Banner tone=success | Confirma que la planilla está cerrada |

### C01 — UnrecordedBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Avisa de las personas sin registro tras el cierre
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention (closed && unrecorded.length > 0)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=241.13 w=896 h=81.38
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=152.13 · padre 896×1189.91
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "1 quedaron sin registrar Cerrar la planilla no significa que estuvieran ausentes"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Copy: «Cerrar la planilla no significa que estuvieran ausentes. Esas personas siguen sin registro y podés anotarlas con un motivo.»

### C02 — ClosedSuccessBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Confirma que la planilla está cerrada
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success (closed)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=1197.53 w=517.17 h=81.38
- CSS: width: 517.172px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 517.172px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×81.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "La planilla está cerrada Podés seguir anotando correcciones con motivo. No se pi"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Sustituye al botón de cerrar: en una planilla cerrada no queda acción de lifecycle.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1343 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
