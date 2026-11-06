# SURFACE MAP — EQ_TEAM_DETAIL_001_EVENTOS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# EQ_TEAM_DETAIL_001_EVENTOS

**SCREEN ID:** EQ_TEAM_DETAIL_001_EVENTOS

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — pestaña Eventos

**PURPOSE AS IMPLEMENTED:** Detalle de un equipo con pestañas (Personas / Eventos / Resultados). En la pestaña Eventos, cada evento próximo incluye el control ¿Vas? del actor.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /teams/sexta

**ORIGIN:** Equipos → click en un equipo

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta, match-banco, training-serie-2, match-cuba, match-lomas

**RESOURCE STATE:** SCHEDULED · 6 eventos próximos · 1 resultado final

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_002_PERSONAS, EQ_TEAM_DETAIL_003_RESULTADOS, EQ_TEAM_DETAIL_007_SEPTIMA

**RESPONSIVE COUNTERPART:** 390: los eventos próximos van en tarjetas (Surface) con el control ¿Vas? debajo de cada fila. 1440: la misma pila de tarjetas dentro de max-w-5xl (1024 px).

**SOURCE FILES:** src/features/overview.tsx, src/shared/vas.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail, DetailSection, Surface, EventLine, VasControl, Tag

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_001_EVENTOS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Pestañas de sección con sus contadores
- **FOCAL 2:** Tarjetas de eventos próximos
- **SUPPORTING:** Etiqueta «En tu alcance»
- **SECONDARY:** Sección «Eventos pasados»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamTabs | div[role=tablist] con 3 botones | Secciones del equipo con contador |
| C02 | ScopeTag («En tu alcance») | Tag | Marca el alcance sobre el equipo |
| C03 | EventCard (evento próximo) | Surface grid gap-3 con RowLink + VasControl | Evento del equipo con su disponibilidad |

### C01 — TeamTabs

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 3 botones
- **INSTANCE / ROLE:** Secciones del equipo con contador
- **SOURCE COMPONENT:** TeamDetail > div[role=tablist]
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > tabs
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=297.02 w=358 h=36
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×37
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas8 Eventos9 Resultados1"

#### STATE

- «Eventos» activa (border-interactive text-interactive)

#### INTERACTION

- trigger: click en una pestaña → query.set({tab}) → la URL guarda la sección

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: 358 px de ancho, con overflow-x horizontal
- 1440: 1024 px, las tres pestañas caben enteras

#### IMPLEMENTATION NOTES

- La pestaña activa se marca con border-b-2 border-interactive.
- Los contadores van en text-meta text-ink-faint, con un margen izquierdo de 6 px.
- La URL ?tab= es lo que permite que el botón atrás del navegador vuelva al mismo lugar.

### C02 — ScopeTag («En tu alcance»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca el alcance sobre el equipo
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag tone=selected (isMine)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=231.63 w=93.05 h=21.39
- CSS: width: 93.0469px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 93.0469px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×21.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "En tu alcance"

#### STATE

- selected

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 93,05×21,39 px en el action del encabezado
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El encabezado usa «En tu alcance» para el equipo propio y «Sólo consulta» para el resto.

### C03 — EventCard (evento próximo)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid gap-3 con RowLink + VasControl
- **INSTANCE / ROLE:** Evento del equipo con su disponibilidad
- **SOURCE COMPONENT:** Surface + EventLine + VasControl
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > DetailSection «Próximos eventos»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=428.27 w=324 h=94.08
- CSS: width: 324px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=17 · padre 358×128.08

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. Banco Nación Sexta A · GEI · Cancha de hockey Postergado A definir lun, "

#### STATE

- idle (POSTPONED en este caso)

#### INTERACTION

- trigger: click en la fila → /events/match-banco
- trigger: click en una opción de ¿Vas? (sólo eventos SCHEDULED) → respondAvailability

#### MOTION

- transition-colors duration-micro en la fila

#### RESPONSIVE

- 390: 358×128,08 px; el control ¿Vas? va debajo de la fila
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- En el detalle de equipo el control ¿Vas? se muestra para el actor si el evento está SCHEDULED; el resto de eventos llevan sólo la fila.
- Los eventos en estado terminal muestran su StateBadge en la meta de la fila.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1846 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el equipo de pestañas es un `flex gap-1 overflow-x-auto` con tres pestañas de 100,97 / 92 / 110,45 px.
- La lista de eventos mantiene una columna en ambos viewports; la tarjeta individual crece de 358 a 1024 px.

# EQ_TEAM_DETAIL_001_EVENTOS

**SCREEN ID:** EQ_TEAM_DETAIL_001_EVENTOS

**DOMAIN:** 04_Equipos

