# SURFACE MAP — HOME_004_ATTENTION_PLAYER_RECONFIRM

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# HOME_004_ATTENTION_PLAYER_RECONFIRM

**SCREEN ID:** HOME_004_ATTENTION_PLAYER_RECONFIRM

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — atención de jugadora (CAPTAIN) con reconfirmación

**PURPOSE AS IMPLEMENTED:** Bloque de atención de una jugadora: la pantalla muestra el pendiente de reconfirmar disponibilidad y el evento próximo sin responder, con dos acciones distintas.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** CAPTAIN

**RESOURCE / FIXTURE IDS:** match-cuba (p0 con coordinaciónRevision 1 vs 3)

**RESOURCE STATE:** CAPTAIN · NEEDS_RECONFIRMATION + NO_RESPONSE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=captain.
2. Desplazar a y = 260.

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**RESPONSIVE COUNTERPART:** La tarjeta de atención mantiene el mismo ancho de columna; los botones caben en una fila en 390 y en 1440.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** AttentionSection > li, buildAttention > reconfirm / unanswered

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_004_ATTENTION_PLAYER_RECONFIRM_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Ítem 1 «Cambió el horario de un evento al que respondiste.»
- **FOCAL 2:** Botón «Volver a confirmar»
- **SUPPORTING:** Ítem 2 «Hay un evento próximo sin tu respuesta.» con botón «Responder»
- **SECONDARY:** Sección «Hoy»
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttentionItem «reconfirm» | li | Pendiente de reconfirmar disponibilidad |
| C02 | AttentionActionButton («Responder») | Link secundario | Ir al evento sin respuesta |

### C01 — AttentionItem «reconfirm»

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li
- **INSTANCE / ROLE:** Pendiente de reconfirmar disponibilidad
- **SOURCE COMPONENT:** AttentionSection > li
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (item.id === 'reconfirm')
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=-6.03 w=358 h=178.75
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 324px · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 358×326.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "1 Cambió el horario de un evento al que respondiste. Tu respuesta anterior ya no"

#### STATE

- urgency=now

#### INTERACTION

- trigger: click en «Volver a confirmar» → /events/match-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: padding 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto es singular porque stale.length === 1: «Cambió el horario de un evento al que respondiste.»
- La consecuencia: «Tu respuesta anterior ya no cuenta hasta que confirmes de nuevo.»

### C02 — AttentionActionButton («Responder»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Link secundario
- **INSTANCE / ROLE:** Ir al evento sin respuesta
- **SOURCE COMPONENT:** AttentionSection > Link
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection > Link (index !== 0 → borde)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=65 y=259.09 w=112.86 h=44
- CSS: width: 112.859px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 112.859px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 8px 14px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=32 dy=0 · padre 324×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-arrow-right (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Responder"

#### STATE

- idle (segundo ítem → estilo secundario con borde)

#### INTERACTION

- trigger: click → /events/{primer evento sin respuesta}

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: min-height 44 px, borde border-line-strong
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 260
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1564 · scrollY 260 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# HOME_004_ATTENTION_PLAYER_RECONFIRM

**SCREEN ID:** HOME_004_ATTENTION_PLAYER_RECONFIRM

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — atención de jugadora (CAPTAIN) con reconfirmación

**PURPOSE AS IMPLEMENTED:** Bloque de atención de una jugadora: la pantalla muestra el pendiente de reconfirmar disponibilidad y el evento próximo sin responder, con dos acciones distintas.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell → destino «Inicio»

**ACTOR:** CAPTAIN

**RESOURCE / FIXTURE IDS:** match-cuba (p0 con coordinaciónRevision 1 vs 3)

**RESOURCE STATE:** CAPTAIN · NEEDS_RECONFIRMATION + NO_RESPONSE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=captain.
2. Desplazar a y = 260.

**RELATED SCREEN IDS:** HOME_001_DEFAULT_COACH, CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM

**RESPONSIVE COUNTERPART:** La tarjeta de atención mantiene el mismo ancho de columna; los botones caben en una fila en 390 y en 1440.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** AttentionSection > li, buildAttention > reconfirm / unanswered

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_004_ATTENTION_PLAYER_RECONFIRM_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Ítem 1 «Cambió el horario de un evento al que respondiste.»
- **FOCAL 2:** Botón «Volver a confirmar»
- **SUPPORTING:** Ítem 2 «Hay un evento próximo sin tu respuesta.» con botón «Responder»
- **SECONDARY:** Sección «Hoy»
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttentionItem «reconfirm» | li | Pendiente de reconfirmar disponibilidad |
| C02 | AttentionActionButton («Responder») | Link secundario | Ir al evento sin respuesta |

### C01 — AttentionItem «reconfirm»

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li
- **INSTANCE / ROLE:** Pendiente de reconfirmar disponibilidad
- **SOURCE COMPONENT:** AttentionSection > li
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection (item.id === 'reconfirm')
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=320 y=-6.03 w=1024 h=135.38
- CSS: width: 1024px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 1024px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 990px · gap: 12px · padding: 16px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=0 dy=0 · padre 1024×282.75
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 241, 226) · color: rgb(16, 23, 37) · border: 1px solid rgb(240, 211, 171) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "1 Cambió el horario de un evento al que respondiste. Tu respuesta anterior ya no"

#### STATE

- urgency=now

#### INTERACTION

- trigger: click en «Volver a confirmar» → /events/match-cuba

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: padding 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto es singular porque stale.length === 1: «Cambió el horario de un evento al que respondiste.»
- La consecuencia: «Tu respuesta anterior ya no cuenta hasta que confirmes de nuevo.»

### C02 — AttentionActionButton («Responder»)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Link secundario
- **INSTANCE / ROLE:** Ir al evento sin respuesta
- **SOURCE COMPONENT:** AttentionSection > Link
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection > Link (index !== 0 → borde)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=369 y=215.72 w=112.86 h=44
- CSS: width: 112.859px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 112.859px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 8px 14px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=32 dy=0 · padre 990×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-arrow-right (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Responder"

#### STATE

- idle (segundo ítem → estilo secundario con borde)

#### INTERACTION

- trigger: click → /events/{primer evento sin respuesta}

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: min-height 44 px, borde border-line-strong
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 260
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1439 · scrollY 260 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
