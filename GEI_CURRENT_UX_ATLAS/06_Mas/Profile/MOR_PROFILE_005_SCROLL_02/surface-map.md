# SURFACE MAP — MOR_PROFILE_005_SCROLL_02

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MOR_PROFILE_005_SCROLL_02

**SCREEN ID:** MOR_PROFILE_005_SCROLL_02

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — sección de seguridad y cierre de sesión

**PURPOSE AS IMPLEMENTED:** Parte inferior del perfil: credencial, última actividad, sesiones activas y el cierre de sesión.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more/profile

**ORIGIN:** MOR_PROFILE_001_COACH (desplazamiento a y = 900)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sess-coach-1, sess-coach-2

**RESOURCE STATE:** COACH · scroll 900 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.
2. Desplazar a y = 900.

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH

**RESPONSIVE COUNTERPART:** La sección de seguridad es de una columna en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ProfilePage > DetailSection «Seguridad», Button variant=danger, KeyRound

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_005_SCROLL_02_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Botón «Cerrar sesión» (destructivo)
- **FOCAL 2:** Tarjetas de sesiones activas
- **SUPPORTING:** Credencial y última actividad
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | LogoutButton | Button danger | Cerrar la sesión de la cuenta propia |

### C01 — LogoutButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Cerrar la sesión de la cuenta propia
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger (logout)
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=250.52 y=565.61 w=110.48 h=44
- CSS: width: 110.484px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 110.484px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=234.52 dy=11 · padre 358×66

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Cerrar sesión"

#### STATE

- idle

#### INTERACTION

- trigger: click → logout() → el Shell redirige a /login

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, con icono LogOut 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Está separado del resto por un borde superior border-line y pt-5 (20 px).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 900
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 1632 · scrollY 788 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MOR_PROFILE_005_SCROLL_02

**SCREEN ID:** MOR_PROFILE_005_SCROLL_02

**DOMAIN:** 06_Mas

**SURFACE NAME:** Mi perfil — sección de seguridad y cierre de sesión

**PURPOSE AS IMPLEMENTED:** Parte inferior del perfil: credencial, última actividad, sesiones activas y el cierre de sesión.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more/profile

**ORIGIN:** MOR_PROFILE_001_COACH (desplazamiento a y = 900)

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** sess-coach-1, sess-coach-2

**RESOURCE STATE:** COACH · scroll 900 px

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.
2. Desplazar a y = 900.

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH

**RESPONSIVE COUNTERPART:** La sección de seguridad es de una columna en ambos viewports.

**SOURCE FILES:** src/features/account-insight.tsx, src/shared/ui.tsx

**SOURCE SYMBOLS:** ProfilePage > DetailSection «Seguridad», Button variant=danger, KeyRound

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MOR_PROFILE_005_SCROLL_02_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Botón «Cerrar sesión» (destructivo)
- **FOCAL 2:** Tarjetas de sesiones activas
- **SUPPORTING:** Credencial y última actividad
- **SECONDARY:** —
- **AMBIENT:** BottomNav fijo en 390

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | LogoutButton | Button danger | Cerrar la sesión de la cuenta propia |

### C01 — LogoutButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button danger
- **INSTANCE / ROLE:** Cerrar la sesión de la cuenta propia
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger (logout)
- **PARENT:** li
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1092.52 y=669.59 w=110.48 h=44
- CSS: width: 110.484px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 110.484px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by li · offset dx=644.52 dy=11 · padre 768×66

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Cerrar sesión"

#### STATE

- idle

#### INTERACTION

- trigger: click → logout() → el Shell redirige a /login

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px, con icono LogOut 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- Está separado del resto por un borde superior border-line y pt-5 (20 px).

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 900
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 1472 · scrollY 572 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
