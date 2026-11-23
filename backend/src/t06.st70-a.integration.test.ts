import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { randomUUID } from "node:crypto"
import { deriveCsrfToken } from "./shared/crypto.js"
import { buildT06TestApp } from "./testing/t06-test-app.js"
import { createSessionFor } from "./testing/test-app.js"
import { makeT06St70Fixture, type T06St70Fixture } from "./testing/t06-st70-base.js"

const CSRF_SECRET = Buffer.alloc(32, 7)
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
  // CSRF se deriva aquí para sesión coherente (aunque GET no lo requiere).
  void deriveCsrfToken(CSRF_SECRET, created.id)
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
    tag = `s${Date.now().toString().slice(-7)}`
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

const ROLES = ["AVAILABILITY", "SELECTION_REVISION", "SELECTION_CONFLICT", "ATTENDANCE_SHEET", "MATCH_RECORD", "ANNOUNCEMENT", "EVENT_CHANGE", "NOTIFICATION_CONTEXT"] as const

describe("ST70 · Home (H01–H10)", () => {
  it("ST-H01 Home del COACH compone los cinco bloques", async () => {
    const body = await json("/api/home", fx.coachId)
    for (const key of ["attention", "today", "inlineAvailability", "upcoming", "communications", "blocks", "scope"]) {
      expect(body, key).toHaveProperty(key)
    }
    expect(body.scope.roles).toContain("COACH")
  })

  it("ST-H02 Atención se recorta a tres filas", async () => {
    const body = await json("/api/home", fx.coachId)
    expect(body.attention.length).toBeLessThanOrEqual(3)
    expect(body.attentionTotal).toBeGreaterThanOrEqual(body.attention.length)
  })

  it("ST-H03 bloque Hoy usa el reloj de la transacción", async () => {
    const body = await json("/api/home", fx.coachId)
    expect(body.today.some((item: any) => item.id === fx.todayEventId)).toBe(true)
  })

  it("ST-H04 Hoy excluye eventos cancelados", async () => {
    const body = await json("/api/home", fx.coachId)
    expect(body.today.every((item: any) => item.state !== "CANCELLED")).toBe(true)
  })

  it("ST-H05 Próximamente incluye eventos futuros de scope", async () => {
    const body = await json("/api/home", fx.coachId)
    expect(body.upcoming.some((item: any) => item.id === fx.trainingId)).toBe(true)
  })

  it("ST-H06 ¿Vas? del PLAYER refleja su disponibilidad y reconfirmación", async () => {
    const body = await json("/api/home", fx.playerId)
    const item = body.inlineAvailability.find((row: any) => row.eventId === fx.trainingId)
    expect(item).toBeTruthy()
    expect(item.needsReconfirmation).toBe(true)
    expect(item.state).toBe("NEEDS_RECONFIRMATION")
  })

  it("ST-H07 Comunicaciones conserva contexto de notificaciones", async () => {
    const body = await json("/api/home", fx.playerId)
    expect(body.communications.notificationContext.unreadCount).toBeGreaterThanOrEqual(1)
    expect(body.communications.announcements.length).toBeGreaterThan(0)
    expect(body.communications.conversations.length).toBeGreaterThan(0)
  })

  it("ST-H08 ADMIN-only no obtiene filas de atención deportiva", async () => {
    const body = await json("/api/home", fx.adminId)
    expect(body.attention).toHaveLength(0)
    expect(body.scope.isAdmin).toBe(true)
  })

  it("ST-H09 multirol (PLAYER+COACH) uniona alcances sin herencia indebida", async () => {
    const body = await json("/api/home", fx.multiRoleId)
    expect(body.scope.roles).toEqual(expect.arrayContaining(["PLAYER", "COACH"]))
    // El recorte a 3 de Home puede desplazar la planilla: se verifica en el feed completo.
    const attention = await json("/api/attention", fx.multiRoleId)
    expect(attention.items.some((item: any) => item.sourceType === "ATTENDANCE_SHEET")).toBe(true)
  })

  it("ST-H10 SUBCOMMITTEE ve borradores de comunicados y no KPIs", async () => {
    const body = await json("/api/home", fx.subcommitteeId)
    expect(JSON.stringify(body)).not.toMatch(/"kpi|"metric/i)
    expect(body.communications.announcements.length).toBeGreaterThan(0)
  })
})

