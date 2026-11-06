# SURFACE MAP — CAL_EVENT_DETAIL_006_COMPLETED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_006_COMPLETED

**SCREEN ID:** CAL_EVENT_DETAIL_006_COMPLETED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Completed (composición terminal)

**PURPOSE AS IMPLEMENTED:** Cuando el evento está en un estado terminal el detalle usa una composición distinta: banner explicativo, resumen de referencia y, si el acta está finalizada, el resultado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-sic

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «GEI vs. SIC»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic

**RESOURCE STATE:** COMPLETED · record FINAL 3–1 · attendance cerrada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_007_CANCELLED, CAL_EVENT_DETAIL_008_POSTPONED

**RESPONSIVE COUNTERPART:** La composición terminal es más corta: no hay panel «Operación pendiente», ni control ¿Vas?, ni logística en dl. En 1440 sigue siendo una sola columna (max-w-3xl).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventDetail (isTerminal), TerminalNotice, DetailSection, HistoryList

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_006_COMPLETED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Este evento ya se jugó»
- **FOCAL 2:** Resultado final «3–1»
- **SUPPORTING:** Surface con fecha, sede y destino
- **SECONDARY:** Botón «Ver historial»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TerminalNotice | Banner tone=success | Explica el estado terminal del evento |
| C02 | FinalScore | p gei-l5 tabular-nums | Marcador oficial del partido |
| C03 | ReferenceSurface («Cómo estaba-coordinate») | Surface grid gap-2 con RowStatic | Conserva los datos del evento como referencia |

### C01 — TerminalNotice

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Explica el estado terminal del evento
- **SOURCE COMPONENT:** TerminalNotice
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** TerminalNotice (COMPLETED)
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

- contained-by div · offset dx=0 dy=156.63 · padre 358×816.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Este evento ya se jugó La convocatoria y la asistencia quedaron cerradas. Cualqu"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: el texto envuelve a 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Copy: «La convocatoria y la asistencia quedaron cerradas. Cualquier corrección pide un motivo y queda registrada.»

### C02 — FinalScore

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p gei-l5 tabular-nums
- **INSTANCE / ROLE:** Marcador oficial del partido
- **SOURCE COMPONENT:** EventDetail > DetailSection «Resultado final»
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail (state===COMPLETED && record.state==='FINAL')
- **PARENT:** section
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=757.94 w=358 h=24
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by section · offset dx=0 dy=33.25 · padre 358×90.94
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 20px · line-height: 24px · font-weight: 700 · letter-spacing: -0.3px

#### CONTENT

- visible: "3 – 1"

#### STATE

- FINAL

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: tipografía de 20 px (gei-l5), negrita 700
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Debajo aparece el texto de observaciones del acta: «Buen trabajo colectivo. Dos goles en el último cuarto.»

### C03 — ReferenceSurface («Cómo estaba-coordinate»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid gap-2 con RowStatic
- **INSTANCE / ROLE:** Conserva los datos del evento como referencia
- **SOURCE COMPONENT:** EventDetail (isTerminal) > Surface
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface (isTerminal)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=414.38 w=358 h=266.31
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · gap: 8px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=325.38 · padre 358×816.63
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cómo estaba-coordinate Fecha jueves, 15 de octubre de 2026 · 16:00 Sede GEI · Ca"

#### STATE

- referencia

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px (max-w-3xl)

#### IMPLEMENTATION NOTES

- El rótulo del encabezado es literalmente «Cómo estaba-coordinate» (cadena presente en el código).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1018 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el contenedor terminal es max-w-3xl (768 px) en ambos; a 390 el ancho útil es 358 px.
- La composición terminal no tiene el grid de 2 columnas con aside: es una sola columna.

# CAL_EVENT_DETAIL_006_COMPLETED

**SCREEN ID:** CAL_EVENT_DETAIL_006_COMPLETED

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — Completed (composición terminal)

**PURPOSE AS IMPLEMENTED:** Cuando el evento está en un estado terminal el detalle usa una composición distinta: banner explicativo, resumen de referencia y, si el acta está finalizada, el resultado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-sic

**ORIGIN:** CAL_CALENDAR_001_AGENDA → «GEI vs. SIC»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-sic

**RESOURCE STATE:** COMPLETED · record FINAL 3–1 · attendance cerrada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-sic?demo=coach.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_007_CANCELLED, CAL_EVENT_DETAIL_008_POSTPONED

**RESPONSIVE COUNTERPART:** La composición terminal es más corta: no hay panel «Operación pendiente», ni control ¿Vas?, ni logística en dl. En 1440 sigue siendo una sola columna (max-w-3xl).

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventDetail (isTerminal), TerminalNotice, DetailSection, HistoryList

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_006_COMPLETED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Este evento ya se jugó»
- **FOCAL 2:** Resultado final «3–1»
- **SUPPORTING:** Surface con fecha, sede y destino
- **SECONDARY:** Botón «Ver historial»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | TerminalNotice | Banner tone=success | Explica el estado terminal del evento |
| C02 | FinalScore | p gei-l5 tabular-nums | Marcador oficial del partido |
| C03 | ReferenceSurface («Cómo estaba-coordinate») | Surface grid gap-2 con RowStatic | Conserva los datos del evento como referencia |

### C01 — TerminalNotice

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Explica el estado terminal del evento
- **SOURCE COMPONENT:** TerminalNotice
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** TerminalNotice (COMPLETED)
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

- contained-by div · offset dx=0 dy=121.63 · padre 768×767.94
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Este evento ya se jugó La convocatoria y la asistencia quedaron cerradas. Cualqu"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: el texto envuelve a 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- Copy: «La convocatoria y la asistencia quedaron cerradas. Cualquier corrección pide un motivo y queda registrada.»

### C02 — FinalScore

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p gei-l5 tabular-nums
- **INSTANCE / ROLE:** Marcador oficial del partido
- **SOURCE COMPONENT:** EventDetail > DetailSection «Resultado final»
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail (state===COMPLETED && record.state==='FINAL')
- **PARENT:** section
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=709.25 w=768 h=24
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by section · offset dx=0 dy=33.25 · padre 768×90.94
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 20px · line-height: 24px · font-weight: 700 · letter-spacing: -0.3px

#### CONTENT

- visible: "3 – 1"

#### STATE

- FINAL

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: tipografía de 20 px (gei-l5), negrita 700
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Debajo aparece el texto de observaciones del acta: «Buen trabajo colectivo. Dos goles en el último cuarto.»

### C03 — ReferenceSurface («Cómo estaba-coordinate»)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Surface grid gap-2 con RowStatic
- **INSTANCE / ROLE:** Conserva los datos del evento como referencia
- **SOURCE COMPONENT:** EventDetail (isTerminal) > Surface
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventDetail > Surface (isTerminal)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=357.69 w=768 h=274.31
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 8px · padding: 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=268.69 · padre 768×767.94
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cómo estaba-coordinate Fecha jueves, 15 de octubre de 2026 · 16:00 Sede GEI · Ca"

#### STATE

- referencia

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px
- 1440: 768 px (max-w-3xl)

#### IMPLEMENTATION NOTES

- El rótulo del encabezado es literalmente «Cómo estaba-coordinate» (cadena presente en el código).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 921 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el contenedor terminal es max-w-3xl (768 px) en ambos; a 390 el ancho útil es 358 px.
- La composición terminal no tiene el grid de 2 columnas con aside: es una sola columna.
