# SURFACE MAP — MOR_REPORTS_006_ASISTENCIA_FILTERED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_REPORTS_006_ASISTENCIA_FILTERED

**SCREEN ID:** MOR_REPORTS_006_ASISTENCIA_FILTERED

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — asistencia filtrada por período

**PURPOSE AS IMPLEMENTED:** El informe de asistencia con el filtro de período aplicado: sólo entran los eventos del período elegido.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /reports/attendance?period=month

**ORIGIN:** MOR_REPORTS_002_ASISTENCIA → filtro de período

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas (hoy)

**RESOURCE STATE:** period=month · 1 evento con planilla

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/attendance?period=month&demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA

**RESPONSIVE COUNTERPART:** Misma composición; cambia el conjunto de filas.

**SOURCE FILES:** src/features/account-insight.tsx

**SOURCE SYMBOLS:** useFilteredEvents, periodStart

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_006_ASISTENCIA_FILTERED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del evento del período
- **FOCAL 2:** Select de período con el valor aplicado
- **SUPPORTING:** Select de equipo
- **SECONDARY:** Lead «1 evento en el período.»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PeriodSelect | Select | Filtro de período |

### C01 — PeriodSelect

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Select
- **INSTANCE / ROLE:** Filtro de período
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select (periodo)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=195 y=236.81 w=160 h=43.69
- CSS: width: 160px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 160px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 160×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "Todo el histórico Esta temporada Últimos 3 meses Este mes"

#### STATE

- value=month («Este mes»)

#### INTERACTION

- trigger: change → query.set({period}) → la URL guarda el filtro

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 176 px (min-w-44)
- 1440: 176 px

#### IMPLEMENTATION NOTES

- periodStart traduce el valor a una fecha ISO de corte: «month» → primer día del mes actual, «quarter» → hace 3 meses, «year» → 1 de enero.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MOR_REPORTS_006_ASISTENCIA_FILTERED

**SCREEN ID:** MOR_REPORTS_006_ASISTENCIA_FILTERED

**DOMAIN:** 06_Mas

**SURFACE NAME:** Informes — asistencia filtrada por período

**PURPOSE AS IMPLEMENTED:** El informe de asistencia con el filtro de período aplicado: sólo entran los eventos del período elegido.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /reports/attendance?period=month

**ORIGIN:** MOR_REPORTS_002_ASISTENCIA → filtro de período

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas (hoy)

**RESOURCE STATE:** period=month · 1 evento con planilla

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /reports/attendance?period=month&demo=coach.

**RELATED SCREEN IDS:** MOR_REPORTS_002_ASISTENCIA

**RESPONSIVE COUNTERPART:** Misma composición; cambia el conjunto de filas.

**SOURCE FILES:** src/features/account-insight.tsx

**SOURCE SYMBOLS:** useFilteredEvents, periodStart

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_REPORTS_006_ASISTENCIA_FILTERED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del evento del período
- **FOCAL 2:** Select de período con el valor aplicado
- **SUPPORTING:** Select de equipo
- **SECONDARY:** Lead «1 evento en el período.»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PeriodSelect | Select | Filtro de período |

### C01 — PeriodSelect

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Select
- **INSTANCE / ROLE:** Filtro de período
- **SOURCE COMPONENT:** Select
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Select (periodo)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=563 y=236.81 w=160 h=43.69
- CSS: width: 160px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 160px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 36px 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.68 · padre 160×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: "Todo el histórico Esta temporada Últimos 3 meses Este mes"

#### STATE

- value=month («Este mes»)

#### INTERACTION

- trigger: change → query.set({period}) → la URL guarda el filtro

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 176 px (min-w-44)
- 1440: 176 px

#### IMPLEMENTATION NOTES

- periodStart traduce el valor a una fecha ISO de corte: «month» → primer día del mes actual, «quarter» → hace 3 meses, «year» → 1 de enero.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
