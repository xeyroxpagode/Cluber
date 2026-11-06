# GLOBAL STATES — GEI CURRENT UX ATLAS

Catálogo de los estados globales y por pantalla que existen hoy en GEI,
con la evidencia de dónde se producen. Estados que el código contempla pero
que no se pueden provocar desde la UI actual están marcados como
**IMPLEMENTED BUT NOT RUNTIME-REPRODUCIBLE**.

---

## 1. Estados de carga

### 1.1 Estado de carga de página

**NOT PRESENT IN CURRENT.** No existe skeleton, spinner de página ni estado
`isLoading` en ninguna pantalla. Los datos viven en memoria (`useState` con
`createSeed()`), por lo que no hay espera de red que mostrar. La única espera
real es la de las mutaciones.

### 1.2 Estado «busy» de una acción

Sí existe y es observable: el primitive `Button` acepta `busy` y en ese estado
renderiza un `Loader2` de 15 px con `animate-spin` y `motion-reduce:animate-none`,
y expone `aria-busy="true"`.

| Superficie | Botón busy | Duración de la espera |
| --- | --- | --- |
| Formulario de evento | «Guardar cambios» / «Crear evento» | `applyEventChange` es asíncrono |
| Convocatoria | «Publicar» del diálogo | `publishSelection` es asíncrono |
| Detalle de evento | «Restaurar el evento» | `transitionEvent` es asíncrono |
| Acta de partido | «Finalizar resultado» | `finalizeRecord` es asíncrono |
| Jornada | «Guardar jornada» | `updateJornada` es síncrono pero el botón pulsa `busy` |
| Comunicado | «Publicar comunicado» / «Guardar borrador» | `saveAnnouncement` es síncrono |

El store define `wait(duration = 380)` (`src/mock/store.tsx:32`) y lo usa en
las mutaciones asíncronas: ese es el delay mínimo que ve el usuario.

**MEDIDO:** el estado busy es visible durante ~380 ms. No hay skeleton ni
transición de opacidad asociada.

---

## 2. Estados vacíos

Todos implementados con el primitive `Empty`
(`src/shared/ui.tsx`): caja `rounded-surface border border-line bg-surface px-5 py-8`
centrada, ícono de 22 px en `text-ink-faint`, título en `gei-body-strong` y
detalle en `gei-meta` con `max-w-sm`.

| ID | Condición | Título |
| --- | --- | --- |
| `GBL_NOTIF_004_EMPTY_STATE` | actor sin avisos recibidos | «No tenés avisos» |
| `GBL_SEARCH_001_EMPTY` | búsqueda sin término | «Escribí algo para empezar» |
| `GBL_SEARCH_003_NO_RESULTS` | término sin coincidencias | «Nada para "{término}»» |
| `CAL_CALENDAR_005_FILTER_EMPTY` | agenda sin resultados por filtro | «Sin eventos con estos filtros» |
| `CAL_EVENT_DETAIL_013_NOT_FOUND` | id de evento inexistente | «Ese evento ya no está» |
| `CAL_EVENT_FORM_010_NO_AUTHORITY` | sin autoridad de edición | «No podés editar este evento» |
| `PRT_SELECTION_006_NO_AUTHORITY` | sin autoridad de convocatoria | «No administrás la convocatoria de este evento» |
| `PRT_ATTENDANCE_007_NO_AUTHORITY` | sin autoridad de asistencia | «No tomás la asistencia de este evento» |
| `PRT_MATCH_RECORD_006_NOT_A_MATCH` | evento que no es MATCH | «Este evento no tiene resultado» |
| `PRT_MATCH_RECORD_007_NO_AUTHORITY` | sin autoridad de acta | «No cargás el resultado de este partido» |
| `EQ_TEAM_DETAIL_008_NOT_FOUND` | id de equipo inexistente | «Ese equipo no está en tu alcance» |
| `EQ_PERSON_004_NOT_FOUND` | id de persona inexistente | «No encontramos a esa persona» |
| `COM_COMM_004_NO_CHAT_ADMIN` | actor sin `canChat` | «No tenés conversaciones habilitadas» |
| `COM_COMM_003_COMUNICADOS_SUBCOMMITTEE` | Subcomisión sin `canChat` | «No tenés conversaciones habilitadas» |
| `COM_CONVERSATION_001..004` | conversación no resuelta | «Esa conversación ya no existe» |
| `COM_ANNOUNCEMENT_006_NOT_REACHED` | fuera de la audiencia | «No te corresponde este comunicado» |
| `COM_ANNOUNCEMENT_009_NO_AUTHORITY_NEW` | sin autoridad de publicación | «Los comunicados los publica la Subcomisión» |
| `MGT_HOME_003_DENIED_COACH` | sin acceso a administración | «La administración es de administración» |
| `MGT_PEOPLE_003_FILTER_EMPTY` | sin coincidencias | «Sin resultados» |
| `MGT_PEOPLE_007_DENIED_COACH` | sin acceso a personas | «Las personas las administra el club» |
| `MGT_PERSON_010_NO_MEMBERSHIP` | sin pertenencia vigente | «Sin pertenencia vigente» |
| `MGT_PERSON_014_DENIED_SUBCOMMITTEE` | sin acceso a fichas | «No tenés acceso a las fichas de personas» |
| `MGT_STRUCTURE_004_VENUES` | sección de sedes vacía | «Nada activo en esta sección» |
| `MGT_STRUCTURE_007_DENIED_COACH` | sin acceso a estructura | «La estructura la administra el club» |
| `MGT_COMPETITIONS_007_DENIED_COACH` | sin acceso a competencias | «Las competencias no están en tu alcance» |
| `MGT_TEAM_002_NOT_FOUND` | id de equipo inexistente | «No encontramos ese equipo» |
| `MGT_AUDIT_002_EMPTY_RANGE` | rango de fechas sin movimientos | «No hay cambios en ese rango» |
| `MGT_AUDIT_003_DENIED_COACH` | sin acceso a auditoría | «El historial es de administración» |
| `MOR_REPORTS_004_FILTERED_EMPTY` | informes sin eventos | «Sin eventos en este período» |
| `MOR_REPORTS_005_NO_ACCESS_ADMIN` | sin alcance de informe | «No tenés informes disponibles» |
| `GBL_STATE_001_NOT_FOUND` | ruta desconocida | «Página no encontrada» |

