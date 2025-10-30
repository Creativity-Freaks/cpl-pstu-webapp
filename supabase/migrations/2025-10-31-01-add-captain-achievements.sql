-- Migration: add captain and achievements columns to teams (idempotent)
do $$
begin
  begin
    alter table public.teams add column captain text;
  exception when duplicate_column then
    null;
  end;
  begin
    alter table public.teams add column achievements text[];
  exception when duplicate_column then
    null;
  end;
end$$;

-- Ensure read policy still allows selects
create policy if not exists "Read public data" on public.teams for select using ( true );
