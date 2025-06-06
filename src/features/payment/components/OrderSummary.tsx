import React from 'react';
import { Plan } from '../../../pages/PricingPage';
import { formatCurrency } from '../../../shared/utils/helpers';

type OrderSummaryProps = {
  plan: Plan;
};

/**
 * Order summary component for checkout page
 */
export function OrderSummary({ plan }: OrderSummaryProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">{plan.name}</span>
          <span>{formatCurrency(plan.price)}</span>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {plan.id === 'single' ? '1 crédito' : 
           plan.id === 'pack10' ? '10 créditos' : 
           'Créditos ilimitados (mensual)'}
        </div>
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(plan.price)}</span>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p className="mb-2">
          Métodos de pago aceptados:
        </p>
        <div className="flex gap-2">
          <div className="bg-gray-100 px-2 py-1 rounded text-xs">Visa</div>
          <div className="bg-gray-100 px-2 py-1 rounded text-xs">Mastercard</div>
          <div className="bg-gray-100 px-2 py-1 rounded text-xs">American Express</div>
          <div className="bg-gray-100 px-2 py-1 rounded text-xs">PayPal</div>
        </div>
      </div>
    </div>
  );
}
