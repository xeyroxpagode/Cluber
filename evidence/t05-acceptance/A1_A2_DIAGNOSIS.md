# A1 / A2 — Diagnóstico técnico (antes de C1)

## A1 — Root-cause por hallazgo de navegador

### T05-QA-001 (P1)
- **Cadena**: UI `AnnouncementForm` (botón "Guardar borrador" habilitado con title+body) → POST `/api/announcements/draft` → `AnnouncementService.draft()` → `validateAudience()` → `AppError("AUDIENCE_REQUIRED")` → 422 → Banner "No se pudo guardar".
- **Divergencia**: `validateAudience()` exige `clubWide === true` o `teamIds.length > 0` también para DRAFT. C11 y CC-T05-C10 definen un DRAFT válido por `title`+`body` non-empty; C12 exige intención explícita **al publicar**. El orden de J01 (guardar DRAFT → recuperar → editar → elegir audiencia → publicar) confirma que la audiencia se decide después.
- **Causa raíz**: validación de publicación aplicada prematuramente al guardado de borrador. Defecto productivo de backend, no de test ni ambiente.
- **Corrección mínima**: `draft()` solo valida título/cuerpo y consistencia de la audiencia si se proporciona; `publish()` exige intención de audiencia explícita. Sin cambios de esquema ni permisos.

### T05-QA-002 (P2)
- **Cadena**: `AnnouncementDetail` condiciona `PageContextHeader.action` a `data.state === "PUBLISHED"`; el estado DRAFT no ofrece acción.
- **Causa raíz**: omisión de la rama DRAFT en la capa de presentación; el servicio y la ruta `/edit` ya soportan UPDATE DRAFT (CC-T05-C10).
- **Corrección**: botón "Editar borrador" para DRAFT que navega a `/announcements/:id/edit`.

### T05-QA-003 (P3)
- **Cadena**: `TextField`/`TextArea` de `src/shared/ui.tsx` muestran "OPCIONAL" cuando no reciben `required`; `AnnouncementForm` no lo pasa en Título/Cuerpo/Motivo.
- **Causa raíz**: falta de propagación de la validación contractual al marcado semántico del formulario.
- **Corrección**: pasar `required` a esos campos.

### T05-QA-004 (INVALID EVIDENCE)
- No reproducible con `gei_test` reconstruida; J04 Firefox 1/1 PASS en aislamiento. Estado compartido entre motores secuenciales. Sin corrección de producto.

## A2 — Auditoría global (riesgos invisibles en navegador)

### A2.1 — RC-07 / RC-06 / RC-19 paginación en memoria — **DEFECTO CONFIRMADO (P1 técnico)**
- `backend/src/communication/queries.ts`: `conversationThread()` ejecuta la consulta completa (`rows = await query.execute()`), luego filtra por cursor y aplica `slice(0, limit + 1)` en JavaScript. `conversationList()` y `announcementList()` hacen lo mismo tras filtrar audiencia en memoria.
- **Contrato**: RC-06 cursor `(lastActivityAt DESC, id DESC)`; RC-07 cursor `(sentAt, id)`; RC-19 cursor `(publishedAt DESC, id DESC)` — paginación real en base de datos.
- **Impacto**: descarga ilimitada de mensajes y anuncios; con volumen creciente degrada latencia y memoria y amplía superficie de exposición antes del filtrado. Una lista visualmente limitada no demuestra paginación.
- **Corrección**: aplicar `WHERE` de cursor y `LIMIT limit+1` en SQL en los tres reads, manteniendo `hasMore` y `nextCursor`. RC-07 además ya aplica filtro temporal `[joinedAt, leftAt)` en SQL.

### A2.2 — M8 / integridad
- 5 tablas, FKs, constraints, 3 índices únicos parciales, exclusión `btree_gist`, tombstone y C18 verificados en I1/I5 contra `gei_test`. Sin cambios desde entonces. A re-ejecutar en V1.

### A2.3 — Authority / C15 / privacidad
- `assertConversationAccess()` revalida RoleAssignment/TeamAssignment y participación activa en cada request. `conversationThread()` filtra `sent_at >= joined_at` y `< leftAt` en SQL: la historia de un ex-participante queda acotada a su período. No se encontró acceso histórico indiscriminado.
- ADMIN no tiene ruta de acceso universal; verificado en J03 con navegador (sin composer) y en tests API negativos.
- `Message.body` redactado en Audit; ausente en logs y payload realtime (`conversation.changed` sin body). Escaneo limpio en I5.

### A2.4 — Concurrencia / recuperación
- ST-A08/B03/B11 usan `Promise.allSettled` sobre transacciones reales simultáneas; ST-A09/A10 verifican idempotencia y outbox; ST-F07/F08 inyectan abort de SSE y 500 en navegador. A repetir en V1.

### A2.5 — Regresiones
- Baseline T04: 301 tests locales en I0. A repetir en V1; no se hereda ningún PASS de matrices anteriores.
