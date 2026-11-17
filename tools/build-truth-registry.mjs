import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const OUT = path.resolve(ROOT, "evidence/t05-truth-acceptance/registry")
fs.mkdirSync(OUT, { recursive: true })

const F = {
  stress: "backend/src/communication/t05-stress.test.ts",
  integ: "backend/src/communication/t05.integration.test.ts",
  api: "backend/src/communication/t05.api.test.ts",
  m8: "backend/src/communication/m8.integration.test.ts",
  gaps: "backend/src/communication/t05-truth-gaps.test.ts",
  e2e1: "tests/e2e/t05-qa-j01.spec.ts",
  e2e2: "tests/e2e/t05-qa-audit.spec.ts",
  recovery: "tests/e2e/t05-journeys.spec.ts",
  d16: "tests/e2e/t05-st-d16.spec.ts",
  front: "src/__tests__/t05-components.test.tsx",
  found: "backend/src/foundation.integration.test.ts",
}

const cache = new Map()
function source(file) {
  if (!cache.has(file)) cache.set(file, fs.readFileSync(path.resolve(ROOT, file), "utf8"))
  return cache.get(file)
}
function assertionFor(file, pattern) {
  const src = source(file)
  const lines = src.split("\n")
  const start = lines.findIndex((l) => (l.includes('it(') || l.includes('test(')) && l.includes(pattern))
  if (start < 0) return undefined
  for (let i = start; i < Math.min(start + 120, lines.length); i++) {
    const line = lines[i]
    if (line.includes("expect(") && !line.trim().startsWith("//")) return line.trim().slice(0, 240)
  }
  return undefined
}
function crit(id, file, pattern, extra = {}) {
  const c = { id, testIdPatterns: [pattern], file, requireAssertion: true }
  const a = assertionFor(file, pattern)
  if (a) c.assertionRefs = [a]
  return { ...c, ...extra }
}
function S(id, expected, criteria) {
  return { contractSource: `04_T05_STRESS_TEST_80_V2.md#${id}`, expected, criteria: criteria.filter(Boolean) }
}
function A(id, criteria) {
  return { contractSource: `05_T05_ACCEPTANCE_30_V2.md#AC-${String(id).padStart(2, "0")}`, expected: "criterios contractuales", criteria: criteria.filter(Boolean) }
}

