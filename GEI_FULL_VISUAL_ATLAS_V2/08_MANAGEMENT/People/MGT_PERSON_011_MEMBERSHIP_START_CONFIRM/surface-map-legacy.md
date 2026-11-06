# SURFACE MAP — MGT_PERSON_011_MEMBERSHIP_START_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_011_MEMBERSHIP_START_CONFIRM

**SCREEN ID:** MGT_PERSON_011_MEMBERSHIP_START_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — confirmación de inicio de pertenencia

**PURPOSE AS IMPLEMENTED:** Diálogo que explica el efecto de iniciar la pertenencia de una persona.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p16

**ORIGIN:** MGT_PERSON_008_PENDING_ACCOUNT → «Iniciar pertenencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16

**RESOURCE STATE:** INICIO DE PERTENENCIA CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?demo=admin.
2. Pulsar «Iniciar pertenencia».

**RELATED SCREEN IDS:** MGT_PERSON_008_PENDING_ACCOUNT, MGT_PERSON_010_NO_MEMBERSHIP

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog tone=attention «Iniciar pertenencia», Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia «{nombre} queda dentro del club desde hoy…»
- **FOCAL 2:** Botón «Iniciar pertenencia»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StartMembershipConfirm | section[role=dialog] | Confirmación del inicio de pertenencia |

### C01 — StartMembershipConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del inicio de pertenencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=537.25 w=390 h=306.75
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=537.25 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Iniciar pertenencia Qué pasa si confirmás Lola queda dentro del club desde hoy. "

#### STATE

- open

#### INTERACTION

- trigger: click en «Iniciar pertenencia» → startMembership(personId)
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es attention (ámbar) y NO exige motivo: iniciar una pertenencia no es una acción terminal.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1086 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_PERSON_011_MEMBERSHIP_START_CONFIRM

**SCREEN ID:** MGT_PERSON_011_MEMBERSHIP_START_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — confirmación de inicio de pertenencia

**PURPOSE AS IMPLEMENTED:** Diálogo que explica el efecto de iniciar la pertenencia de una persona.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p16

**ORIGIN:** MGT_PERSON_008_PENDING_ACCOUNT → «Iniciar pertenencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16

**RESOURCE STATE:** INICIO DE PERTENENCIA CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?demo=admin.
2. Pulsar «Iniciar pertenencia».

**RELATED SCREEN IDS:** MGT_PERSON_008_PENDING_ACCOUNT, MGT_PERSON_010_NO_MEMBERSHIP

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog tone=attention «Iniciar pertenencia», Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia «{nombre} queda dentro del club desde hoy…»
- **FOCAL 2:** Botón «Iniciar pertenencia»
- **SUPPORTING:** Botón «Cancelar»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StartMembershipConfirm | section[role=dialog] | Confirmación del inicio de pertenencia |

### C01 — StartMembershipConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del inicio de pertenencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=307.47 w=512 h=285.06
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=307.47 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Iniciar pertenencia Qué pasa si confirmás Lola queda dentro del club desde hoy. "

#### STATE

- open

#### INTERACTION

- trigger: click en «Iniciar pertenencia» → startMembership(personId)
- trigger: Escape → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El tono es attention (ámbar) y NO exige motivo: iniciar una pertenencia no es una acción terminal.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 976 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
