# GEI Design System Freeze V1.0

**Authority:** FROZEN  
**Date:** 2026-10-22  
**Status:** Canonical reference for all UI implementation decisions  
**Source:** Derived from `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md`, `GEI_FINAL_FRONTEND_FREEZE_V1.md`, `GEI_IA_SIMPLICITY_RESEARCH_V1.md`, `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md`

---

## 1. FOUNDATION VISUAL

### 1.1 Color Tokens (Semantic, 17 tokens)

| Token | Role | Hex / Value | Usage |
|-------|------|-------------|-------|
| `--color-brand` | Marca GEI | `#1E3A8A` | Logo, marca única |
| `--color-primary` | Acción primaria | `#2563EB` | **Único** acento para CTA primaria, selección, no-leído, estado que requiere acción |
| `--color-primary-soft` | Nav activa, fila seleccionada | `rgba(37,99,235,0.12)` | Sidebar/BottomNav activo, fila Selection |
| `--color-interactive` | Enlaces, acciones secundarias | `#2563EB` | TextLink, acciones inline |
| `--color-selected` | Tab activa, chip filtro | `#2563EB` | TabBar, FilterChip activo |
| `--color-attention` | Necesita acción humana | `#DC2626` | Banner "Necesita tu atención", ¿Vas? pendiente |
| `--color-success` | Operación resuelta | `#16A34A` | Toast éxito, estado FINAL/PUBLICADO |
| `--color-warning` | Revisión | `#9A6515` | RECONFIRM, POSTPONED, stale |
| `--color-danger` | **Acciones destructivas exclusivamente** | `#DC2626` | `variant="danger"` — **0 usos actuales, obligatorio para Archivar, Deshabilitar, Eliminar, Finalizar, Cerrar con consecuencia** |
| `--color-neutral` | Información sin juicio | `#64748B` | Meta, timestamps, contadores secundarios |
| `--color-unread` | Punto/contador no-leído | `#2563EB` | Badge Communication, Shell |
| `--color-page` | Fondo página | `#F5F7FA` | Page surface |
| `--color-surface` | Card / Surface | `#FFFFFF` | Surface, OpenGroup, cards |
| `--color-raised` | Modal, Sheet, Dropdown | `#FFFFFF` | Modal, Sheet, Popover |
| `--color-control` | Input, Select, Button bg | `#FFFFFF` / `#F1F5F9` | Field, Select, Button secondary |
| `--color-border` | Divisores, bordes | `#E5E9F0` | Row divider, Surface border, Input border |
| `--color-overlay` | Backdrop modal/sheet | `rgba(15,23,42,0.4)` | Modal/Sheet backdrop |

**Regla de reserva de acento:** `--color-primary` **sólo** para: (a) acción primaria, (b) selección activa, (c) estado que requiere acción humana, (d) contador no-leído. **Prohibido** en: marca (usa brand), nav activa (usa primary-soft), iconos decorativos, badges masivos, chips decorativos, filas, metadata.

### 1.2 Forced Colors / High Contrast

- Todos los badges conservan `border` en modo `forced-colors: active`
- Estados **siempre en texto** (nunca solo color) — cumplido
- Contraste mínimo 4.5:1 para texto, 3:1 para UI — verificado en tokens

### 1.3 Typography Tokens (9 roles)

| Role | Size | Weight | Line-height | Class | Usage |
|------|------|--------|-------------|-------|-------|
| `page-context` | 12px | 600 | 1.2 | `.gei-page-context` | Contexto de página (uppercase, tracking-wide) |
| `page-title` | 26px | 700 | 1.15 | `.gei-page-title` | Título principal de página |
| `page-lead` | 15px | 400 | 1.5 | `.gei-page-lead` | Lead descriptivo bajo título |
| `section-title` | 17px | 650 | 1.3 | `.gei-section-title` | Títulos de sección (L4 FUERTE) |
| `item-title` | 15px | 650 | 1.4 | `.gei-item-title` | Título de fila/ítem (L3 NORMAL) |
| `body` | 14px | 400 | 1.5 | `.gei-body` | Texto base |
| `body-strong` | 14px | 650 | 1.5 | `.gei-body-strong` | Texto con peso semántico |
| `meta` | 12px | 400 | 1.4 | `.gei-meta` | Metadatos, timestamps (L2 SECUNDARIO) |
| `micro` | 11px | 400 | 1.4 | `.gei-micro` | Solo sin info crítica (L1 TENUE) |

