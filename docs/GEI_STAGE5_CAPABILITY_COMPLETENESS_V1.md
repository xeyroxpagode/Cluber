# GEI HOCKEY MANAGEMENT SYSTEM
## STAGE 5 — CAPABILITY / PRODUCT COMPLETENESS V1 (C01–C16 + PROFILE_MAP)

**Estado:** AUDITORÍA. AUDIT-ONLY. Ningún archivo de `src/**` modificado.
**Baseline:** `8f30cda91bb531539864ed9175ab256598b17e88` · rama `gei/stage5-ux-audit`.
**Autoridad:** `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` §7 (capabilities), §8 (ownership), §9 (lifecycles), §6 (PII), §17 (People), §20 (Guardian), §22 (Notifications), §25 (modelo físico).
**Maestro:** `docs/GEI_STAGE5_PERCEPTUAL_INTERACTION_AUDIT_V1.md` · **Flujos:** `docs/GEI_STAGE5_FLOW_COMPLETENESS_V1.md` · **Matriz:** `docs/GEI_STAGE5_SCREEN_AUDIT_MATRIX_V1.md`.

---

# 0. CLASIFICACIÓN DE GAP (aplicada a todo el documento)

| Tipo | Definición |
|---|---|
| **TYPE A — UI MISSING EXISTING CAPABILITY** | Product Truth ya define la capacidad; el frontend no la expone (o la expone mal). Se cierra sin tocar Product Truth. |
| **TYPE B — FLOW INCOMPLETE** | Las piezas existen pero no forman camino completo (falta un eslabón: entry, propagation, history, recovery). |
| **TYPE C — PRODUCT GAP** | Para completar una tarea real, Product Truth necesita aclaración o capability nueva. Requiere decisión de producto. |
| **TYPE D — PRESENTATION GAP** | Todo lo funcional existe; la jerarquía, el color o la interacción hacen que sea difícil entenderlo o creerlo. |

---

# 1. REPLAY C01–C16

Las 10 preguntas obligatorias por capability:
**1** ¿Existe superficie? · **2** ¿Entry point discoverable? · **3** ¿Ejecutable completa? · **4** ¿Estados? · **5** ¿Errores/recovery? · **6** ¿Variantes de rol? · **7** ¿History? · **8** ¿Propaga state? · **9** ¿Mobile? · **10** ¿Jerarquía visual adecuada?

| Capability | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | STATUS | Tipo dominante |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|---|
| **C01** Identity & Access | Sí | Sí | **No** | **No** | Parcial | Sí | **No** | Sí | Sí | **No** | **PARTIAL** | A + B |
| **C02** Club Structure | Sí | Sí | **No** | Parcial | Parcial | Sí | **No** | Parcial | Sí | **No** | **PARTIAL** | B + A |
| **C03** People & Assignments | Sí | Sí | **No** | Sí | Sí | Sí | **No** | Sí | Sí | **No** | **PARTIAL** | A |
| **C04** Authority & Scope | — | — | **No** | — | — | **No** | — | — | — | — | **CONTRADICTORY** | A |
| **C05** Competition Context | Sí | **No** | **No** | Sí | Parcial | Sí | **No** | Sí | Sí | **No** | **PARTIAL** | A + C |
| **C06** Eligibility | Parcial | **No** | **No** | **No** | Sí | **No** | **No** | Parcial | Sí | **No** | **MISSING** | A |
| **C07** Event Operations | Sí | Sí | **No** | Parcial | Sí | Sí | Parcial | Sí | Sí | **No** | **PARTIAL** | A + B |
| **C08** Match Day / Jornada | Sí | **No** | **No** | **No** | **No** | Sí | **No** | Sí | Sí | **No** | **PARTIAL** | B |
| **C09** Participation Lifecycle | Sí | Sí | Parcial | Sí | Parcial | **No** | **No** | Sí | Sí | **No** | **PARTIAL** | A + B |
| **C10** Change Management | Sí | Sí | **No** | **No** | **No** | Sí | **No** | Parcial | Sí | **No** | **PARTIAL** | A + B |
| **C11** Logistics | Sí | Sí | Sí | Parcial | **No** | Sí | **No** | Sí | Sí | **No** | **PARTIAL** | D + A |
| **C12** Communication & Notification | Sí | Sí | **No** | Parcial | **No** | Sí | Parcial | Parcial | **No** | **No** | **PARTIAL** | A + C |
| **C13** Match Record & Performance | Sí | Sí | **No** | Sí | **No** | Sí | **No** | Sí | Sí | **No** | **PARTIAL** | B + A |
| **C14** History / Audit / Provenance | Parcial | Sí | **No** | **No** | **No** | Parcial | **No** | **No** | Sí | **No** | **MISSING** | A |
| **C15** Search & Reporting | Sí | **No** | Parcial | **No** | **No** | Parcial | — | **No** | Sí | **No** | **PARTIAL** | B + D |
| **C16** Operational Awareness | Sí | Sí | **No** | **No** | **No** | **No** | **No** | Parcial | Sí | **No** | **PARTIAL** | A + B |

