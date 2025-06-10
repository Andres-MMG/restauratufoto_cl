# RestauraTuFoto.cl Architecture

## Architectural Principles

This project follows modern React architectural principles:

1. **Feature-First Organization**: Code is organized by features rather than by technical concerns.
2. **Atomic Design**: UI components are organized using Atomic Design principles (atoms, molecules, organisms).
3. **Clean Architecture**: Separation of concerns with layers for UI, business logic, and data.

## Project Structure

### Core Directories

- `src/features/` - Feature-specific code
  - `authentication/` - User authentication
  - `payment/` - Payment processing and plans
  - `photo-restoration/` - Core photo restoration functionality
- `src/shared/` - Shared utilities and components
  - `components/` - Reusable UI components
  - `config/` - Configuration files (Supabase, etc.)
  - `utils/` - Utility functions
  - `hooks/` - Shared custom hooks
- `src/pages/` - Main application pages/routes

### Features

Each feature folder follows a consistent structure:

- `components/` - UI components specific to the feature
- `hooks/` - Custom React hooks for the feature
- `services/` - API interactions and business logic

### Shared UI Components

UI components follow Atomic Design methodology:

- `atoms/` - Basic building blocks (Button, Input)
- `molecules/` - Combinations of atoms (Modal, ComparisonSlider)
- `organisms/` - Complex UI components (BenefitsList, Testimonials)
- `layout/` - Page layout components (Header, Footer, MainLayout)

## State Management

State management uses Zustand with feature-specific stores:

- `useAuthStore` - Authentication state and methods
- `usePhotoRestoration` - Photo processing state and methods
- `useNotifications` - Notification system

## Data Flow

1. UI components dispatch actions via hooks
2. Hooks call service methods
3. Services interact with external APIs (Supabase)
4. Results flow back up to update state

## API Integration

Supabase is used for:
- Authentication
- Data storage
- Node.js functions for photo processing

## Future Improvements

- Implement server-side rendering for better SEO
- Add comprehensive error handling
- Improve loading states and skeleton screens
- Add comprehensive test coverage
