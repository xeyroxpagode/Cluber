# SURFACE MAP — XD_COMPETITION_001_TO_JORNADA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_COMPETITION_001_TO_JORNADA

**SCREEN ID:** XD_COMPETITION_001_TO_JORNADA

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Competencia → Jornada

**PURPOSE AS IMPLEMENTED:** Trayecto desde el detalle de una competencia hasta la jornada que la referencia.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/competitions/ahba

**ORIGIN:** Administración → «Competencias» → «Torneo AHBA 2026 · Damas»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba, j1, match-cuba

**RESOURCE STATE:** COMPETENCIA → JORNADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.
2. Pulsar la fila de la jornada «Fecha 21 · GEI vs. CUBA».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL, CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** El destino usa max-w-3xl (768 px).

**SOURCE FILES:** src/features/management.tsx, src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CompetitionsPage > RowLink (jornadas), JornadaPage > JornadaDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_COMPETITION_001_TO_JORNADA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la jornada
- **FOCAL 2:** Sección «Partidos de la jornada»
- **SUPPORTING:** Sección «Contexto» con temporada y competencia
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | JornadaHeader | header grid con back | Destino de la navegación |

### C01 — JornadaHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (JornadaDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=137 w=358 h=29.63
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Fecha 21 · GEI vs. CUBA"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /calendar

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El nombre de la jornada se genera en el seed con el día y el rival: «Fecha 21 · GEI vs. CUBA».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva su propio contenedor.

# XD_COMPETITION_001_TO_JORNADA

**SCREEN ID:** XD_COMPETITION_001_TO_JORNADA

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Competencia → Jornada

**PURPOSE AS IMPLEMENTED:** Trayecto desde el detalle de una competencia hasta la jornada que la referencia.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/competitions/ahba

**ORIGIN:** Administración → «Competencias» → «Torneo AHBA 2026 · Damas»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** ahba, j1, match-cuba

**RESOURCE STATE:** COMPETENCIA → JORNADA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/competitions/ahba?demo=admin.
2. Pulsar la fila de la jornada «Fecha 21 · GEI vs. CUBA».

**RELATED SCREEN IDS:** MGT_COMPETITIONS_002_DETAIL, CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** El destino usa max-w-3xl (768 px).

**SOURCE FILES:** src/features/management.tsx, src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** CompetitionsPage > RowLink (jornadas), JornadaPage > JornadaDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_COMPETITION_001_TO_JORNADA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Nombre de la jornada
- **FOCAL 2:** Sección «Partidos de la jornada»
- **SUPPORTING:** Sección «Contexto» con temporada y competencia
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | JornadaHeader | header grid con back | Destino de la navegación |

### C01 — JornadaHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back
- **INSTANCE / ROLE:** Destino de la navegación
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (JornadaDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=137 w=768 h=29.63
- CSS: width: 768px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Fecha 21 · GEI vs. CUBA"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Volver» → /calendar

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El nombre de la jornada se genera en el seed con el día y el rival: «Fecha 21 · GEI vs. CUBA».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino conserva su propio contenedor.
