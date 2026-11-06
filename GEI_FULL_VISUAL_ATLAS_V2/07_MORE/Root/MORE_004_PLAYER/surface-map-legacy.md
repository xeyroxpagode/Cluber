# SURFACE MAP — MORE_004_PLAYER

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MORE_004_PLAYER

**SCREEN ID:** MORE_004_PLAYER

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada de la jugadora

**PURPOSE AS IMPLEMENTED:** El hub para una jugadora: sólo ve su perfil y los informes; la sección de administration no existe para ella.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** actor=player

**RESOURCE STATE:** PLAYER · 2 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=player.

**RELATED SCREEN IDS:** MORE_001_COACH

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl; sólo dos filas y sin sección de jornadas.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** MorePage, canOpen('reports') = isSelfPlayer

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_004_PLAYER_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Dos accesos: «Mi perfil» e «Informes»
- **FOCAL 2:** Título «Más»
- **SUPPORTING:** Lead de la página
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Mi perfil) | RowLink | Acceso al perfil propio |

### C01 — MoreLinkRow (Mi perfil)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al perfil propio
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (profile)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=16 y=243.22 w=358 h=63.64
- CSS: width: 358px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 358px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 358×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Mi perfil Identidad, roles, cuenta y seguridad"

#### STATE

- idle

#### INTERACTION

- trigger: click → /more/profile

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El acceso «Mi perfil» siempre está presente (show: true).
- La jugadora ve informes porque isSelfPlayer es true para ella, aunque no pueda ver los datos de otras personas.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MORE_004_PLAYER

**SCREEN ID:** MORE_004_PLAYER

**DOMAIN:** 06_Mas

**SURFACE NAME:** Más — entrada de la jugadora

**PURPOSE AS IMPLEMENTED:** El hub para una jugadora: sólo ve su perfil y los informes; la sección de administration no existe para ella.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more

**ORIGIN:** Shell → destino «Más»

**ACTOR:** PLAYER

**RESOURCE / FIXTURE IDS:** actor=player

**RESOURCE STATE:** PLAYER · 2 accesos visibles

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more?demo=player.

**RELATED SCREEN IDS:** MORE_001_COACH

**RESPONSIVE COUNTERPART:** Contenedor max-w-3xl; sólo dos filas y sin sección de jornadas.

**SOURCE FILES:** src/features/account-insight.tsx, src/mock/authority.ts

**SOURCE SYMBOLS:** MorePage, canOpen('reports') = isSelfPlayer

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MORE_004_PLAYER_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Dos accesos: «Mi perfil» e «Informes»
- **FOCAL 2:** Título «Más»
- **SUPPORTING:** Lead de la página
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | MoreLinkRow (Mi perfil) | RowLink | Acceso al perfil propio |

### C01 — MoreLinkRow (Mi perfil)

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** RowLink
- **INSTANCE / ROLE:** Acceso al perfil propio
- **SOURCE COMPONENT:** RowLink
- **SOURCE FILE:** src/features/account-insight.tsx
- **SOURCE SYMBOL:** MorePage > RowLink (profile)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=448 y=220.72 w=768 h=63.64
- CSS: width: 768px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 768px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: normal · align-items: center · gap: 12px · padding: 12px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 768×131.28
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgba(0, 0, 0, 0) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-chevron-right shrink-0 text-ink-faint transition-colors group-hover:text-selected (16x16)
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Mi perfil Identidad, roles, cuenta y seguridad"

#### STATE

- idle

#### INTERACTION

- trigger: click → /more/profile

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: 358×63,64 px
- 1440: 768 px

#### IMPLEMENTATION NOTES

- El acceso «Mi perfil» siempre está presente (show: true).
- La jugadora ve informes porque isSelfPlayer es true para ella, aunque no pueda ver los datos de otras personas.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky top-0; BottomNav fixed bottom-0 en 390
- initial scroll: scrollY = 0
- scroll restoration observed: el Shell resetea el scroll a 0 en cada cambio de pathname
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
