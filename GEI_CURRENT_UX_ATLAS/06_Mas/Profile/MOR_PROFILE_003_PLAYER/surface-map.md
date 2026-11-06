# SURFACE MAP — MOR_PROFILE_003_PLAYER

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_PROFILE_003_PLAYER

**SCREEN ID:** MOR_PROFILE_003_PLAYER

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — jugadora

**PURPOSE AS IMPLEMENTED:** El perfil de una jugadora: dos roles (jugadora y capitana) sobre el mismo equipo y un equipo vigente.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more/profile

**ORIGIN:** Shell → avatar (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** actor=player (p2), sess-p2-1, sess-p2-2

**RESOURCE STATE:** CUENTA ACTIVA · 2 sesiones

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=player.

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/account-insight.tsx

**SOURCE SYMBOLS:** ProfilePage, activeRoleAssignments, activeTeamAssignments

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_003_PLAYER_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y avatar de la jugadora
- **FOCAL 2:** Sección «Roles y alcance»
- **SUPPORTING:** Pertenencia y equipos vigentes
- **SECONDARY:** Sesiones
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamAssignmentRow (Sexta A) | RowStatic | Equipo vigente de la jugadora |

### C01 — TeamAssignmentRow (Sexta A)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Equipo vigente de la jugadora
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic (equipos vigentes)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=657.17 w=334 h=20.25
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

- visible: "Sexta A"

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

- El detalle es el periodo de vigencia del equipo: «Desde sábado, 4 de abril de 2026».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1618 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MOR_PROFILE_003_PLAYER

**SCREEN ID:** MOR_PROFILE_003_PLAYER

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — jugadora

**PURPOSE AS IMPLEMENTED:** El perfil de una jugadora: dos roles (jugadora y capitana) sobre el mismo equipo y un equipo vigente.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more/profile

**ORIGIN:** Shell → avatar (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** actor=player (p2), sess-p2-1, sess-p2-2

**RESOURCE STATE:** CUENTA ACTIVA · 2 sesiones

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=player.

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/account-insight.tsx

**SOURCE SYMBOLS:** ProfilePage, activeRoleAssignments, activeTeamAssignments

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_003_PLAYER_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre y avatar de la jugadora
- **FOCAL 2:** Sección «Roles y alcance»
- **SUPPORTING:** Pertenencia y equipos vigentes
- **SECONDARY:** Sesiones
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamAssignmentRow (Sexta A) | RowStatic | Equipo vigente de la jugadora |

### C01 — TeamAssignmentRow (Sexta A)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Equipo vigente de la jugadora
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic (equipos vigentes)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=460 y=562.55 w=744 h=20.25
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

- visible: "Sexta A"

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

- El detalle es el periodo de vigencia del equipo: «Desde sábado, 4 de abril de 2026».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1476 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
