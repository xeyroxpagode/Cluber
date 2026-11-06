# SURFACE MAP — CAL_EVENT_DETAIL_005_IN_PROGRESS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_005_IN_PROGRESS

**SCREEN ID:** CAL_EVENT_DETAIL_005_IN_PROGRESS

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — In progress

**PURPOSE AS IMPLEMENTED:** Evento en curso: el badge cambia de tono y el panel de operación marca el estado de asistencia y resultado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-lomas

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «GEI vs. Lomas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** IN_PROGRESS · asistencia abierta con 5 registros · record DRAFT 1–1

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, PRT_MATCH_RECORD_002_EDITABLE

**RESPONSIVE COUNTERPART:** Misma composición que la vista Scheduled; el contenido de los metadatos cambia.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail, StateBadge, SectionHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_005_IN_PROGRESS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «GEI vs. Lomas»
- **FOCAL 2:** Badge «En curso»
- **SUPPORTING:** Operación pendiente: «Resultado sin finalizar»
- **SECONDARY:** Logística e historial
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (IN_PROGRESS) | header grid | Encabezado del evento en curso |
| C02 | Operación pendiente (estado real) | Surface con SectionHeader | Indica qué falta para cerrar el evento |

### C01 — PageContextHeader (IN_PROGRESS)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Encabezado del evento en curso
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=65
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×2009.27
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Eventos TB"

#### STATE

- IN_PROGRESS → tone attention (bg-attention-soft text-attention)

#### INTERACTION

- trigger: «Acciones» → transiciones disponibles para IN_PROGRESS

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: columna única
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El mapa de tonos: IN_PROGRESS → attention (ámbar).

### C02 — Operación pendiente (estado real)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface con SectionHeader
- **INSTANCE / ROLE:** Indica qué falta para cerrar el evento
- **SOURCE COMPONENT:** EventDetail > Surface (canOperate)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface canOperate
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=308.22 w=171.27 h=21.25
- CSS: width: 171.266px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 171.266px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 171.27×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Operación pendiente"

#### STATE

- meta: «Resultado sin finalizar»

#### INTERACTION

- trigger: click en «Resultado» → /events/match-lomas/match-record

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2009 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma retícula.

# CAL_EVENT_DETAIL_005_IN_PROGRESS

**SCREEN ID:** CAL_EVENT_DETAIL_005_IN_PROGRESS

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — In progress

**PURPOSE AS IMPLEMENTED:** Evento en curso: el badge cambia de tono y el panel de operación marca el estado de asistencia y resultado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-lomas

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «GEI vs. Lomas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** IN_PROGRESS · asistencia abierta con 5 registros · record DRAFT 1–1

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, PRT_MATCH_RECORD_002_EDITABLE

**RESPONSIVE COUNTERPART:** Misma composición que la vista Scheduled; el contenido de los metadatos cambia.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail, StateBadge, SectionHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_005_IN_PROGRESS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «GEI vs. Lomas»
- **FOCAL 2:** Badge «En curso»
- **SUPPORTING:** Operación pendiente: «Resultado sin finalizar»
- **SECONDARY:** Logística e historial
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (IN_PROGRESS) | header grid | Encabezado del evento en curso |
| C02 | Operación pendiente (estado real) | Surface con SectionHeader | Indica qué falta para cerrar el evento |

### C01 — PageContextHeader (IN_PROGRESS)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Encabezado del evento en curso
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
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

- contained-by div · offset dx=0 dy=0 · padre 1440×1415.5
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Eventos Buscar ⌘K TB"

#### STATE

- IN_PROGRESS → tone attention (bg-attention-soft text-attention)

#### INTERACTION

- trigger: «Acciones» → transiciones disponibles para IN_PROGRESS

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: columna única
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El mapa de tonos: IN_PROGRESS → attention (ámbar).

### C02 — Operación pendiente (estado real)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface con SectionHeader
- **INSTANCE / ROLE:** Indica qué falta para cerrar el evento
- **SOURCE COMPONENT:** EventDetail > Surface (canOperate)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface canOperate
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=241.72 w=171.27 h=21.25
- CSS: width: 171.266px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 171.266px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 171.27×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Operación pendiente"

#### STATE

- meta: «Resultado sin finalizar»

#### INTERACTION

- trigger: click en «Resultado» → /events/match-lomas/match-record

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1416 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma retícula.
