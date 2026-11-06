# SURFACE MAP — GBL_SEARCH_003_NO_RESULTS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_SEARCH_003_NO_RESULTS

**SCREEN ID:** GBL_SEARCH_003_NO_RESULTS

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — sin resultados

**PURPOSE AS IMPLEMENTED:** Estado vacío por consulta sin coincidencias, con acción para limpiar la búsqueda.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /search?q=zzzqqq

**ORIGIN:** GBL_SEARCH_001_EMPTY

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** TÉRMINO «zzzqqq» · 0 resultados

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=zzzqqq&demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_001_EMPTY

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports; sólo cambia el ancho del contenedor.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SearchPage > Empty, Empty, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_003_NO_RESULTS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Nada para “zzzqqq”»
- **FOCAL 2:** Botón «Limpiar búsqueda»
- **SUPPORTING:** Icono de lupa 22 px
- **SECONDARY:** Campo de búsqueda con el término
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (sin resultados) | Empty | Confirma que la consulta no coincide con nada |
| C02 | ClearSearchButton | Button secondary | Quitar el término de la URL |

### C01 — EmptyState (sin resultados)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Confirma que la consulta no coincide con nada
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=331.22 w=358 h=218.47
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=242.22 · padre 358×460.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Nada para "zzzqqq" Probá con menos palabras o revisá cómo está escrito el nombre"

#### STATE

- empty (filtered)

#### INTERACTION

- El action limpia la búsqueda

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: centrado, px-5 py-8
- 1440: centrado, px-5 py-8

#### IMPLEMENTATION NOTES

- —

### C02 — ClearSearchButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Quitar el término de la URL
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=37 y=470.69 w=316 h=46
- CSS: width: 316px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 316px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=139.47 · padre 358×218.47

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Limpiar búsqueda"

#### STATE

- idle

#### INTERACTION

- trigger: click → query.reset(['q']) → vuelve al estado inicial

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: autofila
- 1440: autofila

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# GBL_SEARCH_003_NO_RESULTS

**SCREEN ID:** GBL_SEARCH_003_NO_RESULTS

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — sin resultados

**PURPOSE AS IMPLEMENTED:** Estado vacío por consulta sin coincidencias, con acción para limpiar la búsqueda.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /search?q=zzzqqq

**ORIGIN:** GBL_SEARCH_001_EMPTY

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** TÉRMINO «zzzqqq» · 0 resultados

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?q=zzzqqq&demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_001_EMPTY

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports; sólo cambia el ancho del contenedor.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SearchPage > Empty, Empty, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_003_NO_RESULTS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Nada para “zzzqqq”»
- **FOCAL 2:** Botón «Limpiar búsqueda»
- **SUPPORTING:** Icono de lupa 22 px
- **SECONDARY:** Campo de búsqueda con el término
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (sin resultados) | Empty | Confirma que la consulta no coincide con nada |
| C02 | ClearSearchButton | Button secondary | Quitar el término de la URL |

### C01 — EmptyState (sin resultados)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Confirma que la consulta no coincide con nada
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=308.72 w=768 h=201.08
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=219.72 · padre 768×420.8
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Nada para "zzzqqq" Probá con menos palabras o revisá cómo está escrito el nombre"

#### STATE

- empty (filtered)

#### INTERACTION

- El action limpia la búsqueda

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: centrado, px-5 py-8
- 1440: centrado, px-5 py-8

#### IMPLEMENTATION NOTES

- —

### C02 — ClearSearchButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Quitar el término de la URL
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=430.8 w=726 h=46
- CSS: width: 726px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=122.08 · padre 768×201.08

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Limpiar búsqueda"

#### STATE

- idle

#### INTERACTION

- trigger: click → query.reset(['q']) → vuelve al estado inicial

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: autofila
- 1440: autofila

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
