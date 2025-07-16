import { Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/atoms/Button';
import { stripeProducts, type StripeProduct } from '@/stripe-config';
import { useAuthStore } from '@/features/authentication/stores/authStore';
import 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';

interface PricingCardsProps {
  onSelect: (product: StripeProduct) => void;
  isLoading: boolean;
}

export function PricingCards({ onSelect, isLoading }: PricingCardsProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto h-[34rem] overflow-x-hidden overflow-y-visible pt-4">
      <Swiper
        navigation={true}
        centeredSlides={false}
        breakpoints={{
          320: { slidesPerView: 1.3, spaceBetween: 20 },
          640: { slidesPerView: 2.3, spaceBetween: 20 },
          768: { slidesPerView: 2.5, spaceBetween: 20 },
          1024: { slidesPerView: 3.3, spaceBetween: 20 },
        }}
        className="
          h-full overflow-x-hidden overflow-y-visible
          [&_.swiper-button-next]:bg-gray-200
          [&_.swiper-button-prev]:bg-gray-200
          [&_.swiper-button-next]:text-primary-900
          [&_.swiper-button-prev]:text-primary-900
          [&_.swiper-button-next]:rounded-full
          [&_.swiper-button-prev]:rounded-full
          [&_.swiper-button-next]:w-12
          [&_.swiper-button-prev]:w-12
          [&_.swiper-button-next]:h-12
          [&_.swiper-button-prev]:h-12
          [&_.swiper-button-next]:shadow-lg
          [&_.swiper-button-prev]:shadow-lg
          [&_.swiper-button-next::after]:text-[2rem]
          [&_.swiper-button-prev::after]:text-[2rem]
        "
      >
        {stripeProducts.map(product => (
          <SwiperSlide key={product.id} className="h-full flex pt-4">
            <div
              className={`
              pricing-card
              overflow-visible
              relative
              h-full
              flex flex-col
              justify-between
              ${product.popular ? 'pricing-card-popular' : ''}
            `}
            >
              {product.popular && (
                <span
                  className="
                  absolute
                  -top-3
                  left-1/2
                  transform -translate-x-1/2
                  bg-primary-900 text-white
                  px-3 py-1 rounded-full
                  text-sm font-medium z-20
                "
                >
                  Más Popular
                </span>
              )}
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-4xl font-bold mb-1">
                ${product.price.toFixed(2)}
              </p>
              {product.mode === 'subscription' && (
                <p className="text-sm text-gray-500 mb-4">Mensual</p>
              )}
              {product.mode === 'payment' && (
                <p className="text-sm text-gray-500 mb-4">Pago único</p>
              )}
              <ul className="flex-grow space-y-3 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      size={18}
                      className="text-accent-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={product.popular ? 'primary' : 'outline'}
                onClick={() => onSelect(product)}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isAuthenticated ? 'Seleccionar' : 'Registrarse'}
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
