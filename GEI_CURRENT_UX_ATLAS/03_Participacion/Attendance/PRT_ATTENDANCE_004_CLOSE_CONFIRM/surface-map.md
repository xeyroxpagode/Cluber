# SURFACE MAP — PRT_ATTENDANCE_004_CLOSE_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_ATTENDANCE_004_CLOSE_CONFIRM

**SCREEN ID:** PRT_ATTENDANCE_004_CLOSE_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — confirmación de cierre

**PURPOSE AS IMPLEMENTED:** Diálogo de cierre de la planilla: explica qué pasa con los registros pendientes y exige un motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** PRT_ATTENDANCE_001_OPEN → «Cerrar asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, 3 personas sin registrar

**RESOURCE STATE:** CIERRE CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=coach.
2. Pulsar «Cerrar asistencia».

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_003_CLOSED

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Cerrar la asistencia», Modal, TextArea

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_004_CLOSE_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia con el número de personas sin registrar
- **FOCAL 2:** Campo «Motivo del cierre»
- **SUPPORTING:** Botones «Cancelar» y «Cerrar asistencia»
- **SECONDARY:** Título «Cerrar la asistencia»
- **AMBIENT:** Planilla atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CloseAttendanceConfirm | section[role=dialog] | Confirmación del cierre de la planilla |
| C02 | CloseReasonTextArea | TextArea | Motivo del cierre, obligatorio |

### C01 — CloseAttendanceConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del cierre de la planilla
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=248.66 w=390 h=595.34
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=248.66 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cerrar la asistencia Qué pasa si confirmás Quedan 3 personas sin registrar. No s"

#### STATE

- open

#### INTERACTION

- trigger: click en «Cerrar asistencia» → closeAttendance(eventId, reason)
- trigger: confirmar sin motivo → error y foco al campo de motivo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es danger y exige motivo (requireReason).

### C02 — CloseReasonTextArea

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextArea
- **INSTANCE / ROLE:** Motivo del cierre, obligatorio
- **SOURCE COMPONENT:** TextArea
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (extra del ConfirmDialog)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=529.48 w=350 h=65.38
- CSS: width: 350px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.07 · padre 350×116.45
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → habilita el cierre

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: ancho completo del diálogo, 2 filas
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Queda en el historial de la planilla.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1704 · scrollY 860 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# PRT_ATTENDANCE_004_CLOSE_CONFIRM

**SCREEN ID:** PRT_ATTENDANCE_004_CLOSE_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — confirmación de cierre

**PURPOSE AS IMPLEMENTED:** Diálogo de cierre de la planilla: explica qué pasa con los registros pendientes y exige un motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** PRT_ATTENDANCE_001_OPEN → «Cerrar asistencia»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, 3 personas sin registrar

**RESOURCE STATE:** CIERRE CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=coach.
2. Pulsar «Cerrar asistencia».

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_003_CLOSED

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Cerrar la asistencia», Modal, TextArea

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_004_CLOSE_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia con el número de personas sin registrar
- **FOCAL 2:** Campo «Motivo del cierre»
- **SUPPORTING:** Botones «Cancelar» y «Cerrar asistencia»
- **SECONDARY:** Título «Cerrar la asistencia»
- **AMBIENT:** Planilla atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CloseAttendanceConfirm | section[role=dialog] | Confirmación del cierre de la planilla |
| C02 | CloseReasonTextArea | TextArea | Motivo del cierre, obligatorio |

### C01 — CloseAttendanceConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del cierre de la planilla
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=163.17 w=512 h=573.66
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=163.17 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cerrar la asistencia Qué pasa si confirmás Quedan 3 personas sin registrar. No s"

#### STATE

- open

#### INTERACTION

- trigger: click en «Cerrar asistencia» → closeAttendance(eventId, reason)
- trigger: confirmar sin motivo → error y foco al campo de motivo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es danger y exige motivo (requireReason).

### C02 — CloseReasonTextArea

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextArea
- **INSTANCE / ROLE:** Motivo del cierre, obligatorio
- **SOURCE COMPONENT:** TextArea
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (extra del ConfirmDialog)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=484 y=422.31 w=472 h=65.38
- CSS: width: 472px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 472px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 472×116.45
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → habilita el cierre

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: ancho completo del diálogo, 2 filas
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Queda en el historial de la planilla.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1182 · scrollY 282 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