| Resultado | Count | Capabilities |
|---|---|---|
| **COMPLETE** | **0** | — |
| **PARTIAL** | **13** | C01, C02, C03, C05, C07, C08, C09, C10, C11, C12, C13, C15, C16 |
| **MISSING** | **2** | C06, C14 |
| **CONTRADICTORY** | **1** | C04 |

> **Sobre el "OK" del Stage 4 Freeze Candidate seccion 11.** El Freeze Candidate declara 14 de 16 capacidades como "OK". Esta auditoria,

---

# 2. DETALLE POR CAPABILITY

## C01 — IDENTITY & ACCESS → **PARTIAL** · TYPE A + B

| Pregunta | Respuesta | Evidencia |
|---|---|---|
| Superficie | `/login` `/activate` `/no-access` `/more/profile` `/management/people` `/management/people/new` `/management/people/:id` | `App.tsx:48-50,78,80-83` |
| Entry point | ✓ avatar en header, `/more`, y `/no-access` | `Shell.tsx:220-222` |
| Completa | **No.** El camino activation está roto (F01) y el de recuperación de perfil incompleto no existe | ver abajo |
| Estados | `PENDING/ACTIVE/DISABLED` existen en el modelo y en `/management/people`, **no en `/more/profile`** | `model.ts:24` |
| Errores | login y activate honestos ✓; **`changePassword` valida 12–128 y NO muta si falla** ✓ (P0-4 correcto) | `store.tsx:242-259` |
| Rol | ADMIN manages; el resto sólo self ✓ §5 | verificado en 5 roles |
| History | audit ✓ pero invisible fuera de `/audit` | — |
| Propaga | ✓ `account` → `hasAccess` → shell | verificado |
| Mobile | `s` sin riesgo | — |
| Jerarquía | **Insuficiente**: `/more/profile` sin acción primaria, 4 datos en 768 px | RUNTIME R-07 |

**Gaps TYPE A:** (1) estado de cuenta ausente en Perfil; (2) "Generar código de activación" sin efecto (F01); (3) username no rotable; (4) `Deshabilitar → Reactivar` sin código; (5) 5 intentos fallidos (§51) ausentes.
**Gap TYPE C:** recuperación de `PLAYER_PROFILE_INCOMPLETE` (PG-06) — requiere decisión sobre §6.

## C02 — CLUB STRUCTURE → **PARTIAL** · TYPE B + A

Superficie ✓ (`/management/structure` 4 tabs + `/management/teams/:id`). Lo que **sí** funciona bien y es de las pocas cosas solidly correctas del producto: los fences de dependencia con razón visible ("Tiene dependencias activas. No se puede archivar."), y la **separación A/B de §11 v1.0.1** en Venue (`renameVenueMetadata` no propaga / `changeEventVenue` sí propaga + `revision++` + notify) verificada por tests.
**Gaps:** sin restore (irreversible); Temporada con estado "Activo" inexistente en §19; no existe creación de Team pero el error la instruye; Venue por nombre en vez de `venueId`; `address`/`field_label` no editables; Entry LINE no bloquea archivar Línea.

## C03 — PEOPLE & ASSIGNMENTS → **PARTIAL** · TYPE A

Lo que funciona: Assign/Move/End atómicos con la regla de CAPTAIN no transferible ✓, y un helper de copy que la explica. Lo que falta: **`memberships[]` sin superficie** (0 escrituras, 0 lecturas); **`guardianRelationships[]` sin superficie** (0 referencias); `Person.team`/`Person.role` como selectores (S4-04); identidad read-only para todos.

## C04 — AUTHORITY & SCOPE → **CONTRADICTORY** · TYPE A

Esta capability no tiene superficie: es transversal. Y su implementación contradice su propia declaración.

