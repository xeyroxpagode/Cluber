# SURFACE MAP — CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET

**SCREEN ID:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — hoja de ciclo de vida

**PURPOSE AS IMPLEMENTED:** Sheet lateral con las transiciones de estado disponibles para el evento, cada una con su consecuencia escrita.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Acciones» → «Postergar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · hoja abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Acciones».
3. Pulsar «Postergar».

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_003_CANCEL_CONFIRM, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** El Sheet es siempre un panel lateral de 448 px (max-w-md): a 390 ocupa el 100% del ancho; a 1440, el 31%.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail > Sheet «Cambiar el estado del evento», LifecycleActions, Sheet

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cambiar el estado del evento»
- **FOCAL 2:** Opciones de transición con su consecuencia
- **SUPPORTING:** Ítem destructivo «Cancelar» con fondo rojo suave
- **SECONDARY:** Descripción del panel
- **AMBIENT:** Página de evento atenuada por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SheetPanel | section[role=dialog] | Panel con las transiciones de estado |
| C02 | LifecycleOption («Postergar») | button grid con título y consecuencia | Transición de estado con su consecuencia explicada |
| C03 | LifecycleOption destructiva («Cancelar») | button grid con fondo danger-soft | Acción terminal del evento |

### C01 — SheetPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Panel con las transiciones de estado
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > section[role=dialog]
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

- trigger: Escape → onClose
- focus trap: sí
- trigger: click en una opción → abre el ConfirmDialog correspondiente

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: 100% del viewport
- 1440: 448 px a la derecha

#### IMPLEMENTATION NOTES

- El título es «Cambiar el estado del evento» y la descripción «Estas acciones cambian la situación para todo el club.»

### C02 — LifecycleOption («Postergar»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** button grid con título y consecuencia
- **INSTANCE / ROLE:** Transición de estado con su consecuencia explicada
- **SOURCE COMPONENT:** LifecycleActions
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** LifecycleActions > button (option)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=109.03 w=350 h=94.47
- CSS: width: 350px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 4px · padding: 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 350×290.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Postergar El evento deja de tener horario vigente y todas las respuestas anterio"

#### STATE

- idle

#### INTERACTION

- trigger: click → setActive(option) → abre ConfirmDialog

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px de ancho (padding 16 px), dos líneas de texto
- 1440: 416 px dentro del panel de 448 px

#### IMPLEMENTATION NOTES

- La consecuencia de Postergar: «El evento deja de tener horario vigente y todas las respuestas anteriores piden confirmación de nuevo.»
- El botón tiene min-height 44 px (gei-target) y borde rounded-surface.

### C03 — LifecycleOption destructiva («Cancelar»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** button grid con fondo danger-soft
- **INSTANCE / ROLE:** Acción terminal del evento
- **SOURCE COMPONENT:** LifecycleActions
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** LifecycleActions > button (option.danger)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=215.5 w=350 h=94.47
- CSS: width: 350px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 4px · padding: 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=106.47 · padre 350×290.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(242, 194, 196) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cancelar El evento sale de la temporada. La información queda como referencia y "

#### STATE

- idle (danger)

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Cancelar»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px
- 1440: 416 px

#### IMPLEMENTATION NOTES

- Clases: border-danger-line bg-danger-soft hover:border-danger; el título va en text-danger.
- La consecuencia: «El evento sale de la temporada. La información queda como referencia y se puede restaurar después.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet (overflow-y auto)
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura el overflow y el foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: hoja inferior a pantalla completa (w-full h-full max-w-md).
- 1440: panel lateral de 448 px alineado a la derecha.
- El overlay tiene backdrop bg-overlay sin blur; el contenido de la página no se desplaza pero queda atenuado.

# CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET

**SCREEN ID:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — hoja de ciclo de vida

**PURPOSE AS IMPLEMENTED:** Sheet lateral con las transiciones de estado disponibles para el evento, cada una con su consecuencia escrita.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Acciones» → «Postergar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · hoja abierta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar «Acciones».
3. Pulsar «Postergar».

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_003_CANCEL_CONFIRM, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** El Sheet es siempre un panel lateral de 448 px (max-w-md): a 390 ocupa el 100% del ancho; a 1440, el 31%.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail > Sheet «Cambiar el estado del evento», LifecycleActions, Sheet

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cambiar el estado del evento»
- **FOCAL 2:** Opciones de transición con su consecuencia
- **SUPPORTING:** Ítem destructivo «Cancelar» con fondo rojo suave
- **SECONDARY:** Descripción del panel
- **AMBIENT:** Página de evento atenuada por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SheetPanel | section[role=dialog] | Panel con las transiciones de estado |
| C02 | LifecycleOption («Postergar») | button grid con título y consecuencia | Transición de estado con su consecuencia explicada |
| C03 | LifecycleOption destructiva («Cancelar») | button grid con fondo danger-soft | Acción terminal del evento |

### C01 — SheetPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Panel con las transiciones de estado
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > section[role=dialog]
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

- trigger: Escape → onClose
- focus trap: sí
- trigger: click en una opción → abre el ConfirmDialog correspondiente

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: 100% del viewport
- 1440: 448 px a la derecha

#### IMPLEMENTATION NOTES

- El título es «Cambiar el estado del evento» y la descripción «Estas acciones cambian la situación para todo el club.»

### C02 — LifecycleOption («Postergar»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** button grid con título y consecuencia
- **INSTANCE / ROLE:** Transición de estado con su consecuencia explicada
- **SOURCE COMPONENT:** LifecycleActions
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** LifecycleActions > button (option)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1012 y=91.64 w=408 h=94.47
- CSS: width: 408px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 408px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 374px · gap: 4px · padding: 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 408×290.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Postergar El evento deja de tener horario vigente y todas las respuestas anterio"

#### STATE

- idle

#### INTERACTION

- trigger: click → setActive(option) → abre ConfirmDialog

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px de ancho (padding 16 px), dos líneas de texto
- 1440: 416 px dentro del panel de 448 px

#### IMPLEMENTATION NOTES

- La consecuencia de Postergar: «El evento deja de tener horario vigente y todas las respuestas anteriores piden confirmación de nuevo.»
- El botón tiene min-height 44 px (gei-target) y borde rounded-surface.

### C03 — LifecycleOption destructiva («Cancelar»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** button grid con fondo danger-soft
- **INSTANCE / ROLE:** Acción terminal del evento
- **SOURCE COMPONENT:** LifecycleActions
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** LifecycleActions > button (option.danger)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1012 y=198.11 w=408 h=94.47
- CSS: width: 408px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 408px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 374px · gap: 4px · padding: 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=106.47 · padre 408×290.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(242, 194, 196) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cancelar El evento sale de la temporada. La información queda como referencia y "

#### STATE

- idle (danger)

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Cancelar»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px
- 1440: 416 px

#### IMPLEMENTATION NOTES

- Clases: border-danger-line bg-danger-soft hover:border-danger; el título va en text-danger.
- La consecuencia: «El evento sale de la temporada. La información queda como referencia y se puede restaurar después.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet (overflow-y auto)
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura el overflow y el foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: hoja inferior a pantalla completa (w-full h-full max-w-md).
- 1440: panel lateral de 448 px alineado a la derecha.
- El overlay tiene backdrop bg-overlay sin blur; el contenido de la página no se desplaza pero queda atenuado.
