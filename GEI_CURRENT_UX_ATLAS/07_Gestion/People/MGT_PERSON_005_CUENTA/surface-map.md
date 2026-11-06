# SURFACE MAP — MGT_PERSON_005_CUENTA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_005_CUENTA

**SCREEN ID:** MGT_PERSON_005_CUENTA

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Cuenta

**PURPOSE AS IMPLEMENTED:** Sección de cuenta: estado, credencial, última actividad, código vigente y las acciones de habilitar o deshabilitar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2?section=cuenta

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → pestaña «Cuenta»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2 (ACTIVE, credencial configurada)

**RESOURCE STATE:** CUENTA ACTIVA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=cuenta&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM, MGT_PERSON_008_PENDING_ACCOUNT

**RESPONSIVE COUNTERPART:** Sección de una columna; el botón de acción queda debajo de la superficie.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (section=cuenta), StateBadge, Button variant=danger, Lock

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_005_CUENTA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Superficie «Estado de la cuenta»
- **FOCAL 2:** Botón «Deshabilitar cuenta»
- **SUPPORTING:** Credencial y última actividad
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DisableAccountButton | Button danger | Deshabilitar la cuenta con motivo |

### C01 — DisableAccountButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Deshabilitar la cuenta con motivo
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger («Deshabilitar cuenta»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=652.41 w=203.69 h=46
- CSS: width: 203.688px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 203.688px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 470.58×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-lock (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Deshabilitar cuenta"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Deshabilitar cuenta»

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, con icono Lock 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El botón existe sólo si la cuenta está ACTIVE; para una cuenta DISABLED aparece «Habilitar cuenta» y para una PENDING «Emitir código de activación».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1036 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferenciasestructurales.

# MGT_PERSON_005_CUENTA

**SCREEN ID:** MGT_PERSON_005_CUENTA

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Cuenta

**PURPOSE AS IMPLEMENTED:** Sección de cuenta: estado, credencial, última actividad, código vigente y las acciones de habilitar o deshabilitar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2?section=cuenta

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → pestaña «Cuenta»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2 (ACTIVE, credencial configurada)

**RESOURCE STATE:** CUENTA ACTIVA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=cuenta&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM, MGT_PERSON_008_PENDING_ACCOUNT

**RESPONSIVE COUNTERPART:** Sección de una columna; el botón de acción queda debajo de la superficie.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (section=cuenta), StateBadge, Button variant=danger, Lock

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_005_CUENTA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Superficie «Estado de la cuenta»
- **FOCAL 2:** Botón «Deshabilitar cuenta»
- **SUPPORTING:** Credencial y última actividad
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DisableAccountButton | Button danger | Deshabilitar la cuenta con motivo |

### C01 — DisableAccountButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Deshabilitar la cuenta con motivo
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger («Deshabilitar cuenta»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=602.91 w=203.69 h=46
- CSS: width: 203.688px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 203.688px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-lock (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Deshabilitar cuenta"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Deshabilitar cuenta»

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, con icono Lock 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El botón existe sólo si la cuenta está ACTIVE; para una cuenta DISABLED aparece «Habilitar cuenta» y para una PENDING «Emitir código de activación».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 946 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferenciasestructurales.
