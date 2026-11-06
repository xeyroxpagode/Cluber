# SURFACE MAP — HOME_003_ATTENTION_ITEMS_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# HOME_003_ATTENTION_ITEMS_ADMIN

**SCREEN ID:** HOME_003_ATTENTION_ITEMS_ADMIN

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — bloque «Necesita tu atención» con ítems (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado del bloque de atención con los ítems numerados, su consecuencia y su botón de acción contextual.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /home

**ORIGIN:** HOME_002_DEFAULT_ADMIN (desplazamiento a y = 260)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p17 (perfil incompleto), p16 (cuenta pendiente)

**RESOURCE STATE:** ADMIN · bloque de atención visible

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=admin.
2. Desplazar a y = 260.

**RELATED SCREEN IDS:** HOME_002_DEFAULT_ADMIN

**RESPONSIVE COUNTERPART:** La tarjeta de atención usa padding 16 px en ambos; a 1440 la tarjeta mide 1024 px de ancho.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** AttentionSection > li

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_003_ATTENTION_ITEMS_ADMIN_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Ítem 1 «1 persona tiene el perfil incompleto.»
- **FOCAL 2:** Botón primario «Ver esas personas»
- **SUPPORTING:** Texto de consecuencia en gei-body
- **SECONDARY:** Ítem 2 con tono neutro
- **AMBIENT:** TopBar y barra lateral

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttentionItem (urgencia now) | li con borde y fondo | Pendiente que requiere acción inmediata |
| C02 | AttentionActionButton (primario) | Link con flecha | Ir al objeto del pendiente |

### C01 — AttentionItem (urgencia now)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li con borde y fondo
- **INSTANCE / ROLE:** Pendiente que requiere acción inmediata
- **SOURCE COMPONENT:** AttentionSection > li
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection > li (item.urgency === 'now')
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=-6.03 w=358 h=157.06
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

- visible: "1 1 persona tiene el perfil incompleto. No se pueden asignar a un equipo con la "

#### STATE

- urgency=now (border-attention-line bg-attention-soft)

#### INTERACTION

- contiene el botón de acción del ítem

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: grid con gap 12 px, padding 16 px
- 1440: idéntico, ancho de columna

#### IMPLEMENTATION NOTES

- —

### C02 — AttentionActionButton (primario)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Link con flecha
- **INSTANCE / ROLE:** Ir al objeto del pendiente
- **SOURCE COMPONENT:** AttentionSection > Link
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection > Link (index === 0 ? bg-interactive : border)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=65 y=90.03 w=155.19 h=44
- CSS: width: 155.188px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 155.188px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 8px 14px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=32 dy=0 · padre 324×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-arrow-right (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Ver esas personas"

#### STATE

- idle (primer ítem → estilo primario)

#### INTERACTION

- trigger: click → /management/people?profileStatus=incomplete

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: min-height 44 px (gei-target), padding 10/14 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto del botón del ítem 0 es «Ver esas personas»; el del resto, «Abrir personas» / «Emitir códigos».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 260
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1357 · scrollY 260 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el botón de acción es inline (px-3.5 py-2) y queda con sangría pl-8 respecto del texto en ambos viewports.

# HOME_003_ATTENTION_ITEMS_ADMIN

**SCREEN ID:** HOME_003_ATTENTION_ITEMS_ADMIN

**DOMAIN:** 01_Home

**SURFACE NAME:** Inicio — bloque «Necesita tu atención» con ítems (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado del bloque de atención con los ítems numerados, su consecuencia y su botón de acción contextual.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** HOME_002_DEFAULT_ADMIN (desplazamiento a y = 260)

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** p17 (perfil incompleto), p16 (cuenta pendiente)

**RESOURCE STATE:** ADMIN · bloque de atención visible

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=admin.
2. Desplazar a y = 260.

**RELATED SCREEN IDS:** HOME_002_DEFAULT_ADMIN

**RESPONSIVE COUNTERPART:** La tarjeta de atención usa padding 16 px en ambos; a 1440 la tarjeta mide 1024 px de ancho.

**SOURCE FILES:** src/features/overview.tsx

**SOURCE SYMBOLS:** AttentionSection > li

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `HOME_003_ATTENTION_ITEMS_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Ítem 1 «1 persona tiene el perfil incompleto.»
- **FOCAL 2:** Botón primario «Ver esas personas»
- **SUPPORTING:** Texto de consecuencia en gei-body
- **SECONDARY:** Ítem 2 con tono neutro
- **AMBIENT:** TopBar y barra lateral

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AttentionItem (urgencia now) | li con borde y fondo | Pendiente que requiere acción inmediata |
| C02 | AttentionActionButton (primario) | Link con flecha | Ir al objeto del pendiente |

### C01 — AttentionItem (urgencia now)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** li con borde y fondo
- **INSTANCE / ROLE:** Pendiente que requiere acción inmediata
- **SOURCE COMPONENT:** AttentionSection > li
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection > li (item.urgency === 'now')
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

- visible: "1 1 persona tiene el perfil incompleto. No se pueden asignar a un equipo con la "

#### STATE

- urgency=now (border-attention-line bg-attention-soft)

#### INTERACTION

- contiene el botón de acción del ítem

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: grid con gap 12 px, padding 16 px
- 1440: idéntico, ancho de columna

#### IMPLEMENTATION NOTES

- —

### C02 — AttentionActionButton (primario)

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** Link con flecha
- **INSTANCE / ROLE:** Ir al objeto del pendiente
- **SOURCE COMPONENT:** AttentionSection > Link
- **SOURCE FILE:** src/features/overview.tsx
- **SOURCE SYMBOL:** AttentionSection > Link (index === 0 ? bg-interactive : border)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=369 y=68.34 w=155.19 h=44
- CSS: width: 155.188px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 155.188px, min-width 0px, max-width none

#### LAYOUT

- display: inline-flex · padding: 8px 14px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=32 dy=0 · padre 990×44

#### VISUAL CONFIGURATION

- background: rgb(26, 79, 160) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-arrow-right (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Ver esas personas"

#### STATE

- idle (primer ítem → estilo primario)

#### INTERACTION

- trigger: click → /management/people?profileStatus=incomplete

#### MOTION

- transition-colors

#### RESPONSIVE

- 390: min-height 44 px (gei-target), padding 10/14 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El texto del botón del ítem 0 es «Ver esas personas»; el del resto, «Abrir personas» / «Emitir códigos».

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 260
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1250 · scrollY 260 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el botón de acción es inline (px-3.5 py-2) y queda con sangría pl-8 respecto del texto en ambos viewports.
