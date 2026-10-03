import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import {
  Megaphone,
  MessageSquare,
  Plus,
  Send,
  CheckCheck,
  MoreHorizontal,
  Users,
  Bell,
  Check,
  Edit3,
  Trash2,
} from "lucide-react"
import { useProduct, wait } from "../mock/store"
import { canReadNotice, noticeRead } from "../mock/permissions"
import { labels, dateLabel } from "../mock/model"
import {
  Header,
  Surface,
  Section,
  Button,
  Avatar,
  Badge,
  RowLink,
  TextField,
  TextArea,
  Select,
  Alert,
  Empty,
  Modal,
  TextLink,
} from "../shared/ui"

export function CommunicationHome() {
  const { state, actor, capabilities } = useProduct()
  const [tab, setTab] = useState("all")
  const announcements = state.announcements.filter(
    (item) => item.state === "PUBLISHED" || capabilities.official,
  )
  const conversations = state.conversations.filter((item) =>
    item.participants.includes(actor.id),
  )
  return (
    <>
      <Header
        title="Comunicación"
        description="Comunicados oficiales y conversaciones de tu equipo."
        action={
          <div className="flex gap-2">
            {capabilities.official && (
              <Link to="/communication/announcements/new">
                <Button>
                  <Plus size={15} />
                  Nuevo comunicado
                </Button>
              </Link>
            )}
            {capabilities.chat && (
              <Link to="/communication/conversations/new">
                <Button variant="secondary">
                  <Plus size={15} />
                  Nueva conversación
                </Button>
              </Link>
            )}
          </div>
        }
      />
      <div className="mb-7 flex gap-6 border-b border-border">
        {[
          ["all", "Todo"],
          ["announcements", "Comunicados"],
          ...(capabilities.chat ? [["conversations", "Conversaciones"]] : []),
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`border-b-2 pb-3 text-xs font-medium ${
              tab === value
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className={`grid items-start gap-8 ${
          tab === "all" && capabilities.chat ? "xl:grid-cols-[1fr_1fr]" : ""
        }`}
      >
        {tab !== "conversations" && (
          <Section
            title="Comunicados oficiales"
            aside={<Megaphone size={17} className="text-muted-foreground" />}
          >
            <Surface>
              {announcements.map((item) => (
                <RowLink
                  key={item.id}
                  to={`/announcements/${item.id}`}
                  title={item.title}
                  detail={`${item.audience} · ${dateLabel(item.date)} · ${item.publisher}`}
                  icon={
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Megaphone size={17} />
                    </span>
                  }
                  aside={
                    item.state === "DRAFT" ? <Badge value="DRAFT" /> : undefined
                  }
                />
              ))}
            </Surface>
          </Section>
        )}
        {tab !== "announcements" && capabilities.chat && (
          <Section
            title="Conversaciones"
            aside={
              <span className="text-[10px] text-muted-foreground">
                Sólo tus conversaciones
              </span>
            }
          >
            {conversations.length ? (
              <Surface>
                {conversations.map((conversation) => {
                  const last = conversation.messages.at(-1)
                  return (
                    <RowLink
                      key={conversation.id}
                      to={`/conversations/${conversation.id}`}
                      title={conversation.title}
                      detail={`${
                        last?.deleted
                          ? "Mensaje eliminado"
                          : last?.body || "Todavía no hay mensajes"
                      }`}
                      icon={
                        <Avatar
                          name={conversation.title}
                          blue={conversation.kind === "TEAM"}
                        />
                      }
                      aside={
                        <div className="text-right">
                          <p className="text-[9px] text-muted-foreground">
                            {last?.time}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="mt-2 inline-flex size-4 items-center justify-center rounded-full bg-primary text-[8px] text-white">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      }
                    />
                  )
                })}
              </Surface>
            ) : (
              <Empty
                title="Todavía no tenés conversaciones"
                detail="Iniciá una conversación directa o creá un grupo para coordinar."
              />
            )}
          </Section>
        )}
      </div>
    </>
  )
}
export function NewConversation() {
  const { state, actor, capabilities, update, toast } = useProduct()
  const navigate = useNavigate()
  const [type, setType] = useState("DIRECT")
  const [title, setTitle] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [query, setQuery] = useState("")
  const [pending, setPending] = useState(false)
  if (!capabilities.chat)
    return (
      <Empty
        title="Conversación no disponible"
        detail="Tu acceso actual no incluye mensajería privada."
      />
    )
  const people = state.people.filter(
    (person) =>
      person.id !== actor.id &&
      person.team === actor.team &&
      ["PLAYER", "CAPTAIN", "COACH"].includes(person.role),
  )
  const valid =
    type === "DIRECT"
      ? selected.length === 1
      : selected.length >= 2 && !!title.trim()
  async function create() {
    setPending(true)
    await wait()
    const existing =
      type === "DIRECT" &&
      state.conversations.find(
        (item) =>
          item.kind === "DIRECT" &&
          item.participants.length === 2 &&
          item.participants.includes(actor.id) &&
          item.participants.includes(selected[0]),
      )
    if (existing) {
      navigate(`/conversations/${existing.id}`)
      return
    }
    const id = crypto.randomUUID()
    update((draft) =>
      draft.conversations.push({
        id,
        title:
          type === "DIRECT"
            ? state.people.find((person) => person.id === selected[0])!.name
            : title,
        kind: type as "DIRECT" | "GROUP",
        participants: [actor.id, ...selected],
        messages: [],
        unread: 0,
      }),
    )
    toast("Conversación creada")
    navigate(`/conversations/${id}`)
  }
  return (
    <>
      <Header
        back="/communication"
        title="Nueva conversación"
        description="Un espacio simple para coordinar con otras personas."
      />
      <Surface className="max-w-2xl space-y-5 p-6">
        <div className="flex gap-2">
          <Button
            variant={type === "DIRECT" ? "primary" : "secondary"}
            onClick={() => {
              setType("DIRECT")
              setSelected([])
            }}
          >
            Conversación directa
          </Button>
          <Button
            variant={type === "GROUP" ? "primary" : "secondary"}
            onClick={() => {
              setType("GROUP")
              setSelected([])
            }}
          >
            Grupo
          </Button>
        </div>
        {type === "GROUP" && (
          <TextField
            label="Nombre del grupo"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        )}
        <TextField
          label={
            type === "DIRECT"
              ? "Elegí una persona"
              : "Participantes (al menos 2 personas más)"
          }
          placeholder="Buscar por nombre…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="max-h-80 overflow-y-auto">
          {people
            .filter((person) =>
              person.name.toLowerCase().includes(query.toLowerCase()),
            )
            .map((person) => (
              <label
                key={person.id}
                className="flex items-center gap-3 border-b border-border py-3 last:border-0"
              >
                <Avatar name={person.name} size="sm" />
                <span className="flex-1 text-xs">{person.name}</span>
                <input
                  type={type === "DIRECT" ? "radio" : "checkbox"}
                  name="participant"
                  checked={selected.includes(person.id)}
                  onChange={() =>
                    setSelected((previous) =>
                      type === "DIRECT"
                        ? [person.id]
                        : previous.includes(person.id)
                          ? previous.filter((id) => id !== person.id)
                          : [...previous, person.id],
                    )
                  }
                  className="size-4 accent-primary"
                />
              </label>
            ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {selected.length}{" "}
          {selected.length === 1
            ? "persona seleccionada"
            : "personas seleccionadas"}
        </p>
        <Button disabled={!valid || pending} onClick={create}>
          {pending ? "Creando…" : "Crear conversación"}
        </Button>
      </Surface>
    </>
  )
}
export function ConversationPage() {
  const { id } = useParams()
  const { state, actor, update, toast } = useProduct()
  const [body, setBody] = useState("")
  const [pending, setPending] = useState(false)
  const [menu, setMenu] = useState("")
  const [edit, setEdit] = useState("")
  const [editBody, setEditBody] = useState("")
  const [previous, setPrevious] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)
  const conversation = state.conversations.find((item) => item.id === id)
  useEffect(() => {
    if (conversation?.participants.includes(actor.id) && conversation.unread)
      update((draft) => {
        const item = draft.conversations.find((item) => item.id === id)
        if (item) item.unread = 0
      })
  }, [id])
  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [conversation?.messages.length])
  if (!conversation || !conversation.participants.includes(actor.id))
    return (
      <Empty
        title="Conversación no disponible"
        detail="Sólo las personas participantes tienen acceso a esta conversación."
      />
    )
  async function send() {
    if (!body.trim() || !conversation) return
    setPending(true)
    await wait(200)
    update((draft) =>
      draft.conversations
        .find((item) => item.id === id)!
        .messages.push({
          id: crypto.randomUUID(),
          author: actor.id,
          body: body.trim(),
          time: new Date().toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }),
    )
    setBody("")
    setPending(false)
  }
  return (
    <>
      <Header
        back="/communication"
        title={conversation.title}
        description={`${
          conversation.kind === "TEAM"
            ? "Conversación del equipo"
            : conversation.kind === "EVENT"
              ? "Conversación del evento"
              : conversation.kind === "DIRECT"
                ? "Conversación directa"
                : "Grupo"
        } · ${conversation.participants.length} participantes`}
      />
      <Surface className="flex h-[calc(100dvh-280px)] min-h-[420px] max-w-4xl flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-7">
          <div className="mb-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setPrevious(true)}
              disabled={previous}
            >
              {previous
                ? "Llegaste al inicio de la conversación"
                : "Cargar mensajes anteriores"}
            </Button>
            <span className="mt-3 block text-[10px] text-muted-foreground">
              Hoy · 2 de octubre
            </span>
          </div>
          {previous && (
            <p className="mb-5 text-center text-[10px] text-muted-foreground">
              Esta conversación se creó el 1 de octubre. No hay mensajes
              anteriores.
            </p>
          )}
          {conversation.messages.length ? (
            conversation.messages.map((message) => {
              const own = message.author === actor.id
              const author = state.people.find(
                (person) => person.id === message.author,
              )
              return (
                <div
                  key={message.id}
                  className={`mb-5 flex items-start gap-2.5 ${
                    own ? "justify-end" : ""
                  }`}
                >
                  {!own && (
                    <Avatar name={author?.name || "Persona"} size="sm" />
                  )}
                  <div
                    className={`relative max-w-[85%] rounded-xl px-4 py-3 sm:max-w-[70%] ${
                      own
                        ? "rounded-tr-sm bg-primary-soft"
                        : "rounded-tl-sm border border-border bg-card"
                    }`}
                  >
                    {!own && (
                      <p className="mb-1.5 text-[10px] font-semibold text-primary">
                        {author?.name}
                      </p>
                    )}
                    <p
                      className={`whitespace-pre-wrap text-xs leading-relaxed ${
                        message.deleted ? "italic text-muted-foreground" : ""
                      }`}
                    >
                      {message.deleted
                        ? "Este mensaje fue eliminado."
                        : message.body}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-1.5 text-[9px] text-muted-foreground">
                      {message.edited && !message.deleted && (
                        <span>Editado ·</span>
                      )}
                      {message.time}
                      {own && !message.deleted && (
                        <>
                          <CheckCheck size={12} />
                          <button
                            aria-label="Acciones del mensaje"
                            onClick={() =>
                              setMenu(menu === message.id ? "" : message.id)
                            }
                          >
                            <MoreHorizontal size={14} />
                          </button>
                        </>
                      )}
                    </div>
                    {menu === message.id && (
                      <div className="absolute right-0 top-full z-10 w-32 rounded-lg border border-border bg-card p-1 shadow-lg">
                        <button
                          className="block w-full p-2 text-left text-xs hover:bg-muted"
                          onClick={() => {
                            setEdit(message.id)
                            setEditBody(message.body)
                            setMenu("")
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="block w-full p-2 text-left text-xs text-danger hover:bg-danger-soft"
                          onClick={async () => {
                            await wait()
                            update((draft) => {
                              const item = draft.conversations
                                .find((item) => item.id === id)!
                                .messages.find(
                                  (item) => item.id === message.id,
                                )!
                              item.deleted = true
                              item.body = ""
                            })
                            setMenu("")
                            toast("Mensaje eliminado")
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="py-20 text-center">
              <MessageSquare
                className="mx-auto mb-3 text-muted-foreground"
                size={24}
              />
              <p className="text-xs text-muted-foreground">
                La conversación está lista. Enviá el primer mensaje.
              </p>
            </div>
          )}
          <div ref={bottom} />
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            send()
          }}
          className="flex items-center gap-3 border-t border-border p-4"
        >
          <input
            aria-label="Mensaje"
            placeholder="Escribí un mensaje…"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-4 py-3 text-xs"
          />
          <Button
            type="submit"
            disabled={!body.trim() || pending}
            aria-label="Enviar mensaje"
          >
            <Send size={17} />
          </Button>
        </form>
      </Surface>
      {edit && (
        <Modal
          title="Editar mensaje"
          onClose={() => setEdit("")}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEdit("")}>
                Volver
              </Button>
              <Button
                disabled={!editBody.trim() || pending}
                onClick={async () => {
                  setPending(true)
                  await wait()
                  update((draft) => {
                    const item = draft.conversations
                      .find((item) => item.id === id)!
                      .messages.find((item) => item.id === edit)!
                    item.body = editBody
                    item.edited = true
                  })
                  setPending(false)
                  setEdit("")
                  toast("Mensaje editado")
                }}
              >
                Guardar cambio
              </Button>
            </>
          }
        >
          <TextArea label="Mensaje" value={editBody} onChange={setEditBody} />
        </Modal>
      )}
    </>
  )
}

export function AnnouncementDetail() {
  const { id } = useParams()
  const { state, capabilities, update, toast } = useProduct()
  const announcement = state.announcements.find((item) => item.id === id)
  const [archive, setArchive] = useState(false)
  const [pending, setPending] = useState(false)
  if (
    !announcement ||
    (announcement.state === "DRAFT" && !capabilities.official)
  )
    return (
      <Empty
        title="Comunicado no disponible"
        detail="No encontramos un comunicado publicado en tu alcance."
      />
    )
  return (
    <>
      <Header
        back="/communication"
        eyebrow="Comunicado oficial"
        title={announcement.title}
        action={
          capabilities.official && (
            <Link to={`/announcements/${id}/edit`}>
              <Button variant="secondary">
                <Edit3 size={14} />
                {announcement.state === "PUBLISHED"
                  ? "Corregir"
                  : "Editar borrador"}
              </Button>
            </Link>
          )
        }
      />
      <Surface className="max-w-3xl p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Avatar name={announcement.publisher} blue />
          <div>
            <p className="text-xs font-semibold">{announcement.publisher}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {dateLabel(announcement.date)} · {announcement.audience}
            </p>
          </div>
          <span className="ml-auto">
            <Badge value={announcement.state} />
          </span>
        </div>
        <p className="whitespace-pre-wrap text-[14px] leading-[1.9]">
          {announcement.body}
        </p>
        <div className="mt-8 flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
          <Megaphone size={16} />
          Comunicación oficial · GEI Hockey
        </div>
      </Surface>
      {capabilities.official && announcement.state === "PUBLISHED" && (
        <Button
          variant="ghost"
          className="mt-5"
          onClick={() => setArchive(true)}
        >
          Archivar comunicado
        </Button>
      )}
      {archive && (
        <Modal
          title="Archivar comunicado"
          onClose={() => setArchive(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setArchive(false)}>
                Volver
              </Button>
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true)
                  await wait()
                  update(
                    (draft) =>
                      (draft.announcements.find(
                        (item) => item.id === id,
                      )!.state = "ARCHIVED"),
                    "Archivar comunicado",
                    announcement.title,
                  )
                  setArchive(false)
                  setPending(false)
                  toast("Comunicado archivado. Su historia se conserva.")
                }}
              >
                Archivar
              </Button>
            </>
          }
        >
          <p className="text-sm">
            El comunicado dejará de aparecer entre los comunicados vigentes. Su
            publicación e historial se conservarán.
          </p>
        </Modal>
      )}
    </>
  )
}
export function AnnouncementForm() {
  const { id } = useParams()
  const { state, actor, capabilities, update, notify, toast } = useProduct()
  const navigate = useNavigate()
  const original = state.announcements.find((item) => item.id === id)
  const [title, setTitle] = useState(original?.title || "")
  const [body, setBody] = useState(original?.body || "")
  const [audience, setAudience] = useState(original?.audience || "Todo hockey")
  const [reason, setReason] = useState("")
  const [confirm, setConfirm] = useState(false)
  const [pending, setPending] = useState(false)
  const correction = original?.state === "PUBLISHED"
  if (
    !capabilities.official ||
    (id && (!original || original.state === "ARCHIVED"))
  )
    return (
      <Empty
        title="Publicación no disponible"
        detail="Los comunicados oficiales corresponden a la Subcomisión. Los comunicados archivados no se editan."
      />
    )
  async function save(publish: boolean) {
    setPending(true)
    await wait()
    const resourceId = id || crypto.randomUUID()
    update(
      (draft) => {
        const current = draft.announcements.find((item) => item.id === id)
        if (current) {
          current.title = title
          current.body = body
          if (!correction) {
            current.audience = audience
            current.state = publish ? "PUBLISHED" : "DRAFT"
          }
        } else
          draft.announcements.push({
            id: resourceId,
            title,
            body,
            audience,
            state: publish ? "PUBLISHED" : "DRAFT",
            publisher: `${actor.name} · Subcomisión`,
            date: "2026-10-02",
          })
      },
      correction
        ? "Corregir comunicado"
        : publish
          ? "Publicar comunicado"
          : "Guardar comunicado borrador",
      title,
      reason,
    )
    if (publish && !correction)
      notify("Comunicado publicado", title, `/announcements/${resourceId}`)
    toast(
      correction
        ? "Corrección guardada"
        : publish
          ? "Comunicado publicado"
          : "Borrador guardado",
    )
    navigate(`/announcements/${resourceId}`)
  }
  return (
    <>
      <Header
        back={id ? `/announcements/${id}` : "/communication"}
        title={
          correction
            ? "Corregir comunicado"
            : original
              ? "Editar borrador"
              : "Nuevo comunicado"
        }
        description="Una comunicación oficial, clara y dirigida a las personas correctas."
      />
      <Surface className="max-w-3xl space-y-6 p-6">
        <TextField
          label="Título"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextArea label="Contenido" value={body} onChange={setBody} />
        <Select
          label="Audiencia"
          value={audience}
          disabled={correction}
          onChange={(event) => setAudience(event.target.value)}
        >
          <option>Todo hockey</option>
          <option>Sexta A</option>
          <option>Quinta A + Sexta A</option>
        </Select>
        {correction && (
          <>
            <Alert tone="info">
              La audiencia publicada no puede modificarse. Si fue incorrecta,
              corresponde crear un comunicado nuevo.
            </Alert>
            <TextArea
              label="Motivo de corrección"
              value={reason}
              onChange={setReason}
            />
          </>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          {!correction && (
            <Button
              variant="secondary"
              disabled={!title.trim() || pending}
              onClick={() => save(false)}
            >
              Guardar borrador
            </Button>
          )}
          <Button
            disabled={
              !title.trim() ||
              !body.trim() ||
              pending ||
              (correction && !reason.trim())
            }
            onClick={() => (correction ? save(false) : setConfirm(true))}
          >
            {pending
              ? "Guardando…"
              : correction
                ? "Guardar corrección"
                : "Publicar"}
          </Button>
        </div>
      </Surface>
      {confirm && (
        <Modal
          title="Publicar comunicado"
          onClose={() => !pending && setConfirm(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirm(false)}>
                Volver
              </Button>
              <Button disabled={pending} onClick={() => save(true)}>
                {pending ? "Publicando…" : "Confirmar publicación"}
              </Button>
            </>
          }
        >
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Audiencia: {audience}. Se enviará una notificación a las personas
            destinatarias. La audiencia quedará fija en esta publicación.
          </p>
        </Modal>
      )}
    </>
  )
}
export function Notifications() {
  const { state, actor, update } = useProduct()
  const navigate = useNavigate()
  const [filter, setFilter] = useState("all")
  const notices = state.notifications.filter(
    (item) =>
      canReadNotice(actor, item) &&
      (filter === "all" || !noticeRead(actor, item)),
  )
  return (
    <>
      <Header
        title="Notificaciones"
        description="Cambios importantes y comunicaciones oficiales."
        action={
          <Button
            variant="secondary"
            disabled={
              !state.notifications.some(
                (item) =>
                  canReadNotice(actor, item) && !noticeRead(actor, item),
              )
            }
            onClick={() =>
              update((draft) =>
                draft.notifications
                  .filter((item) => canReadNotice(actor, item))
                  .forEach((item) => {
                    item.readBy = [
                      ...new Set([...(item.readBy || []), actor.id]),
                    ]
                  }),
              )
            }
          >
            <Check size={14} />
            Marcar todas como leídas
          </Button>
        }
      />
      <div className="mb-5 flex gap-3">
        {[
          ["all", "Todas"],
          ["unread", "Sin leer"],
        ].map(([value, label]) => (
          <Button
            key={value}
            variant={filter === value ? "primary" : "secondary"}
            onClick={() => setFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>
      {notices.length ? (
        <Surface>
          {notices.map((notice) => (
            <button
              key={notice.id}
              onClick={() => {
                update((draft) => {
                  const item = draft.notifications.find(
                    (item) => item.id === notice.id,
                  )!
                  item.readBy = [...new Set([...(item.readBy || []), actor.id])]
                })
                navigate(notice.route)
              }}
              className={`flex w-full items-start gap-4 border-b border-border p-5 text-left last:border-0 hover:bg-muted ${
                !noticeRead(actor, notice) ? "bg-primary-soft/30" : ""
              }`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Bell size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">
                  {notice.title}
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                  {notice.body}
                </span>
                <span className="mt-2 block text-[10px] text-muted-foreground">
                  {notice.date}
                </span>
              </span>
              {!noticeRead(actor, notice) && (
                <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </Surface>
      ) : (
        <Empty
          title="Estás al día"
          detail={
            filter === "unread"
              ? "No tenés notificaciones sin leer."
              : "Los cambios importantes aparecerán acá."
          }
        />
      )}
    </>
  )
}
