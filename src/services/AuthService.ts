import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// --- User Profile ---

export const fetchUserProfile = async (user: User) => {
  try {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*, organization_id') // Ensure we select the organization_id
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn('Could not fetch user profile, it may not exist yet:', error.message);
      return {
          id: user.id,
          email: user.email,
          profile_completed: false,
          organization_id: null,
      };
    }
    
    return profileData;

  } catch (error) {
    console.error('An unexpected error occurred during fetchUserProfile:', error);
    throw error; // Rethrow to be handled by the caller
  }
};

// --- Authentication ---

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Auth signup error:', authError);
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('User not created after signup.');
  }

  // Do NOT create organization or profile here
  return { data: authData, error: null };
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const setupAuthListener = (
  callback: (session: Session | null) => void
) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session);
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}; 