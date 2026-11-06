# SURFACE MAP — PRT_SELECTION_003_REVISIONS_OPEN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_003_REVISIONS_OPEN

**SCREEN ID:** PRT_SELECTION_003_REVISIONS_OPEN

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — revisiones desplegadas

**PURPOSE AS IMPLEMENTED:** Sección «Revisiones publicadas» abierta con el historial de versiones de la convocatoria.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** PRT_SELECTION_001_PUBLISHED → «Ver 1»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, sel-r1 (revisión)

**RESOURCE STATE:** PUBLISHED · historial desplegado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=coach.
2. Pulsar «Ver 1».

**RELATED SCREEN IDS:** PRT_SELECTION_001_PUBLISHED

**RESPONSIVE COUNTERPART:** El historial se despliega dentro de la misma Surface; la columna de fechas queda a la derecha.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SelectionPage > HistoryList, HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_003_REVISIONS_OPEN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Entrada de la revisión publicada
- **FOCAL 2:** Botón «Ocultar»
- **SUPPORTING:** Diferencia «8 adentro» / «0 fuera»
- **SECONDARY:** Lista de convocadas
- **AMBIENT:** Barra de publicación fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RevisionsHistoryList | ul grid | Revisiones de convocatoria con su diferencia |

### C01 — RevisionsHistoryList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Revisiones de convocatoria con su diferencia
- **SOURCE COMPONENT:** HistoryList / TimelineEntry
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=9.38 w=324 h=476.13
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · padding: 0px 0px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=50.25 · padre 358×543.38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Confirmó con el horario anterior Josefina Díaz Dijo que va Lucía F"

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior y padding vertical 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La acción se arma como «Convocatoria de {N} personas» y el diff se muestra como «N adentro» / «N fuera».
- La fecha se formatea con toLocaleString('es-AR') en lugar del helper dateTimeLabel.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1278 · scrollY 317 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_SELECTION_003_REVISIONS_OPEN

**SCREEN ID:** PRT_SELECTION_003_REVISIONS_OPEN

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — revisiones desplegadas

**PURPOSE AS IMPLEMENTED:** Sección «Revisiones publicadas» abierta con el historial de versiones de la convocatoria.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** PRT_SELECTION_001_PUBLISHED → «Ver 1»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, sel-r1 (revisión)

**RESOURCE STATE:** PUBLISHED · historial desplegado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=coach.
2. Pulsar «Ver 1».

**RELATED SCREEN IDS:** PRT_SELECTION_001_PUBLISHED

**RESPONSIVE COUNTERPART:** El historial se despliega dentro de la misma Surface; la columna de fechas queda a la derecha.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** SelectionPage > HistoryList, HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_003_REVISIONS_OPEN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Entrada de la revisión publicada
- **FOCAL 2:** Botón «Ocultar»
- **SUPPORTING:** Diferencia «8 adentro» / «0 fuera»
- **SECONDARY:** Lista de convocadas
- **AMBIENT:** Barra de publicación fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RevisionsHistoryList | ul grid | Revisiones de convocatoria con su diferencia |

### C01 — RevisionsHistoryList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Revisiones de convocatoria con su diferencia
- **SOURCE COMPONENT:** HistoryList / TimelineEntry
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=100.38 w=854 h=476.13
- CSS: width: 854px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 854px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 854px · padding: 0px 0px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=54.25 · padre 896×551.38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Confirmó con el horario anterior Josefina Díaz Dijo que va Lucía F"

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior y padding vertical 12 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La acción se arma como «Convocatoria de {N} personas» y el diff se muestra como «N adentro» / «N fuera».
- La fecha se formatea con toLocaleString('es-AR') en lugar del helper dateTimeLabel.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1195 · scrollY 195 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
