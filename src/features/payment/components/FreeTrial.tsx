import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { useAuthStore } from '../../authentication/hooks/useAuthStore';
import { LoginModal } from '../../authentication/components/LoginModal';
import { RegisterModal } from '../../authentication/components/RegisterModal';

type FreeTrialProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
};

/**
 * Free trial component for offering a free credit
 */
export function FreeTrial({
  title = "¿No estás seguro? Prueba gratis",
  description = "Obtén 1 crédito gratis para probar nuestro servicio sin compromiso.",
  buttonText = "Prueba Gratuita",
  className = ""
}: FreeTrialProps) {
  const { isAuthenticated, addCredits } = useAuthStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleFreeTrial = () => {
    if (!isAuthenticated) {
      setIsRegisterModalOpen(true);
      return;
    }
    
    // Add 1 free credit and navigate to app
    addCredits(1);
    navigate('/app');
  };

  return (
    <>
      <div className={`p-6 bg-primary-50 rounded-lg text-center ${className}`}>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Button onClick={handleFreeTrial}>
          {buttonText}
        </Button>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onRegisterClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onLoginClick={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
}
