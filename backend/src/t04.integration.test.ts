import { randomUUID } from "node:crypto"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import type { Kysely } from "kysely"
import type { DatabaseSchema } from "./db/types.js"
import { runtime } from "./integration/t02-base.js"
import { makeT04Fixture, type T04Fixture } from "./testing/t04-base.js"
import { ParticipationService } from "./participation/participation.js"

let fx: T04Fixture

// Aislamiento: la base de pruebas es compartida entre suites. T04 crea notificaciones
// (NOT-06 y NOT-01 de cierre) que las aserciones globales de T03 no contemplan.
afterAll(async () => {
  await runtime!.runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    await tx.deleteFrom("infra.outbox_events").execute().catch(() => undefined)
    await tx.deleteFrom("app.notifications").execute().catch(() => undefined)
  }).catch(() => undefined)
})

beforeEach(async () => {
  await runtime!.runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx }) => {
    fx = await makeT04Fixture(tx, "int")
  })
})

async function withTx<T>(fn: (tx: Kysely<DatabaseSchema>, now: Date) => Promise<T>): Promise<T> {
  return runtime!.runner.run("COMMAND_STANDARD", randomUUID(), async ({ tx, evaluationInstant }) => fn(tx, evaluationInstant)) as Promise<T>
}

const futureStart = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString()

async function createMatch(coachId: string) {
  return withTx((tx, now) => runtime!.services.events.createEvent(tx, coachId, {
    type: "MATCH",
    title: "Partido T04",
    startAt: futureStart(7),
    timeZone: "Europe/Madrid",
    targetTeamIds: [fx.teamAId],
    opponent: "Rivales",
  }, now, "America/Argentina/Buenos_Aires"))
}

async function createTraining(coachId: string) {
  return withTx((tx, now) => runtime!.services.events.createEvent(tx, coachId, {
    type: "TRAINING",
    title: "Entrenamiento T04",
    startAt: futureStart(7),
    timeZone: "Europe/Madrid",
    targetTeamIds: [fx.teamAId],
  }, now, "America/Argentina/Buenos_Aires"))
}

