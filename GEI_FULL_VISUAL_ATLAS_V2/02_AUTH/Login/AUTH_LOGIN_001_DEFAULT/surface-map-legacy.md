# SURFACE MAP — AUTH_LOGIN_001_DEFAULT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# AUTH_LOGIN_001_DEFAULT

**SCREEN ID:** AUTH_LOGIN_001_DEFAULT

**DOMAIN:** 08_Auth

**SURFACE NAME:** Acceso — formulario de login

**PURPOSE AS IMPLEMENTED:** Pantalla de acceso con correo y contraseña. Vive fuera del Shell: no hay barra superior ni barra de destinos.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /login

**ORIGIN:** Shell → cerrar sesión (o URL directa)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /login?demo=coach.

**RELATED SCREEN IDS:** AUTH_LOGIN_002_ERROR, AUTH_ACTIVATE_001_DEFAULT

**RESPONSIVE COUNTERPART:** 390: el bloque de marca + formulario mide 358 px y se centra verticalmente con content-center. 1440: el contenedor se limita a max-w-md (448 px) y queda centrado en la pantalla.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** LoginPage, TextField, Button variant=primary, Avatar (span de marca)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_LOGIN_001_DEFAULT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque de marca «GEI Hockey»
- **FOCAL 2:** Campos «Correo electrónico» y «Contraseña»
- **SUPPORTING:** Botón «Entrar»
- **SECONDARY:** Texto de ayuda sobre la activación
- **AMBIENT:** Fondo de página #f4f6f9

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | BrandBlock | div flex con cuadrado + textos | Identidad del club |
| C02 | EmailTextField | TextField type=email required | Correo de acceso |
| C03 | LoginSubmitButton | Button primary type=submit | Entrar |

### C01 — BrandBlock

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div flex con cuadrado + textos
- **INSTANCE / ROLE:** Identidad del club
- **SOURCE COMPONENT:** LoginPage (JSX directo, no el primitive Avatar)
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** LoginPage > div.flex.items-center.gap-3
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=241.53 w=44 h=44
- CSS: width: 44px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 44px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=1.5 · padre 358×47.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(18, 56, 111) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 44×44 px en x=16, y=232,83; los textos a x=72
- 1440: idéntico, dentro del bloque centrado de 448 px

#### IMPLEMENTATION NOTES

- El cuadrado de marca es un span flex size-11 con bg-brand (#12386f) y texto blanco, con la cadena «GEI».
- Debajo van el nombre «GEI Hockey» (gei-page-title) y «Gimnasia y Esgrima de Ituzaingó» (gei-meta).

### C02 — EmailTextField

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextField type=email required
- **INSTANCE / ROLE:** Correo de acceso
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (email)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=358.13 w=358 h=43.69
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 358×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required, placeholder «nombre@ejemplo.com»

#### INTERACTION

- trigger: escribir → estado local
- trigger: submit → login(email, password); si falla, el error aparece en este campo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El hint dice «Es el correo que el club registró para vos.»
- El error de autenticación se pinta en este campo, no en un banner separado.

### C03 — LoginSubmitButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button primary type=submit
- **INSTANCE / ROLE:** Entrar
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary type=submit («Entrar»)
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=505.19 w=358 h=44
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=0 dy=198.14 · padre 358×242.14
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Entrar"

#### STATE

- idle

#### INTERACTION

- trigger: click → submit del form → login() y navegación a /home

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: 358×44 px, ancho completo
- 1440: 448 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página (main con min-h-dvh y content-center)
- what remains sticky/fixed: ninguno
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el main usa `mx-auto grid min-h-dvh max-w-md content-center gap-5 px-4`; el ancho del contenido es 358 px a 390 y 448 px a 1440.
- El bloque de marca es un flex con el cuadrado GEI de 44×44 y los dos textos de identificación del club.

# AUTH_LOGIN_001_DEFAULT

**SCREEN ID:** AUTH_LOGIN_001_DEFAULT

**DOMAIN:** 08_Auth

**SURFACE NAME:** Acceso — formulario de login

**PURPOSE AS IMPLEMENTED:** Pantalla de acceso con correo y contraseña. Vive fuera del Shell: no hay barra superior ni barra de destinos.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /login

**ORIGIN:** Shell → cerrar sesión (o URL directa)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /login?demo=coach.

**RELATED SCREEN IDS:** AUTH_LOGIN_002_ERROR, AUTH_ACTIVATE_001_DEFAULT

**RESPONSIVE COUNTERPART:** 390: el bloque de marca + formulario mide 358 px y se centra verticalmente con content-center. 1440: el contenedor se limita a max-w-md (448 px) y queda centrado en la pantalla.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** LoginPage, TextField, Button variant=primary, Avatar (span de marca)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `AUTH_LOGIN_001_DEFAULT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque de marca «GEI Hockey»
- **FOCAL 2:** Campos «Correo electrónico» y «Contraseña»
- **SUPPORTING:** Botón «Entrar»
- **SECONDARY:** Texto de ayuda sobre la activación
- **AMBIENT:** Fondo de página #f4f6f9

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | BrandBlock | div flex con cuadrado + textos | Identidad del club |
| C02 | EmailTextField | TextField type=email required | Correo de acceso |
| C03 | LoginSubmitButton | Button primary type=submit | Entrar |

### C01 — BrandBlock

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div flex con cuadrado + textos
- **INSTANCE / ROLE:** Identidad del club
- **SOURCE COMPONENT:** LoginPage (JSX directo, no el primitive Avatar)
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** LoginPage > div.flex.items-center.gap-3
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=269.53 w=44 h=44
- CSS: width: 44px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 44px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=1.5 · padre 416×47.02
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(18, 56, 111) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 44×44 px en x=16, y=232,83; los textos a x=72
- 1440: idéntico, dentro del bloque centrado de 448 px

#### IMPLEMENTATION NOTES

- El cuadrado de marca es un span flex size-11 con bg-brand (#12386f) y texto blanco, con la cadena «GEI».
- Debajo van el nombre «GEI Hockey» (gei-page-title) y «Gimnasia y Esgrima de Ituzaingó» (gei-meta).

### C02 — EmailTextField

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextField type=email required
- **INSTANCE / ROLE:** Correo de acceso
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (email)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=386.13 w=416 h=43.69
- CSS: width: 416px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 416px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 416×94.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required, placeholder «nombre@ejemplo.com»

#### INTERACTION

- trigger: escribir → estado local
- trigger: submit → login(email, password); si falla, el error aparece en este campo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 448 px

#### IMPLEMENTATION NOTES

- El hint dice «Es el correo que el club registró para vos.»
- El error de autenticación se pinta en este campo, no en un banner separado.

### C03 — LoginSubmitButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button primary type=submit
- **INSTANCE / ROLE:** Entrar
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary type=submit («Entrar»)
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=512 y=533.19 w=416 h=44
- CSS: width: 416px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 416px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=0 dy=198.14 · padre 416×242.14
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Entrar"

#### STATE

- idle

#### INTERACTION

- trigger: click → submit del form → login() y navegación a /home

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: 358×44 px, ancho completo
- 1440: 448 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página (main con min-h-dvh y content-center)
- what remains sticky/fixed: ninguno
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 900 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el main usa `mx-auto grid min-h-dvh max-w-md content-center gap-5 px-4`; el ancho del contenido es 358 px a 390 y 448 px a 1440.
- El bloque de marca es un flex con el cuadrado GEI de 44×44 y los dos textos de identificación del club.
