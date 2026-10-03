# GEI HOCKEY MANAGEMENT SYSTEM
## PLAN DE RECONSTRUCCIÓN POST-AUDITORÍA (para OpenCode)

**NO EJECUTAR. Este documento planifica; no modifica.**

Derivado de `GEI_FIGMA_VS_FREEZE_AUDIT_V1.md` y `GEI_FIGMA_VS_FREEZE_MATRIX_V1.md`.
**Autoridad:** `C:\Users\thega\Downloads\GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1.md` (v1.0)

## Reglas del plan

1. **El Freeze manda.** Si el código y el Freeze discrepan, se cambia el código. Si el código está bien y el Freeze tiene un hueco, se registra el gap y se pide revisión (§82). **Nunca se adapta el Freeze al código.**
2. **Un mini-lote por slice.** Cada slice es commiteable y verificable por separado.
3. **Ningún slice empieza antes de que el anterior esté verificado** (build + typecheck + el acceptance criteria de ese slice).
4. **Lo que no se toca está escrito en cada slice.** Sin excepciones silenciosas.
5. **Toda slice que cambie comportamiento §-visible va acompañada de una línea en la matriz de auditoría.**

---

# ORDEN GLOBAL

```
SLICE 0  BASELINE            sin código        ~0.5 día
SLICE 1  DECISIONS           sin código        ~0.5 día   ← BLOQUEANTE
SLICE 2  FOUNDATION          deps + estructura ~2 días
SLICE 3  MOCK STATE          modelo + commands ~4 días
SLICE 4  CORRECTNESS         los 6 P0          ~2 días
SLICE 5  MISSING SURFACES    las 14 MISSING    ~5 días
SLICE 6  CORE FLOWS          C, D, E, G, H, J  ~4 días
SLICE 7  PERMISIONS / STATES allowedActions etc ~3 días
SLICE 8  RESPONSIVE          las 5 correcciones ~1 día
SLICE 9  VISUAL POLISH       los 10 P4         ~1 día
SLICE 10 FINAL QA            matriz completa   ~2 días
─────────────────────────────────────────────────────
                                            ~25 días
```

**Principio de orden:** FOUNDATION → MOCK STATE COHERENCE → MISSING SURFACES → CORE FLOWS → PERMISSIONS/STATES → RESPONSIVE → VISUAL POLISH → FINAL QA

**Por qué MOCK STATE antes que MISSING SURFACES:** las superficies faltantes (Guardian, EventSeries, Event targets, Eligibility) son todas *features de modelo*. Construirlas sobre el modelo actual garantiza 6 meses de retrabajo. Construirlas sobre el modelo rediseñado no.

**Por qué CORRECTNESS (P0) después de MOCK STATE y no antes:** 5 de los 6 P0 se resuelven mejor después de que `AuditEntry` tenga `before`/`after` y exista una noción de `command`. P0-5 y P0-1 sí se pueden hacer ya (1 línea y 14 líneas). Se hacen en SLICE 2 como prueba de que el harness de verificación funciona.

---

# SLICE 0 — BASELINE

## Scope
Inicializar control de versiones sobre el estado actual. **Sin tocar código.**

## Files affected
```
.gitignore           (agregar .claude-replay.* si falta — ya está)
package.json         (NO — se deja para SLICE 2)
```
Archivos **nuevos**: `.git/` (por `git init`).

## Pasos
1. `git init`
2. `git add -A`
3. `git commit -m "chore: baseline GEI Figma Make output (auditado vs FREEZE v1.0)"`
4. Crear rama de trabajo: `git checkout -b gei/reconstruction-v1`

## Dependencias
Ninguna.

## Acceptance criteria
- `git status` limpio.
- `git log --oneline` muestra exactamente 1 commit.
- `git ls-files | wc -l` ≥ 21 (20 de `src/` + raíz).

## Qué NO tocar
- **Ningún archivo de `src/`.**
- **No normalizar `.gitattributes`** (7728 bytes, generado por Figma).
- No borrar `.figma/`.
- No instalar dependencias.

## Por qué es bloqueante
`AGENTS.md` exige: *"verificar worktree; verificar rama; verificar HEAD; ejecutar `git status --short`; identificar cambios preexistentes"* antes de escribir. Sin git, **no hay forma de distinguir un cambio propio de uno preexistente**. Con 6.497 líneas en 6 god files y 0 tests, esto convierte cualquier edición grande en una lotería.

---

# SLICE 1 — DECISIONS (sin código)

4 preguntas que el Freeze no cierra solo. Ninguna se resuelve escribiendo código.

## D-1 · Tailwind vs CSS Modules (§39) — **P1-10**

**El problema.** §39 dice: *"Stack: ... CSS Modules + CSS variables/tokens"* y lista *"No Next.js, SSR/RSC, generic Redux/Zustand store, or Tailwind architectural dependency"* entre lo prohibido. El proyecto usa Tailwind v4 como sistema de estilos, con 0 CSS Modules. Los CSS variables sí están (`:root` en `theme.css`), lo cual cubre la mitad de la frase.

**Opciones.**

| Opción | Trabajo | Consecuencia |
|---|---|---|
| **(a) Migrar a CSS Modules** | ~15 días. Afecta los 34 screens y los 17 primitives. Reescribir todas las clases. | §39 se cumple literal. Se pierde el ritmo de iteración de Tailwind. Riesgo alto de regresión visual sin tests. |
| **(b) Revisión v1.0.1 del Freeze** | ~1 hora. Emitir `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` con §39 revisado: *"CSS Modules or an equivalent tokenized utility layer; CSS variables required"*. | §39 se cumple en espíritu. §82 permite explícitamente `v1.0.1 clarification/no behavior change`. **Es la opción recomendada.** |
| **(c) Excepción documentada** | ~15 min. Registrar en el repo que Tailwind es excepción consciente. | El Freeze queda contradicho en silencio. **No recomendada.** |

**Recomendación: (b).** §82 autoriza exactamente este tipo de cambio y §0 dice que "cambiar un contrato requiere reabrir explícitamente el freeze". Es un acto de buena documentación, no de这件省略。

**Decidir antes de SLICE 2.** Si es (a), el plan cambia de raíz.

## D-2 · ¿El rename de Venue es un cambio material? (§11) — **P0-6**

**El problema.** §11 lista `Venue` entre los cambios **materiales** con efectos obligatorios (Impact Preview, `coordination_revision++`, Notification). `StructurePage` renombra la entidad Venue y reescribe `event.venue` de todos los eventos **sin ninguno** de esos efectos.

**Opciones.**

| Opción | Descripción |
|---|---|
| **(a)** | El rename de la entidad Venue dispara el flujo material completo por cada evento afectado (con Impact Preview y `revision++`). Coherente con §11. Coste: el rename se vuelve una operación pesada y_confirmationes múltiples. |
| **(b)** | §11 se interpreta como "cambiar el venue **desde el form del evento**" (que ya tiene Impact Preview completo y correcto). El rename de la entidad no propaga; Team y Event muestran el nombre histórico + el actual. Coherente con §19 (`Venue: Update name`) y con §26 (`Identity immutable`). **Es la lectura más consistente del Freeze completo.** |
| **(c)** | El rename de la entidad propaga al `name` de los eventos, **pero** cada evento afectado recibe `coordination_revision++` y notificación sin preview. |

**Recomendación: (b).** Es la única opción que deja §11, §19, §26 y §10 mutuamente consistentes. Documentar con §82.

## D-3 · ¿Dónde vive la superficie del Guardian? — **P1-01**

**El problema.** §5 tiene la fila *"responder por menor — delegación"* para los 5 roles. §20 dice *"Guardian no entra"* a los chats automáticos. §53 dice `hasApplicationAccess` es true *"iff: effective internal RoleAssignment exists, **or** effective Guardian delegation has app permission"*. No hay ninguna superficie.

**Decisiones necesarias.**
1. ¿El guardian tiene su propia ruta (`/guardian`) o vive dentro de `/more/profile`?
2. ¿Un guardian puede tener cuenta sin Membership deportivo (§17 dice *"Guardian puede existir sin Membership deportivo"*)? → entonces `Shell` debe aceptar `hasAccess` por delegación, no sólo por RoleAssignment.
3. ¿Puede un guardian tener **más de un** menor? (§26 no lo restringe; la tabla es N:1)
4. ¿`can_view_child_info` y `can_respond_availability` se modelan por relación? (§26 dice que sí, son columnas de `guardian_relationships`)
5. ¿El guardian ve el DNI del menor? §6: *"Guardian relationship: guardian self + ADMIN"* — **no dice que el guardian vea el DNI del menor**. Interpretar: sí ve nombre, teléfono/email (§6 `teléfono/email: self` — ¿self del menor? ambigüedad). **Requiere aclaración.**

**Nota crítica:** §6 es ambiguo sobre si un guardian ve los datos de contacto de su menor. **Registrar el gap**; no inventar.

## D-4 · ¿Eligibility enum plano o `EligibilityConstraint[]`? — **P1-02**

**El problema.** §5 da `Eligibility mutation` a SUBCOMMITTEE y ADMIN; `Eligibility reason/source` a SUBCOMMITTEE + ADMIN. §13 define **persisted** `PENDING | BLOCKED`, **derived** `ELIGIBLE`, y 4 Scopes × 3 Sources × 5 Reasons. §25 tiene la tabla `eligibility_constraints`. El mock tiene `Person.eligibility: "ELIGIBLE"|"PENDING"|"BLOCKED"` — un enum plano, sin scope, sin source, sin reason (aunque `eligibilityReason`/`eligibilitySource` están **declarados y nunca usados**).

**Opciones.**

| Opción | Descripción | Coste |
|---|---|---|
| **(a)** | Mantener enum plano + agregar `reason`/`source` a `Person`. Simple. Pero §13 exige 4 scopes (CLUB / COMPETITION / ENTRY / EVENT), lo que un enum en `Person` no puede expresar. | Persistente debt |
| **(b)** | `eligibility_constraints: { id, personId, state, scope, scopeRefId, source, reason, note, validFrom, validUntil }[]`. `Person.eligibility` pasa a ser **derivado**: `ELIGIBLE` si no hay constraint activo. Fiel a §13 y §25. | REBUILD del modelo. Es lo correcto. |

