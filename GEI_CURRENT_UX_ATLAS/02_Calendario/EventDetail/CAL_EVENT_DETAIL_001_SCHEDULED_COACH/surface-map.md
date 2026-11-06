# SURFACE MAP — CAL_EVENT_DETAIL_001_SCHEDULED_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**SCREEN ID:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Scheduled, vista COACH

**PURPOSE AS IMPLEMENTED:** Composición operativa del detalle de evento: encabezado con estado y menú de acciones, bloque «¿Vas?», panel «Operación pendiente», participación en lectura, logística, mensajes del evento, historial y un aside de resumen.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → click en un evento

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, match-sic, match-lomas, match-banco

**RESOURCE STATE:** SCHEDULED ·ublished 8 personas · coordinationRevision 3

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET, CAL_EVENT_DETAIL_009_PLAYER_VIEW, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** 390: una sola columna de 358 px; el aside «Resumen» queda al final. 1440: grid `lg:grid-cols-[minmax(0,1fr)_20rem]` — columna principal + aside de 320 px.

**SOURCE FILES:** src/features/events.tsx, src/shared/vas.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventDetail, LifecycleActions, TerminalNotice, VasControl, SectionHeader, RowLink, RowStatic, DetailSection, HistoryList, Menu, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_001_SCHEDULED_COACH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «GEI vs. CUBA» con la línea de fecha · hora · sede
- **FOCAL 2:** Menú «Acciones» junto al badge de estado
- **SUPPORTING:** Bloque «Operación pendiente» con las tres acciones de gestión
- **SECONDARY:** «Quién dijo qué», Logística, Mensajes del evento, Historial
- **AMBIENT:** TopBar, BottomNav y el aside «Resumen»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader del evento | header grid | Tipo, nombre, fecha/hora/sede, badge de estado y menú de acciones |
| C02 | VasControl (variante sólo consulta) | Surface con texto explicativo | Explica por qué el actor no responde disponibilidad |
| C03 | Operación pendiente (Surface) | Surface grid gap-3 | Acciones de gestión del evento con su estado actual |
| C04 | Quién dijo qué (Surface) | Surface grid gap-3 con filas contables | Recuento de respuestas de disponibilidad por valor |
| C05 | Logística (DetailSection) | section grid con dl de RowStatic | Sede, encuentro, punto, transporte y llegada |
| C06 | Mensajes de este evento (DetailSection) | section grid con 2 mensajes y link | Vista previa de la conversación del evento |
| C07 | Historial (DetailSection con action) | section grid con 3 entradas y botón «Ver todo» | Últimos movimientos del evento |
| C08 | Aside «Resumen» | aside content-start con dos Surface | Resumen del evento y lista de acciones permitidas |

### C01 — PageContextHeader del evento

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Tipo, nombre, fecha/hora/sede, badge de estado y menú de acciones
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

- contained-by div · offset dx=0 dy=0 · padre 390×2356.44
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Eventos TB"

#### STATE

- SCHEDULED

#### INTERACTION

- trigger: click en «Acciones» → abre el menú contextual

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×158,22 px; el lead envuelve a 2 líneas
- 1440: columna principal, con el action a la derecha

#### IMPLEMENTATION NOTES

- El lead es «{fecha larga} · {hora} · {sede}»; si el evento no tiene horario vigente muestra «sin horario vigente».
- El action es un div flex con el StateBadge y el Menu.

### C02 — VasControl (variante sólo consulta)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface con texto explicativo
- **INSTANCE / ROLE:** Explica por qué el actor no responde disponibilidad
- **SOURCE COMPONENT:** EventDetail (variante !canRespondHere)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface (!canRespondHere && state==='SCHEDULED')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=333.91 w=324 h=34.78
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=42.69 · padre 358×94.47

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Vos no jugás este evento, así que no respondés disponibilidad. Abajo está lo que"

#### STATE

- read-only

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324 px de texto (358 − 2×17 px de padding de la Surface)
- 1440: idéntico dentro de la columna principal

