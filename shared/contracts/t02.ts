import { Type, type Static } from "@sinclair/typebox"

export const RoleSchema = Type.Union([
  Type.Literal("PLAYER"), Type.Literal("CAPTAIN"), Type.Literal("COACH"),
  Type.Literal("SUBCOMMITTEE"), Type.Literal("ADMIN"),
])
export const AccountStatusSchema = Type.Union([
  Type.Literal("PENDING"), Type.Literal("ACTIVE"), Type.Literal("DISABLED"),
])
export const TeamStateSchema = Type.Union([
  Type.Literal("DRAFT"), Type.Literal("ACTIVE"), Type.Literal("ARCHIVED"),
])

export const SetupSecretSchema = Type.Object({
  issued: Type.Boolean(),
  expiresAt: Type.String({ format: "date-time" }),
  setupCode: Type.String({ minLength: 20, maxLength: 256 }),
})

export const MeResponseSchema = Type.Object({
  authenticated: Type.Boolean(),
  csrfToken: Type.String(),
  principal: Type.Any(),
  operations: Type.Array(Type.String()),
  canAccessApplication: Type.Boolean(),
})
export const SessionMeResponseSchema = MeResponseSchema

export const PersonOperationalSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  firstName: Type.String(),
  lastName: Type.String(),
  username: Type.Union([Type.String(), Type.Null()]),
  email: Type.Union([Type.String(), Type.Null()]),
  phone: Type.Union([Type.String(), Type.Null()]),
  membershipActive: Type.Boolean(),
  profileCompleted: Type.Boolean(),
  roles: Type.Array(Type.Any()),
  teams: Type.Array(Type.String()),
})

export const PersonAdminDetailSchema = Type.Object({
  ...PersonOperationalSchema.properties,
  dni: Type.Union([Type.String(), Type.Null()]),
  birthDate: Type.Union([Type.String(), Type.Null()]),
  account: Type.Union([Type.Any(), Type.Null()]),
  memberships: Type.Array(Type.Any()),
  roleAssignments: Type.Array(Type.Any()),
  teamAssignments: Type.Array(Type.Any()),
})

export const ManagementPeopleListSchema = Type.Object({
  items: Type.Array(Type.Any()),
})

export const AuditListSchema = Type.Object({
  items: Type.Array(Type.Any()),
})

export const AccountStatusResponseSchema = Type.Object({
  status: AccountStatusSchema,
  credentialVersion: Type.Integer({ minimum: 1 }),
})

export type Role = Static<typeof RoleSchema>
export type AccountStatus = Static<typeof AccountStatusSchema>
export type TeamState = Static<typeof TeamStateSchema>
