import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import { SessionProvider } from "../lib/session-context"
import { Shell } from "./Shell"
import {
  Calendar,
  Teams,
  TeamDetail,
  PersonDetail,
} from "../features/overview"
import T06Home from "../features/t06-home"
import T06Search from "../features/t06-search"
import { ReportsHub, AttendanceReport, PerformanceReport } from "../features/t06-reports"
import { EventDetail, EventForm, JornadaPage } from "../features/events"
import {
  AvailabilityPage,
  SelectionPage,
  AttendancePage,
  MatchRecordPage,
} from "../features/participation"
import {
  CommunicationHome,
  NewConversation,
  ConversationPage,
  AnnouncementDetail,
  AnnouncementForm,
  Notifications,
} from "../features/communication"
import {
  ManagementHome,
  StructurePage,
  PeopleManagement,
  CreatePerson,
  PersonAdminDetail,
  TeamAdmin,
  CompetitionsPage,
} from "../features/management"
import {
  MorePage,
  ProfilePage,
  LoginPage,
  ActivatePage,
  NoAccessPage,
  AuditPage,
} from "../features/account-insight"
import { Empty } from "../shared/ui"

/** Rutas canónicas: 38 destinos. No se cambian. */
const router = createBrowserRouter([
  { path: "/login", Component: LoginPage },
  { path: "/activate", Component: ActivatePage },
  { path: "/no-access", Component: NoAccessPage },
  {
    Component: Shell,
    children: [
      { path: "/", element: <Navigate to="/home" replace /> },
      { path: "/home", Component: T06Home },
      { path: "/calendar", Component: Calendar },
      { path: "/teams", Component: Teams },
      { path: "/teams/:teamId", element: <TeamDetail /> },
      { path: "/people/:personId", element: <PersonDetail /> },
      { path: "/events/new", Component: EventForm },
      { path: "/events/:eventId", Component: EventDetail },
      { path: "/events/:eventId/edit", Component: EventForm },
      { path: "/events/:eventId/availability", Component: AvailabilityPage },
      { path: "/events/:eventId/selection", Component: SelectionPage },
      { path: "/events/:eventId/attendance", Component: AttendancePage },
      { path: "/events/:eventId/match-record", Component: MatchRecordPage },
      { path: "/jornadas/new", Component: JornadaPage },
      { path: "/jornadas/:jornadaId", Component: JornadaPage },
      { path: "/communication", Component: CommunicationHome },
      { path: "/communication/conversations/new", Component: NewConversation },
      { path: "/communication/announcements/new", Component: AnnouncementForm },
      { path: "/announcements/:id", Component: AnnouncementDetail },
      { path: "/announcements/:id/edit", Component: AnnouncementForm },
      { path: "/conversations/:id", Component: ConversationPage },
      { path: "/conversations/new", Component: NewConversation },
      { path: "/notifications", Component: Notifications },
      { path: "/search", Component: T06Search },
      { path: "/more", Component: MorePage },
      { path: "/more/profile", Component: ProfilePage },
      { path: "/management", Component: ManagementHome },
      { path: "/management/structure", Component: StructurePage },
      { path: "/management/people", Component: PeopleManagement },
      { path: "/management/people/new", Component: CreatePerson },
      { path: "/management/people/:id", Component: PersonAdminDetail },
      { path: "/management/teams/:id", Component: TeamAdmin },
      { path: "/management/competitions", Component: CompetitionsPage },
      { path: "/management/competitions/:id", Component: CompetitionsPage },
      { path: "/reports", Component: ReportsHub },
      { path: "/reports/attendance", Component: AttendanceReport },
      { path: "/reports/performance", Component: PerformanceReport },
      { path: "/audit", Component: AuditPage },
      {
        path: "*",
        element: (
          <Empty
            title="Página no encontrada"
            detail="Volvé al inicio para continuar con GEI Hockey."
          />
        ),
      },
    ],
  },
])

export default function App() {
  return (
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  )
}