# SURFACE MAP — CAL_EVENT_DETAIL_013_NOT_FOUND

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_013_NOT_FOUND

**SCREEN ID:** CAL_EVENT_DETAIL_013_NOT_FOUND

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — evento inexistente

**PURPOSE AS IMPLEMENTED:** Estado vacío del detalle cuando el identificador de la URL no corresponde a ningún evento.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/no-existe

**ORIGIN:** enlace con un id inexistente

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** ID DE EVENTO DESCONOCIDO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/no-existe?demo=coach.

**RELATED SCREEN IDS:** GBL_STATE_001_NOT_FOUND

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports; el bloque no declara max-width propio.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail (!event) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_013_NOT_FOUND_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Ese evento ya no está»
- **FOCAL 2:** Detalle «Puede que se haya archivado o que el enlace esté incompleto.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventNotFoundEmpty | Empty | Estado vacío por evento inexistente |

### C01 — EventNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por evento inexistente
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=89 w=358 h=160.47
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×160.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ese evento ya no está Puede que se haya archivado o que el enlace esté incomplet"

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el <main> aplica px-4 en 390 y px-8 en 1440.

# CAL_EVENT_DETAIL_013_NOT_FOUND

**SCREEN ID:** CAL_EVENT_DETAIL_013_NOT_FOUND

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — evento inexistente

**PURPOSE AS IMPLEMENTED:** Estado vacío del detalle cuando el identificador de la URL no corresponde a ningún evento.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/no-existe

**ORIGIN:** enlace con un id inexistente

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** ID DE EVENTO DESCONOCIDO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/no-existe?demo=coach.

**RELATED SCREEN IDS:** GBL_STATE_001_NOT_FOUND

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports; el bloque no declara max-width propio.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail (!event) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_013_NOT_FOUND_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Ese evento ya no está»
- **FOCAL 2:** Detalle «Puede que se haya archivado o que el enlace esté incompleto.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventNotFoundEmpty | Empty | Estado vacío por evento inexistente |

### C01 — EventNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por evento inexistente
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=89 w=768 h=143.08
- CSS: width: 768px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ese evento ya no está Puede que se haya archivado o que el enlace esté incomplet"

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el <main> aplica px-4 en 390 y px-8 en 1440.
