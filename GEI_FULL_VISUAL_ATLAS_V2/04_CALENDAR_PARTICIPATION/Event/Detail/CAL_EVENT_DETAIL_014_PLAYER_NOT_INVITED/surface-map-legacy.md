# SURFACE MAP — CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED

**SCREEN ID:** CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — actor club-wide sin convocatoria

**PURPOSE AS IMPLEMENTED:** El detalle visto por un actor con alcance de club que no está en la convocatoria: sin banner de convocatoria y sin control ¿Vas?.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · sin convocatoria y sin respuesta propia

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=subcommittee.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Misma retícula; el contenido del bloque central cambia.

**SOURCE FILES:** src/features/events.tsx

**SOURCE SYMBOLS:** EventDetail (meInvited && canRespondHere)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque «Coordinación oficial»
- **FOCAL 2:** Encabezado con badge y menú de acciones
- **SUPPORTING:** Resumen de participación
- **SECONDARY:** Logística e historial
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OfficialCoordinationSurface | Surface | Acciones de coordinación oficial |

### C01 — OfficialCoordinationSurface

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface
- **INSTANCE / ROLE:** Acciones de coordinación oficial
- **SOURCE COMPONENT:** EventDetail
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface «Coordinación oficial»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=581.58 w=163.59 h=21.25
- CSS: width: 163.594px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 163.594px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 163.59×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Coordinación oficial"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Comunicar un cambio»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2198 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED

**SCREEN ID:** CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — actor club-wide sin convocatoria

**PURPOSE AS IMPLEMENTED:** El detalle visto por un actor con alcance de club que no está en la convocatoria: sin banner de convocatoria y sin control ¿Vas?.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · sin convocatoria y sin respuesta propia

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=subcommittee.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**RESPONSIVE COUNTERPART:** Misma retícula; el contenido del bloque central cambia.

**SOURCE FILES:** src/features/events.tsx

**SOURCE SYMBOLS:** EventDetail (meInvited && canRespondHere)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque «Coordinación oficial»
- **FOCAL 2:** Encabezado con badge y menú de acciones
- **SUPPORTING:** Resumen de participación
- **SECONDARY:** Logística e historial
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OfficialCoordinationSurface | Surface | Acciones de coordinación oficial |

### C01 — OfficialCoordinationSurface

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface
- **INSTANCE / ROLE:** Acciones de coordinación oficial
- **SOURCE COMPONENT:** EventDetail
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface «Coordinación oficial»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=531.08 w=163.59 h=21.25
- CSS: width: 163.594px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 163.594px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 163.59×21.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 17px · line-height: 21.25px · font-weight: 650 · letter-spacing: -0.085px

#### CONTENT

- visible: "Coordinación oficial"

#### STATE

- idle

#### INTERACTION

- trigger: click en «Comunicar un cambio»

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1697 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
