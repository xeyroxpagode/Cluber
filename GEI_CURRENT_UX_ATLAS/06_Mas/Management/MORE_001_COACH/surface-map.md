# SURFACE MAP — MORE_001_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MORE_001_COACH

**SCREEN ID:** MORE_001_COACH

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada del entrenador

**PURPOSE AS IMPLEMENTED:** Hub de todo lo que no es el día a día. Los enlaces visibles dependen de la autoridad del actor.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, j1 (jornada)

**RESOURCE STATE:** COACH · 4 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=coach.

**RELATED SCREEN IDS:** MORE_002_ADMIN, MORE_005_JORNADAS

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl (768 px) en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MorePage, RowLink, DetailSection, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_001_COACH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de accesos al perfil, informes y combatants
- **FOCAL 2:** Sección «Jornadas» con la jornada pendiente
- **SUPPORTING:** Título «Más» y su lead
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Informes) | RowLink | Acceso a los informes |
| C02 | JornadaRow (jornada pendiente) | RowLink | Jornadas que incluyen eventos visibles para el actor |

### C01 — MoreLinkRow (Informes)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso a los informes
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink
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

- visible: "Informes Asistencia y rendimiento"

#### STATE

- idle

#### INTERACTION

- trigger: click → /reports

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- Los accesos visibles se filtran por `show: authority.canOpen(...)`.
- El entrenador cumple canOpen('reports') porque tiene equipos con rol COACH.

### C02 — JornadaRow (jornada pendiente)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Jornadas que incluyen eventos visibles para el actor
- **SOURCE COMPONENT:** RowLink + DetailSection
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > DetailSection «Jornadas» > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=451.75 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Fecha 21 · GEI vs. CUBA 1 partido"

#### STATE

- idle

#### INTERACTION

- trigger: click → /jornadas/j1

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- La sección «Jornadas» sólo se renderiza si hay al menos una jornada con eventos visibles para el actor.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista de accesos es de una columna en ambos viewports.

# MORE_001_COACH

**SCREEN ID:** MORE_001_COACH

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada del entrenador

**PURPOSE AS IMPLEMENTED:** Hub de todo lo que no es el día a día. Los enlaces visibles dependen de la autoridad del actor.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, j1 (jornada)

**RESOURCE STATE:** COACH · 4 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=coach.

**RELATED SCREEN IDS:** MORE_002_ADMIN, MORE_005_JORNADAS

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl (768 px) en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MorePage, RowLink, DetailSection, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_001_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de accesos al perfil, informes y combatants
- **FOCAL 2:** Sección «Jornadas» con la jornada pendiente
- **SUPPORTING:** Título «Más» y su lead
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Informes) | RowLink | Acceso a los informes |
| C02 | JornadaRow (jornada pendiente) | RowLink | Jornadas que incluyen eventos visibles para el actor |

### C01 — MoreLinkRow (Informes)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso a los informes
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=288.36 w=768 h=63.64
- CSS: width: 768px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=67.64 · padre 768×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Informes Asistencia y rendimiento"

#### STATE

- idle

#### INTERACTION

- trigger: click → /reports

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- Los accesos visibles se filtran por `show: authority.canOpen(...)`.
- El entrenador cumple canOpen('reports') porque tiene equipos con rol COACH.

### C02 — JornadaRow (jornada pendiente)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Jornadas que incluyen eventos visibles para el actor
- **SOURCE COMPONENT:** RowLink + DetailSection
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > DetailSection «Jornadas» > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=429.25 w=768 h=63.64
- CSS: width: 768px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×63.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Fecha 21 · GEI vs. CUBA 1 partido"

#### STATE

- idle

#### INTERACTION

- trigger: click → /jornadas/j1

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- La sección «Jornadas» sólo se renderiza si hay al menos una jornada con eventos visibles para el actor.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista de accesos es de una columna en ambos viewports.
