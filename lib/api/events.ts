import { apiClient } from './client'
import {
  EventResponse,
  CreateEventRequest,
  UpdateEventRequest,
  EventSearchRequest,
  AttendeeResponse,
  ContributionItemResponse,
  ContributionSummaryResponse,
  CreateContributionItemRequest,
  CursorPage,
  GenericMessageResponse,
} from '@/types'

type TokenOption = { token?: string }

export const eventsApi = {
  // Public
  getPublicEvents: (cursor?: string, opts?: TokenOption) =>
    apiClient.get<CursorPage<EventResponse>>(
      `/events/public${cursor ? `?cursor=${cursor}` : ''}`,
      opts,
    ),

  search: (data: EventSearchRequest, opts?: TokenOption) =>
    apiClient.post<CursorPage<EventResponse>>('/events/search', data, opts),

  getById: (id: number, opts?: TokenOption) =>
    apiClient.get<EventResponse>(`/events/${id}`, opts),

  getByCode: (code: string, opts?: TokenOption) =>
    apiClient.get<EventResponse>(`/events/by-code/${code}`, opts),

  // Authenticated
  getMyEvents: (opts?: TokenOption) =>
    apiClient.get<EventResponse[]>('/events/my-events', opts),

  create: (data: CreateEventRequest, opts?: TokenOption) =>
    apiClient.post<EventResponse>('/events/new', data, opts),

  update: (id: number, data: UpdateEventRequest, opts?: TokenOption) =>
    apiClient.patch<EventResponse>(`/events/${id}`, data, opts),

  publish: (id: number, opts?: TokenOption) =>
    apiClient.post<EventResponse>(`/events/${id}/publish`, undefined, opts),

  // Attendees
  getAttendees: (eventId: number, opts?: TokenOption) =>
    apiClient.get<AttendeeResponse[]>(`/events/${eventId}/attendees`, opts),

  requestToJoin: (eventId: number, opts?: TokenOption) =>
    apiClient.post<AttendeeResponse>(`/events/${eventId}/join`, undefined, opts),

  approveAttendee: (eventId: number, attendeeId: number, opts?: TokenOption) =>
    apiClient.post<AttendeeResponse>(`/events/${eventId}/attendees/${attendeeId}/approve`, undefined, opts),

  declineAttendee: (eventId: number, attendeeId: number, opts?: TokenOption) =>
    apiClient.post<GenericMessageResponse>(`/events/${eventId}/attendees/${attendeeId}/decline`, undefined, opts),

  removeAttendee: (eventId: number, userId: number, opts?: TokenOption) =>
    apiClient.delete<GenericMessageResponse>(`/events/${eventId}/attendees/${userId}`, opts),

  // Contributions
  getContributions: (eventId: number, opts?: TokenOption) =>
    apiClient.get<ContributionSummaryResponse>(`/events/${eventId}/contributions`, opts),

  addContributionItem: (eventId: number, data: CreateContributionItemRequest, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions`, data, opts),

  claimContribution: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/claim`, undefined, opts),

  assignContribution: (eventId: number, itemId: number, userId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/assign`, { userId }, opts),

  confirmContribution: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/confirm`, undefined, opts),
}
