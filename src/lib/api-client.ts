import { apiRequest, apiJson } from "./api.js"
import { getCsrfToken } from "./session.js"

type Json = Record<string, unknown>

function bodyOf(input: unknown): BodyInit {
  return apiJson(input)
}

/* ═══════════════════════════════════════════════════════════════
   SELF / PROFILE (RC-28, OP-PPL-SELF-IDENTITY-EDIT, CMD-PPL-02, CMD-IAM-03)
   ═══════════════════════════════════════════════════════════════ */

export async function fetchMe(): Promise<Json> {
  return apiRequest<Json>("/api/me", {
    method: "GET",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}

export async function fetchSelfIdentity(input: {
  firstName: string
  lastName: string
  idempotencyKey?: string
}): Promise<Json> {
  return apiRequest<Json>("/api/people/self/identity", {
    method: "PATCH",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ firstName: input.firstName, lastName: input.lastName }),
  })
}

export async function fetchSelfPhone(input: {
  phone: string | null
  idempotencyKey?: string
}): Promise<Json> {
  return apiRequest<Json>("/api/people/self/phone", {
    method: "PATCH",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ phone: input.phone }),
  })
}

export async function fetchChangePassword(input: {
  currentPassword: string
  newPassword: string
  idempotencyKey: string
}): Promise<Json> {
  return apiRequest<Json>("/api/account/change-password", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
      idempotency_key: input.idempotencyKey,
    }),
  })
}

/* ═══════════════════════════════════════════════════════════════
   PEOPLE MANAGEMENT (RC-08, CMD-PPL-01..CMD-PPL-06)
   ═══════════════════════════════════════════════════════════════ */

export interface PersonItem {
  id: string
  firstName: string
  lastName: string
  dni?: string | null
  birthDate?: string | null
  phone?: string | null
  email?: string | null
  username?: string | null
  accountId?: string | null
  accountStatus?: string | null
  credentialVersion?: number | null
  membershipActive?: boolean
  profileCompleted?: boolean
  memberships?: Array<{ id: string; validFrom: string; validUntil: string | null; createdAt: string }>
  roleAssignments?: Array<{ id: string; role: string; scopeType: string; scopeRefId: string | null; validFrom: string; validUntil: string | null }>
  teamAssignments?: Array<{ id: string; personId: string; teamId: string; validFrom: string; validUntil: string | null; createdAt: string }>
}

