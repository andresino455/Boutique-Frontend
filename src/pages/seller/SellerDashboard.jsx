import { useAuth } from '../../context/AuthContext';
import { Package, TrendingUp, Users, Star, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import RegisterSale from './components/RegisterSale/RegisterSale';
import ProductDetails from './components/ProductDetails/ProductDetails';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [showRegisterSale, setShowRegisterSale] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Vendedor
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.username}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setShowRegisterSale(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Registrar Venta
          </button>
          <button
            onClick={() => setShowProductDetails(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Search size={16} className="mr-2" />
            Consultar Producto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mis Productos</p>
                <p className="text-2xl font-bold text-gray-900">45</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ventas</p>
                <p className="text-2xl font-bold text-gray-900">$8,765</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clientes</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modales */}
        <RegisterSale 
          isOpen={showRegisterSale} 
          onClose={() => setShowRegisterSale(false)} 
        />
        <ProductDetails 
          isOpen={showProductDetails} 
          onClose={() => setShowProductDetails(false)} 
        />
      </div>
    </div>
  );
};

export default SellerDashboard;