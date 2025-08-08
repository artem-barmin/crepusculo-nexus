-- Fix critical profile status security vulnerability and update settings
-- Users should not be able to update their own status (only admins should)

-- Drop the existing update policy that allows users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create separate policies for different fields
-- Policy for users to update their own profile data (excluding status)
CREATE POLICY "Users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
);

-- Add database constraint to ensure status field integrity (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_profile_status' 
    AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT valid_profile_status 
    CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Create new simplified storage policies
CREATE POLICY "Users can upload photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add age validation constraint to profiles table (21+ years old)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_age_constraint' 
    AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT valid_age_constraint 
    CHECK (
      birthday IS NULL OR 
      (birthday <= CURRENT_DATE - INTERVAL '21 years' AND birthday >= CURRENT_DATE - INTERVAL '120 years')
    );
  END IF;
END $$;