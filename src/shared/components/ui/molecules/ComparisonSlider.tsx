import React, { useEffect, useRef, useState } from 'react';

type ComparisonSliderProps = {
  beforeImage: string;
  afterImage: string;
  className?: string;
  autoSlide?: boolean;
};

/**
 * Interactive slider component to compare before/after images
 */
export function ComparisonSlider({
  beforeImage,
  afterImage,
  className = '',
  autoSlide = false,
}: ComparisonSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(50);
  const [userInteracted, setUserInteracted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoSlide && !userInteracted) {
      const interval = setInterval(() => {
        setPosition(prev => {
          if (prev >= 90) return 10;
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [autoSlide, userInteracted]);

  const handleMouseDown = () => {
    setIsDragging(true);
    setUserInteracted(true); // Usuario tomó control
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setPosition(newPosition);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={sliderRef}
      className={`relative w-full h-64 md:h-80 overflow-hidden ${className} ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      style={{ userSelect: 'none' }}
    >
      {/* Imagen "Antes" (fondo completo) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${beforeImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Imagen "Después" (se revela con el slider) - Contenedor con clip-path */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${afterImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      />

      {/* Línea divisoria y handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        {/* Handle circular */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 bg-white rounded-full shadow-xl border-2 border-primary-600 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Iconos de flecha más visibles */}
          <div className="flex items-center text-primary-600 text-sm font-bold">
            <span>←</span>
            <span>→</span>
          </div>
        </div>
      </div>

      {/*** Wrappers de clipping para los labels ***/}

      {/* Wrapper para "Después" (lado izquierdo - parte revelada) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${position}%` }}
      >
        <div
          className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-200"
          style={{
            opacity: Math.max(0, Math.min(1, position / 100)),
          }}
        >
          Después
        </div>
      </div>

      {/* Wrapper para "Antes" (lado derecho - fondo) */}
      <div
        className="absolute top-0 right-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${100 - position}%` }}
      >
        <div
          className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-200"
          style={{
            opacity: Math.max(0, Math.min(1, (100 - position) / 100)),
          }}
        >
          Antes
        </div>
      </div>

      {/* Indicador de instrucción si no ha interactuado */}
      {!userInteracted && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-pulse whitespace-nowrap z-20">
          ← Arrastra para comparar →
        </div>
      )}
    </div>
  );
}
