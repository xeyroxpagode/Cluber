# SURFACE MAP — MGT_TEAM_001_ADMIN_DETAIL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_TEAM_001_ADMIN_DETAIL

**SCREEN ID:** MGT_TEAM_001_ADMIN_DETAIL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Equipo — ficha de administración

**PURPOSE AS IMPLEMENTED:** Ficha administrativa de un equipo: identidad, composición y las personas asignadas.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/teams/sexta

**ORIGIN:** URL directa (no hay enlace en la UI actual a /management/teams/:id)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** sexta, p0..p7

**RESOURCE STATE:** EQUIPO ACTIVO · 8 personas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/teams/sexta?demo=admin.

**RELATED SCREEN IDS:** MGT_TEAM_002_NOT_FOUND, EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; la lista de personas es de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamAdmin, DetailSection, RowStatic, RowLink, Avatar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_TEAM_001_ADMIN_DETAIL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Identidad» del equipo
- **FOCAL 2:** Lista de personas del equipo
- **SUPPORTING:** Título del equipo y lead
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamIdentityRows | DetailSection con RowStatic | Datos de identidad del equipo |

### C01 — TeamIdentityRows

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** DetailSection con RowStatic
- **INSTANCE / ROLE:** Datos de identidad del equipo
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** TeamAdmin > DetailSection «Identidad»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=362.02 w=334 h=20.25
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

- visible: "Composición"

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

- La fila «Composición» muestra el texto literal «División · Línea · Temporada»: los valores concretos no se resuelven en esta pantalla.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1155 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_TEAM_001_ADMIN_DETAIL

**SCREEN ID:** MGT_TEAM_001_ADMIN_DETAIL

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Equipo — ficha de administración

**PURPOSE AS IMPLEMENTED:** Ficha administrativa de un equipo: identidad, composición y las personas asignadas.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/teams/sexta

**ORIGIN:** URL directa (no hay enlace en la UI actual a /management/teams/:id)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** sexta, p0..p7

**RESOURCE STATE:** EQUIPO ACTIVO · 8 personas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/teams/sexta?demo=admin.

**RELATED SCREEN IDS:** MGT_TEAM_002_NOT_FOUND, EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** Contenedor max-w-4xl; la lista de personas es de una columna.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamAdmin, DetailSection, RowStatic, RowLink, Avatar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_TEAM_001_ADMIN_DETAIL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Identidad» del equipo
- **FOCAL 2:** Lista de personas del equipo
- **SUPPORTING:** Título del equipo y lead
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamIdentityRows | DetailSection con RowStatic | Datos de identidad del equipo |

### C01 — TeamIdentityRows

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** DetailSection con RowStatic
- **INSTANCE / ROLE:** Datos de identidad del equipo
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/features/management.tsx
- **SOURCE SYMBOL:** TeamAdmin > DetailSection «Identidad»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=396 y=362.02 w=872 h=20.25
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

- visible: "Composición"

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

- La fila «Composición» muestra el texto literal «División · Línea · Temporada»: los valores concretos no se resuelven en esta pantalla.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1107 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
