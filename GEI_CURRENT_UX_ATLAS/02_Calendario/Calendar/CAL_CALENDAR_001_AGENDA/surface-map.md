# SURFACE MAP — CAL_CALENDAR_001_AGENDA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_CALENDAR_001_AGENDA

**SCREEN ID:** CAL_CALENDAR_001_AGENDA

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — vista Agenda

**PURPOSE AS IMPLEMENTED:** Vista de lista cronológica del calendario con los filtros de equipo y tipo arriba y un panel lateral de detalle del evento seleccionado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar?view=agenda

**ORIGIN:** Shell → destino «Calendario»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, training-serie-2, club-familias, match-cuba, match-banco

**RESOURCE STATE:** SCHEDULED · sin evento seleccionado · sin filtros

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_002_MONTH, CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** 390: una columna; la agenda va arriba y el panel lateral (aside) queda debajo de la lista. 1440: grid de dos columnas `lg:grid-cols-[minmax(0,1fr)_22rem]` — la agenda a la izquierda y el panel de 352 px a la derecha.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** Calendar, useQueryState, SegmentedControl, Select, PageContextHeader, Surface, RowLink, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_001_AGENDA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del mes «octubre de 2026»
- **FOCAL 2:** Lista de eventos de la agenda
- **SUPPORTING:** Filtros de equipo y tipo, control Agenda/Mes
- **SECONDARY:** Panel lateral con la leyenda de estados
- **AMBIENT:** TopBar, BottomNav y fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader del calendario | header grid con action y below | Contexto, mes, lead, control de vista, botón de jornada y filtros |
| C02 | SegmentedControl (Agenda / Mes) | div[role=group] con 2 botones | Alternador de vista del calendario |
| C03 | Filtro Equipo (Select) | select con label | Filtra los eventos por equipo destino |
| C04 | Filtro Tipo (Select) | select con label | Filtra los eventos por tipo (Partido / Entrenamiento / Evento del club) |
| C05 | AgendaList | ul grid gap-3 con EventLine | Lista cronológica de eventos visibles |
| C06 | Aside de estado del evento | aside content-start + Surface | Panel contextual: evento seleccionado o instrucciones + leyenda de estados |

### C01 — PageContextHeader del calendario

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con action y below
- **INSTANCE / ROLE:** Contexto, mes, lead, control de vista, botón de jornada y filtros
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

- contained-by div · offset dx=0 dy=0 · padre 390×1744.52
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Calendario TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Mes anterior» / «Mes siguiente» → cambia ?m= en la URL
- trigger: cambio de los Select → cambia ?team= / ?type=
- trigger: cambio del SegmentedControl → cambia ?view=

#### MOTION

- Sin transición en el encabezado

#### RESPONSIVE

- 390: el action pasa a w-full (fila de botones con wrap)
- 1440: action a la derecha (sm:w-auto)

#### IMPLEMENTATION NOTES

- El título es el mes en es-AR: «octubre de 2026».
- El lead declara que los filtros, el mes y la vista quedan guardados en la URL.

### C02 — SegmentedControl (Agenda / Mes)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div[role=group] con 2 botones
- **INSTANCE / ROLE:** Alternador de vista del calendario
- **SOURCE COMPONENT:** SegmentedControl
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** SegmentedControl
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=167.89 y=211.22 w=125.64 h=50
- CSS: width: 125.641px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 125.641px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 2px · padding: 2px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=151.89 dy=0 · padre 277.53×50

#### VISUAL CONFIGURATION

- background: rgb(247, 249, 252) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Agenda Mes"

#### STATE

- value=agenda (botón activo bg-surface con sombra)

#### INTERACTION

- trigger: click en «Mes» → query.set({view:'month'}) → URL ?view=month
- trigger: click en «Agenda» → query.set({view:'agenda'})

#### MOTION

- transition-colors duration-micro en cada botón

#### RESPONSIVE

