# SURFACE MAP — AUTH_ACTIVATE_001_DEFAULT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# AUTH_ACTIVATE_001_DEFAULT

**SCREEN ID:** AUTH_ACTIVATE_001_DEFAULT

**DOMAIN:** 08_Auth

**SURFACE NAME:** Activar cuenta — formulario

**PURPOSE AS IMPLEMENTED:** Pantalla de activación por código, con el conteo de cuentas pendientes del club.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /activate

**ORIGIN:** URL directa (o desde el mensaje de activación)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO · 1 cuenta pendiente

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /activate?demo=coach.

**RELATED SCREEN IDS:** AUTH_ACTIVATE_002_ERROR, AUTH_ACTIVATE_003_SUCCESS, MGT_PERSON_009_CODE_MODAL

**RESPONSIVE COUNTERPART:** Contenedor max-w-md (448 px) centrado; sin cromo de la app.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ActivatePage, PageContextHeader, TextField, Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_ACTIVATE_001_DEFAULT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo «Código de activación»
- **FOCAL 2:** Botón «Activar cuenta»
- **SUPPORTING:** Encabezado «Activá tu cuenta»
- **SECONDARY:** Contador «Cuentas pendientes: 1.»
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationCodeField | TextField required | Código de activación |

### C01 — ActivationCodeField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField required
- **INSTANCE / ROLE:** Código de activación
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (código)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=430.41 w=358 h=43.69
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 358×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required, placeholder «GEI-1234»

#### INTERACTION

- trigger: escribir → estado local
- trigger: submit → activateAccount(code)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El formato del código es «GEI-» seguido de 4 dígitos, tal como lo emite issueSetupToken.
- La pantalla muestra el número de cuentas pendientes del club: en el seed hay 1 (p16).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo main que el login (max-w-md, content-center, px-4).

# AUTH_ACTIVATE_001_DEFAULT

**SCREEN ID:** AUTH_ACTIVATE_001_DEFAULT

**DOMAIN:** 08_Auth

**SURFACE NAME:** Activar cuenta — formulario

**PURPOSE AS IMPLEMENTED:** Pantalla de activación por código, con el conteo de cuentas pendientes del club.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /activate

**ORIGIN:** URL directa (o desde el mensaje de activación)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO · 1 cuenta pendiente

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /activate?demo=coach.

**RELATED SCREEN IDS:** AUTH_ACTIVATE_002_ERROR, AUTH_ACTIVATE_003_SUCCESS, MGT_PERSON_009_CODE_MODAL

**RESPONSIVE COUNTERPART:** Contenedor max-w-md (448 px) centrado; sin cromo de la app.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ActivatePage, PageContextHeader, TextField, Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_ACTIVATE_001_DEFAULT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo «Código de activación»
- **FOCAL 2:** Botón «Activar cuenta»
- **SUPPORTING:** Encabezado «Activá tu cuenta»
- **SECONDARY:** Contador «Cuentas pendientes: 1.»
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationCodeField | TextField required | Código de activación |

### C01 — ActivationCodeField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField required
- **INSTANCE / ROLE:** Código de activación
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (código)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=447.16 w=416 h=43.69
- CSS: width: 416px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 416px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 416×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required, placeholder «GEI-1234»

#### INTERACTION

- trigger: escribir → estado local
- trigger: submit → activateAccount(code)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El formato del código es «GEI-» seguido de 4 dígitos, tal como lo emite issueSetupToken.
- La pantalla muestra el número de cuentas pendientes del club: en el seed hay 1 (p16).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 900 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo main que el login (max-w-md, content-center, px-4).
