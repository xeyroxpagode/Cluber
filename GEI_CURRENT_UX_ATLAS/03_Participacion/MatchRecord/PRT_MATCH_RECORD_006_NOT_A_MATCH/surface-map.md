# SURFACE MAP — PRT_MATCH_RECORD_006_NOT_A_MATCH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_MATCH_RECORD_006_NOT_A_MATCH

**SCREEN ID:** PRT_MATCH_RECORD_006_NOT_A_MATCH

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — evento que no es partido

**PURPOSE AS IMPLEMENTED:** Estado vacío al pedir el acta de un evento que no es de tipo MATCH.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/club-familias/match-record

**ORIGIN:** URL directa

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** club-familias (CLUB_EVENT)

**RESOURCE STATE:** TIPO DE EVENTO NO MATCH

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/club-familias/match-record?demo=coach.

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_007_NO_AUTHORITY

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** MatchRecordPage (event.type !== 'MATCH') > Missing > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_006_NOT_A_MATCH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Este evento no tiene resultado»
- **FOCAL 2:** Detalle «Sólo los partidos tienen acta de resultado.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NotAMatchEmpty | Empty | Estado vacío por tipo de evento |

### C01 — NotAMatchEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por tipo de evento
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=89 w=358 h=143.08
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×143.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Este evento no tiene resultado Sólo los partidos tienen acta de resultado."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# PRT_MATCH_RECORD_006_NOT_A_MATCH

**SCREEN ID:** PRT_MATCH_RECORD_006_NOT_A_MATCH

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — evento que no es partido

**PURPOSE AS IMPLEMENTED:** Estado vacío al pedir el acta de un evento que no es de tipo MATCH.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/club-familias/match-record

**ORIGIN:** URL directa

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** club-familias (CLUB_EVENT)

**RESOURCE STATE:** TIPO DE EVENTO NO MATCH

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/club-familias/match-record?demo=coach.

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_007_NO_AUTHORITY

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** MatchRecordPage (event.type !== 'MATCH') > Missing > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_006_NOT_A_MATCH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Este evento no tiene resultado»
- **FOCAL 2:** Detalle «Sólo los partidos tienen acta de resultado.»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NotAMatchEmpty | Empty | Estado vacío por tipo de evento |

### C01 — NotAMatchEmpty

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío por tipo de evento
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

- visible: "Este evento no tiene resultado Sólo los partidos tienen acta de resultado."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: ancho del <main> menos padding
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
