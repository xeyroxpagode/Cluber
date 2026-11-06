# SURFACE MAP — COM_NEW_CONVERSATION_003_NO_RESULTS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_NEW_CONVERSATION_003_NO_RESULTS

**SCREEN ID:** COM_NEW_CONVERSATION_003_NO_RESULTS

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Nuevo mensaje — sin resultados

**PURPOSE AS IMPLEMENTED:** Lista vacía tras una búsqueda sin coincidencias, con el texto del término en el mensaje.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication/conversations/new

**ORIGIN:** COM_NEW_CONVERSATION_001_PICK → escribir un término sin coincidencias

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 coincidencias

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/conversations/new?demo=coach.
2. Escribir «zzz» en el campo.

**RELATED SCREEN IDS:** COM_NEW_CONVERSATION_002_SEARCH

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx

**SOURCE SYMBOLS:** NewConversation (people.length === 0)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_NEW_CONVERSATION_003_NO_RESULTS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Texto «Sin resultados para “zzz”.»
- **FOCAL 2:** Campo de búsqueda
- **SUPPORTING:** —
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoResultsLine | p gei-meta dentro de un li | Confirma que no hay coincidencias |

### C01 — NoResultsLine

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-meta dentro de un li
- **INSTANCE / ROLE:** Confirma que no hay coincidencias
- **SOURCE COMPONENT:** NewConversation
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NewConversation > li > p
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=379 w=358 h=17.39
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 358×17.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Sin resultados para “ zzz ”."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 1 línea
- 1440: 672 px

#### IMPLEMENTATION NOTES

- Usa comillas tipográficas alrededor del término.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# COM_NEW_CONVERSATION_003_NO_RESULTS

**SCREEN ID:** COM_NEW_CONVERSATION_003_NO_RESULTS

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Nuevo mensaje — sin resultados

**PURPOSE AS IMPLEMENTED:** Lista vacía tras una búsqueda sin coincidencias, con el texto del término en el mensaje.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication/conversations/new

**ORIGIN:** COM_NEW_CONVERSATION_001_PICK → escribir un término sin coincidencias

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 coincidencias

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/conversations/new?demo=coach.
2. Escribir «zzz» en el campo.

**RELATED SCREEN IDS:** COM_NEW_CONVERSATION_002_SEARCH

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx

**SOURCE SYMBOLS:** NewConversation (people.length === 0)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_NEW_CONVERSATION_003_NO_RESULTS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Texto «Sin resultados para “zzz”.»
- **FOCAL 2:** Campo de búsqueda
- **SUPPORTING:** —
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoResultsLine | p gei-meta dentro de un li | Confirma que no hay coincidencias |

### C01 — NoResultsLine

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-meta dentro de un li
- **INSTANCE / ROLE:** Confirma que no hay coincidencias
- **SOURCE COMPONENT:** NewConversation
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NewConversation > li > p
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=356.5 w=672 h=17.39
- CSS: width: 672px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 672×17.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Sin resultados para “ zzz ”."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 1 línea
- 1440: 672 px

#### IMPLEMENTATION NOTES

- Usa comillas tipográficas alrededor del término.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
