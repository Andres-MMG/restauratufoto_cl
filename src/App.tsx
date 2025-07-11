import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/shared/components/layout/Header';
import { Footer } from '@/shared/components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AppPage } from './pages/AppPage';
import { PricingPage } from './pages/PricingPage';
import { SuccessPage } from './pages/SuccessPage';
import { AuthPage } from './pages/AuthPage';
import { useAuthStore } from '@/features/authentication/hooks/useAuthStore';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Component to clear errors on route changes
const ErrorCleaner = () => {
  const location = useLocation();
  const { clearError } = useAuthStore();

  useEffect(() => {
    // Limpiar errores cada vez que cambie ruta o búsqueda de query
    clearError();
  }, [location.pathname, location.search, clearError]);

  return null;
};

function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    // Check if the user is already logged in
    checkSession();
  }, [checkSession]);

  return (
    <Router>
      <ErrorCleaner />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <SuccessPage />
                </ProtectedRoute>
              }
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