**Recomendación: (b).** Es exactamente lo que §13 dice (*"ELIGIBLE derivado: no applicable active constraint"*) y lo que §14 necesita (`hasCurrentConflicts` con `ELIGIBILITY_BLOCKED` / `ELIGIBILITY_PENDING`).

## Dependencias
Ninguna. Es una sesión de decisión.

## Acceptance criteria
- Un documento de decisiones registrado con el formato de §82 (sección cambiada, razón, evidencia, objetos afectados, impacto en lifecycle/authority/DB/API/frontend/E2E/migración).
- Si se elige (b) en D-1: un archivo nuevo del Freeze v1.0.1.

## Qué NO tocar
- **Ningún archivo de `src/`.**
- **No reescribir el Freeze v1.0.** Si se emite v1.0.1, es un archivo **nuevo**, y el v1.0 queda intacto.

---

# SLICE 2 — FOUNDATION

## Scope
Infraestructura mínima para que el resto del trabajo sea verificable. **Sin cambios de comportamiento de producto** salvo P0-5 y P0-1, que se hacen acá como prueba del harness.

## Dependencias
SLICE 0 (baseline), SLICE 1 (D-1 decidida — si fue (a), esta slice se reescribe).

## Files affected

### Modificados
```
tsconfig.json                  + noUnusedLocals, noUnusedParameters
vite.config.ts                 (sin cambios)
package.json                   + 3 deps, + script test, + script typecheck
src/app/App.tsx                + errorElement, mover a src/app/router/
src/app/App.tsx                (git mv) → src/app/router/index.tsx
src/features/management.tsx    − 1 línea (P0-5 está en events.tsx, no aquí)
src/features/events.tsx        − gate en Alert de conflictos (P0-5)
src/features/management.tsx    − bloques de rename de División/Línea (P0-1)
```

### Nuevos
```
src/app/router/index.tsx              (movido desde app/App.tsx)
src/app/router/error-boundary.tsx     (errorElement)
src/app/providers/index.tsx           (composición de providers)
src/routes/index.ts                   (mapa de rutas; genera el router)
src/shared/lib/clock.ts               (today(), nowLabel())
src/shared/lib/cn.ts                  (class merge helper)
src/shared/hooks/useEvent.ts          (extraído de features/events.tsx)
src/shared/patterns/Restricted.tsx    (extraído de features/management.tsx)
test/setup.ts
src/shared/ui.test.tsx                (smoke test de los 17 primitives)
```

### Eliminar
```
src/features/*  → imports de 25 valores sin uso (P3-08)
```

## Pasos

**2.1 — Dependencias**
```
pnpm add @tanstack/react-query react-hook-form zod
```
(Ésta es la **única** slice donde se instalan dependencias.)

**2.2 — `tsconfig.json`**
```json
"noUnusedLocals": true,
"noUnusedParameters": true
```
Esto hace que los 25 imports muertos fallen el typecheck. **Es intencional**: primero se ven, después se limpian.

**2.3 — Scripts**
```json
"typecheck": "tsc --noEmit",
"test": "vitest run"
```
Añadir `vitest` como devDep (o `node --test` si se quiere cero deps nuevas).

**2.4 — Corregir los 25 imports** (P3-08)
7 archivos, sólo borrar líneas de import. Sin cambios de lógica.

**2.5 — Extraer `useEvent` y `Restricted`** (P3-02)
```diff
- participation.tsx:13   import { useEvent } from "./events"
+ participation.tsx      import { useEvent } from "../shared/hooks/useEvent"

- account-insight.tsx:30 import { Restricted } from "./management"
+ account-insight.tsx    import { Restricted } from "../shared/patterns/Restricted"
```
`useEvent` se mueve a `shared/hooks/` porque combina `useParams` + `useProduct` y es usado por 4 screens de participación.

**2.6 — Desacoplar `EventRow` del store** (P3-02)
```diff
- export function EventRow({ event, showDate = true })
+ export function EventRow({ event, teamName, showDate = true })
```
Y los ~12 call sites pasan `teamName={state.teams.find(t => t.id === event.team)?.name}`. Elimina `shared/ui → mock/store`.

**2.7 — `errorElement`** (P3-06)
Nuevo `src/app/router/error-boundary.tsx` con un `Empty` + "Recargá la página" + `role="alert"`. Un error de render deja de mostrar "Página no encontrada".

**2.8 — `src/routes/index.ts`** (P3-05)
Mover el array de rutas a un módulo propio con la forma de §23 (agrupado por sección: Public/Auth, Global, Teams/People, Events, Jornadas, Communication, Management, Reports/Audit). El router queda en `src/app/router/index.tsx`.

**2.9 — `shared/lib/clock.ts`** (P2-33b, P3-07)
```ts
export const today = () => new Date().toISOString().slice(0, 10)
export const nowLabel = () => new Date().toLocaleString("es-AR", {...})
export const dateAt = (offsetDays: number) => ...
```
El seed se parametriza con `today()` para que el dataset siga siendo relativo.

**2.10 — Smoke test de los 17 primitives** (P3-15)
Un test por primitive: renderiza, verifica `role`/`aria-label`/clases clave. Baseline de seguridad visual antes de cualquier otra cosa.

**2.11 — P0-5** (1 línea, `events.tsx:305`)
```diff
- {conflicts.length > 0 && (
+ {conflicts.length > 0 &&
+  (capabilities.sport || capabilities.official || capabilities.management) && (
```

**2.12 — P0-1** (borrar 14 líneas, `management.tsx:154-167`)
Eliminar los bloques `if (item.type === "División")` y `if (item.type === "Línea")` dentro de `save()`. El Team conserva su identidad. Si D-2 fue (b), también eliminar `if (item.type === "Sede")`.

## Acceptance criteria
- `pnpm typecheck` pasa con `noUnusedLocals` activo.
- `pnpm test` pasa: 17 smoke tests.
- `pnpm build` pasa.
- Las 38 rutas siguen renderizando en cold load.
- P0-5 y P0-1 cerrados y verificados manualmente:
  - Como PLAYER (`?demo=player`), `/events/match-cuba` **no** muestra el Alert de conflictos.
  - Como ADMIN, rename de una División **no** cambia `teams[].division` ni `teams[].name`.
- `git status --short` muestra sólo los archivos de esta slice.

## Qué NO tocar
- **`src/styles/theme.css`** — KEEP-01, no se toca.
- **`src/shared/ui.tsx`** salvo los 3 cambios explícitos (imports, `EventRow` prop). Ningún otro primitive se modifica.
- **`src/app/Shell.tsx`** — no se toca en esta slice (P4-05 dropdowns y P3-09 breadcrumb van en SLICE 9).
- **Los 6 god files** — no se dividen todavía. Dividir sin tests sólo distribuye el riesgo.
- **`src/mock/model.ts`** — el rediseño es SLICE 3.
- **Ninguna de las 14 MISSING.** Ninguna feature nueva.
- **No cambiar copy** salvo el del P0-5.
- **No tocar** `.figma/`, `vite.config.ts`, `index.html`, `.gitattributes`.

---

# SLICE 3 — MOCK STATE COHERENCE

## Scope
Rediseñar el modelo contra §25 y reemplazar el mutador `recipe` por commands. **La slice más importante del plan.** Todo lo demás depende de ella.

## Dependencias
SLICE 2.

## Files affected

### Modificados
```
src/mock/model.ts         reescrito (tipos contra §25)
src/mock/seed.ts          reescrito (seed parametrizado por reloj + coherencia)
src/mock/store.tsx        reescrito (commands en vez de recipe)
src/mock/permissions.ts   reescrito (derivación desde assignments reales)
src/mock/scenarios.ts     movido a src/mock/dev/scenarios.ts
```

### Nuevos
```
src/mock/commands/index.ts
src/mock/commands/people.ts       assignPlayerToTeam, movePlayerTeam, endPlayerTeam,
                                  assignRole, endRole, createPerson, setAccountStatus,
                                  resetCredential, issueSetupToken
src/mock/commands/events.ts        createEvent, scheduleEvent, changeEventMaterial,
                                  postponeEvent, cancelEvent, restoreEvent,
                                  startEvent, completeEvent, abandonEvent
src/mock/commands/participation.ts respondAvailability, publishSelection,
                                  openAttendance, markAttendance, closeAttendance,
                                  correctAttendance, finalizeMatchRecord,
                                  correctMatchRecord
src/mock/commands/communication.ts createConversation, sendMessage, editMessage,
                                  deleteMessage, saveAnnouncement,
                                  publishAnnouncement, correctAnnouncement,
                                  archiveAnnouncement
src/mock/commands/structure.ts     createStructure, renameStructure, archiveStructure,
                                  createTeam, changeTeamState
src/mock/commands/competition.ts   createCompetition, changeCompetitionState,
                                  createEntry, activateEntry, endEntry
src/mock/commands/jornada.ts       createJornada, addJornadaMatches,
                                  bulkChangeJornadaVenue
src/mock/authority.ts              getAllowedActions (M-07 / F-23)
src/mock/query.ts                  capa de queries sobre el cache
src/mock/notifications.ts          los 8 tipos de §22 + resolución de audiencia
src/mock/dev/scenarios.ts          harness de desarrollo
src/mock/dev/demo-switcher.tsx     switcher de actor
```

## Modelo objetivo (extracto — los 13 lifecycles de §9 se conservan tal cual)

