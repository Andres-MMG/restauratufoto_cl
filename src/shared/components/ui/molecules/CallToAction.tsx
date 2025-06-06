import React from 'react';
import { Button, ButtonProps } from '../atoms/Button';

type CallToActionProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonProps?: Partial<ButtonProps>;
  onButtonClick?: () => void;
};

/**
 * Reusable call to action component
 */
export function CallToAction({ 
  title, 
  subtitle, 
  buttonText, 
  buttonProps,
  onButtonClick
}: CallToActionProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        {title}
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
        {subtitle}
      </p>
      <Button 
        size="lg" 
        onClick={onButtonClick} 
        {...buttonProps}
      >
        {buttonText}
      </Button>
    </div>
  );
}
