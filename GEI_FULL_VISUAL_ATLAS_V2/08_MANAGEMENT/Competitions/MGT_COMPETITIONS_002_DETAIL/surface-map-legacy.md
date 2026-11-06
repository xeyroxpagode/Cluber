# SURFACE MAP — MGT_COMPETITIONS_002_DETAIL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_COMPETITIONS_002_DETAIL

**SCREEN ID:** MGT_COMPETITIONS_002_DETAIL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — detalle

**PURPOSE AS IMPLEMENTED:** Detalle de una competencia con sus jornadas y partidos, y las acciones de editar y archivar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/competitions/ahba

**ORIGIN:** MGT_COMPETITIONS_001_LIST → click en una competencia

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba, j1, match-lomas, match-cuba, match-sic, match-banco, match-septima-quinta

**RESOURCE STATE:** ACTIVA · 1 jornada · 5 partidos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.

**RELATED SCREEN IDS:** MGT_COMPETITIONS_001_LIST, MGT_COMPETITIONS_004_EDIT_MODAL, MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; las listas son de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CompetitionsPage (detail), DetailSection, RowLink, StateBadge, Button variant=danger

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_002_DETAIL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y organizador de la competencia
- **FOCAL 2:** Secciones «Jornadas» y «Partidos»
- **SUPPORTING:** Botones «Editar» y «Archivar competencia»
- **SECONDARY:** Badge «Activo»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CompetitionMatchesList | DetailSection con RowLink | Partidos que referencian la competencia |
| C02 | ArchiveCompetitionButton | Button danger | Archivar la competencia con motivo |

### C01 — CompetitionMatchesList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** DetailSection con RowLink
- **INSTANCE / ROLE:** Partidos que referencian la competencia
- **SOURCE COMPONENT:** DetailSection + RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CompetitionsPage > DetailSection «Partidos»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=440.02 w=68.22 h=21.25
- CSS: width: 68.2188px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 68.2188px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 68.22×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Partidos"

#### STATE

- 5 partidos

#### INTERACTION

- trigger: click en una fila → /events/:id

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×437,02 px; cada fila lleva el StateBadge del evento
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El título de la fila de partido es «GEI vs. {rival}» y el detalle es la fecha y la hora.

### C02 — ArchiveCompetitionButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Archivar la competencia con motivo
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger («Archivar competencia»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=921.03 w=199.44 h=46
- CSS: width: 199.438px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 199.438px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Archivar competencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog de archivado

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El botón sólo aparece si canMutate (canManageCompetitions) y la competencia no está archivada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1079 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_COMPETITIONS_002_DETAIL

**SCREEN ID:** MGT_COMPETITIONS_002_DETAIL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — detalle

**PURPOSE AS IMPLEMENTED:** Detalle de una competencia con sus jornadas y partidos, y las acciones de editar y archivar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/competitions/ahba

**ORIGIN:** MGT_COMPETITIONS_001_LIST → click en una competencia

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba, j1, match-lomas, match-cuba, match-sic, match-banco, match-septima-quinta

**RESOURCE STATE:** ACTIVA · 1 jornada · 5 partidos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.

**RELATED SCREEN IDS:** MGT_COMPETITIONS_001_LIST, MGT_COMPETITIONS_004_EDIT_MODAL, MGT_COMPETITIONS_005_ARCHIVE_CONFIRM

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; las listas son de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CompetitionsPage (detail), DetailSection, RowLink, StateBadge, Button variant=danger

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_002_DETAIL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y organizador de la competencia
- **FOCAL 2:** Secciones «Jornadas» y «Partidos»
- **SUPPORTING:** Botones «Editar» y «Archivar competencia»
- **SECONDARY:** Badge «Activo»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CompetitionMatchesList | DetailSection con RowLink | Partidos que referencian la competencia |
| C02 | ArchiveCompetitionButton | Button danger | Archivar la competencia con motivo |

### C01 — CompetitionMatchesList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** DetailSection con RowLink
- **INSTANCE / ROLE:** Partidos que referencian la competencia
- **SOURCE COMPONENT:** DetailSection + RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CompetitionsPage > DetailSection «Partidos»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=382.02 w=68.22 h=21.25
- CSS: width: 68.2188px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 68.2188px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 68.22×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Partidos"

#### STATE

- 5 partidos

#### INTERACTION

- trigger: click en una fila → /events/:id

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×437,02 px; cada fila lleva el StateBadge del evento
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El título de la fila de partido es «GEI vs. {rival}» y el detalle es la fecha y la hora.

### C02 — ArchiveCompetitionButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Archivar la competencia con motivo
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger («Archivar competencia»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=793.47 w=199.44 h=46
- CSS: width: 199.438px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 199.438px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 896×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Archivar competencia"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog de archivado

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El botón sólo aparece si canMutate (canManageCompetitions) y la competencia no está archivada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 903 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
