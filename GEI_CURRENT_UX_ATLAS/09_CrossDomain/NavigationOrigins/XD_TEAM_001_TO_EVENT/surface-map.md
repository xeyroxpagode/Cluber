# SURFACE MAP — XD_TEAM_001_TO_EVENT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_TEAM_001_TO_EVENT

**SCREEN ID:** XD_TEAM_001_TO_EVENT

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Equipo → Evento

**PURPOSE AS IMPLEMENTED:** Trayecto desde la pestaña de eventos del equipo hasta el detalle del evento, con el control ¿Vas? embebido en la tarjeta de origen.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/sexta

**ORIGIN:** Equipos → Sexta A → pestaña «Eventos»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** EQUIPO → EVENTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?demo=coach.
2. Pulsar la fila «GEI vs. CUBA».

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** El destino usa el layout de dos columnas del detalle de evento en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/features/events.tsx

**SOURCE SYMBOLS:** TeamDetail > EventLine, EventDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_TEAM_001_TO_EVENT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del evento
- **FOCAL 2:** Bloque «Operación pendiente»
- **SUPPORTING:**  participation
- **SECONDARY:** Logística
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

- visible: "GEI vs. CUBA"

#### STATE

- SCHEDULED

#### INTERACTION

- trigger: click en «Acciones» → menú contextual

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva la retícula del detalle de evento.

# XD_TEAM_001_TO_EVENT

**SCREEN ID:** XD_TEAM_001_TO_EVENT

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Equipo → Evento

**PURPOSE AS IMPLEMENTED:** Trayecto desde la pestaña de eventos del equipo hasta el detalle del evento, con el control ¿Vas? embebido en la tarjeta de origen.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/sexta

**ORIGIN:** Equipos → Sexta A → pestaña «Eventos»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** EQUIPO → EVENTO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?demo=coach.
2. Pulsar la fila «GEI vs. CUBA».

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** El destino usa el layout de dos columnas del detalle de evento en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/features/events.tsx

**SOURCE SYMBOLS:** TeamDetail > EventLine, EventDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_TEAM_001_TO_EVENT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del evento
- **FOCAL 2:** Bloque «Operación pendiente»
- **SUPPORTING:**  participation
- **SECONDARY:** Logística
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

- rendered: x=384 y=116.59 w=682.89 h=29.63
- CSS: width: 682.891px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 682.891px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 682.89×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "GEI vs. CUBA"

#### STATE

- SCHEDULED

#### INTERACTION

- trigger: click en «Acciones» → menú contextual

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva la retícula del detalle de evento.
