# SURFACE MAP — COM_COMM_002_COMUNICADOS

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# COM_COMM_002_COMUNICADOS

**SCREEN ID:** COM_COMM_002_COMUNICADOS

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — pestaña Comunicados (COACH)

**PURPOSE AS IMPLEMENTED:** El canal de comunicados del club: lista de comunicados vigentes con su audiencia, fecha y estado.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /communication?tab=comunicados

**ORIGIN:** COM_COMM_001_CONVERSACIONES → pestaña «Comunicados»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** a1 (Sexta A), a2 (Todo el hockey), a3 (borrador)

**RESOURCE STATE:** 2 comunicados visibles (el borrador a3 no se lista)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?tab=comunicados&demo=coach.

**RELATED SCREEN IDS:** COM_COMM_003_COMUNICADOS_SUBCOMMITTEE, COM_ANNOUNCEMENT_001_DETAIL

**RESPONSIVE COUNTERPART:** Misma retícula de una columna; el Surface que envuelve la lista usa `flush` (sin padding).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CommunicationHome (tab comunicados), Surface flush, RowLink, Tag, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_002_COMUNICADOS_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de comunicados con su etiqueta de audiencia
- **FOCAL 2:** Pestaña «Comunicados» activa
- **SUPPORTING:** Contador «2 comunicados vigentes»
- **SECONDARY:** Encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AnnouncementRow | RowLink con Megaphone + Tag + StateBadge | Comunicado resumido |

### C01 — AnnouncementRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Megaphone + Tag + StateBadge
- **INSTANCE / ROLE:** Comunicado resumido
- **SOURCE COMPONENT:** RowLink + Tag + StateBadge
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > RowLink (announcements)
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=21 y=421.47 w=403.64 h=67.64
- CSS: width: 403.641px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 403.641px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 403.64×67.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-megaphone text-ink-faint (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Todo listo para la próxima fecha Para Sexta A mar, 20 oct Publicado"

#### STATE

- idle

#### INTERACTION

- trigger: click → /announcements/a1

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px; el Tag de audiencia y la fecha van en el detail, el badge a la derecha
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detail combina un Tag tone=selected con el texto «Para {label de audiencia}» y la fecha del comunicado.
- El label de audiencia sale del snapshot: «Sexta A» para a1 y «Todo el hockey» para a2.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# COM_COMM_002_COMUNICADOS

**SCREEN ID:** COM_COMM_002_COMUNICADOS

**DOMAIN:** 05_Comunicacion

**SURFACE NAME:** Comunicación — pestaña Comunicados (COACH)

**PURPOSE AS IMPLEMENTED:** El canal de comunicados del club: lista de comunicados vigentes con su audiencia, fecha y estado.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /communication?tab=comunicados

**ORIGIN:** COM_COMM_001_CONVERSACIONES → pestaña «Comunicados»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** a1 (Sexta A), a2 (Todo el hockey), a3 (borrador)

**RESOURCE STATE:** 2 comunicados visibles (el borrador a3 no se lista)

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /communication?tab=comunicados&demo=coach.

**RELATED SCREEN IDS:** COM_COMM_003_COMUNICADOS_SUBCOMMITTEE, COM_ANNOUNCEMENT_001_DETAIL

**RESPONSIVE COUNTERPART:** Misma retícula de una columna; el Surface que envuelve la lista usa `flush` (sin padding).

**SOURCE FILES:** src/features/communication.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** CommunicationHome (tab comunicados), Surface flush, RowLink, Tag, StateBadge

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `COM_COMM_002_COMUNICADOS_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Filas de comunicados con su etiqueta de audiencia
- **FOCAL 2:** Pestaña «Comunicados» activa
- **SUPPORTING:** Contador «2 comunicados vigentes»
- **SECONDARY:** Encabezado
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | AnnouncementRow | RowLink con Megaphone + Tag + StateBadge | Comunicado resumido |

### C01 — AnnouncementRow

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink con Megaphone + Tag + StateBadge
- **INSTANCE / ROLE:** Comunicado resumido
- **SOURCE COMPONENT:** RowLink + Tag + StateBadge
- **SOURCE FILE:** src/features/communication.tsx
- **SOURCE SYMBOL:** CommunicationHome > RowLink (announcements)
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=389 y=340.97 w=886 h=67.64
- CSS: width: 886px · min-width: 0px · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 886px, min-width 0px, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=0 dy=0 · padre 886×67.64
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-megaphone text-ink-faint (18x18)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Todo listo para la próxima fecha Para Sexta A mar, 20 oct Publicado"

#### STATE

- idle

#### INTERACTION

- trigger: click → /announcements/a1

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358 px; el Tag de audiencia y la fecha van en el detail, el badge a la derecha
- 1440: 896 px

#### IMPLEMENTATION NOTES

- El detail combina un Tag tone=selected con el texto «Para {label de audiencia}» y la fecha del comunicado.
- El label de audiencia sale del snapshot: «Sexta A» para a1 y «Todo el hockey» para a2.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
