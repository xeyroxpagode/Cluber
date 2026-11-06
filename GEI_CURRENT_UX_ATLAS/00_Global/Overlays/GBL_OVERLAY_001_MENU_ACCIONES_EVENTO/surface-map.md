# SURFACE MAP — GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**SCREEN ID:** GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**DOMAIN:** 00_Global

**SURFACE NAME:** Menú contextual «Acciones» del evento

**PURPOSE AS IMPLEMENTED:** Menú desplegable de acciones secundarias y destructivas del detalle de evento. Es el overlay más repetido del producto (detalle de evento, detalle de comunicado, mensaje de conversación).

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → botón «Acciones»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · menú abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar el botón «Acciones» del encabezado.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**RESPONSIVE COUNTERPART:** El menú se posiciona con right-0 respecto del botón; el ancho mínimo es 224 px (min-w-56). En 390 el borde derecho del panel queda en x=205,89 y el izquierdo en x=-18,89, es decir 18,89 px por fuera del viewport.

**SOURCE FILES:** src/shared/ui.tsx

**SOURCE SYMBOLS:** Menu

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Panel del menú con las tres acciones
- **FOCAL 2:** Ítem destructivo «Cancelar evento» en rojo
- **SUPPORTING:** Separadores de 1 px y padding de 4 px del panel
- **SECONDARY:** Página de evento desenfocada por el fondo del overlay
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MenuTrigger («Acciones») | button con chevron | Abre el menú |
| C02 | MenuPanel | div[role=menu] absolute | Contenedor de las acciones |
| C03 | MenuItem destructivo («Cancelar evento») | button[role=menuitem] | Acción terminal |

