import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, X, Download, AlertCircle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { ComparisonSlider } from '../../../shared/components/ui/molecules/ComparisonSlider';
import { useAuthStore } from '../../authentication/hooks/useAuthStore';
import { delay } from '../../../shared/utils';
import { generateProcessedImageUrl } from '../services/imageProcessing';

/**
 * Photo restoration component for authenticated users to restore photos
 */
export function PhotoRestoration() {
  const { credits, consumeCredit } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check if user has credits
    if (credits <= 0) {
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

    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setProcessedImage(null);
  };

  const handleProcessImage = async () => {
    if (!originalImage || isProcessing) return;

    // Check credits again before processing
    if (credits <= 0) {
      setError(
        'No tienes créditos suficientes. Por favor, compra más para continuar.'
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Use a credit for processing
      const success = consumeCredit();

      if (!success) {
        setError('Error al usar crédito. Por favor, intenta de nuevo.');
        setIsProcessing(false);
        return;
      }

      // Simulate processing delay
      await delay(2000);

      // In a real implementation, you would send the image to your API
      const processedUrl = generateProcessedImageUrl(originalImage);
      setProcessedImage(processedUrl);
    } catch {
      setError('Error al procesar la imagen. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'restored-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Restaurar Fotografía</h1>

            <div className="flex items-center justify-between mb-6">
              <div className="text-sm font-medium">
                <span className="text-gray-500">Créditos disponibles:</span>{' '}
                <span className="text-primary-600">{credits}</span>
              </div>

              <Link to="/pricing">
                <Button variant="outline" size="sm">
                  Comprar Más
                </Button>
              </Link>
            </div>

            {error && (
              <div className="mb-6 bg-error-50 p-4 rounded-lg flex items-start gap-3 text-error-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="font-medium text-lg">Imagen Original</h2>

                {originalImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={originalImage}
                      alt="Original"
                      className="w-full h-64 object-contain bg-gray-100"
                    />
                    <button
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      onClick={() => setOriginalImage(null)}
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors h-64 flex flex-col items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Arrastra tu foto o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG o WEBP (máx. 10MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="font-medium text-lg">Imagen Restaurada</h2>

                {processedImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full h-64 object-contain bg-gray-100"
                    />
                    <button
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      onClick={() => handleDownload()}
                      aria-label="Download"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg h-64 bg-gray-50 flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500">
                      {originalImage
                        ? 'Haz clic en "Restaurar" para procesar la imagen'
                        : 'Sube una imagen para empezar'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {processedImage && (
              <div className="mt-8">
                <h3 className="font-medium text-lg mb-4">Comparación</h3>
                <ComparisonSlider
                  beforeImage={originalImage!}
                  afterImage={processedImage}
                  className="h-80 rounded-lg overflow-hidden border border-gray-200"
                />
              </div>
            )}

            <div className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOriginalImage(null);
                    setProcessedImage(null);
                  }}
                  className="flex-1"
                >
                  Limpiar
                </Button>

                <Button
                  onClick={handleProcessImage}
                  disabled={!originalImage || isProcessing || credits <= 0}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  {processedImage ? 'Restaurar de Nuevo' : 'Restaurar Imagen'}
                </Button>

                {processedImage && (
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
