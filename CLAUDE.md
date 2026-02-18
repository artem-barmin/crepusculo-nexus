# Crepusculo Nexus

## Project Overview

Vite + React + TypeScript app with Supabase backend. Uses shadcn/ui components, TanStack Query, and React Router.

## Supabase

- **Project ref:** `pnnapdxefbmafisglnfz`
- **CLI:** Always use `npx supabase` (no global install)
- **No Docker in devcontainer** — local DB commands (`start`, `reset`, `db dump`) won't work. Always use `--linked` for remote operations.

### Database Schema Changes

**IMPORTANT:** For ANY database operation (adding tables, columns, enums, RLS policies, functions, indexes, etc.), always use the `/supabase-migrate` skill. This ensures the full workflow is followed: create migration, push to remote, regenerate types, and verify compilation.

**Do NOT create migration files.** Always apply SQL directly to the remote database, then regenerate types.

### Key Files

- `src/integrations/supabase/client.ts` — Supabase client (auto-generated, do not edit)
- `src/integrations/supabase/types.ts` — TypeScript types from DB schema (regenerated via CLI)
- `supabase/config.toml` — project config

### Current Tables

| Table | Description |
|---|---|
| `profiles` | User profiles (status, gender, social_media, etc.) |
| `user_photos` | User photo URLs with is_primary flag |
| `code_of_conduct_tests` | Quiz answers and completion tracking |
| `tags` | Tag definitions |

### Enums

- `profile_status`: pending, approved, rejected, approved_plus
- `gender`: Male, Female, Other

## Commands

- `npm run dev` — start dev server (port 5173)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run format` — Prettier
