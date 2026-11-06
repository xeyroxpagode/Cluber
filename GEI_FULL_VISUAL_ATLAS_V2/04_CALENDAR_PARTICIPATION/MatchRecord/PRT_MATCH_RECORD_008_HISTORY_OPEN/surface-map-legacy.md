# SURFACE MAP — PRT_MATCH_RECORD_008_HISTORY_OPEN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_MATCH_RECORD_008_HISTORY_OPEN

**SCREEN ID:** PRT_MATCH_RECORD_008_HISTORY_OPEN

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — historial del acta

**PURPOSE AS IMPLEMENTED:** Sección «Historial del acta» desplegada con la corrección registrada: marcador anterior, motivo, autor y fecha.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-sic/match-record

**ORIGIN:** PRT_MATCH_RECORD_003_FINAL → «Ver 1»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, rh-1 (corrección de resultado)

**RESOURCE STATE:** COMPLETED · historial desplegado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/match-record?demo=coach.
2. Pulsar «Ver 1».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_003_FINAL, PRT_MATCH_RECORD_005_CORRECT_CONFIRM

**RESPONSIVE COUNTERPART:** El historial se despliega dentro de la misma Surface.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MatchRecordPage > HistoryList, HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_008_HISTORY_OPEN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Entrada de corrección del resultado
- **FOCAL 2:** Motivo de la corrección
- **SUPPORTING:** Autor y fecha
- **SECONDARY:** Botón «Ocultar»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RecordHistoryList | ul grid | Historial de correcciones del acta |

### C01 — RecordHistoryList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Historial de correcciones del acta
- **SOURCE COMPONENT:** HistoryList
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=680.06 w=324 h=135.84
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=65 · padre 358×217.84

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Resultado 16/10/2026, 09:00:00 GEI vs. SIC 3-1 (Final) → GEI vs. SIC 4-1 (Final)"

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La acción es literalmente «Resultado»; el diff muestra «3-1 → 4-1» y el motivo la corrección con el acta de la árbitra.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1332 · scrollY 387 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_MATCH_RECORD_008_HISTORY_OPEN

**SCREEN ID:** PRT_MATCH_RECORD_008_HISTORY_OPEN

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — historial del acta

**PURPOSE AS IMPLEMENTED:** Sección «Historial del acta» desplegada con la corrección registrada: marcador anterior, motivo, autor y fecha.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-sic/match-record

**ORIGIN:** PRT_MATCH_RECORD_003_FINAL → «Ver 1»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic, rh-1 (corrección de resultado)

**RESOURCE STATE:** COMPLETED · historial desplegado

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic/match-record?demo=coach.
2. Pulsar «Ver 1».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_003_FINAL, PRT_MATCH_RECORD_005_CORRECT_CONFIRM

**RESPONSIVE COUNTERPART:** El historial se despliega dentro de la misma Surface.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MatchRecordPage > HistoryList, HistoryList, TimelineEntry

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_008_HISTORY_OPEN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Entrada de corrección del resultado
- **FOCAL 2:** Motivo de la corrección
- **SUPPORTING:** Autor y fecha
- **SECONDARY:** Botón «Ocultar»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | RecordHistoryList | ul grid | Historial de correcciones del acta |

### C01 — RecordHistoryList

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** ul grid
- **INSTANCE / ROLE:** Historial de correcciones del acta
- **SOURCE COMPONENT:** HistoryList
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** HistoryList / TimelineEntry
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=797.63 w=726 h=114.16
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=69 · padre 768×204.16

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Resultado 16/10/2026, 09:00:00 GEI vs. SIC 3-1 (Final) → GEI vs. SIC 4-1 (Final)"

#### STATE

- con 1 entrada

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cada entrada con borde inferior
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La acción es literalmente «Resultado»; el diff muestra «3-1 → 4-1» y el motivo la corrección con el acta de la árbitra.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1111 · scrollY 114 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
