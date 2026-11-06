# SURFACE MAP — PRT_ATTENDANCE_001_OPEN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_ATTENDANCE_001_OPEN

**SCREEN ID:** PRT_ATTENDANCE_001_OPEN

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — abierta

**PURPOSE AS IMPLEMENTED:** Planilla de asistencia abierta: contadores arriba, filas con tres botones de valor por persona y un bloque de correcciones.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** Detalle de evento → «Operación pendiente» → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, p0..p7 con 5 registros

**RESOURCE STATE:** attendanceOpened=true · sin cerrar · 5 de 8 registradas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=coach.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_002_NOT_OPENED, PRT_ATTENDANCE_003_CLOSED, PRT_ATTENDANCE_004_CLOSE_CONFIRM

**RESPONSIVE COUNTERPART:** 390: los contadores se acomodan en 2 columnas (grid-cols-2) y cada fila de persona apila nombre y botones. 1440: los contadores pasan a 4 columnas (sm:grid-cols-4) y la fila de persona reparte nombre y botones en la misma línea.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AttendancePage, Surface (contadores), Button (Presente/Ausente/Justificada), HistoryList

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_001_OPEN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Contadores de presente / ausente / justificada / sin registrar
- **FOCAL 2:** Botones de valor por persona
- **SUPPORTING:** Badge «Abierta» y lead «abierta»
- **SECONDARY:** Bloque «Correcciones»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttendanceCounters | Surface con grid de 4 celdas | Conteos de la planilla |
| C02 | AttendanceRow (persona) | li con tres botones de valor | Registro de asistencia de una persona |
| C03 | AttendanceValueButton (activo) | button aria-pressed | Valor de asistencia seleccionado |
| C04 | CorrectionsSurface | Surface con botón expansor | Historial de correcciones de asistencia |

### C01 — AttendanceCounters

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface con grid de 4 celdas
- **INSTANCE / ROLE:** Conteos de la planilla
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

- 390: grid-cols-2: 2 filas de 2 celdas de 156×60,64 px
- 1440: sm:grid-cols-4: una fila de 4 celdas

#### IMPLEMENTATION NOTES

- Cada celda es un div con borde border-line, fondo bg-control (la cuarta, «Sin registrar», usa bg-surface) y padding 10/12 px.
- La etiqueta va en text-meta uppercase tracking-wide y la cifra en gei-l4 (17 px, peso 650).

### C02 — AttendanceRow (persona)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** li con tres botones de valor
- **INSTANCE / ROLE:** Registro de asistencia de una persona
- **SOURCE COMPONENT:** AttendancePage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > ul > li > div.flex
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=17 y=488.41 w=356 h=106.64
- CSS: width: 356px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 356px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 356×852.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Presente Presente Ausente Justificada"

#### STATE

- registrada (el botón activo lleva fondo sólido y texto blanco)

#### INTERACTION

- trigger: click en un valor sin registro previo → markAttendance sin motivo
- trigger: click en un valor sobre un registro existente → abre el diálogo de corrección con motivo

#### MOTION

- transition-colors duration-micro en los botones

#### RESPONSIVE

- 390: nombre y botones se apilan (flex-wrap)
- 1440: nombre a la izquierda (min-w-40) y botones a la derecha

#### IMPLEMENTATION NOTES

- El texto secundario distingue «Sin registrar — no es lo mismo que ausente» de un valor real.
- Los tres botones miden 44 px de alto (min-h-11) con label text-meta font-semibold.

### C03 — AttendanceValueButton (activo)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** button aria-pressed
- **INSTANCE / ROLE:** Valor de asistencia seleccionado
- **SOURCE COMPONENT:** AttendancePage > button (ATTENDANCE_OPTIONS)
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > button[aria-pressed]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=29 y=542.05 w=77.59 h=44
- CSS: width: 77.5938px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 77.5938px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 254.45×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(28, 107, 74) · color: rgb(255, 255, 255) · border: 1px solid rgb(28, 107, 74) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Presente"

#### STATE

- pressed (border-success bg-success text-white)

#### INTERACTION

- trigger: click → corrección con motivo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: min-height 44 px, px-3
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Los tres tonos: Presente → success, Ausente → danger, Justificada → warning.

### C04 — CorrectionsSurface

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Surface con botón expansor
- **INSTANCE / ROLE:** Historial de correcciones de asistencia
- **SOURCE COMPONENT:** Surface + HistoryList
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > Surface (Correcciones)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=1408.83 w=110.28 h=21.25
- CSS: width: 110.281px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 110.281px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=6.3 · padre 324×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Correcciones"

#### STATE

- plegada (el botón dice «Ver 0»)

#### INTERACTION

- trigger: click en «Ver 0» → despliega el historial

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

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

- 390: la retícula de contadores es `grid-cols-2` → 2×2 celdas de 156×60,64 px.
- 1440: `sm:grid-cols-4` → 4 celdas en una fila.
- La fila de persona usa `flex-wrap` con `min-w-40` para el nombre: a 390 los tres botones bajan a una segunda línea; a 1440 caben a la derecha del nombre.

