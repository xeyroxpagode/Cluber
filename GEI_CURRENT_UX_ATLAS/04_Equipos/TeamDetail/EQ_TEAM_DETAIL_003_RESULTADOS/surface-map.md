# SURFACE MAP — EQ_TEAM_DETAIL_003_RESULTADOS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_003_RESULTADOS

**SCREEN ID:** EQ_TEAM_DETAIL_003_RESULTADOS

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — pestaña Resultados

**PURPOSE AS IMPLEMENTED:** Partidos finalizados del equipo con su marcador y un enlace al acta.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/sexta?tab=resultados

**ORIGIN:** EQ_TEAM_DETAIL_001_EVENTOS → pestaña «Resultados»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic (record FINAL 3–1)

**RESOURCE STATE:** 1 resultado finalizado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?tab=resultados&demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, PRT_MATCH_RECORD_003_FINAL

**RESPONSIVE COUNTERPART:** Las filas de resultado usan la misma retícula de una columna en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail > DetailSection «Resultados», RowStatic, TextLink

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_003_RESULTADOS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del partido con su marcador
- **FOCAL 2:** Enlace «Ver acta»
- **SUPPORTING:** Fecha del partido
- **SECONDARY:** Pestañas del equipo
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ResultRow | RowStatic con TextLink | Resultado de un partido finalizado |

### C01 — ResultRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con TextLink
- **INSTANCE / ROLE:** Resultado de un partido finalizado
- **SOURCE COMPONENT:** RowStatic + TextLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > RowStatic (resultados)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=423.27 w=209.88 h=20.25
- CSS: width: 209.875px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 209.875px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 209.88×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "GEI vs. SIC"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Ver acta» → /events/match-sic/match-record

#### MOTION

- transition-colors duration-micro en el TextLink

#### RESPONSIVE

- 390: 358 px; el marcador va en gei-body-strong tabular-nums
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- A diferencia de las otras pestañas, aquí las filas NO son navegables: el único enlace es «Ver acta».
- El contador de la pestaña es el número de eventos con record.state === 'FINAL'.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_TEAM_DETAIL_003_RESULTADOS

**SCREEN ID:** EQ_TEAM_DETAIL_003_RESULTADOS

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — pestaña Resultados

**PURPOSE AS IMPLEMENTED:** Partidos finalizados del equipo con su marcador y un enlace al acta.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/sexta?tab=resultados

**ORIGIN:** EQ_TEAM_DETAIL_001_EVENTOS → pestaña «Resultados»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic (record FINAL 3–1)

**RESOURCE STATE:** 1 resultado finalizado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?tab=resultados&demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_001_EVENTOS, PRT_MATCH_RECORD_003_FINAL

**RESPONSIVE COUNTERPART:** Las filas de resultado usan la misma retícula de una columna en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail > DetailSection «Resultados», RowStatic, TextLink

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_003_RESULTADOS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del partido con su marcador
- **FOCAL 2:** Enlace «Ver acta»
- **SUPPORTING:** Fecha del partido
- **SECONDARY:** Pestañas del equipo
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ResultRow | RowStatic con TextLink | Resultado de un partido finalizado |

### C01 — ResultRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con TextLink
- **INSTANCE / ROLE:** Resultado de un partido finalizado
- **SOURCE COMPONENT:** RowStatic + TextLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > RowStatic (resultados)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=332 y=367.38 w=875.88 h=20.25
- CSS: width: 875.875px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 875.875px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 875.88×39.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 20.25px · font-weight: 650

#### CONTENT

- visible: "GEI vs. SIC"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Ver acta» → /events/match-sic/match-record

#### MOTION

- transition-colors duration-micro en el TextLink

#### RESPONSIVE

- 390: 358 px; el marcador va en gei-body-strong tabular-nums
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- A diferencia de las otras pestañas, aquí las filas NO son navegables: el único enlace es «Ver acta».
- El contador de la pestaña es el número de eventos con record.state === 'FINAL'.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
