import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, History, Loader } from 'lucide-react';
import axios from '../../../api/axios';

const InventoryManager = () => {
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showStockForm, setShowStockForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar datos del inventario
  useEffect(() => {
    loadInventory();
    loadMovements();
    loadLowStockAlerts();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    setErrors(prev => ({ ...prev, inventory: null }));
    try {
      const response = await axios.get('/store/admin/inventory/products/');
      setInventory(response.data || []);
    } catch (error) {
      console.error('Error cargando inventario:', error);
      setErrors(prev => ({ ...prev, inventory: 'Error al cargar el inventario' }));
    } finally {
      setLoading(false);
    }
  };

  const loadMovements = async () => {
    setMovementsLoading(true);
    setErrors(prev => ({ ...prev, movements: null }));
    try {
      const response = await axios.get('/store/admin/inventory/movements/');
      // Asegurarnos de que movements sea siempre un array
      setMovements(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error cargando movimientos:', error);
      setErrors(prev => ({ ...prev, movements: 'Error al cargar los movimientos' }));
      setMovements([]); // Asegurar que sea array vacío en caso de error
    } finally {
      setMovementsLoading(false);
    }
  };

  const loadLowStockAlerts = async () => {
    setErrors(prev => ({ ...prev, alerts: null }));
    try {
      const response = await axios.get('/store/admin/inventory/alerts/low-stock/');
      setLowStockProducts(response.data || []);
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setErrors(prev => ({ ...prev, alerts: 'Error al cargar las alertas' }));
      setLowStockProducts([]);
    }
  };

  const StockForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      movement_type: 'entrada',
      quantity: '',
      reason: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      
      try {
        const movementData = {
          product: product.id,
          ...formData,
          quantity: parseInt(formData.quantity)
        };

        await axios.post('/store/admin/inventory/movements/create/', movementData);
        
        onSave();
        alert('Movimiento registrado correctamente');
      } catch (error) {
        console.error('Error registrando movimiento:', error);
        alert('Error al registrar el movimiento');
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Registrar Movimiento - {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Stock actual: <strong>{product.stock} unidades</strong>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento *</label>
                <select
                  value={formData.movement_type}
                  onChange={(e) => setFormData({...formData, movement_type: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="entrada">Entrada (Aumentar stock)</option>
                  <option value="salida">Salida (Reducir stock)</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Razón *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Compra proveedor, Venta, Ajuste físico..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={formLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {formLoading && <Loader className="animate-spin" size={16} />}
                  <span>Registrar Movimiento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveMovement = () => {
    setShowStockForm(false);
    setSelectedProduct(null);
    // Recargar todos los datos
    loadInventory();
    loadMovements();
    loadLowStockAlerts();
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { color: 'green', label: 'Alto' };
    if (stock > 10) return { color: 'yellow', label: 'Medio' };
    if (stock > 0) return { color: 'orange', label: 'Bajo' };
    return { color: 'red', label: 'Agotado' };
  };

  // Función segura para mapear movimientos
  const safeMovements = Array.isArray(movements) ? movements : [];

  return (
    <div className="space-y-6">
      {/* Mostrar errores */}
      {Object.values(errors).filter(Boolean).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-semibold mb-2">Errores:</h4>
          {Object.entries(errors).map(([key, error]) => 
            error && <p key={key} className="text-red-700 text-sm">• {error}</p>
          )}
        </div>
      )}

      {/* Alertas de stock bajo */}
      {Array.isArray(lowStockProducts) && lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="text-red-600" size={20} />
            <h3 className="text-lg font-semibold text-red-800">Alertas de Stock Bajo</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(product => (
              <div key={product.id} className="bg-white rounded p-3 border border-red-200">
                <div className="font-medium text-red-700">{product.name}</div>
                <div className="text-sm text-red-600">
                  Stock actual: {product.stock} unidades
                </div>
                <div className="text-xs text-red-500 mt-1">
                  Categoría: {product.category?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventario actual */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Package size={20} />
              <span>Inventario Actual</span>
            </h3>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-emerald-600" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(inventory) && inventory.map(item => {
                    const status = getStockStatus(item.stock);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-8 w-8 rounded-lg object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.category?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {item.stock} unidades
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            status.color === 'green' ? 'bg-green-100 text-green-800' :
                            status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            status.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedProduct(item);
                              setShowStockForm(true);
                            }}
                            className="text-emerald-600 hover:text-emerald-900 text-sm font-medium"
                          >
                            Registrar Movimiento
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(!Array.isArray(inventory) || inventory.length === 0) && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No hay productos en el inventario
                </div>
              )}
            </div>
          )}
        </div>

        {/* Historial de movimientos */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <History size={20} />
              <span>Historial de Movimientos</span>
            </h3>
          </div>
          {movementsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-emerald-600" size={32} />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <div className="divide-y divide-gray-200">
                {safeMovements.map(movement => (
                  <div key={movement.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{movement.product_name}</div>
                        <div className="text-sm text-gray-500">{movement.reason}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Por: {movement.created_by} • {new Date(movement.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          movement.movement_type === 'entrada' ? 'bg-green-100 text-green-800' : 
                          movement.movement_type === 'salida' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {movement.movement_type === 'entrada' ? '+' : '-'}{movement.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {safeMovements.length === 0 && !movementsLoading && (
                <div className="text-center py-8 text-gray-500">
                  No hay movimientos registrados
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showStockForm && selectedProduct && (
        <StockForm
          product={selectedProduct}
          onSave={handleSaveMovement}
          onCancel={() => {
            setShowStockForm(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default InventoryManager;