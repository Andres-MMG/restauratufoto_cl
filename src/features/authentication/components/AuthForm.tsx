import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { Input } from '../../../shared/components/ui/atoms/Input';
import { SocialAuthButtons } from './SocialAuthButtons';

/**
 * Componente de autenticación que combina login y registro
 */
export function AuthForm() {
  const { login, register, isLoading, error } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Leer el modo desde los parámetros de consulta
  const mode = searchParams.get('mode');
  const shouldBeLogin = mode === 'register' ? false : true;

  const [isLogin, setIsLogin] = useState(shouldBeLogin);

  // Actualizar el estado cuando cambien los parámetros de consulta
  useEffect(() => {
    setIsLogin(shouldBeLogin);
    // Limpiar campos y errores cuando se cambie de modo
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  }, [shouldBeLogin]);

  // Estados para formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para errores
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Validación de formulario
  const validateForm = () => {
    let isValid = true;

    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email inválido');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validar password
    if (!password || password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validar confirmación de contraseña (solo para registro)
    if (!isLogin) {
      if (password !== confirmPassword) {
        setConfirmPasswordError('Las contraseñas no coinciden');
        isValid = false;
      } else {
        setConfirmPasswordError('');
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        console.log('Intentando iniciar sesión con:', { email });
        await login(email, password);
      } else {
        console.log('Intentando registrar usuario:', { email, name });
        await register(email, password);
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      {error && (
        <div
          className={`mb-4 p-3 rounded-md border ${
            error.includes('exitosamente') || error.includes('enviado')
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre completo
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={emailError}
          />
        </div>

        <div className={isLogin ? 'mb-6' : 'mb-4'}>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={passwordError}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full mb-4" disabled={isLoading}>
          {isLoading
            ? 'Procesando...'
            : isLogin
              ? 'Iniciar Sesión'
              : 'Crear Cuenta'}
        </Button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() =>
            navigate(isLogin ? '/auth?mode=register' : '/auth?mode=login')
          }
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isLogin
            ? '¿No tienes cuenta? Regístrate'
            : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>
        <div className="mt-6">
          {/* Unified social auth buttons including Google, Facebook, GitHub */}
          <SocialAuthButtons providers={['google', 'facebook']} />
        </div>
      </div>
    </div>
  );
}
