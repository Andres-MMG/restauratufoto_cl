import React from 'react';

type Benefit = {
  icon: string;
  title: string;
  description: string;
};

type BenefitsListProps = {
  benefits?: Benefit[];
};

/**
 * Component for displaying a list of benefits/features
 */
export function BenefitsList({ benefits }: BenefitsListProps) {
  const defaultBenefits: Benefit[] = [
    {
      icon: '✨',
      title: 'Calidad Superior',
      description: 'Resultados profesionales garantizados',
    },
    {
      icon: '⚡',
      title: 'Súper Rápido',
      description: 'Resultados en segundos, no en días',
    },
    {
      icon: '🔒',
      title: '100% Seguro',
      description: 'Tus fotos están protegidas',
    },
  ];

  const displayBenefits = benefits || defaultBenefits;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {displayBenefits.map((benefit, index) => (
        <div key={index} className="text-center p-6">
          <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto mb-4">
            <span className="text-2xl">{benefit.icon}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
          <p className="text-gray-600">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
}
