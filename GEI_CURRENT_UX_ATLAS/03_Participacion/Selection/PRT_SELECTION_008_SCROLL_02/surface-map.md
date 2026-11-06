# SURFACE MAP — PRT_SELECTION_008_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_008_SCROLL_02

**SCREEN ID:** PRT_SELECTION_008_SCROLL_02

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — franja inferior de la lista

**PURPOSE AS IMPLEMENTED:** Parte media de la pantalla de convocatoria con la cola de la lista de personas y sus estados.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** PRT_SELECTION_001_PUBLISHED (desplazamiento a y = 800)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7

**RESOURCE STATE:** PUBLISHED · scroll 800 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=coach.
2. Desplazar a y = 800.

**RELATED SCREEN IDS:** PRT_SELECTION_001_PUBLISHED

**RESPONSIVE COUNTERPART:** La lista mantiene una columna en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx

**SOURCE SYMBOLS:** SelectionPage > ul > li

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_008_SCROLL_02_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de convocadas con estado de disponibilidad
- **FOCAL 2:** Separadores entre filas
- **SUPPORTING:** Barra de publicación fija
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SelectionRow (cola) | li con checkbox + label | Convocada con su estado |

### C01 — SelectionRow (cola)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li con checkbox + label
- **INSTANCE / ROLE:** Convocada con su estado
- **SOURCE COMPONENT:** SelectionPage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > ul > li
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=9.38 w=324 h=58.64
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 324×476.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Confirmó con el horario anterior"

#### STATE

- checked

#### INTERACTION

- trigger: click en el checkbox → toggle

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×58,64 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky; BottomNav fixed en 390
- initial scroll: scrollY = 800
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1161 · scrollY 317 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_SELECTION_008_SCROLL_02

**SCREEN ID:** PRT_SELECTION_008_SCROLL_02

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — franja inferior de la lista

**PURPOSE AS IMPLEMENTED:** Parte media de la pantalla de convocatoria con la cola de la lista de personas y sus estados.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** PRT_SELECTION_001_PUBLISHED (desplazamiento a y = 800)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7

**RESOURCE STATE:** PUBLISHED · scroll 800 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=coach.
2. Desplazar a y = 800.

**RELATED SCREEN IDS:** PRT_SELECTION_001_PUBLISHED

**RESPONSIVE COUNTERPART:** La lista mantiene una columna en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx

**SOURCE SYMBOLS:** SelectionPage > ul > li

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_008_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de convocadas con estado de disponibilidad
- **FOCAL 2:** Separadores entre filas
- **SUPPORTING:** Barra de publicación fija
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SelectionRow (cola) | li con checkbox + label | Convocada con su estado |

### C01 — SelectionRow (cola)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li con checkbox + label
- **INSTANCE / ROLE:** Convocada con su estado
- **SOURCE COMPONENT:** SelectionPage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > ul > li
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=100.38 w=854 h=58.64
- CSS: width: 854px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 854px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 854×476.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Confirmó con el horario anterior"

#### STATE

- checked

#### INTERACTION

- trigger: click en el checkbox → toggle

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×58,64 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky; BottomNav fixed en 390
- initial scroll: scrollY = 800
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1095 · scrollY 195 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