# PRT_ATTENDANCE_001_OPEN

**SCREEN ID:** PRT_ATTENDANCE_001_OPEN

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — abierta

**PURPOSE AS IMPLEMENTED:** Planilla de asistencia abierta: contadores arriba, filas con tres botones de valor por persona y un bloque de correcciones.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** Detalle de evento → «Operación pendiente» → «Asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, p0..p7 con 5 registros

**RESOURCE STATE:** attendanceOpened=true · sin cerrar · 5 de 8 registradas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=coach.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_002_NOT_OPENED, PRT_ATTENDANCE_003_CLOSED, PRT_ATTENDANCE_004_CLOSE_CONFIRM

**RESPONSIVE COUNTERPART:** 390: los contadores se acomodan en 2 columnas (grid-cols-2) y cada fila de persona apila nombre y botones. 1440: los contadores pasan a 4 columnas (sm:grid-cols-4) y la fila de persona reparte nombre y botones en la misma línea.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AttendancePage, Surface (contadores), Button (Presente/Ausente/Justificada), HistoryList

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_001_OPEN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Contadores de presente / ausente / justificada / sin registrar
- **FOCAL 2:** Botones de valor por persona
- **SUPPORTING:** Badge «Abierta» y lead «abierta»
- **SECONDARY:** Bloque «Correcciones»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttendanceCounters | Surface con grid de 4 celdas | Conteos de la planilla |
| C02 | AttendanceRow (persona) | li con tres botones de valor | Registro de asistencia de una persona |
| C03 | AttendanceValueButton (activo) | button aria-pressed | Valor de asistencia seleccionado |
| C04 | CorrectionsSurface | Surface con botón expansor | Historial de correcciones de asistencia |

### C01 — AttendanceCounters

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface con grid de 4 celdas
- **INSTANCE / ROLE:** Conteos de la planilla
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

- 390: grid-cols-2: 2 filas de 2 celdas de 156×60,64 px
- 1440: sm:grid-cols-4: una fila de 4 celdas

#### IMPLEMENTATION NOTES

- Cada celda es un div con borde border-line, fondo bg-control (la cuarta, «Sin registrar», usa bg-surface) y padding 10/12 px.
- La etiqueta va en text-meta uppercase tracking-wide y la cifra en gei-l4 (17 px, peso 650).

### C02 — AttendanceRow (persona)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** li con tres botones de valor
- **INSTANCE / ROLE:** Registro de asistencia de una persona
- **SOURCE COMPONENT:** AttendancePage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > ul > li > div.flex
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=385 y=388.77 w=894 h=61
- CSS: width: 894px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 894px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 894×487
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Presente Presente Ausente Justificada"

#### STATE

- registrada (el botón activo lleva fondo sólido y texto blanco)

#### INTERACTION

- trigger: click en un valor sin registro previo → markAttendance sin motivo
- trigger: click en un valor sobre un registro existente → abre el diálogo de corrección con motivo

#### MOTION

- transition-colors duration-micro en los botones

#### RESPONSIVE

- 390: nombre y botones se apilan (flex-wrap)
- 1440: nombre a la izquierda (min-w-40) y botones a la derecha

#### IMPLEMENTATION NOTES

- El texto secundario distingue «Sin registrar — no es lo mismo que ausente» de un valor real.
- Los tres botones miden 44 px de alto (min-h-11) con label text-meta font-semibold.

### C03 — AttendanceValueButton (activo)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** button aria-pressed
- **INSTANCE / ROLE:** Valor de asistencia seleccionado
- **SOURCE COMPONENT:** AttendancePage > button (ATTENDANCE_OPTIONS)
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > button[aria-pressed]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1012.55 y=396.77 w=77.59 h=44
- CSS: width: 77.5938px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 77.5938px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 254.45×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(28, 107, 74) · color: rgb(255, 255, 255) · border: 1px solid rgb(28, 107, 74) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Presente"

#### STATE

- pressed (border-success bg-success text-white)

#### INTERACTION

- trigger: click → corrección con motivo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: min-height 44 px, px-3
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Los tres tonos: Presente → success, Ausente → danger, Justificada → warning.

### C04 — CorrectionsSurface

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Surface con botón expansor
- **INSTANCE / ROLE:** Historial de correcciones de asistencia
- **SOURCE COMPONENT:** Surface + HistoryList
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AttendancePage > Surface (Correcciones)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=948.06 w=110.28 h=21.25
- CSS: width: 110.281px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 110.281px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=6.29 · padre 854×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Correcciones"

#### STATE

- plegada (el botón dice «Ver 0»)

#### INTERACTION

- trigger: click en «Ver 0» → despliega el historial

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

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

- 390: la retícula de contadores es `grid-cols-2` → 2×2 celdas de 156×60,64 px.
- 1440: `sm:grid-cols-4` → 4 celdas en una fila.
- La fila de persona usa `flex-wrap` con `min-w-40` para el nombre: a 390 los tres botones bajan a una segunda línea; a 1440 caben a la derecha del nombre.
