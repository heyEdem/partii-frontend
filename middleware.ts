import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = [
  '/',
  '/welcome',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/oauth-callback',
  '/join',
]

const PUBLIC_PREFIXES = ['/events/', '/search', '/users/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('partii_access')?.value

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    // Redirect authenticated users away from auth pages
    if (accessToken && ['/login', '/signup', '/welcome'].includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Allow public prefixes (event detail pages are public)
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Protect app routes
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
