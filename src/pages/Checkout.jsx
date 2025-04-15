/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/pago/CheckoutForm'
import Order from '../components/pago/Order';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    postal: '',
    phone: user?.phone || '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // 🛡️ Seguridad frontend: prevenir si no está autenticado
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para confirmar el pedido');
      navigate('/login');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('/checkout/', {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postal: formData.postal,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
      });
  
      clearCart();
      toast.success('¡Pedido realizado con éxito!');
      navigate('/checkout-success');
    } catch (err) {
      console.error('Error en checkout:', err.response?.data || err);
      toast.error(err.response?.data?.detail || 'Error al procesar el pedido.');
    } finally {
      setLoading(false);
    }
  };
  
  
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/cart')}
          className="text-gray-600 hover:text-emerald-600 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">Finalizar compra</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <CheckoutForm 
          formData={formData} 
          handleChange={handleChange} 
          loading={loading} 
        />
        
        <Order
          cartItems={cartItems} 
          subtotal={subtotal} 
          shipping={shipping} 
          total={total} 
          loading={loading} 
          handleSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
};

export default Checkout;