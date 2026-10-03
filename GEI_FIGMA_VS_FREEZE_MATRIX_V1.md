# GEI HOCKEY MANAGEMENT SYSTEM
## MATRIZ DE AUDITORÍA: FIGMA MAKE vs. SYSTEM / PRODUCT TRUTH FREEZE v1.0

Documento de matrices. Narrativa y razonamiento en `GEI_FIGMA_VS_FREEZE_AUDIT_V1.md`. Plan en `GEI_FIGMA_RECONSTRUCTION_PLAN_V1.md`.
**Freeze:** `C:\Users\thega\Downloads\GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1.md` (v1.0, 2.557 líneas)
**Repo:** `C:\Users\thega\Desktop\Gei-Hockey-Managment-System` — READ-ONLY

---

# M1. FREEZE ROUTE COVERAGE (38 rutas canónicas)

Leyenda de status: `PASS` · `PARTIAL` · `MISSING` · `CONTRADICTS_FREEZE` · `STATIC_ONLY` · `BROKEN`

| # | Ruta Freeze (§23) | Router | Screen | Navegable | Deep-link | Visual | Interacción | Mock conectado | Responsive | Status | Gap principal |
|--:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `/login` | ✅ | `LoginPage` | ✅ `/more`→Cerrar sesión, `/activate` | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Sin `sessionEpoch`; sin credenciales (§48/49/50) |
| 2 | `/activate` | ✅ | `ActivatePage` | ✅ desde `/login` | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Código literal compartido; sin 5-attempt TTL; sin `Account PENDING` en seed → sólo alcanzable tras crear persona (P2-21b) |
| 3 | `/no-access` | ✅ | `NoAccessPage` | ✅ auto-redirect | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | — (el escenario `session-interrupted` no produce UX de §73 → P2-25) |
| 4 | `/home` | ✅ | `Home` | ✅ nav | ✅ | ✅ | ✅ | ✅ | ✅ | **PARTIAL** | `today` congelado (P2-33b); badge `6A` y `· Sexta A` literales; link `/conversations/c2` literal (P2-28) |
| 5 | `/calendar` | ✅ | `Calendar` | ✅ nav | ✅ | ⚠️ | ✅ | ✅ | ✅ | **PARTIAL** | Legend dice warning para Club, el chip renderiza success (P2-34b); filtro fuera de URL (P2-18); "Hoy" hardcodea 2026-10 |
| 6 | `/search` | ✅ | `SearchPage` | ✅ header + ⌘K | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | No cubre Division/Line (§2) (P2-17); query fuera de URL (P2-18) |
| 7 | `/notifications` | ✅ | `Notifications` | ✅ bell | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Sin `notification_type`; 5 de 8 tipos §22 no distinguibles (P2-04); audiencia aproximada (P2-07) |
| 8 | `/more/profile` | ✅ | `ProfilePage` | ✅ sidebar, `/more` | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | **Password change = fake success (P0-4)**; sin step-up §52 (P2-24) |
| 9 | `/teams` | ✅ | `Teams` | ✅ nav | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | — |
| 10 | `/teams/:teamId` | ✅ | `TeamDetail` | ✅ desde `/teams` | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | **PARTIAL** | "Cuerpo técnico" hardcodeado (P2-21); sin tabs de roles/history |
| 11 | `/people/:personId` | ✅ | `PersonDetail` | ✅ TeamDetail, Search | ✅ | ⚠️ | ✅ | ✅ | ✅ | **PARTIAL** | Sin DNI/birth ✓ correcto; **ADMIN no ve phone/email** (§6 lo permite) (P2-36b); sin role history |
| 12 | `/events/new` | ✅ | `EventForm` | ✅ Home, Calendar | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Sin event targets plural (§10) (P1-03); sin EventSeries (P1-04); Logistics sólo MATCH (P2-40); sin `COMPETITION_SCOPE_MISMATCH` |
| 13 | `/events/:eventId` | ✅ | `EventDetail` | ✅ EventRow | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | **P0-5**: Alert de conflictos sin gate (fuga Eligibility a PLAYER); dirección de venue hardcodeada |
| 14 | `/events/:eventId/edit` | ✅ | `EventForm` | ✅ EventDetail | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | FLOW B completo. P2-06 (no remonta entre :eventId), P2-30 (impact incompleto) |
| 15 | `/events/:eventId/availability` | ✅ | `AvailabilityPage` | ✅ EventDetail | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | FLOW A completo. P1-01 (sin Guardians), P2-02/03 (version bump + history) |
| 16 | `/events/:eventId/selection` | ✅ | `SelectionPage` | ✅ EventDetail | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Sin estado CONFLICT §45 (P2-05); sin diff republish §22 (P2-04); P2-22 (bloquea publish vs. published-with-conflict) |
| 17 | `/events/:eventId/attendance` | ✅ | `AttendancePage` | ✅ EventDetail | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | **P0-2**: corrección borra historia. P2-08 (mark en COMPLETED), P2-09 (sin reopen) |
| 18 | `/events/:eventId/match-record` | ✅ | `MatchRecordPage` | ✅ EventDetail | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | **P0-3**: corrección borra historia. P2-31 (regla inventada `goals>score`) |
| 19 | `/jornadas/new` | ✅ | `JornadaPage` | ❌ **NINGÚN ENLACE** | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | P2-32 (inalcanzable); P2-33 (sin scope mismatch); temporada hardcodeada |
| 20 | `/jornadas/:jornadaId` | ✅ | `JornadaPage` | ✅ More→`/jornadas/j1`, EventDetail | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Bulk venue atómico ✅. Sin add/remove matches; sin §16 Team.season check; `MorePage` id literal (P3-12) |
| 21 | `/communication` | ✅ | `CommunicationHome` | ✅ nav | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | — |
| 22 | `/communication/conversations/new` | ✅ | `NewConversation` | ✅ (chat cap) | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Sólo DIRECT/GROUP (§20 tiene 4) (P2-10); selector restringido al team (P2-12); sin `joined_at`/`left_at` (P2-11) |
| 23 | `/communication/announcements/new` | ✅ | `AnnouncementForm` | ✅ (official) | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | FLOW I completo. P2-27 (`audience` string, no TeamSet) |
| 24 | `/announcements/:id` | ✅ | `AnnouncementDetail` | ✅ listas | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | P2-27b/c (ARCHIVED visible a SUBCOMMITTEE y legible por todos); P2-08b |
| 25 | `/announcements/:id/edit` | ✅ | `AnnouncementForm` | ✅ (official) | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | §21 COMPLIANT: audiencia inmutable en corrección, reason obligatorio |
| 26 | `/conversations/:id` | ✅ | `ConversationPage` | ✅ listas | ✅ | ✅ | ✅ | ✅ | ⚠️ | **PARTIAL** | FLOW F completo. P2-23 (`calc(100dvh-280px)` desborda en 390px) |
| 27 | `/management` | ✅ | `ManagementHome` | ✅ sidebar, `/more` | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Sin Team create (M-10); sin Membership (M-05); sin summary de accesos |
| 28 | `/management/structure` | ✅ | `StructurePage` | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | **P0-1** rename muta identidad de Team; **P0-6** rename de Venue sin §11; sin address/field_label/dates (M-13) |
| 29 | `/management/teams/:id` | ✅ | `TeamAdmin` | ✅ TeamDetail | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | **PARTIAL** | Toggle de estado ✅; fence de dependencias ✅; sin create/edit |
| 30 | `/management/people` | ✅ | `PeopleManagement` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | Filtra por `person.role` legacy (P2-01, P2-20) |
| 31 | `/management/people/new` | ✅ | `CreatePerson` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | DNI partial unique ✅; roster completeness alert ✅ |
| 32 | `/management/people/:id` | ✅ | `PersonAdminDetail` | ✅ lista | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Last-admin ✅, PLAYER_PROFILE_INCOMPLETE ✅, CAPTAIN no transferido ✅. **P1-02** (SUBCOMMITTEE sin eligibility), P1-07 (`Person.role` stale), P2-19, P2-26 |
| 33 | `/management/competitions` | ✅ | `CompetitionsPage` | ✅ ManagementHome, More | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | DRAFT/ACTIVE/CLOSED ✅, fence 0 active entries ✅. Sin ExternalReference (M-11) |
| 34 | `/management/competitions/:id` | ✅ | `CompetitionsPage` | ✅ lista | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | Entry PENDING/ACTIVE/ENDED ✅. `entries[].team` fusiona LINE y TEAM (P2-36); sin §16 scope mismatch |
| 35 | `/reports` | ✅ | `ReportsPage` | ✅ `/more` | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | ADMIN excluido ✓ §5 |
| 36 | `/reports/attendance` | ✅ | `ReportDetail` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | UNREGISTERED separado ✅; P2-34 (SUBCOMMITTEE defaultea a un team, no Club); P2-39 (0 filas sin empty) |
| 37 | `/reports/performance` | ✅ | `ReportDetail` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **PASS** | `matches_played` derivado de MatchRecord ✓ §15; set fijo ✓ §2 |
| 38 | `/audit` | ✅ | `AuditPage` | ✅ ManagementHome, `/more` | ✅ | ✅ | ⚠️ | ✅ | ✅ | **PARTIAL** | ADMIN-only ✓; read-only ✓. P3-07 (3 fechas hardcodeadas, filtro miente); sin before/after (P0-2/3 fix); `AuditEntry` sin resource type/id |

