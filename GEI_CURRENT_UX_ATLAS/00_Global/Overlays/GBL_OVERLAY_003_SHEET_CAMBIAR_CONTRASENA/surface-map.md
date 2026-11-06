# SURFACE MAP — GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

> Cartografía de la UX actual de GEI Hockey. Descripción factual de lo que existe hoy.
> Mediciones: sonda DOM real en Chrome headless (CDP) sobre el dev server local.

# GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**SCREEN ID:** GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**DOMAIN:** 00_Global

**SURFACE NAME:** Hoja lateral «Cambiar contraseña»

**PURPOSE AS IMPLEMENTED:** Sheet de una sola columna para editar la contraseña propia. Es el overlay de edición de cuenta propia (password y contacto).

**VIEWPORT:** 390×844 (móvil) — móvil

**ROUTE:** /more/profile

**ORIGIN:** MOR_PROFILE_001_COACH → «Cambiar contraseña»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** Panel abierto, sin valores escritos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.
2. Pulsar «Cambiar contraseña» en la sección «Seguridad».

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH, MOR_PROFILE_004_CONTACT_SHEET

**RESPONSIVE COUNTERPART:** El Sheet es siempre un panel lateral de ancho completo con max-w-md (448 px) anclado a la derecha; no cambia de forma entre 390 y 1440, sólo se ve más angosto respecto del viewport.

**SOURCE FILES:** src/shared/ui.tsx, src/features/account-insight.tsx

**SOURCE SYMBOLS:** Sheet, PasswordDialog, TextField, useFocusTrap

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA_390.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cambiar contraseña»
- **FOCAL 2:** Campos «Contraseña actual» y «Contraseña nueva»
- **SUPPORTING:** Descripción «Necesita al menos 12 caracteres.»
- **SECONDARY:** Botones «Cancelar» / «Cambiar contraseña»
- **AMBIENT:** Perfil oscurecido por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SheetBackdrop | div absolute inset-0 bg-overlay | Fondo del overlay |
| C02 | SheetPanel | section[role=dialog] | Panel lateral |
| C03 | PasswordField (actual) | TextField | Campo de contraseña actual |
| C04 | SheetFooter | div flex | Acciones del formulario |

### C01 — SheetBackdrop

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div absolute inset-0 bg-overlay
- **INSTANCE / ROLE:** Fondo del overlay
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > div[aria-hidden]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=844
- CSS: width: 390px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 390px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(16, 23, 37, 0.42) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- visible

#### INTERACTION

- trigger: click → onClose

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cubre el viewport
- 1440: cubre el viewport

#### IMPLEMENTATION NOTES

- A diferencia de Modal, el backdrop del Sheet no lleva backdrop-blur.

### C02 — SheetPanel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Panel lateral
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > section[role=dialog]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=390 h=844
- CSS: width: 390px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 390px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 390×844
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cambiar contraseña Necesita al menos 12 caracteres. Contraseña actual OPCIONAL C"

#### STATE

- open (aria-modal=true)

#### INTERACTION

- trigger: Escape → onClose
- focus trap: sí (useFocusTrap)
- foco inicial: primer control que no sea «Cerrar»

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: w-full h-full max-w-md → 100% del viewport
- 1440: 448 px, alineado a la derecha

#### IMPLEMENTATION NOTES

- h-full: el panel ocupa todo el alto del viewport.

### C03 — PasswordField (actual)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Campo de contraseña actual
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField / Field
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=20 y=119.33 w=350 h=43.69
- CSS: width: 350px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 350px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 350×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle / vacío

#### INTERACTION

- trigger: escribir → estado local
- al error se enfoca este campo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: ancho completo del panel
- 1440: ancho completo del panel

#### IMPLEMENTATION NOTES

- —

