# SURFACE MAP — PRT_SELECTION_001_PUBLISHED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_001_PUBLISHED

**SCREEN ID:** PRT_SELECTION_001_PUBLISHED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — publicada

**PURPOSE AS IMPLEMENTED:** Pantalla de gestión de la convocatoria: lista de checkboxes con el estado de disponibilidad de cada persona, historial de revisiones y barra de acción de publicación.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** Detalle de evento → «Operación pendiente» → «Convocadas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7 (8 convocadas de 8)

**RESOURCE STATE:** PUBLISHED · 8 de 8 convocadas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=coach.

**RELATED SCREEN IDS:** PRT_SELECTION_002_DRAFT, PRT_SELECTION_005_PUBLISH_CONFIRM, PRT_SELECTION_003_REVISIONS_OPEN

**RESPONSIVE COUNTERPART:** 390: una columna de 358 px con la barra de publicación fija sobre el BottomNav. 1440: max-w-4xl (896 px) con la misma barra, ahora pegada al borde inferior del viewport (lg:bottom-0).

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SelectionPage, SectionHeader, HistoryList, StateBadge, Button, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_001_PUBLISHED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de convocadas con su estado de disponibilidad
- **FOCAL 2:** Contador «8 de 8» en el encabezado de sección
- **SUPPORTING:** Badge «Publicado» en el encabezado de página
- **SECONDARY:** Bloque «Revisiones publicadas»
- **AMBIENT:** Barra de publicación fija y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Convocatoria) | header grid con back y action | Nombre, fecha, cantidad de convocadas y estado de publicación |
| C02 | StateBadge (Publicado) | span badge emphasis | Estado de publicación de la convocatoria |
| C03 | SelectionRow (persona) | li con checkbox + label | Convocada con su estado de disponibilidad |
| C04 | RevisionsSurface | Surface con botón expansor | Historial de revisiones publicadas de la convocatoria |
| C05 | SelectionActionBar | div sticky | Resumen del borrador y botón de publicación |

### C01 — PageContextHeader (Convocatoria)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Nombre, fecha, cantidad de convocadas y estado de publicación
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

- contained-by div · offset dx=0 dy=0 · padre 390×1160.5
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Eventos TB"

#### STATE

- PUBLISHED

#### INTERACTION

- trigger: click en «Volver» → /events/match-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×143,13 px; el badge queda en una fila propia
- 1440: 896 px

#### IMPLEMENTATION NOTES

- —

### C02 — StateBadge (Publicado)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span badge emphasis
- **INSTANCE / ROLE:** Estado de publicación de la convocatoria
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=published===null?'DRAFT':'PUBLISHED' emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=209.13 w=73.66 h=23
- CSS: width: 73.6562px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 73.6562px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(28, 107, 74) · border: 0px solid rgb(28, 107, 74) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Publicado"

#### STATE

- PUBLISHED → success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 73,66×23 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — SelectionRow (persona)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** li con checkbox + label
- **INSTANCE / ROLE:** Convocada con su estado de disponibilidad
- **SOURCE COMPONENT:** SelectionPage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > ul > li
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=326.38 w=324 h=58.64
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 324×476.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Confirmó con el horario anterior"

#### STATE

- checked (publicada)

#### INTERACTION

- trigger: click en el checkbox → toggle(personId) y marca dirty
- trigger: si está seleccionada y tiene códigos de conflicto, se despliega la lista de conflictos debajo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×58,64 px; checkbox 20×20 px, label a 65 px de x
- 1440: idéntico, ancho de la columna principal

#### IMPLEMENTATION NOTES

- El texto secundario traduce el estado de disponibilidad a lenguaje de usuario: «Dijo que va», «Dijo que no va», «Confirmó con el horario anterior», «Sin responder».
- Los conflictos se renderizan sólo si la persona está seleccionada y conflictCodesFor devuelve códigos.

