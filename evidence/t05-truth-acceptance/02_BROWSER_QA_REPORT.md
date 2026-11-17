# 02 — Browser QA Report (T1 / T7)

runId: `TRUTH-20261117-181500-fbcb6b76` · codeRevision: `fbcb6b76...`

| Recorrido | Chromium | Firefox | Edge | Evidencia |
|---|---|---|---|---|
| J01 Announcements (DRAFT sin audiencia → recuperar → editar → publicar → NOT-07 → corregir → archivar) | PASS | PASS | PASS | `runs/<runId>/e2e-browser.xml`, screenshots |
| J02 DIRECT A↔B y GROUP mínimo | PASS | PASS | PASS | idem |
| J03 TEAM **y EVENT**, con denegaciones | PASS | PASS | PASS | idem |
| J04 Envío, unread C19, paginación con 25 mensajes | PASS (retry aislado) | PASS | PASS (retry aislado) | idem + retry XML |
| J05 Hub, tabs, roles, responsive | PASS | PASS | PASS | idem + `RUN-hub-390/768/1440.png` |

Nota: en la ejecución conjunta, J04/Edge y J02 del spec de recuperación fallaron por estado compartido entre motores; re-ejecutados de forma aislada, J04/Edge PASS. J02 del spec antiguo conserva un defecto de fixture (checkbox ya marcado) documentado en `03_FINDINGS_AND_CORRECTIVES.md`.

## Viewports reales
Verificados con `window.innerWidth` dentro del navegador: **390**, **768**, **1440** (`J05` en los tres motores). Capturas del run: `screenshots/RUN-hub-390.png`, `RUN-hub-768.png`, `RUN-hub-comunicados-1440.png`.

## R21–R26
Cubiertas por los cinco recorridos + tests de componentes (`frontend.xml`): Hub (R21), New Conversation (R22), Announcement Form (R23/R25), Announcement Detail (R24), Conversation (R26), Notificaciones (RC-18). Sin mocks en la fuente funcional.

## Roles
SUBCOMMITTEE, COACH, PLAYER A/B/C y ADMIN con sesiones reales. ADMIN sin composer en hilos privados (J03).
