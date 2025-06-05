import React, { useState } from 'react';
import { Facebook, Github } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore';
import { isStrongPassword, isValidEmail } from '../lib/utils';

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
};

export function RegisterModal({ isOpen, onClose, onLoginClick }: RegisterModalProps) {
  const { register, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          error={emailError}
          autoComplete="email"
        />
        
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={passwordError}
          autoComplete="new-password"
        />
        
        <Input
          label="Confirmar Contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          error={confirmPasswordError}
          autoComplete="new-password"
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={isLoading}
        >
          Registrarse
        </Button>
        
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-2 text-sm text-gray-500 absolute">o continuar con</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="outline" className="w-full">
            <Facebook size={16} className="mr-2" />
            Facebook
          </Button>
          <Button type="button" variant="outline" className="w-full">
            <Github size={16} className="mr-2" />
            Google
          </Button>
        </div>
        
        <p className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
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