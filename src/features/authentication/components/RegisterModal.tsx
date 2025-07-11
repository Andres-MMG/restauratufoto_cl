import React, { useState, useEffect } from 'react';
// Removed unused icon imports
import { Modal } from '../../../shared/components/ui/molecules/Modal';
import { Input } from '../../../shared/components/ui/atoms/Input';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { useAuthStore } from '../hooks/useAuthStore';
import { isStrongPassword, isValidEmail } from '../../../shared/utils';
import { SocialAuthButtons } from './SocialAuthButtons';

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
};

/**
 * Registration modal component with form validation
 */
export function RegisterModal({
  isOpen,
  onClose,
  onLoginClick,
}: RegisterModalProps) {
  const { register, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Limpiar errores y campos cuando se abre o cierra el modal
  useEffect(() => {
    if (isOpen) {
      // Limpiar cuando se abre
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setEmailError('');
      setPasswordError('');
      setConfirmPasswordError('');
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
    } else if (!isStrongPassword(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirme su contraseña');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await register(email, password);
    if (!error) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Cuenta">
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
          autoComplete="new-password"
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={confirmPasswordError}
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Registrarse
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
          ¿Ya tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-primary-600 hover:underline font-medium"
          >
            Inicia Sesión
          </button>
        </p>
      </form>
    </Modal>
  );
}
