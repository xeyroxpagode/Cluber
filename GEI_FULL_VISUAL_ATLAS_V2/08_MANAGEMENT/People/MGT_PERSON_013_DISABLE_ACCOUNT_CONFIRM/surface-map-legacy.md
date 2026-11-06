# SURFACE MAP — MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM

**SCREEN ID:** MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — confirmación de deshabilitación de cuenta

**PURPOSE AS IMPLEMENTED:** Diálogo de la acción terminal que cierra todas las sesiones de una persona y exige un motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2?section=cuenta

**ORIGIN:** MGT_PERSON_005_CUENTA → «Deshabilitar cuenta»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2

**RESOURCE STATE:** DESHABILITACIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=cuenta&demo=admin.
2. Pulsar «Deshabilitar cuenta».

**RELATED SCREEN IDS:** MGT_PERSON_005_CUENTA

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Deshabilitar cuenta», setAccountState (store.tsx:945)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia «{nombre} no va a poder entrar más…»
- **FOCAL 2:** Campo «Motivo» obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Deshabilitar cuenta»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DisableAccountConfirm | section[role=dialog] | Confirmación de la deshabilitación de la cuenta |

### C01 — DisableAccountConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación de la deshabilitación de la cuenta
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

- visible: "Deshabilitar cuenta Qué pasa si confirmás Lucía no va a poder entrar más. Se cie"

#### STATE

- open

#### INTERACTION

- trigger: click en «Deshabilitar cuenta» → setAccountState(personId, 'DISABLED', reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El diálogo incluye un bloque `extra` que puede mostrar un Banner de error cuando setAccountState rechaza la operación (por ejemplo, si la persona es la administradora activa).

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1036 · scrollY 192 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM

**SCREEN ID:** MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — confirmación de deshabilitación de cuenta

**PURPOSE AS IMPLEMENTED:** Diálogo de la acción terminal que cierra todas las sesiones de una persona y exige un motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2?section=cuenta

**ORIGIN:** MGT_PERSON_005_CUENTA → «Deshabilitar cuenta»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2

**RESOURCE STATE:** DESHABILITACIÓN CONFIRMADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=cuenta&demo=admin.
2. Pulsar «Deshabilitar cuenta».

**RELATED SCREEN IDS:** MGT_PERSON_005_CUENTA

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Deshabilitar cuenta», setAccountState (store.tsx:945)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia «{nombre} no va a poder entrar más…»
- **FOCAL 2:** Campo «Motivo» obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Deshabilitar cuenta»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DisableAccountConfirm | section[role=dialog] | Confirmación de la deshabilitación de la cuenta |

### C01 — DisableAccountConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación de la deshabilitación de la cuenta
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

- visible: "Deshabilitar cuenta Qué pasa si confirmás Lucía no va a poder entrar más. Se cie"

#### STATE

- open

#### INTERACTION

- trigger: click en «Deshabilitar cuenta» → setAccountState(personId, 'DISABLED', reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El diálogo incluye un bloque `extra` que puede mostrar un Banner de error cuando setAccountState rechaza la operación (por ejemplo, si la persona es la administradora activa).

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 946 · scrollY 46 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
