# SURFACE MAP — XD_EVENT_001_TO_CONVERSATION

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_EVENT_001_TO_CONVERSATION

**SCREEN ID:** XD_EVENT_001_TO_CONVERSATION

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Evento → Conversación (estado actual)

**PURPOSE AS IMPLEMENTED:** Trayecto desde el detalle de evento hasta su conversación. El destino muestra el estado vacío de conversación no resuelta.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** Detalle de evento → sección «Mensajes de este evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-event-cuba, match-cuba

**RESOURCE STATE:** CONVERSACIÓN NO RESUELTA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Desplazar a y = 1900.
3. Pulsar «Abrir la conversación».

**RELATED SCREEN IDS:** COM_CONVERSATION_002_EVENT_KIND, CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** El destino es el estado vacío de conversación, idéntico en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail > Link «Abrir la conversación», ConversationPage (!conversation) > Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_EVENT_001_TO_CONVERSATION_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Esa conversación ya no existe»
- **FOCAL 2:** Detalle «Puede que se haya archivado.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationNotFoundEmpty | Empty | Destino de la navegación |

### C01 — ConversationNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Destino de la navegación
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

- El enlace del detalle de evento construye la URL /conversations/c-event-cuba, que es una ruta válida del router.
- El estado vacío se debe al desacople entre el nombre del parámetro de ruta (:id) y el que lee el componente (conversationId), no a la existencia de la conversación: c-event-cuba está en el seed con un mensaje.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0 tras la navegación
- scroll restoration observed: el Shell resetea el scroll a 0 al cambiar de ruta
- scroll lost on navigation: Sí: la posición de lectura del evento no se conserva al abrir la conversación

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino no cambia de layout.

# XD_EVENT_001_TO_CONVERSATION

**SCREEN ID:** XD_EVENT_001_TO_CONVERSATION

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Evento → Conversación (estado actual)

**PURPOSE AS IMPLEMENTED:** Trayecto desde el detalle de evento hasta su conversación. El destino muestra el estado vacío de conversación no resuelta.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** Detalle de evento → sección «Mensajes de este evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-event-cuba, match-cuba

**RESOURCE STATE:** CONVERSACIÓN NO RESUELTA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Desplazar a y = 1900.
3. Pulsar «Abrir la conversación».

**RELATED SCREEN IDS:** COM_CONVERSATION_002_EVENT_KIND, CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** El destino es el estado vacío de conversación, idéntico en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail > Link «Abrir la conversación», ConversationPage (!conversation) > Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_EVENT_001_TO_CONVERSATION_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Esa conversación ya no existe»
- **FOCAL 2:** Detalle «Puede que se haya archivado.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationNotFoundEmpty | Empty | Destino de la navegación |

### C01 — ConversationNotFoundEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Destino de la navegación
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

- El enlace del detalle de evento construye la URL /conversations/c-event-cuba, que es una ruta válida del router.
- El estado vacío se debe al desacople entre el nombre del parámetro de ruta (:id) y el que lee el componente (conversationId), no a la existencia de la conversación: c-event-cuba está en el seed con un mensaje.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0 tras la navegación
- scroll restoration observed: el Shell resetea el scroll a 0 al cambiar de ruta
- scroll lost on navigation: Sí: la posición de lectura del evento no se conserva al abrir la conversación

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino no cambia de layout.
