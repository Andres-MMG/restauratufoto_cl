// 🎬 HomePage with GTA VI Cinematic Effects
import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComparisonSlider } from '../shared/components/ui/molecules/ComparisonSlider';
import { HowItWorks } from '../features/photo-restoration/components/HowItWorks';
import { ExamplesGallery } from '../features/photo-restoration/components/ExamplesGallery';
import { BenefitsList } from '../shared/components/ui/organisms/BenefitsList';
import { Testimonials } from '../shared/components/ui/organisms/Testimonials';
import { PricingPlans } from '../features/payment/components/PricingPlans';
import { CallToAction } from '../shared/components/ui/molecules/CallToAction';
import { gsap } from '../lib/gsap';

/**
 * HomePage component with GTA VI cinematic effects
 * Features hero section with "camera pull back" effect and fade animations
 */
export function HomePage() {
  const navigate = useNavigate();

  // 🎬 Referencias para animaciones GTA VI
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    navigate('/app');
  };

  const handleSelectPlan = (planId: string) => {
    navigate(`/payment?plan=${planId}`);
  };

  // 🎬 ANIMACIONES GTA VI - Efecto Hero Cinematográfico
  useLayoutEffect(() => {
    const heroSection = heroRef.current;
    const heroContent = heroContentRef.current;
    const sliderContainer = sliderContainerRef.current;

    if (!heroSection || !heroContent || !sliderContainer) return;

    // 🎥 ANIMACIÓN PRINCIPAL DE HERO (Efecto "alejar cámara")
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom center',
        scrub: 1,
        pin: true,
        onUpdate: self => {
          const progress = self.progress;

          // Efecto de "alejar la cámara" en el slider
          gsap.set(sliderContainer, {
            scale: 1.25 - progress * 0.25, // De 1.25 a 1.0
            transformOrigin: 'center center',
          });

          // Desvanecimiento gradual del contenido de texto
          gsap.set(heroContent, {
            opacity: 1 - progress * 1.2,
            y: progress * -50,
          });

          // Efecto de zoom out en todo el hero
          gsap.set(heroSection, {
            scale: 1 + progress * 0.1,
            filter: `blur(${progress * 2}px)`,
          });
        },
      },
    });

    return () => {
      heroTimeline.kill();
    };
  }, []);

  return (
    <div className="relative">
      {/* 🎯 HERO SECTION - Con efectos GTA VI */}
      <div
        ref={heroRef}
        className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden"
      >
        <div className="container max-w-md mx-auto px-4 py-8 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            {/* Contenido que se desvanece */}
            <div ref={heroContentRef} className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Restaura Tus Recuerdos
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Devuelve la vida a tus fotos antiguas con IA de última
                generación.
              </p>
              <button
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Sube una foto para probar
              </button>
            </div>

            {/* ComparisonSlider con efecto de escala */}
            <div
              ref={sliderContainerRef}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <ComparisonSlider
                beforeImage="https://images.pexels.com/photos/5967029/pexels-photo-5967029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                afterImage="https://images.pexels.com/photos/2781760/pexels-photo-2781760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                autoSlide={true}
              />
            </div>
          </div>
        </div>

        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-500/20 rounded-full blur-2xl" />
      </div>

      {/* 🎭 SECCIÓN DE EJEMPLOS - Con efecto de máscara */}
      <div ref={examplesRef} className="relative">
        <ExamplesGallery />
      </div>

      {/* Resto del contenido */}
      <div className="bg-white">
        <HowItWorks />
        <BenefitsList />
        <Testimonials />
        <PricingPlans onSelectPlan={handleSelectPlan} />
        <CallToAction onGetStarted={handleGetStarted} />
      </div>
    </div>
  );
}
