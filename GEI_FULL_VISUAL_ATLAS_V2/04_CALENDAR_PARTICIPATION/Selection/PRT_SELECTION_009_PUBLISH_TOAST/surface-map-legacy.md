# SURFACE MAP — PRT_SELECTION_009_PUBLISH_TOAST

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# PRT_SELECTION_009_PUBLISH_TOAST

**SCREEN ID:** PRT_SELECTION_009_PUBLISH_TOAST

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — publicación confirmada (toast)

**PURPOSE AS IMPLEMENTED:** Estado posterior a publicar: la pantalla queda limpia de cambios y un toast informa «Convocatoria publicada.».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** PRT_SELECTION_005_PUBLISH_CONFIRM → «Publicar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1

**RESOURCE STATE:** PUBLISHED · toast visible

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.
2. Marcar el checkbox #sel-p0.
3. Pulsar «Publicar convocatoria».
4. Pulsar «Publicar» en el diálogo.
5. Esperar 1200 ms.

**RELATED SCREEN IDS:** PRT_SELECTION_005_PUBLISH_CONFIRM, GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA

**RESPONSIVE COUNTERPART:** El toast se posiciona igual en ambos viewports; cambia la distancia al borde inferior.

**SOURCE FILES:** src/features/participation.tsx, src/mock/store.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** toast('Convocatoria publicada.'), Toast

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_009_PUBLISH_TOAST_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Toast «Convocatoria publicada.»
- **FOCAL 2:** Lista de convocadas ya publicada
- **SUPPORTING:** Badge «Publicado»
- **SECONDARY:** Barra de acción sin cambios
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | Toast de publicación | div[role=status] fixed | Confirmación de la publicación |

### C01 — Toast de publicación

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=status] fixed
- **INSTANCE / ROLE:** Confirmación de la publicación
- **SOURCE COMPONENT:** Toast
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Toast
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=97.5 y=680.63 w=195 h=67.38
- CSS: width: 195px · min-width: 0px · min-height: 0px · max-width: 351px

#### POSITION MODEL

- fixed

#### CONSTRAINTS

- width 195px, min-width 0px, max-width 351px

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 10px · padding: 12px 16px · max-width: 351px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=97.5 dy=997.63 · padre 390×1160.5
- positioned fixed · z-index 50

#### VISUAL CONFIGURATION

- background: rgb(16, 23, 37) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 shrink-0 text-success-line (16x16)
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 500

#### CONTENT

- visible: "Convocatoria publicada."

#### STATE

- visible

#### INTERACTION

- desaparece solo a los 3800 ms

#### MOTION

- Sin animación; se monta y desmonta

#### RESPONSIVE

- 390: fixed bottom-24, centrado con -translate-x-1/2
- 1440: lg:bottom-6

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página (el toast es fixed)
- what remains sticky/fixed: toast fixed bottom-24 (390) / lg:bottom-6 (1440), z-50
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1161 · scrollY 317 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el mismo Toast; cambia la distancia inferior por el BottomNav.

# PRT_SELECTION_009_PUBLISH_TOAST

**SCREEN ID:** PRT_SELECTION_009_PUBLISH_TOAST

**DOMAIN:** 03_Participacion

**SURFACE NAME:** Convocatoria — publicación confirmada (toast)

**PURPOSE AS IMPLEMENTED:** Estado posterior a publicar: la pantalla queda limpia de cambios y un toast informa «Convocatoria publicada.».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/training-serie-1/selection

**ORIGIN:** PRT_SELECTION_005_PUBLISH_CONFIRM → «Publicar»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** training-serie-1

**RESOURCE STATE:** PUBLISHED · toast visible

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/training-serie-1/selection?demo=coach.
2. Marcar el checkbox #sel-p0.
3. Pulsar «Publicar convocatoria».
4. Pulsar «Publicar» en el diálogo.
5. Esperar 1200 ms.

**RELATED SCREEN IDS:** PRT_SELECTION_005_PUBLISH_CONFIRM, GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA

**RESPONSIVE COUNTERPART:** El toast se posiciona igual en ambos viewports; cambia la distancia al borde inferior.

**SOURCE FILES:** src/features/participation.tsx, src/mock/store.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** toast('Convocatoria publicada.'), Toast

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `PRT_SELECTION_009_PUBLISH_TOAST_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Toast «Convocatoria publicada.»
- **FOCAL 2:** Lista de convocadas ya publicada
- **SUPPORTING:** Badge «Publicado»
- **SECONDARY:** Barra de acción sin cambios
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | Toast de publicación | div[role=status] fixed | Confirmación de la publicación |

### C01 — Toast de publicación

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=status] fixed
- **INSTANCE / ROLE:** Confirmación de la publicación
- **SOURCE COMPONENT:** Toast
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Toast
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=609.52 y=830.31 w=220.95 h=45.69
- CSS: width: 220.953px · min-width: 0px · min-height: 0px · max-width: 1296px

#### POSITION MODEL

- fixed

#### CONSTRAINTS

- width 220.953px, min-width 0px, max-width 1296px

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 10px · padding: 12px 16px · max-width: 1296px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=609.52 dy=1023.31 · padre 1440×1094.5
- positioned fixed · z-index 50

#### VISUAL CONFIGURATION

- background: rgb(16, 23, 37) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 shrink-0 text-success-line (16x16)
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 500

#### CONTENT

- visible: "Convocatoria publicada."

#### STATE

- visible

#### INTERACTION

- desaparece solo a los 3800 ms

#### MOTION

- Sin animación; se monta y desmonta

#### RESPONSIVE

- 390: fixed bottom-24, centrado con -translate-x-1/2
- 1440: lg:bottom-6

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página (el toast es fixed)
- what remains sticky/fixed: toast fixed bottom-24 (390) / lg:bottom-6 (1440), z-50
- initial scroll: scrollY = 0
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1095 · scrollY 193 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el mismo Toast; cambia la distancia inferior por el BottomNav.
