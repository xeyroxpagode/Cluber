# ROUTE SURFACE MATRIX — GEI FULL VISUAL ATLAS V2

Formato: Route → Surfaces → States → Actors → Overlays

**/activate** → AUTH_ACTIVATE_001_DEFAULT, AUTH_ACTIVATE_002_ERROR → CÓDIGO RECHAZADO, FORMULARIO VACÍO · 1 cuenta pendiente → COACH → no

**/announcements/a1** → COM_ANNOUNCEMENT_001_DETAIL, COM_ANNOUNCEMENT_002_AUDIENCE_SHEET, COM_ANNOUNCEMENT_003_MENU_OPEN, COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM → ARCHIVADO CONFIRMADO, PUBLICADO · hoja abierta, PUBLISHED · 0 correcciones, PUBLISHED · menú abierto → COACH, SUBCOMMITTEE → no

**/announcements/a1/edit** → COM_ANNOUNCEMENT_008_EDIT_FORM → EDICIÓN DE PUBLICADO · audiencia inmutable → SUBCOMMITTEE → no

**/announcements/a3** → COM_ANNOUNCEMENT_005_DRAFT, COM_ANNOUNCEMENT_006_NOT_REACHED → DRAFT · audienceSnapshot = null, FUERA DE LA AUDIENCIA → PLAYER, SUBCOMMITTEE → no

**/audit** → MGT_AUDIT_001_LIST, MGT_AUDIT_003_DENIED_COACH → SIN ACCESO, SIN FILTROS · 3 movimientos → ADMIN, COACH → no

**/audit?from=2030-01-01&to=2030-12-31** → MGT_AUDIT_002_EMPTY_RANGE → RANGO SIN RESULTADOS → ADMIN → no

**/calendar** → GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR, GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR → AUTHENTICATED · ruta /calendar → COACH → no

**/calendar?view=agenda** → CAL_CALENDAR_001_AGENDA, XD_CALENDAR_001_TO_EVENT → AGENDA → EVENTO, SCHEDULED · sin evento seleccionado · sin filtros → COACH → no

**/calendar?view=agenda&event=match-cuba** → CAL_CALENDAR_004_AGENDA_EVENT_SELECTED → SCHEDULED · seleccionado → COACH → no

**/calendar?view=agenda&team=septima&type=TRAINING** → CAL_CALENDAR_005_FILTER_EMPTY → 0 eventos para team=septima + type=TRAINING → COACH → no

**/calendar?view=agenda&type=MATCH** → CAL_CALENDAR_006_FILTERED_MATCH → tipo=MATCH → COACH → no

**/calendar?view=month** → CAL_CALENDAR_002_MONTH, CAL_CALENDAR_007_MONTH_SCROLL_02 → vista mes · scroll 700 px, vista mes · sin selección → COACH → no

**/calendar?view=month&event=match-cuba** → CAL_CALENDAR_003_MONTH_EVENT_SELECTED → SCHEDULED · seleccionado → COACH → no

**/communication** → COM_COMM_001_CONVERSACIONES, COM_COMM_004_NO_CHAT_ADMIN, COM_COMM_005_CONVERSACIONES_PLAYER, GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION → 1 conversación · 1 mensaje sin leer, 3 conversaciones activas · 2 mensajes sin leer, AUTHENTICATED · 2 mensajes sin leer en el equipo, SIN ROL DE CHAT → ADMIN, COACH, PLAYER → no

**/communication/announcements/new** → COM_ANNOUNCEMENT_007_NEW_FORM, COM_ANNOUNCEMENT_009_NO_AUTHORITY_NEW → FORMULARIO VACÍO · audiencia por defecto = club, SIN AUTORIDAD DE PUBLICACIÓN → COACH, SUBCOMMITTEE → no

**/communication/conversations/new** → COM_NEW_CONVERSATION_001_PICK, COM_NEW_CONVERSATION_002_SEARCH, COM_NEW_CONVERSATION_003_NO_RESULTS → 0 coincidencias, 1 persona coincidente, listado completo de personas (12 filas visibles) → COACH → no

**/communication?tab=comunicados** → COM_COMM_002_COMUNICADOS, COM_COMM_003_COMUNICADOS_SUBCOMMITTEE → 2 comunicados visibles (el borrador a3 no se lista), SIN ROL DE CHAT → COACH, SUBCOMMITTEE → no

**/conversations/c-event-cuba** → COM_CONVERSATION_002_EVENT_KIND → ID DE PARÁMETRO NO RESUELTO → COACH → no

**/conversations/c-team-sexta** → COM_CONVERSATION_001_DEFAULT, COM_CONVERSATION_004_NO_AUTHORITY → ID DE PARÁMETRO NO RESUELTO → ADMIN, COACH → no

**/conversations/new?to=p2** → COM_CONVERSATION_003_NEW_TARGET → SELECTOR DE PERSONAS (el parámetro ?to= no se consume) → COACH → no

**/events/club-familias/availability** → PRT_AVAILABILITY_005_CLUB_EVENT → SCHEDULED · 0 personas en el roster → COACH → no

**/events/club-familias/match-record** → PRT_MATCH_RECORD_006_NOT_A_MATCH → TIPO DE EVENTO NO MATCH → COACH → no

**/events/match-banco** → CAL_EVENT_DETAIL_008_POSTPONED → POSTPONED → COACH → no

**/events/match-banco/availability** → PRT_AVAILABILITY_003_POSTPONED → POSTPONED → COACH → no

**/events/match-cuba** → CAL_EVENT_DETAIL_001_SCHEDULED_COACH, CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET, CAL_EVENT_DETAIL_003_CANCEL_CONFIRM, CAL_EVENT_DETAIL_004_HISTORY_MODAL, CAL_EVENT_DETAIL_009_PLAYER_VIEW, CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM, CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION, CAL_EVENT_DETAIL_012_SCROLL_02, CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED, GBL_OVERLAY_001_MENU_ACCIONES_EVENTO, GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO, GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA, XD_EVENT_001_TO_CONVERSATION → CONVERSACIÓN NO RESUELTA, Disponibilidad guardada · toast visible, SCHEDULED · NEEDS_RECONFIRMATION, SCHEDULED · actor club-wide sin rol de entrenador, SCHEDULED · confirmación abierta, SCHEDULED · hoja abierta, SCHEDULED · menú abierto, SCHEDULED · modal abierto, SCHEDULED · p2 en la convocatoria publicada, SCHEDULED · scroll 1100 px, SCHEDULED · sin convocatoria y sin respuesta propia, SCHEDULED ·ublished 8 personas · coordinationRevision 3 → CAPTAIN, COACH, PLAYER, SUBCOMMITTEE → no

**/events/match-cuba/attendance** → PRT_ATTENDANCE_002_NOT_OPENED → attendanceOpened=false · 0 registros → COACH → no

**/events/match-cuba/availability** → PRT_AVAILABILITY_001_DEFAULT, PRT_AVAILABILITY_002_PLAYER_SELF, PRT_AVAILABILITY_004_SCROLL_02 → SCHEDULED · 8 respuestas · p0 con NEEDS_RECONFIRMATION, SCHEDULED · p2 sin responder, SCHEDULED · scroll 700 px → COACH, PLAYER → no

**/events/match-cuba/edit** → CAL_EVENT_FORM_005_EDIT, CAL_EVENT_FORM_006_EDIT_DIRTY, CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM → DIRTY · cambio no material (sólo título), DIRTY · confirmación abierta, SCHEDULED · edición sin cambios (baseline = formulario actual) → COACH → no

**/events/match-cuba/match-record** → PRT_MATCH_RECORD_001_NOT_STARTED → SCHEDULED · record DRAFT → COACH → no

**/events/match-cuba/selection** → PRT_SELECTION_001_PUBLISHED, PRT_SELECTION_003_REVISIONS_OPEN, PRT_SELECTION_006_NO_AUTHORITY, PRT_SELECTION_007_OFFICIAL_VS_COACH, PRT_SELECTION_008_SCROLL_02 → PUBLISHED · 8 de 8 convocadas, PUBLISHED · historial desplegado, PUBLISHED · scroll 800 px, SIN ALCANCE (canManageSelection exige rol de entrenador), SIN ALCANCE SOBRE LA CONVOCATORIA → COACH, PLAYER, SUBCOMMITTEE → no

**/events/match-lomas** → CAL_EVENT_DETAIL_005_IN_PROGRESS → IN_PROGRESS · asistencia abierta con 5 registros · record DRAFT 1–1 → COACH → no

**/events/match-lomas/attendance** → PRT_ATTENDANCE_001_OPEN, PRT_ATTENDANCE_004_CLOSE_CONFIRM, PRT_ATTENDANCE_005_CORRECTION_DIALOG, PRT_ATTENDANCE_007_NO_AUTHORITY → CIERRE CONFIRMADO, CORRECCIÓN CONFIRMADA, SIN ALCANCE, attendanceOpened=true · sin cerrar · 5 de 8 registradas → COACH, PLAYER → no

**/events/match-lomas/match-record** → PRT_MATCH_RECORD_002_EDITABLE, PRT_MATCH_RECORD_004_FINALIZE_CONFIRM → FINALIZACIÓN CONFIRMADA, IN_PROGRESS · record DRAFT 1–1 · editing=true → COACH → no

**/events/match-septima-quinta/edit** → CAL_EVENT_FORM_010_NO_AUTHORITY → SIN ALCANCE DE EDICIÓN → PLAYER → no

**/events/match-sic** → CAL_EVENT_DETAIL_006_COMPLETED → COMPLETED · record FINAL 3–1 · attendance cerrada → COACH → no

**/events/match-sic/attendance** → PRT_ATTENDANCE_003_CLOSED, PRT_ATTENDANCE_006_CORRECTIONS_HISTORY → CERRADA · 7 de 8 registradas · 1 corrección, CERRADA · historial desplegado → COACH → no

**/events/match-sic/match-record** → PRT_MATCH_RECORD_003_FINAL, PRT_MATCH_RECORD_005_CORRECT_CONFIRM, PRT_MATCH_RECORD_007_NO_AUTHORITY, PRT_MATCH_RECORD_008_HISTORY_OPEN → COMPLETED · historial desplegado, COMPLETED · record FINAL 3–1, CORRECCIÓN CONFIRMADA, SIN ALCANCE → COACH, PLAYER → no

**/events/new** → CAL_EVENT_FORM_001_NEW, CAL_EVENT_FORM_002_NEW_MATCH_TYPE, CAL_EVENT_FORM_003_NEW_CLUB_WIDE, CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS → FORMULARIO VACÍO, VALIDATION FAILED, clubWide=true, type=MATCH → COACH → no

**/events/no-existe** → CAL_EVENT_DETAIL_013_NOT_FOUND → ID DE EVENTO DESCONOCIDO → COACH → no

**/events/training-cancelado** → CAL_EVENT_DETAIL_007_CANCELLED → CANCELLED → COACH → no

**/events/training-serie-1/edit** → CAL_EVENT_FORM_008_EDIT_SERIES, CAL_EVENT_FORM_009_SCOPE_DIALOG → SCHEDULED · diálogo de alcance abierto, SCHEDULED · serie de 4 ocurrencias → COACH → no

**/events/training-serie-1/selection** → PRT_SELECTION_002_DRAFT, PRT_SELECTION_004_DRAFT_DIRTY, PRT_SELECTION_005_PUBLISH_CONFIRM, PRT_SELECTION_009_PUBLISH_TOAST → DRAFT · dirty=true · 1 sumada, DRAFT · published = null, PUBLICACIÓN CONFIRMADA, PUBLISHED · toast visible → COACH → no

**/home** → GBL_NAV_004_SIDEBAR_BADGES_COACH, GBL_NAV_005_SIDEBAR_BADGES_ADMIN, GBL_NAV_006_SCROLL_02, GBL_SHELL_001_TOPBAR_MOBILE, GBL_SHELL_002_TOPBAR_DESKTOP, GBL_SHELL_003_BYPASS_LINK_FOCUSED, HOME_001_DEFAULT_COACH, HOME_002_DEFAULT_ADMIN, HOME_003_ATTENTION_ITEMS_ADMIN, HOME_004_ATTENTION_PLAYER_RECONFIRM, HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE, HOME_006_SCROLL_02, HOME_007_COMMS_SECTION, XD_HOME_001_TO_EVENT → ADMIN · 2 items de atención, ADMIN · bloque de atención visible, AUTHENTICATED, AUTHENTICATED · 2 mensajes sin leer · 1 aviso sin leer, AUTHENTICATED · elemento con foco, AUTHENTICATED · página desplazada 900 px, AUTHENTICATED · sin avisos sin leer, AUTHENTICATED · sin conversaciones habilitadas, CAPTAIN · NEEDS_RECONFIRMATION + NO_RESPONSE, COACH · scroll 760 px, COACH · sin pendientes propios, INICIO → EVENTO, PLAYER · 1 mensaje sin leer · 1 aviso sin leer, SUBCOMMITTEE · sin items de atención → ADMIN, CAPTAIN, COACH, PLAYER, SUBCOMMITTEE → no

**/jornadas/j1** → CAL_JORNADA_001_DETAIL, CAL_JORNADA_003_READ_ONLY, CAL_JORNADA_004_IMPACT_MODAL → GUARDADO · modal de impacto abierto, LECTURA, jornada con 1 partido · editable por el entrenador → COACH, PLAYER → no

**/jornadas/new** → CAL_JORNADA_002_NEW → FORMULARIO VACÍO → COACH → no

**/login** → AUTH_LOGIN_001_DEFAULT, AUTH_LOGIN_002_ERROR → CREDENCIALES RECHAZADAS, FORMULARIO VACÍO → COACH → no

**/management** → MGT_HOME_001_ADMIN, MGT_HOME_002_SUBCOMMITTEE, MGT_HOME_003_DENIED_COACH → ADMIN · 3 accesos, SIN ACCESO, SUBCOMMITTEE · 1 acceso → ADMIN, COACH, SUBCOMMITTEE → no

**/management/competitions** → MGT_COMPETITIONS_001_LIST, MGT_COMPETITIONS_003_CREATE_MODAL, MGT_COMPETITIONS_006_SUBCOMMITTEE, MGT_COMPETITIONS_007_DENIED_COACH → 2 COMPETENCIAS ACTIVAS · 0 archivadas, Panel abierto, sin valores, SIN ACCESO, SUBCOMMITTEE · 2 competencias visibles → ADMIN, COACH, SUBCOMMITTEE → no

**/management/competitions/ahba** → MGT_COMPETITIONS_002_DETAIL, MGT_COMPETITIONS_004_EDIT_MODAL, MGT_COMPETITIONS_005_ARCHIVE_CONFIRM, XD_COMPETITION_001_TO_JORNADA → ACTIVA · 1 jornada · 5 partidos, ARCHIVADO CONFIRMADO, COMPETENCIA → JORNADA, Panel abierto con valores → ADMIN → no

**/management/people** → MGT_PEOPLE_001_LIST, MGT_PEOPLE_007_DENIED_COACH → SIN ACCESO, SIN FILTROS · 21 personas → ADMIN, COACH → no

**/management/people/new** → MGT_PEOPLE_005_NEW_FORM, MGT_PEOPLE_006_NEW_VALIDATION → FORMULARIO VACÍO, VALIDATION FAILED → ADMIN → no

**/management/people/p16** → MGT_PERSON_008_PENDING_ACCOUNT, MGT_PERSON_011_MEMBERSHIP_START_CONFIRM → CUENTA PENDIENTE · SIN PERTENENCIA, INICIO DE PERTENENCIA CONFIRMADO → ADMIN → no

**/management/people/p16?section=cuenta** → AUTH_ACTIVATE_003_SUCCESS, MGT_PERSON_009_CODE_MODAL → CUENTA ACTIVADA, CÓDIGO EMITIDO → ADMIN → no

**/management/people/p16?section=pertenencia** → MGT_PERSON_010_NO_MEMBERSHIP → SIN PERTENENCIA VIGENTE → ADMIN → no

**/management/people/p17** → MGT_PERSON_007_INCOMPLETE → PERFIL INCOMPLETO → ADMIN → no

**/management/people/p2** → MGT_PERSON_001_IDENTIDAD, MGT_PERSON_006_IDENTITY_MODAL, MGT_PERSON_014_DENIED_SUBCOMMITTEE → CUENTA ACTIVA · 1 equipo · 1 rol, Panel abierto, sin cambios, SIN ACCESO → ADMIN, SUBCOMMITTEE → no

**/management/people/p2?section=cuenta** → MGT_PERSON_005_CUENTA, MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM → CUENTA ACTIVA, DESHABILITACIÓN CONFIRMADA → ADMIN → no

**/management/people/p2?section=equipos** → MGT_PERSON_003_EQUIPOS → 1 EQUIPO VIGENTE → ADMIN → no

**/management/people/p2?section=pertenencia** → MGT_PERSON_002_PERTENENCIA, MGT_PERSON_012_MEMBERSHIP_END_CONFIRM → FIN DE PERTENENCIA CONFIRMADO, PERTENENCIA VIGENTE → ADMIN → no

**/management/people/p2?section=roles** → MGT_PERSON_004_ROLES → 1 ROL VIGENTE → ADMIN → no

**/management/people?account=PENDING** → MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING → 1 cuenta pendiente → ADMIN → no

**/management/people?profileStatus=incomplete** → MGT_PEOPLE_002_FILTER_INCOMPLETE → 1 persona incompleta → ADMIN → no

**/management/people?q=zzzzz** → MGT_PEOPLE_003_FILTER_EMPTY → 0 coincidencias → ADMIN → no

**/management/structure** → MGT_STRUCTURE_007_DENIED_COACH → SIN ACCESO → COACH → no

**/management/structure?tab=DIVISION** → MGT_STRUCTURE_002_DIVISIONS → 4 DIVISIONES ACTIVAS → ADMIN → no

**/management/structure?tab=LINE** → MGT_STRUCTURE_003_LINES → 3 LÍNEAS ACTIVAS → ADMIN → no

**/management/structure?tab=SEASON** → MGT_STRUCTURE_001_SEASONS → 2 TEMPORADAS ACTIVAS → ADMIN → no

**/management/structure?tab=VENUE** → MGT_STRUCTURE_004_VENUES → 0 SEDES EN LA ESTRUCTURA → ADMIN → no

**/management/teams/sexta** → MGT_TEAM_001_ADMIN_DETAIL → EQUIPO ACTIVO · 8 personas → ADMIN → no

**/management/teams/zzz** → MGT_TEAM_002_NOT_FOUND → ID DE EQUIPO DESCONOCIDO → ADMIN → no

**/more** → MORE_001_COACH, MORE_002_ADMIN, MORE_003_SUBCOMMITTEE, MORE_004_PLAYER, MORE_005_JORNADAS → ADMIN · 6 accesos visibles, COACH · 1 jornada, COACH · 4 accesos visibles, PLAYER · 2 accesos visibles, SUBCOMMITTEE · 4 accesos visibles → ADMIN, COACH, PLAYER, SUBCOMMITTEE → no

**/more/profile** → GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA, MOR_PROFILE_001_COACH, MOR_PROFILE_002_ADMIN, MOR_PROFILE_003_PLAYER, MOR_PROFILE_004_CONTACT_SHEET, MOR_PROFILE_005_SCROLL_02 → COACH · scroll 900 px, CUENTA ACTIVA · 1 sesión, CUENTA ACTIVA · 2 sesiones, Panel abierto, sin cambios, Panel abierto, sin valores escritos → ADMIN, COACH, PLAYER → no

**/no-access** → AUTH_NOACCESS_001_DEFAULT → CUENTA ACTIVA SIN ROL → COACH → no

**/notifications** → GBL_NOTIF_001_LIST_COACH_ALL_READ, GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD, GBL_NOTIF_003_ALL_MARKED_READ, GBL_NOTIF_004_EMPTY_STATE, XD_NOTIF_001_TO_EVENT → 0 avisos recibidos, 0 avisos sin leer (los 3 leídos), 0 avisos sin leer · 2 leídos, 1 aviso sin leer · 2 leídos, AVISO NO LEÍDO → COMUNICADO → ADMIN, COACH, PLAYER → no

**/people/no-existe** → EQ_PERSON_004_NOT_FOUND → ID DE PERSONA DESCONOCIDO → COACH → no

