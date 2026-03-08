import { apiClient } from './client'
import { UserProfileResponse, UpdateProfileRequest, CompleteProfileRequest } from '@/types'

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
}
