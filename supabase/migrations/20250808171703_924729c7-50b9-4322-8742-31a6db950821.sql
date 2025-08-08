-- Create enum type for profile status
CREATE TYPE public.profile_status AS ENUM ('pending', 'approved', 'rejected');

-- First drop the default
ALTER TABLE public.profiles 
ALTER COLUMN status DROP DEFAULT;

-- Update the profiles table to use the enum
ALTER TABLE public.profiles 
ALTER COLUMN status TYPE public.profile_status 
USING status::public.profile_status;

-- Set the new default value using the enum
ALTER TABLE public.profiles 
ALTER COLUMN status SET DEFAULT 'pending'::public.profile_status;