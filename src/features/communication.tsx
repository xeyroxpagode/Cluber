import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { Bell, Check, ChevronLeft, Megaphone, MessagesSquare, Pencil, Plus, Send, Trash2 } from "lucide-react"
import { useFetch } from "../lib/use-fetch"
import { ApiError } from "../lib/api"
import { getCsrfToken } from "../lib/session"
import { useProduct } from "../lib/session-context"
import {
  fetchMarkNotificationRead,
  fetchNotificationList,
  subscribeRealtime,
  type NotificationDto,
} from "../lib/t03-api"
import { fetchManagementPeople, fetchStructure, type StructureSnapshot } from "../lib/api-client"
import { fetchCalendarRange } from "../lib/t03-api"
import { relativeLabel } from "../lib/dates"
import {
  AnnouncementDto, ConversationDto, ConversationListItem, MessageDto,
  archiveAnnouncement, archiveConversation, correctAnnouncement, createGroup,
  deleteMessage, editMessage, fetchAnnouncement, fetchAnnouncementList, fetchConversation,
  fetchConversationList, fetchThread, newKey, openDirect, openTeamEvent,
  publishAnnouncement, saveDraft, sendMessage,
} from "../lib/t05-api"
import {
  Banner,
  Button,
  Checkbox,
  Empty,
  RadioGroup,
  RowLink,
  RowStatic,
  SegmentedControl,
  Surface,
  TabBar,
  Tag,
  TextArea,
  TextField,
  cx,
} from "../shared/ui"
import { PageContextHeader } from "../shared/patterns"
import { useUnreadCount } from "../lib/use-unread-count"

const NOTICE_TYPE_TEXT: Record<NotificationDto["type"], string> = {
  EVENT_CHANGED: "Cambio en el evento",
  EVENT_POSTPONED: "Evento postergado",
  EVENT_RESCHEDULED: "Evento reprogramado",
  EVENT_CANCELLED: "Evento cancelado",
  EVENT_RESTORED: "Evento restaurado",
  SELECTION_PUBLISHED: "Convocatoria publicada",
  ANNOUNCEMENT_PUBLISHED: "Anuncio publicado",
}

function errorText(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return fallback
}

function useCommunicationRefresh(invalidate: string[], reload: () => void) {
  useEffect(() => {
    const stop = subscribeRealtime((event) => {
      if (event.invalidate?.some((key) => invalidate.includes(key) || key.startsWith("conversation:"))) reload()
    })
    return stop
  }, [invalidate.join("|"), reload])
}

/* ───────────────────────────── R21 — HUB ───────────────────────────── */

