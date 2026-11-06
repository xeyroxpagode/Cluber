# SURFACE MAP — MGT_PERSON_008_PENDING_ACCOUNT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_008_PENDING_ACCOUNT

**SCREEN ID:** MGT_PERSON_008_PENDING_ACCOUNT

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — cuenta pendiente

**PURPOSE AS IMPLEMENTED:** Ficha de una persona con cuenta pendiente de activación: la acción primaria contextual es «Iniciar pertenencia».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p16

**ORIGIN:** Personas → filtro «Cuenta: Pendiente» → click en Lola Martínez

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (Lola Martínez, PENDING, sin pertenencia)

**RESOURCE STATE:** CUENTA PENDIENTE · SIN PERTENENCIA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_005_CUENTA, MGT_PERSON_009_CODE_MODAL, MGT_PERSON_010_NO_MEMBERSHIP

**RESPONSIVE COUNTERPART:** La acción primaria va en el action del encabezado; en 390 pasa a una línea propia.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (primary contextual), Button variant=primary, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_008_PENDING_ACCOUNT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Acción primaria «Iniciar pertenencia»
- **FOCAL 2:** Badge «Pendiente» de la cuenta
- **SUPPORTING:** Lead de la ficha
- **SECONDARY:** Pestañas
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StartMembershipButton | Button primary | Iniciar la pertenencia de la persona |

### C01 — StartMembershipButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Iniciar la pertenencia de la persona
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary («Iniciar pertenencia»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=98.38 y=231.63 w=172.19 h=44
- CSS: width: 172.188px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 172.188px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=82.38 dy=0 · padre 254.56×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Iniciar pertenencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Iniciar pertenencia»

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, en el action del encabezado
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La regla de la acción primaria contextual: sin pertenencia → «Iniciar pertenencia»; con pertenencia y cuenta PENDING → «Emitir código de activación»; con cuenta DISABLED → «Habilitar cuenta»; en cualquier otro caso no hay acción primaria.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1086 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_PERSON_008_PENDING_ACCOUNT

**SCREEN ID:** MGT_PERSON_008_PENDING_ACCOUNT

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — cuenta pendiente

**PURPOSE AS IMPLEMENTED:** Ficha de una persona con cuenta pendiente de activación: la acción primaria contextual es «Iniciar pertenencia».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p16

**ORIGIN:** Personas → filtro «Cuenta: Pendiente» → click en Lola Martínez

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p16 (Lola Martínez, PENDING, sin pertenencia)

**RESOURCE STATE:** CUENTA PENDIENTE · SIN PERTENENCIA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_005_CUENTA, MGT_PERSON_009_CODE_MODAL, MGT_PERSON_010_NO_MEMBERSHIP

**RESPONSIVE COUNTERPART:** La acción primaria va en el action del encabezado; en 390 pasa a una línea propia.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (primary contextual), Button variant=primary, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_008_PENDING_ACCOUNT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Acción primaria «Iniciar pertenencia»
- **FOCAL 2:** Badge «Pendiente» de la cuenta
- **SUPPORTING:** Lead de la ficha
- **SECONDARY:** Pestañas
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StartMembershipButton | Button primary | Iniciar la pertenencia de la persona |

### C01 — StartMembershipButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Iniciar la pertenencia de la persona
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary («Iniciar pertenencia»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1107.81 y=137 w=172.19 h=44
- CSS: width: 172.188px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 172.188px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=82.37 dy=0 · padre 254.56×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Iniciar pertenencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Iniciar pertenencia»

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, en el action del encabezado
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La regla de la acción primaria contextual: sin pertenencia → «Iniciar pertenencia»; con pertenencia y cuenta PENDING → «Emitir código de activación»; con cuenta DISABLED → «Habilitar cuenta»; en cualquier otro caso no hay acción primaria.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 976 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
