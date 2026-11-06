# SURFACE MAP — MOR_PROFILE_002_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_PROFILE_002_ADMIN

**SCREEN ID:** MOR_PROFILE_002_ADMIN

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — administración

**PURPOSE AS IMPLEMENTED:** El perfil del administrador: misma gramática, con un solo rol (ADMIN, club) y una sola sesión.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more/profile

**ORIGIN:** Shell → avatar (actor ADMIN)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin, sess-admin-1

**RESOURCE STATE:** CUENTA ACTIVA · 1 sesión

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=admin.

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH

**RESPONSIVE COUNTERPART:** Misma composición; la lista de sesiones tiene un elemento menos.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** ProfilePage, roleScopeLabel, periodLabel

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_002_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y avatar del administrador
- **FOCAL 2:** Sección «Roles y alcance»
- **SUPPORTING:** Sesiones activas
- **SECONDARY:** Identidad y pertenencia
- **AMBIENT:** Botón «Cerrar sesión»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RoleRow (Administración) | RowStatic | Rol deportivo vigente y su alcance |

### C01 — RoleRow (Administración)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Rol deportivo vigente y su alcance
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic (roles)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=747.81 w=334 h=20.25
- CSS: width: 334px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 334px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 334×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "Administración"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El alcance de un rol de club se etiqueta «Todo el club» (roleScopeLabel con scope CLUB).
- El periodo de vigencia se agrega con periodLabel(validFrom, validUntil).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1494 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MOR_PROFILE_002_ADMIN

**SCREEN ID:** MOR_PROFILE_002_ADMIN

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — administración

**PURPOSE AS IMPLEMENTED:** El perfil del administrador: misma gramática, con un solo rol (ADMIN, club) y una sola sesión.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more/profile

**ORIGIN:** Shell → avatar (actor ADMIN)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin, sess-admin-1

**RESOURCE STATE:** CUENTA ACTIVA · 1 sesión

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=admin.

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH

**RESPONSIVE COUNTERPART:** Misma composición; la lista de sesiones tiene un elemento menos.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** ProfilePage, roleScopeLabel, periodLabel

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_002_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y avatar del administrador
- **FOCAL 2:** Sección «Roles y alcance»
- **SUPPORTING:** Sesiones activas
- **SECONDARY:** Identidad y pertenencia
- **AMBIENT:** Botón «Cerrar sesión»

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RoleRow (Administración) | RowStatic | Rol deportivo vigente y su alcance |

### C01 — RoleRow (Administración)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Rol deportivo vigente y su alcance
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic (roles)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=460 y=635.8 w=744 h=20.25
- CSS: width: 744px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 744px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 744×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "Administración"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El alcance de un rol de club se etiqueta «Todo el club» (roleScopeLabel con scope CLUB).
- El periodo de vigencia se agrega con periodLabel(validFrom, validUntil).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1334 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
