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

// Configuraciones preestablecidas para efectos GTA VI
export const gtaPresets = {
  heroAnimation: {
    duration: 1,
    ease: 'none',
    scrub: 1,
  },
  maskAnimation: {
    duration: 1,
    ease: 'power2.inOut',
    scrub: 1,
  },
  fadeAnimation: {
    duration: 1,
    ease: 'none',
    scrub: 1,
  },
};

// Helper para verificar si las animaciones están soportadas
export const isAnimationSupported = () => {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Helper para dispositivos móviles
export const isMobile = () => {
  return window.innerWidth < 768;
};

// Configuración responsive para animaciones
export const getResponsiveConfig = () => {
  const mobile = isMobile();
  const reducedMotion = !isAnimationSupported();

  return {
    intensity: mobile ? 0.5 : 1,
    shouldAnimate: !reducedMotion,
    duration: mobile ? 0.5 : 1,
    scrub: mobile ? 0.5 : 1,
  };
};
