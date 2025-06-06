import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

/**
 * Site footer with navigation links and social media
 */
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-white text-xl mb-4">
              <ImageIcon size={24} />
              <span>RestauraTuFoto.cl</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Restaura tus fotos antiguas y dañadas con nuestra tecnología de inteligencia artificial.
              Devuelve la vida a tus recuerdos más preciados.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:info@restauratufoto.cl" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Precios</Link></li>
              <li><Link to="/app" className="text-gray-400 hover:text-white transition-colors">Restaurar Fotos</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Términos de Servicio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Política de Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} RestauraTuFoto.cl. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
