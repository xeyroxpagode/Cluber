# SURFACE MAP — MGT_PEOPLE_003_FILTER_EMPTY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PEOPLE_003_FILTER_EMPTY

**SCREEN ID:** MGT_PEOPLE_003_FILTER_EMPTY

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — búsqueda sin resultados

**PURPOSE AS IMPLEMENTED:** Estado vacío del listado cuando ningún nombre coincide con la búsqueda, con acción para limpiar los filtros.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people?q=zzzzz

**ORIGIN:** MGT_PEOPLE_001_LIST → buscar un nombre inexistente

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 coincidencias

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?q=zzzzz&demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_001_LIST

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PeopleManagement (rows.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_003_FILTER_EMPTY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin resultados»
- **FOCAL 2:** Botón «Quitar filtros»
- **SUPPORTING:** Detalle «Ninguna persona coincide con estos filtros.»
- **SECONDARY:** Campo de búsqueda con el término
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoPeopleResultsEmpty | Empty | Estado vacío filtrado |

### C01 — NoPeopleResultsEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío filtrado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=574.84 w=358 h=201.08
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=485.84 · padre 358×686.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin resultados Ninguna persona coincide con estos filtros. Quitar filtros"

#### STATE

- empty (filtered)

#### INTERACTION

- trigger: click en «Quitar filtros» → limpia q, team, role, account y profileStatus

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto del detalle distingue dos casos: con filtros «Ninguna persona coincide con estos filtros.»; sin filtros «Todavía no hay personas cargadas.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 888 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# MGT_PEOPLE_003_FILTER_EMPTY

**SCREEN ID:** MGT_PEOPLE_003_FILTER_EMPTY

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Personas — búsqueda sin resultados

**PURPOSE AS IMPLEMENTED:** Estado vacío del listado cuando ningún nombre coincide con la búsqueda, con acción para limpiar los filtros.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people?q=zzzzz

**ORIGIN:** MGT_PEOPLE_001_LIST → buscar un nombre inexistente

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 coincidencias

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people?q=zzzzz&demo=admin.

**RELATED SCREEN IDS:** MGT_PEOPLE_001_LIST

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** PeopleManagement (rows.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PEOPLE_003_FILTER_EMPTY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin resultados»
- **FOCAL 2:** Botón «Quitar filtros»
- **SUPPORTING:** Detalle «Ninguna persona coincide con estos filtros.»
- **SECONDARY:** Campo de búsqueda con el término
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoPeopleResultsEmpty | Empty | Estado vacío filtrado |

### C01 — NoPeopleResultsEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío filtrado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=387.47 w=1024 h=201.08
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 982px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=298.47 · padre 1024×499.55
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin resultados Ninguna persona coincide con estos filtros. Quitar filtros"

#### STATE

- empty (filtered)

#### INTERACTION

- trigger: click en «Quitar filtros» → limpia q, team, role, account y profileStatus

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto del detalle distingue dos casos: con filtros «Ninguna persona coincide con estos filtros.»; sin filtros «Todavía no hay personas cargadas.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
