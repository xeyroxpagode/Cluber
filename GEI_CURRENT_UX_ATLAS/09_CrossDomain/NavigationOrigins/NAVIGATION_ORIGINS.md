# NAVIGATION ORIGINS — GEI CURRENT UX ATLAS

Orígenes de navegación verificados en el producto actual: de dónde se llega a
cada superficie y qué se puede alcanzar desde cada punto de entrada.

Las capturas de cada trayecto están en `NavigationOrigins/`.

---

## 1. Destinos de la navegación principal

`src/app/Shell.tsx` · `NAV` + `visibleNav = NAV.filter(authority.canOpen(item.page))`

| Destino | Route | Ícono | Visible para |
| --- | --- | --- | --- |
| Inicio | `/home` | `House` | todos |
| Calendario | `/calendar` | `CalendarDays` | todos |
| Equipos | `/teams` | `Users` | actores con ≥1 equipo en su alcance |
| Comunicación | `/communication` | `MessageSquare` | actores con `canChat` (rol PLAYER/CAPTAIN/COACH + pertenencia) |
| Más | `/more` | `Ellipsis` | todos |

`sectionActive()` marca como activo el destino padre de una ruta hija:

| Destino | Hijos que lo activan |
| --- | --- |
| Calendario | `/events`, `/jornadas` |
| Comunicación | `/conversations`, `/announcements` |
| Más | `/management`, `/reports`, `/audit` |
| Equipos | `/people` |

---

## 2. Origen de cada superficie

| Superficie | Origen en la UI | ¿Hay enlace? |
| --- | --- | --- |
| `/home` | Destino «Inicio» | sí |
| `/calendar` | Destino «Calendario» | sí |
| `/calendar?view=month` | Control segmentado «Mes» | sí |
| `/calendar?event=…` | Click en un chip del mes o en una fila de la agenda | sí |
| `/calendar?team=…&type=…` | Selects «Equipo» y «Tipo» | sí |
| `/events/:id` | Fila de evento (agenda, equipo, informe, inicio, búsqueda) | sí |
| `/events/:id` → menú «Acciones» | Botón «Acciones» del encabezado | sí |
| `/events/:id` → Sheet de ciclo de vida | Menú → «Postergar» / «Cancelar evento» | sí |
| `/events/:id` → Modal de historial | Botón «Ver todo» de la sección «Historial» | sí |
| `/events/:id` → Modal de alcance de serie | Editar un evento de serie → «Guardar cambios» | sí |
| `/events/:id/edit` | Menú «Acciones» → «Editar evento» | sí |
| `/events/:id/availability` | — | **no**: la ruta existe pero ningún enlace la apunta |
| `/events/:id/selection` | Detalle de evento → «Operación pendiente» → «Convocadas» | sí |
| `/events/:id/attendance` | Detalle de evento → «Operación pendiente» → «Asistencia» | sí |
| `/events/:id/match-record` | Detalle de evento → «Operación pendiente» → «Resultado»; informe de rendimiento | sí |
| `/events/new` | — | **no**: no hay enlace de alta de evento en la UI actual |
| `/jornadas` | Destino «Calendario» → botón «Nueva jornada»; Más → sección «Jornadas» | sí |
| `/jornadas/:id` | Más → «Jornadas»; competencia → fila de jornada | sí |
| `/teams` | Destino «Equipos» | sí |
| `/teams/:id` | Fila de equipo | sí |
| `/teams/:id?tab=…` | Pestañas «Personas / Eventos / Resultados» | sí |
| `/people/:id` | Fila de persona (equipo o búsqueda) | sí |
| `/communication` | Destino «Comunicación» | sí |
| `/communication?tab=comunicados` | Pestaña «Comunicados» | sí |
| `/communication/conversations/new` | Botón «Nuevo mensaje» | sí |
| `/communication/announcements/new` | Botón «Publicar comunicado» (Subcomisión); detalle de evento → «Comunicar un cambio» | sí |
| `/conversations/:id` | Fila de conversación | sí (el destino muestra estado vacío: ver la ficha) |
| `/announcements/:id` | Fila de comunicado | sí |
| `/announcements/:id/edit` | Menú «Acciones» → «Corregir título o cuerpo» | sí |
| `/notifications` | Icono de campana del TopBar | sí |
| `/search` | Icono de buscar, ⌘K, o el link «Buscar» del TopBar | sí |
| `/more` | Destino «Más» | sí |
| `/more/profile` | Avatar del TopBar; Más → «Mi perfil» | sí |
| `/reports` | Más → «Informes» | sí |
| `/reports/attendance`, `/reports/performance` | Fila de informe | sí |
| `/audit` | Más → «Historial de cambios» | sí |
| `/management` | Más → «Personas» / «Estructura del club» / «Competencias» | sí |
| `/management/people` | Hub de administración → «Personas» | sí |
| `/management/people/new` | Personas → «Crear persona» | sí |
| `/management/people/:id` | Fila de persona | sí |
| `/management/structure` | Hub de administración → «Estructura del club» | sí |
| `/management/competitions` | Hub de administración → «Competencias»; Más → «Competencias» | sí |
| `/management/competitions/:id` | Fila de competencia | sí |
| `/management/teams/:id` | — | **no**: la ruta existe pero ningún enlace la apunta |
| `/login` | «Cerrar sesión» (perfil o sin acceso) | sí |
| `/activate` | — | **no**: la ruta existe pero ningún enlace la apunta |
| `/no-access` | Redirección del Shell cuando `hasAccess` es false | sí (automática) |
| `*` (404) | Ruta desconocida | — |

