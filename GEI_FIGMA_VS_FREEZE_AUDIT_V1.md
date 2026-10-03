# GEI HOCKEY MANAGEMENT SYSTEM
## AUDITORÍA READ-ONLY: FIGMA MAKE vs. SYSTEM / PRODUCT TRUTH FREEZE v1.0

**Modo:** READ-ONLY. Ningún archivo de código fue modificado.
**Fecha de auditoría:** 2026-10-02
**Autoridad única:** `C:\Users\thega\Downloads\GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1.md` (GEI SYSTEM / PRODUCT TRUTH FREEZE v1.0, 2.557 líneas, 48.805 bytes)
**Repo auditado:** `C:\Users\thega\Desktop\Gei-Hockey-Managment-System`

---

# 1. EXECUTIVE SUMMARY

Figma Make produjo un **prototipo visual unexpectedly competente**: 38/38 rutas canónicas del Freeze existen, hay un motor de estado mock **real y compartido** (no datos hardcodeados por pantalla), y 4 de los 10 flujos auditados son completamente interactivos de punta a punta con propagación coherente entre múltiples pantallas.

La sorpresa más importante de la auditoría es que **la capa de autoridad visual es más correcta que la capa de dominio**. Los cinco roles se comportan bien: ADMIN no es Coach universal, CAPTAIN no hereda poderes de Coach, ADMIN no ve conversaciones privadas, PLAYER responde su propia Availability, SUBCOMMITTEE no tiene Attendance. Eso es difícil de lograr por accidente y está bien resuelto.

El problema real está en otro lugar: **el modelo de datos mock es una simplificación que choca con invariantes explícitos del Freeze**. Renombrar una División o Línea muta la identidad del Team. Las correcciones de Attendance y MatchRecord sobrescriben los valores anteriores y por lo tanto destruyen historia. La aplicación está congelada en el 2 de octubre de 2026 en cinco lugares distintos. Y la capa de formularios no existe como capa.

**Veredicto:** la base visual y de navegación es **KEEP** y no debe destruirse. El motor de estado mock es **KEEP** con salvedades. El modelo de dominio, la capa de autoridad y la capa de formularios son **REBUILD**.

## 1.1 Cifras de cobertura

| Métrica | Resultado |
|---|---|
| Rutas canónicas del Freeze existentes | **38 / 38 (100%)** |
| Rutas con status PASS | 16 (42%) |
| Rutas con status PARTIAL | 22 (58%) |
| Rutas MISSING / BROKEN | 0 / 0 |
| Rutas EXTRA en el router | 3 (todas justificables) |
| Rutas deep-link safe | 38 / 38 |
| Flujos FULLY_INTERACTIVE | 4 / 10 (A, B, F, I) |
| Flujos PARTIALLY_INTERACTIVE | 6 / 10 (C, D, E, G, H, J) |
| Flujos STATIC / BROKEN / MISSING | 0 / 0 / 0 |
| Roles Freeze representados | 5 / 5 |
| Dominios Freeze representados | 9 / 11 (faltan GuardianRelationship, EventSeries) |
| Entidades Freeze presentes en el modelo | ~17 / 45 |
| Hallazgos P0 | 6 |
| Hallazgos P1 | 10 |
| Hallazgos P2 | 34 |
| Hallazgos P3 | 14 |
| Hallazgos P4 | 8 |
| Contaminación backend | **0 (limpio)** |

## 1.2 Los 6 P0 — contradicciones directas de Product Truth

| # | Hallazgo | Freeze violado | Evidencia |
|---|---|---|---|
| P0-1 | Renombrar División/Línea reescribe `teams.division`, `teams.line` y `teams.name` | §26 `teams: Identity immutable` + unique(season,division,line); §10 `concrete Team inmutable una vez Scheduled`; §75 Core invariants | `src/features/management.tsx:154-167` |
| P0-2 | La corrección de Attendance **sobrescribe el mapa completo**, borrando los valores previos | §75 `meaningful history is not hard-deleted`; §71 History sources: Attendance tables + Audit corrections | `src/features/participation.tsx:739-744` |
| P0-3 | La corrección de MatchRecord **sobrescribe el record**, borrando valores previos | §15 `FINAL sólo se corrige explícitamente`; §71 MatchRecord/Stats; §75 | `src/features/participation.tsx:877-901` |
| P0-4 | "Cambiar contraseña" reporta éxito sin ninguna mutación de estado | §24 `no fake success`; §47 `No optimistic confirmed success` | `src/features/account-insight.tsx:123-139` |
| P0-5 | El Alert de conflictos de convocatoria (derivado de Eligibility) se renderiza **sin control de autoridad**; un PLAYER lo ve | §6 `Eligibility status: COACH scope + SUBCOMMITTEE + ADMIN` | `src/features/events.tsx:305-310` |
| P0-6 | Renombrar una Sede reescribe `event.venue` de todos los eventos **sin Impact Preview, sin `coordination_revision++` y sin Notification** | §11 `Venue` es cambio material; efectos obligatorios | `src/features/management.tsx:150-153` |

## 1.3 Lo que hay que conservar

La capa visual es sólida y **no debe perderse**. En concreto:

- `src/styles/theme.css` — tokens semánticos centralizados.
- `src/shared/ui.tsx` — 17 primitives con API consistente.
- `src/app/Shell.tsx` — sidebar + bottom nav exponiendo los mismos destinos (§40 compliant).
- Jerarquía de Home (§24 `WHAT MATTERS NOW` primero).
- `Modal` con focus trap, Escape, scroll lock y restauración de foco.
- Flujos B (Material Event Change) e I (Announcement) — la referencia de calidad del proyecto.

---

# 2. FASE 0 — PREFLIGHT

## 2.1 Ubicación verificada

```
Working directory : C:\Users\thega\Desktop\Gei-Hockey-Managment-System   OK
```

## 2.2 Estructura raíz

```
Gei-Hockey-Managment-System/
├── .figma/make/          (analyze-routes, deploy, deploy-preview, dev, dev.json,
│                          format, install, langserver, site.json)
├── src/
├── .gitattributes
├── .gitignore
├── .mise.toml            (node 22, pnpm 10.34.3)
├── AGENTS.md             (guía del scaffold figma-make-app)
├── CLAUDE.md             (@AGENTS.md)
├── index.html            (shell con marcadores <!-- figma:* -->)
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vite.config.ts        (362 líneas, plugins de Figma Make)
```

## 2.3 package.json

```json
{
  "name": "figma-make-app", "private": true, "version": "1.0.0", "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview", "format": "oxfmt" },
  "dependencies":    { "lucide-react": "^1.50.0", "react": "^19.0.0",
                       "react-dom": "^19.0.0", "react-router": "^7.13.2" },
  "devDependencies": { "@tailwindcss/vite": "^4.0.0", "@types/node": "^22.0.0",
                       "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0",
                       "@vitejs/plugin-react": "^6.0.0", "oxfmt": "^0.2.0",
                       "tailwindcss": "^4.0.0", "typescript": "^5.7.0", "vite": "^8.0.5" }
}
```

## 2.4 Framework real encontrado

**React 19 + Vite 8 + TypeScript 5.7 + `react-router` v7 + Tailwind CSS v4 + lucide-react.**

**Ausentes** (exigidos por Freeze §39): TanStack Query v5, React Hook Form, Zod 4, CSS Modules.
**Presente y prohibido** (§39: *"No Next.js, SSR/RSC, generic Redux/Zustand store, or Tailwind architectural dependency"*): **Tailwind es la dependencia de estilos arquitectónica** → P1-01.

## 2.5 Estado git

```
fatal: not a git repository (or any of the parent directories): .git
```

**NO EXISTE REPOSITORIO GIT.** No hay rama, ni HEAD, ni historial, ni `git status`. Los "cambios preexistentes" no pueden distinguirse porque no hay baseline. Esto es riesgo operativo para el handoff.

## 2.6 node_modules

```
Test-Path node_modules -> False
```

No hay `node_modules`. No se ejecutó ninguna instalación.

## 2.7 Freeze utilizado

Ruta exacta solicitada, existente:

```
C:\Users\thega\Downloads\GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1.md
48.805 bytes · 2.557 líneas · modificado 2026-10-02 11:40:29
```

Leído **completo**, las 2.557 líneas, en dos pasadas. No se usó ningún resumen ni documento derivado.

> **Observación sobre la fuente (no es un defecto del código):** el Freeze declara *"Canonical workflows/surfaces: **45**"* (§23) y *"canonical workflows/surfaces: 45/45"* (§77), pero la lista explícita de rutas de §23 contiene **38** paths. Hay una discrepancia de 7 dentro del propio Freeze. Se auditaron los 38 declarados; los 7 no declarados no son verificables contra el Freeze. **No se adaptó el Freeze para cerrar esta brecha.**

## 2.8 Inventario de src (20 archivos, ~8.700 líneas)

| Archivo | Líneas | Rol |
|---|---:|---|
| `src/main.tsx` | 10 | entrypoint React |
| `src/App.tsx` | 1 | re-export de `app/App` (convención del plugin Figma, ver 3.A) |
| `src/vite-env.d.ts` | 1 | tipos Vite |
| `src/index.css` | 12 | Tailwind + `@layer base` |
| `src/styles/theme.css` | 38 | **design tokens** |
| `src/styles/fonts.css` | 1 | import de Inter (Google Fonts) |
| `src/app/App.tsx` | 109 | **router** (41 entradas) |
| `src/app/Shell.tsx` | 298 | shell autenticado, nav, guards |
| `src/shared/ui.tsx` | 517 | **17 primitives de UI** |
| `src/mock/model.ts` | 231 | tipos + `labels` + helpers de presentación |
| `src/mock/seed.ts` | 420 | **datos semilla** |
| `src/mock/store.tsx` | 259 | **motor de estado compartido** |
| `src/mock/permissions.ts` | 33 | derivación de roles + gates de notificación |
| `src/mock/scenarios.ts` | 9 | switcher `?scenario=` |
| `src/features/overview.tsx` | 916 | Home, Calendar, Teams, TeamDetail, PersonDetail, Search |
| `src/features/events.tsx` | 1339 | EventDetail, EventForm, JornadaPage, ImpactContent |
| `src/features/participation.tsx` | 1124 | Availability, Selection, Attendance, MatchRecord |
| `src/features/communication.tsx` | 944 | CommunicationHome, NewConversation, ConversationPage, Announcements, Notifications |
| `src/features/management.tsx` | 1390 | Management, Structure, People, Teams admin, Competitions |
| `src/features/account-insight.tsx` | 784 | More, Profile, Login, Activate, NoAccess, Reports, Audit |

**No existen:** `routes/`, features subdivididas por dominio, `shared/{api,http,errors,lib,hooks,patterns}`, `app/{router,providers,session,bootstrap}`, tests, stories.

---

# 3. FASE 1 — CURRENT REAL

## 3.A Arquitectura real

### Entrypoint

`src/main.tsx` → `src/App.tsx` (1 línea) → `src/app/App.tsx`.

`src/App.tsx` con contenido `export { default } from "./app/App"` **no es un alias funcional**: es la convención del plugin `figmaReactRefreshBoundaryFallback` de `vite.config.ts:275`, documentada en `vite.config.ts:268-271`. Es scaffolding deliberado de Figma, no deuda.

### Router

`createBrowserRouter` en `src/app/App.tsx:47-102`. **41 entradas**: 3 públicas, 37 bajo `Shell`, 1 catch-all `*`.

- Rutas públicas fuera del shell: `/login`, `/activate`, `/no-access`.
- Todo lo demás es hijo de `{ Component: Shell }`.
- Sin `errorElement`, sin `lazy`, sin loaders, sin `handle`.
- **No hay guards de ruta.** Toda la autorización es *inside-component* (early return con `<Empty>`). Consecuencia observable: una ruta restringida renderiza el shell completo (sidebar, header, footer) con un mensaje vacío en el medio, en lugar de una pantalla de acceso denegado completa.

### Shell

`src/app/Shell.tsx`. Un solo shell para todos los roles — §40 *"No role-specific shell"* COMPLIANT.

- Sidebar `hidden lg:flex` (≥1024px), ancho fijo `w-[224px]`, con `lg:pl-[224px]` en el contenedor.
- Bottom nav `lg:hidden`, `fixed inset-x-0 bottom-0`, con `pb-[env(safe-area-inset-bottom)]`.
- **Ambos exponen exactamente los mismos 5 destinos** (`nav` en `Shell.tsx:28-34`: Inicio, Calendario, Equipos, Comunicación, Más) — §40 COMPLIANT.
- Main nav §23: Inicio / Calendario / Equipos / Comunicación / Más — exacto.
- Utilities §23: Buscar (`/search`) + Notificaciones (`/notifications`) — exacto.
- `sectionActive()` maneja el resaltado cruzado de sección (Calendar ↔ Events/Jornadas, Comunicación ↔ Conversations/Announcements, Más ↔ Management/Reports/Audit).
- Atajo `⌘K` / `Ctrl+K` → `/search`.
- Guards: `if (!authenticated) return <Navigate to="/login" replace />` (línea 73); `if (!hasAccess) return ... <Navigate to="/no-access" replace />` (líneas 74-81), con escape hatch a `/more/profile` — §53 COMPLIANT.
- Badge de notificaciones no leídas (líneas 47-49) y de mensajes no leídos (líneas 50-52).
- Toast global (líneas 287-295), `role="status"`, `bottom-24` mobile / `bottom-6` desktop.
- `scrollTo({top:0})` en cada cambio de pathname — §24 *"browser Back preserva origen"* parcialmente resuelto.

### Responsive system

Tailwind breakpoints por defecto. Gramática consistente:

| Breakpoint | Uso en el proyecto |
|---|---|
| `sm:` 640px | degradation de tablas, container padding |
| `md:` 768px | grilla de mes del calendario, toggle Mes/Agenda |
| `lg:` 1024px | sidebar vs bottom nav, padding de `main`, footer |
| `xl:` 1280px | grids de 2 columnas (`1fr 300px`, `1fr 320px`) |

**No hay breakpoints ad-hoc.** Es una gramática responsive real y coherente.

### Component system

17 primitives en `src/shared/ui.tsx`: `Button`, `IconButton`, `Avatar`, `Badge`, `Header`, `Section`, `Surface`, `TextField`, `Select`, `TextArea`, `Alert`, `Empty`, `Modal`, `RowLink`, `EventIcon`, `EventRow`, `TextLink`, `Saved`.

API de props consistente, radio grammar unificado (`rounded-md` chips / `rounded-lg` controls / `rounded-xl` surfaces / `rounded-2xl` modales), touch targets explícitos (`min-h-10`, `min-h-9`, `min-h-20`).

### Design tokens

`src/styles/theme.css` — `:root` con 17 variables semánticas + `@theme inline` mapeando a utilidades Tailwind. Nombres semánticos (`--color-primary-soft`, `--color-danger-soft`), no arbitrarios. **Es la pieza de mayor calidad del proyecto.**

`src/styles/fonts.css` — Inter desde Google Fonts con pesos variables `400;450;500;550;600;650;700;750;800`.

`src/index.css` — `@layer base` con focus-visible ring global, `cursor` por defecto, `min-w-0` en inputs, `::selection`. Accesible de base.

### Mock-state architecture — HALLAZGO CENTRAL

**Existe un estado común real.** No hay datos hardcodeados por pantalla.

```
src/mock/seed.ts        →  createSeed(): State
                           (1 semilla · 21 personas · 4 teams · 8 eventos · 3 announcements
                            · 3 conversations · 3 notifications · 10 structure items
                            · 1 competition · 1 jornada · 2 audit entries)

src/mock/store.tsx      →  MockAppProvider (Context + useState<State>)
                           · update(recipe, action, resource, reason)     mutador genérico
                           · updateEvent(id, recipe, action, reason)      mutador de evento
                           · eventChange(id, patch, op, expectedVersion)  mutador con concurrency check
                           · notify(title, body, route)                   fanout de notificación
                           · capabilities{}                               6 booleanos de autoridad
                           · login(username) / logout() / toast(msg)

src/mock/permissions.ts →  roleAssignments / currentRoles / hasRole
                           canReadNotice / noticeRead
```

Todas las mutaciones pasan por `setState(prev => { const next = structuredClone(prev); recipe(next); ...; return next })` — **draft inmutable, un solo write owner**. Ninguna pantalla muta `state` directamente. Esto es correcto y es la decisión de arquitectura más importante del proyecto.

#### Dominio por dominio: dónde vive / quién modifica / qué consume / si propaga

| Dominio Freeze | Dónde vive | Quién modifica | Pantallas consumidoras | Propaga |
|---|---|---|---|---|
| **People** | `state.people: Person[]` | `management.tsx` (asignar/mover/finalizar equipo, rol, elegibilidad, cuenta); `account-insight.tsx` (contacto propio, activar) | Shell, Home, Teams, TeamDetail, PersonDetail, Search, Availability, Selection, Attendance, MatchRecord, Reports, PeopleManagement, PersonAdminDetail, Competitions, NewConversation, ConversationPage | **Parcial** — `state` propaga pero `Person.role` queda stale (P2-01) |
| **Club Structure** | `state.structure: StructureItem[]` + `state.teams: Team[]` | `management.tsx` StructurePage | Teams, TeamDetail, EventForm (sedes), JornadaPage, CompetitionsPage, StructurePage | **Sí, pero con P0-1** |
| **Competition** | `state.competitions: Competition[]` | `management.tsx` CompetitionsPage | EventForm (select), JornadaPage (select), EventDetail (texto) | **Débil** — crear un evento con competencia no crea `CompetitionEntry`; un partido puede referenciar una competencia sin inscripción |
| **Events** | `state.events: Event[]` | `events.tsx` (EventDetail/EventForm/JornadaPage), `store.eventChange`, `participation.tsx` (attendance/record vía `updateEvent`) | Home, Calendar, EventDetail, EventForm, TeamDetail, Jornada, 4 subpantallas de participación, Reports/attendance, Reports/performance | **Sí** |
| **Availability** | `event.availability: Record<personId, {value, revision}>` | `participation.tsx` AvailabilityPage `respond()` | Home (`attention`), EventDetail (count + reconfirm), AvailabilityPage | **Sí** — `revision !== event.revision` produce NEEDS_RECONFIRMATION correctamente (§4, §9) |
| **Selection** | `event.selection` (draft) + `event.published` (inmutable) + `event.selectionRevisions[]` | `participation.tsx` SelectionPage (autosave 600ms + publish) | EventDetail (row Convocatoria), Home (conflictos), SelectionPage, EventDetail historial | **Sí** |
| **Attendance** | `event.attendance: Record<personId, value>` + `attendanceOpened` / `attendanceClosed` | `participation.tsx` AttendancePage | EventDetail (count), Home (`atención`), AttendancePage, Reports/attendance | **Sí** — UNRECORDED derivado correctamente |
| **MatchRecord** | `event.record { state, status, gei, opponent, observations, stats }` | `participation.tsx` MatchRecordPage | EventDetail (badge resultado), Home (`atención`), TeamDetail (`Resultados`), Reports/performance | **Sí** — `matches_played` derivado correctamente |
| **Announcements** | `state.announcements[]` | `communication.tsx` AnnouncementForm / AnnouncementDetail | Home (`Comunicaciones recientes`), CommunicationHome, EventDetail (link), AnnouncementDetail | **Sí, con gap** — el link de EventDetail nunca matchea `"Todo hockey"` (P2-14) |
| **Conversations** | `state.conversations[]` con `messages[]` anidados | `communication.tsx` NewConversation, ConversationPage (send/edit/delete) | CommunicationHome (preview + unread), ConversationPage, Home, EventDetail, Shell (badge) | **Sí** |
| **Notifications** | `state.notifications: Notice[]` + `readBy[]` | `store.notify()`, `communication.tsx` Notifications | Shell (badge), Notifications | **Sí** |
| **Jornadas** | `state.jornadas[]` con `events: string[]` | `events.tsx` JornadaPage | EventDetail (badge + link), MorePage, JornadaPage | **Sí** |
| **Audit** | `state.audit[]` (unshift desde `update()`) | `store.update()` cuando se pasa `action` | AuditPage | **Sí** (timestamp hardcodeado — P3-07) |
| **Management** | `capabilities{}` + `structure` + `competitions` | `store.tsx` | Todas las superficies admin | **Sí** |
| **GuardianRelationship** | **AUSENTE** | — | — | **MISSING (P1-01)** |
| **EventSeries** | **AUSENTE** | — | — | **MISSING (P1-04)** |

### Ownership

`MockAppProvider` es el **único write owner**. Excepción: `shared/ui.tsx:446` (`EventRow`) consume `useProduct()` para leer `state.teams`. Aceptable para un primitive de presentación, pero invierte la dependencia que el Freeze quiere (`shared` por debajo de `features`; aquí `shared` depende de `mock`) → P3-02.

### Forms

**No hay capa de formularios.** 100% `useState` + validación ad-hoc `if` scattered por pantalla. Sin `baselineValues`, sin dirty tracking, sin schema, sin librería. §39 exige React Hook Form + Zod 4; §44 exige baseline/conflict model → P1-08 / P3-05.

### State management

Un único `useState<State>` en `MockAppProvider` + Context. Sin TanStack Query, sin Redux, sin Zustand. Los filtros de UI (`useState` local en cada pantalla) **no están en la URL** → viola §41 (`URL/filter | Router + Zod`) → P2-17/P2-18.

### Navigation

`Link` / `NavLink` / `useNavigate` / `useParams`. Sin navegación por estado.

### Icon system

`lucide-react` **únicamente**. Sin SVG inline, sin icon font, sin duplicados. Consistente. Único desvío: `lucide-react` no figura en la lista de §39 (P4-08, aceptado).

### CSS strategy

Tailwind v4 vía `@tailwindcss/vite`. `@theme inline` expone los tokens como utilidades. **Cero `style={{}}` inline (verificado por grep).** Cero CSS Modules.

§39 dice *"CSS Modules + CSS variables/tokens"* y prohíbe *"Tailwind architectural dependency"*. **Tailwind ES la dependencia de estilos arquitectónica.** Los CSS variables sí están (en `:root`); los CSS Modules no → **P1-01**.

## 3.B Router real — las 41 entradas

```
/login                              → LoginPage                     (público)
/activate                           → ActivatePage                  (público)
/no-access                          → NoAccessPage                  (público)
  <Component: Shell>                (layout, sin path)
  /                                 → <Navigate to="/home" replace />       EXTRA
  /home                             → Home
  /calendar                         → Calendar
  /teams                            → Teams
  /teams/:teamId                    → TeamDetail
  /people/:personId                 → PersonDetail
  /events/new                       → EventForm
  /events/:eventId                  → EventDetail
  /events/:eventId/edit             → EventForm
  /events/:eventId/availability     → AvailabilityPage
  /events/:eventId/selection        → SelectionPage
  /events/:eventId/attendance       → AttendancePage
  /events/:eventId/match-record     → MatchRecordPage
  /jornadas/new                     → JornadaPage
  /jornadas/:jornadaId              → JornadaPage
  /communication                    → CommunicationHome
  /communication/conversations/new  → NewConversation
  /communication/announcements/new  → AnnouncementForm
  /announcements/:id                → AnnouncementDetail
  /announcements/:id/edit           → AnnouncementForm
  /conversations/:id                → ConversationPage
  /notifications                    → Notifications
  /search                           → SearchPage
  /more                             → MorePage                                 EXTRA
  /more/profile                     → ProfilePage
  /management                       → ManagementHome
  /management/structure             → StructurePage
  /management/people                → PeopleManagement
  /management/people/new            → CreatePerson
  /management/people/:id            → PersonAdminDetail
  /management/teams/:id             → TeamAdmin
  /management/competitions          → CompetitionsPage
  /management/competitions/:id      → CompetitionsPage
  /reports                          → ReportsPage
  /reports/attendance               → <ReportDetail />
  /reports/performance              → <ReportDetail performance />
  /audit                            → AuditPage
  *                                 → <Empty title="Página no encontrada" />    EXTRA
```

**Orden de `/events/new`:** declarado antes de `/events/:eventId` (`app/App.tsx:60-61`). Correcto, y además react-router rankea estáticas sobre dinámicas.

**Deep-link:** `EventForm` calcula `isNew = !useParams().eventId` (`events.tsx:728`). Como `/events/new` no matchea `/events/:eventId`, `eventId` es `undefined` → `isNew = true`. Correcto.

---

# 4. FASE 2 — ROUTE / SCREEN MATRIX (resumen)

Matriz completa de 38 filas en `GEI_FIGMA_VS_FREEZE_MATRIX_V1.md`.

## 4.1 Resultado global

- **Las 38 rutas canónicas del Freeze existen.** Cobertura de existencia: **100%**.
- **0 MISSING**, **0 BROKEN** (ninguna ruta renderiza un error).
- **16 PASS / 22 PARTIAL.**
- **Deep-link safe: 38/38.** Verificado: cada ruta renderiza en cold load con el actor por defecto (`coach`) y aplica los capability gates correspondientes. No hay estado en memoria que se pierda al recargar.

## 4.2 Las 3 rutas EXTRA

| Ruta | Justificación | Veredicto |
|---|---|---|
| `/` → redirect `/home` | convención de SPA | ACEPTABLE |
| `/more` | §23 lista "Más" en main nav pero solo declara `/more/profile` | ACEPTABLE |
| `*` (404) | §34 define semántica 404 | ACEPTABLE |

**UNJUSTIFIED_ROUTES = 0.** Hay 3 rutas en el router fuera de §23, pero las 3 son convencionalmente necesarias.

## 4.3 Las 22 rutas PARTIAL — agrupadas por causa

**Grupo A — no hay capa de formularios (6 rutas)**
`/login`, `/activate`, `/events/new`, `/events/:eventId/edit`, `/management/people/new`, `/communication/conversations/new`, `/announcements/:id/edit`.
Los formularios funcionan, pero sin RHF/Zod no pueden cumplir §44 (baseline/conflict) ni §24 (*"error preserva input"*) de forma sistemática.

**Grupo B — modelo de dominio incompleto (7 rutas)**
`/people/:personId`, `/events/new`, `/jornadas/new`, `/jornadas/:jornadaId`, `/management/structure`, `/management/teams/:id`, `/management/competitions`, `/management/competitions/:id`, `/management/people`.
Falta EventSeries, Event targets (personas / multi-equipo), Membership, Venue address/field_label, Season dates, Team create, ExternalReference, identidad LINE vs TEAM de CompetitionEntry.

**Grupo C — gaps de estado y autoridad (6 rutas)**
`/search`, `/notifications`, `/more/profile`, `/management/people/:id`, `/reports`, `/reports/attendance`.
Sin `notification_type`, búsqueda sin Division/Line, Eligibility inalcanzable para SUBCOMMITTEE, password change con fake success, scope Club no representado en ReportDetail.

**Grupo D — datos hardcodeados que mienten (5 rutas)**
`/home`, `/calendar`, `/teams/:teamId`, `/more`, `/events/:eventId`.
`"Sexta A"`, `"6A"`, `"Alvear 1240 · Ituzaingó"`, y el "hoy" congelado en `2026-10-02` en 5 lugares.

## 4.4 Las 16 rutas PASS

