# QA crudo — hallazgos observados ANTES de correctivos (Q1/Q2)

Estado: Q1 en curso. Código productivo NO modificado.

## T05-QA-001 — P1 — DRAFT no se puede guardar sin audiencia
- Flujo: J01, R23, CMD-COM-01, ST-A01 / ST-A01-UPDATE, AC-04.
- Esperado: CC-T05-C10 + C11 permiten persistir un DRAFT válido con title+body non-empty; la audiencia se elige al publicar.
- Observado: con título y cuerpo completos, sin elegir audiencia, "Guardar borrador" está habilitado pero el POST `/api/announcements/draft` responde 422 `AUDIENCE_REQUIRED` ("Debe seleccionar al menos un equipo o elegir todo el club"). La UI muestra "No se pudo guardar".
- Identidad: SUBCOMMITTEE `t05-sub@example.com`. Browser: in-app Chromium. Viewport: 1280×800 (inicial).
- Reproducción: /communication/announcements/new → completar Título y Cuerpo → no tocar audiencia → Guardar borrador.
- Evidencia: console 422, banner "No se pudo guardar", request POST capturada.
- Impacto: el flujo DRAFT→recuperar→editar exigido en J01 es inalcanzable sin elegir audiencia.

## T05-QA-002 — P2 — DRAFT sin affordance de edición/publicación
- Flujo: J01, R24, RC-19.
- Esperado: R23 "Recuperar/Editar DRAFT: al seleccionar uno, carga datos para edición".
- Observado: el detalle de un DRAFT muestra solo el botón "Volver"; no hay "Editar" ni "Publicar". El formulario `/announcements/:id/edit` funciona si se navega directamente, pero no existe control visible que lleve allí.
- Identidad: SUBCOMMITTEE. Browser: in-app Chromium.
- Evidencia: snapshot del detalle con único botón "← Volver".
- Impacto: recuperación del borrador depende de conocer la ruta.

## T05-QA-003 — P3 — Etiquetas "OPCIONAL" engañosa
- Flujo: R23/R25 formularios de anuncios.
- Esperado: título, cuerpo y motivo son obligatorios (validación lo demuestra: botones deshabilitados / 422).
- Observado: `TextField`/`TextArea` muestran "OPCIONAL" junto a Título, Cuerpo y Motivo.
- Impacto: UX engañosa; no bloquea funcionalidad.

## Comportamientos confirmados (sin hallazgo)
- CTA "Nuevo comunicado" visible solo para SUBCOMMITTEE en el Hub.
- DRAFT con audiencia explícita: se guarda, aparece en el Hub, se edita vía /edit, persiste tras recarga.
- Publicación → NOT-07 visible en PLAYER A ("ANUNCIO PUBLICADO") con estado "Sin leer"; "Marcar leído" persiste tras recarga (CMD-COM-12).
- Corrección → Revisión 2, audiencia inmutable.
- Archivado → ARCHIVED conserva "Publicado …", revisión y cuerpo.
