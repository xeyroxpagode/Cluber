# SURFACE MAP — EQ_TEAM_DETAIL_004_OUT_OF_SCOPE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_004_OUT_OF_SCOPE

**SCREEN ID:** EQ_TEAM_DETAIL_004_OUT_OF_SCOPE

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — fuera de alcance de gestión

**PURPOSE AS IMPLEMENTED:** Un equipo que el actor ve pero no gestiona. La pantalla se completa con la etiqueta «Sólo consulta» y el lead «Estás viendo un equipo que no gestionás.» El estado denegado del código (Empty) sólo se alcanza si el equipo no existe o si el actor no tiene ningún equipo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/quinta

**ORIGIN:** URL directa

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** quinta

**RESOURCE STATE:** FUERA DE ALCANCE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/quinta?demo=player.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_005_QUERY_ONLY, EQ_TEAMS_002_LIST_PLAYER, EQ_TEAM_DETAIL_008_NOT_FOUND

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TeamDetail (!team || !canOpen('teams')) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «No llegaste a ese equipo»
- **FOCAL 2:** Mensaje «Ese equipo no está en tu alcance»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | QueryOnlyLead («Estás viendo un equipo que no gestionás.») | p gei-page-lead | Aclara que el actor sólo consulta el equipo |

### C01 — QueryOnlyLead («Estás viendo un equipo que no gestionás.»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-page-lead
- **INSTANCE / ROLE:** Aclara que el actor sólo consulta el equipo
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (lead = isMine ? … : «Estás viendo un equipo que no gestionás.»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=174.63 w=358 h=22.5
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: 672px

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width 672px

#### LAYOUT

- display: block · padding: 0px · margin: 8px 0px 0px · max-width: 672px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=37.63 · padre 358×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 22.5px · font-weight: 400

#### CONTENT

- visible: "Estás viendo un equipo que no gestionás."

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 1 línea
- 1440: 768 px

#### IMPLEMENTATION NOTES

- La condición del estado denegado real es `!team || !authority.canOpen('teams')`: con la jugadora p2, que tiene Sexta A asignada, canOpen('teams') es verdadero y la pantalla se renderiza.
- Por lo tanto, el Empty «Ese equipo no está en tu alcance» sólo se alcanza con un identificador de equipo inexistente o con un actor sin ningún equipo asignado.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# EQ_TEAM_DETAIL_004_OUT_OF_SCOPE

**SCREEN ID:** EQ_TEAM_DETAIL_004_OUT_OF_SCOPE

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — fuera de alcance de gestión

**PURPOSE AS IMPLEMENTED:** Un equipo que el actor ve pero no gestiona. La pantalla se completa con la etiqueta «Sólo consulta» y el lead «Estás viendo un equipo que no gestionás.» El estado denegado del código (Empty) sólo se alcanza si el equipo no existe o si el actor no tiene ningún equipo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/quinta

**ORIGIN:** URL directa

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** quinta

**RESOURCE STATE:** FUERA DE ALCANCE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/quinta?demo=player.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_005_QUERY_ONLY, EQ_TEAMS_002_LIST_PLAYER, EQ_TEAM_DETAIL_008_NOT_FOUND

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TeamDetail (!team || !canOpen('teams')) > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «No llegaste a ese equipo»
- **FOCAL 2:** Mensaje «Ese equipo no está en tu alcance»
- **SUPPORTING:** Ícono
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | QueryOnlyLead («Estás viendo un equipo que no gestionás.») | p gei-page-lead | Aclara que el actor sólo consulta el equipo |

### C01 — QueryOnlyLead («Estás viendo un equipo que no gestionás.»)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-page-lead
- **INSTANCE / ROLE:** Aclara que el actor sólo consulta el equipo
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (lead = isMine ? … : «Estás viendo un equipo que no gestionás.»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=174.63 w=672 h=22.5
- CSS: width: 672px · min-width: 0px · min-height: 0px · max-width: 672px

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width 0px, max-width 672px

#### LAYOUT

- display: block · padding: 0px · margin: 8px 0px 0px · max-width: 672px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=37.63 · padre 906.3×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 15px · line-height: 22.5px · font-weight: 400

#### CONTENT

- visible: "Estás viendo un equipo que no gestionás."

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 1 línea
- 1440: 768 px

#### IMPLEMENTATION NOTES

- La condición del estado denegado real es `!team || !authority.canOpen('teams')`: con la jugadora p2, que tiene Sexta A asignada, canOpen('teams') es verdadero y la pantalla se renderiza.
- Por lo tanto, el Empty «Ese equipo no está en tu alcance» sólo se alcanza con un identificador de equipo inexistente o con un actor sin ningún equipo asignado.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