`/login`, `/no-access`, `/teams`, `/events/:eventId`, `/events/:eventId/edit`, `/events/:eventId/availability`, `/communication`, `/communication/announcements/new`, `/announcements/:id`, `/announcements/:id/edit`, `/management`, `/management/people`, `/management/people/new`, `/reports`, `/reports/attendance`, `/reports/performance`.

Nota: `/no-access` es PASS por su gate correcto, pero el escenario `session-interrupted` que lo nombraba no produce UX de interrupción de sesión (P2-25).

---

# 5. FASE 3 — WORKFLOW AUDIT

Clasificación: **FULLY_INTERACTIVE 4 · PARTIALLY_INTERACTIVE 6 · STATIC 0 · BROKEN 0 · MISSING 0**

## FLOW A — Availability · **FULLY_INTERACTIVE**

**Archivos:** `src/features/participation.tsx:39-180`, `src/mock/store.tsx:117-141`, `src/features/events.tsx:362-386`, `src/features/overview.tsx:65-119`

| Paso | Verificación |
|---|---|
| Home/Event → Availability | Enlace desde `EventDetail` fila "Disponibilidad" y desde Home "Necesita tu atención" |
| Sí/Tal vez/No | 3 botones con iconos (Check / HelpCircle / X), `disabled` salvo `event.state === "SCHEDULED"` |
| El estado cambia | `updateEvent(id, item => item.availability[actor.id] = {value, revision: item.revision})` |
| Event summary refleja | `EventDetail:367-381` cuenta respuestas, sin respuesta, y "sí" solo cuenta las de `revision === event.revision` |

- **§12 COMPLIANT:** *"Availability nueva sólo con Event SCHEDULED"* — los botones se deshabilitan si no es SCHEDULED.
- **§12 COMPLIANT:** *"POSTPONED conserva respuestas previas, pero no recibe nueva confirmación"* — hay un `Alert` explícito en `participation.tsx:124-129`.
- **§4/§9 COMPLIANT:** `availabilityLabel()` (`model.ts:226-232`) deriva `NO_RESPONSE` y `NEEDS_RECONFIRMATION` comparando `revision` contra `event.revision`.
- **§5 COMPLIANT:** responder propia Availability — el panel de respuesta propia está gated por `capabilities.availability = hasRole(actor,"PLAYER")`. CAPTAIN lo tiene vía derivación (`permissions.ts:8`), COACH/ADMIN/SUBCOMMITTEE no. Exacto.
- **§22 COMPLIANT:** `respond()` no dispara notificación (solo `updateEvent` con audit). *"No notification por Availability response"* respetado.

**Gaps exactos:**
1. **Sin flujo de Guardians.** §5 fila *"responder por menor — delegación"* para los 5 roles; §3 IN-scope `GuardianRelationship`; §17; §53. Ausente por completo → **P1-01**.
2. **`event.version` se incrementa al responder Availability.** `updateEvent` siempre hace `event.version++` (`store.tsx:128`). Availability es otra tabla (`availabilities`, §25); no debería tocar la versión del agregado `events`. Efecto: un EventForm abierto en otra pestaña entra en conflicto 409 por una respuesta ajena → **P2-02**.
3. **El historial del evento se contamina.** `updateEvent` con `action="Responder disponibilidad"` unshifts en `event.history`, que es la línea de coordinación del evento. §71 no lista Availability como fuente de History del evento → **P2-03**.
4. **Un PLAYER sin respuesta previa nunca ve "Necesita reconfirmación".** `overview.tsx:73` exige `!!event.availability[actor.id]`. Una jugadora que nunca respondió no recibe el aviso tras un cambio material. Defensible, pero deja un hueco de UX → **P2-29**.
5. **Availability sobre un evento club-wide resuelve a un solo roster de equipo.** `participation.tsx:55-58` filtra `person.team === event.team`; para `club-event` (`clubWide: true`) eso da el roster de "sexta". §10 exige `club_wide_target=true → 0 Team targets` → **P2-15**.

## FLOW B — Material Event Change · **FULLY_INTERACTIVE** — *el mejor flujo del proyecto*

**Archivos:** `src/features/events.tsx:716-1114` (EventForm), `:629-714` (ImpactContent), `:51-617` (EventDetail), `src/mock/store.tsx:164-208` (eventChange)

| Paso | Verificación |
|---|---|
| Calendar → Match | `EventRow` → `/events/:id` |
| → Edit | Botón "Editar" (`events.tsx:175-182`) o "Reprogramar" del menú |
| Cambiar horario | `TextField type="time"` en el bloque "Fecha y lugar" |
| Impact Preview | `save(true, false)` detecta `material` y abre el Modal "Revisar cambio del evento" con `ImpactContent` |
| Confirm | `save(true, true)` → `eventChange(id, patch, "Partido modificado", baselineVersion)` |
| Event cambia | `updateEvent` → `Object.assign(item, patch); item.revision++` |
| Calendar cambia | `Calendar` lee `state.events` → nuevo `time` visible |
| Home cambia | `EventRow` en "Próximamente" muestra `event.time` |
| Availability → Needs reconfirmation | `event.revision++` invalida todas las respuestas previas |
| Notification aparece | `store.notify()` → `state.notifications.unshift` → badge del Shell + `/notifications` |

- **§11 COMPLIANT:** `material = Object.keys(patch).some(key => key !== "title")` (`events.tsx:770`). Solo el título es no material.
- **§11 COMPLIANT:** `coordination_revision++` mapeado a `event.revision++` (`store.tsx:199`).
- **§11 COMPLIANT:** camino no material (`save` rama `else`, `events.tsx:842-859`) no abre Impact Preview, no bumpea `revision`, no notifica.
- **§11 COMPLIANT:** Team deshabilitado al editar un MATCH no-DRAFT (`events.tsx:929`) — *"concrete Team inmutable una vez Scheduled"*. El tipo de evento no tiene control de edición en modo edit → inmutable.
- **§44 COMPLIANT (parcial):** `baselineVersion` se captura con `useState(event?.version || 1)[0]` (`events.tsx:749`) — correcto, es un baseline inmutable.
- **§10 COMPLIANT:** `end > time` validado (`events.tsx:788-791`).
- **§10 COMPLIANT:** SCHEDULED requiere `date`, `time`, `venue`; MATCH requiere además `opponent`, `team`, `competition` (`events.tsx:776-787`).

**Gaps exactos:**
1. **Bug de estado residual en `EventForm`.** Es el mismo componente para `/events/new` y `/events/:id/edit`. Los `useState` inicializadores corren una vez por montaje; navegar de `/events/x/edit` a `/events/y/edit` **no remonta** (misma ruta, distinto parámetro) → el draft queda ligado al evento anterior. **P2-06**.
2. **Etiqueta de auditoría fija "Partido modificado"** aunque el evento sea TRAINING o CLUB_EVENT (`events.tsx:839`). **P3-04**.
3. **Conteos del Impact Preview aproximados.** `ImpactContent` usa `Object.keys(event.availability).length` tanto para "respuestas existentes se conservarán" como para "personas deberán confirmar nuevamente" (`events.tsx:682-689`); y `count + 1` para destinatarios, donde `count` viene de un filtro distinto al que usa `notify()`. Coinciden numéricamente con la semilla pero no están derivados del mismo conjunto → **P3-05**.
4. **Sin `coordination_revision` visible.** No se muestra el número de revisión en ninguna superficie (§26 lista `coordination_revision` en `events`). **P4-09**.
5. **Sin impacto en `ImpactContent` para `competition`, `clubWide`.** §11 los lista como material; no aparecen en la tabla before/after (`events.tsx:638-660`). **P2-30**.

## FLOW C — Selection · **PARTIALLY_INTERACTIVE**

**Archivos:** `src/features/participation.tsx:182-509`, `src/mock/store.tsx:142-163`

| Verificación | Resultado |
|---|---|
| Autosave debounce 600ms | `setTimeout(..., 600)` — `participation.tsx:220` |
| Un in-flight | `saving.current` — `participation.tsx:207` |
| Coalesce de estados intermedios | `generation.current` guard — `participation.tsx:204,208` |
| Publish espera el in-flight | `if (saving.current) await saving.current` — `participation.tsx:298` |
| Unsaved desired state va al Publish | `item.selection = selected` dentro del publish — `participation.tsx:304` |
| Publish → `published` + revision inmutable | `item.published = [...selected]` + push a `selectionRevisions` |
| Event summary cambia | `EventDetail:387-405` |
| Notification | `notify("Convocatoria publicada", ...)` |

- **§45 COMPLIANT en sus 5 cláusulas principales**, incluyendo *"Publish waits only for an already in-flight autosave. Unsaved local desired state goes directly in PublishSelection."*
- **§12 COMPLIANT:** `mutable = event?.state === "SCHEDULED"`; publicar fuera de SCHEDULED está bloqueado con explicación.
- **§9 COMPLIANT:** *"Working draft revision + published immutable revisions"*.
- **§14 COMPLIANT:** la publicación no se reescribe; `publishedConflicts` se muestra como alerta sin tocar `published`, con copy *"La publicación anterior se conserva"*.
- **§5 COMPLIANT:** `allowed = canOperateEvent(actor, event) && type === "MATCH"` — sólo COACH con scope TEAM/EVENT.

**Gaps exactos:**
1. **Falta el estado `CONFLICT`.** §45 exige cinco estados: SAVED, CHANGES_PENDING, SAVING, SAVE_ERROR, **CONFLICT**. El prototipo implementa 4 con strings en español y no hay ningún camino que produzca conflicto de autosave → **P2-05**.
2. **Falta el diff de republicación.** §22: *"Selection republish compara previous vs new: `selectedNow` / `removedNow`"*. El publish sobrescribe `published` sin diff; el modal solo dice "N jugadoras" → **P2-04**.
3. **Inconsistencia interna de la regla de elegibilidad.** El publish **bloquea** si hay seleccionadas bloqueadas/pendientes (`participation.tsx:291-296`), pero al mismo tiempo la semilla incluye una publicación con `p4` (BLOCKED) y las pantallas presentan "publicación con conflicto actual" como estado legal. §14 dice *"puede derivar hasCurrentConflicts"* (permite, no obliga). El prototipo se contradice consigo mismo → **P2-22**.
4. **El autosave bumpea `event.version`.** Cada tick de autosave pasa por `updateEvent` → `version++` → conflictos 409 espurios entre flujos no relacionados → **P2-02**.
5. **Destinatarios de la notificación demasiado amplios.** `notify()` incluye a todo el team + SUBCOMMITTEE. §52 no define el audience de SELECTION_PUBLISHED, pero §22 implica un público específico → **P3-06**.
6. **La vista no-autorizada pierde el borrador.** Cuando `!allowed` se muestra sólo `published`; el borrador del coach no es visible para sí mismo en modo lectura, lo cual es correcto, pero tampoco hay indication de que existe un borrador → **P4-10**.

## FLOW D — Attendance · **PARTIALLY_INTERACTIVE** (con P0)

**Archivos:** `src/features/participation.tsx:511-809`

| Paso del flow | Verificación |
|---|---|
| Match/Training → Attendance | Fila "Asistencia" en `EventDetail:406-426` (oculta para CLUB_EVENT) |
| Presente/Ausente/Justificada | 3 botones por persona, `wait(130)` + `updateEvent` |
| Dejar algunos Sin registrar | Sin row en `event.attendance` |
| Close → warning | Modal con `Alert tone={unrecorded ? "warning" : "info"}` y copy explícito |
| Confirm | `close()` setea **solo** `attendanceClosed = true` |
| Sin registrar sigue Sin registrar | **VERIFICADO CORRECTO** |

- **§9 COMPLIANT:** `UNRECORDED derivado por ausencia de row`. La UI muestra `"Sin registrar"` separado de `"Ausente"` en todas partes.
- **§24 COMPLIANT:** *"empty != zero != error"* — copy *"No se convertirán en ausentes."*
- **§12 COMPLIANT:** `canOpen = ["SCHEDULED","IN_PROGRESS"].includes(state)`.
- **§5 COMPLIANT:** `!canOperateEvent` → Empty. SUBCOMMITTEE **no** tiene Attendance. Exacto.
- **§12 COMPLIANT:** cerrar después de COMPLETED está permitido.

**Gaps exactos:**
1. **P0-2 — La corrección destruye historia.** `updateEvent(event.id, item => item.attendance = entries, "Corregir asistencia", reason)` (`participation.tsx:739-744`) reemplaza el mapa completo. Los valores anteriores desaparecen; el audit sólo guarda el `reason`. El Alert afirma *"El cierre original se conserva"* y el toast *"Corrección guardada con su motivo"* — el cierre sí se conserva, **los valores no**. §75 y §71 lo prohíben.
2. **Se puede marcar directamente sobre un evento COMPLETED con la hoja abierta.** `canMark = attendanceOpened && !attendanceClosed` no mira el estado del evento. §12 implica que post-COMPLETED corresponde corrección auditada → **P2-08**.
3. **No hay ruta de reapertura.** `attendanceClosed` es un booleano que nunca vuelve a `false`. §9 deriva OPEN/CLOSED de `closed_at`, lo que implica que puede limpiarse → **P2-09**.
4. **`mark()` sin audit entry.** Registrar presencia no genera entrada de audit. §71: *"Audit: ¿quién modificó qué?"*; la asistencia es dominio不只是 proyectión. §71 lista Attendance tables + Audit corrections como fuente de historia. Registrar no es corrección, así que es discutible, pero la asimetría con la corrección es inconsistente → **P3-07**.

## FLOW E — Match Record · **PARTIALLY_INTERACTIVE** (con P0)

**Archivos:** `src/features/participation.tsx:811-1128`

| Verificación | Resultado |
|---|---|
| Match → Match Record | Fila "Resultado y estadísticas" (`EventDetail:427-439`) |
| Score | 2 `TextField type="number" min={0}` + `Select` PLAYED/FORFEIT/ABANDONED |
| Participantes | Checkbox "JUGÓ" explícito por jugadora |
| Goals/assists | 2 number inputs, deshabilitados si `!played` |
| Finalize | Modal de confirmación → `state: "FINAL"` |
| Event muestra resultado | Badge `FINAL` + `Resultado final · 3 – 1` (`EventDetail:286-290`) |
| Team recent result refleja | TeamDetail tab "Resultados" (`overview.tsx:737-764`) |
| **Played players NO derivan de Attendance** | **VERIFICADO CORRECTO** — checkboxes explícitos, y el copy lo dice: *"Las jugadoras que participaron se registran explícitamente, no desde la asistencia."* |

- **§15 COMPLIANT:** *"PlayerMatchStats sólo representa participación real registrada en PLAYED"* — al guardar se filtran solo los `played` (`participation.tsx:884-890`).
- **§15 COMPLIANT:** `PLAYED/FORFEIT → Event COMPLETED`; `ABANDONED → Event ABANDONED` (`participation.tsx:892-893`).
- **§15 COMPLIANT:** *"`matches_played` es derivado"* — `ReportDetail:641-647` cuenta desde `record.stats[id].played`, nunca desde Attendance.
- **§2 COMPLIANT:** *"V1 usa set fijo de estadísticas"* — solo goals y assists. No hay motor dinámico.
- **§5 COMPLIANT:** `!canOperateEvent` → Empty.
- **FLOW E VERIFICADO:** la cadena completa finalize → EventDetail → TeamDetail "Resultados" → Reports/performance propaga correctamente.

**Gaps exactos:**
1. **P0-3 — La corrección destruye historia.** `item.record = {...record, state:"FINAL", ...}` (`participation.tsx:880-891`) reemplaza el record completo. Valores previos perdidos.
2. **El copy miente sobre la preservación.** *"El resultado sigue siendo Final"* es cierto; pero nada dice que los valores anteriores se conservan, y no se conservan. §71 exige MatchRecord/Stats como fuente de historia.
3. **No hay `PlayerMatchStats` history.** Cada corrección estatística es destructiva y silenciosa.
4. **La validación `goals > record.gei` es una regla local inventada.** No está en el Freeze. No contradice nada (§0: "Figma no define reglas de negocio"), pero es una decisión de negocio tomada por el prototipo → **P2-31**.
5. **`record` local no se re-sincroniza con `event.record` tras el guardado.** Funciona porque el objeto local ya trae los cambios, pero cualquier mutación externa de `event.record` divergería → **P3-11**.

## FLOW F — Communication · **FULLY_INTERACTIVE**

**Archivos:** `src/features/communication.tsx:36-573`

| Paso | Verificación |
|---|---|
| Communication → New Conversation | Botón gated por `capabilities.chat` |
| Group/Direct | Toggle de 2 botones |
| Participantes | Lista filtrada, radio para DIRECT, checkbox para GROUP |
| Create | Valida: DIRECT = 1 seleccionado; GROUP = ≥2 + título |
| → Conversation | `navigate(/conversations/${id})` |
| Send Message | `update(...)` push al array `messages` |
| Latest preview cambia | `CommunicationHome:132` usa `conversation.messages.at(-1)` |

- **§20 COMPLIANT:** DIRECT exactamente 2 personas (actor + 1), par canónico, máximo 1 por par — **implementado**: `create()` busca una conversación DIRECT existente con ambos participantes y navega a ella en lugar de duplicar (`communication.tsx:205-217`).
- **§20 COMPLIANT:** GROUP ≥2 participantes + título requerido + múltiples grupos permitidos entre las mismas personas.
- **§20 COMPLIANT:** acceso restringido a participantes (`communication.tsx:344`).
- **§20 COMPLIANT:** *"Automatic Communication entitlement: PLAYER, CAPTAIN, COACH. Guardian no entra. ADMIN/SUBCOMMITTEE no acceden automáticamente"* — `capabilities.chat = COACH|PLAYER|CAPTAIN`. Exacto.
- **§9 COMPLIANT:** Message `SENT → EDITED → DELETED` con tombstone (`deleted = true`, `body = ""`, UI muestra *"Este mensaje fue eliminado."*).

**Gaps exactos:**
1. **Sin creación de conversación TEAM ni EVENT.** §20 define 4 tipos; la UI solo ofrece DIRECT y GROUP. Las canónicas de seed (c1 TEAM, c3 EVENT) no se pueden crear y no hay regla *"0..1 canonical conversation por Team/Event"* → **P2-10**.
2. **Sin ciclo de vida de participantes.** §20 exige `joined_at` / `left_at`, *"no acceso a historia anterior a joined_at"*, *"ex-participant conserva período autorizado"*. No hay add/remove de participantes → **P2-11**.
3. **El selector de personas está restringido al propio team.** `person.team === actor.team && ["PLAYER","CAPTAIN","COACH"].includes(role)` (`communication.tsx:192-197`). §20 GROUP no restringe al Team. No se pueden crear grupos entre divisiones → **P2-12**.
4. **`Conversation.unread` es un contador compartido, no por participante.** Con 3+ participantes, un solo número para todos. §25 no tiene tal columna; el unread de conversación no existe como dominio, y el de Notificaciones sí → **P2-13**.
5. **Altura del panel de conversación mal calculada en mobile.** `h-[calc(100dvh-280px)]` (`communication.tsx:386`) asume 280px de cromo; el cromo real es ≈315px (header 65 + pt-7 28 + bloque Header ≈110 + pb-28 112) → el composer queda ~35px por debajo del viewport, bajo la bottom nav → **P2-23**.

## FLOW G — Notifications · **PARTIALLY_INTERACTIVE**

**Archivos:** `src/features/communication.tsx:842-945`, `src/mock/store.tsx:142-163`, `src/mock/permissions.ts:24-32`

| Paso | Verificación |
|---|---|
| Lista | `Notifications`, filtrada por `canReadNotice` |
| Unread | Filtro "Sin leer" + dot en cada item |
| Open | `onClick` marca read + `navigate(notice.route)` |
| Mark read | `readBy` array por actor |
| Mark all | Botón "Marcar todas como leídas" |
| Badge del Shell | `state.notifications.filter(!noticeRead && canReadNotice).length` |
| Navega al recurso canónico | seed: `/events/match-cuba`, `/announcements/a1` |

- **§22 COMPLIANT (la parte negativa, que es la difícil):** `notify()` se llama **solo** desde `eventChange`, bulk de Jornada, publish de Selection y publish de Announcement. **Cero** notificaciones por respuesta de Availability, entrada de Attendance, Message o typo. Verificado exhaustivamente.
- **§26 COMPLIANT:** `read_at` por destinatario — modelado como `readBy: string[]`. Conceptualmente fiel.
- **Autoridad de lectura coherente:** `canReadNotice` (`permissions.ts:24-30`) — para rutas `/events/*` exige `person.team` o SUBCOMMITTEE; **ADMIN queda excluido de las notificaciones de evento**, que es correcto (no es destinatario).

**Gaps exactos:**
1. **No existe `notification_type`.** §22 define exactamente 8 tipos. `Notice` (`model.ts:116-125`) tiene `title/body/route/date/read` — **cero tipificación**. `store.notify()` recibe un string libre.
2. **5 de los 8 tipos de §22 no son producibles como tipos distintos.** Los títulos de seed mapean a 3: "Partido reprogramado"→EVENT_RESCHEDULED, "Comunicado publicado"→ANNOUNCEMENT_PUBLISHED, "Convocatoria publicada"→SELECTION_PUBLISHED. **EVENT_POSTPONED, EVENT_CANCELLED, EVENT_RESTORED** se emiten hoy con el título genérico del operation string → **P2-04**.
3. **Falta `origin_event_id` y la clave lógica única.** §26: *"Unique logical key: `origin_event_id + recipient + type`"*. Sin tipificación no hay deduplicación posible → **P2-03**.
4. **La regla de audiencia es una aproximación.** `notify()` calcula `person.team === event.team || hasRole(person,"SUBCOMMITTEE")` (`store.tsx:144-151`). §22 exige `old audience ∪ new audience ∪ existing Availability ∪ published Selection ∪ relevant staff` — los tres primeros conjuntos no se distinction, y **los eventos club-wide notifican a un solo team**.
5. **Publicar un comunicado notifica a las 21 personas sin importar la audiencia.** `notify()` con ruta no-`/events/*` hace `state.people.map(p => p.id)` (`store.tsx:151`). Un comunicado con audiencia "Sexta A" notifica a ADMIN, a otros equipos y a SUBCOMMITTEE → **P2-16**.
6. **Sin estado "no leídas" para el Announcement list.** La sección "Comunicados recientes" de Home no marca nada como leído → **P4-11**.

## FLOW H — Management · **PARTIALLY_INTERACTIVE**

**Archivos:** `src/features/management.tsx:301-1057`

| Paso | Verificación |
|---|---|
| People Management | Filtros query/equipo/rol/estado + tabla |
| → Person | `/management/people/:id` |
| Team assignment | "Asignar equipo" / "Mover de equipo" |
| Move Team | End TeamAssignment + end PLAYER + **end CAPTAIN** + nuevo TeamAssignment + nuevo PLAYER |
| Roles | Selector + "Asignar rol" + "Finalizar rol" |
| Mock state | `update()` con audit |
| Team roster refleja | `TeamAdmin` lista assignment vigentes leyendo `person.team` |

- **§17 COMPLIANT:** `AssignPlayerToTeam` atómico (TeamAssignment + PLAYER role) — `management.tsx:588-605`.
- **§17 COMPLIANT:** `MovePlayerTeam` atómico con los 5 pasos, **incluyendo end CAPTAIN** — `management.tsx:588-605`.
- **§17 COMPLIANT:** *"CAPTAIN no se transfiere automáticamente"* — y el copy lo dice explícitamente (`management.tsx:733-736`).
- **§17 COMPLIANT:** `EndPlayerTeam` termina TeamAssignment + PLAYER + CAPTAIN.
- **§17 COMPLIANT:** `PLAYER_PROFILE_INCOMPLETE` — valida dni+birth+phone+email antes de asignar equipo (`management.tsx:562-570`).
- **§26 COMPLIANT:** DNI partial unique cuando no es NULL (`management.tsx:430`).
- **§18 COMPLIANT:** last-admin protection en deshabilitar cuenta y en finalizar rol ADMIN, con mensaje *"Debe permanecer al menos un administrador con cuenta activa."* y el botón deshabilitado.
- **§6 COMPLIANT:** DNI y fecha de nacimiento solo en esta pantalla, que está gated a ADMIN.

**Gaps exactos:**
1. **`Person.role` nunca se actualiza.** `Asignar rol` y `Finalizar rol` solo mutan `roleAssignments` (`management.tsx:627-644`); `item.role` queda stale. `hasRole` lee `roleAssignments` (correcto), pero `labels[person.role]` en `PeopleManagement:399`, `PersonDetail:790`, `ProfilePage:154`, `Shell:169`, `Home:147` y `PersonAdminDetail:1045` muestran el valor viejo. **Cadena de propagación rota** → **P1-07**.
2. **SUBCOMMITTEE no tiene superficie de Eligibility.** §5: *"Eligibility mutation — SUBCOMMITTEE ✓ ADMIN ✓"*. `PersonAdminDetail` está gated a `capabilities.management` (ADMIN). No existe ninguna otra pantalla de eligibility. La autoridad que el Freeze le otorga **no tiene UI** → **P1-02**.
3. **`eligibilityReason` / `eligibilitySource` declarados y nunca usados.** `model.ts:27-28` los declara; no se asignan ni se muestran en ningún lugar → **P3-03**.
4. **El guard de last-admin no cubre "Finalizar pertenencia al equipo".** `management.tsx:546-550` solo cubre `"Deshabilitar cuenta"` y `"Finalizar rol" && role === "ADMIN"`. Finalizar la pertenencia de Mariana no dispara el guard (y para un ADMIN de scope CLUB, "pertenencia al equipo" es semánticamente inexistente) → **P2-19**.
5. **`PeopleManagement` filtra por `person.role`, no por `roleAssignments`.** Un multilayer solo aparece bajo un rol → **P2-20**.
6. **Coach hardcodeado en `TeamDetail`.** `overview.tsx:706-714`: `to="/people/coach"` con nombre *"Tomás Beltrán"* y *"Entrenador"* literales, no derivados de `state.people`. Si el entrenador se reasigna, la pantalla miente. **P2-21**.
7. **Sin superficie de Membership.** `person.team` confunde Membership con TeamAssignment (§17) → **P1-05**.
8. **Sin superficie de GuardianRelationship.** → **P1-01**.
9. **Setup code regenerable sin invalidar el anterior.** §51: *"max 1 active/account"*, *"invalidate old setup token"*. El botón "Generar código de activación" se puede pulsar repetidamente y siempre produce el mismo string literal `GEI-2026-4812` → **P2-21b**.
10. **COACH no puede recibir scope EVENT.** §5: *"COACH | TEAM / EVENT"*. El selector solo produce `TEAM` para COACH → **P2-26**.

## FLOW I — Announcement · **FULLY_INTERACTIVE**

**Archivos:** `src/features/communication.tsx:575-841`

| Paso | Verificación |
|---|---|
| Create | `AnnouncementForm`, gated a `capabilities.official` |
| Draft o Publish | Dos botones: "Guardar borrador" / "Publicar" |
| → Detail | `navigate(/announcements/${resourceId})` |
| Communication list | `CommunicationHome` lee `state.announcements` |
| Notification | `notify("Comunicado publicado", ...)` |
| Correct | Botón "Corregir" en el detalle cuando `state === "PUBLISHED"` |
| Archive | "Archivar comunicado" con modal |

