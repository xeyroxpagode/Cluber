# 01 — QA Browser Report (Q1/Q2/V1)

## Entorno real
- Backend Fastify real (`tsx --env-file=.env.e2e`), PostgreSQL aislado `gei_test` (host 127.0.0.1:56322, proyecto `gei-hockey-management-t01`, 36 tablas app, datos ficticios).
- Frontend Vite real en `http://localhost:8444`.
- Motores ejecutados: **Chromium 158**, **Firefox 159** (Playwright build 1572), **Microsoft Edge** (canal `msedge`).
- Shots/traces/videos: `evidence/t05-acceptance/screenshots/`, `playwright-report/`, `test-results/` (retenidos en fallos).

## J01 — Announcements (5/5 por navegador)
DRAFT sin audiencia guardado, salida y recuperación desde el Hub, edición vía affordance visible, persistencia tras recarga, audiencia club-wide explícita, publicación, NOT-07 en PLAYER A, "Marcar leído" persistente, corrección con revisión 2 y audiencia inmutable, archivado con metadatos conservados, y denegación para identidades sin permiso. Antes de C1: DRAFT sin audiencia fallaba y no existía affordance de edición (T05-QA-001/002).

## J02 — DIRECT / GROUP (3 navegadores)
DIRECT A→B y B→A devuelve el mismo `conversationId`; GROUP con título y mínimo contractual (creador + participantes); archivado; acciones prohibidas no presentes.

## J03 — TEAM y EVENT (3 navegadores)
TEAM y **EVENT** abiertos desde UI por COACH, con contexto y composer reales. PLAYER de otro equipo, PLAYER no target y ADMIN sin participación: sin composer (DENY en servidor).

## J04 — Messaging (3 navegadores)
Envío A→B con persistencia; B ve badge antes de abrir el thread; tras vista autorizada su cursor avanza y su mensaje propio no genera badge (C19); A ve badge por mensaje ajeno; recarga y recuperación; paginación real con 25 mensajes y control "Cargar anteriores".

## J05 — Hub, roles y responsive (3 navegadores)
Navegación real, tabs, listas, orden `lastActivityAt DESC`, indicadores unread, estados vacíos/carga, ADMIN sin acceso universal, notificaciones y mark-read. Viewports **reales** verificados con `window.innerWidth`: 390, 768 y 1440 px (evidencia: `J05-hub-390.png`, `J05-hub-768.png`, `J05-hub-1440.png`).

## Resultado V1
`15/15 PASS` (5 recorridos × 3 navegadores) — `logs/v1-e2e-final.log`.
J01 aislado por motor: `logs/v1-j01-final.log` (3/3). Firefox J04 aislado: `logs/qa-j04-firefox-clean.log`.

## Console / requests
Sin errores de consola no esperados en los flujos finales. El 401 inicial de `/api/me` en `/login` es el estado anónimo esperado.
