# SURFACE MAP — GBL_SHELL_001_TOPBAR_MOBILE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_SHELL_001_TOPBAR_MOBILE

**SCREEN ID:** GBL_SHELL_001_TOPBAR_MOBILE

**DOMAIN:** 00_Global

**SURFACE NAME:** Chrome de aplicación — barra superior en 390

**PURPOSE AS IMPLEMENTED:** Barra superior fija del Shell en móvil: marca GEI, contexto de ruta, buscar, avisos y avatar. Es el cromo permanente de todas las pantallas autenticadas.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** Shell (raíz de todas las rutas autenticadas)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach (Tomás Beltrán)

**RESOURCE STATE:** AUTHENTICATED · sin avisos sin leer

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir el dev server (pnpm dev) en http://localhost:8443.
2. Navegar a /home?demo=coach.
3. Esperar el layout estable; no hay scroll en esta captura.

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, GBL_SHELL_002_TOPBAR_DESKTOP

**RESPONSIVE COUNTERPART:** 390: la barra mide 390×64 y muestra marca + contexto + tres iconos. En 1440 la misma barra pasa a 1440×64 con el contexto en dos líneas y el atajo ⌘K visible.

**SOURCE FILES:** src/app/Shell.tsx, src/styles/theme.css

**SOURCE SYMBOLS:** Shell, routeContext

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_SHELL_001_TOPBAR_MOBILE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Contexto de ruta «Inicio» en la barra superior
- **FOCAL 2:** Marca GEI (36×36) + avatar del actor
- **SUPPORTING:** Icono de buscar, icono de avisos con punto de no-leído
- **SECONDARY:** —
- **AMBIENT:** Barra inferior de destinos (fija, 55,84 px de alto)

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TopBar (header) | header sticky | Chrome de aplicación: marca, contexto, buscar, avisos, avatar |
| C02 | BrandMark (GEI) | Link con span | Ir al inicio |
| C03 | RouteContext | p (truncate) | Nombre de la sección actual en vocabulario de usuario |
| C04 | SearchIconButton | Link (a) 44×44 | Ir a /search |
| C05 | NotificationsBell | Link (a) 44×44 + punto de no-leído | Ir a /notifications |
| C06 | ProfileAvatarLink | Link con Avatar | Ir a /more/profile |
| C07 | BottomNav | nav fixed | 5 destinos principales en móvil |

### C01 — TopBar (header)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header sticky
- **INSTANCE / ROLE:** Chrome de aplicación: marca, contexto, buscar, avisos, avatar
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > header
- **PARENT:** div
- **CHILDREN:** C02..C07

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=65
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- ancho completo del viewport; alto fijo h-16

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×1306.7
- aligned with parent left edge
- sticky-to: top 0 del viewport
- z-index 30, por debajo de overlays (z-50) y del toast (z-50)
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Inicio TB"

#### STATE

- idle

#### INTERACTION

- trigger: scroll de página → permanece fijo arriba
- result: el contenido de <main> pasa por debajo con desenfoque de 2 px (backdrop-blur-sm)

#### MOTION

- Sin animación de entrada propia.
- background-color: bg-surface/95 + backdrop-filter: blur(2px) — SOURCE-CONFIRMED en src/app/Shell.tsx:111

#### RESPONSIVE

- 390: h-16, px-4, marca GEI visible (lg:hidden la oculta)
- 1440: h-16, px-6 (sm:px-6), marca oculta, contexto en dos líneas

#### IMPLEMENTATION NOTES

- El contenido de la barra cambia por breakpoint, no por estado: la marca existe sólo bajo lg y la búsqueda con ⌘K sólo desde sm.