export function CommunicationHome() {
  const [tab, setTab] = useState<"conversaciones" | "comunicados">("conversaciones")
  const { authority } = useProduct()
  const { data: conversations, loading: loadingC, error: errorC, reload: reloadC } = useFetch(
    () => fetchConversationList(), [],
  )
  const { data: announcements, loading: loadingA, error: errorA, reload: reloadA } = useFetch(
    () => fetchAnnouncementList(Boolean(authority.roles.includes("SUBCOMMITTEE"))), [authority.roles.includes("SUBCOMMITTEE")],
  )
  const { unread, reload: reloadBadge } = useUnreadCount()
  useCommunicationRefresh(["conversations", "communication", "notifications"], () => {
    void reloadC(); void reloadA(); void reloadBadge()
  })

  const canCreateAnnouncement = Boolean(authority.roles.includes("SUBCOMMITTEE"))
  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Comunicación"
        title="Comunicación"
        lead="Conversaciones y comunicados del club."
      />
      <div className="sticky top-0 z-10 -mx-1 flex items-center justify-between gap-2 bg-page/95 px-1 py-2 backdrop-blur">
        <TabBar
          tabs={[
            { id: "conversaciones", label: "Conversaciones", count: conversations?.items.length },
            { id: "comunicados", label: "Comunicados", count: announcements?.items.length },
          ]}
          active={tab}
          onChange={(id) => setTab(id as typeof tab)}
          ariaLabel="Canales de comunicación"
        />
        {tab === "conversaciones" ? (
          <Link to="/communication/conversations/new" className="gei-target inline-flex items-center gap-1.5 rounded-control bg-interactive px-3 text-body font-semibold text-white">
            <Plus size={16} aria-hidden /> Nuevo mensaje
          </Link>
        ) : canCreateAnnouncement ? (
          <Link to="/communication/announcements/new" className="gei-target inline-flex items-center gap-1.5 rounded-control bg-interactive px-3 text-body font-semibold text-white">
            <Plus size={16} aria-hidden /> Nuevo comunicado
          </Link>
        ) : null}
      </div>

      {tab === "conversaciones" ? (
        <section aria-label="Conversaciones" className="grid gap-2">
          {loadingC && <p className="gei-meta">Cargando conversaciones…</p>}
          {errorC && <Banner tone="danger" title="No se pudieron cargar las conversaciones">{errorText(errorC, "Error")}</Banner>}
          {!loadingC && !errorC && (conversations?.items.length ?? 0) === 0 && (
            <Empty title="Todavía no tenés conversaciones" detail="Iniciá un mensaje para empezar." />
          )}
          {conversations?.items.map((item: ConversationListItem) => (
            <RowLink
              key={item.id}
              to={`/conversations/${item.id}`}
              title={item.title || contextTitle(item)}
              detail={<span className="text-meta text-ink-muted">{typeLabel(item.type)} · {item.participantCount} participantes</span>}
              meta={<span className="grid gap-1 text-right">
                {item.unreadCount > 0 && (
                  <Tag tone="selected"><span aria-label={`${item.unreadCount} mensajes sin leer`}>{item.unreadCount} sin leer</span></Tag>
                )}
                <span className="gei-meta tabular-nums">{relativeLabel(item.lastActivityAt)}</span>
              </span>}
              leading={<MessagesSquare size={18} aria-hidden className="text-ink-faint" />}
            />
          ))}
          {(unread ?? 0) > 0 && <p className="gei-meta">{unread} avisos sin leer en <Link className="text-interactive hover:underline" to="/notifications">Avisos</Link></p>}
        </section>
      ) : (
        <section aria-label="Comunicados" className="grid gap-2">
          {loadingA && <p className="gei-meta">Cargando comunicados…</p>}
          {errorA && <Banner tone="danger" title="No se pudieron cargar los comunicados">{errorText(errorA, "Error")}</Banner>}
          {!loadingA && !errorA && (announcements?.items.length ?? 0) === 0 && (
            <Empty title="No hay comunicados para vos" detail="Cuando se publique uno para tu audiencia, aparece acá." />
          )}
          {announcements?.items.map((item) => (
            <RowLink
              key={item.id}
              to={`/announcements/${item.id}`}
              title={item.title}
              detail={<span className="grid gap-1">
                <span className="text-meta font-semibold uppercase tracking-wide text-ink-faint">
                  {item.clubWide ? "Todo el club" : `${item.audienceSnapshot.length} equipos`}
                </span>
                <span className="line-clamp-2 text-meta text-ink-muted">{item.body}</span>
              </span>}
              meta={<span className="grid gap-1 text-right">
                {item.state === "DRAFT" && <Tag tone="warning">Borrador</Tag>}
                {item.state === "ARCHIVED" && <Tag>Archivado</Tag>}
                {item.readState && !item.readState.readAt && <Tag tone="selected">Sin leer</Tag>}
                <span className="gei-meta tabular-nums">{item.publishedAt ? relativeLabel(item.publishedAt) : "—"}</span>
              </span>}
              leading={<Megaphone size={18} aria-hidden className="text-ink-faint" />}
            />
          ))}
        </section>
      )}
    </div>
  )
}

