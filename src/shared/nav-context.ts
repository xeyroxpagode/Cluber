/**
 * Route → contexto en vocabulario usuario (Stage 4 §40).
 * Mata el breadcrumb genérico "Mi espacio".
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
  ["/events", "Partido o entrenamiento"],
  ["/jornadas/new", "Nueva jornada"],
  ["/jornadas", "Jornada"],
  ["/communication/conversations/new", "Nuevo mensaje"],
  ["/communication/announcements/new", "Nuevo comunicado"],
  ["/communication", "Comunicación"],
  ["/conversations", "Mensajes"],
  ["/announcements", "Comunicados"],
  ["/management/structure", "Estructura del club"],
  ["/management/teams", "Equipo"],
  ["/management/people/new", "Nueva persona"],
  ["/management/people", "Personas"],
  ["/management/competitions", "Competencias"],
  ["/management", "Gestión"],
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
  void CONTEXT_BY_PREFIX;
  let best = "GEI Hockey"
  let bestLen = -1
  for (const [prefix, label] of CONTEXT_BY_PREFIX) {
    if (pathname === prefix || pathname.startsWith(prefix + "/") || pathname === prefix) {
      if (prefix.length > bestLen) {
        best = label
        bestLen = prefix.length
      }
    }
    if (prefix === "/events" && pathname.startsWith("/events/") && bestLen < 7) {
      best = label
      bestLen = 7
    }
  }
  return best
}
