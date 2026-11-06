# SURFACE MAP — XD_HOME_001_TO_EVENT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_HOME_001_TO_EVENT

**SCREEN ID:** XD_HOME_001_TO_EVENT

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Inicio → Evento

**PURPOSE AS IMPLEMENTED:** Trayecto desde la lista de eventos de hoy en la pantalla de inicio hasta el detalle del evento.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** INICIO → EVENTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.
2. Pulsar la fila «GEI vs. Lomas».

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, CAL_EVENT_DETAIL_005_IN_PROGRESS

**RESPONSIVE COUNTERPART:** El destino conserva la retícula de dos columnas en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/features/events.tsx

**SOURCE SYMBOLS:** Home > EventLine, EventDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_HOME_001_TO_EVENT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «GEI vs. Lomas»
- **FOCAL 2:** Bloque «Operación pendiente»
- **SUPPORTING:** Quién dijo qué
- **SECONDARY:** Logística e historial
- **AMBIENT:** Aside de resumen

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventDetailHeader | header grid | Destino de la navegación |

### C01 — EventDetailHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (EventDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=116.59 w=358 h=29.63
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×82.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "GEI vs. Lomas"

#### STATE

- IN_PROGRESS

#### INTERACTION

- trigger: click en «Acciones» → transiciones disponibles para el evento en curso

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El evento del día en el seed es match-lomas, que está IN_PROGRESS.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2009 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva su propia retícula.

# XD_HOME_001_TO_EVENT

**SCREEN ID:** XD_HOME_001_TO_EVENT

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Inicio → Evento

**PURPOSE AS IMPLEMENTED:** Trayecto desde la lista de eventos de hoy en la pantalla de inicio hasta el detalle del evento.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** INICIO → EVENTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.
2. Pulsar la fila «GEI vs. Lomas».

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, CAL_EVENT_DETAIL_005_IN_PROGRESS

**RESPONSIVE COUNTERPART:** El destino conserva la retícula de dos columnas en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/features/events.tsx

**SOURCE SYMBOLS:** Home > EventLine, EventDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_HOME_001_TO_EVENT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «GEI vs. Lomas»
- **FOCAL 2:** Bloque «Operación pendiente»
- **SUPPORTING:** Quién dijo qué
- **SECONDARY:** Logística e historial
- **AMBIENT:** Aside de resumen

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EventDetailHeader | header grid | Destino de la navegación |

### C01 — EventDetailHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (EventDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=116.59 w=703.34 h=29.63
- CSS: width: 703.344px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 703.344px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 703.34×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "GEI vs. Lomas"

#### STATE

- IN_PROGRESS

#### INTERACTION

- trigger: click en «Acciones» → transiciones disponibles para el evento en curso

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El evento del día en el seed es match-lomas, que está IN_PROGRESS.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1416 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva su propia retícula.