### 2.1 Estados vacíos en línea (no con `Empty`)

| Superficie | Componente | Texto |
| --- | --- | --- |
| Inicio · bloque «Hoy» | div propio | «Hoy no hay eventos» |
| Inicio · bloque «Próximamente» | `p gei-meta` | «No hay eventos programados por delante…» |
| Inicio · bloque «Comunicaciones» | `p gei-meta` | «Todavía no hay conversaciones ni avisos.» |
| Detalle de equipo · «Eventos pasados» | `p gei-meta` | «Todavía no hay eventos pasados.» |
| Detalle de equipo · «Resultados» | `p gei-meta` | «Todavía no hay resultados finalizados.» |
| Ficha de persona · roles | `p gei-meta` | «No tiene roles deportivos vigentes.» |
| Ficha de persona · equipos | `p gei-meta` | «No tiene equipos vigentes.» |
| Perfil · pertenencia | `Banner tone=attention` | «No tenés una pertenencia vigente» |
| Convocatoria · revisiones | `p gei-meta` | «Todavía no se publicó ninguna convocatoria.» |
| Asistencia · correcciones | `p gei-meta` | «Todavía no hubo correcciones.» |
| Historial del acta | `p gei-meta` | «El acta nunca se corrigió.» |
| Competencias · jornadas / partidos | `p gei-meta` | «Ninguna jornada referencia a esta competencia.» / «Ningún partido referencia a esta competencia.» |
| Informe de rendimiento · resultados | `p gei-meta` | «Ningún evento del período tiene resultado finalizado.» |
| Informe de asistencia | `p gei-meta` | «No hay planillas de asistencia abiertas en este período.» |
| Ficha de persona · cambios | `p gei-meta` | «Todavía no hay cambios registrados.» |
| Jornada ·Sin organización (sin autoridad) | `Banner tone=neutral` | «Sólo lectura» |

---

## 3. Estados de error

