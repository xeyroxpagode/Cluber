import type { Person, Role, RoleAssignment, Notice } from "./model"

export function roleAssignments(person: Person): RoleAssignment[] {
  if (person.roleAssignments) return person.roleAssignments
  const club = ["ADMIN", "SUBCOMMITTEE"].includes(person.role)
  if (!person.team && !club) return []
  const roles: Role[] =
    person.role === "CAPTAIN" ? ["PLAYER", "CAPTAIN"] : [person.role]
  return roles.map((role) => ({
    id: `${person.id}-${role}`,
    role,
    scope: club ? "CLUB" : "TEAM",
    target: club ? "club" : person.team,
    validFrom: "2026-03-01",
    validUntil: null,
  }))
}
export function currentRoles(person: Person) {
  return roleAssignments(person).filter((item) => !item.validUntil)
}
export function hasRole(person: Person, role: Role) {
  return currentRoles(person).some((item) => item.role === role)
}
export function canReadNotice(person: Person, notice: Notice) {
  return notice.recipients
    ? notice.recipients.includes(person.id)
    : notice.route.startsWith("/events/")
      ? !!person.team || hasRole(person, "SUBCOMMITTEE")
      : true
}
export function noticeRead(person: Person, notice: Notice) {
  return notice.read || (notice.readBy || []).includes(person.id)
}
