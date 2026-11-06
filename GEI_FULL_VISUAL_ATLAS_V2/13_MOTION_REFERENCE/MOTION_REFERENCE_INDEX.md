# MOTION REFERENCE INDEX — GEI FULL VISUAL ATLAS V2

Clips de motion de GEI CURRENT copiados sin modificar desde el atlas previo
(`GEI_CURRENT_UX_ATLAS/`). No se regeneró ningún clip.

**Método de captura original:** `Page.startScreencast` (CDP) sobre Chrome headless durante la
interacción; los frames se reassemblan con ffmpeg usando un concat demuxer con la duración real
de cada frame, de modo que la línea de tiempo del video corresponde a la de la sesión real.
Junto a cada `.mp4` quedan `<MOTION_ID>.meta.json` (ruta, actor, viewport, frames, duración
medida, pasos y referencia al código fuente) y `<MOTION_ID>.frames.txt` (línea de tiempo frame a frame).

**Clips copiados:** 12

## Clips

| Motion | Previous atlas path | Origin surface | Action | Destination/state | Available mobile/desktop |
| --- | --- | --- | --- | --- | --- |
| `MOTION_CONFIRM_CANCEL_390` (Dialog / ConfirmDialog sobre Sheet) | `GEI_CURRENT_UX_ATLAS/02_Calendario/EventDetail/CAL_EVENT_DETAIL_003_CANCEL_CONFIRM/motion/MOTION_CONFIRM_CANCEL_390.mp4` | `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM` | click en «Acciones» → «Cancelar evento» → «Cancelar» | Estado: ConfirmDialog «Cancelar evento» montado encima del Sheet. | mobile 390×844 |
| `MOTION_MENU_OPEN_1440` (Menu (overlay)) | `GEI_CURRENT_UX_ATLAS/00_Global/Overlays/GBL_OVERLAY_001_MENU_ACCIONES_EVENTO/motion/MOTION_MENU_OPEN_1440.mp4` | `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` | click en «Acciones» | Estado: panel div[role=menu] abierto bajo el botón «Acciones». | desktop 1440×900 |
| `MOTION_MENU_OPEN_1440_CONV` (Menu (overlay)) | `GEI_CURRENT_UX_ATLAS/05_Comunicacion/Announcements/COM_ANNOUNCEMENT_003_MENU_OPEN/motion/MOTION_MENU_OPEN_1440_CONV.mp4` | `COM_ANNOUNCEMENT_003_MENU_OPEN` | click en «Acciones» | Estado: panel div[role=menu] abierto en el encabezado del comunicado. | desktop 1440×900 |
| `MOTION_MENU_OPEN_390` (Menu (overlay)) | `GEI_CURRENT_UX_ATLAS/00_Global/Overlays/GBL_OVERLAY_001_MENU_ACCIONES_EVENTO/motion/MOTION_MENU_OPEN_390.mp4` | `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` | click en «Acciones» | Estado: panel div[role=menu] abierto bajo el botón «Acciones». | mobile 390×844 |
| `MOTION_MODAL_HISTORY_390` (Dialog / Modal) | `GEI_CURRENT_UX_ATLAS/00_Global/Overlays/GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO/motion/MOTION_MODAL_HISTORY_390.mp4` | `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` | click en «Ver todo» (sección Historial) | Estado: Modal «Historial del evento» con backdrop bg-overlay + backdrop-blur-[2px]. | mobile 390×844 |
| `MOTION_MODAL_SCOPE_1440` (Dialog / ScopeDialog) | `GEI_CURRENT_UX_ATLAS/02_Calendario/EventSeries/CAL_EVENT_FORM_009_SCOPE_DIALOG/motion/MOTION_MODAL_SCOPE_1440.mp4` | `CAL_EVENT_FORM_009_SCOPE_DIALOG` | editar la hora de un evento de serie → «Guardar cambios» | Estado: ScopeDialog «¿Dónde aplicás el cambio?» con las tres opciones de alcance. | desktop 1440×900 |
| `MOTION_SELECTION_EXPAND_390` (Expansión de lista (mount/unmount)) | `GEI_CURRENT_UX_ATLAS/03_Participacion/Selection/PRT_SELECTION_003_REVISIONS_OPEN/motion/MOTION_SELECTION_EXPAND_390.mp4` | `PRT_SELECTION_003_REVISIONS_OPEN` | click en «Ver 1» (Revisiones publicadas) | Estado: sección «Revisiones publicadas» desplegada; el botón pasa a «Ocultar». | mobile 390×844 |
| `MOTION_SHEET_LIFECYCLE_390` (Sheet (panel lateral)) | `GEI_CURRENT_UX_ATLAS/02_Calendario/EventDetail/CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET/motion/MOTION_SHEET_LIFECYCLE_390.mp4` | `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET` | click en «Acciones» → «Postergar» | Estado: Sheet lateral derecho (max-w-md) de ciclo de vida del evento. | mobile 390×844 |
| `MOTION_SHEET_PASSWORD_390` (Sheet (panel lateral)) | `GEI_CURRENT_UX_ATLAS/00_Global/Overlays/GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA/motion/MOTION_SHEET_PASSWORD_390.mp4` | `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` | scroll 700 → click en «Cambiar contraseña» | Estado: Sheet lateral derecho «Cambiar contraseña» con focus trap. | mobile 390×844 |
| `MOTION_TAB_COMMUNICATION_390` (Cambio de pestaña) | `GEI_CURRENT_UX_ATLAS/05_Comunicacion/Announcements/COM_COMM_002_COMUNICADOS/motion/MOTION_TAB_COMMUNICATION_390.mp4` | `COM_COMM_002_COMUNICADOS` | click en la pestaña «Comunicados» | Estado: pestaña «Comunicados» activa; el contenido inferior cambia. | mobile 390×844 |
| `MOTION_TEAM_TAB_390` (Cambio de pestaña) | `GEI_CURRENT_UX_ATLAS/04_Equipos/TeamDetail/EQ_TEAM_DETAIL_002_PERSONAS/motion/MOTION_TEAM_TAB_390.mp4` | `EQ_TEAM_DETAIL_002_PERSONAS` | click en la pestaña «Personas» | Estado: pestaña «Personas» activa; la sección del equipo cambia. | mobile 390×844 |
| `MOTION_VAS_ANSWER_390` (Highlight local + toast) | `GEI_CURRENT_UX_ATLAS/02_Calendario/EventDetail/CAL_EVENT_DETAIL_009_PLAYER_VIEW/motion/MOTION_VAS_ANSWER_390.mp4` | `CAL_EVENT_DETAIL_009_PLAYER_VIEW` | scroll 400 → click en «Tal vez» → wait 900 ms | Estado: opción «Tal vez» resaltada (bg-warning-soft) y toast «Respuesta guardada.». | mobile 390×844 |

