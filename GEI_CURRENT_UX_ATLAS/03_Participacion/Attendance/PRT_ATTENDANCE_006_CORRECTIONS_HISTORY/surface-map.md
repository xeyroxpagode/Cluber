# SURFACE MAP — PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**SCREEN ID:** PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — historial de correcciones

**PURPOSE AS IMPLEMENTED:** Sección «Correcciones» desplegada con el registro de cambios de asistencia: valor anterior, valor nuevo, motivo, autor y fecha.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-sic/attendance

**ORIGIN:** PRT_ATTENDANCE_003_CLOSED → «Ver 1»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, ah-1 (corrección de p6)

**RESOURCE STATE:** CERRADA · historial desplegado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/attendance?demo=coach.
2. Pulsar «Ver 1».

**RELATED SCREEN IDS:** PRT_ATTENDANCE_003_CLOSED, PRT_ATTENDANCE_005_CORRECTION_DIALOG

**RESPONSIVE COUNTERPART:** El historial se despliega dentro de la misma Surface; la fecha queda a la derecha en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AttendancePage > HistoryList, HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_006_CORRECTIONS_HISTORY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Entrada de corrección con el valor anterior y el nuevo
- **FOCAL 2:** Motivo de la corrección
- **SUPPORTING:** Autor y fecha
- **SECONDARY:** Botón «Ocultar»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CorrectionsHistoryList | ul grid | Registro de correcciones de asistencia |

### C01 — CorrectionsHistoryList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Registro de correcciones de asistencia
- **SOURCE COMPONENT:** HistoryList
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=17 y=-428.84 w=356 h=852.13
- CSS: width: 356px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 356px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 356px · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=1 dy=1 · padre 358×854.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Presente Presente Ausente Justificada Josefina Díaz Sin registrar "

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La acción se arma como «{nombre}: {valor anterior} → {valor nuevo}» y el motivo va en el campo reason.
- La fecha se formatea con toLocaleString('es-AR').

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2006 · scrollY 1086 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**SCREEN ID:** PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — historial de correcciones

**PURPOSE AS IMPLEMENTED:** Sección «Correcciones» desplegada con el registro de cambios de asistencia: valor anterior, valor nuevo, motivo, autor y fecha.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-sic/attendance

**ORIGIN:** PRT_ATTENDANCE_003_CLOSED → «Ver 1»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, ah-1 (corrección de p6)

**RESOURCE STATE:** CERRADA · historial desplegado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/attendance?demo=coach.
2. Pulsar «Ver 1».

**RELATED SCREEN IDS:** PRT_ATTENDANCE_003_CLOSED, PRT_ATTENDANCE_005_CORRECTION_DIALOG

**RESPONSIVE COUNTERPART:** El historial se despliega dentro de la misma Surface; la fecha queda a la derecha en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AttendancePage > HistoryList, HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_006_CORRECTIONS_HISTORY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Entrada de corrección con el valor anterior y el nuevo
- **FOCAL 2:** Motivo de la corrección
- **SUPPORTING:** Autor y fecha
- **SECONDARY:** Botón «Ocultar»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CorrectionsHistoryList | ul grid | Registro de correcciones de asistencia |

### C01 — CorrectionsHistoryList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Registro de correcciones de asistencia
- **SOURCE COMPONENT:** HistoryList
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=385 y=71.14 w=894 h=487
- CSS: width: 894px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 894px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 894px · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=1 dy=1 · padre 896×489
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Presente Presente Ausente Justificada Josefina Díaz Sin registrar "

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La acción se arma como «{nombre}: {valor anterior} → {valor nuevo}» y el motivo va en el campo reason.
- La fecha se formatea con toLocaleString('es-AR').

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1418 · scrollY 443 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