#### IMPLEMENTATION NOTES

- El COACH no tiene canRespondOwn porque esa bandera exige un rol PLAYER o CAPTAIN con pertenencia vigente.
- El texto completo: «Vos no jugás este evento, así que no respondés disponibilidad. Abajo está lo que dijo cada jugadora.»

### C03 — Operación pendiente (Surface)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid gap-3
- **INSTANCE / ROLE:** Acciones de gestión del evento con su estado actual
- **SOURCE COMPONENT:** EventDetail > Surface (canOperate)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface canOperate (SectionHeader + RowLink)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=426.69 w=171.27 h=21.25
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

- SCHEDULED · convocatoria publicada · resultado sin finalizar

#### INTERACTION

- trigger: click en «Convocadas» → /events/match-cuba/selection
- trigger: click en «Asistencia» → /events/match-cuba/attendance
- trigger: click en «Resultado» → /events/match-cuba/match-record

#### MOTION

- transition-colors duration-micro en las filas

#### RESPONSIVE

- 390: 358 px de ancho, 3 filas de 63,64–81,03 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El meta del encabezado describe qué falta: «Convocatoria sin publicar», «Resultado sin finalizar», «Asistencia cerrada», «Asistencia sin abrir» o «Convocatoria publicada».
- Cada fila es un RowLink con icono Users 17 px en «Convocadas» y sin icono en las otras dos.

### C04 — Quién dijo qué (Surface)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Surface grid gap-3 con filas contables
- **INSTANCE / ROLE:** Recuento de respuestas de disponibilidad por valor
- **SOURCE COMPONENT:** EventDetail > Surface «Quién dijo qué»
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface (BUCKETS.map)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=734.25 w=117.27 h=21.25
- CSS: width: 117.266px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 117.266px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 117.27×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Quién dijo qué"

#### STATE

- 8 respondieron

#### INTERACTION

- No interactivo: son filas estáticas (RowStatic)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- Las tres filas son Voy / Tal vez / No voy, con un punto de 10×10 px (bg-success / bg-warning / bg-danger) y la cifra en tabular-nums.
- Una cuarta fila calcula «Sin responder» restando las respuestas a los asignados del actor en los equipos destino.

### C05 — Logística (DetailSection)

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** section grid con dl de RowStatic
- **INSTANCE / ROLE:** Sede, encuentro, punto, transporte y llegada
- **SOURCE COMPONENT:** DetailSection + RowStatic
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=991.25 w=74.45 h=21.25
- CSS: width: 74.4531px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 74.4531px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 74.45×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Logística"

#### STATE

- completa

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×368,84 px; el texto de «Dónde y cuándo» envuelve a 3 líneas
- 1440: columna principal, el texto cabe en 1 línea

#### IMPLEMENTATION NOTES

- El detalle de la fila «Dónde y cuándo» concatena nombre de sede, dirección y fieldLabel: «GEI · Cancha de hockey · Av. Mitre 1240, Ituzaingó · Cancha 1».
- Es el bloque donde la diferencia de ancho entre 390 y 1440 produce el mayor cambio de altura.

### C06 — Mensajes de este evento (DetailSection)

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** section grid con 2 mensajes y link
- **INSTANCE / ROLE:** Vista previa de la conversación del evento
- **SOURCE COMPONENT:** DetailSection + Link
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > DetailSection «Mensajes de este evento»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1384.09 w=202.95 h=21.25
- CSS: width: 202.953px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 202.953px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 202.95×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Mensajes de este evento"

#### STATE

- con 1 mensaje (se muestran los 2 últimos)

#### INTERACTION

- trigger: click en «Abrir la conversación» → /conversations/c-event-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×166,02 px; el mensaje va en un bloque bg-control con px-3 py-2
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El bloque de cada mensaje lleva el nombre del autor en text-meta semibold y el cuerpo en gei-body.

### C07 — Historial (DetailSection con action)

