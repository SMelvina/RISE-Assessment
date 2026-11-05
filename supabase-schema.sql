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

-- 2. Enable Row Level Security (RLS)
alter table public.submissions enable row level security;

-- 3. Allow anonymous public users to submit completed assessments
drop policy if exists "Allow public assessment submission" on public.submissions;
create policy "Allow public assessment submission"
  on public.submissions
  for insert
  with check (true);

-- 4. Allow public / admin to read assessment telemetry
drop policy if exists "Allow reading submissions" on public.submissions;
create policy "Allow reading submissions"
  on public.submissions
  for select
  using (true);

