# SURFACE MAP — MORE_003_SUBCOMMITTEE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MORE_003_SUBCOMMITTEE

**SCREEN ID:** MORE_003_SUBCOMMITTEE

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada de la Subcomisión

**PURPOSE AS IMPLEMENTED:** El hub para la Subcomisión: ve informes, competencias y estructura, pero no personas ni historial.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** actor=subcommittee

**RESOURCE STATE:** SUBCOMMITTEE · 4 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=subcommittee.

**RELATED SCREEN IDS:** MORE_002_ADMIN, MGT_HOME_002_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** MorePage (links con show), canOpen

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_003_SUBCOMMITTEE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de accesos de la Subcomisión
- **FOCAL 2:** Acceso «Competencias»
- **SUPPORTING:** Encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Competencias) | RowLink | Acceso a competencias |

### C01 — MoreLinkRow (Competencias)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso a competencias
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (competitions)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=378.5 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=135.28 · padre 358×198.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Competencias Contexto deportivo: crear, editar, archivar y consultar"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canOpen('competitions') = admin || official: la Subcomisión entra.
- canOpen('structure') = admin: la Subcomisión no ve la estructura del club.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MORE_003_SUBCOMMITTEE

**SCREEN ID:** MORE_003_SUBCOMMITTEE

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada de la Subcomisión

**PURPOSE AS IMPLEMENTED:** El hub para la Subcomisión: ve informes, competencias y estructura, pero no personas ni historial.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** actor=subcommittee

**RESOURCE STATE:** SUBCOMMITTEE · 4 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=subcommittee.

**RELATED SCREEN IDS:** MORE_002_ADMIN, MGT_HOME_002_SUBCOMMITTEE

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** MorePage (links con show), canOpen

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_003_SUBCOMMITTEE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de accesos de la Subcomisión
- **FOCAL 2:** Acceso «Competencias»
- **SUPPORTING:** Encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Competencias) | RowLink | Acceso a competencias |

### C01 — MoreLinkRow (Competencias)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso a competencias
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (competitions)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=356 w=768 h=63.64
- CSS: width: 768px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=135.28 · padre 768×198.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Competencias Contexto deportivo: crear, editar, archivar y consultar"

#### STATE

- idle

#### INTERACTION

- trigger: click → /management/competitions

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- canOpen('competitions') = admin || official: la Subcomisión entra.
- canOpen('structure') = admin: la Subcomisión no ve la estructura del club.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
