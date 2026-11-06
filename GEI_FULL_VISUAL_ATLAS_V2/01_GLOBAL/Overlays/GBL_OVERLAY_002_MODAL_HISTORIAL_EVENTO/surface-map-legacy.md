# SURFACE MAP — GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**SCREEN ID:** GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**DOMAIN:** 00_Global

**SURFACE NAME:** Diálogo modal «Historial del evento»

**PURPOSE AS IMPLEMENTED:** Modal genérico de lectura del historial. Es el overlay Modal del producto, con trampa de foco, bloqueo de scroll y botón de cierre.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Ver todo»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba.history (3 líneas)

**RESOURCE STATE:** SCHEDULED · modal abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Ver todo» en la sección «Historial».

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_004_HISTORY_MODAL, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** 390: panel pegado al borde inferior con esquinas superiores redondeadas (rounded-t-overlay) y ancho completo. 1440: panel centrado con rounded-overlay y ancho máximo lg (512 px) más padding de 24 px.

**SOURCE FILES:** src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** Modal, HistoryList, TimelineEntry, useFocusTrap

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Historial del evento»
- **FOCAL 2:** Entradas del historial con fecha y autor
- **SUPPORTING:** Líneas separadoras entre entradas
- **SECONDARY:** Botón de cierre (X)
- **AMBIENT:** Página de evento oscurecida por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ModalBackdrop | div absolute inset-0 | Fondo oscurecido + cierre por click fuera |
| C02 | ModalPanel | section[role=dialog] | Contenedor accesible del diálogo |
| C03 | ModalHeader + CloseButton | div con IconButton | Título, descripción y cierre |
| C04 | HistoryList | ul grid | Entradas del historial |

### C01 — ModalBackdrop

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div absolute inset-0
- **INSTANCE / ROLE:** Fondo oscurecido + cierre por click fuera
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal > div[aria-hidden]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=844
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(16, 23, 37, 0.42) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- visible

#### INTERACTION

- trigger: click → onClose()

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cubre todo el viewport
- 1440: cubre todo el viewport

#### IMPLEMENTATION NOTES

- bg-overlay + backdrop-blur-[2px].

### C02 — ModalPanel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Contenedor accesible del diálogo
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal > section[role=dialog]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=518.38 w=390 h=325.63
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=518.38 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Historial del evento Horario cambiado de 16:00 a 18:00 19 oct, 06:00 p. m. Tomás"

#### STATE

- open (aria-modal=true)

#### INTERACTION

- trigger: Escape → CustomEvent 'gei:close' → onClose
- focus trap: sí — Tab y Shift+Tab ciclan dentro del panel
- foco inicial: el primer control que no sea el botón «Cerrar»

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: rounded-t-overlay, ancho 100%, pegado abajo
- 1440: rounded-overlay, sm:max-w-lg (512 px), centrado

#### IMPLEMENTATION NOTES

- max-h-[92dvh]; el cuerpo interno hace overflow-y-auto.

### C03 — ModalHeader + CloseButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** div con IconButton
- **INSTANCE / ROLE:** Título, descripción y cierre
- **SOURCE COMPONENT:** Modal + IconButton
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal > header / IconButton label=«Cerrar»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=334 y=530.38 w=44 h=44
- CSS: width: 44px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 44px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · margin: -4px -8px 0px 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=334 dy=12 · padre 390×73

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-x (19x19)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle

#### INTERACTION

- trigger: click → onClose
- trigger: Escape → onClose

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 44×44 px, -mr-2 -mt-1
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C04 — HistoryList

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Entradas del historial
- **SOURCE COMPONENT:** HistoryList / TimelineEntry
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=-714.06 w=324 h=216.31
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · gap: 4px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=50.25 · padre 358×283.56

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Convocadas 8 convocadas Asistencia Todavía no se registró asistencia Resultado B"

#### STATE

- filled (3 entradas)

#### INTERACTION

- No interactivo en este uso

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada: borde inferior 1 px, padding vertical 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal (overflow-y auto)
- what remains sticky/fixed: Contenedor fixed inset-0 z-50; el <body> recibe overflow:hidden durante la apertura (useFocusTrap)
- initial scroll: scroll del body = 0; el body queda bloqueado
- scroll restoration observed: al cerrar se restaura el overflow previo del body y el foco vuelve al elemento activo previo
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 1174 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: `items-end justify-center` → hoja inferior; `max-h-[92dvh]`; ancho 100%.
- 1440: `sm:items-center sm:p-6` → panel centrado; `sm:max-w-lg` (512 px) para size=md.
- El fondo es bg-overlay (rgb(16 23 37 / 0.42)) con backdrop-blur-[2px].

# GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**SCREEN ID:** GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**DOMAIN:** 00_Global

**SURFACE NAME:** Diálogo modal «Historial del evento»

**PURPOSE AS IMPLEMENTED:** Modal genérico de lectura del historial. Es el overlay Modal del producto, con trampa de foco, bloqueo de scroll y botón de cierre.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Ver todo»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba.history (3 líneas)

**RESOURCE STATE:** SCHEDULED · modal abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Ver todo» en la sección «Historial».

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_004_HISTORY_MODAL, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** 390: panel pegado al borde inferior con esquinas superiores redondeadas (rounded-t-overlay) y ancho completo. 1440: panel centrado con rounded-overlay y ancho máximo lg (512 px) más padding de 24 px.

**SOURCE FILES:** src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** Modal, HistoryList, TimelineEntry, useFocusTrap

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Historial del evento»
- **FOCAL 2:** Entradas del historial con fecha y autor
- **SUPPORTING:** Líneas separadoras entre entradas
- **SECONDARY:** Botón de cierre (X)
- **AMBIENT:** Página de evento oscurecida por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ModalBackdrop | div absolute inset-0 | Fondo oscurecido + cierre por click fuera |
| C02 | ModalPanel | section[role=dialog] | Contenedor accesible del diálogo |
| C03 | ModalHeader + CloseButton | div con IconButton | Título, descripción y cierre |
| C04 | HistoryList | ul grid | Entradas del historial |

### C01 — ModalBackdrop

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div absolute inset-0
- **INSTANCE / ROLE:** Fondo oscurecido + cierre por click fuera
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal > div[aria-hidden]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=900
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×900
- aligned with parent left edge
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(16, 23, 37, 0.42) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- visible

#### INTERACTION

- trigger: click → onClose()

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cubre todo el viewport
- 1440: cubre todo el viewport

#### IMPLEMENTATION NOTES

- bg-overlay + backdrop-blur-[2px].

### C02 — ModalPanel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Contenedor accesible del diálogo
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal > section[role=dialog]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=295.88 w=512 h=308.23
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=295.88 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Historial del evento Horario cambiado de 16:00 a 18:00 19 oct, 06:00 p. m. Tomás"

#### STATE

- open (aria-modal=true)

#### INTERACTION

- trigger: Escape → CustomEvent 'gei:close' → onClose
- focus trap: sí — Tab y Shift+Tab ciclan dentro del panel
- foco inicial: el primer control que no sea el botón «Cerrar»

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: rounded-t-overlay, ancho 100%, pegado abajo
- 1440: rounded-overlay, sm:max-w-lg (512 px), centrado

#### IMPLEMENTATION NOTES

- max-h-[92dvh]; el cuerpo interno hace overflow-y-auto.

### C03 — ModalHeader + CloseButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** div con IconButton
- **INSTANCE / ROLE:** Título, descripción y cierre
- **SOURCE COMPONENT:** Modal + IconButton
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal > header / IconButton label=«Cerrar»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=920 y=307.88 w=44 h=44
- CSS: width: 44px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 44px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · margin: -4px -8px 0px 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=456 dy=12 · padre 512×73

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-x (19x19)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle

#### INTERACTION

- trigger: click → onClose
- trigger: Escape → onClose

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 44×44 px, -mr-2 -mt-1
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C04 — HistoryList

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Entradas del historial
- **SOURCE COMPONENT:** HistoryList / TimelineEntry
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=-468.56 w=510 h=198.92
- CSS: width: 510px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 510px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 510px · gap: 4px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=54.25 · padre 552×274.17

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Convocadas 8 convocadas Asistencia Todavía no se registró asistencia Resultado B"

#### STATE

- filled (3 entradas)

#### INTERACTION

- No interactivo en este uso

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada: borde inferior 1 px, padding vertical 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal (overflow-y auto)
- what remains sticky/fixed: Contenedor fixed inset-0 z-50; el <body> recibe overflow:hidden durante la apertura (useFocusTrap)
- initial scroll: scroll del body = 0; el body queda bloqueado
- scroll restoration observed: al cerrar se restaura el overflow previo del body y el foco vuelve al elemento activo previo
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 870 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: `items-end justify-center` → hoja inferior; `max-h-[92dvh]`; ancho 100%.
- 1440: `sm:items-center sm:p-6` → panel centrado; `sm:max-w-lg` (512 px) para size=md.
- El fondo es bg-overlay (rgb(16 23 37 / 0.42)) con backdrop-blur-[2px].
