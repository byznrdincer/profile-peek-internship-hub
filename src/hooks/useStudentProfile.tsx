
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  graduation_year: string;
  gpa: string;
  location: string;
  phone: string;
  bio: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  website_url: string;
  multiple_website_urls: string[];
  internship_type_preference: string;
  paid_internship_preference: string;
  preferred_internship_location: string;
  preferred_locations: string[];
  open_to_relocate: boolean;
  resume_url: string;
  resume_filename: string;
  profile_views: number;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

export const useStudentProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
      updateLastLogin();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        // Map database fields to interface, handling missing fields
        const profileData: StudentProfile = {
          id: data.id,
          user_id: data.user_id,
          name: data.name || "",
          email: data.email || "",
          university: data.university || "",
          major: data.major || "",
          graduation_year: data.graduation_year || "",
          gpa: data.gpa || "",
          location: data.location || "",
          phone: data.phone || "",
          bio: data.bio || "",
          skills: data.skills || [],
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          website_url: data.website_url || "",
          multiple_website_urls: data.multiple_website_urls || [],
          internship_type_preference: data.internship_type_preference || "",
          paid_internship_preference: data.paid_internship_preference || "",
          preferred_internship_location: data.preferred_internship_location || "",
          preferred_locations: data.preferred_locations || [],
          open_to_relocate: data.open_to_relocate || false,
          resume_url: data.resume_url || "",
          resume_filename: data.resume_filename || "",
          profile_views: data.profile_views || 0,
          last_login_at: data.last_login_at || "",
          created_at: data.created_at || "",
          updated_at: data.updated_at || ""
        };
        
        setProfile(profileData);
        await Promise.all([
          loadProjects(data.id),
          loadCertifications(data.id)
        ]);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "There was an error loading your profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_projects')
        .select('*')
        .eq('student_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadCertifications = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_certifications')
        .select('*')
        .eq('student_id', profileId)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      if (data) setCertifications(data);
    } catch (error) {
      console.error('Error loading certifications:', error);
    }
  };

  const updateLastLogin = async () => {
    try {
      await supabase.rpc('update_student_last_login');
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  const updateProfile = async (updates: Partial<StudentProfile>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('student_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile.",
        variant: "destructive",
      });
    }
  };

  const refreshProjects = () => {
    if (profile) {
      loadProjects(profile.id);
    }
  };

  const refreshCertifications = () => {
    if (profile) {
      loadCertifications(profile.id);
    }
  };

  return {
    profile,
    projects,
    certifications,
    loading,
    updateProfile,
    refreshProjects,
    refreshCertifications,
    reloadProfile: loadProfile
  };
};
