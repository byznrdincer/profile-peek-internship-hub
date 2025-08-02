import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
      const response = await fetch(`/api/recruiter/profile/me/`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to load recruiter profile");
      const profile = await response.json();
      setRecruiterProfile(profile);
    } catch (error) {
      console.error("Error loading recruiter profile:", error);
      setRecruiterProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recruiter/students/`, {  // BURASI GÜNCELLENDİ
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to load students");
      const studentsData = await response.json();
      setStudents(studentsData);
    } catch (error) {
      console.error("Error loading students:", error);
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

    try {
      const response = await fetch(`/api/recruiter/bookmarks/`, {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to load bookmarked students");
      const bookmarked = await response.json();
      setBookmarkedStudents(bookmarked);
    } catch (error) {
      console.error("Error loading bookmarked students:", error);
      setBookmarkedStudents([]);
    }
  };

  useEffect(() => {
    if (user) {
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
