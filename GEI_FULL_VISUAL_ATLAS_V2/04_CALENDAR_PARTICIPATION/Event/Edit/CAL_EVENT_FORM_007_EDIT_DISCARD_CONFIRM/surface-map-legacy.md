# SURFACE MAP — CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM

**SCREEN ID:** CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — confirmación de descarte

**PURPOSE AS IMPLEMENTED:** Diálogo que pide confirmar el descarte de los cambios escritos en el formulario.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/edit

**ORIGIN:** CAL_EVENT_FORM_006_EDIT_DIRTY → «Descartar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** DIRTY · confirmación abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/edit?demo=coach.
2. Escribir en el campo #field-title.
3. Pulsar «Descartar».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_006_EDIT_DIRTY

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm > ConfirmDialog «¿Descartás los cambios?», ConfirmDialog, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner de consecuencia «Qué pasa si confirmás»
- **FOCAL 2:** Botón «Descartar cambios»
- **SUPPORTING:** Título «¿Descartás los cambios?»
- **SECONDARY:** Botón «Cancelar» (quiet)
- **AMBIENT:** Formulario atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DiscardConfirmDialog | section[role=dialog] | Confirmación del descarte |

### C01 — DiscardConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del descarte
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=535.25 w=390 h=308.75
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=535.25 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Descartás los cambios? Qué pasa si confirmás Vuelves a la última versión guarda"

#### STATE

- open

#### INTERACTION

- trigger: click en «Descartar cambios» → restaura el baseline, limpia dirty y vuelve al detalle
- trigger: Escape → cierra sin descartar

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es danger y NO exige motivo (requireReason no está activo en este diálogo).

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2478 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal; cambia la posición y el ancho máximo.

# CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM

**SCREEN ID:** CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — confirmación de descarte

**PURPOSE AS IMPLEMENTED:** Diálogo que pide confirmar el descarte de los cambios escritos en el formulario.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/edit

**ORIGIN:** CAL_EVENT_FORM_006_EDIT_DIRTY → «Descartar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** DIRTY · confirmación abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/edit?demo=coach.
2. Escribir en el campo #field-title.
3. Pulsar «Descartar».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_006_EDIT_DIRTY

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm > ConfirmDialog «¿Descartás los cambios?», ConfirmDialog, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner de consecuencia «Qué pasa si confirmás»
- **FOCAL 2:** Botón «Descartar cambios»
- **SUPPORTING:** Título «¿Descartás los cambios?»
- **SECONDARY:** Botón «Cancelar» (quiet)
- **AMBIENT:** Formulario atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DiscardConfirmDialog | section[role=dialog] | Confirmación del descarte |

### C01 — DiscardConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del descarte
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=306.47 w=512 h=287.06
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=306.47 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Descartás los cambios? Qué pasa si confirmás Vuelves a la última versión guarda"

#### STATE

- open

#### INTERACTION

- trigger: click en «Descartar cambios» → restaura el baseline, limpia dirty y vuelve al detalle
- trigger: Escape → cierra sin descartar

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es danger y NO exige motivo (requireReason no está activo en este diálogo).

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1982 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal; cambia la posición y el ancho máximo.
