
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
      console.log('Fetching user profile for:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Profile data fetched:', profileData);
      return profileData;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('useAuth: Initializing');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('useAuth: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          console.log('useAuth: Initial session:', !!session);
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
          }
          
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event);
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchUserProfile(session.user.id);
          if (mounted && profileData) {
            setProfile(profileData);
            
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

    // Initialize auth
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
      setUser(null);
      setSession(null);
      setProfile(null);
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
