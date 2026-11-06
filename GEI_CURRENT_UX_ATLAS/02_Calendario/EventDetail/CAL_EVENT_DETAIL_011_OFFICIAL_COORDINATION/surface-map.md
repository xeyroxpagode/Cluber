# SURFACE MAP — CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**SCREEN ID:** CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — vista SUBCOMMITTEE

**PURPOSE AS IMPLEMENTED:** El detalle visto por la Subcomisión: sin panel de operación deportiva pero con el bloque «Coordinación oficial» y el acceso a publicar un comunicado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** match-cuba, ahba (competencia)

**RESOURCE STATE:** SCHEDULED · actor club-wide sin rol de entrenador

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=subcommittee.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED

**RESPONSIVE COUNTERPART:** Misma retícula de dos columnas en 1440; una columna en 390.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail (official && !coach) > Surface «Coordinación oficial», RowLink

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque «Coordinación oficial»
- **FOCAL 2:** Fila «Comunicar un cambio»
- **SUPPORTING:** Fila «Competencia» con el nombre del torneo
- **SECONDARY:** Participación e historial
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OfficialCoordinationSurface | Surface grid gap-3 | Acciones de la Subcomisión sobre el evento |
| C02 | AnnouncementLinkRow | RowLink con Megaphone | Publicar un comunicado sobre el evento |

### C01 — OfficialCoordinationSurface

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface grid gap-3
- **INSTANCE / ROLE:** Acciones de la Subcomisión sobre el evento
- **SOURCE COMPONENT:** EventDetail (official && !coach)
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

- trigger: click en «Comunicar un cambio» → /communication/announcements/new?event=match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- La condición es official && !coach: si el actor fuera ambas cosas, se muestra el panel de operación.
- La fila de competencia sólo aparece si event.competitionId está informado.

### C02 — AnnouncementLinkRow

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Megaphone
- **INSTANCE / ROLE:** Publicar un comunicado sobre el evento
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > RowLink «Comunicar un cambio»
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=682.47 w=324 h=81.03
- CSS: width: 324px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=67.64 · padre 324×148.67
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-megaphone text-ink-faint (17x17)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Comunicar un cambio Publicar un comunicado para las personas alcanzadas por este"

#### STATE

- idle

#### INTERACTION

- trigger: click → /communication/announcements/new?event=match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×63,64 px
- 1440: idéntico

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

- 390 ↔ 1440: el bloque «Coordinación oficial» sustituye a «Operación pendiente» en la misma posición.

# CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**SCREEN ID:** CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — vista SUBCOMMITTEE

**PURPOSE AS IMPLEMENTED:** El detalle visto por la Subcomisión: sin panel de operación deportiva pero con el bloque «Coordinación oficial» y el acceso a publicar un comunicado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** match-cuba, ahba (competencia)

**RESOURCE STATE:** SCHEDULED · actor club-wide sin rol de entrenador

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=subcommittee.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED

**RESPONSIVE COUNTERPART:** Misma retícula de dos columnas en 1440; una columna en 390.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail (official && !coach) > Surface «Coordinación oficial», RowLink

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Bloque «Coordinación oficial»
- **FOCAL 2:** Fila «Comunicar un cambio»
- **SUPPORTING:** Fila «Competencia» con el nombre del torneo
- **SECONDARY:** Participación e historial
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | OfficialCoordinationSurface | Surface grid gap-3 | Acciones de la Subcomisión sobre el evento |
| C02 | AnnouncementLinkRow | RowLink con Megaphone | Publicar un comunicado sobre el evento |

### C01 — OfficialCoordinationSurface

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Surface grid gap-3
- **INSTANCE / ROLE:** Acciones de la Subcomisión sobre el evento
- **SOURCE COMPONENT:** EventDetail (official && !coach)
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

- trigger: click en «Comunicar un cambio» → /communication/announcements/new?event=match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px
- 1440: columna principal

#### IMPLEMENTATION NOTES

- La condición es official && !coach: si el actor fuera ambas cosas, se muestra el panel de operación.
- La fila de competencia sólo aparece si event.competitionId está informado.

### C02 — AnnouncementLinkRow

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RowLink con Megaphone
- **INSTANCE / ROLE:** Publicar un comunicado sobre el evento
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > RowLink «Comunicar un cambio»
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=631.97 w=510 h=63.64
- CSS: width: 510px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 510px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=67.64 · padre 510×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-megaphone text-ink-faint (17x17)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Comunicar un cambio Publicar un comunicado para las personas alcanzadas por este"

#### STATE

- idle

#### INTERACTION

- trigger: click → /communication/announcements/new?event=match-cuba

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×63,64 px
- 1440: idéntico

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

- 390 ↔ 1440: el bloque «Coordinación oficial» sustituye a «Operación pendiente» en la misma posición.
