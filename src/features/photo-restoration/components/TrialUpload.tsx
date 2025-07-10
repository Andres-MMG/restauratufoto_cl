import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { Input } from '../../../shared/components/ui/atoms/Input';
import { ComparisonSlider } from '../../../shared/components/ui/molecules/ComparisonSlider';
import { isValidEmail, delay } from '../../../shared/utils';
import { generateProcessedImageUrl } from '../services/imageProcessing';

/**
 * TrialUpload component for processing a sample photo without authentication
 */
export function TrialUpload() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOffer, setShowOffer] = useState(false);

  // Email verification states
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setProcessedImage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessImage = async () => {
    if (!originalImage || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate processing delay
      await delay(2000);

      // In a real implementation, you would send the image to your API
      const processedUrl = generateProcessedImageUrl(originalImage);
      setProcessedImage(processedUrl);
      setShowOffer(true);
    } catch {
      setError('Error al procesar la imagen. Por favor, intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!email || !isValidEmail(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setIsEmailSubmitting(true);
    setError(null);

    try {
      // Simulate API call to send verification email
      await delay(1500);

      // In a real implementation, you would call your API to send a verification code
      setIsEmailSent(true);
    } catch {
      setError(
        'Error al enviar el correo electrónico. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode) {
      setError('Por favor, ingresa el código de verificación.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Simulate API call to verify code
      await delay(1500);

      // In a real implementation, you would call your API to verify the code
      if (verificationCode === '1234') {
        setIsVerified(true);
      } else {
        setError(
          'Código de verificación inválido. Por favor, intenta de nuevo.'
        );
      }
    } catch {
      setError('Error al verificar el código. Por favor, intenta de nuevo.');
    } finally {
      setIsVerifying(false);
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
    <div className="w-full">
      {!originalImage ? (
        // Upload section
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Sube una foto para probar
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG o WEBP (máx. 10MB)
          </p>
          <Button variant="secondary" className="mt-4">
            Seleccionar Archivo
          </Button>
        </div>
      ) : (
        // Image preview and processing section
        <div>
          {error && (
            <div className="mb-4 bg-error-50 p-3 rounded-lg flex items-start gap-2 text-sm text-error-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {processedImage ? (
            // Show comparison after processing
            <>
              <div className="mb-4">
                <ComparisonSlider
                  beforeImage={originalImage}
                  afterImage={processedImage}
                  className="h-64 md:h-80 rounded-lg overflow-hidden"
                />
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOriginalImage(null);
                    setProcessedImage(null);
                    setShowOffer(false);
                    setSelectedFile(null);
                  }}
                >
                  Probar otra imagen
                </Button>
                <Button onClick={handleDownload}>Descargar Resultado</Button>
              </div>

              {showOffer && (
                <div className="mt-8 bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary-900">
                    ¿Quieres restaurar más fotos?
                  </h3>
                  <p className="text-sm text-primary-800 mt-1">
                    Regístrate y obtén créditos para restaurar todas tus fotos
                    antiguas.
                  </p>

                  {!isEmailSent ? (
                    <div className="mt-3">
                      <Input
                        placeholder="Ingresa tu correo electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                      <Button
                        className="w-full mt-2"
                        onClick={handleSendVerificationEmail}
                        isLoading={isEmailSubmitting}
                      >
                        Obtener código de verificación
                      </Button>
                    </div>
                  ) : !isVerified ? (
                    <div className="mt-3">
                      <Input
                        placeholder="Ingresa el código (usa 1234 para probar)"
                        value={verificationCode}
                        onChange={e => setVerificationCode(e.target.value)}
                      />
                      <Button
                        className="w-full mt-2"
                        onClick={handleVerifyEmail}
                        isLoading={isVerifying}
                      >
                        Verificar
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <p className="text-sm text-green-600 mb-2">
                        ¡Email verificado! Continúa para obtener tus créditos.
                      </p>
                      <Button className="w-full">
                        Continuar <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            // Show original image before processing
            <>
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-64 md:h-80 object-contain bg-black"
                />
              </div>

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOriginalImage(null);
                    setSelectedFile(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleProcessImage} isLoading={isProcessing}>
                  Restaurar Foto
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
