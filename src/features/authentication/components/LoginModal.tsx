import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/ui/molecules/Modal';
import { Input } from '../../../shared/components/ui/atoms/Input';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { useAuthStore } from '../hooks/useAuthStore';
import { isValidEmail } from '../../../shared/utils';
// Removed supabase import; using SocialAuthButtons for social login
import { SocialAuthButtons } from './SocialAuthButtons';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
};

/**
 * Login modal component with form validation
 */
export function LoginModal({
  isOpen,
  onClose,
  onRegisterClick,
}: LoginModalProps) {
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Limpiar errores y campos cuando se abre o cierra el modal
  useEffect(() => {
    if (isOpen) {
      // Limpiar cuando se abre
      setEmail('');
      setPassword('');
      setEmailError('');
      setPasswordError('');
      clearError();
    } else {
      // Limpiar cuando se cierra
      clearError();
    }
  }, [isOpen, clearError]);

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('El correo electrónico es requerido');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Ingrese un correo electrónico válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await login(email, password);
    if (!error) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-error-50 p-3 rounded text-error-600 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Correo Electrónico"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          error={emailError}
          autoComplete="email"
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          error={passwordError}
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Iniciar Sesión
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-2 text-sm text-gray-500 absolute">
            o continuar con
          </span>
        </div>

        <div className="mt-4">
          <SocialAuthButtons />
        </div>

        <p className="text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-primary-600 hover:underline font-medium"
          >
            Regístrate
          </button>
        </p>
      </form>
    </Modal>
  );
}
