# SURFACE MAP — GBL_SHELL_002_TOPBAR_DESKTOP

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_SHELL_002_TOPBAR_DESKTOP

**SCREEN ID:** GBL_SHELL_002_TOPBAR_DESKTOP

**DOMAIN:** 00_Global

**SURFACE NAME:** Chrome de aplicación — barra superior en 1440

**PURPOSE AS IMPLEMENTED:** La misma barra superior en escritorio: desaparece la marca GEI, el contexto pasa a dos líneas y la búsqueda muestra el atajo de teclado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** AUTHENTICATED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach con viewport 1440×900.
2. La barra lateral de destinos aparece a la izquierda (lg:flex).

**RELATED SCREEN IDS:** GBL_SHELL_001_TOPBAR_MOBILE, HOME_001_DEFAULT_COACH

**RESPONSIVE COUNTERPART:** 1440: la barra superior conserva h-16 y el mismo orden de acciones; cambian la marca, el formato del contexto y la forma de la búsqueda.

**SOURCE FILES:** src/app/Shell.tsx

**SOURCE SYMBOLS:** Shell

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SHELL_002_TOPBAR_DESKTOP_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Contexto de ruta en dos líneas («Hockey» / «Inicio»)
- **FOCAL 2:** Bloque de acciones a la derecha (Buscar ⌘K · Avisos · Avatar)
- **SUPPORTING:** Barra lateral de destinos (224 px)
- **SECONDARY:** —
- **AMBIENT:** Fondo de página #f4f6f9

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TopBar (header) | header sticky | Chrome de aplicación en escritorio |
| C02 | RouteContextTwoLine | div con dos p | Sección actual |
| C03 | SearchTextLink | Link con teclado ⌘K | Ir a /search |
| C04 | NotificationsBell | Link 44×44 | Ir a /notifications |
| C05 | ProfileAvatarLink | Link con Avatar sm | Ir a /more/profile |
| C06 | SidebarNav | nav sticky | 5 destinos en escritorio, sin drawer |

### C01 — TopBar (header)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header sticky
- **INSTANCE / ROLE:** Chrome de aplicación en escritorio
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > header
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=65
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- ancho 1440, alto 64

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×1225.36
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Inicio Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- trigger: scroll → permanece fijo

#### MOTION

- SOURCE-CONFIRMED: sticky top-0 z-30, bg-surface/95, backdrop-blur-sm

#### RESPONSIVE

- 390: px-4
- 1440: px-6 (sm:px-6)

#### IMPLEMENTATION NOTES

- —

### C02 — RouteContextTwoLine

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div con dos p
- **INSTANCE / ROLE:** Sección actual
- **SOURCE COMPONENT:** routeContext
- **SOURCE FILE:** src/shared/nav-context.ts
- **SOURCE SYMBOL:** routeContext
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=65
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×1225.36
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Inicio Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: no existe (hidden lg:block)
- 1440: visible; micro-etiqueta «Hockey» + título truncado

#### IMPLEMENTATION NOTES

- —

### C03 — SearchTextLink

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Link con teclado ⌘K
- **INSTANCE / ROLE:** Ir a /search
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > Link to=/search (sm:inline-flex)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1188.38 y=14 w=135.63 h=36
- CSS: width: 135.625px · min-width: auto · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 135.625px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 8px · padding: 0px 10px · min-height: 36px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=4 · padre 227.63×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-search (16x16)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Buscar"

#### STATE

- idle

#### INTERACTION

- trigger: click → /search
- trigger: Cmd/Ctrl+K → /search (listener global en Shell)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: oculto (hidden sm:inline-flex)
- 1440: visible, min-height 36 px (gei-target-sm)

#### IMPLEMENTATION NOTES

- El kbd muestra «⌘K» con borde border-line y tipografía micro.

### C04 — NotificationsBell

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Link 44×44
- **INSTANCE / ROLE:** Ir a /notifications
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > Link to=/notifications
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1328 y=10 w=44 h=44
- CSS: width: 44px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 44px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=139.62 dy=0 · padre 227.63×44

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-bell (19x19)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- unread (punto bg-unread)

#### INTERACTION

- trigger: click → /notifications

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: visible
- 1440: visible

#### IMPLEMENTATION NOTES

- —

### C05 — ProfileAvatarLink

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** Link con Avatar sm
- **INSTANCE / ROLE:** Ir a /more/profile
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > Link to=/more/profile
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1380 y=14 w=36 h=36
- CSS: width: 36px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 36px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px · margin: 0px 0px 0px 4px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=191.62 dy=4 · padre 227.63×44

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "TB"

#### STATE

- idle

#### INTERACTION

- trigger: click → /more/profile

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: visible
- 1440: visible

#### IMPLEMENTATION NOTES

- —

### C06 — SidebarNav

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** nav sticky
- **INSTANCE / ROLE:** 5 destinos en escritorio, sin drawer
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

- Inicio activo (bg-selected-soft text-selected)

#### INTERACTION

- trigger: click → navegación SPA

#### MOTION

- transition-colors duration-micro ease-gei en cada item

#### RESPONSIVE

- 390: no existe
- 1440: 224 px de ancho, alto calc(100dvh - 4rem), scroll propio

#### IMPLEMENTATION NOTES

- El código lo describe como «los mismos 5, sin drawer».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0 z-30; nav lateral sticky top-16 h-[calc(100dvh-4rem)]
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 en cada cambio de ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1225 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la barra superior conserva 64 px de alto en ambos; lo que cambia es su contenido, no su altura.
- El logo de 36×36 pasa a no existir en lg; la búsqueda pasa de icono 44×44 a texto con badge ⌘K.
- El contexto de ruta pasa de una línea truncada a dos líneas con un micro-etiqueta «Hockey».
