// ProfileEditor.tsx
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { Input } from '../../../shared/components/ui/atoms/Input';
import { AlertCircle, User, Upload } from 'lucide-react';

type ProfileEditorProps = {
  onSave?: () => void;
  className?: string;
};

/**
 * Component for editing user profile information
 */
export function ProfileEditor({ onSave, className = '' }: ProfileEditorProps) {
  const { profile, isLoading, error, updateProfile, uploadAvatar } = useProfile();
  
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    bio: profile?.bio || ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setFormError('El archivo debe ser una imagen (JPG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormError('El archivo debe ser menor a 2MB');
      return;
    }
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setFormError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    
    try {
      // Upload avatar if changed
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }
      
      // Update profile data
      await updateProfile({
        full_name: formData.fullName,
        bio: formData.bio
      });
      
      // Call onSave callback if provided
      if (onSave) onSave();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading && !profile) {
    return <div className="text-center py-4">Cargando perfil...</div>;
  }
  
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Mi Perfil</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-4 flex items-center">
          <AlertCircle className="mr-2" size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>
            <label 
              htmlFor="avatar-upload" 
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-700 transition-colors"
            >
              <Upload size={14} className="text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
          <span className="text-sm text-gray-500">
            Haz clic para cambiar tu foto
          </span>
        </div>
        
        {/* Form fields */}
        <Input
          label="Nombre completo"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Tu nombre completo"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Biografía
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Cuéntanos sobre ti"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={4}
          />
        </div>
        
        {formError && (
          <div className="text-red-600 text-sm">
            {formError}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            isLoading={isSaving}
          >
            Guardar Perfil
          </Button>
        </div>
      </form>
    </div>
  );
}
