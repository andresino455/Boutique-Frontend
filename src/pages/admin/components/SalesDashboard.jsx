import { useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download
} from 'lucide-react';

const SalesDashboard = () => {
  const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d, 1y

  // Datos de ejemplo para métricas
  const metrics = [
    {
      title: 'Ventas Totales',
      value: '$45,678',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Órdenes',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      title: 'Clientes Nuevos',
      value: '567',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Ticket Promedio',
      value: '$89.50',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  // Datos de ventas por día (ejemplo)
  const salesData = [
    { date: '2024-01-15', sales: 1234, orders: 45 },
    { date: '2024-01-14', sales: 1567, orders: 52 },
    { date: '2024-01-13', sales: 987, orders: 38 },
    { date: '2024-01-12', sales: 1345, orders: 47 },
    { date: '2024-01-11', sales: 1123, orders: 41 },
    { date: '2024-01-10', sales: 1789, orders: 58 },
    { date: '2024-01-09', sales: 1456, orders: 49 }
  ];

  // Productos más vendidos
  const topProducts = [
    { name: 'Zapatos Deportivos', sales: 234, revenue: 18720 },
    { name: 'Camisetas Básicas', sales: 189, revenue: 4725 },
    { name: 'Jeans Slim Fit', sales: 156, revenue: 12480 },
    { name: 'Gorras', sales: 143, revenue: 2857 },
    { name: 'Mochilas', sales: 98, revenue: 4900 }
  ];

  // Categorías más populares
  const topCategories = [
    { name: 'Calzado', revenue: 24500, percentage: 35 },
    { name: 'Ropa', revenue: 18700, percentage: 27 },
    { name: 'Accesorios', revenue: 15600, percentage: 22 },
    { name: 'Deportes', revenue: 11200, percentage: 16 }
  ];

  const exportReport = () => {
    // Simular exportación de reporte
    alert('Funcionalidad de exportación en desarrollo...');
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes de Ventas</h2>
          <p className="text-gray-600">Métricas y análisis de rendimiento</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>
          </div>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            <Download size={16} />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <div className={`flex items-center mt-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span className="text-sm ml-1">{metric.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                <metric.icon className={`text-${metric.color}-600`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ventas por Día
          </h3>
          <div className="space-y-3">
            {salesData.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{day.date}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">${day.sales}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full" 
                      style={{ width: `${(day.sales / 2000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Productos Más Vendidos
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-sm font-medium text-gray-900">${product.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(product.sales / 250) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{product.sales} unidades vendidas</span>
                    <span>{Math.round((product.sales / 250) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por categoría */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ventas por Categoría
          </h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">${category.revenue}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas adicionales */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Métricas de Rendimiento
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de Conversión</span>
              <span className="font-medium text-gray-900">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clientes Recurrentes</span>
              <span className="font-medium text-gray-900">42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Vida Cliente</span>
              <span className="font-medium text-gray-900">$450</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de Abandono</span>
              <span className="font-medium text-gray-900">1.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de tendencias */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tendencias y Análisis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="mx-auto text-green-600 mb-2" size={24} />
            <p className="font-medium text-green-800">Crecimiento Positivo</p>
            <p className="text-sm text-green-600 mt-1">Las ventas han aumentado un 12.5% este período</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="mx-auto text-blue-600 mb-2" size={24} />
            <p className="font-medium text-blue-800">Clientes Nuevos</p>
            <p className="text-sm text-blue-600 mt-1">+15.3% en adquisición de nuevos clientes</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <ShoppingCart className="mx-auto text-yellow-600 mb-2" size={24} />
            <p className="font-medium text-yellow-800">Optimizar</p>
            <p className="text-sm text-yellow-600 mt-1">Ticket promedio disminuyó 2.1%, revisar estrategias</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;