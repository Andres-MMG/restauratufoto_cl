# Photo Restoration App

Una aplicación web moderna para la restauración de fotografías usando React, TypeScript, Tailwind CSS y Supabase.

## Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Routing**: React Router 7
- **Estado**: Zustand 5
- **Backend**: Supabase 3.5
- **Construcción**: Vite 7
- **Testing**: Vitest 3.3
- **Animaciones**: Framer Motion 12, GSAP 3.13
- **Procesamiento de pagos**: Stripe 15
- **Utilidades**: clsx, tailwind-merge, sonner

## Instalación

```bash
# Instala todas las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev

# Construye la aplicación para producción
npm run build

# Previsualiza la build de producción
npm run preview
```

## Características

- Restauración automática de fotografías
- Sistema de autenticación de usuarios
- Procesamiento de pagos con Stripe
- Interfaz de usuario moderna y responsive
- Sistema de notificaciones
- Perfil de usuario personalizable

## Estructura del Proyecto

```
src/
  ├── features/            # Características principales
  │   ├── authentication/  # Autenticación de usuarios
  │   ├── payment/         # Procesamiento de pagos
  │   └── photo-restoration/ # Restauración de fotos
  ├── lib/                 # Bibliotecas y utilidades
  ├── pages/               # Páginas de la aplicación
  ├── shared/              # Componentes y utilidades compartidas
  │   ├── components/      # Componentes UI reutilizables
  │   ├── domain/          # Tipos y modelos de dominio
  │   ├── hooks/           # Custom hooks
  │   └── utils/           # Utilidades generales
  └── test/                # Pruebas
```

## Desarrollado con las últimas versiones (Julio 2025)

Este proyecto utiliza las versiones más recientes de todas las dependencias para garantizar un rendimiento óptimo y acceso a las características más modernas del ecosistema de React.
