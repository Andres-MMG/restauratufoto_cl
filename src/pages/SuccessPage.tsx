import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/Button';
import { useAuthStore } from '@/features/authentication/stores/authStore';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!sessionId) {
      navigate('/pricing');
      return;
    }

    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, sessionId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando tu compra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-accent-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">¡Pago Completado!</h1>

          <p className="text-lg text-gray-600 mb-6">
            Tu compra ha sido procesada correctamente. Ya puedes comenzar a
            restaurar tus fotos.
          </p>

          <div className="bg-accent-50 p-4 rounded-lg mb-6">
            <p className="text-accent-800 font-medium">
              Recibirás un email de confirmación con los detalles de tu compra.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/app')}
              className="flex items-center"
            >
              Comenzar a Restaurar
              <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/pricing')}>
              Ver Planes
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t text-sm text-gray-500">
            <p>
              ¿Tienes alguna pregunta? Contáctanos en{' '}
              <a
                href="mailto:info@restauratufoto.cl"
                className="text-primary-600 hover:underline"
              >
                info@restauratufoto.cl
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
