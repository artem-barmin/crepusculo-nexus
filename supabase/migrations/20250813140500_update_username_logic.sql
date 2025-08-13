-- Update username logic: remove auto-generation, allow user-defined usernames
-- This migration removes the database-side username generation and allows users to set their own usernames

-- Drop the existing username generation function
DROP FUNCTION IF EXISTS public.generate_username();

-- Drop the name_parts table as it's no longer needed
DROP TABLE IF EXISTS public.name_parts;

-- Make username field editable by removing any constraints that prevent updates
-- The username field should remain unique but allow updates
-- No changes needed to the profiles table structure as username is already nullable and unique

-- Update the RLS policy to allow users to update their username
-- The existing policy already allows users to update their own profile data
-- No additional changes needed for RLS policies