const ST = {
  "ST-A01": S("A01", "DRAFT real, Audit YES", [crit("draft", F.integ, "CC-T05-C10: crea y actualiza DRAFT")]),
  "ST-A02": S("A02", "DRAFT incompleto rechazado, sin escritura parcial", [crit("valid", F.stress, "ST-A02/A11")]),
  "ST-A03": S("A03", "Publicar sin SUBCOMMITTEE denegado", [crit("deny", F.integ, "rechaza audiencia inválida y actores sin autoridad")]),
  "ST-A04": S("A04", "Club-wide explícito", [crit("club", F.e2e1, "J01", { browser: "chromium" })]),
  "ST-A05": S("A05", "Audiencia por Team válida", [crit("team", F.integ, "publica con NOT-07 deduplicada")]),
  "ST-A06": S("A06", "TeamSet sin strings libres", [crit("teamset", F.m8, "audiencia única por announcement")]),
  "ST-A07": S("A07", "Audiencia inexistente rechazada", [crit("invalid", F.stress, "ST-A07/A12")]),
  "ST-A08": S("A08", "Publicación concurrente: un único hecho", [crit("race", F.stress, "ST-A08/A09")]),
  "ST-A09": S("A09", "Retry publish sin NOT-07 duplicada", [crit("retry", F.api, "CMD-COM-01/02")]),
  "ST-A10": S("A10", "Falla NotificationWriter sin publicación incoherente", [crit("fault", F.gaps, "ST-A10")]),
  "ST-A11": S("A11", "Corrección revision++ y Audit sin NOT", [crit("correct", F.api, "CMD-COM-03/04")]),
  "ST-A12": S("A12", "Corrección de audiencia publicada rechazada", [crit("immutable", F.stress, "ST-A07/A12")]),
  "ST-A13": S("A13", "ARCHIVED conserva publishedAt y audiencia", [crit("archive", F.stress, "ST-A13/A14")]),
  "ST-A14": S("A14", "Edición de ARCHIVED rechazada", [crit("archive-deny", F.stress, "ST-A13/A14")]),
  "ST-A15": S("A15", "URL directa fuera de audiencia → DENY", [crit("idor", F.api, "RC-19: audiencia")]),
  "ST-A16": S("A16", "Snapshot no cambia; lectura reconcilia", [crit("snapshot", F.gaps, "ST-A16")]),
  "ST-B01": S("B01", "DIRECT A-B canónica", [crit("direct", F.integ, "CMD-COM-05 DIRECT")]),
  "ST-B02": S("B02", "DIRECT B-A misma ID", [crit("direct2", F.api, "CMD-COM-05/06/07")]),
  "ST-B03": S("B03", "Dos DIRECT concurrentes sin duplicado", [crit("race", F.gaps, "ST-B03")]),
  "ST-B04": S("B04", "DIRECT consigo mismo rechazado", [crit("self", F.integ, "CMD-COM-05 DIRECT")]),
  "ST-B05": S("B05", "GROUP mínimo con creador incluido", [crit("group", F.integ, "CMD-COM-06 GROUP")]),
  "ST-B06": S("B06", "GROUP título vacío rechazado", [crit("title", F.stress, "ST-B06/B07")]),
  "ST-B07": S("B07", "Participantes repetidos rechazados", [crit("dup", F.stress, "ST-B06/B07")]),
  "ST-B08": S("B08", "GROUP cross-división si autorizado", [crit("cross", F.gaps, "ST-B08")]),
  "ST-B09": S("B09", "TEAM canónica por Team", [crit("team", F.api, "CMD-COM-05/06/07")]),
  "ST-B10": S("B10", "EVENT canónica por Event", [crit("event", F.e2e2, "J03", { browser: "chromium", assertionRefs: ["expect(eventUrl).not.toBe(teamUrl)"] })]),
  "ST-B11": S("B11", "Aperturas TEAM concurrentes sin duplicados", [crit("race", F.stress, "ST-B11")]),
  "ST-B12": S("B12", "Crear contexto no da acceso a hilos", [crit("nouniversal", F.integ, "CMD-COM-07 TEAM canónica")]),
  "ST-B13": S("B13", "Archivar GROUP preserva historia", [crit("archive", F.integ, "CMD-COM-06 GROUP")]),
  "ST-B14": S("B14", "Archivar no-GROUP rechazado", [crit("nogroup", F.integ, "CMD-COM-06 GROUP")]),
  "ST-C01": S("C01", "Alta de participante con intervalo válido", [crit("join", F.integ, "CMD-COM-07 TEAM canónica")]),
  "ST-C02": S("C02", "Baja con leftAt válido", [crit("leave", F.integ, "revocación temporal", { assertionRefs: ['expectDenied(queries.conversationThread(tx, fx.playerId, teamConvId, later(7 * 60 * 60_000), {}), "NO_TEAM_CONVERSATION_AUTHORITY")'] })]),
  "ST-C03": S("C03", "Reingreso: nuevo período no solapado", [crit("rejoin", F.m8, "acepta salida y reingreso")]),
  "ST-C04": S("C04", "Historia anterior a joinedAt no legible", [crit("period", F.gaps, "ST-C04/C05")]),
  "ST-C05": S("C05", "Historia de período no autorizado no legible", [crit("period", F.gaps, "ST-C04/C05")]),
  "ST-C06": S("C06", "RoleAssignment revocado → DENY", [crit("revoke", F.integ, "revocación temporal", { assertionRefs: ['expectDenied(queries.conversationThread(tx, fx.playerId, teamConvId, later(7 * 60 * 60_000), {}), "NO_TEAM_CONVERSATION_AUTHORITY")'] })]),
  "ST-C07": S("C07", "Transferencia de Team actualiza acceso", [crit("transfer", F.gaps, "ST-C07")]),
  "ST-C08": S("C08", "Cambio Event targets sincroniza participantes", [crit("event", F.gaps, "ST-C08")]),
  "ST-C09": S("C09", "Proyección obsoleta no concede acceso", [crit("recheck", F.integ, "revocación temporal", { assertionRefs: ['expectDenied(queries.conversationThread(tx, fx.playerId, teamConvId, later(7 * 60 * 60_000), {}), "NO_TEAM_CONVERSATION_AUTHORITY")'] })]),
  "ST-C10": S("C10", "Ex-participante no puede enviar", [crit("ex", F.gaps, "ST-C10")]),
  "ST-C11": S("C11", "Dos sync simultáneos: integridad de períodos", [crit("sync", F.gaps, "ST-C11")]),
  "ST-C12": S("C12", "Historia de ex-participante según período", [crit("history", F.stress, "ST-C03/C12")]),
  "ST-D01": S("D01", "Envío autorizado → SENT", [crit("send", F.integ, "CMD-COM-09 no crea Audit")]),
  "ST-D02": S("D02", "No participante → DENY", [crit("deny", F.api, "CMD-COM-09..11")]),
  "ST-D03": S("D03", "Body vacío rechazado", [crit("body", F.stress, "ST-D03/D11")]),
  "ST-D04": S("D04", "Retry idempotente sin duplicación", [crit("retry", F.api, "CMD-COM-09..11")]),
  "ST-D05": S("D05", "Respuesta perdida tras commit sin duplicar", [crit("lost", F.api, "CMD-COM-09..11")]),
  "ST-D06": S("D06", "Autor edita SENT → EDITED", [crit("edit", F.api, "CMD-COM-09..11")]),
  "ST-D07": S("D07", "No autor editar → DENY", [crit("notauthor", F.stress, "ST-D07/D10")]),
  "ST-D08": S("D08", "Autor elimina SENT → tombstone", [crit("del", F.integ, "CMD-COM-09 no crea Audit")]),
  "ST-D09": S("D09", "Autor elimina EDITED → tombstone", [crit("del2", F.m8, "persiste SENT → EDITED → DELETED")]),
  "ST-D10": S("D10", "No autor eliminar → DENY", [crit("notauthor", F.stress, "ST-D07/D10")]),
  "ST-D11": S("D11", "Eliminar sin motivo rechazado", [crit("reason", F.stress, "ST-D03/D11")]),
  "ST-D12": S("D12", "Editar DELETED rechazado", [crit("deleted", F.integ, "CMD-COM-09 no crea Audit")]),
  "ST-D13": S("D13", "Eliminar dos veces sin cambio inconsistente", [crit("twice", F.integ, "CMD-COM-09 no crea Audit")]),
  "ST-D14": S("D14", "Tombstone DTO sin body", [crit("dto", F.api, "CMD-COM-09..11")]),
  "ST-D15": S("D15", "Sin MESSAGE_RECEIVED", [crit("notif", F.stress, "ST-D15")]),
  "ST-D16": S("D16", "UI Sending/Sent/Failed sin estados falsos", [
    crit("sending", F.d16, "Caso A", { assertionRefs: ["expect(page.getByText('Enviando…')).toBeVisible({ timeout: 5000 })"] }),
    crit("sent", F.d16, "Caso A", { assertionRefs: ["expect(page.getByText(body)).toHaveCount(1, { timeout: 15000 })"] }),
    crit("failed", F.d16, "Caso B", { assertionRefs: ["expect(persisted.rows[0].n).toBe(0)"] }),
    crit("retry", F.d16, "Caso B", { assertionRefs: ["expect(page.getByText(body)).toHaveCount(1, { timeout: 15000 })"] }),
  ]),
  "ST-E01": S("E01", "ConversationList sólo autorizadas", [crit("list", F.integ, "CC-T05-C19: unreadCount")]),
  "ST-E02": S("E02", "Thread por ID ajeno → DENY", [crit("deny", F.stress, "ST-E02/E10")]),
  "ST-E03": S("E03", "Orden determinista con igual sentAt", [crit("order", F.stress, "ST-E03/E04")]),
  "ST-E04": S("E04", "lastActivityAt DESC", [crit("order", F.stress, "ST-E03/E04")]),
  "ST-E05": S("E05", "unreadCount vs lastReadAt", [crit("unread", F.integ, "CC-T05-C19: unreadCount")]),
  "ST-E06": S("E06", "DELETED excluido de unreadCount", [crit("deleted", F.gaps, "ST-E06")]),
  "ST-E07": S("E07", "C19: propios excluidos, intercalados", [crit("c19", F.integ, "CC-T05-C19: unreadCount")]),
  "ST-E08": S("E08", "Notification.readAt por destinatario", [crit("read", F.e2e1, "J01", { browser: "chromium" })]),
  "ST-E09": S("E09", "NOT-07 en NotificationList", [crit("not07", F.e2e1, "J01", { browser: "chromium" })]),
  "ST-E10": S("E10", "Message.body redactado en Audit.diff", [crit("audit", F.stress, "ST-E02/E10")]),
  "ST-E11": S("E11", "Message.body no filtrado en logs", [crit("scan", F.gaps, "ST-E11/F10")]),
  "ST-E12": S("E12", "Realtime sin body", [crit("realtime", F.stress, "ST-E12")]),
  "ST-F01": S("F01", "M8 limpia con constraints", [crit("m8", F.m8, "crea las 5 tablas")]),
  "ST-F02": S("F02", "Reinicio: datos persisten", [crit("persist", F.gaps, "ST-F02")]),
  "ST-F03": S("F03", "Dos sesiones browser reales", [crit("multi", F.e2e2, "J02", { browser: "chromium", assertionRefs: ["await expect(pb.getByText(/1 sin leer/)).toBeVisible({ timeout: 15000 })"] })]),
  "ST-F04": S("F04", "GROUP ≥3 en UI", [crit("group3", F.e2e2, "J02", { browser: "chromium", assertionRefs: ["await expect(pa.getByText('Grupo QA J02')).toBeVisible()"] })]),
  "ST-F05": S("F05", "R21–R26 en 390/768/1440", [
    crit("vp", F.e2e2, "J05", { browser: "chromium", assertionRefs: ["expect(measured).toBe(width)"] }),
    crit("vp2", F.e2e2, "J05", { browser: "firefox", assertionRefs: ["expect(measured).toBe(width)"] }),
    crit("vp3", F.e2e2, "J05", { browser: "msedge", assertionRefs: ["expect(measured).toBe(width)"] }),
  ]),
  "ST-F06": S("F06", "Composer móvil usable", [crit("composer", F.front, "R26: thread real")]),
  "ST-F07": S("F07", "Caída realtime → refetch", [crit("recovery", F.recovery, "J05b", { assertionRefs: ["await expect(page.getByText(/Falló el envío|No se pudo enviar/)).toBeVisible({ timeout: 20_000 })"] })]),
  "ST-F08": S("F08", "Falla API sin éxito falso", [crit("recovery", F.recovery, "J05b", { assertionRefs: ["await expect(page.getByText(/Falló el envío|No se pudo enviar/)).toBeVisible({ timeout: 20_000 })"] })]),
  "ST-F09": S("F09", "Regresión T01–T04 sin fallos", [crit("baseline", F.found, "M0 and PostgreSQL semantics", { assertionRefs: ["expect(unexpected).toEqual([])"] })]),
  "ST-F10": S("F10", "Sin Guardian/Eligibility/CompetitionEntry", [crit("scan", F.gaps, "ST-E11/F10")]),
  "ST-A01-UPDATE": S("A01-UPDATE", "UPDATE DRAFT con versión (CC-T05-C10)", [crit("update", F.integ, "CC-T05-C10: crea y actualiza DRAFT")]),
}