- **COMPONENT ID:** C07
- **COMPONENT TYPE:** section grid con 3 entradas y botón «Ver todo»
- **INSTANCE / ROLE:** Últimos movimientos del evento
- **SOURCE COMPONENT:** DetailSection + HistoryList (slice 0..3)
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / Button quiet
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1586.11 w=68 h=21.25
- CSS: width: 68px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 68px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 68×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Historial"

#### STATE

- 3 entradas visibles de 3

#### INTERACTION

- trigger: click en «Ver todo» → Modal «Historial del evento»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×235,23 px; el botón «Ver todo» mide 96,14×44 px a la derecha
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Cada entrada muestra el texto de la línea, el autor y la fecha con formato «18 oct, 06:00 p. m.».

### C08 — Aside «Resumen»

- **COMPONENT ID:** C08
- **COMPONENT TYPE:** aside content-start con dos Surface
- **INSTANCE / ROLE:** Resumen del evento y lista de acciones permitidas
- **SOURCE COMPONENT:** EventDetail > aside
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > aside (Resumen + Qué podés hacer acá)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1833.34 w=358 h=411.09
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=1542.12 · padre 358×1953.22
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Resumen Destino Sexta A Convocatoria 8 personas Qué podés hacer acá Editar los d"

#### STATE

- con acción «Qué podés hacer acá» porque el actor puede operar

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×411,09 px, colocado al final de la columna
- 1440: 320 px de ancho, fijo a la derecha de la columna principal

#### IMPLEMENTATION NOTES

- El resumen lista Destino, «Tu respuesta» (sólo si canRespondHere), Convocatoria y Serie.
- La segunda Surface enumera en texto lo que el actor puede hacer: editar, administrar convocatoria, tomar asistencia, cargar resultado, postergar o cancelar.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: <main> px-4; el contenido del evento mide 358 px de ancho. El encabezado apila el badge y el menú de acciones.
- 1440: <main> px-8; la columna principal y el aside de 320 px se separan por 24 px (gap-6).
- El bloque «¿Vas?» sólo aparece para quien tiene canRespondOwn y el evento está SCHEDULED; en la vista COACH se muestra la variante de sólo consulta.

# CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**SCREEN ID:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Scheduled, vista COACH

**PURPOSE AS IMPLEMENTED:** Composición operativa del detalle de evento: encabezado con estado y menú de acciones, bloque «¿Vas?», panel «Operación pendiente», participación en lectura, logística, mensajes del evento, historial y un aside de resumen.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → click en un evento

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, match-sic, match-lomas, match-banco

**RESOURCE STATE:** SCHEDULED ·ublished 8 personas · coordinationRevision 3

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET, CAL_EVENT_DETAIL_009_PLAYER_VIEW, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO

**RESPONSIVE COUNTERPART:** 390: una sola columna de 358 px; el aside «Resumen» queda al final. 1440: grid `lg:grid-cols-[minmax(0,1fr)_20rem]` — columna principal + aside de 320 px.

**SOURCE FILES:** src/features/events.tsx, src/shared/vas.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventDetail, LifecycleActions, TerminalNotice, VasControl, SectionHeader, RowLink, RowStatic, DetailSection, HistoryList, Menu, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_001_SCHEDULED_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «GEI vs. CUBA» con la línea de fecha · hora · sede
- **FOCAL 2:** Menú «Acciones» junto al badge de estado
- **SUPPORTING:** Bloque «Operación pendiente» con las tres acciones de gestión
- **SECONDARY:** «Quién dijo qué», Logística, Mensajes del evento, Historial
- **AMBIENT:** TopBar, BottomNav y el aside «Resumen»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader del evento | header grid | Tipo, nombre, fecha/hora/sede, badge de estado y menú de acciones |
| C02 | VasControl (variante sólo consulta) | Surface con texto explicativo | Explica por qué el actor no responde disponibilidad |
| C03 | Operación pendiente (Surface) | Surface grid gap-3 | Acciones de gestión del evento con su estado actual |
| C04 | Quién dijo qué (Surface) | Surface grid gap-3 con filas contables | Recuento de respuestas de disponibilidad por valor |
| C05 | Logística (DetailSection) | section grid con dl de RowStatic | Sede, encuentro, punto, transporte y llegada |
| C06 | Mensajes de este evento (DetailSection) | section grid con 2 mensajes y link | Vista previa de la conversación del evento |
| C07 | Historial (DetailSection con action) | section grid con 3 entradas y botón «Ver todo» | Últimos movimientos del evento |
| C08 | Aside «Resumen» | aside content-start con dos Surface | Resumen del evento y lista de acciones permitidas |

