# SURFACE MAP — CAL_CALENDAR_006_FILTERED_MATCH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_CALENDAR_006_FILTERED_MATCH

**SCREEN ID:** CAL_CALENDAR_006_FILTERED_MATCH

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — filtrado por tipo Partido

**PURPOSE AS IMPLEMENTED:** Agenda con el filtro de tipo activo: la lista se reduce y el encabezado ofrece quitar los filtros.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar?view=agenda&type=MATCH

**ORIGIN:** CAL_CALENDAR_001_AGENDA → filtro Tipo

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, match-cuba, match-banco, match-septima-quinta

**RESOURCE STATE:** tipo=MATCH

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&type=MATCH&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_005_FILTER_EMPTY

**RESPONSIVE COUNTERPART:** Misma estructura; el ancho de las filas cambia.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar, Button variant=quiet

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_006_FILTERED_MATCH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de partidos filtrados
- **FOCAL 2:** Filtro de tipo con valor «Partido»
- **SUPPORTING:** Link «Quitar filtros»
- **SECONDARY:** Encabezado del mes
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AgendaList (filtrada) | ul grid | Eventos que cumplen el filtro |
| C02 | RemoveFiltersLink | Button quiet | Quitar los filtros activos |

### C01 — AgendaList (filtrada)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Eventos que cumplen el filtro
- **SOURCE COMPONENT:** Calendar > agendaList
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > agendaList
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=440.59 w=358 h=437.39
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×437.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. SIC Sexta A · GEI · Cancha de hockey Finalizado 16:00 jue, 15 oct GEI vs"

#### STATE

- 4 partidos

#### INTERACTION

- trigger: click → detalle del evento

#### MOTION

- transition-colors duration-micro por fila

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

### C02 — RemoveFiltersLink

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button quiet
- **INSTANCE / ROLE:** Quitar los filtros activos
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=quiet
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

- idle (visible sólo si hay algún filtro)

#### INTERACTION

- trigger: click → query.reset(['team','type'])

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: en línea con los selects, puede envolver
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La variante quiet no tiene caja: sólo texto interactivo.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1279 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# CAL_CALENDAR_006_FILTERED_MATCH

**SCREEN ID:** CAL_CALENDAR_006_FILTERED_MATCH

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — filtrado por tipo Partido

**PURPOSE AS IMPLEMENTED:** Agenda con el filtro de tipo activo: la lista se reduce y el encabezado ofrece quitar los filtros.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar?view=agenda&type=MATCH

**ORIGIN:** CAL_CALENDAR_001_AGENDA → filtro Tipo

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas, match-cuba, match-banco, match-septima-quinta

**RESOURCE STATE:** tipo=MATCH

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=agenda&type=MATCH&demo=coach.

**RELATED SCREEN IDS:** CAL_CALENDAR_005_FILTER_EMPTY

**RESPONSIVE COUNTERPART:** Misma estructura; el ancho de las filas cambia.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Calendar, Button variant=quiet

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_006_FILTERED_MATCH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de partidos filtrados
- **FOCAL 2:** Filtro de tipo con valor «Partido»
- **SUPPORTING:** Link «Quitar filtros»
- **SECONDARY:** Encabezado del mes
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AgendaList (filtrada) | ul grid | Eventos que cumplen el filtro |
| C02 | RemoveFiltersLink | Button quiet | Quitar los filtros activos |

### C01 — AgendaList (filtrada)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Eventos que cumplen el filtro
- **SOURCE COMPONENT:** Calendar > agendaList
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > agendaList
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=256 y=326.59 w=784 h=437.39
- CSS: width: 784px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 784px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 784px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 784×437.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. SIC Sexta A · GEI · Cancha de hockey Finalizado 16:00 jue, 15 oct GEI vs"

#### STATE

- 4 partidos

#### INTERACTION

- trigger: click → detalle del evento

#### MOTION

- transition-colors duration-micro por fila

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

### C02 — RemoveFiltersLink

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button quiet
- **INSTANCE / ROLE:** Quitar los filtros activos
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=quiet
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

- idle (visible sólo si hay algún filtro)

#### INTERACTION

- trigger: click → query.reset(['team','type'])

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: en línea con los selects, puede envolver
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La variante quiet no tiene caja: sólo texto interactivo.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
