import { apiClient } from './client'
import { UserProfileResponse, UpdateProfileRequest, CompleteProfileRequest, ContributionItemResponse } from '@/types'

type TokenOption = { token?: string }

export const usersApi = {
  getMe: (opts?: TokenOption) =>
    apiClient.get<UserProfileResponse>('/users/me', opts),

  getById: (id: number, opts?: TokenOption) =>
    apiClient.get<UserProfileResponse>(`/users/${id}`, opts),

  updateMe: (data: UpdateProfileRequest, opts?: TokenOption) =>
    apiClient.patch<UserProfileResponse>('/users/me', data, opts),

  completeProfile: (data: CompleteProfileRequest, opts?: TokenOption) =>
    apiClient.patch<UserProfileResponse>('/users/me/complete-profile', data, opts),

  getMyContributions: (opts?: TokenOption) =>
    apiClient.get<ContributionItemResponse[]>('/users/me/contributions', opts),

  blockUser: (userId: number, opts?: TokenOption) =>
    apiClient.post<void>(`/users/${userId}/block`, undefined, opts),

  unblockUser: (userId: number, opts?: TokenOption) =>
    apiClient.delete<void>(`/users/${userId}/block`, opts),

  reportUser: (userId: number, reason: string, opts?: TokenOption) =>
    apiClient.post<void>(`/users/${userId}/report`, { reason }, opts),
}
