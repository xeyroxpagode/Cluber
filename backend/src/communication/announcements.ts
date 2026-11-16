import { randomUUID } from "node:crypto"
import type { AnnouncementTable } from "../db/types.js"
import { AuthorityService } from "../authority/authority.js"
import { AuditWriter } from "../audit/audit.js"
import { NotificationService } from "../notification/notification.js"
import { OutboxWriter } from "../shared/outbox.js"
import { resolveEventAudience, unionAudiences } from "../events/audience.js"
import {
  fail, redactedBody, requireText, assertUuid,
  type AnnouncementDto, type Tx,
} from "./types.js"

export interface DraftAnnouncementInput {
  announcementId?: string
  expectedVersion?: number
  title: string
  body: string
  clubWide: boolean
  teamIds: string[]
}

export interface CorrectAnnouncementInput {
  title?: string
  body?: string
  reason: string
  expectedVersion?: number
}

/** DG-13 — CMD-COM-01..04. Reutiliza Authority, Audit, Notification Core y Outbox existentes. */
export class AnnouncementService {
  constructor(
    private readonly authority = new AuthorityService(),
    private readonly audit = new AuditWriter(),
    private readonly notifications = new NotificationService(),
    private readonly outbox = new OutboxWriter(),
  ) {}

  private async assertSubcommittee(tx: Tx, personId: string, instant: Date): Promise<void> {
    const snapshot = await this.authority.snapshot(tx, personId, instant)
    // ADMIN no gestiona anuncios (matriz §3.1): solo SUBCOMMITTEE con_scope CLUB.
    this.authority.require(snapshot.isSubcommittee, "NO_ANNOUNCEMENT_AUTHORITY")
  }

  private validateAudience(input: { clubWide: boolean; teamIds: string[] }): void {
    if (typeof input.clubWide !== "boolean") fail("AUDIENCE_REQUIRED", "Debe elegir explícitamente el tipo de audiencia", "transport")
    const ids = input.teamIds ?? []
    if (!Array.isArray(ids)) fail("INVALID_TEAM", "teamIds debe ser una lista", "transport")
    if (input.clubWide && ids.length > 0) fail("AUDIENCE_REQUIRED", "La audiencia no puede ser club-wide y por equipos a la vez")
    if (!input.clubWide && ids.length === 0) fail("AUDIENCE_REQUIRED", "Debe seleccionar al menos un equipo o elegir todo el club")
    for (const id of ids) assertUuid(id, "teamId")
    if (new Set(ids).size !== ids.length) fail("INVALID_TEAM", "Equipos duplicados en la audiencia")
  }

  private async load(tx: Tx, announcementId: string, forUpdate = false): Promise<AnnouncementTable> {
    assertUuid(announcementId, "announcementId")
    let query = tx.selectFrom("app.announcements").selectAll().where("id", "=", announcementId)
    if (forUpdate) query = query.forUpdate()
    const row = await query.executeTakeFirst()
    if (!row) fail("ANNOUNCEMENT_NOT_FOUND", "El comunicado no existe", "not_found")
    return row
  }

  private async targets(tx: Tx, announcementId: string): Promise<string[]> {
    const rows = await tx.selectFrom("app.announcement_target_teams")
      .select("team_id").where("announcement_id", "=", announcementId).execute()
    return rows.map((r) => r.team_id)
  }

  private async replaceTargets(tx: Tx, announcementId: string, actorPersonId: string, teamIds: string[], instant: Date): Promise<void> {
    await tx.deleteFrom("app.announcement_target_teams").where("announcement_id", "=", announcementId).execute()
    for (const teamId of teamIds) {
      await tx.insertInto("app.announcement_target_teams").values({
        id: randomUUID(), announcement_id: announcementId, team_id: teamId,
        added_by_person_id: actorPersonId, added_at: instant,
      }).execute()
    }
  }

