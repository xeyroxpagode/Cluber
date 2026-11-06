# SURFACE MAP — CAL_JORNADA_002_NEW

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_JORNADA_002_NEW

**SCREEN ID:** CAL_JORNADA_002_NEW

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — alta

**PURPOSE AS IMPLEMENTED:** Formulario de alta de jornada: nombre, temporada, competencia opcional y selección de partidos candidatos.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /jornadas/new

**ORIGIN:** Calendario → botón «Nueva jornada» (visible para quien puedeCreateEvent)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** temporadas s1/s2, ahba, copa-gei

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/new?demo=coach.

**RELATED SCREEN IDS:** CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** Las listas de candidatos se muestran en una columna en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** JornadaPage > JornadaCreate, TextField, Select, SectionHeader, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_002_NEW_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Nueva jornada» y lead
- **FOCAL 2:** Lista de partidos candidatos
- **SUPPORTING:** Campos de nombre, temporada y competencia
- **SECONDARY:** Botones Cancelar / Crear jornada
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SeasonSelect | Select | Temporada de la jornada |
| C02 | CandidateMatchesList | ul con labels y checkboxes | Partidos de la temporada que todavía no están en una jornada |

### C01 — SeasonSelect

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Select
- **INSTANCE / ROLE:** Temporada de la jornada
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select (id=jn-seasonId)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=419.08 w=324 h=43.69
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 324×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "2026 2025"

#### STATE

- value s1 (2026)

#### INTERACTION

- trigger: change → limpia la selección de partidos

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — CandidateMatchesList

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** ul con labels y checkboxes
- **INSTANCE / ROLE:** Partidos de la temporada que todavía no están en una jornada
- **SOURCE COMPONENT:** JornadaCreate > ul > li > label
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** JornadaCreate > candidates.map
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=660.78 w=324 h=227
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=50.25 · padre 358×294.25

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. Lomas miércoles, 21 de octubre de 2026 · 17:00 GEI vs. SIC jueves, 15 de"

#### STATE

- 0 de N seleccionados

#### INTERACTION

- trigger: click en el checkbox → agrega/saca el partido de la jornada

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada fila: label flex min-h-14 con checkbox 20×20 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El contador del encabezado de sección es «0 de {candidates.length} disponibles».
- El filtro de candidatos excluye los partidos ya asignados a alguna jornada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1081 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: contenedor max-w-3xl en ambos.

# CAL_JORNADA_002_NEW

**SCREEN ID:** CAL_JORNADA_002_NEW

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — alta

**PURPOSE AS IMPLEMENTED:** Formulario de alta de jornada: nombre, temporada, competencia opcional y selección de partidos candidatos.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /jornadas/new

**ORIGIN:** Calendario → botón «Nueva jornada» (visible para quien puedeCreateEvent)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** temporadas s1/s2, ahba, copa-gei

**RESOURCE STATE:** FORMULARIO VACÍO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/new?demo=coach.

**RELATED SCREEN IDS:** CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** Las listas de candidatos se muestran en una columna en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** JornadaPage > JornadaCreate, TextField, Select, SectionHeader, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_002_NEW_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Nueva jornada» y lead
- **FOCAL 2:** Lista de partidos candidatos
- **SUPPORTING:** Campos de nombre, temporada y competencia
- **SECONDARY:** Botones Cancelar / Crear jornada
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SeasonSelect | Select | Temporada de la jornada |
| C02 | CandidateMatchesList | ul con labels y checkboxes | Partidos de la temporada que todavía no están en una jornada |

### C01 — SeasonSelect

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Select
- **INSTANCE / ROLE:** Temporada de la jornada
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select (id=jn-seasonId)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=400.58 w=726 h=43.69
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 726×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "2026 2025"

#### STATE

- value s1 (2026)

#### INTERACTION

- trigger: change → limpia la selección de partidos

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×43,69 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — CandidateMatchesList

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** ul con labels y checkboxes
- **INSTANCE / ROLE:** Partidos de la temporada que todavía no están en una jornada
- **SOURCE COMPONENT:** JornadaCreate > ul > li > label
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** JornadaCreate > candidates.map
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=650.28 w=726 h=227
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=54.25 · padre 768×302.25

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. Lomas miércoles, 21 de octubre de 2026 · 17:00 GEI vs. SIC jueves, 15 de"

#### STATE

- 0 de N seleccionados

#### INTERACTION

- trigger: click en el checkbox → agrega/saca el partido de la jornada

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada fila: label flex min-h-14 con checkbox 20×20 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El contador del encabezado de sección es «0 de {candidates.length} disponibles».
- El filtro de candidatos excluye los partidos ya asignados a alguna jornada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1026 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: contenedor max-w-3xl en ambos.
