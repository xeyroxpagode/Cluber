# SURFACE MAP — CAL_EVENT_DETAIL_003_CANCEL_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_003_CANCEL_CONFIRM

**SCREEN ID:** CAL_EVENT_DETAIL_003_CANCEL_CONFIRM

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — confirmación de cancelación

**PURPOSE AS IMPLEMENTED:** Diálogo de confirmación de la acción terminal «Cancelar evento»: explica la consecuencia y exige un motivo escrito.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET → «Cancelar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · confirmación abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Acciones».
3. Pulsar «Cancelar evento».
4. Pulsar «Cancelar» en la hoja de ciclo de vida.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET

**RESPONSIVE COUNTERPART:** 390: hoja inferior pegada al borde inferior, ancho completo. 1440: diálogo centrado de 512 px.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog, Modal, Banner tone=danger, TextArea

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner rojo «Qué pasa si confirmás» con la consecuencia
- **FOCAL 2:** Campo de motivo «Por qué lo hacés»
- **SUPPORTING:** Botones «Cancelar» (quiet) y «Cancelar» (danger)
- **SECONDARY:** Detalle opcional «Detalle»
- **AMBIENT:** Hoja de ciclo de vida atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ModalPanel (ConfirmDialog) | section[role=dialog] | Diálogo de confirmación |
| C02 | ConsequenceBanner | Banner tone=danger | Explica la consecuencia de la acción terminal |
| C03 | ReasonTextArea | TextArea required | Motivo obligatorio de la transición |

### C01 — ModalPanel (ConfirmDialog)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Diálogo de confirmación
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=844
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cambiar el estado del evento Estas acciones cambian la situación para todo el cl"

#### STATE

- open

#### INTERACTION

- trigger: Escape → onClose (vuelve a la hoja de ciclo de vida)
- focus trap: sí; el foco inicial evita el botón «Cerrar»

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo, pegado abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El título del diálogo es el nombre de la opción: «Cancelar».

### C02 — ConsequenceBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=danger
- **INSTANCE / ROLE:** Explica la consecuencia de la acción terminal
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=danger
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=315.97 w=350 h=124.75
- CSS: width: 350px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 350×433.03
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(242, 194, 196) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-danger (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Qué pasa si confirmás El evento sale de la temporada. La información queda como "

#### STATE

- danger

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: flex wrap con el icono a la izquierda del texto
- 1440: idéntico

#### IMPLEMENTATION NOTES

- AlertCircle 18 px en text-danger; fondo bg-danger-soft con borde border-danger-line.

### C03 — ReasonTextArea

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** TextArea required
- **INSTANCE / ROLE:** Motivo obligatorio de la transición
- **SOURCE COMPONENT:** TextArea / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (requireReason)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=661.94 w=350 h=87.06
- CSS: width: 350px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 350×138.14
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío — el error de «falta el motivo» aparece al confirmar

#### INTERACTION

- trigger: escribir → habilita la confirmación
- trigger: confirmar sin motivo → error «Escribí el motivo: queda registrado en el historial.» y foco al campo

#### MOTION

- transition-colors duration-micro en el control

#### RESPONSIVE

- 390: ancho completo del diálogo, 3 filas (rows=3)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Queda registrado con tu nombre y la fecha.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: `items-end justify-center` → el diálogo ocupa el ancho completo pegado abajo; `max-h-[92dvh]`.
- 1440: `sm:items-center sm:p-6` y `sm:max-w-lg` (512 px).
- El ConfirmDialog anida un Modal: el segundo overlay (Sheet) queda debajo y el backdrop del Modal lo oscurece.

# CAL_EVENT_DETAIL_003_CANCEL_CONFIRM

**SCREEN ID:** CAL_EVENT_DETAIL_003_CANCEL_CONFIRM

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — confirmación de cancelación

**PURPOSE AS IMPLEMENTED:** Diálogo de confirmación de la acción terminal «Cancelar evento»: explica la consecuencia y exige un motivo escrito.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET → «Cancelar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · confirmación abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Acciones».
3. Pulsar «Cancelar evento».
4. Pulsar «Cancelar» en la hoja de ciclo de vida.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET

**RESPONSIVE COUNTERPART:** 390: hoja inferior pegada al borde inferior, ancho completo. 1440: diálogo centrado de 512 px.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog, Modal, Banner tone=danger, TextArea

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner rojo «Qué pasa si confirmás» con la consecuencia
- **FOCAL 2:** Campo de motivo «Por qué lo hacés»
- **SUPPORTING:** Botones «Cancelar» (quiet) y «Cancelar» (danger)
- **SECONDARY:** Detalle opcional «Detalle»
- **AMBIENT:** Hoja de ciclo de vida atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ModalPanel (ConfirmDialog) | section[role=dialog] | Diálogo de confirmación |
| C02 | ConsequenceBanner | Banner tone=danger | Explica la consecuencia de la acción terminal |
| C03 | ReasonTextArea | TextArea required | Motivo obligatorio de la transición |

### C01 — ModalPanel (ConfirmDialog)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Diálogo de confirmación
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=992 y=0 w=448 h=900
- CSS: width: 448px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 448px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=992 dy=0 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cambiar el estado del evento Estas acciones cambian la situación para todo el cl"

#### STATE

- open

#### INTERACTION

- trigger: Escape → onClose (vuelve a la hoja de ciclo de vida)
- focus trap: sí; el foco inicial evita el botón «Cerrar»

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo, pegado abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El título del diálogo es el nombre de la opción: «Cancelar».

### C02 — ConsequenceBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=danger
- **INSTANCE / ROLE:** Explica la consecuencia de la acción terminal
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=danger
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=484 y=241.33 w=472 h=103.06
- CSS: width: 472px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 472px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 472×411.34
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(242, 194, 196) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-danger (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Qué pasa si confirmás El evento sale de la temporada. La información queda como "

#### STATE

- danger

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: flex wrap con el icono a la izquierda del texto
- 1440: idéntico

#### IMPLEMENTATION NOTES

- AlertCircle 18 px en text-danger; fondo bg-danger-soft con borde border-danger-line.

### C03 — ReasonTextArea

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** TextArea required
- **INSTANCE / ROLE:** Motivo obligatorio de la transición
- **SOURCE COMPONENT:** TextArea / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (requireReason)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=484 y=565.61 w=472 h=87.06
- CSS: width: 472px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 472px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 472×138.14
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío — el error de «falta el motivo» aparece al confirmar

#### INTERACTION

- trigger: escribir → habilita la confirmación
- trigger: confirmar sin motivo → error «Escribí el motivo: queda registrado en el historial.» y foco al campo

#### MOTION

- transition-colors duration-micro en el control

#### RESPONSIVE

- 390: ancho completo del diálogo, 3 filas (rows=3)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Queda registrado con tu nombre y la fecha.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: `items-end justify-center` → el diálogo ocupa el ancho completo pegado abajo; `max-h-[92dvh]`.
- 1440: `sm:items-center sm:p-6` y `sm:max-w-lg` (512 px).
- El ConfirmDialog anida un Modal: el segundo overlay (Sheet) queda debajo y el backdrop del Modal lo oscurece.
