
-- Create a storage bucket for project videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-videos', 'project-videos', true);

-- Create RLS policies for the project videos bucket
CREATE POLICY "Users can upload their own project videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view project videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-videos');

CREATE POLICY "Users can update their own project videos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own project videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add video_url column to student_projects table
ALTER TABLE public.student_projects 
ADD COLUMN video_url text;
