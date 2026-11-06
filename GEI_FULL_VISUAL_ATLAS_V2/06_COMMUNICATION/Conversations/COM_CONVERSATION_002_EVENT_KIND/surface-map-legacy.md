# SURFACE MAP — COM_CONVERSATION_002_EVENT_KIND

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_CONVERSATION_002_EVENT_KIND

**SCREEN ID:** COM_CONVERSATION_002_EVENT_KIND

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Conversación — ruta de evento (estado actual)

**PURPOSE AS IMPLEMENTED:** La misma ruta de conversación abierta con el identificador de la conversación de un evento: reproduce el mismo estado no resuelto.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /conversations/c-event-cuba

**ORIGIN:** Detalle de evento → «Abrir la conversación»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-event-cuba

**RESOURCE STATE:** ID DE PARÁMETRO NO RESUELTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /conversations/c-event-cuba?demo=coach.

**RELATED SCREEN IDS:** COM_CONVERSATION_001_DEFAULT, XD_EVENT_001_TO_CONVERSATION

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConversationPage (!conversation) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_CONVERSATION_002_EVENT_KIND_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Esa conversación ya no existe»
- **FOCAL 2:** Detalle «Puede que se haya archivado.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationNotFoundEmpty | Empty | Estado vacío de conversación no resuelta |

### C01 — ConversationNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de conversación no resuelta
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=89 w=358 h=143.08
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Esa conversación ya no existe Puede que se haya archivado."

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

- Mismo origen que COM_CONVERSATION_001_DEFAULT: el parámetro de la ruta no coincide con el que lee el componente.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# COM_CONVERSATION_002_EVENT_KIND

**SCREEN ID:** COM_CONVERSATION_002_EVENT_KIND

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Conversación — ruta de evento (estado actual)

**PURPOSE AS IMPLEMENTED:** La misma ruta de conversación abierta con el identificador de la conversación de un evento: reproduce el mismo estado no resuelto.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /conversations/c-event-cuba

**ORIGIN:** Detalle de evento → «Abrir la conversación»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-event-cuba

**RESOURCE STATE:** ID DE PARÁMETRO NO RESUELTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /conversations/c-event-cuba?demo=coach.

**RELATED SCREEN IDS:** COM_CONVERSATION_001_DEFAULT, XD_EVENT_001_TO_CONVERSATION

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConversationPage (!conversation) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_CONVERSATION_002_EVENT_KIND_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Esa conversación ya no existe»
- **FOCAL 2:** Detalle «Puede que se haya archivado.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationNotFoundEmpty | Empty | Estado vacío de conversación no resuelta |

### C01 — ConversationNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de conversación no resuelta
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

- visible: "Esa conversación ya no existe Puede que se haya archivado."

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

- Mismo origen que COM_CONVERSATION_001_DEFAULT: el parámetro de la ruta no coincide con el que lee el componente.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
