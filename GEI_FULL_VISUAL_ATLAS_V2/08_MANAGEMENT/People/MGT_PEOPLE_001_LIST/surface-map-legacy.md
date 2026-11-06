# SURFACE MAP — MGT_PEOPLE_001_LIST

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PEOPLE_001_LIST

**SCREEN ID:** MGT_PEOPLE_001_LIST

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — listado (ADMIN)

**PURPOSE AS IMPLEMENTED:** Listado de personas del club con búsqueda, tres filtros select y un chip de perfil incompleto. Todos los filtros viven en la URL.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people

**ORIGIN:** Administración → «Personas»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** 21 personas del seed

**RESOURCE STATE:** SIN FILTROS · 21 personas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_002_FILTER_INCOMPLETE, MGT_PEOPLE_003_FILTER_EMPTY, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** 390: los tres Select de filtro ocupan 118 / 149 / 140 px y se reparten en dos filas dentro de un flex-wrap. 1440: los tres caben en una fila.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PeopleManagement, TextField, Select, FilterChip, Surface flush, RowLink, Avatar, StateBadge, Tag

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_001_LIST_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo «Buscar» y filtros
- **FOCAL 2:** Filas de personas con su estado de cuenta
- **SUPPORTING:** Botón «Crear persona»
- **SECONDARY:** Contador «21 personas en el club»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PeopleSearchField | TextField | Búsqueda por nombre |
| C02 | IncompleteFilterChip | FilterChip | Filtro rápido de perfil incompleto |
| C03 | PersonRow (Lucía Fernández) | RowLink con Avatar | Persona con su estado de cuenta y roles |

### C01 — PeopleSearchField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Búsqueda por nombre
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (q)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=272.41 w=358 h=43.69
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

- idle / vacío

#### INTERACTION

- trigger: escribir → query.set({q}) → filtra en el momento (la URL se actualiza en cada tecla)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El filtro por nombre es una coincidencia por substring sin distinguir mayúsculas, aplicado sobre person.name.
- A diferencia de la búsqueda global, aquí el valor del campo es controlado por la URL.

### C02 — IncompleteFilterChip

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** FilterChip
- **INSTANCE / ROLE:** Filtro rápido de perfil incompleto
- **SOURCE COMPONENT:** FilterChip
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** FilterChip (profileStatus)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=164 y=442.84 w=124.5 h=36
- CSS: width: 124.5px · min-width: auto · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 124.5px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 0px 12px · min-height: 36px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=148 dy=114.75 · padre 358×150.75

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(86, 97, 111) · border: 1px solid rgb(222, 227, 234) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Perfil incompleto"

#### STATE

- inactivo (border-line bg-surface text-ink-muted)

#### INTERACTION

- trigger: click → query.set({profileStatus:'incomplete'}) y el chip pasa a activo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 124,5×36 px (gei-target-sm)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — PersonRow (Lucía Fernández)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona con su estado de cuenta y roles
- **SOURCE COMPONENT:** RowLink + Avatar + StateBadge
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** PeopleManagement > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=944.47 w=348 h=63.64
- CSS: width: 348px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 348px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 348×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "LF Lucía Fernández Jugadora · Sexta A Activo"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/people/p2

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- La meta alinea a la derecha el StateBadge de la cuenta y, si falta información, un Tag tone=attention «Perfil incompleto».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2025 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el bloque de filtros es `flex flex-wrap items-end gap-2`; los Select tienen min-w-44 / min-w-44 / min-w-40 y el chip «Perfil incompleto» 124,5×36 px.
- El contenedor de la página es max-w-5xl (1024 px) y el encabezado con filtros ocupa 389,84 px de alto a 390.

# MGT_PEOPLE_001_LIST

**SCREEN ID:** MGT_PEOPLE_001_LIST

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — listado (ADMIN)

**PURPOSE AS IMPLEMENTED:** Listado de personas del club con búsqueda, tres filtros select y un chip de perfil incompleto. Todos los filtros viven en la URL.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people

**ORIGIN:** Administración → «Personas»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** 21 personas del seed

**RESOURCE STATE:** SIN FILTROS · 21 personas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_002_FILTER_INCOMPLETE, MGT_PEOPLE_003_FILTER_EMPTY, MGT_PERSON_001_IDENTIDAD

**RESPONSIVE COUNTERPART:** 390: los tres Select de filtro ocupan 118 / 149 / 140 px y se reparten en dos filas dentro de un flex-wrap. 1440: los tres caben en una fila.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PeopleManagement, TextField, Select, FilterChip, Surface flush, RowLink, Avatar, StateBadge, Tag

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_001_LIST_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campo «Buscar» y filtros
- **FOCAL 2:** Filas de personas con su estado de cuenta
- **SUPPORTING:** Botón «Crear persona»
- **SECONDARY:** Contador «21 personas en el club»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PeopleSearchField | TextField | Búsqueda por nombre |
| C02 | IncompleteFilterChip | FilterChip | Filtro rápido de perfil incompleto |
| C03 | PersonRow (Lucía Fernández) | RowLink con Avatar | Persona con su estado de cuenta y roles |

### C01 — PeopleSearchField

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Búsqueda por nombre
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField (q)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=216.41 w=1024 h=43.69
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 1024×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle / vacío

#### INTERACTION

- trigger: escribir → query.set({q}) → filtra en el momento (la URL se actualiza en cada tecla)

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×43,69 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El filtro por nombre es una coincidencia por substring sin distinguir mayúsculas, aplicado sobre person.name.
- A diferencia de la búsqueda global, aquí el valor del campo es controlado por la URL.

### C02 — IncompleteFilterChip

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** FilterChip
- **INSTANCE / ROLE:** Filtro rápido de perfil incompleto
- **SOURCE COMPONENT:** FilterChip
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** FilterChip (profileStatus)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=751 y=307.47 w=124.5 h=36
- CSS: width: 124.5px · min-width: auto · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 124.5px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 0px 12px · min-height: 36px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=431 dy=35.38 · padre 1024×71.38

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(86, 97, 111) · border: 1px solid rgb(222, 227, 234) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Perfil incompleto"

#### STATE

- inactivo (border-line bg-surface text-ink-muted)

#### INTERACTION

- trigger: click → query.set({profileStatus:'incomplete'}) y el chip pasa a activo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 124,5×36 px (gei-target-sm)
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — PersonRow (Lucía Fernández)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** RowLink con Avatar
- **INSTANCE / ROLE:** Persona con su estado de cuenta y roles
- **SOURCE COMPONENT:** RowLink + Avatar + StateBadge
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** PeopleManagement > RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=325 y=774.31 w=1014 h=63.64
- CSS: width: 1014px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1014px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 1014×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "LF Lucía Fernández Jugadora · Sexta A Activo"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/people/p2

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- La meta alinea a la derecha el StateBadge de la cuenta y, si falta información, un Tag tone=attention «Perfil incompleto».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1807 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el bloque de filtros es `flex flex-wrap items-end gap-2`; los Select tienen min-w-44 / min-w-44 / min-w-40 y el chip «Perfil incompleto» 124,5×36 px.
- El contenedor de la página es max-w-5xl (1024 px) y el encabezado con filtros ocupa 389,84 px de alto a 390.
