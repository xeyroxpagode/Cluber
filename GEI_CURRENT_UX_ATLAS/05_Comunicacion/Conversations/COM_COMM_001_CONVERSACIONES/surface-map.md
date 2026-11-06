# SURFACE MAP — COM_COMM_001_CONVERSACIONES

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_COMM_001_CONVERSACIONES

**SCREEN ID:** COM_COMM_001_CONVERSACIONES

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — pestaña Conversaciones

**PURPOSE AS IMPLEMENTED:** Canal de comunicación con dos pestañas (Conversaciones / Comunicados). La lista de conversaciones ordena por mensajes no leídos y marca los no leídos con un punto.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication

**ORIGIN:** Shell → destino «Comunicación»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-team-sexta (2 sin leer), c-direct-vicky, c-event-cuba

**RESOURCE STATE:** 3 conversaciones activas · 2 mensajes sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?demo=coach.

**RELATED SCREEN IDS:** COM_COMM_002_COMUNICADOS, COM_COMM_005_CONVERSACIONES_PLAYER

**RESPONSIVE COUNTERPART:** 390: pestañas horizontales con scroll (overflow-x-auto) y lista de una columna. 1440: max-w-4xl (896 px); las pestañas y la lista usan el ancho de la columna.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CommunicationHome, TabBar, RowLink, Avatar, SectionHeader, UnreadMark (patrón local)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_001_CONVERSACIONES_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de conversaciones con su marca de no-leído
- **FOCAL 2:** Pestañas «Conversaciones / Comunicados» con contadores
- **SUPPORTING:** Botón «Nuevo mensaje»
- **SECONDARY:** Encabezado con el lead «Dos cosas distintas…»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ChannelTabBar | div[role=tablist] con 2 botones | Alternancia entre los dos canales de comunicación |
| C02 | ConversationRow (equipo) | RowLink con Avatar | Conversación resumida |
| C03 | UnreadMark («2 sin leer») | span con dot + texto | Marca de mensajes no leídos |

### C01 — ChannelTabBar

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 2 botones
- **INSTANCE / ROLE:** Alternancia entre los dos canales de comunicación
- **SOURCE COMPONENT:** TabBar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TabBar
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=12 y=269.22 w=366 h=37
- CSS: width: 366px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 366px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px 4px 1px · margin: 0px -4px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-4 dy=0 · padre 358×38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Conversaciones 1 Comunicados 2"

#### STATE

- «Conversaciones» activa (border-interactive text-interactive)

#### INTERACTION

- trigger: click en «Comunicados» → query.set({tab:'comunicados'})
- flechas ←/→ cambian de pestaña y mueven el foco (onKeyDown en TabBar)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 366 px de ancho con -mx-1 px-1; los badges de contador van dentro de cada pestaña
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El contador de «Conversaciones» es el número de conversaciones con no-leídos; el de «Comunicados», el de comunicados publicados.
- El tablist vive dentro del bloque `below` del PageContextHeader y dentro de un div con border-b border-line.

### C02 — ConversationRow (equipo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Conversación resumida
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > RowLink (conversations)
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

- visible: "Equipo · Sexta A Perfecto, gracias Tomi. 2 sin leer"

#### STATE

- unread (dot bg-unread + «2 sin leer»)

#### INTERACTION

- trigger: click → /conversations/c-team-sexta

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft

#### RESPONSIVE

- 390: 358×63,64 px; avatar 32×32, título y extracto a x=58
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El leading cambia según el tipo de conversación: Megaphone 18 px (evento), Users 18 px (equipo) o Avatar sm (directa).
- En la conversación de equipo el avatar es reemplazado por el icono de equipo: es la única fila de la lista sin avatar.

### C03 — UnreadMark («2 sin leer»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** span con dot + texto
- **INSTANCE / ROLE:** Marca de mensajes no leídos
- **SOURCE COMPONENT:** CommunicationHome (patrón local equivalente a UnreadMark)
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > meta > span
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=321.3 y=376.78 w=52.7 h=17.39
- CSS: width: 52.7031px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 52.7031px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=14 dy=0 · padre 66.7×17.39

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "2 sin leer"

#### STATE

- unread

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: dot 8×8 + texto meta semibold text-selected
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

