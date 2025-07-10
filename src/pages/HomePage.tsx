import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/atoms/Button';
import { ComparisonSlider } from '@/shared/components/ui/molecules/ComparisonSlider';
import { TrialUpload } from '@/features/photo-restoration/components/TrialUpload';
import { useAuthStore } from '@/features/authentication/stores/authStore';

export function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-primary-600">
      {/* Hero Section */}
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Restaura Tus Recuerdos</h1>
            <p className="text-gray-600">
              Devuelve la vida a tus fotos antiguas con IA.
            </p>
          </div>

          <div className="mb-8 rounded-lg overflow-hidden">
            <ComparisonSlider
              beforeImage="https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&sat=-100&con=-60&bri=-35"
              afterImage="https://images.pexels.com/photos/374016/pexels-photo-374016.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
              autoSlide={true}
            />
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              ¿Quieres probar? Sube tu primera foto GRATIS:
            </p>
            <TrialUpload />
          </div>

          <div className="mt-8 space-y-6">
            <Button
              onClick={() => navigate('/auth?mode=register')}
              className="w-full py-3 text-lg font-medium"
            >
              Comenzar ahora
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                Restaura tus fotos antiguas con solo unos clics
              </p>
            </div>

            <div className="relative text-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500">
                O continúa con
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button type="button" variant="outline" className="w-full">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#1877F2"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#181717"
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  />
                </svg>
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="text-primary-600 hover:underline font-medium"
                onClick={() => navigate('/auth?mode=login')}
              >
                Inicia Sesión
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Cómo Funciona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sube tu Foto</h3>
              <p className="text-gray-600">
                Selecciona la foto que deseas restaurar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">IA en Acción</h3>
              <p className="text-gray-600">
                Nuestra IA restaura tu foto automáticamente
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Descarga</h3>
              <p className="text-gray-600">
                Obtén tu foto restaurada en alta calidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ejemplos Impresionantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <ComparisonSlider
                  beforeImage="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&sat=-100&con=-50&bri=-30"
                  afterImage="https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Retrato Familiar Clásico</h3>
                <p className="text-sm text-gray-600">
                  Colores y nitidez restaurados
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <ComparisonSlider
                  beforeImage="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&sat=-90&con=-40&bri=-25"
                  afterImage="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800&h=600"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Fotografía Vintage</h3>
                <p className="text-sm text-gray-600">
                  Restaurada a su gloria original
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por Qué Elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Superior</h3>
              <p className="text-gray-600">
                Resultados profesionales garantizados
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Súper Rápido</h3>
              <p className="text-gray-600">
                Resultados en segundos, no en días
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-gray-600">Tus fotos están protegidas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-warning-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">
                "Increíble servicio. Restauré fotos de mis abuelos que creía
                perdidas."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">María García</p>
                  <p className="text-sm text-gray-500">Cliente Verificada</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-warning-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">
                "La calidad es impresionante. Mis fotos familiares lucen como
                nuevas."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Carlos Ruiz</p>
                  <p className="text-sm text-gray-500">Cliente Verificado</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-warning-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">
                "Rápido, fácil y los resultados son espectaculares. ¡Muy
                recomendado!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Ana Martínez</p>
                  <p className="text-sm text-gray-500">Cliente Verificada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            Planes Simples y Transparentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary-500 transition-all">
              <h3 className="text-xl font-semibold mb-2">Foto Individual</h3>
              <p className="text-4xl font-bold mb-4">$1.90</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>1 foto en alta
                  calidad
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Descarga inmediata
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/pricing')}
              >
                Elegir Plan
              </Button>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-primary-500 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Más Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Paquete de 10</h3>
              <p className="text-4xl font-bold mb-4">$9.90</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  10 fotos en alta calidad
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Solo $0.99 por foto
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Soporte prioritario
                </li>
              </ul>
              <Button className="w-full" onClick={() => navigate('/pricing')}>
                Elegir Plan
              </Button>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary-500 transition-all">
              <h3 className="text-xl font-semibold mb-2">Suscripción</h3>
              <p className="text-4xl font-bold mb-4">$19.90</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Fotos ilimitadas
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Máxima prioridad
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Soporte 24/7
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/pricing')}
              >
                Elegir Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para restaurar tus recuerdos?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de personas que ya han recuperado sus fotos más
            valiosas
          </p>
          <Button
            size="lg"
            className="bg-white text-primary-900 hover:bg-gray-100"
            onClick={() => navigate('/auth?mode=register')}
          >
            Comenzar Ahora
          </Button>
        </div>
      </section>
    </div>
  );
}
