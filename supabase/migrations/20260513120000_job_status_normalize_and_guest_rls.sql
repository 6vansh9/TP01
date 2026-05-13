-- TaskPay: normalize jobs.status + guest read access for jobs & freelancer profiles
-- Run in Supabase SQL Editor (or apply via Supabase CLI migrations).
--
-- Prerequisites:
--   - public.jobs.status is text/varchar (if it is a Postgres ENUM, alter the enum to only
--     allow these three labels, or cast in the UPDATE — do not run the CHECK blindly)
--   - public.profiles.id = auth.users.id (if you use user_id, replace `id` with `user_id` below)
--
-- If you already have policies on these tables, review for duplicates or conflicts after run.

-- ---------------------------------------------------------------------------
-- 1) Map legacy status strings → open | in_progress | closed
-- ---------------------------------------------------------------------------
UPDATE public.jobs
SET status = CASE lower(trim(status::text))
  WHEN 'open' THEN 'open'
  WHEN 'published' THEN 'open'
  WHEN 'active' THEN 'open'
  WHEN 'draft' THEN 'closed'
  WHEN 'in_progress' THEN 'in_progress'
  WHEN 'in progress' THEN 'in_progress'
  WHEN 'assigned' THEN 'in_progress'
  WHEN 'hired' THEN 'in_progress'
  WHEN 'filled' THEN 'in_progress'
  WHEN 'closed' THEN 'closed'
  WHEN 'completed' THEN 'closed'
  WHEN 'complete' THEN 'closed'
  WHEN 'cancelled' THEN 'closed'
  WHEN 'canceled' THEN 'closed'
  ELSE 'closed'
END;

-- Default for new rows
ALTER TABLE public.jobs
  ALTER COLUMN status SET DEFAULT 'open';

-- Enforce allowed values (drop first if re-running migration)
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_status_check CHECK (status IN ('open', 'in_progress', 'closed'));

-- ---------------------------------------------------------------------------
-- 2) Grants (Supabase often grants SELECT to anon/authenticated via API roles)
-- ---------------------------------------------------------------------------
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3) Row Level Security — public discovery reads
-- ---------------------------------------------------------------------------
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Jobs: anyone (including guests) can read all job rows for marketplace discovery.
DROP POLICY IF EXISTS "taskpay_jobs_select_public" ON public.jobs;
CREATE POLICY "taskpay_jobs_select_public"
  ON public.jobs
  FOR SELECT
  USING (true);

-- Profiles: guests and signed-in users can read freelancer profiles;
-- signed-in users can always read their own row (client or freelancer).
DROP POLICY IF EXISTS "taskpay_profiles_select_discovery" ON public.profiles;
CREATE POLICY "taskpay_profiles_select_discovery"
  ON public.profiles
  FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = id)
    OR lower(trim(coalesce(role::text, ''))) = 'freelancer'
  );

-- Authenticated writes (safe defaults; drop if you already cover these elsewhere)
DROP POLICY IF EXISTS "taskpay_jobs_insert_client" ON public.jobs;
CREATE POLICY "taskpay_jobs_insert_client"
  ON public.jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "taskpay_jobs_update_client" ON public.jobs;
CREATE POLICY "taskpay_jobs_update_client"
  ON public.jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "taskpay_profiles_insert_own" ON public.profiles;
CREATE POLICY "taskpay_profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "taskpay_profiles_update_own" ON public.profiles;
CREATE POLICY "taskpay_profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
