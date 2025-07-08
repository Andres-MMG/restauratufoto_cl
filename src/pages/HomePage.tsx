import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ComparisonSlider } from '../components/ComparisonSlider';
import { TrialUpload } from '../components/TrialUpload';
import { useAuthStore } from '../store/authStore';

export function HomePage() {
  const { register, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && password.trim()) {
      await register(email, password, name.trim());
    }
  };
  
  return (
    <div className="min-h-screen bg-primary-600">
      {/* Hero Section */}
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Restaura Tus Recuerdos
            </h1>
            <p className="text-gray-600">
              Devuelve la vida a tus fotos antiguas con IA.
            </p>
          </div>
          
          <div className="mb-8 rounded-lg overflow-hidden">
            <ComparisonSlider 
              beforeImage="https://images.pexels.com/photos/5967029/pexels-photo-5967029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              afterImage="https://images.pexels.com/photos/2781760/pexels-photo-2781760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              autoSlide={true}
            />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              ¿Quieres probar? Sube tu primera foto GRATIS:
            </p>
            <TrialUpload />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
              className="bg-gray-50"
            />
            
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              className="bg-gray-50"
            />
            
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crea una contraseña"
              className="bg-gray-50"
            />
            
            <Button 
              type="submit" 
              className="w-full bg-primary-600 hover:bg-primary-700"
              isLoading={isLoading}
            >
              Crear Cuenta Gratis
            </Button>
            
            <div className="relative text-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <span className="relative bg-white px-4 text-sm text-gray-500">
                O continúa con
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button type="button" variant="outline" className="w-full">
                <span className="text-2xl">G</span>
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <span className="text-2xl">f</span>
              </Button>
              <Button type="button" variant="outline" className="w-full">
                <Github className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-600 mt-6">
              ¿Ya tienes cuenta?{" "}
              <button 
                type="button"
                className="text-primary-600 hover:underline font-medium"
                onClick={() => {}}
              >
                Inicia Sesión
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* How it Works Section */}
      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Sube tu Foto</h3>
              <p className="text-gray-600">Selecciona la foto que deseas restaurar</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">IA en Acción</h3>
              <p className="text-gray-600">Nuestra IA restaura tu foto automáticamente</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Descarga</h3>
              <p className="text-gray-600">Obtén tu foto restaurada en alta calidad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Ejemplos Impresionantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <ComparisonSlider 
                beforeImage="https://images.pexels.com/photos/2447042/pexels-photo-2447042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                afterImage="https://images.pexels.com/photos/2382665/pexels-photo-2382665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold">Foto Familiar de 1965</h3>
                <p className="text-sm text-gray-600">Restaurada a su gloria original</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <ComparisonSlider 
                beforeImage="https://images.pexels.com/photos/5967029/pexels-photo-5967029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                afterImage="https://images.pexels.com/photos/2781760/pexels-photo-2781760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              />
              <div className="p-4 bg-white">
                <h3 className="font-semibold">Retrato Antiguo</h3>
                <p className="text-sm text-gray-600">Colores y detalles recuperados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por Qué Elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Superior</h3>
              <p className="text-gray-600">Resultados profesionales garantizados</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Súper Rápido</h3>
              <p className="text-gray-600">Resultados en segundos, no en días</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-gray-600">Tus fotos están protegidas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Lo Que Dicen Nuestros Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-warning-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"Increíble servicio. Restauré fotos de mis abuelos que creía perdidas."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">María García</p>
                  <p className="text-sm text-gray-500">Cliente Verificada</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-warning-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"La calidad es impresionante. Mis fotos familiares lucen como nuevas."</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Carlos Ruiz</p>
                  <p className="text-sm text-gray-500">Cliente Verificado</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-warning-500 mb-4">★★★★★</div>
              <p className="text-gray-600 mb-4">"Rápido, fácil y los resultados son espectaculares. ¡Muy recomendado!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Ana Martínez</p>
                  <p className="text-sm text-gray-500">Cliente Verificada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Planes Simples y Transparentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary-500 transition-all">
              <h3 className="text-xl font-semibold mb-2">Foto Individual</h3>
              <p className="text-4xl font-bold mb-4">$1.90</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  1 foto en alta calidad
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Descarga inmediata
                </li>
              </ul>
              <Button variant="outline" className="w-full">Elegir Plan</Button>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-primary-500 shadow-xl relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">Más Popular</div>
              <h3 className="text-xl font-semibold mb-2">Paquete de 10</h3>
              <p className="text-4xl font-bold mb-4">$9.90</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  10 fotos en alta calidad
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Solo $0.99 por foto
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Soporte prioritario
                </li>
              </ul>
              <Button className="w-full">Elegir Plan</Button>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:border-primary-500 transition-all">
              <h3 className="text-xl font-semibold mb-2">Suscripción</h3>
              <p className="text-4xl font-bold mb-4">$19.90</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Fotos ilimitadas
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Máxima prioridad
                </li>
                <li className="flex items-center">
                  <span className="text-accent-500 mr-2">✓</span>
                  Soporte 24/7
                </li>
              </ul>
              <Button variant="outline" className="w-full">Elegir Plan</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para restaurar tus recuerdos?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de personas que ya han recuperado sus fotos más valiosas
          </p>
          <Button size="lg" className="bg-white text-primary-900 hover:bg-gray-100">
            Comenzar Ahora
          </Button>
        </div>
      </section>
    </div>
  );
}