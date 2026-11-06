# SURFACE MAP — XD_SEARCH_002_TO_TEAM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_SEARCH_002_TO_TEAM

**SCREEN ID:** XD_SEARCH_002_TO_TEAM

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Búsqueda → Equipo

**PURPOSE AS IMPLEMENTED:** Trayecto desde un resultado de búsqueda de tipo equipo hasta el detalle del equipo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /search?q=Sexta

**ORIGIN:** Shell → «Buscar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta

**RESOURCE STATE:** RESULTADO DE BÚSQUEDA → DETALLE DE EQUIPO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=Sexta&demo=coach.
2. Pulsar la fila «Sexta A».

**RELATED SCREEN IDS:** GBL_SEARCH_004_MULTI_RESULT, EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** El detalle de equipo usa max-w-5xl (1024 px).

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SearchPage > RowLink (teams), TeamDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_SEARCH_002_TO_TEAM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Sexta A» con la etiqueta de alcance
- **FOCAL 2:** Pestañas de sección del equipo
- **SUPPORTING:** Lista de eventos próximos
- **SECONDARY:** Eventos pasados
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamDetailHeader | header grid con back y action | Destino de la navegación |

### C01 — TeamDetailHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (TeamDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=137 w=358 h=29.63
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×82.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Sexta A"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /teams

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×164,02 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El action del encabezado lleva la etiqueta «En tu alcance» porque el entrenador gestiona el equipo.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1846 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino cambia de contenedor respecto del listado (1024 px frente a 768 px).

# XD_SEARCH_002_TO_TEAM

**SCREEN ID:** XD_SEARCH_002_TO_TEAM

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Búsqueda → Equipo

**PURPOSE AS IMPLEMENTED:** Trayecto desde un resultado de búsqueda de tipo equipo hasta el detalle del equipo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /search?q=Sexta

**ORIGIN:** Shell → «Buscar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta

**RESOURCE STATE:** RESULTADO DE BÚSQUEDA → DETALLE DE EQUIPO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=Sexta&demo=coach.
2. Pulsar la fila «Sexta A».

**RELATED SCREEN IDS:** GBL_SEARCH_004_MULTI_RESULT, EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** El detalle de equipo usa max-w-5xl (1024 px).

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SearchPage > RowLink (teams), TeamDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_SEARCH_002_TO_TEAM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Sexta A» con la etiqueta de alcance
- **FOCAL 2:** Pestañas de sección del equipo
- **SUPPORTING:** Lista de eventos próximos
- **SECONDARY:** Eventos pasados
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamDetailHeader | header grid con back y action | Destino de la navegación |

### C01 — TeamDetailHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (TeamDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=137 w=906.95 h=29.63
- CSS: width: 906.953px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 906.953px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 906.95×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Sexta A"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /teams

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×164,02 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El action del encabezado lleva la etiqueta «En tu alcance» porque el entrenador gestiona el equipo.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1571 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino cambia de contenedor respecto del listado (1024 px frente a 768 px).
