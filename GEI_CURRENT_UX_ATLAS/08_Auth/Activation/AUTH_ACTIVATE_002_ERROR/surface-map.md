# SURFACE MAP — AUTH_ACTIVATE_002_ERROR

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# AUTH_ACTIVATE_002_ERROR

**SCREEN ID:** AUTH_ACTIVATE_002_ERROR

**DOMAIN:** 08_Auth

**SURFACE NAME:** Activar cuenta — código inválido

**PURPOSE AS IMPLEMENTED:** Estado de error de la activación: el mensaje se muestra bajo el campo y el contador de pendientes no cambia.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /activate

**ORIGIN:** AUTH_ACTIVATE_001_DEFAULT → código inexistente

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** CÓDIGO RECHAZADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /activate?demo=coach.
2. Escribir «GEI-0000» en el campo.
3. Pulsar «Activar cuenta».

**RELATED SCREEN IDS:** AUTH_ACTIVATE_001_DEFAULT, AUTH_ACTIVATE_003_SUCCESS

**RESPONSIVE COUNTERPART:** El error ocupa 1 línea en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** ActivatePage (setError), activateAccount (store.tsx:1015), Field (error)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_ACTIVATE_002_ERROR_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje de error «Ese código no sirve.»
- **FOCAL 2:** Campo con el código escrito
- **SUPPORTING:** Botón «Activar cuenta»
- **SECONDARY:** Contador de cuentas pendientes
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationErrorMessage | p con AlertCircle | Informa que el código no sirve |

### C01 — ActivationErrorMessage

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Informa que el código no sirve
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=468.41 w=358 h=17.39
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.38 · padre 358×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Ese código no sirve o ya venció."

#### STATE

- error

#### INTERACTION

- se borra al escribir en el campo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 1 línea
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El mensaje completo es «Ese código no sirve o ya venció.»
- activateAccount devuelve el error cuando no hay coincidencia, cuando el código ya se usó o cuando la cuenta no está PENDING.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# AUTH_ACTIVATE_002_ERROR

**SCREEN ID:** AUTH_ACTIVATE_002_ERROR

**DOMAIN:** 08_Auth

**SURFACE NAME:** Activar cuenta — código inválido

**PURPOSE AS IMPLEMENTED:** Estado de error de la activación: el mensaje se muestra bajo el campo y el contador de pendientes no cambia.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /activate

**ORIGIN:** AUTH_ACTIVATE_001_DEFAULT → código inexistente

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** CÓDIGO RECHAZADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /activate?demo=coach.
2. Escribir «GEI-0000» en el campo.
3. Pulsar «Activar cuenta».

**RELATED SCREEN IDS:** AUTH_ACTIVATE_001_DEFAULT, AUTH_ACTIVATE_003_SUCCESS

**RESPONSIVE COUNTERPART:** El error ocupa 1 línea en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** ActivatePage (setError), activateAccount (store.tsx:1015), Field (error)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_ACTIVATE_002_ERROR_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje de error «Ese código no sirve.»
- **FOCAL 2:** Campo con el código escrito
- **SUPPORTING:** Botón «Activar cuenta»
- **SECONDARY:** Contador de cuentas pendientes
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ActivationErrorMessage | p con AlertCircle | Informa que el código no sirve |

### C01 — ActivationErrorMessage

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Informa que el código no sirve
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=485.16 w=416 h=17.39
- CSS: width: 416px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 416px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.38 · padre 416×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Ese código no sirve o ya venció."

#### STATE

- error

#### INTERACTION

- se borra al escribir en el campo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 1 línea
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El mensaje completo es «Ese código no sirve o ya venció.»
- activateAccount devuelve el error cuando no hay coincidencia, cuando el código ya se usó o cuando la cuenta no está PENDING.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 900 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
