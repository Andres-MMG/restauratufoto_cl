import React, { useEffect, useRef, useState } from 'react';

type ComparisonSliderProps = {
  beforeImage: string;
  afterImage: string;
  className?: string;
  autoSlide?: boolean;
  orientation?: 'horizontal' | 'vertical';
  labelPosition?: 'left' | 'right';
  dragIndicatorSide?: 'left' | 'right';
};

/**
 * Interactive slider component to compare before/after images
 */
export function ComparisonSlider({
  beforeImage,
  afterImage,
  className = '',
  autoSlide = false,
  orientation = 'horizontal',
  labelPosition = 'left',
  dragIndicatorSide = 'left',
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
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();

    let newPosition: number;

    if (orientation === 'horizontal') {
      const x = clientX - rect.left;
      newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    } else {
      const y = clientY - rect.top;
      newPosition = Math.max(0, Math.min(100, (y / rect.height) * 100));
    }

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
      // sizeClasses aplica w-full h-full en vertical, y w-full + altura fija en horizontal
      className={`relative overflow-hidden ${
        orientation === 'vertical' ? 'w-full h-full' : 'w-full h-64 md:h-80'
      } ${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      style={{ userSelect: 'none' }}
    >
      {/* Imagen "Antes" (fondo completo) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${beforeImage})`,
          backgroundSize: orientation === 'vertical' ? '100% auto' : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Imagen "Después" (se revela con el slider) - Contenedor con clip-path */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${afterImage})`,
          backgroundSize: orientation === 'vertical' ? '100% auto' : 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          clipPath:
            orientation === 'horizontal'
              ? `inset(0 ${100 - position}% 0 0)`
              : `inset(0 0 ${100 - position}% 0)`,
        }}
      />

      {/* Línea divisoria y handle */}
      <div
        className={`absolute ${orientation === 'horizontal' ? 'top-0 bottom-0 w-1' : 'left-0 right-0 h-1'} bg-white shadow-lg z-10`}
        style={
          orientation === 'horizontal'
            ? { left: `${position}%`, transform: 'translateX(-50%)' }
            : { top: `${position}%`, transform: 'translateY(-50%)' }
        }
      >
        {/* Handle circular */}
        <div
          className={`absolute ${orientation === 'horizontal' ? 'top-1/2 left-1/2' : 'top-1/2 left-1/2'} w-10 h-10 bg-white rounded-full shadow-xl border-2 border-primary-600 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200 cursor-grab active:cursor-grabbing`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="flex items-center text-primary-600 text-sm font-bold">
            {orientation === 'horizontal' ? (
              <div className="flex flex-row">
                <span>←</span>
                <span>→</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span>↑</span>
                <span>↓</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*** Wrappers de clipping para los labels ***/}

      {orientation === 'horizontal' ? (
        <>
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
        </>
      ) : (
        <>
          {/* Wrapper para "Después" (parte superior - parte revelada) */}
          <div
            className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none"
            style={{ height: `${position}%` }}
          >
            <div
              className="absolute top-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-200"
              style={{
                [labelPosition]: '1rem',
                opacity: Math.max(0, Math.min(1, position / 100)),
              }}
            >
              Después
            </div>
          </div>

          {/* Wrapper para "Antes" (parte inferior - fondo) */}
          <div
            className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none"
            style={{ height: `${100 - position}%` }}
          >
            <div
              className="absolute bottom-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-200"
              style={{
                [labelPosition]: '1rem',
                opacity: Math.max(0, Math.min(1, (100 - position) / 100)),
              }}
            >
              Antes
            </div>
          </div>
        </>
      )}

      {/* Indicador de instrucción si no ha interactuado */}
      {!userInteracted && (
        <div
          className="absolute bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse whitespace-nowrap z-20"
          style={
            orientation === 'horizontal'
              ? {
                  left: `${position}%`,
                  bottom: '1.5rem',
                  transform: 'translateX(-50%)',
                }
              : {
                  top: `${position}%`,
                  [dragIndicatorSide]: '1.5rem',
                  transform: 'translateY(-50%)',
                }
          }
        >
          {orientation === 'horizontal' ? '← Arrastra →' : '↑ Arrastra ↓'}
        </div>
      )}
    </div>
  );
}
