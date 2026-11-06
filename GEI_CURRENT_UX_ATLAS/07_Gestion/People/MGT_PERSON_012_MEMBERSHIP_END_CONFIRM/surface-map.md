# SURFACE MAP — MGT_PERSON_012_MEMBERSHIP_END_CONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_012_MEMBERSHIP_END_CONFIRM

**SCREEN ID:** MGT_PERSON_012_MEMBERSHIP_END_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — confirmación de fin de pertenencia

**PURPOSE AS IMPLEMENTED:** Diálogo de la acción terminal que cierra la pertenencia: explica que no borra nada y exige un motivo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2?section=pertenencia

**ORIGIN:** MGT_PERSON_002_PERTENENCIA → «Finalizar»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2

**RESOURCE STATE:** FIN DE PERTENENCIA CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=pertenencia&demo=admin.
2. Pulsar «Finalizar».

**RELATED SCREEN IDS:** MGT_PERSON_002_PERTENENCIA

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Finalizar pertenencia» (requireReason), Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia del cierre de pertenencia
- **FOCAL 2:** Campo «Motivo» obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Finalizar pertenencia»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EndMembershipConfirm | section[role=dialog] | Confirmación del fin de pertenencia |

### C01 — EndMembershipConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del fin de pertenencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=359.42 w=390 h=484.58
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=359.42 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Finalizar pertenencia Qué pasa si confirmás Deja de estar dentro del club. No se"

#### STATE

- open

#### INTERACTION

- trigger: click en «Finalizar pertenencia» → endMembership(personId, reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El motivo es obligatorio y el texto de la consecuencia explica que la cuenta queda activa pero sin acceso a la temporada.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# MGT_PERSON_012_MEMBERSHIP_END_CONFIRM

**SCREEN ID:** MGT_PERSON_012_MEMBERSHIP_END_CONFIRM

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — confirmación de fin de pertenencia

**PURPOSE AS IMPLEMENTED:** Diálogo de la acción terminal que cierra la pertenencia: explica que no borra nada y exige un motivo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2?section=pertenencia

**ORIGIN:** MGT_PERSON_002_PERTENENCIA → «Finalizar»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2

**RESOURCE STATE:** FIN DE PERTENENCIA CONFIRMADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=pertenencia&demo=admin.
2. Pulsar «Finalizar».

**RELATED SCREEN IDS:** MGT_PERSON_002_PERTENENCIA

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ConfirmDialog «Finalizar pertenencia» (requireReason), Modal

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Consecuencia del cierre de pertenencia
- **FOCAL 2:** Campo «Motivo» obligatorio
- **SUPPORTING:** Botones «Cancelar» y «Finalizar pertenencia»
- **SECONDARY:** Título del diálogo
- **AMBIENT:** Ficha atenuada

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EndMembershipConfirm | section[role=dialog] | Confirmación del fin de pertenencia |

### C01 — EndMembershipConfirm

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del fin de pertenencia
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=218.55 w=512 h=462.89
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=218.55 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Finalizar pertenencia Qué pasa si confirmás Deja de estar dentro del club. No se"

#### STATE

- open

#### INTERACTION

- trigger: click en «Finalizar pertenencia» → endMembership(personId, reason)
- trigger: confirmar sin motivo → error y foco al campo

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El motivo es obligatorio y el texto de la consecuencia explica que la cuenta queda activa pero sin acceso a la temporada.

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
