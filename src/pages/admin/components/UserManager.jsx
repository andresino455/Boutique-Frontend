// src/pages/admin/components/UserManager.jsx
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader,
  User,
  Mail,
  Shield,
} from "lucide-react";
import axios from "../../../api/axios";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log("👥 Cargando usuarios...");
      const response = await axios.get("/users/admin/users/");
      console.log("✅ Respuesta de usuarios:", response.data);

      // ✅ CORRECCIÓN: Manejar diferentes formatos de respuesta
      let usersData = [];

      if (Array.isArray(response.data)) {
        // Si es un array directo
        usersData = response.data;
      } else if (
        response.data.results &&
        Array.isArray(response.data.results)
      ) {
        // Si está paginado (results)
        usersData = response.data.results;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Si está en formato data
        usersData = response.data.data;
      } else {
        // Si es un objeto u otro formato
        console.warn("⚠️ Formato de respuesta inesperado:", response.data);
        usersData = [];
      }

      setUsers(usersData);
    } catch (error) {
      console.error("❌ Error cargando usuarios:", error);
      console.log("📋 Detalles del error:", error.response?.data);
      alert(
        "Error al cargar los usuarios: " +
          (error.response?.data?.detail || error.message)
      );
      setUsers([]); // Asegurar array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      user
        ? {
            username: user.username || "",
            email: user.email || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            role: user.role || "customer",
            is_active: user.is_active !== undefined ? user.is_active : true,
          }
        : {
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            password2: "",
            role: "customer",
            is_active: true,
          }
    );

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      setErrors({});

      // Validación de contraseñas
      if (!user && formData.password !== formData.password2) {
        setErrors({ password2: "Las contraseñas no coinciden" });
        setFormLoading(false);
        return;
      }

      try {
        const submitData = { ...formData };

        if (user) {
          delete submitData.password2;
          // Si no se proporciona password, remover el campo
          if (!submitData.password || submitData.password === "") {
            delete submitData.password;
          }
        }

        console.log("🚀 Enviando datos:", submitData);

        if (user) {
          // Actualizar usuario existente
          await axios.put(`/users/admin/users/${user.id}/update/`, submitData);
        } else {
          // Crear nuevo usuario
          await axios.post("/users/admin/users/create/", submitData);
        }

        onSave();
        alert(`Usuario ${user ? "actualizado" : "creado"} correctamente`);
      } catch (error) {
        console.error("❌ Error guardando usuario:", error);
        console.log("📋 Detalles del error:", error.response?.data);
        if (error.response?.data) {
          const backendErrors = error.response.data;
          const formattedErrors = {};

          Object.keys(backendErrors).forEach((key) => {
            if (Array.isArray(backendErrors[key])) {
              formattedErrors[key] = backendErrors[key].join(", ");
            } else {
              formattedErrors[key] = backendErrors[key];
            }
          });

          setErrors(formattedErrors);
        } else {
          alert(
            "Error al guardar el usuario: " +
              (error.message || "Error desconocido")
          );
        }
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {user ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre de usuario *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.username ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              // En el formulario, cambia la sección de passwords:
              {!user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      required={!user}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirmar Contraseña *
                    </label>
                    <input
                      type="password"
                      required={!user}
                      value={formData.password2}
                      onChange={(e) =>
                        setFormData({ ...formData, password2: e.target.value })
                      }
                      className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.password2 ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Repite la contraseña"
                    />
                    {errors.password2 && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password2}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-yellow-700 text-sm">
                    <strong>Nota:</strong> Deja los campos de contraseña en
                    blanco si no quieres cambiarla.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rol *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="customer">Cliente</option>
                    <option value="seller">Vendedor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            is_active: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Usuario activo
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              {errors.non_field_errors && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm">
                    {errors.non_field_errors}
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={formLoading}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {formLoading && <Loader className="animate-spin" size={16} />}
                  <span>{user ? "Actualizar" : "Crear"} Usuario</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveUser = () => {
    setShowForm(false);
    setEditingUser(null);
    loadUsers(); // Recargar la lista
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este usuario?")
    ) {
      return;
    }

    try {
      await axios.delete(`/users/admin/users/${userId}/delete/`);
      alert("Usuario eliminado correctamente");
      loadUsers(); // Recargar la lista
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      alert(
        "Error al eliminar el usuario: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "seller":
        return "bg-blue-100 text-blue-800";
      case "customer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "seller":
        return "Vendedor";
      case "customer":
        return "Cliente";
      default:
        return role;
    }
  };

  // ✅ CORRECCIÓN: Asegurar que filteredUsers sea siempre un array
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name &&
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name &&
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Debug info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-blue-800 font-semibold mb-2">
          Información de Debug - Usuarios:
        </h4>
        <p className="text-blue-700 text-sm">Tipo de users: {typeof users}</p>
        <p className="text-blue-700 text-sm">
          Es array: {Array.isArray(users) ? "Sí" : "No"}
        </p>
        <p className="text-blue-700 text-sm">
          Usuarios cargados: {safeUsers.length}
        </p>
      </div>

      {/* Header con búsqueda y botón */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-emerald-600" size={32} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <User className="text-emerald-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail size={16} className="mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : "No especificado"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                            user.role
                          )}`}
                        >
                          <Shield size={12} className="mr-1" />
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                          disabled={user.id === 1} // No permitir eliminar el superusuario
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {safeUsers.length === 0
                  ? "No hay usuarios registrados"
                  : "No se encontraron usuarios"}
              </div>
            )}
          </>
        )}
      </div>

      {/* Formulario modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManager;
