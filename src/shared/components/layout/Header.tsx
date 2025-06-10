import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Image as ImageIcon, LogOut, User } from 'lucide-react';
import { Button } from '../ui/atoms/Button';
import { useAuthStore } from '../../../features/authentication/hooks/useAuthStore';
import { LoginModal } from '../../../features/authentication/components/LoginModal';
import { RegisterModal } from '../../../features/authentication/components/RegisterModal';

/**
 * Application header with responsive navigation and authentication controls
 */
export function Header() {
  const { isAuthenticated, credits, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    closeMenu();
  };
  
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    closeMenu();
  };
  
  const handleLogout = async () => {
    await logout();
    closeMenu();
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-primary-600 text-xl">
          <ImageIcon size={24} />
          <span>RestauraTuFoto.cl</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/app" className="text-gray-700 hover:text-primary-600">
                Restaurar Fotos
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary-600">
                Precios
              </Link>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-sm font-medium">Créditos: {credits}</span>
                <Link to="/pricing">
                  <Button size="sm" variant="outline">Comprar más</Button>
                </Link>
              </div>              <Link
                to="/profile"
                className="text-gray-700 hover:text-primary-600 flex items-center gap-1"
              >
                <User size={18} />
                <span>Mi Perfil</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-primary-600 flex items-center gap-1"
              >
                <LogOut size={18} />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="text-gray-700 hover:text-primary-600">
                Inicio
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary-600">
                Precios
              </Link>
              <Button variant="outline" onClick={openLoginModal}>
                Iniciar Sesión
              </Button>
              <Button onClick={openRegisterModal}>
                Registrarse
              </Button>
            </>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-slide-in">
          <div className="container py-4 flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/app" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={closeMenu}
                >
                  Restaurar Fotos
                </Link>
                <Link 
                  to="/pricing"
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={closeMenu}
                >
                  Precios
                </Link>
                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-sm font-medium">Créditos: {credits}</span>
                  <Link to="/pricing" onClick={closeMenu}>
                    <Button size="sm" variant="outline">Comprar más</Button>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 flex items-center gap-1 py-2 border-t"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={closeMenu}
                >
                  Inicio
                </Link>
                <Link 
                  to="/pricing"
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={closeMenu}
                >
                  Precios
                </Link>
                <div className="flex flex-col gap-2 mt-2 border-t pt-4">
                  <Button variant="outline" onClick={openLoginModal}>
                    Iniciar Sesión
                  </Button>
                  <Button onClick={openRegisterModal}>
                    Registrarse
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
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
    </header>
  );
}
