// ============================================================
// ENUMS — match Java backend enums exactly
// ============================================================

export type EventStatus = 'DRAFT' | 'ACTIVE' | 'FULL' | 'PAST' | 'CANCELLED' | 'ARCHIVED'
export type EventType =
  | 'PARTY'
  | 'DINNER'
  | 'TRIP'
  | 'SPORTS'
  | 'GAME_NIGHT'
  | 'CONCERT'
  | 'FESTIVAL'
  | 'BIRTHDAY'
  | 'WEDDING'
  | 'GRADUATION'
  | 'NETWORKING'
  | 'WORKSHOP'
  | 'OTHER'
export type EventVisibility = 'PUBLIC' | 'PRIVATE'
export type AttendeeStatus = 'PENDING' | 'APPROVED' | 'WAITLIST' | 'DECLINED' | 'REMOVED'
export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID'
export type ContributionStatus = 'AVAILABLE' | 'CLAIMED' | 'ASSIGNED' | 'CONFIRMED'
export type ContributionType = 'MATERIAL' | 'SERVICE'
export type Priority = 'MUST_HAVE' | 'NICE_TO_HAVE'
export type AccountStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'

// ============================================================
// AUTH
// ============================================================

export interface AuthResponse {
  userId: number
  email: string
  displayName: string
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export interface SignupRequest {
  email: string
  password: string
  displayName: string
  dob: string // ISO date string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface VerifyEmailRequest {
  email: string
  otp: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// ============================================================
// USER
// ============================================================

export interface UserProfileResponse {
  id: number
  email: string
  displayName: string
  legalName: string | null
  bio: string | null
  generalLocation: string | null
  primaryAddress: string | null
  phoneNumber: string | null
  dob: string // LocalDate as ISO string
  age: number
  accountStatus: AccountStatus
  isVerified: boolean
  totalRatings: number
  averageRating: number
  eventsAttended: number
  eventsOrganized: number
  activeEventsCount: number
  profilePictureUrl: string | null
  createdAt: string
}

export interface UpdateProfileRequest {
  displayName?: string
  bio?: string
  generalLocation?: string
  phoneNumber?: string
  profilePictureUrl?: string
}

export interface CompleteProfileRequest {
  displayName: string
  generalLocation?: string
  bio?: string
  profilePictureUrl?: string
}

// ============================================================
// EVENT
// ============================================================

export interface EventResponse {
  id: number
  organizerId: number
  organizerDisplayName: string
  title: string
  description: string | null
  eventType: EventType
  locationAddress: string | null
  latitude: number | null
  longitude: number | null
  eventDate: string // LocalDateTime as ISO string
  imageUrl: string | null
  estimatedBudget: string | null // BigDecimal as string
  currency: string | null
  maxAttendees: number | null
  currentAttendees: number
  ageRestriction: number | null
  paymentDeadline: string | null
  joinDeadline: string | null
  visibility: EventVisibility
  status: EventStatus
  privateLinkCode: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateEventRequest {
  title: string
  description?: string
  eventType: EventType
  locationAddress?: string
  latitude?: number
  longitude?: number
  eventDate: string
  imageUrl?: string
  estimatedBudget?: string
  currency?: string
  maxAttendees?: number
  ageRestriction?: number
  paymentDeadline?: string
  joinDeadline?: string
  visibility: EventVisibility
  contributionItems?: CreateContributionItemRequest[]
}

export interface UpdateEventRequest {
  title?: string
  description?: string
  eventType?: EventType
  locationAddress?: string
  latitude?: number
  longitude?: number
  eventDate?: string
  imageUrl?: string
  estimatedBudget?: string
  currency?: string
  maxAttendees?: number
  ageRestriction?: number
  paymentDeadline?: string
  joinDeadline?: string
  visibility?: EventVisibility
}

export interface EventSearchRequest {
  eventTypes?: EventType[]
  statuses?: EventStatus[]
  startDate?: string
  endDate?: string
  minBudget?: string
  maxBudget?: string
  latitude?: number
  longitude?: number
  radiusKm?: number
  keyword?: string
  maxAgeRestriction?: number
  hasAvailableSpots?: boolean
  organizerId?: number
}

// ============================================================
// ATTENDEE
// ============================================================

export interface AttendeeResponse {
  id: number
  userId: number
  displayName: string
  profilePictureUrl: string | null
  status: AttendeeStatus
  paymentAmount: string | null
  paymentStatus: PaymentStatus
  amountPaid: string | null
  joinedAt: string
  approvedAt: string | null
}

// ============================================================
// CONTRIBUTION
// ============================================================

export interface ContributionItemResponse {
  id: number
  eventId: number
  name: string
  category: string | null
  type: ContributionType
  quantity: number | null
  timeCommitment: number | null
  estimatedCost: string | null
  priority: Priority
  notes: string | null
  status: ContributionStatus
  completed: boolean
  assignedToUserId: number | null
  assignedToDisplayName: string | null
  assignedToProfilePictureUrl: string | null
  createdAt: string
  claimedAt: string | null
  confirmedAt: string | null
}

export interface CreateContributionItemRequest {
  name: string
  category?: string
  type: ContributionType
  quantity?: number
  timeCommitment?: number
  estimatedCost?: string
  priority: Priority
  notes?: string
}

export interface ContributionSummaryResponse {
  totalItems: number
  claimedItems: number
  confirmedItems: number
  availableItems: number
  items: ContributionItemResponse[]
}

// ============================================================
// CHAT
// ============================================================

export interface ChatMessageResponse {
  id: number
  eventId: number
  senderId: number
  senderDisplayName: string
  senderProfilePictureUrl: string | null
  content: string
  sentAt: string
  deleted: boolean
}

export interface SendMessageRequest {
  content: string
}

// ============================================================
// PAGINATION
// ============================================================

export interface CursorPage<T> {
  content: T[]
  nextCursor: string | null
  hasMore: boolean
}

// ============================================================
// GENERIC
// ============================================================

export interface GenericMessageResponse {
  message: string
}

export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string>
}
