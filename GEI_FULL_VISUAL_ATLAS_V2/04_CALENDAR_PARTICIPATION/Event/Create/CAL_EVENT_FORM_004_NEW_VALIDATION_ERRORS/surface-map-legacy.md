# SURFACE MAP — CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS

**SCREEN ID:** CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — errores de validación

**PURPOSE AS IMPLEMENTED:** Estado tras enviar el formulario vacío: cada campo con su error y el foco trasladado al primer campo inválido.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/new

**ORIGIN:** CAL_EVENT_FORM_001_NEW → «Crear evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** VALIDATION FAILED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.
2. Pulsar «Crear evento» sin completar nada.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_001_NEW

**RESPONSIVE COUNTERPART:** Cada error se renderiza dentro del Field, bajo el control. En 390 el mensaje de «Equipos destino» ocupa 2 líneas.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm > validate(), Field (error), RadioGroup / Select error

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Errores bajo cada campo
- **FOCAL 2:** Campo Título marcado en rojo
- **SUPPORTING:** Mensaje «Elegí al menos un equipo destino.»
- **SECONDARY:** Resto del formulario
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TitleFieldError | p con AlertCircle | Error de validación del título |
| C02 | TargetTeamsError | p text-meta text-danger | Error de validación del destino |

### C01 — TitleFieldError

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Error de validación del título
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=71.25 w=324 h=34.78
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.37 · padre 324×112.16
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Poné un título para que se entienda de qué evento se trata."

#### STATE

- error

#### INTERACTION

- trigger: escribir → el error se borra (set() limpia el registro de errores)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324 px de ancho; el icono AlertCircle 14 px va antes del texto
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El input pasa a border-danger y aria-invalid=true.

### C02 — TargetTeamsError

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p text-meta text-danger
- **INSTANCE / ROLE:** Error de validación del destino
- **SOURCE COMPONENT:** EventForm (errors.targetTeams)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > fieldset > p (errors.targetTeams)
- **PARENT:** fieldset
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=919.25 w=324 h=17.39
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by fieldset · offset dx=0 dy=25.69 · padre 324×251.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Elegí al menos un equipo destino."

#### STATE

- error

#### INTERACTION

- se borra al marcar un equipo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Este error no usa el primitive Field: se imprime directamente dentro del fieldset, sin icono.
- Los errores de fecha y hora se muestran bajo sus respectivos campos (id field-date / field-time).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2262 · scrollY 324 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los mensajes de error no cambian de texto; cambian las líneas que ocupan.

# CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS

**SCREEN ID:** CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — errores de validación

**PURPOSE AS IMPLEMENTED:** Estado tras enviar el formulario vacío: cada campo con su error y el foco trasladado al primer campo inválido.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/new

**ORIGIN:** CAL_EVENT_FORM_001_NEW → «Crear evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** VALIDATION FAILED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.
2. Pulsar «Crear evento» sin completar nada.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_001_NEW

**RESPONSIVE COUNTERPART:** Cada error se renderiza dentro del Field, bajo el control. En 390 el mensaje de «Equipos destino» ocupa 2 líneas.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm > validate(), Field (error), RadioGroup / Select error

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Errores bajo cada campo
- **FOCAL 2:** Campo Título marcado en rojo
- **SUPPORTING:** Mensaje «Elegí al menos un equipo destino.»
- **SECONDARY:** Resto del formulario
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TitleFieldError | p con AlertCircle | Error de validación del título |
| C02 | TargetTeamsError | p text-meta text-danger | Error de validación del destino |

### C01 — TitleFieldError

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Error de validación del título
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=376.75 w=726 h=17.39
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.37 · padre 726×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Poné un título para que se entienda de qué evento se trata."

#### STATE

- error

#### INTERACTION

- trigger: escribir → el error se borra (set() limpia el registro de errores)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324 px de ancho; el icono AlertCircle 14 px va antes del texto
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El input pasa a border-danger y aria-invalid=true.

### C02 — TargetTeamsError

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p text-meta text-danger
- **INSTANCE / ROLE:** Error de validación del destino
- **SOURCE COMPONENT:** EventForm (errors.targetTeams)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > fieldset > p (errors.targetTeams)
- **PARENT:** fieldset
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=971.84 w=726 h=17.39
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by fieldset · offset dx=0 dy=25.68 · padre 726×147.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Elegí al menos un equipo destino."

#### STATE

- error

#### INTERACTION

- se borra al marcar un equipo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Este error no usa el primitive Field: se imprime directamente dentro del fieldset, sin icono.
- Los errores de fecha y hora se muestran bajo sus respectivos campos (id field-date / field-time).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1764 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: los mensajes de error no cambian de texto; cambian las líneas que ocupan.
