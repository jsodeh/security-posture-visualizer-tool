-- Add the organization_id column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN organization_id UUID;

-- Add a foreign key constraint to link profiles to organizations
ALTER TABLE public.profiles
ADD CONSTRAINT fk_organization
FOREIGN KEY (organization_id)
REFERENCES public.organizations(id)
ON DELETE SET NULL; -- Or ON DELETE CASCADE if a profile should be deleted with the org

-- Enable Row-Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Create a policy that allows users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);
