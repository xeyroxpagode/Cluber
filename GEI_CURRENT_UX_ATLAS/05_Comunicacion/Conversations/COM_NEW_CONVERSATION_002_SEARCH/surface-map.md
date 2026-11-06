# SURFACE MAP — COM_NEW_CONVERSATION_002_SEARCH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_NEW_CONVERSATION_002_SEARCH

**SCREEN ID:** COM_NEW_CONVERSATION_002_SEARCH

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Nuevo mensaje — búsqueda con resultado

**PURPOSE AS IMPLEMENTED:** El campo de búsqueda filtra la lista de personas en vivo, sin recargar la página.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication/conversations/new

**ORIGIN:** COM_NEW_CONVERSATION_001_PICK → escribir en el campo

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** 1 persona coincidente

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/conversations/new?demo=coach.
2. Escribir «Lucía» en el campo.

**RELATED SCREEN IDS:** COM_NEW_CONVERSATION_001_PICK, COM_NEW_CONVERSATION_003_NO_RESULTS

**RESPONSIVE COUNTERPART:** Misma composición; la lista se reduce a una fila.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** NewConversation (people filtrados por `term`)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_NEW_CONVERSATION_002_SEARCH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de la única persona coincidente
- **FOCAL 2:** Campo de búsqueda con el término
- **SUPPORTING:** Detalle «Todavía no hablaron.»
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonSearchField (con término) | TextField | Filtro de la lista |

### C01 — PersonSearchField (con término)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Filtro de la lista
- **SOURCE COMPONENT:** TextField
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=291.31 w=358 h=43.69
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 358×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- filled («Lucía»)

#### INTERACTION

- trigger: escribir → re-render de la lista sin cambiar la URL

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El filtro es local (useState) y no se escribe en la URL.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# COM_NEW_CONVERSATION_002_SEARCH

**SCREEN ID:** COM_NEW_CONVERSATION_002_SEARCH

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Nuevo mensaje — búsqueda con resultado

**PURPOSE AS IMPLEMENTED:** El campo de búsqueda filtra la lista de personas en vivo, sin recargar la página.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication/conversations/new

**ORIGIN:** COM_NEW_CONVERSATION_001_PICK → escribir en el campo

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** 1 persona coincidente

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/conversations/new?demo=coach.
2. Escribir «Lucía» en el campo.

**RELATED SCREEN IDS:** COM_NEW_CONVERSATION_001_PICK, COM_NEW_CONVERSATION_003_NO_RESULTS

**RESPONSIVE COUNTERPART:** Misma composición; la lista se reduce a una fila.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** NewConversation (people filtrados por `term`)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_NEW_CONVERSATION_002_SEARCH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de la única persona coincidente
- **FOCAL 2:** Campo de búsqueda con el término
- **SUPPORTING:** Detalle «Todavía no hablaron.»
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonSearchField (con término) | TextField | Filtro de la lista |

### C01 — PersonSearchField (con término)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Filtro de la lista
- **SOURCE COMPONENT:** TextField
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=268.81 w=672 h=43.69
- CSS: width: 672px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 672×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- filled («Lucía»)

#### INTERACTION

- trigger: escribir → re-render de la lista sin cambiar la URL

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El filtro es local (useState) y no se escribe en la URL.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