### C01 — PageContextHeader del evento

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Tipo, nombre, fecha/hora/sede, badge de estado y menú de acciones
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

- contained-by div · offset dx=0 dy=0 · padre 1440×1770.38
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Eventos Buscar ⌘K TB"

#### STATE

- SCHEDULED

#### INTERACTION

- trigger: click en «Acciones» → abre el menú contextual

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×158,22 px; el lead envuelve a 2 líneas
- 1440: columna principal, con el action a la derecha

#### IMPLEMENTATION NOTES

- El lead es «{fecha larga} · {hora} · {sede}»; si el evento no tiene horario vigente muestra «sin horario vigente».
- El action es un div flex con el StateBadge y el Menu.

### C02 — VasControl (variante sólo consulta)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface con texto explicativo
- **INSTANCE / ROLE:** Explica por qué el actor no responde disponibilidad
- **SOURCE COMPONENT:** EventDetail (variante !canRespondHere)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface (!canRespondHere && state==='SCHEDULED')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=267.41 w=510 h=34.78
- CSS: width: 510px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 510px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=46.69 · padre 552×102.47

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Vos no jugás este evento, así que no respondés disponibilidad. Abajo está lo que"

#### STATE

- read-only

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324 px de texto (358 − 2×17 px de padding de la Surface)
- 1440: idéntico dentro de la columna principal

#### IMPLEMENTATION NOTES

- El COACH no tiene canRespondOwn porque esa bandera exige un rol PLAYER o CAPTAIN con pertenencia vigente.
- El texto completo: «Vos no jugás este evento, así que no respondés disponibilidad. Abajo está lo que dijo cada jugadora.»

### C03 — Operación pendiente (Surface)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid gap-3
- **INSTANCE / ROLE:** Acciones de gestión del evento con su estado actual
- **SOURCE COMPONENT:** EventDetail > Surface (canOperate)
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface canOperate (SectionHeader + RowLink)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=368.19 w=171.27 h=21.25
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

- SCHEDULED · convocatoria publicada · resultado sin finalizar

#### INTERACTION

- trigger: click en «Convocadas» → /events/match-cuba/selection
- trigger: click en «Asistencia» → /events/match-cuba/attendance
- trigger: click en «Resultado» → /events/match-cuba/match-record

#### MOTION

- transition-colors duration-micro en las filas

#### RESPONSIVE

- 390: 358 px de ancho, 3 filas de 63,64–81,03 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El meta del encabezado describe qué falta: «Convocatoria sin publicar», «Resultado sin finalizar», «Asistencia cerrada», «Asistencia sin abrir» o «Convocatoria publicada».
- Cada fila es un RowLink con icono Users 17 px en «Convocadas» y sin icono en las otras dos.

### C04 — Quién dijo qué (Surface)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Surface grid gap-3 con filas contables
- **INSTANCE / ROLE:** Recuento de respuestas de disponibilidad por valor
- **SOURCE COMPONENT:** EventDetail > Surface «Quién dijo qué»
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface (BUCKETS.map)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=666.36 w=117.27 h=21.25
- CSS: width: 117.266px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 117.266px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 117.27×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Quién dijo qué"

#### STATE

- 8 respondieron

#### INTERACTION

- No interactivo: son filas estáticas (RowStatic)

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- Las tres filas son Voy / Tal vez / No voy, con un punto de 10×10 px (bg-success / bg-warning / bg-danger) y la cifra en tabular-nums.
- Una cuarta fila calcula «Sin responder» restando las respuestas a los asignados del actor en los equipos destino.

