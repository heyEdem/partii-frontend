import { apiClient } from './client'
import { ChatMessageResponse, GenericMessageResponse } from '@/types'

type TokenOption = { token?: string }

export const chatApi = {
  getMessages: (eventId: number, page = 0, size = 50, opts?: TokenOption) =>
    apiClient.get<ChatMessageResponse[]>(
      `/events/${eventId}/chat/messages?page=${page}&size=${size}`,
      opts,
    ),

  deleteMessage: (eventId: number, messageId: number, opts?: TokenOption) =>
    apiClient.delete<GenericMessageResponse>(
      `/events/${eventId}/chat/messages/${messageId}`,
      opts,
    ),
}
