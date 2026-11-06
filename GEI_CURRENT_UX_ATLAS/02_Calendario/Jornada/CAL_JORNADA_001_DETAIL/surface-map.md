# SURFACE MAP — CAL_JORNADA_001_DETAIL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_JORNADA_001_DETAIL

**SCREEN ID:** CAL_JORNADA_001_DETAIL

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — detalle

**PURPOSE AS IMPLEMENTED:** Detalle de una jornada: contexto (temporada y competencia), partidos de la jornada y un formulario de organización conjunta.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /jornadas/j1

**ORIGIN:** Más → sección «Jornadas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** j1, match-cuba, ahba

**RESOURCE STATE:** jornada con 1 partido · editable por el entrenador

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/j1?demo=coach.

**RELATED SCREEN IDS:** CAL_JORNADA_002_NEW, CAL_JORNADA_003_READ_ONLY, CAL_JORNADA_004_IMPACT_MODAL

**RESPONSIVE COUNTERPART:** 390: los campos de encuentro y salida se apilan; 1440: comparten una fila de 2 columnas.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** JornadaPage > JornadaDetail, DetailSection, Select, TextField, ImpactPreview

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_001_DETAIL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la jornada y su lead
- **FOCAL 2:** Sección «Organización de toda la jornada»
- **SUPPORTING:** Contexto (temporada, competencia) y partidos
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader de la jornada | header grid con back | Nombre de la jornada y explicación según autoridad |
| C02 | BulkOrganizationSurface | Surface grid gap-4 | Sede, encuentro, salida y punto de encuentro de toda la jornada |
| C03 | MatchesList | DetailSection con RowLink | Partidos que agrupa la jornada |

### C01 — PageContextHeader de la jornada

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Nombre de la jornada y explicación según autoridad
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=65
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×1208.3
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Jornadas TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /calendar

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: columna única
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — BulkOrganizationSurface

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface grid gap-4
- **INSTANCE / ROLE:** Sede, encuentro, salida y punto de encuentro de toda la jornada
- **SOURCE COMPONENT:** Surface + Select + TextField
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** JornadaDetail > Surface (canManage)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=631.55 w=358 h=464.75
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · gap: 16px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=542.55 · padre 358×1007.3
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Organización de toda la jornada Sede de la jornada OPCIONAL GEI · Cancha de hock"

#### STATE

- sin cambios (bulkChanged = false)

#### INTERACTION

- trigger: change de la sede o de las horas → bulkChanged = true y aparece el ImpactPreview
- trigger: click en «Guardar jornada» → updateJornada y abre el modal de impacto

#### MOTION

- transition-colors duration-micro en los controles

#### RESPONSIVE

- 390: campos apilados
- 1440: campos de hora en 2 columnas

#### IMPLEMENTATION NOTES

- El botón «Guardar jornada» está disabled mientras no haya cambios (disabled={!bulkChanged}).
- La autoridad de edición se calcula con authority.coachTeamIds: el entrenador de algún equipo de la jornada puede organizarla.

### C03 — MatchesList

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** DetailSection con RowLink
- **INSTANCE / ROLE:** Partidos que agrupa la jornada
- **SOURCE COMPONENT:** DetailSection + RowLink
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=490.66 w=177.27 h=21.25
- CSS: width: 177.266px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 177.266px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 177.27×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Partidos de la jornada"

#### STATE

- 1 partido

#### INTERACTION

- trigger: click → /events/match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1208 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: contenedor max-w-3xl en ambos.

# CAL_JORNADA_001_DETAIL

**SCREEN ID:** CAL_JORNADA_001_DETAIL

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — detalle

**PURPOSE AS IMPLEMENTED:** Detalle de una jornada: contexto (temporada y competencia), partidos de la jornada y un formulario de organización conjunta.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /jornadas/j1

**ORIGIN:** Más → sección «Jornadas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** j1, match-cuba, ahba

**RESOURCE STATE:** jornada con 1 partido · editable por el entrenador

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/j1?demo=coach.

**RELATED SCREEN IDS:** CAL_JORNADA_002_NEW, CAL_JORNADA_003_READ_ONLY, CAL_JORNADA_004_IMPACT_MODAL

**RESPONSIVE COUNTERPART:** 390: los campos de encuentro y salida se apilan; 1440: comparten una fila de 2 columnas.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** JornadaPage > JornadaDetail, DetailSection, Select, TextField, ImpactPreview

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_001_DETAIL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la jornada y su lead
- **FOCAL 2:** Sección «Organización de toda la jornada»
- **SUPPORTING:** Contexto (temporada, competencia) y partidos
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader de la jornada | header grid con back | Nombre de la jornada y explicación según autoridad |
| C02 | BulkOrganizationSurface | Surface grid gap-4 | Sede, encuentro, salida y punto de encuentro de toda la jornada |
| C03 | MatchesList | DetailSection con RowLink | Partidos que agrupa la jornada |

### C01 — PageContextHeader de la jornada

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Nombre de la jornada y explicación según autoridad
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=65
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×1058.42
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Jornadas Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /calendar

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: columna única
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — BulkOrganizationSurface

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface grid gap-4
- **INSTANCE / ROLE:** Sede, encuentro, salida y punto de encuentro de toda la jornada
- **SOURCE COMPONENT:** Surface + Select + TextField
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** JornadaDetail > Surface (canManage)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=609.05 w=768 h=385.38
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 16px · padding: 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=520.05 · padre 768×905.42
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Organización de toda la jornada Sede de la jornada OPCIONAL GEI · Cancha de hock"

#### STATE

- sin cambios (bulkChanged = false)

#### INTERACTION

- trigger: change de la sede o de las horas → bulkChanged = true y aparece el ImpactPreview
- trigger: click en «Guardar jornada» → updateJornada y abre el modal de impacto

#### MOTION

- transition-colors duration-micro en los controles

#### RESPONSIVE

- 390: campos apilados
- 1440: campos de hora en 2 columnas

#### IMPLEMENTATION NOTES

- El botón «Guardar jornada» está disabled mientras no haya cambios (disabled={!bulkChanged}).
- La autoridad de edición se calcula con authority.coachTeamIds: el entrenador de algún equipo de la jornada puede organizarla.

### C03 — MatchesList

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** DetailSection con RowLink
- **INSTANCE / ROLE:** Partidos que agrupa la jornada
- **SOURCE COMPONENT:** DetailSection + RowLink
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=468.16 w=177.27 h=21.25
- CSS: width: 177.266px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 177.266px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 177.27×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Partidos de la jornada"

#### STATE

- 1 partido

#### INTERACTION

- trigger: click → /events/match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1058 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: contenedor max-w-3xl en ambos.
