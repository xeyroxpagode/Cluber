# SURFACE MAP — HOME_006_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# HOME_006_SCROLL_02

**SCREEN ID:** HOME_006_SCROLL_02

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — segunda franja de scroll (COACH)

**PURPOSE AS IMPLEMENTED:** Bloque «Próximamente» completo y bloque «Comunicaciones» en la parte inferior de la pantalla de inicio.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** HOME_001_DEFAULT_COACH (desplazamiento a y = 760)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-2, club-familias, training-serie-3, match-cuba

**RESOURCE STATE:** COACH · scroll 760 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.
2. Desplazar a y = 760.

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, HOME_007_COMMS_SECTION

**RESPONSIVE COUNTERPART:** 390: el BottomNav fijo tapa los últimos 54,84 px del viewport; <main> reserva pb-28 (112 px) para que el contenido no quede oculto. 1440: <main> reserva pb-16 (64 px).

**SOURCE FILES:** src/features/overview.tsx, src/app/Shell.tsx

**SOURCE SYMBOLS:** Home, Shell > main

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_006_SCROLL_02_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de eventos próximos con hora y fecha alineadas
- **FOCAL 2:** Encabezado de sección «Próximamente» con su link
- **SUPPORTING:** Sedes con icono de ubicación
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo sobre el contenido

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventRow (Entrenamiento Sexta A) | RowLink | Fila de evento próximo |
| C02 | BottomNav (fijo) | nav fixed | Destinos, persistente sobre el contenido |

### C01 — EventRow (Entrenamiento Sexta A)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Fila de evento próximo
- **SOURCE COMPONENT:** RowLink + EventLine
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** EventLine
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=126.13 w=348 h=67.08
- CSS: width: 348px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 348px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 348×67.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Entrenamiento Sexta A Sexta A · GEI · Cancha de hockey 19:00 vie, 23 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click → /events/training-serie-2

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 348×67,08 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle usa un span flex-wrap con destinos, punto medio y sede con MapPin 11 px.
- En 1440 el ancho de la fila pasa a ~1014 px dentro del Surface de 1024 px.

### C02 — BottomNav (fijo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** nav fixed
- **INSTANCE / ROLE:** Destinos, persistente sobre el contenido
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

- contained-by div · offset dx=0 dy=1251.16 · padre 390×1306.7
- aligned with parent left edge
- positioned fixed · z-index 30

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Comunicación Más"

#### STATE

- Inicio activo

#### INTERACTION

- trigger: click → navegación SPA

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: fixed bottom-0, 55,84 px de alto, fondo bg-surface con borde superior
- 1440: no existe

#### IMPLEMENTATION NOTES

- El fondo es bg-surface (opaco) con border-t border-line; no lleva backdrop-blur.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: BottomNav fixed bottom-0 z-30 en 390; header sticky
- initial scroll: scrollY = 760
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1307 · scrollY 463 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el padding inferior del área de contenido cambia de pb-28 (112 px) a pb-16 (64 px) porque en 1440 no hay barra inferior.

# HOME_006_SCROLL_02

**SCREEN ID:** HOME_006_SCROLL_02

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — segunda franja de scroll (COACH)

**PURPOSE AS IMPLEMENTED:** Bloque «Próximamente» completo y bloque «Comunicaciones» en la parte inferior de la pantalla de inicio.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** HOME_001_DEFAULT_COACH (desplazamiento a y = 760)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-2, club-familias, training-serie-3, match-cuba

**RESOURCE STATE:** COACH · scroll 760 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.
2. Desplazar a y = 760.

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, HOME_007_COMMS_SECTION

**RESPONSIVE COUNTERPART:** 390: el BottomNav fijo tapa los últimos 54,84 px del viewport; <main> reserva pb-28 (112 px) para que el contenido no quede oculto. 1440: <main> reserva pb-16 (64 px).

**SOURCE FILES:** src/features/overview.tsx, src/app/Shell.tsx

**SOURCE SYMBOLS:** Home, Shell > main

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_006_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de eventos próximos con hora y fecha alineadas
- **FOCAL 2:** Encabezado de sección «Próximamente» con su link
- **SUPPORTING:** Sedes con icono de ubicación
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo sobre el contenido

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventRow (Entrenamiento Sexta A) | RowLink | Fila de evento próximo |
| C02 | BottomNav (fijo) | nav fixed | Destinos, persistente sobre el contenido |

### C01 — EventRow (Entrenamiento Sexta A)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Fila de evento próximo
- **SOURCE COMPONENT:** RowLink + EventLine
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** EventLine
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=325 y=264.13 w=1014 h=67.08
- CSS: width: 1014px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1014px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 1014×67.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Entrenamiento Sexta A Sexta A · GEI · Cancha de hockey 19:00 vie, 23 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click → /events/training-serie-2

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 348×67,08 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El detalle usa un span flex-wrap con destinos, punto medio y sede con MapPin 11 px.
- En 1440 el ancho de la fila pasa a ~1014 px dentro del Surface de 1024 px.

### C02 — BottomNav (fijo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** nav fixed
- **INSTANCE / ROLE:** Destinos, persistente sobre el contenido
- **SOURCE COMPONENT:** Shell
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > nav (lg:hidden)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=64 w=224 h=836
- CSS: width: 224px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 224px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · gap: 4px · padding: 16px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=324 · padre 1440×1160.36
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Comunicación 2 Más 1"

#### STATE

- Inicio activo

#### INTERACTION

- trigger: click → navegación SPA

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: fixed bottom-0, 55,84 px de alto, fondo bg-surface con borde superior
- 1440: no existe

#### IMPLEMENTATION NOTES

- El fondo es bg-surface (opaco) con border-t border-line; no lleva backdrop-blur.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: BottomNav fixed bottom-0 z-30 en 390; header sticky
- initial scroll: scrollY = 760
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1225 · scrollY 325 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el padding inferior del área de contenido cambia de pb-28 (112 px) a pb-16 (64 px) porque en 1440 no hay barra inferior.
