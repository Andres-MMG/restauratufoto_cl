import React, { useState } from 'react';
import { Github } from 'lucide-react';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { Input } from '../../../shared/components/ui/atoms/Input';
import { useAuthStore } from '../hooks/useAuthStore';

/**
 * Registration form component to be used on the homepage
 */
export function RegisterForm() {
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8">
      <Input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Tu nombre completo"
        className="bg-gray-50"
      />

      <Input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Tu correo electrónico"
        className="bg-gray-50"
      />

      <Input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Crea una contraseña"
        className="bg-gray-50"
      />

      <Button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700"
        isLoading={isLoading}
      >
        Crear Cuenta Gratis
      </Button>

      <div className="relative text-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <span className="relative bg-white px-4 text-sm text-gray-500">
          O continúa con
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button type="button" variant="outline" className="w-full">
          <span className="text-2xl">G</span>
        </Button>
        <Button type="button" variant="outline" className="w-full">
          <span className="text-2xl">f</span>
        </Button>
        <Button type="button" variant="outline" className="w-full">
          <Github className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          className="text-primary-600 hover:underline font-medium"
          onClick={() => {}}
        >
          Inicia Sesión
        </button>
      </p>
    </form>
  );
}
