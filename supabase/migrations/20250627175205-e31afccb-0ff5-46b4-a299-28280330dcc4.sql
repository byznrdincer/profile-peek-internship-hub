
-- Create a table for student certifications
CREATE TABLE public.student_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  issuing_organization TEXT,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  certificate_file_url TEXT,
  certificate_filename TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.student_certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for student certifications
CREATE POLICY "Users can view certifications of all students" 
  ON public.student_certifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "Students can manage their own certifications" 
  ON public.student_certifications 
  FOR ALL 
  USING (
    student_id IN (
      SELECT id FROM public.student_profiles WHERE user_id = auth.uid()
    )
  );

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true);

-- Create storage policies for certificates bucket
CREATE POLICY "Anyone can view certificates" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'certificates');

CREATE POLICY "Authenticated users can upload certificates" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own certificates" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own certificates" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'certificates' AND auth.uid()::text = (storage.foldername(name))[1]);
