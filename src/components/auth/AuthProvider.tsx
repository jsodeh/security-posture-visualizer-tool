import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import * as AuthService from '@/services/AuthService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
  profileLoading: boolean;
  organizationId: string | null;
  organizationName: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
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

  const handleUserProfile = useCallback(async (userToProcess: User) => {
    setProfileLoading(true);
    try {
      const userProfile = await AuthService.fetchUserProfile(userToProcess);
      setProfile(userProfile);
      
      if (userProfile && userProfile.organization_id) {
        setOrganizationId(userProfile.organization_id);
        setOrganizationName(userProfile.company_name || 'Organization');
      } else {
        // This case might happen for a moment during signup or if something is wrong
        setOrganizationId(null);
        setOrganizationName(null);
      }
    } catch (error) {
      console.error('Failed to handle user profile:', error);
      // Set a minimal fallback profile
      setProfile({ id: userToProcess.id, email: userToProcess.email, profile_completed: false });
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set up the authentication listener.
    const unsubscribe = AuthService.setupAuthListener(async (session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await handleUserProfile(currentUser);
      } else {
        setProfile(null);
        setOrganizationId(null);
        setOrganizationName(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [handleUserProfile]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await handleUserProfile(user);
    }
  }, [user, handleUserProfile]);

  const value = {
    user,
    session,
    loading,
    profile,
    profileLoading,
    organizationId,
    organizationName,
    signIn: AuthService.signIn,
    signUp: AuthService.signUp,
    signOut: AuthService.signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