### C04 — RevisionsSurface

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Surface con botón expansor
- **INSTANCE / ROLE:** Historial de revisiones publicadas de la convocatoria
- **SOURCE COMPONENT:** Surface + HistoryList
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > Surface (Revisiones publicadas)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=886.8 w=182.75 h=21.25
- CSS: width: 182.75px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 182.75px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=6.3 · padre 324×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Revisiones publicadas"

#### STATE

- plegada (el botón dice «Ver 1»)

#### INTERACTION

- trigger: click en «Ver 1» → despliega el HistoryList; el botón pasa a decir «Ocultar»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El botón usa aria-expanded y cambia su texto entre «Ver N» y «Ocultar».

### C05 — SelectionActionBar

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** div sticky
- **INSTANCE / ROLE:** Resumen del borrador y botón de publicación
- **SOURCE COMPONENT:** SelectionPage > barra sticky
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > div.sticky
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=209.95 y=722 w=164.05 h=46
- CSS: width: 164.047px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 164.047px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 164.05×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 0.45
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar cambios"

#### STATE

- sin cambios (dirty=false): el botón está disabled

#### INTERACTION

- trigger: click en «Publicar cambios» (habilitado sólo con cambios) → abre el ConfirmDialog
- trigger: click en «Descartar» (visible sólo con cambios) → descarta el borrador local

#### MOTION

- transition-colors duration-micro; el spinner del botón busy usa animate-spin

#### RESPONSIVE

- 390: sticky bottom-16, -mx-4 px-4 py-3
- 1440: lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border

#### IMPLEMENTATION NOTES

- A la izquierda hay un texto de resumen: «N sumadas · M fuera» o «Sin cambios» / «Sin publicar».
- El texto del botón depende del estado: «Publicar convocatoria» si nunca se publicó, «Publicar cambios» si ya había una publicación.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky bottom-16 z-20 (390) / lg:bottom-0 (1440)
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1161 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la barra de publicación es `sticky bottom-16` en móvil (por encima del BottomNav) y `lg:bottom-0` con bordes redondeados en escritorio.
- La lista de checkboxes es de una columna en ambos viewports.

# PRT_SELECTION_001_PUBLISHED

**SCREEN ID:** PRT_SELECTION_001_PUBLISHED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — publicada

**PURPOSE AS IMPLEMENTED:** Pantalla de gestión de la convocatoria: lista de checkboxes con el estado de disponibilidad de cada persona, historial de revisiones y barra de acción de publicación.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** Detalle de evento → «Operación pendiente» → «Convocadas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7 (8 convocadas de 8)

**RESOURCE STATE:** PUBLISHED · 8 de 8 convocadas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=coach.

**RELATED SCREEN IDS:** PRT_SELECTION_002_DRAFT, PRT_SELECTION_005_PUBLISH_CONFIRM, PRT_SELECTION_003_REVISIONS_OPEN

**RESPONSIVE COUNTERPART:** 390: una columna de 358 px con la barra de publicación fija sobre el BottomNav. 1440: max-w-4xl (896 px) con la misma barra, ahora pegada al borde inferior del viewport (lg:bottom-0).

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SelectionPage, SectionHeader, HistoryList, StateBadge, Button, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_001_PUBLISHED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de convocadas con su estado de disponibilidad
- **FOCAL 2:** Contador «8 de 8» en el encabezado de sección
- **SUPPORTING:** Badge «Publicado» en el encabezado de página
- **SECONDARY:** Bloque «Revisiones publicadas»
- **AMBIENT:** Barra de publicación fija y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Convocatoria) | header grid con back y action | Nombre, fecha, cantidad de convocadas y estado de publicación |
| C02 | StateBadge (Publicado) | span badge emphasis | Estado de publicación de la convocatoria |
| C03 | SelectionRow (persona) | li con checkbox + label | Convocada con su estado de disponibilidad |
| C04 | RevisionsSurface | Surface con botón expansor | Historial de revisiones publicadas de la convocatoria |
| C05 | SelectionActionBar | div sticky | Resumen del borrador y botón de publicación |

### C01 — PageContextHeader (Convocatoria)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Nombre, fecha, cantidad de convocadas y estado de publicación
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