## M1.b Contadores de rutas

| Métrica | Valor |
|---|---|
| Rutas canónicas del Freeze | 38 |
| ** existent en el router** | **38 (100%)** |
| PASS | 16 (42%) |
| PARTIAL | 22 (58%) |
| MISSING | 0 |
| BROKEN | 0 |
| CONTRADICTS_FREEZE (a nivel de ruta) | 0 |
| STATIC_ONLY (a nivel de ruta) | 0 |
| Deep-link safe | 38/38 |
| Navegables desde UI | 37/38 (`/jornadas/new` inalcanzable) |
| Rutas EXTRA en el router | 3 (`/`, `/more`, `*`) |
| EXTRA justificables | 3/3 |

## M1.c Freeze: 38 declaradas vs. 45 declaradas-como-total

| Fuente | Cantidad |
|---|---|
| §23 lista explícita de rutas | **38** |
| §23 texto *"Canonical workflows/surfaces: 45"* | 45 |
| §77 *"canonical workflows/surfaces: 45/45"* | 45 |
| **Discrepancia interna del Freeze** | **7** |

Los 7 no declarados no son verificables contra el Freeze. **No se adaptó el Freeze** para cerrar la brecha.

---

# M2. WORKFLOW COVERAGE (10 flujos)

| Flujo | Clasificación | Archivos | State source | Acciones | Pantallas afectadas | Resultado verificado | Gap exacto |
|---|---|---|---|---|---|---|---|
| **A** Availability | **FULLY_INTERACTIVE** | `participation.tsx:39-180`<br>`store.tsx:117-141` | `event.availability[actorId] = {value, revision}` | `respond()` | EventDetail, Home, AvailabilityPage | ✅ Respuesta cambia; EventDetail recalcula `sí` sólo con `revision === event.revision`; Home detecta needs-reconfirmation | P1-01 sin Guardians · P2-02 bumpea `event.version` · P2-03 escribe en `event.history` · P2-15 roster en club event · P2-29 player sin respuesta no ve reconfirm |
| **B** Material Event Change | **FULLY_INTERACTIVE** | `events.tsx:716-1114`, `:629-714`<br>`store.tsx:164-208` | `eventChange(id, patch, op, expectedVersion)` | diff → Impact Preview → `eventChange` | EventForm, EventDetail, Calendar, Home, Availability, Notifications, Shell badge | ✅ **7 superficies traversed.** `revision++` → todas las Availability pasan a NEEDS_RECONFIRMATION → Notification → badge | P2-06 no remonta entre `:eventId` · P3-04 etiqueta "Partido-modified" hardcoded · P3-05 conteos del Impact derivan de conjuntos distintos · P2-30 impact sin `competition`/`clubWide` |
| **C** Selection | **PARTIALLY_INTERACTIVE** | `participation.tsx:182-509` | `event.selection` (draft)<br>`event.published` (immutable)<br>`event.selectionRevisions[]` | autosave 600ms · publish | SelectionPage, EventDetail, Home, Notifications | ✅ Las 5 cláusulas de §45 verificadas, incluida *"unsaved desired state goes directly in PublishSelection"* | P2-05 sin CONFLICT · P2-04 sin diff `selectedNow`/`removedNow` · P2-22 publish bloquea vs. published-with-conflict legal · P2-02 autosave bumpea version |
| **D** Attendance | **PARTIALLY_INTERACTIVE** | `participation.tsx:511-809` | `event.attendance[personId]`<br>`attendanceOpened/Closed` | open · mark · close · correct | AttendancePage, EventDetail, Home, Reports/attendance | ✅ **`Sin registrar` NO se convierte en `Ausente`** — verificado: `close()` sólo setea `attendanceClosed`. UNRECORDED por ausencia de row | **P0-2 corrección borra historia** · P2-08 mark en COMPLETED abierto · P2-09 sin reopen · `mark()` sin audit |
| **E** Match Record | **PARTIALLY_INTERACTIVE** | `participation.tsx:811-1128` | `event.record{state,status,gei,opponent,observations,stats}` | draft · finalize · correct | MatchRecordPage, EventDetail, Home, TeamDetail "Resultados", Reports/performance | ✅ **Played players NO derivan de Attendance** (checkboxes explícitos). PLAYED/FORFEIT→COMPLETED, ABANDONED→ABANDONED. `matches_played` derivado | **P0-3 corrección borra historia** · P2-31 regla inventada `goals > score` · P3-11 `record` local no resincroniza |
| **F** Communication | **FULLY_INTERACTIVE** | `communication.tsx:36-573` | `state.conversations[]`<br>`messages[]` nested | create DIRECT/GROUP · send · edit · delete | NewConversation, ConversationPage, CommunicationHome, Shell badge | ✅ **Par canónico DIRECT con reuse** (§20). Preview `messages.at(-1)` actualiza. Tombstone en delete. SENT→EDITED→DELETED | P2-10 sin TEAM/EVENT create · P2-11 sin `joined_at`/`left_at` · P2-12 selector restringido al team · P2-13 `unread` compartido · P2-23 altura del composer |
| **G** Notifications | **PARTIALLY_INTERACTIVE** | `communication.tsx:842-945`<br>`store.tsx:142-163`<br>`permissions.ts:24-32` | `state.notifications[]`<br>`readBy: string[]` | mark read · mark all | Notifications, Shell badge | ✅ §22 **parte negativa verificada**: 0 notificaciones por Availability, Attendance, Message o typo. Destinatarios correctos; ADMIN excluido de eventos | P2-04 sin `notification_type`; 5 de 8 tipos §22 no distinguibles · P2-07 audiencia aproximada · P2-16 Announcement notifica a todos · P2-03 sin clave lógica única §26 |
| **H** Management | **PARTIALLY_INTERACTIVE** | `management.tsx:301-1057` | `state.people[]`<br>`roleAssignments[]` | assign/move/end team · assign/end role · eligibility · account | PeopleManagement, PersonAdminDetail, TeamAdmin, StructurePage | ✅ §17 `MovePlayerTeam` atómico con **end CAPTAIN** y **no transferencia** · `PLAYER_PROFILE_INCOMPLETE` · §18 last-admin · DNI partial unique | P1-02 SUBCOMMITTEE sin eligibility · P1-07 `Person.role` stale en 6 pantallas · P2-19 guard no cubre EndMembership · P2-01/P2-20 filtro por scalar · P2-21 coach hardcodeado · P2-26 sin scope EVENT |
| **I** Announcement | **FULLY_INTERACTIVE** | `communication.tsx:575-841` | `state.announcements[]` | draft · publish · correct · archive | AnnouncementForm, AnnouncementDetail, CommunicationHome, Home, Notifications | ✅ §21 **audiencia publicada inmutable** con Alert explícito · reason obligatorio · **ADMIN bloqueado** de crear y de ver drafts (§5) · archivar no borra | P2-27 `audience` string no TeamSet · P2-16 audience ignorada al notificar · P2-27b/c ARCHIVED visible y legible · P2-08b corrección borra title/body |
| **J** Jornada | **PARTIALLY_INTERACTIVE** | `events.tsx:1116-1342` | `state.jornadas[]`<br>`events: string[]` | create + agrupar · bulk change venue | JornadaPage, EventDetail, More | ✅ §16 **bulk atómico** verificado: un `update()` con `structuredClone` muta N eventos; `revision++` → Availability de todas requiere reconfirmación; N notificaciones | P2-32 `/jornadas/new` inalcanzable · P2-33 sin `COMPETITION_SCOPE_MISMATCH` · temporada `"2026"` hardcodeada · sin add/remove de partidos · P3-12 id literal en MorePage |

