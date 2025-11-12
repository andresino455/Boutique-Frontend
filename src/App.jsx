import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Cart from './components/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import ProductsPage from './pages/ProductsPage';
import Orders from './pages/Orders';
import CategoriesPage from './pages/CategoriesPage';

// Nuevas páginas para roles específicos
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import Unauthorized from './pages/Unauthorized';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas públicas protegidas (solo para usuarios no autenticados) */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Rutas protegidas para cualquier usuario autenticado */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/checkout-success" element={
          <ProtectedRoute>
            <CheckoutSuccess />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas solo para ADMINISTRADORES */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Rutas protegidas solo para VENDEDORES */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute requiredRole="seller">
            <SellerDashboard />
          </ProtectedRoute>
        } />

        {/* Ruta 404 - Not Found */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600">Página no encontrada</p>
            </div>
          </div>
        } />
      </Routes>
    </>
  );
};

export default App;