function contextTitle(item: ConversationListItem): string {
  if (item.type === "TEAM") return "Conversación de equipo"
  if (item.type === "EVENT") return "Conversación de partido"
  return "Conversación"
}
function typeLabel(type: ConversationDto["type"]): string {
  return { DIRECT: "Directo", GROUP: "Grupo", TEAM: "Equipo", EVENT: "Partido" }[type]
}

/* ───────────────────────────── R22 — NEW CONVERSATION ───────────────────────────── */

type ConvType = "DIRECT" | "GROUP" | "TEAM" | "EVENT"

export function NewConversation() {
  const navigate = useNavigate()
  const [type, setType] = useState<ConvType>("DIRECT")
  const [query, setQuery] = useState("")
  const [targets, setTargets] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const { data: people } = useFetch(() => fetchManagementPeople(), [])
  const { data: structure } = useFetch(() => fetchStructure(), [])
  const { data: events } = useFetch(() => fetchCalendarRange({
    from: new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10),
    to: new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10),
    limit: 100,
  }), [])

  const personItems = people?.items ?? []
  const teamItems = structure?.teams ?? []
  const eventItems = events?.items ?? []
  const candidates = type === "TEAM"
    ? teamItems.map((t) => ({ id: t.id, name: t.name || "Equipo" }))
    : type === "EVENT"
      ? eventItems.map((e) => ({ id: e.id, name: e.title }))
      : personItems.map((p) => ({ id: p.id, name: `${p.firstName} ${p.lastName}` }))
  const filtered = candidates.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
  const summary = targets.length === 0
    ? "Elegí al menos un destinatario."
    : type === "DIRECT" ? `Conversación con ${candidates.find((c) => c.id === targets[0])?.name ?? "…"}`
      : type === "GROUP" ? `Grupo: ${targets.map((id) => candidates.find((c) => c.id === id)?.name).join(", ")}`
        : `${type === "TEAM" ? "Equipo" : "Partido"}: ${candidates.find((c) => c.id === targets[0])?.name ?? "…"}`

  function toggle(id: string) {
    setTargets((current) => type === "GROUP"
      ? current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
      : [id])
  }

  async function create() {
    setError(null); setNotice(null); setBusy(true)
    try {
      let conv: ConversationDto
      if (type === "DIRECT") conv = await openDirect(targets[0])
      else if (type === "GROUP") conv = await createGroup(title.trim(), targets)
      else conv = await openTeamEvent(type, targets[0])
      navigate(`/conversations/${conv.id}`, { state: { notice: "Conversación lista" } })
    } catch (e) {
      if (e instanceof ApiError && e.code === "DUPLICATE_CONVERSATION") setNotice("Ya tenés una conversación con esa composición.")
      else setError(errorText(e, "No se pudo crear la conversación"))
    } finally { setBusy(false) }
  }

  const valid = targets.length >= (type === "GROUP" ? 2 : 1) && (type !== "GROUP" || title.trim().length > 0)
  return (
    <div className="gei-stack-page mx-auto max-w-2xl">
      <PageContextHeader context="Comunicación" title="Nueva conversación" back="/communication" />
      <Surface className="grid gap-4">
        <SegmentedControl
          ariaLabel="Tipo de conversación"
          value={type}
          onChange={(v) => { setType(v as ConvType); setTargets([]); setQuery("") }}
          options={[{ value: "DIRECT", label: "Directo" }, { value: "GROUP", label: "Grupo" }, { value: "TEAM", label: "Equipo" }, { value: "EVENT", label: "Partido" }]}
        />
        {type === "GROUP" && <TextField id="group-title" label="Título del grupo" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Subcomisión de prensa" />}
        <TextField id="conv-search" label="Buscar destinatarios" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre" />
        <div className="grid max-h-72 gap-1 overflow-y-auto rounded-surface border border-line p-2" role="group" aria-label="Destinatarios">
          {filtered.length === 0 && <p className="gei-meta p-2">No hay resultados con ese nombre.</p>}
          {filtered.map((c) => (
            <label key={c.id} className="gei-target flex items-center gap-3 rounded-control px-2 hover:bg-control">
              {type === "GROUP"
                ? <Checkbox checked={targets.includes(c.id)} onChange={() => toggle(c.id)} label={c.name} />
                : <input type="radio" name="conv-target" checked={targets[0] === c.id} onChange={() => toggle(c.id)} aria-label={c.name} />}
              <span className="text-body">{c.name}</span>
            </label>
          ))}
        </div>
        <Surface className="bg-control"><p className="gei-body-strong">{summary}</p></Surface>
        {notice && <Banner tone="warning" title="Aviso">{notice}</Banner>}
        {error && <Banner tone="danger" title="No se pudo crear">{error}</Banner>}
      </Surface>
      <div className="sticky bottom-20 z-10 flex justify-end bg-page/95 py-3 backdrop-blur lg:bottom-4">
        <Button variant="primary" busy={busy} disabled={!valid} onClick={() => void create()}>Crear conversación</Button>
      </div>
    </div>
  )
}

