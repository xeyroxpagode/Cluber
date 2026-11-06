# SURFACE MAP — EQ_TEAM_DETAIL_006_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_006_SCROLL_02

**SCREEN ID:** EQ_TEAM_DETAIL_006_SCROLL_02

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — franja de eventos pasados

**PURPOSE AS IMPLEMENTED:** Parte inferior de la pestaña Eventos: la lista de eventos pasados y el final de la pila de tarjetas.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/sexta

**ORIGIN:** EQ_TEAM_DETAIL_001_EVENTOS (desplazamiento a y = 900)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta, match-sic, match-lomas

**RESOURCE STATE:** SCHEDULED · scroll 900 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?demo=coach.
2. Desplazar a y = 900.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** Las tarjetas de eventos próximos se apilan en una columna en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail > DetailSection «Eventos pasados»

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_006_SCROLL_02_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Tarjetas de eventos con su control de disponibilidad
- **FOCAL 2:** Sección «Eventos pasados»
- **SUPPORTING:** Pestañas del equipo (fuera de pantalla)
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventCard (con VasControl) | Surface grid gap-3 | Evento próximo con control de disponibilidad |

### C01 — EventCard (con VasControl)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface grid gap-3
- **INSTANCE / ROLE:** Evento próximo con control de disponibilidad
- **SOURCE COMPONENT:** Surface + EventLine + VasControl
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > ul > li > Surface
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=-146.45 w=324 h=83.03
- CSS: width: 324px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=17 · padre 358×181.2

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. CUBA Sexta A · GEI · Cancha de hockey 18:00 mar, 27 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click en la fila → detalle del evento

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El orden de los eventos es descendente por fecha (el más próximo primero), al revés que el calendario.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 900
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1846 · scrollY 900 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_TEAM_DETAIL_006_SCROLL_02

**SCREEN ID:** EQ_TEAM_DETAIL_006_SCROLL_02

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — franja de eventos pasados

**PURPOSE AS IMPLEMENTED:** Parte inferior de la pestaña Eventos: la lista de eventos pasados y el final de la pila de tarjetas.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/sexta

**ORIGIN:** EQ_TEAM_DETAIL_001_EVENTOS (desplazamiento a y = 900)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta, match-sic, match-lomas

**RESOURCE STATE:** SCHEDULED · scroll 900 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?demo=coach.
2. Desplazar a y = 900.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** Las tarjetas de eventos próximos se apilan en una columna en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail > DetailSection «Eventos pasados»

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_006_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Tarjetas de eventos con su control de disponibilidad
- **FOCAL 2:** Sección «Eventos pasados»
- **SUPPORTING:** Pestañas del equipo (fuera de pantalla)
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventCard (con VasControl) | Surface grid gap-3 | Evento próximo con control de disponibilidad |

### C01 — EventCard (con VasControl)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface grid gap-3
- **INSTANCE / ROLE:** Evento próximo con control de disponibilidad
- **SOURCE COMPONENT:** Surface + EventLine + VasControl
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > ul > li > Surface
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=341 y=-4.08 w=982 h=67.08
- CSS: width: 982px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 982px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=21 · padre 1024×138.47

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. CUBA Sexta A · GEI · Cancha de hockey 18:00 mar, 27 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click en la fila → detalle del evento

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El orden de los eventos es descendente por fecha (el más próximo primero), al revés que el calendario.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 900
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1571 · scrollY 671 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
