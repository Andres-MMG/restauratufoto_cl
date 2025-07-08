import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for handling notifications
 */
export const useNotifications = () => {
  /**
   * Show success notification
   */
  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  /**
   * Show error notification
   */
  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  /**
   * Show info notification
   */
  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  /**
   * Show loading notification
   */
  const showLoading = useCallback(<T>(message: string, promise: Promise<T>) => {
    toast.promise(promise, {
      loading: message,
      success: 'Operación completada',
      error: 'Ha ocurrido un error',
    });
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
    showLoading,
  };
};