## M2.b Contadores de workflows

| Clasificación | Flujos | % |
|---|---|---|
| FULLY_INTERACTIVE | 4 (A, B, F, I) | 40% |
| PARTIALLY_INTERACTIVE | 6 (C, D, E, G, H, J) | 60% |
| STATIC | 0 | 0% |
| BROKEN | 0 | 0% |
| MISSING | 0 | 0% |

## M2.c Propagación entre pantallas — verificado

| Cambio | Cadena verificada | Coherente |
|---|---|---|
| Material Event Change | EventForm → Impact → `eventChange` → EventDetail (hora + reconfirm Alert) → Calendar (chip) → Home (Próximamente + Atención) → Availability de todas (RECONFIRM) → Notification → badge Shell → /notifications | ✅ **7 superficies** |
| MatchRecord finalize | MatchRecordPage → EventDetail (badge score) → Home (desaparece "falta completar") → TeamDetail "Resultados" → Reports/performance | ✅ **5 superficies** |
| Selection publish | SelectionPage → EventDetail (row Convocatoria) → Notification | ✅ 3 |
| Attendance mark/close | AttendancePage → EventDetail (counts) → Home ("asistencia sigue abierta") → Reports/attendance | ✅ 4 |
| Announcement publish/archive | AnnouncementForm → AnnouncementDetail → CommunicationHome → Home (recientes) → Notification | ✅ 5 |
| Message send | ConversationPage → CommunicationHome (`messages.at(-1)`) → unread badge → Shell | ✅ 4 |
| Notification read | Notifications → `readBy` → badge Shell | ✅ 2 |
| Structure rename | StructurePage → `state.teams` + `state.events` → Teams/TeamDetail/EventDetail | ⚠️ **pero P0-1** (muta identidad) |
| Availability answer | AvailabilityPage → EventDetail (counts) → Home (attention) | ✅ 3 |
| **Role assignment** | PersonAdminDetail → `roleAssignments` → `hasRole` → capabilities | ❌ **`Person.role` stale en 6 pantallas** (P1-07) |
| **Team move** | PersonAdminDetail → `state.people[].team` → TeamAdmin/TeamDetail | ❌ **Home badge `6A` y Shell `· Sexta A` literales** (P2-33b) |
| **Attendance/Record correction** | Participation → audit con `reason` | ❌ **valores previos borrados; la UI afirma que se conservan** (P0-2, P0-3) |

---

# M3. STATE COVERAGE

Criterio: **no cuenta "podría renderizarse"**. Exige camino o datos reales que lo produzcan.

## M3.a Estados de UI

| Estado | Trigger mock | Componente/screen | Completo | Gap |
|---|---|---|---|---|
| **LOADING** | `?scenario=loading` | `Shell.tsx:54-59`, `:241-256` | ⚠️ | Skeleton del shell (3 cards), no del contenido. Ninguna pantalla skeletoniza sus datos (P2-38) |
| **EMPTY** | datos vacíos reales | `Empty` — **22 usos**: Home sin eventos, Calendar sin período, Communication sin conversaciones, Attendance sin abrir, Selection sin publicar, Conversation sin mensajes, Audit sin entradas, People sin resultados, 14 gates de acceso | ✅ | — |
| **ZERO** | agregado = 0 | `ReportDetail:672` → `"—"`; pie: *"Sin registros no se interpreta como cero actividad histórica"* | ⚠️ | Sólo en Reports. No hay estado ZERO explícito en el resto (P2-39) |
| **ERROR** | `?scenario=degraded\|stale\|impact-changed` + validación | `Alert tone="error"` — 12 sitios | ✅ | Copy §47: *"No pudimos actualizar la información. Tus cambios locales se conservan."* ✓ |
| **SAVING** | `pending` en 9 acciones | `<Saved saving/>` + "Guardando…/Publicando…/Cerrando…/Finalizando…" | ✅ | — |
| **SAVED** | post-mutación | `Saved` (**1 uso**), `saveState==="Guardado"`, toasts | ⚠️ | `Saved` subutilizado; SelectionPage reimplementa el status inline (P3-16) |
| **CONFLICT** | `?scenario=stale`, `?scenario=impact-changed` | `Alert` en `EventForm` modal + `events.tsx:1093-1108` | ❌ | **Mensaje sí, workspace no.** §73 pide baseline + localDraft + latestServer lado a lado (P1-06) |
| **OFFLINE/DEGRADED** | `?scenario=degraded` | `Shell.tsx:230-240` banner global | ⚠️ | Banner informativo; sin comportamiento degradado real. Aceptable en mock (P4-15) |

**Cobertura UI: 5 completos · 3 parciales · 0 ausentes**

## M3.b Estados de dominio

| Estado | En modelo | En seed | Por interacción | Visible | Trigger |
|---|---|---|---|---|---|
| **DRAFT** (Event) | ✅ `model.ts:2` | ❌ | ✅ | ✅ Badge `DRAFT` | EventForm "Guardar borrador" |
| **SCHEDULED** | ✅ | ✅ ×4 | ✅ | ✅ | Default del seed |
| **POSTPONED** | ✅ | ✅ ×1 | ✅ | ✅ Badge warning + "A definir" | Menú "Postergar" |
| **CANCELLED** | ✅ | ✅ ×1 | ✅ | ✅ Badge danger + `line-through` en calendario | Menú "Cancelar" |
| **IN_PROGRESS** | ✅ | ✅ ×1 | ✅ | ✅ "En curso" | Menú "Iniciar evento" |
| **COMPLETED** | ✅ | ✅ ×1 | ✅ | ✅ Badge success | Finalize MatchRecord / "Finalizar entrenamiento" |
| **ABANDONED** | ✅ | ❌ | ✅ | ✅ Badge "Abandonado" | MatchRecord status ABANDONED + Finalizar |
| **PUBLISHED** (Announcement) | ✅ | ✅ ×2 | ✅ | ✅ Badge success + Alerts | "Publicar" |
| **PUBLISHED** (Selection) | ✅ | ✅ ×1 | ✅ | ✅ Badge + `success Alert` | "Publicar convocatoria" |
| **DRAFT** (Announcement) | ✅ | ✅ ×1 | ✅ | ✅ Badge `DRAFT` sólo para official | "Guardar borrador" |
| **ARCHIVED** (Announcement) | ✅ | ❌ | ✅ | ⚠️ Badge sólo | "Archivar comunicado" — pero sigue en la lista de official (P2-27b) y legible por todos (P2-27c) |
| **ARCHIVED** (Team) | ✅ | ❌ | ✅ | ✅ Badge | `TeamAdmin` toggle |
| **Needs reconfirmation** | ✅ derivado | ✅ (`match-cuba` rev 2 vs resp rev 1) | ✅ | ✅ 5 superficies + Badge warning | `availability.revision !== event.revision` |
| **Eligibility conflict** | ✅ derivado | ✅ (`p4` BLOCKED en `published`) | ✅ | ✅ Alerts + Home | `eligibility !== ELIGIBLE` \|\| `team !== event.team` |
| **NO_RESPONSE** | ✅ derivado | ✅ (`p13`..`p14`) | ✅ | ✅ "Sin respuesta" | sin row en availability |
| **Unread** (Conversation) | ✅ | ✅ (`c1.unread=2`) | ✅ | ✅ Badge numérico | nuevo mensaje de otro |
| **Unread** (Notification) | ✅ `readBy` | ✅ (`n1`,`n2`) | ✅ | ✅ Dot + badge Shell + filtro | click / mark all |
| **Closed Attendance** | ✅ | ✅ (`match-sic`) | ✅ | ✅ Badge + `success Alert` + botón "Corregir" | "Cerrar asistencia" |
| **Unrecorded Attendance** | ✅ derivado | ✅ | ✅ | ✅ contador, columna propia en Report | `!attendance[id]` |
| **Final MatchRecord** | ✅ | ✅ (`match-sic`) | ✅ | ✅ Badge "Resultado final · 3 – 1" | "Finalizar resultado" |
| **Correction** (Attendance) | ✅ | ❌ | ✅ | ✅ `info Alert` + motivo obligatorio | "Corregir asistencia" |
| **Correction** (MatchRecord) | ✅ | ❌ | ✅ | ✅ `info Alert` + motivo obligatorio | "Corregir resultado" |
| **Correction** (Announcement) | ✅ | ❌ | ✅ | ✅ `info Alert` + audiencia disabled | Botón "Corregir" |
| **Account PENDING** | ✅ | ❌ | ✅ | ✅ Badge | "Crear acceso" / "Restablecer acceso" |
| **Account DISABLED** | ✅ | ❌ | ✅ | ✅ Badge + botón "Reactivar" | "Deshabilitar cuenta" |
| **Entry PENDING / ACTIVE / ENDED** | ✅ | ✅ ACTIVE | ✅ | ✅ Badge + botones | Crear / Activar / Finalizar inscripción |
| **Competition DRAFT / ACTIVE / CLOSED** | ✅ | ✅ ACTIVE | ✅ | ✅ Badge + botones | Crear / Activar / Cerrar (fence 0 active) |

