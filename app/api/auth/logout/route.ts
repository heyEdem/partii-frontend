import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('partii_access')
  response.cookies.delete('partii_refresh')
  return response
}
