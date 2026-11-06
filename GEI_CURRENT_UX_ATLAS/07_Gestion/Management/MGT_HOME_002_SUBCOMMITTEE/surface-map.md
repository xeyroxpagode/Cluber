# SURFACE MAP — MGT_HOME_002_SUBCOMMITTEE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_HOME_002_SUBCOMMITTEE

**SCREEN ID:** MGT_HOME_002_SUBCOMMITTEE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Administración — hub (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** El hub visto por la Subcomisión: el título y el lead cambian y sólo queda el acceso a competencias.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management

**ORIGIN:** Más → «Competencias»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** ahba, copa-gei

**RESOURCE STATE:** SUBCOMMITTEE · 1 acceso

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management?demo=subcommittee.

**RELATED SCREEN IDS:** MGT_HOME_001_ADMIN, MGT_COMPETITIONS_006_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; una sola fila.

**SOURCE FILES:** src/features/management.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** ManagementHome (título según canManagePeople), canOpen

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_HOME_002_SUBCOMMITTEE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Coordinación oficial»
- **FOCAL 2:** Fila de acceso a competencias
- **SUPPORTING:** Lead explicativo del alcance
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AdminLinkRow (Competencias) | RowLink | Único acceso disponible para la Subcomisión |

### C01 — AdminLinkRow (Competencias)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Único acceso disponible para la Subcomisión
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** ManagementHome > RowLink (competitions)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=310.86 w=358 h=63.64
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

- visible: "Competencias 2 competencias activas"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El título del encabezado cambia a «Coordinación oficial» porque la Subcomisión no puedeManagePeople.
- El lead explicita el límite: «Competencias del club. Las personas, las cuentas y la estructura las maneja administración.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_HOME_002_SUBCOMMITTEE

**SCREEN ID:** MGT_HOME_002_SUBCOMMITTEE

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Administración — hub (SUBCOMMITTEE)

**PURPOSE AS IMPLEMENTED:** El hub visto por la Subcomisión: el título y el lead cambian y sólo queda el acceso a competencias.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management

**ORIGIN:** Más → «Competencias»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** ahba, copa-gei

**RESOURCE STATE:** SUBCOMMITTEE · 1 acceso

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management?demo=subcommittee.

**RELATED SCREEN IDS:** MGT_HOME_001_ADMIN, MGT_COMPETITIONS_006_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; una sola fila.

**SOURCE FILES:** src/features/management.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** ManagementHome (título según canManagePeople), canOpen

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_HOME_002_SUBCOMMITTEE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Coordinación oficial»
- **FOCAL 2:** Fila de acceso a competencias
- **SUPPORTING:** Lead explicativo del alcance
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AdminLinkRow (Competencias) | RowLink | Único acceso disponible para la Subcomisión |

### C01 — AdminLinkRow (Competencias)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Único acceso disponible para la Subcomisión
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** ManagementHome > RowLink (competitions)
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

- visible: "Competencias 2 competencias activas"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El título del encabezado cambia a «Coordinación oficial» porque la Subcomisión no puedeManagePeople.
- El lead explicita el límite: «Competencias del club. Las personas, las cuentas y la estructura las maneja administración.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
