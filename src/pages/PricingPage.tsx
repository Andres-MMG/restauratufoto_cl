import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/Button';
import { useAuthStore } from '@/features/authentication/stores/authStore';
import { LoginModal } from '@/features/authentication/components/LoginModal';
import { RegisterModal } from '@/features/authentication/components/RegisterModal';
import { stripeProducts, type StripeProduct } from '../stripe-config';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function PricingPage() {
  const { isAuthenticated } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlanSelect = async (product: StripeProduct) => {
    if (!isAuthenticated) {
      setRegisterModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            price_id: product.priceId,
            mode: product.mode,
            success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${window.location.origin}/pricing`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión de pago');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreeTrial = () => {
    if (!isAuthenticated) {
      setRegisterModalOpen(true);
      return;
    }

    navigate('/app');
  };

  const setRegisterModalOpen = (isOpen: boolean) => {
    setIsRegisterModalOpen(isOpen);
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Planes y Precios</h1>
          <p className="text-lg text-gray-600">
            Elige el plan que mejor se adapte a tus necesidades. Todos los
            planes incluyen la misma calidad de restauración excepcional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stripeProducts.map(product => (
            <div
              key={product.id}
              className={`pricing-card ${product.popular ? 'pricing-card-popular' : ''}`}
            >
              {product.popular && (
                <span className="pricing-card-badge">Más Popular</span>
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-4xl font-bold mb-1">
                ${product.price.toFixed(2)}
              </p>
              {product.mode === 'subscription' && (
                <p className="text-sm text-gray-500 mb-4">Mensual</p>
              )}
              {product.mode === 'payment' && (
                <p className="text-sm text-gray-500 mb-4">Pago único</p>
              )}
              <ul className="space-y-3 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      size={18}
                      className="text-accent-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={product.popular ? 'primary' : 'outline'}
                onClick={() => handlePlanSelect(product)}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isAuthenticated ? 'Seleccionar' : 'Registrarse'}
              </Button>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto mt-12 p-6 bg-primary-50 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">
            ¿No estás seguro? Prueba gratis
          </h3>
          <p className="text-gray-600 mb-4">
            Prueba nuestro servicio sin compromiso.
          </p>
          <Button onClick={handleFreeTrial}>Prueba Gratuita</Button>
        </div>

        <div className="max-w-3xl mx-auto mt-12">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Preguntas Frecuentes
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">¿Qué es un crédito?</h4>
              <p className="text-gray-600">
                Un crédito te permite restaurar una imagen. Cada imagen
                procesada consume un crédito.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">
                ¿Cuánto tiempo duran mis créditos?
              </h4>
              <p className="text-gray-600">
                Los créditos de los paquetes no expiran. Los créditos de
                suscripción se renuevan mensualmente.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">
                ¿Puedo cancelar mi suscripción?
              </h4>
              <p className="text-gray-600">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu
                cuenta. No hay períodos de permanencia.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">
                ¿Qué métodos de pago aceptan?
              </h4>
              <p className="text-gray-600">
                Aceptamos todas las tarjetas de crédito principales.
              </p>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
}
