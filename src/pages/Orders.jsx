import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Package, CheckCircle, Clock, Truck, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const Orders = () => {
  useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/orders/');
        setOrders(res.data.results ?? res.data);
      } catch (err) {
        console.error('Error al cargar pedidos:', err);
        toast.error('Error al cargar tus pedidos', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (order) => {
    if (order.is_cancelled) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancelado
        </span>
      );
    }
    
    if (order.is_delivered) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="mr-1" size={14} /> Entregado
        </span>
      );
    }
    
    if (order.is_shipped) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Truck className="mr-1" size={14} /> En camino
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <Clock className="mr-1" size={14} /> Procesando
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <Package className="text-emerald-600 mr-3" size={28} />
        <h1 className="text-3xl font-bold text-gray-900">Mis pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Package className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes pedidos aún</h3>
          <p className="mt-2 text-gray-500">Cuando realices un pedido, aparecerá aquí.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
            >
              Explorar productos
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold">Pedido #{order.id}</h2>
                      <span className="ml-3">{getStatusBadge(order)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Fecha:</span> {new Date(order.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Dirección:</span> {order.shipping_address}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-emerald-600 font-bold text-xl">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </span>
                    <div className="flex items-center justify-end mt-1 text-sm text-gray-600">
                      <CreditCard className="mr-1" size={14} />
                      {order.payment?.method || 'Método no especificado'}
                      {order.is_paid ? (
                        <span className="ml-2 inline-flex items-center text-green-600">
                          <CheckCircle className="mr-1" size={14} /> Pagado
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center text-amber-600">
                          <Clock className="mr-1" size={14} /> Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Productos</h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-gray-500">Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;