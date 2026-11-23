/**
 * T06 API client. Usa `apiRequest` (CSRF automático, ApiError con code/retryable/traceId).
 * Ninguna superficie T06 se alimenta de mocks: todos los datos vienen del backend real.
 */
import { apiRequest } from "./api"
import type {
  AttentionListDto,
  AttendanceReportDto,
  HomeForActorDto,
  PerformanceReportDto,
  SearchPageDto,
  SearchResultType,
} from "../../shared/contracts/t06"

function qs(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value))
  }
  const encoded = search.toString()
  return encoded ? `?${encoded}` : ""
}

export function getHome(): Promise<HomeForActorDto> {
  return apiRequest<HomeForActorDto>("/api/home", {})
}

export function getAttention(limit?: number): Promise<AttentionListDto> {
  return apiRequest<AttentionListDto>(`/api/attention${qs({ limit })}`, {})
}

export function searchT06(input: {
  q: string
  type?: SearchResultType | ""
  cursor?: string
  limit?: number
}): Promise<SearchPageDto> {
  return apiRequest<SearchPageDto>(`/api/search${qs({ ...input })}`, {})
}

export function getAttendanceReport(params: {
  seasonId?: string
  teamId?: string
  eventId?: string
  cursor?: string
  limit?: number
}): Promise<AttendanceReportDto> {
  return apiRequest<AttendanceReportDto>(`/api/reports/attendance${qs(params)}`, {})
}

export function getPerformanceReport(params: {
  seasonId?: string
  teamId?: string
  cursor?: string
  limit?: number
}): Promise<PerformanceReportDto> {
  return apiRequest<PerformanceReportDto>(`/api/reports/performance${qs(params)}`, {})
}
