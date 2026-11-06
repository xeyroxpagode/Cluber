# SURFACE MAP — CAL_EVENT_DETAIL_012_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_012_SCROLL_02

**SCREEN ID:** CAL_EVENT_DETAIL_012_SCROLL_02

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — franja de logística e historial

**PURPOSE AS IMPLEMENTED:** Parte media/inferior del detalle de evento: logística, mensajes del evento e historial.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH (desplazamiento a y = 1100)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · scroll 1100 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Desplazar a y = 1100.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** 390: el bloque de logística pasa a ocupar el ancho completo; 1440: sigue en la columna principal con el aside visible a la derecha.

**SOURCE FILES:** src/features/events.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** DetailSection «Logística», DetailSection «Mensajes de este evento», DetailSection «Historial»

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_012_SCROLL_02_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Logística» con sus filas de datos
- **FOCAL 2:** Mensajes del evento
- **SUPPORTING:** Historial con 3 entradas
- **SECONDARY:** Separadores horizontales
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | LogisticsDetailSection | section grid + dl | Datos logísticos del evento |
| C02 | EventMessagesSection | section grid + Link | Vista previa de la conversación del evento |

### C01 — LogisticsDetailSection

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section grid + dl
- **INSTANCE / ROLE:** Datos logísticos del evento
- **SOURCE COMPONENT:** DetailSection + RowStatic
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=-108.75 w=74.45 h=21.25
- CSS: width: 74.4531px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 74.4531px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 74.45×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Logística"

#### STATE

- completa

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×368,84 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- Cada fila es un RowStatic con borde inferior border-line y padding vertical 12 px.
- La columna de detalle (text-ink-strong) crece en 1440 y las filas «Punto de encuentro» / «Cómo se llega» dejan de envolver.

### C02 — EventMessagesSection

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid + Link
- **INSTANCE / ROLE:** Vista previa de la conversación del evento
- **SOURCE COMPONENT:** DetailSection
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > DetailSection «Mensajes de este evento»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=284.09 w=202.95 h=21.25
- CSS: width: 202.953px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 202.953px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 202.95×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Mensajes de este evento"

#### STATE

- con 1 mensaje

#### INTERACTION

- trigger: click en «Abrir la conversación»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×166,02 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 1100
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2356 · scrollY 1100 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: en 1440 el aside queda fijo en la columna derecha y el contenido principal se desplaza solo.

# CAL_EVENT_DETAIL_012_SCROLL_02

**SCREEN ID:** CAL_EVENT_DETAIL_012_SCROLL_02

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — franja de logística e historial

**PURPOSE AS IMPLEMENTED:** Parte media/inferior del detalle de evento: logística, mensajes del evento e historial.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH (desplazamiento a y = 1100)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · scroll 1100 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=coach.
2. Desplazar a y = 1100.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH

**RESPONSIVE COUNTERPART:** 390: el bloque de logística pasa a ocupar el ancho completo; 1440: sigue en la columna principal con el aside visible a la derecha.

**SOURCE FILES:** src/features/events.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** DetailSection «Logística», DetailSection «Mensajes de este evento», DetailSection «Historial»

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_012_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Sección «Logística» con sus filas de datos
- **FOCAL 2:** Mensajes del evento
- **SUPPORTING:** Historial con 3 entradas
- **SECONDARY:** Separadores horizontales
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | LogisticsDetailSection | section grid + dl | Datos logísticos del evento |
| C02 | EventMessagesSection | section grid + Link | Vista previa de la conversación del evento |

### C01 — LogisticsDetailSection

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section grid + dl
- **INSTANCE / ROLE:** Datos logísticos del evento
- **SOURCE COMPONENT:** DetailSection + RowStatic
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** DetailSection / RowStatic
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=57.36 w=74.45 h=21.25
- CSS: width: 74.4531px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 74.4531px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 74.45×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Logística"

#### STATE

- completa

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×368,84 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- Cada fila es un RowStatic con borde inferior border-line y padding vertical 12 px.
- La columna de detalle (text-ink-strong) crece en 1440 y las filas «Punto de encuentro» / «Cómo se llega» dejan de envolver.

### C02 — EventMessagesSection

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section grid + Link
- **INSTANCE / ROLE:** Vista previa de la conversación del evento
- **SOURCE COMPONENT:** DetailSection
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > DetailSection «Mensajes de este evento»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=432.81 w=202.95 h=21.25
- CSS: width: 202.953px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 202.953px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 202.95×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Mensajes de este evento"

#### STATE

- con 1 mensaje

#### INTERACTION

- trigger: click en «Abrir la conversación»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×166,02 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 1100
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1770 · scrollY 870 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: en 1440 el aside queda fijo en la columna derecha y el contenido principal se desplaza solo.
