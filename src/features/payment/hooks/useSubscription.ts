import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '@/features/authentication/stores/authStore';
// Update the import path if the file exists elsewhere, for example:
//import { stripeProducts } from '../utils/stripe-config';
// Or, if the file does not exist, create 'stripe-config.ts' in the correct directory with the following content:

export const stripeProducts = [
  { priceId: 'price_123', name: 'Basic Plan' },
  { priceId: 'price_456', name: 'Pro Plan' },
];

type Subscription = {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  plan_name: string | null;
};

export function useSubscription() {
  const { isAuthenticated } = useAuthStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setSubscription(null);
      return;
    }

    fetchSubscription();
  }, [isAuthenticated]);

  const fetchSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        // Find the product name based on price_id
        const product = stripeProducts.find(p => p.priceId === data.price_id);

        setSubscription({
          ...data,
          plan_name: product?.name || null,
        });
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(
        err instanceof Error ? err.message : 'Error fetching subscription'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
  };
}