| Declarado | Real |
|---|---|
| `authority.ts:5-8` "La UI consume allowedActions; no reimplementa `role === 'ADMIN'`" | `getAllowedActions` se usa en **1 de 16 flags** (sólo `canViewEligibilityDetail` en `events.tsx:116`) |
| Flags de PII por campo (`canViewDni`, `canViewContact`, `canViewAudit`) | **0 consumidores** en todo `src/` |
| `capabilities.sport/management/official/availability` | Reimplementan la autorización en las 6 features; `capabilities.sport` **no participa del filtro de alcance** |
| `capabilities.chat` = PLAYER/CAPTAIN/COACH | ✓ correcto, verificado |
| `canPublishAnnouncement` (§5: sólo SUBCOMMITTEE) | La UI usa `capabilities.official` (= SUBCOMMITTEE) ⇒ equivalente pero duplicado |
| Route gating | **No existe**: `/management/*` y `/audit` responden a cualquier actor con `hasAccess`; el bloqueo es in-page |

**Consecuencia verificada:** el filtro de eventos de `/home` y `/calendar` usa `actor.team` (`overview.tsx:61,445`) en vez del scope de `RoleAssignment` ⇒ **un entrenador con scope sobre 2 equipos sólo ve los eventos del primero**. Y la lista de personas de ADMIN muestra a la guardiana como "Jugadora / Club" porque lee `person.role`.

**Diagnostico:** el *comportamiento* de gating es mayormente correcto y la seccion 5 se respeta en lo verificado; lo que falla es la **declaracion de diseño** (una capa de autoridad que no existe) y tres casos insignia donde el selector legacy produce comportamiento incorrecto. Por eso es CONTRADICTORY y no PARTIAL.

## C05 — COMPETITION CONTEXT → **PARTIAL** · TYPE A + C

Lo que funciona: lista, detalle, `ExternalReference` manual, gate de cierre con razón ✓, modal de consecuencias al finalizar inscripción ✓, gating de lectura para COACH ✓ (§5 "lectura") y escritura para SUBCOMMITTEE ✓.
Lo que falla: **`CompetitionEntry.team` fusiona LINE y TEAM** (S4-03, confirmado en runtime: "Línea A · 2026" con 4 divisiones en el dataset); sin `422 COMPETITION_SCOPE_MISMATCH`; candidatos LINE sin división ni temporada; `competition` comparado por nombre entre un id y un nombre; `/more` no da entrada a ADMIN.

## C06 — ELIGIBILITY → **MISSING** · TYPE A

Es la capability con menor superficie real de las 16.

| Lo que existe | Lo que falta |
|---|---|
| `deriveEligibility()` con `BLOCKED` dominando ✓ y `ELIGIBLE` derivado ✓ | **Superficie de lectura de constraints**: `source`, `reason`, `note`, `validFrom`, `validUntil` — 0 lecturas de `state.eligibilityConstraints` en cualquier feature |
| Mutación que escribe `EligibilityConstraint[]` canónico ✓ | `scope` seleccionable (fijo `CLUB`): 3 de 4 scopes inalcanzables |
| Estado derivado visible en Team roster (badge) ✓ | `source` seleccionable (fijo `INTERNAL`): 2 de 3 inalcanzables |
| Estado derivado visible en Selection (badge + motivo en lenguaje usuario ✓ — **el mejor copy de todo el producto**) | `reason` seleccionable (fijo `ADMIN`): 4 de 5 inalcanzables |
| Gating de detalle al jugador ✓ (P0-5 verificado en runtime: jugadora NO ve badges, entrenador sí) | Vigencia: `validFrom` = hoy, `validUntil` = null, sin UI |
| — | **SUBCOMMITTEE no tiene acceso** a la única superficie de mutación, pese a que §5 le concede `Eligibility mutation ✓` y §6 le concede `reason/source` |

Consecuencia: una PENDING/BLOCKED se puede **crear** pero no se puede **explicar, fechar ni auditar**. El modelo de §13 ("Cada constraint lleva… scope, scopeRefId, source, reason, validFrom, validUntil") está a 25 % expuesto.

## C07 — EVENT OPERATIONS → **PARTIAL** · TYPE A + B

Lo que funciona: create/edit con validación que preserva input, Impact Preview antes de confirmar, lifecycle de 8 de 9 transiciones, logística completa (§11), venues con identidad estable (§19 v1.0.1), Real Clock (§15.1).
Lo que falla: **`ScopeDialog` sin efecto** (S4-01, el hallazgo P0 de esta auditoría); `ABANDONED` inalcanzable; transiciones a `IN_PROGRESS` sin modal; `RESTORE` y `RESCHEDULE` indistinguibles; **no hay campo Título en edición** ⇒ la rama non-material de §11 es inalcanzable; temporada implícita en create; `EVENT_TARGET_INVALID` ausente.

