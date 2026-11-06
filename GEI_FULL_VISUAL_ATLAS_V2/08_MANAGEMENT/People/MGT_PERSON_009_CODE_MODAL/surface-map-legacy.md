# SURFACE MAP — MGT_PERSON_009_CODE_MODAL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_009_CODE_MODAL

**SCREEN ID:** MGT_PERSON_009_CODE_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — modal de código de activación

**PURPOSE AS IMPLEMENTED:** Modal que emite el código de activación de una cuenta pendiente y lo muestra en pantalla para comunicarlo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p16?section=cuenta

**ORIGIN:** Ficha → pestaña «Cuenta» → «Emitir código de activación»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16, setupToken generado en runtime

**RESOURCE STATE:** CÓDIGO EMITIDO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?section=cuenta&demo=admin.
2. Pulsar «Emitir código de activación».
3. Pulsar «Emitir código».

**RELATED SCREEN IDS:** MGT_PERSON_008_PENDING_ACCOUNT, AUTH_ACTIVATE_003_SUCCESS

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** PersonAdminDetail > Modal «Código de activación», issueSetupToken (store.tsx:989)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_009_CODE_MODAL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde con el código emitido
- **FOCAL 2:** Botón «Emitir código»
- **SUPPORTING:** Texto con el nombre de la persona
- **SECONDARY:** Botón «Cerrar»
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationCodeModal | section[role=dialog] | Emisión del código de activación |

### C01 — ActivationCodeModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Emisión del código de activación
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=530.61 w=390 h=313.39
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=530.61 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Código de activación Vigente por 24 horas y de un solo uso. Código emitido GEI-7"

#### STATE

- open con código emitido

#### INTERACTION

- trigger: click en «Emitir código» → issueSetupToken(personId) y muestra el código
- trigger: click en «Cerrar» → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El código se genera con el formato «GEI-{4 dígitos aleatorios}» y caduca a las 24 horas.
- Antes de emitir, el cuerpo muestra «Todavía no emitiste un código para esta persona.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1130 · scrollY 114 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_PERSON_009_CODE_MODAL

**SCREEN ID:** MGT_PERSON_009_CODE_MODAL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — modal de código de activación

**PURPOSE AS IMPLEMENTED:** Modal que emite el código de activación de una cuenta pendiente y lo muestra en pantalla para comunicarlo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p16?section=cuenta

**ORIGIN:** Ficha → pestaña «Cuenta» → «Emitir código de activación»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16, setupToken generado en runtime

**RESOURCE STATE:** CÓDIGO EMITIDO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?section=cuenta&demo=admin.
2. Pulsar «Emitir código de activación».
3. Pulsar «Emitir código».

**RELATED SCREEN IDS:** MGT_PERSON_008_PENDING_ACCOUNT, AUTH_ACTIVATE_003_SUCCESS

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** PersonAdminDetail > Modal «Código de activación», issueSetupToken (store.tsx:989)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_009_CODE_MODAL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde con el código emitido
- **FOCAL 2:** Botón «Emitir código»
- **SUPPORTING:** Texto con el nombre de la persona
- **SECONDARY:** Botón «Cerrar»
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationCodeModal | section[role=dialog] | Emisión del código de activación |

### C01 — ActivationCodeModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Emisión del código de activación
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=304.14 w=512 h=291.7
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=304.14 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Código de activación Vigente por 24 horas y de un solo uso. Código emitido GEI-7"

#### STATE

- open con código emitido

#### INTERACTION

- trigger: click en «Emitir código» → issueSetupToken(personId) y muestra el código
- trigger: click en «Cerrar» → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El código se genera con el formato «GEI-{4 dígitos aleatorios}» y caduca a las 24 horas.
- Antes de emitir, el cuerpo muestra «Todavía no emitiste un código para esta persona.»

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1020 · scrollY 1 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
