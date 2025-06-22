
-- Add new columns to student_profiles table for stipend expectations and internship preferences
ALTER TABLE public.student_profiles 
ADD COLUMN stipend_expectation text,
ADD COLUMN internship_type_preference text CHECK (internship_type_preference IN ('paid', 'unpaid', 'both'));

-- Add comment for clarity
COMMENT ON COLUMN public.student_profiles.stipend_expectation IS 'Expected stipend amount (e.g., "$1000/month", "Negotiable", etc.)';
COMMENT ON COLUMN public.student_profiles.internship_type_preference IS 'Whether student is interested in paid, unpaid, or both types of internships';
