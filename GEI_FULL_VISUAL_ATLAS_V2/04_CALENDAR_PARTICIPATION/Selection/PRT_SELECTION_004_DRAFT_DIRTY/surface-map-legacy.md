# SURFACE MAP — PRT_SELECTION_004_DRAFT_DIRTY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_004_DRAFT_DIRTY

**SCREEN ID:** PRT_SELECTION_004_DRAFT_DIRTY

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — borrador sin publicar

**PURPOSE AS IMPLEMENTED:** Tras marcar a una persona la convocatoria queda en estado «Borrador sin publicar» y la barra de acción muestra el recuento de cambios.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** PRT_SELECTION_002_DRAFT → marcar el checkbox de p0

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, p0 (Victoria Berg)

**RESOURCE STATE:** DRAFT · dirty=true · 1 sumada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.
2. Pulsar el checkbox #sel-p0.

**RELATED SCREEN IDS:** PRT_SELECTION_002_DRAFT, PRT_SELECTION_005_PUBLISH_CONFIRM

**RESPONSIVE COUNTERPART:** La barra de acción pasa a tener dos botones; en 390 se apilan.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SelectionPage (dirty), Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_004_DRAFT_DIRTY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Texto «Borrador sin publicar» en ámbar
- **FOCAL 2:** Botón «Publicar convocatoria» ahora primario
- **SUPPORTING:** Recuento «1 sumadas»
- **SECONDARY:** Fila de Victoria Berg marcada
- **AMBIENT:** Barra de publicación fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DirtyFlag («Borrador sin publicar») | span text-attention | Informa que hay cambios locales sin publicar |
| C02 | PublishSelectionButton (primario) | Button primary | Publicar la convocatoria modificada |

### C01 — DirtyFlag («Borrador sin publicar»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span text-attention
- **INSTANCE / ROLE:** Informa que hay cambios locales sin publicar
- **SOURCE COMPONENT:** SelectionPage > SectionHeader aside
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > SectionHeader aside (dirty)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=236.66 y=296.13 w=120.34 h=17.39
- CSS: width: 120.344px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 120.344px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=203.66 dy=3 · padre 324×21.25

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(138, 75, 8) · border: 0px solid rgb(138, 75, 8) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Borrador sin publicar"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: a la derecha del encabezado de sección
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — PublishSelectionButton (primario)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Publicar la convocatoria modificada
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button (dirty ? variant='primary' : 'secondary')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=130.2 y=724 w=196.25 h=44
- CSS: width: 196.25px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 196.25px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=114.2 dy=0 · padre 310.45×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar convocatoria"

#### STATE

- enabled

#### INTERACTION

- trigger: click → abre el ConfirmDialog de publicación

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, fondo bg-interactive
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El conteo del resumen usa «1 sumadas» (concatenación directa, sin pluralizar).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1184 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: en 1440 la barra usa `sm:flex-row` con los botones a la derecha; en 390 se apilan en columna.

# PRT_SELECTION_004_DRAFT_DIRTY

**SCREEN ID:** PRT_SELECTION_004_DRAFT_DIRTY

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — borrador sin publicar

**PURPOSE AS IMPLEMENTED:** Tras marcar a una persona la convocatoria queda en estado «Borrador sin publicar» y la barra de acción muestra el recuento de cambios.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** PRT_SELECTION_002_DRAFT → marcar el checkbox de p0

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, p0 (Victoria Berg)

**RESOURCE STATE:** DRAFT · dirty=true · 1 sumada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.
2. Pulsar el checkbox #sel-p0.

**RELATED SCREEN IDS:** PRT_SELECTION_002_DRAFT, PRT_SELECTION_005_PUBLISH_CONFIRM

**RESPONSIVE COUNTERPART:** La barra de acción pasa a tener dos botones; en 390 se apilan.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SelectionPage (dirty), Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_004_DRAFT_DIRTY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Texto «Borrador sin publicar» en ámbar
- **FOCAL 2:** Botón «Publicar convocatoria» ahora primario
- **SUPPORTING:** Recuento «1 sumadas»
- **SECONDARY:** Fila de Victoria Berg marcada
- **AMBIENT:** Barra de publicación fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DirtyFlag («Borrador sin publicar») | span text-attention | Informa que hay cambios locales sin publicar |
| C02 | PublishSelectionButton (primario) | Button primary | Publicar la convocatoria modificada |

### C01 — DirtyFlag («Borrador sin publicar»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span text-attention
- **INSTANCE / ROLE:** Informa que hay cambios locales sin publicar
- **SOURCE COMPONENT:** SelectionPage > SectionHeader aside
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > SectionHeader aside (dirty)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1138.66 y=265.13 w=120.34 h=17.39
- CSS: width: 120.344px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 120.344px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=733.66 dy=3 · padre 854×21.25

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(138, 75, 8) · border: 0px solid rgb(138, 75, 8) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Borrador sin publicar"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: a la derecha del encabezado de sección
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — PublishSelectionButton (primario)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Publicar la convocatoria modificada
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button (dirty ? variant='primary' : 'secondary')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1066.75 y=843 w=196.25 h=44
- CSS: width: 196.25px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 196.25px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=114.2 dy=0 · padre 310.45×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar convocatoria"

#### STATE

- enabled

#### INTERACTION

- trigger: click → abre el ConfirmDialog de publicación

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, fondo bg-interactive
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El conteo del resumen usa «1 sumadas» (concatenación directa, sin pluralizar).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1093 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: en 1440 la barra usa `sm:flex-row` con los botones a la derecha; en 390 se apilan en columna.
