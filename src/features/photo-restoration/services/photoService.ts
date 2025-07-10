import { supabase } from '../../../lib/supabase';

/**
 * Service for handling photo operations in Supabase storage
 */
export const photoService = {
  /**
   * Upload a photo to Supabase storage
   */
  async uploadPhoto(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('photos')
      .upload(fileName, file);

    if (error) {
      throw new Error('Error al subir la foto');
    }

    const { data } = supabase.storage.from('photos').getPublicUrl(fileName);

    return data.publicUrl;
  },

  /**
   * Get all photos for a user
   */
  async getUserPhotos(userId: string) {
    const { data, error } = await supabase.storage.from('photos').list(userId);

    if (error) {
      throw new Error('Error al obtener las fotos');
    }

    return data;
  },

  /**
   * Delete a photo from storage
   */
  async deletePhoto(path: string) {
    const { error } = await supabase.storage.from('photos').remove([path]);

    if (error) {
      throw new Error('Error al eliminar la foto');
    }
  },
};
