/**
 * Contexto de ruta en vocabulario usuario (Blueprint §2.6).
 * Prohibido "Mi espacio" como crumb genérico.
 */

const CONTEXT_BY_PREFIX: Array<[string, string]> = [
  ["/home", "Inicio"],
  ["/calendar", "Calendario"],
  ["/search", "Buscar"],
  ["/notifications", "Avisos"],
  ["/more/profile", "Mi perfil"],
  ["/more", "Más"],
  ["/teams", "Equipos"],
  ["/events/new", "Nuevo evento"],
  ["/events", "Eventos"],
  ["/jornadas/new", "Nueva jornada"],
  ["/jornadas", "Jornadas"],
  ["/communication/conversations/new", "Nuevo mensaje"],
  ["/communication/announcements/new", "Nuevo comunicado"],
  ["/communication", "Comunicación"],
  ["/conversations", "Mensajes"],
  ["/announcements", "Comunicados"],
  ["/management/competitions", "Competencias"],
  ["/management/structure", "Estructura"],
  ["/management/people/new", "Nueva persona"],
  ["/management/people", "Personas"],
  ["/management/teams", "Equipos"],
  ["/management", "Administración"],
  ["/reports/attendance", "Informe de asistencia"],
  ["/reports/performance", "Informe de rendimiento"],
  ["/reports", "Informes"],
  ["/audit", "Historial"],
  ["/people", "Persona"],
  ["/login", "Acceso"],
  ["/activate", "Activar cuenta"],
  ["/no-access", "Sin acceso"],
]

export function routeContext(pathname: string): string {
  let best = "GEI Hockey"
  let bestLen = -1
  for (const [prefix, label] of CONTEXT_BY_PREFIX) {
    const matches =
      pathname === prefix || pathname.startsWith(`${prefix}/`)
    if (matches && prefix.length > bestLen) {
      best = label
      bestLen = prefix.length
    }
  }
  return best
}