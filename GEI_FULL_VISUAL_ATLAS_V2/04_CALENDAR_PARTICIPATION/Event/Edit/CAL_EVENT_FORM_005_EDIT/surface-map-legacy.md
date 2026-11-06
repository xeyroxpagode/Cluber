# SURFACE MAP — CAL_EVENT_FORM_005_EDIT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_005_EDIT

**SCREEN ID:** CAL_EVENT_FORM_005_EDIT

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — formulario cargado

**PURPOSE AS IMPLEMENTED:** Formulario de edición con los datos del evento cargados, el aviso de serie y la barra de acción fija.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/edit

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Acciones» → «Editar evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · edición sin cambios (baseline = formulario actual)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/edit?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_006_EDIT_DIRTY, CAL_EVENT_FORM_008_EDIT_SERIES

**RESPONSIVE COUNTERPART:** 390: los campos se apilan; 1440: fecha/hora/fin en una fila de 3 y hora de encuentro/salida en una fila de 2.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm (editing), diffForm, initialForm, ImpactPreview

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_005_EDIT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Qué es» con el título precargado
- **FOCAL 2:** Sección «Cuándo y dónde»
- **SUPPORTING:** Radios de tipo y destino
- **SECONDARY:** Sección «Logística»
- **AMBIENT:** Barra de acción fija con «Guardar cambios»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | BackButton («← Volver») | button con flecha de texto | Volver al detalle del evento |
| C02 | TitleTextField (con valor) | TextField | Título precargado |
| C03 | VenueSelect | Select | Sede del evento |
| C04 | TargetTeamsFieldset | fieldset con checkboxes | Selección de equipos destino |

### C01 — BackButton («← Volver»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** button con flecha de texto
- **INSTANCE / ROLE:** Volver al detalle del evento
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader > button (back)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=8 y=89 w=69.64 h=36
- CSS: width: 69.6406px · min-width: auto · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 69.6406px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 0px 8px · margin: 0px 0px 0px -8px · min-height: 36px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-8 dy=0 · padre 358×36

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Volver"

#### STATE

- idle

#### INTERACTION

- trigger: click → navigate(`/events/${eventId}`)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 69,64×36 px, con -ml-2 para compensar el padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La flecha es el carácter «←» en un span aria-hidden, no un icono lucide.

### C02 — TitleTextField (con valor)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Título precargado
- **SOURCE COMPONENT:** TextField
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id=field-title)
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

- filled («GEI vs. CUBA»)

#### INTERACTION

- trigger: escribir → marca dirty y recalcula el diff

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — VenueSelect

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Select
- **INSTANCE / ROLE:** Sede del evento
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select (id=field-venueId)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=944.75 w=324 h=43.69
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 324×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "GEI · Cancha de hockey · Av. Mitre 1240, Ituzaingó CUBA · Villa de Mayo · Av. Sa"

#### STATE

- value v1 (GEI · Cancha de hockey)

#### INTERACTION

- trigger: change → set('venueId')

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Cada opción concatena nombre y dirección: «GEI · Cancha de hockey · Av. Mitre 1240, Ituzaingó».

### C04 — TargetTeamsFieldset

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** fieldset con checkboxes
- **INSTANCE / ROLE:** Selección de equipos destino
- **SOURCE COMPONENT:** EventForm > fieldset (checks propios, no el primitive Checkbox)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > fieldset#field-targetTeams
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=1217.38 w=324 h=225.69
- CSS: width: 324px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=191.94 · padre 358×434.63

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Equipos destino Primera A Quinta B Sexta A Séptima A"

#### STATE

- Sexta A marcado

#### INTERACTION

- trigger: click en un label → agrega/quita el equipo del destino

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 1 columna (sm:grid-cols-2 no aplica a 390)
- 1440: 2 columnas

#### IMPLEMENTATION NOTES

- Los checks usan clases propias: gei-target, size-5 accent-interactive, y el label marcado toma border-selected-line bg-selected-soft text-selected.
- El legend es «Equipos destino».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2236 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la diferencia más visible es la fila de fecha/hora/fin (3 columnas a partir de sm) y el campo «Rival», que aparece porque el evento es de tipo MATCH.