- **§5 COMPLIANT:** `!capabilities.official` → Empty. **ADMIN queda bloqueado** de crear y de ver borradores. Exacto.
- **§9 COMPLIANT:** `DRAFT → PUBLISHED → ARCHIVED`.
- **§21 COMPLIANT:** *"Published audience snapshot immutable"* — en modo corrección el `Select` de audiencia está `disabled` con Alert explicativo: *"La audiencia publicada no puede modificarse. Si fue incorrecta, corresponde crear un comunicado nuevo."* Literalmente el §21.
- **§21 COMPLIANT:** `CorrectAnnouncement` exige `reason` para habilitar el botón, y el reason va al audit.
- **§21 COMPLIANT:** audiencia representada visualmente como club-wide o Teams seleccionados (`"Todo hockey"` / `"Sexta A"` / `"Quinta A + Sexta A"`).
- **§75 COMPLIANT:** archivar, no borrar. Toast: *"Comunicado archivado. Su historia se conserva."*
- **FLOW I VERIFICADO:** crear → draft/publish → detail → list → notification propaga correctamente.

**Gaps exactos:**
1. **La audiencia es un string libre, no un TEAM_SET.** §21: *"'Line A' de UI se resuelve a TEAM_SET"*. `audience: string`. No hay `announcement_target_teams` → **P2-27**.
2. **Publicar notifica a todos, no a la audiencia.** → P2-16 (ya listado en Flow G).
3. **La corrección borra el title/body anterior.** §71 no lista Announcement como fuente de historia separada, pero §75 `meaningful history is not hard-deleted` aplica → degradado a P2-08b: se registra el motivo pero no el valor previo.
4. **Los comunicados ARCHIVED siguen listados para SUBCOMMITTEE.** `CommunicationHome:39-41`: `state === "PUBLISHED" || capabilities.official` — el `|| official` deja pasar DRAFT **y ARCHIVED** → **P2-27b**.
5. **Un comunicado ARCHIVED es legible por cualquiera con el id.** `AnnouncementDetail:581-590` solo gatea `DRAFT`; no chequea `ARCHIVED` → **P2-27c**.

## FLOW J — Jornada · **PARTIALLY_INTERACTIVE**

**Archivos:** `src/features/events.tsx:1116-1342`

| Paso | Verificación |
|---|---|
| Create Jornada | `/jornadas/new`: nombre, temporada (disabled), competencia, checkboxes de partidos disponibles |
| Add matches | checkboxes de MATCHES no asignados a otra jornada, del team o club scope, con competencia coincidente |
| Show matches | `/jornadas/:id` lista los partidos con `RowLink` + Badge de estado |
| Bulk operation | "Cambiar sede de la jornada" |
| Impact Preview | Modal con `ImpactContent` por partido |
| Confirm | `update()` aplica venue + revision++ + version++ + history a **todos** en una sola transacción |
| Affected matches cambian | `notify()` por partido |

- **§16 COMPLIANT:** *"Match pertenece como máximo a una Jornada"* — el filtro de disponibilidad excluye partidos ya asignados (`events.tsx:1188-1190`).
- **§16 COMPLIANT:** *"Bulk atómico"* — un único `update()` con `structuredClone`, todos los eventos mutados juntos.
- **§16 COMPLIANT:** `CloseCompetition requiere 0 active entries` (en CompetitionsPage) y el bulk de jornada bloqueado si algún evento está COMPLETED/ABANDONED.
- **FLOW J VERIFICADO:** el bulk de sede cambia coherentemente los N partidos, les bumpea `revision` (por lo que la Availability de todos pasa a NEEDS_RECONFIRMATION), dispara N notificaciones y un toast resumen.

**Gaps exactos:**
1. **`/jornadas/new` no es alcanzable desde la UI.** No hay ningún enlace que apunte a `/jornadas/new`: `MorePage:73` apunta a `/jornadas/j1` (id hardcodeado), Calendar no tiene entrada de jornada, `EventDetail:529-536` apunta al detalle. La ruta existe y es deep-link safe, pero es **inalcanzable por navegación** → **P2-32**.
2. **Sin `COMPETITION_SCOPE_MISMATCH`.** §16 define las reglas TEAM/LINE scope y el error `422`. La creación de jornada compara `event.competition === competition.name` (string) sin validar `CompetitionEntry`, season ni line → **P2-33**.
3. **Temporada hardcodeada.** `"2026"` disabled en el form y `season: "2026"` en el save (`events.tsx:1169,1147`). §16 *"Match Team.season = Jornada.season"* no se verifica.
4. **No se pueden agregar/quitar partidos después de creada la jornada.** No hay superficie de edición de composición.
5. **`MorePage` enlaza a `/jornadas/j1`** con id literal. Si la jornada cambia de id, el enlace rompe → **P3-12**.
6. **Modales sin guard de `pending` en el cierre.** `JornadaPage:1283`: `onClose={() => setPreview(false)}` mientras la confirmación está en vuelo → **P4-12**.
7. **Sin EventSeries / ocurrencias.** §9 `EventSeries ACTIVE -> ENDED`, §25 `event_occurrence_overrides`, §36 API "EventSeries" → **P1-04**.

---

# 6. FASE 4 — PRODUCT TRUTH DOMAIN AUDIT

## 6.1 STRUCTURE

**Freeze §4 / §19 / §25:** Season, Division, Line, Team, Venue. Sin Category técnica central.

| Requisito | Estado | Evidencia |
|---|---|---|
| Season + Division + Line + Team presentes | SI | `seed.ts:212-224` teams con `division`/`line`/`season` |
| Team conceptualmente = Season + Division + Line | **SI** | `seed.ts:217-223`; `Teams` muestra `${division} · Línea ${line}` (`overview.tsx:612`) |
| Sin "Category" como entidad central | **CONFIRMADO** | `StructureItem.type` ∈ {Temporada, División, Línea, Sede}. Nunca "Categoría". §75 COMPLIANT |
| Unique(season, division, line) | PARCIAL | El seed lo respeta; la UI de rename lo rompe (**P0-1**) |
| Season: Create / Update name+dates / histórico / no hard-delete | PARCIAL | Create + Update name ✓; **dates ausentes**; no-hard-delete ✓ (`item.type !== "Temporada"` oculta el botón Archivar) |
| Division: Create / Update / Archive | SI | `management.tsx:197-268` |
| Line: Create / Update / Archive | SI | ídem |
| Venue: name, address, optional field_label, archived_at | PARCIAL | Solo `name` + `archived`; **address y field_label ausentes**; `EventDetail:345` muestra `"Alvear 1240 · Ituzaingó"` hardcodeado para todas las sedes |
| Archive bloqueado por dependencias activas | SI | `dependency()` (`management.tsx:105-124`) |
| Team: DRAFT → ACTIVE → ARCHIVED | PARCIAL | Toggle en `TeamAdmin:1014-1028`; **sin superficie de creación de Team** |
| Identidad de Team inmutable | **NO** | **P0-1** |

**Veredicto:** la estructura está conceptualmente correcta y usa la terminología canónica. La única violación es la mutación de identidad (P0-1) más la pérdida de `address`/`field_label`/`dates`.

## 6.2 PEOPLE

**Freeze §8 / §17 / §26:** Person, Account identity, Membership, TeamAssignment, RoleAssignment, GuardianRelationship — *"No fusionar conceptos"*.

| Concepto | Estado | Dónde |
|---|---|---|
| Person (firstName, lastName required; DNI/birth/phone/email nullable) | SI | `model.ts:14-29`, `CreatePerson` valida required |
| DNI partial unique cuando no es NULL | SI | `management.tsx:430` |
| Account (username, status PENDING/ACTIVE/DISABLED) | SI | `model.ts:24-25` |
| Username único, estable e independiente del Team | SI | `management.tsx:571-582` + copy *"El usuario no depende del equipo."* |
| RoleAssignment (role, scope CLUB/TEAM/EVENT, target, valid_from, valid_until) | SI | `model.ts:6-13` |
| TeamAssignment temporal | PARCIAL | Modelado como `Person.team` + assignments derivados; ver P1-05 |
| **Membership** | **NO** | `person.team` fusiona Membership con TeamAssignment |
| **GuardianRelationship** | **NO** | Ausente del codebase entero |
| Temporal `[valid_from, valid_until)` | SI | `validFrom` / `validUntil` en `RoleAssignment` |
| AssignPlayerToTeam atómico | SI | `management.tsx:588-605` |
| MovePlayerTeam atómico (5 pasos) | SI | ídem |
| CAPTAIN no se transfiere | SI | ídem |
| EndPlayerTeam | SI | `management.tsx:606-615` |
| Last Admin protection | PARCIAL | 2 de 3 casos de §18 |

**Fusiono detectado:** `Person.role` (scalar único) + `Person.team` (scalar único) conviven con `RoleAssignment[]`. Son **dos fuentes de verdad** para autoridad y afiliación, y ya divergen (P1-07).

**`roleAssignments()` es una función de derivación, no un agregado persistido.** `permissions.ts:3-17` la sintetiza desde `person.role` + `person.team` cuando `roleAssignments` es undefined. Esto hace que los datos semilla no tengan assignments reales, y que mutar `person.team` en `PersonAdminDetail` tenga que reconstruir la lista a mano. Funcional, pero frágil.

## 6.3 PARTICIPATION — *"DEBEN seguir separadas"*

| Invariante §75 | Estado | Evidencia |
|---|---|---|
| **missing Attendance != Absent** | **CONFIRMADO** | UNRECORDED por ausencia de row; `"Sin registrar"` separado de `"Ausente"` en AttendancePage, EventDetail, ReportDetail. Copy explícito: *"No se convertirán en ausentes."* |
| **Availability != Attendance** | CONFIRMADO | Entidades separadas; `AvailabilityPage:78` copy: *"Las respuestas previas no determinan la convocatoria ni la asistencia."* |
| **Selection != Attendance** | CONFIRMADO | MatchRecord: *"no desde la asistencia"* |
| **Selection != Eligibility** | CONFIRMADO | `SelectionPage:331` copy: *"Disponibilidad y elegibilidad son información independiente."* Las columnas son separadas en la tabla. |
| **Eligibility nunca inferida desde Availability** | CONFIRMADO | `person.eligibility` es un campo propio; no se deriva de `event.availability` |
| **Eligibility puede crear current conflict sin borrar Selection publicada** | **CONFIRMADO** | `publishedConflicts` / `conflicts` se **derivan** y se muestran como alerta; `event.published` nunca se modifica por un conflicto → **§14 COMPLIANT** |

| Aplicabilidad §12 | Estado |
|---|---|
| Availability: TRAINING / MATCH / CLUB_EVENT | SI (los tres tipos exponen la fila) |
| Selection: MATCH | SI (`event.type === "MATCH"` gate) |
| Attendance: TRAINING / MATCH | SI (`event.type !== "CLUB_EVENT"` gate) |
| MatchRecord: MATCH | SI (`event.type === "MATCH"` gate) |
| Availability nueva sólo con SCHEDULED | SI |
| Selection publish exige SCHEDULED | SI |
| Attendance abre en SCHEDULED o IN_PROGRESS | SI |

**Esta es la parte del dominio mejor resuelta del proyecto.** Los cuatro conceptos están separados, y lacopy de la app lo declara explícitamente en cada pantalla. Es exactamente lo que §75 exige.

**Excepción (P2-22):** la coherencia interna entre "publish bloquea por eligibility" y "published con conflicto es estado legal" no está resuelta.

## 6.4 EVENTS

**Freeze §9 / §10 / §11.**

Estados representados en el modelo (`model.ts:2`): `DRAFT | SCHEDULED | POSTPONED | CANCELLED | IN_PROGRESS | COMPLETED | ABANDONED` — **los 7, exactos** ✓.

Estados presentes en la semilla (`seed.ts`): SCHEDULED (×4), POSTPONED (×1), CANCELLED (×1), IN_PROGRESS (×1), COMPLETED (×1). **DRAFT y ABANDONED solo se alcanzan por interacción** (`EventForm` guarda borrador; MatchRecord ABANDONED → Event ABANDONED).

| Transición §9 | ¿Alcanzable? | Evidencia |
|---|---|---|
| `DRAFT → SCHEDULED` | SI | `EventForm` "Programar" con `schedule=true` |
| `SCHEDULED → POSTPONED` | SI | Menú "Postergar" → modal → `eventChange` |
| `POSTPONED → SCHEDULED` | SI | Menú muestra "Reprogramar" |
| `SCHEDULED → CANCELLED` | SI | Menú "Cancelar evento" (variant danger) |
| `POSTPONED → CANCELLED` | SI | menú `["SCHEDULED","POSTPONED"]` |
| `CANCELLED → SCHEDULED` (Restore) | SI | Menú "Restaurar" |
| `SCHEDULED → IN_PROGRESS` | SI | Menú "Iniciar evento" (sólo `sport`) |
| `IN_PROGRESS → COMPLETED` | **PARCIAL** | Sólo para TRAINING (`events.tsx:254-256`). Un MATCH sólo llega a COMPLETED vía FinalizeMatchRecord |
| `IN_PROGRESS → ABANDONED` (Match) | SI | MatchRecord status ABANDONED → finalize |
| `COMPLETED` no reabre | SI | `editable` excluye COMPLETED/ABANDONED/IN_PROGRESS |
| **EventSeries** `ACTIVE → ENDED` | **NO** | Ausente → P1-04 |

**Invariantes §10:**

| Invariante | Estado |
|---|---|
| `end_at > start_at` si ambos existen | SI — validado (`events.tsx:788`) |
| SCHEDULED/IN_PROGRESS/COMPLETED requieren `start_at` | SI — validado |
| POSTPONED puede no tener schedule | SI — `EventDetail:331` muestra "A confirmar"; `EventRow:474` muestra "A definir" |
| MATCH: `club_wide_target=false` | SI — `canOperateEvent` excluye clubWide; el form oculta el toggle de audiencia para MATCH |
| MATCH: exactamente 1 `event_target_team` | SI por construcción (campo `team` singular) |
| MATCH: 0 `event_target_persons` | SI por construcción |
| TRAINING antes de Scheduled: ≥1 Team **o Person** target | **PARCIAL** — Team sí; **Person targets imposibles de representar** → P1-03 |
| CLUB_EVENT: club-wide o targeted | SI — toggle en el form |
| `club_wide_target=true` → 0 team targets, 0 person targets | **NO** — el modelo tiene siempre `team`, incluso con `clubWide: true` → P2-15 |
| **Event targets multi-team** | **NO** → P1-03 |

## 6.5 MATCH

| Invariante §10 / §75 | Estado |
|---|---|
| MATCH tiene exactamente 1 Team concreto | SI — campo singular |
| Team inmutable una vez Scheduled | PARCIAL — el select se deshabilita al editar MATCH no-DRAFT; **pero un rename de División/Línea muta la identidad del Team** → P0-1 |
| 1 Match subtype row | SI — `type: "MATCH"` + `opponent` |
| CompetitionEntry coherente | **NO** — `EventForm` selecciona una competencia sin crear/verificar entry → P2-33 |

## 6.6 COMMUNICATION

| Invariante §20 | Estado |
|---|---|
| Announcements separados de Conversations | **CONFIRMADO** — `state.announcements[]` vs `state.conversations[]`, tabs separados, rutas separadas |
| DIRECT: exactamente 2 Persons | SI |
| DIRECT: par canónico unordered, max 1 por pair | **SI (a nivel UI)** — `NewConversation:205-217` busca y reutiliza |
| DIRECT: `direct_pair_key` nullable + partial unique | NO (no modelado) — n/a para prototipo |
| GROUP: ≥2 participantes, título requerido | SI |
| GROUP: múltiples grupos entre mismas personas | SI — sin dedup para GROUP |
| TEAM: 0..1 canonical por Team | Parcial — hay 1 en seed, **sin UI de creación ni regla** → P2-10 |
| TEAM: membership sincronizado server-side | NO |
| EVENT: 0..1 canonical por Event | Parcial — ídem |
| Participants: `joined_at` / `left_at` | NO → P2-11 |
| Sin acceso a historia anterior a `joined_at` | NO |
| Ex-participant conserva período autorizado | NO |
| Automatic entitlement PLAYER/CAPTAIN/COACH | **CONFIRMADO** |
| Guardian no entra | NO APLICABLE (Guardian ausente) |
| ADMIN/SUBCOMMITTEE sin acceso automático | **CONFIRMADO** — `capabilities.chat` los excluye y `ConversationPage` exige participante |

**Announcement §21:**

| Invariante | Estado |
|---|---|
| Audience: club-wide o selected Teams | SI (visualmente) |
| "Line A" de UI → TEAM_SET | **NO** — es string libre → P2-27 |
| Published audience snapshot immutable | **CONFIRMADO** — select deshabilitado en corrección |
| Audience incorrecto → Announcement nuevo | **CONFIRMADO** — copy explícito |
| CorrectAnnouncement con reason + Audit | SI — reason requerido + audit |
| `DRAFT → PUBLISHED → ARCHIVED` | SI |

## 6.7 MATCH RECORD

| Invariante §15 / §75 | Estado |
|---|---|
| `PLAYED/FORFEIT → Event COMPLETED` | SI |
| `ABANDONED → Event ABANDONED` | SI |
| **PlayerMatchStats sólo representa participación en PLAYED** | **CONFIRMADO** — filtro `value.played` al guardar |
| `matches_played` es derivado | **CONFIRMADO** — `ReportDetail:641-647` |
| **Attendance != Match participation** | **CONFIRMADO** — checkboxes explícitos |
| `DRAFT → FINAL` | SI |
| FINAL se corrige explícitamente | SI — con reason requerido |
| **La corrección preserva el record anterior** | **NO** → **P0-3** |
| Set fijo de estadísticas | **CONFIRMADO** — goals + assists, sin motor dinámico |

## 6.8 HISTORY

**Freeze §71 / §75: *"meaningful history is not hard-deleted"*.**

| Fuente §71 | Implementación | Estado |
|---|---|---|
| Events + Audit | `event.history: string[]` + `state.audit[]` | SI — **pero duplicado**: la misma acción se registra en ambos, con riesgo de divergencia → P3-13 |
| Attendance tables + Audit corrections | `event.attendance` + audit con reason | **NO — el audit no guarda los valores previos y la tabla se sobrescribe** → **P0-2** |
| MatchRecord/Stats | `event.record` | **NO — sobrescrito en corrección** → **P0-3** |
| SelectionRevision | `event.selectionRevisions[]` con `players` snapshot | **SI — correctamente inmutable** |
| Announcement | `audience`/`state`/`title`/`body` mutables | Parcial — sin snapshot del valor previo → P2-08b |
| Message | `edited` / `deleted` flags | SI |
| Audit for administrative changes | `state.audit[]` | SI — pero `AuditEntry` no tiene resource type/id ni before/after |
| No generic History table | **CONFIRMADO** ✓ | La historia es por-agregado, no una tabla genérica |

**Contradicciones de historia detectadas: 2 (P0-2, P0-3).** En ambos casos la UI **afirma** que la historia se conserva y el código no lo hace. Eso es peor que un simple bug: es una afirmación falsa en pantalla.

---

# 7. FASE 5 — PERMISSIONS / AUTHORITY AUDIT

No se buscó seguridad real (no hay backend). Se auditó **únicamente la simulación visual**.

## 7.1 El modelo de autoridad actual

`src/mock/store.tsx:83-95`:

```ts
const hasAccess = actor.account === "ACTIVE" && currentRoles(actor).length > 0
const capabilities = {
  sport:         hasRole(actor, "COACH"),
  management:    hasRole(actor, "ADMIN"),
  official:      hasRole(actor, "SUBCOMMITTEE"),
  report:        ["COACH","CAPTAIN","PLAYER","SUBCOMMITTEE"].some(...),
  chat:          ["COACH","PLAYER","CAPTAIN"].some(...),
  availability:  hasRole(actor, "PLAYER"),
}
```

Seis booleanos sin scope. **§5 define scope para 3 de los 5 roles** (PLAYER/CAPTAIN = TEAM, COACH = TEAM/EVENT, SUBCOMMITTEE/ADMIN = CLUB).

**§40 dice: *"Object actions derive from `allowedActions`. Never recreate server authorization with `if role===...`."*** El código hace exactamente `hasRole(...)` sobre el role del actor. Para un prototipo sin servidor es la única opción, pero es deuda arquitectónica explícita → **P3-01**.

**El scope se recupera a posteriori** con `canOperateEvent()` (`store.tsx:249-259`), que sí valida TEAM y EVENT scope del COACH. Ese es el patrón correcto y está bien aplicado en las 4 pantallas de participación. El problema es que `capabilities.sport` sigue siendo un booleano sin scope usado como gate en 14 lugares.

## 7.2 Authority Matrix §5 — verificación fila por fila

| Acción §5 | PLAYER | CAPTAIN | COACH | SUBCOMMITTEE | ADMIN | Veredicto |
|---|---|---|---|---|---|---|
| editar propio contacto/password | ✓ | ✓ | ✓ | ✓ | ✓ | **OK** (password fake → P0-4) |
| responder propia Availability | ✓ | ✓ | sólo si además PLAYER | sólo si además PLAYER | sólo si además PLAYER | **OK EXACTO** |
| **responder por menor (delegación)** | delegación | delegación | delegación | delegación | delegación | **MISSING** → P1-01 |
| crear/editar Training | — | — | Team/Event scope | oficial autorizado | — | **OK** |
| crear Match | — | — | Team scope | Club scope | — | **OK** |
| postpone/reschedule/cancel Match | — | — | Team scope | Club scope | — | **OK** (`canOperateEvent` + `capabilities.official`) |
| Logistics | — | Team scope | Team/Event | Club scope | — | **OK** (visible para todos; editable vía EventForm gate) |
| **Selection** | — | — | Team/Event | — | — | **OK EXACTO** — SUBCOMMITTEE recibe Empty |
| **Attendance** | — | — | Team/Event | — | — | **OK EXACTO** |
| **MatchRecord/stats** | — | — | Team/Event | — | — | **OK EXACTO** |
| **Announcement oficial** | — | — | — | Club | — | **OK EXACTO** |
| Direct/Group messages | ✓ | ✓ | ✓ | sólo con entitlement | sólo con entitlement | **OK** |
| Attendance report | propio | Team | Team | Club | — | **OK** (ADMIN excluido; scope imperfecto → P2-34) |
| Performance report | propio | Team | Team | Club | — | **OK** |
| Personas/cuentas/accesos | — | — | — | — | ✓ | **OK EXACTO** |
| **Club structure** | — | — | — | — | ✓ | **OK EXACTO** |
| Competitions/Entries | — | — | lectura | ✓ | ✓ | **OK EXACTO** — COACH lee, no muta |
| **Eligibility mutation** | — | — | lectura status | ✓ | ✓ | **PARCIAL** — ADMIN ✓; **SUBCOMMITTEE sin superficie** → P1-02; COACH lee status ✓ |
| External refs | — | — | lectura | ✓ | ✓ | **PARCIAL** — sin entidad → P2-36 |
| **Audit** | — | — | — | — | ✓ | **OK EXACTO** |

## 7.3 Las 4 reglas explícitas de §5

### "ADMIN no es superusuario deportivo" — **CONFIRMADO**

`capabilities.sport = hasRole(actor,"COACH")` → false para ADMIN.
- `/events/:id/selection` → `canOperateEvent` false → Empty.
- `/events/:id/attendance` → `canOperateEvent` false → Empty.
- `/events/:id/match-record` → `canOperateEvent` false → Empty.
- `EventDetail` para ADMIN: `actor.team = ""`, evento no clubWide → `Empty "Evento no disponible"`.
- No ve "Crear evento" en Home ni Calendar.
- No ve el link de Administration en el sidebar.

**Verificado por código, no por suposición.** ✓

### "CAPTAIN no hereda poder de Coach" — **CONFIRMADO**

- `SelectionPage`: `allowed = canOperateEvent(actor, event)` → false. Ve solo la versión publicada ✓.
- `AttendancePage`: `!canOperateEvent` → Empty ✓.
- `MatchRecordPage`: `!canOperateEvent` → Empty ✓.
- `EventDetail`: `editable = (sport || official) && ...` → false; el menú `⋮` no se renderiza ✓.

Lo **sí** puede hacer CAPTAIN, y es correcto según §5/§6:
- Ver la lista de Availability del equipo (read) — `participation.tsx:132-134`.
- Ver contacto (phone/email) de jugadoras de su team — `overview.tsx:798-800`. §6 lo permite: *"COACH/CAPTAIN del Team actual cuando exista necesidad operativa"*.
- Attendance/Performance report de su team — §5 *"Team si corresponde"* ✓.
- Responder su propia Availability (tiene PLAYER derivado) ✓.

**Verificado.** ✓

### "ADMIN no obtiene acceso automático a private conversations" — **CONFIRMADO**

- `capabilities.chat` excluye ADMIN → `CommunicationHome` oculta la tab "Conversaciones" y la sección entera.
- `NewConversation` → Empty.
- `ConversationPage` exige `participants.includes(actor.id)`. Ninguna conversación de la semilla incluye a `admin`.
- `ConversationPage` para ADMIN con cualquier id → Empty *"Sólo las personas participantes tienen acceso a esta conversación."*
- **No existe conversation de admin en la semilla.** Ni una sola.
- `canReadNotice` además excluye a ADMIN de las notificaciones de evento.

**Verificado.** ✓ **Este es el punto más fuerte de la auditoría.**

### "SUBCOMMITTEE no equivale a Coach" — **CONFIRMADO con una excepción**

- `capabilities.sport` false → sin Selection, Attendance, MatchRecord ✓.
- `capabilities.official` true → puede crear Matches (Club scope ✓), editar eventos, Announcement oficial ✓, Competitions ✓, Club scope en Reports ✓, ver availability de todo el club (`Home:50`) ✓.
- **Excepción:** `canOperateEvent` excluye `event.clubWide` y `event.type === "CLUB_EVENT"` — un SUBCOMMITTEE nunca puede *iniciar* o *completar* un CLUB_EVENT aunque §5 le da Club scope para crear. Ambigüedad del Freeze, no del código → P3-14.

## 7.4 Role checks hardcodeados incoherentes

| Hallazgo | Ubicación | Freeze | Sev |
|---|---|---|---|
| `capabilities.sport` sin scope de team, usado como gate en 14 sitios | `store.tsx:85` | §5 scopes, §40 | P3-01 |
| `actor.role === "CAPTAIN"` como fuente de autoridad (debería ser `hasRole`) | `participation.tsx:134`, `overview.tsx:799` | §5, §40 | P2-35 |
| `actor.role !== "PLAYER"` como filtro de scope en Reports | `account-insight.tsx:552,608` | §5 | P2-35 |
| `actor.role === "ADMIN"` en el redirect post-login | `account-insight.tsx:288` | §53 | P4-13 |
| `role === "CAPTAIN"` para validar scope en RoleAssignment | `management.tsx:553,792` | §5 | OK |

## 7.5 Acciones visibles para quien no corresponde

| Hallazgo | Evidencia | Sev |
|---|---|---|
| **Alert de conflictos de convocatoria visible para PLAYER** | `events.tsx:305-310` — sin gate de capability | **P0-5** |
| Availability sobre club event muestra roster de un team | `participation.tsx:55-58` | P2-15 |
| ADMIN no puede ver phone/email en PersonDetail | `overview.tsx:773-783` — §6 lo permite | P2-36b |
| "Cuerpo técnico" hardcodeado muestra un coach inexistente si se reasigna | `overview.tsx:706-714` | P2-21 |
| Comunicado ARCHIVED legible por cualquiera con el id | `communication.tsx:581-590` | P2-27c |

