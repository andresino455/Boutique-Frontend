import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const RelatedProducts = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axios.get(`store/products/${productId}/related/`);
        setRelated(res.data.map(prod => ({
          ...prod,
          price: Number(prod.price) || 0,
          image: prod.image?.startsWith('http') 
            ? prod.image 
            : `http://127.0.0.1:8000${prod.image}`,
          rating: prod.rating || Math.floor(Math.random() * 3) + 3 // Valor aleatorio si no hay rating
        })));
      } catch (err) {
        console.error('Error al cargar productos relacionados:', err);
        toast.error('Error al cargar productos relacionados', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchRelated();
  }, [productId]);

  if (loading) return (
    <section className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="aspect-square w-full bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (related.length === 0) {
    return (
      <section className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">No encontramos productos relacionados en este momento.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">También te puede interesar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map(prod => (
          <article key={prod.id} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <Link to={`/product/${prod.id}`} className="block">
              <div className="aspect-square w-full relative overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {prod.is_new && (
                  <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Nuevo
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < prod.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({prod.rating})</span>
                </div>
                <h3 className="font-medium text-gray-900 line-clamp-2">{prod.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-emerald-600 font-bold text-lg">${prod.price.toFixed(2)}</span>
                    {prod.original_price && (
                      <span className="text-xs text-gray-400 line-through ml-1">${prod.original_price.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({ ...prod, quantity: 1 });
                      toast.success(`${prod.name} añadido al carrito`, {
                        icon: <ShoppingCart size={16} />,
                        position: "bottom-right",
                        autoClose: 2000,
                        theme: "colored",
                        className: "!bg-emerald-600 !text-white",
                      });
                    }}
                    className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors hover:scale-110 active:scale-95"
                    aria-label="Añadir al carrito"
                    title="Añadir al carrito"
                  >
                    <ShoppingCart size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;