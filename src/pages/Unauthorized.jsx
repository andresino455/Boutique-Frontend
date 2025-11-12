import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-red-600" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso No Autorizado
          </h1>
          
          <p className="text-gray-600 mb-6">
            No tienes los permisos necesarios para acceder a esta página. 
            Contacta al administrador si necesitas acceso.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Home className="mr-2" size={18} />
              Volver al Inicio
            </Link>
            
            <Link
              to="/products"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Ir a Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;