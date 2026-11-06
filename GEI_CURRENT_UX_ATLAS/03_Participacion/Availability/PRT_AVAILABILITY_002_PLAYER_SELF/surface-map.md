# SURFACE MAP — PRT_AVAILABILITY_002_PLAYER_SELF

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_AVAILABILITY_002_PLAYER_SELF

**SCREEN ID:** PRT_AVAILABILITY_002_PLAYER_SELF

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — vista PLAYER (respuesta propia editable)

**PURPOSE AS IMPLEMENTED:** La misma pantalla vista por una jugadora: el control ¿Vas? pasa a ser editable y refleja su respuesta actual.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/availability

**ORIGIN:** URL directa

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-cuba, p2

**RESOURCE STATE:** SCHEDULED · p2 sin responder

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/availability?demo=player.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT

**RESPONSIVE COUNTERPART:** Misma composición; el control ¿Vas? cambia de variante, no de lugar.

**SOURCE FILES:** src/features/participation.tsx, src/shared/vas.tsx

**SOURCE SYMBOLS:** AvailabilityPage, VasControl

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_002_PLAYER_SELF_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Control «¿Vas?» con las tres opciones
- **FOCAL 2:** Estado «Tu respuesta: Sin respuesta»
- **SUPPORTING:** Lista de respuestas del resto
- **SECONDARY:** Resumen por valor
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | VasControl editable | RadioGroup columns=3 | Respuesta de la jugadora |

### C01 — VasControl editable

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RadioGroup columns=3
- **INSTANCE / ROLE:** Respuesta de la jugadora
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (RadioGroup)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=289.81 w=326.48 h=69.69
- CSS: width: 326.484px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 326.484px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=31.68 · padre 326.48×101.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Vas? Voy Tal vez No voy"

#### STATE

- sin valor seleccionado (NO_RESPONSE)

#### INTERACTION

- trigger: click en una opción → respondAvailability + toast «Respuesta guardada.»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas
- 1440: 3 columnas

#### IMPLEMENTATION NOTES

- El estado «Tu respuesta: Sin respuesta» se lee con aria-live=polite.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1280 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_AVAILABILITY_002_PLAYER_SELF

**SCREEN ID:** PRT_AVAILABILITY_002_PLAYER_SELF

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Disponibilidad — vista PLAYER (respuesta propia editable)

**PURPOSE AS IMPLEMENTED:** La misma pantalla vista por una jugadora: el control ¿Vas? pasa a ser editable y refleja su respuesta actual.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/availability

**ORIGIN:** URL directa

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-cuba, p2

**RESOURCE STATE:** SCHEDULED · p2 sin responder

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/availability?demo=player.

**RELATED SCREEN IDS:** PRT_AVAILABILITY_001_DEFAULT

**RESPONSIVE COUNTERPART:** Misma composición; el control ¿Vas? cambia de variante, no de lugar.

**SOURCE FILES:** src/features/participation.tsx, src/shared/vas.tsx

**SOURCE SYMBOLS:** AvailabilityPage, VasControl

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_AVAILABILITY_002_PLAYER_SELF_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Control «¿Vas?» con las tres opciones
- **FOCAL 2:** Estado «Tu respuesta: Sin respuesta»
- **SUPPORTING:** Lista de respuestas del resto
- **SECONDARY:** Resumen por valor
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | VasControl editable | RadioGroup columns=3 | Respuesta de la jugadora |

### C01 — VasControl editable

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RadioGroup columns=3
- **INSTANCE / ROLE:** Respuesta de la jugadora
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (RadioGroup)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=293.81 w=854 h=69.69
- CSS: width: 854px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 854px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=31.68 · padre 854×101.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Vas? Voy Tal vez No voy"

#### STATE

- sin valor seleccionado (NO_RESPONSE)

#### INTERACTION

- trigger: click en una opción → respondAvailability + toast «Respuesta guardada.»

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas
- 1440: 3 columnas

#### IMPLEMENTATION NOTES

- El estado «Tu respuesta: Sin respuesta» se lee con aria-live=polite.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1248 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