/* ───────────────────────────── R23/R25 — ANNOUNCEMENT FORM ───────────────────────────── */

export function AnnouncementForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: structure } = useFetch(() => fetchStructure(), [])
  const { data: loaded, loading, error: loadError } = useFetch(
    () => (id ? fetchAnnouncement(id) : Promise.resolve(null)), [id],
  )
  const [state, setState] = useState<{
    title: string; body: string; clubWide: boolean; teamIds: string[]; reason: string; version?: number
  }>({ title: "", body: "", clubWide: false, teamIds: [], reason: "" })
  const [mode, setMode] = useState<"create" | "draft" | "correct">("create")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loaded) return
    setState({ title: loaded.title, body: loaded.body, clubWide: loaded.clubWide, teamIds: loaded.audienceSnapshot, reason: "", version: loaded.version })
    setMode(loaded.state === "DRAFT" ? "draft" : "correct")
  }, [loaded])

  const teamItems = structure?.teams ?? []
  const valid = state.title.trim().length > 0 && state.body.trim().length > 0 &&
    (mode === "correct" ? state.reason.trim().length > 0 : state.clubWide || state.teamIds.length > 0)

  async function persist(publish: boolean) {
    setBusy(true); setError(null)
    try {
      let result: AnnouncementDto
      if (mode === "correct") {
        result = await correctAnnouncement(id!, { title: state.title, body: state.body, reason: state.reason, expectedVersion: state.version })
      } else {
        result = await saveDraft({ announcementId: mode === "draft" ? id : undefined, expectedVersion: state.version, title: state.title, body: state.body, clubWide: state.clubWide, teamIds: state.teamIds })
        if (publish) result = await publishAnnouncement(result.id)
      }
      navigate(`/announcements/${result.id}`)
    } catch (e) {
      setError(errorText(e, "No se pudo guardar"))
    } finally { setBusy(false) }
  }

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Comunicación"
        title={mode === "correct" ? "Corregir comunicado" : mode === "draft" ? "Editar borrador" : "Nuevo comunicado"}
        back={id ? `/announcements/${id}` : "/communication"}
      />
      {loading && <p className="gei-meta">Cargando comunicado…</p>}
      {loadError && <Banner tone="danger" title="No se pudo cargar">{errorText(loadError, "Error")}</Banner>}
      <Surface className="grid gap-4">
        {mode === "correct" && (
          <Banner tone="warning" title="Audiencia publicada, no modificable">
            Este comunicado ya fue publicado. Solo podés cambiar título y cuerpo; cada corrección incrementa la revisión y queda en el historial.
          </Banner>
        )}
        {mode !== "correct" && (
          <fieldset className="grid gap-2">
            <legend className="gei-section-title">1. Audiencia</legend>
            <RadioGroup
              legend="Tipo de audiencia" name="audience" value={state.clubWide ? "club" : "teams"}
              onChange={(v) => setState((s) => ({ ...s, clubWide: v === "club", teamIds: v === "club" ? [] : s.teamIds }))}
              options={[{ value: "club", label: "Todo el club (intención explícita)" }, { value: "teams", label: "Equipos específicos" }]}
            />
            {!state.clubWide && (
              <div className="grid gap-1 rounded-surface border border-line p-2" role="group" aria-label="Equipos destinatarios">
                {teamItems.map((t) => (
                  <label key={t.id} className="gei-target flex items-center gap-2 rounded-control px-2">
                    <Checkbox
                      checked={state.teamIds.includes(t.id)}
                      onChange={() => setState((s) => ({ ...s, teamIds: s.teamIds.includes(t.id) ? s.teamIds.filter((x) => x !== t.id) : [...s.teamIds, t.id] }))}
                      label={t.name || "Equipo"}
                    />
                  </label>
                ))}
              </div>
            )}
            <p className="gei-meta">Impacto: {state.clubWide ? "todo el club" : `${state.teamIds.length} equipo(s)`}.</p>
          </fieldset>
        )}
        <fieldset className="grid gap-2">
          <legend className="gei-section-title">2. Contenido</legend>
          <TextField id="ann-title" label="Título" value={state.title} onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))} maxLength={300} />
          <TextArea id="ann-body" label="Cuerpo" value={state.body} onChange={(e) => setState((s) => ({ ...s, body: e.target.value }))} rows={8} />
        </fieldset>
        {mode === "correct" && (
          <fieldset className="grid gap-2">
            <legend className="gei-section-title">3. Motivo de la corrección</legend>
            <TextField id="ann-reason" label="Motivo" value={state.reason} onChange={(e) => setState((s) => ({ ...s, reason: e.target.value }))} placeholder="Qué se corrigió y por qué" />
            <div className="rounded-surface bg-control p-3 text-meta">
              <p><strong>Antes:</strong> {loaded?.title}</p>
              <p><strong>Ahora:</strong> {state.title || "—"}</p>
            </div>
          </fieldset>
        )}
        {error && <Banner tone="danger" title="No se pudo guardar">{error}</Banner>}
      </Surface>
      <div className="sticky bottom-20 z-10 flex flex-wrap justify-end gap-2 bg-page/95 py-3 backdrop-blur lg:bottom-4">
        {mode === "correct" ? (
          <Button variant="primary" busy={busy} disabled={!valid} onClick={() => void persist(true)}>Guardar corrección</Button>
        ) : (
          <>
            <Button variant="secondary" busy={busy} disabled={!state.title.trim() || !state.body.trim()} onClick={() => void persist(false)}>Guardar borrador</Button>
            <Button variant="primary" busy={busy} disabled={!valid} onClick={() => void persist(true)}>Publicar</Button>
          </>
        )}
      </div>
    </div>
  )
}

