import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ComparisonSlider } from './ComparisonSlider';
import { generateProcessedImageUrl, delay, isValidEmail } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export function TrialUpload() {
  const { user } = useAuthStore();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si el usuario ya está autenticado y ya usó el trial
    if (user && user.trial_used) {
      setError(
        'Ya has usado tu prueba gratuita. Por favor, compra créditos para continuar.'
      );
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor, ingresa un email válido.');
      return;
    }

    setIsEmailSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setIsEmailSent(true);
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError(
        'Error al enviar el código de verificación. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode) {
      setError('Por favor, ingresa el código de verificación.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Here you would verify the code with your backend
      await delay(1000); // Simulated verification

      // Marcar trial como usado si el usuario está autenticado
      if (user) {
        await supabase.rpc('mark_trial_used', { user_id: user.id });
      }

      setIsVerified(true);

      // If file was already selected, process it
      if (selectedFile) {
        await processImage(selectedFile);
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Código inválido. Por favor, intenta de nuevo.');
    } finally {
      setIsVerifying(false);
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);

      // Simulate processing delay
      await delay(2000);
      const processedImageUrl = generateProcessedImageUrl();
      setProcessedImage(processedImageUrl);
      setShowOffer(true);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Ha ocurrido un error al procesar la imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      {!isEmailSent ? (
        <div className="space-y-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full md:w-auto mb-4"
          >
            <Upload className="w-4 h-4 mr-2" />
            Probar Gratis
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          {selectedFile && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                disabled={isEmailSubmitting}
              />
              <Button
                type="submit"
                className="w-full"
                isLoading={isEmailSubmitting}
              >
                Enviar Código de Verificación
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}
        </div>
      ) : !isVerified ? (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <p className="text-sm text-gray-600">
            Hemos enviado un código de verificación a {email}
          </p>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Código de verificación"
            disabled={isVerifying}
          />
          <Button type="submit" className="w-full" isLoading={isVerifying}>
            Verificar Código
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 text-error-600 bg-error-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isProcessing ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Procesando tu imagen...</p>
            </div>
          ) : processedImage ? (
            <>
              <div className="rounded-lg overflow-hidden">
                <ComparisonSlider
                  beforeImage={originalImage!}
                  afterImage={processedImage}
                />
              </div>

              {showOffer && (
                <div className="bg-accent-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-accent-900 mb-2">
                    ¡Oferta Especial!
                  </h3>
                  <p className="text-accent-800 mb-4">
                    Por solo $1 USD, obtén esta foto restaurada y 2
                    restauraciones adicionales. ¡Oferta única por tiempo
                    limitado!
                  </p>
                  <Button className="w-full bg-accent-600 hover:bg-accent-700">
                    Obtener 3 Fotos por $1
                  </Button>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
