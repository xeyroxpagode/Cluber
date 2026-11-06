# SURFACE MAP — CAL_CALENDAR_007_MONTH_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_CALENDAR_007_MONTH_SCROLL_02

**SCREEN ID:** CAL_CALENDAR_007_MONTH_SCROLL_02

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — mes, franja inferior (matriz y panel)

**PURPOSE AS IMPLEMENTED:** Parte inferior de la vista mes: las últimas semanas de la matriz, la nota de lectura y el panel lateral completo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /calendar?view=month

**ORIGIN:** CAL_CALENDAR_002_MONTH (desplazamiento a y = 700)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** 11 eventos del mes

**RESOURCE STATE:** vista mes · scroll 700 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=month&demo=coach.
2. Desplazar a y = 700.

**RELATED SCREEN IDS:** CAL_CALENDAR_002_MONTH

**RESPONSIVE COUNTERPART:** 390: la matriz es más alta que el viewport, de modo que el panel lateral queda por debajo del pliegue. 1440: la matriz y el panel conviven en dos columnas.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Calendar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_007_MONTH_SCROLL_02_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Últimas filas de la matriz con sus chips
- **FOCAL 2:** Panel lateral con la leyenda de estados
- **SUPPORTING:** Nota de lectura de la matriz
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MonthGrid (parte inferior) | div grid grid-cols-7 | Matriz mensual desplazada |
| C02 | StateLegendSurface | Surface con lista de muestras | Leyenda «Cómo se leen los estados» |

### C01 — MonthGrid (parte inferior)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div grid grid-cols-7
- **INSTANCE / ROLE:** Matriz mensual desplazada
- **SOURCE COMPONENT:** Calendar > monthGrid
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > monthGrid
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=17 y=-169.41 w=356 h=30.84
- CSS: width: 356px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 356px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 50.8438px 50.8594px 50.8594px 50.8594px 50.8594px 50.8594px 50.8594px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=1 dy=1 · padre 358×566.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Dom Lun Mar Mié Jue Vie Sáb"

#### STATE

- visible

#### INTERACTION

- trigger: click en un chip → selecciona el evento

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 51,14 px por celda
- 1440: ~144,86 px por celda

#### IMPLEMENTATION NOTES

- —

### C02 — StateLegendSurface

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface con lista de muestras
- **INSTANCE / ROLE:** Leyenda «Cómo se leen los estados»
- **SOURCE COMPONENT:** Calendar > aside > segunda Surface
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside (leyenda de estados)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=459.22 w=358 h=273.11
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 358px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=685.63 · padre 358×958.73
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ningún evento seleccionado Tocá un día del mes o una fila de la agenda para ver "

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 352 px de columna

#### IMPLEMENTATION NOTES

- Las muestras son squares de 12×12 px con ring-1 ring-inset: selected-soft, warning-soft y danger-soft.
- Cada muestra lleva texto explicativo, de modo que la información no depende sólo del color.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 700
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1459 · scrollY 615 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: a 1440 el bloque principal y el aside forman un grid; al hacer scroll en 390 sólo se desplaza la matriz.

# CAL_CALENDAR_007_MONTH_SCROLL_02

**SCREEN ID:** CAL_CALENDAR_007_MONTH_SCROLL_02

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Calendario — mes, franja inferior (matriz y panel)

**PURPOSE AS IMPLEMENTED:** Parte inferior de la vista mes: las últimas semanas de la matriz, la nota de lectura y el panel lateral completo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /calendar?view=month

**ORIGIN:** CAL_CALENDAR_002_MONTH (desplazamiento a y = 700)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** 11 eventos del mes

**RESOURCE STATE:** vista mes · scroll 700 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /calendar?view=month&demo=coach.
2. Desplazar a y = 700.

**RELATED SCREEN IDS:** CAL_CALENDAR_002_MONTH

**RESPONSIVE COUNTERPART:** 390: la matriz es más alta que el viewport, de modo que el panel lateral queda por debajo del pliegue. 1440: la matriz y el panel conviven en dos columnas.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** Calendar

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_CALENDAR_007_MONTH_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Últimas filas de la matriz con sus chips
- **FOCAL 2:** Panel lateral con la leyenda de estados
- **SUPPORTING:** Nota de lectura de la matriz
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MonthGrid (parte inferior) | div grid grid-cols-7 | Matriz mensual desplazada |
| C02 | StateLegendSurface | Surface con lista de muestras | Leyenda «Cómo se leen los estados» |

### C01 — MonthGrid (parte inferior)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div grid grid-cols-7
- **INSTANCE / ROLE:** Matriz mensual desplazada
- **SOURCE COMPONENT:** Calendar > monthGrid
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > monthGrid
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=257 y=240.59 w=782 h=30.84
- CSS: width: 782px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 782px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 111.703px 111.719px 111.719px 111.703px 111.719px 111.719px 111.719px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=1 dy=1 · padre 784×566.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Dom Lun Mar Mié Jue Vie Sáb"

#### STATE

- visible

#### INTERACTION

- trigger: click en un chip → selecciona el evento

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 51,14 px por celda
- 1440: ~144,86 px por celda

#### IMPLEMENTATION NOTES

- —

### C02 — StateLegendSurface

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Surface con lista de muestras
- **INSTANCE / ROLE:** Leyenda «Cómo se leen los estados»
- **SOURCE COMPONENT:** Calendar > aside > segunda Surface
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** Calendar > aside (leyenda de estados)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1056 y=183.59 w=352 h=652.23
- CSS: width: 352px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 352px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 352px · gap: 12px · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=800 dy=0 · padre 1152×652.23

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Ningún evento seleccionado Tocá un día del mes o una fila de la agenda para ver "

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 352 px de columna

#### IMPLEMENTATION NOTES

- Las muestras son squares de 12×12 px con ring-1 ring-inset: selected-soft, warning-soft y danger-soft.
- Cada muestra lleva texto explicativo, de modo que la información no depende sólo del color.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 700
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1043 · scrollY 143 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: a 1440 el bloque principal y el aside forman un grid; al hacer scroll en 390 sólo se desplaza la matriz.
