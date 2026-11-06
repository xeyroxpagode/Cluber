# Domain 04 — Communication Freeze V1.0

**Authority:** FROZEN — Part of GEI_TARGET_UX_FREEZE_V1.0  
**Date:** 2026-10-22  
**Routes:** R21 `/communication`, R22 `/communication/conversations/new`, R23 `/communication/announcements/new`, R24 `/announcements/:id`, R25 `/announcements/:id/edit`, R26 `/conversations/:id`  
**Archetypes:** A5 Chat, A6 Entity Detail, A7 Management List, A8 Admin Form  
**Source:** `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` §10.A5, §10.A6, §10.A7, §10.A8, §11 R21–R26, `GEI_IA_SIMPLICITY_RESEARCH_V1.md` §7.5

---

## FROZEN SPECIFICATION

### 4.1 Core Distinctions (Frozen — Never Conflate)

| Concept | Definition | Canonical Route |
|---------|------------|-----------------|
| **Conversation** | Chat bidireccional entre participantes (DIRECT, GROUP, TEAM, EVENT) | `/conversations/:id` |
| **Announcement** | Comunicado unidireccional oficial con audiencia snapshot inmutable | `/announcements/:id` |
| **Notification** | Aviso de sistema (cambio de evento, publicación, etc.) — **no crea conversación** | `/notifications` |

**Regla:** Messages **no crean** global Notifications. Solo `MESSAGE_RECEIVED` type en Notification feed.

---

### 4.2 Conversation Kinds (Frozen — 4 Types, Canonical)

| Kind | Creation | Canonical | Participants | Scope |
|------|----------|-----------|--------------|-------|
| **DIRECT** | `/communication/conversations/new` → Directo | **1 per pair** (pair key = sorted personIds) | 2 personas | Private |
| **GROUP** | `/communication/conversations/new` → Grupo | **N per group** (title + participants) | 3+ personas | Private |
| **TEAM** | Auto from Team resource | **1 per Team** (canonical) | TeamAssignment vigentes | Team |
| **EVENT** | Auto from Event resource | **1 per Event** (canonical) | Target teams + staff | Event |

**Rules:**
- **DIRECT canonical per pair:** `findOrOpenDirect` evita duplicados — UI debe usarlo
- **GROUP:** Título obligatorio + participantes explícitos
- **TEAM/EVENT:** Canonical desde sus recursos de dominio — no creables manualmente
- **ADMIN/SUBCOMMITTEE:** NO acceso a Conversations (Product Truth §20)

---

### 4.3 Communication Hub (R21 `/communication`) — Archetype A5-hub

#### Mental Model
**¿Qué dijeron y con quién hablo? — Canales separados perceptual y estructuralmente.**

#### Tabs (Frozen — 2 tabs, preserve state)
```
1. Conversaciones (default) — Mensajes bidireccionales
2. Comunicados — Anuncios oficiales unidireccionales
```
**Prohibido:** Tab "Todo" (duplica estructura)

#### Hierarchy
```
L0: Tabs + CTA por tab (Nuevo mensaje / Nuevo comunicado)
L1: Listas con no-leídos primero (reordenadas)
L2: Preview + audiencia (Comunicados) / último mensaje (Conversaciones)
L3: Detalle (Conversation / Announcement)
L4: Admin (archivar, silenciar — overflow)
```

#### Primary Actions (Per Tab)
| Tab | Primary | Style |
|-----|---------|-------|
| Conversaciones | Nuevo mensaje | Primary (sticky header desktop / bottom mobile) |
| Comunicados | Nuevo comunicado | Primary (sticky header desktop / bottom mobile) |

**Actual gap:** Botón es `secondary` — debe ser `primary`

#### Perceptual Separation (Frozen)
- **Visual distinction:** Diferente container/radio/icon/gramática de fila
- **Comunicados:** Megáfono icon, audiencia visible en row, badge no-leído
- **Conversaciones:** Avatar/icono participantes, último mensaje preview, badge no-leído
- **No-leído:** Punto 8px + contador — **único acento sólido en contenido**

#### Responsive
| Regime | Layout |
|--------|--------|
| Compact | Tabs + listas full-width, Nuevo por tab (sticky bottom) |
| Medium | Tabs + listas | 
| Wide | Lista + preview lateral (Content Rail) — ConversationRail + Workspace |

---

### 4.4 New Conversation (R22 `/communication/conversations/new`) — Archetype A8 Admin Form