## C08 — MATCH DAY / JORNADA → **PARTIAL** · TYPE B

Lo que funciona: crear jornada, assignar partidos, bulk **atómico** (una sola mutación), impacto por hijo, gating de rol correcto (§5: Match = Team para COACH, Club para SUBCOMMITTEE, ninguno para ADMIN ✓).
Lo que falta: add/remove de hijos; bulk de fecha/hora/estado; `expectedVersion`; `Bulk ≤ 100` (§16); `Match Team.season == Jornada.season`; `CompetitionEntry` scope TEAM/LINE; el `count={19}` hardcodeado; `pending` sin `finally`; gate de `mutable` inconsistente con el resto del producto (permite `IN_PROGRESS`).

## C09 — PARTICIPATION LIFECYCLE → **PARTIAL** · TYPE A + B

Es la capability con **mas superficie** (4 rutas) y tambien con mas logica correcta: `UNRECORDED` nunca se convierte en `ABSENT` (verificado en las 3 apariciones), Draft distinto de Publicado con copy explicito, autosave con 4 de 5 estados de la seccion 45, correccion con before/after.
Lo que falta: estado `CONFLICT` del autosave; `hasCurrentConflicts` como campo (§14, para que Home lo consuma); guardian sin responder por menor; `RECONFIRM` fuera del enum; `justification reason` en Attendance (no existe en el modelo); botones de 36 px; historial invisible.

## C10 — CHANGE MANAGEMENT → **PARTIAL** · TYPE A + B

Existe el *concepto* completo (ScopeDialog → Impact Preview → confirmación → `expectedVersion` real en la rama material) pero **el contenido es fabricado y la recuperación destructiva**. Detalle en F08. Clasificación: TYPE A (hay que arreglar el Conflict Workspace, la granularidad y los conteos) + TYPE C (PG-01: el comando de apply-to-occurrences no existe en §32).

## C11 — LOGISTICS → **PARTIAL** · TYPE D + A

Los 5 campos de §11 (`meetingAt`, `departureAt`, `meetingPoint`, `transportNote`, `arrivalInstructions`) existen, se muestran y se editan ✓. Es la capability con mejor cobertura funcional.
Lo que falla: `Hora de salida: "No aplica"` — copy de negación en lugar de "—" u ocultamiento; `Venue.address` y `fieldLabel` no editables desde Structure (§19 los define); granularidad de reconfirmación (cambiar `arrival` invalida confirmaciones de horario); el bulk de jornada produce "El horario cambió" cuando cambió la sede.
**Predomina TYPE D:** la información está, se entiende, pero no tiene peso visual ni está conectada con su consecuencia.

## C12 — COMMUNICATION & NOTIFICATION → **PARTIAL** · TYPE A + C

Superficie: 7 rutas, la mayor del producto. Lo que funciona: par DIRECT canónico detectado (FDPG-04 ✓), tombstones ✓, `EDITED` marcado ✓, audiencia inmutable en UI **y** en mutación ✓, gating deADMIN/SUBCOMMITTEE fuera de los chats privados verificado 3 veces ✓, tab oculto al guardian ✓.
Lo que falla (§24 de §20 y §22): **la audiencia no es control de acceso** (TYPE A grave); **no es TEAM_SET** y no hay snapshot (TYPE C); **publicar notifica a todos**; **no hay "Entendido"** ni `readBy`; `type` §22 nunca se renderizado; lista sin ordenar (S4-05); sin sheet de miembros; sin `Conversation.state` ⇒ sin archivar (TYPE C menor).

## C13 — MATCH RECORD & PERFORMANCE → **PARTIAL** · TYPE B + A

Lo que funciona: `DRAFT → FINAL` con bloqueo real de edición ✓, corrección explícita con motivo ✓, `recordHistory` con before/after ✓, `PlayerMatchStats` sólo para `PLAYED` ✓, y el copy "La participación real se obtiene del registro del partido, no de la asistencia" ✓ (§15 correcto).
Lo que falla: **editable con evento `SCHEDULED`**, contradiciendo su propio texto y §12; `status = ABANDONED` sin lifecycle; `recordHistory` invisible; sin validación de coherencia `played ↔ goals`; sin señal de que el resultado ya impactó el informe.

## C14 — HISTORY / AUDIT / PROVENANCE → **MISSING** · TYPE A

**Es el hallazgo de confianza más grave de la auditoría.** El dato existe y está bien modelado; la superficie no existe.

