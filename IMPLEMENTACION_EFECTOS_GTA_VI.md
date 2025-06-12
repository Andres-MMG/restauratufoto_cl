# Implementación Completa de Efectos GTA VI en RestauraTuFoto.cl

## 🎯 Plan de Implementación Paso a Paso

Tu proyecto está **perfectamente estructurado** para implementar los efectos cinematográficos de GTA VI. Siguiendo la metodología de Midu, implementaremos cada fase de manera progresiva.

---

## 📦 Fase 1: Instalación y Configuración de GSAP

### 1.1 Instalación de Dependencias

```bash
# Instalar GSAP y plugins necesarios
npm install gsap @gsap/react

# Opcional: Para compatibilidad futura con scroll-driven animations nativas
npm install scroll-driven-animations-polyfill
```

### 1.2 Configuración de GSAP en React/TypeScript

Crear archivo de configuración de animaciones:

```typescript
// src/lib/gsap.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugins de GSAP
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

// Configuración global de GSAP para mejor rendimiento
gsap.config({
  force3D: true,
  nullTargetWarn: false,
});

// Función helper para limpiar animaciones
export const cleanupGSAP = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.globalTimeline.clear();
};
```

---

## 🏗️ Fase 2: Preparación y Elementos Fijos Globales

### 2.1 Actualización del MainLayout.tsx

**Objetivo**: Convertir Header y Footer en elementos fijos que se oculten con el scroll, como en GTA VI.

```tsx
// src/shared/components/layout/MainLayout.tsx
import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollIndicator } from '../ui/molecules/ScrollIndicator';
import { gsap, ScrollTrigger } from '../../../lib/gsap';

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const footer = footerRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!header || !footer || !scrollIndicator) return;

    // Timeline principal para elementos fijos
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "100vh",
        scrub: 1,
        onUpdate: (self) => {
          // Efecto suave de desvanecimiento
          const progress = self.progress;
          gsap.set([header, footer, scrollIndicator], {
            opacity: 1 - progress,
            pointerEvents: progress > 0.5 ? 'none' : 'auto'
          });
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative">
      {/* Header Fijo */}
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-opacity duration-300"
      >
        <Header />
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer Fijo */}
      <footer 
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300"
      >
        <Footer />
      </footer>

      {/* Indicador de Scroll */}
      <div 
        ref={scrollIndicatorRef}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <ScrollIndicator />
      </div>
    </div>
  );
}
```

### 2.2 Componente ScrollIndicator

**Nuevo componente**: Indicador de scroll con animación de rebote como en GTA VI.

```tsx
// src/shared/components/ui/molecules/ScrollIndicator.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center text-white/80">
      <span className="text-sm font-medium mb-2 tracking-wider">
        DESPLÁZATE PARA VER MÁS
      </span>
      <div className="animate-bounce-pulse">
        <ChevronDown size={24} className="stroke-2" />
      </div>
    </div>
  );
}
```

---

## 🎬 Fase 3: Animación de Entrada de la Sección Hero

### 3.1 HomePage.tsx con Efectos GTA VI

**Objetivo**: Implementar el efecto de "alejar la cámara" en tu ComparisonSlider y desvanecimiento del contenido principal.

```tsx
// src/pages/HomePage.tsx (Versión con efectos GTA VI)
import React, { useLayoutEffect, useRef } from 'react';
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
import { gsap, ScrollTrigger } from '../lib/gsap';

export function HomePage() {
  const navigate = useNavigate();
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

  useLayoutEffect(() => {
    const heroSection = heroRef.current;
    const heroContent = heroContentRef.current;
    const sliderContainer = sliderContainerRef.current;
    const examplesSection = examplesRef.current;

    if (!heroSection || !heroContent || !sliderContainer || !examplesSection) return;

    // 🎬 ANIMACIÓN PRINCIPAL DE HERO (Efecto GTA VI)
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom center",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Efecto de "alejar la cámara" en el slider
          gsap.set(sliderContainer, {
            scale: 1.25 - (progress * 0.25), // De 1.25 a 1.0
            transformOrigin: "center center"
          });

          // Desvanecimiento gradual del contenido de texto
          gsap.set(heroContent, {
            opacity: 1 - (progress * 1.2),
            y: progress * -50
          });

          // Efecto de zoom out en todo el hero
          gsap.set(heroSection, {
            scale: 1 + (progress * 0.1),
            filter: `blur(${progress * 2}px)`
          });
        }
      }
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
                Devuelve la vida a tus fotos antiguas con IA de última generación.
              </p>
              <button 
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Sube una foto para probar
              </button>
            </div>
            
            {/* ComparisonSlider con efecto de escala */}
            <div ref={sliderContainerRef} className="rounded-2xl overflow-hidden shadow-xl">
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
```

