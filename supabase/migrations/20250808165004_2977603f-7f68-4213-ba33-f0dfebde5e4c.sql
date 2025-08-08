-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix generate username function security
CREATE OR REPLACE FUNCTION public.generate_username()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  new_username TEXT;
  counter INTEGER := 1;
BEGIN
  new_username := 'user' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT;
  
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) LOOP
    new_username := 'user' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT || '_' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN new_username;
END;
$$;