| Lo que §71 exige | Estado |
|---|---|
| "History: ¿qué necesita comprender el usuario?" | **Ausente.** `attendanceHistory` (`:272-282`) y `recordHistory` (`:304-313`) se escriben con `before`/`after`/`actor`/`date`/`reason` y **no se renderizan en ninguna parte de `src/`** |
| "Audit: ¿quién modificó qué?" | Parcial: 2 pantallas lo leen (`/audit`, y `event.history` como texto libre). `AuditEntry` **no tiene before/after, ni source, ni referencia navegable** |
| "Technical log" | N/A en frontend |
| Fuentes de History (§71): Events+Audit, Attendance+Audit corrections, MatchRecord/Stats, SelectionRevision, Announcement, Message, Audit | De 7 fuentes, **4 no tienen superficie** (Attendance corrections, MatchRecord, SelectionRevision, Announcement) |

El Stage 4 Implementation Report §8 declara **P0-2 y P0-3 CLOSED** con evidencia "attendanceHistory con before/after/actor/reason" y "recordHistory con before `3-1` → after `GEI 4-1 (FINAL)`". **La evidencia es real pero es de modelo, no de superficie**: el usuario no puede ver nada. Esto es exactamente el caso que el §1 del encargo describe ("no asumir que un test o informe demuestra el comportamiento runtime") y por eso la evidencia manual/runtime prevalece: **el histórico es invisible**.

## C15 — SEARCH & REPORTING → **PARTIAL** · TYPE B + D

Lo que funciona: atajo ⌘K ✓, defaults de filtro correctos (A9), copy excelente ("Sin registrar se mantiene separado de Ausente", "Sin registros no se interpreta como cero actividad histórica"), gating de PLAYER a sus propios registros ✓.
Lo que falla: **query y filtros fuera de la URL** (`useSearchParams` = 0) ⇒ F26/F27 no completan §5; `% PRESENCIA` con 0 % donde no hay dato, **contradiciendo su propio pie**; sin links al origen (A9); sin empty real; 6 de 6 tablas sin `<th>`; períodos literales.

## C16 — OPERATIONAL AWARDS AWARENESS → **PARTIAL** · TYPE A + B

Lo que funciona: Home con "Necesita tu atención" + "Nada pendiente." explícito (§24 `empty != zero != error`), skeleton global, avisos con deep link canónico.
Lo que falta: Home **sin ordenar por urgencia**; items no accionables por el rol; "Hoy" vacio; **Home de ADMIN vacio** (0 acciones); `needsReconfirmation` **solo detecta stale, nunca "no respondio"** => una jugadora que nunca respondio no aparece nunca; `?scenario=degraded|stale|impact-changed` sin senal visible de degraded mas alla del banner global; `type` de notificacion sin renderizar.

---

# 3. PROFILE_COMPLETENESS_MAP (§11 — DEEP DIVE OBLIGATORIO)

## 3.1 Qué significa "Mi perfil" en GEI, derivado de Product Truth

Sources: §5 (Authority Matrix), §6 (PII Field Authority), §9 (lifecycle Account), §17 (People semantics), §20 (Guardian experience), §36 (Auth API family), §44, §48, §49, §51, §52, §53.

El conjunto que Product Truth **sí** soporta para una pantalla llamada "Mi perfil":

| Grupo | Elementos | Fuente |
|---|---|---|
| **A. Identidad** | nombre, usuario, avatar | §26 `persons`, `accounts`; §6 "username: self + ADMIN" |
| **B. Contacto** | teléfono, email — **editables** | §5 "editar propio contacto/password ✓" |
| **C. Pertenencia** | `Membership` (período interno), `TeamAssignment` (período deportivo) | §17, ambos temporales `[valid_from, valid_until)` |
| **D. Autoridad** | `RoleAssignment[]` con role + scope (CLUB/TEAM/EVENT) + target + vigencia; "multi-role = unión de assignments vigentes" | §5, §26 |
| **E. Estado de cuenta** | `Account.status` PENDING/ACTIVE/DISABLED, `activated_at`, `disabled_at`, `credentialVersion` | §9, §26 |
| **F. Seguridad** | cambio de contraseña; reautenticación; sesiones; actividad | §5, §36 (`activity`, `reauthenticate`), §48, §49, §51, §52 |
| **G. Delegaciones** | `GuardianRelationship[]` — "relationship management/consultation lives inside More → Mi perfil, in a **'Personas a cargo'** section" | §20 v1.0.1 (explícito) |
| **H. Historial** | lo que §71 define History para este usuario | §71 |