**Cobertura de estados de dominio: 29/29 verificables — 100%.** Es el segundo punto fuerte del proyecto.

## M3.c Estados del catálogo de errores §38

| Error §38 | ¿Presente? | Dónde |
|---|---|---|
| `STALE_VERSION` | ✅ | `store.tsx:193-194` + `events.tsx:844-847` |
| `IMPACT_CHANGED` | ✅ | `?scenario=impact-changed` + copy exacto §37 |
| `PLAYER_PROFILE_INCOMPLETE` | ✅ (sin código) | `management.tsx:562-570` |
| `LAST_ADMIN_REQUIRED` | ✅ (sin código) | `management.tsx:546-550` |
| `SAVE_ERROR` (§45 Selection) | ✅ | `?scenario=save-error` |
| `CONFLICT` (§45 Selection) | ❌ | P2-05 |
| `INVALID_ROLE_SCOPE` | ❌ | Correcto por construcción: la UI no puede producir una combinación inválida |
| `COMPETITION_SCOPE_MISMATCH` | ❌ | P2-33 |
| `AUTHENTICATION_FAILED` | ⚠️ copy sí, sin código | `account-insight.tsx:279-282` |
| `SESSION_EXPIRED` | ⚠️ mal representado | `?scenario=session-interrupted` → parece cold boot (P2-25) |
| `REAUTHENTICATION_REQUIRED` | ❌ | P2-24 (sin step-up §52) |
| `IDEMPOTENCY_KEY_REUSED` | ❌ | Fuera de alcance visual |
| `MEMBERSHIP_HAS_ACTIVE_DEPENDENCIES` | ⚠️ represented como copy | `management.tsx:1029-1034` (dependencias de Team) |
| `STRUCTURE_HAS_ACTIVE_DEPENDENCIES` | ⚠️ copy | `management.tsx:227-233` |
| `EVENT_TARGET_INVALID` | ❌ | P1-03 |
| `MATCH_STATE_INCOMPATIBLE` | ⚠️ copy | `participation.tsx:341-345` (§12 "sólo con SCHEDULED") |
| `RECURRENCE_TOO_LARGE` | ❌ | P1-04 |
| `BULK_OPERATION_TOO_LARGE` | ❌ | Sin límite de 100 (§16) |
| `TEMPORARILY_UNAVAILABLE` | ⚠️ copy | `?scenario=degraded` |
| `CSRF_FAILED`, `INVALID_CURSOR`, `PAYLOAD_TOO_LARGE` | ❌ | Backend (§50, §35) |

**Cobertura §38: 3 plenos · 6 parciales (copy sin código) · 11 ausentes**

---

# M4. AUTHORITY COVERAGE (§5)

## M4.a Role scopes

| Role §5 | Scope válido §5 | Modelado | Gates con scope | Veredicto |
|---|---|---|---|---|
| PLAYER | TEAM | ✅ (`roleAssignments[].scope`) | ❌ `capabilities.availability` sin scope | ⚠️ |
| CAPTAIN | TEAM | ✅ (+ PLAYER derivado, `permissions.ts:8`) | ❌ `actor.role === "CAPTAIN"` (P2-35) | ⚠️ |
| COACH | TEAM / EVENT | ✅ ambos en `RoleAssignment.scope` | ✅ **`canOperateEvent` valida TEAM y EVENT** (`store.tsx:249-259`) | ✅ |
| SUBCOMMITTEE | CLUB | ✅ | ✅ `capabilities.official` | ✅ |
| ADMIN | CLUB | ✅ | ✅ `capabilities.management` | ✅ |

**17 de 21 filas de la Authority Matrix se cumplen.** El scope real se recupera correctamente en las 4 pantallas de participación, que es donde importa. `capabilities.sport` (boolean, sin scope) se usa como gate en 14 sitios, pero casi siempre combinado con `actor.team === event.team` en un gate externo, lo que salva la corrección.

## M4.b Authority Matrix §5 — verificación fila por fila

| Acción §5 | PLAYER | CAPTAIN | COACH | SUBCOMMITTEE | ADMIN | Evidencia | Veredicto |
|---|---|---|---|---|---|---|---|
| editar propio contacto | ✓ | ✓ | ✓ | ✓ | ✓ | `account-insight.tsx:123-132` | ⚠️ contacto OK; **password fake (P0-4)** |
| editar propio password | ✓ | ✓ | ✓ | ✓ | ✓ | `account-insight.tsx:107-122` | ❌ **valida pero no muta (P0-4)** |
| responder propia Availability | ✓ | ✓ | sólo si además PLAYER | sólo si además PLAYER | sólo si además PLAYER | `capabilities.availability = hasRole(PLAYER)`; CAPTAIN deriva PLAYER | ✅ **EXACTO** |
| **responder por menor** | delegación | delegación | delegación | delegación | delegación | grep `guardian` → **0** | ❌ **MISSING (P1-01)** |
| crear/editar Training | — | — | Team/Event | oficial autorizado | — | `EventForm` gate `sport \|\| official`; CLUB_EVENT filtrado a official | ✅ |
| crear Match | — | — | Team scope | Club scope | — | `EventForm`; team select filtrado a `official \|\| team.id===actor.team` | ✅ |
| postpone/reschedule/cancel Match | — | — | Team scope | Club scope | — | `canOperateEvent \|\| official`; `variant="danger"` en Cancelar | ✅ |
| Logistics | — | Team scope | Team/Event | Club scope | — | Lectura visible a todos; escritura vía EventForm gate | ✅ |
| **Selection** | — | — | Team/Event | — | — | `allowed = canOperateEvent && type===MATCH` | ✅ **EXACTO** |
| **Attendance** | — | — | Team/Event | — | — | `!canOperateEvent` → Empty | ✅ **EXACTO** |
| **MatchRecord/stats** | — | — | Team/Event | — | — | `!canOperateEvent` → Empty | ✅ **EXACTO** |
| **Announcement oficial** | — | — | — | Club | — | `!capabilities.official` → Empty | ✅ **EXACTO** |
| Direct/Group messages | ✓ | ✓ | ✓ | sólo con entitlement | sólo con entitlement | `capabilities.chat = COACH\|PLAYER\|CAPTAIN` | ✅ |
| Attendance report | propio | Team | Team | Club | — | `!capabilities.report` → Restricted; **ADMIN excluido** | ⚠️ scope SUBCOMMITTEE defectuoso (P2-34) |
| Performance report | propio | Team | Team | Club | — | ídem | ⚠️ ídem |
| Personas/cuentas/accesos | — | — | — | — | ✓ | `!capabilities.management` → Restricted | ✅ **EXACTO** |
| **Club structure** | — | — | — | — | ✓ | `StructurePage` gate management | ✅ **EXACTO** |
| Competitions/Entries | — | — | lectura | ✓ | ✓ | `if (!mutate && !capabilities.sport) → Restricted` | ✅ **EXACTO** |
| **Eligibility mutation** | — | — | lectura status | ✓ | ✓ | ADMIN ✓ en `PersonAdminDetail`; **SUBCOMMITTEE sin superficie** | ❌ **P1-02** |
| External refs | — | — | lectura | ✓ | ✓ | sin entidad | ❌ P2-36 |
| **Audit** | — | — | — | — | ✓ | `!capabilities.management` → Restricted | ✅ **EXACTO** |

