import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { LoginModal } from '../components/LoginModal';
import { RegisterModal } from '../components/RegisterModal';

type Plan = {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    id: 'single',
    name: 'Foto Individual',
    price: 1.9,
    credits: 1,
    features: [
      '1 foto en alta resolución',
      'Descarga inmediata',
      'Soporte por email',
    ],
  },
  {
    id: 'pack',
    name: 'Paquete de 10',
    price: 9.9,
    credits: 10,
    popular: true,
    features: [
      '10 fotos en alta resolución',
      'Descarga inmediata',
      'Soporte prioritario',
      'Solo $0.99 por foto',
    ],
  },
  {
    id: 'subscription',
    name: 'Suscripción Mensual',
    price: 19.9,
    credits: 999, // Effectively unlimited
    features: [
      'Fotos ilimitadas',
      'Máxima prioridad',
      'Soporte 24/7',
      'Actualizaciones mensuales',
    ],
  },
];

export function PricingPage() {
  const { isAuthenticated, addCredits } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const handlePlanSelect = (plan: Plan) => {
    if (!isAuthenticated) {
      setRegisterModalOpen(true);
      return;
    }
    
    // Navigate to payment page with plan details
    navigate('/payment', { state: { plan } });
  };
  
  const handleFreeTrial = () => {
    if (!isAuthenticated) {
      setRegisterModalOpen(true);
      return;
    }
    
    // Add 1 free credit and navigate to app
    addCredits(1);
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
            Elige el plan que mejor se adapte a tus necesidades. Todos los planes incluyen la misma calidad de restauración excepcional.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
            >
              {plan.popular && (
                <span className="pricing-card-badge">Más Popular</span>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold mb-1">${plan.price.toFixed(2)}</p>
              {plan.id === 'pack' && (
                <p className="text-sm text-gray-500 mb-4">Solo $0.99 por foto</p>
              )}
              {plan.id === 'subscription' && (
                <p className="text-sm text-gray-500 mb-4">Mensual, fotos ilimitadas</p>
              )}
              {plan.id === 'single' && (
                <p className="text-sm text-gray-500 mb-4">Pago único</p>
              )}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? 'primary' : 'outline'}
                onClick={() => handlePlanSelect(plan)}
              >
                {isAuthenticated ? 'Seleccionar' : 'Registrarse'}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="max-w-xl mx-auto mt-12 p-6 bg-primary-50 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">¿No estás seguro? Prueba gratis</h3>
          <p className="text-gray-600 mb-4">
            Obtén 1 crédito gratis para probar nuestro servicio sin compromiso.
          </p>
          <Button onClick={handleFreeTrial}>
            Prueba Gratuita
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12">
          <h3 className="text-xl font-semibold mb-4 text-center">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">¿Qué es un crédito?</h4>
              <p className="text-gray-600">
                Un crédito te permite restaurar una imagen. Cada imagen procesada consume un crédito.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">¿Cuánto tiempo duran mis créditos?</h4>
              <p className="text-gray-600">
                Los créditos de los paquetes individuales y de 10 no expiran. Los créditos de suscripción se renuevan mensualmente.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">¿Puedo cancelar mi suscripción?</h4>
              <p className="text-gray-600">
                Sí, puedes cancelar tu suscripción en cualquier momento desde tu cuenta. No hay períodos de permanencia.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-2">¿Qué métodos de pago aceptan?</h4>
              <p className="text-gray-600">
                Aceptamos todas las tarjetas de crédito principales, PayPal y Google Pay.
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