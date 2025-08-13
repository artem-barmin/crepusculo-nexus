-- Fix valid_profile_status constraint to include all available statuses
-- First, add the missing 'approved_plus' value to the enum type
ALTER TYPE public.profile_status ADD VALUE IF NOT EXISTS 'approved_plus';

-- Drop the existing constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS valid_profile_status;

-- Add the updated constraint with all available statuses
ALTER TABLE public.profiles
ADD CONSTRAINT valid_profile_status
CHECK (status IN ('pending', 'approved', 'rejected', 'approved_plus'));
