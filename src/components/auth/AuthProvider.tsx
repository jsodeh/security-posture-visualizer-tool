import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, organizationName: string) => Promise<any>;
  signOut: () => Promise<void>;
  organizationId: string | null;
  organizationName: string | null;
  profile: any | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [organizationName, setOrganizationName] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          // Demo mode - set up demo user
          setUser({
            id: 'demo-user-123',
            email: 'demo@cyberguard.com',
          } as User);
          setProfile({
            id: 'demo-user-123',
            email: 'demo@cyberguard.com',
            first_name: 'Demo',
            last_name: 'User',
            company_name: 'CyberGuard Demo Corp',
            profile_completed: true
          });
          setOrganizationId('550e8400-e29b-41d4-a716-446655440000');
          setOrganizationName('CyberGuard Demo Corp');
          setLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Fallback to demo mode on error
        setUser({
          id: 'demo-user-123',
          email: 'demo@cyberguard.com',
        } as User);
        setProfile({
          id: 'demo-user-123',
          email: 'demo@cyberguard.com',
          first_name: 'Demo',
          last_name: 'User',
          company_name: 'CyberGuard Demo Corp',
          profile_completed: true
        });
        setOrganizationId('550e8400-e29b-41d4-a716-446655440000');
        setOrganizationName('CyberGuard Demo Corp');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes only if Supabase is configured
    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchUserProfile(session.user);
          } else {
            setProfile(null);
            setOrganizationId(null);
            setOrganizationName(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const fetchUserProfile = async (user: User) => {
    if (!isSupabaseConfigured) return;
    
    setProfileLoading(true);
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found - create a default one for new users
        const defaultProfile = {
          id: user.id,
          email: user.email,
          profile_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Try to insert the profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile);
        
        if (!insertError) {
          setProfile(defaultProfile);
        } else {
          // If insert fails, just set the default profile without saving
          setProfile(defaultProfile);
        }
        setOrganizationName('CyberGuard Demo Corp');
      } else if (error) {
        console.error('Error fetching profile:', error);
        // Set fallback profile on other errors
        setProfile({
          id: user.id,
          email: user.email,
          profile_completed: false
        });
        setOrganizationName('CyberGuard Demo Corp');
      } else if (profileData) {
        setProfile(profileData);
        setOrganizationName(profileData.company_name || 'CyberGuard Demo Corp');
      }
      
      // Always set demo organization for now
      setOrganizationId('550e8400-e29b-41d4-a716-446655440000');
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to demo data with default profile
      setProfile({
        id: user.id,
        email: user.email,
        profile_completed: false
      });
      setOrganizationId('550e8400-e29b-41d4-a716-446655440000');
      setOrganizationName('CyberGuard Demo Corp');
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode sign in
      const demoUser = {
        id: 'demo-user-123',
        email: email,
      } as User;
      
      setUser(demoUser);
      setProfile({
        id: 'demo-user-123',
        email: email,
        first_name: 'Demo',
        last_name: 'User',
        company_name: 'CyberGuard Demo Corp',
        profile_completed: true
      });
      setOrganizationId('550e8400-e29b-41d4-a716-446655440000');
      setOrganizationName('CyberGuard Demo Corp');
      
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, organizationName: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode sign up
      const demoUser = {
        id: 'demo-user-123',
        email: email,
      } as User;
      
      setUser(demoUser);
      setProfile({
        id: 'demo-user-123',
        email: email,
        company_name: organizationName,
        profile_completed: false
      });
      setOrganizationId('550e8400-e29b-41d4-a716-446655440000');
      setOrganizationName(organizationName);
      
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          organization_name: organizationName,
        },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      // Demo mode sign out
      setUser(null);
      setProfile(null);
      setOrganizationId(null);
      setOrganizationName(null);
      return;
    }

    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    organizationId,
    organizationName,
    profile,
    profileLoading,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};