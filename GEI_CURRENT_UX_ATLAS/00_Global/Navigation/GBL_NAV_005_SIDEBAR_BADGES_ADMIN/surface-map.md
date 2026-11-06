# SURFACE MAP — GBL_NAV_005_SIDEBAR_BADGES_ADMIN

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_NAV_005_SIDEBAR_BADGES_ADMIN

**SCREEN ID:** GBL_NAV_005_SIDEBAR_BADGES_ADMIN

**DOMAIN:** 00_Global

**SURFACE NAME:** Barra lateral con contadores de no-leídos (ADMIN, 1440)

**PURPOSE AS IMPLEMENTED:** La misma barra lateral para un actor con autoridad de club. El destino «Comunicación» no aparece porque el ADMIN no tiene canChat.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /home

**ORIGIN:** Shell

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** actor=admin (Mariana Costa)

**RESOURCE STATE:** AUTHENTICATED · sin conversaciones habilitadas

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /home?demo=admin con viewport 1440×900.

**RELATED SCREEN IDS:** GBL_NAV_004_SIDEBAR_BADGES_COACH, COM_COMM_004_NO_CHAT_ADMIN

**RESPONSIVE COUNTERPART:** El conjunto de destinos visibles depende del actor, no del viewport: la misma lógica de filtrado (authority.canOpen) aplica a la barra lateral de 1440 y al BottomNav de 390.

**SOURCE FILES:** src/app/Shell.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** Shell > visibleNav, getAuthority > canOpen

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_NAV_005_SIDEBAR_BADGES_ADMIN_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Lista de destinos sin el destino Comunicación
- **FOCAL 2:** Destino activo «Inicio»
- **SUPPORTING:** Contador de avisos en «Más»
- **SECONDARY:** Contenido de Inicio (atención de altas pendientes)
- **AMBIENT:** TopBar

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SidebarNav (visibleNav filtrado) | nav sticky | Destinos visibles para el ADMIN |

### C01 — SidebarNav (visibleNav filtrado)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** nav sticky
- **INSTANCE / ROLE:** Destinos visibles para el ADMIN
- **SOURCE COMPONENT:** Shell + authority
- **SOURCE FILE:** src/app/Shell.tsx
- **SOURCE SYMBOL:** Shell > visibleNav = NAV.filter(authority.canOpen)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=65 w=224 h=836
- CSS: width: 224px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- sticky

#### CONSTRAINTS

- width 224px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · gap: 4px · padding: 16px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×1184.5
- aligned with parent left edge
- sticky

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(222, 227, 234) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Inicio Calendario Equipos Más"

#### STATE

- Comunicación ausente

#### INTERACTION

- trigger: click → navegación SPA

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: no existe (BottomNav con la misma filtración)
- 1440: 224 px

#### IMPLEMENTATION NOTES

- El ADMIN no puede abrir «communication» porque canChat exige un rol PLAYER/CAPTAIN/COACH con pertenencia vigente.
- El actor admin tampoco es isSelfPlayer, por lo que /reports le queda inaccesible (canOpen reports = isSelfPlayer || coachTeams || official).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: nav sticky top-16
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1250 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: la lista de destinos es la misma en ambos; lo que cambia por actor (y por tanto también por viewport) es cuáles destinos existen.
