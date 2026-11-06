# SURFACE MAP — CAL_EVENT_FORM_001_NEW

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_001_NEW

**SCREEN ID:** CAL_EVENT_FORM_001_NEW

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — formulario vacío

**PURPOSE AS IMPLEMENTED:** Formulario de alta de evento con cuatro secciones (qué es, cuándo y dónde, quiénes van, logística) y una barra de acción fija.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/new

**ORIGIN:** Calendario → «Nueva jornada» es otra ruta; esta ruta se alcanza por URL directa (no hay link de alta de evento en la UI actual).

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_002_NEW_MATCH_TYPE, CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS

**RESPONSIVE COUNTERPART:** 390: los campos se apilan (sm:grid-cols-3 no aplica); la barra de acción es sticky sobre el BottomNav. 1440: los campos de fecha/hora/fin comparten una fila de 3 columnas y la barra deja de ser sticky respecto del navegador (lg:bottom-0).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm, TextField, TextArea, Select, RadioGroup, SectionHeader, Surface, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_001_NEW_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Crear evento» con el lead
- **FOCAL 2:** Sección «Qué es» con el campo Título
- **SUPPORTING:** RadioGroup «Tipo de evento» de 3 opciones
- **SECONDARY:** Secciones «Cuándo y dónde», «Quiénes van» y «Logística»
- **AMBIENT:** Barra de acción fija y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader del formulario | header grid con back | Contexto, título, lead y enlace «← Volver» |
| C02 | TitleTextField | TextField con Field | Título del evento |
| C03 | EventTypeRadioGroup | RadioGroup columns=3 | Tipo de evento: Entrenamiento / Partido / Evento del club |
| C04 | StickyActionBar del formulario | div sticky | Acciones «Cancelar» y «Guardar/Crear evento» |

### C01 — PageContextHeader del formulario

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Contexto, título, lead y enlace «← Volver»
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

- contained-by div · offset dx=0 dy=0 · padre 390×2148.58
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Nuevo evento TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /calendar

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: el botón «Volver» (69,64×36 px) y el contexto van en la misma fila
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El título del contexto es «Nuevo evento» y el h1 «Crear evento».

### C02 — TitleTextField

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextField con Field
- **INSTANCE / ROLE:** Título del evento
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=345.56 w=324 h=43.69
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 324×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, con placeholder «Entrenamiento de la Sexta A»

#### INTERACTION

- trigger: escribir → set('title') y marca dirty

#### MOTION

- transition-colors duration-micro en el control

#### RESPONSIVE

- 390: 324×43,69 px dentro de la Surface
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El Field imprime el label con la marca «OBLIGATORIO» en micro uppercase tracking-wide text-ink-faint.
- El hint del campo título no existe; el hint del campo rival es «Nombre del club».

### C03 — EventTypeRadioGroup

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RadioGroup columns=3
- **INSTANCE / ROLE:** Tipo de evento: Entrenamiento / Partido / Evento del club
- **SOURCE COMPONENT:** RadioGroup
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RadioGroup
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=405.25 w=324 h=71.06
- CSS: width: 324px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=141.62 · padre 358×229.69

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Tipo de evento Entrenamiento Partido Evento del club"

#### STATE

- TRAINING seleccionado

#### INTERACTION

- trigger: click en «Partido» → setType('MATCH') y aparece el campo «Rival»
- trigger: click en «Evento del club» → setType('CLUB_EVENT')

#### MOTION

- transition-colors duration-micro en las etiquetas

#### RESPONSIVE

- 390: grid-cols-3 con 3 celdas de 102,66×45,38 px; «Evento del club» envuelve a 2 líneas
- 1440: celdas de ancho igual dentro de la columna

#### IMPLEMENTATION NOTES

- El radio es sr-only; el label es el blanco del toque, con min-h-11.
- La opción activa usa border-interactive bg-selected-soft text-selected.

### C04 — StickyActionBar del formulario

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** div sticky
- **INSTANCE / ROLE:** Acciones «Cancelar» y «Guardar/Crear evento»
- **SOURCE COMPONENT:** EventForm > barra sticky
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > div.sticky (barra de acción)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=244.41 y=724 w=129.59 h=44
- CSS: width: 129.594px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 129.594px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=107.49 dy=0 · padre 237.08×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Crear evento"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Crear evento» → valida y, si pasa, crea el evento y navega a /events/:id
- trigger: click en «Cancelar» → si dirty abre la confirmación de descarte; si no, vuelve al calendario

#### MOTION

- transition-colors duration-micro en los botones; el spinner del botón busy usa animate-spin

#### RESPONSIVE

- 390: sticky bottom-16 con -mx-4 px-4 py-3 y borde superior
- 1440: lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border

#### IMPLEMENTATION NOTES

- A la izquierda de los botones hay un <p className="gei-meta"> con el texto «Guardar» (edición) o «Crear evento» (alta).
- El texto de la etiqueta de la izquierda coincide con el del botón en el alta, por lo que hay dos apariciones del mismo string.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky bottom-16 z-20 (390) / lg:bottom-0 (1440)
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2149 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: la barra de acción es `sticky bottom-16` para quedar por encima del BottomNav; el contenedor es max-w-3xl con px-4.
- 1440: `lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border` — deja de ocupar todo el ancho y toma la forma de una tarjeta.
- Los campos Fecha / Hora de inicio / Hora de fin usan sm:grid-cols-3: a 390 son tres filas, a 1440 una fila de tres.

# CAL_EVENT_FORM_001_NEW

**SCREEN ID:** CAL_EVENT_FORM_001_NEW

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — formulario vacío

**PURPOSE AS IMPLEMENTED:** Formulario de alta de evento con cuatro secciones (qué es, cuándo y dónde, quiénes van, logística) y una barra de acción fija.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/new

**ORIGIN:** Calendario → «Nueva jornada» es otra ruta; esta ruta se alcanza por URL directa (no hay link de alta de evento en la UI actual).

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_002_NEW_MATCH_TYPE, CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS

**RESPONSIVE COUNTERPART:** 390: los campos se apilan (sm:grid-cols-3 no aplica); la barra de acción es sticky sobre el BottomNav. 1440: los campos de fecha/hora/fin comparten una fila de 3 columnas y la barra deja de ser sticky respecto del navegador (lg:bottom-0).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm, TextField, TextArea, Select, RadioGroup, SectionHeader, Surface, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_001_NEW_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Crear evento» con el lead
- **FOCAL 2:** Sección «Qué es» con el campo Título
- **SUPPORTING:** RadioGroup «Tipo de evento» de 3 opciones
- **SECONDARY:** Secciones «Cuándo y dónde», «Quiénes van» y «Logística»
- **AMBIENT:** Barra de acción fija y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader del formulario | header grid con back | Contexto, título, lead y enlace «← Volver» |
| C02 | TitleTextField | TextField con Field | Título del evento |
| C03 | EventTypeRadioGroup | RadioGroup columns=3 | Tipo de evento: Entrenamiento / Partido / Evento del club |
| C04 | StickyActionBar del formulario | div sticky | Acciones «Cancelar» y «Guardar/Crear evento» |

### C01 — PageContextHeader del formulario

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Contexto, título, lead y enlace «← Volver»
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

- contained-by div · offset dx=0 dy=0 · padre 1440×1691.58
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Nuevo evento Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /calendar

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: el botón «Volver» (69,64×36 px) y el contexto van en la misma fila
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El título del contexto es «Nuevo evento» y el h1 «Crear evento».

### C02 — TitleTextField

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextField con Field
- **INSTANCE / ROLE:** Título del evento
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=327.06 w=726 h=43.69
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 726×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, con placeholder «Entrenamiento de la Sexta A»

#### INTERACTION

- trigger: escribir → set('title') y marca dirty

#### MOTION

- transition-colors duration-micro en el control

#### RESPONSIVE

- 390: 324×43,69 px dentro de la Surface
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El Field imprime el label con la marca «OBLIGATORIO» en micro uppercase tracking-wide text-ink-faint.
- El hint del campo título no existe; el hint del campo rival es «Nombre del club».

### C03 — EventTypeRadioGroup

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RadioGroup columns=3
- **INSTANCE / ROLE:** Tipo de evento: Entrenamiento / Partido / Evento del club
- **SOURCE COMPONENT:** RadioGroup
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RadioGroup
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=386.75 w=726 h=69.69
- CSS: width: 726px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=145.62 · padre 768×236.31

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Tipo de evento Entrenamiento Partido Evento del club"

#### STATE

- TRAINING seleccionado

#### INTERACTION

- trigger: click en «Partido» → setType('MATCH') y aparece el campo «Rival»
- trigger: click en «Evento del club» → setType('CLUB_EVENT')

#### MOTION

- transition-colors duration-micro en las etiquetas

#### RESPONSIVE

- 390: grid-cols-3 con 3 celdas de 102,66×45,38 px; «Evento del club» envuelve a 2 líneas
- 1440: celdas de ancho igual dentro de la columna

#### IMPLEMENTATION NOTES

- El radio es sr-only; el label es el blanco del toque, con min-h-11.
- La opción activa usa border-interactive bg-selected-soft text-selected.

### C04 — StickyActionBar del formulario

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** div sticky
- **INSTANCE / ROLE:** Acciones «Cancelar» y «Guardar/Crear evento»
- **SOURCE COMPONENT:** EventForm > barra sticky
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > div.sticky (barra de acción)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1069.41 y=843 w=129.59 h=44
- CSS: width: 129.594px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 129.594px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=107.49 dy=0 · padre 237.08×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Crear evento"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Crear evento» → valida y, si pasa, crea el evento y navega a /events/:id
- trigger: click en «Cancelar» → si dirty abre la confirmación de descarte; si no, vuelve al calendario

#### MOTION

- transition-colors duration-micro en los botones; el spinner del botón busy usa animate-spin

#### RESPONSIVE

- 390: sticky bottom-16 con -mx-4 px-4 py-3 y borde superior
- 1440: lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border

#### IMPLEMENTATION NOTES

- A la izquierda de los botones hay un <p className="gei-meta"> con el texto «Guardar» (edición) o «Crear evento» (alta).
- El texto de la etiqueta de la izquierda coincide con el del botón en el alta, por lo que hay dos apariciones del mismo string.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky bottom-16 z-20 (390) / lg:bottom-0 (1440)
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1692 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: la barra de acción es `sticky bottom-16` para quedar por encima del BottomNav; el contenedor es max-w-3xl con px-4.
- 1440: `lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border` — deja de ocupar todo el ancho y toma la forma de una tarjeta.
- Los campos Fecha / Hora de inicio / Hora de fin usan sm:grid-cols-3: a 390 son tres filas, a 1440 una fila de tres.
