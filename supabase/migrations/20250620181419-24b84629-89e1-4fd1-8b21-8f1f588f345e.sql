
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('student', 'recruiter');

-- Create profiles table for both students and recruiters
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create student profiles table
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  phone TEXT,
  university TEXT,
  major TEXT,
  graduation_year TEXT,
  bio TEXT,
  skills TEXT[], -- Array of skills
  resume_url TEXT,
  resume_filename TEXT,
  profile_views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create projects table for students
CREATE TABLE public.student_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[], -- Array of technologies
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiter profiles table
CREATE TABLE public.recruiter_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT,
  name TEXT,
  position TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create profile views tracking table
CREATE TABLE public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES public.recruiter_profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(recruiter_id, student_id)
);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for student_profiles
CREATE POLICY "Students can manage their own profile" ON public.student_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view all student profiles" ON public.student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'recruiter'
    )
  );

-- RLS Policies for student_projects
CREATE POLICY "Students can manage their own projects" ON public.student_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles 
      WHERE student_profiles.id = student_projects.student_id 
      AND student_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can view all student projects" ON public.student_projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'recruiter'
    )
  );

-- RLS Policies for recruiter_profiles
CREATE POLICY "Recruiters can manage their own profile" ON public.recruiter_profiles
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for profile_views
CREATE POLICY "Recruiters can manage their own views" ON public.profile_views
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.recruiter_profiles 
      WHERE recruiter_profiles.id = profile_views.recruiter_id 
      AND recruiter_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their profile views" ON public.profile_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.student_profiles 
      WHERE student_profiles.id = profile_views.student_id 
      AND student_profiles.user_id = auth.uid()
    )
  );

-- Storage policies for resumes
CREATE POLICY "Students can upload their own resumes" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can update their own resumes" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can delete their own resumes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Students can view their own resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Recruiters can view all resumes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'recruiter'
    )
  );

-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'student')::user_role,
    new.email
  );
  
  -- Create specific profile based on role
  IF COALESCE(new.raw_user_meta_data->>'role', 'student') = 'student' THEN
    INSERT INTO public.student_profiles (user_id, name)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', ''));
  ELSE
    INSERT INTO public.recruiter_profiles (user_id, name)
    VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', ''));
  END IF;
  
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to increment profile views
CREATE OR REPLACE FUNCTION public.increment_profile_view(student_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  recruiter_profile_id UUID;
  student_profile_id UUID;
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
    -- Insert or update profile view
    INSERT INTO public.profile_views (recruiter_id, student_id)
    VALUES (recruiter_profile_id, student_profile_id)
    ON CONFLICT (recruiter_id, student_id) 
    DO UPDATE SET viewed_at = now();
    
    -- Increment view count
    UPDATE public.student_profiles 
    SET profile_views = profile_views + 1 
    WHERE id = student_profile_id;
  END IF;
END;
$$;
