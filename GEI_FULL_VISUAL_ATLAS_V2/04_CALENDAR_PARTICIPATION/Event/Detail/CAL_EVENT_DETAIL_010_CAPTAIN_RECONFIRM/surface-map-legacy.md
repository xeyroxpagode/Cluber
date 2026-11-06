# SURFACE MAP — CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**SCREEN ID:** CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — CAPTAIN con reconfirmación pendiente

**PURPOSE AS IMPLEMENTED:** El control ¿Vas? en estado «Hay que volver a confirmar»: el horario del evento cambió desde la última respuesta y el valor queda sin seleccionar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor CAPTAIN)

**ACTOR:** CAPTAIN

**RESOURCE / FIXTURE IDS:** match-cuba, p0 (respuesta con coordinationRevision 1 vs 3 del evento)

**RESOURCE STATE:** SCHEDULED · NEEDS_RECONFIRMATION

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=captain.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_009_PLAYER_VIEW, HOME_004_ATTENTION_PLAYER_RECONFIRM

**RESPONSIVE COUNTERPART:** El aviso de reconfirmación ocupa 2 líneas en 390 y 1 en 1440.

**SOURCE FILES:** src/shared/vas.tsx, src/features/events.tsx

**SOURCE SYMBOLS:** VasControl (view === 'NEEDS_RECONFIRMATION'), eventAvailabilityView

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Aviso ámbar «El horario cambió desde tu última respuesta. Confirmá de nuevo.»
- **FOCAL 2:** Opciones «¿Vas?» sin selección
- **SUPPORTING:** Estado «Tu respuesta: Hay que volver a confirmar»
- **SECONDARY:** Convocada y participación
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ReconfirmationNotice | p con borde amber | Avisa que la respuesta anterior quedó obsoleta |
| C02 | VasControl (sin selección) | RadioGroup | Obliga a re responder |

### C01 — ReconfirmationNotice

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con borde amber
- **INSTANCE / ROLE:** Avisa que la respuesta anterior quedó obsoleta
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (view === 'NEEDS_RECONFIRMATION' && ...)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=475.66 w=324 h=52.78
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 8px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=31.69 · padre 324×164.16
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(138, 75, 8) · border: 1px solid rgb(240, 211, 171) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "El horario cambió desde tu última respuesta. Confirmá de nuevo."

#### STATE

- attention

#### INTERACTION

- No interactivo: informa y fuerza a elegir de nuevo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×~54 px, text-meta font-medium text-attention
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- La detección es derivada: eventAvailabilityView compara coordinationRevision de la respuesta con el del evento.
- En el seed, p0 respondió con coordinationRevision 1 y el evento tiene 3 por el reprogramado de 16:00 a 18:00.

### C02 — VasControl (sin selección)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup
- **INSTANCE / ROLE:** Obliga a re responder
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (value=null si NEEDS_RECONFIRMATION o NO_RESPONSE)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=538.44 w=324 h=69.69
- CSS: width: 324px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=94.47 · padre 324×164.16
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Vas? Voy Tal vez No voy"

#### STATE

- sin valor seleccionado

#### INTERACTION

- trigger: click en una opción → guarda la nueva respuesta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas
- 1440: 3 columnas

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2152 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el ancho del aviso cambia.

# CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**SCREEN ID:** CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — CAPTAIN con reconfirmación pendiente

**PURPOSE AS IMPLEMENTED:** El control ¿Vas? en estado «Hay que volver a confirmar»: el horario del evento cambió desde la última respuesta y el valor queda sin seleccionar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor CAPTAIN)

**ACTOR:** CAPTAIN

**RESOURCE / FIXTURE IDS:** match-cuba, p0 (respuesta con coordinationRevision 1 vs 3 del evento)

**RESOURCE STATE:** SCHEDULED · NEEDS_RECONFIRMATION

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=captain.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_009_PLAYER_VIEW, HOME_004_ATTENTION_PLAYER_RECONFIRM

**RESPONSIVE COUNTERPART:** El aviso de reconfirmación ocupa 2 líneas en 390 y 1 en 1440.

**SOURCE FILES:** src/shared/vas.tsx, src/features/events.tsx

**SOURCE SYMBOLS:** VasControl (view === 'NEEDS_RECONFIRMATION'), eventAvailabilityView

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Aviso ámbar «El horario cambió desde tu última respuesta. Confirmá de nuevo.»
- **FOCAL 2:** Opciones «¿Vas?» sin selección
- **SUPPORTING:** Estado «Tu respuesta: Hay que volver a confirmar»
- **SECONDARY:** Convocada y participación
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ReconfirmationNotice | p con borde amber | Avisa que la respuesta anterior quedó obsoleta |
| C02 | VasControl (sin selección) | RadioGroup | Obliga a re responder |

### C01 — ReconfirmationNotice

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p con borde amber
- **INSTANCE / ROLE:** Avisa que la respuesta anterior quedó obsoleta
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (view === 'NEEDS_RECONFIRMATION' && ...)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=400.47 w=510 h=35.39
- CSS: width: 510px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 510px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 8px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=31.69 · padre 510×146.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(138, 75, 8) · border: 1px solid rgb(240, 211, 171) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "El horario cambió desde tu última respuesta. Confirmá de nuevo."

#### STATE

- attention

#### INTERACTION

- No interactivo: informa y fuerza a elegir de nuevo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 324×~54 px, text-meta font-medium text-attention
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- La detección es derivada: eventAvailabilityView compara coordinationRevision de la respuesta con el del evento.
- En el seed, p0 respondió con coordinationRevision 1 y el evento tiene 3 por el reprogramado de 16:00 a 18:00.

### C02 — VasControl (sin selección)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup
- **INSTANCE / ROLE:** Obliga a re responder
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (value=null si NEEDS_RECONFIRMATION o NO_RESPONSE)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=445.86 w=510 h=69.69
- CSS: width: 510px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 510px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=77.08 · padre 510×146.77
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Vas? Voy Tal vez No voy"

#### STATE

- sin valor seleccionado

#### INTERACTION

- trigger: click en una opción → guarda la nueva respuesta

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 3 columnas
- 1440: 3 columnas

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1686 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el ancho del aviso cambia.
