# SURFACE MAP — HOME_001_DEFAULT_COACH

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# HOME_001_DEFAULT_COACH

**SCREEN ID:** HOME_001_DEFAULT_COACH

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — entrenador (COACH)

**PURPOSE AS IMPLEMENTED:** Pantalla de inicio del entrenador. Abre con un saludo, la sección «Necesita tu atención» y tres bloques: Hoy, Próximamente y Comunicaciones.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, match-lomas, training-serie-2, club-familias, c-team-sexta

**RESOURCE STATE:** COACH · sin pendientes propios

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.

**RELATED SCREEN IDS:** HOME_002_DEFAULT_ADMIN, HOME_006_SCROLL_02

**RESPONSIVE COUNTERPART:** 390: una columna de 358 px; 1440: la misma columna centrada con max-w-5xl (1024 px). El contenido no cambia de orden.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Home, AttentionSection, buildAttention, EventLine, PageContextHeader, TextLink, Surface, RowLink

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_001_DEFAULT_COACH_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Saludo «Hola, Tomás» + lead «Lo que pasa hoy y lo que viene.»
- **FOCAL 2:** Bloque verde «No hay nada pendiente»
- **SUPPORTING:** Lista de eventos de hoy y próximos con hora y fecha
- **SECONDARY:** Bloque Comunicaciones con conversaciones y avisos
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader | header grid | Contexto «INICIO», saludo y lead |
| C02 | AttentionSection (estado vacío) | section grid + bloque success | Cierra el bucle de pendientes: aquí informa que no hay nada pendiente |
| C03 | Section «Hoy» + TextLink «Ver calendario» | section grid + header flex | Eventos del día |
| C04 | EventRow (GEI vs. Lomas) | RowLink con meta alineada a la derecha | Fila de evento del día |
| C05 | Section «Próximamente» | section grid + Surface flush | Próximos 4 eventos |
| C06 | Section «Comunicaciones» | section grid + RowLink | Últimas conversaciones y avisos con su marca de no-leído |

### C01 — PageContextHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Contexto «INICIO», saludo y lead
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

- contained-by div · offset dx=0 dy=0 · padre 390×1306.7
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI Inicio TB"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: apila contexto, título y lead
- 1440: flex con el título en basis-64 y el action a la derecha (aquí no hay action)

#### IMPLEMENTATION NOTES

- El título es «Hola, {actor.firstName}».

### C02 — AttentionSection (estado vacío)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid + bloque success
- **INSTANCE / ROLE:** Cierra el bucle de pendientes: aquí informa que no hay nada pendiente
- **SOURCE COMPONENT:** AttentionSection
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (buildAttention)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=220.72 w=358 h=102.33
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 358×1105.7
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Necesita tu atención No hay nada pendiente Todo lo que dependía de vos está resu"

#### STATE

- vacío (items.length === 0)

#### INTERACTION

- No interactivo en este estado

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×102,33 px; el icono va a 19 px y el texto a la derecha
- 1440: contenedor de 1024 px; el bloque verde ocupa el ancho completo de la columna

#### IMPLEMENTATION NOTES

- El bloque verde se construye con clases propias (no el primitive Banner): flex flex-wrap items-center gap-3 rounded-surface border border-success-line bg-success-soft px-4 py-3.5.
- El texto «No hay nada pendiente» va en gei-body-strong text-success.
- El COACH no tiene items de atención porque no puede responder su propia disponibilidad (canRespondOwn exige PLAYER/CAPTAIN) ni administra personas.

### C03 — Section «Hoy» + TextLink «Ver calendario»

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** section grid + header flex
- **INSTANCE / ROLE:** Eventos del día
- **SOURCE COMPONENT:** Home + TextLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > section (Hoy) / TextLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=262.83 y=367.05 w=111.17 h=36
- CSS: width: 111.172px · min-width: auto · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 111.172px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 0px 4px · min-height: 36px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=246.83 dy=0 · padre 358×36

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(26, 79, 160) · border: 0px solid rgb(26, 79, 160) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-arrow-right (13x13)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Ver calendario"

#### STATE

- con 1 evento (match-lomas)

#### INTERACTION

- trigger: click en «Ver calendario» → /calendar

#### MOTION

- transition-colors duration-micro en el TextLink

#### RESPONSIVE

- 390: el link ocupa 111,17 px a la derecha del título de sección
- 1440: idéntico, a la derecha de la columna de 1024 px

#### IMPLEMENTATION NOTES

- El link lleva un ArrowRight 13 px y tipografía meta semibold text-interactive.

### C04 — EventRow (GEI vs. Lomas)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** RowLink con meta alineada a la derecha
- **INSTANCE / ROLE:** Fila de evento del día
- **SOURCE COMPONENT:** RowLink + EventLine
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** EventLine → RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=420.05 w=348 h=67.08
- CSS: width: 348px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 348px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 348×67.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. Lomas Sexta A · GEI · Cancha de hockey 17:00 mié, 21 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click → /events/match-lomas

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft

#### RESPONSIVE

- 390: 348×67,08 px dentro del Surface; hora 17:00 y fecha «mar, 20 oct» a la derecha
- 1440: idéntico dentro del Surface de 1024 px

#### IMPLEMENTATION NOTES

- El detalle secundario combina destinos, un punto y la sede con icono MapPin de 11 px.
- La meta es un grid con StateBadge (sólo en estados terminales), la hora en tabular-nums y la fecha.

### C05 — Section «Próximamente»

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** section grid + Surface flush
- **INSTANCE / ROLE:** Próximos 4 eventos
- **SOURCE COMPONENT:** Home + Surface
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > section (Próximamente) / Surface flush
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=536.13 w=358 h=342.27
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=447.13 · padre 358×1105.7
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Próximamente Ver calendario Entrenamiento Sexta A Sexta A · GEI · Cancha de hock"

#### STATE

- con 4 eventos

#### INTERACTION

- Cada fila navega al evento

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×342,27 px
- 1440: columna de 1024 px

#### IMPLEMENTATION NOTES

- El Surface usa `flush` (sin padding) y la lista lleva px-1 py-1.

### C06 — Section «Comunicaciones»

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** section grid + RowLink
- **INSTANCE / ROLE:** Últimas conversaciones y avisos con su marca de no-leído
- **SOURCE COMPONENT:** Home + RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > section (Comunicaciones)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=922.39 w=358 h=272.31
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=833.39 · padre 358×1105.7
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Comunicaciones Ver todo Equipo · Sexta A Perfecto, gracias Tomi. 2 sin leer Vict"

#### STATE

- con 2 conversaciones + 1 aviso sin leer

#### INTERACTION

- trigger: click en una fila → /conversations/:id o /notifications

#### MOTION

- transition-colors duration-micro en cada RowLink

#### RESPONSIVE

- 390: 358×272,31 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El título de la conversación de equipo es «Equipo · {teamName}»; el de evento, «Evento · {opponent}».
- El no-leído se marca con un punto 8×8 bg-unread + texto «N sin leer» en text-selected.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 (390)
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea a 0 en cada cambio de ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1307 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: <main> con px-4 y pb-28 (112 px) para dejar libre el BottomNav; el contenedor interior max-w-5xl.
- 1440: <main> con px-8 (lg:px-8) y pb-16; el contenedor interior se queda en max-w-5xl = 1024 px, por lo que el bloque queda alineado a la izquierda del área de contenido.
- Los bloques Hoy / Próximamente / Comunicaciones se apilan en una columna en ambos viewports.

# HOME_001_DEFAULT_COACH

**SCREEN ID:** HOME_001_DEFAULT_COACH

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — entrenador (COACH)

**PURPOSE AS IMPLEMENTED:** Pantalla de inicio del entrenador. Abre con un saludo, la sección «Necesita tu atención» y tres bloques: Hoy, Próximamente y Comunicaciones.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach, match-lomas, training-serie-2, club-familias, c-team-sexta

**RESOURCE STATE:** COACH · sin pendientes propios

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=coach.

**RELATED SCREEN IDS:** HOME_002_DEFAULT_ADMIN, HOME_006_SCROLL_02

**RESPONSIVE COUNTERPART:** 390: una columna de 358 px; 1440: la misma columna centrada con max-w-5xl (1024 px). El contenido no cambia de orden.

**SOURCE FILES:** src/features/overview.tsx, src/shared/patterns.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Home, AttentionSection, buildAttention, EventLine, PageContextHeader, TextLink, Surface, RowLink

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_001_DEFAULT_COACH_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Saludo «Hola, Tomás» + lead «Lo que pasa hoy y lo que viene.»
- **FOCAL 2:** Bloque verde «No hay nada pendiente»
- **SUPPORTING:** Lista de eventos de hoy y próximos con hora y fecha
- **SECONDARY:** Bloque Comunicaciones con conversaciones y avisos
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PageContextHeader | header grid | Contexto «INICIO», saludo y lead |
| C02 | AttentionSection (estado vacío) | section grid + bloque success | Cierra el bucle de pendientes: aquí informa que no hay nada pendiente |
| C03 | Section «Hoy» + TextLink «Ver calendario» | section grid + header flex | Eventos del día |
| C04 | EventRow (GEI vs. Lomas) | RowLink con meta alineada a la derecha | Fila de evento del día |
| C05 | Section «Próximamente» | section grid + Surface flush | Próximos 4 eventos |
| C06 | Section «Comunicaciones» | section grid + RowLink | Últimas conversaciones y avisos con su marca de no-leído |

### C01 — PageContextHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid
- **INSTANCE / ROLE:** Contexto «INICIO», saludo y lead
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

- contained-by div · offset dx=0 dy=0 · padre 1440×1225.36
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: oklab(0.999994 0.0000455678 0.0000200868 / 0.95) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Hockey Inicio Buscar ⌘K TB"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: apila contexto, título y lead
- 1440: flex con el título en basis-64 y el action a la derecha (aquí no hay action)

#### IMPLEMENTATION NOTES

- El título es «Hola, {actor.firstName}».

### C02 — AttentionSection (estado vacío)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid + bloque success
- **INSTANCE / ROLE:** Cierra el bucle de pendientes: aquí informa que no hay nada pendiente
- **SOURCE COMPONENT:** AttentionSection
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (buildAttention)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=220.72 w=1024 h=102.33
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 1024px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 1024×1072.36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Necesita tu atención No hay nada pendiente Todo lo que dependía de vos está resu"

#### STATE

- vacío (items.length === 0)

#### INTERACTION

- No interactivo en este estado

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×102,33 px; el icono va a 19 px y el texto a la derecha
- 1440: contenedor de 1024 px; el bloque verde ocupa el ancho completo de la columna

#### IMPLEMENTATION NOTES

- El bloque verde se construye con clases propias (no el primitive Banner): flex flex-wrap items-center gap-3 rounded-surface border border-success-line bg-success-soft px-4 py-3.5.
- El texto «No hay nada pendiente» va en gei-body-strong text-success.
- El COACH no tiene items de atención porque no puede responder su propia disponibilidad (canRespondOwn exige PLAYER/CAPTAIN) ni administra personas.

### C03 — Section «Hoy» + TextLink «Ver calendario»

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** section grid + header flex
- **INSTANCE / ROLE:** Eventos del día
- **SOURCE COMPONENT:** Home + TextLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > section (Hoy) / TextLink
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1232.83 y=367.05 w=111.17 h=36
- CSS: width: 111.172px · min-width: auto · min-height: 36px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 111.172px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 0px 4px · min-height: 36px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=912.83 dy=0 · padre 1024×36

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(26, 79, 160) · border: 0px solid rgb(26, 79, 160) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-arrow-right (13x13)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Ver calendario"

