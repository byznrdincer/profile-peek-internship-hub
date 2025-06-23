
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  role: 'student' | 'recruiter';
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    console.log('useAuth: Fetching profile for user:', userId);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('useAuth: Error fetching profile:', error);
        return null;
      }
      
      console.log('useAuth: Profile data fetched:', profileData);
      return profileData;
    } catch (error) {
      console.error('useAuth: Exception fetching profile:', error);
      return null;
    }
  };

  const updateStudentLastLogin = async (role: string) => {
    if (role === 'student') {
      try {
        await supabase.rpc('update_student_last_login');
        console.log('useAuth: Updated student last login');
      } catch (error) {
        console.error('useAuth: Error updating student last login:', error);
      }
    }
  };

  useEffect(() => {
    console.log('useAuth: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile immediately without setTimeout
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          
          // Update last login for students
          if (profileData?.role) {
            await updateStudentLastLogin(profileData.role);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      console.log('useAuth: Checking for existing session');
      const { data: { session } } = await supabase.auth.getSession();
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
        
        // Update last login for students
        if (profileData?.role) {
          await updateStudentLastLogin(profileData.role);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log('useAuth: Signing out');
    await supabase.auth.signOut();
  };

  console.log('useAuth: Current state:', { 
    isAuthenticated: !!user, 
    role: profile?.role, 
    loading,
    userId: user?.id 
  });

  return {
    user,
    session,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
    isStudent: profile?.role === 'student',
    isRecruiter: profile?.role === 'recruiter'
  };
};
