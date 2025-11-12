import { useState } from 'react';

const RegisterSale = ({ isOpen, onClose }) => {
  const [saleData, setSaleData] = useState({
    productId: '',
    quantity: 1,
    price: '',
    customer: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para registrar la venta
    console.log('Registrando venta:', saleData);
    // Limpiar formulario después de enviar
    setSaleData({
      productId: '',
      quantity: 1,
      price: '',
      customer: ''
    });
    onClose();
  };

  const handleClose = () => {
    setSaleData({
      productId: '',
      quantity: 1,
      price: '',
      customer: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Registrar Nueva Venta</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Producto
              </label>
              <input
                type="text"
                value={saleData.productId}
                onChange={(e) => setSaleData({...saleData, productId: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={saleData.quantity}
                onChange={(e) => setSaleData({...saleData, quantity: parseInt(e.target.value) || 1})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                value={saleData.price}
                onChange={(e) => setSaleData({...saleData, price: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <input
                type="text"
                value={saleData.customer}
                onChange={(e) => setSaleData({...saleData, customer: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Registrar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterSale;