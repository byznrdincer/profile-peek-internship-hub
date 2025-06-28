
-- Add multiple_website_urls array column to student_profiles table
ALTER TABLE public.student_profiles 
ADD COLUMN multiple_website_urls text[];

-- Update existing single website_url data to the new array format
UPDATE public.student_profiles 
SET multiple_website_urls = ARRAY[website_url] 
WHERE website_url IS NOT NULL AND website_url != '';

-- The old website_url column can be kept for backward compatibility if needed