export async function fetchManagementPeople(): Promise<{ items: PersonItem[] }> {
  return apiRequest<{ items: PersonItem[] }>("/api/management/people", {
    method: "GET",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}

export interface CreatePersonInput {
  firstName: string
  lastName: string
  dni?: string | null
  birthDate?: string | null
  phone?: string | null
  email?: string | null
  idempotencyKey: string
}

type BodyMap = Record<string, unknown>

/** Omite claves con valor null/undefined — el contrato JSON trata null como presente y los schemas TypeBox no aceptan null en campos Optional. */
function omitNull(values: BodyMap): BodyMap {
  const out: BodyMap = {}
  for (const [key, value] of Object.entries(values)) {
    if (value !== null && value !== undefined) out[key] = value
  }
  return out
}

export async function fetchCreatePerson(input: CreatePersonInput): Promise<Json> {
  return apiRequest<Json>("/api/people", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf(omitNull({
      firstName: input.firstName,
      lastName: input.lastName,
      dni: input.dni,
      birthDate: input.birthDate,
      phone: input.phone,
      email: input.email,
      idempotency_key: input.idempotencyKey,
    })),
  })
}

export interface UpdatePersonAdminInput {
  personId: string
  firstName?: string
  lastName?: string
  dni?: string | null
  birthDate?: string | null
  phone?: string | null
  email?: string | null
  idempotencyKey?: string
}

export async function fetchUpdatePersonAdmin(input: UpdatePersonAdminInput): Promise<Json> {
  return apiRequest<Json>(`/api/people/${encodeURIComponent(input.personId)}/admin`, {
    method: "PATCH",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf(omitNull({
      firstName: input.firstName ?? undefined,
      lastName: input.lastName ?? undefined,
      dni: input.dni === undefined ? undefined : input.dni,
      birthDate: input.birthDate === undefined ? undefined : input.birthDate,
      phone: input.phone === undefined ? undefined : input.phone,
      email: input.email === undefined ? undefined : input.email,
      idempotency_key: input.idempotencyKey,
    })),
  })
}

export interface CreateMembershipInput {
  personId: string
  validFrom: string
  validUntil?: string | null
  idempotencyKey?: string
}

export async function fetchCreateMembership(input: CreateMembershipInput): Promise<Json> {
  return apiRequest<Json>(
    `/api/people/${encodeURIComponent(input.personId)}/memberships`,
    {
      method: "POST",
      credentials: "include",
      csrfToken: getCsrfToken() ?? undefined,
      idempotencyKey: input.idempotencyKey,
      headers: { "Content-Type": "application/json" },
      body: bodyOf(omitNull({
        validFrom: input.validFrom,
        validUntil: input.validUntil ?? undefined,
        idempotency_key: input.idempotencyKey,
      })),
    }
  )
}

export interface EndMembershipInput {
  personId: string
  membershipId: string
  at: string
  idempotencyKey?: string
}

export async function fetchEndMembership(input: EndMembershipInput): Promise<Json> {
  return apiRequest<Json>(
    `/api/people/${encodeURIComponent(input.personId)}/memberships/${encodeURIComponent(input.membershipId)}/end`,
    {
      method: "POST",
      credentials: "include",
      csrfToken: getCsrfToken() ?? undefined,
      idempotencyKey: input.idempotencyKey,
      headers: { "Content-Type": "application/json" },
      body: bodyOf({ at: input.at, idempotency_key: input.idempotencyKey }),
    }
  )
}

export interface AssignRoleInput {
  personId: string
  role: string
  scopeType: string
  scopeRefId?: string | null
  validFrom: string
  validUntil?: string | null
  reason?: string
  idempotencyKey: string
}

export async function fetchAssignRole(input: AssignRoleInput): Promise<Json> {
  return apiRequest<Json>(
    `/api/people/${encodeURIComponent(input.personId)}/roles`,
    {
      method: "POST",
      credentials: "include",
      csrfToken: getCsrfToken() ?? undefined,
      idempotencyKey: input.idempotencyKey,
      headers: { "Content-Type": "application/json" },
      body: bodyOf(omitNull({
        role: input.role,
        scopeType: input.scopeType,
        scopeRefId: input.scopeRefId ?? undefined,
        validFrom: input.validFrom,
        validUntil: input.validUntil ?? undefined,
        reason: input.reason,
        idempotency_key: input.idempotencyKey,
      })),
    }
  )
}

/* ═══════════════════════════════════════════════════════════════
   ACCOUNTS (CMD-IAM-04, OP-IAM-REACTIVATE, CMD-IAM-05)
   ═══════════════════════════════════════════════════════════════ */

export async function fetchDisableAccount(accountId: string, input: { idempotencyKey: string }): Promise<Json> {
  return apiRequest<Json>(`/api/accounts/${encodeURIComponent(accountId)}/disable`, {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ idempotency_key: input.idempotencyKey }),
  })
}

export async function fetchReactivateAccount(accountId: string, input: { idempotencyKey: string }): Promise<Json> {
  return apiRequest<Json>(`/api/accounts/${encodeURIComponent(accountId)}/reactivate`, {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ idempotency_key: input.idempotencyKey }),
  })
}

export async function fetchReissueSetupCode(accountId: string, input: { idempotencyKey: string }): Promise<{ setupCodeReissued: boolean; setupCode?: string; expiresAt?: string }> {
  return apiRequest<{ setupCodeReissued: boolean; setupCode?: string; expiresAt?: string }>("/api/iam/setup-code", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ accountId, idempotency_key: input.idempotencyKey }),
  })
}

