# SURFACE MAP — CAL_EVENT_DETAIL_004_HISTORY_MODAL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_004_HISTORY_MODAL

**SCREEN ID:** CAL_EVENT_DETAIL_004_HISTORY_MODAL

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — modal de historial

**PURPOSE AS IMPLEMENTED:** Modal con la lista completa de movimientos del evento.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Ver todo»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba.history

**RESOURCE STATE:** SCHEDULED · modal abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Ver todo» en la sección Historial.

**RELATED SCREEN IDS:** GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**RESPONSIVE COUNTERPART:** Mismo componente Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventDetail > Modal «Historial del evento», HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_004_HISTORY_MODAL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Historial del evento»
- **FOCAL 2:** Entradas con texto, autor y fecha
- **SUPPORTING:** Líneas separadoras
- **SECONDARY:** Botón de cierre
- **AMBIENT:** Página de evento oscurecida

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | HistoryModal | section[role=dialog] | Historial completo del evento |
| C02 | HistoryList | ul grid | Movimientos del evento |

### C01 — HistoryModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Historial completo del evento
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
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

- open

#### INTERACTION

- trigger: Escape / X / click en el backdrop → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- —

### C02 — HistoryList

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Movimientos del evento
- **SOURCE COMPONENT:** HistoryList
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

- 3 entradas

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior y padding vertical 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 1174 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal; cambia la posición (abajo ↔ centro) y el ancho máximo.

# CAL_EVENT_DETAIL_004_HISTORY_MODAL

**SCREEN ID:** CAL_EVENT_DETAIL_004_HISTORY_MODAL

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — modal de historial

**PURPOSE AS IMPLEMENTED:** Modal con la lista completa de movimientos del evento.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Ver todo»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba.history

**RESOURCE STATE:** SCHEDULED · modal abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Ver todo» en la sección Historial.

**RELATED SCREEN IDS:** GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**RESPONSIVE COUNTERPART:** Mismo componente Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventDetail > Modal «Historial del evento», HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_004_HISTORY_MODAL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Historial del evento»
- **FOCAL 2:** Entradas con texto, autor y fecha
- **SUPPORTING:** Líneas separadoras
- **SECONDARY:** Botón de cierre
- **AMBIENT:** Página de evento oscurecida

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | HistoryModal | section[role=dialog] | Historial completo del evento |
| C02 | HistoryList | ul grid | Movimientos del evento |

### C01 — HistoryModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Historial completo del evento
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
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

- open

#### INTERACTION

- trigger: Escape / X / click en el backdrop → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- —

### C02 — HistoryList

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Movimientos del evento
- **SOURCE COMPONENT:** HistoryList
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

- 3 entradas

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior y padding vertical 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 870 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal; cambia la posición (abajo ↔ centro) y el ancho máximo.
