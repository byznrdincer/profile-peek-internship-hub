
-- Add preferred_internship_location and open_to_relocate columns to student_profiles table
ALTER TABLE public.student_profiles 
ADD COLUMN preferred_internship_location text,
ADD COLUMN open_to_relocate boolean DEFAULT false;
