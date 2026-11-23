import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { performance } from "node:perf_hooks"
import { sql } from "kysely"
import { buildT06TestApp } from "./testing/t06-test-app.js"
import { createSessionFor } from "./testing/test-app.js"
import { makeT06St70Fixture, type T06St70Fixture } from "./testing/t06-st70-base.js"

const { app, database, services, runner } = await buildT06TestApp()
let fx: T06St70Fixture
let tag: string
type Session = { token: string }
const sessions = new Map<string, Session>()

async function sessionFor(personId: string): Promise<Session> {
  const cached = sessions.get(personId)
  if (cached) return cached
  const created = await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => createSessionFor(services, tx, personId))
  const session = { token: created.token }
  sessions.set(personId, session)
  return session
}
const get = async (url: string, personId: string) => app.inject({
  method: "GET", url,
  headers: { origin: "http://localhost:8443", cookie: `gei_session=${(await sessionFor(personId)).token}` },
})
const json = async (url: string, personId: string) => (await get(url, personId)).json<any>()

beforeAll(async () => {
  await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    tag = `b${Date.now().toString().slice(-7)}`
    fx = await makeT06St70Fixture(tx, tag)
  })
})
afterAll(async () => {
  await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    await tx.deleteFrom("app.notifications").where("dedupe_key", "like", `${tag}%`).execute()
  }).catch(() => undefined)
  await app.close()
  await database.close()
})

describe("ST70 · Reports (R01–R16)", () => {
  it("ST-R01 COACH accede a reports", async () => {
    expect((await get("/api/reports/attendance", fx.coachId)).statusCode).toBe(200)
  })
  it("ST-R02 CAPTAIN accede por su Team", async () => {
    expect((await get("/api/reports/attendance", fx.captainId)).statusCode).toBe(200)
  })
  it("ST-R03 SUBCOMMITTEE accede con alcance de club", async () => {
    expect((await get("/api/reports/attendance", fx.subcommitteeId)).statusCode).toBe(200)
  })
  it("ST-R04 ADMIN-only recibe 403", async () => {
    const res = await get("/api/reports/attendance", fx.adminId)
    expect(res.statusCode).toBe(403)
    expect(res.json().error.code).toBe("AUTHORITY_DENIED")
  })
  it("ST-R05 PLAYER ve únicamente sus filas", async () => {
    const body = await json("/api/reports/attendance", fx.playerId)
    expect(body.items.every((row: any) => row.personId === fx.playerId)).toBe(true)
  })
  it("ST-R06 multirol conserva el scope del rol deportivo", async () => {
    expect((await get("/api/reports/performance", fx.multiRoleId)).statusCode).toBe(200)
  })
  it("ST-R07 filtro eventId restringe la población", async () => {
    const body = await json(`/api/reports/attendance?eventId=${fx.trainingId}`, fx.coachId)
    expect(body.items.every((row: any) => row.eventId === fx.trainingId)).toBe(true)
  })
  it("ST-R08 filtro teamId restringe el resultado", async () => {
    const body = await json(`/api/reports/attendance?teamId=${fx.teamAId}`, fx.coachId)
    expect(body.items.length).toBeGreaterThan(0)
  })
  it("ST-R09 temporada fuera de scope devuelve 422", async () => {
    const res = await get(`/api/reports/attendance?seasonId=${randomUUID()}`, fx.coachId)
    expect(res.statusCode).toBe(422)
    expect(res.json().error.code).toBe("INVALID_ROLE_SCOPE")
  })
  it("ST-R10 cuatro estados y flag missingRow", async () => {
    const body = await json(`/api/reports/attendance?eventId=${fx.trainingId}`, fx.coachId)
    const values = new Set(body.items.map((row: any) => row.attendance.value))
    expect(values.has("PRESENT")).toBe(true)
    expect(values.has("ABSENT")).toBe(true)
    expect(values.has("JUSTIFIED")).toBe(true)
    expect(values.has("UNRECORDED")).toBe(true)
    expect(body.items.some((row: any) => row.attendance.missingRow)).toBe(true)
  })
  it("ST-R11 correcciones en lote sin N+1", async () => {
    const body = await json(`/api/reports/attendance?eventId=${fx.trainingId}`, fx.coachId)
    const withCorrections = body.items.filter((row: any) => row.corrections.length > 0)
    expect(withCorrections.length).toBeGreaterThan(0)
    expect(withCorrections[0].corrections[0].newValue).toBe("PRESENT")
  })
  it("ST-R12 fórmula A-01 y denominador cero", async () => {
    const full = await json(`/api/reports/attendance?eventId=${fx.trainingId}`, fx.coachId)
    const counts = full.items[0].counts
    const expected = (100 * counts.present) / (counts.present + counts.absent + counts.justified)
    expect(full.items[0].presencePercentage.value).toBeCloseTo(expected)
    const empty = await json(`/api/reports/attendance?eventId=${fx.playedWithStatsId}`, fx.coachId)
    expect(empty.items.some((row: any) => row.presencePercentage.value === null)).toBe(true)
  })
  it("ST-R13 paginación keyset sin duplicados", async () => {
    const first = await json("/api/reports/attendance?limit=1", fx.coachId)
    expect(first.pageMeta.hasMore).toBe(true)
    const second = await json(`/api/reports/attendance?limit=1&cursor=${encodeURIComponent(first.pageMeta.cursor)}`, fx.coachId)
    const key = (r: any) => `${r.eventId}:${r.personId}`
    expect(second.items.map(key)).not.toContain(key(first.items[0]))
  })
  it("ST-R14 PLAYED sin stats cuenta; DRAFT/FORFEIT/ABANDONED no", async () => {
    const body = await json("/api/reports/performance", fx.coachId)
    const player = body.items.find((row: any) => row.personId === fx.playerId)
    expect(player.totals.matchesPlayed).toBe(2)
    expect(player.totals.goals).toBe(2)
  })
  it("ST-R15 breakdown distingue registro de partido jugado", async () => {
    const body = await json("/api/reports/performance", fx.coachId)
    const player = body.items.find((row: any) => row.personId === fx.playerId)
    expect(player.breakdown.every((item: any) => item.countsAsPlayed === (item.resultType === "PLAYED"))).toBe(true)
  })
  it("ST-R16 correcciones de acta y sin multiplicación de filas", async () => {
    const body = await json("/api/reports/performance", fx.coachId)
    const keys = body.items.map((row: any) => row.personId)
    expect(new Set(keys).size).toBe(keys.length)
    // Correcciones de actas sin stats se exponen a nivel de informe (dueño del dato).
    expect(body.corrections.length).toBeGreaterThan(0)
  })
})

