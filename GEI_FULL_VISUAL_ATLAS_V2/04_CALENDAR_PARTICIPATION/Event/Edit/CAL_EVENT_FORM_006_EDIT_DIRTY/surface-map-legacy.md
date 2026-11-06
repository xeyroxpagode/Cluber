# SURFACE MAP — CAL_EVENT_FORM_006_EDIT_DIRTY

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_006_EDIT_DIRTY

**SCREEN ID:** CAL_EVENT_FORM_006_EDIT_DIRTY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — con cambios sin guardar

**PURPOSE AS IMPLEMENTED:** Estado del formulario tras modificar un campo: aparece el aviso «Hay cambios sin guardar», el botón «Descartar» y la clasificación material/no material del cambio.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/edit

**ORIGIN:** CAL_EVENT_FORM_005_EDIT → editar el título

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** DIRTY · cambio no material (sólo título)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/edit?demo=coach.
2. Escribir en el campo #field-title.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM

**RESPONSIVE COUNTERPART:** El aviso y el botón «Descartar» van en una fila flexible; en 390 caben en una línea.

**SOURCE FILES:** src/features/events.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm (dirty, below) , diffForm / isNonMaterialOnly

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_006_EDIT_DIRTY_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Aviso «Hay cambios sin guardar»
- **FOCAL 2:** Botón «Descartar»
- **SUPPORTING:** Nota sobre el carácter del cambio
- **SECONDARY:** Formulario
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DirtyNotice | span + Button quiet | Informa que hay cambios sin guardar y ofrece descartarlos |
| C02 | MaterialChangeNote | p gei-meta | Clasifica el cambio como material o de redacción |

### C01 — DirtyNotice

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span + Button quiet
- **INSTANCE / ROLE:** Informa que hay cambios sin guardar y ofrece descartarlos
- **SOURCE COMPONENT:** EventForm > below
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > PageContextHeader below (dirty)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=244.92 w=142.2 h=17.39
- CSS: width: 142.203px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 142.203px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=13.29 · padre 358×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(138, 75, 8) · border: 0px solid rgb(138, 75, 8) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Hay cambios sin guardar"

#### STATE

- attention (text-attention)

#### INTERACTION

- trigger: click en «Descartar» → abre el ConfirmDialog de descarte

#### MOTION

- transition-colors en el botón

#### RESPONSIVE

- 390: fila flex-wrap con gap 8 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — MaterialChangeNote

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Clasifica el cambio como material o de redacción
- **SOURCE COMPONENT:** EventForm
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > p (isNonMaterialOnly ? … : …)
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=2242.02 w=358 h=34.78
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=0 dy=1922.39 · padre 358×2046.17
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Es una corrección de redacción: no cambia el horario, así que no avisa a nadie n"

#### STATE

- visible con cambios

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- La clasificación: si el único campo cambiado es `title`, el cambio es de redacción y no pide impacto; si cambia algún campo material, el texto pasa a «Cambian N campos con impacto real: se avisa a los alcanzados.».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 2478 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el texto de la nota de impacto cambia de largo.

# CAL_EVENT_FORM_006_EDIT_DIRTY

**SCREEN ID:** CAL_EVENT_FORM_006_EDIT_DIRTY

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Edición de evento — con cambios sin guardar

**PURPOSE AS IMPLEMENTED:** Estado del formulario tras modificar un campo: aparece el aviso «Hay cambios sin guardar», el botón «Descartar» y la clasificación material/no material del cambio.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/edit

**ORIGIN:** CAL_EVENT_FORM_005_EDIT → editar el título

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** DIRTY · cambio no material (sólo título)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/edit?demo=coach.
2. Escribir en el campo #field-title.

**RELATED SCREEN IDS:** CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM

**RESPONSIVE COUNTERPART:** El aviso y el botón «Descartar» van en una fila flexible; en 390 caben en una línea.

**SOURCE FILES:** src/features/events.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** EventForm (dirty, below) , diffForm / isNonMaterialOnly

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_006_EDIT_DIRTY_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Aviso «Hay cambios sin guardar»
- **FOCAL 2:** Botón «Descartar»
- **SUPPORTING:** Nota sobre el carácter del cambio
- **SECONDARY:** Formulario
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | DirtyNotice | span + Button quiet | Informa que hay cambios sin guardar y ofrece descartarlos |
| C02 | MaterialChangeNote | p gei-meta | Clasifica el cambio como material o de redacción |

### C01 — DirtyNotice

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span + Button quiet
- **INSTANCE / ROLE:** Informa que hay cambios sin guardar y ofrece descartarlos
- **SOURCE COMPONENT:** EventForm > below
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > PageContextHeader below (dirty)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=222.42 w=142.2 h=17.39
- CSS: width: 142.203px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 142.203px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=13.29 · padre 768×44
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(138, 75, 8) · border: 0px solid rgb(138, 75, 8) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 500

#### CONTENT

- visible: "Hay cambios sin guardar"

#### STATE

- attention (text-attention)

#### INTERACTION

- trigger: click en «Descartar» → abre el ConfirmDialog de descarte

#### MOTION

- transition-colors en el botón

#### RESPONSIVE

- 390: fila flex-wrap con gap 8 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — MaterialChangeNote

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Clasifica el cambio como material o de redacción
- **SOURCE COMPONENT:** EventForm
- **SOURCE FILE:** src/features/events.tsx
- **SOURCE SYMBOL:** EventForm > p (isNonMaterialOnly ? … : …)
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=1810.33 w=768 h=17.39
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=0 dy=1513.2 · padre 768×1620.59
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Es una corrección de redacción: no cambia el horario, así que no avisa a nadie n"

#### STATE

- visible con cambios

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 2 líneas
- 1440: 1 línea

#### IMPLEMENTATION NOTES

- La clasificación: si el único campo cambiado es `title`, el cambio es de redacción y no pide impacto; si cambia algún campo material, el texto pasa a «Cambian N campos con impacto real: se avisa a los alcanzados.».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1982 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición; el texto de la nota de impacto cambia de largo.
