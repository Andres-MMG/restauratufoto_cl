import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/features/authentication/stores/authStore';

describe('useAuthStore', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle credits operations', () => {
    const { result } = renderHook(() => useAuthStore());

    // Set up a mock user with credits
    act(() => {
      result.current.user = {
        id: 'test-user',
        email: 'test@example.com',
        credits: 5,
        trial_used: false,
      };
    });

    // Test adding credits
    act(() => {
      result.current.addCredits(3);
    });

    expect(result.current.user?.credits).toBe(8);

    // Test consuming credits
    act(() => {
      const success = result.current.consumeCredit();
      expect(success).toBe(true);
    });

    expect(result.current.user?.credits).toBe(7);
  });

  it('should not consume credits when user has none', () => {
    const { result } = renderHook(() => useAuthStore());

    // Set up a mock user with no credits
    act(() => {
      result.current.user = {
        id: 'test-user',
        email: 'test@example.com',
        credits: 0,
        trial_used: false,
      };
    });

    // Test consuming credits when none available
    act(() => {
      const success = result.current.consumeCredit();
      expect(success).toBe(false);
    });

    expect(result.current.user?.credits).toBe(0);
  });
});