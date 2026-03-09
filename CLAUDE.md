# Partii Frontend — Claude Instructions

## On Every Session Start
1. Read `docs/HANDOFF.md` — current phase, branch, and immediate next actions
2. Read `docs/architecture.md` — project structure and data flow
3. Read `docs/patterns.md` — design rules and code patterns to enforce

## After Every Feature or Bugfix
Update `docs/changelog.md` with what was built and `docs/HANDOFF.md` with the new next actions.

## Git Workflow
- Work in feature branches off `dev`: `feature/phase-N-name`
- Commit messages: `feat(scope): description` — NO "Co-Authored-By" lines ever
- Push branch; user creates PR into `dev`
- Never commit directly to `main`

## Design System (Velvet — enforce on every component)
- Dark mode ONLY — `bg-bg-primary` (#000) base, never light styles
- **Orange `accent-action` (#FF8C42)** = actions (CTAs, buttons, create)
- **Lavender `accent-primary` (#9B8EC4)** = navigation, selected states, info
- Phosphor Icons — `@phosphor-icons/react` — thin weight always
- Focus ring: `focus:border-accent-primary focus:shadow-lavender-ring`
- No drop shadows — depth via bg color only

## Always Use
- `VelvetButton` (not shadcn `button.tsx`) — has `loading`, `variant`, `size` props
- `InputField` / `TextareaField` for all form inputs
- `ApiClientError` pattern — catch in forms, show in `text-error` text
- `react-hook-form` + `zod` for all forms
- `lib/auth/tokens.ts` is server-only — never import in client components