**21 filas: 17 correctas · 2 parciales · 2 faltantes**

## M4.c Las 4 reglas explícitas de §5

| Regla | Veredicto | Evidencia |
|---|---|---|
| **ADMIN no es superusuario deportivo** | ✅ **CONFIRMADO** | `capabilities.sport=false` → Selection/Attendance/MatchRecord = Empty. `EventDetail` = "Evento no disponible" (admin.team=""). Sin botón "Crear evento". Sin link de Administration. |
| **CAPTAIN no hereda poder de Coach** | ✅ **CONFIRMADO** | `SelectionPage` → sólo vista publicada. `AttendancePage`/`MatchRecordPage` → Empty. `EventDetail` sin botón Editar ni menú ⋮. Puede: ver Availability del equipo (§6 read), ver contacto (§6), report de su team (§5), responder su Availability (deriva PLAYER). |
| **ADMIN no ve private conversations** | ✅ **CONFIRMADO** | `capabilities.chat` excluye ADMIN → tab y sección ocultas, `NewConversation` → Empty, `ConversationPage` → Empty. **Cero conversations con `admin` en la semilla.** `canReadNotice` además excluye ADMIN de notificaciones de evento. |
| **SUBCOMMITTEE no equivale a Coach** | ✅ CONFIRMADO (1 ambigüedad) | Sin Selection/Attendance/MatchRecord. Puede: crear Matches (Club), editar eventos, Announcement oficial, Competitions, Reports Club, ver availability de todo el club. **Ambigüedad:** `canOperateEvent` excluye `CLUB_EVENT` para todos (P3-14) — pero §5 no especifica "start/complete". |

## M4.d PII Field Authority §6

| Dato §6 | Visibility §6 | Dónde | Veredicto |
|---|---|---|---|
| nombre/apellido | scopes operacionales | universal | ✅ |
| username | self + ADMIN | `ProfilePage:163`, `PersonAdminDetail:845` | ✅ EXACTO — no aparece en PersonDetail |
| **DNI** | ADMIN | `management.tsx:675`, `:430`, `:476` | ✅ EXACTO — ausente de PersonDetail, Selection, Attendance, Reports |
| **birthDate completa** | ADMIN | `management.tsx:676`, `:443` | ✅ EXACTO |
| phone / email | self, ADMIN, COACH/CAPTAIN del Team | `PersonDetail:802-809` (gate: `sport \|\| CAPTAIN \|\| self`), `PersonAdminDetail:678`, `ProfilePage:165` | ⚠️ **ADMIN excluido de PersonDetail** (P2-36b) |
| **Guardian relationship** | guardian self + ADMIN; Coach sólo info operativa mínima | **AUSENTE** | ❌ P1-01 |
| **Eligibility status** | COACH scope + SUBCOMMITTEE + ADMIN | `TeamDetail:695` (gate), `SelectionPage:418` (**sin gate directo**, pero tabla tras gate de página), `EventDetail:280` (**SIN GATE**) | ❌ **P0-5** |
| **Eligibility reason/source** | SUBCOMMITTEE + ADMIN | `model.ts:27-28` declarados, **nunca asignados ni mostrados** | ❌ P1-02 |
| **Message body** | participants dentro de su período autorizado | `ConversationPage:344`, `CommunicationHome:42-44`, preview `messages.at(-1)` | ✅ EXACTO |
| **Audit sensitive data** | ADMIN con redacción | `AuditPage` gate ADMIN ✓; `reason` crudo **sin redacción** | ⚠️ P4-14 |

## M4.e Person Detail vs Person Admin Detail — separación

| Capacidad | `/people/:personId` | `/management/people/:id` | §6 |
|---|---|---|---|
| Gate | mismo team \|\| official \|\| self | ADMIN only | ✅ |
| DNI | ❌ | ✅ | ADMIN only ✓ |
| birthDate | ❌ | ✅ | ADMIN only ✓ |
| username | ❌ | ✅ | self+ADMIN ✓ |
| phone / email | ✅ (gate) | ✅ | ✅ |
| Eligibility status | `capabilities.sport` only | ✅ + selector | ✅ |
| Eligibility reason/source | ❌ | ❌ (campos muertos) | ❌ |
| Guardian | ❌ | ❌ | ❌ |
| TeamAssignment / Roles | ❌ | ✅ editable | ✅ |
| Membership | ❌ | ❌ (fusionado en `team`) | ❌ |
| Asignar/mover/finalizar equipo | ❌ | ✅ | ADMIN ✓ |
| Deshabilitar/Reactivar cuenta | ❌ | ✅ | ADMIN ✓ |
| Setup code | ❌ | ✅ | ADMIN ✓ |
| Last-admin guard | ❌ | ✅ | §18 ✓ |
| Audit entry por cambio | ❌ | ✅ | §71 ✓ |

**Veredicto: separación correcta y limpia.** Es lo que §6 exige entre perfil normal y perfil administrativo.

---

# M5. PII EXPOSURE SUMMARY

| Categoría | Cantidad | Detalle |
|---|---|---|
| Exposición **correcta** | 7 | DNI, birthDate, username, nombre, Message body, Team gates, Announcement gates |
| Exposición **dudosa** | 2 | Eligibility en `SelectionPage` (gate indirecto); Audit `reason` sin redacción |
| Exposición que **contradice** Freeze | 2 | **P0-5** (Eligibility a PLAYER en EventDetail) · **P2-36b** (ADMIN sin phone/email) |
| Campos PII **ausentes** | 3 | Guardian info · Eligibility reason · Eligibility source |
| **Fake success con PII** | 1 | **P0-4** (cambio de contraseña reporta éxito sin mutar) |

---

# M6. RESPONSIVE COVERAGE

## M6.a 390px (mobile)

| Superficie | Estado | Evidencia | Nota |
|---|---|---|---|
| Sidebar desktop | ✅ oculto | `Shell.tsx:84` `hidden lg:flex` | — |
| **Bottom nav mobile** | ✅ presente | `Shell.tsx:266-286` | 5 destinos, `pb-[env(safe-area-inset-bottom)]` |
| Clearance de bottom nav | ✅ | `Shell.tsx:229` `pb-28` | 112px > 64px de nav |
| Header sticky | ✅ | `Shell.tsx:178` `h-[65px] sticky top-0` | logo mobile, Search + Bell + Avatar |
| Home | ✅ 1 col | `overview.tsx:149-153` | aside sólo si `actor.team` |
| Calendar | ✅ agenda | `overview.tsx:507` `hidden md:block` en month grid | degradación correcta |
| Toggle Mes/Agenda | oculto | `overview.tsx:498` `hidden md:flex` | mobile fijo en agenda — correcto |
| Filtros Calendar | ✅ | `w-32` + `w-36` = 280px en ~350px | cabe |
| Selection tabla | ✅ | `:381` header `hidden sm:grid`; `:393` filas `flex flex-wrap` | stack, pierde alineación — aceptable |
| Attendance | ✅ | `:676` `flex flex-wrap justify-between` | — |
| MatchRecord | ⚠️ | `:1007` `grid-cols-[1fr_50px_55px_55px]` | 4 cols en ~310px; funciona con 1 dígito |
| Reports tabla | ✅ | `account-insight.tsx:618-619` `overflow-x-auto` + `min-w-[560px]` | scroll horizontal correcto |
| PeopleManagement | ✅ | `:378` header `hidden md:grid`; `:394` celdas `hidden md:block` | nombre + badge cuenta |
| Structure tabs | ✅ | `management.tsx:196` `overflow-x-auto` | — |
| PersonAdminDetail | ✅ | `:670` `xl:grid-cols-[1fr_320px]` | 1 col |
| Modales | ✅ | `ui.tsx:365` `items-end` → bottom sheet, `max-h-[90dvh]`, `rounded-t-2xl` | degradación correcta |
| Sticky action bars | ✅ | `bottom-20` en EventForm, Selection, Attendance, MatchRecord | 80px > 64px nav |
| **ConversationPage** | ❌ | `communication.tsx:386` `h-[calc(100dvh-280px)]` | cromo real ≈315px → composer bajo la nav (**P2-23**) |
| Toast | ✅ | `Shell.tsx:290` `bottom-24` | — |

