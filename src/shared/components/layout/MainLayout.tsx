import { ReactNode, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollIndicator } from '../ui/molecules/ScrollIndicator';
import { gsap } from '../../../lib/gsap';

type MainLayoutProps = {
  children: ReactNode;
};

/**
 * Main layout component with GTA VI effects - fixed elements that fade out with scroll
 */
export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  
  // Only apply GTA VI effects on HomePage
  const isHomePage = location.pathname === '/';

  useLayoutEffect(() => {
    if (!isHomePage) return;
    
    const header = headerRef.current;
    const footer = footerRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!header || !footer || !scrollIndicator) return;

    // 🎬 GTA VI FIXED ELEMENTS ANIMATION
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "100vh",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Smooth fade out effect like GTA VI
          gsap.set([header, footer, scrollIndicator], {
            opacity: 1 - progress,
            pointerEvents: progress > 0.5 ? 'none' : 'auto'
          });
          
          // Slight blur effect for depth
          gsap.set([header, footer], {
            filter: `blur(${progress * 2}px)`
          });
        }
      }
    });

    return () => {
      tl.kill();
    };
  }, [isHomePage]);

  if (isHomePage) {
    return (
      <div className="relative">
        {/* Fixed Header with GTA VI effects */}
        <header 
          ref={headerRef}
          className="fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 backdrop-blur-sm"
        >
          <Header />
        </header>

        {/* Main content */}
        <main className="relative z-10">
          {children}
        </main>

        {/* Fixed Footer with GTA VI effects */}
        <footer 
          ref={footerRef}
          className="fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 backdrop-blur-sm"
        >
          <Footer />
        </footer>

        {/* Scroll Indicator - GTA VI style */}
        <div 
          ref={scrollIndicatorRef}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
        >
          <ScrollIndicator />
        </div>
      </div>
    );
  }

  // Standard layout for other pages
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
