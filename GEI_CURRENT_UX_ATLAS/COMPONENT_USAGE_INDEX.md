# COMPONENT USAGE INDEX — GEI CURRENT UX ATLAS

Para cada componente documentado: en qué surfaces aparece.
Sirve para conocer el radio de impacto de un primitive antes de tocarlo.

## SkipLink

- **Clave:** `src/app/Shell.tsx :: Shell > a[href=#contenido]`
- **Tipo:** a (sr-only → visible al enfocar)
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > a[href=#contenido]`
- **Surfaces:** 1

  - `GBL_SHELL_003_BYPASS_LINK_FOCUSED` → C01 (Enlace de salto al contenido, enfocado)

## TopBar (header)

- **Clave:** `src/app/Shell.tsx :: Shell > header`
- **Tipo:** header sticky
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > header`
- **Surfaces:** 2

  - `GBL_SHELL_001_TOPBAR_MOBILE` → C01 (Chrome de aplicación — barra superior en 390)
  - `GBL_SHELL_002_TOPBAR_DESKTOP` → C01 (Chrome de aplicación — barra superior en 1440)

## BrandMark (GEI)

- **Clave:** `src/app/Shell.tsx :: Shell > Link (aria-label «GEI Hockey · Inicio»)`
- **Tipo:** Link con span
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > Link (aria-label «GEI Hockey · Inicio»)`
- **Surfaces:** 1

  - `GBL_SHELL_001_TOPBAR_MOBILE` → C02 (Chrome de aplicación — barra superior en 390)

## ProfileAvatarLink

- **Clave:** `src/app/Shell.tsx :: Shell > Link to=/more/profile`
- **Tipo:** Link con Avatar
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > Link to=/more/profile`
- **Surfaces:** 2

  - `GBL_SHELL_001_TOPBAR_MOBILE` → C06 (Chrome de aplicación — barra superior en 390)
  - `GBL_SHELL_002_TOPBAR_DESKTOP` → C05 (Chrome de aplicación — barra superior en 1440)

## NotificationsBell

- **Clave:** `src/app/Shell.tsx :: Shell > Link to=/notifications`
- **Tipo:** Link (a) 44×44 + punto de no-leído
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > Link to=/notifications`
- **Surfaces:** 2

  - `GBL_SHELL_001_TOPBAR_MOBILE` → C05 (Chrome de aplicación — barra superior en 390)
  - `GBL_SHELL_002_TOPBAR_DESKTOP` → C04 (Chrome de aplicación — barra superior en 1440)

## SearchIconButton

- **Clave:** `src/app/Shell.tsx :: Shell > Link to=/search (sm:hidden)`
- **Tipo:** Link (a) 44×44
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > Link to=/search (sm:hidden)`
- **Surfaces:** 1

  - `GBL_SHELL_001_TOPBAR_MOBILE` → C04 (Chrome de aplicación — barra superior en 390)

## SearchTextLink

- **Clave:** `src/app/Shell.tsx :: Shell > Link to=/search (sm:inline-flex)`
- **Tipo:** Link con teclado ⌘K
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > Link to=/search (sm:inline-flex)`
- **Surfaces:** 1

  - `GBL_SHELL_002_TOPBAR_DESKTOP` → C03 (Chrome de aplicación — barra superior en 1440)

## SidebarNav (sticky)

- **Clave:** `src/app/Shell.tsx :: Shell > nav`
- **Tipo:** nav sticky
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > nav`
- **Surfaces:** 1

  - `GBL_NAV_006_SCROLL_02` → C01 (Barra lateral con scroll propio de navegación (1440))

## SidebarNav

- **Clave:** `src/app/Shell.tsx :: Shell > nav (aria-label «Destinos», lg:flex)`
- **Tipo:** nav sticky
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > nav (aria-label «Destinos», lg:flex)`
- **Surfaces:** 1

  - `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` → C01 (Barra lateral de destinos con «Calendario» activo (1440))

## BottomNav

- **Clave:** `src/app/Shell.tsx :: Shell > nav (aria-label «Destinos», lg:hidden)`
- **Tipo:** nav fixed
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > nav (aria-label «Destinos», lg:hidden)`
- **Surfaces:** 1

  - `GBL_SHELL_001_TOPBAR_MOBILE` → C07 (Chrome de aplicación — barra superior en 390)

## UnreadBadge (Comunicación)

- **Clave:** `src/app/Shell.tsx :: Shell > nav (badge unreadMessages)`
- **Tipo:** span con dot + cifra
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > nav (badge unreadMessages)`
- **Surfaces:** 1

  - `GBL_NAV_004_SIDEBAR_BADGES_COACH` → C02 (Barra lateral con contadores de no-leídos (COACH, 1440))

## SidebarNav

- **Clave:** `src/app/Shell.tsx :: Shell > nav (lg:flex)`
- **Tipo:** nav sticky
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > nav (lg:flex)`
- **Surfaces:** 2

  - `GBL_NAV_004_SIDEBAR_BADGES_COACH` → C01 (Barra lateral con contadores de no-leídos (COACH, 1440))
  - `GBL_SHELL_002_TOPBAR_DESKTOP` → C06 (Chrome de aplicación — barra superior en 1440)

## BottomNav

- **Clave:** `src/app/Shell.tsx :: Shell > nav (lg:hidden)`
- **Tipo:** nav fixed
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > nav (lg:hidden)`
- **Surfaces:** 3

  - `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` → C01 (Barra inferior de destinos con «Calendario» activo (390))
  - `GBL_NAV_003_BOTTOMNAV_ACTIVE_COMMUNICATION` → C01 (Barra inferior de destinos con «Comunicación» activo y sin contador (390))
  - `HOME_006_SCROLL_02` → C02 (Inicio — segunda franja de scroll (COACH))

## NavItem Activo (Calendario)

- **Clave:** `src/app/Shell.tsx :: Shell > NavLink to=/calendar`
- **Tipo:** a (NavLink)
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > NavLink to=/calendar`
- **Surfaces:** 1

  - `GBL_NAV_001_SIDEBAR_ACTIVE_CALENDAR` → C02 (Barra lateral de destinos con «Calendario» activo (1440))

## NavItem Activo (Calendario)

- **Clave:** `src/app/Shell.tsx :: Shell > NavLink to=/calendar (bottom)`
- **Tipo:** a (NavLink)
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > NavLink to=/calendar (bottom)`
- **Surfaces:** 1

  - `GBL_NAV_002_BOTTOMNAV_ACTIVE_CALENDAR` → C02 (Barra inferior de destinos con «Calendario» activo (390))

## SidebarNav (visibleNav filtrado)

- **Clave:** `src/app/Shell.tsx :: Shell > visibleNav = NAV.filter(authority.canOpen)`
- **Tipo:** nav sticky
- **Source file:** `src/app/Shell.tsx`
- **Source symbol:** `Shell > visibleNav = NAV.filter(authority.canOpen)`
- **Surfaces:** 1

  - `GBL_NAV_005_SIDEBAR_BADGES_ADMIN` → C01 (Barra lateral con contadores de no-leídos (ADMIN, 1440))

## BrandBlock

- **Clave:** `src/features/account-insight.tsx :: LoginPage > div.flex.items-center.gap-3`
- **Tipo:** div flex con cuadrado + textos
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `LoginPage > div.flex.items-center.gap-3`
- **Surfaces:** 1

  - `AUTH_LOGIN_001_DEFAULT` → C01 (Acceso — formulario de login)

## JornadaRow (jornada pendiente)

- **Clave:** `src/features/account-insight.tsx :: MorePage > DetailSection «Jornadas» > RowLink`
- **Tipo:** RowLink
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `MorePage > DetailSection «Jornadas» > RowLink`
- **Surfaces:** 1

  - `MORE_001_COACH` → C02 (Más — entrada del entrenador)

## MoreLinkRow (Informes)

- **Clave:** `src/features/account-insight.tsx :: MorePage > RowLink`
- **Tipo:** RowLink
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `MorePage > RowLink`
- **Surfaces:** 1

  - `MORE_001_COACH` → C01 (Más — entrada del entrenador)

## MoreLinkRow (Historial de cambios)

- **Clave:** `src/features/account-insight.tsx :: MorePage > RowLink (audit)`
- **Tipo:** RowLink
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `MorePage > RowLink (audit)`
- **Surfaces:** 1

  - `MORE_002_ADMIN` → C01 (Más — entrada de la administración)

## MoreLinkRow (Competencias)

- **Clave:** `src/features/account-insight.tsx :: MorePage > RowLink (competitions)`
- **Tipo:** RowLink
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `MorePage > RowLink (competitions)`
- **Surfaces:** 1

  - `MORE_003_SUBCOMMITTEE` → C01 (Más — entrada de la Subcomisión)

## JornadaRow

- **Clave:** `src/features/account-insight.tsx :: MorePage > RowLink (jornadas)`
- **Tipo:** RowLink
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `MorePage > RowLink (jornadas)`
- **Surfaces:** 1

  - `MORE_005_JORNADAS` → C01 (Más — sección Jornadas)

## MoreLinkRow (Mi perfil)

- **Clave:** `src/features/account-insight.tsx :: MorePage > RowLink (profile)`
- **Tipo:** RowLink
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `MorePage > RowLink (profile)`
- **Surfaces:** 1

  - `MORE_004_PLAYER` → C01 (Más — entrada de la jugadora)

## SessionCard (actual)

- **Clave:** `src/features/account-insight.tsx :: ProfilePage > ul > li (currentSession)`
- **Tipo:** li con borde selected-line
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `ProfilePage > ul > li (currentSession)`
- **Surfaces:** 1

  - `MOR_PROFILE_001_COACH` → C03 (Mi perfil — entrenador)

## AttendanceReportRow

- **Clave:** `src/features/account-insight.tsx :: ReportDetail > RowStatic (attendance)`
- **Tipo:** RowStatic con Link
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `ReportDetail > RowStatic (attendance)`
- **Surfaces:** 1

  - `MOR_REPORTS_002_ASISTENCIA` → C01 (Informes — asistencia por evento)

## ResultsTable

- **Clave:** `src/features/account-insight.tsx :: ReportDetail > table (performance)`
- **Tipo:** table con contenedor scrollable
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `ReportDetail > table (performance)`
- **Surfaces:** 1

  - `MOR_REPORTS_003_RENDIMIENTO` → C01 (Informes — rendimiento)

## ReportRow (Asistencia)

- **Clave:** `src/features/account-insight.tsx :: ReportsPage > RowLink`
- **Tipo:** RowLink
- **Source file:** `src/features/account-insight.tsx`
- **Source symbol:** `ReportsPage > RowLink`
- **Surfaces:** 1

  - `MOR_REPORTS_001_LIST` → C01 (Informes — entrada)

## AnnouncementBody

- **Clave:** `src/features/communication.tsx :: AnnouncementDetail > article.map(paragraph)`
- **Tipo:** article con p por párrafo
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `AnnouncementDetail > article.map(paragraph)`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_001_DETAIL` → C03 (Comunicado — detalle)

## AudienceSnapshotBlock

- **Clave:** `src/features/communication.tsx :: AnnouncementDetail > below (snapshot)`
- **Tipo:** div con Tag, texto y botón
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `AnnouncementDetail > below (snapshot)`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_001_DETAIL` → C02 (Comunicado — detalle)

## AudienceSnapshotNote

- **Clave:** `src/features/communication.tsx :: AnnouncementForm > p (nota de audiencia)`
- **Tipo:** p gei-meta
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `AnnouncementForm > p (nota de audiencia)`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_007_NEW_FORM` → C03 (Comunicado — alta)

## UnreadMark («2 sin leer»)

- **Clave:** `src/features/communication.tsx :: CommunicationHome > meta > span`
- **Tipo:** span con dot + texto
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `CommunicationHome > meta > span`
- **Surfaces:** 1

  - `COM_COMM_001_CONVERSACIONES` → C03 (Comunicación — pestaña Conversaciones)

## ConversationRow (equipo, jugadora)

- **Clave:** `src/features/communication.tsx :: CommunicationHome > RowLink`
- **Tipo:** RowLink con icono de equipo
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `CommunicationHome > RowLink`
- **Surfaces:** 1

  - `COM_COMM_005_CONVERSACIONES_PLAYER` → C01 (Comunicación — pestaña Conversaciones (PLAYER))

## AnnouncementRow

- **Clave:** `src/features/communication.tsx :: CommunicationHome > RowLink (announcements)`
- **Tipo:** RowLink con Megaphone + Tag + StateBadge
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `CommunicationHome > RowLink (announcements)`
- **Surfaces:** 1

  - `COM_COMM_002_COMUNICADOS` → C01 (Comunicación — pestaña Comunicados (COACH))

## ConversationRow (equipo)

- **Clave:** `src/features/communication.tsx :: CommunicationHome > RowLink (conversations)`
- **Tipo:** RowLink con Avatar
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `CommunicationHome > RowLink (conversations)`
- **Surfaces:** 1

  - `COM_COMM_001_CONVERSACIONES` → C02 (Comunicación — pestaña Conversaciones)

## NoResultsLine

- **Clave:** `src/features/communication.tsx :: NewConversation > li > p`
- **Tipo:** p gei-meta dentro de un li
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `NewConversation > li > p`
- **Surfaces:** 1

  - `COM_NEW_CONVERSATION_003_NO_RESULTS` → C01 (Nuevo mensaje — sin resultados)

## PersonRow (p2)

- **Clave:** `src/features/communication.tsx :: NewConversation > RowLink`
- **Tipo:** RowLink con Avatar
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `NewConversation > RowLink`
- **Surfaces:** 2

  - `COM_CONVERSATION_003_NEW_TARGET` → C01 (Conversación — ruta /conversations/new (selección de destinatario))
  - `COM_NEW_CONVERSATION_001_PICK` → C02 (Nuevo mensaje — selección de persona)

## NoticeTypeLabel

- **Clave:** `src/features/communication.tsx :: NOTICE_TYPE_TEXT`
- **Tipo:** span uppercase
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `NOTICE_TYPE_TEXT`
- **Surfaces:** 1

  - `GBL_NOTIF_001_LIST_COACH_ALL_READ` → C02 (Avisos — lista sin pendientes (COACH))

## UnreadIndicator

- **Clave:** `src/features/communication.tsx :: Notifications > meta > span[size-2 bg-unread]`
- **Tipo:** span con dot + texto
- **Source file:** `src/features/communication.tsx`
- **Source symbol:** `Notifications > meta > span[size-2 bg-unread]`
- **Surfaces:** 1

  - `GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD` → C02 (Avisos — lista con un aviso sin leer (PLAYER))

## RestoreEventButton

- **Clave:** `src/features/events.tsx :: EventDetail (isTerminal) > Button «Restaurar el evento»`
- **Tipo:** Button secondary
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail (isTerminal) > Button «Restaurar el evento»`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_007_CANCELLED` → C02 (Detalle de evento — Cancelled (composición terminal))

## FinalScore

- **Clave:** `src/features/events.tsx :: EventDetail (state===COMPLETED && record.state==='FINAL')`
- **Tipo:** p gei-l5 tabular-nums
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail (state===COMPLETED && record.state==='FINAL')`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_006_COMPLETED` → C02 (Detalle de evento — Completed (composición terminal))

## Aside «Resumen»

- **Clave:** `src/features/events.tsx :: EventDetail > aside (Resumen + Qué podés hacer acá)`
- **Tipo:** aside content-start con dos Surface
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > aside (Resumen + Qué podés hacer acá)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C08 (Detalle de evento — Scheduled, vista COACH)

## Mensajes de este evento (DetailSection)

- **Clave:** `src/features/events.tsx :: EventDetail > DetailSection «Mensajes de este evento»`
- **Tipo:** section grid con 2 mensajes y link
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > DetailSection «Mensajes de este evento»`
- **Surfaces:** 2

  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C06 (Detalle de evento — Scheduled, vista COACH)
  - `CAL_EVENT_DETAIL_012_SCROLL_02` → C02 (Detalle de evento — franja de logística e historial)

## AnnouncementLinkRow

- **Clave:** `src/features/events.tsx :: EventDetail > RowLink «Comunicar un cambio»`
- **Tipo:** RowLink con Megaphone
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > RowLink «Comunicar un cambio»`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION` → C02 (Detalle de evento — vista SUBCOMMITTEE)

## OfficialCoordinationSurface

- **Clave:** `src/features/events.tsx :: EventDetail > Surface «Coordinación oficial»`
- **Tipo:** Surface grid gap-3
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > Surface «Coordinación oficial»`
- **Surfaces:** 2

  - `CAL_EVENT_DETAIL_011_OFFICIAL_COORDINATION` → C01 (Detalle de evento — vista SUBCOMMITTEE)
  - `CAL_EVENT_DETAIL_014_PLAYER_NOT_INVITED` → C01 (Detalle de evento — actor club-wide sin convocatoria)

## VasControl (variante sólo consulta)

- **Clave:** `src/features/events.tsx :: EventDetail > Surface (!canRespondHere && state==='SCHEDULED')`
- **Tipo:** Surface con texto explicativo
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > Surface (!canRespondHere && state==='SCHEDULED')`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C02 (Detalle de evento — Scheduled, vista COACH)

## Quién dijo qué (Surface)

- **Clave:** `src/features/events.tsx :: EventDetail > Surface (BUCKETS.map)`
- **Tipo:** Surface grid gap-3 con filas contables
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > Surface (BUCKETS.map)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C04 (Detalle de evento — Scheduled, vista COACH)

## ReferenceSurface («Cómo estaba-coordinate»)

- **Clave:** `src/features/events.tsx :: EventDetail > Surface (isTerminal)`
- **Tipo:** Surface grid gap-2 con RowStatic
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > Surface (isTerminal)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_006_COMPLETED` → C03 (Detalle de evento — Completed (composición terminal))

## Operación pendiente (estado real)

- **Clave:** `src/features/events.tsx :: EventDetail > Surface canOperate`
- **Tipo:** Surface con SectionHeader
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > Surface canOperate`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_005_IN_PROGRESS` → C02 (Detalle de evento — In progress)

## Operación pendiente (Surface)

- **Clave:** `src/features/events.tsx :: EventDetail > Surface canOperate (SectionHeader + RowLink)`
- **Tipo:** Surface grid gap-3
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventDetail > Surface canOperate (SectionHeader + RowLink)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C03 (Detalle de evento — Scheduled, vista COACH)

## StickyActionBar del formulario

- **Clave:** `src/features/events.tsx :: EventForm > div.sticky (barra de acción)`
- **Tipo:** div sticky
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventForm > div.sticky (barra de acción)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_001_NEW` → C04 (Alta de evento — formulario vacío)

## TargetTeamsError

- **Clave:** `src/features/events.tsx :: EventForm > fieldset > p (errors.targetTeams)`
- **Tipo:** p text-meta text-danger
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventForm > fieldset > p (errors.targetTeams)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS` → C02 (Alta de evento — errores de validación)

## TargetTeamsFieldset

- **Clave:** `src/features/events.tsx :: EventForm > fieldset#field-targetTeams`
- **Tipo:** fieldset con checkboxes
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventForm > fieldset#field-targetTeams`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_005_EDIT` → C04 (Edición de evento — formulario cargado)

## MaterialChangeNote

- **Clave:** `src/features/events.tsx :: EventForm > p (isNonMaterialOnly ? … : …)`
- **Tipo:** p gei-meta
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventForm > p (isNonMaterialOnly ? … : …)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_006_EDIT_DIRTY` → C02 (Edición de evento — con cambios sin guardar)

## SeriesNote

- **Clave:** `src/features/events.tsx :: EventForm > p (seriesCandidates)`
- **Tipo:** p gei-meta
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventForm > p (seriesCandidates)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_008_EDIT_SERIES` → C01 (Edición de evento — evento de serie)

## DirtyNotice

- **Clave:** `src/features/events.tsx :: EventForm > PageContextHeader below (dirty)`
- **Tipo:** span + Button quiet
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `EventForm > PageContextHeader below (dirty)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_006_EDIT_DIRTY` → C01 (Edición de evento — con cambios sin guardar)

## CandidateMatchesList

- **Clave:** `src/features/events.tsx :: JornadaCreate > candidates.map`
- **Tipo:** ul con labels y checkboxes
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `JornadaCreate > candidates.map`
- **Surfaces:** 1

  - `CAL_JORNADA_002_NEW` → C02 (Jornada — alta)

## BulkOrganizationSurface

- **Clave:** `src/features/events.tsx :: JornadaDetail > Surface (canManage)`
- **Tipo:** Surface grid gap-4
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `JornadaDetail > Surface (canManage)`
- **Surfaces:** 1

  - `CAL_JORNADA_001_DETAIL` → C02 (Jornada — detalle)

## LifecycleOption destructiva («Cancelar»)

- **Clave:** `src/features/events.tsx :: LifecycleActions > button (option.danger)`
- **Tipo:** button grid con fondo danger-soft
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `LifecycleActions > button (option.danger)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET` → C03 (Detalle de evento — hoja de ciclo de vida)

## LifecycleOption («Postergar»)

- **Clave:** `src/features/events.tsx :: LifecycleActions > button (option)`
- **Tipo:** button grid con título y consecuencia
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `LifecycleActions > button (option)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET` → C02 (Detalle de evento — hoja de ciclo de vida)

## TerminalNotice (danger)

- **Clave:** `src/features/events.tsx :: TerminalNotice (CANCELLED)`
- **Tipo:** Banner tone=danger
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `TerminalNotice (CANCELLED)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_007_CANCELLED` → C01 (Detalle de evento — Cancelled (composición terminal))

## TerminalNotice

- **Clave:** `src/features/events.tsx :: TerminalNotice (COMPLETED)`
- **Tipo:** Banner tone=success
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `TerminalNotice (COMPLETED)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_006_COMPLETED` → C01 (Detalle de evento — Completed (composición terminal))

## TerminalNotice (warning)

- **Clave:** `src/features/events.tsx :: TerminalNotice (rama por defecto)`
- **Tipo:** Banner tone=warning
- **Source file:** `src/features/events.tsx`
- **Source symbol:** `TerminalNotice (rama por defecto)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_008_POSTPONED` → C01 (Detalle de evento — Postponed (composición terminal))

## CompetitionMatchesList

- **Clave:** `src/features/management.tsx :: CompetitionsPage > DetailSection «Partidos»`
- **Tipo:** DetailSection con RowLink
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `CompetitionsPage > DetailSection «Partidos»`
- **Surfaces:** 1

  - `MGT_COMPETITIONS_002_DETAIL` → C01 (Competencias — detalle)

## CompetitionRow (Torneo AHBA)

- **Clave:** `src/features/management.tsx :: CompetitionsPage > RowLink`
- **Tipo:** RowLink
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `CompetitionsPage > RowLink`
- **Surfaces:** 2

  - `MGT_COMPETITIONS_001_LIST` → C01 (Competencias — listado)
  - `MGT_COMPETITIONS_006_SUBCOMMITTEE` → C01 (Competencias — listado (SUBCOMMITTEE))

## NextStepsSurface («Qué sigue»)

- **Clave:** `src/features/management.tsx :: CreatePerson > Surface («Qué sigue»)`
- **Tipo:** Surface grid gap-4
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `CreatePerson > Surface («Qué sigue»)`
- **Surfaces:** 1

  - `MGT_PEOPLE_005_NEW_FORM` → C02 (Personas — alta)

## AdminLinkRow (Personas)

- **Clave:** `src/features/management.tsx :: ManagementHome > RowLink`
- **Tipo:** RowLink
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `ManagementHome > RowLink`
- **Surfaces:** 1

  - `MGT_HOME_001_ADMIN` → C02 (Administración — hub (ADMIN))

## AdminLinkRow (Competencias)

- **Clave:** `src/features/management.tsx :: ManagementHome > RowLink (competitions)`
- **Tipo:** RowLink
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `ManagementHome > RowLink (competitions)`
- **Surfaces:** 1

  - `MGT_HOME_002_SUBCOMMITTEE` → C01 (Administración — hub (SUBCOMMITTEE))

## PersonRow (Lucía Fernández)

- **Clave:** `src/features/management.tsx :: PeopleManagement > RowLink`
- **Tipo:** RowLink con Avatar
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `PeopleManagement > RowLink`
- **Surfaces:** 1

  - `MGT_PEOPLE_001_LIST` → C03 (Personas — listado (ADMIN))

## ManagedDataSurface

- **Clave:** `src/features/management.tsx :: PersonAdminDetail > Surface (Datos que administra el club)`
- **Tipo:** Surface grid gap-4
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `PersonAdminDetail > Surface (Datos que administra el club)`
- **Surfaces:** 1

  - `MGT_PERSON_001_IDENTIDAD` → C02 (Ficha de persona — Identidad)

## StructureRow (Primera)

- **Clave:** `src/features/management.tsx :: StructurePage > RowStatic (active)`
- **Tipo:** RowStatic con botón «Archivar»
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `StructurePage > RowStatic (active)`
- **Surfaces:** 3

  - `MGT_STRUCTURE_001_SEASONS` → C02 (Estructura — Temporadas)
  - `MGT_STRUCTURE_002_DIVISIONS` → C01 (Estructura — Divisiones)
  - `MGT_STRUCTURE_003_LINES` → C01 (Estructura — Líneas)

## TeamIdentityRows

- **Clave:** `src/features/management.tsx :: TeamAdmin > DetailSection «Identidad»`
- **Tipo:** DetailSection con RowStatic
- **Source file:** `src/features/management.tsx`
- **Source symbol:** `TeamAdmin > DetailSection «Identidad»`
- **Surfaces:** 1

  - `MGT_TEAM_001_ADMIN_DETAIL` → C01 (Equipo — ficha de administración)

## AttentionSection (estado vacío)

- **Clave:** `src/features/overview.tsx :: AttentionSection (buildAttention)`
- **Tipo:** section grid + bloque success
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `AttentionSection (buildAttention)`
- **Surfaces:** 1

  - `HOME_001_DEFAULT_COACH` → C02 (Inicio — entrenador (COACH))

## AttentionItem «reconfirm»

- **Clave:** `src/features/overview.tsx :: AttentionSection (item.id === 'reconfirm')`
- **Tipo:** li
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `AttentionSection (item.id === 'reconfirm')`
- **Surfaces:** 1

  - `HOME_004_ATTENTION_PLAYER_RECONFIRM` → C01 (Inicio — atención de jugadora (CAPTAIN) con reconfirmación)

## AttentionSection (vacía)

- **Clave:** `src/features/overview.tsx :: AttentionSection (items.length === 0)`
- **Tipo:** section
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `AttentionSection (items.length === 0)`
- **Surfaces:** 1

  - `HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE` → C01 (Inicio — subcomisión, sin pendientes propios)

## AttentionSection con ítems

- **Clave:** `src/features/overview.tsx :: AttentionSection (items.map)`
- **Tipo:** section grid + ul
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `AttentionSection (items.map)`
- **Surfaces:** 1

  - `HOME_002_DEFAULT_ADMIN` → C02 (Inicio — administración (ADMIN))

## AttentionItem (urgencia now)

- **Clave:** `src/features/overview.tsx :: AttentionSection > li (item.urgency === 'now')`
- **Tipo:** li con borde y fondo
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `AttentionSection > li (item.urgency === 'now')`
- **Surfaces:** 1

  - `HOME_003_ATTENTION_ITEMS_ADMIN` → C01 (Inicio — bloque «Necesita tu atención» con ítems (ADMIN))

## AttentionActionButton («Responder»)

- **Clave:** `src/features/overview.tsx :: AttentionSection > Link (index !== 0 → borde)`
- **Tipo:** Link secundario
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `AttentionSection > Link (index !== 0 → borde)`
- **Surfaces:** 1

  - `HOME_004_ATTENTION_PLAYER_RECONFIRM` → C02 (Inicio — atención de jugadora (CAPTAIN) con reconfirmación)

## AttentionActionButton (primario)

- **Clave:** `src/features/overview.tsx :: AttentionSection > Link (index === 0 ? bg-interactive : border)`
- **Tipo:** Link con flecha
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `AttentionSection > Link (index === 0 ? bg-interactive : border)`
- **Surfaces:** 1

  - `HOME_003_ATTENTION_ITEMS_ADMIN` → C02 (Inicio — bloque «Necesita tu atención» con ítems (ADMIN))

## AgendaList (filtrada)

- **Clave:** `src/features/overview.tsx :: Calendar > agendaList`
- **Tipo:** ul grid
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > agendaList`
- **Surfaces:** 1

  - `CAL_CALENDAR_006_FILTERED_MATCH` → C01 (Calendario — filtrado por tipo Partido)

## AgendaList

- **Clave:** `src/features/overview.tsx :: Calendar > agendaList (EventLine → RowLink)`
- **Tipo:** ul grid gap-3 con EventLine
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > agendaList (EventLine → RowLink)`
- **Surfaces:** 1

  - `CAL_CALENDAR_001_AGENDA` → C05 (Calendario — vista Agenda)

## Aside de estado del evento

- **Clave:** `src/features/overview.tsx :: Calendar > aside`
- **Tipo:** aside content-start + Surface
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > aside`
- **Surfaces:** 1

  - `CAL_CALENDAR_001_AGENDA` → C06 (Calendario — vista Agenda)

## StateLegendSurface

- **Clave:** `src/features/overview.tsx :: Calendar > aside (leyenda de estados)`
- **Tipo:** Surface con lista de muestras
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > aside (leyenda de estados)`
- **Surfaces:** 1

  - `CAL_CALENDAR_007_MONTH_SCROLL_02` → C02 (Calendario — mes, franja inferior (matriz y panel))

## SelectedEventPanel

- **Clave:** `src/features/overview.tsx :: Calendar > aside (selectedEvent)`
- **Tipo:** Surface grid gap-4 dentro del aside
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > aside (selectedEvent)`
- **Surfaces:** 2

  - `CAL_CALENDAR_003_MONTH_EVENT_SELECTED` → C01 (Calendario — mes con evento seleccionado)
  - `CAL_CALENDAR_004_AGENDA_EVENT_SELECTED` → C01 (Calendario — agenda con evento seleccionado)

## EventChip (celda del mes)

- **Clave:** `src/features/overview.tsx :: Calendar > button (eventToneChip)`
- **Tipo:** button truncado
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > button (eventToneChip)`
- **Surfaces:** 1

  - `CAL_CALENDAR_002_MONTH` → C02 (Calendario — vista Mes)

## MonthGrid

- **Clave:** `src/features/overview.tsx :: Calendar > monthGrid`
- **Tipo:** div grid con 7 columnas y gap-px
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > monthGrid`
- **Surfaces:** 2

  - `CAL_CALENDAR_002_MONTH` → C01 (Calendario — vista Mes)
  - `CAL_CALENDAR_007_MONTH_SCROLL_02` → C01 (Calendario — mes, franja inferior (matriz y panel))

## MonthLegendNote

- **Clave:** `src/features/overview.tsx :: Calendar > p (nota de la vista mes)`
- **Tipo:** p gei-meta
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Calendar > p (nota de la vista mes)`
- **Surfaces:** 1

  - `CAL_CALENDAR_002_MONTH` → C04 (Calendario — vista Mes)

## EventRow (GEI vs. CUBA)

- **Clave:** `src/features/overview.tsx :: EventLine`
- **Tipo:** RowLink
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `EventLine`
- **Surfaces:** 2

  - `HOME_005_ATTENTION_EMPTY_SUBCOMMITTEE` → C02 (Inicio — subcomisión, sin pendientes propios)
  - `HOME_006_SCROLL_02` → C01 (Inicio — segunda franja de scroll (COACH))

## EventRow (GEI vs. Lomas)

- **Clave:** `src/features/overview.tsx :: EventLine → RowLink`
- **Tipo:** RowLink con meta alineada a la derecha
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `EventLine → RowLink`
- **Surfaces:** 1

  - `HOME_001_DEFAULT_COACH` → C04 (Inicio — entrenador (COACH))

## ConversationRow

- **Clave:** `src/features/overview.tsx :: Home > RowLink (conversations.slice(0,2))`
- **Tipo:** RowLink
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Home > RowLink (conversations.slice(0,2))`
- **Surfaces:** 1

  - `HOME_007_COMMS_SECTION` → C01 (Inicio — sección Comunicaciones (PLAYER))

## NoticeRow (avisos)

- **Clave:** `src/features/overview.tsx :: Home > RowLink (unreadNotices[0])`
- **Tipo:** RowLink
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Home > RowLink (unreadNotices[0])`
- **Surfaces:** 1

  - `HOME_007_COMMS_SECTION` → C02 (Inicio — sección Comunicaciones (PLAYER))

## Section «Comunicaciones»

- **Clave:** `src/features/overview.tsx :: Home > section (Comunicaciones)`
- **Tipo:** section grid + RowLink
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Home > section (Comunicaciones)`
- **Surfaces:** 1

  - `HOME_001_DEFAULT_COACH` → C06 (Inicio — entrenador (COACH))

## Section «Hoy» + TextLink «Ver calendario»

- **Clave:** `src/features/overview.tsx :: Home > section (Hoy) / TextLink`
- **Tipo:** section grid + header flex
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Home > section (Hoy) / TextLink`
- **Surfaces:** 1

  - `HOME_001_DEFAULT_COACH` → C03 (Inicio — entrenador (COACH))

## Section «Próximamente»

- **Clave:** `src/features/overview.tsx :: Home > section (Próximamente) / Surface flush`
- **Tipo:** section grid + Surface flush
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Home > section (Próximamente) / Surface flush`
- **Surfaces:** 1

  - `HOME_001_DEFAULT_COACH` → C05 (Inicio — entrenador (COACH))

## ContactRow (oculta)

- **Clave:** `src/features/overview.tsx :: PersonDetail > RowStatic (Contacto)`
- **Tipo:** RowStatic
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `PersonDetail > RowStatic (Contacto)`
- **Surfaces:** 1

  - `EQ_PERSON_003_DETAIL_STRANGER` → C01 (Persona — ficha de lectura sin relación (PLAYER))

## SearchInput

- **Clave:** `src/features/overview.tsx :: SearchPage > form > input[aria-label]`
- **Tipo:** input con icono absolute
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `SearchPage > form > input[aria-label]`
- **Surfaces:** 1

  - `GBL_SEARCH_001_EMPTY` → C02 (Buscar — estado inicial sin término)

## SearchInput (con término)

- **Clave:** `src/features/overview.tsx :: SearchPage > input`
- **Tipo:** input
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `SearchPage > input`
- **Surfaces:** 2

  - `GBL_SEARCH_002_RESULTS` → C01 (Buscar — con resultados (persona))
  - `GBL_SEARCH_004_MULTI_RESULT` → C01 (Buscar — resultados en varios grupos)

## EventCard (evento próximo)

- **Clave:** `src/features/overview.tsx :: TeamDetail > DetailSection «Próximos eventos»`
- **Tipo:** Surface grid gap-3 con RowLink + VasControl
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `TeamDetail > DetailSection «Próximos eventos»`
- **Surfaces:** 1

  - `EQ_TEAM_DETAIL_001_EVENTOS` → C03 (Detalle de equipo — pestaña Eventos)

## MemberRow

- **Clave:** `src/features/overview.tsx :: TeamDetail > RowLink (members)`
- **Tipo:** RowLink con Avatar
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `TeamDetail > RowLink (members)`
- **Surfaces:** 1

  - `EQ_TEAM_DETAIL_002_PERSONAS` → C01 (Detalle de equipo — pestaña Personas)

## ResultRow

- **Clave:** `src/features/overview.tsx :: TeamDetail > RowStatic (resultados)`
- **Tipo:** RowStatic con TextLink
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `TeamDetail > RowStatic (resultados)`
- **Surfaces:** 1

  - `EQ_TEAM_DETAIL_003_RESULTADOS` → C01 (Detalle de equipo — pestaña Resultados)

## TeamTabs

- **Clave:** `src/features/overview.tsx :: TeamDetail > tabs`
- **Tipo:** div[role=tablist] con 3 botones
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `TeamDetail > tabs`
- **Surfaces:** 2

  - `EQ_TEAM_DETAIL_001_EVENTOS` → C01 (Detalle de equipo — pestaña Eventos)
  - `EQ_TEAM_DETAIL_007_SEPTIMA` → C01 (Detalle de equipo — Séptima A (COACH))

## EventCard (con VasControl)

- **Clave:** `src/features/overview.tsx :: TeamDetail > ul > li > Surface`
- **Tipo:** Surface grid gap-3
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `TeamDetail > ul > li > Surface`
- **Surfaces:** 1

  - `EQ_TEAM_DETAIL_006_SCROLL_02` → C01 (Detalle de equipo — franja de eventos pasados)

## TeamRow (Sexta A)

- **Clave:** `src/features/overview.tsx :: Teams > RowLink`
- **Tipo:** RowLink con Tag
- **Source file:** `src/features/overview.tsx`
- **Source symbol:** `Teams > RowLink`
- **Surfaces:** 4

  - `EQ_TEAMS_001_LIST_COACH` → C02 (Equipos — lista (COACH))
  - `EQ_TEAMS_002_LIST_PLAYER` → C01 (Equipos — lista (PLAYER))
  - `EQ_TEAMS_003_LIST_ADMIN` → C01 (Equipos — lista (ADMIN))
  - `EQ_TEAMS_004_LIST_CAPTAIN` → C01 (Equipos — lista (CAPTAIN))

## AttendanceValueButton (activo)

- **Clave:** `src/features/participation.tsx :: AttendancePage > button[aria-pressed]`
- **Tipo:** button aria-pressed
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AttendancePage > button[aria-pressed]`
- **Surfaces:** 1

  - `PRT_ATTENDANCE_001_OPEN` → C03 (Asistencia — abierta)

## AttendanceCounters

- **Clave:** `src/features/participation.tsx :: AttendancePage > Surface (contadores)`
- **Tipo:** Surface con grid de 4 celdas
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AttendancePage > Surface (contadores)`
- **Surfaces:** 2

  - `PRT_ATTENDANCE_001_OPEN` → C01 (Asistencia — abierta)
  - `XD_REPORT_001_TO_ATTENDANCE` → C01 (Origen — Informe → Planilla de asistencia)

## CorrectionsSurface

- **Clave:** `src/features/participation.tsx :: AttendancePage > Surface (Correcciones)`
- **Tipo:** Surface con botón expansor
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AttendancePage > Surface (Correcciones)`
- **Surfaces:** 1

  - `PRT_ATTENDANCE_001_OPEN` → C04 (Asistencia — abierta)

## AttendanceRow (persona)

- **Clave:** `src/features/participation.tsx :: AttendancePage > ul > li > div.flex`
- **Tipo:** li con tres botones de valor
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AttendancePage > ul > li > div.flex`
- **Surfaces:** 1

  - `PRT_ATTENDANCE_001_OPEN` → C02 (Asistencia — abierta)

## ResponsesList (Respuestas)

- **Clave:** `src/features/participation.tsx :: AvailabilityPage > DetailSection «Respuestas»`
- **Tipo:** ul con li flex-wrap
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AvailabilityPage > DetailSection «Respuestas»`
- **Surfaces:** 1

  - `PRT_AVAILABILITY_001_DEFAULT` → C04 (Disponibilidad — detalle de respuestas de un evento)

## ResponseRow

- **Clave:** `src/features/participation.tsx :: AvailabilityPage > DetailSection > li`
- **Tipo:** li flex flex-wrap
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AvailabilityPage > DetailSection > li`
- **Surfaces:** 1

  - `PRT_AVAILABILITY_004_SCROLL_02` → C01 (Disponibilidad — franja de la lista de respuestas)

## SummarySurface (todos en 0)

- **Clave:** `src/features/participation.tsx :: AvailabilityPage > Surface (Resumen)`
- **Tipo:** Surface
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AvailabilityPage > Surface (Resumen)`
- **Surfaces:** 1

  - `PRT_AVAILABILITY_005_CLUB_EVENT` → C01 (Disponibilidad — evento de club sin roster)

## SummarySurface (Resumen)

- **Clave:** `src/features/participation.tsx :: AvailabilityPage > Surface (Resumen),RowStatic,StateBadge`
- **Tipo:** Surface grid con 5 RowStatic
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `AvailabilityPage > Surface (Resumen),RowStatic,StateBadge`
- **Surfaces:** 1

  - `PRT_AVAILABILITY_001_DEFAULT` → C03 (Disponibilidad — detalle de respuestas de un evento)

## MarkInProgressButton

- **Clave:** `src/features/participation.tsx :: MatchRecordPage > Button «Marcar como en curso»`
- **Tipo:** Button secondary
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `MatchRecordPage > Button «Marcar como en curso»`
- **Surfaces:** 1

  - `PRT_MATCH_RECORD_001_NOT_STARTED` → C03 (Resultado — partido no iniciado)

## GoalsInputs

- **Clave:** `src/features/participation.tsx :: MatchRecordPage > label > input[type=number]`
- **Tipo:** label con input[type=number]
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `MatchRecordPage > label > input[type=number]`
- **Surfaces:** 1

  - `PRT_MATCH_RECORD_002_EDITABLE` → C01 (Resultado — en edición)

## ScoreDisplay

- **Clave:** `src/features/participation.tsx :: MatchRecordPage > p.gei-l5`
- **Tipo:** p gei-l5 tabular-nums
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `MatchRecordPage > p.gei-l5`
- **Surfaces:** 1

  - `PRT_MATCH_RECORD_001_NOT_STARTED` → C01 (Resultado — partido no iniciado)

## SelectionActionBar

- **Clave:** `src/features/participation.tsx :: SelectionPage > div.sticky`
- **Tipo:** div sticky
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `SelectionPage > div.sticky`
- **Surfaces:** 1

  - `PRT_SELECTION_001_PUBLISHED` → C05 (Convocatoria — publicada)

## ChangesBlock

- **Clave:** `src/features/participation.tsx :: SelectionPage > extra (added/removed)`
- **Tipo:** div con borde bg-control
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `SelectionPage > extra (added/removed)`
- **Surfaces:** 1

  - `PRT_SELECTION_005_PUBLISH_CONFIRM` → C02 (Convocatoria — confirmación de publicación)

## DirtyFlag («Borrador sin publicar»)

- **Clave:** `src/features/participation.tsx :: SelectionPage > SectionHeader aside (dirty)`
- **Tipo:** span text-attention
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `SelectionPage > SectionHeader aside (dirty)`
- **Surfaces:** 1

  - `PRT_SELECTION_004_DRAFT_DIRTY` → C01 (Convocatoria — borrador sin publicar)

## RevisionsSurface

- **Clave:** `src/features/participation.tsx :: SelectionPage > Surface (Revisiones publicadas)`
- **Tipo:** Surface con botón expansor
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `SelectionPage > Surface (Revisiones publicadas)`
- **Surfaces:** 1

  - `PRT_SELECTION_001_PUBLISHED` → C04 (Convocatoria — publicada)

## SelectionRow (persona)

- **Clave:** `src/features/participation.tsx :: SelectionPage > ul > li`
- **Tipo:** li con checkbox + label
- **Source file:** `src/features/participation.tsx`
- **Source symbol:** `SelectionPage > ul > li`
- **Surfaces:** 2

  - `PRT_SELECTION_001_PUBLISHED` → C03 (Convocatoria — publicada)
  - `PRT_SELECTION_008_SCROLL_02` → C01 (Convocatoria — franja inferior de la lista)

## RouteContext

- **Clave:** `src/shared/nav-context.ts :: routeContext`
- **Tipo:** p (truncate)
- **Source file:** `src/shared/nav-context.ts`
- **Source symbol:** `routeContext`
- **Surfaces:** 2

  - `GBL_SHELL_001_TOPBAR_MOBILE` → C03 (Chrome de aplicación — barra superior en 390)
  - `GBL_SHELL_002_TOPBAR_DESKTOP` → C02 (Chrome de aplicación — barra superior en 1440)

## Historial (DetailSection con action)

- **Clave:** `src/shared/patterns.tsx :: DetailSection / Button quiet`
- **Tipo:** section grid con 3 entradas y botón «Ver todo»
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `DetailSection / Button quiet`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C07 (Detalle de evento — Scheduled, vista COACH)

## MatchesList

- **Clave:** `src/shared/patterns.tsx :: DetailSection / RowLink`
- **Tipo:** DetailSection con RowLink
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `DetailSection / RowLink`
- **Surfaces:** 1

  - `CAL_JORNADA_001_DETAIL` → C03 (Jornada — detalle)

## Logística (DetailSection)

- **Clave:** `src/shared/patterns.tsx :: DetailSection / RowStatic`
- **Tipo:** section grid con dl de RowStatic
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `DetailSection / RowStatic`
- **Surfaces:** 2

  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C05 (Detalle de evento — Scheduled, vista COACH)
  - `CAL_EVENT_DETAIL_012_SCROLL_02` → C01 (Detalle de evento — franja de logística e historial)

## DetailSection «Personas»

- **Clave:** `src/shared/patterns.tsx :: DetailSection / SectionHeader`
- **Tipo:** section grid
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `DetailSection / SectionHeader`
- **Surfaces:** 1

  - `GBL_SEARCH_002_RESULTS` → C02 (Buscar — con resultados (persona))

## HistoryList

- **Clave:** `src/shared/patterns.tsx :: HistoryList / TimelineEntry`
- **Tipo:** ul grid
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `HistoryList / TimelineEntry`
- **Surfaces:** 6

  - `CAL_EVENT_DETAIL_004_HISTORY_MODAL` → C02 (Detalle de evento — modal de historial)
  - `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` → C04 (Diálogo modal «Historial del evento»)
  - `MGT_AUDIT_001_LIST` → C02 (Historial de cambios — listado)
  - `PRT_ATTENDANCE_006_CORRECTIONS_HISTORY` → C01 (Asistencia — historial de correcciones)
  - `PRT_MATCH_RECORD_008_HISTORY_OPEN` → C01 (Resultado — historial del acta)
  - `PRT_SELECTION_003_REVISIONS_OPEN` → C01 (Convocatoria — revisiones desplegadas)

## PageContextHeader

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader`
- **Tipo:** header grid
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader`
- **Surfaces:** 13

  - `CAL_CALENDAR_001_AGENDA` → C01 (Calendario — vista Agenda)
  - `CAL_EVENT_DETAIL_001_SCHEDULED_COACH` → C01 (Detalle de evento — Scheduled, vista COACH)
  - `CAL_EVENT_DETAIL_005_IN_PROGRESS` → C01 (Detalle de evento — In progress)
  - `CAL_EVENT_FORM_001_NEW` → C01 (Alta de evento — formulario vacío)
  - `CAL_JORNADA_001_DETAIL` → C01 (Jornada — detalle)
  - `COM_ANNOUNCEMENT_001_DETAIL` → C01 (Comunicado — detalle)
  - `EQ_PERSON_001_DETAIL_COACH` → C01 (Persona — ficha de lectura (COACH))
  - `EQ_TEAMS_001_LIST_COACH` → C01 (Equipos — lista (COACH))
  - `GBL_SEARCH_001_EMPTY` → C01 (Buscar — estado inicial sin término)
  - `HOME_001_DEFAULT_COACH` → C01 (Inicio — entrenador (COACH))
  - `HOME_002_DEFAULT_ADMIN` → C01 (Inicio — administración (ADMIN))
  - `PRT_AVAILABILITY_001_DEFAULT` → C01 (Disponibilidad — detalle de respuestas de un evento)
  - `PRT_SELECTION_001_PUBLISHED` → C01 (Convocatoria — publicada)

## AnnouncementHeader

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader (AnnouncementDetail)`
- **Tipo:** header grid con back y action
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader (AnnouncementDetail)`
- **Surfaces:** 1

  - `XD_NOTIF_001_TO_EVENT` → C01 (Origen — Aviso → objeto (comunicado))

## EventDetailHeader

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader (EventDetail)`
- **Tipo:** header grid
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader (EventDetail)`
- **Surfaces:** 4

  - `XD_CALENDAR_001_TO_EVENT` → C01 (Origen — Calendario → Evento (agenda))
  - `XD_HOME_001_TO_EVENT` → C01 (Origen — Inicio → Evento)
  - `XD_SEARCH_003_TO_EVENT` → C01 (Origen — Búsqueda → Evento)
  - `XD_TEAM_001_TO_EVENT` → C01 (Origen — Equipo → Evento)

## JornadaHeader

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader (JornadaDetail)`
- **Tipo:** header grid con back
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader (JornadaDetail)`
- **Surfaces:** 1

  - `XD_COMPETITION_001_TO_JORNADA` → C01 (Origen — Competencia → Jornada)

## QueryOnlyLead («Estás viendo un equipo que no gestionás.»)

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader (lead = isMine ? … : «Estás viendo un equipo que no gestionás.»)`
- **Tipo:** p gei-page-lead
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader (lead = isMine ? … : «Estás viendo un equipo que no gestionás.»)`
- **Surfaces:** 1

  - `EQ_TEAM_DETAIL_004_OUT_OF_SCOPE` → C01 (Detalle de equipo — fuera de alcance de gestión)

## PersonDetailHeader

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader (PersonDetail)`
- **Tipo:** header grid con back
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader (PersonDetail)`
- **Surfaces:** 1

  - `XD_SEARCH_001_TO_PERSON` → C01 (Origen — Búsqueda → Persona)

## TeamDetailHeader

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader (TeamDetail)`
- **Tipo:** header grid con back y action
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader (TeamDetail)`
- **Surfaces:** 1

  - `XD_SEARCH_002_TO_TEAM` → C01 (Origen — Búsqueda → Equipo)

## BackButton («← Volver»)

- **Clave:** `src/shared/patterns.tsx :: PageContextHeader > button (back)`
- **Tipo:** button con flecha de texto
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `PageContextHeader > button (back)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_005_EDIT` → C01 (Edición de evento — formulario cargado)

## ScopeDialog

- **Clave:** `src/shared/patterns.tsx :: ScopeDialog`
- **Tipo:** section[role=dialog]
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `ScopeDialog`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_009_SCOPE_DIALOG` → C01 (Edición de evento — diálogo de alcance de serie)

## ScopeOption («Toda la serie»)

- **Clave:** `src/shared/patterns.tsx :: ScopeDialog > button (option)`
- **Tipo:** button grid con título, contador y detalle
- **Source file:** `src/shared/patterns.tsx`
- **Source symbol:** `ScopeDialog > button (option)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_009_SCOPE_DIALOG` → C02 (Edición de evento — diálogo de alcance de serie)

## AvatarLarge

- **Clave:** `src/shared/ui.tsx :: Avatar size=lg selected`
- **Tipo:** span rounded-pill
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Avatar size=lg selected`
- **Surfaces:** 1

  - `MOR_PROFILE_001_COACH` → C01 (Mi perfil — entrenador)

## NotOpenedBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=attention`
- **Tipo:** Banner tone=attention
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=attention`
- **Surfaces:** 3

  - `MGT_HOME_001_ADMIN` → C01 (Administración — hub (ADMIN))
  - `MGT_PERSON_007_INCOMPLETE` → C01 (Ficha de persona — perfil incompleto)
  - `PRT_ATTENDANCE_002_NOT_OPENED` → C01 (Asistencia — todavía no abierta)

## NotStartedBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=attention (!isFinal && !editing)`
- **Tipo:** Banner tone=attention
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=attention (!isFinal && !editing)`
- **Surfaces:** 1

  - `PRT_MATCH_RECORD_001_NOT_STARTED` → C02 (Resultado — partido no iniciado)

## UnrecordedBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=attention (closed && unrecorded.length > 0)`
- **Tipo:** Banner tone=attention
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=attention (closed && unrecorded.length > 0)`
- **Surfaces:** 1

  - `PRT_ATTENDANCE_003_CLOSED` → C01 (Asistencia — cerrada)

## ConsequenceBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=danger`
- **Tipo:** Banner tone=danger
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=danger`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM` → C02 (Detalle de evento — confirmación de cancelación)

## ReadOnlyBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=neutral`
- **Tipo:** Banner tone=neutral
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=neutral`
- **Surfaces:** 1

  - `CAL_JORNADA_003_READ_ONLY` → C01 (Jornada — sólo lectura)

## ImmutableAudienceBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=neutral (published)`
- **Tipo:** Banner tone=neutral
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=neutral (published)`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_008_EDIT_FORM` → C01 (Comunicado — corrección de publicado)

## ConvocadaBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=selected`
- **Tipo:** Banner tone=selected
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=selected`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_009_PLAYER_VIEW` → C01 (Detalle de evento — vista PLAYER (convocada))

## SuccessBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=success`
- **Tipo:** Banner tone=success
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=success`
- **Surfaces:** 2

  - `AUTH_ACTIVATE_003_SUCCESS` → C01 (Activar cuenta — cuenta activada)
  - `CAL_JORNADA_004_IMPACT_MODAL` → C02 (Jornada — modal de impacto tras guardar)

## ClosedSuccessBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=success (closed)`
- **Tipo:** Banner tone=success
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=success (closed)`
- **Surfaces:** 1

  - `PRT_ATTENDANCE_003_CLOSED` → C02 (Asistencia — cerrada)

## OfficialResultBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=success (isFinal)`
- **Tipo:** Banner tone=success
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=success (isFinal)`
- **Surfaces:** 1

  - `PRT_MATCH_RECORD_003_FINAL` → C01 (Resultado — oficial (finalizado))

## PostponedBanner

- **Clave:** `src/shared/ui.tsx :: Banner tone=warning`
- **Tipo:** Banner tone=warning
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Banner tone=warning`
- **Surfaces:** 1

  - `PRT_AVAILABILITY_003_POSTPONED` → C01 (Disponibilidad — evento postergado)

## PublishSelectionButton (primario)

- **Clave:** `src/shared/ui.tsx :: Button (dirty ? variant='primary' : 'secondary')`
- **Tipo:** Button primary
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button (dirty ? variant='primary' : 'secondary')`
- **Surfaces:** 1

  - `PRT_SELECTION_004_DRAFT_DIRTY` → C02 (Convocatoria — borrador sin publicar)

## PublishSelectionButton (sin publicar)

- **Clave:** `src/shared/ui.tsx :: Button (published === null ? 'Publicar convocatoria' : 'Publicar cambios')`
- **Tipo:** Button secondary disabled
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button (published === null ? 'Publicar convocatoria' : 'Publicar cambios')`
- **Surfaces:** 1

  - `PRT_SELECTION_002_DRAFT` → C02 (Convocatoria — sin publicar)

## CorrectRecordButton

- **Clave:** `src/shared/ui.tsx :: Button variant=danger «Corregir el resultado»`
- **Tipo:** Button danger
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=danger «Corregir el resultado»`
- **Surfaces:** 1

  - `PRT_MATCH_RECORD_003_FINAL` → C02 (Resultado — oficial (finalizado))

## ArchiveCompetitionButton

- **Clave:** `src/shared/ui.tsx :: Button variant=danger («Archivar competencia»)`
- **Tipo:** Button danger
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=danger («Archivar competencia»)`
- **Surfaces:** 1

  - `MGT_COMPETITIONS_002_DETAIL` → C02 (Competencias — detalle)

## DisableAccountButton

- **Clave:** `src/shared/ui.tsx :: Button variant=danger («Deshabilitar cuenta»)`
- **Tipo:** Button danger
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=danger («Deshabilitar cuenta»)`
- **Surfaces:** 1

  - `MGT_PERSON_005_CUENTA` → C01 (Ficha de persona — Cuenta)

## LogoutButton

- **Clave:** `src/shared/ui.tsx :: Button variant=danger (logout)`
- **Tipo:** Button danger
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=danger (logout)`
- **Surfaces:** 1

  - `MOR_PROFILE_005_SCROLL_02` → C01 (Mi perfil — sección de seguridad y cierre de sesión)

## EndMembershipButton

- **Clave:** `src/shared/ui.tsx :: Button variant=danger size=sm («Finalizar»)`
- **Tipo:** Button danger sm
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=danger size=sm («Finalizar»)`
- **Surfaces:** 1

  - `MGT_PERSON_002_PERTENENCIA` → C01 (Ficha de persona — Pertenencia)

## SearchSubmitButton

- **Clave:** `src/shared/ui.tsx :: Button variant=primary`
- **Tipo:** Button primary
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=primary`
- **Surfaces:** 1

  - `GBL_SEARCH_001_EMPTY` → C03 (Buscar — estado inicial sin término)

## OpenAttendanceButton

- **Clave:** `src/shared/ui.tsx :: Button variant=primary «Abrir asistencia»`
- **Tipo:** Button primary
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=primary «Abrir asistencia»`
- **Surfaces:** 1

  - `PRT_ATTENDANCE_002_NOT_OPENED` → C02 (Asistencia — todavía no abierta)

## FinalizeRecordButton

- **Clave:** `src/shared/ui.tsx :: Button variant=primary «Finalizar resultado»`
- **Tipo:** Button primary
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=primary «Finalizar resultado»`
- **Surfaces:** 1

  - `PRT_MATCH_RECORD_002_EDITABLE` → C02 (Resultado — en edición)

## CreateCompetitionButton

- **Clave:** `src/shared/ui.tsx :: Button variant=primary («Crear competencia»)`
- **Tipo:** Button primary
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=primary («Crear competencia»)`
- **Surfaces:** 1

  - `MGT_COMPETITIONS_001_LIST` → C02 (Competencias — listado)

## StartMembershipButton

- **Clave:** `src/shared/ui.tsx :: Button variant=primary («Iniciar pertenencia»)`
- **Tipo:** Button primary
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=primary («Iniciar pertenencia»)`
- **Surfaces:** 1

  - `MGT_PERSON_008_PENDING_ACCOUNT` → C01 (Ficha de persona — cuenta pendiente)

## LoginSubmitButton

- **Clave:** `src/shared/ui.tsx :: Button variant=primary type=submit («Entrar»)`
- **Tipo:** Button primary type=submit
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=primary type=submit («Entrar»)`
- **Surfaces:** 1

  - `AUTH_LOGIN_001_DEFAULT` → C03 (Acceso — formulario de login)

## RemoveFiltersLink

- **Clave:** `src/shared/ui.tsx :: Button variant=quiet`
- **Tipo:** Button quiet
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=quiet`
- **Surfaces:** 1

  - `CAL_CALENDAR_006_FILTERED_MATCH` → C02 (Calendario — filtrado por tipo Partido)

## MarkAllReadButton

- **Clave:** `src/shared/ui.tsx :: Button variant=secondary`
- **Tipo:** Button secondary
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=secondary`
- **Surfaces:** 3

  - `CAL_CALENDAR_005_FILTER_EMPTY` → C02 (Calendario — filtros sin resultados)
  - `GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD` → C03 (Avisos — lista con un aviso sin leer (PLAYER))
  - `GBL_SEARCH_003_NO_RESULTS` → C02 (Buscar — sin resultados)

## OpenNoticeButton

- **Clave:** `src/shared/ui.tsx :: Button variant=secondary size=sm`
- **Tipo:** Button secondary sm
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Button variant=secondary size=sm`
- **Surfaces:** 3

  - `CAL_CALENDAR_002_MONTH` → C03 (Calendario — vista Mes)
  - `GBL_NOTIF_001_LIST_COACH_ALL_READ` → C03 (Avisos — lista sin pendientes (COACH))
  - `MGT_PERSON_001_IDENTIDAD` → C03 (Ficha de persona — Identidad)

## NotFoundEmpty

- **Clave:** `src/shared/ui.tsx :: Empty`
- **Tipo:** Empty
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Empty`
- **Surfaces:** 35

  - `CAL_CALENDAR_005_FILTER_EMPTY` → C01 (Calendario — filtros sin resultados)
  - `CAL_EVENT_DETAIL_013_NOT_FOUND` → C01 (Detalle de evento — evento inexistente)
  - `CAL_EVENT_FORM_010_NO_AUTHORITY` → C01 (Edición de evento — sin autoridad)
  - `COM_ANNOUNCEMENT_006_NOT_REACHED` → C01 (Comunicado — no alcanzado por la audiencia)
  - `COM_ANNOUNCEMENT_009_NO_AUTHORITY_NEW` → C01 (Comunicado — alta sin autoridad)
  - `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE` → C01 (Comunicación — sin conversaciones habilitadas (SUBCOMMITTEE))
  - `COM_COMM_004_NO_CHAT_ADMIN` → C01 (Comunicación — sin conversaciones habilitadas (ADMIN))
  - `COM_CONVERSATION_001_DEFAULT` → C01 (Conversación — ruta /conversations/:id (estado actual))
  - `COM_CONVERSATION_002_EVENT_KIND` → C01 (Conversación — ruta de evento (estado actual))
  - `COM_CONVERSATION_004_NO_AUTHORITY` → C01 (Conversación — actor sin chat (ADMIN))
  - `EQ_PERSON_004_NOT_FOUND` → C01 (Persona — inexistente)
  - `EQ_TEAM_DETAIL_008_NOT_FOUND` → C01 (Detalle de equipo — equipo inexistente)
  - `GBL_NOTIF_004_EMPTY_STATE` → C01 (Avisos — estado vacío (ADMIN))
  - `GBL_SEARCH_001_EMPTY` → C04 (Buscar — estado inicial sin término)
  - `GBL_SEARCH_003_NO_RESULTS` → C01 (Buscar — sin resultados)
  - `GBL_STATE_001_NOT_FOUND` → C01 (Página no encontrada (ruta inexistente))
  - `MGT_AUDIT_002_EMPTY_RANGE` → C01 (Historial de cambios — rango sin movimientos)
  - `MGT_AUDIT_003_DENIED_COACH` → C01 (Historial de cambios — sin acceso (COACH))
  - `MGT_COMPETITIONS_007_DENIED_COACH` → C01 (Competencias — sin acceso (COACH))
  - `MGT_HOME_003_DENIED_COACH` → C01 (Administración — sin acceso (COACH))
  - `MGT_PEOPLE_003_FILTER_EMPTY` → C01 (Personas — búsqueda sin resultados)
  - `MGT_PEOPLE_007_DENIED_COACH` → C01 (Personas — sin acceso (COACH))
  - `MGT_PERSON_010_NO_MEMBERSHIP` → C01 (Ficha de persona — sin pertenencia)
  - `MGT_PERSON_014_DENIED_SUBCOMMITTEE` → C01 (Ficha de persona — sin acceso (SUBCOMMITTEE))
  - `MGT_STRUCTURE_004_VENUES` → C01 (Estructura — Sedes (pestaña vacía))
  - `MGT_STRUCTURE_007_DENIED_COACH` → C01 (Estructura — sin acceso (COACH))
  - `MGT_TEAM_002_NOT_FOUND` → C01 (Equipo — inexistente)
  - `MOR_REPORTS_004_FILTERED_EMPTY` → C01 (Informes — sin eventos en el período)
  - `MOR_REPORTS_005_NO_ACCESS_ADMIN` → C01 (Informes — sin acceso (ADMIN))
  - `PRT_ATTENDANCE_007_NO_AUTHORITY` → C01 (Asistencia — sin autoridad)
  - `PRT_MATCH_RECORD_006_NOT_A_MATCH` → C01 (Resultado — evento que no es partido)
  - `PRT_MATCH_RECORD_007_NO_AUTHORITY` → C01 (Resultado — sin autoridad)
  - `PRT_SELECTION_006_NO_AUTHORITY` → C01 (Convocatoria — sin autoridad)
  - `PRT_SELECTION_007_OFFICIAL_VS_COACH` → C01 (Convocatoria — vista SUBCOMMITTEE)
  - `XD_EVENT_001_TO_CONVERSATION` → C01 (Origen — Evento → Conversación (estado actual))

## TitleFieldError

- **Clave:** `src/shared/ui.tsx :: Field > p (error)`
- **Tipo:** p con AlertCircle
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Field > p (error)`
- **Surfaces:** 4

  - `AUTH_ACTIVATE_002_ERROR` → C01 (Activar cuenta — código inválido)
  - `AUTH_LOGIN_002_ERROR` → C01 (Acceso — credenciales rechazadas)
  - `CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS` → C01 (Alta de evento — errores de validación)
  - `MGT_PEOPLE_006_NEW_VALIDATION` → C01 (Personas — alta con errores de validación)

## IncompleteFilterChip (activo)

- **Clave:** `src/shared/ui.tsx :: FilterChip (active)`
- **Tipo:** FilterChip
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `FilterChip (active)`
- **Surfaces:** 1

  - `MGT_PEOPLE_002_FILTER_INCOMPLETE` → C01 (Personas — filtro de perfil incompleto)

## IncompleteFilterChip

- **Clave:** `src/shared/ui.tsx :: FilterChip (profileStatus)`
- **Tipo:** FilterChip
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `FilterChip (profileStatus)`
- **Surfaces:** 1

  - `MGT_PEOPLE_001_LIST` → C02 (Personas — listado (ADMIN))

## IdentityKeyValue

- **Clave:** `src/shared/ui.tsx :: KeyValue / MetaRow`
- **Tipo:** dl con MetaRow
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `KeyValue / MetaRow`
- **Surfaces:** 2

  - `AUTH_NOACCESS_001_DEFAULT` → C01 (Sin acceso — cuenta sin rol asignado)
  - `MOR_PROFILE_001_COACH` → C02 (Mi perfil — entrenador)

## MenuPanel

- **Clave:** `src/shared/ui.tsx :: Menu`
- **Tipo:** div[role=menu] absolute
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Menu`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_003_MENU_OPEN` → C01 (Comunicado — menú de acciones)

## MenuTrigger («Acciones»)

- **Clave:** `src/shared/ui.tsx :: Menu > button[aria-haspopup=menu]`
- **Tipo:** button con chevron
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Menu > button[aria-haspopup=menu]`
- **Surfaces:** 1

  - `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` → C01 (Menú contextual «Acciones» del evento)

## MenuItem destructivo («Cancelar evento»)

- **Clave:** `src/shared/ui.tsx :: Menu > button[role=menuitem] (danger)`
- **Tipo:** button[role=menuitem]
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Menu > button[role=menuitem] (danger)`
- **Surfaces:** 1

  - `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` → C03 (Menú contextual «Acciones» del evento)

## MenuPanel

- **Clave:** `src/shared/ui.tsx :: Menu > div[role=menu]`
- **Tipo:** div[role=menu] absolute
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Menu > div[role=menu]`
- **Surfaces:** 1

  - `GBL_OVERLAY_001_MENU_ACCIONES_EVENTO` → C02 (Menú contextual «Acciones» del evento)

## ModalPanel (ConfirmDialog)

- **Clave:** `src/shared/ui.tsx :: Modal`
- **Tipo:** section[role=dialog]
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Modal`
- **Surfaces:** 18

  - `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM` → C01 (Detalle de evento — confirmación de cancelación)
  - `CAL_EVENT_DETAIL_004_HISTORY_MODAL` → C01 (Detalle de evento — modal de historial)
  - `CAL_EVENT_FORM_007_EDIT_DISCARD_CONFIRM` → C01 (Edición de evento — confirmación de descarte)
  - `CAL_JORNADA_004_IMPACT_MODAL` → C01 (Jornada — modal de impacto tras guardar)
  - `COM_ANNOUNCEMENT_004_ARCHIVE_CONFIRM` → C01 (Comunicado — confirmación de archivado)
  - `MGT_COMPETITIONS_003_CREATE_MODAL` → C01 (Competencias — modal de alta)
  - `MGT_COMPETITIONS_004_EDIT_MODAL` → C01 (Competencias — modal de edición)
  - `MGT_COMPETITIONS_005_ARCHIVE_CONFIRM` → C01 (Competencias — confirmación de archivado)
  - `MGT_PERSON_006_IDENTITY_MODAL` → C01 (Ficha de persona — modal de corrección de identidad)
  - `MGT_PERSON_009_CODE_MODAL` → C01 (Ficha de persona — modal de código de activación)
  - `MGT_PERSON_011_MEMBERSHIP_START_CONFIRM` → C01 (Ficha de persona — confirmación de inicio de pertenencia)
  - `MGT_PERSON_012_MEMBERSHIP_END_CONFIRM` → C01 (Ficha de persona — confirmación de fin de pertenencia)
  - `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` → C01 (Ficha de persona — confirmación de deshabilitación de cuenta)
  - `PRT_ATTENDANCE_004_CLOSE_CONFIRM` → C01 (Asistencia — confirmación de cierre)
  - `PRT_ATTENDANCE_005_CORRECTION_DIALOG` → C01 (Asistencia — diálogo de corrección)
  - `PRT_MATCH_RECORD_004_FINALIZE_CONFIRM` → C01 (Resultado — confirmación de finalización)
  - `PRT_MATCH_RECORD_005_CORRECT_CONFIRM` → C01 (Resultado — confirmación de corrección)
  - `PRT_SELECTION_005_PUBLISH_CONFIRM` → C01 (Convocatoria — confirmación de publicación)

## ModalBackdrop

- **Clave:** `src/shared/ui.tsx :: Modal > div[aria-hidden]`
- **Tipo:** div absolute inset-0
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Modal > div[aria-hidden]`
- **Surfaces:** 1

  - `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` → C01 (Diálogo modal «Historial del evento»)

## ModalHeader + CloseButton

- **Clave:** `src/shared/ui.tsx :: Modal > header / IconButton label=«Cerrar»`
- **Tipo:** div con IconButton
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Modal > header / IconButton label=«Cerrar»`
- **Surfaces:** 1

  - `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` → C03 (Diálogo modal «Historial del evento»)

## ModalPanel

- **Clave:** `src/shared/ui.tsx :: Modal > section[role=dialog]`
- **Tipo:** section[role=dialog]
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Modal > section[role=dialog]`
- **Surfaces:** 1

  - `GBL_OVERLAY_002_MODAL_HISTORIAL_EVENTO` → C02 (Diálogo modal «Historial del evento»)

## IdentityRows

- **Clave:** `src/shared/ui.tsx :: PersonDetail > DetailSection «Identidad» > RowStatic`
- **Tipo:** dl con RowStatic
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `PersonDetail > DetailSection «Identidad» > RowStatic`
- **Surfaces:** 1

  - `EQ_PERSON_001_DETAIL_COACH` → C02 (Persona — ficha de lectura (COACH))

## IdentityRows (con PII)

- **Clave:** `src/shared/ui.tsx :: PersonDetail > RowStatic (dni / birth)`
- **Tipo:** dl con RowStatic
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `PersonDetail > RowStatic (dni / birth)`
- **Surfaces:** 1

  - `EQ_PERSON_002_DETAIL_ADMIN` → C01 (Persona — ficha de lectura (ADMIN))

## EventTypeRadioGroup

- **Clave:** `src/shared/ui.tsx :: RadioGroup`
- **Tipo:** RadioGroup columns=3
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `RadioGroup`
- **Surfaces:** 2

  - `CAL_EVENT_FORM_001_NEW` → C03 (Alta de evento — formulario vacío)
  - `CAL_EVENT_FORM_002_NEW_MATCH_TYPE` → C02 (Alta de evento — tipo «Partido» seleccionado)

## AudienceRadioGroup (columns=2)

- **Clave:** `src/shared/ui.tsx :: RadioGroup (name=event-audience, columns=2)`
- **Tipo:** RadioGroup
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `RadioGroup (name=event-audience, columns=2)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_003_NEW_CLUB_WIDE` → C01 (Alta de evento — destino «Todo el hockey»)

## ResultRow (persona)

- **Clave:** `src/shared/ui.tsx :: RowLink`
- **Tipo:** RowLink
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `RowLink`
- **Surfaces:** 2

  - `GBL_SEARCH_002_RESULTS` → C03 (Buscar — con resultados (persona))
  - `GBL_SEARCH_004_MULTI_RESULT` → C02 (Buscar — resultados en varios grupos)

## NoticeRow

- **Clave:** `src/shared/ui.tsx :: RowStatic`
- **Tipo:** RowStatic con acciones
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `RowStatic`
- **Surfaces:** 4

  - `GBL_NOTIF_001_LIST_COACH_ALL_READ` → C01 (Avisos — lista sin pendientes (COACH))
  - `GBL_NOTIF_002_LIST_PLAYER_WITH_UNREAD` → C01 (Avisos — lista con un aviso sin leer (PLAYER))
  - `GBL_NOTIF_003_ALL_MARKED_READ` → C01 (Avisos — tras marcar todo como leído)
  - `GBL_SEARCH_004_MULTI_RESULT` → C03 (Buscar — resultados en varios grupos)

## TeamAssignmentRow (Sexta A)

- **Clave:** `src/shared/ui.tsx :: RowStatic (equipos vigentes)`
- **Tipo:** RowStatic
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `RowStatic (equipos vigentes)`
- **Surfaces:** 1

  - `MOR_PROFILE_003_PLAYER` → C01 (Mi perfil — jugadora)

## TeamAssignmentRow

- **Clave:** `src/shared/ui.tsx :: RowStatic (equipos)`
- **Tipo:** RowStatic
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `RowStatic (equipos)`
- **Surfaces:** 1

  - `MGT_PERSON_003_EQUIPOS` → C01 (Ficha de persona — Equipos)

## RoleRow (Administración)

- **Clave:** `src/shared/ui.tsx :: RowStatic (roles)`
- **Tipo:** RowStatic
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `RowStatic (roles)`
- **Surfaces:** 2

  - `MGT_PERSON_004_ROLES` → C01 (Ficha de persona — Roles)
  - `MOR_PROFILE_002_ADMIN` → C01 (Mi perfil — administración)

## SegmentedControl (Agenda / Mes)

- **Clave:** `src/shared/ui.tsx :: SegmentedControl`
- **Tipo:** div[role=group] con 2 botones
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `SegmentedControl`
- **Surfaces:** 1

  - `CAL_CALENDAR_001_AGENDA` → C02 (Calendario — vista Agenda)

## AudienceSegmentedControl

- **Clave:** `src/shared/ui.tsx :: SegmentedControl (audiencia del comunicado)`
- **Tipo:** SegmentedControl
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `SegmentedControl (audiencia del comunicado)`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_007_NEW_FORM` → C02 (Comunicado — alta)

## Filtro Equipo (Select)

- **Clave:** `src/shared/ui.tsx :: Select`
- **Tipo:** select con label
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Select`
- **Surfaces:** 1

  - `CAL_CALENDAR_001_AGENDA` → C03 (Calendario — vista Agenda)

## VenueSelect

- **Clave:** `src/shared/ui.tsx :: Select (id=field-venueId)`
- **Tipo:** Select
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Select (id=field-venueId)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_005_EDIT` → C03 (Edición de evento — formulario cargado)

## SeasonSelect

- **Clave:** `src/shared/ui.tsx :: Select (id=jn-seasonId)`
- **Tipo:** Select
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Select (id=jn-seasonId)`
- **Surfaces:** 1

  - `CAL_JORNADA_002_NEW` → C01 (Jornada — alta)

## PeriodSelect

- **Clave:** `src/shared/ui.tsx :: Select (periodo)`
- **Tipo:** Select
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Select (periodo)`
- **Surfaces:** 1

  - `MOR_REPORTS_006_ASISTENCIA_FILTERED` → C01 (Informes — asistencia filtrada por período)

## AudienceSheet

- **Clave:** `src/shared/ui.tsx :: Sheet`
- **Tipo:** section[role=dialog]
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Sheet`
- **Surfaces:** 2

  - `COM_ANNOUNCEMENT_002_AUDIENCE_SHEET` → C01 (Comunicado — hoja de audiencia)
  - `MOR_PROFILE_004_CONTACT_SHEET` → C01 (Mi perfil — hoja de edición de contacto)

## SheetBackdrop

- **Clave:** `src/shared/ui.tsx :: Sheet > div[aria-hidden]`
- **Tipo:** div absolute inset-0 bg-overlay
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Sheet > div[aria-hidden]`
- **Surfaces:** 1

  - `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` → C01 (Hoja lateral «Cambiar contraseña»)

## SheetFooter

- **Clave:** `src/shared/ui.tsx :: Sheet > div[footer]`
- **Tipo:** div flex
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Sheet > div[footer]`
- **Surfaces:** 1

  - `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` → C04 (Hoja lateral «Cambiar contraseña»)

## SheetPanel

- **Clave:** `src/shared/ui.tsx :: Sheet > section[role=dialog]`
- **Tipo:** section[role=dialog]
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Sheet > section[role=dialog]`
- **Surfaces:** 2

  - `CAL_EVENT_DETAIL_002_LIFECYCLE_SHEET` → C01 (Detalle de evento — hoja de ciclo de vida)
  - `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` → C02 (Hoja lateral «Cambiar contraseña»)

## StateBadge del evento

- **Clave:** `src/shared/ui.tsx :: StateBadge`
- **Tipo:** span con badge
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `StateBadge`
- **Surfaces:** 1

  - `CAL_CALENDAR_003_MONTH_EVENT_SELECTED` → C02 (Calendario — mes con evento seleccionado)

## StateBadge (Borrador)

- **Clave:** `src/shared/ui.tsx :: StateBadge value=announcement.state emphasis`
- **Tipo:** span badge emphasis
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `StateBadge value=announcement.state emphasis`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_005_DRAFT` → C01 (Comunicado — borrador)

## StateBadge (Borrador)

- **Clave:** `src/shared/ui.tsx :: StateBadge value=DRAFT emphasis`
- **Tipo:** span badge emphasis
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `StateBadge value=DRAFT emphasis`
- **Surfaces:** 1

  - `PRT_SELECTION_002_DRAFT` → C01 (Convocatoria — sin publicar)

## StateBadge (Postergado)

- **Clave:** `src/shared/ui.tsx :: StateBadge value=event.state emphasis`
- **Tipo:** span badge con emphasis
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `StateBadge value=event.state emphasis`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_008_POSTPONED` → C02 (Detalle de evento — Postponed (composición terminal))

## PendingStateBadge

- **Clave:** `src/shared/ui.tsx :: StateBadge value=person.account`
- **Tipo:** span badge
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `StateBadge value=person.account`
- **Surfaces:** 1

  - `MGT_PEOPLE_004_FILTER_ACCOUNT_PENDING` → C01 (Personas — filtro de cuenta pendiente)

## StateBadge (Publicado)

- **Clave:** `src/shared/ui.tsx :: StateBadge value=published===null?'DRAFT':'PUBLISHED' emphasis`
- **Tipo:** span badge emphasis
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `StateBadge value=published===null?'DRAFT':'PUBLISHED' emphasis`
- **Surfaces:** 1

  - `PRT_SELECTION_001_PUBLISHED` → C02 (Convocatoria — publicada)

## ChannelTabBar

- **Clave:** `src/shared/ui.tsx :: TabBar`
- **Tipo:** div[role=tablist] con 2 botones
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TabBar`
- **Surfaces:** 1

  - `COM_COMM_001_CONVERSACIONES` → C01 (Comunicación — pestaña Conversaciones)

## StructureTabBar

- **Clave:** `src/shared/ui.tsx :: TabBar (estructura)`
- **Tipo:** div[role=tablist] con 4 pestañas
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TabBar (estructura)`
- **Surfaces:** 1

  - `MGT_STRUCTURE_001_SEASONS` → C01 (Estructura — Temporadas)

## PersonAdminTabBar

- **Clave:** `src/shared/ui.tsx :: TabBar (ficha de persona)`
- **Tipo:** div[role=tablist] con 5 pestañas
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TabBar (ficha de persona)`
- **Surfaces:** 1

  - `MGT_PERSON_001_IDENTIDAD` → C01 (Ficha de persona — Identidad)

## QueryOnlyTag

- **Clave:** `src/shared/ui.tsx :: Tag (tone neutral, !isMine)`
- **Tipo:** Tag
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Tag (tone neutral, !isMine)`
- **Surfaces:** 1

  - `EQ_TEAM_DETAIL_005_QUERY_ONLY` → C01 (Detalle de equipo — sólo consulta (equipo visible, fuera de gestión))

## ExistingConversationTag

- **Clave:** `src/shared/ui.tsx :: Tag (tone neutral)`
- **Tipo:** Tag
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Tag (tone neutral)`
- **Surfaces:** 1

  - `COM_NEW_CONVERSATION_001_PICK` → C03 (Nuevo mensaje — selección de persona)

## ScopeTag («Tu alcance»)

- **Clave:** `src/shared/ui.tsx :: Tag tone=selected`
- **Tipo:** Tag
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Tag tone=selected`
- **Surfaces:** 1

  - `EQ_TEAMS_001_LIST_COACH` → C03 (Equipos — lista (COACH))

## ScopeTag («En tu alcance»)

- **Clave:** `src/shared/ui.tsx :: Tag tone=selected (isMine)`
- **Tipo:** Tag
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Tag tone=selected (isMine)`
- **Surfaces:** 1

  - `EQ_TEAM_DETAIL_001_EVENTOS` → C02 (Detalle de equipo — pestaña Eventos)

## CloseReasonTextArea

- **Clave:** `src/shared/ui.tsx :: TextArea (extra del ConfirmDialog)`
- **Tipo:** TextArea
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextArea (extra del ConfirmDialog)`
- **Surfaces:** 1

  - `PRT_ATTENDANCE_004_CLOSE_CONFIRM` → C02 (Asistencia — confirmación de cierre)

## AnnouncementBodyTextArea

- **Clave:** `src/shared/ui.tsx :: TextArea (id=af-body)`
- **Tipo:** TextArea rows=8
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextArea (id=af-body)`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_007_NEW_FORM` → C01 (Comunicado — alta)

## CorrectionReasonTextArea

- **Clave:** `src/shared/ui.tsx :: TextArea (id=af-reason)`
- **Tipo:** TextArea required rows=3
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextArea (id=af-reason)`
- **Surfaces:** 1

  - `COM_ANNOUNCEMENT_008_EDIT_FORM` → C02 (Comunicado — corrección de publicado)

## ReasonTextArea

- **Clave:** `src/shared/ui.tsx :: TextArea (requireReason)`
- **Tipo:** TextArea required
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextArea (requireReason)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_003_CANCEL_CONFIRM` → C03 (Detalle de evento — confirmación de cancelación)

## TitleTextField

- **Clave:** `src/shared/ui.tsx :: TextField`
- **Tipo:** TextField con Field
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField`
- **Surfaces:** 3

  - `CAL_EVENT_FORM_001_NEW` → C02 (Alta de evento — formulario vacío)
  - `COM_NEW_CONVERSATION_001_PICK` → C01 (Nuevo mensaje — selección de persona)
  - `COM_NEW_CONVERSATION_002_SEARCH` → C01 (Nuevo mensaje — búsqueda con resultado)

## ActivationCodeField

- **Clave:** `src/shared/ui.tsx :: TextField (código)`
- **Tipo:** TextField required
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField (código)`
- **Surfaces:** 1

  - `AUTH_ACTIVATE_001_DEFAULT` → C01 (Activar cuenta — formulario)

## EmailTextField

- **Clave:** `src/shared/ui.tsx :: TextField (email)`
- **Tipo:** TextField type=email required
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField (email)`
- **Surfaces:** 1

  - `AUTH_LOGIN_001_DEFAULT` → C02 (Acceso — formulario de login)

## AuditDateFilter

- **Clave:** `src/shared/ui.tsx :: TextField (id/from/to)`
- **Tipo:** TextField type=date
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField (id/from/to)`
- **Surfaces:** 1

  - `MGT_AUDIT_001_LIST` → C01 (Historial de cambios — listado)

## DniTextField

- **Clave:** `src/shared/ui.tsx :: TextField (id=cp-dni)`
- **Tipo:** TextField required
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField (id=cp-dni)`
- **Surfaces:** 1

  - `MGT_PEOPLE_005_NEW_FORM` → C01 (Personas — alta)

## OpponentTextField

- **Clave:** `src/shared/ui.tsx :: TextField (id=field-opponent)`
- **Tipo:** TextField required
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField (id=field-opponent)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_002_NEW_MATCH_TYPE` → C01 (Alta de evento — tipo «Partido» seleccionado)

## TitleTextField (con valor)

- **Clave:** `src/shared/ui.tsx :: TextField (id=field-title)`
- **Tipo:** TextField
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField (id=field-title)`
- **Surfaces:** 1

  - `CAL_EVENT_FORM_005_EDIT` → C02 (Edición de evento — formulario cargado)

## PeopleSearchField

- **Clave:** `src/shared/ui.tsx :: TextField (q)`
- **Tipo:** TextField
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField (q)`
- **Surfaces:** 1

  - `MGT_PEOPLE_001_LIST` → C01 (Personas — listado (ADMIN))

## PasswordField (actual)

- **Clave:** `src/shared/ui.tsx :: TextField / Field`
- **Tipo:** TextField
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `TextField / Field`
- **Surfaces:** 1

  - `GBL_OVERLAY_003_SHEET_CAMBIAR_CONTRASENA` → C03 (Hoja lateral «Cambiar contraseña»)

## Toast

- **Clave:** `src/shared/ui.tsx :: Toast`
- **Tipo:** div[role=status] fixed
- **Source file:** `src/shared/ui.tsx`
- **Source symbol:** `Toast`
- **Surfaces:** 2

  - `GBL_OVERLAY_004_TOAST_RESPUESTA_GUARDADA` → C01 (Toast de confirmación «Respuesta guardada.»)
  - `PRT_SELECTION_009_PUBLISH_TOAST` → C01 (Convocatoria — publicación confirmada (toast))

## VasControl (dentro del panel)

- **Clave:** `src/shared/vas.tsx :: VasControl`
- **Tipo:** RadioGroup de 3 opciones + estado de respuesta
- **Source file:** `src/shared/vas.tsx`
- **Source symbol:** `VasControl`
- **Surfaces:** 2

  - `CAL_CALENDAR_003_MONTH_EVENT_SELECTED` → C03 (Calendario — mes con evento seleccionado)
  - `PRT_AVAILABILITY_001_DEFAULT` → C02 (Disponibilidad — detalle de respuestas de un evento)

## VasControl bloqueado por estado

- **Clave:** `src/shared/vas.tsx :: VasControl (event.state !== 'SCHEDULED')`
- **Tipo:** p gei-meta
- **Source file:** `src/shared/vas.tsx`
- **Source symbol:** `VasControl (event.state !== 'SCHEDULED')`
- **Surfaces:** 1

  - `PRT_AVAILABILITY_003_POSTPONED` → C02 (Disponibilidad — evento postergado)

## VasControl editable

- **Clave:** `src/shared/vas.tsx :: VasControl (RadioGroup columns=3)`
- **Tipo:** RadioGroup de 3 opciones + estado «Tu respuesta»
- **Source file:** `src/shared/vas.tsx`
- **Source symbol:** `VasControl (RadioGroup columns=3)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_009_PLAYER_VIEW` → C02 (Detalle de evento — vista PLAYER (convocada))

## VasControl editable

- **Clave:** `src/shared/vas.tsx :: VasControl (RadioGroup)`
- **Tipo:** RadioGroup columns=3
- **Source file:** `src/shared/vas.tsx`
- **Source symbol:** `VasControl (RadioGroup)`
- **Surfaces:** 1

  - `PRT_AVAILABILITY_002_PLAYER_SELF` → C01 (Disponibilidad — vista PLAYER (respuesta propia editable))

## VasControl (sin selección)

- **Clave:** `src/shared/vas.tsx :: VasControl (value=null si NEEDS_RECONFIRMATION o NO_RESPONSE)`
- **Tipo:** RadioGroup
- **Source file:** `src/shared/vas.tsx`
- **Source symbol:** `VasControl (value=null si NEEDS_RECONFIRMATION o NO_RESPONSE)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM` → C02 (Detalle de evento — CAPTAIN con reconfirmación pendiente)

## ReconfirmationNotice

- **Clave:** `src/shared/vas.tsx :: VasControl (view === 'NEEDS_RECONFIRMATION' && ...)`
- **Tipo:** p con borde amber
- **Source file:** `src/shared/vas.tsx`
- **Source symbol:** `VasControl (view === 'NEEDS_RECONFIRMATION' && ...)`
- **Surfaces:** 1

  - `CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM` → C01 (Detalle de evento — CAPTAIN con reconfirmación pendiente)
