# Architecture

## Project Type
Next.js 14 App Router — TypeScript frontend (React 18)

## Directory Map
```
partii-frontend/
├── app/
│   ├── (auth)/          — Auth route group (login, signup, OTP, password reset)
│   │   ├── layout.tsx   — Centred single-column layout, max-w-md
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── oauth-callback/
│   │   └── welcome/
│   ├── (public)/        — Public SSR pages (home feed, event detail, search)
│   │   └── layout.tsx   — Includes PublicNav header
│   ├── (app)/           — Authenticated pages (dashboard, events, profile)
│   │   ├── layout.tsx   — Server-side token guard → DesktopSidebar + MobileTabBar
│   │   └── dashboard/
│   ├── api/
│   │   └── auth/
│   │       ├── set-tokens/route.ts  — POST: writes httpOnly cookies
│   │       └── logout/route.ts      — POST: clears cookies
│   ├── layout.tsx       — Root layout: font, providers, SSR user prefetch
│   └── globals.css      — CSS variables + Velvet utilities
├── components/
│   ├── layout/          — DesktopSidebar, MobileTabBar, PublicNav
│   └── ui/              — Velvet primitives (Button, StatusPill, Avatar, etc.)
├── lib/
│   ├── api/             — Typed fetch wrappers per domain (auth, events, users)
│   ├── auth/tokens.ts   — Server-side cookie helpers (uses next/headers)
│   ├── hooks/           — useAuth, useToast, useMediaQuery
│   └── providers.tsx    — QueryClient + AuthProvider + ToastProvider tree
├── middleware.ts         — Route protection; reads partii_access cookie
├── types/index.ts        — All TypeScript types matching Java backend DTOs
└── tailwind.config.ts   — Full Velvet token override
```

## Module Overview
| Module | Purpose |
|--------|---------|
| `app/(auth)` | Unauthenticated flows — all centred, no navigation chrome |
| `app/(public)` | SSR-crawlable pages with PublicNav |
| `app/(app)` | Protected pages with sidebar/tab-bar shell |
| `app/api/auth` | Route handlers that manage httpOnly JWT cookies |
| `lib/api` | Domain-scoped fetch wrappers; accept optional `token` for server components |
| `lib/auth/tokens.ts` | Server Actions for reading/writing cookies |
| `lib/hooks` | Client-side React context and utility hooks |
| `components/ui` | Velvet design system primitives |
| `components/layout` | Page chrome (sidebar, tab bar, top nav) |
| `middleware.ts` | Edge-runtime auth guard |
| `types/index.ts` | Single source of truth for all DTO shapes |

## Data Flow
```
Browser request
  → middleware.ts (reads partii_access cookie → allow or redirect /login)
  → Route group layout (server component — may call lib/auth/tokens.ts + usersApi.getMe)
  → Page (server component → fetch data with token OR client component → TanStack Query)
  → API call via lib/api/* → fetch to http://localhost:8080/partii/api/v1

Auth mutation (client):
  form submit → authApi.login/signup → POST /api/auth/set-tokens (route handler)
  → route handler sets httpOnly cookies → router.push('/dashboard')

Token storage: httpOnly cookies (partii_access, partii_refresh)
  Not accessible to JS — read only by middleware + server components + route handlers
```

## External Dependencies
| Name | Purpose |
|------|---------|
| `next@14` | Framework — App Router, Server Components, middleware |
| `@tanstack/react-query@5` | Client-side data fetching and cache |
| `@phosphor-icons/react` | Icon set — thin weight throughout |
| `tailwindcss@3` | Styling — Velvet tokens configured as custom values |
| `zod@4` | Schema validation for forms |
| `react-hook-form@7` | Form state management |
| `@hookform/resolvers` | Connects zod to react-hook-form |
| `@stomp/stompjs` | WebSocket/STOMP client for chat (Phase 7) |
| `next-themes` | Installed, not yet wired — for potential future light mode |
| `js-cookie` | Client cookie access (currently not used — tokens are httpOnly) |
