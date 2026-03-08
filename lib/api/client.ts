import { ApiError } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/partii/api/v1'

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string>,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  token?: string
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers: extraHeaders, ...rest } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let errorData: ApiError
    try {
      errorData = await response.json()
    } catch {
      errorData = { status: response.status, message: response.statusText }
    }
    throw new ApiClientError(response.status, errorData.message ?? 'Request failed', errorData.errors)
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