/* ───────────────────────────── R24 — ANNOUNCEMENT DETAIL ───────────────────────────── */

export function AnnouncementDetail() {
  const { id = "" } = useParams()
  const navigate = useNavigate()
  const { authority } = useProduct()
  const { data, loading, error, reload } = useFetch(() => fetchAnnouncement(id), [id])
  const { data: notes } = useFetch(() => fetchNotificationList({ limit: 200 }), [])
  const [ackBusy, setAckBusy] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const notification = notes?.items.find((n) => n.type === "ANNOUNCEMENT_PUBLISHED" && (n as any).resourceId === id)
  async function acknowledge() {
    if (!notification) return
    setAckBusy(true)
    try {
      await fetchMarkNotificationRead(notification.id)
      await reload()
    } finally { setAckBusy(false) }
  }
  async function archive() {
    setActionError(null)
    try { await archiveAnnouncement(id); await reload() } catch (e) { setActionError(errorText(e, "No se pudo archivar")) }
  }

  if (loading) return <div className="mx-auto max-w-3xl"><p className="gei-meta">Cargando comunicado…</p></div>
  if (typeof error === "string" && /destinatario|authority|Acceso|403/i.test(error)) {
    return <div className="mx-auto max-w-3xl"><PageContextHeader context="Comunicación" title="Comunicado" back="/communication" />
      <Empty title="No tenés acceso a este comunicado" detail="No eras destinatario de la audiencia publicada." /></div>
  }
  if (error || !data) return <div className="mx-auto max-w-3xl"><PageContextHeader context="Comunicación" title="Comunicado" back="/communication" />
    <Empty title="No pudimos cargar el comunicado" detail={errorText(error, "Intentá de nuevo.")} /></div>

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Comunicación"
        title={data.title}
        lead={data.publishedAt ? `Publicado ${relativeLabel(data.publishedAt)}` : "Borrador"}
        back="/communication"
        action={authority.roles.includes("SUBCOMMITTEE") ? (
          <div className="flex gap-2">
            {data.state === "PUBLISHED" && <Button size="sm" variant="secondary" onClick={() => navigate(`/announcements/${id}/edit`)}><Pencil size={14} aria-hidden /> Corregir</Button>}
            {data.state === "PUBLISHED" && <Button size="sm" variant="quiet" onClick={() => void archive()}>Archivar</Button>}
          </div>
        ) : undefined}
      />
      <Surface className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="warning">Comunicado</Tag>
          <Tag>{data.clubWide ? "Todo el club" : `${data.audienceSnapshot.length} equipos`}</Tag>
          <Tag>{data.state}</Tag>
          <span className="gei-meta">Revisión {data.revision}</span>
        </div>
        <p className="whitespace-pre-wrap text-body text-ink">{data.body}</p>
        {actionError && <Banner tone="danger" title="Error">{actionError}</Banner>}
      </Surface>
      {data.state === "PUBLISHED" && (
        <div className="sticky bottom-20 z-10 flex justify-end bg-page/95 py-3 backdrop-blur lg:bottom-4">
          <Button variant="primary" busy={ackBusy} disabled={!notification || Boolean(data.readState?.readAt)} onClick={() => void acknowledge()}>
            <Check size={16} aria-hidden /> {data.readState?.readAt ? "Entendido" : "Entendido"}
          </Button>
        </div>
      )}
    </div>
  )
}