## 7.6 Permisos faltantes

| Permiso §5 | Quién lo tiene | Superficie |
|---|---|---|
| Eligibility mutation | SUBCOMMITTEE | **NINGUNA** → P1-02 |
| responder por menor | los 5 | **NINGUNA** → P1-01 |
| Coach scope EVENT | COACH | No asignable en la UI → P2-26 |
| External refs mutation | SUBCOMMITTEE, ADMIN | No modelado → P2-36 |
| Team create | ADMIN | No modelado → P2-37 |

## 7.7 Veredicto de la capa de autoridad

**Es la parte mejor resuelta del proyecto.** 17 de 21 filas de la Authority Matrix están exactamente correctas, las 4 reglas explícitas de §5 se cumplen, y la matriz de PII (§6) se respeta en 9 de 11 casos.

Los problemas son de **forma**, no de **resultado**: la autoridad está expresada como 6 booleanos sin scope en lugar de `allowedActions` por objeto. Eso produce exactamente una fuga (P0-5) y una serie de gates que dependen de gates externos para no ser incorrectos.

---

# 8. FASE 6 — PII AUDIT

**Freeze §6 — PII Field Authority.**

| Dato | Visibility §6 | Dónde aparece en el código | Veredicto |
|---|---|---|---|
| **DNI** | ADMIN | `management.tsx:675` (PersonAdminDetail), `management.tsx:476` (form de creación), `management.tsx:430` (comparación) | **EXPOSICIÓN CORRECTA.** No aparece en `PersonDetail`, ni en Selection, ni en Attendance, ni en Reports. ✓ |
| **birthDate completa** | ADMIN | `management.tsx:676`, `:443`, `:564` | **EXPOSICIÓN CORRECTA** ✓ |
| **phone** | self, ADMIN, COACH/CAPTAIN del Team actual | `PersonAdminDetail:678`, `PersonDetail:804`, `ProfilePage:165`, `seed` | **CORRECTA** — `PersonDetail` lo gatea a `capabilities.sport \|\| actor.role==="CAPTAIN" \|\| actor.id===person.id` + el gate de team ✓. **Pero ADMIN queda fuera** (§6 lo incluye) → P2-36b |
| **email** | self, ADMIN, COACH/CAPTAIN del Team | ídem | **CORRECTA** con la misma excepción |
| **Guardian relationship** | guardian self + ADMIN; Coach sólo info operativa mínima | **AUSENTE del codebase** | **MISSING** → P1-01 |
| **Eligibility status** | COACH scope + SUBCOMMITTEE + ADMIN | `TeamDetail:695-700` (gated a sport/official/management), `SelectionPage:418` (**sin gate**), `EventDetail:280`, `MatchRecord` | **DUDOSA** — ver abajo |
| **Eligibility reason/source** | SUBCOMMITTEE + ADMIN | **NO SE MUESTRA NUNCA.** `model.ts:27-28` declara los campos; nadie los asigna ni los renderiza | **MISSING** → P1-02 |
| **Message body** | Conversation participants dentro de su período autorizado | `ConversationPage` gated a `participants.includes(actor.id)` ✓; `CommunicationHome` idem; preview `messages.at(-1)` idem | **EXPOSICIÓN CORRECTA** ✓ — sin fuga a ADMIN ni SUBCOMMITTEE |
| **Audit sensitive data** | ADMIN con redacción | `AuditPage` gated a `capabilities.management` ✓; muestra `reason` crudo sin redacción | **MAYOR RECTIFICACIÓN** — sin redacción. El `reason` es texto libre de admin; si contuviera PII se expondría. Bajo riesgo en el mock → P4-14 |

## 8.1 Person Detail vs Person Admin Detail — **SON DISTINTOS ✓**

Este es un requisito explícito del pedido de auditoría y **se cumple**:

| | Person Detail (`/people/:personId`) | Person Admin Detail (`/management/people/:id`) |
|---|---|---|
| Gate | `person.team === actor.team \|\| capabilities.official \|\| person.id === actor.id` | `capabilities.management` (ADMIN) |
| Avatar + nombre + rol | SI | SI (en el Header) |
| Badge de rol | SI | via `currentRoles` list |
| **Badge de Eligibility** | `capabilities.sport` only | SI (sección dedicada con selector) |
| **phone / email** | `sport \|\| CAPTAIN \|\| self` | SI |
| **DNI** | **NO** | **SI** |
| **birthDate** | **NO** | **SI** |
| username | NO | SI |
| TeamAssignment / Roles / Membership | NO | SI (editable) |
| Asignar/finalizar rol | NO | SI |
| Deshabilitar/Reactivar cuenta | NO | SI |
| Setup code | NO | SI |
| Last-admin guard | NO | SI |

**Veredicto: separation limpia y correcta.** La separación que §6 exige entre el perfil normal y el perfil administrativo está bien implementada.

## 8.2 La fuga de Eligibility (P0-5)

`events.tsx:305-310`:

```tsx
{conflicts.length > 0 && (
  <Alert tone="error">
    Esta convocatoria tiene {conflicts.length} situación para revisar.
    La publicación histórica se conserva.
  </Alert>
)}
```

**Sin gate de capability.** Y `conflicts` se define en `events.tsx:103-108` a partir de `person.eligibility !== "ELIGIBLE"`.

Con la semilla: `published = p0..p11`; `p4` es `BLOCKED` → `conflicts.length ≥ 1`. Y `EventDetail` es alcanzable por cualquier persona con `actor.team === "sexta"`, es decir **las 18 jugadoras + el coach + la capitana**.

**Resultado: cada PLAYER ve un contador de situaciones derivadas de elegibilidad.** §6 dice `Eligibility status → COACH scope + SUBCOMMITTEE + ADMIN`.

Contraste: `Home` **sí** gatea el mismo cálculo con `&& capabilities.sport` (`overview.tsx:90`). El gate existe y simplemente falta en `EventDetail`.

## 8.3 Resumen PII

| Categoría | Cantidad |
|---|---|
| Exposición correcta | 7 |
| Exposición dudosa | 2 (Eligibility en SelectionPage sin gate indirecto; audit sin redacción) |
| Exposición que contradice Freeze | 2 (P0-5 Eligibility en EventDetail; PII de contacto no accesible a ADMIN) |
| Campos PII del Freeze ausentes | 3 (Guardian info, Eligibility reason, Eligibility source) |

---

# 9. FASE 7 — STATE COVERAGE

Criterio: **no se cuenta "podría renderizarse". Se exige un camino o datos reales que lo produzcan.**

## 9.1 Estados de UI

| Estado | ¿Existe? | Trigger | Completitud |
|---|---|---|---|
| **LOADING** | SI | `?scenario=loading` → `Shell.tsx:54-59`, 900ms, 3 skeletons `animate-pulse` con `motion-reduce:animate-none`, `role="status"`, `aria-label="Cargando información"`, `sr-only` "Cargando información…" | **COMPLETO** — skeleton de shell, no de contenido. Hay `wait(420)` por acción, pero **ninguna pantalla skeletoniza**. P2-38 |
| **EMPTY** | SI | `Empty` con título + detalle + acción opcional. 8 usos reales | **COMPLETO** — `Home` sin eventos hoy, `Calendar` sin eventos, `CommunicationHome` sin conversaciones, `Attendance` sin abrir, `Selection` sin publicar, `ConversationPage` sin mensajes, `AuditPage` sin entradas, `PeopleManagement` sin resultados, más los 14 gates de acceso | |
| **ZERO** | SI | Derivado naturalmente (0 presentes / 0 jugadoras / 0% presencia) | **PARCIAL** — `ReportDetail:672` devuelve `"—"` cuando `events.length === 0` ✓, y el pie de tabla dice *"Sin registros no se interpreta como cero actividad histórica"* ✓. Buena intención, pero **no hay un estado ZERO explícito** en ninguna otra parte → P2-39 |
| **ERROR** | SI | `Alert tone="error"` en 12 sitios; `scenario=degraded` global; `scenario=stale` y `impact-changed` en `eventChange`; errores de validación en 8 formularios | **COMPLETO** — y con el copy correcto de §47: *"No pudimos actualizar la información. Tus cambios locales se conservan."* / *"No pudimos confirmar el resultado."* (el segundo no está; ver P2-25b) |
| **SAVING** | SI | `pending` + `<Saved saving />` + botones "Guardando…" / "Publicando…" / "Cerrando…" / "Finalizando…" / "Creando…" | **COMPLETO** |
| **SAVED** | SI | `<Saved saving={false} />` → *"Guardado"*; `saveState === "Guardado"` en SelectionPage; toasts "Cambio confirmado" | **PARCIAL** — `Saved` se usa **1 sola vez** (AvailabilityPage:123). SelectionPage reimplementa el status inline con otro markup. Duplicación → P3-16 |
| **CONFLICT** | **PARCIAL** | `eventChange` lanza `"Este evento cambió mientras lo estabas editando."` si `version !== expectedVersion`; `scenario=stale` fuerza un conflicto concurrente; `scenario=impact-changed` fuerza `IMPACT_CHANGED` con el copy exacto de §37 | **INCOMPLETO** — hay **mensaje** de conflicto pero **no hay Conflict Workspace**: no se muestra baseline vs localDraft vs latestServer lado a lado como exige §73 / §44. Solo un `Alert` con un botón "Revisar cambios actuales" → P1-08 |
| **OFFLINE / DEGRADED** | PARCIAL | `?scenario=degraded` → banner `Alert tone="error"` en el Shell (`Shell.tsx:230-240`) con copy §47 | **INCOMPLETO** — es un banner informativo; no hay comportamiento degradado real (no hay red que simular). Para un prototipo visual es aceptable → P4-15 |

## 9.2 Estados de dominio

| Estado §4/§9 | ¿Existe en el modelo? | ¿Alcanzable por interacción? | ¿Visible? | Trigger |
|---|---|---|---|---|
| **DRAFT** (Event) | SI (`model.ts:2`) | SI — EventForm "Guardar borrador" | SI — Badge `DRAFT`, `EventRow` filtra DRAFT fuera del calendario | Crear evento sin programar |
| **SCHEDULED** | SI | SI | SI | Default de la semilla (5 eventos) |
| **POSTPONED** | SI | SI | SI — Badge warning, "A definir" | Menú "Postergar" |
| **CANCELLED** | SI | SI | SI — Badge danger, chip con `line-through` en calendario | Menú "Cancelar" |
| **IN_PROGRESS** | SI | SI | SI — "En curso" | Menú "Iniciar evento" (seed: `match-lomas`) |
| **COMPLETED** | SI | SI | SI — Badge success, "Finalizado" | Finalize MatchRecord / "Finalizar entrenamiento" |
| **ABANDONED** | SI | SI (vía MatchRecord) | SI — Badge "Abandonado" | MatchRecord status ABANDONED + Finalizar |
| **PUBLISHED** (Announcement / Selection) | SI | SI | SI — Badge success, Alerts explícitos | Publish Announcement / Publish Selection |
| **ARCHIVED** | SI (Announcement, Team) | SI (Announcement) | **RARO** — solo el Badge en el detalle; sigue listado para SUBCOMMITTEE y legible por todos → P2-27b/c | "Archivar comunicado" |
| **Needs reconfirmation** | SI (derivado) | SI (derivado) | SI — 5 superficies | `availability.revision !== event.revision` |
| **Eligibility conflict** | SI (derivado) | SI (derivado) | SI — `conflicts` / `publishedConflicts` + alerta | `eligibility !== ELIGIBLE` o `team !== event.team` |
| **Unread** (Conversation) | SI | SI | SI — badge numérico + dot | `conversation.unread > 0` |
| **Unread** (Notification) | SI (`readBy`) | SI | SI — badge del Shell + dot + filtro | Click / mark all |
| **Closed Attendance** | SI | SI | SI — Badge "Cerrada" + Alert success + botón "Corregir asistencia" | `attendanceClosed` |
| **Unrecorded Attendance** | SI (derivado por ausencia) | SI | SI — contador, "Sin registrar", columna propia en el reporte | `!event.attendance[id]` |
| **Final MatchRecord** | SI | SI | SI — Badge "Resultado final · X – Y" | `record.state === "FINAL"` |
| **Correction** | SI ( Attendance, MatchRecord, Announcement) | SI | SI — Alerts "Estás corrigiendo…" + motivo obligatorio | Botón "Corregir" |
| **NO_RESPONSE** | SI (derivado) | SI | SI — "Sin respuesta" | sin row en availability |
| **Invalid Role Scope** (`422`) | — | **NO** | — | La UI no puede producir una combinación inválida → correcto por construcción |
| **LAST_ADMIN_REQUIRED** | SI | SI | SI — mensaje + botón disabled | Intentar deshabilitar al último admin |
| **PLAYER_PROFILE_INCOMPLETE** | SI | SI | SI — mensaje explícito | Asignar equipo sin dni/birth/phone/email |
| **COMPETITION_SCOPE_MISMATCH** | — | **NO** | — | Sin validación → P2-33 |
| **STALE_VERSION** | SI | SI (`?scenario=stale`) | SI | `eventChange` version check |
| **IMPACT_CHANGED** | SI | SI (`?scenario=impact-changed`) | SI — copy exacto de §37 | `scenarioTriggered` |
| **SAVE_ERROR** (Selection) | SI | SI (`?scenario=save-error`) | SI — "Error al guardar" | `scenario === "save-error"` en el autosave |
| **CONFLICT** (Selection autosave) | — | **NO** | — | Ausente → P2-05 |
| **Session interrupted** | — | **PARCIAL** | — | `?scenario=session-interrupted` solo arranca con `authenticated=false` → parece un cold boot en `/login`, **no** una interrupción de sesión (§73) → P2-25 |
| **Idempotency / ambiguous retry** | — | **NO** | — | Fuera del alcance visual |

## 9.3 Matriz resumen

| Categoría | Implementados | Parciales | Ausentes |
|---|---|---|---|
| Estados de UI (8) | 5 | 3 (SAVED, ZERO, OFFLINE) | 0 |
| Estados de dominio (17) | 17 | 0 | 0 |
| Estados de error del catálogo §38 (20) | 3 | 0 | 17 |

**El coverage de estados de dominio es del 100%.** Es un resultado inusualmente bueno y probablemente el segundo punto fuerte del proyecto, después de la autoridad.

---

# 10. FASE 8 — RESPONSIVE AUDIT

Objetivos: 390px, 768px, 1440px. Sólo reporte, sin rediseño.

## 10.1 390px (mobile)

| Superficie | Estado | Nota |
|---|---|---|
| Sidebar desktop | **OCULTO** ✓ | `hidden lg:flex` |
| Bottom nav mobile | **PRESENTE** ✓ | 5 destinos, `pb-[env(safe-area-inset-bottom)]` ✓ |
| `main` clearance | ✓ | `pb-28` (112px) limpia la bottom nav (~64px) |
| Header | ✓ | 65px sticky, logo en mobile, Search + Bell + Avatar |
| Home | ✓ | 1 columna; el aside `TU EQUIPO` solo si `actor.team` |
| Calendar | ✓ | Grilla de mes `hidden md:block` en mobile → **agenda list** |
| Toggle Mes/Agenda | **OCULTO en mobile** | `hidden md:flex` → mobile queda fijo en agenda. Correcto |
| Filtros de Calendar | ✓ | `w-32` + `w-36` = 280px; disponible ~350px → cabe |
| Selection (tabla) | ✓ | Header `hidden sm:grid`; filas `flex flex-wrap` → stack. Pierde alineación de columnas pero es legible |
| Attendance | ✓ | `flex flex-wrap justify-between` |
| MatchRecord | ⚠ | `grid-cols-[1fr_50px_55px_55px]` en base — 4 columnas en ~310px. Funciona con valores 0-9, se apila con 2 dígitos |
| Reports (tabla) | ✓ | `min-w-[560px]` **dentro de** `overflow-x-auto` → scroll horizontal correcto |
| PeopleManagement | ✓ | Header y celdas `hidden md:*`; en mobile solo nombre + badge de cuenta |
| Structure tabs | ✓ | `overflow-x-auto` |
| PersonAdminDetail | ✓ | `xl:grid-cols-[1fr_320px]` → 1 columna |
| Modales | ✓ | `items-end` → bottom sheet, `max-h-[90dvh]`, `rounded-t-2xl` |
| Sticky action bars | ✓ | `bottom-20` (80px) en los 4 formularios, limpia la bottom nav |
| **ConversationPage** | ✗ | `h-[calc(100dvh-280px)]` asume 280px de cromo; real ≈315px → el composer queda ~35px bajo el viewport, bajo la bottom nav → **P2-23** |
| Notification bar | ✓ | `bottom-24` |

## 10.2 768px (tablet)

| Superficie | Estado |
|---|---|
| Sidebar / bottom nav | Bottom nav (lg = 1024px) — consistente con el breakpoint |
| Calendar | Grilla de mes **visible** + toggle Mes/Agenda aparece |
| Calendar legend | Visible (es `flex` sin gate) |
| Home | 1 columna; el aside queda debajo (xl = 1280px) |
| Selection | `sm:grid-cols-[1fr_180px_100px_80px]` en ~704px disponibles → cabe |
| Attendance / MatchRecord | OK |
| Management detail | 1 columna |
| Reports | `min-w-[560px]` en 704px → **cabe sin scroll** ✓ |
| PeopleManagement | Grilla completa con header visible |

## 10.3 1440px (desktop)

| Superficie | Estado |
|---|---|
| Sidebar | 224px fijo + `lg:pl-[224px]` |
| `main` | `max-w-[1440px]`, `lg:px-10` |
| Home | 2 columnas `[minmax(0,1fr)_300px]` (xl) |
| Selection / Attendance / MatchRecord | `max-w-4xl` (896px) — centrado,no aprovecha el ancho pero es una decisión de lectura |
| ConversationPage | `max-w-4xl`, `h-[calc(100dvh-280px)]` |
| Management person detail | `[1fr_320px]` |
| Footer | Visible (`lg:flex`) |
| Búsqueda | `⌘K` kbd visible (`md:inline`) |

## 10.4 Anchos fijos peligrosos

| Ancho | Ubicación | Riesgo |
|---|---|---|
| `w-[224px]` + `lg:pl-[224px]` | Shell | **NINGUNO** —emparejado |
| `max-w-[1440px]` | Shell main | NINGUNO |
| `max-w-[2xl/3xl/4xl]` | 12 pantallas | NINGUNO |
| `min-w-[560px]` | Reports | **NINGUNO** — dentro de `overflow-x-auto` |
| `h-[420px]` (min) + `calc(100dvh-280px)` | ConversationPage | **SÍ** → P2-23 |
| `grid-cols-[1fr_50px_55px_55px]` / `[1fr_180px_100px_80px]` | MatchRecord / Selection | **BAJO** — bounded por el `max-w` del padre |
| `w-32` / `w-36` | Calendar filters | NINGUNO |
| `max-w-[85%]` / `sm:max-w-[70%]` | Burbuja de mensaje | NINGUNO |

**Cero inline styles.** Verificado por grep: `style={` no aparece en ningún archivo de `src/`.

## 10.5 Overflow

- **Verificado:** el único elemento con ancho mínimo mayor que su contenedor (`min-w-[560px]`) está envuelto en `overflow-x-auto`.
- **Verificado:** `StructurePage` tabs en `overflow-x-auto`.
- **Verificado:** `ConversationPage` mensajes en `overflow-y-auto`.
- **Verificado:** `NewConversation` lista de participantes en `max-h-80 overflow-y-auto`.
- **Verificado:** `Modal` body en `overflow-y-auto`, con `max-h-[90dvh]`.
- **Riesgo residual:** `Home` línea 73 es extremadamente larga (una sola expresión ternaria anidada de ~200 caracteres) — mantenibilidad, no layout.

## 10.6 Supuestos desktop-only

**Ninguno encontrado.** Es el punto más fuerte del proyecto en esta fase: el responsive es real, no un afterthought de Figma.

Únicas dos excepciones ya listadas: la altura del panel de conversación (P2-23) y la pérdida de alineación de columnas en Selection en mobile (aceptable).

---

# 11. FASE 9 — VISUAL SYSTEM AUDIT

Sin rediseño subjetivo. Evaluación de consistencia del sistema generado.

## 11.1 Tokens

`src/styles/theme.css` — 17 variables. **CONSISTENTE.**

| Grupo | Tokens | Nota |
|---|---|---|
| Base | `--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--border` | 7 |
| Marca | `--primary`, `--primary-foreground`, `--primary-soft` | 3 |
| Semánticos | `--success(+soft)`, `--warning(+soft)`, `--danger(+soft)` | 6 |
| Forma | `--radius` | 1 |

- Nombres **semánticos**, no arbitrarios (`--color-danger-soft` en vez de `--red-100`) ✓
- Paleta de **7 pasos** para surfaces (`background` → `card` → `muted` + `-soft` variants) — suficiente profundidad sin ser Minimal-flat.
- `--radius: 0.65rem` declarado pero **nunca consumido** (Tailwind usa su propia escala `rounded-*`) → P4-16.
- **Ausentes:** tokens de spacing, tipografía, sombras, z-index, motion. Tailwind provee los defaults. Aceptable para un prototipo, pero significa que el "design system" es medio-tokens / medio-defaults → P3-17.

**KEEP.** Es la pieza mejor resuelta.

## 11.2 Typography

Escala observada: 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 27px. Densidad alta y **consistente**.

- Familia única (Inter variable) ✓
- Pesos: 400/450/500/550/600/650/700/750/800 ✓
- Jerarquía: `text-[27px]` títulos de página / `text-[15px]` section / `text-[13px]` cuerpo / `text-[11px]` secundario / `text-[10px]` metadatos / `text-[9px]` eyebrows ✓
- **Problema:** 9px y 10px están por debajo del mínimo cómodo de legibilidad. §78 lista *"actual accessibility behavior"* como EVIDENCE PENDING, así que el Freeze no pone un piso tipográfico — pero 9px es un **P4 de accesibilidad**, no de Product Truth → P4-17.
- `tabular-nums` usado correctamente en scores, contadores y resultados ✓

**POLISH.**

## 11.3 Spacing, radii, borders, shadows

- **Spacing:** escala Tailwind estándar, consistente. `gap-2 / 3 / 3.5 / 4 / 5 / 6 / 7 / 8`. `gap-3.5` (`overview.tsx:169`) y `gap-2.5` son los únicos no-default — ** outliers menores** → P4-18.
- **Radii:** gramática consistente de 4 niveles (`md` chips, `lg` controls/surfaces, `xl` cards, `2xl` modales). ✓
- **Borders:** `border-border` en todo; separadores `border-b` en listas. Consistente ✓
- **Shadows:** **solo 2** en todo el proyecto — `shadow-lg` (menú contextual, `events.tsx:193`, `communication.tsx:465`) y `shadow-xl` (toast, `Shell.tsx:290`) y `shadow-2xl` (modal, `ui.tsx:373`) y `shadow-sm` (sticky bar de Selection). **4 niveles para 3 patrones (dropdown/modal/toast/sticky)** → consistente por uso. La ausencia total de elevación sutil es una decisión, no un descuido.

**KEEP.**

## 11.4 Icons

`lucide-react` **exclusivamente**. Sin SVG inline, sin duplicados, sin icon font.

- `EventIcon` mapea MATCH→`Flag`, TRAINING→`Dumbbell`, else→`CalendarDays` ✓
- Todos con `strokeWidth={1.7}` o default — consistencia visual ✓
- Todos los icon-only tienen `aria-label` + `title` (via `IconButton`) ✓
- Iconos importados pero **no usados** (limpieza): `ChevronRight`, `Flag`, `Bus`, `Plus`, `Users`, `CheckCircle2`, `Search`, `ShieldAlert`, `Trash2`, `KeyRound`, `ArrowRight`, `Search` (management)

**KEEP** el sistema; **FIX** los imports muertos.

## 11.5 Surfaces, tablas, listas

| Patrón | Implementación | Veredicto |
|---|---|---|
| Card | `Surface` = `rounded-xl border border-border bg-card` | **KEEP** |
| Lista | `RowLink` / `EventRow` = `flex items-center gap-3 border-b px-5 py-4 hover:bg-primary-soft/35` | **KEEP** |
| Encabezado de lista | `Header` = eyebrow + back + título 27px + descripción + action | **KEEP** |
| Tabs | `border-b-2 border-primary text-primary` (3 variantes distintas en 4 sitios, mismo grammar) | **KEEP** |
| Tabla | Solo en `ReportDetail`, con `thead bg-muted/40 text-[10px]` + `tabular-nums` + `overflow-x-auto` | **KEEP** |
| Filtro | `Select` con label explícito, `w-full` | **KEEP** |
| Form field | `TextField`/`Select`/`TextArea` con `label` + `rounded-lg border` + `disabled:bg-muted` | **KEEP** |
| Menú contextual | Dropdown inline (4 sitios) sin click-outside ni Escape | **POLISH** → P4-19 |
| Empty | `border-dashed` + icono + título + detalle | **KEEP** |

**Notable:** las tablas tipo "grid de columnas con header" (Selection, MatchRecord, PeopleManagement) usan el mismo grammar (`hidden sm:grid` header + filas con el mismo template), lo que produce **coherencia de responsive table** entre tres pantallas distintas. Eso es bueno.

## 11.6 Acciones primary / secondary / destructive

| Nivel | `Button variant` | Uso | Veredicto |
|---|---|---|---|
| Primary | `bg-primary text-white hover:bg-primary/90` | Acción principal del contexto | **KEEP** |
| Secondary | `border border-border bg-card hover:bg-muted` | Acción alternativa | **KEEP** |
| Ghost | `text-muted-foreground hover:bg-muted` | Acciones terciarias (menús, "Archivar") | **KEEP** |
| **Danger** | `bg-danger text-white hover:bg-danger/90` | **Solo 1 uso en toda la app**: el botón de confirmar "Cancelar evento" (`events.tsx:583`) | **KEEP la gramática; POLISH la aplicación** |

**Problema de tratamiento destructivo:** el destructivo canónico del sistema es **"Cancelar evento"**, y está bien tratado (variant `danger` + el ítem del menú ya es `text-danger hover:bg-danger-soft`). Pero **"Archivar comunicado"** usa `variant="ghost"` sin señal de destructividad (`communication.tsx:632-639`) — archivar es irreversible visualmente. Y **"Archivar"** en StructurePage también es `ghost`. Y **"Deshabilitar cuenta"** es `ghost` (`management.tsx:883-898`). Inconsistencia → **P4-20**.

## 11.7 Presentación de estado

`Badge` (`ui.tsx:97-128`) con mapa de tonos hardcodeado:

```
success → COMPLETED, FINAL, PUBLISHED, ELIGIBLE, ACTIVE, YES, PRESENT
warning → POSTPONED, PENDING, RECONFIRM, MAYBE
danger  → CANCELLED, BLOCKED, DISABLED, NO, ABSENT
neutral → default
```

- Coherente y consistente en toda la app ✓
- **Problema de diseño:** el mapa de tonos es una lista de literales de estado hardcodeada en un componente de presentación. Si el dominio agrega un estado, hay que editar `ui.tsx`. Debería ser una tabla `Record<DomainState, Tone>`Exportada desde el dominio → **P3-18**.
- Los tonos semánticos de color coinciden con los tokens (`success-soft`/`success`, `warning-soft`/`warning`, `danger-soft`/`danger`) ✓
- `labels` (`model.ts:172-206`) es un diccionario **catch-all**: `labels[value] || value` renderiza cualquier string. Esto enmascara estados inventados → **P3-19**.

**KEEP la gramática. FIX la fuente de verdad.**

## 11.8 Responsive grammar

Coherente y consistente en todo el proyecto (§10). Sin un solo breakpoint ad-hoc.

**KEEP.**

## 11.9 Clasificación final del sistema visual

### KEEP (conservar prácticamente intacto)

| Elemento | Evidencia | Razón |
|---|---|---|
| **Design tokens** | `src/styles/theme.css` | 17 tokens semánticos, centralizados, correctamente mapeados. Lo mejor del proyecto |
| **17 primitives de UI** | `src/shared/ui.tsx` | API consistente, radio grammar unificado, touch targets explícitos, `role`/`aria-label` correctos |
| **Shell (sidebar + bottom nav)** | `src/app/Shell.tsx` | Mismos destinos en ambos (§40), safe-area, `⌘K`, badges derivados del estado |
| **`Modal`** | `src/shared/ui.tsx:316-391` | Focus trap con ciclo de Tab, Escape, scroll lock, restauración de foco, `aria-modal`, bottom sheet en mobile. **Por encima del promedio** |
| **Jerarquía de Home** | `src/features/overview.tsx:120-379` | §24 `WHAT MATTERS NOW` primero, luego Hoy, Próximamente, Comunicaciones; aside TU EQUIPO / Próximo partido |
| **`Empty` + `Alert`** | `src/shared/ui.tsx:271-315` | API de tonos consistente, `role` correcto. Habilita §24 `empty != zero != error` |
| **Lista grammar (`RowLink`/`EventRow`)** | `src/shared/ui.tsx:392-488` | Un solo patrón para todas las listas del proyecto |
| **Responsive grammar** | transversal | Breakpoints consistentes, cero inline styles, cero overflow |
| **Icon system** | `lucide-react` | 100% consistente, sin duplicados, con labels |
| **Acciones primary/secondary/ghost** | `src/shared/ui.tsx:31-55` | Gramática clara |

### POLISH

| Elemento | Razón | Sev |
|---|---|---|
| Escala tipográfica | 9px / 10px por debajo del mínimo cómodo | P4-17 |
| `Empty` siempre usa `CalendarDays` | Icono semánticamente incorrecto en 404, no-access, restricted, empty de búsqueda | P4-21 |
| Token `--radius` sin consumir | Declarado y nunca usado | P4-16 |
| `gap-2.5` / `gap-3.5` | Outliers frente a la escala Tailwind estándar | P4-18 |
| Dropdowns sin click-outside / Escape | 4 sitios | P4-19 |
| Tratamiento destructivo inconsistente | "Archivar" y "Deshabilitar cuenta" en `ghost` sin señal | P4-20 |
| `Badge` sin `tone` explícito en `AttendancePage:569-577` y `EventDetail:417-423` | Pasa `value="DRAFT"` con children "Cerrada" → el color del badge no corresponde al estado | P4-22 |
| Tabla de Reports sin estado vacío en `<tbody>` | Header con 0 filas | P2-39 |
| Legend del calendario vs color real de CLUB_EVENT | Legend dice warning (amarillo), el chip renderiza success (verde) | P2-34b |

### REBUILD

| Elemento | Razón |
|---|---|
| **Token set completo** | Solo hay color y radius. Faltan spacing, typography, shadow, motion, z-index como tokens. Hoy Tailwind provee defaults que nadie controla |
| **`Badge` tone map como fuente de verdad** | Debe vivir en el dominio, no en el componente de presentación |

---

# 12. FASE 10 — CODE QUALITY / HANDOFF AUDIT

## 12.1 Giant files

**Sí, y es el problema estructural principal.**

| Archivo | Líneas | Pantallas | Freeze §39 esperaría |
|---|---:|---:|---|
| `src/features/management.tsx` | 1390 | 6 | `features/management/{people,structure,competitions}/` |
| `src/features/events.tsx` | 1339 | 4 | `features/events/{detail,form,jornadas}/` |
| `src/features/participation.tsx` | 1124 | 4 | `features/participation/{availability,selection,attendance,match-record}/` |
| `src/features/communication.tsx` | 944 | 6 | `features/communication/{announcements,conversations,notifications}/` |
| `src/features/overview.tsx` | 916 | 6 | `features/{home,calendar,teams,people,search}/` |
| `src/features/account-insight.tsx` | 784 | 8 | `features/{profile,auth,reports,audit}/` |
| **Total features** | **6.497** | **34** | |

**`overview.tsx` y `account-insight.tsx` son "god files por número de rutas":** `account-insight.tsx` contiene Login, Activate, NoAccess, More, Profile, Reports, ReportDetail y AuditPage — **dominios completamente distintos** (auth, perfil, insight) en un archivo. Lo que une esos archivos es unaAGRUPACIÓN POR TAMAÑO DE ARCHIVO DE FIGMA, no una frontera de dominio.

`overview.tsx` idem: Home, Calendar, Teams, TeamDetail, PersonDetail, SearchPage.

Afortunadamente, `events.tsx` y `participation.tsx` **sí** están agrupados por dominio (eventos; participación). Y `management.tsx` también. La agrupación es inconsistente: 3 de 6 archivos sí respetan el dominio; 3 no.

→ **P3-04** (deuda estructural).

## 12.2 Route organization

- `src/app/App.tsx` concentra las 41 rutas en un array plano. **Aceptable** para 38 rutas; se rompe alrededor de 80.
- **No existe `src/routes/`.** §39 lo prescribe explícitamente.
- **No existe `src/app/router/`.** §39 lo prescribe. El router vive en `src/app/App.tsx`.
- Los componentes de pantalla se importan directamente desde `features/` en el router, sin una capa de route modules. No hay `lazy()`.
- Los paths de param usan **nombres inconsistentes** respecto a los params: `/teams/:teamId` → `TeamDetail` ✓, `/people/:personId` ✓, `/events/:eventId` ✓, pero `/announcements/:id` → usa `id` (no `:announcementId`), `/conversations/:id` → `id`, `/management/people/:id` → `id`, `/management/teams/:id` → `id`, `/management/competitions/:id` → `id`, `/jornadas/:jornadaId` → `jornadaId`. §23 usa `:id` para announcements y `:teamId` para teams, así que el código **copia el Freeze literalmente** — bien. Pero `/management/people/:id` en §23 también es `:id` ✓. **Consistente con el Freeze.** ✓

→ **P3-05** (deuda, no defecto).

## 12.3 Component boundaries

- **Bien:** los 17 primitives están en `shared/ui.tsx` y son agnósticos de dominio excepto `EventRow`/`EventIcon` (que importan `Event` de `mock/model`).
- **Mal:** `shared/ui.tsx:446` importa `useProduct()` de `../mock/store`. Un primitive de presentación **consumiendo el store de dominio** es una inversión de dependencia. `EventRow` debería recibir `teamName` como prop → **P3-02**.
- **Mal:** features importan features:
  - `participation.tsx:13` → `import { useEvent } from "./events"`
  - `account-insight.tsx:30` → `import { Restricted } from "./management"`
  
  §39 define `routes -> features -> shared`. No hay features→features. `useEvent` debería estar en `shared/hooks/` o en un `features/events/` barrel. `Restricted` debería estar en `shared/patterns/`.

→ **P3-02 / P3-06**.

## 12.4 Feature organization

❌ No hay sub-organización. `features/` tiene 6 archivos, no 34 módulos.

## 12.5 Design tokens centralizados

✅ **Sí** — `src/styles/theme.css`. Única fuente de verdad. KEEP.

## 12.6 Mock data centralizado

✅ **Sí** — `src/mock/seed.ts`, una función `createSeed()`. Sin duplicación.

## 12.7 State centralizado

✅ **Sí** — `src/mock/store.tsx`, un `MockAppProvider`. Sin duplicación de verdad de servidor.

## 12.8 Datos hardcodeados duplicados

**Este es el punto más sucio del código.** Strings literales que deberían derivarse del estado:

| Literal | Ubicaciones | Debería ser |
|---|---|---|
| `"2026-10-02"` (el "hoy") | `overview.tsx:53,58,534,721` + `account-insight.tsx:717` + `seed.ts:116,261` + `management.tsx:592,600,610,634,642` + `communication.tsx:725` | Un reloj / `new Date()` |
| `"Sexta A"` | `Shell.tsx:170`, `overview.tsx:560,362`, `management.tsx` | `state.teams.find(...)` |
| `"6A"` (badge del team) | `overview.tsx:280-281` | derivado de division + line |
| `"Alvear 1240 · Ituzaingó"` | `events.tsx:345` | `venue.address` (§19) |
| `"Tomás Beltrán"` / `"/people/coach"` | `overview.tsx:709,712` | derivado de `state.people` |
| `"GEI-2026-4812"` | `management.tsx:657`, `account-insight.tsx:391` | generado, no literal compartido |
| `"2026"` | `events.tsx:1147,1169`, `management.tsx:1205`, `overview.tsx` (×5) | `state` actual |
| `"/conversations/c2"` | `overview.tsx:366` | `conversation.id` derivado de la capitana |
| `"/jornadas/j1"` | `account-insight.tsx:73` | `state.jornadas[0].id` |
| `"Vienes a..." / "Hoy 2 de octubre"` | `communication.tsx:399,404` | derivado |
| `"2 oct 2026 · Ahora"` | `store.tsx:112`, `participation.tsx:310` | `new Date()` |

**Consecuencia concreta y observable:** después de un "Mover de equipo" en Management, el Home sigue mostrando el badge `6A` y el Shell sigue diciendo `· Sexta A` para un entrenador movido a Quinta. **La app muestra información falsa después de una interacción legítima.** → **P2-33b / P2-21 / P3-08**.

## 12.9 Navegación duplicada

- `nav` (los 5 destinos) está definido **una sola vez** en `Shell.tsx:28-34` y se usa en sidebar y bottom nav ✓ **KEEP**.
- `sectionActive()` una sola vez ✓
- El breadcrumb del header (`Shell.tsx:182-196`) es un ternario anidado de 6 niveles. Funciona pero es frágil: no cubre `/jornadas`, `/announcements`, `/conversations`, `/more`, `/reports`, `/search` → todos caen en `"Mi espacio"` → **P3-09**.
- `MorePage` duplica links que ya están en el sidebar (Administración, Auditoría, Competiciones). Aceptable — `Más` es un hub por diseño §23.

## 12.10 Status labels duplicados

- `labels` (`model.ts:172-206`) es el diccionario central ✓ **KEEP**.
- Pero el mapa de tonos de `Badge` (`ui.tsx:104-120`) es un **segundo** diccionario hardcodeado de estados, en un archivo de presentación → **P3-18**.
- Y hay strings de estado literales inline que no pasan por `labels`: `"Geometría"`... no. Concretamente `"Guardado"`, `"Cambios pendientes"`, `"Guardando…"`, `"Error al guardar"` (`participation.tsx:185,203,206,211`) son un **tercer** diccionario, local a un componente.
- `availabilityLabel()` (`model.ts:226-232`) devuelve strings en español fuera de `labels` ("Sin respuesta", "Necesita reconfirmación") → cuarto diccionario.
- `JornadaPage` copia los valores de estado sin pasar por `labels` (`events.tsx:1205`).

→ **P3-18**: 4 fuentes de verdad para labels/estados.

## 12.11 Iconos duplicados

No. Solo imports muertos (ver 11.4). Ninguna duplicación de glifo.

## 12.12 Inline styles

**Cero.** Verificado por grep sobre `src/`. ✅

## 12.13 Dependencias innecesarias

| Dependencia | ¿Necesaria? | Nota |
|---|---|---|
| `react`, `react-dom` | SI | §39 |
| `react-router` v7 | SI | §39 ("React Router"). Se usa `createBrowserRouter` de `react-router`, no `react-router-dom` — correcto para v7 |
| `lucide-react` | SI | No está en §39, pero §81 permite que Figma defina componentes. **Desvío documentado, aceptado** |
| `tailwindcss` + `@tailwindcss/vite` | SI en la práctica | **Pero §39 prohíbe Tailwind como dependencia arquitectónica** → P1-01 |
| `typescript`, `vite`, `@vitejs/plugin-react` | SI | §39 |
| `oxfmt` | SI | herramienta del scaffold Figma |
| `@types/*` | SI | |
| — | **FALTAN** | `@tanstack/react-query`, `react-hook-form`, `zod` (§39) → P3-10 |

## 12.14 Dead code

**25 imports de valor no usados, en 7 archivos:**

| Archivo | Imports muertos |
|---|---|
| `Shell.tsx` | `Button` |
| `account-insight.tsx` | `dateLabel`, `Section`, `TextArea` |
| `communication.tsx` | `Users`, `Trash2`, `labels`, `TextLink` |
| `events.tsx` | `ChevronRight`, `Flag`, `Bus`, `Plus`, `availabilityLabel` |
| `management.tsx` | `Search`, `KeyRound`, `ArrowRight`, `ChevronRight` |
| `overview.tsx` | `useNavigate`, `availabilityLabel` |
| `participation.tsx` | `Users`, `CheckCircle2`, `Search`, `ShieldAlert`, `useProduct` |

**`tsconfig.json` NO tiene `noUnusedLocals` ni `noUnusedParameters`** → nada los detecta. Un build pasa limpio con 25 imports muertos.

**Exports muertos:** ninguno detectado (todos los exports tienen al menos un consumidor).

**Campos muertos en el modelo:** `Person.eligibilityReason`, `Person.eligibilitySource` (`model.ts:27-28`) — declarados, nunca asignados, nunca leídos. `Person.roleAssignments?` es opcional y nunca se setea en la semilla.

**Componente casi muerto:** `Saved` (`ui.tsx:503-517`) — 1 uso en 34 pantallas. `TextLink` — 4 usos. `IconButton` — 8 usos.

→ **P3-11**.

## 12.15 Rutas inalcanzables

- **`/jornadas/new`** — existe en el router, es deep-link safe, pero **ningún enlace de la UI apunta a ella**. Verificado: `MorePage:73` → `/jornadas/j1`; `Calendar` sin entrada de jornada; `EventDetail:529` → detalle; `JornadaPage:1160` → `back="/calendar"`. → **P2-32**.
- **`/no-access`** — alcanzable solo por redirect automático o `?scenario=no-access`. No hay enlace. Correcto (es un destino de error).
- **`/activate`** — alcanzable desde `/login` ✓.
- **`*` (404)** — alcanzable por URL inválida ✓.

## 12.16 Imports rotos

**Verificado: cero.** Todos los imports resuelven a exports existentes. El proyecto compila (asumiendo `pnpm install`; no se ejecutó por instrucción).

## 12.17 Calidad de TypeScript

