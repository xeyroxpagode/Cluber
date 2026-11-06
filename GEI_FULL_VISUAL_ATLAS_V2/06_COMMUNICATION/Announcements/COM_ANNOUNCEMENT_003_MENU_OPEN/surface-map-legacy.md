# SURFACE MAP — COM_ANNOUNCEMENT_003_MENU_OPEN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_ANNOUNCEMENT_003_MENU_OPEN

**SCREEN ID:** COM_ANNOUNCEMENT_003_MENU_OPEN

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — menú de acciones

**PURPOSE AS IMPLEMENTED:** Menú contextual del comunicado con las acciones de corrección y archivado, disponible sólo para la Subcomisión.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /announcements/a1

**ORIGIN:** COM_ANNOUNCEMENT_001_DETAIL → «Acciones»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1

**RESOURCE STATE:** PUBLISHED · menú abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=subcommittee.
2. Pulsar «Acciones».

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** Mismo primitive Menu que en el detalle de evento: panel de 224 px alineado al botón.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Menu (AnnouncementDetail action)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_003_MENU_OPEN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Opciones «Corregir título o cuerpo» y «Archivar»
- **FOCAL 2:** Ítem destructivo «Archivar» en rojo con icono
- **SUPPORTING:** Panel blanco con borde y sombra
- **SECONDARY:** Página de comunicado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MenuPanel | div[role=menu] absolute | Acciones del comunicado |

### C01 — MenuPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=menu] absolute
- **INSTANCE / ROLE:** Acciones del comunicado
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=-32.33 y=301.25 w=224 h=98
- CSS: width: 224px · min-width: 224px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 224px, min-width 224px, max-width none

#### LAYOUT

- display: block · padding: 4px · min-width: 224px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-129.99 dy=40 · padre 94.02×36
- positioned absolute · z-index 30

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Corregir título o cuerpo Archivar"

#### STATE

- open

#### INTERACTION

- trigger: click en «Corregir título o cuerpo» → /announcements/a1/edit
- trigger: click en «Archivar» → abre el ConfirmDialog
- trigger: Escape o click fuera → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: 224 px de ancho
- 1440: 224 px de ancho

#### IMPLEMENTATION NOTES

- El menú sólo se renderiza si authority.canCorrectAnnouncement() es verdadero, es decir, para la Subcomisión.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: el menú es absolute dentro de un div.relative; z-index 30
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el panel tiene min-w-56 (224 px) y se posiciona con right-0 respecto del botón «Acciones» del encabezado.

# COM_ANNOUNCEMENT_003_MENU_OPEN

**SCREEN ID:** COM_ANNOUNCEMENT_003_MENU_OPEN

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — menú de acciones

**PURPOSE AS IMPLEMENTED:** Menú contextual del comunicado con las acciones de corrección y archivado, disponible sólo para la Subcomisión.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /announcements/a1

**ORIGIN:** COM_ANNOUNCEMENT_001_DETAIL → «Acciones»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1

**RESOURCE STATE:** PUBLISHED · menú abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=subcommittee.
2. Pulsar «Acciones».

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** Mismo primitive Menu que en el detalle de evento: panel de 224 px alineado al botón.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Menu (AnnouncementDetail action)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_003_MENU_OPEN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Opciones «Corregir título o cuerpo» y «Archivar»
- **FOCAL 2:** Ítem destructivo «Archivar» en rojo con icono
- **SUPPORTING:** Panel blanco con borde y sombra
- **SECONDARY:** Página de comunicado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MenuPanel | div[role=menu] absolute | Acciones del comunicado |

### C01 — MenuPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=menu] absolute
- **INSTANCE / ROLE:** Acciones del comunicado
- **SOURCE COMPONENT:** Menu
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Menu
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=944 y=177 w=224 h=98
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

- visible: "Corregir título o cuerpo Archivar"

#### STATE

- open

#### INTERACTION

- trigger: click en «Corregir título o cuerpo» → /announcements/a1/edit
- trigger: click en «Archivar» → abre el ConfirmDialog
- trigger: Escape o click fuera → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: 224 px de ancho
- 1440: 224 px de ancho

#### IMPLEMENTATION NOTES

- El menú sólo se renderiza si authority.canCorrectAnnouncement() es verdadero, es decir, para la Subcomisión.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: el menú es absolute dentro de un div.relative; z-index 30
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el panel tiene min-w-56 (224 px) y se posiciona con right-0 respecto del botón «Acciones» del encabezado.
