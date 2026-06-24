# Frontend Agent Notes

## Project Overview

This is the Teachify classroom frontend, a Next.js 16 / React 19 app using the App Router, TanStack Query, Zustand, Radix UI, lucide-react, Recharts, Sonner, and Tailwind-style utility classes.

Core areas:

- `src/app/*`: route groups and pages for public, teacher, student, parent, admin.
- `src/features/*`: domain UI modules.
- `src/services/*`: API service wrappers.
- `src/services/api/api.endpoint.ts`: centralized backend endpoint constants.
- `src/hooks/queries/*`: TanStack Query hooks.
- `src/types/*`: shared frontend types.
- `src/components/*`: common and UI components.

## Commands

Run from `edu-ai-classroom-frontend`.

```powershell
npm run dev
npm run build
npx tsc --noEmit
npm run check
```

Local app URL:

```txt
http://localhost:3000
```

## Local Env

Frontend env belongs in `.env.local` or `.env` inside `edu-ai-classroom-frontend`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Do not include `/api` in `NEXT_PUBLIC_API_URL`; endpoints already include `/api`.

Correct:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Wrong:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

After changing env, restart `npm run dev`. If Next keeps stale values, remove `.next` and restart.

## API Patterns

- Add endpoint constants in `src/services/api/api.endpoint.ts`.
- Add typed services in `src/services/<feature>/*.service.ts`.
- Add query/mutation hooks in `src/hooks/queries/<feature>`.
- The shared `http()` helper automatically attaches the auth token and expects the backend response envelope.
- File uploads should pass `FormData`; do not set `Content-Type` manually for `FormData`.

## UI / State Patterns

- Use existing route group styles and feature components before adding new abstractions.
- Prefer lucide icons for actions.
- Use TanStack Query for server state and Zustand auth store for token/user state.
- Use Sonner for toast notifications.
- Keep dashboard/tool screens dense and work-focused; avoid marketing-style layouts inside app dashboards.
- Avoid nested cards and avoid layout overflow. Prefer stable dimensions and `min-w-0` in flex/grid layouts.

## Role Areas

- Teacher routes live under `(teacher)` and `src/features/teacher`.
- Student routes live under `(student)` and `src/features/student`.
- Parent routes live under `(parent)` and use parent/chat/notification services.
- Admin routes live under `(admin)` and use `src/services/admin`.

## Verification Expectations

For frontend changes, run at least:

```powershell
npx tsc --noEmit
npm run build
```

For UI layout fixes, test the affected route in a browser at desktop and mobile widths.

## Do Not Commit

Avoid committing local/tooling noise unless intentionally requested:

- `frontend-dev*.log`
- accidental `package-lock.json` if the repo is being managed with pnpm
- accidental `pnpm-workspace.yaml` changes from approve-builds
- `.env` / `.env.local`
