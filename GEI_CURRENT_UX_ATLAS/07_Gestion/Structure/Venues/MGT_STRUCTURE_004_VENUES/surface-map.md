# SURFACE MAP — MGT_STRUCTURE_004_VENUES

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_STRUCTURE_004_VENUES

**SCREEN ID:** MGT_STRUCTURE_004_VENUES

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Sedes (pestaña vacía)

**PURPOSE AS IMPLEMENTED:** Pestaña «Sedes» de la estructura. En el estado actual no muestra ninguna sede: la estructura no contiene entradas de tipo VENUE y las sedes reales viven en un array separado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/structure?tab=VENUE

**ORIGIN:** MGT_STRUCTURE_001_SEASONS → pestaña «Sedes»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** state.venues (v1, v2, v3) — no exposedos en esta pestaña

**RESOURCE STATE:** 0 SEDES EN LA ESTRUCTURA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=VENUE&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_001_SEASONS

**RESPONSIVE COUNTERPART:** El estado vacío es de una columna en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/seed.ts

**SOURCE SYMBOLS:** StructurePage (tab VENUE), state.structure vs state.venues (seed.ts:514 y 526)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_004_VENUES_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Nada activo en esta sección»
- **FOCAL 2:** Pestaña «Sedes» con contador 0
- **SUPPORTING:** Detalle «Podés restaurar algo archivado.»
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyStructureSection | Empty | Estado vacío de la sección de sedes |

### C01 — EmptyStructureSection

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de la sección de sedes
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=293.22 w=457.16 h=143.08
- CSS: width: 457.156px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 457.156px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 415.156px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=204.22 · padre 358×347.3
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Nada activo en esta sección Podés restaurar algo archivado."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 896 px de ancho en 1440; 358 px en 390
- 1440: idéntico

#### IMPLEMENTATION NOTES

- EVIDENCIA (SOURCE-CONFIRMED): StructurePage filtra `state.structure.filter(item => item.type === tab)`. En el seed, state.structure sólo contiene SEASON, DIVISION y LINE; las tres sedes (v1, v2, v3) viven en `state.venues`, que esta pantalla no consulta.
- Consecuencia observable: el contador de la pestaña «Sedes» es 0 y el listado queda vacío; la edición de sedes (botón «Editar») y su archivado no son alcanzables desde la UI actual.
- Las sedes sí se usan en otras superficies: el select «Sede» del formulario de evento, la ficha de evento y el selector de la jornada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# MGT_STRUCTURE_004_VENUES

**SCREEN ID:** MGT_STRUCTURE_004_VENUES

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Estructura — Sedes (pestaña vacía)

**PURPOSE AS IMPLEMENTED:** Pestaña «Sedes» de la estructura. En el estado actual no muestra ninguna sede: la estructura no contiene entradas de tipo VENUE y las sedes reales viven en un array separado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/structure?tab=VENUE

**ORIGIN:** MGT_STRUCTURE_001_SEASONS → pestaña «Sedes»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** state.venues (v1, v2, v3) — no exposedos en esta pestaña

**RESOURCE STATE:** 0 SEDES EN LA ESTRUCTURA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/structure?tab=VENUE&demo=admin.

**RELATED SCREEN IDS:** MGT_STRUCTURE_001_SEASONS

**RESPONSIVE COUNTERPART:** El estado vacío es de una columna en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/mock/seed.ts

**SOURCE SYMBOLS:** StructurePage (tab VENUE), state.structure vs state.venues (seed.ts:514 y 526)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_STRUCTURE_004_VENUES_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Nada activo en esta sección»
- **FOCAL 2:** Pestaña «Sedes» con contador 0
- **SUPPORTING:** Detalle «Podés restaurar algo archivado.»
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyStructureSection | Empty | Estado vacío de la sección de sedes |

### C01 — EmptyStructureSection

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de la sección de sedes
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=270.72 w=896 h=143.08
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 854px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=181.72 · padre 896×324.8
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Nada activo en esta sección Podés restaurar algo archivado."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 896 px de ancho en 1440; 358 px en 390
- 1440: idéntico

#### IMPLEMENTATION NOTES

- EVIDENCIA (SOURCE-CONFIRMED): StructurePage filtra `state.structure.filter(item => item.type === tab)`. En el seed, state.structure sólo contiene SEASON, DIVISION y LINE; las tres sedes (v1, v2, v3) viven en `state.venues`, que esta pantalla no consulta.
- Consecuencia observable: el contador de la pestaña «Sedes» es 0 y el listado queda vacío; la edición de sedes (botón «Editar») y su archivado no son alcanzables desde la UI actual.
- Las sedes sí se usan en otras superficies: el select «Sede» del formulario de evento, la ficha de evento y el selector de la jornada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