- `strict: true` ✓, `noFallthroughCasesInSwitch: true` ✓, `noEmit: true` ✓, `isolatedModules: true` ✓
- **Ausentes:** `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. La ausencia de `noUncheckedIndexedAccess` es la que permite `state.people.find(...)!.nonNullAssertion` en 12 lugares, que es donde aparecen la mayoría de los bugs de undefined.
- TypeScript bien usado: un solo `as` questionable (`EventForm:768` `as Partial<Event>`), dos no-null assertions de seed (`store.tsx:59` `person!`), y muchos `!` de `.find()`.
- El tipado del dominio es **fiel a las reglas del Freeze**: `EventState` con los 7 estados exactos, `Response` con YES/MAYBE/NO, `AttendanceValue` con PRESENT/ABSENT/JUSTIFIED, `Role` con los 5 roles exactos, `RoleAssignment.scope` con CLUB/TEAM/EVENT, `Team.state` con DRAFT/ACTIVE/ARCHIVED, `Competition.state` con DRAFT/ACTIVE/CLOSED, `CompetitionEntry.state` con PENDING/ACTIVE/ENDED, `Announcement.state` con DRAFT/PUBLISHED/ARCHIVED, `Conversation.kind` con TEAM/EVENT/DIRECT/GROUP, `MatchRecord.status` con PLAYED/FORFEIT/ABANDONED. **13/13 lifecycles correctamente tipados.** ✓

## 12.18 Nomenclatura de dominio

✅ **Correcta y canónica.** Se usan los términos del Freeze: Season/Division/Line/Team, Person, Membership (ausente), Availability/Selection/Attendance/Eligibility, Announcement/Conversation, MatchRecord, Jornada, Competition/CompetitionEntry, Audit.

❌ **Dos fusiones que el Freeze prohíbe explícitamente:**
1. `Person.role` (scalar) — §8 PEOPLE no tiene un "role" en Person; el role vive en RoleAssignment.
2. `Person.team` (scalar) — §17 distingue Membership de TeamAssignment.

❌ **Un término incorrecto:** `event.history: string[]` es esencialmente una mini-tabla History genérica. §71 dice *"No generic History table"*. Aquí es un array de strings por evento que **duplica** lo que ya está en `state.audit[]`. No es una tabla, pero sí es historial genérico duplicado → P3-13.

❌ **`labels` traduce `PENDING` a "Pendiente", `ACTIVE` a "Activo", `CLOSED` a "Cerrada", `ENDED` a "Finalizada", `FINAL` a "Final"** — el mismo string de estado se traduce diferente según el dominio sin contexto. *"Cerrada"* tanto para Competition como para Attendance sheet. **Ambigüedad de copy** → P4-23.

## 12.19 Separación mock engine / UI

⚠️ **Separación parcial.**

**Bien:**
- El motor de estado está en `src/mock/` (4 archivos, 933 líneas), completamente aislado de `features/`.
- Los componentes de UI no mutan estado.
- La mutación es siempre vía `structuredClone` → inmutable.

**Mal:**
- `shared/ui.tsx` (capa UI) depende de `mock/store` y `mock/model` → **la capa más baja depende de la capa de mocks**.
- `features/*` importan `mock/model` para tipos **y** para `labels`/`dateLabel`/`eventName`/`initials`/`availabilityLabel` — funciones de presentación que deberían estar en `shared/lib`.
- `mock/model.ts` mezcla tipos de dominio con helpers de presentación.
- `mock/scenarios.ts` es un módulo con efecto de lado global (`window.location.search` a nivel de módulo) importado por `store`, `Shell` y `participation`.

→ **P3-02 / P3-20**.

## 12.20 Tests

**Cero.** No hay `*.test.*`, `*.spec.*`, ni configuración de test runner. `package.json` no tiene `test` script.

Para un prototipo visual de Figma Make es esperable. Pero §78 lista como EVIDENCE PENDING *"actual no-false-success UI"* y *"actual accessibility behavior"*, y §74 lista 39 escenarios E2E representativos. Sin tests, ninguna de esas cosas puede verificarse automáticamente → **P3-21**.

## 12.21 Versión control

**No hay repositorio git.** No hay forma de:
- distinguir cambios preexistentes,
- hacer un commit focalizado antes de editar (§AGENTS.md "commit focalizado"),
- comparar contra un baseline,
- revertir.

**Antes de la primera edición con OpenCode hay que inicializar git y hacer un commit del estado actual.** Es la primera acción del plan de reconstrucción.

---

# 13. FASE 11 — BACKEND CONTAMINATION CHECK

Búsqueda exhaustiva sobre `src/`, `index.html`, `vite.config.ts`, `package.json` de:

```
fetch( · XMLHttpRequest · axios · express · fastify · supabase · firebase
process.env · import.meta.env · WebSocket · EventSource · localStorage
sessionStorage · document.cookie · indexedDB · BroadcastChannel · serviceWorker
```

## Resultado: **0 coincidencias en `src/`**

| Categoría | Encontrado | Clasificación |
|---|---|---|
| API server (Express / Fastify / Hono) | **NO** | — |
| Dependencia de red real (`fetch`, XHR, axios) | **NO** | — |
| Supabase / Firebase / SDK de DB | **NO** | — |
| Código de base de datos / queries / migraciones | **NO** | — |
| Infraestructura de auth (JWT, cookies de sesión, CSRF) | **NO** | — |
| Cookies / sessions | **NO** | — |
| Crypto ( salvo `crypto.randomUUID()` ) | **NO** | **HARMLESS** — `store.tsx:14`, `events.tsx:800`, `communication.tsx:218,359`, `participation.tsx:307`, `management.tsx` — generación de ids mock |
| Workers / colas / jobs | **NO** | — |
| `process.env` en `vite.config.ts` | **SÍ** | **HARMLESS** — `FIGMA_PUBLIC_URL`, `FIGMA_DEV_SERVER_HOST`, `PORT`. Configuración de build de Figma Make, tiempo de build, nunca llega al bundle del cliente |
| WebSocket / SSE en `vite.config.ts` | **SÍ** | **HARMLESS** — `server.ws` es el HMR de Vite |
| `EventSource` | **NO** | — |
| Mutadores de storage del browser | **NO** | — |
| Service workers / offline | **NO** | — |

## Veredicto: **LIMPIO**

**El prototipo es 100% visual/mock.** No hay contaminación backend. Esto es notable porque Figma Make此类 scaffolds frecuentemente generan un `api/` o un `supabase/` cuando el prompt menciona "datos". Aquí no lo hizo.

**Nota (no contaminación):** §46 exige un *mutation journal* en `sessionStorage` con TTL 24h para comandos ambiguos. **No existe.** Es un gap de implementación, no backend no deseado. → P3-22.

**Nota (no contaminación):** `lucide-react` y `@tailwindcss/vite` son dependencias de tooling, no de backend. Correcto.

---

# 14. FASE 12 — FREEZE REVERSE AUDIT

Análisis inverso: qué hay en el código que el Freeze **no** justifica.

## 14.1 Extra screens / routes

| Extra | Justificación §23/§34/§81 | Veredicto |
|---|---|---|
| `/` redirect | convención SPA | JUSTIFIED |
| `/more` | §23 main nav incluye "Más" (solo declara `/more/profile`) | JUSTIFIED |
| `*` 404 | §34 semántica 404 | JUSTIFIED |
| Ninguna otra | — | — |

**UNJUSTIFIED_ROUTES = 0**

## 14.2 Extra features

| Extra | Justificación | Veredicto |
|---|---|---|
| `?demo=` switcher de actor (admin/subcommittee/player/captain/coach) | **Ninguna.** §3 OUT no lo lista; §81 prohíbe "new product scope" | **UNJUSTIFIED_FEATURE** — afordancia de desarrollo. Debe estar detrás de un flag o ser eliminada antes de cualquier entrega |
| `?scenario=` switcher: `no-access`, `session-interrupted`, `loading`, `degraded`, `stale`, `impact-changed`, `save-error` | **Parcialmente** justificado: representa §38 error codes y §24 estados. Pero es un harness de desarrollo expuesto en runtime | **UNJUSTIFIED_FEATURE** (parcial) — los *estados* están justificados, el *mecanismo* no |
| `LoginPage` bloque `<details>` con usernames demo | **Ninguna** (§48 opaque session) | **UNJUSTIFIED_FEATURE** |
| Código de activación literal `GEI-2026-4812` compartido entre admin UI y activate UI | **Ninguna** (§51 HMAC digest con `SETUP_TOKEN_KEY`, nunca en cliente) | **UNJUSTIFIED_FEATURE** — un secreto compartido en el bundle. En mock es inofensivo; en cualquier entrega es un anti-patrón |
| Calendar toggle Mes/Agenda | §81 layout/responsive composition | JUSTIFIED |
| Calendar legend | §81 componentes | JUSTIFIED |
| TeamDetail tabs Equipo/Eventos/Resultados | §7 "Team View ... proyecciones" | JUSTIFIED |
| `labels`/`dateLabel`/`initials`/`eventName`/`availabilityLabel` como presentacionales | — | JUSTIFIED |
| **Sin** analytics genérico / charts inventados | — | ✓ Correcto (§12 pide detectarlo: **no existe**) |
| **Sin** OAuth / forgot-password / payments / inventory / medical / venue booking / scouting / offline sync | §3 OUT | ✓ **Los 9 elementos OUT de §3 respetados** |

**UNJUSTIFIED_FEATURES = 4** (los 3 switchers de desarrollo + el código de activación compartido; el `<details>` de demo se cuenta dentro del switcher de credenciales).

## 14.3 Extra states

| Extra | Justificación | Veredicto |
|---|---|---|
| `"RECONFIRM"` como valor de Badge | No es un estado del Freeze. §4 deriva `NEEDS_RECONFIRMATION` | UNJUSTIFIED_STATE (cosmético) |
| Strings de save-state en español en `SelectionPage` en vez de SAVED/CHANGES_PENDING/SAVING/SAVE_ERROR/CONFLICT | §45 define los 5 códigos | UNJUSTIFIED_STATE (y falta CONFLICT) → P2-05 |
| Vocabulario libre de acciones: `"Reprogramar evento"`, `"Partido modificado"`, `"Postergar evento"`, `"Archivar estructura"`, `"Actualizar estructura"` usados como **action de audit Y título de notificación** | §22 define 8 notification types; §26 audit tiene forma estructurada | **UNJUSTIFIED_STATE** → P2-04 |
| `Notice` sin `notification_type` | §22 | UNJUSTIFIED_STATE |
| `Conversation.unread: number` como campo del agregado | §25 no lo tiene | UNJUSTIFIED_STATE → P2-13 |
| `Person.role` como estado ("¿es jugadora o capitana?") | §8/§17 | UNJUSTIFIED_STATE → P1-07 |
| Los 7 estados de Event, los 5 roles, los 3 de Availability, los 3 de Attendance, los 3 de Account, los 3 de Team, los 3 de Competition, los 3 de Entry, los 3 de Announcement, los 4 de Conversation, los 2 de MatchRecord | **Todos exactos según §9** | ✓ **CERO estados de dominio inventados** |

**UNJUSTIFIED_STATES = 5**

## 14.4 Extra roles

**CERO.** `Role = "COACH" | "PLAYER" | "CAPTAIN" | "ADMIN" | "SUBCOMMITTEE"` — exactamente los 5 de §5, en el orden del Freeze.

- Guardian **no** es un rol ✓ §5 *"Guardian no es Role"* — correcto por ausencia.
- **Cero roles inventados.** Fiel al Freeze.

**UNJUSTIFIED_ROLES = 0** ✓

## 14.5 Extra entities

| Entidad | ¿Está en §25? | Veredicto |
|---|---|---|
| `Person.role` (scalar) | **NO** — el role vive en RoleAssignment | **UNJUSTIFIED_ENTITY** |
| `Person.team` (scalar) | **NO** — Membership + TeamAssignment son las entidades | **UNJUSTIFIED_ENTITY** |
| `Person.eligibility` (enum plano de 3) | **NO** — §13 requiere scope + source + reason en EligibilityConstraint | **UNJUSTIFIED_ENTITY** (simplificación) |
| `Person.eligibilityReason`, `Person.eligibilitySource` | **SÍ** (§13) | JUSTIFIED pero **nunca implementados** |
| `StructureItem` (array heterogéneo con `type: string`) | **NO** — §25 tiene seasons, divisions, lines, teams, venues como tablas separadas | **UNJUSTIFIED_ENTITY** |
| `Notice.read: boolean` (global) | **NO** — §26 notifications tiene `read_at` por fila (= por destinatario) | **UNJUSTIFIED_ENTITY** (además duplica `readBy`) |
| `Conversation.unread: number` | **NO** | **UNJUSTIFIED_ENTITY** |
| `Competition.entries[].reference: string` | **NO** — §25 tiene `external_references` con target whitelist | **UNJUSTIFIED_ENTITY** (aplana ExternalReference) |
| `Competition.entries[].team` para scope LINE **y** TEAM | **NO** — §16 define identidades distintas | **UNJUSTIFIED_ENTITY** (fusiona dos FKs) |
| `Event.selection` + `Event.published` + `Event.selectionRevisions` | **SÍ** (flattening razonable de selection_sets/revisions/entries) | JUSTIFIED |
| `Event.availability: Record<id, {value, revision}>` | **SÍ** (flattening de availabilities) | JUSTIFIED |
| `Event.attendance: Record<id, value>` | **SÍ** (flattening de attendance_sheets/entries) | JUSTIFIED |
| `Event.record` con `stats: Record<id, PlayerStat>` | **SÍ** (flattening de match_records/player_match_stats) | JUSTIFIED |
| `Jornada.events: string[]` | **SÍ** (flattening de jornada_matches) | JUSTIFIED |
| `Event.clubWide: boolean` | **SÍ** (`club_wide_target`) | JUSTIFIED |
| `Event.attendanceOpened/Closed` | **SÍ** (`closed_at` derivado) | JUSTIFIED |
| `Event.version` + `Event.revision` | **SÍ** (`version` + `coordination_revision`) | JUSTIFIED |
| `Announcement.audience: string` | **NO** — §21 exige TEAM_SET / club-wide | **UNJUSTIFIED_ENTITY** |
| `AuditEntry` sin resource type/id | **NO** — §26 los exige | **UNJUSTIFIED_ENTITY** (incompleto) |

**UNJUSTIFIED_ENTITIES = 9**

**Y ausentes (contrapartida):** Membership, GuardianRelationship, EligibilityConstraint (como entidad), EventSeries, event_target_persons, event_target_teams (plural), event_logistics (aplanado a 5 campos en Event — justificable), external_references (como entidad), sessions, command_receipts, outbox_events, password_credentials, account_setup_tokens.

**De las 45 tablas de §25, el modelo mock representa ~17.** Para un prototipo visual es una **cobertura razonable** — no sehoffe esperar 45. Pero los 6 owners de dominio de §8 deben estar todos presentes, y faltan 2 (PEOPLE parcial, EVENTS parcial).

## 14.6 "Category" central

**AUSENTE ✓.** `StructureItem.type` ∈ {Temporada, División, Línea, Sede}. Nunca "Categoría". §75 *"technical Category entity does not exist"* COMPLIANT.

## 14.7 Resumen de contadores

```
UNJUSTIFIED_ROUTES       = 0   (3 rutas extra, todas justificables)
UNJUSTIFIED_FEATURES     = 4   (switcher ?demo=, harness ?scenario=, 
                                 credenciales demo en /login, 
                                 código de activación compartido en el bundle)
UNJUSTIFIED_STATES       = 5   (RECONFIRM, saveState strings sin CONFLICT,
                                 vocabulario libre de acciones, Notice sin type,
                                 unread como estado del agregado)
UNJUSTIFIED_ROLES        = 0   ✓ los 5 exactos
UNJUSTIFIED_ENTITIES     = 9   (Person.role, Person.team, eligibility enum,
                                 StructureItem array, Notice.read global,
                                 Conversation.unread, entry.reference,
                                 entry.team fusionado, announcement.audience,
                                 AuditEntry incompleto)

FREEZE_CONTRADICTIONS    = 6   (P0-1 a P0-6)
```

**Lectura de estos números:** el reverse audit es **casi limpio**. Figma Make no inventó features, ni roles, ni estados de dominio, ni una sección de analytics, ni un "Categoría", ni ninguna de las 9 cosas OUT de §3. Las 4 features no justificadas son **afordancias de desarrollo**, no producto. Los 9 entities no justificados son **simplicaciones de un prototipo**, no extrapolaciones.

Esto es un resultado notable y **reduce mucho el riesgo de reconstruction**: el trabajo de OpenCode no es recortar features inventadas, es.deepening de un modelo que ya está en la dirección correcta.

---

# 15. FASE 13 — GAP SEVERITY

Hallazgos: **6 P0 · 10 P1 · 34 P2 · 15 P3 · 10 P4** = 75.

## 15.1 P0 — PRODUCT CONTRADICTION (6)

> El código viola Product Truth. Ninguna se resuelve sin decisión explícita contra el Freeze.

### P0-1 — El rename de División/Línea destruye la identidad del Team

- **Evidencia:** `src/features/management.tsx:154-167`
- **Freeze violado:** §26 `teams` → *"Identity immutable"* + `Unique: season_id + division_id + line_id`; §10 → *"concrete Team inmutable una vez Scheduled"*; §75 Core invariants.
- **Qué pasa:** `save()` de StructurePage recorre `draft.teams` y reescribe `team.division` **y** `team.name` para todos los teams de esa división. Idéntico para Línea (`team.line`, `team.name`).
- **Por qué es contradicción:** un Team de la temporada 2026 es una entidad concreta identificada por su composición. Si se renombra la División, la identidad del Team cambia retroactivamente — incluyendo para eventos ya SCHEDULED que lo referencian. §26 dice que la identidad es inmutable; §10 dice que el Team concreto de un Match es inmutable una vez Scheduled. Nada en §19 autoriza propagar un rename de estructura a los Teams.
- **Riesgo adicional no detectado:** `team.name` se recompone como `${division} ${line}` sin verificar colisión. El guard de duplicados (`management.tsx:127-134`) sólo opera sobre `state.structure`, no sobre `state.teams`.
- **Severidad:** P0
- **Siguiente acción:** el rename de División/Línea **no debe** propagar a Teams. Un Team conserva su identidad; la pantalla muestra el nombre actual de la división + el nombre histórico. Agregar un test de invariante sobre `unique(season, division, line)`.

### P0-2 — La corrección de Attendance borra el registro anterior

- **Evidencia:** `src/features/participation.tsx:739-744`
- **Freeze violado:** §75 → *"meaningful history is not hard-deleted"*; §71 → History sources: *"Attendance tables + Audit corrections"*; §12 → *"admite correcciones auditadas"*.
- **Qué pasa:** `updateEvent(event.id, item => item.attendance = entries, "Corregir asistencia", reason)` — asignación completa del mapa. Los valores previos de las 14 personas desaparecen. El audit registra `reason` pero no `before`.
- **Por qué es contradicción:** §71 dice que la historia de Attendance viene de *las tablas de Attendance* + las correcciones de Audit. Si la tabla se sobrescribe y el audit no guarda el `before`, no existe historia. §75 lo prohíbe explícitamente. **La UI afirma lo contrario**: el Alert dice *"El cierre original se conserva"* y el toast *"Corrección guardada con su motivo"*.
- **Severidad:** P0
- **Siguiente acción:** el audit de corrección debe llevar `before` y `after`. El copy ya dice la verdad si se implementa el snapshot.

### P0-3 — La corrección de MatchRecord borra el resultado anterior

- **Evidencia:** `src/features/participation.tsx:877-901`
- **Freeze violado:** §15 → *"FINAL sólo se corrige explícitamente"*; §71 → History sources: `MatchRecord/Stats`; §75.
- **Qué pasa:** `item.record = { ...record, state: "FINAL", ... }` — score, observaciones y todos los stats previos se pierden. El audit guarda `reason` pero no el `before`.
- **Por qué es contradicción:** §71 lista MatchRecord/Stats como fuente de historia. Un MatchRecord FINAL corregido sin conservar el valor anterior deja de ser historia. §75.
- **Severidad:** P0
- **Siguiente acción:** igual que P0-2. El copy de la corrección debe aclarar que se conserva el valor anterior.

### P0-4 — "Cambiar contraseña" es un fake success

- **Evidencia:** `src/features/account-insight.tsx:123-139`
- **Freeze violado:** §24 → *"no fake success"*; §47 → *"No optimistic confirmed success"*.
- **Qué pasa:** `save()` valida longitud 12-128 + confirmación, hace `await wait()`, ejecuta `if (edit === "contact") { update(...) }` — la rama de password **no hace absolutamente nada** — y luego dispara `toast("Contraseña actualizada en esta simulación local")`.
- **Por qué es contradicción:** el usuario ve un check verde y un mensaje de éxito para una acción que no ocurrió. §24 lo prohíbe sin excepción. §47 refuerza: sólo se permite lenguaje *pending*, nunca *confirmed* sin confirmación.
- **Nota:** el copy dice "en esta simulación local", lo cual mitiga, pero no elimina: el Toast muestra un `CheckCircle2` verde, que es una señal visual de confirmación.
- **Severidad:** P0
- **Siguiente acción:** o se modela `credentialVersion` en `Person` y la mutación es real, o el botón no debe Toast de éxito. Preferencia: modelarlo, porque §51/§52 Ya requieren `credentialVersion`.

### P0-5 — El Alert de conflictos de convocatoria no tiene control de autoridad

- **Evidencia:** `src/features/events.tsx:305-310`
- **Freeze violado:** §6 → `Eligibility status: COACH scope + SUBCOMMITTEE + ADMIN`; §24 → *"unauthorized oculto"*.
- **Qué pasa:** `{conflicts.length > 0 && <Alert tone="error">...}` sin ningún gate. `conflicts` se define en `events.tsx:103-108` a partir de `person.eligibility !== "ELIGIBLE"`. En la semilla `published = p0..p11` y `p4` es `BLOCKED`, así que `conflicts.length ≥ 1`. `EventDetail` es alcanzable por las 18 jugadoras del team "sexta".
- **Por qué es contradicción:** **todas las jugadoras ven un contador de "situaciones para revisar" derivado de elegibilidad.** §6 limita la visibilidad del Eligibility status a COACH scope + SUBCOMMITTEE + ADMIN.
- **Contraste:** el mismo cálculo en Home **sí** está gateado con `&& capabilities.sport` (`overview.tsx:90`). El gate existe; simplemente falta en EventDetail.
- **Severidad:** P0
- **Siguiente acción:** una línea. Envolver en `{conflicts.length > 0 && (capabilities.sport || capabilities.official || capabilities.management) && ...}`.

### P0-6 — El rename de Venue es un cambio material ejecutado sin los efectos de §11

- **Evidencia:** `src/features/management.tsx:150-153`
- **Freeze violado:** §11 → `Venue` está explícitamente en la lista de material, con efectos obligatorios: *"Impact Preview cuando corresponda"*, `coordination_revision++`, *"Availability puede derivar NEEDS_RECONFIRMATION"*, *"Notification según política"*.
- **Qué pasa:** renombrar la Sede "GEI · Cancha de hockey" a otra cosa reescribe `event.venue` de todos los eventos que la usan. Sin Impact Preview, sin `revision++`, sin Notification. La Availability de todas sigue *"confirmada"* aunque el lugar haya cambiado.
- **Por qué es contradicción (con matiz):** §11 enumera "Venue" como campo material del **evento**. Renombrar la *entidad* Venue no es literalmente "cambiar el venue del evento", así que hay ambigüedad interpretativa. Pero el efecto observable es idéntico: cambia el venue de N eventos sin ninguna señalización. Y §19 autoriza `Venue: Update name` sin decir que esa update debe propagar silenciosamente.
- **Severidad:** P0 (requiere decisión explícita, no un fix mecánico)
- **Siguiente acción:** **decidir contra el Freeze** entre: (a) el rename de Venue dispara el flujo material completo por cada evento afectado, o (b) §11 se reinterpreta como "cambiar el venue en el form del evento" y el rename de la entidad no propaga (el Team/Event mostrarían el nombre histórico). **OpenCode no debe elegir solo.**

## 15.2 P1 — MISSING CORE FLOW (10)

> Parte crítica del producto inexistente o rota.

| ID | Hallazgo | Freeze | Evidencia | Siguiente acción |
|---|---|---|---|---|
| **P1-01** | **GuardianRelationship ausente por completo.** Sin entidad, sin `guardian_relationships`, sin `guardian_person`/`child_person`/`relationship_type`/`can_view_child_info`/`can_respond_availability`, sin UI. En consecuencia **"responder Availability por menor" no existe** — una fila completa de §5 sin superficie para ninguno de los 5 roles. | §1.2 (actor original), §3 IN, §5 fila "responder por menor", §17, §20 *"Guardian no entra"*, §25 tabla 6, §53 `hasApplicationAccess` | grep `guardian` en `src/` → **0 coincidencias** | Modelar + admin UI + flujo de respuesta delegada. **Requiere decisión de diseño de superficie** (¿dónde ve el guardian su情報? ¿`/more/profile` como Mine? ¿una ruta propia?) |
| **P1-02** | **SUBCOMMITTEE no tiene superficie de Eligibility.** `PersonAdminDetail` está gated a `capabilities.management` (ADMIN). No hay otra pantalla. `eligibilityReason`/`eligibilitySource` declarados y nunca usados. | §5 `Eligibility mutation: SUBCOMMITTEE ✓ ADMIN ✓`, `reason/source: SUBCOMMITTEE + ADMIN`; §13 (4 scopes × 3 sources × 5 reasons) | `management.tsx:527` gate; `model.ts:27-28` campos muertos | Crear la superficie. Además decidir si Eligibility se modela como enum plano (actual) o como `EligibilityConstraint[]` con scope+source+reason (§25 fiel). **La segunda es REBUILD.** |
| **P1-03** | **Event targets no representables.** El modelo tiene `team: string` singular + `clubWide: boolean`. No hay `event_target_teams[]` ni `event_target_persons[]`. Un TRAINING dirigido a 2 equipos o a 3 personas es **imposible de crear**; un CLUB_EVENT con `club_wide_target=true` conserva un `team`. | §10 targets, §25 tablas 21-22, §12 aplicabilidad por target | `model.ts:51,66`; `events.tsx:914-943` | Flattening a `targetTeamIds: string[]` + `targetPersonIds: string[]` + `clubWide`. Luego el form de evento. |
| **P1-04** | **EventSeries / recurrencia ausente.** Sin entidad, sin `event_series`, sin `event_series_target_teams/persons`, sin `event_occurrence_overrides`, sin UI, sin el límite de 366 ocurrencias, sin `scheduleSource`. | §3 IN, §9 `ACTIVE→ENDED` max 366, §25 tablas 16-18/23, §36 API, §11 | grep `series\|recurr\|occurrence` → **0** | Decidir alcance visual: ¿recurrencia en el form de evento o pantalla propia? |
| **P1-05** | **Membership ausente.** `Person.team: string` fusiona Membership (§17 *"Período de pertenencia interna al club"*) con TeamAssignment (*"Afiliación deportiva de una PLAYER"*). §17: *"TeamAssignment/RoleAssignment internos deben ocurrir dentro de Membership vigente"* — imposible de verificar. | §8 PEOPLE, §17, §25 tabla 3 | `model.ts:17` | Separar `Membership {validFrom, validUntil}` de `TeamAssignment`. Es parte de REBUILD-03. |
| **P1-06** | **No hay Conflict Workspace.** Los 3 estados de conflicto existen como *mensaje* (§45 SAVE_ERROR, §44 STALE_VERSION, §37 IMPACT_CHANGED) pero ninguno como *workspace*. §73 pide `409 STALE_VERSION → Conflict Workspace` con baseline + localDraft + latestServer lado a lado. §44 pide `baselineVersion` + `baselineValues`; `EventForm` captura `baselineVersion` pero **no** `baselineValues`. | §44, §73, §37 | `events.tsx:749,1093-1108` (hay un Alert con un botón, no un workspace) | Depende de P1-08 (RHF). Es la razón por la que P1-08 es P1 y no P3. |
| **P1-07** | **`Person.role` nunca se actualiza.** `Asignar rol` y `Finalizar rol` mutan **solo** `roleAssignments`. `item.role` queda stale. `hasRole` lee `roleAssignments` (correcto) pero `labels[person.role]` en 6 pantallas muestra el valor viejo. | §5 `Multi-role = unión de assignments vigentes` | `management.tsx:627-644` vs consumidores en `Shell:169`, `Home:147`, `ProfilePage:154`, `PeopleManagement:399`, `PersonDetail:790`, `PersonAdminDetail:1045` | **Cadena de propagación rota.** Eliminar `Person.role` y `Person.team` (REBUILD-03) o derivarlos siempre de `roleAssignments`. |
| **P1-08** | **No hay capa de formularios.** Sin React Hook Form ni Zod 4, sin `baselineValues`, sin dirty tracking, sin schema, sin `resolver`. 9 formularios con validación ad-hoc scattered. | §39 (stack obligatorio), §44 | `package.json`; validación `if` en 9 sitios | Introducir RHF + Zod. **Desbloquea P1-06, §47, §73.** Es la dependencia que habilita 4 behaviours ausentes. |
| **P1-09** | **No hay capa de query/cache.** Sin TanStack Query v5: sin freshness (§43), sin `sessionEpoch` isolation (§42), sin refetch-on-focus, sin `GET retry max 2`, sin `mutation retry: false`, sin reconciliación query-vs-command. | §39, §41 `No duplicated server truth`, §42, §43 | `package.json`; `store.tsx` es un `useState` plano | Introducir TanStack Query con un `QueryClient` por `sessionEpoch`. Sin esto, §47 *"Confirmed command + failed projection refresh"* es irrepresentable. |
| **P1-10** | **Tailwind es la dependencia de estilos arquitectónica**, y §39 lo prohíbe explícitamente. §39 pide *"CSS Modules + CSS variables/tokens"* y lista *"Tailwind architectural dependency"* en lo no permitido. El proyecto usa Tailwind v4 con 0 CSS Modules. Los CSS variables sí están (en `:root`), lo cual cubre la mitad de la frase. | §39 (prohibición explícita) | `package.json`, `index.css`, `theme.css` | **REQUIERE DECISIÓN EXPLÍCITA ANTES DE ESCRIBIR UNA LÍNEA.** Tres opciones: (a) migrar a CSS Modules — trabajo grande, afecta los 34 screens; (b) emitir una revisión v1.0.1 del Freeze aclarando que Tailwind está permitido — el Freeze §82 lo permite explícitamente ("v1.0.1 clarification/no behavior change"); (c) aceptar Tailwind como excepción documentada. **OpenCode no debe decidir esto solo.** |

## 15.3 P2 — STATE / INTERACTION GAP (34)

> La pantalla existe pero el workflow o el estado está incompleto. Ninguna de estas viola Product Truth; todas limitan la capacidad de demostrar el Freeze.

| ID | Hallazgo | Freeze | Evidencia |
|---|---|---|---|
| **P2-01** | `PeopleManagement` filtra por el scalar legacy `person.role`, no por `roleAssignments`. Un multilayer sólo aparece bajo un rol. | §5 `Multi-role = unión` | `management.tsx:312` |
| **P2-02** | `updateEvent` bumpea `event.version` en **toda** mutación, incluidas respuestas de Availability y autosaves de Selection. Produce 409 espurios entre flujos no relacionados. | §27 `version` protege el agregado raíz; §44 | `store.tsx:128` |
| **P2-03** | La respuesta de Availability escribe en `event.history` (línea de coordinación del evento). | §71 (Availability no es fuente de historia del evento) | `participation.tsx:63-68` → `store.tsx:129-135` |
| **P2-04** | Sin `notification_type`. 5 de los 8 tipos de §22 no son producibles como tipos distintos. Sin diff `selectedNow`/`removedNow` en republicación. | §22, §26 | `model.ts:116-125`, `store.tsx:142-163`, `participation.tsx:300-314` |
| **P2-05** | El estado `CONFLICT` de §45 no existe en el autosave de Selection. Hay 4 de 5. | §45 | `participation.tsx:185,203,206,211` |
| **P2-06** | `EventForm` no remonta al cambiar `:eventId` entre dos `/events/:id/edit`. El draft queda ligado al evento anterior. | §44 `baselineValues` | `events.tsx:729-749` |
| **P2-07** | `notify()` computa audiencia como `person.team === event.team \|\| SUBCOMMITTEE`. No distinction `old audience ∪ new audience ∪ existing Availability ∪ published Selection ∪ relevant staff`. Eventos club-wide notifican a un solo team. | §22 | `store.tsx:143-151` |
| **P2-08** | Se puede marcar Attendance directamente sobre un evento COMPLETED con la hoja abierta, sin pasar por corrección. | §12 `puede cerrar después de COMPLETED y admite correcciones auditadas` | `participation.tsx:534` |
| **P2-08b** | La corrección de Announcement borra `title`/`body` previos; sólo queda el `reason` en audit. | §21 `con reason + Audit`, §75 | `communication.tsx:709-717` |
| **P2-09** | No hay ruta de reapertura de Attendance (`attendanceClosed` nunca vuelve a `false`). | §9 `Sheet OPEN/CLOSED derivado de closed_at` | `participation.tsx:552` |
| **P2-10** | No hay creación de conversación TEAM ni EVENT. §20 define 4 tipos; la UI ofrece 2. Tampoco hay regla "0..1 canonical por Team/Event". | §20 | `communication.tsx:180-261` |
| **P2-11** | Sin `joined_at`/`left_at` en participantes, sin add/remove, sin la regla "no acceso a historia anterior a `joined_at`", sin "ex-participant conserva período autorizado". | §20 Participants | ausente |
| **P2-12** | El selector de participantes de conversación está restringido al propio team y a PLAYER/CAPTAIN/COACH. §20 GROUP no restringe al Team ni a esos roles. | §20 | `communication.tsx:192-197` |
| **P2-13** | `Conversation.unread: number` es un contador compartido por todos los participantes, no por participante. No hay columna equivalente en §25. Además el modelo de lectura está duplicado (`Notice.read` global + `readBy[]`). | §25, §26 `read_at` por fila | `model.ts:113,124` |
| **P2-14** | El link de Announcement en `EventDetail` matchea por `audience.includes(teamName)`. El audience `"Todo hockey"` nunca contiene `"Sexta A"` → los comunicados club-wide nunca se adjuntan a un evento. | §21 | `events.tsx:89-91` |
| **P2-15** | Availability y roster sobre un evento club-wide resuelven al team `"sexta"` (el `event.team` del seed). | §10 `club_wide_target=true → 0 Team targets` | `participation.tsx:55-58` |
| **P2-16** | Publicar un Announcement notifica a las 21 personas ignorando la audiencia. | §21, §22 | `store.tsx:150-151` |
| **P2-17** | La búsqueda no cubre Division ni Line; sólo `team.name`. | §2 `Búsqueda por Team / Division / Line` | `overview.tsx:830-836` |
| **P2-18** | Filtros de Search y Calendar en `useState` local, no en la URL. | §41 `URL/filter → Router + Zod` | `overview.tsx:821,390-394` |
| **P2-19** | El guard de last-admin no cubre `EndMembership del último Admin`. | §18 lista explícitamente `EndMembership del último Admin` | `management.tsx:546-550` |
| **P2-20** | `PersonAdminDetail` "Asignar rol" nunca actualiza `item.role`; "Finalizar rol" tampoco. | §5 (ver P1-07) | `management.tsx:627-644` |
| **P2-21** | `TeamDetail` "Cuerpo técnico" hardcodea `/people/coach` + `"Tomás Beltrán"` + `"Entrenador"`. Miente tras un reasignamiento. | §7 `Team View es proyección` | `overview.tsx:706-714` |
| **P2-21b** | El setup code se puede regenerar ilimitadamente sin invalidar el anterior, y es un literal compartido entre admin y activate. | §51 `max 1 active/account`, `invalidate old setup token` | `management.tsx:657`, `account-insight.tsx:391` |
| **P2-22** | Inconsistencia interna: el publish **bloquea** por eligibility, pero la app presenta "publicación con conflicto" como estado legal (y la semilla lo tiene). | §14 `puede derivar hasCurrentConflicts` | `participation.tsx:291-296` vs `events.tsx:305-310` |
| **P2-23** | `h-[calc(100dvh-280px)]` en ConversationPage: el cromo real es ≈315px → el composer queda bajo la bottom nav en 390px. | §24 `responsive conserva significado` | `communication.tsx:386` |
| **P2-24** | Sin Step-up reauthentication. | §52 (ventana 10 min) | ausente |
| **P2-25** | `?scenario=session-interrupted` sólo arranca con `authenticated=false` → parece un cold boot en `/login`. No hay UX de "Session Interruption" (ni overlay, ni "volvé a iniciar sesión"). | §73 `401 → Session Interruption` | `store.tsx:65-67` |
| **P2-25b** | El copy de §73 `ambiguous network mutation → "No pudimos confirmar el resultado."` **no existe** en el código. Existe `"No pudimos actualizar la información"` (degraded) y `"Este evento cambió mientras lo estabas editando"` (stale), pero no el de *ambiguous*. | §47, §73 | ausente |
| **P2-26** | COACH no puede recibir scope EVENT en la UI; sólo TEAM. | §5 `COACH \| TEAM / EVENT` | `management.tsx:632-634` |
| **P2-27** | `Announcement.audience: string` no es TEAM_SET; las opciones son literales y no crean `announcement_target_teams`. | §21 | `model.ts:89-97`, `communication.tsx:767-776` |
| **P2-27b** | Los comunicados ARCHIVED siguen listados para SUBCOMMITTEE (`\|\| capabilities.official` deja pasar todo lo que no sea PUBLISHED, incluye DRAFT y ARCHIVED). | §9 `ARCHIVED` | `communication.tsx:39-41` |
| **P2-27c** | Un comunicado ARCHIVED es legible por cualquiera con el id: el gate sólo chequea `DRAFT`. | §9 | `communication.tsx:581-590` |
| **P2-28** | `Home` enlaza a la capitana con `to="/conversations/c2"` y `aria-label="Abrir conversación con Victoria"` hardcodeados. | — | `overview.tsx:366-367` |
| **P2-29** | Un PLAYER sin respuesta previa nunca ve "Necesita reconfirmación" (`!!event.availability[actor.id]`). | §11 `Availability puede derivar NEEDS_RECONFIRMATION` | `overview.tsx:73` |
| **P2-30** | `ImpactContent` no incluye `competition` ni `clubWide` en la tabla before/after. | §11 los lista como material | `events.tsx:638-660` |
| **P2-31** | La validación `goals de jugadoras > score GEI` es una regla de negocio inventada. No está en el Freeze ni es derivable de §15. | §0 `Frontend no inventa reglas de negocio`; §81 | `participation.tsx:869-874` |
| **P2-32** | `/jornadas/new` es **inalcanzable desde la UI**. Existe en el router y es deep-link safe, pero ningún enlace apunta a ella. | §23 | `app/App.tsx:67`; `MorePage:73` apunta a `/jornadas/j1` |
| **P2-33** | Sin `COMPETITION_SCOPE_MISMATCH` en creación de jornada ni en `EventForm`. La comparación de competencia es por string (`event.competition === competition.name`). | §16 | `events.tsx:1191-1194`, `events.tsx:956-960` |
| **P2-34** | `ReportDetail` para SUBCOMMITTEE (scope Club según §5) defaultea a un team hardcodeado `"sexta"` en vez de scope Club. | §5 `Attendance report: SUBCOMMITTEE → Club` | `account-insight.tsx:543` |
| **P2-34b** | El legend del calendario dice warning (amarillo) para "Club", pero el chip de `CLUB_EVENT` renderiza `success-soft` (verde). | §24 presentación coherente | `overview.tsx:494` vs `overview.tsx:547-553` |
| **P2-35** | `actor.role === "CAPTAIN"` y `actor.role !== "PLAYER"` usados como fuente de autoridad en 4 sitios, en lugar de `hasRole`. | §40 | `participation.tsx:134`, `overview.tsx:799`, `account-insight.tsx:552,608` |
| **P2-36** | Sin entidad ExternalReference. §26 define la tabla con target whitelist (COMPETITION / COMPETITION_ENTRY / MATCH_EVENT). Hoy es un string en el entry. | §5 `External refs`, §26 | `model.ts:137-143` |
| **P2-36b** | ADMIN no puede ver phone/email en `/people/:personId`. | §6 `teléfono/email: self, ADMIN, COACH/CAPTAIN del Team actual` | `overview.tsx:773-783` |
| **P2-37** | No hay superficie de creación de Team. `/management/structure` no tiene tab "Equipo"; `TeamAdmin` sólo cambia el estado de un team existente. | §19 `Team: DRAFT/ACTIVE/ARCHIVED`, `unique(season+division+line)` | `management.tsx:197` |
| **P2-38** | `?scenario=loading` skeletoniza el shell, no el contenido. Ninguna pantalla skeletoniza sus propios datos. | §24, §78 | `Shell.tsx:241-256` |
| **P2-39** | `ReportDetail` con 0 filas renderiza header sin cuerpo (sin mensaje de empty). | §24 `empty != zero != error` | `account-insight.tsx:639-689` |
| **P2-40** | `EventForm` no permite editar Logistic para TRAINING (el bloque se renderiza sólo `type === "MATCH"`), pero §11 lista `meetingAt`/`departureAt`/`meetingPoint`/`transportNote`/`arrivalInstructions` como material sin restringir por tipo. | §11, §36 Events/Logistics | `events.tsx:999-1032` |
| **P2-41** | La fila "Logística" de `EventDetail` se renderiza para CLUB_EVENT, pero el form no lo permite editar. Superficie de lectura sin escritura. | §36 | `events.tsx:442-469` vs `events.tsx:999` |

## 15.4 P3 — STRUCTURAL DEBT (15)

> El código dificultará continuar. Ninguno viola Product Truth.

| ID | Hallazgo | Evidencia | Impacto en el handoff |
|---|---|---|---|
| **P3-01** | La autoridad son 6 booleanos sin scope en lugar de `allowedActions` por objeto. §40: *"Object actions derive from `allowedActions`. Never recreate server authorization with `if role===...`"*. 14 usos de `capabilities.sport` como gate. | `store.tsx:84-95` | Cuando se conecte el backend, **todo** el gate hay que reescribir. Es el debt que más retrabajo genera. |
| **P3-02** | Violaciones de la cadena `routes → features → shared`: `participation→events` (`useEvent`), `account-insight→management` (`Restricted`), y `shared/ui → mock/store`. | `participation.tsx:13`, `account-insight.tsx:30`, `ui.tsx:30,446` | `EventRow` consumiendo el store impide testear el primitive de forma aislada. |
| **P3-03** | `eligibilityReason` / `eligibilitySource` declarados, nunca asignados ni leídos. | `model.ts:27-28` | Falsa señal de completitud. |
| **P3-04** | God files: 6 archivos, **6.497 líneas**, 34 pantallas. `account-insight.tsx` (784) mezcla auth + perfil + insight. `overview.tsx` (916) mezcla home + calendar + teams + people + search. `events.tsx`, `participation.tsx`, `management.tsx` sí respetan dominio. | `src/features/*` | Editar Home obliga a leer 916 líneas. Sin tests, esto es riesgo alto de regresión. |
| **P3-05** | No existe `src/routes/`, `src/app/{router,providers,session,bootstrap}`, `src/shared/{api,http,errors,lib,hooks,patterns}`. §39 prescribe el árbol exacto. | árbol de `src/` | §39 es FROZEN. El árbol actual se desvía. |
| **P3-06** | No hay `errorElement` en el router: un error en render cae al catch-all y muestra "Página no encontrada" en lugar de una pantalla de error. | `app/App.tsx:91-99` | Un bug de runtime se presenta como 404. |
| **P3-07** | `store.audit` usa `date: "02 oct 2026 · Ahora"` hardcodeado para toda entrada runtime. `AuditPage` hardcodea 3 fechas en su filtro, así que cualquier fecha fuera de ellas devuelve 0 resultados silenciosamente. | `store.tsx:112`, `account-insight.tsx:717-723` | El filtro de fecha del Audit miente en silencio. |
| **P3-08** | 25 imports de valor muertos en 7 archivos. `tsconfig.json` **no** tiene `noUnusedLocals`/`noUnusedParameters` → nada los detecta. | ver §12.14 | Un build pasa limpio con 25 imports muertos. |
| **P3-09** | El breadcrumb del header es un ternario anidado de 6 niveles que no cubre `/jornadas`, `/announcements`, `/conversations`, `/reports`, `/search`, `/more` → todos caen en "Mi espacio". | `Shell.tsx:182-196` | Copy incorrecto en 6+ rutas. |
| **P3-10** | Faltan `@tanstack/react-query`, `react-hook-form`, `zod`. | `package.json` | (Ver P1-08/P1-09 — aquí sólo el hecho de dependencia.) |
| **P3-11** | `record` local de `MatchRecordPage` no se re-sincroniza con `event.record` tras guardar. Divergencia potencial si el record cambia externamente. | `participation.tsx:813` | Bug latente. |
| **P3-12** | `MorePage` enlaza a `/jornadas/j1` con id literal. | `account-insight.tsx:73` | El enlace es frágil. |
| **P3-13** | `event.history: string[]` duplica `state.audit[]`. La misma acción se registra en dos lugares con formato distinto; pueden divergir. §71 dice *"No generic History table"*. | `store.tsx:106-113` + `store.tsx:129-135` | **Una acción, dos fuentes de verdad.** El Audit y el historial del evento pueden discrepar. |
| **P3-14** | `canOperateEvent` excluye `CLUB_EVENT` y `clubWide` para todos, incluido SUBCOMMITTEE con Club scope. Impide iniciar/completar eventos de club. | `store.tsx:257-258` | **Ambigüedad del Freeze**, no bug de código. Requiere aclaración. |
| **P3-15** | Cero tests. §74 lista 39 escenarios E2E; §78 lista 12 behaviours EVIDENCE PENDING. Nada es verificable automáticamente. | — | Los 6 P0 son todos de este tipo: mutaciones destructivas/inmutaciones que un test de invariante habría detectado. |

## 15.5 P4 — VISUAL POLISH (10)

> No bloquea funcionamiento ni Product Truth.

| ID | Hallazgo | Evidencia |
|---|---|---|
| **P4-01** | Escala tipográfica con 9px y 10px, por debajo del mínimo cómodo de legibilidad. §78 deja accesibilidad como EVIDENCE PENDING, así que no hay violación. | transversal |
| **P4-02** | `Empty` siempre usa el icono `CalendarDays`, incluso en 404, no-access, restricted y empty de búsqueda. | `ui.tsx:307` |
| **P4-03** | Token `--radius: 0.65rem` declarado y nunca consumido (Tailwind usa su propia escala `rounded-*`). | `theme.css:18` |
| **P4-04** | `gap-2.5` / `gap-3.5` son outliers frente a la escala Tailwind estándar. | `overview.tsx:169`, `events.tsx:333` |
| **P4-05** | Dropdowns contextuales sin click-outside ni Escape. 4 sitios. | `events.tsx:193`, `communication.tsx:465` |
| **P4-06** | Tratamiento destructivo inconsistente: "Archivar comunicado" y "Deshabilitar cuenta" en `variant="ghost"` sin señal, mientras "Cancelar evento" sí usa `danger`. | `communication.tsx:632`, `management.tsx:883` |
| **P4-07** | `Badge` con `value="DRAFT"` + children "Cerrada"/"Abierta"/"Sin abrir": el color del badge no corresponde al estado real. 2 sitios. | `events.tsx:417-423`, `participation.tsx:569-577` |
| **P4-08** | `lucide-react` no figura en el stack de §39. Desvío documentado y **aceptado**: §40 no prohíbe librería de iconos y §81 delega en Figma la definición de componentes. | `package.json` |
| **P4-09** | `coordination_revision` no se muestra en ninguna superficie, pese a que §26 lo lista en `events`. | — |
| **P4-10** | En `SelectionPage`, la vista no-autorizada no indica que existe un borrador pendiente de publicación. | `participation.tsx:262-267` |

---

# 16. FASE 14 — KEEP / FIX / MISSING / REBUILD

Cuatro manifests. Cada entrada: feature, evidencia, razón, sección del Freeze, severidad, siguiente acción.

## 16.1 KEEP — conservar prácticamente intacto (13 entradas)

> **Esto es lo que Figma Make resolvió bien. No destruirlo por perfeccionismo.**

### K-01 · Design tokens
- **Evidencia:** `src/styles/theme.css` (38 líneas)
- **Razón:** 17 variables semánticas centralizadas en `:root`, mapeadas a utilidades vía `@theme inline`. Nombres semánticos (`--color-danger-soft`), no arbitrarios. Es la pieza de mayor calidad del proyecto.
- **Freeze:** §39 (*"CSS variables/tokens"*) **SATISFECHO**
- **Severidad:** —
- **Acción:** ninguna. **No tocar.**

### K-02 · Los 17 primitives de UI
- **Evidencia:** `src/shared/ui.tsx` (517 líneas)
- **Razón:** API de props consistente, gramática de radios unificada en 4 niveles (`md`/`lg`/`xl`/`2xl`), touch targets explícitos (`min-h-9`/`min-h-10`/`min-h-20`), `role` y `aria-label` correctos en todos los icon-only.
- **Freeze:** §39 (`shared/ui`) **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar los 17. **Añadir** (no reemplazar): `Table`, `Tabs`, `Dropdown` (extraer el patrón repetido 4 veces), `Skeleton`, `ConflictWorkspace`. **No tocar** `Button`, `Badge`, `Modal`, `Alert`, `Empty`, `RowLink`, `EventRow`.

### K-03 · `Modal` con focus trap
- **Evidencia:** `src/shared/ui.tsx:316-391`
- **Razón:** ciclo de Tab con wrap, Escape, scroll lock con restauración, `previous?.focus()` al cerrar, `aria-modal`, `role="dialog"`, bottom sheet en mobile con `max-h-[90dvh]`. **Por encima del promedio.** Ningún otro scaffold de Figma lo hace.
- **Freeze:** §40, §81 **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar sin cambios. Es el standard para los modales nuevos.

### K-04 · Shell: sidebar + bottom nav con los mismos destinos
- **Evidencia:** `src/app/Shell.tsx:28-34` (array `nav`), `:84` (sidebar), `:266-286` (bottom nav)
- **Razón:** un único array `nav` alimenta ambas navegaciones. No hay duplicación. `pb-[env(safe-area-inset-bottom)]`, `pb-28` en `main`, `⌘K`, badges derivados del estado real.
- **Freeze:** §40 (*"Mobile bottom nav and desktop sidebar expose same destinations"*) **SATISFECHO LITERALMENTE**; §23 (main nav) **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar. En §23 §39, derivar de `/me.navigation` en vez del array local (P3-01).

### K-05 · Guards de shell
- **Evidencia:** `src/app/Shell.tsx:73-81`
- **Razón:** `!authenticated → /login`, `!hasAccess → /no-access` con escape hatch a `/more/profile`. §53 exacto.
- **Freeze:** §53 `hasApplicationAccess false → /no-access` **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar la lógica; migrar `authenticated`/`hasAccess` a `SessionContext` (§41) cuando exista la capa de sesión.

### K-06 · Jerarquía de Home
- **Evidencia:** `src/features/overview.tsx:120-379`
- **Razón:** `Necesita tu atención` (derivado de 4 condiciones reales: needs-reconfirmation, conflictos de selection, asistencia abierta, record faltante) → `Hoy` → `Próximamente` → `Comunicaciones recientes`, con aside `TU EQUIPO` / `Próximo partido` / `Capitana`. Es exactamente §24 `PAGE → CONTEXT → WHAT MATTERS NOW → CONTENT → SECONDARY`.
- **Freeze:** §24 **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar la jerarquía. Corregir sólo los datos hardcodeados (P2-33b, P2-28) y la condición de needs-reconfirmation (P2-29).

### K-07 · Gramática de lista unificada
- **Evidencia:** `src/shared/ui.tsx:392-423` (`RowLink`), `:439-488` (`EventRow`)
- **Razón:** un solo patrón (`flex items-center gap-3 border-b px-5 py-4 hover:bg-primary-soft/35`) para todas las listas del proyecto. Coherente en 20+ superficies.
- **Freeze:** §81 (componentes) **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar. Desacoplar `EventRow` del store (aceptar `teamName` como prop) → P3-02.

### K-08 · Tablas responsive como grid de columnas
- **Evidencia:** `participation.tsx:381-386` (Selection), `:1007-1012` (MatchRecord), `management.tsx:378-383` (PeopleManagement), `overview.tsx:508-516` (Calendar header)
- **Razón:** las 4 tablas usan el mismo grammar: header `hidden sm:grid` + filas con el mismo `grid-template`. Degradan a stack en mobile sin duplicar markup. Es la solución correcta y es consistente entre pantallas.
- **Freeze:** §24 `responsive conserva significado`, §81 **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar el patrón. Extraer a un primitive `<DataGrid>`.

### K-09 · Responsive grammar
- **Evidencia:** transversal
- **Razón:** 4 breakpoints, cero ad-hoc, cero inline styles (verificado), cero overflow (el único `min-w-[560px]` está en `overflow-x-auto`). En mobile el calendario degrada a agenda en vez de intentar comprimir la grilla.
- **Freeze:** §24, §1.3 (responsive) **SATISFECHO**
- **Severidad:** —
- **Acción:** conservar. Corregir sólo P2-23 (altura del composer).

### K-10 · Sistema de iconos
- **Evidencia:** `lucide-react` en 8 archivos; `EventIcon` en `ui.tsx:424-438`
- **Razón:** 100% consistente, cero SVG inline, cero duplicación de glifo, `aria-label` en todos los icon-only.
- **Freeze:** §81 (componentes) **SATISFECHO**; stack §39 sin listar `lucide-react` (desvío aceptado, P4-08)
- **Severidad:** P4-08
- **Acción:** conservar. Eliminar los 10 imports de iconos muertos.

### K-11 · Acciones primary / secondary / ghost / danger
- **Evidencia:** `src/shared/ui.tsx:31-55`
- **Razón:** gramática clara de 4 niveles. `danger` correctamente usado donde corresponde (cancelar evento). Touch target `min-h-10` uniforme.
- **Freeze:** §81, §24 `primary/secondary actions` **SATISFECHO**
- **Severidad:** P4-06
- **Acción:** conservar la gramática; **extender el uso de `danger`** a archivar/deshabilitar.

### K-12 · `Alert` + `Empty` como primitivos de estado
- **Evidencia:** `src/shared/ui.tsx:271-315`
- **Razón:** `Alert` con 4 tonos semánticos alineados a los tokens y `role` correcto (`alert` para error, `status` para el resto). `Empty` con borde dashed + título + detalle + acción opcional. Habilitan §24 `empty != zero != error` con 22 usos reales.
- **Freeze:** §24, §81 **SATISFECHO**
- **Severidad:** P4-02
- **Acción:** conservar. Corregir el icono hardcodeado de `Empty` (P4-02).

### K-13 · El motor de estado mock (`update` / `updateEvent` / `eventChange`)
- **Evidencia:** `src/mock/store.tsx:96-208`
- **Razón:** **un solo write owner**, draft inmutable vía `structuredClone`, y `eventChange` con check de `expectedVersion` que ya implementa §44 `check expectedVersion`. Es la decisión de arquitectura correcta y es la que hace posible toda la coherencia entre pantallas.
- **Freeze:** §75 `one write owner per domain truth`, §44 `baselineVersion` **SATISFECHO** (parcialmente)
- **Severidad:** P3-01, P2-02
- **Acción:** **conservar el patrón**, cambiar la implementación. Reemplazar `useState` por TanStack Query cache + una capa de commands (P1-09). Separar `update` por dominio en vez de un mutador genérico con `recipe` (el `recipe` es un anti-patrón: permite cualquier mutación sin validación).

## 16.2 FIX — ya existe, sólo requiere corrección (26 entradas)

> Costo bajo, riesgo bajo, valor alto. **Empezar por acá.**

### F-01 · Gate de autoridad en el Alert de conflictos
- **Evidencia:** `src/features/events.tsx:305-310`
- **Razón:** el gate equivalente ya existe en `overview.tsx:90`. Es una línea.
- **Freeze:** §6 `Eligibility status`, §24 `unauthorized oculto` **VIOLADO**
- **Severidad:** **P0-5**
- **Acción:** envolver en `(conflicts.length > 0 && (capabilities.sport || capabilities.official || capabilities.management))`.

### F-02 · Preservar el `before` en correcciones de Attendance y MatchRecord
- **Evidencia:** `participation.tsx:739-744` y `:877-901`
- **Razón:** el `update()` ya acepta un `reason` y escribe en `state.audit`. Sólo falta extender `AuditEntry` con `before`/`after` opcionales y pasarlos.
- **Freeze:** §75 `meaningful history is not hard-deleted`, §71 **VIOLADO**
- **Severidad:** **P0-2, P0-3**
- **Acción:** extender `AuditEntry` + pasar snapshots en los 3 flujos de corrección (Attendance, MatchRecord, Announcement).

### F-03 · Quitar la propagación del rename de División/Línea a Teams
- **Evidencia:** `management.tsx:154-167`
- **Razón:** 14 líneas. Un Team conserva su identidad; la pantalla muestra el nombre actual de la división.
- **Freeze:** §26 `teams.Identity immutable`, §10 **VIOLADO**
- **Severidad:** **P0-1**
- **Acción:** eliminar los tres bloques `if (item.type === "División")` y `if (item.type === "Línea")`. Conservar el de `Sede` **sólo si** se decide P0-6 en la dirección (b).

### F-04 · Fake success del cambio de contraseña
- **Evidencia:** `account-insight.tsx:123-139`
- **Razón:** modelar `credentialVersion` en `Person` (que §51/§52 ya requieren) y hacer la mutación real, o quitar el toast de éxito.
- **Freeze:** §24 `no fake success`, §47 **VIOLADO**
- **Severidad:** **P0-4**
- **Acción:** Preferir modelar `credentialVersion` (§51 Admin reset lo necesita igual).

### F-05 · Resolver la ambigüedad del rename de Venue
- **Evidencia:** `management.tsx:150-153`
- **Razón:** **No es un fix mecánico: requiere decisión contra el Freeze.**
- **Freeze:** §11 `Venue` es material **VIOLADO o AMBIGUO**
- **Severidad:** **P0-6**
- **Acción:** Decidir (a) propagar con flujo material completo, o (b) documentar que el rename de entidad no propaga. **Registrar la decisión con §82.**

### F-06 · Modelar `notification_type` con los 8 tipos de §22
- **Evidencia:** `model.ts:116-125`, `store.tsx:142-163`
- **Razón:** agregar `NotificationType` con los 8 literales exactos, `originEventId`, `resourceType/resourceId`, y derivar `title/body` de un mapa `templateCode → copy` (que §58 ya describe).
- **Freeze:** §22, §26 **GAP**
- **Severidad:** **P2-04**
- **Acción:** cambiar la firma de `notify()` de `(title, body, route)` a `(type, resourceRef, vars)`.

### F-07 · Diff `selectedNow` / `removedNow` en republicación de Selection
- **Evidencia:** `participation.tsx:300-314`
- **Razón:** 6 líneas: comparar `event.published` contra `selected` antes de sobrescribir y mostrar ambos conjuntos en el modal.
- **Freeze:** §22 `Selection republish compara previous vs new` **GAP**
- **Severidad:** **P2-04**
- **Acción:** calcular el diff en `publish()` y renderizarlo en el Modal.

### F-08 · Estado `CONFLICT` en el autosave de Selection
- **Evidencia:** `participation.tsx:185,203,206,211`
- **Razón:** agregar el quinto estado y un trigger (versión del Selection mock).
- **Freeze:** §45 (5 estados, hay 4) **GAP**
- **Severidad:** **P2-05**
- **Acción:** reemplazar los strings por un enum `SelectionSaveState` con los 5 valores de §45.

### F-09 · No bumpear `event.version` en escrituras de sub-agregados
- **Evidencia:** `store.tsx:117-141`
- **Razón:** `updateEvent` siempre hace `version++`. Availability, Selection draft, Attendance y Attendance open/close **no** son el agregado `events`.
- **Freeze:** §27 `version` protege el agregado raíz mutable, §44 **IMPLICA**
- **Severidad:** **P2-02**
- **Acción:** separar `updateEvent` en `updateEventAggregate` (bumpea `version` + `revision` si corresponde) y `updateEventChild` (no bumpea). Solo el primero recibe `expectedVersion`.

### F-10 · No escribir respuestas de Availability en `event.history`
- **Evidencia:** `participation.tsx:63-68`
- **Razón:** pasar `action` sólo a `update()` (audit), no a `updateEvent()` (historial).
- **Freeze:** §71 (historia del evento = Events + Audit) **IMPLICA**
- **Severidad:** **P2-03**
- **Acción:** una línea.

### F-11 · Separar TeamAssignment de Membership (superficie mínima)
- **Evidencia:** `model.ts:17` (`Person.team: string`)
- **Razón:** agregar `membership?: { validFrom, validUntil }` a `Person` y dejar `team` sólo como TeamAssignment vigente derivado.
- **Freeze:** §8, §17, §25 tabla 3 **GAP**
- **Severidad:** **P1-05** (parte de REBUILD-03)
- **Acción:** modelo primero; la UI de Membership completa viene en REBUILD.

### F-12 · Derivar `Person.role` de `roleAssignments`
- **Evidencia:** `management.tsx:627-644`
- **Razón:** 2 líneas si se mantiene el campo (recalcularlo), o 0 si se elimina (REBUILD-03).
- **Freeze:** §5 `Multi-role = unión de assignments vigentes` **VIOLADO (propagación)**
- **Severidad:** **P1-07**
- **Acción:** eliminar `Person.role` y derivarlo. Es parte de REBUILD-03.

### F-13 · Corregir los 11 literales que mienten
- **Evidencia:** ver §12.8
- **Razón:** `"Sexta A"` ×3, `"6A"` ×1, `"Alvear 1240 · Ituzaingó"`, `"Tomás Beltrán"` ×2, `"/people/coach"`, `"/conversations/c2"`, `"/jornadas/j1"`, `"2026"` ×7.
- **Freeze:** §7 (Home/Calendar/Team View son proyecciones, no owners) **VIOLADO porprojection incorrecta**
- **Severidad:** **P2-21, P2-28, P2-33b, P3-08, P3-12**
- **Acción:** derivar todos de `state`. Es mecánico y elimina la mitad de los P2.

### F-14 · Extraer `today` a un reloj
- **Evidencia:** `overview.tsx:53,58,534,721`, `account-insight.tsx:717`, `seed.ts:116,261`, `management.tsx:592,600,610,634,642`, `communication.tsx:725`, `store.tsx:112`, `participation.tsx:310`
- **Razón:** `"2026-10-02"` en 13 lugares. `new Date()` + un formateador.
- **Freeze:** §24, §43 (freshness) **IMPLICA**
- **Severidad:** **P2-33b, P3-07**
- **Acción:** `src/shared/lib/clock.ts` con `today()` y `nowLabel()`.

### F-15 · Corregir el link de Announcement en EventDetail
- **Evidencia:** `events.tsx:89-91`
- **Razón:** `audience.includes(teamName)` falla para `"Todo hockey"`. Usar el modelo de audiencia tipado (F-22).
- **Freeze:** §21 **GAP**
- **Severidad:** **P2-14**
- **Acción:** comparar contra un `TeamSet` real.

### F-16 · Gatear Announcement por `ARCHIVED` en detail y en list
- **Evidencia:** `communication.tsx:39-41` y `:581-590`
- **Razón:** 2 condiciones.
- **Freeze:** §9 `ARCHIVED` **GAP**
- **Severidad:** **P2-27b, P2-27c**
- **Acción:** `CommunicationHome`: `(state === "PUBLISHED" || (official && state === "DRAFT"))`. `AnnouncementDetail`: gatear `ARCHIVED` también.

### F-17 · `Announcement.audience` como TeamSet tipado
- **Evidencia:** `model.ts:93`, `communication.tsx:767-776`
- **Razón:** `audience: { clubWide: boolean; teamIds: string[] }` en vez de string. 4 opciones hardcodeadas → selector de teams real.
- **Freeze:** §21 `TEAM_SET` **GAP**
- **Severidad:** **P2-27**
- **Acción:** cambio de tipo + selector. Bloquea F-15.

### F-18 · Audience de `notify()` según §22
- **Evidencia:** `store.tsx:143-151`
- **Razón:** la función recibe un solo evento; debería recibir el `audience` resuelto (los Announcement ya lo tienen tras F-17).
- **Freeze:** §22 `old ∪ new ∪ Availability ∪ Selection ∪ staff` **GAP**
- **Severidad:** **P2-07, P2-16**
- **Acción:** `notify(type, recipients, resourceRef, vars)`.

### F-19 · Guard de last-admin para `EndMembership`
- **Evidencia:** `management.tsx:546-550`
- **Razón:** 1 condición más en el array de operaciones.
- **Freeze:** §18 lista explícitamente `EndMembership del último Admin` **GAP**
- **Severidad:** **P2-19**
- **Acción:** añadir `"Finalizar pertenencia al equipo"` al guard cuando la persona tiene rol ADMIN.

### F-20 · Link a `/jornadas/new` alcanzable
- **Evidencia:** `app/App.tsx:67`; `MorePage:71-78`
- **Razón:** la ruta existe pero es inalcanzable. Agregar un enlace.
- **Freeze:** §23 **GAP de navegación**
- **Severidad:** **P2-32**
- **Acción:** agregar "Crear jornada" al hub de More para sport/official.

### F-21 · Filtros de Search y Calendar en la URL
- **Evidencia:** `overview.tsx:821`, `:390-394`
- **Razón:** `useSearchParams` en vez de `useState`. ~10 líneas por pantalla.
- **Freeze:** §41 `URL/filter → Router + Zod` **VIOLADO**
- **Severidad:** **P2-18**
- **Acción:** migrar los 6 filtros (Search query, Calendar month/year/team/type, Reports team/person/period, Audit 4 filtros).

### F-22 · Coherencia del Legend del calendario
- **Evidencia:** `overview.tsx:494` vs `:547-553`
- **Razón:** `CLUB_EVENT` debe renderizar `warning-soft`, no `success-soft`. 1 condición.
- **Freeze:** §24 presentación coherente
- **Severidad:** **P2-34b**
- **Acción:** agregar la rama `type === "CLUB_EVENT"` al chip.

### F-23 · `allowedActions` por objeto
- **Evidencia:** `store.tsx:84-95`
- **Razón:** reemplazar 6 booleanos por `getAllowedActions(resource)` que respete scope. `canOperateEvent` (`store.tsx:249-259`) ya es el patrón correcto.
- **Freeze:** §40 `Object actions derive from allowedActions. Never recreate server authorization with if role===...` **VIOLADO**
- **Severidad:** **P3-01**
- **Acción:** `getAllowedActions(subject)` con scope TEAM/EVENT/CLUB. Los 6 booleanos se derivan de ahí para no tocar los 14 gates de una vez.

### F-24 · Guardar `baselineValues` además de `baselineVersion`
- **Evidencia:** `events.tsx:749`
- **Razón:** 1 línea más, pero habilita el Conflict Workspace.
- **Freeze:** §44 `baselineVersion` + `baselineValues` **GAP**
- **Severidad:** **P1-06 (parcial)**
- **Acción:** capturar `draft` en el montaje y usarlo en el Alert de conflicto.

### F-25 · Mover `Restricted` a `shared/patterns` y `useEvent` a `shared/hooks`
- **Evidencia:** `account-insight.tsx:30`, `participation.tsx:13`
- **Razón:** 2 archivos nuevos, 2 imports.
- **Freeze:** §39 `routes → features → shared`, *"shared never depends on feature"* **VIOLADO**
- **Severidad:** **P3-02**
- **Acción:** extraer.

### F-26 · Desacoplar `EventRow` del store
- **Evidencia:** `ui.tsx:30,446`
- **Razón:** `EventRow` debería recibir `teamName: string` como prop. 1 prop.
- **Freeze:** §39 *"shared never depends on feature"*; capa `shared` no debe depender de `mock` **VIOLADO**
- **Severidad:** **P3-02**
- **Acción:** 3 líneas.

## 16.3 MISSING — debe implementarse (14 entradas)

> No existe nada de esto. Todo requiere decisión de diseño de superficie antes de codificar.

### M-01 · GuardianRelationship + "responder por menor"
- **Evidencia:** grep `guardian` en `src/` → **0 coincidencias**
- **Razón:** §5 tiene una fila completa para los 5 roles; §1.2 lo lista como actor original; §25 lo tiene como tabla 6; §20 dice que no entra a chats; §53 lo contempla en `hasApplicationAccess`.
- **Freeze:** §1.2, §3 IN, §5, §17, §20, §25, §53 **MISSING**
- **Severidad:** **P1-01**
- **Acción:** requiere decidir (a) dónde ve el guardian su información, (b) si hay ruta propia o vive en `/more/profile`, (c) cómo se modela `can_respond_availability` vs `can_view_child_info`. **No implementar sin esa decisión.**

### M-02 · Superficie de Eligibility para SUBCOMMITTEE + scope/source/reason
- **Evidencia:** `management.tsx:527` (gate ADMIN-only), `model.ts:27-28` (campos muertos)
- **Razón:** §5 da la autoridad; §13 define 4 scopes × 3 sources × 5 reasons; §6 limita el reason a SUBCOMMITTEE + ADMIN.
- **Freeze:** §5, §6, §13 **MISSING**
- **Severidad:** **P1-02**
- **Acción:** decidir si `eligibility` sigue siendo enum plano (mock) o pasa a `EligibilityConstraint[]` (fiel a §25). Si es fiel, es REBUILD-02.

### M-03 · `event_target_teams[]` + `event_target_persons[]`
- **Evidencia:** `model.ts:51,66` (`team: string`, `clubWide: boolean`)
- **Razón:** §10 exige TRAINING con ≥1 Team **o** Person target antes de Scheduled; MATCH exactamente 1 team y 0 persons; `club_wide_target=true` con 0 targets. El modelo actual no puede expresar 3 de 4 casos.
- **Freeze:** §10, §25 tablas 21-22 **MISSING**
- **Severidad:** **P1-03**
- **Acción:** cambio de modelo + form de targets + `canOperateEvent` con scope TEAM.

### M-04 · EventSeries / recurrencia
- **Evidencia:** grep `series|recurr|occurrence` → **0**
- **Razón:** §3 IN, §9 (`ACTIVE→ENDED`, max 366), §25 (4 tablas), §36 (API), §11 (`scheduleSource`).
- **Freeze:** §3, §9, §25, §36 **MISSING**
- **Severidad:** **P1-04**
- **Acción:** decidir representación visual. No es un detalle de form.

### M-05 · Membership como entidad
- **Evidencia:** `model.ts:17`; `management.tsx:691-695` muestra `"Sin asignación deportiva vigente"` para dos estados distintos
- **Razón:** §17 exige Membership separada de TeamAssignment, con TeamAssignment/RoleAssignment **dentro** de Membership vigente.
- **Freeze:** §8, §17, §25 tabla 3 **MISSING**
- **Severidad:** **P1-05**
- **Acción:** modelo + gate de validación en `AssignPlayerToTeam`.

### M-06 · Conflict Workspace (§44 / §73)
- **Evidencia:** `events.tsx:1093-1108` (Alert con 1 botón)
- **Razón:** §73 pide `409 STALE_VERSION → Conflict Workspace` con baseline + localDraft + latestServer lado a lado. §44 dice *"No generic force overwrite"*.
- **Freeze:** §44, §73 **MISSING**
- **Severidad:** **P1-06**
- **Acción:** depende de RHF (M-08). Nuevo primitive `ConflictWorkspace`.

### M-07 · `allowedActions` como fuente de autoridad
- **Evidencia:** `store.tsx:84-95`
- **Razón:** §40 es explícito. Hoy la app *recrea* autorización en el cliente con `hasRole`.
- **Freeze:** §40 **MISSING (arquitectura)**
- **Severidad:** **P3-01** (el fix de superficie es F-23; esto es la backing architecture)
- **Acción:** `mock/authority.ts` con `getAllowedActions(subject)`. Cuando exista backend, el shape ya es el de §36.

### M-08 · Capa de formularios: React Hook Form + Zod 4
- **Evidencia:** `package.json`
- **Razón:** §39 los exige. Sin ellos no hay `baselineValues`, ni schema, ni field errors (§73 422), ni Conflict Workspace.
- **Freeze:** §39 **MISSING**
- **Severidad:** **P1-08**
- **Acción:** añadir deps + un `shared/forms/` con `useZodForm` y un `ConflictBoundary`.

### M-09 · Capa de query/cache: TanStack Query v5 + sessionEpoch
- **Evidencia:** `package.json`; `store.tsx` es un `useState` plano
- **Razón:** §39 lo exige; §41 `No duplicated server truth`; §42 `Each sessionEpoch owns a separate in-memory QueryClient`; §43 freshness completa.
- **Freeze:** §39, §41, §42, §43 **MISSING**
- **Severidad:** **P1-09**
- **Acción:** añadir dep + `app/providers/` con `QueryProvider` que monta un QueryClient nuevo por `sessionEpoch`.

### M-10 · Team create surface
- **Evidencia:** `management.tsx:197` (tabs sin "Equipo"), `TeamAdmin` sólo cambia estado
- **Razón:** §19 requiere Team con `DRAFT → ACTIVE → ARCHIVED` y creación por `Season + Division + Line`. No hay forma de crear un Team.
- **Freeze:** §19, §26 **MISSING**
- **Severidad:** **P2-37**
- **Acción:** tab "Equipo" en StructurePage con alta por (season, division, line) + validación de unicidad.

### M-11 · `ExternalReference` como entidad
- **Evidencia:** `model.ts:137-143` (string `reference` en el entry)
- **Razón:** §26 define la tabla con target whitelist (COMPETITION / COMPETITION_ENTRY / MATCH_EVENT); §5 da lectura a COACH y mutation a SUBCOMMITTEE/ADMIN.
- **Freeze:** §5, §26 **MISSING**
- **Severidad:** **P2-36**
- **Acción:** entidad con `targetType`/`targetId`/`value`/`note`.

### M-12 · `COMPETITION_SCOPE_MISMATCH` en creación de Jornada y EventForm
- **Evidencia:** `events.tsx:1191-1194`, `events.tsx:956-960`
- **Razón:** §16 define las reglas TEAM/LINE scope con validaciones concretas y el error `422`.
- **Freeze:** §16 **MISSING**
- **Severidad:** **P2-33**
- **Acción:** validación en el flujo de Jornada + mostrar la inscripción requerida en el form de evento.

### M-13 · Venue address + field_label + Season dates
- **Evidencia:** `model.ts:126-131` (`StructureItem` con sólo `name`/`archived`); `events.tsx:345` (dirección hardcodeada)
- **Razón:** §19: `Venue: name, address, optional field_label, archived_at`; `Season: Update name/dates`.
- **Freeze:** §19 **MISSING**
- **Severidad:** **P2-37**
- **Acción:** extender el modelo de estructura; eliminar la dirección hardcodeada.

### M-14 · Scope EVENT para COACH
- **Evidencia:** `management.tsx:632-634` (`scope: TEAM` para COACH siempre)
- **Razón:** §5 `COACH | TEAM / EVENT`.
- **Freeze:** §5 **MISSING**
- **Severidad:** **P2-26**
- **Acción:** selector de scope en el form de rol + `canOperateEvent` ya soporta EVENT.

## 16.4 REBUILD — existe pero está conceptualmente mal (6 entradas)

> Reconstruir. No parchear.

### RB-01 · Modelo de dominio (`mock/model.ts`)
- **Evidencia:** `src/mock/model.ts` completo
- **Razón:** Es la pieza que produce 5 de los 6 P0 y 3 de los 10 P1. Los problemas: `Person.role`/`Person.team` duplican `roleAssignments`; `eligibility` es un enum plano cuando §13 pide scope+source+reason; `structure` es un array heterogéneo en vez de 4 entidades; `Notice` sin type ni resource; `Event` con `team: string` en vez de targets plural; `Competition.entries[].team` fusiona dos FKs; `Announcement.audience` es string; `Conversation.unread` es un contador compartido. **Ninguno es un bug local: son todas decisiones de modelado.**
- **Freeze:** §8 (ownership domains), §9 (lifecycles), §25 (45 tablas), §26 (table contracts)
- **Severidad:** **P0-1, P0-2, P0-3, P1-02, P1-03, P1-05, P2-27, P2-36**
- **Acción:** rediseñar los tipos contra §25 antes de tocar ninguna pantalla. Los 13 lifecycles ya están tipados correctamente — **conservar eso**.

### RB-02 · Capa de autoridad (`mock/permissions.ts` + `capabilities`)
- **Evidencia:** `src/mock/permissions.ts` (33 líneas), `store.tsx:83-95`, `store.tsx:249-259`
- **Razón:** 6 booleanos sin scope en lugar de `allowedActions` por objeto. `roleAssignments()` **sintetiza** assignments desde un scalar en vez de modelarlos, lo que hace que `hasRole` sea una función de derivación y no una consulta. La simulación acierta en 17 de 21 filas de §5 — pero por una architecture que §40 prohíbe. Cuando llegue el backend, **todo** hay que reescribir.
- **Freeze:** §40 `Never recreate server authorization with if role===...`; §5 (formula `ROLE + ACTION + SCOPE + OBJECT STATE + FIELD AUTHORITY + SOURCE`)
- **Severidad:** **P3-01, P2-35**
- **Acción:** `mock/authority.ts` con `getAllowedActions({ role, scope, target, objectState, fieldAuthority, source }) → Action[]`. `canOperateEvent` es el seeds del `EVENT` scope — conservarlo como referencia.

### RB-03 · Doble fuente de verdad de autoridad y afiliación
- **Evidencia:** `Person.role` (`model.ts:18`) + `Person.team` (`model.ts:17`) vs `Person.roleAssignments[]` (`model.ts:26`)
- **Razón:** Dos fuentes que ya divergen (P1-07). `roleAssignments()` en `permissions.ts:3-17` sintetiza la lista desde el scalar cuando es `undefined` — o sea, la "verdad" depende de si un campo opcional fue llenado. Es la causa raíz de P1-05, P1-07, P2-01, P2-20, P2-35.
- **Freeze:** §8 PEOPLE, §17 (`RoleAssignment` es la entidad; no hay scalar), §26 (`role_assignments` como tabla)
- **Severidad:** **P1-07, P1-05**
- **Acción:** eliminar `Person.role` y `Person.team`. Todo derivado de `memberships[] + team_assignments[] + role_assignments[]`. Los 20+ sitios que leen `person.role` pasan a `primaryRole(person)`.

### RB-04 · Capa de formularios (9 formularios)
- **Evidencia:** `events.tsx:716-1114`, `participation.tsx` (4 forms), `management.tsx` (3 forms), `communication.tsx` (2 forms), `account-insight.tsx` (3 forms)
- **Razón:** `useState` + validación `if` scattered. Sin `baselineVersion`+`baselineValues` (§44), sin dirty tracking, sin field errors (§73 422), sin preservation guarantee uniforme (§24 *"error preserva input"*), sin Conflict Workspace (§73). El `EventForm` incluso tiene un bug de remontaje (P2-06) que RHF resolvería con `key`.
- **Freeze:** §39 (RHF + Zod 4), §44, §24, §73
- **Severidad:** **P1-08, P1-06, P2-06, P2-31**
- **Acción:** migrar los 9 formularios a `useForm` + `zodResolver`. Orden: EventForm (el más crítico) → Selection → Attendance → MatchRecord → Announcement → Profile → Person → Competition → Jornada.

### RB-05 · Capa de estado (`mock/store.tsx`)
- **Evidencia:** `src/mock/store.tsx:96-208`
- **Razón:** `update(recipe, ...)` acepta un mutador libre — el `recipe` es un anti-patrón: permite cualquier mutación sin validación ni noción de "command". `updateEvent` bumpea `version` en toda escritura (P2-02). No hay `sessionEpoch`, ni freshness, ni reconciliación query-vs-command. El patrón de un write owner es correcto; la implementación es de prototipo.
- **Freeze:** §41 (ownership table), §42 (sessionEpoch isolation), §43 (freshness), §44 (conflict), §47 (success/failure), §72 (E2E contract: *"Frontend never coordinates an atomic business transaction"*)
- **Severidad:** **P1-09, P2-02**
- **Acción:** reemplazar `recipe` por **commands nombrados** (`assignPlayerToTeam`, `movePlayerTeam`, `publishSelection`, `finalizeMatchRecord`, ...) cada uno con su propia validación, su `expectedVersion`, su audit y su notificación. Ése es el shape de §30/§31/§32.

### RB-06 · Estructura de features (6 god files)
- **Evidencia:** `src/features/*` — 6.497 líneas en 6 archivos, 34 pantallas
- **Razón:** `account-insight.tsx` mezcla auth (Login/Activate/NoAccess), perfil (More/Profile) e insight (Reports/Audit) — tres dominios de §8 distintos. `overview.tsx` mezcla Home/Calendar/Teams/TeamDetail/PersonDetail/Search. La agrupación es inconsistente: 3 de 6 archivos sí respetan el dominio. Sin tests, editar Home obliga a leer 916 líneas.
- **Freeze:** §39 (árbol exacto con `routes/` + `features/` + `shared/`)
- **Severidad:** **P3-04, P3-05**
- **Acción:** dividir por dominio de §8: `features/{home,calendar,teams,people,events,participation,communication,management,reports,audit,profile,auth}/`. **Después** de las slices 1-3, no antes (dividir sin tests sólo distributes el riesgo).

---

# 17. FASE 15 — IMPLEMENTATION ORDER (resumen)

El plan ejecutable completo está en `GEI_FIGMA_RECONSTRUCTION_PLAN_V1.md`. Resumen del orden y su justificación:

```
SLICE 0  BASELINE            git init + commit del estado actual  (sin código)
SLICE 1  DECISIONS           resolver P0-6, P1-10, P1-01, P1-02  (sin código)
SLICE 2  FOUNDATION          deps, router modules, providers, paths, tests  (~2 días)
SLICE 3  MOCK STATE          modelo contra §25, commands, query layer    (~4 días)
SLICE 4  CORRECTNESS         los 6 P0 + alta de datos coherentes        (~2 días)
SLICE 5  MISSING SURFACES     las 14 entradas MISSING                    (~5 días)
SLICE 6  CORE FLOWS          completar C, D, E, G, H, J                 (~4 días)
SLICE 7  PERMISSIONS/STATES  allowedActions, notification types, PII    (~3 días)
SLICE 8  RESPONSIVE          las 5 correcciones responsive              (~1 día)
SLICE 9  VISUAL POLISH       los 10 P4                                  (~1 día)
SLICE 10 FINAL QA            matriz de 38 rutas × 5 roles × 3 anchos  (~2 días)
```

**Restricción crítica:** las slices 1 y 2 no se pueden saltear. SLICE 1 porque 3 P0/P1 requieren decisión explícita contra el Freeze (§82), no un fix. SLICE 2 porque **dividir god files y agregar tests sin baseline hace el handoff más riesgoso, no menos** — hoy no hay git, y no hay forma de distinguir un cambio propio de uno preexistente.

---

# 18. FINAL VERDICT

## 18.1 Veredicto por dominio

| Dominio §8 | Estado | Veredicto |
|---|---|---|
| **PEOPLE** | Parcial — sin Membership, sin Guardian, doble fuente de verdad | **REBUILD** |
| **CLUB STRUCTURE** | Parcial — correcto en terminología, P0-1 en identidad | **FIX** (modelo → REBUILD parcial) |
| **COMPETITION** | Parcial — sin ExternalReference, sin scope mismatch | **FIX** |
| **EVENTS** | El más completo del proyecto — sin EventSeries, sin targets plural | **FIX** |
| **PARTICIPATION** | **El mejor resuelto** — los 4 conceptos separados, los 4 derivaciones correctas | **FIX** (P0-2) |
| **COMMUNICATION** | Bien resuelto — entitlements correctos, sin tipos de notificación | **FIX** |
| **MATCH RECORD** | Bien resuelto — stats correctas, P0-3 en corrección | **FIX** (P0-3) |
| **INTEGRITY & INSIGHT** | Reportes honestos, Audit sin before/after ni resource type | **FIX** |
| **Auth infrastructure** | 3 rutas correctas, sin §48/§49/§50 (esperable en mock) | **KEEP** |
| **EventSeries** | Ausente | **MISSING** |
| **GuardianRelationship** | Ausente | **MISSING** |

## 18.2 Las 6 preguntas que la auditoría tenía que responder

**1. Qué está realmente implementado.**
38/38 rutas existen. El motor de estado mock es real, centralizado y con un solo write owner. 17 lifecycles de dominio están **tipados exactamente** según §9 (los 7 estados de Event, los 5 roles, los 3 de Availability, los 3 de Attendance, los 3 de Account, los 3 de Team, los 3 de Competition, los 3 de Entry, los 3 de Announcement, los 4 de Conversation, los 2 de MatchRecord). 17 de 21 filas de la Authority Matrix se cumplen. Los 4 invariantes centrales de §75 sobre Participation (`missing Attendance != Absent`, `Availability != Selection`, `Selection != Attendance`, `Eligibility != inferida`) están implementados **y documentados en la copy de la app**.

**2. Qué está parcialmente implementado.**
22 de 38 rutas. Los patrones deInteractive están completos pero los modelos que los sostienen son simplificaciones: sin `Membership`, sin `notification_type`, sin `event_target_persons[]`, sin `ExternalReference`, sin `coordination_revision` visible, sin Conflict Workspace, sin capa de forms, sin capa de query.

**3. Qué falta.**
14 entradas MISSING. Dos son de dominio completo (GuardianRelationship, EventSeries) y dos son capas de arquitectura obligatorias (RHF+Zod, TanStack Query). El resto son superficies: Eligibility para SUBCOMMITTEE, Team create, Venue address, CompetitionEntry scope mismatch, Coach EVENT scope.

**4. Qué contradice el Freeze.**
6 contradicciones (P0). 3 son destructivas (correcciones que borran historia), 1 es una mutación de invariante (identidad de Team), 1 es un fake success (contraseña), 1 es una fuga de PII (Eligibility a PLAYER). **Ninguna requiere rediseño: 5 se arreglan con código, 1 requiere decisión.**

**5. Qué aparenta funcionar pero sólo es UI estática.**
- **"Cambiar contraseña"** — valida, muestra spinner, muestra check verde, no muta nada (P0-4).
- **La arquitectura de autoridad completa** — 17 filas de §5 correctas, pero recreadas en el cliente con `hasRole`, exactamente lo que §40 prohíbe. Funciona; no sobrevivirá la conexión al backend.
- **La confirmación de publicación de Announcement** — `reason` es obligatorio y llega al audit, pero el `before` no se guarda.
- **`/jornadas/new`** — la pantalla existe, se ve completa, es deep-link safe, y **no se puede llegar desde ningún lado** (P2-32).
- **La sección "Cuerpo técnico"** de TeamDetail — parece derivarse del estado; son 3 literales (P2-21).
- **El badge `6A` y el `· Sexta A`** — parecen derivados; son literales que mienten tras un "Mover de equipo" (P2-33b).

**6. Qué interacciones realmente modifican mock state.**
Verificadas con `structuredClone` + `setState`: responder Availability · abrir/cerrar/corregir Attendance · autosave de Selection · publicar Selection · draft/finalizar/corregir MatchRecord · create/schedule/edit/postpone/cancel/restore/start/complete Event · crear jornada · bulk change venue de jornada · crear persona · asignar/mover/finalizar equipo · asignar/finalizar rol · actualizar elegibilidad · crear/restablecer/deshabilitar/reactivar acceso · generar código de activación · activar cuenta · editar contacto propio · crear/archivar/corregir Announcement · crear/enviar/editar/eliminar mensaje · marcar notificación leída · crear/activar/cerrar/finalizar Competition · crear/activar/finalizar Entry · crear/editar/archivar estructura · cambiar estado de Team · cambiar password de jugador.

**7. Qué cambios se reflejan coherentemente entre distintas pantallas.**
La cadena de **Material Event Change** es la mejor del proyecto y atraviesa 7 superficies: EventForm → Impact Preview → `eventChange` → EventDetail (hora + Alert de reconfirmación) → Calendar (chip) → Home (Próximamente + "Necesita tu atención") → Availability de todas las jugadoras (pasa a "Necesita reconfirmación") → Notification → badge del Shell → `/notifications`. Verificado.
También coherentes: MatchRecord finalize → EventDetail → TeamDetail "Resultados" → Reports/performance · Selection publish → EventDetail → Notification · Attendance → EventDetail → Home → Reports/attendance · Announcement publish/archive → Communication list → Home · Message send → preview + unread badge · Structure rename → teams + events (pero con P0-1).
**Rotas rotas:** `Person.role` tras Asignar/Finalizar rol (6 pantallas) · `Person.team` tras Mover de equipo (Home badge, Shell subtítulo) · **historia tras correcciones** (P0-2, P0-3 — la UI afirma que se conserva y no).

**8. Qué rutas existen y cuáles faltan.**
 existent 38/38 · faltan 0 · extra 3 (todas justificables) · deep-link safe 38/38 · inalcanzables 1 (`/jornadas/new`).

**9. Qué estados del Product Truth están representados.**
Estados de dominio: **17/17**. Estados de UI: 5/8 completos, 3/8 parciales. Estados del catálogo de errores §38: **3/20**. Los 17 del dominio son el segundo punto fuerte del proyecto.

**10. Qué permisos/roles están representados correctamente.**
5/5 roles, exactos, sin roles inventados. 17/21 filas de §5 correctas. Las 4 reglas explícitas de §5 se cumplen: ADMIN no es Coach universal ✓, CAPTAIN no hereda Coach ✓, **ADMIN no ve conversaciones privadas ✓ (notable)**, PLAYER responde su Availability ✓, SUBCOMMITTEE no tiene Attendance ✓. Un leak: P0-5.

**11. Qué conviene CONSERVAR.**
13 entradas KEEP. En orden de valor: los design tokens · los 17 primitives · el `Modal` con focus trap · el Shell con destinos idénticos en sidebar y bottom nav · la jerarquía de Home · la gramática de lista · las tablas responsive como grid · la responsive grammar · el motor de estado con un solo write owner.

**12. Qué requiere CORRECCIÓN.**
26 entradas FIX. Las 6 P0 están todas acá — ninguna requiere rebuild.

**13. Qué debe RECONSTRUIRSE.**
6 entradas REBUILD: el modelo de dominio · la capa de autoridad · la doble fuente de verdad de rol/afiliación · la capa de formularios · la capa de estado · la estructura de features.

**14. Qué deuda estructural dejó Figma Make.**
15 P3. Las tres que más pesan: (a) sin git no hay baseline; (b) la autoridad es `if role===...`Client-side (§40); (c) 6 god files de 6.497 líneas sin un solo test.

**15. Qué orden de implementación conviene seguir.**
SLICE 0 (baseline) → SLICE 1 (decisiones) → SLICE 2 (foundation) → SLICE 3 (mock state) → SLICE 4 (los 6 P0) → SLICE 5 (missing surfaces) → SLICE 6 (core flows) → SLICE 7 (permisos/estados) → SLICE 8 (responsive) → SLICE 9 (polish) → SLICE 10 (QA).

## 18.3 Conclusión

**El output de Figma Make estásubstantivamente más cerca del Freeze de lo que suele estar, y más cerca de lo que el conteo de rutas sugiere.**

Las tres cosas que ordinarily matan un scaffold de Figma Make **no están**:

1. **No hay features inventadas.** Cero rutas injustificadas, cero roles inventados, cero estados de dominio inventados, cero analytics, cero dashboard genérico, y **las 9 cosas OUT de §3 respetadas** (sin OAuth, sin forgot-password, sin pagos, sin inventario, sin médico, sin booking, sin scouting, sin offline-sync, sin Redis/WebSocket). Las 4 "features no justificadas" son afordancias de desarrollo (`?demo=`, `?scenario=`, credenciales demo, código de activación literal), no producto.

2. **No hay contaminación backend.** Cero fetch, cero servidor, cero auth infra, cero DB, cero Supabase/Firebase. El prototipo es 100% mock.

3. **No hay datos hardcodeados por pantalla.** Hay un estado compartido real con un solo write owner, y la propagación entre pantallas funciona.

**Lo que hay que corregir es de una sola naturaleza:** el modelo mock simplificó entidades que el Freeze define con precisión, y tres flujos de corrección escriben sobre la historia en vez de preservarla. **Ninguno de los 6 P0 requiere rediseño**; 5 son cambios localizados y 1 es una decisión de producto.

**El riesgo real del handoff no es el código: es la ausencia de git y de tests.** Con 6.497 líneas en 6 god files, sin baseline y sin una sola prueba, cualquier edición grande es Loteria. Por eso SLICE 0 y SLICE 2 preceden a todo lo demás.

**Prioridad de decisión:** antes de escribir código, hay que resolver 4 preguntas que el Freeze no cierra solo — P0-6 (¿el rename de Venue es material?), P1-10 (¿Tailwind es excepción documentada o migración a CSS Modules?), P1-01 (¿dónde vive la superficie del Guardian?) y P1-02 (¿Eligibility enum plano o `EligibilityConstraint[]`?). Las dos primeras son photometric porque cambian el alcance del trabajo; las dos últimas son de diseño de superficie.

---

**Fin de la auditoría. Ningún archivo de código fue modificado.**






