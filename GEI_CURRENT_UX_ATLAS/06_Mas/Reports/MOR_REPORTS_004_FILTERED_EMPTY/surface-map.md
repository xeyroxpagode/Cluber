# SURFACE MAP — MOR_REPORTS_004_FILTERED_EMPTY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_REPORTS_004_FILTERED_EMPTY

**SCREEN ID:** MOR_REPORTS_004_FILTERED_EMPTY

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — sin eventos en el período

**PURPOSE AS IMPLEMENTED:** Estado vacío del informe cuando los filtros no dejan ningún evento. El texto distingue explícitamente «cero» de «sin dato».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /reports?team=quinta&period=month

**ORIGIN:** MOR_REPORTS_001_LIST → filtros

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 eventos para los filtros aplicados

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports?team=quinta&period=month&demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_001_LIST, MOR_REPORTS_005_NO_ACCESS_ADMIN

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ReportsPage (events.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_004_FILTERED_EMPTY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin eventos en este período»
- **FOCAL 2:** Detalle «No es un error: simplemente no hay eventos que coincidan con el filtro.»
- **SUPPORTING:** Botón «Quitar filtros»
- **SECONDARY:** Filtros activos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (informes) | Empty | Estado vacío por filtros |

### C01 — EmptyState (informes)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por filtros
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=593.88 w=358 h=218.47
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=504.88 · padre 358×723.34
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin eventos en este período No es un error: simplemente no hay eventos que coinc"

#### STATE

- empty (filtered)

#### INTERACTION

- trigger: click en «Quitar filtros» → query.reset(['team','period'])

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El action sólo se renderiza si hay algún filtro activo: sin filtros, el estado vacío no ofrece acción.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 924 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# MOR_REPORTS_004_FILTERED_EMPTY

**SCREEN ID:** MOR_REPORTS_004_FILTERED_EMPTY

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — sin eventos en el período

**PURPOSE AS IMPLEMENTED:** Estado vacío del informe cuando los filtros no dejan ningún evento. El texto distingue explícitamente «cero» de «sin dato».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /reports?team=quinta&period=month

**ORIGIN:** MOR_REPORTS_001_LIST → filtros

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 eventos para los filtros aplicados

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports?team=quinta&period=month&demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_001_LIST, MOR_REPORTS_005_NO_ACCESS_ADMIN

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ReportsPage (events.length === 0) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_004_FILTERED_EMPTY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin eventos en este período»
- **FOCAL 2:** Detalle «No es un error: simplemente no hay eventos que coincidan con el filtro.»
- **SUPPORTING:** Botón «Quitar filtros»
- **SECONDARY:** Filtros activos
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (informes) | Empty | Estado vacío por filtros |

### C01 — EmptyState (informes)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por filtros
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=519.38 w=896 h=218.47
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 854px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=430.38 · padre 896×648.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin eventos en este período No es un error: simplemente no hay eventos que coinc"

#### STATE

- empty (filtered)

#### INTERACTION

- trigger: click en «Quitar filtros» → query.reset(['team','period'])

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El action sólo se renderiza si hay algún filtro activo: sin filtros, el estado vacío no ofrece acción.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
