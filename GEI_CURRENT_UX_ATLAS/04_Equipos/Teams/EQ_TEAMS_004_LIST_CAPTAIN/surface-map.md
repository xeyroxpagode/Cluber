# SURFACE MAP — EQ_TEAMS_004_LIST_CAPTAIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAMS_004_LIST_CAPTAIN

**SCREEN ID:** EQ_TEAMS_004_LIST_CAPTAIN

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Equipos — lista (CAPTAIN)

**PURPOSE AS IMPLEMENTED:** La lista vista por la capitana: su alcance es el equipo en el que tiene asignación, y puede ser coach o captain del mismo equipo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams

**ORIGIN:** Shell → destino «Equipos»

**ACTOR:** CAPTAIN

**RESOURCE / FIXTURE IDS:** p0 (Victoria Berg), sexta

**RESOURCE STATE:** CAPTAIN · alcance en sexta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams?demo=captain.

**RELATED SCREEN IDS:** EQ_TEAMS_002_LIST_PLAYER

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/overview.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** Teams, scopeTeamIds

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAMS_004_LIST_CAPTAIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de Sexta A con «Tu alcance»
- **FOCAL 2:** Recuentos
- **SUPPORTING:** Encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamRow (Sexta A) | RowLink con Tag | Fila del equipo de la capitana |

### C01 — TeamRow (Sexta A)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Tag
- **INSTANCE / ROLE:** Fila del equipo de la capitana
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Teams > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=386.5 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=143.28 · padre 358×278.56
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Tu alcance Sexta A 8 personas · 9 eventos a la vista"

#### STATE

- in-scope

#### INTERACTION

- trigger: click → /teams/sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- La capitana no tiene rol COACH: su alcance proviene de la asignación de equipo y de su rol CAPTAIN, por lo que la etiqueta es «Tu alcance» y no «En tu alcance».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_TEAMS_004_LIST_CAPTAIN

**SCREEN ID:** EQ_TEAMS_004_LIST_CAPTAIN

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Equipos — lista (CAPTAIN)

**PURPOSE AS IMPLEMENTED:** La lista vista por la capitana: su alcance es el equipo en el que tiene asignación, y puede ser coach o captain del mismo equipo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams

**ORIGIN:** Shell → destino «Equipos»

**ACTOR:** CAPTAIN

**RESOURCE / FIXTURE IDS:** p0 (Victoria Berg), sexta

**RESOURCE STATE:** CAPTAIN · alcance en sexta

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams?demo=captain.

**RELATED SCREEN IDS:** EQ_TEAMS_002_LIST_PLAYER

**RESPONSIVE COUNTERPART:** Misma composición.

**SOURCE FILES:** src/features/overview.tsx, src/mock/derive.ts

**SOURCE SYMBOLS:** Teams, scopeTeamIds

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAMS_004_LIST_CAPTAIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de Sexta A con «Tu alcance»
- **FOCAL 2:** Recuentos
- **SUPPORTING:** Encabezado
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamRow (Sexta A) | RowLink con Tag | Fila del equipo de la capitana |

### C01 — TeamRow (Sexta A)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Tag
- **INSTANCE / ROLE:** Fila del equipo de la capitana
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Teams > RowLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=364 w=1024 h=63.64
- CSS: width: 1024px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=143.28 · padre 1024×278.56
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Tu alcance Sexta A 8 personas · 9 eventos a la vista"

#### STATE

- in-scope

#### INTERACTION

- trigger: click → /teams/sexta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- La capitana no tiene rol COACH: su alcance proviene de la asignación de equipo y de su rol CAPTAIN, por lo que la etiqueta es «Tu alcance» y no «En tu alcance».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
