
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

  useEffect(() => {
    console.log('useAuth: Setting up authentication');
    
    // Get initial session
    const getSession = async () => {
      try {
        console.log('useAuth: Getting initial session');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuth: Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('useAuth: Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('useAuth: Exception getting session:', error);
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    getSession();

    return () => {
      console.log('useAuth: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('useAuth: Loading profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('useAuth: Error loading profile:', error);
        return;
      }

      if (profileData) {
        console.log('useAuth: Profile loaded:', profileData);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('useAuth: Exception loading profile:', error);
    }
  };

  const signOut = async () => {
    try {
      console.log('useAuth: Signing out');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('useAuth: Error signing out:', error);
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
