# Implementation

## Entry Points

| File | Role |
|------|------|
| `app/layout.tsx` | Root layout — loads Plus Jakarta Sans, wraps with `<Providers>`, SSR-prefetches current user |
| `middleware.ts` | Edge route guard — reads `partii_access` cookie, protects `(app)/*` routes |
| `lib/providers.tsx` | Client provider tree: `QueryClientProvider → AuthProvider → ToastProvider` |
| `app/(app)/layout.tsx` | Auth-gated shell — server redirects if no token, renders Sidebar + TabBar |

## Per-Module Breakdown

### `lib/api/client.ts`
- **Key export:** `apiClient` — object with `get`, `post`, `patch`, `put`, `delete`
- **Error type:** `ApiClientError extends Error` — carries `status: number` and optional `errors` map
- **Token injection:** Pass `{ token: string }` in options; added as `Authorization: Bearer`
- **Non-obvious:** 204 responses return `undefined as T` to avoid JSON parse errors

### `lib/api/auth.ts` / `events.ts` / `users.ts`
- Thin wrappers over `apiClient` with typed inputs/outputs
- Server components pass `{ token }` from `getAccessToken()`; client components do not (no cookie access from client)
- Backend base URL: `NEXT_PUBLIC_API_URL` env var, default `http://localhost:8080/partii/api/v1`

### `lib/auth/tokens.ts`
- **`'use server'`** — all functions are server actions
- `setTokens(access, refresh)` — writes both cookies; access: 15m, refresh: 7d
- `getAccessToken()` / `getRefreshToken()` — used by server components and layouts
- `clearTokens()` — used by logout route handler

### `app/api/auth/set-tokens/route.ts`
- POST endpoint called by client components after login/signup
- Receives `{ accessToken, refreshToken }` in body, sets httpOnly cookies on the response
- This is the bridge from client-land to httpOnly cookie land

### `lib/hooks/useAuth.tsx`
- `AuthProvider` accepts `initialUser` from root layout (server-prefetched)
- `useAuth()` exposes: `user`, `isLoading`, `isAuthenticated`, `setUser`, `logout`
- `logout()` — POSTs to `/api/auth/logout`, clears state, hard-navigates to `/login`

### `lib/hooks/useToast.tsx`
- Context-based toast queue; auto-dismisses after 4s
- `useToast()` exposes `toast(message, type)` and `dismiss(id)`
- Types: `'success' | 'error' | 'warning' | 'info'`

### `components/layout/DesktopSidebar.tsx`
- Fixed 240px left sidebar, `hidden md:flex`
- Active route detection via `usePathname()` — left purple bar + lavender bg highlight
- Bottom user card triggers `logout()` on click
- Create Event button is orange-filled nav item

### `components/layout/MobileTabBar.tsx`
- Fixed bottom, `md:hidden`, 5 tabs
- Center tab (index 2) is the raised orange Create button — no label
- Active tab uses `weight="fill"` icon + orange text

### `components/ui/` — Velvet Primitives
| Component | Key Props |
|-----------|-----------|
| `VelvetButton` | `variant: primary\|secondary\|ghost\|destructive`, `size: default\|sm`, `loading: boolean` |
| `StatusPill` | `status: string` — maps any backend enum value to Velvet color pair |
| `Avatar` | `size: xs\|sm\|md\|lg\|xl`, `src`, `name` — gradient fallback with initials |
| `AvatarStack` | `users[]`, `max=4` — overlapping stack with "+N" overflow |
| `InputField` | `label`, `error`, `hint` — lavender focus ring, red error state |
| `TextareaField` | Same as InputField but `<textarea>` |
| `ProgressBar` | `value: 0-100`, `size: default\|hero` — color morphs: red/yellow/green by threshold |
| `EmptyState` | `variant: no-events\|no-contributions\|no-reviews\|no-notifications\|no-results` |
| `Dialog` | `open`, `onClose`, `title` — modal on desktop, bottom sheet on mobile via `useIsDesktop()` |
| `ToastContainer` | Auto-rendered inside `ToastProvider`; use `useToast()` hook to fire |
| `EventCard` | Takes full `EventResponse` — date badge, status pill, avatar stack, price tag |
| `OtpInput` | `value: string`, `onChange` — 6 boxes, auto-advance, paste support |

## Configuration
| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/partii/api/v1` | Backend base URL |
| `NODE_ENV` | — | Controls `secure` flag on cookies |
| `partii_access` cookie | 15 min TTL | httpOnly JWT access token |
| `partii_refresh` cookie | 7 day TTL | httpOnly JWT refresh token |