# CAL_EVENT_FORM_005_EDIT

**SCREEN ID:** CAL_EVENT_FORM_005_EDIT

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — formulario cargado

**PURPOSE AS IMPLEMENTED:** Formulario de edición con los datos del evento cargados, el aviso de serie y la barra de acción fija.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/edit

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → «Acciones» → «Editar evento»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · edición sin cambios (baseline = formulario actual)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/edit?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_006_EDIT_DIRTY, CAL_EVENT_FORM_008_EDIT_SERIES

**RESPONSIVE COUNTERPART:** 390: los campos se apilan; 1440: fecha/hora/fin en una fila de 3 y hora de encuentro/salida en una fila de 2.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm (editing), diffForm, initialForm, ImpactPreview

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_005_EDIT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Qué es» con el título precargado
- **FOCAL 2:** Sección «Cuándo y dónde»
- **SUPPORTING:** Radios de tipo y destino
- **SECONDARY:** Sección «Logística»
- **AMBIENT:** Barra de acción fija con «Guardar cambios»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | BackButton («← Volver») | button con flecha de texto | Volver al detalle del evento |
| C02 | TitleTextField (con valor) | TextField | Título precargado |
| C03 | VenueSelect | Select | Sede del evento |
| C04 | TargetTeamsFieldset | fieldset con checkboxes | Selección de equipos destino |

### C01 — BackButton («← Volver»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** button con flecha de texto
- **INSTANCE / ROLE:** Volver al detalle del evento
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader > button (back)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=440 y=89 w=69.64 h=36
- CSS: width: 69.6406px · min-width: auto · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 69.6406px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 0px 8px · margin: 0px 0px 0px -8px · min-height: 36px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-8 dy=0 · padre 768×36

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Volver"

#### STATE

- idle

#### INTERACTION

- trigger: click → navigate(`/events/${eventId}`)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 69,64×36 px, con -ml-2 para compensar el padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La flecha es el carácter «←» en un span aria-hidden, no un icono lucide.

### C02 — TitleTextField (con valor)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Título precargado
- **SOURCE COMPONENT:** TextField
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (id=field-title)
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

- filled («GEI vs. CUBA»)

#### INTERACTION

- trigger: escribir → marca dirty y recalcula el diff

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — VenueSelect

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Select
- **INSTANCE / ROLE:** Sede del evento
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select (id=field-venueId)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=758.13 w=726 h=43.69
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 726×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "GEI · Cancha de hockey · Av. Mitre 1240, Ituzaingó CUBA · Villa de Mayo · Av. Sa"

#### STATE

- value v1 (GEI · Cancha de hockey)

#### INTERACTION

- trigger: change → set('venueId')

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Cada opción concatena nombre y dirección: «GEI · Cancha de hockey · Av. Mitre 1240, Ituzaingó».

### C04 — TargetTeamsFieldset

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** fieldset con checkboxes
- **INSTANCE / ROLE:** Selección de equipos destino
- **SOURCE COMPONENT:** EventForm > fieldset (checks propios, no el primitive Checkbox)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > fieldset#field-targetTeams
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=986.75 w=726 h=121.69
- CSS: width: 726px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=143.94 · padre 768×286.63

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Equipos destino Primera A Quinta B Sexta A Séptima A"

#### STATE

- Sexta A marcado

#### INTERACTION

- trigger: click en un label → agrega/quita el equipo del destino

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 1 columna (sm:grid-cols-2 no aplica a 390)
- 1440: 2 columnas

#### IMPLEMENTATION NOTES

- Los checks usan clases propias: gei-target, size-5 accent-interactive, y el label marcado toma border-selected-line bg-selected-soft text-selected.
- El legend es «Equipos destino».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1779 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la diferencia más visible es la fila de fecha/hora/fin (3 columnas a partir de sm) y el campo «Rival», que aparece porque el evento es de tipo MATCH.
