-- Auto-create public.profiles when a new auth.users row is inserted.
-- Freelancer signup sends raw_user_meta_data.signup_as = 'freelancer'.
-- SECURITY DEFINER so RLS does not block the insert.

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name text;
  r text;
BEGIN
  display_name := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'full_name', '')), '');
  IF NEW.raw_user_meta_data->>'signup_as' = 'freelancer' THEN
    r := 'freelancer';
  ELSE
    r := COALESCE(NULLIF(lower(trim(COALESCE(NEW.raw_user_meta_data->>'role', ''))), ''), 'client');
  END IF;

  INSERT INTO public.profiles (id, full_name, role, onboarding_completed, is_available)
  VALUES (NEW.id, display_name, r, false, true)
  ON CONFLICT (id) DO UPDATE
    SET
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
      role = CASE
        WHEN EXCLUDED.role = 'freelancer' THEN 'freelancer'
        ELSE public.profiles.role
      END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user_profile();

COMMENT ON FUNCTION public.handle_new_user_profile() IS 'Syncs auth.users -> public.profiles; respects signup_as=freelancer from signUp metadata.';
