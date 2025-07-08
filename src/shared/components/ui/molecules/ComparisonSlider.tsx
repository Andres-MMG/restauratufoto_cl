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
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoSlide) {
      const interval = setInterval(() => {
        setPosition(prev => {
          if (prev >= 90) return 10;
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [autoSlide]);

  const handleMouseDown = () => {
    if (autoSlide) return;
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (autoSlide) return;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || autoSlide) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));

    setPosition(newPosition);
  };

  useEffect(() => {
    if (autoSlide) return;

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [autoSlide]);

  return (
    <div
      ref={sliderRef}
      className={`comparison-slider ${className} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <div
        className="before"
        style={{ backgroundImage: `url(${beforeImage})` }}
      />
      <div
        className="after"
        style={{
          backgroundImage: `url(${afterImage})`,
          width: `${position}%`,
        }}
      />
      <div
        className="slider-handle"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      />
    </div>
  );
}
