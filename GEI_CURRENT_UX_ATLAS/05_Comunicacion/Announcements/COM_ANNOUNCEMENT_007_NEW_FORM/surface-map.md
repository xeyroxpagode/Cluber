# SURFACE MAP — COM_ANNOUNCEMENT_007_NEW_FORM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_ANNOUNCEMENT_007_NEW_FORM

**SCREEN ID:** COM_ANNOUNCEMENT_007_NEW_FORM

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — alta

**PURPOSE AS IMPLEMENTED:** Formulario de alta de comunicado: título, cuerpo y elección de audiencia antes de publicar.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication/announcements/new

**ORIGIN:** Comunicación → botón «Publicar comunicado» (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** equipos activa: primera, quinta, sexta, septima

**RESOURCE STATE:** FORMULARIO VACÍO · audiencia por defecto = club

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/announcements/new?demo=subcommittee.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_008_EDIT_FORM, COM_ANNOUNCEMENT_009_NO_AUTHORITY_NEW

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl; el cuerpo es un textarea de 8 filas (195,5 px de alto).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AnnouncementForm, TextField, TextArea, SegmentedControl, Surface, SectionHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_007_NEW_FORM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos «Título» y «Cuerpo»
- **FOCAL 2:** Sección «Audiencia» con el control segmentado
- **SUPPORTING:** Nota sobre el registro de la audiencia
- **SECONDARY:** Botones «Guardar borrador» y «Publicar comunicado»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AnnouncementBodyTextArea | TextArea rows=8 | Cuerpo del comunicado |
| C02 | AudienceSegmentedControl | SegmentedControl | Audiencia: todo el hockey o equipos concretos |
| C03 | AudienceSnapshotNote | p gei-meta | Explica que la audiencia queda congelada al publicar |

### C01 — AnnouncementBodyTextArea

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextArea rows=8
- **INSTANCE / ROLE:** Cuerpo del comunicado
- **SOURCE COMPONENT:** TextArea / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (id=af-body)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=396.58 w=324 h=195.5
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 324×246.58
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → setBody

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×195,5 px; el hint «Texto plano. Los saltos de línea se respetan.» va arriba del control
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El cuerpo se guarda como texto plano con saltos de línea y se re-renderiza partido por párrafo doble salto en la lectura.

### C02 — AudienceSegmentedControl

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** SegmentedControl
- **INSTANCE / ROLE:** Audiencia: todo el hockey o equipos concretos
- **SOURCE COMPONENT:** SegmentedControl
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** SegmentedControl (audiencia del comunicado)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=683.33 w=324 h=50
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 2px · padding: 2px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=54.25 · padre 358×172.03

#### VISUAL CONFIGURATION

- background: rgb(247, 249, 252) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Todo el hockey Equipos concretos"

#### STATE

- CLUB seleccionado («Todo el hockey»)

#### INTERACTION

- trigger: click en «Equipos concretos» → muestra el selector de equipos y valida que se elija al menos uno

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: inline-flex con borde y fondo bg-control
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El valor por defecto al crear es «Todo el hockey» (clubWide = true).

### C03 — AudienceSnapshotNote

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Explica que la audiencia queda congelada al publicar
- **SOURCE COMPONENT:** AnnouncementForm
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** AnnouncementForm > p (nota de audiencia)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=749.33 w=324 h=34.78
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=120.25 · padre 358×172.03

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Cuando publiques queda registrada una copia exacta de quién lo va a ver. Después"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 2 líneas
- 1440: 672 px, 1 línea

#### IMPLEMENTATION NOTES

- Copy: «Cuando publiques queda registrada una copia exacta de quién lo va a ver. Después no se recalcula.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1031 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el formulario es de una columna; la retícula de equipos destino usa sm:grid-cols-2 a partir de 640 px.

# COM_ANNOUNCEMENT_007_NEW_FORM

**SCREEN ID:** COM_ANNOUNCEMENT_007_NEW_FORM

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicado — alta

**PURPOSE AS IMPLEMENTED:** Formulario de alta de comunicado: título, cuerpo y elección de audiencia antes de publicar.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication/announcements/new

**ORIGIN:** Comunicación → botón «Publicar comunicado» (actor SUBCOMMITTEE)

**ACTOR:** SUBCOMMITTEE

**RESOURCE / FIXTURE IDS:** equipos activa: primera, quinta, sexta, septima

**RESOURCE STATE:** FORMULARIO VACÍO · audiencia por defecto = club

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication/announcements/new?demo=subcommittee.

**RELATED SCREEN IDS:** COM_ANNOUNCEMENT_008_EDIT_FORM, COM_ANNOUNCEMENT_009_NO_AUTHORITY_NEW

**RESPONSIVE COUNTERPART:** Contenedor max-w-2xl; el cuerpo es un textarea de 8 filas (195,5 px de alto).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** AnnouncementForm, TextField, TextArea, SegmentedControl, Surface, SectionHeader

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_ANNOUNCEMENT_007_NEW_FORM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Campos «Título» y «Cuerpo»
- **FOCAL 2:** Sección «Audiencia» con el control segmentado
- **SUPPORTING:** Nota sobre el registro de la audiencia
- **SECONDARY:** Botones «Guardar borrador» y «Publicar comunicado»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AnnouncementBodyTextArea | TextArea rows=8 | Cuerpo del comunicado |
| C02 | AudienceSegmentedControl | SegmentedControl | Audiencia: todo el hockey o equipos concretos |
| C03 | AudienceSnapshotNote | p gei-meta | Explica que la audiencia queda congelada al publicar |

### C01 — AnnouncementBodyTextArea

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** TextArea rows=8
- **INSTANCE / ROLE:** Cuerpo del comunicado
- **SOURCE COMPONENT:** TextArea / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextArea (id=af-body)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=517 y=400.58 w=630 h=195.5
- CSS: width: 630px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 630px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=51.08 · padre 630×246.58
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- vacío, required

#### INTERACTION

- trigger: escribir → setBody

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 324×195,5 px; el hint «Texto plano. Los saltos de línea se respetan.» va arriba del control
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El cuerpo se guarda como texto plano con saltos de línea y se re-renderiza partido por párrafo doble salto en la lectura.

### C02 — AudienceSegmentedControl

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** SegmentedControl
- **INSTANCE / ROLE:** Audiencia: todo el hockey o equipos concretos
- **SOURCE COMPONENT:** SegmentedControl
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** SegmentedControl (audiencia del comunicado)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=517 y=695.33 w=630 h=50
- CSS: width: 630px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 630px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: normal · gap: 2px · padding: 2px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=58.25 · padre 672×162.64

#### VISUAL CONFIGURATION

- background: rgb(247, 249, 252) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Todo el hockey Equipos concretos"

#### STATE

- CLUB seleccionado («Todo el hockey»)

#### INTERACTION

- trigger: click en «Equipos concretos» → muestra el selector de equipos y valida que se elija al menos uno

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: inline-flex con borde y fondo bg-control
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El valor por defecto al crear es «Todo el hockey» (clubWide = true).

### C03 — AudienceSnapshotNote

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** p gei-meta
- **INSTANCE / ROLE:** Explica que la audiencia queda congelada al publicar
- **SOURCE COMPONENT:** AnnouncementForm
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** AnnouncementForm > p (nota de audiencia)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=517 y=761.33 w=630 h=17.39
- CSS: width: 630px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 630px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=124.25 · padre 672×162.64

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(86, 97, 111) · border: 0px solid rgb(86, 97, 111) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Cuando publiques queda registrada una copia exacta de quién lo va a ver. Después"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358 px, 2 líneas
- 1440: 672 px, 1 línea

#### IMPLEMENTATION NOTES

- Copy: «Cuando publiques queda registrada una copia exacta de quién lo va a ver. Después no se recalcula.»

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 930 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el formulario es de una columna; la retícula de equipos destino usa sm:grid-cols-2 a partir de 640 px.
