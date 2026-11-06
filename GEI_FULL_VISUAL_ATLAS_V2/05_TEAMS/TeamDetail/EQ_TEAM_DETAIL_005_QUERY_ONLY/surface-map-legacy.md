# SURFACE MAP — EQ_TEAM_DETAIL_005_QUERY_ONLY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_005_QUERY_ONLY

**SCREEN ID:** EQ_TEAM_DETAIL_005_QUERY_ONLY

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — sólo consulta (equipo visible, fuera de gestión)

**PURPOSE AS IMPLEMENTED:** Un equipo que el actor ve pero no gestiona: la pantalla se completa con la etiqueta «Sólo consulta» en lugar de «En tu alcance».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/septima

**ORIGIN:** Equipos → click en Séptima A (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** septima, match-septima-quinta

**RESOURCE STATE:** VISIBLE PERO NO GESTIONADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/septima?demo=player.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_004_OUT_OF_SCOPE, EQ_TEAMS_002_LIST_PLAYER

**RESPONSIVE COUNTERPART:** La etiqueta del encabezado es el único cambio de composición respecto del detalle gestionable.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TeamDetail (isMine ? Tag 'En tu alcance' : Tag 'Sólo consulta')

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_005_QUERY_ONLY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Etiqueta «Sólo consulta»
- **FOCAL 2:** Lead «Estás viendo un equipo que no gestionás.»
- **SUPPORTING:** Pestañas y eventos
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | QueryOnlyTag | Tag | Marca que el actor no gestiona el equipo |

### C01 — QueryOnlyTag

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca que el actor no gestiona el equipo
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag (tone neutral, !isMine)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=209.13 w=93.7 h=21.39
- CSS: width: 93.7031px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 93.7031px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×21.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Sólo consulta"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex, px-2 py-0.5
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El tono neutral usa bg-neutral-soft text-ink-muted con ring neutral-line.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# EQ_TEAM_DETAIL_005_QUERY_ONLY

**SCREEN ID:** EQ_TEAM_DETAIL_005_QUERY_ONLY

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — sólo consulta (equipo visible, fuera de gestión)

**PURPOSE AS IMPLEMENTED:** Un equipo que el actor ve pero no gestiona: la pantalla se completa con la etiqueta «Sólo consulta» en lugar de «En tu alcance».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/septima

**ORIGIN:** Equipos → click en Séptima A (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** septima, match-septima-quinta

**RESOURCE STATE:** VISIBLE PERO NO GESTIONADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/septima?demo=player.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_004_OUT_OF_SCOPE, EQ_TEAMS_002_LIST_PLAYER

**RESPONSIVE COUNTERPART:** La etiqueta del encabezado es el único cambio de composición respecto del detalle gestionable.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TeamDetail (isMine ? Tag 'En tu alcance' : Tag 'Sólo consulta')

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_005_QUERY_ONLY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Etiqueta «Sólo consulta»
- **FOCAL 2:** Lead «Estás viendo un equipo que no gestionás.»
- **SUPPORTING:** Pestañas y eventos
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | QueryOnlyTag | Tag | Marca que el actor no gestiona el equipo |

### C01 — QueryOnlyTag

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca que el actor no gestiona el equipo
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag (tone neutral, !isMine)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1250.3 y=137 w=93.7 h=21.39
- CSS: width: 93.7031px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 93.7031px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 93.7×21.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Sólo consulta"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex, px-2 py-0.5
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El tono neutral usa bg-neutral-soft text-ink-muted con ring neutral-line.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
