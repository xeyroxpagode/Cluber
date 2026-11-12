/**
 * ¿Vas? — disponibilidad (T04). DG-04 llega con T04; en T03 no existe backend
 * de disponibilidad, así que estos componentes muestran el estado honesto
 * en lugar de simular datos.
 */

export type VasValue = "YES" | "MAYBE" | "NO"

export const VAS_LABELS: Record<string, string> = {
  YES: "Voy",
  MAYBE: "Tal vez",
  NO: "No voy",
  NO_RESPONSE: "Sin respuesta",
  NEEDS_RECONFIRMATION: "Hay que volver a confirmar",
}

export function VasControl() {
  return (
    <p className="gei-meta rounded-control border border-line bg-control px-3 py-2">
      La confirmación de asistencia llega con la próxima etapa (T04). Mientras tanto, los
      equipos ven el calendario y los cambios del evento.
    </p>
  )
}

export function VasCompact() {
  return <p className="gei-meta">Asistencia: disponible con la T04</p>
}