### C04 — SheetFooter

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** div flex
- **INSTANCE / ROLE:** Acciones del formulario
- **SOURCE COMPONENT:** Sheet > footer + Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > div[footer]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=203.61 y=400.47 w=170.39 h=44
- CSS: width: 170.391px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 170.391px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=187.61 dy=0 · padre 358×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-key-round (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Cambiar contraseña"

#### STATE

- idle

#### INTERACTION

- trigger: click → changePassword(current, next)

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: borde superior border-line, padding 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet (overflow-y auto)
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 390 · scrollHeight 1632 · scrollY 691 · viewport 390×844

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo componente; el panel mide 448 px (max-w-md) en ambos, por lo que a 390 ocupa el 100% del ancho y a 1440 el 31%.

# GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**SCREEN ID:** GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA

**DOMAIN:** 00_Global

**SURFACE NAME:** Hoja lateral «Cambiar contraseña»

**PURPOSE AS IMPLEMENTED:** Sheet de una sola columna para editar la contraseña propia. Es el overlay de edición de cuenta propia (password y contacto).

**VIEWPORT:** 1440×900 (desktop) — escritorio

**ROUTE:** /more/profile

**ORIGIN:** MOR_PROFILE_001_COACH → «Cambiar contraseña»

**ACTOR:** COACH

**RESOURCE / FIXTURE IDS:** actor=coach

**RESOURCE STATE:** Panel abierto, sin valores escritos

**SCROLL POSITION:** top de página (scrollY = 0)

**STEPS TO REPRODUCE:**

1. Abrir /more/profile?demo=coach.
2. Pulsar «Cambiar contraseña» en la sección «Seguridad».

**RELATED SCREEN IDS:** MOR_PROFILE_001_COACH, MOR_PROFILE_004_CONTACT_SHEET

**RESPONSIVE COUNTERPART:** El Sheet es siempre un panel lateral de ancho completo con max-w-md (448 px) anclado a la derecha; no cambia de forma entre 390 y 1440, sólo se ve más angosto respecto del viewport.

**SOURCE FILES:** src/shared/ui.tsx, src/features/account-insight.tsx

**SOURCE SYMBOLS:** Sheet, PasswordDialog, TextField, useFocusTrap

**CONFIDENCE:** BOTH (sonda DOM en navegador + lectura de código fuente)

**CAPTURE:** `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA_1440.png` presente en esta carpeta

## PERCEPTUAL HIERARCHY

- **FOCAL 1:** Título «Cambiar contraseña»
- **FOCAL 2:** Campos «Contraseña actual» y «Contraseña nueva»
- **SUPPORTING:** Descripción «Necesita al menos 12 caracteres.»
- **SECONDARY:** Botones «Cancelar» / «Cambiar contraseña»
- **AMBIENT:** Perfil oscurecido por el backdrop

## COMPONENT INVENTORY

| ID | Componente | Tipo | Instancia / rol |
| --- | --- | --- | --- |
| C01 | SheetBackdrop | div absolute inset-0 bg-overlay | Fondo del overlay |
| C02 | SheetPanel | section[role=dialog] | Panel lateral |
| C03 | PasswordField (actual) | TextField | Campo de contraseña actual |
| C04 | SheetFooter | div flex | Acciones del formulario |

### C01 — SheetBackdrop

- **COMPONENT ID:** C01
- **COMPONENT TYPE:** div absolute inset-0 bg-overlay
- **INSTANCE / ROLE:** Fondo del overlay
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > div[aria-hidden]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=0 y=0 w=1440 h=900
- CSS: width: 1440px · min-width: 0px · min-height: 0px · max-width: none

#### POSITION MODEL

- absolute

#### CONSTRAINTS

- width 1440px, min-width 0px, max-width none

#### LAYOUT

- display: block · padding: 0px

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=0 · padre 1440×900
- aligned with parent left edge
- positioned absolute · z-index auto

#### VISUAL CONFIGURATION

- background: rgba(16, 23, 37, 0.42) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- visible

#### INTERACTION

- trigger: click → onClose

#### MOTION

- Sin transición

#### RESPONSIVE

- 390: cubre el viewport
- 1440: cubre el viewport

#### IMPLEMENTATION NOTES

- A diferencia de Modal, el backdrop del Sheet no lleva backdrop-blur.

### C02 — SheetPanel

- **COMPONENT ID:** C02
- **COMPONENT TYPE:** section[role=dialog]
- **INSTANCE / ROLE:** Panel lateral
- **SOURCE COMPONENT:** Sheet
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > section[role=dialog]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=992 y=0 w=448 h=900
- CSS: width: 448px · min-width: auto · min-height: auto · max-width: 448px

#### POSITION MODEL

- relative

#### CONSTRAINTS

- width 448px, min-width auto, max-width 448px

#### LAYOUT

- display: flex · flex-direction: column · justify-content: normal · align-items: normal · padding: 0px · max-width: 448px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=992 dy=0 · padre 1440×900

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 0px solid rgb(16, 23, 37) · border-radius: 0px · box-shadow: shadow (ver sonda) · opacity: 1
- typography: font-family: Inter · font-size: 16px · line-height: 24px · font-weight: 400

#### CONTENT

- visible: "Cambiar contraseña Necesita al menos 12 caracteres. Contraseña actual OPCIONAL C"

#### STATE

- open (aria-modal=true)

#### INTERACTION

- trigger: Escape → onClose
- focus trap: sí (useFocusTrap)
- foco inicial: primer control que no sea «Cerrar»

#### MOTION

- Sin animación de entrada

#### RESPONSIVE

- 390: w-full h-full max-w-md → 100% del viewport
- 1440: 448 px, alineado a la derecha

#### IMPLEMENTATION NOTES

- h-full: el panel ocupa todo el alto del viewport.

### C03 — PasswordField (actual)

- **COMPONENT ID:** C03
- **COMPONENT TYPE:** TextField
- **INSTANCE / ROLE:** Campo de contraseña actual
- **SOURCE COMPONENT:** TextField / Field
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** TextField / Field
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1012 y=119.33 w=408 h=43.69
- CSS: width: 408px · min-width: auto · min-height: auto · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 408px, min-width auto, max-width none

#### LAYOUT

- display: block · padding: 10px 12px · min-height: auto · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=0 dy=27.69 · padre 408×71.38
- aligned with parent left edge

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- typography: font-family: Inter · font-size: 14px · line-height: 21.7px · font-weight: 400

#### CONTENT

- visible: —

#### STATE

- idle / vacío

#### INTERACTION

- trigger: escribir → estado local
- al error se enfoca este campo

#### MOTION

- transition-colors duration-micro

#### RESPONSIVE

- 390: ancho completo del panel
- 1440: ancho completo del panel

#### IMPLEMENTATION NOTES

- —

### C04 — SheetFooter

- **COMPONENT ID:** C04
- **COMPONENT TYPE:** div flex
- **INSTANCE / ROLE:** Acciones del formulario
- **SOURCE COMPONENT:** Sheet > footer + Button
- **SOURCE FILE:** src/shared/ui.tsx
- **SOURCE SYMBOL:** Sheet > div[footer]
- **PARENT:** div
- **CHILDREN:** —

#### GEOMETRY

- rendered: x=1045.61 y=428.45 w=170.39 h=44
- CSS: width: 170.391px · min-width: auto · min-height: 44px · max-width: none

#### POSITION MODEL

- static

#### CONSTRAINTS

- width 170.391px, min-width auto, max-width none

#### LAYOUT

- display: flex · flex-direction: row · justify-content: center · align-items: center · gap: 8px · padding: 10px 16px · min-height: 44px · min-width: auto

#### SPATIAL RELATIONSHIPS

- contained-by div · offset dx=597.61 dy=0 · padre 768×44

#### VISUAL CONFIGURATION

- background: rgb(255, 255, 255) · color: rgb(16, 23, 37) · border: 1px solid rgb(198, 206, 219) · border-radius: 8px · box-shadow: none · opacity: 1
- icon: lucide lucide-key-round (14x14)
- typography: font-family: Inter · font-size: 12px · line-height: 17.4px · font-weight: 400

#### CONTENT

- visible: "Cambiar contraseña"

#### STATE

- idle

#### INTERACTION

- trigger: click → changePassword(current, next)

#### MOTION

- transition-colors duration-micro ease-gei

#### RESPONSIVE

- 390: borde superior border-line, padding 16 px
- 1440: idéntico

#### IMPLEMENTATION NOTES

- —

## SCROLL CONTRACT

- what scrolls: el cuerpo del sheet (overflow-y auto)
- what remains sticky/fixed: fixed inset-0 z-50; body con overflow hidden
- initial scroll: scroll del body bloqueado
- scroll restoration observed: al cerrar se restaura overflow y foco
- scroll lost on navigation: n/a

- Medición de documento: scrollWidth 1440 · scrollHeight 1472 · scrollY 551 · viewport 1440×900

## RESPONSIVE RELATIONSHIP — CURRENT

- 390 ↔ 1440: mismo componente; el panel mide 448 px (max-w-md) en ambos, por lo que a 390 ocupa el 100% del ancho y a 1440 el 31%.
