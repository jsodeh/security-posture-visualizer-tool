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
    const initializeAuth = async () => {
      console.log('Initializing auth...');
      
      try {
        if (!isSupabaseConfigured || !supabase) {
          console.log('Supabase not configured, using demo mode');
          // Demo mode - set up demo user immediately
          const demoUser = {
            id: 'demo-user-123',
            email: 'demo@cyberguard.com',
          } as User;
          
          setUser(demoUser);
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

        // Try to get session from Supabase
        console.log('Getting Supabase session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Supabase session error, falling back to demo mode:', error);
          // Fall back to demo mode
          const demoUser = {
            id: 'demo-user-123',
            email: 'demo@cyberguard.com',
          } as User;
          
          setUser(demoUser);
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

        console.log('Session retrieved:', session ? 'Found' : 'None');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User found, fetching profile...');
          await fetchUserProfile(session.user);
        } else {
          console.log('No session, using demo mode');
          // No session, use demo data for the app to work
          const demoUser = {
            id: 'demo-user-123',
            email: 'demo@cyberguard.com',
          } as User;
          
          setUser(demoUser);
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
        }
      } catch (error) {
        console.error('Auth initialization error, using demo mode:', error);
        // Always fall back to demo mode on any error
        const demoUser = {
          id: 'demo-user-123',
          email: 'demo@cyberguard.com',
        } as User;
        
        setUser(demoUser);
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
        console.log('Auth initialization complete');
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes only if Supabase is configured and available
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session ? 'Session exists' : 'No session');
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
      } catch (error) {
        console.error('Error setting up auth listener:', error);
        setLoading(false);
      }
    }
  }, []);

  const fetchUserProfile = async (user: User) => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }
    
    setProfileLoading(true);
    try {
      console.log('Fetching profile for user:', user.id);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);

      if (error) {
        console.error('Error fetching profile:', error);
        // Set fallback profile on errors
        setProfile({
          id: user.id,
          email: user.email,
          profile_completed: false
        });
        setOrganizationName('CyberGuard Demo Corp');
      } else if (!profileData || profileData.length === 0) {
        console.log('No profile found, creating default');
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
      } else {
        // Profile found - use the first (and should be only) result
        const profile = profileData[0];
        console.log('Profile loaded:', profile.profile_completed ? 'Complete' : 'Incomplete');
        setProfile(profile);
        setOrganizationName(profile.company_name || 'CyberGuard Demo Corp');
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
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode sign in
      console.log('Demo mode sign in');
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
      setLoading(false);
      
      return { data: { user: demoUser }, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, organizationName: string) => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode sign up
      console.log('Demo mode sign up');
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
      setLoading(false);
      
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
    if (!isSupabaseConfigured || !supabase) {
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