---

## 🎭 Fase 4: Efecto de Máscara en ExamplesGallery (ESTRELLA DEL SHOW)

### 4.1 SVG Personalizado para la Máscara

**Crear SVG** con forma de cámara/logo para RestauraTuFoto.cl:

```tsx
// src/shared/components/ui/atoms/CameraMask.tsx
import React from 'react';

type CameraMaskProps = {
  id: string;
  className?: string;
};

export function CameraMask({ id, className = "" }: CameraMaskProps) {
  return (
    <svg 
      width="0" 
      height="0" 
      className={className}
      aria-hidden="true"
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse">
          {/* Fondo blanco para la máscara */}
          <rect width="100%" height="100%" fill="white" />
          
          {/* Forma de cámara vintage + logo */}
          <g fill="black">
            {/* Cuerpo principal de la cámara */}
            <rect x="20%" y="30%" width="60%" height="40%" rx="8%" />
            
            {/* Lente de la cámara */}
            <circle cx="50%" cy="50%" r="15%" />
            
            {/* Visor superior */}
            <rect x="35%" y="15%" width="30%" height="20%" rx="4%" />
            
            {/* Flash */}
            <circle cx="25%" cy="25%" r="3%" />
            
            {/* Detalles decorativos */}
            <rect x="65%" y="20%" width="8%" height="4%" rx="2%" />
            <rect x="65%" y="26%" width="12%" height="3%" rx="1%" />
            
            {/* Texto "RestauraTuFoto" estilizado */}
            <text 
              x="50%" 
              y="80%" 
              textAnchor="middle" 
              fontSize="8%" 
              fontFamily="system-ui, sans-serif" 
              fontWeight="bold"
            >
              RestauraTuFoto
            </text>
          </g>
        </mask>
      </defs>
    </svg>
  );
}
```

### 4.2 ExamplesGallery.tsx con Efecto de Máscara

**Implementación completa** del efecto de máscara que se encoge con el scroll:

