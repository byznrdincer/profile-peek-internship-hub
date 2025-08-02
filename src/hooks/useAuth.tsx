import { useState } from 'react';

interface UserProfile {
  id: string;
  role: 'student' | 'recruiter';
  email: string;
  name?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async (userId: string, role: 'student' | 'recruiter') => {
    const endpoint = role === 'student'
      ? `http://127.0.0.1:8000/api/student/profile/${userId}/`
      : `http://127.0.0.1:8000/api/recruiter/profile/me/`; // recruiter için /me/

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Unexpected response:", text);
        return null;
      }

      const profileData = await response.json();
      return {
        ...profileData,
        role, // role bilgisi profile'a ekleniyor
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const login = async (userData: UserProfile) => {
    try {
      setLoading(true);
      setUser(userData);

      const prof = await fetchUserProfile(userData.id, userData.role);
      if (prof) {
        setProfile(prof);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error in login:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        setProfile(null);
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    user,
    profile,
    loading,
    login,
    signOut,
    isAuthenticated: !!user,
    isStudent: profile?.role === 'student',
    isRecruiter: profile?.role === 'recruiter',
  };
};
