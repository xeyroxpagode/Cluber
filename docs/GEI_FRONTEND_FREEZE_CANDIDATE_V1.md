# GEI HOCKEY MANAGEMENT SYSTEM
## FRONTEND FREEZE CANDIDATE V1

**Estado:** CANDIDATO. **NO** es autoridad final. Entra como input de STAGE 5 STRESS TEST.
**Autoridad superior:** `docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md` (v1.0.1).
**Target blueprint:** `docs/GEI_FRONTEND_TARGET_BLUEPRINT_V1.md`.
**Implementación:** `docs/GEI_FRONTEND_IMPLEMENTATION_REPORT_V1.md`.
**Rama:** `gei/frontend-target-v1`. **Datos:** LOCAL MOCK STATE, sin backend.

Si este documento contradice el Freeze o el Blueprint, mandan ellos.

---

# 1. Information Architecture implementada

```
Inicio (/home)               ¿Qué tengo que saber o hacer ahora?
Calendario (/calendar)       ¿Qué pasa y cuándo?
Equipos (/teams, /teams/:id)  ¿Quiénes somos y qué pasa con mi equipo?
Comunicación (/communication + hijas)  ¿Qué dijeron / con quién hablo?
Más (/more, /management/*, /reports/*, /audit, /more/profile)
                              ¿Qué necesito que no es uso diario?
Utilities (misma chrome): Buscar (/search), Avisos (/notifications)
Auth (sin chrome): /login, /activate, /no-access
```

- 5 destinos idénticos en bottom nav (mobile) y sidebar (≥1024px). Sin drawer. Sin command palette.
- Profundidad máxima: tab → lista → detalle → sub-detalle.
- Guardian no tiene destino propio: habita Home/Calendario/Equipo vía delegación y `Viendo a …`, se configura en Más → Mi perfil → Personas a cargo.
- Utilities en header persistente: Buscar (⌘K/Ctrl+K) + Avisos con punto no-leído + avatar.

---

# 2. Navegación

| Regla | Implementación |
|---|---|
| Tabs siempre visibles | Sí, nunca deshabilitadas |
| Tabs internas sólo navegan | TeamDetail (Equipo/Eventos/Resultados), Communication (Conversaciones/Comunicados), Structure (Temporada/División/Línea/Sede) |
| Cross-highlight | Calendario en `/events/*` y `/jornadas/*`; Comunicación en `/conversations/*` y `/announcements/*`; Más en `/management/*`, `/reports/*`, `/audit`, `/more/*` |
| Breadcrumb | `routeContext()` con vocabulario usuario. **Eliminado "Mi espacio"** |
| Utilidades | Buscar + Avisos + avatar → Mi perfil |
| Guardian nav | `Communication` se oculta si el actor no tiene acceso de chat y no tiene delegación |

---

# 3. Archetypes

| # | Archetype | Gramática en el código |
|---|---|---|
| A1 | Operational Home | atención (≤3) → Hoy → ¿Vas? inline → Próximamente → Comunicaciones |
| A2 | Time Browser | controles de tiempo → grilla/lista → detalle → evento |
| A3 | Roster Action | cabecera + estado → acción sticky → conteo live → filas |
| A4 | Event Detail | ¿Vas?/Resultado → cuándo/dónde → rail Participación → logística → mensajes |
| A5 | Chat | contexto → mensajes → composer sticky |
| A6 | Entity Detail | identidad + estado → 1 acción → operacional → contexto → L3/L4 |
| A7 | Management List | buscador/filtros → filas mínimas → detalle |
| A8 | Admin Form/Detail | situación → acción sticky → secciones → impacto → rastro |
| A9 | Report | filtros con defaults → tabla → links al origen |
| A10 | Timeline/History | filtros → lista cronológica → origen |

---

# 4. Componentes compartidos

`src/shared/patterns.tsx`:
`PageContextHeader` · `StateBanner` · `SectionHeader` · `StatusText` · `StateBadge` · `LegacyBadge` · `MetaRow` · `StickyActionBar` · `EventSummary` · `ImpactPreview` · `ScopeDialog` · `FormSection` · `DetailSection` · `TimelineEntry`

