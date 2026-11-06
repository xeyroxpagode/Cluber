# SURFACE MAP — PRT_MATCH_RECORD_005_CORRECT_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_MATCH_RECORD_005_CORRECT_CONFIRM

**SCREEN ID:** PRT_MATCH_RECORD_005_CORRECT_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — confirmación de corrección

**PURPOSE AS IMPLEMENTED:** Diálogo de corrección de un resultado ya oficial: muestra el marcador anterior y el nuevo y exige un motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-sic/match-record

**ORIGIN:** PRT_MATCH_RECORD_003_FINAL → «Corregir el resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic

**RESOURCE STATE:** CORRECCIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/match-record?demo=coach.
2. Pulsar «Corregir el resultado».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_003_FINAL, PRT_MATCH_RECORD_008_HISTORY_OPEN

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CorrectionRecordDialog, ConfirmDialog requireReason, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_005_CORRECT_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia «3-1 → 3-1. El resultado anterior queda guardado con el motivo.»
- **FOCAL 2:** Campo «Por qué corregís el resultado»
- **SUPPORTING:** Botones «Cancelar» y «Guardar corrección»
- **SECONDARY:** Título «Corregir el resultado»
- **AMBIENT:** Acta atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CorrectRecordDialog | section[role=dialog] | Corrección del resultado oficial |

### C01 — CorrectRecordDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Corrección del resultado oficial
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=381.11 w=390 h=462.89
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=381.11 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Corregir el resultado Qué pasa si confirmás 3-1 → 3-1. El resultado anterior que"

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar corrección» → correctRecord(event.id, {...}, reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El motivo es obligatorio y el texto de la consecuencia usa guion corto «3-1 → 3-1».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1231 · scrollY 387 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# PRT_MATCH_RECORD_005_CORRECT_CONFIRM

**SCREEN ID:** PRT_MATCH_RECORD_005_CORRECT_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — confirmación de corrección

**PURPOSE AS IMPLEMENTED:** Diálogo de corrección de un resultado ya oficial: muestra el marcador anterior y el nuevo y exige un motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-sic/match-record

**ORIGIN:** PRT_MATCH_RECORD_003_FINAL → «Corregir el resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic

**RESOURCE STATE:** CORRECCIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/match-record?demo=coach.
2. Pulsar «Corregir el resultado».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_003_FINAL, PRT_MATCH_RECORD_008_HISTORY_OPEN

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CorrectionRecordDialog, ConfirmDialog requireReason, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_005_CORRECT_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia «3-1 → 3-1. El resultado anterior queda guardado con el motivo.»
- **FOCAL 2:** Campo «Por qué corregís el resultado»
- **SUPPORTING:** Botones «Cancelar» y «Guardar corrección»
- **SECONDARY:** Título «Corregir el resultado»
- **AMBIENT:** Acta atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CorrectRecordDialog | section[role=dialog] | Corrección del resultado oficial |

### C01 — CorrectRecordDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Corrección del resultado oficial
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=229.39 w=512 h=441.2
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=229.39 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Corregir el resultado Qué pasa si confirmás 3-1 → 3-1. El resultado anterior que"

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar corrección» → correctRecord(event.id, {...}, reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El motivo es obligatorio y el texto de la consecuencia usa guion corto «3-1 → 3-1».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1014 · scrollY 114 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
