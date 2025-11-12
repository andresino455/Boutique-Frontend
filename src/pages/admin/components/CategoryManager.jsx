import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';
import axios from '../../../api/axios';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Cargar categorías
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/store/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      alert('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const CategoryForm = ({ category, onSave, onCancel }) => {
    const [formData, setFormData] = useState(category || {
      name: '',
      description: ''
    });

    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormLoading(true);
      
      try {
        const submitData = new FormData();
        
        // Agregar campos del formulario
        Object.keys(formData).forEach(key => {
          if (formData[key] !== '') {
            submitData.append(key, formData[key]);
          }
        });
        
        // Agregar imagen si existe
        if (image) {
          submitData.append('image', image);
        }

        if (category) {
          // Actualizar categoría existente
          await axios.put(`/store/admin/categories/${category.id}/update/`, submitData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        } else {
          // Crear nueva categoría
          await axios.post('/store/admin/categories/create/', submitData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
        }
        
        onSave();
        alert(`Categoría ${category ? 'actualizada' : 'creada'} correctamente`);
      } catch (error) {
        console.error('Error guardando categoría:', error);
        alert('Error al guardar la categoría');
      } finally {
        setFormLoading(false);
      }
    };

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {category ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Imagen {!category && '(Opcional)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {category?.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Imagen actual:</p>
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="h-20 w-20 object-cover rounded-lg mt-1"
                    />
                  </div>
                )}
              </div>
              
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
                  <span>{category ? 'Actualizar' : 'Crear'} Categoría</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveCategory = () => {
    setShowForm(false);
    setEditingCategory(null);
    loadCategories(); // Recargar la lista
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }

    try {
      await axios.delete(`/store/admin/categories/${categoryId}/delete/`);
      alert('Categoría eliminada correctamente');
      loadCategories(); // Recargar la lista
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      alert('Error al eliminar la categoría');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus size={20} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-emerald-600" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{category.description}</p>
                    <p className="text-sm text-gray-500">
                      {category.products?.length || 0} productos
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No hay categorías registradas</p>
            </div>
          )}
        </>
      )}

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoryManager;