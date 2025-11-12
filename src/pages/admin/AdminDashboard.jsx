import { useState, useEffect } from "react";
import UserManager from "./components/UserManager";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart3,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Loader,
  TrendingDown,
} from "lucide-react";
import axios from "../../api/axios";

// Componentes que vamos a crear
import ProductManager from "./components/ProductManager";
import CategoryManager from "./components/CategoryManager";
import InventoryManager from "./components/InventoryManager";
import OrderManager from "./components/OrderManager";
import SalesDashboard from "./components/SalesDashboard";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar estadísticas reales
  useEffect(() => {
    if (activeTab === "dashboard") {
      loadDashboardStats();
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("store/admin/dashboard/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      setError("Error al cargar las estadísticas del dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Datos de ejemplo como fallback
  const defaultStats = {
    cards: {
      today_sales: 12345,
      total_products: 567,
      pending_orders: 23,
      low_stock_alerts: 8,
      total_users: 1247,
      today_orders: 15,
      total_sales: 123456,
      recent_sales: 45678,
    },
    changes: {
      sales_change: "+12%",
      orders_change: "+8%",
      users_change: "+5%",
      products_change: "+3%",
    },
    top_products: [
      {
        product__name: "Zapatos Deportivos",
        total_sold: 234,
        total_revenue: 18720,
      },
      {
        product__name: "Camisetas Básicas",
        total_sold: 189,
        total_revenue: 4725,
      },
      {
        product__name: "Jeans Slim Fit",
        total_sold: 156,
        total_revenue: 12480,
      },
      { product__name: "Gorras", total_sold: 143, total_revenue: 2857 },
    ],
    sales_by_day: [
      { date: "2024-01-15", day_name: "Lun", sales: 1234 },
      { date: "2024-01-16", day_name: "Mar", sales: 1567 },
      { date: "2024-01-17", day_name: "Mié", sales: 987 },
      { date: "2024-01-18", day_name: "Jue", sales: 1345 },
      { date: "2024-01-19", day_name: "Vie", sales: 1789 },
      { date: "2024-01-20", day_name: "Sáb", sales: 1123 },
      { date: "2024-01-21", day_name: "Dom", sales: 1456 },
    ],
  };

  const currentStats = stats || defaultStats;

  const statCards = [
    {
      title: "Ventas Hoy",
      value: `$${currentStats.cards.today_sales?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "green",
      change: currentStats.changes?.sales_change || "+0%",
    },
    {
      title: "Total Productos",
      value: currentStats.cards.total_products?.toLocaleString() || "0",
      icon: Package,
      color: "blue",
      change: currentStats.changes?.products_change || "+0%",
    },
    {
      title: "Órdenes Pendientes",
      value: currentStats.cards.pending_orders?.toLocaleString() || "0",
      icon: ShoppingCart,
      color: "yellow",
      change: currentStats.changes?.orders_change || "+0%",
    },
    {
      title: "Alertas Stock",
      value: currentStats.cards.low_stock_alerts?.toLocaleString() || "0",
      icon: AlertTriangle,
      color: "red",
      change: "+0",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductManager />;
      case "categories":
        return <CategoryManager />;
      case "inventory":
        return <InventoryManager />;
      case "orders":
        return <OrderManager />;
      case "sales":
        return <SalesDashboard />;
      case "users": 
        return <UserManager />;
      default:
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin text-emerald-600" size={32} />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertTriangle
                  className="mx-auto text-red-600 mb-2"
                  size={24}
                />
                <p className="text-red-700">{error}</p>
                <button
                  onClick={loadDashboardStats}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <>
                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {stat.value}
                          </p>
                          <div
                            className={`flex items-center mt-1 ${
                              stat.change.startsWith("+")
                                ? "text-green-600"
                                : stat.change.startsWith("-")
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {stat.change.startsWith("+") ? (
                              <TrendingUp size={16} />
                            ) : stat.change.startsWith("-") ? (
                              <TrendingDown size={16} />
                            ) : null}
                            <span className="text-sm ml-1">{stat.change}</span>
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            stat.color === "green"
                              ? "bg-green-100"
                              : stat.color === "blue"
                              ? "bg-blue-100"
                              : stat.color === "yellow"
                              ? "bg-yellow-100"
                              : "bg-red-100"
                          }`}
                        >
                          <stat.icon
                            className={
                              stat.color === "green"
                                ? "text-green-600"
                                : stat.color === "blue"
                                ? "text-blue-600"
                                : stat.color === "yellow"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }
                            size={24}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gráficos y más contenido del dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico de ventas */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Ventas de los últimos 7 días
                    </h3>
                    <div className="space-y-3">
                      {currentStats.sales_by_day.map((day, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600 w-12">
                            {day.day_name}
                          </span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (day.sales / 2000) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-16 text-right">
                            ${day.sales}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Productos más vendidos */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Productos más vendidos
                    </h3>
                    <div className="space-y-4">
                      {currentStats.top_products.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-gray-900">
                                {product.product__name || product.name}
                              </span>
                              <span className="text-sm font-medium text-gray-900">
                                {product.total_sold} vendidos
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (product.total_sold / 250) * 100,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              ${product.total_revenue?.toLocaleString() || "0"}{" "}
                              en ventas
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Resumen General
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Usuarios</span>
                        <span className="font-medium">
                          {currentStats.cards.total_users}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Órdenes Hoy</span>
                        <span className="font-medium">
                          {currentStats.cards.today_orders}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ventas Totales</span>
                        <span className="font-medium">
                          ${currentStats.cards.total_sales?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Actualizaciones Recientes
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Sistema actualizado</p>
                          <p className="text-sm text-gray-500">
                            Dashboard administrativo mejorado
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">Hoy</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Nuevas órdenes</p>
                          <p className="text-sm text-gray-500">
                            {currentStats.cards.today_orders} órdenes recibidas
                            hoy
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">Hoy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-gray-600 mt-2">Bienvenido, {user?.username}</p>
            </div>
            <div className="text-sm text-gray-500">
              Rol:{" "}
              <span className="font-medium text-emerald-600">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: "dashboard", name: "Dashboard", icon: BarChart3 },
              { id: 'users', name: 'Usuarios', icon: Users },
              { id: "products", name: "Gestión de Productos", icon: Package },
              { id: "categories", name: "Categorías", icon: TrendingUp },
              { id: "inventory", name: "Inventario", icon: Package },
              { id: "orders", name: "Órdenes", icon: ShoppingCart },
              { id: "sales", name: "Reportes de Ventas", icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
