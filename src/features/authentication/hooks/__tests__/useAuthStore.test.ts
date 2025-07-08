import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../useAuthStore';

// Mock the auth service
vi.mock('../../services/authService', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAuthStore.getState().logout();
    useAuthStore.setState({
      user: null,
      credits: 0,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBe(null);
      expect(result.current.credits).toBe(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Credits Management', () => {
    it('should add credits correctly', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.addCredits(5);
      });

      expect(result.current.credits).toBe(5);
    });

    it('should consume credit when user has credits', () => {
      const { result } = renderHook(() => useAuthStore());

      // Add some credits first
      act(() => {
        result.current.addCredits(3);
      });

      // Consume a credit
      let success: boolean;
      act(() => {
        success = result.current.consumeCredit();
      });

      expect(success!).toBe(true);
      expect(result.current.credits).toBe(2);
    });

    it('should not consume credit when user has no credits', () => {
      const { result } = renderHook(() => useAuthStore());

      let success: boolean;
      act(() => {
        success = result.current.consumeCredit();
      });

      expect(success!).toBe(false);
      expect(result.current.credits).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle login errors correctly', async () => {
      const mockSignIn = await import('../../services/authService').then(
        (m) => m.signIn
      );
      mockSignIn.mockResolvedValueOnce({
        error: { message: 'Invalid credentials' },
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('test@test.com', 'wrongpassword');
      });

      expect(result.current.error).toBe('Invalid credentials');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('User State Management', () => {
    it('should update user state correctly', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: '123',
        email: 'test@test.com',
        full_name: 'Test User',
      };

      act(() => {
        useAuthStore.setState({
          user: mockUser,
          isAuthenticated: true,
          credits: 10,
        });
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.credits).toBe(10);
    });
  });
});
