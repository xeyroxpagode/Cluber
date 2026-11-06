# SURFACE MAP — MGT_COMPETITIONS_003_CREATE_MODAL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_COMPETITIONS_003_CREATE_MODAL

**SCREEN ID:** MGT_COMPETITIONS_003_CREATE_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — modal de alta

**PURPOSE AS IMPLEMENTED:** Modal de alta de competencia con nombre y organizador, con validación en el botón de creación.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/competitions

**ORIGIN:** MGT_COMPETITIONS_001_LIST → «Crear competencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** Panel abierto, sin valores

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions?demo=admin.
2. Pulsar «Crear competencia».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_001_LIST

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CompetitionsPage > Modal «Crear competencia», Modal, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_003_CREATE_MODAL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos «Nombre» y «Organizador»
- **FOCAL 2:** Botón «Crear»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título del modal
- **AMBIENT:** Listado de competencias atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CreateCompetitionModal | section[role=dialog] | Alta de competencia |

### C01 — CreateCompetitionModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Alta de competencia
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

- visible: "Crear competencia Nombre OBLIGATORIO Organizador OBLIGATORIO Cancelar Crear"

#### STATE

- open

#### INTERACTION

- trigger: click en «Crear» → valida el nombre y crea la competencia; navega a /management/competitions/:id
- trigger: click en «Cancelar» → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El error de validación («Poné un nombre.») se muestra como un párrafo text-meta text-danger dentro del cuerpo del modal, sin icono.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_COMPETITIONS_003_CREATE_MODAL

**SCREEN ID:** MGT_COMPETITIONS_003_CREATE_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — modal de alta

**PURPOSE AS IMPLEMENTED:** Modal de alta de competencia con nombre y organizador, con validación en el botón de creación.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/competitions

**ORIGIN:** MGT_COMPETITIONS_001_LIST → «Crear competencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** Panel abierto, sin valores

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions?demo=admin.
2. Pulsar «Crear competencia».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_001_LIST

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CompetitionsPage > Modal «Crear competencia», Modal, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_003_CREATE_MODAL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos «Nombre» y «Organizador»
- **FOCAL 2:** Botón «Crear»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título del modal
- **AMBIENT:** Listado de competencias atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CreateCompetitionModal | section[role=dialog] | Alta de competencia |

### C01 — CreateCompetitionModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Alta de competencia
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

- visible: "Crear competencia Nombre OBLIGATORIO Organizador OBLIGATORIO Cancelar Crear"

#### STATE

- open

#### INTERACTION

- trigger: click en «Crear» → valida el nombre y crea la competencia; navega a /management/competitions/:id
- trigger: click en «Cancelar» → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El error de validación («Poné un nombre.») se muestra como un párrafo text-meta text-danger dentro del cuerpo del modal, sin icono.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
