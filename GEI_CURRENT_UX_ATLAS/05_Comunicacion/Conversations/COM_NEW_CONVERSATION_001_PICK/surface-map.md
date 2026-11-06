# SURFACE MAP — COM_NEW_CONVERSATION_001_PICK

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_NEW_CONVERSATION_001_PICK

**SCREEN ID:** COM_NEW_CONVERSATION_001_PICK

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Nuevo mensaje — selección de persona

**PURPOSE AS IMPLEMENTED:** Pantalla para elegir con quién hablar. Si ya existe una conversación directa, se abre esa; si no, se navega a /conversations/new?to=…

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication/conversations/new

**ORIGIN:** Comunicación → botón «Nuevo mensaje»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-team-sexta, c-direct-vicky, p0..p17

**RESOURCE STATE:** listado completo de personas (12 filas visibles)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/conversations/new?demo=coach.

**RELATED SCREEN IDS:** COM_NEW_CONVERSATION_002_SEARCH, COM_NEW_CONVERSATION_003_NO_RESULTS, COM_CONVERSATION_003_NEW_TARGET

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px) en ambos viewports; la lista es de una columna.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** NewConversation, TextField, RowLink, Avatar, Tag

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_NEW_CONVERSATION_001_PICK_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de personas elegibles
- **FOCAL 2:** Campo «Buscar persona»
- **SUPPORTING:** Tag «Conversación existente»
- **SECONDARY:** Lead «Elegí con quién querés hablar…»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonSearchField | TextField | Filtra la lista de personas por nombre |
| C02 | PersonRow | RowLink con Avatar | Persona con la que iniciar o abrir conversación |
| C03 | ExistingConversationTag | Tag | Marca que ya existe conversación directa |

### C01 — PersonSearchField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Filtra la lista de personas por nombre
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=291.31 w=358 h=43.69
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 358×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle / vacío

#### INTERACTION

- trigger: escribir → filtra por nombre (coincidencia por substring, case-insensitive)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px; el label «Buscar persona» con la marca «opcional»
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El campo de esta pantalla no tiene id explícito: es el primer input de la página.

### C02 — PersonRow

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona con la que iniciar o abrir conversación
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NewConversation > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=379 w=358 h=81.03
- CSS: width: 358px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 358×81.03
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "VB Victoria Berg Ya tienen una conversación: se abre esa. Conversación existente"

#### STATE

- idle

#### INTERACTION

- trigger: click → si ya hay conversación directa, abre /conversations/c-direct-vicky; si no, /conversations/new?to={id}

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×81,03 px; avatar 32×32 a x=28, título a x=72
- 1440: 672 px

#### IMPLEMENTATION NOTES

- La clave de emparejamiento de una conversación existente es el par de ids ordenado y unido con «__».
- El detalle dice «Ya tienen una conversación: se abre esa.» o «Todavía no hablaron.»

### C03 — ExistingConversationTag

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca que ya existe conversación directa
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag (tone neutral)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=183.45 y=410.31 w=150.55 h=21.39
- CSS: width: 150.547px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 150.547px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 2px 8px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=3 · padre 150.55×24.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Conversación existente"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex, px-2 py-0.5
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1404 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el contenedor es max-w-2xl; a 390 el ancho útil es 358 px y a 1440 los 672 px.
- La lista se corta a 12 personas (people.slice(0, 12)).

# COM_NEW_CONVERSATION_001_PICK

**SCREEN ID:** COM_NEW_CONVERSATION_001_PICK

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Nuevo mensaje — selección de persona

**PURPOSE AS IMPLEMENTED:** Pantalla para elegir con quién hablar. Si ya existe una conversación directa, se abre esa; si no, se navega a /conversations/new?to=…

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication/conversations/new

**ORIGIN:** Comunicación → botón «Nuevo mensaje»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** c-team-sexta, c-direct-vicky, p0..p17

**RESOURCE STATE:** listado completo de personas (12 filas visibles)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/conversations/new?demo=coach.

**RELATED SCREEN IDS:** COM_NEW_CONVERSATION_002_SEARCH, COM_NEW_CONVERSATION_003_NO_RESULTS, COM_CONVERSATION_003_NEW_TARGET

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl (672 px) en ambos viewports; la lista es de una columna.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** NewConversation, TextField, RowLink, Avatar, Tag

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_NEW_CONVERSATION_001_PICK_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de personas elegibles
- **FOCAL 2:** Campo «Buscar persona»
- **SUPPORTING:** Tag «Conversación existente»
- **SECONDARY:** Lead «Elegí con quién querés hablar…»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PersonSearchField | TextField | Filtra la lista de personas por nombre |
| C02 | PersonRow | RowLink con Avatar | Persona con la que iniciar o abrir conversación |
| C03 | ExistingConversationTag | Tag | Marca que ya existe conversación directa |

### C01 — PersonSearchField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Filtra la lista de personas por nombre
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=268.81 w=672 h=43.69
- CSS: width: 672px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 672×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle / vacío

#### INTERACTION

- trigger: escribir → filtra por nombre (coincidencia por substring, case-insensitive)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px; el label «Buscar persona» con la marca «opcional»
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El campo de esta pantalla no tiene id explícito: es el primer input de la página.

### C02 — PersonRow

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona con la que iniciar o abrir conversación
- **SOURCE COMPONENT:** RowLink + Avatar
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NewConversation > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=356.5 w=672 h=63.64
- CSS: width: 672px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 672×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "VB Victoria Berg Ya tienen una conversación: se abre esa. Conversación existente"

#### STATE

- idle

#### INTERACTION

- trigger: click → si ya hay conversación directa, abre /conversations/c-direct-vicky; si no, /conversations/new?to={id}

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×81,03 px; avatar 32×32 a x=28, título a x=72
- 1440: 672 px

#### IMPLEMENTATION NOTES

- La clave de emparejamiento de una conversación existente es el par de ids ordenado y unido con «__».
- El detalle dice «Ya tienen una conversación: se abre esa.» o «Todavía no hablaron.»

### C03 — ExistingConversationTag

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca que ya existe conversación directa
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag (tone neutral)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=977.45 y=379.13 w=150.55 h=21.39
- CSS: width: 150.547px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 150.547px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 2px 8px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=3 · padre 150.55×24.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Conversación existente"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex, px-2 py-0.5
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1316 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el contenedor es max-w-2xl; a 390 el ancho útil es 358 px y a 1440 los 672 px.
- La lista se corta a 12 personas (people.slice(0, 12)).
