import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-emerald-700 to-emerald-500 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Descubre lo último</span>
                <span className="block text-emerald-200">en nuestra tienda</span>
              </h1>
              <p className="mt-3 text-base text-emerald-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Encuentra los mejores productos a precios increíbles. Calidad garantizada y envíos rápidos.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/products"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Ver productos <ArrowRight className="ml-2" size={20} />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/deals"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
                  >
                    Ofertas <ShoppingBag className="ml-2" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
          alt="Hero banner"
        />
      </div>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">
      <HeroBanner />

      {/* Featured Categories Mejorado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
          Explora por Categoría
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { name: 'Electrónica', icon: '📱', color: 'bg-blue-100', count: 42 },
            { name: 'Hogar', icon: '🏠', color: 'bg-yellow-100', count: 36 },
            { name: 'Moda', icon: '👗', color: 'bg-pink-100', count: 58 },
            { name: 'Deportes', icon: '⚽', color: 'bg-green-100', count: 27 }
          ].map((category, idx) => (
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              key={idx}
              className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-200"
            >
              <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 mx-auto ${category.color}`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 group-hover:text-emerald-700">
                {category.name}
              </h3>
              <p className="text-sm text-center text-gray-500 mt-1">{category.count} productos</p>
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition duration-300" />
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action solo si no está logueado */}
      {!isAuthenticated && (
        <div className="bg-emerald-50">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">¿Listo para comenzar?</span>
              <span className="block text-emerald-600">Regístrate hoy y obtén un 10% de descuento.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Crear cuenta
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-gray-50"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
