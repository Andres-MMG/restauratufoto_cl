import React from 'react';
import { ComparisonSlider } from '../../../shared/components/ui/molecules/ComparisonSlider';

type Example = {
  beforeImage: string;
  afterImage: string;
  title: string;
  description: string;
};

type ExamplesGalleryProps = {
  examples?: Example[];
};

/**
 * Component to showcase before/after photo restoration examples
 */
export function ExamplesGallery({ examples }: ExamplesGalleryProps) {
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
    }
  ];
  
  const displayExamples = examples || defaultExamples;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {displayExamples.map((example, index) => (
        <div key={index} className="rounded-lg overflow-hidden shadow-lg">
          <ComparisonSlider 
            beforeImage={example.beforeImage} 
            afterImage={example.afterImage}
          />
          <div className="p-4 bg-white">
            <h3 className="font-semibold">{example.title}</h3>
            <p className="text-sm text-gray-600">{example.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
