import { useState } from 'react';
import { useAuthStore } from '../../authentication/hooks/useAuthStore';
import { generateProcessedImageUrl } from '../services/imageProcessing';
import { useNotifications } from '../../../shared/hooks/useNotifications';
import { delay } from '../../../shared/utils';

/**
 * Custom hook for handling photo restoration operations
 */
export const usePhotoRestoration = () => {
  const { user, consumeCredit } = useAuthStore();
  const { showSuccess, showError } = useNotifications();

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Set the original image to restore
   */
  const setImage = (imageUrl: string) => {
    setOriginalImage(imageUrl);
    setProcessedImage(null);
    setError(null);
  };

  /**
   * Reset all state
   */
  const resetState = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
  };

  /**
   * Process the image with AI
   */
  const processImage = async () => {
    if (!originalImage || !user) {
      setError('Debes iniciar sesión y seleccionar una imagen para continuar');
      return;
    }

    // Check if user has credits
    if (!consumeCredit()) {
      setError(
        'No tienes créditos suficientes. Por favor, compra más para continuar.'
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // In a real app, we would upload the image and call an API
      await delay(2000); // Simulate API call

      const processedUrl = generateProcessedImageUrl(originalImage);
      setProcessedImage(processedUrl);
      showSuccess('¡Imagen restaurada con éxito!');
    } catch {
      setError('Error al procesar la imagen. Por favor, intenta de nuevo.');
      showError('Ha ocurrido un error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Upload a file to storage and set it as the original image
   */
  const uploadFile = async (file: File) => {
    if (!user) {
      setError('Debes iniciar sesión para subir archivos');
      return;
    }

    try {
      // In a real app with Supabase:
      // const imageUrl = await photoService.uploadPhoto(file, user.id);

      // For demo, just use a local object URL
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } catch {
      setError('Error al subir la imagen. Por favor, intenta de nuevo.');
      showError('Ha ocurrido un error al subir la imagen');
    }
  };

  return {
    originalImage,
    processedImage,
    isProcessing,
    error,
    setImage,
    processImage,
    resetState,
    uploadFile,
  };
};
