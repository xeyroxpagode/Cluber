# GEI T05 R3 — Registro de correctivos (Actor C)

| ID | Fase | Hallazgo | Causa raíz | Corrección | Revalidación |
|----|------|----------|-----------|------------|--------------|
| C1 | I1 | `EDITED→DELETED` violaba `ck_messages__edited` (exigía `edited_at IS NULL`). | Redacción literal del constraint §4.1 contradictoria con C09/SM-MESSAGE-01. | Permitir `edited_at` en `DELETED`; no se eliminó el constraint. | `m8.integration.test.ts` verifica `edited_at` conservado. |
| C2 | I2 | `source: "communication"` violaba `ck_audit_entries__source`. | Constraint M2 no reproducido en el contrato T05. | Usar operationId `CMD-COM-0X` como source. | Integración + API T05. |
| C3 | I2 | `touchConversationReadCursor` en `READ_STANDARD` (read-only). | Perfil transaccional incorrecto en RC-07. | RC-07 usa `COMMAND_STANDARD`. | Test C19 + API thread. |
| C4 | I2 | `createSessionFor` duplicaba cuenta por persona entre tests. | Diseño del fixture API (una cuenta por persona). | Caché de sesiones por `personId`. | 6/6 API T05. |
| C5 | I2 | Test T04 "no future tables" falló con M8. | Aserción de baseline incompatible con tablas autorizadas. | Lista esperada 31→36 tablas; sin relajar grants. | 105/105 integration. |
| C6 | I3 | Aserción `/Llegan con la T05/` del placeholder. | Test obsoleto tras implementar R21. | Verificar tabs + CTA reales. | 102/102 frontend. |
| C7 | I3 | `scrollIntoView` no existe en jsdom. | API de navegador no implementada en test environment. | Guard `typeof === "function"`. | 6/6 componentes. |
| C8 | I4 | R22 sin candidatos en app real (endpoint admin-only). | `/api/management/people` requiere ADMIN. | Nuevo `GET /api/communication/candidates` filtrado por autoridad; R22/R23 lo usan. | E2E J02/J03. |
| C9 | I4 | UI nunca detectaba SUBCOMMITTEE. | `session-context.tsx` dejaba `authority.roles: []`. | Exponer `roles` desde `roleAssignments` e `isSubcommittee` desde `/api/me`. | E2E J01. |
| C10 | I4 | Selectores E2E sobre radios `sr-only`. | Design System oculta inputs visualmente. | `check({force:true})`, botones para `SegmentedControl`, regex de UUID en `waitForURL`. | 7/7 E2E. |
| C11 | I5 | Equipo inexistente en audiencia → FK/500. | Falta validación semántica pre-insert. | `assertTeamsExist` → `INVALID_TEAM` (not_found). | 15/15 stress. |
| C12 | I5 | Test de reingreso con intervalo solapado. | Setup con participante activo creado por sync. | Cerrar intervalo con fecha válida y usar fechas futuras relativas. | 15/15 stress. |

**Decisiones de producto NO modificadas.** Todos los correctivos son de implementación, integración o pruebas. No se relajaron permisos ni constraints de integridad (salvo la corrección C1, que hace ejecutable la transición ya autorizada por C09).
