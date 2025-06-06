import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/authentication/hooks/useAuthStore';
import { PricingPlans } from '../features/payment/components/PricingPlans';
import { LoginModal } from '../features/authentication/components/LoginModal';
import { RegisterModal } from '../features/authentication/components/RegisterModal';
import { FreeTrial } from '../features/payment/components/FreeTrial';
import { FAQ, FaqItem } from '../shared/components/ui/molecules/FAQ';

export type Plan = {
  id: string;
  name: string;
  price: number;
  credits: number;
  popular?: boolean;
  features: string[];
};

export const availablePlans: Plan[] = [
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
    id: 'pack10',
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

/**
 * Pricing page component that displays available plans and FAQs
 */
export function PricingPage() {
  const { isAuthenticated, addCredits } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
    // FAQ items
  const faqItems: FaqItem[] = [
    {
      question: '¿Qué es un crédito?',
      answer: 'Un crédito te permite restaurar una imagen. Cada imagen procesada consume un crédito.'
    },
    {
      question: '¿Cuánto tiempo duran mis créditos?',
      answer: 'Los créditos de los paquetes individuales y de 10 no expiran. Los créditos de suscripción se renuevan mensualmente.'
    },
    {
      question: '¿Puedo cancelar mi suscripción?',
      answer: 'Sí, puedes cancelar tu suscripción en cualquier momento desde tu cuenta. No hay períodos de permanencia.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos todas las tarjetas de crédito principales, PayPal y Google Pay.'
    }
  ];
  
  const handlePlanSelect = (planId: string) => {
    if (!isAuthenticated) {
      setIsRegisterModalOpen(true);
      return;
    }
    
    // Find selected plan
    const selectedPlan = availablePlans.find(plan => plan.id === planId);
    
    if (selectedPlan) {
      // Navigate to payment page with plan details
      navigate('/payment', { state: { plan: selectedPlan } });
    }
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
        
        {/* Use our modular PricingPlans component */}
        <PricingPlans onPlanSelect={handlePlanSelect} />
          {/* Free trial section */}
        <FreeTrial className="max-w-xl mx-auto mt-12" />
        
        {/* FAQ Section */}
        <div className="mt-12">
          <FAQ items={faqItems} />
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