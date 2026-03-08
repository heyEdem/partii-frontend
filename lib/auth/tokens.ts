'use server'
import { cookies } from 'next/headers'

const ACCESS_TOKEN_KEY = 'partii_access'
const REFRESH_TOKEN_KEY = 'partii_refresh'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export async function setTokens(accessToken: string, refreshToken: string) {
  const store = await cookies()
  store.set(ACCESS_TOKEN_KEY, accessToken, {
    ...cookieOptions,
    maxAge: 60 * 15, // 15 minutes
  })
  store.set(REFRESH_TOKEN_KEY, refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_TOKEN_KEY)?.value
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_TOKEN_KEY)?.value
}

export async function clearTokens() {
  const store = await cookies()
  store.delete(ACCESS_TOKEN_KEY)
  store.delete(REFRESH_TOKEN_KEY)
}