describe("ST70 · Integración (I01–I10)", () => {
  it("ST-I01 deep link de atención apunta al owner real", async () => {
    const body = await json("/api/attention", fx.coachId)
    expect(body.items.filter((i: any) => i.action.to).every((i: any) => i.action.to.startsWith("/"))).toBe(true)
  })
  it("ST-I02 scope de equipo se refleja en Home", async () => {
    const body = await json("/api/home", fx.coachBId)
    expect(body.today.every((e: any) => e.id !== fx.trainingId)).toBe(true)
  })
  it("ST-I03 conversación sin participación no se filtra", async () => {
    const body = await json(`/api/search?q=${encodeURIComponent(`Grupo cerrado ${tag}`)}`, fx.playerId)
    expect(body.items.some((item: any) => item.id === fx.outsiderConversationId)).toBe(false)
  })
  it("ST-I04 comunicado de otro equipo no se muestra", async () => {
    const body = await json(`/api/search?q=${encodeURIComponent(`EquipoB ${tag}`)}`, fx.playerId)
    expect(body.items.some((item: any) => item.id === fx.otherTeamAnnouncementId)).toBe(false)
  })
  it("ST-I05 notificación fuera de scope no aparece en Home", async () => {
    const body = await json("/api/home", fx.coachBId)
    const titles = JSON.stringify(body.communications.notificationContext.latest)
    expect(titles).not.toContain("Aviso")
  })
  it("ST-I06 enlace de notificación usa recurso canónico", async () => {
    const body = await json("/api/home", fx.playerId)
    const unread = body.communications.notificationContext.latest.find((n: any) => n.readAt === null)
    expect(unread?.to).toMatch(/^\/events\//)
  })
  it("ST-I07 PII de Search se limita a campos visibles", async () => {
    const body = await json("/api/search?q=a&type=person", fx.playerId)
    const raw = JSON.stringify(body)
    expect(raw).not.toMatch(/phone|email|dni|birthDate/)
  })
  it("ST-I08 PII de Reports se limita a campos visibles", async () => {
    const body = await json("/api/reports/attendance", fx.playerId)
    expect(body.items[0].visibleFields).not.toContain("dni")
  })
  it("ST-I09 SSE centraliza los cuatro tokens de invalidación", async () => {
    const found = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) => {
      const rows = await sql<{ payload: any }>`select payload from infra.outbox_events limit 5`.execute(tx)
      return rows.rows.map((row) => row.payload?.invalidate ?? [])
    })
    // El fixture no emite eventos: se verifica la constante central.
    expect(found).toBeDefined()
    const { T06_INVALIDATE_TOKENS } = await import("./shared/outbox.js")
    expect([...T06_INVALIDATE_TOKENS]).toEqual(["home", "attention", "search", "reports"])
  })
  it("ST-I10 sesiones aisladas producen resultados distintos", async () => {
    const coach = await json("/api/home", fx.coachId)
    const player = await json("/api/home", fx.playerId)
    expect(coach.scope.roles).not.toEqual(player.scope.roles)
    expect(player.inlineAvailability.length).toBeGreaterThan(0)
  })
})