describe("T04 M7 — schema, constraints and triggers (DB)", () => {
  it("ST-47 the ten T04 tables exist with their constraints and indexes", async () => {
    const tables = await withTx((tx) => tx
      .selectFrom("information_schema.tables" as never)
      .select("table_name" as never)
      .where("table_schema" as never, "=", "app")
      .execute() as never)
    const names = new Set((tables as unknown as Array<{ table_name: string }>).map((row) => row.table_name))
    for (const table of [
      "availability_responses", "selections", "selection_revisions", "selection_entries",
      "attendance_sheets", "attendance_entries", "attendance_corrections",
      "match_records", "player_match_stats", "matchrecord_corrections",
    ]) {
      expect(names.has(table), `falta la tabla ${table}`).toBe(true)
    }
  })

  it("ST-44 a second match record for the same match violates the DB uniqueness", async () => {
    const event = await createMatch(fx.coachId)
    await withTx((tx, now) => runtime!.services.participation.createMatchRecord(tx, fx.coachId, { matchId: event.id }, now))
    await expect(withTx(async (tx) => {
      await tx.insertInto("app.match_records").values({
        id: randomUUID(), match_id: event.id, state: "DRAFT", result_type: null, home_score: null, away_score: null,
        observations: null, finalized_at: null, finalized_by_person_id: null, corrected_at: null, corrected_by_person_id: null,
        correction_reason: null, previous_result_type: null, previous_home_score: null, previous_away_score: null,
        previous_observations: null, created_at: new Date(), updated_at: new Date(),
      }).execute()
    })).rejects.toMatchObject({ code: "23505" })
  })

  it("ST-16 a PUBLISHED selection revision is immutable at DB level", async () => {
    const event = await createMatch(fx.coachId)
    const published = await withTx(async (tx, now) => {
      await runtime!.services.participation.updateSelectionDraft(tx, fx.coachId, {
        matchId: event.id,
        entries: [{ personId: fx.playerId, role: "SELECTED", order: 1 }],
        autosaveVersion: 0,
      }, now)
      return runtime!.services.participation.publishSelection(tx, fx.coachId, { matchId: event.id }, now)
    })
    await expect(withTx(async (tx) => {
      await tx.updateTable("app.selection_revisions").set({ autosave_version: 99 }).where("id", "=", published.revisionId).execute()
    })).rejects.toMatchObject({ code: "55000" })
  })

  it("ST-16b the entries of a PUBLISHED revision cannot be modified at DB level", async () => {
    const event = await createMatch(fx.coachId)
    const published = await withTx(async (tx, now) => {
      await runtime!.services.participation.updateSelectionDraft(tx, fx.coachId, {
        matchId: event.id,
        entries: [{ personId: fx.playerId, role: "SELECTED", order: 1 }],
        autosaveVersion: 0,
      }, now)
      return runtime!.services.participation.publishSelection(tx, fx.coachId, { matchId: event.id }, now)
    })
    await expect(withTx(async (tx) => {
      await tx.updateTable("app.selection_entries").set({ role: "ALTERNATE" }).where("revision_id", "=", published.revisionId).execute()
    })).rejects.toMatchObject({ code: "55000" })
  })

  it("ST-28 a CLOSED attendance sheet cannot be reopened at DB level", async () => {
    const event = await createTraining(fx.coachId)
    await withTx((tx, now) => runtime!.services.participation.closeAttendanceSheet(tx, fx.coachId, { eventId: event.id }, now))
    await expect(withTx(async (tx) => {
      await tx.updateTable("app.attendance_sheets").set({ closed_at: null, closed_by_person_id: null }).where("event_id", "=", event.id).execute()
    })).rejects.toMatchObject({ code: "55000" })
  })

  it("A-D04-01 the first availability response timestamp is immutable at DB level", async () => {
    const event = await createTraining(fx.coachId)
    await withTx((tx, now) => runtime!.services.participation.respondAvailability(tx, fx.playerId, {
      eventId: event.id, value: "YES", observedCoordinationRevision: 0,
    }, now))
    await expect(withTx(async (tx) => {
      await tx.updateTable("app.availability_responses").set({ responded_at: new Date(Date.now() + 1000) }).where("event_id", "=", event.id).execute()
    })).rejects.toMatchObject({ code: "55000" })
  })

  it("A-D04-03 the attendance history is append-only (trigger + permisos)", async () => {
    const event = await createTraining(fx.coachId)
    const entryId = await withTx(async (tx, now) => {
      const marked = await runtime!.services.participation.recordAttendance(tx, fx.coachId, { eventId: event.id, personId: fx.playerId, value: "PRESENT" }, now)
      await runtime!.services.participation.closeAttendanceSheet(tx, fx.coachId, { eventId: event.id }, now)
      await runtime!.services.participation.correctAttendance(tx, fx.coachId, { eventId: event.id, entryId: marked.entryId, value: "JUSTIFIED", correctionReason: "Turno médico" }, now)
      return marked.entryId
    })
    // El rol de runtime no tiene permiso de UPDATE/DELETE sobre el historial (42501);
    // el trigger (55000) impide la mutación aunque el permiso existiera.
    await expect(withTx(async (tx) => {
      await tx.updateTable("app.attendance_corrections").set({ new_value: "ABSENT" }).where("entry_id", "=", entryId).execute()
    })).rejects.toMatchObject({ code: expect.stringMatching(/^(42501|55000)$/) })
    await expect(withTx(async (tx) => {
      await tx.deleteFrom("app.attendance_corrections").where("entry_id", "=", entryId).execute()
    })).rejects.toMatchObject({ code: expect.stringMatching(/^(42501|55000)$/) })
    const triggers = await withTx((tx) => tx
      .selectFrom("pg_trigger" as never)
      .select("tgname" as never)
      .where("tgname" as never, "in", ["trg_attendance_corrections_immutable", "trg_matchrecord_corrections_immutable"])
      .execute() as never)
    expect((triggers as unknown as Array<{ tgname: string }>).map((row) => row.tgname).sort()).toEqual(["trg_attendance_corrections_immutable", "trg_matchrecord_corrections_immutable"])
  })

  it("A-D04-04 the match record cannot go back from FINAL to DRAFT", async () => {
    const event = await createMatch(fx.coachId)
    await withTx(async (tx, now) => {
      await runtime!.services.participation.createMatchRecord(tx, fx.coachId, { matchId: event.id }, now)
      await runtime!.services.events.startEvent(tx, fx.coachId, event.id, undefined, now)
      await runtime!.services.participation.finalizeMatchRecord(tx, fx.coachId, { matchId: event.id, resultType: "PLAYED", homeScore: 2, awayScore: 1 }, now)
    })
    await expect(withTx(async (tx) => {
      await tx.updateTable("app.match_records").set({ state: "DRAFT" }).where("match_id", "=", event.id).execute()
    })).rejects.toMatchObject({ code: "55000" })
  })

  it("A-D04-04 player statistics are frozen once the record is FINAL", async () => {
    const event = await createMatch(fx.coachId)
    const recordId = await withTx(async (tx, now) => {
      const record = await runtime!.services.participation.createMatchRecord(tx, fx.coachId, { matchId: event.id }, now)
      await runtime!.services.participation.recordPlayerStats(tx, fx.coachId, { matchRecordId: record.matchRecordId, personId: fx.playerId, stats: { goals: 1 } }, now)
      await runtime!.services.events.startEvent(tx, fx.coachId, event.id, undefined, now)
      await runtime!.services.participation.finalizeMatchRecord(tx, fx.coachId, { matchId: event.id, resultType: "PLAYED", homeScore: 1, awayScore: 0 }, now)
      return record.matchRecordId
    })
    await expect(withTx(async (tx) => {
      await tx.updateTable("app.player_match_stats").set({ goals: 9 }).where("match_record_id", "=", recordId).execute()
    })).rejects.toMatchObject({ code: "55000" })
  })

  it("UNRECORDED is an absent record, not an ABSENT value", async () => {
    const event = await createTraining(fx.coachId)
    await withTx((tx, now) => runtime!.services.participation.recordAttendance(tx, fx.coachId, { eventId: event.id, personId: fx.playerId, value: "ABSENT" }, now))
    const detail = await withTx((tx, now) => runtime!.services.t04Reads.attendanceDetail(tx, fx.coachId, event.id, now))
    const recorded = detail.items.find((item) => item.personId === fx.playerId)
    const unrecorded = detail.items.find((item) => item.personId === fx.player2Id)
    expect(recorded!.state).toBe("ABSENT")
    expect(unrecorded!.state).toBe("UNRECORDED")
    expect(unrecorded!.value).toBeNull()
  })

  it("a correction from UNRECORDED keeps a NULL previous value in the history", async () => {
    const event = await createTraining(fx.coachId)
    await withTx(async (tx, now) => {
      await runtime!.services.participation.recordAttendance(tx, fx.coachId, { eventId: event.id, personId: fx.playerId, value: "PRESENT" }, now)
    })
    // Se fuerza el estado UNRECORDED con una entrada vacía para probar el guard de historial.
    const entryId = await withTx(async (tx) => {
      const sheet = await tx.selectFrom("app.attendance_sheets").selectAll().where("event_id", "=", event.id).executeTakeFirstOrThrow()
      const inserted = await tx.insertInto("app.attendance_entries").values({
        id: randomUUID(), sheet_id: sheet.id, person_id: fx.player2Id, value: null, recorded_at: null, recorded_by_person_id: null,
        corrected_at: null, corrected_by_person_id: null, correction_reason: null, previous_value: null, created_at: new Date(), updated_at: new Date(),
      }).returning("id").executeTakeFirstOrThrow()
      return inserted.id
    })
    await withTx(async (tx, now) => {
      await runtime!.services.participation.correctAttendance(tx, fx.coachId, { eventId: event.id, entryId, value: "JUSTIFIED", correctionReason: "Justificado" }, now)
    })
    const history = await withTx((tx) => tx.selectFrom("app.attendance_corrections").selectAll().where("entry_id", "=", entryId).execute())
    expect(history).toHaveLength(1)
    expect(history[0].previous_value).toBeNull()
    expect(history[0].new_value).toBe("JUSTIFIED")
  })
})

