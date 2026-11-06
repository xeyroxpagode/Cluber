# SURFACE MAP — PRT_MATCH_RECORD_002_EDITABLE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_MATCH_RECORD_002_EDITABLE

**SCREEN ID:** PRT_MATCH_RECORD_002_EDITABLE

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — en edición

**PURPOSE AS IMPLEMENTED:** Acta editable de un partido en curso: los campos se habilitan, el resultado puede finalizarse y aparece el botón «Finalizar resultado».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-lomas/match-record

**ORIGIN:** PRT_MATCH_RECORD_001_NOT_STARTED → «Cargar el resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** IN_PROGRESS · record DRAFT 1–1 · editing=true

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/match-record?demo=coach.
2. Pulsar «Cargar el resultado».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_004_FINALIZE_CONFIRM, PRT_MATCH_RECORD_001_NOT_STARTED

**RESPONSIVE COUNTERPART:** Los campos de goles se reparten en 2 columnas a partir de sm.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** MatchRecordPage (editing), RadioGroup, input type=number, Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_002_EDITABLE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Marcador editable «1 – 1»
- **FOCAL 2:** Botón «Finalizar resultado»
- **SUPPORTING:** RadioGroup «Situación del partido»
- **SECONDARY:** Campos numéricos de goles y «Cómo se vio»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | GoalsInputs | label con input[type=number] | Marcador editable |
| C02 | FinalizeRecordButton | Button primary | Finalizar el acta |

### C01 — GoalsInputs

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** label con input[type=number]
- **INSTANCE / ROLE:** Marcador editable
- **SOURCE COMPONENT:** MatchRecordPage (input type=number)
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** MatchRecordPage > label > input[type=number]
- **PARENT:** label
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=231.94 w=324 h=44
- CSS: width: 324px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by label · offset dx=0 dy=27.69 · padre 324×71.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- enabled (editing=true)

#### INTERACTION

- trigger: escribir → actualiza el formulario local
- min=0 max=99

#### MOTION

- Sin transición declarada en el control

#### RESPONSIVE

- 390: apilados, ancho completo de la columna
- 1440: sm:grid-cols-2: dos columnas

#### IMPLEMENTATION NOTES

- El label («Goles GEI» / «Goles del rival») va en text-body font-semibold, sin el sufijo «OBLIGATORIO» del primitive Field: son inputs nativos con su propio label.
- El input usa gei-target (44 px), borde border-line-strong y tabular-nums.

### C02 — FinalizeRecordButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Finalizar el acta
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary «Finalizar resultado»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=510.38 w=170.64 h=44
- CSS: width: 170.641px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 170.641px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 324×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 0.45
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Finalizar resultado"

#### STATE

- disabled mientras el marcador no cambie

#### INTERACTION

- trigger: click → abre el ConfirmDialog de finalización

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La condición de habilitación: el marcador cambió o hay observaciones escritas.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1207 · scrollY 363 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el bloque de goles es de 2 columnas en 1440.

# PRT_MATCH_RECORD_002_EDITABLE

**SCREEN ID:** PRT_MATCH_RECORD_002_EDITABLE

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — en edición

**PURPOSE AS IMPLEMENTED:** Acta editable de un partido en curso: los campos se habilitan, el resultado puede finalizarse y aparece el botón «Finalizar resultado».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-lomas/match-record

**ORIGIN:** PRT_MATCH_RECORD_001_NOT_STARTED → «Cargar el resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-lomas

**RESOURCE STATE:** IN_PROGRESS · record DRAFT 1–1 · editing=true

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-lomas/match-record?demo=coach.
2. Pulsar «Cargar el resultado».

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_004_FINALIZE_CONFIRM, PRT_MATCH_RECORD_001_NOT_STARTED

**RESPONSIVE COUNTERPART:** Los campos de goles se reparten en 2 columnas a partir de sm.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** MatchRecordPage (editing), RadioGroup, input type=number, Button variant=primary

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_002_EDITABLE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Marcador editable «1 – 1»
- **FOCAL 2:** Botón «Finalizar resultado»
- **SUPPORTING:** RadioGroup «Situación del partido»
- **SECONDARY:** Campos numéricos de goles y «Cómo se vio»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | GoalsInputs | label con input[type=number] | Marcador editable |
| C02 | FinalizeRecordButton | Button primary | Finalizar el acta |

### C01 — GoalsInputs

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** label con input[type=number]
- **INSTANCE / ROLE:** Marcador editable
- **SOURCE COMPONENT:** MatchRecordPage (input type=number)
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** MatchRecordPage > label > input[type=number]
- **PARENT:** label
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=428.88 w=355 h=44
- CSS: width: 355px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 355px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by label · offset dx=0 dy=27.69 · padre 355×71.69
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- enabled (editing=true)

#### INTERACTION

- trigger: escribir → actualiza el formulario local
- min=0 max=99

#### MOTION

- Sin transición declarada en el control

#### RESPONSIVE

- 390: apilados, ancho completo de la columna
- 1440: sm:grid-cols-2: dos columnas

#### IMPLEMENTATION NOTES

- El label («Goles GEI» / «Goles del rival») va en text-body font-semibold, sin el sufijo «OBLIGATORIO» del primitive Field: son inputs nativos con su propio label.
- El input usa gei-target (44 px), borde border-line-strong y tabular-nums.

### C02 — FinalizeRecordButton

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button primary
- **INSTANCE / ROLE:** Finalizar el acta
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=primary «Finalizar resultado»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=619.63 w=170.64 h=44
- CSS: width: 170.641px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 170.641px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 726×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 0.45
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Finalizar resultado"

#### STATE

- disabled mientras el marcador no cambie

#### INTERACTION

- trigger: click → abre el ConfirmDialog de finalización

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- La condición de habilitación: el marcador cambió o hay observaciones escritas.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1012 · scrollY 112 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el bloque de goles es de 2 columnas en 1440.
