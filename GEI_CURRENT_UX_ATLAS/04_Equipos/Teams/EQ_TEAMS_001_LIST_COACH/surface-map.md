# SURFACE MAP — EQ_TEAMS_001_LIST_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAMS_001_LIST_COACH

**SCREEN ID:** EQ_TEAMS_001_LIST_COACH

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Equipos — lista (COACH)

**PURPOSE AS IMPLEMENTED:** Lista de los equipos activos del club con su recuento de personas y de eventos a la vista. Los equipos del alcance del actor se marcan con «Tu alcance».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams

**ORIGIN:** Shell → destino «Equipos»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** primera, quinta, sexta, septima

**RESOURCE STATE:** COACH · alcance en sexta y septima

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams?demo=coach.

**RELATED SCREEN IDS:** EQ_TEAMS_002_LIST_PLAYER, EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** 390: filas de 358×63,64 px con la etiqueta «Tu alcance» en el leading. 1440: max-w-5xl (1024 px); las filas ocupan todo el ancho de la columna.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Teams, RowLink, Tag, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAMS_001_LIST_COACH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de equipo con su recuento
- **FOCAL 2:** Etiquetas «Tu alcance» en Sexta A y Séptima A
- **SUPPORTING:** Título «Equipos» y su lead
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Equipos) | header grid | Contexto, título y lead |
| C02 | TeamRow (Sexta A) | RowLink con Tag | Fila de equipo |
| C03 | ScopeTag («Tu alcance») | Tag | Marca los equipos que el actor gestiona |

### C01 — PageContextHeader (Equipos)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Contexto, título y lead
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=65
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Equipos TB"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×110,22 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El lead declara la regla de alcance: «La lista depende de tu alcance: un entrenador ve sus equipos, una jugadora el suyo.»

### C02 — TeamRow (Sexta A)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Tag
- **INSTANCE / ROLE:** Fila de equipo
- **SOURCE COMPONENT:** RowLink + Tag
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

- in-scope (leading «Tu alcance»)

#### INTERACTION

- trigger: click → /teams/sexta

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft

#### RESPONSIVE

- 390: 358×63,64 px; el Tag ocupa 78,27×21,39 px y el título empieza en x=118,27
- 1440: idéntico, con la fila a 1024 px de ancho

#### IMPLEMENTATION NOTES

- El detalle es «{n} personas · {m} eventos a la vista» con pluralización propia.
- El Tag «Tu alcance» usa tone selected: bg-selected-soft text-selected.

### C03 — ScopeTag («Tu alcance»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca los equipos que el actor gestiona
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag tone=selected
- **PARENT:** a
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=28 y=407.63 w=78.27 h=21.39
- CSS: width: 78.2656px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 78.2656px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by a · offset dx=12 dy=21.13 · padre 358×63.64

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Tu alcance"

#### STATE

- selected

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 78,27×21,39 px, px-2 py-0.5
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista es de una columna en ambos viewports; el contenedor crece de 358 a 1024 px y el texto de detalle deja de usar todo el ancho.

# EQ_TEAMS_001_LIST_COACH

**SCREEN ID:** EQ_TEAMS_001_LIST_COACH

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Equipos — lista (COACH)

**PURPOSE AS IMPLEMENTED:** Lista de los equipos activos del club con su recuento de personas y de eventos a la vista. Los equipos del alcance del actor se marcan con «Tu alcance».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams

**ORIGIN:** Shell → destino «Equipos»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** primera, quinta, sexta, septima

**RESOURCE STATE:** COACH · alcance en sexta y septima

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams?demo=coach.

**RELATED SCREEN IDS:** EQ_TEAMS_002_LIST_PLAYER, EQ_TEAM_DETAIL_001_EVENTOS

**RESPONSIVE COUNTERPART:** 390: filas de 358×63,64 px con la etiqueta «Tu alcance» en el leading. 1440: max-w-5xl (1024 px); las filas ocupan todo el ancho de la columna.

**SOURCE FILES:** src/features/overview.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Teams, RowLink, Tag, PageContextHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAMS_001_LIST_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de equipo con su recuento
- **FOCAL 2:** Etiquetas «Tu alcance» en Sexta A y Séptima A
- **SUPPORTING:** Título «Equipos» y su lead
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader (Equipos) | header grid | Contexto, título y lead |
| C02 | TeamRow (Sexta A) | RowLink con Tag | Fila de equipo |
| C03 | ScopeTag («Tu alcance») | Tag | Marca los equipos que el actor gestiona |

### C01 — PageContextHeader (Equipos)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Contexto, título y lead
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=65
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×901
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Equipos Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×110,22 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El lead declara la regla de alcance: «La lista depende de tu alcance: un entrenador ve sus equipos, una jugadora el suyo.»

### C02 — TeamRow (Sexta A)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Tag
- **INSTANCE / ROLE:** Fila de equipo
- **SOURCE COMPONENT:** RowLink + Tag
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

- in-scope (leading «Tu alcance»)

#### INTERACTION

- trigger: click → /teams/sexta

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft

#### RESPONSIVE

- 390: 358×63,64 px; el Tag ocupa 78,27×21,39 px y el título empieza en x=118,27
- 1440: idéntico, con la fila a 1024 px de ancho

#### IMPLEMENTATION NOTES

- El detalle es «{n} personas · {m} eventos a la vista» con pluralización propia.
- El Tag «Tu alcance» usa tone selected: bg-selected-soft text-selected.

### C03 — ScopeTag («Tu alcance»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca los equipos que el actor gestiona
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag tone=selected
- **PARENT:** a
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=332 y=385.13 w=78.27 h=21.39
- CSS: width: 78.2656px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 78.2656px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by a · offset dx=12 dy=21.13 · padre 1024×63.64

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Tu alcance"

#### STATE

- selected

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 78,27×21,39 px, px-2 py-0.5
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista es de una columna en ambos viewports; el contenedor crece de 358 a 1024 px y el texto de detalle deja de usar todo el ancho.
