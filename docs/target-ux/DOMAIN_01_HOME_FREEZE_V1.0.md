# Domain 01 — Home Freeze V1.0

**Authority:** FROZEN — Part of GEI_TARGET_UX_FREEZE_V1.0  
**Date:** 2026-10-22  
**Routes:** R04 `/home`  
**Archetype:** A1 Operational Home  
**Source:** `GEI_FRONTEND_TARGET_BLUEPRINT_V1.md` §10.A1, §11 R04, `GEI_IA_SIMPLICITY_RESEARCH_V1.md` §7.1

---

## FROZEN SPECIFICATION

### Mental Model
**Bandeja de acción, no diario.** Como abrir el banco y ver qué vence hoy.

### Hierarchy (L0 → L4)
```
L0: Necesita tu atención (≤3 items) + Hoy
L1: ¿Vas? inline (para próximo evento pendiente) + Próximamente
L2: Comunicaciones accionables
L3: EventDetail, Conversation, Announcement (bajo demanda)
L4: Admin escondido (nada en Home)
```

### Primary Action Location
**Inline por bloque:**
- "Necesita tu atención": cada fila tiene su acción (¿Vas? / Abrir / Leer)
- "Hoy": acción inline en fila de evento
- "Próximamente": navegar a EventDetail
- "Comunicaciones": navegar a Announcement/Conversation

### Row Grammar
```
[estado en texto] título — hora/lugar — acción
```
- Estado **siempre en texto** (nunca solo badge/color)
- Acción pegada a su estado (¿Vas? bajo el evento; Leer bajo comunicado)

### Spacing Rules
- **Atención separada del resto** (air gap visual)
- **Aire entre bloques**, densidad dentro de cada bloque
- No métricas/KPIs en Home (ni mobile ni desktop)

### Actor Variants

| Actor | Attention Rows | Primary Action | Structure |
|-------|----------------|----------------|-----------|
| **PLAYER** | Own ¿Vas? pendiente, reconfirmaciones, convocation changes | ¿Vas? inline | Attention + Hoy + Próximamente + Comunicaciones |
| **COACH** | Selection conflicts, attendance open, match record draft, team events | Crear evento (sticky header) + ¿Vas? inline | Same + "Crear evento" CTA |
| **CAPTAIN** | Same as PLAYER + team availability scope | ¿Vas? inline | Same |
| **SUBCOMMITTEE** | Announcements to publish, competition entries, eligibility | Navegar a Management | Same (no team events) |
| **ADMIN** | **Zero** — "Nada pendiente." explicit | None (hub navigation) | Attention (0) + Hoy (eventos club-wide) + Comunicaciones |
| **GUARDIAN** | Minor's ¿Vas? (if delegation allows) | ¿Vas? inline for minor | Selector `Viendo a X ▾` si >1 menor |

**Home → Resource Origin Behavior:** Back from EventDetail/Communication preserves Home scroll + filter state.

### Component Specifications

#### "Necesita tu atención" (L0)
- **Max 3 items** — si 0: "Nada pendiente." explícito (verde, peso 600)
- **Order:** Más urgente primero (basado en deadline + severity)
- **Each row:** Estado textual + título evento + hora/lugar + acción inline
- **Conflict row:** "Convocatoria con situaciones para revisar" → navega a Selection

#### "Hoy" (L1)
- Eventos del día real (clock real, no frozen)
- **Empty state:** "Hoy no hay actividades" — compacto, no 200px giant
- Row: [badge estado] Partido/Entrenamiento — hora — sede — ¿Vas? inline si pendiente

#### "Próximamente" (L1)
- Eventos futuros (excluye POSTPONED de "Hoy" — **Calendar lo lista, Home no**)
- Postergado muestra "A definir" en hora + fecha real
- Compact density, navega a EventDetail

#### "Comunicaciones" (L1)
- **Separado de Mensajes** (canal distinto)
- No-leído badge visible
- Navega a AnnouncementDetail o Conversation

### Responsive Behavior

| Regime | Layout |
|--------|--------|
| **Compact** | Feed vertical, bottom nav, acción táctil grande, bottom nav 64px+safe |
| **Medium** | Feed vertical, bottom nav o rail, misma jerarquía |
| **Wide** | Sidebar 240px, columna central max-w-[1440px], sin métricas, mismo feed |

### Motion
- **Micro feedback** en ¿Vas? guardado (conteo live)
- **NONE** otherwise

### States Covered
| State | Visual Treatment |
|-------|------------------|
| Attention items present | Lista ≤3, cada una con acción |
| Attention empty | "Nada pendiente." explícito (no empty surface) |
| Hoy empty | "Hoy no hay actividades" compacto |
| Postergado en Próximamente | "A definir" en hora, fecha visible |
| Comunicaciones sin no-leído | Lista normal, sin badge |
| Guardian multi-menor | Selector `Viendo a X ▾` en cabecera (sheet en mobile) |

### Capabilities Mapped
- C07 Event Operations (ver crear)
- C09 Participation Lifecycle (¿Vas? inline)
- C12 Communication & Notification (comunicaciones)
- C16 Operational Awareness (atención + hoy + avisos)

### Explicit KEEP from Blueprint
1. Attention → Hoy → ¿Vas? inline → Próximamente → Comunicaciones order
2. "Nada pendiente." explicit
3. Event ListContainers (row grammar)
4. Wide: Communications ContentRail when width permits
5. Home summary caps (max 3 attention)
6. Actor variants (different attention content per role)
7. Origin-aware Back from Home → EventDetail/Communication

### Explicit PROHIBITED
- Métricas/KPIs en Home
- Badge decorativo "6 A" o similar (literal falso)
- "Temporada 2026" repetido 3 veces
- Estructura idéntica para ADMIN y PLAYER (ADMIN debe ver 0 acciones)
- Comunicaciones sin estado no-leído
- Reloj fijo (debe usar Real Clock)

---

## VERSION
`DOMAIN_01_HOME_FREEZE_V1.0` — 2026-10-22 — Part of `GEI_TARGET_UX_FREEZE_V1.0`