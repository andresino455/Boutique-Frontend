import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  Loader2,
  Package,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En el componente Orders, dentro del fetchOrders
    const fetchOrders = async () => {
      if (!user) return;

      try {
        console.log("📦 Cargando órdenes del usuario...");
        const res = await axios.get("orders/");

        console.log("✅ Respuesta completa de órdenes:", res.data);

        // Si hay órdenes, inspeccionar la primera para ver la estructura
        if (res.data && res.data.length > 0) {
          console.log("🔍 Estructura de la primera orden:", res.data[0]);
          if (res.data[0].items && res.data[0].items.length > 0) {
            console.log("📋 Estructura del primer item:", res.data[0].items[0]);
          }
        }

        let ordersData = [];
        if (Array.isArray(res.data)) {
          ordersData = res.data;
        } else if (res.data.results && Array.isArray(res.data.results)) {
          ordersData = res.data.results;
        } else {
          ordersData = res.data || [];
        }

        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error("❌ Error al cargar pedidos:", err);
        toast.error("Error al cargar tus pedidos", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // ✅ Función corregida para el estado del pedido
  const getStatusBadge = (order) => {
    const statusConfig = {
      pending: {
        label: "Pendiente",
        color: "bg-amber-100 text-amber-800",
        icon: Clock,
      },
      confirmed: {
        label: "Confirmado",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
      },
      shipped: {
        label: "En camino",
        color: "bg-purple-100 text-purple-800",
        icon: Truck,
      },
      delivered: {
        label: "Entregado",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelado",
        color: "bg-red-100 text-red-800",
        icon: Clock,
      },
    };

    const config = statusConfig[order.status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="mr-1" size={14} /> {config.label}
      </span>
    );
  };

  // ✅ Función para el estado de pago
  const getPaymentStatus = (order) => {
    if (order.is_paid) {
      return (
        <span className="ml-2 inline-flex items-center text-green-600">
          <CheckCircle className="mr-1" size={14} /> Pagado
        </span>
      );
    } else {
      return (
        <span className="ml-2 inline-flex items-center text-amber-600">
          <Clock className="mr-1" size={14} /> Pendiente
        </span>
      );
    }
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No tienes pedidos aún
          </h3>
          <p className="mt-2 text-gray-500">
            Cuando realices un pedido, aparecerá aquí.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
            >
              Explorar productos
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold">
                        Pedido #{order.id}
                      </h2>
                      <span className="ml-3">{getStatusBadge(order)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Fecha:</span>{" "}
                      {new Date(order.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Dirección:</span>{" "}
                      {order.shipping_address}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-600 font-bold text-xl">
                      ${parseFloat(order.total_price).toFixed(2)}
                    </span>
                    <div className="flex items-center justify-end mt-1 text-sm text-gray-600">
                      <CreditCard className="mr-1" size={14} />
                      {order.payment?.method || "No especificado"}
                      {getPaymentStatus(order)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Productos ({order.items?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {order.items?.map((item, idx) => {
                      // ✅ Extraer datos de manera segura
                      const productName =
                        item.product_name ||
                        item.product?.name ||
                        "Producto no disponible";
                      const productImage =
                        item.product_image || item.product?.image;
                      const quantity = item.quantity || 0;
                      const price = item.price || item.product_price || 0;
                      const total = (price * quantity).toFixed(2);

                      console.log(`📦 Item ${idx}:`, {
                        productName,
                        productImage,
                        quantity,
                        price,
                        total,
                        fullItem: item,
                      });

                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4">
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={productName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-full h-full flex items-center justify-center bg-gray-200 ${
                                  productImage ? "hidden" : ""
                                }`}
                              >
                                <Package className="text-gray-400" size={24} />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {productName}
                              </p>
                              <p className="text-gray-500">
                                Cantidad: {quantity}
                              </p>
                              <p className="text-gray-500">
                                Precio unitario: ${price}
                              </p>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">
                            ${total}
                          </span>
                        </div>
                      );
                    })}
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
