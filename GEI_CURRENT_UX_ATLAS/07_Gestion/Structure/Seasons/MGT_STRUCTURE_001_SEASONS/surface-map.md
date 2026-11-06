# SURFACE MAP — MGT_STRUCTURE_001_SEASONS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_STRUCTURE_001_SEASONS

**SCREEN ID:** MGT_STRUCTURE_001_SEASONS

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Temporadas

**PURPOSE AS IMPLEMENTED:** Estructura del club con pestañas por tipo (Temporadas / Divisiones / Líneas / Sedes) y acciones de archivar y restaurar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/structure?tab=SEASON

**ORIGIN:** Administración → «Estructura del club»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** s1 (2026), s2 (2025)

**RESOURCE STATE:** 2 TEMPORADAS ACTIVAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=SEASON&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_002_DIVISIONS, MGT_STRUCTURE_003_LINES, MGT_STRUCTURE_004_VENUES

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; la fila de pestañas y las filas de la lista son de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** StructurePage, TabBar, Surface flush, RowStatic, Button variant=danger, setStructureArchived

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_001_SEASONS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Pestañas de tipo de estructura con contadores
- **FOCAL 2:** Filas de la temporada con su acción «Archivar»
- **SUPPORTING:** Título «Estructura del club»
- **SECONDARY:** Sección «Archivados» (vacía aquí)
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StructureTabBar | div[role=tablist] con 4 pestañas | Tipos de estructura con su contador de activos |
| C02 | StructureRow (2026) | RowStatic con botón «Archivar» | Elemento de estructura con su acción de archivar |

### C01 — StructureTabBar

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 4 pestañas
- **INSTANCE / ROLE:** Tipos de estructura con su contador de activos
- **SOURCE COMPONENT:** TabBar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TabBar (estructura)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=12 y=211.22 w=465.16 h=37
- CSS: width: 465.156px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 465.156px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px 4px 1px · margin: 0px -4px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-4 dy=0 · padre 457.16×38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Temporadas 2 Divisiones 4 Líneas 3 Sedes 0"

#### STATE

- «Temporadas» activa

#### INTERACTION

- trigger: click en una pestaña → query.set({tab})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 465,16 px con scroll horizontal; pestañas de 135,09 / 121,41 / 95,3 / 93,36 px
- 1440: las cuatro pestañas caben completas

#### IMPLEMENTATION NOTES

- El contador de cada pestaña cuenta los elementos activos de ese tipo.
- El contador de «Sedes» es 0 porque state.structure no contiene entradas de tipo VENUE (las sedes viven en state.venues).

### C02 — StructureRow (2026)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowStatic con botón «Archivar»
- **INSTANCE / ROLE:** Elemento de estructura con su acción de archivar
- **SOURCE COMPONENT:** RowStatic + Button
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** StructurePage > RowStatic (active)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=293.22 w=457.16 h=146
- CSS: width: 457.156px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 457.156px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=204.22 · padre 358×350.22
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "2026 4 equipos lo usan Archivar 2025 Archivar"

#### STATE

- activo

#### INTERACTION

- trigger: click en «Archivar» → abre el ConfirmDialog de archivado

#### MOTION

- transition-colors duration-micro en el botón

#### RESPONSIVE

- 390: 447,16×68 px dentro del Surface flush
- 1440: idéntico, con la lista a 896 px

#### IMPLEMENTATION NOTES

- El detalle de una temporada cuenta los equipos que la usan: «4 equipos lo usan».
- El botón «Archivar» es danger y por persona.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la fila de pestañas mide 465,16 px a 390 (con scroll horizontal) y las cuatro caben en 1440.
- La lista usa Surface flush con la lista en px-1 py-1.

# MGT_STRUCTURE_001_SEASONS

**SCREEN ID:** MGT_STRUCTURE_001_SEASONS

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Temporadas

**PURPOSE AS IMPLEMENTED:** Estructura del club con pestañas por tipo (Temporadas / Divisiones / Líneas / Sedes) y acciones de archivar y restaurar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/structure?tab=SEASON

**ORIGIN:** Administración → «Estructura del club»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** s1 (2026), s2 (2025)

**RESOURCE STATE:** 2 TEMPORADAS ACTIVAS

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=SEASON&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_002_DIVISIONS, MGT_STRUCTURE_003_LINES, MGT_STRUCTURE_004_VENUES

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; la fila de pestañas y las filas de la lista son de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** StructurePage, TabBar, Surface flush, RowStatic, Button variant=danger, setStructureArchived

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_001_SEASONS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Pestañas de tipo de estructura con contadores
- **FOCAL 2:** Filas de la temporada con su acción «Archivar»
- **SUPPORTING:** Título «Estructura del club»
- **SECONDARY:** Sección «Archivados» (vacía aquí)
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StructureTabBar | div[role=tablist] con 4 pestañas | Tipos de estructura con su contador de activos |
| C02 | StructureRow (2026) | RowStatic con botón «Archivar» | Elemento de estructura con su acción de archivar |

### C01 — StructureTabBar

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 4 pestañas
- **INSTANCE / ROLE:** Tipos de estructura con su contador de activos
- **SOURCE COMPONENT:** TabBar
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TabBar (estructura)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=380 y=188.72 w=904 h=37
- CSS: width: 904px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 904px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px 4px 1px · margin: 0px -4px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=-4 dy=0 · padre 896×38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Temporadas 2 Divisiones 4 Líneas 3 Sedes 0"

#### STATE

- «Temporadas» activa

#### INTERACTION

- trigger: click en una pestaña → query.set({tab})

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 465,16 px con scroll horizontal; pestañas de 135,09 / 121,41 / 95,3 / 93,36 px
- 1440: las cuatro pestañas caben completas

#### IMPLEMENTATION NOTES

- El contador de cada pestaña cuenta los elementos activos de ese tipo.
- El contador de «Sedes» es 0 porque state.structure no contiene entradas de tipo VENUE (las sedes viven en state.venues).

### C02 — StructureRow (2026)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowStatic con botón «Archivar»
- **INSTANCE / ROLE:** Elemento de estructura con su acción de archivar
- **SOURCE COMPONENT:** RowStatic + Button
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** StructurePage > RowStatic (active)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=270.72 w=896 h=146
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=181.72 · padre 896×327.72
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "2026 4 equipos lo usan Archivar 2025 Archivar"

#### STATE

- activo

#### INTERACTION

- trigger: click en «Archivar» → abre el ConfirmDialog de archivado

#### MOTION

- transition-colors duration-micro en el botón

#### RESPONSIVE

- 390: 447,16×68 px dentro del Surface flush
- 1440: idéntico, con la lista a 896 px

#### IMPLEMENTATION NOTES

- El detalle de una temporada cuenta los equipos que la usan: «4 equipos lo usan».
- El botón «Archivar» es danger y por persona.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la fila de pestañas mide 465,16 px a 390 (con scroll horizontal) y las cuatro caben en 1440.
- La lista usa Surface flush con la lista en px-1 py-1.