## M6.b 768px (tablet)

| Superficie | Estado | Nota |
|---|---|---|
| Sidebar / bottom nav | bottom nav | `lg` = 1024px, consistente |
| Calendar | ✅ grilla de mes visible | `md:` activa el month grid |
| Toggle Mes/Agenda | ✅ visible | — |
| Home | 1 col; aside debajo | `xl` = 1280px |
| Selection | ✅ `sm:grid-cols-[1fr_180px_100px_80px]` en ~704px | cabe |
| Attendance / MatchRecord | ✅ | — |
| Reports | ✅ `min-w-[560px]` en 704px | cabe sin scroll |
| PeopleManagement | ✅ grilla completa | header visible |
| Management detail | 1 col | — |

## M6.c 1440px (desktop)

| Superficie | Estado | Nota |
|---|---|---|
| Sidebar | ✅ 224px + `lg:pl-[224px]` | emparejado |
| `main` | ✅ `max-w-[1440px]` `lg:px-10` | — |
| Home | ✅ `[minmax(0,1fr)_300px]` | `xl` activa |
| Selection / Attendance / MatchRecord | ✅ `max-w-4xl` | lectura, no aprovecha el ancho — decisión |
| ConversationPage | ✅ `max-w-4xl` | — |
| PersonAdminDetail | ✅ `[1fr_320px]` | — |
| Footer | ✅ visible `lg:flex` | — |
| Búsqueda | ✅ `⌘K` kbd visible `md:inline` | — |

## M6.d Fixed widths y overflow

| Ancho | Ubicación | Riesgo |
|---|---|---|
| `w-[224px]` + `lg:pl-[224px]` | Shell | ninguno — emparejado |
| `max-w-[1440px]` | Shell main | ninguno |
| `max-w-[2xl/3xl/4xl]` | 12 pantallas | ninguno |
| `min-w-[560px]` | Reports | ninguno — dentro de `overflow-x-auto` |
| `h-[420px]` min + `calc(100dvh-280px)` | ConversationPage | **SÍ (P2-23)** |
| `grid-cols-[1fr_50px_55px/...]` | MatchRecord, Selection | bajo — bounded por `max-w` del padre |
| `w-32` / `w-36` | Calendar filters | ninguno |
| `max-w-[85%]` / `sm:max-w-[70%]` | burbuja de mensaje | ninguno |
| `max-w-sm` | `PublicFrame` | ninguno |

- **Inline styles: 0.** Verificado por grep de `style={` sobre `src/`. ✅
- **Overflow verificado:** `overflow-x-auto` en `structure` tabs y `ReportDetail`; `overflow-y-auto` en `Modal` body, `ConversationPage` mensajes, `NewConversation` participantes.
- **Supuestos desktop-only: 0.**
- **Breakpoints ad-hoc: 0.** 4 breakpoints Tailwind por defecto, consistentes.

---

# M7. VISUAL SYSTEM

| Dimensión | Evaluación | Clasificación | Detalle |
|---|---|---|---|
| **Tokens / palette** | 17 variables semánticas en `:root` + `@theme inline`. Nombres no arbitrarios. 7 pasos de surface. | **KEEP** | `--color-danger-soft` en vez de `--red-100`. La mejor pieza del proyecto. |
| **Tokens incompletos** | Faltan spacing, typography, shadow, motion, z-index. Tailwind provee defaults que nadie controla. `--radius` declarado y nunca consumido. | **REBUILD** (parcial) | P4-03 |
| **Typography** | Escala 9/10/11/12/13/14/15/16/18/19/27px. Familia única (Inter variable). Jerarquía consistente. `tabular-nums` correcto en scores y contadores. | **POLISH** | 9px y 10px por debajo del mínimo cómodo (P4-01). §78 deja accesibilidad como EVIDENCE PENDING → no es violación. |
| **Spacing** | Escala Tailwind estándar consistente. | **KEEP** | `gap-2.5`/`gap-3.5` outliers (P4-04) |
| **Radii** | 4 niveles: `md` chips / `lg` controls / `xl` surfaces / `2xl` modales. Unificado. | **KEEP** | — |
| **Borders** | `border-border` en todo; `border-b` en listas. | **KEEP** | — |
| **Shadows** | Sólo 4: `shadow-sm` sticky bar, `shadow-lg` dropdown, `shadow-xl` toast, `shadow-2xl` modal. Consistente por patrón de uso. | **KEEP** | Ausencia de elevación sutil = decisión |
| **Icons** | `lucide-react` 100%. Cero SVG inline, cero duplicación. `aria-label` en todos los icon-only. | **KEEP** | 10 imports muertos a limpiar |
| **Surfaces** | `Surface` = `rounded-xl border border-border bg-card`, 60+ usos. | **KEEP** | — |
| **Listas** | `RowLink`/`EventRow` = un solo patrón en 20+ superficies. | **KEEP** | — |
| **Tablas responsive** | 4 tablas con el mismo grammar (`hidden sm:grid` header + filas con el mismo template). Degradan a stack sin duplicar markup. | **KEEP** | La solución correcta |
| **Tabs** | `border-b-2 border-primary` en 4 sitios, mismo grammar. | **KEEP** | — |
| **Forms** | `TextField`/`Select`/`TextArea` con label explícito, `disabled:bg-muted`. | **KEEP** (visual) | La lógica es REBUILD (RB-04) |
| **Responsive grammar** | 4 breakpoints, cero ad-hoc, cero inline styles, cero overflow. | **KEEP** | — |
| **Primary/secondary** | `Button` con 4 variants, `min-h-10` uniforme. | **KEEP** | — |
| **Destructive** | `danger` en `Cancelar evento` ✓. **Ausente** en "Archivar comunicado" y "Deshabilitar cuenta" (`ghost`). | **POLISH** | P4-06 |
| **Status presentation** | `Badge` con 4 tonos alineados a tokens. Coherente en toda la app. | **KEEP** (gramática) | El mapa de tonos es una lista de literales en un componente de presentación (P3-18) |
| **Empty/error states** | `Empty` (dashed border) + `Alert` (4 tonos, `role` correcto). 22 + 12 usos. | **KEEP** | `Empty` con icono siempre `CalendarDays` (P4-02) |
| **Modals** | Focus trap, Escape, scroll lock, focus restore, `aria-modal`, bottom sheet mobile. | **KEEP** | Por encima del promedio |
| **Iconografía de estado** | `Badge value="DRAFT"` + children "Cerrada" → color no corresponde al estado. 2 sitios. | **POLISH** | P4-07 |
| **Dropdowns** | Patrón repetido 4 veces, sin click-outside ni Escape. | **POLISH** | P4-05 — extraer a primitive |

## M7.b Clasificación del sistema visual

| | Entradas |
|---|---|
| **KEEP** | 13 (tokens, 17 primitives, `Modal`, shell nav, guards, jerarquía de Home, gramática de lista, tablas responsive, responsive grammar, icon system, acciones, `Alert`/`Empty`, write owner) |
| **POLISH** | 11 (type scale, `Empty` icon, `--radius`, gaps, dropdowns, destructivo, badge tone, legend calendar, reports empty, tokens faltantes, badge tone source) |
| **REBUILD** | 2 (token set completo · `Badge` tone map como fuente de verdad) |

---

# M8. CODE QUALITY / HANDOFF

