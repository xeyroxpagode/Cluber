# SURFACE MAP — GBL_SEARCH_001_EMPTY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_SEARCH_001_EMPTY

**SCREEN ID:** GBL_SEARCH_001_EMPTY

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — estado inicial sin término

**PURPOSE AS IMPLEMENTED:** Página de búsqueda global con el campo vacío. Muestra el estado inicial que explica qué se puede buscar y qué no.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /search

**ORIGIN:** Shell → icono Buscar (o ⌘K)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** SIN TÉRMINO DE BÚSQUEDA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_002_RESULTS, GBL_SEARCH_003_NO_RESULTS

**RESPONSIVE COUNTERPART:** 390: el formulario es una fila (input + botón) con el input flex-1. 1440: idéntico, con max-w-3xl (768 px) de ancho de contenido.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SearchPage, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_001_EMPTY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo de búsqueda con icono de lupa
- **FOCAL 2:** Título «Buscar»
- **SUPPORTING:** Estado vacío «Escribí algo para empezar»
- **SECONDARY:** Lead de la página
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader | header grid | Contexto, título y lead de la página |
| C02 | SearchInput | input con icono absolute | Campo de texto de búsqueda |
| C03 | SearchSubmitButton | Button primary | Ejecutar la búsqueda |
| C04 | EmptyState (sin término) | Empty | Explica el alcance de la búsqueda |

### C01 — PageContextHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Contexto, título y lead de la página
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

- visible: "GEI Buscar TB"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: una columna
- 1440: flex con basis-64 en el título

#### IMPLEMENTATION NOTES

- —

### C02 — SearchInput

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** input con icono absolute
- **INSTANCE / ROLE:** Campo de texto de búsqueda
- **SOURCE COMPONENT:** SearchPage (input nativo, no el TextField compartido)
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** SearchPage > form > input[aria-label]
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

- idle / vacío

#### INTERACTION

- trigger: escribir → actualiza el borrador local (useState)
- trigger: Enter → submit → query.set({q}) escribe ?q= en la URL
- trigger: botón «Buscar» → mismo submit

#### MOTION

- transition-colors duration-micro en el control

#### RESPONSIVE

- 390: flex-1, padding-left 36 px para el icono
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El icono de lupa está posicionado absolute left-3 top-1/2 -translate-y-1/2 (17 px).
- Usa clases propias (no el primitive TextField): min-height 44 px (gei-target), borde border-line-strong, padding pl-9 pr-3.

### C03 — SearchSubmitButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Ejecutar la búsqueda
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=289.31 y=243.22 w=84.69 h=44
- CSS: width: 84.6875px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 84.6875px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=273.31 dy=0 · padre 358×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Buscar"

#### STATE

- idle

#### INTERACTION

- trigger: click → submit del form

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: autofila su ancho natural
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C04 — EmptyState (sin término)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Explica el alcance de la búsqueda
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=331.22 w=358 h=160.47
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=242.22 · padre 358×402.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Escribí algo para empezar La búsqueda no devuelve datos personales como document"

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: padding 20/32 px, texto centrado
- 1440: idéntico, con max-w-sm para el detalle

#### IMPLEMENTATION NOTES

- Icono por defecto MinusCircle 22 px; en esta pantalla se sustituye por SearchIcon 22 px.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición de una sola columna; cambia el ancho del contenedor (358 px útiles a 390, 720 px a 1440 con max-w-3xl).

# GBL_SEARCH_001_EMPTY

**SCREEN ID:** GBL_SEARCH_001_EMPTY

**DOMAIN:** 00_Global

**SURFACE NAME:** Buscar — estado inicial sin término

**PURPOSE AS IMPLEMENTED:** Página de búsqueda global con el campo vacío. Muestra el estado inicial que explica qué se puede buscar y qué no.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /search

**ORIGIN:** Shell → icono Buscar (o ⌘K)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** SIN TÉRMINO DE BÚSQUEDA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /search?demo=coach.

**RELATED SCREEN IDS:** GBL_SEARCH_002_RESULTS, GBL_SEARCH_003_NO_RESULTS

**RESPONSIVE COUNTERPART:** 390: el formulario es una fila (input + botón) con el input flex-1. 1440: idéntico, con max-w-3xl (768 px) de ancho de contenido.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SearchPage, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SEARCH_001_EMPTY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo de búsqueda con icono de lupa
- **FOCAL 2:** Título «Buscar»
- **SUPPORTING:** Estado vacío «Escribí algo para empezar»
- **SECONDARY:** Lead de la página
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader | header grid | Contexto, título y lead de la página |
| C02 | SearchInput | input con icono absolute | Campo de texto de búsqueda |
| C03 | SearchSubmitButton | Button primary | Ejecutar la búsqueda |
| C04 | EmptyState (sin término) | Empty | Explica el alcance de la búsqueda |

### C01 — PageContextHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Contexto, título y lead de la página
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

- visible: "Hockey Buscar Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: una columna
- 1440: flex con basis-64 en el título

#### IMPLEMENTATION NOTES

- —

### C02 — SearchInput

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** input con icono absolute
- **INSTANCE / ROLE:** Campo de texto de búsqueda
- **SOURCE COMPONENT:** SearchPage (input nativo, no el TextField compartido)
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** SearchPage > form > input[aria-label]
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

- idle / vacío

#### INTERACTION

- trigger: escribir → actualiza el borrador local (useState)
- trigger: Enter → submit → query.set({q}) escribe ?q= en la URL
- trigger: botón «Buscar» → mismo submit

#### MOTION

- transition-colors duration-micro en el control

#### RESPONSIVE

- 390: flex-1, padding-left 36 px para el icono
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El icono de lupa está posicionado absolute left-3 top-1/2 -translate-y-1/2 (17 px).
- Usa clases propias (no el primitive TextField): min-height 44 px (gei-target), borde border-line-strong, padding pl-9 pr-3.

### C03 — SearchSubmitButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Ejecutar la búsqueda
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1131.31 y=220.72 w=84.69 h=44
- CSS: width: 84.6875px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 84.6875px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=683.31 dy=0 · padre 768×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Buscar"

#### STATE

- idle

#### INTERACTION

- trigger: click → submit del form

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: autofila su ancho natural
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C04 — EmptyState (sin término)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Explica el alcance de la búsqueda
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=308.72 w=768 h=160.47
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=219.72 · padre 768×380.19
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Escribí algo para empezar La búsqueda no devuelve datos personales como document"

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: padding 20/32 px, texto centrado
- 1440: idéntico, con max-w-sm para el detalle

#### IMPLEMENTATION NOTES

- Icono por defecto MinusCircle 22 px; en esta pantalla se sustituye por SearchIcon 22 px.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición de una sola columna; cambia el ancho del contenedor (358 px útiles a 390, 720 px a 1440 con max-w-3xl).
