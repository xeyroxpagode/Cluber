# SURFACE MAP — COM_CONVERSATION_003_NEW_TARGET

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_CONVERSATION_003_NEW_TARGET

**SCREEN ID:** COM_CONVERSATION_003_NEW_TARGET

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Conversación — ruta /conversations/new (selección de destinatario)

**PURPOSE AS IMPLEMENTED:** Estado actual real de la ruta /conversations/new: el router declara esa ruta con el componente NewConversation, de modo que el parámetro ?to= no abre un hilo sino el selector de personas.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /conversations/new?to=p2

**ORIGIN:** Comunicación → «Nuevo mensaje» → elegir una persona

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** SELECTOR DE PERSONAS (el parámetro ?to= no se consume)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /conversations/new?to=p2&demo=coach.

**RELATED SCREEN IDS:** COM_CONVERSATION_001_DEFAULT, COM_NEW_CONVERSATION_001_PICK

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px) en ambos viewports; lista de una columna.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/app/App.tsx

**SOURCE SYMBOLS:** router path='/conversations/new' Component=NewConversation, NewConversation

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_CONVERSATION_003_NEW_TARGET_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de personas elegibles
- **FOCAL 2:** Campo «Buscar persona»
- **SUPPORTING:** Tag «Conversación existente» en la fila de Victoria Berg
- **SECONDARY:** Lead «Elegí con quién querés hablar…»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonRow (p2) | RowLink con Avatar | Persona seleccionable |

### C01 — PersonRow (p2)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona seleccionable
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NewConversation > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=531.67 w=358 h=63.64
- CSS: width: 358px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 358×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "LF Lucía Fernández Todavía no hablaron."

#### STATE

- idle

#### INTERACTION

- trigger: click → /conversations/new?to=p2 (la misma ruta, sin efecto observable)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px; avatar 32×32, título y extracto a x=72
- 1440: 672 px

#### IMPLEMENTATION NOTES

- EVIDENCIA (SOURCE-CONFIRMED): en src/app/App.tsx la ruta /conversations/new está declarada con Component: NewConversation, y la ruta dinámica /conversations/:id con Component: ConversationPage. React Router prioriza el segmento estático, por lo que /conversations/new nunca llega a ConversationPage.
- Consecuencia observable: el parámetro ?to= no pre-selecciona a nadie y el hilo de mensajes con un destinatario no se puede abrir desde la UI actual.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1404 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el componente NewConversation declara max-w-2xl; a 390 el ancho útil es 358 px y a 1440 los 672 px.

# COM_CONVERSATION_003_NEW_TARGET

**SCREEN ID:** COM_CONVERSATION_003_NEW_TARGET

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Conversación — ruta /conversations/new (selección de destinatario)

**PURPOSE AS IMPLEMENTED:** Estado actual real de la ruta /conversations/new: el router declara esa ruta con el componente NewConversation, de modo que el parámetro ?to= no abre un hilo sino el selector de personas.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /conversations/new?to=p2

**ORIGIN:** Comunicación → «Nuevo mensaje» → elegir una persona

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** p2 (Lucía Fernández)

**RESOURCE STATE:** SELECTOR DE PERSONAS (el parámetro ?to= no se consume)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /conversations/new?to=p2&demo=coach.

**RELATED SCREEN IDS:** COM_CONVERSATION_001_DEFAULT, COM_NEW_CONVERSATION_001_PICK

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px) en ambos viewports; lista de una columna.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/app/App.tsx

**SOURCE SYMBOLS:** router path='/conversations/new' Component=NewConversation, NewConversation

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_CONVERSATION_003_NEW_TARGET_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de personas elegibles
- **FOCAL 2:** Campo «Buscar persona»
- **SUPPORTING:** Tag «Conversación existente» en la fila de Victoria Berg
- **SECONDARY:** Lead «Elegí con quién querés hablar…»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonRow (p2) | RowLink con Avatar | Persona seleccionable |

### C01 — PersonRow (p2)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona seleccionable
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NewConversation > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=491.78 w=672 h=63.64
- CSS: width: 672px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 672×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "LF Lucía Fernández Todavía no hablaron."

#### STATE

- idle

#### INTERACTION

- trigger: click → /conversations/new?to=p2 (la misma ruta, sin efecto observable)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px; avatar 32×32, título y extracto a x=72
- 1440: 672 px

#### IMPLEMENTATION NOTES

- EVIDENCIA (SOURCE-CONFIRMED): en src/app/App.tsx la ruta /conversations/new está declarada con Component: NewConversation, y la ruta dinámica /conversations/:id con Component: ConversationPage. React Router prioriza el segmento estático, por lo que /conversations/new nunca llega a ConversationPage.
- Consecuencia observable: el parámetro ?to= no pre-selecciona a nadie y el hilo de mensajes con un destinatario no se puede abrir desde la UI actual.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1316 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el componente NewConversation declara max-w-2xl; a 390 el ancho útil es 358 px y a 1440 los 672 px.
