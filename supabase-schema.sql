-- =========================================================================
-- RISE Assessment - Supabase Cloud Synchronization Schema
-- Paste this into your Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

-- 1. Create the submissions table
create table if not exists public.submissions (
  id text primary key,
  "participantName" text not null,
  "startedAt" text,
  "completedAt" text,
  "totalScore" numeric,
  "overallIndex" numeric,
  "pinpointedStageNumber" integer,
  "pinpointedStageName" text,
  "pinpointedDimension" text,
  status text default 'Completed',
  "dimensionScores" jsonb,
  "dimensionPercentages" jsonb,
  responses jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Grant Table & Schema Privileges to Anon & Authenticated roles
grant usage on schema public to anon, authenticated;
grant all on table public.submissions to anon, authenticated;

-- 3. Enable Row Level Security (RLS)
alter table public.submissions enable row level security;

-- 4. Allow public users to insert assessments
drop policy if exists "Allow public assessment submission" on public.submissions;
create policy "Allow public assessment submission"
  on public.submissions
  for insert
  with check (true);

-- 5. Allow public users to update/upsert assessments
drop policy if exists "Allow updating submissions" on public.submissions;
create policy "Allow updating submissions"
  on public.submissions
  for update
  using (true);

-- 6. Allow reading assessment telemetry for admin dashboard
drop policy if exists "Allow reading submissions" on public.submissions;
create policy "Allow reading submissions"
  on public.submissions
  for select
  using (true);