- 390: 125,64×50 px, botones de 44 px de alto (min-h-11)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El contenedor es inline-flex con borde border-line, fondo bg-control y p-0.5.

### C03 — Filtro Equipo (Select)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** select con label
- **INSTANCE / ROLE:** Filtra los eventos por equipo destino
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=300.91 w=171 h=43.69
- CSS: width: 171px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 171px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 171×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "Todos los equipos Primera A Quinta B Sexta A Séptima A"

#### STATE

- value vacío («Todos los equipos»)

#### INTERACTION

- trigger: change → query.set({team}) → la URL filtra y el encabezado ofrece «Quitar filtros»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 171×43,69 px (min-w-48 = 192 px declarado, recortado por la grilla)
- 1440: min-w-48 (192 px)

#### IMPLEMENTATION NOTES

- El select tiene appearance:none con un chevron SVG en background-image, padding-right 36 px.
- El label se renderiza arriba (Field) con la etiqueta «opcional» en micro.

### C04 — Filtro Tipo (Select)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** select con label
- **INSTANCE / ROLE:** Filtra los eventos por tipo (Partido / Entrenamiento / Evento del club)
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=195 y=300.91 w=152 h=43.69
- CSS: width: 152px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 152px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 152×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "Todos los tipos Partido Entrenamiento Evento del club"

#### STATE

- value vacío («Todos los tipos»)

#### INTERACTION

- trigger: change → query.set({type})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 152×43,69 px (min-w-44 = 176 px declarado)
- 1440: min-w-44 (176 px)

#### IMPLEMENTATION NOTES

- —

### C05 — AgendaList

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** ul grid gap-3 con EventLine
- **INSTANCE / ROLE:** Lista cronológica de eventos visibles
- **SOURCE COMPONENT:** Calendar > agendaList
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > agendaList (EventLine → RowLink)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=388.59 w=358 h=954.81
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×954.81
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. SIC Sexta A · GEI · Cancha de hockey Finalizado 16:00 jue, 15 oct Entren"

#### STATE

- con 6 eventos visibles

#### INTERACTION

- trigger: click en una fila → /events/:id

#### MOTION

- transition-colors duration-micro por fila

#### RESPONSIVE

- 390: 358 px de ancho, gap 12 px entre filas
- 1440: la columna principal, ~1014 px dentro del max-w-6xl (1152 px) menos el aside de 352 px

#### IMPLEMENTATION NOTES

- En la vista agenda cada fila es un RowLink suelto, sin Surface contenedor (a diferencia de Inicio, que usa Surface flush).
- El orden es por fecha y hora ascendentes.

### C06 — Aside de estado del evento

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** aside content-start + Surface
- **INSTANCE / ROLE:** Panel contextual: evento seleccionado o instrucciones + leyenda de estados
- **SOURCE COMPONENT:** Calendar > aside
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1359.41 w=358 h=273.11
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=970.82 · padre 358×1243.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ningún evento seleccionado Tocá un día del mes o una fila de la agenda para ver "

#### STATE

- sin selección: muestra «Ningún evento seleccionado»

#### INTERACTION

- trigger: click en un evento del mes o de la agenda → query.set({event}) y el panel muestra el detalle con el control ¿Vas?
- trigger: click en «Dejar de ver este evento» → query.set({event:''})

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: apilado debajo de la agenda (358×273,11 px)
- 1440: columna derecha de 352 px

#### IMPLEMENTATION NOTES

- El panel incluye siempre una segunda Surface con la leyenda «Cómo se leen los estados» (tres muestras de color con texto).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1745 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: el contenedor de contenido es max-w-6xl pero el ancho útil es 358 px; el aside se apila debajo del contenido de la agenda.
- 1440: grid de 2 columnas: la primera toma el resto (minmax(0,1fr)) y la segunda 22rem = 352 px, con 16 px de gap.
- El control segmentado Agenda/Mes es el mismo componente en ambos; la vista por defecto se decide por `window.innerWidth >= 1024` al leer la URL por primera vez (sin ?view=).

