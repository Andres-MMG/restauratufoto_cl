import React from 'react';
import { PhotoRestoration } from '../features/photo-restoration/components/PhotoRestoration';
import { useAuthStore } from '../features/authentication/hooks/useAuthStore';

/**
 * Main application page for photo restoration
 */
export function AppPage() {
  const { user, credits } = useAuthStore();
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Restaura tus fotos</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Sube tus fotos antiguas y dañadas para restaurarlas con IA.
          </p>
          <div className="bg-gray-100 px-4 py-2 rounded-md">
            <span className="font-medium">{credits}</span> créditos disponibles
          </div>
        </div>
      </div>
      
      <PhotoRestoration />
    </div>
  );
}