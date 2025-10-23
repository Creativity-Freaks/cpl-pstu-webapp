# Supabase connectivity & migration helpers

We added two helper artifacts to make it safe to verify and migrate existing `profiles` rows:

- `scripts/check-supabase.mjs` — a zero-dependency Node script that reads `.env` and performs a basic `profiles` query plus `auth.getSession` check. Run it with:

```sh
npm run check:supabase
```

- `supabase/migrations/2025-10-24-01-split-session-from-transaction.sql` — an idempotent, review-first SQL migration that:
  - creates `public.profiles_backup` and copies any missing rows (safe backup),
  - provides a SELECT preview of rows where `transaction_id` looks like it contains a session token,
  - includes commented UPDATE examples you can run after review to move extracted session tokens into the `session` column.

How to run the migration safely:

1. In your Supabase dashboard, open the SQL editor and paste the contents of `supabase/migrations/2025-10-24-01-split-session-from-transaction.sql`.
2. Run only the SELECT preview (step 2) first and inspect the rows returned.
3. If the preview looks correct, choose one of the commented UPDATE blocks (regex extraction or delimiter split), uncomment it, and run it.
4. Verify the changes with `select id, email, transaction_id, session from public.profiles where id in (select id from public.profiles_backup);`.
5. If something goes wrong, restore from `public.profiles_backup`.

If you'd like, I can adjust the regex to match your exact legacy `transaction_id` patterns or prepare a migration that runs automatically via the Supabase CLI — tell me which pattern you observe and I will update the migration file.
