# SURFACE MAP — PRT_ATTENDANCE_002_NOT_OPENED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_ATTENDANCE_002_NOT_OPENED

**SCREEN ID:** PRT_ATTENDANCE_002_NOT_OPENED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — todavía no abierta

**PURPOSE AS IMPLEMENTED:** La planilla cerrada antes de empezar: un banner explica que nadie ve los datos hasta abrirla y la acción principal es «Abrir asistencia».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/attendance

**ORIGIN:** Detalle de evento → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** attendanceOpened=false · 0 registros

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/attendance?demo=coach.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_003_CLOSED

**RESPONSIVE COUNTERPART:** El banner ocupa arriba; la retícula de contadores queda en 2 columnas en 390.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AttendancePage (!event.attendanceOpened) > Banner, Banner, Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_002_NOT_OPENED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «La planilla todavía no está abierta»
- **FOCAL 2:** Botón «Abrir asistencia»
- **SUPPORTING:** Contadores en cero
- **SECONDARY:** Lista de personas sin registros
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NotOpenedBanner | Banner tone=attention | Explica que la planilla aún no está abierta |
| C02 | OpenAttendanceButton | Button primary | Abrir la planilla de asistencia |

### C01 — NotOpenedBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Explica que la planilla aún no está abierta
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=276.13 w=358 h=103.06
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=187.13 · padre 358×1648.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "La planilla todavía no está abierta Abrila recién cuando estés tomando la asiste"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas de texto
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Copy: «Abrila recién cuando estés tomando la asistencia. Nadie ve datos antes de eso.»

### C02 — OpenAttendanceButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Abrir la planilla de asistencia
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary «Abrir asistencia»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1693.38 w=149.03 h=44
- CSS: width: 149.031px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 149.031px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Abrir asistencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → openAttendance(eventId)

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Es la única acción primaria de la pantalla cuando la planilla no está abierta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1849 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_ATTENDANCE_002_NOT_OPENED

**SCREEN ID:** PRT_ATTENDANCE_002_NOT_OPENED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — todavía no abierta

**PURPOSE AS IMPLEMENTED:** La planilla cerrada antes de empezar: un banner explica que nadie ve los datos hasta abrirla y la acción principal es «Abrir asistencia».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/attendance

**ORIGIN:** Detalle de evento → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** attendanceOpened=false · 0 registros

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/attendance?demo=coach.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_003_CLOSED

**RESPONSIVE COUNTERPART:** El banner ocupa arriba; la retícula de contadores queda en 2 columnas en 390.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AttendancePage (!event.attendanceOpened) > Banner, Banner, Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_002_NOT_OPENED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «La planilla todavía no está abierta»
- **FOCAL 2:** Botón «Abrir asistencia»
- **SUPPORTING:** Contadores en cero
- **SECONDARY:** Lista de personas sin registros
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NotOpenedBanner | Banner tone=attention | Explica que la planilla aún no está abierta |
| C02 | OpenAttendanceButton | Button primary | Abrir la planilla de asistencia |

### C01 — NotOpenedBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Explica que la planilla aún no está abierta
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention
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

- contained-by div · offset dx=0 dy=152.13 · padre 896×1152.53
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "La planilla todavía no está abierta Abrila recién cuando estés tomando la asiste"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas de texto
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Copy: «Abrila recién cuando estés tomando la asistencia. Nadie ve datos antes de eso.»

### C02 — OpenAttendanceButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Abrir la planilla de asistencia
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary «Abrir asistencia»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=1197.53 w=149.03 h=44
- CSS: width: 149.031px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 149.031px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Abrir asistencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → openAttendance(eventId)

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Es la única acción primaria de la pantalla cuando la planilla no está abierta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1306 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
