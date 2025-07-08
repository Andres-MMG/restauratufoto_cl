import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  credits: number;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface PaymentState {
  // Available plans
  plans: PaymentPlan[];
  
  // User's subscription
  subscription: Subscription | null;
  
  // Payment flow state
  selectedPlan: PaymentPlan | null;
  isProcessingPayment: boolean;
  paymentError: string | null;
  
  // Actions
  loadPlans: () => void;
  selectPlan: (plan: PaymentPlan) => void;
  createPaymentSession: (planId: string) => Promise<string | null>;
  loadSubscription: (userId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  clearPaymentError: () => void;
  
  // Plan management
  getPlanById: (id: string) => PaymentPlan | undefined;
  getActivePlan: () => PaymentPlan | undefined;
}

// Default plans configuration
const defaultPlans: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    credits: 3,
    features: [
      '3 restauraciones por mes',
      'Calidad estándar',
      'Soporte por email',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro Mensual',
    price: 9.99,
    interval: 'month',
    credits: 50,
    popular: true,
    features: [
      '50 restauraciones por mes',
      'Calidad premium',
      'Soporte prioritario',
      'Descarga en alta resolución',
      'Sin marca de agua',
    ],
  },
  {
    id: 'pro-yearly',
    name: 'Pro Anual',
    price: 99.99,
    interval: 'year',
    credits: 600,
    features: [
      '600 restauraciones por año',
      'Calidad premium',
      'Soporte prioritario',
      'Descarga en alta resolución',
      'Sin marca de agua',
      '2 meses gratis',
    ],
  },
];

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      // Initial state
      plans: defaultPlans,
      subscription: null,
      selectedPlan: null,
      isProcessingPayment: false,
      paymentError: null,

      // Actions
      loadPlans: () => {
        // In a real app, this would fetch from an API
        set({ plans: defaultPlans });
      },

      selectPlan: (plan: PaymentPlan) => {
        set({ selectedPlan: plan, paymentError: null });
      },

      createPaymentSession: async (planId: string): Promise<string | null> => {
        set({ isProcessingPayment: true, paymentError: null });

        try {
          // In a real implementation, this would call your payment API
          // For now, we'll simulate the process
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Return a mock checkout URL
          const checkoutUrl = `https://checkout.stripe.com/pay/mock-session-${planId}`;
          
          set({ isProcessingPayment: false });
          return checkoutUrl;
        } catch {
          set({
            isProcessingPayment: false,
            paymentError: 'Error al crear la sesión de pago. Intenta de nuevo.',
          });
          return null;
        }
      },

      loadSubscription: async (userId: string) => {
        try {
          // In a real app, this would fetch from your backend
          // For now, we'll simulate
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock subscription data
          const mockSubscription: Subscription = {
            id: 'sub_mock',
            user_id: userId,
            plan_id: 'free',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancel_at_period_end: false,
          };
          
          set({ subscription: mockSubscription });
        } catch (error) {
          console.error('Error loading subscription:', error);
        }
      },

      cancelSubscription: async () => {
        const { subscription } = get();
        if (!subscription) return;

        try {
          set({ isProcessingPayment: true });
          
          // In a real app, this would call your backend API
          await new Promise((resolve) => setTimeout(resolve, 1500));
          
          set({
            subscription: {
              ...subscription,
              cancel_at_period_end: true,
            },
            isProcessingPayment: false,
          });
        } catch {
          set({
            isProcessingPayment: false,
            paymentError: 'Error al cancelar la suscripción. Intenta de nuevo.',
          });
        }
      },

      clearPaymentError: () => {
        set({ paymentError: null });
      },

      // Utility functions
      getPlanById: (id: string) => {
        return get().plans.find((plan) => plan.id === id);
      },

      getActivePlan: () => {
        const { subscription, plans } = get();
        if (!subscription) return plans.find((plan) => plan.id === 'free');
        return plans.find((plan) => plan.id === subscription.plan_id);
      },
    }),
    {
      name: 'payment-storage',
      partialize: (state) => ({
        subscription: state.subscription,
        selectedPlan: state.selectedPlan,
      }),
    }
  )
);