**Lo que Product Truth NO soporta ⇒ no es requerimiento:** preferencias de notificación (no hay tabla en §25; §22 no las define; FDPG-03 **DEFERRED**), "mi línea de actividad personal" (§71 define History como proyecciones de dominio, no línea personal; §36 expone `activity` sólo para idle-timeout). Ambos quedan como **PDC-01** y **PDC-05**.

## 3.2 CURRENT — lo que `/more/profile` renderiza (evidencia RUNTIME R-07)

```
Mi perfil
  Tus datos de contacto y tu acceso a GEI Hockey.
┌───────────────────────────────────────────┐
│ (TB)  Tomás Beltrán                        │
│       Entrenador · Sexta A 2026            │
│  ─────────────────────────────────────     │
│  Usuario          Email                    │
│  tomas.beltran    tomas.beltran@gei.com.ar│
│  Teléfono         Contexto                 │
│  11 6042 1870     Pertenencia vigente·2026│
│                                           │
│  [Editar contacto] [Cambiar contraseña]   │
└───────────────────────────────────────────┘
(para guardian: + sección "Personas a cargo", read-only)
```

**4 datos · 2 acciones · 0 secciones · 0 estado de cuenta · 0 roles · 0 período · 0 seguridad más allá del diálogo de contraseña.**

## 3.3 El mapa

| # | Elemento | EXPECTED | CURRENT | GAP | SOURCE | RECOMMENDATION |
|---|---|---|---|---|---|---|
| A1 | Nombre | Sí, visible | ✓ `h2` con nombre | — | §26 `persons` | **KEEP** |
| A2 | Usuario | Sí, visible (self) | ✓ `dt`/ valor | — | §6 | **KEEP** |
| A3 | Avatar | Opcional, iniciales | ✓ `Avatar size="lg"` | — | Blueprint §8 | **KEEP** |
| A4 | DNI | **No** (§6 = ADMIN) | ✓ ausente | — | §6 | **KEEP** (correcto no mostrarlo) |
| A5 | Fecha de nacimiento | **No** (§6 = ADMIN) | ✓ ausente | — | §6 | **KEEP** |
| B1 | Email | Sí, editable | ✓ visible + editable | Sin validación de formato; se muestra y se edita en el mismo `dl` sin indicar cuál | §5 | **TUNE** |
| B2 | Teléfono | Sí, editable | ✓ visible + editable | idem | §5 | **TUNE** |
| C1 | Membership con período | Sí (`valid_from`/`valid_until`) | **Ausente** | **TYPE A** | §17 | **ADD** |
| C2 | TeamAssignment con período | Sí | Sólo `actor.team` + "2026" literal | **TYPE A** + dato falso | §17, §26 | **ADD** |
| D1 | RoleAssignment[] + scope + target | Sí | **Ausente** — 1 rol legacy (`labels[actor.role]`) | **TYPE A** + verdad incompleta (multi-role invisible) | §5 | **ADD** |
| D2 | Alcance (CLUB/TEAM/EVENT) | Sí | **Ausente** | **TYPE A** | §5 | **ADD** |
| D3 | Explicación de "Administración no incluye autoridad deportiva" | Sí (es el copiado más valioso del producto, y está en `/management/people/:id`, no en el perfil del usuario) | **Ausente** | **TYPE D** | §5 | **ADD** (reutilizar el texto existente) |
| E1 | Estado de cuenta (PENDING/ACTIVE/DISABLED) | Sí | **Ausente** | **TYPE A** | §9, §26 | **ADD** |
| E2 | `credentialVersion` / "¿contrasena establecida?" | Si, como estado | **Ausente** | **TYPE A** | seccion 26, seccion 51 | **ADD** |
| E3 | Fecha de activación | Sí | **Ausente** | **TYPE A** | §26 | **ADD** |
| F1 | Cambio de contraseña | Sí | ✓ modal con validación 12–128 real | Sin indicador de "Guardando" por campo; sin "Volver" que confirme si hay cambios | §5, §48 | **TUNE** |
| F2 | Sesiones activas / cerrar en otros dispositivos | Sí, la capacidad existe | **Ausente** | **TYPE A** | §36, §49, §54 | **ADD** (PG-05) |
| F3 | Última actividad | Sí, la capacidad existe | **Ausente** | **TYPE A** | §36 `activity` | **ADD** (PG-05) |
| F4 | Reautenticación reciente (step-up) | Sí, como estado | **Ausente** | **TYPE A** | §52 | **ADD** (L4, ADMIN-like) |
| G1 | Sección "Personas a cargo" | **Explícita en §20** | ✓ existe **sólo si el actor es guardián** | Parcial | §20 | **TUNE** |
| G2 | Permisos por relación (`can_view_child_info`, `can_respond_availability`) | Sí, ambos | Sólo se muestra `canRespondAvailability` y **sólo cuando es `true`** | **TYPE A** | §26, §20 | **ADD** |
| G3 | Revocar / modificar una delegación | Sí (gestión) | **Ausente** | **TYPE A** + **TYPE C** (no hay command) | §20 | **ADD** (PG-03) |
| G4 | Delegación **recibida** ("quién actúa sobre mi cuenta") | No está en §20 explícitamente | **Ausente** | **TYPE C** menor | §6, §20 | **PDC** → proponer a producto (PDC-02/05 borderline) |
| H1 | Historial personal | §71 no define una línea personal | **Ausente** | No es requerimiento | §71 | **PDC-05** |
| H2 | Preferencias de notificación | No existe tabla | **Ausente** | No es requerimiento | §25, §22 | **PDC-01** (FDPG-03 DEFERRED) |
| H3 | Cerrar sesión | Sí, como acción | En `/more`, no en el perfil | **TYPE D** | §48 | **TUNE** (enlace en Security) |
| H4 | Perfil de jugadora incompleto + camino a completarlo | Sí (el 422 existe) | **Ausente, y el camino no existe para nadie** | **TYPE B + TYPE C** | §17 | **ADD** indicador + **PG-06** (decisión de producto sobre §6) |

