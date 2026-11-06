# SURFACE MAP — CAL_CALENDAR_003_MONTH_EVENT_SELECTED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**SCREEN ID:** CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — mes con evento seleccionado

**PURPOSE AS IMPLEMENTED:** El panel lateral pasa a mostrar el detalle del evento con su estado, fecha, sede y el control «¿Vas?» del actor.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar?view=month&event=match-cuba

**ORIGIN:** CAL_CALENDAR_002_MONTH → click en un chip de evento

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · seleccionado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=month&event=match-cuba&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_002_MONTH, CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** 390: el panel queda debajo de la matriz (fuera del viewport inicial). 1440: el panel está visible a la derecha sin scroll.

**SOURCE FILES:** src/features/overview.tsx, src/shared/vas.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar > aside (selectedEvent), VasControl, StateBadge, Surface

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_003_MONTH_EVENT_SELECTED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del evento dentro del panel lateral
- **FOCAL 2:** Badge de estado «Programado»
- **SUPPORTING:** Fecha · hora, sede con icono y control ¿Vas?
- **SECONDARY:** Botón «Dejar de ver este evento»
- **AMBIENT:** Matriz del mes y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SelectedEventPanel | Surface grid gap-4 dentro del aside | Detalle del evento seleccionado dentro del calendario |
| C02 | StateBadge del evento | span con badge | Estado del evento en vocabulario de usuario |
| C03 | VasControl (dentro del panel) | RadioGroup de 3 opciones + estado de respuesta | Responder disponibilidad del propio evento desde el calendario |

### C01 — SelectedEventPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface grid gap-4 dentro del aside
- **INSTANCE / ROLE:** Detalle del evento seleccionado dentro del calendario
- **SOURCE COMPONENT:** Calendar > aside > Surface
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside (selectedEvent)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1074.22 w=358 h=441.84
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=685.63 · padre 358×1127.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Programado mar, 27 oct · 18:00 GEI vs. CUBA Sexta A GEI · Cancha de hockey Vos n"

#### STATE

- con evento seleccionado

#### INTERACTION

- trigger: click en «Dejar de ver este evento» → query.set({event:''})

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: 324 px (352 px de columna menos 28 px de padding)

#### IMPLEMENTATION NOTES

- —

### C02 — StateBadge del evento

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span con badge
- **INSTANCE / ROLE:** Estado del evento en vocabulario de usuario
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=1091.22 w=87.09 h=23
- CSS: width: 87.0938px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 87.0938px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 324×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Programado"

#### STATE

- SCHEDULED → tone selected (bg-selected-soft text-selected con ring)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex shrink-0, px-2 py-1, text-meta semibold
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El tono sale de stateToneMap en src/shared/states.ts: SCHEDULED → selected.

### C03 — VasControl (dentro del panel)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RadioGroup de 3 opciones + estado de respuesta
- **INSTANCE / ROLE:** Responder disponibilidad del propio evento desde el calendario
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=1210.25 w=324 h=52.17
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=136.03 · padre 358×267.2

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Vos no jugás este evento, así que no respondés disponibilidad. La lista de respu"

#### STATE

- el COACH no puede responder su propia disponibilidad: canRespondOwn es false → mensaje de sólo consulta

#### INTERACTION

- trigger: click en una opción → respondAvailability + toast «Respuesta guardada.»

#### MOTION

- transition-colors duration-micro en las etiquetas

#### RESPONSIVE

- 390: 3 columnas de ~100 px cada una (columns=3 → grid-cols-3)
- 1440: 3 columnas dentro de 324 px

#### IMPLEMENTATION NOTES

- La gramática es única en todo el producto: legend «¿Vas?», estado «Tu respuesta: …» y opciones Voy / Tal vez / No voy.
- Cuando la respuesta queda obsoleta por cambio de horario se muestra el aviso «El horario cambió desde tu última respuesta. Confirmá de nuevo.» y el valor queda sin seleccionar.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1628 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: el detalle se alcanza bajando; en 1440 el panel lateral de 352 px ya está a la vista.
- En ambos, el control ¿Vas? del panel muestra la misma gramática (radio de 3 opciones) que en el detalle de evento.

# CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**SCREEN ID:** CAL_CALENDAR_003_MONTH_EVENT_SELECTED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — mes con evento seleccionado

**PURPOSE AS IMPLEMENTED:** El panel lateral pasa a mostrar el detalle del evento con su estado, fecha, sede y el control «¿Vas?» del actor.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar?view=month&event=match-cuba

**ORIGIN:** CAL_CALENDAR_002_MONTH → click en un chip de evento

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · seleccionado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=month&event=match-cuba&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_002_MONTH, CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** 390: el panel queda debajo de la matriz (fuera del viewport inicial). 1440: el panel está visible a la derecha sin scroll.

**SOURCE FILES:** src/features/overview.tsx, src/shared/vas.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar > aside (selectedEvent), VasControl, StateBadge, Surface

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_003_MONTH_EVENT_SELECTED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del evento dentro del panel lateral
- **FOCAL 2:** Badge de estado «Programado»
- **SUPPORTING:** Fecha · hora, sede con icono y control ¿Vas?
- **SECONDARY:** Botón «Dejar de ver este evento»
- **AMBIENT:** Matriz del mes y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SelectedEventPanel | Surface grid gap-4 dentro del aside | Detalle del evento seleccionado dentro del calendario |
| C02 | StateBadge del evento | span con badge | Estado del evento en vocabulario de usuario |
| C03 | VasControl (dentro del panel) | RadioGroup de 3 opciones + estado de respuesta | Responder disponibilidad del propio evento desde el calendario |

### C01 — SelectedEventPanel

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface grid gap-4 dentro del aside
- **INSTANCE / ROLE:** Detalle del evento seleccionado dentro del calendario
- **SOURCE COMPONENT:** Calendar > aside > Surface
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside (selectedEvent)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1056 y=326.59 w=352 h=652.23
- CSS: width: 352px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 352px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 352px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=800 dy=0 · padre 1152×652.23

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Programado mar, 27 oct · 18:00 GEI vs. CUBA Sexta A GEI · Cancha de hockey Vos n"

#### STATE

- con evento seleccionado

#### INTERACTION

- trigger: click en «Dejar de ver este evento» → query.set({event:''})

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: 324 px (352 px de columna menos 28 px de padding)

#### IMPLEMENTATION NOTES

- —

### C02 — StateBadge del evento

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span con badge
- **INSTANCE / ROLE:** Estado del evento en vocabulario de usuario
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1077 y=347.59 w=87.09 h=23
- CSS: width: 87.0938px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 87.0938px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 310×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Programado"

#### STATE

- SCHEDULED → tone selected (bg-selected-soft text-selected con ring)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex shrink-0, px-2 py-1, text-meta semibold
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El tono sale de stateToneMap en src/shared/states.ts: SCHEDULED → selected.

### C03 — VasControl (dentro del panel)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RadioGroup de 3 opciones + estado de respuesta
- **INSTANCE / ROLE:** Responder disponibilidad del propio evento desde el calendario
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1077 y=466.63 w=310 h=52.17
- CSS: width: 310px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 310px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=140.04 · padre 352×275.2

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Vos no jugás este evento, así que no respondés disponibilidad. La lista de respu"

#### STATE

- el COACH no puede responder su propia disponibilidad: canRespondOwn es false → mensaje de sólo consulta

#### INTERACTION

- trigger: click en una opción → respondAvailability + toast «Respuesta guardada.»

#### MOTION

- transition-colors duration-micro en las etiquetas

#### RESPONSIVE

- 390: 3 columnas de ~100 px cada una (columns=3 → grid-cols-3)
- 1440: 3 columnas dentro de 324 px

#### IMPLEMENTATION NOTES

- La gramática es única en todo el producto: legend «¿Vas?», estado «Tu respuesta: …» y opciones Voy / Tal vez / No voy.
- Cuando la respuesta queda obsoleta por cambio de horario se muestra el aviso «El horario cambió desde tu última respuesta. Confirmá de nuevo.» y el valor queda sin seleccionar.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1043 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: el detalle se alcanza bajando; en 1440 el panel lateral de 352 px ya está a la vista.
- En ambos, el control ¿Vas? del panel muestra la misma gramática (radio de 3 opciones) que en el detalle de evento.