## Metadatos por clip

| Motion | Route | Actor | Viewport | Frames | Duración medida | Duración observada | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `MOTION_CONFIRM_CANCEL_390` | `/events/match-cuba` | coach | 390×844 | 4 | 307 ms | 2200 ms | src/features/events.tsx · LifecycleActions → ConfirmDialog → Modal — el segundo overlay se monta sobre el Sheet. |
| `MOTION_MENU_OPEN_1440` | `/events/match-cuba` | coach | 1440×900 | 2 | 274 ms | 1200 ms | src/shared/ui.tsx · Menu — montaje inmediato; el foco se traslada al primer ítem con setTimeout(…, 0). |
| `MOTION_MENU_OPEN_1440_CONV` | `/announcements/a1` | subcommittee | 1440×900 | 2 | 271 ms | 1200 ms | src/shared/ui.tsx · Menu — el mismo primitive en el encabezado del comunicado; el panel se posiciona con right-0 respecto del botón. |
| `MOTION_MENU_OPEN_390` | `/events/match-cuba` | coach | 390×844 | 2 | 270 ms | 1200 ms | src/shared/ui.tsx · Menu — el panel se monta/desmonta; no hay transición CSS declarada (SOURCE-CONFIRMED). |
| `MOTION_MODAL_HISTORY_390` | `/events/match-cuba` | coach | 390×844 | 2 | 291 ms | 1200 ms | src/shared/ui.tsx · Modal + useFocusTrap — el fondo con bg-overlay + backdrop-blur-[2px] aparece junto con el panel; no hay animación de entrada. |
| `MOTION_MODAL_SCOPE_1440` | `/events/training-serie-1/edit` | coach | 1440×900 | 3 | 327 ms | 1800 ms | src/shared/patterns.tsx · ScopeDialog + Modal — el diálogo de alcance aparece tras validar y detectar que el evento pertenece a una serie. |
| `MOTION_SELECTION_EXPAND_390` | `/events/match-cuba/selection` | coach | 390×844 | 2 | 278 ms | 1200 ms | src/features/participation.tsx · SelectionPage — botón expansor con aria-expanded; el contenido se monta/desmonta sin transición. |
| `MOTION_SHEET_LIFECYCLE_390` | `/events/match-cuba` | coach | 390×844 | 3 | 291 ms | 1600 ms | src/features/events.tsx · LifecycleActions + src/shared/ui.tsx · Sheet — dos pasos: apertura del menú y montaje del panel lateral. |
| `MOTION_SHEET_PASSWORD_390` | `/more/profile` | coach | 390×844 | 3 | 410 ms | 1600 ms | src/features/account-insight.tsx · PasswordDialog + src/shared/ui.tsx · Sheet — panel lateral con focus trap. |
| `MOTION_TAB_COMMUNICATION_390` | `/communication` | coach | 390×844 | 12 | 442 ms | 1200 ms | src/shared/ui.tsx · TabBar — cambio de pestaña con transition-colors duration-micro (120 ms) en el color del texto y del borde inferior. |
| `MOTION_TEAM_TAB_390` | `/teams/sexta` | coach | 390×844 | 13 | 450 ms | 1200 ms | src/features/overview.tsx · TeamDetail — pestañas propias (no el primitive TabBar) con transition-colors; el cambio de sección se escribe en la URL (?tab=). |
| `MOTION_VAS_ANSWER_390` | `/events/match-cuba` | player | 390×844 | 15 | 2850 ms | 1800 ms | src/shared/vas.tsx · VasControl → respondAvailability → toast — la opción activa cambia de color (transition-colors duration-micro) y aparece el toast de confirmación. |

