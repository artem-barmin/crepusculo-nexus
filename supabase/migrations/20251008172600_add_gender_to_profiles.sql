CREATE TYPE public.gender AS ENUM ('Male', 'Female', 'Other');
ALTER TABLE public.profiles ADD COLUMN gender public.gender;
