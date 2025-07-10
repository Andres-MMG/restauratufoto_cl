import { Plan } from './shared/domain/types';

export const stripeProducts: Plan[] = [
  {
    id: 'prod_SdDZHj2WxdEGhk',
    priceId: 'price_1Rhx8jCh9fXxDoBAMfjtb52f',
    name: 'Membresía Club Restaurador',
    description:
      '¡La mejor relación calidad-precio para nuestros miembros! Con tu suscripción al Club Restaurador, cada mes recibes **5 generaciones de fotos completamente gratis**. Una vez que uses tus créditos, desbloqueas nuestro precio más bajo y cada restauración adicional te costará solo **$0.15**. Además, todos tus proyectos tendrán siempre la máxima prioridad y contarás con soporte 24/7.',
    price: 9.9,
    mode: 'subscription' as const,
    credits: 5,
    popular: true,
    features: [
      '5 fotos gratis cada mes',
      'Fotos adicionales a solo $0.15',
      'Máxima prioridad',
      'Soporte 24/7',
      'Actualizaciones mensuales',
    ],
  },
  {
    id: 'prod_SdCuEpH8kMRzPF',
    priceId: 'price_1RhwV0Ch9fXxDoBAZZaFGCgo',
    name: 'Paquete de 10 Restauraciones',
    description:
      'La solución perfecta para colecciones familiares o proyectos grandes. Restaura 10 de tus fotos y recíbelas en alta calidad. Con este paquete, cada foto te cuesta solo $0.99 e incluye soporte prioritario para atender tus solicitudes con la mayor rapidez.',
    price: 9.9,
    mode: 'payment' as const,
    credits: 10,
    features: [
      '10 fotos en alta resolución',
      'Solo $0.99 por foto',
      'Soporte prioritario',
      'Descarga inmediata',
    ],
  },
  {
    id: 'prod_SdCmiJ4mZsxurd',
    priceId: 'price_1RhwMUCh9fXxDoBAM5kWzRyI',
    name: 'Restauración de Foto Individual',
    description:
      'Ideal para recuperar ese recuerdo especial. Este servicio incluye la restauración completa de una fotografía, la cual se entrega en alta calidad y está disponible para su descarga inmediata una vez completado el proceso.',
    price: 1.9,
    mode: 'payment' as const,
    credits: 1,
    features: [
      '1 foto en alta resolución',
      'Descarga inmediata',
      'Soporte por email',
    ],
  },
  {
    id: 'prod_SdCXp9vnNRbChw',
    priceId: 'price_1Rhw8SCh9fXxDoBAYP4JSIV9',
    name: 'Oferta de Bienvenida: Restauración de Foto',
    description:
      'Oferta especial para nuevos usuarios. El servicio incluye la restauración completa de una fotografía: reparación de daños, colorización y mejora a alta resolución. Válido para una imagen.',
    price: 1.0,
    mode: 'payment' as const,
    credits: 1,
    features: [
      '1 foto en alta resolución',
      'Oferta especial para nuevos usuarios',
      'Descarga inmediata',
      'Soporte por email',
    ],
  },
] as const;

export type StripeProduct = (typeof stripeProducts)[number];
