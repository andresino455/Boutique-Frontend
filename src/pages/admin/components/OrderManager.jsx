import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Truck, CheckCircle, XCircle, Loader } from 'lucide-react';
import axios from '../../../api/axios';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'Todos los estados', color: 'gray' },
    { value: 'pending', label: 'Pendiente', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmado', color: 'blue' },
    { value: 'shipped', label: 'En envío', color: 'purple' },
    { value: 'delivered', label: 'Entregado', color: 'green' },
    { value: 'cancelled', label: 'Cancelado', color: 'red' }
  ];

  // Cargar órdenes y estadísticas
  useEffect(() => {
    loadOrders();
    loadStats();
  }, [statusFilter, searchTerm]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/orders/admin/orders/?${params}`);
      
      // ✅ CORRECCIÓN: Los datos están en response.data.results
      const ordersData = response.data.results || response.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      alert('Error al cargar las órdenes');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get('/orders/admin/orders/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return statusObj ? statusObj.color : 'gray';
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(opt => opt.value === status);
    return statusObj ? statusObj.label : status;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/orders/admin/orders/${orderId}/update-status/`, {
        status: newStatus
      });
      
      alert('Estado actualizado correctamente');
      loadOrders(); // Recargar la lista
      loadStats(); // Actualizar estadísticas
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado');
    }
  };

  const OrderDetails = ({ order, onClose, onStatusUpdate }) => {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState(order.status);

    const handleStatusUpdate = async () => {
      await onStatusUpdate(order.id, newStatus);
      setShowStatusModal(false);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold">Detalles de la Orden</h3>
                <p className="text-gray-600">#{order.id}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Edit size={16} />
                  <span>Cambiar Estado</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Información del cliente */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Información del Cliente</h4>
                <div className="space-y-2">
                  <p><strong>Nombre:</strong> {order.user_name || order.username}</p>
                  <p><strong>Email:</strong> {order.user_email}</p>
                  <p><strong>Dirección:</strong> {order.shipping_address}</p>
                </div>
              </div>

              {/* Información de la orden */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Información de la Orden</h4>
                <div className="space-y-2">
                  <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(order.status) === 'green' ? 'bg-green-100 text-green-800' :
                      getStatusColor(order.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      getStatusColor(order.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                      getStatusColor(order.status) === 'purple' ? 'bg-purple-100 text-purple-800' :
                      getStatusColor(order.status) === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </p>
                  <p><strong>Pagado:</strong> {order.is_paid ? 'Sí' : 'No'}</p>
                  <p><strong>Total:</strong> ${order.total_price}</p>
                  <p><strong>Items:</strong> {order.items?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Items de la orden */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-semibold">Productos ({order.items?.length || 0})</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(order.items) && order.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {item.product_image && (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="h-10 w-10 rounded-lg object-cover mr-3"
                              />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {item.product_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">${item.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!Array.isArray(order.items) || order.items.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No hay items en esta orden
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal para cambiar estado */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h4 className="text-lg font-semibold mb-4">Cambiar Estado de la Orden</h4>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Actualizar Estado
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Estadísticas rápidas
  const QuickStats = () => {
    if (!stats) return null;
    
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total_orders || 0}</div>
          <div className="text-sm text-gray-600">Total Órdenes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending_orders || 0}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{stats.delivered_orders || 0}</div>
          <div className="text-sm text-gray-600">Entregadas</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">${(stats.monthly_sales || 0).toFixed(2)}</div>
          <div className="text-sm text-gray-600">Ventas Mensuales</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <QuickStats />
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Orden</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user_name || order.username}
                          </div>
                          <div className="text-sm text-gray-500">{order.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total_price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusColor(order.status) === 'green' ? 'bg-green-100 text-green-800' :
                          getStatusColor(order.status) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          getStatusColor(order.status) === 'blue' ? 'bg-blue-100 text-blue-800' :
                          getStatusColor(order.status) === 'purple' ? 'bg-purple-100 text-purple-800' :
                          getStatusColor(order.status) === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="text-green-600 hover:text-green-900"
                          title="Marcar como enviado"
                          disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          <Truck size={16} />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Marcar como entregado"
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          <CheckCircle size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                No se encontraron órdenes
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalles de orden */}
      {showOrderDetails && selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={updateOrderStatus}
        />
      )}
    </div>
  );
};

export default OrderManager;