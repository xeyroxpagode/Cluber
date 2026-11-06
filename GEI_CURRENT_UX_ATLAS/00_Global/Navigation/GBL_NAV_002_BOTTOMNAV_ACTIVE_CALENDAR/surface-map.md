# SURFACE MAP — GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR

**SCREEN ID:** GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR

**DOMAIN:** 00_Global

**SURFACE NAME:** Barra inferior de destinos con «Calendario» activo (390)

**PURPOSE AS IMPLEMENTED:** Navegación principal en móvil. Barra fija inferior con 5 destinos en columna.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar

**ORIGIN:** Shell

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** AUTHENTICATED · ruta /calendar

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?demo=coach con viewport 390×844.

**RELATED SCREEN IDS:** GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR

**RESPONSIVE COUNTERPART:** 390: barra inferior fija. En 1440 esta barra no se renderiza.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell > nav (lg:hidden)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Destino activo «Calendario» (texto selected)
- **FOCAL 2:** Conjunto de 5 destinos de 78 px de ancho
- **SUPPORTING:** Íconos lucide de 20 px
- **SECONDARY:** Contenido del calendario
- **AMBIENT:** TopBar

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | BottomNav | nav fixed | Destinos en móvil |
| C02 | NavItem Activo (Calendario) | a (NavLink) | Destino activo |

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

- contained-by div · offset dx=0 dy=788.16 · padre 390×1744.52
- aligned with parent left edge
- positioned fixed · z-index 30

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Comunicación Más"

#### STATE

- «Calendario» activo

#### INTERACTION

- trigger: click/tap → navegación SPA

#### MOTION

- transition-colors (sin duración declarada en este nav)

#### RESPONSIVE

- 390: fixed, 5 × 78 px, alto 54,84 px + safe-area
- 1440: no existe

#### IMPLEMENTATION NOTES

- —

### C02 — NavItem Activo (Calendario)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** a (NavLink)
- **INSTANCE / ROLE:** Destino activo
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > NavLink to=/calendar (bottom)
- **PARENT:** nav
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=78 y=789.16 w=78 h=54.84
- CSS: width: 78px · min-width: 0px · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 78px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: center · align-items: center · gap: 4px · padding: 8px 0px · min-height: auto

#### SPATIAL RELATIONSHIPS

- contained-by nav · offset dx=78 dy=1 · padre 390×55.84

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-calendar-days (20x20)
- typography: font-family: Inter · font-size: 11px · line-height: 14.85px · font-weight: 600

#### CONTENT

- visible: "Calendario"

#### STATE

- selected (text-selected)

#### INTERACTION

- trigger: click/tap → /calendar

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: columna: icono 20 px + label micro truncado
- 1440: n/a

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: nav fixed inset-x-0 bottom-0 z-30
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 en cada ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1745 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los 5 destinos son los mismos; 390 usa columna (icono 20 px + label micro, 54,84 px de alto), 1440 usa fila lateral (icono 19 px + label body).
