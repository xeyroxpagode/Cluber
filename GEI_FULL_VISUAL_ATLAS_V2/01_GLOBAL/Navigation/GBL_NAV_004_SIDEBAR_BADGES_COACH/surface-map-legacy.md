# SURFACE MAP — GBL_NAV_004_SIDEBAR_BADGES_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NAV_004_SIDEBAR_BADGES_COACH

**SCREEN ID:** GBL_NAV_004_SIDEBAR_BADGES_COACH

**DOMAIN:** 00_Global

**SURFACE NAME:** Barra lateral con contadores de no-leídos (COACH, 1440)

**PURPOSE AS IMPLEMENTED:** Barra lateral de escritorio con los contadores de mensajes sin leer (Comunicación) y avisos sin leer (Más).

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, c-team-sexta unread=2, n1 unread=1

**RESOURCE STATE:** AUTHENTICATED · 2 mensajes sin leer · 1 aviso sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach con viewport 1440×900.

**RELATED SCREEN IDS:** GBL_NAV_005_SIDEBAR_BADGES_ADMIN, GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION

**RESPONSIVE COUNTERPART:** 1440: barra lateral con contadores. 390: el BottomNav equivalente no muestra contadores.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell > nav (lg:flex) contadores unread / unreadMessages

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NAV_004_SIDEBAR_BADGES_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Contadores «2» (Comunicación) y «1» (Más)
- **FOCAL 2:** Lista de destinos con icono + label
- **SUPPORTING:** Íconos de 19 px
- **SECONDARY:** Contenido de Inicio
- **AMBIENT:** TopBar y fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SidebarNav | nav sticky | Destinos con contadores |
| C02 | UnreadBadge (Comunicación) | span con dot + cifra | Mensajes sin leer en el destino Comunicación |

### C01 — SidebarNav

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** nav sticky
- **INSTANCE / ROLE:** Destinos con contadores
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > nav (lg:flex)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=65 w=224 h=836
- CSS: width: 224px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 224px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · gap: 4px · padding: 16px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×1160.36
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Comunicación 2 Más 1"

#### STATE

- Inicio activo; contadores en Comunicación y Más

#### INTERACTION

- trigger: click → navegación SPA

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: no existe
- 1440: 224 px

#### IMPLEMENTATION NOTES

- —

### C02 — UnreadBadge (Comunicación)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span con dot + cifra
- **INSTANCE / ROLE:** Mensajes sin leer en el destino Comunicación
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > nav (badge unreadMessages)
- **PARENT:** a
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=179.52 y=238.3 w=19.48 h=17.39
- CSS: width: 19.4844px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 19.4844px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 4px · padding: 0px · margin: 0px 0px 0px 15.0156px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by a · offset dx=167.52 dy=13.3 · padre 199×44

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "2"

#### STATE

- unread

#### INTERACTION

- No interactivo por separado; se navega por el NavLink padre

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: no existe
- 1440: ml-auto, dot 8×8 bg-unread + texto «2»

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: nav sticky top-16
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1225 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los contadores (dot bg-unread + cifra en text-meta font-semibold text-selected) existen únicamente en la versión lateral.