  /** Audiencia resuelta sobre fuente canónica; snapshot congela los teamIds al publicar. */
  private async resolveAudience(tx: Tx, announcementId: string, teamIds: string[], instant: Date): Promise<string[]> {
    if (teamIds.length === 0) {
      return resolveEventAudience(tx, { id: announcementId, club_wide_target: true }, instant)
    }
    const today = instant.toISOString().slice(0, 10)
    const assignments = await tx.selectFrom("app.team_assignments")
      .select("person_id").where("team_id", "in", teamIds)
      .where("valid_from", "<=", today)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)]))
      .execute()
    const staff = await tx.selectFrom("app.role_assignments")
      .select("person_id").where("role", "in", ["SUBCOMMITTEE", "ADMIN"])
      .where("scope_type", "=", "CLUB").where("valid_from", "<=", instant)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", instant)]))
      .execute()
    return unionAudiences(assignments.map((r) => r.person_id), staff.map((r) => r.person_id))
  }

  async toDto(tx: Tx, row: AnnouncementTable, viewerPersonId?: string): Promise<AnnouncementDto> {
    const teamIds = await this.targets(tx, row.id)
    let readState: { readAt: string | null } | null = null
    if (viewerPersonId) {
      const note = await tx.selectFrom("app.notifications")
        .select("read_at").where("recipient_person_id", "=", viewerPersonId)
        .where("resource_type", "=", "ANNOUNCEMENT").where("resource_id", "=", row.id)
        .where("type", "=", "ANNOUNCEMENT_PUBLISHED").executeTakeFirst()
      if (note) readState = { readAt: note.read_at ? note.read_at.toISOString() : null }
    }
    return {
      id: row.id as string,
      title: row.title,
      body: row.body,
      state: row.state,
      publishedAt: row.published_at ? row.published_at.toISOString() : null,
      publishedByPersonId: row.published_by_person_id,
      archivedAt: row.archived_at ? row.archived_at.toISOString() : null,
      revision: row.revision,
      version: row.version,
      clubWide: teamIds.length === 0,
      audienceSnapshot: teamIds,
      readState,
    }
  }

  /** CMD-COM-01 — CREATE DRAFT (announcementId ausente) o UPDATE EXISTING DRAFT (CC-T05-C10). */
  async draft(tx: Tx, actorPersonId: string, instant: Date, input: DraftAnnouncementInput): Promise<AnnouncementDto> {
    await this.assertSubcommittee(tx, actorPersonId, instant)
    this.validateAudience(input)
    const title = requireText(input.title, "title")
    const body = requireText(input.body, "body", 20_000)
    const teamIds = input.clubWide ? [] : input.teamIds

    if (!input.announcementId) {
      const id = randomUUID()
      await tx.insertInto("app.announcements").values({
        id, title, body, state: "DRAFT", revision: 1, version: 1, created_at: instant, updated_at: instant,
      }).execute()
      await this.replaceTargets(tx, id, actorPersonId, teamIds, instant)
      await this.audit.record(tx, {
        actorPersonId, action: "CMD-COM-01", targetType: "Announcement", targetId: id,
        source: "CMD-COM-01", reason: "CREATE_DRAFT",
        diff: { operation: "CREATE_DRAFT", title, body: redactedBody(), clubWide: input.clubWide, teamIds },
      })
      return this.toDto(tx, await this.load(tx, id), actorPersonId)
    }

    const id = input.announcementId
    const current = await this.load(tx, id, true)
    if (current.state !== "DRAFT") fail("INVALID_STATE", "Solo se puede editar un borrador")
    if (input.expectedVersion !== undefined && input.expectedVersion !== current.version) {
      fail("CONCURRENCY_CONFLICT", "El borrador cambió desde que lo cargaste", "conflict")
    }
    const before = { title: current.title, body: redactedBody() }
    await tx.updateTable("app.announcements").set({
      title, body, updated_at: instant, version: current.version + 1,
    }).where("id", "=", id).execute()
    await this.replaceTargets(tx, id, actorPersonId, teamIds, instant)
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-01", targetType: "Announcement", targetId: id,
      source: "CMD-COM-01", reason: "UPDATE_DRAFT",
      diff: { operation: "UPDATE_DRAFT", before, after: { title, body: redactedBody() }, clubWide: input.clubWide, teamIds },
    })
    return this.toDto(tx, await this.load(tx, id), actorPersonId)
  }

  /** CMD-COM-02 — publicación atómica con NOT-07 en la misma TX. */
  async publish(tx: Tx, actorPersonId: string, instant: Date, announcementId: string): Promise<AnnouncementDto> {
    await this.assertSubcommittee(tx, actorPersonId, instant)
    const row = await this.load(tx, announcementId, true)
    if (row.state !== "DRAFT") fail("INVALID_STATE", "Solo se puede publicar un borrador")
    const teamIds = await this.targets(tx, announcementId)
    // clubWide = audiencia vacía; la intención explícita se validó al crear el DRAFT (C12).
    await tx.updateTable("app.announcements").set({
      state: "PUBLISHED", published_at: instant, published_by_person_id: actorPersonId,
      version: row.version + 1, updated_at: instant,
    }).where("id", "=", announcementId).execute()

    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-02", targetType: "Announcement", targetId: announcementId,
      source: "CMD-COM-02", reason: "PUBLISH",
      diff: { state: "PUBLISHED", title: row.title, body: redactedBody(), clubWide: teamIds.length === 0, teamIds },
    })

    const recipients = await this.resolveAudience(tx, announcementId, teamIds, instant)
    const result = await this.notifications.recordForAudience(tx, recipients, {
      type: "ANNOUNCEMENT_PUBLISHED", resourceType: "ANNOUNCEMENT", resourceId: announcementId,
      title: row.title, body: row.body, occurredAt: instant,
    })
    for (const notification of result.rows) {
      if (notification.wasDuplicate) continue
      await this.outbox.enqueue(tx, {
        topic: "notification.created", aggregateType: "Notification", aggregateId: notification.id,
        payload: {
          schemaVersion: 1, event: "notification.created",
          recipients: [notification.recipientPersonId], resourceType: "ANNOUNCEMENT",
          resourceId: announcementId, invalidate: ["notifications", "communication"],
        },
      })
    }
    return this.toDto(tx, await this.load(tx, announcementId), actorPersonId)
  }

  /** CMD-COM-03 — corrección title/body + revision++; sin Notification (C05/C14). */
  async correct(tx: Tx, actorPersonId: string, instant: Date, announcementId: string, input: CorrectAnnouncementInput): Promise<AnnouncementDto> {
    await this.assertSubcommittee(tx, actorPersonId, instant)
    const row = await this.load(tx, announcementId, true)
    if (row.state !== "PUBLISHED") fail("INVALID_STATE", "Solo se puede corregir un comunicado publicado")
    if (input.expectedVersion !== undefined && input.expectedVersion !== row.version) {
      fail("CONCURRENCY_CONFLICT", "El comunicado cambió desde que lo cargaste", "conflict")
    }
    const reason = requireText(input.reason, "reason", 1000)
    if (input.title === undefined && input.body === undefined) fail("NO_CHANGES", "Debe enviar title o body")
    const title = input.title === undefined ? row.title : requireText(input.title, "title")
    const body = input.body === undefined ? row.body : requireText(input.body, "body", 20_000)

    await tx.updateTable("app.announcements").set({
      title, body, revision: row.revision + 1, version: row.version + 1, updated_at: instant,
    }).where("id", "=", announcementId).execute()
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-03", targetType: "Announcement", targetId: announcementId,
      source: "CMD-COM-03", reason,
      diff: {
        revision: row.revision + 1,
        before: { title: row.title, body: redactedBody() },
        after: { title, body: redactedBody() },
      },
    })
    return this.toDto(tx, await this.load(tx, announcementId), actorPersonId)
  }

  /** CMD-COM-04 — archivado histórico; conserva publishedAt y audiencia (C18). */
  async archive(tx: Tx, actorPersonId: string, instant: Date, announcementId: string): Promise<AnnouncementDto> {
    await this.assertSubcommittee(tx, actorPersonId, instant)
    const row = await this.load(tx, announcementId, true)
    if (row.state !== "PUBLISHED") fail("INVALID_STATE", "Solo se puede archivar un comunicado publicado")
    await tx.updateTable("app.announcements").set({
      state: "ARCHIVED", archived_at: instant, version: row.version + 1, updated_at: instant,
    }).where("id", "=", announcementId).execute()
    await this.audit.record(tx, {
      actorPersonId, action: "CMD-COM-04", targetType: "Announcement", targetId: announcementId,
      source: "CMD-COM-04", reason: "ARCHIVE",
      diff: { state: "ARCHIVED", publishedAt: row.published_at?.toISOString() ?? null },
    })
    return this.toDto(tx, await this.load(tx, announcementId), actorPersonId)
  }
}
