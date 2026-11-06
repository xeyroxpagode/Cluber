# SURFACE MAP — CAL_EVENT_DETAIL_009_PLAYER_VIEW

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_DETAIL_009_PLAYER_VIEW

**SCREEN ID:** CAL_EVENT_DETAIL_009_PLAYER_VIEW

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — vista PLAYER (convocada)

**PURPOSE AS IMPLEMENTED:** El mismo evento visto por una jugadora convocada: aparece el banner «Estás convocada», el control ¿Vas? editable y no hay panel de operación.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-cuba, p2 (convocada, published)

**RESOURCE STATE:** SCHEDULED · p2 en la convocatoria publicada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=player.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**RESPONSIVE COUNTERPART:** La diferencia no es de viewport sino de autoridad: desaparece el bloque «Operación pendiente» y aparece el control ¿Vas? con las tres opciones.

**SOURCE FILES:** src/features/events.tsx, src/shared/vas.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail (meInvited / canRespondHere), VasControl, Banner tone=selected

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_009_PLAYER_VIEW_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Control «¿Vas?» con las tres opciones
- **FOCAL 2:** Banner azul «Estás convocada para este partido»
- **SUPPORTING:** Tu respuesta actual
- **SECONDARY:** «Quién dijo qué» y logística
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConvocadaBanner | Banner tone=selected | Informa que la convocatoria está publicada |
| C02 | VasControl editable | RadioGroup de 3 opciones + estado «Tu respuesta» | Único control de respuesta de disponibilidad |

### C01 — ConvocadaBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=selected
- **INSTANCE / ROLE:** Informa que la convocatoria está publicada
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=selected
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=278.22 w=358 h=124.75
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×1400.22
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 205, 236) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-selected (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Estás convocada para este partido Tu convocatoria está publicada. Si algo cambia"

#### STATE

- selected

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: texto a 3 líneas
- 1440: 2 líneas

#### IMPLEMENTATION NOTES

- Aparece sólo si el actor está en event.published.

### C02 — VasControl editable

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup de 3 opciones + estado «Tu respuesta»
- **INSTANCE / ROLE:** Único control de respuesta de disponibilidad
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (RadioGroup columns=3)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=475.66 w=324 h=69.69
- CSS: width: 324px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=31.69 · padre 324×101.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Vas? Voy Tal vez No voy"

#### STATE

- idle con respuesta «Sin responder» (p2 no respondió)

#### INTERACTION

- trigger: click en «Voy» / «Tal vez» / «No voy» → respondAvailability + toast «Respuesta guardada.»
- el estado de la respuesta se muestra en «Tu respuesta: …» con aria-live=polite

#### MOTION

- transition-colors duration-micro en las etiquetas

#### RESPONSIVE

- 390: 3 columnas de 100 px; la etiqueta activa usa border-interactive bg-selected-soft text-selected
- 1440: 3 columnas más anchas dentro de la columna principal

#### IMPLEMENTATION NOTES

- La opción activa se marca con `border-current` cuando la opción trae tono propio: success → bg-success-soft, warning → bg-warning-soft, danger → bg-danger-soft.
- El input es sr-only; el label es el objetivo del toque (min-h-11).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2089 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el control ¿Vas? usa RadioGroup con columns=3 → tres celdas de ~100 px en 390 y tres celdas más anchas en 1440.
- El bloque de gestión «Operación pendiente» no se renderiza: el actor no puede operar el evento.

# CAL_EVENT_DETAIL_009_PLAYER_VIEW

**SCREEN ID:** CAL_EVENT_DETAIL_009_PLAYER_VIEW

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Detalle de evento — vista PLAYER (convocada)

**PURPOSE AS IMPLEMENTED:** El mismo evento visto por una jugadora convocada: aparece el banner «Estás convocada», el control ¿Vas? editable y no hay panel de operación.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_CALENDAR_001_AGENDA → evento (actor PLAYER)

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-cuba, p2 (convocada, published)

**RESOURCE STATE:** SCHEDULED · p2 en la convocatoria publicada

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=player.

**RELATED SCREEN IDS:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH, CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**RESPONSIVE COUNTERPART:** La diferencia no es de viewport sino de autoridad: desaparece el bloque «Operación pendiente» y aparece el control ¿Vas? con las tres opciones.

**SOURCE FILES:** src/features/events.tsx, src/shared/vas.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventDetail (meInvited / canRespondHere), VasControl, Banner tone=selected

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_DETAIL_009_PLAYER_VIEW_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Control «¿Vas?» con las tres opciones
- **FOCAL 2:** Banner azul «Estás convocada para este partido»
- **SUPPORTING:** Tu respuesta actual
- **SECONDARY:** «Quién dijo qué» y logística
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ConvocadaBanner | Banner tone=selected | Informa que la convocatoria está publicada |
| C02 | VasControl editable | RadioGroup de 3 opciones + estado «Tu respuesta» | Único control de respuesta de disponibilidad |

### C01 — ConvocadaBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=selected
- **INSTANCE / ROLE:** Informa que la convocatoria está publicada
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=selected
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=384 y=220.72 w=552 h=103.06
- CSS: width: 552px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 552px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 552×1355.45
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(230, 238, 250) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 205, 236) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-selected (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Estás convocada para este partido Tu convocatoria está publicada. Si algo cambia"

#### STATE

- selected

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: texto a 3 líneas
- 1440: 2 líneas

#### IMPLEMENTATION NOTES

- Aparece sólo si el actor está en event.published.

### C02 — VasControl editable

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** RadioGroup de 3 opciones + estado «Tu respuesta»
- **INSTANCE / ROLE:** Único control de respuesta de disponibilidad
- **SOURCE COMPONENT:** VasControl
- **SOURCE FILE:** src/shared/vas.tsx
- **SOURCE SYMBOL:** VasControl (RadioGroup columns=3)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=405 y=400.47 w=510 h=69.69
- CSS: width: 510px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 510px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=31.69 · padre 510×101.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "¿Vas? Voy Tal vez No voy"

#### STATE

- idle con respuesta «Sin responder» (p2 no respondió)

#### INTERACTION

- trigger: click en «Voy» / «Tal vez» / «No voy» → respondAvailability + toast «Respuesta guardada.»
- el estado de la respuesta se muestra en «Tu respuesta: …» con aria-live=polite

#### MOTION

- transition-colors duration-micro en las etiquetas

#### RESPONSIVE

- 390: 3 columnas de 100 px; la etiqueta activa usa border-interactive bg-selected-soft text-selected
- 1440: 3 columnas más anchas dentro de la columna principal

#### IMPLEMENTATION NOTES

- La opción activa se marca con `border-current` cuando la opción trae tono propio: success → bg-success-soft, warning → bg-warning-soft, danger → bg-danger-soft.
- El input es sr-only; el label es el objetivo del toque (min-h-11).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1640 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el control ¿Vas? usa RadioGroup con columns=3 → tres celdas de ~100 px en 390 y tres celdas más anchas en 1440.
- El bloque de gestión «Operación pendiente» no se renderiza: el actor no puede operar el evento.
