import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../features/authentication/hooks/useAuthStore';
import { PaymentForm } from '../features/payment/components/PaymentForm';
import { OrderSummary } from '../features/payment/components/OrderSummary';
import { PaymentSuccess } from '../features/payment/components/PaymentSuccess';
import { type StripeProduct } from '../stripe-config';
import { delay } from '../shared/utils';

/**
 * Payment page for processing purchases
 */
export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addCredits } = useAuthStore();

  const [plan, setPlan] = useState<StripeProduct | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Get plan from location state
    const planData = location.state?.plan;

    if (!planData) {
      navigate('/pricing');
      return;
    }

    setPlan(planData);
  }, [location, navigate]);

  const handleSubmit = async () => {
    if (!plan) return;

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

  const handleContinue = () => {
    navigate('/app');
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
                <OrderSummary plan={plan} />

                {/* Payment Form */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Información de Pago
                  </h2>
                  <PaymentForm
                    plan={plan}
                    onSubmit={handleSubmit}
                    isProcessing={isProcessing}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PaymentSuccess plan={plan} onContinue={handleContinue} />
        )}
      </div>
    </div>
  );
}
