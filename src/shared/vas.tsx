/**
 * ¿Vas? — disponibilidad (T04). La disponibilidad ya tiene backend propio: estos
 * componentes remiten a la superficie real en lugar de simular datos.
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
      La disponibilidad se registra desde la pantalla del evento: abrí “Disponibilidad”
      para confirmar si vas, y el club ve el estado en tiempo real.
    </p>
  )
}

export function VasCompact() {
  return <p className="gei-meta">Disponibilidad: registrada desde el evento</p>
}
