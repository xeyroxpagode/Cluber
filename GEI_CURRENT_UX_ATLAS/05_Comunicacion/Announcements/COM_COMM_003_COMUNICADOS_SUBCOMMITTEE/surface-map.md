# SURFACE MAP — COM_COMM_003_COMUNICADOS_SUBCOMMITTEE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_COMM_003_COMUNICADOS_SUBCOMMITTEE

**SCREEN ID:** COM_COMM_003_COMUNICADOS_SUBCOMMITTEE

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — sin conversaciones habilitadas (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** La Subcomisión no tiene rol de chat, así que la pantalla de comunicación le muestra el estado denegado. Su canal propio es el de comunicados, al que llega desde el detalle de un evento («Comunicar un cambio»).

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication?tab=comunicados

**ORIGIN:** URL directa (actor SUBCOMMITTEE; el destino no aparece en su navegación)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** actor=subcommittee

**RESOURCE STATE:** SIN ROL DE CHAT

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?tab=comunicados&demo=subcommittee.

**RELATED SCREEN IDS:** COM_COMM_004_NO_CHAT_ADMIN, CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** CommunicationHome (!canOpen('communication')) > Empty, canChat (authority.ts:154)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés conversaciones habilitadas»
- **FOCAL 2:** Detalle «La comunicación con el club se habilita por rol.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoChatEmpty (Subcomisión) | Empty | Estado de acceso denegado por rol |

### C01 — NoChatEmpty (Subcomisión)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado por rol
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

- visible: "No tenés conversaciones habilitadas La comunicación con el club se habilita por "

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- canChat exige un rol PLAYER, CAPTAIN o COACH: el rol SUBCOMMITTEE no está en la lista, por eso la Subcomisión no ve el canal de conversaciones ni el de comunicados dentro de esta pantalla.
- La lista de comunicados que la Subcomisión puede publicar se alcanza por el enlace «Comunicar un cambio» del detalle de evento, que abre directamente el formulario de alta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# COM_COMM_003_COMUNICADOS_SUBCOMMITTEE

**SCREEN ID:** COM_COMM_003_COMUNICADOS_SUBCOMMITTEE

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — sin conversaciones habilitadas (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** La Subcomisión no tiene rol de chat, así que la pantalla de comunicación le muestra el estado denegado. Su canal propio es el de comunicados, al que llega desde el detalle de un evento («Comunicar un cambio»).

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication?tab=comunicados

**ORIGIN:** URL directa (actor SUBCOMMITTEE; el destino no aparece en su navegación)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** actor=subcommittee

**RESOURCE STATE:** SIN ROL DE CHAT

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?tab=comunicados&demo=subcommittee.

**RELATED SCREEN IDS:** COM_COMM_004_NO_CHAT_ADMIN, CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** CommunicationHome (!canOpen('communication')) > Empty, canChat (authority.ts:154)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés conversaciones habilitadas»
- **FOCAL 2:** Detalle «La comunicación con el club se habilita por rol.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoChatEmpty (Subcomisión) | Empty | Estado de acceso denegado por rol |

### C01 — NoChatEmpty (Subcomisión)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado por rol
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

- visible: "No tenés conversaciones habilitadas La comunicación con el club se habilita por "

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- canChat exige un rol PLAYER, CAPTAIN o COACH: el rol SUBCOMMITTEE no está en la lista, por eso la Subcomisión no ve el canal de conversaciones ni el de comunicados dentro de esta pantalla.
- La lista de comunicados que la Subcomisión puede publicar se alcanza por el enlace «Comunicar un cambio» del detalle de evento, que abre directamente el formulario de alta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
