# SURFACE MAP — AUTH_ACTIVATE_003_SUCCESS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# AUTH_ACTIVATE_003_SUCCESS

**SCREEN ID:** AUTH_ACTIVATE_003_SUCCESS

**DOMAIN:** 08_Auth

**SURFACE NAME:** Activar cuenta — cuenta activada

**PURPOSE AS IMPLEMENTED:** Estado de éxito de la activación: un banner de confirmación, el botón «Ir al inicio» y el contador de pendientes en cero.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /activate

**ORIGIN:** MGT_PERSON_009_CODE_MODAL → emitir código → navegar a /activate → introducir el código

**ACTOR:** ADMIN (emite el código) / PLAYER (la persona de la cuenta)

**RESOURCE / FIXTURE IDS:** p16, setupToken emitido en runtime

**RESOURCE STATE:** CUENTA ACTIVADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?section=cuenta&demo=admin.
2. Pulsar «Emitir código de activación».
3. Pulsar «Emitir código» en el modal.
4. Navegar a /activate conservando la sesión del navegador.
5. Escribir el código emitido.
6. Pulsar «Activar cuenta».

**RELATED SCREEN IDS:** MGT_PERSON_009_CODE_MODAL, AUTH_ACTIVATE_002_ERROR

**RESPONSIVE COUNTERPART:** El banner de éxito ocupa 1 línea a 390 y 1440; el botón «Ir al inicio» ocupa el ancho completo.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** ActivatePage (ok state), Banner tone=success, activateAccount (store.tsx:1015)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_ACTIVATE_003_SUCCESS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Cuenta activada»
- **FOCAL 2:** Botón «Ir al inicio»
- **SUPPORTING:** Texto «Ya podés entrar con tu correo electrónico.»
- **SECONDARY:** Contador «Cuentas pendientes: 0.»
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationSuccessBanner | Banner tone=success | Confirma la activación |

### C01 — ActivationSuccessBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Confirma la activación
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success
- **PARENT:** main
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=394.72 w=358 h=81.38
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by main · offset dx=16 dy=394.72 · padre 390×844

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cuenta activada Ya podés entrar con tu correo electrónico."

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×69,39 px; el texto del cuerpo ocupa 1 línea
- 1440: 448 px

#### IMPLEMENTATION NOTES

- Tras la activación el formulario se desmonta y aparece sólo el banner, el botón «Ir al inicio» y el contador de cuentas pendientes.
- activateAccount además crea la pertenencia de la persona y marca la cuenta como activa con credencial configurada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# AUTH_ACTIVATE_003_SUCCESS

**SCREEN ID:** AUTH_ACTIVATE_003_SUCCESS

**DOMAIN:** 08_Auth

**SURFACE NAME:** Activar cuenta — cuenta activada

**PURPOSE AS IMPLEMENTED:** Estado de éxito de la activación: un banner de confirmación, el botón «Ir al inicio» y el contador de pendientes en cero.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /activate

**ORIGIN:** MGT_PERSON_009_CODE_MODAL → emitir código → navegar a /activate → introducir el código

**ACTOR:** ADMIN (emite el código) / PLAYER (la persona de la cuenta)

**RESOURCE / FIXTURE IDS:** p16, setupToken emitido en runtime

**RESOURCE STATE:** CUENTA ACTIVADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p16?section=cuenta&demo=admin.
2. Pulsar «Emitir código de activación».
3. Pulsar «Emitir código» en el modal.
4. Navegar a /activate conservando la sesión del navegador.
5. Escribir el código emitido.
6. Pulsar «Activar cuenta».

**RELATED SCREEN IDS:** MGT_PERSON_009_CODE_MODAL, AUTH_ACTIVATE_002_ERROR

**RESPONSIVE COUNTERPART:** El banner de éxito ocupa 1 línea a 390 y 1440; el botón «Ir al inicio» ocupa el ancho completo.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** ActivatePage (ok state), Banner tone=success, activateAccount (store.tsx:1015)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_ACTIVATE_003_SUCCESS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Cuenta activada»
- **FOCAL 2:** Botón «Ir al inicio»
- **SUPPORTING:** Texto «Ya podés entrar con tu correo electrónico.»
- **SECONDARY:** Contador «Cuentas pendientes: 0.»
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationSuccessBanner | Banner tone=success | Confirma la activación |

### C01 — ActivationSuccessBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Confirma la activación
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success
- **PARENT:** main
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=411.47 w=416 h=81.38
- CSS: width: 416px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 416px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by main · offset dx=16 dy=411.47 · padre 448×900

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cuenta activada Ya podés entrar con tu correo electrónico."

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×69,39 px; el texto del cuerpo ocupa 1 línea
- 1440: 448 px

#### IMPLEMENTATION NOTES

- Tras la activación el formulario se desmonta y aparece sólo el banner, el botón «Ir al inicio» y el contador de cuentas pendientes.
- activateAccount además crea la pertenencia de la persona y marca la cuenta como activa con credencial configurada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 900 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
