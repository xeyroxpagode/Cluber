# SURFACE MAP — CAL_EVENT_FORM_009_SCOPE_DIALOG

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_009_SCOPE_DIALOG

**SCREEN ID:** CAL_EVENT_FORM_009_SCOPE_DIALOG

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — diálogo de alcance de serie

**PURPOSE AS IMPLEMENTED:** Al guardar un cambio material en un evento de serie se pregunta el alcance: sólo este, este y los siguientes, o toda la serie.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/training-serie-1/edit

**ORIGIN:** CAL_EVENT_FORM_008_EDIT_SERIES → cambiar la hora → «Guardar cambios»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, series-sexta (4 ocurrencias)

**RESOURCE STATE:** SCHEDULED · diálogo de alcance abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/edit?demo=coach.
2. Escribir «18:30» en el campo #field-time.
3. Pulsar «Guardar cambios».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_008_EDIT_SERIES, CAL_EVENT_FORM_005_EDIT

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390 con las tres opciones apiladas; en 1440 diálogo centrado de 512 px con las opciones en columna.

**SOURCE FILES:** src/shared/patterns.tsx, src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ScopeDialog, SeriesScopeOption, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_009_SCOPE_DIALOG_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «¿Dónde aplicás el cambio?»
- **FOCAL 2:** Opciones de alcance con su contador de eventos
- **SUPPORTING:** Descripción de cada opción
- **SECONDARY:** Pie «Después vas a ver el impacto real antes de confirmar.»
- **AMBIENT:** Formulario atenuado por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ScopeDialog | section[role=dialog] | Definición del alcance del cambio |
| C02 | ScopeOption («Toda la serie») | button grid con título, contador y detalle | Opción de alcance |

### C01 — ScopeDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Definición del alcance del cambio
- **SOURCE COMPONENT:** ScopeDialog
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** ScopeDialog
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=403.95 w=390 h=440.05
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=403.95 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Dónde aplicás el cambio? El alcance elegido define exactamente qué eventos camb"

#### STATE

- open

#### INTERACTION

- trigger: click en una opción → chooseScope(scope) y aplica el cambio
- trigger: Escape → cierra el diálogo sin aplicar

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El diálogo no tiene botones de pie de página: el pie es un texto informativo «Después vas a ver el impacto real antes de confirmar.»
- Los contadores provienen de seriesOccurrences(state, event.id, scope): 1 evento para ONLY_THIS y 4 para THIS_AND_FOLLOWING y ENTIRE_SERIES.

### C02 — ScopeOption («Toda la serie»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** button grid con título, contador y detalle
- **INSTANCE / ROLE:** Opción de alcance
- **SOURCE COMPONENT:** ScopeDialog > button
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** ScopeDialog > button (option)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=700.53 w=350 h=77.08
- CSS: width: 350px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 4px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=187.55 · padre 350×264.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Toda la serie 4 eventos Se aplica a todos los eventos de la serie."

#### STATE

- idle

#### INTERACTION

- trigger: click → aplica el cambio a las 4 ocurrencias

#### MOTION

- transition-colors duration-micro; hover border-interactive bg-selected-soft

#### RESPONSIVE

- 390: 358×68,28 px; el contador «4 eventos» a la derecha del título
- 1440: 464 px de ancho dentro del diálogo

#### IMPLEMENTATION NOTES

- El detalle de cada opción explica el alcance: «Se aplica a todos los eventos de la serie.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2373 · scrollY 324 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: cada opción es un botón con el título y el contador en la misma línea; el detalle va debajo.
- 1440: las tres opciones se muestran con el contador a la derecha del título.

# CAL_EVENT_FORM_009_SCOPE_DIALOG

**SCREEN ID:** CAL_EVENT_FORM_009_SCOPE_DIALOG

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — diálogo de alcance de serie

**PURPOSE AS IMPLEMENTED:** Al guardar un cambio material en un evento de serie se pregunta el alcance: sólo este, este y los siguientes, o toda la serie.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/training-serie-1/edit

**ORIGIN:** CAL_EVENT_FORM_008_EDIT_SERIES → cambiar la hora → «Guardar cambios»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, series-sexta (4 ocurrencias)

**RESOURCE STATE:** SCHEDULED · diálogo de alcance abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/edit?demo=coach.
2. Escribir «18:30» en el campo #field-time.
3. Pulsar «Guardar cambios».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_008_EDIT_SERIES, CAL_EVENT_FORM_005_EDIT

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390 con las tres opciones apiladas; en 1440 diálogo centrado de 512 px con las opciones en columna.

**SOURCE FILES:** src/shared/patterns.tsx, src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ScopeDialog, SeriesScopeOption, Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_009_SCOPE_DIALOG_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «¿Dónde aplicás el cambio?»
- **FOCAL 2:** Opciones de alcance con su contador de eventos
- **SUPPORTING:** Descripción de cada opción
- **SECONDARY:** Pie «Después vas a ver el impacto real antes de confirmar.»
- **AMBIENT:** Formulario atenuado por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ScopeDialog | section[role=dialog] | Definición del alcance del cambio |
| C02 | ScopeOption («Toda la serie») | button grid con título, contador y detalle | Opción de alcance |

### C01 — ScopeDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Definición del alcance del cambio
- **SOURCE COMPONENT:** ScopeDialog
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** ScopeDialog
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=247.36 w=512 h=405.27
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=247.36 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Dónde aplicás el cambio? El alcance elegido define exactamente qué eventos camb"

#### STATE

- open

#### INTERACTION

- trigger: click en una opción → chooseScope(scope) y aplica el cambio
- trigger: Escape → cierra el diálogo sin aplicar

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El diálogo no tiene botones de pie de página: el pie es un texto informativo «Después vas a ver el impacto real antes de confirmar.»
- Los contadores provienen de seriesOccurrences(state, event.id, scope): 1 evento para ONLY_THIS y 4 para THIS_AND_FOLLOWING y ENTIRE_SERIES.

### C02 — ScopeOption («Toda la serie»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** button grid con título, contador y detalle
- **INSTANCE / ROLE:** Opción de alcance
- **SOURCE COMPONENT:** ScopeDialog > button
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** ScopeDialog > button (option)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=484 y=509.16 w=472 h=77.08
- CSS: width: 472px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 472px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 438px · gap: 4px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=170.16 · padre 472×247.23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Toda la serie 4 eventos Se aplica a todos los eventos de la serie."

#### STATE

- idle

#### INTERACTION

- trigger: click → aplica el cambio a las 4 ocurrencias

#### MOTION

- transition-colors duration-micro; hover border-interactive bg-selected-soft

#### RESPONSIVE

- 390: 358×68,28 px; el contador «4 eventos» a la derecha del título
- 1440: 464 px de ancho dentro del diálogo

#### IMPLEMENTATION NOTES

- El detalle de cada opción explica el alcance: «Se aplica a todos los eventos de la serie.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1894 · scrollY 415 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: cada opción es un botón con el título y el contador en la misma línea; el detalle va debajo.
- 1440: las tres opciones se muestran con el contador a la derecha del título.