**/people/p15** → EQ_PERSON_003_DETAIL_STRANGER → FUERA DEL ALCANCE DE CONTACTO → PLAYER → no

**/people/p2** → EQ_PERSON_001_DETAIL_COACH, EQ_PERSON_002_DETAIL_ADMIN → ACCOUNT ACTIVE · PII completa, ACCOUNT ACTIVE · PLAYER de Sexta A → ADMIN, COACH → no

**/reports** → MOR_REPORTS_001_LIST, MOR_REPORTS_005_NO_ACCESS_ADMIN → SIN ALCANCE DE INFORME, Sin filtros · 6 eventos visibles → ADMIN, COACH → no

**/reports/attendance** → MOR_REPORTS_002_ASISTENCIA, XD_REPORT_001_TO_ATTENDANCE → 2 eventos con planilla, INFORME → PLANILLA → COACH → no

**/reports/attendance?period=month** → MOR_REPORTS_006_ASISTENCIA_FILTERED → period=month · 1 evento con planilla → COACH → no

**/reports/performance** → MOR_REPORTS_003_RENDIMIENTO → 1 evento finalizado → COACH → no

**/reports?team=quinta&period=month** → MOR_REPORTS_004_FILTERED_EMPTY → 0 eventos para los filtros aplicados → COACH → no

**/ruta-inexistente** → GBL_STATE_001_NOT_FOUND → RUTA NO RECONOCIDA → COACH → no

**/search** → GBL_SEARCH_001_EMPTY, GBL_SEARCH_002_RESULTS → SIN TÉRMINO DE BÚSQUEDA, TÉRMINO «Lucía» → COACH → no

**/search?q=CUBA** → XD_SEARCH_003_TO_EVENT → RESULTADO DE BÚSQUEDA → DETALLE DE EVENTO → COACH → no

**/search?q=Lucía** → XD_SEARCH_001_TO_PERSON → RESULTADO DE BÚSQUEDA → FICHA DE PERSONA → COACH → no

**/search?q=Sexta** → XD_SEARCH_002_TO_TEAM → RESULTADO DE BÚSQUEDA → DETALLE DE EQUIPO → COACH → no

**/search?q=a** → GBL_SEARCH_004_MULTI_RESULT → TÉRMINO «a» · coincidencias en los 4 grupos → COACH → no

**/search?q=zzzqqq** → GBL_SEARCH_003_NO_RESULTS → TÉRMINO «zzzqqq» · 0 resultados → COACH → no

**/teams** → EQ_TEAMS_001_LIST_COACH, EQ_TEAMS_002_LIST_PLAYER, EQ_TEAMS_003_LIST_ADMIN, EQ_TEAMS_004_LIST_CAPTAIN → ADMIN · alcance club, CAPTAIN · alcance en sexta, COACH · alcance en sexta y septima, PLAYER · alcance en sexta → ADMIN, CAPTAIN, COACH, PLAYER → no

**/teams/quinta** → EQ_TEAM_DETAIL_004_OUT_OF_SCOPE → FUERA DE ALCANCE → PLAYER → no

**/teams/septima** → EQ_TEAM_DETAIL_005_QUERY_ONLY, EQ_TEAM_DETAIL_007_SEPTIMA → 1 evento en el equipo · 0 resultados, VISIBLE PERO NO GESTIONADO → COACH, PLAYER → no

**/teams/sexta** → EQ_TEAM_DETAIL_001_EVENTOS, EQ_TEAM_DETAIL_006_SCROLL_02, XD_TEAM_001_TO_EVENT → EQUIPO → EVENTO, SCHEDULED · 6 eventos próximos · 1 resultado final, SCHEDULED · scroll 900 px → COACH → no

**/teams/sexta?tab=personas** → EQ_TEAM_DETAIL_002_PERSONAS → 8 personas con roles vigentes → COACH → no

**/teams/sexta?tab=resultados** → EQ_TEAM_DETAIL_003_RESULTADOS → 1 resultado finalizado → COACH → no

**/teams/zzz** → EQ_TEAM_DETAIL_008_NOT_FOUND → ID DE EQUIPO DESCONOCIDO → PLAYER → no