| Dimensión | Métrica | Veredicto |
|---|---|---|
| Giant `App.tsx` | 109 líneas | ✅ **NO hay giant App.tsx.** Figma Make dividió por `features/` |
| God files | **6 archivos · 6.497 líneas · 34 screens**; peor: `account-insight.tsx` (784) mezcla auth+perfil+insight; `overview.tsx` (916) mezcla home+calendar+teams+people+search | ❌ **P3-04** |
| Route organization | 41 rutas en un array plano en `app/App.tsx`; sin `src/routes/`; sin `lazy()`; sin `errorElement` | ⚠️ **P3-05, P3-06** |
| Component boundaries | 17 primitives bien; pero `participation→events`, `account-insight→management`, `shared/ui→mock/store` | ❌ **P3-02** (§39: `routes → features → shared`) |
| Feature organization | ❌ 6 archivos planos, sin sub-organización por dominio | ❌ P3-05 |
| Design tokens centralizados | ✅ `theme.css` único | ✅ **KEEP** |
| Mock data centralizado | ✅ `seed.ts` único, `createSeed()` | ✅ **KEEP** |
| State centralizado | ✅ `store.tsx` único, `MockAppProvider`, `structuredClone` | ✅ patrón **KEEP**, implementación **REBUILD** |
| Datos hardcodeados duplicados | ❌ **11 literales** en 6+ archivos (§12.8): `2026-10-02` ×13, `Sexta A` ×3, `6A`, `Alvear 1240`, `Tomás Beltrán` ×2, `/people/coach`, `/conversations/c2`, `/jornadas/j1`, `2026` ×7, `GEI-2026-4812` ×2 | ❌ **P3-08, P2-21, P2-28, P2-33b** |
| Navegación duplicada | ✅ array `nav` único alimenta sidebar y bottom nav | ✅ **KEEP** |
| Status labels duplicados | ❌ **4 fuentes**: `labels` (`model.ts`), mapa de tonos de `Badge` (`ui.tsx`), strings de save-state (`participation.tsx`), `availabilityLabel()` (`model.ts`) | ❌ **P3-18** |
| Iconos duplicados | ✅ cero duplicación de glifo; 10 imports muertos | ⚠️ P3-08 |
| Inline styles | ✅ **0** (verificado) | ✅ |
| Dependencias innecesarias | 0. Faltan 3 exigidas por §39 | ⚠️ P3-10 |
| Dead code | **25 imports de valor** en 7 archivos; `tsconfig` sin `noUnusedLocals`; 2 campos muertos (`eligibilityReason`, `eligibilitySource`) | ❌ **P3-08, P3-03** |
| Rutas inalcanzables | 1: `/jornadas/new` | ❌ P2-32 |
| Imports rotos | ✅ **0** | ✅ |
| TypeScript | `strict` ✓, `noFallthroughCasesInSwitch` ✓. Faltan `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. ~30 `!` de `.find()` | ⚠️ |
| Dominio typing | ✅ **13/13 lifecycles tipados exactamente** según §9 | ✅ **KEEP** |
| Nomenclatura de dominio | ✅ canónica (Season/Division/Line/Team, Person, Availability/Selection/Attendance/Eligibility, Announcement/Conversation, MatchRecord, Jornada, Competition). ❌ 2 fusiones prohibidas (`Person.role`, `Person.team`); ❌ `event.history` es mini-History genérica que §71 prohíbe | ⚠️ P3-13 |
| Mock engine vs UI | ⚠️ `mock/` aislado (4 archivos, 933 líneas) ✓ pero `shared/ui` depende de `mock/store` y `features` importa presentacionales de `mock/model` | ❌ P3-02 |
| Tests | ❌ **0**. `package.json` sin script `test` | ❌ **P3-15** |
| **Git** | ❌ **NO EXISTE REPOSITORIO** | ❌ **riesgo de handoff #1** |

---

# M9. BACKEND CONTAMINATION

| Categoría | Encontrado | Clasificación |
|---|---|---|
| API server (Express/Fastify/Hono) | ❌ | — |
| `fetch` / XHR / axios | ❌ | — |
| Supabase / Firebase | ❌ | — |
| DB code / queries / migrations | ❌ | — |
| Auth infra (JWT/cookie/session) | ❌ | — |
| Cookies / sessions | ❌ | — |
| Workers / colas | ❌ | — |
| WebSocket / SSE / EventSource | ❌ en `src/` | — |
| `localStorage` / `sessionStorage` / `indexedDB` | ❌ | — |
| `document.cookie` | ❌ | — |
| Service workers / offline | ❌ | — |
| `crypto.subtle` | ❌ | — |
| `crypto.randomUUID()` | ✅ 6 usos | **HARMLESS** — ids mock |
| `process.env` | ✅ sólo `vite.config.ts` | **HARMLESS** — `FIGMA_PUBLIC_URL`, `FIGMA_DEV_SERVER_HOST`, `PORT`; build-time |
| WebSocket de Vite (`server.ws`) | ✅ sólo `vite.config.ts` | **HARMLESS** — HMR |

**VEREDICTO: 0 contaminación backend. Prototipo 100% visual/mock.**

---

# M10. FREEZE REVERSE AUDIT — CONTADORES

```
UNJUSTIFIED_ROUTES       = 0    (3 extra en el router: /, /more, * — los 3 justificables)
UNJUSTIFIED_FEATURES     = 4    (?demo= switcher, ?scenario= harness, credenciales demo
                                  en /login, código de activación literal en el bundle)
UNJUSTIFIED_STATES       = 5    ("RECONFIRM" cosmético, saveState strings sin CONFLICT,
                                  vocabulario libre de acciones/audit, Notice sin
                                  notification_type, Conversation.unread como estado)
UNJUSTIFIED_ROLES        = 0    ✓ los 5 exactos de §5, Guardian correctamente NO es rol
UNJUSTIFIED_ENTITIES     = 9    (Person.role, Person.team, eligibility enum plano,
                                  StructureItem array heterogéneo, Notice.read global,
                                  Conversation.unread, entry.reference string,
                                  entry.team fusionando LINE+TEAM, announcement.audience string,
                                  AuditEntry sin resource type/id)
