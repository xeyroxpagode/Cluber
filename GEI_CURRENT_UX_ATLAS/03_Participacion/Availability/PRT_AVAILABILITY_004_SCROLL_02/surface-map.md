# SURFACE MAP — PRT_AVAILABILITY_004_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_AVAILABILITY_004_SCROLL_02

**SCREEN ID:** PRT_AVAILABILITY_004_SCROLL_02

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — franja de la lista de respuestas

**PURPOSE AS IMPLEMENTED:** Parte media de la pantalla de disponibilidad con la lista completa de personas y su estado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/availability

**ORIGIN:** PRT_AVAILABILITY_001_DEFAULT (desplazamiento a y = 700)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7

**RESOURCE STATE:** SCHEDULED · scroll 700 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/availability?demo=coach.
2. Desplazar a y = 700.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT

**RESPONSIVE COUNTERPART:** La lista ocupa el ancho completo del contenedor en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** DetailSection «Respuestas»

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_004_SCROLL_02_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de respuestas con su badge de estado
- **FOCAL 2:** Encabezado de la sección «Respuestas»
- **SUPPORTING:** Nombre de la persona actual con «(vos)»
- **SECONDARY:** Separadores
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ResponseRow | li flex flex-wrap | Persona y su estado de disponibilidad |

### C01 — ResponseRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li flex flex-wrap
- **INSTANCE / ROLE:** Persona y su estado de disponibilidad
- **SOURCE COMPONENT:** AvailabilityPage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > DetailSection > li
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=380.41 w=360.48 h=44
- CSS: width: 360.484px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 360.484px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 10px 0px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 360.48×352
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Hay que volver a confirmar"

#### STATE

- read-only

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×~44 px; el badge puede bajar de línea si no entra
- 1440: 824 px de ancho de fila

#### IMPLEMENTATION NOTES

- La fila usa min-h-11 y border-b border-line.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 700
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1213 · scrollY 369 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_AVAILABILITY_004_SCROLL_02

**SCREEN ID:** PRT_AVAILABILITY_004_SCROLL_02

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — franja de la lista de respuestas

**PURPOSE AS IMPLEMENTED:** Parte media de la pantalla de disponibilidad con la lista completa de personas y su estado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/availability

**ORIGIN:** PRT_AVAILABILITY_001_DEFAULT (desplazamiento a y = 700)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba, p0..p7

**RESOURCE STATE:** SCHEDULED · scroll 700 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/availability?demo=coach.
2. Desplazar a y = 700.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT

**RESPONSIVE COUNTERPART:** La lista ocupa el ancho completo del contenedor en ambos viewports.

**SOURCE FILES:** src/features/participation.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** DetailSection «Respuestas»

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_004_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de respuestas con su badge de estado
- **FOCAL 2:** Encabezado de la sección «Respuestas»
- **SUPPORTING:** Nombre de la persona actual con «(vos)»
- **SECONDARY:** Separadores
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ResponseRow | li flex flex-wrap | Persona y su estado de disponibilidad |

### C01 — ResponseRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li flex flex-wrap
- **INSTANCE / ROLE:** Persona y su estado de disponibilidad
- **SOURCE COMPONENT:** AvailabilityPage > li
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** AvailabilityPage > DetailSection > li
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=484.02 w=896 h=44
- CSS: width: 896px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 10px 0px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 896×352
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Victoria Berg Hay que volver a confirmar"

#### STATE

- read-only

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×~44 px; el badge puede bajar de línea si no entra
- 1440: 824 px de ancho de fila

#### IMPLEMENTATION NOTES

- La fila usa min-h-11 y border-b border-line.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 700
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1164 · scrollY 264 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
