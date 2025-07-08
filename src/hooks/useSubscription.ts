import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../features/authentication/hooks/useAuthStore';
import { stripeProducts } from '../stripe-config';

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
        const product = stripeProducts.find((p) => p.priceId === data.price_id);

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
