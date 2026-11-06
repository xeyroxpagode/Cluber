# SURFACE MAP — PRT_SELECTION_007_OFFICIAL_VS_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_007_OFFICIAL_VS_COACH

**SCREEN ID:** PRT_SELECTION_007_OFFICIAL_VS_COACH

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — vista SUBCOMMITTEE

**PURPOSE AS IMPLEMENTED:** La pantalla de convocatoria para un actor club-wide que no es entrenador: la autoridad de convocatoria es del entrenador del equipo, no del club.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** URL directa

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SIN ALCANCE (canManageSelection exige rol de entrenador)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=subcommittee.

**RELATED SCREEN IDS:** PRT_SELECTION_006_NO_AUTHORITY, CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** canManageSelection (authority.ts:135), SelectionPage

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_007_OFFICIAL_VS_COACH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje de falta de autoridad
- **FOCAL 2:** Detalle explicativo
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoSelectionAuthorityEmpty (oficial) | Empty | Estado de acceso denegado |

### C01 — NoSelectionAuthorityEmpty (oficial)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=89 w=358 h=160.47
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×160.47
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No administrás la convocatoria de este evento La convocatoria es del entrenador "

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- canManageSelection = coachOnEvent(event): exige un rol COACH con alcance de equipo o un rol de alcance EVENT.
- El alcance de club (isClubWide) no habilita la convocatoria.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# PRT_SELECTION_007_OFFICIAL_VS_COACH

**SCREEN ID:** PRT_SELECTION_007_OFFICIAL_VS_COACH

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — vista SUBCOMMITTEE

**PURPOSE AS IMPLEMENTED:** La pantalla de convocatoria para un actor club-wide que no es entrenador: la autoridad de convocatoria es del entrenador del equipo, no del club.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/selection

**ORIGIN:** URL directa

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SIN ALCANCE (canManageSelection exige rol de entrenador)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/selection?demo=subcommittee.

**RELATED SCREEN IDS:** PRT_SELECTION_006_NO_AUTHORITY, CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** canManageSelection (authority.ts:135), SelectionPage

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_007_OFFICIAL_VS_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje de falta de autoridad
- **FOCAL 2:** Detalle explicativo
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoSelectionAuthorityEmpty (oficial) | Empty | Estado de acceso denegado |

### C01 — NoSelectionAuthorityEmpty (oficial)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado de acceso denegado
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=89 w=768 h=143.08
- CSS: width: 768px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No administrás la convocatoria de este evento La convocatoria es del entrenador "

#### STATE

- denied

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- canManageSelection = coachOnEvent(event): exige un rol COACH con alcance de equipo o un rol de alcance EVENT.
- El alcance de club (isClubWide) no habilita la convocatoria.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
