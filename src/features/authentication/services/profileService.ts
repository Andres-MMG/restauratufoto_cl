// profileService.ts
import { supabase } from '../../../lib/supabase';

/**
 * Service for handling user profile operations
 */
export const profileService = {
  /**
   * Get the current user's profile
   */
  async getCurrentProfile() {
    const { data, error } = await supabase.rpc('get_profile');

    if (error) throw error;

    return data;
  },

  /**
   * Get a specific user's profile by ID
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase.rpc('get_profile', {
      profile_id: userId,
    });

    if (error) throw error;

    return data;
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(profile: { full_name?: string; bio?: string }) {
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;

    return true;
  },

  /**
   * Upload a new avatar image
   */
  async uploadAvatar(file: File) {
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get the public URL
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase.rpc('update_user_avatar', {
      avatar_url: data.publicUrl,
    });

    if (updateError) throw updateError;

    return data.publicUrl;
  },
};