#### STATE

- con 1 evento (match-lomas)

#### INTERACTION

- trigger: click en «Ver calendario» → /calendar

#### MOTION

- transition-colors duration-micro en el TextLink

#### RESPONSIVE

- 390: el link ocupa 111,17 px a la derecha del título de sección
- 1440: idéntico, a la derecha de la columna de 1024 px

#### IMPLEMENTATION NOTES

- El link lleva un ArrowRight 13 px y tipografía meta semibold text-interactive.

### C04 — EventRow (GEI vs. Lomas)

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** RowLink con meta alineada a la derecha
- **INSTANCE / ROLE:** Fila de evento del día
- **SOURCE COMPONENT:** RowLink + EventLine
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** EventLine → RowLink
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=325 y=420.05 w=1014 h=67.08
- CSS: width: 1014px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1014px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 1014×67.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "GEI vs. Lomas Sexta A · GEI · Cancha de hockey 17:00 mié, 21 oct"

#### STATE

- idle

#### INTERACTION

- trigger: click → /events/match-lomas

#### MOTION

- transition-colors duration-micro; hover bg-selected-soft

#### RESPONSIVE

- 390: 348×67,08 px dentro del Surface; hora 17:00 y fecha «mar, 20 oct» a la derecha
- 1440: idéntico dentro del Surface de 1024 px

#### IMPLEMENTATION NOTES

- El detalle secundario combina destinos, un punto y la sede con icono MapPin de 11 px.
- La meta es un grid con StateBadge (sólo en estados terminales), la hora en tabular-nums y la fecha.

### C05 — Section «Próximamente»

- **COMPONENT ID:** C05
- **COMPONENT TYPE:** section grid + Surface flush
- **INSTANCE / ROLE:** Próximos 4 eventos
- **SOURCE COMPONENT:** Home + Surface
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > section (Próximamente) / Surface flush
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=536.13 w=1024 h=326.31
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 1024px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=447.13 · padre 1024×1072.36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Próximamente Ver calendario Entrenamiento Sexta A Sexta A · GEI · Cancha de hock"

#### STATE

- con 4 eventos

#### INTERACTION

- Cada fila navega al evento

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×342,27 px
- 1440: columna de 1024 px

#### IMPLEMENTATION NOTES

- El Surface usa `flush` (sin padding) y la lista lleva px-1 py-1.

### C06 — Section «Comunicaciones»

- **COMPONENT ID:** C06
- **COMPONENT TYPE:** section grid + RowLink
- **INSTANCE / ROLE:** Últimas conversaciones y avisos con su marca de no-leído
- **SOURCE COMPONENT:** Home + RowLink
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Home > section (Comunicaciones)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=906.44 w=1024 h=254.92
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 1024px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=817.44 · padre 1024×1072.36
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Comunicaciones Ver todo Equipo · Sexta A Perfecto, gracias Tomi. 2 sin leer Vict"

#### STATE

- con 2 conversaciones + 1 aviso sin leer

#### INTERACTION

- trigger: click en una fila → /conversations/:id o /notifications

#### MOTION

- transition-colors duration-micro en cada RowLink

#### RESPONSIVE

- 390: 358×272,31 px
- 1440: 1024 px

#### IMPLEMENTATION NOTES

- El título de la conversación de equipo es «Equipo · {teamName}»; el de evento, «Evento · {opponent}».
- El no-leído se marca con un punto 8×8 bg-unread + texto «N sin leer» en text-selected.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 (390)
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea a 0 en cada cambio de ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1225 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: <main> con px-4 y pb-28 (112 px) para dejar libre el BottomNav; el contenedor interior max-w-5xl.
- 1440: <main> con px-8 (lg:px-8) y pb-16; el contenedor interior se queda en max-w-5xl = 1024 px, por lo que el bloque queda alineado a la izquierda del área de contenido.
- Los bloques Hoy / Próximamente / Comunicaciones se apilan en una columna en ambos viewports.
