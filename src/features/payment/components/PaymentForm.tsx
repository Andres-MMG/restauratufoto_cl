import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '../../../shared/components/ui/atoms/Button';
import { Input } from '../../../shared/components/ui/atoms/Input';
import { Plan } from '../../../pages/PricingPage';
import { formatCurrency } from '../../../shared/utils/helpers';

type PaymentFormProps = {
  plan: Plan;
  onSubmit: () => Promise<void>;
  isProcessing: boolean;
};

/**
 * Credit card payment form component
 */
export function PaymentForm({ plan, onSubmit, isProcessing }: PaymentFormProps) {
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Form errors
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardNameError, setCardNameError] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [cvcError, setCvcError] = useState('');
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and spaces
    const value = e.target.value.replace(/[^\d\s]/g, '');
    setCardNumber(value);
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    
    // Format as MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    setExpiry(value);
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate card number
    if (!cardNumber) {
      setCardNumberError('Número de tarjeta requerido');
      isValid = false;
    } else if (cardNumber.replace(/\s/g, '').length < 16) {
      setCardNumberError('Número de tarjeta inválido');
      isValid = false;
    } else {
      setCardNumberError('');
    }
    
    // Validate card name
    if (!cardName) {
      setCardNameError('Nombre requerido');
      isValid = false;
    } else {
      setCardNameError('');
    }
    
    // Validate expiry
    if (!expiry) {
      setExpiryError('Fecha requerida');
      isValid = false;
    } else if (expiry.length < 5) {
      setExpiryError('Fecha inválida');
      isValid = false;
    } else {
      setExpiryError('');
    }
    
    // Validate CVC
    if (!cvc) {
      setCvcError('CVC requerido');
      isValid = false;
    } else if (cvc.length < 3) {
      setCvcError('CVC inválido');
      isValid = false;
    } else {
      setCvcError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Número de Tarjeta"
        value={cardNumber}
        onChange={handleCardNumberChange}
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        error={cardNumberError}
      />
      
      <Input
        label="Nombre en la Tarjeta"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Juan Pérez"
        error={cardNameError}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fecha de Expiración"
          value={expiry}
          onChange={handleExpiryChange}
          placeholder="MM/YY"
          maxLength={5}
          error={expiryError}
        />
        
        <Input
          label="CVC"
          value={cvc}
          onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, ''))}
          placeholder="123"
          maxLength={4}
          error={cvcError}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full"
        isLoading={isProcessing}
      >
        <CreditCard size={16} className="mr-2" />
        Pagar {formatCurrency(plan.price)}
      </Button>
      
      <div className="text-xs text-gray-500 text-center">
        Transacción segura y encriptada. Tus datos están protegidos.
      </div>
    </form>
  );
}