---

## 3. Atajos de teclado

| Atajo | Efecto | Source |
| --- | --- | --- |
| `Cmd/Ctrl + K` | navegar a `/search` | `src/app/Shell.tsx` (listener de `keydown` en `document`) |
| `Tab` desde el inicio | mostrar el enlace «Ir al contenido» | `src/app/Shell.tsx` |
| `←` / `→` sobre un `TabBar` | cambiar de pestaña y mover el foco | `src/shared/ui.tsx` · `TabBar` |
| `Enter` en el composer de mensaje | enviar el mensaje | `src/features/communication.tsx` |
| `Enter` en el formulario de búsqueda | enviar la búsqueda | `src/features/overview.tsx` |
| `Escape` en un overlay | cerrar (`Modal`, `Sheet`, `Menu`) | `src/shared/ui.tsx` |

---

## 4. Reglas de autoridad que condicionan la navegación

`src/mock/authority.ts` · `getAuthority().canOpen(page)`

| Page | Regla |
| --- | --- |
| home, calendar, search, notifications, more, profile | siempre |
| teams | `teamIds.length > 0` |
| communication | `canChat` |
| reports | `isSelfPlayer \|\| coachTeamIds.length > 0 \|\| official` |
| audit, management, structure, people | `admin` |
| competitions | `admin \|\| official` |
| announcements | `official` (Subcomisión) |

Reglas adicionales por actor:

| Regla | Efecto observable |
| --- | --- |
| `canManageSelection` = entrenador del equipo o rol de alcance EVENT | La Subcomisión **no** puede gestionar la convocatoria |
| `canManageAttendance` = entrenador del equipo | Sólo el entrenador toma asistencia |
| `canManageRecord` = entrenador **y** evento tipo MATCH | Sólo partidos |
| `canRespondOwn` = rol PLAYER/CAPTAIN con pertenencia vigente | El entrenador no responde su propia disponibilidad |
| `canViewDni` / `canViewBirth` = `admin` | Sólo el ADMIN ve documento y fecha de nacimiento |
| `canViewContact` = uno mismo, admin, official, o coach/captain del equipo actual de la persona | Restringe el contacto en la ficha pública |

---

## 5. Estado en la URL

Varias pantallas guardan su estado en la query string, de modo que el botón
atrás del navegador vuelve al mismo lugar:

| Pantalla | Parámetros |
| --- | --- |
| Calendario | `m` (mes), `view` (agenda/month), `team`, `type`, `event` |
| Detalle de equipo | `tab` (personas/eventos/resultados) |
| Ficha de persona (admin) | `section` (identidad/pertenencia/equipos/roles/cuenta) |
| Estructura | `tab` (SEASON/DIVISION/LINE/VENUE) |
| Personas (admin) | `q`, `team`, `role`, `account`, `profileStatus` |
| Informes | `team`, `period` |
| Historial | `from`, `to`, `actor` |
| Comunicación | `tab` (conversaciones/comunicados) |
| Búsqueda | `q` |

El `Shell` resetea el scroll a 0 en cada cambio de `pathname`
(`window.scrollTo({ top: 0 })`).

---

## 6. Trayectos capturados

En `NavigationOrigins/` están las capturas del antes y del después de cada
trayecto:

| ID | Trayecto | Pantalla de destino |
| --- | --- | --- |
| `XD_SEARCH_001_TO_PERSON` | Búsqueda → persona | `/people/p2` |
| `XD_SEARCH_002_TO_TEAM` | Búsqueda → equipo | `/teams/sexta` |
| `XD_SEARCH_003_TO_EVENT` | Búsqueda → evento | `/events/match-cuba` |
| `XD_NOTIF_001_TO_EVENT` | Aviso → objeto | `/announcements/a1` (el aviso n2 apunta al comunicado) |
| `XD_TEAM_001_TO_EVENT` | Equipo → evento | `/events/match-cuba` |
| `XD_EVENT_001_TO_CONVERSATION` | Evento → conversación | `/conversations/c-event-cuba` (estado vacío) |
| `XD_REPORT_001_TO_ATTENDANCE` | Informe → planilla | `/events/match-lomas/attendance` |
| `XD_HOME_001_TO_EVENT` | Inicio → evento | `/events/match-lomas` |
| `XD_CALENDAR_001_TO_EVENT` | Calendario → evento | `/events/training-serie-2` |
| `XD_COMPETITION_001_TO_JORNADA` | Competencia → jornada | `/jornadas/j1` |