## 3.4 Veredicto de completitud de Perfil

| Dimensión | Estado |
|---|---|
| **A. INFORMACIÓN QUE DEBE VER** | 3 de 7 (nombre, usuario, avatar). **Faltan Membership, TeamAssignment con período, RoleAssignment+scope, estado de cuenta.** |
| **B. INFORMACIÓN QUE PUEDE EDITAR** | 2 de 2 ✓ (**correcto y completo** — §5 concede exactamente contacto + password) |
| **C. INFORMACIÓN QUE PUEDE CONSULTAR PERO NO CAMBIAR** | 0 de 4 (rol/alcance, elegibilidad propia, pertenencia, estado de credencial) |
| **D. INFORMACIÓN QUE NO DEBE VER** | ✓ **correcto**: no muestra DNI ni fecha de nacimiento (§6) |
| **E. CONFIGURACIÓN** | 0 (no hay preferencias en Product Truth ⇒ correcto no inventarlas) |
| **F. SECURITY** | 1 de 4 (cambio de contraseña ✓; faltan sesiones, actividad, step-up) |
| **G. DELEGATIONS / PERSONAS A CARGO** | 1 de 3, y sólo en una dirección y sólo lectura |
| **H. HISTORY/ACTIVITY** | No soportado por Product Truth ⇒ **no es gap** |

**COMPLETITUD GLOBAL DE PERFIL: PARTIAL — y el usuario tiene razón en que "se siente incompleto".**

**Diagnostico en una frase:** la pantalla es exactamente un formulario de contacto mas un dialogo de contrasena, que es justamente lo que la seccion 5 concede como *editable*, y nada de lo que Product Truth obliga a *mostrar*. **El mapa de editable esta completo y el mapa de "debe ver" esta en 43 por ciento.** No es un problema de diseno: es un problema de scope de Stage 4, que construyo el camino de escritura y no el de lectura.

**Costo de cierre:** S/M. Todo lo que falta es **derivado de datos que ya están en el modelo mock** (`memberships[]`, `teamAssignments[]`, `roleAssignments[]`, `account.status`, `credentialVersion`) salvo F2/F3 (sesiones/actividad), que requieren backend que **§36 ya define**.

---

# 4. OTRAS SUPERFICIES CONCEPTUALMENTE INCOMPLETAS

Detectadas durante el replay, no estaban en el encargo pero son del mismo tipo:

