# SURFACE MAP — CAL_JORNADA_003_READ_ONLY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_JORNADA_003_READ_ONLY

**SCREEN ID:** CAL_JORNADA_003_READ_ONLY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — sólo lectura

**PURPOSE AS IMPLEMENTED:** Vista de la jornada por alguien sin autoridad de organización: se sustituye el formulario por un banner de sólo lectura.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /jornadas/j1

**ORIGIN:** Más → «Jornadas» (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** j1, match-cuba

**RESOURCE STATE:** LECTURA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/j1?demo=player.

**RELATED SCREEN IDS:** CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** El banner ocupa el mismo lugar que el formulario en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** JornadaDetail (!canManage) > Banner tone=neutral, Banner

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_003_READ_ONLY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lead «Estás viendo la organización de la jornada.»
- **FOCAL 2:** Banner neutro «Sólo lectura»
- **SUPPORTING:** Contexto y partidos de la jornada
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ReadOnlyBanner | Banner tone=neutral | Explica que la organización la edita otro actor |

### C01 — ReadOnlyBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=neutral
- **INSTANCE / ROLE:** Explica que la organización la edita otro actor
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=neutral
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=586.55 w=358 h=103.06
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=497.55 · padre 358×600.61
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-selected (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sólo lectura La organización de la jornada la edita el entrenador del equipo o l"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas de texto
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- El icono por defecto de este tono es Info 18 px.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# CAL_JORNADA_003_READ_ONLY

**SCREEN ID:** CAL_JORNADA_003_READ_ONLY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — sólo lectura

**PURPOSE AS IMPLEMENTED:** Vista de la jornada por alguien sin autoridad de organización: se sustituye el formulario por un banner de sólo lectura.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /jornadas/j1

**ORIGIN:** Más → «Jornadas» (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** j1, match-cuba

**RESOURCE STATE:** LECTURA

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/j1?demo=player.

**RELATED SCREEN IDS:** CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** El banner ocupa el mismo lugar que el formulario en ambos viewports.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** JornadaDetail (!canManage) > Banner tone=neutral, Banner

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_003_READ_ONLY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lead «Estás viendo la organización de la jornada.»
- **FOCAL 2:** Banner neutro «Sólo lectura»
- **SUPPORTING:** Contexto y partidos de la jornada
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ReadOnlyBanner | Banner tone=neutral | Explica que la organización la edita otro actor |

### C01 — ReadOnlyBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=neutral
- **INSTANCE / ROLE:** Explica que la organización la edita otro actor
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=neutral
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=586.55 w=768 h=81.38
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=497.55 · padre 768×578.92
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-selected (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Sólo lectura La organización de la jornada la edita el entrenador del equipo o l"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas de texto
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- El icono por defecto de este tono es Info 18 px.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
