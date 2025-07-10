export interface Plan {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'subscription' | 'payment';
  credits: number;
  popular?: boolean;
  features: string[];
}

export type PaymentMode = 'subscription' | 'payment';

export interface OrderSummary {
  plan: Plan;
  subtotal: number;
  tax: number;
  total: number;
}

export interface PaymentResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}
