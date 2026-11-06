# SURFACE MAP — PRT_ATTENDANCE_007_NO_AUTHORITY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_ATTENDANCE_007_NO_AUTHORITY

**SCREEN ID:** PRT_ATTENDANCE_007_NO_AUTHORITY

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — sin autoridad

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado para quien no toma la asistencia del evento.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** URL directa

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** SIN ALCANCE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=player.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AttendancePage (!canManageAttendance) > Missing > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_007_NO_AUTHORITY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tomás la asistencia de este evento»
- **FOCAL 2:** Detalle «La asistencia la toma el entrenador del equipo.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoAttendanceAuthorityEmpty | Empty | Estado de acceso denegado |

### C01 — NoAttendanceAuthorityEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=89 w=358 h=143.08
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No tomás la asistencia de este evento La asistencia la toma el entrenador del eq"

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 poruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# PRT_ATTENDANCE_007_NO_AUTHORITY

**SCREEN ID:** PRT_ATTENDANCE_007_NO_AUTHORITY

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — sin autoridad

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado para quien no toma la asistencia del evento.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** URL directa

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** SIN ALCANCE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=player.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AttendancePage (!canManageAttendance) > Missing > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_007_NO_AUTHORITY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tomás la asistencia de este evento»
- **FOCAL 2:** Detalle «La asistencia la toma el entrenador del equipo.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoAttendanceAuthorityEmpty | Empty | Estado de acceso denegado |

### C01 — NoAttendanceAuthorityEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=89 w=768 h=143.08
- CSS: width: 768px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No tomás la asistencia de este evento La asistencia la toma el entrenador del eq"

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 poruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