- contained-by div · offset dx=0 dy=0 · padre 1440×1094.5
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Eventos Buscar ⌘K TB"

#### STATE

- PUBLISHED

#### INTERACTION

- trigger: click en «Volver» → /events/match-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×143,13 px; el badge queda en una fila propia
- 1440: 896 px

#### IMPLEMENTATION NOTES

- —

### C02 — StateBadge (Publicado)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span badge emphasis
- **INSTANCE / ROLE:** Estado de publicación de la convocatoria
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=published===null?'DRAFT':'PUBLISHED' emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1206.34 y=137 w=73.66 h=23
- CSS: width: 73.6562px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 73.6562px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 73.66×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(28, 107, 74) · border: 0px solid rgb(28, 107, 74) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Publicado"

#### STATE

- PUBLISHED → success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 73,66×23 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — SelectionRow (persona)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** li con checkbox + label
- **INSTANCE / ROLE:** Convocada con su estado de disponibilidad
- **SOURCE COMPONENT:** SelectionPage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > ul > li
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=295.38 w=854 h=58.64
- CSS: width: 854px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 854px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 854×476.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Confirmó con el horario anterior"

#### STATE

- checked (publicada)

#### INTERACTION

- trigger: click en el checkbox → toggle(personId) y marca dirty
- trigger: si está seleccionada y tiene códigos de conflicto, se despliega la lista de conflictos debajo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×58,64 px; checkbox 20×20 px, label a 65 px de x
- 1440: idéntico, ancho de la columna principal

#### IMPLEMENTATION NOTES

- El texto secundario traduce el estado de disponibilidad a lenguaje de usuario: «Dijo que va», «Dijo que no va», «Confirmó con el horario anterior», «Sin responder».
- Los conflictos se renderizan sólo si la persona está seleccionada y conflictCodesFor devuelve códigos.

### C04 — RevisionsSurface

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** Surface con botón expansor
- **INSTANCE / ROLE:** Historial de revisiones publicadas de la convocatoria
- **SOURCE COMPONENT:** Surface + HistoryList
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > Surface (Revisiones publicadas)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=863.8 w=182.75 h=21.25
- CSS: width: 182.75px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 182.75px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=6.3 · padre 854×36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Revisiones publicadas"

#### STATE

- plegada (el botón dice «Ver 1»)

#### INTERACTION

- trigger: click en «Ver 1» → despliega el HistoryList; el botón pasa a decir «Ocultar»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El botón usa aria-expanded y cambia su texto entre «Ver N» y «Ocultar».

### C05 — SelectionActionBar

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** div sticky
- **INSTANCE / ROLE:** Resumen del borrador y botón de publicación
- **SOURCE COMPONENT:** SelectionPage > barra sticky
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > div.sticky
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1098.95 y=841 w=164.05 h=46
- CSS: width: 164.047px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 164.047px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 164.05×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 0.45
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar cambios"

#### STATE

- sin cambios (dirty=false): el botón está disabled

#### INTERACTION

- trigger: click en «Publicar cambios» (habilitado sólo con cambios) → abre el ConfirmDialog
- trigger: click en «Descartar» (visible sólo con cambios) → descarta el borrador local

#### MOTION

- transition-colors duration-micro; el spinner del botón busy usa animate-spin

#### RESPONSIVE

- 390: sticky bottom-16, -mx-4 px-4 py-3
- 1440: lg:bottom-0 lg:mx-0 lg:rounded-surface lg:border

#### IMPLEMENTATION NOTES

- A la izquierda hay un texto de resumen: «N sumadas · M fuera» o «Sin cambios» / «Sin publicar».
- El texto del botón depende del estado: «Publicar convocatoria» si nunca se publicó, «Publicar cambios» si ya había una publicación.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky bottom-16 z-20 (390) / lg:bottom-0 (1440)
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1095 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la barra de publicación es `sticky bottom-16` en móvil (por encima del BottomNav) y `lg:bottom-0` con bordes redondeados en escritorio.
- La lista de checkboxes es de una columna en ambos viewports.
