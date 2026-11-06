/** Definición de clips de motion del atlas GEI. */
export const motions = [
  {
    id: "MOTION_MENU_OPEN_390",
    dir: "00_Global/Overlays/GBL_OVERLAY_001_MENU_ACCIONES_EVENTO",
    path: "/events/match-cuba",
    actor: "coach",
    viewport: "390",
    action: [{ clickText: "Acciones" }],
    duration: 1200,
    source:
      "src/shared/ui.tsx · Menu — el panel se monta/desmonta; no hay transición CSS declarada (SOURCE-CONFIRMED).",
  },
  {
    id: "MOTION_MENU_OPEN_1440",
    dir: "00_Global/Overlays/GBL_OVERLAY_001_MENU_ACCIONES_EVENTO",
    path: "/events/match-cuba",
    actor: "coach",
    viewport: "1440",
    action: [{ clickText: "Acciones" }],
    duration: 1200,
    source:
      "src/shared/ui.tsx · Menu — montaje inmediato; el foco se traslada al primer ítem con setTimeout(…, 0).",
  },
  {
    id: "MOTION_MODAL_HISTORY_390",
    dir: "00_Global/Overlays/GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO",
    path: "/events/match-cuba",
    actor: "coach",
    viewport: "390",
    action: [{ clickText: "Ver todo" }],
    duration: 1200,
    source:
      "src/shared/ui.tsx · Modal + useFocusTrap — el fondo con bg-overlay + backdrop-blur-[2px] aparece junto con el panel; no hay animación de entrada.",
  },
  {
    id: "MOTION_SHEET_LIFECYCLE_390",
    dir: "02_Calendario/EventDetail/CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET",
    path: "/events/match-cuba",
    actor: "coach",
    viewport: "390",
    action: [{ clickText: "Acciones" }, { clickText: "Postergar" }],
    duration: 1600,
    source:
      "src/features/events.tsx · LifecycleActions + src/shared/ui.tsx · Sheet — dos pasos: apertura del menú y montaje del panel lateral.",
  },
  {
    id: "MOTION_CONFIRM_CANCEL_390",
    dir: "02_Calendario/EventDetail/CAL_EVENT_DETAIL_003_CANCEL_CONFIRM",
    path: "/events/match-cuba",
    actor: "coach",
    viewport: "390",
    action: [
      { clickText: "Acciones" },
      { clickText: "Cancelar evento" },
      { clickText: "Cancelar" },
    ],
    duration: 2200,
    source:
      "src/features/events.tsx · LifecycleActions → ConfirmDialog → Modal — el segundo overlay se monta sobre el Sheet.",
  },
  {
    id: "MOTION_SHEET_PASSWORD_390",
    dir: "00_Global/Overlays/GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA",
    path: "/more/profile",
    actor: "coach",
    viewport: "390",
    action: [{ scroll: 700 }, { clickText: "Cambiar contraseña" }],
    duration: 1600,
    source:
      "src/features/account-insight.tsx · PasswordDialog + src/shared/ui.tsx · Sheet — panel lateral con focus trap.",
  },
  {
    id: "MOTION_TAB_COMMUNICATION_390",
    dir: "05_Comunicacion/Announcements/COM_COMM_002_COMUNICADOS",
    path: "/communication",
    actor: "coach",
    viewport: "390",
    action: [{ clickText: "Comunicados" }],
    duration: 1200,
    source:
      "src/shared/ui.tsx · TabBar — cambio de pestaña con transition-colors duration-micro (120 ms) en el color del texto y del borde inferior.",
  },
  {
    id: "MOTION_TEAM_TAB_390",
    dir: "04_Equipos/TeamDetail/EQ_TEAM_DETAIL_002_PERSONAS",
    path: "/teams/sexta",
    actor: "coach",
    viewport: "390",
    action: [{ clickText: "Personas" }],
    duration: 1200,
    source:
      "src/features/overview.tsx · TeamDetail — pestañas propias (no el primitive TabBar) con transition-colors; el cambio de sección se escribe en la URL (?tab=).",
  },
  {
    id: "MOTION_SELECTION_EXPAND_390",
    dir: "03_Participacion/Selection/PRT_SELECTION_003_REVISIONS_OPEN",
    path: "/events/match-cuba/selection",
    actor: "coach",
    viewport: "390",
    action: [{ clickText: "Ver 1" }],
    duration: 1200,
    source:
      "src/features/participation.tsx · SelectionPage — botón expansor con aria-expanded; el contenido se monta/desmonta sin transición.",
  },
  {
    id: "MOTION_VAS_ANSWER_390",
    dir: "02_Calendario/EventDetail/CAL_EVENT_DETAIL_009_PLAYER_VIEW",
    path: "/events/match-cuba",
    actor: "player",
    viewport: "390",
    action: [{ scroll: 400 }, { clickText: "Tal vez" }, { wait: 900 }],
    duration: 1800,
    source:
      "src/shared/vas.tsx · VasControl → respondAvailability → toast — la opción activa cambia de color (transition-colors duration-micro) y aparece el toast de confirmación.",
  },
  {
    id: "MOTION_MENU_OPEN_1440_CONV",
    dir: "05_Comunicacion/Announcements/COM_ANNOUNCEMENT_003_MENU_OPEN",
    path: "/announcements/a1",
    actor: "subcommittee",
    viewport: "1440",
    action: [{ clickText: "Acciones" }],
    duration: 1200,
    source:
      "src/shared/ui.tsx · Menu — el mismo primitive en el encabezado del comunicado; el panel se posiciona con right-0 respecto del botón.",
  },
  {
    id: "MOTION_MODAL_SCOPE_1440",
    dir: "02_Calendario/EventSeries/CAL_EVENT_FORM_009_SCOPE_DIALOG",
    path: "/events/training-serie-1/edit",
    actor: "coach",
    viewport: "1440",
    action: [
      { type: { selector: "#field-time", text: "18:30" } },
      { clickText: "Guardar cambios" },
    ],
    duration: 1800,
    source:
      "src/shared/patterns.tsx · ScopeDialog + Modal — el diálogo de alcance aparece tras validar y detectar que el evento pertenece a una serie.",
  },
]
