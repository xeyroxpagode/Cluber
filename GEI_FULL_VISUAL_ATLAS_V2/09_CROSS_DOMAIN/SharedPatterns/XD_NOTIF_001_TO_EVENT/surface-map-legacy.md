# SURFACE MAP — XD_NOTIF_001_TO_EVENT

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# XD_NOTIF_001_TO_EVENT

**SCREEN ID:** XD_NOTIF_001_TO_EVENT

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Aviso → objeto (comunicado)

**PURPOSE AS IMPLEMENTED:** Trayecto desde la lista de avisos hasta el objeto referenciado. El aviso no leído del actor apunta al comunicado publicado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** n2 (ANNOUNCEMENT_PUBLISHED, route /announcements/a1), a1

**RESOURCE STATE:** AVISO NO LEÍDO → COMUNICADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=player.
2. Pulsar el botón «Abrir» de la primera fila.

**RELATED SCREEN IDS:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD, COM_ANNOUNCEMENT_001_DETAIL

**RESPONSIVE COUNTERPART:** El destino es la ficha de comunicado (max-w-2xl).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** Notifications > Button «Abrir», markNoticeRead + go(notice.route), AnnouncementDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_NOTIF_001_TO_EVENT_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del comunicado
- **FOCAL 2:** Cuerpo del comunicado
- **SUPPORTING:** Etiqueta de audiencia «Sexta A»
- **SECONDARY:** Botón «Quién lo ve»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AnnouncementHeader | header grid con back y action | Destino del aviso |

### C01 — AnnouncementHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Destino del aviso
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (AnnouncementDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=137 w=358 h=59.25
- CSS: width: 358px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×112.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Todo listo para la próxima fecha"

#### STATE

- PUBLISHED

#### INTERACTION

- trigger: click en «Volver» → /communication

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×272,64 px
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El botón «Abrir» marca el aviso como leído antes de navegar, de modo que el punto de no-leído de la campana se apaga al llegar.
- El destino depende del aviso: n1 lleva a /events/match-cuba, n2 a /announcements/a1 y n3 a /events/match-cuba/selection. En este trayecto el primer aviso no leído del jugador es n2.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino no cambia de layout respecto de la lectura directa de un comunicado.

# XD_NOTIF_001_TO_EVENT

**SCREEN ID:** XD_NOTIF_001_TO_EVENT

**DOMAIN:** 09_CrossDomain

**SURFACE NAME:** Origen — Aviso → objeto (comunicado)

**PURPOSE AS IMPLEMENTED:** Trayecto desde la lista de avisos hasta el objeto referenciado. El aviso no leído del actor apunta al comunicado publicado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /notifications

**ORIGIN:** Shell → icono de campana

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** n2 (ANNOUNCEMENT_PUBLISHED, route /announcements/a1), a1

**RESOURCE STATE:** AVISO NO LEÍDO → COMUNICADO

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /notifications?demo=player.
2. Pulsar el botón «Abrir» de la primera fila.

**RELATED SCREEN IDS:** GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD, COM_ANNOUNCEMENT_001_DETAIL

**RESPONSIVE COUNTERPART:** El destino es la ficha de comunicado (max-w-2xl).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** Notifications > Button «Abrir», markNoticeRead + go(notice.route), AnnouncementDetail

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `XD_NOTIF_001_TO_EVENT_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título del comunicado
- **FOCAL 2:** Cuerpo del comunicado
- **SUPPORTING:** Etiqueta de audiencia «Sexta A»
- **SECONDARY:** Botón «Quién lo ve»
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AnnouncementHeader | header grid con back y action | Destino del aviso |

### C01 — AnnouncementHeader

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** header grid con back y action
- **INSTANCE / ROLE:** Destino del aviso
- **SOURCE COMPONENT:** PageContextHeader
- **SOURCE FILE:** src/shared/patterns.tsx
- **SOURCE SYMBOL:** PageContextHeader (AnnouncementDetail)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=496 y=137 w=574.34 h=29.63
- CSS: width: 574.344px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 574.344px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 574.34×60.13
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 26px · line-height: 29.64px · font-weight: 700 · letter-spacing: -0.52px

#### CONTENT

- visible: "Todo listo para la próxima fecha"

#### STATE

- PUBLISHED

#### INTERACTION

- trigger: click en «Volver» → /communication

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: 358×272,64 px
- 1440: 672 px

#### IMPLEMENTATION NOTES

- El botón «Abrir» marca el aviso como leído antes de navegar, de modo que el punto de no-leído de la campana se apaga al llegar.
- El destino depende del aviso: n1 lleva a /events/match-cuba, n2 a /announcements/a1 y n3 a /events/match-cuba/selection. En este trayecto el primer aviso no leído del jugador es n2.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: el destino no cambia de layout respecto de la lectura directa de un comunicado.