#### Mental Model
**Tipo → buscar → resumen → crear**

#### Hierarchy
```
L0: Tipo (DIRECT / GROUP / TEAM / EVENT) — SegmentedControl
L1: Búsqueda + lista candidatos (filtrada por alcance)
L2: Resumen (qué se va a crear) — **OBLIGATORIO** antes de Crear
L3: Crear conversación (primary sticky)
```

#### Type-Specific Rules
| Type | Creation Flow | Canonical Check |
|------|---------------|-----------------|
| **DIRECT** | Buscar persona → Resumen "Conversación con X" | `findOrOpenDirect` — si existe: "Ya tenés una conversación con X" + "Abrir conversación" |
| **GROUP** | Título + buscar múltiples → Resumen "Grupo: X, Y, Z" | Nuevo GROUP siempre |
| **TEAM** | Seleccionar equipo (de mis equipos) | Canonical 1 per team — si existe: abrir |
| **EVENT** | Seleccionar evento (de mis eventos) | Canonical 1 per event — si existe: abrir |

**Prohibido:** 2 controles `primary` simultáneos (actual: Directo/Grupo toggle + Crear = 2 primarias)

#### Candidate Filtering
- **Alcance operativo:** Solo personas con las que el usuario tiene autoridad para conversar
- **Cross-division:** GROUP puede incluir personas de otras Divisiones
- **No `person.role`/`person.team` selectors** — usar `TeamAssignment`/`RoleAssignment` derivados

---

### 4.5 New Announcement (R23 `/communication/announcements/new`) — Archetype A8 Admin Form

#### Mental Model
**Redactar → audiencia → previsualizar alcance → Publicar (borrador no notifica)**

#### Hierarchy (Frozen Order — Audiencia FIRST)
```
L0: AUDIENCIA (SITUACIÓN) — Selector TeamSet (Club-wide / División / Línea / Equipos específicos)
L1: ACCIÓN: Publicar (primary sticky) + Guardar borrador (secondary)
L2: TÍTULO + CUERPO (INFORMACIÓN)
L3: Alcance/Impacto preview (conteo real destinatarios)
```

#### Audience (Frozen)
- **Tipo:** `AudienceSnapshot` = `{ clubWide: boolean, teamIds: string[] }` — **§21**
- **Publicada = INMUTABLE** — corregir no toca audiencia
- **Resolver:** "Línea A" → requiere División + Temporada (no string libre)
- **Publicar notifica:** `ANNOUNCEMENT_PUBLISHED` a `publishedAudience` snapshot

#### Lifecycle
`DRAFT` → `PUBLISHED` → `ARCHIVED` → `CORRECTED_N` (revision++ + notificaciones)

---

### 4.6 Announcement Detail (R24 `/announcements/:id`) — Archetype A6 Entity Detail

#### Mental Model
**Lectura shareable: título + cuerpo + audiencia + acuse mínimo.**

#### Hierarchy
```
L0: Título + fecha + audiencia (visible como restriction)
L1: Cuerpo legible
L2: Acuse/lecturas (Entendido inline) — **PRIMARY ACTION**
L3: Correcciones / Historial (colapsado)
L4: Admin (Archivar/Corregir — overflow, solo SUBCOMMITTEE)
```

#### Primary Action
**"Entendido" inline** (acuse de lectura) — **Blueprint declara primaria de R24**
- Modelo `Announcement` debe tener `readBy` / `acknowledgedBy`
- **Actual gap:** No existe acción primaria, no hay acuse

#### Access Control (Frozen)
- **Audiencia = Control de acceso** — URL de comunicado de otra división → 403 / no-access
- **Actual gap:** Cualquiera con URL lee comunicado ajeno (UX-16)

---

### 4.7 Announcement Edit (R25 `/announcements/:id/edit`) — Archetype A8 Admin Form

#### Mental Model
**Qué cambia + a quién alcanzó + audiencia bloqueada si publicado.**

#### Hierarchy
```
L0: Aviso bloqueo audiencia (si PUBLISHED) — "La audiencia publicada no puede modificarse"
L1: Título + Contenido (editable) — DIFF visible (antes/después)
L2: Motivo de corrección (obligatorio, visible)
L3: Impact Preview: quién ya leyó + quién se notificará
L4: Guardar corrección (primary) + Archivar (overflow)
```