### C05 — Logística (DetailSection)

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** section grid con dl de RowStatic
- **INSTANCE / ROLE:** Sede, encuentro, punto, transporte y llegada
- **SOURCE COMPONENT:** DetailSection + RowStatic
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=927.36 w=74.45 h=21.25
- CSS: width: 74.4531px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 74.4531px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 74.45×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Logística"

#### STATE

- completa

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×368,84 px; el texto de «Dónde y cuándo» envuelve a 3 líneas
- 1440: columna principal, el texto cabe en 1 línea

#### IMPLEMENTATION NOTES

- El detalle de la fila «Dónde y cuándo» concatena nombre de sede, dirección y fieldLabel: «GEI · Cancha de hockey · Av. Mitre 1240, Ituzaingó · Cancha 1».
- Es el bloque donde la diferencia de ancho entre 390 y 1440 produce el mayor cambio de altura.

### C06 — Mensajes de este evento (DetailSection)

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** section grid con 2 mensajes y link
- **INSTANCE / ROLE:** Vista previa de la conversación del evento
- **SOURCE COMPONENT:** DetailSection + Link
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > DetailSection «Mensajes de este evento»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=1302.81 w=202.95 h=21.25
- CSS: width: 202.953px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 202.953px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 202.95×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Mensajes de este evento"

#### STATE

- con 1 mensaje (se muestran los 2 últimos)

#### INTERACTION

- trigger: click en «Abrir la conversación» → /conversations/c-event-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×166,02 px; el mensaje va en un bloque bg-control con px-3 py-2
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El bloque de cada mensaje lleva el nombre del autor en text-meta semibold y el cuerpo en gei-body.

### C07 — Historial (DetailSection con action)

- **COMPONENT ID:** C07
- **COMPONENT TYPE:** section grid con 3 entradas y botón «Ver todo»
- **INSTANCE / ROLE:** Últimos movimientos del evento
- **SOURCE COMPONENT:** DetailSection + HistoryList (slice 0..3)
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / Button quiet
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=1483.14 w=68 h=21.25
- CSS: width: 68px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 68px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 68×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Historial"

#### STATE

- 3 entradas visibles de 3

#### INTERACTION

- trigger: click en «Ver todo» → Modal «Historial del evento»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×235,23 px; el botón «Ver todo» mide 96,14×44 px a la derecha
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Cada entrada muestra el texto de la línea, el autor y la fecha con formato «18 oct, 06:00 p. m.».

### C08 — Aside «Resumen»

- **COMPONENT ID:** C08
- **COMPONENT TYPE:** aside content-start con dos Surface
- **INSTANCE / ROLE:** Resumen del evento y lista de acciones permitidas
- **SOURCE COMPONENT:** EventDetail > aside
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > aside (Resumen + Qué podés hacer acá)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=960 y=220.72 w=320 h=1485.66
- CSS: width: 320px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 320px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 320px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=576 dy=0 · padre 896×1485.66

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Resumen Destino Sexta A Convocatoria 8 personas Qué podés hacer acá Editar los d"

#### STATE

- con acción «Qué podés hacer acá» porque el actor puede operar

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×411,09 px, colocado al final de la columna
- 1440: 320 px de ancho, fijo a la derecha de la columna principal

#### IMPLEMENTATION NOTES

- El resumen lista Destino, «Tu respuesta» (sólo si canRespondHere), Convocatoria y Serie.
- La segunda Surface enumera en texto lo que el actor puede hacer: editar, administrar convocatoria, tomar asistencia, cargar resultado, postergar o cancelar.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: <main> px-4; el contenido del evento mide 358 px de ancho. El encabezado apila el badge y el menú de acciones.
- 1440: <main> px-8; la columna principal y el aside de 320 px se separan por 24 px (gap-6).
- El bloque «¿Vas?» sólo aparece para quien tiene canRespondOwn y el evento está SCHEDULED; en la vista COACH se muestra la variante de sólo consulta.
