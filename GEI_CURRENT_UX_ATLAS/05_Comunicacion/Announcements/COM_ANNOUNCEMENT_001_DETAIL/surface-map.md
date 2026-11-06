# SURFACE MAP — COM_ANNOUNCEMENT_001_DETAIL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_ANNOUNCEMENT_001_DETAIL

**SCREEN ID:** COM_ANNOUNCEMENT_001_DETAIL

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — detalle

**PURPOSE AS IMPLEMENTED:** Lectura de un comunicado publicado: encabezado con estado, snapshot de audiencia inmutable, cuerpo y, si hubo, el historial de correcciones.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /announcements/a1

**ORIGIN:** Comunicación → pestaña Comunicados → click en un comunicado

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** a1 (Sexta A), audienceSnapshot de Sexta A

**RESOURCE STATE:** PUBLISHED · 0 correcciones

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=coach.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_002_AUDIENCE_SHEET, COM_ANNOUNCEMENT_003_MENU_OPEN, COM_ANNOUNCEMENT_005_DRAFT

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px) en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AnnouncementDetail, PageContextHeader, Tag, StateBadge, HistoryList

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_001_DETAIL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del comunicado
- **FOCAL 2:** Cuerpo del comunicado en párrafos
- **SUPPORTING:** Etiqueta de audiencia «Sexta A» y su fecha de registro
- **SECONDARY:** Botón «Quién lo ve»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Comunicado) | header grid con back y action | Título, autor, fecha, estado y menú de acciones |
| C02 | AudienceSnapshotBlock | div con Tag, texto y botón | Muestra la audiencia registrada al publicar |
| C03 | AnnouncementBody | article con p por párrafo | Cuerpo del comunicado |

### C01 — PageContextHeader (Comunicado)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Título, autor, fecha, estado y menú de acciones
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=65
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Comunicados TB"

#### STATE

- PUBLISHED

#### INTERACTION

- trigger: click en «Acciones» (sólo para quien puede corregir) → abre el menú

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×272,64 px; el título ocupa 2 líneas (59,25 px de alto)
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El lead es «Publicado el {fecha larga} por {publicador}».

### C02 — AudienceSnapshotBlock

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div con Tag, texto y botón
- **INSTANCE / ROLE:** Muestra la audiencia registrada al publicar
- **SOURCE COMPONENT:** Tag + Button quiet
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** AnnouncementDetail > below (snapshot)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=296.25 w=60.11 h=21.39
- CSS: width: 60.1094px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 60.1094px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×65.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Sexta A"

#### STATE

- inmutable

#### INTERACTION

- trigger: click en «Quién lo ve» → abre el Sheet de audiencia

#### MOTION

- transition-colors en el botón

#### RESPONSIVE

- 390: el Tag en x=16, el texto a x=84, el botón en una línea propia (y=325,64)
- 1440: los tres elementos en la misma línea

#### IMPLEMENTATION NOTES

- El snapshot es la copia de la audiencia en el momento de publicar: se renderiza sólo si announcement.audienceSnapshot no es null.
- El botón «Quién lo ve» sólo existe en el bloque del snapshot.

### C03 — AnnouncementBody

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** article con p por párrafo
- **INSTANCE / ROLE:** Cuerpo del comunicado
- **SOURCE COMPONENT:** AnnouncementDetail > article
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** AnnouncementDetail > article.map(paragraph)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=405.64 w=358 h=183.81
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 16px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=316.64 · padre 358×500.45
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "El sábado recibimos a CUBA en nuestra cancha. Recordamos traer ambas camisetas, "

#### STATE

- 3 párrafos

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×183,81 px; los párrafos ocupan 65,06 / 65,06 / 21,69 px
- 1440: 672 px; el texto deja de envolver tanto

#### IMPLEMENTATION NOTES

- El cuerpo se parte por doble salto de línea (\n\n) y cada párrafo es un p con gei-body.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el contenedor es max-w-2xl; el cuerpo del comunicado usa párrafos separados por doble salto de línea.

