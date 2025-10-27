-- Create table for storing contact form submissions
create table if not exists public.contact_messages (
   id         bigserial primary key,
   name       text not null,
   email      text not null,
   message    text not null,
   created_at timestamptz not null default now()
);

-- Optional: add index on created_at for efficient sorting
create index if not exists idx_contact_messages_created_at on
   public.contact_messages (
      created_at
   desc );