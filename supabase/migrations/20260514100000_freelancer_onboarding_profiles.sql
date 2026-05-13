-- TaskPay: freelancer onboarding + avatar storage
-- Run after your base profiles table exists.

-- ---------------------------------------------------------------------------
-- profiles columns (idempotent)
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS goals text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_preference text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS open_to_contract_to_hire boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_setup_method text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS work_experience jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS languages jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dob date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

COMMENT ON COLUMN public.profiles.work_experience IS 'Array of { id, company, title, startDate, endDate, description }';
COMMENT ON COLUMN public.profiles.education IS 'Array of { id, school, degree, field, startDate, endDate }';
COMMENT ON COLUMN public.profiles.languages IS 'Array of { id, name, proficiency }';
COMMENT ON COLUMN public.profiles.address IS '{ street, city, state, zip, country }';

-- ---------------------------------------------------------------------------
-- Storage: public avatars bucket (adjust policies to your security model)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "taskpay_avatars_public_read" ON storage.objects;
CREATE POLICY "taskpay_avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "taskpay_avatars_insert_own" ON storage.objects;
CREATE POLICY "taskpay_avatars_insert_own"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "taskpay_avatars_update_own" ON storage.objects;
CREATE POLICY "taskpay_avatars_update_own"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "taskpay_avatars_delete_own" ON storage.objects;
CREATE POLICY "taskpay_avatars_delete_own"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
