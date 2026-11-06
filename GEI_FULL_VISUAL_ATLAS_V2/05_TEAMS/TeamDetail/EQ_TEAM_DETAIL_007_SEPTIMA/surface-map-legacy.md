# SURFACE MAP — EQ_TEAM_DETAIL_007_SEPTIMA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_007_SEPTIMA

**SCREEN ID:** EQ_TEAM_DETAIL_007_SEPTIMA

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — Séptima A (COACH)

**PURPOSE AS IMPLEMENTED:** El segundo equipo del entrenador: mismo patrón de detalle, con un solo evento en el equipo y sin resultados finalizados.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/septima

**ORIGIN:** Equipos → click en Séptima A

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** septima, match-septima-quinta, p8..p12

**RESOURCE STATE:** 1 evento en el equipo · 0 resultados

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/septima?demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, EQ_TEAM_DETAIL_003_RESULTADOS

**RESPONSIVE COUNTERPART:** Misma composición que el detalle de Sexta A.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** TeamDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_007_SEPTIMA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Encabezado «Séptima A» con «En tu alcance»
- **FOCAL 2:** Único evento próximo del equipo
- **SUPPORTING:** Pestañas con contadores
- **SECONDARY:** Eventos pasados (vacío)
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamTabs (Séptima) | div[role=tablist] | Secciones del equipo |

### C01 — TeamTabs (Séptima)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist]
- **INSTANCE / ROLE:** Secciones del equipo
- **SOURCE COMPONENT:** TeamDetail
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > tabs
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=297.02 w=358 h=36
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×37
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas7 Eventos1 Resultados0"

#### STATE

- «Eventos» activa

#### INTERACTION

- trigger: click → ?tab= en la URL

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: 358 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El contador de «Resultados» es 0 para este equipo.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_TEAM_DETAIL_007_SEPTIMA

**SCREEN ID:** EQ_TEAM_DETAIL_007_SEPTIMA

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — Séptima A (COACH)

**PURPOSE AS IMPLEMENTED:** El segundo equipo del entrenador: mismo patrón de detalle, con un solo evento en el equipo y sin resultados finalizados.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/septima

**ORIGIN:** Equipos → click en Séptima A

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** septima, match-septima-quinta, p8..p12

**RESOURCE STATE:** 1 evento en el equipo · 0 resultados

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/septima?demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, EQ_TEAM_DETAIL_003_RESULTADOS

**RESPONSIVE COUNTERPART:** Misma composición que el detalle de Sexta A.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** TeamDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_007_SEPTIMA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Encabezado «Séptima A» con «En tu alcance»
- **FOCAL 2:** Único evento próximo del equipo
- **SUPPORTING:** Pestañas con contadores
- **SECONDARY:** Eventos pasados (vacío)
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamTabs (Séptima) | div[role=tablist] | Secciones del equipo |

### C01 — TeamTabs (Séptima)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist]
- **INSTANCE / ROLE:** Secciones del equipo
- **SOURCE COMPONENT:** TeamDetail
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > tabs
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=241.13 w=1024 h=36
- CSS: width: 1024px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1024×37
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas7 Eventos1 Resultados0"

#### STATE

- «Eventos» activa

#### INTERACTION

- trigger: click → ?tab= en la URL

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: 358 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El contador de «Resultados» es 0 para este equipo.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
