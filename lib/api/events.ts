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
  // Public listing (cursor-paginated)
  getPublicEvents: (cursor?: string, opts?: TokenOption) =>
    apiClient.get<CursorPage<EventResponse>>(
      `/events/public${cursor ? `?cursor=${cursor}` : ''}`,
      opts,
    ),

  getById: (id: number, opts?: TokenOption) =>
    apiClient.get<EventResponse>(`/events/${id}`, opts),

  getByCode: (code: string, opts?: TokenOption) =>
    apiClient.get<EventResponse>(`/events/by-code/${code}`, opts),

  // My events (sub-paths: organized, attending, pending, past)
  getMyEventsOrganized: (cursor?: string, opts?: TokenOption) =>
    apiClient.get<CursorPage<EventResponse>>(
      `/events/my-events/organized${cursor ? `?cursor=${cursor}` : ''}`,
      opts,
    ),

  getMyEventsAttending: (cursor?: string, opts?: TokenOption) =>
    apiClient.get<CursorPage<EventResponse>>(
      `/events/my-events/attending${cursor ? `?cursor=${cursor}` : ''}`,
      opts,
    ),

  getMyEventsPending: (cursor?: string, opts?: TokenOption) =>
    apiClient.get<CursorPage<EventResponse>>(
      `/events/my-events/pending${cursor ? `?cursor=${cursor}` : ''}`,
      opts,
    ),

  getMyEventsPast: (cursor?: string, opts?: TokenOption) =>
    apiClient.get<CursorPage<EventResponse>>(
      `/events/my-events/past${cursor ? `?cursor=${cursor}` : ''}`,
      opts,
    ),

  // Mutations
  create: (data: CreateEventRequest, opts?: TokenOption) =>
    apiClient.post<EventResponse>('/events/new', data, opts),

  update: (id: number, data: UpdateEventRequest, opts?: TokenOption) =>
    apiClient.patch<EventResponse>(`/events/${id}`, data, opts),

  delete: (id: number, opts?: TokenOption) =>
    apiClient.delete<GenericMessageResponse>(`/events/${id}/delete`, opts),

  publish: (id: number, opts?: TokenOption) =>
    apiClient.post<EventResponse>(`/events/${id}/publish`, undefined, opts),

  cancel: (id: number, opts?: TokenOption) =>
    apiClient.patch<GenericMessageResponse>(`/events/${id}/cancel`, undefined, opts),

  // Attendees (controller: /events/{eventId}/attendees)
  getAttendees: (eventId: number, status?: string, opts?: TokenOption) =>
    apiClient.get<AttendeeResponse[]>(
      `/events/${eventId}/attendees${status ? `?status=${status}` : ''}`,
      opts,
    ),

  requestToJoin: (eventId: number, opts?: TokenOption) =>
    apiClient.post<AttendeeResponse>(`/events/${eventId}/attendees/join`, undefined, opts),

  approveAttendee: (eventId: number, userId: number, opts?: TokenOption) =>
    apiClient.post<AttendeeResponse>(`/events/${eventId}/attendees/${userId}/approve`, undefined, opts),

  declineAttendee: (eventId: number, userId: number, opts?: TokenOption) =>
    apiClient.post<GenericMessageResponse>(`/events/${eventId}/attendees/${userId}/decline`, undefined, opts),

  removeAttendee: (eventId: number, userId: number, opts?: TokenOption) =>
    apiClient.post<GenericMessageResponse>(`/events/${eventId}/attendees/${userId}/remove`, undefined, opts),

  // Contributions (controller: /events/{eventId}/contributions)
  getContributions: (eventId: number, opts?: TokenOption) =>
    apiClient.get<ContributionItemResponse[]>(`/events/${eventId}/contributions`, opts),

  getContributionSummary: (eventId: number, opts?: TokenOption) =>
    apiClient.get<ContributionSummaryResponse>(`/events/${eventId}/contributions/summary`, opts),

  getContributionCategories: (eventId: number, opts?: TokenOption) =>
    apiClient.get<string[]>(`/events/${eventId}/contributions/categories`, opts),

  addContributionItem: (eventId: number, data: CreateContributionItemRequest, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions`, data, opts),

  updateContributionItem: (eventId: number, itemId: number, data: CreateContributionItemRequest, opts?: TokenOption) =>
    apiClient.put<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}`, data, opts),

  deleteContributionItem: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.delete<GenericMessageResponse>(`/events/${eventId}/contributions/${itemId}`, opts),

  claimContribution: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/claim`, undefined, opts),

  confirmContribution: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/confirm`, undefined, opts),

  assignContribution: (eventId: number, itemId: number, userId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/assign/${userId}`, undefined, opts),

  acceptAssignment: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/accept`, undefined, opts),

  declineAssignment: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/decline`, undefined, opts),

  releaseContribution: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/release`, undefined, opts),

  completeContribution: (eventId: number, itemId: number, opts?: TokenOption) =>
    apiClient.post<ContributionItemResponse>(`/events/${eventId}/contributions/${itemId}/complete`, undefined, opts),
}
