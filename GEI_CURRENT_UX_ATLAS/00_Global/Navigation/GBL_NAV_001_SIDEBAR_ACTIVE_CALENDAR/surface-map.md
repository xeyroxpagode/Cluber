# SURFACE MAP — GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR

**SCREEN ID:** GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR

**DOMAIN:** 00_Global

**SURFACE NAME:** Barra lateral de destinos con «Calendario» activo (1440)

**PURPOSE AS IMPLEMENTED:** Navegación principal de escritorio. Se muestra completa con 5 destinos y marca como activo el destino de la ruta actual.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar

**ORIGIN:** Shell

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** AUTHENTICATED · ruta /calendar

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?demo=coach con viewport 1440×900.

**RELATED SCREEN IDS:** GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR, GBL_NAV_004_SIDEBAR_BADGES_COACH

**RESPONSIVE COUNTERPART:** 1440: la barra lateral existe. En 390 no existe: la misma función la cumple el BottomNav fijo.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell > nav (Destinos), sectionActive

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Destino activo «Calendario» (fondo azul suave, texto selected)
- **FOCAL 2:** Bloque de destinos de escritorio (columna de 224 px)
- **SUPPORTING:** Íconos lucide de cada destino (19 px, strokeWidth 1.9)
- **SECONDARY:** Contenido del calendario
- **AMBIENT:** TopBar

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SidebarNav | nav sticky | Destinos de escritorio |
| C02 | NavItem Activo (Calendario) | a (NavLink) | Destino activo |

### C01 — SidebarNav

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** nav sticky
- **INSTANCE / ROLE:** Destinos de escritorio
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > nav (aria-label «Destinos», lg:flex)
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

- contained-by div · offset dx=0 dy=0 · padre 1440×977.83
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Comunicación 2 Más 1"

#### STATE

- «Calendario» marcado con aria-current="page"

#### INTERACTION

- trigger: click → navegación SPA

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: no existe
- 1440: 224 px de ancho

#### IMPLEMENTATION NOTES

- —

### C02 — NavItem Activo (Calendario)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** a (NavLink)
- **INSTANCE / ROLE:** Destino activo
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > NavLink to=/calendar
- **PARENT:** nav
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=12 y=129 w=199 h=44
- CSS: width: 199px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 199px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 0px 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by nav · offset dx=12 dy=64 · padre 224×836

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-calendar-days (19x19)
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 600

#### CONTENT

- visible: "Calendario"

#### STATE

- selected (bg-selected-soft text-selected, aria-current=page)

#### INTERACTION

- trigger: click → /calendar

#### MOTION

- transition-colors duration-micro ease-gei (120 ms)

#### RESPONSIVE

- 390: n/a
- 1440: min-height 44 px (gei-target), padding-inline 12 px

#### IMPLEMENTATION NOTES

- El estado activo se calcula con sectionActive(): /calendar incluye /events y /jornadas como hijos.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: nav sticky top-16, alto calc(100dvh-4rem), overflow-y auto propio
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 en cada ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1043 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: no hay barra lateral; el BottomNav fijo de 5 destinos cumple la misma función con icono + label micro.
- 1440: barra lateral de 224 px con icono 19 px + label body font-semibold, item activo con fondo bg-selected-soft.
- Los 5 destinos son idénticos en ambos viewports; sólo cambia el soporte y la posición (columna izquierda ↔ fila inferior).
