import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { delay, formatCurrency } from '../lib/utils';

type Plan = {
  id: string;
  name: string;
  price: number;
  credits: number;
};

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addCredits } = useAuthStore();
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
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
  
  useEffect(() => {
    // Get plan from location state
    const planData = location.state?.plan;
    
    if (!planData) {
      navigate('/pricing');
      return;
    }
    
    setPlan(planData);
  }, [location, navigate]);
  
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
    
    if (!plan) return;
    
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await delay(2000);
      
      // Add credits to user account
      addCredits(plan.credits);
      
      setIsComplete(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/app');
      }, 3000);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!plan) return null;
  
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-3xl">
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver a Planes
        </button>
        
        {!isComplete ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-gray-50 border-b">
              <h1 className="text-2xl font-bold">Completar Compra</h1>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Resumen del Pedido</h2>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{plan.name}</span>
                      <span>{formatCurrency(plan.price)}</span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {plan.id === 'single' ? '1 crédito' : 
                       plan.id === 'pack' ? '10 créditos' : 
                       'Créditos ilimitados (mensual)'}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(plan.price)}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">
                      Métodos de pago aceptados:
                    </p>
                    <div className="flex gap-2">
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs">Visa</div>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs">Mastercard</div>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs">American Express</div>
                      <div className="bg-gray-100 px-2 py-1 rounded text-xs">PayPal</div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Form */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Información de Pago</h2>
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} className="text-accent-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Pago Completado!</h1>
            <p className="text-gray-600 mb-6">
              Tu compra de {plan.name} ha sido procesada correctamente.
              {plan.id !== 'subscription' && ` Se han añadido ${plan.credits} créditos a tu cuenta.`}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Serás redirigido automáticamente en unos segundos...
            </p>
            <Button onClick={() => navigate('/app')}>
              Ir a la Aplicación
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}