#### Rules (Frozen)
- Audiencia `disabled` con explicación si PUBLISHED
- **Diff obligatorio** (Blueprint lo exige)
- `revision++` + notificaciones `ANNOUNCEMENT_CORRECTED`
- Corrección **no notifica** si solo título/cuerpo (Blueprint: notifica)

---

### 4.8 Conversation Detail (R26 `/conversations/:id`) — Archetype A5 Chat

#### Mental Model
**WhatsApp/iMessage: leer arriba, escribir abajo, contexto siempre visible.**

#### Hierarchy
```
L0: Cabecera (contexto canónico real: tipo + N participantes + Equipo/Partido resuelto)
L1: Mensajes cronológicos (burbuja + autor + hora + ediciones/eliminados marcados)
L2: Input sticky (Enviar — primary, siempre visible con teclado)
L3: Miembros / Contexto (Sheet)
L4: Silenciar / Archivar / Eliminar propio (Overflow)
```

#### Primary Action
**Enviar** (input sticky, siempre visible con teclado)

#### Message States (Frozen)
| State | Visual | Contract |
|-------|--------|----------|
| Enviando | Spinner en botón, input disabled | **NO fake CheckCheck** |
| Enviado | Check simple | Server ack |
| Entregado/Leído | CheckCheck **tras confirmación server** | Real, no optimista |
| Fallido | Inline error + "Reintentar" | Persistente |
| Editado | "(editado)" timestamp | Soft-edit |
| Eliminado (propio) | "Este mensaje fue eliminado" + confirmación | Soft-delete, tombstone |

#### Composer (Frozen — P2-23 fix)
- **Mobile:** `sticky bottom-0` + altura mobile-first, **siempre visible sobre teclado**
- **Desktop:** Chat + lateral miembros
- **Altura:** `calc(100dvh - header - safe-area)` — **no `min-h-[60dvh]` que entierra composer**

#### Context Resolution (Frozen)
- **TEAM:** Resuelve `teamId` → nombre equipo real (no "Sexta A · Equipo" literal)
- **EVENT:** Resuelve `eventId` → "GEI vs CUBA · 10 oct" (no seed literal)
- **DIRECT:** Pair canonical — muestra nombre del otro participante
- **GROUP:** Título + N participantes

#### Message Optimistic State (Frozen)
- **Optimistic render** permitido
- **Pero:** CheckCheck **solo tras confirmación server**
- **FAILED state:** Inline + botón Reintentar obligatorio

---

### 4.9 Capabilities Mapped

| Capability | Screens |
|------------|---------|
| C12 Communication & Notification | R21–R26, R04, R07 |
| C15 Search & Reporting | R21 (buscar conversaciones) |
| C01 Identity & Access | R22 (crear conversación), R26 (participants) |
| C04 Authority & Scope | Transversal (gating ADMIN/SUBCOMMITTEE out of Conversations) |

---

### Explicit KEEP from Blueprint
1. Conversation ≠ Announcement ≠ Notification (3 canales distintos)
2. 4 kinds: DIRECT, GROUP, TEAM, EVENT — canonical rules
3. DIRECT canonical per pair (`findOrOpenDirect`)
4. GROUP title + participants explicit
5. TEAM/EVENT canonical from domain resources
6. Compact Conversation = Workspace (full)
7. Wide ConversationRail + Workspace
8. Message optimistic state + FAILED + Retry
9. Announcement: DRAFT→PUBLISHED→ARCHIVED + Corrección
10. Published audience **immutable**
11. Messages do NOT create global Notifications
12. Tabs Conversaciones/Comunicados preserve state
13. Guardian NO Communication tab (§20)

---

### Explicit PROHIBITED
- Tab "Todo" en Communication hub
- Conversation DIRECT duplicado (sin `findOrOpenDirect`)
- Announcement audiencia como string libre ("Sexta A" sin resolver)
- Announcement Detail sin acción "Entendido" / acuse
- Audiencia publicada mutable en corrección
- Composer enterrado bajo bottom nav en mobile
- Fake CheckCheck incondicional en mensajes
- Mensajes creando Notifications globales
- Contexto TEAM/EVENT como string literal de seed
- `min-h-[60dvh]` en ConversationPage
- SUBCOMMITTEE/ADMIN accediendo a Conversations

---

## VERSION
`DOMAIN_04_COMMUNICATION_FREEZE_V1.0` — 2026-10-22 — Part of `GEI_TARGET_UX_FREEZE_V1.0`