| Tipo | Implementación | Ejemplos |
| --- | --- | --- |
| Error de autenticación | `Field` error del campo de correo | `AUTH_LOGIN_002_ERROR` |
| Error de código de activación | `Field` error | `AUTH_ACTIVATE_002_ERROR` |
| Error de validación de formulario | `Field` error por campo | `CAL_EVENT_FORM_004_NEW_VALIDATION_ERRORS`, `MGT_PEOPLE_006_NEW_VALIDATION` |
| Error de negocio (banner) | `Banner tone=danger` en la página | `CAL_EVENT_DETAIL` (`lifecycleError`), `MGT_STRUCTURE_007` (`error`), `MGT_COMPETITIONS_004` (`error`), `PRT_MATCH_RECORD_001` (`error`) |
| Error dentro de un diálogo | `Banner tone=danger` en el `extra` del ConfirmDialog | `MGT_PERSON_013_DISABLE_ACCOUNT_CONFIRM` (guardError) |
| Conflicto de versión | `Modal` de 3 columnas (baseline / local / latest) | `ConflictWorkspace` — **IMPLEMENTED BUT NOT RUNTIME-REPRODUCIBLE**: exige una mutación concurrente |
| Aviso de re-confirmación | `p` ámbar dentro del `VasControl` | `CAL_EVENT_DETAIL_010_CAPTAIN_RECONFIRM` |
| Aviso de conflicto de convocatoria | `Banner tone=attention` | `PRT_SELECTION_001` — **IMPLEMENTED BUT NOT RUNTIME-REPRODUCIBLE** con el seed actual: ningún publicado queda fuera de su equipo. Es reproducible sólo si se edita el evento y se le quitan los equipos destino |

---

## 4. Estados de autoridad / denegado

Implementados con `Empty` salvo indicación:

| Familia | Regla |
| --- | --- |
| `canOpen(page)` | controla la visibilidad de los destinos de navegación |
| `canManageSelection` | convocatoria: sólo entrenador del equipo o rol de alcance EVENT |
| `canManageAttendance` | asistencia: sólo entrenador del equipo |
| `canManageRecord` | acta: sólo entrenador **y** evento MATCH |
| `canRespondOwn` | disponibilidad: sólo rol PLAYER/CAPTAIN con pertenencia |
| `canViewDni` / `canViewBirth` | sólo ADMIN; en la ficha pública la fila no se renderiza |
| `canViewContact` | oculta el contacto con el texto «No disponible para tu rol» |
| `canManagePeople` | ficha administrativa de personas |
| `canManageStructure` | estructura del club |
| `canManageCompetitions` / `canViewCompetitions` | competencias |
| `canViewAudit` | historial de cambios |
| `canPublishAnnouncement` | alta y corrección de comunicados |

---

## 5. Estados de datos de dominio

| Estado | Dónde | Cómo se ve |
| --- | --- | --- |
| `SCHEDULED` | evento | badge «Programado» (tono selected) |
| `IN_PROGRESS` | evento | badge «En curso» (tono attention) |
| `COMPLETED` | evento | composición terminal: banner success + resultado final |
| `POSTPONED` | evento | composición terminal: banner warning «No hay horario vigente» |
| `CANCELLED` | evento | composición terminal: banner danger + botón «Restaurar el evento» |
| `ABANDONED` | evento | banner warning «El partido se suspendió antes de terminar» |
| `DRAFT` | evento / convocatoria / comunicado | badge neutral «Borrador» |
| `PUBLISHED` | convocatoria / comunicado | badge success «Publicado» |
| `ARCHIVED` | competencia / comunicado | banner neutral «Competencia archivada» |
| `ACTIVE` / `PENDING` / `DISABLED` | cuenta | badge success / warning / danger |
| `OPEN` / `CLOSED` | asistencia | badge «Abierta» / «Cerrada» |
| `FINAL` / `DRAFT` | acta | badge «Final» / «Borrador» |
| `NO_RESPONSE` | disponibilidad | badge neutral «Sin respuesta» |
| `NEEDS_RECONFIRMATION` | disponibilidad | badge attention «Hay que volver a confirmar» |
| `UNRECORDED` | asistencia | el texto de la fila dice «Sin registrar — no es lo mismo que ausente» |

---

## 6. Estados globales ausentes

| Estado | Situación actual |
| --- | --- |
| Offline / sin conexión | **NOT PRESENT IN CURRENT**: no hay listener de `navigator.onLine` ni banner de conexión |
| Error de red / servidor | **NOT PRESENT IN CURRENT**: el store es local, no hay try/catch de red |
| Sesión expirada | **NOT PRESENT IN CURRENT**: `authenticated` sólo cambia con `logout()` explícito |
| Reintento | **NOT PRESENT IN CURRENT** |
| Confirmación de descarte genérica | Sí: `ConfirmDialog` «¿Descartás los cambios?» en el formulario de evento |
| Estado «guardado» | **NOT PRESENT IN CURRENT**: el primitive `SavedState` está exportado pero no se renderiza en ninguna pantalla |