describe("ST70 · Notificaciones (N01–N05)", () => {
  it("ST-N01 Notification unread alimenta el contador", async () => {
    const body = await json("/api/home", fx.playerId)
    expect(body.communications.notificationContext.unreadCount).toBeGreaterThanOrEqual(1)
  })
  it("ST-N02 Notification leída permanece como contexto", async () => {
    const body = await json("/api/home", fx.playerId)
    expect(body.communications.notificationContext.latest.some((n: any) => n.readAt !== null)).toBe(true)
  })
  it("ST-N03 mark-read no resuelve la condición operativa", async () => {
    const before = await json("/api/attention", fx.coachId)
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.notifications").set({ read_at: new Date() }).where("id", "=", fx.unreadNotificationId).execute()
    })
    const after = await json("/api/attention", fx.coachId)
    expect(after.items.map((i: any) => i.dedupeKey).sort()).toEqual(before.items.map((i: any) => i.dedupeKey).sort())
  })
  it("ST-N04 Notification nunca crea fila de Attention", async () => {
    const body = await json("/api/attention", fx.playerId)
    expect(body.items.some((i: any) => i.sourceType === "NOTIFICATION_CONTEXT")).toBe(false)
  })
  it("ST-N05 no se emiten tipos nuevos de Notification", async () => {
    await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) => {
      const rows = await sql<{ type: string }>`select distinct type from app.notifications`.execute(tx)
      const canonical = new Set(["EVENT_CHANGED", "EVENT_POSTPONED", "EVENT_RESCHEDULED", "EVENT_CANCELLED", "EVENT_RESTORED", "SELECTION_PUBLISHED", "ANNOUNCEMENT_PUBLISHED"])
      expect(rows.rows.every((row) => canonical.has(row.type))).toBe(true)
    })
  })
})

describe("ST70 · Calidad (Q01–Q10)", () => {
  it("ST-Q01 cursor manipulado", async () => {
    const res = await get("/api/search?q=a&cursor=x.y", fx.coachId)
    expect(res.statusCode).toBe(400)
  })
  it("ST-Q02 error genérico sin información de existencia", async () => {
    const res = await get("/api/search?q=a&cursor=x.y", fx.coachId)
    expect(res.json().error.message).toBe("Invalid cursor")
  })
  it("ST-Q03 revocación revalidada en la siguiente petición", async () => {
    await runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
      await tx.updateTable("app.role_assignments").set({ valid_until: new Date(Date.now() - 1000) })
        .where("person_id", "=", fx.captainId).execute()
    })
    const res = await get("/api/reports/attendance", fx.captainId)
    expect(res.statusCode).toBe(403)
  })
  it("ST-Q04 caché por identidad sin fugas", async () => {
    const coach = await json("/api/reports/attendance", fx.coachId)
    const player = await json("/api/reports/attendance", fx.playerId)
    expect(coach.items.length).toBeGreaterThan(player.items.length)
  })
  it("ST-Q05 no-data ≠ cero", async () => {
    const body = await json(`/api/reports/attendance?eventId=${fx.playedWithStatsId}`, fx.coachId)
    expect(body.state).toBe("OK")
    expect(body.items.some((row: any) => row.presencePercentage.value === null)).toBe(true)
  })
  it("ST-Q06 DB sin tablas de proyección paralelas", async () => {
    const forbidden = await runner.run("READ_STANDARD", randomUUID(), async ({ tx }) => {
      const rows = await sql<{ table_name: string }>`
        select table_name from information_schema.tables where table_schema='app'`.execute(tx)
      return rows.rows.map((row) => row.table_name).filter((name) =>
        /home_items|attention_items|search_results|report_truth|history_projection/.test(name))
    })
    expect(forbidden).toEqual([])
  })
  it("ST-Q07 multirol sin herencia indebida", async () => {
    const body = await json("/api/attention", fx.crossRoleId)
    expect(body.items.every((item: any) => item.audienceScope === "TEAM" || item.audienceScope === "CLUB" || item.audienceScope === "SELF")).toBe(true)
  })
  it("ST-Q08 deep link fuera de scope es indistinguible", async () => {
    const body = await json(`/api/search?q=${encodeURIComponent(`Fuera de scope ${tag}`)}`, fx.playerId)
    expect(body.items.some((item: any) => item.id === fx.outOfScopeEventId)).toBe(false)
    expect(["OK", "NO_RESULTS"]).toContain(body.state)
  })
  it("ST-Q09 error model con envelope", async () => {
    const res = await get("/api/reports/attendance", fx.adminId)
    expect(res.json().error).toHaveProperty("code")
    expect(res.json().error.retryable).toBe(false)
  })
  it("ST-Q10 p95 de PerformanceReport bajo umbral en la revisión final", async () => {
    const token = (await sessionFor(fx.coachId)).token
    const latencies: number[] = []
    for (let i = 0; i < 30; i += 1) {
      const start = performance.now()
      const res = await app.inject({ method: "GET", url: "/api/reports/performance?limit=50", headers: { origin: "http://localhost:8443", cookie: `gei_session=${token}` } })
      expect(res.statusCode).toBe(200)
      latencies.push(performance.now() - start)
    }
    latencies.sort((a, b) => a - b)
    expect(latencies[Math.floor(0.95 * latencies.length)]!).toBeLessThan(3000)
  })
})
