import { apiClient } from './client'
import {
  AuthResponse,
  GenericMessageResponse,
  SignupRequest,
  LoginRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
} from '@/types'

export const authApi = {
  signup: (data: SignupRequest) =>
    apiClient.post<AuthResponse>('/auth/signup', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient.post<GenericMessageResponse>('/auth/verify-email', data),

  resendOtp: (email: string) =>
    apiClient.post<GenericMessageResponse>('/auth/resend-otp', { email }),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post<GenericMessageResponse>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<GenericMessageResponse>('/auth/reset-password', data),

  refresh: (data: RefreshTokenRequest) =>
    apiClient.post<AuthResponse>('/auth/refresh', data),

  logout: (refreshToken: string) =>
    apiClient.post<GenericMessageResponse>('/auth/logout', { refreshToken }),
}