const AC = {
  1: A(1, [crit("baseline", F.found, "M0 and PostgreSQL semantics", { assertionRefs: ["expect(unexpected).toEqual([])"] })]),
  2: A(2, [crit("scan", F.gaps, "AC-22")]),
  3: A(3, [crit("m8", F.m8, "crea las 5 tablas")]),
  4: A(4, [crit("draft", F.integ, "CC-T05-C10: crea y actualiza DRAFT"), crit("e2e", F.e2e1, "J01", { browser: "chromium" })]),
  5: A(5, [crit("aud", F.api, "CMD-COM-01/02")]),
  6: A(6, [crit("race", F.stress, "ST-A08/A09")]),
  7: A(7, [crit("not07", F.stress, "ST-A10")]),
  8: A(8, [crit("idor", F.api, "RC-19: audiencia")]),
  9: A(9, [crit("read", F.e2e1, "J01", { browser: "chromium" })]),
  10: A(10, [crit("correct", F.api, "CMD-COM-03/04")]),
  11: A(11, [crit("archive", F.stress, "ST-A13/A14")]),
  12: A(12, [crit("direct", F.api, "CMD-COM-05/06/07")]),
  13: A(13, [crit("group", F.integ, "CMD-COM-06 GROUP")]),
  14: A(14, [crit("team", F.api, "CMD-COM-05/06/07"), crit("event", F.e2e2, "J03", { browser: "chromium", assertionRefs: ["expect(eventUrl).not.toBe(teamUrl)"] })]),
  15: A(15, [crit("rejoin", F.m8, "acepta salida y reingreso")]),
  16: A(16, [crit("revoke", F.integ, "revocación temporal", { assertionRefs: ['expectDenied(queries.conversationThread(tx, fx.playerId, teamConvId, later(7 * 60 * 60_000), {}), "NO_TEAM_CONVERSATION_AUTHORITY")'] })]),
  17: A(17, [crit("deny", F.stress, "ST-E02/E10")]),
  18: A(18, [crit("states", F.integ, "CMD-COM-09 no crea Audit")]),
  19: A(19, [crit("author", F.stress, "ST-D07/D10")]),
  20: A(20, [crit("tomb", F.api, "CMD-COM-09..11")]),
  21: A(21, [crit("retry", F.api, "CMD-COM-09..11")]),
  22: A(22, [crit("scan", F.gaps, "AC-22")]),
  23: A(23, [crit("scan", F.gaps, "ST-E11/F10"), crit("audit", F.stress, "ST-E02/E10")]),
  24: A(24, [crit("c19", F.integ, "CC-T05-C19: unreadCount"), crit("order", F.stress, "ST-E03/E04")]),
  25: A(25, [crit("page", F.integ, "RC-07 paginación estable")]),
  26: A(26, [crit("recovery", F.recovery, "J05b", { assertionRefs: ["await expect(page.getByText(/Falló el envío|No se pudo enviar/)).toBeVisible({ timeout: 20_000 })"] })]),
  27: A(27, [crit("e2e", F.e2e1, "J01", { browser: "chromium" })]),
  28: A(28, [
    crit("vp", F.e2e2, "J05", { browser: "chromium", assertionRefs: ["expect(measured).toBe(width)"] }),
    crit("vp2", F.e2e2, "J05", { browser: "firefox", assertionRefs: ["expect(measured).toBe(width)"] }),
    crit("vp3", F.e2e2, "J05", { browser: "msedge", assertionRefs: ["expect(measured).toBe(width)"] }),
  ]),
  29: A(29, [crit("multi", F.e2e2, "J02", { browser: "chromium", assertionRefs: ["await expect(pb.getByText(/1 sin leer/)).toBeVisible({ timeout: 15000 })"] })]),
  30: A(30, []),
}

const registry = { stress: ST, acceptance: { ...AC } }
fs.writeFileSync(path.join(OUT, "scenarios.json"), JSON.stringify(registry, null, 2) + "\n")
console.log(`registry: ST=${Object.keys(ST).length} (80+1), AC=${Object.keys(AC).length}`)
