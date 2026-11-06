# SURFACE MAP — GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**SCREEN ID:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — lista con un aviso sin leer (PLAYER)

**PURPOSE AS IMPLEMENTED:** Misma lista con un aviso no leído: el no-leído va primero, su fila tiene fondo azulado suave, marca «Sin leer» y acción «Marcar leído».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** n2 (no leído), n1, n3

**RESOURCE STATE:** 1 aviso sin leer · 2 leídos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=player.

**RELATED SCREEN IDS:** GBL_NOTIF_001_LIST_COACH_ALL_READ, GBL_NOTIF_003_ALL_MARKED_READ

**RESPONSIVE COUNTERPART:** 390 ↔ 1440: en ambos la fila sin leer se distingue por el fondo bg-selected-soft/40 y por la etiqueta «Sin leer»; la acción global «Marcar todo como leído» aparece en el encabezado en ambos.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Notifications, UnreadMark (patrón replicado), Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del aviso sin leer (fondo azul suave, primera de la lista)
- **FOCAL 2:** Acción «Marcar todo como leído» en el encabezado
- **SUPPORTING:** Botón «Marcar leído» de la fila
- **SECONDARY:** Fecha relativa
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | UnreadNoticeRow | RowStatic con fondo de no-leído | Fila de aviso no leído |
| C02 | UnreadIndicator | span con dot + texto | Marca «Sin leer» |
| C03 | MarkAllReadButton | Button secondary | Marcar todos los avisos como leídos |

### C01 — UnreadNoticeRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con fondo de no-leído
- **INSTANCE / ROLE:** Fila de aviso no leído
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=283.72 w=461.16 h=85.03
- CSS: width: 461.156px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 461.156px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=4 dy=4 · padre 469.16×315.27

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Comunicado para Sexta A COMUNICADO DEL CLUB Todo listo para la próxima fecha Sin"

#### STATE

- unread (bg-selected-soft/40)

#### INTERACTION

- trigger: click en «Abrir» → marca leído y navega

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: contenido + 2 acciones
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — UnreadIndicator

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span con dot + texto
- **INSTANCE / ROLE:** Marca «Sin leer»
- **SOURCE COMPONENT:** Notifications (patrón local equivalente a UnreadMark)
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** Notifications > meta > span[size-2 bg-unread]
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=244.98 y=306.84 w=43.41 h=17.39
- CSS: width: 43.4062px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 43.4062px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=14 dy=0 · padre 58.63×17.39

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Sin leer"

#### STATE

- unread

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: dot 8×8 + texto meta semibold text-selected
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — MarkAllReadButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Marcar todos los avisos como leídos
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=188.72 w=213.88 h=46
- CSS: width: 213.875px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 213.875px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 471.16×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Marcar todo como leído"

#### STATE

- visible sólo cuando unread.length > 0

#### INTERACTION

- trigger: click → markAllNoticesRead()

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: envuelto en el action del header (w-full en móvil)
- 1440: w-auto

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el botón «Marcar todo como leído» vive en el action del PageContextHeader; en 390 el action pasa a ancho completo (w-full) y los botones se envuelven.

# GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**SCREEN ID:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — lista con un aviso sin leer (PLAYER)

**PURPOSE AS IMPLEMENTED:** Misma lista con un aviso no leído: el no-leído va primero, su fila tiene fondo azulado suave, marca «Sin leer» y acción «Marcar leído».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** n2 (no leído), n1, n3

**RESOURCE STATE:** 1 aviso sin leer · 2 leídos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=player.

**RELATED SCREEN IDS:** GBL_NOTIF_001_LIST_COACH_ALL_READ, GBL_NOTIF_003_ALL_MARKED_READ

**RESPONSIVE COUNTERPART:** 390 ↔ 1440: en ambos la fila sin leer se distingue por el fondo bg-selected-soft/40 y por la etiqueta «Sin leer»; la acción global «Marcar todo como leído» aparece en el encabezado en ambos.

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Notifications, UnreadMark (patrón replicado), Button

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Fila del aviso sin leer (fondo azul suave, primera de la lista)
- **FOCAL 2:** Acción «Marcar todo como leído» en el encabezado
- **SUPPORTING:** Botón «Marcar leído» de la fila
- **SECONDARY:** Fecha relativa
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | UnreadNoticeRow | RowStatic con fondo de no-leído | Fila de aviso no leído |
| C02 | UnreadIndicator | span con dot + texto | Marca «Sin leer» |
| C03 | MarkAllReadButton | Button secondary | Marcar todos los avisos como leídos |

### C01 — UnreadNoticeRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con fondo de no-leído
- **INSTANCE / ROLE:** Fila de aviso no leído
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=453 y=225.72 w=758 h=85.03
- CSS: width: 758px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 758px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=4 dy=4 · padre 766×263.09

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Comunicado para Sexta A COMUNICADO DEL CLUB Todo listo para la próxima fecha Sin"

#### STATE

- unread (bg-selected-soft/40)

#### INTERACTION

- trigger: click en «Abrir» → marca leído y navega

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: contenido + 2 acciones
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — UnreadIndicator

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span con dot + texto
- **INSTANCE / ROLE:** Marca «Sin leer»
- **SOURCE COMPONENT:** Notifications (patrón local equivalente a UnreadMark)
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** Notifications > meta > span[size-2 bg-unread]
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=973.83 y=248.84 w=43.41 h=17.39
- CSS: width: 43.4062px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 43.4062px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=14 dy=0 · padre 58.63×17.39

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(20, 65, 127) · border: 0px solid rgb(20, 65, 127) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600

#### CONTENT

- visible: "Sin leer"

#### STATE

- unread

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: dot 8×8 + texto meta semibold text-selected
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — MarkAllReadButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary
- **INSTANCE / ROLE:** Marcar todos los avisos como leídos
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1002.13 y=116.59 w=213.88 h=46
- CSS: width: 213.875px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 213.875px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 213.88×46
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Marcar todo como leído"

#### STATE

- visible sólo cuando unread.length > 0

#### INTERACTION

- trigger: click → markAllNoticesRead()

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: envuelto en el action del header (w-full en móvil)
- 1440: w-auto

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el botón «Marcar todo como leído» vive en el action del PageContextHeader; en 390 el action pasa a ancho completo (w-full) y los botones se envuelven.
