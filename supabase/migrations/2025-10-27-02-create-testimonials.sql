-- Create table for storing player testimonials
create table if not exists public.testimonials (
   id         bigserial primary key,
   name       text not null,
   role       text,
   email      text, -- Added email field
   message    text not null,
   avatar_url text,
   rating     int not null check ( rating between 1 and 5 ), -- Added rating field
   approved   boolean not null default false,
   created_at timestamptz not null default now()
);

-- Index for ordering by latest approved testimonials
create index if not exists idx_testimonials_created_at on
   public.testimonials (
      created_at
   desc );

-- Ensure row-level security is disabled for the testimonials table
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies for the testimonials table
DROP POLICY IF EXISTS anon_insert_testimonials ON public.testimonials;