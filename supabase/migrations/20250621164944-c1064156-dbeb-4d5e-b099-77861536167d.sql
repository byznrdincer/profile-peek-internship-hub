
-- Add last_login_at column to student_profiles table to track login activity
ALTER TABLE public.student_profiles 
ADD COLUMN last_login_at timestamp with time zone DEFAULT now();

-- Create a function to update last login timestamp
CREATE OR REPLACE FUNCTION public.update_student_last_login()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.student_profiles 
  SET last_login_at = now() 
  WHERE user_id = auth.uid();
END;
$$;
