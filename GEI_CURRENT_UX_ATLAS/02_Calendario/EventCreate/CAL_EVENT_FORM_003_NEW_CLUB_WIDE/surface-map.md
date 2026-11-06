# SURFACE MAP — CAL_EVENT_FORM_003_NEW_CLUB_WIDE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# CAL_EVENT_FORM_003_NEW_CLUB_WIDE

**SCREEN ID:** CAL_EVENT_FORM_003_NEW_CLUB_WIDE

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — destino «Todo el hockey»

**PURPOSE AS IMPLEMENTED:** Al elegir destino de club desaparece el selector de equipos destino y queda sólo la opción de club.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/new

**ORIGIN:** CAL_EVENT_FORM_001_NEW → «Todo el hockey»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** clubWide=true

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.
2. Pulsar la opción «Todo el hockey».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_001_NEW

**RESPONSIVE COUNTERPART:** El fieldset «Equipos destino» desaparece; la sección «Quiénes van» queda con un solo radio group.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm (RadioGroup destino + {!form.clubWide && fieldset})

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_003_NEW_CLUB_WIDE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Opción «Todo el hockey» activa
- **FOCAL 2:** Sección «Quiénes van»
- **SUPPORTING:** Resto del formulario
- **SECONDARY:** —
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AudienceRadioGroup (columns=2) | RadioGroup | Destino: equipos concretos o todo el hockey |

### C01 — AudienceRadioGroup (columns=2)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RadioGroup
- **INSTANCE / ROLE:** Destino: equipos concretos o todo el hockey
- **SOURCE COMPONENT:** RadioGroup
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RadioGroup (name=event-audience, columns=2)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=322.31 w=324 h=121.69
- CSS: width: 324px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=54.25 · padre 358×192.94

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Destino Equipos concretos Todo el hockey"

#### STATE

- CLUB seleccionado

#### INTERACTION

- trigger: click en «Equipos concretos» → vuelve a mostrar el fieldset con los equipos

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 2 columnas de 324/2 px con etiquetas de ancho completo
- 1440: 2 columnas dentro de la columna

#### IMPLEMENTATION NOTES

- El nombre del grupo es event-audience; el valor interno es TEAM/CLUB aunque la etiqueta diga TEAMS/CLUB.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1963 · scrollY 726 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# CAL_EVENT_FORM_003_NEW_CLUB_WIDE

**SCREEN ID:** CAL_EVENT_FORM_003_NEW_CLUB_WIDE

**DOMAIN:** 02_Calendario

**SURFACE NAME:** Alta de evento — destino «Todo el hockey»

**PURPOSE AS IMPLEMENTED:** Al elegir destino de club desaparece el selector de equipos destino y queda sólo la opción de club.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/new

**ORIGIN:** CAL_EVENT_FORM_001_NEW → «Todo el hockey»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** clubWide=true

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/new?demo=coach.
2. Pulsar la opción «Todo el hockey».

**RELATED SCREEN IDS:** CAL_EVENT_FORM_001_NEW

**RESPONSIVE COUNTERPART:** El fieldset «Equipos destino» desaparece; la sección «Quiénes van» queda con un solo radio group.

**SOURCE FILES:** src/features/events.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** EventForm (RadioGroup destino + {!form.clubWide && fieldset})

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `CAL_EVENT_FORM_003_NEW_CLUB_WIDE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Opción «Todo el hockey» activa
- **FOCAL 2:** Sección «Quiénes van»
- **SUPPORTING:** Resto del formulario
- **SECONDARY:** —
- **AMBIENT:** Barra de acción fija

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AudienceRadioGroup (columns=2) | RadioGroup | Destino: equipos concretos o todo el hockey |

### C01 — AudienceRadioGroup (columns=2)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RadioGroup
- **INSTANCE / ROLE:** Destino: equipos concretos o todo el hockey
- **SOURCE COMPONENT:** RadioGroup
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RadioGroup (name=event-audience, columns=2)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=402.69 w=726 h=69.69
- CSS: width: 726px · min-width: min-content · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width min-content, max-width none

#### LAYOUT

- display: grid · grid-template-columns: none · gap: 8px · padding: 0px · min-height: auto · min-width: min-content

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=58.25 · padre 768×148.94

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Destino Equipos concretos Todo el hockey"

#### STATE

- CLUB seleccionado

#### INTERACTION

- trigger: click en «Equipos concretos» → vuelve a mostrar el fieldset con los equipos

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 2 columnas de 324/2 px con etiquetas de ancho completo
- 1440: 2 columnas dentro de la columna

#### IMPLEMENTATION NOTES

- El nombre del grupo es event-audience; el valor interno es TEAM/CLUB aunque la etiqueta diga TEAMS/CLUB.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: barra de acción sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1610 · scrollY 467 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
