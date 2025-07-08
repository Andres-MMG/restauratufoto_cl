import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/features/authentication/stores/authStore';
import { usePaymentStore } from '@/features/payment/stores/paymentStore';
import { usePhotoRestorationStore } from '@/features/photo-restoration/stores/photoRestorationStore';

// Integration test for critical user flow
describe('Critical User Flow Integration', () => {
  it('should handle complete user journey: login -> select plan -> manage credits', async () => {
    // Test the critical path: Login, Select Plan, Manage Credits
    
    // 1. Authentication Flow
    const authStore = renderHook(() => useAuthStore());
    
    // Simulate user login
    act(() => {
      // Set authenticated user with some credits
      authStore.result.current.user = {
        id: 'user-123',
        email: 'test@example.com',
        full_name: 'Test User',
        credits: 10,
        trial_used: false,
      };
      authStore.result.current.isAuthenticated = true;
    });

    expect(authStore.result.current.isAuthenticated).toBe(true);
    expect(authStore.result.current.user?.credits).toBe(10);

    // 2. Payment Flow - Select Plan
    const paymentStore = renderHook(() => usePaymentStore());
    
    act(() => {
      paymentStore.result.current.loadPlans();
    });

    expect(paymentStore.result.current.plans).toHaveLength(3);

    const proPlan = paymentStore.result.current.plans[1]; // Pro Monthly
    act(() => {
      paymentStore.result.current.selectPlan(proPlan);
    });

    expect(paymentStore.result.current.selectedPlan?.name).toBe('Pro Mensual');

    // 3. Photo Restoration Flow - Basic Setup
    const restorationStore = renderHook(() => usePhotoRestorationStore());

    // Set an image
    const testImageUrl = 'https://example.com/test-image.jpg';
    act(() => {
      restorationStore.result.current.setImage(testImageUrl);
    });

    expect(restorationStore.result.current.originalImage).toBe(testImageUrl);

    // 4. Credit Consumption Test
    const initialCredits = authStore.result.current.user?.credits || 0;
    
    act(() => {
      const creditUsed = authStore.result.current.consumeCredit();
      expect(creditUsed).toBe(true);
    });

    expect(authStore.result.current.user?.credits).toBe(initialCredits - 1);

    // 5. Add more credits (simulating plan upgrade)
    act(() => {
      authStore.result.current.addCredits(50); // Pro plan credits
    });

    expect(authStore.result.current.user?.credits).toBe(initialCredits - 1 + 50);
  });

  it('should prevent processing when user has no credits', () => {
    const authStore = renderHook(() => useAuthStore());
    
    // Set user with no credits
    act(() => {
      authStore.result.current.user = {
        id: 'user-123',
        email: 'test@example.com',
        credits: 0,
        trial_used: true,
      };
    });

    // Try to consume credit
    act(() => {
      const creditUsed = authStore.result.current.consumeCredit();
      expect(creditUsed).toBe(false);
    });

    expect(authStore.result.current.user?.credits).toBe(0);
  });

  it('should handle payment flow with fake timers', async () => {
    vi.useFakeTimers();
    
    const paymentStore = renderHook(() => usePaymentStore());
    
    // Load plans
    act(() => {
      paymentStore.result.current.loadPlans();
    });

    // Select pro plan
    const proPlan = paymentStore.result.current.plans[1];
    act(() => {
      paymentStore.result.current.selectPlan(proPlan);
    });

    // Create payment session
    let paymentUrl: string | null = null;
    
    const paymentPromise = paymentStore.result.current.createPaymentSession('pro-monthly');
    
    // Fast forward time
    await act(async () => {
      vi.advanceTimersByTime(2000);
      paymentUrl = await paymentPromise;
    });

    expect(paymentUrl).toContain('mock-session-pro-monthly');
    expect(paymentStore.result.current.isProcessingPayment).toBe(false);
    
    vi.useRealTimers();
  });
});