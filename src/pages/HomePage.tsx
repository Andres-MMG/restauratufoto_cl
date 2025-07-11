import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/atoms/Button';
import { SocialAuthButtons } from '@/features/authentication/components/SocialAuthButtons';
import { ComparisonSlider } from '@/shared/components/ui/molecules/ComparisonSlider';
import { PricingCards } from '@/shared/components/ui/molecules/PricingCards';
import type { StripeProduct } from '@/stripe-config';
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
              beforeImage="/images/Foto-Pareja-Antes.png"
              afterImage="/images/Foto-Pareja-Despues.png"
              autoSlide={true}
            />
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

            <div>
              <SocialAuthButtons providers={['google', 'facebook']} />
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

          {/* Nueva fila con sliders verticales */}
          <div className="flex flex-col items-center space-y-12 md:flex-row md:justify-center md:space-x-12 md:space-y-0 mb-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-96 aspect-[3/4] flex flex-col">
              {/* Slider ocupa todo el espacio restante */}
              <div className="relative flex-grow">
                <ComparisonSlider
                  beforeImage="/images/Foto-Familia-Antes.jpg"
                  afterImage="/images/Foto-Familia-Despues.png"
                  orientation="vertical"
                  labelPosition="left"
                  dragIndicatorSide="left"
                />
              </div>
              {/* Contenedor de texto centrado */}
              <div className="p-4 text-center">
                <h3 className="font-semibold">Retrato Familiar Clásico</h3>
                <p className="text-sm text-gray-600">
                  Colores y nitidez restaurados
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-96 aspect-[3/4] flex flex-col">
              {/* Slider ocupa todo el espacio restante */}
              <div className="relative flex-grow">
                <ComparisonSlider
                  beforeImage="/images/Foto-Nina-Antes.png"
                  afterImage="/images/Foto-Nina-Despues.png"
                  orientation="vertical"
                  labelPosition="right"
                  dragIndicatorSide="right"
                />
              </div>
              {/* Contenedor de texto centrado */}
              <div className="p-4 text-center">
                <h3 className="font-semibold">Retrato Vintage</h3>
                <p className="text-sm text-gray-600">
                  Restauración fiel a su esencia original
                </p>
              </div>
            </div>
          </div>

          {/* Ahora: sólo un slider, centrado, mismo ancho que antes */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-3/5">
              <div className="relative">
                <ComparisonSlider
                  beforeImage="/images/Foto-Reunion-Antes.png"
                  afterImage="/images/Foto-Reunion-Despues.png"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Álbum de Recuerdos</h3>
                <p className="text-sm text-gray-600">
                  Texturas y tonos restaurados con precisión
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
      {/* Planes y precios integrados */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planes y Precios</h2>
            <p className="text-lg text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>
          <PricingCards
            onSelect={(_product: StripeProduct) => {
              if (!isAuthenticated) {
                navigate('/auth?mode=register');
                return;
              }
              navigate('/pricing');
            }}
            isLoading={false}
          />
        </div>
      </div>
      {/* <section className="py-16 bg-white">
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
      </section> */}

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
