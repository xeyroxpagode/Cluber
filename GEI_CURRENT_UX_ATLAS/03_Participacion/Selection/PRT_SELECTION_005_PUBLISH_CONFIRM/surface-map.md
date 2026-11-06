# SURFACE MAP — PRT_SELECTION_005_PUBLISH_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_005_PUBLISH_CONFIRM

**SCREEN ID:** PRT_SELECTION_005_PUBLISH_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — confirmación de publicación

**PURPOSE AS IMPLEMENTED:** Diálogo que explica a quién va el aviso y enumera las altas y bajas respecto de la publicación anterior.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** PRT_SELECTION_004_DRAFT_DIRTY → «Publicar convocatoria»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, p0

**RESOURCE STATE:** PUBLICACIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.
2. Pulsar el checkbox #sel-p0.
3. Pulsar «Publicar convocatoria».

**RELATED SCREEN IDS:** PRT_SELECTION_004_DRAFT_DIRTY, PRT_SELECTION_009_PUBLISH_TOAST

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog tone=attention, Modal, Banner tone=attention

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_005_PUBLISH_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque «Cambios» con la lista de entradas y salidas
- **FOCAL 2:** Consecuencia en el banner ámbar
- **SUPPORTING:** Botones «Cancelar» y «Publicar»
- **SECONDARY:** Título «Publicar convocatoria»
- **AMBIENT:** Pantalla de convocatoria atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PublishConfirmDialog | section[role=dialog] | Confirmación de la publicación |
| C02 | ChangesBlock | div con borde bg-control | Enumera las altas y bajas del cambio |

### C01 — PublishConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación de la publicación
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=450.17 w=390 h=393.83
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=450.17 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar convocatoria Qué pasa si confirmás Las 1 personas convocadas van a reci"

#### STATE

- open

#### INTERACTION

- trigger: click en «Publicar» → publishSelection(...) y toast «Convocatoria publicada.»
- trigger: Escape → cierra sin publicar

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es attention (ámbar) y NO exige motivo: el diálogo de publicación no pide texto.

### C02 — ChangesBlock

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div con borde bg-control
- **INSTANCE / ROLE:** Enumera las altas y bajas del cambio
- **SOURCE COMPONENT:** SelectionPage > extra
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > extra (added/removed)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=679.92 w=350 h=71.08
- CSS: width: 350px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=140.75 · padre 350×211.83
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(247, 249, 252) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "CAMBIOS Entra Victoria Berg"

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×~80 px
- 1440: 464 px

#### IMPLEMENTATION NOTES

- Cada línea dice «Entra {nombre}» o «Sale {nombre}».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1184 · scrollY 324 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal; cambia la posición y el ancho máximo.

# PRT_SELECTION_005_PUBLISH_CONFIRM

**SCREEN ID:** PRT_SELECTION_005_PUBLISH_CONFIRM

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — confirmación de publicación

**PURPOSE AS IMPLEMENTED:** Diálogo que explica a quién va el aviso y enumera las altas y bajas respecto de la publicación anterior.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** PRT_SELECTION_004_DRAFT_DIRTY → «Publicar convocatoria»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1, p0

**RESOURCE STATE:** PUBLICACIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.
2. Pulsar el checkbox #sel-p0.
3. Pulsar «Publicar convocatoria».

**RELATED SCREEN IDS:** PRT_SELECTION_004_DRAFT_DIRTY, PRT_SELECTION_009_PUBLISH_TOAST

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog tone=attention, Modal, Banner tone=attention

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_005_PUBLISH_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque «Cambios» con la lista de entradas y salidas
- **FOCAL 2:** Consecuencia en el banner ámbar
- **SUPPORTING:** Botones «Cancelar» y «Publicar»
- **SECONDARY:** Título «Publicar convocatoria»
- **AMBIENT:** Pantalla de convocatoria atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PublishConfirmDialog | section[role=dialog] | Confirmación de la publicación |
| C02 | ChangesBlock | div con borde bg-control | Enumera las altas y bajas del cambio |

### C01 — PublishConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación de la publicación
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=263.92 w=512 h=372.14
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=263.92 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar convocatoria Qué pasa si confirmás Las 1 personas convocadas van a reci"

#### STATE

- open

#### INTERACTION

- trigger: click en «Publicar» → publishSelection(...) y toast «Convocatoria publicada.»
- trigger: Escape → cierra sin publicar

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es attention (ámbar) y NO exige motivo: el diálogo de publicación no pide texto.

### C02 — ChangesBlock

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** div con borde bg-control
- **INSTANCE / ROLE:** Enumera las altas y bajas del cambio
- **SOURCE COMPONENT:** SelectionPage > extra
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** SelectionPage > extra (added/removed)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=484 y=471.98 w=472 h=71.08
- CSS: width: 472px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 472px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=119.06 · padre 472×190.14
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(247, 249, 252) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "CAMBIOS Entra Victoria Berg"

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×~80 px
- 1440: 464 px

#### IMPLEMENTATION NOTES

- Cada línea dice «Entra {nombre}» o «Sale {nombre}».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1093 · scrollY 193 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal; cambia la posición y el ancho máximo.