export interface EndRoleInput {
  assignmentId: string
  at: string
  reason?: string
  idempotencyKey?: string
}

export async function fetchEndRole(input: EndRoleInput): Promise<Json> {
  return apiRequest<Json>(
    `/api/roles/${encodeURIComponent(input.assignmentId)}/end`,
    {
      method: "POST",
      credentials: "include",
      csrfToken: getCsrfToken() ?? undefined,
      idempotencyKey: input.idempotencyKey,
      headers: { "Content-Type": "application/json" },
      body: bodyOf(omitNull({
        at: input.at,
        reason: input.reason,
        idempotency_key: input.idempotencyKey,
      })),
    }
  )
}

/* ═══════════════════════════════════════════════════════════════
   STRUCTURE (CMD-STR-01..CMD-STR-13, RC-13)
   ═══════════════════════════════════════════════════════════════ */

export interface StructureSnapshot {
  seasons: Array<{ id: string; name: string; startsOn: string; endsOn: string; archivedAt: string | null }>
  divisions: Array<{ id: string; name: string; archivedAt: string | null }>
  lines: Array<{ id: string; name: string; archivedAt: string | null }>
  teams: Array<{ id: string; state: string; name: string; seasonId: string; divisionId: string; lineId: string }>
  venues: Array<{ id: string; name: string; address: string; fieldLabel?: string; archivedAt: string | null }>
  competitions: Array<{ id: string; seasonId: string; name: string; archivedAt: string | null; seasonName?: string }>
}

export async function fetchStructure(): Promise<StructureSnapshot> {
  return apiRequest<StructureSnapshot>("/api/structure", {
    method: "GET",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}

export async function fetchCompetitions(): Promise<{ items: Array<{ id: string; seasonId: string; name: string; archivedAt: string | null; seasonName?: string }> }> {
  return apiRequest<{ items: Array<{ id: string; seasonId: string; name: string; archivedAt: string | null; seasonName?: string }> }>("/api/structure/competitions", {
    method: "GET",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}

export interface CreateSeasonInput { name: string; startsOn: string; endsOn: string; idempotencyKey?: string }
export interface CreateDivisionInput { name: string; idempotencyKey?: string }
export interface CreateLineInput { name: string; idempotencyKey?: string }
export interface CreateTeamInput { seasonId: string; divisionId: string; lineId: string; idempotencyKey?: string }
export interface CreateVenueInput { name: string; address: string; idempotencyKey?: string }
export interface CreateCompetitionInput { seasonId: string; name: string; idempotencyKey?: string }

export async function fetchCreateSeason(input: CreateSeasonInput): Promise<Json> {
  return apiRequest<Json>("/api/structure/seasons", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ name: input.name, startsOn: input.startsOn, endsOn: input.endsOn, idempotency_key: input.idempotencyKey }),
  })
}

export async function fetchCreateDivision(input: CreateDivisionInput): Promise<Json> {
  return apiRequest<Json>("/api/structure/divisions", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ name: input.name, idempotency_key: input.idempotencyKey }),
  })
}

export async function fetchCreateLine(input: CreateLineInput): Promise<Json> {
  return apiRequest<Json>("/api/structure/lines", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ name: input.name, idempotency_key: input.idempotencyKey }),
  })
}

export async function fetchCreateTeam(input: CreateTeamInput): Promise<Json> {
  return apiRequest<Json>("/api/structure/teams", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ seasonId: input.seasonId, divisionId: input.divisionId, lineId: input.lineId, idempotency_key: input.idempotencyKey }),
  })
}

export async function fetchCreateVenue(input: CreateVenueInput): Promise<Json> {
  return apiRequest<Json>("/api/structure/venues", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ name: input.name, address: input.address, idempotency_key: input.idempotencyKey }),
  })
}

