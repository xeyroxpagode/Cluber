# SURFACE MAP — PRT_ATTENDANCE_005_CORRECTION_DIALOG

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_ATTENDANCE_005_CORRECTION_DIALOG

**SCREEN ID:** PRT_ATTENDANCE_005_CORRECTION_DIALOG

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — diálogo de corrección

**PURPOSE AS IMPLEMENTED:** Al cambiar un valor ya registrado se abre un diálogo con el valor anterior y el nuevo, y exige un motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** PRT_ATTENDANCE_001_OPEN → «Ausente» sobre una persona ya registrada

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, p0 (Victoria Berg, PRESENT)

**RESOURCE STATE:** CORRECCIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=coach.
2. Desplazar a y = 700.
3. Pulsar el botón «Ausente» de la primera fila registrada.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CorrectionDialog, ConfirmDialog, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_005_CORRECTION_DIALOG_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cambiar la asistencia de {persona}»
- **FOCAL 2:** Consecuencia «Presente → Ausente. Se guarda el valor anterior.»
- **SUPPORTING:** Campo «Por qué cambiás el valor»
- **SECONDARY:** Botones «Cancelar» y «Guardar corrección»
- **AMBIENT:** Planilla atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CorrectionDialog | section[role=dialog] | Corrección de un valor de asistencia |

### C01 — CorrectionDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Corrección de un valor de asistencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=400.3 w=390 h=443.7
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=400.3 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cambiar la asistencia de Victoria Berg Qué pasa si confirmás Presente → Ausente."

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar corrección» → markAttendance(..., reason)
- trigger: Escape → cierra sin corregir

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El título incluye el nombre de la persona: «Cambiar la asistencia de Victoria Berg».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1704 · scrollY 142 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# PRT_ATTENDANCE_005_CORRECTION_DIALOG

**SCREEN ID:** PRT_ATTENDANCE_005_CORRECTION_DIALOG

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Asistencia — diálogo de corrección

**PURPOSE AS IMPLEMENTED:** Al cambiar un valor ya registrado se abre un diálogo con el valor anterior y el nuevo, y exige un motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-lomas/attendance

**ORIGIN:** PRT_ATTENDANCE_001_OPEN → «Ausente» sobre una persona ya registrada

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, p0 (Victoria Berg, PRESENT)

**RESOURCE STATE:** CORRECCIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/attendance?demo=coach.
2. Desplazar a y = 700.
3. Pulsar el botón «Ausente» de la primera fila registrada.

**RELATED SCREEN IDS:** PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_006_CORRECTIONS_HISTORY

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CorrectionDialog, ConfirmDialog, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_ATTENDANCE_005_CORRECTION_DIALOG_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cambiar la asistencia de {persona}»
- **FOCAL 2:** Consecuencia «Presente → Ausente. Se guarda el valor anterior.»
- **SUPPORTING:** Campo «Por qué cambiás el valor»
- **SECONDARY:** Botones «Cancelar» y «Guardar corrección»
- **AMBIENT:** Planilla atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CorrectionDialog | section[role=dialog] | Corrección de un valor de asistencia |

### C01 — CorrectionDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Corrección de un valor de asistencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=240.23 w=512 h=419.52
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=240.23 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cambiar la asistencia de Victoria Berg Qué pasa si confirmás Presente → Ausente."

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar corrección» → markAttendance(..., reason)
- trigger: Escape → cierra sin corregir

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El título incluye el nombre de la persona: «Cambiar la asistencia de Victoria Berg».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1182 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