**Fuente:** `Inter` variable font. **Prohibido:** tamaños arbitrarios fuera de estos 9 roles. **Prohibido:** `text-[Npx]` en features — usar clases `.gei-*`.

### 1.4 Spacing Scale (6 tokens)

| Token | Value | Class | Usage |
|-------|-------|-------|-------|
| `--space-inline` | 0.375rem (6px) | `.gei-inline` | Gap inline, icon+text |
| `--space-row` | 0.75rem (12px) | `.gei-row` | Gap dentro de fila, padding row |
| `--space-group` | 1rem (16px) | `.gei-group` | Grupo de controles relacionados |
| `--space-concept` | 1.75rem (28px) | `.gei-concept` | Separación conceptos dentro de sección |
| `--space-section` | 2.75rem (44px) | `.gei-section` | Separación secciones mayores |
| `--space-page` | 3.5rem (56px) | `.gei-page` | Padding página, márgenes exteriores |

**Composición stacks:**

```css
.gei-page-stack { display: flex; flex-direction: column; gap: var(--space-page); }
.gei-section-stack { display: flex; flex-direction: column; gap: var(--space-section); }
.gei-group-stack { display: flex; flex-direction: column; gap: var(--space-group); }
```

**Regla:** Antes de agregar card/borde/divisor, preguntar si el espaciado resuelve la agrupación.

### 1.5 Radius Tokens (4)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-small` | 4px | Chip, Tag, Checkbox, Badge |
| `--radius-control` | 8px | Button, Input, Select, TextArea |
| `--radius-surface` | 12px | Surface, OpenGroup, Sheet content |
| `--radius-modal` | 16px | Modal, ConfirmDialog |

