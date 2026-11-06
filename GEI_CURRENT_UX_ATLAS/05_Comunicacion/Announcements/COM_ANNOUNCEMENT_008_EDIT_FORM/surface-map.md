# SURFACE MAP — COM_ANNOUNCEMENT_008_EDIT_FORM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_ANNOUNCEMENT_008_EDIT_FORM

**SCREEN ID:** COM_ANNOUNCEMENT_008_EDIT_FORM

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — corrección de publicado

**PURPOSE AS IMPLEMENTED:** Formulario de corrección de un comunicado ya publicado: la audiencia queda bloqueada y se exige un motivo de la corrección.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /announcements/a1/edit

**ORIGIN:** COM_ANNOUNCEMENT_003_MENU_OPEN → «Corregir título o cuerpo»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1 (PUBLISHED)

**RESOURCE STATE:** EDICIÓN DE PUBLICADO · audiencia inmutable

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1/edit?demo=subcommittee.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_007_NEW_FORM

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AnnouncementForm (existing && published)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_008_EDIT_FORM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner neutro «La audiencia no se puede cambiar»
- **FOCAL 2:** Campo «Por qué lo corregís»
- **SUPPORTING:** Título «Corregir: {título}»
- **SECONDARY:** Botón «Guardar corrección»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ImmutableAudienceBanner | Banner tone=neutral | Informa que la audiencia del publicado no se puede cambiar |
| C02 | CorrectionReasonTextArea | TextArea required rows=3 | Motivo obligatorio de la corrección |

### C01 — ImmutableAudienceBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=neutral
- **INSTANCE / ROLE:** Informa que la audiencia del publicado no se puede cambiar
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=neutral (published)
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=681.2 w=358 h=196
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · gap: 16px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=0 dy=387.95 · padre 358×840.09
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Audiencia Inmutable desde la publicación La audiencia no se puede cambiar Este c"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas
- 1440: 672 px, 2 líneas

#### IMPLEMENTATION NOTES

- El SectionHeader de la sección muestra el meta «Inmutable desde la publicación».

### C02 — CorrectionReasonTextArea

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextArea required rows=3
- **INSTANCE / ROLE:** Motivo obligatorio de la corrección
- **SOURCE COMPONENT:** TextArea / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (id=af-reason)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=965.28 w=324 h=87.06
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 324×138.14
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → guarda el motivo; sin motivo no se puede enviar

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324 px, 3 filas
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Queda en el historial junto con la versión anterior.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

Contenedores con scroll propio detectados en esta captura:

- textarea#af-body · overflow-y: auto · client-height 194 · scroll-height 237 · scroll-top 0

- Medición de documento: scrollWidth 390 · scrollHeight 1245 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# COM_ANNOUNCEMENT_008_EDIT_FORM

**SCREEN ID:** COM_ANNOUNCEMENT_008_EDIT_FORM

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — corrección de publicado

**PURPOSE AS IMPLEMENTED:** Formulario de corrección de un comunicado ya publicado: la audiencia queda bloqueada y se exige un motivo de la corrección.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /announcements/a1/edit

**ORIGIN:** COM_ANNOUNCEMENT_003_MENU_OPEN → «Corregir título o cuerpo»

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** a1 (PUBLISHED)

**RESOURCE STATE:** EDICIÓN DE PUBLICADO · audiencia inmutable

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /announcements/a1/edit?demo=subcommittee.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_007_NEW_FORM

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** AnnouncementForm (existing && published)

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_008_EDIT_FORM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Banner neutro «La audiencia no se puede cambiar»
- **FOCAL 2:** Campo «Por qué lo corregís»
- **SUPPORTING:** Título «Corregir: {título}»
- **SECONDARY:** Botón «Guardar corrección»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ImmutableAudienceBanner | Banner tone=neutral | Informa que la audiencia del publicado no se puede cambiar |
| C02 | CorrectionReasonTextArea | TextArea required rows=3 | Motivo obligatorio de la corrección |

### C01 — ImmutableAudienceBanner

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Banner tone=neutral
- **INSTANCE / ROLE:** Informa que la audiencia del publicado no se puede cambiar
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=neutral (published)
- **PARENT:** form
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=659.58 w=672 h=182.31
- CSS: width: 672px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 672px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 630px · gap: 16px · padding: 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by form · offset dx=0 dy=395.95 · padre 672×842.41
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Audiencia Inmutable desde la publicación La audiencia no se puede cambiar Este c"

#### STATE

- neutral

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 3 líneas
- 1440: 672 px, 2 líneas

#### IMPLEMENTATION NOTES

- El SectionHeader de la sección muestra el meta «Inmutable desde la publicación».

### C02 — CorrectionReasonTextArea

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** TextArea required rows=3
- **INSTANCE / ROLE:** Motivo obligatorio de la corrección
- **SOURCE COMPONENT:** TextArea / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (id=af-reason)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=517 y=933.97 w=630 h=87.06
- CSS: width: 630px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 630px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 630×138.14
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → guarda el motivo; sin motivo no se puede enviar

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324 px, 3 filas
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El hint dice «Queda en el historial junto con la versión anterior.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1170 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
