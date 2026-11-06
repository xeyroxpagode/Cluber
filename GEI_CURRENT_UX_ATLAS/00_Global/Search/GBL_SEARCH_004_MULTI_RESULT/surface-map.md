# SURFACE MAP — GBL_SEARCH_004_MULTI_RESULT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_SEARCH_004_MULTI_RESULT

**SCREEN ID:** GBL_SEARCH_004_MULTI_RESULT

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — resultados en varios grupos

**PURPOSE AS IMPLEMENTED:** Búsqueda con coincidencias en personas, equipos, eventos y estructura: cuatro grupos de resultados con contadores.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /search?q=a

**ORIGIN:** GBL_SEARCH_001_EMPTY

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** varios

**RESOURCE STATE:** TÉRMINO «a» · coincidencias en los 4 grupos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=a&demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_002_RESULTS

**RESPONSIVE COUNTERPART:** Misma composición; el contenedor crece a 720 px en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SearchPage, DetailSection, RowLink, RowStatic

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_004_MULTI_RESULT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Primer grupo de resultados con contador
- **FOCAL 2:** Campo de búsqueda
- **SUPPORTING:** Filas de resultado
- **SECONDARY:** Contadores por grupo
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SearchInput | input | Campo de búsqueda con «a» |
| C02 | ResultRow (equipo) | RowLink | Fila de resultado de equipo |
| C03 | ResultRowStatic (división/línea) | RowStatic | Fila no navegable de estructura del club |

### C01 — SearchInput

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** input
- **INSTANCE / ROLE:** Campo de búsqueda con «a»
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

- filled

#### INTERACTION

- trigger: submit → actualiza ?q=

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: flex-1
- 1440: flex-1

#### IMPLEMENTATION NOTES

- —

### C02 — ResultRow (equipo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Fila de resultado de equipo
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=990.22 w=358 h=44.25
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=96.5 · padre 358×189
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sexta A"

#### STATE

- idle

#### INTERACTION

- trigger: click → /teams/sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — ResultRowStatic (división/línea)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Fila no navegable de estructura del club
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=2098.28 w=334 h=17.39
- CSS: width: 334px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 334px, min-width 0px, max-width none

#### LAYOUT

- display: flow-root · padding: 0px · margin: 2px 0px 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=22.25 · padre 334×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "División"

#### STATE

- idle

#### INTERACTION

- No interactivo: la estructura no tiene ruta de detalle

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle distingue «División» o «Línea» según item.type.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2510 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los cuatro grupos se apilan en una columna; en 1440 el ancho por fila crece y los grupos de estructura usan RowStatic (no clicable).

# GBL_SEARCH_004_MULTI_RESULT

**SCREEN ID:** GBL_SEARCH_004_MULTI_RESULT

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — resultados en varios grupos

**PURPOSE AS IMPLEMENTED:** Búsqueda con coincidencias en personas, equipos, eventos y estructura: cuatro grupos de resultados con contadores.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /search?q=a

**ORIGIN:** GBL_SEARCH_001_EMPTY

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** varios

**RESOURCE STATE:** TÉRMINO «a» · coincidencias en los 4 grupos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=a&demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_002_RESULTS

**RESPONSIVE COUNTERPART:** Misma composición; el contenedor crece a 720 px en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SearchPage, DetailSection, RowLink, RowStatic

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_004_MULTI_RESULT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Primer grupo de resultados con contador
- **FOCAL 2:** Campo de búsqueda
- **SUPPORTING:** Filas de resultado
- **SECONDARY:** Contadores por grupo
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SearchInput | input | Campo de búsqueda con «a» |
| C02 | ResultRow (equipo) | RowLink | Fila de resultado de equipo |
| C03 | ResultRowStatic (división/línea) | RowStatic | Fila no navegable de estructura del club |

### C01 — SearchInput

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** input
- **INSTANCE / ROLE:** Campo de búsqueda con «a»
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

- filled

#### INTERACTION

- trigger: submit → actualiza ?q=

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: flex-1
- 1440: flex-1

#### IMPLEMENTATION NOTES

- —

### C02 — ResultRow (equipo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Fila de resultado de equipo
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=967.72 w=768 h=44.25
- CSS: width: 768px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=96.5 · padre 768×189
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sexta A"

#### STATE

- idle

#### INTERACTION

- trigger: click → /teams/sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — ResultRowStatic (división/línea)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Fila no navegable de estructura del club
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=460 y=2059.83 w=744 h=17.39
- CSS: width: 744px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 744px, min-width 0px, max-width none

#### LAYOUT

- display: flow-root · padding: 0px · margin: 2px 0px 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=22.25 · padre 744×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "División"

#### STATE

- idle

#### INTERACTION

- No interactivo: la estructura no tiene ruta de detalle

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle distingue «División» o «Línea» según item.type.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 2424 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los cuatro grupos se apilan en una columna; en 1440 el ancho por fila crece y los grupos de estructura usan RowStatic (no clicable).
