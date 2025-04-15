import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-emerald-200 py-24 px-4">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between">
        <div className="text-left md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 leading-tight">
            Descubre productos excepcionales
          </h1>
          <p className="mt-4 text-lg text-emerald-700 mb-8">
            Explora nuestra colección de artículos de alta calidad seleccionados para ti
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/products" 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ShoppingBag size={20} />
              Comprar ahora
            </Link>
            <Link 
              to="/categories" 
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-emerald-700 px-6 py-3 rounded-lg font-medium border border-emerald-600 transition-colors"
            >
              Explorar categorías
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-2 max-w-sm">
            <div className="bg-emerald-100 rounded p-8 flex items-center justify-center">
              <ShoppingBag size={120} className="text-emerald-600" />
            </div>
            <div className="mt-4 text-center">
              <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                Nueva colección
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;