# CAL_CALENDAR_001_AGENDA

**SCREEN ID:** CAL_CALENDAR_001_AGENDA

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — vista Agenda

**PURPOSE AS IMPLEMENTED:** Vista de lista cronológica del calendario con los filtros de equipo y tipo arriba y un panel lateral de detalle del evento seleccionado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar?view=agenda

**ORIGIN:** Shell → destino «Calendario»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, training-serie-2, club-familias, match-cuba, match-banco

**RESOURCE STATE:** SCHEDULED · sin evento seleccionado · sin filtros

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_002_MONTH, CAL_CALENDAR_004_AGENDA_EVENT_SELECTED

**RESPONSIVE COUNTERPART:** 390: una columna; la agenda va arriba y el panel lateral (aside) queda debajo de la lista. 1440: grid de dos columnas `lg:grid-cols-[minmax(0,1fr)_22rem]` — la agenda a la izquierda y el panel de 352 px a la derecha.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** Calendar, useQueryState, SegmentedControl, Select, PageContextHeader, Surface, RowLink, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_001_AGENDA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del mes «octubre de 2026»
- **FOCAL 2:** Lista de eventos de la agenda
- **SUPPORTING:** Filtros de equipo y tipo, control Agenda/Mes
- **SECONDARY:** Panel lateral con la leyenda de estados
- **AMBIENT:** TopBar, BottomNav y fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader del calendario | header grid con action y below | Contexto, mes, lead, control de vista, botón de jornada y filtros |
| C02 | SegmentedControl (Agenda / Mes) | div[role=group] con 2 botones | Alternador de vista del calendario |
| C03 | Filtro Equipo (Select) | select con label | Filtra los eventos por equipo destino |
| C04 | Filtro Tipo (Select) | select con label | Filtra los eventos por tipo (Partido / Entrenamiento / Evento del club) |
| C05 | AgendaList | ul grid gap-3 con EventLine | Lista cronológica de eventos visibles |
| C06 | Aside de estado del evento | aside content-start + Surface | Panel contextual: evento seleccionado o instrucciones + leyenda de estados |

### C01 — PageContextHeader del calendario

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con action y below
- **INSTANCE / ROLE:** Contexto, mes, lead, control de vista, botón de jornada y filtros
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

- contained-by div · offset dx=0 dy=0 · padre 1440×1329.45
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Calendario Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Mes anterior» / «Mes siguiente» → cambia ?m= en la URL
- trigger: cambio de los Select → cambia ?team= / ?type=
- trigger: cambio del SegmentedControl → cambia ?view=

#### MOTION

- Sin transición en el encabezado

#### RESPONSIVE

- 390: el action pasa a w-full (fila de botones con wrap)
- 1440: action a la derecha (sm:w-auto)

#### IMPLEMENTATION NOTES

- El título es el mes en es-AR: «octubre de 2026».
- El lead declara que los filtros, el mes y la vista quedan guardados en la URL.

### C02 — SegmentedControl (Agenda / Mes)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div[role=group] con 2 botones
- **INSTANCE / ROLE:** Alternador de vista del calendario
- **SOURCE COMPONENT:** SegmentedControl
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** SegmentedControl
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1282.36 y=116.59 w=125.64 h=50
- CSS: width: 125.641px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 125.641px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 2px · padding: 2px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=151.89 dy=0 · padre 277.53×50

#### VISUAL CONFIGURATION

- background: rgb(247, 249, 252) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Agenda Mes"

#### STATE

- value=agenda (botón activo bg-surface con sombra)

#### INTERACTION

- trigger: click en «Mes» → query.set({view:'month'}) → URL ?view=month
- trigger: click en «Agenda» → query.set({view:'agenda'})

#### MOTION

- transition-colors duration-micro en cada botón

#### RESPONSIVE

- 390: 125,64×50 px, botones de 44 px de alto (min-h-11)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El contenedor es inline-flex con borde border-line, fondo bg-control y p-0.5.

