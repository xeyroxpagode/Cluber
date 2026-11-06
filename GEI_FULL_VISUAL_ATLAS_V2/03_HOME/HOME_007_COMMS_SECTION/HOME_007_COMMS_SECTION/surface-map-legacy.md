# SURFACE MAP — HOME_007_COMMS_SECTION

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# HOME_007_COMMS_SECTION

**SCREEN ID:** HOME_007_COMMS_SECTION

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — sección Comunicaciones (PLAYER)

**PURPOSE AS IMPLEMENTED:** Bloque de comunicaciones de la pantalla de inicio visto por una jugadora: dos conversaciones (una con no-leído) y el aviso pendiente.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** HOME_001_DEFAULT_COACH (desplazamiento a y = 1400)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** c-team-sexta, c-event-cuba, n2 (sin leer)

**RESOURCE STATE:** PLAYER · 1 mensaje sin leer · 1 aviso sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=player.
2. Desplazar a y = 1400.

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, COM_COMM_005_CONVERSACIONES_PLAYER

**RESPONSIVE COUNTERPART:** La sección es una lista de filas; el ancho cambia pero la estructura no.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Home > section (Comunicaciones)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_007_COMMS_SECTION_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de conversación con no-leído
- **FOCAL 2:** Título de sección «Comunicaciones»
- **SUPPORTING:** Extracto del último mensaje y hora
- **SECONDARY:** Fila de aviso
- **AMBIENT:** BottomNav fijo

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationRow | RowLink | Conversación resumida con su marca de no-leído |
| C02 | NoticeRow (avisos) | RowLink | Aviso pendiente resumido |

### C01 — ConversationRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Conversación resumida con su marca de no-leído
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > RowLink (conversations.slice(0,2))
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=507.69 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×224.31
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Equipo · Sexta A Perfecto, gracias Tomi. 1 sin leer"

#### STATE

- unread (dot bg-unread + «1 sin leer»)

#### INTERACTION

- trigger: click → /conversations/c-team-sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El título se compone según conversation.kind: «Equipo · {teamName}», «Evento · {opponent}» o el nombre de la otra persona.
- El extracto es el cuerpo del último mensaje o «Mensaje eliminado» si el último está borrado.

### C02 — NoticeRow (avisos)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Aviso pendiente resumido
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > RowLink (unreadNotices[0])
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=668.36 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=160.67 · padre 358×224.31
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Avisos El horario del partido cambió 2 sin leer"

#### STATE

- unread

#### INTERACTION

- trigger: click → /notifications

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Sólo se renderiza si unreadNotices.length > 0.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: BottomNav fixed en 390
- initial scroll: scrollY = 1400
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1373 · scrollY 529 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# HOME_007_COMMS_SECTION

**SCREEN ID:** HOME_007_COMMS_SECTION

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — sección Comunicaciones (PLAYER)

**PURPOSE AS IMPLEMENTED:** Bloque de comunicaciones de la pantalla de inicio visto por una jugadora: dos conversaciones (una con no-leído) y el aviso pendiente.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** HOME_001_DEFAULT_COACH (desplazamiento a y = 1400)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** c-team-sexta, c-event-cuba, n2 (sin leer)

**RESOURCE STATE:** PLAYER · 1 mensaje sin leer · 1 aviso sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=player.
2. Desplazar a y = 1400.

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, COM_COMM_005_CONVERSACIONES_PLAYER

**RESPONSIVE COUNTERPART:** La sección es una lista de filas; el ancho cambia pero la estructura no.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Home > section (Comunicaciones)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_007_COMMS_SECTION_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de conversación con no-leído
- **FOCAL 2:** Título de sección «Comunicaciones»
- **SUPPORTING:** Extracto del último mensaje y hora
- **SECONDARY:** Fila de aviso
- **AMBIENT:** BottomNav fijo

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConversationRow | RowLink | Conversación resumida con su marca de no-leído |
| C02 | NoticeRow (avisos) | RowLink | Aviso pendiente resumido |

### C01 — ConversationRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Conversación resumida con su marca de no-leído
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > RowLink (conversations.slice(0,2))
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=628.73 w=1024 h=63.64
- CSS: width: 1024px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1024×206.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Equipo · Sexta A Perfecto, gracias Tomi. 1 sin leer"

#### STATE

- unread (dot bg-unread + «1 sin leer»)

#### INTERACTION

- trigger: click → /conversations/c-team-sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El título se compone según conversation.kind: «Equipo · {teamName}», «Evento · {opponent}» o el nombre de la otra persona.
- El extracto es el cuerpo del último mensaje o «Mensaje eliminado» si el último está borrado.

### C02 — NoticeRow (avisos)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Aviso pendiente resumido
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > RowLink (unreadNotices[0])
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=772.02 w=1024 h=63.64
- CSS: width: 1024px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=143.29 · padre 1024×206.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Avisos El horario del partido cambió 2 sin leer"

#### STATE

- unread

#### INTERACTION

- trigger: click → /notifications

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Sólo se renderiza si unreadNotices.length > 0.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: BottomNav fixed en 390
- initial scroll: scrollY = 1400
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1292 · scrollY 392 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