```ts
// §25 people
interface Person { id; firstName; lastName; dni: string|null; birthDate: string|null;
                   phone: string|null; email: string|null; version }
interface Account { id; personId; username: string;   // case-insensitive unique
                    status: "PENDING"|"ACTIVE"|"DISABLED";
                    activatedAt; disabledAt; credentialVersion; version }
interface Membership { id; personId; validFrom; validUntil: string|null }
interface TeamAssignment { id; personId; teamId; validFrom; validUntil: string|null }
interface RoleAssignment { id; personId; role: Role; scopeType; targetId;
                           validFrom; validUntil: string|null }
interface GuardianRelationship { id; guardianPersonId; childPersonId; relationshipType;
                                 canViewChildInfo; canRespondAvailability;
                                 validFrom; validUntil }
// §25 club
interface Season { id; name; startsOn; endsOn|null; archivedAt: string|null }
interface Division { id; name; archivedAt: string|null }
interface Line { id; name; archivedAt: string|null }
interface Team { id; seasonId; divisionId; lineId; name;
                state: "DRAFT"|"ACTIVE"|"ARCHIVED" }   // Identity immutable
interface Venue { id; name; address; fieldLabel: string|null; archivedAt: string|null }
// §25 competition
interface Competition { id; name; organizer; state: "DRAFT"|"ACTIVE"|"CLOSED" }
interface CompetitionEntry { id; competitionId; scope: "TEAM"|"LINE";
                              teamId: string|null; lineId: string|null;
                              state: "PENDING"|"ACTIVE"|"ENDED" }
interface EligibilityConstraint { id; personId; state: "PENDING"|"BLOCKED";
                                  scope: "CLUB"|"COMPETITION"|"ENTRY"|"EVENT";
                                  scopeRefId: string|null;
                                  source: "INTERNAL"|"AHBA"|"OTHER";
                                  reason: "ADMIN"|"DISCIPLINE"|"FEDERATION"
                                        |"MEDICAL_CLEARANCE"|"OTHER";
                                  note; validFrom; validUntil }
// §25 events
interface Event { id; type: "TRAINING"|"MATCH"|"CLUB_EVENT"; title;
                  startAt: string|null; endAt: string|null; timezone;
                  venueId: string|null; state: EventState;
                  clubWideTarget: boolean;
                  seriesId: string|null; coordinationRevision: number;
                  version: number; createdBy; }
interface EventTargetTeam { eventId; teamId }
interface EventTargetPerson { eventId; personId }
interface Match { eventId; opponent; competitionEntryId: string|null }
interface EventLogistics { eventId; meetingAt; departureAt; meetingPoint;
                          transportNote; arrivalInstructions }
interface EventSeries { id; teamId|null; rrule; untilOn; occurrenceCount;
                        state: "ACTIVE"|"ENDED" }
// §25 participation
interface Availability { id; eventId; personId; response: "YES"|"MAYBE"|"NO";
                         confirmedRevision: number }   // NEEDS_RECONFIRMATION derivado
interface SelectionSet { id; eventId; draftRevision: number }
interface SelectionRevision { id; selectionSetId; players: string[];
                               author; publishedAt }
interface AttendanceSheet { eventId; openedAt|null; closedAt: string|null }
interface AttendanceEntry { id; sheetEventId; personId;
                            value: "PRESENT"|"ABSENT"|"JUSTIFIED"|null;
                            correctedAt: string|null; correctionReason: string|null }
// §25 communication
interface Announcement { id; title; body; state: "DRAFT"|"PUBLISHED"|"ARCHIVED";
                         publishedAudience: AudienceSnapshot|null;
                         publishedAt; publisherPersonId }
interface AudienceSnapshot { clubWide: boolean; teamIds: string[] }   // §21
interface Conversation { id; kind: "DIRECT"|"GROUP"|"TEAM"|"EVENT";
                         teamId|null; eventId|null; directPairKey: string|null;
                         title; state: "ACTIVE"|"ARCHIVED" }
interface ConversationParticipant { conversationId; personId;
                                     joinedAt; leftAt: string|null }
interface Message { id; conversationId; authorPersonId; body;
                    sentAt; editedAt|null; deletedAt|null }   // tombstone
interface Notification { id; recipientPersonId;
                         type: NotificationType;   // §22, los 8
                         resourceType; resourceId; originEventId: string|null;
                         title; body; occurredAt; createdAt; readAt: string|null }
// §25 match_record
interface MatchRecord { id; eventId; state: "DRAFT"|"FINAL";
                        status: "PLAYED"|"FORFEIT"|"ABANDONED";
                        geiScore; opponentScore; observations; finalizedAt }
interface PlayerMatchStats { id; matchRecordId; personId;
                              played: boolean; goals; assists }
// §25 integrity
interface AuditEntry { id; actorPersonId; commandName; resourceType; resourceId;
                       reason: string|null;
                       before: unknown|null; after: unknown|null;   // ← cierra P0-2/P0-3
                       occurredAt }
```

## Los 5 principios de esta slice

1. **Commands, no recipes.** Cada mutación es una función nombrada con su propia validación. Elimina el anti-patrón `update((draft) => { ...cualquier cosa... })`.
2. **Un command = un audit entry + sus notificaciones.** Atómico dentro del `structuredClone`.
3. **`before`/`after` obligatorios en todo audit de corrección.** Cierra P0-2, P0-3, P2-08b.
4. **`version` sólo lo bumpea el command que cambia el agregado.** Cierra P2-02.
5. **Derivaciones puras, fuera de los commands:** `hasCurrentConflicts` (§14), `NEEDS_RECONFIRMATION` (§4), `ELIGIBLE` (§13), `UNRECORDED` (§9), `matchesPlayed` (§15).

## Pasos

**3.1** Escribir `src/mock/model.ts` nuevo con los tipos de arriba. **Los 13 lifecycles de §9 se copian literalmente del actual** — están correctos.

**3.2** Escribir `src/mock/commands/*.ts`. Cada command:
```ts
export function publishSelection(state: State, actor: Person,
  { eventId, playerIds, expectedRevision }: PublishSelectionArgs
): CommandResult<State> {
  // 1. resolve actor
  // 2. authorize: getAllowedActions → "Selection"
  // 3. check expectedRevision (§44)
  // 4. domain validate: state === "SCHEDULED" (§12)
  // 5. mutate: selection_sets + selection_revisions (inmutable)
  // 6. audit con before/after
  // 7. notification SELECTION_PUBLISHED con audiencia §22
  // 8. return newState
}
```

**3.3** Reescribir `store.tsx`: `useSyncExternalStore` o un store con `dispatch(command)`. **Opcionalmente** TanStack Query como cache de lectura, con `queryKey: ['sessionEpoch', actorId, ...]`. §42 exige un QueryClient por sessionEpoch.

**3.4** Reescribir `seed.ts`: `createSeed({ today })`. Añadir **un dataset PENDING** para que `/activate` sea alcanzable sin pasar por admin. Coherencia de datos:
- `match-cuba.published` **no** debe incluir a `p4` (BLOCKED) si el publish la bloquea → o se cambia la regla (P2-22) o el seed.
- Los 3 announcements con `audience` como `AudienceSnapshot`.
- `notice` con `type` de §22.

**3.5** `authority.ts`: `getAllowedActions({ role, scope, targetId, objectState, fieldAuthority, source }) → Action[]`. `canOperateEvent` se reescribe sobre esta función.

**3.6** Mover `scenarios.ts` → `mock/dev/` y montar el switcher tras `import.meta.env.DEV`.

## Acceptance criteria
- `pnpm typecheck` pasa.
- Los 17 lifecycles de §9 siguen accessible con los mismos labels.
- Los 8 `NotificationType` de §22 son producibles y distinguibles.
- `getAllowedActions` reproduce las 21 filas de la Authority Matrix (§5) — **test de tabla**.
- `publishSelection` produce un `selection_revisions` inmutable y un audit con `before`/`after`.
- `closeAttendance` deja los `UNRECORDED` como `null` (no `ABSENT`).
- `correctAttendance` y `correctMatchRecord` preservan el `before` en el audit. **← cierra P0-2/P0-3**
- Ningún command de Availability o Selection draft bumpea `event.version`. **← cierra P2-02**
- Las 38 rutas siguen funcionando con el modelo nuevo.
- `git diff --stat` muestra que `model.ts`, `seed.ts`, `store.tsx`, `permissions.ts` cambiaron y las 6 featureswartcs.

## Qué NO tocar
- **`src/shared/ui.tsx`** — los primitives no se tocan en esta slice.
- **Los 6 god files de `src/features/`** — salvo los 6 imports ya arreglados en SLICE 2. Ninguna lógica de pantalla cambia acá.
- **`src/styles/theme.css`** — KEEP.
- **`src/app/Shell.tsx`** — no se toca.
- **Ninguna feature nueva.** Ninguna de las 14 MISSING entra acá.
- **No cambiar copy de la app.**
- **No eliminar los `?demo=`/`?scenario=` todavía** — sólo moverlos detrás del flag DEV.

---

# SLICE 4 — CORRECTNESS (los 6 P0)

## Scope
Cerrar las 6 contradicciones de Product Truth. P0-5 y P0-1 ya se hicieron en SLICE 2.

## Dependencias
SLICE 3 (el `before`/`after` del audit viene de ahí).

## Files affected
```
src/features/management.tsx          P0-1 (resto), P0-6
src/features/participation.tsx       P0-2, P0-3
src/features/account-insight.tsx     P0-4
src/features/events.tsx              P0-5 (verificado en SLICE 2)
src/mock/model.ts                    Account.credentialVersion (para P0-4)
src/mock/commands/people.ts          resetCredential real
src/mock/commands/events.ts          materialChange con efectos §11 (para P0-6)
src/mock/notifications.ts            audiencia §22
test/p0.test.ts                      tests de invariante
```

## Pasos

### 4.1 · P0-1 (resto) — Team identity
**Ya hecho en SLICE 2.** Verificar: como ADMIN, renombrar una División no cambia ningún `team.division` / `team.name`. Añadir test de invariante:
```ts
it("rename de División no muta la identidad de ningún Team", ...)
it("unique(season, division, line) se preserva", ...)
```

### 4.2 · P0-2 — Preservar historia en corrección de Attendance
Con `AuditEntry.before/after` de SLICE 3:
- `correctAttendance` escribe `before: { personId, value }[]` y `after: { personId, value }[]`.
- **Actualizar el copy**: hoy el Alert dice *"El cierre original se conserva"* — hay que hacerlo literalmente cierto.
- Verificar que el `attendance_sheet` sigue con `closedAt` (§9).

### 4.3 · P0-3 — Preservar historia en corrección de MatchRecord
- `correctMatchRecord` escribe `before: { record, stats }` / `after`.
- **Actualizar el copy**: hoy el toast dice *"El resultado sigue siendo Final"* (cierto) pero no menciona que el valor anterior queda registrado. Hay que decirlo.
- Verificar §15: la corrección **no** cambia el estado del Event.

### 4.4 · P0-4 — Cambio de contraseña real
Modelar `Account.credentialVersion` (§51 lo requiere para Admin reset).
```diff
- if (edit === "contact") { update(...) }
+ if (edit === "contact") dispatch(updateOwnContact({ phone, email }))
+ else dispatch(changeOwnPassword({ current, next }))
```
Y `changeOwnPassword` incrementa `credentialVersion` (§51: *"credentialVersion++"*). Opcionalmente invalida sesiones simuladas.

Si se prefiere no modelar la contraseña en el mock: **quitar el toast de éxito** y dejar el modal informativo ("en esta demostración la contraseña no se persiste"). Ambas opciones cumplen §24. **Preferencia: modelar**, porque `credentialVersion` se necesita igual para `resetCredential`.

### 4.5 · P0-6 — Rename de Venue (según D-2)
- Si D-2 = **(b)**: eliminar el bloque `if (item.type === "Sede")` de `save()`. Añadir `Event.venueNameAtAssignment` para que EventDetail muestre el nombre histórico + el actual.
- Si D-2 = **(a)**: `renameVenue` dispara `materialChange` por cada evento afectado, con Impact Preview en `StructurePage` y `coordination_revision++` + notificación.
- Si D-2 = **(c)**: propagar el nombre, pero con `coordination_revision++` y notificación por evento, sin preview.

### 4.6 · P0-5 (verificación)
Ya hecho en SLICE 2. Test:
```ts
it("PLAYER no ve el Alert de conflictos de elegibilidad", ...)
```

### 4.7 · Copy audit
`grep -rn "se conserva\|se conservan\|historial" src/features/` y verificar que **cada** afirmación sea cierta. Hoy hay tres que mienten.

## Acceptance criteria
- `pnpm typecheck` y `pnpm test` pasan.
- Los 6 P0 tienen un test que falla en el baseline y pasa después.
- **Ningún `grep "se conserva"` en la app es falso.**
- `git diff --check` limpio.
- Las 38 rutas siguen renderizando.

## Qué NO tocar
- **`src/shared/ui.tsx`** — salvo P4-07 (Badge tone) si se quiere; es P4, va en SLICE 9.
- **`src/styles/theme.css`**.
- **Los god files** — no se dividen en esta slice.
- **Ninguna feature nueva.**
- **No cambiar el comportamiento de ningún flujo que no sea P0.** En particular: no tocar la lógica de publish de Selection, ni de Attendance open/close, ni de MatchRecord finalize.

---

# SLICE 5 — MISSING SURFACES

## Scope
Implementar las 14 entradas MISSING. En 4 sub-lotes, en este orden.

## Dependencias
SLICE 3 (modelo), SLICE 4 (P0 cerrados).

## 5.A · Membership + TeamAssignment separados (M-05, P1-05)

| | |
|---|---|
| **Scope** | Separar `Membership` de `TeamAssignment`. Gate: *"TeamAssignment/RoleAssignment internos deben ocurrir dentro de Membership vigente"* (§17). |
| **Files** | `mock/model.ts`, `mock/commands/people.ts`, `features/management.tsx` (PersonAdminDetail), `features/management.tsx` (PeopleManagement) |
| **Acceptance** | `PersonAdminDetail` muestra Membership y TeamAssignment por separado con sus períodos. `assignPlayerToTeam` falla con `MEMBERSHIP_HAS_ACTIVE_DEPENDENCIES` si no hay Membership vigente. La columna "EQUIPO" de PeopleManagement muestra `—` para quien tiene Membership sin TeamAssignment. |
| **No tocar** | La lógica de `assignRole`, `disableAccount`, `correctAttendance`. La UI de Competition. |

## 5.B · Event targets plural (M-03, P1-03)

| | |
|---|---|
| **Scope** | `Event.targetTeamIds: string[]` + `Event.targetPersonIds: string[]`. Aplicabilidad §10: MATCH exactamente 1 team + 0 personas; TRAINING ≥1 team **o** persona antes de Scheduled; `clubWideTarget=true` → 0 targets. |
| **Files** | `mock/model.ts`, `mock/commands/events.ts`, `features/events.tsx` (EventForm + EventDetail), `features/participation.tsx` (los 4 readers de roster), `features/overview.tsx` (Home, Calendar), `shared/ui.tsx` (`EventRow` — target names como prop) |
| **Acceptance** | Se puede crear un TRAINING dirigido a 2 equipos, y uno dirigido a 3 personas. `clubWideTarget=true` no muestra selector de equipo. `canOperateEvent` con `scope: EVENT` y target = eventId. La fila "Disponibilidad" de un evento club-wide muestra todos los roster relevantes (no uno). **← cierra P2-15** |
| **No tocar** | La lógica de los 5 lifecycles de Attendance/Selection/MatchRecord. Los templates de `shared/ui.tsx` salvo `EventRow`. |

## 5.C · GuardianRelationship (M-01, P1-01)

| | |
|---|---|
| **Scope** | Modelo + admin UI + flujo de respuesta delegada. **Requiere D-3 decidida.** |
| **Files** | `mock/model.ts`, `mock/commands/people.ts`, `mock/authority.ts` (`hasApplicationAccess` con delegación, §53), `features/management.tsx` (PersonAdminDetail → sección Guardian), `features/participation.tsx` (AvailabilityPage → responding on behalf of), `app/Shell.tsx` (`hasAccess` acepta delegación) |
| **Acceptance** | Un guardian con Cuenta ACTIVE y delegación vigente accede a la app **sin** RoleAssignment interno (§53). En AvailabilityPage puede responder por su menor si `canRespondAvailability`. Un guardian **no** aparece en conversaciones automáticas (§20). Un guardian **no** ve el DNI del menor salvo decisión D-3. `RoleAssignment` sigue siendo el mecanismo deportivo; Guardian **no** es un rol (§5). |
| **No tocar** | `capabilities.chat`, `capabilities.sport`, la matriz de `getAllowedActions` para los 5 roles. `Shared/ui.tsx`. |
| **Riesgo** | Alto: §6 es ambiguo sobre qué PII ve el guardian del menor. **Si D-3 no lo aclara, NO implementar; registrar el gap.** |

## 5.D · Eligibility como `EligibilityConstraint[]` (M-02, P1-02)

| | |
|---|---|
| **Scope** | Implementar D-4 = (b). `Person.eligibility` pasa a derivado. Nueva sección de Eligibility accesible a SUBCOMMITTEE **y** ADMIN, con scope, source y reason. |
| **Files** | `mock/model.ts`, `mock/commands/people.ts` (`setEligibilityConstraint`, `endEligibilityConstraint`), `mock/authority.ts`, `features/management.tsx` (PersonAdminDetail → sección Eligibility con scope/source/reason), **nueva** ruta o pestaña para SUBCOMMITTEE |
| **Acceptance** | `ELIGIBLE` es derivado (no constraint activo). `hasCurrentConflicts` (§14) lee los constraints. ADMIN y SUBCOMMITTEE pueden crear/finalizar constraints con los 4 scopes, 3 sources y 5 reasons de §13. `reason`/`source` visibles **sólo** para SUBCOMMITTEE + ADMIN (§6). COACH ve **sólo** el status (§5, §6). **Ningún dato clínico** en la UI (§3 BOUNDARY). |
| **No tocar** | La lógica de Selection (los conflictos se siguen derivando igual). La tabla de `SelectionPage` (sólo cambia el origen del dato). `MatchRecordPage`. |

## 5.E · Team create + Venue/Season fields (M-10, M-13, P2-37)

| | |
|---|---|
| **Scope** | Tab "Equipo" en StructurePage con alta por `(season, division, line)` y validación de unicidad. `Venue.address` + `fieldLabel`. `Season.startsOn`/`endsOn`. Eliminar la dirección hardcodeada de EventDetail. |
| **Files** | `mock/model.ts`, `mock/commands/structure.ts`, `features/management.tsx` (StructurePage, TeamAdmin), `features/events.tsx` (EventDetail, EventForm) |
| **Acceptance** | Se puede crear un Team con estado DRAFT y activarlo. La validación de `unique(season, division, line)` rechaza duplicados con el copy de §26. `EventDetail` muestra la dirección real del Venue (o "Sin dirección"). `Season` muestra sus fechas. **Elimina el literal `"Alvear 1240 · Ituzaingó"`.** |
| **No tocar** | La lógica de `dependencies()` que bloquea archive (§33). `TeamAdmin` más allá del toggle de estado. |

## 5.F · CompetitionEntry scope + ExternalReference (M-11, P2-33, M-12)

| | |
|---|---|
| **Scope** | `CompetitionEntry` con `teamId` **y** `lineId` separados (deja de fusionar dos FKs). Entidad `ExternalReference` con target whitelist de §26. `COMPETITION_SCOPE_MISMATCH` en creación de Jornada y en EventForm. |
| **Files** | `mock/model.ts`, `mock/commands/competition.ts`, `mock/commands/jornada.ts`, `features/management.tsx` (CompetitionsPage), `features/events.tsx` (EventForm select de competencia, JornadaPage) |
| **Acceptance** | Entry TEAM y LINE se muestran con su identidad correcta. Una entrada con target whitelist inválido se rechaza. Crear un Match cuya CompetitionEntry no matchea el Team/Line/Season produce el error de §16 con copy explicativo. **§16: `Match Team.season = Jornada.season`** se verifica. **§16: bulk máximo 100** se aplica con `BULK_OPERATION_TOO_LARGE`. |
| **No tocar** | El fence de `CloseCompetition` (ya correcto). La UI de `Attendance`, `Selection`, `MatchRecord`. |

