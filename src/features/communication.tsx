import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { Megaphone, MessagesSquare, Send, Users } from "lucide-react"
import { useProduct } from "../mock/store"
import {
  dateLabel,
  dateTimeLabel,
  eventName,
  relativeLabel,
  teamName,
  type Conversation,
  type State,
} from "../mock/model"
import {
  Avatar,
  Banner,
  Button,
  ConfirmDialog,
  Empty,
  Menu,
  RowLink,
  RowStatic,
  SegmentedControl,
  Select,
  Sheet,
  StateBadge,
  Surface,
  TabBar,
  Tag,
  TextArea,
  TextField,
  cx,
} from "../shared/ui"
import { canReadAnnouncement } from "../mock/derive"
import {
  DetailSection,
  HistoryList,
  PageContextHeader,
  SectionHeader,
} from "../shared/patterns"
import { useQueryState } from "../shared/use-query-state"

let nav: ((to: string) => void) | null = null
/** Navegación SPA para helpers fuera del árbol de componentes. */
function useRouter() {
  nav = useNavigate()
}
function go(path: string) {
  if (nav) nav(path)
  else window.location.assign(path)
}

function conversationTitle(
  state: State,
  conversation: Conversation,
  actorId: string,
) {
  if (conversation.kind === "TEAM")
    return `Equipo · ${teamName(state, conversation.teamId)}`
  if (conversation.kind === "EVENT") {
    const event = state.events.find((item) => item.id === conversation.eventId)
    return `Evento · ${event ? eventName(event) : "partido"}`
  }
  if (conversation.kind === "GROUP") return "Grupo"
  return (
    conversation.participants
      .filter((id) => id !== actorId)
      .map((id) => state.people.find((person) => person.id === id)?.name)
      .filter(Boolean)
      .join(", ") || "Conversación"
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMUNICACIÓN HOME — dos canales perceptualmente distintos
   ═══════════════════════════════════════════════════════════════ */

export function CommunicationHome() {
  const { state, authority, actor } = useProduct()
  const query = useQueryState()
  const tab = query.get("tab", "conversaciones")
  useRouter()

  if (!authority.canOpen("communication"))
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="No tenés conversaciones habilitadas"
          detail="La comunicación con el club se habilita por rol."
        />
      </div>
    )

  const conversations = state.conversations
    .filter(
      (conversation) =>
        conversation.state === "ACTIVE" &&
        conversation.participants.includes(actor.id),
    )
    .map((conversation) => ({
      conversation,
      unread: conversation.unread[actor.id] ?? 0,
    }))
    .sort((a, b) => b.unread - a.unread)

  const unreadTotal = conversations.reduce((sum, item) => sum + item.unread, 0)
  const visibleAnnouncements = state.announcements.filter((announcement) => {
    if (announcement.state === "ARCHIVED") return false
    if (authority.canPublishAnnouncement) return true
    return canReadAnnouncement(state, announcement, {
      clubWide: authority.isClubWide,
      teamIds: authority.teamIds,
      coachTeamIds: authority.coachTeamIds,
    })
  })

  return (
    <div className="gei-stack-page mx-auto max-w-4xl">
      <PageContextHeader
        context="Comunicación"
        title="Comunicación"
        lead="Dos cosas distintas: lo que se conversa y lo que el club comunica."
        action={
          <div className="flex flex-wrap gap-2">
            {authority.canChat && (
              <Button
                variant="secondary"
                onClick={() => go("/communication/conversations/new")}
              >
                Nuevo mensaje
              </Button>
            )}
            {authority.canPublishAnnouncement && (
              <Button variant="primary" onClick={() => go("/communication/announcements/new")}>
                <Megaphone size={16} aria-hidden />
                Publicar comunicado
              </Button>
            )}
          </div>
        }
        below={
          <div className="border-b border-line">
            <TabBar
              ariaLabel="Canal de comunicación"
              active={tab}
              onChange={(value) => query.set({ tab: value })}
              tabs={[
                {
                  id: "conversaciones",
                  label: "Conversaciones",
                  count: conversations.filter((item) => item.unread > 0).length,
                },
                {
                  id: "comunicados",
                  label: "Comunicados",
                  count: visibleAnnouncements.filter((item) => item.state === "PUBLISHED")
                    .length,
                },
              ]}
            />
          </div>
        }
      />

      <div className="grid gap-3">
        <SectionHeader
          title={tab === "conversaciones" ? "Conversaciones" : "Comunicados"}
          meta={
            tab === "conversaciones"
              ? conversations.length === 0
                ? undefined
                : `${conversations.length} ${
                    conversations.length === 1 ? "conversación" : "conversaciones"
                  } · las no leídas primero`
              : `${visibleAnnouncements.length} ${
                  visibleAnnouncements.length === 1
                    ? "comunicado vigente"
                    : "comunicados vigentes"
                }`
          }
          aside={
            tab === "conversaciones" && unreadTotal > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2 rounded-pill bg-unread" />
                <span className="text-meta font-semibold text-selected">
                  {unreadTotal} sin leer
                </span>
              </span>
            ) : undefined
          }
        />
      </div>

      {tab === "conversaciones" ? (
        conversations.length === 0 ? (
          <Empty
            title="Todavía no hay conversaciones"
            detail="Cuando tu equipo o un evento tenga conversación, aparece acá."
            icon={<MessagesSquare size={22} />}
          />
        ) : (
          <ul className="grid gap-1">
            {conversations.map(({ conversation, unread }) => {
              const last = conversation.messages.at(-1)
              return (
                <li key={conversation.id}>
                  <RowLink
                    to={`/conversations/${conversation.id}`}
                    title={conversationTitle(state, conversation, actor.id)}
                    detail={last?.deletedAt ? "Mensaje eliminado" : last?.body}
                    leading={
                      conversation.kind === "EVENT" ? (
                        <Megaphone size={18} aria-hidden className="text-ink-faint" />
                      ) : conversation.kind === "TEAM" ? (
                        <Users size={18} aria-hidden className="text-ink-faint" />
                      ) : (
                        <Avatar
                          name={conversationTitle(state, conversation, actor.id)}
                          size="sm"
                          selected={unread > 0}
                        />
                      )
                    }
                    meta={
                      <span className="grid gap-1">
                        {unread > 0 ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span aria-hidden className="size-2 rounded-pill bg-unread" />
                            <span className="text-meta font-semibold text-selected">
                              {unread} sin leer
                            </span>
                          </span>
                        ) : (
                          <span className="gei-meta tabular-nums">
                            {last ? relativeLabel(last.at, new Date()) : ""}
                          </span>
                        )}
                      </span>
                    }
                  />
                </li>
              )
            })}
          </ul>
        )
      ) : visibleAnnouncements.length === 0 ? (
        <Empty
          title="No hay comunicados para vos"
          detail="Los comunicados aparecen según los equipos a los que pertenecés."
          icon={<Megaphone size={22} />}
        />
      ) : (
        <Surface flush>
          <ul className="grid px-1 py-1">
            {visibleAnnouncements.map((announcement) => (
              <li key={announcement.id}>
                <RowLink
                  to={`/announcements/${announcement.id}`}
                  title={announcement.title}
                  detail={
                    <span className="flex flex-wrap items-center gap-2">
                      <Tag tone="selected">
                        Para {announcement.audienceSnapshot?.label ?? "todo el hockey"}
                      </Tag>
                      <span>{dateLabel(announcement.at.slice(0, 10))}</span>
                    </span>
                  }
                  leading={<Megaphone size={18} aria-hidden className="text-ink-faint" />}
                  meta={<StateBadge value={announcement.state} />}
                />
              </li>
            ))}
          </ul>
        </Surface>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   NUEVO MENSAJE DIRECTO — reutiliza la conversación existente
   ═══════════════════════════════════════════════════════════════ */

export function NewConversation() {
  const { state, authority, actor } = useProduct()
  const [params] = useSearchParams()
  const query = useQueryState()
  const [term, setTerm] = useState("")
  void params

  if (!authority.canChat)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="No podés iniciar conversaciones"
          detail="La comunicación se habilita por rol."
        />
      </div>
    )

  const people = state.people.filter(
    (person) =>
      person.id !== actor.id &&
      person.name.toLowerCase().includes(term.trim().toLowerCase()),
  )

  return (
    <div className="gei-stack-page mx-auto max-w-2xl">
      <PageContextHeader
        context="Nuevo mensaje"
        title="Nuevo mensaje"
        back="/communication"
        lead="Elegí con quién querés hablar. Si ya existe una conversación, se abre esa."
      />
      <TextField
        label="Buscar persona"
        value={term}
        placeholder="Nombre"
        onChange={(event) => setTerm(event.target.value)}
      />
      <ul className="grid gap-1">
        {people.slice(0, 12).map((person) => {
          const key = [actor.id, person.id].sort().join("__")
          const existing = state.conversations.find(
            (conversation) =>
              conversation.kind === "DIRECT" &&
              conversation.participants.length === 2 &&
              conversation.participants.slice().sort().join("__") === key,
          )
          return (
            <li key={person.id}>
              <RowLink
                to={existing ? `/conversations/${existing.id}` : `/conversations/new?to=${person.id}`}
                title={person.name}
                detail={
                  existing
                    ? "Ya tienen una conversación: se abre esa."
                    : "Todavía no hablaron."
                }
                leading={<Avatar name={person.name} size="sm" />}
                meta={existing ? <Tag>Conversación existente</Tag> : undefined}
              />
            </li>
          )
        })}
        {people.length === 0 && (
          <li>
            <p className="gei-meta">Sin resultados para “{term}”.</p>
          </li>
        )}
      </ul>
      <Button variant="quiet" onClick={() => query.set({ tab: "conversaciones" })}>
        Volver a comunicación
      </Button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CONVERSACIÓN — composer siempre visible, menú accesible
   ═══════════════════════════════════════════════════════════════ */

export function ConversationPage() {
  const { conversationId } = useParams()
  const [params] = useSearchParams()
  const { state, authority, actor, sendMessage, deleteMessage, markConversationRead } =
    useProduct()
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  useRouter()

  const conversation = state.conversations.find(
    (item) => item.id === conversationId,
  )

  useEffect(() => {
    if (conversation && (conversation.unread[actor.id] ?? 0) > 0)
      markConversationRead(conversation.id)
  }, [conversation, actor.id, markConversationRead])

  if (!conversation)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="Esa conversación ya no existe"
          detail="Puede que se haya archivado."
        />
      </div>
    )

  const canPost =
    authority.canChat && conversation.participants.includes(actor.id)
  const target = params.get("to")
  const targetPerson = state.people.find((person) => person.id === target)
  const messages =
    targetPerson && conversation.messages.length === 0
      ? []
      : conversation.messages

  const conversationId_ = conversation.id
  async function send() {
    const text = body.trim()
    if (!text || sending) return
    setSending(true)
    await sendMessage(conversationId_, text)
    setBody("")
    setSending(false)
    endRef.current?.scrollIntoView({ block: "nearest" })
  }

  return (
    <div className="mx-auto grid h-[calc(100dvh-4rem)] max-w-3xl grid-rows-[auto_minmax(0,1fr)_auto] gap-3 py-4">
      <header className="flex flex-wrap items-center gap-3 border-b border-line pb-3">
        <div className="min-w-0 flex-1">
          <p className="gei-page-context">Conversación</p>
          <h1 className="gei-section-title">
            {conversationTitle(state, conversation, actor.id)}
          </h1>
        </div>
        {conversation.kind === "EVENT" && conversation.eventId && (
          <Button variant="secondary" size="sm" onClick={() => go(`/events/${conversation.eventId}`)}>
            Ver el evento
          </Button>
        )}
        {conversation.kind === "TEAM" && conversation.teamId && (
          <Button variant="secondary" size="sm" onClick={() => go(`/teams/${conversation.teamId}`)}>
            Ver el equipo
          </Button>
        )}
      </header>

      <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <Empty
            title={targetPerson ? `Escribile a ${targetPerson.firstName}` : "Todavía no hay mensajes"}
            detail={
              targetPerson
                ? "Este mensaje abre la conversación entre ustedes dos."
                : "Cuando empiece la conversación, los mensajes aparecen acá."
            }
            icon={<MessagesSquare size={22} />}
          />
        ) : (
          messages.map((message) => {
            const author = state.people.find((person) => person.id === message.author)
            const mine = message.author === actor.id
            return (
              <article
                key={message.id}
                className={cx(
                  "grid gap-1",
                  mine ? "justify-items-end" : "justify-items-start",
                )}
              >
                <div
                  className={cx(
                    "max-w-[85%] rounded-control px-3 py-2",
                    mine ? "bg-selected-soft" : "bg-surface border border-line",
                  )}
                >
                  {!mine && (
                    <p className="text-meta font-semibold text-ink">
                      {author?.name ?? ""}
                    </p>
                  )}
                  <p className="gei-body text-ink-strong">
                    {message.deletedAt ? (
                      <span className="text-ink-muted italic">
                        Mensaje eliminado
                      </span>
                    ) : (
                      message.body
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="gei-meta tabular-nums">
                    {relativeLabel(message.at, new Date())}
                    {message.edited && !message.deletedAt && " · editado"}
                  </span>
                  {mine && !message.deletedAt && (
                    <Menu
                      label="Acciones"
                      items={[
                        {
                          label: "Eliminar mensaje",
                          danger: true,
                          onSelect: () => setDeleting(message.id),
                        },
                      ]}
                    />
                  )}
                </div>
              </article>
            )
          })
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
        className="sticky bottom-14 grid gap-2 border-t border-line bg-surface pt-3 lg:bottom-0"
      >
        {canPost ? (
          <>
            <label htmlFor="composer" className="sr-only">
              Escribí un mensaje
            </label>
            <TextArea
              id="composer"
              label="Mensaje"
              rows={2}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void send()
                }
              }}
              placeholder="Escribí el mensaje…"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary" busy={sending} disabled={!body.trim()}>
                <Send size={16} aria-hidden />
                Enviar
              </Button>
            </div>
          </>
        ) : (
          <p className="gei-meta">
            No podés escribir en esta conversación.
          </p>
        )}
      </form>

      {deleting && (
        <ConfirmDialog
          title="Eliminar mensaje"
          consequence="El mensaje desaparece de la conversación para todos. No se puede deshacer."
          confirmLabel="Eliminar"
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            deleteMessage(conversation.id, deleting)
            setDeleting(null)
          }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMUNICADOS — audiencia real, snapshot inmutable
   ═══════════════════════════════════════════════════════════════ */

export function AnnouncementForm() {
  const { id } = useParams()
  const { state, authority, saveAnnouncement } = useProduct()
  const existing = state.announcements.find((item) => item.id === id)
  const [title, setTitle] = useState(existing?.title ?? "")
  const [body, setBody] = useState(existing?.body ?? "")
  const [clubWide, setClubWide] = useState(
    existing ? existing.audience.kind === "CLUB" : true,
  )
  const [teamIds, setTeamIds] = useState<string[]>(
    existing?.audience.kind === "TEAMS" ? existing.audience.teamIds : [],
  )
  const [reason, setReason] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState<"draft" | "published" | null>(null)
  useRouter()

  if (!authority.canPublishAnnouncement)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="Los comunicados los publica la Subcomisión"
          detail="Es la comunicación oficial del club."
        />
      </div>
    )

  const published = existing?.state === "PUBLISHED"

  function submit(publish: boolean) {
    const found: Record<string, string> = {}
    if (!title.trim()) found.title = "Poné un título."
    if (!body.trim()) found.body = "Escribí el comunicado."
    if (!clubWide && teamIds.length === 0)
      found.audience = "Elegí al menos un equipo, o elegí todo el hockey."
    if (published && !reason.trim())
      found.reason = "Explicá por qué corregís un comunicado ya publicado."
    setErrors(found)
    if (Object.keys(found).length > 0) {
      window.setTimeout(() => {
        const first = document.getElementById(`af-${Object.keys(found)[0]}`)
        first?.focus()
      }, 0)
      return
    }
    setPending(true)
    const result = saveAnnouncement({
      id: existing?.id,
      title,
      body,
      audience: clubWide ? { kind: "CLUB" } : { kind: "TEAMS", teamIds },
      publish,
      reason,
    })
    setPending(false)
    if (result.ok) setDone(publish ? "published" : "draft")
    else setErrors({ form: result.error ?? "No pudimos guardar." })
  }

  return (
    <div className="gei-stack-page mx-auto max-w-2xl">
      <PageContextHeader
        context={published ? "Corregir comunicado" : "Nuevo comunicado"}
        title={published ? `Corregir: ${existing?.title}` : "Nuevo comunicado"}
        back={existing ? `/announcements/${existing.id}` : "/communication"}
        lead={
          published
            ? "La audiencia de un comunicado publicado no se cambia: corregirla requiere publicar uno nuevo."
            : "Elegí a quién le llega antes de publicar."
        }
      />

      {done && (
        <Banner
          tone="success"
          title={done === "published" ? "Comunicado publicado" : "Borrador guardado"}
        >
          <span className="text-ink-strong">
            {done === "published"
              ? "Las personas alcanzadas ya lo ven en su comunicación."
              : "Todavía nadie lo ve. Lo podés publicar cuando esté listo."}
          </span>
        </Banner>
      )}
      {errors.form && (
        <Banner tone="danger" title="No pudimos guardar el comunicado">
          <span className="text-ink-strong">{errors.form}</span>
        </Banner>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit(!published)
        }}
        noValidate
        className="grid gap-5"
      >
        <Surface className="grid gap-4">
          <TextField
            id="af-title"
            label="Título"
            required
            value={title}
            error={errors.title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextArea
            id="af-body"
            label="Cuerpo"
            required
            rows={8}
            value={body}
            error={errors.body}
            onChange={(event) => setBody(event.target.value)}
            hint="Texto plano. Los saltos de línea se respetan."
          />
        </Surface>

        <Surface className="grid gap-4">
          <SectionHeader
            title="Audiencia"
            meta={published ? "Inmutable desde la publicación" : undefined}
          />
          {published ? (
            <Banner tone="neutral" title="La audiencia no se puede cambiar">
              <span className="text-ink-strong">
                Este comunicado se publicó para{" "}
                {existing?.audienceSnapshot?.label}. Si te equivocaste, publicá uno
                nuevo con la audiencia correcta.
              </span>
            </Banner>
          ) : (
            <>
              <SegmentedControl
                ariaLabel="Audiencia del comunicado"
                value={clubWide ? "CLUB" : "TEAMS"}
                onChange={(value) => setClubWide(value === "CLUB")}
                options={[
                  { value: "CLUB", label: "Todo el hockey" },
                  { value: "TEAMS", label: "Equipos concretos" },
                ]}
              />
              {!clubWide && (
                <fieldset className="grid gap-2" id="af-audience">
                  <legend className="text-body font-semibold">Equipos destinatarios</legend>
                  {errors.audience && (
                    <p className="text-meta font-medium text-danger">
                      {errors.audience}
                    </p>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    {state.teams
                      .filter((team) => team.state === "ACTIVE")
                      .map((team) => {
                        const checked = teamIds.includes(team.id)
                        return (
                          <label
                            key={team.id}
                            className={cx(
                              "gei-target flex cursor-pointer items-center gap-2.5 rounded-control border px-3 text-body font-medium transition-colors",
                              checked
                                ? "border-selected-line bg-selected-soft text-selected"
                                : "border-line-strong bg-surface hover:border-ink-faint",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(next) =>
                                setTeamIds((current) =>
                                  next.target.checked
                                    ? [...current, team.id]
                                    : current.filter((id) => id !== team.id),
                                )
                              }
                              className="size-5 accent-interactive"
                            />
                            {teamName(state, team.id)}
                          </label>
                        )
                      })}
                  </div>
                </fieldset>
              )}
              <p className="gei-meta">
                Cuando publiques queda registrada una copia exacta de quién lo va a
                ver. Después no se recalcula.
              </p>
            </>
          )}
        </Surface>

        {published && (
          <Surface className="grid gap-4">
            <TextArea
              id="af-reason"
              label="Por qué lo corregís"
              required
              rows={3}
              value={reason}
              error={errors.reason}
              onChange={(event) => setReason(event.target.value)}
              hint="Queda en el historial junto con la versión anterior."
            />
          </Surface>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="quiet"
            onClick={() => go(existing ? `/announcements/${existing.id}` : "/communication")}
          >
            Cancelar
          </Button>
          {!published && (
            <Button
              type="button"
              variant="secondary"
              busy={pending}
              onClick={() => submit(false)}
            >
              Guardar borrador
            </Button>
          )}
          <Button type="submit" variant="primary" busy={pending}>
            {published ? "Guardar corrección" : "Publicar comunicado"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export function AnnouncementDetail() {
  const { id } = useParams()
  const { state, authority, actor, archiveAnnouncement } = useProduct()
  const [archiving, setArchiving] = useState(false)
  const [sheet, setSheet] = useState(false)
  useRouter()
  const announcement = state.announcements.find((item) => item.id === id)

  if (!announcement)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="Ese comunicado no existe"
          detail="Puede que el enlace esté incompleto."
        />
      </div>
    )

  const snapshot = announcement.audienceSnapshot
  const reached = canReadAnnouncement(state, announcement, {
    clubWide: authority.isClubWide,
    teamIds: authority.teamIds,
    coachTeamIds: authority.coachTeamIds,
  })

  if (!reached && !authority.canPublishAnnouncement)
    return (
      <div className="mx-auto max-w-3xl">
        <Empty
          title="No te corresponde este comunicado"
          detail="Se publicó para otros equipos."
        />
      </div>
    )

  return (
    <div className="gei-stack-page mx-auto max-w-2xl">
      <PageContextHeader
        context="Comunicado"
        title={announcement.title}
        back="/communication"
        lead={`Publicado el ${dateLabel(announcement.at.slice(0, 10), true)} por ${announcement.publisher}`}
        action={
          <div className="flex items-center gap-2">
            <StateBadge value={announcement.state} emphasis />
            {authority.canCorrectAnnouncement() && (
              <Menu
                label="Acciones"
                items={[
                  {
                    label: "Corregir título o cuerpo",
                    onSelect: () => go(`/announcements/${announcement.id}/edit`),
                  },
                  {
                    label: "Archivar",
                    danger: true,
                    onSelect: () => setArchiving(true),
                  },
                ]}
              />
            )}
          </div>
        }
        below={
          snapshot ? (
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="selected">{snapshot.label}</Tag>
              <span className="gei-meta">
                Audiencia registrada al publicar el {dateLabel(snapshot.at.slice(0, 10))}
              </span>
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="gei-target-sm rounded-control px-2 text-meta font-semibold text-interactive hover:bg-selected-soft"
              >
                Quién lo ve
              </button>
            </div>
          ) : undefined
        }
      />

      <article className="grid gap-4">
        {announcement.body.split("\n\n").map((paragraph, index) => (
          <p key={index} className="gei-body text-ink">
            {paragraph}
          </p>
        ))}
      </article>

      {announcement.corrections.length > 0 && (
        <Surface className="grid gap-3">
          <SectionHeader title="Correcciones" />
          <HistoryList
            entries={announcement.corrections.map((correction) => ({
              action: "Corrección de comunicado",
              actor: correction.actor,
              at: dateTimeLabel(correction.at),
              before: correction.before,
              after: correction.after,
              reason: correction.reason,
            }))}
          />
        </Surface>
      )}

      {sheet && snapshot && (
        <Sheet
          title="Quién ve este comunicado"
          description="La audiencia quedó registrada al publicarlo."
          onClose={() => setSheet(false)}
          footer={
            <Button variant="primary" onClick={() => setSheet(false)}>
              Entendido
            </Button>
          }
        >
          <div className="grid gap-2">
            <RowStatic
              title={snapshot.clubWide ? "Todo el hockey" : "Equipos concretos"}
              detail={
                snapshot.clubWide
                  ? "Todas las personas del club con cuenta activa."
                  : snapshot.teamIds
                      .map((teamId) => teamName(state, teamId))
                      .join(", ")
              }
            />
          </div>
        </Sheet>
      )}

      {archiving && (
        <ConfirmDialog
          title="Archivar el comunicado"
          consequence="Deja de aparecer en el canal de todos. Queda guardado como histórico y no se borra."
          confirmLabel="Archivar"
          requireReason
          onClose={() => setArchiving(false)}
          onConfirm={(reason) => {
            archiveAnnouncement(announcement.id, reason)
            setArchiving(false)
            go("/communication")
          }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   AVISOS — no leídos primero, tipo en lenguaje usuario
   ═══════════════════════════════════════════════════════════════ */

const NOTICE_TYPE_TEXT: Record<string, string> = {
  EVENT_CHANGED: "Cambio en un evento",
  EVENT_POSTPONED: "Un evento se postergó",
  EVENT_RESCHEDULED: "Un evento se reprogramó",
  EVENT_CANCELLED: "Un evento se canceló",
  EVENT_RESTORED: "Un evento volvió a estar activo",
  SELECTION_PUBLISHED: "Convocatoria publicada",
  ANNOUNCEMENT_PUBLISHED: "Comunicado del club",
}

export function Notifications() {
  const { state, actor, markNoticeRead, markAllNoticesRead } = useProduct()
  useRouter()
  const mine = useMemo(
    () =>
      state.notifications
        .filter((notice) => notice.recipients.includes(actor.id))
        .sort((a, b) => {
          const aRead = a.readBy.includes(actor.id)
          const bRead = b.readBy.includes(actor.id)
          if (aRead !== bRead) return aRead ? 1 : -1
          return b.at.localeCompare(a.at)
        }),
    [state.notifications, actor.id],
  )
  const unread = mine.filter((notice) => !notice.readBy.includes(actor.id))

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Avisos"
        title="Avisos"
        lead="Lo que cambió y te afecta."
        action={
          unread.length > 0 && (
            <Button variant="secondary" onClick={markAllNoticesRead}>
              Marcar todo como leído
            </Button>
          )
        }
      />

      {mine.length === 0 ? (
        <Empty
          title="No tenés avisos"
          detail="Cuando cambie algo que te afecta, aparece acá."
        />
      ) : (
        <Surface flush>
          <ul className="grid px-1 py-1">
            {mine.map((notice) => {
              const isUnread = !notice.readBy.includes(actor.id)
              return (
                <li key={notice.id}>
                  <RowStatic
                    title={notice.title}
                    detail={
                      <span className="grid gap-1">
                        <span className="text-meta font-semibold uppercase tracking-wide text-ink-faint">
                          {NOTICE_TYPE_TEXT[notice.type] ?? "Aviso del club"}
                        </span>
                        <span>{notice.body}</span>
                      </span>
                    }
                    meta={
                      <span className="grid gap-1 text-right">
                        {isUnread && (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              aria-hidden
                              className="size-2 rounded-pill bg-unread"
                            />
                            <span className="text-meta font-semibold text-selected">
                              Sin leer
                            </span>
                          </span>
                        )}
                        <span className="gei-meta tabular-nums">
                          {relativeLabel(notice.at, new Date())}
                        </span>
                      </span>
                    }
                    trailing={
                      <span className="flex gap-1">
                        {isUnread && (
                          <Button
                            variant="quiet"
                            size="sm"
                            onClick={() => markNoticeRead(notice.id)}
                          >
                            Marcar leído
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            markNoticeRead(notice.id)
                            go(notice.route)
                          }}
                        >
                          Abrir
                        </Button>
                      </span>
                    }
                    className={cx(isUnread && "bg-selected-soft/40")}
                  />
                </li>
              )
            })}
          </ul>
        </Surface>
      )}
    </div>
  )
}