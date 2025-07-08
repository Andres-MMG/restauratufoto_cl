// useProfile.ts
import { useState, useEffect } from 'react';
import { useAuthStore } from './useAuthStore';
import { profileService } from '../services/profileService';

type Profile = {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileState = {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Custom hook for handling user profile operations
 */
export function useProfile() {
  const { user } = useAuthStore();
  const [state, setState] = useState<ProfileState>({
    profile: null,
    isLoading: false,
    error: null,
  });

  // Get profile data when user changes
  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setState({ profile: null, isLoading: false, error: null });
    }
  }, [user?.id]);

  const loadProfile = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await profileService.getCurrentProfile();

      if (result.success) {
        setState({
          profile: result.data,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          profile: null,
          isLoading: false,
          error: result.error || 'Failed to load profile',
        });
      }
    } catch (error) {
      setState({
        profile: null,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to load profile',
      });
    }
  };

  const updateProfile = async (data: { full_name?: string; bio?: string }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await profileService.updateProfile(data);
      await loadProfile(); // Reload the profile data
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to update profile',
      }));
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const url = await profileService.uploadAvatar(file);
      await loadProfile(); // Reload the profile data
      return url;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to upload avatar',
      }));
      return null;
    }
  };

  return {
    ...state,
    loadProfile,
    updateProfile,
    uploadAvatar,
  };
}