**SURFACE NAME:** Detalle de equipo — pestaña Eventos

**PURPOSE AS IMPLEMENTED:** Detalle de un equipo con pestañas (Personas / Eventos / Resultados). En la pestaña Eventos, cada evento próximo incluye el control ¿Vas? del actor.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /teams/sexta

**ORIGIN:** Equipos → click en un equipo

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sexta, match-banco, training-serie-2, match-cuba, match-lomas

**RESOURCE STATE:** SCHEDULED · 6 eventos próximos · 1 resultado final

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /teams/sexta?demo=coach.

**RELATED SCREEN IDS:** EQ_TEAM_DETAIL_002_PERSONAS, EQ_TEAM_DETAIL_003_RESULTADOS, EQ_TEAM_DETAIL_007_SEPTIMA

**RESPONSIVE COUNTERPART:** 390: los eventos próximos van en tarjetas (Surface) con el control ¿Vas? debajo de cada fila. 1440: la misma pila de tarjetas dentro de max-w-5xl (1024 px).

**SOURCE FILES:** src/features/overview.tsx, src/shared/vas.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** TeamDetail, DetailSection, Surface, EventLine, VasControl, Tag

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `EQ_TEAM_DETAIL_001_EVENTOS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Pestañas de sección con sus contadores
- **FOCAL 2:** Tarjetas de eventos próximos
- **SUPPORTING:** Etiqueta «En tu alcance»
- **SECONDARY:** Sección «Eventos pasados»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TeamTabs | div[role=tablist] con 3 botones | Secciones del equipo con contador |
| C02 | ScopeTag («En tu alcance») | Tag | Marca el alcance sobre el equipo |
| C03 | EventCard (evento próximo) | Surface grid gap-3 con RowLink + VasControl | Evento del equipo con su disponibilidad |

### C01 — TeamTabs

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=tablist] con 3 botones
- **INSTANCE / ROLE:** Secciones del equipo con contador
- **SOURCE COMPONENT:** TeamDetail > div[role=tablist]
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > tabs
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=241.13 w=1024 h=36
- CSS: width: 1024px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 4px · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1024×37
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Personas8 Eventos9 Resultados1"

#### STATE

- «Eventos» activa (border-interactive text-interactive)

#### INTERACTION

- trigger: click en una pestaña → query.set({tab}) → la URL guarda la sección

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: 358 px de ancho, con overflow-x horizontal
- 1440: 1024 px, las tres pestañas caben enteras

#### IMPLEMENTATION NOTES

- La pestaña activa se marca con border-b-2 border-interactive.
- Los contadores van en text-meta text-ink-faint, con un margen izquierdo de 6 px.
- La URL ?tab= es lo que permite que el botón atrás del navegador vuelva al mismo lugar.

### C02 — ScopeTag («En tu alcance»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Tag
- **INSTANCE / ROLE:** Marca el alcance sobre el equipo
- **SOURCE COMPONENT:** Tag
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Tag tone=selected (isMine)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1250.95 y=137 w=93.05 h=21.39
- CSS: width: 93.0469px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 93.0469px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · padding: 2px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 93.05×21.39
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "En tu alcance"

#### STATE

- selected

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 93,05×21,39 px en el action del encabezado
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El encabezado usa «En tu alcance» para el equipo propio y «Sólo consulta» para el resto.

### C03 — EventCard (evento próximo)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid gap-3 con RowLink + VasControl
- **INSTANCE / ROLE:** Evento del equipo con su disponibilidad
- **SOURCE COMPONENT:** Surface + EventLine + VasControl
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** TeamDetail > DetailSection «Próximos eventos»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=341 y=376.38 w=982 h=94.08
- CSS: width: 982px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 982px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=21 · padre 1024×136.08

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. Banco Nación Sexta A · GEI · Cancha de hockey Postergado A definir lun, "

#### STATE

- idle (POSTPONED en este caso)

#### INTERACTION

- trigger: click en la fila → /events/match-banco
- trigger: click en una opción de ¿Vas? (sólo eventos SCHEDULED) → respondAvailability

#### MOTION

- transition-colors duration-micro en la fila

#### RESPONSIVE

- 390: 358×128,08 px; el control ¿Vas? va debajo de la fila
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- En el detalle de equipo el control ¿Vas? se muestra para el actor si el evento está SCHEDULED; el resto de eventos llevan sólo la fila.
- Los eventos en estado terminal muestran su StateBadge en la meta de la fila.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1571 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el equipo de pestañas es un `flex gap-1 overflow-x-auto` con tres pestañas de 100,97 / 92 / 110,45 px.
- La lista de eventos mantiene una columna en ambos viewports; la tarjeta individual crece de 358 a 1024 px.