### C01 — MenuTrigger («Acciones»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** button con chevron
- **INSTANCE / ROLE:** Abre el menú
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu > button[aria-haspopup=menu]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=111.09 y=211.22 w=94.02 h=36
- CSS: width: 94.0156px · min-width: 0px · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 94.0156px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 0px 10px · min-height: 36px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 94.02×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-down (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Acciones"

#### STATE

- expanded (aria-expanded=true)

#### INTERACTION

- trigger: click → alterna open
- al abrir, el foco se mueve al primer ítem del menú (setTimeout 0)

#### MOTION

- Sin transición de apertura

#### RESPONSIVE

- 390: min-height 36 px (gei-target-sm)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — MenuPanel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div[role=menu] absolute
- **INSTANCE / ROLE:** Contenedor de las acciones
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu > div[role=menu]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=-18.89 y=251.22 w=224 h=142
- CSS: width: 224px · min-width: 224px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 224px, min-width 224px, max-width none

#### LAYOUT

- display: block · padding: 4px · min-width: 224px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-129.98 dy=40 · padre 94.02×36
- positioned absolute · z-index 30

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Editar evento Postergar Cancelar evento"

#### STATE

- open

#### INTERACTION

- trigger: click fuera (mousedown) → se cierra
- trigger: Escape → se cierra
- trigger: click en un ítem → cierra y ejecuta la acción

#### MOTION

- Sin animación de entrada ni de salida (aparece y desaparece por montaje/desmontaje).

#### RESPONSIVE

- 390: 224×142 px; left -18,89 (fuera de pantalla), top 251,22
- 1440: 224 px de ancho (min-w-56), alineado a la derecha del botón

#### IMPLEMENTATION NOTES

- class: absolute top-[calc(100%+4px)] z-30 min-w-56 rounded-surface border border-line bg-raised p-1 shadow-overlay right-0
- offset respecto del trigger: 4 px vertical (calc(100% + 4px)).
- backdrop: ninguno. No hay oscurecimiento de la página detrás del menú.
- focus trap: no. El foco se libera al cerrar y vuelve al elemento que estaba activo antes (el botón), por el cleanup del useEffect.
- dismissal: click fuera, Escape, o selección de un ítem.

### C03 — MenuItem destructivo («Cancelar evento»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** button[role=menuitem]
- **INSTANCE / ROLE:** Acción terminal
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu > button[role=menuitem] (danger)
- **PARENT:** div[menu]
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=-13.89 y=344.22 w=214 h=44
- CSS: width: 214px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 214px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 8px · padding: 0px 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div[menu] · offset dx=5 dy=93 · padre 224×142

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle (15x15)
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 500

#### CONTENT

- visible: "Cancelar evento"

#### STATE

- idle

#### INTERACTION

- trigger: click → setSheet('lifecycle') (abre el Sheet de ciclo de vida)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: min-height 44 px, padding-inline 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El ítem destructivo lleva AlertCircle 15 px y color text-danger; hover bg-danger-soft.

## SCROLL CONTRACT

- what scrolls: la página (el overlay no bloquea el scroll del documento)
- what remains sticky/fixed: El overlay es absolute dentro de un div.relative; z-index 30
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: panel de 224×142 px en x=-18,89 → el borde izquierdo se sale del viewport 18,89 px.
- 1440: mismo componente, mismo offset de 4 px respecto del botón; la posición horizontal depende del lugar del botón en la fila de acciones.

# GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**SCREEN ID:** GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**DOMAIN:** 00_Global

**SURFACE NAME:** Menú contextual «Acciones» del evento

**PURPOSE AS IMPLEMENTED:** Menú desplegable de acciones secundarias y destructivas del detalle de evento. Es el overlay más repetido del producto (detalle de evento, detalle de comunicado, mensaje de conversación).

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → botón «Acciones»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · menú abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Pulsar el botón «Acciones» del encabezado.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO

**RESPONSIVE COUNTERPART:** El menú se posiciona con right-0 respecto del botón; el ancho mínimo es 224 px (min-w-56). En 390 el borde derecho del panel queda en x=205,89 y el izquierdo en x=-18,89, es decir 18,89 px por fuera del viewport.

**SOURCE FILES:** src/shared/ui.tsx

**SOURCE SYMBOLS:** Menu

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Panel del menú con las tres acciones
- **FOCAL 2:** Ítem destructivo «Cancelar evento» en rojo
- **SUPPORTING:** Separadores de 1 px y padding de 4 px del panel
- **SECONDARY:** Página de evento desenfocada por el fondo del overlay
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MenuTrigger («Acciones») | button con chevron | Abre el menú |
| C02 | MenuPanel | div[role=menu] absolute | Contenedor de las acciones |
| C03 | MenuItem destructivo («Cancelar evento») | button[role=menuitem] | Acción terminal |

### C01 — MenuTrigger («Acciones»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** button con chevron
- **INSTANCE / ROLE:** Abre el menú
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu > button[aria-haspopup=menu]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1185.98 y=116.59 w=94.02 h=36
- CSS: width: 94.0156px · min-width: 0px · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 94.0156px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 0px 10px · min-height: 36px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 94.02×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-down (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Acciones"

#### STATE

- expanded (aria-expanded=true)

#### INTERACTION

- trigger: click → alterna open
- al abrir, el foco se mueve al primer ítem del menú (setTimeout 0)

#### MOTION

- Sin transición de apertura

#### RESPONSIVE

- 390: min-height 36 px (gei-target-sm)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — MenuPanel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div[role=menu] absolute
- **INSTANCE / ROLE:** Contenedor de las acciones
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu > div[role=menu]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1056 y=156.59 w=224 h=142
- CSS: width: 224px · min-width: 224px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 224px, min-width 224px, max-width none

#### LAYOUT

- display: block · padding: 4px · min-width: 224px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-129.98 dy=40 · padre 94.02×36
- positioned absolute · z-index 30

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Editar evento Postergar Cancelar evento"

#### STATE

- open

#### INTERACTION

- trigger: click fuera (mousedown) → se cierra
- trigger: Escape → se cierra
- trigger: click en un ítem → cierra y ejecuta la acción

#### MOTION

- Sin animación de entrada ni de salida (aparece y desaparece por montaje/desmontaje).

#### RESPONSIVE

- 390: 224×142 px; left -18,89 (fuera de pantalla), top 251,22
- 1440: 224 px de ancho (min-w-56), alineado a la derecha del botón

#### IMPLEMENTATION NOTES

- class: absolute top-[calc(100%+4px)] z-30 min-w-56 rounded-surface border border-line bg-raised p-1 shadow-overlay right-0
- offset respecto del trigger: 4 px vertical (calc(100% + 4px)).
- backdrop: ninguno. No hay oscurecimiento de la página detrás del menú.
- focus trap: no. El foco se libera al cerrar y vuelve al elemento que estaba activo antes (el botón), por el cleanup del useEffect.
- dismissal: click fuera, Escape, o selección de un ítem.

### C03 — MenuItem destructivo («Cancelar evento»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** button[role=menuitem]
- **INSTANCE / ROLE:** Acción terminal
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu > button[role=menuitem] (danger)
- **PARENT:** div[menu]
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1061 y=249.59 w=214 h=44
- CSS: width: 214px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 214px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 8px · padding: 0px 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div[menu] · offset dx=5 dy=93 · padre 224×142

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle (15x15)
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 500

#### CONTENT

- visible: "Cancelar evento"

#### STATE

- idle

#### INTERACTION

- trigger: click → setSheet('lifecycle') (abre el Sheet de ciclo de vida)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: min-height 44 px, padding-inline 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El ítem destructivo lleva AlertCircle 15 px y color text-danger; hover bg-danger-soft.

## SCROLL CONTRACT

- what scrolls: la página (el overlay no bloquea el scroll del documento)
- what remains sticky/fixed: El overlay es absolute dentro de un div.relative; z-index 30
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: panel de 224×142 px en x=-18,89 → el borde izquierdo se sale del viewport 18,89 px.
- 1440: mismo componente, mismo offset de 4 px respecto del botón; la posición horizontal depende del lugar del botón en la fila de acciones.
