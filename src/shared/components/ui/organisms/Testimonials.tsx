import React from 'react';

type TestimonialItemProps = {
  rating: number;
  text: string;
  name: string;
  verified: boolean;
  avatarUrl?: string;
};

/**
 * Individual testimonial card component
 */
function TestimonialItem({ rating, text, name, verified, avatarUrl }: TestimonialItemProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-warning-500 mb-4">
        {Array(rating).fill('★').join('')}
      </div>
      <p className="text-gray-600 mb-4">"{text}"</p>
      <div className="flex items-center">
        <div 
          className="w-10 h-10 bg-gray-200 rounded-full mr-3"
          style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover' } : {}}
        ></div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">
            Cliente {verified ? 'Verificado' : 'No Verificado'}
            {verified ? 'a' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}

type TestimonialsProps = {
  testimonials?: TestimonialItemProps[];
};

/**
 * Testimonials grid component to display customer reviews
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  // Default testimonials if none are provided
  const defaultTestimonials: TestimonialItemProps[] = [
    {
      rating: 5,
      text: "Increíble servicio. Restauré fotos de mis abuelos que creía perdidas.",
      name: "María García",
      verified: true
    },
    {
      rating: 5,
      text: "La calidad es impresionante. Mis fotos familiares lucen como nuevas.",
      name: "Carlos Ruiz",
      verified: true
    },
    {
      rating: 5,
      text: "Rápido, fácil y los resultados son espectaculares. ¡Muy recomendado!",
      name: "Ana Martínez",
      verified: true
    }
  ];
  
  const items = testimonials || defaultTestimonials;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <TestimonialItem key={index} {...item} />
      ))}
    </div>
  );
}
