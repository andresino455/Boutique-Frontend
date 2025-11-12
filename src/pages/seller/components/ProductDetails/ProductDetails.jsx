import { useState } from 'react';
import { Search } from 'lucide-react';

const ProductDetails = ({ isOpen, onClose }) => {
  const [productId, setProductId] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!productId.trim()) return;
    
    setLoading(true);
    // Aquí iría la llamada a la API para obtener los detalles del producto
    // Simulamos una respuesta con un timeout
    setTimeout(() => {
      const mockProduct = {
        id: productId,
        name: "Producto Ejemplo",
        price: "$99.99",
        stock: 50,
        category: "Electrónicos",
        description: "Este es un producto de ejemplo con descripción detallada.",
        status: "Disponible"
      };
      
      setProductDetails(mockProduct);
      setLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setProductId('');
    setProductDetails(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Consultar Detalles de Producto</h2>
        
        <div className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Ingresa el ID del producto"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !productId.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <Search size={16} className="mr-2" />
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {productDetails && !loading && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Detalles del Producto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-medium">{productDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium">{productDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Precio</p>
                <p className="font-medium">{productDetails.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stock</p>
                <p className="font-medium">{productDetails.stock}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Categoría</p>
                <p className="font-medium">{productDetails.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-medium">{productDetails.status}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600">Descripción</p>
                <p className="font-medium mt-1">{productDetails.description}</p>
              </div>
            </div>
          </div>
        )}

        {!productDetails && !loading && (
          <div className="text-center py-8 text-gray-500">
            Ingresa un ID de producto y haz clic en Buscar para ver los detalles
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;