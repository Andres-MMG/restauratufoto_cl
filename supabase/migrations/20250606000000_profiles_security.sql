-- Migration for securing profiles table and avatars bucket
/*
  # Profile & Avatars Security Setup

  1. Security for Profiles Table
     - Enable RLS on profiles table
     - Create policy to allow users to read/write only their own profile
     - Create policy for anonymous users to read profiles (useful for public pages)

  2. Security for Avatars Bucket
     - Set security policy for avatars bucket
     - Allow authenticated users to upload their own avatars
     - Allow public access for reading avatars
*/

-- Enable Row Level Security on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own profiles
CREATE POLICY "Users can manage their own profiles"
  ON profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for anyone to read profiles (optional - useful for public profiles)
CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  USING (true);

-- Add trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket security - to be run via SQL Editor
/*
-- Enable Storage bucket policies (must be run via SQL Editor)
-- Create policy for avatars bucket upload
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Allow users to upload their own avatar
CREATE POLICY "Users can upload avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public access to avatars for viewing
CREATE POLICY "Public read access for avatars"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');
*/

-- Helper function to update avatar
CREATE OR REPLACE FUNCTION update_user_avatar(avatar_url text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET avatar_url = avatar_url
  WHERE user_id = auth.uid();
  
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Helper function to get profile
CREATE OR REPLACE FUNCTION get_profile(profile_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_id uuid;
  profile_data json;
BEGIN
  -- If no profile_id is provided, use the current user's ID
  IF profile_id IS NULL THEN
    target_id := auth.uid();
  ELSE
    target_id := profile_id;
  END IF;
  
  -- Check if the user exists
  IF target_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get profile data
  SELECT json_build_object(
    'user_id', p.user_id,
    'full_name', p.full_name,
    'avatar_url', p.avatar_url,
    'bio', p.bio,
    'created_at', p.created_at,
    'updated_at', p.updated_at
  )
  INTO profile_data
  FROM public.profiles p 
  WHERE p.user_id = target_id;
  
  IF profile_data IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Profile not found');
  END IF;
  
  RETURN json_build_object('success', true, 'data', profile_data);
END;
$$;
