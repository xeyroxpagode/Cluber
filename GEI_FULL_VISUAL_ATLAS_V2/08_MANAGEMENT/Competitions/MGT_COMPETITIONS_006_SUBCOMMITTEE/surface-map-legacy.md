# SURFACE MAP — MGT_COMPETITIONS_006_SUBCOMMITTEE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_COMPETITIONS_006_SUBCOMMITTEE

**SCREEN ID:** MGT_COMPETITIONS_006_SUBCOMMITTEE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — listado (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** El listado de competencias para la Subcomisión: ve las activas pero no tiene el botón de creación.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/competitions

**ORIGIN:** Más → «Competencias» (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** ahba, copa-gei

**RESOURCE STATE:** SUBCOMMITTEE · 2 competencias visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions?demo=subcommittee.

**RELATED SCREEN IDS:** MGT_COMPETITIONS_001_LIST, MGT_COMPETITIONS_007_DENIED_COACH

**RESPONSIVE COUNTERPART:** Misma composición; sin botón «Crear competencia».

**SOURCE FILES:** src/features/management.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** CompetitionsPage (canMutate = canManageCompetitions), canManageCompetitions

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_006_SUBCOMMITTEE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de competencias
- **FOCAL 2:** Encabezado sin acción primaria
- **SUPPORTING:** Lead del encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CompetitionRow (visible para la Subcomisión) | RowLink | Competencia activa |

### C01 — CompetitionRow (visible para la Subcomisión)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Competencia activa
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CompetitionsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=366.86 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=67.64 · padre 358×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Copa GEI 2026 Gimnasia y Esgrima de Ituzaingó"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions/copa-gei

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- canManageCompetitions = admin || official: la Subcomisión puede crear, editar y archivar competencias (canMutate es true), pero el botón «Crear competencia» de esta pantalla se muestra igualmente.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_COMPETITIONS_006_SUBCOMMITTEE

**SCREEN ID:** MGT_COMPETITIONS_006_SUBCOMMITTEE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Competencias — listado (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** El listado de competencias para la Subcomisión: ve las activas pero no tiene el botón de creación.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/competitions

**ORIGIN:** Más → «Competencias» (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** ahba, copa-gei

**RESOURCE STATE:** SUBCOMMITTEE · 2 competencias visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions?demo=subcommittee.

**RELATED SCREEN IDS:** MGT_COMPETITIONS_001_LIST, MGT_COMPETITIONS_007_DENIED_COACH

**RESPONSIVE COUNTERPART:** Misma composición; sin botón «Crear competencia».

**SOURCE FILES:** src/features/management.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** CompetitionsPage (canMutate = canManageCompetitions), canManageCompetitions

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_COMPETITIONS_006_SUBCOMMITTEE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de competencias
- **FOCAL 2:** Encabezado sin acción primaria
- **SUPPORTING:** Lead del encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | CompetitionRow (visible para la Subcomisión) | RowLink | Competencia activa |

### C01 — CompetitionRow (visible para la Subcomisión)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Competencia activa
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** CompetitionsPage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=288.36 w=896 h=63.64
- CSS: width: 896px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=67.64 · padre 896×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Copa GEI 2026 Gimnasia y Esgrima de Ituzaingó"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions/copa-gei

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- canManageCompetitions = admin || official: la Subcomisión puede crear, editar y archivar competencias (canMutate es true), pero el botón «Crear competencia» de esta pantalla se muestra igualmente.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