### C03 — Filtro Equipo (Select)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** select con label
- **INSTANCE / ROLE:** Filtra los eventos por equipo destino
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=256 y=238.91 w=171 h=43.69
- CSS: width: 171px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 171px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 171×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "Todos los equipos Primera A Quinta B Sexta A Séptima A"

#### STATE

- value vacío («Todos los equipos»)

#### INTERACTION

- trigger: change → query.set({team}) → la URL filtra y el encabezado ofrece «Quitar filtros»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 171×43,69 px (min-w-48 = 192 px declarado, recortado por la grilla)
- 1440: min-w-48 (192 px)

#### IMPLEMENTATION NOTES

- El select tiene appearance:none con un chevron SVG en background-image, padding-right 36 px.
- El label se renderiza arriba (Field) con la etiqueta «opcional» en micro.

### C04 — Filtro Tipo (Select)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** select con label
- **INSTANCE / ROLE:** Filtra los eventos por tipo (Partido / Entrenamiento / Evento del club)
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=435 y=238.91 w=152 h=43.69
- CSS: width: 152px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 152px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 152×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "Todos los tipos Partido Entrenamiento Evento del club"

#### STATE

- value vacío («Todos los tipos»)

#### INTERACTION

- trigger: change → query.set({type})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 152×43,69 px (min-w-44 = 176 px declarado)
- 1440: min-w-44 (176 px)

#### IMPLEMENTATION NOTES

- —

### C05 — AgendaList

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** ul grid gap-3 con EventLine
- **INSTANCE / ROLE:** Lista cronológica de eventos visibles
- **SOURCE COMPONENT:** Calendar > agendaList
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > agendaList (EventLine → RowLink)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=256 y=326.59 w=784 h=938.86
- CSS: width: 784px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 784px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 784px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 784×938.86
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. SIC Sexta A · GEI · Cancha de hockey Finalizado 16:00 jue, 15 oct Entren"

#### STATE

- con 6 eventos visibles

#### INTERACTION

- trigger: click en una fila → /events/:id

#### MOTION

- transition-colors duration-micro por fila

#### RESPONSIVE

- 390: 358 px de ancho, gap 12 px entre filas
- 1440: la columna principal, ~1014 px dentro del max-w-6xl (1152 px) menos el aside de 352 px

#### IMPLEMENTATION NOTES

- En la vista agenda cada fila es un RowLink suelto, sin Surface contenedor (a diferencia de Inicio, que usa Surface flush).
- El orden es por fecha y hora ascendentes.

### C06 — Aside de estado del evento

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** aside content-start + Surface
- **INSTANCE / ROLE:** Panel contextual: evento seleccionado o instrucciones + leyenda de estados
- **SOURCE COMPONENT:** Calendar > aside
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside
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

- visible: "Ningún evento seleccionado Tocá un día del mes o una fila de la agenda para ver "

#### STATE

- sin selección: muestra «Ningún evento seleccionado»

#### INTERACTION

- trigger: click en un evento del mes o de la agenda → query.set({event}) y el panel muestra el detalle con el control ¿Vas?
- trigger: click en «Dejar de ver este evento» → query.set({event:''})

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: apilado debajo de la agenda (358×273,11 px)
- 1440: columna derecha de 352 px

#### IMPLEMENTATION NOTES

- El panel incluye siempre una segunda Surface con la leyenda «Cómo se leen los estados» (tres muestras de color con texto).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1329 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: el contenedor de contenido es max-w-6xl pero el ancho útil es 358 px; el aside se apila debajo del contenido de la agenda.
- 1440: grid de 2 columnas: la primera toma el resto (minmax(0,1fr)) y la segunda 22rem = 352 px, con 16 px de gap.
- El control segmentado Agenda/Mes es el mismo componente en ambos; la vista por defecto se decide por `window.innerWidth >= 1024` al leer la URL por primera vez (sin ?view=).
