# SURFACE MAP — MOR_PROFILE_001_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_PROFILE_001_COACH

**SCREEN ID:** MOR_PROFILE_001_COACH

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — entrenador

**PURPOSE AS IMPLEMENTED:** Perfil propio: identidad, pertenencia, roles, contacto y seguridad, con las sesiones activas y el cierre de sesión.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more/profile

**ORIGIN:** Shell → avatar (o Más → «Mi perfil»)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, sess-coach-1 (actual), sess-coach-2 (iPad)

**RESOURCE STATE:** CUENTA ACTIVA · 2 sesiones

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.

**RELATED SCREEN IDS:** MOR_PROFILE_002_ADMIN, MOR_PROFILE_003_PLAYER, GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl; el avatar grande va en el action del encabezado y en 390 cae a una fila propia.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ProfilePage, KeyValue, MetaRow, Avatar, DetailSection, Tag, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_001_COACH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y avatar del usuario
- **FOCAL 2:** Sección «Seguridad» con las sesiones activas
- **SUPPORTING:** Identidad y pertenencia
- **SECONDARY:** Roles y contacto
- **AMBIENT:** Botón «Cerrar sesión»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AvatarLarge | span rounded-pill | Inicial del usuario en el encabezado |
| C02 | IdentityKeyValue | dl con MetaRow | Datos de identidad de la cuenta propia |
| C03 | SessionCard (actual) | li con borde selected-line | Sesión abierta actual |

### C01 — AvatarLarge

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span rounded-pill
- **INSTANCE / ROLE:** Inicial del usuario en el encabezado
- **SOURCE COMPONENT:** Avatar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Avatar size=lg selected
- **PARENT:** a
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=340 y=16 w=32 h=32
- CSS: width: 32px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 32px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by a · offset dx=2 dy=2 · padre 36×36

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 999px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 11px · line-height: 14.85px · font-weight: 600

#### CONTENT

- visible: "TB"

#### STATE

- selected (bg-selected-soft con ring-inset)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 64×64 px, en x=16 y=211,22
- 1440: 64×64 px, en el action del encabezado

#### IMPLEMENTATION NOTES

- El avatar se construye con las dos primeras iniciales del nombre, en mayúsculas.

### C02 — IdentityKeyValue

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** dl con MetaRow
- **INSTANCE / ROLE:** Datos de identidad de la cuenta propia
- **SOURCE COMPONENT:** KeyValue / MetaRow
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** KeyValue / MetaRow
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=408.16 w=108.52 h=17.39
- CSS: width: 108.516px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 108.516px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=13 · padre 358×42.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Nombre de usuario"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×128,38 px; el valor se alinea a la derecha y puede envolver
- 1440: 768 px

#### IMPLEMENTATION NOTES

- MetaRow es un div flex justify-between con borde inferior border-line y padding vertical 10 px.
- El valor es un dd con text-right y font-medium.

### C03 — SessionCard (actual)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** li con borde selected-line
- **INSTANCE / ROLE:** Sesión abierta actual
- **SOURCE COMPONENT:** li + Tag
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ProfilePage > ul > li (currentSession)
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=1273.53 w=358 h=61.08
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 358×135.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 205, 236) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Chrome · Windows Esta sesión · abierta el 18 oct, 07:00 a. m. Actual"

#### STATE

- actual (border-selected-line bg-selected-soft)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho; el Tag «Actual» a la derecha
- 1440: 768 px

#### IMPLEMENTATION NOTES

- Las sesiones no actuales llevan borde border-line y fondo bg-surface, y un botón danger «Cerrar sesión».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1632 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el avatar de 64×64 (size=lg) se ubica en el action del encabezado; en 390 ese action pasa a ancho completo y el avatar queda en su propia línea (y=211,22).
- Las secciones (Identidad, Pertenencia, Roles y alcance, Contacto, Seguridad) son de una columna en ambos viewports.

# MOR_PROFILE_001_COACH

**SCREEN ID:** MOR_PROFILE_001_COACH

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — entrenador

**PURPOSE AS IMPLEMENTED:** Perfil propio: identidad, pertenencia, roles, contacto y seguridad, con las sesiones activas y el cierre de sesión.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more/profile

**ORIGIN:** Shell → avatar (o Más → «Mi perfil»)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, sess-coach-1 (actual), sess-coach-2 (iPad)

**RESOURCE STATE:** CUENTA ACTIVA · 2 sesiones

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.

**RELATED SCREEN IDS:** MOR_PROFILE_002_ADMIN, MOR_PROFILE_003_PLAYER, GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl; el avatar grande va en el action del encabezado y en 390 cae a una fila propia.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** ProfilePage, KeyValue, MetaRow, Avatar, DetailSection, Tag, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_001_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y avatar del usuario
- **FOCAL 2:** Sección «Seguridad» con las sesiones activas
- **SUPPORTING:** Identidad y pertenencia
- **SECONDARY:** Roles y contacto
- **AMBIENT:** Botón «Cerrar sesión»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AvatarLarge | span rounded-pill | Inicial del usuario en el encabezado |
| C02 | IdentityKeyValue | dl con MetaRow | Datos de identidad de la cuenta propia |
| C03 | SessionCard (actual) | li con borde selected-line | Sesión abierta actual |

### C01 — AvatarLarge

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span rounded-pill
- **INSTANCE / ROLE:** Inicial del usuario en el encabezado
- **SOURCE COMPONENT:** Avatar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Avatar size=lg selected
- **PARENT:** a
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1382 y=16 w=32 h=32
- CSS: width: 32px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 32px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by a · offset dx=2 dy=2 · padre 36×36

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 999px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 11px · line-height: 14.85px · font-weight: 600

#### CONTENT

- visible: "TB"

#### STATE

- selected (bg-selected-soft con ring-inset)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 64×64 px, en x=16 y=211,22
- 1440: 64×64 px, en el action del encabezado

#### IMPLEMENTATION NOTES

- El avatar se construye con las dos primeras iniciales del nombre, en mayúsculas.

### C02 — IdentityKeyValue

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** dl con MetaRow
- **INSTANCE / ROLE:** Datos de identidad de la cuenta propia
- **SOURCE COMPONENT:** KeyValue / MetaRow
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** KeyValue / MetaRow
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=313.53 w=108.52 h=17.39
- CSS: width: 108.516px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 108.516px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=13 · padre 768×42.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Nombre de usuario"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×128,38 px; el valor se alinea a la derecha y puede envolver
- 1440: 768 px

#### IMPLEMENTATION NOTES

- MetaRow es un div flex justify-between con borde inferior border-line y padding vertical 10 px.
- El valor es un dd con text-right y font-medium.

### C03 — SessionCard (actual)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** li con borde selected-line
- **INSTANCE / ROLE:** Sesión abierta actual
- **SOURCE COMPONENT:** li + Tag
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** ProfilePage > ul > li (currentSession)
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=1161.52 w=768 h=61.08
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 768×135.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 205, 236) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Chrome · Windows Esta sesión · abierta el 18 oct, 07:00 a. m. Actual"

#### STATE

- actual (border-selected-line bg-selected-soft)

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho; el Tag «Actual» a la derecha
- 1440: 768 px

#### IMPLEMENTATION NOTES

- Las sesiones no actuales llevan borde border-line y fondo bg-surface, y un botón danger «Cerrar sesión».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1472 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el avatar de 64×64 (size=lg) se ubica en el action del encabezado; en 390 ese action pasa a ancho completo y el avatar queda en su propia línea (y=211,22).
- Las secciones (Identidad, Pertenencia, Roles y alcance, Contacto, Seguridad) son de una columna en ambos viewports.
