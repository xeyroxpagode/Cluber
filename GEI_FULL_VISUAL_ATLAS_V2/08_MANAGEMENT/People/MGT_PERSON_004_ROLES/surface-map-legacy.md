# SURFACE MAP — MGT_PERSON_004_ROLES

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_004_ROLES

**SCREEN ID:** MGT_PERSON_004_ROLES

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Roles

**PURPOSE AS IMPLEMENTED:** Sección de roles: los roles deportivos vigentes con su alcance y su período.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2?section=roles

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → pestaña «Roles»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2-player (PLAYER, TEAM sexta)

**RESOURCE STATE:** 1 ROL VIGENTE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=roles&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_PERSON_003_EQUIPOS

**RESPONSIVE COUNTERPART:** Sección de una columna en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (section=roles), DetailSection, RowStatic, roleScopeLabel

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_004_ROLES_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del rol con su alcance
- **FOCAL 2:** Título «Roles y alcance» con el contador
- **SUPPORTING:** Período de vigencia
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RoleAssignmentRow | RowStatic | Rol deportivo vigente |

### C01 — RoleAssignmentRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Rol deportivo vigente
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic (roles)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=393.88 w=446.58 h=20.25
- CSS: width: 446.578px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 446.578px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 446.58×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "Jugadora"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detalle combina alcance y vigencia: «Sexta A · Desde sábado, 4 de abril de 2026».
- roleTextOf traduce el código de rol al vocabulario de usuario: PLAYER → Jugadora.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_PERSON_004_ROLES

**SCREEN ID:** MGT_PERSON_004_ROLES

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Roles

**PURPOSE AS IMPLEMENTED:** Sección de roles: los roles deportivos vigentes con su alcance y su período.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2?section=roles

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → pestaña «Roles»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p2-player (PLAYER, TEAM sexta)

**RESOURCE STATE:** 1 ROL VIGENTE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=roles&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_PERSON_003_EQUIPOS

**RESPONSIVE COUNTERPART:** Sección de una columna en ambos viewports.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (section=roles), DetailSection, RowStatic, roleScopeLabel

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_004_ROLES_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del rol con su alcance
- **FOCAL 2:** Título «Roles y alcance» con el contador
- **SUPPORTING:** Período de vigencia
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RoleAssignmentRow | RowStatic | Rol deportivo vigente |

### C01 — RoleAssignmentRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Rol deportivo vigente
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic (roles)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=396 y=336.38 w=872 h=20.25
- CSS: width: 872px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 872px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 872×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "Jugadora"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detalle combina alcance y vigencia: «Sexta A · Desde sábado, 4 de abril de 2026».
- roleTextOf traduce el código de rol al vocabulario de usuario: PLAYER → Jugadora.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
