# SURFACE MAP — AUTH_LOGIN_002_ERROR

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# AUTH_LOGIN_002_ERROR

**SCREEN ID:** AUTH_LOGIN_002_ERROR

**DOMAIN:** 08_Auth

**SURFACE NAME:** Acceso — credenciales rechazadas

**PURPOSE AS IMPLEMENTED:** Estado de error del login: el mensaje se muestra dentro del campo de correo y el texto del campo se limpia al editar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /login

**ORIGIN:** AUTH_LOGIN_001_DEFAULT → enviar credenciales inválidas

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** CREDENCIALES RECHAZADAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /login?demo=coach.
2. Escribir «nadie@ejemplo.com» en el correo y «incorrecta» en la contraseña.
3. Pulsar «Entrar».

**RELATED SCREEN IDS:** AUTH_LOGIN_001_DEFAULT

**RESPONSIVE COUNTERPART:** El mensaje de error ocupa 2 líneas a 390 y 1 a 1440.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** LoginPage (setError), login (store.tsx:1590), Field (error)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_LOGIN_002_ERROR_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje de error bajo el campo de correo
- **FOCAL 2:** Campos con los valores escritos
- **SUPPORTING:** Botón «Entrar»
- **SECONDARY:** Bloque de marca
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | LoginErrorMessage | p con AlertCircle | Informa que las credenciales no coinciden |

### C01 — LoginErrorMessage

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Informa que las credenciales no coinciden
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=375.72 w=358 h=34.78
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.38 · padre 358×112.16
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "No encontramos esa cuenta activa con ese correo y contraseña."

#### STATE

- error

#### INTERACTION

- se borra al modificar cualquiera de los dos campos

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×34,78 px, 2 líneas
- 1440: 448 px, 1 línea

#### IMPLEMENTATION NOTES

- El mensaje es: «No encontramos esa cuenta activa con ese correo y contraseña.»
- El input de correo pasa a border-danger con aria-invalid=true.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el texto del error es el mismo; cambia el número de líneas.

# AUTH_LOGIN_002_ERROR

**SCREEN ID:** AUTH_LOGIN_002_ERROR

**DOMAIN:** 08_Auth

**SURFACE NAME:** Acceso — credenciales rechazadas

**PURPOSE AS IMPLEMENTED:** Estado de error del login: el mensaje se muestra dentro del campo de correo y el texto del campo se limpia al editar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /login

**ORIGIN:** AUTH_LOGIN_001_DEFAULT → enviar credenciales inválidas

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** CREDENCIALES RECHAZADAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /login?demo=coach.
2. Escribir «nadie@ejemplo.com» en el correo y «incorrecta» en la contraseña.
3. Pulsar «Entrar».

**RELATED SCREEN IDS:** AUTH_LOGIN_001_DEFAULT

**RESPONSIVE COUNTERPART:** El mensaje de error ocupa 2 líneas a 390 y 1 a 1440.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/mock/store.tsx

**SOURCE SYMBOLS:** LoginPage (setError), login (store.tsx:1590), Field (error)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_LOGIN_002_ERROR_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje de error bajo el campo de correo
- **FOCAL 2:** Campos con los valores escritos
- **SUPPORTING:** Botón «Entrar»
- **SECONDARY:** Bloque de marca
- **AMBIENT:** Fondo de página

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | LoginErrorMessage | p con AlertCircle | Informa que las credenciales no coinciden |

### C01 — LoginErrorMessage

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con AlertCircle
- **INSTANCE / ROLE:** Informa que las credenciales no coinciden
- **SOURCE COMPONENT:** Field (error)
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Field > p (error)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=412.42 w=416 h=17.39
- CSS: width: 416px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 416px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 6px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.37 · padre 416×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(163, 35, 43) · border: 0px solid rgb(163, 35, 43) · border-radius: 0px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "No encontramos esa cuenta activa con ese correo y contraseña."

#### STATE

- error

#### INTERACTION

- se borra al modificar cualquiera de los dos campos

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×34,78 px, 2 líneas
- 1440: 448 px, 1 línea

#### IMPLEMENTATION NOTES

- El mensaje es: «No encontramos esa cuenta activa con ese correo y contraseña.»
- El input de correo pasa a border-danger con aria-invalid=true.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: ninguno: estas rutas están fuera del Shell
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 900 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el texto del error es el mismo; cambia el número de líneas.
