# SURFACE MAP — CAL_EVENT_FORM_002_NEW_MATCH_TYPE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_002_NEW_MATCH_TYPE

**SCREEN ID:** CAL_EVENT_FORM_002_NEW_MATCH_TYPE

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — tipo «Partido» seleccionado

**PURPOSE AS IMPLEMENTED:** Al cambiar el tipo a Partido el formulario añade el campo obligatorio «Rival».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/new

**ORIGIN:** CAL_EVENT_FORM_001_NEW → «Partido»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** type=MATCH

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.
2. Pulsar la opción «Partido».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_001_NEW

**RESPONSIVE COUNTERPART:** El campo añadido ocupa el ancho completo de la Surface en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm (type === 'MATCH' → TextField rival)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_002_NEW_MATCH_TYPE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo «Rival» recién aparecido
- **FOCAL 2:** Opción «Partido» marcada en el radio group
- **SUPPORTING:** Título del evento
- **SECONDARY:** Resto del formulario
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OpponentTextField | TextField required | Nombre del rival (obligatorio en partidos) |
| C02 | EventTypeRadioGroup (Partido activo) | RadioGroup | Tipo de evento |

### C01 — OpponentTextField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField required
- **INSTANCE / ROLE:** Nombre del rival (obligatorio en partidos)
- **SOURCE COMPONENT:** TextField
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id=field-opponent)
- **PARENT:** label
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=83.83 y=477.13 w=1 h=1
- CSS: width: 1px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 1px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px · margin: -1px

#### SPATIAL RELATIONSHIPS

- contained-by label · offset dx=50.83 dy=22.19 · padre 102.66×45.38
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px none rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 600

#### CONTENT

- visible: —

#### STATE

- vacío, placeholder «Nombre del club»

#### INTERACTION

- trigger: escribir → set('opponent')

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Es condicional: sólo existe cuando type === 'MATCH'.

### C02 — EventTypeRadioGroup (Partido activo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup
- **INSTANCE / ROLE:** Tipo de evento
- **SOURCE COMPONENT:** RadioGroup
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RadioGroup
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=429.25 w=324 h=71.06
- CSS: width: 324px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=141.62 · padre 358×317.06

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Tipo de evento Entrenamiento Partido Evento del club"

#### STATE

- MATCH seleccionado (border-interactive bg-selected-soft)

#### INTERACTION

- trigger: click en otra opción → cambia el tipo y puede ocultar/mostrar «Rival»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas
- 1440: 3 columnas

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2292 · scrollY 32 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el bloque «Qué es» crece en altura en ambos.

# CAL_EVENT_FORM_002_NEW_MATCH_TYPE

**SCREEN ID:** CAL_EVENT_FORM_002_NEW_MATCH_TYPE

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — tipo «Partido» seleccionado

**PURPOSE AS IMPLEMENTED:** Al cambiar el tipo a Partido el formulario añade el campo obligatorio «Rival».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/new

**ORIGIN:** CAL_EVENT_FORM_001_NEW → «Partido»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** type=MATCH

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.
2. Pulsar la opción «Partido».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_001_NEW

**RESPONSIVE COUNTERPART:** El campo añadido ocupa el ancho completo de la Surface en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm (type === 'MATCH' → TextField rival)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_002_NEW_MATCH_TYPE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo «Rival» recién aparecido
- **FOCAL 2:** Opción «Partido» marcada en el radio group
- **SUPPORTING:** Título del evento
- **SECONDARY:** Resto del formulario
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OpponentTextField | TextField required | Nombre del rival (obligatorio en partidos) |
| C02 | EventTypeRadioGroup (Partido activo) | RadioGroup | Tipo de evento |

### C01 — OpponentTextField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField required
- **INSTANCE / ROLE:** Nombre del rival (obligatorio en partidos)
- **SOURCE COMPONENT:** TextField
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id=field-opponent)
- **PARENT:** label
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=586.83 y=489.94 w=1 h=1
- CSS: width: 1px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 1px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px · margin: -1px

#### SPATIAL RELATIONSHIPS

- contained-by label · offset dx=117.83 dy=21.5 · padre 236.66×44
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px none rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 600

#### CONTENT

- visible: —

#### STATE

- vacío, placeholder «Nombre del club»

#### INTERACTION

- trigger: escribir → set('opponent')

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Es condicional: sólo existe cuando type === 'MATCH'.

### C02 — EventTypeRadioGroup (Partido activo)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup
- **INSTANCE / ROLE:** Tipo de evento
- **SOURCE COMPONENT:** RadioGroup
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RadioGroup
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=442.75 w=726 h=69.69
- CSS: width: 726px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=145.62 · padre 768×323.69

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Tipo de evento Entrenamiento Partido Evento del club"

#### STATE

- MATCH seleccionado (border-interactive bg-selected-soft)

#### INTERACTION

- trigger: click en otra opción → cambia el tipo y puede ocultar/mostrar «Rival»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas
- 1440: 3 columnas

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1835 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el bloque «Qué es» crece en altura en ambos.
