export function normalizeEmail(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase() ?? ""
  return normalized ? normalized : null
}

export function normalizeUsername(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase() ?? ""
  return normalized ? normalized : null
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254
}

export function isNonEmpty(value: string | null | undefined, max = 160): value is string {
  return typeof value === "string" && value.trim().length >= 1 && value.trim().length <= max
}

export function deriveUsername(firstName: string, lastName: string, suffix: string): string {
  const slug = (value: string) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24)
  const base = `${slug(firstName)}.${slug(lastName)}`.replace(/^\.+|\.+$/g, "") || "cuenta"
  return `${base}.${suffix.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 8)}`
}