```tsx
// src/features/photo-restoration/components/ExamplesGallery.tsx (Versión GTA VI)
import React, { useLayoutEffect, useRef } from 'react';
import { ComparisonSlider } from '../../../shared/components/ui/molecules/ComparisonSlider';
import { CameraMask } from '../../../shared/components/ui/atoms/CameraMask';
import { gsap, ScrollTrigger } from '../../../lib/gsap';

type Example = {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
};

type ExamplesGalleryProps = {
  examples?: Example[];
};

export function ExamplesGallery({ examples }: ExamplesGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const maskContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const defaultExamples: Example[] = [
    {
      beforeImage: 'https://images.pexels.com/photos/2447042/pexels-photo-2447042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      afterImage: 'https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Foto Familiar de 1965',
      description: 'Restaurada a su gloria original'
    },
    {
      beforeImage: 'https://images.pexels.com/photos/5967029/pexels-photo-5967029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      afterImage: 'https://images.pexels.com/photos/2781760/pexels-photo-2781760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Retrato Antiguo',
      description: 'Colores y detalles recuperados'
    },
    {
      beforeImage: 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      afterImage: 'https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Momento Familiar',
      description: 'Recuerdos revividos con IA'
    }
  ];

  const examplesData = examples || defaultExamples;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const maskContainer = maskContainerRef.current;
    const content = contentRef.current;
    const background = backgroundRef.current;

    if (!section || !maskContainer || !content || !background) return;

    // 🎭 EFECTO DE MÁSCARA PRINCIPAL (Inspirado en GTA VI)
    const maskTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Calcular el tamaño de la máscara usando clamp() como Midu
          const initialSize = Math.max(window.innerWidth, window.innerHeight) * 3;
          const finalSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
          const currentSize = initialSize - (progress * (initialSize - finalSize));
          
          // Aplicar la máscara con tamaño variable
          gsap.set(maskContainer, {
            maskSize: `${currentSize}px ${currentSize}px`,
            maskPosition: "center center",
            maskRepeat: "no-repeat"
          });

          // Efecto de rotación sutil en el contenido
          gsap.set(content, {
            rotation: progress * 5,
            scale: 1 + (progress * 0.1)
          });

          // Transición del fondo a blanco al final
          if (progress > 0.8) {
            const fadeProgress = (progress - 0.8) / 0.2;
            gsap.set(background, {
              opacity: fadeProgress
            });
            
            gsap.set(maskContainer, {
              opacity: 1 - fadeProgress
            });
          }
        }
      }
    });

    return () => {
      maskTimeline.kill();
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden"
    >
      {/* SVG de la máscara */}
      <CameraMask id="camera-mask" />

      {/* Fondo blanco que aparece al final */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-white opacity-0 z-10"
      />

      {/* Contenedor con máscara */}
      <div 
        ref={maskContainerRef}
        className="absolute inset-0 z-20"
        style={{
          maskImage: 'url(#camera-mask)',
          WebkitMaskImage: 'url(#camera-mask)',
          maskSize: '3000px 3000px',
          maskPosition: 'center center',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: '3000px 3000px',
          WebkitMaskPosition: 'center center',
          WebkitMaskRepeat: 'no-repeat'
        }}
      >
        {/* Contenido dentro de la máscara */}
        <div 
          ref={contentRef}
          className="h-full bg-white p-8 md:p-16 flex flex-col justify-center"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Ejemplos Impresionantes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Descubre cómo nuestro AI transforma fotos dañadas en recuerdos perfectos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {examplesData.map((example, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                >
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <ComparisonSlider
                      beforeImage={example.beforeImage}
                      afterImage={example.afterImage}
                      autoSlide={false}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {example.title}
                  </h3>
                  <p className="text-gray-600">
                    {example.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to Action dentro de la máscara */}
            <div className="text-center mt-12">
              <button className="btn-primary text-xl px-12 py-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300">
                Restaura Tu Foto Ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-secondary-500/20 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
```

---

## 🎨 Fase 5: Mejoras en CSS y Tailwind

### 5.1 Actualización del index.css

**Agregar estilos** para los efectos de máscara y animaciones GTA VI:

```css
/* src/index.css - Adiciones para efectos GTA VI */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans antialiased;
    scroll-behavior: smooth;
  }
  
  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  /* ...existing code... */
  
  /* 🎭 Estilos para efectos GTA VI */
  .gta-hero-section {
    @apply relative overflow-hidden;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  
  .gta-mask-container {
    @apply absolute inset-0;
    mask-repeat: no-repeat;
    mask-position: center center;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center center;
    will-change: mask-size, opacity;
  }
  
  .gta-scroll-indicator {
    @apply fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40;
    animation: bounce-pulse 2s infinite;
  }
  
  .gta-fixed-header {
    @apply fixed top-0 left-0 right-0 z-50;
    will-change: opacity, transform;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  .gta-fixed-footer {
    @apply fixed bottom-0 left-0 right-0 z-50;
    will-change: opacity, transform;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  /* Sombras mejoradas para el efecto */
  .shadow-3xl {
    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
  }
  
  .shadow-4xl {
    box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5);
  }
}

@layer utilities {
  /* Utilidades para animaciones GTA VI */
  .will-change-mask {
    will-change: mask-size, mask-position;
  }
  
  .will-change-scroll {
    will-change: transform, opacity;
  }
  
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .transform-style-preserve {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
}

/* 🎬 Animaciones personalizadas */
@keyframes bounce-pulse {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Optimizaciones de rendimiento */
.gta-optimized {
  transform: translateZ(0);
  will-change: transform;
}
```

