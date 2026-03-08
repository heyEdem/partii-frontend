import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json()

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Tokens required' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true })

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  }

  response.cookies.set('partii_access', accessToken, {
    ...cookieOptions,
    maxAge: 60 * 15,
  })
  response.cookies.set('partii_refresh', refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
