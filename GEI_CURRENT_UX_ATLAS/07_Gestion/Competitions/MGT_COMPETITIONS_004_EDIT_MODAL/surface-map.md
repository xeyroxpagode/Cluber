# SURFACE MAP — MGT_COMPETITIONS_004_EDIT_MODAL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_COMPETITIONS_004_EDIT_MODAL

**SCREEN ID:** MGT_COMPETITIONS_004_EDIT_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — modal de edición

**PURPOSE AS IMPLEMENTED:** Modal de edición de nombre y organizador de una competencia existente, con los valores precargados.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/competitions/ahba

**ORIGIN:** MGT_COMPETITIONS_002_DETAIL → «Editar»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba

**RESOURCE STATE:** Panel abierto con valores

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.
2. Pulsar «Editar».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL, MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CompetitionsPage > Modal «Editar competencia», Modal, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_004_EDIT_MODAL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos precargados con el nombre y el organizador
- **FOCAL 2:** Botón «Guardar»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título «Editar competencia»
- **AMBIENT:** Detalle de competencia atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EditCompetitionModal | section[role=dialog] | Edición de competencia |

### C01 — EditCompetitionModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Edición de competencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=503.25 w=390 h=340.75
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=503.25 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Editar competencia Nombre OBLIGATORIO Organizador OPCIONAL Cancelar Guardar"

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar» → updateCompetition(id, {name, organizer}); si falla, el error se muestra fuera del modal
- trigger: click en «Cancelar» → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El error de validación del nombre se renderiza en la pantalla (banner «No se pudo aplicar el cambio»), no dentro del modal.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1079 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_COMPETITIONS_004_EDIT_MODAL

**SCREEN ID:** MGT_COMPETITIONS_004_EDIT_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — modal de edición

**PURPOSE AS IMPLEMENTED:** Modal de edición de nombre y organizador de una competencia existente, con los valores precargados.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/competitions/ahba

**ORIGIN:** MGT_COMPETITIONS_002_DETAIL → «Editar»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba

**RESOURCE STATE:** Panel abierto con valores

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.
2. Pulsar «Editar».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL, MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CompetitionsPage > Modal «Editar competencia», Modal, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_004_EDIT_MODAL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos precargados con el nombre y el organizador
- **FOCAL 2:** Botón «Guardar»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título «Editar competencia»
- **AMBIENT:** Detalle de competencia atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EditCompetitionModal | section[role=dialog] | Edición de competencia |

### C01 — EditCompetitionModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Edición de competencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=279.63 w=512 h=340.75
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=279.63 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Editar competencia Nombre OBLIGATORIO Organizador OPCIONAL Cancelar Guardar"

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar» → updateCompetition(id, {name, organizer}); si falla, el error se muestra fuera del modal
- trigger: click en «Cancelar» → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El error de validación del nombre se renderiza en la pantalla (banner «No se pudo aplicar el cambio»), no dentro del modal.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 903 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
