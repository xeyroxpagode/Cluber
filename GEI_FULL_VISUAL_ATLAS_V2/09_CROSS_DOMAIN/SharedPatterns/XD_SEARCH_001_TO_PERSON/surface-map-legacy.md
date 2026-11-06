# SURFACE MAP — XD_SEARCH_001_TO_PERSON

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_SEARCH_001_TO_PERSON

**SCREEN ID:** XD_SEARCH_001_TO_PERSON

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Búsqueda → Persona

**PURPOSE AS IMPLEMENTED:** Trayecto de navegación: desde el resultado de búsqueda global hasta la ficha de lectura de la persona.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /search?q=Lucía

**ORIGIN:** Shell → «Buscar» (o ⌘K)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** RESULTADO DE BÚSQUEDA → FICHA DE PERSONA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=Lucía&demo=coach.
2. Pulsar la fila «Lucía Fernández».

**RELATED SCREEN IDS:** GBL_SEARCH_002_RESULTS, EQ_PERSON_001_DETAIL_COACH

**RESPONSIVE COUNTERPART:** La ficha de destino usa max-w-3xl en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SearchPage > RowLink, PersonDetail, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_SEARCH_001_TO_PERSON_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la persona como título de la ficha
- **FOCAL 2:** Sección «Identidad»
- **SUPPORTING:** Roles y alcance
- **SECONDARY:** Equipos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonDetailHeader | header grid con back | Destino de la navegación |

### C01 — PersonDetailHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (PersonDetail)
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

- contained-by div · offset dx=0 dy=0 · padre 358×29.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Lucía Fernández"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /teams (destino fijo, no el de origen)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px; el título «Lucía Fernández» en 29,63 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El botón «Volver» de la ficha de persona apunta siempre a /teams, no a la pantalla de origen: el trayecto de vuelta no es simétrico.
- En este trayecto el actor es el entrenador, por eso la sección «Identidad» no muestra documento ni fecha de nacimiento.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino no cambia de layout; lo que cambia respecto del listado es el contenedor (768 px frente a 768 px de la búsqueda).

# XD_SEARCH_001_TO_PERSON

**SCREEN ID:** XD_SEARCH_001_TO_PERSON

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Búsqueda → Persona

**PURPOSE AS IMPLEMENTED:** Trayecto de navegación: desde el resultado de búsqueda global hasta la ficha de lectura de la persona.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /search?q=Lucía

**ORIGIN:** Shell → «Buscar» (o ⌘K)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** RESULTADO DE BÚSQUEDA → FICHA DE PERSONA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=Lucía&demo=coach.
2. Pulsar la fila «Lucía Fernández».

**RELATED SCREEN IDS:** GBL_SEARCH_002_RESULTS, EQ_PERSON_001_DETAIL_COACH

**RESPONSIVE COUNTERPART:** La ficha de destino usa max-w-3xl en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SearchPage > RowLink, PersonDetail, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_SEARCH_001_TO_PERSON_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la persona como título de la ficha
- **FOCAL 2:** Sección «Identidad»
- **SUPPORTING:** Roles y alcance
- **SECONDARY:** Equipos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonDetailHeader | header grid con back | Destino de la navegación |

### C01 — PersonDetailHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (PersonDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=137 w=690.95 h=29.63
- CSS: width: 690.953px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 690.953px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 690.95×29.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Lucía Fernández"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /teams (destino fijo, no el de origen)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px; el título «Lucía Fernández» en 29,63 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El botón «Volver» de la ficha de persona apunta siempre a /teams, no a la pantalla de origen: el trayecto de vuelta no es simétrico.
- En este trayecto el actor es el entrenador, por eso la sección «Identidad» no muestra documento ni fecha de nacimiento.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino no cambia de layout; lo que cambia respecto del listado es el contenedor (768 px frente a 768 px de la búsqueda).
