# Crepusculo Nexus

## Project Overview

Vite + React + TypeScript app with Supabase backend. Uses shadcn/ui components, TanStack Query, and React Router.

## Supabase

- **Project ref:** `pnnapdxefbmafisglnfz`
- **MCP only:** Use Supabase MCP tools (`mcp__supabase__*`) for ALL database operations. Do NOT use the Supabase CLI.

### Database Schema Changes

For ANY database operation (adding tables, columns, enums, RLS policies, functions, indexes, etc.):

1. Execute SQL via `mcp__supabase__execute_sql` or `mcp__supabase__apply_migration`
2. Regenerate TypeScript types via MCP
3. Verify compilation with `npx tsc --noEmit`

**Do NOT create migration files.** Apply SQL directly to the remote database, then regenerate types.

### Key Files

- `src/integrations/supabase/client.ts` — Supabase client (auto-generated, do not edit)
- `src/integrations/supabase/types.ts` — TypeScript types from DB schema (regenerated via MCP)

### Current Tables

| Table | Description |
|---|---|
| `profiles` | User profiles (status, gender, social_media, tag_ids, etc.) |
| `user_photos` | User photo URLs with is_primary flag |
| `code_of_conduct_tests` | Quiz answers and completion tracking |
| `tags` | Tag definitions (id, value, label, color). Referenced by `profiles.tag_ids` as `bigint[]` |

### Enums

- `profile_status`: pending, approved, rejected
- `gender`: Male, Female, Other

## Commands

- `npm run dev` — start dev server (port 5173)
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run format` — Prettier
