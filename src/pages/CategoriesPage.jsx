import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { Grid, ShoppingBag, Layers, AlertCircle, ArrowRight } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/store/categories/');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('No pudimos cargar las categorías. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="text-red-600 w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-lg text-red-700">Error</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Categorías</h1>
          <p className="text-gray-600 mt-1">Explora nuestras colecciones de productos</p>
        </div>
        <Link to="/products" className="flex items-center text-green-600 hover:text-green-800 font-medium">
          <span>Ver todos los productos</span>
          <ShoppingBag className="ml-2 w-5 h-5" />
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Layers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No hay categorías disponibles</h3>
          <p className="mt-1 text-gray-500">Pronto agregaremos nuevas categorías de productos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-video relative bg-gray-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <Grid className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-2 text-gray-600 line-clamp-2">{category.description}</p>
                )}
                <div className="mt-4 flex items-center text-green-600">
                  <span className="text-sm font-medium">Ver productos</span>
                  <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 bg-green-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-green-800">¿No encuentras lo que buscas?</h2>
        <p className="mt-2 text-green-700">
          Explora nuestra colección completa de productos o ponte en contacto con nosotros para ayudarte a encontrar exactamente lo que necesitas.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            to="/products"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center"
          >
            <ShoppingBag className="mr-2 w-4 h-4" />
            Todos los productos
          </Link>
          <Link
            to="/contact"
            className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors"
          >
            Contactar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;