| Superficie | Incompletitud conceptual | Tipo | Fuente |
|---|---|---|---|
| `/people/:personId` (§4.3) | Una "persona" en GEI es identidad + contacto + **pertenencia + roles + elegibilidad + historial de asistencia** (§17, §26). La ficha muestra 5 datos y ninguna acción. C09 la lista como capaz de "equipo/asistencia" y no hay ninguna de las dos. | **A + D** | §4, §12 |
| `/announcements/:id` (§4.3) | Un comunicado oficial en un club con §22 (avisos) y §21 (audiencia por equipos) implica **acuse**. No hay `readBy` ⇒ la capability de "saber quién leyó" es irrepresentable. | **A + C** | §21, §22 |
| `/conversations/:id` (§4.3) | Una conversación TEAM/EVENT implica **contexto persistente y participantes sincronizados** (§20). Hoy el título es un string de seed y los participantes no se gestionan. | **A** | §20 |
| `/notifications` (§4.3) | Con 7 tipos §22, un aviso que no nombra su tipo **no cumple su función**: no hay forma de saber si hay que re-confirmar disponibilidad o si es informational. | **A** | §22 |
| `/teams` (§4.3) | "Mis equipos" (Blueprint R09) con 1 fila y sin marca de "mío". La colección vs. la pertenencia no se distinguen. | **D** | Blueprint §11 |
| `/jornadas/:id` (§4.3) | Una jornada "agrupa Matches de una misma jornada operativa" (§4) y **no duplica el lifecycle de los Matches**; la pantalla no explica esa relación ni la protege. | **D** | §4, §16 |

---

# 5. RESUMEN DE PRODUCT COMPLETENESS

| Tipo | Count | IDs |
|---|---|---|
| **TYPE A** — UI falta de capacidad existente | **17** | C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14, C15, C16 + Announcement-ack |
| **TYPE B** — flow incomplete | **11** | F02, F04, F06, F08, F11, F12, F13, F14, F15, F16, F19, F21, F23, F25, F26, F27, F30 |
| **TYPE C** — product gap (requiere decisión) | **7** | PG-01 … PG-07 |
| **TYPE D** — presentation gap | **9** | UX-01, UX-02, UX-03, UX-04, UX-05, UX-06, UX-07, UX-08, UX-37, UX-43, UX-45 |

**Lectura transversal:** el producto esta **sobredimensionado en escrituras y subdimensionado en lecturas**. El frontend de Stage 4 construyo 24 comandos con audit, before/after y validacion de la seccion 73 - y casi ninguna superficie de lectura de lo que esas escrituras producen. Esa es la raiz comun de C14 MISSING, de las 15 pantallas PARTIAL y del reclamo "Perfil se siente incompleto".

---

# 6. CAPACIDADES QUE EL PRODUCTO SOPORTA Y SIGUEN SIN SER REFLECTADAS

Lista de control para el Slice A del plan (decisiones de producto/flow):

| # | Pregunta | Estado |
|---|---|---|
| 1 | ¿Hay una capability sin superficie? | **Sí**: C06 (elegibilidad, sin lectura) y C14 (history, sin superficie). |
| 2 | ¿Hay una surface sin capability? | **No** en el sentido del Blueprint §12 (los hubs R27/R35 son navegación legítima). Pero hay **3 superficies que simulan**: `checkAvailability` de §40 nunca se implementó (la app no tiene velocidad de polling), `/teams` desde `/management` (superficie deportiva en hub admin). |
| 3 | ¿Hay actions sin command conceptual? | **Sí**: nudge (FDPG-02), mute/mentions (FDPG-03), `ApplyEventChange` (PG-01), `CreateGuardianRelationship`/`EndGuardianRelationship` (PG-03), `IssueSetupToken` real (F01), `ReadAnnouncement`/acuse (F24), `ListEligibilityConstraints` (C06), `SessionActivity` (PG-05). Todas registradas, ninguna implementada. |
| 4 | ¿Hay un endpoint sin consumidor? | **Si**, y es lo bueno: la seccion 36 define `activity`, `reauthenticate`, `history`, `allowedActions`, `/me.navigation`. La UI reimplementa `allowedActions` con 4 booleanos y no consume ninguno de los otros cuatro. |
| 5 | ¿Hay estado sin lifecycle? | **Sí**: `Notice.read` (booleano, sin `read_at` como §26 exige), `Announcement` sin `revision`, `Conversation` sin `state`, `StructureItem` sin estado, `Temporada` con "Activo" sin lifecycle. |
| 6 | ¿Hay tabla de §25 sin representación en el modelo mock? | **9 de 45**: `accounts.activated_at/disabled_at`, `venues.field_label`(presente) , `event_occurrence_overrides`, `competition_entries`(scope fusionado), `external_references`(como string), `notification_preferences`(no existe en §25), `outbox_events`, `command_receipts`, `audit_entries.result_data`. Las dos últimas son las que explican por qué no hay before/after en `/audit`. |

---

**SOURCE MODIFIED: NO.** Este documento no implementa, no corrige y no rediseña. Registra qué falta, de qué tipo es, y qué decisión de producto lo desbloquea.
