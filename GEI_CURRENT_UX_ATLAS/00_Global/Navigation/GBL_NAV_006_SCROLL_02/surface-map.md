# SURFACE MAP — GBL_NAV_006_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NAV_006_SCROLL_02

**SCREEN ID:** GBL_NAV_006_SCROLL_02

**DOMAIN:** 00_Global

**SURFACE NAME:** Barra lateral con scroll propio de navegación (1440)

**PURPOSE AS IMPLEMENTED:** Estado de scroll de la columna de destinos de escritorio. El nav lateral tiene overflow-y: auto propio y altura limitada al alto del viewport menos la barra superior.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin

**RESOURCE STATE:** AUTHENTICATED · página desplazada 900 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=admin con viewport 1440×900.
2. Desplazar la página a y = 900.

**RELATED SCREEN IDS:** GBL_NAV_005_SIDEBAR_BADGES_ADMIN

**RESPONSIVE COUNTERPART:** 1440: la barra lateral permanece fija mientras el contenido se desplaza. En 390 no hay columna lateral: el contenido sí se desplaza bajo el BottomNav fijo.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell > nav (sticky top-16 h-[calc(100dvh-4rem)] overflow-y-auto)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NAV_006_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Barra lateral de destinos, independiente del scroll de la página
- **FOCAL 2:** Contenido desplazado de Inicio
- **SUPPORTING:** TopBar fijo
- **SECONDARY:** —
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SidebarNav (sticky) | nav sticky | Destinos que no se desplazan con el contenido |

### C01 — SidebarNav (sticky)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** nav sticky
- **INSTANCE / ROLE:** Destinos que no se desplazan con el contenido
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > nav
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=63.5 w=224 h=836
- CSS: width: 224px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 224px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · gap: 4px · padding: 16px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=348.5 · padre 1440×1184.5
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Más"

#### STATE

- fijo respecto del scroll de la página

#### INTERACTION

- trigger: scroll de la página → la columna no se mueve

#### MOTION

- Sin transición; el anclaje lo da position: sticky

#### RESPONSIVE

- 390: no existe
- 1440: sticky top-16, alto calc(100dvh - 4rem)

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página (document scroll) para el contenido; la barra lateral tiene su propio overflow-y: auto
- what remains sticky/fixed: nav lateral sticky top-16 con alto calc(100dvh - 4rem); header sticky top-0
- initial scroll: scrollY = 0; el nav lateral en scrollTop 0
- scroll restoration observed: el Shell resetea el scroll de la página en cada cambio de ruta
- scroll lost on navigation: Sí al navegar

- Medición de documento: scrollWidth 1440 · scrollHeight 1250 · scrollY 350 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: en 390 la navegación no tiene columna; el espacio vertical del viewport lo ocupa el BottomNav fijo (54,84 px) más el padding-bottom de <main> (pb-28 = 112 px).
