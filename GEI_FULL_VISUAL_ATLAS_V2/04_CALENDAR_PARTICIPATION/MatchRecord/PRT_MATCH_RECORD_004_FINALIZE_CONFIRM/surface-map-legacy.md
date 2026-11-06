# SURFACE MAP — PRT_MATCH_RECORD_004_FINALIZE_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_MATCH_RECORD_004_FINALIZE_CONFIRM

**SCREEN ID:** PRT_MATCH_RECORD_004_FINALIZE_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — confirmación de finalización

**PURPOSE AS IMPLEMENTED:** Diálogo que explica que después de finalizar el acta sólo se modifica por corrección con motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-lomas/match-record

**ORIGIN:** PRT_MATCH_RECORD_002_EDITABLE → «Finalizar resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** FINALIZACIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/match-record?demo=coach.
2. Pulsar «Cargar el resultado».
3. Pulsar «Finalizar resultado».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_002_EDITABLE

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog tone=attention «Finalizar el resultado», Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia de la finalización
- **FOCAL 2:** Botón «Finalizar resultado»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Acta atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | FinalizeConfirmDialog | section[role=dialog] | Confirmación de la finalización del acta |

### C01 — FinalizeConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación de la finalización del acta
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=537.25 w=390 h=306.75
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=537.25 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Finalizar el resultado Qué pasa si confirmás Después de finalizar, el acta no se"

#### STATE

- open

#### INTERACTION

- trigger: click en «Finalizar resultado» → finalizeRecord(...)
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es attention y no exige motivo: la finalización no es terminal.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1207 · scrollY 363 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# PRT_MATCH_RECORD_004_FINALIZE_CONFIRM

**SCREEN ID:** PRT_MATCH_RECORD_004_FINALIZE_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — confirmación de finalización

**PURPOSE AS IMPLEMENTED:** Diálogo que explica que después de finalizar el acta sólo se modifica por corrección con motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-lomas/match-record

**ORIGIN:** PRT_MATCH_RECORD_002_EDITABLE → «Finalizar resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** FINALIZACIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/match-record?demo=coach.
2. Pulsar «Cargar el resultado».
3. Pulsar «Finalizar resultado».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_002_EDITABLE

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog tone=attention «Finalizar el resultado», Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia de la finalización
- **FOCAL 2:** Botón «Finalizar resultado»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Acta atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | FinalizeConfirmDialog | section[role=dialog] | Confirmación de la finalización del acta |

### C01 — FinalizeConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación de la finalización del acta
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=307.47 w=512 h=285.06
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=307.47 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Finalizar el resultado Qué pasa si confirmás Después de finalizar, el acta no se"

#### STATE

- open

#### INTERACTION

- trigger: click en «Finalizar resultado» → finalizeRecord(...)
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es attention y no exige motivo: la finalización no es terminal.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1012 · scrollY 112 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