### 1.6 Elevation / Shadow (2)

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-floating` | `0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04)` | Toast, Dropdown, Popover |
| `--shadow-overlay` | `0 8px 24px rgba(15,23,42,0.12), 0 4px 8px rgba(15,23,42,0.08)` | Modal, Sheet |

### 1.7 Z-Index (5 layers)

| Token | Value | Layer |
|-------|-------|-------|
| `--z-nav` | 40 | BottomNav, Sidebar |
| `--z-sticky` | 50 | StickyActionBar, Header sticky |
| `--z-sheet` | 60 | Sheet, Popover |
| `--z-modal` | 70 | Modal, ConfirmDialog |
| `--z-toast` | 80 | Toast |

---

## 2. CORE PRIMITIVES (shared/ui.tsx — 17 primitives)

| Primitive | Variants | Key Contracts |
|-----------|----------|---------------|
| `Button` | `primary`, `secondary`, `danger`, `quiet` | 44px min-height, `primary` único por pantalla, `danger` **obligatorio** para destructivas |
| `IconButton` | — | 44px touch target, `aria-label` obligatorio |
| `RowLink` | — | Chevron = navegación, hover/focus/pressed states, 44px min-height |
| `RowStatic` | — | Sin chevron, texto estático nunca usa azul acción |
| `StateBadge` | `tone` externo | **Tone mapping externo** — no hardcodea colores; texto + color |
| `Tag` | — | Chip estático, no parece pulsable |
| `UnreadMark` | — | Punto 8px + contador opcional, aria-label |
| `TabBar` | — | `role="tablist"`, `aria-selected`, flechas, focus management |
| `SegmentedControl` | — | `role="radiogroup"`, `aria-pressed`, 44px |
| `FilterChip` | — | `aria-pressed`, filtro interactivo vs Tag estático |
| `Expander` | — | `<details>` nativo, summary 44px |
| `Menu` | — | `role="menu"`, Escape cerrar, click-out cerrar, foco primer item, separador destructiva |
| `Field` | — | Label persistente, required/optional, error inline, `aria-invalid`, `aria-describedby` |
| `TextField` | — | Hereda Field, preserva input en error |
| `TextArea` | — | Hereda Field, preserva input en error |
| `Select` | — | 44px control, label persistente, error asociado |
| `Checkbox` | — | 20px, `aria-describedby` para conflicto |
| `RadioGroup` | — | `role="radiogroup"`, `aria-pressed` visible |
| `Surface` | — | Blanco + border, **único contenedor visual** (page/section/surface/control no distinguidos visualmente — gap conocido) |
| `OpenGroup` | — | Accordion pattern con `details` |
| `Banner` | `info`, `warning`, `error`, `success` | `role="alert"` o `status`, tono por prop |
| `Empty` | `icon` semántico | Icono semántico (no CalendarDays universal), copy honesto |
| `Modal` | — | **Focus trap, Escape, scroll-lock, foco inicial en primer control útil (no "Cerrar")**, `role="dialog" aria-modal` |
| `Sheet` | — | Bottom-sheet mobile, focus trap, Escape, scroll-lock |
| `ConfirmDialog` | — | **Siempre explica consecuencia, exige motivo escrito si irreversible** |
| `SavedState` | — | "Borrador guardado HH:MM", estado visible |
| `Toast` | — | `role="status"`, 3.6s, sin acción Deshacer (gap) |
| `Avatar` | — | Iniciales, funcional |
| `MetaRow` | — | Key-value row para fichas |
| `TextLink` | — | Azul acción, subrayado hover, 36px alto (inline, no gesto roster) |
| `BackLink` | — | Vuelta con origen, vocabulario usuario |
| `StickyActionBar` | — | Sticky bottom mobile / header desktop, acción primaria |
| `DataTable` | — | `<th>` semántico, ordenación, sticky header (desktop) |
| `KeyValue` | — | Pares clave-valor para fichas admin |

**Regla:** Todos los primitives tienen consumidores reales. No abstracción muerta.

---

## 3. CONTENT SYSTEM

### 3.1 State Text Mapping (source of truth: `src/shared/states.ts`)

| Domain | States | Text (ES) | Tone |
|--------|--------|-----------|------|
| Event | `DRAFT` `SCHEDULED` `POSTPONED` `IN_PROGRESS` `COMPLETED` `ABANDONED` `CANCELLED` `RESTORED` | Borrador, Programado, Postergado, En curso, Finalizado, Abandonado, Cancelado, Reprogramado | terminal: warning/success/danger/neutral |
| Availability | `YES` `MAYBE` `NO` `NO_RESPONSE` `NEEDS_RECONFIRMATION` | Voy, Quizás, No voy, Sin respuesta, Reconfirmar | — |
| Attendance | `PRESENT` `ABSENT` `JUSTIFIED` `UNRECORDED` | Presente, Ausente, Justificado, Sin registrar | `UNRECORDED` ≠ `ABSENT` (texto explícito) |
| Selection | `DRAFT` `PUBLISHED` `REVISION_N` | Borrador, Publicada, Revisión N | `PUBLISHED` inmutable |
| MatchRecord | `DRAFT` `FINAL` `CORRECTED_N` | Borrador, Final, Corrección N | `FINAL` bloquea edición |
| Announcement | `DRAFT` `PUBLISHED` `ARCHIVED` `CORRECTED_N` | Borrador, Publicado, Archivado, Corrección N | audiencia publicada inmutable |
| Account | `PENDING` `ACTIVE` `DISABLED` | Pendiente, Activa, Deshabilitada | — |

**Regla:** `stateText()` / `stateTone()` **sin fallback silencioso** — estado desconocido devuelve "Estado a revisar" + warning DEV.

### 3.2 Vocabulary (Product Truth frozen)

| Concepto | Término UI | Prohibido |
|----------|------------|-----------|
| Equipo | Mi equipo / Sexta A / Primera A | "Roster", "Club" para equipo |
| Partido / Entrenamiento | Partido / Entrenamiento | "Evento" en UI visible |
| Disponibilidad | ¿Vas? | "RSVP", "Availability" |
| Convocados | Convocados | "Selection", "Lista" |
| Asistencia | Asistencia | "Attendance" |
| Resultado | Resultado | "MatchRecord" |
| Comunicado | Comunicado | "Announcement" en UI |
| Mensaje / Chat | Mensajes / Conversación | "Chat" como sustantivo UI |
| Aviso | Aviso | "Notification" en UI |
| Temporada / División / Línea | Temporada / División / Línea | "Season", "Division", "Line" |
| Sede | Sede | "Venue" en UI |

---

## 4. NAVIGATION

### 4.1 Global Navigation Contract

| Platform | Component | Destinations (5, idénticos) | Spec |
|----------|-----------|------------------------------|------|
| Mobile (<1024px) | BottomNav | Inicio, Calendario, Equipos, Comunicación, Más | 64px + safe-area, labels 1 palabra + icono |
| Desktop (≥1024px) | Sidebar | Inicio, Calendario, Equipos, Comunicación, Más | 224px width, mismos 5 destinos |
| Tablet | BottomNav o Rail | Según ancho, mismos 5 destinos | Sin layouts exclusivos |

**Reglas:**
- Tabs **siempre visibles, nunca deshabilitadas**; sección vacía explica por qué
- Cross-highlight: Calendario en `/events/*` `/jornadas/*`; Comunicación en `/conversations/*` `/announcements/*`; Más en `/management/*` `/reports/*` `/audit` `/more/*`
- Utilidades persistentes en header: Buscar (⌘K/Ctrl+K) + Avisos (punto no-leído) + Avatar → Mi perfil
- Tabs internas (Equipo/Eventos/Resultados; Conversaciones/Comunicados; Structure tabs) preservan estado por tab, solo navegan

### 4.2 Responsive Breakpoints (3 regimes)

| Regime | Width | Nav | Calendar Default | Content Max-Width | Gutter |
|--------|-------|-----|------------------|-------------------|--------|
| **Compact** | <768px | BottomNav 64px+safe | Agenda | 100% | 16px |
| **Medium** | 768–1199px | BottomNav o Rail | Semana | 100% | 24px |
| **Wide** | ≥1200px | Sidebar 240px | Mes | 1440px centered | 32px |

**Desktop threshold:** 1024px (sidebar appears) — **pero** 3 regimes visuales para contenido.

### 4.3 Origin-Aware Back (Global Contract)

- **Back preserva origen**: filtros, tab, scroll, query params
- **Deep link autosuficiente**: URL contiene todo el contexto
- **Breadcrumb**: mapa `Record<prefijo, etiqueta>` en vocabulario usuario (mata "Mi espacio")
- **Implementación:** `useSearchParams` **obligatorio** para todos los filtros/tabs/mes — **actual: 0 usos**

---

## 5. SURFACE SYSTEM

### 5.1 Surface Hierarchy (6 levels conceptuales, 2 visuales actuales — gap)

| Level | Conceptual | Visual Actual | Target Visual |
|-------|------------|---------------|---------------|
| 0 | Page background | `#F5F7FA` | `--color-page` |
| 1 | Open / Section | `#FFFFFF` + border | `--color-surface` + spacing |
| 2 | Surface / Card | `#FFFFFF` + border | `--color-surface` + `--radius-surface` |
| 3 | Control | `#FFFFFF` / `#F1F5F9` | `--color-control` + `--radius-control` |
| 4 | Overlay (Sheet/Popover) | `#FFFFFF` | `--color-raised` + `--shadow-floating` + `--z-sheet` |
| 5 | Modal / Dialog | `#FFFFFF` | `--color-raised` + `--shadow-overlay` + `--z-modal` |

**Gap conocido:** Solo 2 niveles visuales reales (page + card). Target: 6 niveles distinguibles.

### 5.2 Surface Selection Rules (Frozen)

| Decisión | Surface | Ejemplos GEI |
|----------|---------|--------------|
| Ver/operar algo importante o compartible | ROUTE | 38 routes; EventDetail, Convocados, Conversación, Ficha, Informes |
| Tarea corta que conserva origen | SHEET | ¿Vas? desde Home; convocados cortos; crear estructura/competencia; selector Viendo a X; filtros complejos |
| Confirmación o decisión acotada | MODAL | Impact Preview + token; scope de serie; Publicar; Finalizar; Cerrar/Corregir con motivo; eliminar mensaje; archivar |
| Respuesta simple pegada al contexto | INLINE | Marcar ¿Vas?/Asistencia; acuse Entendido; validación campo; conteos live; autosave |
| Secundaria/rara/destructiva | OVERFLOW | Postergar/Cancelar/Restaurar; historial; prefs; export; silenciar |
| Conflicto de versiones | DEDICATED | Conflict Workspace: baseline vs borrador vs servidor lado a lado |

---

## 6. OVERLAYS

### 6.1 Modal Contract (Frozen)

- Focus trap obligatorio
- Escape cierra
- Scroll-lock body
- **Foco inicial en primer control útil** (nunca en "Cerrar")
- `role="dialog" aria-modal="true"`
- Max-width: Compact 100%, Medium 560px, Wide 640px
- Full-screen en Compact para formularios

### 6.2 Sheet Contract (Frozen)

- Bottom-sheet en Compact, side-panel en Wide cuando ancho interno lo permite
- Focus trap, Escape, scroll-lock
- Drag-handle visual en Compact
- Altura: Compact ~90vh, Medium/Wide auto con max-h

### 6.3 Popover / Inspector (Target Compositions — missing in current)

| Composition | Trigger | Content | Positioning |
|-------------|---------|---------|-------------|
| **Popover** | Click/hover en acción contextual | Menú overflow, filtros rápidos, acciones fila | Anclado a trigger, flip auto |
| **Inspector** | Click en fila/entidad (Wide) | Panel lateral 300-320px con detalle + acciones | Right panel, persistente mientras navega lista |

### 6.4 ConfirmDialog (Frozen)

- Siempre explica consecuencia en lenguaje usuario
- **Exige motivo escrito** si acción no reversible (Archivar, Deshabilitar, Finalizar, Cerrar, Corregir, Eliminar)
- `variant="danger"` para acción destructiva
- Focus en campo motivo o botón confirmar

---

## 7. FEEDBACK + MOTION

### 7.1 Feedback Grammar (Frozen)

| Trigger | Surface | Content | Duration |
|---------|---------|---------|----------|
| Acción primaria exitosa | Toast (`role="status"`) | "Guardado", "Publicado", "Finalizado" + timestamp | 3.6s |
| Error de validación | Inline (Field) + Alert global | Qué pasó + qué hacer, input preservado | Persistente hasta corrección |
| Error de servidor/command | Alert global + Toast | Qué pasó + qué hacer (reintento si aplica) | Persistente |
| Estado guardado (autosave) | SavedState inline | "Borrador guardado HH:MM" | Persistente hasta siguiente cambio |
| Mutación destructiva completada | Toast + navegación a origen | "Archivado", "Finalizado" + rastro auditoría | 3.6s |
| Mensaje enviado (optimista) | Inline en burbuja | CheckCheck **solo tras confirmación server** (actual: fake success — gap) | — |
| Mensaje fallido | Inline + botón Reintentar | "No se pudo enviar. Reintentar." | Persistente |

**Prohibido:** Fake success (CheckCheck incondicional), success silencioso, error sin recovery.

### 7.2 Loading States (Frozen)

| Tipo | Surface | Spec |
|------|---------|------|
| Navegación ruta | Skeleton global | 3 cards altura fija (Shell.tsx), max 800ms |
| Mutación (Guardar/Publicar/Finalizar) | Button `disabled` + "Guardando…" / spinner | Preserva input, no navega hasta éxito |
| Lista/Tabla | Skeleton rows | 3-5 rows, altura real |
| Chat composer | Inline "Enviando…" | Spinner en botón, input disabled |

### 7.3 Realtime Indicators (Frozen)

| Signal | Visual | Audio/Haptic |
|--------|--------|--------------|
| Conteo live (¿Vas?, Selección, Asistencia) | Número actualizado in-place, sin parpadeo | None |
| Nuevo mensaje en conversación activa | Burbuja aparece, scroll al último | None |
| Nuevo aviso | Punto no-leído en Shell + badge en Notifications | None |
| Conflicto de versión (autosave) | Banner `warning` + botón "Revisar" | None |

### 7.4 Motion Tokens (Frozen)

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--motion-instant` | 0ms | linear | Cambios de estado instantáneos (toggle, checkbox) |
| `--motion-micro` | 120ms | `ease-out` | Micro feedback: ¿Vas? guardado, conteo live, "Borrador guardado" |
| `--motion-context` | 180ms | `ease-in-out` | State transition: draft→publicado, open→closed, sheet/modal origen-destino |

**Reglas:**
- Default: **NONE** (no motion)
- Permitido: MICRO FEEDBACK, STATE TRANSITION, CONTEXT TRANSITION
- **Prohibido:** bounce, fade-up cards, scale botones, decoración, >200ms sin causa
- Cada animación debe responder: qué apareció/desapareció/cambió/dónde fue
- `prefers-reduced-motion: reduce` → **apaga todo** (global en theme.css)

### 7.5 Reduced Motion (Frozen)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## TRANSVERSE COMPOSITIONS (Target — frozen, not yet implemented)

### Page Intro
- **Where:** Top of every ROUTE screen
- **Contains:** `PageContextHeader` — context label (uppercase) + page-title + optional page-lead + primary action (if not sticky)
- **Contract:** L0 inmediato: qué es + qué pasa + qué hago

### Object Identity
- **Where:** Entity Detail screens (TeamDetail, PersonDetail, PersonAdminDetail, TeamAdmin)
- **Contains:** Identity (name + role/badge) + **1 acción primaria contextual** + estado terminal si aplica
- **Contract:** Identidad + 1 acción primero; resto colapsado (L2/L3/L4)

### Workspace Action Region
- **Where:** Roster Action screens (Availability, Selection, Attendance, MatchRecord)
- **Contains:** StickyActionBar con: estado planilla + conteo live + acción primaria (Responder/Publicar/Cerrar/Finalizar)
- **Contract:** Acción pegada a su estado, conteo separado y fijo

### Content Rail
- **Where:** EventDetail (Wide), TeamDetail (Wide), Conversation (Wide)
- **Contains:** Panel lateral 300-320px con: participación (4 RowLinks con estado), miembros, historial, mensajes del evento
- **Contract:** Desktop only (≥1200px); mobile → Sheet

### Inspector
- **Where:** Wide regimes, click en fila de lista/tabla
- **Contains:** Panel lateral persistente con detalle de la entidad seleccionada + acciones contextuales
- **Contract:** No navega, solo inspecciona; sincronizado con selección

### System Notice
- **Where:** Top of page, below header, above content
- **Contains:** Banner con `role="alert"` para: conflicto de versión, stale, impacto cambiado, mantenimiento
- **Contract:** Dismissible solo si no bloqueante; persiste hasta resolución

---

## RESPONSIVE REGIMES (Frozen Values)

| Metric | Compact (<768) | Medium (768–1199) | Wide (≥1200) |
|--------|----------------|-------------------|--------------|
| TopBar height | 56px | 56px | 56px |
| BottomNav height | 64px + safe-area | 64px + safe-area | — (Sidebar) |
| NavigationRail width | — | 72px | — |
| Sidebar width | — | — | 240px |
| Content gutter | 16px | 24px | 32px |
| Content max-width | 100% | 100% | 1440px centered |
| Calendar default | Agenda | Semana | Mes |
| Month view | Day selection + EventRows | Grid + selection | Full grid |
| Event Detail → Selection | Compact: Detail route | Medium: Detail route | Wide: Inspector when internal width permits |
| Conversation | Compact: Workspace (full) | Medium: Workspace | Wide: ConversationRail + Workspace |
| Tables | → Row lists (DataRows) | → DataTable | → DataTable + sticky header |
| Forms | 1 column, primary sticky | 1-2 columns | Form + Impact Panel |
| Modal | Full-screen | Centered 560px | Centered 640px |
| Sheet | ~90vh bottom | Side panel / bottom | Side panel |

---

## ACCESSIBILITY (Frozen Contracts)

| Requirement | Implementation |
|-------------|----------------|
| Focus visible global | `index.css` `:focus-visible` — **intacto, no tocar** |
| Focus trap | Modal, Sheet, ConfirmDialog — **implementado** |
| Escape handling | Modal, Sheet, Menu, Dialog — **implementado** |
| Scroll lock | Modal, Sheet — **implementado** |
| ARIA live regions | `role="status"` (Toast), `role="alert"` (Banner/Alert) — **gap: 0 aria-live en código actual** |
| Tabs semantics | `role="tablist"`, `aria-selected`, `aria-controls` — **gap: 0 role="tab" en código actual** |
| Form semantics | `aria-invalid`, `aria-describedby`, `aria-required`, label persistente — **gap: 0 en código actual** |
| Menu semantics | `role="menu"`, `role="menuitem"`, Escape, click-out — **gap: menú overflow sin semántica** |
| Checkbox/Radio | `role="checkbox"`, `aria-checked`, `aria-describedby` conflicto — **gap: checkbox sin describedby** |
| Reduced motion | Global CSS media query — **implementado** |
| Color independence | Estados siempre en texto — **cumplido** |
| Touch targets | **44px mínimo** roster gestures — **gap: Button 40px, Attendance 36px, Checkbox 16px, Links 18px** |
| Heading hierarchy | h1 → h2 → h3 sin saltos — **gap: skips h1→h3 en Structure, People, Notifications** |
| Landmarks | main, nav, aside, header — **parcial** |

---

## CHANGE CONTROL (Design System)

Este Design System Freeze se modifica sólo con:
1. Decisión de producto escrita
2. Cambio en `theme.css` + primitives afectados
3. Tests de regresión visual (smoke primitives)
4. Evidencia runtime en 3 viewports (500, 768, 1440)

**No se reabre por preferencia estética.**

---

## VERSION

`GEI_DESIGN_SYSTEM_FREEZE_V1.0` — 2026-10-22 — SHA baseline: `ebba0b8` (HEAD actual)