export async function fetchCreateCompetition(input: CreateCompetitionInput): Promise<Json> {
  return apiRequest<Json>("/api/structure/competitions", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({ seasonId: input.seasonId, name: input.name, idempotency_key: input.idempotencyKey }),
  })
}

export interface ArchiveTeamInput { teamId: string }
export interface ActivateTeamInput { teamId: string }

export async function fetchArchiveTeam(input: ArchiveTeamInput): Promise<Json> {
  return apiRequest<Json>(`/api/structure/teams/${encodeURIComponent(input.teamId)}/archive`, {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}

export async function fetchActivateTeam(input: ActivateTeamInput): Promise<Json> {
  return apiRequest<Json>(`/api/structure/teams/${encodeURIComponent(input.teamId)}/activate`, {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}

/* ═══════════════════════════════════════════════════════════════
   ROSTER (RC-04, CMD-PPL-07..CMD-PPL-09)
   ═══════════════════════════════════════════════════════════════ */

export interface RosterItem {
  assignmentId: string
  personId: string
  firstName: string
  lastName: string
  username?: string | null
  accountStatus?: string | null
  phone?: string | null
  email?: string | null
  dni?: string | null
  birthDate?: string | null
  validFrom: string
  validUntil: string | null
}

export async function fetchRoster(teamId: string): Promise<{ items: RosterItem[] }> {
  return apiRequest<{ items: RosterItem[] }>(`/api/teams/${encodeURIComponent(teamId)}/roster`, {
    method: "GET",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}

export interface AddPlayerInput { teamId: string; personId: string; validFrom?: string | null; validUntil?: string | null; reason?: string; idempotencyKey: string }
export interface MovePlayerInput { personId: string; sourceTeamId: string; teamId: string; reason?: string; idempotencyKey: string }
export interface RemovePlayerInput { personId: string; teamId: string; reason?: string; idempotencyKey: string }

export async function fetchAddPlayer(input: AddPlayerInput): Promise<Json> {
  return apiRequest<Json>(`/api/teams/${encodeURIComponent(input.teamId)}/players`, {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf(omitNull({
      personId: input.personId,
      validFrom: input.validFrom ?? undefined,
      validUntil: input.validUntil ?? undefined,
      reason: input.reason,
      idempotency_key: input.idempotencyKey,
    })),
  })
}

export async function fetchMovePlayer(input: MovePlayerInput): Promise<Json> {
  return apiRequest<Json>("/api/players/move", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({
      personId: input.personId,
      sourceTeamId: input.sourceTeamId,
      teamId: input.teamId,
      reason: input.reason,
      idempotency_key: input.idempotencyKey,
    }),
  })
}

export async function fetchRemovePlayer(input: RemovePlayerInput): Promise<Json> {
  return apiRequest<Json>("/api/players/remove", {
    method: "POST",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    idempotencyKey: input.idempotencyKey,
    headers: { "Content-Type": "application/json" },
    body: bodyOf({
      personId: input.personId,
      teamId: input.teamId,
      reason: input.reason,
      idempotency_key: input.idempotencyKey,
    }),
  })
}

/* ═══════════════════════════════════════════════════════════════
   AUDIT (RC-12)
   ═══════════════════════════════════════════════════════════════ */

export interface AuditEntry {
  id: string
  occurredAt: string
  actorPersonId?: string | null
  action: string
  targetType: string
  targetId?: string | null
  reason?: string | null
  source: string
  diff?: Record<string, unknown> | null
}

export async function fetchAudit(limit?: number): Promise<{ items: AuditEntry[] }> {
  const url = limit === undefined ? "/api/audit" : `/api/audit?limit=${limit}`
  return apiRequest<{ items: AuditEntry[] }>(url, {
    method: "GET",
    credentials: "include",
    csrfToken: getCsrfToken() ?? undefined,
    headers: { "Content-Type": "application/json" },
  })
}
