# SURFACE MAP — MGT_PEOPLE_002_FILTER_INCOMPLETE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PEOPLE_002_FILTER_INCOMPLETE

**SCREEN ID:** MGT_PEOPLE_002_FILTER_INCOMPLETE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — filtro de perfil incompleto

**PURPOSE AS IMPLEMENTED:** Listado filtrado por el chip de perfil incompleto. El chip queda activo y aparece el botón «Quitar filtros».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people?profileStatus=incomplete

**ORIGIN:** MGT_PEOPLE_001_LIST → chip «Perfil incompleto»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p17 (Florencia Vidal)

**RESOURCE STATE:** 1 persona incompleta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?profileStatus=incomplete&demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_001_LIST, MGT_PERSON_007_INCOMPLETE

**RESPONSIVE COUNTERPART:** Misma composición; el chip pasa a estado activo.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PeopleManagement (filter profileStatus), FilterChip

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_002_FILTER_INCOMPLETE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Chip «Perfil incompleto» activo
- **FOCAL 2:** Fila de la persona incompleta con su Tag de atención
- **SUPPORTING:** Contador «1 persona con estos filtros»
- **SECONDARY:** Botón «Quitar filtros»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IncompleteFilterChip (activo) | FilterChip | Filtro aplicado |

### C01 — IncompleteFilterChip (activo)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** FilterChip
- **INSTANCE / ROLE:** Filtro aplicado
- **SOURCE COMPONENT:** FilterChip
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** FilterChip (active)
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

- contained-by div · offset dx=148 dy=114.75 · padre 358×202.75

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 1px solid rgb(185, 205, 236) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Perfil incompleto"

#### STATE

- activo (border-selected-line bg-selected-soft text-selected)

#### INTERACTION

- trigger: click → desactiva el filtro

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 124,5×36 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_PEOPLE_002_FILTER_INCOMPLETE

**SCREEN ID:** MGT_PEOPLE_002_FILTER_INCOMPLETE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — filtro de perfil incompleto

**PURPOSE AS IMPLEMENTED:** Listado filtrado por el chip de perfil incompleto. El chip queda activo y aparece el botón «Quitar filtros».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people?profileStatus=incomplete

**ORIGIN:** MGT_PEOPLE_001_LIST → chip «Perfil incompleto»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p17 (Florencia Vidal)

**RESOURCE STATE:** 1 persona incompleta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?profileStatus=incomplete&demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_001_LIST, MGT_PERSON_007_INCOMPLETE

**RESPONSIVE COUNTERPART:** Misma composición; el chip pasa a estado activo.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PeopleManagement (filter profileStatus), FilterChip

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_002_FILTER_INCOMPLETE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Chip «Perfil incompleto» activo
- **FOCAL 2:** Fila de la persona incompleta con su Tag de atención
- **SUPPORTING:** Contador «1 persona con estos filtros»
- **SECONDARY:** Botón «Quitar filtros»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | IncompleteFilterChip (activo) | FilterChip | Filtro aplicado |

### C01 — IncompleteFilterChip (activo)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** FilterChip
- **INSTANCE / ROLE:** Filtro aplicado
- **SOURCE COMPONENT:** FilterChip
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** FilterChip (active)
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

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 1px solid rgb(185, 205, 236) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Perfil incompleto"

#### STATE

- activo (border-selected-line bg-selected-soft text-selected)

#### INTERACTION

- trigger: click → desactiva el filtro

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 124,5×36 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
