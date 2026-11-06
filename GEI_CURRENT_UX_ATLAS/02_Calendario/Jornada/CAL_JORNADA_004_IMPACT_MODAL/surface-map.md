# SURFACE MAP — CAL_JORNADA_004_IMPACT_MODAL

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_JORNADA_004_IMPACT_MODAL

**SCREEN ID:** CAL_JORNADA_004_IMPACT_MODAL

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — modal de impacto tras guardar

**PURPOSE AS IMPLEMENTED:** Modal de confirmación del guardado de la organización de la jornada, con el detalle de los partidos afectados.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /jornadas/j1

**ORIGIN:** CAL_JORNADA_001_DETAIL → cambiar la sede → «Guardar jornada»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** j1, match-cuba

**RESOURCE STATE:** GUARDADO · modal de impacto abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/j1?demo=coach.
2. Elegir la sede CUBA en el select de «Sede de la jornada».
3. Pulsar «Guardar jornada».

**RELATED SCREEN IDS:** CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** JornadaDetail > Modal «Jornada actualizada», Banner tone=success, ImpactPreview

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_004_IMPACT_MODAL_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Guardamos los cambios de la jornada»
- **FOCAL 2:** Lista de partidos actualizados
- **SUPPORTING:** Explicación de la reconfirmación
- **SECONDARY:** Botón de cierre
- **AMBIENT:** Detalle de jornada atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | JornadaUpdatedModal | section[role=dialog] | Confirmación del guardado con el impacto |
| C02 | SuccessBanner | Banner tone=success | Confirma el guardado |

### C01 — JornadaUpdatedModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del guardado con el impacto
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=558 w=390 h=286
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=558 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px 16px 0px 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Jornada actualizada Guardamos los cambios de la jornada Los partidos actualizado"

#### STATE

- open

#### INTERACTION

- trigger: Escape o X → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El modal se abre después de updateJornada, que ya aplicó el cambio y registró la auditoría.

### C02 — SuccessBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Confirma el guardado
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=647 w=350 h=124.75
- CSS: width: 350px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=20 dy=16 · padre 390×213

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Guardamos los cambios de la jornada Los partidos actualizados quedaron con horar"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1208 · scrollY 364 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.

# CAL_JORNADA_004_IMPACT_MODAL

**SCREEN ID:** CAL_JORNADA_004_IMPACT_MODAL

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Jornada — modal de impacto tras guardar

**PURPOSE AS IMPLEMENTED:** Modal de confirmación del guardado de la organización de la jornada, con el detalle de los partidos afectados.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /jornadas/j1

**ORIGIN:** CAL_JORNADA_001_DETAIL → cambiar la sede → «Guardar jornada»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** j1, match-cuba

**RESOURCE STATE:** GUARDADO · modal de impacto abierto

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /jornadas/j1?demo=coach.
2. Elegir la sede CUBA en el select de «Sede de la jornada».
3. Pulsar «Guardar jornada».

**RELATED SCREEN IDS:** CAL_JORNADA_001_DETAIL

**RESPONSIVE COUNTERPART:** Modal: hoja inferior en 390, diálogo centrado de 512 px en 1440.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** JornadaDetail > Modal «Jornada actualizada», Banner tone=success, ImpactPreview

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_JORNADA_004_IMPACT_MODAL_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner verde «Guardamos los cambios de la jornada»
- **FOCAL 2:** Lista de partidos actualizados
- **SUPPORTING:** Explicación de la reconfirmación
- **SECONDARY:** Botón de cierre
- **AMBIENT:** Detalle de jornada atenuado

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | JornadaUpdatedModal | section[role=dialog] | Confirmación del guardado con el impacto |
| C02 | SuccessBanner | Banner tone=success | Confirma el guardado |

### C01 — JornadaUpdatedModal

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Confirmación del guardado con el impacto
- **SOURCE COMPONENT:** Modal
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Modal
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=464 y=317.84 w=512 h=264.31
- CSS: width: 512px · min-width: auto · min-height: auto · max-width: 512px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 512px, min-width auto, max-width 512px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 512px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=464 dy=317.84 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 16px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Jornada actualizada Guardamos los cambios de la jornada Los partidos actualizado"

#### STATE

- open

#### INTERACTION

- trigger: Escape o X → cierra

#### MOTION

- Sin animación

#### RESPONSIVE

- 390: ancho completo abajo
- 1440: 512 px centrado

#### IMPLEMENTATION NOTES

- El modal se abre después de updateJornada, que ya aplicó el cambio y registró la auditoría.

### C02 — SuccessBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=success
- **INSTANCE / ROLE:** Confirma el guardado
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=success
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=484 y=406.84 w=472 h=103.06
- CSS: width: 472px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 472px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=20 dy=16 · padre 512×191.31

#### VISUAL CONFIGURATION

- background: rgb(231, 244, 236) · color: rgb(16, 23, 37) · border: 1px solid rgb(185, 223, 201) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 mt-0.5 shrink-0 text-success (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Guardamos los cambios de la jornada Los partidos actualizados quedaron con horar"

#### STATE

- success

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del modal
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1058 · scrollY 158 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo Modal.
