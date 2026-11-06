# SURFACE MAP — GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA

**SCREEN ID:** GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA

**DOMAIN:** 00_Global

**SURFACE NAME:** Toast de confirmación «Respuesta guardada.»

**PURPOSE AS IMPLEMENTED:** Notificación efímera de éxito que confirma una mutación. Vive en el Shell y se autodestruye a los 3800 ms.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → radio «Tal vez» del control ¿Vas?

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** Disponibilidad guardada · toast visible

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=player.
2. Desplazar hasta el control «¿Vas?».
3. Pulsar la opción «Tal vez».
4. Esperar ~900 ms a que aparezca el toast.

**RELATED SCREEN IDS:** GBL_OVERLAY_001_MENU_ACCIONES_EVENTO, CAL_EVENT_DETAIL_009_PLAYER_VIEW

**RESPONSIVE COUNTERPART:** El toast se posiciona con left-1/2 -translate-x-1/2 y max-w-[90vw]; en 390 queda a 24 px del borde (bottom-24 = 96 px) y en 1440 a 24 px del borde inferior (lg:bottom-6).

**SOURCE FILES:** src/shared/ui.tsx, src/mock/store.tsx, src/app/Shell.tsx

**SOURCE SYMBOLS:** Toast, toast(), Shell > <Toast message={toastMessage}/>

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Respuesta guardada.»
- **FOCAL 2:** Ícono CheckCircle2 en color success-line
- **SUPPORTING:** Fondo oscuro bg-ink con texto blanco
- **SECONDARY:** —
- **AMBIENT:** Página de evento

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | Toast | div[role=status] fixed | Confirmación efímera de una mutación |

### C01 — Toast

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=status] fixed
- **INSTANCE / ROLE:** Confirmación efímera de una mutación
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

- contained-by div · offset dx=97.5 dy=781.63 · padre 390×2089.05
- positioned fixed · z-index 50

#### VISUAL CONFIGURATION

- background: rgb(16, 23, 37) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 shrink-0 text-success-line (16x16)
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 500

#### CONTENT

- visible: "Respuesta guardada."

#### STATE

- visible (aria-live=polite)

#### INTERACTION

- trigger: mutación exitosa → toast(msg)
- desaparece solo a los 3800 ms (window.setTimeout en store.tsx:240)

#### MOTION

- Sin animación de entrada/salida: se monta y desmonta.
- SOURCE-CONFIRMED: store.tsx — setToast con clearTimeout y setTimeout(3800).

#### RESPONSIVE

- 390: fixed bottom-24, left-1/2 -translate-x-1/2, max-w-[90vw]
- 1440: lg:bottom-6

#### IMPLEMENTATION NOTES

- Fondo bg-ink (#101725), texto blanco, rounded-control, padding 12/16 px, sombra shadow-overlay.
- z-index 50: por encima del contenido y de la barra inferior.

## SCROLL CONTRACT

- what scrolls: la página (el toast es fixed)
- what remains sticky/fixed: fixed bottom-24 (390) / bottom-6 (1440), left-1/2, z-50
- initial scroll: n/a
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 2089 · scrollY 101 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: bottom-24 (96 px) para no quedar debajo del BottomNav; max-w-[90vw] = 351 px.
- 1440: bottom-6 (24 px), sin cambio de ancho máximo.
- El mismo componente Toast se usa en toda la aplicación (disponibilidad, convocatoria, publicación).

# GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA

**SCREEN ID:** GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA

**DOMAIN:** 00_Global

**SURFACE NAME:** Toast de confirmación «Respuesta guardada.»

**PURPOSE AS IMPLEMENTED:** Notificación efímera de éxito que confirma una mutación. Vive en el Shell y se autodestruye a los 3800 ms.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /events/match-cuba

**ORIGIN:** CAL_EVENT_DETAIL_001_SCHEDULED_COACH → radio «Tal vez» del control ¿Vas?

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** match-cuba

**RESOURCE STATE:** Disponibilidad guardada · toast visible

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /events/match-cuba?demo=player.
2. Desplazar hasta el control «¿Vas?».
3. Pulsar la opción «Tal vez».
4. Esperar ~900 ms a que aparezca el toast.

**RELATED SCREEN IDS:** GBL_OVERLAY_001_MENU_ACCIONES_EVENTO, CAL_EVENT_DETAIL_009_PLAYER_VIEW

**RESPONSIVE COUNTERPART:** El toast se posiciona con left-1/2 -translate-x-1/2 y max-w-[90vw]; en 390 queda a 24 px del borde (bottom-24 = 96 px) y en 1440 a 24 px del borde inferior (lg:bottom-6).

**SOURCE FILES:** src/shared/ui.tsx, src/mock/store.tsx, src/app/Shell.tsx

**SOURCE SYMBOLS:** Toast, toast(), Shell > <Toast message={toastMessage}/>

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Mensaje «Respuesta guardada.»
- **FOCAL 2:** Ícono CheckCircle2 en color success-line
- **SUPPORTING:** Fondo oscuro bg-ink con texto blanco
- **SECONDARY:** —
- **AMBIENT:** Página de evento

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | Toast | div[role=status] fixed | Confirmación efímera de una mutación |

### C01 — Toast

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div[role=status] fixed
- **INSTANCE / ROLE:** Confirmación efímera de una mutación
- **SOURCE COMPONENT:** Toast
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Toast
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=620.17 y=830.31 w=199.66 h=45.69
- CSS: width: 199.656px · min-width: 0px · min-height: 0px · max-width: 1296px

#### POSITION MODEL

- fixed

#### CONSTRAINTS

- width 199.656px, min-width 0px, max-width 1296px

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 10px · padding: 12px 16px · max-width: 1296px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=620.17 dy=830.31 · padre 1440×1640.17
- positioned fixed · z-index 50

#### VISUAL CONFIGURATION

- background: rgb(16, 23, 37) · color: rgb(255, 255, 255) · border: 0px solid rgb(255, 255, 255) · border-radius: 8px · box-shadow: shadow (ver sonda) · opacity: 1
- icon: lucide lucide-circle-check lucide-check-circle-2 shrink-0 text-success-line (16x16)
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 500

#### CONTENT

- visible: "Respuesta guardada."

#### STATE

- visible (aria-live=polite)

#### INTERACTION

- trigger: mutación exitosa → toast(msg)
- desaparece solo a los 3800 ms (window.setTimeout en store.tsx:240)

#### MOTION

- Sin animación de entrada/salida: se monta y desmonta.
- SOURCE-CONFIRMED: store.tsx — setToast con clearTimeout y setTimeout(3800).

#### RESPONSIVE

- 390: fixed bottom-24, left-1/2 -translate-x-1/2, max-w-[90vw]
- 1440: lg:bottom-6

#### IMPLEMENTATION NOTES

- Fondo bg-ink (#101725), texto blanco, rounded-control, padding 12/16 px, sombra shadow-overlay.
- z-index 50: por encima del contenido y de la barra inferior.

## SCROLL CONTRACT

- what scrolls: la página (el toast es fixed)
- what remains sticky/fixed: fixed bottom-24 (390) / bottom-6 (1440), left-1/2, z-50
- initial scroll: n/a
- scroll restoration observed: n/a
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1640 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390: bottom-24 (96 px) para no quedar debajo del BottomNav; max-w-[90vw] = 351 px.
- 1440: bottom-6 (24 px), sin cambio de ancho máximo.
- El mismo componente Toast se usa en toda la aplicación (disponibilidad, convocatoria, publicación).
