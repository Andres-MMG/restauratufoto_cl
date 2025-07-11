import { Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/Button';
import { stripeProducts, type StripeProduct } from '@/stripe-config';
import { useAuthStore } from '@/features/authentication/stores/authStore';

interface PricingCardsProps {
  onSelect: (product: StripeProduct) => void;
  isLoading: boolean;
}

export function PricingCards({ onSelect, isLoading }: PricingCardsProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {stripeProducts.map(product => (
        <div
          key={product.id}
          className={`pricing-card ${product.popular ? 'pricing-card-popular' : ''}`}
        >
          {product.popular && (
            <span className="pricing-card-badge">Más Popular</span>
          )}
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <p className="text-4xl font-bold mb-1">${product.price.toFixed(2)}</p>
          {product.mode === 'subscription' && (
            <p className="text-sm text-gray-500 mb-4">Mensual</p>
          )}
          {product.mode === 'payment' && (
            <p className="text-sm text-gray-500 mb-4">Pago único</p>
          )}
          <ul className="space-y-3 mb-6">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check
                  size={18}
                  className="text-accent-500 mr-2 mt-0.5 flex-shrink-0"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant={product.popular ? 'primary' : 'outline'}
            onClick={() => onSelect(product)}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isAuthenticated ? 'Seleccionar' : 'Registrarse'}
          </Button>
        </div>
      ))}
    </div>
  );
}
