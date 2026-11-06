# SURFACE MAP — GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION

**SCREEN ID:** GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION

**DOMAIN:** 00_Global

**SURFACE NAME:** Barra inferior de destinos con «Comunicación» activo y sin contador (390)

**PURPOSE AS IMPLEMENTED:** La barra inferior de destinos cuando la sección activa es Comunicación. El BottomNav no muestra contadores de mensajes sin leer; el contador vive en la barra lateral de escritorio.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication

**ORIGIN:** Shell

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, c-team-sexta (2 sin leer)

**RESOURCE STATE:** AUTHENTICATED · 2 mensajes sin leer en el equipo

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?demo=coach con viewport 390×844.

**RELATED SCREEN IDS:** GBL_NAV_004_SIDEBAR_BADGES_COACH, COM_COMM_001_CONVERSACIONES

**RESPONSIVE COUNTERPART:** 390: sin contador. 1440: el mismo destino muestra punto + «2» en texto selected.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell > nav (bottom)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Destino activo «Comunicación»
- **FOCAL 2:** Resto de destinos
- **SUPPORTING:** Íconos
- **SECONDARY:** Contenido de comunicación
- **AMBIENT:** TopBar

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | BottomNav | nav fixed | Destinos en móvil |

### C01 — BottomNav

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** nav fixed
- **INSTANCE / ROLE:** Destinos en móvil
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > nav (lg:hidden)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=788.16 w=390 h=55.84
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- fixed

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=788.16 · padre 390×844
- aligned with parent left edge
- positioned fixed · z-index 30

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Comunicación Más"

#### STATE

- Comunicación activa; sin contador visible

#### INTERACTION

- trigger: click/tap → navegación SPA

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: 5 destinos iguales
- 1440: no existe

#### IMPLEMENTATION NOTES

- El bloque de contadores (unreadMessages / unread) está escrito sólo en la barra lateral (lg:flex), no en la inferior.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: nav fixed bottom-0 z-30
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el BottomNav de 390 no tiene contadores; la barra lateral de 1440 sí (dot bg-unread + número).
