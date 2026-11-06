# MOTION INDEX — GEI CURRENT UX ATLAS

Clips de motion capturados de la app real, con su línea de tiempo real.

**Método:** `Page.startScreencast` (CDP) sobre Chrome headless durante la
interacción; los frames se reassemblan con ffmpeg usando un concat demuxer con
la **duración real de cada frame**, de modo que la línea de tiempo del video
corresponde a la de la sesión real. Junto a cada `.mp4` quedan:

- `<MOTION_ID>.meta.json` — ruta, actor, viewport, cantidad de frames, duración
  medida, pasos ejecutados y referencia al código fuente.
- `<MOTION_ID>.frames.txt` — línea de tiempo frame a frame.

**Interpretación del número de frames:** Chrome sólo emite un frame cuando la
pantalla cambia. Un clip de **2 frames** (antes / después) documenta que el
overlay aparece **sin animación intermedia**: no hay interpolación, el montaje
es instantáneo. Un clip de 12–15 frames (cambio de pestaña, respuesta de
disponibilidad) documenta los repintados intermedios.

---

## Índice de clips

| Motion ID | Superficie | Viewport | Frames | Duración video | Confianza |
| --- | --- | --- | --- | --- | --- |
| `MOTION_MENU_OPEN_390` | `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` | 390 | 2 | 2,67 s | OBSERVED-MEASURED |
| `MOTION_MENU_OPEN_1440` | `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` | 1440 | 2 | 2,67 s | OBSERVED-MEASURED |
| `MOTION_MENU_OPEN_1440_CONV` | `COM_ANNOUNCEMENT_003_MENU_OPEN` | 1440 | 2 | 2,67 s | OBSERVED-MEASURED |
| `MOTION_MODAL_HISTORY_390` | `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | 390 | 2 | 2,67 s | OBSERVED-MEASURED |
| `MOTION_SHEET_LIFECYCLE_390` | `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET` | 390 | 3 | 3,47 s | OBSERVED-MEASURED |
| `MOTION_CONFIRM_CANCEL_390` | `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM` | 390 | 4 | 4,73 s | OBSERVED-MEASURED |
| `MOTION_MODAL_SCOPE_1440` | `CAL_EVENT_FORM_009_SCOPE_DIALOG` | 1440 | 3 | 3,93 s | OBSERVED-MEASURED |
| `MOTION_SHEET_PASSWORD_390` | `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` | 390 | 3 | 3,60 s | OBSERVED-MEASURED |
| `MOTION_SELECTION_EXPAND_390` | `PRT_SELECTION_003_REVISIONS_OPEN` | 390 | 2 | 2,67 s | OBSERVED-MEASURED |
| `MOTION_TAB_COMMUNICATION_390` | `COM_COMM_002_COMUNICADOS` | 390 | 13 | 2,83 s | OBSERVED-MEASURED |
| `MOTION_TEAM_TAB_390` | `EQ_TEAM_DETAIL_002_PERSONAS` | 390 | 12 | 2,83 s | OBSERVED-MEASURED |
| `MOTION_VAS_ANSWER_390` | `CAL_EVENT_DETAIL_009_PLAYER_VIEW` | 390 | 15 | 6,43 s | OBSERVED-MEASURED |

---

## Composición de cada clip

### 1. Apertura de `Menu` — `MOTION_MENU_OPEN_390`, `MOTION_MENU_OPEN_1440`, `MOTION_MENU_OPEN_1440_CONV`

| | |
| --- | --- |
| **Trigger** | click en el botón «Acciones» |
| **Before** | la página con el encabezado y su badge de estado |
| **After** | el panel `div[role=menu]` posicionado 4 px debajo del botón |
| **Duración** | aparición instantánea: 2 frames (antes / después) |
| **Easing** | — (no hay transición) |
| **Propiedades** | ninguna: el panel se monta con `position:absolute; top:calc(100%+4px); right:0` |
| **Origen** | botón → `div.relative` → panel; el anclaje es el botón |
| **Interrumpible** | sí: `Escape` o click fuera lo cierran en cualquier momento |
| **Reverse** | cerrar es otro montaje/desmontaje, sin animación inversa |
| **Reduced motion** | sin efecto observable (no hay animación que reducir) |
| **Source** | `src/shared/ui.tsx` · `Menu` |

### 2. Apertura de `Modal` — `MOTION_MODAL_HISTORY_390`

| | |
| --- | --- |
| **Trigger** | click en «Ver todo» (sección «Historial» del detalle de evento) |
| **Before** | el detalle de evento scrolls |
| **After** | hoja inferior con el backdrop `bg-overlay` + `backdrop-blur-[2px]` |
| **Duración** | instantánea (2 frames) |
| **Propiedades** | ninguna; el `backdrop-filter` aparece junto con el panel |
| **Origen** | el Modal se monta como hijo del árbol de la pantalla, a pantalla completa |
| **Interrumpible** | no durante la apertura; sí se puede cerrar con Escape / X / click en el backdrop |
| **Reduced motion** | sin efecto observable |
| **Source** | `src/shared/ui.tsx` · `Modal` + `useFocusTrap` |

### 3. Apertura de `Sheet` — `MOTION_SHEET_LIFECYCLE_390`, `MOTION_SHEET_PASSWORD_390`

| | |
| --- | --- |
| **Trigger** | «Acciones» → «Postergar» / «Cambiar contraseña» |
| **Before** | la página con el overlay anterior (menú abierto, en el primer caso) |
| **After** | panel lateral `fixed inset-0` con `max-w-md` a la derecha |
| **Duración** | instantánea (3 frames: antes, menú, panel) |
| **Propiedades** | ninguna; el `Sheet` no declara transición |
| **Origen** | el panel se ancla al borde derecho del viewport, no al elemento que lo abrió |
| **Interrumpible** | no durante la apertura; el foco queda atrapado dentro del panel |
| **Reduced motion** | sin efecto observable |
| **Source** | `src/shared/ui.tsx` · `Sheet`; `src/features/events.tsx` · `LifecycleActions` |

### 4. Apertura de `ConfirmDialog` sobre un `Sheet` — `MOTION_CONFIRM_CANCEL_390`

| | |
| --- | --- |
| **Trigger** | «Acciones» → «Cancelar evento» → «Cancelar» |
| **Before** | el Sheet de ciclo de vida abierto |
| **After** | un segundo overlay (`Modal`) por encima del Sheet, con su propio backdrop |
| **Duración** | instantánea (4 frames) |
| **Propiedades** | ninguna; el `bg-overlay` del Modal oscurece el Sheet que queda debajo |
| **Origen** | el Modal se monta dentro del árbol del Sheet (overlay anidado) |
| **Interrumpible** | no |
| **Reduced motion** | sin efecto observable |
| **Source** | `src/features/events.tsx` · `LifecycleActions` → `ConfirmDialog` → `Modal` |

### 5. Diálogo de alcance de serie — `MOTION_MODAL_SCOPE_1440`

| | |
| --- | --- |
| **Trigger** | editar la hora de un evento de serie → «Guardar cambios» |
| **Before** | el formulario de edición con el campo de hora modificado |
| **After** | `Modal` «¿Dónde aplicás el cambio?» con las tres opciones de alcance |
| **Duración** | instantánea (3 frames) |
| **Propiedades** | ninguna |
| **Origen** | el diálogo aparece tras la validación del formulario, no al hacer clic |
| **Interrumpible** | no |
| **Reduced motion** | sin efecto observable |
| **Source** | `src/shared/patterns.tsx` · `ScopeDialog` |

### 6. Expansión de revisiones — `MOTION_SELECTION_EXPAND_390`

| | |
| --- | --- |
| **Trigger** | click en «Ver 1» (sección «Revisiones publicadas») |
| **Before** | la sección plegada con el botón «Ver 1» |
| **After** | la sección desplegada con el `HistoryList`; el botón dice «Ocultar» |
| **Duración** | instantánea (2 frames) |
| **Propiedades** | ninguna: el contenido se monta/desmonta, no se despliega con altura animada |
| **Origen** | dentro de la misma `Surface`; el contenido crece hacia abajo |
| **Interrumpible** | sí (toggle inmediato) |
| **Reduced motion** | sin efecto observable |
| **Source** | `src/features/participation.tsx` · `SelectionPage` |

### 7. Cambio de pestaña — `MOTION_TAB_COMMUNICATION_390`, `MOTION_TEAM_TAB_390`

| | |
| --- | --- |
| **Trigger** | click en la pestaña destino («Comunicados» / «Personas») |
| **Before** | la pestaña anterior activa con `border-interactive text-interactive` |
| **After** | la pestaña nueva activa; el contenido inferior cambia |
| **Duración** | 12–13 frames, ~0,4 s de línea de tiempo activa |
| **Easing** | `transition-colors duration-micro` (120 ms) en color de texto y borde |
| **Propiedades** | `color` y `border-color` de la pestaña; el contenido se reemplaza |
| **Origen** | el estado de la pestaña se escribe en la URL (`?tab=`) |
| **Interrumpible** | sí: el cambio de URL es inmediato, el color interpola 120 ms |
| **Reverse** | el mismo mecanismo al volver a la pestaña anterior |
| **Reduced motion** | la regla global lleva la duración a 0,01 ms: el color cambia de golpe |
| **Source** | `src/shared/ui.tsx` · `TabBar`; `src/features/overview.tsx` · `TeamDetail` (pestañas propias) |

### 8. Respuesta de disponibilidad + toast — `MOTION_VAS_ANSWER_390`

| | |
| --- | --- |
| **Trigger** | click en «Tal vez» del control ¿Vas? |
| **Before** | el radio group sin selección y la fila de «Tu respuesta: Sin respuesta» |
| **After** | la opción «Tal vez» marcada (fondo `bg-warning-soft`, borde del tono) y el toast «Respuesta guardada.» en la parte inferior |
| **Duración** | 15 frames, ~2,85 s de línea de tiempo activa; el toast permanece 3800 ms desde su aparición |
| **Easing** | `transition-colors duration-micro` (120 ms) en la etiqueta; el toast no tiene animación |
| **Propiedades** | `background-color`, `border-color` y `color` de la etiqueta; el toast se monta con `position:fixed` |
| **Origen** | el radio group se reemplaza en el lugar; el toast se ancla al centro inferior del viewport (`left-1/2 -translate-x-1/2`) |
| **Interrumpible** | sí: se puede elegir otra opción mientras la mutación corre (el `busy` del botón no aplica al radio group) |
| **Reverse** | elegir otra opción vuelve a interpolar el color en 120 ms |
| **Reduced motion** | el cambio de color es instantáneo; el toast se comporta igual |
| **Source** | `src/shared/vas.tsx` · `VasControl`; `src/shared/ui.tsx` · `Toast`; `src/mock/store.tsx` · `toast()` (3800 ms) |

---

## Movimiento declarado pero no observado en las surfaces capturadas

| Token / clase | Dónde está | Observación |
| --- | --- | --- |
| `animate-spin` (Loader2) | `Button busy` | Observable en los botones durante una mutación; no se capturó en clip por su duración (~380 ms) |
| `rotate-180` del chevron | `Expander` | El primitive `Expander` está importado en las features pero **nunca se renderiza** en el producto actual |
| `--duration-state: 180ms` | `src/styles/theme.css` | Token declarado, sin uso observado |
| `motion-reduce:animate-none` | iconos busy | Regla global de `prefers-reduced-motion` |
