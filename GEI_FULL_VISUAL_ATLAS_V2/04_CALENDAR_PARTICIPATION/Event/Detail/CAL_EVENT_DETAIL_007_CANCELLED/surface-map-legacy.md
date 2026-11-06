# SURFACE MAP — CAL_EVENT_DETAIL_007_CANCELLED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_007_CANCELLED

**SCREEN ID:** CAL_EVENT_DETAIL_007_CANCELLED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Cancelled (composición terminal)

**PURPOSE AS IMPLEMENTED:** Evento cancelado: banner de peligro, datos de referencia y la acción «Restaurar el evento» disponible para quien puede operar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/training-cancelado

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento cancelado

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-cancelado

**RESOURCE STATE:** CANCELLED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-cancelado?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_006_COMPLETED, CAL_EVENT_DETAIL_008_POSTPONED

**RESPONSIVE COUNTERPART:** Composición terminal de una columna (max-w-3xl).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TerminalNotice (CANCELLED), EventDetail (isTerminal)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_007_CANCELLED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner rojo «Este evento fue cancelado»
- **FOCAL 2:** Botón «Restaurar el evento»
- **SUPPORTING:** Surface con fecha, sede y destino
- **SECONDARY:** Botón «Ver historial»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TerminalNotice (danger) | Banner tone=danger | Explica la cancelación |
| C02 | RestoreEventButton | Button secondary | Devolver el evento cancelado a SCHEDULED |

### C01 — TerminalNotice (danger)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=danger
- **INSTANCE / ROLE:** Explica la cancelación
- **SOURCE COMPONENT:** TerminalNotice
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** TerminalNotice (CANCELLED)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=245.63 w=358 h=124.75
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=156.63 · padre 358×681.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(242, 194, 196) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-danger (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Este evento fue cancelado La información que estaba antes queda disponible como "

#### STATE

- danger

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: texto a 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- —

### C02 — RestoreEventButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Devolver el evento cancelado a SCHEDULED
- **SOURCE COMPONENT:** Button + runTransition
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail (isTerminal) > Button «Restaurar el evento»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=171.45 y=724.69 w=179.98 h=46
- CSS: width: 179.984px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 179.984px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=155.45 dy=0 · padre 358×46

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Restaurar el evento"

#### STATE

- idle (busy mientras corre la transición)

#### INTERACTION

- trigger: click → runTransition('SCHEDULED', 'Restauración del evento cancelado')
- el botón queda busy con spinner mientras dura la transición

#### MOTION

- transition-colors duration-micro; el icono Loader2 gira con animate-spin

#### RESPONSIVE

- 390: min-height 44 px, en línea con «Ver historial»
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La transición CANCELLED → SCHEDULED es la única permitida desde CANCELLED en EVENT_TRANSITIONS.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 883 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# CAL_EVENT_DETAIL_007_CANCELLED

**SCREEN ID:** CAL_EVENT_DETAIL_007_CANCELLED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Cancelled (composición terminal)

**PURPOSE AS IMPLEMENTED:** Evento cancelado: banner de peligro, datos de referencia y la acción «Restaurar el evento» disponible para quien puede operar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/training-cancelado

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento cancelado

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-cancelado

**RESOURCE STATE:** CANCELLED

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-cancelado?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_006_COMPLETED, CAL_EVENT_DETAIL_008_POSTPONED

**RESPONSIVE COUNTERPART:** Composición terminal de una columna (max-w-3xl).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** TerminalNotice (CANCELLED), EventDetail (isTerminal)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_007_CANCELLED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner rojo «Este evento fue cancelado»
- **FOCAL 2:** Botón «Restaurar el evento»
- **SUPPORTING:** Surface con fecha, sede y destino
- **SECONDARY:** Botón «Ver historial»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TerminalNotice (danger) | Banner tone=danger | Explica la cancelación |
| C02 | RestoreEventButton | Button secondary | Devolver el evento cancelado a SCHEDULED |

### C01 — TerminalNotice (danger)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=danger
- **INSTANCE / ROLE:** Explica la cancelación
- **SOURCE COMPONENT:** TerminalNotice
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** TerminalNotice (CANCELLED)
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

- background: rgb(253, 236, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(242, 194, 196) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-alert lucide-alert-circle mt-0.5 shrink-0 text-danger (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Este evento fue cancelado La información que estaba antes queda disponible como "

#### STATE

- danger

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: texto a 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- —

### C02 — RestoreEventButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Devolver el evento cancelado a SCHEDULED
- **SOURCE COMPONENT:** Button + runTransition
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail (isTerminal) > Button «Restaurar el evento»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=603.45 y=676 w=179.98 h=46
- CSS: width: 179.984px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 179.984px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=155.45 dy=0 · padre 768×46

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Restaurar el evento"

#### STATE

- idle (busy mientras corre la transición)

#### INTERACTION

- trigger: click → runTransition('SCHEDULED', 'Restauración del evento cancelado')
- el botón queda busy con spinner mientras dura la transición

#### MOTION

- transition-colors duration-micro; el icono Loader2 gira con animate-spin

#### RESPONSIVE

- 390: min-height 44 px, en línea con «Ver historial»
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La transición CANCELLED → SCHEDULED es la única permitida desde CANCELLED en EVENT_TRANSITIONS.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
