# Architectural Decisions

---

## httpOnly Cookies for JWT Storage
**Date:** 2026-03-09
**Why:** Prevent XSS attacks from accessing tokens. JS cannot read httpOnly cookies.
**Tradeoffs:** Client components cannot read the token — all authenticated server fetches must go through Server Components or Route Handlers.
**Implementation:** Client forms POST to `/api/auth/set-tokens` (Route Handler) after login/signup. Server components call `getAccessToken()` from `lib/auth/tokens.ts`. Middleware reads `partii_access` cookie at the edge.

---

## Route Group Architecture `(auth)` / `(public)` / `(app)`
**Date:** 2026-03-09
**Why:** Three distinct layout shells — auth pages are centred with no nav, public pages have a top nav for SEO, app pages have the full sidebar + tab bar. Route groups achieve this with zero URL impact.
**Tradeoffs:** Deep nesting; new pages must be placed in the correct group.
**Alternatives considered:** Single layout with conditional rendering based on pathname — rejected because it makes the layout server component complicated and harder to maintain.

---

## Tailwind-first with CSS Variables
**Date:** 2026-03-09
**Why:** Velvet design tokens are defined as both Tailwind config values AND CSS custom properties (`:root` in globals.css). This enables Tailwind class usage (`bg-accent-action`) AND direct CSS variable usage (`var(--accent-action)`) inside complex inline styles or third-party components.
**Tradeoffs:** Duplication — token values exist in both `tailwind.config.ts` and `globals.css`. Must keep in sync.
**Future:** If light mode is ever added, only the CSS variables need to change (not Tailwind classes).

---

## Single `types/index.ts` for All DTOs
**Date:** 2026-03-09
**Why:** The backend has ~15 DTOs and ~10 enums. Keeping them in one file makes it easy to spot drift vs the Java source of truth and avoids barrel-import complexity.
**Tradeoffs:** File will grow — split by domain if it exceeds ~400 lines.
**Alternatives considered:** Per-domain type files (`types/events.ts`, `types/auth.ts`) — rejected for now due to small total size.

---

## No ORM / No Database on Frontend
**Date:** 2026-03-09
**Why:** Pure API client. All data lives in the Spring Boot backend. Frontend is stateless beyond the JWT cookie.

---

## TanStack Query v5 for Client Data
**Date:** 2026-03-09
**Why:** Server Components handle SSR data. TanStack Query handles interactive client flows (search, real-time updates, optimistic mutations) where SSR is not appropriate.
**Pattern:** Server Components fetch once for initial render; client components use `useQuery` with the same data as `initialData` to avoid waterfall.

---

## shadcn/ui Installed but Mostly Replaced
**Date:** 2026-03-09
**Why:** shadcn was initialised for its `lib/utils.ts` (cn helper) and component scaffolding tooling. The generated `components/ui/button.tsx` is kept as a shadcn reference but all app UI uses the Velvet-specific `VelvetButton`, `InputField`, etc.
**Tradeoffs:** Two button components exist — `components/ui/button.tsx` (shadcn) and `components/ui/VelvetButton.tsx` (Velvet). Always use `VelvetButton`.
