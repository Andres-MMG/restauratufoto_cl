import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/Button';
import { ComparisonSlider } from '@/shared/components/ui/molecules/ComparisonSlider';
import { useAuthStore } from '@/features/authentication/stores/authStore';
import { delay, generateProcessedImageUrl } from '../lib/utils';

export function AppPage() {
  const { user, consumeCredit } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check if user has credits
    if (!user || user.credits <= 0) {
      setError(
        'No tienes créditos suficientes. Por favor, compra más para continuar.'
      );
      return;
    }

    // Check file type
    if (!file.type.includes('image/')) {
      setError('Por favor, sube un archivo de imagen válido.');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es demasiado grande. El tamaño máximo es 10MB.');
      return;
    }

    setError(null);

    // Create a URL for the image
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setProcessedImage(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcessImage = async () => {
    if (!originalImage) return;

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
      // Simulate processing delay
      await delay(3000);

      // In a real app, this would call an API to process the image
      // For demo, just use a placeholder "restored" image
      const processedImageUrl = generateProcessedImageUrl(originalImage);
      setProcessedImage(processedImageUrl);
    } catch (err) {
      setError(
        'Ha ocurrido un error al procesar la imagen. Por favor, intenta de nuevo.'
      );
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'restored-image.jpg';
    link.click();
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Restaurar Fotos</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Créditos:{' '}
              <span className="font-semibold">{user?.credits || 0}</span>
            </span>
            <Link to="/pricing">
              <Button size="sm" variant="outline">
                Comprar más
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-600 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
              {(!user || user.credits <= 0) && (
                <Link
                  to="/pricing"
                  className="mt-2 inline-block text-primary-600 font-medium hover:underline"
                >
                  Comprar créditos
                </Link>
              )}
            </div>
          </div>
        )}

        {!originalImage ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
            <div className="max-w-md mx-auto">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Sube una foto para restaurar
              </h2>
              <p className="text-gray-500 mb-6">
                Sube una foto antigua, dañada o decolorada y nuestra IA la
                restaurará automáticamente.
              </p>

              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full md:w-auto"
                >
                  Seleccionar Imagen
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <p className="text-xs text-gray-500">
                  Formatos soportados: JPG, PNG, WEBP. Tamaño máximo: 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Image preview and processing section */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Imagen a Restaurar</h2>
                <button
                  onClick={handleReset}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Cancelar"
                >
                  <X size={20} />
                </button>
              </div>

              {processedImage ? (
                <>
                  <div className="rounded-lg overflow-hidden mb-4">
                    <ComparisonSlider
                      beforeImage={originalImage}
                      afterImage={processedImage}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleDownload}>
                      <Download size={16} className="mr-2" />
                      Descargar Imagen Restaurada
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-auto max-h-[500px] object-contain"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Consumirá 1 crédito ({user?.credits || 0} disponibles)
                    </p>
                    <Button
                      onClick={handleProcessImage}
                      isLoading={isProcessing}
                      disabled={isProcessing || !user || user.credits <= 0}
                    >
                      {isProcessing ? 'Procesando...' : 'Restaurar Imagen'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tips section */}
        <div className="mt-8 bg-primary-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-3">
            Consejos para Mejores Resultados
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>
                Usa imágenes con la mayor resolución posible para obtener
                mejores resultados.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>
                Si la imagen tiene arrugas o dobleces, intenta escanearla en
                lugar de fotografiarla.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">•</span>
              <span>
                Para fotos muy antiguas o muy dañadas, es posible que necesites
                procesarla varias veces para obtener el mejor resultado.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