## Cobertura por categoría solicitada

| Categoría | Estado | Evidencia |
| --- | --- | --- |
| Push navigation | SIN CLIP EN CURRENT | No hay transición de ruta en el producto: no existen `view-transition`, `startViewTransition` ni `@keyframes` de navegación en `src/`. El cambio de ruta es instantáneo y el Shell resetea el scroll (`src/app/Shell.tsx:76-78`). |
| Back navigation | SIN CLIP EN CURRENT | El botón «Atrás» navega por el router sin animación; no hay clip de retroceso en el atlas previo. |
| Sheet | CUBIERTO | `MOTION_SHEET_LIFECYCLE_390`, `MOTION_SHEET_PASSWORD_390` |
| Dialog | CUBIERTO | `MOTION_MODAL_HISTORY_390`, `MOTION_CONFIRM_CANCEL_390`, `MOTION_MODAL_SCOPE_1440` |
| Inspector/panel | PARCIAL | El panel lateral tipo Sheet está cubierto por los 2 clips de Sheet. El panel contextual (aside) del Calendario no tiene clip propio: no se capturó su aparición. |
| Message send/failure | SIN CLIP EN CURRENT | No hay clip de envío de mensaje ni toast de fallo. Los toast existentes en `src/` son «Convocatoria publicada.», «Respuesta guardada.», «Resultado finalizado.», «Comunicado publicado.», «Borrador guardado.», «Sesión cerrada.», «Contacto actualizado.» y el genérico «…: listo.»; ninguno corresponde a un fallo de envío de mensaje. |
| Realtime/local highlight | PARCIAL | El highlight local está cubierto por `MOTION_VAS_ANSWER_390` (radio ¿Vas? + toast). No hay highlight en tiempo real: la app no tiene canal de realtime. |
| List insert/remove | SIN CLIP EN CURRENT | No hay clip de inserción o eliminación en lista. La única expansión de lista es `MOTION_SELECTION_EXPAND_390`, que monta contenido sin insertar ni quitar elementos. |

## Movimiento declarado pero no observado

| Token / clase | Dónde está | Observación |
| --- | --- | --- |
| `animate-spin` (Loader2) | `Button busy` — src/shared/ui.tsx:84 | Observable durante una mutación; no se capturó en clip por su duración (~380 ms). |
| `rotate-180` del chevron | `Expander` — src/shared/ui.tsx:411 | El primitive `Expander` se importa en 4 features (account-insight, events, management, participation) pero nunca se renderiza en el producto actual: la transición es inalcanzable. |
| `--duration-state: 180ms` | src/styles/theme.css | Token declarado, sin uso observado. |
| `motion-reduce:animate-none` | iconos busy | Regla global de `prefers-reduced-motion`. |

## Integridad de la copia

Los 36 ficheros (12 `.mp4` + 12 `.meta.json` + 12 `.frames.txt`) se copiaron byte a byte
desde `GEI_CURRENT_UX_ATLAS/`. Ningún clip fue regenerado, recortado ni recomprimido.
Fuentes: rutas listadas en la columna «Previous atlas path».