describe("ST70 · Attention (A01–A09)", () => {
  const sources = async (personId: string) => (await json("/api/attention?limit=200", personId)).items.map((item: any) => item.sourceType)

  it("ST-A01 Availability NEEDS_RECONFIRMATION aparece", async () => {
    expect(await sources(fx.coachId)).toContain("AVAILABILITY")
  })

  it("ST-A02 Availability sin respuesta aparece para la población esperada", async () => {
    const body = await json("/api/attention", fx.coachId)
    const keys = body.items.filter((i: any) => i.sourceType === "AVAILABILITY").map((i: any) => i.dedupeKey)
    expect(keys.some((key: string) => key.includes("none"))).toBe(true)
  })

  it("ST-A03 SelectionRevision DRAFT aparece", async () => {
    expect(await sources(fx.coachId)).toContain("SELECTION_REVISION")
  })

  it("ST-A04 conflicto de selección aparece con severidad HIGH", async () => {
    const body = await json("/api/attention", fx.coachId)
    const item = body.items.find((i: any) => i.sourceType === "SELECTION_CONFLICT")
    expect(item).toBeTruthy()
    expect(item.severity).toBe("HIGH")
  })

  it("ST-A05 planilla OPEN aparece con acción autorizada", async () => {
    const body = await json("/api/attention", fx.coachId)
    const item = body.items.find((i: any) => i.sourceType === "ATTENDANCE_SHEET")
    expect(item).toBeTruthy()
    expect(item.action.to).toMatch(/^\/events\//)
  })

  it("ST-A06 MatchRecord DRAFT aparece", async () => {
    expect(await sources(fx.coachId)).toContain("MATCH_RECORD")
  })

  it("ST-A07 Announcement DRAFT sólo para SUBCOMMITTEE", async () => {
    expect(await sources(fx.subcommitteeId)).toContain("ANNOUNCEMENT")
    expect(await sources(fx.playerId)).not.toContain("ANNOUNCEMENT")
  })

  it("ST-A08 Notification unread NO crea novena fuente", async () => {
    const all = await sources(fx.playerId)
    expect(all).not.toContain("NOTIFICATION_CONTEXT")
    expect(ROLES).toHaveLength(8)
  })

  it("ST-A09 orden deadline → severity → desempate y NULL al final", async () => {
    const items = (await json("/api/attention", fx.coachId)).items as any[]
    const weight = { HIGH: 3, MEDIUM: 2, LOW: 1 }
    for (let i = 1; i < items.length; i += 1) {
      const a = items[i - 1]!, b = items[i]!
      if (a.deadline !== b.deadline) {
        if (a.deadline === null) expect(b.deadline).toBeNull()
        else expect(a.deadline! <= b.deadline!).toBe(true)
      } else {
        expect(weight[a.severity as keyof typeof weight]).toBeGreaterThanOrEqual(weight[b.severity as keyof typeof weight])
      }
    }
  })
})

describe("ST70 · Search (S01–S10)", () => {
  it("ST-S01 siete tipos son consultables", async () => {
    for (const type of ["person", "team", "division", "line", "event", "announcement", "conversation"]) {
      const body = await json(`/api/search?q=a&type=${type}`, fx.coachId)
      expect(body.type, type).toBe(type)
      expect(["OK", "NO_RESULTS"]).toContain(body.state)
    }
  })

  it("ST-S02 ranking no creciente (tier/score)", async () => {
    const body = await json("/api/search?q=a", fx.coachId)
    for (let i = 1; i < body.items.length; i += 1) {
      expect(body.items[i - 1].rank.tier).toBeGreaterThanOrEqual(body.items[i].rank.tier)
    }
  })

  it("ST-S03 filtro por tipo respeta el tipo solicitado", async () => {
    const body = await json("/api/search?q=a&type=event", fx.coachId)
    expect(body.items.every((item: any) => item.type === "event")).toBe(true)
  })

  it("ST-S04 evento fuera de scope no aparece", async () => {
    const body = await json(`/api/search?q=${encodeURIComponent(`Fuera de scope ${tag}`)}`, fx.playerId)
    expect(body.items.some((item: any) => item.id === fx.outOfScopeEventId)).toBe(false)
  })

  it("ST-S05 conversación sin participación no aparece", async () => {
    const body = await json(`/api/search?q=${encodeURIComponent("Grupo cerrado")}`, fx.playerId)
    expect(body.items.some((item: any) => item.id === fx.outsiderConversationId)).toBe(false)
  })

  it("ST-S06 nunca se indexa Message.body", async () => {
    const body = await json("/api/search?q=Mensaje", fx.playerId)
    expect(JSON.stringify(body)).not.toContain("Mensaje privado que nunca debe indexarse")
    expect(JSON.stringify(body)).not.toContain('"body"')
  })

  it("ST-S07 cursor manipulado devuelve 400 genérico", async () => {
    const res = await get("/api/search?q=a&cursor=tampered", fx.coachId)
    expect(res.statusCode).toBe(400)
    expect(res.json().error.code).toBe("INVALID_CURSOR")
  })

  it("ST-S08 cursor ligado a identidad no sirve para otra", async () => {
    const first = await json("/api/search?q=a&limit=1", fx.coachId)
    expect(first.pageMeta.hasMore).toBe(true)
    const cursor = first.pageMeta.cursor
    const other = await get(`/api/search?q=a&limit=1&cursor=${encodeURIComponent(cursor)}`, fx.playerId)
    expect(other.statusCode).toBe(400)
  })

  it("ST-S09 paginación con cursor avanza sin repetir filas", async () => {
    const first = await json("/api/search?q=a&limit=1", fx.coachId)
    const cursor = first.pageMeta.cursor
    expect(cursor).toBeTruthy()
    const second = await get(`/api/search?q=a&limit=1&cursor=${encodeURIComponent(cursor)}`, fx.coachId)
    expect(second.statusCode).toBe(200)
    const ids1 = first.items.map((i: any) => `${i.type}:${i.id}`)
    const ids2 = second.json<any>().items.map((i: any) => `${i.type}:${i.id}`)
    expect(ids2.some((key: string) => ids1.includes(key))).toBe(false)
  })

  it("ST-S10 non-enumeration: sin total y sin destino sin autoridad", async () => {
    const body = await json("/api/search?q=a&type=division", fx.coachId)
    expect(body.total).toBeUndefined()
    expect(body.items.every((item: any) => item.to === null)).toBe(true)
  })
})