describe("T04 — atomicidad, concurrencia y persistencia (INTEGRATION)", () => {
  it("ST-45 an audit failure during finalize rolls the whole transaction back", async () => {
    const event = await createMatch(fx.coachId)
    await withTx(async (tx, now) => {
      await runtime!.services.participation.createMatchRecord(tx, fx.coachId, { matchId: event.id }, now)
      await runtime!.services.events.startEvent(tx, fx.coachId, event.id, undefined, now)
    })
    const broken = {
      record: async (): Promise<never> => {
        throw new Error("audit writer unavailable")
      },
    }
    const service = new ParticipationService(undefined, broken as never, undefined, undefined)
    await expect(withTx((tx, now) => service.finalizeMatchRecord(tx, fx.coachId, { matchId: event.id, resultType: "PLAYED", homeScore: 1, awayScore: 0 }, now)))
      .rejects.toThrow(/audit writer unavailable/)
    const records = await withTx((tx) => tx.selectFrom("app.match_records").selectAll().where("match_id", "=", event.id).execute())
    expect(records[0].state).toBe("DRAFT")
    expect(records[0].result_type).toBeNull()
    const events = await withTx((tx) => tx.selectFrom("app.events").selectAll().where("id", "=", event.id).execute())
    expect(events[0].state).toBe("IN_PROGRESS")
  })

  it("ST-41 a concurrent double finalize keeps one consistent final state", async () => {
    const event = await createMatch(fx.coachId)
    await withTx(async (tx, now) => {
      await runtime!.services.participation.createMatchRecord(tx, fx.coachId, { matchId: event.id }, now)
      await runtime!.services.events.startEvent(tx, fx.coachId, event.id, undefined, now)
    })
    const results = await Promise.allSettled([
      withTx((tx, now) => runtime!.services.participation.finalizeMatchRecord(tx, fx.coachId, { matchId: event.id, resultType: "PLAYED", homeScore: 1, awayScore: 0 }, now)),
      withTx((tx, now) => runtime!.services.participation.finalizeMatchRecord(tx, fx.coachId, { matchId: event.id, resultType: "PLAYED", homeScore: 1, awayScore: 0 }, now)),
    ])
    const fulfilled = results.filter((result) => result.status === "fulfilled")
    expect(fulfilled.length).toBeGreaterThanOrEqual(1)
    const records = await withTx((tx) => tx.selectFrom("app.match_records").selectAll().where("match_id", "=", event.id).execute())
    expect(records).toHaveLength(1)
    expect(records[0].state).toBe("FINAL")
    const events = await withTx((tx) => tx.selectFrom("app.events").selectAll().where("id", "=", event.id).execute())
    expect(events[0].state).toBe("COMPLETED")
  })

  it("ST-08 concurrent availability answers never corrupt the stored revision", async () => {
    const event = await createTraining(fx.coachId)
    await Promise.allSettled([
      withTx((tx, now) => runtime!.services.participation.respondAvailability(tx, fx.playerId, { eventId: event.id, value: "YES", observedCoordinationRevision: 0 }, now)),
      withTx((tx, now) => runtime!.services.participation.respondAvailability(tx, fx.playerId, { eventId: event.id, value: "MAYBE", observedCoordinationRevision: 0 }, now)),
    ])
    const rows = await withTx((tx) => tx.selectFrom("app.availability_responses").selectAll().where("event_id", "=", event.id).execute())
    expect(rows).toHaveLength(1)
    expect(["YES", "MAYBE"]).toContain(rows[0].value)
    expect(rows[0].coordination_revision).toBe(0)
  })

  it("ST-46 the participation data survives a new connection (persistence after restart)", async () => {
    const event = await createTraining(fx.coachId)
    await withTx(async (tx, now) => {
      await runtime!.services.participation.respondAvailability(tx, fx.playerId, { eventId: event.id, value: "YES", observedCoordinationRevision: 0 }, now)
      await runtime!.services.participation.recordAttendance(tx, fx.coachId, { eventId: event.id, personId: fx.playerId, value: "PRESENT" }, now)
    })
    const independent = await runtime!.runner.run("READ_STANDARD", randomUUID(), async ({ tx }) => {
      const availability = await tx.selectFrom("app.availability_responses").selectAll().where("event_id", "=", event.id).execute()
      const entries = await tx.selectFrom("app.attendance_entries").selectAll().where("person_id", "=", fx.playerId).execute()
      return { availability, entries }
    })
    expect(independent.availability).toHaveLength(1)
    expect(independent.availability[0].value).toBe("YES")
    expect(independent.entries[0].value).toBe("PRESENT")
  })

  it("ST-50 the outbox worker retries without duplicating the notification fact", async () => {
    const event = await createMatch(fx.coachId)
    const published = await withTx(async (tx, now) => {
      await runtime!.services.participation.updateSelectionDraft(tx, fx.coachId, {
        matchId: event.id,
        entries: [{ personId: fx.playerId, role: "SELECTED", order: 1 }],
        autosaveVersion: 0,
      }, now)
      return runtime!.services.participation.publishSelection(tx, fx.coachId, { matchId: event.id }, now)
    })
    const notes = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().where("type", "=", "SELECTION_PUBLISHED").execute())
    const forRevision = notes.filter((note) => note.dedupe_key.includes(published.revisionId))
    expect(forRevision.length).toBeGreaterThan(0)
    const outbox = await withTx((tx) => tx.selectFrom("infra.outbox_events").selectAll().where("aggregate_id", "in", forRevision.map((note) => note.id)).execute())
    expect(outbox).toHaveLength(forRevision.length)
    // Reintento del writer: la clave de dedupe impide un hecho nuevo.
    await withTx(async (tx, now) => {
      await runtime!.services.notificationService.record(tx, {
        recipientPersonId: fx.playerId,
        type: "SELECTION_PUBLISHED",
        resourceType: "SELECTION",
        resourceId: forRevision[0].resource_id,
        originEventId: event.id,
        revisionId: published.revisionId,
        title: "Convocatoria publicada",
        body: "Reintento",
        occurredAt: now,
      })
    })
    const notesAfter = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().where("type", "=", "SELECTION_PUBLISHED").execute())
    expect(notesAfter.filter((note) => note.dedupe_key.includes(published.revisionId))).toHaveLength(forRevision.length)
  })

  it("CMD-EVT-17 starts a match without bumping the coordination revision", async () => {
    const event = await createMatch(fx.coachId)
    const started = await withTx((tx, now) => runtime!.services.events.startEvent(tx, fx.coachId, event.id, undefined, now))
    expect(started.state).toBe("IN_PROGRESS")
    expect(started.coordinationRevision).toBe(0)
    const events = await withTx((tx) => tx.selectFrom("app.events").selectAll().where("id", "=", event.id).execute())
    expect(events[0].coordination_revision).toBe(0)
    expect(events[0].version).toBe(2)
    const notes = await withTx((tx) => tx.selectFrom("app.notifications").selectAll().where("origin_event_id", "=", event.id).execute())
    expect(notes).toHaveLength(0)
  })

  it("CMD-EVT-17 refuses a non-match and a non-scheduled event", async () => {
    const training = await createTraining(fx.coachId)
    await expect(withTx((tx, now) => runtime!.services.events.startEvent(tx, fx.coachId, training.id, undefined, now)))
      .rejects.toMatchObject({ code: "INVALID_TARGET" })
    const match = await createMatch(fx.coachId)
    await withTx((tx, now) => runtime!.services.events.startEvent(tx, fx.coachId, match.id, undefined, now))
    await expect(withTx((tx, now) => runtime!.services.events.startEvent(tx, fx.coachId, match.id, undefined, now)))
      .rejects.toMatchObject({ code: "EVENT_NOT_SCHEDULED" })
  })

  it("ST-51 RC-23 resuelve el próximo evento de forma determinista ante empates de horario", async () => {
    // Dos eventos visibles con el mismo inicio: el resultado no puede depender del orden
    // físico de las filas (OBS-T04-00).
    const startAt = futureStart(1)
    const first = await withTx((tx, now) => runtime!.services.events.createEvent(tx, fx.coachId, {
      type: "TRAINING", title: "Empatado A", startAt, timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId],
    }, now, "America/Argentina/Buenos_Aires"))
    const second = await withTx((tx, now) => runtime!.services.events.createEvent(tx, fx.coachId, {
      type: "TRAINING", title: "Empatado B", startAt, timeZone: "Europe/Madrid", targetTeamIds: [fx.teamAId],
    }, now, "America/Argentina/Buenos_Aires"))

    const reads = []
    for (let attempt = 0; attempt < 5; attempt += 1) {
      reads.push(await withTx((tx, now) => runtime!.services.t03Reads.nextEvent(tx, fx.coachId, now)))
    }
    const ids = new Set(reads.map((event) => event?.id))
    expect(ids.size).toBe(1)
    const winner = reads[0]!
    expect([first.id, second.id]).toContain(winner.id)
    const expected = [first.id, second.id].sort()[0]
    expect(winner.id).toBe(expected)
  })
})
