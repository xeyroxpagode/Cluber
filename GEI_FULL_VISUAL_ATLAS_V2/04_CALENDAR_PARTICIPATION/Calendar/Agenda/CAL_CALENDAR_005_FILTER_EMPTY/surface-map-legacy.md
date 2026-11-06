# SURFACE MAP — CAL_CALENDAR_005_FILTER_EMPTY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_CALENDAR_005_FILTER_EMPTY

**SCREEN ID:** CAL_CALENDAR_005_FILTER_EMPTY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — filtros sin resultados

**PURPOSE AS IMPLEMENTED:** Estado vacío por combinación de filtros sin coincidencias, con acción para quitar los filtros.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar?view=agenda&team=septima&type=TRAINING

**ORIGIN:** CAL_CALENDAR_001_AGENDA → filtros

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 eventos para team=septima + type=TRAINING

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&team=septima&type=TRAINING&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_006_FILTERED_MATCH

**RESPONSIVE COUNTERPART:** El estado vacío es idéntico en ambos viewports; el ancho del contenedor cambia.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar > Empty, Empty, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_005_FILTER_EMPTY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin eventos con estos filtros»
- **FOCAL 2:** Botón «Quitar filtros»
- **SUPPORTING:** Filtros activos visibles arriba
- **SECONDARY:** Encabezado del mes
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (filtrado) | Empty | Estado vacío filtrado |
| C02 | RemoveFiltersButton | Button secondary | Limpiar los filtros de la URL |

### C01 — EmptyState (filtrado)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío filtrado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=440.59 w=358 h=218.47
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×218.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin eventos con estos filtros No hay nada agendado que coincida con lo que elegi"

#### STATE

- empty (filtered)

#### INTERACTION

- trigger: click en «Quitar filtros» → query.reset(['team','type'])

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El detalle dice «No hay nada agendado que coincida con lo que elegiste.»

### C02 — RemoveFiltersButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Limpiar los filtros de la URL
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=352.59 w=125.33 h=44
- CSS: width: 125.328px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 125.328px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=79.37 · padre 358×123.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(26, 79, 160) · border: 0px solid rgb(26, 79, 160) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Quitar filtros"

#### STATE

- idle

#### INTERACTION

- trigger: click → query.reset(['team','type'])

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Aparece dos veces en el DOM cuando hay filtros: en el encabezado (action) y en el estado vacío.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1060 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición de una columna.

# CAL_CALENDAR_005_FILTER_EMPTY

**SCREEN ID:** CAL_CALENDAR_005_FILTER_EMPTY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — filtros sin resultados

**PURPOSE AS IMPLEMENTED:** Estado vacío por combinación de filtros sin coincidencias, con acción para quitar los filtros.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar?view=agenda&team=septima&type=TRAINING

**ORIGIN:** CAL_CALENDAR_001_AGENDA → filtros

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 eventos para team=septima + type=TRAINING

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&team=septima&type=TRAINING&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_006_FILTERED_MATCH

**RESPONSIVE COUNTERPART:** El estado vacío es idéntico en ambos viewports; el ancho del contenedor cambia.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar > Empty, Empty, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_005_FILTER_EMPTY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Sin eventos con estos filtros»
- **FOCAL 2:** Botón «Quitar filtros»
- **SUPPORTING:** Filtros activos visibles arriba
- **SECONDARY:** Encabezado del mes
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (filtrado) | Empty | Estado vacío filtrado |
| C02 | RemoveFiltersButton | Button secondary | Limpiar los filtros de la URL |

### C01 — EmptyState (filtrado)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío filtrado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=256 y=326.59 w=784 h=289.11
- CSS: width: 784px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 784px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 742px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 784×289.11
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sin eventos con estos filtros No hay nada agendado que coincida con lo que elegi"

#### STATE

- empty (filtered)

#### INTERACTION

- trigger: click en «Quitar filtros» → query.reset(['team','type'])

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px de ancho
- 1440: columna principal

#### IMPLEMENTATION NOTES

- El detalle dice «No hay nada agendado que coincida con lo que elegiste.»

### C02 — RemoveFiltersButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Limpiar los filtros de la URL
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=595 y=238.59 w=125.33 h=44
- CSS: width: 125.328px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 125.328px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=339 dy=27.37 · padre 1152×71.38

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(26, 79, 160) · border: 0px solid rgb(26, 79, 160) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Quitar filtros"

#### STATE

- idle

#### INTERACTION

- trigger: click → query.reset(['team','type'])

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Aparece dos veces en el DOM cuando hay filtros: en el encabezado (action) y en el estado vacío.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición de una columna.
