import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
            <div className="sm:text-center lg:text-left">
              {/* Badge destacado */}
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold shadow-lg">
                <Sparkles className="mr-2" size={16} />
                Nuevas colecciones 2025
              </div>
              
              <h1 className="text-4xl tracking-tight font-bold text-white sm:text-5xl md:text-6xl">
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Eleva tu estilo
                </span>
                <span className="block text-yellow-400 mt-2">con lo mejor</span>
              </h1>
              <p className="mt-4 text-lg text-blue-100 sm:mt-5 sm:text-xl sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                Descubre productos exclusivos con calidad premium. 
                <span className="block mt-1 font-semibold text-yellow-300">Envío gratis en tu primera compra</span>
              </p>

              {/* Ratings */}
              <div className="mt-6 flex items-center lg:justify-start justify-center">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} size={20} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-blue-100 font-medium">4.9/5 · +10,000 clientes satisfechos</span>
              </div>

              <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/products"
                  className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explorar Colección
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  to="/deals"
                  className="group w-full sm:w-auto flex items-center justify-center px-8 py-4 border-2 border-yellow-400 text-base font-semibold rounded-xl text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-purple-900 transition-all duration-200"
                >
                  Ofertas Flash
                  <ShoppingBag className="ml-2 group-hover:scale-110 transition-transform" size={20} />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Modern shopping experience"
        />
        {/* Overlay para mejor contraste */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-purple-900 lg:bg-gradient-to-r lg:from-transparent lg:to-purple-900 mix-blend-multiply"></div>
      </div>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <HeroBanner />

      {/* Featured Categories - Rediseñado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Categorías Destacadas
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora nuestras colecciones cuidadosamente seleccionadas para cada aspecto de tu vida
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              name: 'Tecnología', 
              icon: '🚀', 
              gradient: 'from-blue-500 to-cyan-500',
              bgGradient: 'from-blue-50 to-cyan-50',
              count: 89,
              description: 'Lo último en gadgets'
            },
            { 
              name: 'Hogar & Vida', 
              icon: '🏡', 
              gradient: 'from-green-500 to-emerald-500',
              bgGradient: 'from-green-50 to-emerald-50',
              count: 67,
              description: 'Haz tu espacio único'
            },
            { 
              name: 'Moda', 
              icon: '👗', 
              gradient: 'from-pink-500 to-rose-500',
              bgGradient: 'from-pink-50 to-rose-50',
              count: 124,
              description: 'Estilo que inspira'
            },
            { 
              name: 'Bienestar', 
              icon: '💪', 
              gradient: 'from-orange-500 to-red-500',
              bgGradient: 'from-orange-50 to-red-50',
              count: 53,
              description: 'Cuida de ti mismo'
            }
          ].map((category, idx) => (
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              key={idx}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl mb-4 mx-auto bg-gradient-to-r ${category.gradient} text-white shadow-lg`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-center text-gray-500 mb-3">{category.description}</p>
                <div className="flex justify-center items-center">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {category.count} productos
                  </span>
                </div>
              </div>
              
              {/* Efecto de borde gradiente */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}>
                <div className="absolute inset-[2px] rounded-2xl bg-white"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action - Rediseñado */}
      {!isAuthenticated && (
        <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full -translate-y-16 translate-x-16 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 rounded-full -translate-x-12 translate-y-12 opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  <span className="block">Únete a nuestra comunidad</span>
                  <span className="block text-yellow-400 mt-2">
                    Y recibe un 15% de descuento inmediato
                  </span>
                </h2>
                <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                  Además, disfruta de envío gratis en tu primer pedido y acceso a ofertas exclusivas para miembros.
                </p>
              </div>
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-purple-900 bg-yellow-400 hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Crear cuenta gratis
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-yellow-400 text-base font-semibold rounded-xl text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-purple-900 transition-all duration-200"
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