## 5.G · EventSeries (M-04, P1-04)

| | |
|---|---|
| **Scope** | `EventSeries` + `event_series_target_teams/persons` + `event_occurrence_overrides`. Alcance visual a definir en D-3-style (no estaba en D-1..D-4; **agregar una decisión D-5** si hace falta). |
| **Files** | `mock/model.ts`, `mock/commands/events.ts`, `features/events.tsx` (EventForm — bloque de recurrencia), `features/overview.tsx` (Calendar debe mostrar las ocurrencias generadas) |
| **Acceptance** | Crear un TRAINING semanal por 8 semanas genera 8 eventos. El calendario los muestra. El límite de 366 por command se aplica con `RECURRENCE_TOO_LARGE`. Editar la serie con `event_occurrence_overrides` altera una ocurrencia sin tocar las demás. Cada ocurrencia es un Event independiente (no duplica lifecycle, §16). |
| **No tocar** | Los 5 lifecycles de participación. La UI de Announcement, Conversation, Notification. |
| **Riesgo** | Medio: la generación de ocurrencias puede tocar la semilla y las rutas. Considerar si es la última sub-slice. |

## Acceptance criteria de SLICE 5
- `pnpm typecheck`, `pnpm test`, `pnpm build` pasan.
- Las 7 sub-slices se commitean por separado.
- Una fila de la matriz §4 PEOPLE y §4 EVENTS pasa de "Parcial" a "Completo".
- 0 features OUT de §3 introduzidas.

## Qué NO tocar
- **Los 6 god files no se dividen.** Es tentador hacerlo ahora porque se tocan todos; **no hacerlo**. La división es SLICE 10 y sólo después de tener los tests de esta slice.
- **`shared/ui.tsx`** — sólo `EventRow` si 5.B lo exige.
- **El Shell** — sólo si 5.C lo exige.
- **No tocar Attendance/Selection/MatchRecord más allá de lo que exija 5.B/5.D como reader.**
- **No agregar rutas fuera de las 38 + las que el Freeze declare.**

---

# SLICE 6 — CORE FLOWS

Completar los 6 flujos PARTIALLY_INTERACTIVE. Ningún flujo nuevo.

## Dependencias
SLICE 5.

## 6.A · Flow C — Selection (P2-05, P2-04, P2-22)

| | |
|---|---|
| **Scope** | Los 5 estados de §45 (falta `CONFLICT`). El diff `selectedNow`/`removedNow` de §22. Resolver la incoherencia del publish. |
| **Decisión necesaria** | **D-5**: ¿`publishSelection` **bloquea** por eligibility, o **permite** publicar y deriva `hasCurrentConflicts`? §14 dice *"puede derivar"* (permite, no obliga). El prototipo hoy bloquea pero también presenta "publicado con conflicto" como legal, y el seed tiene un caso. **Recomiendo: permitir publicar y derivar el conflicto** — es lo que §14 describe literalmente y lo que hace el seed coherente. Requiere §82 si se cambia el comportamiento actual. |
| **Files** | `features/participation.tsx` (SelectionPage), `mock/commands/events.ts` / `mock/commands/participation.ts` (`publishSelection` con diff), `mock/notifications.ts` (audiencia), `shared/ui.tsx` (`DiffList` nuevo para `selectedNow`/`removedNow`) |
| **Acceptance** | Los 5 estados de §45 aparecen con su copy. `?scenario=` produce `CONFLICT` y el UI ofrece reintento. El modal de republicación muestra `selectedNow` y `removedNow` con nombres. La audiencia de `SELECTION_PUBLISHED` es la §22. La `selection_revisions` anterior queda intacta. |
| **No tocar** | `AttendancePage`, `MatchRecordPage`, la lógica de Attendance open/close. |

## 6.B · Flow D — Attendance (P2-08, P2-09)

| | |
|---|---|
| **Scope** | Bloquear el mark directo sobre COMPLETED abierto (§12). Añadir reapertura de la hoja. `mark()` con audit entry. |
| **Files** | `features/participation.tsx` (AttendancePage), `mock/commands/participation.ts` (`reopenAttendance`, `markAttendance` con audit) |
| **Acceptance** | Con el evento COMPLETED y la hoja abierta, la única vía de cambio es "Corregir asistencia" con motivo. "Reabrir asistencia" disponible cuando el evento es SCHEDULED o IN_PROGRESS; **no** cuando es COMPLETED (allí sólo corrección, §12). `markAttendance` produce audit entry. `UNRECORDED` sigue separado de `ABSENT` en todas partes. |
| **No tocar** | El copy de §9 que ya es correcto. La derivación de `hasCurrentConflicts`. La `selection_revisions`. |

## 6.C · Flow E — Match Record (P2-31)

| | |
|---|---|
| **Scope** | **Decisión D-6**: ¿la regla `goals de jugadoras > score GEI` se conserva, se elimina, o se registra en §82? §0 dice *"Frontend no inventa reglas de negocio"*. **Recomiendo eliminarla** — no está en §15 ni es derivable. Si se conserva, requiere §82. |
| **Files** | `features/participation.tsx` (MatchRecordPage) |
| **Acceptance** | Si D-6 = eliminar: el guardado no valida `goals > score`. Si D-6 = conservar: la regla queda documentada con §82 y el copy explica el porqué. `matches_played` sigue derivado de MatchRecord (§15). Los stats siguen filtrados a `played` (§15). El Event hace `COMPLETED`/`ABANDONED` según `status` (§15). |
| **No tocar** | La corrección (ya resuelta en SLICE 4). El gate `canOperateEvent`. `ReportsPage`/`ReportDetail`. |

## 6.D · Flow G — Notifications (P2-07, P2-16, P2-03)

| | |
|---|---|
| **Scope** | Los 8 tipos de §22 ya existen como enum (SLICE 3). Falta: resolución de audiencia completa, clave lógica única de §26, y `origin_event_id`. |
| **Files** | `mock/notifications.ts`, `mock/commands/*.ts` (todos los que notifican), `features/communication.tsx` (Notifications — agrupar por tipo, mostrar `occurredAt` real) |
| **Acceptance** | La audiencia de un cambio de target = `old ∪ new ∪ existing Availability ∪ published Selection ∪ relevant staff` (§22) — verificable con un test. Un Announcement con audiencia "Sexta A" **no** notifica a ADMIN ni a otros equipos. La clave lógica `origin_event_id + recipient + type` evita duplicados. `EVENT_POSTPONED`, `EVENT_CANCELLED` y `EVENT_RESTORED` producen tipos distintos. `?scenario=session-interrupted` produce la UX de §73 *"Session Interruption"* real, no un cold boot. El copy *"No pudimos confirmar el resultado."* (§73 ambiguous) existe. |
| **No tocar** | `ConversationPage` (sus mensajes no notifican, §22). El `unread` de conversaciones (es otro domain state — ver 6.E). |

## 6.E · Flow F — Communication (P2-10, P2-11, P2-12, P2-13)

| | |
|---|---|
| **Scope** | Creación de conversación TEAM y EVENT (los 4 tipos de §20). `joined_at`/`left_at` + add/remove de participantes. Corregir `Conversation.unread` (contador por participante). Ampliar el selector de participantes. Corregir la altura del composer (P2-23). |
| **Decisión necesaria** | **D-7**: `Conversation.unread` no existe en §25. ¿Se modela `notification` por mensaje no leído, o se elimina el contador? **Recomiendo**: modelar unread como derivada de `messages` + `ConversationParticipant` (`lastReadAt` es un invention menor, o conteo de mensajes con `author ≠ self` posteriores al `joinedAt`). Eliminar el campo `unread` del agregado. |
| **Files** | `mock/model.ts`, `mock/commands/communication.ts`, `features/communication.tsx` (NewConversation, ConversationPage, CommunicationHome) |
| **Acceptance** | Se puede crear la conversación canónica de un Team (0..1, §20) y de un Event (0..1). Intentar crear una segunda muestra el existente. Agregar un participante setea `joinedAt`; no ve historia anterior. Un ex-participante conserva su período autorizado (`leftAt` §20). `GROUP` puede incluir personas de otros Divisions. El contador de no leídos es por participante. El composer no queda bajo la bottom nav en 390px. ADMIN y SUBCOMMITTEE **siguen** sin acceso (§20). |
| **No tocar** | `AnnouncementForm`, `AnnouncementDetail`. La lógica de `Announcement` archive. |

## 6.F · Flow H — Management (P2-19, P2-21, P2-26, P2-21b)

| | |
|---|---|
| **Scope** | Guard de last-admin para `EndMembership` (§18). Derivar "Cuerpo técnico" de `roleAssignments`. Scope EVENT para COACH (§5). Setup token: uno activo por cuenta (§51). |
| **Files** | `features/management.tsx` (PersonAdminDetail, StructurePage), `features/overview.tsx` (TeamDetail), `mock/commands/people.ts` |
| **Acceptance** | Intentar finalizar la pertenencia del último ADMIN falla con `LAST_ADMIN_REQUIRED`. "Cuerpo técnico" de TeamDetail lista los `RoleAssignment(COACH, TEAM)` **y** `RoleAssignment(COACH, EVENT)` vigentes. El selector de rol ofrece scope TEAM **o** EVENT para COACH, y `INVALID_ROLE_SCOPE` si se intenta ADMIN/PENDING. Emitir un setup token nuevo invalida el anterior (§51). El código **no** es un literal compartido con `/activate` (se genera y se compara contra el valor emitido). |
| **No tocar** | `PersonAdminDetail` más allá de estos puntos. La UI de Competition. Los 10 archivos de `shared/`. |

## 6.G · Flow J — Jornada (P2-32, P2-33b)