/* ───────────────────────────── R26 — CONVERSATION ───────────────────────────── */

interface Pending { key: string; body: string }

export function ConversationPage() {
  const { id = "" } = useParams()
  const { data: conv, loading: loadingConv, error: errorConv } = useFetch(() => fetchConversation(id), [id])
  const { data: thread, loading: loadingThread, error: errorThread, reload, setData } = useFetch(
    () => fetchThread(id), [id],
  )
  const [body, setBody] = useState("")
  const [pending, setPending] = useState<Pending[]>([])
  const [failed, setFailed] = useState<Pending[]>([])
  const [actionError, setActionError] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editBody, setEditBody] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { reload: reloadBadge } = useUnreadCount()
  useCommunicationRefresh([`conversation:${id}`, "conversations"], () => { void reload(); void reloadBadge() })

  useEffect(() => {
    const node = bottomRef.current
    if (node && typeof node.scrollIntoView === "function") node.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [thread?.items.length, pending.length])

  async function submit(text: string, key: string) {
    setActionError(null)
    setPending((p) => [...p, { key, body: text }])
    setBody("")
    try {
      const created = await sendMessage(id, text, key)
      setData((current) => current ? {
        ...current, items: [...current.items.filter((m) => m.id !== created.id), created],
      } : current)
      setFailed((f) => f.filter((item) => item.key !== key))
      void reloadBadge()
    } catch (e) {
      setActionError(errorText(e, "No se pudo enviar"))
      setFailed((f) => [...f, { key, body: text }])
    } finally {
      setPending((p) => p.filter((item) => item.key !== key))
    }
  }

  async function handleEdit(message: MessageDto) {
    if (!editBody.trim()) return
    try { await editMessage(message.id, editBody); setEditing(null); await reload() }
    catch (e) { setActionError(errorText(e, "No se pudo editar")) }
  }
  async function handleDelete(message: MessageDto) {
    try { await deleteMessage(message.id, "Eliminado por el autor"); await reload() }
    catch (e) { setActionError(errorText(e, "No se pudo eliminar")) }
  }
  async function loadOlder() {
    if (!thread?.nextCursor) return
    const older = await fetchThread(id, thread.nextCursor)
    setData((current) => current ? { ...older, items: [...older.items, ...current.items] } : older)
  }

  if (loadingConv || loadingThread) return <div className="mx-auto max-w-4xl"><p className="gei-meta">Cargando conversación…</p></div>
  if (errorConv || errorThread || !conv) {
    return <div className="mx-auto max-w-4xl"><PageContextHeader context="Comunicación" title="Conversación" back="/communication" />
      <Empty title="No pudimos abrir la conversación" detail={errorText(errorConv ?? errorThread, "Puede que ya no tengas acceso.")} /></div>
  }

  return (
    <div className="flex min-h-[70dvh] flex-col pb-24 lg:pb-4">
      <PageContextHeader
        context="Comunicación"
        title={conv.title || contextTitle(conv as ConversationListItem)}
        lead={`${typeLabel(conv.type)} · ${conv.participantCount} participantes`}
        back="/communication"
      />
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-3">
        {actionError && <Banner tone="danger" title="Error">{actionError}</Banner>}
        {thread?.hasMore && <div className="flex justify-center"><Button size="sm" variant="secondary" onClick={() => void loadOlder()}>Cargar anteriores</Button></div>}
        <div className="grid gap-2" role="log" aria-label="Mensajes">
          {thread?.items.map((m) => (
            <div key={m.id} className={cx("rounded-surface border p-3", m.body === null ? "border-line bg-control" : "border-line bg-surface")}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-meta font-semibold text-ink-muted">{m.authorPersonId === getCsrfToken() ? "Vos" : "Participante"}</span>
                <span className="gei-meta tabular-nums">{relativeLabel(m.sentAt)}</span>
              </div>
              {m.body === null ? (
                <p className="mt-1 text-meta italic text-ink-faint">Este mensaje fue eliminado</p>
              ) : editing === m.id ? (
                <div className="mt-2 grid gap-2">
                  <TextArea id={`edit-${m.id}`} label="Editar mensaje" value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={3} />
                  <div className="flex gap-2"><Button size="sm" onClick={() => void handleEdit(m)}>Guardar</Button><Button size="sm" variant="quiet" onClick={() => setEditing(null)}>Cancelar</Button></div>
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-body text-ink">{m.body}{m.state === "EDITED" && <span className="gei-meta"> (editado)</span>}</p>
              )}
              {m.deletedAt && <p className="gei-meta mt-1">{m.deletionReason}</p>}
            </div>
          ))}
          {pending.map((p) => <div key={p.key} className="rounded-surface border border-dashed border-line bg-control p-3 opacity-70"><p className="text-body">{p.body}</p><p className="gei-meta">Enviando…</p></div>)}
          {failed.map((f) => (
            <div key={f.key} className="rounded-surface border border-danger bg-surface p-3">
              <p className="text-body">{f.body}</p>
              <p className="gei-meta text-danger">Falló el envío.</p>
              <Button size="sm" variant="secondary" onClick={() => { setFailed((x) => x.filter((i) => i.key !== f.key)); void submit(f.body, f.key) }}>Reintentar</Button>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="sticky bottom-16 z-20 mx-auto w-full max-w-4xl border-t border-line bg-page px-1 py-2 backdrop-blur lg:bottom-0">
        <div className="flex items-end gap-2">
          <label htmlFor="composer" className="sr-only">Escribí un mensaje</label>
          <textarea
            id="composer" value={body} onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (body.trim()) void submit(body.trim(), newKey()) } }}
            rows={2} placeholder="Escribí un mensaje…" className="min-h-11 flex-1 resize-none rounded-control border border-line bg-surface p-3 text-body"
          />
          <Button aria-label="Enviar mensaje" disabled={!body.trim()} onClick={() => void submit(body.trim(), newKey())}><Send size={16} aria-hidden /> Enviar</Button>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────── RC-18 — AVISOS ───────────────────────────── */

export function Notifications() {
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const { data, loading, error, reload, setData } = useFetch(
    () => fetchNotificationList({ unread: onlyUnread ? true : undefined, limit: 100 }),
    [onlyUnread],
  )
  const { reload: reloadBadge } = useUnreadCount()
  const items = useMemo(() => data?.items ?? [], [data])
  const unread = items.filter((item) => item.isUnread)

  async function markRead(id: string) {
    try {
      await fetchMarkNotificationRead(id)
      setData((current) => current
        ? { items: current.items.map((item) => (item.id === id ? { ...item, isUnread: false, readAt: new Date().toISOString() } : item)) }
        : current)
      void reloadBadge()
    } catch { void reload() }
  }
  async function markAllRead() {
    setMarkingAll(true)
    try {
      for (const item of unread) await fetchMarkNotificationRead(item.id)
      await reload(); void reloadBadge()
    } finally { setMarkingAll(false) }
  }

  return (
    <div className="gei-stack-page mx-auto max-w-3xl">
      <PageContextHeader
        context="Avisos" title="Avisos" lead="Lo que cambió y te afecta." back="/communication"
        action={<div className="flex items-center gap-2">
          <Button variant={onlyUnread ? "primary" : "secondary"} size="sm" onClick={() => setOnlyUnread((v) => !v)}>
            {onlyUnread ? "Viendo sin leer" : "Ver solo sin leer"}
          </Button>
          {unread.length > 0 && <Button variant="secondary" size="sm" busy={markingAll} onClick={() => void markAllRead()}>Marcar todo</Button>}
        </div>}
      />
      {loading && <p className="gei-meta">Cargando avisos…</p>}
      {error && <Surface className="grid gap-2"><p className="gei-meta">No pudimos cargar los avisos: {errorText(error, "Error")}</p><Button variant="secondary" size="sm" onClick={reload}>Reintentar</Button></Surface>}
      {!loading && !error && items.length === 0 && <Empty title={onlyUnread ? "No hay avisos sin leer" : "No tenés avisos"} detail="Cuando cambie algo que te afecta, aparece acá." />}
      {!loading && !error && items.length > 0 && (
        <Surface flush><ul className="grid px-1 py-1">{items.map((notice) => (
          <li key={notice.id}><RowStatic
            title={notice.title}
            detail={<span className="grid gap-1">
              <span className="text-meta font-semibold uppercase tracking-wide text-ink-faint">{NOTICE_TYPE_TEXT[notice.type] ?? "Aviso del club"}</span>
              <span>{notice.body}</span>
              {notice.originEventId && <Link to={`/events/${notice.originEventId}`} className="text-meta font-semibold text-interactive hover:underline">Abrir el evento</Link>}
            </span>}
            meta={<span className="grid gap-1 text-right">
              {notice.isUnread && <span className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-pill bg-unread" /><span className="text-meta font-semibold text-selected">Sin leer</span></span>}
              <span className="gei-meta tabular-nums">{relativeLabel(notice.occurredAt)}</span>
            </span>}
            trailing={notice.isUnread ? <Button variant="quiet" size="sm" onClick={() => void markRead(notice.id)}>Marcar leído</Button> : undefined}
          /></li>
        ))}</ul></Surface>
      )}
    </div>
  )
}
