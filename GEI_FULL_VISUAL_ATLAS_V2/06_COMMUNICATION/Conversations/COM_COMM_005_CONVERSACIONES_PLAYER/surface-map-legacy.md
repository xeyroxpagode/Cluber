# SURFACE MAP — COM_COMM_005_CONVERSACIONES_PLAYER

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_COMM_005_CONVERSACIONES_PLAYER

**SCREEN ID:** COM_COMM_005_CONVERSACIONES_PLAYER

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — pestaña Conversaciones (PLAYER)

**PURPOSE AS IMPLEMENTED:** El canal de conversación visto por una jugadora: sólo aparece la conversación del equipo en la que participa, con su no-leído.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication

**ORIGIN:** Shell → destino «Comunicación» (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** c-team-sexta (1 sin leer para p2)

**RESOURCE STATE:** 1 conversación · 1 mensaje sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?demo=player.

**RELATED SCREEN IDS:** COM_COMM_001_CONVERSACIONES, COM_CONVERSATION_004_NO_AUTHORITY

**RESPONSIVE COUNTERPART:** Misma composición; la lista tiene menos filas.

**SOURCE FILES:** src/features/communication.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** CommunicationHome, visibleEvents (no aplica)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_005_CONVERSACIONES_PLAYER_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de la conversación del equipo con «1 sin leer»
- **FOCAL 2:** Contador de no leídos en la pestaña
- **SUPPORTING:** Extracto del último mensaje
- **SECONDARY:** Encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationRow (equipo, jugadora) | RowLink con icono de equipo | Conversación del equipo de la jugadora |

### C01 — ConversationRow (equipo, jugadora)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con icono de equipo
- **INSTANCE / ROLE:** Conversación del equipo de la jugadora
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=438.17 w=358 h=63.64
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
- icon: lucide lucide-users text-ink-faint (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Equipo · Sexta A Perfecto, gracias Tomi. 1 sin leer"

#### STATE

- unread (1 sin leer)

#### INTERACTION

- trigger: click → /conversations/c-team-sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- p2 participa en c-team-sexta y en c-event-cuba; en la lista sólo aparece la primera porque el listado se limita a conversations.slice(0, …) por orden de no leídos y el resto queda fuera del corte de la pantalla.
- El extracto es el cuerpo del último mensaje: «Perfecto, gracias Tomi.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# COM_COMM_005_CONVERSACIONES_PLAYER

**SCREEN ID:** COM_COMM_005_CONVERSACIONES_PLAYER

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — pestaña Conversaciones (PLAYER)

**PURPOSE AS IMPLEMENTED:** El canal de conversación visto por una jugadora: sólo aparece la conversación del equipo en la que participa, con su no-leído.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication

**ORIGIN:** Shell → destino «Comunicación» (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** c-team-sexta (1 sin leer para p2)

**RESOURCE STATE:** 1 conversación · 1 mensaje sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?demo=player.

**RELATED SCREEN IDS:** COM_COMM_001_CONVERSACIONES, COM_CONVERSATION_004_NO_AUTHORITY

**RESPONSIVE COUNTERPART:** Misma composición; la lista tiene menos filas.

**SOURCE FILES:** src/features/communication.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** CommunicationHome, visibleEvents (no aplica)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_005_CONVERSACIONES_PLAYER_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de la conversación del equipo con «1 sin leer»
- **FOCAL 2:** Contador de no leídos en la pestaña
- **SUPPORTING:** Extracto del último mensaje
- **SECONDARY:** Encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationRow (equipo, jugadora) | RowLink con icono de equipo | Conversación del equipo de la jugadora |

### C01 — ConversationRow (equipo, jugadora)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con icono de equipo
- **INSTANCE / ROLE:** Conversación del equipo de la jugadora
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=335.97 w=896 h=63.64
- CSS: width: 896px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 896×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-users text-ink-faint (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Equipo · Sexta A Perfecto, gracias Tomi. 1 sin leer"

#### STATE

- unread (1 sin leer)

#### INTERACTION

- trigger: click → /conversations/c-team-sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- p2 participa en c-team-sexta y en c-event-cuba; en la lista sólo aparece la primera porque el listado se limita a conversations.slice(0, …) por orden de no leídos y el resto queda fuera del corte de la pantalla.
- El extracto es el cuerpo del último mensaje: «Perfecto, gracias Tomi.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