`src/shared/vas.tsx`:
`VasInline` — gramática única de ¿Vas? (Voy / Quizás / No voy) con reconfirmación.

`src/shared/states.ts`:
`stateText()` · `stateTone()` — mapping domain → presentación, sin fallback silencioso.

`src/shared/ui.tsx` (17 primitives, preservados): `Button` `IconButton` `Avatar` `Badge` `Header` `Section` `Surface` `TextField` `Select` `TextArea` `Alert` `Empty` `Modal` `RowLink` `EventIcon` `EventRow` `TextLink` `Saved`.

---

# 5. Tokens

## Color (sin rediseño)
GEI blue `#163d85` + neutros. `background`, `foreground`, `primary`, `primary-foreground`, `primary-soft`, `card`, `muted`, `muted-foreground`, `border`, `success(+soft)`, `warning(+soft)`, `danger(+soft)`, `radius`. **17 tokens conservados tal cual.**

## Tipografía
Roles semánticos: page-context (11px/500), page-title (22px/650), section-title (15px/650), body (13px), body-strong (13px/650), meta (11px).
**Regla:** nada crítico depende de 9px. El peso/tamaño indica importancia sin necesitar cards.

## Espaciado
`--space-page` 28px · `--space-section` 24px · `--space-group` 16px · `--space-row` 12px · `--space-inline` 8px.
Relacionado cerca, cambio de concepto más lejos.

## Radios
small 6px · control 8px · surface 12px · modal 16px.

## Shadow
`--shadow-floating`, `--shadow-overlay`.

## Z-index
nav · sticky · sheet · modal · toast (declarados).

## Motion
`--motion-instant` 120ms · `--motion-micro` 160ms · `--motion-context` 220ms · `--ease-standard`.
Micro feedback: ¿Vas?, autosave, conteo live.
State transition: borrador→publicado, abierta→cerrada, borrador→final.
Context transition: modal/sheet.
**Prohibido y no usado:** bounce, fade-up en cards, scale en botones, animación decorativa.
`prefers-reduced-motion: reduce` → duraciones a 0.01ms.

---

# 6. Iconografía

- Lucide conservado.
- `Empty` acepta icono semántico por contexto (ya no `CalendarDays` universal).
- Estados siempre en texto: Voy/Quizás/No voy, Presente/Ausente/Justificada/Sin registrar, Borrador/Publicado, Abierta/Cerrada, Final. El color acompaña, nunca sustituye.
- Avatar = iniciales, funcional.

---

# 7. Responsive

| Ancho | Navegación | Layout |
|---|---|---|
| <1024px | bottom nav | feed vertical; tablas→filas; action sticky; composer sticky; sheets casi full-screen; selectores en sheet |
| ≥1024px | sidebar 224px | columna central + panel lateral opcional (`xl:grid-cols-[1fr_300px]`) |
| Calendar | — | agenda por defecto; mes en desktop |
| Verificado | 390 / 768 / 1440 | sin overflow horizontal introducido |

---

# 8. Estados (vocabulario unificado)

| Dominio | UI |
|---|---|
| DRAFT | Borrador |
| SCHEDULED | Programado |
| POSTPONED | Postergado |
| CANCELLED | Cancelado |
| IN_PROGRESS | En curso |
| COMPLETED | Finalizado |
| ABANDONED | Suspendido |
| PUBLISHED | Publicado |
| ARCHIVED | Archivado |
| PENDING | Pendiente |
| OPEN | Abierta |
| CLOSED | Cerrada |
| ENDED | Finalizada |
| FINAL | Final |
| ELIGIBLE | Habilitada |
| BLOCKED | No habilitada |
| YES | Voy |
| MAYBE | Quizás |
| NO | No voy |
| NO_RESPONSE | Sin respuesta |
| NEEDS_RECONFIRMATION | Necesita confirmación |
| PRESENT | Presente |
| ABSENT | Ausente |
| JUSTIFIED | Justificada |
| UNRECORDED | Sin registrar |