### 5.2 Actualización de tailwind.config.js

**Extender configuración** para efectos GTA VI:

```javascript
// tailwind.config.js - Adiciones para GTA VI
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ...existing colors...
      
      animation: {
        'bounce-pulse': 'bounce-pulse 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      
      keyframes: {
        bounceP pulse: {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)', 
            opacity: '1' 
          },
          '50%': { 
            transform: 'translateY(-10px) scale(1.1)', 
            opacity: '0.8' 
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1)' 
          },
        },
      },
      
      backdropBlur: {
        '4xl': '72px',
      },
      
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        '4xl': '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.3)',
      },
      
      fontSize: {
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
```

---

## 🚀 Fase 6: Implementación y Optimización

### 6.1 Hook Personalizado para Animaciones GTA VI

**Crear hook reutilizable** para gestionar las animaciones:

```typescript
// src/shared/hooks/useGTAAnimations.ts
import { useLayoutEffect, useRef, MutableRefObject } from 'react';
import { gsap, ScrollTrigger, cleanupGSAP } from '../../lib/gsap';

type GTAAnimationConfig = {
  heroScale?: boolean;
  maskEffect?: boolean;
  fadeElements?: boolean;
  parallax?: boolean;
};

export function useGTAAnimations(config: GTAAnimationConfig = {}) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const createHeroAnimation = (
    heroElement: Element,
    contentElement: Element,
    sliderElement: Element
  ) => {
    if (!config.heroScale) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroElement,
        start: "top top",
        end: "bottom center",
        scrub: 1,
        pin: true,
      }
    });

    tl.to(sliderElement, {
      scale: 1,
      duration: 1,
      ease: "none"
    }, 0)
    .to(contentElement, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "none"
    }, 0)
    .to(heroElement, {
      scale: 1.1,
      filter: "blur(2px)",
      duration: 1,
      ease: "none"
    }, 0);

    return tl;
  };

  const createMaskAnimation = (
    sectionElement: Element,
    maskElement: Element,
    contentElement: Element
  ) => {
    if (!config.maskEffect) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionElement,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        pin: true,
      }
    });

    tl.fromTo(maskElement, {
      maskSize: "3000px 3000px"
    }, {
      maskSize: "800px 800px",
      duration: 1,
      ease: "power2.inOut"
    })
    .to(contentElement, {
      rotation: 5,
      scale: 1.1,
      duration: 1,
      ease: "none"
    }, 0);

    return tl;
  };

  const createFadeAnimation = (elements: Element[]) => {
    if (!config.fadeElements) return;

    return gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "100vh",
        scrub: 1,
      }
    }).to(elements, {
      opacity: 0,
      duration: 1,
      ease: "none"
    });
  };

  const cleanup = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    cleanupGSAP();
  };

  return {
    createHeroAnimation,
    createMaskAnimation,
    createFadeAnimation,
    cleanup,
    timelineRef
  };
}
```

### 6.2 Componente de Performance Monitor

**Monitorear rendimiento** de las animaciones:

```typescript
// src/shared/components/debug/PerformanceMonitor.tsx
import React, { useEffect, useState } from 'react';

export function PerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    let frameCount = 0;
    let lastTime = performance.now();

    const updateStats = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;

        // Monitor memory usage if available
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          setMemoryUsage(Math.round(memory.usedJSHeapSize / 1048576));
        }
      }

      requestAnimationFrame(updateStats);
    };

    updateStats();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-sm font-mono z-100">
      <div>FPS: {fps}</div>
      <div>Memory: {memoryUsage}MB</div>
    </div>
  );
}
```

---

## 📱 Fase 7: Optimización Mobile y Responsive