### C02 — BrandMark (GEI)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Link con span
- **INSTANCE / ROLE:** Ir al inicio
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > Link (aria-label «GEI Hockey · Inicio»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=14 w=36 h=36
- CSS: width: 36px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 36px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 8px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=16 dy=14 · padre 390×64

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI"

#### STATE

- idle

#### INTERACTION

- trigger: click/tap → navegación SPA a /home

#### MOTION

- Sin transición declarada

#### RESPONSIVE

- 390: visible (clase lg:hidden)
- 1440: oculto (lg:hidden)

#### IMPLEMENTATION NOTES

- El span interior mide 36×36 px (size-9) con bg-brand y texto blanco.

### C03 — RouteContext

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** p (truncate)
- **INSTANCE / ROLE:** Nombre de la sección actual en vocabulario de usuario
- **SOURCE COMPONENT:** routeContext
- **SOURCE FILE:** src/shared/nav-context.ts
- **SOURCE SYMBOL:** routeContext
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=64 y=21.16 w=162 h=21.69
- CSS: width: 162px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 162px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 162×21.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 600

#### CONTENT

- visible: "Inicio"

#### STATE

- idle

#### INTERACTION

- No interactivo; cambia solo con la ruta

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: bloque flex-1 con truncate, una sola línea
- 1440: encabezado de dos bloques: micro «Hockey» + p truncado

#### IMPLEMENTATION NOTES

- El texto proviene de la tabla CONTEXT_BY_PREFIX de nav-context.ts.

### C04 — SearchIconButton

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Link (a) 44×44
- **INSTANCE / ROLE:** Ir a /search
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > Link to=/search (sm:hidden)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=238 y=10 w=44 h=44
- CSS: width: 44px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 44px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 136×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-search (19x19)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle

#### INTERACTION

- trigger: click/tap → /search
- atajo de teclado: Cmd/Ctrl+K (listener en Shell) navega a /search

#### MOTION

- transition-colors duration-micro (120 ms)

#### RESPONSIVE

- 390: visible (sm:hidden)
- 1440: oculto; en su lugar aparece el link de texto «Buscar ⌘K»

#### IMPLEMENTATION NOTES

- Icono lucide Search de 19 px.

### C05 — NotificationsBell

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** Link (a) 44×44 + punto de no-leído
- **INSTANCE / ROLE:** Ir a /notifications
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > Link to=/notifications
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=286 y=10 w=44 h=44
- CSS: width: 44px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 44px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=48 dy=0 · padre 136×44

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-bell (19x19)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- unread: hay 1 aviso sin leer para coach (dot bg-unread 8×8 con ring-surface)

#### INTERACTION

- trigger: click/tap → /notifications

#### MOTION

- transition-colors duration-micro (120 ms)

#### RESPONSIVE

- 390: visible, 44×44
- 1440: visible, 44×44

#### IMPLEMENTATION NOTES

- El aria-label cambia: «Avisos, N sin leer» / «Avisos, todo leído».
- El punto usa bg-unread (#1a4fa0) con ring-2 ring-surface para separarlo del fondo.

### C06 — ProfileAvatarLink

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** Link con Avatar
- **INSTANCE / ROLE:** Ir a /more/profile
- **SOURCE COMPONENT:** Shell + Avatar
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > Link to=/more/profile
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=338 y=14 w=36 h=36
- CSS: width: 36px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 36px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px · margin: 0px 0px 0px 4px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=100 dy=4 · padre 136×44

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "TB"

#### STATE

- idle

#### INTERACTION

- trigger: click/tap → /more/profile

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: visible
- 1440: visible

#### IMPLEMENTATION NOTES

- Envuelve un Avatar size=sm (32×32) con anilloselected-line.

### C07 — BottomNav

- **COMPONENT ID:** C07
- **COMPONENT TYPE:** nav fixed
- **INSTANCE / ROLE:** 5 destinos principales en móvil
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > nav (aria-label «Destinos», lg:hidden)
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

- contained-by div · offset dx=0 dy=788.16 · padre 390×1306.7
- aligned with parent left edge
- positioned fixed · z-index 30

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Comunicación Más"

#### STATE

- el destino activo es Inicio (text-selected); el resto text-ink-muted

#### INTERACTION

- trigger: click/tap en un destino → navegación SPA
- cada item es flex-1 con el mismo ancho (78 px a 390)

#### MOTION

- transition-colors (sin duración explícita en este nav)

#### RESPONSIVE

- 390: fixed inset-x-0 bottom-0, 5 items de 78 px, icono 20 px + label micro
- 1440: oculto (lg:hidden)

#### IMPLEMENTATION NOTES

- pb-[env(safe-area-inset-bottom)] para el gesto de inicio del sistema.
- No muestra contadores de no-leídos: los badges sólo están en la barra lateral de escritorio.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: El <header> es sticky top-0 z-30; el <nav> inferior es fixed bottom-0 z-30.
- initial scroll: scrollY = 0
- scroll restoration observed: El Shell hace window.scrollTo({top:0}) en cada cambio de pathname.
- scroll lost on navigation: Sí: cada navegación reinicia el scroll a 0.

- Medición de documento: scrollWidth 390 · scrollHeight 1307 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: header h-16 (64 px), padding-inline 16 px, marca GEI de 36×36 a la izquierda, contexto de ruta truncado, tres iconos de 44×44 a la derecha.
- 1440: header h-16 (64 px), padding-inline 24 px (sm:px-6), sin marca GEI, contexto en dos líneas (micro «Hockey» + título de ruta), búsqueda como texto con teclado ⌘K.
- Los destinos cambian de soporte: barra lateral fija de 224 px (lg) ↔ barra inferior fija de 5 destinos (lg:hidden).
