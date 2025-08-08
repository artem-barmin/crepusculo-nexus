-- Enable RLS on name_parts table
ALTER TABLE public.name_parts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read name parts (needed for username generation)
CREATE POLICY "Allow read access to name parts" 
ON public.name_parts 
FOR SELECT 
USING (true);