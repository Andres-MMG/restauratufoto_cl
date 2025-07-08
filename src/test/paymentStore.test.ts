import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentStore } from '@/features/payment/stores/paymentStore';

// Mock setTimeout for payment simulation
vi.useFakeTimers();

describe('usePaymentStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePaymentStore.setState({
      plans: [],
      subscription: null,
      selectedPlan: null,
      isProcessingPayment: false,
      paymentError: null,
    });
  });

  it('should initialize with default plans', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.loadPlans();
    });

    expect(result.current.plans).toHaveLength(3);
    expect(result.current.plans[0].id).toBe('free');
    expect(result.current.plans[1].id).toBe('pro-monthly');
    expect(result.current.plans[2].id).toBe('pro-yearly');
  });

  it('should select a plan', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.loadPlans();
    });

    const proPlan = result.current.plans[1];

    act(() => {
      result.current.selectPlan(proPlan);
    });

    expect(result.current.selectedPlan).toEqual(proPlan);
    expect(result.current.paymentError).toBeNull();
  });

  it('should create payment session', async () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.loadPlans();
    });

    let checkoutUrl: string | null = null;
    
    // Start payment session creation
    act(() => {
      result.current.createPaymentSession('pro-monthly').then((url) => {
        checkoutUrl = url;
      });
    });

    expect(result.current.isProcessingPayment).toBe(true);

    // Fast-forward timers to simulate API call
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isProcessingPayment).toBe(false);
    expect(checkoutUrl).toContain('mock-session-pro-monthly');
  });

  it('should get plan by ID', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.loadPlans();
    });

    const plan = result.current.getPlanById('pro-monthly');
    expect(plan?.name).toBe('Pro Mensual');
    expect(plan?.price).toBe(9.99);
  });

  it('should return free plan as active when no subscription', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.loadPlans();
    });

    const activePlan = result.current.getActivePlan();
    expect(activePlan?.id).toBe('free');
  });

  it('should load user subscription', async () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.loadSubscription('user-123');
    });

    // Fast-forward timers to simulate API call
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.subscription).toBeDefined();
    expect(result.current.subscription?.user_id).toBe('user-123');
    expect(result.current.subscription?.status).toBe('active');
  });

  it('should cancel subscription', async () => {
    const { result } = renderHook(() => usePaymentStore());

    // First load a subscription
    await act(async () => {
      result.current.loadSubscription('user-123');
      vi.advanceTimersByTime(1000);
    });

    // Then cancel it
    act(() => {
      result.current.cancelSubscription();
    });

    expect(result.current.isProcessingPayment).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.isProcessingPayment).toBe(false);
    expect(result.current.subscription?.cancel_at_period_end).toBe(true);
  });

  it('should clear payment error', () => {
    const { result } = renderHook(() => usePaymentStore());

    // Set an error first
    act(() => {
      usePaymentStore.setState({ paymentError: 'Test error' });
    });

    expect(result.current.paymentError).toBe('Test error');

    act(() => {
      result.current.clearPaymentError();
    });

    expect(result.current.paymentError).toBeNull();
  });
});