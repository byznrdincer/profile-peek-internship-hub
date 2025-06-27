
-- Update the increment_profile_view function to only count unique views
CREATE OR REPLACE FUNCTION public.increment_profile_view(student_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  recruiter_profile_id UUID;
  student_profile_id UUID;
  view_exists BOOLEAN;
BEGIN
  -- Get recruiter profile id
  SELECT id INTO recruiter_profile_id 
  FROM public.recruiter_profiles 
  WHERE user_id = auth.uid();
  
  -- Get student profile id
  SELECT id INTO student_profile_id 
  FROM public.student_profiles 
  WHERE user_id = student_user_id;
  
  IF recruiter_profile_id IS NOT NULL AND student_profile_id IS NOT NULL THEN
    -- Check if this recruiter has already viewed this student
    SELECT EXISTS(
      SELECT 1 FROM public.profile_views 
      WHERE recruiter_id = recruiter_profile_id 
      AND student_id = student_profile_id
    ) INTO view_exists;
    
    -- Only increment if it's a new view
    IF NOT view_exists THEN
      -- Insert new profile view
      INSERT INTO public.profile_views (recruiter_id, student_id)
      VALUES (recruiter_profile_id, student_profile_id);
      
      -- Increment view count only for new views
      UPDATE public.student_profiles 
      SET profile_views = profile_views + 1 
      WHERE id = student_profile_id;
    ELSE
      -- Update the viewed_at timestamp for existing views
      UPDATE public.profile_views 
      SET viewed_at = now()
      WHERE recruiter_id = recruiter_profile_id 
      AND student_id = student_profile_id;
    END IF;
  END IF;
END;
$$;
