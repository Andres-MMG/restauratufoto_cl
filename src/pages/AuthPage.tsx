import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../features/authentication/components/AuthForm';
import { useAuthStore } from '../features/authentication/hooks/useAuthStore';

export function AuthPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirigir al usuario si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Restaura Tu Foto
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          Inicia sesión o crea una cuenta para comenzar a restaurar tus fotos
        </p>
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