# COM_ANNOUNCEMENT_001_DETAIL

**SCREEN ID:** COM_ANNOUNCEMENT_001_DETAIL

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — detalle

**PURPOSE AS IMPLEMENTED:** Lectura de un comunicado publicado: encabezado con estado, snapshot de audiencia inmutable, cuerpo y, si hubo, el historial de correcciones.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /announcements/a1

**ORIGIN:** Comunicación → pestaña Comunicados → click en un comunicado

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** a1 (Sexta A), audienceSnapshot de Sexta A

**RESOURCE STATE:** PUBLISHED · 0 correcciones

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=coach.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_002_AUDIENCE_SHEET, COM_ANNOUNCEMENT_003_MENU_OPEN, COM_ANNOUNCEMENT_005_DRAFT

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px) en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AnnouncementDetail, PageContextHeader, Tag, StateBadge, HistoryList

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_001_DETAIL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del comunicado
- **FOCAL 2:** Cuerpo del comunicado en párrafos
- **SUPPORTING:** Etiqueta de audiencia «Sexta A» y su fecha de registro
- **SECONDARY:** Botón «Quién lo ve»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Comunicado) | header grid con back y action | Título, autor, fecha, estado y menú de acciones |
| C02 | AudienceSnapshotBlock | div con Tag, texto y botón | Muestra la audiencia registrada al publicar |
| C03 | AnnouncementBody | article con p por párrafo | Cuerpo del comunicado |

### C01 — PageContextHeader (Comunicado)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Título, autor, fecha, estado y menú de acciones
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=65
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×901
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Comunicados Buscar ⌘K TB"

#### STATE

- PUBLISHED

#### INTERACTION

- trigger: click en «Acciones» (sólo para quien puede corregir) → abre el menú

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×272,64 px; el título ocupa 2 líneas (59,25 px de alto)
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El lead es «Publicado el {fecha larga} por {publicador}».

### C02 — AudienceSnapshotBlock

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div con Tag, texto y botón
- **INSTANCE / ROLE:** Muestra la audiencia registrada al publicar
- **SOURCE COMPONENT:** Tag + Button quiet
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** AnnouncementDetail > below (snapshot)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=216.42 w=60.11 h=21.39
- CSS: width: 60.1094px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 60.1094px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=7.29 · padre 672×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Sexta A"

#### STATE

- inmutable

#### INTERACTION

- trigger: click en «Quién lo ve» → abre el Sheet de audiencia

#### MOTION

- transition-colors en el botón

#### RESPONSIVE

- 390: el Tag en x=16, el texto a x=84, el botón en una línea propia (y=325,64)
- 1440: los tres elementos en la misma línea

#### IMPLEMENTATION NOTES

- El snapshot es la copia de la audiencia en el momento de publicar: se renderiza sólo si announcement.audienceSnapshot no es null.
- El botón «Quién lo ve» sólo existe en el bloque del snapshot.

### C03 — AnnouncementBody

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** article con p por párrafo
- **INSTANCE / ROLE:** Cuerpo del comunicado
- **SOURCE COMPONENT:** AnnouncementDetail > article
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** AnnouncementDetail > article.map(paragraph)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=289.13 w=672 h=140.44
- CSS: width: 672px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 672px · gap: 16px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=200.13 · padre 672×340.56
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "El sábado recibimos a CUBA en nuestra cancha. Recordamos traer ambas camisetas, "

#### STATE

- 3 párrafos

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×183,81 px; los párrafos ocupan 65,06 / 65,06 / 21,69 px
- 1440: 672 px; el texto deja de envolver tanto

#### IMPLEMENTATION NOTES

- El cuerpo se parte por doble salto de línea (\n\n) y cada párrafo es un p con gei-body.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el contenedor es max-w-2xl; el cuerpo del comunicado usa párrafos separados por doble salto de línea.
