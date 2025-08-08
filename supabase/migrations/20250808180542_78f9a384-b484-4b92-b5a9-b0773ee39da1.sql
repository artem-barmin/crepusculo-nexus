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

-- Create audit table for status changes
CREATE TABLE public.profile_status_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT
);

-- Enable RLS on audit table
ALTER TABLE public.profile_status_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (for now, users can't see audit)
CREATE POLICY "No one can access audit logs yet" 
ON public.profile_status_audit 
FOR ALL 
USING (false);

-- Create trigger function to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.profile_status_audit (
      profile_id, 
      old_status, 
      new_status, 
      changed_by
    ) VALUES (
      NEW.id,
      OLD.status::text,
      NEW.status::text,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for status changes
CREATE TRIGGER profile_status_change_audit
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_status_change();

-- Improve storage security with better file validation
-- Update storage policies for user-photos bucket to add file type restrictions
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

-- Enhanced upload policy with file type restrictions
CREATE POLICY "Users can upload their own photos with restrictions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  -- Restrict file types to images only
  (storage.extension(name) = ANY(ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif'])) AND
  -- Limit file size to 5MB (5242880 bytes)
  octet_length(decode(encode(storage.get_object(bucket_id, name), 'base64'), 'base64')) <= 5242880
);

-- Enhanced update policy 
CREATE POLICY "Users can update their own photos with restrictions" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'user-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1] AND
  (storage.extension(name) = ANY(ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif']))
);

-- Add age validation constraint to profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_age_constraint 
CHECK (
  birthday IS NULL OR 
  (birthday <= CURRENT_DATE - INTERVAL '13 years' AND birthday >= CURRENT_DATE - INTERVAL '120 years')
);

-- Create function to validate social media URLs
CREATE OR REPLACE FUNCTION validate_social_media_url(url TEXT, platform TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN true; -- Allow empty URLs
  END IF;
  
  -- Basic URL format validation
  IF url !~ '^https?://' THEN
    RETURN false;
  END IF;
  
  -- Platform-specific validation
  CASE platform
    WHEN 'instagram' THEN
      RETURN url ~ '^https?://(www\.)?instagram\.com/[a-zA-Z0-9._]+/?$';
    WHEN 'twitter' THEN
      RETURN url ~ '^https?://(www\.)?(twitter\.com|x\.com)/[a-zA-Z0-9_]+/?$';
    WHEN 'tiktok' THEN
      RETURN url ~ '^https?://(www\.)?tiktok\.com/@[a-zA-Z0-9._]+/?$';
    WHEN 'facebook' THEN
      RETURN url ~ '^https?://(www\.)?facebook\.com/[a-zA-Z0-9._]+/?$';
    WHEN 'linkedin' THEN
      RETURN url ~ '^https?://(www\.)?linkedin\.com/in/[a-zA-Z0-9-]+/?$';
    WHEN 'youtube' THEN
      RETURN url ~ '^https?://(www\.)?youtube\.com/(c/|channel/|user/|@)[a-zA-Z0-9._-]+/?$';
    ELSE
      RETURN true; -- Allow other platforms with basic URL validation
  END CASE;
END;
$$ LANGUAGE plpgsql;