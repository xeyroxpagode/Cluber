# SURFACE MAP — GBL_SEARCH_002_RESULTS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_SEARCH_002_RESULTS

**SCREEN ID:** GBL_SEARCH_002_RESULTS

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — con resultados (persona)

**PURPOSE AS IMPLEMENTED:** Resultados de búsqueda agrupados por tipo de objeto: personas, equipos, eventos y divisiones/líneas.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /search?q=Lucía

**ORIGIN:** GBL_SEARCH_001_EMPTY

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** persona p2 (Lucía Fernández)

**RESOURCE STATE:** TÉRMINO «Lucía»

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?demo=coach.
2. Escribir «Lucía» en el campo y pulsar «Buscar» (o Enter).

**RELATED SCREEN IDS:** GBL_SEARCH_001_EMPTY, GBL_SEARCH_004_MULTI_RESULT

**RESPONSIVE COUNTERPART:** Misma estructura de grupos en 390 y 1440; el contenedor crece de 358 a 720 px.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SearchPage, DetailSection, RowLink, Avatar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_002_RESULTS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo de búsqueda con el término escrito
- **FOCAL 2:** Grupo de resultados «Personas»
- **SUPPORTING:** Filas de resultado con avatar
- **SECONDARY:** Contadores por grupo
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SearchInput (con término) | input | Campo de búsqueda |
| C02 | DetailSection «Personas» | section grid | Grupo de resultados con contador |
| C03 | ResultRow (persona) | RowLink | Fila de resultado navegable |

### C01 — SearchInput (con término)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** input
- **INSTANCE / ROLE:** Campo de búsqueda
- **SOURCE COMPONENT:** SearchPage
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** SearchPage > input
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=243.22 w=265.31 h=44
- CSS: width: 265.312px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 265.312px, min-width 0px, max-width none

#### LAYOUT

- display: inline-block · padding: 0px 12px 0px 36px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 265.31×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- filled («Lucía»)

#### INTERACTION

- trigger: editar → borrador local
- trigger: submit → ?q= en la URL

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: flex-1
- 1440: flex-1

#### IMPLEMENTATION NOTES

- —

### C02 — DetailSection «Personas»

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid
- **INSTANCE / ROLE:** Grupo de resultados con contador
- **SOURCE COMPONENT:** DetailSection + SectionHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / SectionHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=331.22 w=358 h=89.25
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×89.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas 1 LF Lucía Fernández"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: una columna
- 1440: una columna (max-w-3xl)

#### IMPLEMENTATION NOTES

- —

### C03 — ResultRow (persona)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Fila de resultado navegable
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=364.47 w=358 h=56
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×56
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "LF Lucía Fernández"

#### STATE

- idle

#### INTERACTION

- trigger: click → /people/p2

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft, active bg-selected-soft

#### RESPONSIVE

- 390: min-height 44 px, padding 12/16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El leading es un Avatar size=sm (32×32).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 al cambiar de ruta; el término vive en la URL (?q=) y se restaura
- scroll lost on navigation: El término se conserva en la URL; la posición de scroll no

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los grupos se apilan igual; cambia el ancho del contenedor (max-w-3xl) y el de las filas.

# GBL_SEARCH_002_RESULTS

**SCREEN ID:** GBL_SEARCH_002_RESULTS

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — con resultados (persona)

**PURPOSE AS IMPLEMENTED:** Resultados de búsqueda agrupados por tipo de objeto: personas, equipos, eventos y divisiones/líneas.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /search?q=Lucía

**ORIGIN:** GBL_SEARCH_001_EMPTY

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** persona p2 (Lucía Fernández)

**RESOURCE STATE:** TÉRMINO «Lucía»

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?demo=coach.
2. Escribir «Lucía» en el campo y pulsar «Buscar» (o Enter).

**RELATED SCREEN IDS:** GBL_SEARCH_001_EMPTY, GBL_SEARCH_004_MULTI_RESULT

**RESPONSIVE COUNTERPART:** Misma estructura de grupos en 390 y 1440; el contenedor crece de 358 a 720 px.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SearchPage, DetailSection, RowLink, Avatar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_002_RESULTS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo de búsqueda con el término escrito
- **FOCAL 2:** Grupo de resultados «Personas»
- **SUPPORTING:** Filas de resultado con avatar
- **SECONDARY:** Contadores por grupo
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SearchInput (con término) | input | Campo de búsqueda |
| C02 | DetailSection «Personas» | section grid | Grupo de resultados con contador |
| C03 | ResultRow (persona) | RowLink | Fila de resultado navegable |

### C01 — SearchInput (con término)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** input
- **INSTANCE / ROLE:** Campo de búsqueda
- **SOURCE COMPONENT:** SearchPage
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** SearchPage > input
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=220.72 w=675.31 h=44
- CSS: width: 675.312px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 675.312px, min-width 0px, max-width none

#### LAYOUT

- display: inline-block · padding: 0px 12px 0px 36px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 675.31×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- filled («Lucía»)

#### INTERACTION

- trigger: editar → borrador local
- trigger: submit → ?q= en la URL

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: flex-1
- 1440: flex-1

#### IMPLEMENTATION NOTES

- —

### C02 — DetailSection «Personas»

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid
- **INSTANCE / ROLE:** Grupo de resultados con contador
- **SOURCE COMPONENT:** DetailSection + SectionHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / SectionHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=308.72 w=768 h=89.25
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 768px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×89.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas 1 LF Lucía Fernández"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: una columna
- 1440: una columna (max-w-3xl)

#### IMPLEMENTATION NOTES

- —

### C03 — ResultRow (persona)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Fila de resultado navegable
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=341.97 w=768 h=56
- CSS: width: 768px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×56
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "LF Lucía Fernández"

#### STATE

- idle

#### INTERACTION

- trigger: click → /people/p2

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft, active bg-selected-soft

#### RESPONSIVE

- 390: min-height 44 px, padding 12/16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El leading es un Avatar size=sm (32×32).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 al cambiar de ruta; el término vive en la URL (?q=) y se restaura
- scroll lost on navigation: El término se conserva en la URL; la posición de scroll no

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los grupos se apilan igual; cambia el ancho del contenedor (max-w-3xl) y el de las filas.
