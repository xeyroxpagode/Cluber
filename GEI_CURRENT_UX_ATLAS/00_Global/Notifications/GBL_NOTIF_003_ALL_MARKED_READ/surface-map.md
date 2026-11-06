# SURFACE MAP — GBL_NOTIF_003_ALL_MARKED_READ

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NOTIF_003_ALL_MARKED_READ

**SCREEN ID:** GBL_NOTIF_003_ALL_MARKED_READ

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — tras marcar todo como leído

**PURPOSE AS IMPLEMENTED:** Estado posterior a la acción masiva: desaparece el botón del encabezado, las filas pierden el fondo de no-leído y el punto de la campana se apaga.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /notifications

**ORIGIN:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** n1, n2, n3

**RESOURCE STATE:** 0 avisos sin leer (los 3 leídos)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=player.
2. Pulsar «Marcar todo como leído».

**RELATED SCREEN IDS:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**RESPONSIVE COUNTERPART:** El encabezado recupera la forma sin action en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/mock/store.tsx, src/app/Shell.tsx

**SOURCE SYMBOLS:** Notifications, markAllNoticesRead, Shell > unread

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_003_ALL_MARKED_READ_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de avisos ya leídos
- **FOCAL 2:** Encabezado sin acción de marcado masivo
- **SUPPORTING:** Fechas relativas
- **SECONDARY:** —
- **AMBIENT:** TopBar (campana sin punto) y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoticeRow (leído) | RowStatic | Fila de aviso leído |

### C01 — NoticeRow (leído)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Fila de aviso leído
- **SOURCE COMPONENT:** RowStatic
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** RowStatic
- **PARENT:** ul
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=225.72 w=348 h=102.42
- CSS: width: 348px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 348px, min-width auto, max-width none

#### LAYOUT

- display: list-item · padding: 0px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by ul · offset dx=4 dy=4 · padre 356×350.05

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Comunicado para Sexta A COMUNICADO DEL CLUB Todo listo para la próxima fecha Hac"

#### STATE

- read (sin fondo, sin marca «Sin leer», sin botón «Marcar leído»)

#### INTERACTION

- trigger: click en «Abrir» → navega

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: —
- 1440: —

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

- 390 ↔ 1440: sin differences de composición; el cambio de estado afecta a ambos (filas, encabezado y campana del TopBar).

# GBL_NOTIF_003_ALL_MARKED_READ

**SCREEN ID:** GBL_NOTIF_003_ALL_MARKED_READ

**DOMAIN:** 00_Global

**SURFACE NAME:** Avisos — tras marcar todo como leído

**PURPOSE AS IMPLEMENTED:** Estado posterior a la acción masiva: desaparece el botón del encabezado, las filas pierden el fondo de no-leído y el punto de la campana se apaga.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /notifications

**ORIGIN:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** n1, n2, n3

**RESOURCE STATE:** 0 avisos sin leer (los 3 leídos)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=player.
2. Pulsar «Marcar todo como leído».

**RELATED SCREEN IDS:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD

**RESPONSIVE COUNTERPART:** El encabezado recupera la forma sin action en ambos viewports.

**SOURCE FILES:** src/features/communication.tsx, src/mock/store.tsx, src/app/Shell.tsx

**SOURCE SYMBOLS:** Notifications, markAllNoticesRead, Shell > unread

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NOTIF_003_ALL_MARKED_READ_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de avisos ya leídos
- **FOCAL 2:** Encabezado sin acción de marcado masivo
- **SUPPORTING:** Fechas relativas
- **SECONDARY:** —
- **AMBIENT:** TopBar (campana sin punto) y BottomNav

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | NoticeRow (leído) | RowStatic | Fila de aviso leído |

### C01 — NoticeRow (leído)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowStatic
- **INSTANCE / ROLE:** Fila de aviso leído
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

- visible: "Comunicado para Sexta A COMUNICADO DEL CLUB Todo listo para la próxima fecha Hac"

#### STATE

- read (sin fondo, sin marca «Sin leer», sin botón «Marcar leído»)

#### INTERACTION

- trigger: click en «Abrir» → navega

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: —
- 1440: —

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

- 390 ↔ 1440: sin differences de composición; el cambio de estado afecta a ambos (filas, encabezado y campana del TopBar).
