import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuthStore } from '../features/authentication/hooks/useAuthStore';

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, updateProfile, isLoading, error } = useAuthStore();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [fullNameError, setFullNameError] = useState('');

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setFullNameError('El nombre completo es requerido');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await updateProfile({ full_name: fullName.trim() });
    if (!error) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mi Perfil">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-error-50 p-3 rounded text-error-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User size={20} className="text-gray-500" />
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-sm text-gray-500">Correo electrónico</p>
          </div>
        </div>

        <Input
          label="Nombre Completo"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Tu nombre completo"
          error={fullNameError}
          autoComplete="name"
        />

        <div className="p-3 bg-primary-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-primary-900">
              Créditos disponibles
            </span>
            <span className="text-2xl font-bold text-primary-600">
              {user?.credits || 0}
            </span>
          </div>
          <p className="text-sm text-primary-700 mt-1">
            Cada crédito te permite restaurar una foto
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            <Save size={16} className="mr-2" />
            Guardar Cambios
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
