# Changelog

## 2026-03-09 — Initial index

### Phase 1 — Project Bootstrap & Design Tokens (COMPLETE, committed on `main`/`dev`)
- Next.js 14 project created at `partii-frontend/`
- Full Velvet design token override in `tailwind.config.ts`
- CSS variables in `globals.css`
- Typed API client `lib/api/client.ts` with `ApiClientError`
- Domain API modules: `lib/api/auth.ts`, `events.ts`, `users.ts`
- All TypeScript types in `types/index.ts` (matching Java backend DTOs + enums)
- `lib/auth/tokens.ts` — server-side httpOnly cookie helpers
- Route handlers: `app/api/auth/set-tokens` and `app/api/auth/logout`
- `lib/hooks/useAuth.tsx` — AuthProvider + useAuth
- `lib/providers.tsx` — QueryClient + Auth + Toast provider tree
- `middleware.ts` — edge route protection
- Route group layouts: `(auth)`, `(public)`, `(app)`

### Phase 2 — Layout Shells & Component Library (COMPLETE, committed on `main`/`dev`)
- `components/layout/DesktopSidebar.tsx`
- `components/layout/MobileTabBar.tsx`
- `components/layout/PublicNav.tsx`
- `components/ui/VelvetButton.tsx` (5 variants, loading state)
- `components/ui/StatusPill.tsx` (14 status mappings)
- `components/ui/Avatar.tsx` + `AvatarStack`
- `components/ui/InputField.tsx` + `TextareaField`
- `components/ui/ProgressBar.tsx` (color-morph by threshold)
- `components/ui/EmptyState.tsx` (5 variants)
- `components/ui/Dialog.tsx` (modal desktop / bottom-sheet mobile)
- `components/ui/ToastContainer.tsx` + `lib/hooks/useToast.tsx`
- `components/ui/EventCard.tsx`
- `lib/hooks/useMediaQuery.ts` + `useIsDesktop`
- `components/ui/index.ts` barrel

### Phase 3 — Auth Screens (IN PROGRESS on `feature/phase-3-auth`)
- `app/(auth)/login/page.tsx` — COMPLETE (modified, not yet committed)
- `app/(auth)/signup/page.tsx` — PARTIAL (untracked)
- `app/(auth)/verify-email/page.tsx` — PARTIAL (untracked)
- `app/(auth)/forgot-password/page.tsx` — PARTIAL (untracked)
- `app/(auth)/reset-password/page.tsx` — PARTIAL (untracked)
- `app/(auth)/oauth-callback/page.tsx` — PARTIAL (untracked)
- `app/(auth)/welcome/page.tsx` — PARTIAL (untracked)
- `components/ui/OtpInput.tsx` — PARTIAL (untracked)
- **Next action:** Verify each file is complete, run `tsc --noEmit`, commit, push `feature/phase-3-auth`

## Remaining Phases

### Phase 4 — Public Discovery (not started)
- Home feed (`app/(public)/page.tsx`)
- Search & filter (`app/(public)/search/page.tsx`)
- Event detail public (`app/(public)/events/[id]/page.tsx`)
- Join code entry (`app/(public)/join/page.tsx`)

### Phase 5 — Dashboard & Event Management (not started)
- My Events Dashboard, Create Event wizard (5 steps), Edit Event, Event Detail (attendee + organizer views), Attendee list, Join requests, Waitlist, Post-event summary

### Phase 6 — Contributions & Payments (not started)
- Contributions overview, Claim/Assign item dialogs, Payment dashboards, Split configuration

### Phase 7 — Chat (not started — backend WebSocket ALREADY implemented: `WebSocketConfig.java` exists)
- `lib/chat/useEventChat.ts` — STOMP hook
- `EventChat` component
- `ChatSettings` component

### Phase 8 — Profiles & Reviews (not started)
### Phase 9 — System Screens (not started — `EmptyState` component done)
