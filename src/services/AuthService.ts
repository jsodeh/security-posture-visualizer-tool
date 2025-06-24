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

export const signUp = async (email: string, password: string, organizationName: string) => {
  // This function now handles both authentication and database records.
  // It should be called from a server-side context or a trusted client flow.

  // 1. Create the user in Supabase Auth
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

  const user = authData.user;

  // 2. Create a new organization for the user
  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: organizationName,
      // You can add more details here if needed
      domain: email.split('@')[1] || '',
      industry: 'Not Specified',
      size: 'Not Specified',
    })
    .select()
    .single();

  if (orgError) {
    console.error('Error creating organization:', orgError);
    // Potentially clean up the created user if org creation fails
    // await supabase.auth.admin.deleteUser(user.id); // Requires admin privileges
    throw new Error('Could not create an organization for the new user.');
  }

  // 3. Create the user's profile and link it to the organization
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id, // Link to the auth.users table
      email: user.email,
      organization_id: orgData.id, // Link to the new organization
      company_name: orgData.name,
      profile_completed: false, // User will complete this after signup
    });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    // Potentially clean up the user and organization
    throw new Error('Could not create a profile for the new user.');
  }

  // Return the session and user data
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