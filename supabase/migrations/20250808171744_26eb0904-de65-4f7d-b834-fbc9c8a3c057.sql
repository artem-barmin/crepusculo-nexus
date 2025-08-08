-- Create enum type for profile status
CREATE TYPE public.profile_status AS ENUM ('pending', 'approved', 'rejected');

-- Add a new column with enum type
ALTER TABLE public.profiles 
ADD COLUMN status_new public.profile_status DEFAULT 'pending'::public.profile_status;

-- Copy data from old column to new column
UPDATE public.profiles 
SET status_new = status::public.profile_status;

-- Drop the old column
ALTER TABLE public.profiles DROP COLUMN status;

-- Rename the new column to status
ALTER TABLE public.profiles RENAME COLUMN status_new TO status;