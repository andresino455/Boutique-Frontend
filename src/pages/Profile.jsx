import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, MapPin, Phone, Edit, Save, X, Camera, Shield, Package, Heart, CreditCard } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar datos del formulario con la información del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Aquí iría la llamada a la API para actualizar el perfil
      console.log('Actualizando perfil:', formData);
      // Simulamos una espera de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí actualizarías el contexto/auth
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || ''
    });
    setIsEditing(false);
  };

  const stats = [
    { icon: Package, label: 'Pedidos', value: '12', color: 'blue' },
    { icon: Heart, label: 'Favoritos', value: '8', color: 'pink' },
    { icon: CreditCard, label: 'Métodos de Pago', value: '2', color: 'green' },
    { icon: Shield, label: 'Miembro desde', value: '2024', color: 'purple' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-lg border">
                    <Camera size={14} className="text-gray-600" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-600 flex items-center">
                  <Mail size={16} className="mr-2" />
                  {user.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                isEditing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isEditing ? (
                <>
                  <X size={18} className="mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit size={18} className="mr-2" />
                  Editar Perfil
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Estadísticas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50">
                    <div className={`p-2 rounded-lg bg-${stat.color}-100 mr-3`}>
                      <stat.icon size={20} className={`text-${stat.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario de perfil */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {isEditing ? 'Editar Información' : 'Información Personal'}
              </h2>

              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Usuario
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <User size={20} className="text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.username}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <Mail size={20} className="text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <Phone size={20} className="text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.phone || 'No especificado'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <MapPin size={20} className="text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.country || 'No especificado'}</span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <div className="flex items-start px-4 py-3 bg-gray-50 rounded-xl">
                        <MapPin size={20} className="text-gray-400 mr-3 mt-1" />
                        <span className="text-gray-900">{user.address || 'No especificada'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                        <MapPin size={20} className="text-gray-400 mr-3" />
                        <span className="text-gray-900">{user.city || 'No especificada'}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Sección de seguridad */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Seguridad</h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                      <p className="text-sm text-gray-600">Actualiza tu contraseña regularmente</p>
                    </div>
                    <Shield size={20} className="text-gray-400" />
                  </div>
                </button>
                
                <button className="w-full text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Verificación en Dos Pasos</p>
                      <p className="text-sm text-gray-600">Añade una capa extra de seguridad</p>
                    </div>
                    <Shield size={20} className="text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;