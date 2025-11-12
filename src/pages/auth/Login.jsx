import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);
      console.log('Login result:', result);
      
      if (result?.success) {
        const userRole = result.user?.role;
        console.log('User role:', userRole);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'seller':
            navigate('/seller/dashboard', { replace: true });
            break;
          case 'customer':
          default:
            navigate('/products', { replace: true });
            break;
        }
      } else {
        setError(result?.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Card principal */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-8 px-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                <Sparkles className="text-white" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Bienvenido de vuelta
              </h2>
              <p className="text-blue-100 text-lg">
                Inicia sesión en tu cuenta
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Campo Usuario */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                  </div>
                  <input
                    name="username"
                    type="text"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </div>

                {/* Campo Contraseña */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="sr-only"
                    />
                    <div className="w-5 h-5 bg-white/10 border border-white/20 rounded transition-all group-hover:border-purple-400">
                      <svg
                        className="absolute inset-0 w-5 h-5 text-purple-500 opacity-0 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-300">Recordarme</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${
                  loading
                    ? "bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-lg hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-transparent text-gray-300">
                    ¿No tienes una cuenta?
                  </span>
                </div>
              </div>

              {/* Link a registro */}
              <div className="mt-6">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl text-white font-medium bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-200 group"
                >
                  Crear nueva cuenta
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Texto informativo adicional */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Al iniciar sesión, aceptas nuestros{" "}
            <a href="#" className="text-purple-300 hover:text-purple-200 underline transition-colors">
              Términos de servicio
            </a>{" "}
            y{" "}
            <a href="#" className="text-purple-300 hover:text-purple-200 underline transition-colors">
              Política de privacidad
            </a>
          </p>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;