| | |
|---|---|
| **Scope** | Hacer `/jornadas/new` alcanzable. Validaciones §16. Editar composición (add/remove matches). Eliminar el id literal. |
| **Files** | `features/account-insight.tsx` (MorePage), `features/events.tsx` (JornadaPage), `mock/commands/jornada.ts` |
| **Acceptance** | `/jornadas/new` se alcanza desde `/more` para sport/official. `MorePage` enlaza a `state.jornadas[0].id` (o a una lista si se agrega). `Match Team.season = Jornada.season` se verifica al crear. `COMPETITION_SCOPE_MISMATCH` se produce con copy explicativo. Se pueden agregar/quitar partidos de una jornada existente, respetando *"Match pertenece como máximo a una Jornada"*. El bulk de sede sigue siendo atómico y sigue bumpeando `coordination_revision` + notificando. Límite de 100 con `BULK_OPERATION_TOO_LARGE`. |
| **No tocar** | La presentación de la lista de partidos. `EventDetail`. |

## 6.H · Flow A (residual) — P2-29, P2-02 residual

| | |
|---|---|
| **Scope** | Un PLAYER sin respuesta previa debe ver "Necesita tu reconfirmación" tras un cambio material. Eliminar `event.version++` residual en la respuesta de Availability (si no se resolvió en SLICE 3). |
| **Files** | `features/overview.tsx` (Home, línea 73), `mock/commands/participation.ts` |
| **Acceptance** | Tras un cambio material, un PLAYER que nunca respondió ve la fila de atención y puede responder. Un PLAYER que respondió la ve con el estado NEEDS_RECONFIRMATION. Un COACH que no es PLAYER no ve el panel de respuesta propia. |
| **No tocar** | La derivación de `availabilityLabel`. `SelectionPage`. |

## Acceptance criteria de SLICE 6
- Los 10 flujos quedan en FULLY_INTERACTIVE o con gaps documentados y aceptados.
- `pnpm typecheck`, `pnpm test`, `pnpm build` pasan.
- Una matriz de 38 rutas × 10 flujos × 5 roles está en el repositorio como test de tabla.
- Cada P2 cerrado tiene un test.

## Qué NO tocar
- **`src/shared/ui.tsx`** — sólo los 2 primitives nuevos (`DiffList`, y el fix de `EventRow` de 5.B). Nada más.
- **`src/styles/theme.css`** — KEEP.
- **`src/app/Shell.tsx`** — salvo el guard de `hasAccess` de 5.C.
- **No cambiar el copy de los mensajes que ya son correctos** (§9 UNRECORDED, §21 audiencia inmutable, §12 POSTPONED).
- **No agregar features.** Ninguna.
- **No dividir god files.**

---

# SLICE 7 — PERMISSIONS / STATES

## Scope
 Consolidar la autoridad en `allowedActions`, cerrar los gaps de PII, y limpiar las features no justificadas.

## Dependencias
SLICE 6.

## 7.A · `getAllowedActions` como fuente única (P3-01, P2-35)

| | |
|---|---|
| **Scope** | Eliminar la dependencia de `capabilities.sport` (boolean sin scope) como gate. Cada objeto expone sus acciones. |
| **Files** | `mock/authority.ts` (nuevo en SLICE 3, se completa acá), `mock/store.tsx` (eliminar `capabilities`), **los 14 call sites de `capabilities.sport`**, `mock/permissions.ts` (eliminar) |
| **Fórmula §5** | `ROLE + ACTION + SCOPE + OBJECT STATE + FIELD AUTHORITY + SOURCE`, default DENY. |
| **Acceptance** | `getAllowedActions({ role, scope, targetId, objectState }) → Action[]`. Ningún componente hace `if (role === ...)`. Los 6 booleanos `capabilities` desaparecen del código de features (pueden quedar como helpers de navegación derivados de `getAllowedActions`, pero **no** se usan para gating). `hasApplicationAccess` (§53) incluye delegación de Guardian. Test de tabla que verifica las 21 filas de §5 × los 5 roles × los scopes. |
| **No tocar** | Los 17 primitives. La lógica de negocio de cada pantalla — sólo **de dónde** sale el permiso. |

## 7.B · PII gating completo (§6)

| | |
|---|---|
| **Scope** | `getVisibleFields(subject, viewer) → Field[]` según §6. |
| **Files** | `mock/authority.ts`, `features/overview.tsx` (PersonDetail), `features/management.tsx` (PersonAdminDetail, PeopleManagement), `features/participation.tsx` (AvailabilityPage roster), `features/account-insight.tsx` (AuditPage reason) |
| **Acceptance** | Campo por campo de §6: `username` (self+ADMIN), `DNI` (ADMIN), `birthDate` (ADMIN), `phone/email` (self, ADMIN, COACH/CAPTAIN del Team), `Guardian` (guardian self + ADMIN; Coach sólo info mínima), `Eligibility status` (COACH scope + SUBCOMMITTEE + ADMIN), `Eligibility reason/source` (SUBCOMMITTEE + ADMIN), `Message body` (participants), `Audit sensitive` (ADMIN con redacción). **ADMIN puede ver phone/email en PersonDetail** (P2-36b cerrado). Ningún PLAYER ve un status derivado de Eligibility. `AuditPage` redacta el `reason` según §6. |
| **No tocar** | Los valores. Sólo su visibilidad. La lógica de `PersonAdminDetail` más allá de qué campos muestra. |

## 7.C · Los 4 `notification_type` que faltan + plantillas (§22, §58)

| | |
|---|---|
| **Scope** | `EVENT_POSTPONED`, `EVENT_CANCELLED`, `EVENT_RESTORED` deben ser tipos distinguibles de `EVENT_CHANGED`/`EVENT_RESCHEDULED`. Templates por `templateCode` con variables inmutables (§58). |
| **Files** | `mock/notifications.ts`, `features/communication.tsx` (agrupar por tipo), `mock/commands/events.ts` |
| **Acceptance** | Los 8 tipos de §22 se producen y se distinguen en la lista. El título y el cuerpo derivan de un `templateCode` + variables, no de un string libre. La lista agrupa por tipo con icono. `Notification` conserva el `occurredAt` real (no `"Hace 1 hora"` hardcodeado). |
| **No tocar** | El mark-read / mark-all. El modelo de `readAt`. |

## 7.D · Eliminar las 4 features no justificadas (UNJUSTIFIED_FEATURES)

| | |
|---|---|
| **Scope** | Mover el harness de desarrollo detrás de `import.meta.env.DEV`. |
| **Files** | `mock/dev/scenarios.ts`, `mock/dev/demo-switcher.tsx`, `features/account-insight.tsx` (`LoginPage` `<details>`), `mock/commands/people.ts` + `features/account-insight.tsx` (código de activación literal) |
| **Acceptance** | En build de producción: `?demo=` y `?scenario=` no cambian el actor ni el estado. El `<details>` con credenciales demo no se renderiza. El setup code se **genera** en `issueSetupToken` y se guarda hasheado en el modelo; `ActivatePage` compara contra el hash, no contra un literal. **La Premier slice donde el build de producción se comporta distinto del dev.** |
| **No tocar** | Los **estados** que el harness representa (§38 errors, §24 loading/degraded). Sólo el mecanismo de activación. |
| **Nota** | Los escenarios `degraded`, `stale`, `impact-changed`, `save-error` deben seguir siendo **accesibles en dev** y tener un equivalente en los **tests** (§74 lista 39 escenarios E2E). |

## 7.E · `sessionEpoch` + freshness (§42, §43)

| | |
|---|---|
| **Scope** | Un `QueryClient` por `sessionEpoch`. Refetch on focus/reconnect. Intervalos de polling de §57. |
| **Files** | `app/providers/query-provider.tsx`, `mock/query.ts`, `app/App.tsx`, `mock/store.tsx` |
| **Acceptance** | Cambiar de actor (login/logout) destruye el QueryClient viejo y monta uno nuevo (§42). El cache autenticado **nunca** se persiste. Los intervalos de §57: `/me` 60s, Home 30s, Calendar 60s, Event 30s, Availability/Selection/Attendance 10s, Team 60s, Communication 30s, Conversation head 5s, Notifications summary 30s, Reports/Audit none. `GET` retry max 2 en network/5xx. Mutation retry false. Dirty form nunca sobreescrito por background refresh (§44). |
| **No tocar** | Las mutations (§41: *"Mutation automatic retry: false"*). Los componentes. |

## 7.F · Mutation journal (§46)

| | |
|---|---|
| **Scope** | `sessionStorage` para comandos ambiguos. |
| **Files** | `mock/lib/mutation-journal.ts` (nuevo), `mock/query.ts` |
| **Acceptance** | Contiene `idempotencyKey`, `requestFingerprint`, `commandKind`, `createdAt`. **Nunca** payload, PII, form state ni result. TTL 24h. Tras TTL no hay replay automático. |
| **No tocar** | Nada de UI. Es invisible. |

## 7.G · Filtros en la URL (§41) — si no se hizo en 6

| | |
|---|---|
| **Scope** | `Search` (query), `Calendar` (month/year/team/type), `Reports` (team/person/period), `Audit` (actor/resource/action/date), `StructurePage` (tab), `CommunicationHome` (tab), `TeamDetail` (tab), `PeopleManagement` (5 filtros). |
| **Files** | 8 feature files |
| **Acceptance** | Cada filtro es un searchParam. Back/forward preserva el filtro. El link es compartible. `Zod` valida los searchParams (§41 lo nombra explícitamente). Un searchParam inválido cae al default, no rompe. |
| **No tocar** | Los datos que se muestran. Sólo dónde vive el estado del filtro. |

## Acceptance criteria de SLICE 7
- **0 componentes** hacen `if (role === ...)` para gating.
- Test de tabla de §5 (21 filas × 5 roles × scopes) pasa.
- Test de tabla de §6 (9 campos × 6 viewers) pasa.
- `grep -r "capabilities\." src/features/` → 0 resultados.
- `grep -r "import.meta.env.DEV" src/` → el harness está detrás del flag.
- Build de producción: `?demo=admin` no cambia el actor.
- `pnpm typecheck`, `pnpm test`, `pnpm build` pasan.

