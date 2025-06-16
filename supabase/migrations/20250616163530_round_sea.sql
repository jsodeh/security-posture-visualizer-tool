/*
  # Create Profiles Table for User Account Management

  1. New Tables
    - `profiles` - User profile information
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `first_name` (text)
      - `last_name` (text)
      - `company_name` (text)
      - `company_domain` (text)
      - `industry` (text)
      - `company_size` (text)
      - `job_title` (text)
      - `phone` (text)
      - `country` (text)
      - `profile_completed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on profiles table
    - Add policies for users to manage their own profiles
    - Create trigger for automatic profile creation on signup

  3. Functions
    - Auto-create profile on user signup
    - Update profile completion status
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  company_domain TEXT,
  industry TEXT,
  company_size TEXT,
  job_title TEXT,
  phone TEXT,
  country TEXT,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update profile completion status
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all required fields are filled
  NEW.profile_completed := (
    NEW.first_name IS NOT NULL AND NEW.first_name != '' AND
    NEW.last_name IS NOT NULL AND NEW.last_name != '' AND
    NEW.company_name IS NOT NULL AND NEW.company_name != '' AND
    NEW.industry IS NOT NULL AND NEW.industry != '' AND
    NEW.company_size IS NOT NULL AND NEW.company_size != ''
  );
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update completion status
DROP TRIGGER IF EXISTS on_profile_update ON public.profiles;
CREATE TRIGGER on_profile_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_completion();