# SURFACE MAP — CAL_EVENT_DETAIL_008_POSTPONED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_008_POSTPONED

**SCREEN ID:** CAL_EVENT_DETAIL_008_POSTPONED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Postponed (composición terminal)

**PURPOSE AS IMPLEMENTED:** Evento postergado: no hay horario vigente y el mensaje explica que las respuestas anteriores piden confirmación.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-banco

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «GEI vs. Banco Nación»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-banco

**RESOURCE STATE:** POSTPONED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-banco?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_006_COMPLETED, PRT_AVAILABILITY_003_POSTPONED

**RESPONSIVE COUNTERPART:** Composición terminal de una columna (max-w-3xl).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TerminalNotice (default POSTPONED), EventDetail (isTerminal)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_008_POSTPONED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «No hay horario vigente»
- **FOCAL 2:** Surface con los datos de referencia
- **SUPPORTING:** Badge «Postergado» en el encabezado
- **SECONDARY:** Botón «Ver historial»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TerminalNotice (warning) | Banner tone=warning | Explica la postergación |
| C02 | StateBadge (Postergado) | span badge con emphasis | Estado terminal del evento |

### C01 — TerminalNotice (warning)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=warning
- **INSTANCE / ROLE:** Explica la postergación
- **SOURCE COMPONENT:** TerminalNotice
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** TerminalNotice (rama por defecto)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=245.63 w=358 h=146.44
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=156.63 · padre 358×703.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(16, 23, 37) · border: 1px solid rgb(236, 220, 178) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-warning (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No hay horario vigente Este evento está postergado. Cuando la Subcomisión defina"

#### STATE

- warning

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: texto a 3 líneas
- 1440: 2 líneas

#### IMPLEMENTATION NOTES

- Copy: «Este evento está postergado. Cuando la Subcomisión defina la nueva fecha vuelve a aparecer en la agenda y las respuestas anteriores piden confirmación.»

### C02 — StateBadge (Postergado)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span badge con emphasis
- **INSTANCE / ROLE:** Estado terminal del evento
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=event.state emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=178.63 w=82.47 h=23
- CSS: width: 82.4688px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 82.4688px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(133, 90, 16) · border: 0px solid rgb(133, 90, 16) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Postergado"

#### STATE

- POSTPONED → warning

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 904 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# CAL_EVENT_DETAIL_008_POSTPONED

**SCREEN ID:** CAL_EVENT_DETAIL_008_POSTPONED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Postponed (composición terminal)

**PURPOSE AS IMPLEMENTED:** Evento postergado: no hay horario vigente y el mensaje explica que las respuestas anteriores piden confirmación.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-banco

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «GEI vs. Banco Nación»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-banco

**RESOURCE STATE:** POSTPONED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-banco?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_006_COMPLETED, PRT_AVAILABILITY_003_POSTPONED

**RESPONSIVE COUNTERPART:** Composición terminal de una columna (max-w-3xl).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TerminalNotice (default POSTPONED), EventDetail (isTerminal)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_008_POSTPONED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner ámbar «No hay horario vigente»
- **FOCAL 2:** Surface con los datos de referencia
- **SUPPORTING:** Badge «Postergado» en el encabezado
- **SECONDARY:** Botón «Ver historial»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TerminalNotice (warning) | Banner tone=warning | Explica la postergación |
| C02 | StateBadge (Postergado) | span badge con emphasis | Estado terminal del evento |

### C01 — TerminalNotice (warning)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=warning
- **INSTANCE / ROLE:** Explica la postergación
- **SOURCE COMPONENT:** TerminalNotice
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** TerminalNotice (rama por defecto)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=210.63 w=768 h=103.06
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=121.63 · padre 768×633
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(16, 23, 37) · border: 1px solid rgb(236, 220, 178) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-warning (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No hay horario vigente Este evento está postergado. Cuando la Subcomisión defina"

#### STATE

- warning

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: texto a 3 líneas
- 1440: 2 líneas

#### IMPLEMENTATION NOTES

- Copy: «Este evento está postergado. Cuando la Subcomisión defina la nueva fecha vuelve a aparecer en la agenda y las respuestas anteriores piden confirmación.»

### C02 — StateBadge (Postergado)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span badge con emphasis
- **INSTANCE / ROLE:** Estado terminal del evento
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=event.state emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1133.53 y=137 w=82.47 h=23
- CSS: width: 82.4688px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 82.4688px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 82.47×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(251, 243, 224) · color: rgb(133, 90, 16) · border: 0px solid rgb(133, 90, 16) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Postergado"

#### STATE

- POSTPONED → warning

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
