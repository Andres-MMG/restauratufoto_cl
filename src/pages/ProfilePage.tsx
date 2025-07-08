// ProfilePage.tsx
import { useState } from 'react';
import { ProfileDisplay } from '../features/authentication/components/ProfileDisplay';
import { ProfileEditor } from '../features/authentication/components/ProfileEditor';
import { useAuthStore } from '../features/authentication/hooks/useAuthStore';

/**
 * User profile page component
 */
export function ProfilePage() {
  const { isAuthenticated } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="mb-6">Debes iniciar sesión para ver este contenido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>

      <div className="max-w-2xl">
        {isEditing ? (
          <ProfileEditor onSave={() => setIsEditing(false)} />
        ) : (
          <ProfileDisplay onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
}
