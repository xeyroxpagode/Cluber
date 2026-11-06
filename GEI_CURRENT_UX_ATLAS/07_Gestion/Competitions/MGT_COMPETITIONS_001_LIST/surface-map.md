# SURFACE MAP — MGT_COMPETITIONS_001_LIST

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_COMPETITIONS_001_LIST

**SCREEN ID:** MGT_COMPETITIONS_001_LIST

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — listado

**PURPOSE AS IMPLEMENTED:** Listado de competencias activas del club con acceso a crear una nueva.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/competitions

**ORIGIN:** Administración → «Competencias»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba, copa-gei

**RESOURCE STATE:** 2 COMPETENCIAS ACTIVAS · 0 archivadas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions?demo=admin.

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL, MGT_COMPETITIONS_003_CREATE_MODAL, MGT_COMPETITIONS_006_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl (896 px) en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CompetitionsPage (sin competitionId), RowLink, Button variant=primary, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_001_LIST_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de las competencias activas
- **FOCAL 2:** Botón «Crear competencia»
- **SUPPORTING:** Título y lead del encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CompetitionRow (Torneo AHBA) | RowLink | Competencia activa |
| C02 | CreateCompetitionButton | Button primary | Abrir el alta de competencia |

### C01 — CompetitionRow (Torneo AHBA)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Competencia activa
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CompetitionsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=299.22 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Torneo AHBA 2026 · Damas Asociación Amateur de Hockey de Buenos Aires"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions/ahba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detalle es el organizador de la competencia.

### C02 — CreateCompetitionButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Abrir el alta de competencia
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary («Crear competencia»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=211.22 w=176.17 h=44
- CSS: width: 176.172px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 176.172px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Crear competencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el Modal de alta

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px en el action del encabezado
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

# MGT_COMPETITIONS_001_LIST

**SCREEN ID:** MGT_COMPETITIONS_001_LIST

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — listado

**PURPOSE AS IMPLEMENTED:** Listado de competencias activas del club con acceso a crear una nueva.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/competitions

**ORIGIN:** Administración → «Competencias»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba, copa-gei

**RESOURCE STATE:** 2 COMPETENCIAS ACTIVAS · 0 archivadas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions?demo=admin.

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL, MGT_COMPETITIONS_003_CREATE_MODAL, MGT_COMPETITIONS_006_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl (896 px) en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CompetitionsPage (sin competitionId), RowLink, Button variant=primary, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_001_LIST_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de las competencias activas
- **FOCAL 2:** Botón «Crear competencia»
- **SUPPORTING:** Título y lead del encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CompetitionRow (Torneo AHBA) | RowLink | Competencia activa |
| C02 | CreateCompetitionButton | Button primary | Abrir el alta de competencia |

### C01 — CompetitionRow (Torneo AHBA)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Competencia activa
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CompetitionsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=220.72 w=896 h=63.64
- CSS: width: 896px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Torneo AHBA 2026 · Damas Asociación Amateur de Hockey de Buenos Aires"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions/ahba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detalle es el organizador de la competencia.

### C02 — CreateCompetitionButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Abrir el alta de competencia
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary («Crear competencia»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1103.83 y=116.59 w=176.17 h=44
- CSS: width: 176.172px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 176.172px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 176.17×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Crear competencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el Modal de alta

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px en el action del encabezado
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
