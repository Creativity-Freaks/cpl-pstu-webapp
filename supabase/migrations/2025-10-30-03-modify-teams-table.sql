-- Migration to modify the `teams` table to add a description column

ALTER TABLE public.teams
ADD COLUMN description TEXT;