FREEZE_CONTRADICTIONS    = 6    (P0-1 … P0-6)
```

## M10.a Lo que Figma Make **NO** inventó (hallazgo positivo)

| Categoría §81 / §3 | Veredicto |
|---|---|
| Rutas extra | 3, todas justificables |
| Roles extra | **0** |
| Estados de dominio extra | **0** — los 13 lifecycles de §9 están exactamente |
| Entidades extra de negocio | 0; las 9 son simplificaciones de mock, no extrapolaciones |
| Notification classes extra | 0 (el problema es que faltan, no que sobren) |
| **"Categoría" como entidad central** | ✅ **AUSENTE** (§75 COMPLIANT) |
| **Generic dashboard feature** | ✅ AUSENTE |
| **Fake analytics** | ✅ AUSENTE — los Report son agregados honestos del mock state |
| **OAuth / Google / Microsoft** | ✅ AUSENTE (§3 OUT) |
| **Forgot-password self-service** | ✅ AUSENTE (§3 OUT) |
| **Payments / cuotas** | ✅ AUSENTE (§3 OUT) |
| **Inventory** | ✅ AUSENTE (§3 OUT) |
| **Medical records** | ✅ AUSENTE — sólo status operacional (§3 BOUNDARY) |
| **Venue booking** | ✅ AUSENTE (§3 OUT) |
| **Scouting** | ✅ AUSENTE (§3 OUT) |
| **Offline-first / sync** | ✅ AUSENTE (§3 OUT) |
| **Redis / WebSocket / microservicios** | ✅ AUSENTE (§3 OUT) |

**Las 9 cosas OUT de §3 están respetadas. Las 7 prohibiciones de §81 no se violan.**

## M10.b Las 4 features no justificadas (detalle)

| Feature | Ubicación | Por qué no | Acción |
|---|---|---|---|
| `?demo=` actor switcher | `store.tsx:69-80` | §81 prohíbe *"new product scope"*. Lee `location.search` en el provider | Flag `import.meta.env.DEV` o eliminar antes de entregar |
| `?scenario=` harness | `scenarios.ts:1-2` | Los **estados** están justificados (§38, §24); el **mecanismo** no. `session-interrupted` además no representa §73 | Mismo flag |
| Credenciales demo en `/login` | `account-insight.tsx:335-344` | §48 opaque session. Un `<details>` con 4 usernames en producción | Eliminar o condicionar |
| Código de activación literal | `management.tsx:657` + `account-insight.tsx:391` | §51: HMAC digest con `SETUP_TOKEN_KEY`, **nunca en cliente**. Secreto compartido en el bundle | Generar en el mutador, no comparar contra literal |

---

# M11. SEVERITY COUNTS

| Severidad | Definición | Count |
|---|---|---|
| **P0** | PRODUCT CONTRADICTION — el código viola Product Truth | **6** |
| **P1** | MISSING CORE FLOW — parte crítica inexistente/rota | **10** |
| **P2** | STATE/INTERACTION GAP — screen existe, workflow incompleto | **34** |
| **P3** | STRUCTURAL DEBT — dificultará continuar | **15** |
| **P4** | VISUAL POLISH — no bloquea | **10** |
| | **TOTAL** | **75** |

## M11.a P0 detail

| ID | Resumen | Freeze | Evidencia |
|---|---|---|---|
| P0-1 | Rename División/Línea muta identidad de Team | §26 `Identity immutable`, §10, §75 | `management.tsx:154-167` |
| P0-2 | Corrección de Attendance borra el registro anterior | §75, §71, §12 | `participation.tsx:739-744` |
| P0-3 | Corrección de MatchRecord borra el resultado anterior | §15, §71, §75 | `participation.tsx:877-901` |
| P0-4 | Cambio de contraseña: fake success | §24 `no fake success`, §47 | `account-insight.tsx:123-139` |
| P0-5 | Alert de Eligibility visible a PLAYER | §6, §24 `unauthorized oculto` | `events.tsx:305-310` |
| P0-6 | Rename de Venue sin efectos de cambio material | §11 | `management.tsx:150-153` |

**5 de 6 se resuelven con código. 1 (P0-6) requiere decisión explícita contra el Freeze.**

## M11.b P1 detail

| ID | Resumen | Freeze | Evidencia |
|---|---|---|---|
| P1-01 | GuardianRelationship ausente → sin "responder por menor" | §1.2, §3, §5, §17, §20, §25, §53 | grep `guardian` → 0 |
| P1-02 | SUBCOMMITTEE sin superficie de Eligibility; scope/source/reason ausentes | §5, §6, §13 | `management.tsx:527`; `model.ts:27-28` |
| P1-03 | Event targets no representables (ni multi-team ni personas) | §10, §25 t21-22 | `model.ts:51,66` |
| P1-04 | EventSeries / recurrencia ausente | §3, §9, §25 t16-18/23, §36 | grep `series\|recurr` → 0 |
| P1-05 | Membership ausente (fusionado en `Person.team`) | §8, §17, §25 t3 | `model.ts:17` |
| P1-06 | No hay Conflict Workspace | §44, §73 | `events.tsx:1093-1108` |
| P1-07 | `Person.role` stale → cadena de propagación rota en 6 pantallas | §5 `Multi-role` | `management.tsx:627-644` |
| P1-08 | Sin capa de forms (RHF + Zod) | §39, §44 | `package.json` |
| P1-09 | Sin capa de query (TanStack Query, sessionEpoch) | §39, §41, §42, §43 | `package.json` |
| P1-10 | Tailwind es la dependencia de estilos arquitectónica | §39 (prohibición) | `package.json`, `index.css` |

## M11.c Manifests — conteos

| Manifest | Entradas | IDs |
|---|---|---|
| **KEEP** | **13** | K-01 … K-13 |
| **FIX** | **26** | F-01 … F-26 |
| **MISSING** | **14** | M-01 … M-14 |
| **REBUILD** | **6** | RB-01 … RB-06 |
| **Total** | **59** | — |

## M11.d Los 6 P0 cubiertos por los manifests

| P0 | Manifest | Entry |
|---|---|---|
| P0-1 | **FIX** | F-03 |
| P0-2 | **FIX** | F-02 |
| P0-3 | **FIX** | F-02 |
| P0-4 | **FIX** | F-04 |
| P0-5 | **FIX** | F-01 |
| P0-6 | **FIX** | F-05 (requiere decisión) |

**Ningún P0 cae en MISSING ni REBUILD.** Los 6 contradicciones son correcciones localizadas sobre código que existe y está en la dirección correcta.

---

# M12. CONSISTENCY CHECKS — respuestas puntuales

| Pregunta | Respuesta |
|---|---|
| ¿Hay datos hardcoded por pantalla? | **NO.** Hay un `State` compartido con `createSeed()` único y un write owner único. La única "duplicación" son 11 literales de presentation (no datos). |
| ¿El estado común propaga entre pantallas? | **SÍ**, en 9 de 12 cadenas verificadas. Las 3 rotas: `Person.role` (P1-07), `Person.team`→Home/Shell (P2-33b), e historia tras correcciones (P0-2/P0-3). |
| ¿Rutas deep-link safe? | **38/38.** Cada ruta renderiza en cold load con el actor por defecto y aplica sus gates. No hay estado en memoria que se pierda. |
| ¿Cuántas rutas son inalcanzables? | **1**: `/jornadas/new` (P2-32). |
| ¿Aparecen东西 que "aparentan funcionar" pero son estáticas? | **5**: cambio de contraseña (P0-4), la arquitectura de autoridad completa (§40), `/jornadas/new`, "Cuerpo técnico" de TeamDetail, y los literales `6A`/`· Sexta A`. |
| ¿Falta algo de §3 IN? | **Sí**: GuardianRelationship, EventSeries, EventSeries targets, Event targets plural, Membership, ExternalReference, Venue address/field_label, Season dates, Team create, Event logistics como dominio (aplanado), Coordination revision visible. |
| ¿Sobró algo de §3 OUT? | **NO.** Las 9 cosas OUT respetadas. |
| ¿Se adaptationó el Freeze al código? | **NO.** Los 6 P0 están a favor del Freeze. La discrepancia 38-vs-45 se reporta como discrepancy del Freeze, no se ajustó. |

---

# M13. TOP 10 NEXT ACTIONS (resumen; plan completo en `GEI_FIGMA_RECONSTRUCTION_PLAN_V1.md`)

| # | Acción | Por qué primero |
|---|---|---|
| 1 | `git init` + primer commit del estado actual | Sin baseline no se puede distinguir un cambio propio de uno preexistente. **Precondición de todo lo demás.** |
| 2 | Resolver **P1-10** (Tailwind vs CSS Modules): migrar, o emitir revisión v1.0.1 del Freeze que lo acepte | §39 es FROZEN y prohíbe Tailwind. Si se migra, **afecta los 34 screens** y debe preceder a todo. Es la decisión de mayor impacto en alcance. |
| 3 | Resolver **P0-6** (¿el rename de Venue es material?) y **P1-01**/**P1-02** (superficies de Guardian y Eligibility) | 3 decisiones de producto. No se pueden codificar sin ellas. |
| 4 | **P0-5**: gatear el Alert de conflictos (1 línea) | Fix de 1 línea que cierra una fuga de PII. Coste/ratio más alto de la lista. |
| 5 | **P0-2 + P0-3**: extender `AuditEntry` con `before`/`after` y pasarlos en los 3 flujos de corrección | Cierra 2 contradicciones de Product Truth y hace que el copy de la app sea cierto. |
| 6 | **P0-1**: dejar de propagar el rename de División/Línea a Teams | Cierra la tercera contradicción. 14 líneas a borrar. |
| 7**SLICE 2** | Añadir `@tanstack/react-query`, `react-hook-form`, `zod`; `noUnusedLocals`; test runner; `errorElement`; `src/routes/` | Foundation. Habilita P1-06, P1-08, P1-09 y da red de seguridad para las slices siguientes. |
| 8 | Eliminar los **11 literales** que mienten (§12.8) y extraer `today` a un reloj | Mecánico, bajo riesgo, y elimina la mitad de los P2 + un P3. |
| 9 | **F-23** + **M-07**: `getAllowedActions({role, scope, target, objectState, fieldAuthority, source})` | La fórmula exacta de §5. El `canOperateEvent` actual es el seed del pattern. Habilita PII gating correcto y elimina 14 gates fragile. |
| 10 | **M-03 + M-05**: `event_target_teams[]` + `event_target_persons[]` + `Membership` separado de `TeamAssignment` | Desbloquea §10 y §17, que son invariantes que hoy no se pueden representar. |

---

**Fin de la matriz. Ningún archivo de código fue modificado.**





