# SURFACE MAP — GBL_NOTIF_001_LIST_COACH_ALL_READ

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NOTIF_001_LIST_COACH_ALL_READ

**SCREEN ID:** GBL_NOTIF_001_LIST_COACH_ALL_READ

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — lista sin pendientes (COACH)

**PURPOSE AS IMPLEMENTED:** Lista de avisos del club. Los no leídos se ordenan primero; cuando no hay ninguno desaparece la acción «Marcar todo como leído».

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** n1 (leído), n3 (leído)

**RESOURCE STATE:** 0 avisos sin leer · 2 leídos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=coach.

**RELATED SCREEN IDS:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD, GBL_NOTIF_004_EMPTY_STATE

**RESPONSIVE COUNTERPART:** 390: las acciones «Marcar leído» / «Abrir» se apilan a la derecha de cada fila. 1440: la fila usa todo el ancho del contenedor (max-w-3xl = 768 px).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Notifications, RowStatic, Button, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_001_LIST_COACH_ALL_READ_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de avisos (título + cuerpo de cada uno)
- **FOCAL 2:** Botón «Abrir» de cada fila
- **SUPPORTING:** Etiqueta de tipo de aviso en versalitas
- **SECONDARY:** Fecha relativa a la derecha
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoticeRow | RowStatic con acciones | Fila de aviso |
| C02 | NoticeTypeLabel | span uppercase | Tipo de aviso en lenguaje de usuario |
| C03 | OpenNoticeButton | Button secondary sm | Ir al objeto del aviso |

### C01 — NoticeRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con acciones
- **INSTANCE / ROLE:** Fila de aviso
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=283.72 w=425.83 h=137.2
- CSS: width: 425.828px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 425.828px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=4 dy=4 · padre 433.83×247.63

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Convocatoria publicada CONVOCATORIA PUBLICADA La convocatoria de GEI vs. CUBA ya"

#### STATE

- read (fondo transparente; el no-leído usa bg-selected-soft/40)

#### INTERACTION

- trigger: click en «Abrir» → marca leído y navega a notice.route
- trigger: click en «Marcar leído» (sólo si no leído) → markNoticeRead

#### MOTION

- transition-colors duration-micro en la fila (hover bg-selected-soft)

#### RESPONSIVE

- 390: contenido + acciones a la derecha
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — NoticeTypeLabel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span uppercase
- **INSTANCE / ROLE:** Tipo de aviso en lenguaje de usuario
- **SOURCE COMPONENT:** Notifications > NOTICE_TYPE_TEXT
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NOTICE_TYPE_TEXT
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=455.17 w=290.64 h=17.39
- CSS: width: 290.641px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 290.641px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=0 dy=0 · padre 290.64×56.17
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(123, 135, 152) · border: 0px solid rgb(123, 135, 152) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600 · letter-spacing: 0.3px · text-transform: uppercase

#### CONTENT

- visible: "Un evento se reprogramó"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: micro, tracking-wide, text-ink-faint
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — OpenNoticeButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary sm
- **INSTANCE / ROLE:** Ir al objeto del aviso
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary size=sm
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=373.14 y=330.31 w=61.69 h=44
- CSS: width: 61.6875px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 61.6875px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=106.86 dy=0 · padre 168.55×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Abrir"

#### STATE

- idle

#### INTERACTION

- trigger: click → markNoticeRead(id) + go(notice.route)
- en este caso: /events/match-cuba, /announcements/a1, /events/match-cuba/selection

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: sm (min-h-11 px-3, texto meta)
- 1440: idéntico

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

- 390 ↔ 1440: misma estructura de filas; cambia el ancho del contenedor y, en 390, el ancho disponible para el texto del aviso.

# GBL_NOTIF_001_LIST_COACH_ALL_READ

**SCREEN ID:** GBL_NOTIF_001_LIST_COACH_ALL_READ

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — lista sin pendientes (COACH)

**PURPOSE AS IMPLEMENTED:** Lista de avisos del club. Los no leídos se ordenan primero; cuando no hay ninguno desaparece la acción «Marcar todo como leído».

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** n1 (leído), n3 (leído)

**RESOURCE STATE:** 0 avisos sin leer · 2 leídos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=coach.

**RELATED SCREEN IDS:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD, GBL_NOTIF_004_EMPTY_STATE

**RESPONSIVE COUNTERPART:** 390: las acciones «Marcar leído» / «Abrir» se apilan a la derecha de cada fila. 1440: la fila usa todo el ancho del contenedor (max-w-3xl = 768 px).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** Notifications, RowStatic, Button, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_001_LIST_COACH_ALL_READ_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de avisos (título + cuerpo de cada uno)
- **FOCAL 2:** Botón «Abrir» de cada fila
- **SUPPORTING:** Etiqueta de tipo de aviso en versalitas
- **SECONDARY:** Fecha relativa a la derecha
- **AMBIENT:** TopBar y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoticeRow | RowStatic con acciones | Fila de aviso |
| C02 | NoticeTypeLabel | span uppercase | Tipo de aviso en lenguaje de usuario |
| C03 | OpenNoticeButton | Button secondary sm | Ir al objeto del aviso |

### C01 — NoticeRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic con acciones
- **INSTANCE / ROLE:** Fila de aviso
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

- contained-by ul · offset dx=4 dy=4 · padre 766×178.06

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Convocatoria publicada CONVOCATORIA PUBLICADA La convocatoria de GEI vs. CUBA ya"

#### STATE

- read (fondo transparente; el no-leído usa bg-selected-soft/40)

#### INTERACTION

- trigger: click en «Abrir» → marca leído y navega a notice.route
- trigger: click en «Marcar leído» (sólo si no leído) → markNoticeRead

#### MOTION

- transition-colors duration-micro en la fila (hover bg-selected-soft)

#### RESPONSIVE

- 390: contenido + acciones a la derecha
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C02 — NoticeTypeLabel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** span uppercase
- **INSTANCE / ROLE:** Tipo de aviso en lenguaje de usuario
- **SOURCE COMPONENT:** Notifications > NOTICE_TYPE_TEXT
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** NOTICE_TYPE_TEXT
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=465 y=345 w=622.81 h=17.39
- CSS: width: 622.812px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 622.812px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=0 dy=0 · padre 622.81×38.78
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(123, 135, 152) · border: 0px solid rgb(123, 135, 152) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 600 · letter-spacing: 0.3px · text-transform: uppercase

#### CONTENT

- visible: "Un evento se reprogramó"

#### STATE

- idle

#### INTERACTION

- No interactivo

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: micro, tracking-wide, text-ink-faint
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

### C03 — OpenNoticeButton

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** Button secondary sm
- **INSTANCE / ROLE:** Ir al objeto del aviso
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=secondary size=sm
- **PARENT:** span
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1137.31 y=246.23 w=61.69 h=44
- CSS: width: 61.6875px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 61.6875px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by span · offset dx=106.86 dy=0 · padre 168.55×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Abrir"

#### STATE

- idle

#### INTERACTION

- trigger: click → markNoticeRead(id) + go(notice.route)
- en este caso: /events/match-cuba, /announcements/a1, /events/match-cuba/selection

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: sm (min-h-11 px-3, texto meta)
- 1440: idéntico

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

- 390 ↔ 1440: misma estructura de filas; cambia el ancho del contenedor y, en 390, el ancho disponible para el texto del aviso.
