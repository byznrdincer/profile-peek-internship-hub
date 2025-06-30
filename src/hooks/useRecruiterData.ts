
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useRecruiterData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [bookmarkedStudents, setBookmarkedStudents] = useState<any[]>([]);
  const [recruiterProfile, setRecruiterProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadRecruiterProfile = async () => {
    if (!user) return;

    setProfileLoading(true);
    try {
      console.log('Loading recruiter profile for user:', user.id);
      
      const { data: profile, error } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading recruiter profile:', error);
        if (error.code === 'PGRST116') {
          console.log('No recruiter profile found, user needs to create one');
          setRecruiterProfile(null);
        }
      } else if (profile) {
        console.log('Successfully loaded recruiter profile:', profile);
        setRecruiterProfile(profile);
      } else {
        console.log('No recruiter profile data found');
        setRecruiterProfile(null);
      }
    } catch (error) {
      console.error('Error in loadRecruiterProfile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    
    try {
      const { data: studentsData, error: studentsError } = await supabase
        .from('student_profiles')
        .select(`
          *,
          projects:student_projects(*)
        `)
        .order('last_login_at', { ascending: false, nullsFirst: false });

      if (studentsError) throw studentsError;

      if (studentsData) {
        console.log("Students loaded with email field:", studentsData);
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error loading students",
        description: "There was an error loading student profiles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarkedStudents = async () => {
    if (!user) return;

    console.log("Loading bookmarked students for user:", user.id);
    
    try {
      const { data: recruiterProfile } = await supabase
        .from('recruiter_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!recruiterProfile) {
        console.log("No recruiter profile found");
        return;
      }

      console.log("Recruiter profile found:", recruiterProfile.id);

      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('student_bookmarks')
        .select('student_user_id')
        .eq('recruiter_id', recruiterProfile.id);

      if (bookmarksError) throw bookmarksError;

      console.log("Bookmarks found:", bookmarks?.length, bookmarks);

      if (bookmarks && bookmarks.length > 0) {
        const studentUserIds = bookmarks.map(b => b.student_user_id);
        console.log("Student user IDs to fetch:", studentUserIds);

        const { data: studentsData, error: studentsError } = await supabase
          .from('student_profiles')
          .select(`
            *,
            projects:student_projects(*)
          `)
          .in('user_id', studentUserIds)
          .order('last_login_at', { ascending: false, nullsFirst: false });

        if (studentsError) throw studentsError;

        console.log("Student profiles found:", studentsData?.length);
        console.log("Final bookmarked students with email:", studentsData?.length);
        
        if (studentsData) {
          setBookmarkedStudents(studentsData);
        }
      } else {
        setBookmarkedStudents([]);
      }
    } catch (error) {
      console.error('Error loading bookmarked students:', error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("User authenticated, loading recruiter data...", user);
      loadRecruiterProfile();
      loadBookmarkedStudents();
      loadStudents();
    }
  }, [user]);

  return {
    loading,
    students,
    bookmarkedStudents,
    recruiterProfile,
    profileLoading,
    loadRecruiterProfile,
    loadStudents,
    loadBookmarkedStudents
  };
};
