import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, X, LogOut, Heart, Search, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      logout();
      navigate('/login');
      setIsMenuOpen(false);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      logout();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isDropdownOpen && !e.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Cerrar menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-100' 
        : 'bg-gradient-to-r from-purple-900 to-blue-900'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-2xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded ${
              isScrolled ? 'text-purple-600' : 'text-white'
            }`}
            aria-label="Inicio"
          >
            BoutiquePro
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/products" 
              className={`font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-3 py-2 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-purple-600' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              Productos
            </Link>
            <Link 
              to="/categories" 
              className={`font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-3 py-2 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-purple-600' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              Categorías
            </Link>
            <Link 
              to="/deals" 
              className={`font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-3 py-2 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-purple-600' 
                  : 'text-white hover:text-yellow-300'
              }`}
            >
              Ofertas
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <Search 
                size={20} 
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isScrolled ? 'text-gray-400' : 'text-gray-300'
                }`} 
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  isScrolled 
                    ? 'bg-white border-gray-200 text-gray-800' 
                    : 'bg-white/10 border-white/20 text-white placeholder-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/wishlist" 
              className={`relative p-2 rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50' 
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
              aria-label="Lista de deseos"
            >
              <Heart size={22} />
            </Link>
            
            <Link 
              to="/cart" 
              className={`relative p-2 rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50' 
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
              aria-label="Carrito de compras"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold ${
                  isScrolled 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white text-purple-900'
                }`}>
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative user-dropdown">
                <button 
                  className={`flex items-center gap-2 p-2 rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50' 
                      : 'text-white hover:text-yellow-300 hover:bg-white/10'
                  }`}
                  aria-label="Menú de usuario"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isScrolled ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-white/20'
                  }`}>
                    <User size={18} className={isScrolled ? 'text-white' : 'text-white'} />
                  </div>
                  <span className="hidden lg:inline font-medium">{user?.username}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                {isDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100"
                    role="menu"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.username}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-3 hover:bg-purple-50 focus:bg-purple-50 outline-none transition-colors text-gray-700"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={18} className="mr-3" />
                      Mi perfil
                    </Link>
                    <Link 
                      to="/orders" 
                      className="flex items-center px-4 py-3 hover:bg-purple-50 focus:bg-purple-50 outline-none transition-colors text-gray-700"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <ShoppingCart size={18} className="mr-3" />
                      Mis pedidos
                    </Link>
                    <Link 
                      to="/wishlist" 
                      className="flex items-center px-4 py-3 hover:bg-purple-50 focus:bg-purple-50 outline-none transition-colors text-gray-700"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Heart size={18} className="mr-3" />
                      Lista de deseos
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout} 
                      disabled={isLoading}
                      className="w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 focus:bg-red-50 outline-none transition-colors disabled:opacity-50"
                      role="menuitem"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-3"></span>
                      ) : (
                        <LogOut size={18} className="mr-3" />
                      )}
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className={`font-medium transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-4 py-2 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-purple-600' 
                      : 'text-white hover:text-yellow-300'
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu icon */}
          <div className="md:hidden flex items-center space-x-3">
            <Link 
              to="/wishlist" 
              className={`relative p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-purple-600' 
                  : 'text-white hover:text-yellow-300'
              }`}
              aria-label="Lista de deseos"
            >
              <Heart size={20} />
            </Link>
            <Link 
              to="/cart" 
              className={`relative p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-purple-600' 
                  : 'text-white hover:text-yellow-300'
              }`}
              aria-label="Carrito de compras"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className={`absolute -top-1 -right-1 text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold ${
                  isScrolled 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white text-purple-900'
                }`}>
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-600 hover:text-purple-600' 
                  : 'text-white hover:text-yellow-300'
              }`}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden border-t py-4 shadow-2xl ${
          isScrolled ? 'bg-white' : 'bg-gradient-to-b from-purple-900 to-blue-900'
        }`}>
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <Link 
              to="/products" 
              onClick={() => setIsMenuOpen(false)}
              className={`py-3 px-4 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50' 
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              Productos
            </Link>
            <Link 
              to="/categories" 
              onClick={() => setIsMenuOpen(false)}
              className={`py-3 px-4 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50' 
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              Categorías
            </Link>
            <Link 
              to="/deals" 
              onClick={() => setIsMenuOpen(false)}
              className={`py-3 px-4 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50' 
                  : 'text-white hover:text-yellow-300 hover:bg-white/10'
              }`}
            >
              Ofertas
            </Link>

            {isAuthenticated ? (
              <>
                <div className={`font-semibold pt-4 mt-2 border-t ${
                  isScrolled ? 'border-gray-200 text-gray-900' : 'border-white/20 text-white'
                }`}>
                  Hola, {user?.username}
                </div>
                <Link 
                  to="/profile" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isScrolled 
                      ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50' 
                      : 'text-white hover:text-yellow-300 hover:bg-white/10'
                  }`}
                >
                  Mi perfil
                </Link>
                <Link 
                  to="/orders" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isScrolled 
                      ? 'text-gray-600 hover:text-purple-600 hover:bg-purple-50' 
                      : 'text-white hover:text-yellow-300 hover:bg-white/10'
                  }`}
                >
                  Mis pedidos
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className={`text-left py-3 px-4 rounded-xl flex items-center transition-all focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    isScrolled 
                      ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                      : 'text-red-300 hover:text-red-200 hover:bg-white/10'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></span>
                  ) : (
                    <LogOut size={18} className="mr-3" />
                  )}
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-4 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-purple-600 hover:bg-purple-50' 
                      : 'text-white hover:text-yellow-300 hover:bg-white/10'
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold text-center hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;