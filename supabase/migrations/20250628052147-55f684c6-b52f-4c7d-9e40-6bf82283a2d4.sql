
-- Add a new array column for multiple preferred locations
ALTER TABLE public.student_profiles 
ADD COLUMN preferred_locations text[];

-- We'll keep the old single location field for backward compatibility initially
-- but we can remove it later if needed
