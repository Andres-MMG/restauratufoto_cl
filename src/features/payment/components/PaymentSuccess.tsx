import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { type StripeProduct } from '../../../stripe-config';

type PaymentSuccessProps = {
  plan: StripeProduct;
  onContinue: () => void;
};

/**
 * Payment success component shown after successful payment
 */
export function PaymentSuccess({ plan, onContinue }: PaymentSuccessProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle size={64} className="text-accent-500" />
      </div>
      <h1 className="text-2xl font-bold mb-2">¡Pago Completado!</h1>
      <p className="text-gray-600 mb-6">
        Tu compra de {plan.name} ha sido procesada correctamente.
        {plan.id !== 'subscription' &&
          ` Se han añadido ${plan.credits} créditos a tu cuenta.`}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Serás redirigido automáticamente en unos segundos...
      </p>
      <Button onClick={onContinue}>Ir a la Aplicación</Button>
    </div>
  );
}
