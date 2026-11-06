# SURFACE MAP — PRT_SELECTION_002_DRAFT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_002_DRAFT

**SCREEN ID:** PRT_SELECTION_002_DRAFT

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — sin publicar

**PURPOSE AS IMPLEMENTED:** Convocatoria de un evento que nunca se publicó: el badge dice «Borrador», el botón de la barra dice «Publicar convocatoria» y la sección de revisiones está vacía.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** Detalle de evento → «Convocadas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1

**RESOURCE STATE:** DRAFT · published = null

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.

**RELATED SCREEN IDS:** PRT_SELECTION_001_PUBLISHED, PRT_SELECTION_005_PUBLISH_CONFIRM

**RESPONSIVE COUNTERPART:** Misma composición que la convocatoria publicada.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SelectionPage, StateBadge value=DRAFT, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_002_DRAFT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de convocadas sin marcar
- **FOCAL 2:** Badge «Borrador»
- **SUPPORTING:** Texto «Sin publicar» en la barra de acción
- **SECONDARY:** Revisiones publicadas (vacía)
- **AMBIENT:** Barra de publicación fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StateBadge (Borrador) | span badge emphasis | Estado de publicación |
| C02 | PublishSelectionButton (sin publicar) | Button secondary disabled | Publicar la convocatoria por primera vez |

### C01 — StateBadge (Borrador)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span badge emphasis
- **INSTANCE / ROLE:** Estado de publicación
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=DRAFT emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=209.13 w=67.22 h=23
- CSS: width: 67.2188px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 67.2188px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Borrador"

#### STATE

- DRAFT → neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — PublishSelectionButton (sin publicar)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary disabled
- **INSTANCE / ROLE:** Publicar la convocatoria por primera vez
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button (published === null ? 'Publicar convocatoria' : 'Publicar cambios')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=175.75 y=722 w=198.25 h=46
- CSS: width: 198.25px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 198.25px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 198.25×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 0.45
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar convocatoria"

#### STATE

- disabled (dirty=false)

#### INTERACTION

- trigger: click (habilitado tras marcar a alguien) → abre el ConfirmDialog

#### MOTION

- transition-colors duration-micro; disabled:opacity-45

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1161 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# PRT_SELECTION_002_DRAFT

**SCREEN ID:** PRT_SELECTION_002_DRAFT

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — sin publicar

**PURPOSE AS IMPLEMENTED:** Convocatoria de un evento que nunca se publicó: el badge dice «Borrador», el botón de la barra dice «Publicar convocatoria» y la sección de revisiones está vacía.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** Detalle de evento → «Convocadas»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1

**RESOURCE STATE:** DRAFT · published = null

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.

**RELATED SCREEN IDS:** PRT_SELECTION_001_PUBLISHED, PRT_SELECTION_005_PUBLISH_CONFIRM

**RESPONSIVE COUNTERPART:** Misma composición que la convocatoria publicada.

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** SelectionPage, StateBadge value=DRAFT, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_002_DRAFT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de convocadas sin marcar
- **FOCAL 2:** Badge «Borrador»
- **SUPPORTING:** Texto «Sin publicar» en la barra de acción
- **SECONDARY:** Revisiones publicadas (vacía)
- **AMBIENT:** Barra de publicación fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | StateBadge (Borrador) | span badge emphasis | Estado de publicación |
| C02 | PublishSelectionButton (sin publicar) | Button secondary disabled | Publicar la convocatoria por primera vez |

### C01 — StateBadge (Borrador)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** span badge emphasis
- **INSTANCE / ROLE:** Estado de publicación
- **SOURCE COMPONENT:** StateBadge
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** StateBadge value=DRAFT emphasis
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1212.78 y=137 w=67.22 h=23
- CSS: width: 67.2188px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 67.2188px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 6px · padding: 4px 8px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 67.22×23
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(238, 241, 245) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 15px · font-weight: 600

#### CONTENT

- visible: "Borrador"

#### STATE

- DRAFT → neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: inline-flex
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — PublishSelectionButton (sin publicar)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Button secondary disabled
- **INSTANCE / ROLE:** Publicar la convocatoria por primera vez
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button (published === null ? 'Publicar convocatoria' : 'Publicar cambios')
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1064.75 y=841 w=198.25 h=46
- CSS: width: 198.25px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 198.25px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 198.25×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 0.45
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Publicar convocatoria"

#### STATE

- disabled (dirty=false)

#### INTERACTION

- trigger: click (habilitado tras marcar a alguien) → abre el ConfirmDialog

#### MOTION

- transition-colors duration-micro; disabled:opacity-45

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de publicación sticky
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1095 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
