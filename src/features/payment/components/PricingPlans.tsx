import React from 'react';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { useAuthStore } from '../../authentication/hooks/useAuthStore';
import { availablePlans } from '../../../pages/PricingPage';

type PricingPlanProps = {
  compact?: boolean;
  onPlanSelect?: (planId: string) => void;
};

/**
 * Component for displaying pricing plans
 * Can be shown in compact mode for the HomePage or full mode for the PricingPage
 */
export function PricingPlans({ onPlanSelect }: PricingPlanProps) {
  const { isAuthenticated } = useAuthStore();

  const handleSelectPlan = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {availablePlans.map(plan => (
        <div
          key={plan.id}
          className={`bg-white p-8 rounded-xl border border-gray-200 hover:border-primary-500 transition-all ${plan.popular ? 'relative border-accent-500 shadow-lg' : ''}`}
        >
          {plan.popular && (
            <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs px-2 py-1 rounded-bl-md rounded-tr-md">
              Más Popular
            </span>
          )}
          <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
          <p className="text-4xl font-bold mb-2">${plan.price.toFixed(2)}</p>
          {plan.id === 'pack10' && (
            <p className="text-sm text-gray-500 mb-4">Solo $0.99 por foto</p>
          )}
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="text-accent-500 mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <Button
            variant={plan.popular ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => handleSelectPlan(plan.id)}
          >
            {isAuthenticated ? 'Elegir Plan' : 'Registrarse'}
          </Button>
        </div>
      ))}
    </div>
  );
}
