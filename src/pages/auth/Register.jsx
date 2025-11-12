import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password2: '', // Campo añadido para confirmación
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
    
    if (error) setError('');
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Débil';
    if (passwordStrength <= 3) return 'Media';
    if (passwordStrength <= 4) return 'Fuerte';
    return 'Muy fuerte';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    // Validaciones del frontend
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (/^\d+$/.test(form.password)) {
      setError('La contraseña no puede ser completamente numérica.');
      return;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/users/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.password2 // Incluir el campo de confirmación
      });
      
      console.log('Registro exitoso:', response.data);
      navigate('/login');
    } catch (err) {
      console.error('Error completo:', err);
      
      if (err.response?.data) {
        const errors = err.response.data;
        let errorMsg = '';
        
        if (typeof errors === 'object') {
          errorMsg = Object.entries(errors)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return `${key}: ${value.join(' ')}`;
              }
              return `${key}: ${value}`;
            })
            .join('\n');
        } else {
          errorMsg = errors.detail || 'Error al registrarse';
        }
        
        setError(errorMsg);
      } else if (err.request) {
        setError('No se pudo conectar al servidor. Verifica que el servidor esté ejecutándose.');
      } else {
        setError('Error al realizar la solicitud.');
      }
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
                Únete a nosotros
              </h2>
              <p className="text-blue-100 text-lg">
                Crea tu cuenta y comienza a explorar
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-sm">
                <p className="text-sm whitespace-pre-line">{error}</p>
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
                </div>

                {/* Campo Email */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
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
                </div>

                {/* Campo Confirmar Contraseña */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                  </div>
                  <input
                    name="password2"
                    type={showPassword2 ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    value={form.password2}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-300 transition-colors"
                  >
                    {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Indicador de fuerza de contraseña */}
                {form.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Seguridad de la contraseña:</span>
                      <span className={`font-medium ${
                        passwordStrength <= 2 ? 'text-red-400' :
                        passwordStrength <= 3 ? 'text-yellow-400' :
                        passwordStrength <= 4 ? 'text-blue-400' : 'text-green-400'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Consejos para contraseña segura */}
                <div className="text-xs text-gray-400 space-y-1">
                  <p className="font-medium text-gray-300">La contraseña debe contener:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Al menos 8 caracteres</li>
                    <li>Letras mayúsculas y minúsculas</li>
                    <li>Números y/o símbolos</li>
                    <li>No ser completamente numérica</li>
                  </ul>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="flex items-start space-x-3">
                <div className="relative flex items-center h-5 mt-1">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={handleTermsChange}
                    className="peer sr-only"
                  />
                  <div 
                    className={`w-5 h-5 border rounded transition-all flex items-center justify-center cursor-pointer ${
                      acceptedTerms 
                        ? 'bg-purple-500 border-purple-500' 
                        : 'bg-white/10 border-white/20 hover:border-purple-400'
                    }`}
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                  >
                    <CheckCircle 
                      className={`w-4 h-4 text-white transition-opacity ${
                        acceptedTerms ? 'opacity-100' : 'opacity-0'
                      }`} 
                      fill="currentColor"
                    />
                  </div>
                </div>
                <label 
                  htmlFor="terms" 
                  className="text-sm text-gray-300 leading-tight cursor-pointer flex-1"
                  onClick={() => setAcceptedTerms(!acceptedTerms)}
                >
                  Acepto los{' '}
                  <Link to="/terms" className="text-purple-300 hover:text-purple-200 underline transition-colors font-medium">
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacy" className="text-purple-300 hover:text-purple-200 underline transition-colors font-medium">
                    Política de Privacidad
                  </Link>
                </label>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading || !acceptedTerms}
                className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${
                  loading || !acceptedTerms
                    ? "bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed opacity-50"
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
                    Creando cuenta...
                  </>
                ) : (
                  "Crear cuenta"
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
                    ¿Ya tienes una cuenta?
                  </span>
                </div>
              </div>

              {/* Link a login */}
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-3 border border-white/20 rounded-xl text-white font-medium bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-200 group"
                >
                  Iniciar sesión
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Texto informativo adicional */}
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Al registrarte, obtendrás acceso a ofertas exclusivas y contenido personalizado
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

export default Register;