# SURFACE MAP — CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**SCREEN ID:** CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — agenda con evento seleccionado

**PURPOSE AS IMPLEMENTED:** Mismo panel contextual con la vista de agenda activa. El chip del evento seleccionado queda resaltado en la matriz.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar?view=agenda&event=match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → click en una fila

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · seleccionado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&event=match-cuba&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_001_AGENDA, CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** Mismo comportamiento que la vista mes; el panel se apila en 390 y se ubica a la derecha en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/shared/vas.tsx

**SOURCE SYMBOLS:** Calendar > aside (selectedEvent), VasControl

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Detalle del evento en el panel lateral
- **FOCAL 2:** Fila del evento en la agenda
- **SUPPORTING:** Badge de estado y metadatos
- **SECONDARY:** Botón «Dejar de ver este evento»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SelectedEventPanel | Surface en aside | Detalle contextual del evento |

### C01 — SelectedEventPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface en aside
- **INSTANCE / ROLE:** Detalle contextual del evento
- **SOURCE COMPONENT:** Calendar > aside
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside (selectedEvent)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1359.41 w=358 h=441.84
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=970.82 · padre 358×1412.66
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Programado mar, 27 oct · 18:00 GEI vs. CUBA Sexta A GEI · Cancha de hockey Vos n"

#### STATE

- con evento seleccionado

#### INTERACTION

- trigger: «Dejar de ver este evento» → limpia ?event=

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: apilado
- 1440: columna de 352 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1913 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sólo cambia la lista de la izquierda (filas sueltas en vez de matriz).

# CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**SCREEN ID:** CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — agenda con evento seleccionado

**PURPOSE AS IMPLEMENTED:** Mismo panel contextual con la vista de agenda activa. El chip del evento seleccionado queda resaltado en la matriz.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar?view=agenda&event=match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → click en una fila

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · seleccionado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&event=match-cuba&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_001_AGENDA, CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** Mismo comportamiento que la vista mes; el panel se apila en 390 y se ubica a la derecha en 1440.

**SOURCE FILES:** src/features/overview.tsx, src/shared/vas.tsx

**SOURCE SYMBOLS:** Calendar > aside (selectedEvent), VasControl

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Detalle del evento en el panel lateral
- **FOCAL 2:** Fila del evento en la agenda
- **SUPPORTING:** Badge de estado y metadatos
- **SECONDARY:** Botón «Dejar de ver este evento»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SelectedEventPanel | Surface en aside | Detalle contextual del evento |

### C01 — SelectedEventPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface en aside
- **INSTANCE / ROLE:** Detalle contextual del evento
- **SOURCE COMPONENT:** Calendar > aside
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside (selectedEvent)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1056 y=326.59 w=352 h=938.86
- CSS: width: 352px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 352px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 352px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=800 dy=0 · padre 1152×938.86

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Programado mar, 27 oct · 18:00 GEI vs. CUBA Sexta A GEI · Cancha de hockey Vos n"

#### STATE

- con evento seleccionado

#### INTERACTION

- trigger: «Dejar de ver este evento» → limpia ?event=

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: apilado
- 1440: columna de 352 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1329 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sólo cambia la lista de la izquierda (filas sueltas en vez de matriz).
