import { Link } from "react-router"
import { Button, Empty, Surface } from "../shared/ui"
import { PageContextHeader, SectionHeader } from "../shared/patterns"
import { useHome, useT06Invalidation } from "../lib/use-t06-queries"
import { EMPTY_ATTENTION_COPY } from "../../shared/contracts/t06"

/** Home — orden inmutable: Atención → Hoy → ¿Vas? → Próximamente → Comunicaciones. */
export default function T06Home() {
  const { data, loading, error, reload } = useHome()
  useT06Invalidation(["home", "attention"], reload)

  return (
    <div className="gei-stack-page mx-auto max-w-5xl">
      <PageContextHeader context="Inicio" title="Inicio" lead="Lo que necesita tu atención, lo que pasa hoy y lo que viene." />

      {loading && <p className="gei-meta" role="status">Cargando…</p>}
      {error && (
        <Empty
          title="No se pudo cargar el inicio"
          detail="El servicio no respondió. Podés reintentar sin perder tu lugar."
          action={<Button onClick={() => void reload()}>Reintentar</Button>}
        />
      )}

      {data && (
        <>
          <section aria-labelledby="t06-atencion">
            <SectionHeader id="t06-atencion" title="Necesita tu atención" />
            {data.attention.length === 0 ? (
              <p className="gei-meta" role="status">{EMPTY_ATTENTION_COPY}</p>
            ) : (
              <ul className="grid gap-2" aria-label="Pendientes">
                {data.attention.slice(0, 3).map((item) => (
                  <li key={item.id} className="rounded-surface border border-line bg-surface px-4 py-3">
                    <p className="gei-body-strong">{item.stateText}</p>
                    <p className="gei-meta mt-1">{item.reason}</p>
                    <p className="gei-meta mt-1">{item.consequence}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="gei-meta">{item.severity}</span>
                      {item.deadline && <span className="gei-meta">Hasta {new Date(item.deadline).toLocaleDateString()}</span>}
                      {item.action.to && (
                        <Link className="gei-link-target" to={item.action.to}>{item.action.label}</Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="t06-hoy">
            <SectionHeader id="t06-hoy" title="Hoy" />
            {data.today.length === 0 ? <p className="gei-meta">No hay actividades para hoy.</p> : (
              <ul className="grid gap-2">
                {data.today.map((event) => (
                  <li key={event.id}>
                    {event.to ? <Link className="gei-link-target" to={event.to}>{event.title}</Link> : event.title}
                    <span className="gei-meta ml-2">{event.state === "POSTPONED" ? "A definir" : (event.startAt ? new Date(event.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "")}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="t06-vas">
            <SectionHeader id="t06-vas" title="¿Vas?" />
            {data.inlineAvailability.length === 0 ? <p className="gei-meta">Nada para responder.</p> : (
              <ul className="grid gap-2">
                {data.inlineAvailability.map((item) => (
                  <li key={item.eventId} className="flex flex-wrap items-center justify-between gap-2 rounded-surface border border-line bg-surface px-4 py-3">
                    <span>{item.eventTitle}</span>
                    <span className="gei-meta">{item.state === "NO_RESPONSE" ? "Sin responder" : item.state === "NEEDS_RECONFIRMATION" ? "Reconfirmá" : item.state}</span>
                    <Link className="gei-link-target" to={item.to!}>Responder</Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="t06-proximamente">
            <SectionHeader id="t06-proximamente" title="Próximamente" />
            {data.upcoming.length === 0 ? <p className="gei-meta">No hay actividades próximas.</p> : (
              <ul className="grid gap-2">
                {data.upcoming.map((event) => (
                  <li key={event.id}>
                    {event.to ? <Link className="gei-link-target" to={event.to}>{event.title}</Link> : event.title}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="t06-comunicaciones">
            <SectionHeader id="t06-comunicaciones" title="Comunicaciones" />
            <Surface>
              <p className="gei-meta">Comunicados</p>
              {data.communications.announcements.length === 0 ? <p className="gei-meta">Sin comunicados nuevos.</p> : (
                <ul className="grid gap-1">
                  {data.communications.announcements.map((item) => (
                    <li key={item.id}>{item.to ? <Link className="gei-link-target" to={item.to}>{item.title}</Link> : item.title}</li>
                  ))}
                </ul>
              )}
              <p className="gei-meta mt-3">Conversaciones</p>
              {data.communications.conversations.length === 0 ? <p className="gei-meta">Sin conversaciones.</p> : (
                <ul className="grid gap-1">
                  {data.communications.conversations.map((item) => (
                    <li key={item.id}>
                      {item.to ? <Link className="gei-link-target" to={item.to}>{item.title}</Link> : item.title}
                      {item.unreadCount > 0 && <span className="gei-meta ml-2">{item.unreadCount} sin leer</span>}
                    </li>
                  ))}
                </ul>
              )}
              {/* A-02: notificaciones son contexto/deep link, NUNCA fila de atención. */}
              <p className="gei-meta mt-3" aria-label="Avisos sin leer">{data.communications.unreadCount} avisos sin leer</p>
            </Surface>
          </section>
        </>
      )}
    </div>
  )
}
