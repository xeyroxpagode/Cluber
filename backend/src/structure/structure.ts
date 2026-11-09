import type { Transaction } from "kysely"
import type { DatabaseSchema } from "../db/types.js"
import { AppError } from "../shared/errors.js"
import { isNonEmpty, normalizeEmail } from "../shared/normalize.js"
import { AuditWriter, redactAuditValue } from "../audit/audit.js"
import { calendarDateInZone, clubDateStart } from "../shared/club-time.js"
import { randomUUID } from "node:crypto"

export interface SeasonInput { name: string; startsOn: string; endsOn: string }
export interface NameInput { name: string }
export interface TeamInput { seasonId: string; divisionId: string; lineId: string }
export interface VenueInput { name: string; address: string }
export interface CompetitionInput { seasonId: string; name: string }

function date(value: string, field: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime())) throw new AppError("VALIDATION_FAILED", `${field} is invalid`, "domain_validation", false, { [field]: ["invalid"] })
  return value
}

export class StructureService {
  constructor(private readonly audit = new AuditWriter()) {}

  async createSeason(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: SeasonInput) {
    if (!isNonEmpty(input.name, 160)) throw new AppError("VALIDATION_FAILED", "Season name is required", "domain_validation", false, { name: ["required"] })
    const startsOn = date(input.startsOn, "startsOn"); const endsOn = date(input.endsOn, "endsOn")
    if (endsOn <= startsOn) throw new AppError("VALIDATION_FAILED", "Season end must follow its start", "domain_validation", false, { endsOn: ["invalid"] })
    const inserted = await tx.insertInto("app.seasons").values({ id: randomUUID(), name: input.name.trim(), starts_on: startsOn, ends_on: endsOn, version: 1, created_at: new Date(), updated_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    await this.record(tx, actorPersonId, "SEASON_CREATED", "Season", inserted.id, "CMD-STR-01", { name: inserted.name })
    return inserted
  }

  async updateSeason(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, input: SeasonInput) {
    if (!isNonEmpty(input.name, 160)) throw new AppError("VALIDATION_FAILED", "Season name is required", "domain_validation", false, { name: ["required"] })
    const startsOn = date(input.startsOn, "startsOn"); const endsOn = date(input.endsOn, "endsOn")
    if (endsOn <= startsOn) throw new AppError("VALIDATION_FAILED", "Season end must follow its start", "domain_validation", false, { endsOn: ["invalid"] })
    const updated = await tx.updateTable("app.seasons").set({ name: input.name.trim(), starts_on: startsOn, ends_on: endsOn, version: (await tx.selectFrom("app.seasons").select("version").where("id", "=", id).executeTakeFirstOrThrow()).version + 1, updated_at: new Date() }).where("id", "=", id).returningAll().executeTakeFirst()
    if (!updated) throw new AppError("SEASON_NOT_FOUND", "Season was not found", "not_found")
    await this.record(tx, actorPersonId, "SEASON_UPDATED", "Season", id, "CMD-STR-02", { name: updated.name, startsOn, endsOn })
    return updated
  }

  async createDivision(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: NameInput) { return this.createNamed(tx, actorPersonId, input, "divisions", "DIVISION_CREATED", "Division", "CMD-STR-03") }
  async updateDivision(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, input: NameInput) { return this.updateNamed(tx, actorPersonId, id, input, "divisions", "DIVISION_UPDATED", "Division", "CMD-STR-04") }
  async createLine(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: NameInput) { return this.createNamed(tx, actorPersonId, input, "lines", "LINE_CREATED", "Line", "CMD-STR-06") }
  async updateLine(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, input: NameInput) { return this.updateNamed(tx, actorPersonId, id, input, "lines", "LINE_UPDATED", "Line", "CMD-STR-07") }

  async archiveDivision(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, at: Date) { return this.archiveNamed(tx, actorPersonId, id, "divisions", "DIVISION_ARCHIVED", "Division", "CMD-STR-05", at) }
  async archiveLine(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, at: Date) { return this.archiveNamed(tx, actorPersonId, id, "lines", "LINE_ARCHIVED", "Line", "CMD-STR-08", at) }

  async createTeam(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: TeamInput) {
    const season = await tx.selectFrom("app.seasons").select("id").where("id", "=", input.seasonId).executeTakeFirst()
    const division = await tx.selectFrom("app.divisions").select("id").where("id", "=", input.divisionId).where("archived_at", "is", null).executeTakeFirst()
    const line = await tx.selectFrom("app.lines").select("id").where("id", "=", input.lineId).where("archived_at", "is", null).executeTakeFirst()
    if (!season) throw new AppError("SEASON_NOT_FOUND", "Season was not found", "not_found")
    if (!division || !line) throw new AppError("PARENT_NOT_OPERATIONAL", "Division and Line must be active", "conflict")
    const inserted = await tx.insertInto("app.teams").values({ id: randomUUID(), season_id: input.seasonId, division_id: input.divisionId, line_id: input.lineId, state: "DRAFT", version: 1, created_at: new Date(), updated_at: new Date() }).returningAll().executeTakeFirst()
    if (!inserted) throw new AppError("DUPLICATE_TEAM_IDENTITY", "A team with this identity already exists", "conflict")
    await this.record(tx, actorPersonId, "TEAM_CREATED", "Team", inserted.id, "CMD-STR-09", { seasonId: input.seasonId, divisionId: input.divisionId, lineId: input.lineId, state: "DRAFT" })
    return inserted
  }

  async activateTeam(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string) {
    const team = await tx.selectFrom("app.teams").selectAll().where("id", "=", id).forUpdate().executeTakeFirst()
    if (!team) throw new AppError("TEAM_NOT_FOUND", "Team was not found", "not_found")
    if (team.state !== "DRAFT") throw new AppError("INVALID_TEAM_STATE", "Only draft teams can be activated", "conflict")
    const division = await tx.selectFrom("app.divisions").select("id").where("id", "=", team.division_id).where("archived_at", "is", null).executeTakeFirst()
    const line = await tx.selectFrom("app.lines").select("id").where("id", "=", team.line_id).where("archived_at", "is", null).executeTakeFirst()
    if (!division || !line) throw new AppError("PARENT_NOT_OPERATIONAL", "Division or Line is not active", "conflict")
    const updated = await tx.updateTable("app.teams").set({ state: "ACTIVE", version: team.version + 1, updated_at: new Date() }).where("id", "=", id).returningAll().executeTakeFirstOrThrow()
    await this.record(tx, actorPersonId, "TEAM_ACTIVATED", "Team", id, "CMD-STR-11", { state: "ACTIVE" })
    return updated
  }

  async archiveTeam(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, evaluationInstant: Date, timeZone: string) {
    const team = await tx.selectFrom("app.teams").selectAll().where("id", "=", id).forUpdate().executeTakeFirst()
    if (!team) throw new AppError("TEAM_NOT_FOUND", "Team was not found", "not_found")
    if (team.state !== "ACTIVE") throw new AppError("INVALID_TEAM_STATE", "Only active teams can be archived", "conflict")
    const today = calendarDateInZone(evaluationInstant, timeZone)
    const openAffiliations = await tx.selectFrom("app.team_assignments").select("id").where("team_id", "=", id)
      .where("valid_from", "<=", today)
      .where((eb) => eb.or([eb("valid_until", "is", null), eb("valid_until", ">", today)]))
      .limit(1).execute()
    if (openAffiliations.length) throw new AppError("ACTIVE_TEAM_AFFILIATION", "Team has an active team assignment", "conflict")
    const updated = await tx.updateTable("app.teams").set({ state: "ARCHIVED", version: team.version + 1, updated_at: new Date() }).where("id", "=", id).returningAll().executeTakeFirstOrThrow()
    await this.record(tx, actorPersonId, "TEAM_ARCHIVED", "Team", id, "CMD-STR-12", { state: "ARCHIVED" })
    return updated
  }

  async createVenue(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: VenueInput) {
    if (!isNonEmpty(input.name, 160) || !isNonEmpty(input.address, 300)) throw new AppError("VALIDATION_FAILED", "Venue name and address are required", "domain_validation")
    const inserted = await tx.insertInto("app.venues").values({ id: randomUUID(), name: input.name.trim(), address: input.address.trim(), version: 1, created_at: new Date(), updated_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    await this.record(tx, actorPersonId, "VENUE_REGISTERED", "Venue", inserted.id, "CMD-STR-13", { name: inserted.name })
    return inserted
  }

  async correctVenue(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, input: VenueInput) {
    if (!isNonEmpty(input.name, 160) || !isNonEmpty(input.address, 300)) throw new AppError("VALIDATION_FAILED", "Venue name and address are required", "domain_validation")
    const updated = await tx.updateTable("app.venues").set({ name: input.name.trim(), address: input.address.trim(), version: (await tx.selectFrom("app.venues").select("version").where("id", "=", id).executeTakeFirstOrThrow()).version + 1, updated_at: new Date() }).where("id", "=", id).returningAll().executeTakeFirst()
    if (!updated) throw new AppError("VENUE_NOT_FOUND", "Venue was not found", "not_found")
    await this.record(tx, actorPersonId, "VENUE_CORRECTED", "Venue", id, "CMD-STR-14", { name: updated.name, address: "[REDACTED]" })
    return updated
  }

  async archiveVenue(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string) {
    const updated = await tx.updateTable("app.venues").set({ archived_at: new Date(), version: (await tx.selectFrom("app.venues").select("version").where("id", "=", id).executeTakeFirstOrThrow()).version + 1, updated_at: new Date() }).where("id", "=", id).where("archived_at", "is", null).returningAll().executeTakeFirst()
    if (!updated) throw new AppError("VENUE_NOT_FOUND", "Venue was not found or already archived", "not_found")
    await this.record(tx, actorPersonId, "VENUE_ARCHIVED", "Venue", id, "CMD-STR-15", { archivedAt: updated.archived_at })
    return updated
  }

  async createCompetition(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: CompetitionInput) {
    if (!isNonEmpty(input.name, 160)) throw new AppError("VALIDATION_FAILED", "Competition name is required", "domain_validation", false, { name: ["required"] })
    const season = await tx.selectFrom("app.seasons").select("id").where("id", "=", input.seasonId).executeTakeFirst()
    if (!season) throw new AppError("SEASON_NOT_FOUND", "Season was not found", "not_found")
    const inserted = await tx.insertInto("app.competitions").values({ id: randomUUID(), season_id: input.seasonId, name: input.name.trim(), version: 1, created_at: new Date(), updated_at: new Date() }).returningAll().executeTakeFirstOrThrow()
    await this.record(tx, actorPersonId, "COMPETITION_CREATED", "Competition", inserted.id, "CMD-CMP-01", { name: inserted.name, seasonId: input.seasonId })
    return inserted
  }

  async updateCompetition(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, input: CompetitionInput) {
    if (!isNonEmpty(input.name, 160)) throw new AppError("VALIDATION_FAILED", "Competition name is required", "domain_validation", false, { name: ["required"] })
    const season = await tx.selectFrom("app.seasons").select("id").where("id", "=", input.seasonId).executeTakeFirst()
    if (!season) throw new AppError("SEASON_NOT_FOUND", "Season was not found", "not_found")
    const current = await tx.selectFrom("app.competitions").selectAll().where("id", "=", id).executeTakeFirst()
    if (!current) throw new AppError("COMPETITION_NOT_FOUND", "Competition was not found", "not_found")
    const updated = await tx.updateTable("app.competitions").set({ season_id: input.seasonId, name: input.name.trim(), version: current.version + 1, updated_at: new Date() }).where("id", "=", id).returningAll().executeTakeFirstOrThrow()
    await this.record(tx, actorPersonId, "COMPETITION_UPDATED", "Competition", id, "CMD-CMP-02", { name: updated.name, seasonId: input.seasonId })
    return updated
  }

  async archiveCompetition(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string) {
    const current = await tx.selectFrom("app.competitions").selectAll().where("id", "=", id).executeTakeFirst()
    if (!current) throw new AppError("COMPETITION_NOT_FOUND", "Competition was not found", "not_found")
    const updated = await tx.updateTable("app.competitions").set({ archived_at: new Date(), version: current.version + 1, updated_at: new Date() }).where("id", "=", id).where("archived_at", "is", null).returningAll().executeTakeFirst()
    if (!updated) throw new AppError("COMPETITION_ARCHIVED", "Competition is already archived", "conflict")
    await this.record(tx, actorPersonId, "COMPETITION_ARCHIVED", "Competition", id, "CMD-CMP-03", { archivedAt: updated.archived_at })
    return updated
  }

  async competitions(tx: Transaction<DatabaseSchema>) {
    return tx.selectFrom("app.competitions").innerJoin("app.seasons", "app.seasons.id", "app.competitions.season_id")
      .select(["app.competitions.id", "app.competitions.season_id as seasonId", "app.competitions.name", "app.competitions.version", "app.competitions.archived_at as archivedAt", "app.seasons.name as seasonName"])
      .orderBy("app.competitions.created_at", "desc").execute()
  }

  private async createNamed(tx: Transaction<DatabaseSchema>, actorPersonId: string, input: NameInput, table: "divisions" | "lines", action: string, targetType: string, source: string) {
    if (!isNonEmpty(input.name, 160)) throw new AppError("VALIDATION_FAILED", `${targetType} name is required`, "domain_validation", false, { name: ["required"] })
    const inserted = await tx.insertInto(`app.${table}` as const).values({ id: randomUUID(), name: input.name.trim(), version: 1, created_at: new Date(), updated_at: new Date() } as never).returningAll().executeTakeFirst()
    if (!inserted) throw new AppError("DUPLICATE_NAME", "An active name already exists", "conflict")
    await this.record(tx, actorPersonId, action, targetType, (inserted as { id: string }).id, source, { name: (inserted as { name: string }).name })
    return inserted
  }

  private async updateNamed(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, input: NameInput, table: "divisions" | "lines", action: string, targetType: string, source: string) {
    if (!isNonEmpty(input.name, 160)) throw new AppError("VALIDATION_FAILED", `${targetType} name is required`, "domain_validation", false, { name: ["required"] })
    const active = await tx.selectFrom(`app.${table}` as const).selectAll().where("id", "=", id).where("archived_at", "is", null).executeTakeFirst()
    if (!active) throw new AppError(`${targetType.toUpperCase()}_NOT_FOUND`, `${targetType} was not found`, "not_found")
    await this.guardStructureUpdate(tx, table, id)
    const updated = await tx.updateTable(`app.${table}` as const).set({ name: input.name.trim(), version: active.version + 1, updated_at: new Date() } as never).where("id", "=", id).returningAll().executeTakeFirstOrThrow()
    await this.record(tx, actorPersonId, action, targetType, id, source, { name: input.name.trim() })
    return updated
  }

  private async archiveNamed(tx: Transaction<DatabaseSchema>, actorPersonId: string, id: string, table: "divisions" | "lines", action: string, targetType: string, source: string, at: Date) {
    await this.guardStructureUpdate(tx, table, id)
    const updated = await tx.updateTable(`app.${table}` as const).set({ archived_at: at, version: (await tx.selectFrom(`app.${table}` as const).select("version").where("id", "=", id).executeTakeFirstOrThrow()).version + 1, updated_at: at } as never).where("id", "=", id).where("archived_at", "is", null).returningAll().executeTakeFirst()
    if (!updated) throw new AppError(`${targetType.toUpperCase()}_NOT_FOUND`, `${targetType} was not found or already archived`, "not_found")
    await this.record(tx, actorPersonId, action, targetType, id, source, { archivedAt: at.toISOString() })
    return updated
  }

  private async guardStructureUpdate(tx: Transaction<DatabaseSchema>, table: "divisions" | "lines", id: string) {
    const column = table === "divisions" ? "division_id" : "line_id"
    const teams = await tx.selectFrom("app.teams").select("id").where(column, "=", id).where("state", "=", "ACTIVE").limit(1).execute()
    if (teams.length) throw new AppError("ACTIVE_TEAMS_EXIST", "Active teams block this structure change", "conflict")
  }

  private async record(tx: Transaction<DatabaseSchema>, actorPersonId: string, action: string, targetType: string, targetId: string, source: string, diff: Record<string, unknown>) {
    await this.audit.record(tx, { actorPersonId, action, targetType, targetId, source, diff: redactAuditValue(diff) as Record<string, unknown> })
  }
}
