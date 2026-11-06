# SURFACE MAP — MGT_PERSON_006_IDENTITY_MODAL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_006_IDENTITY_MODAL

**SCREEN ID:** MGT_PERSON_006_IDENTITY_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — modal de corrección de identidad

**PURPOSE AS IMPLEMENTED:** Modal de corrección de los datos que administra el club, con validación de documento y fecha.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → «Corregir identidad»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2

**RESOURCE STATE:** Panel abierto, sin cambios

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?demo=admin.
2. Pulsar «Corregir identidad».

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail > Modal «Corregir identidad», Modal, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_006_IDENTITY_MODAL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos de documento y fecha de nacimiento
- **FOCAL 2:** Botón «Guardar identidad»
- **SUPPORTING:** Descripción del modal
- **SECONDARY:** Botón «Cancelar»
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IdentityModal | section[role=dialog] | Corrección de identidad administrada por el club |

### C01 — IdentityModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Corrección de identidad administrada por el club
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=308.47 w=390 h=535.53
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=308.47 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Corregir identidad Datos que el club administra. Queda registrado quién los camb"

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar identidad» → valida documento no vacío y fecha presente → updateIdentity
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- La descripción dice «Datos que el club administra. Queda registrado quién los cambió.»
- Los errores de validación se guardan en un estado local (identityErrors) y se muestran bajo los campos.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1162 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_PERSON_006_IDENTITY_MODAL

**SCREEN ID:** MGT_PERSON_006_IDENTITY_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — modal de corrección de identidad

**PURPOSE AS IMPLEMENTED:** Modal de corrección de los datos que administra el club, con validación de documento y fecha.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → «Corregir identidad»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2

**RESOURCE STATE:** Panel abierto, sin cambios

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?demo=admin.
2. Pulsar «Corregir identidad».

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail > Modal «Corregir identidad», Modal, TextField

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_006_IDENTITY_MODAL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos de documento y fecha de nacimiento
- **FOCAL 2:** Botón «Guardar identidad»
- **SUPPORTING:** Descripción del modal
- **SECONDARY:** Botón «Cancelar»
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IdentityModal | section[role=dialog] | Corrección de identidad administrada por el club |

### C01 — IdentityModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Corrección de identidad administrada por el club
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=190.92 w=512 h=518.14
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=190.92 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Corregir identidad Datos que el club administra. Queda registrado quién los camb"

#### STATE

- open

#### INTERACTION

- trigger: click en «Guardar identidad» → valida documento no vacío y fecha presente → updateIdentity
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- La descripción dice «Datos que el club administra. Queda registrado quién los cambió.»
- Los errores de validación se guardan en un estado local (identityErrors) y se muestran bajo los campos.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1073 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
