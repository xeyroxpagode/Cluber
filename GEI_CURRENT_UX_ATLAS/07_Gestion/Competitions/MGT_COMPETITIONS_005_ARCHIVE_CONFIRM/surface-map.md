# SURFACE MAP — MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**SCREEN ID:** MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — confirmación de archivado

**PURPOSE AS IMPLEMENTED:** Diálogo de archivado de competencia con motivo obligatorio.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/competitions/ahba

**ORIGIN:** MGT_COMPETITIONS_002_DETAIL → «Archivar competencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba

**RESOURCE STATE:** ARCHIVADO CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.
2. Pulsar «Archivar competencia».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Archivar la competencia» (requireReason), Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia del archivado
- **FOCAL 2:** Campo «Por qué se archiva» obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Archivar competencia»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Detalle de competencia atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ArchiveCompetitionConfirm | section[role=dialog] | Confirmación del archivado de competencia |

### C01 — ArchiveCompetitionConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del archivado de competencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=381.11 w=390 h=462.89
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=381.11 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Archivar la competencia Qué pasa si confirmás Deja de aparecer como activa. Las "

#### STATE

- open

#### INTERACTION

- trigger: click en «Archivar competencia» → archiveCompetition(id, reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El motivo es obligatorio y se rotula «Por qué se archiva».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1079 · scrollY 235 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**SCREEN ID:** MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — confirmación de archivado

**PURPOSE AS IMPLEMENTED:** Diálogo de archivado de competencia con motivo obligatorio.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/competitions/ahba

**ORIGIN:** MGT_COMPETITIONS_002_DETAIL → «Archivar competencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba

**RESOURCE STATE:** ARCHIVADO CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.
2. Pulsar «Archivar competencia».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Archivar la competencia» (requireReason), Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia del archivado
- **FOCAL 2:** Campo «Por qué se archiva» obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Archivar competencia»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Detalle de competencia atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ArchiveCompetitionConfirm | section[role=dialog] | Confirmación del archivado de competencia |

### C01 — ArchiveCompetitionConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del archivado de competencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=229.39 w=512 h=441.2
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=229.39 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Archivar la competencia Qué pasa si confirmás Deja de aparecer como activa. Las "

#### STATE

- open

#### INTERACTION

- trigger: click en «Archivar competencia» → archiveCompetition(id, reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El motivo es obligatorio y se rotula «Por qué se archiva».

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 903 · scrollY 3 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
