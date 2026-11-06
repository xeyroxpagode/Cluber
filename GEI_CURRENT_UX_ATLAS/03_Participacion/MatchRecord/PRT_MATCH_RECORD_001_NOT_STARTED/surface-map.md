# SURFACE MAP — PRT_MATCH_RECORD_001_NOT_STARTED

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_MATCH_RECORD_001_NOT_STARTED

**SCREEN ID:** PRT_MATCH_RECORD_001_NOT_STARTED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — partido no iniciado

**PURPOSE AS IMPLEMENTED:** Acta de un partido que todavía no empezó: se explica que el acta se habilita al pasar el evento a «En curso» y se ofrece esa acción.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba/match-record

**ORIGIN:** Detalle de evento → «Operación pendiente» → «Resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · record DRAFT

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/match-record?demo=coach.

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_002_EDITABLE, PRT_MATCH_RECORD_003_FINAL

**RESPONSIVE COUNTERPART:** 390: los campos de goles se apilan; 1440: comparten una fila de 2 columnas (sm:grid-cols-2).

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MatchRecordPage, RadioGroup (situación), Banner, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_001_NOT_STARTED_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Marcador «0–0» en gei-l5
- **FOCAL 2:** Banner ámbar «El partido todavía no terminó»
- **SUPPORTING:** RadioGroup «Situación del partido»
- **SECONDARY:** Campos de goles y «Cómo se vio»
- **AMBIENT:** Bloque «Marcar como en curso» y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ScoreDisplay | p gei-l5 tabular-nums | Marcador del acta |
| C02 | NotStartedBanner | Banner tone=attention | Explica que el acta se habilita con el evento en curso |
| C03 | MarkInProgressButton | Button secondary | Pasar el evento a «En curso» |

### C01 — ScoreDisplay

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-l5 tabular-nums
- **INSTANCE / ROLE:** Marcador del acta
- **SOURCE COMPONENT:** MatchRecordPage
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** MatchRecordPage > p.gei-l5
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=440.19 w=324 h=24
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=17 · padre 358×607.94

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 20px · line-height: 24px · font-weight: 700 · letter-spacing: -0.3px

#### CONTENT

- visible: "0 – 0"

#### STATE

- DRAFT (sin resultado oficial)

#### INTERACTION

- No interactivo: refleja el formulario

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 20 px, negrita 700, con espacios alrededor del guion
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto se renderiza con espacios: «0 – 0».

### C02 — NotStartedBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Explica que el acta se habilita con el evento en curso
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention (!isFinal && !editing)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=873.38 w=324 h=124.75
- CSS: width: 324px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=450.19 · padre 358×607.94

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "El partido todavía no terminó El acta se habilita cuando el partido pasa a “En c"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 3 líneas
- 1440: 2 líneas

#### IMPLEMENTATION NOTES

- Aparece dentro de la Surface del acta, debajo de los campos.

### C03 — MarkInProgressButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Pasar el evento a «En curso»
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** MatchRecordPage > Button «Marcar como en curso»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=1325.38 w=324 h=46
- CSS: width: 324px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 324px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=17 dy=89.47 · padre 358×152.47

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-lock-open lucide-unlock (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Marcar como en curso"

#### STATE

- idle

#### INTERACTION

- trigger: click → transitionEvent(event.id, 'IN_PROGRESS', 'Inicio del partido')

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: min-height 44 px, con icono Unlock 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Vive en una Surface propia al final de la pantalla, fuera de la Surface del acta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1562 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el marcador grande, el RadioGroup de 3 opciones y los campos de goles siguen el mismo orden; sólo cambia el ancho y el plegado de los campos de goles.

# PRT_MATCH_RECORD_001_NOT_STARTED

**SCREEN ID:** PRT_MATCH_RECORD_001_NOT_STARTED

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Resultado — partido no iniciado

**PURPOSE AS IMPLEMENTED:** Acta de un partido que todavía no empezó: se explica que el acta se habilita al pasar el evento a «En curso» y se ofrece esa acción.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba/match-record

**ORIGIN:** Detalle de evento → «Operación pendiente» → «Resultado»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** SCHEDULED · record DRAFT

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba/match-record?demo=coach.

**RELATED SCREEN IDS:** PRT_MATCH_RECORD_002_EDITABLE, PRT_MATCH_RECORD_003_FINAL

**RESPONSIVE COUNTERPART:** 390: los campos de goles se apilan; 1440: comparten una fila de 2 columnas (sm:grid-cols-2).

**SOURCE FILES:** src/features/participation.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** MatchRecordPage, RadioGroup (situación), Banner, Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_MATCH_RECORD_001_NOT_STARTED_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Marcador «0–0» en gei-l5
- **FOCAL 2:** Banner ámbar «El partido todavía no terminó»
- **SUPPORTING:** RadioGroup «Situación del partido»
- **SECONDARY:** Campos de goles y «Cómo se vio»
- **AMBIENT:** Bloque «Marcar como en curso» y cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | ScoreDisplay | p gei-l5 tabular-nums | Marcador del acta |
| C02 | NotStartedBanner | Banner tone=attention | Explica que el acta se habilita con el evento en curso |
| C03 | MarkInProgressButton | Button secondary | Pasar el evento a «En curso» |

### C01 — ScoreDisplay

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** p gei-l5 tabular-nums
- **INSTANCE / ROLE:** Marcador del acta
- **SOURCE COMPONENT:** MatchRecordPage
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** MatchRecordPage > p.gei-l5
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=387.5 w=726 h=24
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=21 · padre 768×505.19

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 20px · line-height: 24px · font-weight: 700 · letter-spacing: -0.3px

#### CONTENT

- visible: "0 – 0"

#### STATE

- DRAFT (sin resultado oficial)

#### INTERACTION

- No interactivo: refleja el formulario

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 20 px, negrita 700, con espacios alrededor del guion
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto se renderiza con espacios: «0 – 0».

### C02 — NotStartedBanner

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Banner tone=attention
- **INSTANCE / ROLE:** Explica que el acta se habilita con el evento en curso
- **SOURCE COMPONENT:** Banner
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Banner tone=attention (!isFinal && !editing)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=731.63 w=726 h=103.06
- CSS: width: 726px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: flex-start · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=365.13 · padre 768×505.19

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- icon: lucide lucide-info mt-0.5 shrink-0 text-attention (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "El partido todavía no terminó El acta se habilita cuando el partido pasa a “En c"

#### STATE

- attention

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 3 líneas
- 1440: 2 líneas

#### IMPLEMENTATION NOTES

- Aparece dentro de la Surface del acta, debajo de los campos.

### C03 — MarkInProgressButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Pasar el evento a «En curso»
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/features/participation.tsx
- **SOURCE SYMBOL:** MatchRecordPage > Button «Marcar como en curso»
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=469 y=1143.16 w=726 h=46
- CSS: width: 726px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 726px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=21 dy=76.08 · padre 768×143.08

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-lock-open lucide-unlock (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Marcar como en curso"

#### STATE

- idle

#### INTERACTION

- trigger: click → transitionEvent(event.id, 'IN_PROGRESS', 'Inicio del partido')

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: min-height 44 px, con icono Unlock 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Vive en una Surface propia al final de la pantalla, fuera de la Surface del acta.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1336 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el marcador grande, el RadioGroup de 3 opciones y los campos de goles siguen el mismo orden; sólo cambia el ancho y el plegado de los campos de goles.
