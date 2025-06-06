// filepath: d:\Myl\restauratufoto_cl\src\pages\HomePage.tsx
import { useNavigate } from 'react-router-dom';
import { ComparisonSlider } from '../shared/components/ui/molecules/ComparisonSlider';
import { TrialUpload } from '../features/photo-restoration/components/TrialUpload';
import { RegisterForm } from '../features/authentication/components/RegisterForm';
import { HowItWorks } from '../features/photo-restoration/components/HowItWorks';
import { ExamplesGallery } from '../features/photo-restoration/components/ExamplesGallery';
import { BenefitsList } from '../shared/components/ui/organisms/BenefitsList';
import { Testimonials } from '../shared/components/ui/organisms/Testimonials';
import { PricingPlans } from '../features/payment/components/PricingPlans';
import { CallToAction } from '../shared/components/ui/molecules/CallToAction';

/**
 * HomePage component that serves as the landing page of the application
 * Organized into sections using modular components
 */
export function HomePage() {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/app');
  };
  
  const handleSelectPlan = (planId: string) => {
    navigate(`/payment?plan=${planId}`);
  };
  
  return (
    <div className="min-h-screen bg-primary-600">
      {/* Hero Section */}
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Restaura Tus Recuerdos
            </h1>
            <p className="text-gray-600">
              Devuelve la vida a tus fotos antiguas con IA.
            </p>
          </div>
          
          <div className="mb-8 rounded-lg overflow-hidden">
            <ComparisonSlider 
              beforeImage="https://images.pexels.com/photos/5967029/pexels-photo-5967029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              afterImage="https://images.pexels.com/photos/2781760/pexels-photo-2781760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              autoSlide={true}
            />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              ¿Quieres probar? Sube tu primera foto GRATIS:
            </p>
            <TrialUpload />
          </div>
          
          <RegisterForm />
        </div>
      </div>

      {/* How it Works Section */}
      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo Funciona</h2>
          <HowItWorks />
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Ejemplos Impresionantes</h2>
          <ExamplesGallery />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por Qué Elegirnos?</h2>
          <BenefitsList />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>
          <Testimonials />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Planes Simples y Transparentes</h2>
          <PricingPlans compact onPlanSelect={handleSelectPlan} />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container">
          <CallToAction
            title="¿Listo para restaurar tus recuerdos?"
            subtitle="Únete a miles de personas que ya han recuperado sus fotos más valiosas"
            buttonText="Comenzar Ahora"
            buttonProps={{
              size: "lg",
              className: "bg-white text-primary-900 hover:bg-gray-100"
            }}
            onButtonClick={handleGetStarted}
          />
        </div>
      </section>
    </div>
  );
}