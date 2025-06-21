
-- Add social media and website URL columns to student_profiles table
ALTER TABLE public.student_profiles 
ADD COLUMN github_url text,
ADD COLUMN website_url text,
ADD COLUMN linkedin_url text;
