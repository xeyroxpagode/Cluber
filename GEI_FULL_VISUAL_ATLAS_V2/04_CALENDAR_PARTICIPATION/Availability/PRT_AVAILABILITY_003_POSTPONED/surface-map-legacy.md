# SURFACE MAP — PRT_AVAILABILITY_003_POSTPONED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_AVAILABILITY_003_POSTPONED

**SCREEN ID:** PRT_AVAILABILITY_003_POSTPONED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — evento postergado

**PURPOSE AS IMPLEMENTED:** Cuando el evento no tiene horario vigente la pantalla muestra un aviso y el control ¿Vas? queda bloqueado por estado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-banco/availability

**ORIGIN:** URL directa

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-banco

**RESOURCE STATE:** POSTPONED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-banco/availability?demo=coach.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT, CAL_EVENT_DETAIL_008_POSTPONED

**RESPONSIVE COUNTERPART:** El banner ocupa arriba; el resto de la pantalla no cambia.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/vas.tsx

**SOURCE SYMBOLS:** AvailabilityPage (POSTPONED banner), Banner, VasControl (readOnly por estado)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_003_POSTPONED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «Este evento está postergado»
- **FOCAL 2:** Texto del control ¿Vas? bloqueado
- **SUPPORTING:** Lista de respuestas (referencia)
- **SECONDARY:** Resumen
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PostponedBanner | Banner tone=warning | Explica que no se pueden cargar respuestas nuevas |
| C02 | VasControl bloqueado por estado | p gei-meta | Explica por qué no se puede responder |

### C01 — PostponedBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=warning
- **INSTANCE / ROLE:** Explica que no se pueden cargar respuestas nuevas
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=warning
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=241.13 w=360.48 h=146.44
- CSS: width: 360.484px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 360.484px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=152.13 · padre 358×1202.84
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(16, 23, 37) · border: 1px solid rgb(236, 220, 178) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-warning (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Este evento está postergado No hay horario vigente, así que no se pueden cargar "

#### STATE

- warning

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas de texto
- 1440: 896 px, 2 líneas

#### IMPLEMENTATION NOTES

- Copy: «No hay horario vigente, así que no se pueden cargar respuestas nuevas. Las respuestas anteriores quedan guardadas como referencia.»

### C02 — VasControl bloqueado por estado

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Explica por qué no se puede responder
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (event.state !== 'SCHEDULED')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=63 y=258.13 w=296.48 h=21.69
- CSS: width: 296.484px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 296.484px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 296.48×112.44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 650

#### CONTENT

- visible: "Este evento está postergado"

#### STATE

- read-only por estado de evento

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El texto del componente es «Este evento está postergado: no hay horario vigente para confirmar.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1404 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el texto del aviso ocupa 3 líneas en 390 y 2 en 1440.

# PRT_AVAILABILITY_003_POSTPONED

**SCREEN ID:** PRT_AVAILABILITY_003_POSTPONED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — evento postergado

**PURPOSE AS IMPLEMENTED:** Cuando el evento no tiene horario vigente la pantalla muestra un aviso y el control ¿Vas? queda bloqueado por estado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-banco/availability

**ORIGIN:** URL directa

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-banco

**RESOURCE STATE:** POSTPONED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-banco/availability?demo=coach.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT, CAL_EVENT_DETAIL_008_POSTPONED

**RESPONSIVE COUNTERPART:** El banner ocupa arriba; el resto de la pantalla no cambia.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/vas.tsx

**SOURCE SYMBOLS:** AvailabilityPage (POSTPONED banner), Banner, VasControl (readOnly por estado)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_003_POSTPONED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «Este evento está postergado»
- **FOCAL 2:** Texto del control ¿Vas? bloqueado
- **SUPPORTING:** Lista de respuestas (referencia)
- **SECONDARY:** Resumen
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | PostponedBanner | Banner tone=warning | Explica que no se pueden cargar respuestas nuevas |
| C02 | VasControl bloqueado por estado | p gei-meta | Explica por qué no se puede responder |

### C01 — PostponedBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=warning
- **INSTANCE / ROLE:** Explica que no se pueden cargar respuestas nuevas
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=warning
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=241.13 w=896 h=103.06
- CSS: width: 896px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 896px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=152.13 · padre 896×1158.08
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(16, 23, 37) · border: 1px solid rgb(236, 220, 178) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-warning (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Este evento está postergado No hay horario vigente, así que no se pueden cargar "

#### STATE

- warning

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas de texto
- 1440: 896 px, 2 líneas

#### IMPLEMENTATION NOTES

- Copy: «No hay horario vigente, así que no se pueden cargar respuestas nuevas. Las respuestas anteriores quedan guardadas como referencia.»

### C02 — VasControl bloqueado por estado

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Explica por qué no se puede responder
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (event.state !== 'SCHEDULED')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=431 y=258.13 w=832 h=21.69
- CSS: width: 832px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 832px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 832×69.06
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 650

#### CONTENT

- visible: "Este evento está postergado"

#### STATE

- read-only por estado de evento

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El texto del componente es «Este evento está postergado: no hay horario vigente para confirmar.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1311 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el texto del aviso ocupa 3 líneas en 390 y 2 en 1440.