## Qué NO tocar
- **Los 17 primitives de `shared/ui.tsx`** — salvo `DiffList` si 6.A lo pidió.
- **`src/styles/theme.css`**.
- **`src/app/Shell.tsx`** — salvo el `hasAccess` de 5.C. La nav deriva de `/me.navigation` (§40) pero el array `nav` se **mantiene** (es la representación local de ese endpoint).
- **No cambiar copy.**
- **No agregar features.**

---

# SLICE 8 — RESPONSIVE

## Scope
5 correcciones. Sin rediseño.

## Dependencias
SLICE 7.

## 8.1 · Altura del composer de conversación (P2-23)
**Files:** `features/communication.tsx:386`
```diff
- className="flex h-[calc(100dvh-280px)] min-h-[420px] max-w-4xl flex-col"
+ className="flex max-w-4xl flex-col"
+ // usar flex-1 sobre el main del shell en lugar de un calc fijo
```
El `Surface` debe ocupar el alto disponible del shell, no un `calc` con constante mágica.
**Acceptance:** a 390×844, 768×1024 y 1440×900, el composer queda **visible por encima** de la bottom nav.
**No tocar:** el layout interno de los mensajes, el `max-w-4xl`, el form.

## 8.2 · MatchRecord en 390px
**Files:** `features/participation.tsx:1007,1016`
El `grid-cols-[1fr_50px_55px_55px]` con valores de 2 dígitos se desborda visualmente.
**Acceptance:** con goals/assists de 2 dígitos a 390px no hay wrap ni corte.
**No tocar:** el grid de 4 columnas en ≥640px.

## 8.3 · Tabla de Reports con 0 filas (P2-39)
**Files:** `features/account-insight.tsx:639-689`
**Acceptance:** `<tbody>` con 0 filas muestra un mensaje de empty (§24 `empty != zero != error`), no una tabla sin cuerpo.
**No tocar:** el `overflow-x-auto`, el `min-w-[560px]`, los `tabular-nums`.

## 8.4 · Legend del calendario (P2-34b)
**Files:** `features/overview.tsx:494` + `:547-553`
**Acceptance:** el chip de `CLUB_EVENT` renderiza `warning-soft` y el legend coincide. Test de snapshot.
**No tocar:** la lógica de filtrado del calendario, los filtros.

## 8.5 · Verificación de los 3 anchos × 38 rutas
**Files:** ninguno (es verificación)
**Acceptance:** una matriz de 38 rutas × {390, 768, 1440} verificada **manualmente** con evidencia (captura o descripción). Sin overflow horizontal en ninguna. Sin contenido bajo la bottom nav.

## Acceptance criteria de SLICE 8
- Las 38 rutas × 3 anchos verificadas.
- 0 overflow horizontal.
- 0 elementos固定 tapados por la bottom nav.
- Los degradados de tabla (Selection, MatchRecord, PeopleManagement, Reports) mantienen significado legible.

## Qué NO tocar
- **Los breakpoints.** No se agregan ni se cambian. La gramática actual (`sm`/`md`/`lg`/`xl`) es correcta.
- **`src/styles/theme.css`** — ni una línea.
- **`pb-28`, `pb-[env(safe-area-inset-bottom)]`, `w-[224px]`, `lg:pl-[224px]`** — todos funcionan.
- **El sidebar y el bottom nav.** Mismos destinos (§40).
- **No rediseñar el calendario** — la degradación mes→agenda en mobile ya es la decisión correcta.

---

# SLICE 9 — VISUAL POLISH

## Scope
Los 10 P4 + el token set + el `Badge` tone map.

## Dependencias
SLICE 8.

## 9.1 · Escala tipográfica (P4-01)
`9px` → `10px`; `10px` → `11px` en los 2 sitios más densos (sidebar eyebrow, chips de Attendance). `11px` se mantiene.
**Acceptance:** ningún texto bajo 10px. La densidad de Home se mantiene. Sin overflow en ninguna tabla.
**No tocar:** los pesos de Inter, la jerarquía 27/15/13/11/10, `tabular-nums`.

## 9.2 · Icono de `Empty` (P4-02)
`Empty` acepta un `icon?: ReactNode` con default `CalendarDays`. Los 14 gates de acceso pasan un icono temático (`ShieldCheck` para restricted, `House` para no-access, `Search` para búsqueda).
**No tocar:** el layout de `Empty` (dashed border, título, detalle, acción).

## 9.3 · Token set (P3-17, P4-03)
Añadir a `theme.css`: `--space-*` (4), `--text-*` (5), `--shadow-*` (3), `--motion-*` (2), `--z-*` (4). Consumir `--radius` o eliminarlo (P4-03).
**Acceptance:** `theme.css` es la fuente de verdad de color, forma, espacio, tipo, sombra y motion. Ningún valor crudo repetido fuera de `theme.css` **cuando aparece 3+ veces**.
**No tocar:** los 17 valores de color existentes. **KEEP-01.**

## 9.4 · `Badge` tone map como fuente de verdad (P3-18)
Mover el mapa de `ui.tsx:104-120` a `mock/model.ts` (o `shared/lib/domain-tones.ts`) como `Record<DomainState, Tone>` tipado contra los enums de §9.
**Acceptance:** agregar un estado al dominio obliga a tocar el mapa (TypeScript lo fuerza). `Badge` recibe `tone` explícito, no adivina desde `value`.
**No tocar:** los 4 tonos ni sus tokens.

## 9.5 · `labels` como diccionario único (P3-19)
`labels` hoy es `Record<string, string>` catch-all → `labels[x] || x` renderiza cualquier string. Hacerlo `Record<DomainState | DomainType | Role, string>` tipado. Mover los strings sueltos (`"Sin respuesta"`, `"Necesita reconfirmación"`, `"Sin registrar"`, `"Sin abrir"`, `"Abierta"`, `"Cerrada"`) al mismo diccionario.
**Acceptance:** ningún estado se renderiza con el fallback `value`. Los 4 valores distintos de `PENDING` según dominio se distinguen (`Account PENDING` = "Cuenta pendiente"; `Selection` = "Borrador"; `Entry PENDING` = "Inscripción pendiente"; `Eligibility PENDING` = "Pendiente").
**No tocar:** las traducciones existentes que son correctas.

## 9.6 · Badge con children que contradicen el `value` (P4-07)
`events.tsx:417-423` y `participation.tsx:569-577` pasan `value="DRAFT"` con children "Cerrada"/"Abierta"/"Sin abrir".
**Acceptance:** el tono corresponde al estado real de la hoja de asistencia (CLOSED → neutral, OPEN → success/info, NOT_OPENED → neutral).
**No tocar:** el copy de los 3 labels.

## 9.7 · Dropdown como primitive (P4-05)
Extraer el patrón repetido 4 veces a `shared/ui.tsx` con click-outside, Escape y foco gestionado.
**Acceptance:** 1 primitive, 4 usos. Los 4 menús cierran con Escape y con click fuera.
**No tocar:** el contenido ni el copy de los 4 menús.

## 9.8 · Tratamiento destructivo (P4-06)
`Archivar comunicado`, `Archivar` (StructurePage), `Archivar equipo`, `Deshabilitar cuenta`, `Finalizar rol`, `Finalizar inscripción`, `Cerrar asistencia` → `variant="danger"` o `ghost` + `text-danger`.
**Acceptance:** toda acción irreversible o de cierre usa señal de destructividad. `Cancelar evento` conserva `variant="danger"`.
**No tocar:** `Button` (KEEP-11) ni sus 4 variants.

## 9.9 · Breadcrumb del header (P3-09)
El ternario de 6 niveles no cubre 6 rutas. Convertirlo en un mapa declarativo `Record<pathPrefix, Label>`.
**Acceptance:** `/jornadas`, `/announcements`, `/conversations`, `/reports`, `/search`, `/more` muestran su etiqueta correcta.
**No tocar:** la posición ni el estilo del breadcrumb.

## 9.10 · Gaps de spacing (P4-04)
`gap-2.5` → `gap-2` o `gap-3`; `gap-3.5` → `gap-3` o `gap-4`. 3 sitios.

## Acceptance criteria de SLICE 9
- Los 10 P4 cerrados.
- `theme.css` es la fuente de verdad de las 6 categorías de token.
- Ningún texto bajo 10px.
- Los 4 dropdowns cierran con Escape y click fuera.
- Toda acción destructiva tiene señal visual.
- `pnpm typecheck`, `pnpm test`, `pnpm build` pasan.
- **Comparación visual antes/después** de las 38 rutas para confirmar que nada se rompió.

## Qué NO tocar
- **La paleta.** Los 17 tokens de color de `theme.css` son KEEP-01.
- **La gramática de radios.** 4 niveles.
- **La responsive grammar.** 4 breakpoints.
- **`Button`, `Modal`, `Alert`, `Empty`, `RowLink`, `EventRow`, `Header`, `Section`, `Surface`, `TextField`, `Select`, `TextArea`, `Avatar`, `IconButton`** — sólo `Dropdown` es nuevo; `Empty` gana una prop opcional.
- **La jerarquía de Home.** KEEP-06.
- **El copy de los mensajes correctos.**
- **No rediseñar.** Esta slice es pulido, no diseño.

---

# SLICE 10 — FINAL QA

## Scope
Verificación exhaustiva. **Incluye la división de god files (RB-06), que sólo se hace acá.**

## Dependencias
SLICE 9.

## 10.A · Matriz de verificación de rutas (38 × 5 roles × 3 anchos)

| Verificación | Criterio |
|---|---|
| Las 38 rutas existen y renderizan en cold load | deep-link safe |
| Los 3 extra (`/`, `/more`, `*`) se comportan | redirect / hub / 404 |
| Ninguna ruta restricted muestra acciones fuera de §5 | `getAllowedActions` |
| Los 5 roles ven exactamente las superficies que §5 permite | tabla |
| 390 / 768 / 1440 sin overflow | manual con evidencia |
| Ningún estado de Product Truth se muestra a quien no le corresponde | §6 |

