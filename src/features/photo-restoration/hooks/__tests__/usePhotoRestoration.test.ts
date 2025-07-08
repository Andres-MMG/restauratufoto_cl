import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePhotoRestoration } from '../usePhotoRestoration';

// Mock the auth store
vi.mock('../../../authentication/hooks/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '123', email: 'test@test.com' },
    consumeCredit: vi.fn(() => true),
  })),
}));

// Mock the notifications hook
vi.mock('../../../../shared/hooks/useNotifications', () => ({
  useNotifications: vi.fn(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  })),
}));

// Mock the image processing service
vi.mock('../../services/imageProcessing', () => ({
  generateProcessedImageUrl: vi.fn(
    () => 'https://example.com/processed-image.jpg'
  ),
}));

// Mock delay utility
vi.mock('../../../../shared/utils/helpers', () => ({
  delay: vi.fn(() => Promise.resolve()),
}));

describe('usePhotoRestoration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => usePhotoRestoration());

      expect(result.current.originalImage).toBe(null);
      expect(result.current.processedImage).toBe(null);
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Image Upload', () => {
    it('should handle image upload correctly', async () => {
      const { result } = renderHook(() => usePhotoRestoration());

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await act(async () => {
        result.current.uploadFile(mockFile);
      });

      expect(result.current.originalImage).toBeTruthy();
      expect(result.current.error).toBe(null);
    });
  });

  describe('Image Processing', () => {
    it('should process image successfully when user has credits', async () => {
      const { useAuthStore } = await import(
        '../../../authentication/hooks/useAuthStore'
      );
      const mockStore = {
        user: { id: '123', email: 'test@test.com' },
        consumeCredit: vi.fn(() => true),
      };
      (useAuthStore as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { result } = renderHook(() => usePhotoRestoration());

      // Set an original image first
      act(() => {
        result.current.setImage('https://example.com/original.jpg');
      });

      await act(async () => {
        result.current.processImage();
      });

      expect(mockStore.consumeCredit).toHaveBeenCalled();
      expect(result.current.processedImage).toBeTruthy();
      expect(result.current.error).toBe(null);
    });

    it('should fail to process when user has no credits', async () => {
      const { useAuthStore } = await import(
        '../../../authentication/hooks/useAuthStore'
      );
      const mockStore = {
        user: { id: '123', email: 'test@test.com' },
        consumeCredit: vi.fn(() => false),
      };
      (useAuthStore as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { result } = renderHook(() => usePhotoRestoration());

      // Set an original image first
      act(() => {
        result.current.setImage('https://example.com/original.jpg');
      });

      await act(async () => {
        result.current.processImage();
      });

      expect(mockStore.consumeCredit).toHaveBeenCalled();
      expect(result.current.processedImage).toBe(null);
      expect(result.current.error).toContain('créditos');
    });

    it('should not process without original image', async () => {
      const { result } = renderHook(() => usePhotoRestoration());

      await act(async () => {
        result.current.processImage();
      });

      expect(result.current.error).toContain('imagen');
      expect(result.current.processedImage).toBe(null);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all state correctly', () => {
      const { result } = renderHook(() => usePhotoRestoration());

      // Set some state first
      act(() => {
        result.current.setImage('https://example.com/original.jpg');
      });

      // Reset
      act(() => {
        result.current.resetState();
      });

      expect(result.current.originalImage).toBe(null);
      expect(result.current.processedImage).toBe(null);
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });
});
