import React from 'react';

type Step = {
  number: number;
  title: string;
  description: string;
};

type HowItWorksProps = {
  steps?: Step[];
};

/**
 * Component for displaying the process steps
 */
export function HowItWorks({ steps }: HowItWorksProps) {
  const defaultSteps: Step[] = [
    {
      number: 1,
      title: 'Sube tu Foto',
      description: 'Selecciona la foto que deseas restaurar',
    },
    {
      number: 2,
      title: 'IA en Acción',
      description: 'Nuestra IA restaura tu foto automáticamente',
    },
    {
      number: 3,
      title: 'Descarga',
      description: 'Obtén tu foto restaurada en alta calidad',
    },
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {displaySteps.map(step => (
        <div key={step.number} className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">
            {step.number}
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
