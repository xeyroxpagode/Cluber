# SURFACE MAP — MGT_PERSON_002_PERTENENCIA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# MGT_PERSON_002_PERTENENCIA

**SCREEN ID:** MGT_PERSON_002_PERTENENCIA

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Pertenencia

**PURPOSE AS IMPLEMENTED:** Sección de pertenencia: el vínculo con el club, su vigencia y la acción de finalizarlo.

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /management/people/p2?section=pertenencia

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → pestaña «Pertenencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** mem-p2 (vigente desde hace 200 días)

**RESOURCE STATE:** PERTENENCIA VIGENTE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=pertenencia&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_PERSON_010_NO_MEMBERSHIP, MGT_PERSON_012_MEMBERSHIP_END_CONFIRM

**RESPONSIVE COUNTERPART:** La sección es de una columna; la acción «Finalizar» queda a la derecha del encabezado de sección.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (section=pertenencia), Surface, SectionHeader, Button variant=danger, periodLabel

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_002_PERTENENCIA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Superficie «Pertenencia vigente» con su período
- **FOCAL 2:** Botón «Finalizar» (destructivo)
- **SUPPORTING:** Texto explicativo sobre la conservación del histórico
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EndMembershipButton | Button danger sm | Finalizar la pertenencia con motivo |

### C01 — EndMembershipButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button danger sm
- **INSTANCE / ROLE:** Finalizar la pertenencia con motivo
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger size=sm («Finalizar»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=33 y=390.88 w=81.52 h=44
- CSS: width: 81.5156px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 81.5156px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=25.25 · padre 436.58×69.25
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Finalizar"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Finalizar pertenencia»

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El meta del SectionHeader es el período de vigencia, formateado con periodLabel.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 390 · scrollHeight 844 · scrollY 0 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.

# MGT_PERSON_002_PERTENENCIA

**SCREEN ID:** MGT_PERSON_002_PERTENENCIA

**DOMAIN:** 07_Gestion

**SURFACE NAME:** Ficha de persona — Pertenencia

**PURPOSE AS IMPLEMENTED:** Sección de pertenencia: el vínculo con el club, su vigencia y la acción de finalizarlo.

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /management/people/p2?section=pertenencia

**ORIGIN:** MGT_PERSON_001_IDENTIDAD → pestaña «Pertenencia»

**ACTOR:** ADMIN

**RESOURCE / FIXTURE IDS:** mem-p2 (vigente desde hace 200 días)

**RESOURCE STATE:** PERTENENCIA VIGENTE

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /management/people/p2?section=pertenencia&demo=admin.

**RELATED SCREEN IDS:** MGT_PERSON_001_IDENTIDAD, MGT_PERSON_010_NO_MEMBERSHIP, MGT_PERSON_012_MEMBERSHIP_END_CONFIRM

**RESPONSIVE COUNTERPART:** La sección es de una columna; la acción «Finalizar» queda a la derecha del encabezado de sección.

**SOURCE FILES:** src/features/management.tsx, src/shared/ui.tsx, src/shared/patterns.tsx

**SOURCE SYMBOLS:** PersonAdminDetail (section=pertenencia), Surface, SectionHeader, Button variant=danger, periodLabel

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `MGT_PERSON_002_PERTENENCIA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Superficie «Pertenencia vigente» con su período
- **FOCAL 2:** Botón «Finalizar» (destructivo)
- **SUPPORTING:** Texto explicativo sobre la conservación del histórico
- **SECONDARY:** —
- **AMBIENT:** Cromo de la app

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | EndMembershipButton | Button danger sm | Finalizar la pertenencia con motivo |

### C01 — EndMembershipButton

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** Button danger sm
- **INSTANCE / ROLE:** Finalizar la pertenencia con motivo
- **SOURCE COMPONENT:** Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Button variant=danger size=sm («Finalizar»)
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1177.48 y=312.13 w=81.52 h=44
- CSS: width: 81.5156px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 81.5156px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=772.48 dy=0 · padre 854×44

#### VISUAL CONFIGURATION

- background: rgb(253, 236, 236) · color: rgb(163, 35, 43) · border: 1px solid rgb(242, 194, 196) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Finalizar"

#### STATE

- idle

#### INTERACTION

- trigger: click → abre el ConfirmDialog «Finalizar pertenencia»

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: min-height 44 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- El meta del SectionHeader es el período de vigencia, formateado con periodLabel.

## SCROLL CONTRACT

- what scrolls: la página
- what remains sticky/fixed: header sticky; BottomNav fixed en 390
- initial scroll: scrollY = 0
- scroll restoration observed: scroll a 0 por ruta
- scroll lost on navigation: Sí

- Medición de documento: scrollWidth 1440 · scrollHeight 901 · scrollY 0 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: sin diferencias estructurales.
