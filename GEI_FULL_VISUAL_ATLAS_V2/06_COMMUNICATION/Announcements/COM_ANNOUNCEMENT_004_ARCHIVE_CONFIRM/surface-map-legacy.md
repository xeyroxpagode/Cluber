# SURFACE MAP — COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM

**SCREEN ID:** COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — confirmación de archivado

**PURPOSE AS IMPLEMENTED:** Diálogo de archivado del comunicado: explica que deja de aparecer en el canal y exige un motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /announcements/a1

**ORIGIN:** COM_ANNOUNCEMENT_003_MENU_OPEN → «Archivar»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1

**RESOURCE STATE:** ARCHIVADO CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=subcommittee.
2. Pulsar «Acciones».
3. Pulsar «Archivar».

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_003_MENU_OPEN

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Archivar el comunicado», Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia del archivado
- **FOCAL 2:** Campo de motivo obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Archivar»
- **SECONDARY:** Título «Archivar el comunicado»
- **AMBIENT:** Comunicado atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ArchiveConfirmDialog | section[role=dialog] | Confirmación del archivado |

### C01 — ArchiveConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del archivado
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

- visible: "Archivar el comunicado Qué pasa si confirmás Deja de aparecer en el canal de tod"

#### STATE

- open

#### INTERACTION

- trigger: click en «Archivar» → archiveAnnouncement(id, reason) y navega a /communication
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es danger y el motivo es obligatorio.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM

**SCREEN ID:** COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — confirmación de archivado

**PURPOSE AS IMPLEMENTED:** Diálogo de archivado del comunicado: explica que deja de aparecer en el canal y exige un motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /announcements/a1

**ORIGIN:** COM_ANNOUNCEMENT_003_MENU_OPEN → «Archivar»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1

**RESOURCE STATE:** ARCHIVADO CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1?demo=subcommittee.
2. Pulsar «Acciones».
3. Pulsar «Archivar».

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_003_MENU_OPEN

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Archivar el comunicado», Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia del archivado
- **FOCAL 2:** Campo de motivo obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Archivar»
- **SECONDARY:** Título «Archivar el comunicado»
- **AMBIENT:** Comunicado atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ArchiveConfirmDialog | section[role=dialog] | Confirmación del archivado |

### C01 — ArchiveConfirmDialog

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del archivado
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

- visible: "Archivar el comunicado Qué pasa si confirmás Deja de aparecer en el canal de tod"

#### STATE

- open

#### INTERACTION

- trigger: click en «Archivar» → archiveAnnouncement(id, reason) y navega a /communication
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es danger y el motivo es obligatorio.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
