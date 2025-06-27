
-- Remove stipend_expectation column from student_profiles table
ALTER TABLE public.student_profiles 
DROP COLUMN IF EXISTS stipend_expectation;
