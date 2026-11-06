# SURFACE MAP — CAL_EVENT_FORM_008_EDIT_SERIES

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_008_EDIT_SERIES

**SCREEN ID:** CAL_EVENT_FORM_008_EDIT_SERIES

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — evento de serie

**PURPOSE AS IMPLEMENTED:** Edición de una ocurrencia que pertenece a una serie: el formulario advierte que al guardar se preguntará el alcance.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/training-serie-1/edit

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «Entrenamiento Sexta A» → «Acciones» → «Editar evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, series-sexta (4 ocurrencias)

**RESOURCE STATE:** SCHEDULED · serie de 4 ocurrencias

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/edit?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_009_SCOPE_DIALOG

**RESPONSIVE COUNTERPART:** La nota de serie aparece al final del formulario, debajo de la barra de acción.

**SOURCE FILES:** src/features/events.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm (seriesCandidates > 0 && !scopeDialog)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_008_EDIT_SERIES_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Formulario de edición
- **FOCAL 2:** Nota sobre la serie de eventos
- **SUPPORTING:** Campos precargados
- **SECONDARY:** —
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SeriesNote | p gei-meta | Informa que el evento pertenece a una serie |

### C01 — SeriesNote

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Informa que el evento pertenece a una serie
- **SOURCE COMPONENT:** EventForm
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > p (seriesCandidates)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=2080.58 w=358 h=34.78
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=1991.58 · padre 358×2026.36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Este evento pertenece a la serie “ Entrenamientos Sexta A ”. Al guardar te vamos"

#### STATE

- visible

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas
- 1440: 768 px, 2 líneas

#### IMPLEMENTATION NOTES

- El texto nombra la serie: «Este evento pertenece a la serie “Entrenamientos Sexta A”. Al guardar te vamos a preguntar el alcance.»
- Aparece sólo mientras no se haya abierto el diálogo de alcance.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2227 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la nota es una frase larga; a 390 ocupa 3 líneas.

# CAL_EVENT_FORM_008_EDIT_SERIES

**SCREEN ID:** CAL_EVENT_FORM_008_EDIT_SERIES

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — evento de serie

**PURPOSE AS IMPLEMENTED:** Edición de una ocurrencia que pertenece a una serie: el formulario advierte que al guardar se preguntará el alcance.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/training-serie-1/edit

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «Entrenamiento Sexta A» → «Acciones» → «Editar evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, series-sexta (4 ocurrencias)

**RESOURCE STATE:** SCHEDULED · serie de 4 ocurrencias

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/edit?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_009_SCOPE_DIALOG

**RESPONSIVE COUNTERPART:** La nota de serie aparece al final del formulario, debajo de la barra de acción.

**SOURCE FILES:** src/features/events.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm (seriesCandidates > 0 && !scopeDialog)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_008_EDIT_SERIES_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Formulario de edición
- **FOCAL 2:** Nota sobre la serie de eventos
- **SUPPORTING:** Campos precargados
- **SECONDARY:** —
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SeriesNote | p gei-meta | Informa que el evento pertenece a una serie |

### C01 — SeriesNote

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Informa que el evento pertenece a una serie
- **SOURCE COMPONENT:** EventForm
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > p (seriesCandidates)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=1671.58 w=768 h=17.39
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=1582.58 · padre 768×1599.97
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Este evento pertenece a la serie “ Entrenamientos Sexta A ”. Al guardar te vamos"

#### STATE

- visible

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas
- 1440: 768 px, 2 líneas

#### IMPLEMENTATION NOTES

- El texto nombra la serie: «Este evento pertenece a la serie “Entrenamientos Sexta A”. Al guardar te vamos a preguntar el alcance.»
- Aparece sólo mientras no se haya abierto el diálogo de alcance.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1753 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la nota es una frase larga; a 390 ocupa 3 líneas.
