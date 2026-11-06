# SURFACE MAP — MORE_005_JORNADAS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MORE_005_JORNADAS

**SCREEN ID:** MORE_005_JORNADAS

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — sección Jornadas

**PURPOSE AS IMPLEMENTED:** Bloque «Jornadas» del hub Más: lista las jornadas que contienen eventos visibles para el actor.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more

**ORIGIN:** MORE_001_COACH (desplazamiento a y = 500)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** j1, match-cuba

**RESOURCE STATE:** COACH · 1 jornada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=coach.
2. Desplazar a y = 500.

**RELATED SCREEN IDS:** MORE_001_COACH, CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** La sección es de una columna en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MorePage > DetailSection «Jornadas», visibleEvents

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_005_JORNADAS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de la jornada con su conteo de partidos
- **FOCAL 2:** Título de sección «Jornadas»
- **SUPPORTING:** —
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | JornadaRow | RowLink | Jornada pendiente para el actor |

### C01 — JornadaRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Jornada pendiente para el actor
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (jornadas)
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

- El nombre de la jornada se genera en el seed como «Fecha {día} · {rival}».
- El detalle muestra el número de partidos de la jornada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 500
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MORE_005_JORNADAS

**SCREEN ID:** MORE_005_JORNADAS

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — sección Jornadas

**PURPOSE AS IMPLEMENTED:** Bloque «Jornadas» del hub Más: lista las jornadas que contienen eventos visibles para el actor.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more

**ORIGIN:** MORE_001_COACH (desplazamiento a y = 500)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** j1, match-cuba

**RESOURCE STATE:** COACH · 1 jornada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=coach.
2. Desplazar a y = 500.

**RELATED SCREEN IDS:** MORE_001_COACH, CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** La sección es de una columna en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MorePage > DetailSection «Jornadas», visibleEvents

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_005_JORNADAS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila de la jornada con su conteo de partidos
- **FOCAL 2:** Título de sección «Jornadas»
- **SUPPORTING:** —
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | JornadaRow | RowLink | Jornada pendiente para el actor |

### C01 — JornadaRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Jornada pendiente para el actor
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (jornadas)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=428.25 w=768 h=63.64
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

- El nombre de la jornada se genera en el seed como «Fecha {día} · {rival}».
- El detalle muestra el número de partidos de la jornada.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 500
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 1 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
