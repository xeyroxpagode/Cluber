# SURFACE MAP — GBL_NOTIF_004_EMPTY_STATE

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NOTIF_004_EMPTY_STATE

**SCREEN ID:** GBL_NOTIF_004_EMPTY_STATE

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — estado vacío (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado vacío de la lista de avisos para un actor que no es destinatario de ningún aviso.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 avisos recibidos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=admin.

**RELATED SCREEN IDS:** GBL_NOTIF_001_LIST_COACH_ALL_READ

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Notifications > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_004_EMPTY_STATE_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés avisos»
- **FOCAL 2:** Detalle «Cuando cambie algo que te afecta, aparece acá.»
- **SUPPORTING:** Ícono MinusCircle 22 px
- **SECONDARY:** Encabezado «Avisos»
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (sin avisos) | Empty | Estado vacío de avisos |

### C01 — EmptyState (sin avisos)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de avisos
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=220.72 w=358 h=143.08
- CSS: width: 358px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 316px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 358×274.8
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No tenés avisos Cuando cambie algo que te afecta, aparece acá."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: px-5 py-8
- 1440: px-5 py-8

#### IMPLEMENTATION NOTES

- El icono por defecto es MinusCircle 22 px en text-ink-faint.
- El ADMIN es destinatario de ningún aviso en el seed (los tres avisos van a coach y a jugadoras p0..p7).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.

# GBL_NOTIF_004_EMPTY_STATE

**SCREEN ID:** GBL_NOTIF_004_EMPTY_STATE

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — estado vacío (ADMIN)

**PURPOSE AS IMPLEMENTED:** Estado vacío de la lista de avisos para un actor que no es destinatario de ningún aviso.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** —

**RESOURCE STATE:** 0 avisos recibidos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=admin.

**RELATED SCREEN IDS:** GBL_NOTIF_001_LIST_COACH_ALL_READ

**RESPONSIVE COUNTERPART:** Idéntico en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Notifications > Empty, Empty

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_004_EMPTY_STATE_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «No tenés avisos»
- **FOCAL 2:** Detalle «Cuando cambie algo que te afecta, aparece acá.»
- **SUPPORTING:** Ícono MinusCircle 22 px
- **SECONDARY:** Encabezado «Avisos»
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EmptyState (sin avisos) | Empty | Estado vacío de avisos |

### C01 — EmptyState (sin avisos)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Empty
- **INSTANCE / ROLE:** Estado vacío de avisos
- **SOURCE COMPONENT:** Empty
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Empty
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=220.72 w=768 h=143.08
- CSS: width: 768px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: grid · grid-template-columns: 726px · gap: 12px · padding: 32px 20px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=131.72 · padre 768×274.8
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(222, 227, 234) · border-radius: 12px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "No tenés avisos Cuando cambie algo que te afecta, aparece acá."

#### STATE

- empty

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: px-5 py-8
- 1440: px-5 py-8

#### IMPLEMENTATION NOTES

- El icono por defecto es MinusCircle 22 px en text-ink-faint.
- El ADMIN es destinatario de ningún aviso en el seed (los tres avisos van a coach y a jugadoras p0..p7).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: misma composición.
