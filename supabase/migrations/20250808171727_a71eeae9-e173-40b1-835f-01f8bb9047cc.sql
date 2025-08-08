-- Create enum type for profile status
CREATE TYPE public.profile_status AS ENUM ('pending', 'approved', 'rejected');

-- Temporarily disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

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

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate the policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);