## 10.B · Matriz de flujos (10 × verificado end-to-end)

Recorrer **A** a **J** en la app real y confirmar `FULLY_INTERACTIVE` o documentar el gap residual.
Para cada flujo, la evidencia incluye: la mutación de mock state, la propagación a las pantallas afectadas, y el audit entry.

## 10.C · Matriz de estados (29 de dominio + 8 de UI)

Verificar que cada estado tiene un camino real que lo produzca. Los que no se puedan producir se eliminan del claim.

## 10.D · P0-guard test suite

Los 6 P0 con un test que falla en el baseline de SLICE 0:

```ts
describe("P0-1 Team identity immutable", ...)
describe("P0-2 Attendance correction preserves history", ...)
describe("P0-3 MatchRecord correction preserves history", ...)
describe("P0-4 no fake success on password change", ...)
describe("P0-5 PLAYER never sees Eligibility-derived info", ...)
describe("P0-6 Venue rename respects §11", ...)
```

## 10.E · RB-06 — Dividir los god files (POR ÚLTIMO)

**Sólo ahora**, con la suite de tests completa.

```
src/features/overview.tsx        → features/{home,calendar,teams,people,search}/
src/features/events.tsx         → features/events/{detail,form,jornadas,impact}/
src/features/participation.tsx   → features/participation/{availability,selection,attendance,match-record}/
src/features/communication.tsx   → features/communication/{home,conversations,announcements,notifications}/
src/features/management.tsx      → features/management/{home,structure,people,teams,competitions}/
src/features/account-insight.tsx → features/{profile,auth,reports,audit}/
```

**Regla:** **git mv primero**, después extraer. Cero reescrituras. Un commit por archivo movido, después uno por extracción.
**Acceptance:** mismos 6 god files → N módulos pequeños. Los 34 exports mantienen nombre y firma. Tests idénticos antes y después. `git diff` de un `git mv` debe mostrar 0 cambios de contenido.
**No tocar:** ninguna lógica durante la división. Sólo mover.

## 10.F · E2E representativos (§74)

§74 lista 39 escenarios. Implementar al menos los que el mock puede demostrar:
`Login/Home` · `Person + Account` · `Activation` · `Account reset` · `Team assignment/move/end` · `Role lifecycle` · `Event create/schedule` · `Availability` · `Guardian Availability` (si 5.C se hizo) · `Selection draft/publish` · `Eligibility race` · `material Event change` · `target change` · `cancel/postpone/restore` · `Attendance` · `Attendance correction` · `MatchRecord` · `MatchRecord correction` · `Jornada bulk` · `Announcement` · `Conversation creation` · `Messages` · `membership change` · `authorization loss` · `Account disable` · `password change` · `Search` · `Notification navigation` · `Reports` · `Audit` · `concurrency 409` · `ambiguous outcome`

Los que §74 lista pero el mock no puede demostrar (Worker failure, DB failover, rolling deploy) se documentan como **EVIDENCE PENDING** per §78.

## 10.G · Accesibilidad y evidencia §78

§78 lista 12 behaviours como EVIDENCE PENDING. Verificar al menos:
- `no-false-success UI` — automatizado por 10.D.
- `accessibility behavior` — contraste, foco visible, navegación por teclado, `role`/`aria-label`.
- `Chrome / Edge / Firefox compatibility` — verificar manualmente.

## 10.H · Checklist §82 antes de cerrar

- ¿Algún cambio modificó un contrato del Freeze? → §82 con las 11 campos.
- ¿Algún estado nuevo necesita justificación de lifecycle? (§0: *"Un estado nuevo debe estar justificado por un lifecycle"*)
- ¿Alguna pantalla nueva tiene workflow, authority y data owner? (§0)
- ¿Algún endpoint nuevo corresponde a una intención real? (§0)
- ¿Alguna tabla nueva está justificada? (§25)
- ¿Sereek el audit inverso (§77)?
```
unjustified table: 0 · unjustified role: 0 · unjustified state: 0
unjustified API route: 0 · unjustified command: 0
unjustified screen/workflow: 0 · unjustified infrastructure component: 0
table without owner: 0 · transition without command: 0
command without authority: 0 · screen without data source: 0
client authority duplication: 0
```

## Acceptance criteria de SLICE 10
- Las 6 matrices (rutas, flujos, estados, autoridad, responsive, reverse) verificadas con evidencia.
- 0 P0. 0 P1. Cada P2 restante documentado y aceptado.
- 0 unjustified (tabla, rol, estado, ruta, command, screen, infra, client authority duplication).
- `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm format` pasan.
- `git status --short` limpio tras el commit final.
- **Los 3 documentos de auditoría actualizados** con el estado final.

## Qué NO tocar
- **No agregar features.** Ninguna. Si algo "falta", es un gap del Freeze, no del código.
- **No cambiar copy** salvo que un test de §24 lo exija.
- **`src/styles/theme.css`** en su forma de SLICE 9.
- **`src/shared/ui.tsx`** en su forma de SLICE 9.
- **No reabrir el Freeze** sin §82 completo.

---

# MATRIZ DE DEPENDENCIAS

```
SLICE 0  BASELINE
   │
SLICE 1  DECISIONS (D-1…D-5)
   │
SLICE 2  FOUNDATION ──────────┐
   │                         │ P0-5, P0-1
SLICE 3  MOCK STATE          │
   │  (modelo + commands)    │
   │      │                  │
   ├──────┴──────────────────┘
   │
SLICE 4  CORRECTNESS (P0-2, P0-3, P0-4, P0-6)
   │
SLICE 5  MISSING SURFACES (5.A → 5.G)
   │
SLICE 6  CORE FLOWS (6.A → 6.H)   ← D-5, D-6, D-7
   │
SLICE 7  PERMISSIONS/STATES (7.A → 7.G)
   │
SLICE 8  RESPONSIVE
   │
SLICE 9  VISUAL POLISH
   │
SLICE 10 FINAL QA + RB-06
```

## Decisiones requeridas y cuándo

| Decisión | Pregunta | Se decide en | Bloquea |
|---|---|---|---|
| **D-1** | Tailwind vs CSS Modules (§39) | **SLICE 1** | Toda la SLICE 2. Si es (a), el plan cambia de raíz. |
| **D-2** | ¿Rename de Venue es material? (§11) | **SLICE 1** | P0-6 (SLICE 4), 5.E |
| **D-3** | Superficie del Guardian (§5, §53, §6) | **SLICE 1** | 5.C completa |
| **D-4** | Eligibility enum vs `EligibilityConstraint[]` | **SLICE 1** | 5.D, M-07 |
| **D-5** | ¿Publicar Selection con eligibility conflict? (§14) | **SLICE 6.A** | 6.A |
| **D-6** | ¿Regla `goals > score`? (§0) | **SLICE 6.C** | 6.C |
| **D-7** | Modelo de `Conversation.unread` (§25) | **SLICE 6.E** | 6.E |
| **D-8** | Alcance visual de EventSeries | **SLICE 5.G** | 5.G |

---

# RESUMEN DE ESFUERZO

| Slice | Días | Riesgo | Reversible |
|---|---:|---|---|
| 0 · BASELINE | 0.5 | — | n/a |
| 1 · DECISIONS | 0.5 | bajo | n/a |
| 2 · FOUNDATION | 2 | **medio** | sí |
| 3 · MOCK STATE | 4 | **alto** | difícil |
| 4 · CORRECTNESS | 2 | bajo | sí |
| 5 · MISSING SURFACES | 5 | medio | parcial |
| 6 · CORE FLOWS | 4 | medio | sí |
| 7 · PERMISSIONS/STATES | 3 | medio | sí |
| 8 · RESPONSIVE | 1 | bajo | sí |
| 9 · VISUAL POLISH | 1 | bajo | sí |
| 10 · FINAL QA | 2 | bajo | n/a |
| **Total** | **~25** | | |

## Las 3 slices de mayor riesgo

1. **SLICE 3 (MOCK STATE).** Rediseñar el modelo toca todos los readers. Mitigación: los 13 lifecycles están correctos y se copian literalmente; los commands se escriben uno a uno con test; el store viejo queda en el repo hasta que todo pase.
2. **SLICE 5.C (Guardian).** §6 es ambiguo sobre qué PII ve el guardian del menor. Si D-3 no lo aclara, **no implementar** — registrar el gap y seguir.
3. **SLICE 2 (dependencia de D-1).** Si D-1 = (a) migración a CSS Modules, todo el plan se reescribe y el esfuerzo se multiplica.

---

# LO QUE NO SE DEBE HACER

| No hacer | Por qué |
|---|---|
| Mover o borrar `src/styles/theme.css` | KEEP-01. Es la pieza de mayor calidad. |
| Reescribir `src/shared/ui.tsx` desde cero | Los 17 primitives funcionan y tienen el `Modal` con focus trap. |
| Cambiar el breakpoint set | La gramática responsive actual es correcta y consistente. |
| "Mejorar" la arquitectura de autoridad con más booleanos | §40 exige `allowedActions`. Más booleanos empeora. |
| Añadir features que el Freeze no declara | §81: *"Figma may not define new product scope"*. |
| Corregir la app sin decidir D-1…D-4 | Se pierde trabajo si D-1 resulta (a). |
| Dividir los god files antes de SLICE 10 | Sin tests, dividir sólo distribuye el riesgo. |
| Tocar `event.revision` en un rename de estructura | §11 — un cambio material requiere preview + revisión + notificación. **Excepto D-2 = (b).** |
| Dejar el copy diciendo "se conserva" sin que se conserve | Era uno de los P0 (§47 `no fake success`). |
| Introducir `Category`, OAuth, forgot-password, pagos, inventario, médico, booking, scouting u offline-sync | §3 OUT. |
| Empezar por los P4 | La base visual es lo mejor que hay. Pulido al final. |

---

**Fin del plan. Nada de lo que está en este documento fue ejecutado.**





