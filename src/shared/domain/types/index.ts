// User related types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  credits: number;
  trial_used: boolean;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Export payment types
export * from './payment';

// Payment related types
export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  credits: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

// Photo restoration types
export interface RestorationJob {
  id: string;
  originalImage: string;
  processedImage?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

export interface PhotoRestorationState {
  originalImage: string | null;
  processedImage: string | null;
  isProcessing: boolean;
  error: string | null;
  jobs: RestorationJob[];
}

// Common API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Notification types
export interface NotificationConfig {
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
