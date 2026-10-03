# STAGE 4 — DISCOVERED GAPS (vivo durante la implementación)

Formato obligatorio (§51): ID · screen · problem · affected capability · Product Truth section · current limitation · proposed decision · blocking yes/no.

| ID | Screen | Problem | Capability | Freeze § | Current limitation | Proposed decision | Blocking |
|---|---|---|---|---|---|---|---|
| S4-01 | `/events/:eventId/edit` | `ScopeDialog` (FDPG-01) captura la intención de alcance y la muestra en el Impact Preview, pero `eventChange` sigue aplicando el cambio sólo a la ocurrencia editada. No hay bulk de serie ni `event_occurrence_overrides`. | C10 / C07 | §11, §9 (EventSeries) | El modelo tiene `eventSeries[]` y `seriesId`, pero no hay propagación a las siguientes ocurrencias | En Stage 5 o backend: aplicar el patch a las ocurrencias del alcance elegido y registrar override por ocurrencia. Frontend ya pide y muestra el alcance correcto | no |
| S4-02 | `/events/:eventId/selection` | Conflict Workspace (P1-06) pide baseline vs borrador vs servidor lado a lado. Stage 4 implementa detalle por persona en lenguaje usuario + Impact Preview, sin vista simultánea de las tres versiones. | C10 / C14 | §44, §73 | No hay superficie dedicada de tres columnas | En Stage 5: panel con baseline / desired / latest y acción explícita por versión | no |
| S4-03 | `/management/competitions/:id` | `CompetitionEntry.team` fusiona scope LINE y TEAM (M-12). La UI no puede distinguir `Entry.team_id` de `Entry.line_id`. | C05 | §16, §25 (`competition_entries`) | Modelo heredado del CURRENT con un solo campo | Desdoblar en `teamId` / `lineId` en el modelo mock; mostrar "Equipo Sexta A" vs "Línea A de Sexta" | no |
| S4-04 | mock global | `Person.team` y `Person.role` siguen existiendo como selectores derivados junto a `teamAssignments[]` y `roleAssignments[]` (P1-05 / P1-07). Se eliminó el filtro por `person.role` en Overview, pero quedan usos en features. | C03 / C04 | §17, §26 | Doble verdad transitoria | Completar la derivación: ningún selector de UI debe leer `person.role`/`person.team`; sólo assignments | no |
| S4-05 | `/communication` | La lista de conversaciones conserva la densidad del CURRENT; no se reordenó por no-leídos ni por mención, y no hay filtro por tipo. | C12 | §20, §59 | Layout preexisting conservado por §7 "no destruir lo bueno de Figma" | En Stage 5: no leídos primero, filtro por tipo en sheet, y separación visual más marcada entre Mensajes y Comunicados | no |

## Decisiones de producto gaps ya resueltas en Stage 4 (no bloqueantes)

| FDPG | Decisión | Implementación |
|---|---|---|
| FDPG-01 | IN | `ScopeDialog` con "Solo este evento / Este y los siguientes / Toda la serie", antes del Impact Preview definitivo. No expone "EventSeries" |
| FDPG-02 | DEFERRED | No se implementó notification type nuevo. §22 intacta |
| FDPG-03 | DEFERRED | No se implementó mute/mentions/replies. Conversation sigue simple |
| FDPG-04 | IN | `findOrOpenDirect` + par canónico único; `NewConversation` muestra "Ya tenés una conversación con X." + acción "Abrir conversación" |