- 390 ↔ 1440: el TabBar es un `flex gap-1 overflow-x-auto` con las dos pestañas de 158,23 y 144,39 px; no cambian de ancho entre viewports.
- El contenedor es max-w-4xl: 358 px útiles a 390 y 896 px a 1440.

# COM_COMM_001_CONVERSACIONES

**SCREEN ID:** COM_COMM_001_CONVERSACIONES

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — pestaña Conversaciones

**PURPOSE AS IMPLEMENTED:** Canal de comunicación con dos pestañas (Conversaciones / Comunicados). La lista de conversaciones ordena por mensajes no leídos y marca los no leídos con un punto.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication

**ORIGIN:** Shell → destino «Comunicación»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-team-sexta (2 sin leer), c-direct-vicky, c-event-cuba

**RESOURCE STATE:** 3 conversaciones activas · 2 mensajes sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?demo=coach.

**RELATED SCREEN IDS:** COM_COMM_002_COMUNICADOS, COM_COMM_005_CONVERSACIONES_PLAYER

**RESPONSIVE COUNTERPART:** 390: pestañas horizontales con scroll (overflow-x-auto) y lista de una columna. 1440: max-w-4xl (896 px); las pestañas y la lista usan el ancho de la columna.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CommunicationHome, TabBar, RowLink, Avatar, SectionHeader, UnreadMark (patrón local)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_001_CONVERSACIONES_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de conversaciones con su marca de no-leído
- **FOCAL 2:** Pestañas «Conversaciones / Comunicados» con contadores
- **SUPPORTING:** Botón «Nuevo mensaje»
- **SECONDARY:** Encabezado con el lead «Dos cosas distintas…»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ChannelTabBar | div[role=tablist] con 2 botones | Alternancia entre los dos canales de comunicación |
| C02 | ConversationRow (equipo) | RowLink con Avatar | Conversación resumida |
| C03 | UnreadMark («2 sin leer») | span con dot + texto | Marca de mensajes no leídos |

### C01 — ChannelTabBar

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 2 botones
- **INSTANCE / ROLE:** Alternancia entre los dos canales de comunicación
- **SOURCE COMPONENT:** TabBar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TabBar
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=380 y=188.72 w=904 h=37
- CSS: width: 904px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 904px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px 4px 1px · margin: 0px -4px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-4 dy=0 · padre 896×38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Conversaciones 1 Comunicados 2"

#### STATE

- «Conversaciones» activa (border-interactive text-interactive)

#### INTERACTION

- trigger: click en «Comunicados» → query.set({tab:'comunicados'})
- flechas ←/→ cambian de pestaña y mueven el foco (onKeyDown en TabBar)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 366 px de ancho con -mx-1 px-1; los badges de contador van dentro de cada pestaña
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El contador de «Conversaciones» es el número de conversaciones con no-leídos; el de «Comunicados», el de comunicados publicados.
- El tablist vive dentro del bloque `below` del PageContextHeader y dentro de un div con border-b border-line.

### C02 — ConversationRow (equipo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Conversación resumida
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > RowLink (conversations)
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

- visible: "Equipo · Sexta A Perfecto, gracias Tomi. 2 sin leer"

#### STATE

- unread (dot bg-unread + «2 sin leer»)

#### INTERACTION

- trigger: click → /conversations/c-team-sexta

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft

#### RESPONSIVE

- 390: 358×63,64 px; avatar 32×32, título y extracto a x=58
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El leading cambia según el tipo de conversación: Megaphone 18 px (evento), Users 18 px (equipo) o Avatar sm (directa).
- En la conversación de equipo el avatar es reemplazado por el icono de equipo: es la única fila de la lista sin avatar.

### C03 — UnreadMark («2 sin leer»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** span con dot + texto
- **INSTANCE / ROLE:** Marca de mensajes no leídos
- **SOURCE COMPONENT:** CommunicationHome (patrón local equivalente a UnreadMark)
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > meta > span
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1227.3 y=274.03 w=52.7 h=17.39
- CSS: width: 52.7031px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 52.7031px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=14 dy=0 · padre 66.7×17.39

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "2 sin leer"

#### STATE

- unread

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: dot 8×8 + texto meta semibold text-selected
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

- 390 ↔ 1440: el TabBar es un `flex gap-1 overflow-x-auto` con las dos pestañas de 158,23 y 144,39 px; no cambian de ancho entre viewports.
- El contenedor es max-w-4xl: 358 px útiles a 390 y 896 px a 1440.