**Enum nunca expuesto.** Estado desconocido → "Estado a revisar" + warning DEV (fail visualmente seguro).

---

# 9. Modelo mock canónico

| Concepto | Implementación Stage 4 |
|---|---|
| **Membership** | `memberships[]` con `[valid_from, valid_until)`. `MovePlayerTeam`/`EndPlayerTeam` actualizan assignment + roles |
| **Guardian** | `guardianRelationships[]` con `can_view_child_info` / `can_respond_availability`. Sin rol GUARDIAN. Actor `guardian` sin Membership deportivo; `hasAccess` por delegación |
| **Eligibility** | `eligibilityConstraints[]` (state, scope, scopeRefId, source, reason, note, validFrom, validUntil). `ELIGIBLE` derivado. UI: Player no ve detalle; Coach ve status; SUBCOMMITTEE/ADMIN ven reason |
| **Event targets** | `targetTeams[]` + `targetPersonIds[]`. Texto usuario: `Sexta A`, `Sexta A + 2 personas`, `Todo hockey` |
| **EventSeries** | `eventSeries[]` + `seriesId` por evento. `ScopeDialog` con 3 alcances en vocabulario usuario. Bulk de ocurrencias **no** implementado |
| **Venue** | `venues[]` con id estable, name, address, fieldLabel. Rename de metadata **no** propaga; cambio de sede asignada **sí** es material |
| **Notifications** | `NotificationType` real (§22). Sin tipo reminder |
| **Historial** | `attendanceHistory[]` (before/after/actor/reason), `recordHistory[]`, `selectionRevisions[]`, `audit[]` |

---

# 10. Screen registry (38/38)

| # | Route | Archetype | L0 | Acción primaria |
|---|---|---|---|---|
| R01 | `/login` | AUTH | marca + campos | Iniciar sesión |
| R02 | `/activate` | AUTH | código | Activar |
| R03 | `/no-access` | AUTH | estado + qué hacer | Contactar / volver |
| R04 | `/home` | A1 | atención (≤3) + Hoy | ¿Vas? pendiente |
| R05 | `/calendar` | A2 | mes/agenda + pendientes | ¿Vas? |
| R06 | `/search` | A7 | campo + resultados | Abrir resultado |
| R07 | `/notifications` | A10+A1 | qué cambió + qué hacer | Abrir aviso |
| R08 | `/more/profile` | A6 | quién soy + a quién veo | Personas a cargo / editar |
| R09 | `/teams` | A7 | Mi equipo primero | Abrir Mi equipo |
| R10 | `/teams/:teamId` | A6+A3 | próximo + resultado | ¿Vas? |
| R11 | `/people/:personId` | A6 | quién + equipo | Contactar / ¿Vas? |
| R12 | `/events/new` | A8 | tipo + cuándo + equipo | Crear |
| R13 | `/events/:eventId` | A4 | evento + cuándo/dónde + ¿Vas? | ¿Vas? / Ver resultado |
| R14 | `/events/:eventId/edit` | A8 | nombre + fecha/lugar + dirty | Guardar |
| R15 | `/events/:eventId/availability` | A3 | evento + mi estado | Voy/Quizás/No voy |
| R16 | `/events/:eventId/selection` | A3 | estado draft/published + conteo | Publicar |
| R17 | `/events/:eventId/attendance` | A3 | OPEN/CLOSED + conteo | Cerrar / Abrir para corregir |
| R18 | `/events/:eventId/match-record` | A8 | marcador + DRAFT/FINAL | Finalizar |
| R19 | `/jornadas/new` | A8 | nombre/fecha/sede | Crear |
| R20 | `/jornadas/:jornadaId` | A4 | estado + sede + hijos | Guardar |
| R21 | `/communication` | A5-hub | tabs + pendientes | Nuevo por tab |
| R22 | `/communication/conversations/new` | A8 | tipo + destinatarios | Crear |
| R23 | `/communication/announcements/new` | A8 | título + audiencia | Publicar |
| R24 | `/announcements/:id` | A6 | título + fecha + audiencia | Entendido |
| R25 | `/announcements/:id/edit` | A8 | bloqueo + diff | Guardar corrección |
| R26 | `/conversations/:id` | A5 | interlocutores + contexto | Enviar |
| R27 | `/management` | A7-hub | 3 caminos | (0) |
| R28 | `/management/structure` | A7+A8 | tabs + conteo | Crear elemento |
| R29 | `/management/teams/:id` | A6 | nombre + estado | Archivar / Activar |
| R30 | `/management/people` | A7 | buscar/filtrar | Crear persona |
| R31 | `/management/people/new` | A8 | formulario | Crear |
| R32 | `/management/people/:id` | A6+A8 | identidad | Guardar cambios |
| R33 | `/management/competitions` | A7 | lista/filtros | Crear competencia |
| R34 | `/management/competitions/:id` | A6 | estado/scope | Añadir inscripción |
| R35 | `/reports` | A7-hub | asistencia → rendimiento | (0) |
| R36 | `/reports/attendance` | A9 | filtros | (0, lectura) |
| R37 | `/reports/performance` | A9 | filtros | (0, lectura) |
| R38 | `/audit` | A10 | filtros | (0, lectura) |

