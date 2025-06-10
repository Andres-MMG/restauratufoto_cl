// ProfileDisplay.tsx
import React from 'react';
import { useProfile } from '../hooks/useProfile';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { User, Edit2 } from 'lucide-react';

type ProfileDisplayProps = {
  userId?: string;
  onEdit?: () => void;
  hideEditButton?: boolean;
  className?: string;
};

/**
 * Component for displaying user profile information
 */
export function ProfileDisplay({ 
  userId, 
  onEdit, 
  hideEditButton = false,
  className = '' 
}: ProfileDisplayProps) {
  const { profile, isLoading, error } = useProfile();
  
  if (isLoading) {
    return <div className="text-center py-4">Cargando perfil...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Error al cargar el perfil: {error}
      </div>
    );
  }
  
  if (!profile) {
    return <div className="text-center py-4">Perfil no encontrado</div>;
  }
  
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-start">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mr-4">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name || 'Avatar'} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={24} className="text-gray-400" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {profile.full_name || 'Usuario'}
            </h2>
            
            {!hideEditButton && onEdit && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onEdit}
              >
                <Edit2 size={16} className="mr-1" />
                Editar
              </Button>
            )}
          </div>
          
          {profile.bio && (
            <p className="text-gray-600 mt-2">
              {profile.bio}
            </p>
          )}
          
          <div className="mt-3 text-sm text-gray-500">
            Miembro desde {new Date(profile.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
