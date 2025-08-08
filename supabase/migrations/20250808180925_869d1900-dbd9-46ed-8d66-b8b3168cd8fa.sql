-- Fix critical profile status security vulnerability
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
  auth.uid() = user_id AND
  -- Prevent users from changing their status
  (OLD.status IS NOT DISTINCT FROM NEW.status)
);

-- Add database constraint to ensure status field integrity
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_profile_status 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Improve storage security with better file validation
-- Update storage policies for user-photos bucket
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

-- Enhanced upload policy with file size restrictions only
CREATE POLICY "Users can upload their own photos with size limit" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  -- Limit file size to 20MB (20971520 bytes)
  octet_length(decode(encode(storage.get_object(bucket_id, name), 'base64'), 'base64')) <= 20971520
);

-- Enhanced update policy 
CREATE POLICY "Users can update their own photos with size limit" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add age validation constraint to profiles table (21+ years old)
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_age_constraint 
CHECK (
  birthday IS NULL OR 
  (birthday <= CURRENT_DATE - INTERVAL '21 years' AND birthday >= CURRENT_DATE - INTERVAL '120 years')
);