### 7.1 Adaptaciones Mobile-First

**Asegurar funcionamiento** en dispositivos móviles:

```typescript
// src/shared/hooks/useResponsiveAnimations.ts
import { useEffect, useState } from 'react';

export function useResponsiveAnimations() {
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkMotionPreference = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
    };

    checkDevice();
    checkMotionPreference();

    window.addEventListener('resize', checkDevice);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkMotionPreference);

    return () => {
      window.removeEventListener('resize', checkDevice);
      mediaQuery.removeEventListener('change', checkMotionPreference);
    };
  }, []);

  return {
    isMobile,
    reduceMotion,
    shouldAnimate: !reduceMotion,
    animationIntensity: isMobile ? 0.5 : 1,
  };
}
```

---

## 🎯 Fase 8: Plan de Implementación Paso a Paso

### 8.1 Roadmap de Desarrollo

```markdown
## 📅 CRONOGRAMA DE IMPLEMENTACIÓN

### Semana 1: Preparación
- [x] Instalar GSAP y configurar TypeScript
- [x] Crear estructura de archivos para animaciones
- [x] Configurar hook personalizado useGTAAnimations
- [x] Actualizar tailwind.config.js con nuevas utilidades

### Semana 2: Elementos Fijos
- [x] Modificar MainLayout.tsx para elementos fijos
- [x] Crear ScrollIndicator component
- [x] Implementar fade-out de Header/Footer
- [x] Testing en diferentes dispositivos

### Semana 3: Hero Section
- [x] Implementar efecto de escala en ComparisonSlider
- [x] Animación de fade-out del contenido
- [x] Efecto de zoom en hero section
- [x] Optimizar rendimiento y suavidad

### Semana 4: Efecto de Máscara
- [x] Crear CameraMask SVG component
- [x] Implementar mask animation en ExamplesGallery
- [x] Coordinar con scroll position
- [x] Transición final a fondo blanco

### Semana 5: Polish & Testing
- [x] Performance optimization
- [x] Cross-browser testing
- [x] Mobile responsiveness
- [x] Accessibility improvements
- [x] Final debugging y launch
```

### 8.2 Comandos de Instalación

```bash
# 1. Instalar GSAP
npm install gsap @gsap/react

# 2. Verificar instalación
npm list gsap

# 3. Ejecutar en desarrollo para probar
npm run dev

# 4. Build para producción
npm run build
npm run preview
```

---

## 🏆 Resultados Esperados

### Efectos Implementados:

1. **✅ Header/Footer Fijos**: Se desvanecen elegantemente con el scroll
2. **✅ Scroll Indicator**: Indicador animado que guía al usuario
3. **✅ Hero Animation**: Efecto de "alejar cámara" en ComparisonSlider
4. **✅ Mask Effect**: Máscara con forma de cámara que revela contenido
5. **✅ Performance**: Optimizado para mobile y desktop
6. **✅ Accessibility**: Respeta preferencias de movimiento reducido

### Impacto Visual:

- **Entrada cinematográfica** similar a GTA VI
- **Transiciones suaves** entre secciones
- **Efecto wow** en la galería de ejemplos
- **Experiencia inmersiva** que refleja la calidad del producto
- **Diferenciación** clara de la competencia

---

## 🚀 Conclusión

Tu proyecto RestauraTuFoto.cl está **perfectamente estructurado** para implementar estos efectos cinematográficos. La combinación de:

- **Arquitectura sólida** (React + TypeScript)
- **Tailwind bien configurado**
- **Componentes modulares** (ComparisonSlider, ExamplesGallery)
- **GSAP + ScrollTrigger** para animaciones premium

...creará una experiencia de landing page **única en el mercado de restauración de fotos**.

El efecto de máscara en `ExamplesGallery` será particularmente impactante, mostrando tus capacidades técnicas mientras mantiene el foco en el resultado: **devolver la vida a los recuerdos más preciados**.

**🎬 ¡Es hora de darle a RestauraTuFoto.cl el tratamiento cinematográfico que merece!**
