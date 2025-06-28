
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return profileData;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('useAuth: Initializing auth hook');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('useAuth: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }
        
        if (!mounted) return;
        
        console.log('useAuth: Initial session:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('useAuth: Fetching user profile');
          const profileData = await fetchUserProfile(session.user.id);
          
          if (mounted && profileData) {
            console.log('useAuth: Profile loaded:', profileData.role);
            setProfile(profileData);
            
            // Update last login for students
            if (profileData.role === 'student') {
              try {
                await supabase.rpc('update_student_last_login');
              } catch (error) {
                console.error('Error updating student last login:', error);
              }
            }
          }
        }
        
        if (mounted) {
          console.log('useAuth: Setting loading to false');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    console.log('useAuth: Setting up auth listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchUserProfile(session.user.id);
          
          if (mounted && profileData) {
            setProfile(profileData);
            
            // Update last login for students
            if (profileData.role === 'student') {
              try {
                await supabase.rpc('update_student_last_login');
              } catch (error) {
                console.error('Error updating student last login:', error);
              }
            }
          }
        } else {
          if (mounted) {
            setProfile(null);
          }
        }
      }
    );

    // Initialize auth after setting up listener
    initializeAuth();

    return () => {
      console.log('useAuth: Cleaning up');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('useAuth: Signing out');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
