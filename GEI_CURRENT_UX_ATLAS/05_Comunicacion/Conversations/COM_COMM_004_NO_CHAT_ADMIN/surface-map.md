# SURFACE MAP — COM_COMM_004_NO_CHAT_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_COMM_004_NO_CHAT_ADMIN

**SCREEN ID:** COM_COMM_004_NO_CHAT_ADMIN

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — sin conversaciones habilitadas (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado para un actor sin permiso de chat: la pantalla no muestra pestañas ni listas.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication

**ORIGIN:** Shell → destino «Comunicación» (actor ADMIN; el destino no aparece en su navegación)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin

**RESOURCE STATE:** SIN ROL DE CHAT

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?demo=admin.

**RELATED SCREEN IDS:** GBL_NAV_005_SIDEBAR_BADGES_ADMIN, COM_COMM_001_CONVERSACIONES

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CommunicationHome (!canOpen('communication')) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_004_NO_CHAT_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés conversaciones habilitadas»
- **FOCAL 2:** Detalle «La comunicación con el club se habilita por rol.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoChatEmpty | Empty | Estado de acceso denegado por rol |

### C01 — NoChatEmpty

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

- canChat exige un rol PLAYER, CAPTAIN o COACH con pertenencia vigente.
- El ADMIN no cumple ninguna de las dos condiciones, por eso el destino «Comunicación» tampoco aparece en su navegación.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# COM_COMM_004_NO_CHAT_ADMIN

**SCREEN ID:** COM_COMM_004_NO_CHAT_ADMIN

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — sin conversaciones habilitadas (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado de acceso denegado para un actor sin permiso de chat: la pantalla no muestra pestañas ni listas.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication

**ORIGIN:** Shell → destino «Comunicación» (actor ADMIN; el destino no aparece en su navegación)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin

**RESOURCE STATE:** SIN ROL DE CHAT

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?demo=admin.

**RELATED SCREEN IDS:** GBL_NAV_005_SIDEBAR_BADGES_ADMIN, COM_COMM_001_CONVERSACIONES

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CommunicationHome (!canOpen('communication')) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_004_NO_CHAT_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés conversaciones habilitadas»
- **FOCAL 2:** Detalle «La comunicación con el club se habilita por rol.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoChatEmpty | Empty | Estado de acceso denegado por rol |

### C01 — NoChatEmpty

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

- canChat exige un rol PLAYER, CAPTAIN o COACH con pertenencia vigente.
- El ADMIN no cumple ninguna de las dos condiciones, por eso el destino «Comunicación» tampoco aparece en su navegación.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