---

# 11. Capability mapping

| Capability | Screens | Estado |
|---|---|---|
| C01 Identity & Access | R01 R02 R03 R08 R30 R31 R32 | OK (P0-4 cerrado) |
| C02 Club Structure | R09 R10 R28 R29 R33 | OK (P0-1 y P0-6 cerrados) |
| C03 People & Assignments | R10 R11 R16 R30 R31 R32 | OK (P1-05 parcial) |
| C04 Authority & Scope | transversal | OK vía `getAllowedActions` |
| C05 Competition Context | R10 R19 R20 R33 R34 | PARTIAL (M-12 entry fusionado) |
| C06 Eligibility | R16 R32 | OK (P0-5 cerrado, constraints canónicos) |
| C07 Event Operations | R04 R05 R12 R13 R14 | OK + FDPG-01 |
| C08 Match Day / Jornada | R13 R18 R20 | OK |
| C09 Participation Lifecycle | R04 R13 R15 R16 R17 | OK + FDPG-02 deferred |
| C10 Change Management | R14 R20 R25 | PARTIAL (Conflict Workspace parcial) |
| C11 Logistics | R12 R13 R14 R20 | OK |
| C12 Communication & Notification | R04 R07 R21–R26 | OK + FDPG-04 / FDPG-03 deferred |
| C13 Match Record & Performance | R10 R13 R18 R37 | OK (P0-3 cerrado) |
| C14 History / Audit / Provenance | R13 R16 R25 R32 R38 | OK |
| C15 Search & Reporting | R06 R30 R33 R35 R36 R37 R38 | OK |
| C16 Operational Awareness | R04 R05 R07 R26 | OK (FDPG-02 deferred) |

---

# 12. Unresolved gaps

| ID | Gap | Blocking |
|---|---|---|
| S4-01 | ScopeDialog captura alcance pero el cambio de serie no se bulk-aplica | no |
| S4-02 | Conflict Workspace sin vista lado a lado baseline/localDraft/latestServer | no |
| S4-03 | `CompetitionEntry` sigue fusionando scope LINE y TEAM | no |
| S4-04 | `Person.team` / `Person.role` siguen como selectores derivados | no |
| S4-05 | Lista de conversaciones sin reordenar por no-leídos | no |
| FDPG-02 | nudge / recordatorios | deferred por decisión de Stage 4 |
| FDPG-03 | mute / mentions / replies | deferred por decisión de Stage 4 |

---

# 13. Verificación

```
pnpm typecheck   PASS
pnpm test        31/31 PASS
pnpm build       PASS
routes           38/38
P0               6 → 0
backend          0 (local mock state)
```
