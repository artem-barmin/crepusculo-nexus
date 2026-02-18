---
name: supabase-migrate
description: Apply database schema changes to the Supabase remote database
user_invocable: true
---

# Supabase Migration Skill

Apply schema changes directly to the linked Supabase project (`pnnapdxefbmafisglnfz`).

## Instructions

When the user describes a database change (new table, column, RLS policy, function, enum, etc.):

### 1. Apply SQL directly to the remote database

Run the SQL against the linked remote database using:

```bash
npx supabase db execute --linked <<'EOSQL'
-- your SQL here
EOSQL
```

- Do NOT create migration files in `supabase/migrations/`
- Write idempotent SQL where possible (`CREATE OR REPLACE`, `IF NOT EXISTS`, `DROP IF EXISTS`)
- If the command fails, read the error, fix the SQL, and retry

### 2. Regenerate TypeScript types

```bash
npx supabase gen types --linked --schema public > src/integrations/supabase/types.ts
```

### 3. Verify types compile

```bash
npx tsc --noEmit
```

- If there are type errors in app code caused by the schema change, fix them

### 4. Show the user a summary

Report:
- What changed in the schema
- Whether the SQL executed successfully
- Whether types regenerated and compile cleanly

## Important Rules

- Always use `npx supabase` (not bare `supabase`)
- Always use `--linked` flag for remote operations (no Docker available)
- NEVER create migration files — always apply changes directly
- NEVER run destructive operations (`DROP TABLE`, `DROP COLUMN`, `TRUNCATE`) without explicit user confirmation
- For `ALTER TYPE ... ADD VALUE` (enum changes), these cannot be rolled back in Postgres — warn the user
- When adding NOT NULL columns, always provide a DEFAULT or backfill existing rows first
