import { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/register/', form);
            navigate('/login');
        } catch (err) {
            console.error(err);
            if (err.response?.data) {
                // Manejar errores del backend
                const errors = err.response.data;
                let errorMsg = '';

                if (typeof errors === 'object') {
                    // Unir todos los mensajes de error
                    errorMsg = Object.entries(errors)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
                        .join('\n');
                } else {
                    errorMsg = errors.detail || 'Error al registrarse';
                }

                setError(errorMsg);
            } else {
                setError('No se pudo conectar al servidor');
            }
        }
    };
    return (
        <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Crear cuenta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="username"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                    required
                />
                <input
                    name="phone"
                    placeholder="Teléfono"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />
                <input
                    name="address"
                    placeholder="Dirección"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full border rounded p-3"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded">
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Register;
