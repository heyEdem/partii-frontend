# Patterns

## Naming Conventions
- **Files:** PascalCase for components (`VelvetButton.tsx`), camelCase for hooks/utils (`useAuth.tsx`, `client.ts`)
- **Components:** PascalCase, descriptive — prefix `Velvet` only for design-system primitives that override shadcn defaults
- **Hooks:** `use` prefix, camelCase (`useAuth`, `useToast`, `useIsDesktop`, `useMediaQuery`)
- **API modules:** camelCase object exports (`authApi`, `eventsApi`, `usersApi`)
- **Types:** PascalCase interfaces matching Java DTO names (`EventResponse`, `AttendeeStatus`)
- **Route files:** `page.tsx` / `layout.tsx` / `route.ts` (Next.js convention)

## Folder Conventions
- `components/layout/` — Page chrome only (sidebar, tab bar, nav). Not reusable primitives.
- `components/ui/` — All Velvet design-system primitives. Has a barrel `index.ts`.
- `lib/api/` — One file per backend domain. Import from `@/lib/api/auth`, not the client directly.
- `lib/auth/` — Server-only auth utilities (tagged `'use server'`).
- `lib/hooks/` — Client-side React hooks. All tagged `'use client'` or exported without directive.
- `types/index.ts` — **Single file** for all types. Do not create per-domain type files.
- `app/api/` — Next.js Route Handlers only. No business logic — delegate to `lib/`.

## Recurring Code Patterns

### Auth-gated API call (Server Component)
```tsx
// In any server component inside (app)/*
import { getAccessToken } from '@/lib/auth/tokens'
import { eventsApi } from '@/lib/api/events'

const token = await getAccessToken()
const events = await eventsApi.getMyEvents({ token })
```

### Auth mutation (Client Component)
```tsx
'use client'
// 1. Call API directly (no token needed from client — backend may accept unauthenticated)
// 2. Store tokens via route handler (never set httpOnly cookies client-side)
const res = await authApi.login(data)
await fetch('/api/auth/set-tokens', {
  method: 'POST',
  body: JSON.stringify({ accessToken: res.accessToken, refreshToken: res.refreshToken }),
})
router.push('/dashboard')
```

### Form pattern (Client Component)
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// schema → useForm({ resolver: zodResolver(schema) }) → register → handleSubmit
// errors displayed via InputField error prop
// API errors shown in a state variable below the form
```

### Error handling
- API errors throw `ApiClientError` (from `lib/api/client.ts`)
- Client forms: catch in `onSubmit`, set local `apiError` state, render below form in `text-error`
- Never use `alert()` — use `useToast()` for non-form feedback

### Responsive component switching
```tsx
import { useIsDesktop } from '@/lib/hooks/useMediaQuery'
// Dialog.tsx uses this to switch between centered modal (desktop) and bottom sheet (mobile)
```

## Velvet Design Rules (enforce on every new component)
- **Dark mode ONLY** — never add light mode styles
- **Orange (`accent-action`)** = actions that change state: buttons, CTAs, create triggers
- **Lavender (`accent-primary`)** = navigation, selected states, informational elements
- **Focus rings** = `focus:border-accent-primary focus:shadow-lavender-ring`
- **No drop shadows** — depth via background color only (`bg-elevated` → `bg-surface`)
- **Hover on cards** = `hover:scale-[1.02] hover:border hover:border-border`
- **Button hover** = primary gets `hover:shadow-orange-glow hover:-translate-y-px`
- **Icons** = Phosphor thin weight everywhere; bold ONLY for the mobile Create (+) button
- **Gradient text** = use inline style: `style={{ background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}`

## Testing Conventions
No tests written yet. When added:
- Test files: colocate as `__tests__/ComponentName.test.tsx` or `*.test.ts`
- Use Vitest + React Testing Library (not yet installed)
- MSW for API mocking

## Anti-Patterns to Avoid
- **Don't use `js-cookie` on client** — tokens are httpOnly; use route handlers instead
- **Don't import from `lib/auth/tokens.ts` in client components** — it's server-only
- **Don't add `'use client'` to layout files** — they must stay server components for token reading
- **Don't duplicate type definitions** — add all types to `types/index.ts` only
